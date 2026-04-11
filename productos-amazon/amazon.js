(function () {
  var LABELS = {
    esqui: 'Esquí',
    trail: 'Trail running',
    accesorios: 'Accesorios',
    calcetines: 'Calcetines',
    calzado: 'Calzado',
    fuerza: 'Fuerza',
    guantes: 'Guantes',
    ropa: 'Ropa',
  };

  var state = {
    category: 'all',
    subcategory: 'all',
    query: '',
  };

  var searchTimer = null;

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $all(sel, root) {
    return [].slice.call((root || document).querySelectorAll(sel));
  }

  /** Evita fallos si el toque no cae exactamente en el botón (texto, sombras). */
  function closestChip(target) {
    if (!target || target.nodeType !== 1) {
      return null;
    }
    if (target.classList && target.classList.contains('amazon-chip')) {
      return target;
    }
    if (typeof target.closest === 'function') {
      return target.closest('.amazon-chip');
    }
    var el = target.parentElement;
    while (el && el.nodeType === 1) {
      if (el.classList && el.classList.contains('amazon-chip')) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  }

  function normalize(s) {
    var t = (s || '').toLowerCase();
    if (typeof t.normalize === 'function') {
      return t.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    return t;
  }

  function getCards() {
    return $all('.product-card');
  }

  function labelForSlug(slug) {
    return LABELS[slug] || slug;
  }

  function uniqueSorted(keys) {
    var o = {};
    keys.forEach(function (k) {
      if (k) {
        o[k] = true;
      }
    });
    return Object.keys(o).sort();
  }

  /** Varios slugs en un atributo, separados por espacios (p. ej. "esqui trail", "accesorios calzado"). */
  function splitDataTokens(attrValue) {
    var s = (attrValue || '').trim();
    if (!s) {
      return [];
    }
    return s.split(/\s+/).filter(function (t) {
      return !!t;
    });
  }

  function cardHasCategoryToken(card, filterSlug) {
    if (filterSlug === 'all') {
      return true;
    }
    var tokens = splitDataTokens(card.getAttribute('data-category'));
    for (var i = 0; i < tokens.length; i++) {
      if (tokens[i] === filterSlug) {
        return true;
      }
    }
    return false;
  }

  function cardHasSubcategoryToken(card, filterSlug) {
    if (filterSlug === 'all') {
      return true;
    }
    var tokens = splitDataTokens(card.getAttribute('data-subcategory'));
    for (var j = 0; j < tokens.length; j++) {
      if (tokens[j] === filterSlug) {
        return true;
      }
    }
    return false;
  }

  function categoriesFromCards() {
    var all = [];
    getCards().forEach(function (c) {
      var parts = splitDataTokens(c.getAttribute('data-category'));
      for (var i = 0; i < parts.length; i++) {
        all.push(parts[i]);
      }
    });
    return uniqueSorted(all);
  }

  function subcategoriesFromCards(categoryFilter) {
    var subs = [];
    getCards().forEach(function (card) {
      var subAttr = card.getAttribute('data-subcategory') || '';
      if (!cardHasCategoryToken(card, categoryFilter)) {
        return;
      }
      var parts = splitDataTokens(subAttr);
      for (var i = 0; i < parts.length; i++) {
        subs.push(parts[i]);
      }
    });
    return uniqueSorted(subs);
  }

  function cardMatches(card) {
    var cat = card.getAttribute('data-category') || '';
    var sub = card.getAttribute('data-subcategory') || '';
    var extra = card.getAttribute('data-search') || '';
    var titleEl = card.querySelector('.product-card__title');
    var title = titleEl ? titleEl.textContent : '';
    var descEl = card.querySelector('.product-card__desc');
    var desc = descEl ? descEl.textContent : '';

    if (state.category !== 'all' && !cardHasCategoryToken(card, state.category)) {
      return false;
    }
    if (state.subcategory !== 'all' && !cardHasSubcategoryToken(card, state.subcategory)) {
      return false;
    }

    var q = normalize(state.query.trim());
    if (!q) {
      return true;
    }
    var haystack = normalize(
      title + ' ' + desc + ' ' + extra + ' ' + cat + ' ' + sub,
    );
    return haystack.indexOf(q) !== -1;
  }

  function applyFilters() {
    var cards = getCards();
    var n = 0;
    cards.forEach(function (card) {
      if (cardMatches(card)) {
        card.classList.remove('product-card--hidden');
        n += 1;
      } else {
        card.classList.add('product-card--hidden');
      }
    });

    var resultsEl = $('#amazon-results');
    if (resultsEl) {
      if (n === 0) {
        resultsEl.textContent = 'Ningún producto coincide con los filtros.';
      } else if (n === 1) {
        resultsEl.textContent = '1 producto mostrado.';
      } else {
        resultsEl.textContent = n + ' productos mostrados.';
      }
    }

    var emptyEl = $('#amazon-empty');
    if (emptyEl) {
      if (n !== 0) {
        emptyEl.setAttribute('hidden', 'hidden');
      } else {
        emptyEl.removeAttribute('hidden');
      }
    }
  }

  function makeChip(text, value, isPressed) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'amazon-chip';
    btn.textContent = text;
    btn.setAttribute('data-value', value);
    btn.setAttribute('aria-pressed', isPressed ? 'true' : 'false');
    return btn;
  }

  function onCategoryChipClick(e) {
    var t = closestChip(e.target);
    if (!t) {
      return;
    }
    var val = t.getAttribute('data-value');
    state.category = val || 'all';
    state.subcategory = 'all';
    renderCategoryChips();
    renderSubcategoryChips();
    applyFilters();
  }

  function renderCategoryChips() {
    var container = $('#category-chips');
    if (!container) {
      return;
    }
    container.innerHTML = '';
    container.removeEventListener('click', onCategoryChipClick);
    var label = document.createElement('span');
    label.className = 'amazon-filters__label';
    label.textContent = 'Categoría';
    container.appendChild(label);

    var cats = categoriesFromCards();
    var frag = document.createDocumentFragment();
    frag.appendChild(
      makeChip('Todas', 'all', state.category === 'all'),
    );
    cats.forEach(function (slug) {
      frag.appendChild(
        makeChip(
          labelForSlug(slug),
          slug,
          state.category === slug,
        ),
      );
    });
    container.appendChild(frag);
    container.addEventListener('click', onCategoryChipClick);
  }

  function onSubcategoryChipClick(e) {
    var t = closestChip(e.target);
    if (!t) {
      return;
    }
    var val = t.getAttribute('data-value');
    state.subcategory = val || 'all';
    renderSubcategoryChips();
    applyFilters();
  }

  function renderSubcategoryChips() {
    var container = $('#subcategory-chips');
    if (!container) {
      return;
    }
    container.innerHTML = '';
    container.removeEventListener('click', onSubcategoryChipClick);
    var subs = subcategoriesFromCards(state.category);
    if (subs.length === 0) {
      container.setAttribute('hidden', 'hidden');
      return;
    }
    container.removeAttribute('hidden');

    var label = document.createElement('span');
    label.className = 'amazon-filters__label';
    label.textContent = 'Subcategoría';
    container.appendChild(label);

    var frag = document.createDocumentFragment();
    frag.appendChild(
      makeChip('Todas', 'all', state.subcategory === 'all'),
    );
    subs.forEach(function (slug) {
      frag.appendChild(
        makeChip(
          labelForSlug(slug),
          slug,
          state.subcategory === slug,
        ),
      );
    });
    container.appendChild(frag);
    container.addEventListener('click', onSubcategoryChipClick);
  }

  function onSearchInput() {
    var input = $('#amazon-search-input');
    if (!input) {
      return;
    }
    state.query = input.value;
    applyFilters();
  }

  function onSearchInputDebounced() {
    if (searchTimer) {
      clearTimeout(searchTimer);
    }
    searchTimer = setTimeout(function () {
      onSearchInput();
    }, 180);
  }

  function init() {
    renderCategoryChips();
    renderSubcategoryChips();

    var input = $('#amazon-search-input');
    if (input) {
      input.addEventListener('input', onSearchInputDebounced, false);
      input.addEventListener('search', onSearchInput, false);
      input.addEventListener(
        'blur',
        function () {
          onSearchInput();
        },
        false,
      );
    }

    applyFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
