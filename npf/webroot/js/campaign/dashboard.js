var loadPublisherDetailsFlag = true;
var loadSocialDetailsFlag = true;
var loadOrganicDetailsFlag = true;
var loadOfflineDetailsFlag = true;
var isSumoLoad = false;

$(document).ready(function () {
    $('[data-toggle="popover"]').popover();
    $('.btn-group').on('show.bs.dropdown', function () {
        $('.chosen-select').trigger('chosen:close');
    });
    loadReportDateRangepicker();
    google.charts.load("current", {packages: ['corechart']});
    //if college is pre selected,trigger search btn 
    if (typeof jsVars.TriggerCampaignMangerSearchBtn !== 'undefined') {
        $('#main_button').trigger('click');
    }
    $('body').on('click', function () {
        $('.google-visualization-tooltip').hide();
    });

    $('.leads-filter .dropdown-menu').on('click', function (event) {
        event.stopPropagation();
    });
    
    if($("#graph_states").length){
        $('#graph_states').SumoSelect({isClickAwayOk:true, locale : ['Apply', 'Cancel', 'Select All'],selectAll:true, okCancelInMulti: false, placeholder: 'Select States', search: true, searchText:'Select States'});
    }

    $(document).on('click', 'span.sorting_span i', function () {
        var sortField = jQuery(this).data('column');
        var sortOrder = jQuery(this).data('sorting');
        LoadCampaignDetails(sortField, sortOrder);
    });
});

$(document).ajaxComplete(function () {
    $('[data-toggle="popover"]').popover();
});

$(window).load(function () {
    if ($("#college_id").length > 0 && $("#college_id").val() != '') {
//            $("#graphDiv").hide();
        intializeDashboard();
    }
});

jQuery(function () {
    $('.filter_collapse').dropdown('toggle');
});

