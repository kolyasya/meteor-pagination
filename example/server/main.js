import { Random } from 'meteor/random';

import './fixtures';
import { publishPaginated } from 'meteor/kolyasya:meteor-pagination';

import Posts from '../imports/api/posts';

import { asyncDelay } from './asyncDelay';

publishPaginated({
  enableLogging: true,
  collection: Posts,
  name: 'posts.paginated',
  customCollectionName: 'posts.paginated',
  countsCollectionName: 'posts.paginated.count',
  // transformCursorSelector: () => {},
  // addedObserverTransformer: ({ fields }) => {
  //   fields.content = 'test_' + Random.id();
  //   return fields;
  // }
  addedObserverTransformerAsync: async ({ fields }) => {
    console.log('Delay #1');
    await asyncDelay(100);
    console.log('Delay #2');

    fields.content = 'test_' + Random.id();

    return fields;
  }
  // changedObserverTransformer: (fields) => {
  //   console.log(fields);
  // },
  // removedObserverTransformer: (fields) => {
  //   console.log(fields);
  // }
});
