const decks = require('./decks.json');
const templatesRegex = new RegExp(/\/templates/);
const checkout = StripeCheckout.configure({
  key: 'pk_test_CK71Laidqlso9O9sZDktqW6a',
  image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
  locale: 'auto',
  token: onToken,
  closed: onClose
});
let hasToken = false;
let currentDeck;

$(window).on('popstate', checkout.close);

module.exports = {
  initPurchase: initPurchase,
  checkout: checkout
};

function initPurchase(deck) {
  currentDeck = decks[deck];
  if (!currentDeck) {
    throw new Error('Deck configuration error.');
    return;
  }
  checkout.open({
    name: 'Slide Therapy',
    description: currentDeck.title,
    amount: 2900
  });
}

function onToken(token, sku) {
  // console.info(token, sku);
  hasToken = true;
  $.ajax({
    type: 'POST',
    url: '/api/charge',
    data: {
      token: token.id,
      sku: currentDeck.sku,
      email: token.email
    },
    success: () => {
      Router.go('/thanks');
    },
    error: err => {
      console.error(error);
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