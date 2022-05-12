/* 
 * To handle Master payment Gateway System Configuration functions.
 */

//DOM ready actions
function initMasterPaymentGateway() {
    if ($('input[name="masterRazorpay[integrationMode]"]').length > 0) {
        var integrationMode = $('input[name="masterRazorpay[integrationMode]"]:checked').val();
        setupIntegrationModeConfig(integrationMode);
    }
}

//On change of integration mode
$(document).on('change', 'input[name="masterRazorpay[integrationMode]"]', function () {
    setupIntegrationModeConfig(this.value);
});

//On change of Partner Split Transfer Checkbox
$(document).on('change', 'input#masterRazorpayPartnerSplitTransfer', function () {
    showHideSplitTransferContainer(this.id, 'partnerSplitTransferContainerDiv');
});

//On change of Route Split Transfer Checkbox
$(document).on('change', 'input#masterRazorpayRouteSplitTransfer', function () {
    showHideSplitTransferContainer(this.id, 'routeSplitTransferContainerDiv');
});

//Show/Hide Split Transfer Container
function showHideSplitTransferContainer(inputId, divId) {
    if ($('input#' + inputId).is(':checked') === true) {
        $('div#' + divId).removeClass('display-none');
    } else {
        $('div#' + divId).addClass('display-none');
    }
}

//Setup Intergaretion Mode Configuration
function setupIntegrationModeConfig(integrationMode) {
    //set default mode
    if ((typeof integrationMode === 'undefined') || (integrationMode.trim() === '')) {
        integrationMode = 'partner';
    }

    var mode = integrationMode.trim();
    switch (mode) {
        case 'partner':
            $('div#routeModeDiv').hide();
            $('div#partnerModeDiv').show();
            showHideSplitTransferContainer('masterRazorpayPartnerSplitTransfer', 'partnerSplitTransferContainerDiv');
            break;
        case 'route':
            $('div#routeModeDiv').show();
            $('div#partnerModeDiv').hide();
            showHideSplitTransferContainer('masterRazorpayRouteSplitTransfer', 'routeSplitTransferContainerDiv');
            break;
        default:
            break;
    }
}

//Add More Partner Merchant ID
function addPartnerMerchantID(divClass) {
    var stgClone = $('div#' + divClass + ' > div.partnerMerchantDetailsDiv').eq(0).clone();
    $(stgClone).find('.removeElementClass').html('<a class="text-danger" href="javascript:void(0);" title="Delete Merchant ID" onclick="return confirmDeleteRazorpayEntity(this, \'partnerMerchantDetailsDiv\',\'Merchant ID\');"><i class="fa fa-minus-circle font20" aria-hidden="true"></i></a>');
    $(stgClone).find('input').val('').removeClass('borderRedNotImportant');
    $('div#' + divClass).append(stgClone);
    floatableLabel();
    return false;
}

//Add More Route Merchant ID
function addRouteMerchantID(divClass) {
    var stgClone = $('div#' + divClass + ' > div.routeMerchantDetailsDiv').eq(0).clone();
    $(stgClone).find('.removeElementClass').html('<a class="text-danger" href="javascript:void(0);" title="Delete Merchant ID" onclick="return confirmDeleteRazorpayEntity(this, \'routeMerchantDetailsDiv\',\'Merchant ID\');"><i class="fa fa-minus-circle font20" aria-hidden="true"></i></a>');
    $(stgClone).find('input').val('').removeClass('borderRedNotImportant');
    $('div#' + divClass).append(stgClone);
    floatableLabel();
    return false;
}

//Add More Route Transfer Account ID
function addRouteTransferAccountID(divClass) {
    var stgClone = $('div#' + divClass + ' > div.routeSplitTransferDiv').eq(0).clone();
    $(stgClone).find('.removeElementClass').html('<a class="text-danger" href="javascript:void(0);" title="Delete Split Transfer ID" onclick="return confirmDeleteRazorpayEntity(this, \'routeSplitTransferDiv\',\'Transfer ID\');"><i class="fa fa-minus-circle font20" aria-hidden="true"></i></a>');
    $(stgClone).find('input').val('').removeClass('borderRedNotImportant');
    $('div#' + divClass).append(stgClone);
    floatableLabel();
    return false;
}

