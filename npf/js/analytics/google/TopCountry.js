/*************************For My View Start Here*********************/
var initilizeTopCountryReport = function () {
    
    //For My View Section
    $("#countryReportMyViewFilters").find(".applyTrafficDashboardDates").on('click', function (e) 
    {
        createTopCountriesData();
        $("#countryReportMyViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    //Unset Date value
    $("#countryReportMyViewFilters").find(".cancelDates").on('click', function (e) 
    {
        createTopCountriesData();
        $("#countryReportMyViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    
    createTopCountriesData();
};

var createTopCountriesData = function () {
    //var dashletUrl = $("#ZoneWiseSourceDashlet").data('url');
    //var defaultImage = '/img/line_no_data_image.jpg';
    //$("#ZoneWiseSource_collegeId").val($("#collegeId").val());
    $('#CountryWiseReportHTML .panel-loader').show();
    var postData = $("#dashboardForm").serializeArray();
    postData.push({name:"reportType",value:'getTopCountriesReport'});
    
    if($("#countryReportMyViewFilters").find('.inputBaseStartDate').val() != '' && $("#countryReportMyViewFilters").find('.inputBaseEndDate').val() != '') {
        postData.push({name:"startDate",value:$("#countryReportMyViewFilters").find('.inputBaseStartDate').val()});
        postData.push({name:"endDate",value:$("#countryReportMyViewFilters").find('.inputBaseEndDate').val()}); 
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
            $('#CountryWiseReportHTML .panel-loader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.topCountriesReport === "object") {
                    updateTopCountriesTableData(responseObject.topCountriesReport);
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    $('#topCountryReportId').html(responseObject.message);
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

function updateTopCountriesTableData(countryData) 
{
    
    if(typeof countryData.topCountriesData !== 'undefined') {
        mappingObj = countryData.mappingList;
        var finalHtml = '';
        var finalHeadingHtml = '<tr>';
        $.each(countryData.topCountriesData.dimensionResult, function (parentKey, ParentValue) {
            $.each(ParentValue, function (DimensionKey, DimensionValue) {            
                if(DimensionKey == 0) {
                    if(typeof mappingObj[parentKey] !== 'undefined' && typeof mappingObj[parentKey]['label'] !== 'undefined') {
                        finalHeadingHtml += '<th class="text-left">'+mappingObj[parentKey]['label']+'</th>';
                    } else {
                        finalHeadingHtml += '<th class="text-left">'+parentKey+'</th>';
                    }
                }
                finalHtml +='<tr><td class="text-left">'+DimensionValue+'</td>';
                $.each(countryData.topCountriesData.metricsResult, function (MetricsKey, MetricsValue) { 

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
        $('#topCountryReportId').html('<table class="table table-hover"><thead>'+finalHeadingHtml+'</thead><tbody>'+finalHtml+'</tbody></table>');
        var dateRangeHtml = "(" + countryData.startDate + " to " + countryData.endDate + ")";    
        $("#CountryWise_dateRange").html(dateRangeHtml);  
    } else {
        $('#topCountryReportId').html('There is some error.');
    }
}

/*************************For My View End Here*********************/

/*************************For Shared View Start Here*********************/
var initilizeSharedViewTopCountryReport = function () {
    
    //For My View Section
    $("#countryReportSharedViewFilters").find(".applyTrafficDashboardDates").on('click', function (e) 
    {
        createTopCountriesSharedData();
        $("#countryReportSharedViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    //Unset Date value
    $("#countryReportSharedViewFilters").find(".cancelDates").on('click', function (e) 
    {
        createTopCountriesSharedData();
        $("#countryReportSharedViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    
    createTopCountriesSharedData();
};

var createTopCountriesSharedData = function () {
    $('#CountryWiseSharedViewReportHTML .panel-loader').show();
    var postData = $("#dashboardForm").serializeArray();
    postData.push({name:"reportType",value:'getTopCountriesReport'});
    
    if($("#countryReportSharedViewFilters").find('.inputBaseStartDate').val() != '' && $("#countryReportSharedViewFilters").find('.inputBaseEndDate').val() != '') {
        postData.push({name:"startDate",value:$("#countryReportSharedViewFilters").find('.inputBaseStartDate').val()});
        postData.push({name:"endDate",value:$("#countryReportSharedViewFilters").find('.inputBaseEndDate').val()}); 
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
            $('#CountryWiseSharedViewReportHTML .panel-loader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.topCountriesReport === "object") {
                    updateTopCountriesSharedViewTableData(responseObject.topCountriesReport);
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    $('#topCountrySharedViewReportId').html(responseObject.message);
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

function updateTopCountriesSharedViewTableData(countryData) 
{
    
    if(typeof countryData.topCountriesData !== 'undefined') {
        mappingObj = countryData.mappingList;
        var finalHtml = '';
        var finalHeadingHtml = '<tr>';
        $.each(countryData.topCountriesData.dimensionResult, function (parentKey, ParentValue) {
            $.each(ParentValue, function (DimensionKey, DimensionValue) {            
                if(DimensionKey == 0) {
                    if(typeof mappingObj[parentKey] !== 'undefined' && typeof mappingObj[parentKey]['label'] !== 'undefined') {
                        finalHeadingHtml += '<th class="text-left">'+mappingObj[parentKey]['label']+'</th>';
                    } else {
                        finalHeadingHtml += '<th class="text-left">'+parentKey+'</th>';
                    }
                }
                finalHtml +='<tr><td class="text-left">'+DimensionValue+'</td>';
                $.each(countryData.topCountriesData.metricsResult, function (MetricsKey, MetricsValue) { 

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
        $('#topCountrySharedViewReportId').html('<table class="table table-hover"><thead>'+finalHeadingHtml+'</thead><tbody>'+finalHtml+'</tbody></table>');
        var dateRangeHtml = "(" + countryData.startDate + " to " + countryData.endDate + ")";    
        $("#CountryWiseSharedView_dateRange").html(dateRangeHtml);  
    } else {
        $('#topCountrySharedViewReportId').html('There is some error.');
    }
}
/*************************For Shared View End Here*********************/



