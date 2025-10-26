
$(function () {
  /* ========== Task 6: Loading spinner on Submit ========== */
  const $form = $('#contactForm');
  $form.on('submit', function (e) {
    e.preventDefault();
   
    const $btn = $(this).find('button[type="submit"]');
    if ($btn.data('loading')) return;

    const original = $btn.html();
    $btn.data('loading', true)
        .prop('disabled', true)
        .addClass('is-loading')
        .html('<span class="spinner"></span>Please wait…');

    setTimeout(() => {
      $btn.prop('disabled', false)
          .removeClass('is-loading')
          .data('loading', false)
          .html(original);

      showToast('Form submitted successfully', 'success');

      try {
        $('#contactForm')[0].reset();
        $('#popupOverlay').removeClass('is-open').attr('aria-hidden', 'true');
      } catch(_) {}
    }, 1200);
  });

  /* ========== Task 7: Notification / Toast ========== */
  function ensureToastStack() {
    let $stack = $('#toastStack');
    if (!$stack.length) {
      $stack = $('<div id="toastStack" aria-live="polite" aria-atomic="true"></div>');
      $('body').append($stack);
    }
    return $stack;
  }
  window.showToast = function (message, type = 'info', ms = 2200) {
    const $stack = ensureToastStack();
    const $t = $(`<div class="toast ${type}">${message}</div>`);
    $stack.append($t);
    requestAnimationFrame(() => $t.addClass('show'));
    setTimeout(() => {
      $t.removeClass('show');
      setTimeout(() => $t.remove(), 240);
    }, ms);
  };

  $('#openPopup').on('click', () => showToast('Contact form opened'));

  /* ========== Task 8: Copy to Clipboard Button ========== */

$(document).on('click', '.btn-copy', async function () {
  const $btn = $(this);
  const targetSel = $btn.data('copy-target');
  let text = '';

  if (targetSel) {
    const $t = $(targetSel).first();
    text = ($t.text() || $t.val() || '').trim();
  } else {
    const $prev = $btn.prev();
    text = ($prev.text() || $prev.val() || '').trim();
  }

  if (!text) return showToast('Nothing to copy', 'error');

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const $ta = $('<textarea style="position:absolute;left:-9999px;"></textarea>').val(text);
      $('body').append($ta);
      $ta[0].select();
      document.execCommand('copy');
      $ta.remove();
    }

    $btn.trigger('copy');
  } catch (err) {
    showToast('Copy failed', 'error');
  }
});

$(document).on('copy', '.btn-copy', function () {
  const $btn = $(this);
  $btn.addClass('copied').attr('data-tip', 'Copied!');
  $btn.addClass('show-tip');
  showToast('Copied to clipboard', 'success');
  setTimeout(() => {
    $btn.removeClass('show-tip copied').removeAttr('data-tip');
  }, 1200);
});

  /* ========== Task 9: Image Lazy Loading (jQuery scroll/offset/attr) ========== */
 
  const BLANK =
    'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

  $('img.lazy').each(function () {
    const $img = $(this);
    if (!$img.attr('src')) $img.attr('src', BLANK);
  });

  const $win = $(window);
  const preload = 120; 

  function inView($el) {
    const top = $el.offset().top;
    const h = $el.outerHeight() || 0;
    const winTop = $win.scrollTop();
    const winH = $win.height();
    return (top < winTop + winH + preload) && (top + h > winTop - preload);
  }

  function loadVisible() {
    $('img.lazy[data-src]').each(function () {
      const $img = $(this);
      if ($img.data('loaded')) return;
      if (!inView($img)) return;

      const real = $img.attr('data-src');
      $img.attr('src', real)
          .on('load', function () {
            $img.addClass('loaded').data('loaded', true).removeAttr('data-src');
          });
    });
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      loadVisible();
      ticking = false;
    });
  }

  $win.on('scroll resize load', onScroll);
  loadVisible(); // первая проверка
});
