import { Random } from 'meteor/random';

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

  addedObserverTransformerAsync: async ({ fields }) => {
    /*   console.log('Delay #1');
    await asyncDelay(100);
    console.log('Delay #2'); */

    fields.content = 'test_' + Random.id();

    return fields;
  },

  transformCursorSelectorAsync: async ({ subscriptionParams }) => {
    const user = await Meteor.user();

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
  addedObserverTransformerAsync: async ({ fields }) => {
    // await asyncDelay(20);

    fields.content = 'users_test_' + Random.id();

    return fields;
  },
});
