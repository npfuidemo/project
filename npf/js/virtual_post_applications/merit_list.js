var validAdvanceFilter = true;
$(document).ready(function(){
    if(jsVars.showListing === 1) {
        getMeritList();
        loadMeritListData();
    } else {
        getMeritListBasicSettings();
    }
});

$(document).on('click', '#save_merit_list', function(){
    saveMeritList();
});
$(document).on('click', '#meritlist_tab', getMeritList);
$(document).on('click', '.editMeritList', editMeritListDetails);
$(document).on('click', '.publishMeritList', generateMeritList);
$(document).on('click', '#addNewMeritList', getMeritListBasicSettings);
$(document).on('click', '#basic_setting_tab', getMeritListBasicSettings);
$(document).on('click', '.excludedListRadio', excludedListDivToggle);
$(document).on('change', '#selection_type', changeSelectionType);
$(document).on('change', '#condition_field', updateConditionFieldLabel);
$(document).on('change', '#rank_field', updateRankFieldLabel);
$(document).on('click', '#applicantCountBtn', showApplicantCount);
$(document).on('click', '#tie_breaking_settings_tab', getTieBreakerSettings);
$(document).on('click', '#publishMeritList_setting_tab', generateMeritList_setting_tab);
$(document).on('click', '#tieBreakingMeritList_setting_tab', tieBreakingMeritList_setting_tab);
$(document).on('click', '#downloadMeritList', downloadMeritList_tab);

function downloadMeritList_tab()
{
        var fromApplicantCount = 0;
        var validateMeritData = validateMeritListData(fromApplicantCount);
        if(validateMeritData === false) {
        return false;
        }
        var showModalAfterSaving = 0;
        var flag=saveMeritList(showModalAfterSaving, fromApplicantCount);
        if(flag==0)
        {
            return false;
        }
        if(validAdvanceFilter === false) {
            return false;
        }
        var meritListId = $(document).find('#meritListId').val();
        if(meritListId === '' || meritListId === '0' || meritListId === 0) {

        return false;
        }
        var status = parseInt($(this).attr('meritStatus'));
        if(typeof status === 'undefined' || meritListId === '') {
        alert("First save and than publish");
        return false;
        }
        var textForPopUp = 'Do you want to download the meritlist?';
          
        var thisObj = this;
         $("#ConfirmPopupArea").css('z-index',11001);
         $('#ConfirmPopupArea .npf-close').hide();
         $('#ConfirmMsgBody').html(textForPopUp);
         $('#confirmYes').html('Download');
         $('#confirmNo').html('Cancel');
          $('#confirmTitle').html('Message');
         $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
                 .one('click', '#confirmYes', function (e) {
                     e.preventDefault();
             $('#confirmYes').html('Yes');
         $('#confirmNo').html('No');
                        //$('#muliUtilityPopup').modal('show');
                      
                     downloadMeritList(meritListId, thisObj);
                     $('#ConfirmPopupArea').modal('hide');
                 });
   
}

