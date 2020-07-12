const { admin, db } = require('./admin');

module.exports = (req, res, next) => {
  let idToken;
  //first, make sure the token exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('No authorization token found');
    return res.status(403).json({ error: 'Unauthorized' });
  }

  //if the token exists, verify it with firebase
  admin
    .auth()
    .verifyIdToken(idToken)
    //then get username from the database
    .then((decodedToken) => {
      req.user = decodedToken;
      return db
        .collection('users')
        .where('userId', '==', req.user.uid)
        .limit(1)
        .get();
    })
    .then((data) => {
      req.user.username = data.docs[0].data().username;
      return next();
    })
    .catch((err) => {
      console.error('Error while verifying the authentication token');
      return res.status(403).json({
        error: err,
      });
    });
};
