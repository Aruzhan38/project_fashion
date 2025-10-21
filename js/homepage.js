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
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (validateContact(form)) {
    alert('Form submitted successfully!');
    form.reset();
    closeOverlay();
  }
});
/* === Read More Toggle === */
(function () {
  const btn = document.getElementById('readMoreBtn');
  const extra = document.getElementById('extraEditorial');
  if (!btn || !extra) return;

  btn.addEventListener('click', () => {
    const hidden = extra.style.display === 'none' || extra.style.display === '';
    extra.style.display = hidden ? 'block' : 'none';
    btn.textContent = hidden ? 'Read less' : 'Read more';
    btn.setAttribute('aria-expanded', String(hidden));
  });
})();


/* Keyboard navigation по меню */
(() => {
  const links = Array.from(document.querySelectorAll('#mainNav .nav-link'));
  if (!links.length) return;

  links.forEach(a => a.setAttribute('tabindex', '0'));

  function moveFocus(idxDelta, current) {
    const idx = links.indexOf(current);
    if (idx === -1) return;
    let next = (idx + idxDelta + links.length) % links.length;
    links[next].focus();
  }

  links.forEach(link => {
    link.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          moveFocus(1, e.currentTarget);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          moveFocus(-1, e.currentTarget);
          break;
        case 'Home':
          e.preventDefault();
          links[0].focus();
          break;
        case 'End':
          e.preventDefault();
          links[links.length - 1].focus();
          break;
      }
    });
  });
})();

/* Switch statement: смена языка (EN/RU/KK) */
(() => {
  const select = document.getElementById('langSelect');
  if (!select) return;

  const t = {
    en: {
      heroH1: 'Unleash Your Inner Icon',
      heroP: 'Discover curated collections and find the perfect look for every moment.',
      readMore: 'Read more',
    },
    ru: {
      heroH1: 'Раскрой свою внутреннюю икону',
      heroP: 'Открой подборки образов и находи идеальный look для любого момента.',
      readMore: 'Читать далее',
    },
    kk: {
      heroH1: 'Ішкі келбетіңді аш',
      heroP: 'Әр сәтке лайық стильді топтамаларды тап.',
      readMore: 'Толығырақ',
    },
  };

  function applyLang(lang) {
    
    switch (lang) {
      case 'ru':
      case 'kk':
      case 'en':
        break; 
      default:
        lang = 'en';
    }
    const hero = document.querySelector('.hero');
    if (hero) {
      const h1 = hero.querySelector('h1');
      const p  = hero.querySelector('p');
      if (h1) h1.textContent = t[lang].heroH1;
      if (p)  p.textContent  = t[lang].heroP;
    }
    const readMoreBtns = document.querySelectorAll('#readMoreBtn, a.btn[href*="inspiration"]');
    readMoreBtns.forEach(b => b.textContent = t[lang].readMore);
  }

  // init + сохранение выбора
  const saved = localStorage.getItem('fl-lang') || 'en';
  select.value = saved;
  applyLang(saved);

  select.addEventListener('change', () => {
    const lang = select.value;
    localStorage.setItem('fl-lang', lang);
    applyLang(lang);
  });
})();
/*Time Button*/
(() => {
  const btn = document.getElementById('timeBtn');
  const out = document.getElementById('timeNow');
  if (!btn || !out) return;

  btn.addEventListener('click', () => {
    out.textContent = new Date().toLocaleTimeString();
    out.setAttribute('aria-live', 'polite');
  });
})();
/*Color Change Button*/
var button = document.getElementById("colorBtn");


let colors = ["#f5e1e1", "#e8d7f1", "#d3f8e2", "#f6eec7", "#f4cccc"];
let currentColorIndex = 0;

button.addEventListener("click", function() {
  document.body.style.transition = "background 0.5s ease";
  document.body.style.backgroundColor = colors[currentColorIndex];


  currentColorIndex = currentColorIndex + 1;
  if (currentColorIndex >= colors.length) {
    currentColorIndex = 0;
  }
});
/*Button Click Sound*/
(() => {
  const clickSound = new Audio('images_aru/click.mp3');

  document.querySelectorAll('button, .btn').forEach(btn => {
    btn.addEventListener('click', () => {
      
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {}); 
    });
  });
})();