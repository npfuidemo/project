var initilizeApplicationFunnel = function () {
    $("#applicationFunnelDashlet").find(".applyDates").click(function () {
        $("#applicationFunnel_range1StartDate").val("");
        $("#applicationFunnel_range1EndDate").val("");
        if ($("#applicationFunnelDashlet").find(".inputBaseStartDate").val() !== "" && $("#applicationFunnelDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#applicationFunnel_range1StartDate").val($("#applicationFunnelDashlet").find(".inputBaseStartDate").val());
            $("#applicationFunnel_range1EndDate").val($("#applicationFunnelDashlet").find(".inputBaseEndDate").val());
        }
        createApplicationFunnelGraph();
    });
    $("#applicationFunnelDashlet").find(".cancelDates").click(function () {
        $("#applicationFunnel_range1StartDate").val("");
        $("#applicationFunnel_range1EndDate").val("");
        createApplicationFunnelGraph();
    });
    
    $('#applicationFunnel_form_id.sumo-select').SumoSelect({
        search: true,
        searchText: 'Select Form',
        selectAll: true,
	placeholder: 'Select Form', 
        captionFormatAllSelected: "All Selected.", 
        triggerChangeCombined: true, 
        okCancelInMulti: true,
        floatWidth: 600,
        forceCustomRendering: true,
        nativeOnDevice: ['Android', 'BlackBerry', 'iPhone', 'iPad', 'iPod', 'Opera Mini', 'IEMobile', 'Silk'],        
    });    
    createApplicationFunnelGraph();

};

var createApplicationFunnelGraph = function () {
//    $("#applicationFunnelDashlet").find('.dropdown-toggle').dropdown('close');
    var dashletUrl = $("#applicationFunnelDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#applicationFunnel_collegeId").val($("#collegeId").val());
    var filters = $("#applicationFunnelFilterForm").serializeArray();
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
            $('#applicationFunnelDashletHTML .panel-loader').hide();
            $('#applicationFunnelDashletHTML .panel-heading, #applicationFunnelDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    updateApplicationFunnel(responseObject.data);
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

function updateApplicationFunnel(dashletData) {
    var dateRangeHtml = "";
    if (typeof dashletData.startDate !== "undefined" && typeof dashletData.startDate !== "undefined") {
        dateRangeHtml = "(" + dashletData.startDate + " - " + dashletData.endDate + ")";
    }
    $("#applicationFunnel_dateRange").html(dateRangeHtml);
    //$("#applicationFunnel_paidApplicationsBreakup").hide();
    //$("#applicationFunnel_unpaidApplicationsBreakup").hide();

    $("#applicationFunnel_totalApplications").html(0);
    $("#applicationFunnel_paidApplications").html(0);
    $("#applicationFunnel_unpaidApplications").html(0);
    $("span.applicationFunnel_app_count").each(function(){
        $(this).html(0);
    });
    
    if (typeof dashletData.totalApplications !== "undefined") {
        $("#applicationFunnel_totalApplications").html(dashletData.totalApplications.toLocaleString('en-IN'));
    }

    if (typeof dashletData.paidApplications.total !== "undefined") {
        $("#applicationFunnel_paidApplications").html(dashletData.paidApplications.total.toLocaleString('en-IN'));
    }
    
    if (typeof dashletData.paidApplications.free !== "undefined" && dashletData.paidApplications.free >=1) {
        $("#applicationFunnel_total_paid_free_count").html(' Paid/Free Applications ');
    }else {
        $("#applicationFunnel_total_paid_free_count").html(' Paid Applications ');
    }

    if (typeof dashletData.unpaidApplications.total !== "undefined") {
        $("#applicationFunnel_unpaidApplications").html(dashletData.unpaidApplications.total.toLocaleString('en-IN'));
    }

    if (parseInt(dashletData.paidApplications.total) > 0 && typeof dashletData.paidApplications === "object") {
        $("#applicationFunnel_paidApplicationsBreakup").show();
        $.each(dashletData.paidApplications, function (key, value) {
            if ($("#applicationFunnel_" + key + "_div").length) {
                $("#applicationFunnel_" + key + "_div").find("span.applicationFunnel_app_count").html(value.toLocaleString('en-IN'));
            }
        });
    }

    if (typeof dashletData.unpaidApplications.paymentInitiated !== "undefined" && typeof dashletData.unpaidApplications.paymentNotInitiated !== "undefined") {
        $("#applicationFunnel_unpaidApplicationsBreakup").show();
        $("#applicationFunnel_paymentInitiated").html(dashletData.unpaidApplications.paymentInitiated.toLocaleString('en-IN'));
        $("#applicationFunnel_paymentNotInitiated").html(dashletData.unpaidApplications.paymentNotInitiated.toLocaleString('en-IN'));
    } 

}

function applicationFunnel_downloadPDF() {
//    $("#applicationFunnelFilters").hide();

    var data = document.getElementById("applicationFunnelDashletHTML");
    html2canvas(data).then(canvas => {
        // Few necessary setting options  
        var imgWidth = 200;
        var imgHeight = canvas.height * imgWidth / canvas.width;

        const contentDataURL = canvas.toDataURL('image/png');
        var pdf = new jspdf(); // A4 size page of PDF  
        var position = 1;
        pdf.addImage(contentDataURL, 'PNG', 1, position, imgWidth, imgHeight);
        pdf.save('download.pdf'); // Generated PDF   
//        $("#applicationFunnelFilters").show();
    });


}

function applicationFunnel_downloadCSV() {
    $("#applicationFunnelFilterForm").submit();
}

function resetApplicationFunnelFilterForm() {
    $("#applicationFunnelFilterForm").find('select.dashletFilter').each(function () {
        $(this).val('');
    });
    $('.chosen-select').trigger('chosen:updated');
    if ($("#applicationFunnel_form_id.sumo-select").length > 0){
        $("#applicationFunnel_form_id.sumo-select")[0].sumo.reload();
    }
}
