const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();

interface Context {
	params: {
		postId: string;
		collectionId: 'strings' | 'comments';
		docId: string;
	};
}

//Update likes/comments on posts when a new document is written (when a user likes/comments)
exports.updateLikesAndCommentsCount = functions.firestore
	.document('posts/{postId}/{collectionId}/{docId}') //watch subcollection of posts for changes
	.onWrite((change: any, context: Context) => {
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

//Info that has to be globally update on posts and comments:
//profilePic
//name
//activity

exports.updateProfilePicOnPostsAndComments = functions.storage
	.object()
	.onFinalize(async (object: any) => {
		// ...
	});
