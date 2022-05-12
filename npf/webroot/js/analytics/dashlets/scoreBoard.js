var initilizeScoreBoard = function () {
    $("#scoreBoardDashlet").find(".applyDates").click(function () {
        $("#scoreBoard_range1StartDate").val("");
        $("#scoreBoard_range1EndDate").val("");
        $("#scoreBoard_range2StartDate").val("");
        $("#scoreBoard_range2EndDate").val("");
        if ($("#scoreBoardDashlet").find(".inputBaseStartDate").val() !== "" && $("#scoreBoardDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#scoreBoard_range1StartDate").val($("#scoreBoardDashlet").find(".inputBaseStartDate").val());
            $("#scoreBoard_range1EndDate").val($("#scoreBoardDashlet").find(".inputBaseEndDate").val());
        }
        if ($("#scoreBoardDashlet").find(".inputCompareCheckbox").is(":checked") && $("#scoreBoardDashlet").find(".inputCompareStartDate").val() !== "" && $("#scoreBoardDashlet").find(".inputCompareEndDate").val() !== "") {
            $("#scoreBoard_range2StartDate").val($("#scoreBoardDashlet").find(".inputCompareStartDate").val());
            $("#scoreBoard_range2EndDate").val($("#scoreBoardDashlet").find(".inputCompareEndDate").val());
        }
        createScoreBoard();
    });
    $("#scoreBoardDashlet").find(".cancelDates").click(function () {
        $("#scoreBoard_range1StartDate").val("");
        $("#scoreBoard_range1EndDate").val("");
        $("#scoreBoard_range2StartDate").val("");
        $("#scoreBoard_range2EndDate").val("");
        createScoreBoard();
    });
    createScoreBoard();
};

function initializeOwlCarousel(){
    $("#scoreBoardDashlet").find(".owl-carousel").owlCarousel({
        items: 1,
        nav: true,
        responsive: {
            480: {
                items: 2
            },
            780: {
                items: 3
            },
            980: {
                items: 4
            },
            1250: {
                items: 5
            },
			1400: {
                items: 6
            }
        }
    });
    
}

