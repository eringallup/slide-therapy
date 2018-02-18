import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';
import ready from 'ready';
import { getAll as routes } from 'routes';
import { init } from 'account';

ready(() => {
  routes().forEach(route => {
    Router.route(route);
  });
  ReactDOM.render(<App/>, document.querySelector('#app'));
  Router.ready();
  document.body.classList.remove('view-loading');
  init();
});
