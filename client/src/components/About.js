import React from 'react';

export default class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }
  render() {
    return <section id="view-about" className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <h2>About</h2>
          </div>
        </div>
      </div>
    </section>;
  }
}
