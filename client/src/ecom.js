const decks = require('./decks.json');
const account = require('./account');
const templatesRegex = new RegExp(/\/templates/);

let cognitoUser;

let hasToken = false;
let stripeCheckout, currentDeck;

$(document).ready(() => {
  initEcom(50);
});

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
}

function initPurchase(deck) {
  account.getUser().then(user => {
    currentDeck = decks[deck];
    if (!currentDeck) {
      throw new Error('Deck configuration error.');
      return;
    }
    let stripeConfig = {
      name: 'Slide Therapy',
      description: currentDeck.title,
      amount: 2900
    };
    let email = account.getEmail();
    if (email) {
      stripeConfig.email = email;
    }
    stripeCheckout.open(stripeConfig);
  });
}

function onToken(token) {
  // console.info(token);
  hasToken = true;

  const data = {
    sku: currentDeck.sku,
    token: token.id
  };

  account.getUser().then(user => {
    console.info('onToken', token, user);

    if (!user) {
      account.register(token.email, token.email + 'A1!').then(user => {
        console.log('register', user);
      }).catch(registerError => {
        if (registerError.code === 'UsernameExistsException') {
          window.location.href = '/account';
        }
        console.error(registerError);
      });
    }

    // $.ajax({
    //   type: 'GET',
    //   headers: account.apiHeaders(),
    //   contentType: 'application/json',
    //   url: 'https://p41v21dj54.execute-api.us-west-2.amazonaws.com/prod/oid',
    //   data: data,
    //   success: () => {
    //     Router.go('/thanks');
    //   },
    //   error: err => {
    //     throw err;
    //   }
    // });
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
