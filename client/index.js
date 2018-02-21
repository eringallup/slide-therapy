import './style.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './vendor/scrollIt.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { getUser } from 'lib/account';
import App from 'components/App';

function ready(fn) {
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(() => {
  ReactDOM.render(<App/>, document.querySelector('#app'));
  document.body.classList.remove('view-loading');
  getUser();
});
