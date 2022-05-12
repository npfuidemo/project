var initilizeLeadTrend = function () {
    $("#leadtrendDashlet").find(".applyDates").click(function () {
        $("#leadtrend_range1StartDate").val("");
        $("#leadtrend_range1EndDate").val("");
        if ($("#leadtrendDashlet").find(".inputBaseStartDate").val() !== "" && $("#leadtrendDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#leadtrend_range1StartDate").val($("#leadtrendDashlet").find(".inputBaseStartDate").val());
            $("#leadtrend_range1EndDate").val($("#leadtrendDashlet").find(".inputBaseEndDate").val());
        }
        createLeadTrendGraph();
    });
    $("#leadtrendDashlet").find(".cancelDates").click(function () {
        $("#leadtrend_range1StartDate").val("");
        $("#leadtrend_range1EndDate").val("");
        createLeadTrendGraph();
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
    createLeadTrendGraph();
};

var createLeadTrendGraph = function () {
    initializeLeadTrendFilterDependency();
    var dashletUrl = $("#leadtrendDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#leadtrend_collegeId").val($("#collegeId").val());
    var filters = $("#leadTrendFilterForm").serializeArray();
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
	    $('#leadTrendFilterForm .btn-group').removeClass('open');
            $('#leadTrendDashletHTML .panel-loader').hide();
            $('#leadTrendDashletHTML .panel-heading, #leadTrendDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                
                var dateRangeHtml = "(" + responseObject.data.dates.startDate + " - " + responseObject.data.dates.endDate + ")";
                $("#leadTrend_dateRange").html(dateRangeHtml);
                
                
                if (typeof responseObject.data === "object") {
                    if (responseObject.data != "") {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "scrollline2d",
                                renderAt: "leadTrend",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "yaxisname": "Leads Count",
										"xaxisname": "Leads",
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
                        $('#leadTrend').html(html);
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

};


function leadTrend_downloadCSV() {
    $("#leadTrendFilterForm").submit();
}

function resetLeadTrendFilterForm() 
{
    
    if ($("#leadtrend_university_id").length) 
        $("#leadtrend_course_id").html("");

    if($("#leadtrend_specialization_id").attr('data-dependant') == 1)
        $("#leadtrend_specialization_id").html("");

    $("#leadTrendFilterForm").find('select.dashletFilter').each(function () 
    {
        $(this).val('');
        $(this)[0].sumo.reload();
    });
}

function initializeLeadTrendFilterDependency()
{
    $("#leadtrend_traffic_channel").on("change",function()
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
                         $("#leadtrend_publisher").html("");
                         $("#leadtrend_publisher").append("<option value=''>Select Publisher</option>"); 
                         $.each(responseObject.data.sourceList, function (formStage, formStageLabel) {
                             $("#leadtrend_publisher").append("<option value='" + formStage + "'>" + formStageLabel + "</option>");
                         });
                         $("#leadtrend_publisher")[0].sumo.reload();
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