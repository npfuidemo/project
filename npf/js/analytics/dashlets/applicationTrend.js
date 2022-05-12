var initilizeApplicationTrend = function () {
    $("#applicationtrendDashlet").find(".applyDates").click(function () {
        $("#applicationtrend_range1StartDate").val("");
        $("#applicationtrend_range1EndDate").val("");
        if ($("#applicationtrendDashlet").find(".inputBaseStartDate").val() !== "" && $("#applicationtrendDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#applicationtrend_range1StartDate").val($("#applicationtrendDashlet").find(".inputBaseStartDate").val());
            $("#applicationtrend_range1EndDate").val($("#applicationtrendDashlet").find(".inputBaseEndDate").val());
        }
        if(!applicationTrendValidation())
        {
            alertPopup("Please select traffic channel & publisher from filters", 'error');
            return false;
        }
        createApplicationTrendGraph();
    });
    $("#applicationtrendDashlet").find(".cancelDates").click(function () {
        $("#applicationtrend_range1StartDate").val("");
        $("#applicationtrend_range1EndDate").val("");
        if(!applicationTrendValidation())
        {
            alertPopup("Please select traffic channel & publisher from filters", 'error');
            return false;
        }
        createApplicationTrendGraph();
    });
    createApplicationTrendGraph();
    
    $("#paymentApprovedDate").on("click", setGraphPaymentApprovedDateWise);
    $("#applicationSubmittedDate").on("click", setGraphSubmittedDateWise);
    
    if($("#onlyCrmCollege").val() !== '1'){
        $(".applicationtrend_traffic_channel").hide();
        $(".applicationtrend_publisher").hide();
        $(".prevSession").hide();
    }
};

function setGraphPaymentApprovedDateWise() {
    $(".graph-data-application-trend").parent('li').removeClass('active');
    $("#paymentApprovedDate").parent('li').addClass('active');
    $("#dateType").val("payment_approved_details");
    if(!applicationTrendValidation())
    {
        alertPopup("Please select traffic channel & publisher from filters", 'error');
        return false;
    }
    createApplicationTrendGraph();
}

function setGraphSubmittedDateWise() {
    $(".graph-data-application-trend").parent('li').removeClass('active');
    $("#applicationSubmittedDate").parent('li').addClass('active');
    $("#dateType").val("application_submitted_details");
    if(!applicationTrendValidation())
    {
        alertPopup("Please select traffic channel & publisher from filters", 'error');
        return false;
    }
    createApplicationTrendGraph();
}
function applicationTrendValidation()
{
    if($("#prevSession").length)
    {
        let prevSession = $("#prevSession").val();
        let traffic_channel = $("#applicationtrend_traffic_channel").val();
        let publisher = $("#applicationtrend_publisher").val();
        if((prevSession != '') && (traffic_channel == '' || publisher == ''))
        {
            return false;
        }
    }
    return true;
}
var createApplicationTrendGraph = function () {
    initializeFilterDependency();
    var dashletUrl = $("#applicationtrendDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#applicationtrend_collegeId").val($("#collegeId").val());
    var filters = $("#applicationTrendFilterForm").serializeArray();
    
    if(!applicationTrendValidation())
    {
        var html = '';
        html += '<div class="margin-top-30 margin-bottom-30">';
        html += '<div class="noData text-muted text-center">';
        html += '<p class="noDataicon m0"><i class="fa fa-exclamation-circle fa-3x"></i></p>';
        html += '<p class="noDataMsg m0 font16">Please select traffic channel and publisher from filters</p>';
        html += '</div>';
        html += '</div>';
        $('#applicationTrend').html(html);
        $('#applicationTrendFilterForm .btn-group').removeClass('open');
        $('#applicationTrendDashletHTML .panel-loader').hide();
        $('#applicationTrendDashletHTML .panel-heading, #applicationTrendDashletHTML .panel-body').removeClass('pvBlur');
        return false;
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
	    $('#applicationTrendFilterForm .btn-group').removeClass('open');
            $('#applicationTrendDashletHTML .panel-loader').hide();
            $('#applicationTrendDashletHTML .panel-heading, #applicationTrendDashletHTML .panel-body').removeClass('pvBlur');
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
                                type: "scrollline2d",
                                renderAt: "applicationTrend",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "yaxisname": "Applications Count",
										"xaxisname": "Applications",
                                        "numdivlines": "3",
                                        "showvalues": "0",
										"showLegend": "0",
									    "scrolltoend": "1",
										"scrollPadding" : "10",
										"scrollheight": "6",
										"showhovereffect": "1",
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
                        $('#applicationTrend').html(html);
                    }
		}
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(responseObject.message);
                }
            }
            
            
            
