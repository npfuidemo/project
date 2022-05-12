$(document).ready(function(){
//    $(function(){
//        $('[rel="popover"]').popover({
//                container: 'body',
//                html: true,
//                content: function () {
//                    var clone = $($(this).data('popover-content')).clone(true).removeClass('hide');
//                    return clone;
//                }
//            }).click(function(e) {
//                e.preventDefault();
//            });
//    });
    dateRange();
});

function dateRange(){
    $('.daterangepicker_fee').daterangepicker({
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY',
            separator: ', '
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
}

function LoadMoreFeeWithdrawConfig(type) {
    $(".lead_error").html('');
    if (type == 'reset') {
        FeeWithdrawPage  = 1;
        $('#fee_withdraw_container').html("");
        $("#fee_withdraw_container").parent().hide();
    }
    
    $('#load_more_button').hide();
    if($("#college_id").val()==''){
        $("#load_msg_div").show();
        hideLoader();
        return;
    }
    var data = $('#FilterApplicationForms').serializeArray();
    data.push({name: "page", value: FeeWithdrawPage});
    $.ajax({
        url: '/fee-withdraw/withdraw-config-list',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function () {
           $('#parent').css('min-height', '50px');
           showLoader();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (response) {
			FeeWithdrawPage+=1;
			var responseObject = $.parseJSON(response); 
			if (responseObject.message === 'session'){
			window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
			}
				if(responseObject.status==1){
					data = responseObject.data.html.replace("<head/>", '');
					$('#fee_withdraw_container').parent().removeClass('hide');
					$('#fee_withdraw_container').append(data);
					if(typeof responseObject.data.totalRecords!=="undefined"){
						$("#totalRecords").html('Total <strong>'+responseObject.data.totalRecords+'</strong>&nbsp;Records');
					}
					$("#load_msg_div").hide();
					$("#fee_withdraw_container").parent().show();
			}else if(typeof responseObject.message!=="undefined" && responseObject.message!==''){
					alertPopup(responseObject.message,"error");
			}
			//filterClose();
			dropdownMenuPlacement();
			//determineDropDirection();
			$('.offCanvasModal').modal('hide');
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

function showStatusChangeConfirmationPopup(status,params){
    
    $('#ConfirmAlertYesBtn').unbind();
    $('#ConfirmAlertNoBtn').unbind();
    if(status==2){
        $('#ConfirmAlertPopUpTextArea').html("Do you want to disable?");
        $('#ConfirmAlertPopUpSection .modal-title').html("Disable Fee Withdraw Configuration");
    }else{
        $('#ConfirmAlertPopUpTextArea').html("Do you want to enable?");
        $('#ConfirmAlertPopUpSection .modal-title').html("Enable Fee Withdraw Configuration");
    }
    $("#ConfirmAlertPopUpSection").modal("show");
    $("#ConfirmAlertYesBtn").on("click",function(){
        changeStatusUser(params);
    });
}

function changeStatusUser(params) {
    
    $.ajax({
        url: '/fee-withdraw/changeStatus/'+params,
        type: 'get',
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
           showLoader();
        },
        success: function (json) {
            if (json['status'] == 1) { 
                alertPopup(json['message'],'success');
                $('#alertTitle').html('Success');
                LoadMoreFeeWithdrawConfig('reset');
                $('#OkBtn').show();      
            }
            else {
                // System Error
                alertPopup('Some Error occured, please try again.', 'error');
            }
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError);
        },
        complete: function () {
            hideLoader();
        }
    });
}

$('#OkBtn').on('click',function(){
    $("#SuccessPopupArea .npf-close").trigger('click');
});

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
    LoadMoreFeeWithdrawConfig('reset');
}

$('#OkBtn,.oktick').on('click',function(){
    $("#SuccessPopupArea").modal('hide');
});