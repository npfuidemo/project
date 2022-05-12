var initilizeCounsellorEffortAnalysis = function () {
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
    
    createCounsellorEffortAnalysis();
};

function resetCounsellorEffortAnalysis() {
    $("#counsellorEffortAnalysisFilterForm").find('.dashletFilter').each(function () {
        $(this).val('');
        $('select#' + $(this).attr('id'))[0].sumo.reload();
    });
}
var createCounsellorEffortAnalysis = function (pageNumber) {
    if(typeof pageNumber ==="undefined" || pageNumber===null || pageNumber===0){
        pageNumber   = 1;
    }
    var dashletUrl = $("#counsellorEffortAnalysisDashlet").data('url');
    $("#counsellorEffortAnalysis_collegeId").val($("#collegeId").val());
    var filters = $("#counsellorEffortAnalysisFilterForm").serializeArray();
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
            $("#counsellorEffortAnalysisDashletHTML .panel-loader").show();
            $("#counsellorEffortAnalysisDashletHTML .panel-heading").addClass("pvBlur");
        },
        complete: function () {
            $("#counsellorEffortAnalysisDashletHTML .panel-loader").hide();
            $("#counsellorEffortAnalysisDashletHTML .panel-heading").removeClass("pvBlur"); 
            table_fix_head();           
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if(pageNumber==1){
                    $(document).find("#counsellorEffortAnalysisTableContainer").html("");
                }
                if (typeof responseObject.data === "object") {
                    var dashletData = responseObject.data;
                    if (typeof dashletData.tableHtml === "undefined") {
                        return;
                    }
                    if(pageNumber==1){
                        $(document).find("#counsellorEffortAnalysisTableContainer").html(dashletData.tableHtml);
                    }else{
                        $(document).find("#counsellorEffortAnalysisTableContainer").find("tbody").append(dashletData.tableHtml);
                    }
                }
                $(document).find("form#counsellorEffortAnalysisFilterForm").find('.btn-group').removeClass("open");
                table_fix_rowcol();
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else if(responseObject.message === 'no_more_data') {
                    $(document).find('#counsellorEffortAnalysisLoadMoreRow').remove();
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

function counsellorEffortAnalysis_downloadCSV() {
    $("#counsellorEffortAnalysis_collegeId").val($("#collegeId").val());
    var filters = $("#counsellorEffortAnalysisFilterForm").serializeArray();
    $.ajax({
        url: jsVars.counsellorEffortAnalysisDownloadUrl,
        type: 'post',
        data: filters,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        success: function (response) {
            if (response.status == 'success') {
                $('#downloadListing').attr('href', response.downloadUrl);
                $('#requestMessage').html('Counsellor Effort Analysis');
                $('#muliUtilityPopup').modal('show');
                $('#muliUtilityPopup .draw-cross').addClass('glyphicon glyphicon-remove');
                $('#muliUtilityPopup .close').addClass('npf-close').css({'margin-top': '2px', 'opacity': '1'});
            } else if (response.error == 'session' || response.error == 'invalid_csrf') {
                window.location.reload();
            } else {
                alertPopup(response.error, 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}