import React from 'react';

export default class Download extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }
  render() {
    return <section id="view-download" className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <h2>Download</h2>
            <p className="lead">Your deck should start downloading in a moment.</p>
            <a id="download-link" hidden></a>
          </div>
        </div>
      </div>
    </section>;
  }
}
