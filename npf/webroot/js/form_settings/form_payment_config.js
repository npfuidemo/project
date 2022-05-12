$(document).ready(function(){
    $("#college_id").change(function(){
        loadCollegeForms(this.value,'');
    });
    
    if( $("#college_id").val()!='' && $("#college_id").val()!=null && $("#college_id").val() > 0){
        loadCollegeForms( $("#college_id").val(), $("#college_id").data('formid') );
    };
    
    $("#college_id, #form_id").change(function(){
        $('#load_config_div').fadeOut();
        $('#load_config_div').html("");
    });
    
    if($('select#payment_currency').length > 0) {
        $('select#payment_currency').SumoSelect({placeholder: 'Select Currency Type', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
    }
    
    $(document).on( "change","#enable_conditional_fees",function(){
        showHideConditionalFee();
        resetGSTBreakup();
    });
    
    $(document).on( "change","#payment_receipt_template",function(){
        if($("#payment_receipt_template").val() == 'noreceipt') {
            $("#receipt_message_box_div").show();
        } else {
            $("#receipt_message_box_div").hide();
        }
    });
    
    $(document).on( "change","#business_origin_country",getStateList);
});

function showHideConditionalFee(){
    if($("#enable_conditional_fees").is(":checked")){
        $("#save_payment_config").html('&nbsp; Save And Next');
        $("#payment_setting_table_div").hide();
    }else{
        $("#save_payment_config").html('<span class="glyphicon glyphicon-saved" aria-hidden="true"></span> &nbsp; Save Payment Settings');
        $("#payment_setting_table_div").show();
    }
}

function getStateList() {
    if ($("#business_origin_country").val() === '' ) {
        $('#business_origin_state').html('<option selected="selected" value="">Select State</option>');
        $('#business_origin_state').trigger('chosen:updated');
        return;
    }
    
    var college_id_md = 0;
    if( $("[name='h_college_id']").length > 0 && typeof $("[name='h_college_id']").val() != "undefined" ){
        college_id_md = $("[name='h_college_id']").val();
    }

    $.ajax({
        url: '/common/getChildListByTaxonomyId',
        type: 'post',
        dataType: 'html',
        data: {
            "parentId": $("#business_origin_country").val(),
            "college_id":college_id_md
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data.childList === "object") {
                        var value = '<option selected="selected" value="">Select State</option>';
                        $.each(responseObject.data.childList, function (index, item) {
                            value += '<option value="' + index + '">' + item + '</option>';
                        });
                        $('#business_origin_state').html(value);
                    }
                }
                $('#business_origin_state').trigger('chosen:updated');
            } else {
                console.log(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function loadCollegeForms(value, default_val) {
    $.ajax({
        url: '/voucher/get-forms',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "college_id": value,
            "default_val": default_val,
            "multiselect": false
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        async:true,
		beforeSend: function () {
            $('#listloader').show();
        },
        success: function (data) {
			 $('#listloader').hide();
            if(data=="session_logout"){
                window.location.reload(true);
            }
            $('#div_load_forms').html(data);
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.chosen-select').trigger('chosen:updated');
            if(typeof default_val!='undefined' && parseInt(default_val)>0){
                loadPaymentFormConfig();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function bindAfterAjaxCall(){
    $("#payment_setting_table input, #payment_setting_table select").change(function(){
        changeSelectValue();
        calculateAmount();
    });
    
    $(".payment_checkbox").change(function(){
        showHidePaymentInformation("reset");
    });
    $("#payment_process_type").change(function(){
        showHidePaymentStage();
    });
    $("#payment_gateway_type").change(function(){
        showHidePaymentGateway();
    });
    
     $("#save_payment_config").click(function(){
        savePaymentConfig();
    });
    
    $("#save_payment_configView").click(function(){
        savePaymentConfig();
    });
   
    $("#payment_setting_table input").change(function(){
        if(this.value!=""){
            if($.isNumeric(this.value)){
              // do nothing
            }else{
                $(this).val("0");
                calculateAmount();
            }
            //alert(c.value);
        }
    });

    showHidePaymentInformation();
    showHidePaymentStage();
    showHidePaymentGateway();
    //calculateAmount();
}

function showHidePaymentStage(){
    
    $('.div_not_free').fadeIn("slow");
    //$('.div_free').fadeOut();
    
    if($('#payment_process_type').val()=="midpayment"){
        $('#payment_after_stage_block').fadeIn();
    }
    else if($('#payment_process_type').val()=="free"){
        $("#enable_conditional_fees").prop("checked",false);
        $("#enable_new_checkout_page").prop("checked",false);
        $(".payment_checkbox").each(function(){
            $(this).prop("checked",false);
        });
        $("#save_payment_config").html('<span class="glyphicon glyphicon-saved" aria-hidden="true"></span> &nbsp; Save Payment Settings');
        $('.div_not_free').fadeOut();
        //$('.div_free').fadeIn();
        $('.div_not_free input[type=text], .div_not_free select, .div_not_free textarea').val("");
        // make first value selected
        $('#payment_setting_table select').each(function () {
            $(this).val($(this).find(':first-child').val());
        });
    }else{
        $('#payment_after_stage_block').fadeOut();
        $('#payment_after_stage').val("");
    }
    showHideConditionalFee();
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
    $('.chosen-select').trigger('chosen:updated');
   
}

function showHidePaymentGateway(){
    if ($('#payment_gateway_type').val() == "ccAvenue") {
        $('#hybrid_payment_gateway_div').fadeIn();
        $('#twocheckout_payment_gateway_div').fadeOut();
        $('#twocheckout_product_list').val("");
        $('#razorpay_payment_gateway_div').fadeOut();
        $('#razorpayPaymentLink').removeAttr('checked');
        $('#master_razorpay_payment_gateway_div').fadeOut();
        $('#master_razorpay_split_transfer').val("");
    } else if ($('#payment_gateway_type').val() == "Twocheckout") {
        $('#twocheckout_payment_gateway_div').fadeIn();
        $('#hybrid_payment_gateway_div').fadeOut();
        $('#hybrid_payment_gateway').val("0");
        $('#razorpay_payment_gateway_div').fadeOut();
        $('#razorpayPaymentLink').removeAttr('checked');
        $('#master_razorpay_payment_gateway_div').fadeOut();
        $('#master_razorpay_split_transfer').val("");
    } else if ($('#payment_gateway_type').val() == "Razorpay") {
        $('#twocheckout_payment_gateway_div').fadeOut();
        $('#hybrid_payment_gateway_div').fadeOut();
        $('#hybrid_payment_gateway').val("0");
        $('#razorpay_payment_gateway_div').fadeIn();
        $('#master_razorpay_payment_gateway_div').fadeOut();
        $('#master_razorpay_split_transfer').val("");
    } else if ($('#payment_gateway_type').val() == 'Masterrazorpay') {
        $('#master_razorpay_payment_gateway_div').fadeIn();
        $('#twocheckout_payment_gateway_div').fadeOut();
        $('#hybrid_payment_gateway_div').fadeOut();
        $('#hybrid_payment_gateway').val("0");
        $('#razorpay_payment_gateway_div').fadeOut();
    } else {
        $('#hybrid_payment_gateway_div').fadeOut();
        $('#hybrid_payment_gateway').val("0");
        $('#twocheckout_payment_gateway_div').fadeOut();
        $('#twocheckout_product_list').val("");
        $('#razorpay_payment_gateway_div').fadeOut();
        $('#razorpayPaymentLink').removeAttr('checked');
        $('#master_razorpay_payment_gateway_div').fadeOut();
        $('#master_razorpay_split_transfer').val("");
    }
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    $('.chosen-select').trigger('chosen:updated');
}

function showHidePaymentInformation(type){
    
    var other_method=false;
    var online_method=false;
    
    $('.payment_checkbox').each(function () {
        var sThisVal = (this.checked ? "1" : "0");
        if(sThisVal=="1"){
            $('#'+this.id+'_related_div').fadeIn();
            if(this.value=="Online"){
                $('#tb_payment_gateway_charge').fadeIn();
                if(type=="reset"){
                    $('#tb_payment_gateway_charge select').each(function () {
                        $(this).val($(this).find(':first-child').val());
                    });
                }
                online_method=true;
            }else{
                other_method=true;
            }
            
        }else{
            $('#'+this.id+'_related_div').fadeOut();
            $('#'+this.id+'_related_div input, #'+this.id+'_related_div textarea').val("");
            
            if(this.value=="Online"){
                $('#tb_payment_gateway_charge').fadeOut();
                $('#tb_payment_gateway_charge input, #tb_payment_gateway_charge select').val("");
                
            }
        }
    });
    
    if(online_method==true){
         $('.online_amount').fadeIn();
    }else{
        $('.online_amount').fadeOut();
    }
    
    if(other_method==true){
         $('.other_amount').fadeIn();
    }else{
        $('.other_amount').fadeOut();
    }

    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
    $('.chosen-select').trigger('chosen:updated');
}

var paidBy="paid_by";
var amount_type="amt_type";
var amountValue="amt_value";
var amountShow="amt_show";
var net_amount=0;
var other_amount=0;
var online_amount=0;

// if base fee amount type if final_amount then npf_surcharge and payment_gateway surcharge is paid by institute. 
function changeSelectValue(){
    if($('#base_fee_'+amount_type).val()=="final_amount"){
        $('#npf_surcharge_paid_by, #payment_gateway_paid_by').val("institute");
        
    }
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
    $('.chosen-select').trigger('chosen:updated');
}

function resetGSTBreakup(){
    if( $("#base_fee_gst_breakup").length && $("#base_fee_gst_breakup").is(":checked") ){
        $(".baseFeeGSTBreakupRow").show();
    }else{
        $(".baseFeeGSTBreakupRow").hide();
    }
    
    if( $("#npf_surcharge_gst_breakup").length && $("#npf_surcharge_gst_breakup").is(":checked") ){
        $(".npfSurchargeGSTBreakupRow").show();
    }else{
        $(".npfSurchargeGSTBreakupRow").hide();
    }
    
    if( $("#payment_gateway_gst_breakup").length && $("#payment_gateway_gst_breakup").is(":checked") ){
        $(".pgChargesGSTBreakupRow").show();
    }else{
        $(".pgChargesGSTBreakupRow").hide();
    }
    
    if( ($("#base_fee_gst_breakup").length && $("#base_fee_gst_breakup").is(":checked")) || 
            ($("#npf_surcharge_gst_breakup").length && $("#npf_surcharge_gst_breakup").is(":checked")) || 
            ( $("#payment_gateway_gst_breakup").length && $("#payment_gateway_gst_breakup").is(":checked")) || 
            $("#enable_conditional_fees").is(":checked") 
        ){
        
        $("#business_origin_country_div").show();
        $("#business_origin_state_div").show();
    }else{
        $("#business_origin_country_div").hide();
        $("#business_origin_state_div").hide();
        $("#business_origin_country").val("");
        $("#business_origin_state").val("");
    }
    
    $('#base_fee_igst_'+amountValue).val('');
    $('#base_fee_cgst_'+amountValue).val('');
    $('#base_fee_sgst_'+amountValue).val('');

    $('#base_fee_igst_'+amountShow).val('');
    $('#base_fee_cgst_'+amountShow).val('');
    $('#base_fee_sgst_'+amountShow).val('');

    $('#base_fee_igst_other_'+amountShow).val('');
    $('#base_fee_cgst_other_'+amountShow).val('');
    $('#base_fee_sgst_other_'+amountShow).val('');
    
    $('#npf_surcharge_igst_'+amountValue).val('');
    $('#npf_surcharge_cgst_'+amountValue).val('');
    $('#npf_surcharge_sgst_'+amountValue).val('');

    $('#npf_surcharge_igst_'+amountShow).val('');
    $('#npf_surcharge_cgst_'+amountShow).val('');
    $('#npf_surcharge_sgst_'+amountShow).val('');

    $('#npf_surcharge_igst_other_'+amountShow).val('');
    $('#npf_surcharge_cgst_other_'+amountShow).val('');
    $('#npf_surcharge_sgst_other_'+amountShow).val('');
    
    $('#payment_gateway_igst_'+amountValue).val('');
    $('#payment_gateway_cgst_'+amountValue).val('');
    $('#payment_gateway_sgst_'+amountValue).val('');

    $('#payment_gateway_igst_'+amountShow).val('');
    $('#payment_gateway_cgst_'+amountShow).val('');
    $('#payment_gateway_sgst_'+amountShow).val('');
    
}

// if config is based on base amount then calulate the data
function calculateOnBaseAmount(){
    var base_fee=parseFloat($('#base_fee_'+amountValue).val());

    net_amount=other_amount=online_amount=parseFloat(base_fee.toFixed(2));
    $('#base_fee_'+amountShow).val(net_amount);
    $('#base_fee_other_'+amountShow).val(net_amount);
    
    tax_on_base_fee=0;
    // base fee gst calulcation
    
    resetGSTBreakup();
    if($('#base_fee_gst_'+amountValue).val()!=""){

        var base_fee_gst    = parseFloat($('#base_fee_gst_'+amountValue).val());
        if($('#base_fee_'+amount_type).val()=="final_amount"){
            tax_on_base_fee=base_fee-((base_fee*100)/(100+base_fee_gst));
        }else{
            tax_on_base_fee=(base_fee_gst/100)*base_fee;
        }
        tax_on_base_fee  = parseFloat(tax_on_base_fee.toFixed(2));

        $('#base_fee_gst_'+amountShow).val(tax_on_base_fee);
        $('#base_fee_gst_other_'+amountShow).val(tax_on_base_fee);
        online_amount=other_amount=other_amount+tax_on_base_fee;
        
        if( $("#base_fee_gst_breakup").length && $("#base_fee_gst_breakup").is(":checked") ){
            $('#base_fee_igst_'+amountValue).val(base_fee_gst);
            $('#base_fee_cgst_'+amountValue).val((base_fee_gst/2).toFixed(2));
            $('#base_fee_sgst_'+amountValue).val((base_fee_gst/2).toFixed(2));
            
            $('#base_fee_igst_'+amountShow).val(tax_on_base_fee.toFixed(2));
            $('#base_fee_cgst_'+amountShow).val((tax_on_base_fee/2).toFixed(2));
            $('#base_fee_sgst_'+amountShow).val((tax_on_base_fee/2).toFixed(2));
            
            $('#base_fee_igst_other_'+amountShow).val(tax_on_base_fee.toFixed(2));
            $('#base_fee_cgst_other_'+amountShow).val((tax_on_base_fee/2).toFixed(2));
            $('#base_fee_sgst_other_'+amountShow).val((tax_on_base_fee/2).toFixed(2));
        }
    }
    
    // npf surcharge and npf surcharge gst calculation
    if($('#npf_surcharge_'+amountValue).val()!=""){
        var npf_surcharge=parseFloat($('#npf_surcharge_'+amountValue).val());

        if($('#npf_surcharge_'+amount_type).val()=="fixed"){
            npf_surcharge_amount=npf_surcharge;

        }else{
            npf_surcharge_amount=((npf_surcharge*(base_fee+tax_on_base_fee))/100);
        }
        npf_surcharge_amount_show   = parseFloat(npf_surcharge_amount.toFixed(2));
        $('#npf_surcharge_'+amountShow).val(npf_surcharge_amount_show);
        $('#npf_surcharge_other_'+amountShow).val(npf_surcharge_amount_show);


        npf_surcharge_gst_amount=0;
        if($('#npf_surcharge_gst_'+amountValue).val()!=""){
            var npf_surcharge_gst=parseFloat($('#npf_surcharge_gst_'+amountValue).val());
            npf_surcharge_gst_amount    = parseFloat(((npf_surcharge_gst*npf_surcharge_amount)/100).toFixed(2));
            $('#npf_surcharge_gst_'+amountShow).val(npf_surcharge_gst_amount);
            $('#npf_surcharge_gst_other_'+amountShow).val(npf_surcharge_gst_amount);
        
            if( $("#npf_surcharge_gst_breakup").length && $("#npf_surcharge_gst_breakup").is(":checked") ){
                $('#npf_surcharge_igst_'+amountValue).val(npf_surcharge_gst);
                $('#npf_surcharge_cgst_'+amountValue).val((npf_surcharge_gst/2).toFixed(2));
                $('#npf_surcharge_sgst_'+amountValue).val((npf_surcharge_gst/2).toFixed(2));
                
                $('#npf_surcharge_igst_'+amountShow).val(npf_surcharge_gst_amount);
                $('#npf_surcharge_cgst_'+amountShow).val(parseFloat(npf_surcharge_gst_amount/2).toFixed(2));
                $('#npf_surcharge_sgst_'+amountShow).val(parseFloat(npf_surcharge_gst_amount/2).toFixed(2));
                
                $('#npf_surcharge_igst_other_'+amountShow).val(npf_surcharge_gst_amount);
                $('#npf_surcharge_cgst_other_'+amountShow).val(parseFloat(npf_surcharge_gst_amount/2).toFixed(2));
                $('#npf_surcharge_sgst_other_'+amountShow).val(parseFloat(npf_surcharge_gst_amount/2).toFixed(2));
            }
        }


        if($('#npf_surcharge_'+paidBy).val()=="applicant"){
            online_amount=other_amount=other_amount+npf_surcharge_amount+npf_surcharge_gst_amount;
        }

    }



    if($('#payment_gateway_'+amountValue).val()!=""){
        var payment_gateway=parseFloat($('#payment_gateway_'+amountValue).val());

        if($('#payment_gateway_'+amount_type).val()=="fixed"){
            payment_gateway_amount=payment_gateway;

        }else{
            payment_gateway_amount=((payment_gateway*online_amount)/100);
            //payment_gateway_amount=((payment_gateway*base_fee)/100);
        }

        payment_gateway_amount_show = parseFloat(payment_gateway_amount.toFixed(2));
        $('#payment_gateway_'+amountShow).val(payment_gateway_amount_show);

        payment_gateway_gst_amount=0;
        if($('#payment_gateway_gst_'+amountValue).val()!=""){
            var payment_gateway_gst=parseFloat($('#payment_gateway_gst_'+amountValue).val());
            payment_gateway_gst_amount  = parseFloat(((payment_gateway_gst*payment_gateway_amount)/100).toFixed(2));

            $('#payment_gateway_gst_'+amountShow).val(payment_gateway_gst_amount);
        
            if( $("#payment_gateway_gst_breakup").length && $("#payment_gateway_gst_breakup").is(":checked") ){
                $('#payment_gateway_igst_'+amountValue).val(payment_gateway_gst);
                $('#payment_gateway_cgst_'+amountValue).val((payment_gateway_gst/2).toFixed(2));
                $('#payment_gateway_sgst_'+amountValue).val((payment_gateway_gst/2).toFixed(2));
                
                $('#payment_gateway_igst_'+amountShow).val(payment_gateway_gst_amount);
                $('#payment_gateway_cgst_'+amountShow).val(parseFloat(payment_gateway_gst_amount/2).toFixed(2));
                $('#payment_gateway_sgst_'+amountShow).val(parseFloat(payment_gateway_gst_amount/2).toFixed(2));
            }
        }

        if($('#payment_gateway_'+paidBy).val()=="applicant"){
            online_amount=other_amount+payment_gateway_amount+payment_gateway_gst_amount;
        }
    }

    $('#other_amount_'+amountShow).val(other_amount.toFixed(2));
    $('#online_amount_'+amountShow).val(online_amount.toFixed(2));
    
}


function calculateOnFinalAmount(){

    var base_fee=parseFloat($('#base_fee_'+amountValue).val());

    final_fee=other_amount=online_amount=base_fee;
    $('#base_fee_'+amountShow).val(net_amount.toFixed(2));
    $('#base_fee_other_'+amountShow).val(net_amount.toFixed(2));
    payment_gateway=payment_gateway_gst=0;
    
    resetGSTBreakup();
    
    //calulate npf_surcharge and npf_surcharge_gst
    if($('#npf_surcharge_'+amountValue).val()!=""){
        var npf_surcharge=parseFloat($('#npf_surcharge_'+amountValue).val());

        if($('#npf_surcharge_'+amount_type).val()=="fixed"){
            npf_surcharge_amount=npf_surcharge;
        }else{
            npf_surcharge_amount=((npf_surcharge*base_fee)/100);
        }
        
        $('#npf_surcharge_'+amountShow).val(npf_surcharge_amount.toFixed(2));
        $('#npf_surcharge_other_'+amountShow).val(npf_surcharge_amount.toFixed(2));

        npf_surcharge_gst_amount=0;
        if($('#npf_surcharge_gst_'+amountValue).val()!=""){
            var npf_surcharge_gst=parseFloat($('#npf_surcharge_gst_'+amountValue).val());
            npf_surcharge_gst_amount=((npf_surcharge_gst*npf_surcharge_amount)/100);
            $('#npf_surcharge_gst_'+amountShow).val(npf_surcharge_gst_amount.toFixed(2));
            $('#npf_surcharge_gst_other_'+amountShow).val(npf_surcharge_gst_amount.toFixed(2));
        
            if( $("#npf_surcharge_gst_breakup").length && $("#npf_surcharge_gst_breakup").is(":checked") ){
                $('#npf_surcharge_igst_'+amountValue).val(npf_surcharge_gst);
                $('#npf_surcharge_cgst_'+amountValue).val((npf_surcharge_gst/2).toFixed(2));
                $('#npf_surcharge_sgst_'+amountValue).val((npf_surcharge_gst/2).toFixed(2));
                
                $('#npf_surcharge_igst_'+amountShow).val(npf_surcharge_gst_amount.toFixed(2));
                $('#npf_surcharge_cgst_'+amountShow).val(parseFloat(npf_surcharge_gst_amount/2).toFixed(2));
                $('#npf_surcharge_sgst_'+amountShow).val(parseFloat(npf_surcharge_gst_amount/2).toFixed(2));
                
                $('#npf_surcharge_igst_other_'+amountShow).val(npf_surcharge_gst_amount.toFixed(2));
                $('#npf_surcharge_cgst_other_'+amountShow).val(parseFloat(npf_surcharge_gst_amount/2).toFixed(2));
                $('#npf_surcharge_sgst_other_'+amountShow).val(parseFloat(npf_surcharge_gst_amount/2).toFixed(2));
            }
        }

    }
    
    // 
    if($('#payment_gateway_'+amountValue).val()!=""){
        var payment_gateway=parseFloat($('#payment_gateway_'+amountValue).val());

        if($('#payment_gateway_gst_'+amountValue).val()!=""){
            var payment_gateway_gst=parseFloat($('#payment_gateway_gst_'+amountValue).val());
        }

        // formula is = x + (2%of x) + 18% of (2% of x) = 100;
        if($('#payment_gateway_'+amount_type).val()=="fixed"){
            base_fee_ex_gateway=(final_fee -payment_gateway) - (payment_gateway_gst*payment_gateway)/100;
        }else{
            base_fee_ex_gateway=(final_fee * 100 * 100)/(10000+(payment_gateway*100)+(payment_gateway*payment_gateway_gst));
        }

        if($('#payment_gateway_'+amount_type).val()=="fixed"){
            payment_gateway_amount=payment_gateway;
        }else{
            payment_gateway_amount=((payment_gateway*base_fee_ex_gateway)/100);
        }

        $('#payment_gateway_'+amountShow).val(payment_gateway_amount.toFixed(2));

        payment_gateway_gst_amount=0;
        if($('#payment_gateway_gst_'+amountValue).val()!=""){
            var payment_gateway_gst=parseFloat($('#payment_gateway_gst_'+amountValue).val());
            payment_gateway_gst_amount=((payment_gateway_gst*payment_gateway_amount)/100);
            $('#payment_gateway_gst_'+amountShow).val(payment_gateway_gst_amount.toFixed(2));
        
            if( $("#payment_gateway_gst_breakup").length && $("#payment_gateway_gst_breakup").is(":checked") ){
                $('#payment_gateway_igst_'+amountValue).val(payment_gateway_gst);
                $('#payment_gateway_cgst_'+amountValue).val((payment_gateway_gst/2).toFixed(2));
                $('#payment_gateway_sgst_'+amountValue).val((payment_gateway_gst/2).toFixed(2));
                
                $('#payment_gateway_igst_'+amountShow).val(payment_gateway_gst_amount.toFixed(2));
                $('#payment_gateway_cgst_'+amountShow).val(parseFloat(payment_gateway_gst_amount/2).toFixed(2));
                $('#payment_gateway_sgst_'+amountShow).val(parseFloat(payment_gateway_gst_amount/2).toFixed(2));
            }
        }
    }


    base_fee_gst=npf_surcharge_amount_show=npf_surcharge_gst_amount_show=payment_gateway_amount_show=payment_gateway_gst_amount_show=0;
    
    if($('#base_fee_gst_'+amountValue).val()!=""){
        base_fee_gst=parseFloat($('#base_fee_gst_'+amountValue).val());
    }
    
    if($('#npf_surcharge_'+amountShow).val()!=""){
        npf_surcharge_amount_show=$('#npf_surcharge_'+amountShow).val();
    }
    if($('#npf_surcharge_gst_'+amountShow).val()!=""){
        npf_surcharge_gst_amount_show=$('#npf_surcharge_gst_'+amountShow).val();
    }
    
    if($('#payment_gateway_'+amountShow).val()!=""){
        payment_gateway_amount_show=$('#payment_gateway_'+amountShow).val();
    }
    if($('#payment_gateway_gst_'+amountShow).val()!=""){
        payment_gateway_gst_amount_show=$('#payment_gateway_gst_'+amountShow).val();
    }

    other_base_fee= final_fee - parseFloat(npf_surcharge_amount_show) - parseFloat(npf_surcharge_gst_amount_show);
    online_base_fee = other_base_fee - parseFloat(payment_gateway_amount_show) - parseFloat(payment_gateway_gst_amount_show);

    tax_on_online_base_fee=online_base_fee-((online_base_fee*100)/(100+base_fee_gst));
    tax_on_other_base_fee=other_base_fee-((other_base_fee*100)/(100+base_fee_gst));
        
    if( $("#base_fee_gst_breakup").length && $("#base_fee_gst_breakup").is(":checked") ){
        $('#base_fee_igst_'+amountValue).val(base_fee_gst);
        $('#base_fee_cgst_'+amountValue).val((base_fee_gst/2).toFixed(2));
        $('#base_fee_sgst_'+amountValue).val((base_fee_gst/2).toFixed(2));

        $('#base_fee_igst_'+amountShow).val(tax_on_online_base_fee.toFixed(2));
        $('#base_fee_cgst_'+amountShow).val((tax_on_online_base_fee/2).toFixed(2));
        $('#base_fee_sgst_'+amountShow).val((tax_on_online_base_fee/2).toFixed(2));

        $('#base_fee_igst_other_'+amountShow).val(tax_on_other_base_fee.toFixed(2));
        $('#base_fee_cgst_other_'+amountShow).val((tax_on_other_base_fee/2).toFixed(2));
        $('#base_fee_sgst_other_'+amountShow).val((tax_on_other_base_fee/2).toFixed(2));
    }

    $('#base_fee_gst_'+amountShow).val(tax_on_online_base_fee.toFixed(2));
    $('#base_fee_gst_other_'+amountShow).val(tax_on_other_base_fee.toFixed(2));

    $('#base_fee_'+amountShow).val((online_base_fee-tax_on_online_base_fee).toFixed(2));
    $('#base_fee_other_'+amountShow).val((other_base_fee-tax_on_other_base_fee).toFixed(2));

    $('#other_amount_'+amountShow).val(final_fee.toFixed(2));
    $('#online_amount_'+amountShow).val(final_fee.toFixed(2));
    
}

function calculateAmount(){
    if($('#base_fee_'+amountValue).val()!=""){
        if($('#base_fee_'+amount_type).val()=="base_amount"){
            calculateOnBaseAmount();
        }
        else if($('#base_fee_'+amount_type).val()=="final_amount"){
            calculateOnFinalAmount();
        }
    }
}

function validateData(){
    $('.error').hide();
    var payment_method=false;
    var error=false;
    $('.payment_checkbox').each(function () {
        var sThisVal = (this.checked ? "1" : "0");
        if(sThisVal=="1"){
            payment_method=true;
            if(this.value == 'Online' && ($("#payment_gateway_type").val() === '' || $("#payment_gateway_type").val() === null)) {
                $('#payment_gateway_type_error').html("Field is required.");
                $('#payment_gateway_type_error').show();
                error=true;
            }
        }
    });
    
    if($("#payment_process_type").val()!=="free" && payment_method==false){
        $('#error_payment_method').html("Field is required.");
        $('#error_payment_method').show();
        error=true;
    }
    //payment_receipt_template
    if($("#payment_receipt_template").val() == ""){
        $('#error_payment_receipt_template').html("Field is required.");
        $('#error_payment_receipt_template').show();
        error=true;
        //$("#payment_process_type").val()!=="free" && 
    } else if($("#payment_receipt_template").val() == 'noreceipt') {
        if ($("#receipt_message_box").val() == "") {
            $('#receipt_message_box_error').html("Field is required.");
            $('#receipt_message_box_error').show();
            error = true;
        }
    }

    
    if ( $("#enable_conditional_fees").is(":checked")==true  && $("#enable_new_checkout_page").is(":checked")==false ) {
        $('#error_new_checkout_page').html("New Checkout page is required to configure conditional fee.");
        $('#error_new_checkout_page').show();
        error=true;
    }
    
    if($("#payment_process_type").val()=="midpayment" && $("#payment_after_stage").val()==""){
        $('#error_payment_after_stage').html("Field is required.");
        $('#error_payment_after_stage').show();
        error=true;
    }
    
    if($("#payment_process_type").val()!="free" && $("#payment_process_type").val()!=""){
        if ( $("#enable_conditional_fees").is(":checked")!==true ) {
            if($("#base_fee_amt_value").val() ==""){
                $('#error_base_fee_amt_value').html("Required");
                $('#error_base_fee_amt_value').show();
                error=true;
            }else if(parseInt($("#base_fee_amt_value").val())<=0){
                $('#error_base_fee_amt_value').html("Fee must be greater than 0");
                $('#error_base_fee_amt_value').show();
                error=true;
            }
        }
    }
    if( ($("#base_fee_gst_breakup").length && $("#base_fee_gst_breakup").is(":checked")) || 
            ($("#npf_surcharge_gst_breakup").length && $("#npf_surcharge_gst_breakup").is(":checked")) || 
            ( $("#payment_gateway_gst_breakup").length && $("#payment_gateway_gst_breakup").is(":checked")) ||
            $("#business_origin_country").hasClass('required')
            ){
        
        if($("#business_origin_country").val()==""){
            $('#business_origin_country_error').html("Field is required.");
            $('#business_origin_country_error').show();
            error=true;
        }
        if($("#business_origin_state").val()==""){
            $('#business_origin_state_error').html("Field is required.");
            $('#business_origin_state_error').show();
            error=true;
        }
    }
    
    if($('#payment_dd:checked').val()=="DD" && $("#dd_related_info").val()==""){
        $('#error_dd_related_info').html("Field is required.");
        $('#error_dd_related_info').show();
        error=true;
    }
    if($('#payment_cash:checked').val()=="Cash" && $("#cash_related_info").val()==""){
        $('#error_cash_related_info').html("Field is required.");
        $('#error_cash_related_info').show();
        error=true;
    }
    
    if(($("#payment_gateway_type").val() == 'Twocheckout') && ($("#twocheckout_product_list").val() == "")) {
        $('#twocheckout_product_list_error').html("Field is required.");
        $('#twocheckout_product_list_error').show();
        error = true;
    }
    
    if(error==false){
        return true;
    }else{
        $('html, body').animate({
            scrollTop: $("#error_anchor").offset().top
        }, 1000);
        return false;
    }
}

function savePaymentConfig(){
    
    if(validateData()==false){
        return;
    }
    //make buttun disable
    var data = [];
    disabled = false
    if($("#enable_new_checkout_page:checkbox").prop('disabled') == true)
    {
        disabled = true; 
        $("#enable_new_checkout_page:checkbox").prop('disabled', false);
    }
    data = $('#form_payment_config').serializeArray();
    if(disabled == true){
        $("#enable_new_checkout_page:checkbox").prop('disabled', true);
    }
    

    $.ajax({
        url: jsVars.FULL_URL + '/form-settings/save-payment-config',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $('#listloader').show();
        },
        complete: function () {
            $('#listloader').hide();
            $(':input[type="button"]').removeAttr("disabled");
        },
        async: true,
        success: function (response) {
            var responseObject = $.parseJSON(response); 
           
            //return;
            if (responseObject.data == "session") {
                location.reload();
            }else if (responseObject.data== "invalid_request"){
                location.reload();
            }else if (responseObject.data== "twocheckout_product_list_missing"){
                alertPopup('Please enter twocheckout product code to continue.','error');
            }else if (responseObject.data== "ebpg_currency_issue"){
                alertPopup('Please set USD currency because college payment configuration is not configured.','error');
            }else if (responseObject.data== "partial_pay_disallow_discount"){
                alertPopup('You are not allowed to enable discount coupon with full/partial payment.','error');
            }else if (responseObject.data == "college_missing" || responseObject.data == "form_missing"){
                $('#load_config_div').html("<div class='text-center text-danger errorMsgPayment'><div class='emp'><i class='glyphicon glyphicon-warning-sign'></i>&nbsp;Please select an institute & form to continue.</div></div>");
            }else if (responseObject.data == "config_missing_masterrazorpay"){
                $('#load_config_div').html("<div class='text-center text-danger errorMsgPayment'><div class='emp'><i class='glyphicon glyphicon-warning-sign'></i>&nbsp;Master Razorpay configuration is missing.</div></div>");
            }else if (responseObject.data == "invalid_masterrazorpay_merchantid"){
                $('#load_config_div').html("<div class='text-center text-danger errorMsgPayment'><div class='emp'><i class='glyphicon glyphicon-warning-sign'></i>&nbsp;Invalid Merchant Account name for Master Razorpay.</div></div>");
            }else if (responseObject.data == "invalid_masterrazorpay_splittransfer"){
                $('#load_config_div').html("<div class='text-center text-danger errorMsgPayment'><div class='emp'><i class='glyphicon glyphicon-warning-sign'></i>&nbsp;Invalid Transfer Account Name for Master Razorpay.</div></div>");
            }else if (responseObject.data == "success"){
                if( typeof responseObject.redirectURL!=="undefined" ){
                    location = responseObject.redirectURL;
                }else{
                    $('#alert_msg').html("<i class='fa fa-check'></i>&nbsp;Form Payment config successfully saved.");
                }
                //$('.error_message').html("");
                //alertPopup('Your payment setting has been saved successfully.','success');
            }
			
//			else if (responseObject.data == "error"){
//                $('.error_message').html("");
//                /*$.each(responseObject.post, function(index, value) {
//                    $('#error_'+index).html(value);
//                }); */
//            }
            //$('#alert_msg').html(responseObject.data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            setTimeout("location.reload();",5000);
        }
    });
}

function loadPaymentFormConfig() {
    //make buttun disable
    var data = [];
    data=new Array();
    data.push({name:"college_id",value:$('#college_id').val()});
    data.push({name:"form_id",value:$('#form_id').val()});

    $.ajax({
        url: jsVars.FULL_URL + '/form-settings/form-payment-config-ajax',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            hideLoader();
            $(':input[type="button"]').removeAttr("disabled");
        },
        async: true,
        success: function (data) {
			
            if (data == "session") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (data == "invalid_request"){
                location.reload();
            }else if (data == "college_missing" || data=="form_missing"){
                $('#load_config_div').html("<div class='text-center text-danger errorMsgPayment'><div class='emp'><i class='glyphicon glyphicon-warning-sign'></i>&nbsp;Please select an institute & form to continue.</div></div>");
            } else {
                data = data.replace("<head/>", '');
                $('#load_config_div').html(data);
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                bindAfterAjaxCall();
                if($('select#other_payable_fees').length > 0) {
                   $('select#other_payable_fees').SumoSelect({placeholder: 'Other payable Fees', search: true, searchText:'search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
                }
                if($('select#payment_currency').length > 0) {
                    $('select#payment_currency').SumoSelect({placeholder: 'Select Currency Type', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
                }
                if($('select#payment_receipt_template').length > 0) {
                    $('select#payment_receipt_template').SumoSelect({placeholder: 'Select Payment Receipt Tempalte', search: true, searchText:'Search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
                }
                showHideConditionalFee();
                if( ( $("#base_fee_gst_breakup").length && $("#base_fee_gst_breakup").is(":checked")) || 
                        ($("#npf_surcharge_gst_breakup").length && $("#npf_surcharge_gst_breakup").is(":checked")) || 
                        ( $("#payment_gateway_gst_breakup").length && $("#payment_gateway_gst_breakup").is(":checked")) || 
                        $("#enable_conditional_fees").is(":checked") 
                    ){

                    $("#business_origin_country_div").show();
                    $("#business_origin_state_div").show();
                }else{
                    $("#business_origin_country_div").hide();
                    $("#business_origin_state_div").hide();
                    $("#business_origin_country").val("");
                    $("#business_origin_state").val("");
                }
           }
            
            $('#load_config_div').fadeIn();
            
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            //setTimeout("location.reload();",5000);
        }
    });
}

function alertPopup(msg,type,location){
    
    if(type=='error'){
        var selector_parent     = '#ErrorPopupArea';
        var selector_titleID    = '#ErroralertTitle';
        var selector_msg        = '#ErrorMsgBody';
        var btn                 = '#ErrorOkBtn';
        var title_msg           = 'Error';
    }else if(type=='alert'){
        var selector_parent     = '#SuccessPopupArea';
        var selector_titleID    = '#SuccessPopupArea #alertTitle';
        var selector_msg        = '#MsgBody';
        var btn                 = '#OkBtn';
        var title_msg           = 'Alert';
    }else{
        var selector_parent     = '#SuccessPopupArea';
        var selector_titleID    = '#alertTitle';
        var selector_msg        = '#MsgBody';
        var btn                 = '#OkBtn';
        var title_msg           = 'Success';
    }

    $(selector_titleID).html(title_msg);
    $(selector_parent+" "+selector_msg).html(msg);
    $('.oktick').hide();
        
    if(typeof location != 'undefined'){
         $(btn).show();

        $(selector_parent).modal({keyboard:false}).one('click',btn,function(e){
            window.location.href=location;
        });
    }
    else{
        $(selector_parent).modal();
    }
}