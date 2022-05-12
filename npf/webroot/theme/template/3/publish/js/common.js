(function ($) {
    "use strict";
    $(document).ready(function () {
		
		/*var bgHeight = $(window).height();
        $('#main-banner, .banner-block').css('height',bgHeight);*/
		
		if ($(window).width() < 1200) {
		  $('.form-main').removeClass('open');
		}
		
		else{
			
			$('.form-main').addClass('open');
		}
		
		
          $('.form-click').addClass('open');
          $(window).scroll(function() {
          if ($(this).scrollTop() > 200) {
             $('.form-main').removeClass('open');
             $('.form-click').removeClass('open');
          } else {
              $('.form-main').addClass('open');
            $('.form-click').addClass('open');
          }
          });

         
            $('.form-click').click(function(){ 
               $('.form-main').toggleClass('open');
              $(this).toggleClass('open');

            });
         
		
		/*fee-details*/
		$("#fee-details").owlCarousel({ 
			margin: 30,
			items : 4,
			loop:true
      });
	  
	  /*fee-details*/
		$("#main-banner").owlCarousel({
			autoplay:true,
		    autoplayHoverPause:true,
			items : 1,
			animateOut: 'fadeOut',
			animateIn: 'fadeIn',
			loop:true
      });
	  $('#main-banner').bind('mouseover', function (e){
				 $('#main-banner').trigger('stop.owl.autoplay');
			});

			$('#main-banner').bind('mouseleave', function (e){
				 $('#main-banner').trigger('play.owl.autoplay');
			});
	  
	  /*recruiters*/
		$("#recruiters").owlCarousel({
			stagePadding: 5, 
			margin: -200,
			items : 7,
			nav:true,
			loop:true,
			navText: [
			  "<i class='fa fa-angle-left'></i>",
			  "<i class='fa fa-angle-right'></i>"
			  ],
			pagination:false
      });
	  
	  /*testimonials*/
		$("#testimonials").owlCarousel({
			stagePadding: 25, 
			margin: 50,
			items : 2,
			loop:true,
			pagination:false
      });
	  
	  /*sumoselect*/
		$('.select-arrow-cust').SumoSelect({ search: true, searchText:'Enter here' });
 
    });  
})(jQuery);

jQuery(window).load(function(){
var winWidth = $(window).width();
var $formheight = $('.form-block');
    var $mysliderheight = $('.main-banner');
	var $bannerblockheight = $('.banner-block');
	var $bannercontentheight = $('.banner-content');
	var $fillheight = $('.main-banner .item img');

    var $window = $(window).on('resize', function(){
    var height = $formheight.outerHeight()+80;
      $mysliderheight.height(height);
	  $bannerblockheight.height(height);
	  $fillheight.height(height);
	  $bannercontentheight.height(height-63);
	  $fillheight.width(winWidth);
	   }).trigger('resize');
});