import React from 'react';
import styles from 'MoreInfo1.module.css';

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
      <h1 className={styles.title}>Thank's for signing up!</h1>
      <p>
        One more step. Add some info about yourself so that others can message
        you and hire you (you can edit this later).
      </p>
    </>
  );
};
