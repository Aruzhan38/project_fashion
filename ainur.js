document.addEventListener("DOMContentLoaded", () => {
  Theme.init();          
  Accordion.init();     
  Rating.init();         
  FormEnhance.init();  
  Closet.init();       
  UX.init();             
});

/* const Theme = (() => {
  const STORAGE = "fl-theme";        
  const BTN_ID  = "themeToggle";    

  function apply(mode) {
    document.documentElement.setAttribute("data-theme", mode);
    document.body.classList.toggle("theme-dark", mode === "dark");

    const btn = document.getElementById(BTN_ID);
    if (btn) {
      const isDark = mode === "dark";
      btn.setAttribute("aria-pressed", String(isDark));
      btn.textContent = isDark ? "☀️" : "🌙";
      btn.title = isDark ? "Switch to light" : "Switch to dark";
      btn.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    }
  }

  function init() {
    const saved = localStorage.getItem(STORAGE) || "light";
    apply(saved);

    const btn = document.getElementById(BTN_ID);
    if (!btn) return;
    btn.addEventListener("click", () => {
      const next = (localStorage.getItem(STORAGE) || "light") === "light" ? "dark" : "light";
      localStorage.setItem(STORAGE, next);
      apply(next);
      UX.beep(90, 660);
      UX.pop(btn);
    });
  }

  return { init };
})(); */

const Accordion = (() => {
  function init(root = document) {
    const items = [...root.querySelectorAll("[data-accordion]")];
    items.forEach(item => {
      const btn   = item.querySelector(".faq-btn");
      const panel = item.querySelector(".faq-panel");
      if (!btn || !panel) return;

      btn.setAttribute("aria-expanded", "false");
      panel.style.maxHeight = "0px";

      btn.addEventListener("click", () => {
        const willOpen = btn.getAttribute("aria-expanded") !== "true";

        items.forEach(other => {
          const ob = other.querySelector(".faq-btn");
          const op = other.querySelector(".faq-panel");
          if (!ob || !op) return;
          ob.setAttribute("aria-expanded", "false");
          op.style.maxHeight = "0px";
        });

        if (willOpen) {
          btn.setAttribute("aria-expanded", "true");
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
        UX.beep(120);
        UX.pop(panel);
      });
    });
  }
  return { init };
})();

const Rating = (() => {
  function init() {
    const wrap = document.getElementById("rating");
    if (!wrap) return;
    const stars = [...wrap.querySelectorAll(".star")];
    const msg = document.getElementById("ratingMsg");
    const saved = Number(localStorage.getItem("fl-rating") || 0);
    if (saved) render(saved);

    stars.forEach(star => {
      star.addEventListener("click", () => {
        const v = Number(star.dataset.value);
        localStorage.setItem("fl-rating", String(v));
        render(v);
        UX.beep(120, 520);
        UX.pop(wrap);
      });
    });

    function render(val) {
      stars.forEach(s => {
        const cur = Number(s.dataset.value);
        const active = cur <= val;
        s.classList.toggle("active", active);
        s.setAttribute("aria-pressed", String(active));
      });
      if (msg) {
        msg.textContent = val ? `Thanks! You rated this page ${val}/5.` : "";
        msg.classList.toggle("visually-hidden", !val);
      }
    }
  }
  return { init };
})();

const FormEnhance = (() => {
  function init() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const status  = document.getElementById("formStatus");
    const resetBn = document.getElementById("formReset");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }
      const submitBtn = form.querySelector('button[type="submit"]');
      const original = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner"></span>Please wait…`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = original;
        form.classList.remove("was-validated");
        form.reset();
        if (status) {
          status.textContent = "Submitted successfully";
          status.classList.remove("visually-hidden");
        }
        UX.beep(120, 700);
        UX.pop(form);
        UX.toast("Form submitted successfully", "success");
      }, 1000);
    });

    resetBn?.addEventListener("click", () => {
      form.reset();
      form.classList.remove("was-validated");
      if (status) { status.textContent = "Form cleared."; status.classList.remove("visually-hidden"); }
      UX.beep(90, 440);
      UX.pop(resetBn);
    });
  }
  return { init };
})();

const Closet = (() => {
  let TEXT_ITEMS = [];

  function collectTextItems() {
    const items = [];
    document.querySelectorAll(".item img, .card .card-text h3, .card .card-title, .faq-btn, h1,h2,h3")
      .forEach(el => {
        const text = (el.getAttribute("alt") || el.textContent || "").trim();
        if (text) items.push(text);
      });
    return [...new Set(items)];
  }

  function initSearch() {
    const input = document.getElementById("liveSearch");
    const suggest = document.getElementById("autoSuggest");
    if (!input || !suggest) return;

    const filterSel = input.dataset.filterTarget || ".item, .card";

    function filter(q) {
      const targets = document.querySelectorAll(filterSel);
      if (!q) { targets.forEach(t => t.style.display = ""); return; }
      const qq = q.toLowerCase();
      targets.forEach(t => {
        const imgAlt = t.querySelector("img[alt]")?.getAttribute("alt");
        const title  = t.querySelector(".card-text h3, .card-title")?.textContent;
        const txt = (imgAlt || title || t.textContent || "").toLowerCase();
        t.style.display = txt.includes(qq) ? "" : "none";
      });
    }

    function buildSuggestions(q) {
      suggest.innerHTML = "";
      if (!q) { suggest.style.display = "none"; return; }
      const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      const matches = TEXT_ITEMS.filter(t => rx.test(t)).slice(0, 8);
      if (!matches.length) { suggest.style.display = "none"; return; }
      matches.forEach(t => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.role = "option";
        btn.textContent = t;
        btn.addEventListener("click", () => {
          input.value = t;
          filter(t);
          suggest.style.display = "none";
          UX.toast(`Filtered by “${t}”`, "success");
        });
        suggest.appendChild(btn);
      });
      suggest.style.display = "block";
    }

    input.addEventListener("input",  () => { filter(input.value); buildSuggestions(input.value.trim()); });
    input.addEventListener("focus",  () => { buildSuggestions(input.value.trim()); });
    document.addEventListener("click", (e) => { if (!e.target.closest(".search-wrap")) suggest.style.display = "none"; });
  }

  function init() {
    TEXT_ITEMS = collectTextItems();
    initSearch();
  }
  return { init };
})();

document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".num");
  const speed = 180; 

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute("data-target");
      const updateCount = () => {
        const current = +counter.innerText;
        const increment = Math.ceil(target / speed);
        if (current < target) {
          counter.innerText = current + increment;
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = target;
        }
      };
      updateCount();
    });
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(document.querySelector(".stats"));
});