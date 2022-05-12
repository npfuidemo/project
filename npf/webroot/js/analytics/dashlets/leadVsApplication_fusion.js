var initilizeLeadVsApplication = function () {
    $("#leadVsApplicationsDashlet").find(".applyDates").click(function () {
        $("#leadVsApplication_range1StartDate").val("");
        $("#leadVsApplication_range1EndDate").val("");
        if ($("#leadVsApplicationsDashlet").find(".inputBaseStartDate").val() !== "" && $("#leadVsApplicationsDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#leadVsApplication_range1StartDate").val($("#leadVsApplicationsDashlet").find(".inputBaseStartDate").val());
            $("#leadVsApplication_range1EndDate").val($("#leadVsApplicationsDashlet").find(".inputBaseEndDate").val());
        }
        createLeadVsApplicationGraph();
    });
    $("#leadVsApplicationsDashlet").find(".cancelDates").click(function () {
        $("#leadVsApplication_range1StartDate").val("");
        $("#leadVsApplication_range1EndDate").val("");
        createLeadVsApplicationGraph();
    });
    createLeadVsApplicationGraph();
};

var createLeadVsApplicationGraph = function () {
//    $("#leadVsApplicationsDashlet").find('.dropdown-toggle').dropdown('close');
    var dashletUrl = $("#leadVsApplicationsDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#leadVsApplication_collegeId").val($("#collegeId").val());
    var filters = $("#leadVsApplicationFilterForm").serializeArray();
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
            $('#leadVsApplicationsDashletHTML .panel-loader').hide();
            $('#leadVsApplicationsDashletHTML .panel-heading, #leadVsApplicationsDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    updateLeadVsApplicationGraph(responseObject.data);
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

function updateLeadVsApplicationGraph(dashletData) {

    var dateRangeHtml = "(" + dashletData.startDate + " - " + dashletData.endDate + ")";
    if (typeof dashletData.compareStartDate !== "undefined" && typeof dashletData.compareEndDate !== "undefined") {
        dateRangeHtml = dateRangeHtml + " vs (" + dashletData.compareStartDate + " to " + dashletData.compareEndDate + ")";
    }
    $("#leadVsApplications_dateRange").html(dateRangeHtml);
    $("#leadVsApplications_dateRange_mobile").html(dateRangeHtml);
    FusionCharts.ready(function(){
        var fusioncharts = new FusionCharts({
            type: "msspline",
            renderAt: "leadApplication",
            width: "100%",
            height: "300",
            dataFormat: "json",
            dataSource :{
                "chart": {
//                    "caption": "Reach of Social Media Platforms amoung youth",
                    "yaxisname": "Count",
					//"xaxisname": "(Year)",
//                    "subcaption": "2012-2016",
                    "showhovereffect": "1",
//                    "numbersuffix": "%",
					"baseFont": "Roboto",
                    "drawcrossline": "1",
                    "plottooltext": "<b>$dataValue</b>  $seriesName",
                    "theme": "fusion",
//                    exportEnabled:"1"
                },
                "categories":[
                    { "category" : dashletData.graphData.labels }
                ],
                "dataset"   : [
                    { 'seriesname':'Leads', 'data'  : dashletData.graphData.leads },
                    { 'seriesname':'Applications', 'data'  : dashletData.graphData.applications }
                ]
            }
        });
        fusioncharts.render();    
    });

}

function leadVsApplication_downloadPDF() {
//    $("#leadVsApplicationsDashletFilters").hide();

    var data = document.getElementById("leadVsApplicationsDashletHTML");
    html2canvas(data).then(canvas => {
        // Few necessary setting options  
        var imgWidth = 200;
        var imgHeight = canvas.height * imgWidth / canvas.width;

        const contentDataURL = canvas.toDataURL('image/png');
        var pdf = new jspdf(); // A4 size page of PDF  
        var position = 1;
        pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('download.pdf'); // Generated PDF   
//        $("#leadVsApplicationsDashletFilters").show();
    });


}

function leadVsApplication_downloadCSV() {
    $("#leadVsApplicationFilterForm").submit();
}

function resetLeadVsApplicationFilterForm() {
    $("#leadVsApplicationFilterForm").find('select.dashletFilter').each(function () {
        $(this).val('');
    });
    $('.chosen-select').trigger('chosen:updated');
}

