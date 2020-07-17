import React from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';
import { useAuth } from '../context/AuthProvider';

const Header = (props) => {
  let { authenticated } = useAuth();

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          {authenticated ? (
            <>
              <li>
                <Logout />
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to='/login'>Log In</Link>
              </li>
              <li>
                <Link to='/signup'>Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
