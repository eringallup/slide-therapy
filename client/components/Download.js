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
    if (queryParams.o && queryParams.e) {
      this.ownedDeck(queryParams.o, queryParams.e)
    } else if (queryParams.t) {
      this.withToken(queryParams.t, queryParams.d === 'true')
    }
    gtag('config', gTagId)
  }
  ownedDeck (oid, email) {
    const url = `https://vgqi0l2sad.execute-api.us-west-2.amazonaws.com/prod/order?o=${oid}&e=${email}`
    this.http(url)
      .then(json => {
        let body = json && json.body
        if (typeof document !== 'undefined') {
          this.setState({
            urls: body.urls
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
            urls: body.urls
          })
          if (autoDownload === true) {
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
    let downloadLinks = []
    if (this.state.urls) {
      for (let sku in this.state.urls) {
        downloadLinks.push(<li key={sku}>
          <a key={sku} href={this.state.urls[sku]}>Download {skus[sku].title}</a>
        </li>)
      }
    }
    return <section id="view-download" className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <h2>Download</h2>
            <p className="lead">Your deck should start downloading in a moment.</p>
            <ol className="list-unstyled">{downloadLinks}</ol>
          </div>
        </div>
      </div>
    </section>
  }
}
