import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

const CollaborationsPaginated = new Mongo.Collection('posts.paginated');

const App = () => {
  return (
    <div>
      Test
    </div>
  )
}

export default withTracker(() => {
  Meteor.subscribe('posts.paginated', {
    skip: 0,
    limit: 0,
  });
  console.log(CollaborationsPaginated.find().fetch());
  return {};
})(App);
