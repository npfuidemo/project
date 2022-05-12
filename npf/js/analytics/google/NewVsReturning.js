/************ My View Code Start Here *************/
var initilizeNewVsReturningReport = function () {
    
    //For My View Section
    $("#NewVsReturningReportMyViewFilters").find(".applyTrafficDashboardDates").on('click', function (e) 
    {
        createNewVsReturningData();
        $("#NewVsReturningReportMyViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    //Unset Date value
    $("#NewVsReturningReportMyViewFilters").find(".cancelDates").on('click', function (e) 
    {
        createNewVsReturningData();
        $("#NewVsReturningReportMyViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    
    createNewVsReturningData();
};

var createNewVsReturningData = function () {
    $('#NewVsReturningWiseReportHTML .panel-loader').show();
    var postData = $("#dashboardForm").serializeArray();
    postData.push({name:"reportType",value:'getNewVsReturningReport'});
    
    if($("#NewVsReturningMyViewFilters").find('.inputBaseStartDate').val() != '' && $("#GoogleAdsCampaignReportMyViewFilters").find('.inputBaseEndDate').val() != '') {
        postData.push({name:"startDate",value:$("#NewVsReturningReportMyViewFilters").find('.inputBaseStartDate').val()});
        postData.push({name:"endDate",value:$("#NewVsReturningReportMyViewFilters").find('.inputBaseEndDate').val()}); 
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
            $('#NewVsReturningWiseReportHTML .panel-loader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.NewVsReturningReport === "object") {
                    updateNewVsReturningTableData(responseObject.NewVsReturningReport);
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    $('#TopNewVsReturningReportId').html(responseObject.message);
                }
            }
            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

};

function updateNewVsReturningTableData(NewVsReturningReportData) 
{
    
    if(typeof NewVsReturningReportData.NewVsReturningData !== 'undefined') {
        
    mappingObj = NewVsReturningReportData.mappingList;
    var finalHtml = '';
    var finalHeadingHtml = '<tr>';
    $.each(NewVsReturningReportData.NewVsReturningData.dimensionResult, function (parentKey, ParentValue) {
        $.each(ParentValue, function (DimensionKey, DimensionValue) {            
            if(DimensionKey == 0) {
                if(typeof mappingObj[parentKey] !== 'undefined' && typeof mappingObj[parentKey]['label'] !== 'undefined') {
                    finalHeadingHtml += '<th class="text-left">'+mappingObj[parentKey]['label']+'</th>';
                } else {
                    finalHeadingHtml += '<th class="text-left">'+parentKey+'</th>';
                }
            }
            finalHtml +='<tr><td class="text-left">'+DimensionValue+'</td>';
            $.each(NewVsReturningReportData.NewVsReturningData.metricsResult, function (MetricsKey, MetricsValue) { 
                
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
    $('#TopNewVsReturningReportId').html('<table class="table table-hover"><thead>'+finalHeadingHtml+'</thead><tbody>'+finalHtml+'</tbody></table>');
    var dateRangeHtml = "(" + NewVsReturningReportData.startDate + " to " + NewVsReturningReportData.endDate + ")";    
    $("#NewVsReturningWise_dateRange").html(dateRangeHtml);  
    } else {
        $('#TopNewVsReturningReportId').html('There is some error.');
    }
}

/************ My View Code End Here *************/

/************ Shared View Code Start Here *************/
var initilizeNewVsReturningSharedViewReport = function () {
    
    //For My View Section
    $("#NewVsReturningReportSharedViewFilters").find(".applyTrafficDashboardDates").on('click', function (e) 
    {
        createNewVsReturningSharedViewData();
        $("#NewVsReturningReportSharedViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    //Unset Date value
    $("#NewVsReturningReportSharedViewFilters").find(".cancelDates").on('click', function (e) 
    {
        createNewVsReturningSharedViewData();
        $("#NewVsReturningReportSharedViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    
    createNewVsReturningSharedViewData();
};

var createNewVsReturningSharedViewData = function () {
    $('#NewVsReturningWiseSharedViewReportHTML .panel-loader').show();
    var postData = $("#dashboardForm").serializeArray();
    postData.push({name:"reportType",value:'getNewVsReturningReport'});
    
    if($("#NewVsReturningReportSharedViewFilters").find('.inputBaseStartDate').val() != '' && $("#NewVsReturningReportSharedViewFilters").find('.inputBaseEndDate').val() != '') {
        postData.push({name:"startDate",value:$("#NewVsReturningReportSharedViewFilters").find('.inputBaseStartDate').val()});
        postData.push({name:"endDate",value:$("#NewVsReturningReportSharedViewFilters").find('.inputBaseEndDate').val()}); 
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
            $('#NewVsReturningWiseSharedViewReportHTML .panel-loader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.NewVsReturningReport === "object") {
                    updateNewVsReturningSharedViewTableData(responseObject.NewVsReturningReport);
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    $('#TopNewVsReturningSharedViewReportId').html(responseObject.message);
                }
            }
            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

};

function updateNewVsReturningSharedViewTableData(NewVsReturningReportData) 
{
    
    if(typeof NewVsReturningReportData.NewVsReturningData !== 'undefined') {
        
    mappingObj = NewVsReturningReportData.mappingList;
    var finalHtml = '';
    var finalHeadingHtml = '<tr>';
    $.each(NewVsReturningReportData.NewVsReturningData.dimensionResult, function (parentKey, ParentValue) {
        $.each(ParentValue, function (DimensionKey, DimensionValue) {            
            if(DimensionKey == 0) {
                if(typeof mappingObj[parentKey] !== 'undefined' && typeof mappingObj[parentKey]['label'] !== 'undefined') {
                    finalHeadingHtml += '<th class="text-left">'+mappingObj[parentKey]['label']+'</th>';
                } else {
                    finalHeadingHtml += '<th class="text-left">'+parentKey+'</th>';
                }
            }
            finalHtml +='<tr><td class="text-left">'+DimensionValue+'</td>';
            $.each(NewVsReturningReportData.NewVsReturningData.metricsResult, function (MetricsKey, MetricsValue) { 
                
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
    $('#TopNewVsReturningSharedViewReportId').html('<table class="table table-hover"><thead>'+finalHeadingHtml+'</thead><tbody>'+finalHtml+'</tbody></table>');
    var dateRangeHtml = "(" + NewVsReturningReportData.startDate + " to " + NewVsReturningReportData.endDate + ")";    
    $("#NewVsReturningSharedViewWise_dateRange").html(dateRangeHtml);  
    } else {
        $('#TopNewVsReturningSharedViewReportId').html('There is some error.');
    }
}

/************ Shared View Code End Here *************/