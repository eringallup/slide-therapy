import React from 'react';
import { Redirect } from 'react-router-dom';
import dataStore from 'store';
import { login, register } from 'account';
import {
  EmailInput,
  PasswordInput,
  NewPasswordInput,
  VerificationCodeInput
} from 'components/FormInput';
import Error from 'components/Error';

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
    this.onSubmit = this.onSubmit.bind(this);
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
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  getFormData(form) {
    let data = {};
    const elements = form.querySelectorAll('input, select, textarea');
    elements.forEach(element => {
      if (element.type !== 'button' && element.type !== 'submit') {
        data[element.name] = element.value;
      }
    });
    // console.log(data);
    return data;
  }
  onSubmit(e) {
    e.preventDefault();
    let data = this.getFormData(e.target);
    this.setState({
      disableForm: true
    });
    login(data.email, data.password, data.newPassword, data.verificationCode)
      .catch(userError => {
        console.log(userError);
        if (userError.code === 'UserNotFoundException') {
          register(data.email, data.password).catch(registerError => {
            if (registerError) {
              dataStore.dispatch({
                type: 'update',
                error: registerError
              });
            }
            this.setState({
              disableForm: false
            });
          });
        } else if (userError.code === 'NotAuthorizedException') {
          this.setState({
            error: 'Incorrect Password',
            disableForm: false
          });
        } else {
          this.setState({
            error: userError.message,
            disableForm: false
          });
        }
      });
  }
  render() {
    if (this.state.user) {
      if (this.state.redirectOnSuccess === false) {
        return '';
      } else if (typeof this.state.redirectOnSuccess === 'string') {
        return <Redirect to={this.state.redirectOnSuccess}/>;
      }
      return <Redirect to="/"/>;
    }
    let submitLabel = 'Login';
    if (this.state.authType === 'register') {
      submitLabel = 'Register';
    }
    return <form id="auth-form" method="POST" action="/auth" onSubmit={this.onSubmit}>
      <fieldset disabled={this.state.disableForm}>
        <div className="mb-3">
          <EmailInput
            onBlur={this.state.onEmailBlur}
            changingPassword={this.state.changingPassword}
          />
        </div>
        <div className="mb-3">
          <PasswordInput
            changingPassword={this.state.changingPassword}
            errorMessage={this.state.error}
          />
        </div>
        <div className="mb-3">
          <NewPasswordInput
            changingPassword={this.state.changingPassword}
          />
        </div>
        <div className="mb-3">
          <VerificationCodeInput
            changingPassword={this.state.changingPassword}
          />
        </div>
        <input
          value={submitLabel}
          className="btn btn-primary btn-sm mb-3"
          type="submit"
          accessKey="s"
        />
        <Error errorMessage={this.state.error}/>
      </fieldset>
    </form>;
  }
}
