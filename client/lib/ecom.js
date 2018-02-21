import skus from 'skus.json';
import { getUser, getEmail, register, apiHeaders } from 'lib/account';
import axios from 'axios';
import generator from 'generate-password';

let stripeCheckout, currentDeck;
let onSuccess = [];
let onDismiss = [];
let onError = [];

module.exports = {
  initPurchase: initPurchase,
  onToken: onToken,
  onSuccess: fn => onSuccess.push(fn),
  onError: fn => onError.push(fn),
  onDismiss: fn => onDismiss.push(fn)
};

function initPurchase(deck) {
  getUser().then(() => {
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
    let email = getEmail();
    if (email) {
      stripeConfig.email = email;
    }
    stripeCheckout.open(stripeConfig);
  });
}

function onToken(token) {
  // console.info(token);
  getUser().then(user => {
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
    register(token.email, password)
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

  let headers = apiHeaders();
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
