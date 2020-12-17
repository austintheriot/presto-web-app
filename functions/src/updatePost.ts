import { executeOnce } from './executeOnce';
import { db, functions } from './config';
import cloneDeep from 'lodash/cloneDeep';

export const updatePost = (
	change: functions.Change<functions.firestore.DocumentSnapshot>,
	context: functions.EventContext
) =>
	executeOnce(change, context, async (transaction) => {
		const ERROR_POST_NOT_FOUND = 'Document or its data do not exist!';

		//context.params.postId refers to: posts/{postId}/{collectionId}/{docId}
		const postId: string = context.params.postId;
		const collectionId: 'likes' | 'comments' = context.params.collectionId;
		const docId: string = context.params.docId;

		//on update -- update post with new info from like/comment
		if (change.before.exists && change.after.exists) {
			try {
				//get post to change
				const postRef = db.collection('posts').doc(postId);
				const post = await transaction.get(postRef);
				if (!post.exists || post.data() === undefined) {
					console.error(ERROR_POST_NOT_FOUND);
					return null;
				}

				//modify data
				const newPostData: FirebaseFirestore.DocumentData = cloneDeep(
					post.data()!
				);
				newPostData[collectionId][docId] = change.after.data();

				//update post
				transaction.update(postRef, newPostData);
			} catch (err) {
				console.error(err);
			}
		}

		//on create -- merge post & comment data and increment counter
		else if (!change.before.exists && change.after.exists) {
			try {
				//get post to change
				const postRef = db.collection('posts').doc(postId);
				const post = await transaction.get(postRef);
				if (!post.exists || post.data() === undefined) {
					console.error(ERROR_POST_NOT_FOUND);
					return null;
				}

				//modify data
				const newPostData: FirebaseFirestore.DocumentData = cloneDeep(
					post.data()!
				);
				newPostData[collectionId][docId] = change.after.data();
				newPostData[collectionId].count++;

				//update post
				transaction.update(postRef, newPostData);
			} catch (err) {
				console.error(err);
			}
		}

		//on delete -- delete comment data from post and decrement counter
		else if (change.before.exists && !change.after.exists) {
			try {
				//get post
				const postRef = db.collection('posts').doc(postId);
				const post = await transaction.get(postRef);
				if (!post.exists || post.data() === undefined) {
					console.error(ERROR_POST_NOT_FOUND);
					return null;
				}

				//modify data
				const newPostData: FirebaseFirestore.DocumentData = cloneDeep(
					post.data()!
				);
				delete newPostData[collectionId][docId];
				newPostData[collectionId].count--; //decrement count

				//update post
				transaction.update(postRef, newPostData);
			} catch (err) {
				console.error(err);
			}
		}
		return null;
	});
