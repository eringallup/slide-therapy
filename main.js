const heroImages = [
  '/i/home/topimage1.jpg',
  '/i/home/topimage4.jpg',
  '/i/home/topimage5.jpg'
];

const lastSlide = {
  large: 31,
  small: 27,
  solitary: 28
};

const loaded = {
  large: 1,
  small: 1,
  solitary: 1
};

let videoPlayer;

function main() {
  setupYouTube();
  addScripts();
  attachEvents();
  pickHeroImage();
  setupSwiper('.quotes .swiper-container', 'quotes');
  setupPreviews();
}

function pickHeroImage() {
  const imgUrl = heroImages[Math.floor(Math.random() * heroImages.length)];
  const img = new Image();
  img.src = imgUrl;
  img.onload = function() {
    document.querySelector('#hero').style.backgroundImage='url('+img.src+')';
  };
}

function prepareVideo() {
  if (!videoPlayer) {
    videoPlayer = new YT.Player('video-player', {
      events: {
        onReady: e => {
          startVideo();
        },
        onStateChange: e => {
          if (e) {
            // console.log(e.data, YT.PlayerState.ENDED)
            if (e.data === YT.PlayerState.ENDED) {
              // console.log('Video Done')
              this.exitFullscreen().then(() => closeVideo());
            }
          }
        }
      }
    });
  } else {
    startVideo();
  }
}

function startVideo() {
  // console.info('startVideo')
  // https://developers.google.com/youtube/player_parameters#Parameters
  if (videoPlayer) {
    if (typeof videoPlayer.playVideo !== 'function') {
      // seems like sometimes we get into a state where videoPlayer
      // is defined but videoPlayer.playVideo isn't ready yet.
      // Fine. We'll just try again in a few moments.
      setTimeout(() => startVideo(), 100);
    } else {
      showVideoLayer();
      videoPlayer.playVideo();
    }
  } else {
    setTimeout(() => startVideo(), 500);
  }
}

function showVideoLayer() {
  document.querySelector('#video-player-layer').style.display = 'grid';
}
function hideVideoLayer() {
  document.querySelector('#video-player-layer').style.display = 'none';
}
function videoLayerOpen() {
  return document.querySelector('#video-player-layer').style.display !== 'none';
}

function attachEvents() {
  const videoPlayerButton = document.querySelector('#startIntroVideo');
  if (videoPlayerButton) {
    videoPlayerButton.addEventListener('click', function onVideoPlayerButtonClick(e) {
      prepareVideo();
    }, {
      passive: true
    });
  }

  const videoPlayerCloseButton = document.querySelector('#video-player-layer .close-video-player');
  if (videoPlayerCloseButton) {
    videoPlayerCloseButton.addEventListener('click', function onVideoPlayerCloseButtonClick(e) {
      closeVideo();
    }, {
      passive: true
    });
  }

  window.addEventListener('keydown', function onKeyDown(e) {
    if (e.keyCode === 27) {
      if (videoLayerOpen()) {
        closeVideo();
      }
    }
  }, {
    passive: true
  });
}

function addScripts() {
  setTimeout(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  });
}

// https://developers.google.com/youtube/iframe_api_reference
function setupYouTube() {
  window.onYouTubeIframeAPIReady = () => {
    document.querySelector('#startIntroVideo').style.visibility = 'visible';
  }
}

function closeVideo() {
  if (videoPlayer) {
    videoPlayer.stopVideo();
    hideVideoLayer();
  }
}

function onCloseClick(deck) {
  togglePreview(deck);
}

function onPreviewClick() {
  const deck = this.getAttribute('data-deck');
  const slides = this.querySelector('.swiper-wrapper');
  togglePreview(this);
  const closer = this.querySelector('.close-preview');
  const _swiper = this.querySelector('.swiper-container');
  lazyLoadSlides(deck, slides);
  if (!_swiper.swiper) {
    setupSwiper(_swiper, deck, () => lazyLoadSlides(deck, slides));
    closer.addEventListener('click', onCloseClick.bind(closer, this));
  }
}

function setupPreviews() {
  document.querySelectorAll('.preview-link').forEach(item => {
    item.addEventListener('click', onPreviewClick.bind(item.parentNode.parentNode));
  });
}

function lazyLoadSlides(deck, slides) {
  for (let i = 2; i <= lastSlide[deck]; i++) {
    const imgSrc = `/i/previews/${deck}/preview-${i}.png`;
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    const img = new Image();
    img.alt = '';
    img.setAttribute('data-src', imgSrc);
    img.classList.add('swiper-lazy');
    img.classList.add('img-fluid');
    // img.src = imgSrc;
    div.appendChild(img);
    slides.appendChild(div);
  }
}

function togglePreview(deck) {
  if (deck.classList.contains('previewing')) {
    deck.classList.remove('previewing');
  } else {
    deck.classList.add('previewing');
  }
}

// https://swiperjs.com/get-started
function setupSwiper(selector, id, onSlideChange) {
  if (!window.Swiper) {
    setTimeout(() => setupSwiper(selector, id, onSlideChange), 100);
    return;
  }
  // console.log('setupSwiper', selector);
  document.body.classList.add('has-swiper');
  let swiper = new Swiper(selector, {
    direction: 'horizontal',
    loop: true,
    pagination: {
      el: `.${id}-swiper-pagination`,
    },
    navigation: {
      nextEl: `.${id}-swiper-button-next`,
      prevEl: `.${id}-swiper-button-prev`,
    },
    scrollbar: {
      el: `.${id}-swiper-scrollbar`,
    },
    preloadImages: false,
    lazy: true,
    lazy: {
      loadPrevNext: true,
    },  
  });
  swiper.on('slideChange', onSlideChange);
}

main();