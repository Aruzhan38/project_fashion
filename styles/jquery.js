// Tasks 1–3: Search + Autocomplete + Highlight
$(function () {
  const $input = $('#search');
  const $list = $('#brands li');
  const $drop = $('#suggestions');

  const highlight = (text, query) =>
    query ? text.replace(new RegExp(`(${query})`, 'gi'), '<mark>$1</mark>') : text;

  $input.on('input', function () {
    const val = $(this).val().toLowerCase().trim();
    const matches = [];

    $list.each(function () {
      const txt = $(this).text();
      const match = txt.toLowerCase().includes(val);
      $(this).toggle(match).html(highlight(txt, val));
      if (match && val) matches.push(txt);
    });

    $drop.html(matches.slice(0, 5).map(m => `<li>${m}</li>`).join(''))[matches.length ? 'show' : 'hide']();
  });

  $drop.on('click', 'li', function () {
    $input.val($(this).text()).trigger('input');
    $drop.hide();
  });

  $(document).on('click', e => $(e.target).closest('#suggestions, #search').length || $drop.hide());
});


//Task 4. Colorful and Stylized Scroll Progress Bar
$(window).on("scroll", function () {
  const scrollTop = $(window).scrollTop();
  const docHeight = $(document).height() - $(window).height();
  const scrollPercent = (scrollTop / docHeight) * 100;
  $("#scrollBar").css("width", scrollPercent + "%");
});


// Task 5: Animated Number Counter
$(window).on("scroll", () => {
  $(".count:not(.done)").each(function () {
    const $el = $(this), target = +$el.data("target");
    if ($(window).scrollTop() + $(window).height() > $el.offset().top) {
      $el.addClass("done").prop("num", 0).animate(
        { num: target },
        {
          duration: 1800,
          step: now => $el.text(Math.floor(now)),
          complete: () => $el.text(target + "+")
        }
      );
    }
  });
});

//Task 6. Loading spinner on Submit
//Task 7. Notification System

$(function () {
  $("form.needs-validation").on("submit", function (e) {
    e.preventDefault();

    const form = this;
    const $form = $(form);
    const $btn  = $form.find("button[type='submit']");
    const btnText = $btn.text();

    if (!form.checkValidity()) {
      $form.addClass("was-validated");
      alert("⚠️ Please fill out all required fields correctly.");
      return; 
    }

    $btn.prop("disabled", true).html(`
      <span class="spinner-border spinner-border-sm me-2" role="status"></span>
      Please wait…
    `);

    setTimeout(() => {
      $btn.prop("disabled", false).text(btnText);
      form.reset();
      $form.removeClass("was-validated");

      $(`<div class="alert alert-success text-center mt-3" role="alert">
          ✅ Form submitted successfully!
        </div>`)
        .insertAfter($form)
        .hide().fadeIn(250).delay(1800).fadeOut(350, function () { $(this).remove(); });
    }, 1500);
  });
});

//Task 8. Copied to Clipboard Button
$(function () {
  $("#copyQuote").on("click", function () {
    const text = $("#quote-text").text().trim();
    navigator.clipboard.writeText(text).then(() => {
      $(this).text("✓ Copied!").prop("disabled", true);
      setTimeout(() => $(this).text("Copy").prop("disabled", false), 1200);
    });
  });
});


// Task 9: Image Lazy Loading
$(function () {
  const $lazy = $("img.lazy");

  const loadImg = $img => {
    if ($img.data("loaded")) return;
    const wt = $(window).scrollTop(), wb = wt + $(window).height(),
          it = $img.offset().top, ib = it + $img.height();
    if (ib >= wt - 100 && it <= wb + 100) {
      $img.attr("src", $img.data("src")).addClass("loaded").data("loaded", true);
    }
  };

  const check = () => $lazy.each((_, el) => loadImg($(el)));
  $(window).on("scroll resize", check);
  check(); 
});

