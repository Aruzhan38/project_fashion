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

//практика