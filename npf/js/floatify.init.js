function floatableLabel(){
	$('.right-communicate input, .right-communicate textarea, .floatifyDiv input, .floatifyDiv textarea').floatify({
		hGap: 0
	});
	if($('.right-communicate .chosen-select').length > 0){
		$('.right-communicate .chosen-select').each(function(){
			//alert($('#from_email').val());
			//&& this.id=='from_email'
			if($(this).val() !=''){
				$(this).parent().addClass('floatify floatify__left floatify__active');
			}
		});
		$('.right-communicate .chosen-select').change(function(){
			if($(this).val() !==''){
				$(this).parent().addClass('floatify floatify__left floatify__active');
			}else{
				$(this).parent().removeClass('floatify__active');
			}
		})
	}
	if($('.right-communicate .sumo-select').length > 0){
		$('.right-communicate .sumo-select').each(function(){
			//alert($('#from_email').val());
			//&& this.id=='from_email'
			if($(this).val() !=''){
				$(this).parent().parent().addClass('floatify floatify__left floatify__active');
			}
		});
		$('.right-communicate .sumo-select').change(function(){
			if($(this).val() !==''){
				$(this).parent().parent().addClass('floatify floatify__left floatify__active');
			}else{
				$(this).parent().parent().removeClass('floatify__active');
			}
		})
	}	
}