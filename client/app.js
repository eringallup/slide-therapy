(function() {
  var checkout = StripeCheckout.configure({
    key: 'pk_test_CK71Laidqlso9O9sZDktqW6a',
    image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
    locale: 'auto',
    token: onToken
  });

  document.getElementById('buyButton').addEventListener('click', initPurchase);
  document.getElementById('emailButton').addEventListener('click', email);
  window.addEventListener('popstate', checkout.close);

  function initPurchase(e) {
    checkout.open({
      name: 'Slide Therapy',
      description: '2016 Deck',
      amount: 2900
    });
    e.preventDefault();
  }

  function onToken(token) {
    console.warn(token);
    $.ajax({
      type: 'POST',
      url: 'http://localhost:7678/api/charge',
      data: {
        token: token.id,
        sku: 1,
        // uid: firebase.auth().currentUser.uid,
        email: token.email
      },
      success: checkout.close,
      error: onError
    });
  }

  function email() {
    $.ajax({
      type: 'POST',
      url: 'http://localhost:7678/api/email',
      data: {
        oid: 13
      }
    });
  }

  function onError(error) {
    console.error(error);
  }
}());
