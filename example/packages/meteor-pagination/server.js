import { publishCount } from 'meteor/tmeasday:publish-counts';

import observer from './observer';
import onlyPageHasChanged from './onlyPageHasChanged';

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
  let previousSkip = 0;
  let previousLimit = 0;

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

    // If user just selected another page
    const isOnlyPageChanged = onlyPageHasChanged(params);

    const options = getOptions(params) || {};

    if (limit) options.limit = limit;
    if (sort) options.sort = sort;
    if (skip) options.skip = skip;
    if (fields) options.fields = fields;

    // In this case we change skip and limit in a such way to only add new page to client
    // not premove previously sended documents
    if (keepPreloaded && isOnlyPageChanged) {
      options.skip = previousSkip;
      options.limit = previousLimit + skip - previousSkip;
    }

    // ???
    if (transform) options.transform = transform;
    if (typeof reactive !== 'undefined') options.reactive = reactive;

    const selector = getSelector(filters);

    // console.log('Paginated publication', {
    //   selector, options
    // });

    const cursor = collection.find(selector, options);

    const countsName = countsCollectionName || name + '.count';

    const countCursor = collection.find(selector, { ...options, limit: 0, fields: { _id: 1 } });
    publishCount(this, countsName, countCursor);
    const totalPages = Math.ceil(countCursor.count() / limit);
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
