import { publishCount } from 'meteor/tmeasday:publish-counts';

import observer from './observer';

import handleKeepPreloaded from './handleKeepPreloaded';

export function publishPaginated({
  name,
  collection,
  customCollectionName,
  countsCollectionName,
  getAdditionalFields,
  keepPreloaded = true,
  // Default functions may be overwritten
  getSelector = selector => selector,
  getOptions = options => options,
}) {
  return Meteor.publish(name, function (params) {
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
        options, params
      });
    }

    // console.log(options);

    // ???
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
    publishCount(this, countsName, countCursor);
    const page = Math.round(skip / limit) + 1;

    const handle = cursor.observeChanges(
      observer({
        self: this,
        customCollectionName,
        getAdditionalFields,
        page,
      }),
    );

    this.onStop(() => handle.stop());

    return this.ready();
  });
}
