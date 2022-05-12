var initilizeIvrCounsellorCustomReport = function () {
    $("#IvrCounsellorCustomReportDashletHTML").find("div.calendarContainer").find("div.baseSelect").find('select option[value="4"]').hide();
    $("#IvrCounsellorCustomReportDashletHTML").find("div.calendarContainer").find("div.baseSelect").find('select option[value="5"]').hide();
    
    dateRangeHtml = "";
    $("#IvrCounsellorCustomReportDashlet").find(".applyDates").click(function () 
    {
        $("#IvrCounsellorCustomReport_range1StartDate").val("");
        $("#IvrCounsellorCustomReport_range1EndDate").val("");
        if ($("#IvrCounsellorCustomReportDashlet").find(".inputBaseStartDate").val() !== "" &&
            $("#IvrCounsellorCustomReportDashlet").find(".inputBaseEndDate").val() !== "") {
            startDateObj = new Date($("#IvrCounsellorCustomReportDashlet").find(".inputBaseStartDate").val());
            endDateObj = new Date($("#IvrCounsellorCustomReportDashlet").find(".inputBaseEndDate").val());
            var diffTime = Math.abs(endDateObj - startDateObj);
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            if(diffDays>90){
                alertPopup("Date range can not be more than 90 days for this report.","error");
                return false;
            }
            
            $("#IvrCounsellorCustomReport_range1StartDate").val($("#IvrCounsellorCustomReportDashlet").find(".inputBaseStartDate").val());
            $("#IvrCounsellorCustomReport_range1EndDate").val($("#IvrCounsellorCustomReportDashlet").find(".inputBaseEndDate").val());
            startDate = startDateObj.getDate() + " " +startDateObj.getMonthName() + " " + startDateObj.getFullYear()
            endDate = endDateObj.getDate() + " " +endDateObj.getMonthName() + " " + endDateObj.getFullYear()
            dateRangeHtml = "(" + startDate + " to " + endDate + ")";                
        }
        $("#IvrCounsellorCustomReport_dateRange").html(dateRangeHtml);
        createIvrCounsellorCustomReportGraph();
    });
    if(dateRangeHtml == "") {
        getcurrentDate();
        $("#IvrCounsellorCustomReport_dateRange").html(dateRangeHtml);
    }

    $("#IvrCounsellorCustomReportDashlet").find(".cancelDates").click(function () {
        getcurrentDate();
        createIvrCounsellorCustomReportGraph();
    });
    createIvrCounsellorCustomReportGraph();
};
var getcurrentDate = function() {
    $("#IvrCounsellorCustomReport_range1StartDate").val("");
    $("#IvrCounsellorCustomReport_range1EndDate").val("");    
    const today = new Date();
    dateObj = new Date(today);
    dateObj2 = new Date(today);
    dateObj.setDate(dateObj.getDate() - 1);
    dateObj2.setDate(dateObj2.getDate() - 90);
    var curStartDate = dateObj2.getDate() + " " +dateObj2.getMonthName() + " " + dateObj2.getFullYear()
    var curEndDate = dateObj.getDate() + " " +dateObj.getMonthName() + " " + dateObj.getFullYear()
    dateRangeHtml = "(" + curStartDate + " to " +curEndDate + ")";
    $("#IvrCounsellorCustomReport_dateRange").html(dateRangeHtml);   
}

function resetIvrCounsellorCustomReportFilterForm() {
    getcurrentDate();
    $("#IvrCounsellorCustomReportFilterForm").find('select').each(function () {
        $(this).val('');
    });
    $('.chosen-select').trigger('chosen:updated');
}
var createIvrCounsellorCustomReportGraph = function (pageNumber) {
    if(typeof pageNumber ==="undefined" || pageNumber===null || pageNumber===0){
        pageNumber   = 1;
    }
    var dashletUrl = $("#ivrCounsellorCustomReportDashlet").data('url');
    $("#IvrCounsellorCustomReport_collegeId").val($("#collegeId").val());
    var filters = $("#IvrCounsellorCustomReportFilterForm").serializeArray();
    filters.push({name: "page", value: pageNumber});
    $(document).find('#ivrCampaignLoadMoreRow').remove();
    $.ajax({
        url: dashletUrl,
        type: 'post',
        data: filters,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $("#IvrCounsellorCustomReportDashletHTML .panel-loader").show();
            $("#IvrCounsellorCustomReportDashletHTML .panel-heading").addClass("pvBlur");
        },
        complete: function () {
            $("#IvrCounsellorCustomReportDashletHTML .panel-loader").hide();
            $("#IvrCounsellorCustomReportDashletHTML .panel-heading").removeClass("pvBlur"); 
            table_fix_head();           
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if(pageNumber==1){
                    $("#ivrCounsellorCustomReportTableContainer").html("");
                }
                if (typeof responseObject.data === "object") {
                    var dashletData = responseObject.data;
                    if (typeof dashletData.tableHtml === "undefined") {
                        return;
                    }
                    if(pageNumber==1){
                        $("#ivrCounsellorCustomReportTableContainer").html(dashletData.tableHtml);
                    }else{
                        $("#ivrCounsellorCustomReportLoadMoreRow").remove();
                        $("#ivrCounsellorCustomReportTableContainer").find("tbody").append(dashletData.tableHtml);
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

function IvrCounsellorCustomReport_downloadCSV() {
    $("#IvrCounsellorCustomReportFilterForm").submit();
}


