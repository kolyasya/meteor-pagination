/** @type {import('../types').PublishPaginatedParams} */
export const defaultPaginationParams = {
  enableLogging: false,

  collection: undefined,
  name: undefined,
  customCollectionName: undefined,
  countsCollectionName: undefined,

  transformCursorSelector: undefined,
  transformCursorOptions: undefined,

  addedObserverTransformer: undefined,
  changedObserverTransformer: undefined,
  removedObserverTransformer: undefined,

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