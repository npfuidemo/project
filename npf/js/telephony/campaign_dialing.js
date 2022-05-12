jQuery(function () {
    $('.sectionLoader').hide();
    dropdownMenuPlacement();

});

/**
 * 
 * @returns {undefined}
 */
function createTelephonyCampaignPopup() {
    $('div#bulkloader').show();
    var total_checked = 0;
    var display_popup = false;
    $('input:checkbox[name="selected_users[]"]').each(function () {
        if (this.checked) {
            display_popup = true;
            total_checked++;
        }
    });

    if (typeof is_filter_button_pressed == 'undefined' || is_filter_button_pressed != 1) {
        alertPopup('It seems you have changed the filter but not Applied it. Please re-check the same to proceed further.', 'error');
        $('#listloader').hide();
        return;
    }

    //var checkbox_alert = false;
    var select_all = $('#select_all:checked').val();
    var ctype = $('input#ctype').val();
    if (display_popup || select_all == 'select_all' || ($('#single_user_id').length > 0 && $('#single_user_id').val() != '')) {
        // display bulk action popup
        $('#utilityPop1 .modal-title').html('Send to Telephony Campaign');
        $('#utilityPop1').modal();
        $('#utilityPop1 .modal-dialog').addClass('modal-sm');
        bulkTelephonyCampaignsList(ctype);
        $('#campaignCounselorsList').SumoSelect({placeholder: 'Select Campaign Counselors/Agents List', search: true, searchText:'Search Counselors/Agents List', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });  
    
    } else {
        $('#listloader').hide();
        /**
         * Show alert message if checkbox is not checked as per ctype
         * By default it will show "Please select User" message in alert popup
         *
         */
        var message = 'Please select User.';
        alertPopup(message, 'error');
    }
}

/**
 * 
 * @param {type} ctype
 * @returns {undefined}
 */

