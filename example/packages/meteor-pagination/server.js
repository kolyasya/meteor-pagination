import { Meteor } from 'meteor/meteor';
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import { publishCount } from 'meteor/kolyasya:publish-counts';

import defaults from 'lodash.defaults';

import { observer } from './utils/observer';

import { defaultPaginationParams } from './utils/defaultParams';
import { getSubscriptionParams } from './utils/getSubscriptionParams';
import { getCursorOptions } from './utils/getCursorOptions';
import { validatePaginationParams } from './utils/validatePaginationParams';

import { PackageLogger, checkUnsupportedParams } from './package-utils';

// We don't use Npm.depends to prevent possible second copy of a popular npm packages
checkNpmVersions(
  {
    'lodash.defaults': '4.2.x',
    'lodash.pullall': '4.2.x'
  },
  'kolyasya:meteor-pagination'
);

/** @type {import('./types').publishPaginated} */
export function publishPaginated (_paginationParams) {
  const logger = PackageLogger({
    enableLogging:
      _paginationParams?.enableLogging ||
      defaultPaginationParams?.enableLogging,
    logPrefix: `Publish Paginated | ${_paginationParams.name} |`
  });

  validatePaginationParams({ params: _paginationParams });

  checkUnsupportedParams({
    params: _paginationParams,
    defaultParams: defaultPaginationParams,
    logger,
    onUnsupportedParams: ({ unsupportedParams }) => {
      logger.warn(
        'You are passing params, which are not supported by the package settings\n',
        'Unsupported params:',
        unsupportedParams
      );
    }
  });

  // Merge default params with user provided ones
  const paginationParams = defaults(_paginationParams, defaultPaginationParams);

  return Meteor.publish(paginationParams.name, function (_subscriptionParams) {
    // Save into subscription variable
    // It makes it easier to understand the code below
    const subscription = this;

    const subscriptionParams = getSubscriptionParams(_subscriptionParams);

    const cursorOptions = getCursorOptions({
      paginationParams,
      subscriptionParams
    });

    const selector =
      typeof paginationParams?.transformCursorSelector === 'function'
        ? paginationParams.transformCursorSelector({
          subscriptionParams,
          paginationParams
        })
        : subscriptionParams.cursorSelector;

    logger.log(
      `Cursor:\nselector:\n${JSON.stringify(
        selector,
        null,
        2
      )}\noptions:\n${JSON.stringify(cursorOptions, null, 2)}`
    );
    const cursor = paginationParams.collection.find(selector, cursorOptions);

    const countsName =
      paginationParams.countsCollectionName || paginationParams.name + '.count';

    const countCursor = paginationParams.collection.find(selector, {
      limit: undefined,
      fields: { _id: 1 }
    });

    const currentCount = countCursor.count();

    if (currentCount < paginationParams.reactiveCountLimit) {
      delete paginationParams.publishCountsOptions.pullingInterval;
    }

    publishCount(
      subscription,
      countsName,
      countCursor,
      paginationParams.publishCountsOptions
    );

    // Will be inserted into published documents like:
    // [{ ...documentFields, meteorPagination: { page: 1 } }]
    const page =
      Math.round(subscriptionParams.skip / subscriptionParams.limit) + 1;

    logger.log(`Page ${page}, results count: ${cursor.count()}`);

    logger.log('Starting observeChanges...');

    const handle = cursor.observeChanges(
      observer({
        subscription,
        page,
        customCollectionName: paginationParams.customCollectionName,
        addedObserverTransformer: paginationParams.addedObserverTransformer,
        addedObserverTransformerAsync: paginationParams.addedObserverTransformerAsync,
        changedObserverTransformer: paginationParams.changedObserverTransformer,
        changedObserverTransformerAsync: paginationParams.changedObserverTransformerAsync,
        removedObserverTransformer: paginationParams.removedObserverTransformer,
        removedObserverTransformerAsync: paginationParams.removedObserverTransformerAsync
      })
    );

    subscription.onStop(() => handle.stop());

    return subscription.ready();
  });
}
