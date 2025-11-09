(function () {
  // Ключи localStorage
  const USERS_KEY   = 'fl-users';    // [{name,email,phone,passwordHash}]
  const SESSION_KEY = 'fl-session';  // {email,name}

  // DOM
  const profileView = document.getElementById('profileView');
  const authView    = document.getElementById('authView');

  const pName  = document.getElementById('pName');
  const pEmail = document.getElementById('pEmail');
  const btnLogout = document.getElementById('logoutBtn');

  const tabIn  = document.getElementById('tabSignIn');
  const tabUp  = document.getElementById('tabSignUp');
  const formIn = document.getElementById('formSignIn');
  const formUp = document.getElementById('formSignUp');
  const goSignUp = document.getElementById('goSignUp');
  const goSignIn = document.getElementById('goSignIn');

  // Helpers
  function readUsers(){ try{ return JSON.parse(localStorage.getItem(USERS_KEY)) || [] }catch{ return [] } }
  function writeUsers(list){ localStorage.setItem(USERS_KEY, JSON.stringify(list)); }
  function setSession(s){ localStorage.setItem(SESSION_KEY, JSON.stringify(s)); }
  function getSession(){ try{ return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') }catch{ return null } }
  function clearSession(){ localStorage.removeItem(SESSION_KEY); }

  // Простой демо-хэш (НЕ для продакшена)
  async function fakeHash(str){ return 'hash_' + btoa(unescape(encodeURIComponent(str))); }

  // Валидация
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const phoneRe = /^\+?[0-9() \-]{7,20}$/;
  const passRe  = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  function setError(inputEl, msg){
    const small = inputEl.nextElementSibling;
    if (small && small.classList.contains('error')) small.textContent = msg || '';
    inputEl.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }
  function clearFormErrors(form){
    form.querySelectorAll('.error').forEach(s => s.textContent = '');
    form.querySelectorAll('[aria-invalid="true"]').forEach(el => el.setAttribute('aria-invalid','false'));
  }

  // Переключение вкладок
  function showSignIn(){
    formUp.style.display = 'none';
    formIn.style.display = 'grid';
    tabIn.setAttribute('aria-selected','true');
    tabUp.setAttribute('aria-selected','false');
    tabUp.style.opacity = '.7'; tabIn.style.opacity = '1';
  }
  function showSignUp(){
    formIn.style.display = 'none';
    formUp.style.display = 'grid';
    tabUp.setAttribute('aria-selected','true');
    tabIn.setAttribute('aria-selected','false');
    tabIn.style.opacity = '.7'; tabUp.style.opacity = '1';
  }
  tabIn?.addEventListener('click', showSignIn);
  tabUp?.addEventListener('click', showSignUp);
  goSignUp?.addEventListener('click', e => { e.preventDefault(); showSignUp(); });
  goSignIn?.addEventListener('click', e => { e.preventDefault(); showSignIn(); });

  // Рендер состояния
  function render(){
    const s = getSession();
    if (s){
      // Вошли
      pName.textContent  = s.name || '—';
      pEmail.textContent = s.email || '—';
      profileView.style.display = '';
      authView.style.display = 'none';
    } else {
      // Не вошли
      profileView.style.display = 'none';
      authView.style.display = '';
      showSignIn(); // по умолчанию
    }
  }

  // Sign Up
  formUp?.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFormErrors(formUp);

    const name  = formUp.elements['name'].value.trim();
    const email = formUp.elements['email'].value.trim();
    const phone = formUp.elements['phone'].value.trim();
    const pass  = formUp.elements['password'].value;
    const conf  = formUp.elements['confirm'].value;

    if (!name)  setError(formUp.elements['name'], 'Name is required.');
    if (!email) setError(formUp.elements['email'], 'Email is required.');
    if (!phone) setError(formUp.elements['phone'], 'Phone is required.');
    if (!pass)  setError(formUp.elements['password'], 'Password is required.');
    if (!conf)  setError(formUp.elements['confirm'], 'Confirm password.');

    if (email && !emailRe.test(email)) setError(formUp.elements['email'], 'Invalid email.');
    if (phone && !phoneRe.test(phone)) setError(formUp.elements['phone'], 'Invalid phone.');
    if (pass && !passRe.test(pass))    setError(formUp.elements['password'], 'Min 8, Aa, 1 digit, 1 symbol.');
    if (pass && conf && pass !== conf) setError(formUp.elements['confirm'], 'Passwords do not match.');

    if (authView.querySelector('.error:not(:empty)')) return;

    const users = readUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())){
      setError(formUp.elements['email'], 'This email is already registered.');
      return;
    }

    const passwordHash = await fakeHash(pass);
    users.push({ name, email, phone, passwordHash });
    writeUsers(users);

    setSession({ email, name });
    render();
  });

  // Sign In
  formIn?.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFormErrors(formIn);

    const email = formIn.elements['email'].value.trim();
    const pass  = formIn.elements['password'].value;

    if (!email) setError(formIn.elements['email'], 'Email is required.');
    if (!pass)  setError(formIn.elements['password'], 'Password is required.');
    if (email && !emailRe.test(email)) setError(formIn.elements['email'], 'Invalid email.');

    if (authView.querySelector('.error:not(:empty)')) return;

    const users = readUsers();
    const u = users.find(x => x.email.toLowerCase() === email.toLowerCase());
    if (!u){ setError(formIn.elements['email'], 'No account with this email.'); return; }

    const passwordHash = await fakeHash(pass);
    if (u.passwordHash !== passwordHash){ setError(formIn.elements['password'], 'Incorrect password.'); return; }

    setSession({ email: u.email, name: u.name });
    render();
  });

  // Logout
  btnLogout?.addEventListener('click', () => {
    clearSession();
    render();
  });

  // Инициализация
  render();
})();
