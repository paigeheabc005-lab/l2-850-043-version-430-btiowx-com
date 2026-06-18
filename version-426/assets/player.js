(function () {
  window.initMoviePlayer = function (streamUrl) {
    var video = document.getElementById('movieVideo');
    var overlay = document.getElementById('playerOverlay');
    var button = document.getElementById('playButton');
    if (!video || !overlay || !button || !streamUrl) {
      return;
    }
    var loaded = false;
    var hlsInstance = null;

    function loadStream() {
      if (loaded) {
        return Promise.resolve();
      }
      loaded = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        return Promise.resolve();
      }
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        return new Promise(function (resolve) {
          hlsInstance.loadSource(streamUrl);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            resolve();
          });
        });
      }
      video.src = streamUrl;
      return Promise.resolve();
    }

    function startPlayback() {
      overlay.classList.add('is-hidden');
      video.setAttribute('controls', 'controls');
      loadStream().then(function () {
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {});
        }
      });
    }

    overlay.addEventListener('click', startPlayback);
    button.addEventListener('click', startPlayback);
    video.addEventListener('click', function () {
      if (!loaded) {
        startPlayback();
      }
    });
    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
