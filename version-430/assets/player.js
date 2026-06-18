(function () {
  var hlsInstance = null;

  function playVideo(video) {
    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  }

  window.initMoviePlayer = function (source) {
    var video = document.getElementById('moviePlayer');
    var mask = document.getElementById('playMask');
    var attached = false;
    var pending = false;

    if (!video || !source) {
      return;
    }

    function hideMask() {
      if (mask) {
        mask.classList.add('is-hidden');
      }
    }

    function attachSource() {
      if (attached) {
        return;
      }
      attached = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        if (pending) {
          playVideo(video);
        }
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          if (pending) {
            playVideo(video);
          }
        });
        return;
      }

      video.src = source;
      if (pending) {
        playVideo(video);
      }
    }

    function start() {
      pending = true;
      hideMask();
      attachSource();
      if (attached && (!hlsInstance || video.readyState > 0)) {
        playVideo(video);
      }
    }

    if (mask) {
      mask.addEventListener('click', start);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });

    video.addEventListener('play', hideMask);
  };
})();
