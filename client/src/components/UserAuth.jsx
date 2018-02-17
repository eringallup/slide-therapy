import React from 'react';
import dataStore from 'slidetherapy/client/src/store.jsx';

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
      return <a className="nav-link nav-user" href="/account">{this.state.user.signInUserSession.idToken.payload.email}</a>;
    }
    return <a className="nav-link nav-user" href="/account">Login</a>;
  }
}
