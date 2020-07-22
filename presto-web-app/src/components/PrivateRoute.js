import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

const PrivateRoute = ({ component: ComposedComponent, ...rest }) => {
  class Authentication extends Component {
    //call this function below to determine which component to render
    handleRender = (props) => {
      //if the user is unauthenticated, redirect to login
      if (!this.props.authenticated) {
        return (
          <Redirect
            to={{
              pathname: '/login',
              state: {
                infoMessage: 'You must be logged in to see this page.',
              },
            }}
          />
        );
      }

      //if the user is authenticated, return the component with its props
      else {
        return (
          <ComposedComponent
            authenticated={this.props.authenticated}
            {...props}
          />
        );
      }
    };

    render() {
      return <Route {...rest} render={this.handleRender} />;
    }
  }

  return (
    <AuthContext.Consumer>
      {({ authenticated }) => <Authentication authenticated={authenticated} />}
    </AuthContext.Consumer>
  );
};

export default PrivateRoute;
