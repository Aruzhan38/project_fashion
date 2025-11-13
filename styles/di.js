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