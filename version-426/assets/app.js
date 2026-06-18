(function () {
  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function one(selector, root) {
    return (root || document).querySelector(selector);
  }

  function setupMenu() {
    var button = one('.menu-toggle');
    var nav = one('[data-mobile-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function movieMatches(movie, keyword) {
    var haystack = [movie.title, movie.genre, movie.region, movie.year, movie.type, movie.category].join(' ').toLowerCase();
    return haystack.indexOf(keyword) !== -1;
  }

  function renderSearch(keyword) {
    var panel = one('[data-search-panel]');
    var results = one('[data-search-results]');
    if (!panel || !results) {
      return;
    }
    if (!keyword) {
      panel.classList.remove('is-open');
      results.innerHTML = '';
      return;
    }
    var movies = window.SITE_MOVIES || [];
    var matched = movies.filter(function (movie) {
      return movieMatches(movie, keyword);
    }).slice(0, 18);
    panel.classList.add('is-open');
    if (!matched.length) {
      results.innerHTML = '<p class="empty-search">没有找到相关影片</p>';
      return;
    }
    results.innerHTML = matched.map(function (movie) {
      return '<a class="search-result" href="' + movie.url + '">' +
        '<span class="search-result-thumb" style="background-image: url(\'' + movie.cover + '\');"></span>' +
        '<span><strong>' + escapeHtml(movie.title) + '</strong><em>' + escapeHtml(movie.year + ' · ' + movie.region + ' · ' + movie.genre) + '</em></span>' +
        '</a>';
    }).join('');
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }

  function setupSearch() {
    var inputs = all('[data-search-input]');
    inputs.forEach(function (input) {
      input.addEventListener('input', function () {
        var keyword = input.value.trim().toLowerCase();
        inputs.forEach(function (other) {
          if (other !== input) {
            other.value = input.value;
          }
        });
        renderSearch(keyword);
      });
      input.addEventListener('focus', function () {
        renderSearch(input.value.trim().toLowerCase());
      });
    });
    var close = one('[data-search-close]');
    if (close) {
      close.addEventListener('click', function () {
        var panel = one('[data-search-panel]');
        if (panel) {
          panel.classList.remove('is-open');
        }
      });
    }
  }

  function setupHero() {
    var hero = one('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = all('.hero-slide', hero);
    var dots = all('[data-hero-dot]', hero);
    var index = 0;
    var timer;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }
    function start() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(index + 1);
      }, 5200);
    }
    var prev = one('[data-hero-prev]', hero);
    var next = one('[data-hero-next]', hero);
    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        start();
      });
    });
    start();
  }

  function setupPageFilter() {
    var input = one('[data-page-filter]');
    var scope = one('[data-filter-scope]');
    if (!input || !scope) {
      return;
    }
    var items = all('[data-card-title], .ranking-row', scope);
    var empty = one('[data-empty-message]');
    input.addEventListener('input', function () {
      var keyword = input.value.trim().toLowerCase();
      var shown = 0;
      items.forEach(function (item) {
        var haystack = [
          item.getAttribute('data-card-title'),
          item.getAttribute('data-card-genre'),
          item.getAttribute('data-card-region'),
          item.textContent
        ].join(' ').toLowerCase();
        var match = haystack.indexOf(keyword) !== -1;
        item.style.display = match ? '' : 'none';
        if (match) {
          shown += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', shown === 0);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupSearch();
    setupHero();
    setupPageFilter();
  });
})();
