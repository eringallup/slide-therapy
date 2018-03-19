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
      checkoutSuccess: false
    }, props)
    this.setDeck()
  }
  componentDidMount () {
    this.setStates()
    this.unsubscribe = dataStore.subscribe(() => this.setStates())
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
  showCheckout () {
    let email = ''
    if (global.window && window.Vault) {
      email = Vault.get('slideTherapyEmail')
    }
    this.stripeCheckout.open({
      currency: 'USD',
      name: 'Slide Therapy',
      description: `Single-user License for ${this.deck.title}`,
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      panelLabel: 'Buy for {{amount}}',
      email: email,
      zipCode: true,
      // billingAddress: true,
      amount: this.deck.amountInCents
    })
  }
  completePurchase (token) {
    this.showModal({
      processing: true
    })
    if (global.window && window.Vault) {
      Vault.set('slideTherapyEmail', token.email, {
        expires: '+1 day'
      })
    }
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
        'x-api-key': 'Vvd74BXYum3yeLmtB5heP4ySIVS44qAS9TwcJpKc'
      }
    }).then(response => response.json())
      .then(json => {
        const orderData = json.body
        // console.log('orderData', orderData)
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
        'x-api-key': 'Vvd74BXYum3yeLmtB5heP4ySIVS44qAS9TwcJpKc'
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
            <div className="modal-body">
              <h5 className="modal-title">Processing payment</h5>
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
