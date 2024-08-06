import defaults from 'lodash.defaults';

import { PackageLogger, checkUnsupportedParams } from '../package-utils';

export const getSubscriptionParams = (subscriptionParams = {}) => {
  const logger = PackageLogger();

  logger.log('Getting subscription params...');

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
    readPreference: undefined
  };

  checkUnsupportedParams({
    params: subscriptionParams,
    defaultParams,
    logger,
    onUnsupportedParams: ({ unsupportedParams }) => {
      logger.warn(
        'You are passing subscription params, which are not supported by the package. Check Meteor.Collection.find arguments in Meteor Docs'
      );
      logger.warn('Unsupported params:', unsupportedParams);
    }
  });

  // Merge default params with passed ones
  const finalParams = defaults(subscriptionParams, defaultParams);

  logger.log(
    'Got subscription params:\n',
    JSON.stringify(finalParams, undefined, 2)
  );

  return finalParams;
};
