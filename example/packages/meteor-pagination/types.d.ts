import { Mongo } from 'meteor/mongo';
import type { Subscription } from 'meteor/meteor';

interface TransformSelectorParams {
  subscriptionParams: object;
  paginationParams: object;
}

export type PublishPaginatedParams = {
  /** Logs for publication functions */
  enableLogging?: boolean;
  /** Meteor publication name */
  name: string;
  /** Meteor Mongo collection instance */
  collection: Mongo.Collection<object, object>;
  /** Name of client-side collection to publish results to ex. "documents.paginated" */
  customCollectionName: string;
  /** Name of the client mini Mongo collection used to publish counts on a client ex. "documents.paginated.count" */
  countsCollectionName?: string;

  /** Returns the same data for each subscription to reduce number of DB calls */
  getCachedData: ({
    cursor,
  }: {
    cursor: Mongo.Cursor<object, object>;
  }) => Promise<unknown>;

  /** Function to change Mongo cursor selector on the fly */
  transformCursorSelector?: (params: TransformSelectorParams) => object;
  /** Async version of a function to change Mongo cursor selector on the fly */
  transformCursorSelectorAsync?: (params: TransformSelectorParams) => object;

  /** Function to change Mongo cursor options on the fly */
  transformCursorOptions?: () => void;
  /** Async version of a function to change Mongo cursor options on the fly */
  transformCursorOptionsAsync?: () => void;

  /** For better understanding of this part check Meteor observeChanges documentation */

  /** Function to transform document on "added" event */
  addedObserverTransformer?: () => void;
  /** Async version of a function to transform document on "added" event */
  addedObserverTransformerAsync?: () => void;

  /** Function to transform document on "changed" event */
  changedObserverTransformer?: () => void;
  /** Async version of a function to transform document on "changed" event */
  changedObserverTransformerAsync?: () => void;

  /** Function to transform document on "removed" event */
  removedObserverTransformer?: () => void;
  /** Async version of a function to transform document on "removed" event */
  removedObserverTransformerAsync?: () => void;

  /** A number of documents when reactive count will be changed to periodical request. Use it to fix perfomance */
  reactiveCountLimit?: number;

  /** Options to pass to kolyasya:publish-counts */
  publishCountsOptions?: {
    pullingInterval?: number;
    noReady?: boolean;
  };

  /** This is not implemented at the moment */
  // keepPreloaded?: boolean;
};

export type TransformerParams<T extends 'added' | 'changed' | 'removed'> = {
  fields?: object;
  _id: string;
  subscription: object;
  eventType: T;
  cachedData?: unknown;
};

export type GetObserversParams = {
  subscription: Subscription;
  customCollectionName: string;
  page: number;

  cachedData?: unknown;

  addedObserverTransformer?: (params: TransformerParams<'added'>) => void;
  addedObserverTransformerAsync?: (params: TransformerParams<'added'>) => void;

  changedObserverTransformer?: (params: TransformerParams<'changed'>) => void;
  changedObserverTransformerAsync?: (
    params: TransformerParams<'changed'>
  ) => void;

  removedObserverTransformer?: (params: TransformerParams<'removed'>) => void;
  removedObserverTransformerAsync?: (
    params: TransformerParams<'removed'>
  ) => void;
};
