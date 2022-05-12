$(document).ready(function(){
    loadMoreCoupons('reset')
    LoadReportDateRangepicker('left', 'up');
    $('#couponListLoader.loader-block').hide();
//    $(".collapse").collapse();
    
    // code for search box starts
    if ($('#filterDiscountCouponForm #search').length > 0) {
        $('#filterDiscountCouponForm #search').typeahead({
            hint: true,
            highlight: true,
            minLength: 1,
            source: function (request, response) {
                var search = $('#filterDiscountCouponForm #search').val();
                if (search)
                {
                    $.ajax({
                        url: jsVars.searchDiscountCouponLink,
                        data: {search: search},
                        dataType: "json",
                        type: "POST",
                        headers: {
                            "X-CSRF-Token": jsVars._csrfToken
                        },
                        success: function (data) {
                            items = [];
                            map = {};
                            $.each(data.listDiscountCoupons, function (i, item) {
                                var name = item;
                                map[name] = {name: name};
                                items.push(name);
                            });
                            response(items);
                            $(".dropdown-menu").css("height", "auto");
                        },
                        error: function (response) {
                            alertPopup(response.responseText);
                        },
                        failure: function (response) {
                            alertPopup(response.responseText);
                        }
                    });
                }
            }
        });
    }
    // code for search box ends
    
    $('.searchDiscountCoupon').keypress(function (e) {
        var key = e.which;
        if(key === 13)  // the enter key code
        {
            loadMoreCoupons('reset');
        }
    });
    
    $("#college_id").change(function(){
        getListFiltersData($("#college_id").val());
    });
     $('.daterangepicker').addClass('couponListDateRange');
});

