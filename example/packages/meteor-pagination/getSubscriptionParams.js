import defaults from 'lodash.defaults';

import checkUnsupportedParams from './checkUnsupportedParams';

import getPublishPaginatedLogger from './getPublishPaginatedLogger';

const getSubscriptionParams = (subscriptionParams = {}) => {
  const logger = getPublishPaginatedLogger();

  logger('Getting subscription params...');

  const defaultParams = {
    limit: 10,
    sort: false,
    skip: 0,
    cursorSelector: {},
    page: 1,

    // From
    // https://docs.meteor.com/api/collections.html#Mongo-Collection-find
    reactive: true,
    fields: { _id: 1 },
    transform: undefined,
    disableOplog: false,
    pollingIntervalMs: 10000,
    pollingThrottleMs: 10000,
    maxTimeMs: undefined,
    hint: undefined,
    readPreference: undefined,
  };

  checkUnsupportedParams({
    params: subscriptionParams,
    defaultParams,
    onUnsupportedParams: ({ unsupportedParams }) => {
      console.warn(
        'Meteor-pagination: you are passing params, which are not supported by the package, probably need to move them to "cursorSelector"'
      );
      console.warn('Unsupported params:', unsupportedParams);
    },
  });

  // Merge default params with passed ones
  const finalParams = defaults(subscriptionParams, defaultParams);

  // console.dir(finalParams, { depth: null });

  logger('Got subscription params:\n', JSON.stringify(finalParams, null, 2));

  return finalParams;
};

export default getSubscriptionParams;
