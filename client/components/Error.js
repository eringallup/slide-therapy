import React from 'react';

export default class Error extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }
  componentWillUpdate(props, state) {
    if (!state.errorMessage && props.errorMessage) {
      this.setState(props);
    }
  }
  render() {
    if (!this.state.errorMessage) {
      return '';
    }
    return <div className="alert alert-danger">{this.state.errorMessage}</div>;
  }
}
