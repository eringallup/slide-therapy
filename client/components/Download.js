import React from 'react';
import qs from 'qs';
import { getUser } from 'lib/account';
import download from 'lib/download';

export default class Download extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }
  componentDidMount() {
    let queryParams = qs.parse(location.search.substring(1));
    getUser().then(user => {
      if (queryParams.o) {
        download.ownedDeck(user, queryParams.o);
      } else if (queryParams.t) {
        download.withToken(queryParams.t, user, queryParams.d === 'true');
      }
    });
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
