import React from 'react'
import qs from 'qs'
import skus from '../../skus.json'

export default class Download extends React.Component {
  constructor (props) {
    super(props)
    this.state = Object.assign({}, props, {
      isProd: process && process.env && process.env.NODE_ENV === 'production'
    })
  }
  componentDidMount () {
    let queryParams = qs.parse(location.search.substring(1))
    let trackConfig = {}
    if (queryParams.o && queryParams.e) {
      this.ownedDeck(queryParams.o, queryParams.e)
      trackConfig.type = 'order_id'
    } else if (queryParams.t) {
      this.withToken(queryParams.t, queryParams.d === 'true')
      trackConfig.type = 'email'
    }
    analytics.page('Download', trackConfig)
  }
  ownedDeck (oid, email) {
    const url = `https://vgqi0l2sad.execute-api.us-west-2.amazonaws.com/prod/order?o=${oid}&e=${email}`
    this.http(url)
      .then(json => {
        let body = json && json.body
        if (typeof document !== 'undefined') {
          this.setState({
            fetched: true,
            urls: body && body.urls
          })
        }
      })
      .catch(console.error)
  }
  withToken (token, autoDownload) {
    const url = `https://vgqi0l2sad.execute-api.us-west-2.amazonaws.com/prod/order?t=${token}`
    this.http(url)
      .then(json => {
        let body = json && json.body
        if (typeof document !== 'undefined') {
          this.setState({
            fetched: true,
            urls: body && body.urls
          })
          if (body && body.urls && autoDownload === true) {
            document.location.href = this.state.urls[Object.keys(this.state.urls)[0]]
          }
        }
      })
      .catch(console.error)
  }
  http (url) {
    return fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'Vvd74BXYum3yeLmtB5heP4ySIVS44qAS9TwcJpKc',
        'x-st-env': this.state.isProd ? 'prod' : 'dev'
      }
    }).then(response => response.json())
  }
  render () {
    let downloadHtml = ''
    let downloadLinks = []
    if (typeof this.state.urls === 'object') {
      for (let sku in this.state.urls) {
        downloadLinks.push(<a key={sku} className="d-block mt-2" href={this.state.urls[sku]}>Download Now ({skus[sku].title})</a>)
      }
    }
    if (downloadLinks.length > 0) {
      downloadHtml = <div className="download-links d-inline-block my-4 p-5">
        <em>If not, click</em>
        {downloadLinks}
      </div>
    } else if (this.state.fetched) {
      const helpEmail = `mailto:help@slidetherapy.com&subject=Help downloading from ${location.href}`
      downloadHtml = <div className="download-links d-inline-block my-4 py-3 px-5">
        <p>This link is no longer valid.</p>
        <p>If you need help, email us at <a href={helpEmail}>help@slidetherapy.com</a></p>
      </div>
    }
    return <section id="view-download" className="mt-5 py-5">
      <div className="container">
        <div className="row">
          <div className="col text-center">
            <h3>Your download will start automatically.</h3>
            {downloadHtml}
          </div>
        </div>
      </div>
    </section>
  }
}
