$(document).ready(function(){
    getAppointmentProcessDetails();
});
$(document).on('keydown', 'form', function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        return;
    }
});
var updateFieldMapping = 0;
var alphaNumericRegex = /^([a-zA-Z0-9 ]+)$/;

$(document).on('change', '.criteriaSelection', updateCriteriaSelection);
$(document).on('change', '.orCriteriaSelection', updateOrCriteriaSelection);
$(document).on('change', '.applicationStageSelection', getApplicationSubStage);
$(document).on('change', '.orApplicationStageSelection', getOrApplicationSubStage);
$(document).on('click', '.interviewMode', interviewMode);
$(document).on('click', '.bookingParams', bookingParam);
$(document).on('change', '.constructiveSelect', changeConstructiveSelect);
$(document).on('click', '.addNewSlotDetail', addNewSlotDetail);
$(document).on('click', '.saveBookingDetails', saveBookingDetails);
$(document).on('click', '.slotBookingTab', getAppointmentProcessDetails);
$(document).on('click', '.additionalSettingsTab', getGdpiAdditionalSettings);
$(document).on('click', '.communicationSettingsTab', getCommunicationSettings);
$(document).on('click', '.reschedualeSettingsTab', getRescheduleSettings);
$(document).on('click', '.retakeSettingsTab', getGdpiRetakeSettings);
$(document).on('click', '.gdpi_additional_settings_save', saveGdpiAdditionalSettings);
$(document).on('click', '.communication_settings_save', saveCommunicationSettings);
$(document).on('click', '.reschedule_settings_save', saveRescheduleSettings);
$(document).on('click', '.gdpi_retake_settings_save', saveGdpiRetakeSettings);
$(document).on('click','.uploadSlotDetails', updateSlotDetailsDiv);
$(document).on('click','.downloadSampleCSV', downloadSampleCSV);
$(document).on('click','.downloadSlotDetailsCSV', downloadSlotDetailsCSV);
$(document).on('click','.communicationMedium', communicationMedium);
$(document).on('click','.enableReschedule', enableReschedule);
$(document).on('click','.enableRetake', enableRetake);
$(document).on('click','.rescheduleStartDate', rescheduleStartDate);
$(document).on('click','.rescheduleEndDate', rescheduleEndDate);
$(document).on('click','.updateSlotDetails', updateSlotDetails);
$(document).on('click','.slot_booking_update', slotBookingUpdate);
$(document).on('click','.loadSlotDetails', loadSlotDetails);
$(document).on('click','.getNextSlotData', getNextSlotData);
$(document).on('click','.getNextSlotDetails', getNextSlotDetails);
$(document).on('click','.appointmentProcess', clickGdpiMainProcess);
$(document).on('click','#addMoreProcess', addMoreProcess);
$(document).on('click','.manualAllocation', manualAllocationSelection);
$(document).on('click','.candidateAllocation', candidateAllocationSelection);
$(document).on('click','.autoAllocation', autoAllocationSelection);
$(document).on('click','.formFieldRadio', formFieldRadio);
$(document).on('click','.autoAllocationBtn', autoAllocationContent);
$(document).on('click','#autoAllocate', autoAllocation);
$(document).on('change','.constructiveDocTemplate', addNewTemplate);
$(document).on('change','.constructiveCommTemplate', addNewTemplate);
$(document).on('click','.backButton', backStep);
$(document).on('click','.processStatus', changeProcessStatus);
$(document).on('click','.slotStatus', changeSlotStatus);
$(document).on('click','.slotPlatform', clickSlotParam);
$(document).on('click','.slotCity', clickSlotParam);
$(document).on('click','.slotAddress', clickSlotParam);
$(document).on('click','.slotExtra', clickSlotParam);
$(document).on('change','.bookingParamMapping', bookingParamMapping);
$(document).on('click','.slotDynamicDayCheckBox', slotDynamicDay);
$(document).on('click','.clearOrCondition', clearOrCondition);
$(document).on('click','.addOrCondition', addOrCondition);

function addOrCondition() {
    $(this).closest('form').find('.addOrConditionDiv').show();
    $(this).closest('form').find('.orConditionSpan').show();
    $(this).closest('form').find('.addOrCondition').hide();
    $(this).closest('form').find('#addOrConditionVal').val('1');
}

function clearOrCondition() {
    $(this).closest('form').find('.addOrConditionDiv').hide();
    $(this).closest('form').find('.orConditionSpan').hide();
    $(this).closest('form').find('.addOrCondition').show();
    $(this).closest('form').find('#addOrConditionVal').val('0');
}

function slotDynamicDay() {
    if($(this).is(":checked")) {
        $(this).closest('.row').find('#slotDynamicDayValue').attr('disabled', false);
    } else {
        $(this).closest('.row').find('#slotDynamicDayValue').val('');
        $(this).closest('.row').find('#slotDynamicDayValue').attr('disabled', true);
    }
}

function bookingParamMapping() {
    updateFieldMapping = 1;
}

function clickSlotParam() {
    if(updateFieldMapping === 0) {
        return;
    } 
    var id = $(this).attr('id');
    var collegeId = jsVars.collegeId;
    var processId = $(this).closest('form').find('#process_id').val();
    if(id === 'city_id') {
        updateTaxonomyOption('gdpi_interview_city_'+collegeId+'_'+processId, 'city_id', this);
    } else if(id === 'address_id') {
        updateTaxonomyOption('gdpi_interview_address_'+collegeId+'_'+processId, 'address_id', this);
    } else if(id === 'platform_id') {
        updateTaxonomyOption('gdpi_interview_platform_'+collegeId+'_'+processId, 'platform_id', this);
    } else if(id === 'extra') {
        updateTaxonomyOption('gdpi_interview_extra_'+collegeId+'_'+processId, 'extra', this);
    } else {
        return;
    }
}

