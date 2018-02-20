import skus from 'skus.json';
import React from 'react';
import axios from 'axios';
import generator from 'generate-password';
import { getUser, register, apiHeaders } from 'account';
import { Redirect } from 'react-router-dom';
import AuthForm from 'components/AuthForm';
import dataStore from 'store';

const stripe = Stripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh');
const elements = stripe.elements();
const style = {
  base: {
    color: '#32325d',
    lineHeight: '18px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};
const card = elements.create('card', {style});

export default class Buy extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
    let sku;
    for (sku in skus) {
      if (skus[sku].slug === this.state.match.params.slug) {
        this.deck = skus[sku];
      }
    }
  }
  componentDidMount() {
    this.unsubscribe = dataStore.subscribe(() => {
      let currentState = dataStore.getState();
      Object.keys(currentState).forEach(item => {
        this.setState({
          [item]: currentState[item]
        });
      });
    });
    this.setupStripe();
    getUser().then(user => {
      this.setState({
        user: user
      });
      if (this.state.user) {
        this.focusStripe();
      }
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  componentDidUpdate() {
    if (this.state.user) {
      this.focusStripe();
    }
  }
  focusStripe() {
    setTimeout(() => {
      card.focus();
    }, 100);
  }
  setupStripe() {
    // https://stripe.com/docs/stripe-js/elements/quickstart
    card.mount('#card-element');
    card.addEventListener('change', ({error}) => {
      var displayError = document.getElementById('card-errors');
      if (error) {
        displayError.textContent = error.message;
      } else {
        displayError.textContent = '';
      }
    });
    var form = document.getElementById('payment-form');
    form.addEventListener('submit', event => {
      event.preventDefault();
      stripe.createToken(card).then(result => {
        if (result.error) {
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          this.completePurchase(result.token);
        }
      });
    });
  }
  completePurchase(token) {
    let requestConfig = {
      method: 'GET',
      headers: apiHeaders({
        'Content-Type': 'application/json'
      }),
      url: 'https://p41v21dj54.execute-api.us-west-2.amazonaws.com/prod/oid',
      params: {
        sku: this.deck.sku,
        token: token.id
      }
    };
    // console.log(requestConfig);
    axios(requestConfig).then(() => {
      this.setState({
        success: true
      });
    }).catch(console.error);
  }
  checkEmail(email) {
    console.log(email);
  }
  render() {
    if (this.state.success) {
      return <Redirect to="/thanks"/>;
    }
    let auth = '';
    if (!this.state.user) {
      auth = <fieldset className="row">
        <div className="col">
          <AuthForm
            onEmailBlur={this.checkEmail}
            redirectOnSuccess={false}
          />
        </div>
      </fieldset>;
    }
    return <div className="container">
      <h2>Buy {this.deck.title}</h2>
      {auth}
      <form action="/charge" method="post" id="payment-form">
        <fieldset className="row" disabled={!this.state.user}>
          <div className="col">
            <label htmlFor="card-element">Credit or debit card</label>
            <div id="card-element" className="mb-3"></div>
            <div id="card-errors" role="alert"></div>
            <button type="submit" className="btn btn-primary">Submit Payment</button>
          </div>
        </fieldset>
      </form>
    </div>;
  }
}
