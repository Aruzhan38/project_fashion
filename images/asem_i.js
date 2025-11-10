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



const UNSPLASH_KEY = "LmjADpyoYIAxdq997ux5YZTZGWfpZdcPHcnk0SMNFwg"; 

const SWATCHES = [
  {hex:"#ef4444", bucket:"red", keyword:"red"},
  {hex:"#dc2626", bucket:"red", keyword:"crimson"},
  {hex:"#f59e0b", bucket:"orange", keyword:"orange"},
  {hex:"#fde047", bucket:"yellow", keyword:"yellow"},
  {hex:"#84cc16", bucket:"green", keyword:"lime"},
  {hex:"#22c55e", bucket:"green", keyword:"green"},
  {hex:"#14b8a6", bucket:"teal", keyword:"teal"},
  {hex:"#06b6d4", bucket:"teal", keyword:"cyan"},
  {hex:"#38bdf8", bucket:"blue", keyword:"sky"},
  {hex:"#3b82f6", bucket:"blue", keyword:"blue"},
  {hex:"#6366f1", bucket:"blue", keyword:"indigo"},
  {hex:"#8b5cf6", bucket:"purple", keyword:"violet"},
  {hex:"#a855f7", bucket:"purple", keyword:"purple"},
  {hex:"#db2777", bucket:"magenta", keyword:"magenta"},
  {hex:"#f472b6", bucket:"pink", keyword:"pink"},
  {hex:"#111827", bucket:"black", keyword:"charcoal"},
  {hex:"#d4d4d8", bucket:"gray", keyword:"minimalist"},
  {hex:"#92400e", bucket:"brown", keyword:"autumn fashion"},
  {hex:"#fef3c7", bucket:"white", keyword:"cream outfit"},
  {hex:"#065f46", bucket:"green", keyword:"forest fashion"}
];


const root = document.querySelector(".section-box.palette");
const form = root.querySelector(".swatch-picker");
const hexOut = root.querySelector(".hex");
const sample = root.querySelector(".sample");
const gradient = root.querySelector(".gradient-demo");
const pins = document.getElementById("pins");

applySpectrum();

document.getElementById("genPalette")?.addEventListener("click", applySpectrum);

root.querySelectorAll(".swatch").forEach((lbl, i) => {
  lbl.addEventListener("click", () => selectIndex(i, true));
});

const savedHex = load("lookbook_hex");
const startIndex = savedHex ? SWATCHES.findIndex(s => eqHex(s.hex, savedHex)) : 0;
selectIndex(startIndex >= 0 ? startIndex : 0, false);


function applySpectrum(){
  SWATCHES.forEach((s, i) => {
    const idx = i+1;
    root.style.setProperty(`--c${idx}`, s.hex);
    const lbl = root.querySelector(`.s${idx}`);
    if (lbl) lbl.setAttribute("aria-label", s.hex);
  });
  gradient.style.background = `linear-gradient(90deg, ${SWATCHES[0].hex}, ${SWATCHES[9].hex}, #111827)`;
}

async function selectIndex(i, persist){
  const s = SWATCHES[i] || SWATCHES[0];
  const hex = s.hex;
  form.querySelectorAll("input[name='pick']")[i]?.click();
  hexOut.textContent = hex;
  sample.style.background = hex;
  if (persist) save("lookbook_hex", hex);

  await loadPinsWithFixed(s);
}

async function loadPinsWithFixed(swatch){
  if (!UNSPLASH_KEY || UNSPLASH_KEY.includes("YOUR_")) {
    pins.innerHTML = warn("Add your Unsplash Access Key in palette.js");
    return;
  }
  skeletons(10);

  const page = pageFromHex(swatch.hex, 10);

  let items = await searchUnsplash({
    query: `fashion ${swatch.keyword} outfit lookbook`,
    color: swatch.bucket,
    page,
    order: "relevant"
  });

  if (!items.length) {
    items = await searchUnsplash({
      query: `fashion ${swatch.keyword} outfit`, page, order:"relevant"
    });
  }
  if (!items.length) {
    for (const c of neighborColors(swatch.bucket)) {
      items = await searchUnsplash({
        query: `fashion ${swatch.keyword}`, color:c, page, order:"latest"
      });
      if (items.length) break;
    }
  }
  renderPins(items);
}

async function searchUnsplash({ query, color, page=1, order="relevant" }){
  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("client_id", UNSPLASH_KEY);
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "30");
  url.searchParams.set("page", String(page));
  url.searchParams.set("order_by", order);
  url.searchParams.set("content_filter", "high");
  if (color) url.searchParams.set("color", color);

  const res = await fetch(url, { headers: { "Accept-Version":"v1" }});
  if (!res.ok) throw new Error(res.status + " " + res.statusText);
  const data = await res.json();
  return data.results || [];
}

function neighborColors(c){
  switch(c){
    case "purple": return ["magenta","blue"];
    case "magenta":return ["purple","red"];
    case "red":    return ["orange","magenta"];
    case "orange": return ["red","yellow"];
    case "yellow": return ["orange","green"];
    case "green":  return ["teal","yellow"];
    case "teal":   return ["green","blue"];
    case "blue":   return ["teal","purple"];
    case "white":  return ["black"];
    case "black":  return ["white"];
    default:       return ["red","purple","blue"];
  }
}

function renderPins(items){
  if(!items.length){ pins.innerHTML = warn("No images for this shade. Try another color."); return; }
  pins.innerHTML = "";
  items.forEach((ph,i)=>{
    const el = document.createElement("article");
    el.className = "pin"; el.style.animationDelay = (i*28)+"ms";
    el.innerHTML = `
      <img src="${ph.urls.small}" alt="${escapeHtml(ph.alt_description||'fashion')}">
      <div class="info">
        <span>${escapeHtml(ph.user.name||'Photographer')}</span>
        <a href="${ph.links.html}" target="_blank" rel="noreferrer">Unsplash ↗</a>
      </div>`;
    pins.appendChild(el);
  });
}

function pageFromHex(hex, max=10){ let h=0; for(let i=0;i<hex.length;i++) h=(h*31+hex.charCodeAt(i))>>>0; return (h%max)+1; }
function warn(msg){ return `<div class="pin warn" style="padding:14px;color:#e5e7eb">${msg}</div>`; }
function skeletons(n){ pins.innerHTML=""; for(let i=0;i<n;i++){const d=document.createElement("div"); d.className="skel"; pins.appendChild(d);} }
function save(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
function load(k){ try{ return JSON.parse(localStorage.getItem(k)); }catch{ return null; } }
function eqHex(a,b){ return a.toLowerCase()===b.toLowerCase(); }
function escapeHtml(s){ return s?.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))||""; }
