var initilizeChatbotConsumtionAndConversions = function () {
    $("#chatbotConsumtionAndConversionsDashlet").find(".applyDates").click(function () {
        $("#chatbotConsumtionAndConversions_range1StartDate").val("");
        $("#chatbotConsumtionAndConversions_range1EndDate").val("");
        $("#chatbotConsumtionAndConversions_range2StartDate").val("");
        $("#chatbotConsumtionAndConversions_range2EndDate").val("");
        if ($("#chatbotConsumtionAndConversionsDashlet").find(".inputBaseStartDate").val() !== "" && $("#chatbotConsumtionAndConversionsDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#chatbotConsumtionAndConversions_range1StartDate").val($("#chatbotConsumtionAndConversionsDashlet").find(".inputBaseStartDate").val());
            $("#chatbotConsumtionAndConversions_range1EndDate").val($("#chatbotConsumtionAndConversionsDashlet").find(".inputBaseEndDate").val());
        }
        createChatbotConsumtionAndConversions();
    });
    $("#chatbotConsumtionAndConversionsDashlet").find(".cancelDates").click(function () {
        $("#chatbotConsumtionAndConversions_range1StartDate").val("");
        $("#chatbotConsumtionAndConversions_range1EndDate").val("");
        $("#chatbotConsumtionAndConversions_range2StartDate").val("");
        $("#chatbotConsumtionAndConversions_range2EndDate").val("");
        createChatbotConsumtionAndConversions();
    });
    createChatbotConsumtionAndConversions();
};

function createChatbotConsumtionAndConversions() {

    var dashletUrl = $("#chatbotConsumtionAndConversionsDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#chatbotConsumtionAndConversions_collegeId").val($("#collegeId").val());
    var filters = $("#chatbotConsumtionAndConversionsFilterForm").serializeArray();

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
            $('#chatbotConsumtionAndConversionsDashletHTML .panel-loader').hide();
            $('#chatbotConsumtionAndConversionsDashletHTML .panel-heading, #chatbotConsumtionAndConversionsDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    updateChatbotConsumtionAndConversions(responseObject.data);
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
            console.log(xhr);
            console.log(thrownError);
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
;

function updateChatbotConsumtionAndConversions(dashletData) {
    var graphData = [{"label": "Remaining Sessions", "value": dashletData.remainingSessions},{"label": "Used Sessions", "value": dashletData.usedSessions}];
    var dateRangeHtml = "(" + dashletData.startDate + " to " + dashletData.endDate + ")";
    $("#chatbotConsumtionAndConversions_selectedDateRange").html(dateRangeHtml);
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
            type: "doughnut2d",
            loadMessageFontSize: "15",
            loadMessageColor: "#1f77b4",
            renderAt: "chatbotConsumtionAndConversions",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource: {
                "chart": {
                    "baseFont": "Roboto",
                    "baseFontSize": "12",
                    "palettecolors": "1f77b4,dc3e41,f6a858",
                    "captionAlignment": "left",
					"caption": "Session Analysis",
					"captionPadding" : '0',
                    "captionFontSize": "17",
                    "captionFontColor": "#333",
                    "captionFontBold": "1",
                    "showLabels": 0,
					"defaultCenterLabel": "Sessions",
					"aligncaptionwithcanvas": "0",
					"enableSlicing":'0',
					"showlegend": "1",
					"showpercentvalues": "1",
					"legendposition": "bottom",
					"usedataplotcolorforlabels": "1",
//                   "showValues":0, 
                    "animateClockwise": "1",
                    //"pieRadius": "80",
                    //showpercentvalues: "1",
                    "decimals": "1",
                    "theme": "fusion",
                },
                "data": graphData
            }
        });
        fusioncharts.render();
    });
    $("#chatbotConsumtionAndConversions_total_leads").html(dashletData.leadCount);
    if(typeof dashletData.webchatLeadCount!=="undefined"){
        $("#webchatLeadCountDiv").show();
        $("#chatbotConsumtionAndConversions_total_webchat_leads").html(dashletData.webchatLeadCount);
    }
    if(typeof dashletData.whatsappLeadCount!=="undefined"){
        $("#whatsappLeadCountDiv").show();
        $("#chatbotConsumtionAndConversions_total_whatsapp_leads").html(dashletData.whatsappLeadCount);
    }
    $("#chatbotConsumtionAndConversions_cost_per_lead").html(dashletData.costPerLead);
    $("#chatbotConsumtionAndConversions_total_applications").html(dashletData.applicationCount);
    if(typeof dashletData.webchatApplicationCount!=="undefined"){
        $("#webchatApplicationCountDiv").show();
        $("#chatbotConsumtionAndConversions_total_webchat_applications").html(dashletData.webchatApplicationCount);
    }
    if(typeof dashletData.whatsappApplicationCount!=="undefined"){
        $("#whatsappApplicationCountDiv").show();
        $("#chatbotConsumtionAndConversions_total_whatsapp_applications").html(dashletData.whatsappApplicationCount);
    }
    $("#chatbotConsumtionAndConversions_cost_per_application").html(dashletData.costPerApplication);
}

function resetChatbotConsumtionAndConversionsFiltersForm() {
    $("#chatbotConsumtionAndConversionsFilterForm").find('select.dashletFilter').each(function () {
        $(this).val('');
    });
    $('.chosen-select').trigger('chosen:updated');
}

function chatbotConsumtionAndConversions_downloadPDF() {
//    $("#chatbotConsumtionAndConversionsDashletFilters").hide();

    var data = document.getElementById("chatbotConsumtionAndConversionsDashletHTML");
    html2canvas(data).then(canvas => {
        // Few necessary setting options  
        var imgWidth = 200;
        var imgHeight = canvas.height * imgWidth / canvas.width;

        const contentDataURL = canvas.toDataURL('image/png');
        var pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
        var position = 1;
        pdf.addImage(contentDataURL, 'PNG', 1, position, imgWidth, imgHeight);
        pdf.save('download.pdf'); // Generated PDF   
//        $("#chatbotConsumtionAndConversionsDashletFilters").show();
    });
}


function resetConversionFunnelFiltersForm() {
    $("#conversionFunnelFilterForm").find('select.dashletFilter').each(function () {
        $(this).val('');
    });
    $('.chosen-select').trigger('chosen:updated');
}


function chatbotConsumtionAndConversions_downloadCSV() {
    $("#chatbotConsumtionAndConversionsFilterForm").submit();
}
