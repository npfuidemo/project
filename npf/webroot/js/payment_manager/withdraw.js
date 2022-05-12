var WithdrawManagerPage  = 1;
$(document).ready(function(){
    $(".erroralert").delay(5000).slideUp(300);
    $(".successalert").delay(5000).slideUp(300);
    
    $('#seacrhList').attr('onclick','LoadMoreWithdrawConfig("reset")');
    
    bindPaymentAjaxCall();
    
    $('.daterangepicker_fee').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY',
            separator: ', ',
        },
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'left',
        drops: 'down',
    }, function (start, end, label) {
    });

    $('.daterangepicker_fee').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
    });

    $('.daterangepicker_fee').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
    
    showHideSearchBox();    
    $("#form_id").change(function(){
        showHideSearchBox();
    });
});

function showHideSearchBox(){
    $("#search_application_div").hide();
    $("#search_application").val('');
    if($("#form_id").val()!=='' && $("#form_id").val()!=='0' && $("#form_id").val()!==null){
        $("#search_application_div").show();
    }
}

function LoadMoreWithdrawConfig(type) {
    $(".lead_error").html('');
    
    if (type == 'reset') {
        WithdrawManagerPage = 1;
    }
    
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').hide();
    var data = $('#FilterApplicationForms').serializeArray();
    data.push({name: "page", value: WithdrawManagerPage});
    
    $.ajax({
        url: '/payment-manager/withdraw-request-list',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function () {
           $('#parent').css('min-height', '50px');
           showLoader();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (response) {
	    WithdrawManagerPage+=1;
	    var responseObject = $.parseJSON(response); 
	    if (responseObject.message === 'session'){
		window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
	    }else if(responseObject.message ==="no_record_found"){
                if(WithdrawManagerPage==2){
                    $('#load_msg').html('No Withdraw Request Found');
                    $('#load_msg_div').show();
					$('#load_more_results').parent().addClass('hide');
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Withdraw Request");
                    $('#load_more_button').hide();
					if ($(window).width() < 992) {
						//filterClose();
						$('.offCanvasModal').modal('hide');
					}
                }else {
                    $('#load_msg').html('');
                    $('#load_msg_div').hide();
                    $('#load_more_button').html("<i class='fa fa-database' aria-hidden='true'></i>&nbsp;No More Withdraw Request");
                    $('#load_more_button').show();
                }
                if (type != '' && WithdrawManagerPage==2) {
                    $('#if_record_exists').hide();
                    $('#single_lead_add').hide();
                }
	    }else if(responseObject.status==1){
                if (type === 'reset') {
                    $('#load_more_results').html("");
                }
                data = responseObject.data.html.replace("<head/>", '');
                $('#load_more_results').parent().removeClass('hide');
                $('#load_more_results').append(data);
				dropdownMenuPlacement();
                $('#load_msg_div').hide();
				$('#parent').show();
                $('.itemsCount').show();
				//filterClose();
				$('.offCanvasModal').modal('hide');
				table_fix_rowcol();
                var ttl = $('#current_record').val(); 
		
                if(parseInt(ttl) < 10){
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Withdraw Request");
                    $('#load_more_button').hide();
                }else{
                    $('#load_more_button').removeAttr("disabled");
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Withdraw Request");
					$('#load_more_button').show();
                }
                if (type != '') {
                    $('#if_record_exists').fadeIn();
                }
	    }else{
		$('#parent').hide();
                $('#load_msg_div').show();
                $('#load_msg').html(responseObject.message);
                $('#load_more_results').html("");
                $('#load_more_button').hide();
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Withdraw Request");
                 if (type != '') {
                        $('#if_record_exists').hide();
                 }
			//filterClose();
			$('.offCanvasModal').modal('hide');
	    }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            //window.location.reload(true);
        },
        complete: function () {
            hideLoader();
        }
    });

    return false;
}

function bindPaymentAjaxCall(){
    
    if($(".dateinput").length > 0){
	$('.dateinput').datetimepicker({format: 'DD/MM/YYYY HH:mm',viewMode: 'years'});
    }
}

function getAllFormList(cid, default_val, multiselect) {
    if(typeof default_val=='undefined'){
        default_val = '';
    }
    if(typeof multiselect=='undefined'){
        multiselect = '';
    }
    
    if(cid == '' || cid == '0' ){
        $("#formListDiv").html("<select name='form_id' id='form_id'  class='chosen-select' ><option value='0'>Form</option></select>");
	$('.chosen-select').chosen();
        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        return false;
    }
    
    $.ajax({
        url: '/voucher/get-forms',
        type: 'post',
        data: {
            "college_id": cid,
            "default_val": default_val,
            "multiselect":multiselect
        },
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
           //currentObj.text('Wait..');
        },
        success: function (json) {
            if (json == 'session_logout') {
                window.location.reload(true);
            } else {
                $("#formListDiv").html(json);
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                showHideSearchBox();    
                $("#form_id").change(function(){
                    showHideSearchBox();
                });
            }
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            ;
        }
    });
}

//alert popup
function alertPopup(msg, type, location) {
    var selector_parent, selector_titleID, selector_msg, title_msg, btn;
    if (type == 'error') {
        selector_parent = '#ErrorPopupArea';
        selector_titleID = '#ErroralertTitle';
        selector_msg = '#ErrorMsgBody';
        btn = '#ErrorOkBtn';
        title_msg = 'Error';
    } else {
        selector_parent = '#SuccessPopupArea';
        selector_titleID = '#alertTitle';
        selector_msg = '#MsgBody';
        btn = '#OkBtn';
        title_msg = 'Success';
    }

    $(selector_titleID).html(title_msg);
    $(selector_msg).html(msg);
    $('.oktick').hide();

    if (typeof location != 'undefined') {
        $(btn).show();

        $(selector_parent).modal({keyboard: false}).one('click', btn, function (e) {
            e.preventDefault();
            window.location.href = location;
        });
    } else {
        $(selector_parent).modal();
    }
}

