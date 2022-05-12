var adsAudienceUserListPage = 2;
jQuery(function () {
    $('.sectionLoader').hide();
    $(document).on('click', '#google-ads-action-type-remove', function(){
        if ($('#google_ads_audience_list').val() == 'add_new_list') {
            $('.new_add_list').hide();
            $('#google_ads_audience_list').val('');
            $('#google_ads_audience_list').trigger('chosen:updated');
        }
    });
    dropdownMenuPlacement();
    
});

function ajaxAdsAudienceUsersList(hashed) {
    
    $('div#LoadMoreArea button#load_more_button').attr('disabled', true);
    $.ajax({
        url: '/connectors/google-ads/ajax-manage-users-list',
        type: 'post',
        dataType: 'html',
        data: {'hashed': hashed, 'page': adsAudienceUserListPage},
        beforeSend: function () {
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('div#LoadMoreArea button#load_more_button').removeAttr('disabled');
            if (data == 'error:session') {
                window.location.reload(true);
            } else if (data.indexOf('location:') > -1) {
                var location = data.replace(/location\:/, '');
                window.location = location;
            } else if (data.indexOf('error:') > -1) {
                var error = data.replace(/error\:/, '');
                alertPopup(error, 'error');
            } else if (data.indexOf('empty:') > -1) {
                var emptyMsg = data.replace(/empty\:/, '');
                $('div#load_more_results_msg').html("<div class='col-md-12'><h4 class='text-center text-success'>" + emptyMsg + "</h4></div>");
                $('div#LoadMoreArea button#load_more_button').hide();
            } else {
                $('#adsAudienceListTableBody').append(data);
                adsAudienceUserListPage = adsAudienceUserListPage + 1;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('div#LoadMoreArea button#load_more_button').removeAttr('disabled');
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('.sectionLoader').hide();
        },
        complete: function () {
            $('.sectionLoader').hide();
        }
    });
}

function deleteCustomAudienceList(hashed, ca) {
    $('.modal').modal('hide');
    $('#ConfirmMsgBody').html('Are you sure of this action?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();
                ajaxDeleteCustomAudienceList(hashed, ca);
            });

}

