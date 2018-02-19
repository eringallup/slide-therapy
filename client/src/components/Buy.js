import React from 'react';
import { Redirect } from 'react-router-dom';
import ecom from 'ecom';

const templatesRegex = new RegExp(/\/templates/);

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
    ecom.initPurchase(this.state.match.params.slug);
    ecom.onDismiss(this.onDismiss.bind(this));
    ecom.onSuccess(this.onSuccess.bind(this));
    ecom.onError(this.onError.bind(this));
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
    return '';
  }
}
