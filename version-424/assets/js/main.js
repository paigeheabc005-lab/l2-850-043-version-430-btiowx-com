(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector('[data-nav-toggle]');
    var menu = document.querySelector('[data-nav-menu]');

    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var isOpen = menu.classList.toggle('is-open');
        toggle.textContent = isOpen ? '×' : '☰';
      });
    }

    var heroBg = document.querySelector('[data-hero-bg]');
    if (heroBg) {
      var updateHero = function () {
        var offset = Math.min(window.scrollY * 0.26, 180);
        heroBg.style.setProperty('--hero-y', offset + 'px');
      };
      updateHero();
      window.addEventListener('scroll', updateHero, { passive: true });
    }

    document.querySelectorAll('[data-search-scope]').forEach(function (scope) {
      var input = scope.querySelector('[data-filter-input]');
      var yearFilter = scope.querySelector('[data-year-filter]');
      var categoryFilter = scope.querySelector('[data-category-filter]');
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
      var empty = scope.querySelector('[data-empty-state]');

      var filterCards = function () {
        var query = input ? input.value.trim().toLowerCase() : '';
        var year = yearFilter ? yearFilter.value : '';
        var category = categoryFilter ? categoryFilter.value : '';
        var visible = 0;

        cards.forEach(function (card) {
          var searchText = (card.getAttribute('data-search') || '').toLowerCase();
          var cardYear = card.getAttribute('data-year') || '';
          var cardCategory = card.getAttribute('data-category') || '';
          var matchQuery = !query || searchText.indexOf(query) !== -1;
          var matchYear = !year || cardYear === year;
          var matchCategory = !category || cardCategory === category;
          var show = matchQuery && matchYear && matchCategory;

          card.hidden = !show;
          if (show) {
            visible += 1;
          }
        });

        if (empty) {
          empty.hidden = visible !== 0;
        }
      };

      if (input) {
        input.addEventListener('input', filterCards);
      }
      if (yearFilter) {
        yearFilter.addEventListener('change', filterCards);
      }
      if (categoryFilter) {
        categoryFilter.addEventListener('change', filterCards);
      }
    });
  });
})();
