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
        this.firstName.value = promotionsData.first_name
        this.lastName.value = promotionsData.last_name
      }
    }
  }
  captureUser (e) {
    this.setState({
      formDisabled: true
    })
    e.preventDefault()
    const url = `https://2t9ywzbd10.execute-api.us-west-2.amazonaws.com/${this.state.apiStage}`
    const postData = {
      email: this.email.value,
      first_name: this.firstName.value,
      last_name: this.lastName.value
    }
    if (window.Vault) {
      Vault.set('promotionsData', postData)
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
                  className="form-control mb-3"
                  type="email"
                  placeholder="Email"
                  aria-label="Email"
                  required
                />
                <div className="form-group row">
                  <div className="col">
                    <input
                      id="first_name"
                      ref={firstName => { this.firstName = firstName }}
                      className="form-control"
                      placeholder="First Name"
                      aria-label="First Name"
                      autoCapitalize="word"
                      required
                    />
                  </div>
                  <div className="col">
                    <input
                      id="last_name"
                      ref={lastName => { this.lastName = lastName }}
                      className="form-control"
                      placeholder="Last Name"
                      aria-label="Last Name"
                      autoCapitalize="word"
                      required
                    />
                  </div>
                </div>
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
