import React from 'react';
import ReactDOM from 'react-dom';
import AuthForm from 'slidetherapy/client/src/components/AuthForm.jsx';
import account from 'slidetherapy/client/src/account.jsx';
import ecom from 'slidetherapy/client/src/ecom';
import download from 'slidetherapy/client/src/download';

const baseTitle = 'Slide Therapy 2017';
let currentView = 'view-templates';

const bodyClassList = document.body.classList;
function setView(view) {
  if (view === currentView) {
    return;
  }
  bodyClassList.add(view);
  bodyClassList.remove(currentView);
  currentView = view;
}

function scrollTo(id) {
  // console.info('scrollTo', id);
  scrollIt(document.querySelector(id), 250, 'easeOutQuad');
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
    account.getUser().then(user => {
      if (self.query.t) {
        download.withToken(self.query.t, user, self.query.download === 'true');
      } else if (self.query.o) {
        download.ownedDeck(user, self.query.o);
      }
    });
    scrollTo('body');
  }
}, {
  url: '/account',
  controller: (self, url) => {
    account.getUser().then(user => {
      if (user) {
        setView('view-account');
      } else {
        setView('view-auth');
        ReactDOM.render(<AuthForm/>, document.querySelector('#view-auth .col'));
      }
    });
    scrollTo('body');
  },
  onUnload: (self, url) => {
    ReactDOM.unmountComponentAtNode(document.querySelector('#view-auth .col'));
  }
}, {
  url: '/logout',
  controller: (self, url) => {
    account.getUser().then(user => {
      account.logout(user)
    });
    scrollTo('body');
  }
}];
