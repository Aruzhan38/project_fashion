var overlay = document.getElementById("popupOverlay");
var openBtn = document.getElementById("openPopup");
var closeBtn = document.getElementById("closePopup");
var form = document.getElementById("contactForm");

function openOverlay() {
  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");
  var firstField = overlay.querySelector("input, textarea");
  if (firstField) {
    firstField.focus();
  }
}

function closeOverlay() {
  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");
  if (openBtn) {
    openBtn.focus();
  }
}

if (openBtn) {
  openBtn.addEventListener("click", openOverlay);
}
if (closeBtn) {
  closeBtn.addEventListener("click", closeOverlay);
}

overlay.addEventListener("click", function(event) {
  if (event.target === overlay) {
    closeOverlay();
  }
});

window.addEventListener("keydown", function(event) {
  if (event.key === "Escape" && overlay.classList.contains("is-open")) {
    closeOverlay();
  }
});

function isValidEmail(value) {
  var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return pattern.test(value);
}

function setError(input, message) {
  var small = input.nextElementSibling;
  if (small && small.classList.contains("error")) {
    small.textContent = message || "";
  }
  if (message) {
    input.setAttribute("aria-invalid", "true");
  } else {
    input.removeAttribute("aria-invalid");
  }
}

function clearErrors(formElement) {
  var errors = formElement.querySelectorAll(".error");
  for (var i = 0; i < errors.length; i++) {
    errors[i].textContent = "";
  }
}

function validateContact(formElement) {
  clearErrors(formElement);
  var ok = true;

  var name = formElement.querySelector('input[name="name"]');
  var email = formElement.querySelector('input[name="email"]');
  var message = formElement.querySelector('textarea[name="message"]');

  if (name.value.trim() === "") {
    setError(name, "Please enter your name.");
    ok = false;
  }

  if (email.value.trim() === "") {
    setError(email, "Please enter your email.");
    ok = false;
  } else if (!isValidEmail(email.value.trim())) {
    setError(email, "Please enter a valid email.");
    ok = false;
  }

  if (message.value.trim() === "") {
    setError(message, "Please enter a message.");
    ok = false;
  }

  return ok;
}

if (form) {
  form.addEventListener("submit", function(event) {
    event.preventDefault();
    if (validateContact(form)) {
      alert("Form submitted successfully!");
      form.reset();
      closeOverlay();
    }
  });
}