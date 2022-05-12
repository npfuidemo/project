    function addMoreRequestParam(div_class, paramName) {
    if (typeof paramName == 'undefined')
    {

        paramName = '';
    }

    var stgClone = jQuery('.' + div_class + '>div.clone').eq(0).clone();
    jQuery(stgClone).find('select').val('');
    jQuery(stgClone).find('select + .chosen-container').remove();
    jQuery(stgClone).find('input').val(paramName);
    jQuery(stgClone).find('.removeIcon').css('display', 'inline-block');
    jQuery('.' + div_class).append(stgClone);
    chosenInit();
    return true;
}

function removeIvrendCondition(elem) {
    $(elem).closest('.rowSpaceReduce').remove();
    return false;
}

function addExtraCustomIvrCondition(div_class) {
    $(div_class).show();
    return false;
}

function saveCustomIvrConfiguration() {
     var data = $('#c2cIvrIntegration').serializeArray();
    $.ajax({
        url: '/college-settings/saveCustomIvrConfiguration',
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function (xhr) {
            $('#buttonSaveC2cConfiguration').prop('disabled', true);
        },
        success: function (data) {
            if (typeof data['session'] != 'undefined') {
                window.location.reload(true);
            } else if (typeof data['error'] != 'undefined') {
                alertPopup(data['error'], 'error');
                $('#ErrorPopupArea').css('z-index', 99999);
                $('#buttonSaveC2cConfiguration').removeAttr("disabled");
            } else {
                alertPopup(data['message'], 'success');
                $('#SuccessPopupArea').css('z-index', 99999);
                if (typeof data['configVendor'] != 'undefined' && data['configVendor'] === 1) {
                         $('#' + data['vendorCheck'] + '_enable').show();
                        $('#' + data['vendorCheck'] + '_remove').show();
                    }else{
                    $('#' + data['vendorCheck'] + '_enable').hide();
                    $('#' + data['vendorCheck'] + '_remove').hide();
                }

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
}

function saveCallRoutingConfiguration() {
     var data = $('#callRoutingIntegration').serializeArray();
    $.ajax({
        url: '/college-settings/saveCallRoutingConfiguration',
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function (xhr) {
            $('#buttonCallRouting').prop('disabled', true);
        },
        success: function (data) {
            if (typeof data['session'] != 'undefined') {
                window.location.reload(true);
            } else if (typeof data['error'] != 'undefined') {
                alertPopup(data['error'], 'error');
                $('#ErrorPopupArea').css('z-index', 99999);
                $('#buttonCallRouting').removeAttr("disabled");
            } else {
                alertPopup(data['message'], 'success');
                $('#SuccessPopupArea').css('z-index', 99999);
                if (typeof data['configVendor'] != 'undefined' && data['configVendor'] === 1) {
                    $('#' + data['vendorCheck'] + '_enable').show();
                    $('#' + data['vendorCheck'] + '_remove').show();
                }else{
                    $('#' + data['vendorCheck'] + '_enable').hide();
                    $('#' + data['vendorCheck'] + '_remove').hide();
                }

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
}

function saveCallDispositionConfiguration() {
     var data = $('#callDispositionIntegration').serializeArray();
    $.ajax({
        url: '/college-settings/saveCallDispositionConfiguration',
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function (xhr) {
            $('#buttoncallDisposition').prop('disabled', true);
        },
        success: function (data) {
            if (typeof data['session'] != 'undefined') {
                window.location.reload(true);
            } else if (typeof data['error'] != 'undefined') {
                alertPopup(data['error'], 'error');
                $('#ErrorPopupArea').css('z-index', 99999);
                $('#buttoncallDisposition').removeAttr("disabled");
            } else {
                alertPopup(data['message'], 'success');
                $('#SuccessPopupArea').css('z-index', 99999);
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
}

function resetValue() {
    var url = $("#ivrCallBackUrl").text();

    var paramList = url.split('/');
    paramList[5] = $("#customIvrVendorSelect").val();
    var callBackUrl = paramList.join('/')
    $("#ivrCallBackUrl").text(callBackUrl);
    $('#ivrResponseType, #ivrOtherParamKey, #ivrRequestOption, #ivrRequestKey, #ivrClicktoCallUrl, #ivrResponseParamkey, #ivrResponseParamValue,#ivrHeaderParamkey,#ivrHeaderParamValue,#ivrRequestMethod').val('');
}

function saveNewVendor(collegeID) {
    var fd = new FormData();
    var file_data = $('input[type="file"]')[0].files; // for multiple files
    for (var i = 0; i < file_data.length; i++) {
        fd.append("file_" + i, file_data[i]);
    }

    var other_data = $('form').serializeArray();

    $.each(other_data, function (key, input) {
        fd.append(input.name, input.value);
    });

    $(".requiredError").html('');
    $.ajax({
        url: '/college-settings/saveNewVendor',
        type: 'post',
        data: fd,
        dataType: 'json',
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,

        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function (xhr) {
            $('#addVendorButton').prop('disabled', true);
        },
        success: function (data) {
            if (typeof data.redirect != 'undefined' && data.redirect != '') {
                window.location = data.redirect;
            } else if (data.success == '200') {
                // $('.error').html("");
//                    $('#showSuccessMessage').show();
//                    $('#showSuccessMessage').html(data.Msg);
                $('#addExtension').modal('hide')
                alertPopup(data.Msg, 'success');
                loadConnectorsByCategory('Telephony',collegeID);
                $(body).css('overflow','');
                jQuery('#Telephony').trigger('click');
            } else {

                for (var key in data.error) {
                    //console.log('key', key);
                    $('#' + key + '_validation').show();
                    $('#' + key + '_validation').html(data.error[key])
                }
                $('#addVendorButton').removeAttr("disabled");

            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function saveIvrConfiguration() {
    var data = $('#ivrConfigurationForm').serializeArray();
    $.ajax({
        url: '/college-settings/saveIvrConfiguration',
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function (xhr) {
            $('#buttonSaveIvrConfig').prop('disabled', true);
        },
        success: function (data) {
            if (typeof data['session'] != 'undefined') {
                window.location.reload(true);
            } else if (typeof data['error'] != 'undefined') {
                alertPopup(data['error'], 'error');
                $('#ErrorPopupArea').css('z-index', 99999);
                $('#buttonSaveIvrConfig').removeAttr("disabled");
            } else {
                alertPopup(data['message'], 'success');
                $('#SuccessPopupArea').css('z-index', 99999);
                $('#' + data['vendorCheck'] + '_enable').show();
                $('#' + data['vendorCheck'] + '_remove').show();
                $('#buttonSaveIvrConfig').removeAttr("disabled");

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.sectionLoader').hide();
        }
    });
}

function saveCampaignConfiguration() {
    var data = $('#c2cCampaignDialer').serializeArray();
    $.ajax({
        url: '/college-settings/saveCampaignConfiguration',
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
         beforeSend: function (xhr) {
            $('#buttonSaveCampaign').prop('disabled', true);
        },
        success: function (data) {
            if (typeof data['session'] != 'undefined') {
                window.location.reload(true);
            } else if (typeof data['error'] != 'undefined') {
                alertPopup(data['error'], 'error');
                $('#ErrorPopupArea').css('z-index', 99999);
                $('#buttonSaveCampaign').removeAttr("disabled");
            } else {
                alertPopup(data['message'], 'success');
                $('#SuccessPopupArea').css('z-index', 99999);
                $('#' + data['vendorCheck'] + '_enable').show();
                $('#' + data['vendorCheck'] + '_remove').show();

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.sectionLoader').hide();
        }
    });
}


function makeC2cCall() {
    var data = $('#makec2ccall').serializeArray();
    $.ajax({
        url: '/college-settings/makeC2cCall',
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (data) {
            if (typeof data['session'] != 'undefined') {
                window.location.reload(true);
            } else if (typeof data['error'] != 'undefined') {
                alertPopup(data['error'], 'error');
                $('#ErrorPopupArea').css('z-index', 99999);
            } else {
                $('#showC2cMessage').show();
                $('#showC2cMessage').html(data.message)

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.sectionLoader').hide();
        }
    });
}

function telephonyVendorDetails(collegeId, vendor, section) {
    $.ajax({
        url: '/college-settings/telephonyVendorDetails',
        type: 'post',
        data: {collegeId: collegeId, vendor: vendor, section: section},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {

        },
        complete: function () {
            $('#CollegeConfigurationSection .loader-block').hide();
        },
        success: function (html) {
            if (html == 'session')
            {
                location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
            } else if (html == 'required')
            {
                alertPopup('College and Vendor both are required.', 'error');
            } else if (html == 'error')
            {
                html = '<div class="configNotAvaiable"><i class="lineicon-73 fa-3x mb-5"></i>'+html+'.</div>';
                 $('#' + section).html(html);
            } else
            {
                $('#' + section).html(html);
                chosenInit();
                if(section == 'UserConfig'){
                    LoadMoreUserList('reset');
                }
            }
            $('[data-toggle="tooltip"]').tooltip();

        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function ivrUserConfigurationDetails(userId, collegeId) {
    $.ajax({
        url: '/college-settings/ivrUserConfigurationDetails',
        type: 'post',
        data: {collegeId: collegeId, userId: userId},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {

        },
        complete: function () {
            //$('#CollegeConfigurationSection .loader-block').hide();
        },
        success: function (html) {

            if (html == 'session')
            {
                location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
            } else if (html == 'required')
            {
                alertPopup('College and Vendor both are required.', 'error');
            } else if (html == 'error')
            {
                alertPopup(error);
            } else
            {
                $('#showuserconfiguration').html(html);
                chosenInit();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
function showHideResponseMatchingDiv() {
             value = $('#ivrResponseMatchingType').val();
             if (value == 'string') {
               $("#ivrClicktocallResponseMatching").show();
               $(".ivrResponseParamDiv").hide();
               $(".ivrResponseParamkey").val('');
               $(".ivrResponseParamValue").val('');
              
             } else {
                $("#ivrClicktocallResponseMatching").hide();
                $("#ivrResponseMatching").val('');
               $("#ivrResponseParamDiv").show();
             }
           }
           
function saveUserAction(field, element, userId, collegeId, vendor){
    var result = {};
    var inputValues = '';
     $.each($(element).closest('tr').find('input[type="text"]'), function(i, item) {
         
         if($(this).val() != 'undefined' && $(this).val() != ''){
            result[$(this).attr('name')] = $(this).val();
        }   
       
     });
     //console.log(result);
     //inputValues = JSON.stringify(result);
     //console.log(inputValues);
    $.ajax({
        url: '/college-settings/saveUserConfiguration',
        type: 'post',
        data: {collegeId: collegeId, userId: userId, inputValues: result, vendor: vendor},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {

        },
        complete: function () {
            //$('#CollegeConfigurationSection .loader-block').hide();
        },
        success: function (data) {
            if (typeof data['session'] != 'undefined') {
                window.location.reload(true);
            } else if (typeof data['error'] != 'undefined') {
                alertPopup(data['error'], 'error');
            } else
            {
                alertPopup(data['message'], 'success');
                $('#SuccessPopupArea').css('z-index', 99999);
                $(element).closest('tr').find('input[type="text"]').prop('readonly',true); 
                $('#saveContent_' + userId).hide();
                $('#editContent_' + userId).show();
                $('#removeContent_' + userId).show();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function removeUserDetails(field, element, userId, collegeId, vendor){
    $('#ConfirmMsgBody').html('Do you want to remove the user configuration?');
    $('#confirmYes').unbind('click');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false}).off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
    e.preventDefault();
    $('#ConfirmPopupArea').modal('hide');
    $.ajax({
        url: '/college-settings/removeUserConfiguration',
        type: 'post',
        data: {collegeId: collegeId, userId: userId, vendor: vendor},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {

        },
        complete: function () {
            //$('#CollegeConfigurationSection .loader-block').hide();
        },
        success: function (data) {
            if (typeof data['session'] != 'undefined') {
                window.location.reload(true);
            } else if (typeof data['error'] != 'undefined') {
                alertPopup(data['error'], 'error');
            } else
            {
                alertPopup(data['message'], 'success');
                $('#SuccessPopupArea').css('z-index', 99999);
                $(element).closest('tr').find('input[type="text"]').prop('readonly',true); 
                $('#saveContent_' + userId).hide();
                $('#editContent_' + userId).show();
                $('#removeContent_' + userId).hide();
                LoadMoreUserList('');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    });
}

function manageUserAction(element, userId){
    $(element).closest('tr').find('input[type="text"]').prop('readonly',false);
    $('#saveContent_' + userId).show();
    $('#editContent_' + userId).hide();
}

function prevUserData(event){
    if($('#counsellorPageJump').val().match(/^\d+$/) == null || parseInt($('#counsellorPageJump').val()) < 2) {
        event.preventDefault();
        return false;
    } else if(parseInt($('#counsellorPageJump').val()) < 2 || parseInt($('#counsellorPageJump').val()) > parseInt($('#maxPage').html())) {
        alertPopup('Invalid Page Number', 'error');
        return false;
    }
    var updatePageValue = parseInt($('#counsellorPageJump').val()) - 1;
    if(updatePageValue < 2) {
        $(this).addClass('disabled');
        $('.next').removeClass('disabled');
    }
    $('#counsellorPageJump').val(updatePageValue);
    LoadMoreUserList('');
    return false;
}

function changeRows(){
    $('#counsellorPageJump').val('1');
    LoadMoreUserList('');
}

//$(document).on('click', '#nextButton', function(event) {
function nextUserData(event){
    if($('#counsellorPageJump').val().match(/^\d+$/) == null || parseInt($('#counsellorPageJump').val()) >= parseInt($('#maxPage').html())) {
        return false;
    } else if(parseInt($('#counsellorPageJump').val()) < 1) {
        alertPopup('Invalid Page Number', 'error');
        return false;
    }
    var updatePageValue = parseInt($('#counsellorPageJump').val()) + 1;
    if(updatePageValue >= $('#maxPage').html()) {
        $(this).addClass('disabled');
        $('.prev').removeClass('disabled');
    }
    $('#counsellorPageJump').val(updatePageValue);
    LoadMoreUserList('');
    return false;
}
//LoadMoreUserList('');
function LoadMoreUserList(type) {
    var data = $('#userConfigListing').serializeArray();
    
    var pageNo = $('#counsellorPageJump').val(), rows = $('#rows').val(), searchBackendUser = $('#searchBackendUser').val();
    if (type == 'reset') {
        pageNo = 1;
        $('#counsellorPageJump').val(1);
        $('#load_more_results').html("");
//        $('#load_more_button').hide();
    }
    var collegeID = $('#collegeID').val();
    var backendUserEnabled = $('#backendUserEnabled').val();
    var vendor = $('#vendor').val();
    $.ajax({
        url: '/college-settings/loadMoreCounsellorsList',
        type: 'post',
        dataType: 'html',
        data: {
            data: data,
            page: pageNo,
            rows: rows,
            collegeId:collegeID,
            backendUserEnabled:backendUserEnabled,
            vendor:vendor,
            searchBackendUser:searchBackendUser
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
		beforeSend: function () {
            $('#listloader').show();
        },
        complete: function () {
             $('#listloader').hide();
        },
        success: function (data) {
            if (data == "error") {
                $('#counsellors_details').html("<tr><td colspan='8' class='fw-500 relative text-danger text-center'>No More Records</td></tr>");
                $('#loadPaginationUsers').hide();
            } else {
                $('#counsellors_details').html(data);
                $('#backendUserEnabled').val(backendUserEnable);
                $('#searchBackendUser').val(searchBackendUser);
                $('#loadPaginationUsers').show();
                if(hidePagination != 'undefined' && hidePagination != 0){
                    $('#loadPaginationUsers').hide();
                }   
                if(pageNo == 1 &&  typeof maxPage != 'undefined') {
                    $('#maxPage').html(maxPage);
                    if(maxPage == 1) {
                        $('.prev, .next').removeClass('disabled').addClass('disabled');
                    } else {
                        $('.next, .prev').removeClass('disabled');
                        $('.prev').addClass('disabled');
                    }
                } else if(typeof maxPage != 'undefined' && pageNo == maxPage) {
                    $('.prev, .next').removeClass('disabled');
                    $('.next').addClass('disabled');
                } else {
                    $('.prev, .next').removeClass('disabled');
                }
                dropdownMenuPlacement();
                $('body').css('overflow','');
                if($('#select_all').is(':checked')==true){
                    selectAllAvailableRecords(rows);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$('#counsellorPageJump').bind('keypress', function(e) {
    if ((e.which >= 48 && e.which <= 57) ||
        e.which === 8 || //Backspace key
        e.which === 13   //Enter key
        ) {
    } else {
      e.preventDefault();
    }
});
$('#counsellorPageJump').on("paste",function(e) {
    e.preventDefault();
});

$(document).on('change', '#counsellorPageJump', function() {
    if($('#counsellorPageJump').val() == '' || $('#counsellorPageJump').val().match(/^\d+$/) == null) {
        alertPopup('Invalid Page Number', 'error');
        return false;
    } else if(parseInt($('#counsellorPageJump').val()) < 1 || parseInt($('#counsellorPageJump').val()) > parseInt($('#maxPage').html())) {
        alertPopup('Invalid Page Number', 'error');
        return false;
    }
    LoadMoreUserList('');
});

function changeLeadParam(element){
  var selected = $(element).val();
  if(selected) {
    var otherSelected = $('#ivrLeadParamDiv').find('option[value="' + selected + '"]:selected');
    var showkey = '';
    if(otherSelected.length > 1) {
      if(selected == 'applicantNo'){
          showkey = 'Applicant Mobile No';
      }else{
          showkey = 'Lead ID';
      }
      alertPopup(showkey + ' is already selected', 'error');
      $(element).val('');    
      $(element).trigger("chosen:updated")
    }
  }

}

function chosenInit() {
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    $('.chosen-select').trigger('chosen:updated');
}
chosenInit();