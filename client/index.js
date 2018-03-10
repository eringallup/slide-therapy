import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import { BrowserRouter, StaticRouter } from 'react-router-dom';
import Routes from 'components/Routes';
import Html from 'components/Html';

if (typeof global.document !== 'undefined') {
  require('whatwg-fetch');
  require('./vendor/scrollIt.js');
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading'){
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
}

function init() {
  ReactDOM.render(<BrowserRouter>{Routes}</BrowserRouter>, document.querySelector('#app'));
  document.querySelector('html').classList.remove('no-js');
  document.body.classList.remove('view-loading');
}

export default locals => {
  const assets = Object.keys(locals.webpackStats.compilation.assets);
  const js = assets.filter(value => value.match(/\.js$/));
  return ReactDOMServer.renderToString(
    <StaticRouter location={locals.path} context={{}}>
      <Html js={js}>{Routes}</Html>
    </StaticRouter>);
};
