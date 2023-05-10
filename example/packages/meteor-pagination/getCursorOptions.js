import handleKeepPreloaded from './handleKeepPreloaded';
import getPublishPaginatedLogger from './getPublishPaginatedLogger';

const getCursorOptions = ({ paginationParams, subscriptionParams }) => {
  const logger = getPublishPaginatedLogger();
  let cursorOptions = {};

  if (subscriptionParams.limit >= 0) {
    cursorOptions.limit = subscriptionParams.limit;
  }

  if (subscriptionParams.skip >= 0) {
    cursorOptions.skip = subscriptionParams.skip;
  }

  if (subscriptionParams.sort) {
    cursorOptions.sort = subscriptionParams.sort;
  }

  if (subscriptionParams.fields) {
    cursorOptions.fields = subscriptionParams.fields;
  }

  if (subscriptionParams.keepPreloaded) {
    cursorOptions = handleKeepPreloaded({
      options,
      params: subscriptionParams,
    });
  }

  if (subscriptionParams.transform) {
    cursorOptions.transform = subscriptionParams.transform;
  }

  if (typeof subscriptionParams.reactive !== 'undefined') {
    cursorOptions.reactive = subscriptionParams.reactive;
  }

  if (typeof paginationParams.transformCursorOptions === 'function') {
    logger(
      'Transforming cursor options with custom functio (transformCursorOptions)...'
    );

    cursorOptions = paginationParams.transformCursorOptions({
      paginationParams,
      subscriptionParams,
      cursorOptions,
    });

    if (typeof cursorOptions !== 'object') {
      console.warn(
        `"transformCursorOptions" function should return object, which will be used as Mongo Cursor options param`
      );
    }
  }

  if (
    typeof cursorOptions.limit !== 'number' ||
    typeof cursorOptions.skip !== 'number'
  ) {
    console.warn(
      `Check cursor options limit: ${cursorOptions.limit} and skip: ${cursorOptions.skip} params. They should be numbers for pagination to work properly`
    );
  }

  return cursorOptions;
};

export default getCursorOptions;
