const functions = require('firebase-functions');
const express = require('express');
const app = express();

const fbAuth = require('./util/fbAuth');

const { getAllPosts, submitOnePost } = require('./handlers/posts');
const { signup, login } = require('./handlers/users');

//GET: posts.js routes
app.get('/posts', getAllPosts);
app.post('/post', fbAuth, submitOnePost);
//POST: users.js routes
app.post('/signup', signup);
app.post('/login', login);

exports.api = functions.https.onRequest(app);
