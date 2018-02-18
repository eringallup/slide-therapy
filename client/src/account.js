import AWS from 'aws-sdk';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import dataStore from 'store';

AWS.config.region = 'us-west-2';
const userPool = new AmazonCognitoIdentity.CognitoUserPool({
  UserPoolId: 'us-west-2_ElsbNKMlR',
  ClientId: '344cbh06h2oqsi3aqreaj22n88'
});

export {
  apiHeaders,
  getUser,
  getEmail,
  register,
  login,
  logout
};

function apiHeaders() {
  let currentState = dataStore.getState();
  return {
    Authorization: currentState.user && currentState.user.getSignInUserSession().getIdToken().jwtToken
  };
}

function getEmail() {
  let currentState = dataStore.getState();
  return currentState.user && currentState.user.signInUserSession.idToken.payload.email;
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
      onUser(result.user);
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
      newPasswordRequired: () => {
        _cognitoUser.completeNewPasswordChallenge(newPassword, null, this);
      },
      passwordResetRequired: () => {
        _cognitoUser.completePasswordResetChallenge(newPassword, null, this);
      },
      onSuccess: () => {
        onUser(_cognitoUser);
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

// function changePassword(user, currentPassword, newPassword) {
//   return new Promise((resolve, reject) => {
//     user.changePassword(currentPassword, newPassword, (changePasswordError, changePasswordResult) => {
//       if (changePasswordError) {
//         return reject(changePasswordError.message);
//       }
//       console.log('changePasswordResult:', changePasswordResult);
//       hidePasswordReset();
//       resolve(user);
//     });
//   });
// }

function forgotPassword(user) {
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
      dataStore.dispatch({
        type: 'update',
        user: currentUser
      });
      resolve(currentUser);
    });
  });
}

function onUser(user) {
  dataStore.dispatch({
    type: 'update',
    user: user
  });
}

function showPasswordReset() {
  dataStore.dispatch({
    type: 'update',
    changingPassword: true
  });
}

// function hidePasswordReset() {
//   dataStore.dispatch({
//     type: 'update',
//     changingPassword: false
//   });
// }

function logout() {
  let currentState = dataStore.getState();
  if (currentState.user) {
    currentState.user.signOut();
    dataStore.dispatch({
      type: 'logout',
      user: undefined
    });
  }
}