function generateMeritList_setting_tab(){

    var meritListId = $(document).find('#meritListId').val();

            var fromApplicantCount = 0;
            var validateMeritData = validateMeritListData(fromApplicantCount);
            if(validateMeritData === false) {
                return false;
            }
            var showModalAfterSaving = 0;
            var flag=saveMeritList(showModalAfterSaving, fromApplicantCount);
            if(flag==0)
            {
                return false;
            }
            if(validAdvanceFilter === false) {
                return false;
            }
    var meritListId = $(document).find('#meritListId').val();
    if(meritListId === '' || meritListId === '0' || meritListId === 0) {
            
        return false;
    }
//    var meritListId = $(this).attr('meritListId');
    var status = parseInt($(this).attr('meritStatus'));
    if(typeof status === 'undefined' || meritListId === '') {
        alert("First save and than publish");
       return false;
   }
    //var textForPopUp = 'Do you want to publish this merit list ?';
     var textForPopUp = 'I have checked the test results and ensured the rank assigned to the candidate is correct.';
//    if(status===1){
//        textForPopUp = 'This merit list is already published.';
//        alertPopup(textForPopUp, 'notification');
//        return false;
//    } else if(status===11){
//        textForPopUp = 'Already In-Progress.';
//        alertPopup(textForPopUp, 'notification');
//        return false;
//    }
    var thisObj = this;
    $("#ConfirmPopupArea").css('z-index',11001);
    $('#ConfirmPopupArea .npf-close').hide();
    $('#ConfirmMsgBody').html(textForPopUp);
    $('#confirmYes').html('Publish');
    $('#confirmNo').html('Back');
     $('#confirmTitle').html('Message');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();
         $('#confirmYes').html('Yes');
         $('#confirmNo').html('No');

                publishMeritList(meritListId, thisObj);
                $('#ConfirmPopupArea').modal('hide');
            });
}
function tieBreakingMeritList_setting_tab(){
     //$(document).find('#displayCount').html('').hide();
    var fromApplicantCount = 0;
    var validateMeritData = validateMeritListData(fromApplicantCount);
    if(validateMeritData === false) {
        return false;
    }
    var showModalAfterSaving = 0;
    var flag=saveMeritList(showModalAfterSaving, fromApplicantCount);
    if(flag==0)
    {
        return false;
    }
    if(validAdvanceFilter === false) {
        return false;
    }
    var meritListId = $(document).find('#meritListId').val();
    if(meritListId === '' || meritListId === '0' || meritListId === 0) {
        return false;
    }

    var textForPopUp = 'Do you want to Check the tie breaking this merit list ?';
    var thisObj = this;
    $("#ConfirmPopupArea").css('z-index',11001);
    $('#ConfirmPopupArea .npf-close').hide();
    $('#ConfirmMsgBody').html(textForPopUp);
     $('#confirmYes').html('Yes');
     $('#confirmNo').html('No');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();
                CheckTieBreakMeritList(meritListId, thisObj);
                $('#ConfirmPopupArea').modal('hide');
            });
}
function generateMeritList(){
    var meritListId = $(this).attr('meritListId');
    var status = parseInt($(this).attr('meritStatus'));
    if(typeof status === 'undefined' || meritListId === '') {
        return false;
    }
    var textForPopUp = 'Do you want to publish this merit list ?';
    if(status===1){
        textForPopUp = 'This merit list is already published.';
        alertPopup(textForPopUp, 'notification');
        return false;
    } else if(status===11){
        textForPopUp = 'Already In-Progress.';
        alertPopup(textForPopUp, 'notification');
        return false;
    }
    var thisObj = this;
    $("#ConfirmPopupArea").css('z-index',11001);
    $('#ConfirmPopupArea .npf-close').hide();
    $('#ConfirmMsgBody').html(textForPopUp);
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();
                publishMeritList(meritListId, thisObj);
                $('#ConfirmPopupArea').modal('hide');
            });
}

