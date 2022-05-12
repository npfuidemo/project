$(document).ready(function () {
    $('[data-toggle="popover"]').popover();
    $('.loader-block').hide();
    $('.loader-block').removeClass("loaderOveride");
    
    if( $("#communication_country").length && $("#communication_country").val()!='' ){
        if( $("#ck_college_id").length && $("#ck_college_id").val()!='' ){
            var state = $('#communication_country').data('state');
            getComunicationStateList(state,$("#ck_college_id").val());
        }
    }
});

function haveLPUKit(value){
            
    saveLPUApplicationFields({"form_id" : jsVars.form_id,"application_data":{"lpunest_kit_coupon":value}});
}

function selectLPUKit(value){
    $("#hardcopy_lpukit_error").html("");
    if(value=="" || value==null || value=="undefined"){
        $("#hardcopy_lpukit_error").html("Please select a value.");
        return;
    }
    saveLPUApplicationFields({"form_id" : jsVars.form_id,"application_data":{"hardcopy_lpukit":value}});
}

function saveLPUApplicationFields(jsonData){
    $('.loader-block').show();
    $('span.requiredError').text('');
    var data = $('#save_data').serializeArray();
    $.ajax({
        url: college_slug+'/payment/saveCheckoutPageApplicationFields',
        type: 'post',
        dataType: 'html',
        data: jsonData,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (response) {
            location.reload();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            location.reload();
        }
    });
}

