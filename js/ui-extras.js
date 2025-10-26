
(() => {
  
  const bar = document.getElementById('scrollProgress');
  if (bar) {
    const onScroll = () => {
      const doc = document.documentElement;
      const win = window;
      const max = doc.scrollHeight - win.innerHeight;
      const pct = max > 0 ? (win.scrollY / max) * 100 : 0;
      bar.style.width = pct + '%';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });

  function animateCount(el, target, { duration = 1200, decimals = 0 } = {}) {
    const start = performance.now();
    const from = 0;
    const to = Number(target);
    const ease = t => 1 - Math.pow(1 - t, 3); 

    function frame(now) {
      const p = Math.min(1, (now - start) / duration);
      const v = from + (to - from) * ease(p);
      const fixed = v.toFixed(decimals);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';

      el.textContent = prefix + (decimals ? fixed : fmt.format(Math.round(v))) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const counters = Array.from(document.querySelectorAll('.counter'));
  if (counters.length) {
    const started = new WeakSet();
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (!started.has(el)) {
            started.add(el);
            const target = el.dataset.target || el.textContent || '0';
            const decimals = (target.includes('.') ? (target.split('.')[1] || '').length : 0);
            animateCount(el, target, { duration: 1400, decimals });
          }
        }
      });
    }, { threshold: 0.35 });

    counters.forEach(el => io.observe(el));
  }
})();
