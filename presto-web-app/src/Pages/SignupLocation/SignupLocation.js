import React, { useState } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import Modal from '../../components/Modal/Modal';
import { Redirect, Link } from 'react-router-dom';
import Input from '../../components/Input/Input';
import { useAuth } from '../../context/AuthProvider';
import Button from '../../components/Button/Button';
import geoapifyKey from '../../util/geoapifyKey';
import styles from './SignupLocation.module.css';

//redirect with AuthContext once setInputs permeates down to component

export default function Login(props) {
  let user = useAuth();
  const [inputs, setInputs] = useState({
    location: {
      value: '',
      animateUp: false,
      empty: true,
      touched: false,
      suggestions: {
        loading: false,
        array: null,
      },
      message: {
        error: false,
        text: 'e.g. Address/City/State/Zip Code, etc.',
        default: 'e.g. Address/City/State/Zip Code, etc.',
      },
    },
    city: {
      value: '',
      animateUp: false,
      empty: true,
      touched: false,
      suggestions: null,
      message: {
        error: false,
        text: '',
        default: '',
      },
    },
    county: {
      label: 'County',
      value: '',
      animateUp: false,
      empty: true,
      touched: false,
      suggestions: null,
      message: {
        error: false,
        text: '',
        default: '',
      },
    },
    state: {
      value: '',
      animateUp: false,
      empty: true,
      touched: false,
      suggestions: null,
      message: {
        error: false,
        text: '',
        default: '',
      },
    },
    zip: {
      label: 'Zip Code',
      value: '',
      animateUp: false,
      empty: true,
      touched: false,
      suggestions: null,
      message: {
        error: false,
        text: '',
        default: '',
      },
    },
    country: {
      label: 'Full Name',
      value: '',
      animateUp: false,
      empty: true,
      touched: false,
      suggestions: null,
      message: {
        error: false,
        text: '',
        default: '',
      },
    },
  });
  const [suggestions, setSuggestions] = useState([]);
  const [modalMessage, setModalMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [timerId, setTimerId] = useState(null);

  React.useEffect(() => {
    // console.log(inputs);
  });

  const handleFocus = (event, newestType) => {
    //animation
    setInputs((prevState) => ({
      ...prevState,
      [newestType]: {
        ...prevState[newestType],
        animateUp: true,
        touched: true,
      },
    }));
  };

  const handleBlur = (event, newestType) => {
    //animation & output error if empty
    let targetEmpty =
      inputs[newestType]?.touched && inputs[newestType]?.value?.length === 0
        ? true
        : false;

    setInputs((prevState) => ({
      ...prevState,
      [newestType]: {
        ...prevState[newestType],
        //animation
        animateUp: targetEmpty ? false : true,
      },
    }));
  };

  const handleChange = (event, newestType) => {
    let targetValue = event.target.value;
    let targetEmpty = targetValue.length === 0 ? true : false;

    //validate unputs

    //update state for all inputs
    Object.keys(inputs).forEach((inputType) => {
      setInputs((prevState) => ({
        ...prevState,
        [inputType]: {
          ...prevState[inputType],

          //update generic values
          value:
            inputType === newestType ? targetValue : prevState[inputType].value,
          empty:
            inputType === newestType ? targetEmpty : prevState[inputType].empty,
          //update errors: If no error, set to empty
          /* message: {
            ...prevState[inputType].message,
            error: errors[inputType] ? true : false,
            text: errors[inputType]
              ? errors[inputType]
              : prevState[inputType].message.default, 
          }, */
        },
      }));
    });

    if (newestType === 'location' && targetValue) {
      console.log('Loading autocomplete suggestions...');
      let requestDelay = 500;
      clearTimeout(timerId);
      setTimerId(
        setTimeout(
          sendAutoCompleteRequest.bind(this, targetValue),
          requestDelay
        )
      );
      //set autocomplete to loading
      setInputs((prevState) => ({
        ...prevState,
        location: {
          ...prevState.location,
          suggestions: {
            loading: true,
            array: false,
          },
        },
      }));
    }
  };

  const sendAutoCompleteRequest = (locationInputValue) => {
    console.log('sending request for: ', locationInputValue);

    let key = geoapifyKey;
    let requestUrl = `https://api.geoapify.com/v1/geocode/autocomplete?text=${locationInputValue}&limit=5&apiKey=${key}`;
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open('GET', requestUrl);
    xhr.responseType = 'json';
    xhr.send(null);
    xhr.onerror = () => {
      console.error('Request failed');
      setModalMessage(`Sorry, we couldn't find your location.`);
    };
    xhr.onload = () => {
      if (xhr.status !== 200) {
        // analyze HTTP status of the response
        console.error(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
      } else {
        //if the response succeeds:
        let geoapifyData = xhr.response.features;
        //turn data into an array of objects for later recall
        let collectedDataArray = geoapifyData.map(({ properties }) => {
          return {
            city: properties.city || null,
            state: properties.state || null,
            county: properties.county || null,
            zip: properties.postcode || null,
            country: properties.country || null,
          };
        });
        //store suggestions for later access when list item is clicked
        setSuggestions(collectedDataArray);

        //format data to be usable for the suggestions drop down menu
        let collectedDataArrayFormatted = collectedDataArray.map((el) => {
          return [el.city, el.state, el.country, el.postcode]
            .filter((el) => el !== null && el !== undefined && el !== '')
            .join(', ')
            .trim();
        });
        //update autocomplete suggestions for location input
        setInputs((prevState) => ({
          ...prevState,
          location: {
            ...prevState.location,
            suggestions: {
              loading: false,
              array: collectedDataArrayFormatted,
            },
          },
        }));
      }
    };
  };

  const suggestionClickHandler = (e, i) => {
    console.log(i, suggestions[i]);
    let selectedLocation = suggestions[i];
    Object.keys(inputs).forEach((inputType) => {
      setInputs((prevState) => ({
        ...prevState,
        [inputType]: {
          ...prevState[inputType],
          animateUp: true,
          value: selectedLocation[inputType] || '',
          empty: false,
          suggestions: null,
        },
      }));
    });
    setSuggestions([]);
    //allow click elsewhere to close suggestions menu
  };

  const getLocation = () => {
    const options = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0,
    };

    const handleGeolocationSuccess = (pos) => {
      let key = geoapifyKey;
      let latitude = pos.coords.latitude;
      let longitude = pos.coords.longitude;
      let requestUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&limit=1&apiKey=${key}`;
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = false;
      xhr.open('GET', requestUrl);
      xhr.responseType = 'json';
      xhr.send(null);
      xhr.onerror = () => {
        console.error('Request failed');
        setModalMessage(`Sorry, we couldn't find your location.`);
      };
      xhr.onload = (data) => {
        if (xhr.status !== 200) {
          // analyze HTTP status of the response
          console.error(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
        } else {
          //if the response succeeds:
          let properties = xhr.response.features[0].properties;
          //reduce info to necessary fields:
          let locationInfoObject = {
            lat: latitude,
            lon: longitude,
            city: properties.city,
            county: properties.county,
            state: properties.state,
            country: properties.country,
            zip: properties.postcode,
          };

          //update state for each input
          Object.keys(inputs).forEach((inputType) => {
            setInputs((prevState) => ({
              ...prevState,
              [inputType]: {
                ...prevState[inputType],
                animateUp: true,
                //update generic values -- make sure value has a string
                value: locationInfoObject[inputType] || '',
                empty: false,
                //update errors: If no error, set to empty
                /* message: {
                  ...prevState[inputType].message,
                  error: errors[inputType] ? true : false,
                  text: errors[inputType]
                    ? errors[inputType]
                    : prevState[inputType].message.default,
                }, */
              },
            }));
          });
        }
      };
    };

    const handleGeolocationFail = (err) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
      setModalMessage(`Sorry, we couldn't find your location.`);
    };

    //if Geolocation is supported, call it (see above)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        handleGeolocationSuccess,
        handleGeolocationFail,
        options
      );
    } else {
      setModalMessage('Geolocation is not supported by this browser.');
    }
  };

  const submitHandler = (event) => {
    //prevent default form submission
    event.preventDefault();

    //update location of user
    firebase
      .firestore()
      .collection('users')
      .doc(user.uid)
      .set(
        {
          city: inputs.city.value,
          county: inputs.county.value,
          state: inputs.state.value,
          zip: inputs.zip.value,
          country: inputs.country.value,
        },
        { merge: true }
      )
      .then(() => {
        console.log('Document successfully written!');
        //redirect on successful submission
        setSubmitted(true);
      })
      .catch((error) => {
        console.error(error);
        setModalMessage('Server error. Please try again later.');
      });
  };

  //top modal:
  let infoMessage = props.history?.location?.state?.infoMessage;

  return (
    //display modal message if redirected from another page requiring authentication:
    <>
      <div className={styles.SkipDiv}>
        <Link to='/signup/profile'>Skip</Link>
      </div>
      {submitted ? <Redirect to={'/signup/profile'} /> : null}
      <h1 className={styles.title}>Location</h1>
      <p className={styles.subtitle}>
        Where are you based out of? This information is public, and will allow
        you to write posts in the location that helps you get the most gigs (you
        can edit this later).
      </p>
      {infoMessage ? <Modal message={infoMessage} color='black' /> : null}
      <Modal message={modalMessage} color='black' />
      <Button onClick={getLocation}>Autofill Location</Button>
      <p>Or manually input:</p>
      <Input
        type='text'
        customType='location'
        handleFocus={(e) => handleFocus(e, 'location')}
        handleBlur={(e) => handleBlur(e, 'location')}
        handleChange={(e) => handleChange(e, 'location')}
        label={'Location'}
        inputs={inputs}
        suggestionClickHandler={suggestionClickHandler}
      />
      <div className={styles.spacer}></div>
      <form onSubmit={submitHandler}>
        <fieldset className={styles.fieldset}>
          <Input
            readOnly={true}
            type='text'
            customType='city'
            handleFocus={(e) => handleFocus(e, 'city')}
            handleBlur={(e) => handleBlur(e, 'city')}
            handleChange={(e) => handleChange(e, 'city')}
            label={'City'}
            inputs={inputs}
          />
          <Input
            readOnly={true}
            type='text'
            customType='county'
            handleFocus={(e) => handleFocus(e, 'county')}
            handleBlur={(e) => handleBlur(e, 'county')}
            handleChange={(e) => handleChange(e, 'county')}
            label={'County'}
            inputs={inputs}
          />
          <Input
            readOnly={true}
            type='text'
            customType='zip'
            handleFocus={(e) => handleFocus(e, 'zip')}
            handleBlur={(e) => handleBlur(e, 'zip')}
            handleChange={(e) => handleChange(e, 'zip')}
            label={'Zip Code'}
            inputs={inputs}
          />
          <Input
            readOnly={true}
            type='text'
            customType='state'
            handleFocus={(e) => handleFocus(e, 'state')}
            handleBlur={(e) => handleBlur(e, 'state')}
            handleChange={(e) => handleChange(e, 'state')}
            label={'State'}
            inputs={inputs}
          />
          <Input
            readOnly={true}
            type='text'
            customType='country'
            handleFocus={(e) => handleFocus(e, 'country')}
            handleBlur={(e) => handleBlur(e, 'country')}
            handleChange={(e) => handleChange(e, 'country')}
            label={'Country'}
            inputs={inputs}
          />
        </fieldset>

        <div className={styles.buttonsDiv}>
          <Link to='/personal' className={styles.linkLeft}>
            <img
              className={styles.linkLeftImg}
              src={require('../../assets/images/arrow-left.svg')}
              alt='back'
            />
          </Link>

          <button
            className={styles.linkRight}
            type='submit'
            onClick={submitHandler}>
            <img
              className={styles.linkRightImg}
              src={require('../../assets/images/arrow-right.svg')}
              alt='continue'
            />
          </button>
        </div>
      </form>
    </>
  );
}