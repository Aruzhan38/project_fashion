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



/*// Theme toggle + persistence 
  $(function () {
    const $root = $('html');
    const $btn  = $('#themeToggle');

    function apply(theme){
      const dark = theme === 'dark';
      $root.toggleClass('theme-dark', dark);
      $btn.html(dark ? '🌙' : '🌞')
          .attr('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    }

    const saved   = localStorage.getItem('theme');
    const systemD = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    apply(saved || (systemD ? 'dark' : 'light'));

    $btn.on('click', function () {
      const next = $root.hasClass('theme-dark') ? 'light' : 'dark';
      apply(next);
      localStorage.setItem('theme', next);
    });

    if(!saved && window.matchMedia){
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        apply(e.matches ? 'dark' : 'light');
      });
    }
  });*/