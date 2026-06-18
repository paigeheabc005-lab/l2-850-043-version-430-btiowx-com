(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    document.querySelectorAll("img").forEach(function (image) {
      image.addEventListener("error", function () {
        image.classList.add("image-missing");
      }, { once: true });
    });

    var navToggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-nav]");
    if (navToggle && nav) {
      navToggle.addEventListener("click", function () {
        nav.classList.toggle("is-open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var active = 0;
    var timer = null;

    function setSlide(index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, idx) {
        slide.classList.toggle("is-active", idx === active);
      });
      dots.forEach(function (dot, idx) {
        dot.classList.toggle("is-active", idx === active);
      });
    }

    function startHero() {
      if (timer || slides.length < 2) {
        return;
      }
      timer = window.setInterval(function () {
        setSlide(active + 1);
      }, 5200);
    }

    dots.forEach(function (dot, idx) {
      dot.addEventListener("click", function () {
        setSlide(idx);
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
        startHero();
      });
    });
    setSlide(0);
    startHero();

    var searchInput = document.querySelector("[data-search-input]");
    var searchCards = Array.prototype.slice.call(document.querySelectorAll("[data-search-grid] [data-movie-card]"));
    var clearSearch = document.querySelector("[data-search-clear]");

    function applySearch() {
      if (!searchInput || !searchCards.length) {
        return;
      }
      var query = searchInput.value.trim().toLowerCase();
      searchCards.forEach(function (card) {
        var text = (card.getAttribute("data-keywords") || card.textContent || "").toLowerCase();
        card.classList.toggle("is-hidden", query !== "" && text.indexOf(query) === -1);
      });
    }

    if (searchInput) {
      var params = new URLSearchParams(window.location.search);
      var initial = params.get("q");
      if (initial) {
        searchInput.value = initial;
      }
      searchInput.addEventListener("input", applySearch);
      applySearch();
    }

    if (clearSearch && searchInput) {
      clearSearch.addEventListener("click", function () {
        searchInput.value = "";
        applySearch();
        searchInput.focus();
      });
    }
  });
})();
