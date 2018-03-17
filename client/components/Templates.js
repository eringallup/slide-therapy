import React from 'react'
import { Link } from 'react-router-dom'
import skus from 'skus.json'
import $ from 'jquery'
import dataStore from 'store'

export default class Templates extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
  }
  componentDidMount () {
    dataStore.dispatch({
      type: 'update',
      hasToken: false,
      token: undefined
    })
    // if (typeof global.document !== 'undefined') {
    //   if (location.pathname === '/start') {
    //     if (window.history.length <= 2) {
    //       scrollIt(document.getElementById('start'), 200, 'easeInCubic')
    //     }
    //   } else if (/templates|buy/i.test(location.pathname)) {
    //     if (window.pageYOffset < 10) {
    //       scrollIt(document.getElementById('templates'), 200, 'easeInCubic')
    //     }
    //   } else if (location.pathname === '/') {
    //     if (window.history.length > 1) {
    //       scrollIt(document.body, 100, 'easeInCubic')
    //     }
    //   }
    // }
  }
  scrollDown () {
    scrollIt(document.getElementById('start'), 200, 'easeInCubic')
  }
  showPreview (e, deck) {
    e.preventDefault()
    if (this.state.preview && this.state.preview.slug === deck.slug) {
      return this.closePreview(e, deck)
    }
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
  nextSlide (e) {
    e.preventDefault()
    $('#slide-preview').carousel('next')
  }
  prevSlide (e) {
    e.preventDefault()
    $('#slide-preview').carousel('prev')
  }
  render () {
    const templates = [skus[1], skus[2], skus[3]].map(item => {
      let preview = []
      if (this.state.preview && this.state.preview.sku === item.sku) {
        let slides = []
        for (let i = 1; i <= 50; i++) {
          slides.push(<div
            key={`slide-${i}`}
            className={'carousel-item' + (i === 1 ? ' active' : '')}
          >
            <img
              className="d-block w-100" src={`/images/previews/${item.slug}/preview-${i}.png`} alt=""
            />
          </div>)
        }
        preview.push(<div key={item.sku} className="preview py-3 px-4 py-md-5 px-md-5">
          <div id="slide-preview" className="carousel slide position-static">
            <div className="carousel-inner">{slides}</div>
            <a
              className="carousel-control-prev"
              href="#"
              onClick={e => this.prevSlide(e)}
              role="button"
              data-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="sr-only">Previous</span>
            </a>
            <a
              className="carousel-control-next"
              href="#"
              onClick={e => this.nextSlide(e)}
              role="button"
              data-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="sr-only">Next</span>
            </a>
          </div>
          <div className="close-icon clickable" onClick={e => this.closePreview(e, item)}>
            <span aria-hidden="true">&times;</span>
          </div>
        </div>)
      }
      return <div
        key={item.sku}
        className="deck d-flex align-items-center flex-column flex-md-row"
        itemScope itemType="http://schema.org/Product"
      >
        <span className="order-0 d-none d-lg-block">{item.sku}</span>
        <div className="order-2">
          <div className="aspect-md-16x9 position-relative">
            {preview}
            <div className="description">
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
          </div>
        </div>
        <div
          itemProp="image"
          className="order-1 d-none d-lg-block col-lg-2"
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
