$(document).ready(function(){
    $('[data-toggle="popover"]').popover();
	LoadReportDateRangepicker();
    $('#detailReportLoader.loader-block').hide();
    loadMoreDetail('reset');    
});
$(document).ajaxComplete(function() {
    $('[data-toggle="popover"]').popover();
});
var loaderCount=0;

function loadMoreDetail(listingType){
    if(jsVars.canViewDetailedReportTable==false){
        return false;
    }
    if(listingType === 'reset'){
        $("#page").val(1);
    }
    var instanceType    = $("#instance_type").val();
    var collegeId       = $("#collegeId").val();
    var date_range      = $("#date_range").val();
    var trafficChannel  = $("#trafficChannel").val();
    var data = { 's_college_id' : collegeId,'date_range' : date_range, 'instance_type':instanceType, 'form_id':$("#interest_on_forms").val(), 'trafficChannel':trafficChannel};
    $.ajax({
        url: jsVars.loadMoreDetailedReportLink,
        type: 'post',
        data: data,
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
                if(listingType === 'reset'){
                    $('#detailReportContainerSection').html(html);
					$("#collegeSummarySpan").html('');
                    //$("#collegeSummarySpan").append(" "+jsVars.collegeName);
					$("#collegeSummarySpan").append('<a tabindex="1" class="icon-info" style="font-size:11px;" role="button" data-placement="top" data-container="body" data-toggle="popover" data-trigger="focus" data-html="true" data-content="'+jsVars.collegeName+'"><span class="lineicon-info" aria-hidden="true"></span></a>');
                }else{
                    $('#detailReportContainerSection').find("tbody").append(html);
                }
                $("#page").val(parseInt($("#page").val())+1);
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                loadpublisherSummary();
            }
            //table_fix_rowcol();
			$('.offCanvasModal').modal('hide');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
};


/**
 * 
 * load all campaign summary
 */
function loadpublisherSummary(){
    var instanceType    = $("#instance_type").val();
    var collegeId       = $("#collegeId").val();
    var date_range      = $("#date_range").val();
    var trafficChannel  = $("#trafficChannel").val();
   
    var data = {'s_college_id' : collegeId,'date_range' : date_range, 'instance_type':instanceType, 'form_id':$("#interest_on_forms").val(), 'trafficChannel':trafficChannel};
    $.ajax({
        url: jsVars.loadPublisherSummaryLink, 
        type: 'post',
        data:  data,
        dataType: 'json',
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
        success: function (json) { 
            if (json['redirect']){
                location = json['redirect'];
            }else if (json['error']){
                alertPopup(json['error'], 'error');
            }else if (json['dataList'] != undefined) {
                $("#totalPrimaryRegistrations").html(json['dataList'][0]['primary_count']);
                $("#totalSecondaryRegistrations").html(json['dataList'][0]['secondary_count']);
                $("#totalTertiaryRegistrations").html(json['dataList'][0]['tertiary_count']);
                $("#totalRegistrations").html(json['dataList'][0]['total_count']);
                $("#totalVerifiedRegistrations").html(json['dataList'][0]['verified']);
                $("#totalUnverifiedRegistrations").html(json['dataList'][0]['unverified']);
                $("#totalApplications").html(json['dataList'][0]['application_count']);
                if($("#totalEnrollment").length>0){
                    $("#totalEnrollment").html(json['dataList'][0]['enrolment_count']);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
