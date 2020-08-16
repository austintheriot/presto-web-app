const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.myFunction = functions.firestore
	.document('posts/{postId}/{collectionId}/{userId}')
	.onWrite((change, context) => {
		// If we set `/posts/ACDEFGHIJKLMNOP/likes/1234564567` to {body: "This is an example"} then
		const postId = context.params.postId; // == "ACDEFGHIJKLMNOP";
		const collectionId = context.params.collectionId; //== "likes" or "comments";
		// context.params.userId == "1234564567";'

		// Retrieve the current and previous value
		const data = change.after.data(); //== {body: "This is an example"}
		console.log('data: ', data);
		const dataId = change.after.id; //== {body: "This is an example"}
		console.log('dataId: ', dataId);
		const previousData = change.before.data();

		// We'll only update if the name has changed.
		// This is crucial to prevent infinite loops.
		if (data.name === previousData.name) {
			return null;
		}

		//get total number of documents in the collection
		db.collection('posts')
			.doc(postId)
			.collection(collectionId)
			.get()
			.then((querySnapshot) => {
				let numberOfDocs = querySnapshot.size;
				console.log('Number of Docs: ', numberOfDocs);
			});

		/* return db.collection('posts').doc(postId); */
	});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
