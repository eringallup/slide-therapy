import skus from 'skus.json';
import React from 'react';
import { getUser } from 'account';
import { Redirect } from 'react-router-dom';
import { EmailInput, PasswordInput } from 'components/FormInput';

const templatesRegex = new RegExp(/\/templates/);
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
    this.ready = false;
  }
  onDismiss() {
    if (this.ready && !templatesRegex.test(location.pathname)) {
      this.setState({
        dismissed: true
      });
    }
  }
  onSuccess() {
    if (this.ready) {
      this.setState({
        success: true
      });
    }
  }
  onError(error) {
    // console.log('onError', this.ready, error);
    if (error.code === 'UsernameExistsException') {
      this.setState({
        login: true
      });
    }
  }
  componentDidMount() {
    getUser().then(user => {
      this.setState({
        user: user
      });
    });

    card.mount('#card-element');
    card.addEventListener('change', ({error}) => {
      var displayError = document.getElementById('card-errors');
      if (error) {
        displayError.textContent = error.message;
      } else {
        displayError.textContent = '';
      }
    });

    // Handle form submission
    const form = document.getElementById('payment-form');
    form.addEventListener('submit', event => {
      event.preventDefault();
      stripe.createToken(card, response => {
        if (response.error) {
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = response.error.message;
        } else {
          this.onToken(response.token);
        }
      });
    });

    this.ready = true;
  }
  componentWillUnmount() {
    this.ready = false;
  }
  render() {
    if (this.state.login) {
      return <Redirect to="/login"/>;
    }
    if (this.state.dismissed) {
      return <Redirect to="/"/>;
    }
    if (this.state.success) {
      return <Redirect to="/thanks"/>;
    }
    let auth = '';
    if (!this.state.user) {
      auth = <fieldset className="row">
        <div className="col">
          <EmailInput/>
          <PasswordInput/>
        </div>
      </fieldset>;
    }
    return <div className="container">
      <h2>Buy {this.deck.title}</h2>
      <form action="/charge" method="post" id="payment-form">
        {auth}
        <fieldset className="row" disabled={this.state.loggingIn}>
          <div className="col">
            <label htmlFor="card-element">Credit or debit card</label>
            <div id="card-element"></div>
            <div id="card-errors" role="alert"></div>
            <button type="submit" className="btn btn-primary">Submit Payment</button>
          </div>
        </fieldset>
      </form>
    </div>;
  }
}
