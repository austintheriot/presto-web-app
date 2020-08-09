import React, { useState, useEffect } from 'react';
import styles from './IndividualProfile.module.scss';
import * as firebase from 'firebase/app';
import 'firebase/firebase-firestore';
import { db } from '../../util/config';
import Nav from '../../components/Nav/Nav';

import locationIcon from '../../assets/images/location.svg';
import websiteIcon from '../../assets/images/website.svg';
import bioIcon from '../../assets/images/info.svg';
import joinedIcon from '../../assets/images/calendar.svg';
import activityIcon from '../../assets/images/activity.svg';
import instrumentIcon from '../../assets/images/instrument.svg';

export default (props) => {
	const [profile, setProfile] = useState({ init: false, valid: false });

	let profileId = window.location.pathname.split('/profile/')[1];
	const fetchProfile = () => {
		console.log(
			'[IndividualProfile]: Searching database for doc with ID of: ',
			profileId
		);
		db.collection('users')
			.where(firebase.firestore.FieldPath.documentId(), '==', profileId)
			.onSnapshot(
				(querySnapshot) => {
					console.log('[IndividualProfile]: Profile data recieved');
					//if URL leads to a valid profile:
					if (!querySnapshot.empty) {
						querySnapshot.forEach((doc) => {
							console.log(
								'[IndividualProfile]: setting profile with doc.data()'
							);
							let userProfile = { init: true, valid: true, ...doc.data() };
							setProfile(userProfile);
						});
					}

					//else if URL does not lead to a valid post:
					else {
						console.log('[IndividualProfile]: Setting profile as invalid');
						setProfile({ init: true, valid: false });
					}
				},

				//if an error occurs:
				(error) => {
					console.error(error);
					setProfile({ init: true, valid: false });
				}
			);
	};

	useEffect(() => {
		fetchProfile();
	}, []);

	let formattedDate;
	if (profile?.createdAt) {
		let dateArray = profile.createdAt.toDate().toDateString().split(' ');
		formattedDate = [dateArray[1], dateArray[2] + ',', dateArray[3]].join(' ');
	}

	return (
		<>
			<Nav />
			{
				//Profile initialized yet?
				!profile.init ? (
					<p className={styles.message}>Loading post...</p>
				) : //Once profile is initialized, is it valid?
				profile.valid ? (
					<section className={styles.individualProfile}>
						<h1 className={styles.name}>{profile.name}</h1>
						<img
							src={profile.profilePic}
							alt='profile'
							className={styles.profilePic}
						/>
						{/* LOCATION */}
						<p className={styles.location}>
							<img
								src={locationIcon}
								alt='location'
								className={styles.locationIcon}
							/>
							{/* If city and state both shown, don't show country. 
							If one isn't defined, show country, and add an apostrophe before it. */}
							{profile.city ? profile.city + ', ' : null}
							{profile.state
								? profile.state + (profile.city ? '' : ', ')
								: null}
							{profile.city && profile.state
								? null
								: profile.country
								? profile.country
								: 'Unknown'}
						</p>
						{/* ACTIVITY */}
						<img
							src={activityIcon}
							alt='activity'
							className={styles.activityIcon}
						/>
						<p className={styles.activity}>{profile.activity}</p>
						{/* INSTRUMENT */}
						<img
							src={instrumentIcon}
							alt='instrument'
							className={styles.instrumentIcon}
						/>
						<p className={styles.instrument}>{profile.instrument}</p>
						{/* BIO */}
						<img src={bioIcon} alt='bio' className={styles.bioIcon} />
						<p className={styles.bio}>{profile.bio}</p>
						{/* WEBSITE */}
						<a
							href={profile.website}
							target='_blank'
							rel='noreferrer noopener'
							className={styles.websiteIcon}>
							<img
								src={websiteIcon}
								alt='website'
								className={styles.websiteIcon}
							/>
						</a>
						<a
							href={profile.website}
							target='_blank'
							rel='noreferrer noopener'
							className={styles.website}>
							{profile.website}
						</a>
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
				) : (
					//Once profile is initialized, if it's not valid, show profile not found.
					<p className={styles.message}>Sorry, no profile found at this URL.</p>
				)
			}
		</>
	);
};
