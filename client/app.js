(function() {
  var baseTitle = 'Slide Therapy 2017';

  Router.route({
    url: '/',
    controller: function(self, url) {
      document.title = baseTitle;
    }
  });

  Router.route({
    url: '/templates',
    controller: function(self, url) {
      document.title = baseTitle + ' Templates';
      scrollTo('#templates');
    }
  });

  Router.route({
    url: '/buy/:deck',
    controller: function(self, url) {
      document.title = baseTitle + ': Buy ' + self.params.deck;
      scrollTo('#templates');
    }
  });

  Router.ready();

  var checkout = StripeCheckout.configure({
    key: 'pk_test_CK71Laidqlso9O9sZDktqW6a',
    image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
    locale: 'auto',
    token: onToken
  });

  $(document).on('click', '.buy', initPurchase);
  $(document).on('click', '.email', email);
  $(document).on('click', '.scroll-to', onScrollToClick);
  $(window).on('popstate', checkout.close);

  function initPurchase(e) {
    checkout.open({
      name: 'Slide Therapy',
      description: '2016 Deck',
      amount: 2900
    });
    e && e.preventDefault();
  }

  function onToken(token) {
    // console.warn(token);
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

  function onScrollToClick(e) {
    var href = $(e.target).attr('href');
    scrollTo(href.replace('#!/', '#'));
  }

  function scrollTo(id) {
    $(window).scrollTo(id, 250, 'easeInOut');
  }

  function onError(error) {
    console.error(error);
  }
}());
