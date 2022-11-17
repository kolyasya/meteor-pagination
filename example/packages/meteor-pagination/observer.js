// observe callback function

const observer = function ({
  subscription,
  customCollectionName,
  page,
  addedObserverTransformer,
  changedObserverTransformer,
  removedObserverTransformer,
}) {
  return {
    added: (_id, fields) => {
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
    removed: _id => {
      if (typeof removedObserverTransformer === 'function') {
        removedObserverTransformer({ _id, subscription, eventType: 'removed' });
      }
      subscription.removed(customCollectionName, _id);
    },
  };
};

export default observer;
