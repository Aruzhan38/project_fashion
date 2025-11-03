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
  const colors = ["#f8e9ec","#f6f0f5","#fdf6f0","#f3e8ee","#ece6eb","#60363a"];
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
  state: { closet: [], rating: 0, audioCtx: null },

  methods: {
    $(sel, parent = document)  { return parent.querySelector(sel); },
    $all(sel, parent = document){ return [...parent.querySelectorAll(sel)]; },

    beep(durationMs = 120, freq = 880, type = "sine", volume = 0.08) {
      try {
        const ctx = FL.state.audioCtx ?? new (window.AudioContext || window.webkitAudioContext)();
        FL.state.audioCtx = ctx;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = type; o.frequency.value = freq; g.gain.value = volume;
        o.connect(g); g.connect(ctx.destination);
        o.start();
        setTimeout(() => { o.stop(); o.disconnect(); g.disconnect(); }, durationMs);
      } catch (_) {}
    },

    pop(el) {
      if (!el) return;
      el.classList.remove("pop"); void el.offsetWidth;
      el.classList.add("pop");
      setTimeout(() => el.classList.remove("pop"), 220);
    },

    // === Theme Toggle with LocalStorage (Part 3) ===
    initThemeToggle() {
      const btn = FL.methods.$("#theme-toggle");
      if (!btn) return;
      const apply = (mode) => {
        document.documentElement.setAttribute("data-theme", mode);
        btn.textContent = mode === "dark" ? "Light" : "Night";
        btn.setAttribute("aria-pressed", String(mode === "dark"));
      };
      const saved = localStorage.getItem("fl-theme") || "light";
      apply(saved);
      btn.addEventListener("click", () => {
        const next = (localStorage.getItem("fl-theme") || "light") === "light" ? "dark" : "light";
        localStorage.setItem("fl-theme", next);
        apply(next);
        FL.methods.pop(btn); FL.methods.beep(90, 660);
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
      const tops    = FL.state.closet.filter(i => i.type === "top").slice(0, 3);
      const bottoms = FL.state.closet.filter(i => i.type === "bottom").slice(0, 2);
      const shoes   = FL.state.closet.filter(i => i.type === "shoes").slice(0, 1);

      const sec = document.querySelector("#recommend");
      if (!sec) return;
      const ul = sec.querySelector(".capsule-list");
      if (!ul) return;

      ul.innerHTML = "";
      [...tops, ...bottoms, ...shoes].forEach(item => {
        const li = document.createElement("li");
        li.textContent = `• ${item.title}`;
        li.style.margin = "6px 0";
        ul.appendChild(li);
      });
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
          render(v); FL.methods.beep(120, 520); FL.methods.pop(wrap);
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
    },

    initForm() {
      const form = FL.methods.$("#contactForm");
      if (!form) return;
      const status = FL.methods.$("#formStatus");
      const resetBtn = FL.methods.$("#formReset");

      // Bootstrap validation UX
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
          form.classList.add("was-validated");
          return;
        }
        // Имитация отправки + статус
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
          FL.methods.beep(120, 700); FL.methods.pop(form);
          toast("Form submitted successfully", "success");
        }, 1200);
      });

      resetBtn?.addEventListener("click", () => {
        form.reset(); form.classList.remove("was-validated");
        if (status) { status.textContent = "Form cleared."; status.classList.remove("visually-hidden"); }
        FL.methods.beep(90, 440); FL.methods.pop(resetBtn);
      });
    },

    initBoops() {
      const tappables = FL.methods.$all(".item, .card, .pill, .btn");
      tappables.forEach(el => el.addEventListener("click", () => {
        FL.methods.pop(el); FL.methods.beep(80, 600);
      }));
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

// ===== jQuery UX Addons =====
$(function () {
  // Scroll progress
  const $bar = $("#scrollProgress .bar");
  const onScroll = () => {
    const h = $(document).height() - $(window).height();
    const p = h > 0 ? (window.scrollY / h) * 100 : 0;
    $bar.css("width", p + "%");
  };
  $(document).on("scroll", onScroll); onScroll();

  // Сбор текстов для подсказок
  function collectTextItems() {
    const items = [];
    $(".item img, .card .card-text h3, .card .card-title, .faq-btn, h1,h2,h3").each(function () {
      const $el = $(this);
      const text = ($el.attr("alt") || $el.text() || "").trim();
      if (text) items.push({ text, $el });
    });
    return items;
  }
  const TEXT_ITEMS = collectTextItems();

  // Toast helper
  function toast(msg, type = "info", timeout = 2200) {
    const $t = $(`<div class="toast ${type}">${msg}</div>`);
    $("#toastStack").append($t);
    requestAnimationFrame(() => $t.addClass("show"));
    setTimeout(() => { $t.removeClass("show"); setTimeout(() => $t.remove(), 300); }, timeout);
  }
  window.toast = toast;

  // Live Filter
  const $live = $("#liveSearch");
  const filterSel = $live.data("filter-target") || ".item, .card";
  $live.on("keyup input", function () {
    const q = $(this).val().toString().toLowerCase().trim();
    const $targets = $(filterSel);
    if (!q) { $targets.show(); return; }
    $targets.each(function () {
      const $t = $(this);
      const txt =
        $t.find("img[alt]").attr("alt") ||
        $t.find(".card-text h3,.card-title").first().text() ||
        $t.text();
      $t.toggle((txt || "").toLowerCase().includes(q));
    });
  });

  // Autocomplete
  const $suggest = $("#autoSuggest");
  function buildSuggestions(q) {
    $suggest.empty();
    if (!q) return $suggest.hide();
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const matches = TEXT_ITEMS.map(o => o.text).filter((t,i,arr) => rx.test(t) && arr.indexOf(t) === i).slice(0, 8);
    if (!matches.length) return $suggest.hide();
    matches.forEach(t => {
      const $btn = $(`<button type="button" role="option"></button>`).text(t);
      $btn.on("click", () => { $live.val(t).trigger("input"); $suggest.hide(); toast(`Filtered by “${t}”`, "success"); });
      $suggest.append($btn);
    });
    $suggest.show();
  }
  $live.on("input focus", function () { buildSuggestions($(this).val().trim()); });
  $(document).on("click", function (e) { if (!$(e.target).closest(".search-wrap").length) $suggest.hide(); });

  // Highlight
  function clearMarks(root = document) { $(root).find("mark.hl").each(function () { $(this).replaceWith($(this).text()); }); }
  function highlightAll(q, root = document) {
    if (!q) return;
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    $(".faq, .card, main, .quotes").contents().each(function deep() {
      if (this.nodeType === 3) {
        const text = this.nodeValue;
        if (rx.test(text)) {
          const html = text.replace(rx, m => `<mark class="hl">${m}</mark>`);
          $(this).replaceWith(html);
        }
      } else if (this.nodeType === 1 && !$(this).is("script,style,mark")) {
        $(this).contents().each(deep);
      }
    });
  }
  $("#highlightBtn").on("click", function () {
    const q = $("#highlightInput").val().trim();
    clearMarks(document); if (!q) return;
    highlightAll(q, document); toast(`Highlighted “${q}”`, "info");
  });
  $("#clearHighlight").on("click", function () { clearMarks(document); });

  // Animated counters
  $("[data-count]").each(function () {
    const $el = $(this);
    const target = parseFloat($el.data("count"));
    const dur = 1200; const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      $el.text(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

  // Click toasts on items/cards
  $(".item, .card").on("click", function () {
    const name = $(this).find("img[alt]").attr("alt") || $(this).find(".card-text h3").text() || "Item";
    toast(`“${name}” viewed`, "info");
  });

  // Copy to Clipboard
  $(".copy-btn").on("click", function () {
    const sel = $(this).data("copy-target");
    const $src = $(sel);
    if (!$src.length) return;
    const text = $src.text().trim();
    navigator.clipboard.writeText(text).then(() => {
      $(this).addClass("copied").text("Copied ✓");
      toast("Copied to clipboard!", "success");
      setTimeout(() => $(this).removeClass("copied").text("Copy"), 1200);
    }).catch(() => toast("Copy failed", "error"));
  });

  // Lazy load fallback (IntersectionObserver вариант можно оставить как есть у тебя, если нужен)
});

document.addEventListener("DOMContentLoaded", () => {
  setupAccordion();
  setupBgColorCycler();
  initThemeToggle();
  initFormEnhance();
  initScrollBar();
  initPauseHover();
  setActiveNav();              // <= добавили
});

function setActiveNav() {
  // текущий файл: 'about.html', 'index.html' и т.п.
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  document.querySelectorAll(".navbar-nav .nav-link").forEach(a => {
    // нормализуем href (может быть относительным)
    const href = (a.getAttribute("href") || "").split("?")[0].split("#")[0].toLowerCase();

    // index: и /, и index.html считаем одним и тем же
    const isIndex = current === "" || current === "index.html";
    const linkIsIndex = href === "" || href === "index.html" || href === "./" || href === "/";

    const match = (isIndex && linkIsIndex) || href === current;

    a.classList.toggle("active", match);
    a.classList.toggle("pill", match);
    if (match) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  });
}
