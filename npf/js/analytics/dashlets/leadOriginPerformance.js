var initilizeOriginPerformance = function () {
    $("#leadOriginPerformanceDashlet").find(".applyDates").click(function () {
        $("#leadOriginPerformance_range1StartDate").val("");
        $("#leadOriginPerformance_range1EndDate").val("");
        if ($("#leadOriginPerformanceDashlet").find(".inputBaseStartDate").val() !== "" && $("#leadOriginPerformanceDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#leadOriginPerformance_range1StartDate").val($("#leadOriginPerformanceDashlet").find(".inputBaseStartDate").val());
            $("#leadOriginPerformance_range1EndDate").val($("#leadOriginPerformanceDashlet").find(".inputBaseEndDate").val());
        }
        createLeadOriginPerformanceGraph();
    });
    $("#leadOriginPerformanceDashlet").find(".cancelDates").click(function () {
        $("#leadOriginPerformance_range1StartDate").val("");
        $("#leadOriginPerformance_range1EndDate").val("");
        createLeadOriginPerformanceGraph();
    });

    /*if ($("#leadOriginPerformance_university_id").length) 
    {
        $("#leadOriginPerformance_university_id").change(getCourseList);
        $("#leadOriginPerformance_course_id").attr('data-dependant',1);
    }

    if($('#leadOriginPerformance_specialization_id option').length == 1)
    {
        $("#leadOriginPerformance_course_id").change(getCourseList);
        $("#leadOriginPerformance_specialization_id").attr('data-dependant',1);
    }*/

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

    createLeadOriginPerformanceGraph();
};

function leadOriginPerformance_downloadCSV() {
    $("#leadOriginPerformanceFilterForm").submit();
}

function resetleadOriginPerformanceFilters() 
{
    if ($("#leadOriginPerformance_university_id").length)
    {
        $("#leadOriginPerformance_course_id").html("");
    }

    if ($("#leadOriginPerformance_specialization_id").length)
    {
        if($("#leadOriginPerformance_specialization_id").attr('data-dependant') == 1)
            $("#leadOriginPerformance_specialization_id").html("");
    } 

    $("#leadOriginPerformanceFilterForm").find('select.dashletFilter').each(function () 
    {
        $(this).val('');
        $(this)[0].sumo.reload();
    });
}

/*function getCourseList () 
{
    var placeholder = ref_id = '';
    var el_id = $(this).attr('id');
    var value = $("#"+el_id).val();
    if(el_id.indexOf('course') != -1){
        placeholder = 'Specialization';
        ref_id = 'leadOriginPerformance_specialization_id';
    }else{
        placeholder = 'Course';
        ref_id = 'leadOriginPerformance_course_id';
        if($("#leadOriginPerformance_specialization_id").attr('data-dependant') == 1)
        {
            $("#leadOriginPerformance_specialization_id").html("");
            $("#leadOriginPerformance_specialization_id")[0].sumo.reload();
        }
    }
    if($("#"+ref_id).length)
    {
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
                    $('#leadOriginPerformanceDashletHTML .panel-loader').hide();
                    $('#leadOriginPerformanceDashletHTML .panel-heading, #leadOriginPerformanceDashletHTML .panel-body').removeClass('pvBlur');
                },
                success: function (response) {
                    var responseObject = $.parseJSON(response);
                    if (responseObject.status == 1) 
                    {
                        if (typeof responseObject.data === "object") 
                        {
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
}*/

var createLeadOriginPerformanceGraph = function () 
{
    var dashletUrl = $("#leadOriginPerformanceDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#leadOriginPerformance_collegeId").val($("#collegeId").val());
    var filters = $("#leadOriginPerformanceFilterForm").serializeArray();
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
            $('#leadOriginPerformanceDashletHTML .panel-loader').hide();
            $('#leadOriginPerformanceDashletHTML .panel-heading, #leadOriginPerformanceDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) 
            {
                if(typeof responseObject.data === "object")
                {
                    updateLeadOriginPerformanceDualGraph(responseObject.data);
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

function updateLeadOriginPerformanceDualGraph(dashletData) 
{
    var dateRangeHtml = "(" + dashletData.startDate + " - " + dashletData.endDate + ")";
    if (typeof dashletData.compareStartDate !== "undefined" && typeof dashletData.compareEndDate !== "undefined") {
        dateRangeHtml = dateRangeHtml + " vs (" + dashletData.compareStartDate + " to " + dashletData.compareEndDate + ")";
    }
    $("#leadOriginPerformance_dateRange").html(dateRangeHtml);
    $("#leadOriginPerformance_dateRange_mobile").html(dateRangeHtml);
    const dataSource = {
        chart: {
            caption: "",
            subcaption: "",
            pyaxisname: "Count",
            syaxisname: "Percentage",
            snumbersuffix: "%",
            syaxismaxvalue: "100",
            theme: "fusion",
            showvalues: "0",
            drawcrossline: "1",
            divlinealpha: "20"
        },
        categories: 
        [
            {   category: dashletData.graphData.labels  }
        ],
        dataset: [
            {
                dataset: [
                    {
                        seriesname: "Leads",
                        data: dashletData.graphData.leads
                    }
                ]
            },
            {
                dataset: [
                    {
                        seriesname: "Applications",
                        data: dashletData.graphData.applications
                    }
                ]
            },
            {
                dataset: [
                {
                    seriesname: "Enrolment",
                    data: dashletData.graphData.enrollment
                }
                ]
            }
        ],
        lineset: [
        {
            seriesname: "Verified Leads",
            plottooltext:"$label has <b>$dataValue</b> verified leads",
            showvalues: "0",
            color: "#2cc4bf",
            anchorBgColor: "#ffffff",
            data: dashletData.graphData.lines.verifiedleads
        },{
            seriesname: "Lead To Application Conversion",
            plottooltext: "$label has <b>$dataValue</b> lead to application conversion",
            color: "#5d62b5",
            anchorBgColor: "#ffffff",
            showvalues: "0",
            data: dashletData.graphData.lines.leadtoapplicationperc
        }
        
        ]
    };

    FusionCharts.ready(function() {
        var myChart = new FusionCharts({
            type: "msstackedcolumn2dlinedy",
            renderAt: "leadOriginGraph",
            width: "100%",
            height: "100%",
            drawAnchors: "0",
            dataFormat: "json",
            dataSource
        }).render();
    });
    if($("#leadOriginPerformance_ap_button").hasClass("open"))
    {
        $(".leadOriginPerformance_ap_button").trigger("click");
    }

}