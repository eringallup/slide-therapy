import React from 'react'
import { Link } from 'react-router-dom'
import skus from 'skus.json'
import dataStore from 'store'

export default class Templates extends React.Component {
  constructor (props) {
    super(props)
    this.state = Object.assign({}, props, {
      backgroundImages: [{
        url: '/images/home/topimage1.jpg',
        position: 'top center',
        credit: 'Image: Rawpixel/Unsplash'
      }, {
        url: '/images/home/topimage2.jpg',
        position: 'center center',
        credit: 'Image: GaudiLab/Shutterstock'
      }, {
        url: '/images/home/topimage3d.jpg',
        position: 'bottom center',
        credit: 'Image: Edwin Andrade/Unsplash'
      }],
      heroReady: ''
    })
  }
  componentWillMount () {
    this.unsubscribe = dataStore.subscribe(() => this.setStates())
    setPageTitle(this.state)
  }
  componentDidMount () {
    this.setStates()
    this.getImage()
    setTimeout(() => {
      analytics.page('Home', {
        hero_image: this.state.backgroundImage.url
      })
    })
    this._onSlide = this.onSlide.bind(this)
    $(document).on('slide.bs.carousel', '#slide-preview', this._onSlide)
    // this.scrollToSection()
  }
  componentWillUnmount () {
    if (this._onSlide) {
      $(document).off('slide.bs.carousel', '#slide-preview', this._onSlide)
    }
    this.unsubscribe()
  }
  scrollToSection () {
    // if (typeof document !== 'undefined') {
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
  setStates () {
    let currentState = dataStore.getState()
    let newState = {
      backgroundImage: currentState.backgroundImage
    }
    if (!this.state.stripeCheckout && currentState.stripeCheckout) {
      newState.stripeCheckout = currentState.stripeCheckout
    }
    this.setState(newState)
    if (window && newState.backgroundImage) {
      setTimeout(() => this.setBackgroundImage())
    }
  }
  setBackgroundImage () {
    // console.log('setBackgroundImage', this.state.backgroundImage)
    if (this.state.backgroundImage) {
      this.bgImagePreload = new Image()
      this.bgImagePreload.addEventListener('load', this.onBackgroundImageReady.bind(this))
      this.bgImagePreload.src = this.state.backgroundImage.url
    }
  }
  onBackgroundImageReady () {
    // console.log('onBackgroundImageReady', this.bgImagePreload)
    if (this.bgImagePreload) {
      this.setState({
        heroReady: 'ready'
      })
      this.bgImagePreload.removeEventListener('load', this.onBackgroundImageReady)
    }
  }
  scrollDown (e, elementId) {
    e.preventDefault()
    scrollIt(document.getElementById(elementId), 200, 'easeInCubic')
    analytics.track('Start Now')
  }
  showPreview (e, deck) {
    e.preventDefault()
    if (this.state.preview && this.state.preview.slug === deck.slug) {
      return this.closePreview(e, deck)
    }
    this.setState({
      preview: deck
    })
    analytics.track('Show Preview', {
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
    analytics.track('Close Preview', {
      deck: deck.title
    })
  }
  nextSlide (e, deck) {
    e.preventDefault()
    $('#slide-preview').carousel('next')
    analytics.track('Next Slide', {
      deck: deck.title
    })
  }
  prevSlide (e, deck) {
    e.preventDefault()
    $('#slide-preview').carousel('prev')
    analytics.track('Previous Preview', {
      deck: deck.title
    })
  }
  getImage () {
    let currentState = dataStore.getState()
    if (!this.state.backgroundImage && !currentState.backgroundImage) {
      const rnd = Math.floor(Math.random() * this.state.backgroundImages.length)
      const backgroundImage = this.state.backgroundImages[rnd]
      if (typeof window !== 'undefined') {
        dataStore.dispatch({
          type: 'update',
          backgroundImage: backgroundImage
        })
      }
    }
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
            to={`/buy/${item.slug}`}
          >Buy</Link>
          <div
            className="clickable st-uppercase mt-3"
            onClick={e => this.showPreview(e, item)}
          >Preview</div>
        </div>
      </div>
    })
    let heroImage = {}
    let imageCredit = ''
    if (this.state.backgroundImage) {
      heroImage = {
        backgroundImage: `url(${this.state.backgroundImage.url})`,
        backgroundPosition: this.state.backgroundImage.position
      }
      imageCredit = this.state.backgroundImage.credit
    }
    return <section id="view-templates">
      <div className="hero-layer d-flex align-items-center">
        <div
          className={`hero-image position-absolute fill-parent ${this.state.heroReady}`}
          suppressHydrationWarning
          style={heroImage}
        />
        <span suppressHydrationWarning className="image-credit">{imageCredit}</span>
        <div className="container">
          <div className="row">
            <div className="hero-content col-sm-12 text-center">
              <h2>Up&nbsp;your presentation&nbsp;game.</h2>
              <Link
                onClick={e => this.scrollDown(e, 'start')}
                to="/start"
                className="btn btn-primary"
              >Start now</Link>
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
        <div className="container pt-5">
          <div className="row">
            <div className="col text-center">
              <h3>Communicate&nbsp;Clearly. Work&nbsp;Faster. <span className="d-none d-md-block" />Look&nbsp;Refined.</h3>
              <p className="lead mt-3 text-left text-lg-center">Slide Therapy is a series of master PowerPoint files for Mac and PC that include everything you need to make a stunning presentation:</p>
            </div>
          </div>
          <div className="row pt-3 px-5">
            <div className="col">
              <div className="mx-auto mx-md-0 d-flex flex-column flex-sm-row justify-content-center align-items-center align-items-sm-start">
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
                <div className="pl-5 d-none d-md-block align-items-start align-items-lg-center">
                  <img style={{
                    maxWidth: '30vw'
                  }} className="img-fluid" src="/images/home/laptop.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
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
              className={'buy btn btn-lg btn-wide btn-light' + (this.state.stripeCheckout ? '' : ' btn-disabled')}
            >Buy</Link>
          </div>
        </div>
      </div>
    </section>
  }
}
