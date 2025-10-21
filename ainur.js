document.addEventListener("DOMContentLoaded", () => {
  setupAccordion();
  setupBgColorCycler();
  FL.init();            
});

function setupAccordion(root = document) {
  const items = root.querySelectorAll("[data-accordion]");
  items.forEach(item => {
    const btn = item.querySelector(".faq-btn");
    const panel = item.querySelector(".faq-panel");

    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      panel.style.maxHeight = open ? "0px" : panel.scrollHeight + "px";
      FL.methods.pop(panel);       
      FL.methods.beep(120);        
    });
  });

  const first = items[0];
  if (first) {
    const btn = first.querySelector(".faq-btn");
    const panel = first.querySelector(".faq-panel");
    btn.setAttribute("aria-expanded", "true");
    panel.style.maxHeight = panel.scrollHeight + "px";
  }
}

function setupBgColorCycler() {
  const colors = ["#f8e9ec","#f6f0f5","#fdf6f0","#f3e8ee","#ece6eb","#60363aff"];
  let i = 0;
  const btn = document.getElementById("bg-color-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    document.body.style.transition = "background-color .35s ease";
    document.body.style.backgroundColor = colors[i];
    i = (i + 1) % colors.length;
    FL.methods.pop(btn);        
    FL.methods.beep(100);       
  });
}

const FL = {
  state: {
    closet: [],             
    rating: 0,
    audioCtx: null
  },

  methods: {
    $(sel, parent = document)  { return parent.querySelector(sel); },
    $all(sel, parent = document){ return [...parent.querySelectorAll(sel)]; },
    beep(durationMs = 120, freq = 880, type = "sine", volume = 0.08) {
      try {
        const ctx = FL.state.audioCtx ?? new (window.AudioContext || window.webkitAudioContext)();
        FL.state.audioCtx = ctx;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = type;
        o.frequency.value = freq;
        g.gain.value = volume;
        o.connect(g); g.connect(ctx.destination);
        o.start();
        setTimeout(() => { o.stop(); o.disconnect(); g.disconnect(); }, durationMs);
      } catch (_) {}
    },

    pop(el) {
      if (!el) return;
      el.classList.remove("pop");
      void el.offsetWidth;
      el.classList.add("pop");
      setTimeout(() => el.classList.remove("pop"), 220);
    },

    initThemeToggle() {
      const btn = FL.methods.$("#theme-toggle");
      if (!btn) return;
      const apply = (mode) => {
        document.documentElement.dataset.theme = mode; 
        btn.textContent = mode === "dark" ? "Light" : "Night";
        btn.setAttribute("aria-pressed", String(mode === "dark"));
      };
      const saved = localStorage.getItem("fl-theme") || "light";
      apply(saved);
      btn.addEventListener("click", () => {
        const mode = (localStorage.getItem("fl-theme") || "light") === "light" ? "dark" : "light";
        localStorage.setItem("fl-theme", mode);
        apply(mode);
        FL.methods.pop(btn);
        FL.methods.beep(90, 660);
      });
    },

    collectCloset() {
      const imgs = FL.methods.$all(".item img, #shoes .card img");
      FL.state.closet = imgs.map(img => {
        const title = img.alt?.trim() || "Item";
        const src = img.currentSrc || img.src;
        const lower = title.toLowerCase();
        const type = lower.includes("heel") || lower.includes("sneaker") || lower.includes("boot")
          ? "shoes"
          : (lower.includes("trouser") || lower.includes("jeans") || lower.includes("skirt"))
            ? "bottom" : "top";
        return { title, src, type };
      });
    },

    renderRecommendations() {
      if (!FL.state.closet.length) return;
      // HOF: filter shoes + map tops
      const tops    = FL.state.closet.filter(i => i.type === "top").slice(0, 3);
      const bottoms = FL.state.closet.filter(i => i.type === "bottom").slice(0, 2);
      const shoes   = FL.state.closet.filter(i => i.type === "shoes").slice(0, 1);

      let sec = document.getElementById("recommend");
      if (!sec) {
        sec = document.createElement("section");
        sec.id = "recommend";
        sec.className = "container section";
        sec.innerHTML = `
          <h2 class="section-title center">Recommended Capsule</h2>
          <p class="center muted">Auto-picked from items already on this page.</p>
          <ul class="capsule-list"></ul>
        `;
        const anchor = document.querySelector(".quotes") || document.querySelector("footer");
        anchor?.parentNode?.insertBefore(sec, anchor.nextSibling);
      }

      const ul = sec.querySelector(".capsule-list");
      ul.innerHTML = "";

      const pack = [...tops, ...bottoms, ...shoes];
      for (let i = 0; i < pack.length; i++) {
        const li = document.createElement("li");
        li.textContent = `• ${pack[i].title}`;
        li.style.margin = "6px 0";
        ul.appendChild(li);
      }
    },

    initRating() {
      const wrap = FL.methods.$("#rating");
      if (!wrap) return;
      const stars = FL.methods.$all(".star", wrap);
      const msg = FL.methods.$("#ratingMsg");
      const saved = Number(localStorage.getItem("fl-rating") || 0);
      if (saved) render(saved);

      stars.forEach(star => {
        star.addEventListener("click", () => {
          const v = Number(star.dataset.value);
          localStorage.setItem("fl-rating", String(v));
          render(v);
          FL.methods.beep(120, 520);
          FL.methods.pop(wrap);
        });
      });

      function render(val) {
        stars.forEach(s => {
          const cur = Number(s.dataset.value);
          s.classList.toggle("active", cur <= val);
          s.setAttribute("aria-pressed", String(cur <= val));
        });
        if (msg) {
          msg.textContent = val ? `Thanks! You rated this page ${val}/5.` : "";
          msg.classList.toggle("visually-hidden", !val);
        }
      }
    },

    initForm() {
      const form = FL.methods.$("#contactForm");
      if (!form) return;
      const status = FL.methods.$("#formStatus");
      const resetBtn = FL.methods.$("#formReset");

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!form.reportValidity()) return;
        if (status) {
          status.textContent = "Submitted successfully ✅";
          status.classList.remove("visually-hidden");
        }
        FL.methods.beep(120, 700);
        FL.methods.pop(form);
        form.reset();
      });

      resetBtn?.addEventListener("click", () => {
        form.reset();
        if (status) {
          status.textContent = "Form cleared.";
          status.classList.remove("visually-hidden");
        }
        FL.methods.beep(90, 440);
        FL.methods.pop(resetBtn);
      });
    },

    initBoops() {
      const tappables = FL.methods.$all(".item, .card, .pill, .btn");
      tappables.forEach(el => {
        el.addEventListener("click", () => {
          FL.methods.pop(el);
          FL.methods.beep(80, 600);
        });
      });
    }
  },

  init() {
    this.methods.initThemeToggle();
    this.methods.collectCloset();
    this.methods.renderRecommendations();
    this.methods.initRating();
    this.methods.initForm();
    this.methods.initBoops();
  }
};
