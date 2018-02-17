import React from 'react';
import ReactDOM from 'react-dom';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import cacheStack from 'cache-stack';
import axios from 'axios';
import ready from 'slidetherapy/client/src/ready';
import dataStore from 'slidetherapy/client/src/store.jsx';
import UserAuth from 'slidetherapy/client/src/components/UserAuth.jsx';
import OwnedDecks from 'slidetherapy/client/src/components/OwnedDecks.jsx';

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
  onUser: onUser,
  logout: logout,
  getDecks: getDecks
};

ready(initAccount);

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
  dataStore.dispatch({
    type: 'update',
    user: cognitoUser
  });
  if (cognitoUser) {
    getDecks();
  }
}

function showPasswordReset() {
  dataStore.dispatch({
    type: 'update',
    changingPassword: true
  });
}

function hidePasswordReset() {
  dataStore.dispatch({
    type: 'update',
    changingPassword: false
  });
}

function onUserError(message) {
  dataStore.dispatch({
    type: 'update',
    error: message
  });
}

function logout(user) {
  if (user) {
    user.signOut();
    user = undefined;
    dataStore.dispatch({
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
