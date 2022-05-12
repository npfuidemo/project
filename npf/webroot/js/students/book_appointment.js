$(document).on('change', '#app_state_id', getCityList);
$(document).on('change', '#app_city_id', getAddressList);
$(document).on('change', '#app_address_id', getSlotUserList);
$(document).on('change', '#app_platform_id', getSlotUserList);
$(document).on('change', '#app_slot_user', getDateList);
$(document).on('change', '#app_slot_date', getTimeList);
$(document).on('change', '#app_slot_time', getExtraList);
$(document).on('click', '#book_gdpi_slot', bookGdpiSlot);
$(document).on('click', '#book_retake_gdpi_slot', bookRetakeGdpiSlot);
$(document).on('click', '#book_appointment_lm', bookAppointmentLm);
$(document).on('click', '#reschedule_gdpi_slot', rescheduleGdpiSlot);
$(document).on('click', '.assignment_type', changeAssignmentType);
$(document).on('click','.downloadSampleCSV', downloadSampleCSV);
$(document).on('click','#delete_appointment_lm', deleteAppointment);
$(document).on('click','#update_appointment_status_lm', updateAppointmentStatus);

$(document).on('change', '.bookingParam', function(){
    $(document).find('#book_appointment_lm').attr('disabled', false);
    $(document).find('#delete_appointment_lm').hide();
    $(document).find('#update_appointment_status_lm').hide();
    $(this).siblings('.validationError').html('');
});

