var initilizeAgencyWiseCallingReport = function () {
    $("#agencyWiseCallingReportDashletHTML").find("div.calendarContainer").find("div.baseSelect").find('select option[value="4"]').hide();
    $("#agencyWiseCallingReportDashletHTML").find("div.calendarContainer").find("div.baseSelect").find('select option[value="5"]').hide();
    dateRangeHtml = "";
    $("#agencyWiseCallingReportDashlet").find(".applyDates").click(function ()
    {
        $("#agencyWiseCallingReport_range1StartDate").val("");
        $("#agencyWiseCallingReport_range1EndDate").val("");
        if ($("#agencyWiseCallingReportDashlet").find(".inputBaseStartDate").val() !== "" &&
                $("#agencyWiseCallingReportDashlet").find(".inputBaseEndDate").val() !== "") {
            startDateObj = new Date($("#agencyWiseCallingReportDashlet").find(".inputBaseStartDate").val());
            endDateObj = new Date($("#agencyWiseCallingReportDashlet").find(".inputBaseEndDate").val());
            var diffTime = Math.abs(endDateObj - startDateObj);
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 150) {
                alertPopup("Date range can not be more than 150 days for this report.", "error");
                return false;
            }

            $("#agencyWiseCallingReport_range1StartDate").val($("#agencyWiseCallingReportDashlet").find(".inputBaseStartDate").val());
            $("#agencyWiseCallingReport_range1EndDate").val($("#agencyWiseCallingReportDashlet").find(".inputBaseEndDate").val());
            startDate = startDateObj.getDate() + " " + startDateObj.getMonthName() + " " + startDateObj.getFullYear()
            endDate = endDateObj.getDate() + " " + endDateObj.getMonthName() + " " + endDateObj.getFullYear()
            dateRangeHtml = "(" + startDate + " to " + endDate + ")";
        }
        $("#agencyWiseCallingReportDateRange").html(dateRangeHtml);
        createAgencyWiseCallingReport();
        table_fix_rowcol();
    });
    if (dateRangeHtml == "") {
        getAgencyWiseCallingReportDate();
        $("#agencyWiseCallingReportDateRange").html(dateRangeHtml);
    }

    $("#agencyWiseCallingReportDashlet").find(".cancelDates").click(function () {
        getAgencyWiseCallingReportDate();
        createAgencyWiseCallingReport();
    });
    createAgencyWiseCallingReport();

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

function getAgencyWiseCallingReportDate() {
    $("#agencyWiseCallingReport_range1StartDate").val("");
    $("#agencyWiseCallingReport_range1EndDate").val("");
}

function resetAgencyWiseCallingReportFilterForm() {
    $("#agencyWiseCallingReportFilterForm").find('.dashletFilter').each(function () {
        $(this).val('');
        $('select#' + $(this).attr('id'))[0].sumo.reload();
    });
    $("#agencyWiseCallingReport_publishers").empty();
    $('#agencyWiseCallingReport_publishers').html("");
    $('select#agencyWiseCallingReport_publishers')[0].sumo.reload();
    $("#agencyWiseCallingReport_source").empty();
    $('#agencyWiseCallingReport_source').html("");
    $('select#agencyWiseCallingReport_source')[0].sumo.reload();
    $("#agencyWiseCallingReport_medium").empty();
    $('#agencyWiseCallingReport_medium').html("");
    $('select#agencyWiseCallingReport_medium')[0].sumo.reload();
    $("#agencyWiseCallingReport_campaign").empty();
    $('#agencyWiseCallingReport_campaign').html("");
    $('select#agencyWiseCallingReport_campaign')[0].sumo.reload();
}

