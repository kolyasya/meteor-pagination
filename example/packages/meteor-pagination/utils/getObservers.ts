import { PackageLogger } from '../package-utils';

import type { GetObserversParams } from '../types';

export const getObservers = function ({
  subscription,
  customCollectionName,
  page,

  cachedData,

  addedObserverTransformer,
  addedObserverTransformerAsync,

  changedObserverTransformer,
  changedObserverTransformerAsync,

  removedObserverTransformer,
  removedObserverTransformerAsync,
}: GetObserversParams) {
  const logger = PackageLogger();

  if (
    typeof addedObserverTransformerAsync === 'function' ||
    typeof changedObserverTransformerAsync === 'function' ||
    typeof removedObserverTransformerAsync === 'function'
  ) {
    return {
      added: async (_id, fields) => {
        logger.log(`Observer → added: ${_id}`);
        const finalFields =
          typeof addedObserverTransformerAsync === 'function'
            ? await addedObserverTransformerAsync.bind(this)({
              fields,
              _id,
              subscription,
              eventType: 'added',
              cachedData,
            })
            : fields;

        // For published documents we insert an object with pagination data
        // At the moment it is only a page number
        if (
          !Object.prototype.hasOwnProperty.call(finalFields, 'meteorPagination')
        ) {
          finalFields.meteorPagination = {
            page,
          };
        }

        subscription.added(customCollectionName, _id, finalFields);
      },
      changed: async (_id, fields) => {
        logger.log(`Observer → changed: ${_id}`);
        const finalFields =
          typeof changedObserverTransformerAsync === 'function'
            ? await changedObserverTransformerAsync.bind(this)({
              fields,
              _id,
              subscription,
              eventType: 'changed',
              cachedData,
            })
            : fields;

        subscription.changed(customCollectionName, _id, finalFields);
      },
      removed: async _id => {
        logger.log(`Observer → removed: ${_id}`);
        if (typeof removedObserverTransformerAsync === 'function') {
          await removedObserverTransformerAsync.bind(this)({
            _id,
            subscription,
            eventType: 'removed',
            cachedData,
          });
        }
        subscription.removed(customCollectionName, _id);
      },
    };
  }
  else {
    return {
      added: (_id, fields) => {
        logger.log(`Observer → added: ${_id}`);
        const finalFields =
          typeof addedObserverTransformer === 'function'
            ? addedObserverTransformer.bind(this)({
              fields,
              _id,
              subscription,
              eventType: 'added',
              cachedData,
            })
            : fields;

        // For published documents we insert an object with pagination data
        // At the moment it is only a page number
        if (
          !Object.prototype.hasOwnProperty.call(finalFields, 'meteorPagination')
        ) {
          finalFields.meteorPagination = {
            page,
          };
        }

        subscription.added(customCollectionName, _id, finalFields);
      },
      changed: (_id, fields) => {
        logger.log(`Observer → changed: ${_id}`);
        const finalFields =
          typeof changedObserverTransformer === 'function'
            ? changedObserverTransformer.bind(this)({
              fields,
              _id,
              subscription,
              eventType: 'changed',
              cachedData,
            })
            : fields;

        subscription.changed(customCollectionName, _id, finalFields);
      },
      removed: _id => {
        logger.log(`Observer → removed: ${_id}`);
        if (typeof removedObserverTransformer === 'function') {
          removedObserverTransformer.bind(this)({
            _id,
            subscription,
            eventType: 'removed',
            cachedData,
          });
        }
        subscription.removed(customCollectionName, _id);
      },
    };
  }
};
