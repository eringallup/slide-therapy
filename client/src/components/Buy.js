import React from 'react';
import { Redirect } from 'react-router-dom';
import { EmailInput } from 'components/FormInput';
import ecom from 'ecom';

const templatesRegex = new RegExp(/\/templates/);
const stripe = Stripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh');
const elements = stripe.elements();

export default class Buy extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
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
    const card = elements.create('card', {style: style});
    card.mount('#card-element');
    card.addEventListener('change', event => {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    // Handle form submission
    const form = document.getElementById('payment-form');
    form.addEventListener('submit', event => {
      event.preventDefault();

      stripe.createToken(card).then(result => {
        if (result.error) {
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          ecom.onToken(result.token);
        }
      });
    });

    // ecom.initPurchase(this.state.match.params.slug);
    // ecom.onDismiss(this.onDismiss.bind(this));
    // ecom.onSuccess(this.onSuccess.bind(this));
    // ecom.onError(this.onError.bind(this));
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
    return <div className="container">
      <form action="/charge" method="post" id="payment-form">
        <fieldset className="row">
          <div className="col">
            <EmailInput/>
          </div>
        </fieldset>
        <fieldset className="row" disabled={this.state.loggingIn}>
          <div className="col">
            <label htmlFor="card-element">Credit or debit card</label>
            <div id="card-element"></div>
            <div id="card-errors" role="alert"></div>
            <button type="submit">Submit Payment</button>
          </div>
        </fieldset>
      </form>
    </div>;
  }
}
