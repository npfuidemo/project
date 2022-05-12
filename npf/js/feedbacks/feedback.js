(function () {
    $('#save_add_new,#save_exit').click(function () {
        var data = $('#createFeedback').serializeArray();
        var buttonid = this.id;
        $.ajax({
            url: '/feedbacks/save-question',
            type: 'post',
            data: data,
            dataType: 'json',
            headers: {
                "X-CSRF-TOKEN": jsVars._csrfToken
            },
            beforeSend: function () {
                $('#save_add_new,#save_exit').attr('disabled', 'disabled');
                $('div.loader-block-a').show();
            },
            complete: function () {
                $('div.loader-block-a').hide();
            },
            success: function (json) {
                if (json['session']) {
                    window.location.reload();
                } else if (json['inline_error']) {
                    $('#save_add_new,#save_exit').removeAttr('disabled');
                    for (var i in json['inline_error']) {
                        $('#' + i + '_error').html(json['inline_error'][i]);
                    }
                } else if (json['error']) {
                    $('#save_add_new,#save_exit').removeAttr('disabled');
                    alertPopup(json['error'], 'error');
                } else if (json['success'] == 200) {
                    if (buttonid == 'save_exit') {
                        alertPopup('Question Successfully saved!!', 'success', '/feedbacks/list-questions');
                    } else {
                        $('#SuccessPopupArea').on('hidden.bs.modal', function () {
                            window.location.href = '/feedbacks/create-question';
                        });
                        $("#SuccessPopupArea #alertTitle").html("Success");
                        alertPopup('Question Successfully saved!!', 'success');
                        
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block-a').hide();
            }
        });
    });
    
})();


//load more feedback list
function LoadMoreFeedbackList(type) {
    var selectCollegeMsg = 'Please select an Institute Name from filter and click apply to feedback lists.';
    if ($('#collegeId').val() == '') {
        collegeErrorChanges(selectCollegeMsg, type);
        return false;
    }
    if (type == 'reset') {
        Page = 0;
        $('#load_more_results').html("");
        $('#load_more_results_msg').html("");
        $('#load_more_results_msg').show("");
        $('#load_more_button').show();
        $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;&nbsp;Loading...');
        //$('button#searchAutomationListBtn').attr('disabled','disabled');
    }
    var data = $('form#feedbackListManagerForm').serializeArray();
    data.push({name: "page", value: Page});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;&nbsp;Loading...');
    $.ajax({
        url: '/feedbacks/list-questions-ajax',
        type: 'post',
        dataType: 'html',
        data: data,
        async: true,
        beforeSend: function () {
            $('#listloader').show();
        },
        complete: function () {
            $('#listloader').hide();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            Page = Page + 1;
            if (data === "session_logout") {
                window.location.reload(true);
            } else if (data === "college_error") {
                collegeErrorChanges(selectCollegeMsg, type);
            } else if (data == "error") {
                if (Page == 1) {
                    $('#table-data-view').hide();
                    $('#load_msg_div').show();
                    $('#load_msg').html('No Records found');
                } else {
                    $('#table-data-view').show();
                    $('#load_msg_div').hide();
                    $('#load_more_results_msg').html("<div class='margin-top-8 text-center text-danger fw-500'>No More Record</div>");
                }
                $('#load_more_button').hide();
                if (type != '' && Page == 1) {
                    $('#if_record_exists').hide();
                }
            } else {
                if (type == 'reset') {
                    $('#load_more_results').html("");
                }
                $('#table-data-view, #LoadMoreArea').show();
                $('#load_msg_div').hide();
                data = data.replace("<head/>", '');
                if (Page == 1) {
                    $('#load_more_results').append(data);
                    $('#if_record_exists').show();
                } else {
                    $('#load_more_results tbody').append(data);
                }
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Lists");
                dropdownMenuPlacement();
                //determineDropDirection();
            }
            $('.offCanvasModal').modal('hide');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

//load more applicant feedback list
function LoadMoreApplicantFeedbackList(type) {
    var selectCollegeMsg = 'Please select an Institute Name from filter and click apply to applicant feedback lists.';
    if ($('#collegeId').val() == '') {
        collegeErrorChanges(selectCollegeMsg, type);
        return false;
    }
    if (type == 'reset') {
        Page = 0;
        $('#load_more_results').html("");
        $('#load_more_results_msg').html("");
        $('#load_more_results_msg').show("");
        $('#load_more_button').show();
        $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;&nbsp;Loading...');
        //$('button#searchAutomationListBtn').attr('disabled','disabled');
    }
    var data = $('form#feedbackApplicantListManagerForm').serializeArray();
    data.push({name: "page", value: Page});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;&nbsp;Loading...');
    $.ajax({
        url: '/feedbacks/list-users-ajax',
        type: 'post',
        dataType: 'html',
        data: data,
        async: true,
        beforeSend: function () {
            $('#listloader').show();
        },
        complete: function () {
            $('#listloader').hide();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            Page = Page + 1;
            if (data === "session_logout") {
                window.location.reload(true);
            } else if (data === "college_error") {
                collegeErrorChanges(selectCollegeMsg, type);
            } else if (data == "error") {
                if (Page == 1) {
                    $('#table-data-view').hide();
                    $('#load_msg_div').show();
                    $('#load_msg').html('No Records found');
                } else {
                    $('#table-data-view').show();
                    $('#load_msg_div').hide();
                    $('#load_more_results_msg').html("<div class='margin-top-8 text-center text-danger fw-500'>No More Record</div>");
                }
                $('#load_more_button').hide();
                if (type != '' && Page == 1) {
                    $('#if_record_exists').hide();
                }
            } else {
                if (type == 'reset') {
                    $('#load_more_results').html("");
                }
                $('#table-data-view, #LoadMoreArea').show();
                $('#load_msg_div').hide();
                data = data.replace("<head/>", '');
                if (Page == 1) {
                    $('#load_more_results').append(data);
                    $('#if_record_exists').show();
                } else {
                    $('#load_more_results tbody').append(data);
                }
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Lists");
                dropdownMenuPlacement();
                //determineDropDirection();
            }
            $('.offCanvasModal').modal('hide');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

function collegeErrorChanges(selectCollegeMsg, type) {

    $('#load_more_results > tr > td > div > div').html("<div class='alert alert-danger'>" + selectCollegeMsg + "</div>");
    $('#load_more_button').hide();
    $('#load_more_button').html("Load More Lists");
    if (type != '') {
        $('#if_record_exists').hide();
    }
    return false;
}

/**
 * For reset the form
 * @param {type} form_name (Pass the form id
 * @returns {undefined}
 */
function ResetFilter(form_name){
   $('form#'+form_name+' input[type=text], form#'+form_name+' textarea').val('');
    $('form#'+form_name+' select').val('').trigger('chosen:updated');
    if('feedbackListManagerForm' == form_name || 'LoadMoreApplicantFeedbackList' == form_name || 'feedbackApplicantListManagerForm'== form_name){
        jQuery('#tot_records, #load_more_results').html('');
        jQuery('#load_msg_div').show();
        jQuery('#table-data-view, #if_record_exists, #LoadMoreArea').hide();
    }
    return false;
}