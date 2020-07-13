import React from 'react';
import { Link } from 'react-router-dom';

const header = (props) => {
  let headerComponent = null;
  if (props.authenticated) {
    headerComponent = (
      <header>
        <nav>
          <ul>
            <li>
              <Link to='/' exact='true'>
                Login/Signup
              </Link>
            </li>
            <li>
              <Link to='/numbers' exact='true'>
                Show Numbers
              </Link>
            </li>
            <li></li>
          </ul>
        </nav>
      </header>
    );
  }

  return headerComponent;
};

export default header;
