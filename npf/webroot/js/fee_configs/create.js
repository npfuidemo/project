$(document).ready(function () {
    $(".erroralert").delay(5000).slideUp(300);
    $(".successalert").delay(5000).slideUp(300);
    
    if($('select#other_payable_fees').length > 0) {
        $('select#other_payable_fees').SumoSelect({placeholder: 'Other payable Fees', search: true, searchText:'search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
    }
    
    if($('select#form_id').length > 0) {
        $('select#form_id').SumoSelect({placeholder: 'Form', search: true, searchText:'search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
    }
    
    /*if($('.unipe_config_section select').length > 0) {
        $('.unipe_config_section select').SumoSelect({placeholder: 'Form', search: true, searchText:'search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
    }*/
    
    if($('select#currency_type').length > 0) {
        $('select#currency_type').SumoSelect({placeholder: 'Select Payment currency', search: false, searchText:'Search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
    }

    bindPaymentAjaxCall();

    $(function () {
        $('[rel="popover"]').popover({
            container: 'body',
            html: true,
            content: function () {
                var clone = $($(this).data('popover-content')).clone(true).removeClass('hide');
                return clone;
            }
        }).click(function (e) {
            e.preventDefault();
        });
    });
    $('#listloader').hide();
    $(document).on( "change","#enable_conditional_fees",function(){
        showHideConditionalFee();
    });
    
    $(document).on( "change","#ack_receipt_template",function(){
        var templateName = $("#ack_receipt_template").val();
        if(templateName == '0') {
            $("#receipt_message_box_div").show();
        } else {
            $("#receipt_message_box_div").hide();
        }
    });
    $(document).on( "change","#ack_receipt_template_unipe",function(){
        var templateName = $("#ack_receipt_template_unipe").val();
        if(templateName == '0') {
            $("#receipt_message_box_unipe_div").show();
        } else {
            $("#receipt_message_box_unipe_div").hide();
        }
    });

    $(document).on( "change","#payment_process_type",function(){
        var formId  = $("#form_id").val();
        if(formId.length==1 && $("#payment_process_type").val()!="6"){
            $("#enable_conditional_fees_div").show();
        }
    });

});

function showHideConditionalFee(){
    if($("#enable_conditional_fees").is(":checked")){
        $("#save_fee_module_config").html('&nbsp; Save And Next');
        $("#payment_setting_table").hide();
    }else{
        $("#save_fee_module_config").html('<span class="glyphicon glyphicon-saved" aria-hidden="true"></span> &nbsp; Save Payment Settings');
        $("#payment_setting_table").show();
    }
}

function bindPaymentAjaxCall() {

    if ($("#hybrid_payment_gateway").val() == 1) {
        $('#tb_payment_gateway_charge').fadeOut();
    } else {
        $('#tb_payment_gateway_charge').fadeIn();
    }

    $(document).on('change', '#hybrid_payment_gateway', function () {
        var hybrid_payment_gateway = $("#hybrid_payment_gateway").val();
        if (hybrid_payment_gateway == 1) {
            $(".ccavenuehybridconfig").css("display", "block");
            $('#tb_payment_gateway_charge input').each(function () {
                $(this).val($(this).find(':first-child').val());
            });
            changeSelectValue();
            calculateAmount();
            $('#tb_payment_gateway_charge').fadeOut();
        } else {
            $("#online_amount_amt_show").show();
            $('#tb_payment_gateway_charge').fadeIn();
            $(".ccavenuehybridconfig").css("display", "none");
        }
    });

    if ($(".dateinput").length > 0) {
        $('.dateinput').datetimepicker({format: 'DD/MM/YYYY HH:mm', viewMode: 'years'});
    }

    $("#save_fee_module_config").click(function () {
        saveFeeModuleConfig(jsVars.urls);
    });

    $("#condition_fd_field").change(function () {
        getDropdownValueList();
    });

    $(".fee_payment_checkbox").change(function () {
        showHideFeePaymentInformation("default");
    });

    $("#payment_process_type").change(function(){
        $("#other_payable_fees").val('');
        showHidePreferenceFeeFields();
    });

    $("#payment_gateway_type").change(function () {
        var value = this.value;
        if (value == 'ccAvenue') {
            $(".hybrid_payment_gateway_div").fadeIn();
            $("#twocheckout_product_list_div").fadeOut();
            $('#twocheckout_product_list').val("");
            $('#razorpay_payment_gateway_div').fadeOut();
            $('#razorpayPaymentLink').removeAttr('checked');
            $('#master_razorpay_payment_gateway_div').fadeOut();
            $('#master_razorpay_split_transfer').val("");
        } else if (value == 'Twocheckout') {
            $("#twocheckout_product_list_div").fadeIn();    
            $(".hybrid_payment_gateway_div").fadeOut();
            $('#razorpay_payment_gateway_div').fadeOut();
            $('#razorpayPaymentLink').removeAttr('checked');
            $('#master_razorpay_payment_gateway_div').fadeOut();
            $('#master_razorpay_split_transfer').val("");
        } else if (value == 'Razorpay') {
            $('#razorpay_payment_gateway_div').fadeIn();
            $(".hybrid_payment_gateway_div").fadeOut();
            $("#twocheckout_product_list_div").fadeOut();
            $('#twocheckout_product_list').val("");
            $('#master_razorpay_payment_gateway_div').fadeOut();
            $('#master_razorpay_split_transfer').val("");
        } else if (value == 'Masterrazorpay') {
            $('#master_razorpay_payment_gateway_div').fadeIn();
            $('#razorpay_payment_gateway_div').fadeOut();
            $(".hybrid_payment_gateway_div").fadeOut();
            $("#twocheckout_product_list_div").fadeOut();
            $('#twocheckout_product_list').val("");
        } else {
            $(".hybrid_payment_gateway_div").fadeOut();
            $("#twocheckout_product_list_div").fadeOut();
            $('#razorpay_payment_gateway_div').fadeOut();
            $('#razorpayPaymentLink').removeAttr('checked');
            $('#master_razorpay_payment_gateway_div').fadeOut();
            $('#master_razorpay_split_transfer').val("");
        }
    });

    $(document).on('change', '#colleges,#form_id,#unipe_form_id', function () {
        $("#online_email_template").html("");
        $("#online_sms_template").html("");
        $("#cash_email_template").html("");
        $("#cash_sms_template").html("");
        $("#dd_email_template").html("");
        $("#dd_sms_template").html("");
        $("#subStageDropdown").html("");

        $("#ack_receipt_template").html('<option selected="selected" value="">Select Receipt Template</option>');
        $("#online_email_template").html('<option selected="selected" value="">Select Email Template</option>');
        $("#online_sms_template").html('<option selected="selected" value="">Select SMS Template</option>');
        $("#cash_email_template").html('<option selected="selected" value="">Select Email Template</option>');
        $("#cash_sms_template").html('<option selected="selected" value="">Select SMS Template</option>');
        $("#cash_approval_email_template").html('<option selected="selected" value="">Select Email Template</option>');
        $("#cash_approval_sms_template").html('<option selected="selected" value="">Select SMS Template</option>');
        $("#dd_email_template").html('<option selected="selected" value="">Select Email Template</option>');
        $("#dd_sms_template").html('<option selected="selected" value="">Select SMS Template</option>');
        $("#dd_approval_email_template").html('<option selected="selected" value="">Select Email Template</option>');
        $("#dd_approval_sms_template").html('<option selected="selected" value="">Select SMS Template</option>');
        $("#subStageDropdown").html('<option selected="selected" value="">Select Sub Stage</option>');
        $('.chosen-select').trigger('chosen:updated');
        getTemplateList();
        $("#receipt_message_box_div").hide();
        var form_id = $('#unipe_form_id').val();
        var college_id = $('#colleges').val();
        if(($("input[name='fee_config_type'][type='radio']:checked").val() == 'unipe') && (form_id > 0)) {
            getUnipeFeeType(form_id,college_id);
        }

    });

    $("#payment_online").click(function () {
        $("#online_email_template").val('');
        $("#online_sms_template").val('');
        $('.chosen-select').trigger('chosen:updated');
    });

    $("#payment_cash").click(function () {
        $("#cash_email_template").val('');
        $("#cash_sms_template").val('');
        $("#cash_approval_email_template").val('');
        $("#cash_approval_sms_template").val('');
        $("#showOnlyToAgentsCash").attr('checked', false);
        $('.chosen-select').trigger('chosen:updated');
    });
    
    $("#payment_dd").click(function () {
        $("#dd_email_template").val('');
        $("#dd_sms_template").val('');
        $("#dd_approval_email_template").val('');
        $("#dd_approval_sms_template").val('');
        $("#showOnlyToAgentsDD").attr('checked', false);
        $('.chosen-select').trigger('chosen:updated');
    });
    
    $("#business_origin_country").change( "change",getStateList);

    showHideFeePaymentInformation();
    showHidePreferenceFeeFields();
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

    function showHidePreferenceFeeFields(){
        var selectedFeeType = $("#payment_process_type").val();
        if(selectedFeeType !=='' ){
            $("#other_payable_fees").find("option").removeAttr("disabled");
            $("#other_payable_fees").find("option[value='"+selectedFeeType+"']").attr("disabled",true);
        }else{
            $("#other_payable_fees").find("option").attr("disabled",true);
        }
        $('select#other_payable_fees')[0].sumo.reload();
        
        if($("#payment_process_type").val()=="6"){ // preference fee
            $("#fee_details_field_conatiner").show();
            $("#enable_conditional_fees_div").hide();
            $("#enable_conditional_fees").attr('checked', false);
            $("#payment_setting_table").show();
            $("#save_fee_module_config").html('<span class="glyphicon glyphicon-saved" aria-hidden="true"></span> &nbsp; Save Payment Settings');
        }else{
            $(".fee_details_field").each(function(){
                $(this).val('');
            });
            $("#fee_details_field_conatiner").hide();
        }
    }

function  getTemplateList() {
    if ($("#colleges").val() == '' ) {
        return;
    }

    var collegeId = $("#colleges").val();
    var formId = $("#form_id").val();
    var feeConfigType = $("input[name='fee_config_type'][type='radio']:checked").val();
    if (feeConfigType == 'unipe') {
        formId = $('#unipe_form_id').val();
    }
    
    if (feeConfigType == 'unipe') {
        //no change
    } else if(formId===null || formId==='' || (formId.length > 1)) {
        formId  = 0;
    } else {
        formId  = formId[0];
    }   
    
    $.ajax({
        url: '/fee-configs/get-template-list',
        type: 'post',
        dataType: 'html',
        data: {
            "collegeId": collegeId,
            "formId": formId
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data.emailTemplates === "object") {
                        var emailTemplates = responseObject.data.emailTemplates;
                        var value = '<option selected="selected" value="">Select Email Template</option>';
                        $.each(emailTemplates, function (index, item) {
                            value += '<option value="' + index + '">' + item + '</option>';
                        });
                        $('#online_email_template').html(value);
                        $('#online_email_template_unipe').html(value);
                        $('#cash_email_template').html(value);
                        $('#cash_approval_email_template').html(value);
                        $('#dd_email_template').html(value);
                        $('#dd_approval_email_template').html(value);
                    }

                    if (typeof responseObject.data.smsTemplates === "object") {
                        var smsTemplates = responseObject.data.smsTemplates;
                        var value = '<option selected="selected" value="">Select Sms Template</option>';
                        $.each(smsTemplates, function (index, item) {
                            value += '<option value="' + index + '">' + item + '</option>';
                        });
                        $('#online_sms_template').html(value);
                        $('#online_sms_template_unipe').html(value);
                        $('#cash_sms_template').html(value);
                        $('#cash_approval_sms_template').html(value);
                        $('#dd_sms_template').html(value);
                        $('#dd_approval_sms_template').html(value);
                    }

                    if (typeof responseObject.data.ackReceiptTemplates === "object") {
                        var ackReceiptTemplates = responseObject.data.ackReceiptTemplates;
                        var value = '<option selected="selected" value="">Select Receipt Template</option>';
                        $.each(ackReceiptTemplates, function (index, item) {
                            value += '<option value="' + index + '">' + item + '</option>';
                        });
                        $('#ack_receipt_template').html(value);
                        $('#ack_receipt_template_unipe').html(value);
                    }
                }
                $('.chosen-select').trigger('chosen:updated');
            } else {
                //console.log(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function showHideFeePaymentInformation(type) {

    var other_method = false;
    var online_method = false;

    $('.fee_payment_checkbox').each(function () {
        var sThisVal = (this.checked ? "1" : "0");
        if (sThisVal == "1") {
            $('#' + this.id + '_related_div').fadeIn();
            if (this.value == "Online") {
                if ($("#payment_gateway_type").val() == '') {
                    $('#twocheckout_product_list_div').fadeOut();
                    $('#twocheckout_product_list').val('');
                }
                if ($("#hybrid_payment_gateway").val() != 1) {
                    $('#tb_payment_gateway_charge').fadeIn();
                }
                if (type == "reset") {
                    $('#tb_payment_gateway_charge select, #' + this.id + '_related_div select').each(function () {
                        $(this).val($(this).find(':first-child').val());
                    });
                }
                if (type == "default") {
                    $('#tb_payment_gateway_charge select').each(function () {
                        $(this).val($(this).find(':first-child').val());
                    });
                    changeSelectValue();
                    calculateAmount();
                }
                online_method = true;
            } else {
                other_method = true;
            }

        } else {
            $('#' + this.id + '_related_div').fadeOut();
            $('#' + this.id + '_related_div input, #' + this.id + '_related_div textarea, #' + this.id + '_related_div select').val("");

            if (this.value == "Online") {
                $('#tb_payment_gateway_charge').fadeOut();
                $('#tb_payment_gateway_charge input, #tb_payment_gateway_charge select').val("");

            }
        }
    });

    if (online_method == true) {
        $('.online_amount').fadeIn();
    } else {
        $('.online_amount').fadeOut();
    }

    if (other_method == true) {
        $('.other_amount').fadeIn();
    } else {
        $('.other_amount').fadeOut();
    }

    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    $('.chosen-select').trigger('chosen:updated');
}

function getAllFormList(cid, default_val, multiselect) {
    if (typeof default_val == 'undefined') {
        default_val = '';
    }
    if (typeof multiselect == 'undefined') {
        multiselect = '';
    }

    if (cid == '' || cid == '0') {
        $("#formListDiv").html("<select name='form_id' id='form_id'  class='chosen-select' ><option value='0'>Form</option></select>");
        $("#unipeformListDiv").html("<select name='form_id' id='unipe_form_id'  class='chosen-select' ><option value='0'>Form</option></select>");
        $("#condition_fd_field").html("<option value=''>Select Field</option>");
        $("#fee_details_fd_field").html("<option value=''>Select Field</option>");
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
            "multiselect": multiselect
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
                $("#unipeformListDiv").html(json)
                $('#form_id').on('change', getAllDropdown);
                $('#form_id').attr('multiple', 'multiple');
                $('#form_id').attr('name', 'form_id[]');
                $('#form_id').removeClass('chosen-select');
                $('#form_id').find("option[value='0']").remove();
                
                // unipe form id
                
                
                   $('select#form_id').SumoSelect({placeholder: 'Form', search: true, searchText:'search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
                    $('select#form_id').SumoSelect({placeholder: 'Form', search: true, searchText:'search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
                  
                 
               
                $("#form_id").change(function () {
                    $("#ack_receipt_template").html('<option selected="selected" value="">Select Receipt Template</option>');
                    $("#online_email_template").html('<option selected="selected" value="">Select Email Template</option>');
                    $("#online_sms_template").html('<option selected="selected" value="">Select SMS Template</option>');
                    $("#cash_email_template").html('<option selected="selected" value="">Select Email Template</option>');
                    $("#cash_sms_template").html('<option selected="selected" value="">Select SMS Template</option>');
                    $("#dd_email_template").html('<option selected="selected" value="">Select Email Template</option>');
                    $("#dd_sms_template").html('<option selected="selected" value="">Select SMS Template</option>');
                    $('.chosen-select').trigger('chosen:updated');
                    //getTemplateList();
                    $("#receipt_message_box_div").hide();
                });
                
                $("#unipeformListDiv").find('#form_id').attr('id','unipe_form_id')
                $("#unipeformListDiv").find('#unipe_form_id').attr('name','unipe_form_id[]')
                $('#unipe_form_id').removeClass('chosen-select');
                $('#unipe_form_id').SumoSelect({placeholder: 'Form', search: true, searchText:'search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
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
        url: '/fee-configs/get-all-payment-gateway',
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
            var response = $.parseJSON(json);
            if (response == 'session') {
                window.location.reload(true);
            } else if (response == 'invalid_request') {
                alertPopup('Invalid Request', 'error');
                return;
            } else {
                var value = '<option selected="selected" value="">Select Payment Gateway</option>';
                $.each(response.data, function (index, item) {
                    value += '<option value="' + index + '">' + item + '</option>';
                });
                $("#payment_gateway_type").html(value);
                
                if ($('div#master_razorpay_payment_gateway_div').length > 0) {
                    if (response.masterRazorpayMerchantDetailsList != '') {
                        $('select#master_razorpay_merchant_id').html(response.masterRazorpayMerchantDetailsList);
                    }
                    if (response.masterRazorpaySplitTransferDetails != '') {
                        $('select#master_razorpay_split_transfer').html(response.masterRazorpaySplitTransferDetails);
                    }
                }
                
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
function validateUnipeFeeData(){
    $('.error').hide();
    var error = false;
    if ($("#colleges").val() == "") {
        $('#college_id_error').html("Field is required.");
        $('#college_id_error').show();
        error = true;
    }
    
    if ($("#unipe_form_id").val() == 0 || $("#unipe_form_id").val() == null) {
        $('#unipe_form_id_error').html("Field is required.");
        $('#unipe_form_id_error').show();
        error = true;
    }
    
    if ($("#unipe_payment_process_type").val() == 0 || $("#unipe_payment_process_type").val() == null) {
        $('#error_unipe_payment_process_type').html("Field is required.");
        $('#error_unipe_payment_process_type').show();
        error = true;
    }
    
    if ($("#online_email_template_unipe").val() == 0 || $("#online_email_template_unipe").val() == null) {
        $('#error_online_email_template_unipe').html("Field is required.");
        $('#error_online_email_template_unipe').show();
        error = true;
    }
    if ($("#online_sms_template_unipe").val() == 0 || $("#online_sms_template_unipe").val() == null) {
        $('#error_online_sms_template_unipe').html("Field is required.");
        $('#error_online_sms_template_unipe').show();
        error = true;
    }
    
    if ($("#ack_receipt_template_unipe").val() == "") {
        $('#ack_receipt_template_unipe_validation').html("Field is required.");
        $('#ack_receipt_template_unipe_validation').show();
        error = true;
    } else if($("#ack_receipt_template_unipe").val() == '0') {
        if ($("#receipt_message_box_unipe").val() == "") {
            $('#receipt_message_box_unipe_error').html("Field is required.");
            $('#receipt_message_box_unipe_error').show();
            error = true;
        }
    }
    if (error == false) {
        return true;
    } else {
        $('html, body').animate({
            scrollTop: $("#error_anchor").offset().top
        }, 1000);
        return false;
    }
}
function validateFeeData() {
    $('.error').hide();
    var payment_method = false;
    var error = false;
    $('.fee_payment_checkbox').each(function () {
        var sThisVal = (this.checked ? "1" : "0");
        if (sThisVal == "1") {
            payment_method = true;
        }
    });
    
    if ($("#colleges").val() == "") {
        $('#college_id_error').html("Field is required.");
        $('#college_id_error').show();
        error = true;
    }
    
    if (payment_method == false) {
        $('#error_payment_method').html("Field is required.");
        $('#error_payment_method').show();
        error = true;
    }

    if ($("#payment_process_type").val() == "") {
        $('#error_payment_process_type').html("Field is required.");
        $('#error_payment_process_type').show();
        error = true;
    }else if($("#payment_process_type").val() == "6" ){ // preference fee
        
        if ($("#fee_details_fd_field").val() == "" || $("#fee_details_fd_field").val() == 0) {
            $('#fee_details_fd_field_validation').html("Field is required.");
            $('#fee_details_fd_field_validation').show();
            error = true;
        }
        
        if ($("#fee_details_free_allowed").val() === "") {
            $('#fee_details_free_allowed_error').html("Field is required.");
            $('#fee_details_free_allowed_error').show();
            error = true;
        }else if( !$.isNumeric($("#fee_details_free_allowed").val()) ){
            $('#fee_details_free_allowed_error').html("Only numeric value allowed.");
            $('#fee_details_free_allowed_error').show();
            error = true;
        }
        
//        if ($("#fee_details_max_allowed").val() === "") {
//            $('#fee_details_max_allowed_error').html("Field is required.");
//            $('#fee_details_max_allowed_error').show();
//            error = true;
//        }else if( !$.isNumeric($("#fee_details_max_allowed").val()) ){
//            $('#fee_details_max_allowed_error').html("Only numeric value allowed.");
//            $('#fee_details_max_allowed_error').show();
//            error = true;
//        }
    }
        
    if ($("#max_payments_allowed").val() === "") {
        $('#max_payments_allowed_error').html("Field is required.");
        $('#max_payments_allowed_error').show();
        error = true;
    }else if( !$.isNumeric($("#max_payments_allowed").val()) ){
        $('#max_payments_allowed_error').html("Only numeric value allowed.");
        $('#max_payments_allowed_error').show();
        error = true;
    }

    if ($('#payment_dd:checked').val() == "DD" && $("#dd_related_info").val() == "") {
        $('#error_dd_related_info').html("Field is required.");
        $('#error_dd_related_info').show();
        error = true;
    }
    if ($('#payment_cash:checked').val() == "Cash") {
        if ($("#cash_related_info").val() == "") {
            $('#error_cash_related_info').html("Field is required.");
            $('#error_cash_related_info').show();
            error = true;
        }
        if(!$('#showOnlyToAgentsCash').is(':checked')){
            if ($("#cash_email_template").val() == "") {
                $('#error_cash_email_template').html("Field is required.");
                $('#error_cash_email_template').show();
                error = true;
            }
            if ($("#cash_sms_template").val() == "") {
                $('#error_cash_sms_template').html("Field is required.");
                $('#error_cash_sms_template').show();
                error = true;
            }
            if ($("#cash_approval_email_template").val() == "") {
                $('#error_cash_approval_email_template').html("Field is required.");
                $('#error_cash_approval_email_template').show();
                error = true;
            }
            if ($("#cash_approval_sms_template").val() == "") {
                $('#error_cash_approval_sms_template').html("Field is required.");
                $('#error_cash_approval_sms_template').show();
                error = true;
            }
        }
    }
    
    if ($('#payment_dd:checked').val() == "DD") {
        if ($("#dd_related_info").val() == "") {
            $('#error_dd_related_info').html("Field is required.");
            $('#error_dd_related_info').show();
            error = true;
        }
        if(!$('#showOnlyToAgentsDD').is(':checked')){
            if ($("#dd_email_template").val() == "") {
                $('#error_dd_email_template').html("Field is required.");
                $('#error_dd_email_template').show();
                error = true;
            }
            if ($("#dd_sms_template").val() == "") {
                $('#error_dd_sms_template').html("Field is required.");
                $('#error_dd_sms_template').show();
                error = true;
            }
            if ($("#dd_approval_email_template").val() == "") {
                $('#error_dd_approval_email_template').html("Field is required.");
                $('#error_dd_approval_email_template').show();
                error = true;
            }
            if ($("#dd_approval_sms_template").val() == "") {
                $('#error_dd_approval_sms_template').html("Field is required.");
                $('#error_dd_approval_sms_template').show();
                error = true;
            }
        }
    }

    if ($('#payment_online:checked').val() == "Online") {
        if ($("#payment_gateway_type").val() == "") {
            $('#error_payment_gateway_type').html("Field is required.");
            $('#error_payment_gateway_type').show();
            error = true;
        } else if (($("#payment_gateway_type").val() == "Twocheckout") && ($("#twocheckout_product_list").val() == "")) {
            $('#error_twocheckout_product_list').html("Field is required.");
            $('#error_twocheckout_product_list').show();
            error = true;
        }
        if ($("#online_email_template").val() == "") {
            $('#error_online_email_template').html("Field is required.");
            $('#error_online_email_template').show();
            error = true;
        }
        if ($("#online_sms_template").val() == "") {
            $('#error_online_sms_template').html("Field is required.");
            $('#error_online_sms_template').show();
            error = true;
        }
    }

    if ($("#payment_start_date").val() == "") {
        $('#payment_start_date_validation').html("Field is required.");
        $('#payment_start_date_validation').show();
        error = true;
    }
    if ($("#payment_end_date").val() == "") {
        $('#payment_end_date_validation').html("Field is required.");
        $('#payment_end_date_validation').show();
        error = true;
    }
    
    if($("#enable_conditional_fees").is(":not(:checked)")){
        if ($("#base_fee_amt_value").val() == "" || $("#base_fee_amt_value").val() == 0) {
            if($("#colleges").val()!=="4000"){
                $('#error_base_fee_amt_value').html("Required");
                $('#error_base_fee_amt_value').show();
                error = true;
            }
        }
    }
    
    if ($("#ack_receipt_template").val() == "") {
        $('#ack_receipt_template_validation').html("Field is required.");
        $('#ack_receipt_template_validation').show();
        error = true;
    } else if($("#ack_receipt_template").val() == '0') {
        if ($("#receipt_message_box").val() == "") {
            $('#receipt_message_box_error').html("Field is required.");
            $('#receipt_message_box_error').show();
            error = true;
        }
    }
    if( ($("#base_fee_gst_breakup").length && $("#base_fee_gst_breakup").is(":checked")) || 
            ($("#npf_surcharge_gst_breakup").length && $("#npf_surcharge_gst_breakup").is(":checked")) || 
            ( $("#payment_gateway_gst_breakup").length && $("#payment_gateway_gst_breakup").is(":checked")) ){
        
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

    if( $("#condition_fd_field").val()!="0" && $("#condition_fd_field").val()!="" && $("#condition_fd_field").val()!=null ){
        if($("#condition_fd_field_value").val()=="" || $("#condition_fd_field_value").val()=="0" || $("#condition_fd_field_value").val()==null){
            $('#condition_fd_field_value_validation').html("Please select a field value.");
            $('#condition_fd_field_value_validation').show();
            error=true;
        }
    }
    
    if( ($("#allow_minimum_payment").length && $("#allow_minimum_payment").is(":checked")) ){
        
        if($("#total_token_amount").val() !=='' && !$.isNumeric($("#total_token_amount").val())){
            $('#total_token_amount_validation').html("Enter valid amount.");
            $('#total_token_amount_validation').show();
            error=true;
        }
        if($("#total_token_amount").val()!== '' && $("#enable_conditional_fees").is(":checked")) {
            $('#total_token_amount_validation').html("Total token amount is not allowed with conditional fees");
            $('#total_token_amount_validation').show();
            error=true;
        }
        if($("#total_token_amount").val()!== '' && $("#other_payable_fees").val() !== null) {
            $('#total_token_amount_validation').html("Total token amount is not allowed with other fees");
            $('#total_token_amount_validation').show();
            error=true;
        }
    }
    
    if(error === false && $("#total_token_amount").val()!== ''){
        if(parseFloat($("#base_fee_amt_value").val()) > parseFloat($("#total_token_amount").val())) {
            $('#total_token_amount_validation').html("Total token amount must be greater than base amount");
            $('#total_token_amount_validation').show();
            error=true;
        }
    }
        

    if (error == false) {
        return true;
    } else {
        $('html, body').animate({
            scrollTop: $("#error_anchor").offset().top
        }, 1000);
        return false;
    }
}

function saveFeeModuleConfig(urls) {
    
    if($("input[name='fee_config_type'][type='radio']:checked").val() == 'npf'){
        if (validateFeeData() == false) {
            return;
        }
    }else{
        if (validateUnipeFeeData() == false) {
            return;
        }
    }
    
    
    if(($("#condition_fd_field").val()=="" || $("#condition_fd_field").val()=="0" || $("#condition_fd_field").val()==null) && 
       ($("#condition_fd_field_value").val()!="" && $("#condition_fd_field_value").val()!="0" && $("#condition_fd_field_value").val()!=null)){
        $('#condition_fd_field_validation').html("Please select a conditional field.");
        $('#condition_fd_field_validation').show();
        return false;
    } else {
        $('#condition_fd_field_validation').hide();
    }
    //make buttun disable
    var data = [];
    data = $('#fee_module_config').serializeArray();
    data.push({name: 'instruction', value: CKEDITOR.instances['editor'].getData()});
    data.push({name: 'urlParams', value: urls});
    //data.push({name:'status',value:'2'});
    if ($('#showOnlyToAgentsCash').is(':checked')) {
        data.push({name: 'showOnlyToAgentsCash', value: 1});
    } else {
        data.push({name: 'showOnlyToAgentsCash', value: 0});
    }
    
    if ($('#showOnlyToAgentsDD').is(':checked')) {
        data.push({name: 'showOnlyToAgentsDD', value: 1});
    } else {
        data.push({name: 'showOnlyToAgentsDD', value: 0});
    }
    if($(this).is(':enabled')) { 
        // Do enabled radio button code here 
    }
    else {
        // Do disabled radio button code here
    }
    if(!$("input[name='fee_config_type'][type='radio']").is(':enabled')){
        data.push({name: 'fee_config_type', value: $("input[name='fee_config_type'][type='radio']:checked").val()});
        data.push({name: 'unipe_payment_process_type', value: $("#unipe_payment_process_type").val()});
        if($("input[name='fee_config_type'][type='radio']:checked").val() == 'unipe'){
            data.push({name: 'unipe_form_id', value: $("#unipe_form_id").val()});
        }
    }
    if($("input[name='fee_config_type'][type='radio']:checked").val() == 'npf'){
        $("#unipe_form_id").attr('disabled',true);
    }
    if($("input[name='fee_config_type'][type='radio']:checked").val() == 'unipe'){
        var selectedText = $("#unipe_payment_process_type").find("option:selected").text();
        data.push({name: 'fee_name', value: selectedText});
        
    }
    
    
    $.ajax({
        url: jsVars.saveFeeConfigLink,
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
                if( typeof responseObject.redirectURL!=="undefined" ){
                    location = responseObject.redirectURL;
                }else{
                    $('#alert_msg').html("<i class='fa fa-check'></i>&nbsp;Fee configuration successfully saved.");
                    if(typeof responseObject.data!=="undefined" && typeof responseObject.data.urlParams!=="undefined"){
                        location = jsVars.feeModule+"/"+responseObject.data.urlParams;
                    }else{
                        location = jsVars.feeModule;
                    }
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

function getAllDropdown() {
    var formId  = $("#form_id").val();
    if(formId===null || formId===''|| formId.length>1){
        $(".fee_details_field").each(function(){
            $(this).val('');
        });
        $("#condition_fd_field").html("<option value=''>Select Field</option>");
        $("#condition_fd_field").trigger('chosen:updated');
        $("#condition_fd_field_value").html("<option value=''>Select Field Value</option>");
        $("#condition_fd_field_value").trigger('chosen:updated');
        $("#fee_details_fd_field").html("<option value=''>Select Field</option>");
        $("#fee_details_fd_field").trigger('chosen:updated');
        $('.chosen-select').trigger('chosen:updated');
        $("#enable_conditional_fees").attr('checked', false);
        $("#payment_setting_table").show();
        $("#save_fee_module_config").html('<span class="glyphicon glyphicon-saved" aria-hidden="true"></span> &nbsp; Save Payment Settings');
        $("#enable_conditional_fees_div").hide();
        
        return;
    }
    
    if(formId.length==1) {
        $("#enable_conditional_fees_div").show();
    }
    
    if($("#payment_process_type").val()=="6"){ // preference fee
        $("#enable_conditional_fees_div").hide();
        $("#enable_conditional_fees").attr('checked', false);
        $("#payment_setting_table").show();
        $("#save_fee_module_config").html('<span class="glyphicon glyphicon-saved" aria-hidden="true"></span> &nbsp; Save Payment Settings');
    }
    
    $.ajax({
        url: '/fee-configs/get-all-dropdown',
        type: 'post',
        dataType: 'json',
        data: {
            "formId": formId[0]
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            if (typeof json['redirect'] !== 'undefined') {
                window.location(json['redirect']);
            }
            $('#condition_fd_field').html(json['optionList']);
            $('#fee_details_fd_field').html(json['optionList']);
            $("#condition_fd_field").trigger('chosen:updated');
            $("#fee_details_fd_field").trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getDropdownValueList() {
    var value   = $("#condition_fd_field").val();
    if (value == '' || value == '0') {
        $("#condition_fd_field_value").html("<option value=''>Select Field Value</option>");
        $('#condition_fd_field_value').trigger('chosen:updated');
        return false;
    }
    $("#subStageDropdownDiv").hide();
    $("#subStageDropdown").html("");
    $.ajax({
        url: '/voucher/get-dropdown-value-list',
        type: 'post',
        dataType: 'json',
        data: {
            "value": value
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            if (typeof json['redirect'] !== 'undefined') {
                window.location(json['redirect']);
            }
            $("#subStageDropdownDiv").hide();
            $("#subStageDropdown").html("");
            $('#condition_fd_field_value').html(json['optionList']);
            $('#condition_fd_field_value').trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$('#OkBtn').on('click', function () {
    $("#SuccessPopupArea .npf-close").trigger('click');
});

function bindAfterAjaxCall() {
    $("#payment_setting_table input, #payment_setting_table select").change(function () {
        changeSelectValue();
        calculateAmount();
    });

    $("#payment_setting_table input").change(function () {
        if(this.value!=""){
            if ($.isNumeric(this.value)) {
                // do nothing
            } else {
                $(this).val("0");
                calculateAmount();
            }
        }
    });
}

var paidBy = "paid_by";
var amount_type = "amt_type";
var amountValue = "amt_value";
var amountShow = "amt_show";
var net_amount = 0;
var other_amount = 0;
var online_amount = 0;

// if base fee amount type if final_amount then npf_surcharge and payment_gateway surcharge is paid by institute. 
function changeSelectValue() {
    if ($('#base_fee_' + amount_type).val() == "final_amount") {
        $('#npf_surcharge_paid_by, #payment_gateway_paid_by').val("institute");

    }
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
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
            ( $("#payment_gateway_gst_breakup").length && $("#payment_gateway_gst_breakup").is(":checked")) ){
        
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
function calculateOnBaseAmount() {
    var base_fee = parseFloat($('#base_fee_' + amountValue).val());

    if (isNaN(base_fee)) {
        return false;
    }
    net_amount = other_amount = online_amount = parseFloat(base_fee.toFixed(2));
    $('#base_fee_' + amountShow).val(net_amount);
    $('#base_fee_other_' + amountShow).val(net_amount);
    
    tax_on_base_fee = 0;
    
    resetGSTBreakup();

    // base fee gst calulcation
    if ($('#base_fee_gst_' + amountValue).val() != "") {

        var base_fee_gst = parseFloat($('#base_fee_gst_' + amountValue).val());
        if ($('#base_fee_' + amount_type).val() == "final_amount") {
            tax_on_base_fee = base_fee - ((base_fee * 100) / (100 + base_fee_gst));
        } else {
            tax_on_base_fee = (base_fee_gst / 100) * base_fee;
        }
        tax_on_base_fee  = parseFloat(tax_on_base_fee.toFixed(2));


        $('#base_fee_gst_' + amountShow).val(tax_on_base_fee);
        $('#base_fee_gst_other_' + amountShow).val(tax_on_base_fee);
        online_amount = other_amount = other_amount + tax_on_base_fee;
            
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
    if ($('#npf_surcharge_' + amountValue).val() != "") {
        var npf_surcharge = parseFloat($('#npf_surcharge_' + amountValue).val());

        if ($('#npf_surcharge_' + amount_type).val() == "fixed") {
            npf_surcharge_amount = npf_surcharge;

        } else {
            npf_surcharge_amount = ((npf_surcharge * (base_fee + tax_on_base_fee)) / 100);
        }
        npf_surcharge_amount_show   = parseFloat(npf_surcharge_amount.toFixed(2));
        $('#npf_surcharge_' + amountShow).val(npf_surcharge_amount_show);
        $('#npf_surcharge_other_' + amountShow).val(npf_surcharge_amount_show);


        npf_surcharge_gst_amount = 0;
        if ($('#npf_surcharge_gst_' + amountValue).val() != "") {
            var npf_surcharge_gst = parseFloat($('#npf_surcharge_gst_' + amountValue).val());
            npf_surcharge_gst_amount    = parseFloat(((npf_surcharge_gst*npf_surcharge_amount)/100).toFixed(2));
            $('#npf_surcharge_gst_' + amountShow).val(npf_surcharge_gst_amount);
            $('#npf_surcharge_gst_other_' + amountShow).val(npf_surcharge_gst_amount);
        
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


        if ($('#npf_surcharge_' + paidBy).val() == "applicant") {
            online_amount = other_amount = other_amount + npf_surcharge_amount + npf_surcharge_gst_amount;
        }

    }



    if ($('#payment_gateway_' + amountValue).val() != "") {
        var payment_gateway = parseFloat($('#payment_gateway_' + amountValue).val());

        if ($('#payment_gateway_' + amount_type).val() == "fixed") {
            payment_gateway_amount = payment_gateway;

        } else {
            payment_gateway_amount = ((payment_gateway * online_amount) / 100);
            //payment_gateway_amount=((payment_gateway*base_fee)/100);
        }

        payment_gateway_amount_show = parseFloat(payment_gateway_amount.toFixed(2));
        $('#payment_gateway_' + amountShow).val(payment_gateway_amount_show);

        payment_gateway_gst_amount = 0;
        if ($('#payment_gateway_gst_' + amountValue).val() != "") {
            var payment_gateway_gst = parseFloat($('#payment_gateway_gst_' + amountValue).val());
            payment_gateway_gst_amount  = parseFloat(((payment_gateway_gst*payment_gateway_amount)/100).toFixed(2));

            $('#payment_gateway_gst_' + amountShow).val(payment_gateway_gst_amount);
        
            if( $("#payment_gateway_gst_breakup").length && $("#payment_gateway_gst_breakup").is(":checked") ){
                $('#payment_gateway_igst_'+amountValue).val(payment_gateway_gst);
                $('#payment_gateway_cgst_'+amountValue).val((payment_gateway_gst/2).toFixed(2));
                $('#payment_gateway_sgst_'+amountValue).val((payment_gateway_gst/2).toFixed(2));
                
                $('#payment_gateway_igst_'+amountShow).val(payment_gateway_gst_amount);
                $('#payment_gateway_cgst_'+amountShow).val(parseFloat(payment_gateway_gst_amount/2).toFixed(2));
                $('#payment_gateway_sgst_'+amountShow).val(parseFloat(payment_gateway_gst_amount/2).toFixed(2));
            }
        }

        if ($('#payment_gateway_' + paidBy).val() == "applicant") {
            online_amount = other_amount + payment_gateway_amount + payment_gateway_gst_amount;
        }
    }

    $('#other_amount_' + amountShow).val(other_amount.toFixed(2));
    $('#online_amount_' + amountShow).val(online_amount.toFixed(2));

}


function calculateOnFinalAmount() {

    var base_fee = parseFloat($('#base_fee_' + amountValue).val());

    final_fee = other_amount = online_amount = base_fee;
    $('#base_fee_' + amountShow).val(net_amount.toFixed(2));
    $('#base_fee_other_' + amountShow).val(net_amount.toFixed(2));
    payment_gateway = payment_gateway_gst = 0;
    
    resetGSTBreakup();

    //calulate npf_surcharge and npf_surcharge_gst
    if ($('#npf_surcharge_' + amountValue).val() != "") {
        var npf_surcharge = parseFloat($('#npf_surcharge_' + amountValue).val());

        if ($('#npf_surcharge_' + amount_type).val() == "fixed") {
            npf_surcharge_amount = npf_surcharge;
        } else {
            npf_surcharge_amount = ((npf_surcharge * base_fee) / 100);
        }

        $('#npf_surcharge_' + amountShow).val(npf_surcharge_amount.toFixed(2));
        $('#npf_surcharge_other_' + amountShow).val(npf_surcharge_amount.toFixed(2));

        npf_surcharge_gst_amount = 0;
        if ($('#npf_surcharge_gst_' + amountValue).val() != "") {
            var npf_surcharge_gst = parseFloat($('#npf_surcharge_gst_' + amountValue).val());
            npf_surcharge_gst_amount = ((npf_surcharge_gst * npf_surcharge_amount) / 100);
            $('#npf_surcharge_gst_' + amountShow).val(npf_surcharge_gst_amount.toFixed(2));
            $('#npf_surcharge_gst_other_' + amountShow).val(npf_surcharge_gst_amount.toFixed(2));
        
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
    if ($('#payment_gateway_' + amountValue).val() != "") {
        var payment_gateway = parseFloat($('#payment_gateway_' + amountValue).val());

        if ($('#payment_gateway_gst_' + amountValue).val() != "") {
            var payment_gateway_gst = parseFloat($('#payment_gateway_gst_' + amountValue).val());
        }

        // formula is = x + (2%of x) + 18% of (2% of x) = 100;
        if ($('#payment_gateway_' + amount_type).val() == "fixed") {
            base_fee_ex_gateway = (final_fee - payment_gateway) - (payment_gateway_gst * payment_gateway) / 100;
        } else {
            base_fee_ex_gateway = (final_fee * 100 * 100) / (10000 + (payment_gateway * 100) + (payment_gateway * payment_gateway_gst));
        }

        if ($('#payment_gateway_' + amount_type).val() == "fixed") {
            payment_gateway_amount = payment_gateway;
        } else {
            payment_gateway_amount = ((payment_gateway * base_fee_ex_gateway) / 100);
        }

        $('#payment_gateway_' + amountShow).val(payment_gateway_amount.toFixed(2));

        payment_gateway_gst_amount = 0;
        if ($('#payment_gateway_gst_' + amountValue).val() != "") {
            var payment_gateway_gst = parseFloat($('#payment_gateway_gst_' + amountValue).val());
            payment_gateway_gst_amount = ((payment_gateway_gst * payment_gateway_amount) / 100);
            $('#payment_gateway_gst_' + amountShow).val(payment_gateway_gst_amount.toFixed(2));
        
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


    base_fee_gst = npf_surcharge_amount_show = npf_surcharge_gst_amount_show = payment_gateway_amount_show = payment_gateway_gst_amount_show = 0;

    if ($('#base_fee_gst_' + amountValue).val() != "") {
        base_fee_gst = parseFloat($('#base_fee_gst_' + amountValue).val());
    }

    if ($('#npf_surcharge_' + amountShow).val() != "") {
        npf_surcharge_amount_show = $('#npf_surcharge_' + amountShow).val();
    }
    if ($('#npf_surcharge_gst_' + amountShow).val() != "") {
        npf_surcharge_gst_amount_show = $('#npf_surcharge_gst_' + amountShow).val();
    }

    if ($('#payment_gateway_' + amountShow).val() != "") {
        payment_gateway_amount_show = $('#payment_gateway_' + amountShow).val();
    }
    if ($('#payment_gateway_gst_' + amountShow).val() != "") {
        payment_gateway_gst_amount_show = $('#payment_gateway_gst_' + amountShow).val();
    }

    other_base_fee = final_fee - parseFloat(npf_surcharge_amount_show) - parseFloat(npf_surcharge_gst_amount_show);
    online_base_fee = other_base_fee - parseFloat(payment_gateway_amount_show) - parseFloat(payment_gateway_gst_amount_show);

    tax_on_online_base_fee = online_base_fee - ((online_base_fee * 100) / (100 + base_fee_gst));
    tax_on_other_base_fee = other_base_fee - ((other_base_fee * 100) / (100 + base_fee_gst));

    $('#base_fee_gst_' + amountShow).val(tax_on_online_base_fee.toFixed(2));
    $('#base_fee_gst_other_' + amountShow).val(tax_on_other_base_fee.toFixed(2));
        
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

    $('#base_fee_' + amountShow).val((online_base_fee - tax_on_online_base_fee).toFixed(2));
    $('#base_fee_other_' + amountShow).val((other_base_fee - tax_on_other_base_fee).toFixed(2));

    $('#other_amount_' + amountShow).val(final_fee.toFixed(2));
    $('#online_amount_' + amountShow).val(final_fee.toFixed(2));

}

function calculateAmount() {
    //if($('#base_fee_'+amountValue).val()!=""){
    if ($('#base_fee_' + amount_type).val() == "base_amount") {
        calculateOnBaseAmount();
    } else if ($('#base_fee_' + amount_type).val() == "final_amount") {
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

/*
 * #application sub stage
 * Function to get sub dropdown value for if field block
 */
function loadOptionDropDownValue(thisEvent) {
    var ifFieldOption = $("#fee_module_config select[name='condition_fd_field'] option:selected");
    var ifSelectedValue = ifFieldOption.val();
    var isApplicationStageSelected = ifSelectedValue.startsWith("custom||application_stage");
    
    //write ajax code for get sub-stages
    if(isApplicationStageSelected) {
        var applicationStageId = thisEvent.value;
        var formId = $("#fee_module_config #form_id").val();
        $.ajax({
            url: '/common/getLeadSubStages',
            type: 'post',
            data: {
                'formId': formId[0],
                'stageId': applicationStageId,
                //'collegeId':jsVars.college_id
            },
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $("#subStageDropdownDiv").show();
                $("#subStageDropdown").html("");
            },
            success: function (response) { 
                if(response.substring(2, 7) == "Error") {
                    obj = JSON.parse(response);
                    if (obj.Error === 'session'){
                        location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                    }else {
                        alert(obj.Error);
                    }                
                }else{
                    obj = JSON.parse(response);
                    if(obj.subStageList) {
                        var selectHtml = '';
                        selectHtml += '<option value="0">Select Sub Stage</option>';
                        $.each(obj.subStageList, function(key, value){
                            selectHtml += "<option value='"+key+"'>"+value+"</option>";
                        });
                        $("#subStageDropdown").html(selectHtml);
						$('.chosen-select').chosen();
						$('.chosen-select-deselect').chosen({allow_single_deselect: true});
						$('.chosen-select').trigger('chosen:updated');
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}


$("input[name='fee_config_type'][type='radio']").click(function(){
    var fee_config_type = $(this).val();
    if(fee_config_type=='unipe'){
        $('.npf_config_section').hide()
        $('.unipe_config_section').show()
//        $('#payment_process_type,#fee_details_fd_field,#fee_details_free_allowed,#vendor_id,#vendor_product_id,input[name="fee_name"],#other_payable_fees,#currency_type,#condition_fd_field,#condition_fd_field_value,#payment_after_payment_approved,#payment_after_payment_approved,#enable_dicount_coupon,#max_payments_allowed,#InstructionArea,#business_origin_country_div').closest('.formAreaCols').hide()
    }else{
        $('.npf_config_section').show();
        $('.unipe_config_section').hide()
    }
});

if($("input[name='fee_config_type'][type='radio']:checked").val() == 'unipe'){
    form_id = $('#unipe_form_id').val();
    college_id = $('#colleges').val();
    unipe_fee_id = $("#unipe_fee_type").val();
    
    getUnipeFeeType(form_id,college_id,unipe_fee_id);
    
    if(unipe_fee_id){
        var element = $("#unipe_payment_process_type").find('option:selected'); 
        var allow_minimum_payment = element.attr("allow_minimum_payment");
        var max_payments_allowed = element.attr("max_payments_allowed");
        var payment_start_date = element.attr("payment_start_date");
        var payment_end_date = element.attr("payment_end_date");
        $('#unipe_allow_minimum_payment').val(allow_minimum_payment);
        $('#unipe_max_payments_allowed').val(max_payments_allowed);
        $('#payment_start_date').val(payment_start_date);
        $('#payment_end_date').val(payment_end_date);
        $("#unipe_payment_process_type").attr('disabled',true);
        $("#unipe_form_id").attr('disabled',true);
    }
}
function getUnipeFeeType(form_id,college_id,unipe_fee_id = ''){
    $.ajax({
        url: '/fee-configs/get-unipe-fees',
        type: 'post',
        dataType: 'html',
        async: false,
        data: {
            "form_id": form_id,
            "college_id":college_id,
            "unipe_fee_id":unipe_fee_id
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#listloader').show();
            window.scrollTo(0, 0);
        },
        complete: function () {
            $('#listloader').hide();
            //$('#showExamScheduleList').html('');
        },
        success: function (html) {
            $('#unipe_payment_process_type').html(html);
            //$('.div_load_forms').html(data);

            //$('#form_id').on('change', getAllDropdown);
            $('select#unipe_payment_process_type').trigger('chosen:updated');
//                    if(html){
//                        $("#payment_"+formId).html(html)
//                    }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$(document).on('change', '#unipe_payment_process_type', function () {
    if (this.value != "") {
        var element = $(this).find('option:selected');
        var allow_minimum_payment = element.attr("allow_minimum_payment");
        var max_payments_allowed = element.attr("max_payments_allowed");
        var payment_start_date = element.attr("payment_start_date");
        var payment_end_date = element.attr("payment_end_date");
        $('#unipe_allow_minimum_payment').val(allow_minimum_payment);
        $('#unipe_max_payments_allowed').val(max_payments_allowed);
        $('#payment_start_date').val(payment_start_date);
        $('#payment_end_date').val(payment_end_date);
    }
});


