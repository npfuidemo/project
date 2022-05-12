$(document).ready(function(){
    $(".chosen-select").chosen();
    $('#settingsFieldsLoader').hide();
    $("#basic-config-otp-settings").click(function(){
        if ( $(this).is(':checked')) {
            $("#bypassinternationalotp").show();
            $("#otpdigitcount").show();
        }else{
            $("#bypassinternationalotp").hide();
            $("#otpdigitcount").hide();
            $("#basic-config-bypass-international-otp").removeAttr('checked');
        }
    });

    $("#basic-config-unique-mobile-no").click(function(){
        if ( $(this).is(':checked')) {
            $("#loginwithmobile,#clientapiduplicatemobile").show();
        }
        else{
            $("#loginwithmobile,#clientapiduplicatemobile").hide();
            $("#basic-config-login-mobile,#basic-config-clientapi-duplicatemobile,#basic-config-login-with-mobile-otp,#basic-config-widget-unique-mobile-number").removeAttr('checked');
        }
    });

    $("#basic-config-login-mobile").click(function(){
        if ( $(this).is(':checked')) {
            $("#basic-config-clientapi-duplicatemobile").removeAttr('checked');
        }
    });
    $("#basic-config-clientapi-duplicatemobile").click(function(){
        if ( $(this).is(':checked')) {
            $("#basic-config-login-mobile").removeAttr('checked');
        }
    });

    if($('.sumo_select').length){
        $('.sumo_select').SumoSelect({placeholder: 'Select Value', search: true, searchText:'Search Value', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
    }

    /*
    //For Dependent Dropdown
    if($('select.selectClassJS').length) {
        $('select.selectClassJS').each(function(index,val){
            disableDropdown(this);
        });
    }
    */

    $(".offlineLeadCampaignCheck").click(function(){
        if($(".offlineLeadCampaignCheck:checked").length>0){
            $("#offlineLeadRequireCampaign").prop("checked",true);
            $("#offlineLeadCampaignSource").prop("checked",true);
        }else{
            $("#offlineLeadRequireCampaign").prop("checked",false);
        }
    });

    $("#offlineLeadRequireCampaign").click(function(){
        if($("#offlineLeadRequireCampaign:checked").length>0){
            $(".offlineLeadCampaignCheck").each(function(){
                $(this).prop("checked",true);
            });
        }else{
            $(".offlineLeadCampaignCheck").each(function(){ $(this).prop("checked",false); });
        }
    });

    //check/uncheck All Social Login Vendors
    $("#socialLoginParentCheck").click(function () {
        if ($("#socialLoginParentCheck:checked").length > 0) {
            $(".socialLoginCheck").each(function () {
                $(this).prop("checked", true);
            });
        } else {
            $(".socialLoginCheck").each(function () {
                $(this).prop("checked", false);
            });
        }
    });

    //check/uncheck Enable Social Login Setting on Vendors check/uncheck
    $(".socialLoginCheck").click(function () {
        var checkedVendorCount = $(".socialLoginCheck:checked").length;
        if (checkedVendorCount > 0) {
            $("#socialLoginParentCheck").prop("checked", true);
        } else {
            $("#socialLoginParentCheck").prop("checked", false);
        }
    });

    /** Accodian Up and Down ***/
    $('.panel-collapse').on('show.bs.collapse', function () {
		$(this).siblings('.panel-heading').addClass('active');
	});
	$('.panel-collapse').on('hide.bs.collapse', function () {
		$(this).siblings('.panel-heading').removeClass('active');
	});

    //For Dependent
    $('.selectClassJS, .selectParentClassJS').on('change', function() {
        var currentSelectName = $(this);

        if(currentSelectName.hasClass('selectParentClassJS')) {
            var allSelector = $(this).parent().nextAll('td');
        } else if (currentSelectName.hasClass('selectClassJS')) {
            var allSelector = $(this).parent().parent('td').nextAll('td');
        }

        if(typeof allSelector !== 'undefined' && allSelector.length) {
            var nextDivShow = false;
            $(allSelector).each(function(index) {

                var selector = $(this).find('div > select');

                selector.find("option[value='']").attr('selected','selected');
                selector.find('option[value !=""]').removeAttr('selected');
                jQuery('.chosen-select').chosen();
                $(".chosen-select").trigger("chosen:updated");
                selector.parent('div').hide();

                if(currentSelectName.val() != '' && index == 0) {
                    selector.parent('div').show();
                }
            });
        }
    });

    $(document).on("change", '#application_status_mapping tr .select_field', function(event) {
        var map_field_id = this.id+'_mapping';
        var order_field_id = this.id+'_order';
        var stage_field_id = this.id+'_lead_stage';
        if($(this).is(':checked')){

            $('#'+map_field_id).removeAttr('disabled');
            $('#'+order_field_id).removeAttr('disabled');
            $('#'+stage_field_id).removeAttr('disabled');
        }
        else{
            $('#'+map_field_id).val('').attr('disabled',true);
            $('#'+order_field_id).val('').attr('disabled',true);
            $('#'+stage_field_id).val('').attr('disabled',true);
            $('#'+stage_field_id)[0].sumo.unSelectAll();

        }
        $('#'+stage_field_id)[0].sumo.reload();
    });
});

function chekCountOfSelection(elemt,formId, index, fieldId) {
    $("#auto_save_fields"+formId+'_'+index).hide();
    $("#auto_save_checkBox"+formId+'_'+index).prop('checked', false);
    var selectedValue = $('#level_value_'+formId+'_'+index).val();

    if(fieldId=='university_id' || fieldId=='course_id' || fieldId=='country_id' || typeof jsVars.dependentFieldList[fieldId] !== 'undefined'){

        var dependnt = false;
        $('#level_value_'+formId+'_'+index+' option').each(function(){
            var selectedItems   = $(this).val();
            var explode = selectedItems.split('_');
            if(typeof explode[1]!='undefined') {
                dependnt = true;
                return false;
            }
        });
        if(dependnt){
            var hh = $('#level_value_'+formId+'_'+index).SumoSelect();
            var allVal = $(elemt).val();
            $(allVal).each(function(i,val){
                var explode = val.split('_');
                if(typeof explode[1]!='undefined' && explode[1]!='') {
                    if(explode.length>2) { //For Handle Registration Dependent Field
                        var lastValue='';
                        $(explode).each(function(childDependentKey,childDependentVal){
                            if(lastValue != '') {
                                lastValue = lastValue+'_'+childDependentVal;
                            } else {
                                lastValue = childDependentVal;
                            }
                            $('#level_value_'+formId+'_'+index)[0].sumo.selectItem(lastValue);
                        });
                    } else {
                        var st = explode[0].toString();
                        hh.sumo.selectItem(st);
                    }
                }
            });
            var selectedValue = $('#level_value_'+formId+'_'+index).val();
            if(selectedValue!=null && selectedValue.length>=2 && selectedValue.length <=3){

                //Handle for dependent Dropdown
                if(selectedValue.length>2) { //If more than 2 checkbox is selected

                    //Split last index value so we can check for dependent dropdown
                    var checkChild = selectedValue[(selectedValue.length)-1].split('_');
                    if(checkChild.length >2 && typeof checkChild[0]!='undefined' && selectedValue[0]==checkChild[0]) {
                        $("#auto_save_fields"+formId+'_'+index).show();
                    }
                } else {
                    var checkChild = selectedValue[1].split('_');
                    if(typeof checkChild[0]!='undefined' && selectedValue[0]==checkChild[0]) {
                        $("#auto_save_fields"+formId+'_'+index).show();
                    }
                }
            }
        }else{
            if(selectedValue!== null && selectedValue.length==1){
                $("#auto_save_fields"+formId+'_'+index).show();
            }
        }
    }else{
        if(selectedValue!== null && selectedValue.length==1){
            $("#auto_save_fields"+formId+'_'+index).show();
        }
    }
}


function validatesaveBasicSettings() {
    if($("#basic-config-register-email-verification").is(':checked') && $("#basic-config-bypass-international-otp").is(':checked')) {
        $("#ConfirmPopupArea p#ConfirmMsgBody").text('Make sure you haven’t checked bypass Email Verification.');
        $("#ConfirmPopupArea a#confirmYes").attr("onclick", "saveBasicSettings();");
        $("#ConfirmPopupArea button").attr('onclick', "refreshApplicablefor()");

        $('#savebasicforconfirm').trigger('click');
    }else{
        saveBasicSettings();
    }
}

function refreshApplicablefor() {

}

function saveBasicSettings(){
    $("#ConfirmPopupArea button").trigger('click');
    $.ajax({
        url: jsVars.saveRegistrationSettingsLink,
        type: 'post',
        data: $("form#basicSettingsForm").serialize(),
        async: false,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
        	$('#settingsFieldsLoader').show();
	},
        complete: function() {
        	$('#settingsFieldsLoader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                alertPopup("Settings Saved Successfully",'success');
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message,'error');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function validateAppStatusForm() {
    var checkedStatus  = $('.checkbox-cust:checkbox:checked');
    var notCheckedStatus  = $('.checkbox-cust:checkbox:not(:checked)');
    var valid =true;
    var maxOrderValue = 5;
    var orderValues = [];
    var selectedStatus = [];
    notCheckedStatus.each(function() {
        $("#"+this.id+"_mapping").siblings('.error').html('');
        $("#"+this.id+"_order").siblings('.error').html('');
        maxOrderValue--;
    });
    checkedStatus.each(function() {
        if($("#"+this.id+"_mapping").val() == '') {
            $("#"+this.id+"_mapping").siblings('.error').html('Please enter status mapping');
            valid = false;
        } else {
            $("#"+this.id+"_mapping").siblings('.error').html('');
        }
        if($("#"+this.id+"_order").val() == '') {
            $("#"+this.id+"_order").siblings('.error').html('Please enter status order');
            valid = false;
        } else if(isNaN($("#"+this.id+"_order").val())) {
            $("#"+this.id+"_order").siblings('.error').html('Order should be numeric');
            valid = false;
        } else if($("#"+this.id+"_order").val() > maxOrderValue || $("#"+this.id+"_order").val() <= 0) {
            $("#"+this.id+"_order").siblings('.error').html('Invalid order');
            valid = false;
        } else if(orderValues.length > 0 && orderValues.indexOf($("#"+this.id+"_order").val()) != -1) {
            $("#"+this.id+"_order").siblings('.error').html('Duplicate order');
            valid = false;
        } else {
            orderValues.push($("#"+this.id+"_order").val());
            $("#"+this.id+"_order").siblings('.error').html('');
            selectedStatus.push(this.id);
        }
    });

    if(selectedStatus.indexOf('enrolled') != -1) {
        if($("#enrolled_order").val() != maxOrderValue) {
            $("#enrolled_order").siblings('.error').html('It should be max order');
            valid = false;
        }
        if(selectedStatus.indexOf('app_submitted') != -1) {
            if($("#app_submitted_order").val() != maxOrderValue-1) {
                $("#app_submitted_order").siblings('.error').html('It should be one less than to max order');
                valid = false;
            }
        }
    } else if(selectedStatus.indexOf('app_submitted') != -1) {
        if($("#app_submitted_order").val() != maxOrderValue) {
            $("#app_submitted_order").siblings('.error').html('It should be max order');
            valid = false;
        }
    }

    if(selectedStatus.indexOf('payment_initiated') != -1) {
        if(selectedStatus.indexOf('payment_approved') == -1) {
            $("#payment_approved_mapping").siblings('.error').html('Payment approved must be selected, if payment initiated is selected');
            valid = false;
        } else {
            if($('#payment_approved_order').val() - $('#payment_initiated_order').val() != 1) {
                $("#payment_approved_order").siblings('.error').html('It should be one greater than to payment initiated order');
                valid = false;
            }
        }
    }

    if(valid) {
        saveAppStatusMapping();
    }
}

$('#application_status_mapping .checkbox-cust').click(function() {
    if($(this).is(":checked")){
        $("#"+this.id+"_mapping").prop('disabled', false);
        $("#"+this.id+"_order").prop('disabled', false);
    }
    else if($(this).is(":not(:checked)")){
        $("#"+this.id+"_mapping").val('');
        $("#"+this.id+"_order").val('');
        $("#"+this.id+"_mapping").prop('disabled', true);
        $("#"+this.id+"_order").prop('disabled', true);
        $("#"+this.id+"_mapping").siblings('.error').html('');
        $("#"+this.id+"_order").siblings('.error').html('');
    }
});

function saveAppStatusMapping(){
    $.ajax({
        url: jsVars.saveApplicationStatusMappingLink,
        type: 'post',
        data: $("form#applicationStatusMappingForm").serialize(),
        async: false,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
        	$('#settingsFieldsLoader').show();
	},
        complete: function() {
        	$('#settingsFieldsLoader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                alertPopup("Settings Saved Successfully",'success');
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message,'error');
                }
            }
            $('#showApplicationStatusMappingPopup').trigger('click');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function validateAppStageField(){
    //console.log(jsVars.saveApplicationStageFieldLink); return;
    $.ajax({
        url: jsVars.saveApplicationStageFieldLink,
        type: 'post',
        data: $("form#applicationStageFieldForm").serialize(),
        async: false,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
        	$('#settingsFieldsLoader').show();
	},
        complete: function() {
        	$('#settingsFieldsLoader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                alertPopup("Settings Saved Successfully",'success');
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message,'error');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function saveMachineKeys(){
    $.ajax({
        url: jsVars.saveRegistrationMachineKeyMappingLink,
        type: 'post',
        data: $("form#machineKeyMappingForm").serialize(),
        async: false,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
        	$('#settingsFieldsLoader').show();
	},
        complete: function() {
        	$('#settingsFieldsLoader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                alertPopup("Settings Saved Successfully",'success');
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message,'error');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


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
            $(selector_parent).on('hide.bs.modal', function () {
                window.location.href = location;
            });
            $(selector_parent).modal('hide');
        });
    }
    else {
        $(selector_parent).modal();
    }
}

function saveCaptchaConfiguration(){
    $.ajax({
        url: jsVars.registrationCaptchaSetting,
        type: 'post',
        data: $("form#captchaConfigurationMappingForm").serialize(),
        async: false,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
        	$('#settingsFieldsLoader').show();
	},
        complete: function() {
        	$('#settingsFieldsLoader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                alertPopup("Settings Saved Successfully",'success');
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message,'error');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function saveLoginConfiguration() {
    var ltype = $("#loginsetting-cf").val();
    if(ltype=='CF') {
        if($("#loginSettingForm").val()==''){
           $("#formError").html("Please select form.");
        }
    }

    $.ajax({
        url: jsVars.saveLoginSetting,
        type: 'post',
        data: $("form#loginSetting").serialize(),
        async: false,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
            $('#settingsFieldsLoader').show();
	},
        complete: function() {
            $('#settingsFieldsLoader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==200){
                alertPopup("Settings Saved Successfully",'success');
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message,'error');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function saveAdditionalCampaignFields() {
    $.ajax({
        url: jsVars.saveAdditionalCampaignFields,
        type: 'post',
        data: $("form#additionalCampaignFieldsForm").serialize(),
        async: false,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
            $('#settingsFieldsLoader').show();
	},
        complete: function() {
            $('#settingsFieldsLoader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                alertPopup("Settings Saved Successfully",'success');
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message,'error');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function resetLoginConfiguration() {

    $("#loginSettingForm").val('');
    $("#loginSettingForm").prop('selected',false);
    $("#loginsetting-cf").prop('checked', false);
    $("#loginsetting-f").prop('checked', false);
    $("#loginSettingForm").trigger("chosen:updated");

    $.ajax({
        url: jsVars.resetLoginSetting,
        type: 'post',
        data: $("form#loginSetting").serialize(),
        async: false,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
            $('#settingsFieldsLoader').show();
	},
        complete: function() {
            $('#settingsFieldsLoader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==200){
                alertPopup("Settings Saved Successfully",'success');
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message,'error');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$(document).on('click',"#loginsetting-cf",function() {
    $("#loginSettingformSelect").show();
});
$(document).on('click',"#loginsetting-f",function() {
    $("#loginSettingformSelect").hide();
});

function loadFormMapingFields(fid, cid, index){

    index++;
    $.ajax({
        url: jsVars.registrationMappingSetting,
        type: 'post',
        data: {'formId':fid, 'collegeId':cid, 'index':index},
        async: false,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
        	$('#settingsFieldsLoader').show();
	},
        complete: function() {
        	$('#settingsFieldsLoader').hide();
        },
        success: function (html) {
            if (html === 'session_logout') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (html === 'error') {
                alertPopup('Parameter missing!', 'error');
            } else {
                $('#formAccordId'+fid).removeAttr('onclick');
                $("#formMappingFields"+fid).append(html);
                var saveBtn = '<button type="button" onclick="saveSectionData('+fid+', '+cid+');">Save</button><a href="javascript:void(0);" class="btn btn-fill-blue margin-right-20 pull-right" onclick="return loadFormMapingFields('+fid+', '+cid+', '+index+');" id="addLogicButton">Add More </a>';
                $("#saveAddBtn"+fid).html('');
                $("#saveAddBtn"+fid).html(saveBtn);
                //disabledSelectedLevel(fid);

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

}

function getDependentField(field_id, cid, fid, index){

    if(field_id=='') {
        $('#dependent_fields_data'+fid+'_'+index).html('');
        $('#auto_save_fields'+fid+'_'+index).hide();
        return false;
    }

    $.ajax({
        url: jsVars.registrationDependedField,
        type: 'post',
        data: {'fieldId':field_id, 'collegeId':cid, 'formId':fid, 'index':index},
        async: false,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
            $('#settingsFieldsLoader').show();
	},
        complete: function() {
            $('#settingsFieldsLoader').hide();
            //disabledSelectedLevel(fid);
        },
        success: function (response) {
            $('#dependent_fields_data'+fid+'_'+index).html(response);
            $('.sumo_select').SumoSelect({placeholder: 'Select Value', search: true, searchText:'Search Value', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });

            $('select.sumo_select').on('sumo:opened', function(sumo) {
                // Do stuff here
                //console.log("Drop down opened", sumo);
                $('.optionGroup').parent().parent().siblings().addClass('optionGroupChild');
                $('.optionGroup').parent().parent().removeClass('optionGroupChild');

                $("i.optionLastChild").each(function(){
                    $(this).parent().parent().addClass('optionGroupChild2');
                });

            });
            $('select#level_value_'+fid+'_'+index)[0].sumo.reload();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function saveSectionData(fid, cid){

    var data = $("form#formMappingForm"+fid).serializeArray();
    data.push({name: "collegeId", value: cid});
    data.push({name: "formId", value: fid});

    $.ajax({
        url: '/users/saveUserMappingFields',
        type: 'post',
        data: data,
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
            $('#settingsFieldsLoader').show();
	},
        complete: function() {
            $('#settingsFieldsLoader').hide();
        },
        success: function (response) {
            if (response['message'] === 'session_logout') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if(response['status']==200){
                alertPopup('Successfully Saved.', 'success');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function confirmDeleteBlock(elem,index,formId){
    $('#ConfirmMsgBody').html('Do you want to delete this block?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();
                $(elem).parents('div.rediskeysection').remove();
                $('#ConfirmPopupArea').modal('hide');

                $(".level_option_class_"+formId+" option").each(function(){
                    var selectedItems   = $(this).val();
                    if($('select.level_option_class_'+formId+' option[value="'+selectedItems+'"]:not(:selected)').length>0){
                        $('select.level_option_class_'+formId+' option[value="'+selectedItems+'"]').attr('disabled',false);
                    }
                });

                $('.sumo_select').SumoSelect({placeholder: 'Select Value', search: true, searchText:'Search Value', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
                $('.sumo_select')[0].sumo.reload();

            });
    return false;
}

function disabledSelectedLevel(formId){
    $(".level_option_class_"+formId+" option").attr('disabled',false);
    $(".level_option_class_"+formId).each(function(){
        if($(this).val()!== null && $(this).val().length){
            var selectedItems   = $(this).val();
            //alert(selectedItems);
            //for (var i in selectedItems) {
                $(".level_option_class_"+formId+" option[value=" + selectedItems + "]").attr('disabled', 'disabled');
                //$("."+selectedItems+":not(:selected)").attr('disabled',true);
            //}
        }
    });
    $(".level_option_class_"+formId).trigger("chosen:updated");
}


function getCourseFormMapping(cid, fid,index,type) {
    $.ajax({
        url: "/users/getFormLevelMapping",
        type: 'post',
        data: {'collegeId': cid, 'formId': fid, 'index' : index, 'type' : type},
        async: false,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
            $('#settingsFieldsLoader').show();
	},
        complete: function() {
            $('#settingsFieldsLoader').hide();

        },
        success: function (response) {
            var res = $(response);

            $(res).find('select.level_option_class_'+fid+' option:selected').each(function(){
                var disopts = $(this).val();
                $(res).find('select.level_option_class_'+fid+' option[value="'+disopts+'"]:not(:selected)').attr('disabled','disabled');
            });

            $("#formMappingFields"+fid).find('select.level_option_class_'+fid+' option:selected').each(function(){
                var disopts = $(this).val();
                $(res).find('select.level_option_class_'+fid+' option[value="'+disopts+'"]').attr('disabled','disabled');
            });

            $(".saveAddBtn"+fid).html('');
            if(index==0){//reset
                $("#formMappingFields"+fid).html(res);
                $("#formAccordId"+fid).removeAttr('onclick');
            }else{
                $("#formMappingFields"+fid).append(res);
            }

            $('.sumo_select').SumoSelect({placeholder: 'Select Value', search: true, searchText:'Search Value', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
            $('.sumo_select')[0].sumo.reload();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }

    });
}

function saveCommunicationPreferenceFields() {
    $.ajax({
        url: jsVars.saveCommunicationPreferenceLink,
        type: 'post',
        data: $("form#communicationPreferenceFieldsForm").serialize(),
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
            $('#settingsFieldsLoader').show();
        },
        complete: function() {
            $('#settingsFieldsLoader').hide();
        },
        success: function (responseObject) {
            if(responseObject['status'] === 200){
                alertPopup("Settings Saved Successfully",'success');
            }
            else{
                if (typeof responseObject['error'] !== 'undefined' && responseObject['error'] === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }
                else{
                    alertPopup(responseObject['error'],'error');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/**
 * For add more dependent dropdown
 * @param {type} elem
 * @param {type} rowNo
 * @returns {Boolean}
 */
function addMoreDynamicDependentField(elem,rowNo) {

    var totalDiv = parseInt($( "tr.dependentClassJS" ).length);

    var div_class   = 'dependentClassJS'; //+ rowNo;
    //var stgClone    = jQuery(elem).closest('.' + div_class + '>div').eq(0).clone();
    var stgClone    = jQuery(elem).closest('tr').eq(0).clone();

    // remove chosen select container
    jQuery(stgClone).find('.chosen-container').remove();

    // add delete button
    jQuery(stgClone).find('.removeElementClass').html('<a href="javascript:void(0)" class="text-danger" onclick="return confirmDelete(this);"><i class="fa fa-minus-circle fa-2x" aria-hidden="true"></i></a>');

    jQuery(stgClone).find('select').val('').removeAttr('disabled');

    var totalTr =0;

    jQuery(stgClone).find('select').each(function () {
        $(this).attr('name', 'dependent_dropdown['+totalDiv+']['+totalTr+']');
        $(this).bind('change', function(){
            var currentSelectName = $(this);
            if(currentSelectName.hasClass('selectParentClassJS')) {
                var allSelector = $(this).parent().nextAll('td');
            } else if (currentSelectName.hasClass('selectClassJS')) {
                var allSelector = $(this).parent().parent('td').nextAll('td');
            }

            //var allSelector = $(this).parent().parent('td').nextAll('td');
            if(typeof allSelector !== 'undefined' && allSelector.length) {
                var nextDivShow = false;
                $(allSelector).each(function(index) {
                    var selector = $(this).find('div > select');

                    selector.find("option[value='']").attr('selected','selected');
                    selector.find('option[value !=""]').removeAttr('selected');
                    jQuery('.chosen-select').chosen();
                    $(".chosen-select").trigger("chosen:updated");
                    selector.parent('div').hide();

                    if(currentSelectName.val() != '' && index == 0) {
                        selector.parent('div').show();
                    }
                });
            }
         });


         if(totalTr > 0) {
             $(this).parent('div').hide();
         }
        totalTr++;
    });

    $('tbody.dependentTbodyClassJS tr:last-child').after(stgClone);
    jQuery('.chosen-select').chosen();
    $(".chosen-select").trigger("chosen:updated");
    return false;
}

/**
 * This function will delete tr data and update the registration dependent config
 * @param {type} elem
 * @returns {Boolean}
 */
function confirmDelete(elem) {

    $('#ConfirmMsgBody').html('Do you want to delete this row ?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();

                $(elem).closest('tr').remove();



                var block_count = 0;

                var totalDiv = parseInt($( "tr.dependentClassJS" ).length);

                jQuery('tr.dependentClassJS').each(function (index) {
                    var stage_count =0;
                    jQuery($(this).find('select')).each(function () {
                        $(this).attr('name', 'dependent_dropdown['+index+']['+stage_count+']');
                        stage_count++;
                    });
                });

                //Call this function to save the data
                saveRegistrationConfig();

                jQuery('.chosen-select').chosen();
                $('#ConfirmPopupArea').modal('hide');
            });
    return false;
}

/*
 * Save Registration dependent dropdown config
 */
function saveRegistrationConfig(){
    $.ajax({
        url: jsVars.saveRegistrationConfigLink,
        type: 'post',
        data: $("form#dependentFieldSetting").serialize(),
        async: false,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
        	$('#settingsFieldsLoader').show();
	},
        complete: function() {
        	$('#settingsFieldsLoader').hide();
        },
        success: function (response) {
            if (response == "session_logout") {
                window.location.reload(true);
            }

            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                alertPopup(responseObject.message,'success');
            }else{
                alertPopup(responseObject.message,'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function disableDropdown(obj){
    var trObj = $(obj).parents('tr');
    var arrayValue = new Array();
    $(trObj).find('select.selectClassJS').each(function() {

        var currentSelectedVal = $(this).val();
        if(currentSelectedVal != '') {
            arrayValue.push(currentSelectedVal);
        }

        var currentSelectName = $(this).attr('name');
        if(arrayValue.length) {

            $(arrayValue).each(function(k,val){
                $("select[name=\""+currentSelectName+"\"] option[value='"+val+"']").attr('disabled','disabled');
                $("select[name=\""+currentSelectName+"\"]").trigger("chosen:updated");

            });

            if($.inArray(currentSelectedVal,arrayValue) >= 0) {
                $("select[name=\""+currentSelectName+"\"] option[value='"+currentSelectedVal+"']").removeAttr('disabled');
                $(this).trigger("chosen:updated");
            }
        }else {
            $("select[name=\""+currentSelectName+"\"] option[value!='']").removeAttr('disabled');
            $(this).trigger("chosen:updated");
        }
    });
}

function selectAllStage(elem){
    if(elem.checked){
        $('.select_field').not(".disable-check").each(function(){
            this.checked = true;
        });
    }else{
        $('.select_field').not(".disable-check").attr('checked',false);
    }
}

function validateApplicationUniqueSettings() {
    var uniqueKey;
    if($("#uniqueAppNumber").is(':checked')) {
        uniqueKey = true;
    } else if($("#uniqueAppCourse").is(':checked')) {
        uniqueKey = true;
    } else {
        uniqueKey = false;
    }
    if(uniqueKey) {
        $(".error").html('');
        saveApplicationUniqueness();
    }else{
        $(".error").html('Please select at least one key for application uniqueness');
    }
}

function saveApplicationUniqueness(){
    $("#ConfirmPopupArea button").trigger('click');
    $.ajax({
        url: jsVars.saveApplicationUniquenessSettingLink,
        type: 'post',
        data: $("form#applicationUniquenessForm").serialize(),
        async: false,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
        	$('#settingsFieldsLoader').show();
	},
        complete: function() {
        	$('#settingsFieldsLoader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                alertPopup("Settings Saved Successfully",'success');
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message,'error');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function saveCustomMappingKeys() {
    $.ajax({
        url: jsVars.saveRegistrationCustomFieldMappingLink,
        type: 'post',
        data: $("form#customMappingForm").serialize(),
        async: false,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
        	$('#settingsFieldsLoader').show();
	},
        complete: function() {
        	$('#settingsFieldsLoader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                alertPopup("Settings Saved Successfully",'success');
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message,'error');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
function filterResetModal_new() {
    if ($('.offCanvasModal .chosen-select').length > 0) {
            $('#searchField').val('').trigger("chosen:updated");
    }
}
