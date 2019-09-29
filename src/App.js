import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './containers/navBar';
import Landing from './components/landing';
import Login from './components/auth/login';
import { Provider } from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import PrivateRoute from './components/private-route/privateRoute';
import Dashboard from './components/dashboard';
import { connect } from "react-redux";
import PropTypes from "prop-types";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

console.log(store.getState().auth.isAuthenticated);
// localStorage.clear();

class App extends Component {
  // componentDidMount() {
  //   console.log('componentDidMount');
  //   localStorage.clear();
  // }

  render() {
    { console.log(this.props.auth); }
    return (
      <Provider store={store}>
        <Router>
          {this.props.auth.isAuthenticated ?
            <NavBar />
            :
            <Login />}
          {/* <Switch>
            <PrivateRoute exact path="/" component={NavBar} />
          </Switch> */}
        </Router>
      </Provider>
    );
  }
}

// export default App;

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(App);