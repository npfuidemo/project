/****************For My View Code Start Here *******************/
var initilizeGoogleAdsSearchQueryReport = function () {
    
    //For My View Section
    $("#GoogleAdsSearchQueryReportMyViewFilters").find(".applyTrafficDashboardDates").on('click', function (e) 
    {
        createGoogleAdsSearchQueryData();
        $("#GoogleAdsSearchQueryReportMyViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    //Unset Date value
    $("#GoogleAdsSearchQueryReportMyViewFilters").find(".cancelDates").on('click', function (e) 
    {
        createGoogleAdsSearchQueryData();
        $("#GoogleAdsSearchQueryReportMyViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    
    createGoogleAdsSearchQueryData();
};

var createGoogleAdsSearchQueryData = function () {
    $('#GoogleAdsSearchQueryWiseReportHTML .panel-loader').show();
    var postData = $("#dashboardForm").serializeArray();
    postData.push({name:"reportType",value:'getGoogleAdsSearchQueryReport'});
    
    if($("#GoogleAdsSearchQueryMyViewFilters").find('.inputBaseStartDate').val() != '' && $("#GoogleAdsCampaignReportMyViewFilters").find('.inputBaseEndDate').val() != '') {
        postData.push({name:"startDate",value:$("#GoogleAdsSearchQueryReportMyViewFilters").find('.inputBaseStartDate').val()});
        postData.push({name:"endDate",value:$("#GoogleAdsSearchQueryReportMyViewFilters").find('.inputBaseEndDate').val()}); 
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
            $('#GoogleAdsSearchQueryWiseReportHTML .panel-loader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.GoogleAdsSearchQueryReport === "object") {
                    updateGoogleAdsSearchQueryTableData(responseObject.GoogleAdsSearchQueryReport);
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    $('#TopGoogleAdsSearchQueryReportId').html(responseObject.message);
                }
            }
            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

};

function updateGoogleAdsSearchQueryTableData(GoogleAdsSearchData) 
{
    
    if(typeof GoogleAdsSearchData.GoogleAdsSearchQueryData !== 'undefined') {
        
    mappingObj = GoogleAdsSearchData.mappingList;
    var finalHtml = '';
    var finalHeadingHtml = '<tr>';
    $.each(GoogleAdsSearchData.GoogleAdsSearchQueryData.dimensionResult, function (parentKey, ParentValue) {
        $.each(ParentValue, function (DimensionKey, DimensionValue) {            
            if(DimensionKey == 0) {
                if(typeof mappingObj[parentKey] !== 'undefined' && typeof mappingObj[parentKey]['label'] !== 'undefined') {
                    finalHeadingHtml += '<th class="text-left">'+mappingObj[parentKey]['label']+'</th>';
                } else {
                    finalHeadingHtml += '<th class="text-left">'+parentKey+'</th>';
                }
            }
            finalHtml +='<tr><td class="text-left">'+DimensionValue+'</td>';
            $.each(GoogleAdsSearchData.GoogleAdsSearchQueryData.metricsResult, function (MetricsKey, MetricsValue) { 
                
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
    $('#TopGoogleAdsSearchQueryReportId').html('<table class="table table-hover"><thead>'+finalHeadingHtml+'</thead><tbody>'+finalHtml+'</tbody></table>');
    var dateRangeHtml = "(" + GoogleAdsSearchData.startDate + " to " + GoogleAdsSearchData.endDate + ")";    
    $("#GoogleAdsSearchQueryWise_dateRange").html(dateRangeHtml);  
    } else {
        $('#TopGoogleAdsSearchQueryReportId').html('There is some error.');
    }
}

/****************For My View Code End Here *******************/

/****************For Shared View Code Start Here *******************/
var initilizeGoogleAdsSearchQuerySharedViewReport = function () {
    
    //For My View Section
    $("#GoogleAdsSearchQueryReportSharedViewFilters").find(".applyTrafficDashboardDates").on('click', function (e) 
    {
        createGoogleAdsSearchQuerySharedViewData();
        $("#GoogleAdsSearchQueryReportSharedViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    //Unset Date value
    $("#GoogleAdsSearchQueryReportSharedViewFilters").find(".cancelDates").on('click', function (e) 
    {
        createGoogleAdsSearchQuerySharedViewData();
        $("#GoogleAdsSearchQueryReportSharedViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    
    createGoogleAdsSearchQuerySharedViewData();
};

var createGoogleAdsSearchQuerySharedViewData = function () {
    $('#GoogleAdsSearchQueryWiseSharedViewReportHTML .panel-loader').show();
    var postData = $("#dashboardForm").serializeArray();
    postData.push({name:"reportType",value:'getGoogleAdsSearchQueryReport'});
    
    if($("#GoogleAdsSearchQueryReportSharedViewFilters").find('.inputBaseStartDate').val() != '' && $("#GoogleAdsSearchQueryReportSharedViewFilters").find('.inputBaseEndDate').val() != '') {
        postData.push({name:"startDate",value:$("#GoogleAdsSearchQueryReportSharedViewFilters").find('.inputBaseStartDate').val()});
        postData.push({name:"endDate",value:$("#GoogleAdsSearchQueryReportSharedViewFilters").find('.inputBaseEndDate').val()}); 
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
            $('#GoogleAdsSearchQueryWiseSharedViewReportHTML .panel-loader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.GoogleAdsSearchQueryReport === "object") {
                    updateGoogleAdsSearchQuerySharedViewTableData(responseObject.GoogleAdsSearchQueryReport);
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    $('#TopGoogleAdsSearchQuerySharedViewReportId').html(responseObject.message);
                }
            }
            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

};

function updateGoogleAdsSearchQuerySharedViewTableData(GoogleAdsSearchData) 
{
    
    if(typeof GoogleAdsSearchData.GoogleAdsSearchQueryData !== 'undefined') {
        
    mappingObj = GoogleAdsSearchData.mappingList;
    var finalHtml = '';
    var finalHeadingHtml = '<tr>';
    $.each(GoogleAdsSearchData.GoogleAdsSearchQueryData.dimensionResult, function (parentKey, ParentValue) {
        $.each(ParentValue, function (DimensionKey, DimensionValue) {            
            if(DimensionKey == 0) {
                if(typeof mappingObj[parentKey] !== 'undefined' && typeof mappingObj[parentKey]['label'] !== 'undefined') {
                    finalHeadingHtml += '<th class="text-left">'+mappingObj[parentKey]['label']+'</th>';
                } else {
                    finalHeadingHtml += '<th class="text-left">'+parentKey+'</th>';
                }
            }
            finalHtml +='<tr><td class="text-left">'+DimensionValue+'</td>';
            $.each(GoogleAdsSearchData.GoogleAdsSearchQueryData.metricsResult, function (MetricsKey, MetricsValue) { 
                
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
    $('#TopGoogleAdsSearchQuerySharedViewReportId').html('<table class="table table-hover"><thead>'+finalHeadingHtml+'</thead><tbody>'+finalHtml+'</tbody></table>');
    var dateRangeHtml = "(" + GoogleAdsSearchData.startDate + " to " + GoogleAdsSearchData.endDate + ")";    
    $("#GoogleAdsSearchQueryWiseSharedView_dateRange").html(dateRangeHtml);  
    } else {
        $('#TopGoogleAdsSearchQuerySharedViewReportId').html('There is some error.');
    }
}

/****************For Shared View Code End Here *******************/

