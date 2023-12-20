/// <reference path="./types.d.ts" />

import { publishCount } from 'meteor/btafel:publish-counts';
import defaults from 'lodash.defaults';

import { observer } from './utils/observer';

import { getSubscriptionParams } from './utils/getSubscriptionParams';
import { getCursorOptions } from './utils/getCursorOptions';

import { PackageLogger, checkUnsupportedParams } from './package-utils';

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
    noReady: true,
  },

  keepPreloaded: false,
};

/**
 * @param {Object} paginationParams
 *
 * @param {boolean} paginationParams.enableLogging Logs for publication functions
 * @param {string} paginationParams.name Meteor publication name
 * @param {Object} paginationParams.collection Meteor Mongo collection instance
 * @param {string} paginationParams.customCollectionName Name of client-side collection to publish results to ex. "documents.paginated"
 *
 * @param {string} [paginationParams.countsCollectionName]
 *
 *
 * @param {function} [paginationParams.transformCursorSelector] Function to change mongo cursor selector on the fly
 * @param {function} [paginationParams.transformCursorOptions] Function to change mongo cursor options on the fly
 *
 * For better understanding of this part check Meteor observeChanges documentation
 * @param {function} [paginationParams.addedObserverTransformer] Function to transform document on "added" event
 * @param {function} [paginationParams.changedObserverTransformer] Function to transform document on "changed" event
 * @param {function} [paginationParams.removedObserverTransformer] Function to transform document on "removed" event
 *
 * @param {number} [paginationParams.reactiveCountLimit] A number of documents when reactive count will be changed to periodical request. Use it to fix perfomance
 * @param {Object} [paginationParams.publishCountsOptions] options to pass to btafel:publish-counts
 * @param {Object} [paginationParams.publishCountsOptions.pullingInterval]
 *
 * This is not implemented at the moment
 * @param {boolean} [paginationParams.keepPreloaded = false]
 *
 * @return {function}
 */
export function publishPaginated(_paginationParams = {}) {
  const logger = PackageLogger({
    enableLogging:
      _paginationParams?.enableLogging ||
      defaultPaginationParams?.enableLogging,
    logPrefix: `Publish Paginated | ${_paginationParams.name} |`,
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

  checkUnsupportedParams({
    params: _paginationParams,
    defaultParams: defaultPaginationParams,
    logger,
    onUnsupportedParams: ({ unsupportedParams }) => {
      logger.warn(
        'Meteor-pagination: you are passing params, which are not supported by the package settings'
      );
      logger.warn('Unsupported params:', unsupportedParams);
    },
  });

  const paginationParams = defaults(_paginationParams, defaultPaginationParams);

  if (paginationParams.reactiveCountLimit < 0) {
    throw new Meteor.Error(`reactiveCountLimit option must be > 0`);
  }

  return Meteor.publish(paginationParams.name, function (_subscriptionParams) {
    // Save into subscription variable
    // to make it easier to understand code below
    const subscription = this;

    const subscriptionParams = getSubscriptionParams(_subscriptionParams);

    const cursorOptions = getCursorOptions({
      paginationParams,
      subscriptionParams,
    });

    const selector =
      typeof paginationParams?.transformCursorSelector === 'function'
        ? paginationParams.transformCursorSelector({
            subscriptionParams,
            paginationParams,
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
      fields: { _id: 1 },
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
        removedObserverTransformer: paginationParams.removedObserverTransformer,
      })
    );

    subscription.onStop(() => handle.stop());

    return subscription.ready();
  });
}
