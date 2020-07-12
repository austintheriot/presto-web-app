const { db } = require('../util/admin');

exports.getAllPosts = (req, res) => {
  db.collection('posts')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
      let posts = [];
      data.forEach((doc) => {
        posts.push({
          postId: doc.id,
          username: doc.data().username,
          title: doc.data().title,
          body: doc.data().body,
          createdAt: doc.data().time,
        });
      });
      return res.json(posts);
    })
    .catch((err) => console.error(err));
};

exports.submitOnePost = (req, res) => {
  const newPost = {
    username: req.user.username,
    title: req.body.title,
    body: req.body.body,
    createdAt: new Date(),
  };

  db.collection('posts')
    .add(newPost)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: 'something went wrong' });
      console.error(err);
    });
};
