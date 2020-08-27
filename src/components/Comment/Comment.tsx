import React, { useState } from 'react';
import styles from './Comment.module.scss';
import { CommentType } from '../../app/types';
import { db } from '../../app/config';
import Textarea from '../../components/Inputs/Textarea';
import Button from '../../components/Button/Button';

import { useDispatch, useSelector } from 'react-redux';
import { deleteComment, editComment } from '../../app/postsSlice';
import { selectUser } from '../../app/userSlice';

import { InputType } from '../../app/types';

import trashIcon from '../../assets/images/delete.svg';
import editIcon from '../../assets/images/edit.svg';
import moreIcon from '../../assets/images/more.svg';

interface Inputs {
	body: InputType;
}

type KeyOfInputs = keyof Inputs;

export default ({
	commentId,
	postId,
	uid,
	body,
	activity,
	createdAt,
	name,
	profilePic,
}: CommentType) => {
	const dispatch = useDispatch();
	const user = useSelector(selectUser);
	const [editing, setEditing] = useState(false);
	const [inputs, setInputs] = useState<Inputs>({
		body: {
			value: body,
			label: 'Comment',
			animateUp: !!body,
			empty: !body,
			touched: false,
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
				touched: true,
			},
		}));
	};

	const handleBlur = (
		e: React.FormEvent<HTMLInputElement>,
		newestType: KeyOfInputs
	) => {
		//animation & output error if empty
		let targetEmpty =
			inputs[newestType].touched && inputs[newestType].value.length === 0
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

	const submitCommentEdits = (e: React.SyntheticEvent) => {
		//pre default form submission
		e.preventDefault();

		//if body text has not been touched/edited, ignore submit button
		if (!inputs.body.touched || inputs.body.empty || !inputs.body.value) {
			return;
		}

		//check for errors

		console.log('[Comment]: data entered: ', inputs.body.value);
		//close editing dialog
		setEditing(false);
		//update comment UI immediately
		dispatch(
			editComment({
				postId,
				commentId,
				body: inputs.body.value,
			})
		);
		db.collection('posts')
			.doc(postId)
			.collection('comments')
			.doc(commentId)
			.update({
				body: inputs.body.value,
			})
			.then((doc) => {
				console.log('[Comment]: Comment successfully edited in database!');
				/* setInputs((prevState: Inputs) => ({
					...prevState,
					body: {
						...prevState.body,
						//animation
						value: body,
						animateUp: !!body,
						empty: !body,
					},
				})); */
			})
			.catch((error) => {
				console.error(error);
				alert('Sorry, there was a server error. Please try again later.');
			});
	};

	const deleteCommentHandler = () => {
		if (window.confirm('Are you sure you want to delete this comment?')) {
			db.collection('posts')
				.doc(postId)
				.collection('comments')
				.doc(commentId)
				.delete()
				.then(() => {
					console.log('[Comment]: Comment successfully deleted from database!');
					dispatch(
						deleteComment({
							postId,
							commentId,
						})
					);
				})
				.catch((err) => {
					console.error(err);
				});
		}
	};

	const editCommentButtonClickHandler = () => {
		setEditing((prevState) => !prevState);
	};

	return (
		<section className={styles.comment}>
			<img src={profilePic} alt='profile' className={styles.profilePic}></img>
			<header>
				<h3 className={styles.name}>{name}</h3>
				<time className={styles.time}>{createdAt}</time>
				<p className={styles.activity}>{activity}</p>
				{user.uid === uid ? (
					<>
						<div className={styles.more}>
							<button>
								<img src={moreIcon} alt='more' />
							</button>
							<div className={styles.hiddenMenu}>
								<button onClick={editCommentButtonClickHandler}>
									<img src={editIcon} alt='edit' />
								</button>
								<button onClick={deleteCommentHandler}>
									<img src={trashIcon} alt='delete' />
								</button>
							</div>
						</div>
					</>
				) : null}
			</header>
			<main>
				{editing ? (
					<form onSubmit={submitCommentEdits}>
						<Textarea
							type='body'
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
							inputs={inputs}
						/>
						<Button type='submit'>Submit</Button>
					</form>
				) : (
					<p className={styles.body}>{body}</p>
				)}
			</main>
		</section>
	);
};
