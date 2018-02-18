import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';
import UserAuth from 'components/UserAuth';
import ready from 'ready';
import { getAll as routes } from 'routes';
import * as account from 'account';

ready(() => {
  routes().forEach(route => {
    Router.route(route);
  });
  ReactDOM.render(<App/>, document.querySelector('#app'));
  Router.ready();
  document.body.classList.remove('view-loading');
  account.getUser().then(user => {
    ReactDOM.render(<UserAuth/>, document.querySelector('#nav-user'));
    account.onUser(user);
  });
});
