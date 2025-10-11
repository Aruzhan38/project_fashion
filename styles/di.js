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