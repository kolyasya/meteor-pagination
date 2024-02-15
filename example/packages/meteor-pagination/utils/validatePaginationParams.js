import { Meteor } from 'meteor/meteor';

/** @type {import('../types').validatePaginationParams} */
export const validatePaginationParams = ({ params }) => {
  if (!params?.name) {
    throw new Meteor.Error(
      '500',
      'kolyasya:meteor-pagination: "name" param is required for publishPaginated function'
    );
  }

  if (!params?.collection) {
    throw new Meteor.Error(
      '500',
      'kolyasya:meteor-pagination: "collection" param is required for publishPaginated function'
    );
  }

  if (!params?.customCollectionName) {
    throw new Meteor.Error(
      '500',
      'kolyasya:meteor-pagination: "customCollectionName" param is required for publishPaginated function'
    );
  }

  if (
    Object.prototype.hasOwnProperty.call(params, 'reactiveCountLimit') &&
    !isNaN(params.reactiveCountLimit) &&
    params.reactiveCountLimit < 0
  ) {
    throw new Meteor.Error(
      '500',
      'kolyasya:meteor-pagination: "reactiveCountLimit" param must be > 0'
    );
  }

  const syncFunctions = {
    transformCursorSelector: 1,
    transformCursorOptions: 1,
    addedObserverTransformer: 1,
    changedObserverTransformer: 1,
    removedObserverTransformer: 1
  };

  const asyncFunctions = {
    transformCursorSelectorAsync: 1,
    transformCursorOptionsAsync: 1,
    addedObserverTransformerAsync: 1,
    changedObserverTransformerAsync: 1,
    removedObserverTransformerAsync: 1
  };

  const paramsKeys = Object.keys(params);

  paramsKeys.forEach((paramKeySync) => {
    const hasSyncFunc = syncFunctions[paramKeySync];

    if (hasSyncFunc) {
      paramsKeys.forEach((paramKeyAsync) => {
        const hasAsyncFunc = asyncFunctions[paramKeyAsync];

        if (hasAsyncFunc) {
          throw new Meteor.Error(
            500,
            `kolyasya:meteor-pagination: You can't mix sync and async functions. Please check params "${paramKeySync}" and "${paramKeyAsync}"`
          );
        }
      });
    }
  });
};
