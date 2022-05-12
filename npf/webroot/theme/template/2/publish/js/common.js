(function ($) {
    "use strict";
    $(document).ready(function () {	
		$("#main-banner").owlCarousel({
			autoplay:true,
		    autoplayHoverPause:true,
			items : 1,
			animateOut: 'fadeOut',
			animateIn: 'fadeIn',
			loop:true
      });
    });  
})(jQuery);

jQuery(window).load(function(){
		/*fee-details*/
		$("#fee-details").owlCarousel({
			stagePadding: 50, 
			margin: 10,
			items : 1,
			loop:true
      });
	  /*recruiters*/
		$("#recruiters").owlCarousel({
			stagePadding: 10, 
			margin: 10,
			items : 1,
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
			stagePadding: 10, 
			margin: 10,
			items : 1,
			loop:true,
			pagination:false
      });
/*read more read less*/
		$('.showhide-content').each(function() {
			if ($(this).height() > 180) {
				$(this).css('max-height', '180px');
				$(this).siblings('.showhideBtn').css('display', 'block');
			} else {
				$(this).siblings('.showhideBtn').addClass('display-none');
			}
		});
		$('.hideshow').on('click', function() {
			$(this).parent('.showhideBtn').siblings('.showhide-content').toggleClass('showfullTxt');
				if($(this).text() == 'Read Less')
				{
					$(this).text('Read More');
				}else
				{
				$(this).text('Read Less');
				}
		});	
		
		var $mysliderheight = $('.main-banner');
		var $bannercontinnheight = $('.banner-contentinn');
		var $bannercontentheight = $('.banner-content');

		var $window = $(window).on('resize', function(){
		var height = $mysliderheight.outerHeight();
		var winwidth = $(window).width();
		
		$bannercontentheight.height(height);
		$bannercontinnheight.height(height);
		$bannercontinnheight.width(winwidth);
	   }).trigger('resize');
	
   
});