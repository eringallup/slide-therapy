import React from 'react'

export default class Promotions extends React.Component {
  constructor (props) {
    super(props)
    const isProd = process && process.env && process.env.NODE_ENV === 'production'
    this.state = Object.assign({}, props, {
      isProd: isProd,
      apiStage: isProd ? 'prod' : 'dev'
    })
  }
  componentWillMount () {
    setPageTitle(this.state)
  }
  componentDidMount () {
    analytics.page('Promotions')
  }
  captureUser (e) {
    this.setState({
      formDisabled: true
    })
    e.preventDefault()
    const url = `https://2t9ywzbd10.execute-api.us-west-2.amazonaws.com/${this.state.apiStage}`
    this.http(url)
      .then(json => {
        console.log(json)
        this.setState({
          formDisabled: false
        })
      })
      .catch(console.error)
  }
  http (url, json) {
    let config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'Vvd74BXYum3yeLmtB5heP4ySIVS44qAS9TwcJpKc'
      },
      body: JSON.stringify(json)
    }
    return fetch(url, config).then(response => response.json())
  }
  render () {
    return <section id="view-promotions" className="mt-5 py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-sm-10 offset-sm-1">
            <h4>Promotions</h4>
            <p className="lead">Enter your contact information and get access to a free set of color palettes.</p>
            <form onSubmit={e => this.captureUser(e)}>
              <fieldset disabled={this.state.formDisabled}>
                <input
                  id="email"
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
      </div>
    </section>
  }
}
