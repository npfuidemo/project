var initilizeConversionFunnel = function () {
    $("#conversionFunnelDashlet").find(".applyDates").click(function () {
        $("#conversionFunnel_range1StartDate").val("");
        $("#conversionFunnel_range1EndDate").val("");
        $("#conversionFunnel_range2StartDate").val("");
        $("#conversionFunnel_range2EndDate").val("");
        if ($("#conversionFunnelDashlet").find(".inputBaseStartDate").val() !== "" && $("#conversionFunnelDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#conversionFunnel_range1StartDate").val($("#conversionFunnelDashlet").find(".inputBaseStartDate").val());
            $("#conversionFunnel_range1EndDate").val($("#conversionFunnelDashlet").find(".inputBaseEndDate").val());
        }

        if ($("#conversionFunnelDashlet").find(".inputCompareCheckbox").is(":checked") && $("#conversionFunnelDashlet").find(".inputCompareStartDate").val() !== "" && $("#conversionFunnelDashlet").find(".inputCompareEndDate").val() !== "") {
            $("#conversionFunnel_range2StartDate").val($("#conversionFunnelDashlet").find(".inputCompareStartDate").val());
            $("#conversionFunnel_range2EndDate").val($("#conversionFunnelDashlet").find(".inputCompareEndDate").val());
        }
        createConversionFunnel();
    });
    $("#conversionFunnelDashlet").find(".cancelDates").click(function () {
        $("#conversionFunnel_range1StartDate").val("");
        $("#conversionFunnel_range1EndDate").val("");
        $("#conversionFunnel_range2StartDate").val("");
        $("#conversionFunnel_range2EndDate").val("");
        createConversionFunnel();
    });
    createConversionFunnel();
};

var createConversionFunnel = function () {
//    $("#conversionFunnelDashlet").find('.dropdown-toggle').dropdown('close');
    var dashletUrl = $("#conversionFunnelDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#conversionFunnel_collegeId").val($("#collegeId").val());
    var filters = $("#conversionFunnelFilterForm").serializeArray();
//    console.log(filters);
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
            $('#conversionFunnelDashletHTML .panel-loader').hide();
            $('#conversionFunnelDashletHTML .panel-heading, #conversionFunnelDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    updateConversionFunnel(responseObject.data);
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

function updateConversionFunnel(dashletData) {

    var dateRangeHtml = "(" + dashletData.startDate + " to " + dashletData.endDate + ")";
    $("#conversionFunnel_dateRange").html(dateRangeHtml);

    var options = {
        block: {
            dynamicHeight: true,
            minHeight: 50,
            bottomPinch: 4,
            highlight: true,
            //barOverlay: true,
            fill: {
                type: 'gradient'
            }
        },

        chart: {
            bottomWidth: 1.5 / 3,
            animate: 200,
            curve: {
                enabled: true,
                height: 20
            }
        },
        label: {
            enabled: true,
            fontFamily: 'Roboto',
            fontSize: 0,
            //fill: '#ff0000',
            format: '{f}\n{l}',
        },
        tooltip: {
            enabled: false,
            format: '{f} {l}',
        }

    };

    const chart = new D3Funnel('#conversionFunnel_funnelChart');
    chart.draw(dashletData.funnelData, options);
}

function conversionFunnel_downloadPDF() {
//    $("#conversionFunnelDashletFilters").hide();

    var data = document.getElementById("conversionFunnelDashletHTML");
    html2canvas(data).then(canvas => {
        // Few necessary setting options  
        var imgWidth = 100;
        var imgHeight = canvas.height * imgWidth / canvas.width;

        const contentDataURL = canvas.toDataURL('image/png');
        var pdf = new jspdf(); // A4 size page of PDF  
        var position = 1;
        pdf.addImage(contentDataURL, 'PNG', 1, position, imgWidth, imgHeight);
        pdf.save('download.pdf'); // Generated PDF   
//        $("#conversionFunnelDashletFilters").show();
    });


}

function conversionFunnel_downloadCSV() {
    $("#conversionFunnelFilterForm").submit();
}

function resetConversionFunnelFiltersForm() {
    $("#conversionFunnelFilterForm").find('select.dashletFilter').each(function () {
        $(this).val('');
    });
    $('.chosen-select').trigger('chosen:updated');
}

