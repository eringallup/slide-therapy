import skus from 'skus.json';
import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export default class Buy extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }
  componentDidMount() {
    this.setDeck();
    this.setupStripe();
  }
  componentWillUpdate(newProps) {
    if (this.state.match.params.slug !== newProps.match.params.slug) {
      this.setState({
        match: newProps.match
      });
    }
  }
  componentDidUpdate() {
    this.setDeck();
    this.showCheckout();
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
      key: 'pk_test_6pRNASCoBOKtIshFeQd4XMUh',
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      locale: 'auto',
      token: token => {
        this.completePurchase(token);
      }
    });
    this.showCheckout();

    // Close Checkout on page navigation:
    window.addEventListener('popstate', this.handler.close);
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
    let requestConfig = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'Vvd74BXYum3yeLmtB5heP4ySIVS44qAS9TwcJpKc'
      },
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
  render() {
    if (this.state.success) {
      return <Redirect to="/thanks"/>;
    }
    return '';
  }
}
