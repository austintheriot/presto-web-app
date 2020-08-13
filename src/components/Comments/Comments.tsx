import React from 'react';
import Comment from '../Comment/Comment';
import { PostType } from '../../app/types';

export default ({ comments }: PostType) => {
	let commentsList = null;
	if (comments!.length > 0) {
		commentsList = comments!.map((comment) => (
			<Comment key={comment!.body! + comment.createdAt} {...comment} />
		));
	}

	return <section>{commentsList}</section>;
};
