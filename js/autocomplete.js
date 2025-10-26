
function debounce(fn, delay) {
  let t;
  return function () {
    clearTimeout(t);
    const ctx = this, args = arguments;
    t = setTimeout(() => fn.apply(ctx, args), delay);
  };
}

function norm(s) {
  return (s || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

function highlight(label, q) {
  if (!q) return label;
  const esc = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(esc, "ig");
  return label.replace(re, (m) => `<mark>${m}</mark>`);
}

const DEFAULT_HL_TARGETS = '.grid .grid-item h3, .grid .grid-item p, .section-title';

function clearHighlights($scope) {
  const $root = $scope && $scope.length ? $scope : $(document);
  $root.find('mark.hl').each(function () {
    $(this).replaceWith($(this).text());
  });
  $root.find('.hl-wrap').each(function () {
    $(this).children().unwrap();
  });
}

function highlightPage(q, selector) {
  const rawQuery = (q || '').trim();
  const $targets = $(selector || DEFAULT_HL_TARGETS);
  clearHighlights($(document));
  if (!rawQuery) return;

  const esc = rawQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re  = new RegExp(`(${esc})`, 'gi');

  $targets.each(function () {
    const $el = $(this);
    if (!$el.is(':visible')) return;
    const html = $el.html();
    const next = html.replace(re, '<mark class="hl">$1</mark>');
    if (next !== html) {
      $el.html(next);
      if (!$el.parent().hasClass('hl-wrap')) {
        $el.wrap('<span class="hl-wrap"></span>');
      }
    }
  });
}



const STYLE_SUGGESTIONS = [
  { value: "Casual",   keywords: ["everyday", "jeans", "t-shirt", "basic"] },
  { value: "Sporty",   keywords: ["athleisure", "hoodie", "leggings", "trainer"] },
  { value: "Elegant",  keywords: ["formal", "dress", "heels", "blazer", "chic"] },
  { value: "Street",   keywords: ["oversized", "sneakers", "baggy", "trendy"] },
  { value: "Academic", keywords: ["preppy", "plaid", "cardigan", "loafers"] },
  { value: "Classic",  keywords: ["timeless", "neutral", "clean cuts"] },
  { value: "Boho",     keywords: ["flowy", "earthy", "bohemian", "maxi"] },
  { value: "Muslim",   keywords: ["modest", "abaya", "hijab", "layering"] }
];

$(function () {
  const $input = $("#styleSearch");
  if (!$input.length) return;

  $input.attr({
    role: "combobox",
    "aria-autocomplete": "list",
    "aria-expanded": "false"
  });

  const $menu = $('<div class="autocomplete" role="listbox" hidden></div>');
  $menu.insertAfter($input);

  let items = []; 
  let idx = -1;  

  function closeMenu() {
    $menu.prop("hidden", true).empty();
    idx = -1;
    $input.attr("aria-expanded", "false").removeAttr("aria-activedescendant");
  }

  function openMenu() {
    $menu.prop("hidden", false);
    $input.attr("aria-expanded", "true");
  }

  function buildMenu() {
    const q = norm($input.val());
    if (!q) {
      closeMenu();
      return;
    }

    const pool = STYLE_SUGGESTIONS.map(s => ({
      label: s.value,
      value: s.value,
      haystack: norm(s.value + " " + (s.keywords || []).join(" "))
    }));

    items = pool.filter(p => p.haystack.includes(q)).slice(0, 8);

    $menu.empty();

    if (items.length === 0) {
      $menu.append('<div class="item muted" role="option" aria-disabled="true">No suggestions</div>');
      openMenu();
      return;
    }

    items.forEach((it, i) => {
      const $opt = $(
        `<div class="item" role="option" id="ac-opt-${i}">${highlight(it.label, $input.val())}</div>`
      );

      $opt.on("mousedown", function (e) {
        e.preventDefault();
        choose(i);
      });

      $menu.append($opt);
    });

    idx = -1;
    openMenu();
  }

  const debouncedBuild = debounce(buildMenu, 120);
  const debouncedHL = debounce(() => highlightPage($input.val()), 80);

  function choose(i) {
    if (i < 0 || i >= items.length) return;
    const chosen = items[i].value;
    $input.val(chosen);

    $input.trigger("input");

    highlightPage($input.val());

    closeMenu();
  }

  function setActive(newIdx) {
    idx = newIdx;
    $menu.children().removeClass("active").attr("aria-selected", "false");
    if (idx >= 0 && idx < items.length) {
      const $el = $menu.children().eq(idx);
      $el.addClass("active").attr("aria-selected", "true");
      $input.attr("aria-activedescendant", $el.attr("id"));
    
      $el[0]?.scrollIntoView({ block: "nearest" });
    } else {
      $input.removeAttr("aria-activedescendant");
    }
  }


    $input.on('input', function () {
    debouncedBuild();
    debouncedHL();     
    });

  $input.on("keydown", function (e) {
    if ($menu.prop("hidden")) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(Math.min(idx + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(Math.max(idx - 1, 0));
    } else if (e.key === "Enter") {
      if (idx >= 0) {
        e.preventDefault();
        choose(idx);
      }
    } else if (e.key === "Escape") {
      closeMenu();
    }
  });

  $(document).on("click", function (e) {
    const inside = e.target === $input[0] || $.contains($menu[0], e.target);
    if (!inside) closeMenu();
  });

  $input.on("blur", () => {
  setTimeout(() => {
    const a = document.activeElement;
    const inMenu = a && $menu[0].contains(a);
    const isInput = a === $input[0];
    if (!inMenu && !isInput) closeMenu();
  }, 120);
});

});
