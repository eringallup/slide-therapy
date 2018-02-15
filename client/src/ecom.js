import ready from './ready';
import skus from 'slidetherapy/skus.json';
import account from './account.jsx';
import axios from 'axios';

const templatesRegex = new RegExp(/\/templates/);
let hasToken = false;
let stripeCheckout, currentDeck;

ready(() => {
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
  window.addEventListener('popstate', stripeCheckout.close);
  document.querySelector('html').classList.add('has-ecom');
}

function initPurchase(deck) {
  account.getUser().then(user => {
    currentDeck = _.find(skus, {
      slug: deck
    });
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

    let headers = account.apiHeaders();
    headers['Content-Type'] = 'application/json';
    axios({
      method: 'GET',
      headers: headers,
      url: 'https://p41v21dj54.execute-api.us-west-2.amazonaws.com/prod/oid',
      params: data
    }).then(() => {
      Router.go('/thanks');
    }).catch(console.error);
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
