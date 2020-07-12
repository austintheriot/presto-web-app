const { admin, db } = require('../util/admin');

const config = require('../util/config');

// Initialize Firebase
const firebase = require('firebase');
firebase.initializeApp(config);

const {
  validateSignupData,
  validateLoginData,
  reduceUserDetails,
} = require('../util/validation');

//SIGNUP
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

  const noImg = 'no-img.svg';

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
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
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

//LOGIN
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

//ADD USER DETAILS
exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);
  db.doc(`/users/${req.user.username}`)
    .update(userDetails)
    .then(() => {
      return res.json({ message: 'Details added successfully' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err });
    });
};

//GET OWN USER DETAILS
exports.getAuthenticatedUser = (req, res) => {
  let userData = {};

  db.doc(`/users/${req.user.username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return db
          .collection('likes')
          .where('username', '==', req.user.username)
          .get();
      }
    })
    .then((data) => {
      userData.likes = [];
      data.forEach((doc) => {
        userData.likes.push(doc.data());
      });
      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

//UPLOAD IMAGE
exports.uploadImage = (req, res) => {
  //for parsing image data
  const BusBoy = require('busboy');
  //gives utilities for working with file & directory paths
  const path = require('path');
  //gives utilities relating to the operating system
  const os = require('os');
  const fs = require('fs');

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      return res.status(400).json({ error: 'Wrong file type submitted' });
    }

    //get file extension
    const imageExtension = filename.split('.')[filename.split('.').length - 1];
    imageFileName = `${Math.round(
      Math.random() * 10000000000
    )}.${imageExtension}`;
    //creates a temporary file path for the image
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    //writes a stream into a file at a given filepath?
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on('finish', () => {
    admin
      .storage()
      .bucket(config.storagebucket)
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        //update user document with a photo
        return db.doc(`/users/${req.user.username}`).update({ imageUrl });
      })
      .then(() => {
        return res.json({ message: 'Image uploaded successfully' });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};
