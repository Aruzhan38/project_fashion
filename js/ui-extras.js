$(function () {
  var $bar = $('#scrollProgress');
  var $counters = $('.counter');

  function updateScrollBar() {
    var docH = $(document).height();
    var winH = $(window).height();
    var max  = docH - winH;
    var sc   = $(window).scrollTop();
    var pct  = max > 0 ? (sc / max) * 100 : 0;
    $bar.css('width', pct + '%');
  }

 
  function isInView($el) {
    var winTop = $(window).scrollTop();
    var winBot = winTop + $(window).height();

    var elTop = $el.offset().top;
    var elBot = elTop + $el.outerHeight();

    return elBot > winTop && elTop < winBot;
  }


  function animateCounter($el) {
    if ($el.data('animated')) return;
    $el.data('animated', true);

    var targetStr = $el.data('target') || $el.text() || '0';
    var target    = parseFloat(targetStr) || 0;
    var hasDot    = String(targetStr).indexOf('.') !== -1;
    var decimals  = hasDot ? (String(targetStr).split('.')[1] || '').length : 0;

    var from = 0;
    var duration = 1200;   
    var fps = 60;       
    var steps = Math.max(1, Math.round((duration / 1000) * fps));
    var step  = 0;
    var delta = (target - from) / steps;

    var prefix = $el.data('prefix') || '';
    var suffix = $el.data('suffix') || '';

    var timer = setInterval(function () {
      step++;
      var value = from + delta * step;

      
      if (decimals > 0) {
        value = value.toFixed(decimals);
      } else {
        value = Math.round(value);
      }

      $el.text(prefix + value + suffix);

      if (step >= steps) {
        
        var finalVal = (decimals > 0) ? target.toFixed(decimals) : Math.round(target);
        $el.text(prefix + finalVal + suffix);
        clearInterval(timer);
      }
    }, 1000 / fps);
  }

  
  function checkCounters() {
    $counters.each(function () {
      var $el = $(this);
      if (isInView($el)) {
        animateCounter($el);
      }
    });
  }

 
  $(window).on('scroll', function () {
    updateScrollBar();
    checkCounters();
  });

  $(window).on('resize', function () {
    updateScrollBar();
    checkCounters();
  });


  updateScrollBar();
  checkCounters();
});
