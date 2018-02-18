import React from 'react';

export default class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }
  render() {
    return <section id="view-account" className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-sm-6">
            <h2>Account</h2>
            <a href="/logout">Log out</a>
          </div>
          <div className="col-sm-6" id="account-decks"></div>
        </div>
      </div>
    </section>;
  }
}
