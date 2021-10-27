import { publishCount } from 'meteor/tmeasday:publish-counts';

import observer from './observer';
import handleKeepPreloaded from './handleKeepPreloaded';

/**
 * @param {Object} params
 * @param {string} params.name Meteor publication name
 * @param {Object} params.collection Meteor Mongo collection instance
 * @param {string} params.customCollectionName
 * @param {string} params.countsCollectionName
 * @param {boolean} [params.keepPreloaded=true]
 * @param {function: void} [params.getSelector]
 * @param {function: void} [params.getOptions]
 * @param {function: void} [params.addedObserverTransformer]
 * @param {function: void} [params.changedObserverTransformer]
 * @param {function: void} [params.removedObserverTransformer]
 * @return {function: void}
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

  getAdditionalFields,
}) {
  if (getAdditionalFields) {
    throw new Meteor.Error(
      'Usage of getAdditionalFields in kolyasya:meteor-pagination is deprecated. Replace the method with addedObserverTransformer, changedObserverTransformer or removedObserverTransformer'
    );
  }

  return Meteor.publish(name, function (params) {
    // Save into subscription variable
    // to make it easier to understand code below
    const subscription = this;

    const {
      limit,
      sort = false,
      skip = false,
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
      params.page = '1';
    }

    // console.log('');
    // console.log('');
    // console.log('PAGINATED PUBLICATION');
    // console.log('');

    let options = getOptions(params) || {};

    if (limit) {
      options.limit = limit;
    }
    if (sort) {
      options.sort = sort;
    }
    if (skip) {
      options.skip = skip;
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

    const cursor = collection.find(selector, options);

    const countsName = countsCollectionName || name + '.count';

    const countCursor = collection.find(selector, { ...options, limit: 0, fields: { _id: 1 } });

    publishCount(subscription, countsName, countCursor);
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
