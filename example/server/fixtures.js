import { Meteor } from 'meteor/meteor';
import Jabber from 'jabber';
import Posts from '/imports/api/posts';

const insertPost = ({ title, content }) => {
  console.log(`Insert post ${title}`);
  Posts.insert({title, content, createdAt: new Date()});
}

Meteor.startup(() => {
  if (Posts.find().count() === 0) {
    console.log('Inserting fixtures to Posts collection...');
    const jabber = new Jabber();

    for (let i = 0; i < 999; i++) {
      insertPost({
        title: `${jabber.createWord(6, true)} ${jabber.createWord(8)}`,
        content: jabber.createParagraph(90)
      })
    }

    console.log('Posts are inserted');
  }
});
