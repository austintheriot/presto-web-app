import React from 'react';
import Nav from '../../components/Nav/Nav';
import Post from '../../components/Post/Post';

export default (props) => {
	return (
		<>
			<Nav />
			<h1>Posts</h1>
			<Post />
			<Post />
			<Post />
			<Post />
		</>
	);
};
