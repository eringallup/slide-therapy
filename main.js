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
  // setupSwiper('.quotes .swiper-container', 'quotes');
  // setupPreviews();
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

main();