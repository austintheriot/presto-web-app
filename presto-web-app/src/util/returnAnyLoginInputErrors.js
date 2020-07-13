import isNotValid from './isNotValid';

export default (newData, type, email, password) => {
  if (type === 'email') {
    if (isNotValid(newData, 'email')) {
      return isNotValid(newData, 'email');
    }
    if (password) {
      if (isNotValid(password, 'password')) {
        return isNotValid(password, 'password');
      }
    }
  }
  if (type === 'password') {
    if (email) {
      if (isNotValid(email, 'email')) {
        return isNotValid(email, 'email');
      }
    }
    if (isNotValid(newData, 'password')) {
      return isNotValid(newData, 'password');
    }
  }
};
