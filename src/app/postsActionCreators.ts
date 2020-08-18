export const likePost = (userId: string, postId: string) => ({
	type: 'posts/likePost',
	payload: {
		userId,
		postId,
	},
});

export const unlikePost = (userId: string, postId: string) => ({
	type: 'posts/unlikePost',
	payload: {
		userId,
		postId,
	},
});
