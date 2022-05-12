var initilizeIvrCampaignReport = function () {
    $("#IvrCampaignReportDashletHTML").find("div.calendarContainer").find("div.baseSelect").find('select option[value="4"]').hide();
    $("#IvrCampaignReportDashletHTML").find("div.calendarContainer").find("div.baseSelect").find('select option[value="5"]').hide();
    
    dateRangeHtml = "";
    $("#IvrCampaignReportDashlet").find(".applyDates").click(function () 
    {
        $("#IvrCampaignReport_range1StartDate").val("");
        $("#IvrCampaignReport_range1EndDate").val("");
        if ($("#IvrCampaignReportDashlet").find(".inputBaseStartDate").val() !== "" &&
                $("#IvrCampaignReportDashlet").find(".inputBaseEndDate").val() !== "") {
            startDateObj = new Date($("#IvrCampaignReportDashlet").find(".inputBaseStartDate").val());
            endDateObj = new Date($("#IvrCampaignReportDashlet").find(".inputBaseEndDate").val());
            var diffTime = Math.abs(endDateObj - startDateObj);
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            if(diffDays>30){
                alertPopup("Date range can not be more than 31 days for this report.","error");
                return false;
            }
            
            $("#IvrCampaignReport_range1StartDate").val($("#IvrCampaignReportDashlet").find(".inputBaseStartDate").val());
            $("#IvrCampaignReport_range1EndDate").val($("#IvrCampaignReportDashlet").find(".inputBaseEndDate").val());
            startDate = startDateObj.getDate() + " " +startDateObj.getMonthName() + " " + startDateObj.getFullYear()
            endDate = endDateObj.getDate() + " " +endDateObj.getMonthName() + " " + endDateObj.getFullYear()
            dateRangeHtml = "(" + startDate + " to " + endDate + ")";                
        }
        $("#IvrCampaignReport_dateRange").html(dateRangeHtml);
        createIvrCampaignReportGraph();
    });
    if(dateRangeHtml == "") {
        getcurrentDate();
        $("#IvrCampaignReport_dateRange").html(dateRangeHtml);
    }

    $("#IvrCampaignReportDashlet").find(".cancelDates").click(function () {
        getcurrentDate();
        createIvrCampaignReportGraph();
    });
    createIvrCampaignReportGraph();
};
var getcurrentDate = function() {
    $("#IvrCampaignReport_range1StartDate").val("");
    $("#IvrCampaignReport_range1EndDate").val("");    
    dateObj = new Date();
    dateRangeHtml = "Till : (" + dateObj.getDate() + " " +dateObj.getMonthName() + " " + dateObj.getFullYear() + ")";
    $("#IvrCampaignReport_dateRange").html(dateRangeHtml);   
}

var createIvrCampaignReportGraph = function (pageNumber) {
    if(typeof pageNumber ==="undefined" || pageNumber===null || pageNumber===0){
        pageNumber   = 1;
    }
    var dashletUrl = $("#ivrCampaignReportDashlet").data('url');
    $("#IvrCampaignReport_collegeId").val($("#collegeId").val());
    var filters = $("#IvrCampaignReportFilterForm").serializeArray();
    filters.push({name: "page", value: pageNumber});
    $.ajax({
        url: dashletUrl,
        type: 'post',
        data: filters,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $("#IvrCampaignReportDashletHTML .panel-loader").show();
            $("#IvrCampaignReportDashletHTML .panel-heading").addClass("pvBlur");
        },
        complete: function () {
            $("#IvrCampaignReportDashletHTML .panel-loader").hide();
            $("#IvrCampaignReportDashletHTML .panel-heading").removeClass("pvBlur"); 
            table_fix_head();           
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if(pageNumber==1){
                    $("#ivrCampaignReportTableContainer").html("");
                }
                if (typeof responseObject.data === "object") {
                    var dashletData = responseObject.data;
                    if (typeof dashletData.tableHtml === "undefined") {
                        return;
                    }
                    if(pageNumber==1){
                        $("#ivrCampaignReportTableContainer").html(dashletData.tableHtml);
                    }else{
                        $("#ivrCampaignLoadMoreRow").remove();
                        $("#ivrCampaignReportTableContainer").find("tbody").append(dashletData.tableHtml);
                    }
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(responseObject.message,"error");
                }
            }
            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
};

function IvrCampaignReport_downloadCSV() {
    $("#IvrCampaignReportFilterForm").submit();
}


