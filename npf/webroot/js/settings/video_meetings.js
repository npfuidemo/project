//$.material.init();
$(document).ready(function () {
    $('#college_id').SumoSelect({placeholder: 'Listing Fields', search: true, searchText:'Listing Fields', selectAll : false, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });  
    //$('#form_id').SumoSelect({placeholder: 'Evaluators', search: true, searchText:'Search Evaluators', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });  
    var NPFScorePanel=0;
    LoadReportDateRangepicker();
    $(".erroralert").delay(5000).slideUp(300);
    $(".successalert").delay(5000).slideUp(300);
});


function getVideoMeetings(type){
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
    var data = $('#VideoMeetings').serializeArray();
    data.push({name: "page", value: NPFScorePanel});
    $.ajax({
        url: '/settings/ajax-video-meetings',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function () {
           $('#parent').css('min-height', '50px');
           $('#searchBtnreset').attr('disabled',true);
           showLoader();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            NPFScorePanel = NPFScorePanel + 1;
            if(data=='session_logout'){
                window.location.reload(true);
            }else if(data=='invalid_request_csrf'){
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;Load more Meetings");
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
                
                if(parseInt(ttl) < $('#items-no-show').val()){
                    $('#LoadMoreArea').hide();
                }else{
                    $('#LoadMoreArea').show();
                }
                $('#load_more_results').closest('div').addClass('table-border');
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;Load More Meetings");
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
            $('#searchBtnreset').attr('disabled',false);
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

$('html').on('change','#form_id',function(){
    if($('#form_id').val() > 0){
        var college_id = $('#college_id').val();
        var form_id = $('#form_id').val();
        getPanelList(college_id,form_id);
    }else {
       $('#panel_id').html('');
       $("#panel_id").trigger('chosen:updated');
    }
});

function getPanelList(college_id, form_id){
    $.ajax({
        url: '/settings/getPanelList',
        type: 'post',
        dataType: 'html',
        data: {'college_id':college_id,'form_id':form_id},
        beforeSend: function () { 
            //$('#listloader').show();
        },
        complete:function(){
            //$('#listloader').hide();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        async:false,
        success: function (html) {
            var responseObject = $.parseJSON(html);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            
            if (responseObject.status == 1) {
                $('#panel_id').html(responseObject.data);
                $("#panel_id").trigger('chosen:updated');
            } else {
                //alertPopup(responseObject.message, 'error');
                console.log(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //window.location.reload(true);
        }
    });
}

function commConfirmationPopup(key,college_id){
    $('#ConfirmAlertYesBtn').unbind();
    $('#ConfirmAlertNoBtn').unbind();
    $('#ConfirmAlertPopUpTextArea').html("Communication will be sent to Applicants.Are you sure ?");
    $("#ConfirmAlertPopUpSection").modal("show");
    $("#ConfirmAlertYesBtn").on("click",function(){
        communicate(key,college_id);
    });
}

function bulkCommunicate(){
    if($('input:checkbox[name="selected_meetings[]"]:checked').length < 1 && $('#select_all:checked').val()!='select_all'){
        alertPopup('Please select Meetings','error');
        return;
    }
    if($('#college_id').val() > 0){
        var college_id = $('#college_id').val();
        commConfirmationPopup('bulk',college_id);
    }
}

function communicate(key,college_id) {
    var meetings = [];
    if(key == 'bulk'){
        $('input:checkbox[name="selected_meetings[]"]').each(function () {
            if (this.checked) {
                meetings.push($(this).val());
            }
        });
        if ($('#select_all:checked').val() == 'select_all') {
            var data = $('#VideoMeetings').serializeArray();
            data.push({name: "key", value: 'all'}); 
            data.push({name:'collegeId',value: $("#college_id").val()});
        } else {
            var data = {'key': meetings, 'collegeId': $("#college_id").val()};
        }
    } else {
        meetings.push(key);
        var data = {'key': meetings, 'collegeId': $("#college_id").val()};
    }
    $.ajax({
        url: jsVars.communicateMeetingInvite,
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
           showLoader();
        },
        success: function (json) {
            if (json['status'] == 1) {
                alertPopupAssignedInstitute(json['message'],'success');
                $('#alertTitle').html('Success');
            }else {
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


$('#OkBtn').on('click',function(){
    $("#SuccessPopupArea .npf-close").trigger('click');
});


function viewDetail(id,collection_name,key_name){
    if(typeof key_name == 'undefined'){
        key_name = '';
    }
    $.ajax({
        url: jsVars.viewMeetingDetail,
        type: 'post',
        dataType: 'html',
        data: {id:id,collection_name:collection_name,key_name:key_name},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            data = data.replace("<head/>", '');
            if (data == "session_logout") {
                window.location.reload(true);
            }
            else {
                
                jQuery("#mongoDocumentList").html(data);
                jQuery("#mongoDoc").modal();    
                
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$(document).on('click', '.select_meeting',function(e) {
    var recordOnDisplay = $('input:checkbox[name="selected_meetings[]"]').length;
    var selected_records = $('.select_meeting:checked').length;
    $('#select_page_users').attr('checked',false);
    $('#select_all').attr('checked',false);
    if(selected_records<1){
        $("#selectionRow").hide();
        $("#selectAllAvailableRecordsLink").hide();
        $("#clearSelectionLink").hide();
        $('#li_bulkCommunicationAction').hide();
    }else{
        var display_message = selected_records+" meetings on this page are selected. ";
        if(selected_records == recordOnDisplay){
            display_message = "All "+selected_records+" meetings on this page are selected. ";
            $('#select_page_users').attr('checked',true);
            $('#select_page_users').trigger('click');
        }
        $("#selectionRow").show();
        $("#currentSelectionMessage").html(display_message);
        $("#selectAllAvailableRecordsLinkSpan").html('<a id="selectAllAvailableRecordsLink" href="javascript:void(0);" onclick="selectAllAvailableRecords('+ $("#all_records_val").val() +');"> Select all <b>'+ $("#all_records_val").val() +'</b>&nbsp;applications</a>');
        $("#selectAllAvailableRecordsLink").show();
        $("#clearSelectionLink").hide();
        if(selected_records>1){
            $('#li_bulkCommunicationAction').show();
        }
    }
    // $('#select_page_users').attr('checked',false);
});

function selectAllAvailableRecords(totalAvailableRecords){
    if($('#select_page_users').is(":checked")===false){
        $('#select_page_users').trigger('click');
    }
    $("#selectionRow").show();
    $("#selectAllAvailableRecordsLink").hide();
    $("#clearSelectionLink").show();
    $("#currentSelectionMessage").html("All "+totalAvailableRecords+" applications are selected.");
    $('#select_all').each(function(){
        this.checked = true;
    });
    // $('.select_application').attr('checked',true);
}

function clearSelection(){
    $("#selectionRow").hide();
    $("#selectAllAvailableRecordsLink").hide();
    $("#clearSelectionLink").hide();
    $('.select_meeting').attr('checked',false);
    $('#select_page_users').attr('checked',false);
    $('#select_all').attr('checked',false);
}

function selectAllMeetings(elem){
    
    $("#selectionRow").hide();
    $("#clearSelectionLink").hide();
    $('#select_all').attr('checked',false);
    if(elem.checked){
        //console.log(elem.checked);
        $("#selectAllAvailableRecordsLinkSpan").html('<a id="selectAllAvailableRecordsLink" href="javascript:void(0);" onclick="selectAllAvailableRecords('+ $("#all_records_val").val() +');"> Select all <b>'+ $("#all_records_val").val() +'</b>&nbsp;meetings</a>');
        $('.select_meeting').each(function(){
            this.checked = true;
        });
        var recordOnDisplay = $('input:checkbox[name="selected_meetings[]"]').length;
        $("#currentSelectionMessage").html("All "+recordOnDisplay+" meetings on this page are selected. ");
        $("#selectionRow").show();
        $("#selectAllAvailableRecordsLink").show();
        $("#clearSelectionLink").hide();
        $('#li_bulkCommunicationAction').show();
    }else{
        $('.select_meeting').attr('checked',false);
        $("#selectAllAvailableRecordsLink").hide();
        $('#li_bulkCommunicationAction').hide();
    }
    $('div.loader-block').hide();
}

$(document).on('click', '.select_meeting',function(e) {
    $('#select_all').attr('checked',false);
});