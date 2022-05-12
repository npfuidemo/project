$(document).ready(function () {
    $('[data-toggle="popover"]').popover();
    $('.loader-block').hide();
    $('.loader-block').removeClass("loaderOveride");
});



function initiateFeePayment(){
      $('#error_div').hide();

      $('#make_payment').attr("disabled","disabled");
      $('.loader-block').show();

        var data = $('#save_data').serializeArray();
        $.ajax({
        url: college_slug+'/payment/fee-payment',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "filled_data": data,
            "form_id" : jsVars.form_id,
            "fee_type" : jsVars.payment_process_type,
            "type" : "payment"
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('.loader-block').hide();
            if(data == 'referesh_popup'){
                window.location.href= college_slug+'/dashboard/';
                return false;
            }else if(data=="online"){
                window.location.href= college_slug+'/payment/process-fee-payment/'+jsVars.urlParams;
                return false;
            }
            else{
                var split_content=data.split("||");
                //alert(split_content);

                 //$('#make_payment').html("Continue");
                 $('#make_payment').removeAttr("disabled","disabled");

                if(split_content[0]=="cash"){
                    //alert("Form Saved");
                    window.location.href= college_slug+'/payment/fee-payment-success/'+split_content[1];
                    return false;
                }
                else if(split_content[0]=="online_redirect"){
                    //alert("Form Saved");
                    window.location.href= college_slug+'/payment/fee-payment-success/'+split_content[1];
                    return false;
                }
                else if(split_content[0]=="error"){
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
    data.push({name:"payment_process_type",value:jsVars.payment_process_type});
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
