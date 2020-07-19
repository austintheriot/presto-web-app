import React, { useState } from 'react';
import styles from './MoreInfo1.module.css';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import geoapifyKey from '../../util/geoapifyKey';

// const update = () => {
//   //To update a user's profile:
//   /* user.updateProfile({
//   displayName: "Jane Q. User",
//   photoURL: "https://example.com/jane-q-user/profile.jpg"
// }).then(function() {
//   // Update successful.
// }).catch(function(error) {
//   // An error happened.
// });
//  */
// };

export default () => {
  const [username, setUsername] = useState({
    value: '',
    animateUp: false,
    empty: true,
  });
  const [firstName, setFirstName] = useState({
    value: '',
    animateUp: false,
    empty: true,
  });
  const [lastName, setLastName] = useState({
    value: '',
    animateUp: false,
    empty: true,
  });
  const [city, setCity] = useState({
    value: '',
    animateUp: false,
    empty: true,
  });
  const [state, setState] = useState({
    value: '',
    animateUp: false,
    empty: true,
  });
  const [country, setCountry] = useState({
    value: '',
    animateUp: false,
    empty: true,
  });
  const [modalMessage, setModalMessage] = useState('');

  const handleFocus = (type) => {
    switch (type) {
      case 'username':
        setUsername((prevState) => ({ ...prevState, animateUp: true }));
        break;
      case 'firstName':
        setFirstName((prevState) => ({ ...prevState, animateUp: true }));
        break;
      case 'lastName':
        setLastName((prevState) => ({ ...prevState, animateUp: true }));
        break;
      case 'city':
        setCity((prevState) => ({ ...prevState, animateUp: true }));
        break;
      case 'state':
        setState((prevState) => ({ ...prevState, animateUp: true }));
        break;
      case 'country':
        setCountry((prevState) => ({ ...prevState, animateUp: true }));
        break;
      default:
    }
  };
  const handleBlur = (type) => {
    switch (type) {
      case 'username':
        setUsername((prevState) => ({
          ...prevState,
          animateUp: prevState.empty ? false : true,
        }));
        break;
      case 'firstName':
        setFirstName((prevState) => ({
          ...prevState,
          animateUp: prevState.empty ? false : true,
        }));
        break;
      case 'lastName':
        setLastName((prevState) => ({
          ...prevState,
          animateUp: prevState.empty ? false : true,
        }));
        break;
      case 'city':
        setCity((prevState) => ({
          ...prevState,
          animateUp: prevState.empty ? false : true,
        }));
        break;
      case 'state':
        setState((prevState) => ({
          ...prevState,
          animateUp: prevState.empty ? false : true,
        }));
        break;
      case 'country':
        setCountry((prevState) => ({
          ...prevState,
          animateUp: prevState.empty ? false : true,
        }));
        break;
      default:
    }
  };
  const handleChange = (e, type) => {
    let targetValue = e.target.value;
    console.log(targetValue);
    switch (type) {
      case 'username':
        setUsername((prevState) => ({
          ...prevState,
          value: targetValue,
          empty: targetValue.length === 0 ? true : false,
        }));
        break;
      case 'firstName':
        setFirstName((prevState) => ({
          ...prevState,
          value: targetValue,
          empty: targetValue.length === 0 ? true : false,
        }));
        break;
      case 'lastName':
        setLastName((prevState) => ({
          ...prevState,
          value: targetValue,
          empty: targetValue.length === 0 ? true : false,
        }));
        break;
      case 'city':
        setCity((prevState) => ({
          ...prevState,
          value: targetValue,
          empty: targetValue.length === 0 ? true : false,
        }));
        break;
      case 'state':
        setState((prevState) => ({
          ...prevState,
          value: targetValue,
          empty: targetValue.length === 0 ? true : false,
        }));
        break;
      case 'country':
        setCountry((prevState) => ({
          ...prevState,
          value: targetValue,
          empty: targetValue.length === 0 ? true : false,
        }));
        break;
      default:
        return;
    }
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
        setModalMessage('Sorry, there was an error.');
      };
      xhr.onload = (data) => {
        if (xhr.status !== 200) {
          // analyze HTTP status of the response
          console.error(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
        } else {
          //if the response succeeds:
          let properties = xhr.response.features[0].properties;
          setCity({
            animateUp: true,
            value: properties.city,
            empty: false,
          });
          setState({
            animateUp: true,
            value: properties.state,
            empty: false,
          });
          setCountry({
            animateUp: true,
            value: properties.country,
            empty: false,
          });
          let locationInfo = {
            lat: latitude,
            lon: longitude,
            city: properties.city,
            county: properties.county,
            state: properties.state,
            country: properties.country,
            zip: properties.postcode,
          };
          console.log(locationInfo);
        }
      };
    };

    const handleGeolocationFail = (err) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
      setModalMessage('Sorry, there was an error.');
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

  return (
    <>
      <h1 className={styles.title}>Thank's for signing up!</h1>
      <p className={styles.p}>
        Add some info about yourself so that others can contact you easier (you
        can edit this later).
      </p>
      <Input
        type='text'
        customType='username'
        handleFocus={handleFocus.bind(this, 'username')}
        handleBlur={handleBlur.bind(this, 'username')}
        handleChange={(e) => handleChange(e, 'username')}
        label={'Username'}
        computedState={username}
      />
      <Input
        type='text'
        customType='firstName'
        handleFocus={handleFocus.bind(this, 'firstName')}
        handleBlur={handleBlur.bind(this, 'firstName')}
        handleChange={(e) => handleChange(e, 'firstName')}
        label={'First Name'}
        computedState={firstName}
      />
      <Input
        type='text'
        customType='lastName'
        handleFocus={handleFocus.bind(this, 'lastName')}
        handleBlur={handleBlur.bind(this, 'lastName')}
        handleChange={(e) => handleChange(e, 'lastName')}
        label={'Last Name'}
        computedState={lastName}
      />
      <Modal message={modalMessage} color='black' />
      <Button onClick={getLocation}>Autofill Location</Button>
      <Input
        type='text'
        customType='city'
        handleFocus={handleFocus.bind(this, 'city')}
        handleBlur={handleBlur.bind(this, 'city')}
        handleChange={(e) => handleChange(e, 'city')}
        label={'City'}
        computedState={city}
      />
      <Input
        type='text'
        customType='state'
        handleFocus={handleFocus.bind(this, 'state')}
        handleBlur={handleBlur.bind(this, 'state')}
        handleChange={(e) => handleChange(e, 'state')}
        label={'State'}
        computedState={state}
      />
      <Input
        type='text'
        customType='country'
        handleFocus={handleFocus.bind(this, 'country')}
        handleBlur={handleBlur.bind(this, 'country')}
        handleChange={(e) => handleChange(e, 'country')}
        computedState={country}
      />
    </>
  );
};
