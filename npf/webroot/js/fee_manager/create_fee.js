$(document).ready(function(){
    $(".erroralert").delay(5000).slideUp(300);
    $(".successalert").delay(5000).slideUp(300);
    
    bindPaymentAjaxCall();
    
    $(function(){
        $('[rel="popover"]').popover({
                container: 'body',
                html: true,
                content: function () {
                    var clone = $($(this).data('popover-content')).clone(true).removeClass('hide');
                    return clone;
                }
            }).click(function(e) {
                e.preventDefault();
            });
    });
    
});

function bindPaymentAjaxCall(){
    
    if($("#hybrid_payment_gateway").val() == 1){
	$('#tb_payment_gateway_charge').fadeOut();
    }else{
	$('#tb_payment_gateway_charge').fadeIn();
    }
    
    $(document).on('change','#hybrid_payment_gateway', function(){
	var hybrid_payment_gateway = $("#hybrid_payment_gateway").val();
	if(hybrid_payment_gateway == 1){
	    $(".ccavenuehybridconfig").css("display", "block");
	    $('#tb_payment_gateway_charge input').each(function () {
		$(this).val($(this).find(':first-child').val());
	    });
	    changeSelectValue();
	    calculateAmount();
	    $('#tb_payment_gateway_charge').fadeOut();
	}else{
	    $("#online_amount_amt_show").show();
	    $('#tb_payment_gateway_charge').fadeIn();
	    $(".ccavenuehybridconfig").css("display", "none");
	}
    })
    
    if($(".dateinput").length > 0){
	$('.dateinput').datetimepicker({format: 'DD/MM/YYYY HH:mm',viewMode: 'years'});
    }

    $("#save_fee_module_config").click(function(){
	saveFeeModuleConfig(jsVars.urls);
    });
    
    $("#form_fields").change(function(){
	getDropdownValueList(this.value);
      });
      
     $(".fee_payment_checkbox").change(function(){
        showHideFeePaymentInformation("default");
	});
	
	$("#payment_gateway_type").change(function(){
	    var value = this.value;
	    if(value == 'ccAvenue'){
		$(".hybrid_payment_gateway_div").fadeIn();
	    }else{
		$(".hybrid_payment_gateway_div").fadeOut();
	    }
	});

    $(document).on('change','#colleges,#form_id', function(){
	$("#online_email_template").html("");
	$("#online_sms_template").html("");
	$("#cash_email_template").html("");
	$("#cash_sms_template").html("");

        $("#ack_receipt_template").html('<option selected="selected" value="">Select Receipt Template</option>');
        $("#online_email_template").html('<option selected="selected" value="">Select Email Template</option>');
        $("#online_sms_template").html('<option selected="selected" value="">Select SMS Template</option>');
        $("#cash_email_template").html('<option selected="selected" value="">Select Email Template</option>');
        $("#cash_sms_template").html('<option selected="selected" value="">Select SMS Template</option>');
        $("#cash_approval_email_template").html('<option selected="selected" value="">Select Email Template</option>');
        $("#cash_approval_sms_template").html('<option selected="selected" value="">Select SMS Template</option>');
        $('.chosen-select').trigger('chosen:updated');
        getTemplateList();

    });
    
    $("#payment_online").click(function(){
        $("#online_email_template").val('');
        $("#online_sms_template").val('');
        $('.chosen-select').trigger('chosen:updated');
    });
    
    $("#payment_cash").click(function(){
        $("#cash_email_template").val('');
        $("#cash_sms_template").val('');
        $("#cash_approval_email_template").val('');
        $("#cash_approval_sms_template").val('');
        $('.chosen-select').trigger('chosen:updated');
    });
    
    showHideFeePaymentInformation(); 
}

