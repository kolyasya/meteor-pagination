Package.describe({
  name: 'kolyasya:meteor-pagination',
  version: '1.0.0-beta.0',
  summary: 'Pagination for Meteor. Based on observeChanges and publishCounts',
  git: 'https://github.com/kolyasya/meteor-pagination',
  documentation: '../../../README.md'
});

Package.onUse(function (api) {
  // api.versionsFrom('2.3.5');

  api.use([
    'ecmascript',
    'mongo',
    'kolyasya:publish-counts@1.0.0-beta.1',
    'tmeasday:check-npm-versions@1.0.2'
  ]);

  api.mainModule('server.js', 'server');
});
