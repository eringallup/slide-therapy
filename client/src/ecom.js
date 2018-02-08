const decks = require('./decks.json');
const templatesRegex = new RegExp(/\/templates/);
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

AWS.config.region = 'us-west-2';
const userPool = new AmazonCognitoIdentity.CognitoUserPool({
  UserPoolId: 'us-west-2_ElsbNKMlR',
  ClientId: '344cbh06h2oqsi3aqreaj22n88'
});
let cognitoUser;

let hasToken = false;
let stripeCheckout, currentDeck;
initEcom(50);

module.exports = {
  initPurchase: initPurchase
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
  getUser(() => {
    if (!cognitoUser) {
      authenticateUser('stwclient2', 'P1mpfl4t^JFB', 'P1mpfl4t^JFB');
      // createUser('Me', 'me+cog@jimmybyrum.com', '230rij2iojf');
    }
  });
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
    email: cognitoUser && cognitoUser.signInUserSession.idToken.payload.email,
    amount: 2900
  });
}

function onToken(token, sku) {
  // console.info(token, sku);
  hasToken = true;
  const data = {
    token: token.id,
    sku: currentDeck.sku,
    email: token.email
  };
  $.ajax({
    type: 'POST',
    headers: {
      Authorization: cognitoUser.getSignInUserSession().getIdToken().jwtToken
    },
    url: 'https://8m0auawiog.execute-api.us-west-2.amazonaws.com/prod/charge',
    data: data,
    success: () => {
      Router.go('/thanks');
    },
    error: err => {
      console.error(err);
      onClose();
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

function createUser(name, email, password) {
  // console.log('createUser', name, email, password);
  let attributeList = [];
  var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute({
    Name: name,
    Value: email
  });
  attributeList.push(attributeEmail);

  userPool.signUp(email, password, attributeList, null, (err, result) => {
    if (err) {
      throw err;
      return;
    }
    cognitoUser = result.user;
    console.log('User name is ' + cognitoUser.getUsername());
  });
}

function authenticateUser(email, password, newPassword) {
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
    newPasswordRequired: function(userAttributes, requiredAttributes) {
      _cognitoUser.completeNewPasswordChallenge(newPassword, null, this);
    },
    onSuccess: function(result) {
      cognitoUser = _cognitoUser;
      window.cognitoUser = cognitoUser;
      // console.log('access token + ' + result.getAccessToken().getJwtToken());
      /*Use the idToken for Logins Map when Federating User Pools with Cognito Identity or when passing through an Authorization Header to an API Gateway Authorizer*/
      // console.log('idToken + ' + result.idToken.jwtToken);
    },
    onFailure: function(err) {
      console.error(err);
    }
  });
}

function getUser(callback) {
  cognitoUser = userPool.getCurrentUser();
  if (!cognitoUser) {
    return callback();
  }
  // console.log(cognitoUser);
  cognitoUser.getSession((err, session) => {
    if (err) {
      throw err;
      return;
    }
    if (!session.isValid()) {
      cognitoUser = undefined;
    } else {
      window.cognitoUser = cognitoUser;
    }
    console.log('Cognito session valid:', session.isValid());
    callback();
  });
}