var initilizeTimeSlotWise = function () {
    $("#leadTimeSlotDashlet").find(".applyDates").click(function () 
    {
        $("#leadTimeSlot_range1StartDate").val("");
        $("#leadTimeSlot_range1EndDate").val("");
        if ($("#leadTimeSlotDashlet").find(".inputBaseStartDate").val() !== "" && $("#leadTimeSlotDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#leadTimeSlot_range1StartDate").val($("#leadTimeSlotDashlet").find(".inputBaseStartDate").val());
            $("#leadTimeSlot_range1EndDate").val($("#leadTimeSlotDashlet").find(".inputBaseEndDate").val());
        }
        createleadTimeSlotGraph();
    });
    $("#leadTimeSlotDashlet").find(".cancelDates").click(function () {
        $("#leadTimeSlot_range1StartDate").val("");
        $("#leadTimeSlot_range1EndDate").val("");
        createleadTimeSlotGraph();
    });
    
	$("#leadTimeSlotDashletFilters .sumo-select").SumoSelect({
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
    createleadTimeSlotGraph();
};

var createleadTimeSlotGraph = function () {
    var dashletUrl = $("#leadTimeSlotDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#leadTimeSlot_collegeId").val($("#collegeId").val());
    var filters = $("#leadTimeSlotFilterForm").serializeArray();
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
            $('#leadTimeSlotDashletHTML .panel-loader').hide();
            $('#leadTimeSlotDashletHTML .panel-heading, #leadTimeSlotDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    updateleadTimeSlotHeat(responseObject.data);
                    updateleadTimeSlotPrimary(responseObject.data);
                    updateleadTimeSlotSecondry(responseObject.data);
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

function updateleadTimeSlotHeat(dashletData) 
{
    const dataSource = {
        chart: {
            theme: "fusion",
			baseFont: "Roboto",
			baseFontSize: "12",
			labelFontSize: "12",
            outCnvBaseFontSize: "10",
            outCnvBaseFontColor: "#666",
            showvalues: "1",
            valuefontcolor: "#ffffff",
            showLegend: (dashletData.leads.max_value == "0") ? "0" : "1",
            plottooltext: "<div id='nameDiv' style='font-size: 12px; border-bottom: 1px dashed #666666; font-weight:bold; padding-bottom: 3px; margin-bottom: 5px; display: inline-block; color: #888888;' >$columnlabel : $rowlabel</div>{br} <div id='nameDiv' style='font-size: 14px; padding-bottom: 3px; display: inline-block;' ><strong>$value</strong> Leads</div>",
        },
        colorrange: {
            gradient: "1",
            minvalue: "0",
			code: "#65c0e5",
            startlabel: "Low",
            endlabel: "High",
            color: [
                {
                    "code": "#1f77b4",
                    "minValue": "0",
                    "maxValue": dashletData.leads.max_value,
                    "label": "Bad"
                }
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
		var myltsChart = new FusionCharts({
            type: "heatmap",
            renderAt: "chart-container",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource
        });
		myltsChart.render();
    });
    var dateRangeHtml = "(" + dashletData.startDate + " - " + dashletData.endDate + ")";
    if (typeof dashletData.compareStartDate !== "undefined" && typeof dashletData.compareEndDate !== "undefined") {
        dateRangeHtml = dateRangeHtml + " vs (" + dashletData.compareStartDate + " to " + dashletData.compareEndDate + ")";
    }
    $("#leadTimeSlot_dateRange").html(dateRangeHtml);
   
}

function updateleadTimeSlotPrimary(dashletData) 
{
    const dataSource = {
        chart: {
            caption: "Day wise Analysis",
            subcaption: "",
			baseFontSize: "12",
			labelFontSize: "12",
            //xaxisname: "Days",
            yaxisname: "Lead Count",
            numbersuffix: "",
            theme: "fusion",
			palettecolors: "1f77b4",
            plottooltext: "<div id='nameDiv' style='font-size: 12px; border-bottom: 1px dashed #666666; font-weight:bold; padding-bottom: 3px; margin-bottom: 5px; display: inline-block; color: #888888;' >$label</div>{br} <div id='nameDiv' style='font-size: 14px; padding-bottom: 3px; display: inline-block;' ><strong>$value</strong> Leads</div>",

        },
        // "colorrange": {"startlabel": "Poo","endlabel": "Good"},
        data: dashletData.day_graph
    };

    FusionCharts.ready(function() {
        var myltspChart = new FusionCharts({
            type: "column2d",
            renderAt: "bar-primary",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource
        });
		myltspChart.render();
    });
    var dateRangeHtml = "(" + dashletData.startDate + " - " + dashletData.endDate + ")";
    if (typeof dashletData.compareStartDate !== "undefined" && typeof dashletData.compareEndDate !== "undefined") {
        dateRangeHtml = dateRangeHtml + " vs (" + dashletData.compareStartDate + " to " + dashletData.compareEndDate + ")";
    }
    $("#leadTimeSlot_dateRange").html(dateRangeHtml);
   
}

function updateleadTimeSlotSecondry(dashletData) 
{
    const dataSource = {
        chart: {
            caption: "Hourly Analysis",
            subcaption: "",
            //xaxisname: "Time",
            yaxisname: "Lead Count",
			baseFontSize: "12",
			labelFontSize: "12",
            numbersuffix: "",
            theme: "fusion",
			palettecolors: "1f77b4",
            plottooltext: "<div id='nameDiv' style='font-size: 12px; border-bottom: 1px dashed #666666; font-weight:bold; padding-bottom: 3px; margin-bottom: 5px; display: inline-block; color: #888888;' >$label</div>{br} <div id='nameDiv' style='font-size: 14px; padding-bottom: 3px; display: inline-block;' ><strong>$value</strong> Leads</div>",
        },
        data: dashletData.time_graph
    };

    FusionCharts.ready(function() {
        var myltssChart = new FusionCharts({
            type: "column2d",
            renderAt: "bar-secondary",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource
        });
		myltssChart.render();
    });
}

function leadTimeSlot_downloadCSV() {
    $("#leadTimeSlotFilterForm").submit();
}

function resetleadTimeSlotFilterForm() 
{
    if ($("#leadTimeSlot_university_id").length)
    {
        $("#leadTimeSlot_course_id").html("");
    }

    if ($("#leadTimeSlot_specialization_id").length)
    {
        if($("#leadTimeSlot_specialization_id").attr('data-dependant') == 1)
            $("#leadTimeSlot_specialization_id").html("");
    } 

    $("#leadTimeSlotFilterForm").find('select.dashletFilter').each(function () 
    {
        $(this).val('');
        $(this)[0].sumo.reload();
    });
}