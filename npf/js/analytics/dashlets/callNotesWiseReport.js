var initilizeCallNotesWiseReport = function () {
    $("#callNotesWiseReportDashletHTML").find("div.calendarContainer").find("div.baseSelect").find('select option[value="4"]').hide();
    $("#callNotesWiseReportDashletHTML").find("div.calendarContainer").find("div.baseSelect").find('select option[value="5"]').hide();
    dateRangeHtml = "";
    $("#callNotesWiseReportDashlet").find(".applyDates").click(function (){
        $("#callNotesWiseReport_range1StartDate").val("");
        $("#callNotesWiseReport_range1EndDate").val("");
        if ($("#callNotesWiseReportDashlet").find(".inputBaseStartDate").val() !== "" &&
                $("#callNotesWiseReportDashlet").find(".inputBaseEndDate").val() !== "") {
            startDateObj = new Date($("#callNotesWiseReportDashlet").find(".inputBaseStartDate").val());
            endDateObj = new Date($("#callNotesWiseReportDashlet").find(".inputBaseEndDate").val());
            var diffTime = Math.abs(endDateObj - startDateObj);
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays >= 1) {
                alertPopup("The date range can't be more than one day for this report.", "error");
                return false;
            }

            $("#callNotesWiseReport_range1StartDate").val($("#callNotesWiseReportDashlet").find(".inputBaseStartDate").val());
            $("#callNotesWiseReport_range1EndDate").val($("#callNotesWiseReportDashlet").find(".inputBaseEndDate").val());
            startDate = startDateObj.getDate() + " " + startDateObj.getMonthName() + " " + startDateObj.getFullYear()
            endDate = endDateObj.getDate() + " " + endDateObj.getMonthName() + " " + endDateObj.getFullYear()
            dateRangeHtml = "(" + startDate + " to " + endDate + ")";
        }
        $("#callNotesWiseReportDateRange").html(dateRangeHtml);
        createCallNotesWiseReport();
        table_fix_rowcol();
    });
    if (dateRangeHtml == "") {
        createCallNotesWiseReport();
        $("#callNotesWiseReportDateRange").html(dateRangeHtml);
    }

    $("#callNotesWiseReportDashlet").find(".cancelDates").click(function () {
        getcallNotesWiseReportDate();
        createCallNotesWiseReport();
    });
    //createCallNotesWiseReport();

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
}

function getcallNotesWiseReportDate() {
    $("#callNotesWiseReport_range1StartDate").val("");
    $("#callNotesWiseReport_range1EndDate").val("");
}

function resetcallNotesWiseReportFilterForm() {
    $("#callNotesWiseReportFilterForm").find('.dashletFilter').each(function () {
        $(this).val('');
        $('select#' + $(this).attr('id'))[0].sumo.reload();
    });
}

