import { Random } from 'meteor/random';

import './fixtures';
import { publishPaginated } from 'meteor/kolyasya:meteor-pagination';

import Posts from '../imports/api/posts';
import Users from '../imports/api/users';

import { asyncDelay } from './asyncDelay';

// Posts Paginated
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

// Users Paginated
publishPaginated({
  enableLogging: true,
  collection: Users,
  name: 'users.paginated',
  customCollectionName: 'users.paginated',
  countsCollectionName: 'users.paginated.count',
  addedObserverTransformerAsync: async ({ fields }) => {
    await asyncDelay(100);

    fields.content = 'users_test_' + Random.id();

    return fields;
  }
});
