import { useEffect, useState } from 'react';
import noProfilePic from 'assets/images/no-img.svg';
import emptyPic from 'assets/images/empty-img.svg';
import { storage } from 'app/config';

const getProfilePicUrlFromStorage = async (
	uid: string,
	setProfilePictureUrl: React.Dispatch<React.SetStateAction<string>>
) => {
	try {
		//search database for image matching uid
		const ref = storage.ref().child('profile_pictures').child(uid);
		const url: string = await ref.getDownloadURL();
		setProfilePictureUrl(url);
	} catch (err) {
		console.log(
			"[useProfilePicture.ts]: Couldn't retrieve user's profile picture."
		);
		console.log(err);
		//if no image found, use noProfilePic default
		setProfilePictureUrl(noProfilePic);
	}
};

//bypass saved profile picture data in post
//try to get most up-to-date user profile picture from storage using user's uid
//if that doesn't work, default to noProfilePic img default
export default (uid: string) => {
	const [profilePictureUrl, setProfilePictureUrl] = useState(emptyPic); //show empty picture while loading profile picture
	useEffect(() => {
		getProfilePicUrlFromStorage(uid, setProfilePictureUrl);
	}, [uid]);
	return profilePictureUrl;
};
