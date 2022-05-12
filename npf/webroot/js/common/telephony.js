var loadMsg = "<i class='fa fa-refresh'></i> Load More Logs";
var defaultMsgResponsePaymnet = "Please select a college to view telephony data logs";
var Page = 0;
$(document).ready(function () {
    $('#telephonyLogType').SumoSelect({placeholder: 'Log Type', search: true, searchText: 'Log Type', selectAll: true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false});
    ResetTelephonyDataLogFilterValue();
    LoadReportDateRangepicker();
    LoadTelephonyDataLog('reset');
});

//data display
function LoadTelephonyDataLog(type) {
    $('#push_application').hide();
    if (type == 'reset') {
        Page = 0;
        $('#load_more_results').html("");
        $('#load_more_results_msg').html("");
        $('#load_more_results_msg').show("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
        $('button[name="search_btn"]').attr('disabled', 'disabled');

    }
    var data = $('#filterTelephonyLogForm').serializeArray();
    data.push({name: "page", value: Page});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $.ajax({
        url: '/datalogs/ajax-lists-telephony-data-log',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('button[name="search_btn"]').removeAttr('disabled');
            $('.offCanvasModal').modal('hide');
            Page = Page + 1;
            if (data == "session_logout") {
                window.location.href = '/admin-login';
            } else if (data == "error") {
                if (data == "college_missing") {
                    error_html = "Please select a college.";
                } else {
                    if (Page == 1) {
                        error_html = "No Records found";
                    } else {
                        error_html = "No More Record";
                    }
                }
                $('#load_more_results_msg').append("<div class='one'>" + error_html + "</div>");
                $('#load_more_button').html(loadMsg);
                $('#load_more_button').hide();
                if (type != '' && Page == 1) {
                    $('#if_record_exists').hide();
                }
            } 
            
            else if (data == "no_data_found" ) {
                if (data == "college_missing") {
                    error_html = "Please select a college.";
                } else {
                    if (Page == 1) {
                        error_html = "No Records found";
                        $('#load_more_results_msg').append("<div class='noDataFoundDiv'><div class='innerHtml'><img src='/img/no-record.png'><span>" + error_html + "</span></div></div>");
                        $('#load_more_button').html(loadMsg);
                        $('#parent').removeClass("newTableStyle");
                    } else {
                        error_html = "No More Record";
                        $('#load_more_results_msg').append("<div class='text-danger text-center margin-top-10'>" + error_html + "</div>");
                        $('#load_more_button').html(loadMsg);
                    }
                }

                $('#load_more_button').hide();
                if (type != '' && Page == 1) {
                    $('#if_record_exists').hide();
                }
            }


            else if (data == "college_missing") {
                if (data == "college_missing") {
                    error_html = "Please select a college from filter and click apply to view Telephony Data Logs.";
                } else {
                    if (Page == 1) {
                        error_html = "No Records found";
                    } else {
                        error_html = "No More Record";
                    }
                }
                $('#load_more_results_msg').append("<div id='load_msg_div'><div class='aligner-middle'><div class='text-center text-info font16'><span class='lineicon-43 alignerIcon'></span><br><span id='load_msg'>" + error_html + "</span></div></div></div>");
                $('#load_more_button').html(loadMsg);
                $('#load_more_button').hide();
                $('#parent').removeClass("newTableStyle");
                if (type != '' && Page == 1) {
                    $('#if_record_exists').hide();
                }
            } 


            else {
                data = data.replace("<head/>", '');
                $('#load_more_results').append(data);
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html(loadMsg);
                if (type != '') {
                    $('#if_record_exists').fadeIn();
                    $('#parent').addClass("newTableStyle");
                }
                //$.material.init();
                //table_fix_rowcol();
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}


//reset value of form
function ResetTelephonyDataLogFilterValue() {

    $('#filterTelephonyLogForm select#college_id').val('');
    $('#filterTelephonyLogForm select#college_id').trigger("chosen:updated");
    $('#filterTelephonyLogForm select#telephonyVendor').val('');
    $('#filterTelephonyLogForm select#telephonyVendor').trigger("chosen:updated");
    $('#filterTelephonyLogForm select#telephonyLogType').val('');
    $('#filterTelephonyLogForm select#telephonyLogType')[0].sumo.reload();
    $('#filterTelephonyLogForm #log_date').val('');
    $('#filterTelephonyLogForm #search_common').val('');
    //$('#load_more_results').html('<tbody><tr><td><div class="col-md-12"><br><div class="alert alert-danger">' + defaultMsgResponsePaymnet + '</div></div></td></tr><tr></tr></tbody>');
    $('#if_record_exists').hide();
    $('#load_more_results_msg').html("");
    $('#load_more_button').hide();
    return false;
}


//show data in popup
function showResponseData(mongoId, collegeId) {
  
    $.ajax({
        url: '/datalogs/telephony-log',
        type: 'post',
        dataType: 'html',
        data: {'mongoId': mongoId, 'collegeId' : collegeId},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (responseData) {
            $('#telephonyDataLogPopup #mainData').html(responseData);
            $("#telephonyDataLogLink").trigger('click');
        },
        error: function (errorData) {
            $('#telephonyDataLogPopup #mainData').html(errorData);
            $("#telephonyDataLogLink").trigger('click');
        }
    });
    
}
