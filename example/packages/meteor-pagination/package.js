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
    'ecmascript@0.16.0',
    'mongo@2.0.0-rc300.0',
    'compat:publish-counts',
    'tmeasday:check-npm-versions@2.0.0-beta.0'
  ]);

  api.mainModule('server.js', 'server');
});
