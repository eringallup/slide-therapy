import skus from 'skus.json';
import qs from 'qs';
import React from 'react';
import { Redirect } from 'react-router-dom';

export default class Buy extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, {
      back: false,
      success: false,
      hasToken: false
    }, props);
    this.setDeck();
    this.setupStripe();
  }
  componentDidMount() {
    this.showCheckout();
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', this.handler.close);
    }
  }
  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('popstate', this.handler.close);
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
  setupStripe() {
    this.handler = StripeCheckout.configure({
      key: 'pk_test_CK71Laidqlso9O9sZDktqW6a',
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      locale: 'auto',
      token: token => this.completePurchase(token),
      closed: () => {
        if (!this.state.hasToken) {
          this.setState({
            back: true
          });
        }
      }
    });
  }
  showCheckout() {
    this.handler.open({
      name: this.deck.title,
      description: 'Slide Therapy',
      zipCode: true,
      amount: this.deck.amountInCents
    });
  }
  completePurchase(token) {
    this.setState({
      hasToken: true
    });
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
    if (this.state.back) {
      return <Redirect to="/templates"/>;
    }
    return '';
  }
}
