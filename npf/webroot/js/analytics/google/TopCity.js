/*************************For My View Start Here*********************/
var initilizeTopCityReport = function () {
    
    //For My View Section
    $("#CityReportMyViewFilters").find(".applyTrafficDashboardDates").on('click', function (e) 
    {
        createTopCitysData();
        $("#CityReportMyViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    //Unset Date value
    $("#CityReportMyViewFilters").find(".cancelDates").on('click', function (e) 
    {
        createTopCitysData();
        $("#CityReportMyViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    
    createTopCitysData();
};

var createTopCitysData = function () {
    $('#CityWiseReportHTML .panel-loader').show();
    var postData = $("#dashboardForm").serializeArray();
    postData.push({name:"reportType",value:'getTopCityReport'});
    
    if($("#CityReportMyViewFilters").find('.inputBaseStartDate').val() != '' && $("#CityReportMyViewFilters").find('.inputBaseEndDate').val() != '') {
        postData.push({name:"startDate",value:$("#CityReportMyViewFilters").find('.inputBaseStartDate').val()});
        postData.push({name:"endDate",value:$("#CityReportMyViewFilters").find('.inputBaseEndDate').val()}); 
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
            $('#CityWiseReportHTML .panel-loader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.TopCityReport === "object") {
                    updateTopCitiesTableData(responseObject.TopCityReport);
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    $('#TopCityReportId').html(responseObject.message);
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

function updateTopCitiesTableData(CityData) 
{
    
    if(typeof CityData.topCitiesData !== 'undefined') {
        mappingObj = CityData.mappingList;
        var finalHtml = '';
        var finalHeadingHtml = '<tr>';
        $.each(CityData.topCitiesData.dimensionResult, function (parentKey, ParentValue) {
            $.each(ParentValue, function (DimensionKey, DimensionValue) {            
                if(DimensionKey == 0) {
                    if(typeof mappingObj[parentKey] !== 'undefined' && typeof mappingObj[parentKey]['label'] !== 'undefined') {
                        finalHeadingHtml += '<th class="text-left">'+mappingObj[parentKey]['label']+'</th>';
                    } else {
                        finalHeadingHtml += '<th class="text-left">'+parentKey+'</th>';
                    }
                }
                finalHtml +='<tr><td class="text-left">'+DimensionValue+'</td>';
                $.each(CityData.topCitiesData.metricsResult, function (MetricsKey, MetricsValue) { 

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
        $('#TopCityReportId').html('<table class="table table-hover"><thead>'+finalHeadingHtml+'</thead><tbody>'+finalHtml+'</tbody></table>');
        var dateRangeHtml = "(" + CityData.startDate + " to " + CityData.endDate + ")";    
        $("#CityWise_dateRange").html(dateRangeHtml); 
    } else {
        $('#TopCityReportId').html('There is some error.');
    }
}

/*************************For My View End Here*********************/

/*************************For Shared View Start Here*********************/
var initilizeTopCitySharedViewReport = function () {
    
    //For My View Section
    $("#CityReportSharedViewFilters").find(".applyTrafficDashboardDates").on('click', function (e) 
    {
        createTopCitySharedViewData();
        $("#CityReportSharedViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    //Unset Date value
    $("#CityReportSharedViewFilters").find(".cancelDates").on('click', function (e) 
    {
        createTopCitySharedViewData();
        $("#CityReportSharedViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    
    createTopCitySharedViewData();
};

var createTopCitySharedViewData = function () {
    $('#CityWiseSharedViewReportHTML .panel-loader').show();
    var postData = $("#dashboardForm").serializeArray();
    postData.push({name:"reportType",value:'getTopCityReport'});
    
    if($("#CityReportSharedViewFilters").find('.inputBaseStartDate').val() != '' && $("#CityReportSharedViewFilters").find('.inputBaseEndDate').val() != '') {
        postData.push({name:"startDate",value:$("#CityReportSharedViewFilters").find('.inputBaseStartDate').val()});
        postData.push({name:"endDate",value:$("#CityReportSharedViewFilters").find('.inputBaseEndDate').val()}); 
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
            $('#CityWiseSharedViewReportHTML .panel-loader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.TopCityReport === "object") {
                    updateTopCitiesSharedViewTableData(responseObject.TopCityReport);
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    $('#TopCitySharedViewReportId').html(responseObject.message);
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

function updateTopCitiesSharedViewTableData(CityData) 
{
    
    if(typeof CityData.topCitiesData !== 'undefined') {
        mappingObj = CityData.mappingList;
        var finalHtml = '';
        var finalHeadingHtml = '<tr>';
        $.each(CityData.topCitiesData.dimensionResult, function (parentKey, ParentValue) {
            $.each(ParentValue, function (DimensionKey, DimensionValue) {            
                if(DimensionKey == 0) {
                    if(typeof mappingObj[parentKey] !== 'undefined' && typeof mappingObj[parentKey]['label'] !== 'undefined') {
                        finalHeadingHtml += '<th class="text-left">'+mappingObj[parentKey]['label']+'</th>';
                    } else {
                        finalHeadingHtml += '<th class="text-left">'+parentKey+'</th>';
                    }
                }
                finalHtml +='<tr><td class="text-left">'+DimensionValue+'</td>';
                $.each(CityData.topCitiesData.metricsResult, function (MetricsKey, MetricsValue) { 

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
        $('#TopCitySharedViewReportId').html('<table class="table table-hover"><thead>'+finalHeadingHtml+'</thead><tbody>'+finalHtml+'</tbody></table>');
        var dateRangeHtml = "(" + CityData.startDate + " to " + CityData.endDate + ")";    
        $("#CityWiseSharedView_dateRange").html(dateRangeHtml); 
    } else {
        $('#TopCitySharedViewReportId').html('There is some error.');
    }
}

/*************************For Shared View End Here*********************/