var currentCollegeId = 0;
function getAppointmentProcess(collegeId, applicantId){
    $(".slot_msg").html('');
    $(".slot_msg").hide();
    $('.slot_msg').removeClass('error');
    $(".slotBookingDetailsDiv").html('');
    $("#processListDiv").show();
    $(".slotBookingDetailsDiv").show();
    currentCollegeId = collegeId;
    $.ajax({
        url: '/appointment-manager/get-process-list/'+collegeId,
        type: 'post',
        data: {collegeId:collegeId},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: false,
        beforeSend: function () { 
            processList               = [];
        },
        complete: function () {
            $('.chosen-select').chosen();
        },
        success: function (json) {
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(json['status'] ===1 && typeof json['data']['processList'] !== 'undefined') {
                processList               = json['data']['processList'];
                var processListDiv  = '<label class="floatify__label" for="process_name">Please Select Process Name</label><select name="process_id" id="process_id" applicantId="'+applicantId+'" class="chosen-select changeAppointmentProcess" tabindex="-1"><option value="">Select Process</option>';
                $.each(processList, function (index, item) {
                    processListDiv += '<option value="'+item['id']+'">'+item['name']+'</option>';
                });
                processListDiv += '</select>';
                $('#processListDiv').html(processListDiv);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function deleteAppointment(){
    var textForPopUp = 'Do you want to delete appointment ?';
    $('#ConfirmAlertYesBtn').unbind();
    $('#ConfirmAlertNoBtn').unbind();
    $("#ConfirmAlertPopUpSection").css({'z-index':'10000000'});
    $('#ConfirmAlertPopUpTextArea').html(textForPopUp);
    $("#ConfirmAlertPopUpTextArea").removeClass('font500');
    $('#ConfirmAlertPopUpSection .modal-title').html("Kindly Confirm");
    $("#ConfirmAlertPopUpSection").modal("show");
    $("#ConfirmAlertYesBtn").on("click",function(){
        var applicantId = $(document).find('#applicantId').val();
        var collegeId = $(document).find('#college_id').val();
        var processId = $(document).find('#process_id').val();
        $.ajax({
            url: jsVars.FULL_URL+'/appointment-manager/deleteAppointment/'+collegeId,
            type: 'post',
            data: {college_id:collegeId, 'process_id':processId, 'applicant_id':applicantId},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars.csrfToken
            },
            success: function (response) {
                if(response['status']===1){
                    $(document).find('select#process_id').trigger('change');
                    alertPopup('Appointment has been deleted', 'notification');
                }else{
                    if (response['message'] === 'session'){
                        location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                    }else{
                        alertPopup(response['message'], 'error');
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });
}

function updateAppointmentStatus(){
    $('#UpdateAppointmentCancel').unbind();
    $('#UpdateAppointmentSubmit').unbind();
    $(document).find('#appointmentRemarks').val('');
    $("#UpdateAppointmentPopUpSection").css({'z-index':'10000000'});
    $("#UpdateAppointmentPopUpSection").modal("show");
    $("#UpdateAppointmentSubmit").on("click",function(){
        var applicantId = $(document).find('#applicantId').val();
        var collegeId = $(document).find('#college_id').val();
        var processId = $(document).find('#process_id').val();
        var appointmentStatus = $(document).find('#appointmentStatus').val();
        var appointmentRemarks = $(document).find('#appointmentRemarks').val();
        var data = {'applicant_id':applicantId, 'college_id':collegeId, 'process_id':processId, 'status':appointmentStatus, 'remarks':appointmentRemarks};
        $.ajax({
            url: jsVars.FULL_URL+'/appointment-manager/updateAppointmentStatus/'+collegeId,
            type: 'post',
            data: data,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars.csrfToken
            },
            success: function (response) {
                if(response['status']===1){
                    $(document).find('select#process_id').trigger('change');
                    alertPopup('Appointment Status has been updated', 'notification');
                }else{
                    if (response['message'] === 'session'){
                        location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                    }else{
                        alertPopup(response['message'], 'error');
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });
}

$(document).on('change', '.changeAppointmentProcess', function(){
    var processId = $(this).val();
    var applicantId = $(this).attr('applicantId');
    if(processId === '' || processId === 0 || applicantId=== '' || applicantId === 0 || currentCollegeId === '' || currentCollegeId === 0) {
        $(".slotBookingDetailsDiv").html('');
        return;
    }
    $.ajax({
        url: '/appointment-manager/appointmentBookingThroughLm/'+currentCollegeId,
        type: 'post',
        data: {collegeId:currentCollegeId, 'processId':processId, 'applicantId':applicantId},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: false,
        beforeSend: function () { 
            $(".slotBookingDetailsDiv").html('');
        },
        complete: function () {
            $('.chosen-select').chosen();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status===1){
                if(responseObject.data.html) {
                    $(document).find(".slotBookingDetailsDiv").html(responseObject.data.html);
                }
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message, 'error');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
});

function downloadSampleCSV(){
    var processId = $("#process_id").val();
    if(processId !== '0' && processId !== '') {
        $.ajax({
            url: '/appointment-manager/getBookingParams',
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

function bookAppointmentLm() {
    var paramValue;
    var isValid = true;
    $(this).closest('form').find('.validationError').html('');
    $("#appointment_book_slot").find('.bookingParam').each(function(){ 
       paramValue = $(this).val();
       if(paramValue === '0') {
           $(this).siblings('.validationError').html('Please select values');
           isValid = false;
       }
    });
    var collegeId = $("#college_id").val();
    if(isValid === true) {
        $(this).closest('form').find('.validationError').html('');
        $.ajax({
            url: '/appointment-manager/applicantSlotBookingLm/'+collegeId,
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
                    $("#appointment_book_slot").find('.bookingParam').prop('disabled', true).trigger("chosen:updated");
                    $("#process_id").prop('disabled', true).trigger("chosen:updated");
                    $('.submitBtn').hide();
                    $('.slot_msg').removeClass('error');
                    $(".slot_msg").html('Appointment is booked for Applicant');
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
    $(this).closest('form').find('.validationError').html('');
    $("#gdpi_book_slot").find('.bookingParam').each(function(){ 
       paramValue = $(this).val();
       if(paramValue === '0') {
           $(this).parent().siblings('.validationError').html('Please select the slot values to book the slot.');
           isValid = false;
       }
    });
    if(isValid === true) {
        $(this).closest('form').find('.validationError').html('');
        $.ajax({
            url: '/appointment-manager/applicantSlotBooking',
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

function bookRetakeGdpiSlot() {
    var paramValue;
    var isValid = true;
    $(this).closest('form').find('.validationError').html('');
    $("#gdpi_retake_book_slot").find('.bookingParam').each(function(){ 
       paramValue = $(this).val();
       if(paramValue === '0') {
           $(this).parent().siblings('.validationError').html('Please select the slot values to book the slot.');
           isValid = false;
       }
    });
    if(isValid === true) {
        $(this).closest('form').find('.validationError').html('');
        $.ajax({
            url: '/appointment-manager/applicantRetakeSlotBooking',
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
    $(this).closest('form').find('.validationError').html('');
    $("#gdpi_book_slot").find('.bookingParam').each(function(){ 
       paramValue = $(this).val();
       if(paramValue === '0') {
           $(this).parent().siblings('.validationError').html('Please select the slot values to book the slot.');
           isValid = false;
       }
    });
    if(isValid === true) {
        $(this).closest('form').find('.validationError').html('');
        $.ajax({
            url: '/appointment-manager/applicantRescheduleSlot',
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
    if($("#app_extra").length === 0) {
        return;
    }
    var collegeId = $("#college_id").val();
    var mode = $("#mode").val();
    var processId = $("#process_id").val();
    var data = {'college_id':collegeId, 'process_id':processId, 'mode':mode};
    
    if(mode === 'offline') {
        var stateId = $("#app_state_id").val();
        var cityId = $("#app_city_id").val();
        var addressId = $("#app_address_id").val();
        if(typeof stateId === 'undefined') {
            data['stateId'] = 0;
        } else {
            data['stateId'] = stateId;
        }
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
        var platformId = $("#app_platform_id").val();
        if(typeof platformId === 'undefined') {
            data['platformId'] = 0;
        } else {
            data['platformId'] = platformId;
        }
    }
    var slotUserId = $("#app_slot_user").val();
    if(typeof slotUserId === 'undefined') {
        data['slotUser'] = 0;
    } else {
        data['slotUser'] = slotUserId;
    }
    var slotDate = $("#app_slot_date").val();
    if(typeof slotDate === 'undefined') {
        data['slotDate'] = 0;
    } else {
        data['slotDate'] = slotDate;
    }
    var slotTime = $("#app_slot_time").val();
    if(typeof slotTime === 'undefined') {
        data['slotTime'] = 0;
    } else {
        data['slotTime'] = slotTime;
    }
    
    $.ajax({
        url: '/appointment-manager/getExtraList/'+collegeId,
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
                $("#app_extra").html(html);
                $('#app_extra').trigger('chosen:updated');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getTimeList() {
    if($("#app_slot_time").length === 0) {
        getExtraList();
        return;
    }
    var collegeId = $("#college_id").val();
    var mode = $("#mode").val();
    var processId = $("#process_id").val();
    var data = {'college_id':collegeId, 'process_id':processId, 'mode':mode, 'fromFrontEnd':jsVars.fromFrontEnd};
    
    if(mode === 'offline') {
        var stateId = $("#app_state_id").val();
        var cityId = $("#app_city_id").val();
        var addressId = $("#app_address_id").val();
        if(typeof stateId === 'undefined') {
            data['stateId'] = 0;
        } else {
            data['stateId'] = stateId;
        }
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
        var platformId = $("#app_platform_id").val();
        if(typeof platformId === 'undefined') {
            data['platformId'] = 0;
        } else {
            data['platformId'] = platformId;
        }
    }
    var slotUserId = $("#app_slot_user").val();
    if(typeof slotUserId === 'undefined') {
        data['slotUser'] = 0;
    } else {
        data['slotUser'] = slotUserId;
    }
    var slotDate = $("#app_slot_date").val();
    if(typeof slotDate === 'undefined') {
        data['slotDate'] = 0;
    } else {
        data['slotDate'] = slotDate;
    }
    
    $.ajax({
        url: '/appointment-manager/getTimeList/'+collegeId,
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
                $("#app_slot_time").html(html);
                $('#app_slot_time').trigger('chosen:updated');
            }

            if(typeof json['data']['booking_param']['extra'] !== 'undefined') {
                html = "<option value='0'>Select "+json['data']['booking_param']['extra']+"</option>";
            } else {
                html = "<option value='0'>Select Option</option>";
            }
            $("#app_extra").html(html);
            $('#app_extra').trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function getDateList() {
    if($("#app_slot_date").length === 0) {
        getTimeList();
        return;
    }
    var collegeId = $("#college_id").val();
    var mode = $("#mode").val();
    var processId = $("#process_id").val();
    var data = {'college_id':collegeId, 'process_id':processId, 'mode':mode, 'fromFrontEnd':jsVars.fromFrontEnd};
    
    if(mode === 'offline') {
        var stateId = $("#app_state_id").val();
        var cityId = $("#app_city_id").val();
        var addressId = $("#app_address_id").val();
        if(typeof stateId === 'undefined') {
            data['stateId'] = 0;
        } else {
            data['stateId'] = stateId;
        }
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
        var platformId = $("#app_platform_id").val();
        if(typeof platformId === 'undefined') {
            data['platformId'] = 0;
        } else {
            data['platformId'] = platformId;
        }
    }
    var slotUserId = $("#app_slot_user").val();
    if(typeof slotUserId === 'undefined') {
        data['slotUser'] = 0;
    } else {
        data['slotUser'] = slotUserId;
    }
    
    $.ajax({
        url: '/appointment-manager/getDateList/'+collegeId,
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
                $("#app_slot_date").html(html);
                $('#app_slot_date').trigger('chosen:updated');
            }
            if(typeof json['data']['booking_param']['slot_time'] !== 'undefined') {
                html = "<option value='0'>Select "+json['data']['booking_param']['slot_time']+"</option>";
            } else {
                html = "<option value='0'>Select Option</option>";
            }
            $("#app_slot_time").html(html);
            $('#app_slot_time').trigger('chosen:updated');
            
            if(typeof json['data']['booking_param']['extra'] !== 'undefined') {
                html = "<option value='0'>Select "+json['data']['booking_param']['extra']+"</option>";
            } else {
                html = "<option value='0'>Select Option</option>";
            }
            $("#app_extra").html(html);
            $('#app_extra').trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getCityList() {
    if($("#app_state_id").length === 0) {
        getAddressList();
        return;
    }
    var collegeId = $("#college_id").val();
    var stateId = $("#app_state_id").val();
    var processId = $("#process_id").val();
    $.ajax({
        url: '/appointment-manager/getCityList/'+collegeId,
        type: 'post',
        data: {'college_id':collegeId, 'state_id':stateId, 'process_id':processId},
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            var html = "";
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL;
            } else if(json['status'] ===1 && typeof json['data']['city_list'] !== 'undefined') {
                if(typeof json['data']['booking_param']['city_id'] !== 'undefined') {
                    html = "<option value='0'>Select "+json['data']['booking_param']['city_id']+"</option>";
                } else {
                    html = "<option value='0'>Select Option</option>";
                }
                for (var key in json['data']['city_list']) {
                    html += "<option value='" + key + "'>" +json['data']['city_list'][key] + "</option>";
                }
                $("#app_city_id").html(html);
                $('#app_city_id').trigger('chosen:updated');
            }
            
            if(typeof json['data']['booking_param']['address_id'] !== 'undefined') {
                html = "<option value='0'>Select "+json['data']['booking_param']['address_id']+"</option>";
            } else {
                html = "<option value='0'>Select Option</option>";
            }
            $("#app_address_id").html(html);
            $('#app_address_id').trigger('chosen:updated');
            
            if(typeof json['data']['booking_param']['slot_user'] !== 'undefined') {
                html = "<option value='0'>Select "+json['data']['booking_param']['slot_user']+"</option>";
            } else {
                html = "<option value='0'>Select Option</option>";
            }
            $("#app_slot_user").html(html);
            $('#app_slot_user').trigger('chosen:updated');
            
            if(typeof json['data']['booking_param']['slot_date'] !== 'undefined') {
                html = "<option value='0'>Select "+json['data']['booking_param']['slot_date']+"</option>";
            } else {
                html = "<option value='0'>Select Option</option>";
            }
            $("#app_slot_date").html(html);
            $('#app_slot_date').trigger('chosen:updated');
            
            if(typeof json['data']['booking_param']['slot_time'] !== 'undefined') {
                html = "<option value='0'>Select "+json['data']['booking_param']['slot_time']+"</option>";
            } else {
                html = "<option value='0'>Select Option</option>";
            }
            $("#app_slot_time").html(html);
            $('#app_slot_time').trigger('chosen:updated');
            
            if(typeof json['data']['booking_param']['extra'] !== 'undefined') {
                html = "<option value='0'>Select "+json['data']['booking_param']['extra']+"</option>";
            } else {
                html = "<option value='0'>Select Option</option>";
            }
            $("#app_extra").html(html);
            $('#app_extra').trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getAddressList() {
    if($("#app_address_id").length === 0) {
        getSlotUserList();
        return;
    }
    var collegeId = $("#college_id").val();
    var stateId = $("#app_state_id").val();
    var cityId = $("#app_city_id").val();
    var processId = $("#process_id").val();
    $.ajax({
        url: '/appointment-manager/getAddressList/'+collegeId,
        type: 'post',
        data: {'college_id':collegeId, 'state_id':stateId, 'city_id':cityId, 'process_id':processId},
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
                $("#app_address_id").html(html);
                $('#app_address_id').trigger('chosen:updated');
            }
            if(typeof json['data']['booking_param']['slot_user'] !== 'undefined') {
                html = "<option value='0'>Select "+json['data']['booking_param']['slot_user']+"</option>";
            } else {
                html = "<option value='0'>Select Option</option>";
            }
            $("#app_slot_user").html(html);
            $('#app_slot_user').trigger('chosen:updated');
            
            if(typeof json['data']['booking_param']['slot_date'] !== 'undefined') {
                html = "<option value='0'>Select "+json['data']['booking_param']['slot_date']+"</option>";
            } else {
                html = "<option value='0'>Select Option</option>";
            }
            $("#app_slot_date").html(html);
            $('#app_slot_date').trigger('chosen:updated');
            
            if(typeof json['data']['booking_param']['slot_time'] !== 'undefined') {
                html = "<option value='0'>Select "+json['data']['booking_param']['slot_time']+"</option>";
            } else {
                html = "<option value='0'>Select Option</option>";
            }
            $("#app_slot_time").html(html);
            $('#app_slot_time').trigger('chosen:updated');
            
            if(typeof json['data']['booking_param']['extra'] !== 'undefined') {
                html = "<option value='0'>Select "+json['data']['booking_param']['extra']+"</option>";
            } else {
                html = "<option value='0'>Select Option</option>";
            }
            $("#app_extra").html(html);
            $('#app_extra').trigger('chosen:updated');
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getSlotUserList() {
    if($("#app_slot_user").length === 0) {
        getDateList();
        return;
    }
    var collegeId = $("#college_id").val();
    var processId = $("#process_id").val();
    var mode = $("#mode").val();
    var data = {'college_id':collegeId, 'process_id':processId, 'mode':mode, 'fromFrontEnd':jsVars.fromFrontEnd};
    if(mode === 'offline') {
        var stateId = $("#app_state_id").val();
        var cityId = $("#app_city_id").val();
        var addressId = $("#app_address_id").val();
        if(typeof stateId === 'undefined') {
            data['stateId'] = 0;
        } else {
            data['stateId'] = stateId;
        }
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
        var platformId = $("#app_platform_id").val();
        if(typeof platformId === 'undefined') {
            data['platformId'] = 0;
        } else {
            data['platformId'] = platformId;
        }
    }
    $.ajax({
        url: '/appointment-manager/getSlotUserList/'+collegeId,
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
            } else if(json['status'] ===1 && typeof json['data']['slotUser_list'] !== 'undefined') {
                if(typeof json['data']['booking_param']['slot_user'] !== 'undefined') {
                    html = "<option value='0'>Select "+json['data']['booking_param']['slot_user']+"</option>";
                } else {
                    html = "<option value='0'>Select Option</option>";
                }
                for (var key in json['data']['slotUser_list']) {
                    html += "<option value='" + key + "'>" +json['data']['slotUser_list'][key] + "</option>";
                }
                $("#app_slot_user").html(html);
                $('#app_slot_user').trigger('chosen:updated');
            }
            if(typeof json['data']['booking_param']['slot_date'] !== 'undefined') {
                html = "<option value='0'>Select "+json['data']['booking_param']['slot_date']+"</option>";
            } else {
                html = "<option value='0'>Select Option</option>";
            }
            $("#app_slot_date").html(html);
            $('#app_slot_date').trigger('chosen:updated');
            
            if(typeof json['data']['booking_param']['slot_time'] !== 'undefined') {
                html = "<option value='0'>Select "+json['data']['booking_param']['slot_time']+"</option>";
            } else {
                html = "<option value='0'>Select Option</option>";
            }
            $("#app_slot_time").html(html);
            $('#app_slot_time').trigger('chosen:updated');
            
            if(typeof json['data']['booking_param']['extra'] !== 'undefined') {
                html = "<option value='0'>Select "+json['data']['booking_param']['extra']+"</option>";
            } else {
                html = "<option value='0'>Select Option</option>";
            }
            $("#app_extra").html(html);
            $('#app_extra').trigger('chosen:updated');
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$(document).on('submit', "#book_bulk_appointment", function(e) {
    e.preventDefault();
    var collegeId = $("#user_college_id").val();
    var paramValue;
    var isValid = true;
    $(this).closest('form').find('.validationError').html('');
    $("#book_bulk_appointment").find('.bookingParam').each(function(){ 
        paramValue = $(this).val();
        if(paramValue === '0') {
            $(this).siblings('.validationError').html('Please select values');
            isValid = false;
        }
     });
    if(isValid === false) {
        return;
    }
    var formData = new FormData(this);
    $.ajax({
        url: '/appointment-manager/bookBulkAppointment/'+collegeId,
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
                $('#bulkAppointment').find('#alertTitle').html('Book Appointment');
                $('#bulkAppointment').modal('show'); 
                $('#bulkAppointment .close').addClass('npf-close').css('margin-top', '2px');
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

function bulkBookAppointment(){
    if(typeof is_filter_button_pressed =='undefined' || is_filter_button_pressed != 1){
        alertPopup('It seems you have changed the filter but not Applied it. Please re-check the same to proceed further.','error');
        return false;
    }
    if($("#user_college_id").val()=='' || $("#user_college_id").val()==0 || $("#user_college_id").val()==null){
        alertPopup('Please select college','error');
        return;
    }
    if($('input:checkbox[name="selected_users[]"]:checked').length < 1 && $('#select_all:checked').val()!=='select_all'){
        alertPopup('Please select User','error');
        return;
    }
    var collegeId = $("#user_college_id").val();
    $("#slotAssignmentModal").modal('show');
    $(".slot_msg").html('');
    $(".slot_msg").hide();
    $('.slot_msg').removeClass('error');
    $(".slotBookingDetailsDiv").html('');
    $("#processListDiv").show();
    $(".slotBookingDetailsDiv").show();
    $.ajax({
        url: '/appointment-manager/get-process-list/'+collegeId,
        type: 'post',
        data: {collegeId:collegeId},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: false,
        beforeSend: function () { 
            processList               = [];
        },
        complete: function () {
            $('.chosen-select').chosen();
        },
        success: function (json) {
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(json['status'] ===1 && typeof json['data']['processList'] !== 'undefined') {
                processList               = json['data']['processList'];
                var processListDiv  = '<label class="floatify__label float_addedd_js" for="process_name">Please Select Process Name</label><select name="process_id" id="process_id" class="chosen-select changeAppointmentProcessBulk" tabindex="-1"><option value="">Select Process</option>';
                $.each(processList, function (index, item) {
                    processListDiv += '<option value="'+item['id']+'">'+item['name']+'</option>';
                });
                processListDiv += '</select>';
                $('#processListDiv').html(processListDiv);
                floatableLabel();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$(document).on('change', '.changeAppointmentProcessBulk', function(){
    var processId = $(this).val();
    if(processId === '' || processId === 0) {
        $(".slotBookingDetailsDiv").html('');
        return;
    }
    var selectedApplicantId = [];
    var totalRecords = 0;
    if($('#select_all:checked').val() === 'select_all') {
        selectedApplicantId.push('all');
        totalRecords = $("#all_records_val").val();
    } else {
        var splitedUserId;
        $('input:checkbox[name="selected_users[]"]:checked').each(function(){
           splitedUserId = parseInt($(this).val().split('_')[0]);
           selectedApplicantId.push(splitedUserId);
        });
        totalRecords = selectedApplicantId.length;
    }
    if(selectedApplicantId.length === 0){
        alertPopup('Please select User','error');
        return;
    }
    var collegeId = $("#user_college_id").val();
    var filterVal = $("#leadsListFilters").val();
    $.ajax({
        url: '/appointment-manager/appointmentThroughLmBulk/'+collegeId,
        type: 'post',
        data: {collegeId:collegeId, 'processId':processId, 'selectedApplicantId':selectedApplicantId, 'totalRecords':totalRecords, 'filterVal':filterVal},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: false,
        beforeSend: function () { 
            $(".slotBookingDetailsDiv").html('');
        },
        complete: function () {
            $('.chosen-select').chosen();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status===1){
                if(responseObject.data.html) {
                    $(document).find(".slotBookingDetailsDiv").html(responseObject.data.html);
                }
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message, 'error');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
});