import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';
import ready from 'ready';
import { getUser } from 'account';

ready(() => {
  ReactDOM.render(<App/>, document.querySelector('#app'));
  document.body.classList.remove('view-loading');
  getUser();
});
