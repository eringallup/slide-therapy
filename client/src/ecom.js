const decks = require('./decks.json');
const templatesRegex = new RegExp(/\/templates/);
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