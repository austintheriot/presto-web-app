import React from 'react';
import Comment from '../Comment/Comment';

export default (props: { postId: string; commentsContainer: any }) => {
	let comments = { ...props.commentsContainer.comments };
	let postId = props.postId;
	let commentsList: any[] = [];
	if (comments?.count) {
		for (let key in comments) {
			if (key !== 'count') {
				//add commentId field to comment (based on docId)
				let comment = { ...comments[key] }; //copy comment data to prevent TypeError in strict mode (object not extensible)
				comment.commentId = key;
				//add postId field to comment (based on received from props)
				comment.postId = postId;
				commentsList.push(comment); //add comments into an array
			}
		}
		commentsList = commentsList.map((comment: any) => (
			<Comment key={comment!.body! + comment.createdAt} {...comment} />
		));
	}

	return <section>{commentsList}</section>;
};
