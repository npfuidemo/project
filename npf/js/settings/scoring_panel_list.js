//$.material.init();
$(document).ready(function () {
    $('#college_id').SumoSelect({placeholder: 'Listing Fields', search: true, searchText:'Listing Fields', selectAll : false, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });  
    $('#form_id').SumoSelect({placeholder: 'Evaluators', search: true, searchText:'Search Evaluators', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });  
    var NPFScorePanel=0;
    LoadReportDateRangepicker();
    $(".erroralert").delay(5000).slideUp(300);
    $(".successalert").delay(5000).slideUp(300);
});


function getScorePanelList(type){
    if (type == 'reset') {
        NPFScorePanel = 0;
        $('#load_more_results').closest('div').removeClass('table-border');
        $('.if_record_exists').hide();
        $('#load_more_results').html("");
        $('#load_more_results_msg').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
    }
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').hide();
    var data = $('#FilterScorePanel').serializeArray();
    data.push({name: "page", value: NPFScorePanel});
    
    $.ajax({
        url: '/settings/ajax-scoring-panel',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function () {
           $('#parent').css('min-height', '50px');
           showLoader();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            NPFScorePanel = NPFScorePanel + 1;
            if(data=='session_logout'){
                window.location.reload(true);
            }else if(data=='invalid_request_csrf'){
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;Load more users");
                $('#load_more_button').hide();
                $('.if_record_exists').hide();
				$('#load_msg_div').show();
                $('#load_msg').html('Invalid Request.');
            }else if(data=='no_record_found'){
                $('#load_more_button').html("Load More Leads");
                $('#load_more_button').hide();
                if(NPFScorePanel==1){
					$('#load_msg_div').show();
                    $('#load_msg').html('No Record Found');
                }else{
                    $('#load_more_results_msg').html('<div class="text-center text-danger">No More Record</div>');
                }
            }else if(data=='select_college'){
                $('#load_more_button').html("");
                $('#load_more_button').hide();
                $('#load_msg_div').show();
                $('#load_msg').html('Please Select Institute.');
                
            }else{
                data = data.replace("<head/>", '');
                $('#load_more_results').append(data);
				$('#load_msg_div').hide();
                var ttl = $('#current_record').val();  
                
                if(parseInt(ttl) < 10){
                    $('#LoadMoreArea').hide();
                }else{
                    $('#LoadMoreArea').show();
                }
                $('#load_more_results').closest('div').addClass('table-border');
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;Load More Users");
                $('.if_record_exists').fadeIn();
                $('#load_more_button').fadeIn();
				$('.hide_extraparam').show();
				$('.offCanvasModal').modal('hide');
            }
			dropdownMenuPlacement();
			determineDropDirection();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //window.location.reload(true);
        },
        complete: function () {
            hideLoader();
        }
    });
}

function getAllFormList(cid, default_val, multiselect) {
    if(typeof default_val=='undefined'){
        default_val = '';
    }
    if(typeof multiselect=='undefined'){
        multiselect = '';
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

function showEmailConfirmationPopup(firstData,from){
    
    var currentObj = $('#userChangeStatus_'+firstData);
    var status = currentObj.attr('alt');
    var data = currentObj.attr('data');
    if(status==0){
        $('#ConfirmAlertYesBtn').unbind();
        $('#ConfirmAlertNoBtn').unbind();
        $('#ConfirmAlertPopUpTextArea').html("Do you want to enable?");
        $('#ConfirmAlertPopUpSection .modal-title').html("Enable Panel");
        $("#ConfirmAlertPopUpSection").modal("show");
        $("#ConfirmAlertYesBtn").on("click",function(){
            changeStatusUser(firstData, status, data,from);
        });
    }else{
        $('#ConfirmAlertYesBtn').unbind();
        $('#ConfirmAlertNoBtn').unbind();
        $('#ConfirmAlertPopUpTextArea').html("Do you want to disable?");
        $('#ConfirmAlertPopUpSection .modal-title').html("Disable Panel");
        $("#ConfirmAlertPopUpSection").modal("show");
        $("#ConfirmAlertYesBtn").on("click",function(){
            changeStatusUser(firstData, status, data,from);
        });
    }
}

function changeStatusUser(id, status, data,from) {
    
    $.ajax({
        url: '/settings/changePanelStatus',
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
                
                alertPopupAssignedInstitute(json['message'],'success');
                $('#alertTitle').html('Success');
                getScorePanelList('reset');
                $('#OkBtn').show();
                
            }
            else {
                // System Error
                alert('Some Error occured, please try again.', 'error');
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

function alertPopupAssignedInstitute(msg, type, location) {

    if (type == 'error') {
        var selector_parent = '#ErrorPopupArea';
        var selector_titleID = '#ErroralertTitle';
        var selector_msg = '#ErrorMsgBody';
        var btn = '#ErrorOkBtn';
        var title_msg = 'Error';
    } else {
        var selector_parent = '#SuccessPopupArea';
        var selector_titleID = '#alertTitle';
        var selector_msg = '#MsgBody';
        var btn = '#OkBtn';
        var title_msg = 'Success';
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
    }
    else {
        $(selector_parent).modal();
    }
}

$('#OkBtn').on('click',function(){
    $("#SuccessPopupArea .npf-close").trigger('click');
});