function getTieBreakerSettings() {
    $.ajax({
        url: jsVars.FULL_URL + '/virtual-post-applications/get-tie-breaker-settings',
        type: 'post',
        dataType: 'html',
        data: {'collegeId':jsVars.collegeId, 'formId':jsVars.formId, 'postApplicationProcessId':jsVars.postApplicationProcessId, 'meritListId':'meritListId'},
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
                    $(document).find("#tie_breaking_settings").html(responseObject.data.html);
                    $("#tie_breaking_settings_tab").closest('li').addClass('active');
                    $("#tie_breaking_settings").addClass('active');
                    $("#tie_breaking_settings").addClass('in');
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

function downloadMeritList(meritListId, thisObj) {
    $.ajax({
        url: jsVars.FULL_URL + '/virtual-post-applications/generateMeritList',
        type: 'post',
        dataType: 'json',
        data: {'collegeId':jsVars.collegeId, 'formId':jsVars.formId, 'postApplicationProcessId':jsVars.postApplicationProcessId, 'meritListId':meritListId, 'tiebreakingflag':0, 'meritlistdownloadflag':1},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        complete:function(){
            $("html, body").animate({scrollTop:0}, 1000);
            $(this).parent('.tab-pane').addClass('fadeIn');
        },
        beforeSend: function () {
            showLoader();
        },
        success: function (json) { 
            //alert(json['message']);
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(json['status'] ===1) {
                $(document).find('#'+meritListId+'_statusText').removeClass('text-danger');
                $(document).find('#'+meritListId+'_statusText').addClass('text-success');
                //$(thisObj).attr('meritStatus', '11');
                //alertPopup(json['message'], 'notification');
                  $('#muliUtilityPopup').modal('show');
                  $('#downloadListing').hide();
                  $('#downloadListingExcel').show();
                  $('#downloadListingExcel').attr('href', json['message']);
                //$('#tieBreakingMeritList_setting_tab_count').val(json['message']);
            } else{
                alertPopup(json['message'], 'error');
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
function publishMeritList(meritListId, thisObj) {
    $.ajax({
        url: jsVars.FULL_URL + '/virtual-post-applications/generateMeritList',
        type: 'post',
        dataType: 'json',
        data: {'collegeId':jsVars.collegeId, 'formId':jsVars.formId, 'postApplicationProcessId':jsVars.postApplicationProcessId, 'meritListId':meritListId},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        complete:function(){
            $("html, body").animate({scrollTop:0}, 1000);
            $(this).parent('.tab-pane').addClass('fadeIn');
        },
        beforeSend: function () {
            showLoader();
        },
        success: function (json) {
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(json['status'] ===1) {
                $(document).find('#'+meritListId+'_statusText').removeClass('text-danger');
                $(document).find('#'+meritListId+'_statusText').addClass('text-success');
                $(document).find('#'+meritListId+'_statusText').html('In-Progress');
                $(thisObj).attr('meritStatus', '1');
                //sessionStorage.reloadAfterPageLoad = true;
                
               // location.reload();
                alertPopup(json['message'], 'Success');
            } else{
                alertPopup(json['message'], 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function () {
            hideLoader();
        },
    });
    $(document).ajaxStop(function(){
  setTimeout("window.location = ''",1500);
});
}
function CheckTieBreakMeritList(meritListId, thisObj) {
    $.ajax({
        url: jsVars.FULL_URL + '/virtual-post-applications/generateMeritList',
        type: 'post',
        dataType: 'json',
        data: {'collegeId':jsVars.collegeId, 'formId':jsVars.formId, 'postApplicationProcessId':jsVars.postApplicationProcessId, 'meritListId':meritListId, 'tiebreakingflag':1},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        complete:function(){
            $("html, body").animate({scrollTop:0}, 1000);
            $(this).parent('.tab-pane').addClass('fadeIn');
        },
        beforeSend: function () {
            showLoader();
        },
        success: function (json) {
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(json['status'] ===1) {
                $(document).find('#'+meritListId+'_statusText').removeClass('text-danger');
                $(document).find('#'+meritListId+'_statusText').addClass('text-success');
                //$(thisObj).attr('meritStatus', '11');
                //alertPopup(json['message'], 'notification');
                $('#tieBreakingMeritList_setting_tab_count_parent').show();
                $('#tieBreakingMeritList_setting_tab_count').html(json['message']);
            } else{
                alertPopup(json['message'], 'error');
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
function showApplicantCount() {
    $(document).find('#displayCount').html('').hide();
    var fromApplicantCount = 1;
    var validateMeritData = validateMeritListData(fromApplicantCount);
    if(validateMeritData === false) {
        return false;
    }
    var showModalAfterSaving = 0;
    var flag=saveMeritList(showModalAfterSaving, fromApplicantCount);
    if(flag==0)
    {
        return false;
    }
    if(validAdvanceFilter === false) {
        return false;
    }
    var meritListId = $(document).find('#meritListId').val();
    if(meritListId === '' || meritListId === '0' || meritListId === 0) {
        return false;
    }
    $.ajax({
        url: jsVars.FULL_URL + '/virtual-post-applications/showApplicantCount',
        type: 'post',
        data: {'collegeId':jsVars.collegeId, 'formId':jsVars.formId, 'meritListId':meritListId},
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(json['status'] ===1) {
                $(document).find('#displayCount').css('display','inline-block').html(json['data']['total']);
            } else{
                alertPopup(json['message'], 'error');

            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function updateConditionFieldLabel() {
    $(document).find("#condition_field_label").val($("#condition_field option:selected").text());
}
function updateRankFieldLabel() {
    var selectedRankField = $(this).val();
    if(selectedRankField === '') {
        $(document).find("#rank_field_label").val('');
    } else {
        $(document).find("#rank_field_label").val($("#rank_field option:selected").text());
    }
}

function excludedListDivToggle() {
    var excludedList = $(this).val();
    if(excludedList === 'yes') {
        $(document).find('#excludedListDiv').show();
    } else {
        $('select.excluded_merit_list')[0].sumo.unSelectAll();
        $(document).find('#excludedListDiv').hide();
    }
}

function changeSelectionType() {
    var selectionType = $(this).val();
    if(selectionType === 'all') {
        $(document).find('#custom_value_div').hide();
        $(document).find('#custom_type_div').hide();
    } else {
        $(document).find('#custom_value_div').show();
        $(document).find('#custom_type_div').show();
    }
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
        selector_titleID = '#alertTitle';
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
    } else {
        $(selector_parent).modal();
    }
}

function editMeritListDetails() {
    var meritListId = $(this).attr('id');
    $(document).find('#basic_setting_tab').attr('meritListId', meritListId);
    getMeritListBasicSettings();
}

function validateMeritListData(fromApplicantCount = 0) {
    var validateMeritData = true;
    $(document).find('.merit_list_error').html('');
    if($(document).find('#merit_list_name').val() === '') {
        $(document).find('#meritListNameError').html('Please enter a Shortlist/Meritlist Name');
        $("#merit_list_name" ).focus();
        validateMeritData = false;
    } else {
        var regex = "^[a-zA-Z0-9_/.,')(#\\s-]+$";
        if($(document).find('#merit_list_name').val().length > 50)
        {
            $(document).find('#meritListNameError').html('Shortlist/Meritlist Name Should Not Be Greater Than 50 character');
            $("#merit_list_name" ).focus(); 
            validateMeritData = false;
        }
        else if (!$(document).find('#merit_list_name').val().match(regex)) {
            $(document).find('#meritListNameError').html("Shortlist/Meritlist Name shall only consist of Alphanumeric characters and special characters like -_/.,')(#");
            $("#merit_list_name" ).focus();
            validateMeritData = false;
        }
    }
    if(fromApplicantCount === 0) {
        if($(document).find('#condition_field').val() === '') {
            $(document).find('#conditionFieldError').html('Please select conditional field');
            $("#condition_field" ).focus().select();
            validateMeritData = false;
        }
        if($(document).find('#rank_field').val() === '') {
            $(document).find('#rankFieldError').html('Please select rank field');
            $("#rank_field" ).focus().select();
            validateMeritData = false;
        }
    }
    if($(document).find('#selection_type').val() === 'custom' && $(document).find('#custom_value').val() === '') {
        $(document).find('#customValueError').html('Please enter custom value');
        $("#selection_type" ).focus().select();
        validateMeritData = false;
    }
    if($('input[name="excludedListRadio"]:checked').val() === 'yes' && $(document).find('#excluded_merit_list').val() === null) {
        $(document).find('#excludedMeritListError').html('Please select merit list');
        $("#excluded_merit_list" ).focus().select();
        validateMeritData = false;
    }
    return validateMeritData;
}

function saveMeritList(showModalAfterSaving = 1, fromApplicantCount=0) {
    var a=1;
    $(document).find('.lead_error').html('');
    var validateMeritData = validateMeritListData(fromApplicantCount);
    if(validateMeritData === false) {
        return false;
    }
    validateMeritListFilter();
    event.preventDefault();
    if(validAdvanceFilter === false) {
        return false;
    }
    $.ajax({
        url: jsVars.FULL_URL + '/virtual-post-applications/save-merit-list',
        type: 'post',
        data: $(document).find('#meritlist_basic_settings_form').serialize(),
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(json['status'] ===1) {
                $(document).find('#meritListId').val(json['data']['meritListId']);
                $(document).find('#meritStatus').val(24);
                if(showModalAfterSaving === 1) {
                    alertPopup('You have successfully saved the merit list config.', 'notification');
                }
            } else{
                $(document).find('#meritListNameError').html(json['message']);
                $("#merit_list_name" ).focus();
                //alertPopup(json['message'], 'error');
                a = 0;
            }

            dropdownMenuPlacement();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return a;
}

function getMeritList() {
    $(document).find('#basic_setting_tab').attr('meritListId', '0');
    $.ajax({
        url: jsVars.FULL_URL + '/virtual-post-applications/get-merit-list',
        type: 'post',
        dataType: 'html',
        data: {'collegeId':jsVars.collegeId, 'formId':jsVars.formId, 'postApplicationProcessId':jsVars.postApplicationProcessId},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        complete:function(){
            $("html, body").animate({scrollTop:0}, 1000);
            $(this).parent('.tab-pane').addClass('fadeIn');

        },
        beforeSend: function () {
            showLoader();
        },
        async: false,
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status===1){
                if(responseObject.data.html) {
                    $(document).find("#get_meritlist").html(responseObject.data.html);
                }
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message, 'error');
                }
            }
           
           dropdownMenuPlacement();
           loadMeritListData();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function () {
            $('.chosen-select').chosen();
            hideLoader();
        }
    });
}

function getMeritListBasicSettings() {
    var meritListId = $(document).find('#basic_setting_tab').attr('meritListId');
    $.ajax({
        url: jsVars.FULL_URL + '/virtual-post-applications/get-merit-list-basic-settings',
        type: 'post',
        dataType: 'html',
        data: {'collegeId':jsVars.collegeId, 'formId':jsVars.formId, 'postApplicationProcessId':jsVars.postApplicationProcessId, 'meritListId':meritListId},
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
                    $("#meritlist_tab").closest('li').removeClass('active');
                    $("#get_meritlist").removeClass('active');
                    $("#get_meritlist").removeClass('in');
                    $(document).find("#meritlist_basic_setting").html(responseObject.data.html);
                    $("#basic_setting_tab").closest('li').addClass('active');
                    $("#meritlist_basic_setting").addClass('active');
                    $("#meritlist_basic_setting").addClass('in');
                    filterColumnOptionsCollegeApplication(jsVars.collegeId, jsVars.formId);
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
            //hideLoader();
        }
    });
}
function showLoader() {
    $(document).find("#listloader").show();
}
function hideLoader() {
    $(document).find("#listloader").hide();
}

function getMeritListLogic(myJSON) {
    var meritListId = $(document).find('#meritListId').val();
    $.ajax({
        url: jsVars.FULL_URL + '/virtual-post-applications/getMeritListLogic',
        type: 'post',
        dataType: 'html',
        data: {'collegeId':jsVars.collegeId, 'formId':jsVars.formId, 'postApplicationProcessId':jsVars.postApplicationProcessId, 'meritListId':meritListId, 'filterArray':myJSON},
        async : false,
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
                    $(document).find("#meritListLogic").html(responseObject.data.html);
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
            //hideLoader();
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
/****For display Merit List Data***/
    function loadMeritListData() {
        var varPage = $('#pageJump').val(), rows = $('#rows').val();
        if(typeof varPage=='undefined'){
            varPage=1;rows=10;
        }
        $.ajax({
            url: jsVars.FULL_URL + '/virtual-post-applications/load-merit-list-data',
            type: 'post',
            dataType: 'html',
            data: {'collegeId':jsVars.collegeId, 'formId':jsVars.formId, 'postApplicationProcessId':jsVars.postApplicationProcessId,'rows':rows, 'page':varPage},
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            beforeSend: function () {
                $('#listloader').show();
            },
            complete: function () {
               $('#listloader').hide();
            },
            async:true,
            success: function (data) {
                if (data == "norecord") {
                    if (varPage == 1)
                        error_html = "No Records found";
                    else
                        error_html = "No More Record";
                    $('#load_more_results_body').append("<tr><td class=' text-danger text-center fw-500' colspan='10'>" + error_html + "</td></tr>");
                    $('.layoutPagination').hide();
                } else{
                    $('.layoutPagination').show();
                    $('#load_more_results_body').html(data);
                    if(varPage == 1 && maxPage != 'undefined') {
                        $('#maxPage').html(maxPage);
                        if(maxPage == 1) {
                            $('.prev, .next').removeClass('disabled').addClass('disabled');
                        } else {
                            $('.prev').removeClass('disabled').addClass('disabled');
                            $('.next').removeClass('disabled');
                        }
                    } else if(maxPage != 'undefined' && varPage == maxPage) {
                        $('.prev').removeClass('disabled');
                        $('.next').removeClass('disabled').addClass('disabled');
                    } else {
                        $('.prev, .next').removeClass('disabled');
                    }
                }    
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
$('#pageJump').bind('keypress', function(e) {
   if ((e.which >= 48 && e.which <= 57) ||
       e.which === 8 || //Backspace key
       e.which === 13   //Enter key
       ) {
   } else {
     e.preventDefault();
   }
});
$('#pageJump').on("paste",function(e) {
   e.preventDefault();
});

$(document).on('change', '#pageJump', function() {
   if($('#pageJump').val() == '' || $('#pageJump').val().match(/^\d+$/) == null) {
       alertPopup('Invalid Page Number', 'error');
       return false;
   } else if(parseInt($('#pageJump').val()) < 1 || parseInt($('#pageJump').val()) > parseInt($('#maxPage').html())) {
       alertPopup('Invalid Page Number', 'error');
       return false;
   }
   loadMeritListData();
});

$(document).on('change', '#rows', function() {
   $('#pageJump').val('1');
   loadMeritListData();
});

$(document).on('click', '.prev', function(event) {
   if($('#pageJump').val().match(/^\d+$/) == null || parseInt($('#pageJump').val()) < 2) {
       event.preventDefault();
       return false;
   } else if(parseInt($('#pageJump').val()) < 2 || parseInt($('#pageJump').val()) > parseInt($('#maxPage').html())) {
       alertPopup('Invalid Page Number', 'error');
       return false;
   }
   var updatePageValue = parseInt($('#pageJump').val()) - 1;
   if(updatePageValue < 2) {
       $(this).addClass('disabled');
       $('.next').removeClass('disabled');
   }
   $('#pageJump').val(updatePageValue);
   loadMeritListData();
});

$(document).on('click', '.next', function(event) {
   if($('#pageJump').val().match(/^\d+$/) == null || parseInt($('#pageJump').val()) >= parseInt($('#maxPage').html())) {
//        alertPopup('Something went wrong', 'error');
       event.preventDefault();
       return false;
   } else if(parseInt($('#pageJump').val()) < 1) {
       alertPopup('Invalid Page Number', 'error');
       return false;
   }
   var updatePageValue = parseInt($('#pageJump').val()) + 1;
   if(updatePageValue >= $('#maxPage').html()) {
       $(this).addClass('disabled');
       $('.prev').removeClass('disabled');
   }
   $('#pageJump').val(updatePageValue);
   loadMeritListData();
});