function createScoreBoard() {

    var dashletUrl = $("#scoreBoardDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#scoreBoard_collegeId").val($("#collegeId").val());
    var filters = $("#scoreBoardFilterForm").serializeArray();

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
            $('#scoreBoardDashletHTML .panel-loader').hide();
            $('#scoreBoardDashletHTML .panel-heading, #scoreBoardDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    updateScoreBoard(responseObject.data);
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
            console.log(xhr);
            console.log(thrownError);
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
;

function updateScoreBoard(dashletData) {
    var dateRangeHtml = "(" + dashletData.startDate + " to " + dashletData.endDate + ")";
    if (typeof dashletData.compareStartDate !== "undefined" && typeof dashletData.compareEndDate !== "undefined") {
        dateRangeHtml = dateRangeHtml + " vs (" + dashletData.compareStartDate + " to " + dashletData.compareEndDate + ")";
    }
    $("#scoreBoard_selectedDateRange").html(dateRangeHtml);
    if(typeof dashletData.leadCount['total'] !=="undefined"){
        var totalLeadCountHtml = "<strong>" + dashletData.leadCount.total.toLocaleString('en-IN') + "</strong>";
        if (typeof dashletData.leadCount.trends !== "undefined" && typeof dashletData.leadCount.trends.total !== "undefined") {
            if (dashletData.leadCount.trends.total === "NA") {
                totalLeadCountHtml = totalLeadCountHtml + '<span class="text-info trends">NA</span>';
            } else if (dashletData.leadCount.trends.total === 0) {
                totalLeadCountHtml = totalLeadCountHtml + '<span class="text-info trends">0%</span>';
            } else if (dashletData.leadCount.trends.total > 0) {
                totalLeadCountHtml = totalLeadCountHtml + '<span class="text-success trends"><i class="lineicon-up-arrow"></i><span class="fw-500">' + dashletData.leadCount.trends.total + '%</span></span>';
            } else {
                totalLeadCountHtml = totalLeadCountHtml + '<span class="text-danger trends"><i class="lineicon-down-arrow"></i><span class="fw-500">' + dashletData.leadCount.trends.total + '%</span></span>';
            }
        }
        $("#scoreBoard_leadCount_total").html(totalLeadCountHtml);
        $("#scoreBoard_leadCount_verifiedPercent").width(dashletData.leadCount.verifiedPercent + "%");
            $("#scoreBoard_leadCount_verified").html("Verified: " + dashletData.leadCount.verified.toLocaleString('en-IN'));
            $("#scoreBoard_leadCount_unverifiedPercent").width(dashletData.leadCount.unverifiedPercent + "%");
        $("#scoreBoard_leadCount_unverified").html("Unverified: " + dashletData.leadCount.unverified.toLocaleString('en-IN'));
        if(typeof dashletData.links['totalLeadLink'] !=="undefined"){
            $("#scoreBoard_leadCount_total").attr("href", dashletData.links['totalLeadLink']);
        }
        if(typeof dashletData.links['verifiedLeadLink'] !=="undefined"){
            $("#scoreBoard_leadCount_verified").attr("href", dashletData.links['verifiedLeadLink']);
        }
        if(typeof dashletData.links['unverifiedLeadLink'] !=="undefined"){
            $("#scoreBoard_leadCount_unverified").attr("href", dashletData.links['unverifiedLeadLink']);
        }
        
    }else{
        $("#scoreBoard_leadDiv").remove();
    }
    if(typeof dashletData.unpaidApplicationsCount['total'] !=="undefined"){
        var unpaidAppCountHtml = "<strong>" + dashletData.unpaidApplicationsCount.total.toLocaleString('en-IN') + "</strong>";
        if (typeof dashletData.unpaidApplicationsCount.trends !== "undefined" && typeof dashletData.unpaidApplicationsCount.trends.total !== "undefined") {
            if (dashletData.unpaidApplicationsCount.trends.total === "NA") {
                unpaidAppCountHtml = unpaidAppCountHtml + '<span class="text-info trends">NA</span>';
            } else if (dashletData.unpaidApplicationsCount.trends.total === 0) {
                unpaidAppCountHtml = unpaidAppCountHtml + '<span class="text-info trends">0%</span>';
            } else if (dashletData.unpaidApplicationsCount.trends.total > 0) {
                unpaidAppCountHtml = unpaidAppCountHtml + '<span class="text-success trends"><i class="lineicon-up-arrow"></i><span class="fw-500">' + dashletData.unpaidApplicationsCount.trends.total + '%</span></span>';
            } else {
                unpaidAppCountHtml = unpaidAppCountHtml + '<span class="text-danger trends"><i class="lineicon-down-arrow"></i><span class="fw-500">' + dashletData.unpaidApplicationsCount.trends.total + '%</span></span>';
            }
        }
        $("#scoreBoard_unpaidApplicationsCounts_total").html(unpaidAppCountHtml);
        $("#scoreBoard_paymentInitiatedPercent").width(dashletData.unpaidApplicationsCount.paymentInitiatedPercent + "%");
        $("#scoreBoard_paymentInitiatedCount").html("Payment Initiated: " + dashletData.unpaidApplicationsCount.paymentInitiated.toLocaleString('en-IN'));
        $("#scoreBoard_paymentNotInitiatedPercent").width(dashletData.unpaidApplicationsCount.paymentNotInitiatedPercent + "%");
        $("#scoreBoard_paymentNotInitiatedCount").html("Payment Not Initiated: " + dashletData.unpaidApplicationsCount.paymentNotInitiated.toLocaleString('en-IN'));
        if(typeof dashletData.links['totalUnPaidAppLink'] !=="undefined"){
            $("#scoreBoard_unpaidApplicationsCounts_total").attr("href", dashletData.links['totalUnPaidAppLink']);
        }
        if(typeof dashletData.links['paymentInitiatedAppLink'] !=="undefined"){
            $("#scoreBoard_paymentInitiatedCount").attr("href", dashletData.links['paymentInitiatedAppLink']);
        }
        if(typeof dashletData.links['paymentNotInitiatedAppLink'] !=="undefined"){
            $("#scoreBoard_paymentNotInitiatedCount").attr("href", dashletData.links['paymentNotInitiatedAppLink']);
        }
    }else{
        $("#scoreBoard_unpaidAppDiv").remove();
    }

    if(typeof dashletData.paidApplicationsCount['total'] !=="undefined"){
        var totalAppCountHtml = "<strong>" + dashletData.paidApplicationsCount.total.toLocaleString('en-IN') + "</strong>";
        if (typeof dashletData.paidApplicationsCount.trends !== "undefined" && typeof dashletData.paidApplicationsCount.trends.total !== "undefined") {
            if (dashletData.paidApplicationsCount.trends.total === "NA") {
                totalAppCountHtml = totalAppCountHtml + '<span class="text-info trends">NA</span>';
            } else if (dashletData.paidApplicationsCount.trends.total === 0) {
                totalAppCountHtml = totalAppCountHtml + '<span class="text-info trends">0%</span>';
            } else if (dashletData.paidApplicationsCount.trends.total > 0) {
                totalAppCountHtml = totalAppCountHtml + '<span class="text-success trends"><i class="lineicon-up-arrow"></i><span class="fw-500">' + dashletData.paidApplicationsCount.trends.total + '%</span></span>';
            } else {
                totalAppCountHtml = totalAppCountHtml + '<span class="text-danger trends"><i class="lineicon-down-arrow"></i><span class="fw-500">' + dashletData.paidApplicationsCount.trends.total + '%</span></span>';
            }
        }
        $("#scoreBoard_paidApplicationsCounts_total").html(totalAppCountHtml);
        if(typeof dashletData.links['totalPaidAppLink'] !=="undefined" ){
            $("#scoreBoard_paidApplicationsCounts_total").attr("href", dashletData.links['totalPaidAppLink']);
        }
//        $("#scoreBoard_paidApplicationsCount_modes").find("div.progress").addClass('disable');
        if($("#scoreBoard_paidApplicationsCount_online").length){
            $("#scoreBoard_paidApplicationsCount_online").find(".applicationCount").html("Online" + ": " + 0);
            $("#scoreBoard_paidApplicationsCount_online").find(".progress-bar").width("0%");
            if(typeof dashletData.links['onlinePaidAppLink'] !=="undefined"){
                $("#scoreBoard_paidApplicationsCount_online").find(".applicationCount").attr("href", dashletData.links['onlinePaidAppLink']);
            }
        }
        
        if($("#scoreBoard_paidApplicationsCount_offline").length){
            $("#scoreBoard_paidApplicationsCount_offline").find(".applicationCount").html("Offline" + ": " + 0);
            $("#scoreBoard_paidApplicationsCount_offline").find(".progress-bar").width("0%");
            if(typeof dashletData.links['offlinePaidAppLink'] !=="undefined"){
                $("#scoreBoard_paidApplicationsCount_offline").find(".applicationCount").attr("href", dashletData.links['offlinePaidAppLink']);
            }
        }
        
        if($("#scoreBoard_paidApplicationsCount_dd").length){
            $("#scoreBoard_paidApplicationsCount_dd").find(".applicationCount").html("DD" + ": " + 0);
            $("#scoreBoard_paidApplicationsCount_dd").find(".progress-bar").width("0%");
            if(typeof dashletData.links['ddPaidAppLink'] !=="undefined"){
                $("#scoreBoard_paidApplicationsCount_dd").find(".applicationCount").attr("href", dashletData.links['ddPaidAppLink']);
            }
        }
        
        if($("#scoreBoard_paidApplicationsCount_cash").length){
            $("#scoreBoard_paidApplicationsCount_cash").find(".applicationCount").html("Cash" + ": " + 0);
            $("#scoreBoard_paidApplicationsCount_cash").find(".progress-bar").width("0%");
            if(typeof dashletData.links['cashPaidAppLink'] !=="undefined"){
                $("#scoreBoard_paidApplicationsCount_cash").find(".applicationCount").attr("href", dashletData.links['cashPaidAppLink']);
            }
        }
        
        if($("#scoreBoard_paidApplicationsCount_voucher").length){
            $("#scoreBoard_paidApplicationsCount_voucher").find(".applicationCount").html("Voucher" + ": " + 0);
            $("#scoreBoard_paidApplicationsCount_voucher").find(".progress-bar").width("0%");
            if(typeof dashletData.links['voucherPaidAppLink'] !=="undefined"){
                $("#scoreBoard_paidApplicationsCount_voucher").find(".applicationCount").attr("href", dashletData.links['voucherPaidAppLink']);
            }
        }
        
        if($("#scoreBoard_paidApplicationsCount_free").length){
            $("#scoreBoard_paidApplicationsCount_free").find(".applicationCount").html("Free" + ": " + 0);
            $("#scoreBoard_paidApplicationsCount_free").find(".progress-bar").width("0%");
            if(typeof dashletData.paidApplicationsCount.free !== 'undefined' && dashletData.paidApplicationsCount.free >= 1){
                $('#total-paid-free-count').html('Total Paid/Free Applications ');
                var paid_applciations = dashletData.paidApplicationsCount.total - dashletData.paidApplicationsCount.free;
                $("#scoreBoard_paidApplicationsCounts_total").attr({
                    tabindex:"1", 
                    class:"info-icon",
                    role:"button",
                    "data-toggle":"popover",
                    "data-trigger":"hover",
                    "data-placement":"right",
                    "data-html":"true",
                    "data-container":"body",
                    "data-content":"Paid Applications: <strong>"+paid_applciations+"</strong><br />Free Applications: <strong>"+dashletData.paidApplicationsCount.free+"</strong>"
                });
                $('[data-toggle="popover"]').popover();
            }else {
               $('#total-paid-free-count').html('Total Paid Applications ');
               var attr = $('#scoreBoard_paidApplicationsCounts_total').attr('data-toggle');
                if (typeof attr !== typeof undefined && attr !== false) {
                    $("#scoreBoard_paidApplicationsCounts_total").popover('destroy');
                }
            }
            if(typeof dashletData.links['freePaidAppLink'] !=="undefined"){
                $("#scoreBoard_paidApplicationsCount_free").find(".applicationCount").attr("href", dashletData.links['freePaidAppLink']);
            }
        }
        
        $.each(dashletData.paidApplicationsCount, function (key, value) {
            if (key !== 'total' && key.indexOf("Percent") === -1) {
                var mode = '';
                switch (key) {
                    case 'online':
                        mode = "Online";
                        break;
                    case 'offline':
                        mode = "Offline";
                        break;
                    case 'dd':
                        mode = "DD";
                        break;
                    case 'cash':
                        mode = "Cash";
                        break;
                    case 'voucher':
                        mode = "Voucher";
                        break;
                    case 'free':
                        mode = "Free";
                        break;
                }
                if($("#scoreBoard_paidApplicationsCount_" + key).length){
                    $("#scoreBoard_paidApplicationsCount_" + key).find(".applicationCount").html(mode + ": " + value.toLocaleString());
                    $("#scoreBoard_paidApplicationsCount_" + key).find(".progress-bar").width(dashletData.paidApplicationsCount[key + "Percent"] + "%");
                }
            }
        });
    }else{
        $("#scoreBoard_paidAppDiv").remove();
    }

    if(typeof dashletData.queriesCount['total'] !=="undefined"){
        var totalQueriesCountHtml = "<strong>" + dashletData.queriesCount.total.toLocaleString('en-IN') + "</strong>";
        if (typeof dashletData.queriesCount.trends !== "undefined" && typeof dashletData.queriesCount.trends.total !== "undefined") {
            if (dashletData.queriesCount.trends.total === "NA") {
                totalQueriesCountHtml = totalQueriesCountHtml + '<span class="text-info trends">NA</span>';
            } else if (dashletData.queriesCount.trends.total === 0) {
                totalQueriesCountHtml = totalQueriesCountHtml + '<span class="text-info trends">0%</span>';
            } else if (dashletData.queriesCount.trends.total > 0) {
                totalQueriesCountHtml = totalQueriesCountHtml + '<span class="text-success trends"><i class="lineicon-up-arrow"></i><span class="fw-500">' + dashletData.queriesCount.trends.total + '%</span></span>';
            } else {
                totalQueriesCountHtml = totalQueriesCountHtml + '<span class="text-danger trends"><i class="lineicon-down-arrow"></i><span class="fw-500">' + dashletData.queriesCount.trends.total + '%</span></span>';
            }
        }
        $("#scoreBoard_queriesCount_total").html(totalQueriesCountHtml);
        $("#scoreBoard_queriesCount_openPercent").width(dashletData.queriesCount.openPercent + "%");
        $("#scoreBoard_queriesCount_open").html("Open: " + dashletData.queriesCount.open.toLocaleString('en-IN'));
        $("#scoreBoard_queriesCount_progressPercent").width(dashletData.queriesCount.progressPercent + "%");
        $("#scoreBoard_queriesCount_progress").html("Progress: " + dashletData.queriesCount.progress.toLocaleString('en-IN'));
        $("#scoreBoard_queriesCount_closedPercent").width(dashletData.queriesCount.closedPercent + "%");
        $("#scoreBoard_queriesCount_closed").html("Closed: " + dashletData.queriesCount.closed.toLocaleString('en-IN'));
        if(typeof dashletData.links['totalQueryLink'] !=="undefined"){
            $("#scoreBoard_queriesCount_total").attr("href", dashletData.links['totalQueryLink']);
        }
        if(typeof dashletData.links['openQueyLink'] !=="undefined"){
            $("#scoreBoard_queriesCount_open").attr("href", dashletData.links['openQueyLink']);
        }
        if(typeof dashletData.links['closedQueyLink'] !=="undefined"){
            $("#scoreBoard_queriesCount_closed").attr("href", dashletData.links['closedQueyLink']);
        }
        if(typeof dashletData.links['inProgressQueyLink'] !=="undefined"){
            $("#scoreBoard_queriesCount_progress").attr("href", dashletData.links['inProgressQueyLink']);
        }
    }else{
        $("#scoreBoard_queryDiv").remove();
    }

    if(typeof dashletData.communicationsCount['total'] !=="undefined"){
        var totalCommunicationCountHtml = "<strong>" + dashletData.communicationsCount.total.toLocaleString('en-IN') + "</strong>";
        if (typeof dashletData.communicationsCount.trends !== "undefined" && typeof dashletData.communicationsCount.trends.total !== "undefined") {
            if (dashletData.communicationsCount.trends.total === "NA") {
                totalCommunicationCountHtml = totalCommunicationCountHtml + '<span class="text-info trends">NA</span>';
            } else if (dashletData.communicationsCount.trends.total === 0) {
                totalCommunicationCountHtml = totalCommunicationCountHtml + '<span class="text-info trends">0%</span>';
            } else if (dashletData.communicationsCount.trends.total > 0) {
                totalCommunicationCountHtml = totalCommunicationCountHtml + '<span class="text-success trends"><i class="lineicon-up-arrow"></i><span class="fw-500">' + dashletData.communicationsCount.trends.total + '%</span></span>';
            } else {
                totalCommunicationCountHtml = totalCommunicationCountHtml + '<span class="text-danger trends"><i class="lineicon-down-arrow"></i><span class="fw-500">' + dashletData.communicationsCount.trends.total + '%</span></span>';
            }
        }
        $("#scoreBoard_communicationsCount_total").html(totalCommunicationCountHtml);
        $("#scoreBoard_communicationsCount_emailPercent").width(dashletData.communicationsCount.emailPercent + "%");
        $("#scoreBoard_communicationsCount_email").html("Email: " + dashletData.communicationsCount.email.toLocaleString('en-IN'));
        $("#scoreBoard_communicationsCount_smsPercent").width(dashletData.communicationsCount.smsPercent + "%");
        $("#scoreBoard_communicationsCount_sms").html("SMS: " + dashletData.communicationsCount.sms.toLocaleString('en-IN'));
        
        if(typeof dashletData.communicationsCount.whatsapp !=="undefined"){
            $("#scoreBoard_communicationsCount_whatsappPercent").width(dashletData.communicationsCount.whatsappPercent + "%");
            $("#scoreBoard_communicationsCount_whatsapp").html("Whatsapp: " + dashletData.communicationsCount.whatsapp.toLocaleString('en-IN'));
        }else{
            $(".whatsappDiv").remove();
        }
    }else{
        $("#scoreBoard_communicationDiv").remove();
    }

    if(typeof dashletData.ivrCallsCount['total'] !=="undefined"){
        var totalIvrCountHtml = "<strong>" + dashletData.ivrCallsCount.total.toLocaleString('en-IN') + "</strong>";
        if (typeof dashletData.ivrCallsCount.trends !== "undefined" && typeof dashletData.ivrCallsCount.trends.total !== "undefined") {
            if (dashletData.ivrCallsCount.trends.total === "NA") {
                totalIvrCountHtml = totalIvrCountHtml + '<span class="text-info trends"></i>NA</span>';
            } else if (dashletData.ivrCallsCount.trends.total === 0) {
                totalIvrCountHtml = totalIvrCountHtml + '<span class="text-info trends"></i>0%</span>';
            } else if (dashletData.ivrCallsCount.trends.total > 0) {
                totalIvrCountHtml = totalIvrCountHtml + '<span class="text-success trends"><i class="lineicon-up-arrow"></i><span class="fw-500">' + dashletData.ivrCallsCount.trends.total + '%</span></span>';
            } else {
                totalIvrCountHtml = totalIvrCountHtml + '<span class="text-danger trends"><i class="lineicon-down-arrow"></i><span class="fw-500">' + dashletData.ivrCallsCount.trends.total + '%</span></span>';
            }
        }
        $("#scoreBoard_ivrCallsCount_total").html(totalIvrCountHtml);
        $("#scoreBoard_ivrCallsCount_inbound_parent").hide();
        $("#scoreBoard_ivrCallsCount_outbound_parent").hide();
        $("#scoreBoard_ivrCallsCount_missed_parent").hide();
        if(typeof dashletData.ivrCallsCount.inbound!=="undefined"){
            $("#scoreBoard_ivrCallsCount_inbound_parent").show();
            $("#scoreBoard_ivrCallsCount_inboundPercent").width(dashletData.ivrCallsCount.inboundPercent + "%");
            $("#scoreBoard_ivrCallsCount_inbound").html("Inbound: " + dashletData.ivrCallsCount.inbound.toLocaleString('en-IN'));
        }
        if(typeof dashletData.ivrCallsCount.outbound!=="undefined"){
            $("#scoreBoard_ivrCallsCount_outbound_parent").show();
            $("#scoreBoard_ivrCallsCount_outboundPercent").width(dashletData.ivrCallsCount.outboundPercent + "%");
            $("#scoreBoard_ivrCallsCount_outbound").html("Outbound: " + dashletData.ivrCallsCount.outbound.toLocaleString('en-IN'));
        }
        if(typeof dashletData.ivrCallsCount.missed!=="undefined"){
            $("#scoreBoard_ivrCallsCount_missed_parent").show();
            $("#scoreBoard_ivrCallsCount_missedPercent").width(dashletData.ivrCallsCount.missedPercent + "%");
            $("#scoreBoard_ivrCallsCount_missed").html("Missed: " + dashletData.ivrCallsCount.missed.toLocaleString('en-IN'));
        }
    }else{
        $("#scoreBoard_ivrDiv").remove();
    }
    initializeOwlCarousel();
}

function resetScoreBoardFiltersForm() {
    $("#scoreBoardFilterForm").find('select.dashletFilter').each(function () {
        $(this).val('');
    });
    $('.chosen-select').trigger('chosen:updated');
}

function scoreBoard_downloadPDF() {
//    $("#scoreBoardDashletFilters").hide();

    var data = document.getElementById("scoreBoardDashletHTML");
    html2canvas(data).then(canvas => {
        // Few necessary setting options  
        var imgWidth = 200;
        var imgHeight = canvas.height * imgWidth / canvas.width;

        const contentDataURL = canvas.toDataURL('image/png');
        var pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
        var position = 1;
        pdf.addImage(contentDataURL, 'PNG', 1, position, imgWidth, imgHeight);
        pdf.save('download.pdf'); // Generated PDF   
//        $("#scoreBoardDashletFilters").show();
    });
}


function resetConversionFunnelFiltersForm() {
    $("#conversionFunnelFilterForm").find('select.dashletFilter').each(function () {
        $(this).val('');
    });
    $('.chosen-select').trigger('chosen:updated');
}


function scoreBoard_downloadCSV() {
    $("#scoreBoardFilterForm").submit();
}
