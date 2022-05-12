/* 
 * College Configuration page javascript.
 */
if ($('#CollegeConfigurationSection').length > 0){
    
    //BasicConfiguration: check all input:checkbox
    $(document).on('click','#BasicConfigurationCheckAll',function(){
        if($(this).is(':checked'))
        { 
            $('#BasicConfigurationContainer input:checkbox').each(function() {
                $(this).prop('checked',true);
            });
        }
        else
        {
            $('#BasicConfigurationContainer input:checkbox').each(function() {
                $(this).prop('checked',false);
            });
        }
        
    });   
    
    //BasicConfiguration: check main checkbox on single checkbox checked
    $(document).on('click','#BasicConfigurationContainer input:checkbox',function(){ 
        if($(this).is(':checked'))
        { 
            if($('#BasicConfigurationContainer input:checkbox').length == $('#BasicConfigurationContainer input:checked').length)
            {
                $('#BasicConfigurationCheckAll').prop('checked',true);
            }            
        }
        else
        {
            $('#BasicConfigurationCheckAll').prop('checked',false);            
        }
        
    });
    
    
    //BasicConfiguration: if College have basic_config
    if(typeof jsVars.CollegeConfig != 'undefined')
    {
        if(typeof jsVars.CollegeConfig['basic_config'] != 'undefined')
        {
            for(var field in jsVars.CollegeConfig['basic_config'])
            {        
                if((jsVars.CollegeConfig['basic_config'][field] != 0) || 
                    ((field == 'enable_copy_standard_field_data') && Array.isArray(jsVars.CollegeConfig['basic_config'][field])))
                {
                    $('#BasicConfigurationContainer input[name=\'basic_config['+field+']\']').trigger('click');
                }
            }
        }
    }
    
    //Registeration Config: check all input:checkbox
    $(document).on('click','#RegisterConfigCheckAll',function(){ 
        if($(this).is(':checked'))
        { 
            $('#RegistrationConfigContainer input:checkbox').each(function() {
                $(this).prop('checked',true);
            });
        }
        else
        {
            $('#RegistrationConfigContainer input:checkbox').each(function() {
                $(this).prop('checked',false);
            });
        }
    });   
    
	if ($('#EnrolmentConfigContainer').length > 0) {
       $('#lead_stage_type').SumoSelect({placeholder: 'Select stages', search: true, searchText:'Search Stages', selectAll : false, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
    }
	
    //check main checkbox on single checkbox checked
    $(document).on('click','#RegistrationConfigContainer input:checkbox',function(){ 
        if($(this).is(':checked'))
        { 
            if($('#RegistrationConfigContainer input:checkbox').length == $('#RegistrationConfigContainer input:checked').length)
            {
                $('#RegisterConfigCheckAll').prop('checked',true);
            }
        }
        else
        {
            $('#RegisterConfigCheckAll').prop('checked',false);
        }
    });
    
    //if College have basic_config
    if(typeof jsVars.CollegeConfig != 'undefined')
    {
        if(typeof jsVars.CollegeConfig['registeration_config'] != 'undefined')
        {
            //set default field active if no config
            if(jsVars.CollegeConfig['registeration_config'].length == 0){
                jsVars.CollegeConfig['registeration_config']['password'] = 1;
                jsVars.CollegeConfig['registeration_config']['sign_agreement'] = 1;
                jsVars.CollegeConfig['registeration_config']['captcha'] = 1;
            }
            else
            {
                //set default field active if prev config is saved
                if((typeof jsVars.CollegeConfig['registeration_config']['password'] == 'undefined') && 
                    (typeof jsVars.CollegeConfig['registeration_config']['sign_agreement'] == 'undefined') && 
                    (typeof jsVars.CollegeConfig['registeration_config']['captcha'] == 'undefined'))
                {
                    jsVars.CollegeConfig['registeration_config']['password'] = 1;
                    jsVars.CollegeConfig['registeration_config']['sign_agreement'] = 1;
                    jsVars.CollegeConfig['registeration_config']['captcha'] = 1;
                }
            }
            
            for(var field in jsVars.CollegeConfig['registeration_config'])
            {
                if(jsVars.CollegeConfig['registeration_config'][field] != 0)
                {
                    $('#RegistrationConfigContainer input[name=\'registeration_config['+field+']\']').trigger('click');
                }
            }
        }
    }
    
    //check all input:checkbox
    $(document).on('click','#EmailTemplateConfigCheckAll',function(){ 
        if($(this).is(':checked'))
        { 
            $('#EmailTemplateConfigContainer input:checkbox').each(function() {
                $(this).prop('checked',true);
            });
        }
        else
        {
            $('#EmailTemplateConfigContainer input:checkbox').each(function() {
                $(this).prop('checked',false);
            });
        }
    });   
    
    //check main checkbox on single checkbox checked
    $(document).on('click','#EmailTemplateConfigContainer input:checkbox',function(){ 
        if($(this).is(':checked'))
        { 
            if($('#EmailTemplateConfigContainer input:checkbox').length == $('#EmailTemplateConfigContainer input:checked').length)
            {
                $('#EmailTemplateConfigCheckAll').prop('checked',true);
            }
        }
        else
        {
            $('#EmailTemplateConfigCheckAll').prop('checked',false);
        }
    });
    
    //if College have basic_config
    if(typeof jsVars.CollegeConfig != 'undefined')
    {
        if(typeof jsVars.CollegeConfig['email_template_config'] != 'undefined')
        {
            for(var field in jsVars.CollegeConfig['email_template_config'])
            {                
                if(jsVars.CollegeConfig['email_template_config'][field] != 0)
                {
                    $('#EmailTemplateConfigContainer input[name=\'email_template_config['+field+']\']').trigger('click');
                }
            }
        }
    }
    
    //check all input:checkbox
    $(document).on('click','#SMSTemplateConfigCheckAll',function(){ 
        if($(this).is(':checked'))
        { 
            $('#SMSTemplateConfigContainer input:checkbox').each(function() {
                $(this).prop('checked',true);
            });
        }
        else
        {
            $('#SMSTemplateConfigContainer input:checkbox').each(function() {
                $(this).prop('checked',false);
            });
        }
    });   
    
    //check main checkbox on single checkbox checked
    $(document).on('click','#SMSTemplateConfigContainer input:checkbox',function(){ 
        if($(this).is(':checked'))
        { 
            if($('#SMSTemplateConfigContainer input:checkbox').length == $('#SMSTemplateConfigContainer input:checked').length)
            {
                $('#SMSTemplateConfigCheckAll').prop('checked',true);
            }
        }
        else
        {
            $('#SMSTemplateConfigCheckAll').prop('checked',false);
        }
    });
    
     //if College have basic_config
    if(typeof jsVars.CollegeConfig != 'undefined')
    {
        if(jsVars.CollegeConfig['sms_template_config'] != null)
        {
            for(var field in jsVars.CollegeConfig['sms_template_config'])
            {                
                if(jsVars.CollegeConfig['sms_template_config'][field] != 0)
                {
                    $('#SMSTemplateConfigContainer input[name=\'sms_template_config['+field+']\']').trigger('click');
                }
            }
        }
    }
    
    //chat check all
    $(document).on('click','#ChatConfigCheckAll',function(){ 
        if($(this).is(':checked'))
        { 
            $('#ChatConfigContainer input:checkbox').each(function() {
                $(this).prop('checked',true);
            });
        }
        else
        {
            $('#ChatConfigContainer input:checkbox').each(function() {
                $(this).prop('checked',false);
            });
        }
    });
    
    //chat check main checkbox on single checkbox checked
    $(document).on('click','#ChatConfigContainer input:checkbox',function(){
        if($(this).is(':checked'))
        { 
            if($('#ChatConfigContainer input:checkbox').length == $('#ChatConfigContainer input[type=\'checkbox\']:checked').length)
            {
                $('#ChatConfigCheckAll').prop('checked',true);
            }
        }
        else
        {
            $('#ChatConfigCheckAll').prop('checked',false);
        }
    });
    
     //if College have basic_config
    if(typeof jsVars.CollegeConfig != 'undefined')
    {
        if(jsVars.CollegeConfig['chat_config']['config'] != null)
        {
            
            for(var field in jsVars.CollegeConfig['chat_config']['config'])
            {                
                
                if(typeof jsVars.CollegeConfig['chat_config']['config'][field]['chat']!='undefined' && jsVars.CollegeConfig['chat_config']['config'][field]['chat'] != '0')
                {
                    $('#ChatConfigContainer  input[name=\'chat_config[config]['+field+'][chat]\']').trigger('click');
                }
            }
        }
    }
    
    
    //payments check all
    $(document).on('click','#PaymentConfigCheckAll',function(){ 
        if($(this).is(':checked'))
        { 
            $('#PaymentConfigContainer input:checkbox').each(function() {
                $(this).prop('checked',true);
            });
        }
        else
        {
            $('#PaymentConfigContainer input:checkbox').each(function() {
                $(this).prop('checked',false);
            });
        }
    });
    
     //payments check main checkbox on single checkbox checked
    $(document).on('click','#PaymentConfigContainer input:checkbox',function(){
        if($(this).is(':checked'))
        { 
            if($('#PaymentConfigContainer input:checkbox').length == $('#PaymentConfigContainer input[type=\'checkbox\']:checked').length)
            {
                $('#PaymentConfigCheckAll').prop('checked',true);
            }
        }
        else
        {
            $('#PaymentConfigCheckAll').prop('checked',false);
        }
    });
    
    //if College have basic_config
    if(typeof jsVars.CollegeConfig != 'undefined')
    {
        if(jsVars.CollegeConfig['payment_config']['gateways'] != null)
        {
            
            for(var field in jsVars.CollegeConfig['payment_config']['gateways'])
            {                
                if(jsVars.CollegeConfig['payment_config']['gateways'][field] != '0')
                {
                    
//                    $('#PaymentConfigContainer  input[name=\'payment_config[gateways]['+field+']\']').trigger('click');
                    showHidePaymentGatewayParams(this);
                }
            }
            if($('#PaymentConfigContainer input:checkbox').length == $('#PaymentConfigContainer input[type=\'checkbox\']:checked').length)
            {
                $('#PaymentConfigCheckAll').prop('checked',true);
            }
        }
    }
    
    //check all input:checkbox
    $(document).on('click','#FormEmailTemplateConfigCheckAll',function(){ 
        if($(this).is(':checked'))
        { 
            $('#FormEmailTemplateConfigContainer input:checkbox').each(function() {
                $(this).prop('checked',true);
            });
        }
        else
        {
            $('#FormEmailTemplateConfigContainer input:checkbox').each(function() {
                $(this).prop('checked',false);
            });
        }
    });   
    
    //check main checkbox on single checkbox checked
    $(document).on('click','#FormEmailTemplateConfigContainer input:checkbox',function(){ 
        if($(this).is(':checked'))
        { 
            if($('#FormEmailTemplateConfigContainer input:checkbox').length == $('#FormEmailTemplateConfigContainer input:checked').length)
            {
                $('#FormEmailTemplateConfigCheckAll').prop('checked',true);
            }
        }
        else
        {
            $('#FormEmailTemplateConfigCheckAll').prop('checked',false);
        }
    });
    
    //if College have basic_config
    if(typeof jsVars.CollegeConfig != 'undefined')
    {
        if((jsVars.CollegeConfig['form_email_template_config'] != null) && (jsVars.CollegeConfig['form_email_template_config']['data'] != null))
        {
            for(var field in jsVars.CollegeConfig['form_email_template_config']['data'])
            {                
                if(jsVars.CollegeConfig['form_email_template_config']['data'][field] != 0)
                {
                    $('#FormEmailTemplateConfigContainer input[name=\'form_email_template_config['+field+']\']').trigger('click');
                }
            }
        }
    }
    
    //check all input:checkbox
    $(document).on('click','#FormSMSTemplateConfigCheckAll',function(){ 
        if($(this).is(':checked'))
        { 
            $('#FormSMSTemplateConfigContainer input:checkbox').each(function() {
                $(this).prop('checked',true);
            });
        }
        else
        {
            $('#FormSMSTemplateConfigContainer input:checkbox').each(function() {
                $(this).prop('checked',false);
            });
        }
    });   
    
    //check main checkbox on single checkbox checked
    $(document).on('click','#FormSMSTemplateConfigContainer input:checkbox',function(){ 
        if($(this).is(':checked'))
        { 
            if($('#FormSMSTemplateConfigContainer input:checkbox').length == $('#FormSMSTemplateConfigContainer input:checked').length)
            {
                $('#FormSMSTemplateConfigCheckAll').prop('checked',true);
            }
        }
        else
        {
            $('#FormSMSTemplateConfigCheckAll').prop('checked',false);
        }
    });
    
    //if College have basic_config
    if(typeof jsVars.CollegeConfig != 'undefined')
    {
        if((jsVars.CollegeConfig['form_sms_template_config'] != null) && (jsVars.CollegeConfig['form_sms_template_config']['data'] != null))
        {
            for(var field in jsVars.CollegeConfig['form_sms_template_config']['data'])
            {                
                if(jsVars.CollegeConfig['form_sms_template_config']['data'][field] != 0)
                {
                    $('#FormSMSTemplateConfigContainer input[name=\'form_sms_template_config['+field+']\']').trigger('click');
                }
            }
        }
    }
    
    //check all input:checkbox
    $(document).on('click','#FormPurgeConfigCheckAll',function(){ 
        if($(this).is(':checked'))
        { 
            $('#FormPurgeConfigContainer input:checkbox').each(function() {
                $(this).prop('checked',true);
            });
            $("#FormPurgeConfigForm option:selected").removeAttr("selected");
            $('.chosen-select').chosen();
            $("#FormPurgeConfigForm").trigger("chosen:updated");
        }
        else
        {
            $('#FormPurgeConfigContainer input:checkbox').each(function() {
                $(this).prop('checked',false);
            });
        }
    });   
    
    //check main checkbox on single checkbox checked
    $(document).on('click','#FormPurgeConfigContainer input:checkbox',function(){ 
        if($(this).is(':checked'))
        { 
            if($('#FormPurgeConfigContainer input:checkbox').length == $('#FormPurgeConfigContainer input:checked').length)
            {
                $('#FormPurgeConfigCheckAll').prop('checked',true);
            }
        }
        else
        {
            $('#FormPurgeConfigCheckAll').prop('checked',false);
        }
    });
    
    //if College have purge_data_config
    if(typeof jsVars.CollegeConfig['purge_data_config'] != 'undefined')
    {
        if((jsVars.CollegeConfig['purge_data_config']['config'] != null) && (jsVars.CollegeConfig['purge_data_config']['config'] != null))
        {
            for(var field in jsVars.CollegeConfig['purge_data_config']['config'])
            {                
                if(jsVars.CollegeConfig['purge_data_config']['config']['user_level_purge'] != 0)
                {
                    $('#FormPurgeConfigContainer #'+ jsVars.CollegeConfig["purge_data_config"]["config"]["user_level_purge"]).trigger('click');
                    if(jsVars.CollegeConfig["purge_data_config"]["config"]["user_level_purge"] == 'form_level_purge'){
                        $('#purge_form_div').show();
                    }
                }
            }
        }
    }
    
    // show forms list if form_level_purged checked
    $('#FormPurgeConfigContainer input[name=\'purge_data_config[config][user_level_purge]\']').click(function() {
       if($(this).attr('id') == 'form_level_purge') {
            $('#purge_form_div').show();           
       } else {
            $('#purge_form_div').hide();   
            $("#FormPurgeConfigForm option:selected").removeAttr("selected");
            $('.chosen-select').chosen();
            $("#FormPurgeConfigForm").trigger("chosen:updated");
       }
   });
   
    //validating user level purge and college forms in college config
    $("#purge-data-config-config-user-level-purge").on('click', function(){
        $("#FormPurgeConfigForm option:selected").removeAttr("selected");
        $('.chosen-select').chosen();
        $("#FormPurgeConfigForm").trigger("chosen:updated");
    });
    $("#FormPurgeConfigForm").on('change', function(){
        var selectdata = $("#FormPurgeConfigForm").val();
        if(selectdata!=''){
            $("#purge-data-config-config-user-level-purge").prop('checked',false);
        }
    });
    
    // show counsellor list if round-robin checked
    $('#LeadsAllocationMethodConfigContainer input[name=\'lead_allocation_method_config[lead_alloc_method]\']').click(function() {
       if($(this).attr('id') == 'round_robin_allocation') {
            $('#college_counsellors_div').show();           
       } else {
            $('#college_counsellors_div').hide();   
            $("#LeadAllocConfigForm option:selected").removeAttr("selected");
          //  $('.chosen-select').chosen();
            $("#LeadAllocConfigForm").trigger("chosen:updated");
       }
   });
   
   //if College have purge_data_config
    if(typeof jsVars.CollegeConfig['lead_allocation_method_config'] != 'undefined' && (jsVars.CollegeConfig['lead_allocation_method_config']['lead_alloc_method'] != null) && (jsVars.CollegeConfig['lead_allocation_method_config']['lead_alloc_method'] != ''))
    {   
        $('#LeadsAllocationMethodConfigContainer #'+ jsVars.CollegeConfig['lead_allocation_method_config']['lead_alloc_method']).trigger('click');
        if((typeof jsVars.CollegeConfig['purge_data_config']['config'] != 'undefined') && 
            (typeof jsVars.CollegeConfig['purge_data_config']['config']['user_level_purge'] != 'undefined') && 
            (jsVars.CollegeConfig["purge_data_config"]["config"]["user_level_purge"] == 'round_robin_allocation')) {
            $('#college_counsellors_div').show();
        }

    }
    
    
    //show/hide Edit/Cancel/Save Button
    $(document).on('click','div.accordion-btn-show button#EditBtn',function(){
        
        if($(this).hasClass('display-none'))
        {            
            $(this).parent().find('button#CancelBtn').removeClass('display-blk').addClass('display-none');
            $(this).parent().find('button#SaveBtn').removeClass('display-blk').addClass('display-none');
            $(this).removeClass('display-none').addClass('display-blk');
        }
        else
        {
            $(this).parent().find('button#CancelBtn').removeClass('display-none').addClass('display-blk');
            $(this).parent().find('button#SaveBtn').removeClass('display-none').addClass('display-blk');
            $(this).removeClass('display-blk').addClass('display-none');
        }        
    });

    $(document).on('click','div.marketing-domain-parent div.marketing-domain-childs a.add-more-marketing-domain',function() {
        var $this = $(this);
        var html = $this.parents('div.marketing-domain-childs').last().clone();
        html.find('input').val('');
        html.find('span.domains-error').text('');
        html.find('div.removeElementClass').remove();
        $this.parents('div.marketing-domain-parent').append(html);
        $this.parents('div.marketing-domain-parent').find('div.removeElementClass').remove();
        $this.parents('div.marketing-domain-parent').find('div.marketing-domain-childs .addButtonFromClass').append('<div class="removeElementClass inbl"><a href="javascript:void(0);" class="text-danger" onclick="return confirmDeleteDomain(this);"><i class="fa fa-minus-circle font20" aria-hidden="true"></i></a></div>');
    });
}

function addWhatsappBusinessNo(){
    var count = $("#add_more_count").val();
    var addCount = +$("#add_more_count").val() + 1;
    
    var sampleHtml = $('#businessNumber_1').clone();
    $("#add_more_count").val(addCount);
    $("#Whatsapp-business-number-div").append("<div class='form-group formAreaCols labelhide' id='businessNumber_"+addCount+"'>"+sampleHtml.html()+"</div>");
    
    $('#businessNumber_'+addCount+' .whatsapp_business_number').attr("name","college_config_option[whatsapp_national_config][business_number]["+addCount+"][whatsapp_business_number]");
    $('#businessNumber_'+addCount+' .whatsapp_business_number_alias').attr("name","college_config_option[whatsapp_national_config][business_number]["+addCount+"][whatsapp_business_number_alias]");
    $('#businessNumber_'+addCount+' .default_whatsapp_no').attr("name","college_config_option[whatsapp_national_config][business_number]["+addCount+"][is_default_number]");
    
    $('#businessNumber_'+addCount+' .whatsapp-field').val("");
    $('#businessNumber_'+addCount+' .whatsapp-field').prop('checked', false);  
    $('#businessNumber_'+addCount+' .whatsapp-field').attr("data-id",addCount);
    //$('#businessNumber_'+addCount+' .remove-div').removeAttr("style");
}

function removeWhatsappBusinessNo(element){
    var businessNumberFieldId = $(element).attr("data-id");
    $('#businessNumber_'+businessNumberFieldId).remove();
}

function addWhatsappInternationalBusinessNo(){
    var count = $("#add_more_count").val();
    var addCount = +$("#add_more_count_international").val() + 1;
    var sampleHtml = $('#businessInternationNumber_1').clone();

    $("#add_more_count_international").val(addCount);
    $("#Whatsapp-business-number-div-international").append("<div class='form-group formAreaCols labelhide' id='businessInternationNumber_"+addCount+"'>"+sampleHtml.html()+"</div>");
    
    $('#businessInternationNumber_'+addCount+' .whatsapp_business_number').attr("name","college_config_option[whatsapp_international_config][business_number]["+addCount+"][whatsapp_business_number]");
    $('#businessInternationNumber_'+addCount+' .whatsapp_business_number_alias').attr("name","college_config_option[whatsapp_international_config][business_number]["+addCount+"][whatsapp_business_number_alias]");
    $('#businessInternationNumber_'+addCount+' .default_whatsapp_no_international').attr("name","college_config_option[whatsapp_international_config][business_number]["+addCount+"][is_default_number]");
    
    $('#businessInternationNumber_'+addCount+' .whatsapp-field').val("");
    $('#businessInternationNumber_'+addCount+' .whatsapp-field').prop('checked', false);  
    $('#businessInternationNumber_'+addCount+' .whatsapp-field').attr("data-id",addCount);
    //$('#businessInternationNumber_'+addCount+' .remove-div').removeAttr("style");
}

function removeWhatsappInternationalBusinessNo(element){
    var businessNumberFieldId = $(element).attr("data-id");
    $('#businessInternationNumber_'+businessNumberFieldId).remove();
}

$(document).on("change", ".default_whatsapp_no" , function() {
      $('.default_whatsapp_no').not(this).prop('checked', false);  
});
$(document).on("change", ".default_whatsapp_no_international" , function() {
      $('.default_whatsapp_no_international').not(this).prop('checked', false);  
});

function confirmDeleteDomain(element) {
    $('#ConfirmMsgBody').html('Do you want to delete the Domain?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false});
    $('#confirmYes').unbind('click').click(function (e) {
        e.preventDefault();
        $(element).parents('div.marketing-domain-childs').remove();
        if($('div.marketing-domain-parent').find('div.marketing-domain-childs').length == 1) {
            $('div.marketing-domain-childs').find('div.removeElementClass').remove();
        }
        $('#ConfirmPopupArea').modal('hide');
    });
    return false;
}

$(document).on('sumo:closing', '#stage_conditions_div select.ifstage', function(e) {
    disableSelectedStageForStageCondition();
});

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function isAlphabet(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;

    if ((charCode >= 97 && charCode <=122) || (charCode >= 65 && charCode <=90)) {
        return true;
    }
    return false;
}

function isNumeric(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if(charCode === 45 || charCode === 43){
        return true;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

//Save Section Wise Data
function SaveSectionData(Section,FormSelect)
{
    if(Section!='LeadsStageConfigContainer' && (typeof CKEDITOR !='undefined') && (typeof CKEDITOR.instances.editor !='undefined')) {
        CKEDITOR.instances.editor.updateElement();
    }
    var conditions  = [];
    var duplicateConditionFlag  = false;
    if( Section=='LeadsStageConfigContainer' && $(".ifstage").length > 0 ){
        $("select.ifstage").each(function(){
            var conditionData   = $(this).val()+"#"+$(this).parent().parent().find('select.thenselect').val()+"#"+$(this).parent().parent().find('select.byrole').val();
            if( $.inArray( conditionData, conditions ) >= 0 ){
                duplicateConditionFlag  = true;
                return;
            }
            conditions.push(conditionData);
        });
    }
    if( Section=='FormQMSTemplateConfigContainerCustom'){
	if($('#college-config-option-qms-replier-name-college-custom-replier:checked').val()==1){
	    if($("#college-config-option-qms-replier-name-college-custom-replier-name").val()==""){
		alertPopup("College Custom Replier is required",'error');
		return;
	    }
	}
	if($('#college-config-option-qms-replier-name-npf-custom-replier:checked').val()==1){
	    if($("#college-config-option-qms-replier-name-npf-custom-replier-name").val()==""){
		alertPopup("NPF Custom Replier is required",'error');
		return;
	    }
	}  
    }

    //    validateStageConditions
    var errorStatus = validateStageConditions();
    if(errorStatus===true){
        alertPopup("Lead Stages Condition cannot be blank!",'error');
        return;
    }

    if(duplicateConditionFlag){
        alertPopup("Conditional Logic has duplicate conditions !",'error');
        return;
    }

    // url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
    if(Section =='TinyConfigBypassContainer'){
        var bypass_urls_error = false;
        var bypass_urls = $('#tiny_config_bypass_url').val();
        if(bypass_urls.length>=4){
            var duplicate_array = [];
            var bypass_urls_array =  bypass_urls.split(",");
            var trimmed_url = '';
            var validDomian = new RegExp(/^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/); 
            bypass_urls_array.forEach(function(item, index){
                item = item.trim();
                if(!item.match(validDomian)){
                    alertPopup("Invalid Domain Name",'error');
                    bypass_urls_error = true;
                    return;
                }
                trimmed_url = item.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
                if(duplicate_array.includes(trimmed_url)){
                    alertPopup("Duplicate Domain Name :"+trimmed_url,'error');
                    bypass_urls_error = true;
                    return;
                }
                duplicate_array.push(trimmed_url);
                if(trimmed_url.length != item.length){
                    alertPopup("Invalid Domain Name",'error');
                    bypass_urls_error = true;
                    return;
                }

            });
        }
        if(bypass_urls.length > 0 && bypass_urls.length<4){
            alertPopup("Invalid Domain Name",'error');
            bypass_urls_error = true;
            return;
        }
        if(bypass_urls_error){
            return false;
        }
    }

    if(Section=='MarketingDomainsContainer'){
        var duplicateDomain = error = false, domains = [];
        $('.domains-error').text('');
        $('.market-domain').each(function(index) {
            var domain = $(this).val().toLowerCase();
            if(domain != '') {
                if($.inArray(domain, domains) === -1) {
                    domains.push(domain);
                } else {
                    duplicateDomain = true;
                }
                if(!CheckIsValidDomain(domain)) {
                    $('span.domains-error').eq(index).text('Invalid Domain');
                    error = true;
                } else if((domain == jsVars.npfDomain) || domain.includes('.'+jsVars.npfDomain)) {
                    $('span.domains-error').eq(index).text('Nopaperforms Domain is not allowed');
                    error = true;
                }
            }
        });
        if(duplicateDomain) {
            alertPopup("Duplicate Domains not allowed", 'error');
        }
        if(error == true || duplicateDomain == true) {
            return false;
        }
    }
    var data;
    if(typeof FormSelect != 'undefined')
    {
        data = $('#'+FormSelect+', #'+Section+' input[type=\'hidden\'], #'+Section+' input:checked').serialize();
    }
    else
    {
        data = $('#'+Section+' input[type=\'hidden\'], #'+Section+' input:checked, #'+Section+' input[type=\'text\'], #'+Section+' select, #'+Section+' textarea').serialize();
        
    }
    
    var url = '';
    if( Section=='LeadsStageConfigContainer' ) {
        url = '/colleges/SaveConfiguration/'+$('#college_id').val();
    } else {
        url = '/colleges/SaveConfiguration/'+jsVars.ConfigurationString;
    }

    $.ajax({
        url: url,
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
            //$('#graphStatsLoaderConrainer').show();
            $('#CollegeConfigurationSection .loader-block').show();
        },
        complete: function() {
            //$('#graphStatsLoaderConrainer').hide();
            $('#CollegeConfigurationSection .loader-block').hide();
        },
        success: function (json) {
            
            if (json['redirect']) {
                location = json['redirect'];
            }else if(json['error']){
                alertPopup(json['error'],'error');
            }
            else if(json['success'] == 200)
            {
                if(Section === 'CommunicationEmailServerConfigContainer' ){
                    if(json['FreeEmailCredit'] !== undefined){
                        $("#freeEmailCredit").html(json['FreeEmailCredit']);
                    }
                    if(json['PaidEmailCredit'] !== undefined){
                        $("#paidEmailCredit").html(json['PaidEmailCredit']);
                    }
                    if(json['AvailableEmailCredit'] !== undefined){
                        $(".availableEmailCredit").html(json['AvailableEmailCredit']);
                    }
                    alertPopup(json['Msg'],'Success');
                }else if(Section === 'SMSConfigNationalContainer' ){
                    if(json['FreeSMSCredit'] !== undefined){
                        $("#freeNationalSMSCredit").html(json['FreeSMSCredit']);
                    }
                    if(json['PaidSMSCredit'] !== undefined){
                        $("#paidNationalSMSCredit").html(json['PaidSMSCredit']);
                    }
                    if(json['AvailableSMSCredit'] !== undefined){
                        $(".availableNationalSMSCredit").html(json['AvailableSMSCredit']);
                    }
                    alertPopup(json['Msg'],'Success');
                }else if(Section === 'SMSConfigInternationalContainer' ){
                    if(json['FreeSMSCredit'] !== undefined){
                        $("#freeInternationalSMSCredit").html(json['FreeSMSCredit']);
                    }
                    if(json['PaidSMSCredit'] !== undefined){
                        $("#paidInternationalSMSCredit").html(json['PaidSMSCredit']);
                    }
                    if(json['AvailableSMSCredit'] !== undefined){
                        $(".availableInternationalSMSCredit").html(json['AvailableSMSCredit']);
                    }
                    alertPopup(json['Msg'],'Success');
                }else if(Section === 'WhatsappConfigNationalContainer' ){
                    if(json['FreeWhatsappCredit'] !== undefined){
                        $("#freeNationalWhatsappCredit").html(json['FreeWhatsappCredit']);
                    }
                    if(json['PaidWhatsappCredit'] !== undefined){
                        $("#paidNationalWhatsappCredit").html(json['PaidWhatsappCredit']);
                    }
                    if(json['AvailableWhatsappCredit'] !== undefined){
                        $(".availableNationalWhatsappCredit").html(json['AvailableWhatsappCredit']);
                    }
                    alertPopup(json['Msg'],'Success');
                }else if(Section === 'WhatsappConfigInternationalContainer' ){
                    if(json['FreeWhatsappCredit'] !== undefined){
                        $("#freeInterNationalWhatsappCredit").html(json['FreeWhatsappCredit']);
                    }
                    if(json['PaidWhatsappCredit'] !== undefined){
                        $("#paidInternationalWhatsappCredit").html(json['PaidWhatsappCredit']);
                    }
                    if(json['AvailableWhatsappCredit'] !== undefined){
                        $(".availableInterNationalWhatsappCredit").html(json['AvailableWhatsappCredit']);
                    }
                    alertPopup(json['Msg'],'Success');
                }else{
                    alertPopup(json['Msg'],'Success');
                }
            }
            
            
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

//Cancel Section Wise Data
function CancelSectionData(Section)
{
    
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

//Show/hide Banner H1 text Margin option 
function ShowBannerMarginOptions(landing_page)
{
    if((typeof jsVars.form_on_banner_landing_page !== 'undefined') && (landing_page !== '') && (jsVars.form_on_banner_landing_page == landing_page))
    {
        $('#BasicConfigurationContainer #BannerMarginSection').show();
    }
    else
    {
        $('#BasicConfigurationContainer #BannerMarginSection').hide();
    }
}

function addmoreLeadStage(div_class){
    
    var stgClone = jQuery('.'+div_class+'>div').eq(0).clone();
    jQuery(stgClone).find('.chosen-container').remove();
    jQuery(stgClone).find('.removeElementClass').html('<a class="text-danger" href="javascript:void(0);" title="Delete Lead Stage" onclick="return confirmDelete(this,\''+div_class+'\',\'stage\');"><i class="fa fa-minus-circle font20" aria-hidden="true"></i></a>'); 
    jQuery(stgClone).find('select').val('');
    //add more sub stage div
    var addMoreDiv = jQuery(stgClone).find('div.add_more_sub_stage_div');
    addMoreDiv.find('.removeElementClass').html('');
    addMoreDiv.find('a').removeAttr('onclick');
    addMoreDiv.attr('id','').hide();
    //add more sub stage listing div
    var addMoreDiv = jQuery(stgClone).find('div.load_sub_stage_div');
    addMoreDiv.html('').attr('id','');
    //set value to No in Last Child
    jQuery(stgClone).find('select:last-child').val(0);    
    jQuery('.'+div_class).append(stgClone);
    jQuery('.chosen-select').chosen();
    var stage_count =1;
    // reset stage count
    jQuery('.'+div_class+'>div').find('.count_stage').each(function(){
        jQuery(this).html(stage_count++);
    });
    $('.con_lead_stage').change(selectLeadStage);
    disabledSelectedStages();
    return false;
}

function removeLeadStage(elem,div_class){
    
    
    $(elem).closest('.row').remove();
    var stage_count =1;
    // reset stage count
    jQuery('.'+div_class+'>div').find('.count_stage').each(function(){
        jQuery(this).html(stage_count++);
    });
    disabledSelectedStages();
    return false;
}

function disabledSelectedStages(){
    $(".con_lead_stage option, .con_lead_sub_stage option").attr('disabled',false);
    $(".con_lead_stage, .con_lead_sub_stage").each(function(){
        if(($(this).val() != null) && ($(this).val().length)) {
            $("."+$(this).val()+":not(:selected)").attr('disabled',true);
        }
    });
    $('.con_lead_stage, .con_lead_sub_stage').trigger("chosen:updated");
}

function addMoreBackendCondition(div_class){
    var stgClone = jQuery('#'+div_class+'>div').eq(0).clone();
    jQuery(stgClone).find('.chosen-container').remove();
    jQuery(stgClone).find('.removeElementClassCondition').html('<a href="javascript:void(0);" class="text-danger" onclick="return confirmDelete(this,\''+div_class+'\',\'condition\');"><i class="fa fa-minus-circle font20" aria-hidden="true"></i></a>');

    jQuery(stgClone).find('select').val('');
    jQuery('#'+div_class).append(stgClone);
    var by_count =0;
    // reset stage count
    jQuery('#'+div_class+'>div').find('.ifstage').each(function(){
        this.name = 'lead_stage_config[backend_user_conditions][condition]['+by_count+'][stage][]';
        by_count++;
    });
    by_count =0;
    jQuery('#'+div_class+'>div').find('.thenselect').each(function(){
        this.name = 'lead_stage_config[backend_user_conditions][condition]['+by_count+'][access]';
        by_count++;
    });
    by_count =0;
    jQuery('#'+div_class+'>div').find('.byrole').each(function(){
        this.name = 'lead_stage_config[backend_user_conditions][condition]['+by_count+'][role][]';
        by_count++;
    });

    jQuery('.chosen-select').chosen();
    return false;
}

function addMoreStageCondition(div_class){
    var stgClone = jQuery('#'+div_class+'>div').eq(0).clone();
    jQuery(stgClone).find('.chosen-container').remove();
    jQuery(stgClone).find('.removeElementClassCondition').html('<a href="javascript:void(0);" class="text-danger" onclick="return confirmDelete(this,\''+div_class+'\',\'stage_condition\');"><i class="fa fa-minus-circle font20" aria-hidden="true"></i></a>'); 

    jQuery(stgClone).find('div.SumoSelect p').remove();
    jQuery(stgClone).find('select').val('');
    jQuery('#'+div_class).append(stgClone);
    jQuery(stgClone).find('.sumo_select').SumoSelect({ selectAll : true, search : true});
    var by_count =0;
    // reset stage count
    jQuery('#'+div_class+'>div').find('.ifstage').each(function(){
        this.name = 'lead_stage_config[stage_conditions][condition]['+by_count+'][stage][]';
        by_count++;
    });
    by_count =0;
    jQuery('#'+div_class+'>div').find('.thenselect').each(function(){
        this.name = 'lead_stage_config[stage_conditions][condition]['+by_count+'][access]';
        by_count++;
    });
    by_count =0;
    jQuery('#'+div_class+'>div').find('.byrole').each(function(){
        this.name = 'lead_stage_config[stage_conditions][condition]['+by_count+'][role][]';
        by_count++;
    });
    
    jQuery('select.sumo_select').on('sumo:opened', function(sumo) {
        // Do stuff here
        //console.log("Drop down opened", sumo);
        $('.optionGroup').parent().parent().siblings().addClass('optionGroupChild');
        $('.optionGroup').parent().parent().removeClass('optionGroupChild');

        $("i.optionLastChild").each(function(){
            $(this).parent().parent().addClass('optionGroupChild2');
        });
    });

    disableSelectedStageForStageCondition();
    jQuery('.sumo_select').SumoSelect({ selectAll : true, search : true});
    jQuery('.chosen-select').chosen();
    return false;
}

function removeBackendCondition(elem,div_class){
    $(elem).closest('.row').remove();

    var by_count =0;
    // reset stage count
    jQuery('#'+div_class+'>div').find('.ifstage').each(function(){
        this.name = 'lead_stage_config[backend_user_conditions][condition]['+by_count+'][stage][]';
        by_count++;
    });
    by_count =0;
    jQuery('#'+div_class+'>div').find('.thenselect').each(function(){
        this.name = 'lead_stage_config[backend_user_conditions][condition]['+by_count+'][access]';
        by_count++;
    });
    by_count =0;
    jQuery('#'+div_class+'>div').find('.byrole').each(function(){
        this.name = 'lead_stage_config[backend_user_conditions][condition]['+by_count+'][role][]';
        by_count++;
    });
    return false;
}

function removeStageCondition(elem,div_class){
    $(elem).closest('.row').remove();
    
    var by_count =0;
    // reset stage count
    jQuery('#'+div_class+'>div').find('.ifstage').each(function(){
        this.name = 'lead_stage_config[stage_conditions][condition]['+by_count+'][stage][]';
        by_count++;
    });
    by_count =0;
    jQuery('#'+div_class+'>div').find('.thenselect').each(function(){
        this.name = 'lead_stage_config[stage_conditions][condition]['+by_count+'][access]';
        by_count++;
    });
    by_count =0;
    jQuery('#'+div_class+'>div').find('.byrole').each(function(){
        this.name = 'lead_stage_config[stage_conditions][condition]['+by_count+'][role][]';
        by_count++;
    });

    disableSelectedStageForStageCondition();
    jQuery('.sumo_select').SumoSelect();
    jQuery('.chosen-select').chosen();
    return false;
}

function confirmDelete(elem,div_class,type){
    var dependent  =  false;
    if(type=='stage'){
        $('.ifstage').each(function(){
            if( $.inArray($(elem).parent().parent().parent().find('.con_lead_stage').val(),$(this).val()) !== -1 ){
                alertPopup('You need to first delete condition then remove Stage','error');
                dependent  =  true;
            }
        });
    }
    if(!dependent){
        $('#ConfirmMsgBody').html('Do you want to delete '+type+'?');
        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
         .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
            e.preventDefault();
            if(type=='condition') {
                removeBackendCondition(elem,div_class);
            }
            else if(type === 'stage_condition') {
                removeStageCondition(elem,div_class);
            }
            else {
                removeLeadStage(elem,div_class);
            }
            $('#ConfirmPopupArea').modal('hide');
        });
    }
    return false;
}

function selectLeadStage(){ 
        var sel = $(this);
        var prev = $(this).data('prev');
        var cur = $(this).val();
        $('.ifstage').each(function(){
            if($.inArray(prev,$(this).val()) !== -1){
                alertPopup('You need to first delete condition then remove Stage','error');
                $(sel).val(prev).trigger("chosen:updated");
            }else{
                $(this).data("prev",cur);
            }
        });
        disabledSelectedStages();
}
//by defualt open Lead stage config on reload if saved
$(document).ready(function(){//defaultSection
    if(typeof jsVars.defualtConfig != 'undefined' && jsVars.defualtConfig != ''){
        $("#accordion").find('#'+jsVars.defualtConfig).addClass("in");
        $("html, body").scrollTop($('#'+jsVars.defualtConfig).offset().top);
    }
    disabledSelectedStages();
    $('.con_lead_stage').each(function(){
        $(this).data("prev",$(this).val());
    });
    
    $('.con_lead_stage').change(selectLeadStage);
    
    if($('#lead_stage_type').length > 0) {
        $('#lead_stage_type').SumoSelect({ search: true, searchText:'Search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
    }
    
    //Sticky Counselor/Agent in Knowlarity
    if ($("#stickyUserPostPaymentApprovedSelect").length > 0) {
        $('#stickyUserPostPaymentApprovedSelect').SumoSelect({placeholder: 'Select Counselor/Agent', search: true, searchText:'Select Counselor/Agent', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
    }
    //Sticky Counselor/Agent in Mcubes
    if ($("#stickyUserToUnassignedLeadSelectMcubes").length > 0) {
        $('#stickyUserToUnassignedLeadSelectMcubes').SumoSelect({placeholder: 'Select Counselor/Agent', search: true, searchText:'Select Counselor/Agent', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
    }
    
    //Sticky Counselor/Agent in Exotel
    if ($("#stickyUserToUnassignedLeadSelect").length > 0) {
        $('#stickyUserToUnassignedLeadSelect').SumoSelect({placeholder: 'Select Counselor/Agent', search: true, searchText:'Select Counselor/Agent', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
    }
    //User Param in Myoperator
    if ($("#userParamSelect").length > 0) {
        $('#userParamSelect').SumoSelect({placeholder: 'Select User Param', search: true, searchText:'Select User Param', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
    }
    
    //get telephony vendor selected
    if (($("#cloudTelephonyVendorSelect").length > 0) && ($("#cloudTelephonyVendorSelect").val() == 'minavo') && 
        (typeof jsVars.currentCollegeId != 'undefined')) {
        var minavoDefaultCounselor = '';
        if (typeof jsVars.minavoDefaultCounselor != 'undefined') {
            minavoDefaultCounselor = jsVars.minavoDefaultCounselor;
        }
        getCollegeCounselorList(jsVars.currentCollegeId, minavoDefaultCounselor);
    }
});

// Show/Hide SMS vendor Section 
function showHideVendorSection(parentDiv, prefix, vendor)
{
    var vendorUpperCase = 'Solutionsinfini';
    showHideAccordionSection(vendorUpperCase, parentDiv, prefix, vendor);
}

// Show/Hide IVR vendor Section 
function showHideIvrVendorSection(parentDiv, prefix, vendor)
{
    var vendorUpperCase = 'Ozontel';
    showHideAccordionSection(vendorUpperCase, parentDiv, prefix, vendor);
}

// Show/Hide CRM Section 
function showHideCRMSection(parentDiv, prefix, vendor)
{
    var vendorUpperCase = '';
    showHideAccordionSection(vendorUpperCase, parentDiv, prefix, vendor);
    if(vendor != '') {
        vendorUpperCase = vendor.charAt(0).toUpperCase() + vendor.slice(1);//vendor.toUpperCase();
        $('div#' + parentDiv + ' div#' + prefix + vendorUpperCase +'Div :input').val('');
    }
}

//Show/Hide SMS/IVR vendor Section 
function showHideAccordionSection(vendorUpperCase, parentDiv, prefix, vendor)
{
    if((parentDiv != '') && (prefix != '')) {
        if(vendor != '') {
            vendorUpperCase = vendor.charAt(0).toUpperCase() + vendor.slice(1);//vendor.toUpperCase();
        }
        //alert(vendorUpperCase); alert('div#' + parentDiv + ' div#' + prefix + vendorUpperCase +'Div]');
        $('div#' + parentDiv + ' div[id^=' + prefix +']').attr('style','display:none');
        $('div#' + parentDiv + ' div#' + prefix + vendorUpperCase +'Div').attr('style','display:block');
    }
}

// Show/Hide PushNotification Section 
function showHidePushNotificationSection(parentDiv, prefix, vendor)
{
    var vendorUpperCase = '';
    // make blank on change
    $('div#' + parentDiv + ' div[id^=' + prefix +'] :input').val('');
    showHideAccordionSection(vendorUpperCase, parentDiv, prefix, vendor);
    if(vendor != '') {
        vendorUpperCase = vendor.charAt(0).toUpperCase() + vendor.slice(1);//vendor.toUpperCase();
        $('div#' + parentDiv + ' div#' + prefix + vendorUpperCase +'Div :input').val('');
    }
}

//Show/Hide Email vendor Section 
function showHideEmailAccordionSection(vendor,channel)
{
    if(channel === 'promotional'){
        $(".email_promotional_div").hide();
        if(vendor === ""){
            $(".email_promotional_div").hide();
        }else if(vendor === "netcore"){
            $("#netcore_promotional_div").show();
            $("#extra_promotional_div").show();
        }else if(vendor === "sendgrid"){
            $("#sendgrid_promotional_div").show();
            $("#extra_promotional_div").show();
        }else if(vendor === "pepipost"){
            $("#pepipost_promotional_div").show();
            $("#extra_promotional_div").show();
        }
    }else{
        $(".email_transactional_div").hide();
        if(vendor === 'aws'){
            $(".email_transactional_div").hide();
        }else if(vendor === 'netcore'){
            $("#netcore_transactional_div").show();
        }else if(vendor === 'sendgrid'){
            $("#sendgrid_transactional_div").show();
        }else if(vendor === 'pepipost'){
            $("#pepipost_transactional_div").show();
        }else{
            $(".email_transactional_div").hide();
        }
    }
}

// Show/Hide CRM Section 
function showHideWhatsappSection(parentDiv, prefix, vendor)
{
    var vendorUpperCase = '';
    showHideAccordionSection(vendorUpperCase, parentDiv, prefix, vendor);
    if(vendor != '') {
        vendorUpperCase = vendor.charAt(0).toUpperCase() + vendor.slice(1);//vendor.toUpperCase();
        $('div#' + parentDiv + ' div#' + prefix + vendorUpperCase +'Div :input').val('');
    }
}

/**copy code ***/

function selectText(id){
    var sel, range;
    var el = document.getElementById(id); //get element id
    if (window.getSelection && document.createRange) { //Browser compatibility
      sel = window.getSelection();
      if(sel.toString() == ''){ //no text selection
         window.setTimeout(function(){
            range = document.createRange(); //range object
            range.selectNodeContents(el); //sets Range
            sel.removeAllRanges(); //remove all ranges from selection
            sel.addRange(range);//add Range to a Selection.
        },1);
      }
    }else if (document.selection) { //older ie
        sel = document.selection.createRange();
        if(sel.text == ''){ //no text selection
            range = document.body.createTextRange();//Creates TextRange object
            range.moveToElementText(el);//sets Range
            range.select(); //make selection.
        }
    }
}

function copyToClipboard(element) {
	
    selectText(element); 
    var $temp = $("<input>");
      //alert('hello');
    $("body").append($temp);
    $temp.val($('#'+element).text()).select();
    document.execCommand("copy");
    $temp.remove();
}


function loadDefaultStageScoreValue(elem, fetch){
    
    if(typeof $(elem).val() == 'undefined' || $(elem).val() == ''){
        return;
    }
    
    if (typeof fetch == 'undefined') {
        fetch = 'both';
    }
    var taxid= $(elem).val();
    $.ajax({
        url: '/taxonomies/load-default-stage-score-value/',
        type: 'post',
        data: {id:taxid, fetch: fetch},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
            //$('#graphStatsLoaderConrainer').show();
            $('#CollegeConfigurationSection .loader-block').show();
        },
        complete: function() {
            //$('#graphStatsLoaderConrainer').hide();
            $('#CollegeConfigurationSection .loader-block').hide();
        },
        success: function (json) {
            if (json['redirect']) {
                location = json['redirect'];
            }
            else if(json['error']){
                alertPopup(json['error'],'error');
            }
            else if(json['success'] == 200){
                if((fetch == 'both') && ($(elem).closest('div.row').find('.con_lead_stage_score').length > 0)) {
                    $(elem).closest('div.row').find('.con_lead_stage_score').val(json['score']);                    
                }
                //lead sub stages changes
                if (!json['leadSubStage']) {
                    resetLeadSubStageDiv(elem);
                } else if (json['leadSubStage']) {
                    configLeadSubStageDiv(elem, taxid, json['leadSubStage']);
                    if (fetch == 'onlySubStage') {
                        addmoreLeadSubStage('parentDivSubStage', taxid);
                    }
                }
                $('.chosen-select').trigger('chosen:updated');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

//Ozontel Mode Setting 
$(document).on('change', 'select#ozonetelModeSelect', function() {
    var valSelect = $(this).val();
    //console.log(valSelect);
    if (valSelect == null) {
        alertPopup('Please select ozonetel mode', 'error');
        $('#ozonetelInboundCampaigns, #ozonetelOutboundCampaigns').val('');
    }
    else if ($.inArray("online", valSelect) < 0) {
        $('#ozonetelInboundCampaigns, #ozonetelOutboundCampaigns').val('');
    }
});

//For show Hide extra Paramenter of payment Gateway
function showHidePaymentGatewayParams(obj){
    var getGatewayName=$(obj).data('gatewayname');
    if($('#'+getGatewayName+'_payment_gateway_extra_param').length){
       if($(obj).is(':checked')){
            $('#'+getGatewayName+'_payment_gateway_extra_param').show();
        } else {
            $('#'+getGatewayName+'_payment_gateway_extra_param').hide();
        } 
    }
}

function resetLeadSubStageDiv(elem) {
    var add_more_sub_stage_div = $(elem).closest('div.block_first').find('.add_more_sub_stage_div');
    add_more_sub_stage_div.find('a').removeAttr('onclick', '');
    add_more_sub_stage_div.attr('id','').hide();
    var load_sub_stage_div = $(elem).closest('div.block_first').find('.load_sub_stage_div');
    load_sub_stage_div.attr('id','').html('');
}

function configLeadSubStageDiv(elem, taxid, leadSubStage) {
    var add_more_sub_stage_div = $(elem).closest('div.block_first').find('.add_more_sub_stage_div');
    add_more_sub_stage_div.find('a').attr('onclick','return addmoreLeadSubStage(\'parentDivSubStage\', \'' + taxid +'\');');
    add_more_sub_stage_div.attr('id','addMoreLeadSubStageDiv' + taxid).show();
    var load_sub_stage_div = $(elem).closest('div.block_first').find('.load_sub_stage_div');
    if (typeof leadSubStage != 'undefined') {
        load_sub_stage_div.attr('id', 'parentDivSubStage' + taxid).html('<input type=\'hidden\' value=\'' + JSON.stringify(leadSubStage) + '\'/>');
    }
}

function addmoreLeadSubStage(div_class, elemId) {
    if((jQuery('div#'+div_class + elemId +' > div.con_lead_sub_stage_div').length == 0) && 
            (jQuery('div#'+div_class + elemId).find('input[type=\'hidden\']').length == 0)) {
        return loadDefaultStageScoreValue(jQuery('div#'+div_class + elemId).parent('div.block_first').find('select:first-child'), 'onlySubStage');
    }
    
    if (jQuery('div#'+div_class + elemId +' > div.con_lead_sub_stage_div').length > 0) {
        var stgClone = jQuery('div#'+div_class + elemId +' > div.con_lead_sub_stage_div').eq(0).clone();
        jQuery(stgClone).find('.chosen-container').remove();
        jQuery(stgClone).find('.removeElementClass').html('<a class="text-danger" href="javascript:void(0);" title="Delete Lead Sub Stage" onclick="return confirmSubStageDelete(this,\''+div_class+'\',\'' + elemId +'\');"><i class="fa fa-minus-circle font20" aria-hidden="true"></i></a>'); 
        jQuery(stgClone).find('select').val('');
        //set value to No in Last Child
        jQuery(stgClone).find('select:last-child').val(0);
        
    } else if (jQuery('div#'+div_class + elemId).find('input[type=\'hidden\']').length > 0) {
        var leadStageData = jQuery('div#'+div_class + elemId).find('input[type=\'hidden\']').val();
        leadStageData = $.parseJSON(leadStageData);
        if (typeof leadStageData[elemId] == 'undefined') {
            return;
        }
        var stgClone = getSubStageHtml(leadStageData, elemId);
    }
    jQuery('div#'+div_class + elemId).append(stgClone);
	jQuery('div#'+div_class + elemId).parents('div.block_first').addClass('arrawShow');
    jQuery('.chosen-select').chosen();
    var stage_count =1;
    // reset stage count
    jQuery('div#'+div_class + elemId + ' > div.con_lead_sub_stage_div').find('.count_sub_stage').each(function(){
        jQuery(this).html(stage_count++);
    });
    disabledSelectedSubStages(div_class, elemId);
    return false;
}

function confirmSubStageDelete(elem, div_class, elemId) {
    
    $('#ConfirmMsgBody').html('Do you want to delete sub stage?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
    .one('click', '#confirmYes', function (e) {
        e.preventDefault();
        removeLeadSubStage(elem, div_class, elemId);
        $('#ConfirmPopupArea').modal('hide');
    });    
    return false;
}

function removeLeadSubStage(elem, div_class, elemId) {
    $(elem).closest('.con_lead_sub_stage_div').remove();
    var stage_count = 1;
    // reset stage count
    jQuery('div#'+ div_class + elemId +' > .con_lead_sub_stage_div').find('.count_sub_stage').each(function(){
        jQuery(this).html(stage_count++);
    });
    disabledSelectedStages(div_class, elemId);
    return false;
}

function disabledSelectedSubStages(div_class, elemId) {
    $("div#" + div_class + elemId + " .con_lead_sub_stage option").attr('disabled',false);
    $("div#" + div_class + elemId + " .con_lead_sub_stage").each(function(){
        if(($(this).val() != null) && ($(this).val().length)) {
            $("."+$(this).val()+":not(:selected)").attr('disabled',true);
        }
    });
    $("div#" + div_class + elemId + " .con_lead_sub_stage").trigger("chosen:updated");
}

function getSubStageHtml(leadStageData, elemId) {
    var html = '    <div class="rowSpaceReduce logic_block_div con_lead_sub_stage_div">';
    html += '           <div class="col-sm-2 margin-top-15">';
    html += '               <div style="padding-left:15px;"><strong>Sub Stage <span class="count_sub_stage"></span></strong></div>';
    html += '           </div>';
    html += '           <div class="col-sm-3 margin-top-10">';
    html += '               <select name="lead_stage_config[lead_sub_stages]['+ elemId +'][]" class="form-group chosen-select padding10 con_lead_sub_stage" data-placeholder="Select Lead Sub Stage" onchange="disabledSelectedSubStages(\'parentDivSubStage\', \''+ elemId +'\')">';
    html += '                   <option value="" selected="selected">Select Lead Sub Stage</option>';
    for(var i in leadStageData[elemId]) {
        var subStageId = i.replace('w','');
    html += '                   <option value="'+ subStageId +'" class="'+ subStageId +'">'+ leadStageData[elemId][i] +'</option>';       
    }
    html += '               </select>';
    html += '           </div>';
    html += '           <div class="col-sm-1 col-sm-offset-1 margin-top-10">';
    html += '               <select name="lead_stage_config[sub_stage_required]['+ elemId +'][]" class="form-group chosen-select padding10 con_lead_sub_stage" data-placeholder="Select Required">';
    html += '                   <option value="0" selected="selected">No</option>';
    html += '                   <option value="1">Yes</option>';
    html += '               </select>';
    html += '           </div>';
    html += '           <div class="col-sm-1 col-sm-offset-1 margin-top-10">&nbsp</div>';
    html += '           <div class="col-sm-1 col-sm-offset-1 margin-top-15">';
    html += '               <a href="javascript:void(0);" class="" title="Add Lead Sub Stage" onclick="return addmoreLeadSubStage(\'parentDivSubStage\', '+ elemId +');"><i class="fa fa-plus-circle font20" aria-hidden="true"></i></a>';
    html += '               <div class="removeElementClass pull-right">';
    html += '                   <a class="text-danger" href="javascript:void(0);" title="Delete Lead Sub Stage" onclick="return confirmSubStageDelete(this,\'parentDivSubStage\', '+ elemId +');"><i class="fa fa-minus-circle font20" aria-hidden="true"></i></a>';
    html += '               </div>';
    html += '           </div>';
    html += '       </div>';
    return html;
}


$(document).on('click','#college-config-option-qms-replier-name-npf-custom-replier',function(){
    if($(this).is(':checked')) {
        $("#college-config-option-qms-replier-name-npf-custom-replier-name").show();
    }else{
      $("#college-config-option-qms-replier-name-npf-custom-replier-name").hide();
    }
});

$(document).on('click','#college-config-option-qms-replier-name-college-custom-replier',function(){
    if($(this).is(':checked')) {
        $("#college-config-option-qms-replier-name-college-custom-replier-name").show();
    }else{
      $("#college-config-option-qms-replier-name-college-custom-replier-name").hide();
    }
});

$(document).on('change', '#cloudTelephonyVendorSelect', function () {
    var vendor = this.value;
    if ((vendor == 'minavo') && (typeof jsVars.currentCollegeId != 'undefined')) {
        var minavoDefaultCounselor = '';
        getCollegeCounselorList(jsVars.currentCollegeId, minavoDefaultCounselor);
    }    
});

function getCollegeCounselorList(collegeId, minavoDefaultCounselor) {
    if ($("#cloudTelephonyVendorSelect").val() == '') {
        return;
    }
    var roleDropdown = ['9'];//only counselor user
    var htmlCounselorSelect = '<option value="">Select Counselor</option>';
    $('select#ManivoCounselorSelect').html(htmlCounselorSelect);
    $.ajax({
        url: jsVars.getCollegeUserListLink,
        type: 'post',
        data: {collegeId: collegeId, roleDropdown: roleDropdown, default_assigned_child_users: minavoDefaultCounselor},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
            $('select#ManivoCounselorSelect').trigger('chosen:updated');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data !== "") {                    
                    htmlCounselorSelect += responseObject.data;
                    $('select#ManivoCounselorSelect').html(htmlCounselorSelect);
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(responseObject.message, 'error');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getCollegeLeadStage() {
    if ($("#collegeId").val() == '') {
        $('#LeadsStageConfigContainer').html('<div class="alert alert-danger">Please select institute.</div>');
        return;
    }
    $('#LeadsStageConfigContainer').html('');
    $.ajax({
        url: '/college-settings/ajax-lead-stage-configuration',
        type: 'post',
        data: {collegeId: $("#collegeId").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
        },
        success: function (response) {
            if (response == 'invalid_csrf' || response == 'invalid_request')  {
                window.location.reload();
            } else {
                $('#LeadsStageConfigContainer').html(response);
                $('.chosen-select').chosen();
                
                leadStageConfigConditionJS();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getIntakeConfig() {
    $('.error').html('');
    var collegeId = $('#college_id').val(), formId = $('#form_id').val(), error = 0;
    if(collegeId == '') {
        $('#college_id_validation').html('Please select institute');
        error = 1;
    }
    if(formId == '' || formId === '0') {
        $('#form_id_validation').html('Please select form');
        error = 1;
    }

    if(error == 0) {
        $.ajax({
            url: '/college-settings/ajax-intake-config',
            type: 'post',
            dataType: 'html',
            data: {
                "college_id": collegeId,
                "form_id": formId,
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                if(data=="session_logout"){
                    window.location.reload(true);
                }
                $('#IntakeConfigContainer').html(data);
                $(".chosen-select").chosen();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

if(jQuery('#getIntakeConfig').length > 0){
	$(document).on("change", '#getIntakeConfig #form_id', function(event) {
		getIntakeConfig();
	});
}

$(document).on("change", '#college_id, #form_id', function() {
    $('#IntakeConfigContainer').html('');
});

function saveIntakeDetails() {
    $('.error').html('');
    var intakeName = $.trim($('#intake_name').val()), fieldSelected=false, duplicateFieldSelected = false , fields = [], error = 0, val='';
    if(intakeName == '') {
        $('#intake_name_validation').html('Please enter Intake Name');
        error = 1;
    }
    $( "select[name^='field_']" ).each(function(index, element) {
        val = $.trim($(element).val());
        if(val != '') {
            fieldSelected = true;
            if($.inArray(val, fields) >= 0) {
                duplicateFieldSelected = true;
            } else {
                fields.push(val);
            }
        }
   });

    if(!fieldSelected) {
        $('#field_validation').html('Select atleast one field');
        error = 1;
    } else if(duplicateFieldSelected) {
        $('#field_validation').html('Duplicate fields Selected');
        error = 1;
    }

    if(error == 0) {
        $.ajax({
            url: '/college-settings/save-intake-config',
            type: 'post',
            dataType: 'json',
            data: $('#CreateIntakeForm').serialize(),
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                if(data.success== true){
                    if(data.redirect != '') {
                        location.href = data.redirect;
                    }
                } else {
                    if(typeof data.error.common != 'undefined') {
                        if(data.error.common == 'session_logout' || data.error.common == 'invalid_csrf') {
                            window.location.reload(true);
                        } else {
                            alertPopup(data.error.common, 'error');
                        }
                    } else {
                        for (var key in data.error) {
                            if (data.error.hasOwnProperty(key)) {
                                $("#"+key+"_validation").html(data.error[key]);
                            }
                        }
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

function getIntakeCount() {
    $.ajax({
        url: '/college-settings/get-intake-count',
        type: 'post',
        dataType: 'json',
        data: $('#CreateIntakeForm').serialize(),
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        success: function (data) {
            if(data.success== true){
                $("#div_view_count").show();
                $("#div_view_count").html('<big id="view_count" class="view-count-new animated bounce delay-2s">'+data.count+'</big>');
            } else {
                if(typeof data.error.common != 'undefined') {
                    if(data.error.common == 'session_logout' || data.error.common == 'invalid_csrf') {
                        window.location.reload(true);
                    } else {
                        alertPopup(data.error.common, 'error');
                    }
                } else {
                    for (var key in data.error) {
                        if (data.error.hasOwnProperty(key)) {
                            $("#"+key+"_validation").html(data.error[key]);
                        }
                    }
                }
            }
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function processIntakeFile() {
    var fd = new FormData();
    var file_data = $('input[type="file"]')[0].files; // for multiple files
    for(var i = 0;i<file_data.length;i++){
        fd.append("csv_file", file_data[i]);
    }
    $.ajax({
        url: jsVars.processIntakeFileUrl,
        type: 'post',
        dataType: 'json',
        data: fd,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        cache: false,
        async : false,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function (xhr) {
            $('.text-danger').text('');
            $('#listloader').show();
        },
        success: function (data) {
            if(data.success== true){
                alertPopup('Successfully uploaded intake file.', 'success', jsVars.intakeListUrl);
            } else {
                if(typeof data.error.common != 'undefined') {
                    if(data.error.common == 'session_logout' || data.error.common == 'invalid_csrf') {
                        window.location.reload(true);
                    } else {
                        alertPopup(data.error.common, 'error');
                    }
                } else {
                    for (var key in data.error) {
                        if (data.error.hasOwnProperty(key)) {
                            $("#"+key+"_error").html(data.error[key]);
                        }
                    }
                }
            }
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function loadMoreIntakes(listingType){
    if($("#college_id").val()==""){
        $('#load_msg_div').show();
        $('#load_msg').html('Please select a institute name to view intake lists').show();
        $('.ajaxDownloadView, #LoadMoreArea').hide();
        $('#IntakeListContainerSection').html('');
        return;
    }

    if(listingType === 'reset'){
        $("#page").val(0);
    }
    $.ajax({
        url: jsVars.loadMoreIntakeLink,
        type: 'post',
        data: $('#filterIntakeForm').serialize(),
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#intakeListLoader.loader-block').show();
        },
        complete: function () {
            $('#intakeListLoader.loader-block').hide();
        },
        success: function (html) {
            if (html === 'session_logout' || html === 'invalid_csrf'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (html == 'no_record_found'){
                if($("#page").val() == 0) {
                    $('#IntakeListContainerSection').html('');
                    $('#load_msg_div').show();
                    $('#load_msg').html('No intakes found for the filter applied.').show();
                    $('#LoadMoreArea').hide();
                } else {
                    $('#load_more_results tbody').append('<tr><td colspan="9" class="text-center text-danger fw-500"> No More record</td></tr>');
                    $('#LoadMoreArea').hide();
                }
            }else{
                html    = html.replace("<head/>", "");
                var countRecord = (html.match(/listDataRow/g) || []).length;
                if(listingType === 'reset'){
                    $('#IntakeListContainerSection').html(html);
                }else{
                    $('#IntakeListContainerSection').find("tbody").append(html);
                }
                if(countRecord < 10){
                    $('#LoadMoreArea').hide();
                    $('#load_more_results tbody').append('<tr><td colspan="9" class="text-center text-danger fw-500"> No More record</td></tr>');
                }else{
                    $('#LoadMoreArea').show();
                }
                $("#page").val(parseInt($("#page").val())+1);
                $('.ajaxDownloadView').show();
                $('#load_msg_div').hide();
                $('.offCanvasModal').modal('hide');
            }
            table_fix_rowcol();
            dropdownMenuPlacement();	
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$(document).on('click', 'div#IntakeListContainerSection a.stepsOpt',function () {
    var $this= $(this), id = $(this).attr('id');
    if(id != '') {
        var arr = id.split('_');
        if(typeof arr[1] != 'undefined' && arr[1] != '') {
            $.ajax({
                url: '/college-settings/get-intake-name',
                type: 'post',
                data: {intakeId:arr[1]},
                dataType: 'html',
                headers: {
                    "X-CSRF-Token": jsVars.csrfToken
                },
                beforeSend: function () {
                    $('#intakeListLoader.loader-block').show();
                },
                complete: function () {
                    $('#intakeListLoader.loader-block').hide();
                },
                success: function (html) {
                    if (html === 'session_logout' || html === 'invalid_csrf'){
                        window.location.reload();
                    }else {
                        $this.attr('data-content',html);
                        $this.popover('show');
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        }
    }
});


function leadStageConfigConditionJS(){
    
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

    $("select.checkboxSumoJS").each(function(){
        $('[name="'+$(this).attr('name')+'"]')[0].sumo.reload();
    });

    disableSelectedStageForStageCondition();
}


function disableSelectedStageForStageCondition(){

    jQuery('#stage_conditions_div>div').find('.ifstage').each(function(){
        jQuery(this).find('option').each(function(){
            jQuery(this).prop('disabled',false);
            jQuery(this).removeAttr('disabled');
        });
    });
    var selif1 = 0;
    jQuery('#stage_conditions_div>div').find('.ifstage').each(function(){
        jQuery('#stage_conditions_div>div').find('.ifstage')[selif1].sumo.reload();
        selif1++;
    });


    var allOption = [];
    jQuery('#stage_conditions_div>div').find('.ifstage').each(function(){
        var nam = $(this).attr('name');
        var valArray = $('[name="'+nam+'"]').val();
        for(var i in valArray){
            allOption.push(valArray[i]);
        }
    });


     // jQuery('#stage_conditions_div>div').find('.ifstage').each(function(){
     //    // jQuery('#stage_conditions_div>div').find('.ifstage')[selif].sumo.reload();
     // });

    if(allOption.length>0){
        var selif = 0;
         jQuery('#stage_conditions_div>div').find('.ifstage').each(function(){

            for(var iopt in allOption){
                jQuery(this).find('option[value="'+allOption[iopt]+'"]:not(:selected)').prop('disabled',true);
            }
         });

         jQuery('#stage_conditions_div>div').find('.ifstage').each(function(){
            jQuery('#stage_conditions_div>div').find('.ifstage')[selif].sumo.reload();

             selif++;
         });
    }
}


$(document).on('change', '#stage_conditions_div select.byrole', function() {

    return;
    var selectVal = this.value;
    if(typeof selectVal != 'undefined' && selectVal.match(/^\d+$/)){
        var aaa = [];
        $('[name="'+$(this).attr('name')+'"]').find('option').each(function(){
            var aad = this.value;
            if(aad.indexOf(selectVal+'_')>-1){
               aaa.push(aad);
            }
        });

        for(var i in aaa){
            $('[name="'+$(this).attr('name')+'"]')[0].sumo.selectItem(aaa[i]);
        }
    }
});


function validateStageConditions(){
    var error = false;
  $('#stage_conditions_div').find('.ifstage').each(function(i,j){
    var stage_value = $('[name="lead_stage_config[stage_conditions][condition]['+i+'][stage][]"]').val();
    var role_value = $('[name="lead_stage_config[stage_conditions][condition]['+i+'][role][]"]').val();
    var access_value = $('[name="lead_stage_config[stage_conditions][condition]['+i+'][access]"]').val();

    var valueCount = [];
    if(i === 0){
        if(stage_value !== null && typeof stage_value !== 'undefined' && stage_value.length>0){
            valueCount.push(1);
        }
        if(role_value !== null && typeof role_value !== 'undefined' && role_value.length>0){
            valueCount.push(1);
        }
        if(access_value !== null && typeof access_value !== 'undefined' && access_value !== ''){
            valueCount.push(1);
        }
        if(valueCount.length>0 && valueCount.length<3){
            error = true;
            return false;
        }
    }
    else{
        if(
            stage_value === null || typeof stage_value === 'undefined' || stage_value.length===0 ||
            role_value === null || typeof role_value === 'undefined' || role_value.length===0 ||
            access_value === null || typeof access_value === 'undefined' || access_value ===0 || access_value=== ''
          ){
                error = true;
                return false;
            }
    }
  });
    return error;
}
    
function CheckIsValidDomain(domain) {
    var re = new RegExp(/^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/);
    return domain.match(re);
}


function enableFollowupUpConfigurations()
{
    let enableCount = $(".followupConfigCheck:checked").length;
    if(enableCount > 0)
    {
        $(".followupChildConfig").prop("checked", "checked");
        $(".followupChildConfig").addClass('disableClick');
        
    }else{
        $(".followupChildConfig").removeAttr("checked", "checked");
        $(".followupChildConfig").removeClass('disableClick');
    }
}

$(document).on("click", ".disableClick", function(e)
{
    $(this).prop('checked', !$(this).prop('checked'));
    return false;
});
function allowNumeric(inputType){   
    inputType.value = inputType.value.replace(/[^0-9 \,]/, '');
}


function getPaymentCustomFields(hash, gateway) {
    
    if ((hash != '') && (jsVars.currentCollegeId > 0)) {
        $('div#addPaymentCustomFieldsBody').html('');
        $('div#addPaymentCustomFieldsBody span.error').text('');
        $.ajax({
            url: '/colleges/get-payment-custom-fields',
            type: 'post',
            data: {hash:hash, requestId: jsVars.currentCollegeId},
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('div.loader-block').show();
            },
            complete: function () {
                $('div.loader-block').hide();
            },
            success: function (html) {
                $('div.loader-block').hide();
                if (html === 'session_logout' || html === 'invalid_csrf' || html === 'invalid_request') {
                    window.location.reload();
                }else {
                    $('div#addPaymentCustomFieldsBody').html(html);
                    $('#savePaymentCustomFieldsBtn').attr('onclick', 'savePaymentCustomFields(\''+ hash +'\', \'' + gateway +'\')');
                    $('div#addPaymentCustomFieldsModal').modal('show');
                    $('div#addPaymentCustomFieldsModal .chosen-select').chosen();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    } else {
        window.location.reload();
    }
}


function savePaymentCustomFields(hash, gateway) {
    
    if ((hash != '') && (jsVars.currentCollegeId > 0)) {
        $('div#addPaymentCustomFieldsBody span.error').text('');
        var data = $('div#addPaymentCustomFieldsModal input, div#addPaymentCustomFieldsModal select').serializeArray();
        data.push({name: 'hash', value: hash});
        data.push({name: 'requestId', value: jsVars.currentCollegeId});
        $.ajax({
            url: '/colleges/save-payment-custom-fields',
            type: 'post',
            data: data,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('div.loader-block').show();
            },
            complete: function () {
                $('div.loader-block').hide();
            },
            success: function (json) {
                $('div.loader-block').hide();
                if (json['error'] && (json['error'] === 'session_logout' || json['error'] === 'invalid_csrf' || json['error'] === 'invalid_request')) {
                    window.location.reload();
                } else if (json['error']) {
                    alertPopup(json['error'], 'error');
                } else if (json['empty']) {
                    for(var field in json['empty']) {
                        $('div#addPaymentCustomFieldsModal span#' + field + '_error').text(json['empty'][field]);
                    }
                } else if (json['message']) {
                    $('div#addPaymentCustomFieldsModal').modal('hide');
                    alertPopup(json['message'], 'success');
                    //Removed old custom Fields
                    $('input[name^="payment_config[payment_gateway_extra_params]['+ gateway +'][custom_field1]"]').parents('div.col-sm-3').remove();
                    $('input[name="payment_config[payment_gateway_extra_params]['+ gateway +'][custom_field2]"]').parents('div.col-sm-3').remove();
                    $('input[name="payment_config[payment_gateway_extra_params]['+ gateway +'][custom_field3]"]').parents('div.col-sm-3').remove();
                    $('input[name="payment_config[payment_gateway_extra_params]['+ gateway +'][custom_field4]"]').parents('div.col-sm-3').remove();
                    $('input[name="payment_config[payment_gateway_extra_params]['+ gateway +'][custom_field5]"]').parents('div.col-sm-3').remove();
                    var fieldHtml = '';
                    for(var field in json['customFields']) {
                        fieldHtml += '<div class="col-sm-3" style="white-space: nowrap;">\n\
                                        <div class="input checkbox">\n\
                                            <input type="hidden" name="payment_config[payment_gateway_extra_params]['+ gateway +']['+ field +']" value="0">\n\
                                                <label for="payment-config-payment-gateway-extra-params-'+ gateway.toLowerCase() +'-'+ field +'">\n\
                                                    <input type="checkbox" name="payment_config[payment_gateway_extra_params]['+ gateway +']['+ field +']" value="' + json['customFields'][field]['keyName']+'" ' + json['customFields'][field]['checked']+' id="payment-config-payment-gateway-extra-params-'+ gateway.toLowerCase() +'-'+ field +'">' + json['customFields'][field]['label']+'\n\
                                                </label>\n\
                                        </div>\n\
                                    </div>';
                    }
                    $('div#' + gateway.toLowerCase() + '_payment_gateway_extra_param div.col-sm-3:last').after(fieldHtml);
                } else {
                    $('div#addPaymentCustomFieldsModal').modal('hide');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    } else {
        window.location.reload();
    }
}