function loadMoreCoupons(listingType){
//    $('#VoucherListContainerSection').html('');
    if($("#college_id").val()==""){
		$('#load_msg_div').show();
		$('#load_msg').html('Please select a institute name to view discount coupons');
		$('.ajaxDownloadView, #LoadMoreArea').hide();
		$('#VoucherListContainerSection').html('');
        //$('#VoucherListContainerSection').html('<div class="alert alert-danger">Please select a college to view discount coupons</div>');
        return;
    }
    
    if(listingType === 'reset'){
        $("#page").val(1);
        $("#lastSearched").val($("#search").val());
    }
    $("#selected_coupon_name").val($("#coupon_name").val());
    $.ajax({
        url: jsVars.loadMoreDiscountCouponLink,
        type: 'post',
        data: $('#couponSearchArea input,#couponSearchArea select'),
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#couponListLoader.loader-block').show();
        },
        complete: function () {
            $('#couponListLoader.loader-block').hide();
        },
        success: function (html) { 
			if(html == 'error'){
				//alert('error');
				$('.ajaxDownloadView, #LoadMoreArea').hide();
				$('#VoucherListContainerSection').html('');
				$('#load_msg_div').show();
				$('#load_msg').html('No discount coupons found with selected filters');
			}else{	
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
                $('#LoadMoreArea').hide();
            }else{
                var countRecord = countResult(html);
                html    = html.replace("<head/>", "");
                if(listingType === 'reset'){
                    $('#VoucherListContainerSection').html(html);
                }else{
                    $('#VoucherListContainerSection').find("tbody").append(html);
                }
                if(countRecord < 10){
                    $('#LoadMoreArea').hide();
					//$('#load_more_results tbody').append('<tr><td colspan="9" class="text-center text-danger fw-500"> No More record</td></tr>');
                }else{
                    $('#LoadMoreArea').show();
                }
                $("#page").val(parseInt($("#page").val())+1);
                dropdownMenuPlacement();
				$('.ajaxDownloadView').show();
				$('#load_msg_div').hide();
			  }
			}
            table_fix_rowcol();
			dropdownMenuPlacement();	
			$('.offCanvasModal').modal('hide');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
};

function countResult(html){
    var len = (html.match(/listDataRow/g) || []).length;
    return len;
}

function confirmDisable(discountCouponId,collegeId,token){
    $("#confirmButton").attr("onclick",'disableCoupon('+discountCouponId+','+collegeId+',"'+token+'");');
    $('#confirmModal').modal('show');
}

function disableCoupon(discountCouponId,collegeId,token){
    $('#confirmModal').modal('hide');
    $.ajax({
        url: jsVars.disableCouponLink,
        type: 'post',
        data: {'discountCouponId' : discountCouponId,'collegeId' : collegeId,'token' : token},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#couponListLoader.loader-block').show();
        },
        complete: function () {
            $('#couponListLoader.loader-block').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                loadMoreCoupons("reset");
            }else{
                alert(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function exportDiscountCouponCsv(){
    var $form = $("#filterDiscountCouponForm");
    $form.attr("action",jsVars.exportDiscountCouponCsvLink);
    $form.attr("target",'modalIframe');
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    $('#myModal').modal('show');
    $form.submit();
    $form.attr("onsubmit",onsubmit_attr);
    $form.removeAttr("target");
};

var downloadCouponFile = function(url){
    window.open(url, "_self");
};

function showDiscountCouponDetails(discountCouponId){
    $('#discountCouponDetailModal').modal('show');
    $("#discountCouponDetailModal iframe").attr({
            'src': jsVars.discountCouponDetailsLink + "?discountCouponId="+discountCouponId+"&searchDiscountCoupon="+$("#lastSearched").val()
    });
    $('#discountCouponDetailModal').on('hidden.bs.modal', function(){
        $("#discountCouponModalIframe").html("");
        $("#discountCouponModalIframe").attr("src", "");
    });
    table_fix_rowcol();
}

function exportCollegeCouponCsv(discountCouponId,collegeId,agentLevel){
    $('#myModal').modal('show');
    $("#myModal iframe").attr({
            'src': jsVars.exportCollegeCouponCsvLink + "?discountCouponId="+discountCouponId+"&collegeId="+collegeId+"&searchDiscountCoupon="+$("#lastSearched").val()+"&agent_level="+agentLevel
    });
    $('#myModal').on('hidden.bs.modal', function(){
        $("#modalIframe").html("");
        $("#modalIframe").attr("src", "");
    });
}

function getListFiltersData(collegeId){
    var discountValue   = '<select id="discount_value" class="chosen-select" tabindex="-1" name="discount_value"><option selected="selected" value="">Discount Value</option></select>';
    $('#div_discount_value').html(discountValue);
    var couponName      = '<select data-placeholder="Coupon Campaign Name" tabindex="-1" class="chosen-select" id="coupon_name"  name="coupon_name"><option value="">Select Coupon Campaign Name</option></select>';
    $('#div_coupon_name').html(couponName);
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    $('#couponListLoader.loader-block').hide();
    if(!collegeId.length){
        return;
    }
    
    $.ajax({
        url: jsVars.getListFiltersDataLink,
        type: 'post',
        data: {'collegeId' : collegeId},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#couponListLoader.loader-block').show();
        },
        complete: function () {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('#couponListLoader.loader-block').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    if(typeof responseObject.data.discountList === "object"){
                        var discountList    = responseObject.data.discountList;
                        var discountValue   = '<select id="discount_value" class="chosen-select" tabindex="-1" name="discount_value" style="display: none;"><option selected="selected" value="">Discount Value</option>';
                        $.each(discountList, function (index, item) {
                            discountValue += '<option value="'+index+'">'+item+'</option>';
                        });
                        discountValue += '</select>';
                        $('#div_discount_value').html(discountValue);
                    }
                    if(typeof responseObject.data.couponNameList === "object"){
                        var couponNameList  = responseObject.data.couponNameList;
                        var couponName      = '<select tabindex="-1" class="chosen-select" id="coupon_name" name="coupon_name"><option value="">Select Coupon Campaign Name</option>';
                        $.each(couponNameList, function (index, item) {
                            couponName += '<option value="'+index+'">'+item+'</option>';
                        });
                        couponName += '</select>';
                        $('#div_coupon_name').html(couponName);
                    }
					$('#search_common').prop('readonly', false);
                }
            }else{
                alert(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function displayAssignedForm(discount_coupon_id){
    var html = $('#assigned_form_'+discount_coupon_id).html();
    //alertPopup(html, "success");
    //$('#alertTitle').html('Assigned Form List');
	$('#abc'+discount_coupon_id).popover({
		container: 'body',
		html: true,
		trigger: 'focus',
		title: 'Assigned to Forms',
		placement: 'top',
		content: html
	});
	$('#abc'+discount_coupon_id).popover('show');
}

