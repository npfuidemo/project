var initilizeAppTimeSlotWise = function () {
    $("#applicationTimeSlotDashlet").find(".applyDates").click(function () 
    {
        $("#applicationTimeSlot_range1StartDate").val("");
        $("#applicationTimeSlot_range1EndDate").val("");
        if ($("#applicationTimeSlotDashlet").find(".inputBaseStartDate").val() !== "" && $("#applicationTimeSlotDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#applicationTimeSlot_range1StartDate").val($("#applicationTimeSlotDashlet").find(".inputBaseStartDate").val());
            $("#applicationTimeSlot_range1EndDate").val($("#applicationTimeSlotDashlet").find(".inputBaseEndDate").val());
        }
        createapplicationTimeSlotGraph();
    });
    $("#applicationTimeSlotDashlet").find(".cancelDates").click(function () {
        $("#applicationTimeSlot_range1StartDate").val("");
        $("#applicationTimeSlot_range1EndDate").val("");
        createapplicationTimeSlotGraph();
    });

	$("#applicationTimeSlotDashletHTML .sumo-select").SumoSelect({
		search: true, 
		placeholder: $(this).data('placeholder'), 
		captionFormatAllSelected: "All Selected.", 
		searchText: $(this).data('placeholder'), 
		triggerChangeCombined: true, 
		okCancelInMulti: true,
		floatWidth: 600,
		forceCustomRendering: true,
		nativeOnDevice: ['Android', 'BlackBerry', 'iPhone', 'iPad', 'iPod', 'Opera Mini', 'IEMobile', 'Silk'],
	});
    createapplicationTimeSlotGraph();
};

var createapplicationTimeSlotGraph = function () 
{
    var dashletUrl = $("#applicationTimeSlotDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#applicationTimeSlot_collegeId").val($("#collegeId").val());
    var filters = $("#applicationTimeSlotFilterForm").serializeArray();
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
            $('#applicationTimeSlotDashletHTML .panel-loader').hide();
            $('#applicationTimeSlotDashletHTML .panel-heading, #applicationTimeSlotDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    updateapplicationTimeSlotHeat(responseObject.data);
                    updateapplicationTimeSlotPrimary(responseObject.data);
                    updateapplicationTimeSlotSecondry(responseObject.data);
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

function updateapplicationTimeSlotHeat(dashletData) 
{
    const dataSource = {
        chart: {
            theme: "fusion",
			baseFont: "Roboto",
			baseFontSize: "12",
			labelFontSize: "12",
            outCnvBaseFontSize: "10",
            outCnvBaseFontColor: "#666",
            showLegend: (dashletData.leads.max_value == "0") ? "0" : "1",
            showvalues: "1",
            valuefontcolor: "#ffffff",
            plottooltext: "<div id='nameDiv' style='font-size: 12px; border-bottom: 1px dashed #666666; font-weight:bold; padding-bottom: 3px; margin-bottom: 5px; display: inline-block; color: #888888;' >$columnlabel : $rowlabel</div>{br} <div id='nameDiv' style='font-size: 14px; padding-bottom: 3px; display: inline-block;' ><strong>$value</strong> Applications</div>",
        },
        colorrange: {
            gradient: "1",
            minvalue: "0",
            // mapbypercent: "1",
			code: "#65c0e5",
            startlabel: "Low",
            endlabel: "High",
            color: [{
                "code": "#1f77b4",
                "minValue": "0",
                "maxValue": dashletData.leads.max_value,
                "label": "Bad"
            }
            // ,{
            //     "code": "#0f9b0f",
            //     "minValue": "21",
            //     "maxValue": "30",
            //     "label": "Average"
            // }
            ]
        },
        dataset: [
        {
            data: dashletData.leads.final
        }
        ],
        columns: {
            column: dashletData.leads.day_labels
        },
        rows: {
            row: dashletData.leads.time_labels
        }
    };

    FusionCharts.ready(function() {
      var myatsChart = new FusionCharts({
            type: "heatmap",
            renderAt: "app_chart-container",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource
        });
		myatsChart.render();
      });
    var dateRangeHtml = "(" + dashletData.startDate + " - " + dashletData.endDate + ")";
    if (typeof dashletData.compareStartDate !== "undefined" && typeof dashletData.compareEndDate !== "undefined") {
        dateRangeHtml = dateRangeHtml + " vs (" + dashletData.compareStartDate + " to " + dashletData.compareEndDate + ")";
    }
    $("#applicationTimeSlot_dateRange").html(dateRangeHtml);
   
}

function updateapplicationTimeSlotPrimary(dashletData) 
{
    const dataSource = {
        chart: {
            caption: "Day wise Analysis",
            subcaption: "",
            //xaxisname: "Day",
			baseFontSize: "12",
			labelFontSize: "12",
            yaxisname: "Application Count",
            numbersuffix: "",
			palettecolors: "1f77b4",
            theme: "fusion",
            plottooltext: "<div id='nameDiv' style='font-size: 12px; border-bottom: 1px dashed #666666; font-weight:bold; padding-bottom: 3px; margin-bottom: 5px; display: inline-block; color: #888888;' >$label</div>{br} <div id='nameDiv' style='font-size: 14px; padding-bottom: 3px; display: inline-block;' ><strong>$value</strong> Applications</div>",
        },
        data: dashletData.day_graph
    };

    FusionCharts.ready(function() {
        var myChart = new FusionCharts({
            type: "column2d",
            renderAt: "app_bar-primary",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource
        }).render();
    });
    var dateRangeHtml = "(" + dashletData.startDate + " - " + dashletData.endDate + ")";
    if (typeof dashletData.compareStartDate !== "undefined" && typeof dashletData.compareEndDate !== "undefined") {
        dateRangeHtml = dateRangeHtml + " vs (" + dashletData.compareStartDate + " to " + dashletData.compareEndDate + ")";
    }
    $("#applicationTimeSlot_dateRange").html(dateRangeHtml);
   
}

function updateapplicationTimeSlotSecondry(dashletData) 
{
    const dataSource = {
        chart: {
            caption: "Hourly Analysis",
            subcaption: "",
            //xaxisname: "Time",
			baseFontSize: "12",
			labelFontSize: "12",
            yaxisname: "Application Count",
            numbersuffix: "",
            theme: "fusion",
			palettecolors: "1f77b4",
            plottooltext: "<div id='nameDiv' style='font-size: 12px; border-bottom: 1px dashed #666666; font-weight:bold; padding-bottom: 3px; margin-bottom: 5px; display: inline-block; color: #888888;' >$label</div>{br} <div id='nameDiv' style='font-size: 14px; padding-bottom: 3px; display: inline-block;' ><strong>$value</strong> Applications</div>",
        },
        data: dashletData.time_graph
    };

    FusionCharts.ready(function() {
        var myChart = new FusionCharts({
            type: "column2d",
            renderAt: "app_bar-secondary",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource
        }).render();
    });
}

function applicationTimeSlot_downloadCSV() {
    $("#applicationTimeSlotFilterForm").submit();
}

function resetapplicationTimeSlotFilterForm() 
{
    if ($("#applicationTimeSlot_university_id").length)
    {
        $("#applicationTimeSlot_course_id").html("");
    }

    if ($("#applicationTimeSlot_specialization_id").length)
    {
        if($("#applicationTimeSlot_specialization_id").attr('data-dependant') == 1)
            $("#applicationTimeSlot_specialization_id").html("");
    } 

    $("#applicationTimeSlotFilterForm").find('select.dashletFilter').each(function () 
    {
        $(this).val('');
        $(this)[0].sumo.reload();
    });
}