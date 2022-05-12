// function: Get All Forms of a College
if(typeof jsVars.college_id!='undefined') {
    ajaxGetCounsellorList(jsVars.college_id);
}

function ajaxGetCounsellorList(CollegeId) 
{
    if (CollegeId) 
    {
        $.ajax({
            url: jsVars.ajaxUrlCommLog,
            type: 'post',
            data: {CollegeId: CollegeId},
            // dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json)
            {
                var obj_json = JSON.parse(json);
                if (obj_json.redirect){
                    location = obj_json.redirect;
                }else if (obj_json['error']){
                    alertPopup(obj_json.error, 'error');
                }
                obj_json = obj_json.data;
                var html = "<option value=''>Select Counsellors</option>";
                for (var key in obj_json) 
                {
                    var val = obj_json[key];
                    html += "<option value='" + key + "'>" + val + "</option>";
                }

                $('#commType').html(html);
                // $('#commType').val();
                $('#commType').trigger('chosen:updated');
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
}

var Page = 0;
function LoadMoreMobileActivityLogs(type) 
{
    var fetchCount = false;
    if($("#CollegeIdSelect").val() == '')
    {
        alertPopup("Please select college from filters","error");
        return false;
    }
    
    if (type == 'reset') {
        Page = 0; 
        fetchCount = true;
        $('#load_more_results').html("");
        $('#load_more_results_msg').html("");        
    }
    
    var requestData = $('#mobileActivityLogFilterForm, #callLogSearch').serializeArray();
    requestData.push({name: "page", value: Page});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-spin fa-refresh" aria-hidden="true"></i>&nbsp;Loading...');
    
    $.ajax({
        url: jsVars.LoadMoreMobileCommunicationLogs,
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
            data = data.replace("<head/>", '');
            Page = Page+ 1;
            if(data == "session_logout"){
               window.location.reload(true);
            }else if (data == "error") {
                if(Page>1) {
                    $('#load_more_results > tbody').append('<tr><td colspan="10"><div class="noDataFoundBlock"><div class="innerHtml"><img src="/img/no-record.png" alt="no-record"><span>No Data Found</span></div></div></td></tr>');
                } else {
                    $('#load_msg_div').show();
                    $('.table-responsive').addClass('table-border');
                    $('#load_msg').html('<div class="noDataFoundBlock"><div class="innerHtml"><img src="/img/no-record.png" alt="no-record"><span>No Data Found</span></div></div>');
                    
                }
                
                $('#load_more_button').hide();
                if (type != '' && Page==1) {                    
                    $('#if_record_exists').hide();
                  }
            }
            else {
                if (type != '') {
                    $('#if_record_exists').fadeIn();
                }
                
                $('#load_more_button').show();
                $('.table-border').removeClass('hide');
                if(Page==1) {
                    $('#load_more_results').append(data);
                    $('#selectionRow, .downloadBtn').show();
                } else {
                    $('#load_more_results > tbody > tr:last').after(data);
                }
                if(fetchCount)
                {
                    fetchMobileActivityLogsCount(requestData);
                }
                $('#load_msg_div').hide();
                $('.table-responsive').removeClass('table-border');
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Logs');
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

function fetchMobileActivityLogsCount(requestData) 
{
    requestData.push({name: "count", value: true});
    $.ajax({
        url: jsVars.fetchMobileCommunicationLogCount,
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: requestData,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $("#mobileLogCount").html("(Total " + data + " Records)");
        }
    });
}

function mobileLog_downloadCSV()
{
    
    if($('#downloadRequestUrl').val() =='' || $('#CollegeIdSelect').val() == null) {
        alertPopup('Please select Only One College and Apply Filter','error');
        return false;
    }
    
    if($('#downloadRequestUrl').val() != '') {
        $('#downloadListing').attr('href',$('#downloadRequestUrl').val());
    }
    //$('#downloadRequestUrl').val('');
    $('#confirmDownloadTitle').text('Download Confirmation');
    $('#ConfirmDownloadPopupArea .npf-close').hide();
    $('.confirmDownloadModalContent').text('Do you want to download the Call Logs?');
    $('#ConfirmDownloadPopupArea').modal();
    var $form = $("#mobileActivityLogFilterForm");
    $form.attr("action", jsVars.mobileActivtyLog_downloadCSV);
    $form.attr("target",'modalIframe');
    $form.append($("<input>").attr({"value":"export", "name":"type",'type':"hidden","id":"export"}));
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    $('#confirmDownloadYes').on('click',function(){   
        $('#ConfirmDownloadPopupArea').modal('hide');
        $form.append($("<input>").attr({"value": "export", "name": "export", 'type': "hidden", "id": "export"}));
        $( "#confirmDownloadYes").unbind( "click" );
        var data = $form.serializeArray();
        $.ajax({
            url: jsVars.mobileActivtyLog_downloadCSV,
            type: 'post',
            data : data,
            dataType:'html',
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            success:function (response){
                if(response != '') {
                    alertPopup(response,'error');
                } else {
                    $('#muliUtilityPopup').modal('show');
                    $('#muliUtilityPopup .close').addClass('npf-close').css('margin-top', '2px');
                }
            }
        });
        $form.attr("onsubmit", onsubmit_attr);
        $form.find('input[name="export"]').val("");
        $form.removeAttr("target");
        $form.removeAttr("onsubmit");
        $("#export").remove();
    }); 
    
}

$(document).ready(function(){
    $('#popupDismiss').on('click',function() {
        if($('#ConfirmDownloadPopupArea').length > 0) {
            $( "#confirmDownloadYes").unbind( "click" );
        }
    });
    $('#callLogSearch').on('submit', function(e){
        e.preventDefault();
        LoadMoreMobileActivityLogs("reset");
    })
});
