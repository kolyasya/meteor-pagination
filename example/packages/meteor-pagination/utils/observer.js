import { getPublishPaginatedLogger } from './getPublishPaginatedLogger';

// observe callback function
export const observer = function ({
  subscription,
  customCollectionName,
  page,
  addedObserverTransformer,
  changedObserverTransformer,
  removedObserverTransformer,
}) {
  const logger = getPublishPaginatedLogger();

  return {
    added: (_id, fields) => {
      logger(`Observer added: ${_id}`);
      const finalFields =
        typeof addedObserverTransformer === 'function'
          ? addedObserverTransformer({
              fields,
              _id,
              subscription,
              eventType: 'added',
            })
          : fields;

      // For published documents we insert an object with pagination data
      // At the moment it is only a page number
      if (!finalFields?.hasOwnProperty('meteorPagination')) {
        finalFields.meteorPagination = {
          page,
        };
      }

      subscription.added(customCollectionName, _id, finalFields);
    },
    changed: (_id, fields) => {
      logger(`Observer changed: ${_id}`);
      const finalFields =
        typeof changedObserverTransformer === 'function'
          ? changedObserverTransformer({
              fields,
              _id,
              subscription,
              eventType: 'changed',
            })
          : fields;

      subscription.changed(customCollectionName, _id, finalFields);
    },
    removed: (_id) => {
      logger(`Observer removed: ${_id}`);
      if (typeof removedObserverTransformer === 'function') {
        removedObserverTransformer({ _id, subscription, eventType: 'removed' });
      }
      subscription.removed(customCollectionName, _id);
    },
  };
};
