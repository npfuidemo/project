jQuery(function () {
    $('.sectionLoader').hide();
    $("div.bhoechie-tab-menu>div.list_group>a").click(function (e) {
        e.preventDefault();
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
        var index = $(this).index();
        $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
        $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
    });
});

function ajaxCustomAudienceslist(hashed) {
    $.ajax({
        url: '/connectors/facebook-custom-audiences/ajax-custom-audienceslist',
        type: 'post',
        dataType: 'html',
        data: {'hashed':hashed},
        beforeSend: function (xhr) {
//            $('div.loader-block').show();
                $('.sectionLoader').show();

        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if (data == 'error:session') {
                window.location.reload(true);
            } else if (data.indexOf('error:') > -1) {
                var error = data.replace(/error\:/, '');
                alertPopup(error, 'error');
            } else {
                $('#listingContainerSection').html(data);
//                $("div.bhoechie-tab-menu>div.list_group>a").click(function(e) {
//                    e.preventDefault();
//                    $(this).siblings('a.active').removeClass("active");
//                    $(this).addClass("active");
//                    var index = $(this).index();
//                    $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
//                    $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
//                });
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
}

function deleteCustomAudienceList(hashed,ca){
    $('.modal').modal('hide');
    $('#ConfirmMsgBody').html('Are you sure of this action?');
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
    .one('click', '#confirmYes', function (e) {
        e.preventDefault();
        ajaxDeleteCustomAudienceList(hashed,ca);
    });
    
}

function ajaxDeleteCustomAudienceList(hashed,ca){
    $('.modal').modal('hide');
    $.ajax({
        url: '/connectors/facebook-custom-audiences/delete-custom-audience-list',
        type: 'post',
        dataType: 'json',
        data: {'hashed':hashed},
        beforeSend: function (xhr) {
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if (data['session'] == 'session') {
                window.location.reload(true);
            } else if (typeof data['error'] !='undefined' && data['error']!='') {
                alertPopup(data['error'], 'error');
            } else {
                $('.id_'+ca).hide();
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


function addCustomAudienceListForm(id,user_id){

    $.ajax({
        url: '/connectors/facebook-custom-audiences/add-custom-audience-form',
        type: 'post',
        dataType: 'html',
        data: {'id':id,'u':user_id},
        beforeSend: function () { 
          $('#modalLoaderDiv').show();
		  $('.modalLoader').show();
        },
        complete:function(){
           $('#modalLoaderDiv').hide();
		   $('.modalLoader').hide();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (html) {

            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                window.location.reload(true);
            }
            else if (checkError === 'ERROR:'){
                alertPopup(html.substring(6, html.length),'error');
            }
            else{
                $('h2#alertTitle').html('Add Custom Audience');
                $('#create-lead .modal-body').html('');
                $('#create-lead').modal('show');
				$('#create-lead .modal-dialog').addClass('modal-sm');
                $('#create-lead .modal-body').html(html);
//                $('#add_quick_leadpopup').html(html);
//                $('#addQuickLeadDiv').css('width','770px');
//                $('#showAddQuickLeadPopUp').trigger('click');
                $('.chosen-select').chosen();
                $('.chosen-select').trigger('chosen:updated');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    }); 
}

function saveCustomAudienceList(){
    $('.modal').modal('hide');
    $.ajax({
        url: '/connectors/facebook-custom-audiences/save-custom-audience-list',
        type: 'post',
        dataType: 'json',
        data: $('#add_custom_audience').serializeArray(),
        beforeSend: function () { 
          $('#modalLoaderDiv').show();
        },
        complete:function(){
           $('#modalLoaderDiv').hide();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (data) {
            if (data['session'] == 'session') {
                window.location.reload(true);
            } else if (typeof data['error'] !='undefined' && data['error']!='') {
                alertPopup(data['error'], 'error');
            } else {
               alertPopup(data['success'], 'success');
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
function facebookCustomAudiencesPopup(){
    $('#listloader').show();
    var total_checked=0;
    var display_popup = false;
    $('input:checkbox[name="selected_users[]"]').each(function () {
        if(this.checked){
            display_popup = true;
            total_checked++;
        }
    });

    if(typeof is_filter_button_pressed =='undefined' || is_filter_button_pressed != 1){
        alertPopup('It seems you have changed the filter but not Applied it. Please re-check the same to proceed further.','error');
        $('#listloader').hide();
        return;
    }

    var checkbox_alert  = false;
    var select_all      = $('#select_all:checked').val();
    var ctype           = $('input#ctype').val();
    if(display_popup || select_all == 'select_all' || ($('#single_user_id').length>0 && $('#single_user_id').val() != '' )){
        // display bulk action popup
        $('#utilityPop1 .modal-title').html('Send to Facebook');
        $('#utilityPop1').modal();
		$('#utilityPop1 .modal-dialog').addClass('modal-sm');
        //$('.tab-overflow').css('min-height','300px');
        //$('#bulk_communication_action').hide();
        //$('#credit_info_msg').hide();
        bulkFacebookCustomAudiences(ctype);
    }
    else{
        $('#listloader').hide();
        /**
         * Show alert message if checkbox is not checked as per ctype
         * By default it will show "Please select User" message in alert popup
         *
         */
        var message='Please select User.';
        alertPopup(message,'error');
    }
}

/**
 * 
 * @param {type} ctype
 * @returns {undefined}
 */

function bulkFacebookCustomAudiences(ctype){
    $('div.loader-block').hide();
    var total_count = $('#tot_records').text();
    var all_records = $('#all_records_val').val();
    var list_manager_id = '';

    if(ctype=='applications'){
        var data = $('#FilterApplicationForms').serializeArray();
    }
    else if(ctype=='userleads') {
        var data = $('#FilterLeadForm').serializeArray();
    }
    else{
        $('#listloader').hide();
        alertPopup('We are not able to process your request right now. Please refresh the page and try again. In case, you face the issue again, get in touch with your dedicated Account Manager.','error');
        return;
    }
    data.push({name: "total_count", value: total_count});
    data.push({name: "all_records", value: all_records});
    data.push({name: "ctype", value: ctype});
    data.push({name: "list_manager_id", value: list_manager_id});
    $.ajax({
        url: '/connectors/facebook-custom-audiences/custom-audience-list-form',
        type: 'post',
        dataType: 'html',
        data: data,
//        async: false,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () {
            $('div.loader-block-lead-list').show();
        },
        success: function (data) {
            $('div.loader-block-lead-list').hide();
            //$('#bulkloader').show();
            $('#utilityPop1 .modal-body').html(data);
			floatableLabel();
//            $.material.init();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function saveCustomAudiencesList(){
    $('#schedule_button').prop('disabled',true);
    var data=[];
    if($("#ctype").length>0 && $("#ctype").val() == 'applications'){ //for application LMS
        data = $('#FilterApplicationForms,#saveCustomAudiencesList').serializeArray();
    }
    else{
        data = $('#FilterLeadForm, #saveCustomAudiencesList').serializeArray();
    }

    var error = validateRecurringFbCustomAudience('saveCustomAudiencesList');
    if(error==true){
         $('#schedule_button').prop('disabled',false);
        return false;
    }
    $.ajax({
        url: '/connectors/facebook-custom-audiences/save-custom-audiences-list',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (obj) {

            if (obj.status == 200) {
                $('.modal').modal('hide');
                 alertPopup('Records has been successfully sent to Facebook.', 'success');
//                        bulkEmailCommunication();
//                $('#TemplateCreationSubmitBtn1').html('Sent');
//                $('#disperror').html('');
//                $('#disperror').hide();
//                $('#dispsuccess').show();
//                
//                $('#dispsuccess').html('Communication Request for Facebook Custom Audience saved successfully.');

            }
            else if(typeof obj.error != 'undefined' && obj.error!=''){

                $('#saveCustomAudiencesList #dispsuccess').html('');
                $('#saveCustomAudiencesList #disperror').show();
                $('#saveCustomAudiencesList #dispsuccess').hide();

                $('#saveCustomAudiencesList #disperror').html(obj.error);
                $('#TemplateCreationSubmitBtn1').removeAttr('disabled');
                $('#schedule_button').prop('disabled',false);
            }
            else{
                $('#saveCustomAudiencesList #disperror').show();
                $('#saveCustomAudiencesList #dispsuccess').hide();
                $('#saveCustomAudiencesList #dispsuccess').html('');
                $('#disperror').html('Some Error in sending to Facebook Custom Audience, please try again later.');
                $('#TemplateCreationSubmitBtn1').removeAttr('disabled');
                $('#schedule_button').prop('disabled',false);
            }
            $('div.loader-block').hide();
            $('#donothing').focus();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
    
    return false;
}

function ajaxGetCustomAudienceList(elem,fbAccountId){
    $.ajax({
        url: '/connectors/facebook-custom-audiences/ajax-get-custom-audience-list',
        type: 'post',
        dataType: 'html',
        data: {fbAccountId:fbAccountId,fb_ad_account_id:elem.value},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () {
            $('div.loader-block-lead-list').show();
            $('#listloader').hide();
        },
        success: function (data) {
            $('div.loader-block-lead-list').hide();
            $('#fb_custom_audience_list').html(data);
            $('.chosen-select').chosen();
            $('.chosen-select').trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
/**
 * 
 * @param {type} elem
 * @returns {undefined}
 */

function getNewListForm(elem){
    if(typeof elem !='undefined' && elem.value=='add_new_list'){
        $('.new_add_list').show();
    }
    else{
        $('.new_add_list').hide();
    }
    return;
}


function getFacebookCustomAudiencePushedLog(fb_ca_id,college_id,listingType){
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
        url: '/connectors/facebook-custom-audiences/get-facebook-custom-audience-pushed-log',
        type: 'post',
        dataType: 'html',
        data: {'facebook_ca_id':fb_ca_id,'college_id':college_id,'page':varPage},
//        async: false,
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
            // $('div.loader-block-lead-list').hide();
            // $('h2#alertTitle').html('Custom Audience Pushed Log');
            // $('#CommunicationBulkAction').modal();
            // $('.tab-overflow').css('min-height','300px');
            // $('#bulk_communication_action,#credit_info_msg').hide();
            // $('#bulk-actions').html(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
}


/**
 * sync facebook custom audeinces account list
 * @param integer id
 * @returns {undefined}
 */

function syncFacebookCustomAudienceAccountList(hashed) {
    $.ajax({
        url: '/connectors/facebook-custom-audiences/sync-facebook-custom-audience-account-list',
        type: 'post',
        dataType: 'json',
        data: {'hashed': hashed},
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

            if (typeof json['error'] !='undefined' && json['error'] == 'session') {
                window.location.reload(true);
            }
            else if (typeof json['error'] !='undefined' && json['error'] !== '') {
                alertPopup(json['error'], 'error');
            }
            else {
                alertPopup('Facebook Custom Audience Accounts is syncronised with Live.', 'success');
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
/**
 * ajax for display add account popup
 * @param {string} hashed
 * @returns {undefined}
 */

function addFacebookCustomAudienceAccounts(hashed) {
    $.ajax({
        url: '/connectors/facebook-custom-audiences/add-custom-audience-accounts',
        type: 'post',
        dataType: 'html',
        data: {'hashed': hashed},
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
            } else if (data.indexOf('error:') > -1) {
                var error = data.replace(/error\:/, '');
                alertPopup(error, 'error');
            } else {
                $('#LeadSuccessPopupArea #alertTitle').html('Add Custom Audience Account');
                $('#LeadSuccessPopupArea #MsgBody').html(data);
                $('#LeadSuccessPopupArea').modal('show');
                $('#LeadSuccessPopupArea a.btn-npf').hide();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


/**
 * confirmation popup for enabled account
 * @type type
 */

$(document).on('click', 'form#setFacebookCAAccountsAccess #saveButton', function () {
    $('#addAccountsCommonError').hide();
    $('#addAccountsCommonError').html('');
    $('#ConfirmMsgBody').html('Are you sure to Add / Remove Custom Audience Account to Access?');
    $('#ConfirmPopupArea').css('z-index', '999999').modal({backdrop: 'static', keyboard: false})
            .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $('#ConfirmPopupArea').modal('hide');
        saveCAAccountsAccess();
    });
});

/**
 * saving, enabled account, mark status 1 for enabled
 * @returns {Boolean}
 */
function saveCAAccountsAccess() {
        var data = $('#setFacebookCAAccountsAccess').serializeArray();
        $('form#setFacebookCAAccountsAccess #saveButton').attr('disabled', true);
        data.push({name: "action", value: 'save'});
        $.ajax({
            url: '/connectors/facebook-custom-audiences/save-custom-audience-accounts-access/',
            type: 'post',
            dataType: 'json',
            data: data,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            beforeSend: function () {
                $('div#extensionLoader').show();
            },
            success: function (json) {
                $('div#extensionLoader').hide();
                if (typeof json['error'] !='undefined' && json['error'] == 'session') {
                    window.location.reload(true);
                }
                else if (typeof json['status'] !='undefined' && json['status'] == 200) {
                    $('.modal').modal('hide');
                    alertPopup('Your request have been saved successfully.', 'success');
                    setTimeout(function () {
                        window.location.reload(true);
                    }, 3000);
                }
                else if (typeof json['error'] !='undefined' && json['error']!='') {

                    $('#addAccountsCommonError').show();
                    $('#addAccountsCommonError').html(json['error']);
                    $('form#setFacebookCAAccountsAccess #saveButton').removeAttr('disabled');

                }
                else {
                    $('#addAccountsCommonError').show();
                    $('#addAccountsCommonError').html('Some Error in sending to Custom Audience List, please try again later.');
                    $('form#setFacebookCAAccountsAccess #saveButton').removeAttr('disabled');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    return false;
}

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

function ajaxStopRecurring(hash,college_id){
    $.ajax({
         url: '/connectors/facebook-custom-audiences/stop-recurring',
        type: 'post',
        dataType: 'json',
        data: {
            hashdata: hash,
            'college_id':college_id
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


/**
 * show Recurring Breakup
 * @param int LogId
 * @param string Section
 * @returns {undefined}
 */

function editRecurringLogic(hash,college_id){
    
    $.ajax({
        url: '/connectors/facebook-custom-audiences/edit-recurring-logic',
        type: 'post',
        dataType: 'html',
        data: {'hashdata': hash,'college_id':college_id},
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

    var error = validateRecurringFbCustomAudience('editRecurringForm');
    if(error==true){
        return false;
    }

    var formdata = $('#editRecurringForm').serializeArray();
    formdata.push({name: "hashdata", value: hash});
    $.ajax({
         url: '/connectors/facebook-custom-audiences/save-recurring-logic',
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


function getRecurFreqInputsConnector(){
    var recur_frequency = $("#recur_frequency option:selected").text().toLowerCase();
    $('#recur_date , #recur_day').val("");
    $('#recur_date_div, #recur_day_div, #recur_interval_div').hide();
	$(".clearBothCol").css('clear', 'none');
    //$("#recur_interval").html('').hide();
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
		$(".clearBothCol").css('clear', 'both');
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


/**
 * show Recurring Breakup
 * @param int LogId
 * @param string Section
 * @returns {undefined}
 */

function showRecurringBreakups(aulId){

    $.ajax({
         url: '/connectors/facebook-custom-audiences/show-recurring-breakups',
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

function validateRecurringFbCustomAudience(form_id){
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

function getFbCAPushedCount(caid,college_id){
    $('#count_'+caid).html('loading..');
    $.ajax({
        url: '/connectors/facebook-custom-audiences/get-pushed-count',
        type: 'post',
        dataType: 'json',
        data: {'caid':caid,'college_id':college_id},
        beforeSend: function (xhr) {
            
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if (typeof data.error !== 'undefined' && data.error !== '' && data.error === 'session') {
                window.location.reload(true);
            }
            else if (typeof data.error !== 'undefined' && data.error !== '' ) {
                alertPopup(data.error, 'error');
            }
            else if(typeof data.status  != 'undefined' && data.status == 200){
                $('#count_'+caid).html(data.count);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            
        }
    });

    
}