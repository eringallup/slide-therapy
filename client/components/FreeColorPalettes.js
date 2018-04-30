import React from 'react'
import Overview from 'components/Overview'
import Templates from 'components/Templates'

export default class FreeColorPalettes extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
  }
  componentWillMount () {
    setPageTitle(this.state)
  }
  componentDidMount () {
    stAnalytics.page('Free Color Palettes')
  }
  render () {
    return <section id="view-home">
      <div className="hero-layer d-flex align-items-center">
        <div
          className="hero-image position-absolute fill-parent ready"
          suppressHydrationWarning
          style={{
            backgroundImage: 'url(/images/home/topimage5.jpg)',
            backgroundPosition: 'center center'
          }}
        />
        <a target="_blank" rel="noopener noreferrer" href="https://unsplash.com/@davideragusa" suppressHydrationWarning className="image-credit">Image: Davide Ragusa/Unsplash</a>
        <div className="container">
          <div className="row">
            <div className="hero-content col-sm-12 text-center">
              <h2 suppressHydrationWarning>Download&nbsp;Your Free&nbsp;Color&nbsp;Palettes</h2>
              <a
                download
                href="https://d380dcsmppijhx.cloudfront.net/images/SlideTherapyLogo.png"
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
