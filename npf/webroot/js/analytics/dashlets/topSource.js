var initilizeTopSourceTable = function () {
    $("#topSourceDashlet").find(".applyDates").click(function () {
        $("#topSource_range1StartDate").val("");
        $("#topSource_range1EndDate").val("");
        $("#topSource_range2StartDate").val("");
        $("#topSource_range2EndDate").val("");
        if ($("#topSourceDashlet").find(".inputBaseStartDate").val() !== "" && $("#topSourceDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#topSource_range1StartDate").val($("#topSourceDashlet").find(".inputBaseStartDate").val());
            $("#topSource_range1EndDate").val($("#topSourceDashlet").find(".inputBaseEndDate").val());
        }

        if ($("#topSourceDashlet").find(".inputCompareCheckbox").is(":checked") && $("#topSourceDashlet").find(".inputCompareStartDate").val() !== "" && $("#topSourceDashlet").find(".inputCompareEndDate").val() !== "") {
            $("#topSource_range2StartDate").val($("#topSourceDashlet").find(".inputCompareStartDate").val());
            $("#topSource_range2EndDate").val($("#topSourceDashlet").find(".inputCompareEndDate").val());
        }
        createTopSource();
    });
    $("#topSourceDashlet").find(".cancelDates").click(function () {
        $("#topSource_range1StartDate").val("");
        $("#topSource_range1EndDate").val("");
        $("#topSource_range2StartDate").val("");
        $("#topSource_range2EndDate").val("");
        createTopSource();
    });
    createTopSource();
};

var createTopSource = function () {
//    $("#topSourceDashlet").find('.dropdown-toggle').dropdown('close');
    var dashletUrl = $("#topSourceDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#topSource_collegeId").val($("#collegeId").val());
    var filters = $("#topSourceFilterForm").serializeArray();
//    console.log(filters);
    $.ajax({
        url: dashletUrl,
        type: 'post',
        data: filters,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
            $('#topSourceDashletHTML .panel-loader').hide();
            $('#topSourceDashletHTML .panel-heading, #topSourceDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    updateTopSources(responseObject.data);
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
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

};

function updateTopSources(dashletData) {

    var dateRangeHtml = "(" + dashletData.startDate + " to " + dashletData.endDate + ")";
    if (typeof dashletData.compareStartDate !== "undefined" && typeof dashletData.compareEndDate !== "undefined") {
        dateRangeHtml = dateRangeHtml + " vs (" + dashletData.compareStartDate + " to " + dashletData.compareEndDate + ")";
    }
    $("#topSource_dateRange").html(dateRangeHtml);
    $("#topSource_sourceList").html("");
    $.each(dashletData.sources, function (key, value) {
//            var leadTrendHtml  = "";
//            if( typeof dashletData.trends === "object" &&  typeof dashletData.trends.sources === "object" ){
//                var trend   = dashletData.trends.sources[key];
//                if( trend === "NA" ){
//                    leadTrendHtml  = ' <span class="text-info trends"></i>NA</span>';
//                }else if( trend === 0 ){
//                    leadTrendHtml  = ' <span class="text-info trends"></i>0%</span>';
//                }else if(trend > 0){
//                    leadTrendHtml  = ' <span class="text-success trends"><span class="fw-500">'+trend+'%</span><i class="lineicon-up-arrow"></i></span>';
//                }else{
//                    leadTrendHtml  = ' <span class="text-danger trends"><span class="fw-500">'+trend+'%</span><i class="lineicon-down-arrow"></i></span>';
//                }
//            }
        $("#topSource_sourceList").append("<tr>\n\
            <td class='fw-500 text-left colGroup1'>" + key + "</td>\n\
            <td class='text-center colGroup2'>" + value.leads.toLocaleString('en-IN') + "<span class='fw-500'>&nbsp;(" + value.leadPercentage + "%)</span></td>\n\
            <td class='text-center colGroup1'>" + value.applications.toLocaleString('en-IN') + "<span class='fw-500'>&nbsp;(" + value.applicationPercentage + "%)</span></td>\n\
        </tr>");
    });
}

function topSource_downloadPDF() {
//    $("#topSourceDashletFilters").hide();

    var data = document.getElementById("topSourceDashletHTML");
    html2canvas(data).then(canvas => {
        // Few necessary setting options  
        var imgWidth = 100;
        var imgHeight = canvas.height * imgWidth / canvas.width;

        const contentDataURL = canvas.toDataURL('image/png');
        var pdf = new jspdf(); // A4 size page of PDF  
        var position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save('download.pdf'); // Generated PDF   
//        $("#topSourceDashletFilters").show();
    });


}

function topSource_downloadCSV() {
    $("#topSourceFilterForm").submit();
}

function resetConversionFunnelFiltersForm() {
    $("#topSourceFilterForm").find('select.dashletFilter').each(function () {
        $(this).val('');
    });
    $('.chosen-select').trigger('chosen:updated');
}

