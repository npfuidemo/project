var initilizewhatsappCommStats = function () {
    $("#whatsappCommStatsDashlet").find(".applyDates").click(function () 
    {
        $("#whatsappCommStats_range1StartDate").val("");
        $("#whatsappCommStats_range1EndDate").val("");
        if ($("#whatsappCommStatsDashlet").find(".inputBaseStartDate").val() !== "" && $("#whatsappCommStatsDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#whatsappCommStats_range1StartDate").val($("#whatsappCommStatsDashlet").find(".inputBaseStartDate").val());
            $("#whatsappCommStats_range1EndDate").val($("#whatsappCommStatsDashlet").find(".inputBaseEndDate").val());
        }
        $('#whatsappCommStatsDashletHTML .panel-loader').show();
        createwhatsappCommStatsGraph();
    });
    $("#whatsappCommStatsDashlet").find(".cancelDates").click(function () {
        $("#whatsappCommStats_range1StartDate").val("");
        $("#whatsappCommStats_range1EndDate").val("");
        $('#whatsappCommStatsDashletHTML .panel-loader').show();
        createwhatsappCommStatsGraph();
    });

    if ($("#whatsappCommStats_university_id").length) 
    {
        $("#whatsappCommStats_university_id").change(getCourseList);
        $("#whatsappCommStats_course_id").attr('data-dependant',1);
    }

    if($('#whatsappCommStats_specialization_id option').length === 1)
    {
        $("#whatsappCommStats_course_id").change(getCourseList);
        $("#whatsappCommStats_specialization_id").attr('data-dependant',1);
    }

    $(".sumo-select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true, okCancelInMulti: true});
    createwhatsappCommStatsGraph();
    
};

var createwhatsappCommStatsGraph = function () {
    var dashletUrl = $("#whatsappCommStatsDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#whatsappCommStats_collegeId").val($("#collegeId").val());
    var filters = $("#whatsappCommStatsFilterForm").serializeArray();
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
            $('#whatsappCommStatsDashletHTML .panel-loader').hide();
            $('#whatsappCommStatsDashletHTML .panel-heading, #whatsappCommStatsDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status === 1) {
                if (typeof responseObject.data === "object") 
                {
                    updateWhatsappCommStatsGraph(responseObject.data);
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

function updateWhatsappCommStatsGraph(dashletData) {

    if (typeof dashletData.total !== 'undefined') {
        $("#totalWhatsappRequests").html('<label class="dLabelData">Sent</label><span>' + dashletData.total.Requests.total + '</span><i class="fa fa-signal" aria-hidden="true"></i>');
        $("#totalWhatsappDelivered").html('<label class="dLabelData">Delivered</label><span>' + dashletData.total.Delivered.percentage + '%</span><small>' + dashletData.total.Delivered.total + '</small>');
        $("#totalWhatsappRead").html('<label class="dLabelData">Read</label><span>' + dashletData.total.Read.percentage + '%</span><small>' + dashletData.total.Read.total + '</small>');
        $("#totalWhatsappClicked").html('<label class="dLabelData">Clicked</label><span>' + dashletData.total.Clicked.percentage + '%</span><small>' + dashletData.total.Clicked.total + '</small>');
        $("#totalWhatsappFailed").html('<label class="dLabelData">Failed</label><span>' + dashletData.total.Failed.percentage + '%</span><small>' + dashletData.total.Failed.total + '</small>');
        $("#totalWhatsappUnsubscriber").html('<label class="dLabelData">Unsubscribed</label><span>' + dashletData.total.Unsubscriber.percentage + '%</span><small>' + dashletData.total.Unsubscriber.total + '</small>');
        $("#totalWhatsappMessageReplied").html('<label class="dLabelData">Replied</label><span>' + dashletData.total.Replied.percentage + '%</span><small>' + dashletData.total.Replied.total + '</small>');
    }
    
    var dateRangeHtml = "(";
    if (dashletData.startDate !== '') {
        dateRangeHtml +=  dashletData.startDate + " - ";
    }
    if (dashletData.endDate !== '') {
        dateRangeHtml += dashletData.endDate;
    }
    dateRangeHtml += ")";
    if (typeof dashletData.compareStartDate !== "undefined" && typeof dashletData.compareEndDate !== "undefined") {
        dateRangeHtml = dateRangeHtml + " vs (" + dashletData.compareStartDate + " to " + dashletData.compareEndDate + ")";
    }
    $("#whatsappCommStats_dateRange").html(dateRangeHtml);
    $("#whatsappCommStats_dateRange_mobile").html(dateRangeHtml);
    FusionCharts.ready(function(){
        var fusioncharts = new FusionCharts({
            type: "msspline",
            renderAt: "whatsappCommStatsGraph",
            width: "100%",
            height: "400",
            dataFormat: "json",
            dataSource :{
                "chart": {
                    "yaxisname": "(Count)",
                    "showhovereffect": "1",
		    "baseFont": "Roboto",
                    "drawcrossline": "1",
                    "plottooltext": "<b>$dataValue</b>  $seriesName",
                    "theme": "fusion"
                },
                "categories":[
                    { "category" : dashletData.graphData.labels }
                ],
                "dataset"   : [
                    { 'seriesname':'Sent', 'data'  : dashletData.graphData.Sent },
                    { 'seriesname':'Delivered', 'data'  : dashletData.graphData.Delivered },
                    { 'seriesname':'Read', 'data'  : dashletData.graphData.Read },
                    { 'seriesname':'Clicked', 'data'  : dashletData.graphData.Clicked },
                    { 'seriesname':'Replied', 'data'  : dashletData.graphData.Replied },
                    { 'seriesname':'Failed', 'data'  : dashletData.graphData.Failed },
                    { 'seriesname':'Unsubscribed', 'data'  : dashletData.graphData.Unsubscriber }
                    
                ]
            }
        });
        fusioncharts.render();    
    });

}

function initWhatsappSlider(){
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

function updatewhatsappCommStats(dashletData) 
{
    $.each(dashletData.chart, function(ind, data_Ar) 
    {
        if(ind !== "sent")
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
                    plottooltext: "<div id='nameDiv' style='font-size: 12px; border-bottom: 1px dashed #666666; font-weight:bold; padding-bottom: 3px; margin-bottom: 5px; display: inline-block; color: #888888;' >$label</div>{br} <div id='nameDiv' style='font-size: 14px; padding-bottom: 3px; display: inline-block;' ><strong>$value</strong> Whatsapp</div>",
                    theme: "fusion",
                    palettecolors: "1f77b4,cccccc"
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


    if(dashletData.startDate !== '')
    {
        var dateRangeHtml = "(" + dashletData.startDate + " - " + dashletData.endDate + ")";
        if (typeof dashletData.compareStartDate !== "undefined" && typeof dashletData.compareEndDate !== "undefined") {
            dateRangeHtml = dateRangeHtml + " vs (" + dashletData.compareStartDate + " to " + dashletData.compareEndDate + ")";
        }        
        $("#whatsappCommStats_dateRange").html(dateRangeHtml);
    }else{
        $("#whatsappCommStats_dateRange").html("All Time");
    }
    $("#whatsapp_sent").html(dashletData.sent);
   
}

function whatsappCommStats_downloadCSV() {
    $("#whatsappCommStatsFilterForm").submit();
}

function resetwhatsappCommStatsFilterForm() {
    $("#whatsappCommStatsFilterForm").find('select.dashletFilter').each(function () {
        $(this).val('');
    });
    $('.chosen-select').trigger('chosen:updated');
}