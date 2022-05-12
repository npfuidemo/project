var initilizesmsCommStats = function () {
    $("#smsCommStatsDashlet").find(".applyDates").click(function () 
    {
        $("#smsCommStats_range1StartDate").val("");
        $("#smsCommStats_range1EndDate").val("");
        if ($("#smsCommStatsDashlet").find(".inputBaseStartDate").val() !== "" && $("#smsCommStatsDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#smsCommStats_range1StartDate").val($("#smsCommStatsDashlet").find(".inputBaseStartDate").val());
            $("#smsCommStats_range1EndDate").val($("#smsCommStatsDashlet").find(".inputBaseEndDate").val());
        }
        $('#smsCommStatsDashletHTML .panel-loader').show();
        createsmsCommStatsGraph();
    });
    $("#smsCommStatsDashlet").find(".cancelDates").click(function () {
        $("#smsCommStats_range1StartDate").val("");
        $("#smsCommStats_range1EndDate").val("");
        $('#smsCommStatsDashletHTML .panel-loader').show();
        createsmsCommStatsGraph();
    });

    if ($("#smsCommStats_university_id").length) 
    {
        $("#smsCommStats_university_id").change(getCourseList);
        $("#smsCommStats_course_id").attr('data-dependant',1);
    }

    if($('#smsCommStats_specialization_id option').length == 1)
    {
        $("#smsCommStats_course_id").change(getCourseList);
        $("#smsCommStats_specialization_id").attr('data-dependant',1);
    }

    $(".sumo-select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true, okCancelInMulti: true});
    createsmsCommStatsGraph();
    
    $("#smsActivityChannel").on("click", setSMSGraphActivityChannelWise);
    $("#smsEngagementChannel").on("click", setSMSGraphEngagementChannelWise);
};

function setSMSGraphActivityChannelWise() {
    $(".graph-data-sms-comm-stats").parent('li').removeClass('active');
    $("#smsActivityChannel").parent('li').addClass('active');
    $("#smsCommStats_channel").val("transactional");
    $('#smsCommStatsDashletHTML .panel-loader').show();
    createsmsCommStatsGraph();
}

function setSMSGraphEngagementChannelWise() {
    $(".graph-data-sms-comm-stats").parent('li').removeClass('active');
    $("#smsEngagementChannel").parent('li').addClass('active');
    $("#smsCommStats_channel").val("promotional");
    $('#smsCommStatsDashletHTML .panel-loader').show();
    createsmsCommStatsGraph();
}

var createsmsCommStatsGraph = function () {
    var dashletUrl = $("#smsCommStatsDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#smsCommStats_collegeId").val($("#collegeId").val());
    var filters = $("#smsCommStatsFilterForm").serializeArray();
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
            $('#smsCommStatsDashletHTML .panel-loader').hide();
            $('#smsCommStatsDashletHTML .panel-heading, #smsCommStatsDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") 
                {
//                    updatesmsCommStats(responseObject.data);
                    updateSMSCommStatsGraph(responseObject.data);
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(responseObject.message, 'error');
                }
            }
//			initSmsSlider();
            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

};

function updateSMSCommStatsGraph(dashletData) {

    if (typeof dashletData.total != 'undefined') {
        $("#totalSmsRequests").html('<label class="dLabelData">Sent</label><span>' + dashletData.total.Requests.total + '</span><i class="fa fa-signal" aria-hidden="true"></i>');
        $("#totalSmsDelivered").html('<label class="dLabelData">Delivered</label><span>' + dashletData.total.Delivered.percentage + '%</span><small>' + dashletData.total.Delivered.total + '</small>');
        $("#totalSmsClicked").html('<label class="dLabelData">Clicked</label><span>' + dashletData.total.Clicked.percentage + '%</span><small>' + dashletData.total.Clicked.total + '</small>');
        $("#totalSmsNDNCReject").html('<label class="dLabelData">DND</label><span>' + dashletData.total.NDNCReject.percentage + '%</span><small>' + dashletData.total.NDNCReject.total + '</small>');
        $("#totalSmsAbsentSubscriber").html('<label class="dLabelData">Absent Subscriber</label><span>' + dashletData.total.AbsentSubscriber.percentage + '%</span><small>' + dashletData.total.AbsentSubscriber.total + '</small>');
        $("#totalSmsFailed").html('<label class="dLabelData">Others</label><span>' + dashletData.total.Failed.percentage + '%</span><small>' + dashletData.total.Failed.total + '</small>');
        $("#totalSmsInvalidSubscriber").html('<label class="dLabelData">Invalid Subscriber</label><span>' + dashletData.total.InvalidSubscriber.percentage + '%</span><small>' + dashletData.total.InvalidSubscriber.total + '</small>');
        $("#totalSmsMessageInboxFull").html('<label class="dLabelData">Message Inbox Full</label><span>' + dashletData.total.MessageInboxFull.percentage + '%</span><small>' + dashletData.total.MessageInboxFull.total + '</small>');
    }
    
    var dateRangeHtml = "(";
    if (dashletData.startDate != '') {
        dateRangeHtml +=  dashletData.startDate + " - ";
    }
    if (dashletData.endDate != '') {
        dateRangeHtml += dashletData.endDate;
    }
    dateRangeHtml += ")";
    if (typeof dashletData.compareStartDate !== "undefined" && typeof dashletData.compareEndDate !== "undefined") {
        dateRangeHtml = dateRangeHtml + " vs (" + dashletData.compareStartDate + " to " + dashletData.compareEndDate + ")";
    }
    $("#smsCommStats_dateRange").html(dateRangeHtml);
    $("#smsCommStats_dateRange_mobile").html(dateRangeHtml);
    FusionCharts.ready(function(){
        var fusioncharts = new FusionCharts({
            type: "msspline",
            renderAt: "smsCommStatsGraph",
            width: "100%",
            height: "400",
            dataFormat: "json",
            dataSource :{
                "chart": {
//                    "caption": "Reach of Social Media Platforms amoung youth",
                    "yaxisname": "(Count)",
//                    "xaxisname": "(Year)",
//                    "subcaption": "2012-2016",
                    "showhovereffect": "1",
//                    "numbersuffix": "%",
		    "baseFont": "Roboto",
                    "drawcrossline": "1",
                    "plottooltext": "<b>$dataValue</b>  $seriesName",
                    "theme": "fusion",
//                    exportEnabled:"1"
                },
                "categories":[
                    { "category" : dashletData.graphData.labels }
                ],
                "dataset"   : [
                    { 'seriesname':'Sent', 'data'  : dashletData.graphData.Sent },
                    { 'seriesname':'Delivered', 'data'  : dashletData.graphData.Delivered },
                    { 'seriesname':'Clicked', 'data'  : dashletData.graphData.Clicked },
                    { 'seriesname':'DND', 'data'  : dashletData.graphData.NDNCReject },
                    { 'seriesname':'Absent Subscriber', 'data'  : dashletData.graphData.AbsentSubscriber },
                    { 'seriesname':'Invalid Subscriber', 'data'  : dashletData.graphData.InvalidSubscriber },
                    { 'seriesname':'Message Inbox Full', 'data'  : dashletData.graphData.MessageInboxFull },
                    { 'seriesname':'Others', 'data'  : dashletData.graphData.Failed },
                ]
            }
        });
        fusioncharts.render();    
    });

}

function initSmsSlider(){
    $(".chart_communication_slider").find(".owl-carousel").owlCarousel({
        items: 1,
        nav: true,
        responsive: {
            480: {
                items: 1
            },
            780: {
                items: 2
            },
            980: {
                items: 2
            },
            1250: {
                items: 2
            },
			1400: {
                items: 2
            }
        }
    });
    
}

// function updatesmsCommStats(dashletData) 
function updatesmsCommStats(dashletData) 
{
    // console.log(dashletData);
    $.each(dashletData.chart, function(ind, data_Ar) 
    {
        if(ind != "sent")
        {
            const dataSource = {
                chart: {
                    caption: "",
                    subcaption: "",
					defaultcenterlabel: ind,
                    showpercentvalues: 1,
                    enableRotation: 1,
                    enableSmartLabels: 1,
                    doughnutRadius: 80,
                    startingAngle: 270,
                    captionpadding: 0,
                    decimals: "1",
                    baseFontSize : 12,
                    // plottooltext:"<b>$percentValue</b> of our Android users are on <b>$label</b>",
                    plottooltext: "<div id='nameDiv' style='font-size: 12px; border-bottom: 1px dashed #666666; font-weight:bold; padding-bottom: 3px; margin-bottom: 5px; display: inline-block; color: #888888;' >$label</div>{br} <div id='nameDiv' style='font-size: 14px; padding-bottom: 3px; display: inline-block;' ><strong>$value</strong> SMS</div>",
                    theme: "fusion",
					palettecolors: "1f77b4,cccccc",
                },
                data: data_Ar
            };

            FusionCharts.ready(function() {
                var myChart = new FusionCharts({
                    type: "doughnut2d",
                    renderAt: "chart_"+ind,
                    width: "100%",
                    height: "100%",
                    dataFormat: "json",
                    dataSource
                }).render();
            });

        }
    });


    if(dashletData.startDate != '')
    {
        var dateRangeHtml = "(" + dashletData.startDate + " - " + dashletData.endDate + ")";
        if (typeof dashletData.compareStartDate !== "undefined" && typeof dashletData.compareEndDate !== "undefined") {
            dateRangeHtml = dateRangeHtml + " vs (" + dashletData.compareStartDate + " to " + dashletData.compareEndDate + ")";
        }        
        $("#smsCommStats_dateRange").html(dateRangeHtml);
    }else{
        $("#smsCommStats_dateRange").html("All Time");
    }
    $("#sms_sent").html(dashletData.sent);
   
}

function smsCommStats_downloadCSV() {
    $("#smsCommStatsFilterForm").submit();
}

function resetsmsCommStatsFilterForm() {
    $("#smsCommStatsFilterForm").find('select.dashletFilter').each(function () {
        $(this).val('');
    });
    $('.chosen-select').trigger('chosen:updated');
}

function getCourseList () 
{
    var placeholder = ref_id = '';
    var el_id = $(this).attr('id');
    var value = $("#"+el_id).val();
    if(el_id.indexOf('course') != -1){
        placeholder = 'Specialization';
        ref_id = 'smsCommStats_specialization_id';
    }else{
        placeholder = 'Course';
        ref_id = 'smsCommStats_course_id';
        if($("#smsCommStats_specialization_id").attr('data-dependant') == 1)
        {
            $("#smsCommStats_specialization_id").html("");
            $("#smsCommStats_specialization_id")[0].sumo.reload();
        }
    }
    var dependant = $("#"+ref_id).attr('data-dependant');
    if(dependant == '0')
    {
        return false;
    }
    $("#"+ref_id).html("");
    $("#"+ref_id)[0].sumo.reload();
    if (value !== "") {
        $.ajax({
            url: '/analytics/getCourseList/' + value,
            type: 'get',
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
            },
            complete: function () {
                $('#smsCommStatsDashletHTML .panel-loader').hide();
                $('#smsCommStatsDashletHTML .panel-heading, #smsCommStatsDashletHTML .panel-body').removeClass('pvBlur');
            },
            success: function (response) {
                var responseObject = $.parseJSON(response);
                if (responseObject.status == 1) {
                    if (typeof responseObject.data === "object") {
                            $("#"+ref_id).append("<option value=''>Select " + placeholder + "</option>"); 
                        $.each(responseObject.data, function (formStage, formStageLabel) {
                            $("#"+ref_id).append("<option value='" + formStage + "'>" + formStageLabel + "</option>");
                        });
                        $("#"+ref_id)[0].sumo.reload();
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