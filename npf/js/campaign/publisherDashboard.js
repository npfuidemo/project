$(document).ready(function(){
    $('[data-toggle="popover"]').popover();
    loadReportDateRangepicker();
    loadSummary();
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
    
    $("#date_range").on('apply.daterangepicker', loadSummary);
    $('#date_range').on('cancel.daterangepicker', loadSummary);
    
    $('#lead_type').on('change', function() {
	loadSummary();
    });
    
    $("#prevSession").hide();
    $("#applicationtrend_form_id").on("change",function()
    {
        var form_id = $(this).val();
        var collegeId = $("#college_id").val();
        $.ajax({
             url: '/campaign-manager/get-publisher-benchmark-session',
             type: 'post',
             data: {form_id : form_id, college_id: collegeId},
             dataType: 'json',
             headers: {
                 "X-CSRF-Token": jsVars._csrfToken
             },
             beforeSend: function () {
             },
             complete: function () {

             },
             success: function (response) {
                 var responseObject = response;
                 if (responseObject.status === 1) 
                 {
                     if (responseObject.data.count > 0) 
                     {
                         $("#prevSession").show();
                     }else{
                         $("#prevSession").hide();
                     }
                     generateApplicationTrendGraph();
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
    });
  
});

function loadSummary(){
    getCampaignCounts();
    $.ajax({
        url: jsVars.campaignSummaryLink, 
        type: 'post',
        data:  $("#trackCampaignFilter").serialize(),
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
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    $("#totalPrimaryRegistrations").html(responseObject.data.primaryLeads);
                    $("#totalSecondaryRegistrations").html(responseObject.data.secondaryLeads);
                    $("#totalTertiaryRegistrations").html(responseObject.data.tertiaryLeads);
                    $("#totalRegistrations").html(responseObject.data.totalLeads);
                    $("#totalVerifiedRegistrations").html(responseObject.data.verifiedLeads);
                    $("#totalUnverifiedRegistrations").html(responseObject.data.unverifiedLeads);
                    if($("#totalApplications").length){
                        $("#totalApplications").html(responseObject.data.applications);
                        $("#totalSubmittedApplications").html(responseObject.data.submittedApplications);

                    }
                    if($("#totalEnrollment").length){
                        $('#totalEnrollment').html(responseObject.data.enrollments);
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
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getCampaignCounts(){
    $.ajax({
        url: jsVars.campaignCountLink, 
        type: 'post',
        data:  $("#trackCampaignFilter").serialize(),
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
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if(typeof responseObject.data.detailPageUrl !=="undefined"){
                        $("#campaignCount").html(responseObject.data.campaignCount+'<a id="campaignCountLink" href="'+responseObject.data.detailPageUrl+'" style="font-size:12px;font-weight:400;" target="_blank">(View Report)</a>');
                    }else{
                        $("#campaignCount").html(responseObject.data.campaignCount);
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
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
}

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

function ResetFilterValue($this){
    $('#trackCampaignFilter').find('input[type="text"]').each(function(){
       $(this).val('');
    });	
}

function loadTrendsGraphs() {
    $("#leadOriginGraphDateRange").on('apply.daterangepicker', generateLeadOriginGraph);
    $('#leadOriginGraphDateRange').on('cancel.daterangepicker', generateLeadOriginGraph);
    
    $(document).on('change', '#leadorigin_course', function() {
	generateLeadOriginGraph();
    });
    
    $("#paymentApprovedDate").on("click", setGraphPaymentApprovedDateWise);
    $("#applicationSubmittedDate").on("click", setGraphSubmittedDateWise);

    generateLeadOriginGraph();
    mutuallyExclusiveImpact();
    nonMEIData();
    primarySourceSecondaryLeads();
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
    
    generateLeadTrendGraph();
    if(jsVars.canViewApplicationGraph)
    {
        generateApplicationTrendGraph();
    }
    generateIncompleteGraph();
    generateLeadDispositionTrendGraph();
    
    $("#applicationTrendGraphDateRange").on('apply.daterangepicker', generateApplicationTrendGraph);
    $('#applicationTrendGraphDateRange').on('cancel.daterangepicker', generateApplicationTrendGraph);
    
    $(document).on('change', '#prevSession', function() {
        var prevSession = $(this).val();
        $("#prevSession").val(prevSession);
	generateApplicationTrendGraph();
    });
    
    $("#leadTrendGraphDateRange").on('apply.daterangepicker', generateLeadTrendGraph);
    $('#leadTrendGraphDateRange').on('cancel.daterangepicker', generateLeadTrendGraph);
    
    $(document).on('change', '#lead_status,#leadtrend_course,#leadPrevSession', function() {
	generateLeadTrendGraph();
    });
    
    $(document).on('click','.sumo_calcAvgPublisherId .btnOk',function() {
	generateLeadTrendGraph();
    });
}

function generateLeadTrendGraph() {
    $.ajax({
        url: jsVars.leadTrendGraphLink,
        type: 'post',
        data: {dateRange: $('#leadTrendGraphDateRange').val(),trafficChannel:$("#traffic_channel").val(),leadPrevSession:$("#leadPrevSession").val(), 'college_id': $("#college_id").val(), 'publisher_id': $("#publisher_id").val(),'calcAvgPublisherId' : $("#calcAvgPublisherId").val(), 'lead_status' : $('#lead_status').val(), 'course' : $('#leadtrend_course').val()},
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

function generateApplicationTrendGraph() {
    if(jsVars.isOnlyCRMInstitute)
    {
        if(!jsVars.isPaymentApprovedEnabled && jsVars.isApplicationSubmitEnabled)
        {
            $(".graph-data-application-trend").parent('li').removeClass('active');
            $("#applicationSubmittedDate").parent('li').addClass('active');
            $("#dateType").val("application_submitted_details");
        }
    }
    
    $.ajax({
        url: jsVars.applicationTrendGraphLink,
        type: 'post',
        data: {dateRange: $('#applicationTrendGraphDateRange').val(),traffic_channel:$("#traffic_channel").val(), 'college_id': $("#college_id").val(), 'publisher': $("#publisher_id").val(), 'dateType': $("#dateType").val(), prevSession: $("#prevSession").val(), 'form_id' : $("#applicationtrend_form_id").val()},
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
                
                var dateRangeHtml = "(" + responseObject.data.dates.startDate + " - " + responseObject.data.dates.endDate + ")";
                $("#applicationTrend_dateRange").html(dateRangeHtml);
                
                
                if (typeof responseObject.data === "object") {
                    if (responseObject.data != "") {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "msspline",
                                renderAt: "applicationTrend_graph_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "yaxisname": "(Applications Count)",
                                        "numdivlines": "3",
                                        "showvalues": "0",
                                        "legenditemfontsize": "15",
                                        "legenditemfontbold": "1",
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
                        $('#applicationTrend_graph_div').html(html);
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
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function setGraphPaymentApprovedDateWise() {
    $(".graph-data-application-trend").parent('li').removeClass('active');
    $("#paymentApprovedDate").parent('li').addClass('active');
    $("#dateType").val("payment_approved_details");
    generateApplicationTrendGraph();
}

function setGraphSubmittedDateWise() {
    $(".graph-data-application-trend").parent('li').removeClass('active');
    $("#applicationSubmittedDate").parent('li').addClass('active');
    $("#dateType").val("application_submitted_details");
    generateApplicationTrendGraph();
}

function generateLeadOriginGraph() {

    $.ajax({
        url: jsVars.leadOriginGraphLink,
        type: 'post',
        data: {dateRange: $('#leadOriginGraphDateRange').val(),trafficChannel:$("#traffic_channel").val(), 'college_id': $("#college_id").val(), 'publisher_id': $("#publisher_id").val(), 'course': $("#leadorigin_course").val()},
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
                if (typeof responseObject.data === "object" && typeof responseObject.data.list === "object") {
                    if (responseObject.data.list != "") {
			$('#leadOrigin_graph_div').html('');
			var html = '';
			html += '<table class="table table-hover leftCellFixedOnly headingfixStyle">';
			html += '<thead>';
			html += '<tr>';
			html += '<th>Lead Origin</th>';
			html += '<th>Total Leads <a tabindex="1" class="icon-info" role="button" data-placement="top" data-container="body" data-toggle="popover" data-trigger="focus" data-content="Number of Leads received from respective lead origin"><span class="lineicon-info" aria-hidden="true"></span></a></th>';
			html += '<th>Verified Lead <a tabindex="1" class="icon-info" role="button" data-placement="top" data-container="body" data-toggle="popover" data-trigger="focus" data-content="Percentage of leads with either email id or mobile number verified. Verification settings may vary for Institute to Institute"><span class="lineicon-info" aria-hidden="true"></span></a></th>';
			html += '<th>Unverified Lead<a tabindex="1" class="icon-info" role="button" data-placement="top" data-container="body" data-toggle="popover" data-trigger="focus" data-content="Percentage of leads with neither email id or mobile number verified. Verification settings may vary for Institute to Institute"><span class="lineicon-info" aria-hidden="true"></span></a></th>';
			html += '<th>'+responseObject.data.formInitiatedLabel+' <a tabindex="1" class="icon-info" role="button" data-placement="top" data-container="body" data-toggle="popover" data-trigger="focus" data-content="Percentage of leads who have initiated to fill the Application Form"><span class="lineicon-info" aria-hidden="true"></span></a></th>';
            html += '<th>'+responseObject.data.paymentApprovedLabel+' <a tabindex="1" class="icon-info" role="button" data-placement="top" data-container="body" data-toggle="popover" data-trigger="focus" data-content="Percentage of leads who have made the payment against an Application Form"><span class="lineicon-info" aria-hidden="true"></span></a></th>';
			if(jsVars.showSubmittedApplications)
            {
                html += '<th>'+responseObject.data.submittedApplicationLabel+' <a tabindex="1" class="icon-info" role="button" data-placement="top" data-container="body" data-toggle="popover" data-trigger="focus" data-content="Percentage of leads that have submitted their applications"><span class="lineicon-info" aria-hidden="true"></span></a></th>';
            }
			html += '</tr>';
			html += '</thead>';
			html += '<tbody>';
			
			$.each(responseObject.data.list, function(leadKey,leadVal) { 
			    html += '<tr>';
			    html += '<td class="text-left fw-500">'+leadKey+'</td>';
				$.each(leadVal, function(key,val) {             
				    var symbol = (key != 'total')?'%':'';
				    var value = (key != 'total')?val.toFixed(2):val;
                    if(key == 'submitted_applications' && !jsVars.showSubmittedApplications)
                    {
                        return;
                    }else{
                        html += '<td class="text-left">'+value+' '+symbol+'</td>';       
                    }
				}); 
			    html += '</tr>';
			});

			html += '</tbody>';
			html += '</table>';
			$('#leadOrigin_graph_div').html(html);
			$('.leadorigin').hide();
                    }else{
			var html = '';
			html += '<div class="margin-top-30 margin-bottom-20"><div class="noDataFoundBlock d-flex align-items-center"><div class="innerHtml"><img src="/img/no-record.png" alt="no-record"><span class="text-muted h4">No Data Found</span></div></div></div>';
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
        data: {dateRange: $('#incompleteGraphDateRange').val(),trafficChannel:$("#traffic_channel").val(), 'college_id': $("#college_id").val(), 'publisher_id': $("#publisher_id").val()},
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
        data: {dateRange: $('#leadTrendDispositionGraphDateRange').val(),trafficChannel:$("#traffic_channel").val(), 'college_id': $("#college_id").val(), 'publisher_id': $("#publisher_id").val(), 'lead_stage' : $("#LeadStageIdSelect").val(),'calcAvgPublisherId' : $("#leadDispositionPublisherId").val(),'course' : $("#leaddispositiontrend_course").val()},
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
										"yaxisname": "(Leads Count)",
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

function syncApplicantData(){
    $.ajax({
        url: '/DataSync/syncAplicantsWithElastic/'+$("#college_id").val(),
        type: 'get',
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $('#trackCampaignLoader.loader-block').show();
        },
        complete: function () {
            setTimeout(function() {location.reload(); }, 5000);
        },
        success: function (response) { 
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr);
            console.log(thrownError);
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$(document).find("#meiDateRange").on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
    mutuallyExclusiveImpact();
});
$(document).find('#meiDateRange').on('cancel.daterangepicker', function(){
    $('#meiDateRange').val('');
    mutuallyExclusiveImpact();
});
$(document).find("#nonMeiDateRange").on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
    nonMEIData();
});
$(document).find('#nonMeiDateRange').on('cancel.daterangepicker', function(){
    $('#nonMeiDateRange').val('');
    nonMEIData();
});
$(document).find("#primarySecondaryDateRange").on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
    primarySourceSecondaryLeads();
});
$(document).find('#primarySecondaryDateRange').on('cancel.daterangepicker', function(){
    $('#primarySecondaryDateRange').val('');
    primarySourceSecondaryLeads();
});

$(document).on('change', '#meiLeadType', mutuallyExclusiveImpact);
$(document).on('change', '#nonMeiLeadType', nonMEIData);
$(document).on('change', '#primarySecondaryLeadType', primarySourceSecondaryLeads);

function mutuallyExclusiveImpact() {
    var toggleVal = $(document).find('input[name="meiToggle"]:checked').val();
    $.ajax({
        url: jsVars.mutuallyExclusiveImpactLink,
        type: 'post',
        dataType: 'html',
        data: {'collegeId':$("#college_id").val(), 'dateRange': $('#meiDateRange').val(), 'leadType': $('#meiLeadType').val(), 'publisher_id': $('#publisher_id').val(), "trafficChannel":$("#traffic_channel").val()},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
	    $('.meiLoader').show();
        },
        complete: function () {
	    $('.meiLoader').hide();
        },
        success: function (response) { 
            
            var responseObject = $.parseJSON(response);
            if(responseObject.status===1){
                if(responseObject.data.html) {
                    $(document).find("#mei_data_div").html(responseObject.data.html);
                    $(document).find("#meiTotalLeads").html(responseObject.data.totalCount);
                }
                $('.meiLoader').hide();
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message, 'error');
                }
            }
            table_fix_rowcol();
            if(toggleVal === 'numberTag') {
                $(document).find('#meiDataTable .countVal').show();
                $(document).find('#meiDataTable .percentVal').hide();
            } else {
                $(document).find('#meiDataTable .percentVal').show();
                $(document).find('#meiDataTable .countVal').hide();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function nonMEIData() {
    var toggleVal = $(document).find('input[name="nonMEIToggle"]:checked').val();
    $.ajax({
        url: jsVars.nonMutuallyExclusiveDataLink,
        type: 'post',
        dataType: 'html',
        data: {'collegeId':$("#college_id").val(), 'dateRange': $('#nonMeiDateRange').val(), 'leadType': $('#nonMeiLeadType').val(), 'publisher_id': $('#publisher_id').val(), "trafficChannel":$("#traffic_channel").val()},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
	    $('.nonMeiLoader').show();
        },
        complete: function () {
	    $('.nonMeiLoader').hide();
        },
        success: function (response) { 
            
            var responseObject = $.parseJSON(response);
            if(responseObject.status===1){
                if(responseObject.data.html) {
                    $(document).find("#non_mei_data_div").html(responseObject.data.html);
                    $(document).find("#nonMeiTotalLeads").html(responseObject.data.totalCount);
                }
                $('.nonMeiLoader').hide();
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message, 'error');
                }
            }
            table_fix_rowcol();
            if(toggleVal === 'numberTag') {
                $(document).find('#nonMeiDataTable .countVal').show();
                $(document).find('#nonMeiDataTable .percentVal').hide();
            } else {
                $(document).find('#nonMeiDataTable .percentVal').show();
                $(document).find('#nonMeiDataTable .countVal').hide();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function primarySourceSecondaryLeads() {
    var toggleVal = $(document).find('input[name="primarySourceToggle"]:checked').val();
    $.ajax({
        url: jsVars.primarySourceSecondaryLeadsLink,
        type: 'post',
        dataType: 'html',
        data: {'collegeId':$("#college_id").val(), 'dateRange': $('#primarySecondaryDateRange').val(), 'leadType': $('#primarySecondaryLeadType').val(), 'publisher_id': $('#publisher_id').val(), "trafficChannel":$("#traffic_channel").val()},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
	    $('.primarySecondaryLoader').show();
        },
        complete: function () {
	    $('.primarySecondaryLoader').hide();
        },
        success: function (response) { 
            
            var responseObject = $.parseJSON(response);
            if(responseObject.status===1){
                if(responseObject.data.html) {
                    $(document).find("#primary_secondary_data_div").html(responseObject.data.html);
                    $(document).find("#primarySecondaryTotalLeads").html(responseObject.data.totalCount);
                }
                $('.primarySecondaryLoader').hide();
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message, 'error');
                }
            }
            table_fix_rowcol();
            if(toggleVal === 'numberTag') {
                $(document).find('#primarySourceSecondaryDataTable .countVal').show();
                $(document).find('#primarySourceSecondaryDataTable .percentVal').hide();
            } else {
                $(document).find('#primarySourceSecondaryDataTable .percentVal').show();
                $(document).find('#primarySourceSecondaryDataTable .countVal').hide();
            }
            tourcamIn();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function mutuallyExclusiveImpact_downloadCSV() {
    $("#mutuallyExclusiveImpactForm").find("#collgeSelected").val($("#college_id").val());
    $("#mutuallyExclusiveImpactForm").find("#dateSelected").val($("#meiDateRange").val());
    $("#mutuallyExclusiveImpactForm").find("#publisherId").val($("#publisher_id").val());
    $("#mutuallyExclusiveImpactForm").find("#leadType").val($('#meiLeadType').val());
    $("#mutuallyExclusiveImpactForm").find("#trafficChannel").val($('#traffic_channel').val());
    $("#mutuallyExclusiveImpactForm").submit();
}

function nonMutuallyExclusiveImpact_downloadCSV() {
    $("#nonMutuallyExclusiveImpactForm").find("#collgeSelected").val($("#college_id").val());
    $("#nonMutuallyExclusiveImpactForm").find("#dateSelected").val($("#nonMeiDateRange").val());
    $("#nonMutuallyExclusiveImpactForm").find("#publisherId").val($("#publisher_id").val());
    $("#nonMutuallyExclusiveImpactForm").find("#leadType").val($('#nonMeiLeadType').val());
    $("#nonMutuallyExclusiveImpactForm").find("#trafficChannel").val($('#traffic_channel').val());
    $("#nonMutuallyExclusiveImpactForm").submit();
}

function primarySourceSecondaryLead_downloadCSV() {
    $("#primarySecondaryForm").find("#collgeSelected").val($("#college_id").val());
    $("#primarySecondaryForm").find("#dateSelected").val($("#primarySecondaryDateRange").val());
    $("#primarySecondaryForm").find("#publisherId").val($("#publisher_id").val());
    $("#primarySecondaryForm").find("#leadType").val($('#primarySecondaryLeadType').val());
    $("#primarySecondaryForm").find("#trafficChannel").val($('#traffic_channel').val());
    $("#primarySecondaryForm").submit();
}




function tourcamIn(){
	var tourpriLeads = new Tour({
		steps: [
              {
                element: ".secondaryInstance",
                title: "Secondary Instance of leads <sup class='text-danger'>New</sup>",
				content: "You can view the list of secondary traffic channels and publishers. The table will assist you in understanding which traffic channel or publisher contributed the most.",
				template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><button class='btn btn-default' data-role='end'>Close</button> <button class='btn btn-npf pull-right' data-role='next'>Next »</button> </nav></div>",
				placement: "right",
              },
			  {
				element: ".priLeads",
				title: "Primary Instance of Secondary and Tertiary leads <sup class='text-danger'>New</sup>",
				content: "The table will assist you in understanding which primary traffic channel or publisher contributed the most for secondary and tertiary leads.",
				template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Prev</button> <button class='btn btn-npf btn-end' data-role='end'>Close</button></nav></div>",
				placement: "right", 
			  },
			],
		name : 'Primarysource',	
        smartPlacement: true,
		backdrop: true,
                
//                onStart:function(tourCampaign){
//                    $('body').css('overflow','hidden');
//                },
//                onEnd:function(tourCampaign){
//                    $('body').css('overflow','auto');
//                }
	});  
	// Initialize the tour
	tourpriLeads.init();
	// Start the tour
	tourpriLeads.start();
}

$(document).on('change', '.toggleVal', function(){
    var toggleVal = $(this).val();
    toggleMeiData(toggleVal, this);
});
function toggleMeiData(toggleVal, thisObj) {
    if(toggleVal === 'numberTag') {
        $(thisObj).closest('.dataTable').find('.countVal').show();
        $(thisObj).closest('.dataTable').find('.percentVal').hide();
    } else {
        $(thisObj).closest('.dataTable').find('.percentVal').show();
        $(thisObj).closest('.dataTable').find('.countVal').hide();
    }
}