function getTemplateList(){
    if($("#colleges").val() == '' || $('#form_id').val()=='' || $('#form_id').val()==0){
        return;
    }
    
    var collegeId   = $("#colleges").val();
    var formId	    = $("#form_id").val();
    
    $.ajax({
        url: '/fee/get-template-list',
        type: 'post',
        dataType: 'html',
        data: {
	    "collegeId": collegeId,
            "formId": formId
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
	success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    if(typeof responseObject.data.emailTemplates === "object"){
                        var emailTemplates    = responseObject.data.emailTemplates;
                        var value   = '<option selected="selected" value="">Select Email Template</option>';
                        $.each(emailTemplates, function (index, item) {
                            value += '<option value="'+index+'">'+item+'</option>';
                        });
                        $('#online_email_template').html(value);
                        $('#cash_email_template').html(value);
                        $('#cash_approval_email_template').html(value);
                    }
		    
                    if(typeof responseObject.data.smsTemplates === "object"){
                        var smsTemplates    = responseObject.data.smsTemplates;
                        var value   = '<option selected="selected" value="">Select Sms Template</option>';
                        $.each(smsTemplates, function (index, item) {
                            value += '<option value="'+index+'">'+item+'</option>';
                        });
                        $('#online_sms_template').html(value);
                        $('#cash_sms_template').html(value);
                        $('#cash_approval_sms_template').html(value);
                    }
		    
                    if(typeof responseObject.data.ackReceiptTemplates === "object"){
                        var ackReceiptTemplates    = responseObject.data.ackReceiptTemplates;
                        var value   = '<option selected="selected" value="">Select Receipt Template</option>';
                        $.each(ackReceiptTemplates, function (index, item) {
                            value += '<option value="'+index+'">'+item+'</option>';
                        });
                        $('#ack_receipt_template').html(value);
                    }
                }
		$('.chosen-select').trigger('chosen:updated');
            }else{
                //console.log(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function showHideFeePaymentInformation(type){
    
    var other_method=false;
    var online_method=false;
    
    $('.fee_payment_checkbox').each(function () {
        var sThisVal = (this.checked ? "1" : "0");
        if(sThisVal=="1"){
            $('#'+this.id+'_related_div').fadeIn();
            if(this.value=="Online"){
		if($("#hybrid_payment_gateway").val() != 1){
		    $('#tb_payment_gateway_charge').fadeIn();
		}
                if(type=="reset"){
                    $('#tb_payment_gateway_charge select, #'+this.id+'_related_div select').each(function () {
                        $(this).val($(this).find(':first-child').val());
                    });
                }
		if(type=="default"){
		    $('#tb_payment_gateway_charge select').each(function () {
			$(this).val($(this).find(':first-child').val());
		    });
		    changeSelectValue();
		    calculateAmount();
		}
                online_method=true;
            }else{
                other_method=true;
            }
            
        }else{
            $('#'+this.id+'_related_div').fadeOut();
            $('#'+this.id+'_related_div input, #'+this.id+'_related_div textarea, #'+this.id+'_related_div select').val("");
            
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

function getAllFormList(cid, default_val, multiselect) {
    if(typeof default_val=='undefined'){
        default_val = '';
    }
    if(typeof multiselect=='undefined'){
        multiselect = '';
    }
    
    if(cid == '' || cid == '0' ){
        $("#formListDiv").html("<select name='form_id' id='form_id'  class='chosen-select' ><option value='0'>Form</option></select>");
	$("#form_fields").html("<option value='0'>Select Field</option>");
	$('.chosen-select').chosen();
        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        return false;
    }
    
    $.ajax({
        url: '/voucher/get-forms',
        type: 'post',
        data: {
            "college_id": cid,
            "default_val": default_val,
            "multiselect":multiselect
        },
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
           //currentObj.text('Wait..');
        },
        success: function (json) {
            if (json == 'session_logout') {
                window.location.reload(true);
            } else {
                $("#formListDiv").html(json);
		$('#form_id').attr('onChange','getAllDropdown(this.value)');
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                $("#form_id").change(function(){
                    $("#ack_receipt_template").html('<option selected="selected" value="">Select Receipt Template</option>');
                    $("#online_email_template").html('<option selected="selected" value="">Select Email Template</option>');
                    $("#online_sms_template").html('<option selected="selected" value="">Select SMS Template</option>');
                    $("#cash_email_template").html('<option selected="selected" value="">Select Email Template</option>');
                    $("#cash_sms_template").html('<option selected="selected" value="">Select SMS Template</option>');
                    $('.chosen-select').trigger('chosen:updated');
                    //getTemplateList();
                });
            }
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            ;
        }
    });
}

function getAllPaymentGateway(cid) {
    $.ajax({
        url: '/fee/get-all-payment-gateway',
        type: 'post',
        data: {
            "college_id": cid
        },
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
           //currentObj.text('Wait..');
        },
        success: function (json) {
	    var response= $.parseJSON(json);
            if (response == 'session') {
                window.location.reload(true);
            }else if(response == 'invalid_request'){
		alertPopup('Invalid Request' ,'error');
		return;
	    }else {
		var value   = '<option selected="selected" value="">Select Payment Gateway</option>';
		$.each(response.data, function (index, item) {
		    value += '<option value="'+index+'">'+item+'</option>';
		});
                $("#payment_gateway_type").html(value);
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
		$('.chosen-select').trigger('chosen:updated');
            }
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            ;
        }
    });
}

//alert popup
function alertPopup(msg, type, location) {
    var selector_parent, selector_titleID, selector_msg, title_msg, btn;
    if (type == 'error') {
        selector_parent = '#ErrorPopupArea';
        selector_titleID = '#ErroralertTitle';
        selector_msg = '#ErrorMsgBody';
        btn = '#ErrorOkBtn';
        title_msg = 'Error';
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

    if (typeof location != 'undefined') {
        $(btn).show();

        $(selector_parent).modal({keyboard: false}).one('click', btn, function (e) {
            e.preventDefault();
            window.location.href = location;
        });
    } else {
        $(selector_parent).modal();
    }
}

function validateFeeData(){
    $('.error').hide();
    var payment_method=false;
    var error=false;
    $('.fee_payment_checkbox').each(function () {
        var sThisVal = (this.checked ? "1" : "0");
        if(sThisVal=="1"){
            payment_method=true;
        }
    });
    
    if($("#colleges").val()==""){
        $('#college_id_error').html("Field is required.");
        $('#college_id_error').show();
        error=true;
    }

    if($("#form_id").val()=="" || $("#form_id").val()== "0"){
        $('#form_id_error').html("Field is required.");
        $('#form_id_error').show();
        error=true;
    }
    
    if(payment_method==false){
        $('#error_payment_method').html("Field is required.");
        $('#error_payment_method').show();
        error=true;
    }
    
    if($("#payment_process_type").val()==""){
        $('#error_payment_process_type').html("Field is required.");
        $('#error_payment_process_type').show();
        error=true;
    }
    
    if($('#payment_dd:checked').val()=="DD" && $("#dd_related_info").val()==""){
        $('#error_dd_related_info').html("Field is required.");
        $('#error_dd_related_info').show();
        error=true;
    }
    if($('#payment_cash:checked').val()=="Cash"){
	if($("#cash_related_info").val()==""){
	    $('#error_cash_related_info').html("Field is required.");
	    $('#error_cash_related_info').show();
	    error=true;
	}
	if($("#cash_email_template").val()==""){
	    $('#error_cash_email_template').html("Field is required.");
	    $('#error_cash_email_template').show();
	    error=true;
	}
	if($("#cash_sms_template").val()==""){
	    $('#error_cash_sms_template').html("Field is required.");
	    $('#error_cash_sms_template').show();
	    error=true;
	}
	if($("#cash_approval_email_template").val()==""){
	    $('#error_cash_approval_email_template').html("Field is required.");
	    $('#error_cash_approval_email_template').show();
	    error=true;
	}
	if($("#cash_approval_sms_template").val()==""){
	    $('#error_cash_approval_sms_template').html("Field is required.");
	    $('#error_cash_approval_sms_template').show();
	    error=true;
	}
    }
    
    if($('#payment_online:checked').val()=="Online"){
	if($("#payment_gateway_type").val()==""){
	    $('#error_payment_gateway_type').html("Field is required.");
	    $('#error_payment_gateway_type').show();
	    error=true;
	}
	if($("#online_email_template").val()==""){
	    $('#error_online_email_template').html("Field is required.");
	    $('#error_online_email_template').show();
	    error=true;
	}
	if($("#online_sms_template").val()==""){
	    $('#error_online_sms_template').html("Field is required.");
	    $('#error_online_sms_template').show();
	    error=true;
	}
    }

    if($("#payment_start_date").val()==""){
        $('#payment_start_date_validation').html("Field is required.");
        $('#payment_start_date_validation').show();
        error=true;
    }
    if($("#payment_end_date").val()==""){
        $('#payment_end_date_validation').html("Field is required.");
        $('#payment_end_date_validation').show();
        error=true;
    }
    if($("#form_fields").val()=="" || $("#form_fields").val()==0){
        $('#form_fields_validation').html("Field is required.");
        $('#form_fields_validation').show();
        error=true;
    }
    if($("#form_fields_value").val()==""){
        $('#form_fields_value_validation').html("Field is required.");
        $('#form_fields_value_validation').show();
        error=true;
    }
    if($("#base_fee_amt_value").val() =="" || $("#base_fee_amt_value").val() == 0){
	$('#error_base_fee_amt_value').html("Required");
	$('#error_base_fee_amt_value').show();
	error=true;
    }
    if($("#ack_receipt_template").val()==""){
	$('#ack_receipt_template_validation').html("Field is required.");
	$('#ack_receipt_template_validation').show();
	error=true;
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

function saveFeeModuleConfig(urls){
    
    if(validateFeeData()==false){
        return;
    }
    //make buttun disable
    var data = [];
    data = $('#fee_module_config').serializeArray();
    data.push({name:'instruction',value:CKEDITOR.instances['editor'].getData()});
    data.push({name:'urls',value:urls});
    //data.push({name:'status',value:'2'});

    $.ajax({
        url: jsVars.saveFeeModule,
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
	    if (responseObject.message === 'session'){
                window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
	    if(responseObject.status==1){
                $('#alert_msg').html("<i class='fa fa-check'></i>&nbsp;Fee module successfully saved.");
		location = jsVars.feeModule;
            }else{
                alertPopup(responseObject.message ,'error');
		return;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            setTimeout("location.reload();",5000);
        }
    });
}

function getAllDropdown(formId) {    
    $.ajax({
        url: '/fee/get-all-dropdown',
        type: 'post',
        dataType: 'json',
        data: {
            "formId": formId
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            if(typeof json['redirect'] !== 'undefined'){
                window.location(json['redirect']);
            }            
            $('#form_fields').html(json['optionList']);
            $('#form_fields').attr('onChange','getDropdownValueList(this.value)');
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.chosen-select').trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getDropdownValueList(value) {  
    if(value == '' || value == '0' ){
	$("#form_fields").html("<option value='0'>Select Field</option>");
	$('.chosen-select').chosen();
        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        return false;
    }
    $.ajax({
        url: '/voucher/get-dropdown-value-list',
        type: 'post',
        dataType: 'json',
        data: {
            "value": value
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            if(typeof json['redirect'] !== 'undefined'){
                window.location(json['redirect']);
            }            
            $('#form_fields_value').html(json['optionList']);
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.chosen-select').trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$('#OkBtn').on('click',function(){
    $("#SuccessPopupArea .npf-close").trigger('click');
});

function bindAfterAjaxCall(){
    $("#payment_setting_table input, #payment_setting_table select").change(function(){
        changeSelectValue();
        calculateAmount();
    });
     
    $("#payment_setting_table input").change(function(){
        //if(this.value!=""){
            if($.isNumeric(this.value)){
              // do nothing
            }else{
                $(this).val("0");
                calculateAmount();
            }
            //alert(c.value);
	//}
    });
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


// if config is based on base amount then calulate the data
function calculateOnBaseAmount(){
    var base_fee=parseFloat($('#base_fee_'+amountValue).val());
    
    if(isNaN(base_fee)){
	return false;
    }
    net_amount=other_amount=online_amount=base_fee;
    $('#base_fee_'+amountShow).val(net_amount.toFixed(2));
    $('#base_fee_other_'+amountShow).val(net_amount.toFixed(2));
    
    tax_on_base_fee=0;
    // base fee gst calulcation
    if($('#base_fee_gst_'+amountValue).val()!=""){

        var base_fee_gst=parseFloat($('#base_fee_gst_'+amountValue).val());
        if($('#base_fee_'+amount_type).val()=="final_amount"){
            tax_on_base_fee=base_fee-((base_fee*100)/(100+base_fee_gst));
        }else{
            tax_on_base_fee=(base_fee_gst/100)*base_fee;
        }


        $('#base_fee_gst_'+amountShow).val(tax_on_base_fee.toFixed(2));
        $('#base_fee_gst_other_'+amountShow).val(tax_on_base_fee.toFixed(2));
        online_amount=other_amount=other_amount+tax_on_base_fee;
    }
    
    // npf surcharge and npf surcharge gst calculation
    if($('#npf_surcharge_'+amountValue).val()!=""){
        var npf_surcharge=parseFloat($('#npf_surcharge_'+amountValue).val());

        if($('#npf_surcharge_'+amount_type).val()=="fixed"){
            npf_surcharge_amount=npf_surcharge;

        }else{
            npf_surcharge_amount=((npf_surcharge*(base_fee+tax_on_base_fee))/100);
        }
        npf_surcharge_amount_show=npf_surcharge_amount;
        $('#npf_surcharge_'+amountShow).val(npf_surcharge_amount_show.toFixed(2));
        $('#npf_surcharge_other_'+amountShow).val(npf_surcharge_amount_show.toFixed(2));


        npf_surcharge_gst_amount=0;
        if($('#npf_surcharge_gst_'+amountValue).val()!=""){
            var npf_surcharge_gst=parseFloat($('#npf_surcharge_gst_'+amountValue).val());
            npf_surcharge_gst_amount=((npf_surcharge_gst*npf_surcharge_amount)/100);
            $('#npf_surcharge_gst_'+amountShow).val(npf_surcharge_gst_amount.toFixed(2));
            $('#npf_surcharge_gst_other_'+amountShow).val(npf_surcharge_gst_amount.toFixed(2));
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

        payment_gateway_amount_show=payment_gateway_amount;
        $('#payment_gateway_'+amountShow).val(payment_gateway_amount_show.toFixed(2));

        payment_gateway_gst_amount=0;
        if($('#payment_gateway_gst_'+amountValue).val()!=""){
            var payment_gateway_gst=parseFloat($('#payment_gateway_gst_'+amountValue).val());
            payment_gateway_gst_amount=((payment_gateway_gst*payment_gateway_amount)/100);

            $('#payment_gateway_gst_'+amountShow).val(payment_gateway_gst_amount.toFixed(2));
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

    $('#base_fee_gst_'+amountShow).val(tax_on_online_base_fee.toFixed(2));
    $('#base_fee_gst_other_'+amountShow).val(tax_on_other_base_fee.toFixed(2));

    $('#base_fee_'+amountShow).val((online_base_fee-tax_on_online_base_fee).toFixed(2));
    $('#base_fee_other_'+amountShow).val((other_base_fee-tax_on_other_base_fee).toFixed(2));

    $('#other_amount_'+amountShow).val(final_fee.toFixed(2));
    $('#online_amount_'+amountShow).val(final_fee.toFixed(2));
    
}

function calculateAmount(){
    //if($('#base_fee_'+amountValue).val()!=""){
        if($('#base_fee_'+amount_type).val()=="base_amount"){
            calculateOnBaseAmount();
        }
        else if($('#base_fee_'+amount_type).val()=="final_amount"){
            calculateOnFinalAmount();
        }
    //}
}

/*** Show & Hide Loader ***/
function showLoader() {
    $("#listloader").show();
}
function hideLoader() {
    $("#listloader").hide();
}
