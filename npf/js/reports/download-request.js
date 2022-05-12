/****For display requested listing***/
function downloadRequestList(listingType) {
   //make buttun disable
    var search=$('#requestIDsearch').val();
    if($("#s_college_id").val() == ''){
        $('#download_report_container').html('');
        $('#load_msg_div').show();
        $("#download_report_container, #if_record_exists, #load_more_button").hide();
        $('#college_error').html('<small class="text-danger">Please Select Institute</small>');
        return false;
    }
    if (listingType === 'reset') {
        varPage = 0;
        $('#download_report_container').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
    }
    $('#export_type').val($('#download_medium').val()) ;
    data = $('#DownloadReportForm').serializeArray();
    data.push({name: "page", value: varPage});
    data.push({name: "sText", value: $('#requestIDsearch').val()});

    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $.ajax({
        url: jsVars.FULL_URL + '/reports/download-ajax-request-lists',
        type: 'post',
        dataType: 'html',
        data: data,
	async: true,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
	beforeSend: function () {
            $('#downloadReportLoader').show();
            $('.daterangepicker_report').prop('disabled', true);
            $('#college_error').html('');
        },
        complete: function () {
            $('#downloadReportLoader').hide();
            $('.daterangepicker_report').prop('disabled', false);
        },
        success: function (data){

            varPage = varPage + 1;
            var checkError  = data.substring(0, 6);
            if (data === "session_logout") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(data.substring(6, data.length));
                $('#load_more_button').hide();
            } else {
		    $('#load_msg_div').hide();
		    $('#download_report_container, #table-data-view, .download-after-data, #if_record_exists, #load_more_button').show();
                data = data.replace("<head/>", '');
                var countRecord = countResult(data);

                if (listingType === 'reset') {
                    $('#download_report_container').html(data);
                } else {
                    $('#download_report_container').find("tbody").append(data);
                }
                if (countRecord < 10) {

                    $('#load_more_button').hide();
                } else {

                    $('#load_more_button').show();
                }
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Data');
                $('[data-toggle="popover"]').popover();
                // dropdownMenuPlacement();
            }
            $('.offCanvasModal').modal('hide');
            dropdownMenuPlacement();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
//Reset all avlue
function resetDownloadReport(){
    $('#requestIDsearch').val('');
    $('#s_college_id').val('');
    $('#download_medium').val('');
    $('#requestIDsearch').val();
    $('.chosen-select').trigger('chosen:updated');
    $('#created_on').val('');
    downloadRequestList('reset');
}
/***
 *
 * @param {type} LogId
 * @param {type} Section
 * @returns {Get filter list}
 *
 */
function GetRequestedFilter(LogId,Section)
{
    $.ajax({
        url: jsVars.FULL_URL + '/reports/download-request-filter-records',//downloadRequestFilterRecords
        type: 'post',
        dataType: 'html',
        data: {
            LogId: LogId,
            Section: Section
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function() {
            $('.loader-block').show();
        },
        complete: function() {
            $('.loader-block').hide();
        },
        success: function (html) {
            if(html == 'session')
            {
                alertPopup('User session has expired.','error');
            }

            if(html == 'error')
            {
                alertPopup('Unable to process request.','error');
            }
            else if(html == 'empty')
            {
                alertPopup('No data found.','error');
            }
            else
            {
                var Title = 'Alert';
                if(Section == 'report')
                {
                    Title = 'Report';
                }
                else if(Section == 'preview')
                {
                    Title = 'Preview';
                }
                else if(Section == 'json_criteria')
                {
                    Title = 'Search Criteria';
                }else if(Section == 'debug')
                {
                    Title = 'Debug Log';
                }
                $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
                //$('#ActivityLogPopupTitle').text(Title);
                $('#ActivityLogPopupArea h2').html(Title);
                $('#ActivityLogPopupHTMLSection').html(html);
                $('#ActivityLogPopupLink').trigger('click');
	        $('#ActivityLogPopupArea .modal-dialog').addClass('modal-lg');
                if(Section=='download' || Section=='download_data') {
                    $(".modalButtonDR").trigger('click');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
function requestPageDownloadUrl(url) {
    window.open(url, '_blank');
}
function rescheduleDocumentDownload(urlParams = ""){
    $.ajax({
        url: '/reschedule-download',
        type: 'post',
        dataType: 'html',
        data: {'urlParams':urlParams},
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            data = JSON.parse(data);
            if(data.success !== 'undefined' && data.success == 200) {
                alert(data.msg);
            } else if(data.error !== 'undefined') {
                alert(data.error);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
$(document).keypress(
  function(event){
    if (event.which == '13') {
      event.preventDefault();
    }
});

 $(document).ready(function (){
    var currObj;
    var urlSplit=window.location.pathname.split('/');
    if(urlSplit[3] !='' && urlSplit[3]!=undefined){
        downloadRequestList('reset');
    }
 });



 $(document).ready(function (){
    var urlSplit=window.location.pathname.split('/');
    if((urlSplit[3] !='' && urlSplit[3]!=undefined) || jsVars.showData==1){
        downloadRequestList('reset');
    }
 });


function cancelDownloadRequest(LogId)
{
    $("#ConfirmPopupArea").css({'z-index': '120000'});
    $('#ConfirmMsgBody').html('Are you sure you want to cancel the Download Request?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $('#ConfirmPopupArea').modal('hide');

        $.ajax({
            url: jsVars.FULL_URL + '/reports/cancelDownloadRequest',
            type: 'post',
            dataType: 'json',
            data: {id: LogId, action: "cancel"},
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('.loader-block').show();
            },
            complete: function () {
                $('.loader-block').hide();
            },
            success: function (json) {
                if (json['redirect']) {
                    location = json['redirect'];
                }
                if (json['error']) {
                    alertPopup(json['error'], 'error');
                } else if (json['success']) {
                    alertPopup(json['msg'], 'success');
                    $('#search_btn_hit').trigger('click');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });
}

function alertPopup(msg, type, location) {
    if (type === 'error') {
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

    if (typeof location !== 'undefined') {
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

function downloadFile(download_id){
    $.ajax({
        url: jsVars.FULL_URL + '/reports/download-request-file-ajax',
        type: 'post',
        dataType: 'json',
        data: {r: download_id},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
        },
        success: function (json) {
            if(json == 'session')
            {
                alertPopup('User session has expired.','error');
            }else if (typeof json['redirect']!='undefined' && json['redirect']!='') {
                location = json['redirect'];
            }else if (json['error']) {
                alertPopup(json['error'], 'error');
            }
            $('.loader-block').hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
           $('.loader-block').hide();
        }
    });
}

function checkChildRequest(parent_id,obj){
    if($(".parent_off_"+parent_id).length >0){
        $(".parent_off_"+parent_id).remove();
        $("#collapse_request_"+parent_id).attr("aria-expanded","false");
        $(obj).parent().parent().removeClass("parent-request");
        return;
    }else{
        $("#collapse_request_"+parent_id).attr("aria-expanded","true");
         $(obj).parent().parent().addClass("parent-request");
    }
//    debugger;
   
    $.ajax({
        url: jsVars.FULL_URL + '/reports/download-ajax-child-request-lists',
        type: 'post',
        dataType: 'html',
        data: {r: parent_id},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $(".childRequestli").remove();
        },
        success: function (response) {
            $("#main_request_"+parent_id).after(response);
            dropdownMenuPlacement();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
           $('.loader-block').hide();
        }
    });
}
