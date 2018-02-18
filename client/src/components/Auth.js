import React from 'react';
import AuthForm from 'components/AuthForm';

export default class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }
  render() {
    return <section id="view-auth" className="py-5">
      <div className="container">
        <div className="row">
          <div className="col text-center">
            <AuthForm/>
          </div>
        </div>
      </div>
    </section>;
  }
}
