var initilizeExamAttemptsGraph = function () {
//    $("#examAttempts").find(".applyDates").click(function () {
//        $("#examAttempts_range1StartDate").val("");
//        $("#examAttempts_range1EndDate").val("");
//        if ($("#examAttempts").find(".inputBaseStartDate").val() !== "" && $("#examAttempts").find(".inputBaseEndDate").val() !== "") {
//            $("#examAttempts_range1StartDate").val($("#examAttempts").find(".inputBaseStartDate").val());
//            $("#examAttempts_range1EndDate").val($("#examAttempts").find(".inputBaseEndDate").val());
//        }
//        createExamAttemptsGraph();
//    });
//    $("#examAttempts").find(".cancelDates").click(function () {
//        $("#examAttempts_range1StartDate").val("");
//        $("#examAttempts_range1EndDate").val("");
//        createExamAttemptsGraph();
//    });
    createExamAttemptsGraph();

};

var createExamAttemptsGraph = function () {
//    $("#examAttempts").find('.dropdown-toggle').dropdown('close');
    var dashletUrl = $("#examAttemptsDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#examAttempts_collegeId").val($("#collegeId").val());
    var filters = $("#examAttemptsFilterForm").serializeArray();
    console.log(filters);
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
            $('#examAttemptsDashletHTML .panel-loader').hide();
            $('#examAttemptsDashletHTML .panel-heading, #examAttemptsDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    updateExamAttemptsGraph(responseObject.data);
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

function updateExamAttemptsGraph(dashletData) {

    var dateRangeHtml = "" + dashletData.startDate + " - " + dashletData.endDate + "";
    if (typeof dashletData.compareStartDate !== "undefined" && typeof dashletData.compareEndDate !== "undefined") {
        dateRangeHtml = dateRangeHtml + " vs (" + dashletData.compareStartDate + " to " + dashletData.compareEndDate + ")";
    }
//    $("#examAttempts_dateRange").html(dateRangeHtml);
    FusionCharts.ready(function(){
        var fusioncharts = new FusionCharts({
            type: 'mscolumn2d',
            renderAt: 'examAttemptsGraph',
            width: '100%',
            height: '300',
            dataFormat: 'json',
            dataSource: {
                // Chart Configuration
                "chart": {
                    "palettecolors": "1f77b4,ff7f0e,2ca02c,d62728,9467bd,8c564b,e377c2,7f7f7f,bcbd22,17becf",
//                    "xAxisName": "(Stage)",
//                    "yAxisName": "(Count)",
//                    "numberSuffix": "K",
                    "theme": "fusion"
                },
                // Chart Data
                "categories": [
                    {
                        "category" : dashletData.graphData.category
                    }
                ],
                "dataset":dashletData.graphData.dataset
            }
        });
        fusioncharts.render();    

    });


}

function examAttempts_downloadPDF() {
//    $("#examAttemptsFilters").hide();

    var data = document.getElementById("examAttemptsDashletHTML");
    html2canvas(data).then(canvas => {
        // Few necessary setting options  
        var imgWidth = 200;
        var imgHeight = canvas.height * imgWidth / canvas.width;

        const contentDataURL = canvas.toDataURL('image/png');
        var pdf = new jspdf(); // A4 size page of PDF  
        var position = 1;
        pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('download.pdf'); // Generated PDF   
//        $("#examAttemptsFilters").show();
    });


}

function examAttempts_downloadCSV() {
    $("#examAttemptsFilterForm").submit();
}

function resetExamAttemptsFilterForm() {
    $("#examAttemptsFilterForm").find('select.dashletFilter').each(function () {
        $(this).val('');
    });
    if( $(".chosen-select").length ){
        $('.chosen-select').trigger('chosen:updated');
    }
}
