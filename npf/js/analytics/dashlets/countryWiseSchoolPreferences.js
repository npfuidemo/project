var initilizeCountryWiseSchoolPreferencesData = function () {
    
    $("#countryWiseSchoolPreferencesDashlet").find(".applyDates").click(function () 
    {
        $("#countryWisePref_range1StartDate").val("");
        $("#countryWisePref_range1EndDate").val("");
        if ($("#countryWiseSchoolPreferencesDashlet").find(".inputBaseStartDate").val() !== "" && $("#countryWiseSchoolPreferencesDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#countryWisePref_range1StartDate").val($("#countryWiseSchoolPreferencesDashlet").find(".inputBaseStartDate").val());
            $("#countryWisePref_range1EndDate").val($("#countryWiseSchoolPreferencesDashlet").find(".inputBaseEndDate").val());
        }
        createCountryWiseSchoolPreferencesData();
    });
    $("#countryWiseSchoolPreferencesDashlet").find(".cancelDates").click(function (e) {
        $("#countryWisePref_range1StartDate").val("");
        $("#countryWisePref_range1EndDate").val("");
        createCountryWiseSchoolPreferencesData();
        
        $("#countryWiseSchoolPreferencesCountDashletFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    
    createCountryWiseSchoolPreferencesData();
};

var createCountryWiseSchoolPreferencesData = function () {
    $('#countryWiseSchoolPreferencesCountDashletHTML .panel-loader').show();
    var dashletUrl = $("#countryWiseSchoolPreferencesDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#countryWiseSchoolPreferencesCount_collegeId").val($("#collegeId").val());
    var filters = $("#countryWiseSchoolPreferencesCountFilterForm").serializeArray();
    $.ajax({
        url: dashletUrl,
        type: 'post',
        data: filters,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
	    $('#countryWiseSchoolPreferencesCountFilterForm .btn-group').removeClass('open');
            $('#countryWiseSchoolPreferencesCountDashletHTML .panel-loader').hide();
            $('#countryWiseSchoolPreferencesCountDashletHTML .panel-heading, #countryWiseSchoolPreferencesCountDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            //var responseObject = $.parseJSON(response);
            //if (responseObject.status == 1) {
                //if (typeof responseObject.data === "object") {
                    updateCountryWiseSchoolPreferences(response);
                //}
            //} else {
//                if (responseObject.message === 'session') {
//                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
//                } else {
//                    alertPopup(responseObject.message);
//                }
            //}
            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#countryWiseSchoolPreferencesCountDashletHTML .panel-loader').hide();
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

};

function updateCountryWiseSchoolPreferences(dashletData) {
    $('#dateRangeId').hide();
    $("#countryWiseSchoolPreferences").html(dashletData);
    
//    if (typeof dashletData.preferenceData !== "object") {
//        //return;
//    }
     var sDate='',eDate='';
     sDate=$("#CountryCountryWiseSchoolPref_startDate").val();
     eDate=$("#CountryCountryWiseSchoolPref_endDate").val();
    //var dateRangeHtml = "(" +sDate  + " - " +eDate + ")";
    
    if (typeof sDate !== "undefined" && eDate !=='' && 
        typeof sDate !== "undefined" && eDate !== '') {
        var dateRangeHtml = "("+sDate + " - " + eDate + ")";
        $("#CountryCountryWiseSchoolPref_dateRange").html(dateRangeHtml);
        $('#dateRangeId').show();    }
//    
//    
//    if(typeof dashletData.preferenceData !== 'undefined' && dashletData.preferenceData !== '') {
//        var tableRows = '';
//        $.each(dashletData.preferenceData, function (countryName, prefData) {
//            var asiaTotalPreference = '-';
//            var asiaUniquePreference = '-';
//            var internationalTotalPreference = '-';
//            var internationalUniquePreference = '-';
//
//            if(typeof prefData[1] !== 'undefined' && typeof prefData[1]['total'] !== 'undefined') {
//                asiaTotalPreference = prefData[1]['total'];
//                asiaUniquePreference = prefData[1]['uniqueCount'];
//            }
//                
//            if(typeof prefData[2] !== 'undefined' && typeof prefData[2]['total'] !== 'undefined') {
//                internationalTotalPreference = prefData[2]['total'];
//                internationalUniquePreference = prefData[2]['uniqueCount'];
//            }
//            tableRows += '<tr><td class="text-left fw-500 wsNormal">' + countryName + '</td>';
//            tableRows += '<td class="text-center wsNormal">' + asiaTotalPreference + '</td>';
//            tableRows += '<td class="text-center wsNormal">' + asiaUniquePreference + '</td>';
//            tableRows += '<td class="text-center wsNormal">' + internationalTotalPreference + '</td>';
//            tableRows += '<td class="text-center wsNormal">' + internationalUniquePreference + '</td></tr>';
//              
//        });
//
//
//        var headerRow = '<tr>';
//        headerRow += '<th class="text-left fw-500">Country of Institute</th>';
//        headerRow += '<th class="text-center fw-500">Total Indian Candidates</th>';
//        headerRow += '<th class="text-center fw-500">Unique Indian Candidates</th>';
//        headerRow += '<th class="text-center fw-500">Total International Candidates</th>';
//        headerRow += '<th class="text-center fw-500">Unique International Candidate</th></tr>';
//        
//        var table = '<table class="table table-hover mb-0"> \n\
//                            <thead> \n\
//                                                            ' + headerRow + ' \n\
//                            </thead> \n\
//                            <tbody> ' + tableRows + '</tbody> \n\
//                        </table>';
//
//        $("#countryWiseSchoolPreferences").html(table);
//    } else {    
//        var html = '';
//        html += '<div class="margin-top-30 margin-bottom-30">';
//        html += '<div class="noData text-muted text-center">';
//        html += '<p class="noDataicon m0"><i class="fa fa-database fa-3x"></i></p>';
//        html += '<p class="noDataMsg m0 font16">Data Not Available</p>';
//        html += '</div>';
//        html += '</div>';
//        $('#countryWiseSchoolPreferences').html(html);
//    }
    
}

function countryWiseSchoolPreferences_downloadCSV() {
    $("#countryWiseSchoolPreferencesCountFilterForm").submit();
}

function resetCountryWiseSschoolPreferencesFilterForm() 
{
    $("#countryWiseSchoolPreferencesCountFilterForm").find('select.dashletFilter').each(function () {
        $(this).val('');
    });
    $('.chosen-select').trigger('chosen:updated');
}