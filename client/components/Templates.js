import React from 'react'
import { Link } from 'react-router-dom'
import qs from 'qs'
import skus from 'skus.json'
import dataStore from 'store'

// <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/3lMnxrDWejw" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen />

export default class Templates extends React.Component {
  constructor (props) {
    super(props)
    this.state = Object.assign({}, props, {
      backgroundImages: [{
        url: '/images/home/topimage1.jpg',
        position: 'top center',
        credit: 'Image: Rawpixel/Unsplash',
        link: 'https://unsplash.com/@rawpixel'
      }, {
        url: '/images/home/topimage4.jpg',
        position: 'center center',
        credit: 'Image: Olu Eletu/Unsplash',
        link: 'https://unsplash.com/@flenjoore'
      }, {
        url: '/images/home/topimage5.jpg',
        position: 'center center',
        credit: 'Image: Davide Ragusa/Unsplash',
        link: 'https://unsplash.com/@davideragusa'
      }],
      heroReady: ''
    })
    this.detach = []
  }
  componentWillMount () {
    this.unsubscribe = dataStore.subscribe(() => this.setStates())
    if (typeof window !== 'undefined') {
      let _onKeydown = this.onKeydown.bind(this)
      window.addEventListener('keydown', _onKeydown)
      this.detach.push(() => {
        window.removeEventListener('keydown', _onKeydown)
      })
    }
    setPageTitle(this.state)
  }
  componentDidMount () {
    this.setStates()
    this.getImage()
    this.setupCarousels()
  }
  componentWillUnmount () {
    if (this._onSlide) {
      this.detach.forEach(fn => fn())
    }
    this.unsubscribe()
  }
  setStates () {
    let currentState = dataStore.getState()
    let newState = {
      backgroundImage: currentState.backgroundImage
    }
    if (!this.state.stripeCheckout && currentState.stripeCheckout) {
      newState.stripeCheckout = currentState.stripeCheckout
    }
    if (!this.state.youTubeReady && currentState.youTubeReady) {
      this.loadVideo()
    }
    if (!this.state.backgroundImage && newState.backgroundImage) {
      this.setBackgroundImage(newState)
    }
    this.setState(newState)
  }
  setBackgroundImage (state) {
    // console.log('setBackgroundImage', state.backgroundImage)
    if (typeof window !== 'undefined' && state && state.backgroundImage) {
      this.bgImagePreload = new Image()
      this.bgImagePreload.addEventListener('load', this.onBackgroundImageReady.bind(this))
      this.bgImagePreload.src = state.backgroundImage.url
      stAnalytics.page('Home', {
        hero_image: state.backgroundImage.url
      })
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
    stAnalytics.track('Start Now')
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
  getImage () {
    let currentState = dataStore.getState()
    if (!this.state.backgroundImage && !currentState.backgroundImage) {
      const rnd = Math.floor(Math.random() * this.state.backgroundImages.length)
      let backgroundImage = this.state.backgroundImages[rnd]
      if (location && location.search) {
        const queryParams = qs.parse(location.search.substring(1))
        if (!isNaN(queryParams.bgImageIndex)) {
          const bgImage = this.state.backgroundImages[queryParams.bgImageIndex]
          if (bgImage) {
            backgroundImage = bgImage
          }
        }
      }
      if (typeof window !== 'undefined') {
        dataStore.dispatch({
          type: 'update',
          backgroundImage: backgroundImage
        })
      }
    }
  }
  fullscreenConfig () {
    let element = document.body
    if (element.requestFullScreen) {
      return {
        request: element.requestFullScreen,
        change: 'fullscreenchange',
        element: 'fullscreenElement',
        exit: document.exitFullscreen
      }
    }
    if (element.webkitRequestFullScreen) {
      return {
        request: element.webkitRequestFullScreen,
        change: 'webkitfullscreenchange',
        element: 'webkitIsFullScreen',
        exit: document.webkitExitFullscreen
      }
    }
    if (element.mozRequestFullScreen) {
      return {
        request: element.mozRequestFullScreen,
        change: 'mozfullscreenchange',
        element: 'mozFullScreen',
        exit: document.mozCancelFullScreen
      }
    }
    if (element.msRequestFullScreen) {
      return {
        request: element.msRequestFullScreen,
        change: 'msfullscreenchange',
        element: 'msFullscreenElement',
        exit: document.msExitFullscreen
      }
    }
  }
  exitFullscreen () {
    if (typeof document === 'undefined') {
      return
    }
    return new Promise((resolve, reject) => {
      const config = this.fullscreenConfig()
      // console.log(config.element, document[config.element])
      if (!document[config.element]) {
        return resolve()
      }
      try {
        config.exit()
        return resolve()
      } catch (e) {
        console.warn(e)
        return e
      }
    })
  }
  loadVideo () {
    if (this.player || typeof document === 'undefined') {
      return
    }

    this.videoPlayerCx = document.getElementById('video-player-layer')

    if (!this.videoPlayerCx) {
      setTimeout(() => this.loadVideo(), 500)
      return
    }

    // https://developers.google.com/youtube/iframe_api_reference
    this.player = new YT.Player('video-player', {
      width: '100%',
      videoId: 'elNu8aNyQRQ',
      playerVars: {
        enablejsapi: 1,
        modestbranding: 1,
        autoplay: 0,
        controls: 1,
        fs: 1
      },
      events: {
        onReady: e => {
          stAnalytics.track('Video Ready')
          this.setState({
            videoReady: true
          })
          if (this.state.startVideoWhenReady) {
            this.startVideo()
          }
        },
        onStateChange: e => {
          if (e) {
            if (this.trackTimer) {
              clearTimeout(this.trackTimer)
            }
            // console.log(e.data, YT.PlayerState.ENDED)
            if (e.data === YT.PlayerState.ENDED) {
              // console.log('Video Done')
              stAnalytics.track('Video Done', this.getVideoStats())
              this.exitFullscreen().then(() => {
                this.setState({
                  showVideo: false
                })
              })
            } else {
              this.trackTimer = setTimeout(() => this.trackScrub(e), 500)
            }
          }
        }
      }
    })
  }
  trackScrub (e) {
    // console.log(e.data, YT.PlayerState)
    switch (e.data) {
    case YT.PlayerState.PLAYING:
      if (this.player.getCurrentTime() >= 1) {
        if (this.previousVideoState === 'paused') {
          // console.log('Video Resume')
          stAnalytics.track('Video Resume', this.getVideoStats())
        } else {
          // console.log('Video Seek')
          stAnalytics.track('Video Seek', this.getVideoStats())
        }
      }
      this.previousVideoState = 'playing'
      break
    case YT.PlayerState.PAUSED:
      // console.log('Video Paused')
      stAnalytics.track('Video Paused', this.getVideoStats())
      this.previousVideoState = 'paused'
      break
    }
  }
  getVideoStats () {
    this.currentVideoTime = this.player.getCurrentTime().toFixed(0)
    this.percentageWatched = ((this.currentVideoTime / this.player.getDuration()) * 100).toFixed(0)
    if (this.percentageWatched === null) {
      return
    }
    return {
      'Seconds Played': this.currentVideoTime * 1,
      'Percentage Watched': this.percentageWatched * 1
    }
  }
  onKeydown (e) {
    if (e && e.keyCode === 27) { // escape key
      this.closeVideo()
    }
  }
  startVideo () {
    // console.info('startVideo')
    // https://developers.google.com/youtube/player_parameters#Parameters
    if (this.player) {
      if (typeof this.player.playVideo !== 'function') {
        // seems like sometimes we get into a state where this.player
        // is defined but this.player.playVideo isn't ready yet.
        // Fine. We'll just try again in a few moments.
        setTimeout(() => this.startVideo(), 100)
      } else if (!this.state.showVideo) {
        this.setState({
          showVideo: true,
          startVideoWhenReady: false
        })
        this.player.playVideo()
        stAnalytics.track('Start Video', this.getVideoStats())
      }
    } else {
      this.setState({
        startVideoWhenReady: true
      })
    }
  }
  closeVideo () {
    if (this.player && this.state.showVideo) {
      this.player.stopVideo()
      this.setState({
        showVideo: false
      })
      stAnalytics.track('Close Video', this.getVideoStats())
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
    let imageLink = ''
    if (this.state.backgroundImage) {
      heroImage = {
        backgroundImage: `url(${this.state.backgroundImage.url})`,
        backgroundPosition: this.state.backgroundImage.position
      }
      imageCredit = this.state.backgroundImage.credit
      imageLink = this.state.backgroundImage.link
    }
    return <section id="view-templates">
      <div className="hero-layer d-flex align-items-center">
        <div
          className={`hero-image position-absolute fill-parent ${this.state.heroReady}`}
          suppressHydrationWarning
          style={heroImage}
        />
        <a target="_blank" href={imageLink} suppressHydrationWarning className="image-credit">{imageCredit}</a>
        <div className="container">
          <div className="row">
            <div className="hero-content col-sm-12 text-center">
              <h2>Up&nbsp;your presentation&nbsp;game.</h2>
              <Link
                onClick={e => this.scrollDown(e, 'start')}
                to="/start"
                className="btn btn-primary"
                hidden
              >Start now</Link>
              <div
                className="btn-start-video btn btn-primary"
                onClick={e => this.startVideo()}
              ><svg width="12" height="12" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg" fill="white"><path d="M1576 927l-1328 738q-23 13-39.5 3t-16.5-36v-1472q0-26 16.5-36t39.5 3l1328 738q23 13 23 31t-23 31z" /></svg> See How</div>
            </div>
          </div>
          <div id="video-player-layer" className="position-absolute fill-parent justify-content-center align-items-center d-flex" hidden={!this.state.showVideo}>
            <span className="close-video-player clickable" onClick={e => this.closeVideo()}>&times;</span>
            <div id="video-player-cx" className="position-relative">
              <svg xmlns="http://www.w3.org/2000/svg"
                width="1600"
                height="900"
                style={{
                  width: 'auto',
                  height: 'auto',
                  maxWidth: '100%',
                  background: '#dedede'
                }}
              ><rect width="1600" height="900" style={{
                  width: 'auto',
                  height: 'auto',
                  maxWidth: '100%',
                  fill: '#DEDEDE'
                }} /></svg>
              <div id="video-player" />
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
                <div className="start-image ml-5 d-none d-md-block align-self-stretch" style={{
                  backgroundImage: 'url(/images/home/laptop3.png)'
                }} />
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
        <div id="enterprise" className="text-center p-4">
          <h3>Multi-User Licenses</h3>
          please email us at <a href="mailto:hello@slidetherapy.com">hello@slidetherapy.com</a>
        </div>
      </div>
    </section>
  }
}
