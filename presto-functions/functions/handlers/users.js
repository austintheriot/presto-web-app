const { db } = require('../util/admin');

const firebaseConfig = require('../util/config');

// Initialize Firebase
const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

const { validateSignupData, validateLoginData } = require('../util/validation');

exports.signup = (req, res) => {
  //initialize an object from the data submitted from the browser
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    username: req.body.username,
  };

  const { errors, valid } = validateSignupData(newUser);

  if (!valid) {
    return res.status(400).json(errors);
  }

  let token;
  let userId;
  //try to retrieve username
  db.doc(`/users/${newUser.username}`)
    .get()
    .then((doc) => {
      //if it exists, return error
      if (doc.exists) {
        return res
          .status(400)
          .json({ username: 'this username is already taken' });
      } else {
        //if it doesn't already exist, create the user, get token and return token
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    //create document in the database with username information
    .then((idToken) => {
      //set global token to the token returned rom the server
      token = idToken;
      //initialize data
      const userCredentials = {
        username: newUser.username,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId,
      };
      //set document with initialized data
      return db.doc(`/users/${newUser.username}`).set(userCredentials);
    })
    .then(() => {
      //return the token
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      //ouput custom error if email aready in use
      if (err.code === 'auth/email-already-in-use') {
        return res.status(400).json({ email: 'This email is already in use' });
      } else if (err.code === 'auth/weak-password') {
        return res.status(400).json({ username: 'Your password is too weak' });
      } else {
        //else return generic error
        return res.status(500).json({ error: err.code });
      }
    });
};

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { errors, valid } = validateLoginData(user);

  if (!valid) {
    return res.status(400).json(errors);
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 'auth/wrong-password') {
        return res
          .status(403)
          .json({ general: 'Wrong credentials, please try again' });
      } else return res.status(500).json({ error: err.code });
    });
};
