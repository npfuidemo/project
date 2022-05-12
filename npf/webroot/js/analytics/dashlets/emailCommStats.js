var initilizeemailCommStats = function () {
    $("#emailCommStatsDashlet").find(".applyDates").click(function () 
    {
        $("#emailCommStats_range1StartDate").val("");
        $("#emailCommStats_range1EndDate").val("");
        if ($("#emailCommStatsDashlet").find(".inputBaseStartDate").val() !== "" && $("#emailCommStatsDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#emailCommStats_range1StartDate").val($("#emailCommStatsDashlet").find(".inputBaseStartDate").val());
            $("#emailCommStats_range1EndDate").val($("#emailCommStatsDashlet").find(".inputBaseEndDate").val());
        }
        $('#emailCommStatsDashletHTML .panel-loader').show();
        createemailCommStatsGraph();
    });
    $("#emailCommStatsDashlet").find(".cancelDates").click(function () {
        $("#emailCommStats_range1StartDate").val("");
        $("#emailCommStats_range1EndDate").val("");
        $('#emailCommStatsDashletHTML .panel-loader').show();
        createemailCommStatsGraph();
    });

    if ($("#emailCommStats_university_id").length) 
    {
        $("#emailCommStats_university_id").change(getCourseList);
        $("#emailCommStats_course_id").attr('data-dependant',1);
    }

    if($('#emailCommStats_specialization_id option').length == 1)
    {
        $("#emailCommStats_course_id").change(getCourseList);
        $("#emailCommStats_specialization_id").attr('data-dependant',1);
    }

    $(".sumo-select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true, okCancelInMulti: true});
    createemailCommStatsGraph();
    
    $("#emailActivityChannel").on("click", setEmailGraphActivityChannelWise);
    $("#emailEngagementChannel").on("click", setEmailGraphEngagementChannelWise);
};

function setEmailGraphActivityChannelWise() {
    $(".graph-data-email-comm-stats").parent('li').removeClass('active');
    $("#emailActivityChannel").parent('li').addClass('active');
    $("#emailCommStats_channel").val("transactional");
    $('#emailCommStatsDashletHTML .panel-loader').show();
    createemailCommStatsGraph();
}

function setEmailGraphEngagementChannelWise() {
    $(".graph-data-email-comm-stats").parent('li').removeClass('active');
    $("#emailEngagementChannel").parent('li').addClass('active');
    $("#emailCommStats_channel").val("promotional");
    $('#emailCommStatsDashletHTML .panel-loader').show();
    createemailCommStatsGraph();
}

var createemailCommStatsGraph = function () {
    var dashletUrl = $("#emailCommStatsDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#emailCommStats_collegeId").val($("#collegeId").val());
    var filters = $("#emailCommStatsFilterForm").serializeArray();
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
            $('#emailCommStatsDashletHTML .panel-loader').hide();
            $('#emailCommStatsDashletHTML .panel-heading, #emailCommStatsDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") 
                {
//                    updateemailCommStats(responseObject.data);
                    updateEmailCommStatsGraph(responseObject.data);
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(responseObject.message, 'error');
                }
            }
            //initEmailSlider();
            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

};

function updateEmailCommStatsGraph(dashletData) {

    if (typeof dashletData.total != 'undefined') {
        $("#totalRequests").html('<label class="dLabelData">Sent</label> <span>' + dashletData.total.Requests.total + '</span><i class="fa fa-signal" aria-hidden="true"></i>');
        $("#totalDelivered").html('<label class="dLabelData">Delivered</label> <span>' + dashletData.total.Delivered.percentage + '%</span><small>' + dashletData.total.Delivered.total + '</small>');
        $("#totalOpened").html('<label class="dLabelData">Opened</label> <span>' + dashletData.total.Opened.percentage + '%</span><small>' + dashletData.total.Opened.total + '</small>');
        $("#totalClicked").html('<label class="dLabelData">Clicked</label> <span>' + dashletData.total.Clicked.percentage + '%</span><small>' + dashletData.total.Clicked.total + '</small>');
        $("#totalBounce").html('<label class="dLabelData">Bounces</label> <span>' + dashletData.total.Bounced.percentage + '%</span><small>' + dashletData.total.Bounced.total + '</small>');
        $("#totalDropped").html('<label class="dLabelData">Dropped</label> <span>' + dashletData.total.Dropped.percentage + '%</span><small>' + dashletData.total.Dropped.total + '</small>');
        $("#totalUnsubscribed").html('<label class="dLabelData">Unsubscribed</label> <span>' + dashletData.total.Unsubscribed.percentage + '%</span><small>' + dashletData.total.Unsubscribed.total + '</small>');
        $("#totalSpamReports").html('<label class="dLabelData">Spam Reports</label> <span>' + dashletData.total.SpamReports.percentage + '%</span><small>' + dashletData.total.SpamReports.total + '</small>');
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
    $("#emailCommStats_dateRange").html(dateRangeHtml);
    $("#emailCommStats_dateRange_mobile").html(dateRangeHtml);
    FusionCharts.ready(function(){
        var fusioncharts = new FusionCharts({
            type: "msspline",
            renderAt: "emailCommStatsGraph",
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
                    { 'seriesname':'Opened', 'data'  : dashletData.graphData.Opened },
                    { 'seriesname':'Clicked', 'data'  : dashletData.graphData.Clicked },
                    { 'seriesname':'Bounced', 'data'  : dashletData.graphData.Bounced },
                    { 'seriesname':'Dropped', 'data'  : dashletData.graphData.Dropped },
                    { 'seriesname':'Unsubscribed', 'data'  : dashletData.graphData.Unsubscribed },
                    { 'seriesname':'Spam Reports', 'data'  : dashletData.graphData.SpamReports },
                ]
            }
        });
        fusioncharts.render();    
    });

}

