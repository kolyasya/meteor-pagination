Package.describe({
  name: "kolyasya:meteor-pagination",
  version: "0.0.1",
  summary: "Trying to make it right",
  git: "https://github.com/kolyasya/meteor-pagination",
  documentation: "README.md",
});

Npm.depends({
  "lodash.defaults": "4.2.0",
  "lodash.pullall": "4.2.0",
});

Package.onUse(function (api) {
  api.use("ecmascript");
  api.use("mongo");
  api.use("btafel:publish-counts@0.9.3");

  api.mainModule("server.js", "server");
});
