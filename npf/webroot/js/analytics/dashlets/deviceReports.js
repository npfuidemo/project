var initilizesmsdeviceReports = function () {
    $("#deviceReportDashlet").find(".applyDates").click(function () 
    {
        $("#deviceReports_range1StartDate").val("");
        $("#deviceReports_range1EndDate").val("");
        if ($("#deviceReportDashlet").find(".inputBaseStartDate").val() !== "" && $("#deviceReportDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#deviceReports_range1StartDate").val($("#deviceReportDashlet").find(".inputBaseStartDate").val());
            $("#deviceReports_range1EndDate").val($("#deviceReportDashlet").find(".inputBaseEndDate").val());
        }
        createdeviceReportsGraph();
    });
    $("#deviceReportDashlet").find(".cancelDates").click(function () {
        $("#deviceReports_range1StartDate").val("");
        $("#deviceReports_range1EndDate").val("");
        createdeviceReportsGraph();
    });

//    if ($("#deviceReports_university_id").length) 
//    {
//        $("#deviceReports_university_id").change(getCourseList);
//        $("#deviceReports_course_id").attr('data-dependant',1);
//    }

//    if($('#deviceReports_specialization_id option').length == 1)
//    {
//        $("#smsCommStats_course_id").change(getCourseList);
//        $("#smsCommStats_specialization_id").attr('data-dependant',1);
//    }

    $(".sumo-select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true, okCancelInMulti: true});
    createdeviceReportsGraph();
};

var createdeviceReportsGraph = function () {
    var dashletUrl = $("#deviceReportDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#deviceReports_collegeId").val($("#collegeId").val());
    var filters = $("#deviceReportsFilterForm").serializeArray();
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
            $('#deviceReportDashletHTML .panel-loader').hide();
            $('#deviceReportDashletHTML .panel-heading, #deviceReportDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") 
                {
                    updatedeviceReports(responseObject.data);
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


// function updatedeviceReports(dashletData) 
function updatedeviceReports(dashletData) 
{
     //console.log(dashletData);
    $.each(dashletData.chart, function(ind, data_device) 
    {
        if(ind != "sent")
        {
            const dataSource = {
                chart: {
                    caption: "",
                    subcaption: "",
                    defaultcenterlabel: '',
                    showpercentvalues: 1,
                    enableRotation: 1,
                    enableSmartLabels: 1,
                    doughnutRadius: 80,
                    startingAngle: 270,
                    captionpadding: 0,
                    decimals: "1",
                    baseFontSize : 12,
                    // plottooltext:"<b>$percentValue</b> of our Android users are on <b>$label</b>",
                    plottooltext: "<div id='nameDiv' style='font-size:12px; border-bottom: 1px dashed #666666; font-weight:bold; padding-bottom: 3px; margin-bottom: 5px; display: inline-block; color: #888888;' >$label</div>{br} <div id='nameDiv' style='font-size: 14px; padding-bottom: 3px; display: inline-block;' ><strong>$value</strong> Leads</div>",
                    theme: "fusion",
                    "palettecolors": "1f77b4,ff7f0e,2ca02c,d62728,9467bd,8c564b,e377c2,7f7f7f,bcbd22,17becf",
                },
                data: data_device
            };

            FusionCharts.ready(function() {
                var myChart = new FusionCharts({
                    type: "doughnut2d",
                    renderAt: "dlchart_delivered",
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
        $("#deviceReports_dateRange").html(dateRangeHtml);
    }else{
        $("#deviceReports_dateRange").html("All Time");
    }
    $("#dLead_sent").html(dashletData.total);
   
}
//
//function smsCommStats_downloadCSV() {
//    $("#smsCommStatsFilterForm").submit();
//}

function resetdeviceReportsFilterForm() {
    $("#deviceReportsFilterForm").find('select.dashletFilter').each(function () {
        $(this).val('');
    });
    $('.chosen-select').trigger('chosen:updated');
    createdeviceReportsGraph();
}

function getCourseList () 
{
    var placeholder = ref_id = '';
    var el_id = $(this).attr('id');
    var value = $("#"+el_id).val();
    if(el_id.indexOf('course') != -1){
        placeholder = 'Specialization';
        ref_id = 'deviceReports_specialization_id';
    }else{
        placeholder = 'Course';
        ref_id = 'deviceReports_course_id';
        if($("#deviceReports_specialization_id").attr('data-dependant') == 1)
        {
            $("#deviceReports_specialization_id").html("");
            $("#deviceReports_specialization_id")[0].sumo.reload();
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
                $('#deviceReportDashletHTML .panel-loader').hide();
                $('#deviceReportDashletHTML .panel-heading, #deviceReportDashletHTML .panel-body').removeClass('pvBlur');
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