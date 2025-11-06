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

// === Contact Popup ===
const overlay = document.getElementById('popupOverlay');
const openBtn = document.getElementById('openPopup');
const closeBtn = document.getElementById('closePopup');
const form = document.getElementById('contactForm');

function openOverlay() {
  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');
  const firstField = overlay.querySelector('input, textarea');
  if (firstField) firstField.focus();
}
function closeOverlay() {
  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
  if (openBtn) openBtn.focus();
}

if (openBtn) openBtn.addEventListener('click', openOverlay);
if (closeBtn) closeBtn.addEventListener('click', closeOverlay);

overlay?.addEventListener('click', (e) => {
  if (e.target === overlay) closeOverlay();
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeOverlay();
});

// === Contact Form Validation ===
function isValidEmail(value) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return pattern.test(value);
}
function setError(input, message) {
  const small = input.nextElementSibling;
  if (small && small.classList.contains('error')) small.textContent = message || '';
  if (message) input.setAttribute('aria-invalid', 'true');
  else input.removeAttribute('aria-invalid');
}
function clearErrors(formElement) {
  const errors = formElement.querySelectorAll('.error');
  errors.forEach((el) => (el.textContent = ''));
}
function validateContact(formElement) {
  clearErrors(formElement);
  let ok = true;

  const name = formElement.querySelector('input[name="name"]');
  const email = formElement.querySelector('input[name="email"]');
  const message = formElement.querySelector('textarea[name="message"]');

  if (!name.value.trim()) { setError(name, 'Please enter your name.'); ok = false; }
  if (!email.value.trim()) { setError(email, 'Please enter your email.'); ok = false; }
  else if (!isValidEmail(email.value.trim())) { setError(email, 'Please enter a valid email.'); ok = false; }
  if (!message.value.trim()) { setError(message, 'Please enter a message.'); ok = false; }

  return ok;
}

/* === Read More Toggle === */
(() => {
  const btn = document.getElementById('readMoreBtn');
  const extra = document.getElementById('extraEditorial');
  if (!btn || !extra) return;

  extra.style.display = 'none';
  btn.textContent = 'Read more';
  btn.setAttribute('aria-expanded', 'false');

  btn.addEventListener('click', () => {
    const visible = extra.style.display === 'none';
    
    extra.style.display = visible ? 'block' : 'none';
    btn.textContent = visible ? 'Read less' : 'Read more';
    btn.setAttribute('aria-expanded', String(visible));
  });
})();