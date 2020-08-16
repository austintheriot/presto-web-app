import React from 'react';
import Comment from '../Comment/Comment';

export default ({ comments }: any) => {
	let commentsList: any[] = [];
	if (comments?.count) {
		for (let key in comments) {
			if (key !== 'count') {
				commentsList.push(comments[key]); //add comments into an array
			}
		}
		commentsList = comments!.map((comment: any) => (
			<Comment key={comment!.body! + comment.createdAt} {...comment} />
		));
	}

	return <section>{commentsList}</section>;
};
