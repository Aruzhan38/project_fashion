document.addEventListener("DOMContentLoaded", ()=>{
    const form=document.getElementById("voteForm");
    const nameInput=form.querySelector("[name='name']");
    const daySelect=form.querySelector("[name='favday']");
    const commentInput=form.querySelector("[name='comment']");

    function showError(input,message){
        const small=input.nextElementSibling;
        small.textContent=message;
        small.style.color="#b00020";
        input.style.borderColor="#b00020";
    }

    function clearError(input){
        const small=input.nextElementSibling;
        small.textContent="";
        input.style.borderColor="#ccc";
    }

    form.addEventListener("submit", (e)=>{
        e.preventDefault();
        let isValid=true;

        if (nameInput.value.trim()===""){
            showError(nameInput,"please enter your name");
            isValid=false;
        }
        else{
            clearError(nameInput);
        }


        if (daySelect.value===""){
            showError(daySelect,"please select a day");
            isValid=false;
        }
        else{
            clearError(daySelect);
        }


        if (commentInput.value.trim()===""){
            showError(commentInput, "write at least 5 characters");
            isValid=false;
        }
        else{
            clearError(commentInput);
        }


        if (isValid){
            alert("thank you for your favorite");
            form.reset();
        }
        
    });

    [nameInput, daySelect, commentInput].forEach((field)=>{
        field.addEventListener("input", ()=>clearError(field));
    });

});

(function(){
  const $scope = $('main');

  function escapeReg(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function clearHighlights(){
    $scope.find('mark.hl').each(function(){
      this.replaceWith(this.textContent);
    });
  }

  function highlightAll(q){
    if(!q) return;

    const re = new RegExp(escapeReg(q), 'gi');
    const root = $scope[0];

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node){
          const p = node.parentNode;
          if(!p) return NodeFilter.FILTER_REJECT;
          const tag = p.nodeName.toLowerCase();
          if (/^(script|style|textarea|option)$/i.test(tag)) return NodeFilter.FILTER_REJECT;
          if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(node=>{
      const text = node.nodeValue;
      if(!re.test(text)) return;          
      re.lastIndex = 0;                      

      const frag = document.createDocumentFragment();
      let last = 0;
      text.replace(re, (m, off)=>{
        if (off > last) frag.appendChild(document.createTextNode(text.slice(last, off)));
        const mark = document.createElement('mark');
        mark.className = 'hl';
        mark.textContent = m;
        frag.appendChild(mark);
        last = off + m.length;
      });
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));

      node.parentNode.replaceChild(frag, node);
    });
  }

  $('#lookSearch')
    .attr('autocomplete','off')
    .on('input', function(){
      const q = this.value.trim();
      clearHighlights();
      if(q) highlightAll(q);
    });
})();























document.addEventListener("DOMContentLoaded",()=>{
    const ratingWrap=document.getElementById("weekRating");
    const starContainers=document.getElementsByClassName("stars");
    const stars=document.querySelectorAll("#weekRating .star");
    const buttons = document.getElementsByTagName("button");
    const hiddenInput=document.querySelector("#ratingValue"); 

    let currentRating = 0;

  stars.forEach((star, idx) => {
    star.addEventListener("mouseenter", () => {
      stars.forEach((s, i) => s.classList.toggle("hover", i <= idx));
    });
    star.addEventListener("mouseleave", () => {
      stars.forEach(s => s.classList.remove("hover"));
    });
  });

  stars.forEach((star, idx) => {
    star.addEventListener("click", () => {
      currentRating = idx + 1; 
      hiddenInput.value = String(currentRating);
      stars.forEach((s, i) => s.classList.toggle("selected", i < currentRating));
    });
  });
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







$(function(){
  $("#lookSearch").on("keyup", function(){
    let value = $(this).val().toLowerCase();
    $(".week-grid .card").filter(function(){
      $(this).toggle($(this).text().toLowerCase().includes(value));
    });
  });
});


/*$(function () {
  const $scope = $('main'); 
  function clearHighlights(){
    $scope.find('mark.hl').each(function(){
      $(this).replaceWith($(this).text()); 
    });
  }
  function escapeReg(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function highlightAll(q){
    const re = new RegExp(escapeReg(q), 'gi'); 
    $scope.find('h1,h2,h3,p,figcaption,li,span,div,button,option').each(function(){
      const html = $(this).html();
      if(!html) return;
      $(this).html(html.replace(re, '<mark class="hl">$&</mark>')); 
    });
  }
  $('#lookSearch').on('input keyup', function(){
    const q = $(this).val().trim();
    clearHighlights();
    if(q) highlightAll(q);
  });
}); */








$(function(){
  function updateScrollBar(){
    const s = $(window).scrollTop();
    const h = $(document).height() - $(window).height();
    const pct = h > 0 ? (s / h) * 100 : 0;
    $('#spBar').css('width', pct + '%'); 
    $('#spPct').text(Math.round(pct) + '%');
  }

  $(window).on('scroll resize', updateScrollBar);
  updateScrollBar();
});




$(function(){
  let started = false;

  function countNumbers(){
    if(started) return;

    let top = $('#stats').offset().top;
    if($(window).scrollTop() + $(window).height() > top){
      started = true;

      $('.num').each(function(){
        let $el = $(this);
        let target = $el.data('target');
        let count = 0;

        let timer = setInterval(function(){
          count++;
          $el.text(count);
          if(count >= target) clearInterval(timer);
        }, 30); 
      });
    }
  }

  $(window).on('scroll', countNumbers);
});

const box = document.querySelector('#weekRating .stars');
if (box){
  const stars = [...box.querySelectorAll('.star')];
  box.addEventListener('click', e=>{
    const i = stars.indexOf(e.target.closest('.star'));
    if (i < 0) return;
    stars.forEach((s,idx)=> s.classList.toggle('is-on', idx <= i));
    document.getElementById('ratingValue').value = i+1;
  });
}




