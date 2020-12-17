import { executeOnce } from './executeOnce';
import { db, functions } from './config';

/* 
		Note: This function runs whenever a user updates their profile
		info, such as profilePic, name, or activity. Once the user updates
		this info, updateProfile.ts grabs the new info, and updates all
		posts and comments to reflect the new changes. 

		Posts are updated directy, and each comment in the posts/comments 
		subcollections are also updated. When the SUBcollection is updated,
		this triggers updatePost.ts to update each parent post with the 
		new values. We COULD do it here, but we won't because to change each post, 
		we'd have to retrieve the parent post of each comment, which will happen 
		anyway in the updatePost.ts function.
*/

export const updateProfile = (
	change: functions.Change<functions.firestore.DocumentSnapshot>,
	context: functions.EventContext
) =>
	executeOnce(change, context, async (transaction) => {
		if (
			change.before.data()?.profilePic !== change.after.data()?.profilePic ||
			change.before.data()?.name !== change.after.data()?.name ||
			change.before.data()?.activity !== change.after.data()?.activity
		) {
			try {
				//get changed data fields
				const uid: string = context.params.userId;
				const profilePic: string = change.after.data()?.profilePic || '';
				const name: string = change.after.data()?.name || '';
				const activity: string = change.after.data()?.activity || '';

				//get posts
				const postsRef = db.collection('posts').where('uid', '==', uid);
				const posts = await transaction.get(postsRef);

				//get comments
				const commentsRef = db
					.collectionGroup('comments')
					.where('uid', '==', uid);
				const comments = await transaction.get(commentsRef);

				//update posts
				posts.forEach((doc) => {
					transaction.update(doc.ref, {
						profilePic,
						name,
						activity,
					});
				});

				//update comments
				comments.forEach((doc) => {
					transaction.update(doc.ref, {
						profilePic,
						name,
						activity,
					});
				});
			} catch (err) {
				console.error(err);
			}
		}
	});
