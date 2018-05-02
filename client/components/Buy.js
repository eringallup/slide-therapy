import skus from 'skus.json'
import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import dataStore from 'store'

const ERROR_MESSAGES = {
  requestTimedOut: 'Operation Timed Out',
  badRequest: 'Bad Request'
}

export default class Buy extends React.Component {
  constructor (props) {
    super(props)
    const isProd = process && process.env && process.env.NODE_ENV === 'production'
    this.state = Object.assign({}, {
      init: false,
      hasToken: false,
      checkoutSuccess: false,
      apiStage: isProd ? 'prod' : 'dev'
    }, props)
    this.setDeck()
  }
  componentDidMount () {
    this.setStates()
    this.unsubscribe = dataStore.subscribe(() => this.setStates())
    stAnalytics.page('Buy')
    stAnalytics.track('Viewed Checkout Step', {
      step: 1
    })
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
      token: false
    })
    if (typeof window !== 'undefined') {
      window.removeEventListener('popstate', this.stripeCheckout.close)
    }
  }
  setStates () {
    let currentState = dataStore.getState()

    if (currentState.type === 'save') {
      return
    }

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
      hasToken: currentState.hasToken
    })
    this.setupStripe(currentState)
    if (!this.state.error && currentState.token) {
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
    stAnalytics.track('Completed Checkout Step', {
      step: 1
    })
    stAnalytics.track('Checkout Started', this.orderTrackingData)
    stAnalytics.track('Viewed Checkout Step', {
      step: 2
    })
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
    if (this.loadingEllipsis) {
      this.loadingEllipsis.innerText = text
      if (num >= 3) {
        num = 1
      } else {
        num++
      }
    }
    this.ellipsisTimeout = setTimeout(() => {
      this.startEllipsis(num)
    }, 300)
  }
  completePurchase (token) {
    // console.log('completePurchase', token)
    this.showProcessing()
    stAnalytics.track('Completed Checkout Step', {
      step: 2
    })
    stAnalytics.track('Payment Info Entered')
    stAnalytics.track('Viewed Checkout Step', {
      step: 3
    })
    // this.saveEmail(token.email)
    const names = token.card && token.card.name && token.card.name.split(' ')
    const firstName = names.shift()
    const lastName = names.join(' ')
    const url = `https://0423df6x19.execute-api.us-west-2.amazonaws.com/${this.state.apiStage}`
    const jsonData = {
      email: token.email,
      firstName: firstName,
      lastName: lastName,
      sku: this.deck.sku,
      token: token.id
    }
    // console.log(url, jsonData)
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'Vvd74BXYum3yeLmtB5heP4ySIVS44qAS9TwcJpKc'
      },
      body: JSON.stringify(jsonData)
    }).then(response => {
      // console.log('response', response)
      if (response.status < 400) {
        return response.json()
      } else if (response.status === 504) {
        throw new Error(ERROR_MESSAGES.requestTimedOut)
      } else if (response.status === 400) {
        throw new Error(ERROR_MESSAGES.badRequest)
      }
      throw new Error(response.statusText || 'General Ecom Failure')
    })
      .then(json => {
        // console.log(json.id, json.ik)
        if (!json || !json.body) {
          this.handleEcommerceError('Bad response from Ecom')
          return
        }
        if (json.body.errorMessage) {
          this.handleEcommerceError(json.body.errorMessage)
          return
        }
        const orderData = json.body
        // console.log('orderData', orderData)
        if (!orderData.oid) {
          this.handleEcommerceError('Incomplete Order Data')
          return
        }
        if (this.ellipsisTimeout) {
          clearTimeout(this.ellipsisTimeout)
        }
        this.showModal({
          processing: false,
          checkoutSuccess: true
        })
        stAnalytics.track('Order Completed', Object.assign({}, this.orderTrackingData, {
          orderId: orderData.oid
        }))
        stAnalytics.track('Completed Checkout Step', {
          step: 3
        })
      })
      .catch(error => this.handleEcommerceError(error))
  }
  handleEcommerceError (error) {
    // console.error(error)
    let dataStoreUpdate = {
      type: 'update'
    }
    if (!error || error.message !== ERROR_MESSAGES.requestTimedOut) {
      dataStoreUpdate.hasToken = false
      dataStoreUpdate.token = false
    }
    this.showModal({
      processing: false,
      error: error
    }, dataStoreUpdate)
    stAnalytics.track('Ecommerce Error', {
      error: error
    })
  }
  closeCheckout () {
    if (!this.state.checkoutSuccess) {
      stAnalytics.track('Order Cancelled', this.orderTrackingData)
    }
    if (typeof window !== 'undefined') {
      if (window.history.length > 0) {
        window.history.go(-1)
      } else {
        this.setState({
          redirectTo: '/'
        })
      }
    }
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
    const currentState = dataStore.getState()
    if (currentState.hasToken && currentState.token) {
      // the last request timed out, so just try the exact same request again.
      this.completePurchase(currentState.token)
    } else {
      this.dismissModal()
      this.showCheckout()
    }
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
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />
    }
    return ''
  }
}
