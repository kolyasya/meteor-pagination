import { Meteor } from 'meteor/meteor';
import { generate } from 'random-words';
import Posts from '../imports/api/posts';

const insertPost = async ({ title, content }) => {
  console.log(`Inserting post "${title}"...`);
  await Posts.insertAsync({ title, content, createdAt: new Date() });
};

Meteor.methods({
  insertPost: async function ({
    title = 'New Post',
    content = `${generate(3).join(' ')}`
  } = {}) {
    await Posts.insertAsync({ title, content, createdAt: new Date() });
  }
});

Meteor.startup(async () => {
  // await Posts.removeAsync({});

  if ((await Posts.find().countAsync()) === 0) {
    console.log('Inserting fixtures to Posts collection...');

    for (let i = 1; i < 92; i++) {
      await insertPost({
        title: `Post #${i}`,
        content: `${generate(3).join(' ')}`
      });
    }

    console.log('Posts are inserted');
  }
});
