var initilizeGoogleAdsAdGroupReport = function () {
    
    //For My View Section
    $("#GoogleAdsAdGroupReportMyViewFilters").find(".applyTrafficDashboardDates").on('click', function (e) 
    {
        createGoogleAdsAdGroupData();
        $("#GoogleAdsAdGroupReportMyViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    //Unset Date value
    $("#GoogleAdsAdGroupReportMyViewFilters").find(".cancelDates").on('click', function (e) 
    {
        createGoogleAdsAdGroupData();
        $("#GoogleAdsAdGroupReportMyViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    
    createGoogleAdsAdGroupData();
};

var createGoogleAdsAdGroupData = function () {
    $('#GoogleAdsAdGroupWiseReportHTML .panel-loader').show();
    var postData = $("#dashboardForm").serializeArray();
    postData.push({name:"reportType",value:'getGoogleAdsAdGroupReport'});
    
    if($("#GoogleAdsAdGroupReportMyViewFilters").find('.inputBaseStartDate').val() != '' && $("#GoogleAdsAdGroupReportMyViewFilters").find('.inputBaseEndDate').val() != '') {
        postData.push({name:"startDate",value:$("#GoogleAdsAdGroupReportMyViewFilters").find('.inputBaseStartDate').val()});
        postData.push({name:"endDate",value:$("#GoogleAdsAdGroupReportMyViewFilters").find('.inputBaseEndDate').val()}); 
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
            $('#GoogleAdsAdGroupWiseReportHTML .panel-loader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.GoogleAdsAdGroupReport === "object") {
                    updateGoogleAdsAdGroupTableData(responseObject.GoogleAdsAdGroupReport);
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    $('#TopGoogleAdsAdGroupReportId').html(responseObject.message);
                }
            }
            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

};

function updateGoogleAdsAdGroupTableData(GoogleAdGroupData) 
{
    
    if(typeof GoogleAdGroupData.GoogleAdsAdGroupData !== 'undefined') {
        
    mappingObj = GoogleAdGroupData.mappingList;
    var finalHtml = '';
    var finalHeadingHtml = '<tr>';
    $.each(GoogleAdGroupData.GoogleAdsAdGroupData.dimensionResult, function (parentKey, ParentValue) {
        $.each(ParentValue, function (DimensionKey, DimensionValue) {            
            if(DimensionKey == 0) {
                if(typeof mappingObj[parentKey] !== 'undefined' && typeof mappingObj[parentKey]['label'] !== 'undefined') {
                    finalHeadingHtml += '<th class="text-left">'+mappingObj[parentKey]['label']+'</th>';
                } else {
                    finalHeadingHtml += '<th class="text-left">'+parentKey+'</th>';
                }
            }
            finalHtml +='<tr><td class="text-left">'+DimensionValue+'</td>';
            $.each(GoogleAdGroupData.GoogleAdsAdGroupData.metricsResult, function (MetricsKey, MetricsValue) { 
                
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
    $('#TopGoogleAdsAdGroupReportId').html('<table class="table table-hover"><thead>'+finalHeadingHtml+'</thead><tbody>'+finalHtml+'</tbody></table>');
    var dateRangeHtml = "(" + GoogleAdGroupData.startDate + " to " + GoogleAdGroupData.endDate + ")";    
    $("#GoogleAdsAdGroupWise_dateRange").html(dateRangeHtml);  
    } else {
        $('#TopGoogleAdsAdGroupReportId').html('There is some error.');
    }
}


var initilizeGoogleAdsAdGroupSharedViewReport = function () {
    
    //For My View Section
    $("#GoogleAdsAdGroupReportSharedViewFilters").find(".applyTrafficDashboardDates").on('click', function (e) 
    {
        createGoogleAdsAdGroupSharedViewData();
        $("#GoogleAdsAdGroupReportSharedViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    //Unset Date value
    $("#GoogleAdsAdGroupReportSharedViewFilters").find(".cancelDates").on('click', function (e) 
    {
        createGoogleAdsAdGroupSharedViewData();
        $("#GoogleAdsAdGroupReportSharedViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    
    createGoogleAdsAdGroupSharedViewData();
};

var createGoogleAdsAdGroupSharedViewData = function () {
    $('#GoogleAdsAdGroupWiseSharedViewReportHTML .panel-loader').show();
    var postData = $("#dashboardForm").serializeArray();
    postData.push({name:"reportType",value:'getGoogleAdsAdGroupReport'});
    
    if($("#GoogleAdsAdGroupReportSharedViewFilters").find('.inputBaseStartDate').val() != '' && $("#GoogleAdsAdGroupReportSharedViewFilters").find('.inputBaseEndDate').val() != '') {
        postData.push({name:"startDate",value:$("#GoogleAdsAdGroupReportSharedViewFilters").find('.inputBaseStartDate').val()});
        postData.push({name:"endDate",value:$("#GoogleAdsAdGroupReportSharedViewFilters").find('.inputBaseEndDate').val()}); 
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
            $('#GoogleAdsAdGroupWiseSharedViewReportHTML .panel-loader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.GoogleAdsAdGroupReport === "object") {
                    updateGoogleAdsAdGroupSharedViewTableData(responseObject.GoogleAdsAdGroupReport);
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    $('#TopGoogleAdsAdGroupSharedViewReportId').html(responseObject.message);
                }
            }
            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

};

function updateGoogleAdsAdGroupSharedViewTableData(GoogleAdGroupData) 
{
    
    if(typeof GoogleAdGroupData.GoogleAdsAdGroupData !== 'undefined') {
        
    mappingObj = GoogleAdGroupData.mappingList;
    var finalHtml = '';
    var finalHeadingHtml = '<tr>';
    $.each(GoogleAdGroupData.GoogleAdsAdGroupData.dimensionResult, function (parentKey, ParentValue) {
        $.each(ParentValue, function (DimensionKey, DimensionValue) {            
            if(DimensionKey == 0) {
                if(typeof mappingObj[parentKey] !== 'undefined' && typeof mappingObj[parentKey]['label'] !== 'undefined') {
                    finalHeadingHtml += '<th class="text-left">'+mappingObj[parentKey]['label']+'</th>';
                } else {
                    finalHeadingHtml += '<th class="text-left">'+parentKey+'</th>';
                }
            }
            finalHtml +='<tr><td class="text-left">'+DimensionValue+'</td>';
            $.each(GoogleAdGroupData.GoogleAdsAdGroupData.metricsResult, function (MetricsKey, MetricsValue) { 
                
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
    $('#TopGoogleAdsAdGroupSharedViewReportId').html('<table class="table table-hover"><thead>'+finalHeadingHtml+'</thead><tbody>'+finalHtml+'</tbody></table>');
    var dateRangeHtml = "(" + GoogleAdGroupData.startDate + " to " + GoogleAdGroupData.endDate + ")";    
    $("#GoogleAdsAdGroupWiseSharedView_dateRange").html(dateRangeHtml);  
    } else {
        $('#TopGoogleAdsAdGroupSharedViewReportId').html('There is some error.');
    }
}


