import React from 'react';
import styles from './SignupProfile.module.css';
import ProgressBar from '../../components/ProgressBar/ProgressBar';

//To update a user's profile:
/* user.updateProfile({
  displayName: "Jane Q. User",
  photoURL: "https://example.com/jane-q-user/profile.jpg"
}).then(function() {
  // Update successful.
}).catch(function(error) {
  // An error happened.
});
 */

export default () => {
  return (
    <>
      <ProgressBar
        signup='complete'
        personal='complete'
        location='complete'
        profile='inProgress'
      />
      <h1 className={styles.title}>Profile</h1>
    </>
  );
};
