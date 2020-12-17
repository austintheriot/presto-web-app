import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
const db = admin.firestore();

//Update likes/comments on posts when a new document is written (when a user likes/comments)
exports.updateLikesAndCommentsCount = functions.firestore
	.document('posts/{postId}/{collectionId}/{docId}') //watch subcollection of posts for changes
	.onWrite((change, context: functions.EventContext) => {
		//Example path: `/posts/bXKkHTXxQgs6QlZS8G9M/likes/DTOrxcyi04dYaxl5WhCiakSnnmf1
		const postId: string = context.params.postId; // == "bXKkHTXxQgs6QlZS8G9M" --id of the post
		const collectionId: 'strings' | 'comments' = context.params.collectionId; //== "likes" or "comments"
		//const docId: string = context.params.docId; //== "DTOrxcyi04dYaxl5WhCiakSnnmf1" --doc id in the subcollection of likes/comments

		//get total number of documents in the collection
		db.collection('posts')
			.doc(postId) //id of the post that was edited
			.collection(collectionId) //i.e. likes or comments
			.get()
			.then((querySnapshot: any) => {
				const numberOfDocs = querySnapshot.size; //get number of documents in the subcollection

				//duplicate the contents of the subcollection into an object (each doc is an attribute)
				const dataObject: any = {};
				dataObject.count = numberOfDocs; //update the count of likes/comments
				querySnapshot.forEach((doc: { id: string; data: () => any }) => {
					dataObject[doc.id] = doc.data(); //copy each document into the dataObject as an attribute
				});

				//replace information inside top level post with array of document information
				db.collection('posts')
					.doc(postId)
					.update({
						[collectionId]: dataObject, //override specified field with data gathered from subcollections
					})
					.then(() => {
						return;
					})
					.catch((err: typeof Error) => {
						console.error(err);
						return;
					});
			})
			.catch((err: typeof Error) => {
				console.error(err);
				return;
			});
	});

//Info that has to be globally updated on posts and comments:
//profilePic
//name
//activity

//profilePic URLs everywhere when a user's profilePic url changes
exports.updateProfilePicUrl = functions.firestore
	.document('users/{userId}') //watch user docs for changes
	.onWrite(async (change, context: functions.EventContext) => {
		//only do anything if the the user's profilePic field changed
		if (change.before.data()?.profilePic === change.after.data()?.profilePic) {
			return;
		}
		try {
			//Example path: `/posts/bXKkHTXxQgs6QlZS8G9M/likes/DTOrxcyi04dYaxl5WhCiakSnnmf1
			const uid: string = context.params.userId; // == "bXKkHTXxQgs6QlZS8G9M" --id of the post
			//const docId: string = context.params.docId; //== "DTOrxcyi04dYaxl5WhCiakSnnmf1" --doc id in the subcollection of likes/comments
			const url: string = change.after.data()?.profilePic;

			//do a batch write for all posts: update profilePic URL
			const batch = db.batch();
			const querySnapshots = await db
				.collection('posts')
				.where('uid', '==', uid)
				.get();
			querySnapshots.forEach((doc) => {
				batch.update(doc.ref, {
					profilePic: url,
				});
			});
			await batch.commit();
			return;
		} catch (err) {
			console.log(err);
			return;
		}
	});
