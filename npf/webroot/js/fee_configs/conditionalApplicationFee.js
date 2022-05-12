$(document).ready(function () {
    $(".erroralert").delay(5000).slideUp(300);
    $(".successalert").delay(5000).slideUp(300);

    $('#listloader').hide();
    $('select.condition_value').SumoSelect({placeholder: 'Select Value', search: true, searchText:'search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
    if($('select.currency_type').length > 0) {
        $('select.currency_type').SumoSelect({placeholder: 'Select Payment currency', search: false, searchText:'Search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
    }
    $("#save_fee_config").click(function () {
        saveFeeModuleConfig(jsVars.urls);
    });   
    
    $(".payment_setting_table").each(function(){
        var id  = $(this).data("logicnumber");
        $(this).find("input,select").change(function(){
            changeSelectValue(id);
            calculateAmount(id);
        }); 
    });
    
    $(".payment_setting_table").each(function(){ // if user inputs non-numeric value in any field then convert it to 0 and re-calculate
        var id  = $(this).data("logicnumber");
        $(this).find("input").change(function(){
            if (this.value!="" && !$.isNumeric(this.value)) {
                $(this).val("0");
                calculateAmount(id);
            }
        });
    });
    $('.default_fee').click(function (event){
        makeFeeDefault(this,event);
    });
	$('.feeConfigContainer a[data-toggle="collapse"]').each(function() {
		$(this).click(function(){
			$('.panel-collapse.in').collapse('hide');
			//alert($(this).attr('data-id'));
			//$(this).attr('data-id').collapse('show');
		});
	});
});

function makeFeeDefault(element,event){
    if( $(".default_fee:checked").length>1 ){
        $(".default_fee:checked").removeAttr("checked");
        console.log(element);
        $(element).prop( "checked", true );
        return false;
    }else if( !$(element).is(":checked") ){
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
}


function addConditionalFeeBlock(collegeId, formId, feeConfigId, GSTBreakUpAllowed, pgChargesApplicable, defaultCurrencyType){
    if (validateFeeData() == false) {
        return;
    }
    logicNumber++;
    $.ajax({
        url: jsVars.addConditionalFeeBlockLink,
        type: 'post',
        dataType: 'html',
        data: { logicNumber:logicNumber, collegeId:collegeId, formId:formId, feeConfigId:feeConfigId, 
            GSTBreakUpAllowed:GSTBreakUpAllowed,pgChargesApplicable:pgChargesApplicable,defaultCurrencyType:defaultCurrencyType },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $('#listloader').show();
            window.scrollTo(0, 0);
			$('.panel-collapse.in').collapse('hide');
        },
        complete: function () {
            $('#listloader').hide();
            $(':input[type="button"]').removeAttr("disabled");
        },
        async: true,
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session') {
                window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if (responseObject.status == 1) {
                if(typeof responseObject.data!=="undefined" && typeof responseObject.data.html!=="undefined"){
                    $("#conditionalFeeBlockContainer").append(responseObject.data.html);
    
                    var  logicCount = logicNumber;
                    $("#fee_config_form_"+logicCount).find('.default_fee').click(function (event){
                        makeFeeDefault(this, event);
                    });
                    $("#fee_config_form_"+logicCount).find("input,select").change(function(){
                        changeSelectValue(logicCount);
                        calculateAmount(logicCount);
                    }); 

                    $("#fee_config_form_"+logicCount).find("input").change(function(){// if user inputs non-numeric value in any field then convert it to 0 and re-calculate
                        if($("#fee_config_form_"+logicCount).find("#conditions-field-name").attr('id')!='conditions-field-name'){
                            if (this.value!="" && !$.isNumeric(this.value)) {
                                $(this).val("0");
                                calculateAmount(logicCount);
                            }
                        }
                    });
                    
                    $('select.condition_value').SumoSelect({placeholder: 'Select Value', search: true, searchText:'search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
                    if($('select.currency_type').length > 0) {
                        $('select.currency_type').SumoSelect({placeholder: 'Select Payment currency', search: false, searchText:'Search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
                    }
                    $('select.chosen-select').chosen();
                    
                }
                $("#fee_config_form_"+logicCount).find("input.base_fee_amt_value").focus();
				var scrollBottom = $(window).scrollTop() + $(window).height();
				$("html, body").animate({ scrollTop: scrollBottom }, "slow");
				$('#collapse'+logicNumber).addClass('in');
				$('#feeConfigContainer'+logicNumber).find('.panel-title a[data-toggle="collapse"]').attr('class', ' ');
				
				$('.feeConfigContainer a[data-toggle="collapse"]').each(function() {
					$(this).click(function(){
						$('.panel-collapse.in').collapse('hide');
						//alert($(this).attr('data-id'));
						//$(this).attr('data-id').collapse('show');
					});
				});
				//$('.panel-collapse.in').collapse('hide');
				//$('.panel-collapse:not(".in")').collapse('show');
            } else {
                alertPopup(responseObject.message, 'error');
                return;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            setTimeout("location.reload();", 5000);
        }
    });
    
}
function confirmDeleteLogic(elem){
    $('#ConfirmMsgBody').html('Do you want to delete this config?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();
                $(elem).parents('div.feeConfigContainer').remove();
                $('#ConfirmPopupArea').modal('hide');
            });
    return false;
}

function getDropdownValueList(id,formId) {
    var value   = $("#fee_config_form_"+id).find(".condition_field").val();
    if (value == '' || value == '0') {
        $("#fee_config_form_"+id).find(".condition_value").html("<option value=''>Select Field Value</option>");
        $("#fee_config_form_"+id).find('.condition_value')[0].sumo.reload();
        return false;
    }
    $.ajax({
        url: '/feeConfigs/getDropdownValueOptions',
        type: 'post',
        dataType: 'json',
        data: {
            "value": value, 'formId':formId
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            if (typeof json['redirect'] !== 'undefined') {
                window.location(json['redirect']);
            }
            $("#fee_config_form_"+id).find(".condition_value").html(json['optionList']);
            $("#fee_config_form_"+id).find('.condition_value')[0].sumo.reload();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function validateFeeData(id) {
    $('.error').hide();
    error=false;
    if( $(".default_fee:checked").length==0 ){
        $('#alert_msg').html('<span style="color:red;">Please select a default fee.</span>');
        error = true;
    }
    $(".payment_setting_table").each(function(){ 
        var id  = $(this).data("logicnumber");
        if ( $("#fee_config_form_"+id).find(".condition_field").val() == "" ) {
            $("#fee_config_form_"+id).find('.condition_field_validation').html("Required");
            $("#fee_config_form_"+id).find('.condition_field_validation').show();
            error = true;
        }
        if ( $("#fee_config_form_"+id).find(".condition_type").val() == "" ) {
            $("#fee_config_form_"+id).find('.condition_type_validation').html("Required");
            $("#fee_config_form_"+id).find('.condition_type_validation').show();
            error = true;
        }
        if ( $("#fee_config_form_"+id).find(".condition_value").val() == "" || $("#fee_config_form_"+id).find(".condition_value").val() == null ) {
           
            $("#fee_config_form_"+id).find('.condition_value_validation').html("Required");
            $("#fee_config_form_"+id).find('.condition_value_validation').show();
            error = true;
        }
        
        if ( $("#fee_config_form_"+id).find(".base_fee_amt_value").val() == "") {
            $("#fee_config_form_"+id).find('.error_base_fee_amt_value').html("Required");
            $("#fee_config_form_"+id).find('.error_base_fee_amt_value').show();
            error = true;
        }
		/*if(error==true){
			//$('#collapse'+id).collapse('show');
			/*if (validateFeeData() == false) {
				e.preventDefault();
			}*/
			/*$("html").on('hide.bs.collapse','#collapse'+id', function(e){
				
				//alert('The collapsible content is about to be hidden.');
			});
					
		}*/
    });
    if (error == false) {
        return true;
    } else {
//        $('html, body').animate({
//            scrollTop: $("#error_anchor").offset().top
//        }, 1000);
        return false;
    }
}

function saveFeeModuleConfig() {

    if (validateFeeData() == false) {
        return;
    }
    var data        = {'forms':[]};
    $(".fee_config_form").each(function(){
        data.forms.push($(this).serialize());
    });
    $.ajax({
        url: jsVars.saveConditionalFeeLink,
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $('#listloader').show();
            window.scrollTo(0, 0);
        },
        complete: function () {
            $('#listloader').hide();
            $(':input[type="button"]').removeAttr("disabled");
        },
        async: true,
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session') {
                window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if (responseObject.status == 1) {
                if(typeof responseObject.data!=="undefined" && typeof responseObject.data.redirectURL!=="undefined"){
                    location = responseObject.data.redirectURL;
                }else{
                    $('#alert_msg').html("<i class='fa fa-check'></i>&nbsp;Conditional Fee config successfully saved.");
                }
            } else {
                alertPopup(responseObject.message, 'error');
                return;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            setTimeout("location.reload();", 5000);
        }
    });
}

$('#OkBtn').on('click', function () {
    $("#SuccessPopupArea .npf-close").trigger('click');
});

var paidBy = "paid_by";
var amount_type = "amt_type";
var amountValue = "amt_value";
var amountShow = "amt_show";
var net_amount = 0;
var other_amount = 0;
var online_amount = 0;

// if base fee amount type if final_amount then npf_surcharge and payment_gateway surcharge is paid by institute. 
function changeSelectValue(id) {
    if ( $("#fee_config_form_"+id).find('.base_fee_' + amount_type).val() == "final_amount") {
        $("#fee_config_form_"+id).find('.npf_surcharge_paid_by, .payment_gateway_paid_by').val("institute");
    }
    $("#fee_config_form_"+id).find('.chosen-select').trigger('chosen:updated');
}


function resetGSTBreakup(id){
    if( $("#fee_config_form_"+id).find(".base_fee_gst_breakup").length && $("#fee_config_form_"+id).find(".base_fee_gst_breakup").is(":checked") ){
        $("#fee_config_form_"+id).find(".baseFeeGSTBreakupRow").show();
    }else{
        $("#fee_config_form_"+id).find(".baseFeeGSTBreakupRow").hide();
    }
    
    if( $("#fee_config_form_"+id).find(".npf_surcharge_gst_breakup").length && $("#fee_config_form_"+id).find(".npf_surcharge_gst_breakup").is(":checked") ){
        $("#fee_config_form_"+id).find(".npfSurchargeGSTBreakupRow").show();
    }else{
        $("#fee_config_form_"+id).find(".npfSurchargeGSTBreakupRow").hide();
    }
    
    if( $("#fee_config_form_"+id).find(".payment_gateway_gst_breakup").length && $("#fee_config_form_"+id).find(".payment_gateway_gst_breakup").is(":checked") ){
        $("#fee_config_form_"+id).find(".pgChargesGSTBreakupRow").show();
    }else{
        $("#fee_config_form_"+id).find(".pgChargesGSTBreakupRow").hide();
    }
    
    $("#fee_config_form_"+id).find('.base_fee_igst_'+amountValue).val('');
    $("#fee_config_form_"+id).find('.base_fee_cgst_'+amountValue).val('');
    $("#fee_config_form_"+id).find('.base_fee_sgst_'+amountValue).val('');

    $("#fee_config_form_"+id).find('.base_fee_igst_'+amountShow).val('');
    $("#fee_config_form_"+id).find('.base_fee_cgst_'+amountShow).val('');
    $("#fee_config_form_"+id).find('.base_fee_sgst_'+amountShow).val('');

    $("#fee_config_form_"+id).find('.base_fee_igst_other_'+amountShow).val('');
    $("#fee_config_form_"+id).find('.base_fee_cgst_other_'+amountShow).val('');
    $("#fee_config_form_"+id).find('.base_fee_sgst_other_'+amountShow).val('');
    
    $("#fee_config_form_"+id).find('.npf_surcharge_igst_'+amountValue).val('');
    $("#fee_config_form_"+id).find('.npf_surcharge_cgst_'+amountValue).val('');
    $("#fee_config_form_"+id).find('.npf_surcharge_sgst_'+amountValue).val('');

    $("#fee_config_form_"+id).find('.npf_surcharge_igst_'+amountShow).val('');
    $("#fee_config_form_"+id).find('.npf_surcharge_cgst_'+amountShow).val('');
    $("#fee_config_form_"+id).find('.npf_surcharge_sgst_'+amountShow).val('');

    $("#fee_config_form_"+id).find('.npf_surcharge_igst_other_'+amountShow).val('');
    $("#fee_config_form_"+id).find('.npf_surcharge_cgst_other_'+amountShow).val('');
    $("#fee_config_form_"+id).find('.npf_surcharge_sgst_other_'+amountShow).val('');
    
    $("#fee_config_form_"+id).find('.payment_gateway_igst_'+amountValue).val('');
    $("#fee_config_form_"+id).find('.payment_gateway_cgst_'+amountValue).val('');
    $("#fee_config_form_"+id).find('.payment_gateway_sgst_'+amountValue).val('');

    $("#fee_config_form_"+id).find('.payment_gateway_igst_'+amountShow).val('');
    $("#fee_config_form_"+id).find('.payment_gateway_cgst_'+amountShow).val('');
    $("#fee_config_form_"+id).find('.payment_gateway_sgst_'+amountShow).val('');
    
}

// if config is based on base amount then calulate the data
function calculateOnBaseAmount(id) {
    var base_fee = parseFloat($("#fee_config_form_"+id).find('.base_fee_' + amountValue).val());

    if (isNaN(base_fee)) {
        return false;
    }
    net_amount = other_amount = online_amount = parseFloat(base_fee.toFixed(2));
    $("#fee_config_form_"+id).find('.base_fee_' + amountShow).val(net_amount);
    $("#fee_config_form_"+id).find('.base_fee_other_' + amountShow).val(net_amount);
    
    tax_on_base_fee = 0;
    
    resetGSTBreakup(id);

    // base fee gst calulcation
    if ($("#fee_config_form_"+id).find('.base_fee_gst_' + amountValue).val() != "") {

        var base_fee_gst = parseFloat($("#fee_config_form_"+id).find('.base_fee_gst_' + amountValue).val());
        if ($("#fee_config_form_"+id).find('.base_fee_' + amount_type).val() == "final_amount") {
            tax_on_base_fee = base_fee - ((base_fee * 100) / (100 + base_fee_gst));
        } else {
            tax_on_base_fee = (base_fee_gst / 100) * base_fee;
        }
        tax_on_base_fee  = parseFloat(tax_on_base_fee.toFixed(2));


        $("#fee_config_form_"+id).find('.base_fee_gst_' + amountShow).val(tax_on_base_fee);
        $("#fee_config_form_"+id).find('.base_fee_gst_other_' + amountShow).val(tax_on_base_fee);
        online_amount = other_amount = other_amount + tax_on_base_fee;
            
        if( $("#fee_config_form_"+id).find(".base_fee_gst_breakup").length && $("#fee_config_form_"+id).find(".base_fee_gst_breakup").is(":checked") ){
            $("#fee_config_form_"+id).find('.base_fee_igst_'+amountValue).val(base_fee_gst);
            $("#fee_config_form_"+id).find('.base_fee_cgst_'+amountValue).val((base_fee_gst/2).toFixed(2));
            $("#fee_config_form_"+id).find('.base_fee_sgst_'+amountValue).val((base_fee_gst/2).toFixed(2));
            
            $("#fee_config_form_"+id).find('.base_fee_igst_'+amountShow).val(tax_on_base_fee.toFixed(2));
            $("#fee_config_form_"+id).find('.base_fee_cgst_'+amountShow).val((tax_on_base_fee/2).toFixed(2));
            $("#fee_config_form_"+id).find('.base_fee_sgst_'+amountShow).val((tax_on_base_fee/2).toFixed(2));
            
            $("#fee_config_form_"+id).find('.base_fee_igst_other_'+amountShow).val(tax_on_base_fee.toFixed(2));
            $("#fee_config_form_"+id).find('.base_fee_cgst_other_'+amountShow).val((tax_on_base_fee/2).toFixed(2));
            $("#fee_config_form_"+id).find('.base_fee_sgst_other_'+amountShow).val((tax_on_base_fee/2).toFixed(2));
        }
}

    // npf surcharge and npf surcharge gst calculation
    if ($("#fee_config_form_"+id).find('.npf_surcharge_' + amountValue).val() != "") {
        var npf_surcharge = parseFloat($("#fee_config_form_"+id).find('.npf_surcharge_' + amountValue).val());

        if ($("#fee_config_form_"+id).find('.npf_surcharge_' + amount_type).val() == "fixed") {
            npf_surcharge_amount = npf_surcharge;

        } else {
            npf_surcharge_amount = ((npf_surcharge * (base_fee + tax_on_base_fee)) / 100);
        }
        npf_surcharge_amount_show   = parseFloat(npf_surcharge_amount.toFixed(2));
        $("#fee_config_form_"+id).find('.npf_surcharge_' + amountShow).val(npf_surcharge_amount_show);
        $("#fee_config_form_"+id).find('.npf_surcharge_other_' + amountShow).val(npf_surcharge_amount_show);


        npf_surcharge_gst_amount = 0;
        if ($("#fee_config_form_"+id).find('.npf_surcharge_gst_' + amountValue).val() != "") {
            var npf_surcharge_gst = parseFloat($("#fee_config_form_"+id).find('.npf_surcharge_gst_' + amountValue).val());
            npf_surcharge_gst_amount    = parseFloat(((npf_surcharge_gst*npf_surcharge_amount)/100).toFixed(2));
            $("#fee_config_form_"+id).find('.npf_surcharge_gst_' + amountShow).val(npf_surcharge_gst_amount);
            $("#fee_config_form_"+id).find('.npf_surcharge_gst_other_' + amountShow).val(npf_surcharge_gst_amount);
        
            if( $("#fee_config_form_"+id).find(".npf_surcharge_gst_breakup").length && $("#fee_config_form_"+id).find(".npf_surcharge_gst_breakup").is(":checked") ){
                $("#fee_config_form_"+id).find('.npf_surcharge_igst_'+amountValue).val(npf_surcharge_gst);
                $("#fee_config_form_"+id).find('.npf_surcharge_cgst_'+amountValue).val((npf_surcharge_gst/2).toFixed(2));
                $("#fee_config_form_"+id).find('.npf_surcharge_sgst_'+amountValue).val((npf_surcharge_gst/2).toFixed(2));

                $("#fee_config_form_"+id).find('.npf_surcharge_igst_'+amountShow).val(npf_surcharge_gst_amount);
                $("#fee_config_form_"+id).find('.npf_surcharge_cgst_'+amountShow).val(parseFloat(npf_surcharge_gst_amount/2).toFixed(2));
                $("#fee_config_form_"+id).find('.npf_surcharge_sgst_'+amountShow).val(parseFloat(npf_surcharge_gst_amount/2).toFixed(2));

                $("#fee_config_form_"+id).find('.npf_surcharge_igst_other_'+amountShow).val(npf_surcharge_gst_amount);
                $("#fee_config_form_"+id).find('.npf_surcharge_cgst_other_'+amountShow).val(parseFloat(npf_surcharge_gst_amount/2).toFixed(2));
                $("#fee_config_form_"+id).find('.npf_surcharge_sgst_other_'+amountShow).val(parseFloat(npf_surcharge_gst_amount/2).toFixed(2));
            }
        }


        if ($("#fee_config_form_"+id).find('.npf_surcharge_' + paidBy).val() == "applicant") {
            online_amount = other_amount = other_amount + npf_surcharge_amount + npf_surcharge_gst_amount;
        }

    }



    if ($("#fee_config_form_"+id).find('.payment_gateway_' + amountValue).val() != "") {
        var payment_gateway = parseFloat($("#fee_config_form_"+id).find('.payment_gateway_' + amountValue).val());

        if ($("#fee_config_form_"+id).find('.payment_gateway_' + amount_type).val() == "fixed") {
            payment_gateway_amount = payment_gateway;

        } else {
            payment_gateway_amount = ((payment_gateway * online_amount) / 100);
            //payment_gateway_amount=((payment_gateway*base_fee)/100);
        }

        payment_gateway_amount_show = parseFloat(payment_gateway_amount.toFixed(2));
        $("#fee_config_form_"+id).find('.payment_gateway_' + amountShow).val(payment_gateway_amount_show);

        payment_gateway_gst_amount = 0;
        if ($("#fee_config_form_"+id).find('.payment_gateway_gst_' + amountValue).val() != "") {
            var payment_gateway_gst = parseFloat($("#fee_config_form_"+id).find('.payment_gateway_gst_' + amountValue).val());
            payment_gateway_gst_amount  = parseFloat(((payment_gateway_gst*payment_gateway_amount)/100).toFixed(2));

            $("#fee_config_form_"+id).find('.payment_gateway_gst_' + amountShow).val(payment_gateway_gst_amount);
        
            if( $("#fee_config_form_"+id).find(".payment_gateway_gst_breakup").length && $("#fee_config_form_"+id).find(".payment_gateway_gst_breakup").is(":checked") ){
                $("#fee_config_form_"+id).find('.payment_gateway_igst_'+amountValue).val(payment_gateway_gst);
                $("#fee_config_form_"+id).find('.payment_gateway_cgst_'+amountValue).val((payment_gateway_gst/2).toFixed(2));
                $("#fee_config_form_"+id).find('.payment_gateway_sgst_'+amountValue).val((payment_gateway_gst/2).toFixed(2));
                
                $("#fee_config_form_"+id).find('.payment_gateway_igst_'+amountShow).val(payment_gateway_gst_amount);
                $("#fee_config_form_"+id).find('.payment_gateway_cgst_'+amountShow).val(parseFloat(payment_gateway_gst_amount/2).toFixed(2));
                $("#fee_config_form_"+id).find('.payment_gateway_sgst_'+amountShow).val(parseFloat(payment_gateway_gst_amount/2).toFixed(2));
            }
        }

        if ($("#fee_config_form_"+id).find('.payment_gateway_' + paidBy).val() == "applicant") {
            online_amount = other_amount + payment_gateway_amount + payment_gateway_gst_amount;
        }
    }

    $("#fee_config_form_"+id).find('.other_amount_' + amountShow).val(other_amount.toFixed(2));
    $("#fee_config_form_"+id).find('.online_amount_' + amountShow).val(online_amount.toFixed(2));

}


function calculateOnFinalAmount(id) {

    var base_fee = parseFloat($("#fee_config_form_"+id).find('.base_fee_' + amountValue).val());

    final_fee = other_amount = online_amount = base_fee;
    $("#fee_config_form_"+id).find('.base_fee_' + amountShow).val(net_amount.toFixed(2));
    $("#fee_config_form_"+id).find('.base_fee_other_' + amountShow).val(net_amount.toFixed(2));
    payment_gateway = payment_gateway_gst = 0;
    
    resetGSTBreakup(id);

    //calulate npf_surcharge and npf_surcharge_gst
    if ($("#fee_config_form_"+id).find('.npf_surcharge_' + amountValue).val() != "") {
        var npf_surcharge = parseFloat($("#fee_config_form_"+id).find('.npf_surcharge_' + amountValue).val());

        if ($("#fee_config_form_"+id).find('.npf_surcharge_' + amount_type).val() == "fixed") {
            npf_surcharge_amount = npf_surcharge;
        } else {
            npf_surcharge_amount = ((npf_surcharge * base_fee) / 100);
        }

        $("#fee_config_form_"+id).find('.npf_surcharge_' + amountShow).val(npf_surcharge_amount.toFixed(2));
        $("#fee_config_form_"+id).find('.npf_surcharge_other_' + amountShow).val(npf_surcharge_amount.toFixed(2));

        npf_surcharge_gst_amount = 0;
        if ($("#fee_config_form_"+id).find('.npf_surcharge_gst_' + amountValue).val() != "") {
            var npf_surcharge_gst = parseFloat($("#fee_config_form_"+id).find('.npf_surcharge_gst_' + amountValue).val());
            npf_surcharge_gst_amount = ((npf_surcharge_gst * npf_surcharge_amount) / 100);
            $("#fee_config_form_"+id).find('.npf_surcharge_gst_' + amountShow).val(npf_surcharge_gst_amount.toFixed(2));
            $("#fee_config_form_"+id).find('.npf_surcharge_gst_other_' + amountShow).val(npf_surcharge_gst_amount.toFixed(2));
        
            if( $("#fee_config_form_"+id).find(".npf_surcharge_gst_breakup").length && $("#fee_config_form_"+id).find(".npf_surcharge_gst_breakup").is(":checked") ){
                $("#fee_config_form_"+id).find('.npf_surcharge_igst_'+amountValue).val(npf_surcharge_gst);
                $("#fee_config_form_"+id).find('.npf_surcharge_cgst_'+amountValue).val((npf_surcharge_gst/2).toFixed(2));
                $("#fee_config_form_"+id).find('.npf_surcharge_sgst_'+amountValue).val((npf_surcharge_gst/2).toFixed(2));
                
                $("#fee_config_form_"+id).find('.npf_surcharge_igst_'+amountShow).val(npf_surcharge_gst_amount.toFixed(2));
                $("#fee_config_form_"+id).find('.npf_surcharge_cgst_'+amountShow).val(parseFloat(npf_surcharge_gst_amount/2).toFixed(2));
                $("#fee_config_form_"+id).find('.npf_surcharge_sgst_'+amountShow).val(parseFloat(npf_surcharge_gst_amount/2).toFixed(2));
                
                $("#fee_config_form_"+id).find('.npf_surcharge_igst_other_'+amountShow).val(npf_surcharge_gst_amount.toFixed(2));
                $("#fee_config_form_"+id).find('.npf_surcharge_cgst_other_'+amountShow).val(parseFloat(npf_surcharge_gst_amount/2).toFixed(2));
                $("#fee_config_form_"+id).find('.npf_surcharge_sgst_other_'+amountShow).val(parseFloat(npf_surcharge_gst_amount/2).toFixed(2));
            }
        }

    }

    // 
    if ($("#fee_config_form_"+id).find('.payment_gateway_' + amountValue).val() != "") {
        var payment_gateway = parseFloat($("#fee_config_form_"+id).find('.payment_gateway_' + amountValue).val());

        if ($("#fee_config_form_"+id).find('.payment_gateway_gst_' + amountValue).val() != "") {
            var payment_gateway_gst = parseFloat($("#fee_config_form_"+id).find('.payment_gateway_gst_' + amountValue).val());
        }

        // formula is = x + (2%of x) + 18% of (2% of x) = 100;
        if ($("#fee_config_form_"+id).find('.payment_gateway_' + amount_type).val() == "fixed") {
            base_fee_ex_gateway = (final_fee - payment_gateway) - (payment_gateway_gst * payment_gateway) / 100;
        } else {
            base_fee_ex_gateway = (final_fee * 100 * 100) / (10000 + (payment_gateway * 100) + (payment_gateway * payment_gateway_gst));
        }

        if ($("#fee_config_form_"+id).find('.payment_gateway_' + amount_type).val() == "fixed") {
            payment_gateway_amount = payment_gateway;
        } else {
            payment_gateway_amount = ((payment_gateway * base_fee_ex_gateway) / 100);
        }

        $("#fee_config_form_"+id).find('.payment_gateway_' + amountShow).val(payment_gateway_amount.toFixed(2));

        payment_gateway_gst_amount = 0;
        if ( $("#fee_config_form_"+id).find('.payment_gateway_gst_' + amountValue).val() != "" ) {
            var payment_gateway_gst = parseFloat( $("#fee_config_form_"+id).find('.payment_gateway_gst_' + amountValue).val() );
            payment_gateway_gst_amount = ((payment_gateway_gst * payment_gateway_amount) / 100);
            $("#fee_config_form_"+id).find('.payment_gateway_gst_' + amountShow).val(payment_gateway_gst_amount.toFixed(2));
        
            if( $("#fee_config_form_"+id).find(".payment_gateway_gst_breakup").length && $("#fee_config_form_"+id).find(".payment_gateway_gst_breakup").is(":checked") ){
                $("#fee_config_form_"+id).find('.payment_gateway_igst_'+amountValue).val(payment_gateway_gst);
                $("#fee_config_form_"+id).find('.payment_gateway_cgst_'+amountValue).val((payment_gateway_gst/2).toFixed(2));
                $("#fee_config_form_"+id).find('.payment_gateway_sgst_'+amountValue).val((payment_gateway_gst/2).toFixed(2));
                
                $("#fee_config_form_"+id).find('.payment_gateway_igst_'+amountShow).val(payment_gateway_gst_amount.toFixed(2));
                $("#fee_config_form_"+id).find('.payment_gateway_cgst_'+amountShow).val(parseFloat(payment_gateway_gst_amount/2).toFixed(2));
                $("#fee_config_form_"+id).find('.payment_gateway_sgst_'+amountShow).val(parseFloat(payment_gateway_gst_amount/2).toFixed(2));
            }
        }
    }


    base_fee_gst = npf_surcharge_amount_show = npf_surcharge_gst_amount_show = payment_gateway_amount_show = payment_gateway_gst_amount_show = 0;

    if ($("#fee_config_form_"+id).find('.base_fee_gst_' + amountValue).val() != "") {
        base_fee_gst = parseFloat($("#fee_config_form_"+id).find('.base_fee_gst_' + amountValue).val());
    }

    if ($("#fee_config_form_"+id).find('.npf_surcharge_' + amountShow).val() != "") {
        npf_surcharge_amount_show = $("#fee_config_form_"+id).find('.npf_surcharge_' + amountShow).val();
    }
    if ($("#fee_config_form_"+id).find('.npf_surcharge_gst_' + amountShow).val() != "") {
        npf_surcharge_gst_amount_show = $("#fee_config_form_"+id).find('.npf_surcharge_gst_' + amountShow).val();
    }

    if ($("#fee_config_form_"+id).find('.payment_gateway_' + amountShow).val() != "") {
        payment_gateway_amount_show = $("#fee_config_form_"+id).find('.payment_gateway_' + amountShow).val();
    }
    if ($("#fee_config_form_"+id).find('.payment_gateway_gst_' + amountShow).val() != "") {
        payment_gateway_gst_amount_show = $("#fee_config_form_"+id).find('.payment_gateway_gst_' + amountShow).val();
    }

    other_base_fee = final_fee - parseFloat(npf_surcharge_amount_show) - parseFloat(npf_surcharge_gst_amount_show);
    online_base_fee = other_base_fee - parseFloat(payment_gateway_amount_show) - parseFloat(payment_gateway_gst_amount_show);

    tax_on_online_base_fee = online_base_fee - ((online_base_fee * 100) / (100 + base_fee_gst));
    tax_on_other_base_fee = other_base_fee - ((other_base_fee * 100) / (100 + base_fee_gst));

    $("#fee_config_form_"+id).find('.base_fee_gst_' + amountShow).val(tax_on_online_base_fee.toFixed(2));
    $("#fee_config_form_"+id).find('.base_fee_gst_other_' + amountShow).val(tax_on_other_base_fee.toFixed(2));
        
    if( $("#fee_config_form_"+id).find(".base_fee_gst_breakup").length && $("#fee_config_form_"+id).find(".base_fee_gst_breakup").is(":checked") ){
        $("#fee_config_form_"+id).find('.base_fee_igst_'+amountValue).val(base_fee_gst);
        $("#fee_config_form_"+id).find('.base_fee_cgst_'+amountValue).val((base_fee_gst/2).toFixed(2));
        $("#fee_config_form_"+id).find('.base_fee_sgst_'+amountValue).val((base_fee_gst/2).toFixed(2));

        $("#fee_config_form_"+id).find('.base_fee_igst_'+amountShow).val(tax_on_online_base_fee.toFixed(2));
        $("#fee_config_form_"+id).find('.base_fee_cgst_'+amountShow).val((tax_on_online_base_fee/2).toFixed(2));
        $("#fee_config_form_"+id).find('.base_fee_sgst_'+amountShow).val((tax_on_online_base_fee/2).toFixed(2));

        $("#fee_config_form_"+id).find('.base_fee_igst_other_'+amountShow).val(tax_on_other_base_fee.toFixed(2));
        $("#fee_config_form_"+id).find('.base_fee_cgst_other_'+amountShow).val((tax_on_other_base_fee/2).toFixed(2));
        $("#fee_config_form_"+id).find('.base_fee_sgst_other_'+amountShow).val((tax_on_other_base_fee/2).toFixed(2));
    }

    $("#fee_config_form_"+id).find('.base_fee_' + amountShow).val((online_base_fee - tax_on_online_base_fee).toFixed(2));
    $("#fee_config_form_"+id).find('.base_fee_other_' + amountShow).val((other_base_fee - tax_on_other_base_fee).toFixed(2));

    $("#fee_config_form_"+id).find('.other_amount_' + amountShow).val(final_fee.toFixed(2));
    $("#fee_config_form_"+id).find('.online_amount_' + amountShow).val(final_fee.toFixed(2));
}

function calculateAmount(id) {
    //if($('#base_fee_'+amountValue).val()!=""){
    if ($("#fee_config_form_"+id).find('.base_fee_' + amount_type).val() == "base_amount") {
        calculateOnBaseAmount(id);
    } else if ($("#fee_config_form_"+id).find('.base_fee_' + amount_type).val() == "final_amount") {
        calculateOnFinalAmount(id);
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

function validateFeeDataBlock() {
    if (validateFeeData() == false) {
        event.preventDefault();
    }
}

    $("html").on('hide.bs.collapse','.collapse', function(e){
        if (validateFeeData() == false) {
            e.preventDefault();
        }
		//validateFeeData();
        //alert('The collapsible content is about to be hidden.');
    });
	
	/*$('html').on('show.bs.collapse', function (e) {
		if (validateFeeData() == false) {
            e.preventDefault();
        }
	})*/
	
	var fcfc = $('.feeConfigContainer').length;
	if(fcfc > 0 && fcfc == 1){
		$('a[data-toggle="collapse"]').trigger('click');
	}
    