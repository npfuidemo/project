$(document).ready(function() {
  //console.log( "document ready!" );
  var sideWidth = $('.sidebar').width();
  $('.nav-sidebar').css('width', sideWidth);
  var $sticky = $('.nav-sidebar');
  var $stickyrStopper = $('.footer');
  if (!!$sticky.offset()) { // make sure ".sticky" element exists

    var generalSidebarHeight = $sticky.innerHeight();
    var stickyTop = $sticky.offset().top;
    var stickOffset = 55;
    var stickyStopperPosition = $stickyrStopper.offset().top;
    var stopPoint = stickyStopperPosition - generalSidebarHeight - stickOffset;
    var diff = stopPoint + stickOffset;

    $(window).scroll(function(){ // scroll event
      var windowTop = $(window).scrollTop(); // returns number

      if (stopPoint < windowTop) {
          $sticky.css({ position: 'fixed', top: stickOffset });
      } else if (stickyTop < windowTop+stickOffset) {
          $sticky.css({ position: 'fixed', top: stickOffset });
      } else {
          $sticky.css({position: 'fixed', top: stickOffset});
      }
    });
  }
});