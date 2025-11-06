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
  const btn = document.getElementById("soundBtn");
  if (!btn) return;
  const sound = new Audio("images/click.wav"); 
  btn.addEventListener("click", () => {
    sound.currentTime = 0;
    sound.play();
  });
});



$(document).ready(function(){ 
console.log("jQuery is ready!"); 
}); 


$(function(){
  const pool = [];
  $('.link-list a').each(function(){ pool.push($(this).text().trim()); });

  $('#brandSearch').on('keyup', function(){
    const q = $(this).val().toLowerCase();
    const $list = $('#brandSuggestions').empty();

    const hits = pool.filter(v => v.toLowerCase().includes(q)).slice(0,8);

    if(q && hits.length){
      hits.forEach(v => $list.append('<li>'+v+'</li>'));
      $list.show();
    } else {
      $list.hide();
    }
  });
  $('#brandSuggestions').on('click', 'li', function(){
    $('#brandSearch').val($(this).text());
    $('#brandSuggestions').hide();
  });
});









$(function () {
  const $form   = $('#voteForm');
  const $submit = $('#voteForm button[type="submit"]');
  const normal  = $submit.html(); 
  $form.on('submit', function (e) {
    e.preventDefault();                  
    if ($submit.prop('disabled')) return;  
    $submit
      .prop('disabled', true)
      .attr('aria-busy', 'true')
      .html('<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Please wait…');
    setTimeout(function () {
      $submit
        .prop('disabled', false)
        .removeAttr('aria-busy')
        .html(normal);
      $form[0].reset();
      alert('Submitted!');
    }, 1500); 
  });
});







function notify(message, type = 'info', duration = 2000) {
  if (!$('#toasts').length) {
    $('body').append('<div id="toasts"></div>');
  }

  const $toast = $('<div class="toast-mini ' + type + '">' + message + '</div>');
  $('#toasts').append($toast);

  $toast.fadeIn(300);

  setTimeout(function(){
    $toast.fadeOut(400, function(){ $(this).remove(); });
  }, duration);
}
notify('Form submitted successfully!', 'success');









$(function(){
  $('#copyBtn').on('click', function(){
    const text = $('#copyText').text();
    navigator.clipboard.writeText(text); 
    const $btn = $(this);
    $btn.text('✓ Copied'); 
    $btn.addClass('show-tip');
    setTimeout(function(){
      $btn.text('Copy');
      $btn.removeClass('show-tip');
    }, 2000);
  });
});












$(function(){
  const $lazyImages = $('img.lazy');
  function loadVisibleImages() {
    const windowBottom = $(window).scrollTop() + $(window).height();
    $lazyImages.each(function(){
      const $img = $(this);
      if ($img.attr('src')) return;
      const imgTop = $img.offset().top;
      if (imgTop < windowBottom + 100) { 
        $img.attr('src', $img.data('src'));
        $img.on('load', function(){
          $img.addClass('loaded');
        });
      }
    });
  }
  $(window).on('scroll resize', loadVisibleImages);
  loadVisibleImages(); 
});




document.addEventListener('DOMContentLoaded', () => {
  const palette = document.querySelector('.palette.no-js');
  if(!palette) return;

  const form    = palette.querySelector('.swatch-picker');
  const preview = palette.querySelector('.preview');
  const sample  = palette.querySelector('.sample');
  const hexOut  = palette.querySelector('.hex');

  const getActiveHex = () =>
    getComputedStyle(preview).getPropertyValue('--active').trim().toLowerCase();

  const apply = () => {
    const hex = getActiveHex();
    hexOut.textContent = hex || '#000000';
    sample.style.background = hex || '#000000';
  };

  apply();
  form.addEventListener('change', e => { if(e.target.name==='pick') apply(); });
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