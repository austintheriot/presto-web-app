// import React, { useState } from 'react';
// import * as firebase from 'firebase/app';
// import 'firebase/analytics';
// import 'firebase/auth';
// import 'firebase/firestore';
// import Modal from '../../components/Modal/Modal';
// import { Redirect, Link } from 'react-router-dom';
// import Input from '../../components/Input/Input';
// import styles from './SignupProfile.module.css';
// import { useAuth } from '../../context/AuthProvider';
// import ProgressBar from '../../components/ProgressBar/ProgressBar';

// //redirect with AuthContext once setInputs permeates down to component

// export default function Login(props) {
//   let user = useAuth();
//   const [inputs, setInputs] = useState({
//     activities: {
//       label: 'Musical Activities',
//       value: '',
//       animateUp: false,
//       empty: true,
//       touched: false,
//       message: {
//         error: false,
//         text: 'i.e. Performer, Composer, Teacher, etc.',
//         default: 'i.e. Performer, Composer, Teacher, etc.',
//       },
//     },
//     instruments: {
//       label: 'Instrument(s)',
//       value: '',
//       animateUp: false,
//       empty: true,
//       touched: false,
//       message: {
//         error: false,
//         text: 'i.e. Piano, Violin, Soprano, etc.',
//         default: 'i.e. Piano, Violin, Soprano, etc.',
//       },
//     },
//     websites: {
//       label: 'Website(s)',
//       value: '',
//       animateUp: false,
//       empty: true,
//       touched: false,
//       message: {
//         error: false,
//         text: 'Please separate entries with commas.',
//         default: 'Please separate entries with commas.',
//       },
//     },
//     bio: {
//       label: 'Short Bio',
//       value: '',
//       animateUp: false,
//       empty: true,
//       touched: false,
//       message: {
//         error: false,
//         text: 'Tell us a little about yourself.',
//         default: 'Tell us a little about yourself.',
//       },
//     },
//   });
//   const [modalMessage, setModalMessage] = useState('');
//   const [submitted, setSubmitted] = useState(false);

//   const handleFocus = (event, newestType) => {
//     //animation
//     setInputs((prevState) => ({
//       ...prevState,
//       [newestType]: {
//         ...prevState[newestType],
//         animateUp: true,
//         touched: true,
//       },
//     }));
//   };

//   const handleBlur = (event, newestType) => {
//     //animation & output error if empty
//     let targetEmpty =
//       inputs[newestType].touched && inputs[newestType].value.length === 0
//         ? true
//         : false;

//     setInputs((prevState) => ({
//       ...prevState,
//       [newestType]: {
//         ...prevState[newestType],
//         //animation
//         animateUp: targetEmpty ? false : true,
//       },
//     }));
//   };

//   const handleChange = (event, newestType) => {
//     let targetValue = event.target.value;
//     let targetEmpty = targetValue.length === 0 ? true : false;

//     //validate inputs

//     //update state for all inputs
//     Object.keys(inputs).forEach((inputType) => {
//       setInputs((prevState) => ({
//         ...prevState,
//         [inputType]: {
//           ...prevState[inputType],

//           //update generic values
//           value:
//             inputType === newestType ? targetValue : prevState[inputType].value,
//           empty:
//             inputType === newestType ? targetEmpty : prevState[inputType].empty,
//           //update errors: If no error, set to empty
//           /*  message: {
//             ...prevState[inputType].message,
//             error: errors[inputType] ? true : false,
//             text: errors[inputType]
//               ? errors[inputType]
//               : prevState[inputType].message.default,
//           }, */
//         },
//       }));
//     });
//   };

//   const submitHandler = (event) => {
//     //prevent default form submission
//     event.preventDefault();

//     //check for errors

//     //update name and username of user
//     // firebase
//     //   .firestore()
//     //   .collection('users')
//     //   .doc(user.uid)
//     //   .set(
//     //     {
//     //       name: inputs.name.value,
//     //       type: radioValue,
//     //     },
//     //     { merge: true }
//     //   )
//     //   .then(() => {
//     //     console.log('Document successfully written!');
//     //     //redirect on successful submission
//     //     setSubmitted(true);
//     //   })
//     //   .catch((error) => {
//     //     console.error(error);
//     //     setModalMessage('Server error. Please try again later.');
//     //   });
//   };

//   //top modal:
//   let infoMessage = props.history?.location?.state?.infoMessage;

//   return (
//     //display modal message if redirected from another page requiring authentication:
//     <>
//       <div className={styles.SkipDiv}>
//         <Link to='/home'>Skip</Link>
//       </div>
//       {submitted ? <Redirect to={'/signup/location'} /> : null}
//       {infoMessage ? <Modal message={infoMessage} color='black' /> : null}
//       <ProgressBar
//         signup='complete'
//         personal='complete'
//         location='complete'
//         profile='inProgress'
//       />
//       <h1 className={styles.title}>Profile</h1>
//       <form onSubmit={submitHandler}>
//         <Input
//           type='text'
//           customType='activities'
//           handleFocus={(e) => handleFocus(e, 'activities')}
//           handleBlur={(e) => handleBlur(e, 'activities')}
//           handleChange={(e) => handleChange(e, 'activities')}
//           label={'Musical Activities'}
//           inputs={inputs}
//         />
//         <Input
//           type='text'
//           customType='instruments'
//           handleFocus={(e) => handleFocus(e, 'instruments')}
//           handleBlur={(e) => handleBlur(e, 'instruments')}
//           handleChange={(e) => handleChange(e, 'instruments')}
//           label={'Instrument(s)'}
//           inputs={inputs}
//         />
//         <Input
//           type='text'
//           customType='websites'
//           handleFocus={(e) => handleFocus(e, 'websites')}
//           handleBlur={(e) => handleBlur(e, 'websites')}
//           handleChange={(e) => handleChange(e, 'websites')}
//           label={'Website(s)'}
//           inputs={inputs}
//         />
//         <Input
//           type='text'
//           customType='bio'
//           handleFocus={(e) => handleFocus(e, 'bio')}
//           handleBlur={(e) => handleBlur(e, 'bio')}
//           handleChange={(e) => handleChange(e, 'bio')}
//           label={'Short Bio'}
//           inputs={inputs}
//         />

//         <Modal message={modalMessage} color='black' />
//         <div className={styles.buttonsDiv}>
//           <Link to='/' className={styles.linkLeft}>
//             <img
//               className={styles.linkLeftImg}
//               src={require('../../assets/images/arrow-left.svg')}
//               alt='back'
//             />
//           </Link>

//           <button
//             className={styles.linkRight}
//             type='submit'
//             onClick={submitHandler}>
//             <img
//               className={styles.linkRightImg}
//               src={require('../../assets/images/arrow-right.svg')}
//               alt='continue'
//             />
//           </button>
//         </div>
//       </form>
//       <div className='spacerMedium'></div>
//     </>
//   );
// }
