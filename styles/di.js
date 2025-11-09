// star rating
document.querySelectorAll('.rating').forEach(block => {
  const stars = block.querySelectorAll('span[data-value]');
  const note  = block.querySelector('.rating-note');
  let current = 0;

  const paint = (n) => {
    stars.forEach(s => s.classList.toggle('active', Number(s.dataset.value) <= n));
    note.textContent = `Rate: ${n}/5`;
  };

  stars.forEach(star => {
    star.addEventListener('click', () => {
      current = Number(star.dataset.value);
      paint(current);
    });
    star.addEventListener('mouseenter', () => paint(Number(star.dataset.value)));
    star.addEventListener('mouseleave', () => paint(current));
  });
});

let lastSpark = 0;

document.addEventListener('mousemove', e => {
  const now = Date.now();
  if (now - lastSpark < 80) return; // ⚡ ограничиваем частоту
  lastSpark = now;

  const spark = document.createElement('span');
  spark.textContent = '✨';
  spark.style.cssText = `
    position: fixed;
    left: ${e.clientX}px;
    top: ${e.clientY}px;
    font-size: ${8 + Math.random() * 14}px;
    pointer-events: none;
    opacity: 1;
    transform: translate(-50%, -50%);
    animation: sparkleFade .9s ease-out forwards;
    z-index: 99999;
  `;
  document.body.appendChild(spark);
  setTimeout(() => spark.remove(), 900);
});

const style = document.createElement('style');
style.textContent = `
@keyframes sparkleFade {
  0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  100% { opacity: 0; transform: translate(-50%, -80%) scale(1.4); }
}`;
document.head.appendChild(style);


// Typing effect for headings
(function(){
  const el = document.querySelector('.typing');
  if(!el) return;
  const text = el.getAttribute('data-text') || '';
  let i = 0;
  function tick(){
    el.textContent = text.slice(0, i++);
    el.style.width = el.textContent.length + 'ch';
    if(i <= text.length) requestAnimationFrame(tick);
  }
  tick();
})();
