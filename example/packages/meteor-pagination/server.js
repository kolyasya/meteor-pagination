import { publishCount } from 'meteor/tmeasday:publish-counts';

export function publishPaginated({
  name,
  collection,
  customCollectionName,
  countsCollectionName,
  getAdditionalFields,
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

    const options = getOptions(params) || {};

    if (limit) options.limit = limit;
    if (sort) options.sort = sort;
    if (skip) options.skip = skip;
    if (fields) options.fields = fields;

    // ???
    if (transform) options.transform = transform;
    if (typeof reactive !== 'undefined') options.reactive = reactive;

    const selector = getSelector(filters);

    const cursor = collection.find(selector, options);

    const countsName = countsCollectionName || name + '.count';

    publishCount(this, countsName, collection.find(selector, { ...options, limit: 0, fields: { _id: 1 } }));

    // observe callback function
    const observer = self => {
      return {
        added: fields => {
          let finalFields = fields;
          if (getAdditionalFields) {
            finalFields = getAdditionalFields(fields);
          }
          self.added(customCollectionName, fields._id, finalFields);
        },
        changed: fields => {
          let finalFields = fields;
          if (getAdditionalFields) {
            finalFields = getAdditionalFields(fields);
          }
          self.changed(customCollectionName, fields._id, finalFields);
        },
        removed: fields => {
          self.removed(customCollectionName, fields._id);
        },
      };
    };

    const handle = cursor.observe(observer(this));

    this.onStop(() => handle.stop());

    return this.ready();
  });
}