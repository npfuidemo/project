/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/************Save and view payment configurations********/
//checking configuration of the payment
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
        url: '/colleges/get-payment-config',
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
    
    /*****Saving Twocheckout Payment Gateways*******/
    function saveTwocheckoutConfig() {
        var data = $("#paymentConfigTwocheckout").serializeArray();
        submitpaymentForm(data, 'twocheckout'); //call saving function
    }
    /*****End*****/

/******Function for save data of payment form********/
    function submitpaymentForm(data,type){
         var college_id = $("#institute").val();
         $(".requiredError").hide();
         data.push({name:'college_id',value:college_id});
         $.ajax({
            url: '/colleges/save-payment-config',
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
                    //console.log(key);
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


function showSubscription(type){
    if (type == 'reset') {
        NPFAlertPage = 0;
        $('#load_more_results').html("");
        $('#load_more_results_msg').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
    }
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    var data = $('#FilterSubscriptionForm').serializeArray();
    data.push({name: "page", value: NPFAlertPage});
    $.ajax({
        url: '/systems/getSubscriptions',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function () {
            $('#listloader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            NPFAlertPage = NPFAlertPage + 1;
            
            data = data.replace("<head/>", '');
            $('#load_more_results').append(data);
            $('#load_more_button').removeAttr("disabled");
            $('#load_more_button').html("Load More Record");
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function () {
            $('#listloader').hide();
        }
    });
}

if (('#subscriptionPop').length > 0) {
    $(document).on('click', '#subscriptionPop', function (e) {
        e.preventDefault();
        $("#ConfirmPopupArea p#ConfirmMsgBody").text('Are you sure you want to show the Subscription Expiration Alert to all the Institute user in their NPF Panel?');
        //$('#ChangeStatusSuccessArea p#ConfirmDisableEnableFormPopUpTextArea').text('Communication Template has been copied.');
        $("#ConfirmPopupArea a#confirmYes").attr("onclick", "submitSubscriptionForms();");
        $("#ConfirmPopupArea button").attr('onclick', "refreshApplicablefor()");
    });
}
function refreshApplicablefor() {
    window.location.href = '/systems/subscription';
}
function submitSubscriptionForms() {
    $("#FilterSubscriptionForm").submit();
}