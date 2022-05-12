var initilizeFormStageWiseSegregation = function () {
//    $("#formStageWiseSegregation").find(".applyDates").click(function () {
//        $("#formStageWiseSegregation_range1StartDate").val("");
//        $("#formStageWiseSegregation_range1EndDate").val("");
//        if ($("#formStageWiseSegregation").find(".inputBaseStartDate").val() !== "" && $("#formStageWiseSegregation").find(".inputBaseEndDate").val() !== "") {
//            $("#formStageWiseSegregation_range1StartDate").val($("#formStageWiseSegregation").find(".inputBaseStartDate").val());
//            $("#formStageWiseSegregation_range1EndDate").val($("#formStageWiseSegregation").find(".inputBaseEndDate").val());
//        }
//        createFormStageWiseSegregationGraph();
//    });
//    $("#formStageWiseSegregation").find(".cancelDates").click(function () {
//        $("#formStageWiseSegregation_range1StartDate").val("");
//        $("#formStageWiseSegregation_range1EndDate").val("");
//        createFormStageWiseSegregationGraph();
//    });
    createFormStageWiseSegregationGraph();

    if ($("#formStageWiseSegregation_form_id").length) {
        $("#formStageWiseSegregation_form_id").change(getFormStages);
    }
    if ($("#formStageWiseSegregation_form_stage").length) {
        $("#formStageWiseSegregation_form_stage").html("");
        $(".sumo-select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true, okCancelInMulti: true});
    }

};

var createFormStageWiseSegregationGraph = function () {
//    $("#formStageWiseSegregation").find('.dropdown-toggle').dropdown('close');
    var dashletUrl = $("#formStageWiseSegregation").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#formStageWiseSegregation_collegeId").val($("#collegeId").val());
    var filters = $("#formStageWiseSegregationFilterForm").serializeArray();
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
            $('#formStageWiseSegregationHTML .panel-loader').hide();
            $('#formStageWiseSegregationHTML .panel-heading, #formStageWiseSegregationHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    updateFormStageWiseSegregation(responseObject.data);
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

function updateFormStageWiseSegregation(dashletData) {
//
//    var dateRangeHtml = "" + dashletData.startDate + " - " + dashletData.endDate + "";
//    if (typeof dashletData.compareStartDate !== "undefined" && typeof dashletData.compareEndDate !== "undefined") {
//        dateRangeHtml = dateRangeHtml + " vs (" + dashletData.compareStartDate + " to " + dashletData.compareEndDate + ")";
//    }
//    $("#formStageWiseSegregation_dateRange").html(dateRangeHtml);
    FusionCharts.ready(function(){
        var fusioncharts = new FusionCharts({
            type: 'column2d',
            renderAt: 'formStageWise',
            width: '100%',
            height: '300',
            dataFormat: 'json',
            dataSource: {
                // Chart Configuration
                "chart": {
					"baseFont": "Roboto",
					"baseFontSize": "12",
//                    "caption": "Countries With Most Oil Reserves [2017-18]",
//                    "subCaption": "In MMbbl = One Million barrels",
					"palettecolors": "1f77b4,ff7f0e,2ca02c,d62728,9467bd,8c564b,e377c2,7f7f7f,bcbd22,17becf",
                    "xAxisName": "Stage",
                    "yAxisName": "Count",
//                    "numberSuffix": "K",
                    "theme": "fusion"
                },
                // Chart Data
                "data": dashletData.graphData  
            }
        });
        fusioncharts.render();    

    });


}

function formStageWiseSegregation_downloadPDF() {
//    $("#formStageWiseSegregationFilters").hide();

    var data = document.getElementById("formStageWiseSegregationHTML");
    html2canvas(data).then(canvas => {
        // Few necessary setting options  
        var imgWidth = 200;
        var imgHeight = canvas.height * imgWidth / canvas.width;

        const contentDataURL = canvas.toDataURL('image/png');
        var pdf = new jspdf(); // A4 size page of PDF  
        var position = 1;
        pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('download.pdf'); // Generated PDF   
//        $("#formStageWiseSegregationFilters").show();
    });


}

function formStageWiseSegregation_downloadCSV() {
    $("#formStageWiseSegregationFilterForm").submit();
}

function resetFormStageWiseSegregationFilterForm() {
    $("#formStageWiseSegregationFilterForm").find('select.dashletFilter').each(function () {
        $(this).val('');
    });
    if( $(".chosen-select").length ){
        $('.chosen-select').trigger('chosen:updated');
    }
    if( $("#formStageWiseSegregation_form_stage").length ){
        $("#formStageWiseSegregation_form_stage").html("");
        $("#formStageWiseSegregation_form_stage")[0].sumo.reload();
    }
}

function getFormStages() {
    $("#formStageWiseSegregation_form_stage").html("");
    $("#formStageWiseSegregation_form_stage")[0].sumo.reload();
    if ($("#formStageWiseSegregation_form_id").val() !== "") {
        $.ajax({
            url: '/analytics/getFormStages/' + $("#formStageWiseSegregation_form_id").val(),
            type: 'get',
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
            },
            complete: function () {
                $('#formStageWiseSegregationHTML .panel-loader').hide();
                $('#formStageWiseSegregationHTML .panel-heading, #formStageWiseSegregationHTML .panel-body').removeClass('pvBlur');
            },
            success: function (response) {
                var responseObject = $.parseJSON(response);
                if (responseObject.status == 1) {
                    if (typeof responseObject.data === "object") {
                        $.each(responseObject.data, function (formStage, formStageLabel) {
                            $("#formStageWiseSegregation_form_stage").append("<option value='" + formStage + "'>" + formStageLabel + "</option>");
                        });
                        $("#formStageWiseSegregation_form_stage")[0].sumo.reload();
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
    }
}
;
