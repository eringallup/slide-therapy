import React from 'react'
import qs from 'qs'
import dataStore from 'store'

// <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/3lMnxrDWejw" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen />

export default class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
    this.detach = []
  }

  componentWillMount () {
    this.unsubscribe = dataStore.subscribe(() => this.setStates())
    if (typeof window !== 'undefined') {
      let _onKeydown = this.onKeydown.bind(this)
      if (window.addEventListener) {
        window.addEventListener('keydown', _onKeydown)
        this.detach.push(() => {
          window.removeEventListener('keydown', _onKeydown)
        })
      }
    }
  }

  componentDidMount () {
    this.setStates()
    this.getImage()
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

  getImage () {
    let currentState = dataStore.getState()
    if (!this.state.backgroundImage && !currentState.backgroundImage) {
      const backgroundImages = [{
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
      }]
      const rnd = Math.floor(Math.random() * backgroundImages.length)
      let backgroundImage = backgroundImages[rnd]
      if (location && location.search) {
        const queryParams = qs.parse(location.search.substring(1))
        if (!isNaN(queryParams.bgImageIndex)) {
          const bgImage = backgroundImages[queryParams.bgImageIndex]
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

  homepageHero () {
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
    return <div className="hero-layer d-flex align-items-center">
      <div
        className={`hero-image position-absolute fill-parent ${this.state.heroReady}`}
        suppressHydrationWarning
        style={heroImage}
      />
      <a target="_blank" rel="noopener noreferrer" href={imageLink} suppressHydrationWarning className="image-credit">{imageCredit}</a>
      <div className="container">
        <div className="row">
          <div className="hero-content col-sm-12 text-center">
            <h2>Up&nbsp;your presentation&nbsp;game.</h2>
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
            <iframe id="video-player"
              width="640"
              height="360"
              src="https://www.youtube-nocookie.com/embed/elNu8aNyQRQ?showinfo=0&enablejsapi=1&modestbranding=0&autoplay=0&controls=1&rel=0&fs=1"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  }

  render () {
    return this.homepageHero()
  }
}