function bulkTelephonyCampaignsList(ctype) {
    $('div#bulkloader').hide();
    var total_count = $('#tot_records').text();
    var all_records = $('#all_records_val').val();
    var telephonyCampaignListId = '';

    if (ctype == 'applications') {
        var data = $('#FilterApplicationForms').serializeArray();
    } else if (ctype == 'userleads') {
        var data = $('#FilterLeadForm').serializeArray();
    } else {
        $('div#bulkloader').hide();
        alertPopup('We are not able to process your request right now. Please refresh the page and try again. In case, you face the issue again, get in touch with your dedicated Account Manager.', 'error');
        return;
    }

    if ($('select#telephonyCampaignList').length > 0) {
        telephonyCampaignListId = $('select#telephonyCampaignList').val();
    }

    data.push({name: "total_count", value: total_count});
    data.push({name: "all_records", value: all_records});
    data.push({name: "ctype", value: ctype});
    data.push({name: "telephonyCampaignListId", value: telephonyCampaignListId});
    $.ajax({
        url: '/telephony-campaign/campaign-dialing/campaign-list-form',
        type: 'post',
        dataType: 'html',
        data: data,
//        async: false,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () {
            $('#listloaderPop').show();
        },
        success: function (data) {
            if (data.indexOf('location:') > -1) {
                var location = data.replace(/location\:/, '');
                window.location = location;
            } else {
                $('#listloaderPop').hide();
                $('#utilityPop1 .modal-body').html(data);
                floatableLabel();
                $('#campaignCounselorsList').SumoSelect({placeholder: 'Select Campaign Counselors/Agents List', search: true, searchText:'Search Counselors/Agents List', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });  
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function validateTelephonyCampaignsUsers() {

    $('#dispsuccess, #disperror').html('');
    $('#dispsuccess, #disperror').hide();
    var data = [];
    if ($("#ctype").length > 0 && $("#ctype").val() == 'applications') { //for application LMS
        data = $('#FilterApplicationForms').serializeArray();
    } else {
        data = $('#FilterLeadForm').serializeArray();
    }

    data.push({name: "s_college_id", value: $('#saveTelephonyCampaignsList input#s_college_id').val()});
    data.push({name: "submitform", value: $('#saveTelephonyCampaignsList input#submitform').val()});
    data.push({name: "telephonyCampaignListId", value: $('#saveTelephonyCampaignsList select#telephonyCampaignListId').val()});
    data.push({name: "newTelephonyCampaignName", value: $('#saveTelephonyCampaignsList input#newTelephonyCampaignListName').val()});
    data.push({name: "campaignCounselorsList", value: $('#saveTelephonyCampaignsList select#campaignCounselorsList').val()});
    data.push({name: "submitform", value: $('#saveTelephonyCampaignsList input#submitform').val()});
    data.push({name: "all_records", value: $('#saveTelephonyCampaignsList input#all_records').val()});
    data.push({name: "totalAttempt", value: $('#saveTelephonyCampaignsList input#totalAttempt').val()});
    data.push({name: "addNotes", value: $('#saveTelephonyCampaignsList select#addNotes').val()});
    $.ajax({
        url: '/telephony-campaign/campaign-dialing/validateCampaignListFormData',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () {
            $('div#bulkloader').show();
        },
        success: function (json) {
            if (json['location']) {
                window.location = json['location'];
            } else if (json['status'] == 200) {
                saveCampaignListFormData(json['totalSelectedMember']);
            } else if (typeof json['error'] != 'undefined' && json['error'] != '') {

                $('#disperror').show();
                $('#disperror').html(json['error']);
                $('#TemplateCreationSubmitBtn1').removeAttr('disabled');

            } else {
                $('#disperror').show();
                $('#disperror').html('Some Error in sending to Campaign List, please try again later.');
                $('#TemplateCreationSubmitBtn1').removeAttr('disabled');
            }
            $('div#bulkloader').hide();
            $('#donothing').focus();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

function saveCampaignListFormData(totalSelectedMember) {

    $('#ConfirmMsgBody').html('Are you sure you want to push ' + totalSelectedMember + ' leads?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $('#ConfirmPopupArea').modal('hide');
        var data = [];
        if ($("#ctype").length > 0 && $("#ctype").val() == 'applications') { //for application LMS
            data = $('#FilterApplicationForms,#saveTelephonyCampaignsList').serializeArray();
        } else {
            data = $('#FilterLeadForm, #saveTelephonyCampaignsList').serializeArray();
        }
        
        $.ajax({
            url: '/telephony-campaign/campaign-dialing/saveCampaignListFormData',
            type: 'post',
            dataType: 'json',
            data: data,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            beforeSend: function () {
                $('div#bulkloader').show();
            },
            success: function (json) {
                if (json['location']) {
                    window.location = json['location'];
                } else if (json['status'] == 200) {
                    $('#saveTelephonyCampaignsList input, #saveTelephonyCampaignsList select').val('');
                    $('.modal').modal('hide');
                    alertPopup('Your request have been saved successfully.', 'success');

                } else if (typeof json['error'] != 'undefined' && json['error'] != '') {

                    $('#disperror').show();
                    $('#disperror').html(json['error']);
                    $('#TemplateCreationSubmitBtn1').removeAttr('disabled');

                } else {
                    $('#disperror').show();
                    $('#disperror').html('Some Error in sending to Campaign List, please try again later.');
                    $('#TemplateCreationSubmitBtn1').removeAttr('disabled');
                }
                $('div#bulkloader').hide();
                $('#donothing').focus();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });

    return false;
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
   
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function showOtherCampaign(){
    var campaignId = $('#telephonyCampaignListId').val();
    if(campaignId != 'undefined' && campaignId == 'other'){
        $('#showOtherCampaign').show();
    }else{
        $('#otherCampaignName').val('');
        $('#showOtherCampaign').hide();
    }
}