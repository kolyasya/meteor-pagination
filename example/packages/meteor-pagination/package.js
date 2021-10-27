Package.describe({
  name: 'kolyasya:meteor-pagination',
  version: '0.0.1',
  summary: 'Trying to make it right',
  git: 'https://github.com/kolyasya/meteor-pagination',
  documentation: 'README.md',
});

Package.onUse(function (api) {
  api.versionsFrom('1.6.0.1');

  api.use('ecmascript');
  api.use('mongo');
  api.use('tmeasday:publish-counts@0.2.1');

  api.mainModule('server.js', 'server');
});
