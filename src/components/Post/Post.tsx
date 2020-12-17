import React, { useState } from 'react';
import styles from './Post.module.scss';
import { Link } from 'react-router-dom';
import { PostType } from 'app/types';
import { db } from 'app/config';

import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from 'app/userSlice';
import Textarea from 'components/Inputs/Textarea';
import Button from 'components/Button/Button';
import { likePost, unlikePost } from 'app/postsActionCreators';

import { InputType } from 'app/types';

//images
import heartEmpty from 'assets/images/heartEmpty.svg';
import heartFull from 'assets/images/heartFull.svg';
import commentEmpty from 'assets/images/commentEmpty.svg';
import commentFull from 'assets/images/commentFull.svg';
import trashIcon from 'assets/images/delete.svg';
import editIcon from 'assets/images/edit.svg';
import moreIcon from 'assets/images/more.svg';

interface Inputs {
	body: InputType;
}

type KeyOfInputs = keyof Inputs;

export default ({
	id,
	status,
	error,
	activity,
	body,
	city,
	comments,
	country,
	county,
	createdAt,
	likes,
	name,
	profilePic,
	state,
	uid,
	zip,
}: PostType) => {
	const dispatch = useDispatch();
	const user = useSelector(selectUser);
	const [editing, setEditing] = useState(false);
	const [inputs, setInputs] = useState<Inputs>({
		body: {
			value: body,
			label: 'Comment',
			animateUp: !!body,
			empty: !body,
			edited: false,
			message: {
				error: false,
				text: '',
				default: '',
			},
			suggestions: {
				selected: false,
				loading: false,
				show: false,
				array: [],
			},
		},
	});

	const handleFocus = (
		e: React.FormEvent<HTMLInputElement>,
		newestType: KeyOfInputs
	) => {
		setInputs((prevState: Inputs) => ({
			...prevState,
			[newestType]: {
				...prevState[newestType],
				animateUp: true,
				edited: true,
			},
		}));
	};

	const handleBlur = (
		e: React.FormEvent<HTMLInputElement>,
		newestType: KeyOfInputs
	) => {
		//animation & output error if empty
		let targetEmpty =
			inputs[newestType].edited && inputs[newestType].value.length === 0
				? true
				: false;
		setInputs((prevState: Inputs) => ({
			...prevState,
			[newestType]: {
				...prevState[newestType],
				//animation
				animateUp: targetEmpty ? false : true,
			},
		}));
	};

	const handleChange = (
		e: React.FormEvent<HTMLInputElement>,
		newestType: KeyOfInputs
	) => {
		let targetValue = e.currentTarget.value;
		let targetEmpty = targetValue.length === 0 ? true : false;

		setInputs((prevState: Inputs) => ({
			...prevState,
			[newestType]: {
				...prevState[newestType],
				//animation
				value: targetValue,
				empty: targetEmpty,
			},
		}));
	};

	const submitPostEdits = (e: React.SyntheticEvent) => {
		//pre default form submission
		e.preventDefault();

		//if body text has not been edited/edited, ignore submit button
		if (!inputs.body.edited || inputs.body.empty || !inputs.body.value) {
			return;
		}

		//check for errors

		console.log('[Post]: data entered: ', inputs.body.value);
		//close editing dialog
		setEditing(false);
		//update post in database
		db.collection('posts')
			.doc(id)
			.update({
				body: inputs.body.value,
			})
			.then(() => {
				console.log('[Post]: Post successfully edited in database!');
			})
			.catch((error) => {
				console.error(error);
				alert('Sorry, there was a server error. Please try again later.');
			});
	};

	const likePostHandler = (postId: string) => {
		let userId = user.uid;
		dispatch(likePost(userId, postId));
		//create document if it doesn't exists, or update it if it does
		console.log('[Post]: Liking post. Post Id: ', postId, 'UserId: ', userId);
		//set: creates or updates document with info:
		db.collection('posts')
			.doc(postId)
			.collection('likes')
			.doc(userId)
			.set({
				uid: userId,
			})
			.then(() => {
				console.log('[Post]: Like successfully added to database!');
			})
			.catch((err) => {
				console.error(err);
				dispatch(unlikePost(userId, postId)); //undo action
			});
	};

	const unlikePostHandler = (postId: string) => {
		let userId = user.uid;
		dispatch(unlikePost(userId, postId));
		//delete document if it exists
		console.log('[Post]: Liking post. Post Id: ', postId, 'UserId: ', userId);
		db.collection('posts')
			.doc(postId)
			.collection('likes')
			.doc(userId)
			.delete()
			.then(() => {
				console.log('[Post]: Like successfully deleted from database!');
			})
			.catch((err) => {
				console.error(err);
				dispatch(likePost(userId, postId)); //undo action
			});
	};

	const editPostButtonClickHandler = () => {
		setEditing((prevState) => !prevState);
	};

	const deletePostHandler = () => {
		if (window.confirm('Are you sure you want to delete this post?')) {
			db.collection('posts')
				.doc(id)
				.delete()
				.then(() => {
					console.log('[Post]: Post successfully deleted from database!');
				})
				.catch((err) => {
					console.error(err);
				});
		}
	};

	let isSinglePostPage = !!window.location.pathname.split('/posts/')[1];
	let bodyText =
		//if single post, show only body, no link
		isSinglePostPage ? (
			<p>{body}</p>
		) : //if Posts page and body is > 250 characters, truncate
		body && body.length > 250 ? (
			<>
				<p>{body.substr(0, 250) + '...'}</p>
				<Link to={`/posts/${id}`} className={styles.SeeMore}>
					See More
				</Link>
			</>
		) : (
			//Else if Posts page and body is <= 250 characters, show it plain with a link to individual post
			<Link to={`/posts/${id}`} className={styles.Link}>
				<p>{body}</p>
			</Link>
		);
	return (
		<>
			{status === 'idle' ? null : status === 'loading' ? (
				<div className={styles.altWrapper}>
					<p>Loading post...</p>
				</div>
			) : status === 'failed' ? (
				<div className={styles.altWrapper}>
					<p>Post not found.</p>
				</div>
			) : status === 'success' ? (
				<div className={styles.wrapper}>
					<article className={styles.article}>
						<header>
							{/* PROFILE PIC*/}
							<div className={styles.profilePic}>
								<Link to={`/profile/${uid}`} className={styles.Link}>
									<img alt='/profile' src={profilePic} />
								</Link>
							</div>
							{/* NAME */}
							<Link to={`/profile/${uid}`} className={styles.Link}>
								<h2 className={styles.name}>{name}</h2>
							</Link>
							{/* TIME */}
							<Link
								to={`/posts/${id}`}
								className={[styles.Link, styles.timeLink].join(' ')}>
								<time>{createdAt}</time>
							</Link>
							{/* ACTIVITY */}
							<Link
								to={`/profile/${uid}`}
								className={[styles.Link, styles.activityLink].join(' ')}>
								<p className={styles.activity}>{activity}</p>
							</Link>
							{user.uid === uid ? (
								<>
									<div className={styles.more}>
										<button>
											<img src={moreIcon} alt='more' />
										</button>
										<div className={styles.hiddenMenu}>
											<button onClick={editPostButtonClickHandler}>
												<img src={editIcon} alt='edit' />
											</button>
											<button onClick={deletePostHandler}>
												<img src={trashIcon} alt='delete' />
											</button>
										</div>
									</div>
								</>
							) : null}
						</header>
						{/* BODY */}
						<main className={styles.body}>
							{editing ? (
								<form onSubmit={submitPostEdits}>
									<Textarea
										customType='body'
										handleFocus={(e: React.FormEvent<HTMLInputElement>) =>
											handleFocus(e, 'body')
										}
										handleBlur={(e: React.FormEvent<HTMLInputElement>) =>
											handleBlur(e, 'body')
										}
										handleChange={(e: React.FormEvent<HTMLInputElement>) =>
											handleChange(e, 'body')
										}
										input={inputs.body}
										setInputs={setInputs}
									/>
									<Button type='submit'>Submit</Button>
								</form>
							) : (
								/* Only link to individual post when on main feed */
								bodyText
							)}
						</main>
						<footer>
							{/* NUMBER OF LIKES */}
							<Link to={`/posts/${id}`} className={styles.Link}>
								<p className={styles.likes}>
									<img alt='likes' src={heartFull}></img> {likes!.count} likes
								</p>
							</Link>
							{/* NUMBER OF COMMENTS */}
							<Link
								to={`/posts/${id}`}
								className={[styles.Link, styles.comments].join(' ')}>
								<img alt='likes' src={commentFull}></img> {comments!.count}{' '}
								comments
							</Link>
							<div className={styles.icons}>
								{/* LIKE BUTTON */}
								<button>
									{/* Show full heart if this post has been saved in user "likes" */}
									{likes[user.uid] ? (
										<img
											alt='likes'
											src={heartFull}
											onClick={() => unlikePostHandler(id!)}></img>
									) : (
										<img
											alt='likes'
											src={heartEmpty}
											onClick={() => likePostHandler(id!)}></img>
									)}
								</button>

								{/* COMMENT BUTTON */}
								{Object.values(comments).find(
									(comment: any) => comment.uid === user.uid
								) ? (
									<Link to={`/posts/${id}`} className={styles.Link}>
										<button>
											<img alt='comments' src={commentFull}></img>
										</button>
									</Link>
								) : (
									<Link to={`/posts/${id}`} className={styles.Link}>
										<button>
											<img alt='comments' src={commentEmpty}></img>
										</button>
									</Link>
								)}
							</div>
						</footer>
					</article>
				</div>
			) : null}
		</>
	);
};