function ajaxDeleteCustomAudienceList(hashed, ca) {
    $('.modal').modal('hide');
    $.ajax({
        url: '/connectors/facebook-custom-audiences/delete-custom-audience-list',
        type: 'post',
        dataType: 'json',
        data: {'hashed': hashed},
        beforeSend: function (xhr) {
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if (data['session'] == 'session') {
                window.location.reload(true);
            } else if (typeof data['error'] != 'undefined' && data['error'] != '') {
                alertPopup(data['error'], 'error');
            } else {
                $('.id_' + ca).hide();
                alertPopup(data['success'], 'success');
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
//            $('div.loader-block').hide();
            $('.sectionLoader').hide();
        }
    });

    return false;
}


function addGoogleAdsAudienceUsersList(id, ccId, action) {
    if (typeof action == 'undefined') {
        action = 'none';
    }
    $.ajax({
        url: '/connectors/google-ads/add_google_ads_audience_list',
        type: 'post',
        dataType: 'html',
        data: {'id': id, 'ccId': ccId, 'action': action},
        beforeSend: function () {
            $('.sectionLoader').show();
			$('.modalLoader').show();
        },
        complete: function () {
            $('.sectionLoader').hide();
			$('.modalLoader').hide();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (html) {

            var checkError = html.substring(0, 6);
            if (html === 'session') {
                window.location.reload(true);
            } else if (checkError === 'ERROR:') {
                alertPopup(html.substring(6, html.length), 'error');
            } else {
                $('h2#alertTitle').html('Add Google Ads Audience List');
                $('#create-lead .modal-body').html('');
				$('#create-lead .modal-dialog').addClass('modal-sm');
                $('#create-lead').modal('show');
                $('#create-lead .modal-body').html(html);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function saveGoogleAdsAudienceList(action) {
    $('div#createListCommonError span').text('');
    $('div#createListCommonError').hide();
    $.ajax({
        url: '/connectors/google-ads/save-google-ads-audience-list',
        type: 'post',
        dataType: 'json',
        data: $('#addGoogleAdsAudienceListForm').serializeArray(),
        beforeSend: function () {
            $('.sectionLoader').show();
        },
        complete: function () {
            $('.sectionLoader').hide();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (data) {
            if (data['error'] == 'session') {
                window.location.reload(true);
            } else if (data['redirect']) {
                window.location = data['redirect'];
            } else if (typeof data['error'] != 'undefined' && data['error'] != '') {
                $('.modal').modal('hide');
                alertPopup(data['error'], 'error');
            } else if (typeof data['validationError'] != 'undefined' && data['validationError'] != '') {
                $('div#createListCommonError span').text(data['validationError']);
                $('div#createListCommonError').show();
            } else {
                $('.modal').modal('hide');
                alertPopup(data['success'], 'success');
                if (action == 'refresh') {
                    window.location.reload(true);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


/**
 * 
 * @returns {undefined}
 */
function googleAdsAudienceUsersListPopup() {
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

    var checkbox_alert = false;
    var select_all = $('#select_all:checked').val();
    var ctype = $('input#ctype').val();
    if (display_popup || select_all == 'select_all' || ($('#single_user_id').length > 0 && $('#single_user_id').val() != '')) {
        // display bulk action popup
		$('#utilityPop1 .modal-title').html('Send to Google Ads Audience');
        $('#utilityPop1').modal();
		$('#utilityPop1 .modal-dialog').addClass('modal-sm');
        //$('h2#alertTitle').html('Send to Google Ads Audience');
        //$('#CommunicationBulkAction').modal();
        //$('.tab-overflow').css('min-height', '300px');
        //$('#bulk_communication_action').hide();
        //$('#credit_info_msg').hide();
        bulkGoogleAdsAudienceUsersList(ctype);
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

function bulkGoogleAdsAudienceUsersList(ctype) {
    $('div#bulkloader').hide();
    var total_count = $('#tot_records').text();
    var all_records = $('#all_records_val').val();
    var list_manager_id = '';
    var clientCustomerId = '', google_ads_audience_type = '', google_ads_action_type = '';

    if (ctype == 'applications') {
        var data = $('#FilterApplicationForms').serializeArray();
    } else if (ctype == 'userleads') {
        var data = $('#FilterLeadForm').serializeArray();
    } else {
        $('div#bulkloader').hide();
        alertPopup('We are not able to process your request right now. Please refresh the page and try again. In case, you face the issue again, get in touch with your dedicated Account Manager.', 'error');
        return;
    }

    if ($('select#googleAdsCustomersAccountList').length > 0) {
        clientCustomerId = $('select#googleAdsCustomersAccountList').val();
    }
    
    if ($('input[name="google_ads_audience_type"]:checked').length > 0) {
        google_ads_audience_type = $('input[name="google_ads_audience_type"]:checked').val();
    }
    
    if (($('input[name="google_ads_action_type"]:checked').length > 0)) {
        google_ads_action_type = $('input[name="google_ads_action_type"]:checked').val();
    }
    data.push({name: "total_count", value: total_count});
    data.push({name: "all_records", value: all_records});
    data.push({name: "ctype", value: ctype});
    data.push({name: "list_manager_id", value: list_manager_id});
    data.push({name: "google_ads_customer_list", value: clientCustomerId});
    data.push({name: "google_ads_audience_type", value: google_ads_audience_type});
    data.push({name: "google_ads_action_type", value: google_ads_action_type});
    $.ajax({
        url: '/connectors/google-ads/google-ads-audience-list-form',
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
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function validateAudiencesUserListMembers() {
    
    
    
    $('#dispsuccess, #disperror').html('');
    $('#dispsuccess, #disperror').hide();
    var data = [];
    if ($("#ctype").length > 0 && $("#ctype").val() == 'applications') { //for application LMS
        data = $('#FilterApplicationForms').serializeArray();
    } else {
        data = $('#FilterLeadForm').serializeArray();
    }

    var error = validateRecurringGoogleCustomAudience('saveAdsAudiencesUsersList');
    if(error==true){
        $('#TemplateCreationSubmitBtn1').removeAttr('disabled');
        return false;
    }

    data.push({name: "s_college_id", value: $('#saveAdsAudiencesUsersList input#s_college_id').val()});
    data.push({name: "submitform", value: $('#saveAdsAudiencesUsersList input#submitform').val()});
    data.push({name: "all_records", value: $('#saveAdsAudiencesUsersList input#all_records').val()});
    $.ajax({
        url: '/connectors/google-ads/validate-audience-users-list-members',
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
                saveAdsAudiencesUsersList(json['totalSelectedMember']);
            } else if (typeof json['error'] != 'undefined' && json['error'] != '') {

                $('#saveAdsAudiencesUsersList #disperror').show();
                $('#saveAdsAudiencesUsersList #disperror').html(json['error']);
                $('#TemplateCreationSubmitBtn1').removeAttr('disabled');

            } else {
                $('#saveAdsAudiencesUsersList #disperror').show();
                $('#saveAdsAudiencesUsersList #disperror').html('Some Error in sending to Google Ads Audience Users List, please try again later.');
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

function saveAdsAudiencesUsersList(totalSelectedMember) {

    $('#ConfirmMsgBody').html('You are about to send ' + totalSelectedMember + ' leads to your Adwords Account. Confirm?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $('#ConfirmPopupArea').modal('hide');
        var data = [];
        if ($("#ctype").length > 0 && $("#ctype").val() == 'applications') { //for application LMS
            data = $('#FilterApplicationForms,#saveAdsAudiencesUsersList').serializeArray();
        } else {
            data = $('#FilterLeadForm, #saveAdsAudiencesUsersList').serializeArray();
        }

        $.ajax({
            url: '/connectors/google-ads/save-google-ads-audience-users-list',
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
                    $('#saveAdsAudiencesUsersList input, #saveAdsAudiencesUsersList select').val('');
                    $('.modal').modal('hide');
                    alertPopup('Your request have been saved successfully.', 'success');

                } else if (typeof json['error'] != 'undefined' && json['error'] != '') {

                    $('#saveAdsAudiencesUsersList #disperror').show();
                    $('#saveAdsAudiencesUsersList #disperror').html(json['error']);
                    $('#TemplateCreationSubmitBtn1').removeAttr('disabled');

                } else {
                    $('#saveAdsAudiencesUsersList #disperror').show();
                    $('#saveAdsAudiencesUsersList #disperror').html('Some Error in sending to Google Ads Audience Users List, please try again later.');
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

/**
 * 
 * @param {type} elem
 * @returns {undefined}
 */

function getNewListForm(elem) {
    if (typeof elem != 'undefined' && elem.value == 'add_new_list') {
        $('div.new_add_list').show();
        $('#google-ads-action-type-add').trigger('click');
    } else {
        $('div.new_add_list input[name="new_google_ads_audience_name"]').val('');
        $('div.new_add_list input[name="new_google_ads_audience_description"]').val('');
        $('div.new_add_list').hide();
    }
    return;
}

function getGoogleAdsAudiencePushedLog(aul_id, college_id, aul_name) {
    $.ajax({
        url: '/connectors/google-ads/get-audience-user-list-pushed-log',
        type: 'post',
        dataType: 'html',
        data: {'aul_id': aul_id, 'college_id': college_id},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () {
            $('div.loader-block-lead-list').show();
        },
        success: function (data) {

            if (data === 'session') {
                window.location.reload(true);
            } else {
                $('div.loader-block-lead-list').hide();
                $('h2#alertTitle').html('Pushed Log - ' + aul_name + ' (' + aul_id + ')');
                $('#CommunicationBulkAction').modal();
				$('#CommunicationBulkAction .modal-dialog').addClass('modal-sm');
                $('.tab-overflow').css('min-height', '300px');
                $('#bulk_communication_action,#credit_info_msg').hide();
                $('#bulk-actions').html(data);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

}

function disconnectGoogleAdsAccount(hashed_data) {
    $('.modal').modal('hide');
    $('#ConfirmMsgBody').html('Are you sure you want to disconnect with Google Ads Account? This action will delete all mapping data.');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();
                ajaxDisconnectGoogleAdsAccount(hashed_data);
            });
}


function ajaxDisconnectGoogleAdsAccount(hashed_data) {
    $('.modal').modal('hide');
    $.ajax({
        url: '/connectors/google-ads/disconnect-google-ads-account',
        type: 'post',
        dataType: 'json',
        data: {'hashed': hashed_data},
        beforeSend: function () {
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (typeof data['session'] != 'undefined') {
                window.location.reload(true);
            } else if (typeof data['error'] != 'undefined') {
                alertPopup(data['error'], 'error');
            } else {
                alertPopup('Successfully Disconnected', 'success', '/college-settings/connectors-list');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.sectionLoader').hide();
        }
    });

    return false;
}

function ajaxAdsCustomersAccountList(hashed) {
    $('div#LoadMoreArea button#load_more_button').attr('disabled', true);
    $.ajax({
        url: '/connectors/google-ads/ajax-manage-customer-list',
        type: 'post',
        dataType: 'html',
        data: {'hashed': hashed, 'page': jsVars.adsCustomersAccountListPage},
        beforeSend: function () {
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('div#LoadMoreArea button#load_more_button').removeAttr('disabled');
            if (data == 'error:session') {
                window.location.reload(true);
            } else if (data.indexOf('location:') > -1) {
                var location = data.replace(/location\:/, '');
                window.location = location;
            } else if (data.indexOf('error:') > -1) {
                var error = data.replace(/error\:/, '');
                alertPopup(error, 'error');
            } else if (data.indexOf('empty:') > -1) {
                var emptyMsg = data.replace(/empty\:/, '');
                $('div#load_more_results_msg').html("<div class='col-md-12'><h4 class='text-center text-success'>" + emptyMsg + "</h4></div>");
                $('div#LoadMoreArea button#load_more_button').hide();
            } else {
                jsVars.adsCustomersAccountListPage++;
                $('#adsAudienceListTableBody').append(data);
				dropdownMenuPlacement();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('div#LoadMoreArea button#load_more_button').removeAttr('disabled');
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function () {
            $('.sectionLoader').hide();
        }
    });
}

function syncGoogleAdsCustomersList(id, action) {
    if (typeof action == 'undefined') {
        action = 'none';
    }
    $.ajax({
        url: '/connectors/google-ads/sync_google_ads_customers_list',
        type: 'post',
        dataType: 'json',
        data: {'id': id, 'action': action},
        beforeSend: function () {
            $('.sectionLoader').show();
        },
        complete: function () {
            $('.sectionLoader').hide();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {

            if (json['location']) {
                window.location.reload(true);
            } else if (json['error']) {
                alertPopup(json['error'], 'error');
            } else {
                alertPopup('Google Ads Customers Account List is syncronised with Live.', 'success');
                setTimeout(function () {
                    window.location.reload(true);
                }, 3000);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function addGoogleAdsCustomerAccounts(id, action) {
    
    $.ajax({
        url: jsVars.addCustomerAccountsAccessURl,
        type: 'post',
        dataType: 'html',
        data: {'id': id, 'action': action},
        beforeSend: function () {
            $('.sectionLoader').show();
        },
        complete: function () {
            $('.sectionLoader').hide();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (data) {

            if (data == 'error:session') {
                window.location.reload(true);
            } else if (data.indexOf('location:') > -1) {
                var location = data.replace(/location\:/, '');
                window.location = location;
            } else if (data.indexOf('error:') > -1) {
                var error = data.replace(/error\:/, '');
                alertPopup(error, 'error');
            } else {
                $('#AddCustomerAccountsPopupHTMLSection').html(data);
                $('#AddCustomerAccountsPopupArea').modal('show');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$(document).on('click', 'form#setGoogleAdsCustomerAccountsAccess #saveButton', function () {
    $('#addCustomerAccountsCommonError').hide();
    $('#addCustomerAccountsCommonError').html('');
    $('#ConfirmMsgBody').html('Are you sure to Add / Remove Adwords Account to Access your Customer list?');
    $('#ConfirmPopupArea').css('z-index', '999999').modal({backdrop: 'static', keyboard: false})
            .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $('#ConfirmPopupArea').modal('hide');
        saveCustomerAccountsAccess();
    });
});

function saveCustomerAccountsAccess() {
        
        var data = $('#setGoogleAdsCustomerAccountsAccess').serializeArray();
        $('form#setGoogleAdsCustomerAccountsAccess #saveButton').attr('disabled', true);
        data.push({name: "action", value: 'save'});
        $.ajax({
            url: jsVars.saveCustomerAccountsAccessURl,
            type: 'post',
            dataType: 'json',
            data: data,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            beforeSend: function () {
                $('div#extensionLoader').show();
            },
            success: function (json) {
                $('div#extensionLoader').hide();
                if (json['location']) {
                    window.location = json['location'];
                } else if (json['status'] == 200) {
                    $('.modal').modal('hide');
                    alertPopup('Your request have been saved successfully.', 'success');
                    setTimeout(function () {
                        window.location.reload(true);
                    }, 3000);
                } else if (json['error']) {

                    $('#addCustomerAccountsCommonError').show();
                    $('#addCustomerAccountsCommonError').html(json['error']);
                    $('form#setGoogleAdsCustomerAccountsAccess #saveButton').removeAttr('disabled');

                } else {
                    $('#addCustomerAccountsCommonError').show();
                    $('#addCustomerAccountsCommonError').html('Some Error in sending to Google Ads Audience Users List, please try again later.');
                    $('form#setGoogleAdsCustomerAccountsAccess #saveButton').removeAttr('disabled');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    

    return false;
}

function getRecurFreqInputsConnector(){
    var recur_frequency = $("#recur_frequency option:selected").text().toLowerCase();
    $('#recur_date , #recur_day').val("");
    $('#recur_date_div, #recur_day_div, #recur_interval_div').hide();
	//$(".clearBothCol").css('clear', 'none');
    $("#recur_interval").html('').hide();
    if(recur_frequency=="monthly"){
        $('#recur_interval_div .floatify__label').text('Select Interval');
        $("#recur_date_div").show();
    }else if(recur_frequency=="weekly"){
        for (var i = 1; i < 5; i++) {
           $("#recur_interval").append("<option value='"+i+"'>"+i+"</option>");
        }
        $('#recur_interval_div .floatify__label').text('Repeat Week');
        $("#recur_day_div, #recur_interval_div").show();
		//$(".clearBothCol").css('clear', 'both');
    }
    else{
        for (var i = 1; i < 11; i++) {
            $("#recur_interval").append("<option value='"+i+"'>"+i+"</option>");
        }
        $('#recur_interval_div .floatify__label').text('Repetition Frequency');
        $("#recur_interval_div").show();
		//$(".clearBothCol").css('clear', 'both');
    }
    $('.chosen-select').trigger("chosen:updated");
}

function showHideRecurringForm(elem){
    var recurr = 0;
    if($(elem).is(':checked')){
        $('.recurring_form_div').show();
    }
    else{
        $('.recurring_form_div').hide();
        //resetRecurringForm();
    }
}

function ajaxGoogleAdsAudiencePushedLog(aul_id, college_id, listingType) {
    if (listingType === 'reset') {
        varPage = 0;
        $('#listing_container').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
        $('#load_msg').html("Loading...");
    }
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    
    $.ajax({
        url: '/connectors/google-ads/get-audience-user-list-pushed-log',
        type: 'post',
        dataType: 'html',
        data: {'aul_id': aul_id, 'college_id': college_id,'page':varPage},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () {
            $('div.loader-block-lead-list').show();
        },
        success: function (data) {
            varPage = varPage + 1;
            if (data === 'session') {
                window.location.reload(true);
            }
            else {
//                $('div.loader-block-lead-list').hide();
//                $('#adsAudienceListTableBody').html(data);
                 $('#load_msg_div').hide();


                $('#listing_container, #table-data-view, .download-after-data, #if_record_exists, #load_more_button').show();
                data = data.replace("<head/>", '');
                if (listingType === 'reset') {
                    $('#listing_container').html(data);
                } else {
                    $('#listing_container').find("tbody").append(data);
                }
                
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Data');
                $('[data-toggle="popover"]').popover();
				dropdownMenuPlacement();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

function countResult(html) {
    var len = (html.match(/listDataRow/g) || []).length;
    return len;
}


/**
 * show Recurring Breakup
 * @param int LogId
 * @param string Section
 * @returns {undefined}
 */

function showRecurringBreakups(aulId){

    $.ajax({
         url: '/connectors/google-ads/show-recurring-breakups',
        type: 'post',
        dataType: 'html',
        data: {
            aulId: aulId
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function() {
            $('#listloader').show();
        },
        complete: function() {
            $('#listloader').hide();
        },
        success: function (html) {
            if(html == 'session'){
                window.location.reload(true);
            }

            if(html == 'error'){
                alertPopup('Unable to process request.','error');
            }
            else if(html == 'empty'){
                alertPopup('No data found.','error');
            }
            else{
                $('div.loader-block-lead-list').hide();
                $('h2#alertTitle').html('Push Log Breakups');
                $('#CommunicationBulkAction').modal();
				$('#CommunicationBulkAction .modal-dialog').addClass('modal-sm');
                $('.tab-overflow').css('min-height', '300px');
                $('#bulk_communication_action,#credit_info_msg').hide();
                $('#bulk-actions').html(html);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return;
}




/**
 * show Recurring Breakup
 * @param int LogId
 * @param string Section
 * @returns {undefined}
 */


function stopRecurring(hashed,college_id){
    $('.modal').modal('hide');
    $('#ConfirmMsgBody').html('Are you sure of this action?');
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
    .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        ajaxStopRecurring(hashed,college_id);
        $('#ConfirmPopupArea').modal('hide');
    });
}

function ajaxStopRecurring(hash){

    $.ajax({
         url: '/connectors/google-ads/stop-recurring',
        type: 'post',
        dataType: 'json',
        data: {
            hashdata: hash
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function() {
            $('#listloader').show();
        },
        complete: function() {
            $('#listloader').hide();
        },
        success: function (json) {
            if(typeof json.error !=='undefined' && json.error == 'session'){
                window.location.reload(true);
            }
            
            if(typeof json.error !== 'undefined' && json.error !== null && json.error !==''){
                alertPopup(json.error,'error');
            }
            else if(typeof json.status !== 'undefined' && json.status === 200 ){
                if(typeof json.msg != 'undefined' && json.msg !=''){
                    alertPopup(json.msg,'success');
                }
                else{
                    alertPopup('Successfully updated','success');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return;
}

function editRecurringLogic(hash){
    
    $.ajax({
        url: '/connectors/google-ads/edit-recurring-logic',
        type: 'post',
        dataType: 'html',
        data: {'hashdata': hash},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () {
            $('div.loader-block-lead-list').show();
        },
        success: function (data) {

            if (data === 'session') {
                window.location.reload(true);
            }
            else {
                $('div.loader-block-lead-list').hide();
                $('h2#alertTitle').html('Edit Recurring Logic');
                $('#CommunicationBulkAction').modal();
				$('#CommunicationBulkAction .modal-dialog').removeClass('modal-sm modal-lg');
                $('.tab-overflow').css('min-height', '300px');
                $('#bulk_communication_action,#credit_info_msg').hide();
                $('#bulk-actions').html(data);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function saveRecurringLogic(hash){

    var error = validateRecurringGoogleCustomAudience('editRecurringForm');
    if(error==true){
        return false;
    }

    var formdata = $('#editRecurringForm').serializeArray();
    formdata.push({name: "hashdata", value: hash});
    $.ajax({
         url: '/connectors/google-ads/save-recurring-logic',
        type: 'post',
        dataType: 'json',
        data: formdata,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function() {
            $('#listloader').show();
        },
        complete: function() {
            $('#listloader').hide();
        },
        success: function (json) {
            $('#listloader').hide();
            if(typeof json.error !=='undefined' && json.error == 'session'){
                window.location.reload(true);
            }

            if(typeof json.error !== 'undefined' && json.error !== null && json.error !==''){
                $('#CommunicationBulkAction').modal('hide');
                alertPopup(json.error,'error');
            }
            else if(typeof json.status !== 'undefined' && json.status === 200 ){
                if(typeof json.msg != 'undefined' && json.msg !=''){
                     $('#CommunicationBulkAction').modal('hide');
                    alertPopup(json.msg,'success');
                }
                else{
                     $('#CommunicationBulkAction').modal('hide');
                    alertPopup('Successfully updated','success');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

function validateRecurringGoogleCustomAudience(form_id){

    var isEnable =false;
    $('#'+form_id+' .error').hide().html('');
    var error = false;
    if($('#isRecurringGoogleAds').length>0){
        isEnable = $('#isRecurringGoogleAds').is(':checked');
    }
    else if($('#recurring-isrecurringgoogleads').length>0){
        isEnable = $('#recurring-isrecurringgoogleads').val();
    }

    if(isEnable){
        var recur_time = $('#'+form_id+' #recur_time').val();
        var recur_stop_time = $('#'+form_id+' #recur_stop_time').val();
        var recur_frequency = $('#'+form_id+' #recur_frequency').val();
        var recur_day = $('#'+form_id+' #recur_day').val();
        if(typeof recur_time =='undefined' || recur_time == null || recur_time ==''){
            $('#error_span_recur_time').show().html('Please select start date time');
            error = true;
        }
        if(typeof recur_stop_time =='undefined' || recur_stop_time == null || recur_stop_time ==''){
            $('#error_span_recur_stop_time').show().html('Please select stop date time');
            error = true;
        }
        if(typeof recur_frequency !='undefined' && recur_frequency != null && recur_frequency =='Weekly'){
            if(typeof recur_day =='undefined' || recur_day == null || recur_day ==''){
                $('#error_span_recur_day').show().html('Please select recurring day');
                error = true;
            }
        }

        if(error == false){
            if(recur_time == recur_stop_time){
                $('#error_span_recur_time').show().html('Start date time and Stop date time should be different');
                $('#error_span_recur_stop_time').show().html('Start date time and Stop date time should be different');
                error = true;
            }
        }
    }
    return error;
}