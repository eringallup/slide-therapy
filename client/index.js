import './styles/index.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'
import { BrowserRouter, StaticRouter } from 'react-router-dom'
import Routes from 'components/Routes'
import Html from 'components/Html'
import dataStore from 'store'

const isProd = process && process.env && process.env.NODE_ENV === 'production'

if (typeof document !== 'undefined') {
  window.Vault = require('vault.js')
  window.$ = require('jquery')
  require('bootstrap')
  require('whatwg-fetch')
  require('./vendor/scrollIt.js')
  window.gtag = gtag
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
    init()
  } else {
    document.addEventListener('DOMContentLoaded', init)
  }
}

function init () {
  const htmlTag = document.querySelector('html')
  htmlTag.classList.remove('no-js')
  window.gTagId = htmlTag.getAttribute('gtagid')
  setupGoogleAnalytics()
  setupStripe(10)
  ReactDOM.hydrate(<BrowserRouter><Routes /></BrowserRouter>, document.querySelector('#app'))
}

function setupGoogleAnalytics () {
  window.dataLayer = window.dataLayer || []
  gtag('js', new Date())
  gtag('config', gTagId)
}

function gtag () {
  // console.log('gtag', arguments)
  window.dataLayer.push(arguments)
}

function setupStripe (attempt) {
  // console.log('setupStripe', attempt, window.StripeCheckout)
  if (typeof StripeCheckout === 'undefined') {
    setTimeout(() => {
      if (attempt < 5000) {
        attempt *= 2
      }
      setupStripe(attempt)
    }, attempt)
    return
  }
  let stripeCheckout = StripeCheckout.configure({
    key: isProd ? 'pk_live_VCaltCKPpZ5maCPQ79s0p7Xk' : 'pk_test_CK71Laidqlso9O9sZDktqW6a',
    locale: 'auto',
    token: token => {
      // console.log('token', token)
      dataStore.dispatch({
        type: 'update',
        hasToken: true,
        token: token
      })
    },
    closed: error => {
      if (error) {
        console.log('closed', error)
      }
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
    // debug: 'error'
  })
}

export default locals => {
  const assets = Object.keys(locals.webpackStats.compilation.assets)
  const css = assets.filter(value => value.match(/\.css$/))
  const js = assets.filter(value => value.match(/\.js$/))
  global.gTagId = locals.gTagId
  global.gtag = () => {}
  return ReactDOMServer.renderToString(
    <StaticRouter location={locals.path} context={locals}>
      <Html js={js} css={css} title={locals.title} context={locals}><Routes context={locals} /></Html>
    </StaticRouter>)
}
