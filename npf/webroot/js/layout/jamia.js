/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function toggleIcon(e) {
    $(e.target)
            .prev('.panel-heading')
            .find('.more-less')
            .toggleClass('glyphicon-plus glyphicon-minus');
}
$('.panel-group').on('hidden.bs.collapse', toggleIcon);
$('.panel-group').on('shown.bs.collapse', toggleIcon);

$(document).ready(function () {
    $('.owl-demo').owlCarousel({
        loop: false,
        margin: 10,
        nav: true,
        navigation: true,
        stagePadding: 50,
        responsiveClass: true,
        responsive: {
				0: {
				  items: 1 
				},
				320: {
				  items: 1 
				},
				420: {
				  items: 2 
				},
				600: {
				  items: 2 
				},
				1000: {
				  items: 3 
				}

			  }
    });
    $(".owl-prev").html('<i class="fa fa-chevron-left"></i>');
    $(".owl-next").html('<i class="fa fa-chevron-right"></i>');
});
