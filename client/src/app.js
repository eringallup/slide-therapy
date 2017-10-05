$(document).ready(() => {
  let decks = {
    halcyon: {
      title: 'Halcyon',
      sku: 1,
      price: 2900
    },
    summit: {
      title: 'Summit',
      sku: 2,
      price: 2900
    },
    hitchcock: {
      title: 'Hitchcock',
      sku: 3,
      price: 2900
    }
  };
  let baseTitle = 'Slide Therapy 2017';
  let $body = $('body');
  let currentView = 'view-templates';
  let currentDeck;
  let checkout = StripeCheckout.configure({
    key: 'pk_test_CK71Laidqlso9O9sZDktqW6a',
    image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
    locale: 'auto',
    token: onToken,
    closed: onClose
  });

  init();

  function init() {
    $(document).on('click', '.buy', e => {
      e.preventDefault();
      initPurchase('halcyon');
    });
    $(window).on('popstate', checkout.close);

    addRoutes();
    $body.removeClass('view-loading');
  }

  function addRoutes() {
    Router.route({
      url: '/',
      controller: (self, url) => {
        setView('view-templates');
        document.title = baseTitle;
        scrollTo('body');
      }
    });

    Router.route({
      url: '/templates',
      controller: (self, url) => {
        setView('view-templates');
        document.title = baseTitle + ' Templates';
        scrollTo('#templates');
      }
    });

    Router.route({
      url: '/buy/:deck',
      controller: (self, url) => {
        setView('view-templates');
        document.title = baseTitle + ': Buy ' + self.params.deck;
        scrollTo('#templates');
        setTimeout(function() {
          initPurchase(self.params.deck);
        }, 251);
      }
    });

    Router.route({
      url: '/tips',
      controller: (self, url) => {
        setView('view-tips');
        document.title = baseTitle + ': Tips';
        scrollTo('body');
      }
    });

    Router.route({
      url: '/about',
      controller: (self, url) => {
        setView('view-about');
        document.title = baseTitle + ': About';
        scrollTo('body');
      }
    });

    Router.route({
      url: '/thanks',
      controller: (self, url) => {
        setView('view-thanks');
        document.title = baseTitle + ': Thanks';
        scrollTo('body');
      }
    });

    Router.route({
      url: '/download',
      controller: (self, url) => {
        setView('view-download');
        document.title = baseTitle + ': Download';
        download(self.query.t);
        scrollTo('body');
      }
    });

    Router.ready();
  }

  function setView(view) {
    if (view === currentView) {
      return;
    }
    $body.addClass(view);
    $body.removeClass(currentView);
    currentView = view;
  }

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

  let isDismiss = true;
  function onToken(token, sku) {
    // console.warn(token);
    $.ajax({
      type: 'POST',
      url: '/api/charge',
      data: {
        token: token.id,
        sku: currentDeck.sku,
        email: token.email
      },
      success: () => {
        isDismiss = false;
        checkout.close();
        document.location.href = '/thanks';
      },
      error: err => {
        onError(err);
        onClose();
      }
    });
  }

  function download(token) {
    $.ajax({
      type: 'GET',
      url: '/api/download',
      data: {
        t: token
      },
      success: json => {
        document.location.href = json.data;
      },
      error: onError
    });
  }

  let templatesRegex = new RegExp(/\/templates/);
  function onClose() {
    if (!isDismiss) {
      isDismiss = true;
      return;
    }
    if (!templatesRegex.test(location.pathname)) {
      // document.location.href = '/templates';
    }
  }

  function scrollTo(id) {
    // console.info('scrollTo', id);
    $(window).scrollTo(id, 250, 'easeInOut');
  }

  function onError(error) {
    console.error(error);
  }
});
