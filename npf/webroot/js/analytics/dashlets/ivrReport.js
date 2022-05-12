var initilizeIvrReportsTable = function () {
    $(document).on('click','ul.ivrPagination li', function() {
        if($(this).hasClass('prev')) {
            var currentPage = $('#ivrReportCurrentPage').val();
            currentPage = parseInt(currentPage);
            if(currentPage > 1) {
                $('#ivrReportCurrentPage').val(currentPage-1);
                createIvrReportTable();
            }
        } else if($(this).hasClass('next')) {
            var pageCount = $('#ivrReportPageCount').val(), currentPage = $('#ivrReportCurrentPage').val();;
            pageCount = parseInt(pageCount);
            currentPage = parseInt(currentPage);
            if(currentPage < pageCount) {
                $('#ivrReportCurrentPage').val(currentPage+1);
                createIvrReportTable();
            }
        }
    });

    $(document).on('change', '#pageJump', function() {
        var pageValue = parseInt($(this).val()), pageCount = parseInt($('#ivrReportPageCount').val()), currentPage = parseInt($('#ivrReportCurrentPage').val());
        if(pageValue > 0 && pageValue != currentPage && pageValue <= pageCount) {
            $('#ivrReportCurrentPage').val(pageValue);
            createIvrReportTable();
        }
    });
    createIvrReportTable();
};

var createIvrReportTable = function () {
    var dashletUrl = $("#ivrReport").data('url');
    $("#ivrReportCollegeId").val($("#collegeId").val());
    var filters = $("#ivrReportFilterForm").serializeArray();
    filters[filters.length] = { name: "dashletId", value:  $("#ivrReport").data('dashletid')};
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
            $('#ivrReportTableDashletHTML .panel-loader').hide();
            $('#ivrReportTableDashletHTML .panel-heading, #ivrReportTableDashletHTML .panel-body').removeClass('pvBlur');
            $("#ivrReport .icon-info").popover();
        },
        success: function (response) {
            if(response == 'invalid_request') {
                alertPopup('Invalid Request!', 'error');
            } else if(response == 'session_out' || response == 'invalid_csrf') {
                window.location.reload();
            } else {
                $("#ivrReport").html(response);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

};

function ivrReportDownloadCSV() {
    $("#ivrReportFilterForm").submit();
}