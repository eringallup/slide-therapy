import React from 'react'

export default class Promotions extends React.Component {
  constructor (props) {
    super(props)
    const isProd = process && process.env && process.env.NODE_ENV === 'production'
    this.state = Object.assign({}, props, {
      apiStage: isProd ? 'prod' : 'dev'
    })
  }
  componentWillMount () {
    setPageTitle(this.state)
  }
  componentDidMount () {
    stAnalytics.page('Promotions')
    if (window.Vault) {
      const promotionsData = Vault.get('promotionsData')
      if (promotionsData) {
        this.email.value = promotionsData.email
        this.firstName.value = promotionsData.firstName
        this.lastName.value = promotionsData.lastName
        this.industry.value = promotionsData.industry
        this.industryOther.value = promotionsData.industryOther
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
      email: this.email.value,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      industry: this.industry.value,
      industryOther: this.industryOther.value
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
  render () {
    return <section id="view-promotions" className="py-5 bg-light">
      <div className="container">
        <div className="row" hidden={this.state.showPromotions}>
          <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-sm-10 offset-sm-1">
            <h4>Promotions</h4>
            <p className="lead">Enter your contact information and get access to a free stuff.</p>
            <form onSubmit={e => this.captureUser(e)}>
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
                <div className="form-group row">
                  <div className="col">
                    <input
                      id="firstName"
                      ref={firstName => { this.firstName = firstName }}
                      onBlur={e => this.saveData()}
                      className="form-control"
                      placeholder="First Name"
                      aria-label="First Name"
                      autoCapitalize="word"
                      required
                    />
                  </div>
                  <div className="col">
                    <input
                      id="lastName"
                      ref={lastName => { this.lastName = lastName }}
                      onBlur={e => this.saveData()}
                      className="form-control"
                      placeholder="Last Name"
                      aria-label="Last Name"
                      autoCapitalize="word"
                      required
                    />
                  </div>
                </div>
                <select
                  id="industry"
                  ref={industry => { this.industry = industry }}
                  onChange={e => this.saveData()}
                  className={'form-control mb-3'}
                  placeholder="Industry"
                  aria-label="Industry"
                  required
                >
                  <option selected value="" className="text-muted">Industry</option>
                  <option value="aerospace">Aerospace</option>
                  <option value="business">Business</option>
                  <option value="science-and-health">Science &amp; Health</option>
                  <option value="beauty-and-fashion">Beauty &amp; Fashion</option>
                  <option value="hospitality-and-travel">Hospitality &amp; Travel</option>
                  <option value="home-and-wellness">Home &amp; Wellness</option>
                  <option value="environmental">Environmental</option>
                  <option value="other">Other</option>
                </select>
                <input
                  id="industryOther"
                  ref={industryOther => { this.industryOther = industryOther }}
                  onBlur={e => this.saveData()}
                  className="form-control mb-3"
                  placeholder="Enter your industry"
                  aria-label="Enter your industry"
                  autoCapitalize="word"
                  hidden={this.state.industry !== 'other'}
                  required
                />
                <input type="submit" className="btn btn-primary btn-block" value="Submit" />
              </fieldset>
            </form>
            <p className="text-center" hidden={!this.state.formDisabled}>Just a moment...</p>
          </div>
        </div>
        <div className="row" hidden={!this.state.showPromotions}>
          <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-sm-10 offset-sm-1">
            <h3><a href="/promotions/free-color-palettes">Free Color Palettes</a></h3>
          </div>
        </div>
      </div>
    </section>
  }
}
