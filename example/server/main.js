import './fixtures';
import { publishPaginated } from 'meteor/kolyasya:meteor-pagination';

import Posts from '/imports/api/posts';

publishPaginated({
  collection: Posts,
  name: 'posts.paginated',
  customCollectionName: 'posts.paginated',
  countsCollectionName: 'posts.paginated.count',

  getSelector: params => {
    console.log('Selector', params);

    return {};
  },

  getOptions: params => {
    console.log('Options', params)
  }
});