var initilizeCounsellorCallingReport = function () {
    $("#counsellorCallingReportDashletFilters").find(".applyDates").click(function () {
        $("#counsellorCallingReportRegistrationDate").val("");
        if ($("#counsellorCallingReportDashletFilters").find(".inputBaseStartDate").val() !== "" &&
                $("#counsellorCallingReportDashletFilters").find(".inputBaseEndDate").val() !== "") {
            $("#counsellorCallingReportRegistrationDate").val($("#counsellorCallingReportDashletFilters").find(".inputBaseStartDate").val() +","+$("#counsellorCallingReportDashletFilters").find(".inputBaseEndDate").val());
        }
        createCounsellorCallingReport('reset');
    });
    $("#counsellorCallingReportDashletFilters").find(".cancelDates").click(function () {
        $("#counsellorCallingReportRegistrationDate").val('');
        createCounsellorCallingReport('reset');
    });
    $('#counsellor_report_fcr').on('change', function() {
        $("#counsellorCallingReportRegistrationDate").val("");
        if($(this).val() == '') {
            $('#counsellor_report_mobile').prop('disabled', false);
            $('#counsellor_report_agent').prop('disabled', false);
            $('#counsellor_report_disposeStatus').prop('disabled', false);
        } else {
            $('#counsellor_report_mobile').val('');
            $('#counsellor_report_mobile').prop('disabled', true);
            $('#counsellor_report_agent').val('');
            $('#counsellor_report_agent')[0].sumo.reload();
            $('#counsellor_report_agent').prop('disabled', true);
            $('#counsellor_report_disposeStatus').val('');
            $('#counsellor_report_disposeStatus')[0].sumo.reload();
            $('#counsellor_report_disposeStatus').prop('disabled', true);
        }
        $('#counsellorCallingReportGroupBtn div.SumoSelect').removeClass('disabled');
    });
    if ($("#counsellor_report_agent").length) {
        $("#counsellor_report_agent").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true, okCancelInMulti: true});
    }
    if ($("#counsellor_report_disposeStatus").length) {
        $("#counsellor_report_disposeStatus").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true, okCancelInMulti: true});
    }
    createCounsellorCallingReport('reset');
};

var createCounsellorCallingReport = function (type) {
    var dashletUrl = $("#counsellorCallingReport").data('url');
    $("#counsellorCallingReportCollegeId").val($("#collegeId").val());
    if(type == 'reset') $('#counsellorCallingReportCurrentPage').val(1);
    var filters = $("#counsellorCallingReportFilterForm").serializeArray();
    $.ajax({
        url: dashletUrl,
        type: 'post',
        data: filters,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#counsellorCallingReportDashletHTML .panel-loader').show();
            $('#counsellorCallingReportDashletHTML .panel-heading, #counsellorCallingReportDashletHTML .panel-body').addClass('pvBlur');
        },
        complete: function () {
            $('#counsellorCallingReportDashletHTML .panel-loader').hide();
            $('#counsellorCallingReportDashletHTML .panel-heading, #counsellorCallingReportDashletHTML .panel-body').removeClass('pvBlur');
            $('#counsellorCallingReportCurrentPage').val($('#counsellorCallingReportCurrentPageAjax').val());
            $('#counsellorCallingReportPageCount').val($('#counsellorCallingReportPageCountAjax').val());
            $('#counsellorCallingReportGroupBtn').removeClass('open');
            $("#counsellorCallingReportContainerDiv .icon-info").popover();
        },
        success: function (response) {
            if(response == 'invalid_request') {
                alertPopup('Invalid Request!', 'error');
            } else if(response == 'session_out' || response == 'invalid_csrf') {
                window.location.reload();
            } else {
                $("#counsellorCallingReportContainerDiv").html(response);
                $('#counsellorCallingReportDateRange').html(dateText);
            }
            if($("#counsellorCallingReportContainerDiv").find('div.no-records').length > 0) {
                $('#counsellorCallingReportDownloadBtn').hide();
            } else {
                $('#counsellorCallingReportDownloadBtn').show();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function counsellorCallingReportDownloadCSV() {
    $("#counsellorCallingReportCollegeId").val($("#collegeId").val());
    var filters = $("#counsellorCallingReportFilterForm").serializeArray();
    $.ajax({
        url: jsVars.counsellorCallingReportDownloadUrl,
        type: 'post',
        data: filters,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        success: function (response) {
            if(response == 'success') {
                $('#muliUtilityPopup').modal('show');
				$('#muliUtilityPopup .draw-cross').addClass('glyphicon glyphicon-remove');
                $('#muliUtilityPopup .close').addClass('npf-close').css({'margin-top':'2px', 'opacity':'1'});
            } else if(response == 'session_out' || response == 'invalid_csrf') {
                window.location.reload();
            } else {
                alertPopup(response, 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function resetCounsellorCallingReportFiltersForm() {
    $("#counsellorCallingReportFilterForm").find('select.dashletFilter, input.dashletFilter').each(function () {
        $(this).val('').prop('disabled', false);
        if($(this).hasClass('chosen-select')) {
            $(this).prop('disabled', false).trigger('chosen:updated');
        } else if($(this).hasClass('sumo-select')) {
            $(this)[0].sumo.reload();
            $(this).prop('disabled', false);
        }
    });
    createCounsellorCallingReport('reset');
}

function paginate(type) {
    if(type == 'prev') {
        var currentPage = $('#counsellorCallingReportCurrentPage').val();
        currentPage = parseInt(currentPage);
        if(currentPage > 1) {
            $('#counsellorCallingReportCurrentPage').val(currentPage-1);
            createCounsellorCallingReport('');
        }
    } else if(type = 'next') {
        var pageCount = $('#counsellorCallingReportPageCount').val(), currentPage = $('#counsellorCallingReportCurrentPage').val();;
        pageCount = parseInt(pageCount);
        currentPage = parseInt(currentPage);
        if(currentPage < pageCount) {
            $('#counsellorCallingReportCurrentPage').val(currentPage+1);
            createCounsellorCallingReport('');
        }
    }
}

function JumpToPage(page) {
    var pageValue = parseInt(page), pageCount = parseInt($('#counsellorCallingReportPageCount').val()), currentPage = parseInt($('#counsellorCallingReportCurrentPage').val());
    if(pageValue > 0 && pageValue != currentPage && pageValue <= pageCount) {
        $('#counsellorCallingReportCurrentPage').val(pageValue);
        createCounsellorCallingReport('');
    }
}
