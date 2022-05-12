/*************************For My View Start Here*********************/
var initilizeTopStateReport = function () {
    
    //For My View Section
    $("#StateReportMyViewFilters").find(".applyTrafficDashboardDates").on('click', function (e) 
    {
        createTopStatesData();
        $("#StateReportMyViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    //Unset Date value
    $("#StateReportMyViewFilters").find(".cancelDates").on('click', function (e) 
    {
        createTopStatesData();
        $("#StateReportMyViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    
    createTopStatesData();
};

var createTopStatesData = function () {
    $('#StateWiseReportHTML .panel-loader').show();
    var postData = $("#dashboardForm").serializeArray();
    postData.push({name:"reportType",value:'getTopStatesReport'});
    
    if($("#StateReportMyViewFilters").find('.inputBaseStartDate').val() != '' && $("#StateReportMyViewFilters").find('.inputBaseEndDate').val() != '') {
        postData.push({name:"startDate",value:$("#StateReportMyViewFilters").find('.inputBaseStartDate').val()});
        postData.push({name:"endDate",value:$("#StateReportMyViewFilters").find('.inputBaseEndDate').val()}); 
    }
    
    $.ajax({
        url: jsVars.ReportURL,
        type: 'post',
        data: postData,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
            $('#StateWiseReportHTML .panel-loader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.topStatesReport === "object") {
                    updateTopStatesTableData(responseObject.topStatesReport);
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    $('#TopStateReportId').html(responseObject.message);
                }
            }
			table_fix_head();
            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

};

function updateTopStatesTableData(stateData) 
{
    if(typeof stateData.topStatesData !== 'undefined') {
        mappingObj = stateData.mappingList;
        var finalHtml = '';
        var finalHeadingHtml = '<tr>';
        $.each(stateData.topStatesData.dimensionResult, function (parentKey, ParentValue) {
            $.each(ParentValue, function (DimensionKey, DimensionValue) {            
                if(DimensionKey == 0) {
                    if(typeof mappingObj[parentKey] !== 'undefined' && typeof mappingObj[parentKey]['label'] !== 'undefined') {
                        finalHeadingHtml += '<th class="text-left">'+mappingObj[parentKey]['label']+'</th>';
                    } else {
                        finalHeadingHtml += '<th class="text-left">'+parentKey+'</th>';
                    }
                }
                finalHtml +='<tr><td class="text-left">'+DimensionValue+'</td>';
                $.each(stateData.topStatesData.metricsResult, function (MetricsKey, MetricsValue) { 

                    //For value
                    if(typeof mappingObj[MetricsKey] !== 'undefined' && typeof mappingObj[MetricsKey].decimalPoint !== 'undefined') {                    
                        finalHtml +='<td class="text-center">'+parseFloat(MetricsValue[DimensionKey]).toFixed(parseInt(mappingObj[MetricsKey].decimalPoint))+'</td>';
                    } else {
                        finalHtml +='<td class="text-center">'+MetricsValue[DimensionKey]+'</td>';
                    }

                    //For Label
                    if(DimensionKey == 0) {                    
                        if(typeof mappingObj[MetricsKey] !== 'undefined' && typeof mappingObj[MetricsKey]['label'] !== 'undefined') {
                            finalHeadingHtml += '<th class="text-center">'+mappingObj[MetricsKey]['label']+'</th>';
                        } else {
                            finalHeadingHtml += '<th class="text-center">'+MetricsKey+'</th>';
                        }
                    }
                });
                finalHtml +='</tr>';
            });
        });
        $('#TopStateReportId').html('<table class="table table-hover"><thead>'+finalHeadingHtml+'</thead><tbody>'+finalHtml+'</tbody></table>');
        var dateRangeHtml = "(" + stateData.startDate + " to " + stateData.endDate + ")";    
        $("#StateWise_dateRange").html(dateRangeHtml);
    } else {
        $('#TopStateReportId').html('There is some error.');
    }
}

/*************************For My View End Here*********************/

/*************************For Shared View Start Here*********************/
var initilizeTopStateSharedReport = function () {
    
    //For Shared View Section
    $("#StateReportSharedViewFilters").find(".applyTrafficDashboardDates").on('click', function (e) 
    {
        createTopStatesSharedViewData();
        $("#StateReportSharedViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    //Unset Date value
    $("#StateReportSharedViewFilters").find(".cancelDates").on('click', function (e) 
    {
        createTopStatesSharedViewData();
        $("#StateReportSharedViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    
    createTopStatesSharedViewData();
};

var createTopStatesSharedViewData = function () {
    $('#StateWiseSharedViewReportHTML .panel-loader').show();
    var postData = $("#dashboardForm").serializeArray();
    postData.push({name:"reportType",value:'getTopStatesReport'});
    
    if($("#StateReportSharedViewFilters").find('.inputBaseStartDate').val() != '' && $("#StateReportSharedViewFilters").find('.inputBaseEndDate').val() != '') {
        postData.push({name:"startDate",value:$("#StateReportSharedViewFilters").find('.inputBaseStartDate').val()});
        postData.push({name:"endDate",value:$("#StateReportSharedViewFilters").find('.inputBaseEndDate').val()}); 
    }
    
    $.ajax({
        url: jsVars.ReportURL,
        type: 'post',
        data: postData,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
            $('#StateWiseSharedViewReportHTML .panel-loader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.topStatesReport === "object") {
                    updateTopStatesSharedViewTableData(responseObject.topStatesReport);
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    $('#TopStateSharedViewReportId').html(responseObject.message);
                }
            }
			table_fix_head();
            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

};

function updateTopStatesSharedViewTableData(stateData) 
{   
    if(typeof stateData.topStatesData !== 'undefined') {
        mappingObj = stateData.mappingList;
        var finalHtml = '';
        var finalHeadingHtml = '<tr>';
        $.each(stateData.topStatesData.dimensionResult, function (parentKey, ParentValue) {
            $.each(ParentValue, function (DimensionKey, DimensionValue) {            
                if(DimensionKey == 0) {
                    if(typeof mappingObj[parentKey] !== 'undefined' && typeof mappingObj[parentKey]['label'] !== 'undefined') {
                        finalHeadingHtml += '<th class="text-left">'+mappingObj[parentKey]['label']+'</th>';
                    } else {
                        finalHeadingHtml += '<th class="text-left">'+parentKey+'</th>';
                    }
                }
                finalHtml +='<tr><td class="text-left">'+DimensionValue+'</td>';
                $.each(stateData.topStatesData.metricsResult, function (MetricsKey, MetricsValue) { 

                    //For value
                    if(typeof mappingObj[MetricsKey] !== 'undefined' && typeof mappingObj[MetricsKey].decimalPoint !== 'undefined') {
                        finalHtml +='<td class="text-center">'+parseFloat(MetricsValue[DimensionKey]).toFixed(parseInt(mappingObj[MetricsKey].decimalPoint))+'</td>';
                    } else {
                        finalHtml +='<td class="text-center">'+MetricsValue[DimensionKey]+'</td>';
                    }

                    //For Label
                    if(DimensionKey == 0) {                    
                        if(typeof mappingObj[MetricsKey] !== 'undefined' && typeof mappingObj[MetricsKey]['label'] !== 'undefined') {
                            finalHeadingHtml += '<th class="text-center">'+mappingObj[MetricsKey]['label']+'</th>';
                        } else {
                            finalHeadingHtml += '<th class="text-center">'+MetricsKey+'</th>';
                        }
                    }
                });
                finalHtml +='</tr>';
            });
        });
        $('#TopStateSharedViewReportId').html('<table class="table table-hover"><thead>'+finalHeadingHtml+'</thead><tbody>'+finalHtml+'</tbody></table>');
        var dateRangeHtml = "(" + stateData.startDate + " to " + stateData.endDate + ")";    
        $("#StateWiseSharedView_dateRange").html(dateRangeHtml);  
    } else {
        $('#TopStateSharedViewReportId').html('There is some error.');
    }
}

/*************************For My View End Here*********************/