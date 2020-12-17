import { functions } from './config';
import { updatePost } from './updatePost';
import { updateProfile } from './updateProfile';

//Update post data:
//- when a user likes/comments
//- OR when a user changes their profile info and it has to be updated in posts
exports.updatePost = functions.firestore
	.document('posts/{postId}/{collectionId}/{docId}') //watch subcollection of likes/comments for changes
	.onWrite(updatePost);

//Update user's profile info in every post, comment, and like
exports.updateProfile = functions.firestore
	.document('users/{userId}') //watch user docs for changes
	.onWrite(updateProfile);
