var initilizeSchoolPreferencesTable = function () {
    $("#schoolPreferencesDashlet").find(".applyDates").click(function () {
        $("#schoolPreferences_range1StartDate").val("");
        $("#schoolPreferences_range1EndDate").val("");
        if ($("#schoolPreferencesDashlet").find(".inputBaseStartDate").val() !== "" && $("#schoolPreferencesDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#schoolPreferences_range1StartDate").val($("#schoolPreferencesDashlet").find(".inputBaseStartDate").val());
            $("#schoolPreferences_range1EndDate").val($("#schoolPreferencesDashlet").find(".inputBaseEndDate").val());
        }
        createSchoolPreferencesTable();
    });
    $("#schoolPreferencesDashlet").find(".cancelDates").click(function () {
        $("#schoolPreferences_range1StartDate").val("");
        $("#schoolPreferences_range1EndDate").val("");
        createSchoolPreferencesTable();
    });
    createSchoolPreferencesTable();
    
    if ($("#schoolPreferences_form_id").length) {
        $("#schoolPreferences_form_id").change(function(){
            getExamScoreField(this.value);
        });
    }
};

var createSchoolPreferencesTable = function () {
//    $("#schoolPreferencesDashlet").find('.dropdown-toggle').dropdown('close');
    var dashletUrl = $("#schoolPreferencesDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#schoolPreferences_collegeId").val($("#collegeId").val());
    var filters = $("#schoolPreferencesFilterForm").serializeArray();
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
            $('#schoolPreferencesDashletHTML .panel-loader').hide();
            $('#schoolPreferencesDashletHTML .panel-heading, #schoolPreferencesDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    updateSchoolPreferences(responseObject.data);
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(responseObject.message);
                }
            }
            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

};

function updateSchoolPreferences(dashletData) {

    var dateRangeHtml = "(" + dashletData.startDate + " - " + dashletData.endDate + ")";
    if (typeof dashletData.compareStartDate !== "undefined" && typeof dashletData.compareEndDate !== "undefined") {
        dateRangeHtml = dateRangeHtml + " vs (" + dashletData.compareStartDate + " to " + dashletData.compareEndDate + ")";
    }
    $("#schoolPreferences_dateRange").html(dateRangeHtml);
    
    $("#schoolPreferencesContainerDiv").html("");
    if (typeof dashletData.schools !== "object") {
        return;
    }

    var tableRows = '';
    $.each(dashletData.schools, function (key, applications) {
        tableRows += '<tr><td class="text-left fw-500 wsNormal">' + key + '</td>';
        tableRows += '<td>' + (typeof applications["1"]!=="undefined" ? applications["1"] : 0) + '</td>';
        tableRows += '<td>' + (typeof applications["2"]!=="undefined" ? applications["2"] : 0) + '</td>';
        tableRows += '<td>' + (typeof applications["3"]!=="undefined" ? applications["3"] : 0) + '</td>';
        tableRows += '<td>' + (typeof applications["4"]!=="undefined" ? applications["4"] : 0) + '</td>';
        tableRows += '<td>' + (typeof applications["5"]!=="undefined" ? applications["5"] : 0) + '</td>';
        tableRows += '<td>' + (typeof applications["6"]!=="undefined" ? applications["6"] : 0) + '</td>';
        tableRows += '<td>' + applications.total + '</td>';
    });

    var table = '<table class="table table-hover mb-0"> \n\
                        <thead> \n\
                            <tr> \n\
                                <th rowspan="2" class="text-left" style="width:20%;">Institute Name</th> \n\
                                <th rowspan="2" class="text-center">1st Preference</th>\n\
                                <th rowspan="2" class="text-center">2nd Preference</th>\n\
                                <th rowspan="2" class="text-center">3rd Preference</th>\n\
                                <th rowspan="2" class="text-center">4th Preference</th>\n\
                                <th rowspan="2" class="text-center">5th Preference</th>\n\
                                <th rowspan="2" class="text-center">6th Onwards</th>\n\
                                <th rowspan="2" class="text-center">Total</th>\n\
                            </tr> \n\
                        </thead> \n\
                        <tbody> ' + tableRows + '</tbody> \n\
                    </table>';

    $("#schoolPreferencesContainerDiv").html(table);
    /*if($(window).width() > 967){
     var docHeight = $(document).height()- 180;
     $('.gridly').css('height', docHeight);
     }*/

}

function schoolPreferences_downloadPDF() {
//    $("#schoolPreferencesDashletFilters").hide();

    var data = document.getElementById("schoolPreferencesDashletHTML");
    html2canvas(data).then(canvas => {
        // Few necessary setting options  
        var imgWidth = 200;
        var imgHeight = canvas.height * imgWidth / canvas.width;

        const contentDataURL = canvas.toDataURL('image/png');
        var pdf = new jspdf(); // A4 size page of PDF  
        var position = 1;
        pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth, imgHeight);
        pdf.save('download.pdf'); // Generated PDF   
//        $("#schoolPreferencesDashletFilters").show();
    });


}

function schoolPreferences_downloadCSV() {
    $("#schoolPreferencesFilterForm").submit();
}

function resetSchoolPreferencesFiltersForm() {
    $("#schoolPreferencesFilterForm").find('select.dashletFilter').each(function () {
        $(this).val('');
    });
    $('.chosen-select').trigger('chosen:updated');
}

function getExamScoreField(form_id){
    $.ajax({
        url: '/exam/exam-score-field',
        type: 'post',
        dataType: 'html',
        data: {"form_id": form_id},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (response) {
            var json = $.parseJSON(response);
            if(typeof json['error'] !=='undefined'){
               if(json['error'] =='session_logout') {
                   window.location.reload(true);
               } else {
                   alertPopup(json['error'],'error');
                   return false;
               }
            }
            $('#schoolPreferences_exam_field').html('');
            $('#schoolPreferences_exam_field').html(json['fieldList']);
            $('.chosen-select').trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

