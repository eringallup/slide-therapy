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
  setupSwiper('.quotes .swiper-container');
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

  document.addEventListener('keydown', function onKeyDown(e) {
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

function onCloseClick(description, preview, swiper) {
  hidePreview(description, preview);
  // this.removeEventListener('click');
}

function onPreviewClick() {
  const deck = this.getAttribute('data-deck');
  const preview = this.querySelector('.preview');
  const description = this.querySelector('.description');
  const slides = this.querySelector('.swiper-wrapper');
  togglePreview(description, preview);
  const closer = this.querySelector('.close-preview');
  const _swiper = this.querySelector('.swiper-container');
  if (!_swiper.swiper) {
    lazyLoadSlides(deck, slides);
    setupSwiper(_swiper, () => lazyLoadSlides(deck, slides));
    closer.addEventListener('click', onCloseClick.bind(closer, description, preview));
  }
}

function setupPreviews() {
  document.querySelectorAll('.preview-link').forEach(item => {
    item.addEventListener('click', onPreviewClick.bind(item.parentNode.parentNode));
  });
}

function lazyLoadSlides(deck, slides) {
  if (loaded[deck] >= lastSlide[deck]) {
    return;
  }
  const from = loaded[deck] + 1;
  console.log('lazyLoadSlides', loaded[deck], lastSlide[deck], from);
  const to = from + 1;
  if (to > lastSlide[deck]) {
    to = lastSlide[deck];
  }
  loaded[deck] = to;
  for (let i = from; i <= to; i++) {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    const img = new Image();
    img.src=`/i/previews/${deck}/preview-${i}.png`;
    img.classList.add('img-fluid');
    img.alt='';
    img.onload = () => {
      div.appendChild(img);
      slides.appendChild(div);
    }
  }
}

function togglePreview(desc, prev) {
  if (prev.style.display !== 'block') {
    showPreview(desc, prev);
  } else {
    hidePreview(desc, prev);
  }
}

function showPreview(desc, prev) {
  desc.style.display = 'none';
  prev.style.display = 'block';
}

function hidePreview(desc, prev) {
  desc.style.display = 'block';
  prev.style.display = 'none';
}

// https://swiperjs.com/get-started
function setupSwiper(selector, onSlideChange) {
  if (!window.Swiper) {
    setTimeout(() => setupSwiper(selector), 100);
    return;
  }
  let swiper = new Swiper(selector, {
    direction: 'horizontal',
    loop: true,
    pagination: {
      el: '.swiper-pagination',
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    scrollbar: {
      el: '.swiper-scrollbar',
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