//            
//            
//            
//            
//            var responseObject = $.parseJSON(response);
//            if (responseObject.status == 1) {
//                var dateRangeHtml = "(" + responseObject.data.dates.startDate + " - " + responseObject.data.dates.endDate + ")";
//                $("#applicationTrend_dateRange").html(dateRangeHtml);
//                
//                if (typeof responseObject.data === "object") {
//                    if (responseObject.data != "") {
//                        FusionCharts.ready(function () {
//                            var fusioncharts = new FusionCharts({
//                                type: "msspline",
//                                renderAt: "applicationTrend",
//                                width: "100%",
//                                height: "350",
//                                dataFormat: "json",
//                                dataSource: {
//                                    "chart": {
//                                        "yaxisname": "(Applications Count)",
//                                        "numdivlines": "3",
//                                        "showvalues": "0",
//                                        "legenditemfontsize": "15",
//                                        "legenditemfontbold": "1",
//					    "subcaption": "By default top 3 publishers are included in other channel / publisher trend",
//                                        "captionOnTop":0,
//                                        "theme": "fusion"
//                                    },
//                                    "categories": responseObject.data.categories,
//                                    "dataset":responseObject.data.dataset
//                                }
//                            });
//                            fusioncharts.render();
//                        });
//                    }else{
//                        var html = '';
//                        html += '<div class="margin-top-30 margin-bottom-30">';
//                        html += '<div class="noData text-muted text-center">';
//                        html += '<p class="noDataicon m0"><i class="fa fa-database fa-3x"></i></p>';
//                        html += '<p class="noDataMsg m0 font16">Data Not Available</p>';
//                        html += '</div>';
//                        html += '</div>';
//                        $('#applicationTrend').html(html);
//                    }
//		}
//            } else {
//                if (responseObject.message === 'session') {
//                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
//                } else {
//                    alertPopup(responseObject.message);
//                }
//            }
            
            
            
            
            
            
//            var responseObject = $.parseJSON(response);
//            if (responseObject.status == 1) {
//                if (typeof responseObject.data === "object") {
//                    updateApplicationTrendGraph(responseObject.data);
//                }
//            } else {
//                if (responseObject.message === 'session') {
//                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
//                } else {
//                    alertPopup(responseObject.message);
//                }
//            }
//            initializeFilterDependency();
//            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

};

//function updateApplicationTrendGraph(dashletData) {
//
//    var dateRangeHtml = "(" + dashletData.startDate + " - " + dashletData.endDate + ")";
//    if (typeof dashletData.compareStartDate !== "undefined" && typeof dashletData.compareEndDate !== "undefined") {
//        dateRangeHtml = dateRangeHtml + " vs (" + dashletData.compareStartDate + " to " + dashletData.compareEndDate + ")";
//    }
//    $("#applicationTrend_dateRange").html(dateRangeHtml);
//    if (dashletData.graphData.labels != "") {
//	FusionCharts.ready(function(){
//	    var fusioncharts = new FusionCharts({
//		type: "scrollline2d",
//		renderAt: "applicationTrend",
//		width: "100%",
//		height: "300",
//		dataFormat: "json",
//		dataSource :{
//		    "chart": {
//					    "yaxisname": "Applications Count",
//					    "xaxisname": "Date",
//                        "scrolltoend": "1",
//                        "scrollheight": "6",
//                        "scrollPadding" : "10",
//			"showhovereffect": "1",
//					    "baseFont": "Roboto",
//					    "baseFontSize": "12",
//			"drawcrossline": "1",
//			"plottooltext": "<b>$dataValue</b> Applications",
//			"theme": "fusion"
//		    },
//		    "categories":[
//			{ "category" : dashletData.graphData.labels }
//		    ],
//		    "dataset"   : [
//			{ 'data'  : dashletData.graphData.applications }
//		    ]
//		}
//	    });
//	    fusioncharts.render();    
//	});
//    }else{
//	var html = '';
//	html += '<div class="margin-top-30 margin-bottom-30">';
//	html += '<div class="noData text-muted text-center">';
//	html += '<p class="noDataicon m0"><i class="fa fa-database fa-3x"></i></p>';
//	html += '<p class="noDataMsg m0 font16">Data Not Available</p>';
//	html += '</div>';
//	html += '</div>';
//	$('#applicationTrend').html(html);
//    }
//
//}

function applicationTrend_downloadCSV() {
    $("#applicationTrendFilterForm").submit();
}

function resetApplicationTrendFilterForm() {
    if($("#onlyCrmCollege").val() !== '1'){
        $(".applicationtrend_traffic_channel").hide();
        $(".applicationtrend_publisher").hide();
        $(".prevSession").hide();
    }
    $("#applicationTrendFilterForm").find('select.dashletFilter').each(function () 
    {
        $(this).val('');
        $(this)[0].sumo.reload();
    });
}

function initializeFilterDependency()
{
    $("#applicationtrend_traffic_channel").on("change",function()
    {
        var traffic_channel = $(this).val();
        if(traffic_channel == '')
        {
            return false;
        }
        var referer = [3,4,5];
        var publisher = [1,2,7,8,9,10];
        var ajaxUrl = "";
        var collegeId = $("#collegeId").val();
        if($.inArray( traffic_channel, publisher))
        {
            ajaxUrl = '/campaign-manager/get-publisher-list';
        }else if($.inArray( traffic_channel, referer)){
            ajaxUrl = '/campaign-manager/get-referrer-list';
        }else{
            alertPopup("Invalid Traffic Channel");
            return false;
        }
        $.ajax({
             url: ajaxUrl,
             type: 'post',
             data: {traffic_channel : traffic_channel, college_id: collegeId},
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
                 if (responseObject.status == 1) 
                 {
                     if (typeof responseObject.data === "object") 
                     {
                         $("#applicationtrend_publisher").html("");
                         $("#applicationtrend_publisher").append("<option value=''>Select Publisher</option>"); 
                         $.each(responseObject.data.sourceList, function (formStage, formStageLabel) {
                             $("#applicationtrend_publisher").append("<option value='" + formStage + "'>" + formStageLabel + "</option>");
                         });
                         $("#applicationtrend_publisher")[0].sumo.reload();
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
    });
    
    $("#applicationtrend_form_id").on("change",function()
    {
        var form_id = $(this).val();
        if(form_id === '')
        {
            return false;
        }
        var collegeId = $("#collegeId").val();
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
                         $(".applicationtrend_traffic_channel").show();
                         $(".applicationtrend_publisher").show();
                         $(".prevSession").show();
                     }else{
                         $(".applicationtrend_traffic_channel").hide();
                         $(".applicationtrend_publisher").hide();
                         $(".prevSession").hide();
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
    });
    
    $(".sumo-select").SumoSelect({
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
}