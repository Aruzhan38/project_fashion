$(function () {

  var $cards = $('.grid .grid-item');
  var $input = $('#styleSearch');  
  var $match = $('#matchCount'); 

  $match.text($cards.length);

  $input.on('keyup', function () {

    var query = $input.val().toLowerCase().trim();

    if (query === "") {
      $cards.show(); 
      $match.text($cards.length);
      return;
    }

    var $visible = $cards.filter(function () {
   
      var text = $(this).text().toLowerCase();
      return text.indexOf(query) !== -1;
    });

    $cards.hide();

    $visible.show();

    $match.text($visible.length);
  });
});
