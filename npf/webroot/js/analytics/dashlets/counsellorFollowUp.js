var initilizeCounsellorFollwUpTable = function () {
    createCounsellorFollwUp();
};

var createCounsellorFollwUp = function () {
//    $("#topSourceDashlet").find('.dropdown-toggle').dropdown('close');
    var dashletUrl = $("#counsellorFollowUp").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#counsellorFollowUp_collegeId").val($("#collegeId").val());
    var filters = $("#counsellorFollowUpFilterForm").serializeArray();
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
            $('#counsellorFollwUpDashletHTML .panel-loader').hide();
            $('#counsellorFollwUpDashletHTML .panel-heading, #counsellorFollwUpDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    updateCounsellorFollowUp(responseObject.data);
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

function updateCounsellorFollowUp(dashletData) {
    if(Array.isArray(dashletData) && dashletData.length==0) {
        return;
    }
    $("#counsellorFollowUpList").html("");
    $.each(dashletData, function (key, value) {
        var today = 0;
        var upcoming = 0;
        var overdue = 0;
        var completed = 0;
        if (typeof value.today !== "undefined") {
            today = value.today;
        }
        if (typeof value.upcoming !== "undefined") {
            upcoming = value.upcoming;
        }
        if (typeof value.overdue !== "undefined") {
            overdue = value.overdue;
        }
        if (typeof value.completed !== "undefined") {
            completed = value.completed;
        }
        $("#counsellorFollowUpList").append("<tr>\n\
            <td class='fw-500 text-left colGroup1'>" + value.name + "</td>\n\
            <td class='text-center colGroup2'>" + today + "</td>\n\
            <td class='text-center colGroup1'>" + upcoming + "</td>\n\
            <td class='text-center colGroup2'>" + overdue + "</td>\n\
            <td class='text-center colGroup1'>" + completed + "</td>\n\
        </tr>");
    });
}

function counsellorFollowUp_downloadCSV() {
    $("#counsellorFollowUpFilterForm").submit();
}

