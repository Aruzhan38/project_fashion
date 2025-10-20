//form validation
const form = document.querySelector('.needs-validation');

if (form) {
  form.addEventListener('submit', (event) => {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      alert("⚠️ Please fill out all required fields correctly.");
    } else {
      event.preventDefault(); 
      alert("✅ Form submitted successfully!");
      form.reset();
    }
//bootsrap validation class for mistakes
    form.classList.add('was-validated');
  });
}

//time
document.addEventListener('DOMContentLoaded', () => {
  const dateTimeElement = document.getElementById('dateTime');
  if (!dateTimeElement) return;

  function updateDateTime() {
    const now = new Date();

    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };

    const formatted = now.toLocaleString('en-US', options);
    dateTimeElement.textContent = formatted;
  }

//обнова времени каждую минуту
  updateDateTime();
  setInterval(updateDateTime, 60000);
});


//bg colors
document.addEventListener("DOMContentLoaded", () => {
  const colors = ['#f8e9ec', '#f6f0f5', '#fdf6f0', '#f3e8ee', '#ece6eb', '#fff7f8'];
  let i = 0;

  const btn = document.getElementById("bg-color-btn");
  if (!btn) return;
  

  btn.addEventListener("click", () => {
    document.body.style.backgroundColor = colors[i];
    i = (i + 1) % colors.length;
  });
});


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
  if (event.key.toLowerCase() === 'n') {
    document.body.style.backgroundColor = '#2b2b2b';
    document.body.style.color = '#fff';
  } 
  else if (event.key.toLowerCase() === 'd') {
    document.body.style.backgroundColor = '#fff7f8';
    document.body.style.color = '#0f0f10';
  }
});

// авто приветствие в зависимости от времени суток
document.addEventListener('DOMContentLoaded', () => {
  const isWishlist = window.location.pathname.endsWith('wishlist.html');
  if (!isWishlist) return;
  const hero = document.querySelector('.hero') || document.body;

  const greetingText = document.createElement('h2');
  greetingText.id = 'greetingText';
  greetingText.className = 'center';
  greetingText.style.margin = '40px 0';
  greetingText.style.color = '#7a0d4f';
  greetingText.style.transition = 'opacity 1s ease';
  greetingText.style.opacity = '0';
  hero.insertAdjacentElement('afterend', greetingText);

  const now = new Date();
  const hour = now.getHours();
  let greeting;

  switch (true) {
    case (hour >= 5 && hour < 12):
      greeting = "☀️ Good Morning! Ready for new looks?";
      break;
    case (hour >= 12 && hour < 18):
      greeting = "🌸 Good Afternoon! Explore fresh styles today.";
      break;
    case (hour >= 18 && hour < 23):
      greeting = "🌙 Good Evening! Perfect time to update your wishlist.";
      break;
    default:
      greeting = "💤 Late Night Mode - style never sleeps!";
  }

  greetingText.textContent = greeting;

  // эффект плавного появления
  setTimeout(() => (greetingText.style.opacity = '1'), 300);
});


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