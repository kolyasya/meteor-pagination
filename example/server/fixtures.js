import { Meteor } from 'meteor/meteor';
import { generate } from 'random-words';
import Posts from '../imports/api/posts';

const insertPost = ({ title, content }) => {
  console.log(`Insert post ${title}`);
  Posts.insert({ title, content, createdAt: new Date() });
};

Meteor.startup(() => {
  // Posts.remove({});

  if (Posts.find().count() === 0) {
    console.log('Inserting fixtures to Posts collection...');

    for (let i = 0; i < 91; i++) {
      insertPost({
        title: `Post #${i}`,
        content: `${generate(3).join(' ')}`
      });
    }

    console.log('Posts are inserted');
  }
});
