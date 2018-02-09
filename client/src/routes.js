const ecom = require('./ecom');
const download = require('./download');
const baseTitle = 'Slide Therapy 2017';
const $body = $('body');
let currentView = 'view-templates';

function setView(view) {
  if (view === currentView) {
    return;
  }
  $body.addClass(view);
  $body.removeClass(currentView);
  currentView = view;
}

function scrollTo(id) {
  // console.info('scrollTo', id);
  $(window).scrollTo(id, 250, 'easeInOut');
}

module.exports = [{
  url: '/',
  controller: (self, url) => {
    setView('view-templates');
    document.title = baseTitle;
    scrollTo('body');
  }
}, {
  url: '/templates',
  controller: (self, url) => {
    setView('view-templates');
    document.title = baseTitle + ' Templates';
    scrollTo('#templates');
  }
}, {
  url: '/buy/:deck',
  controller: (self, url) => {
    setView('view-templates');
    document.title = baseTitle + ': Buy ' + self.params.deck;
    scrollTo('#templates');
    setTimeout(() => {
      ecom.initPurchase(self.params.deck);
    }, 251);
  }
}, {
  url: '/tips',
  controller: (self, url) => {
    setView('view-tips');
    document.title = baseTitle + ': Tips';
    scrollTo('body');
  }
}, {
  url: '/about',
  controller: (self, url) => {
    setView('view-about');
    document.title = baseTitle + ': About';
    scrollTo('body');
  }
}, {
  url: '/thanks',
  controller: (self, url) => {
    setView('view-thanks');
    document.title = baseTitle + ': Thanks';
    scrollTo('body');
  }
}, {
  url: '/download',
  controller: (self, url) => {
    setView('view-download');
    document.title = baseTitle + ': Download';
    download(self.query.t);
    scrollTo('body');
  }
}, {
  url: '/account',
  controller: (self, url) => {
    ecom.getUser().then(user => {
      if (user) {
        ecom.logout();
      } else {
        $('#account').removeAttr('hidden');
      }
    });
  },
  onUnload: (self, url) => {
    $('#account').attr('hidden', 'hidden');
  }
}];