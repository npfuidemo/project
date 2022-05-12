function deleteAppNotification(id)
{
    if (id) 
    {
        if (!confirm('Are you sure you want to delete this notification?')) 
        {
            ev.stopImmediatePropagation();
            ev.preventDefault();
            return false;
        }

        $.ajax({
            url: jsVars.deleteAppNotification,
            type: 'post',
            data: {id: id},
            // dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json)
            {
                if(json == "session_logout"){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else
                {
                    var obj_json = JSON.parse(json);
                    if (obj_json['error']){
                        alertPopup(obj_json.error, 'error');
                    }else
                    {
                        obj_json = obj_json.status;
                        var html = ''
                        if(obj_json)
                        {
                            html = "Deleted Successfully!"
                        }else
                        {
                            html = "Something went wrong!"
                        }

                        $("#StatusDetailPopupHTMLSection").html(html)
                        $("#StatusDetailPopupArea .modal-title").html("")
                        $('#StatusDetailPopupArea').modal('show')
                        LoadMoreAppNotifications('reset')
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }

}


var Page = 1;
function LoadMoreAppNotificationsReport(type) 
{
    // if($('#CollegeIdSelect').val() == '' || $('#CollegeIdSelect').val() == '0' )
    // {
    //     $('.topSearch').addClass('hide');
    //     $('.bulk_download_btn').addClass('hide');
    //     $('#load_msg_div').show();
    //     $('#load_msg').html('Please select an Institute Name from filter and click apply to view App Notifications.');
    //     return false;
    // }

    // $('.topSearch').removeClass('hide');
    // $('.bulk_download_btn').removeClass('hide');

    if (type == 'reset') {
        Page = 0; 
        $('#load_more_results').html("");
        $('#load_more_results_msg').html("");        
    }
    var requestData = $('#appNotificationsReportFilterForm, #appNotificationsReportFilterForm1').serializeArray();
    requestData.push({name: "page", value: Page});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-spin fa-refresh" aria-hidden="true"></i>&nbsp;Loading...');
    $.ajax({
        url: jsVars.ajaxAppNotificationReports,
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: requestData,
        beforeSend: function (xhr) {
            $('#listloader').show();
            $('#searchList').prop("disabled",true);
            $('.daterangepicker_report').prop('disabled', true);
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            Page = Page+ 1;
            if(data == "session_logout"){
               location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (data == "error") {
                if(Page>1) {
                    $('#load_more_results > tbody').append('<tr><td colspan="10"><h4 class="text-center text-danger">No More Record</h4></td></tr>');
                } else {
                    $("#targetTotal").html('');
                    // $("#dataContainer").fadeOut();
                    $(".modalButton").hide();
                    $('#load_msg_div').show();
                    $('#load_msg').html('No Record Found');
                }
                
                $('#load_more_button').hide();
                if (type != '' && Page==1) {                    
                    $('#if_record_exists').hide();
                  }
            }else {
                data = data.replace("<head/>", '');
                $("#dataContainer").fadeIn();
                if (type != '') {
                    $('#if_record_exists').fadeIn();
                }
                $(".modalButton").show();
                $('.table-border').removeClass('hide');
                if(Page==1) {
                    $('#load_more_results').append(data);
                    $('#selectionRow, .downloadBtn').show();
                } else {
                    $('#load_more_results > tbody > tr:last').after(data);
                }
                
                if($('#current_count').val() >= 10){
                    $('#load_more_button').show();
                }else{
                    $('#load_more_button').hide();
                }
                $('#load_msg_div').hide();
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Users');
            }
            $('.offCanvasModal').modal('hide');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $("input[name=page]").val(Page);
            $('#listloader').hide();
            $('#searchList').prop("disabled",false);
            $('.daterangepicker_report').prop('disabled', false);
        }
    });
}

$("body" ).on("click", ".modalPreview", function() {
    var preview = $(this).attr('data-preview');
    $("#StatusDetailPopupHTMLSection").html(preview)
    $("#StatusDetailPopupArea .modal-title").html("Preview")
    $('#StatusDetailPopupArea').modal('show');
});

$('.datepicker').datepicker({startView : 'month', format : 'dd/mm/yyyy', enableYearToMonth: true, enableMonthToDay : true});

// $('body').on('click',".modalButton", function(e) {
//     var src = $(this).attr('data-src');
//     $("#myModal iframe").attr('src', src);
// });

// $('#myModal').on('hidden.bs.modal', function(){
//     $("#modalIframe").html("");
//     $("#modalIframe").attr("src", "");
// });

var downloadAppNotificationFile = function(url){
    if(url!=='' && url !==null && typeof(url) !== "undefined"){
        window.open(url, "_self");
    }
};

$('#downloadBulkAppNotif').on('click', function () 
{
    LoadMoreAppNotifications('reset');
});

$('.modalButton').on('click',function()
{   

    if($('#jobId').val() == "" || $('#jobId').val() == "0") {
        alertPopup("Missing Job Id!",'error');
        return false;
    }

    var requestData = $('#appNotificationsReportFilterForm, #appNotificationsReportFilterForm1').serializeArray();
    requestData.push({name: "downloadType", value: "app_notification_job_detailed"});
    $.ajax({ 
        url: jsVars.ajaxDownloadAppNotifications,
        type: 'post',
        data : requestData,
        dataType:'html', 
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success:function (response) {
            if(response == 'session_logout') {
                window.location.href = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(response.indexOf('request_already_pending|||') >= 0) {
                alertPopup(response.split('request_already_pending|||')[1],'error');
            } else if(response == 'Invalid request.') {
                alertPopup('Something went wrong.','error');
            }else if(response == 'Invalid Job Id.') { //zero record stage changed
                alertPopup(response,'error');
            } else {
                $('#muliUtilityPopup').modal('show');
                $('#requestMessage').html('job detailed');    
                $('#downloadListing').show();
                $('#downloadListingExcel').hide();
                $('#downloadListing').attr('href', response);
            
                $('#muliUtilityPopup .close').addClass('npf-close').css('margin-top', '2px');
            }
        }
    });
});


$('#jobId').keypress(function (e) {
 var key = e.which;
 if(key == 13)  // the enter key code
  {
    LoadMoreAppNotificationsReport('reset');
    return false;  
  }
});