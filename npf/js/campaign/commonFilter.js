$(window).load(function() {
	if (document.documentElement.clientWidth < 767) {
		$('[data-target="#menu-block"]').click(function(){
			$('body').toggleClass('offCanvasBody');
			$('.navbar-fixed-top').append("<div class='offCanvasbackdrop modal-backdrop fade in'></div>")
		})
		$(document).on('click', '.offCanvasbackdrop', function(e) {
			$('body').toggleClass('offCanvasBody');
			$('.menu-block').removeClass('in');
			$(this).remove();
		});
		$('.mobDropCorg .SumoSelect').on('click', function(e) {
			e.stopPropagation();
		});
		
		// add class in body once click on filter 
		//$('.fcEvent .btn').click(function(){
			
		//});
		
		$('.fcEvent .btn-group').on({ 
			"shown.bs.dropdown": function() { 
				$('body').addClass('filterOpen');
				//$('.mobDropContent').hide(); 
			},
			//"click": function() { $('.filter_collapse').addClass('filterOpen'); },
			"hidden.bs.dropdown":  function() { 
				$('.mobDropContent').hide();
				$('.mobDropCorg-backdrop').remove();
				$('body').removeClass('filterOpen'); 
			}
		});

		$('.btn-cogs-click').click( function(event){
			$(this).parent().toggleClass('active')
			//$(this).siblings('.mobDropContent').toggle();
			$(this).parent().append("<div class='mobDropCorg-backdrop fade in'></div>");
			
			if ($('.mobDropCorg').hasClass('active')){
				$(document).ajaxStop(function() {
				  $('.mobDropCorg').removeClass('active');
				  $('.mobDropCorg-backdrop').remove();
				});
				$('.action-btn-select .dropdown-item').click(function() {
				  $('.mobDropCorg').removeClass('active');
				  $('.mobDropCorg-backdrop').remove();
				});
			}
		});
		
		$(document).on('click', '.mobDropCorg-backdrop', function(e) {
			//$('.mobDropContent').hide();
			$(this).parent().toggleClass('active')
			//$('.menu-block').removeClass('in');
			$('.mobDropCorg-backdrop').remove();
		});
	}
});

if (document.documentElement.clientWidth < 767) {
	$( document ).ajaxSuccess(function(){
		$('thead .btn-payment-info').popover({
			placement: 'bottom',
			container: false
		});
		$('td .btn-payment-info').popover({
			placement: 'right',
			container: false
		});
	});
}

function filterModalReset(){
    $('.offCanvasModal input[type="text"]').each(function(){
       $(this).val('');
    });
    $('.offCanvasModal .chosen-select').each(function(){
       this.selected = false;
       $(this).val('');
       $(this).trigger("chosen:updated");
    });
	 $('.offCanvasModal .sumo-select').SumoSelect();
     $('.offCanvasModal .sumo-select').each(function(){
       this.selected = false;
       $(this).val('');
	   //console.log($(this).attr('class'));
       $(this)[0].sumo.reload();
    });
    return false;
}