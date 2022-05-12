var initilizeTopStateCities = function () {
    $("#topStateCitiesDashlet").find(".applyDates").click(function () {
        $("#topStateCities_range1StartDate").val("");
        $("#topStateCities_range1EndDate").val("");
        if ($("#topStateCitiesDashlet").find(".inputBaseStartDate").val() !== "" && $("#topStateCitiesDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#topStateCities_range1StartDate").val($("#topStateCitiesDashlet").find(".inputBaseStartDate").val());
            $("#topStateCities_range1EndDate").val($("#topStateCitiesDashlet").find(".inputBaseEndDate").val());
        }
        createTopStateCitiesGraph();
    });
    $("#topStateCitiesDashlet").find(".cancelDates").click(function () {
        $("#topStateCities_range1StartDate").val("");
        $("#topStateCities_range1EndDate").val("");
        createTopStateCitiesGraph();
    });
    
    $("#correspondence_state").on("click", loadTopStateGraph);
    $("#correspondence_city").on("click", loadTopCityGraph);
    
    createTopStateCitiesGraph();
};

function loadTopStateGraph() {
    $(".graph-data").parent('li').removeClass('active');
    $("#correspondence_state").parent('li').addClass('active');
    $("#graphType").val("correspondence_state");
    $('#stateCityLabel').text('Top States ');
    createTopStateCitiesGraph();
}

function loadTopCityGraph() {
    $(".graph-data").parent('li').removeClass('active');
    $("#correspondence_city").parent('li').addClass('active');
    $("#graphType").val("correspondence_city");
    $('#stateCityLabel').text('Top 50 Cities ');
    createTopStateCitiesGraph();
}

var createTopStateCitiesGraph = function () {
    var dashletUrl = $("#topStateCitiesDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#topStateCities_collegeId").val($("#collegeId").val());
    var filters = $("#topStateCitiesFilterForm").serializeArray();
    console.log(filters);
    var target_type = $("ul.nav-graph li.active a.graph-data").attr('id');
    if(target_type.indexOf('state') != -1){
        var xaxis_title = 'States';
    }else{
        var xaxis_title = 'Cities';
    }

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
	    $('#topStateCitiesFilterForm .btn-group').removeClass('open');
            $('#topStateCitiesDashletHTML .panel-loader').hide();
            $('#topStateCitiesDashletHTML .panel-heading, #topStateCitiesDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    updatetopStateCitiesGraph(responseObject.data, xaxis_title);
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

function updatetopStateCitiesGraph(dashletData, xaxis_title) {

    var dateRangeHtml = "(" + dashletData.startDate + " - " + dashletData.endDate + ")";
    if (typeof dashletData.compareStartDate !== "undefined" && typeof dashletData.compareEndDate !== "undefined") {
        dateRangeHtml = dateRangeHtml + " vs (" + dashletData.compareStartDate + " to " + dashletData.compareEndDate + ")";
    }
    $("#topStateCities_dateRange").html(dateRangeHtml);
    if (dashletData.graphData.labels != "") {
	FusionCharts.ready(function(){
	    var fusioncharts = new FusionCharts({
		type: "scrollcolumn2d",
		renderAt: "topStateCities",
		width: "100%",
		height: "350",
		dataFormat: "json",
		dataSource :{
          "chart": {
           "yaxisname": "Applications Count",
           "xaxisname": xaxis_title,
           "showhovereffect":"1",
           "baseFont":"Roboto",
           "baseFontSize": "12",
           "drawcrossline":"1",

           "numVisiblePlot":"15",
           "paletteColors":"1f77b4,ff7f0e,2ca02c,d62728,9467bd,8c564b,e377c2,7f7f7f,bcbd22,17becf",
           "plottooltext":"<b>$dataValue</b> Applications",
					    //Customized Scroll Bar
					    "flatScrollBars": "1",
					    "scrollColor": "fafafa",
					    "scrollheight": "6",
					    "scrollPadding": "5",
                        // "scrolltoend": "1",
                        "scrollPadding" : "10",
                        "theme": "fusion"
		    },
		    "categories":[
			{ "category" : dashletData.graphData.labels }
		    ],
		    "dataset"   : [
			{ 'data'  : dashletData.graphData.applicationCount }
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
	$('#topStateCities').html(html);
    }
	

}

function topStateCities_downloadCSV() {
    $("#topStateCitiesFilterForm").submit();
}

function resetTopStateCitiesFilterForm() {
    $("#topStateCitiesFilterForm").find('select.dashletFilter').each(function () {
        $(this).val('');
    });
    $('.chosen-select').trigger('chosen:updated');
}

