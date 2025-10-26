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
          status.textContent = "Submitted successfully";
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

// ========== UX Addons (jQuery) ==========
$(function () {
  // ---------------- Task 4: Scroll Progress ----------------
  const $bar = $("#scrollProgress .bar");
  const onScroll = () => {
    const h = $(document).height() - $(window).height();
    const p = h > 0 ? (window.scrollY / h) * 100 : 0;
    $bar.css("width", p + "%");
  };
  $(document).on("scroll", onScroll);
  onScroll();

  // Collect searchable items (titles/alt/text) once per page
  const collectTextItems = () => {
    const items = [];
    // anything visual with title: .item (images), .card (cards), faq buttons, headings
    $(".item img, .card .card-text h3, .card .card-title, .faq-btn, h1,h2,h3").each(function () {
      const $el = $(this);
      const text = ($el.attr("alt") || $el.text() || "").trim();
      if (text) items.push({ text, $el });
    });
    return items;
  };
  const TEXT_ITEMS = collectTextItems();

  // Helper: show toast
  function toast(msg, type = "info", timeout = 2200) {
    const $t = $(`<div class="toast ${type}">${msg}</div>`);
    $("#toastStack").append($t);
    requestAnimationFrame(() => $t.addClass("show"));
    setTimeout(() => {
      $t.removeClass("show");
      setTimeout(() => $t.remove(), 300);
    }, timeout);
  }

  // ---------------- Task 1: Live Filter (keyup) ----------------
  // Filters anything matching selector in data-filter-target (default .item,.card)
  const $live = $("#liveSearch");
  const filterSel = $live.data("filter-target") || ".item, .card";
  $live.on("keyup input", function () {
    const q = $(this).val().toString().toLowerCase().trim();
    const $targets = $(filterSel);
    if (!q) {
      $targets.show();
      return;
    }
    $targets.each(function () {
      const $t = $(this);
      // text source: alt for images, text() otherwise
      const txt =
        $t.find("img[alt]").attr("alt") ||
        $t.find(".card-text h3,.card-title").first().text() ||
        $t.text();
      $t.toggle(txt.toLowerCase().includes(q));
    });
  });

  // ---------------- Task 2: Autocomplete Suggestions ----------------
  const $suggest = $("#autoSuggest");
  function buildSuggestions(q) {
    $suggest.empty();
    if (!q) return $suggest.hide();
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const matches = TEXT_ITEMS
      .map(o => o.text)
      .filter((t, i, arr) => rx.test(t) && arr.indexOf(t) === i)
      .slice(0, 8);
    if (!matches.length) return $suggest.hide();

    matches.forEach(t => {
      const $btn = $(`<button type="button" role="option"></button>`).text(t);
      $btn.on("click", () => {
        $live.val(t).trigger("input");
        $suggest.hide();
        toast(`Filtered by “${t}”`, "success");
      });
      $suggest.append($btn);
    });
    $suggest.show();
  }
  $live.on("input focus", function () {
    buildSuggestions($(this).val().trim());
  });
  $(document).on("click", function (e) {
    if (!$(e.target).closest(".search-wrap").length) $suggest.hide();
  });

  // ---------------- Task 3: Search Highlight (regex + wrap) ----------------
  function clearMarks(root = document) {
    $(root).find("mark.hl").each(function () {
      const $m = $(this);
      $m.replaceWith($m.text());
    });
  }
  function highlightAll(q, root = document) {
    if (!q) return;
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    // choose zones to highlight (FAQ + body texts)
    const $zones = $(".faq, .card, main, .quotes").clone(false);
    // Real DOM pass:
    $(".faq, .card, main, .quotes")
      .contents()
      .each(function deep() {
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
    clearMarks(document);
    if (!q) return;
    highlightAll(q, document);
    toast(`Highlighted “${q}”`, "info");
  });
  $("#clearHighlight").on("click", function () {
    clearMarks(document);
  });

  // ---------------- Task 5: Animated Number Counter ----------------
  $("[data-count]").each(function () {
    const $el = $(this);
    const target = parseFloat($el.data("count"));
    const dur = 1200; // ms
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      // integer counter (қажет болса форматта)
      $el.text(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

  // ---------------- Task 6: Loading Spinner on Submit ----------------
  const $form = $("#contactForm");
  $form.on("submit", function (e) {
    e.preventDefault();
    const $btn = $(this).find('button[type="submit"]');
    if (!$btn.length) return this.submit();
    const original = $btn.html();
    $btn.prop("disabled", true).html(`<span class="spinner"></span>Please wait…`);
    // "Fake server" delay
    setTimeout(() => {
      // restore
      $btn.prop("disabled", false).html(original);
      toast("Form submitted successfully", "success");
      this.reset();
      $("#formStatus").removeClass("visually-hidden").text("Submitted successfully");
    }, 1200);
  });

  // ---------------- Task 7: Notification System (toast) ----------------
  // Қолдану мысалы:
  $(".item, .card").on("click", function () {
    const name =
      $(this).find("img[alt]").attr("alt") ||
      $(this).find(".card-text h3").text() ||
      "Item";
    toast(`“${name}” viewed`, "info");
  });

  // ---------------- Task 8: Copy to Clipboard ----------------
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

  // ---------------- Task 9: Image Lazy Loading ----------------
  const $lazy = $("img.lazy[data-src]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        const src = img.getAttribute("data-src");
        if (src) {
          img.src = src;
          img.removeAttribute("data-src");
          img.classList.remove("lazy");
        }
        obs.unobserve(img);
      });
    }, { rootMargin: "200px 0px" });
    $lazy.each(function () { io.observe(this); });
  } else {
    // Fallback: on scroll
    const lazyLoadFallback = () => {
      $lazy.each(function () {
        const $img = $(this);
        if ($img.data("loaded")) return;
        const rect = this.getBoundingClientRect();
        if (rect.top < window.innerHeight + 200) {
          this.src = $img.attr("data-src");
          $img.removeAttr("data-src").data("loaded", true).removeClass("lazy");
        }
      });
    };
    $(document).on("scroll resize", lazyLoadFallback);
    lazyLoadFallback();
  }
});
