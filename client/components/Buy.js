import skus from 'skus.json';
import qs from 'qs';
import React from 'react';
import { Redirect } from 'react-router-dom';
import dataStore from 'store';

export default class Buy extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, {
      checkoutClosed: false,
      success: false
    }, props);
    this.setDeck();
  }
  componentDidMount() {
    this.setStates();
    this.unsubscribe = dataStore.subscribe(() => this.setStates());
    this.showCheckout();
  }
  componentWillUnmount() {
    this.unsubscribe();
    if (typeof window !== 'undefined') {
      window.removeEventListener('popstate', this.stripeCheckout.close);
    }
  }
  setStates() {
    let currentState = dataStore.getState();
    this.setState({
      checkoutClosed: currentState.checkoutClosed
    });
    if (!this.stripeCheckout && currentState.stripeCheckout) {
      this.stripeCheckout = currentState.stripeCheckout;
      if (typeof window !== 'undefined') {
        window.addEventListener('popstate', this.stripeCheckout.close);
      }
    }
    if (currentState.token) {
      this.completePurchase(currentState.token);
    }
  }
  setDeck() {
    let sku;
    for (sku in skus) {
      if (skus[sku].slug === this.state.match.params.slug) {
        this.deck = skus[sku];
      }
    }
  }
  showCheckout() {
    this.stripeCheckout.open({
      name: this.deck.title,
      description: 'Single-user License',
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      zipCode: true,
      amount: this.deck.amountInCents
    });
  }
  completePurchase(token) {
    const queryString = qs.stringify({
      email: token.email,
      sku: this.deck.sku,
      token: token.id
    });
    const url = `https://p41v21dj54.execute-api.us-west-2.amazonaws.com/prod/oid?${queryString}`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'Vvd74BXYum3yeLmtB5heP4ySIVS44qAS9TwcJpKc'
      }
    }).then(() => {
      this.setState({
        success: true
      });
    }).catch(console.error);
  }
  render() {
    if (this.state.success) {
      return <Redirect to="/thanks"/>;
    }
    if (this.state.checkoutClosed) {
      return <Redirect to="/templates"/>;
    }
    return '';
  }
}
