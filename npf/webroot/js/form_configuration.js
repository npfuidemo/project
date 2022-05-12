/*
 * Handle Form Configuration Js.
 */
//var BannerCount = jsVars.BannerCount;
$(document).ready(function(){
    //using in form basic configuration
    //initMultipleCKEditor('editor_instruction');
    initMultipleCKEditor('editor_instruction_popup');
    initMultipleCKEditor('editor_extra_data');
    initMultipleCKEditor('editor_payment_page_information');
    initMultipleCKEditor('editor_recommendation_page_information');
    initMultipleCKEditor('editor_thankyou_page_information');
    initMultipleCKEditor('editor_spoc_person_page_information');
    $('.panel-group').on('hidden.bs.collapse', toggleIcon);
    $('.panel-group').on('shown.bs.collapse', toggleIcon);

    $('.panel-group').on('show.bs.collapse', function (e) {
       //call a service here
       if(e.target.id=='payment_type_config_accord'){
          loadPaymentTypeConfigBlock();
       }
    });

    $(document).on('change', '#payment_process_type', function(){
        if($(this).val()=='midpayment'){
            $('#payment_after_stage_block').show();
        }else{
            $('#payment_after_stage_block').hide();
        }
    });
    if($(".dateinput").length > 0){
	$('.dateinput').datetimepicker({format: 'DD/MM/YYYY HH:mm',viewMode: 'years'});
    }

    if($(".onlyDateInput").length > 0){
	$('.onlyDateInput').datetimepicker({format: 'DD/MM/YYYY',viewMode: 'years'});
    }

    $('#preferences_configuration').on('shown.bs.collapse', function () {
        var formId = $('#PreferencesConfiguration input[name=form_id]').val();
        var selected = '';
        if(typeof jsVars.preferencesConfigurationField !== 'undefined'){
            selected  = jsVars.preferencesConfigurationField;
        }
        getFormFields(formId,selected);

    });

    //Discount Coupon Required Configuration Js
    if ($('div#DiscountCouponRequiredConfigurationSection').length > 0) {
        $('select#discountCouponRequiredOnFees').SumoSelect({placeholder: 'Required On Fees', search: true, searchText: 'search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true});
        var formId = $('#DiscountCouponRequiredConfigurationSection input[name = form_id]').val();
        var selectedFormField = '';
        if (typeof jsVars.discountCouponRequiredField !== 'undefined') {
            selectedFormField = jsVars.discountCouponRequiredField;
        }
        getFormAllDropdownFields(formId, selectedFormField);
    }
    
    //Dicount Coupon Required Configuration Js
    if ($('#enableTokenFeepostEditField').prop("checked") == false) {
        $('#tokenFeesIds').parent().hide()
    }
    if ($('#enableTokenFeepostEditField').prop("checked") == true) {
        getTokenFeeData();
    }
    $('#enableTokenFeepostEditField').click(function(){
        if ($('#enableTokenFeepostEditField').prop("checked") == true) {
            $('#tokenFeesIds').parent().show()
            getTokenFeeData();
        }else{
            $('#tokenFeesIds').parent().hide()
        }
    });
    if ($('#basicConfigSaveMissingFields').prop("checked") == false) {
        $('#tokenFeesConfig').hide()
    } 
    $('#basicConfigSaveMissingFields').click(function(){
       if ($('#basicConfigSaveMissingFields').prop("checked") == true) {
           $('#tokenFeesConfig').show()
       }else{
           $('#tokenFeesConfig').hide()
       }
    });
        

    //Send Referee Link Configuration Js
    if ($('div#recommandation_data_config_accord').length > 0) {
        $('select#sendRefereeLinkConfig').SumoSelect({placeholder: 'Send Referee Link', search: true, searchText: 'search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true});
        var formId = $('#recommandation_data_config_accord input[name = form_id]').val();
        var selectedFormField = '';
        /*if (typeof jsVars.discountCouponRequiredField !== 'undefined') {
            selectedFormField = jsVars.discountCouponRequiredField;
        }*/
        getFormAllDropdownFields(formId, selectedFormField);
    }

    // sumo select for disable specific fields
     if($("#DisableSpecificFieldsForm").length > 0){
	//$('select#disable_specific_fields').SumoSelect({ placeholder:'Select Form Fields', searchText:'Select Form Field', triggerChangeCombined: false });
        //$('select#disable_specific_fields')[0].sumo.reload();
        $('select#disable_specific_fields').SumoSelect({placeholder: 'Form Fields', selectAll : true,search :true, captionFormatAllSelected: "All Selected.",triggerChangeCombined: false,});

     }

    if($("#VerifyDocumentConfigurationForm").length > 0){
        $('select#upload_doc_column').SumoSelect({placeholder: 'Form Fields', selectAll : true,search :true, captionFormatAllSelected: "All Selected.",triggerChangeCombined: false,});
    }
    
    $(document).on('sumo:closing', '#stage_conditions_div select.ifstage', function(e) {
        disableSelectedStageForStageCondition();
    });
    $('select.customparma').SumoSelect({placeholder: 'Select '+jsVars.field_name_2, search: true, searchText: 'Search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true});
    if($('select.customparmb').length){
        $('select.customparmb').SumoSelect({placeholder: 'Select '+jsVars.field_name_3, search: true, searchText: 'Search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true});
    }
$('select#custom_fields_1').SumoSelect({placeholder: 'Select Custom Fields', search: true, searchText: 'Search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true});

$('.default_status').on('change', function() {
    $('.default_status').not(this).prop('checked', false);  
});

});


//function AddMoreBanner() {
//    var MAX_UPLOAD_BANNER = jsVars.MAX_UPLOAD_BANNER;
//
//    if (BannerCount < MAX_UPLOAD_BANNER)
//    {
//        var BannerInputHtml = '<div class="form-group is-fileinput">';
//        BannerInputHtml += '        <div class="row upload_file-blk">';
//        BannerInputHtml += '            <div class="col-md-4 fileBrowseCustom">';
//        BannerInputHtml += '                <input type="file" accept="image/*" name="banner[]" id="inputFile2" class="input_file">';
//        BannerInputHtml += '                <input type="email" readonly="" class="form-control input_img" placeholder="Choose Files">';
//        BannerInputHtml += '            </div>';
//        BannerInputHtml += '        </div>';
//        BannerInputHtml += '   </div>';
//        $('#AddMoreBannerArea').before(BannerInputHtml);
//        BannerCount++;
//    }
//    else
//    {
//        alertPopup('you have permission to add maximum '+ MAX_UPLOAD_BANNER +' banners.','error');
//    }
//}

//Basic Configuration Form Submit
$(document).on('submit', 'form#BasicConfigurationForm',function(e) {
    e.preventDefault();
    SaveSectionData('BasicConfigurationForm');
});


$(document).on('click', '#enableVerifyDocument', function (e) {
    if ($(this).is(':checked')) {
        $('#status_config_div').show();
    }else{
        $('#status_config_div').hide();
        $('#status_config_div').find('input:text').val('');
        $('#status_config_div').find('input[type=checkbox]').prop('checked', false);
    }
}); 

$(document).on('click', '#enableUploadedDocument', function (e) {
    if ($(this).is(':checked')) {
         $('#checkuploaddocument').show();
    }else{
        $('#checkuploaddocument').hide();
        $('#checkuploaddocument').find('input:text').val('');
        $('#upload_doc_column').val('');
    }
}); 

//Save Section Wise Data
function SaveSectionData(Form)
{
    $('form#'+Form+' textarea').each(function(index,element){
        var elemId = this.id;
        if(typeof CKEDITOR.instances[elemId] !='undefined'){
            CKEDITOR.instances[elemId].updateElement();
        }
    });
    var conditions  = [];
    var duplicateConditionFlag  = false;
    if( Form=='AppStageConfigurationForm' && $(".ifstage").length > 0 ){
        $("select.ifstage").each(function(){
            var conditionData   = $(this).val()+"#"+$(this).parent().parent().find('select.thenselect').val()+"#"+$(this).parent().parent().find('select.byrole').val();
            if( $.inArray( conditionData, conditions ) >= 0 ){
                duplicateConditionFlag  = true;
                return;
            }
            conditions.push(conditionData);
        });
    }
    
//    validateStageConditions
    var errorStatus = validateStageConditions();
    if(errorStatus===true){
        alertPopup("Application Stages Condition cannot be blank!",'error');
        return;
    }

    if(duplicateConditionFlag){
        alertPopup("Conditional Logic has duplicate conditions !",'error');
        return;
    }
    if( Form=='AdmitCardConfigurationForm'){
        var isError = false;
        $(".block_first").each(function(){
            $(this).find('.error-msg').html('');
            if($(this).find('.admit_card_app_template').val()=='' || $(this).find(".admit_card_condition").val()=='' || $(this).find(".admit_card_app_stage").val()=='' || $(this).find(".admit_card_button_text").val()==''){
                $(this).find('.error-msg').html('All fields are mandatory !');
                isError = true;
            }
        });
        if(isError){
            return false;
        }
    }
    
    if( Form=='BasicConfigurationForm'){
        $('#button_level_text').parent().find('requiredError').html('');
        if($('#basicConfigSinglePayFeeBtn').is(':checked')){
            if($('#single_pay_button_level_text').val() == ''){
                alertPopup("Please enter the text for button (Token Fee Grouping)",'error');
                return false;
            }
        }
    }

    $('form#'+Form).ajaxSubmit({
        type: 'post',
        dataType:'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
            $('div.loader-block').show();
        },
        complete: function() {
            $('div.loader-block').hide();
        },
        success:function (json){

            if (json['redirect']) {
                location = json['redirect'];
            }
            else if(json['error']){
                alertPopup(json['error'],'error');
            }
            else if(json['success'] == 200)
            {
                if('AppStageConfigurationForm' == Form && $(".ifstage").length == 0){
                    var reloadUrl = window.location; // + '/collapsemform3';
                    reloadUrl = reloadUrl.toString().replace("/collapsemform3",'')+'/collapsemform3';
                    alertPopup("Form config option data saved successfully.",'Success',reloadUrl);
                }else if('AppStageConfigurationForm' == Form && $(".ifstage").length > 0){
                    // var reloadUrl = window.location; // + '/collapsemform3';
                   /// reloadUrl = reloadUrl.toString().replace("/collapsemform3",'')+'/collapsemform3';
                    alertPopup("Application Stage/Sub-Stage Saved Successfully.",'Success');
                }else{
                    alertPopup(json['Msg'],'Success');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
        },
        resetForm: false
    });
    return false;
}

//change +/- icon for accordion
function toggleIcon(e)
{
    $(e.target)
            .prev('.panel-heading')
            .find(".more-less")
            .toggleClass('glyphicon-plus glyphicon-minus');
}

//create/remove editor on click of parent checkbox
function onchecked(Obj,id)
{
    var Form = $(Obj).parents('form').attr('id');
    if(typeof Form != 'undefined')
    {
        $('form#'+Form+' textarea').each(function(){
            var elemId = this.id;
            if(elemId != id)
            {
                removeCKEditor(elemId);
                $('span#span_'+elemId).show();
            }
        });
    }
    $(Obj).hide();
    $('div.loader-block').show();
    initMultipleCKEditor(id);
}

//remove CK Editor
function removeCKEditor(id)
{
    if(typeof id =='undefined' || id == ''){
        id = '';
    }

    if(id != '')
    {
        var old_data = '';
        if(typeof CKEDITOR.instances[id] != 'undefined'){
            old_data = CKEDITOR.instances[id].getData();
            delete CKEDITOR.instances[id];
            $('#'+id).val(old_data);
            $('#cke_'+id).remove();
        }
    }
}

//create CK Editor
function initMultipleCKEditor(id){
    if(typeof id =='undefined' || id == ''){
        id = '';
    }
    
    var newToken = [];
    var tokens = jsVars.CKEditorTokenJs;
    jQuery.each(tokens, function (index, category) {
        if(category !== ''){
            jQuery.each(category, function (index, value) {
                value = $.parseJSON(value);
                newToken.push(value);
            });
        }
    });


    if(id != '')
    {
        if($("#"+id).length >0){
            var old_data = '';
            if(typeof CKEDITOR.instances[id] != 'undefined'){
                var old_data = CKEDITOR.instances[id].getData();
                delete CKEDITOR.instances[id];
                $('#cke_'+id).remove();
            }

            CKEDITOR.replace( id,{
                extraPlugins: 'token,justify',
                allTokens: tokens,
                availableTokens: newToken,
                tokenStart: '{{',
                tokenEnd: '}}',
                    on: {
                        instanceReady: function( evt ) {
                            $('div.loader-block').hide();
                        },
                        change: function( evt ) {
                            if($("#is_edit_template").length > 0) {
                                $("#is_edit_template").val(1);
                            }
                        }
                }
            });

            if(old_data != ''){
                CKEDITOR.instances[id].setData(old_data);
            }
        }
    }
}



function addmoreLeadStage(div_class){

    var stgClone = jQuery('.'+div_class+'>div').eq(0).clone();
    jQuery(stgClone).find('.chosen-container').remove();
    jQuery(stgClone).find('.removeElementClass').html('<a class="text-danger" href="javascript:void(0);" title="Delete Stage" onclick="return confirmDelete(this,\''+div_class+'\',\'stage\');"><i class="fa fa-minus-circle font20" aria-hidden="true"></i></a>'); 
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
    $(".con_lead_stage option").attr('disabled',false);
    $(".con_lead_stage").each(function(){

        if($(this).val()!=null){
            if($(this).val().length){
                $("."+$(this).val()+":not(:selected)").attr('disabled',true);
            }
        }
    });
    $('.con_lead_stage').trigger("chosen:updated");
}

function addMoreBackendCondition(div_class){
    var stgClone = jQuery('#'+div_class+'>div').eq(0).clone();
    jQuery(stgClone).find('.chosen-container').remove();
    jQuery(stgClone).find('.removeElementClassCondition').html('<a href="#" class="text-danger" onclick="return confirmDelete(this,\''+div_class+'\',\'condition\');"><i class="fa fa-minus-circle font20" aria-hidden="true"></i></a>');

    jQuery(stgClone).find('select').val('');
    jQuery('#'+div_class).append(stgClone);
    var by_count =0;
    // reset stage count
    jQuery('#'+div_class+'>div').find('.ifstage').each(function(){
        this.name = 'application_stage_config[backend_user_conditions][condition]['+by_count+'][stage][]';
        by_count++;
    });
    by_count =0;
    jQuery('#'+div_class+'>div').find('.thenselect').each(function(){
        this.name = 'application_stage_config[backend_user_conditions][condition]['+by_count+'][access]';
        by_count++;
    });
    by_count =0;
    jQuery('#'+div_class+'>div').find('.byrole').each(function(){
        this.name = 'application_stage_config[backend_user_conditions][condition]['+by_count+'][role][]';
        by_count++;
    });

    jQuery('.chosen-select').chosen();
    return false;
}

function addMoreStageCondition(div_class){

    var stgClone = jQuery('#'+div_class+'>div').eq(0).clone();
    jQuery(stgClone).find('.chosen-container').remove();
    jQuery(stgClone).find('.removeElementClassCondition').html('<a href="#" class="text-danger" onclick="return confirmDelete(this,\''+div_class+'\',\'stage_condition\');"><i class="fa fa-minus-circle font20" aria-hidden="true"></i></a>');

    jQuery(stgClone).find('div.SumoSelect p').remove();
    jQuery(stgClone).find('select').val('');

    jQuery('#'+div_class).append(stgClone);
    jQuery(stgClone).find('.sumo_select').SumoSelect({ selectAll : true, search : true});
    var by_count =0;
    // reset stage count
    jQuery('#'+div_class+'>div').find('.ifstage').each(function(){
        this.name = 'application_stage_config[stage_conditions][condition]['+by_count+'][stage][]';
        by_count++;
    });
    by_count =0;
    jQuery('#'+div_class+'>div').find('.thenselect').each(function(){
        this.name = 'application_stage_config[stage_conditions][condition]['+by_count+'][access]';
        by_count++;
    });
    by_count =0;
    jQuery('#'+div_class+'>div').find('.byrole').each(function(){
        this.name = 'application_stage_config[stage_conditions][condition]['+by_count+'][role][]';
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
        this.name = 'application_stage_config[backend_user_conditions][condition]['+by_count+'][stage][]';
        by_count++;
    });
    by_count =0;
    jQuery('#'+div_class+'>div').find('.thenselect').each(function(){
        this.name = 'application_stage_config[backend_user_conditions][condition]['+by_count+'][access]';
        by_count++;
    });
    by_count =0;
    jQuery('#'+div_class+'>div').find('.byrole').each(function(){
        this.name = 'application_stage_config[backend_user_conditions][condition]['+by_count+'][role][]';
        by_count++;
    });


    return false;
}


function removeStageCondition(elem,div_class){
    $(elem).closest('.row').remove();

    var by_count =0;
    // reset stage count
    jQuery('#'+div_class+'>div').find('.ifstage').each(function(){
        this.name = 'application_stage_config[stage_conditions][condition]['+by_count+'][stage][]';
        by_count++;
    });
    by_count =0;
    jQuery('#'+div_class+'>div').find('.thenselect').each(function(){
        this.name = 'application_stage_config[stage_conditions][condition]['+by_count+'][access]';
        by_count++;
    });
    by_count =0;
    jQuery('#'+div_class+'>div').find('.byrole').each(function(){
        this.name = 'application_stage_config[stage_conditions][condition]['+by_count+'][role][]';
        by_count++;
    });

    disableSelectedStageForStageCondition();
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
            if(type=='condition'){
                removeBackendCondition(elem,div_class);
            }
            else if(type === 'stage_condition') {
                removeStageCondition(elem,div_class);
            }
            else{
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

$(document).ready(function(){ //defaultSection
    if(typeof jsVars.defualtConfig != 'undefined' && jsVars.defualtConfig != ''){
        $("#accordion").find('#'+jsVars.defualtConfig).addClass("in");
        $("html, body").scrollTop($('#'+jsVars.defualtConfig).offset().top);
    }

    disabledSelectedStages();
    $('.con_lead_stage').each(function(){
        $(this).data("prev",$(this).val());
    });

    $('.con_lead_stage').change(selectLeadStage);
    $('.admit_card_app_template').change(selectAdmitCardTemplate);
    $('.admit_card_app_stage').SumoSelect({search: true, placeholder:'Select Application Stage', captionFormatAllSelected: "All Selected.", searchText:'Select Application Stage', triggerChangeCombined: true });
});

function loadPaymentTypeConfigBlock(){
    var data = $('#PaymentTypeConfigurationForm').serializeArray();
    $.ajax({
        url: '/form/payment-type-config',
        data: data,
        dataType: "html",
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('body div.loader-block').show();
        },
        complete: function () {
            $('body div.loader-block').hide();
        },
        //contentType: "application/json; charset=utf-8",
        success: function (data) {
            if(data=='redirect'){
             location = '/';
            }else{
               $('#payment_type_config_block').html(data);
               jQuery('.chosen-select').chosen();
            }
        },
        error: function (response) {
            alertPopup(response.responseText);
        },
        failure: function (response) {
            alertPopup(response.responseText);
        }
    });
}

function disabledSelectedTemplates(){
    $(".admit_card_app_template option").attr('disabled',false);
    $(".admit_card_app_template").each(function(){
        if($(this).val().length){
            $("."+$(this).val()+":not(:selected)").attr('disabled',true);
        }
    });
    $('.admit_card_app_template').trigger("chosen:updated");
}

function removeAdmitCardConfig(elem){
    $(elem).parents('div.block_first').remove();
    disabledSelectedTemplates();
    return false;
}

function selectAdmitCardTemplate(){
    $(".block_first").each(function(){
        var templateId  = $(this).find('.admit_card_app_template').val();
        $(this).find(".admit_card_condition").attr('name', 'admit_card_config[condition]['+templateId+']');
        $(this).find(".admit_card_app_stage").attr('name', 'admit_card_config[application_stage]['+templateId+'][]');
        $(this).find(".admit_card_button_text").attr('name', 'admit_card_config[button_text]['+templateId+']');
    });
    disabledSelectedTemplates();
}

function addMoreAdmitCardCondition(){
    $("#admit_card_conditions").append(form_admit_card_config);
    $('.chosen-select').chosen();
    $('.chosen-select').trigger('chosen:updated');
    $('.admit_card_app_stage').SumoSelect({search: true, placeholder:'Select Application Stage', captionFormatAllSelected: "All Selected.", searchText:'Select Application Stage', triggerChangeCombined: true });
    $('.admit_card_app_template').unbind( "change" );
    $('.admit_card_app_template').change(selectAdmitCardTemplate);
    disabledSelectedTemplates();
}

function confirmDeleteAdmitCardCondition(elem){
    $('#ConfirmMsgBody').html('Do you want to delete this configuration?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
    .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        removeAdmitCardConfig(elem);
        $('#ConfirmPopupArea').modal('hide');
    });
    return false;
}

//Save form config options data Section Wise
function SaveConfigOptionData(Form)
{
    $('form#' + Form + ' textarea').each(function() {
        var elemId = this.id;
        if(typeof CKEDITOR.instances[elemId] !='undefined'){
            CKEDITOR.instances[elemId].updateElement();
        }
    });


if(typeof Form != 'undefined' && Form == 'CustomFieldMapping'){
    var error = validationCustomFieldMapping();
    if(error){
        alertPopup(error,'error');
        return; 
    }
}

    $('form#'+Form).ajaxSubmit({
        type: 'post',
        dataType:'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
            $('div.loader-block').show();
        },
        complete: function() {
            $('div.loader-block').hide();
        },
        success:function (json){

            if (json['redirect']) {
                location = json['redirect'];
            }
            else if(json['error']){
                alertPopup(json['error'],'error');
            }
            else if(json['success'] == 200)
            {
                alertPopup(json['Msg'],'Success');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
        },
        resetForm: false
    });
    return false;
}

function getFormFields(form_id,selected){
    if(typeof selected == 'undefined'){
        selected = '';
    }
    $.ajax({
        url: '/reports/get-form-fields',
        type: 'post',
        dataType: 'json',
        data: {'form_id': form_id,'field_type':'dropdown','only_option':true},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            if (json['error'] === "session") {
                window.location.reload(true);
            } else if (json['success'] === 200) {
                $('#preferences_configuration_field').html(json['field_options']);
                $('#preferences_configuration_field').val(selected);
                $('.chosen-select').trigger("chosen:updated");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

//Discount Coupon Required Configuration Js Start
function getFormAllDropdownFields(formId, selected) {
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
            $('#formFields').html(json['optionList']);
            $('#formFields').attr('onChange','getDropdownValueList(this.value)');
            if ((typeof selected !== 'undefined') && (selected != '')) {
                $('#formFields').val(selected);
                if (typeof jsVars.discountCouponRequiredFieldValue !== 'undefined') {
                    getDropdownValueList(selected, jsVars.discountCouponRequiredFieldValue);
                }
            }
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.chosen-select').trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getDropdownValueList(value, selected) {
    if (value == '' || value == '0' ) {
	$("select#formFieldsValue").html("<option value='0'>Select Value</option>");
	$('.chosen-select').chosen();
        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        $('.chosen-select').trigger('chosen:updated');
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
            $('#formFieldsValue').html(json['optionList']);
            if ((typeof selected !== 'undefined') && (selected != '')) {
                $('#formFieldsValue').val(selected);
            }
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.chosen-select').trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getAllFormsForAMFilter(collegeId) {
    if(collegeId==0 || collegeId==''){
        return;
    }
    $.ajax({
        url: '/form/get-stage-form-List',
        type: 'post',
        dataType:'html',
        data: {
            "collegeId": collegeId
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            $("#formId",$('#leadStageConfigurationForm')).html(data);
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.chosen-select').trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getApplicationStage() {

    if (($("#formId").val() == ''||$("#formId").val() == 0)&&($("#collegeId").val() == '') ) {
        $('#clgId').html('Please select institute.');
        $('#frmId').html('Please select Form.');
        return;
    }else{
       $('#clgId').html('');
       $('#frmId').html('');
    }
    if ($("#collegeId").val() == '') {
		$('#clgId').html('Please select institute.');
        //$('#LeadsStageConfigContainer').html('<div class="alert alert-danger">Please select institute.</div>');
        return;
    }else{
		$('#clgId').html('');
	}
    if ($("#formId").val() == ''||$("#formId").val() == 0 ) {
       // $('#LeadsStageConfigContainer').html('<div class="alert alert-danger">Please select Form.</div>');
	   $('#frmId').html('Please select Form.');
        return;
    }else{
		$('#frmId').html('');
	}
    $('#LeadsStageConfigContainer').html('');
    $.ajax({
        url: '/form/ajax-application-stage-configuration',
        type: 'post',
        data: {collegeId: $("#collegeId").val(),formId:$("#formId").val()},
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
            if (response == 'invalid_csrf' || response == 'invalid_request'|| response =='session_logout')  {
                window.location.reload();
            } else {
                $("#load_msg_div").css('display', 'none');
                $('#LeadsStageConfigContainer').html(response);
                $('.chosen-select').chosen();
                $('.offCanvasModal').modal('hide');

                applicationStageConfigCondition();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

// application sub stages

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
                    resetApplicationSubStageDiv(elem);
                } else if (json['leadSubStage']) {
                    configApplicationSubStageDiv(elem, taxid, json['leadSubStage']);
                    if (fetch == 'onlySubStage') {
                        addmoreApplicationSubStage('parentDivSubStage', taxid);
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



function resetApplicationSubStageDiv(elem) {
    var add_more_sub_stage_div = $(elem).closest('div.block_first').find('.add_more_sub_stage_div');
    add_more_sub_stage_div.find('a').removeAttr('onclick', '');
    add_more_sub_stage_div.attr('id','').hide();
    var load_sub_stage_div = $(elem).closest('div.block_first').find('.load_sub_stage_div');
    load_sub_stage_div.attr('id','').html('');
}

function configApplicationSubStageDiv(elem, taxid, leadSubStage) {
    var add_more_sub_stage_div = $(elem).closest('div.block_first').find('.add_more_sub_stage_div');
    add_more_sub_stage_div.find('a').attr('onclick','return addmoreApplicationSubStage(\'parentDivSubStage\', \'' + taxid +'\');');
    add_more_sub_stage_div.attr('id','addMoreLeadSubStageDiv' + taxid).show();
    var load_sub_stage_div = $(elem).closest('div.block_first').find('.load_sub_stage_div');
    if (typeof leadSubStage != 'undefined') {
        load_sub_stage_div.attr('id', 'parentDivSubStage' + taxid).html('<input type=\'hidden\' value=\'' + JSON.stringify(leadSubStage) + '\'/>');
    }
}

function addmoreApplicationSubStage(div_class, elemId) {
    if((jQuery('div#'+div_class + elemId +' > div.con_lead_sub_stage_div').length == 0) &&
            (jQuery('div#'+div_class + elemId).find('input[type=\'hidden\']').length == 0)) {
        return loadDefaultStageScoreValue(jQuery('div#'+div_class + elemId).parent('div.block_first').find('select:first-child'), 'onlySubStage');
    }

    if (jQuery('div#'+div_class + elemId +' > div.con_lead_sub_stage_div').length > 0) {
        var stgClone = jQuery('div#'+div_class + elemId +' > div.con_lead_sub_stage_div').eq(0).clone();
        jQuery(stgClone).find('.chosen-container').remove();
        jQuery(stgClone).find('.removeElementClass').html('<a class="text-danger" href="javascript:void(0);" title="Delete Sub Stage" onclick="return confirmSubStageDelete(this,\''+div_class+'\',\'' + elemId +'\');"><i class="fa fa-minus-circle font20" aria-hidden="true"></i></a>');
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
        removeApplicationSubStage(elem, div_class, elemId);
        $('#ConfirmPopupArea').modal('hide');
    });
    return false;
}

function removeApplicationSubStage(elem, div_class, elemId) {
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
    var html = '    <div class="logic_block_div con_lead_sub_stage_div">';
    html += '           <div class="col-sm-2 col-sm-offset-0 margin-top-20">';
    html += '               <strong>Sub Stage <span class="count_sub_stage"></span></strong>';
    html += '           </div>';
    html += '           <div class="col-sm-3 margin-top-10">';
    html += '               <select name="application_stage_config[application_sub_stages]['+ elemId +'][]" class="form-group chosen-select padding10 con_lead_sub_stage" data-placeholder="Select Application Sub Stage" onchange="disabledSelectedSubStages(\'parentDivSubStage\', \''+ elemId +'\')">';
    html += '                   <option value="" selected="selected">Select Application Sub Stage</option>';
    for(var i in leadStageData[elemId]) {
        var subStageId = i.replace('w','');
    html += '                   <option value="'+ subStageId +'" class="'+ subStageId +'">'+ leadStageData[elemId][i] +'</option>';
    }
    html += '               </select>';
    html += '           </div>';
    html += '           <div class="col-sm-2 col-sm-offset-1 margin-top-10">';
    html += '               <select name="application_stage_config[sub_stage_required]['+ elemId +'][]" class="form-group chosen-select padding10 con_lead_sub_stage" data-placeholder="Select Required">';
    html += '                   <option value="0" selected="selected">No</option>';
    html += '                   <option value="1">Yes</option>';
    html += '               </select>';
    html += '           </div>';
    html += '           <div class="col-sm-1 col-sm-offset-3 margin-top-20">';
    html += '               <a href="javascript:void(0);" class="" title="Add Application Sub Stage" onclick="return addmoreApplicationSubStage(\'parentDivSubStage\', '+ elemId +');"><i class="fa fa-plus-circle font20" aria-hidden="true"></i></a>';
    html += '               <div class="removeElementClass pull-right">';
    html += '                   <a class="text-danger" href="javascript:void(0);" title="Delete Sub Stage" onclick="return confirmSubStageDelete(this,\'parentDivSubStage\', '+ elemId +');"><i class="fa fa-minus-circle font20" aria-hidden="true"></i></a>';
    html += '               </div>';
    html += '           </div>';
    html += '       </div>';
    return html;
}



function  applicationStageConfigCondition(){
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

    $(document).on('change', '#stage_conditions_div select.byrole', function(e) {

    return;

    if(selectVal != null && typeof selectVal != 'undefined' && selectVal.match(/^\d+$/)){
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

function validateStageConditions(){
    var error = false;
  $('#stage_conditions_div').find('.ifstage').each(function(i,j){
    var stage_value = $('[name="application_stage_config[stage_conditions][condition]['+i+'][stage][]"]').val();
    var role_value = $('[name="application_stage_config[stage_conditions][condition]['+i+'][role][]"]').val();
    var access_value = $('[name="application_stage_config[stage_conditions][condition]['+i+'][access]"]').val();

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

function GetChildByMachineKey(key,ContainerId,elem,defaultValue){
    var field_name_2='';
    if(typeof jsVars.field_name_2!='undefined') {
        field_name_2 = jsVars.field_name_2;
    }
    $(elem).parents('div.custom_field_mapping_conditions').find('#'+ContainerId).html('');
    if(key && ContainerId){
            $.ajax({
                url: '/common/GetChildByMachineKeyForRegistration',
                type: 'post',
                dataType: 'json',
                data: {key:key,college_id:0},
                success: function (json) {
                    if(json['redirect']){
                        location = json['redirect'];
                    }
                    if(json['error']){
                        alertPopup(json['error'],'error');
                    }
                    else if(json['success']){
                        var html = '';
                        var l;
                        if(typeof jsVars.customParam2!='undefined') {
                            l= JSON.parse(jsVars.customParam2);
                        }
                        for(var key in json['list']) {
                            if(typeof l!='undefined' && l[key] == key){
                                html += '<option selected value="'+key+'">'+json['list'][key]+'</option>';
                            }else{
                                html += '<option value="'+key+'">'+json['list'][key]+'</option>';
                            }
                        }
                        $(elem).parents('div.custom_field_mapping_conditions').find('#'+ContainerId).html(html);
                        if(typeof defaultValue != 'undefined' && defaultValue !=null && defaultValue !=''){
                            $(elem).parents('div.custom_field_mapping_conditions').find('#'+ContainerId).val(JSON.parse(defaultValue));
                        }
                        
                        var i=0;
                        $('select.customparma').each(function(){
                            $('select.customparma')[i++].sumo.reload();
                        });
        

                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        
    }else{
        $('#'+ContainerId).html('');
        $('select.customparma')[0].sumo.reload();
    }
    return false;
}


function getChildByMachineKeyUsingClass(key,ContainerClass,elem,defaultValue){
    var field_name_2='';
    if(typeof jsVars.field_name_2!='undefined') {
        field_name_2 = jsVars.field_name_2;
    }
    $(elem).parents('div.custom_field_mapping_conditions').find('.'+ContainerClass).html('');
    if(key && ContainerClass){
        if(typeof key==="string" && key.charAt(0)==="[" && key.slice(-1)==="]" ){
            key = $.parseJSON(key);
        }
            $.ajax({
                url: '/common/GetChildByMachineKeyForRegistration',
                type: 'post',
                dataType: 'json',
                data: {key:key,college_id:0},
                success: function (json) {
                    if(json['redirect']){
                        location = json['redirect'];
                    }
                    if(json['error']){
                        alertPopup(json['error'],'error');
                    }
                    else if(json['success']){
                        var html = '';
                        var l;
                        if(typeof jsVars.customParam2!='undefined') {
                            l= JSON.parse(jsVars.customParam2);
                        }
                        for(var key in json['list']) {
                            if(typeof l!='undefined' && l[key] == key){
                                html += '<option selected value="'+key+'">'+json['list'][key]+'</option>';
                            }else{
                                html += '<option value="'+key+'">'+json['list'][key]+'</option>';
                            }
                        }
                        $(elem).parents('div.custom_field_mapping_conditions').find('.'+ContainerClass).html(html);
                        if(typeof defaultValue != 'undefined' && defaultValue !=null && defaultValue !=''){
                            $(elem).parents('div.custom_field_mapping_conditions').find('.'+ContainerClass).val(JSON.parse(defaultValue));
                        }
                        
                        $(elem).parents('div.custom_field_mapping_conditions').find('select.customparma').each(function(){
                            $(this)[0].sumo.reload();
                        });
                        if($('select.customparmb').length){
                            $(elem).parents('div.custom_field_mapping_conditions').find('select.customparmb').each(function(){
                                $(this)[0].sumo.reload();
                            });
                        }                        
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        
    }else{
        $('.'+ContainerClass).html('');
        $('select.customparma')[0].sumo.reload();
        if($('select.customparmb').length){
            $('select.customparmb')[0].sumo.reload();
        }
    }
    return false;
}


function confirmDeleteCustomMapping(elem){
    $('#ConfirmMsgBody').html('Do you want to delete this configuration?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
    .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        removeCustomMappingConfig(elem);
        $('#ConfirmPopupArea').modal('hide');
    });
    return false;
}

function addMoreCustomMapping(){
    
    if($('div.custom_field_mapping_conditions').length>=7){
        alertPopup('Maximum 7 mappings are allowed','error');
       return; 
    }
    
    
    
    var stgClone = jQuery('#div_custom_field_mapping_condition>div').eq(0).clone();
    jQuery(stgClone).find('p.CaptionCont,div.optWrapper').remove();
    jQuery(stgClone).find('select').val('');
    $(stgClone).find('.sumo-select').SumoSelect({search: true, placeholder:'Select', captionFormatAllSelected: "All Selected.", searchText:'Select', triggerChangeCombined: true });
    
    jQuery(stgClone).find('div.removeButton').html('<div class="removeElementClassBlock text-right"><a class="text-danger" href="#" onclick="return confirmDeleteCustomMapping(this);"><span class="glyphicon glyphicon-remove"></span></a></div>');
    $("#div_custom_field_mapping_condition").append(stgClone);
    
    // recalculate index of dropdown

    
    var stage_count = 0;
    $('div.custom_field_mapping_conditions').each(function () {
        var fields_name = $(this).find('select.custom_fields_1_cls').attr('name').replace(/^custom_param_mapping\[custom_field_1\]\[[\d]+\]/gi, "custom_param_mapping[custom_field_1]["+stage_count+"]");
        $(this).find('select.custom_fields_1_cls').attr('name', fields_name);
//
        var fields_name2 = $(this).find('.customparma').attr('name').replace(/^custom_param_mapping\[custom_field_2\]\[[\d]+\]\[\]/gi, "custom_param_mapping[custom_field_2]["+stage_count+"][]");
        $(this).find('.customparma').attr('name',fields_name2);
        if($(".customparmb").length){
            var fields_name3 = $(this).find('.customparmb').attr('name').replace(/^custom_param_mapping\[custom_field_3\]\[[\d]+\]\[\]/gi, "custom_param_mapping[custom_field_3]["+stage_count+"][]");
            $(this).find('.customparmb').attr('name',fields_name3);
        }
        stage_count++;
    });
}

function removeCustomMappingConfig(elem){
    $(elem).parents('div.block_repeat').remove();
    var stage_count = 0;
    $('div.custom_field_mapping_conditions').each(function () {
        var fields_name = $(this).find('select.custom_fields_1_cls').attr('name').replace(/^custom_param_mapping\[custom_field_1\]\[[\d]+\]/gi, "custom_param_mapping[custom_field_1]["+stage_count+"]");
        $(this).find('select.custom_fields_1_cls').attr('name', fields_name);
//
        var fields_name2 = $(this).find('.customparma').attr('name').replace(/^custom_param_mapping\[custom_field_2\]\[[\d]+\]\[\]/gi, "custom_param_mapping[custom_field_2]["+stage_count+"][]");
        $(this).find('.customparma').attr('name',fields_name2);
        if($(".customparmb").length){
            var fields_name3 = $(this).find('.customparmb').attr('name').replace(/^custom_param_mapping\[custom_field_3\]\[[\d]+\]\[\]/gi, "custom_param_mapping[custom_field_3]["+stage_count+"][]");
            $(this).find('.customparmb').attr('name',fields_name3);
        }
        stage_count++;
    });
    return false;
}

function validationCustomFieldMapping(){
    var unindexed_array = $('#CustomFieldMapping').serializeArray();
  
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    let results = [];
    for(var i in indexed_array){
        if(i.match(/^custom_param_mapping\[custom_field_1\]\[[\d]+\]/)){
            if(indexed_array[i] !== null && typeof indexed_array[i] !== 'undefined' && indexed_array[i] !=='' ){
                results.push(indexed_array[i]);
            }
        }
    }
    
   var duplicates = results.filter((e, i, a) => a.indexOf(e) !== i) // [2, 4]
    if(duplicates.length>0){
        return 'Duplicate Value is not allowed in Custom Field Mapping';
    }

return false;
//console.log(indexed_array);
    
}

function getTokenFeeData(){
    var formId = $('#tokenFeesConfig input[name=form_id]').val();
    var collegeId = $('#tokenFeesConfig input[name=college_id]').val();
    $.ajax({
        url: jsVars.FULL_URL+'/form/get-token-fee-data',
        type: 'post',
        data: {formId:formId,collegeId:collegeId},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {                    
                $('div.loader-block-a').show();
        },
        complete: function() {
                $('div.loader-block-a').hide();
        },
        success: function (response) 
        {
            //var response = $.parseJSON(response);
            var html = '';
            html += "<select name='BasicConfig[other_data][token_fees_ids]' class='chosen-select' id='tokenFeesIds'>";
            html += "<option value=''>--Select Token Fee--</option>";
            if(response.success){
                var token_fees_id_selected = $("input[name='token_fees_id_selected']").val();
                  
                  $.each(response.data, function (index, item) {
                   if(token_fees_id_selected == index){
                       html += '<option value="'+index+'" selected="selected">'+item+'</option>';
                   }else{
                       html += '<option value="'+index+'">'+item+'</option>';
                   }

                });
                
            }
            html += "</select><span class='requiredError'></span>";
            $('#tokenFeesListData').empty()
            $('#tokenFeesListData').html(html)
            $('#tokenFeesIds').chosen();
         //$('#result').html(json);
            

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block-a').hide();
        }
    });
    
}