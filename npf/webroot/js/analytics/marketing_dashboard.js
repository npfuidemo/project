function check_default_dashlet(ref)
{
	var dash_id = $(ref).attr("data-id");
	if(dash_id == 15)
	{
		$('#ErrorPopupArea').modal('show').css('z-index', '11111');
		$('#ErrorPopupArea .modal-header').hide();
		$('#ErrorMsgBody').removeClass('text-danger').addClass('text-left').html('<div class="lineicon-43 fa-3x text-center mb-2"></div>Lead Origin Performance has been set as <strong class="text-danger">default dashlet</strong> &nbsp;for Marketing Dashboard. <strong class="text-danger">It can not be disabled.</strong>.');
		$('#ErrorOkBtn').click(function(){
			$('.check_noclickevent').prop('checked', true);
		});
	}
}