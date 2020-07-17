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
            <React.Fragment>
              <li>
                <Link to='/protected'>Protected</Link>
              </li>
              <li>
                <Logout />
              </li>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <li>
                <Link to='/login'>Log In</Link>
              </li>
              <li>
                <Link to='/signup'>Sign Up</Link>
              </li>
            </React.Fragment>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
