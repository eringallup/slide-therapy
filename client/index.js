import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import './vendor/scrollIt.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { getUser } from 'lib/account';
import App from 'components/App';

if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading'){
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}

function init() {
  ReactDOM.render(<App/>, document.querySelector('#app'));
  document.body.classList.remove('view-loading');
  getUser();
}
