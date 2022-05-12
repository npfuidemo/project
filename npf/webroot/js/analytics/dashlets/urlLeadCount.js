var initilizeUrlLeadCountTable = function () {
    $("#urlLeadCountDashlet").find(".applyDates").click(function () {
        $("#urlLeadCount_range1StartDate").val("");
        $("#urlLeadCount_range1EndDate").val("");
        $("#urlLeadCount_range2StartDate").val("");
        $("#urlLeadCount_range2EndDate").val("");
        if ($("#urlLeadCountDashlet").find(".inputBaseStartDate").val() !== "" && $("#urlLeadCountDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#urlLeadCount_range1StartDate").val($("#urlLeadCountDashlet").find(".inputBaseStartDate").val());
            $("#urlLeadCount_range1EndDate").val($("#urlLeadCountDashlet").find(".inputBaseEndDate").val());
        }

        if ($("#urlLeadCountDashlet").find(".inputCompareCheckbox").is(":checked") && $("#urlLeadCountDashlet").find(".inputCompareStartDate").val() !== "" && $("#urlLeadCountDashlet").find(".inputCompareEndDate").val() !== "") {
            $("#urlLeadCount_range2StartDate").val($("#urlLeadCountDashlet").find(".inputCompareStartDate").val());
            $("#urlLeadCount_range2EndDate").val($("#urlLeadCountDashlet").find(".inputCompareEndDate").val());
        }
        createUrlLeadCount(false);
    });
    $("#urlLeadCountDashlet").find(".cancelDates").click(function () {
        $("#urlLeadCount_range1StartDate").val("");
        $("#urlLeadCount_range1EndDate").val("");
        $("#urlLeadCount_range2StartDate").val("");
        $("#urlLeadCount_range2EndDate").val("");
        createUrlLeadCount(false);
    });
    createUrlLeadCount(true);
};

var createUrlLeadCount = function (loadDataTable=true) {
//    $("#urlLeadCountDashlet").find('.dropdown-toggle').dropdown('close');
    var dashletUrl = $("#urlLeadCountDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#urlLeadCount_collegeId").val($("#collegeId").val());
    var filters = $("#urlLeadCountFilterForm").serializeArray();
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
            $('#urlLeadCountDashletHTML .panel-loader').hide();
            $('#urlLeadCountDashletHTML .panel-heading, #urlLeadCountDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    updateUrlLeadCounts(responseObject.data,loadDataTable);
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

function updateUrlLeadCounts(dashletData,loadDataTable) {

    var dateRangeHtml = "(" + dashletData.startDate + " to " + dashletData.endDate + ")";
    if (typeof dashletData.compareStartDate !== "undefined" && typeof dashletData.compareEndDate !== "undefined") {
        dateRangeHtml = dateRangeHtml + " vs (" + dashletData.compareStartDate + " to " + dashletData.compareEndDate + ")";
    }
    $("#urlLeadCount_dateRange").html(dateRangeHtml);
    $("#urlLeadCount_sourceList").html("");
    var urlLeadCount_sourceList = '';
    if(dashletData.leadPermission!== true){
        $('.urlLeadCount_sourceList_leadCount').remove();
    }
    if(dashletData.applicationPermission!== true){
        $('.urlLeadCount_sourceList_applicationCount').remove();
    }
    $.each(dashletData.sources, function (key, value) {
        urlLeadCount_sourceList += "<tr>\n<td class='fw-500 text-left colGroup1'><div class='maxword400'>" + key + "</div></td>\n";
        if(dashletData.leadPermission=== true){
            urlLeadCount_sourceList += "<td class='text-center colGroup2'>" + value.leads  + "</td>\n";
        }
         if(dashletData.applicationPermission=== true){
            urlLeadCount_sourceList += "<td class='text-center colGroup1'>" + value.applications  + "</td>\n";
        }
        urlLeadCount_sourceList += "</tr>";
        
    });
    $("#urlLeadCount_sourceList").append(urlLeadCount_sourceList);
    if(loadDataTable===true){
        var dTable = $('#urlLeadCountDashletHTML .table').DataTable({
            'searching':false,
            'bFilter':false,
            'sort':false,
            "paging": false,
            "bInfo": false,
            "scrollY": "400px",
            "scrollCollapse": true,
        });
        $("#myInput").keyup(function(e) {
            if(e.keyCode == 13) {
//                dTable.search($(this).val()).draw();
            }
        });
        $("#basic-addon1").click(function(e) {
//            dTable.search($("#myInput").val()).draw();
        });
    }
}

function urlLeadCount_downloadCSV() {
//    $("#urlLeadCount_searchUrl").val($("#myInput").val().trim());
    $("#urlLeadCountFilterForm").submit();
}

function resetConversionFunnelFiltersForm() {
    $("#urlLeadCountFilterForm").find('select.dashletFilter').each(function () {
        $(this).val('');
    });
    $('.chosen-select').trigger('chosen:updated');
}

