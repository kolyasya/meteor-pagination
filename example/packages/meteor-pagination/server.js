import { publishCount } from 'meteor/btafel:publish-counts';

import observer from './observer';
import handleKeepPreloaded from './handleKeepPreloaded';

/**
 * @param {Object} params
 * @param {string} params.name Meteor publication name
 * @param {Object} params.collection Meteor Mongo collection instance
 * @param {string} params.customCollectionName
 * @param {string} params.countsCollectionName
 *
 * @param {boolean} [params.keepPreloaded=true]
 *
 * @param {function} [params.getSelector]
 * @param {function} [params.getOptions]
 *
 * @param {function} [params.addedObserverTransformer]
 * @param {function} [params.changedObserverTransformer]
 * @param {function} [params.removedObserverTransformer]
 *
 * @param {number} [params.reactiveCountLimit] A number of documents when reactive count will be changed to periodical request. Use it to fix perfomance
 * @param {Object} [params.publishCountsOptions] options to pass to btafel:publish-counts
 * @param {Object} [params.publishCountsOptions.pullingInterval] 
 *
 * @return {function}
 */
export function publishPaginated({
  name,
  collection,
  customCollectionName,
  countsCollectionName,
  keepPreloaded = false,
  // Default functions may be overwritten
  getSelector = selector => selector,
  getOptions = options => options,

  addedObserverTransformer,
  changedObserverTransformer,
  removedObserverTransformer,

  reactiveCountLimit = 1000,
  publishCountsOptions = {
    // 10 seconds by default
    pullingInterval: 10 * 1000
  },

  getAdditionalFields,
}) {
  if (getAdditionalFields) {
    throw new Meteor.Error(
      'Usage of getAdditionalFields in kolyasya:meteor-pagination is deprecated. Replace the method with addedObserverTransformer, changedObserverTransformer or removedObserverTransformer'
    );
  }

  if (reactiveCountLimit < 0) {
    throw new Meteor.Error(`reactiveCountLimit option must be > 0`);
  }

  return Meteor.publish(name, function (params) {
    // Save into subscription variable
    // to make it easier to understand code below
    const subscription = this;

    const {
      limit = 10,
      sort = false,
      skip = 0,
      reactive,
      fields,
      transform,
      disableOplog,
      pollingIntervalMs,
      pollingThrottleMs,
      maxTimeMs,
      hint,
      ...filters
    } = params || {};

    if (!params.page) {
      params.page = 1;
    }

    // console.log('');
    // console.log('');
    // console.log('PAGINATED PUBLICATION');
    // console.log('');

    let options = getOptions(params) || {};

    if (limit >= 0) {
      options.limit = limit;
    }
    if (skip >= 0) {
      options.skip = skip;
    }
    if (sort) {
      options.sort = sort;
    }
    if (fields) {
      options.fields = fields;
    }

    if (keepPreloaded) {
      options = handleKeepPreloaded({
        options,
        params,
      });
    }

    if (transform) {
      options.transform = transform;
    }
    if (typeof reactive !== 'undefined') {
      options.reactive = reactive;
    }

    const selector = getSelector(filters);

    const cursor = collection.find(selector, {
      ...options,
    });

    const countsName = countsCollectionName || name + '.count';

    const countCursor = collection.find(selector, {
      ...options,
      limit: 0,
      fields: { _id: 1 },
    });

    const currentCount = countCursor.count();

    if (currentCount < reactiveCountLimit) {
      delete publishCountsOptions.pullingInterval;
    }

    publishCount(subscription, countsName, countCursor, publishCountsOptions);

    const page = Math.round(skip / limit) + 1;

    const handle = cursor.observeChanges(
      observer({
        subscription,
        customCollectionName,
        page,
        addedObserverTransformer,
        changedObserverTransformer,
        removedObserverTransformer,
      })
    );

    subscription.onStop(() => handle.stop());

    return subscription.ready();
  });
}
