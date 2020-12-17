import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import cloneDeep from 'lodash/cloneDeep';

admin.initializeApp();
const db = admin.firestore();

//Info that has to be globally updated on posts and comments:
//profilePic
//name
//activity

//Update profilePic URLs everywhere when a user's profilePic url changes
exports.updateProfilePicUrl = functions.firestore
	.document('users/{userId}') //watch user docs for changes
	.onWrite(async (change, context: functions.EventContext) => {
		//profilePic, name, or activity field was changed
		if (
			change.before.data()?.profilePic !== change.after.data()?.profilePic ||
			change.before.data()?.name !== change.after.data()?.name ||
			change.before.data()?.activity !== change.after.data()?.activity
		) {
			try {
				const uid: string = context.params.userId;
				const profilePic: string = change.after.data()?.profilePic;
				const name: string = change.after.data()?.name;
				const activity: string = change.after.data()?.activity;

				//initialize a batch write for all posts: update profilePic URL, name, and activity
				const batch = db.batch();
				const postSnapshots = await db
					.collection('posts')
					.where('uid', '==', uid)
					.get();
				postSnapshots.forEach((doc) => {
					batch.update(doc.ref, {
						profilePic,
						name,
						activity,
					});
				});

				//initialize a batch write for all comments: update profilePic URL, name, and activity
				const commentSnapshots = await db
					.collectionGroup('comments')
					.where('uid', '==', uid)
					.get();
				commentSnapshots.forEach((doc) => {
					batch.update(doc.ref, {
						profilePic,
						name,
						activity,
					});
				});

				//execute batch write
				await batch.commit();
			} catch (err) {
				console.error(err);
			}
		}
	});

//Update post data:
//- when a user likes/comments
//- OR when a user changes their profile info and it has to be updated in posts
exports.updatePostData = functions.firestore
	.document('posts/{postId}/{collectionId}/{docId}') //watch subcollection of likes/comments for changes
	.onWrite(async (change, context: functions.EventContext) => {
		//context.params.postId refers to the context variable provided above ^
		const postId: string = context.params.postId;
		const collectionId: 'likes' | 'comments' = context.params.collectionId;
		const docId: string = context.params.docId;

		//UPDATED -- update post with new info from like/comment
		if (change.before.exists && change.after.exists) {
			try {
				const post = await db.doc(postId).get();
				if (!post.exists || post.data() === undefined) return;
				const postData = cloneDeep(post.data()!);
				const docs = postData[collectionId];
				const updatedLikeOrComment = change.after.data();

				//merge changes into copied likes/comments data
				//likes/comments --> like/comment docId --> data
				docs[docId] = updatedLikeOrComment;

				//update the proper field with new information from like/comment
				await db
					.collection('posts')
					.doc(postId)
					.update({
						[collectionId]: docs, //replace likes/comments field with updated one
					});
			} catch (err) {
				console.error(err);
			}
		}

		//CREATED --  add data from Post and increment counter
		else if (!change.before.exists && change.after.exists) {
			try {
				const post = await db.doc(postId).get();
				if (!post.exists || post.data() === undefined) return;
				const newPostData = cloneDeep(post.data()!);
				const newCollectionData = newPostData[collectionId];
				newCollectionData[docId] = change.after.data(); //copy new data into collection
				newCollectionData.count++; //increment count
				await db
					.collection('posts')
					.doc(postId)
					.update({
						[collectionId]: newCollectionData, //override specified field with data gathered from subcollections
					});
			} catch (err) {
				console.error(err);
			}
		}

		//DELETED -- delete data from Post and decrement counter
		else if (change.before.exists && !change.after.exists) {
			try {
				const post = await db.doc(postId).get();
				if (!post.exists || post.data() === undefined) return;
				const newPostData = cloneDeep(post.data()!);
				const newCollectionData = newPostData[collectionId];
				delete newCollectionData[docId]; //delete existing comment/or like
				newCollectionData.count--; //decrement count
				await db
					.collection('posts')
					.doc(postId)
					.update({
						[collectionId]: newCollectionData, //override specified field with data gathered from subcollections
					});
			} catch (err) {
				console.error(err);
			}
		}

		// //RECOUNT ENTIRE SUBCOLLECTION
		// try {
		// 	//get all likes/comments in the subcollection
		// 	const subCollectionDocs = await db
		// 		.collection('posts')
		// 		.doc(postId) //id of the post which had likes or comments edited
		// 		.collection(collectionId) //i.e. likes or comments
		// 		.get();

		// 	//copy the contents of the entire subcollection into an object (each doc is an attribute)
		// 	const newLikesOrCommentsObject: {
		// 		[key: string]: any;
		// 		count: number;
		// 	} = {
		// 		count: subCollectionDocs.size, //initialize with the total count of likes/comments
		// 	};
		// 	subCollectionDocs.forEach((doc: { id: string; data: () => any }) => {
		// 		newLikesOrCommentsObject[doc.id] = doc.data();
		// 	});

		// 	//replace information inside top level post with an object containing document information
		// 	await db
		// 		.collection('posts')
		// 		.doc(postId)
		// 		.update({
		// 			[collectionId]: newLikesOrCommentsObject, //override specified field with data gathered from subcollections
		// 		});
		// } catch (err) {
		// 	console.error(err);
		// }
	});
