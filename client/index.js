import './style.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './vendor/scrollIt.js';
import React from 'react';
import ReactDOM from 'react-dom';
import ready from 'lib/ready';
import { getUser } from 'lib/account';
import App from 'components/App';

ready(() => {
  ReactDOM.render(<App/>, document.querySelector('#app'));
  document.body.classList.remove('view-loading');
  getUser();
});
