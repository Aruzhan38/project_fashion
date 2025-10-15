document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('voteForm');
  const urlInput = form.querySelector('input[type="url"]');
  const textarea = document.getElementById('textarea');
  const checkbox = document.getElementById('shareCheck');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const errors = [];

    if (!urlInput.value.trim()) {
      errors.push('URL is required.');
    }

    if (!textarea.value.trim()) {
      errors.push('Please tell us why this inspires you.');
    }
    if (!checkbox.checked) {
      errors.push('You must agree to share this.');
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
    } else {
      alert('Thank you! Your inspiration has been shared.');
      form.reset();
    }
  });
});




const questions = document.querySelectorAll('.question');

  questions.forEach((q) => {
    q.addEventListener('click', () => {
      const answer = q.nextElementSibling; 
      if (answer.style.display === 'none') {
        answer.style.display = 'block';
      } else {
        answer.style.display = 'none';
      }
    });
  });





document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('openPopup');
    const closeBtn = document.getElementById('closePopup');
    const overlay = document.getElementById('popupOverlay');

    openBtn.addEventListener('click', () => {
      overlay.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
      overlay.classList.add('hidden');
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.add('hidden');
      }
    });
  });






const button = document.getElementById('changeColorBtn');
const colors=['blue','red','yellow'];
let current=0;
button.addEventListener('click',()=>{
  document.body.style.backgroundColor=colors[current];
  current=(current+1)%colors.length;
});




const d=new Date();
document.getElementById("datetime").innerHTML=d;




