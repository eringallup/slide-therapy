import React from 'react';
import { Redirect } from 'react-router-dom';
import { getUser, logout } from 'lib/account';
import dataStore from 'lib/store';

export default class Logout extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
    dataStore.subscribe(() => {
      let currentState = dataStore.getState();
      if (!currentState.user) {
        this.setState({
          loggedOut: true
        });
      }
    });
  }
  componentDidMount() {
    getUser().then(logout);
  }
  render() {
    if (this.state.loggedOut) {
      return <Redirect to="/"/>;
    }
    return <h2>Logging out</h2>;
  }
}
