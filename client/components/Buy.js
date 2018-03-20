import skus from 'skus.json'
import qs from 'qs'
import React from 'react'
import { Redirect } from 'react-router-dom'
import dataStore from 'store'

export default class Buy extends React.Component {
  constructor (props) {
    super(props)
    this.state = Object.assign({}, {
      init: false,
      hasToken: false,
      checkoutClosed: false,
      checkoutSuccess: false,
      isProd: process && process.env && process.env.NODE_ENV === 'production'
    }, props)
    this.setDeck()
  }
  componentDidMount () {
    this.setStates()
    this.unsubscribe = dataStore.subscribe(() => this.setStates())
    gtag('config', gTagId)
  }
  componentWillUnmount () {
    this.unsubscribe()
    dataStore.dispatch({
      type: 'update',
      hasToken: false,
      checkoutClosed: false,
      checkoutSuccess: false,
      token: undefined
    })
    if (typeof window !== 'undefined') {
      window.removeEventListener('popstate', this.stripeCheckout.close)
    }
  }
  setStates () {
    let currentState = dataStore.getState()
    this.setState({
      checkoutClosed: currentState.checkoutClosed,
      hasToken: currentState.hasToken
    })
    this.setupStripe(currentState)
    if (currentState.token) {
      this.completePurchase(currentState.token)
    }
    if (currentState.checkoutClosed) {
      this.closeCheckout()
    }
  }
  setDeck () {
    let sku
    for (sku in skus) {
      if (skus[sku].slug === this.state.match.params.slug) {
        this.deck = skus[sku]
      }
    }
  }
  setupStripe (currentState) {
    if (!this.stripeCheckout && currentState.stripeCheckout) {
      this.stripeCheckout = currentState.stripeCheckout
      if (!this.state.init) {
        this.setState({
          init: true
        })
        this.showCheckout()
      }
      if (typeof window !== 'undefined') {
        window.addEventListener('popstate', this.stripeCheckout.close)
      }
    }
  }
  saveEmail (email) {
    if (window && window.Vault) {
      Vault.set('slideTherapyEmail', email, {
        expires: '+1 day'
      })
    }
  }
  getEmail () {
    let email = ''
    if (window && window.Vault) {
      email = Vault.get('slideTherapyEmail')
    }
    return email
  }
  showCheckout () {
    this.stripeCheckout.open({
      currency: 'USD',
      name: this.deck.stripe_title,
      description: 'Single User License',
      image: '/images/slide-therapy-logo-stripe.png',
      panelLabel: 'Buy for {{amount}}',
      // email: this.getEmail(),
      zipCode: true,
      // billingAddress: true,
      amount: this.deck.amountInCents
    })
    gtag('event', 'add_to_cart', {
      event_label: this.deck.title
    })
    gtag('event', 'begin_checkout', {
      event_label: this.deck.title
    })
  }
  startEllipsis (num) {
    let text = ''
    for (let i = 0; i < num; i++) {
      text += '•'
    }
    this.loadingEllipsis.innerText = text
    if (num >= 3) {
      num = 1
    } else {
      num++
    }
    setTimeout(() => {
      this.startEllipsis(num)
    }, 300)
  }
  completePurchase (token) {
    this.showModal({
      processing: true
    })
    this.startEllipsis(3)
    // this.saveEmail(token.email)
    // console.info('completePurchase', token)
    const queryString = qs.stringify({
      email: token.email,
      sku: this.deck.sku,
      token: token.id
    })
    const url = `https://p41v21dj54.execute-api.us-west-2.amazonaws.com/prod/oid?${queryString}`
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'Vvd74BXYum3yeLmtB5heP4ySIVS44qAS9TwcJpKc',
        'x-st-env': this.state.isProd ? 'prod' : 'dev'
      }
    }).then(response => response.json())
      .then(json => {
        const orderData = json.body
        // console.log('orderData', orderData)
        gtag('event', 'checkout_progress', {
          event_label: this.deck.title
        })
        this.checkOrderState(orderData.oid, token)
      })
      .catch(console.error)
  }
  checkOrderState (oid, token) {
    const queryString = qs.stringify({
      o: oid,
      e: token.email,
      t: token.id.replace('tok_', '')
    })
    const url = `https://vgqi0l2sad.execute-api.us-west-2.amazonaws.com/prod/order?${queryString}`
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'Vvd74BXYum3yeLmtB5heP4ySIVS44qAS9TwcJpKc',
        'x-st-env': this.state.isProd ? 'prod' : 'dev'
      }
    }).then(response => response.json())
      .then(orderData => {
        if (!orderData) {
          console.log('no order data')
          this.showModal({
            processing: false,
            error: 'no order data'
          }, {
            type: 'update',
            hasToken: false,
            token: undefined
          })
        }
        if (orderData.order_status === 'processing') {
          setTimeout(() => {
            this.checkOrderState(oid, token)
          }, 500)
        } else if (orderData.order_status === 'complete') {
          this.setState({
            processing: false,
            checkoutSuccess: true
          })
          gtag('event', 'purchase', {
            event_label: this.deck.title
          })
        } else {
          // console.log('unknown error')
          this.showModal({
            processing: false,
            error: 'unknown error'
          }, {
            type: 'update',
            hasToken: false,
            token: undefined
          })
        }
      })
      .catch(error => {
        console.log('error', error)
        this.showModal({
          processing: false,
          error: error
        }, {
          type: 'update',
          hasToken: false,
          token: undefined
        })
      })
  }
  closeCheckout () {
    gtag('event', 'remove_from_cart', {
      event_label: this.deck.title
    })
  }
  showModal (state, store) {
    this.setState(state)
    if (store) {
      dataStore.dispatch(store)
    }
    if (typeof $ !== 'undefined') {
      $('#buyModal').modal({
        backdrop: 'static',
        keyboard: false
      }).modal('show')
    }
    if (state.error) {
      gtag('event', 'exception', {
        description: state.error
      })
    }
  }
  hideModal () {
    if (typeof $ !== 'undefined') {
      $('#buyModal').modal('hide').modal('dispose')
    }
  }
  tryAgain (e) {
    e.preventDefault()
    this.setState({
      error: undefined
    })
    this.hideModal()
    this.showCheckout()
  }
  render () {
    if (this.state.processing) {
      this.hideModal()
      return <div id="buyModal" className="modal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-sm modal-dialog-centered" role="document">
          <div className="modal-content text-center">
            <div className="modal-body py-4 px-5">
              <div className="modal-title">
                <span className="d-block m-0 h3">Processing</span>
                <span className="d-block m-0 h4">payment</span>
                <span
                  className="loading-ellipsis"
                  ref={loadingEllipsis => { this.loadingEllipsis = loadingEllipsis }}
                >...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
    if (this.state.error) {
      this.hideModal()
      return <div id="buyModal" className="modal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-sm modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <h5 className="modal-title pb-3">There was a problem with your payment</h5>
              <a className="btn btn-block btn-primary" href="/" onClick={e => this.tryAgain(e)}>Try again?</a>
            </div>
          </div>
        </div>
      </div>
    }
    this.hideModal()
    if (this.state.hasToken && this.state.checkoutSuccess) {
      return <Redirect to="/thanks" />
    }
    if (this.state.checkoutClosed) {
      return <Redirect to="/" />
    }
    return ''
  }
}
