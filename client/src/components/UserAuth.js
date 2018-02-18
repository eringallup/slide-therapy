import React from 'react';
import { Link } from 'react-router-dom';
import dataStore from 'store';

export default class UserAuth extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
    dataStore.subscribe(() => {
      let currentState = dataStore.getState();
      this.setState({
        user: currentState.user
      });
    });
  }
  render() {
    if (this.state.user) {
      return <Link to="/account" className="nav-link nav-user">{this.state.user.signInUserSession.idToken.payload.email}</Link>;
    }
    return <Link to="/login" className="nav-link nav-user">Login</Link>;
  }
}
