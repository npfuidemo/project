//Manage Users: Change User Status
function showEmailConfirmationPopup(firstData,from,userRole){
    var currentObj = $('#userChangeStatus_'+firstData);
    var status = currentObj.attr('alt');
    var data = currentObj.attr('data');
    if(status==2){
	if(userRole == '9'){
	    var message = 'On Enabling this user, an Email will be triggered with details to access their account and any Allocation logic if prevalent before will also be restored. Would you like to Continue?';
	    
	}else{
	    var message = 'On Enabling this user, an Email will be triggered with details to access their account. Would you like to Continue?';
	}
        $('#ConfirmAlertYesBtn').unbind();
        $('#ConfirmAlertNoBtn').unbind();
        $('#ConfirmAlertPopUpTextArea').html(message);
        $('#ConfirmAlertPopUpSection .modal-title').html("Enable User");
        $("#ConfirmAlertPopUpSection").modal("show");
        $("#ConfirmAlertYesBtn").on("click",function(){
            changeStatusUser(firstData, status, data,from);
        });
    }else{
	if(userRole == '9'){
	    var message = 'This user would be excluded from Allocation Logic (if any). Are you sure you want to disable this user?';
	}else{
	    var message = 'Are you sure you want to disable this user?';
	}
	$('#ConfirmAlertYesBtn').unbind();
        $('#ConfirmAlertNoBtn').unbind();
        $('#ConfirmAlertPopUpTextArea').html(message);
        $('#ConfirmAlertPopUpSection .modal-title').html("Disable User");
        $("#ConfirmAlertPopUpSection").modal("show");
        $("#ConfirmAlertYesBtn").on("click",function(){
            changeStatusUser(firstData, status, data,from);
        });
    }
}

function deleteUserConfirmationPopup(firstData,userRole){
    var currentObj = $('#deleteUsersData_'+firstData);
    var data = currentObj.attr('data');
    if(userRole == '9'){
        var message = 'This user would be excluded from Allocation Logic (if any). Are you sure you want to delete this user?';
    }else{
        var message = 'Are you sure you want to delete this user?';
    }
    $('#ConfirmAlertYesBtn').unbind();
    $('#ConfirmAlertNoBtn').unbind();
    $('#ConfirmAlertPopUpTextArea').html(message);
    $('#ConfirmAlertPopUpSection .modal-title').html("Delete User");
    $("#ConfirmAlertPopUpSection").modal("show");
    $("#ConfirmAlertYesBtn").on("click",function(){
        deleteUserBackend(firstData, data);
    });
}

function deleteUserBackend(user_id, data) {
    var collegeId = $("#college_id").val();
    $.ajax({
        url: '/users/updateBackendUser',
        type: 'post',
        data: {'user_id': user_id, 'data':data, 'college_id': collegeId},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
           showLoader();
        },
        success: function (responseObject) {
            if (typeof responseObject['redirect'] !== 'undefined' && responseObject['redirect']!=''){
                location = responseObject['redirect'];
            }
            else if(typeof responseObject['error'] !== 'undefined' && responseObject['error']!=''){
                alertPopupAssignedInstitute(responseObject['error'],'error');
            }else if(responseObject['status']==200) {
                alertPopupAssignedInstitute(responseObject['message'],'success');
                getUserManagerList('reset');
                $('#OkBtn').show();
            }
            else if(typeof responseObject['notification'] !== 'undefined' && responseObject['notification']!==''){
                alertPopupAssignedInstitute(responseObject['notification'],'notification');
            }else {
                // System Error
                alertPopupAssignedInstitute('Some Error occured, please try again.', 'error');
            }
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //window.location.reload(true);
        },
        complete: function () {
            hideLoader();
        }
    });
}

function changeStatusUser(user_id, status, data,from) {
    var collegeId = $("#college_id").val();
    $.ajax({
        url: '/users/changeBackendUserStatus',
        type: 'post',
        data: {'user_id': user_id, 'status': status,'data':data, 'college_id': collegeId},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
           showLoader();
        },
        success: function (json) {
            if (json['status'] == 200) {
                if(from.trim()=='frommanager'){
                    alertPopupAssignedInstitute(json['message'],'success');
                    $('#alertTitle').html('User Status');
                    getUserManagerList('reset');
                    $('#OkBtn').show();
                }else{
                    alertPopup(json['message'],'success','/users/user-manager');
                    $('#OkBtn').show();
                    $('#alertTitle').html('User Status');
                }
            }
            else if(typeof json['notification'] !== 'undefined' && json['notification']!==''){
                alertPopupAssignedInstitute(json['notification'],'notification');
            }else if(json['status']== 0 && typeof json['message'] !== 'undefined' && json['message'] == 'session_logout'){
                window.location.reload(true);
            }else {
                // System Error
                alert('Some Error occured, please try again.', 'error');
            }
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            window.location.reload(true);
        },
        complete: function () {
            hideLoader();
        }
    });
}

$('#OkBtn').on('click',function(){
    $("#SuccessPopupArea .npf-close .close").trigger('click');
});

