import { publishCount } from "meteor/btafel:publish-counts";
import defaults from "lodash.defaults";

import observer from "./observer";

import getSubscriptionParams from "./getSubscriptionParams";
import getCursorOptions from "./getCursorOptions";
import checkUnsupportedParams from "./checkUnsupportedParams";

const defaultPaginationParams = {
  name: undefined,
  collection: undefined,
  customCollectionName: undefined,
  countsCollectionName: undefined,
  keepPreloaded: false,

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
  },

  getAdditionalFields: undefined,
};

/**
 * @param {Object} paginationParams
 * @param {string} paginationParams.name Meteor publication name
 * @param {Object} paginationParams.collection Meteor Mongo collection instance
 * @param {string} paginationParams.customCollectionName
 * @param {string} paginationParams.countsCollectionName
 *
 * @param {boolean} [paginationParams.keepPreloaded = true]
 *
 * @param {function} [paginationParams.transformCursorSelector]
 * @param {function} [paginationParams.transformCursorOptions]
 *
 * @param {function} [paginationParams.addedObserverTransformer]
 * @param {function} [paginationParams.changedObserverTransformer]
 * @param {function} [paginationParams.removedObserverTransformer]
 *
 * @param {number} [paginationParams.reactiveCountLimit] A number of documents when reactive count will be changed to periodical request. Use it to fix perfomance
 * @param {Object} [paginationParams.publishCountsOptions] options to pass to btafel:publish-counts
 * @param {Object} [paginationParams.publishCountsOptions.pullingInterval]
 *
 * @return {function}
 */
export function publishPaginated(_paginationParams = {}) {
  checkUnsupportedParams({
    params: _paginationParams,
    defaultParams: defaultPaginationParams,
    onUnsupportedParams: ({ unsupportedParams }) => {
      console.warn(
        "Meteor-pagination: you are passing params, which are not supported by the package settings"
      );
      console.log("Unsupported params:", unsupportedParams);
    },
  });

  const paginationParams = defaults(_paginationParams, defaultPaginationParams);

  if (paginationParams.getAdditionalFields) {
    throw new Meteor.Error(
      "Usage of getAdditionalFields in kolyasya:meteor-pagination is deprecated. Replace the method with addedObserverTransformer, changedObserverTransformer or removedObserverTransformer"
    );
  }

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
      typeof transformCursorSelector === "function"
        ? paginationParams.transformCursorSelector({
            subscriptionParams,
            paginationParams,
          })
        : subscriptionParams.cursorSelector;


    console.log({ selector })
    console.log({ cursorOptions })

    const cursor = paginationParams.collection.find(selector, cursorOptions);

    const countsName =
      paginationParams.countsCollectionName || paginationParams.name + ".count";

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

    const page =
      Math.round(subscriptionParams.skip / subscriptionParams.limit) + 1;

    const handle = cursor.observeChanges(
      observer({
        subscription,
        customCollectionName: paginationParams.customCollectionName,
        page,
        addedObserverTransformer: paginationParams.addedObserverTransformer,
        changedObserverTransformer: paginationParams.changedObserverTransformer,
        removedObserverTransformer: paginationParams.removedObserverTransformer,
      })
    );

    subscription.onStop(() => handle.stop());

    return subscription.ready();
  });
}
