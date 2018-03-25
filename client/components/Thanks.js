import React from 'react'

export default class Thanks extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
  }
  componentDidMount () {
    analytics.page()
  }
  render () {
    return <section id="view-thanks" className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <h2>Thanks!</h2>
            <h3>You are on your way to better presentations!</h3>
            <p>We have emailed you a link to download your deck.</p>
          </div>
        </div>
      </div>
    </section>
  }
}
