var initilizeFormStageWiseSegregation = function () {
    $("#formStageWiseSegregation").find(".applyDates").click(function () {
        $("#formStageWiseSegregation_range1StartDate").val("");
        $("#formStageWiseSegregation_range1EndDate").val("");
        if ($("#formStageWiseSegregation").find(".inputBaseStartDate").val() !== "" && $("#formStageWiseSegregation").find(".inputBaseEndDate").val() !== "") {
            $("#formStageWiseSegregation_range1StartDate").val($("#formStageWiseSegregation").find(".inputBaseStartDate").val());
            $("#formStageWiseSegregation_range1EndDate").val($("#formStageWiseSegregation").find(".inputBaseEndDate").val());
        }
        createFormStageWiseSegregationGraph();
    });
    $("#formStageWiseSegregation").find(".cancelDates").click(function () {
        $("#formStageWiseSegregation_range1StartDate").val("");
        $("#formStageWiseSegregation_range1EndDate").val("");
        createFormStageWiseSegregationGraph();
    });
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

    var dateRangeHtml = "(" + dashletData.startDate + " to " + dashletData.endDate + ")";
    if (typeof dashletData.compareStartDate !== "undefined" && typeof dashletData.compareEndDate !== "undefined") {
        dateRangeHtml = dateRangeHtml + " vs (" + dashletData.compareStartDate + " to " + dashletData.compareEndDate + ")";
    }
    $("#formStageWiseSegregation_dateRange").html(dateRangeHtml);

    var barGraph = {
        type: 'bar',
        data: {
            labels: dashletData.graphData.labels,
            datasets: [{
                    label: 'Dataset 1',
                    backgroundColor: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'],
                    borderColor: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'],
                    borderWidth: 1,
                    data: dashletData.graphData.applications
                }]
        },
        options: {
            scaleShowVerticalLines: false,
            responsive: true,
            maintainAspectRatio: false,
			 layout: {
				padding: {
					top: 12,
				}
			},
            legend: {
                "display": false
            },
            tooltips: {
                "enabled": true
            },
            "hover": {
                "animationDuration": 0
            },
            "animation": {
                "duration": 1,
                "onComplete": function () {
                    var chartInstance = this.chart,
                            ctx = chartInstance.ctx;

                    ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
					ctx.fontFamily = 'Roboto';
                    ctx.fillStyle = '#111';

                    this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.controller.getDatasetMeta(i);
                        meta.data.forEach(function (bar, index) {
                            var data = dataset.data[index];
                            ctx.fillText(data, bar._model.x, bar._model.y - 1);
                        });
                    });
                }
            },
            scales: {
                xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: '(Stage)',
                            fontSize: 12
                        },
                        ticks: {
                            fontSize: 12,
                            fontColor: '#111'
                        },
                        gridLines: {
                            color: 'rgba(0,0,0,0.04)',
                            lineWidth: 1
                        },
						barPercentage: 0.5
                    }],
                yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: '(Count)',
                            fontSize: 12
                        },
                        ticks: {
                            fontSize: 12,
                            fontColor: '#111',
                            beginAtZero: true
                        },
                        gridLines: {
                            color: 'rgba(0,0,0,0.04)',
                            lineWidth: 1
                        },
						barPercentage: 0.5
                    }]
            }
        },
        plugins: [{
                beforeInit: function (chart) {
                    chart.data.labels.forEach(function (e, i, a) {
                        a[i] = e.split(' ');
                    });
                }
            }]
    };

    if (typeof window.formStageWiseSegregation_barGraph === "object") {
        window.formStageWiseSegregation_barGraph.destroy();
    }

    var formStagectx = document.getElementById('formStageWise').getContext('2d');

    window.formStageWiseSegregation_barGraph = new Chart(formStagectx, barGraph);


}

function formStageWiseSegregation_downloadPDF() {
    $("#formStageWiseSegregationFilters").hide();

    var data = document.getElementById("formStageWiseSegregationHTML");
    html2canvas(data).then(canvas => {
        // Few necessary setting options  
        var imgWidth = 200;
        var imgHeight = canvas.height * imgWidth / canvas.width;

        const contentDataURL = canvas.toDataURL('image/png');
        var pdf = new jspdf(); // A4 size page of PDF  
        var position = 1;
        pdf.addImage(contentDataURL, 'PNG', 1, position, imgWidth, imgHeight);
        pdf.save('download.pdf'); // Generated PDF   
        $("#formStageWiseSegregationFilters").show();
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
