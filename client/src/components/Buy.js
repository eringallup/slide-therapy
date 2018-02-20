import React from 'react';
import { Redirect } from 'react-router-dom';
import { EmailInput } from 'components/FormInput';

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
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const {token, error} = await stripe.createToken(card);
      if (error) {
        var errorElement = document.getElementById('card-errors');
        errorElement.textContent = error.message;
      } else {
        this.onToken(token);
      }
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
            <button type="submit" className="btn btn-primary">Submit Payment</button>
          </div>
        </fieldset>
      </form>
    </div>;
  }
}
