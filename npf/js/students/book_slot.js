$(document).on('change', '#city_id', getAddressList);
$(document).on('change', '#address_id', getDateList);
$(document).on('change', '#platform_id', getDateList);
$(document).on('change', '#slot_date', getTimeList);
$(document).on('change', '#slot_time', getExtraList);
$(document).on('click', '#book_gdpi_slot', bookGdpiSlot);
$(document).on('click', '#book_retake_gdpi_slot', bookRetakeGdpiSlot);
$(document).on('click', '#book_gdpi_slot_am', bookGdpiSlotAm);
$(document).on('click', '#reschedule_gdpi_slot', rescheduleGdpiSlot);
$(document).on('click', '.assignment_type', changeAssignmentType);
$(document).on('click','.downloadSampleCSV', downloadSampleCSV);

$(document).ready(function() {
    if(jsVars.preSelectedParam === 1) {
        getDateList();
    }
});

function downloadSampleCSV(){
    var processId = $("#gdpi_process_id").val();
    if(processId !== '0' && processId !== '') {
        $.ajax({
            url: '/virtual-post-applications/getBookingParams',
            type: 'post',
            data: {'processId': processId, 'fromAM':true},
            async: false,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                if(json['status'] ===0 && json['message'] === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else if(json['status'] ===1 || json['status'] ===true) {
                    var sampleCSVHeading = json['data']['sampleCSVHeading'];
                    var data = "data:text/csv;charset=UTF-8," + encodeURIComponent(sampleCSVHeading);
                    var link=document.createElement('a');
                    link.href='data:' + data;
                    link.download="sample.csv";
                    link.click();
                } else{
                    alertPopup(json['message'], 'error');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    } else {
        alertPopup('First of all, Please save process', 'error');
    }
}

function changeAssignmentType() {
    var assignmentType = $(this).val();
    if(assignmentType === 'manual') {
        $(this).closest('form').find('.inputManualSlots').show();
        $(this).closest('form').find('.uploadOfflineSlots').hide();
    } else if(assignmentType === 'upload') {
        $(this).closest('form').find('.uploadOfflineSlots').show();
        $(this).closest('form').find('.inputManualSlots').hide();
    }
}

function alertPopup(msg, type, location) {
    if (type === 'error') {
        var selector_parent = '#ErrorPopupArea';
        var selector_titleID = '#ErrorPopupArea #ErroralertTitle';
        var selector_msg = '#ErrorMsgBody';
        var btn = '#ErrorOkBtn';
        var title_msg = 'Error';
    } else {
        var selector_parent = '#SuccessPopupArea';
        var selector_titleID = '#SuccessPopupArea  #alertTitle';
        var selector_msg = '#MsgBody';
        var btn = '#OkBtn';
        var title_msg = 'Success';
    }

    $(selector_titleID).html(title_msg);
    $(selector_msg).html(msg);
    $('.oktick').hide();

    if (typeof location !== 'undefined') {
        $(btn).show();

        $(selector_parent).modal({keyboard: false}).one('click', btn, function (e) {
            e.preventDefault();
            window.location.href = location;
        });
    }
    else {
        $(selector_parent).modal();
    }
}

function bookGdpiSlotAm() {
    var paramValue;
    var isValid = true;
    $(this).closest('form').find('.has-error').html('');
    $("#gdpi_book_slot").find('.bookingParam').each(function(){ 
       paramValue = $(this).val();
       if(paramValue === '0') {
           $(this).siblings('.has-error').html('Please select values');
           isValid = false;
       }
    });
    if(isValid === true) {
        $(this).closest('form').find('.has-error').html('');
        $.ajax({
            url: '/virtual-post-applications/applicantSlotBookingAm',
            type: 'post',
            data: $(this).closest('form').serialize(),
            async: false,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                if(json['status'] ===0 && json['message'] === 'session'){
                    location = jsVars.FULL_URL;
                } else if(json['status'] ===1 || json['status'] ===true) {
                    $("#gdpi_book_slot").find('.bookingParam').prop('disabled', true).trigger("chosen:updated");
                    $("#gdpi_process_id").prop('disabled', true).trigger("chosen:updated");
                    $('.submitBtn').hide();
                    $('.slot_msg').removeClass('error');
                    $(".slot_msg").html('Slot is assigned to Applicant');
                    $(".slot_msg").show();
                    $(".slot_msg").addClass('alert alert-success text-center');
                    $("#processListDiv").hide();
                    $(".slotBookingDetailsDiv").hide();
                } else{
                    $('.slot_msg').addClass('error');
                    $(".slot_msg").html(json['message']);
                    $(".slot_msg").show();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

function bookGdpiSlot() {
    var paramValue;
    var isValid = true;
    $(this).closest('form').find('.has-error').html('');
    $("#gdpi_book_slot").find('.bookingParam').each(function(){ 
       paramValue = $(this).val();
       if(paramValue === '0') {
           $(this).parent().siblings('.has-error').html('Please select the slot values to book the slot.');
           isValid = false;
       }
    });
    if(isValid === true) {
        var serializeData = $(this).closest('form').serialize();
        $('#ConfirmMsgBody').html('Do you want to Book the slot ?<br> Please click on Yes to confirm');
        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $(this).closest('form').find('.has-error').html('');
        $.ajax({
            url: '/virtual-post-applications/applicantSlotBooking',
            type: 'post',
            data: serializeData,
            async: false,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                if(json['status'] ===0 && json['message'] === 'session'){
                    location = jsVars.FULL_URL;
                } else if(json['status'] ===1 || json['status'] ===true) {
                    $('#ConfirmPopupArea').modal('hide');
                    $("#gdpi_book_slot").find('.bookingParam').prop('disabled', true).trigger("chosen:updated");
                    $('.submitBtn').hide();
                    alertPopup(json['message']+'<br><p><a href="/dashboard" class="link-theme"><i class="fa fa-chevron-circle-left"></i>&nbsp; Back to Dashboard</a></p>');
                } else{
                    $('#ConfirmPopupArea').modal('hide');
                    alertPopup(json['message'], 'error');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });  
    }
}

function bookRetakeGdpiSlot() {
    var paramValue;
    var isValid = true;
    $(this).closest('form').find('.has-error').html('');
    $("#gdpi_retake_book_slot").find('.bookingParam').each(function(){ 
       paramValue = $(this).val();
       if(paramValue === '0') {
           $(this).parent().siblings('.has-error').html('Please select the slot values to book the slot.');
           isValid = false;
       }
    });
    if(isValid === true) {
        $(this).closest('form').find('.has-error').html('');
        $.ajax({
            url: '/virtual-post-applications/applicantRetakeSlotBooking',
            type: 'post',
            data: $(this).closest('form').serialize(),
            async: false,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                if(json['status'] ===0 && json['message'] === 'session'){
                    location = jsVars.FULL_URL;
                } else if(json['status'] ===1 || json['status'] ===true) {
                    $("#gdpi_book_slot").find('.bookingParam').prop('disabled', true).trigger("chosen:updated");
                    $('.submitBtn').hide();
                    alertPopup(json['message']+'<br><p><a href="/dashboard" class="link-theme"><i class="fa fa-chevron-circle-left"></i>&nbsp; Back to Dashboard</a></p>');
                } else{
                    alertPopup(json['message'], 'error');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

function rescheduleGdpiSlot() {
    var paramValue;
    var isValid = true;
    $(this).closest('form').find('.has-error').html('');
    $("#gdpi_book_slot").find('.bookingParam').each(function(){ 
       paramValue = $(this).val();
       if(paramValue === '0') {
           $(this).parent().siblings('.has-error').html('Please select the slot values to book the slot.');
           isValid = false;
       }
    });
    if(isValid === true) {
        $(this).closest('form').find('.has-error').html('');
        $.ajax({
            url: '/virtual-post-applications/applicantRescheduleSlot',
            type: 'post',
            data: $(this).closest('form').serialize(),
            async: false,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                if(json['status'] ===0 && json['message'] === 'session'){
                    location = jsVars.FULL_URL;
                } else if(json['status'] ===1 || json['status'] ===true) {
                    $("#gdpi_book_slot").find('.bookingParam').prop('disabled', true).trigger("chosen:updated");
                    $('.submitBtn').hide();
                    alertPopup(json['message']+'<br><p><a href="/dashboard" class="link-theme"><i class="fa fa-chevron-circle-left"></i>&nbsp; Back to Dashboard</a></p>');
                } else{
                    alertPopup(json['message'], 'error');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

function getExtraList() {
    if($("#extra").length === 0) {
        return;
    }
    var collegeId = $("#college_id").val();
    var formId = $("#form_id").val();
    var mode = $("#mode").val();
    var gdpiProcessId = $("#gdpi_process_id").val();
    var data = {'college_id':collegeId, 'form_id':formId, 'gdpi_process_id':gdpiProcessId, 'mode':mode};
    
    if(mode === 'offline') {
        var cityId = $("#city_id").val();
        var addressId = $("#address_id").val();
        if(typeof cityId === 'undefined') {
            data['cityId'] = 0;
        } else {
            data['cityId'] = cityId;
        }
        if(typeof addressId === 'undefined') {
            data['addressId'] = 0;
        } else {
            data['addressId'] = addressId;
        }
    } else {
        var platformId = $("#platform_id").val();
        if(typeof platformId === 'undefined') {
            data['platformId'] = 0;
        } else {
            data['platformId'] = platformId;
        }
    }
    var slotDate = $("#slot_date").val();
    if(typeof slotDate === 'undefined') {
        data['slotDate'] = 0;
    } else {
        data['slotDate'] = slotDate;
    }
    var slotTime = $("#slot_time").val();
    if(typeof slotTime === 'undefined') {
        data['slotTime'] = 0;
    } else {
        data['slotTime'] = slotTime;
    }
    
    $.ajax({
        url: '/virtual-post-applications/getExtraList',
        type: 'post',
        data: data,
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL;
            } else if(json['status'] ===1 && typeof json['data']['extra_list'] !== 'undefined') {
                var html = "";
                if(typeof json['data']['booking_param']['extra'] !== 'undefined') {
                    html = "<option value='0'>Select "+json['data']['booking_param']['extra']+"</option>";
                } else {
                    html = "<option value='0'>Select Option</option>";
                }
                for (var key in json['data']['extra_list']) {
                    html += "<option value='" + key + "'>" +json['data']['extra_list'][key] + "</option>";
                }
                $("#extra").html(html);
                $('#extra').trigger('chosen:updated');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getTimeList() {
    if($("#slot_time").length === 0) {
        getExtraList();
        return;
    }
    var collegeId = $("#college_id").val();
    var formId = $("#form_id").val();
    var mode = $("#mode").val();
    var gdpiProcessId = $("#gdpi_process_id").val();
    var data = {'college_id':collegeId, 'form_id':formId, 'gdpi_process_id':gdpiProcessId, 'mode':mode, 'fromFrontEnd':jsVars.fromFrontEnd};
    
    if(mode === 'offline') {
        var cityId = $("#city_id").val();
        var addressId = $("#address_id").val();
        if(typeof cityId === 'undefined') {
            data['cityId'] = 0;
        } else {
            data['cityId'] = cityId;
        }
        if(typeof addressId === 'undefined') {
            data['addressId'] = 0;
        } else {
            data['addressId'] = addressId;
        }
    } else {
        var platformId = $("#platform_id").val();
        if(typeof platformId === 'undefined') {
            data['platformId'] = 0;
        } else {
            data['platformId'] = platformId;
        }
    }
    var slotDate = $("#slot_date").val();
    if(typeof slotDate === 'undefined') {
        data['slotDate'] = 0;
    } else {
        data['slotDate'] = slotDate;
    }
    
    $.ajax({
        url: '/virtual-post-applications/getTimeList',
        type: 'post',
        data: data,
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            var html = "";
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL;
            } else if(json['status'] ===1 && typeof json['data']['time_list'] !== 'undefined') {
                if(typeof json['data']['booking_param']['slot_time'] !== 'undefined') {
                    html = "<option value='0'>Select "+json['data']['booking_param']['slot_time']+"</option>";
                } else {
                    html = "<option value='0'>Select Option</option>";
                }
                for (var key in json['data']['time_list']) {
                    html += "<option value='" + key + "'>" +json['data']['time_list'][key] + "</option>";
                }
                $("#slot_time").html(html);
                $('#slot_time').trigger('chosen:updated');
            }

            if(typeof json['data']['booking_param']['extra'] !== 'undefined') {
                html = "<option value='0'>Select "+json['data']['booking_param']['extra']+"</option>";
            } else {
                html = "<option value='0'>Select Option</option>";
            }
            $("#extra").html(html);
            $('#extra').trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function getDateList() {
    if($("#slot_date").length === 0) {
        getTimeList();
        return;
    }
    var collegeId = $("#college_id").val();
    var formId = $("#form_id").val();
    var mode = $("#mode").val();
    var gdpiProcessId = $("#gdpi_process_id").val();
    var data = {'college_id':collegeId, 'form_id':formId, 'gdpi_process_id':gdpiProcessId, 'mode':mode, 'fromFrontEnd':jsVars.fromFrontEnd};
    
    if(mode === 'offline') {
        var cityId = $("#city_id").val();
        var addressId = $("#address_id").val();
        if(typeof cityId === 'undefined') {
            data['cityId'] = 0;
        } else {
            data['cityId'] = cityId;
        }
        if(typeof addressId === 'undefined') {
            data['addressId'] = 0;
        } else {
            data['addressId'] = addressId;
        }
    } else {
        var platformId = $("#platform_id").val();
        if(typeof platformId === 'undefined') {
            data['platformId'] = 0;
        } else {
            data['platformId'] = platformId;
        }
    }
    
    $.ajax({
        url: '/virtual-post-applications/getDateList',
        type: 'post',
        data: data,
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            var html = "";
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL;
            } else if(json['status'] ===1 && typeof json['data']['date_list'] !== 'undefined') {
                if(typeof json['data']['booking_param']['slot_date'] !== 'undefined') {
                    html = "<option value='0'>Select "+json['data']['booking_param']['slot_date']+"</option>";
                } else {
                    html = "<option value='0'>Select Option</option>";
                }
                for (var key in json['data']['date_list']) {
                    html += "<option value='" + key + "'>" +json['data']['date_list'][key] + "</option>";
                }
                $("#slot_date").html(html);
                $('#slot_date').trigger('chosen:updated');
            }
            if(typeof json['data']['booking_param']['slot_time'] !== 'undefined') {
                html = "<option value='0'>Select "+json['data']['booking_param']['slot_time']+"</option>";
            } else {
                html = "<option value='0'>Select Option</option>";
            }
            $("#slot_time").html(html);
            $('#slot_time').trigger('chosen:updated');
            
            if(typeof json['data']['booking_param']['extra'] !== 'undefined') {
                html = "<option value='0'>Select "+json['data']['booking_param']['extra']+"</option>";
            } else {
                html = "<option value='0'>Select Option</option>";
            }
            $("#extra").html(html);
            $('#extra').trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getAddressList() {
    if($("#address_id").length === 0) {
        getDateList();
        return;
    }
    var collegeId = $("#college_id").val();
    var formId = $("#form_id").val();
    var cityId = $("#city_id").val();
    var gdpiProcessId = $("#gdpi_process_id").val();
    $.ajax({
        url: '/virtual-post-applications/getAddressList',
        type: 'post',
        data: {'college_id':collegeId, 'form_id':formId, 'city_id':cityId, 'gdpi_process_id':gdpiProcessId},
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            var html = "";
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL;
            } else if(json['status'] ===1 && typeof json['data']['address_list'] !== 'undefined') {
                if(typeof json['data']['booking_param']['address_id'] !== 'undefined') {
                    html = "<option value='0'>Select "+json['data']['booking_param']['address_id']+"</option>";
                } else {
                    html = "<option value='0'>Select Option</option>";
                }
                for (var key in json['data']['address_list']) {
                    html += "<option value='" + key + "'>" +json['data']['address_list'][key] + "</option>";
                }
                $("#address_id").html(html);
                $('#address_id').trigger('chosen:updated');
            }
            if(typeof json['data']['booking_param']['slot_date'] !== 'undefined') {
                html = "<option value='0'>Select "+json['data']['booking_param']['slot_date']+"</option>";
            } else {
                html = "<option value='0'>Select Option</option>";
            }
            $("#slot_date").html(html);
            $('#slot_date').trigger('chosen:updated');
            
            if(typeof json['data']['booking_param']['slot_time'] !== 'undefined') {
                html = "<option value='0'>Select "+json['data']['booking_param']['slot_time']+"</option>";
            } else {
                html = "<option value='0'>Select Option</option>";
            }
            $("#slot_time").html(html);
            $('#slot_time').trigger('chosen:updated');
            
            if(typeof json['data']['booking_param']['extra'] !== 'undefined') {
                html = "<option value='0'>Select "+json['data']['booking_param']['extra']+"</option>";
            } else {
                html = "<option value='0'>Select Option</option>";
            }
            $("#extra").html(html);
            $('#extra').trigger('chosen:updated');
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function saveApplicationStageBulkRequest() {
    $('#saveFollowUpButton').attr('disabled',true);
    var data = $('#bulkUpdateStageForm').serializeArray();
    $.ajax({
        url: jsVars.updateLeadStageBulkLink,
        type: 'post',
        dataType: 'json',
        data:data,
        beforeSend: function () {
            $('div#listloader').show();
        },
        complete: function () {
            $('div#listloader').hide();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json)
        {
            // $('#saveFollowUpButton').attr('disabled',false);
            if (json['redirect']) {
                location = json['redirect'];
            } else if (json['error']) {
                alertPopup(json['error'], 'error');
            } else if (json['status'] == 200) {
                $('#myModal').modal('hide');
                $("#followupModal").modal('hide');
                $('#stageChangePopup').find('#alertTitle').html('Stage Change Success');
//                if (json['downloadUrl']) {
//                    $('#stageChangePopup #downloadListing').attr('href',json['downloadUrl']);
//                    $('#stageChangePopup #showlink').show();
//                } else {
//                    $('#stageChangePopup #showlink').hide();
//                }
                $('#stageChangePopup').modal('show'); 
                $('#stageChangePopup .close').addClass('npf-close').css('margin-top', '2px');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
            $('#saveFollowUpButton').attr('disabled',false);
        }
    });

    return false;
}

$(document).on('submit', "#gdpi_book_slot_bulk", function(e) {
    e.preventDefault();
    
    var paramValue;
    var isValid = true;
    $(this).closest('form').find('.has-error').html('');
    var assignment_type = $(this).closest('form').find('.assignment_type:checked').val();
    if(assignment_type === 'manual') {
        $("#gdpi_book_slot_bulk").find('.bookingParam').each(function(){ 
           paramValue = $(this).val();
           if(paramValue === '0') {
               $(this).siblings('.has-error').html('Please select values');
               isValid = false;
           }
        });
    } else if(assignment_type === 'upload') {
        var csvFile = $('#uploadSlotBookingFile').val();
        if(csvFile === '') {
            $(this).closest('form').find('#uploadSlotBookingFile').siblings('.has-error').html('Select CSV file');
            isValid = false;
        }
    }
    if(isValid === false) {
        return;
    }
    var formData = new FormData(this);
    $.ajax({
        url: '/virtual-post-applications/bookGdpiSlotBulk',
        type: 'post',
        data: formData,
        async: false,
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        success: function (json) {
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(json['status'] ===1) {
                $('#slotAssignment').find('#alertTitle').html('Assign/Re-assign Slot');
                $('#slotAssignment').modal('show'); 
                $('#slotAssignment .close').addClass('npf-close').css('margin-top', '2px');
                $('#slotAssignmentModal').modal('hide');
            } else{
                alertPopup(json['message'], 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
});
