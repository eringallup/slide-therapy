import React from 'react'
import { Link } from 'react-router-dom'
import skus from 'skus.json'

export default class Templates extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
  }
  // componentDidMount () {
  //   if (typeof global.document !== 'undefined') {
  //     if (location.pathname === '/start') {
  //       if (window.history.length <= 2) {
  //         scrollIt(document.getElementById('start'), 200, 'easeInCubic')
  //       }
  //     } else if (/templates|buy/i.test(location.pathname)) {
  //       if (window.pageYOffset < 10) {
  //         scrollIt(document.getElementById('templates'), 200, 'easeInCubic')
  //       }
  //     } else if (location.pathname === '/') {
  //       if (window.history.length > 1) {
  //         scrollIt(document.body, 100, 'easeInCubic')
  //       }
  //     }
  //   }
  // }
  scrollDown () {
    scrollIt(document.getElementById('start'), 200, 'easeInCubic')
  }
  showPreview (e, deck) {
    e.preventDefault()
    this.setState({
      preview: deck
    })
  }
  closePreview (e, deck) {
    e.preventDefault()
    this.setState({
      preview: undefined
    })
  }
  nextPreview () {
    // do something
  }
  prevPreview () {
    // do something
  }
  render () {
    const templates = [skus[1], skus[2], skus[3]].map(item => {
      let preview = []
      if (this.state.preview && this.state.preview.sku === item.sku) {
        preview.push(<div key={item.sku} className="preview p-3">
          <div className="preview-image"
            style={{
              backgroundImage: 'url(/images/previews/large-audiences/preview-1.png)'
            }}
          />
          <ol className="list-unstyled">
            <li
              onClick={this.nextPreview}
              className="clickable slide-nav slide-nav-prev">&lt;</li>
            <li
              onClick={this.prevPreview}
              className="clickable slide-nav slide-nav-next">&gt;</li>
          </ol>
          <span className="clickable closer" onClick={e => this.closePreview(e, item)}>x</span>
        </div>)
      }
      return <div
        key={item.sku}
        className="deck d-flex align-items-center"
        itemScope itemType="http://schema.org/Product"
      >
        <span className="order-0">{item.sku}</span>
        <div className="order-2">
          {preview}
          <span className="h3">for</span>
          <h4 itemProp="name">{item.title}</h4>
          <div
            itemProp="description"
            className=""
            dangerouslySetInnerHTML={{
              __html: item.description
            }}
          />
        </div>
        <div
          itemProp="image"
          className="order-1 col col-md-2 col-sm-3"
        ><img className="img-fluid" src={item.image} /></div>
        <div className="order-3 text-center">
          <span itemProp="offers" itemScope itemType="http://schema.org/Offer">
            <span itemProp="priceCurrency" content="USD">$</span>
            <span itemProp="price" content={item.displayPrice}>{item.displayPrice}</span>
          </span>
          <Link className="buy btn btn-lg btn-primary" to={`/buy/${item.slug}`}>Buy</Link>
          <div
            className="clickable st-uppercase mt-3"
            onClick={e => this.showPreview(e, item)}
          >Preview</div>
        </div>
      </div>
    })
    return <section id="view-templates">
      <div
        className="hero-layer d-flex align-items-center"
        style={{
          backgroundImage: 'url(/images/home/topimage1.jpg)'
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-sm-12 text-center">
              <h2>Up your presentation game.</h2>
              <Link
                onClick={this.scrollDown}
                to="/start"
                className="btn btn-primary text-uppercase"
              >Start now</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row p-5">
          <div className="col text-center">
            <h3>Expert-Designed PowerPoint Templates <em>with built-in mentoring</em></h3>
          </div>
        </div>
      </div>
      <div id="start" className="bg-light">
        <div className="container py-5">
          <div className="row">
            <div className="col text-center">
              <h3>Communicate Clearly. Work Faster.<span className="br" />Look Elegant.</h3>
              <p className="lead mt-3 text-left">Slide Therapy is a series of master PowerPoint files that include everything you need to make a stunning presentation:</p>
            </div>
          </div>
          <div className="row pt-3">
            <div className="col-md col-sm-6">
              <h4>Templates</h4>
              <ol className="list-unstyled">
                <li>5+ Cover slide designs</li>
                <li>5+ Overview slide designs</li>
                <li>10+ Content slide designs</li>
                <li>2+ Interstitial slide designs</li>
                <li>5+ Conclusion slide designs</li>
                <li>500+ icon library</li>
                <li>80+ shape library</li>
              </ol>
            </div>
            <div className="col-md col-sm-6">
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
            <div className="col-md-5 d-none d-md-flex align-items-center">
              <img className="img-fluid" src="/images/home/laptop.png" alt="" />
            </div>
          </div>
        </div>
        <div
          id="templates"
          itemScope itemType="http://schema.org/Product"
          className="d-flex flex-column flex-md-row w-100 justify-content-center align-items-center bg-dark text-light"
        >
          <h4 className="m-0" itemProp="name">Special</h4>
          <div
            itemProp="description"
            className="lead text-center text-md-left"
            dangerouslySetInnerHTML={{
              __html: skus[4].description
            }}
          />
          <div>
            <s className="full-price">$117</s>
            <span itemProp="offers" itemScope itemType="http://schema.org/Offer">
              <span itemProp="priceCurrency" content="USD">$</span>
              <span itemProp="price" content={skus[4].displayPrice}>{skus[4].displayPrice}</span>
            </span>
          </div>
          <div>
            <Link
              to="/buy/all-audiences"
              className="buy btn btn-lg btn-light"
            >Buy</Link>
          </div>
        </div>
        <div className="bg-light container pb-5">{templates}</div>
      </div>
    </section>
  }
}
