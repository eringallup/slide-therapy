import skus from 'skus.json'
import React from 'react'
import { Link, Redirect } from 'react-router-dom'
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
    analytics.page()
  }
  componentWillUnmount () {
    if (this.ellipsisTimeout) {
      clearTimeout(this.ellipsisTimeout)
    }
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

    if (currentState.debug === 'thanks') {
      this.setupStripe(currentState)
      return this.showModal({
        hasToken: true,
        checkoutSuccess: true
      })
    }

    if (currentState.debug === 'processing') {
      this.setupStripe(currentState)
      this.setState({
        hasToken: true
      })
      return this.showProcessing()
    }

    if (currentState.debug === 'error') {
      this.setupStripe(currentState)
      return this.showModal({
        hasToken: true,
        error: true
      })
    }

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
        this.ecommerceTrackingData = {
          name: this.deck.title,
          price: this.deck.displayPrice,
          quantity: 1,
          product_id: this.deck.sku,
          sku: this.deck.sku
        }
        this.orderTrackingData = {
          currency: 'usd',
          value: this.deck.displayPrice,
          revenue: this.getRevenue(this.deck.displayPrice),
          products: [this.ecommerceTrackingData]
        }
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
      billingAddress: true,
      amount: this.deck.amountInCents
    })
    analytics.track('Checkout Started', this.orderTrackingData)
  }
  getRevenue (amount) {
    const fee = (amount * 0.029) + 0.30
    const revenue = (amount - fee).toFixed(2) * 1
    return revenue
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
    this.ellipsisTimeout = setTimeout(() => {
      this.startEllipsis(num)
    }, 300)
  }
  completePurchase (token) {
    this.showProcessing()
    analytics.track('Payment Info Entered')
    // this.saveEmail(token.email)
    // console.info('completePurchase', token)
    const url = 'https://vgqi0l2sad.execute-api.us-west-2.amazonaws.com/prod/order'
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'Vvd74BXYum3yeLmtB5heP4ySIVS44qAS9TwcJpKc',
        'x-st-env': this.state.isProd ? 'prod' : 'dev'
      },
      body: JSON.stringify({
        email: token.email,
        sku: this.deck.sku,
        token: token.id
      })
    }).then(response => response.json())
      .then(json => {
        const orderData = json.body
        // console.log('orderData', orderData)
        if (this.ellipsisTimeout) {
          clearTimeout(this.ellipsisTimeout)
        }
        this.showModal({
          processing: false,
          checkoutSuccess: true
        })
        analytics.track('Order Completed', Object.assign({}, this.orderTrackingData, {
          orderId: orderData.oid
        }))
      })
      .catch(error => {
        console.error(error)
        this.showModal({
          processing: false,
          error: error
        }, {
          type: 'update',
          hasToken: false,
          token: undefined
        })
        analytics.track('Ecommerce Error', {
          error: error
        })
      })
  }
  closeCheckout () {
    analytics.track('Order Cancelled', this.orderTrackingData)
  }
  showModal (state, store) {
    this.setState(state)
    if (store) {
      dataStore.dispatch(store)
    }
    if (typeof $ !== 'undefined') {
      $('.buy-modal').modal({
        backdrop: 'static',
        keyboard: false
      }).modal('show')
    }
  }
  hideModal () {
    if (typeof $ !== 'undefined') {
      $('.buy-modal').modal('hide').modal('dispose')
    }
  }
  dismissModal () {
    this.clearError()
    this.hideModal()
  }
  showProcessing () {
    this.showModal({
      processing: true
    })
    setTimeout(() => {
      this.startEllipsis(3)
    })
  }
  tryAgain (e) {
    e.preventDefault()
    this.clearError()
    this.hideModal()
    this.showCheckout()
  }
  clearError () {
    this.setState({
      error: undefined
    })
  }
  render () {
    this.hideModal()
    if (this.state.processing) {
      return <div className="buy-modal modal" tabIndex="-1" role="dialog">
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
      return <div className="buy-modal modal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body p-5">
              <h3 className="mb-3">There was a problem with your payment</h3>
              <Link className="btn btn-block btn-primary" to="/" onClick={e => this.tryAgain(e)}>Try again?</Link>
            </div>
          </div>
        </div>
      </div>
    }
    if (this.state.hasToken && this.state.checkoutSuccess) {
      return <div className="buy-modal modal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content text-center">
            <div className="modal-body">
              <Link
                to="/"
                className="close"
                aria-label="Close"
                onClick={e => this.dismissModal()}
              ><span aria-hidden="true">&times;</span></Link>
              <div className="p-5">
                <span className="modal-title d-block m-0 h4">Thank You!</span>
                <p className="my-3">Your payment was successful</p>
                <p className="mt-3 mb-4">Check your email for a receipt and link to download your files.</p>
                <Link
                  className="btn btn-primary btn-lg btn-wide"
                  onClick={e => this.dismissModal()}
                  to="/"
                >OK</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
    if (this.state.checkoutClosed) {
      return <Redirect to="/" />
    }
    return ''
  }
}
