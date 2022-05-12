/****************** For My View Start Here ************/
var initilizeTopGoogleAdsCampaignReport = function () {
    
    //For My View Section
    $("#GoogleAdsCampaignReportMyViewFilters").find(".applyTrafficDashboardDates").on('click', function (e) 
    {
        createTopGoogleAdsCampaignData();
        $("#GoogleAdsCampaignReportMyViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    //Unset Date value
    $("#GoogleAdsCampaignReportMyViewFilters").find(".cancelDates").on('click', function (e) 
    {
        createTopGoogleAdsCampaignData();
        $("#GoogleAdsCampaignReportMyViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    
    createTopGoogleAdsCampaignData();
};

var createTopGoogleAdsCampaignData = function () {
    $('#GoogleAdsCampaignWiseReportHTML .panel-loader').show();
    var postData = $("#dashboardForm").serializeArray();
    postData.push({name:"reportType",value:'getGoogleAdsCampaignReport'});
    
    if($("#GoogleAdsCampaignReportMyViewFilters").find('.inputBaseStartDate').val() != '' && $("#GoogleAdsCampaignReportMyViewFilters").find('.inputBaseEndDate').val() != '') {
        postData.push({name:"startDate",value:$("#GoogleAdsCampaignReportMyViewFilters").find('.inputBaseStartDate').val()});
        postData.push({name:"endDate",value:$("#GoogleAdsCampaignReportMyViewFilters").find('.inputBaseEndDate').val()}); 
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
            $('#GoogleAdsCampaignWiseReportHTML .panel-loader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.GoogleAdsCampaignReport === "object") {
                    updateTopGoogleAdsCampaignsTableData(responseObject.GoogleAdsCampaignReport);
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    $('#TopGoogleAdsCampaignReportId').html(responseObject.message);
                }
            }
            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

};

function updateTopGoogleAdsCampaignsTableData(GoogleCampaignData) 
{
    
    if(typeof GoogleCampaignData.GoogleAdsCampaignData !== 'undefined') {
        
    mappingObj = GoogleCampaignData.mappingList;
    var finalHtml = '';
    var finalHeadingHtml = '<tr>';
    $.each(GoogleCampaignData.GoogleAdsCampaignData.dimensionResult, function (parentKey, ParentValue) {
        $.each(ParentValue, function (DimensionKey, DimensionValue) {            
            if(DimensionKey == 0) {
                if(typeof mappingObj[parentKey] !== 'undefined' && typeof mappingObj[parentKey]['label'] !== 'undefined') {
                    finalHeadingHtml += '<th class="text-left">'+mappingObj[parentKey]['label']+'</th>';
                } else {
                    finalHeadingHtml += '<th class="text-left">'+parentKey+'</th>';
                }
            }
            finalHtml +='<tr><td class="text-left">'+DimensionValue+'</td>';
            $.each(GoogleCampaignData.GoogleAdsCampaignData.metricsResult, function (MetricsKey, MetricsValue) { 
                
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
    $('#TopGoogleAdsCampaignReportId').html('<table class="table table-hover"><thead>'+finalHeadingHtml+'</thead><tbody>'+finalHtml+'</tbody></table>');
    var dateRangeHtml = "(" + GoogleCampaignData.startDate + " to " + GoogleCampaignData.endDate + ")";    
    $("#GoogleAdsCampaignWise_dateRange").html(dateRangeHtml);  
    } else {
        $('#TopGoogleAdsCampaignReportId').html('There is some error.');
    }
}

/****************** For My View End Here ************/

/****************** For Shared View Start Here ************/
var initilizeTopGoogleAdsSharedViewCampaignReport = function () {
    
    //For My View Section
    $("#GoogleAdsCampaignReportSharedViewFilters").find(".applyTrafficDashboardDates").on('click', function (e) 
    {
        createTopGoogleAdsSharedViewCampaignData();
        $("#GoogleAdsCampaignReportSharedViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    //Unset Date value
    $("#GoogleAdsCampaignReportSharedViewFilters").find(".cancelDates").on('click', function (e) 
    {
        createTopGoogleAdsSharedViewCampaignData();
        $("#GoogleAdsCampaignReportSharedViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    
    createTopGoogleAdsSharedViewCampaignData();
};

var createTopGoogleAdsSharedViewCampaignData = function () {
    $('#GoogleAdsCampaignWiseSharedViewReportHTML .panel-loader').show();
    var postData = $("#dashboardForm").serializeArray();
    postData.push({name:"reportType",value:'getGoogleAdsCampaignReport'});
    
    if($("#GoogleAdsCampaignReportSharedViewFilters").find('.inputBaseStartDate').val() != '' && $("#GoogleAdsCampaignReportSharedViewFilters").find('.inputBaseEndDate').val() != '') {
        postData.push({name:"startDate",value:$("#GoogleAdsCampaignReportSharedViewFilters").find('.inputBaseStartDate').val()});
        postData.push({name:"endDate",value:$("#GoogleAdsCampaignReportSharedViewFilters").find('.inputBaseEndDate').val()}); 
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
            $('#GoogleAdsCampaignWiseSharedViewReportHTML .panel-loader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.GoogleAdsCampaignReport === "object") {
                    updateTopGoogleAdsCampaignsSharedViewTableData(responseObject.GoogleAdsCampaignReport);
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    $('#TopGoogleAdsCampaignSharedViewReportId').html(responseObject.message);
                }
            }
            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

};

function updateTopGoogleAdsCampaignsSharedViewTableData(GoogleCampaignData) 
{
    
    if(typeof GoogleCampaignData.GoogleAdsCampaignData !== 'undefined') {
        
    mappingObj = GoogleCampaignData.mappingList;
    var finalHtml = '';
    var finalHeadingHtml = '<tr>';
    $.each(GoogleCampaignData.GoogleAdsCampaignData.dimensionResult, function (parentKey, ParentValue) {
        $.each(ParentValue, function (DimensionKey, DimensionValue) {            
            if(DimensionKey == 0) {
                if(typeof mappingObj[parentKey] !== 'undefined' && typeof mappingObj[parentKey]['label'] !== 'undefined') {
                    finalHeadingHtml += '<th class="text-left">'+mappingObj[parentKey]['label']+'</th>';
                } else {
                    finalHeadingHtml += '<th class="text-left">'+parentKey+'</th>';
                }
            }
            finalHtml +='<tr><td class="text-left">'+DimensionValue+'</td>';
            $.each(GoogleCampaignData.GoogleAdsCampaignData.metricsResult, function (MetricsKey, MetricsValue) { 
                
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
    $('#TopGoogleAdsCampaignSharedViewReportId').html('<table class="table table-hover"><thead>'+finalHeadingHtml+'</thead><tbody>'+finalHtml+'</tbody></table>');
    var dateRangeHtml = "(" + GoogleCampaignData.startDate + " to " + GoogleCampaignData.endDate + ")";    
    $("#GoogleAdsCampaignWiseSharedView_dateRange").html(dateRangeHtml);  
    } else {
        $('#TopGoogleAdsCampaignSharedViewReportId').html('There is some error.');
    }
}

/****************** For Shared View End Here ************/