$('.modalButton').on('click', function(e) {
    var $form = $("#FilterApplicationForms");

    $form.attr("action",'/payment-manager/download-withdraw-list');
    $form.attr("target",'modalIframe');
    $form.append($("<input>").attr({"value":"export", "name":"export",'type':"hidden","id":"export"}));
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    $form.submit();
    $form.attr("onsubmit",onsubmit_attr);
    $form.find('input[name="export"]').val("");
    $form.removeAttr("target");
});
$('#myModal').on('hidden.bs.modal', function(){
    $("#modalIframe").html("");
    $("#modalIframe").attr("src", "");
});

var downloadVoucherFile = function (url) {
        window.open(url, "_self");
    };

/*** Show & Hide Loader ***/
function showLoader() {
    $("#listloader").show();
}
function hideLoader() {
    $("#listloader").hide();
}

function resetform(){  
    $("#FilterApplicationForms")[0].reset();
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    $('.chosen-select').trigger('chosen:updated');
    showHideSearchBox();
    LoadMoreWithdrawConfig('reset');
}

function validateWithdrawData() {
    $('.error').hide();
    var error = false;
    
    if ($("#mark_withdraw_status").val() === "") {
        $('#withdraw_status_error').html("Field is required.");
        $('#withdraw_status_error').show();
        error = true;
    }
    
    if($("#remarks").val() === ""){
        $('#remarks_error').html("Field is required.");
        $('#remarks_error').show();
        error=true;
    }
    
    if($('#mark_withdraw_status').val() != "51" && $('#payable_amount').val() === ""){
        $('#payable_amount_error').html("Field is required.");
        $('#payable_amount_error').show();
        error=true;
    }
    

    if (error === false) {
        return true;
    } else {
        return false;
    }
}

function approveWithdrawRequest(collegeId,requestId) {
    
    if (validateWithdrawData() == false) {
        return;
    }
    
    var withdraw_status = $('#mark_withdraw_status').val();
    if(withdraw_status == "31"){
        var msg = 'approve';
    }else if(withdraw_status == "51"){
        var msg = 'reject';
    }else if(withdraw_status == "52"){
        var msg = 'processed';
    }
    $("#confirmYes").removeAttr('onclick');
    $('#confirmTitle').html("Withdraw Confirmation");
    $("#confirmYes").html('Yes');
    $("#confirmYes").siblings('button').html('No');
    $('#ConfirmMsgBody').html('Are you sure you want to '+msg+' this request.');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        
        var data = $('#updateWithdrawStatus').serializeArray();
        data.push({name: "collegeId", value: collegeId});
        data.push({name: "requestId", value: requestId});
        $.ajax({
            url: '/payment-manager/approveWithdrawRequest',
            type: 'post',
            dataType: 'html',        
            data: data,
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (data) {
                var responseObject = $.parseJSON(data);
                if (responseObject.message === 'session') {
                    window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }
                if (responseObject.status == 1) {
                    $("#mark-withdraw-status").modal('hide');
                    LoadMoreWithdrawConfig("reset");
                } else {
                    alertPopup(responseObject.message, 'error');
                    return;
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {            
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    $('#ConfirmPopupArea').modal('hide');
    });
    return false;
}

function updateWithdrawRequest(collegeId, formId, requestId){
    if(collegeId || requestId)
    {
        $.ajax({
            url: '/payment-manager/withdraw-status-popup',
            type: 'post',
            data: {collegeId:collegeId,formId:formId,requestId:requestId},
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function() {                    
                    $('div.loader-block-a').show();
            },
            complete: function() {
                    $('div.loader-block-a').hide();
            },
            success: function (data) 
            {
                $("#withdraw-modal-title").text("Mark Withdraw Request Status");
                $("#loadFields").html(data);
				$("#mark-withdraw-status .modal-dialog").removeClass('modal-sm');
                $("#mark-withdraw-status").modal();
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                $('.chosen-select').trigger('chosen:updated');
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block-a').hide();
            }
        });
        return;
    }
}

function loadDependentField(withdrawStatus) {
    if(withdrawStatus === "" || withdrawStatus == "51"){
        $(".payable_amount").hide();
    }else{
        $(".payable_amount").show();
    }
}

function withdrawDetails(collegeId, formId, requestId, applicationNo){
    
    if(collegeId === "" || formId === "" || requestId === ""){
        alertPopup("Invalid Request", 'error');
        return;
    }
    $.ajax({
        url: '/payment-manager/withdraw-details',
        type: 'post',
        data: {collegeId:collegeId,formId:formId,requestId:requestId, applicationNo:applicationNo},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {                    
                $('div.loader-block-a').show();
        },
        complete: function() {
                $('div.loader-block-a').hide();
        },
        success: function (data) 
        {
            $("#withdraw-modal-title").html('Withdraw Request Details');
            $("#loadFields").html(data);
            //$("#mark-withdraw-status .modal-dialog").removeClass('modal-sm').addClass('modal-md');
            $("#mark-withdraw-status").modal();
            showHideSearchBox();    
            $("#form_id").change(function(){
                showHideSearchBox();
            });            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block-a').hide();
        }
    });
    return;
    
}