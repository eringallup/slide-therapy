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
    this.state = {};
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
      return <Redirect to="/"/>;
    }
    return <form id="auth-form" method="POST" action="/auth" onSubmit={this.onSubmit}>
      <fieldset disabled={this.state.disableForm}>
        <EmailInput
          changingPassword={this.state.changingPassword}
        />
        <PasswordInput
          changingPassword={this.state.changingPassword}
          errorMessage={this.state.error}
        />
        <NewPasswordInput
          changingPassword={this.state.changingPassword}
        />
        <VerificationCodeInput
          changingPassword={this.state.changingPassword}
        />
        <input
          value="Login"
          className="btn btn-primary btn-sm"
          type="submit"
          accessKey="s"
        />
      </fieldset>
      <Error errorMessage={this.state.error}/>
    </form>;
  }
}
