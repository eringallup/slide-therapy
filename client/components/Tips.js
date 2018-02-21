import React from 'react';

export default class Tips extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }
  render() {
    return <section id="view-tips" className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <h2>Tips</h2>
          </div>
        </div>
      </div>
    </section>;
  }
}
