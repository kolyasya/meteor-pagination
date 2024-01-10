import { Meteor } from 'meteor/meteor';
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import { publishCount } from 'meteor/kolyasya:publish-counts';

import defaults from 'lodash.defaults';

import { observer } from './utils/observer';

import { getSubscriptionParams } from './utils/getSubscriptionParams';
import { getCursorOptions } from './utils/getCursorOptions';
import { defaultPaginationParams } from './utils/defaultParams';

import { PackageLogger, checkUnsupportedParams } from './package-utils';

// We don't use Npm.depends to prevent possible second copy of a popular npm package
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

  if (!_paginationParams?.name) {
    throw new Meteor.Error(
      '500',
      'kolyasya:meteor-pagination: "name" param is required for publishPaginated function'
    );
  }

  if (!_paginationParams?.collection) {
    throw new Meteor.Error(
      '500',
      'kolyasya:meteor-pagination: "collection" param is required for publishPaginated function'
    );
  }

  if (!_paginationParams?.customCollectionName) {
    throw new Meteor.Error(
      '500',
      'kolyasya:meteor-pagination: "customCollectionName" param is required for publishPaginated function'
    );
  }

  if (
    Object.prototype.hasOwnProperty.call(
      _paginationParams,
      'reactiveCountLimit'
    ) &&
    !isNaN(_paginationParams.reactiveCountLimit) &&
    _paginationParams.reactiveCountLimit < 0
  ) {
    throw new Meteor.Error(
      '500',
      'kolyasya:meteor-pagination: "reactiveCountLimit" param must be > 0'
    );
  }

  checkUnsupportedParams({
    params: _paginationParams,
    defaultParams: defaultPaginationParams,
    logger,
    onUnsupportedParams: ({ unsupportedParams }) => {
      logger.warn(
        'You are passing params, which are not supported by the package settings'
      );
      logger.warn('Unsupported params:', unsupportedParams);
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
        changedObserverTransformer: paginationParams.changedObserverTransformer,
        removedObserverTransformer: paginationParams.removedObserverTransformer
      })
    );

    subscription.onStop(() => handle.stop());

    return subscription.ready();
  });
}
