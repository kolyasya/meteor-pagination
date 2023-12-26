import { Meteor } from 'meteor/meteor';
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import { publishCount } from 'meteor/kolyasya:publish-counts';

import defaults from 'lodash.defaults';

import { observer } from './utils/observer';

import { getSubscriptionParams } from './utils/getSubscriptionParams';
import { getCursorOptions } from './utils/getCursorOptions';

import { PackageLogger, checkUnsupportedParams } from './package-utils';

checkNpmVersions(
  {
    'lodash.defaults': '4.2.x',
    'lodash.pullall': '4.2.x'
  },
  'kolyasya:meteor-pagination'
);

console.log('TODO: Update Readme.md to install deps');

/** @type {import('./types').PublishPaginatedParams} */
const defaultPaginationParams = {
  enableLogging: false,

  name: undefined,
  collection: undefined,
  customCollectionName: undefined,
  countsCollectionName: undefined,

  transformCursorSelector: undefined,
  transformCursorOptions: undefined,

  addedObserverTransformer: undefined,
  changedObserverTransformer: undefined,
  removedObserverTransformer: undefined,

  // Defines how many documents will be counted reactively
  // Because Counts package may be slow on huge amounts of data
  reactiveCountLimit: 1000,
  publishCountsOptions: {
    // 10 seconds by default
    pullingInterval: 10 * 1000,
    noReady: true
  },

  keepPreloaded: false
};

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
    _paginationParams.hasOwnProperty('reactiveCountLimit') &&
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
        'Meteor-pagination: you are passing params, which are not supported by the package settings'
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

    logger.log(`Page ${page}, results number: ${cursor.count()}`);

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
