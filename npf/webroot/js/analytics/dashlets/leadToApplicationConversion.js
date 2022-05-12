var initilizeLeadToApplicationConversionTrend = function () {
    $("#leadToApplicationConversionDashlet").find(".applyDates").click(function () {
        $("#leadToApplicationConversion_range1StartDate").val("");
        $("#leadToApplicationConversion_range1EndDate").val("");
        if ($("#leadToApplicationConversionDashlet").find(".inputBaseStartDate").val() !== "" && $("#leadToApplicationConversionDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#leadToApplicationConversion_range1StartDate").val($("#leadToApplicationConversionDashlet").find(".inputBaseStartDate").val());
            $("#leadToApplicationConversion_range1EndDate").val($("#leadToApplicationConversionDashlet").find(".inputBaseEndDate").val());
        }
        createLeadToApplicationConversionGraph();
    });
    $("#leadToApplicationConversionDashlet").find(".cancelDates").click(function () {
        $("#leadToApplicationConversion_range1StartDate").val("");
        $("#leadToApplicationConversion_range1EndDate").val("");
        createLeadToApplicationConversionGraph();
    });
    createLeadToApplicationConversionGraph();
};

var createLeadToApplicationConversionGraph = function () {
    var dashletUrl = $("#leadToApplicationConversionDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#leadToApplicationConversion_collegeId").val($("#collegeId").val());
    var filters = $("#leadToApplicationConversionFilterForm").serializeArray();
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
	    $('#leadToApplicationConversionFilterForm .btn-group').removeClass('open');
            $('#leadToApplicationConversionDashletHTML .panel-loader').hide();
            $('#leadToApplicationConversionDashletHTML .panel-heading, #leadToApplicationConversionDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    updateLeadToApplicationConversionGraph(responseObject.data);
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

function updateLeadToApplicationConversionGraph(dashletData) {

    var dateRangeHtml = "(" + dashletData.startDate + " - " + dashletData.endDate + ")";
    if (typeof dashletData.compareStartDate !== "undefined" && typeof dashletData.compareEndDate !== "undefined") {
        dateRangeHtml = dateRangeHtml + " vs (" + dashletData.compareStartDate + " to " + dashletData.compareEndDate + ")";
    }
    $("#leadToApplicationConversion_dateRange").html(dateRangeHtml);
	$("#leadToApplicationConversion_dateRange_mobile").html(dateRangeHtml);
	
    if (dashletData.graphData.labels != "") {
	FusionCharts.ready(function(){
	    var fusioncharts = new FusionCharts({
		type: "scrollarea2d",
		renderAt: "leadToApplicationConversion",
		width: "100%",
		height: "300",
		dataFormat: "json",
		dataSource :{
          "chart": {
           "yaxisname": "Conversion %",
           "xaxisname": "Date",
           "drawAnchors": "1",
           "scrolltoend": "1",
           "scrollPadding" : "10",
           "scrollheight": "6",
					       //"anchorRadius": "5",
					    //"anchorBgColor": "#d3f7ff",
                     "showhovereffect": "1",
                     "baseFont": "Roboto",
                     "baseFontSize": "12",
                     "drawcrossline": "1",
                     "palettecolors":"#8fbbd9",
                     "plottooltext": "<b>$dataValue</b>  %",
                     "theme": "fusion"
                 },
                 "categories":[
                 { "category" : dashletData.graphData.labels }
                 ],
                 "dataset"   : [
                 {'data'  : dashletData.graphData.leadToApplicationPerc }
                 ]
		}
	    });
	    fusioncharts.render();    
	});
    }else{
	var html = '';
	html += '<div class="margin-top-30 margin-bottom-30">';
	html += '<div class="noData text-muted text-center">';
	html += '<p class="noDataicon m0"><i class="fa fa-database fa-3x"></i></p>';
	html += '<p class="noDataMsg m0 font16">Data Not Available</p>';
	html += '</div>';
	html += '</div>';
	$('#leadToApplicationConversion').html(html);
    }
}

function leadToApplicationConversion_downloadCSV() {
    $("#leadToApplicationConversionFilterForm").submit();
}

function resetLeadVsApplicationFilterForm() {
    $("#leadToApplicationConversionFilterForm").find('select.dashletFilter').each(function () {
        $(this).val('');
    });
    $('.chosen-select').trigger('chosen:updated');
}

