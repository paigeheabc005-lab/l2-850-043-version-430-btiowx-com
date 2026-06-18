(function () {
  var button = document.querySelector('.mobile-menu-button');
  var mobileNav = document.querySelector('.mobile-nav');

  if (button && mobileNav) {
    button.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('is-open');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
      button.textContent = open ? '×' : '☰';
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var index = 0;

  function showSlide(next) {
    if (!slides.length) {
      return;
    }
    index = (next + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === index);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === index);
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      showSlide(i);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(index + 1);
    }, 5200);
  }

  var filterForm = document.querySelector('.inline-filter');
  var filterInput = document.querySelector('[data-filter-input]');
  var sortSelect = document.querySelector('[data-sort-select]');
  var cardsWrap = document.querySelector('[data-card-wrap]');

  function filterCards() {
    if (!cardsWrap) {
      return;
    }
    var cards = Array.prototype.slice.call(cardsWrap.querySelectorAll('.movie-card'));
    var keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
    cards.forEach(function (card) {
      var text = (card.getAttribute('data-search') || '').toLowerCase();
      card.style.display = keyword && text.indexOf(keyword) === -1 ? 'none' : '';
    });
  }

  function sortCards() {
    if (!cardsWrap || !sortSelect) {
      return;
    }
    var cards = Array.prototype.slice.call(cardsWrap.querySelectorAll('.movie-card'));
    var mode = sortSelect.value;
    cards.sort(function (a, b) {
      if (mode === 'title') {
        return (a.getAttribute('data-title') || '').localeCompare(b.getAttribute('data-title') || '', 'zh-Hans-CN');
      }
      var ay = parseInt(a.getAttribute('data-year') || '0', 10);
      var by = parseInt(b.getAttribute('data-year') || '0', 10);
      return by - ay;
    });
    cards.forEach(function (card) {
      cardsWrap.appendChild(card);
    });
    filterCards();
  }

  if (filterForm) {
    filterForm.addEventListener('submit', function (event) {
      event.preventDefault();
      filterCards();
    });
  }

  if (filterInput) {
    filterInput.addEventListener('input', filterCards);
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', sortCards);
  }

  var searchInput = document.querySelector('[data-search-input]');
  var searchResults = document.querySelector('[data-search-results]');

  function getQuery() {
    var params = new URLSearchParams(window.location.search);
    return (params.get('q') || '').trim();
  }

  function createResultCard(movie) {
    var article = document.createElement('article');
    article.className = 'movie-card';

    var poster = document.createElement('a');
    poster.className = 'poster-wrap';
    poster.href = './' + movie.url;

    var image = document.createElement('img');
    image.src = movie.image;
    image.alt = movie.title;
    image.loading = 'lazy';
    poster.appendChild(image);

    var play = document.createElement('span');
    play.className = 'poster-play';
    play.textContent = '▶';
    poster.appendChild(play);

    var content = document.createElement('div');
    content.className = 'card-content';

    var meta = document.createElement('div');
    meta.className = 'card-meta';
    var year = document.createElement('span');
    year.textContent = movie.year;
    var region = document.createElement('span');
    region.textContent = movie.region;
    meta.appendChild(year);
    meta.appendChild(region);

    var title = document.createElement('h2');
    var link = document.createElement('a');
    link.href = './' + movie.url;
    link.textContent = movie.title;
    title.appendChild(link);

    var desc = document.createElement('p');
    desc.textContent = movie.oneLine;

    var tags = document.createElement('div');
    tags.className = 'tag-row';
    [movie.category, movie.type, movie.genre].forEach(function (value) {
      if (value) {
        var tag = document.createElement('span');
        tag.textContent = value;
        tags.appendChild(tag);
      }
    });

    content.appendChild(meta);
    content.appendChild(title);
    content.appendChild(desc);
    content.appendChild(tags);
    article.appendChild(poster);
    article.appendChild(content);
    return article;
  }

  function renderSearch(query) {
    if (!searchResults || !window.SEARCH_MOVIES) {
      return;
    }
    var value = (query || '').toLowerCase();
    searchResults.innerHTML = '';
    var matches = window.SEARCH_MOVIES.filter(function (movie) {
      var text = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.category, movie.oneLine].join(' ').toLowerCase();
      return !value || text.indexOf(value) !== -1;
    }).slice(0, 120);

    if (!matches.length) {
      var empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = '没有找到匹配的影片，请换一个关键词再试。';
      searchResults.appendChild(empty);
      return;
    }

    var grid = document.createElement('div');
    grid.className = 'movie-grid';
    matches.forEach(function (movie) {
      grid.appendChild(createResultCard(movie));
    });
    searchResults.appendChild(grid);
  }

  if (searchInput && searchResults) {
    var q = getQuery();
    searchInput.value = q;
    renderSearch(q);
    var box = document.querySelector('.search-box');
    if (box) {
      box.addEventListener('submit', function (event) {
        event.preventDefault();
        var next = searchInput.value.trim();
        var url = next ? './search.html?q=' + encodeURIComponent(next) : './search.html';
        history.replaceState(null, '', url);
        renderSearch(next);
      });
    }
  }
})();
