import getPublishPaginatedLogger from './getPublishPaginatedLogger';

// observe callback function
const observer = function ({
  subscription,
  customCollectionName,
  page,
  addedObserverTransformer,
  changedObserverTransformer,
  removedObserverTransformer,
}) {
  const logger = getPublishPaginatedLogger();

  return {
    added: async (_id, fields) => {
      logger(`Observer added: ${_id}`);
      const finalFields =
        typeof addedObserverTransformer === 'function'
          ? await addedObserverTransformer({
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
    changed: async (_id, fields) => {
      logger(`Observer changed: ${_id}`);
      const finalFields =
        typeof changedObserverTransformer === 'function'
          ? await changedObserverTransformer({
              fields,
              _id,
              subscription,
              eventType: 'changed',
            })
          : fields;

      subscription.changed(customCollectionName, _id, finalFields);
    },
    removed: async (_id) => {
      logger(`Observer removed: ${_id}`);
      if (typeof removedObserverTransformer === 'function') {
        await removedObserverTransformer({ _id, subscription, eventType: 'removed' });
      }
      subscription.removed(customCollectionName, _id);
    },
  };
};

export default observer;
