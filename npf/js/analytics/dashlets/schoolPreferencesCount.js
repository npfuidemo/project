var initilizeSchoolPreferencesCount = function () {
    createSchoolPreferencesCountGraph();
};

var createSchoolPreferencesCountGraph = function () {
    var dashletUrl = $("#schoolPreferencesCountDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#schoolPreferencesCount_collegeId").val($("#collegeId").val());
    var filters = $("#schoolPreferencesCountFilterForm").serializeArray();
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
	    $('#schoolPreferencesCountFilterForm .btn-group').removeClass('open');
            $('#schoolPreferencesCountDashletHTML .panel-loader').hide();
            $('#schoolPreferencesCountDashletHTML .panel-heading, #schoolPreferencesCountDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    updateSchoolPreferencesCountGraph(responseObject.data);
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

function updateSchoolPreferencesCountGraph(dashletData) {

    if (dashletData.graphData.labels != "") {
	FusionCharts.ready(function(){
	    var fusioncharts = new FusionCharts({
		type: "scrollcolumn2d",
		renderAt: "schoolPreferencesCount",
		width: "100%",
		height: "300",
		dataFormat: "json",
		dataSource :{
		    "chart": {
                        "yaxisname": "Count",
                        "xaxisname": 'Preferences',
                        "showhovereffect":"1",
                        "baseFont":"Roboto",
                        "baseFontSize": "12",
                        "drawcrossline":"1",
                        "numVisiblePlot":"15",
                        "paletteColors":"#1f77b4,#ff7f0e,#2ca02c,d62728,9467bd,8c564b,e377c2,7f7f7f,bcbd22,17becf",
                        "plottooltext":"<b>$dataValue</b>",
                        "flatScrollBars": "1",
                        "scrollColor": "fafafa",
                        "scrollheight": "6",
                        "scrollPadding": "5",
                        "theme": "fusion"
                    },
		    "categories":[
			{ "category" : dashletData.graphData.labels }
		    ],
		    "dataset"   : [
			{ 'data'  : dashletData.graphData.users }
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
	$('#schoolPreferencesCount').html(html);
    }

}

function schoolPreferencesCount_downloadCSV() {
    $("#schoolPreferencesCountFilterForm").submit();
}

function resetSchoolPreferencesCountFilterForm() 
{
    $("#schoolPreferencesCountFilterForm").find('select.dashletFilter').each(function () {
        $(this).val('');
    });
    $('.chosen-select').trigger('chosen:updated');
}