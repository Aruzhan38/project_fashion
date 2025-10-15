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
const colors = ['#f8e9ec', '#f6f0f5','#fdf6f0', '#f3e8ee','#ece6eb', '#fff7f8'] 
let i = 0;

// button creation
const colorBtn = document.createElement('button');
colorBtn.textContent = 'Change Background';
colorBtn.className = 'btn btn-outline-accent';

colorBtn.style.display = 'block';
colorBtn.style.margin = '40px auto';

const wrapper = document.createElement('div');
wrapper.className = 'container center'; 
wrapper.appendChild(colorBtn);

const footer = document.querySelector('footer');
if (footer) {
  footer.parentNode.insertBefore(wrapper, footer);
} else {
  document.body.appendChild(wrapper);
}

colorBtn.addEventListener('click', () => {
  document.body.style.transition = 'background-color 0.4s ease';
  document.body.style.backgroundColor = colors[i];
  i = (i + 1) % colors.length;
});