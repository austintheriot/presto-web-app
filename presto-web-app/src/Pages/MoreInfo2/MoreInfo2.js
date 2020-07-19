import React from 'react';
import styles from './MoreInfo2.module.css';

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
      <h1 className={styles.title}>More Info 2</h1>
    </>
  );
};
