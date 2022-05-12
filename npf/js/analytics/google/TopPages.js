/**************** My View Code Start Here ***********/
var initilizeTopPagesReport = function () {
    
    //For My View Section
    $("#PageReportMyViewFilters").find(".applyTrafficDashboardDates").on('click', function (e) 
    {
        createTopPagesData();
        $("#PageReportMyViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    //Unset Date value
    $("#PageReportMyViewFilters").find(".cancelDates").on('click', function (e) 
    {
        createTopPagesData();
        $("#PageReportMyViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    
    createTopPagesData();
};

var createTopPagesData = function () {
    $('#PageWiseReportHTML .panel-loader').show();
    var postData = $("#dashboardForm").serializeArray();
    postData.push({name:"reportType",value:'getPagesReport'});
    
    if($("#PageReportMyViewFilters").find('.inputBaseStartDate').val() != '' && $("#PageReportMyViewFilters").find('.inputBaseEndDate').val() != '') {
        postData.push({name:"startDate",value:$("#PageReportMyViewFilters").find('.inputBaseStartDate').val()});
        postData.push({name:"endDate",value:$("#PageReportMyViewFilters").find('.inputBaseEndDate').val()}); 
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
            $('#PageWiseReportHTML .panel-loader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.PageReport === "object") {
                    updateTopPagesTableData(responseObject.PageReport);
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    $('#TopPageReportId').html(responseObject.message);
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

function updateTopPagesTableData(PageData) 
{
    
    if(typeof PageData.TopPagesData !== 'undefined') {
        
    mappingObj = PageData.mappingList;
    var finalHtml = '';
    var finalHeadingHtml = '<tr>';
    $.each(PageData.TopPagesData.dimensionResult, function (parentKey, ParentValue) {
        $.each(ParentValue, function (DimensionKey, DimensionValue) {            
            if(DimensionKey == 0) {
                if(typeof mappingObj[parentKey] !== 'undefined' && typeof mappingObj[parentKey]['label'] !== 'undefined') {
                    finalHeadingHtml += '<th class="text-left">'+mappingObj[parentKey]['label']+'</th>';
                } else {
                    finalHeadingHtml += '<th class="text-left">'+parentKey+'</th>';
                }
            }
            finalHtml +='<tr><td class="text-left"><span class="mw-400">'+DimensionValue+'</span></td>';
            $.each(PageData.TopPagesData.metricsResult, function (MetricsKey, MetricsValue) { 
                
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
    $('#TopPageReportId').html('<table class="table table-hover"><thead>'+finalHeadingHtml+'</thead><tbody>'+finalHtml+'</tbody></table>');
    var dateRangeHtml = "(" + PageData.startDate + " to " + PageData.endDate + ")";    
    $("#PageWise_dateRange").html(dateRangeHtml);  
    } else {
        $('#TopPageReportId').html('There is some error.');
    }
}

/**************** My View Code End Here ***********/

/**************** Shared View Code Start Here ***********/
var initilizeTopPagesSharedViewReport = function () {
    
    //For My View Section
    $("#PageReportSharedViewFilters").find(".applyTrafficDashboardDates").on('click', function (e) 
    {
        createTopPagesSharedViewData();
        $("#PageReportSharedViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    //Unset Date value
    $("#PageReportSharedViewFilters").find(".cancelDates").on('click', function (e) 
    {
        createTopPagesSharedViewData();
        $("#PageReportSharedViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    
    createTopPagesSharedViewData();
};

var createTopPagesSharedViewData = function () {
    $('#PageWiseSharedViewReportHTML .panel-loader').show();
    var postData = $("#dashboardForm").serializeArray();
    postData.push({name:"reportType",value:'getPagesReport'});
    
    if($("#PageReportSharedViewFilters").find('.inputBaseStartDate').val() != '' && $("#PageReportSharedViewFilters").find('.inputBaseEndDate').val() != '') {
        postData.push({name:"startDate",value:$("#PageReportSharedViewFilters").find('.inputBaseStartDate').val()});
        postData.push({name:"endDate",value:$("#PageReportSharedViewFilters").find('.inputBaseEndDate').val()}); 
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
            $('#PageWiseSharedViewReportHTML .panel-loader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.PageReport === "object") {
                    updateTopPagesSharedViewTableData(responseObject.PageReport);
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    $('#TopPageSharedViewReportId').html(responseObject.message);
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

function updateTopPagesSharedViewTableData(PageData) 
{
    
    if(typeof PageData.TopPagesData !== 'undefined') {
        
    mappingObj = PageData.mappingList;
    var finalHtml = '';
    var finalHeadingHtml = '<tr>';
    $.each(PageData.TopPagesData.dimensionResult, function (parentKey, ParentValue) {
        $.each(ParentValue, function (DimensionKey, DimensionValue) {            
            if(DimensionKey == 0) {
                if(typeof mappingObj[parentKey] !== 'undefined' && typeof mappingObj[parentKey]['label'] !== 'undefined') {
                    finalHeadingHtml += '<th class="text-left">'+mappingObj[parentKey]['label']+'</th>';
                } else {
                    finalHeadingHtml += '<th class="text-left">'+parentKey+'</th>';
                }
            }
            finalHtml +='<tr><td class="text-left"><span class="mw-400">'+DimensionValue+'</span></td>';
            $.each(PageData.TopPagesData.metricsResult, function (MetricsKey, MetricsValue) { 
                
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
    $('#TopPageSharedViewReportId').html('<table class="table table-hover"><thead>'+finalHeadingHtml+'</thead><tbody>'+finalHtml+'</tbody></table>');
    var dateRangeHtml = "(" + PageData.startDate + " to " + PageData.endDate + ")";    
    $("#PageWiseSharedView_dateRange").html(dateRangeHtml);  
    } else {
        $('#TopPageSharedViewReportId').html('There is some error.');
    }
}

/**************** Shared View Code End Here ***********/

