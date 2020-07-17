import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button/Button';
import { useAuth } from '../context/AuthProvider';

const Home = (props) => {
  let authenticated = useAuth();

  return (
    <React.Fragment>
      <h1>Home</h1>
      {authenticated ? (
        <h1>Home Page</h1>
      ) : (
        <React.Fragment>
          <Button>
            <Link to='/login'>Log In</Link>
          </Button>
          <Button>
            <Link to='/login'>Sign Up</Link>
          </Button>
          <Button>
            <Link to='/'>I'm a Guest</Link>
          </Button>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Home;
