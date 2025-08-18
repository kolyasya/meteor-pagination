import { Random } from 'meteor/random';
import { Meteor } from 'meteor/meteor';

import './fixtures';
import { publishPaginated } from 'meteor/kolyasya:meteor-pagination';

import Posts from '../imports/api/posts';
import Users from '../imports/api/users';

import { asyncDelay } from './asyncDelay';

Meteor.startup(async () => {
  const existingAdmin = await Users.findOneAsync({ username: 'admin' });

  if (!existingAdmin) {
    console.log('Creating user: admin / admin');

    Accounts.createUser({
      username: 'admin',
      password: 'admin',
      email: 'admmin@admin.com',
      profile: {
        firstName: 'Admin',
      },
    });
  }
});

// Posts Paginated
publishPaginated({
  enableLogging: false,
  collection: Posts,
  name: 'posts.paginated',
  customCollectionName: 'posts.paginated',
  countsCollectionName: 'posts.paginated.count',

  addedObserverTransformerAsync: async function ({ fields }) {
    /*   console.log('Delay #1');
    await asyncDelay(100);
    console.log('Delay #2'); */

    fields.content = 'test_' + Random.id();

    return fields;
  },

  transformCursorSelectorAsync: async function ({ subscriptionParams }) {
    const user = await Meteor.userAsync();

    // Will return nothing
    if (!user?.username === 'admin') {
      return {
        _id: { $exists: false },
      };
    }

    return subscriptionParams.cursorSelector || {};
  },
});

// Users Paginated
publishPaginated({
  enableLogging: false,
  collection: Users,
  name: 'users.paginated',
  customCollectionName: 'users.paginated',
  countsCollectionName: 'users.paginated.count',

  getCachedData: params => {
    console.log(`Getting cached data...`);

    return {
      cachedData: 'this is cached string',
    };
  },

  addedObserverTransformerAsync: async function ({ fields, cachedData }) {
    // await asyncDelay(20);

    console.log({ cachedData });

    fields.content = 'users_test_' + Random.id();

    return fields;
  },
});
