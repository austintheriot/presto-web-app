import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button/Button';
import { useAuth } from '../context/AuthProvider';

const Home = (props) => {
  let { authenticated } = useAuth();

  return (
    <>
      <h1>Presto</h1>
      <p>web app for musicians</p>
      {authenticated ? null : (
        <>
          <Button>
            <Link to='/login'>Log In</Link>
          </Button>
          <Button customstyle='inverted'>
            <Link to='/login'>Sign Up</Link>
          </Button>
          <Button customstyle='inverted'>
            <Link to='/'>I'm a Guest</Link>
          </Button>
        </>
      )}
    </>
  );
};

export default Home;
