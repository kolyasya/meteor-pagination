import "./fixtures";
import { publishPaginated } from "meteor/kolyasya:meteor-pagination";

import Posts from "/imports/api/posts";

publishPaginated({
  enableLogging: true,
  collection: Posts,
  name: "posts.paginated",
  customCollectionName: "posts.paginated",
  countsCollectionName: "posts.paginated.count"
});
