/* eslint-disable react/jsx-closing-tag-location */
import React from 'react'
import Templates from 'components/Templates'
import Formats from 'components/Formats'

export default class FreeColorPalettes extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount () {
    setPageTitle(this.state)
  }

  componentDidMount () {
    stAnalytics.page('Free Color Palettes')
  }

  trackDownload (e, type) {
    stAnalytics.track('Free Download', {
      type: type
    })
  }

  render () {
    return <section id="view-free-color-palettes">
      <div className="hero-layer d-flex align-items-center">
        <div
          className="hero-image position-absolute fill-parent ready"
          style={{
            backgroundImage: 'url(/images/free/freecolorpalette2.jpg)'
          }}
        />
        <a target="_blank" rel="noopener noreferrer" href="https://unsplash.com/@seemoris" suppressHydrationWarning className="image-credit">Image: Caleb George/Unsplash</a>
        <div className="container">
          <div className="row">
            <div className="hero-content col-sm-12 text-center">
              <div className="color-swatch mb-3 mb-md-4">
                <img src="/images/free/swatch2.jpg" alt="" width="200" />
              </div>
              <h2>Free&nbsp;custom color&nbsp;palettes</h2>
              <a
                download
                href="https://d380dcsmppijhx.cloudfront.net/free/SlideTherapyColorPalettes.pptx"
                onClick={e => this.trackDownload(e, 'Color Palettes')}
                className="btn btn-primary"
              >Download Now</a>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row py-5">
          <div className="col text-center">
            <h3>Add Polish to your Presentation&apos;s <em>titles, charts and graphics</em></h3>
          </div>
        </div>
      </div>
      <div id="start" className="bg-light">
        <div className="container pt-5">
          <div className="row">
            <div className="col text-center">
              <h3>Want more help?</h3>
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
        <Templates />
      </div>
    </section>
  }
}
