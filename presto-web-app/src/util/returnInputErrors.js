export default ({
  email,
  password,
  confirmPassword,
  isSignup,
  emailTouched,
  passwordTouched,
  confirmPasswordTouched,
}) => {
  let errors = {
    email: null,
    password: null,
    confirmPassword: null,
  };
  //validate email
  // eslint-disable-next-line no-control-regex
  let regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  if (!email.match(regex)) errors.email = 'Invalid email';
  if (password && confirmPassword && password !== confirmPassword)
    errors.confirmPassword = 'Passwords do not match';
  if (emailTouched && email.length === 0) errors.email = 'Email is required';
  if (passwordTouched && password.length === 0)
    errors.password = 'Password is required';
  if (
    emailTouched &&
    email.length === 0 &&
    passwordTouched &&
    password.length === 0
  ) {
    errors.email = 'Email and password are required';
    errors.password = 'Email and password are required';
  }

  if (confirmPasswordTouched && confirmPassword.length === 0)
    errors.confirmPassword = 'Confirm password is required';

  //check length only for sign up sheets
  if (isSignup) {
    if (password.length > 30 && password.length !== 0) {
      errors.password = 'Password is too long';
    }
    if (password.length < 6 && password.length !== 0) {
      errors.password = 'Password is too short';
    }
  }
  return errors;
};
