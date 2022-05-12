$(document).on('click', '.advanceFilterModal', function(){
	filterOpen();
	pagefilterheight();
	$(window).resize(pagefilterheight);	
});
$(document).on('click', '.backdrop-filter, .advanceFilter .close, .btn-cancel, .advanceFilterModal.active', function() {
	filterClose();
});

//$(document).ajaxSuccess(function() {
//  filterClose();
//});

function pagefilterheight(){
	filterPosition = jQuery('.advanceFilterModal').offset().top - $(document).scrollTop() + 36;
	viewPortHeight = jQuery(window).height();
	pageFilterHeight = viewPortHeight - filterPosition;
	if ($(window).width() > 767){
		$('#advanceFilter').css('height', pageFilterHeight);
	}
}

function filterCloseOutSide(){
	$(document).on('click', function () {
		$('#advanceFilter, .advanceFilterModal').removeClass('active');
	});
	$('#advanceFilter, .advanceFilterModal').on('click', function (event) {
	  //event.stopPropagation();
	  return false;
	});
}
function filterClose(){
	$('.advanceFilterModal, .advanceFilter').removeClass('active');
	$('body').removeClass('filterOpen');
	$('.backdrop-filter').remove();
}
function filterOpen(){
	$('.advanceFilterModal, .advanceFilter').addClass('active');
	$('body').addClass('filterOpen');
	pagefilterheight();
	$('.advanceFilterModal').parent().append("<div class='backdrop-filter animated fadeIn'></div>");
}

// Filter Hide once click on any dropdown
$('.dropdown').on('show.bs.dropdown', function(){
  filterClose();
})