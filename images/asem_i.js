document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("voteForm");
  if (!form) return;
  const feedback = document.createElement("div");
  feedback.className = "mt-3 text-center fw-semibold";
  form.appendChild(feedback);
  
  function handleResponse(ok, message) {
    feedback.style.color = ok ? "#198754" : "#b00020"; 
    feedback.textContent = message;
  }
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const url = form.querySelector("input[type='url']").value.trim();
    const text = form.querySelector("#textarea").value.trim();
    const agree = form.querySelector("#shareCheck").checked;

    if (!url || !text || !agree) {
      handleResponse(false, "Please fill all fields and agree to share ");
      return;
    }
    const data = { url, text, agree };

    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        handleResponse(true, "Thank you! Your inspiration was shared successfully.");
        form.reset();
      } else {
        handleResponse(false, "Server error. Please try again later.");
      }
    } catch {
      setTimeout(() => {
        handleResponse(true, "Offline simulation: Your data was sent!");
        form.reset();
      }, 700);
    }
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const greetingBox = document.createElement("div");
  greetingBox.className = "text-center my-4 fs-4 fw-semibold";
  document.body.prepend(greetingBox);

  const hour = new Date().getHours();
  let greeting = "";

  switch (true) {
    case (hour >= 5 && hour < 12):
      greeting = " Good morning, Fashion Lover!";
      break;
    case (hour >= 12 && hour < 18):
      greeting = " Good afternoon, stay stylish!";
      break;
    case (hour >= 18 && hour < 23):
      greeting = " Good evening, shine bright!";
      break;
    default:
      greeting = " Time to rest, queen of fashion!";
  }

  greetingBox.textContent = greeting;
});




document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("soundBtn");
  if (!btn) return;
  const sound = new Audio("images/click.wav"); 
  btn.addEventListener("click", () => {
    sound.currentTime = 0;
    sound.play();
  });
});