//Add More Route Transfer Account ID
function addPartnerTransferAccountID(divClass) {
    var stgClone = $('div#' + divClass + ' > div.partnerSplitTransferDiv').eq(0).clone();
    $(stgClone).find('.removeElementClass').html('<a class="text-danger" href="javascript:void(0);" title="Delete Split Transfer ID" onclick="return confirmDeleteRazorpayEntity(this, \'partnerSplitTransferDiv\',\'Transfer ID\');"><i class="fa fa-minus-circle font20" aria-hidden="true"></i></a>');
    $(stgClone).find('input').val('').removeClass('borderRedNotImportant');
    $('div#' + divClass).append(stgClone);
    floatableLabel();
    return false;
}

function confirmDeleteRazorpayEntity(elem, divClass, type) {
    $('#ConfirmMsgBody').html('Do you want to delete ' + type + '?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $(elem).parents('div.' + divClass).remove();
        $('#ConfirmPopupArea').modal('hide');
    });
    return false;
}

function saveMasterPaymentGatewayConfiguration(formId, masterGateway) {
    if ($("form#" + formId).length < 0) {
        alertPopup('Please select an intitute.', 'error');
        return;
    }
    var data = $("form#" + formId).serializeArray();
    var college_id = $("#institute").val();
    $(".requiredError").hide();
    data.push({name: 'college_id', value: college_id});
    //remove error
    hideMasterGatewayError(masterGateway);
    $.ajax({
        url: '/college-payment-configurations/save-master-gateway-configuration',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if (json['redirect']) {
                window.location = json['redirect'];
            } else if (json['code'] == 200) {
                alertPopup(json['message'], 'Success');
            } else if (json['errorMsg']) {
                alertPopup(json['errorMsg'], 'error');
            } else {
                //show error as per master gateway
                showMasterGatewayError(masterGateway, json);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

//hide all error as per master gateway
function hideMasterGatewayError(masterGateway) {
    
    switch(masterGateway) {
        case 'masterRazorpay':
            //partner mode
            $('#partnerModeDiv div#partnerMerchantDetailsParentDiv div.partnerMerchantDetailsDiv').each(function() {
                $(this).find('input.form-control').removeClass('borderRedNotImportant');
            });
            $('#partnerModeDiv div#partnerSplitTransferParentDiv div.partnerSplitTransferDiv').each(function() {
                $(this).find('input.form-control').removeClass('borderRedNotImportant');
            });
            
            //route mode
            $('#routeModeDiv div#routeMerchantDetailsParentDiv div.routeMerchantDetailsDiv').each(function() {
                $(this).find('input.form-control').removeClass('borderRedNotImportant');
            });
            $('#routeModeDiv div#routeSplitTransferParentDiv div.routeSplitTransferDiv').each(function() {
                $(this).find('input.form-control').removeClass('borderRedNotImportant');
            });
            break;
    }
    
}

//show error as per master gateway
function showMasterGatewayError(masterGateway, json) {
    
    switch(masterGateway) {
        case 'masterRazorpay':
            if (typeof json.error.partner != 'undefined') {
                //show error for merchant details
                if (typeof json.error.partner.merchantDetails != 'undefined') {
                    for (var index in json.error.partner.merchantDetails) {
                        var parentMerchant = $('#partnerModeDiv div#partnerMerchantDetailsParentDiv div.partnerMerchantDetailsDiv').eq(index);
                        parentMerchant.find('input.form-control').addClass('borderRedNotImportant');
                    }
                }
                
                //show error for split transfer details
                if (typeof json.error.partner.splitTransferDetails != 'undefined') {
                    for (var index in json.error.partner.splitTransferDetails) {
                        var parentSplitTransfer = $('#partnerModeDiv div#partnerSplitTransferParentDiv div.partnerSplitTransferDiv').eq(index);
                        parentSplitTransfer.find('input.form-control').addClass('borderRedNotImportant');
                    }
                }
            } else if (typeof json.error.route != 'undefined') {
                //show error for merchant details
                if (typeof json.error.route.merchantDetails != 'undefined') {
                    for (var index in json.error.route.merchantDetails) {
                        var parentMerchant = $('#routeModeDiv div#routeMerchantDetailsParentDiv div.routeMerchantDetailsDiv').eq(index);
                        parentMerchant.find('input.form-control').addClass('borderRedNotImportant');
                    }
                }
                
                //show error for split transfer details
                if (typeof json.error.route.splitTransferDetails != 'undefined') {
                    for (var index in json.error.route.splitTransferDetails) {
                        var parentSplitTransfer = $('#routeModeDiv div#routeSplitTransferParentDiv div.routeSplitTransferDiv').eq(index);
                        parentSplitTransfer.find('input.form-control').addClass('borderRedNotImportant');
                    }
                }
            }
            
            break;
    }
    
}