document.addEventListener("DOMContentLoaded", () => {
  setupAccordion();
  setupBgColorCycler();
});


function setupAccordion(root = document) {
  const items = root.querySelectorAll("[data-accordion]");
  items.forEach(item => {
    const btn = item.querySelector(".faq-btn");
    const panel = item.querySelector(".faq-panel");
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", !open);
      panel.style.maxHeight = open ? "0px" : panel.scrollHeight + "px";
    });
  });
}

function setupBgColorCycler() {
  const colors = [
    "#f8e9ec", "#f6f0f5", "#fdf6f0",
    "#f3e8ee", "#ece6eb", "#fff7f8"
  ];
  let i = 0;
  const btn = document.getElementById("bg-color-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    document.body.style.transition = "background-color .35s ease";
    document.body.style.backgroundColor = colors[i];
    i = (i + 1) % colors.length;
  });
}
