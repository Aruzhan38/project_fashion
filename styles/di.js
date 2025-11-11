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