function intializeDashboard() {
//    $("#campaignDetailedLinkSpan").hide();
    $("input[name='source_keys[]']:checked").removeAttr('checked');
    if (jsVars.canViewDashboardTable) {
        $("#dateRange").val('');
        $("#lead_type").val('').trigger('chosen:updated');
        LoadCampaignDetails();
    }
    if(jsVars.canViewDashboardGraph){
        $("#publisherChannelGraphDiv").show();
        //$('#graphDateRange').on('apply.daterangepicker', loadChannelWiseGraph);
        //$('#graphDateRange').on('cancel.daterangepicker', loadChannelWiseGraph);
        $("#graphDateRange").val('');
        $("#graph_lead_type").val('').trigger('chosen:updated');
        var html    = '<select id="sourcePublisher" tabindex="-1" multiple="multiple" name="sourcePublisher[]"></select>';
        $('#sourcePublisherDiv').html(html);
        $('#sourcePublisher').SumoSelect({okCancelInMulti:true, search: true, searchText:'Search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
        loadChannelWiseGraph();
    }
    
    showHideCourseVsSource();
}


function showHideCourseVsSource() {
    if ($("#college_id").val() == '') {
        $("#courseVsSourceTab").hide();
        return;
    }
    $.ajax({
        url: jsVars.getCourseVsSourceLabelLink,
        type: 'post',
        data: {'collegeId': $("#college_id").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $("#courseVsSourceTab").hide();
//            $('#campaignListLoader.sectionLoader').show();
        },
        complete: function () {
//            $('#campaignListLoader.sectionLoader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if (responseObject.status == 1) {
                if (responseObject.data['parentFieldLabel'] !== '') {
                    $("#courseVsSourceTab").show();
                    $("#courseVsSourceTitle").html(responseObject.data['parentFieldLabel']);
                }
            } else {
                console.log(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function LoadCampaignDetails(sortField, sortOrder) {
    var toggleVal = $(document).find('input[name="toggleVal"]:checked').val();
    //$("#tableDiv").hide();
    $("#downloadTableButton").hide();
    loadPublisherDetailsFlag = [];
    loadReferralDetailsFlag = [];
    loadPaidAdsDetailsFlag = [];
    if ($("#college_id").val() == "") {
        $('#load_msg_div').show();
        $('#content').css('background-color', '#fff');
        $('#tableDiv, #graphDiv').hide();
        return;
    }
    if (typeof sortField === "undefined" || sortField === null) {
        sortField = '';
    }
    if (typeof sortOrder === "undefined" || sortOrder === null) {
        sortOrder = '';
    }
    $("#sortField").val(sortField);
    $("#sortOrder").val(sortOrder);
    $.ajax({
        url: jsVars.loadCampaignDetailsLink,
        type: 'post',
        data: {'lead_type': $("#lead_type").val(), 'collegeId': $("#college_id").val(), 'dateRange': $("#dateRange").val(), sortField: sortField, sortOrder: sortOrder},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#campaignListLoader.sectionLoader').show();
        },
        complete: function () {
            $('#campaignListLoader.sectionLoader').hide();
        },
        success: function (html) {
            var checkError = html.substring(0, 6);
            if (html === 'session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (checkError === 'ERROR:') {
                alert(html.substring(6, html.length));
            } else {
                $('#content').css('background-color', '#eee');
                $('#load_msg_div').hide();
                $("#tableDiv").show();
                html = html.replace("<head/>", "");
                $('#CampaignManagerContainerSection').html(html);
                $('.offCanvasModal').modal('hide');
                if ($("#load_more_results").length > 0) {
                    $("#downloadTableButton").show();
                }
                if ($("input[name='filters[college_id]']").length > 0) {
                    $("input[name='filters[college_id]']").val($("#college_id").val());
                }
                if ($("input[name='collegeId']").length > 0) {
                    $("input[name='collegeId']").val($("#college_id").val());
                }
                $("#graphDiv").show();
            }
            toggleMeiData(toggleVal);             
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function loadDashboardTablePublisherDetails(trafficChannel, totalLeads, totalApplication, totalSubmittedApplications, totalEnrollment) {
    if (loadPublisherDetailsFlag.indexOf(trafficChannel) !== -1) {
        return;
    }
    var toggleVal = $(document).find('input[name="toggleVal"]:checked').val();
    loadPublisherDetailsFlag.push(trafficChannel);
    $.ajax({
        url: jsVars.dashboardTablePublisherDetailsLink,
        type: 'post',
        data: {trafficChannel:trafficChannel,'leadType': $("#lead_type").val(), 'collegeId': $("#college_id").val(), 'dateRange': $("#dateRange").val(), 'totalLeads': totalLeads, 'totalApplication': totalApplication, 'totalSubmittedApplications': totalSubmittedApplications,  'totalEnrollment': totalEnrollment},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#campaignListLoader.sectionLoader').show();
        },
        complete: function () {
            $('#campaignListLoader.sectionLoader').hide();
        },
        success: function (html) {
            var checkError = html.substring(0, 6);
            if (html === 'session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (checkError === 'ERROR:') {
                alert(html.substring(6, html.length));
            } else {
                html = html.replace("<head/>", "");
                $('#traffiChannel'+trafficChannel).html(html);
            }
            toggleMeiData(toggleVal);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function loadDashboardTableGoogleAdsDetails(trafficChannel, totalLeads, totalApplication, totalSubmitApplication, totalEnrollment, trafficChannelId, publisherId) {
    
    if (loadPaidAdsDetailsFlag.indexOf(trafficChannel) !== -1) {
        return;
    }
    loadPaidAdsDetailsFlag.push(trafficChannel);
    $.ajax({
        url: jsVars.dashboardTablePaidAdsDetailsLink,
        type: 'post',
        data: {trafficChannel:trafficChannelId, publisherId:publisherId, 'leadType': $("#lead_type").val(), 'collegeId': $("#college_id").val(), 'dateRange': $("#dateRange").val(), 'totalLeads': totalLeads, 'totalApplication': totalApplication, 'totalSubmitApplication': totalSubmitApplication, 'totalEnrollment': totalEnrollment},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#campaignListLoader.sectionLoader').show();
        },
        complete: function () {
            $('#campaignListLoader.sectionLoader').hide();
        },
        success: function (html) {
            var checkError = html.substring(0, 6);
            if (html === 'session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (checkError === 'ERROR:') {
                alert(html.substring(6, html.length));
            } else {
                html = html.replace("<head/>", "");
                $('#traffiChannelGoogleAds').html(html);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function loadDashboardTableFacebookDetails(trafficChannel, totalLeads, totalApplication, totalSubmitApplication, totalEnrollment, trafficChannelId, publisherId) {
    
    if (loadPaidAdsDetailsFlag.indexOf(trafficChannel) !== -1) {
        return;
    }
    loadPaidAdsDetailsFlag.push(trafficChannel);
    $.ajax({
        url: jsVars.dashboardTableFacebookDetailsLink,
        type: 'post',
        data: {trafficChannel:trafficChannelId, publisherId:publisherId, 'leadType': $("#lead_type").val(), 'collegeId': $("#college_id").val(), 'dateRange': $("#dateRange").val(), 'totalLeads': totalLeads, 'totalApplication': totalApplication, 'totalSubmitApplication': totalSubmitApplication, 'totalEnrollment': totalEnrollment},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#campaignListLoader.sectionLoader').show();
        },
        complete: function () {
            $('#campaignListLoader.sectionLoader').hide();
        },
        success: function (html) {
            var checkError = html.substring(0, 6);
            if (html === 'session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (checkError === 'ERROR:') {
                alert(html.substring(6, html.length));
            } else {
                html = html.replace("<head/>", "");
                $('#traffiChannelFacebook').html(html);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function loadDashboardTableReferralDetails(trafficChannel, totalLeads, totalApplication, totalSubmittedApplications, totalEnrollment) {

    if (loadReferralDetailsFlag.indexOf(trafficChannel) !== -1) {
        return;
    }
    var toggleVal = $(document).find('input[name="toggleVal"]:checked').val();
    loadReferralDetailsFlag.push(trafficChannel);
    $.ajax({
        url: jsVars.dashboardTableReferralDetailsLink,
        type: 'post',
        data: {trafficChannel:trafficChannel,'leadType': $("#lead_type").val(), 'collegeId': $("#college_id").val(), 'dateRange': $("#dateRange").val(), 'totalLeads': totalLeads, 'totalApplication': totalApplication, 'totalSubmittedApplications': totalSubmittedApplications, 'totalEnrollment': totalEnrollment},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#campaignListLoader.sectionLoader').show();
        },
        complete: function () {
            $('#campaignListLoader.sectionLoader').hide();
        },
        success: function (html) {
            var checkError = html.substring(0, 6);
            if (html === 'session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (checkError === 'ERROR:') {
                alert(html.substring(6, html.length));
            } else {
                html = html.replace("<head/>", "");
                $('#traffiChannel'+trafficChannel).html(html);
            }
            toggleMeiData(toggleVal);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function downloadDashboardTable(type) {
    $("#collgeSelected").val($("#college_id").val());
    $("#dateSelected").val($("#dateRange").val());
    if ($("#downloadtype").length) {
        $("#downloadtype").val(type);
    } else {
        $("#tableHtmlForm").append($("<input>").attr({"value": type, "name": "downloadtype", 'type': "hidden", "id": "downloadtype"}));
    }
    $("#leadTypeSelected").val($("#lead_type").val());


    $("#tableHtmlForm").submit();
}

function loadChannelWiseGraph(){
    $("#graph_states_container").hide();
    $('.offCanvasModal').modal('hide');
    $.ajax({
        url     : jsVars.loadDashboardGraphDataLink,
        type    : 'post',
        data    : {'state_id':$("#graph_states").val(), 'lead_type':$("#graph_lead_type").val(),'collegeId':$("#college_id").val(),'dateRange':$("#graphDateRange").val(), 'sortingOn':$("#graph_bar_sorting").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#campaignGraphLoader.sectionLoader').show();
        },
        complete: function () {
            $('#campaignGraphLoader.sectionLoader').hide();
        },
        success: function (response) { 
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object" && typeof responseObject.data.stateList === "object") {
                    var checkedStates   = $("#graph_states").val();
                    $('#graph_states').SumoSelect({isClickAwayOk:true, locale : ['Apply', 'Cancel', 'Select All'],selectAll:true, okCancelInMulti: false, placeholder: 'Select States', search: true, searchText:'Select States'});
                    var stateOptions = '';
                    $.each(responseObject.data.stateList, function (index, item) {
                        if(checkedStates != null && $.inArray(index, checkedStates) != -1){
                            stateOptions += '<option value="'+index+'" selected>'+item+'</option>';
                        }else{
                            stateOptions += '<option value="'+index+'">'+item+'</option>';
                        }
                    });
                    if(stateOptions != ''){
                        $('#graph_states_container').show();
                        $('#graph_states').html(stateOptions);
                    }else{
                        $('#graph_states_container').hide();
                    }
                    $('select#graph_states')[0].sumo.reload();
                }
                if (typeof responseObject.data === "object" && typeof responseObject.data.graphData === "object") {
                    FusionCharts.ready(function () {
                        var fusioncharts = new FusionCharts({
                            "theme": "fusion",
                            type: "scrollcolumn2d",
                            loadMessage: "Loading graph...",
                            loadMessageFontSize: "16",
                            loadMessageColor: "#1f77b4",
                            renderAt: "reg_chart_div",
                            width: "100%",
                            height: "350",
                            dataFormat: "json",
                            dataSource: {
                                "chart": {
                                    numvisibleplot: "30",
                                    "captionAlignment": "left",
                                    "palettecolors": "1f77b4,f6a858,29c3be,d62728,9467bd,8c564b,e377c2,7f7f7f,bcbd22,17becf",
                                    "captionFont": "Roboto",
                                    "captionFontSize": "16",
                                    "captionFontColor": "#111",
                                    "captionFontBold": "0",
                                    "theme": "fusion",
                                    "scrollheight": "3",
                                    "flatScrollBars": "1",
                                    exportFileName:"topPublishersAndChannels",
                                    exportEnabled: jsVars.canDownloadDashboardGraph
                                },
                                "categories": [{
                                        "category": responseObject.data.graphData.category
                                    }],
                                "dataset": responseObject.data.graphData.dataset
                            }
                        });
                        fusioncharts.render();
                    });
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
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
};
$(document).on('change', '.toggleVal', function(){
    var toggleVal = $(this).val();
    toggleMeiData(toggleVal);
});
function toggleMeiData(toggleVal) {
    if(toggleVal === 'numberTag') {
        $(document).find('.countVal').show();
        $(document).find('.percentVal').hide();
        $(document).find('.meicol_sorting').addClass('sorting_span')
        $(document).find('.meicol_sorting').show()
    } else {
        $(document).find('.percentVal').show();
        $(document).find('.countVal').hide();
        $(document).find('.meicol_sorting').removeClass('sorting_span')
        $(document).find('.meicol_sorting').hide()
    }
}


function tourcam(){
	var tourCampaign  = new Tour({
		steps: [
			  {
				element: ".meicol",
				title: "Mutually Exclusive Impact (MEI)<sup class='text-danger'>New</sup>",
				content: "You can compare campaign performance based on MEI, which will help you understand how unique were the leads/applications sent by different traffic channels and publishers.",
				template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><button class='btn btn-xs btn-npf btn-end' data-role='end'>Close</button></nav></div>",
				placement: "left",
				next: -1,
				prev: -1,
			  }
			],
		name : 'CampaignDashboard',	
		backdrop: true,
	
        /*onStart:function(tourCampaign){
            $('body').css('overflow','hidden');
        },
        onEnd:function(tourCampaign){
            $('body').css('overflow','auto');
        }*/
    });  
        
	// Initialize the tour
	tourCampaign.init();
	// Start the tour
	tourCampaign.start();
}
