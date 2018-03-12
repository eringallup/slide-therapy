import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'
import { BrowserRouter, StaticRouter } from 'react-router-dom'
import Routes from 'components/Routes'
import Html from 'components/Html'
import dataStore from 'store'

if (typeof global.document !== 'undefined') {
  require('whatwg-fetch')
  require('./vendor/scrollIt.js')
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
    init()
  } else {
    document.addEventListener('DOMContentLoaded', init)
  }
}

function init () {
  ReactDOM.hydrate(<BrowserRouter><Routes /></BrowserRouter>, document.querySelector('#app'))
  document.querySelector('html').classList.remove('no-js')
  let stripeCheckout = StripeCheckout.configure({
    key: 'pk_test_CK71Laidqlso9O9sZDktqW6a',
    locale: 'auto',
    token: token => {
      dataStore.dispatch({
        type: 'update',
        token: token
      })
    },
    closed: () => {
      let currentState = dataStore.getState()
      if (!currentState.token) {
        dataStore.dispatch({
          type: 'update',
          checkoutClosed: true
        })
      }
    }
  })
  dataStore.dispatch({
    type: 'update',
    stripeCheckout: stripeCheckout
  })
}

export default locals => {
  const assets = Object.keys(locals.webpackStats.compilation.assets)
  const js = assets.filter(value => value.match(/\.js$/))
  return ReactDOMServer.renderToString(
    <StaticRouter location={locals.path} context={{}}>
      <Html js={js} title={locals.title} context={locals.context}><Routes context={locals.context} /></Html>
    </StaticRouter>)
}
