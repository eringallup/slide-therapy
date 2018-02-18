import React from 'react';
import Vault from 'vault.js';
import dataStore from 'store';
import { login, onUser, register } from 'account';

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    dataStore.subscribe(() => {
      let currentState = dataStore.getState();
      Object.keys(currentState).forEach(item => {
        this.setState({
          [item]: currentState[item]
        });
      });
      if (this.state.changePassword) {
        this.newPasswordInput.focus();
      }
    });
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    let username = Vault.Local.get('username');
    if (username) {
      this.refs.emailInput.value = username;
    }
    if (this.refs.emailInput.value) {
      this.refs.passwordInput.focus();
    } else {
      this.refs.emailInput.focus();
    }
  }
  handleEmailBlur(e) {
    Vault.Local.set('username', e.target.value);
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
      .then(user => {
        onUser(user);
        this.refs.passwordInput.value = '';
        this.setState({
          error: false,
          disableForm: true
        });
        Router.go('/');
      })
      .catch(userError => {
        if (userError.code === 'UserNotFoundException') {
          register(data.email, data.password).then(onUser).catch(registerError => {
            this.setState({
              disableForm: false
            });
          });
        } else if (userError.code === 'NotAuthorizedException') {
          this.setState({
            error: 'Incorrect Password.',
            disableForm: false
          });
          this.refs.passwordInput.focus();
          this.refs.passwordInput.select();
        } else {
          this.setState({
            error: userError.message,
            disableForm: false
          });
        }
      });
  }
  render() {
    const disableForm = this.state.disableForm;
    const changingPassword = this.state.changingPassword;
    const hasError = !(this.state.error);
    const emailInput =
      <div id="email-input">
        <label htmlFor="email">Email</label>
        <input
          ref="emailInput"
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          onBlur={this.handleEmailBlur}
          disabled={changingPassword}
        />
      </div>;
    const passwordInput =
      <div id="password-input">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          ref="passwordInput"
          id="password"
          name="password"
          pattern="(?=^.{8,}$)(?![.\n])(?=.*\d)(?=.*\W+)(?=.*[A-Z])(?=.*[a-z]).*$"
          autoComplete="password"
          disabled={changingPassword}
        />
      </div>
    const newPasswordInput =
      <div id="new-password-input" hidden={!changingPassword}>
        <label htmlFor="newPassword">New Password</label>
        <input
          type="password"
          ref="newPasswordInput"
          id="newPassword"
          name="newPassword"
          pattern="(?=^.{8,}$)(?![.\n])(?=.*\d)(?=.*\W+)(?=.*[A-Z])(?=.*[a-z]).*$"
          autoComplete="password"
          disabled={!changingPassword}
        />
      </div>;
    const verificationCodeInput =
      <div id="verification-code-input" hidden={!changingPassword}>
        <label htmlFor="verificationCode">Verification Code</label>
        <input
          id="verificationCode"
          ref="verificationCodeInput"
          name="verificationCode"
          disabled={!changingPassword}
        />
      </div>;
    return <form id="auth-form" method="POST" action="/auth" onSubmit={this.onSubmit}>
        <fieldset disabled={disableForm}>
          {emailInput}
          {passwordInput}
          {newPasswordInput}
          {verificationCodeInput}
          <input
            value="Login"
            className="btn btn-primary btn-sm"
            type="submit"
            accessKey="s"
          />
        </fieldset>
        <div id="auth-error" className="alert alert-danger" hidden={hasError}>
          {this.state.error}
        </div>
      </form>;
  }
}
