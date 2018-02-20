import React from 'react';
import Vault from 'vault.js';
import * as account from 'account';
import dataStore from 'store';

export class EmailInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }
  componentDidMount() {
    let username = Vault.Local.get('username');
    if (username) {
      this.emailInput.value = username;
    } else {
      this.emailInput.focus();
    }
  }
  handleEmailBlur(e) {
    let emailValue = e.target.value;
    Vault.Local.set('username', emailValue);
    if (typeof this.state.onBlur === 'function') {
      this.state.onBlur(emailValue);
    }
    if (emailValue) {
      account.login(emailValue, 'abcDEF123!@#')
        .catch(error => {
          let authType = 'login';
          if (error.code === 'UserNotFoundException') {
            authType = 'register';
          }
          dataStore.dispatch({
            type: 'update',
            authType: authType
          });
        });
    }
  }
  render() {
    return <div id="email-input">
      <label htmlFor="email">Email</label>
      <input
        ref={(el) => this.emailInput = el}
        className="form-control"
        type="email"
        id="email"
        name="email"
        autoComplete="email"
        onBlur={this.handleEmailBlur.bind(this)}
        disabled={this.state.changingPassword}
      />
    </div>;
  }
}

export class PasswordInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }
  componentDidMount() {
    if (this.state.errorMessage === 'Incorrect Password') {
      this.hightlight();
    }
    let username = Vault.Local.get('username');
    if (username) {
      this.passwordInput.focus();
    }
  }
  componentWillUpdate(props) {
    if (props.errorMessage) {
      setTimeout(() => {
        this.hightlight();
      });
    }
  }
  hightlight() {
    this.passwordInput.select();
    this.passwordInput.focus();
  }
  render() {
    return <div id="password-input">
      <label htmlFor="password">Password</label>
      <input
        type="password"
        ref={(el) => this.passwordInput = el}
        className="form-control"
        id="password"
        name="password"
        pattern="(?=^.{8,}$)(?![.\n])(?=.*\d)(?=.*\W+)(?=.*[A-Z])(?=.*[a-z]).*$"
        autoComplete="password"
        disabled={this.state.changingPassword}
      />
    </div>;
  }
}

export class NewPasswordInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }
  componentDidMount() {
    if (this.state.changingPassword) {
      this.newPasswordInput.focus();
    }
  }
  render() {
    return <div id="new-password-input" hidden={!this.state.changingPassword}>
      <label htmlFor="newPassword">New Password</label>
      <input
        type="password"
        ref={(el) => this.newPasswordInput = el}
        className="form-control"
        id="newPassword"
        name="newPassword"
        pattern="(?=^.{8,}$)(?![.\n])(?=.*\d)(?=.*\W+)(?=.*[A-Z])(?=.*[a-z]).*$"
        autoComplete="password"
        disabled={!this.state.changingPassword}
      />
    </div>;
  }
}

export class VerificationCodeInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }
  render() {
    return <div id="verification-code-input" hidden={!this.state.changingPassword}>
      <label htmlFor="verificationCode">Verification Code</label>
      <input
        id="verificationCode"
        ref={(el) => this.verificationCodeInput = el}
        name="verificationCode"
        disabled={!this.state.changingPassword}
      />
    </div>;
  }
}
