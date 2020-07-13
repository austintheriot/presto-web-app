import isNotValid from './isNotValid';

export default (newData, type, email, password, confirmPassword) => {
  if (type === 'email') {
    if (isNotValid(newData, 'email', true)) {
      return isNotValid(newData, 'email', true);
    }
    if (password) {
      if (isNotValid(password, 'password', true)) {
        return isNotValid(password, 'password', true);
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
      if (isNotValid(email, 'email', true)) {
        return isNotValid(email, 'email', true);
      }
    }
    if (isNotValid(newData, 'password', true)) {
      return isNotValid(newData, 'password', true);
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
      if (isNotValid(email, 'email', true)) {
        return isNotValid(email, 'email', true);
      }
    }
    if (password) {
      if (isNotValid(password, 'password', true)) {
        return isNotValid(password, 'password', true);
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
