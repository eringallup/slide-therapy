const decks = require('./decks.json');
const templatesRegex = new RegExp(/\/templates/);
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const download = require('./download');
const _ = require('lodash');

AWS.config.region = 'us-west-2';
const userPool = new AmazonCognitoIdentity.CognitoUserPool({
  UserPoolId: 'us-west-2_ElsbNKMlR',
  ClientId: '344cbh06h2oqsi3aqreaj22n88'
});
let cognitoUser;

let hasToken = false;
let stripeCheckout, currentDeck;

$(document).ready(() => {
  initAccount();
  initEcom(50);
});

module.exports = {
  initPurchase: initPurchase,
  getUser: getUser,
  register: register,
  login: login,
  logout: logout,
  getDecks: getDecks,
  enableUserForm: enableUserForm,
  disableUserForm: disableUserForm
};

function initEcom(delay) {
  // console.log('initEcom', delay);
  if (!window.StripeCheckout) {
    if (delay > (1000 * 10)) {
      throw new Error('unable to init ecom.');
      return;
    }
    setTimeout(() => {
      initEcom(delay * 2);
    }, delay);
    return;
  }
  stripeCheckout = StripeCheckout.configure({
    key: 'pk_test_CK71Laidqlso9O9sZDktqW6a',
    image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
    locale: 'auto',
    token: onToken,
    closed: onClose
  });
  $(window).on('popstate', stripeCheckout.close);
  $('html').addClass('has-ecom');
}

function initPurchase(deck) {
  currentDeck = decks[deck];
  if (!currentDeck) {
    throw new Error('Deck configuration error.');
    return;
  }
  stripeCheckout.open({
    name: 'Slide Therapy',
    description: currentDeck.title,
    email: getEmail(),
    amount: 2900
  });
}

function apiHeaders() {
  return {
    Authorization: cognitoUser && cognitoUser.getSignInUserSession().getIdToken().jwtToken
  };
}

function getEmail() {
  return cognitoUser && cognitoUser.signInUserSession.idToken.payload.email;
}

function onToken(token) {
  // console.info(token);
  hasToken = true;

  const data = {
    email: getEmail(),
    sku: currentDeck.sku,
    token: token.id
  };

  // console.info('onToken', data);
  $.ajax({
    type: 'GET',
    headers: apiHeaders(),
    contentType: 'application/json',
    url: 'https://p41v21dj54.execute-api.us-west-2.amazonaws.com/prod/oid',
    data: data,
    success: () => {
      Router.go('/thanks');
    },
    error: err => {
      throw err;
    }
  });
}

function onClose() {
  if (hasToken) {
    hasToken = false;
    return;
  }
  if (!templatesRegex.test(location.pathname)) {
    Router.go('/templates');
  }
}

function initAccount() {
  getUser().then(onUser);
  let $accountForm = $('#auth-form');
  $(document).on('submit', '#auth-form', e => {
    e.preventDefault();
    let data = getFormData($accountForm);
    disableUserForm();
    login(data.email, data.password, data.newPassword, data.verificationCode)
      .then(user => {
        onUser(user);
        Router.go('/');
      })
      .catch(userError => {
        // console.error('userError', userError);
        if (userError.code === 'UserNotFoundException') {
          register(data.email, data.password).then(onUser).catch(registerError => {
            // console.error(registerError);
            enableUserForm();
          });
        } else if (userError.code === 'NotAuthorizedException') {
          onUserError('Incorrect Password.');
        } else {
          onUserError(userError.message);
        }
      });
  });
}

function getFormData($form) {
  var data = {};
  $.each($form.serializeArray(), (_, kv) => {
    if (data.hasOwnProperty(kv.name)) {
      data[kv.name] = $.makeArray(data[kv.name]);
      data[kv.name].push(kv.value);
    } else {
      data[kv.name] = kv.value;
    }
  });
  return data;
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
  if (!user) {
    return;
  }
  cognitoUser = user;
  $('html').addClass('logged-in');
  $('.nav-user').text(cognitoUser.username);
  getDecks();
}

function enableUserForm() {
  $('#auth-form fieldset').removeAttr('disabled');
}

function disableUserForm() {
  $('#auth-form fieldset').attr('disabled', 'disabled');
}

function showPasswordReset() {
  $('#email-input').attr('hidden', 'hidden');
  $('#password-input').attr('hidden', 'hidden');
  $('#new-password-input').removeAttr('hidden');
  $('#new-password-input input').removeAttr('disabled');
  $('#verification-code-input').removeAttr('hidden');
  $('#verification-code-input input').removeAttr('disabled');
  enableUserForm();
}

function hidePasswordReset() {
  $('#email-input').removeAttr('hidden');
  $('#password-input').removeAttr('hidden');
  $('#new-password-input').attr('hidden', 'hidden');
  $('#new-password-input input').attr('disabled', 'disabled');
  $('#verification-code-input').attr('hidden', 'hidden');
  $('#verification-code-input input').attr('disabled', 'disabled');
}

function onUserError(message) {
  $('#auth-error').removeAttr('hidden').text(message);
  enableUserForm();
}

function logout(user) {
  if (user) {
    user.signOut();
    user = undefined;
    $('html').removeClass('logged-in');
    $('.nav-user').text('Login');
  }
  setTimeout(() => {
    Router.go('/');
  });
}

let hasDecks = false;
function getDecks() {
  if (hasDecks) {
    return;
  }
  $.ajax({
    type: 'GET',
    headers: apiHeaders(),
    contentType: 'application/json',
    url: 'https://hwwhk00ik9.execute-api.us-west-2.amazonaws.com/prod/getDecks',
    success: json => {
      hasDecks = true;
      let userDecks = json.body;
      let $decks = $('#account-decks');
      _.each(userDecks.Items, item => {
        let deck = _.find(_.values(decks), {
          sku: parseInt(item.sku, 10)
        });
        let $li = $('<li/>');
        let $a = $('<a/>');
        $a.attr('href', '/download?o=' + item.oid);
        $a.on('click', e => {
          e.preventDefault();
          download.ownedDeck(cognitoUser, item.oid);
        });
        $a.text(deck.title);
        $li.append($a);
        $decks.append($li);
      });
    },
    error: err => {
      throw err;
    }
  });
}