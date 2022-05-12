$(document).on('click', '.ivr-log-details', function(){
    var mongoid = $(this).data('mid');
    var cid = $(this).attr('title');
    var vender = $(this).data('vender');
    if(typeof mongoid !='undefined' && mongoid!=''){
        $.ajax({
            url: jsVars.getIvrDetailsLink,
            data: {mongoId: mongoid,collegeId: cid,vender:vender},
            dataType: "html",
            async: false,
            cache: false,
            type: "POST",
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('body div.loader-block').show();
                $("#ConfirmPopupArea").modal('hide');
            },
            complete: function () {
                $('body div.loader-block').hide();
            },
            success: function (data) {
                if (data === 'session_logout'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }
                data = data.replace("<head/>", '');
                $('#ActivityLogPopupArea .modal-title').html('Call Logs');
                $('#ActivityLogPopupHTMLSection').html(data);
                $('#ActivityLogPopupArea').modal({backdrop: 'static', keyboard: false});
                //$('#ActivityLogPopupArea .modal-header').css('background-color', '#a0c348');
                $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
                //$('#ActivityLogPopupArea .modal-dialog').css('width', '600px');
            },
            error: function (response) {
                alertPopup(response.responseText);
            },
            failure: function (response) {
                alertPopup(response.responseText);
            }
        });
    }else{
        alertPopup('Id not found');
    }
});

function getIvrDetails(listingType){
    if(listingType !== 'loadmore'){
        $("#ivrPage").val(1);
        getIvrCallLogSummary();
    }
    $.ajax({
        url: jsVars.getIvrActivityLogs,
        type: 'post',
        data: {'userId' : $("#userId").val(), 'userName' : $("#userName").val(), 'collegeId':$("#collegeId").val(), 'activityCode':$("#activity_code").val(), 'moduleName':$("#moduleName").val(), 'formId':$("#formId").val(), 'page':$("#ivrPage").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#userProfileLoader').show();
        },
        complete: function () {
            $('#userProfileLoader').hide();
        },
        success: function (html) {
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
            }else{
                html    = html.replace("<head/>", "");
                var countRecord = countResult(html);
                if(listingType !== 'loadmore'){
                    $("#avrLogsDiv").html(html);
                }else{
                    $('#avrLogsDiv').find("ul").append(html);
                }
                if(countRecord < 10){
                    $('#LoadMoreIvr').hide();
                }else{
                    $('#LoadMoreIvr').show();
                }
                $("#ivrPage").val(parseInt($("#ivrPage").val())+1);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}