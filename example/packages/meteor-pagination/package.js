Package.describe({
  name: 'kolyasya:meteor-pagination',
  version: '1.0.0-beta.8',
  summary: 'Pagination for Meteor. Based on observeChanges and publishCounts',
  git: 'https://github.com/kolyasya/meteor-pagination',
  documentation: '../../../README.md',
});

Package.onUse(api => {
  api.use('ecmascript@0.16.8');
  api.use('typescript@5.4.3');
  api.use('zodern:types@1.0.13');
  api.use('compat:publish-counts@1.0.0-beta.0');
  api.use('mongo@2.0.0');

  api.mainModule('server.ts', 'server');
});

Npm.depends({
  'lodash.defaults': '4.2.0',
  'lodash.pullall': '4.2.0',
  'lodash.isfunction': '3.0.9',
});
