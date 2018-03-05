import React from 'react';
import qs from 'qs';
import axios from 'axios';

export default class Download extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }
  componentDidMount() {
    let queryParams = qs.parse(location.search.substring(1));
    if (queryParams.o && queryParams.e) {
      this.ownedDeck(queryParams.o, queryParams.e);
    } else if (queryParams.t) {
      this.withToken(queryParams.t, queryParams.d === 'true');
    }
  }
  ownedDeck(oid, email) {
    const url = `https://vgqi0l2sad.execute-api.us-west-2.amazonaws.com/prod/order?o=${oid}&e=${email}`;
    this.http(url)
      .then(json => {
        let body = json && json.data && json.data.body;
        document.location.href = body.downloadUrl;
      })
      .catch(console.error);
  }
  withToken(token, autoDownload) {
    const url = `https://vgqi0l2sad.execute-api.us-west-2.amazonaws.com/prod/order?t=${token}`;
    this.http(url)
      .then(json => {
        let body = json && json.data && json.data.body;
        let downloadLink = document.querySelector('#download-link');
        downloadLink.removeAttribute('hidden');
        downloadLink.setAttribute('href', body.downloadUrl);
        downloadLink.innerText = 'Download ' + body.deck.title;
        if (autoDownload === true) {
          document.location.href = body.downloadUrl;
        }
      })
      .catch(console.error);
  }
  http(url) {
    return axios({
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'Vvd74BXYum3yeLmtB5heP4ySIVS44qAS9TwcJpKc'
      },
      url: url
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
