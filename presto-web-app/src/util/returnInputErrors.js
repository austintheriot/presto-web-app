import isNotValid from './isNotValid';

export default (
  newData,
  type,
  email = null,
  password = null,
  confirmPassword = null,
  isSignup = null
) => {
  if (type === 'email') {
    if (isNotValid(newData, 'email', isSignup)) {
      return isNotValid(newData, 'email', isSignup);
    }
    if (password) {
      if (isNotValid(password, 'password', isSignup)) {
        return isNotValid(password, 'password', isSignup);
      }
    }
    //if no issues with email or password, and confirmPassword has some data:
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        return 'Passwords do not match';
      } else {
        return null;
      }
      //if no issues with email or password, and confirmPassword has no data yet:
    } else {
      return null;
    }
  }
  if (type === 'password') {
    if (email) {
      if (isNotValid(email, 'email', isSignup)) {
        return isNotValid(email, 'email', isSignup);
      }
    }
    if (isNotValid(newData, 'password', isSignup)) {
      return isNotValid(newData, 'password', isSignup);
    }
    //if no issues with email or password, and confirmPassword has some data:
    if (newData && confirmPassword) {
      if (newData !== confirmPassword) {
        return 'Passwords do not match';
      } else {
        return null;
      }
      //if no issues with email or password, and confirmPassword has no data yet:
    } else {
      return null;
    }
  }
  if (type === 'confirmPassword') {
    if (email) {
      if (isNotValid(email, 'email', isSignup)) {
        return isNotValid(email, 'email', isSignup);
      }
    }
    if (password) {
      if (isNotValid(password, 'password', isSignup)) {
        return isNotValid(password, 'password', isSignup);
      }
    }
    //if no issues with email or password, and confirmPassword has some data:
    if (password && newData) {
      if (password !== newData) {
        return 'Passwords do not match';
      } else {
        return null;
      }
      //if no issues with email or password, and confirmPassword has no data yet:
    } else {
      return null;
    }
  }
};
