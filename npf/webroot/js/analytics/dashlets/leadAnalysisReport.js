var initilizeLeadAnalysisReport = function () {
    $("#leadAnalysisReportDashletHTML").find("div.calendarContainer").find("div.baseSelect").find('select option[value="4"]').hide();
    $("#leadAnalysisReportDashletHTML").find("div.calendarContainer").find("div.baseSelect").find('select option[value="5"]').hide();
    dateRangeHtml = "";
    $("#leadAnalysisReportDashlet").find(".applyDates").click(function ()
    {
        $("#leadAnalysisReport_range1StartDate").val("");
        $("#leadAnalysisReport_range1EndDate").val("");
        if ($("#leadAnalysisReportDashlet").find(".inputBaseStartDate").val() !== "" &&
                $("#leadAnalysisReportDashlet").find(".inputBaseEndDate").val() !== "") {
            startDateObj = new Date($("#leadAnalysisReportDashlet").find(".inputBaseStartDate").val());
            endDateObj = new Date($("#leadAnalysisReportDashlet").find(".inputBaseEndDate").val());
            var diffTime = Math.abs(endDateObj - startDateObj);
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 150) {
                alertPopup("Date range can not be more than 150 days for this report.", "error");
                return false;
            }

            $("#leadAnalysisReport_range1StartDate").val($("#leadAnalysisReportDashlet").find(".inputBaseStartDate").val());
            $("#leadAnalysisReport_range1EndDate").val($("#leadAnalysisReportDashlet").find(".inputBaseEndDate").val());
            startDate = startDateObj.getDate() + " " + startDateObj.getMonthName() + " " + startDateObj.getFullYear()
            endDate = endDateObj.getDate() + " " + endDateObj.getMonthName() + " " + endDateObj.getFullYear()
            dateRangeHtml = "(" + startDate + " to " + endDate + ")";
        }
        $("#leadAnalysisReportDateRange").html(dateRangeHtml);
        createLeadAnalysisReport();
        table_fix_rowcol();
    });
    if (dateRangeHtml == "") {
        getleadAnalysisReportDate();
        $("#leadAnalysisReportDateRange").html(dateRangeHtml);
    }

    $("#leadAnalysisReportDashlet").find(".cancelDates").click(function () {
        getleadAnalysisReportDate();
        createLeadAnalysisReport();
    });
    createLeadAnalysisReport();

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

function getleadAnalysisReportDate() {
    $("#leadAnalysisReport_range1StartDate").val("");
    $("#leadAnalysisReport_range1EndDate").val("");
}

function resetLeadAnalysisReportFilterForm() {
    $("#leadAnalysisReportFilterForm").find('.dashletFilter').each(function () {
        $(this).val('');
        $('select#' + $(this).attr('id'))[0].sumo.reload();
    });
    $("#leadAnalysisReport_publishers").empty();
    $('#leadAnalysisReport_publishers').html("");
    $('select#leadAnalysisReport_publishers')[0].sumo.reload();
    $("#leadAnalysisReport_source").empty();
    $('#leadAnalysisReport_source').html("");
    $('select#leadAnalysisReport_source')[0].sumo.reload();
    $("#leadAnalysisReport_medium").empty();
    $('#leadAnalysisReport_medium').html("");
    $('select#leadAnalysisReport_medium')[0].sumo.reload();
    $("#leadAnalysisReport_campaign").empty();
    $('#leadAnalysisReport_campaign').html("");
    $('select#leadAnalysisReport_campaign')[0].sumo.reload();
}

