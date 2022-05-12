var initilizePrepSalesGraph = function () {
    $("#prepSalesDashlet").find(".applyDates").click(function () {
        $("#prepSales_range1StartDate").val("");
        $("#prepSales_range1EndDate").val("");
        if ($("#prepSalesDashlet").find(".inputBaseStartDate").val() !== "" && $("#prepSalesDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#prepSales_range1StartDate").val($("#prepSalesDashlet").find(".inputBaseStartDate").val());
            $("#prepSales_range1EndDate").val($("#prepSalesDashlet").find(".inputBaseEndDate").val());
        }
        createPrepSalesGraph();
    });
    $("#prepSalesDashlet").find(".cancelDates").click(function () {
        $("#prepSales_range1StartDate").val("");
        $("#prepSales_range1EndDate").val("");
        createPrepSalesGraph();
    });
    createPrepSalesGraph();

};

var createPrepSalesGraph = function () {
//    $("#prepSales").find('.dropdown-toggle').dropdown('close');
    var dashletUrl = $("#prepSalesDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#prepSales_collegeId").val($("#collegeId").val());
    var filters = $("#prepSalesFilterForm").serializeArray();
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
            $('#prepSalesDashletHTML .panel-loader').hide();
            $('#prepSalesDashletHTML .panel-heading, #prepSalesDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    updatePrepSalesGraph(responseObject.data);
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

function updatePrepSalesGraph(dashletData) {

    var dateRangeHtml = "" + dashletData.startDate + " - " + dashletData.endDate + "";
    if (typeof dashletData.compareStartDate !== "undefined" && typeof dashletData.compareEndDate !== "undefined") {
        dateRangeHtml = dateRangeHtml + " vs (" + dashletData.compareStartDate + " to " + dashletData.compareEndDate + ")";
    }
    $("#prepSales_dateRange").html(dateRangeHtml);
    
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
            type: "doughnut3d",
            loadMessageFontSize: "15",
            loadMessageColor: "#1f77b4",
            renderAt: "prepSalesGraph",
            width: "100%",
            height: "300",
            dataFormat: "json",
            dataSource: {
                "chart": {
                    "baseFont": "Roboto",
                    "baseFontSize": "12",
//                    "palettecolors": "1f77b4,dc3e41,f6a858",
                    "captionAlignment": "left",
//                    "caption": "School Registrations",
                    "captionFontSize": "16",
                    "captionFontColor": "#111",
                    "captionFontBold": "0",
                    "showLabels": 0,
//                                        "showValues":0, 
                    "animateClockwise": "1",
                    "pieRadius": "150",
                    showpercentvalues: "1",
                    decimals: "1",
                    "theme": "fusion",
                },
                "data": dashletData.graphData
            }
        });
        fusioncharts.render();
    });

}

function prepSales_downloadPDF() {
//    $("#prepSalesFilters").hide();

    var data = document.getElementById("prepSalesDashletHTML");
    html2canvas(data).then(canvas => {
        // Few necessary setting options  
        var imgWidth = 200;
        var imgHeight = canvas.height * imgWidth / canvas.width;

        const contentDataURL = canvas.toDataURL('image/png');
        var pdf = new jspdf(); // A4 size page of PDF  
        var position = 1;
        pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('download.pdf'); // Generated PDF   
//        $("#prepSalesFilters").show();
    });


}

function prepSales_downloadCSV() {
    $("#prepSalesFilterForm").submit();
}

function resetPrepSalesFilterForm() {
    $("#prepSalesFilterForm").find('select.dashletFilter').each(function () {
        $(this).val('');
    });
    if( $(".chosen-select").length ){
        $('.chosen-select').trigger('chosen:updated');
    }
}
