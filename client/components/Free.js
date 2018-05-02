import React from 'react'
import qs from 'qs'

export default class Free extends React.Component {
  constructor (props) {
    super(props)
    const isProd = process && process.env && process.env.NODE_ENV === 'production'
    this.state = Object.assign({}, props, {
      apiStage: isProd ? 'prod' : 'dev'
    })
  }
  componentWillMount () {
    setPageTitle(this.state)
    let showPromotions = false
    let pathname = this.state.staticContext && this.state.staticContext.path
    if (typeof location !== 'undefined') {
      pathname = location.pathname
    }
    const pathnameRegex = /\/free\/.+$/
    showPromotions = pathnameRegex.test(pathname)
    if (!showPromotions && typeof location !== 'undefined') {
      const queryParams = qs.parse(location.search.substring(1))
      showPromotions = queryParams.f !== undefined
    }
    this.setState({
      showPromotions: showPromotions
    })
  }
  componentDidMount () {
    if (!this.state.showPromotions && window.Vault) {
      stAnalytics.page('Promotions')
      const promotionsData = Vault.get('promotionsData')
      if (promotionsData) {
        this.email.value = promotionsData.email
        this.setState(promotionsData)
      }
    }
  }
  saveData () {
    if (window.Vault) {
      Vault.set('promotionsData', this.getData())
    }
    this.setState(this.getData())
  }
  getData () {
    return {
      email: this.email.value
    }
  }
  captureUser (e) {
    this.setState({
      formDisabled: true
    })
    e.preventDefault()
    const url = `https://2t9ywzbd10.execute-api.us-west-2.amazonaws.com/${this.state.apiStage}`
    const postData = this.getData()
    if (postData.industry === 'other') {
      postData.industry = postData.industryOther
      postData.industryOther = undefined
    }
    // console.log(url, postData)
    this.http(url, postData)
      .then(json => {
        console.log(json)
        this.setState({
          formDisabled: false,
          showPromotions: true
        })
        // location.href = 'https://d380dcsmppijhx.cloudfront.net/free/SlideTherapyColorPalettes.pptx'
      })
      .catch(fetchError => {
        console.error(fetchError)
        this.setState({
          formDisabled: false
        })
      })
  }
  http (url, postData) {
    let config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'Vvd74BXYum3yeLmtB5heP4ySIVS44qAS9TwcJpKc'
      },
      body: JSON.stringify(postData)
    }
    return fetch(url, config).then(response => response.json())
  }
  trackDownload (e, type) {
    stAnalytics.track('Free Download', {
      type: type
    })
  }
  render () {
    let leftSide = <React.Fragment>
      <form className="m-0" onSubmit={e => this.captureUser(e)}>
        <fieldset disabled={this.state.formDisabled}>
          <input
            id="email"
            ref={email => { this.email = email }}
            onBlur={e => this.saveData()}
            className="form-control mb-3"
            type="email"
            placeholder="Email"
            aria-label="Email"
            required
          />
          <input
            type="submit"
            className="btn btn-primary"
            value={this.state.formDisabled ? 'One moment...' : 'Submit'}
          />
        </fieldset>
      </form>
    </React.Fragment>
    if (this.state.showPromotions) {
      leftSide = <React.Fragment>
        <h3 className="h4">Thank You!</h3>
        {/* <p className="lead">Your download should start momentarily</p> */}
        <a
          download
          href="https://d380dcsmppijhx.cloudfront.net/free/SlideTherapyColorPalettes.pptx"
          onClick={e => this.trackDownload(e, 'Color Palettes')}
          className="btn btn-primary"
        >Download Now</a>
      </React.Fragment>
    }
    return <section id="view-free">
      <div className="top-layer" style={{
        background: 'url(/images/free/topimage5-blur.jpg) center no-repeat',
        backgroundSize: 'cover'
      }}>
        <div className="container">
          <div className="row mb-4">
            <div className="col text-center">
              <h2 className="h4">Get&nbsp;FREE color&nbsp;palettes</h2>
              <p className="lead">Make your presentations beautiful.</p>
            </div>
          </div>
          <div className="row d-flex align-items-center">
            <div className="col-12 col-md-4 offset-md-1 text-center">
              {leftSide}
            </div>
            <div className="col-12 mt-5 mt-md-0 col-md-6 offset-md-1">
              <img src="/images/free/color-palettes1.jpg" alt="" className="img-fluid" />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-light">
        <div className="container">
          <div className="row py-5">
            <div className="col text-center">
              <h3 className="mb-4">Learn to make your own</h3>
              <iframe
                width="560"
                height="315"
                style={{
                  maxWidth: '100%'
                }}
                src="https://www.youtube-nocookie.com/embed/7imwzEC5lbY?showinfo=0&rel=0"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  }
}
