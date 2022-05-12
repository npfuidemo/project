$(document).ready(function(){
    LoadReportDateRangepicker();
    $('#detailReportLoader.loader-block').hide();
   
    loadMoreDetail('reset');
});
var loaderCount=0;

function loadMoreDetail(listingType){
    if(jsVars.canViewDetailedReportTable==false){
        return false;
    }
    if(listingType === 'reset'){
        $("#page").val(1);
    }
    $.ajax({
        url: jsVars.loadMoreDetailedReportLink,
        type: 'post',
        data: $('#publisherDetailSearchArea input, #publisherDetailSearchArea select'),
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
                    //$("#collegeSummarySpan").append(" "+jsVars.collegeName);
					$("#collegeSummarySpan").html('');
					$("#collegeSummarySpan").append('<a tabindex="1" class="icon-info" style="font-size:11px;" role="button" data-placement="top" data-container="body" data-toggle="popover" data-trigger="focus" data-html="true" data-content="'+jsVars.collegeName+'"><span class="lineicon-info" aria-hidden="true"></span></a>');
                }else{
                    $('#detailReportContainerSection').find("tbody").append(html);
                }
                if( $("#detailPrimaryCount").length > 0 ){
                    $("#totalPrimaryRegistrations").html($("#detailPrimaryCount").html());
                }
                if( $("#detailSecondaryCount").length > 0 ){
                    $("#totalSecondaryRegistrations").html($("#detailSecondaryCount").html());
                }
                if( $("#detailTertiaryCount").length > 0 ){
                    $("#totalTertiaryRegistrations").html($("#detailTertiaryCount").html());
                }
                if( $("#detailTotalCount").length > 0 ){
                    $("#totalRegistrations").html($("#detailTotalCount").html());
                }
                if( $("#detailVerifiedCount").length > 0 ){
                    $("#totalVerifiedRegistrations").html($("#detailVerifiedCount").html());
                }
                if( $("#detailUnverifiedCount").length > 0 ){
                    $("#totalUnverifiedRegistrations").html($("#detailUnverifiedCount").html());
                }
                if( $("#detailApplicationCount").length > 0 ){
                    $("#totalApplications").html($("#detailApplicationCount").html());
                }
		if($("#detailEnrollmentCount").length > 0 ){
			$("#totalEnrollment").html($("#detailEnrollmentCount").html());
		}
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            }
            //table_fix_rowcol();
			$('.offCanvasModal').modal('hide');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
};

function exportDetailReportCsv(){
    var $form = $("#filterDiscountCouponForm");
    $form.attr("action",jsVars.exportDetailReportCsvLink);
    $form.attr("target",'modalIframe');
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    $('#myModal').modal('show');
    $form.submit();
    $form.attr("onsubmit",onsubmit_attr);
    $form.removeAttr("target");
}

var downloadDetailReportFile = function(url){
    window.open(url, "_self");
};
