$(document).ready(function(){
	$('[data-toggle="popover"]').popover();
    loadReportDateRangepicker();
    loadTrackCampaignDetails('reset');
    //loadTrendsGraphs();   
    
    $('#LeadStageIdSelect').SumoSelect({placeholder: 'Select Lead Stage', search: true, searchText:'Search Lead Stage', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false, okCancelInMulti: true });
    $('#lead_status').SumoSelect({placeholder: 'Lead Status', search: true, searchText:'Lead Status', triggerChangeCombined: false });
    $('#trafficChannel').SumoSelect({placeholder: 'Select Channel', search: true, searchText:'Search Channel', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
    $('#calcAvgPublisherId,#leadDispositionPublisherId').SumoSelect({placeholder: 'Select Publisher', search: true, searchText:'Search Publisher', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false, okCancelInMulti: true });
    
    $("#trendsGroup").on("click", showTrendsGraphs);
    $("#otherinsightsGroup").on("click", showOtherInsightsGraphs);
    
    if ($("#trendsGroup").parent("li").hasClass("active")) {
        $('#otherinsightsGroup').on("click", loadOtherInsightsGraphs);
        showTrendsGraphs();
        loadTrendsGraphs();
    }
    
    if ($("#otherinsightsGroup").parent("li").hasClass("active")) {
        $('#trendsGroup').on("click", loadTrendsGraphs);
        showOtherInsightsGraphs();
        loadOtherInsightsGraphs();
    }
    
    $("#date_range").on('apply.daterangepicker', loadTrackCampaignDetails);
    $('#date_range').on('cancel.daterangepicker', loadTrackCampaignDetails);
    
    $('#lead_type').on('change', function() {
	loadTrackCampaignDetails('reset');
    });
  
});

function showTrendsGraphs() {
    $(".user-tabuler-data").parent('li').removeClass('active');
    $("#trendsGroup").parent('li').addClass('active');
    $("#otherinsights-graphDiv").hide();
    $("#trends-graphDiv").show();
    $("#selectedGroup").val("trends");
}

function showOtherInsightsGraphs() {
    $(".user-tabuler-data").parent('li').removeClass('active');
    $("#otherinsightsGroup").parent('li').addClass('active');
    $("#trends-graphDiv").hide();
    $("#otherinsights-graphDiv").show();
    $("#selectedGroup").val("otherinsights");
}

$(document).ajaxComplete(function() {
    $('[data-toggle="popover"]').popover();
});

var loaderCount=0;

/**
 * 
 * load campaign detail
 */
function loadTrackCampaignDetails(listingType){
    if(jsVars.canTrackCampaignDetail==false){
        return false;
    }
    if($("#college_id").val()==""){
        $('#tableViewContainer').html("<div class='col-lg-12'><table class='table table-striped list_data table-border'><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'> Please select a institute name to view campaign tracking details. </h4></div></div> </td></tr><tr></tr></table></div>");
        return;
    }
    listingType = 'reset';
    if(listingType === 'reset'){
        $("#page").val(1);
    }
     $.ajax({
        url: jsVars.loadTrackCampaignDetailsLink,
        type: 'post',
        data: $('#trackCampaignFilter select ,#trackCampaignFilter input'),
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $('#trackCampaignLoader.loader-block').show();
            loaderCount++;
        },
        complete: function () {
            loaderCount--;
            if(loaderCount==0){
                $('#trackCampaignLoader.loader-block').hide();
            }
        },
        success: function (html) { 
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
            }else{
                html    = html.replace("<head/>", "");
                var countRecord = countResult(html);
                if(listingType == 'reset'){
                    if(countRecord == 0){
                        $("#tableSummary").hide();
                        $("#table_action").hide();
                    }else{
                        $("#tableSummary").show();
                        $("#table_action").show();
                    }
                    $('#tableViewContainer').html(html);
                }else{
                    $('#tableViewContainer').find("tbody#load_more_results").append(html);
                }
//                if(countRecord < 10){
//                    $('#load_more_button').hide();
//                }else{
//                    $('#load_more_button').show();
//                }
                $("#page").val(parseInt($("#page").val())+1);
				$('.offCanvasModal').modal('hide');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function countResult(html){
    var len = (html.match(/listDataRow/g) || []).length;
    return len;
}

function ResetFilterValue($this){
    $('#trackCampaignFilter').find('input[type="text"]').each(function(){
       $(this).val('');
    });	
}

function loadTrendsGraphs() {
    $("#leadOriginGraphDateRange").on('apply.daterangepicker', generateLeadOriginGraph);
    $('#leadOriginGraphDateRange').on('cancel.daterangepicker', generateLeadOriginGraph);
    
    $("#leadTrendGraphDateRange").on('apply.daterangepicker', generateLeadTrendGraph);
    $('#leadTrendGraphDateRange').on('cancel.daterangepicker', generateLeadTrendGraph);
    
    $(document).on('change', '#lead_status,#leadtrend_course', function() {
	generateLeadTrendGraph();
    });
    
    $(document).on('change', '#leadorigin_course', function() {
	generateLeadOriginGraph();
    });
    
    $(document).on('click','.sumo_calcAvgPublisherId .btnOk',function() {
	generateLeadTrendGraph();
    });

    generateLeadOriginGraph();
    generateLeadTrendGraph();
   
}

function loadOtherInsightsGraphs(){
    $("#incompleteGraphDateRange").on('apply.daterangepicker', generateIncompleteGraph);
    $('#incompleteGraphDateRange').on('cancel.daterangepicker', generateIncompleteGraph);
    
    $("#leadTrendDispositionGraphDateRange").on('apply.daterangepicker', generateLeadDispositionTrendGraph);
    $('#leadTrendDispositionGraphDateRange').on('cancel.daterangepicker', generateLeadDispositionTrendGraph);
    
    $(document).on('click', '.sumo_lead_stage .btnOk', function() {
	generateLeadDispositionTrendGraph();
    });
    
    $(document).on('change', '#leaddispositiontrend_course', function() {
	generateLeadDispositionTrendGraph();
    });
    
    $(document).on('click','.sumo_leadDispositionPublisherId .btnOk',function() {
	generateLeadDispositionTrendGraph();
    });
    
    generateIncompleteGraph();
    generateLeadDispositionTrendGraph();
}

function generateLeadTrendGraph() {
    $.ajax({
        url: jsVars.leadTrendGraphLink,
        type: 'post',
        data: {dateRange: $('#leadTrendGraphDateRange').val(), 'college_id': $("#college_id").val(), 'publisher_id': $("#PublisherIdSelect").val(),'calcAvgPublisherId' : $("#calcAvgPublisherId").val(), 'lead_status' : $('#lead_status').val(), 'course' : $('#leadtrend_course').val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
	    $('.leadTrend').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data === "object") {
			if (responseObject.data != "") {
			    FusionCharts.ready(function () {
				var fusioncharts = new FusionCharts({
				    type: "msspline",
				    renderAt: "leadTrend_graph_div",
				    width: "100%",
				    height: "350",
				    dataFormat: "json",
				    dataSource: {
					"chart": {
					    "yaxisname": "(Leads Count)",
					    "numdivlines": "3",
					    "showvalues": "0",
					    "legenditemfontsize": "15",
					    "legenditemfontbold": "1",
					    "subcaption": "By default top 3 publishers are included in other channel / publisher trend",
					    "captionOnTop":0,
					    "theme": "fusion"
					},
					"categories": responseObject.data.categories,
					"dataset":responseObject.data.dataset
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
			    $('#leadTrend_graph_div').html(html);
			    $('.leadorigin').hide();
			}
                    }
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

function generateLeadOriginGraph() {

    $.ajax({
        url: jsVars.leadOriginGraphLink,
        type: 'post',
        data: {dateRange: $('#leadOriginGraphDateRange').val(), 'college_id': $("#college_id").val(), 'publisher_id': $("#PublisherIdSelect").val(), 'course': $("#leadorigin_course").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
	    $('#leadOrigin_graph_div').html('');
	    $('.leadorigin').show();
        },
        complete: function () {
	    $('.leadorigin').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (responseObject.data != "") {
			$('#leadOrigin_graph_div').html('');
			var html = '';
			html += '<table class="table table-hover">';
			html += '<thead>';
			html += '<tr>';
			html += '<th>Lead Origin</th>';
			html += '<th>Total Leads <a tabindex="1" class="icon-info" role="button" data-placement="top" data-container="body" data-toggle="popover" data-trigger="focus" data-content="Number of Leads received from respective lead origin"><span class="lineicon-info" aria-hidden="true"></span></a></th>';
			html += '<th>Verified Lead <a tabindex="1" class="icon-info" role="button" data-placement="top" data-container="body" data-toggle="popover" data-trigger="focus" data-content="Percentage of leads with either email id or mobile number verified. Verification settings may vary for Institute to Institute"><span class="lineicon-info" aria-hidden="true"></span></a></th>';
			html += '<th>Unverified Lead<a tabindex="1" class="icon-info" role="button" data-placement="top" data-container="body" data-toggle="popover" data-trigger="focus" data-content="Percentage of leads with neither email id or mobile number verified. Verification settings may vary for Institute to Institute"><span class="lineicon-info" aria-hidden="true"></span></a></th>';
			html += '<th>Form Initiated <a tabindex="1" class="icon-info" role="button" data-placement="top" data-container="body" data-toggle="popover" data-trigger="focus" data-content="Percentage of leads who have initiated to fill the Application Form"><span class="lineicon-info" aria-hidden="true"></span></a></th>';
			html += '<th>Payment Approved <a tabindex="1" class="icon-info" role="button" data-placement="top" data-container="body" data-toggle="popover" data-trigger="focus" data-content="Percentage of leads who have made the payment against an Application Form"><span class="lineicon-info" aria-hidden="true"></span></a></th>';
			html += '</tr>';
			html += '</thead>';
			html += '<tbody>';
			
			$.each(responseObject.data, function(leadKey,leadVal) { 
			    html += '<tr>';
			    html += '<td class="text-left">'+leadKey+'</td>';
				$.each(leadVal, function(key,val) {             
				    var symbol = (key != 'total')?'%':'';
				    var value = (key != 'total')?val.toFixed(2):val;
				    html += '<td class="text-left">'+value+' '+symbol+'</td>';       
				}); 
			    html += '</tr>';
			});

			html += '</tbody>';
			html += '</table>';
			$('#leadOrigin_graph_div').html(html);
			$('.leadorigin').hide();
                    }else{
			var html = '';
			html += '<div class="margin-top-30 margin-bottom-30">';
			html += '<div class="noData text-muted text-center">';
			html += '<p class="noDataicon m0"><i class="fa fa-database fa-3x"></i></p>';
			html += '<p class="noDataMsg m0 font16">Data Not Available</p>';
			html += '</div>';
			html += '</div>';
			$('#leadOrigin_graph_div').html(html);
			$('.leadorigin').hide();
		    }
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

function alertPopup(msg, type, location) {

    if (type == 'error') {
        var selector_parent = '#ErrorPopupArea';
        var selector_titleID = '#ErroralertTitle';
        var selector_msg = '#ErrorMsgBody';
        var btn = '#ErrorOkBtn';
        var title_msg = 'Error';
    } else {
        var selector_parent = '#SuccessPopupArea';
        var selector_titleID = '#alertTitle';
        var selector_msg = '#MsgBody';
        var btn = '#OkBtn';
        var title_msg = 'Success';
    }

    $(selector_titleID).html(title_msg);
    $(selector_msg).html(msg);
    $('.oktick').hide();

    if (typeof location != 'undefined') {
        $(btn).show();

        $(selector_parent).modal({keyboard: false}).one('click', btn, function (e) {
            e.preventDefault();
            window.location.href = location;
        });
    }
    else {
        $(selector_parent).modal();
    }
}

function generateIncompleteGraph() {
    
    var programText = ($("#college_id").val() == 297)?'Program':'Course';
    $.ajax({
        url: jsVars.incompleteLeadGraphLink,
        type: 'post',
        data: {dateRange: $('#incompleteGraphDateRange').val(), 'college_id': $("#college_id").val(), 'publisher_id': $("#PublisherIdSelect").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
        },
        success: function (response) {
			/*if (document.documentElement.clientWidth < 768) {
				var doughnutChartWidth = '320'
			}else{
			  var doughnutChartWidth = '100%'
			}*/
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data === "object") {
			if (responseObject.data.missingState != "" || responseObject.data.total != 0) {
			    FusionCharts.ready(function () {
				var fusioncharts = new FusionCharts({
				    type: "doughnut2d",
				    renderAt: "incompletelead_state_graph_div",
				    width: "100%",
				    height: "350",
				    dataFormat: "json",
				    dataSource: {
					"chart": {
					    "showpercentvalues": "1",
					    "defaultcenterlabel": "State",
					    "aligncaptionwithcanvas": "0",
					    "captionpadding": "0",
					    "decimals": "1",
					    "showLabels": 0,
					    "theme": "fusion"
					},
					"data": [
						    {
						      label: "Filled State",
						      value: responseObject.data.total - responseObject.data.missingState,
						      color: "#ffc107"
						    },
						    {
						      label: "Missing State",
						      value: responseObject.data.missingState,
						      color: "#6c757d"
						    }
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
			    $('#incompletelead_state_graph_div').html(html);
			    $('.leadorigin').hide();
			}
			
			if (responseObject.data.missingCity != "" || responseObject.data.total != 0) {
			    FusionCharts.ready(function () {
				var fusioncharts = new FusionCharts({
				    type: "doughnut2d",
				    renderAt: "incompletelead_city_graph_div",
				    width: "100%",
				    height: "350",
				    dataFormat: "json",
				    dataSource: {
					"chart": {
					    "showpercentvalues": "1",
					    "defaultcenterlabel": "City",
					    "aligncaptionwithcanvas": "0",
					    "captionpadding": "0",
					    "decimals": "1",
					    "showLabels": 0,
					    "theme": "fusion"
					},
					"data": [
						    {
						      label: "Filled City",
						      value: responseObject.data.total - responseObject.data.missingCity,
						      color: "#dc3545"
						    },
						    {
						      label: "Missing City",
						      value: responseObject.data.missingCity,
						      color: "#6c757d"
						    }
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
			    $('#incompletelead_city_graph_div').html(html);
			    $('.leadorigin').hide();
			}
			
			if (responseObject.data.missingCourse != "" || responseObject.data.total != 0) {
			    FusionCharts.ready(function () {
				var fusioncharts = new FusionCharts({
				    type: "doughnut2d",
				    renderAt: "incompletelead_program_graph_div",
				    width: "100%",
				    height: "350",
				    dataFormat: "json",
				    dataSource: {
					"chart": {
					    "showpercentvalues": "1",
					    "defaultcenterlabel": programText,
					    "aligncaptionwithcanvas": "0",
					    "captionpadding": "0",
					    "decimals": "1",
					    "showLabels": 0,
					    "theme": "fusion"
                                    },
					"data": [
						    {
						      label: "Filled "+programText,
						      value: responseObject.data.total - responseObject.data.missingCourse,
						      color: "#2765dd"
						    },
						    {
						      label: "Missing "+programText,
						      value: responseObject.data.missingCourse,
						      color: "#6c757d"
						    }
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
			    $('#incompletelead_program_graph_div').html(html);
			    $('.leadorigin').hide();
			}
                    }
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

function generateLeadDispositionTrendGraph() {
    if($("#LeadStageIdSelect").val() == '' || $("#LeadStageIdSelect").val() == null){
	alertPopup('Please Select Lead Stages','error');
	return;
    }
    $.ajax({
        url: jsVars.leadTrendDispositionGraphLink,
        type: 'post',
        data: {dateRange: $('#leadTrendDispositionGraphDateRange').val(), 'college_id': $("#college_id").val(), 'publisher_id': $("#PublisherIdSelect").val(), 'lead_stage' : $("#LeadStageIdSelect").val(),'calcAvgPublisherId' : $("#leadDispositionPublisherId").val(),'course' : $("#leaddispositiontrend_course").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
	    $('.leadorigin').show();
        },
        complete: function () {
	    $('.leadorigin').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (responseObject.data.categories != "") {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "scrollcolumn2d",
                                renderAt: "leadDispositionTrend_graph_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
										"yaxisname": "Leads Count",
										"numvisibleplot": "8",
										"labeldisplay": "auto",
										"subcaption": "By default top 3 publishers are included in other channel / publisher trend",
										"captionOnTop":0,
										"theme": "fusion",
										 //Customized Scroll Bar
										"flatScrollBars": "1",
										"scrollColor": "fafafa",
										"scrollheight": "6",
										"scrollPadding": "5",
                                    },
                                    "categories": responseObject.data.categories,
				    "dataset":responseObject.data.dataset
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
			$('#leadDispositionTrend_graph_div').html(html);
			$('.leadorigin').hide();
		    }
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