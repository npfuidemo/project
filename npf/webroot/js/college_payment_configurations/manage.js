//Code for College Payment Configuration starts
$(document).ready(function () {
    if ($('#paymentFlow').length > 0) {
        $("#paymentFlow").change(function () {
            var selectedFlow = $(this).val();

            if (selectedFlow != '' && selectedFlow >= 0) {
                $('#flowDependentFields').show();
            } else {
                $('#flowDependentFields').hide();
            }
        });


        $('.gatewayOptions').click(function () {
            var type = $(this).val();
            gatewayConfigTrigger(type);
        });

        var gatewayConfigToTrigger = jsVars.gatewayChecked;

        if (gatewayConfigToTrigger) {
            $.each(gatewayConfigToTrigger, function (index, value) {
                gatewayConfigTrigger(value);
            });
        }
    }
});

function gatewayConfigTrigger(type) {
    if ($("#" + type).prop('checked') == true) {
        $('#' + type + 'ConfigContainer').show();
    } else {
        $('#' + type + 'ConfigContainer').hide();
    }
}

//Manage Institute: Change Institute Status as delete

$(document).on('click', '#collegePaymentConfigDelete', function (e) {
    e.preventDefault();
    var MainParentDiv = $(this).parents("div.application-form-block");
    var configData = $(MainParentDiv).prop('id');
    if (configData != '')
    {
        var InstituteName = $(MainParentDiv).find("h3").text();
//        var InstituteStatus = $(MainParentDiv).find("span#InstituteStatusSpan").text();
//        var PopUpStatus = (InstituteStatus == 'Active') ? 'disable' : 'activate';
//        var PopUpStatusSuccess = (InstituteStatus == 'Active') ? 'disabled' : 'activated';
        $("#ConfirmPopupArea p#ConfirmMsgBody").text('Are you sure? You want to delete Institute \'' + InstituteName + '\' Payment Configuration.');
        $('#ChangeStatusSuccessArea p#ConfirmDisableEnableFormPopUpTextArea').text('Institute \'' + InstituteName + '\' has been deleted.');
        $("#ConfirmPopupArea a#confirmYes").attr("onclick", 'collegePaymentConfigDelete("' + configData + '"\);');
    } else
    {
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
});


function collegePaymentConfigDelete(configData) {
    $('body div.loader-block').show();
    $("#ConfirmPopupArea").modal('hide');
    $.ajax({
        url: jsVars.FULL_URL + '/college-payment-configurations/delete',
        data: {config_data: configData},
        dataType: "json",
        async: false,
        cache: false,
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        //contentType: "application/json; charset=utf-8",
        success: function (json) {
            $('body div.loader-block').hide();
            if (json['status'] == 1) {
                $('#SuccessPopupArea p#MsgBody').html('Payment Config has been deleted.')
                $('#SuccessPopupArea a#OkBtn').show();
                $('#SuccessPopupArea a#OkBtn').attr('href', '/college-payment-configurations/manage');
                $("#SuccessPopupArea").modal();
            } else {
                alert('We got some error, please try again later.')
            }

        },
        error: function (response) {
            alertPopup(response.responseText);
        },
        failure: function (response) {
            alertPopup(response.responseText);
        }
    });

    return false;
}

$(document).ready(function(){
    var college_id = $("#institute").val();
    if(typeof college_id!='undefined' && college_id!=''){
        getgetways(college_id); //calling function
    }
    
    
    if($("#FilterSubscriptionForm").length>0){
        $('#FilterSubscriptionForm #college_id').SumoSelect({placeholder: 'Select Institute', search: true, searchText:'Search Institute', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });  
        var NPFAlertPage = 0;
        showSubscription('reset');
    }
});
$("#institute").on('change',function(){
    var cid = $(this).val();
    getgetways(cid);
});
/****get payment gateways****/
function getgetways(cid){
    $.ajax({
        url: '/college-payment-configurations/get-config',
        type: 'post',
        dataType: 'html',
        data: {
            "college_id": cid,
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $("#append_result").html('');
            $("#append_result").append(data);
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('[data-toggle="popover"]').popover();
            floatableLabel();
            //js/master_payment_gateway_system/payment_configuration.js
            initMasterPaymentGateway();
            initVersionSpecificFields()
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
    /******End*******/
    
    /****Saving Paytm Config ****/
    function savePaytm(){
        var data = $("#paymentConfigPayTm").serializeArray();
        submitpaymentForm(data,'paytm'); //call saving function
    }
    /****End*****/
    
    /*****Saving ccAvenue Payment Gateways*******/
    function saveccAvenue(){
        var data = $("#paymentConfigCCAvenue").serializeArray();
        submitpaymentForm(data,'ccavenue'); //call saving function
    }
    
    /*****Saving ccAvenueHybrid Payment Gateways*******/
    function saveccAvenueHybrid(){
        var data = $("#paymentConfigCCAvenueHybrid").serializeArray();
        submitpaymentForm(data,'ccavenueHybrid'); //call saving function
    }
    /*****End*****/
    
    /*****Saving PayU Payment Gateways*******/
    function savePayU(){
        var data = $("#paymentConfigPayU").serializeArray();
        submitpaymentForm(data,'payu'); //call saving function
    }
    /*****End*****/
    
    /*****Saving ZaakPay Payment Gateways*******/
    function saveZaakpay(){
        var data = $("#paymentConfigZaakpay").serializeArray();
        submitpaymentForm(data,'zaakpay'); //call saving function
    }
    /*****End*****/
    
    /*****Saving Easebuzz Payment Gateways*******/
    function saveEasebuzz(){
        var data = $("#paymentConfigEasebuzz").serializeArray();
        submitpaymentForm(data,'easebuzz'); //call saving function
    }
    /*****End*****/
    
    /*****Saving PayUBiz Payment Gateways*******/
    function savePayUbiz(){
        var data = $("#paymentConfigPayUbiz").serializeArray();
        submitpaymentForm(data,'payubiz'); //call saving function
    }
    /*****End*****/
    
   /* $("#paymentConfigSubmitButtonCCVenue").on('click', function(){
        var data = $("#paymentConfigCCAvenue").serializeArray();
        submitpaymentForm(data,'ccavenue');
    });
     $("#paymentConfigSubmitButtonPaytm").on('click', function(){
        var data = $("#paymentConfigPayTm").serializeArray();
        submitpaymentForm(data,'paytm');
    });*/

    /*****Saving AxisBank Payment Gateways*******/
    function saveAxisBank(){
        var data = $("#paymentConfigAxisBank").serializeArray();
        submitpaymentForm(data,'axisbank'); //call saving function
    }
    /*****End*****/
    
    /*****Saving Paynimo Payment Gateways*******/
    function savePayNimo(){
        var data = $("#paymentConfigPayNimo").serializeArray();
        submitpaymentForm(data,'paynimo'); //call saving function
    }
    /*****End*****/
    
    /*****Saving ISG Pay Payment Gateways*******/
    function saveIsgPay(){
        var data = $("#paymentConfigIsgPay").serializeArray();
        submitpaymentForm(data,'isgpay'); //call saving function
    }
    /*****End*****/
    
    /*****Saving Billdesk Payment Gateways*******/
    function saveBilldeskConfig(){
        var data = $("#paymentConfigBilldesk").serializeArray();
        submitpaymentForm(data, 'billdesk'); //call saving function
    }
    /*****End*****/
    
    /*****Saving Jiomoney Payment Gateways*******/
    function saveJiomoneyConfig(){
        var data = $("#paymentConfigJiomoney").serializeArray();
        submitpaymentForm(data, 'jiomoney'); //call saving function
    }
    /*****End*****/
    
    /*****Saving EazyPay Payment Gateways*******/
    function saveEazyPayConfig(){
        var data = $("#paymentConfigEazyPay").serializeArray();
        submitpaymentForm(data, 'eazypay'); //call saving function
    }
    /*****End*****/
    
    /*****Saving Ipgfirstdata Payment Gateways*******/
    function saveIpgFirstDataConfig(){
        var data = $("#paymentConfigIpgfirstdata").serializeArray();
        submitpaymentForm(data, 'ipgfirstdata'); //call saving function
    }
    /*****End*****/
    
    /*****Saving Razorpay Payment Gateways*******/
    function saveRazorpayConfig(){
        var data = $("#paymentConfigRazorpay").serializeArray();
        submitpaymentForm(data, 'razorpay'); //call saving function
    }
       
    /*****Saving Razorpay Payment Gateways*******/
    function saveAirpayConfig(){
        var data = $("#paymentConfigAirpay").serializeArray();
        submitpaymentForm(data, 'airpay'); //call saving function
    }
    /*****Saving QFix Payment Gateways*******/
    function saveQFixConfig(){
        var data = $("#paymentConfigQFix").serializeArray();
        submitpaymentForm(data, 'qfix'); //call saving function
    }
    /*****Saving JusPay Payment Gateways*******/
    function saveJusPayConfig(){
        var data = $("#paymentConfigJuspay").serializeArray();
        submitpaymentForm(data, 'juspay'); //call saving function
    }
    /*****Saving IobPay Payment Gateways*******/
    function saveIobPayConfig() {
        var data = $("#paymentConfigIobpay").serializeArray();
        submitpaymentForm(data, 'iobpay'); //call saving function
    }
    /*****End*****/
    /*****Saving Two Checkout Payment Gateways*******/
    function saveTwocheckoutConfig() {
        var data = $("#paymentConfigTwocheckout").serializeArray();
        submitpaymentForm(data, 'twocheckout'); //call saving function
    }
    /*****End*****/
    /*****Saving Ebpg Payment Gateways*******/
    function saveEbpg() {
        var data = $("#paymentConfigEbpg").serializeArray();
        submitpaymentForm(data, 'ebpg'); //call saving function
    }
    /*****End*****/
    /*****Saving Paytwocorp Payment Gateways*******/
    function savePaytwocorpConfig() {
        var data = $("#paymentConfigPaytwocorp").serializeArray();
        submitpaymentForm(data, 'paytwocorp'); //call saving function
    }
    /*****End*****/

/******Function for save data of payment form********/
    function submitpaymentForm(data,type){
         var college_id = $("#institute").val();
         $(".requiredError").hide();
         data.push({name:'college_id',value:college_id});
         $.ajax({
            url: '/college-payment-configurations/save',
            type: 'post',
            dataType: 'json',
            data: data,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
            if(typeof data.redirect !='undefined' && data.redirect!=''){
                window.location = data.redirect;
            }else if(data.success=='200'){
                //alert('Data saved successfuly');
                $(".requiredError").hide();
                alertPopup(data['Msg'],'Success');
            }else{
               
                for(var key in data.error){
                    $('#'+type+'_'+key+'_validation').show();
                    $('#'+type+'_'+key+'_validation').html(data.error[key])
                }
                
            }
              
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
    
/******payment configuration js end***************************************************/


function alertPopup(msg, type, location) {

    if (type == 'error') {
        var selector_parent = '#ErrorPopupArea';
        var selector_titleID = '#ErroralertTitle';
        var selector_msg = '#ErrorMsgBody';
        var btn = '#ErrorOkBtn';
        var title_msg = 'Error';
    } else {
        var selector_parent = '#SuccessPopupArea';
        var selector_titleID = '#alertTitle';
        var selector_msg = '#MsgBody';
        var btn = '#OkBtn';
        var title_msg = 'Success';
    }

    $(selector_titleID).html(title_msg);
    $(selector_msg).html(msg);
    $('.oktick').hide();

    if (typeof location != 'undefined') {
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
/*
 * set jiomoney version specific fields 
 */
let savedJioVersion = '',jioClientId = '',jioMerchant_id='';
function initVersionSpecificFields(){
    savedJioVersion = $('#jiomoney_version').val()
    jioClientId = $('#jiomoney_client_id').val()
    jioMerchant_id = $('#jiomoney_merchant_id').val()
    if($('#jiomoney_version').val() == 2){
        $('.jiomoneyV2').show();
        $('.jiomoneyV1').hide();
    }
}

function showHideJiomoneySection(version){
    if(version == 2){
        $('.jiomoneyV2').show();
        $('.jiomoneyV1').hide();
        if(savedJioVersion  == version){
            $('#jiomoney_client_id').val(jioClientId)
            $('#jiomoney_merchant_id').val(jioMerchant_id)
        }else{
            $('#jiomoney_client_id').val('')
            $('#jiomoney_merchant_id').val('')
        }
    }else{
        $('.jiomoneyV2').hide();
        $('.jiomoneyV1').show();
        if(savedJioVersion  == version){
            $('#jiomoney_client_id').val(jioClientId)
            $('#jiomoney_merchant_id').val(jioMerchant_id)
        }else{
            $('#jiomoney_client_id').val('')
            $('#jiomoney_merchant_id').val('')
        }
    }
}
