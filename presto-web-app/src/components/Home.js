import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button/Button';

const Home = (props) => {
  return (
    <React.Fragment>
      <h1>Home</h1>
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
  );
};

export default Home;