function initiateFeePayment(){
    if($('#apply_installment_online').length>0 || $('#apply_installment_cash').length>0 || $('#apply_installment_dd').length>0) {
        if( $('[name="payment_mode"]:checked').length && $('[name="payment_mode"]:checked').val().toLowerCase()==="cash" && $("#pay_partial_amount_cash").val() === ''){
            $("#pay_partial_amount_cash_err_msg").css('color', 'red');
            return false;
        } else if( $('[name="payment_mode"]:checked').length && $('[name="payment_mode"]:checked').val().toLowerCase()==="dd" && $("#pay_partial_amount_dd").val() === ''){
            $("#pay_partial_amount_dd_err_msg").css('color', 'red');
            return false;
        } else if( $('[name="payment_mode"]:checked').length && $('[name="payment_mode"]:checked').val().toLowerCase()==="online" && $("#pay_partial_amount_online").val() === ''){
            $("#pay_partial_amount_online_err_msg").css('color', 'red');
            return false;
        }
    }
    $('#error_div').hide();
    var error   = false;
    if( $("#lpunest_kit_coupon_yes").length && $("#hardcopy_lpukit").length && $("#lpunest_kit_coupon_no").is(":checked") ){
        if($("#hardcopy_lpukit").val()=="" || $("#hardcopy_lpukit").val()==null || typeof $("#hardcopy_lpukit").val()=="undefined"){
            $("#hardcopy_lpukit_error").html("Please select a value.");
            error   = true;
        }
    }
    
    if( $("#communication_country").length && $("#communication_country").val()=="" ){
        $("#communication_country_error").html("Please select country.");
        $("#communication_country_error").show();
        error   = true;
    }else{
        $("#communication_country_error").html("");
        $("#communication_country_error").hide();
    }
    if( $("#communication_state").length && $("#communication_state").val()=="" ){
        $("#communication_state_error").html("Please select state.");
        $("#communication_state_error").show();
        error   = true;
    }else{
        $("#communication_state_error").html("");
        $("#communication_state_error").hide();
    }
    if( $("#communication_address").length && $("#communication_address").val()=="" ){
        $("#communication_address_error").html("Please enter address.");
        $("#communication_address_error").show();
        error   = true;
    }else{
        $("#communication_address_error").html("");
        $("#communication_address_error").hide();
    }
    $("#pay_partial_amount_online_err_msg").css('color', 'black');
    $("#pay_partial_amount_dd_err_msg").css('color', 'black');
    $("#pay_partial_amount_cash_err_msg").css('color', 'black');
    if( $('[name="payment_mode"]:checked').length && $('[name="payment_mode"]:checked').val().toLowerCase()=="cash"){
        if( $("#pay_partial_amount_cash").length && 
                ( isNaN(parseFloat($("#pay_partial_amount_cash").val())) || parseFloat($("#base_fee_amt_value").val()) > parseFloat($("#pay_partial_amount_cash").val())) ){

            $("#pay_partial_amount_cash_err_msg").css('color', 'red');
            error   = true;
        }else if( $("#pay_partial_amount_cash").length && 
                ( isNaN(parseFloat($("#pay_partial_amount_cash").val())) || parseFloat($("#pay_partial_amount_cash").val()) > parseFloat($("#remaining_pay_amount").val())) ){

           $("#pay_more_than_total_amount_error").remove();
           $("#pay_partial_amount_cash_err_msg").before("<span style='color:red' id='pay_more_than_total_amount_error'> You can not make payment more than Remaining Amount</span>");
            error   = true;
        }
    }else if( $('[name="payment_mode"]:checked').length && $('[name="payment_mode"]:checked').val().toLowerCase()=="dd"){
        if( $("#pay_partial_amount_dd").length && 
                ( isNaN(parseFloat($("#pay_partial_amount_dd").val())) || parseFloat($("#pay_amount").val()) > parseFloat($("#pay_partial_amount_dd").val())) ){

            $("#pay_partial_amount_dd_err_msg").css('color', 'red');
            error   = true;
        }else if( $("#pay_partial_amount_dd").length && 
                ( isNaN(parseFloat($("#pay_partial_amount_dd").val())) || parseFloat($("#pay_partial_amount_dd").val()) > parseFloat($("#remaining_pay_amount").val())) ){

            $("#pay_more_than_total_amount_error").remove();
            $("#pay_partial_amount_dd_err_msg").before("<span style='color:red' id='pay_more_than_total_amount_error'> You can not make payment more than Remaining Amount</span>");
            error   = true;
        }
    }else{
        if( $("#pay_partial_amount_online").length && 
                ( isNaN(parseFloat($("#pay_partial_amount_online").val())) || parseFloat($("#base_fee_amt_value").val()) > parseFloat($("#pay_partial_amount_online").val())) ){

            $("#pay_partial_amount_online_err_msg").css('color', 'red');
            error   = true;
        }else if( $("#pay_partial_amount_online").length && 
                ( isNaN(parseFloat($("#pay_partial_amount_online").val())) || parseFloat($("#pay_partial_amount_online").val()) > parseFloat($("#remaining_pay_amount").val())) ){
            $("#pay_more_than_total_amount_error").remove();
            $("#pay_partial_amount_online_err_msg").before("<span style='color:red' id='pay_more_than_total_amount_error'> You can not make payment more than Remaining Amount</span>");
            error   = true;
        }
    }
    //DD Data Validation
    if( $('[name="payment_mode"]:checked').length && $('[name="payment_mode"]:checked').val().toLowerCase()=="dd") {
        if( $("#dd_bank_name").length && $("#dd_bank_name").val()=="" ){
            $("#dd_bank_name_error").html("Field is mandatory.");
            $("#dd_bank_name_error").show();
            error   = true;
        }else{
            $("#dd_bank_name_error").html("");
            $("#dd_bank_name_error").hide;
        }
        if( $("#dd_bank_branch").length && $("#dd_bank_branch").val()=="" ){
            $("#dd_bank_branch_error").html("Field is mandatory.");
            $("#dd_bank_branch_error").show();
            error   = true;
        }else{
            $("#dd_bank_branch_error").html("");
            $("#dd_bank_branch_error").show();
        }
        if( $("#dd_number").length && $("#dd_number").val()=="" ){
            $("#dd_number_error").html("Field is mandatory.");
            $("#dd_number_error").show();
            error   = true;
        }else{
            $("#dd_number_error").html("");
            $("#dd_number_error").show();
        }
        if( $("#dd_date").length && $("#dd_date").val()=="" ){
            $("#dd_date_error").html("Field is mandatory.");
            $("#dd_date_error").show();
            error   = true;
        }else{
            $("#dd_date_error").html("");
            $("#dd_date_error").show();
        }
    }
    if(error){
        return false;
    }

    $('#make_payment').attr("disabled","disabled");
    $('.loader-block').show();
    $('span.requiredError').text('');
    var data = $('#save_data').serializeArray();
    $.ajax({
        url: college_slug+'/payment/initiatePayment',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "filled_data": data,
            "form_id" : jsVars.form_id,
            "fee_config_id" : jsVars.fee_config_id,
            "type" : "payment",
            "resubmission_logic_id" : jsVars.resubmission_logic_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('.loader-block').hide();
            if(data == 'referesh_popup'){
                window.location.href= college_slug+'/dashboard/';
                return false;
            }else if(data=="online"){
                window.location.href= college_slug+'/payment/process-payment/'+jsVars.urlParams;
                return false;
            }
            else{
                var split_content=data.split("||");

                $('#make_payment').removeAttr("disabled","disabled");
                if (split_content[0] == "online") {
                    window.location.href= split_content[1];
                    return false;
                } else if ((split_content[0]=="cash") || (split_content[0]=="dd")) {
                    window.location.href= college_slug+'/payment/payment-success/'+split_content[1];
                    return false;
                }
                else if(split_content[0]=="online_redirect"){
                    window.location.href= college_slug+'/payment/payment-success/'+split_content[1];
                    return false;
                }
                else if(split_content[0]=="errorCash"){
                    $('.loader-block').hide();
                    $('#success_div').hide();
                    $('#showOnlyToAgentsCashValueError').text(split_content[1]);
                    $('#showOnlyToAgentsCashValueError').css('margin-top','15px').show();
                    return false;
                } else if(split_content[0]=="errorReceitp"){
                    $('.loader-block').hide();
                    $('#success_div').hide();
                    $('#showOnlyToAgentsRecieptValueError').text(split_content[1]);
                    $('#showOnlyToAgentsRecieptValueError').css('margin-top','15px').show();
                    return false;
                }else if(split_content[0]=="error") {
                    $('.loader-block').hide();
                    $('#success_div').hide();
                    $('#error_div').css('margin-top','15px').show();
                    $('#error_div').html(split_content[1]);
                    return false;
                }
            }
            //console.log(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


    

 function ShowHidePaymentOption(show){
        $('#error_div').hide();
        $('.pay_div').hide();
        $('#'+show).show();
        // merge fee breakup with coupon detail 
        if(show != 'Online'){
            $('.fee_breakup_div_parent').hide();
            $('#fee_breakup, #payment_info_div').hide();
            $('#success_div').hide();
        }else if($("#payment_info_div").text() != ""){
            $('.fee_breakup_div_parent').show();
            $("#fee_breakup").show();
            $("#payment_info_div").show();
        }
        if($('#apply_installment_online').length>0 && $("#pay_partial_amount_"+show.toLowerCase()).val() !== '') {
            calcInstallmentPayAMount();
        } else if($('#apply_installment_dd').length>0 && $("#pay_partial_amount_"+show.toLowerCase()).val() !== '') {
            calcInstallmentPayAMount();
        } else if($('#apply_installment_cash').length>0 && $("#pay_partial_amount_"+show.toLowerCase()).val() !== '') {
            calcInstallmentPayAMount();
        }
        if($('#apply_installment_online').length>0 && $("#pay_partial_amount_online").val() === '') {
            calcInstallmentPayAMountForBase();
        } else if($('#apply_installment_dd').length>0 && $("#pay_partial_amount_dd").val() === '') {
            calcInstallmentPayAMountForBase();
        } else if($('#apply_installment_cash').length>0 && $("#pay_partial_amount_cash").val() === '') {
            calcInstallmentPayAMountForBase();
        }
    }
    
function calcFeePayAmount(elem){
    //ShowHidePaymentOption('Online');
    jsCalcConveyanceFeeCharge();
    return ;
}

function jsCalcConveyanceFeeCharge(){

    $('#payment_info_div').html('');
    $('.loader-block').show();
    var payType  = $('[name="payment_mode"]:checked').val();
    if(payType == 'Credit Card' || payType == 'Debit Card' || payType == 'Net Banking' || payType == 'Unified Payments'){
	$('#Online').show();
	$('#payment_info_div').show();
    }

    var pay_amount = $('#original_pay_amount').val();
    data=new Array(); 
    data.push({name:"form_id",value:jsVars.form_id});
    data.push({name:"college_id",value:jsVars.college_id});
    data.push({name:"fee_config_id",value:jsVars.fee_config_id});
    data.push({name:"pay_amount",value:pay_amount});

    if(typeof $('[name="payment_mode"]').val() !='undefined' && $('[name="payment_mode"]').val()!=''){
        var check_payment_mode = $('[name="payment_mode"]:checked').val();
        data.push({name:"check_payment_mode",value:check_payment_mode});
    }
    $.ajax({
        url: college_slug+'/payment/calc-conveyance-charge',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if(data == 'session_out'){
                window.location.href= college_slug+'/dashboard/';
                return false;
            }else{
                var split_content=data.split("||");
                if(split_content[0]=="error"){
                    $('.loader-block').hide();
                    $('#error_div').show();
                    $('#error_div').html(split_content[1]);
                    return false;
                }
                else  if(split_content[0]=="success"){
                    $('.loader-block').hide();
                    return_val=JSON.parse(split_content[1]);  
                    $('#fee_breakup').show();
                    $('.fee_breakup_div_parent').show();
                    $('#payment_info_div').html(return_val["paymentInfo"]);
                    if($('#pay_amount_online').length>0){
                        var extra_charge = 0;
                        if(typeof return_val["extra_charge"]!='undefined' && return_val["extra_charge"]!=''){
                            extra_charge = return_val["extra_charge"];
                        }
                        $('#pay_amount_online').val(parseFloat(return_val["new_payment_amount"])+parseFloat(extra_charge));
                    }
                    
                    if($('.FeeSyntax').length>0){
                        $('.application_fee_span').hide();
                    }
                    return false;
                }
            }
            //console.log(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return;
}

    
    var jsonData    = {};    
    
    function getCcavenueHybridCards(url,access_code,amount,currency){
        $.ajax({
             url        : url + '&access_code='+access_code+'&currency='+currency+'&amount='+amount,
             dataType   : 'jsonp',
             jsonp      : false,
             jsonpCallback: 'processData',
             success: function (data) { 
                jsonData = data;
                if($("input[name='payment_mode']:checked").length){
                    $("input[name='payment_mode']:checked").trigger('click');
                }
             },
             error: function(xhr, textStatus, errorThrown) {
                 console.log('An error occurred! ' + ( errorThrown ? errorThrown :xhr.status ));
             }
        });
        
    }
        
    function selectHybridPGPayMode(){
        var paymentOption   = "";
        var cardArray       = "";
        paymentOption = $(this).data('cardtype');
        $("#card_type").val(paymentOption.replace("OPT",""));
        $("#card_name").children().remove(); // remove old card names from old one
        $("#card_name").append("<option value=''>Select Card Name</option>");

        $.each(jsonData, function(index,value) {
            if(value.payOpt==paymentOption){
                cardArray = $.parseJSON(value[paymentOption]);
                $.each(cardArray, function() {
                $("#card_name").find("option:last").after("<option class='"+this['dataAcceptedAt']+" "+this['status']+"'  value='"+this['cardName']+"'>"+this['cardName']+"</option>");
                });
            }
        });

        $('#card_name').trigger('chosen:updated');
    }
	  
    $("#card_name").change(function(){
        if($(this).find(":selected").hasClass("DOWN")){
            alert("Selected option is currently unavailable. Select another payment option or try again later.");
        }
        if($(this).find(":selected").hasClass("CCAvenue")){
            $("#data_accept").val("Y");
        }else{
            $("#data_accept").val("N");
        }
    });


function calcCartPayAmount(){
//    ShowHidePaymentOption('Online');
    if($('#coupon_code').length>0 && $('#coupon_code').val()!=''){
        //SaveCoupon();
        applyDiscountCoupon();
    }
    else{
        getPGCharges();
    }
    return ;
}

function calcInstallmentPayAMount() {
    var error = false;
    var paymentTextBoxId = '';
    var paymentMethod = '';
    $("#pay_partial_amount_online_err_msg").css('color', 'black');
    $("#pay_partial_amount_dd_err_msg").css('color', 'black');
    $("#pay_partial_amount_cash_err_msg").css('color', 'black');
    $("#pay_more_than_total_amount_error").remove();
    var finalInstallment = parseInt($("#finalInstallment").val());
    if( $('[name="payment_mode"]:checked').length && $('[name="payment_mode"]:checked').val().toLowerCase()=="cash"){
        if( finalInstallment === 1 && $("#pay_partial_amount_cash").length && 
                ( isNaN(parseFloat($("#pay_partial_amount_cash").val())) || parseFloat($("#pay_partial_amount_cash").val()) != parseFloat($("#remaining_pay_amount").val())) ){

           $("#pay_more_than_total_amount_error").remove();
           $("#pay_partial_amount_cash_err_msg").before("<span style='color:red' id='pay_more_than_total_amount_error'> Payment amount must be equal to Remaining Amount</span>");
            error   = true;
        } else if( $("#pay_partial_amount_cash").length && 
                ( isNaN(parseFloat($("#pay_partial_amount_cash").val())) || parseFloat($("#base_fee_amt_value").val()) > parseFloat($("#pay_partial_amount_cash").val())) ){

            $("#pay_partial_amount_cash_err_msg").css('color', 'red');
            error   = true;
        }else if( $("#pay_partial_amount_cash").length && 
                ( isNaN(parseFloat($("#pay_partial_amount_cash").val())) || parseFloat($("#pay_partial_amount_cash").val()) > parseFloat($("#remaining_pay_amount").val())) ){

           $("#pay_more_than_total_amount_error").remove();
           $("#pay_partial_amount_cash_err_msg").before("<span style='color:red' id='pay_more_than_total_amount_error'> You can not make payment more than Remaining Amount</span>");
            error   = true;
        }
        paymentTextBoxId = 'pay_partial_amount_cash';
        paymentMethod = 'cash';
    }else if( $('[name="payment_mode"]:checked').length && $('[name="payment_mode"]:checked').val().toLowerCase()=="dd"){
        if( finalInstallment === 1 && $("#pay_partial_amount_dd").length && 
                ( isNaN(parseFloat($("#pay_partial_amount_dd").val())) || parseFloat($("#pay_partial_amount_dd").val()) != parseFloat($("#remaining_pay_amount").val())) ){

            $("#pay_more_than_total_amount_error").remove();
            $("#pay_partial_amount_dd_err_msg").before("<span style='color:red' id='pay_more_than_total_amount_error'> Payment amount must be equal to Remaining Amount</span>");
            error   = true;
        } else if( $("#pay_partial_amount_dd").length && 
                ( isNaN(parseFloat($("#pay_partial_amount_dd").val())) || parseFloat($("#pay_amount").val()) > parseFloat($("#pay_partial_amount_dd").val())) ){

            $("#pay_partial_amount_dd_err_msg").css('color', 'red');
            error   = true;
        }else if( $("#pay_partial_amount_dd").length && 
                ( isNaN(parseFloat($("#pay_partial_amount_dd").val())) || parseFloat($("#pay_partial_amount_dd").val()) > parseFloat($("#remaining_pay_amount").val())) ){

            $("#pay_more_than_total_amount_error").remove();
            $("#pay_partial_amount_dd_err_msg").before("<span style='color:red' id='pay_more_than_total_amount_error'> You can not make payment more than Remaining Amount</span>");
            error   = true;
        }
        paymentTextBoxId = 'pay_partial_amount_dd';
        paymentMethod = 'dd';
    }else{
        if(finalInstallment === 1 && $("#pay_partial_amount_online").length && 
                ( isNaN(parseFloat($("#pay_partial_amount_online").val())) || parseFloat($("#pay_partial_amount_online").val()) != parseFloat($("#remaining_pay_amount").val())) ){
            $("#pay_more_than_total_amount_error").remove();
            $("#pay_partial_amount_online_err_msg").before("<span style='color:red' id='pay_more_than_total_amount_error'> Payment amount must be equal to Remaining Amount</span>");
            error   = true;
        } else if( $("#pay_partial_amount_online").length && 
                ( isNaN(parseFloat($("#pay_partial_amount_online").val())) || parseFloat($("#base_fee_amt_value").val()) > parseFloat($("#pay_partial_amount_online").val())) ){

            $("#pay_partial_amount_online_err_msg").css('color', 'red');
            error   = true;
        }else if( $("#pay_partial_amount_online").length && 
                ( isNaN(parseFloat($("#pay_partial_amount_online").val())) || parseFloat($("#pay_partial_amount_online").val()) > parseFloat($("#remaining_pay_amount").val())) ){
            $("#pay_more_than_total_amount_error").remove();
            $("#pay_partial_amount_online_err_msg").before("<span style='color:red' id='pay_more_than_total_amount_error'> You can not make payment more than Remaining Amount</span>");
            error   = true;
        }
        paymentTextBoxId = 'pay_partial_amount_online';
        paymentMethod = 'online';
    }
    if(error === true) {
        return false;
    } else if($('#'+paymentTextBoxId).length>0 && $('#'+paymentTextBoxId).val()!=''){
        $("#applyInstallmentAmt_"+paymentMethod).val(1);
        if (typeof jsVars.installmentAmountHash !== 'undefined' && jsVars.installmentAmountHash !=='') {
            applyInstallmentPayAmount(paymentTextBoxId);
        }
        if(changePaymentBtnText === 0){
            $("#breakUpPrd_"+paymentMethod).hide();
        } else {
            $("#breakUpPrd_"+paymentMethod).show();
        }
        return true;
    }
}

$(document).on('click', "#make_payment", function(){
    var validAmount = true;
    var payment_mode = $('[name="payment_mode"]:checked').val();
    if($('#apply_installment_online').length>0) {
        validAmount = calcInstallmentPayAMount();
    } else if($('#apply_installment_dd').length>0) {
        validAmount = calcInstallmentPayAMount();
    } else if($('#apply_installment_cash').length>0) {
        validAmount = calcInstallmentPayAMount();
    }
    if(changePaymentBtnText===0 && ($('#apply_installment_online').length>0 || $('#apply_installment_dd').length>0 || $('#apply_installment_cash').length>0)) {
        $("#breakUpPrd_"+payment_mode.toLowerCase()).hide();
    }
    if(validAmount === true) {
        if($("#make_payment").html() == 'Make Payment' || $("#make_payment").text() == 'Submit & Make Payment') {
            initiateFeePayment();
        } else {
            $("#make_payment").html('Make Payment');
        }
    }
});

function calcInstallmentPayAMountForBase() {
    if (typeof jsVars.installmentAmountHash !== 'undefined' && jsVars.installmentAmountHash !=='') {
        applyInstallmentPayAmount('base_fee_amt_value');
    }
}

$(document).on('change', '#pay_partial_amount_online', function(){
   $("#applyInstallmentAmt_online").val(0);
});
$(document).on('change', '#pay_partial_amount_cash', function(){
   $("#applyInstallmentAmt_cash").val(0);
});
$(document).on('change', '#pay_partial_amount_dd', function(){
   $("#applyInstallmentAmt_dd").val(0);
});

$(document).on('focus', '#pay_partial_amount_online', function(){
   if(changePaymentBtnText === 1) {
       $("#make_payment").html('Continue');
       $("#taxInfo_online").show();
   }
});
$(document).on('focus', '#pay_partial_amount_cash', function(){
   if(changePaymentBtnText === 1) {
       $("#make_payment").html('Continue');
       $("#taxInfo_cash").show();
   }
});
$(document).on('focus', '#pay_partial_amount_dd', function(){
   if(changePaymentBtnText === 1) {
       $("#make_payment").html('Continue');
       $("#taxInfo_dd").show();
   }
});

function getPGCharges(){

    $('#payment_info_div').html('');
    $('.loader-block').show();

    var pay_amount = $('#original_pay_amount').val();
    data=new Array(); 
    data.push({name:"form_id",value:jsVars.form_id});
    data.push({name:"college_id",value:jsVars.college_id});
    data.push({name:"fee_config_id",value:jsVars.fee_config_id});
    data.push({name:"pay_amount",value:pay_amount});

    if(typeof $('[name="payment_mode"]').val() !='undefined' && $('[name="payment_mode"]').val()!=''){
        var check_payment_mode = $('[name="payment_mode"]:checked').val();
        data.push({name:"check_payment_mode",value:check_payment_mode});
    }
    $.ajax({
        url: college_slug+'/payment/calcPaymentHandlingCharge',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {"X-CSRF-TOKEN": jsVars.csrfToken},
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if($('#pay_amount_online').length>0){
                        var extra_charge = 0;
                        if(typeof responseObject.data.pgCharges != 'undefined' && responseObject.data.pgCharges != ''){
                            extra_charge = responseObject.data.pgCharges;
                        }
                        $('#pay_amount_online').val(parseFloat(parseFloat(pay_amount)+parseFloat(extra_charge)).toFixed(2));
                        $("#pay_amount_online_span").html($('#pay_amount_online').val());
                        
                        if($('#pgChargesSpan').length>0){
                            $("#pgChargesSpan").html(extra_charge);
                            $('#Online').show();
                            $('#Cash').hide();
                            if(parseFloat($('#pgChargesSpan').html()) > 0){
                                $("#onlinePgChargesDiv").show();
                            }else{
                                $("#onlinePgChargesDiv").hide();
                            }
                        }
                    }
                }
            } else {
                if(responseObject.message=="session_out"){
                    window.location.href= college_slug+'/dashboard/';
                }else{
                    console.log(responseObject.message);
                }
            }
            $('.loader-block').hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return;
}

function addFeeWithApplicationFee(element) {
    var baseAmount      = $(element).data("baseamount");
    var baseAmountOther = $(element).data("baseamount");
    
    var pgcharges       = $(element).data("pgcharges");
    
    var onlinetaxes     = $(element).data("onlinetaxes");
    var onlinetotal     = $(element).data("onlinetotal");
    
    var onlineconveyancecharges = $(element).data("onlineconveyancecharges");
    var otherconveyancecharges  = $(element).data("otherconveyancecharges");
    
    var othertaxes      = $(element).data("othertaxes");
    var othertotal      = $(element).data("othertotal");
    if($(element).is(":checked")){
        $("#onlineTotalItemsSpan").html( parseInt($('#onlineTotalItemsSpan').html()) + 1 );
        $("#ddTotalItemsSpan").html( parseInt($('#ddTotalItemsSpan').html()) + 1 );
        $('#onlineSubtotalSpan').html( parseFloat(parseFloat($('#onlineSubtotalSpan').html())+parseFloat(baseAmount)).toFixed(2));
        $('#onlineConveyanceChargesSpan').html( parseFloat(parseFloat($('#onlineConveyanceChargesSpan').html())+parseFloat(onlineconveyancecharges)).toFixed(2));
        $('#pgChargesSpan').html( parseFloat(parseFloat($('#pgChargesSpan').html())+parseFloat(pgcharges)).toFixed(2));
        $('#onlineTaxesSpan').html( parseFloat(parseFloat($('#onlineTaxesSpan').html())+parseFloat(onlinetaxes)).toFixed(2));
        $('#pay_amount_online').val( parseFloat(parseFloat($('#pay_amount_online').val())+parseFloat(onlinetotal)).toFixed(2));
        $('#original_pay_amount').val( parseFloat(parseFloat($('#original_pay_amount').val())+parseFloat(onlinetotal)).toFixed(2));
        $("#pay_amount_online_span").html($('#pay_amount_online').val());

        $('#ddSubtotalSpan').html( parseFloat(parseFloat($('#ddSubtotalSpan').html())+parseFloat(baseAmountOther)).toFixed(2));
        $('#ddTaxesSpan').html( parseFloat(parseFloat($('#ddTaxesSpan').html())+parseFloat(othertaxes)).toFixed(2));
        $('#pay_amount_dd_span').html( parseFloat(parseFloat($('#pay_amount_dd_span').html())+parseFloat(othertotal)).toFixed(2));
        $('#pay_amount').val( parseFloat(parseFloat($('#pay_amount').val())+parseFloat(othertotal)).toFixed(2));

        $('#amount_pay').val( parseFloat(parseFloat($('#amount_pay').val())+parseFloat(othertotal)).toFixed(2));
        
    }else{
        $("#onlineTotalItemsSpan").html( parseInt($('#onlineTotalItemsSpan').html()) - 1 );
        $("#ddTotalItemsSpan").html( parseInt($('#ddTotalItemsSpan').html()) - 1 );
        $('#onlineSubtotalSpan').html( parseFloat(parseFloat($('#onlineSubtotalSpan').html())-parseFloat(baseAmount)).toFixed(2));
        $('#onlineConveyanceChargesSpan').html( parseFloat(parseFloat($('#onlineConveyanceChargesSpan').html())-parseFloat(onlineconveyancecharges)).toFixed(2));
        $('#pgChargesSpan').html( parseFloat(parseFloat($('#pgChargesSpan').html())-parseFloat(pgcharges)).toFixed(2));
        $('#onlineTaxesSpan').html( parseFloat(parseFloat($('#onlineTaxesSpan').html())-parseFloat(onlinetaxes)).toFixed(2));
        $('#pay_amount_online').val( parseFloat(parseFloat($('#pay_amount_online').val())-parseFloat(onlinetotal)).toFixed(2));
        $('#original_pay_amount').val( parseFloat(parseFloat($('#original_pay_amount').val())-parseFloat(onlinetotal)).toFixed(2));
        $("#pay_amount_online_span").html($('#pay_amount_online').val());

        $('#ddSubtotalSpan').html( parseFloat(parseFloat($('#ddSubtotalSpan').html())-parseFloat(baseAmountOther)).toFixed(2));
        $('#ddConveyanceChargesSpan').html( parseFloat(parseFloat($('#ddConveyanceChargesSpan').html())-parseFloat(otherconveyancecharges)).toFixed(2));
        $('#ddTaxesSpan').html( parseFloat(parseFloat($('#ddTaxesSpan').html())-parseFloat(othertaxes)).toFixed(2));
        $('#pay_amount_dd_span').html( parseFloat(parseFloat($('#pay_amount_dd_span').html())-parseFloat(othertotal)).toFixed(2));
        $('#pay_amount').val( parseFloat(parseFloat($('#pay_amount').val())-parseFloat(othertotal)).toFixed(2));

        $('#amount_pay').val( parseFloat(parseFloat($('#amount_pay').val())-parseFloat(othertotal)).toFixed(2));
    }
    if(parseFloat($('#onlineConveyanceChargesSpan').html()) > 0){
        $("#onlineConveyanceChargesDiv").show();
    }else{
        $("#onlineConveyanceChargesDiv").hide();
    }
    if(parseFloat($('#pgChargesSpan').html()) > 0){
        $("#onlinePgChargesDiv").show();
    }else{
        $("#onlinePgChargesDiv").hide();
    }
    if(parseFloat($('#onlineTaxesSpan').html()) > 0){
        $("#onlineTaxesDiv").show();
    }else{
        $("#onlineTaxesDiv").hide();
    }
    if(parseFloat($('#ddTaxesSpan').html()) > 0){
        $("#ddTaxesDiv").show();
    }else{
        $("#ddTaxesDiv").hide();
    }
    if(parseFloat($('#ddConveyanceChargesSpan').html()) > 0){
        $("#ddConveyanceChargesDiv").show();
    }else{
        $("#ddConveyanceChargesDiv").hide();
    }
    
    if($(".hybridPGOption").length > 0){
        calcCartPayAmount();
    }
}

function getComunicationStateList(selectedState = '', college_id=0) {
    if ($("#communication_country").val() === '' ) {
        $('#communication_state').html('<option selected="selected" value="">Select State</option>');
        $('#communication_state').trigger('chosen:updated');
        return;
    }
    
    if(college_id == null || typeof college_id == 'undefined'){
        college_id = 0;
    }

    $.ajax({
        url: college_slug+'/common/getChildListByTaxonomyId',
        type: 'post',
        dataType: 'html',
        data: {
            "parentId": $("#communication_country").val(),
            "college_id":college_id
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data.childList === "object") {
                        var value = '<option value="">Select State</option>';
                        $.each(responseObject.data.childList, function (index, item) {
                            if(item.toLowerCase() === selectedState.toLowerCase()){
                                value += '<option selected = "selected" value="' + index + '">' + item + '</option>';
                            }else{
                                value += '<option value="' + index + '">' + item + '</option>';
                            }
                        });
                        $('#communication_state').html(value);
                    }
                }
                $('#communication_state').trigger('chosen:updated');
            } else {
                console.log(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
