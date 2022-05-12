var initilizeLeadScoreReports = function () {
    $("#leadScoreDashlet").find(".applyDates").click(function () 
    {
        $("#leadScore_range1StartDate").val("");
        $("#leadScore_range1EndDate").val("");
        if ($("#leadScoreDashlet").find(".inputBaseStartDate").val() !== "" && $("#leadScoreDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#leadScore_range1StartDate").val($("#leadScoreDashlet").find(".inputBaseStartDate").val());
            $("#leadScore_range1EndDate").val($("#leadScoreDashlet").find(".inputBaseEndDate").val());
        }
        createLeadScoreGraph();
    });
    $("#leadScoreDashlet").find(".cancelDates").click(function () {
        $("#leadScore_range1StartDate").val("");
        $("#leadScore_range1EndDate").val("");
        createLeadScoreGraph();
    });

//    if ($("#leadScore_university_id").length) 
//    {
//        $("#leadScore_university_id").change(getCourseList);
//        $("#leadScore_course_id").attr('data-dependant',1);
//    }

//    if($('#leadScore_specialization_id option').length == 1)
//    {
//        $("#smsCommStats_course_id").change(getCourseList);
//        $("#smsCommStats_specialization_id").attr('data-dependant',1);
//    }

    $(".sumo-select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true, okCancelInMulti: true});
    createLeadScoreGraph();
};

var createLeadScoreGraph = function () {
    var dashletUrl = $("#leadScoreDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#leadScore_collegeId").val($("#collegeId").val());
    var filters = $("#leadScoreFilterForm").serializeArray();
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
            $('#leadScoreDashletHTML .panel-loader').hide();
            $('#leadScoreDashletHTML .panel-heading, #leadScoreDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") 
                {
                    updateleadScore(responseObject.data);
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


function updateleadScore(dashletData) 
{
    
    const dataSource = {
  chart: {
    caption: "",
    yaxisname: "Lead Count",
    showvalues: "0",
    numberprefix: "",
    theme: "fusion",
    baseFontSize : 12,
    pyaxisname: "Count",
    xAxisName: "Score",
    "showhovereffect":"1",
   "baseFont":"Roboto",
   "baseFontSize": "12",
   "drawcrossline":"1",
   "numVisiblePlot":"15",
   "paletteColors":"191971,c96118,fe6ab4,bcbd22,1e90ff,911eb4,d62728,2ca02c,ff7f0e,1f77b4",
   
	//Customized Scroll Bar
	"flatScrollBars": "1",
	"scrollColor": "fafafa",
	"scrollheight": "6",
	"scrollPadding": "5",
	// "scrolltoend": "1",
	"scrollPadding" : "10",
    plottooltext: "<div id='nameDiv' style='font-size:12px;border-bottom:1px dashed #666; font-weight:bold; padding-bottom: 3px; margin-bottom: 5px; display: inline-block; color: #888888;' >Lead Score Range: $label</div>{br} <div id='nameDiv' style='font-size: 14px; padding-bottom: 3px; display: inline-block;' >Lead Count: <strong>$value</strong> </div>",
  },
  data: dashletData.chart
//          [
//    {
//      label: "Financial Advisor",
//      value: "101000"
//    },
//    {
//      label: "Physician Assistant",
//      value: "92000"
//    },
//    {
//      label: "IT Analysts",
//      value: "82600"
//    },
//    {
//      label: "College Professor",
//      value: "70400"
//    },
//    {
//      label: "Dentist",
//      value: "68152"
//    }
//  ]
};

FusionCharts.ready(function() {
  var myChart = new FusionCharts({
    type: "bar2d",
    renderAt: "LeadScore",
    width: "100%",
    height: "100%",
    dataFormat: "json",
    dataSource
  }).render();
});



    if(dashletData.startDate != '')
    {
        var dateRangeHtml = "(" + dashletData.startDate + " - " + dashletData.endDate + ")";
        if (typeof dashletData.compareStartDate !== "undefined" && typeof dashletData.compareEndDate !== "undefined") {
            dateRangeHtml = dateRangeHtml + " vs (" + dashletData.compareStartDate + " to " + dashletData.compareEndDate + ")";
        }        
        $("#leadScore_dateRange").html(dateRangeHtml);
    }else{
        $("#leadScore_dateRange").html("All Time");
    }
    $("#dLead_sent").html(dashletData.total);
   
}
//
//function smsCommStats_downloadCSV() {
//    $("#smsCommStatsFilterForm").submit();
//}


function resetleadScoreFilterForm() {
    $("#leadScoreFilterForm").find('select.dashletFilter').each(function () {
        $(this).val('');
    });
    $('.chosen-select').trigger('chosen:updated');
    createLeadScoreGraph();
}
