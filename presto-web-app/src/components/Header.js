import React from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';
import { useAuth } from '../context/AuthProvider';
import Auxiliary from './Auxiliary';

const Header = (props) => {
  let authenticated = useAuth();

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          {authenticated ? (
            <Auxiliary>
              <li>
                <Link to='/protected'>Protected</Link>
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

export default Header;
