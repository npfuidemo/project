/*******************My View Code Start Here *************/
var initilizeTopDeviceCategoryReport = function () {
    
    //For My View Section
    $("#DeviceCategoryReportMyViewFilters").find(".applyTrafficDashboardDates").on('click', function (e) 
    {
        createTopDeviceCategoryData();
        $("#DeviceCategoryReportMyViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    //Unset Date value
    $("#DeviceCategoryReportMyViewFilters").find(".cancelDates").on('click', function (e) 
    {
        createTopDeviceCategoryData();
        $("#DeviceCategoryReportMyViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    
    createTopDeviceCategoryData();
};

var createTopDeviceCategoryData = function () {
    $('#DeviceCategoryWiseReportHTML .panel-loader').show();
    var postData = $("#dashboardForm").serializeArray();
    postData.push({name:"reportType",value:'getTopDeviceCategoryReport'});
    
    if($("#DeviceCategoryReportMyViewFilters").find('.inputBaseStartDate').val() != '' && $("#DeviceCategoryReportMyViewFilters").find('.inputBaseEndDate').val() != '') {
        postData.push({name:"startDate",value:$("#DeviceCategoryReportMyViewFilters").find('.inputBaseStartDate').val()});
        postData.push({name:"endDate",value:$("#DeviceCategoryReportMyViewFilters").find('.inputBaseEndDate').val()}); 
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
            $('#DeviceCategoryWiseReportHTML .panel-loader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.TopDeviceCategoryReport === "object") {
                    updateTopDeviceCategorysTableData(responseObject.TopDeviceCategoryReport);
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    $('#TopDeviceCategoryReportId').html(responseObject.message);
                }
            }
            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

};

function updateTopDeviceCategorysTableData(DeviceCategoryData) 
{
    
    if(typeof DeviceCategoryData.topDeviceCategoryData !== 'undefined') {
        
    mappingObj = DeviceCategoryData.mappingList;
    var finalHtml = '';
    var finalHeadingHtml = '<tr>';
    $.each(DeviceCategoryData.topDeviceCategoryData.dimensionResult, function (parentKey, ParentValue) {
        $.each(ParentValue, function (DimensionKey, DimensionValue) {            
            if(DimensionKey == 0) {
                if(typeof mappingObj[parentKey] !== 'undefined' && typeof mappingObj[parentKey]['label'] !== 'undefined') {
                    finalHeadingHtml += '<th class="text-left">'+mappingObj[parentKey]['label']+'</th>';
                } else {
                    finalHeadingHtml += '<th class="text-left">'+parentKey+'</th>';
                }
            }
            finalHtml +='<tr><td class="text-left">'+DimensionValue+'</td>';
            $.each(DeviceCategoryData.topDeviceCategoryData.metricsResult, function (MetricsKey, MetricsValue) { 
                
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
    $('#TopDeviceCategoryReportId').html('<table class="table table-hover"><thead>'+finalHeadingHtml+'</thead><tbody>'+finalHtml+'</tbody></table>');
    var dateRangeHtml = "(" + DeviceCategoryData.startDate + " to " + DeviceCategoryData.endDate + ")";    
    $("#DeviceCategoryWise_dateRange").html(dateRangeHtml);  
    } else {
        $('#TopDeviceCategoryReportId').html('There is some error.');
    }
}

/*******************My View Code End Here *************/

/*******************Shared View Code Start Here *************/
var initilizeTopDeviceCategorySharedViewReport = function () {
    
    //For My View Section
    $("#DeviceCategoryReportSharedViewFilters").find(".applyTrafficDashboardDates").on('click', function (e) 
    {
        createTopDeviceCategorySharedViewData();
        $("#DeviceCategoryReportSharedViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    //Unset Date value
    $("#DeviceCategoryReportSharedViewFilters").find(".cancelDates").on('click', function (e) 
    {
        createTopDeviceCategorySharedViewData();
        $("#DeviceCategoryReportSharedViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    
    createTopDeviceCategorySharedViewData();
};

var createTopDeviceCategorySharedViewData = function () {
    $('#DeviceCategoryWiseSharedViewReportHTML .panel-loader').show();
    var postData = $("#dashboardForm").serializeArray();
    postData.push({name:"reportType",value:'getTopDeviceCategoryReport'});
    
    if($("#DeviceCategoryReportSharedViewFilters").find('.inputBaseStartDate').val() != '' && $("#DeviceCategoryReportSharedViewFilters").find('.inputBaseEndDate').val() != '') {
        postData.push({name:"startDate",value:$("#DeviceCategoryReportSharedViewFilters").find('.inputBaseStartDate').val()});
        postData.push({name:"endDate",value:$("#DeviceCategoryReportSharedViewFilters").find('.inputBaseEndDate').val()}); 
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
            $('#DeviceCategoryWiseSharedViewReportHTML .panel-loader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.TopDeviceCategoryReport === "object") {
                    updateTopDeviceCategorySharedViewTableData(responseObject.TopDeviceCategoryReport);
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    $('#TopDeviceCategorySharedViewReportId').html(responseObject.message);
                }
            }
            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

};

function updateTopDeviceCategorySharedViewTableData(DeviceCategoryData) 
{
    
    if(typeof DeviceCategoryData.topDeviceCategoryData !== 'undefined') {
        
    mappingObj = DeviceCategoryData.mappingList;
    var finalHtml = '';
    var finalHeadingHtml = '<tr>';
    $.each(DeviceCategoryData.topDeviceCategoryData.dimensionResult, function (parentKey, ParentValue) {
        $.each(ParentValue, function (DimensionKey, DimensionValue) {            
            if(DimensionKey == 0) {
                if(typeof mappingObj[parentKey] !== 'undefined' && typeof mappingObj[parentKey]['label'] !== 'undefined') {
                    finalHeadingHtml += '<th class="text-left">'+mappingObj[parentKey]['label']+'</th>';
                } else {
                    finalHeadingHtml += '<th class="text-left">'+parentKey+'</th>';
                }
            }
            finalHtml +='<tr><td class="text-left">'+DimensionValue+'</td>';
            $.each(DeviceCategoryData.topDeviceCategoryData.metricsResult, function (MetricsKey, MetricsValue) { 
                
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
    $('#TopDeviceCategorySharedViewReportId').html('<table class="table table-hover"><thead>'+finalHeadingHtml+'</thead><tbody>'+finalHtml+'</tbody></table>');
    var dateRangeHtml = "(" + DeviceCategoryData.startDate + " to " + DeviceCategoryData.endDate + ")";    
    $("#DeviceCategoryWiseSharedView_dateRange").html(dateRangeHtml);  
    } else {
        $('#TopDeviceCategorySharedViewReportId').html('There is some error.');
    }
}

/*******************Shared View Code End Here *************/