var createLeadAnalysisReport = function (pageNumber, monthYear) {
    if (typeof pageNumber === "undefined" || pageNumber === null || pageNumber === 0) {
        pageNumber = 1;
    }
    if (typeof monthYear === "undefined" || monthYear === null || monthYear === 0) {
        monthYear = '';
    }
    var dashletUrl = $("#leadAnalysisReport").data('url');
    $("#leadAnalysisCollegeId").val($("#collegeId").val());
    var filters = $("#leadAnalysisReportFilterForm").serializeArray();
    filters.push({name: "page", value: pageNumber});
    filters.push({name: "monthYear", value: monthYear});
    $.ajax({
        url: dashletUrl,
        type: 'post',
        data: filters,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $("#leadAnalysisReportDashletHTML .panel-loader").show();
            $("#leadAnalysisReportDashletHTML .panel-heading").addClass("pvBlur");
            $(".btn-group").removeClass('open');
        },
        complete: function () {
            $("#leadAnalysisReportDashletHTML .panel-loader").hide();
            $("#leadAnalysisReportDashletHTML .panel-heading").removeClass("pvBlur");
            table_fix_head();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (pageNumber == 1 && monthYear == '') {
                    $("#leadAnalysisReportTableContainer").html("");
                }
                if (typeof responseObject.data === "object" && monthYear == '') {
                    var dashletData = responseObject.data;
                    if (typeof dashletData.tableHtml === "undefined") {
                        return;
                    }

                    if (pageNumber == 1) {
                        $("#leadAnalysisDownloadButton").show();
                        if (typeof dashletData.hideDownload !== "undefined" && dashletData.hideDownload == 1) {
                            $("#leadAnalysisDownloadButton").hide();
                        }
                        $("#leadAnalysisReportTableContainer").html(dashletData.tableHtml);
                        $('#leadAnalysisReportDateRange').html(dashletData.defaultDateText);

                    } else {

                        $("#leadAnalysisReportTableContainer").find("tbody").append(dashletData.tableHtml);
                        $('#leadAnalysisReportDateRange').html(dashletData.defaultDateText);
                    }
                    $("#leadAnalysisLoadMoreBtn").attr('onClick', 'javascript:createLeadAnalysisReport(' + dashletData.pageNumber + ')');
                    if (typeof dashletData.hideLoadMore !== "undefined" && dashletData.hideLoadMore == 1) {
                        $("#leadAnalysisLoadMoreRow").hide();
                    }
                    //Show Total Sum Data in last row
                    if ((typeof responseObject.data === "object") && (typeof responseObject.data.totalRow === "object")) {
                        var totalRow = responseObject.data.totalRow;
                        for (var type in totalRow) {
                            var rowCount = manageTotalRowData(type, totalRow[type]);
                            $('tfoot tr#leadreportFooters th#' + type + 'Footer').html(rowCount);
                        }
                    }
                } else {
                    var tableRows = '';
                    var colspanClass = 1;
                    var triedClass = '';
                    var connectedClass = '';
                    var interestedClass = '';

                    if (typeof responseObject.leadAnalysisData === "object") {
                        $.each(responseObject.leadAnalysisData.dailyData, function (stgeId, stges) {
                            if (stges.triedPercentage >= 95) {
                                triedClass = 'greenbg';
                            } else if (stges.triedPercentage >= 80 && stges.triedPercentage < 95) {
                                triedClass = 'yellowbg';
                            } else if (stges.triedPercentage < 80) {
                                triedClass = 'redbg';
                            }
                            if (stges.connectedPercentage >= 65) {
                                connectedClass = 'greenbg';
                            } else if (stges.connectedPercentage >= 55 && stges.connectedPercentage < 65) {
                                connectedClass = 'yellowbg';
                            } else if (stges.connectedPercentage < 55) {
                                connectedClass = 'redbg';
                            }
                            if (stges.interestedPercentage >= 25) {
                                interestedClass = 'greenbg';
                            } else if (stges.interestedPercentage >= 20 && stges.interestedPercentage < 25) {
                                interestedClass = 'yellowbg';
                            } else if (stges.interestedPercentage < 20) {
                                interestedClass = 'redbg';
                            }

                            if (stges.triedPercentage > 100) {
                                stges.triedPercentage = 100;
                            } else if (stges.triedPercentage < 0) {
                                stges.triedPercentage = 0;
                            }
                            if (stges.connectedPercentage > 100) {
                                stges.connectedPercentage = 100;
                            } else if (stges.connectedPercentage < 0) {
                                stges.connectedPercentage = 0;
                            }
                            if (stges.interestedPercentage > 100) {
                                stges.interestedPercentage = 100;
                            } else if (stges.interestedPercentage < 0) {
                                stges.interestedPercentage = 0;
                            }
                            if (stges.notInterestedPercentage > 100) {
                                stges.notInterestedPercentage = 100;
                            } else if (stges.notInterestedPercentage < 0) {
                                stges.notInterestedPercentage = 0;
                            }
                            var colspanClassCount = (colspanClass % 2 == 0) ? 1 : 2;
                            var d = new Date(stges._id * 1000);
                            if (typeof stges === "object") {
                                tableRows += '<tr class="parent_' + monthYear + '" id="parent_' + monthYear + '">';
                                tableRows += '<td class="colGroup' + colspanClassCount + ' column_' + colspanClassCount + '">' + d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear() + '</td>';
                                tableRows += '<td class="colGroup' + colspanClassCount + ' column_' + colspanClassCount + '">' + stges.totalLead + '</td>';
                                tableRows += '<td class="colGroup' + colspanClassCount + ' column_' + colspanClassCount + '">' + stges.mobileUnVerified + '</td>';
                                tableRows += '<td class="colGroup' + colspanClassCount + ' column_' + colspanClassCount + '">' + stges.dialableLeads + '</td>';
                                tableRows += '<td class="colGroup' + colspanClassCount + ' column_' + colspanClassCount + '">' + stges.notTried + '</td>';
                                tableRows += '<td class="colGroup' + colspanClassCount + ' column_' + colspanClassCount + '">' + stges.tried + '</td>';
                                tableRows += '<td class="colGroup' + colspanClassCount + ' column_' + colspanClassCount + '">' + stges.connected + '</td>';
                                tableRows += '<td class="colGroup' + colspanClassCount + ' column_' + colspanClassCount + '">' + stges.notConnected + '</td>';
                                tableRows += '<td class="colGroup' + colspanClassCount + ' column_' + colspanClassCount + '">' + stges.interested + '</td>';
                                tableRows += '<td class="colGroup' + colspanClassCount + ' column_' + colspanClassCount + '">' + stges.admissionsMatured + '</td>';
                                tableRows += '<td class="colGroup' + colspanClassCount + ' column_' + colspanClassCount + '">' + stges.applicationsMatured + '</td>';
                                tableRows += '<td class="colGroup' + colspanClassCount + ' column_' + colspanClassCount + '">' + stges.notInterested + '</td>';
                                tableRows += '<td class="colGroup' + colspanClassCount + ' column_' + colspanClassCount + '">' + stges.inprogress + '</td>';
                                tableRows += '<td class="colGroup' + colspanClassCount + ' column_' + colspanClassCount + '">' + stges.missing + '</td>';
                                tableRows += '<td class="thresholdred colGroup' + colspanClassCount + ' column_' + colspanClassCount + ' ' + triedClass + '">' + stges.triedPercentage + '%</td>';
                                tableRows += '<td class="thresholdyellow colGroup' + colspanClassCount + ' column_' + colspanClassCount + ' ' + connectedClass + '">' + stges.connectedPercentage + '%</td>';
                                tableRows += '<td class="thresholdgreen colGroup' + colspanClassCount + ' column_' + colspanClassCount + ' ' + interestedClass + '">' + stges.interestedPercentage + '%</td>';
                                tableRows += '<td class="colGroup' + colspanClassCount + ' column_' + colspanClassCount + '">' + stges.notInterestedPercentage + '%</td>';
                                tableRows += '</tr>';

                            }
                            colspanClass++;
                        });
                    }

                    $(tableRows).insertAfter($('#leadAnalysisReport_' + monthYear));

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

function manageTotalRowData(type, count) {
    var obj = $('tfoot tr#leadreportFooters th#' + type + 'Footer');
    var prevRowCount = obj.html();
    var newCount = count;
    if ((type == 'triedPercentage') || (type == 'connectedPercentage') || (type == 'interestedPercentage') || (type == 'notInterestedPercentage')) {
        prevRowCount = count;//parseFloat(prevRowCount.replace('%', ''));
    } else {
        prevRowCount = parseInt(prevRowCount);
    }
    
    switch(type) {
        case 'triedPercentage':
            newCount = newCount + '%';
            var tried = $('tfoot tr#leadreportFooters th#triedFooter').html();
            var dialableLeads = $('tfoot tr#leadreportFooters th#dialableLeadsFooter').html();
            if ((parseInt(tried) > 0) && (parseInt(dialableLeads) > 0)) {
                newCount = ((tried / dialableLeads) * 100);
                newCount = newCount.toFixed(2) + '%';
            }
            break;
        case 'connectedPercentage':
            newCount = newCount + '%';
            var tried = $('tfoot tr#leadreportFooters th#triedFooter').html();
            var connected = $('tfoot tr#leadreportFooters th#connectedFooter').html();
            if ((parseInt(tried) > 0) && (parseInt(connected) > 0)) {
                newCount = ((connected / tried) * 100);
                newCount = newCount.toFixed(2) + '%';
            }
            break;
        case 'interestedPercentage':
            newCount = newCount + '%';
            var interested = $('tfoot tr#leadreportFooters th#interestedFooter').html();
            var connected = $('tfoot tr#leadreportFooters th#connectedFooter').html();
            if ((parseInt(interested) > 0) && (parseInt(connected) > 0)) {
                newCount = ((interested / connected) * 100);
                newCount = newCount.toFixed(2) + '%';
            }
            break;
        case 'notInterestedPercentage':
            newCount = newCount + '%';
            var notInterested = $('tfoot tr#leadreportFooters th#notInterestedFooter').html();
            var connected = $('tfoot tr#leadreportFooters th#connectedFooter').html();
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

function leadAnalysisReportDownloadCSV() {
    $("#leadAnalysisCollegeId").val($("#collegeId").val());
    var filters = $("#leadAnalysisReportFilterForm").serializeArray();
    $.ajax({
        url: jsVars.leadAnalysisReportDownloadUrl,
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
    $("#leadAnalysisDayData_" + key).css("display", "block");
}

function getMonthWiseLeadData(monthYear, pageNumber) {
    if ($('#' + monthYear).hasClass('hideSpecialisation')) {
        createLeadAnalysisReport(pageNumber, monthYear);
    } else {
        $('.parent_' + monthYear).remove();
    }
    $('#' + monthYear).toggleClass('hideSpecialisation');
}


function customdropdown() {
    if ($('form#leadAnalysisReportFilterForm .cdropdown').hasClass('open')) {
        $("form#leadAnalysisReportFilterForm .cdropdown").removeClass("open");
    } else {
        $("form#leadAnalysisReportFilterForm .cdropdown").addClass("open");
    }
    $(document).click(function (event) {
        if (!($(event.target).closest(".cdropdown").length)) {
            $("form#leadAnalysisReportFilterForm .cdropdown").removeClass("open");
        }
    });
}