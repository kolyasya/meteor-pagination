# meteor-pagination

Package implements reactive pagination for Meteor apps. It is based on observeChanges callbacks which publish docs into client-side collection like `posts.paginated`.

## Usage example

Check [`./example`](https://github.com/kolyasya/meteor-pagination/tree/main/example) directory for a full working example

### Server

Full list of possible params is here — [`https://github.com/kolyasya/meteor-pagination/blob/main/example/packages/meteor-pagination/server.js#L39`]()

```js
publishPaginated({
  enableLogging: false,
  collection: Posts, // Mongo collection
  name: 'posts.paginated', // Publication name
  customCollectionName: 'posts.paginated', // Client-side collection name
  countsCollectionName: 'posts.paginated.count', // Client-side counts collection name
});
```

### Client

It is just an example. You need to adjust variables according to your app code.

```js
export default withTracker(({ perPage, page, sort }) => {
  const totalRows = Counts.get('posts.paginated.count');

  const paginatedPostsSub = Meteor.subscribe('posts.paginated', {
    skip: page * perPage,
    limit: perPage,
    fields: {
      title: 1,
      content: 1,
    },
    sort,

    cursorSelector: {},
  });

  return {
    postsLoading: !paginatedPostsSub.ready(),
    posts: PostsPaginated.find().fetch(),
    totalRows,
  };
})(Table);
```
