export default ({
  email = null,
  password = null,
  confirmPassword = null,
  isSignup = false,
  emailTouched = false,
  passwordTouched = false,
  confirmPasswordTouched = false,
  submittingForm = false,
}) => {
  let errors = {
    email: null,
    password: null,
    confirmPassword: null,
  };
  //validate email
  // eslint-disable-next-line no-control-regex
  let regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  if (email && !email.match(regex)) errors.email = 'Invalid email';
  if (password && confirmPassword && password !== confirmPassword)
    errors.confirmPassword = 'Passwords do not match';
  if (
    //error if touched
    (email !== null && emailTouched && email.length === 0) ||
    //error if submitted without touching
    (email !== null && submittingForm && email.length === 0)
  )
    errors.email = 'This field is required';
  if (
    //error if touched
    (password !== null && passwordTouched && password.length === 0) ||
    //error if submitted without touching
    (password !== null && submittingForm && password.length === 0)
  )
    errors.password = 'This field is required';
  if (
    //error if touched
    (confirmPassword !== null &&
      confirmPasswordTouched &&
      confirmPassword.length === 0) ||
    //error if submitted without touching
    (confirmPassword !== null && submittingForm && confirmPassword.length === 0)
  )
    errors.confirmPassword = 'This field is required';

  //check length only for sign up sheets
  if (isSignup) {
    if (password && password.length > 30 && password.length !== 0) {
      errors.password = 'Password is too long';
    }
    if (password && password.length < 6 && password.length !== 0) {
      errors.password = 'Password is too short';
    }
  }
  return errors;
};
