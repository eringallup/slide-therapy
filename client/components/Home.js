/* eslint-disable react/jsx-closing-tag-location */
import React from 'react'
import Hero from 'components/Hero'
import Templates from 'components/Templates'
import Formats from 'components/Formats'
import Quotes from 'components/Quotes'
import dataStore from 'store'

export default class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = { ...props }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount () {
    setPageTitle(this.state)
  }

  componentDidMount () {
    stAnalytics.page('Home')
    try {
      const slug = this.state.match.params.slug
      dataStore.dispatch({
        type: 'startCheckout',
        startCheckout: slug
      })
    } catch (e) {
      // do nothing.
    }
  }

  render () {
    // console.info('render', this.state.stripeCheckout)
    return <section id="view-home">
      <Hero />
      <div className="container">
        <div className="row py-5">
          <div className="col text-center">
            <h3>Expert-Designed Presentation&nbsp;Templates <em>with built-in mentoring</em></h3>
          </div>
        </div>
      </div>
      <div id="start" className="bg-light">
        <div className="container pt-5">
          <div className="row">
            <div className="col text-center">
              <h3>Communicate&nbsp;Clearly. Work&nbsp;Faster. <span className="d-none d-md-block" />Look&nbsp;Refined.</h3>
              <p className="lead mt-3 text-left text-lg-center">Slide Therapy is a series of master presentation files for Mac and PC that include everything you need to make a stunning presentation:</p>
            </div>
          </div>
          <div className="row pt-3 px-5">
            <div className="col">
              <div className="mx-auto mx-md-0 d-flex flex-column flex-sm-row justify-content-center align-items-center align-items-stretch align-items-sm-start">
                <div className="start-list mr-md-3">
                  <h4>Templates</h4>
                  <ol className="list-unstyled">
                    <li>Cover slides</li>
                    <li>Overview slides</li>
                    <li>Content slides</li>
                    <li>Interstitial slides</li>
                    <li>Conclusion slides</li>
                    <li>Icon library</li>
                    <li>Shape library</li>
                    <li>Diagram library</li>
                  </ol>
                </div>
                <div className="start-list">
                  <h4>Tips</h4>
                  <ol className="list-unstyled">
                    <li>Keeping a Clean Look</li>
                    <li>Changing Colors</li>
                    <li>Changing Fonts</li>
                    <li>Finding Images</li>
                    <li>Making Graphics Using Icons</li>
                    <li>Making Graphics Using Shapes</li>
                    <li>Illustrating Abstract Concepts</li>
                    <li>Formatting Graphs</li>
                    <li>Formatting Charts</li>
                    <li>Formatting Tables</li>
                    <li>Adding Maps</li>
                  </ol>
                </div>
                <div
                  className="start-image ml-5 d-none d-md-block align-self-stretch" style={{
                    backgroundImage: 'url(/images/home/laptop3.png)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <Formats />
        <Quotes />
        <Templates />
      </div>
    </section>
  }
}