var createCallNotesWiseReport = function (pageNumber, monthYear) {
    if (typeof pageNumber === "undefined" || pageNumber === null || pageNumber === 0) {
        pageNumber = 1;
    }
    var dashletUrl = $("#callNotesWiseReport").data('url');
    $("#callNotesWiseCollegeId").val($("#collegeId").val());
    var filters = $("#callNotesWiseReportFilterForm").serializeArray();
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
            $("#callNotesWiseReportDashletHTML .panel-loader").show();
            $("#callNotesWiseReportDashletHTML .panel-heading").addClass("pvBlur");
            $(".btn-group").removeClass('open');
        },
        complete: function () {
            $("#callNotesWiseReportDashletHTML .panel-loader").hide();
            $("#callNotesWiseReportDashletHTML .panel-heading").removeClass("pvBlur");
            table_fix_head();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (pageNumber == 1) {
                    $("#callNotesWiseReportTableContainer").html("");
                }
                if (typeof responseObject.data === "object") {
                    var dashletData = responseObject.data;
                    if (typeof dashletData.tableHtml === "undefined") {
                        return;
                    }

                    if (pageNumber == 1) {
                        $("#callNotesWiseDownloadButton").show();
                        if (typeof dashletData.hideDownload !== "undefined" && dashletData.hideDownload == 1) {
                            $("#callNotesWiseDownloadButton").hide();
                        }
                        $("#callNotesWiseReportTableContainer").html(dashletData.tableHtml);
                        $('#callNotesWiseReportDateRange').html(dashletData.defaultDateText);

                    } else {
                        $("#callNotesWiseReportTableContainer").find("tbody").append(dashletData.tableHtml);
                        $('#callNotesWiseReportDateRange').html(dashletData.defaultDateText);
                        table_fix_rowcol();
                    }
                    $("#callNotesWiseLoadMoreBtn").attr('onClick', 'javascript:createCallNotesWiseReport(' + dashletData.pageNumber + ')');
                    if (typeof dashletData.hideLoadMore !== "undefined" && dashletData.hideLoadMore == 1) {
                        $("#callNotesWiseLoadMoreRow").hide();
                    }
                    //Show Total Sum Data in last row
                    if ((typeof responseObject.data === "object") && (typeof responseObject.data.totalCallNoteRow === "object")) {
                        var totalRow = responseObject.data.totalCallNoteRow;
                        for (var type in totalRow) {
                            var rowCount = manageTotalCallNoteRowData(type, totalRow[type]);
                            $('tfoot tr#callNotesreportFooters th#' + type + 'Footer').html(rowCount);
                        }
                    }
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(responseObject.message, "error");
                }
            }
            table_fix_rowcol();
            $(".btn-group").removeClass('open');
            //customdropdown();
            return;
        },

        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function manageTotalCallNoteRowData(type, count) {
    var obj = $('tfoot tr#callNotesreportFooters th#' + type + 'Footer');
    var prevRowCount = obj.html();
    var newCount = count;
    if ((type == 'dialablePercentage') || (type == 'connectedPercentage') || (type == 'interestedPercentage') || (type == 'notInterestedPercentage')) {
        prevRowCount = count;//parseFloat(prevRowCount.replace('%', ''));
    } else {
        prevRowCount = parseInt(prevRowCount);
    }

    switch(type) {
        case 'dialablePercentage':
            newCount = newCount + '%';
            var connected = $('tfoot tr#callNotesreportFooters th#connectedFooter').html();
            var notConnected = $('tfoot tr#callNotesreportFooters th#notConnectedFooter').html();
            var totalLeads = $('tfoot tr#callNotesreportFooters th#totalLeadFooter').html();
            var totalOfConnectedNotConnected = parseInt(connected) + parseInt(notConnected);
            if ((parseInt(totalLeads) > 0) && (parseInt(totalOfConnectedNotConnected) > 0)) {
                newCount = ((totalOfConnectedNotConnected / totalLeads) * 100);
                newCount = newCount.toFixed(2) + '%';
            }
            break;
        case 'connectedPercentage':
            newCount = newCount + '%';
            var connected = $('tfoot tr#callNotesreportFooters th#connectedFooter').html();
            var notConnected = $('tfoot tr#callNotesreportFooters th#notConnectedFooter').html();
            var totalOfConnectedNotConnected = parseInt(connected) + parseInt(notConnected);
            if ((parseInt(totalOfConnectedNotConnected) > 0) && (parseInt(connected) > 0)) {
                newCount = ((connected / totalOfConnectedNotConnected) * 100);
                newCount = newCount.toFixed(2) + '%';
            }
            break;
        case 'interestedPercentage':
            newCount = newCount + '%';
            var interested = $('tfoot tr#callNotesreportFooters th#interestedFooter').html();
            var connected = $('tfoot tr#callNotesreportFooters th#connectedFooter').html();
            if ((parseInt(interested) > 0) && (parseInt(connected) > 0)) {
                newCount = ((interested / connected) * 100);
                newCount = newCount.toFixed(2) + '%';
            }
            break;
        case 'notInterestedPercentage':
            newCount = newCount + '%';
            var notInterested = $('tfoot tr#callNotesreportFooters th#notInterestedFooter').html();
            var connected = $('tfoot tr#callNotesreportFooters th#connectedFooter').html();
            if ((parseInt(notInterested) > 0) && (parseInt(connected) > 0)) {
                newCount = ((notInterested / connected) * 100);
                newCount = newCount.toFixed(2) + '%';
            }
            break;
        default:
            if (prevRowCount > 0) {
                newCount = count + prevRowCount;
            }
            break;
    }
    return newCount;
}

function callNotesWiseReportDownloadCSV() {
    $("#callNotesWiseCollegeId").val($("#collegeId").val());
    var filters = $("#callNotesWiseReportFilterForm").serializeArray();
    $.ajax({
        url: jsVars.callNotesWiseReportDownloadUrl,
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
                $('#requestMessage').html('custom csv download');
                $('#muliUtilityPopup').modal('show');
                $('#muliUtilityPopup .draw-cross').addClass('glyphicon glyphicon-remove');
                $('#muliUtilityPopup .close').addClass('npf-close').css({'margin-top': '2px', 'opacity': '1'});
            } else if (response.error == 'session_out' || response.error == 'invalid_csrf') {
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

function displayDayWiseData(key) {
    $("#callNotesWiseDayData_" + key).css("display", "block");
}


function customdropdownCallNotesWise() {
    if ($('form#callNotesWiseReportFilterForm .cdropdown').hasClass('open')) {
        $("form#callNotesWiseReportFilterForm .cdropdown").removeClass("open");
    } else {
        $("form#callNotesWiseReportFilterForm .cdropdown").addClass("open");
    }
    $(document).click(function (event) {
        if (!($(event.target).closest(".cdropdown").length)) {
            $("form#callNotesWiseReportFilterForm .cdropdown").removeClass("open");
        }
    });
}