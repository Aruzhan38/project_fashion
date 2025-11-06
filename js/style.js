// Theme Toggle 
(function () {
  const STORAGE_KEY = 'fl-theme';
  const btn = document.getElementById('themeToggle');

  function applyTheme(mode) {
    const isDark = mode === 'dark';
    document.body.classList.toggle('theme-dark', isDark);

    if (btn) {
      btn.setAttribute('aria-pressed', String(isDark));
      btn.textContent = isDark ? '☀️' : '🌙';
      btn.title = isDark ? 'Switch to light' : 'Switch to dark';
      btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    }

    const themeMeta =
      document.querySelector('meta[name="theme-color"]') ||
      (function () {
        const m = document.createElement('meta');
        m.name = 'theme-color';
        document.head.appendChild(m);
        return m;
      })();
    themeMeta.setAttribute('content', isDark ? '#15161a' : '#ffffff');
  }

  function getInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  let current = getInitialTheme();
  applyTheme(current);

  if (!localStorage.getItem(STORAGE_KEY) && window.matchMedia) {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        current = e.matches ? 'dark' : 'light';
        applyTheme(current);
      }
    });
  }

  if (btn) {
    btn.addEventListener('click', () => {
      current = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, current);
      applyTheme(current);
    });
  }
})();