import React from 'react';
import Comment from 'components/Comment/Comment';

export default (props: { postId: string; commentsContainer: any }) => {
	let commentsObject = { ...props.commentsContainer.comments };
	let postId = props.postId;
	let commentsList: any[] = [];
	console.log(
		'[Comments]: converting comments object from database into an array'
	);
	if (commentsObject?.count) {
		for (let key in commentsObject) {
			if (key !== 'count') {
				//add commentId field to comment (based on docId)
				let comment = { ...commentsObject[key] }; //copy comment data to prevent TypeError in strict mode (object not extensible)
				comment.commentId = key;
				//add postId field to comment (based on received from props)
				comment.postId = postId;
				commentsList.push(comment); //add comments into an array
			}
		}
		console.log('[Comments]: sorting comments by date');
		commentsList = commentsList
			.sort((postA, postB) => {
				let a = new Date(postA.createdAt ? postA.createdAt : 0).getTime();
				let b = new Date(postB.createdAt ? postB.createdAt : 0).getTime();
				return b - a;
			})
			.map((comment: any) => (
				<Comment key={comment!.body! + comment.createdAt} {...comment} />
			));
	}

	return <section>{commentsList}</section>;
};
