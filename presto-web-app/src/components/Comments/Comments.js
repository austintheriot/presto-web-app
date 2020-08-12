import React from 'react';
import Comment from '../Comment/Comment';

export default ({ comments }) => {
	let commentsList = null;
	if (comments.length > 0) {
		commentsList = comments.map((comment, i) => (
			<Comment key={comment.body + comment.createdAt} {...comment} />
		));
	}

	return <section className={comments}>{commentsList}</section>;
};
