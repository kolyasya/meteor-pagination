import { PackageLogger } from '../package-utils';

// observe callback function
export const observer = function ({
  subscription,
  customCollectionName,
  page,
  addedObserverTransformer,
  addedObserverTransformerAsync,
  changedObserverTransformer,
  changedObserverTransformerAsync,
  removedObserverTransformer,
  removedObserverTransformerAsync
}) {
  const logger = PackageLogger();

  return {
    added: (_id, fields) => {
      logger.log(`Observer → added: ${_id}`);
      const finalFields =
        typeof addedObserverTransformer === 'function'
          ? addedObserverTransformer({
            fields,
            _id,
            subscription,
            eventType: 'added'
          })
          : fields;

      // For published documents we insert an object with pagination data
      // At the moment it is only a page number
      if (
        !Object.prototype.hasOwnProperty.call(finalFields, 'meteorPagination')
      ) {
        finalFields.meteorPagination = {
          page
        };
      }

      subscription.added(customCollectionName, _id, finalFields);
    },
    changed: (_id, fields) => {
      logger.log(`Observer → changed: ${_id}`);
      const finalFields =
        typeof changedObserverTransformer === 'function'
          ? changedObserverTransformer({
            fields,
            _id,
            subscription,
            eventType: 'changed'
          })
          : fields;

      subscription.changed(customCollectionName, _id, finalFields);
    },
    removed: (_id) => {
      logger.log(`Observer → removed: ${_id}`);
      if (typeof removedObserverTransformer === 'function') {
        removedObserverTransformer({ _id, subscription, eventType: 'removed' });
      }
      subscription.removed(customCollectionName, _id);
    }
  };
};