$('#OkBtn').on('click',function(){
    $("#SuccessPopupArea .close").trigger('click');
});


$(document).on('click', '#AllowOverwritePermission', function () {
    if ($(this).is(':checked')){
    } else{
        $('#permissionConfigurationContainer').html('');
    }
});

//
$(document).on('click', '#AllowToUnmaskCollege', function () {
    if ($(this).is(':checked')){
    } else{
        $('#UserUnmaskSection').html('');
    }
});

function saveOutCampusLocationData(){
    var url = '/users/configureOutCampusLocation';
    if(typeof jsVars.paramString != 'undefined'){
        url += '/'+jsVars.paramString;
    }
    var data = $('#outcampusLocationConfigForm').serializeArray();
    $.ajax({
        url: url,
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#UserConfigurationSection .loader-block').show();
        },
        complete: function () {
            // hide loader
            $('#UserConfigurationSection .loader-block').hide();
        },
        success: function (json) {
            if (json['redirect']) {
                // if session is out
                location = json['redirect'];
            }else if (json['session_logout']) {
                // if session is out
                location = FULL_URL;
            } 
            else if (json['status']==0) {
                // error display in popup
                alertPopup(json['message'], 'error');
            }
            else if (json['status'] == 1){
                alertPopup(json['message'], 'Success');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

function SaveTimezoneData(container, fromId){
    if(typeof container == 'undefined' || container != 'UserConfigurationSection'){
        return false;
    }
    var url = '/users/saveTimezoneConfig';
    if(typeof jsVars.paramString != 'undefined'){
        url += '/'+jsVars.paramString;
    }
    var data = $('#' + fromId).serializeArray();
    $.ajax({
        url: url,
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#UserConfigurationSection .loader-block').show();
        },
        complete: function () {
            // hide loader
            $('#UserConfigurationSection .loader-block').hide();
        },
        success: function (json) {
            if (json['redirect']) {
                // if session is out
                location = json['redirect'];
            }else if (json['session_logout']) {
                // if session is out
                location = FULL_URL;
            } 
            else if (json['status']==0) {
                // error display in popup
                alertPopup(json['message'], 'error');
            }
            else if (json['status'] == 200){
                alertPopup(json['message'], 'Success');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

function selectTimezone(elem){
    $(elem).parent().siblings('.timezone-format-block').show();
    var dateSelect  = $(elem).parent().siblings('.timezone-format-block').find('select');
    $(dateSelect).attr('name','timezone['+$(elem).val()+']');
    $(elem).parent().siblings('.addRemoveTimezone').show();
}

$('html').on('click','.addTimezoneConfig',function(){
var html = '<div class="rowSpaceReduce timezoneBlock margin-top-5">';
    html += '<div class="col-sm-4">';
    html += '<select name="intitute[]" class="chosen-select institute-field-config" title="date Fields" onchange="selectTimezone(this);">';
    html += '<option value="">select</option>';
    $.each(jsVars.institutes,function(index,value){
        html += '<option value="'+index+'">'+value+'</option>';
    });
    html += '</select></div>';
    html += '<div class="col-sm-4 timezone-format-block" style="display:none">';
    html += '<select name="timezone[]" class="chosen-select timezone-format" title="date formats">';
    html += '<option value="">select required date format</option>';
    $.each(jsVars.timezones,function(index,value){
        html += '<option value="'+index+'">'+value+'</option>';
    });
    html += '</select></div>';
    html += '<div class="col-sm-2 addRemoveTimezone" style="display:none">';
    html += '<div><a href="javascript:void(0);" class="text-danger removeTimezoneConfig font20" onclick="return confirmDelete(this);"><i class="fa fa-minus-circle" aria-hidden="true"></i></a>';
    html += '<a href="javascript:void(0);" class="text-info addTimezoneConfig font20 margin-left-8"><i class="fa fa-plus-circle" aria-hidden="true"></i></a>';
    html += '</div></div></div>';

    $(this).parent().parent().parent().parent().append(html);
    var lastRow = $('#timezone_config_div').find('.timezoneBlock:last');
    $(lastRow).find('.institute-field-config').trigger('chosen:updated').chosen();
    $(lastRow).find('.timezone-format').trigger('chosen:updated').chosen();
});

/**
 * @param {type} elem
 * @param {type} type
 * @returns {Boolean}
 */
function confirmDelete(elem) {
    var blockName; var addMoreButtonClass;
    blockName = '.timezoneBlock'; addMoreButtonClass = 'addTimezoneConfig';
    
    var defaultBlockLen = $(blockName).length;
    
    $("#ConfirmPopupArea").css('z-index',11001);
    $("#ConfirmPopupArea .npf-close").hide();
    $('#ConfirmMsgBody').html('Do you want to delete ?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();
                $(elem).parent().parent().closest(blockName).remove(); 
                $('#ConfirmPopupArea').modal('hide');
            });
    if(defaultBlockLen <=1){
        $('.'+addMoreButtonClass).trigger('click');
    }        
    return false;
}
if(jsVars.autoSearchUser)
{
    getUserManagerList('reset');
}