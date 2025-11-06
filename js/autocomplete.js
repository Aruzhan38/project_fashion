
var STYLE_SUGGESTIONS = [
  { value: "Casual",   keywords: ["everyday", "jeans", "t-shirt", "basic"] },
  { value: "Sporty",   keywords: ["athleisure", "hoodie", "leggings", "trainer"] },
  { value: "Elegant",  keywords: ["formal", "dress", "heels", "blazer", "chic"] },
  { value: "Street",   keywords: ["oversized", "sneakers", "baggy", "trendy"] },
  { value: "Academic", keywords: ["preppy", "plaid", "cardigan", "loafers"] },
  { value: "Classic",  keywords: ["timeless", "neutral", "clean cuts"] },
  { value: "Boho",     keywords: ["flowy", "earthy", "bohemian", "maxi"] },
  { value: "Muslim",   keywords: ["modest", "abaya", "hijab", "layering"] }
];


function norm(s) {
  return (s || "").toString().toLowerCase().trim();
}
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function highlightText(text, q) {
  if (!q) return text;
  var re = new RegExp(escapeRegex(q), "ig");
  return text.replace(re, function(m){ return "<mark>" + m + "</mark>"; });
}


function clearPageHighlights() {
  $("mark").each(function(){
    $(this).replaceWith($(this).text());
  });
}

function highlightPage(q) {
  clearPageHighlights();
  q = (q || "").trim();
  if (!q) return;

  var $targets = $(".grid .grid-item h3, .grid .grid-item p, .section-title");
  $targets.each(function(){
    var $el = $(this);
    var html = $el.html();
    var next = highlightText(html, q);
    if (next !== html) $el.html(next);
  });
}

$(function(){
  var $input = $("#styleSearch");
  var $list  = $("#ac-list");


  function showSuggestions() {
    var q = norm($input.val());
    $list.empty();

    if (!q) { 
      $list.hide();
      return; 
    }

  
    var results = [];
    $.each(STYLE_SUGGESTIONS, function(_, s){
      var label = s.value;
      var hay   = norm(s.value + " " + (s.keywords || []).join(" "));
      if (hay.indexOf(q) !== -1) {
        results.push(label);
      }
    });

    if (results.length === 0) {
      $list.append('<div class="item" style="color:#888;">No suggestions</div>').show();
      return;
    }

  
    $.each(results.slice(0,8), function(i, label){
      var html = '<div class="item" data-value="'+ label +'">' + highlightText(label, $input.val()) + '</div>';
      $list.append(html);
    });

    $list.show();
  }

  
  $input.on("input", function(){
    showSuggestions();
   
    highlightPage($input.val());
  });

  
  $list.on("click", ".item", function(){
    var val = $(this).data("value");
    if (!val) return;
    $input.val(val);
    $list.hide();
    highlightPage(val);
  });

 
  $(document).on("click", function(e){
    if (e.target !== $input[0] && !$.contains($list[0], e.target)) {
      $list.hide();
    }
  });
});
