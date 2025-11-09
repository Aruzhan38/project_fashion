// Replace "Profile" with user's name if logged in
(function () {
  const SESSION_KEY = 'fl-session';

  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
    catch { return null; }
  }
  function firstName(full) {
    return (full || '').trim().split(/\s+/)[0] || '';
  }

  function applyProfileUI() {
    const link = document.getElementById('profileLink');
    if (!link) return;

    const s = getSession();
    if (s) {
      const name = firstName(s.name) || s.email;
      link.textContent = name;          // <- теперь вместо "Profile" твое имя
      link.title = 'Open your profile';
      link.setAttribute('aria-label', 'Open your profile');
      link.href = 'profile.html';
      link.classList.add('fw-semibold');
    } else {
      link.textContent = 'Profile';     // гость
      link.title = 'Sign in or Sign up';
      link.setAttribute('aria-label', 'Sign in or Sign up');
      link.href = 'profile.html';
      link.classList.remove('fw-semibold');
    }

    // Доп. приветствие в герое (если захочешь)
    const greet = document.getElementById('greetName'); // <span id="greetName"></span>
    if (greet) greet.textContent = s ? `, ${firstName(s.name)}!` : '!';
  }

  document.addEventListener('DOMContentLoaded', applyProfileUI);

  // если сессия изменилась в другой вкладке — обновим и здесь
  window.addEventListener('storage', (e) => {
    if (e.key === SESSION_KEY) applyProfileUI();
  });
})();
