
$(function () {
  /* ========== Task 6: Loading spinner on Submit ========== */
const overlay = document.getElementById('popupOverlay');

$(function () {
  const $form = $('#contactForm');

  $form.on('submit', function (e) {
    e.preventDefault();

    const domForm = this; 
    if (!validateContact(domForm)) {
      showToast('Please fix the errors above.', 'error');
      return;
    }

    const $btn = $(this).find('button[type="submit"]');
    if ($btn.data('loading')) return;

    const original = $btn.html();
    $btn.data('loading', true)
        .prop('disabled', true)
        .addClass('is-loading')
        .html('<span class="spinner"></span>Please wait…');

    setTimeout(function () {
      
      $btn.prop('disabled', false)
          .removeClass('is-loading')
          .data('loading', false)
          .html(original);

      try {
        domForm.reset();
        if (overlay) {
          overlay.classList.remove('is-open');
          overlay.setAttribute('aria-hidden', 'true');
        }
      } catch (_) {}

      showToast('Form submitted successfully', 'success');
    }, 1200);
  });
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

$(document).on('click', '.btn-copy', function () {
    var $btn = $(this);
    var targetSel = $btn.data('copy-target');
    var text = '';

    if (targetSel) {
      var $t = $(targetSel).first();
      text = ($t.val() || $t.text() || '').trim();
    } else {
      var $prev = $btn.prev();
      text = ($prev.val() || $prev.text() || '').trim();
    }

    if (!text) { showToast('Nothing to copy', 'error'); return; }

    var $ta = $('<textarea style="position:fixed;left:-9999px;top:-9999px;"></textarea>').val(text);
    $('body').append($ta);
    $ta[0].select();

    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    $ta.remove();

    $btn.trigger('copy', [ ok ]);
  });

  $(document).on('copy', '.btn-copy', function (e, ok) {
    var $btn = $(this);
    if (ok) {
      $btn.addClass('copied');
      showToast('Copied to clipboard', 'success');
      setTimeout(function () { $btn.removeClass('copied'); }, 1200);
    } else {
      showToast('Copy failed', 'error');
    }
  });

  /* =========================== Task 9: Image Lazy Loading =========================== */
 
  var $win = $(window);
  var preload = 120; 

  $('img.lazy').each(function () {
    var $img = $(this);
    if (!$img.attr('src')) {
      $img.attr('src','data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=');
    }
  });

  function inView($el) {
    var top = $el.offset().top;      
    var h   = $el.outerHeight() || 0;
    var winTop = $win.scrollTop();
    var winH   = $win.height();
    return (top < winTop + winH + preload) && (top + h > winTop - preload);
  }

  function loadVisible() {
    $('img.lazy[data-src]').each(function () {
      var $img = $(this);
      if ($img.data('loaded')) return;
      if (!inView($img)) return;

      var real = $img.attr('data-src');
      if (!real) return;

   
      $img.attr('src', real).on('load', function () {
        $img.addClass('loaded').data('loaded', true).removeAttr('data-src');
      });
    });
  }

  
  $win.on('scroll', loadVisible);
  $win.on('resize', loadVisible);
  $win.on('load',   loadVisible);
  loadVisible(); 
});