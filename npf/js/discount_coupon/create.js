(function () { /* self invoking function for prevent conflict */
    jQuery(function(){
        /* discount goal*/
        $("input[name='goal_type'][type='radio']").click(function(){
            var goal_val = $(this).val();
            if(goal_val==1){
                $('#goal_type_yes_text').show();
                $('#goal_buffer,#goal').val('');
            }else{
                $('#goal_type_yes_text').hide();
                $('#goal_buffer,#goal').val('');
            }
        });
        /* can be use multiple times */
        $("input[name='is_multi_user'][type='radio']").click(function(){
            var multi_val = $(this).val();
            if(multi_val==1){
                $('#use_multi_text').show();
            }else{
                $('#use_multi_text').hide();
                $('#usage_limit').val('');
            }
        });
        
        /* Import mode */
        $("input[name='import_mode'][type='radio']").click(function(){
            var import_val = $(this).val();
            if(import_val=='csv'){
                $('#csv').show();
                $('#manual').hide();
                $('#agent').show();
                $('#upload_csv_type').show();
                $('input[type=radio][name=upload_csv_type]').attr("disabled",false);
            }else{
                $('#csv').hide();
                $('#manual').show();
                $('#agent').hide();
                $('#upload_csv_type').hide();
                $('input[type=radio][name=upload_csv_type]').attr("disabled",true);
            }
        });
        
        /* refresh date */
        $("#refreshDate").click(function(){
            $('#couponExpiryDate').data("DateTimePicker").clear();
        });
        
        
         $("#submitbuttonpopup").click(function(){
             $("#createDiscount").submit();
         })
        
        $("#submitbutton").click(function(){
            
            var fd = new FormData();
            var file_data = $('input[type="file"]')[0].files; // for multiple files
            for(var i = 0;i<file_data.length;i++){
                fd.append("file_"+i, file_data[i]);
            }

            var other_data = $('form').serializeArray();
            $.each(other_data,function(key,input){
                fd.append(input.name,input.value);
            });
            $(".requiredError, span.error").html('');
            $.ajax({
                url: '/discount_coupons/couponAjax',
                type: 'post',
                data: fd,
                dataType: 'json',
                async : false,
                cache : false,
                contentType: false,                
                processData: false,
                headers: {
                    "X-CSRF-Token": jsVars._csrfToken
                },
                beforeSend: function () {
        //        	$('#contact-us-final div.loader-block').show();
                },
                complete: function () {
        //		$('#contact-us-final div.loader-block').hide();
                },
                success: function (json) {
                    var error_count = 0;
                    for(var prop in json['errors']){
                        if(json['errors'].hasOwnProperty(prop)){
                            error_count =1;
                            $("#"+prop+"_error").html(json['errors'][prop]);
                        }
                    }
                    if(json.hasOwnProperty('file_name')){
                        $("#file_name").val(json['file_name']);
                    }
                    if(json.hasOwnProperty('file_id')){
                        $("#file_id").val(json['file_id']);
                    }
                    
                    if (validateFeeData() == false) {
                        error_count = 1;
                    }
                    if(!error_count){
                        $("#submitbuttonpopup").click();
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        });
        
        
        
        
    });
}()); /* self invoking function for prevent conflict */


function LoadForms(value, default_val,multiselect,module) {
    if(typeof multiselect =='undefined'){
        multiselect = '';
    }
    $('#discountFormat').hide();
    $('#discount_conditions').hide()
    $("input[name='discount_format'][type='radio']").attr("disabled",true)
    $('#discount_value').closest('.rowSpaceReduce').show();
    $("#discount_value").attr("disabled", false);
    var collegeDiscountFormat = ['524', '598'];
    if(collegeDiscountFormat.indexOf(value) !== -1){
        $('#discountFormat').show();
        $("input[name='discount_format'][type='radio']").attr("disabled",false)
        if($("input[name='discount_format'][type='radio']:checked").val() == 'dynamic'){
            $('#discount_conditions').show()   
            $('#discount_value').closest('.rowSpaceReduce').hide();
            $("#discount_value").attr("disabled", true);
        }
    } 
    $.ajax({
        url: '/voucher/get-forms',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "college_id": value,
            "default_val": default_val,
            "multiselect":multiselect
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if(data=="session_logout"){
                window.location.reload(true);
            }
            $('#div_load_forms').html(data);
            $('.div_load_forms').html(data);
            
            $('#form_id').on('change', getAllDropdown);
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            // Change Select box Caption for discount coupon module
            if(module=='Discount Coupon'){
                $("#form_id_chosen input").val("Select Form");
            }
            LoadFeeType(value, 0);
            getAllDropdown()
            removeApplCondition('removeAll');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function LoadFeeType(collegeId, formId) {
    $.ajax({
        url: '/discount-coupons/get-fee-type',
        type: 'post',
        dataType: 'json',
        data: {
            "collegeId": collegeId,
            "formId": formId
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if (json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(json['status'] == 1) {
                if (typeof json['data'] === "object") {
                    var feeTypeList           = json['data']['feeTypeList'];
                    if(typeof feeTypeList === "object") {
                        $('#fee_type').html('');
			$('.fee_type').SumoSelect({placeholder: 'All Fee Types', search: true, searchText:'Search fee type', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
                        $('#fee_type')[0].sumo.reload();
                        for(var index in feeTypeList) {
                            $('#fee_type')[0].sumo.add(index, feeTypeList[index]);
                        }
                    }
                }
            } else {
                $('#fee_type').html('');
                $('.fee_type').SumoSelect({placeholder: 'All Fee Types', search: true, searchText:'Search fee type', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
                $('#fee_type')[0].sumo.reload();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function loadUserList(collegeId) {
    $("#agent_name").val('');
    $.ajax({
        url: jsVars.FULL_URL + '/discount-coupons/get-all-college-users',
        type: 'post',
        dataType: 'json',
        data: {
            "collegeId": collegeId
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if (json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            var html = "<option value=''>Select Users</option>";
            if(json['status'] === 1) {
                if($('input[type=radio][name=agent_level]:checked').val() == 'campaign'){
                    html += "<option value='0'>Not Registered User</option>";
                }
                for (var key in json["data"]) {
                    html += "<option value='" + key + "'>" + json["data"][key] + "</option>";
                }
            }
            $('#assigned_users').html(html);
            $('#assigned_users').trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$(document).on('change', '#assigned_users', function () {
    $('.agentNameRequired').hide()
    var selectedText = $(this).find("option:selected").text();
    var selectedVal = $(this).val();
    if(selectedVal !== ''){
        $("#agent_name").attr('readonly',true);
        var nameArr = selectedText.split('(');
        var name = $.trim(nameArr[0]);
        $("#agent_name").val(name);
    }else{
        $("#agent_name").val('');
    }
    if(selectedVal == 0){
            $("#agent_name").val('');
         $("#agent_name").attr('readonly',false);
         $('.agentNameRequired').show()
    }
});
var downloadLeadFile = function(url){
    window.open(url, "_self");
};
function downloadSampleLeadCsv(){
    var type = $('input[name=upload_csv_type]:checked').val()
    var college_id = $("#college_id").val();
    var upload_type = $("#upload_type").val();
    var payment_type = $("#payment_type").val();
    
    var form_id =0;
    if($('#form_id').length>0) {
        form_id = $('#form_id').val();
    }
    $.ajax({
        url: jsVars.FULL_URL + '/discount-coupons/downloadSampleImportCsv',
        type: 'post',
        data: {collegeId: '',type:type},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $('#uploadLeadLoader.loader-block').show();
        },
        complete: function () {
            $('#uploadLeadLoader.loader-block').hide();
        },
        success: function (json)
        {
            if(json['status'] == 200) {
                var downloadUrl = json['downloadUrl'];
                if(downloadUrl!=='' && downloadUrl !==null){
                   downloadLeadFile(downloadUrl);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
        }
    });
}
$('.selectUsersLabel').hide()
$('input[type=radio][name=agent_level]').change(function() {
    $("#agent_name").val('');
    if (this.value == 'campaign') {
        $("#assigned_users option:first").after("<option value='0'>Not Registered User</option>");
        $('#assigned_users').trigger('chosen:updated');
        $("#is-multi-user-1").attr("disabled", false);
   }
    else if (this.value == 'code') {
        $("#assigned_users option[value='0']").remove();
        $('#assigned_users').trigger('chosen:updated');
        $("#is-multi-user-0").prop("checked", true);
        $("#is-multi-user-1").attr("disabled", true);
        $('#use_multi_text').hide();
    }
});

$('input[type=radio][name=upload_csv_type]').change(function() {
    var agentLevel = $('input[type=radio][name=agent_level]:checked').val();
    if (this.value == 'application') {
        $("#is-multi-user-0").prop("checked", true);
        $("#is-multi-user-1").attr("disabled", true);
        $('#use_multi_text').hide();
    }
    else if (this.value == 'coupon') {
        $("#is-multi-user-1").attr("disabled", false);
        $('#use_multi_text').show();
        if (agentLevel == 'code') {
            $("#is-multi-user-0").prop("checked", true);
            $("#is-multi-user-1").attr("disabled", true);
            $('#use_multi_text').hide();
        } else if (agentLevel == 'campaign') {
            $("#is-multi-user-0").prop("checked", true);
            $("#is-multi-user-1").attr("disabled", false);
            $('#use_multi_text').hide();
        }
    }
});

//('#discount_conditions').hide()
 $("input[name='discount_format'][type='radio']").click(function(){
    var discount_format = $(this).val();
    if(discount_format=='static'){
        $("#discount_value").attr("disabled", false);
        $('#discount_conditions').hide()
        $('#discount_value').closest('.rowSpaceReduce').show();
    }else{
        $("#discount_value").attr("disabled", true);
        $('#discount_value').closest('.rowSpaceReduce').hide();
        $('#discount_conditions').show()
    }
});
function getAllDropdown() {
    var formId  = $("#form_id").val();
    if(formId && formId.length>=2){
    }else{
        removeApplCondition('removeAll');
    }
    if(formId && formId.length==1) {
        //$("#enable_conditional_fees_div").show();
        $('#condition_fd_field_value_text').hide();
        $('#condition_fd_field_value_dropdown').show();
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
    //            $('#fee_details_fd_field').html(json['optionList']);
                $("#condition_fd_field").trigger('chosen:updated');
    //            $("#fee_details_fd_field").trigger('chosen:updated');
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }else{
        $('#condition_fd_field_value_text').show();
        $('#condition_fd_field_value_dropdown').hide();
        $.ajax({
            url: '/discount_coupons/getAllApplicationCommonFilters',
            type: 'post',
            dataType: 'json',
            data: {
                "formId": 0,
                "collegeId":$("#college_id").val()
            },
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            success: function (json) {
                if (typeof json['redirect'] !== 'undefined') {
                    window.location(json['redirect']);
                }
                $('#condition_fd_field').html(json['optionList']);
                $("#condition_fd_field").trigger('chosen:updated');
                
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

$(document).on('change','.condition_field',function () {
    //getDropdownValueList();
    var value   = $(this).val();
    var formId  = $("#form_id").val();
    if (value == '' || value == '0' || (formId && formId.length != 1)) {
        $(this).closest('.condition_field_value').html("<option value=''>Select Field Value</option>");
        $(this).closest('.condition_field_value').trigger('chosen:updated');
        return false;
    }
    $.ajax({
        url: '/voucher/get-dropdown-value-list',
        type: 'post',
        dataType: 'json',
        context: this,
        data: {
            "value": value
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            if (typeof json['redirect'] !== 'undefined') {
                window.location(json['redirect']);
            }
            $(this).closest('.condition_div').find('.condition_field_value').html(json['optionList']);
            $(this).closest('.condition_div').find('.condition_field_value').trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
});



function addMoreApplCondition(elem) {
    var div_class = 'form0' ;
    var stgClone = jQuery(elem).closest('.' + div_class + '>div').eq(0).clone();
    jQuery(stgClone).find('.chosen-container').remove();
    // add delete button
    jQuery(stgClone).find('.removeElementClass').html('<a href="javascript:void(0);" class="text-danger" onclick="return confirmDelete(this,\'condition\');"><i class="fa fa-minus-circle" aria-hidden="true"></i></a>');
    
    jQuery(stgClone).find('select').val('');
    jQuery(stgClone).find('input[type="text"]').val('');
    // append clone object
    jQuery(elem).closest('.' + div_class).append(stgClone);
    
    var stage_count = 0;
    // reset stage count

    jQuery(elem).parents('#discount_conditions').find('.' + div_class + '>div').each(function () {

        var fields_name = $(this).find('.condition_field').attr('name').replace(/\[[\d]*\]\[condition_field\]/gi, "[" + stage_count + "][condition_field]");
        $(this).find('.condition_field').attr('name', fields_name);

        var fields_name = $(this).find('.condition_type').attr('name').replace(/\[[\d]*\]\[type\]/gi, "[" + stage_count + "][type]");
        $(this).find('.condition_type').attr('name', fields_name);
         
        var fields_name = $(this).find('.condition_field_value').attr('name').replace(/\[[\d]*\]\[condition_field_value\]/gi, "[" + stage_count + "][condition_field_value]");
        $(this).find('.condition_field_value').attr('name', fields_name);
        
        var fields_name = $(this).find('.condition_field_text').attr('name').replace(/\[[\d]*\]\[condition_field_text\]/gi, "[" + stage_count + "][condition_field_text]");
        $(this).find('.condition_field_text').attr('name', fields_name);
        
        var fields_name = $(this).find('.condition_discount_value').attr('name').replace(/\[[\d]*\]\[condition_discount_value\]/gi, "[" + stage_count + "][condition_discount_value]");
        $(this).find('.condition_discount_value').attr('name', fields_name);
        

//        if (typeof $(this).find('.sel_value_hidden').attr('name') !== 'undefined') {
//            var fields_name = $(this).find('.sel_value_hidden').attr('name').replace(/\[[\d]*\]\[values_id\]/gi, "[" + stage_count + "][values_id]");
//            $(this).find('.sel_value_hidden').attr('name', fields_name);
//        }
//        
//        if (typeof $(this).find('.lead_error') !== 'undefined') {
//            var fields_name = $(this).find('.lead_error').attr('id').replace(/_\d$/gi, '_'+stage_count);
//            $(this).find('.lead_error').attr('id',fields_name);
//        }
        stage_count++;
    });
    jQuery('.chosen-select').chosen()
    //return false;
}

function confirmDelete(elem, type) {
    $("#ConfirmPopupArea").css('z-index',1111111);
	$(".modal-backdrop").css('z-index', 1111110);
    $('#ConfirmMsgBody').html('Do you want to delete ' + type + '?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();
                if (type === 'condition') {
                    removeApplCondition(elem);
                } else {
                    removeBlockCondition(elem);
                }
                is_filter_button_pressed = 0;
                $('#ConfirmPopupArea').modal('hide');
            });
    return false;
}

/**
 * remove condition field, operation and value
 * @param {type} elem
 * @returns {Boolean}
 */
function removeApplCondition(elem) {
    var div_class = 'form0' ;
    if(elem == 'removeAll'){
        $(".condition_div").not(':first').remove();
    }else{
         $(elem).closest('.condition_div').remove();
    }
   
}

function validateFeeData() {
    
    error=false;
    if($("input[name='discount_format'][type='radio']:checked").val() == 'dynamic'){
        $(".condition_div").each(function(){ 
            var id  = $(this).data("logicnumber");
            if ( $(this).find(".condition_field").val() == "" ) {
                $(this).find('.condition_field_validation').html("Required");
                $(this).find('.condition_field_validation').show();
                error = true;
            }
            if ( $(this).find(".condition_type").val() == "" ) {
                $(this).find('.condition_type_validation').html("Required");
                $(this).find('.condition_type_validation').show();
                error = true;
            }
            if ($(this).find(".condition_field_value").parent().parent().is(":visible") && ($(this).find(".condition_field_value").val() == "" || $(this).find(".condition_field_value").val() == null) ) {
                $(this).find('.condition_value_validation').html("Required");
                $(this).find('.condition_value_validation').show();
                error = true;
            }
            if ( $(this).find(".condition_field_text").is(":visible") && $(this).find(".condition_field_text").val() == "" ) {
                $(this).find('.condition_field_text_validation').html("Required");
                $(this).find('.condition_field_text_validation').show();
                error = true;
            }
            var pattern = /^\d+$/;
            if ( $(this).find(".condition_discount_value").val() == "" ) {
                $(this).find('.condition_discount_value_validation').html("Required");
                $(this).find('.condition_discount_value_validation').show();
                error = true;
            }else if ( $('#discount_as').val() == 'percent' && ($(this).find(".condition_discount_value").val() >100 || $(this).find(".condition_discount_value").val() < 0)) {
                $(this).find('.condition_discount_value_validation').html("Discount percentage should be positive and less than equal to 100.");
                $(this).find('.condition_discount_value_validation').show();
                error = true;
            }else if ( !pattern.test($(this).find(".condition_discount_value").val()) ) {
                $(this).find('.condition_discount_value_validation').html("Discount value should be numeric.");
                $(this).find('.condition_discount_value_validation').show();
                error = true;
            }

        });
    }
    if (error == false) {
        return true;
    } else {
//        $('html, body').animate({
//            scrollTop: $("#error_anchor").offset().top
//        }, 1000);
        return false;
    }
}