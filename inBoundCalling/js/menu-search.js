function searchFilterFunction() {
  var input, filter, div, option, i;
  input = document.getElementById("menuSearchInput")
  filter = input.value.toUpperCase();
  div = document.getElementById("menuList");
  option = div.getElementsByTagName("a");
  for (i = 0; i < option.length; i++) {
    txtValue = option[i].textContent || option[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      option[i].classList.add("menuSearchItem");
      option[i].style.display = "";
    } else {
      option[i].classList.remove("menuSearchItem");
      option[i].style.display = "none";
    }
  }
}
var searchInProcess = false;

function searchElement() {
  if (searchInProcess) {
    return;
  }
  searchInProcess = true;
  let getVal = $('.menu-search-input').val();
  if (getVal.length >= 3) {
    $('#sidebar .collapse').collapse('show');
    $('#sidebar #menuList li').css('margin', 0);
    $('#sidebar #menuList li').css('padding', 0);
    $('#sidebar .list-unstyled').css('height', 'auto');
    $('#sidebar #menuList *').css('background', 'transparent');
    $('#sidebar #menuList li a').css('padding', '10px 0 10px 40px');
    searchFilterFunction();
    if ($(window).width() > 769) {
      if ($('#sidebar-wrapper.active').length) {
        $('#navbar-toggler-desktop').trigger('click');
      }
    }
    if (!$('#sidebar #menuList .menuSearchItem').length) {
      $('#sidebar .search-result').html('Search Result Not Found!').show();
      $('.nav-open #navbar-toggler-desktop').click(function () {
        $('#sidebar .menu-search-input').val('');
        $('#sidebar .menu-search-input').keyup();
      });
    }
    else {
      $('#sidebar .search-result').html('').hide();
    }
  }
  else {
    $('#sidebar .collapse').collapse('hide');
    $('#sidebar #menuList a').css('display', '');
    $('#sidebar #menuList *').removeAttr('style');
    $('#sidebar .search-result').html('').hide();
    $('#sidebar #menuList a').removeClass('menuSearchItem');
  }
  setTimeout(() => {
    searchInProcess = false;
  }, 100);
}


$('.menu-search-input').on('keyup', function () {
  searchElement();
});

$('.menu-search').click(function () {
  $('.menu-search input').focus();
});
