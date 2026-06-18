(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    document.querySelectorAll('.movie-player').forEach(function (player) {
      var video = player.querySelector('video');
      var cover = player.querySelector('.player-cover');
      var streamUrl = player.getAttribute('data-stream');
      var hlsInstance = null;
      var loaded = false;

      if (!video || !streamUrl) {
        return;
      }

      var attachStream = function () {
        if (loaded) {
          return;
        }

        loaded = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true });
          hlsInstance.loadSource(streamUrl);
          hlsInstance.attachMedia(video);
        } else {
          video.src = streamUrl;
        }
      };

      var begin = function () {
        attachStream();

        if (cover) {
          cover.classList.add('is-hidden');
        }

        video.controls = true;
        var playRequest = video.play();

        if (playRequest && typeof playRequest.catch === 'function') {
          playRequest.catch(function () {});
        }
      };

      if (cover) {
        cover.addEventListener('click', begin);
      }

      video.addEventListener('click', function () {
        if (video.paused) {
          begin();
        }
      });

      window.addEventListener('pagehide', function () {
        if (hlsInstance) {
          hlsInstance.destroy();
          hlsInstance = null;
        }
      });
    });
  });
})();
