const heroImages = [
  '/i/home/topimage1.jpg',
  '/i/home/topimage4.jpg',
  '/i/home/topimage5.jpg'
];

let videoPlayer;

function main() {
  setupYouTube();
  addScripts();
  attachEvents();
  pickHeroImage();
  setupCarousel();
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

// https://swiperjs.com/get-started
function setupCarousel() {
  if (!window.Swiper) {
    setTimeout(() => {
      setupCarousel();
    }, 100);
    return;
  }
  const swiper = new Swiper('.swiper-container', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  });  
}

main();