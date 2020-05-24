/* eslint-disable react/jsx-closing-tag-location */
import React from 'react'
import qs from 'qs'
// import skus from '../../skus.json'

export default class Download extends React.Component {
  constructor (props) {
    super(props)
    const isProd = process && process.env && process.env.NODE_ENV === 'production'
    this.state = Object.assign({}, props, {
      apiStage: isProd ? 'prod' : 'dev'
    })
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount () {
    setPageTitle(this.state)
  }

  componentDidMount () {
    const queryParams = qs.parse(location.search.substring(1))
    const trackConfig = {}
    if (queryParams.o && queryParams.e) {
      this.ownedDeck(queryParams.o, queryParams.e)
      trackConfig.type = 'order_id'
    } else if (queryParams.t) {
      this.withToken(queryParams.t, queryParams.d === 'true')
      trackConfig.type = 'email'
    }
    stAnalytics.page('Download', trackConfig)
  }

  ownedDeck (oid, email) {
    const url = `https://0423df6x19.execute-api.us-west-2.amazonaws.com/${this.state.apiStage}?o=${oid}&e=${email}`
    this.http(url)
      .then(json => {
        const downloadUrl = json && json.body
        if (typeof document !== 'undefined') {
          this.setState({
            fetched: true,
            downloadUrl: downloadUrl
          })
        }
      })
      .catch(console.error)
  }

  withToken (token, autoDownload) {
    const url = `https://0423df6x19.execute-api.us-west-2.amazonaws.com/${this.state.apiStage}?t=${token}`
    this.http(url)
      .then(json => {
        const downloadUrl = json && json.body
        if (typeof document !== 'undefined') {
          this.setState({
            fetched: true,
            downloadUrl: downloadUrl
          })
          // console.log(downloadUrl)
          if (typeof downloadUrl === 'string' && downloadUrl.length > 5 && autoDownload === true) {
            document.location.href = downloadUrl
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
        'x-api-key': 'Vvd74BXYum3yeLmtB5heP4ySIVS44qAS9TwcJpKc'
      }
    }).then(response => response.json())
  }

  render () {
    let downloadHtml = ''
    if (this.state.downloadUrl && this.state.downloadUrl.length > 0) {
      downloadHtml = <div className="download-links d-inline-block my-4 p-5">
        <em>If not, click</em>
        <a className="d-block mt-2" href={this.state.downloadUrl}>Download Now</a>
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
