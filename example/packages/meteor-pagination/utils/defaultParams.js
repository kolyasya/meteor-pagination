/** @type {import('../types').PublishPaginatedParams} */
export const defaultPaginationParams = {
  enableLogging: false,

  collection: undefined,
  name: undefined,
  customCollectionName: undefined,
  countsCollectionName: undefined,

  transformCursorSelector: undefined,
  transformCursorSelectorAsync: undefined,

  transformCursorOptions: undefined,
  transformCursorOptionsAsync: undefined,

  addedObserverTransformer: undefined,
  addedObserverTransformerAsync: undefined,

  changedObserverTransformer: undefined,
  changedObserverTransformerAsync: undefined,

  removedObserverTransformer: undefined,
  removedObserverTransformerAsync: undefined,

  // Defines how many documents will be counted reactively
  // Because Counts package may be slow on huge amounts of data
  reactiveCountLimit: 1000,
  publishCountsOptions: {
    // 10 seconds by default
    pullingInterval: 10 * 1000,
    noReady: true
  },

  keepPreloaded: false
};
