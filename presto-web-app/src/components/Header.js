import React from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';
import Auxiliary from './Auxiliary';

const header = (props) => {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          {props.authenticated ? (
            <Auxiliary>
              <li>
                <Link to='/admin'>Admin</Link>
              </li>
              <li>
                <Logout />
              </li>
            </Auxiliary>
          ) : (
            <Auxiliary>
              <li>
                <Link to='/login'>Log In</Link>
              </li>
              <li>
                <Link to='/signup'>Sign Up</Link>
              </li>
            </Auxiliary>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default header;
