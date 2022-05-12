$(document).ready(function(){
    LoadReportDateRangepicker();
    $('#detailReportLoader.loader-block').hide();
    loadMoreDetail('reset');
    loadSummary();
    $(document).on('click', 'span.sorting_span i', function () {
        $("#sortField").val(jQuery(this).data('column'));
        $("#sortOrder").val(jQuery(this).data('sorting'));
        loadMoreDetail('reset');
    });
    
});
var loaderCount=0;
function loadSummary(){
    $.ajax({
        url: jsVars.campaignSummaryLink, 
        type: 'post',
        data:  $("#filterTrackCampaignForm").serialize(),
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $('#detailReportLoader.loader-block').show();
            loaderCount++;
        },
        complete: function () {
            loaderCount--;
            if(loaderCount==0){
                $('.offCanvasModal').modal('hide');
                $('#detailReportLoader.loader-block').hide();
            }
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    $("#totalPrimaryRegistrations").html(responseObject.data.primaryLeads);
                    $("#totalSecondaryRegistrations").html(responseObject.data.secondaryLeads);
                    $("#totalTertiaryRegistrations").html(responseObject.data.tertiaryLeads);
                    $("#totalRegistrations").html(responseObject.data.totalLeads);
                    $("#totalVerifiedRegistrations").html(responseObject.data.verifiedLeads);
                    $("#totalUnverifiedRegistrations").html(responseObject.data.unverifiedLeads);
                    if($("#totalApplications").length){
                        $("#totalApplications").html(responseObject.data.applications);
                        $("#totalSubmittedApplications").html(responseObject.data.submittedApplications);
                    }
                    if($("#totalEnrollment").length){
                        $('#totalEnrollment').html(responseObject.data.enrollments);
                    }
		}
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(responseObject.message);
                }
            }
            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function loadMoreDetail(listingType){
    $.ajax({
        url: jsVars.loadPublisherCampaignsLink,
        type: 'post',
        data:  $("#filterTrackCampaignForm").serialize(),
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#detailReportLoader.loader-block').show();
            loaderCount++;
        },
        complete: function () {
            loaderCount--;
            if(loaderCount==0){
                $('.offCanvasModal').modal('hide');
                $('#detailReportLoader.loader-block').hide();
            }
        },
        success: function (html) {            
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
                $('#LoadMoreArea').hide();
            }else{
                html    = html.replace("<head/>", "");
                $('#detailReportContainerSection').html(html);
                
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
};


var downloadDetailReportFile = function(url){
    window.open(url, "_self");
};

function exportDetailReportCsv(){
    $.ajax({
        url: jsVars.exportPublisherCampaignsCsvLink, 
        type: 'post',
        data:  $("#filterTrackCampaignForm").serialize(),
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $('#detailReportLoader.loader-block').show();
            loaderCount++;
        },
        complete: function () {
            loaderCount--;
            if(loaderCount==0){
                $('#detailReportLoader.loader-block').hide();
            }
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data.url !== "undefined") {
                    downloadDetailReportFile(responseObject.data.url);
		}
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(responseObject.message);
                }
            }
            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function syncApplicantData(){
    $.ajax({
        url: '/DataSync/syncAplicantsWithElastic/'+$("#collegeId").val(),
        type: 'get',
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $('#detailReportLoader.loader-block').show();
        },
        complete: function () {
            setTimeout(function() {location.reload(); }, 5000);
        },
        success: function (response) { 
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr);
            console.log(thrownError);
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
