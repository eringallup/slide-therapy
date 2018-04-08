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
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
    init()
  } else {
    document.addEventListener('DOMContentLoaded', init)
  }
}

function init () {
  const htmlTag = document.querySelector('html')
  htmlTag.classList.remove('no-js')
  setupAnalytics()
  setupStripe(10)
  ReactDOM.hydrate(<BrowserRouter><Routes /></BrowserRouter>, document.querySelector('#app'))
}

function setupAnalytics () {
  if (typeof window === 'undefined') {
    return
  }
  if (navigator.doNotTrack === '1') {
    console.info('Respecting doNotTrack and disabling analytics.')
    window.analytics = {
      track: () => {},
      page: () => {}
    }
    return
  }
  /* eslint-disable */
  var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var o=document.getElementsByTagName("script")[0];o.parentNode.insertBefore(n,o);analytics.integrationOptions=e};analytics.SNIPPET_VERSION="4.0.1";
    analytics.load('NmYeVJ3VplWfQs5243b4cD9BvcqmF6nF');
  }
  /* eslint-enable */
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
  })
}

export default locals => {
  const assets = Object.keys(locals.webpackStats.compilation.assets)
  const css = assets.filter(value => value.match(/\.css$/))
  const js = assets.filter(value => value.match(/\.js$/))
  return ReactDOMServer.renderToString(
    <StaticRouter location={locals.path} context={locals}>
      <Html js={js} css={css} context={locals}><Routes context={locals} /></Html>
    </StaticRouter>)
}