function initEmailSlider(){
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

// function updateemailCommStats(dashletData) 
function updateemailCommStats(dashletData) 
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
                    theme: "fusion",
					palettecolors: "1f77b4,cccccc",
                    plottooltext: "<div id='nameDiv' style='font-size: 12px; border-bottom: 1px dashed #666666; font-weight:bold; padding-bottom: 3px; margin-bottom: 5px; display: inline-block; color: #888888;' >$label</div>{br} <div id='nameDiv' style='font-size: 14px; padding-bottom: 3px; display: inline-block;' ><strong>$value</strong> Emails</div>",
                },
                data: data_Ar
            };

            FusionCharts.ready(function() {
                var myChart = new FusionCharts({
                    type: "doughnut2d",
                    renderAt: "emchart_"+ind,
                    width: "100%",
                    height: "100%",
                    dataFormat: "json",
                    dataSource
                }).render();
            });
            console.log("emchart_"+ind);

        }
    });


    if(dashletData.startDate != '')
    {
        var dateRangeHtml = "(" + dashletData.startDate + " - " + dashletData.endDate + ")";
        if (typeof dashletData.compareStartDate !== "undefined" && typeof dashletData.compareEndDate !== "undefined") {
            dateRangeHtml = dateRangeHtml + " vs (" + dashletData.compareStartDate + " to " + dashletData.compareEndDate + ")";
        }
        $("#emailCommStats_dateRange").html(dateRangeHtml);
    }else{
        $("#emailCommStats_dateRange").html("All Time");
    }
    $("#mail_sent").html(dashletData.sent);
   
}

function emailCommStats_downloadCSV() {
    $("#emailCommStatsFilterForm").submit();
}

function resetemailCommStatsFilterForm() {
    $("#emailCommStatsFilterForm").find('select.dashletFilter').each(function () {
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
        ref_id = 'emailCommStats_specialization_id';
    }else{
        placeholder = 'Course';
        ref_id = 'emailCommStats_course_id';
        if($("#emailCommStats_specialization_id").attr('data-dependant') == 1)
        {
            $("#emailCommStats_specialization_id").html("");
            $("#emailCommStats_specialization_id")[0].sumo.reload();
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
                $('#emailCommStatsDashletHTML .panel-loader').hide();
                $('#emailCommStatsDashletHTML .panel-heading, #emailCommStatsDashletHTML .panel-body').removeClass('pvBlur');
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