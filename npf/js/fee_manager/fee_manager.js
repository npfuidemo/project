$(document).ready(function(){
    var NPFScorePanel=0;
    var FeeManagerPage=1;
    var templateFlag=0;
    $(".erroralert").delay(5000).slideUp(300);
    $(".successalert").delay(5000).slideUp(300);
    
    $(function(){
        $('[rel="popover"]').popover({
                container: 'body',
                html: true,
                content: function () {
                    var clone = $($(this).data('popover-content')).clone(true).removeClass('hide');
                    return clone;
                }
            }).click(function(e) {
                e.preventDefault();
            });
    });
    
});

function dateRange(){
    $('.daterangepicker_fee').daterangepicker({
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
}

function LoadMoreFeeConfig(type) {
    $(".lead_error").html('');
//    if($('#college_id').val() == '' || $('#college_id').val() == '0' ){
//        $('#college_error').html('<small class="text-danger">Please Select Institute</small>');
//        return false;
//    }
    
    if (type == 'reset') {
        FeeManagerPage = 1;
    }
    
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').hide();
    var data = $('#FilterApplicationForms').serializeArray();
    data.push({name: "page", value: FeeManagerPage});
    
    $.ajax({
        url: '/fee/fee-list',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function () {
           $('#parent').css('min-height', '50px');
           showLoader();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (response) {
	    FeeManagerPage+=1;
        $('.offCanvasModal').modal('hide');
	    var responseObject = $.parseJSON(response); 
	    if (responseObject.message === 'session'){
		window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
	    }else if(responseObject.message ==="no_record_found"){
                if(FeeManagerPage==2){
                    $('#load_msg_div').html("<div class='noDataFoundDiv'><div class='innerHtml'><img src='/img/no-record.png'><span>No Fee Configuration Found</span></div></div>");
                    $('#load_msg_div').show();
					$('#load_more_results').parent().addClass('hide');
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Fee Configuration");
                    $('#load_more_button').hide();
					if ($(window).width() < 992) {
						filterClose();
					}
                }else {
                    $('#load_msg').html('');
                    $('#load_msg_div').hide();
                    $('#load_more_button').html("<i class='fa fa-database' aria-hidden='true'></i>&nbsp;No More Fee Configuration");
                    $('#load_more_button').show();
                }
                if (type != '' && FeeManagerPage==2) {
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
                $('#load_msg_div').hide();
				$('#parent').show();
                $('.itemsCount').show();
				$('body').css('padding-right', '0px');
				filterClose();		
                var ttl = $('#current_record').val(); 
		
                if(parseInt(ttl) < 10){
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Fee Configuration");
                    $('#load_more_button').hide();
                }else{
                    $('#load_more_button').removeAttr("disabled");
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Fee Configuration");
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
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Fee Configuration");
                 if (type != '') {
                        $('#if_record_exists').hide();
                 }
		filterClose();
        dropdownMenuPlacement();
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

$("#form_fields").change(function(){
    getDropdownValueList(this.value);
});


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
		//$('#form_id').attr('onChange','getAllDropdown(this.value)');
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                $("#form_id").change(function(){
                    $("#ack_receipt_template").html('<option selected="selected" value="">Select Receipt Template</option>');
                    $("#online_email_template").html('<option selected="selected" value="">Select Email Template</option>');
                    $("#online_sms_template").html('<option selected="selected" value="">Select SMS Template</option>');
                    $("#cash_email_template").html('<option selected="selected" value="">Select Email Template</option>');
                    $("#cash_sms_template").html('<option selected="selected" value="">Select SMS Template</option>');
                    $('.chosen-select').trigger('chosen:updated');
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

function showEmailConfirmationPopup(firstData,from){
    
    var currentObj = $('#userChangeStatus_'+firstData);
    var status = currentObj.attr('alt');
    var data = currentObj.attr('data');
    if(status==2){
        $('#ConfirmAlertYesBtn').unbind();
        $('#ConfirmAlertNoBtn').unbind();
        $('#ConfirmAlertPopUpTextArea').html("Do you want to enable?");
        $('#ConfirmAlertPopUpSection .modal-title').html("Enable Fee Configuration");
        $("#ConfirmAlertPopUpSection").modal("show");
        $("#ConfirmAlertYesBtn").on("click",function(){
            changeStatusUser(firstData, status, data,from);
        });
    }else{
        $('#ConfirmAlertYesBtn').unbind();
        $('#ConfirmAlertNoBtn').unbind();
        $('#ConfirmAlertPopUpTextArea').html("Do you want to disable?");
        $('#ConfirmAlertPopUpSection .modal-title').html("Disable Fee Configuration");
        $("#ConfirmAlertPopUpSection").modal("show");
        $("#ConfirmAlertYesBtn").on("click",function(){
            changeStatusUser(firstData, status, data,from);
        });
    }
}

function changeStatusUser(id, status, data,from) {
    
    $.ajax({
        url: '/fee/changeFeeConfigStatus',
        type: 'post',
        data: {'id': id, 'status': status,'data':data},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
           showLoader();
        },
        success: function (json) {
            if (json['status'] == 200) { 
                alertPopup(json['message'],'success');
                $('#alertTitle').html('Success');
                LoadMoreFeeConfig('reset');
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
    LoadMoreFeeConfig('reset');
}
