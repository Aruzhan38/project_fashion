// star rating
document.querySelectorAll('.rating').forEach(block => {
  const stars = block.querySelectorAll('span[data-value]');
  const note  = block.querySelector('.rating-note');
  let current = 0;

  const paint = (n) => {
    stars.forEach(s => s.classList.toggle('active', Number(s.dataset.value) <= n));
    note.textContent = `Rate: ${n}/5`;
  };

  stars.forEach(star => {
    star.addEventListener('click', () => {
      current = Number(star.dataset.value);
      paint(current);
    });
    star.addEventListener('mouseenter', () => paint(Number(star.dataset.value)));
    star.addEventListener('mouseleave', () => paint(current));
  });
});

//night and day mode
document.addEventListener('keydown', (event) => {
  if (event.key.toUpperCase() === 'N') {
    document.body.style.backgroundColor = '#2b2b2b';
    document.body.style.color = '#fff';
  } 
  else if (event.key.toUpperCase() === 'D') {
    document.body.style.backgroundColor = '#fff7f8';
    document.body.style.color = '#0f0f10';
  }
});

// авто приветствие в зависимости от времени суток
document.addEventListener('DOMContentLoaded', () => {
  const isWishlist = window.location.pathname.endsWith('wishlist.html');
  if (!isWishlist) return;

  const hero = document.querySelector('.hero') || document.body;

  const el = document.createElement('h2');
  el.id = 'greetingText';
  el.className = 'greeting';
  el.textContent = getGreetingByTime();     
  hero.insertAdjacentElement('afterend', el);

  requestAnimationFrame(() => {
    el.classList.add('visible');
  });
});

function getGreetingByTime(){
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return "☀️ Good Morning! Ready for new looks?";
  if (h >= 12 && h < 18) return "🌸 Good Afternoon! Explore fresh styles today.";
  if (h >= 18 && h < 23) return "🌙 Good Evening! Perfect time to update your wishlist.";
  return "💤 Late Night Mode — style never sleeps!";
}


//звук по клику на кнопку
  const snd = new Audio('styles/click.mp3'); 
  let btn = document.querySelector('.btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = 'Test Sound';
    btn.style.display = 'block'; btn.style.margin = '20px auto';
    document.body.appendChild(btn);
  }
  btn.addEventListener('click', () => snd.play());



