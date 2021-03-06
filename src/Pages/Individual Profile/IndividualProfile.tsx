import React, { useState, useEffect } from 'react';
import styles from './IndividualProfile.module.scss';
import { db, documentId } from 'app/config';
import Nav from 'components/Nav/Nav';

import { ProfileType } from 'app/types';

import websiteIcon from 'assets/images/website.svg';
import bioIcon from 'assets/images/info.svg';
import joinedIcon from 'assets/images/calendar.svg';
import activityIcon from 'assets/images/activity.svg';
import instrumentIcon from 'assets/images/instrument.svg';
import SpacerMedium from 'components/Spacers/SpacerMedium';
import { LocationDisplay } from 'components/LocationDisplay/LocationDisplay';
import ProfilePicture from 'components/ProfilePicture/ProfilePicture';
import formatDate from 'app/formatDate';

interface State {
	profile: ProfileType;
	status: string;
	error: string | null;
}

export default () => {
	window.scrollTo(0, 0);

	const [profile, setProfile] = useState<State>({
		profile: {},
		status: 'idle', //idle, loading, success, failed
		error: null,
	});

	let profileId = window.location.pathname.split('/profile/')[1];
	const fetchProfile = () => {
		console.log(
			'[IndividualProfile]: Searching database for doc with ID of: ',
			profileId
		);
		setProfile((prevState) => ({
			...prevState, //keep any info or error messages already there, show loading screen
			status: 'loading', //idle, loading, complete, failed
		}));
		db.collection('users')
			.where(documentId(), '==', profileId)
			.onSnapshot(
				(querySnapshot) => {
					console.log('[IndividualProfile]: Profile data recieved');
					//if URL leads to a valid profile:
					if (!querySnapshot.empty) {
						querySnapshot.forEach((doc) => {
							console.log(
								'[IndividualProfile]: setting profile with doc.data()'
							);
							let profile = { uid: doc['id'], ...doc.data() };
							setProfile({
								profile,
								status: 'success', //idle, loading, success, falied
								error: null,
							});
						});
					}

					//else if URL does not lead to a valid post:
					else {
						console.log(
							'[IndividualProfile]: No profile found. Displaying message instead.'
						);
						setProfile(() => ({
							profile: {}, //keep any profile already loaded, show error
							status: 'failed', //idle, loading, complete, failed
							error: 'No profile found at this URL',
						}));
					}
				},

				//if an error occurs:
				(error) => {
					console.log(
						'[IndividualProfile]: Error occured. Displaying error message to user. (User probably logged out)'
					);
					/* console.error(error);
					setProfile((prevState) => ({
						...prevState, //keep any data already loaded, show error
						status: 'failed', //idle, loading, success, falied
						error: 'Sorry, there was an error. Please try again later.',
					})); */
				}
			);
	};

	useEffect(() => {
		if (profile.status === 'idle') {
			fetchProfile();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let formattedDate = '';
	if (profile.status === 'success' && profile.profile.createdAt) {
		formattedDate = formatDate(profile.profile.createdAt);
	}

	return (
		<>
			<Nav />
			{profile.status === 'idle' ? null : profile.status === 'loading' ? (
				<p className={styles.message}>Loading profile...</p>
			) : profile.status === 'failed' ? (
				<p className={styles.message}>{profile.error}</p>
			) : profile.status === 'success' ? (
				<>
					{/* User's Name */}
					<h1 className={styles.name}>{profile.profile.name}</h1>

					{/* Location */}
					<LocationDisplay user={profile.profile} />

					{/* Profile Picture */}
					<ProfilePicture size={'large'} src={profile.profile.profilePic} />

					<section className={styles.profileSettings}>
						{/* ACTIVITY */}
						<img
							src={activityIcon}
							alt='activity'
							className={styles.activityIcon}
						/>
						<p className={styles.activity}>
							{profile.profile.activity || 'n/a'}
						</p>
						{/* INSTRUMENT */}
						<img
							src={instrumentIcon}
							alt='instrument'
							className={styles.instrumentIcon}
						/>
						<p className={styles.instrument}>
							{profile.profile.instrument || 'n/a'}
						</p>
						{/* BIO */}
						<img src={bioIcon} alt='bio' className={styles.bioIcon} />
						<p className={styles.bio}>{profile.profile.bio || 'n/a'}</p>
						{/* WEBSITE */}
						{profile.profile.website ? (
							<>
								<a
									href={profile.profile.website}
									target='_blank'
									rel='noopener noreferrer'
									className={styles.websiteIcon}>
									<img
										src={websiteIcon}
										alt='website'
										className={styles.websiteIcon}
									/>
								</a>
								<a
									href={profile.profile.website}
									target='_blank'
									rel='noopener noreferrer'
									className={styles.website}>
									{profile.profile.website || 'n/a'}
								</a>
							</>
						) : (
							<>
								<img
									src={websiteIcon}
									alt='website'
									className={styles.websiteIcon}
								/>
								<p className={styles.website}>n/a</p>
							</>
						)}
						{/* JOINED */}
						<img
							src={joinedIcon}
							alt='calendar'
							className={styles.joinedIcon}
						/>
						<p className={styles.joined}>
							Joined: {formattedDate ? formattedDate : ''}
						</p>
					</section>
				</>
			) : null}
			<SpacerMedium />
		</>
	);
};
