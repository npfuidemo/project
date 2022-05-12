/* 
 * To handle create segment Js Functions for AM/LMS.
 */
var ajax_hit = 0;
//Save Counsellor config section data
function saveSegmentData(Section) { 
    $('#' + Section + ' span.error').html('');
    // serialize all form data
    var isEdit = 0;
    if($('#college_staff').length >= 1 && $('#college_staff').val() != null){
        $.each($('#college_staff').val(),function(index,value){
            if(value.indexOf('_2') > -1){
                isEdit = 1;
            }
        });
    }
    if($('#college_counsellor').length >= 1 && $('#college_counsellor').val() != null){
        $.each($('#college_counsellor').val(),function(index,value){
            if(value.indexOf('_2') > -1){
                isEdit = 1;
            }
        });
    }
    if(isEdit){
        $("#ConfirmPopupArea").css({'z-index':'120000'});
        $('#ConfirmMsgBody').html('Every user with Edit Access can edit the Segment logic');
        $('#confirmYes').css('margin', '10px');
        $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
            .one('click', '#confirmYes', function (e) {
                var data = $('#' + Section).serialize();
                $('#ConfirmPopupArea').modal('hide');
                saveSegmentAjax(data,Section);
        });
    } else {
        var data = $('#' + Section).serialize();
        saveSegmentAjax(data,Section);
    }
}

function saveSegmentAjax(data,Section = ''){
    if(ajax_hit == 1){
        return ;
    }
    $.ajax({
        url: jsVars.saveSegmentUrl,
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            ajax_hit  = 1;
            $('#listloader').show();
        },
        complete: function () {
            ajax_hit  = 0;
            $('#listloader').hide();
        },
        success: function (json) {
            $('span.lead_error').html('').hide();
            if (json['redirect']) {
                // if session is out
                location = json['redirect'];
            } 
            else if (json['alert']) {
                // error display in popup
                alertPopup(json['alert'], 'error');
            }
            else if (json['error']) {
                // error display in popup
                for(var elemId in  json['error']) {
                    $('#' + Section + ' span#' + elemId + 'Error').html(json['error'][elemId]);
                }
            }
            else if (json['error_text']) {
                //error display in logic builder's fields
                for(var i in json['error_text']){
                    // form id found in Application manager counsellor logic builder
                    var form_id;
                    if(typeof json['form_id'] !='undefined' && json['form_id']!=''){
                        form_id = json['form_id'] + '_';
                    } else {
                        // for lms logic builder form id is blank
                        form_id = '';
                    }
                    
                    for(var j in json['error_text'][i]){
                        if(json['error_text'][i][j] == 1) {
//                            console.log('#errorlead_'+i+'_'+j);
                            // display error inline
                            $('#errorlead_' + form_id + i + '_' + j).addClass('error').show().html('Please Select Field');
                        }
                    }
                }
            } 
            else if (json['success'] == 200) {
                location = json['location'];
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            ajax_hit  = 0;
            $('#listloader').hide();
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

//Set Width dynamically to all select box where .default class is found
$(document).ready(function () {
    $("li.search-field > input.default").css("width", "250px");
});


//Save Counsellor config section data
function countSegmentLead(Section) { 
    $('#' + Section + ' span.error').html('');
    // serialize all form data
    var data = $('#' + Section).serialize();
    $.ajax({
        url: jsVars.countSegmentLeadUrl,
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            // show loader
            $('#listloader').show();
        },
        complete: function () {
            // hide loader
            $('#listloader').hide();
        },
        success: function (json) {
            $('span.lead_error').html('').hide();
            if (json['redirect']) {
                // if session is out
                location = json['redirect'];
            } 
            else if (json['alert']) {
                // error display in popup
                alertPopup(json['alert'], 'error');
            }
            else if (json['error']) {
                // error display in popup
                for(var elemId in  json['error']) {
                    $('#' + Section + ' span#' + elemId + 'Error').html(json['error'][elemId]);
                }
            }
            else if (json['error_text']) {
                //error display in logic builder's fields
                for(var i in json['error_text']){
                    // form id found in Application manager counsellor logic builder
                    var form_id;
                    if(typeof json['form_id'] !='undefined' && json['form_id']!=''){
                        form_id = json['form_id'] + '_';
                    } else {
                        // for lms logic builder form id is blank
                        form_id = '';
                    }
                    
                    for(var j in json['error_text'][i]){
                        if(json['error_text'][i][j] == 1) {
//                            console.log('#errorlead_'+i+'_'+j);
                            // display error inline
                            $('#errorlead_' + form_id + i + '_' + j).addClass('error').show().html('Please Select Field');
                        }
                    }
                }
            } 
            else if (json['success'] == 200) {
                $('#' + Section + ' span.view_count').html(json['leadCount']);
                $('#' + Section + ' span#div_view_count').attr('style','display:block');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            // hide loader
            $('#listloader').hide();
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
