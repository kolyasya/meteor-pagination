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

      if (!finalFields?.hasOwnProperty('pagination')) {
        finalFields.pagination = {
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
