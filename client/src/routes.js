import React from 'react';
import ReactDOM from 'react-dom';
import AuthForm from 'components/AuthForm';
import * as account from 'account';
import ecom from 'ecom';
import download from 'download';

const baseTitle = 'Slide Therapy 2017';
let currentView = 'view-templates';
let bodyClassList;

function setView(view) {
  if (view === currentView) {
    return;
  }
  bodyClassList.add(view);
  bodyClassList.remove(currentView);
  currentView = view;
}

export function getAll() {
  bodyClassList = document.body.classList;
  return routes;
}

function scrollTo(id) {
  // console.info('scrollTo', id);
  scrollIt(document.querySelector(id), 250, 'easeOutQuad');
}

const routes = [{
  url: '/',
  controller: () => {
    setView('view-templates');
    document.title = baseTitle;
    scrollTo('body');
  }
}, {
  url: '/templates',
  controller: () => {
    setView('view-templates');
    document.title = baseTitle + ' Templates';
    scrollTo('#templates');
  }
}, {
  url: '/buy/:deck',
  controller: (self) => {
    setView('view-templates');
    document.title = baseTitle + ': Buy ' + self.params.deck;
    scrollTo('#templates');
    setTimeout(() => {
      ecom.initPurchase(self.params.deck);
    }, 251);
  }
}, {
  url: '/tips',
  controller: () => {
    setView('view-tips');
    document.title = baseTitle + ': Tips';
    scrollTo('body');
  }
}, {
  url: '/about',
  controller: () => {
    setView('view-about');
    document.title = baseTitle + ': About';
    scrollTo('body');
  }
}, {
  url: '/thanks',
  controller: () => {
    setView('view-thanks');
    document.title = baseTitle + ': Thanks';
    scrollTo('body');
  }
}, {
  url: '/download',
  controller: (self) => {
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
  controller: () => {
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
  onUnload: () => {
    ReactDOM.unmountComponentAtNode(document.querySelector('#view-auth .col'));
  }
}, {
  url: '/logout',
  controller: () => {
    account.getUser().then(user => {
      account.logout(user);
    });
    scrollTo('body');
  }
}];
