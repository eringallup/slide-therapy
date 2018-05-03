import React from 'react'
import Buy from 'components/Buy'
import { Link } from 'react-router-dom'
import skus from 'skus.json'
import dataStore from 'store'

export default class Templates extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
    this.detach = []
    if (typeof document !== 'undefined') {
      this.setupCarousels()
    }
  }
  componentWillMount () {
    this.unsubscribe = dataStore.subscribe(() => this.setStates())
  }
  componentDidMount () {
    this.setStates()
  }
  componentWillUnmount () {
    this.unsubscribe()
  }
  setStates () {
    let currentState = dataStore.getState()
    if (!this.state.stripeCheckout && currentState.stripeCheckout) {
      this.setState({
        stripeCheckout: currentState.stripeCheckout
      })
    }
  }
  showPreview (e, deck) {
    e.preventDefault()
    if (this.state.preview && this.state.preview.slug === deck.slug) {
      return this.closePreview(e, deck)
    }
    this.setState({
      preview: deck
    })
    stAnalytics.track('Show Preview', {
      deck: deck.title
    })
  }
  onSlide (e) {
    // console.log('onSlide')
    if (e.relatedTarget) {
      this.loadLazyImage(e.relatedTarget)
      const dir = e.direction === 'left' ? 'next' : 'prev'
      const $nextSlide = $(e.relatedTarget)[dir]()
      // console.log(dir, $nextSlide)
      if ($nextSlide) {
        this.loadLazyImage($nextSlide)
      }
    }
  }
  loadLazyImage ($slide) {
    const $img = $($slide).find('img')
    if ($img) {
      const dataSrc = $img.attr('data-src')
      // console.log($img, dataSrc)
      if (dataSrc) {
        $img.attr('src', dataSrc).removeAttr('data-src')
      }
    }
  }
  closePreview (e, deck) {
    e.preventDefault()
    this.setState({
      preview: undefined
    })
    stAnalytics.track('Close Preview', {
      deck: deck.title
    })
  }
  setupCarousels () {
    this._onSlide = this.onSlide.bind(this)
    $(document).on('slide.bs.carousel', '#slide-preview', this._onSlide)
    this.detach.push(() => {
      $(document).off('slide.bs.carousel', '#slide-preview', this._onSlide)
    })
  }
  nextSlide (e, deck) {
    e.preventDefault()
    $('#slide-preview').carousel('next')
    stAnalytics.track('Next Slide', {
      deck: deck.title,
      slide: $('#slide-preview .carousel-item-next').index('#slide-preview .carousel-item')
    })
  }
  prevSlide (e, deck) {
    e.preventDefault()
    $('#slide-preview').carousel('prev')
    stAnalytics.track('Previous Slide', {
      deck: deck.title,
      slide: $('#slide-preview .carousel-item-prev').index('#slide-preview .carousel-item')
    })
  }
  openCheckout (e, deck) {
    e.preventDefault()
    dataStore.dispatch({
      type: 'startCheckout',
      startCheckout: deck
    })
  }
  render () {
    // console.info('render', this.state.stripeCheckout)
    const templates = [skus[1], skus[2], skus[3]].map(item => {
      let preview = []
      if (this.state.preview && this.state.preview.sku === item.sku) {
        let slides = []
        for (let i = 1; i <= item.previewSlideCount; i++) {
          slides.push(<div
            key={`slide-${i}`}
            className={'carousel-item aspect-16x9 w-100' + (i === 1 ? ' active' : '')}
          >
            <img
              className="d-block position-absolute w-100 fill-parent"
              data-src={i > 3 ? `/images/previews/${item.slug}/Preview-${i}.png` : ''}
              src={i < 4 ? `/images/previews/${item.slug}/Preview-${i}.png` : ''}
              alt=""
            />
          </div>)
        }
        preview.push(<div key={item.sku} className="preview py-3 px-4 py-md-5 px-md-5">
          <div id="slide-preview" className="carousel slide position-static">
            <div className="carousel-inner m-auto">{slides}</div>
            <a
              className="carousel-control-prev"
              href="#"
              onClick={e => this.prevSlide(e, item)}
              role="button"
              data-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="sr-only">Previous</span>
            </a>
            <a
              className="carousel-control-next"
              href="#"
              onClick={e => this.nextSlide(e, item)}
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
        <div className="order-2 w-100">
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
          <Link
            className={'buy btn btn-lg btn-wide btn-primary' + (this.state.stripeCheckout ? '' : ' btn-disabled')}
            onClick={e => this.openCheckout(e, item.slug)}
            to={`/buy/${item.slug}`}
          >Buy</Link>
          <div
            className="clickable st-uppercase mt-3"
            onClick={e => this.showPreview(e, item)}
          >Preview</div>
        </div>
      </div>
    })
    return <React.Fragment>
      <div className="bg-light container">{templates}</div>
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
            onClick={e => this.openCheckout(e, 'all-audiences')}
            className={'buy btn btn-lg btn-wide btn-light' + (this.state.stripeCheckout ? '' : ' btn-disabled')}
          >Buy</Link>
        </div>
      </div>
      <div id="enterprise" className="text-center p-4">
        <h3>Multi-User Licenses</h3>
        please email us at <a href="mailto:hello@slidetherapy.com">hello@slidetherapy.com</a>
      </div>
      <Buy />
    </React.Fragment>
  }
}
