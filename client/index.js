import './styles/index.scss'
import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'
import { BrowserRouter, StaticRouter } from 'react-router-dom'
import Routes from 'components/Routes'
import Html from 'components/Html'
import pageData from 'pages.json'
import dataStore from 'store'

const isProd = process && process.env && process.env.NODE_ENV === 'production'
const segmentKey = isProd ? 'tplTpmOXufbHiEvqFxEvRhNRL7XQs6bE' : 'NmYeVJ3VplWfQs5243b4cD9BvcqmF6nF'
let analyticsToTrack = []

if (typeof document !== 'undefined') {
  window.Vault = require('vault.js')
  window.$ = require('jquery')
  window.setPageTitle = setPageTitle
  window.stAnalytics = {
    track: (name, properties) => handleAnalytics('track', name, properties),
    page: (name, properties) => handleAnalytics('page', name, properties)
  }
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
  ReactDOM.hydrate(<BrowserRouter><Routes /></BrowserRouter>, document.querySelector('#app'))
  setupAnalytics(analyticsToTrack)
  setupYouTube()
  setupStripe(10)
}

function handleAnalytics (type, name, properties) {
  if (!isProd && typeof window !== 'undefined' && window.Vault.get('debugAnalytics')) {
    console.info('handleAnalytics', window.analytics !== undefined, type, name, properties)
  }
  if (window.analytics && window.analytics[type]) {
    window.analytics[type](name, properties)
    sendQueuedAnalytics()
  } else {
    analyticsToTrack.push({
      type: type,
      name: name,
      properties: properties
    })
  }
}

function sendQueuedAnalytics () {
  while (analyticsToTrack.length) {
    const item = analyticsToTrack.shift()
    handleAnalytics(item.type, item.name, item.properties)
  }
}

// https://developers.google.com/youtube/iframe_api_reference
function setupYouTube () {
  window.onYouTubeIframeAPIReady = () => {
    dataStore.dispatch({
      type: 'update',
      youTubeReady: true
    })
  }
  setTimeout(() => {
    let tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
  })
}

function setPageTitle (state, title) {
  if (title) {
    document.title = title
  } else if (state) {
    const statePathname = state && state.location && state.location.pathname
    if (statePathname) {
      let pathname = statePathname.replace(/.+\/$/, '')
      pathname = pathname.replace(/\/index\.html$/, '')
      const page = pageData[pathname]
      document.title = (page && page.title) || 'Slide Therapy'
    }
  }
}

function setupAnalytics (analyticsToTrack) {
  if (typeof window === 'undefined') {
    return
  }
  if (!isProd) {
    console.info('No analytics on not prod.')
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
    analytics.load(segmentKey);
  }
  /* eslint-enable */
  analytics.ready(() => sendQueuedAnalytics())
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
  global.setPageTitle = () => {}
  const assets = Object.keys(locals.webpackStats.compilation.assets)
  const css = assets.filter(value => value.match(/\.css$/))
  const js = assets.filter(value => value.match(/\.js$/))
  return ReactDOMServer.renderToString(
    <StaticRouter location={locals.path} context={locals}>
      <Html js={js} css={css} context={locals}><Routes context={locals} /></Html>
    </StaticRouter>)
}
