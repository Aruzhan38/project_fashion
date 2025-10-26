function debounce(fn, delay) {
  let t;
  return function () {
    clearTimeout(t);
    const ctx = this, args = arguments;
    t = setTimeout(() => fn.apply(ctx, args), delay);
  };
}

$(function () {
  const $cards = $('.grid .grid-item');
  const $input = $('#styleSearch');
  const $match = $('#matchCount');
  const $empty = $('#noResults');

  $match.text($cards.length);

  const norm = (s) => (s || '').toString().toLowerCase().trim();

  function runFilter() {
    const q = norm($input.val());
    if (!q) {
      $cards.stop(true, true).fadeIn(120);
      $match.text($cards.length);
      $empty.hide();
      return;
    }

    const $visible = $cards.filter(function () {
      return norm($(this).text()).indexOf(q) > -1;
    });

    $cards.not($visible).stop(true, true).fadeOut(120);
    $visible.stop(true, true).fadeIn(120);

    $match.text($visible.length);
    $empty.toggle($visible.length === 0);
  }

  $input.on('keyup', debounce(runFilter, 120));
});
