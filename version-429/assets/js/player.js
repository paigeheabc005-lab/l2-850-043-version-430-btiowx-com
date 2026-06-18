(function () {
  function getHls() {
    return window.Hls || null;
  }

  function attach(player) {
    var video = player.querySelector("video");
    var button = player.querySelector("[data-play-button]");
    var source = player.getAttribute("data-play");
    var engine = null;

    function begin() {
      if (!video || !source) {
        return;
      }

      if (button) {
        button.classList.add("is-hidden");
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        if (video.src !== source) {
          video.src = source;
        }
        video.play().catch(function () {});
        return;
      }

      var Hls = getHls();
      if (Hls && Hls.isSupported()) {
        if (!engine) {
          engine = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 60
          });
          engine.loadSource(source);
          engine.attachMedia(video);
        }
        video.play().catch(function () {});
        return;
      }

      if (video.src !== source) {
        video.src = source;
      }
      video.play().catch(function () {});
    }

    if (button) {
      button.addEventListener("click", begin);
    }

    player.addEventListener("click", function (event) {
      if (event.target === video) {
        return;
      }
      if (event.target.closest("button")) {
        return;
      }
      begin();
    });
  }

  document.querySelectorAll("[data-player]").forEach(attach);
})();
