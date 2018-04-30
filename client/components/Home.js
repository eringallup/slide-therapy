import React from 'react'
import Hero from 'components/Hero'
import Overview from 'components/Overview'
import Templates from 'components/Templates'

export default class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
  }
  componentWillMount () {
    setPageTitle(this.state)
  }
  componentDidMount () {
    stAnalytics.page('Home')
  }
  render () {
    // console.info('render', this.state.stripeCheckout)
    return <section id="view-home">
      <Hero />
      <div className="container">
        <div className="row py-5">
          <div className="col text-center">
            <h3>Expert-Designed PowerPoint&nbsp;Templates <em>with built-in mentoring</em></h3>
          </div>
        </div>
      </div>
      <div id="start" className="bg-light">
        <Overview />
        <Templates />
      </div>
    </section>
  }
}