var createAgencyWiseCallingReport = function (pageNumber, category, publisher, monthYear) {
    if (typeof pageNumber === "undefined" || pageNumber === null || pageNumber === 0) {
        pageNumber = 1;
    }
    if (typeof category === "undefined" || category === null) {
        category = '';
    }
    if (typeof publisher === "undefined" || publisher === null) {
        publisher = '';
    }
    if (typeof monthYear === "undefined" || monthYear === null || monthYear === 0) {
        monthYear = '';
    }
    var dashletUrl = $("#agencyWiseCallingReport").data('url');
    $("#agencyWiseCallingCollegeId").val($("#collegeId").val());
    var filters = $("#agencyWiseCallingReportFilterForm").serializeArray();
    filters.push({name: "page", value: pageNumber});
    filters.push({name: "categoryWise", value: category});
    filters.push({name: "publisherWise", value: publisher});
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
            $("#agencyWiseCallingReportDashletHTML .panel-loader").show();
            $("#agencyWiseCallingReportDashletHTML .panel-heading").addClass("pvBlur");
            $(".btn-group").removeClass('open');
        },
        complete: function () {
            $("#agencyWiseCallingReportDashletHTML .panel-loader").hide();
            $("#agencyWiseCallingReportDashletHTML .panel-heading").removeClass("pvBlur");
            table_fix_head();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (pageNumber == 1 && category === '') {
                    $("#agencyWiseCallingReportTableContainer").html("");
                }
                if (typeof responseObject.data === "object" && category === '') {
                    var dashletData = responseObject.data;
                    if (typeof dashletData.tableHtml === "undefined") {
                        return;
                    }
                    $("#agencyWiseCallingDownloadButton").show();
                    if (typeof dashletData.hideDownload !== "undefined" && dashletData.hideDownload == 1) {
                        $("#agencyWiseCallingDownloadButton").hide();
                    }
                    $("#agencyWiseCallingReportTableContainer").html(dashletData.tableHtml);
                    $('#agencyWiseCallingReportDateRange').html(dashletData.defaultDateText);
                    //Show Total Sum Data in last row
                    if ((typeof responseObject.data === "object") && (typeof responseObject.data.totalRow === "object")) {
                        var totalRow = responseObject.data.totalRow;
                        for (var type in totalRow) {
                            var rowCount = managePublisherWiseTotalRowData(type, totalRow[type]);
                            $('tfoot tr#agencyWiseFooters th#' + type + 'Footer').html(rowCount);
                        }
                    }
                } else {
                    if (typeof responseObject.agencyWiseCallingData === "object") {
                        var innerData = {};
                        var parent = 'category';
                        if (typeof responseObject.agencyWiseCallingData.publisherData !== 'undefined') {
                            innerData = responseObject.agencyWiseCallingData.publisherData;
                        } else if (typeof responseObject.agencyWiseCallingData.monthlyData !== 'undefined') {
                            innerData = responseObject.agencyWiseCallingData.monthlyData;
                            parent = 'publisher';
                        } else if (typeof responseObject.agencyWiseCallingData.dailyData !== 'undefined') {
                            innerData = responseObject.agencyWiseCallingData.dailyData;
                            parent = 'monthYear';
                        }
                        loadInnerHtmlData(innerData, parent, category, publisher, monthYear);
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

function managePublisherWiseTotalRowData(type, count) {
    var obj = $('tfoot tr#agencyWiseFooters th#' + type + 'Footer');
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
            var tried = $('tfoot tr#agencyWiseFooters th#triedFooter').html();
            var dialableLeads = $('tfoot tr#agencyWiseFooters th#dialableLeadsFooter').html();
            if ((parseInt(tried) > 0) && (parseInt(dialableLeads) > 0)) {
                newCount = ((tried / dialableLeads) * 100);
                newCount = newCount.toFixed(2) + '%';
            }
            break;
        case 'connectedPercentage':
            newCount = newCount + '%';
            var tried = $('tfoot tr#agencyWiseFooters th#triedFooter').html();
            var connected = $('tfoot tr#agencyWiseFooters th#connectedFooter').html();
            if ((parseInt(tried) > 0) && (parseInt(connected) > 0)) {
                newCount = ((connected / tried) * 100);
                newCount = newCount.toFixed(2) + '%';
            }
            break;
        case 'interestedPercentage':
            newCount = newCount + '%';
            var interested = $('tfoot tr#agencyWiseFooters th#interestedFooter').html();
            var connected = $('tfoot tr#agencyWiseFooters th#connectedFooter').html();
            if ((parseInt(interested) > 0) && (parseInt(connected) > 0)) {
                newCount = ((interested / connected) * 100);
                newCount = newCount.toFixed(2) + '%';
            }
            break;
        case 'notInterestedPercentage':
            newCount = newCount + '%';
            var notInterested = $('tfoot tr#agencyWiseFooters th#notInterestedFooter').html();
            var connected = $('tfoot tr#agencyWiseFooters th#connectedFooter').html();
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

function loadInnerHtmlData(innerData, parent, category, publisher, monthYear) {
    var tableRows = '';
    var colspanClass = 1;
    var triedClass = '';
    var connectedClass = '';
    var interestedClass = '';
    $.each(innerData, function (stgeId, stges) {
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
            if (parent === 'category') {
                tableRows += '<tr class="parent_category' + category + '" id="parent_category' + category + '_publisher' + stges._id + '">';
                tableRows += '<td class="text-left colGroup' + colspanClassCount + ' column_' + colspanClassCount + '">';
                tableRows += '<div class="lcnDataArrow">';
                tableRows += '  ' + stges.name;
                tableRows += '  <a class="arwAbsRight appendChild hideSpecialisation" role="button" data-toggle="collapse" href="javascript:void(0)"';
                tableRows += '  aria-expanded="false" id="Category' + category + 'PublisherLink' + stges._id + '" onclick="javascript:getPublisherWiseCallingData(\'' + category + '\', \'' + stges._id + '\', \'1\')">';
                tableRows += '    <i class="fa fa-angle-down font16" aria-hidden="true"></i>';
                tableRows += '  </a>';
                tableRows += '</div>';
                tableRows += '</td>';
            } else if (parent === 'publisher') {
                var monthYearInner = '' + d.getFullYear() + '-' + (d.getMonth() + 1) + '';
                tableRows += '<tr class="parent_category' + category + '_publisher' + publisher + '" id="parent_category' + category + '_publisher' + publisher + '_month' + monthYearInner + '">';
                tableRows += '<td class="colGroup' + colspanClassCount + ' column_' + colspanClassCount + '">';
                tableRows += '<div class="lcnDataArrow">';
                tableRows += '  ' + stges.name;
                tableRows += '  <a class="arwAbsRight appendChild hideSpecialisation" role="button" data-toggle="collapse" href="javascript:void(0)"';
                tableRows += '  aria-expanded="false" id="Category' + category + 'Publisher' + publisher + 'MonthLink' + monthYearInner + '" onclick="javascript:getMonthWiseCallingData(\'' + category + '\',\'' + publisher + '\', \'' + monthYearInner + '\', \'1\')">';
                tableRows += '    <i class="fa fa-angle-down font16" aria-hidden="true"></i>';
                tableRows += '  </a>';
                tableRows += '</div>';
                tableRows += '</td>';
            } else if (parent === 'monthYear') {
                tableRows += '<tr class="parent_category' + category + '_publisher' + publisher + '_month' + monthYear + '" id="parent_category' + category + '_publisher' + publisher + '_month' + monthYear + '">';
                tableRows += '<td class="colGroup' + colspanClassCount + ' column_' + colspanClassCount + '">' + stges.name + '</td>';
            }

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

    if (parent === 'category') {
        $(tableRows).insertAfter($('#agencyWiseCallingReport_Category' + category));
    } else if (parent === 'publisher') {
        $(tableRows).insertAfter($('#parent_category' + category + '_publisher' + publisher));
    } else if (parent === 'monthYear') {
        $(tableRows).insertAfter($('#parent_category' + category + '_publisher' + publisher + '_month' + monthYear));
    }
}

function agencyWiseCallingReportDownloadCSV() {
    $("#agencyWiseCallingCollegeId").val($("#collegeId").val());
    var filters = $("#agencyWiseCallingReportFilterForm").serializeArray();
    $.ajax({
        url: jsVars.agencyWiseCallingReportDownloadUrl,
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
    $("#agencyWiseCallingDayData_" + key).css("display", "block");
}

function getMonthWiseCallingData(category, publisher, monthYear, pageNumber) {
    if ($('#Category' + category + 'Publisher' + publisher + 'MonthLink' + monthYear).hasClass('hideSpecialisation')) {
        createAgencyWiseCallingReport(pageNumber, category, publisher, monthYear);
    } else {
        $('.parent_category' + category + '_publisher' + publisher + '_month' + monthYear).remove();
    }
    $('#Category' + category + 'Publisher' + publisher + 'MonthLink' + monthYear).toggleClass('hideSpecialisation');
}

function getPublisherWiseCallingData(category, publisher, pageNumber) {
    if ($('#Category' + category + 'PublisherLink' + publisher).hasClass('hideSpecialisation')) {
        createAgencyWiseCallingReport(pageNumber, category, publisher);
    } else {
        $('tr.parent_category' + category + '_publisher' + publisher).remove();
        $("tr[class*= 'parent_category" + category + "_publisher" + publisher + "']").remove();
    }
    $('#Category' + category + 'PublisherLink' + publisher).toggleClass('hideSpecialisation');
}

function getCategoryWiseCallingData(category, pageNumber) {
    if ($('#CategoryLink' + category).hasClass('hideSpecialisation')) {
        createAgencyWiseCallingReport(pageNumber, category);
    } else {
        $('tr.parent_category' + category).remove();
        $("tr[class*= 'parent_category" + category + "']").remove();
    }
    $('#CategoryLink' + category).toggleClass('hideSpecialisation');
}

function customDropdownAgencyWiseCalling() {
    if ($('form#agencyWiseCallingReportFilterForm .cdropdown').hasClass('open')) {
        $("form#agencyWiseCallingReportFilterForm .cdropdown").removeClass("open");
    } else {
        $("form#agencyWiseCallingReportFilterForm .cdropdown").addClass("open");
    }
    $(document).click(function (event) {
        if (!($(event.target).closest(".cdropdown").length)) {
            $("form#agencyWiseCallingReportFilterForm .cdropdown").removeClass("open");
        }
    });
}