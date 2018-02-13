import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import _ from 'lodash';
import download from './download';
import Vault from 'vault.js';
import cacheStack from 'cache-stack';
import axios from 'axios';
import ready from './ready';
import decks from './decks.json';

AWS.config.region = 'us-west-2';
const userPool = new AmazonCognitoIdentity.CognitoUserPool({
  UserPoolId: 'us-west-2_ElsbNKMlR',
  ClientId: '344cbh06h2oqsi3aqreaj22n88'
});
let cognitoUser;

module.exports = {
  apiHeaders: apiHeaders,
  getUser: getUser,
  getEmail: getEmail,
  register: register,
  login: login,
  logout: logout,
  getDecks: getDecks,
  renderAuthForm: renderAuthForm,
  unrenderAuthForm: unrenderAuthForm
};

ready(() => {
  initAccount();
});

function userStateStore(state = undefined, action) {
  // console.log('userStateStore', state, action);
  if (action.type === 'update') {
    state = action.user;
  } else if (action.type === 'logout') {
    state = undefined;
  }
  return state;
}

let userState = createStore(userStateStore);

class UserAuth extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
    userState.subscribe(() => {
      this.setState({
        user: userState.getState()
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

function authFormStore(state = {}, action) {
  Object.keys(action).forEach(item => {
    state[item] = action[item];
  });
  return state;
}

let authForm = createStore(authFormStore);

class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    authForm.subscribe(item => {
      let authState = authForm.getState();
      Object.keys(authState).forEach(item => {
        this.setState({
          [item]: authState[item]
        });
      });
      if (this.state.changePassword) {
        this.newPasswordInput.focus();
      }
    });
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    let username = Vault.Local.get('username');
    if (username) {
      this.refs.emailInput.value = username;
    }
    window.passwordInput = this.refs.passwordInput;
    if (this.refs.emailInput.value) {
      this.refs.passwordInput.focus();
    } else {
      this.refs.emailInput.focus();
    }
  }
  handleEmailBlur(e) {
    Vault.Local.set('username', e.target.value);
  }
  onSubmit(e) {
    e.preventDefault();
    let data = getFormData(e.target);
    this.setState({
      disableForm: true
    });
    login(data.email, data.password, data.newPassword, data.verificationCode)
      .then(user => {
        onUser(user);
        this.refs.passwordInput.value = '';
        this.setState({
          error: false,
          disableForm: true
        });
        Router.go('/');
      })
      .catch(userError => {
        if (userError.code === 'UserNotFoundException') {
          register(data.email, data.password).then(onUser).catch(registerError => {
            this.setState({
              disableForm: false
            });
          });
        } else if (userError.code === 'NotAuthorizedException') {
          this.setState({
            error: 'Incorrect Password.',
            disableForm: false
          });
          this.refs.passwordInput.focus();
          this.refs.passwordInput.select();
        } else {
          this.setState({
            error: userError.message,
            disableForm: false
          });
        }
      });
  }
  render() {
    const disableForm = this.state.disableForm;
    const changingPassword = this.state.changingPassword;
    const hasError = !(this.state.error);
    const emailInput =
      <div id="email-input">
        <label htmlFor="email">Email</label>
        <input
          ref="emailInput"
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          onBlur={this.handleEmailBlur}
          disabled={changingPassword}
        />
      </div>;
    const passwordInput =
      <div id="password-input">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          ref="passwordInput"
          id="password"
          name="password"
          pattern="(?=^.{8,}$)(?![.\n])(?=.*\d)(?=.*\W+)(?=.*[A-Z])(?=.*[a-z]).*$"
          autoComplete="password"
          disabled={changingPassword}
        />
      </div>
    const newPasswordInput =
      <div id="new-password-input" hidden={!changingPassword}>
        <label htmlFor="newPassword">New Password</label>
        <input
          type="password"
          ref="newPasswordInput"
          id="newPassword"
          name="newPassword"
          pattern="(?=^.{8,}$)(?![.\n])(?=.*\d)(?=.*\W+)(?=.*[A-Z])(?=.*[a-z]).*$"
          autoComplete="password"
          disabled={!changingPassword}
        />
      </div>;
    const verificationCodeInput =
      <div id="verification-code-input" hidden={!changingPassword}>
        <label htmlFor="verificationCode">Verification Code</label>
        <input
          id="verificationCode"
          ref="verificationCodeInput"
          name="verificationCode"
          disabled={!changingPassword}
        />
      </div>;
    return <form id="auth-form" method="POST" action="/auth" onSubmit={this.onSubmit}>
        <fieldset disabled={disableForm}>
          {emailInput}
          {passwordInput}
          {newPasswordInput}
          {verificationCodeInput}
          <input
            value="Login"
            className="btn btn-primary btn-sm"
            type="submit"
            accessKey="s"
          />
        </fieldset>
        <div id="auth-error" className="alert alert-danger" hidden={hasError}>
          {this.state.error}
        </div>
      </form>;
  }
}

function OwnedDecks(props) {
  // console.log('OwnedDecks', props);
  if (!props.orders || !props.orders.length) {
    return '';
  }
  const decksHtml = props.orders.map(order => {
    let deck = _.find(Object.values(decks), {
      sku: parseInt(order.sku, 10)
    });
    return <li key={order.oid}><a href={'/download?o=' + order.oid}>{deck.title}</a></li>;
  });
  return <React.Fragment><h2>Your decks</h2><ul className="list-unstyled">{decksHtml}</ul></React.Fragment>;
}

function apiHeaders() {
  return {
    Authorization: cognitoUser && cognitoUser.getSignInUserSession().getIdToken().jwtToken
  };
}

function getEmail() {
  return cognitoUser && cognitoUser.signInUserSession.idToken.payload.email;
}

function initAccount() {
  getUser().then(user => {
    ReactDOM.render(<UserAuth/>, document.querySelector('#nav-user'));
    onUser(user);
  });
}

function register(email, password) {
  return new Promise((resolve, reject) => {
    // console.log('register', email, password);
    if (!email) {
      return reject(new Error('Email is required'));
    }
    if (!password) {
      return reject(new Error('Password is required'));
    }
    let attributeList = [];
    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'email',
      Value: email
    });
    attributeList.push(attributeEmail);
    // console.log('attributeList', attributeList);

    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        return reject(err);
      }
      console.log('User name is ' + result.user.getUsername());
      resolve(result.user);
    });
  });
}

