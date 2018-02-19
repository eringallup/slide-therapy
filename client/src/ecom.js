import ready from 'ready';
import skus from 'skus.json';
import * as account from 'account';
import axios from 'axios';
import generator from 'generate-password';

let hasToken = false;
let stripeCheckout, currentDeck;
let onSuccess = [];
let onDismiss = [];
let onError = [];

ready(() => {
  initEcom(50);
});

module.exports = {
  initPurchase: initPurchase,
  onSuccess: fn => onSuccess.push(fn),
  onError: fn => onError.push(fn),
  onDismiss: fn => onDismiss.push(fn)
};

function initEcom(delay) {
  // console.log('initEcom', delay);
  if (!window.StripeCheckout) {
    if (delay > (1000 * 10)) {
      throw new Error('unable to init ecom.');
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
  account.getUser().then(() => {
    let sku;
    for (sku in skus) {
      if (deck === skus[sku].slug) {
        currentDeck = skus[sku];
      }
    }
    if (!currentDeck) {
      throw new Error('Deck configuration error.');
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
  account.getUser().then(user => {
    if (user) {
      completePurchase(token);
      return;
    }
    const password = generator.generate({
      length: 10,
      numbers: true,
      symbols: true,
      uppercase: true,
      strict: true
    }) + '!';
    account.register(token.email, password)
      .then(() => completePurchase(token))
      .catch(registerError => {
        onError.forEach(fn => fn(registerError));
      });
  });
}

function completePurchase(token) {
  const data = {
    sku: currentDeck.sku,
    token: token.id
  };

  let headers = account.apiHeaders();
  headers['Content-Type'] = 'application/json';
  axios({
    method: 'GET',
    headers: headers,
    url: 'https://p41v21dj54.execute-api.us-west-2.amazonaws.com/prod/oid',
    params: data
  }).then(() => {
    while(onSuccess.length) {
      let fn = onSuccess.shift();
      fn();
    }
  }).catch(console.error);
}

function onClose() {
  if (hasToken) {
    hasToken = false;
    return;
  }
  while(onDismiss.length) {
    let fn = onDismiss.shift();
    fn();
  }
}
