document.addEventListener("DOMContentLoaded", ()=>{
    const form=document.getElementById("voteForm");
    const nameInput=form.querySelector("[name='name']");
    const daySelect=form.querySelector("[name='favday']");
    const commentInput=form.querySelector("[name='comment']");

    function showError(input,message){
        const small=input.nextElementSibling;
        small.textContent=message;
        small.style.color="#b00020";
        input.style.borderColor="#b00020";
    }

    function clearError(input){
        const small=input.nextElementSibling;
        small.textContent="";
        input.style.borderColor="#ccc";
    }

    form.addEventListener("submit", (e)=>{
        e.preventDefault();
        let isValid=true;

        if (nameInput.value.trim()===""){
            showError(nameInput,"please enter your name");
            isValid=false;
        }
        else{
            clearError(nameInput);
        }


        if (daySelect.value===""){
            showError(daySelect,"please select a day");
            isValid=false;
        }
        else{
            clearError(daySelect);
        }


        if (commentInput.value.trim()===""){
            showError(commentInput, "write at least 5 characters");
            isValid=false;
        }
        else{
            clearError(commentInput);
        }


        if (isValid){
            alert("thank you for your favorite");
            form.reset();
        }
        
    });

    [nameInput, daySelect, commentInput].forEach((field)=>{
        field.addEventListener("input", ()=>clearError(field));
    });

});














document.addEventListener("DOMContentLoaded",()=>{
    const ratingWrap=document.getElementById("weekRating");
    const starContainers=document.getElementsByClassName("stars");
    const stars=document.querySelectorAll("#weekRating .star");
    const buttons = document.getElementsByTagName("button");
    const hiddenInput=document.querySelector("#ratingValue"); 

    let currentRating = 0;

  stars.forEach((star, idx) => {
    star.addEventListener("mouseenter", () => {
      stars.forEach((s, i) => s.classList.toggle("hover", i <= idx));
    });
    star.addEventListener("mouseleave", () => {
      stars.forEach(s => s.classList.remove("hover"));
    });
  });

  stars.forEach((star, idx) => {
    star.addEventListener("click", () => {
      currentRating = idx + 1; 
      hiddenInput.value = String(currentRating);
      stars.forEach((s, i) => s.classList.toggle("selected", i < currentRating));
    });
  });
});







document.addEventListener("DOMContentLoaded",()=>{
    const btn=document.getElementById("changeTextBtn");
    const message =document.getElementById("messageText");

    btn.addEventListener("click",()=>{
        message.textContent="you are amazing!";
        message.innerHTML+="<br><small>you are amazing<small>";
        console.log(message.innerText);
    })
});




document.addEventListener("DOMContentLoaded", () => {
  const themeBtn = document.getElementById("changeTheme");
  const body = document.body;

  if (localStorage.getItem("theme") === "night") {
    body.classList.add("night");
    themeBtn.textContent = "Light Mode";
    themeBtn.classList.replace("btn-dark", "btn-light");
  }

  themeBtn.addEventListener("click", () => {
    const isNight = body.classList.toggle("night");

    if (isNight) {
      themeBtn.textContent = "Light Mode";
      themeBtn.classList.replace("btn-dark", "btn-light");
      localStorage.setItem("theme", "night");
    } else {
      themeBtn.textContent = "Dark Mode";
      themeBtn.classList.replace("btn-light", "btn-dark");
      localStorage.setItem("theme", "day");
    }
  });
});




const quoteArea = document.querySelector('.quote-area');
const newQuoteBtn = document.querySelector('#new-quote-btn');
const localQuotes = [
  "Fashion is the armor to survive the reality of everyday life. — Bill Cunningham",
  "Style is a way to say who you are without having to speak. — Rachel Zoe",
  "Simplicity is the keynote of all true elegance. — Coco Chanel",
  "In order to be irreplaceable one must always be different. — Coco Chanel",
  "Creativity is intelligence having fun. — Albert Einstein",
  "Elegance is not standing out, but being remembered. — Giorgio Armani",
];

async function loadNewQuote() {
  quoteArea.textContent = 'Loading…';
  try {
    const res = await fetch('https://api.quotable.io/random?tags=famous-quotes|inspirational');
    if (!res.ok) throw new Error('API error');

    const data = await res.json();
    const text = `${data.content} — ${data.author}`;
    quoteArea.textContent = text;

  } catch (err) {
    const fallback = localQuotes[Math.floor(Math.random() * localQuotes.length)];
    quoteArea.textContent = fallback;
  }
}

if (newQuoteBtn && quoteArea) {
  newQuoteBtn.addEventListener('click', loadNewQuote);
}





const timeDisplay = document.querySelector('#timeDisplay');
const showTimeBtn = document.querySelector('#showTimeBtn');

if (showTimeBtn && timeDisplay) {
  showTimeBtn.addEventListener('click', () => {
    const currentTime = new Date().toLocaleTimeString();
    timeDisplay.textContent = currentTime;
  });
}