function login(email, password, newPassword, verificationCode) {
  return new Promise((resolve, reject) => {
    if (!email) {
      return reject(new Error('Email is required'));
    }
    if (!password) {
      return reject(new Error('Password is required'));
    }
    const authenticationData = {
      Username: email,
      Password: password
    };
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    const userData = {
      Username: email,
      Pool: userPool
    };
    let _cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    _cognitoUser.authenticateUser(authenticationDetails, {
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        _cognitoUser.completeNewPasswordChallenge(newPassword, null, this);
      },
      passwordResetRequired: (userAttributes, requiredAttributes) => {
        _cognitoUser.completePasswordResetChallenge(newPassword, null, this);
      },
      onSuccess: (result) => {
        resolve(_cognitoUser);
      },
      onFailure: (error) => {
        if (error.code === 'PasswordResetRequiredException') {
          if (newPassword && verificationCode) {
            confirmPassword(_cognitoUser, newPassword, verificationCode);
          } else {
            forgotPassword(_cognitoUser, newPassword, verificationCode);
          }
        } else {
          reject(error);
        }
      }
    });
  });
}

function changePassword(user, currentPassword, newPassword) {
  return new Promise((resolve, reject) => {
    user.changePassword(currentPassword, newPassword, (changePasswordError, changePasswordResult) => {
      if (changePasswordError) {
        return reject(changePasswordError.message);
      }
      console.log('changePasswordResult:', changePasswordResult);
      hidePasswordReset();
      resolve(user);
    });
  });
}

function forgotPassword(user, newPassword, verificationCode) {
  return new Promise((resolve, reject) => {
    user.forgotPassword({
      onSuccess: () => {
        showPasswordReset();
      },
      onFailure: reject
    });
  });
}

function confirmPassword(user, password, verificationCode) {
  user.confirmPassword(verificationCode, password, this);
}

function getUser() {
  return new Promise((resolve, reject) => {
    let currentUser = userPool.getCurrentUser();
    if (!currentUser) {
      return resolve();
    }
    currentUser.getSession((err, session) => {
      if (err) {
        return reject(err);
      }
      if (!session.isValid()) {
        currentUser = undefined;
      }
      // console.log('Cognito session valid:', session.isValid());
      resolve(currentUser);
    });
  });
}

function onUser(user) {
  cognitoUser = user;
  userState.dispatch({
    type: 'update',
    user: cognitoUser
  });
  if (cognitoUser) {
    getDecks();
  }
}

function renderAuthForm() {
  ReactDOM.render(<AuthForm/>, document.querySelector('#view-auth .col'));
}

function unrenderAuthForm() {
  ReactDOM.unmountComponentAtNode(document.querySelector('#view-auth .col'));
}

function getFormData(form) {
  let data = {};
  const elements = form.querySelectorAll('input, select, textarea');
  elements.forEach(element => {
    if (element.type !== 'button' && element.type !== 'submit') {
      data[element.name] = element.value;
    }
  });
  // console.log(data);
  return data;
}

function showPasswordReset() {
  authForm.dispatch({
    type: 'update',
    changingPassword: true
  });
}

function hidePasswordReset() {
  authForm.dispatch({
    type: 'update',
    changingPassword: false
  });
}

function onUserError(message) {
  authForm.dispatch({
    type: 'update',
    error: message
  });
}

function logout(user) {
  if (user) {
    user.signOut();
    user = undefined;
    userState.dispatch({
      type: 'logout'
    });
  }
  setTimeout(() => {
    Router.go('/');
  });
}

function getDecks() {
  const decksCacheStack = cacheStack(callback => {
    let headers = apiHeaders();
    headers['Content-Type'] = 'application/json';
    axios({
      method: 'GET',
      headers: headers,
      url: 'https://hwwhk00ik9.execute-api.us-west-2.amazonaws.com/prod/getDecks'
    }).then(callback).catch(console.error);
  }, {
    key: 'getDecks'
  }, json => {
    ReactDOM.render(<OwnedDecks orders={json.data.body.Items}/>, document.querySelector('#account-decks'));
  });
  return decksCacheStack;
}
