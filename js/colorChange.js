var btn = document.getElementById("colorBtn");
var colors = ["#f5e1e1", "#e8d7f1", "#d3f8e2", "#f6eec7", "#f4cccc"];
var index = 0;

btn.addEventListener("click", function() {
  document.body.style.transition = "background 0.5s ease";
  document.body.style.backgroundColor = colors[index];
  index = (index + 1) % colors.length;
});