function updateTaxonomyOption(machineKey, bookingParamId, thisObj) {
    var postData = $(thisObj).closest('form').serialize()+'&'+$.param({ 'machineKey': machineKey })+'&'+$.param({ 'taxonomyId': bookingParamId });
    $.ajax({
        url: '/appointment-manager/updateTaxonomyOption',
        type: 'post',
        data: postData,
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(typeof json['status'] !== 'undefined' && json['status'] ===1 && typeof json['data'][bookingParamId] !== 'undefined') {
                $(thisObj)[0].sumo.remove(json['data']['removeIndex']);
                $.each( json['data'][bookingParamId], function( index, value ){
                    $(thisObj)[0].sumo.add(''+index,value);
                });
                $(thisObj)[0].sumo.add('addNewOption','Add New');
            } else{
                alertPopup(json['message'], 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    updateFieldMapping = 0;
}

function changeSlotStatus() {
    var status = 0;
    if($(this).is(":checked")) {
        status = 1;
    }
    var slotId = $(this).attr('slotId');
    $.ajax({
        url: '/appointment-manager/updateSlotStatus/'+jsVars.collegeId,
        type: 'post',
        data: {'slotId':slotId, 'status':status},
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function changeProcessStatus() {
    var status = 0;
    var thisObj = $(this);
    if($(this).is(":checked")) {
        status = 1;
        $(this).prop('checked', false);
    } else {
        $(this).prop('checked', true);
    }
    var textForPopUp = 'Do you want to disable this process ?';
    var successTextForPopUp = 'This process is disabled successfully.';
    if(status===1){
        textForPopUp = 'Do you want to enable this process ?';
        successTextForPopUp = 'This process is enabled successfully.';
    }
    var processId = $(this).attr('processId');
    $("#ConfirmPopupArea").css('z-index',11001);
    $('#ConfirmPopupArea .npf-close').hide();
    $('#ConfirmMsgBody').html(textForPopUp);
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/appointment-manager/updateProcessStatus/'+jsVars.collegeId,
            type: 'post',
            data: {'processId':processId, 'collegeId':jsVars.collegeId, 'status':status},
            async: false,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                if(json['status'] ===0 && json['message'] === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }
                alertPopup(successTextForPopUp, 'notification');
                if(status === 1) {
                    $(thisObj).prop('checked', true);
                } else {
                    $(thisObj).prop('checked', false);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        $('#ConfirmPopupArea').modal('hide');
    });
}

function backStep() {
    var panelBodyId = "#"+$(this).attr('id');
    var backStep = "."+$(this).attr('backStep');
    $(panelBodyId).find(backStep).trigger('click');
}

var redirectDocumentTemplate = function(tid,tname){
    $('#templateModal').modal('hide');
    $('select.addNewTemplate')[0].sumo.add(tid,tname, -1);
    $('select.addNewTemplate')[0].sumo.selectItem(tid);
    $(document).find('select').removeClass('addNewTemplate');
};

var redirectCommunicationTemplate = function(tid,tname){
    $('#templateModal').modal('hide');
    $(document).find('select.addNewTemplate')[0].sumo.add(tid,tname, -1);
    $(document).find('select.addNewTemplateOption')[0].sumo.add(tid,tname, -1);
    $(document).find('select.addNewTemplate')[0].sumo.selectItem(tid);
};

function addNewTemplate(){
    $(document).find('select').removeClass('addNewTemplate');
    $(document).find('select').removeClass('addNewTemplateOption');
    if( $(this).val()==="addNewTemplate" ){
        $(this).addClass('addNewTemplate');
        createDocumentTemplate();
    } else if( $(this).val()==="addNewCommuTemplate" ){
        var sumoSelectId = $(this).attr('id');
        $(this).addClass('addNewTemplate');
        if(sumoSelectId === 'booking_email_template') {
            $(this).closest('form').find('#reschedule_email_template').addClass('addNewTemplateOption');
        }
        if(sumoSelectId === 'reschedule_email_template') {
            $(this).closest('form').find('#booking_email_template').addClass('addNewTemplateOption');
        }
        if(sumoSelectId === 'booking_sms_template') {
            $(this).closest('form').find('#reschedule_sms_template').addClass('addNewTemplateOption');
        }
        if(sumoSelectId === 'reschedule_sms_template') {
            $(this).closest('form').find('#booking_sms_template').addClass('addNewTemplateOption');
        }
        if(sumoSelectId === 'booking_whatsapp_template') {
            $(this).closest('form').find('#reschedule_whatsapp_template').addClass('addNewTemplateOption');
        }
        if(sumoSelectId === 'reschedule_whatsapp_template') {
            $(this).closest('form').find('#booking_whatsapp_template').addClass('addNewTemplateOption');
        }
        createCommunicationTemplate(sumoSelectId);
    }
}

function createCommunicationTemplate(sumoSelectId){
    $('#templateModal').modal('show');
    var iframeSrc;
    if(sumoSelectId === 'booking_email_template' || sumoSelectId === 'reschedule_email_template') {
        iframeSrc = jsVars.createEmailTemplateLink+'/'+sumoSelectId;
    } else if(sumoSelectId === 'booking_sms_template' || sumoSelectId === 'reschedule_sms_template') {
        iframeSrc = jsVars.createSmsTemplateLink+'/'+sumoSelectId;
    } else if(sumoSelectId === 'booking_whatsapp_template' || sumoSelectId === 'reschedule_whatsapp_template') {
        iframeSrc = jsVars.createWhatsappTemplateLink+'/'+sumoSelectId;
    }
    $("#templateModal iframe").attr({
            'src':iframeSrc
    });
    $('#templateModal').on('hidden.bs.modal', function(){
        $("#modalIframeEmbed").html("");
        $("#modalIframeEmbed").attr("src", "");
    });
}

function createDocumentTemplate(){
    $('#templateModal').modal('show');
    $("#templateModal iframe").attr({
            'src':jsVars.createDocumentTemplateLink
    });
    $('#templateModal').on('hidden.bs.modal', function(){
        $("#modalIframeEmbed").html("");
        $("#modalIframeEmbed").attr("src", "");
    });
}

function autoAllocation() {
    $('#allocateModal').modal('hide');
    var processId = $(document).find('#allocateGdpiProcessId').val();
    var assignmentType = $('input[name="slotAssignmentType"]:checked').val();
    $.ajax({
        url: '/appointment-manager/autoSlotAllocation',
        type: 'post',
        data: {'collegeId':jsVars.collegeId, 'formId':jsVars.formId, 'processId':processId, 'assignmentType':assignmentType},
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(json['status'] ===1) {
                $('#autoAllocatePopup').find('#alertTitle').html('Auto Allocation Request');
                $('#autoAllocatePopup #showlink').hide();
                $('#autoAllocatePopup').modal('show'); 
                $('#autoAllocatePopup .close').addClass('npf-close').css('margin-top', '2px');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function autoAllocationContent() {
    $(document).find('#modalBodyContent').html();
    var processId = $(this).attr('id');
    if($(document).find('#processStatus'+processId).is(":checked")) {
        $(document).find('#modalBodyFooter').show();
        $(document).find('#modalBodyTitle').html('Allocate Slots');
    } else {
        $(document).find('#modalBodyTitle').html('Error');
        $(document).find('#modalBodyContent').html('<p>Process is not Enable. Please enable process for slot allocation.</p>');
        $(document).find('#modalBodyFooter').hide();
        return;
    }
    $.ajax({
        url: '/appointment-manager/getAutoAllocationCount',
        type: 'post',
        data: $(this).closest('form').serialize(),
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(json['status'] ===1) {
                var modalBodyContent = '';
                if(json['data']['avaliable'] === 0) {
                    $(document).find('#modalBodyTitle').html('Error');
                    modalBodyContent = '<p>There is no available slot.</p>';
                    $(document).find('#modalBodyFooter').hide();
                } else if(json['data']['assigned'] === 0) {
                    modalBodyContent = '<p>Currently '+json['data']['total']+' candidate fall into the selected Application criteria for allocating slots for this process.</p>';
                    modalBodyContent += '<p>Would you like to proceed and allocate the slots to them?</p><div style="display:none"><input type="radio" id="newSlotAssignment" value="new" name="slotAssignmentType" checked></div>';
                    modalBodyContent += '<p>Total available slots are <b>'+json['data']['avaliable']+'</b></p>';
                } else {
                    modalBodyContent = '<p>Currently '+json['data']['total']+' candidate fall into the selected Application criteria for allocating slots for this process.</p><p>The slots has already been allocated to '+json['data']['assigned']+' candidates, how would you like to proceed?</p>';
                    modalBodyContent += '<div class="ml-5"><label class="radio"><input type="radio" id="newSlotAssignment" value="new" name="slotAssignmentType" checked>Assign slots to '+(json['data']['total'] - json['data']['assigned'])+' new applicants</label>';
                    modalBodyContent += '<label class="radio"><input type="radio" id="slotReassignment" value="reassign" name="slotAssignmentType">Reassign slots to all '+json['data']['total']+' applicants</label></div>';
                    modalBodyContent += '<p>Total available slots are <b>'+json['data']['avaliable']+'</b></p>';
                }
                $(document).find('#allocateGdpiProcessId').val(processId);
                $(document).find('#modalBodyContent').html(modalBodyContent);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
}

function formFieldRadio() {
    var checkedVal = parseInt($(this).val());
    if(checkedVal ===1) {
        $(this).closest('form').find('input:checkbox.bookingParams').each(function () {
            if(this.checked) {
                $(this).closest('.row').find('.bookingParamMapping').parent().parent().show();
            }
        });
    } else {
        $(this).closest('form').find('.bookingParamMapping').parent().parent().hide();
        $(this).closest('form').find('.bookingParamMapping').each(function(){
            $(this)[0].sumo.selectItem(0); 
        });
    }
}

function loadFormFields(thisObj) {
    var bookingParams = [];
    $(thisObj).closest('form').find('input:checkbox.bookingParams').each(function () {
        if(this.checked) {
            var checkedParamId = $(this).attr('id');
            if(checkedParamId === 'onlinePlatformCheckbox') {
                bookingParams.push('platform_id');
            } else if(checkedParamId === 'onlineDateCheckbox' || checkedParamId === 'offlineDateCheckbox') {
                bookingParams.push('slot_date');
            } else if(checkedParamId === 'onlineTimeSlotCheckbox' || checkedParamId === 'offlineTimeSlotCheckbox') {
                bookingParams.push('slot_time');
            } else if(checkedParamId === 'offlineCityCheckbox') {
                bookingParams.push('city_id');
            } else if(checkedParamId === 'offlineVenueCheckbox') {
                bookingParams.push('address_id');
            }
        }
    });
    var formFieldDiv = $(thisObj).closest('form').find('.formFieldYesDiv');
    $.ajax({
        url: '/appointment-manager/getFormFields',
        type: 'post',
        data: {'collegeId':jsVars.collegeId, 'formId':jsVars.formId},
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(json['status'] ===1 && typeof json['data']['dropdownList'] !== 'undefined') {
                formFieldDiv.html('');
                var fieldSelectHtml = '<option value="">Select Form Field</option>';
                $.each( json['data']['dropdownList'], function( index, value ){
                    fieldSelectHtml += '<option value="'+index+'">'+value+'</option>';
                });
                $(thisObj).closest('form').find('input:checkbox.bookingParams').each(function () {
                    if(this.checked) {
                        var checkedParamId = $(this).attr('id');
                        var fieldHtml = '<div class="row"><div class="col-sm-4">';
                        if(checkedParamId === 'onlinePlatformCheckbox') {
                            fieldHtml += 'Platform</div><div class="col-sm-8"><select name="form_mapping[fieldMapping][platform_id]" class="form-control formFieldMapping">'+fieldSelectHtml;
                        } else if(checkedParamId === 'onlineDateCheckbox' || checkedParamId === 'offlineDateCheckbox') {
                            fieldHtml += 'Date</div><div class="col-sm-8"><select name="form_mapping[fieldMapping][slot_date]" class="form-control formFieldMapping">'+fieldSelectHtml;
                        } else if(checkedParamId === 'onlineTimeSlotCheckbox' || checkedParamId === 'offlineTimeSlotCheckbox') {
                            fieldHtml += 'Interview Time Slot</div><div class="col-sm-8"><select name="form_mapping[fieldMapping][slot_time]" class="form-control formFieldMapping">'+fieldSelectHtml;
                        } else if(checkedParamId === 'offlineCityCheckbox') {
                            fieldHtml += 'City</div><div class="col-sm-8"><select name="form_mapping[fieldMapping][city_id]" class="form-control formFieldMapping">'+fieldSelectHtml;
                        } else if(checkedParamId === 'offlineVenueCheckbox') {
                            fieldHtml += 'Venue Address</div><div class="col-sm-8"><select name="form_mapping[fieldMapping][address_id]" class="form-control formFieldMapping">'+fieldSelectHtml;
                        }
                        fieldHtml += '</select></div>';
                        fieldHtml += '</div></div>';
                        formFieldDiv.append(fieldHtml);
                    }
                });
                $('.formFieldMapping').SumoSelect({placeholder: '', search: true, searchText: 'Search', triggerChangeCombined: false});
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function autoAllocationSelection() {
    $(this).closest('form').find('.inputManualSlotsRadio').attr('disabled', false);
    $(this).closest('form').find('.uploadSlotDetails').removeAttr('checked');
    $(this).closest('form').find('.inputManualSlotsRadio').prop('checked', true);
    $(this).closest('form').find('.inputManuallySlots').show();
    $(this).closest('form').find('.eligibilityCriteriaRow').show();
    $(this).closest('form').find('.uploadOfflineSlots').hide();
    $(this).closest('form').find('.formFieldMappingRadio').show();
    $(this).closest('form').find('.autoAllocationBtn').show();
    $(this).closest('form').find('.formFieldNo').prop('checked', true);
    $(this).closest('form').find('.bookingParamMapping').parent().parent().hide();
    $(this).closest('form').find('.bookingParamMapping').each(function(){
        $(this)[0].sumo.selectItem(0); 
    });
    
    $(this).closest('form').find('.addOrConditionDiv').hide();
    $(this).closest('form').find('.orConditionSpan').hide();
    $(this).closest('form').find('.addOrCondition').hide();
    $(this).closest('form').find('#addOrConditionVal').val('0');
    $(this).closest('form').find('.stageSelectionRow').removeClass('block_first');
}

function candidateAllocationSelection() {
    $(this).closest('form').find('.inputManualSlotsRadio').attr('disabled', false);
    //$(this).closest('form').find('.uploadSlotDetails').removeAttr('checked');
    //$(this).closest('form').find('.inputManualSlotsRadio').prop('checked', true);
    //$(this).closest('form').find('.inputManuallySlots').show();
    //$(this).closest('form').find('.uploadOfflineSlots').hide();
    $(this).closest('form').find('.formFieldMappingRadio').hide();
    $(this).closest('form').find('.autoAllocationBtn').hide();
    $(this).closest('form').find('.eligibilityCriteriaRow').show();
    $(this).closest('form').find('.formFieldNo').prop('checked', true);
    $(this).closest('form').find('.bookingParamMapping').parent().parent().hide();
    $(this).closest('form').find('.bookingParamMapping').each(function(){
        $(this)[0].sumo.selectItem(0); 
    });
    
    $(this).closest('form').find('.addOrConditionDiv').hide();
    $(this).closest('form').find('.orConditionSpan').hide();
    $(this).closest('form').find('.addOrCondition').show();
    $(this).closest('form').find('#addOrConditionVal').val('0');
    $(this).closest('form').find('.stageSelectionRow').addClass('block_first');
}

function manualAllocationSelection() {
    $(this).closest('form').find('.uploadSlotDetails').removeAttr('checked');
    $(this).closest('form').find('.uploadOfflineSlotsRadio').prop('checked', true);
    $(this).closest('form').find('.inputManualSlotsRadio').attr('disabled', true);
    $(this).closest('form').find('.inputManuallySlots').hide();
    $(this).closest('form').find('.uploadOfflineSlots').show();
    $(this).closest('form').find('.formFieldMappingRadio').hide();
    $(this).closest('form').find('.autoAllocationBtn').hide();
    $(this).closest('form').find('.eligibilityCriteriaRow').hide();
    $(this).closest('form').find('#gdpiCriteria')[0].sumo.selectItem(0);
    $(this).closest('form').find('.formFieldNo').prop('checked', true);
    $(this).closest('form').find('.bookingParamMapping').parent().parent().hide();
    $(this).closest('form').find('.bookingParamMapping').each(function(){
        $(this)[0].sumo.selectItem(0); 
    });
    
    $(this).closest('form').find('.addOrConditionDiv').hide();
    $(this).closest('form').find('.orConditionSpan').hide();
    $(this).closest('form').find('.addOrCondition').hide();
    $(this).closest('form').find('#addOrConditionVal').val('0');
    $(this).closest('form').find('.stageSelectionRow').removeClass('block_first');
}

function clickGdpiMainProcess() {
    var processId = $(this).attr('id');
    var tempProcessId = $(this).attr('tempProcessId');
    getAjaxProcessDetails(processId, tempProcessId);
    $(document).find('.additionalSettingsDiv').html('');
}

function getNextSlotData() {
    var processId = $(this).closest('.getSlotDetails').attr('id');
    var page = $(this).attr('id');
    var collegeId = jsVars.collegeId;
    getAjaxSlotDetails(this, processId, collegeId, page);
}
function getNextSlotDetails() {
    var processId = $(this).closest('.getSlotDetails').attr('id');
    var page = $(this).attr('id');
    var collegeId = jsVars.collegeId;
    getAjaxSlotDetails(this, processId, collegeId, page, 0);
    $(this).closest('form').find('.addNewSlotDetail').show();
}

function loadSlotDetails() {
    $(document).find('.getSlotDetails .reviewSlotTable').html('');
    var processId = $(this).attr('id');
    var collegeId = jsVars.collegeId;
    getAjaxSlotDetails(this, processId, collegeId);
}


function getAjaxSlotDetails(thisObj, processId, collegeId, page=0, withBookedSlot=1){
    $.ajax({
        url: '/appointment-manager/getSlotBookingDetails/'+collegeId,
        type: 'post',
        data: {'processId': processId, 'collegeId':collegeId, 'page':page, 'withBookedSlot':withBookedSlot},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (response) { 
            var responseObject = $.parseJSON(response);
            if(responseObject.status===1){
                if(withBookedSlot === 1 && responseObject.data.slotCount !== 0) {
                    $(document).find('.slotDetailsReviewIcon').show();
                }
                if(responseObject.data.html) {
                    $(thisObj).closest('.getSlotDetails').find('.reviewSlotTable').html(responseObject.data.html);
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
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function slotBookingUpdate() {
    event.preventDefault();
    var slotCapacity;
    var bookedSlot;
    var isValid = true;
    $(this).closest('form').find('input:text.slotCapacityVal').each(function () {
        slotCapacity = parseInt($(this).val());
        bookedSlot = parseInt($(this).siblings('.hiddenBookedSlot').val());
        if(slotCapacity < bookedSlot) {
            $(this).parent().siblings('.validationError').html('You can not change the slot capacity to a lesser value than the Booked Slot count');
            $(this).parent().siblings('.validationError').show();
            isValid = false;
        }
    });
    var thisObj = $(this);
    if(isValid === true) {
        $(this).closest('form').find('input:text.slotCapacityVal').each(function () {
            slotCapacity = parseInt($(this).val());
            $(this).closest('td').find('.slotCapacity').html(slotCapacity);
        });
        $.ajax({
            url: '/appointment-manager/updateSlotCapacity/'+jsVars.collegeId,
            type: 'post',
            data: $(this).closest('form').serialize(),
            async: false,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                if(json['status'] ===0 && json['message'] === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else if(json['status'] ===1 || json['status'] ===true) {
                    thisObj.closest('.reviewSlotDetails').find('.slotCapacity').show();
                    thisObj.closest('.reviewSlotDetails').find('.editSlotCapacity').hide();
                    thisObj.closest('.reviewSlotDetails').find('.updateSlotBookingDiv').hide();
                    thisObj.closest('.reviewSlotDetails').find('.validationError').html('');
                    thisObj.closest('.reviewSlotDetails').find('.validationError').hide();
                    alertPopup('Slot booking capacity updated');
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

function updateSlotDetails() {
    $(this).closest('.reviewSlotDetails').find('.slotCapacity').toggle();
    $(this).closest('.reviewSlotDetails').find('.editSlotCapacity').toggle();
    $(this).closest('.reviewSlotDetails').find('.updateSlotBookingDiv').toggle();
    $(this).closest('.reviewSlotDetails').find('.validationError').hide();
    $(this).closest('.reviewSlotDetails').find('.validationError').html('');
}

function rescheduleStartDate() {
    var startType = $(this).val();
    if(startType === 'fixed') {
        $(this).closest('form').find('.rescheduleFixedStartDate').show();
        $(this).closest('form').find('.rescheduleDynamicStartDays').hide();
    } else {
        $(this).closest('form').find('.rescheduleFixedStartDate').hide();
        $(this).closest('form').find('.rescheduleDynamicStartDays').show();
    }
}

function rescheduleEndDate() {
    var startType = $(this).val();
    if(startType === 'fixed') {
        $(this).closest('form').find('.rescheduleFixedEndDate').show();
        $(this).closest('form').find('.rescheduleDynamicEndDays').hide();
    } else {
        $(this).closest('form').find('.rescheduleFixedEndDate').hide();
        $(this).closest('form').find('.rescheduleDynamicEndDays').show();
    }
}

function enableReschedule() {
    var enableReschedule = $(this).val();
    if(enableReschedule === '1') {
        $(this).closest('form').find('.rescheduleSettings').show();
    } else {
        $(this).closest('form').find('.rescheduleSettings').hide();
    }
}

function enableRetake() {
    var enableRetake = $(this).val();
    if(enableRetake === '1') {
        $(this).closest('form').find('.retakeSettings').show();
    } else {
        $(this).closest('form').find('.retakeSettings').hide();
    }
}

function communicationMedium() {
    var id = $(this).attr('id');
    var checkedVal;
    var checked = 0;
    var sumoSelectId;
    var communicationMediumDiv;
    if(id === 'bookingEmail') {
        checkedVal = $(this).closest('form').find('#bookingEmail:checked').val();
        $(this).closest('form').find(".bookingAttachment").removeAttr('checked');
        if(typeof checkedVal !== 'undefined') {
            checked = 1;
            $(this).closest('form').find(".bookingAttachment").attr('disabled', false);
        } else {
            $(this).closest('form').find(".bookingAttachment").attr('disabled', true);
        }
        sumoSelectId = '#booking_email_template';
        communicationMediumDiv = '#bookingEmailDiv';
    } else if(id === 'bookingSMS') {
        checkedVal = $(this).closest('form').find('#bookingSMS:checked').val();
        if(typeof checkedVal !== 'undefined') {
            checked = 1;
        }
        sumoSelectId = '#booking_sms_template';
        communicationMediumDiv = '#bookingSmsDiv';
    } else if(id === 'bookingWhatsApp') {
        checkedVal = $(this).closest('form').find('#bookingWhatsApp:checked').val();
        if(typeof checkedVal !== 'undefined') {
            checked = 1;
        }
        sumoSelectId = '#booking_whatsapp_template';
        communicationMediumDiv = '#bookingWhatsAppDiv';
    } else if(id === 'rescheduleEmail') {
        checkedVal = $(this).closest('form').find('#rescheduleEmail:checked').val();
        $(this).closest('form').find(".rescheduleAttachment").removeAttr('checked');
        if(typeof checkedVal !== 'undefined') {
            checked = 1;
            $(this).closest('form').find(".rescheduleAttachment").attr('disabled', false);
        } else {
            $(this).closest('form').find(".rescheduleAttachment").attr('disabled', true);
        }
        sumoSelectId = '#reschedule_email_template';
        communicationMediumDiv = '#rescheduleEmailDiv';
    } else if(id === 'rescheduleSMS') {
        checkedVal = $(this).closest('form').find('#rescheduleSMS:checked').val();
        if(typeof checkedVal !== 'undefined') {
            checked = 1;
        }
        sumoSelectId = '#reschedule_sms_template';
        communicationMediumDiv = '#rescheduleSmsDiv';
    } else if(id === 'rescheduleWhatsApp') {
        checkedVal = $(this).closest('form').find('#rescheduleWhatsApp:checked').val();
        if(typeof checkedVal !== 'undefined') {
            checked = 1;
        }
        sumoSelectId = '#reschedule_whatsapp_template';
        communicationMediumDiv = '#rescheduleWhatsAppDiv';
    }
    if(typeof sumoSelectId !== 'undefined') {
        updateCommunicationMediumOption(this, sumoSelectId, checked);
    }
    if(typeof communicationMediumDiv !== 'undefined') {
        updateCommunicationMediumDiv(this, communicationMediumDiv, checked);
    }
    
}

function updateCommunicationMediumOption(thisObj, sumoSelectId, checked=0) {
    if(checked === 1) {
        $(thisObj).closest('form').find(sumoSelectId)[0].sumo.enable();
    } else {
        $(thisObj).closest('form').find(sumoSelectId)[0].sumo.disable();
    }
}
function updateCommunicationMediumDiv(thisObj, communicationMediumDiv, checked=0) {
    if(checked === 1) {
        $(thisObj).closest('form').find(communicationMediumDiv).show();
    } else {
        $(thisObj).closest('form').find(communicationMediumDiv).hide();
    }
    if(communicationMediumDiv === '#bookingEmailDiv') {
        $(thisObj).closest('form').find('.emailTemplateError').html('');
    } else if(communicationMediumDiv === '#bookingSmsDiv') {
        $(thisObj).closest('form').find('.smsTemplateError').html('');
    } else if(communicationMediumDiv === '#bookingWhatsAppDiv') {
        $(thisObj).closest('form').find('.whatsappTemplateError').html('');
    }
}


function downloadSampleCSV(){
    var isValid = true;
    var checkedBookingParam = $(this).closest('form').find(".bookingParams:checked").length;
    if(checkedBookingParam === 0) {
        $(this).closest('form').find('.bookingParamError').html('Please select booking params');
        return;
    }
    var thisObj = $(this).closest('form');
    $.each( $(this).closest('form').find(".bookingParamsText"), function(){
        if($(this).val() !== '' && !alphaNumericRegex.test($(this).val())) {
            $(thisObj).find('.bookingParamError').html('Only alphanumeric values is allowed in booking alias name');
            isValid = false;
        }
    });
    if(isValid === false) {
        return;
    }
    $(this).closest('form').find('.bookingParamError').html('');
    var processId = $(this).attr('id');
    if(processId !== '0' && processId !== '') {
        $.ajax({
            url: '/appointment-manager/getSampleFile/'+jsVars.collegeId,
            type: 'post',
            data: $(this).closest('form').serialize(),
            async: false,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                if(json['status'] ===0 && json['message'] === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else if(json['status'] ===1 || json['status'] ===true) {
                    var downloadUrl = json['data']['downloadUrl'];
                    if(downloadUrl!=='' && downloadUrl !==null){
                       downloadFileFromUrl(downloadUrl);
                    }
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

var downloadFileFromUrl = function(url){
    window.open(url, "_self");
};

function downloadSlotDetailsCSV(){
    var processId = $(this).attr('id');
    var collegeId = jsVars.collegeId;
    if(processId !== '0' && processId !== '') {
        $.ajax({
            url: '/appointment-manager/slotBookingDetailsForCsv/'+collegeId,
            type: 'post',
            data: {'processId': processId, 'collegeId':collegeId},
            async: false,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                if(json['status'] ===0 && json['message'] === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else if(json['status'] ===1 || json['status'] ===true) {
                    var downloadUrl = json['data']['downloadUrl'];
                    if(downloadUrl!=='' && downloadUrl !==null){
                       downloadFileFromUrl(downloadUrl);
                    }
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

function updateSlotDetailsDiv(){
    var inputValue = $(this).attr("value");
    var targetBox = $("#" + inputValue);
    $(this).closest('.row').find(".box").not(targetBox).hide();
    $(targetBox).show();
    $(this).closest('form').find('.addNewSlotDetail').hide();
}

function saveBookingDetails() {
    var checkedBookingParam = $(this).closest('form').find(".bookingParams:checked").length;
    if(checkedBookingParam === 0) {
        $(this).closest('form').find('.bookingParamError').html('Please select booking params');
        return;
    }
    var thisObj = $(this).closest('form');
    $.each( $(this).closest('form').find(".bookingParamsText"), function(){
        if($(this).val() !== '' && !alphaNumericRegex.test($(this).val())) {
            $(thisObj).find('.bookingParamError').html('Only alphanumeric values is allowed in booking alias name');
            isValid = false;
        }
    });
    if(isValid === false) {
        return;
    }
    $(this).closest('form').find('.bookingParamError').html('');
    $(this).closest('form').find('.slotValidationError').html('');
    var bookingDetailVal = {};
    var slotVal = '';
    var isValid = true;
    $(this).closest('tr').find('.slotBookingParamValue').each(function(){
        if($(this).hasClass('constructiveSelect')){
            slotVal = $(this).find('option:selected').text();
            if(slotVal === 'Add New' && $(this).closest('td').css('display') !== 'none') {
                if($(this).closest('td').find('.addOption').val() === '') {
                    $(this).closest('td').find('.slotValidationError').html('Required field');
                    isValid = false;
                } else {
                    $(this).closest('td').find('.slotValidationError').html('');
                }
            } else {
                $(this).closest('td').find('.slotValidationError').html('');
            }
            bookingDetailVal[$(this).attr('name')] = $(this).find('option:selected').text();
        } else if($(this).attr('type') !=='hidden') {
            if($(this).closest('td').css('display') !== 'none' && $(this).val() === '') {
                $(this).closest('td').find('.slotValidationError').html('Required Field');
                isValid = false;
            } else {
                $(this).closest('td').find('.slotValidationError').html('');
            }
            bookingDetailVal[$(this).attr('name')] = $(this).val();
        }
    });
    if($(document).find('.slotCapacityValue').val() == '0') {
        $(document).find('.slotCapacityError').html('should be greater than 0');
        isValid = false;
    }
    if(isValid !== true) {
        return;
    }
    var thisObj = $(this);
    $.ajax({
        url: '/appointment-manager/save-slot-booking-details/'+jsVars.collegeId,
        type: 'post',
        data: $(this).closest('form').serialize(),
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(json['status'] ===1 || json['status'] ===true) {
                var taxArr = json['data']['taxArr'];
                var bookingDetailHtml = '<tr>';
                if(typeof json['data']['bookingParam']['stateCheckbox'] !== 'undefined' && json['data']['bookingParam']['stateCheckbox'] === 'on') {
                    if(bookingDetailVal['slot_data[state_id]'] === 'Add New') {
                        if(typeof taxArr['state_id']['exists'] === 'undefined') {
                            thisObj.closest('form').find('.slotState')[0].sumo.remove(taxArr['state_id']['length']);
                            thisObj.closest('form').find('.slotState')[0].sumo.add(''+taxArr['state_id']['taxId'],taxArr['state_id']['taxVal']);
                            thisObj.closest('form').find('.slotState')[0].sumo.add('addNewOption','Add New');
                        }
                        bookingDetailHtml += '<td class="state_id_td bookingTd">'+taxArr['state_id']['taxVal']+'</td>';
                    } else {
                        bookingDetailHtml += '<td class="state_id_td bookingTd">'+bookingDetailVal['slot_data[state_id]']+'</td>';
                    }
                } else {
                    bookingDetailHtml += '<td class="state_id_td bookingTd" style="display:none"></td>';
                }
                if(typeof json['data']['bookingParam']['cityCheckbox'] !== 'undefined' && json['data']['bookingParam']['cityCheckbox'] === 'on') {
                    if(bookingDetailVal['slot_data[city_id]'] === 'Add New') {
                        if(typeof taxArr['city_id']['exists'] === 'undefined') {
                            thisObj.closest('form').find('.slotCity')[0].sumo.remove(taxArr['city_id']['length']);
                            thisObj.closest('form').find('.slotCity')[0].sumo.add(''+taxArr['city_id']['taxId'],taxArr['city_id']['taxVal']);
                            thisObj.closest('form').find('.slotCity')[0].sumo.add('addNewOption','Add New');
                        }
                        bookingDetailHtml += '<td class="city_id_td bookingTd">'+taxArr['city_id']['taxVal']+'</td>';
                    } else {
                        bookingDetailHtml += '<td class="city_id_td bookingTd">'+bookingDetailVal['slot_data[city_id]']+'</td>';
                    }
                } else {
                    bookingDetailHtml += '<td class="city_id_td bookingTd" style="display:none"></td>';
                }
                if(typeof json['data']['bookingParam']['venueCheckbox'] !== 'undefined' && json['data']['bookingParam']['venueCheckbox'] === 'on') {
                    if(bookingDetailVal['slot_data[address_id]'] === 'Add New') {
                        if(typeof taxArr['address_id']['exists'] === 'undefined') {
                            thisObj.closest('form').find('.slotAddress')[0].sumo.remove(taxArr['address_id']['length']);
                            thisObj.closest('form').find('.slotAddress')[0].sumo.add(''+taxArr['address_id']['taxId'],taxArr['address_id']['taxVal']);
                            thisObj.closest('form').find('.slotAddress')[0].sumo.add('addNewOption','Add New');
                        }
                        bookingDetailHtml += '<td class="address_id_td bookingTd">'+taxArr['address_id']['taxVal']+'</td>';
                    } else {
                        bookingDetailHtml += '<td class="address_id_td bookingTd">'+bookingDetailVal['slot_data[address_id]']+'</td>';
                    }
                } else {
                    bookingDetailHtml += '<td class="address_id_td bookingTd" style="display:none"></td>';
                }
                if(typeof json['data']['bookingParam']['platformCheckbox'] !== 'undefined' && json['data']['bookingParam']['platformCheckbox'] === 'on') {
                    if(bookingDetailVal['slot_data[platform_id]'] === 'Add New') {
                        if(typeof taxArr['platform_id']['exists'] === 'undefined') {
                            thisObj.closest('form').find('.slotPlatform')[0].sumo.remove(taxArr['platform_id']['length']);
                            thisObj.closest('form').find('.slotPlatform')[0].sumo.add(''+taxArr['platform_id']['taxId'],taxArr['platform_id']['taxVal']);
                            thisObj.closest('form').find('.slotPlatform')[0].sumo.add('addNewOption','Add New');
                        }
                        bookingDetailHtml += '<td class="platform_id_td bookingTd">'+taxArr['platform_id']['taxVal']+'</td>';
                    } else {
                        bookingDetailHtml += '<td class="platform_id_td bookingTd">'+bookingDetailVal['slot_data[platform_id]']+'</td>';
                    }
                } else {
                    bookingDetailHtml += '<td class="platform_id_td bookingTd" style="display:none"></td>';
                }
                if((typeof json['data']['bookingParam']['onlineSlotUserCheckbox'] !== 'undefined' || typeof json['data']['bookingParam']['offlineSlotUserCheckbox'] !== 'undefined') && (json['data']['bookingParam']['onlineSlotUserCheckbox'] === 'on' || json['data']['bookingParam']['offlineSlotUserCheckbox'] === 'on')) {
                    if(bookingDetailVal['slot_data[slot_user]'] === 'Add New') {
                        if(typeof taxArr['slot_user']['exists'] === 'undefined') {
                            thisObj.closest('form').find('.slotUser')[0].sumo.remove(taxArr['slot_user']['length']);
                            thisObj.closest('form').find('.slotUser')[0].sumo.add(''+taxArr['slot_user']['taxId'],taxArr['slot_user']['taxVal']);
                            thisObj.closest('form').find('.slotUser')[0].sumo.add('addNewOption','Add New');
                        }
                        bookingDetailHtml += '<td class="slot_user_td bookingTd">'+taxArr['slot_user']['taxVal']+'</td>';
                    } else {
                        bookingDetailHtml += '<td class="slot_user_td bookingTd">'+bookingDetailVal['slot_data[slot_user]']+'</td>';
                    }
                } else {
                    bookingDetailHtml += '<td class="slot_user_td bookingTd" style="display:none"></td>';
                }
                if((typeof json['data']['bookingParam']['onlineDateCheckbox'] !== 'undefined' || typeof json['data']['bookingParam']['offlineDateCheckbox'] !== 'undefined') && (json['data']['bookingParam']['onlineDateCheckbox'] === 'on' || json['data']['bookingParam']['offlineDateCheckbox'] === 'on')) {
                    bookingDetailHtml += '<td class="slot_date_td bookingTd">'+bookingDetailVal['slot_data[slot_date]']+'</td>';
                } else {
                    bookingDetailHtml += '<td class="slot_date_td bookingTd" style="display:none"></td>';
                }
                if((typeof json['data']['bookingParam']['onlineTimeSlotCheckbox'] !== 'undefined' || typeof json['data']['bookingParam']['offlineTimeSlotCheckbox'] !== 'undefined') && (json['data']['bookingParam']['onlineTimeSlotCheckbox'] === 'on' || json['data']['bookingParam']['offlineTimeSlotCheckbox'] === 'on')) {
                    bookingDetailHtml += '<td class="slot_time_td bookingTd">'+bookingDetailVal['slot_data[slot_time]']+'</td>';
                } else {
                    bookingDetailHtml += '<td class="slot_time_td bookingTd" style="display:none"></td>';
                }
                if((typeof json['data']['bookingParam']['onlineExtraCheckbox'] !== 'undefined' || typeof json['data']['bookingParam']['offlineExtraCheckbox'] !== 'undefined') && (json['data']['bookingParam']['onlineExtraCheckbox'] === 'on' || json['data']['bookingParam']['offlineExtraCheckbox'] === 'on')) {
                    if(bookingDetailVal['slot_data[extra]'] === 'Add New') {
                        if(typeof taxArr['extra']['exists'] === 'undefined') {
                            thisObj.closest('form').find('.slotExtra')[0].sumo.remove(taxArr['extra']['length']);
                            thisObj.closest('form').find('.slotExtra')[0].sumo.add(''+taxArr['extra']['taxId'],taxArr['extra']['taxVal']);
                            thisObj.closest('form').find('.slotExtra')[0].sumo.add('addNewOption','Add New');
                        }
                        bookingDetailHtml += '<td class="extra_td bookingTd">'+taxArr['extra']['taxVal']+'</td>';
                    } else {
                        bookingDetailHtml += '<td class="extra_td bookingTd">'+bookingDetailVal['slot_data[extra]']+'</td>';
                    }
                } else {
                    bookingDetailHtml += '<td class="extra_td bookingTd" style="display:none"></td>';
                }
                bookingDetailHtml += '<td>'+bookingDetailVal['slot_data[slot_capacity]']+'</td>';
                bookingDetailHtml += '<td><div class="toggle__checkbox"><input type="hidden" name="slotStatus" value="0">'
                bookingDetailHtml += '<input type="checkbox" name="slotStatus" value="1" class="slotStatus" id="slotStatus'+json['data']['slotId']+'" slotId="'+json['data']['slotId']+'" checked>';
                bookingDetailHtml += '<label data-id="slotStatus'+json['data']['slotId']+'" onclick="" for="slotStatus'+json['data']['slotId']+'">Toggle</label></div></td></tr>';
                thisObj.closest('tbody').prepend(bookingDetailHtml);
                $(thisObj).closest('.addNewSlotDetails').find('.slotBookingParamValue').each(function(){
                    if($(this).attr('type') !=='hidden') {
                        $(this).val('');
                    }
                });
                $(thisObj).closest('.addNewSlotDetails').hide();
                thisObj.closest('form').find('.addOption').val('');
                thisObj.closest('form').find('.slotPlatform')[0].sumo.selectItem(0);
                thisObj.closest('form').find('.slotState')[0].sumo.selectItem(0);
                thisObj.closest('form').find('.slotCity')[0].sumo.selectItem(0);
                thisObj.closest('form').find('.slotAddress')[0].sumo.selectItem(0);
                thisObj.closest('form').find('.slotUser')[0].sumo.selectItem(0);
                thisObj.closest('form').find('.slotExtra')[0].sumo.selectItem(0);
                $(thisObj).closest('form').find('.addNewSlotDetail').show();
            } else{
                alertPopup(json['message'], 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
   
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function alertPopup(msg, type, location) {
    var selector_parent, selector_titleID, selector_msg, title_msg, btn;
    if (type === 'error') {
        selector_parent = '#ErrorPopupArea';
        selector_titleID = '#ErroralertTitle';
        selector_msg = '#ErrorMsgBody';
        btn = '#ErrorOkBtn';
        title_msg = 'Error';
    } else if (type === 'notification') {
        selector_parent = '#SuccessPopupArea';
        selector_titleID = '#SuccessPopupArea #alertTitle';
        selector_msg = '#MsgBody';
        btn = '#OkBtn';
        title_msg = 'Notification';
    } else {
        selector_parent = '#SuccessPopupArea';
        selector_titleID = '#alertTitle';
        selector_msg = '#MsgBody';
        btn = '#OkBtn';
        title_msg = 'Success';
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
function addNewSlotDetail() {
    var processId = $(this).attr('id');
    if(processId === '0') {
        alertPopup('Please save process details', 'error');
        return;
    }
    
    $(this).closest('.slotDetailsMainDiv').find('table').show();
    $(this).closest('.slotDetailsMainDiv').find('.addNewSlotDetails').show();
    $(this).closest('form').find('.addNewSlotDetail').hide();
}

function changeConstructiveSelect() {
    var optionVal = $(this).val();
    if(optionVal === 'addNewOption') {
        $(this).closest('td').find('.addOptionDiv').show();
        $(this).closest('td').find('.slotValidationError').html('');
        $(this).closest('td').find('.addOption').val('');
    } else {
        $(this).closest('td').find('.addOptionDiv').hide();
    }
}

$(document).on('keydown', '.addOption', function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        saveOption(this);
    }
});
function saveOption(thisObj) {
    var id = $(thisObj).attr('id');
    var processId = $(thisObj).closest('form').find('#process_id').val();
    var optionVal = $(thisObj).closest('.addOptionDiv').find('.addOption').val();
    optionVal = $.trim(optionVal);
    var collegeId = jsVars.collegeId;
    if(optionVal === '') {
        return false;
    }
    var response;
    if(id === 'saveState') {
        response = addTaxonomyOption(optionVal, 'appointment_state_'+collegeId+'_'+processId, 'state_id', thisObj);
    } else if(id === 'saveInterviewCity') {
        response = addTaxonomyOption(optionVal, 'appointment_city_'+collegeId+'_'+processId, 'city_id', thisObj);
    } else if(id === 'saveInterviewAddress') {
        response = addTaxonomyOption(optionVal, 'appointment_address_'+collegeId+'_'+processId, 'address_id', thisObj);
    } else if(id === 'saveSlotUser') {
        response = addTaxonomyOption(optionVal, 'appointment_slot_user_'+collegeId+'_'+processId, 'slot_user', thisObj);
    } else if(id === 'saveInterviewPlatform') {
        response = addTaxonomyOption(optionVal, 'appointment_platform_'+collegeId+'_'+processId, 'platform_id', thisObj);
    } else if(id === 'saveExtra') {
        response = addTaxonomyOption(optionVal, 'appointment_extra_'+collegeId+'_'+processId, 'extra', thisObj);
    }
    if(response === true) {
        $(thisObj).closest('.addOptionDiv').hide();
        $(thisObj).closest('.addOptionDiv').find('.addOption').val('');
    }
}

function addTaxonomyOption(option='', machineKey='', sumoSelectId='', thisObj) {
    var valid = true;
    if(option!=='' && machineKey!=='' && sumoSelectId!==''){
        $.ajax({
            url: '/appointment-manager/addTaxonomyOption/'+jsVars.collegeId,
            type: 'post',
            data: {'option':option, 'machineKey':machineKey, 'optionKey':sumoSelectId},
            async: false,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                if(json['status'] ===0 && json['message'] === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else if(json['status'] ===1) {
                    if(typeof json['data']['optionVal'] === 'number') {
                        var optionVal = '' + json['data']['optionVal'];
                        $(thisObj).closest('form').find('#'+sumoSelectId)[0].sumo.add(json['data']['optionVal'],json['data']['option'], -1);
                        $(thisObj).closest('form').find('#'+sumoSelectId)[0].sumo.selectItem(optionVal);
                    }
                } else if(json['status'] ===0) {
                    if(json['message'] === 'Category name already saved with us.') {
                        json['message'] = 'Already exists';
                    }
                    $(thisObj).closest('td').find('.slotValidationError').html(json['message']);
                    valid = false;
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        return valid;
    }
    return true;
}

function bookingParam() {
    $(this).closest('form').find('.slotValidationError').html('');
    var paramId = $(this).attr('id');
    if($(this).is(':checked')) {
        $(this).closest('.row').find('.bookingParamsText').attr('disabled', false);
        $(this).closest('.row').find('.bookingParamsText').parent().show();
        if(paramId === 'onlineTimeSlotCheckbox' && !$(this).closest('form').find('#onlineDateCheckbox').is(':checked')) {
            $(this).closest('form').find('#onlineDateCheckbox').trigger('click');
        } else if(paramId === 'offlineTimeSlotCheckbox' && !$(this).closest('form').find('#offlineDateCheckbox').is(':checked')) {
            $(this).closest('form').find('#offlineDateCheckbox').trigger('click');
        }
        if(paramId === 'onlineTimeSlotCheckbox' || paramId === 'offlineTimeSlotCheckbox') {
            $(this).closest('form').find('.offlineDateCheckboxTd').show();
            $(this).closest('form').find('.offlineTimeSlotCheckboxTd').show();
        } else if(paramId === 'onlineDateCheckbox' || paramId === 'offlineDateCheckbox') {
            $(this).closest('form').find('.offlineDateCheckboxTd').show();
        } else if(paramId === 'onlineExtraCheckbox' || paramId === 'offlineExtraCheckbox') {
            $(this).closest('form').find('.offlineExtraCheckboxTd').show();
        } else if(paramId === 'onlineSlotUserCheckbox' || paramId === 'offlineSlotUserCheckbox') {
            $(this).closest('form').find('.offlineSlotUserCheckboxTd').show();
        } else {
            $(this).closest('form').find('.'+paramId+'Td').show();
        }
//        if(paramId === 'offlineCityCheckbox') {
//            $(this).closest('form').find('.slotCity')[0].sumo.selectItem(0); 
//        } else if(paramId === 'offlineVenueCheckbox') {
//            $(this).closest('form').find('.slotAddress')[0].sumo.selectItem(0); 
//        } else if(paramId === 'onlinePlatformCheckbox') {
//            $(this).closest('form').find('.slotPlatform')[0].sumo.selectItem(0); 
//        }
        if(paramId === 'onlinePlatformCheckbox') {
            $(this).closest('form').find('.platform_id_td').show();
        } else if(paramId === 'onlineDateCheckbox' || paramId === 'offlineDateCheckbox') {
            $(this).closest('form').find('.slot_date_td').show();
        } else if(paramId === 'onlineTimeSlotCheckbox' || paramId === 'offlineTimeSlotCheckbox') {
            $(this).closest('form').find('.slot_time_td').show();
        } else if(paramId === 'offlineStateCheckbox') {
            $(this).closest('form').find('.state_id_td').show();
        } else if(paramId === 'offlineCityCheckbox') {
            $(this).closest('form').find('.city_id_td').show();
        } else if(paramId === 'offlineVenueCheckbox') {
            $(this).closest('form').find('.address_id_td').show();
        } else if(paramId === 'onlineSlotUserCheckbox' || paramId === 'offlineSlotUserCheckbox') {
            $(this).closest('form').find('.slot_user_td').show();
        } else if(paramId === 'onlineExtraCheckbox' || paramId === 'offlineExtraCheckbox') {
            $(this).closest('form').find('.extra_td').show();
        } else if(paramId === 'onlineSlotUserCheckbox' || paramId === 'offlineSlotUserCheckbox') {
            $(this).closest('form').find('.slot_user_td').show();
        }
    } else {
        $(this).closest('.row').find('.bookingParamsText').val('');
        $(this).closest('.row').find('.bookingParamsText').attr('disabled', true);
        $(this).closest('.row').find('.bookingParamsText').parent().hide();
        if(typeof $(this).closest('.row').find('.bookingParamMapping')[0] !== 'undefined') {
            $(this).closest('.row').find('.bookingParamMapping').parent().parent().hide();
            $(this).closest('.row').find('.bookingParamMapping')[0].sumo.selectItem(0);
        }
        if(paramId === 'onlineDateCheckbox' && $(this).closest('form').find('#onlineTimeSlotCheckbox').is(':checked')) {
            $(this).closest('form').find('#onlineTimeSlotCheckbox').trigger('click');
        } else if(paramId === 'offlineDateCheckbox' && $(this).closest('form').find('#offlineTimeSlotCheckbox').is(':checked')) {
            $(this).closest('form').find('#offlineTimeSlotCheckbox').trigger('click');
        }
        if(paramId === 'onlineTimeSlotCheckbox' || paramId === 'offlineTimeSlotCheckbox') {
            $(this).closest('form').find('.offlineTimeSlotCheckboxTd').hide();
        } else if(paramId === 'onlineDateCheckbox' || paramId === 'offlineDateCheckbox') {
            $(this).closest('form').find('.offlineDateCheckboxTd').hide();
            $(this).closest('form').find('.offlineTimeSlotCheckboxTd').hide();
        } else if(paramId === 'onlineExtraCheckbox' || paramId === 'offlineExtraCheckbox') {
            $(this).closest('form').find('.offlineExtraCheckboxTd').hide();
        } else if(paramId === 'onlineSlotUserCheckbox' || paramId === 'offlineSlotUserCheckbox') {
            $(this).closest('form').find('.offlineSlotUserCheckboxTd').hide();
        } else {
            $(this).closest('form').find('.'+paramId+'Td').hide();
        }
        if(paramId === 'onlinePlatformCheckbox') {
            $(this).closest('form').find('.platform_id_td').hide();
        } else if(paramId === 'onlineDateCheckbox' || paramId === 'offlineDateCheckbox') {
            $(this).closest('form').find('.slot_date_td').hide();
        } else if(paramId === 'onlineTimeSlotCheckbox' || paramId === 'offlineTimeSlotCheckbox') {
            $(this).closest('form').find('.slot_time_td').hide();
        } else if(paramId === 'offlineStateCheckbox') {
            $(this).closest('form').find('.state_id_td').hide();
        } else if(paramId === 'offlineCityCheckbox') {
            $(this).closest('form').find('.city_id_td').hide();
        } else if(paramId === 'offlineVenueCheckbox') {
            $(this).closest('form').find('.address_id_td').hide();
        } else if(paramId === 'onlineExtraCheckbox' || paramId === 'offlineExtraCheckbox') {
            $(this).closest('form').find('.extra_td').hide();
        } else if(paramId === 'onlineSlotUserCheckbox' || paramId === 'offlineSlotUserCheckbox') {
            $(this).closest('form').find('.slot_user_td').hide();
        } else if(paramId === 'onlineSlotUserCheckbox' || paramId === 'offlineSlotUserCheckbox') {
            $(this).closest('form').find('.slot_user_td').hide();
        }
    }
}

function interviewMode() {
    $(this).closest('form').find('.slotValidationError').html('');
    var interviewMode = $(this).val();
    $(this).closest('form').find('.bookingParamsText').parent().hide();
    $(this).closest('form').find('.bookingParamMapping').parent().parent().hide();
    $(this).closest('form').find('.bookingParamMapping').each(function(){
       $(this)[0].sumo.selectItem(0); 
    });
    if(interviewMode === 'online') {
        $(this).closest('form').find('.offlineBookingParameters').hide();
        $(this).closest('form').find('.onlineBookingParameters').show();
        $(this).closest('form').find('.offlineParamsText').val('');
        $(this).closest('form').find('.offlineParamsText').attr('disabled', true);
        $(this).closest('form').find('.offlineParams').removeAttr('checked');
    } else {
        $(this).closest('form').find('.offlineBookingParameters').show();
        $(this).closest('form').find('.onlineBookingParameters').hide();
        $(this).closest('form').find('.onlineParamsText').val('');
        $(this).closest('form').find('.onlineParamsText').attr('disabled', true);
        $(this).closest('form').find('.onlineParams').removeAttr('checked');
    }
    $(this).closest('form').find('.bookingTd').hide();
}

function updateCriteriaSelection() {
    var selectedCriteria = $(this).val();
    var collegeId = $(this).closest('form').find("#collegeId").val();
    var formId = $(this).closest('form').find("#formId").val();
    var criteriaSelectionDiv = $(this).closest(".criteriaSelectionDiv");
    if(selectedCriteria === 'applicationStage') {
        $(this).closest('form').find(".applicationSubStageDiv").remove();
        $.ajax({
            url: '/appointment-manager/get-application-stages',
            type: 'post',
            data: {'collegeId':collegeId, 'formId':formId},
            async: false,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                if(typeof json['status'] !== 'undefined' && json['status'] ===0 && typeof json['message'] !== 'undefined' && json['message'] === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else if(typeof json['status'] !== 'undefined' && json['status'] ===1 && typeof json['data']['applicationStages'] !== 'undefined') {
                    var applicationStageHtml = '<div class="col-sm-4 applicationStageDiv">';
                    applicationStageHtml += '<div class="form-group">';
                    applicationStageHtml += '<select name="json_attributes[applicationStage]" id="applicationStage" class="form-control applicationStageSelection">';
                    $.each( json['data']['applicationStages'], function( index, value ){
                        applicationStageHtml += '<option value="'+index+'">'+value+'</option>';
                    });
                    applicationStageHtml += '</select>';
                    applicationStageHtml += '</div>';
                    applicationStageHtml += '</div>';
                    criteriaSelectionDiv.find('.stageSelectionRow').append(applicationStageHtml);
                    $('.applicationStageSelection').SumoSelect({placeholder: '', search: true, searchText: 'Search', triggerChangeCombined: false});
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    } else {
        $(this).closest('form').find(".applicationStageDiv").remove();
        $(this).closest('form').find(".applicationSubStageDiv").remove();
    }
}

function updateOrCriteriaSelection() {
    var selectedCriteria = $(this).val();
    var collegeId = $(this).closest('form').find("#collegeId").val();
    var formId = $(this).closest('form').find("#formId").val();
    var criteriaSelectionDiv = $(this).closest(".orCriteriaSelectionDiv");
    if(selectedCriteria === 'applicationStage') {
        $(this).closest('form').find(".orApplicationSubStageDiv").remove();
        $.ajax({
            url: '/appointment-manager/get-application-stages',
            type: 'post',
            data: {'collegeId':collegeId, 'formId':formId},
            async: false,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                if(typeof json['status'] !== 'undefined' && json['status'] ===0 && typeof json['message'] !== 'undefined' && json['message'] === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else if(typeof json['status'] !== 'undefined' && json['status'] ===1 && typeof json['data']['applicationStages'] !== 'undefined') {
                    var applicationStageHtml = '<div class="col-sm-4 orApplicationStageDiv">';
                    applicationStageHtml += '<div class="form-group">';
                    applicationStageHtml += '<select name="json_attributes[or][applicationStage]" id="orApplicationStage" class="form-control sumo-select orApplicationStageSelection">';
                    $.each( json['data']['applicationStages'], function( index, value ){
                        applicationStageHtml += '<option value="'+index+'">'+value+'</option>';
                    });
                    applicationStageHtml += '</select>';
                    applicationStageHtml += '</div>';
                    applicationStageHtml += '</div>';
                    criteriaSelectionDiv.find('.orStageSelectionRow').append(applicationStageHtml);
                    $('.orApplicationStageSelection').SumoSelect({placeholder: '', search: true, searchText: 'Search', triggerChangeCombined: false});
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    } else {
        $(this).closest('form').find(".orApplicationStageDiv").remove();
        $(this).closest('form').find(".orApplicationSubStageDiv").remove();
    }
}

function getApplicationSubStage() {
    $(this).closest('form').find(".applicationSubStageDiv").remove();
    var formId = $(this).closest('form').find("#formId").val();
    var applicationStage = $(this).val();
    var criteriaSelectionDiv = $(this).closest('.applicationStageDiv');
    if(applicationStage !== '') {
        $.ajax({
            url: '/appointment-manager/get-application-sub-stages',
            type: 'post',
            data: {'stageId':applicationStage, 'formId':formId},
            async: false,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                if(typeof json['status'] !== 'undefined' && json['status'] ===0 && typeof json['message'] !== 'undefined' && json['message'] === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else if(typeof json['status'] !== 'undefined' && json['status'] ===1 && typeof json['data']['applicationSubStages'] !== 'undefined') {
                    var applicationSubStageOption = '';
                    $.each( json['data']['applicationSubStages'], function( index, value ){
                        applicationSubStageOption += '<option value="'+index+'">'+value+'</option>';
                    });
                    if (applicationSubStageOption !== '') {
                        applicationSubStageOption = '<option value="">Select Application Sub Stage</option>'+applicationSubStageOption;
                        var applicationSubStageHtml = '<div class="col-sm-4 applicationSubStageDiv">';
                        applicationSubStageHtml += '<div class="form-group">';
                        applicationSubStageHtml += '<select name="json_attributes[applicationSubStage]" class="form-control applicationSubStage">'+applicationSubStageOption;
                        applicationSubStageHtml += '</select>';
                        applicationSubStageHtml += '</div>';
                        applicationSubStageHtml += '</div>';
                        criteriaSelectionDiv.parent().append(applicationSubStageHtml);
                        $('.applicationSubStage').SumoSelect({placeholder: '', search: true, searchText: 'Search', triggerChangeCombined: false});
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

function getOrApplicationSubStage() {
    $(this).closest('form').find(".orApplicationSubStageDiv").remove();
    var formId = $(this).closest('form').find("#formId").val();
    var applicationStage = $(this).val();
    var criteriaSelectionDiv = $(this).closest('.orApplicationStageDiv');
    if(applicationStage !== '') {
        $.ajax({
            url: '/appointment-manager/get-application-sub-stages',
            type: 'post',
            data: {'stageId':applicationStage, 'formId':formId},
            async: false,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                if(typeof json['status'] !== 'undefined' && json['status'] ===0 && typeof json['message'] !== 'undefined' && json['message'] === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else if(typeof json['status'] !== 'undefined' && json['status'] ===1 && typeof json['data']['applicationSubStages'] !== 'undefined') {
                    var applicationSubStageOption = '';
                    $.each( json['data']['applicationSubStages'], function( index, value ){
                        applicationSubStageOption += '<option value="'+index+'">'+value+'</option>';
                    });
                    if (applicationSubStageOption !== '') {
                        applicationSubStageOption = '<option value="">Select Application Sub Stage</option>'+applicationSubStageOption;
                        var applicationSubStageHtml = '<div class="col-sm-4 orApplicationSubStageDiv">';
                        applicationSubStageHtml += '<div class="form-group">';
                        applicationSubStageHtml += '<select name="json_attributes[or][applicationSubStage]" class="form-control orApplicationSubStage">'+applicationSubStageOption;
                        applicationSubStageHtml += '</select>';
                        applicationSubStageHtml += '</div>';
                        applicationSubStageHtml += '</div>';
                        criteriaSelectionDiv.parent().append(applicationSubStageHtml);
                        $('.orApplicationSubStage').SumoSelect({placeholder: '', search: true, searchText: 'Search', triggerChangeCombined: false});
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

$(document).on('submit', ".saveProcessDetails", function(e) {
    e.preventDefault();
    var isValid = true;
    if($(this).find('#criteria').val()==='0') {
        $(this).find("#criteria").closest('.form-group').find('.criteriaValidationError').html('Please select criteria');
        isValid = false;
    }
    var checkedBookingParam = $(this).find(".bookingParams:checked").length;
    if(checkedBookingParam === 0) {
        $(this).find('.bookingParamError').html('Please select booking params');
        isValid = false;
    }
    if(isValid === false) {
        return;
    }
    var thisObj = $(this);
    $.each( $(this).closest('form').find(".bookingParamsText"), function(){
        if($(this).val() !== '' && !alphaNumericRegex.test($(this).val())) {
            $(thisObj).find('.bookingParamError').html('Only alphanumeric values is allowed in booking alias name');
            isValid = false;
        }
    });
    if(isValid === false) {
        return;
    }
    var fileInputObj = $(this).find('#uploadSlotBookingFile');
    var fileInputSpan = $(this).find('#filePath');
    var formData = new FormData(this);
    $.ajax({
        url: '/appointment-manager/save-process-details/'+jsVars.collegeId,
        type: 'post',
        data: formData,
        async: false,
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            showLoader();
        },
        success: function (json) {
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(json['status'] ===1) {
                $("#processtabs li.active").find('.processTitle').html(json['data']['processTitle']);
                $("#processtabs li.active").find('.appointmentProcess').attr('id', json['data']['processId']);
                var panelBodyId = $("#processtabs li.active").find('.appointmentProcess').attr('href');
                $(panelBodyId).find('.processTabItem').attr('id', json['data']['processId']);
                if(json['data']['allocationType'] === 'byCandidate') {
                    $(panelBodyId).find('.additionalSettingsTab').show();
                    $(panelBodyId).find('.retakeSettingsTab').show();
                    $(panelBodyId).find('.additionalSettingsTab').trigger('click');
                } else {
                    $(panelBodyId).find('.additionalSettingsTab').hide();
                    $(panelBodyId).find('.retakeSettingsTab').hide();
                    $(panelBodyId).find('.reschedualeSettingsTab').trigger('click');
                }
                $('.scrolling-tabs').scrollingTabs();
            } else{
                alertPopup(json['message'], 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function () {
            hideLoader();
            fileInputObj.val('');
            fileInputSpan.html('');
        }       
    });
});

function saveGdpiAdditionalSettings() {
    event.preventDefault();
    $(document).find('.slotDynamicDayErrorClass').html('');
    var dynamicSlotDayVal = parseInt($(this).closest('form').find('#slotDynamicDayValue').val());
    if(dynamicSlotDayVal > 30) {
        $(this).closest('form').find('#slotDynamicDayError').html('Max 30 is allowed');
        return false;
    }
    for (instance in CKEDITOR.instances) 
    {
        CKEDITOR.instances[instance].updateElement();
    }
    $.ajax({
        url: '/appointment-manager/save-gdpi-additional-settings',
        type: 'post',
        data: $(this).closest('form').serialize(),
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if(typeof json['status'] !== 'undefined' && json['status'] ===0 && typeof json['message'] !== 'undefined' && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(typeof json['status'] !== 'undefined' && (json['status'] ===1 || json['status'] ===true)) {
                var panelBodyId = $("#processtabs li.active").find('.appointmentProcess').attr('href');
                $(panelBodyId).find('.reschedualeSettingsTab').trigger('click');
            } else{
                alertPopup(json['message'], 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function saveCommunicationSettings() {
    event.preventDefault();
    $(this).closest('form').find('.templateError').html('');
    var isValid = true;
    if($(this).closest('form').find('#bookingEmail').is(":checked") && $(this).closest('form').find('#booking_email_template').val() === ''){
       isValid = false;
       $(this).closest('form').find('.emailTemplateError').html('Please select template');
    }
    if($(this).closest('form').find('#bookingSMS').is(":checked") && $(this).closest('form').find('#booking_sms_template').val() === ''){
       isValid = false;
       $(this).closest('form').find('.smsTemplateError').html('Please select template');
    }
    if($(this).closest('form').find('#bookingWhatsApp').is(":checked") && $(this).closest('form').find('#booking_whatsapp_template').val() === ''){
       isValid = false;
       $(this).closest('form').find('.whatsappTemplateError').html('Please select template');
    }
    if(isValid === false){
        return false;
    }
    $.ajax({
        url: '/appointment-manager/save-communication-settings/'+jsVars.collegeId,
        type: 'post',
        data: $(this).closest('form').serialize(),
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(json['status'] ===1) {
                if(json['data']['allocation_type'] !== 'byCandidate') {
                    alertPopup('You have successfully setup the <b>'+json['data']['name']+'</b> process.');
                } else {
                    var panelBodyId = $("#processtabs li.active").find('.appointmentProcess').attr('href');
                    $(panelBodyId).find('.retakeSettingsTab').trigger('click');
                }
            } else{
                alertPopup(json['message'], 'error');
            }
        
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function saveRescheduleSettings() {
    $(document).find('.reschedule_end_dynamic_day_error').html('');
    event.preventDefault();
    var startDateType = $(this).closest('form').find('input[name="reschedule_start_date_type"]:checked').val();
    var endDateType = $(this).closest('form').find('input[name="reschedule_end_date_type"]:checked').val();
    if(startDateType === 'dynamic' && endDateType === 'dynamic') {
        var startDay = parseInt($(this).closest('form').find('#reschedule_start_dynamic_day_val').val());
        var endDay = parseInt($(this).closest('form').find('#reschedule_end_dynamic_day_val').val());
        if(endDay >= startDay) {
            $(this).closest('form').find('#reschedule_end_dynamic_day_val_error').html('End Date must be less than Start Date');
            return false;
        }
    }
    $.ajax({
        url: '/appointment-manager/save-reschedule-settings/'+jsVars.collegeId,
        type: 'post',
        data: $(this).closest('form').serialize(),
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(json['status'] ===1) {
                var panelBodyId = $("#processtabs li.active").find('.appointmentProcess').attr('href');
                $(panelBodyId).find('.communicationSettingsTab').trigger('click');
            } else{
                alertPopup(json['message'], 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function saveGdpiRetakeSettings() {
    event.preventDefault();
    $.ajax({
        url: '/appointment-manager/save-gdpi-retake-settings',
        type: 'post',
        data: $(this).closest('form').serialize(),
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(json['status'] ===1) {
                alertPopup('You have successfully setup the <b>'+json['data']['name']+'</b> process.');
            } else{
                alertPopup(json['message'], 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getAjaxProcessDetails(processId=0, tempProcessId) {
    $.ajax({
        url: jsVars.FULL_URL + '/appointment-manager/get-process-details/'+jsVars.collegeId,
        type: 'post',
        dataType: 'html',
        data: {'processId' : processId, 'collegeId':jsVars.collegeId},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        complete:function(){
            $("html, body").animate({scrollTop:0}, 1000);
            $(this).parent('.tab-pane').addClass('fadeIn');
        },
        beforeSend: function () {
            showLoader();
        },
        success: function (response) { 
            
            var responseObject = $.parseJSON(response);
            if(responseObject.status===1){
                if(responseObject.data.html) {
                    $("#process"+tempProcessId).find('.subHeading').removeClass('active');
                    $("#process"+tempProcessId).find('.tab-pane').removeClass('active');
                    $(document).find("#slotbooking"+tempProcessId).html(responseObject.data.html);
                    $("#process"+tempProcessId).find('.subHeading').first().addClass('active');
                    $('#processDetailsTab').find("#slotbooking"+tempProcessId).addClass('active');
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
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function () {
            hideLoader();
        } 
    });
}

function getAppointmentProcessDetails() {
    var processId = $(this).attr('id');
    var tempProcessId = $(this).attr('tempProcessId');
    if (typeof processId === 'undefined') {
        processId = $(document).find('.slotBookingTab').first().attr('id');
    }
    if (typeof tempProcessId === 'undefined') {
        tempProcessId = $(document).find('.slotBookingTab').first().attr('tempProcessId');
    }
    getAjaxProcessDetails(processId, tempProcessId);
    $("html, body").animate({scrollTop:0}, 1000);
    $(this).parent('.tab-pane').addClass('fadeIn');
}

function getGdpiAdditionalSettings() {
    var processId = $(this).attr('id');
    if(processId === 'default') {
        alertPopup('Please save process details', 'error');
        return;
    }
    var tempProcessId = $(this).attr('tempProcessId');
    $.ajax({
        url: jsVars.FULL_URL + '/appointment-manager/getGdpiAdditionalSettings',
        type: 'post',
        dataType: 'html',
        data: {'processId' : processId, 'collegeId':jsVars.collegeId, 'formId':jsVars.formId},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        complete:function(){
            $("html, body").animate({scrollTop:0}, 1000);
            $(this).parent('.tab-pane').addClass('fadeIn')
        },
        success: function (response) { 
            
            var responseObject = $.parseJSON(response);
            if(responseObject.status===1){
                if(responseObject.data.html) {
                    $(document).find("#additionalsettings"+tempProcessId).html(responseObject.data.html);
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
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getCommunicationSettings() {
    var processId = $(this).attr('id');
    var collegeId = jsVars.collegeId;
    var tempProcessId = $(this).attr('tempProcessId');
    if(processId === 'default') {
        alertPopup('Please save process details', 'error');
        return;
    }
    $.ajax({
        url: jsVars.FULL_URL + '/appointment-manager/getCommunicationSettings/'+collegeId,
        type: 'post',
        dataType: 'html',
        data: {'processId' : processId, 'collegeId':collegeId},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        complete:function(){
            $("html, body").animate({scrollTop:0}, 1000);
            $(this).parent('.tab-pane').addClass('fadeIn')
        },
        beforeSend: function () {
            showLoader();
        },
        success: function (response) { 
            
            var responseObject = $.parseJSON(response);
            if(responseObject.status===1){
                if(responseObject.data.html) {
                    $(document).find("#communicationsettings"+tempProcessId).html(responseObject.data.html);
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
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function () {
            hideLoader();
        }
    });
}

function getRescheduleSettings() {
    var processId = $(this).attr('id');
    var collegeId = jsVars.collegeId;
    if(processId === 'default') {
        alertPopup('Please save process details', 'error');
        return;
    }
    var tempProcessId = $(this).attr('tempProcessId');
    $.ajax({
        url: jsVars.FULL_URL + '/appointment-manager/getRescheduleSettings/'+collegeId,
        type: 'post',
        dataType: 'html',
        data: {'processId' : processId, 'collegeId':collegeId},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            showLoader();
        },
        complete:function(){
            $("html, body").animate({scrollTop:0}, 1000);
            $(this).parent('.tab-pane').addClass('fadeIn');
        },
        success: function (response) { 
            
            var responseObject = $.parseJSON(response);
            if(responseObject.status===1){
                if(responseObject.data.html) {
                    $(document).find("#reschedualeslotsettings"+tempProcessId).html(responseObject.data.html);
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
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function () {
            hideLoader();
        }     
    });
}

function getGdpiRetakeSettings() {
    var processId = $(this).attr('id');
    var collegeId = jsVars.collegeId;
    if(processId === 'default') {
        alertPopup('Please save process details', 'error');
        return;
    }
    var tempProcessId = $(this).attr('tempProcessId');
    $.ajax({
        url: jsVars.FULL_URL + '/appointment-manager/getGdpiRetakeSettings',
        type: 'post',
        dataType: 'html',
        data: {'processId' : processId, 'collegeId':collegeId, 'formId':jsVars.formId},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            showLoader();
        },
        complete:function(){
            $("html, body").animate({scrollTop:0}, 1000);
            $(this).parent('.tab-pane').addClass('fadeIn');
        },
        success: function (response) { 
            
            var responseObject = $.parseJSON(response);
            if(responseObject.status===1){
                if(responseObject.data.html) {
                    $(document).find("#retakesettings"+tempProcessId).html(responseObject.data.html);
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
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function () {
            hideLoader();
        }     
    });
}

function initCKEditor(tokens, setData){

    if(typeof CKEDITOR == 'undefined')
    {   
        window.setTimeout(function(){
            initCKEditor(tokens);
        }, 500);
        return;
    }

    if(typeof tokens =='undefined' || tokens == ''){
        tokens = [["", ""]];
    }

    if(typeof CKEDITOR.instances['editor'] != 'undefined'){
        delete CKEDITOR.instances['editor'];
        jQuery('#cke_editor').remove();
    }

    if(typeof fullPageCkEditorHtml != 'undefined' && fullPageCkEditorHtml === true) {
        fullPageCk = true;
    } else {
        fullPageCk = false;
    }

    CKEDITOR.replace( 'editor',{
        fullPage: fullPageCk,
        extraPlugins: 'token,justify',
        availableTokens: tokens,

            tokenStart: '{{',
            tokenEnd: '}}',
            on: {
                instanceReady: function( evt ) {
                    $('div.loader-block').hide();
                },
                change: function( evt ) {
                    if($("#is_edit_template").length > 0) {
                        $("#is_edit_template").val(1);
                    }
                }
        }
    });
    if(setData != ''){
        CKEDITOR.instances['editor'].setData(setData);
    }
}

function getCkeditorTokenList(bookingSubmitText='') {
    var tokenList = [];
    var collegeId = jsVars.collegeId;
    var formId = jsVars.formId;
    $.ajax({
        url: '/communications/getCkeditorTokenList',
        type: 'post',
        data: {'collegeId':collegeId, 'formId':formId, 'responseText':bookingSubmitText},
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(json['status'] ===1 && typeof json['data']['tokenList'] !== 'undefined') {
                tokenList = json['data']['tokenList'];
            }
            initCKEditor(tokenList, json['data']['responseText']);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function addMoreProcess() {
    $(document).find('.scrolling-tabs').scrollingTabs();
    $.ajax({
        url: jsVars.FULL_URL + '/appointment-manager/addMoreProcess/'+jsVars.collegeId,
        type: 'post',
        dataType: 'html',
        data: {'collegeId':jsVars.collegeId},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (response) { 
            
            var responseObject = $.parseJSON(response);
            if(responseObject.status===1){
                var processId = responseObject.data.processId;
                var processHeadingDiv = '<li role="presentation" class="process_heading active"><a class="tag appointmentProcess" tempprocessid="'+processId+'" id="'+processId+'" href="#process'+processId+'" aria-controls="process'+processId+'" role="tab" data-toggle="tab"><span class="processTitle">'+responseObject.data.processName+'</span></a></li>';
                $('#processtabs').find('.process_heading').removeClass('active');
                $('#processtabs').append(processHeadingDiv);
                $('#processDetailsTab').find('.tab-pane').removeClass('active');
                $('#processDetailsTab').append(responseObject.data.html);
                var panelBodyId = '#process'+processId;
                $(document).find(panelBodyId+' .slotBookingTab').trigger('click');

            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message, 'error');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function showLoader() {
    $(document).find("#listloader").show();
}
function hideLoader() {
    $(document).find("#listloader").hide();
}



