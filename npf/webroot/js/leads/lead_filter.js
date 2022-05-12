var CollegeWiseCreaterList;
var postedCreatedBy;
var appendFlag = 0;
var loadRepeatClass = 0;
var datetime = 0;
if(typeof jsVars.CollegeWiseCreaterList !== 'undefined' && jsVars.CollegeWiseCreaterList !== "" && !jQuery.isEmptyObject(jsVars.CollegeWiseCreaterList))
{
    CollegeWiseCreaterList = $.parseJSON(jsVars.CollegeWiseCreaterList);
}  

/**
 * add more or remove function for config 
 * @param {type} elem
 * @returns {Boolean}
 */
function addMoreApplCondition(elem) {
    var div_class = 'form0' ;
    
    var stgClone = jQuery(elem).closest('.' + div_class + '>div').eq(0).clone();
    
    // remove chosen select container
    jQuery(stgClone).find('.chosen-container').remove();
    
    // add delete button
    jQuery(stgClone).find('.removeElementClass').html('<a href="javascript:void(0);" class="text-danger" onclick="return confirmDelete(this,\'condition\');"><i class="fa fa-minus-circle" aria-hidden="true"></i></a>');
    
    // reset all select box value
    jQuery(stgClone).find('select').val('');
       
    // blank textbox value
    jQuery(stgClone).find('input').attr('placeholder', 'Input Value').val('');
    
    // remove hidden for autocomplete
    jQuery(stgClone).find('.sel_value_hidden').remove();
    jQuery(stgClone).find('.typeahead').remove();
    jQuery(stgClone).find('.lead_error, .error').remove();
    jQuery(stgClone).find('.dependent_info').html('');
     
    // hide type(condition) fields and value fields
    jQuery(stgClone).find('.field_value_div>div').hide();
    jQuery(stgClone).find('.field_value_condition>div').hide();
    
    // get block number
    var obj_name = jQuery(stgClone).find('select.sel_field').attr('name');
    var re = /\d+(?:\]\[)/gi;
    // calculate error span id
    var block_num = obj_name.match(re)[0].replace('][','');
    var error_span ='errorlead_'+block_num+'_1';
    // add error span
    jQuery(stgClone).append('<span class="col-md-12 lead_error" id="'+error_span+'"></span>');
    // append clone object
    jQuery(elem).closest('.' + div_class).append(stgClone);

    var stage_count = 0;
    // reset stage count

    jQuery(elem).parents('.block-repeat').find('.' + div_class + '>div').each(function () {

        var fields_name = $(this).find('.sel_field').attr('name').replace(/\[[\d]*\]\[fields\]/gi, "[" + stage_count + "][fields]");
        $(this).find('.sel_field').attr('name', fields_name);

        var fields_name = $(this).find('.sel_type').attr('name').replace(/\[[\d]*\]\[types\]/gi, "[" + stage_count + "][types]");
        $(this).find('.sel_type').attr('name', fields_name);
         
        var fields_name = $(this).find('.sel_value').attr('name').replace(/\[[\d]*\]\[values\]/gi, "[" + stage_count + "][values]");
        $(this).find('.sel_value').attr('name', fields_name);

        if (typeof $(this).find('.sel_value_hidden').attr('name') !== 'undefined') {
            var fields_name = $(this).find('.sel_value_hidden').attr('name').replace(/\[[\d]*\]\[values_id\]/gi, "[" + stage_count + "][values_id]");
            $(this).find('.sel_value_hidden').attr('name', fields_name);
        }
        
        if (typeof $(this).find('.lead_error') !== 'undefined') {
            var fields_name = $(this).find('.lead_error').attr('id').replace(/_\d$/gi, '_'+stage_count);
            $(this).find('.lead_error').attr('id',fields_name);
        }
        stage_count++;
    });
    jQuery('.chosen-select').chosen();
	setDroupClass();
    return false;
}


/**
 * remove condition field, operation and value
 * @param {type} elem
 * @returns {Boolean}
 */
function removeApplCondition(elem) {
    var div_class = 'form0' ;
    var cond_block = jQuery(elem).parents('.block-repeat');
    $(elem).closest('.condition_div').remove();
    var stage_count = 0;
    // reset stage count

    cond_block.find('.' + div_class + '>div').each(function () {
        // reset array number after delete
        var fields_name = $(this).find('.sel_field').attr('name').replace(/\[[\d]*\]\[fields\]/gi, "[" + stage_count + "][fields]");
        $(this).find('.sel_field').attr('name', fields_name);

        var fields_name = $(this).find('.sel_type').attr('name').replace(/\[[\d]*\]\[types\]/gi, "[" + stage_count + "][types]");
        $(this).find('.sel_type').attr('name', fields_name);

        var fields_name = $(this).find('.sel_value').attr('name').replace(/\[[\d]*\]\[values\]/gi, "[" + stage_count + "][values]");
        $(this).find('.sel_value').attr('name', fields_name);

        if (typeof $(this).find('.sel_value_hidden').attr('name') !== 'undefined') {
            var fields_name = $(this).find('.sel_value_hidden').attr('name').replace(/\[[\d]*\]\[values_id\]/gi, "[" + stage_count + "][values_id]");
            $(this).find('.sel_value_hidden').attr('name', fields_name);
        }
        
        if (typeof $(this).find('.lead_error') !== 'undefined') {
            var fields_name = $(this).find('.lead_error').attr('id').replace(/_\d*$/gi, '_'+stage_count);
            $(this).find('.lead_error').attr('id',fields_name);
        }
        stage_count++;
    });
	setDroupClass();
    return false;
}

function createApplicationFilterConfig(currentObj, selected, typeselected,call_type) {
    if (typeof selected === 'undefined') {
        selected = '';
    }
    if (typeof typeselected === 'undefined') {
        typeselected = '';
    }
    if (typeof call_type === 'undefined') {
        call_type = '';
    }

    $(currentObj).parent().parent().parent().find('.lead_error').html('');
    $(currentObj).parent().parent().parent().find('.dependent_info').html('');
    var cur_elem_name = $(currentObj).attr('name');
    var label_name = $(currentObj).find(':selected').data('label_name');
//    var inputId = $(currentObj).find(':selected').data('input_id');
    var dependentField = $(currentObj).find(':selected').data('dependentgroup');
    var parentFieldId = $(currentObj).find(':selected').data('parent');
    var cur_val_name = cur_elem_name.replace('[fields]', '[values][]');
    var cur_type_name = cur_elem_name.replace('[fields]', '[types]');
    var labelname = 'Select an Option'; 
    var value_field = $(currentObj).val();
    var arr = value_field.split("||");
    var followupDateValue = '';
    var html = '';
    var type = "";
    var class_date = '';
    var checkDependentFieldVal = 1;
    var betweenDateValue = '';
    var inputId = $(currentObj).find(':selected').data('input_id');
    
    if(arr[2] != '[]' && label_name == 'Course'){
        checkDependentFieldVal = 0;
    }
    if(typeof parentFieldId !== 'undefined' && parentFieldId !== '' ){
        //for fixed dependent fields
        var tmp = $(currentObj).find('option[data-input_id="'+parentFieldId+'"]').text();
        if((typeof tmp ==='undefined' || tmp === '' ) && parentFieldId === 'district_id'){
            tmp = $(currentObj).find('option[data-input_id="state_id"]').text();
        }
        if(typeof tmp !=='undefined' && tmp !== ''){
            if(checkDependentFieldVal == 1){
                $(currentObj).parent().parent().parent().find('.dependent_info').html('This field is dependent on '+tmp);
            }
        }
    }else if(typeof dependentField !== 'undefined' && dependentField !== '' ){
        //form fields dependent 
        var curInputId = $(currentObj).find(':selected').data('input_id');
        var tmp = $(currentObj).find('option[data-child="'+curInputId+'"]').text();
        if(typeof tmp !=='undefined' && tmp !== ''){
            if(checkDependentFieldVal == 1){
                $(currentObj).parent().parent().parent().find('.dependent_info').html('This field is dependent on '+tmp);
            }
        }
    }
    if (arr.length > 2) {
        var type = arr[1];
        var val_json = arr[2];
        var html_field_id = '';
        // for not break ajax on created by, ID CreatedBySelect
        if (arr[0].match(/created_by/i)) {
            html_field_id = 'CreatedBySelect';
        } else {
            html_field_id = arr[0];
        }
        if(html_field_id=='rfl|status'){
           $(currentObj).parent().parent().parent().find('.dependent_info').html('This field is dependent on Re-Submit Application Logic'); 
        }
        //in case of dynamic registration select field
        if(type === "select"){
            type = "dropdown";
        }
        if (type === "dropdown" || type === "predefined_dropdown") {
            if (html_field_id === 'campu|publisher_id'  || html_field_id === 'pub|publisher_id') {
                val_json = '[]';
                html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select publisher_filter sel_value' name='" + cur_val_name + "' data-field='"+html_field_id+"'>";
            } else if (html_field_id === 'campu|traffic_channel') {
                html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select traffic_channel sel_value' name='" + cur_val_name + "' data-field='"+html_field_id+"'>";
            } else if (html_field_id ===  'registration_instance' || html_field_id ===  'ud|lead_followup_date' || html_field_id ===  'ae_engaged_status|engaged_status' || html_field_id === 'cld|communication_type' || html_field_id === 'cld|event_type' || html_field_id === 'cld|communication_job') {
                html = "<select placeholder='Select an Option' class='sumo_select registration_instance sel_value' name='" + cur_val_name + "' data-field='"+html_field_id+"'>";
            } else if (html_field_id === 'ap|payment_status') {
                html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select payment_status sel_value' name='" + cur_val_name + "' data-field='"+html_field_id+"'>";
            } else if (html_field_id === 'ap|payment_method') {
                html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select payment_method sel_value' name='" + cur_val_name + "' data-field='"+html_field_id+"'>";
            }else if(html_field_id === 'psal|id') {
                html = "<select  placeholder='Select an Option' class='chosen-select sel_value " + html_field_id + "' name='" + cur_val_name + "' data-field='"+html_field_id+"' data-ct='"+call_type+"'>";
            }else if(html_field_id === 'ud|lead_stage') {
//                var classval = html_field_id.split("|");
                var closestDiv = $(currentObj).closest('.block-repeat');
                if($(".sel_value.ud\\|lead_sub_stage",closestDiv).length > 0){
                    html = "<select placeholder='Select an Option' class='sumo_select sel_value lead_stage' multiple='multiple' name='" + cur_val_name + "' data-field='"+html_field_id+"' data-ct='"+call_type+"'>";
                }else{
                    html = "<select placeholder='Select an Option' class='sumo_select sel_value lead_stage' multiple='multiple' name='" + cur_val_name + "' data-field='"+html_field_id+"' data-ct='"+call_type+"'>";
                }
            }else {    
                html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select sel_value " + html_field_id + "' name='" + cur_val_name + "' data-field='"+html_field_id+"' checkDependentFieldVal='"+checkDependentFieldVal+"' data-ct='"+call_type+"'>";
            }
            if(html_field_id === 'ud|lead_sub_stage' && selected === ''){
                    var currentDiv  = $(currentObj).closest('.block-repeat');
                    parentFieldId = 'lead_stage';
//                    if($(".sel_value."+parentFieldId,currentDiv).length > 0 && $("select.sel_value."+parentFieldId,currentDiv).prop("multiple")){
//                       // $("select.sel_value."+parentFieldId,currentDiv).prop("multiple",'');
//                        $(".sel_value."+parentFieldId,currentDiv).val('');
//                        $(".sel_value."+parentFieldId,currentDiv)[0].sumo.reload(); 
//                    }
                    var stageId =  $(".sel_value."+parentFieldId).val();
                    if(stageId!= 0 && typeof stageId != 'undefined'){
                        getSubstage(stageId,$(".sel_value."+parentFieldId,currentDiv),[]);
                        //getLeadSubStages(stageId,$(".sel_value."+parentFieldId,currentDiv),[]);
                    }
            }
            var obj_json = JSON.parse(val_json);
            if($.inArray(html_field_id,['ud|country_id','ud|state_id','ud|city_id','ud|course_id','ud|specialization_id','ud|university_id','ud|district_id']) >= 0 ){
                html += '<option value="0">' + label_name +  jsVars.notAvailableText+' </option>';
            }
            for (var key in obj_json) {
                //default select pri registration in registration instance
                var select = '';
                if (key === 'pri_register_date') {
                    select = 'selected';
                }
                if(typeof obj_json[key] === 'object'){
                    html += '<optgroup label="'+key+'">';
                    for (var key2 in obj_json[key]) {
                        html += "<option " + select + " value=\"" + key2 + "\">" + obj_json[key][key2] + "</option>";
                    }
                    html += '</optgroup>';
                }else{
                    if(type === 'predefined_dropdown'){
                        if (html_field_id === 'goqles_organisation_field') {
                            var tmpTitle = obj_json[key].split('-')[1];
                            html += "<option " + select + " value=\"" + key+";;;"+ obj_json[key]  + "\">" + tmpTitle + "</option>";
                        }else{
                            html += "<option " + select + " value=\"" + key+";;;"+ obj_json[key]  + "\">" + obj_json[key] + "</option>";
                        }
                    }else{
                        html += "<option " + select + " value=\"" + key + "\">" + obj_json[key] + "</option>";
                    }
                }
            }
            html += "</select>";
            
            
            if(type === 'predefined_dropdown'){
                updateOperator('predefined_dropdown', cur_type_name, typeselected);
            }else{
                updateOperator('dropdown', cur_type_name, typeselected);
            }
            
        } else if (type === "date") {
            
//            if (jQuery("[name='" + cur_type_name + "']").val() === 'between' || typeselected === 'between' && (inputId !== "follow_up_date")) {
//                class_date = "date_time_rangepicker_report";
//            }if (inputId === "last_lead_followup_complete_date") {
//                class_date = "date_time_rangepicker_dynamic";
//                if(selected != '')
//                {
//                    followupDateValue = $.parseJSON(selected);
//                }
//            } else {
//                class_date = "datetimepicker_report";
//            }
//            
//            html = "<input type='text' class='form-control sel_value " + class_date + "' name='" + cur_val_name + "' data-value='"+followupDateValue+"' value='' readonly='readonly' placeholder='" + labelname + "' data-id='" + html_field_id + "' data-field='"+html_field_id+"'>";

            class_date = "date_time_rangepicker_dynamic";
            
            if (inputId === "last_lead_followup_complete_date") {
                class_date = "date_time_rangepicker_dynamic_followup";
            }

            if(selected != ''){
                betweenDateValue = $.parseJSON(selected);
            }
        
            html = "<input type='text' class='form-control sel_value " + class_date + "' name='" + cur_val_name + "' data-value='"+betweenDateValue+"' value='' readonly='readonly' placeholder='" + labelname + "' data-id='" + html_field_id + "' data-field='"+html_field_id+"'>";

            updateOperator('date', cur_type_name, typeselected);
        }
        else {
            html = "<input type='text' class='form-control sel_value' name='" + cur_val_name + "' value='' placeholder=' Enter Value' data-id='" + html_field_id + "' data-field='"+html_field_id+"'>";
            if(type === "number_range"){
                updateOperator('number_range', cur_type_name, typeselected);
            }else{
                updateOperator('text', cur_type_name, typeselected);
            }
        }
    } else {
        html = "<input type='text' class='form-control sel_value' name='" + cur_val_name + "' value='" + selected + "' placeholder='Enter Value' data-field='"+html_field_id+"'>";
        updateOperator('text', cur_type_name, typeselected);
        if(type === "number_range"){
            updateOperator('number_range', cur_type_name, typeselected);
        }else{
            updateOperator('text', cur_type_name, typeselected);
        }
    }

    // finally show the field in DOM
    if (html) {

        if (typeof type !== "undefined" && type === 'date') {
            html = '<div class="dateFormGroup "><div class="iconDate"><i aria-hidden="true" class="fa fa-calendar-check-o"></i></div><div class="input text">' + html + '</div></div>';
        } else {
            html = '<div class="">' + html + '</div>';
        }
        var finalhtml = html;
        
        if ($("[name='" + cur_val_name + "']").parents('.field_value_div').length > 0) {
            $("[name='" + cur_val_name + "']").parents('.field_value_div').html(finalhtml);  
        }
    }
    
     // hide value div if change is made
    $("[name='" + cur_val_name + "']").parents('.field_value_div>div').hide();
    
    //load publisher referrer
    if (html_field_id=== 'pub|publisher_id' || html_field_id=== 'campu|publisher_id' ) {
        if($("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.traffic_channel').last().val()){
            appendFlag = 1;
            var selectedChannel = $("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.traffic_channel').last().val();
            var currentElementObj = $("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.publisher_filter').last();
            populatePublisherReferrers(currentElementObj, [], selectedChannel);
            appendFlag = 0;
        }
       
    }

    //load campaign source, medium , name value
    if (selected === '' && $.inArray(html_field_id,['campu|source_value','campap|conversion_source_value']) >= 0 ) {
        
        if($("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.publisher_filter').last().val()){
            
            // application manager
            var pub_val = $("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.publisher_filter').last().val();

            if(typeof pub_val !== 'undefined' && pub_val.length !==  0){
                var trafficChannel = 1;
                trafficChannel = $("[name='" + cur_val_name + "']").parents('.block-repeat').find('.traffic_channel').val();
                if(trafficChannel === 'undefined'){
                    trafficChannel = $("select.traffic_channel").val();
                } 
                $.each(pub_val, function(k,pub_val_single){
                    var pub_val_ar = pub_val_single.split('___');
                    pub_val = pub_val_ar[0];
                     if(html_field_id === 'campap|conversion_source_value'){
                        getCampaignsSourceConfig(currentObj, pub_val, '', 'campap\\|conversion_source_value',trafficChannel);
                    }else{
                        getCampaignsSourceConfig(currentObj, pub_val,'','',trafficChannel);
                        getCampaignsSourceConfig(currentObj, pub_val, '', 'campap\\|conversion_source_value',trafficChannel);
                    }
                    
                });
                appendFlag = 0;
            }
        }
    }
   
    if (selected === '' && $.inArray(html_field_id,['campu|medium_value','campap|conversion_medium_value']) >= 0) {
        var searchFieldClass = 'campu\\|source_value';
        if(html_field_id === 'campap|conversion_medium_value'){
            searchFieldClass = 'campap\\|conversion_source_value';
        }
        /// load value from 
        var source_val_arr = $("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.'+searchFieldClass).last().val();
        
        if(typeof source_val_arr !== 'undefined' && source_val_arr !== '' && source_val_arr != null){
            $.each(source_val_arr, function(k, source_val){
                if(typeof source_val !== 'undefined' && source_val !== ''){
                    var source_val_ar = source_val.split('___');
                    source_val = source_val_ar[0];
                    if(html_field_id === 'campap|conversion_medium_value'){
                        getCampaignsMediumConfig(currentObj, source_val, '', 'campap\\|conversion_medium_value');
                    }else{
                        getCampaignsMediumConfig(currentObj, source_val);
                    }
                    
                }
            });
            appendFlag = 0;
        }
    }
    
    if (selected === '' && $.inArray(html_field_id,['campu|name_value','campap|conversion_name_value']) >= 0) {
        /// load value from 
        var mediumValueClass =  'campu\\|medium_value';
        var sourceValueClass =  'campu\\|source_value';
        if(html_field_id === 'campap|conversion_name_value'){
            mediumValueClass = 'campap\\|conversion_medium_value';
            sourceValueClass = 'campap\\|conversion_source_value';
        }
        var medium_val_arr = $("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.'+mediumValueClass).last().val();
        
        if(typeof medium_val_arr !== 'undefined' && medium_val_arr !== '' && medium_val_arr !== null){
            $.each(medium_val_arr, function(k, medium_val){
                var medium_val_ar = medium_val.split('___');            
                medium_val = medium_val_ar[0];
                
                if(html_field_id === 'campap|conversion_name_value'){
                    getCampaignsNameConfig(currentObj, medium_val, '', 'campap\\|conversion_name_value');
                }else{
                    getCampaignsNameConfig(currentObj, medium_val);
                }
            });
            appendFlag = 0;
        }else{
            var source_val_arr = $("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.'+sourceValueClass).last().val();
            if(typeof source_val_arr !== 'undefined' && source_val_arr !== '' && medium_val_arr !== null){
                $.each(source_val_arr, function(k, source_val){
                    var source_val_ar = source_val.split('___');
                    source_val = source_val_ar[0];
                    if(html_field_id === 'campap|conversion_name_value'){
                        getCampaignsNameConfig(currentObj, source_val,[],'campap\\|conversion_name_value','source_value');
                    }else{
                        getCampaignsNameConfig(currentObj, source_val,[],'','source_value');
                    }
                });
                appendFlag = 0;
            }
        }
    }

    if(checkDependentFieldVal == 1){
        //get All Registration Dependent Child Values
        getChildtaxonomyValues(html_field_id, cur_val_name, label_name);
    }
    
    //get college creater list
    if (html_field_id === 'CreatedBySelect'){
        if (typeof CollegeWiseCreaterList !== "undefined" && typeof CollegeWiseCreaterList['CollegeWise'] !=='undefined' && $('#FilterLeadForm select#user_college_id').val() in CollegeWiseCreaterList['CollegeWise'])
        {
            UpdateCreatedBySelect(CollegeWiseCreaterList['CollegeWise'][$('#FilterLeadForm select#user_college_id').val()], postedCreatedBy, cur_val_name);
        }
    }
    
    if ((type === "dropdown" || type === "predefined_dropdown") && selected !== '') {
         $("[name='" + cur_val_name + "']").val(JSON.parse(selected));
    }else if(selected !== ''){        
        selected = JSON.parse(selected);
        $("[name='" + cur_val_name + "']").val(selected[0]);
    }
    
    $('.chosen-select').chosen();
    $('.chosen-select').trigger('chosen:updated');
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});

   
    if(selected === ''){
    // remove hidden field if change is made
        $("[name='" + cur_val_name + "']").parents('div.condition_div').find('.sel_value_hidden').remove();
    }
    
    // hide condition div if blank
    if (value_field === '') {
        $("[name='" + cur_type_name + "']").parents('.field_value_condition>div').hide();
    } else {
        $("[name='" + cur_type_name + "']").parents('.field_value_condition>div').show();
    }
    if (type === "date") {
        LoadDateTimepicker();
        LoadDateTimeRangepicker();

//        if(typeof followupDateValue != 'undefined' && followupDateValue != '')
//        {
//            reinitializeDateRangePicker(followupDateValue.toString().toLowerCase());
//        }else{
//            LoadFollowupDateTimeRangepicker();

        if (inputId === "last_lead_followup_complete_date") {
            LoadFollowUpDynamicDateTimeRangepicker();
        }else{
            LoadDynamicDateTimeRangepicker();

        }
    }
    
    //&& dependentField.indexOf('fixed_') !== 0  //commented fixed
    if(typeof dependentField !== 'undefined' && dependentField !== ''){
        checkDependentField(html_field_id,currentObj,type,selected);
    }

    $('select.sumo_select').SumoSelect({placeholder: labelname, search: true, searchText:labelname, captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
}

function checkConditionType(elem, module) { 
    if(typeof module === 'undefined'){
        module = '';
    }
    
//    var followupDateString  = "";

    var betweenDateValue = ''
    var val  = $(elem).val();
    var name = $(elem).attr('name');
    var cur_val_name = name.replace('[types]', '[values][]');
    var selected     = $("[name='" + cur_val_name + "']").val();
    var elemType     = $("[name='" + cur_val_name + "']").attr('type');
    
    jQuery("[name='" + cur_val_name + "']").removeAttr('disabled');
    $("[name='" + cur_val_name + "']").removeAttr("oninput");
    if(elemType === 'text' ){
        $("[name='" + cur_val_name + "']").attr("placeholder", "Enter Value"); 
    }
    if ($("[name='" + cur_val_name + "']").parents('.field_value_div').length > 0) {

        if (val === 'Select Condition' || val === '') {
            $("[name='" + cur_val_name + "']").parents('.field_value_div>div').hide();
            // if hide then selected value reset
            selected = '';
        } else {
            $("[name='" + cur_val_name + "']").parents('.field_value_div>div').show();
        }
    }
    if (val === 'between') {
        jQuery("[name='" + cur_val_name + "'].daterangepicker").remove();

        jQuery("[name='" + cur_val_name + "']").val('');        
//        var classDate = 'date_time_rangepicker_report';
//        if(jQuery("[name='" + cur_val_name + "']").hasClass("date_time_rangepicker_dynamic"))
//        {
////            jQuery("[name='" + cur_val_name + "']").data('DateTimePicker').destroy();
//            followupDateString = jQuery(".date_time_rangepicker_dynamic").attr("data-value");

        var classDate = 'date_time_rangepicker_dynamic';
        
        if(jQuery("[name='" + cur_val_name + "']").hasClass("date_time_rangepicker_dynamic") || jQuery("[name='" + cur_val_name + "']").hasClass("date_time_rangepicker_dynamic_followup"))
        {
            betweenDateValue = jQuery("[name='" + cur_val_name + "']").attr("data-value");

        }else{
            if(jQuery("[name='" + cur_val_name + "']").hasClass('datetimepicker_report')){ 
                jQuery("[name='" + cur_val_name + "']").data('DateTimePicker').destroy();
            }

            jQuery("[name='" + cur_val_name + "']").removeClass('datepicker_report');
            jQuery("[name='" + cur_val_name + "']").removeClass('datetimepicker_report').addClass(classDate);

            jQuery("[name='" + cur_val_name + "']").datepicker('remove');

//            jQuery("[name='" + cur_val_name + "']").removeClass('datepicker_report date_time_rangepicker_report datetimepicker_report');
//            jQuery("[name='" + cur_val_name + "']").addClass(classDate);
//            
//            jQuery("[name='" + cur_val_name + "']").datepicker('remove');
            

            if(module === 'renderCtp'){
                $("[name='" + cur_val_name + "']").val(selected); 
            }
        }

    } else if (val === 'before' || val === 'after') {
        jQuery('.datepicker,.daterangepicker').remove();
        jQuery("[name='" + cur_val_name + "']").val('');
        var removeClassDate = 'date_time_rangepicker_report';
        var addClassDate = 'datetimepicker_report';
        jQuery("[name='" + cur_val_name + "']").removeClass('date_time_rangepicker_dynamic date_time_rangepicker_dynamic_followup');

        jQuery("[name='" + cur_val_name + "']").removeClass(removeClassDate).addClass(addClassDate);
        
        jQuery("[name='" + cur_val_name + "']").off('hide.daterangepicker');
        if(module === 'renderCtp'){
            $("[name='" + cur_val_name + "']").val(selected); 
        }
        
    } else if (val === 'empty' || val === 'not_empty') {
        var parseval = 'Empty';
        if(val === 'not_empty'){
            parseval = 'Not Empty';
        }
        jQuery('.datepicker,.daterangepicker').remove();
        jQuery("[name='" + cur_val_name + "']").val(parseval);
        if(jQuery("[name='" + cur_val_name + "']").val() === null){
            jQuery("[name='" + cur_val_name + "']").append("<option style ='display:none' value='"+parseval+"'>"+parseval+" </option>");
            jQuery("[name='" + cur_val_name + "']").val(parseval);
        }
        if(jQuery("[name='" + cur_val_name + "']").hasClass('datetimepicker_report')){ 
            jQuery("[name='" + cur_val_name + "']").data('DateTimePicker').destroy();
        }
        jQuery("[name='" + cur_val_name + "']").removeClass('datepicker_report datetimepicker_report daterangepicker_report date_time_rangepicker_report date_time_rangepicker_dynamic date_time_rangepicker_dynamic_followup');
        jQuery("[name='" + cur_val_name + "']").datepicker('remove');
        
        jQuery("[name='" + cur_val_name + "']").attr('disabled',true);
        if($("[name='" + cur_val_name + "']")[0] && $("[name='" + cur_val_name + "']")[0].sumo){
            $("[name='" + cur_val_name + "']")[0].sumo.reload();
        }
    } else if (val === 'num_between' ) {
        if(selected === 'Empty' || selected === 'Not Empty'){
            selected = '';
        }else if(selected.indexOf(',') === -1){
            selected = '';
        }
        $("[name='" + cur_val_name + "']").val(selected); 
        $("[name='" + cur_val_name + "']").attr("placeholder", "Comma seperated value"); 
        $("[name='" + cur_val_name + "']").attr("oninput", "validateInput(this);"); 
    }else if (val === 'lt' || val === 'gt' || val === 'lteq' || val === 'gteq') {
        if(selected === 'Empty' || selected === 'Not Empty'){
            selected = '';
        }
        $("[name='" + cur_val_name + "']").val(selected); 
        if($("[name='" + cur_val_name + "']")[0] && $("[name='" + cur_val_name + "']")[0].sumo){
            $("[name='" + cur_val_name + "'] option[value='Not Empty']").remove();  
            $("[name='" + cur_val_name + "'] option[value='Empty']").remove(); 
            $("[name='" + cur_val_name + "']")[0].sumo.reload();
        }
        $("[name='" + cur_val_name + "']").attr("oninput", "validateInput(this);"); 
    }else{
        if(selected === 'Empty' || selected === 'Not Empty'){
            selected = '';
        }
        $("[name='" + cur_val_name + "']").val(selected); 
        if($("[name='" + cur_val_name + "']")[0] && $("[name='" + cur_val_name + "']")[0].sumo){
            $("[name='" + cur_val_name + "'] option[value='Not Empty']").remove();  
            $("[name='" + cur_val_name + "'] option[value='Empty']").remove(); 
            $("[name='" + cur_val_name + "']")[0].sumo.reload();
        }
    }
    var dateTimePickerElem     = $("[name='" + cur_val_name + "']").hasClass('datetimepicker_report');
    var dateTimeRangePickerElem     = $("[name='" + cur_val_name + "']").hasClass('date_time_rangepicker_report');
    if(dateTimePickerElem || dateTimeRangePickerElem){
        $("[name='" + cur_val_name + "']").attr("placeholder", "Select an Option"); 
    }
    LoadDateTimepicker();
    LoadDateTimeRangepicker();
//    if(followupDateString != '')
//    {
//        reinitializeDateRangePicker(followupDateString.toString().toLowerCase());
//    }else{
//        LoadFollowupDateTimeRangepicker();


    if(betweenDateValue != '') {
        if(jQuery("[name='" + cur_val_name + "']").hasClass("date_time_rangepicker_dynamic_followup")){
            reinitializeDateRangePicker(betweenDateValue.toString().toLowerCase(),cur_val_name,"custom_followup");
        }else{
            reinitializeDateRangePicker(betweenDateValue.toString().toLowerCase(),cur_val_name);            
        }
    }else{
        if(jQuery("[name='" + cur_val_name + "']").hasClass("date_time_rangepicker_dynamic_followup")){
            LoadFollowUpDynamicDateTimeRangepicker();
        }else{
            LoadDynamicDateTimeRangepicker();
        }

    }
    datePickerChangeTrigger();
    $('.chosen-select').chosen();
    $('.chosen-select').trigger('chosen:updated');
   
}

function validateInput(xc) {
    //only 45,65 type value
    xc.value = xc.value.replace(/[^0-9,]/g, ''); 
    xc.value = xc.value.replace(/(\,,*)\,/g, '$1'); 
    xc.value = xc.value.replace(/^(-?),*?(\d+\,\d+).*$/, '$1$2');
//  xc.value = xc.value.replace(/^(-?).*?(\d+\.\d{2}).*$/, '$1$2');
}

function GetChildByMachineKeyConfig(elem, ContainerId, Choose, select_name_value) {
    if (elem && ContainerId) {
        var key = $(elem).val();
        if (typeof select_name_value === 'undefined') {
            select_name_value = [];
        }

        $.ajax({
            url: '/common/GetChildByMachineKeyForRegistration',
            type: 'post',
            dataType: 'json',
            data: {key: key},
            beforeSend: function () {
                if($(".loader-block").length){
                    $(".loader-block").show();
                }
            },
            complete: function () {
                if($(".loader-block").length){
                    $(".loader-block").hide();
                }
            },
            async: false,
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                if (json['redirect']) {
                    location = json['redirect'];
                }
                if (json['error']) {
                    alertPopup(json['error'], 'error');
                } else if (json['success']) {
                    var html = '<option value="">Registered ' + Choose + '</option>';
                    if ((Choose == 'State') && ($(elem).parents('.block-repeat').find('.cityid').length > 0))
                    {
                        $(elem).parents('.block-repeat').find('.cityid').html('<option value="">Registered City</option>');
                    }

                    var default_val = select_name_value[$(elem).parents('.block-repeat').find('.' + ContainerId).attr('name')];

                    for (var key in json['list']) {
                        if (key == default_val) {

                            html += '<option value="' + key + '" selected="selected">' + json['list'][key] + '</option>';
                        } else {
                            html += '<option value="' + key + '">' + json['list'][key] + '</option>';
                        }
                    }
                    $(elem).parents('.block-repeat').find('.' + ContainerId).html(html);

                    $('.chosen-select').chosen();
                    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                    $('.chosen-select').trigger('chosen:updated');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
    return false;
}

function loadDefaultValueOnLoadApplication(select_name_value, div_id) {
    // load city if
    if (typeof select_name_value === 'undefined') {
        select_name_value = [];
    }

    $('#' + div_id + ' .sel_value').each(function () {
        // call function according to class type
        var elemClass = $(this).attr('class');
        var currentElementObj = $(this);
        var elemName = $(this).attr('name');
//        alert(elemClass);
        if (typeof elemClass != 'undefined' && elemClass.indexOf('field_') > -1) {
            
            var default_value = select_name_value[elemName];
            
            if(typeof default_value != 'undefined' && default_value != ''){
                if($(currentElementObj).parents('.block-repeat').find('[name="' + elemName+'"]').length){
                    
                    $.each(JSON.parse(default_value), function(k, v){  
                        $(currentElementObj).parents('.block-repeat').find('[name="' + elemName+'"] option[value="'+ v +'"]').prop('selected', true);
                    });                
                    $(currentElementObj).parents('.block-repeat').find('[name="' + elemName+'"]')[0].sumo.reload();
                }
                
            }
            
        } else if(typeof elemClass != 'undefined' && elemClass.indexOf('countryid') > -1) {
            //GetChildByMachineKeyConfig(this, "stateid", "State", select_name_value);
        } else if (typeof elemClass != 'undefined' && elemClass.indexOf('stateid') > -1) {
            //GetChildByMachineKeyConfig(this, "cityid", "City", select_name_value);
        } 
        else if (typeof elemClass != 'undefined' && elemClass.indexOf('district_id') > -1) {
            
//            loadSavedAliases(currentElementObj,'district_id');
        }
        else if (typeof elemClass != 'undefined' && elemClass.indexOf('city_id') > -1) {
            
//            loadSavedAliases(currentElementObj,'city_id');
        } else if (typeof elemClass != 'undefined' && elemClass.indexOf("ud|lead_sub_stage") > -1) {
            var parentFieldId = 'lead_stage';
            
            if($(".sel_value."+parentFieldId).length > 0){
                new_cur_val_name  =  $(".sel_value."+parentFieldId).attr('name');
//                $("select.sel_value."+parentFieldId).prop("multiple",'');
//                $(".sel_value."+parentFieldId)[0].sumo.reload(); 
            }
            var stageId =  $(".sel_value."+parentFieldId).val();
            if(stageId!= 0 && typeof stageId != 'undefined'){
                getSubstage(stageId,$(".sel_value."+parentFieldId),select_name_value);
             }
//            loadSavedAliases(currentElementObj,'city_id');
        } else if (typeof elemClass != 'undefined' && elemClass.indexOf('traffic_channel') > -1) {
//            if ($(this).val() == 1) {//campaign option
//                getPublisherListConfig(this, select_name_value, 'publisher_filter');
//            } else if ($(this).val() == 5 || $(this).val() == 3 || $(this).val() == 4) {
//                getReferrerListConfig(this, select_name_value, 'publisher_filter');
//            }
        appendFlag = 0;
        var tempThis = this;
        $.each($(this).val(), function(k,channelVal){
            if(k >= 1){
               appendFlag = 1;
            } 
            if (channelVal == 1 || channelVal==2 || channelVal==7 || channelVal == 8 || channelVal == 9) {//campaign option                      
                getPublisherListConfig(tempThis, select_name_value, 'publisher_filter',channelVal);
            } else if (channelVal == 5 || channelVal == 3 || channelVal == 4) {                
                getReferrerListConfig(tempThis, select_name_value, 'publisher_filter',channelVal);
            } else if(channelVal == 6){
                getDirectListConfig(tempThis, select_name_value, 'publisher_filter',channelVal)
            } else if(channelVal == 10){
                getChatListConfig(tempThis, select_name_value, 'publisher_filter',channelVal)
            }
//            else if(channelVal == '9'){
//                getOfflineListConfig(currentElementObj, select_name_value, 'publisher_filter');
//            }
        });
        appendFlag = 0;
        } else if (typeof elemClass != 'undefined' && elemClass.indexOf('publisher_filter') > -1) {
            var tfc = $(this).parents('.block-repeat').find('.traffic_channel').val();
            if(tfc === 'undefined'){
                tfc = 1;
            }
            $.each($(this).val(), function(k,pub_value){
                //conversion source
                getCampaignsSourceConfig(currentElementObj, pub_value, select_name_value, 'campap\\|conversion_source_value',tfc);
                getCampaignsSourceConfig(currentElementObj, pub_value, select_name_value,'', tfc);
            });
            appendFlag = 0;
             
        } else if (typeof elemClass != 'undefined' && elemClass.indexOf('conversion_source_value') > -1) {
            
            var source_value_arr = $(this).val();
             if(source_value_arr != null && typeof source_value_arr !='undefined' && source_value_arr!=''){
                 $.each(source_value_arr, function(k, source_value){
                    if(typeof source_value !='undefined' && source_value!=''){
                        var source_name_ar = source_value.toString().split('___');
                        source_value = source_name_ar[0];
                    }

                    getCampaignsMediumConfig(currentElementObj, source_value, select_name_value, 'campap\\|conversion_medium_value');
                    getCampaignsNameConfig(currentElementObj, source_value, select_name_value, 'campap\\|conversion_name_value');
                 });
             }
            
            appendFlag = 0;
        } else if (typeof elemClass != 'undefined' && elemClass.indexOf('source_value') > -1) {
            var source_value_arr = $(this).val();
            if(source_value_arr != null && typeof source_value_arr !='undefined' && source_value_arr!=''){
                $.each(source_value_arr, function(k, source_value){
                    if(typeof source_value !='undefined' && source_value!=''){
                        var source_name_ar = source_value.toString().split('___');
                        source_value = source_name_ar[0];
                    }
                    getCampaignsMediumConfig(currentElementObj, source_value, select_name_value);
                    getCampaignsNameConfig(currentElementObj, source_value, select_name_value);
                });
                
                appendFlag = 0;
            }
            
        } else if (typeof elemClass != 'undefined' && elemClass.indexOf('conversion_medium_value') > -1) {
            
            var medium_values = $(this).val();
            $.each(medium_values, function(k, medium_value){
                
                if(typeof medium_value !='undefined' && medium_value!=''){
                    var medium_name_ar = medium_value.split('___');
                    medium_value = medium_name_ar[0];
                }

                getCampaignsNameConfig(currentElementObj, medium_value, select_name_value, 'campap\\|conversion_name_value');
            });
            appendFlag = 0;
            
        } else if (typeof elemClass != 'undefined' && elemClass.indexOf('medium_value') > -1) {
            
            var medium_value_arr = $(this).val();
   
            if(medium_value_arr != null && medium_value_arr != ''){
                $.each(medium_value_arr, function(k, medium_value){
                    if(typeof medium_value !='undefined' && medium_value!=''){
                    var medium_name_ar = medium_value.split('___');
                    medium_value = medium_name_ar[0];
                }
                getCampaignsNameConfig(currentElementObj, medium_value, select_name_value);
              });
              appendFlag = 0;
           }
        }
    });
}



function leadAndOrBlockCondition(elem) {
    $('#FilterLeadForm .block_criteria a.btn_or,#FilterLeadForm .block_criteria a.btn_and').removeClass('active');
    if ($(elem).hasClass('btn_or')) {
        $('#FilterLeadForm .block_criteria a.btn_or').addClass('active');
        $('#app_block_condition').val('or').trigger('change');
    } else if ($(elem).hasClass('btn_and')) {
        $('#FilterLeadForm .block_criteria a.btn_and').addClass('active');
        $('#app_block_condition').val('and').trigger('change');
    }
    return false;
}

/**
 * 
 * @param {type} type
 * @param {type} container_name
 * @param {type} selected
 * @returns {undefined}
 */

function updateOperator(type, container_name, selected) {

    if (typeof selected === 'undefined') {
        selected = '';
    }
    var curFieldName = container_name.replace('[types]', '[fields]');
    var selectedField = jQuery("[name='" + curFieldName + "']").val();
    var html = '<option value="">Select Condition</option>';
    var operator = {
        'dropdown': {
            'eq': 'Equals',
            'neq': 'Does Not Equals',
            'eq_dd': 'Contains',
            'neq_dd': 'Does Not Contains',
            'not_empty': 'Is not empty',
            'empty': 'Is empty'
        },
        'predefined_dropdown': {
            'eq': 'Equals',
            'neq': 'Does Not Equals',
            'multi_contains': 'Contains',
            'not_multi_contains': 'Does Not Contains',
            'not_empty': 'Is not empty',
            'empty': 'Is empty'
        },
        'text': {
            'eq': 'Equals',
            'neq': 'Does Not Equals',
            'contains': 'Contains',
            'not_contains': 'Does Not Contains',
            'not_empty': 'Is not empty',
            'empty': 'Is empty'
        },
        'number_range': {
            'lt': 'Less than',
            'gt': 'Greater than',
            'lteq': 'Less than or equal to',
            'eq': 'Equal to',
            'gteq': 'Greater than or equal to',
            'neq': 'Not Equal to',
            'num_between': 'Between',
            'not_empty': 'Is not empty',
            'empty': 'Is empty'
//            'starts_with': 'Starts with',
//            'ends_with': 'Ends with',
//            'contains': 'Contains',
//            'not_contains': 'Does not contain',
//            'eq_like': 'Exactly Matches'
        },
        'date': {
            'between': 'Between',
            'before': 'Before',
            'after': 'After',
            'not_empty': 'Is not empty',
            'empty': 'Is empty'
        }
    };
    if(selectedField.indexOf('fd|payment_mode||') === 0 || selectedField.indexOf('form_status||') === 0 || selectedField.indexOf('ud|zone_mapping_id||') === 0){
        operator['dropdown'] =  {
                                    'eq': 'Equals',
                                    'neq': 'Does Not Equals',
                                    'eq_dd': 'Contains',
                                    'neq_dd': 'Does Not Contains'
                                };
    }
    if(selectedField.indexOf('ud|lead_followup_date||dropdown') === 0){
        operator['dropdown'] =  {
                                    'eq': 'Equals'
                                };
    }
    if(selectedField.indexOf('ud|last_lead_followup_complete_date||date||') === 0){
        operator['date'] =  {
                                    'between': 'Between'
                                };
    }
    if(selectedField.indexOf('ud|zone_mapping_id||') === 0){
        operator['dropdown'] =  {
                                    'eq_dd': 'Contains',
                                    'neq_dd': 'Does Not Contains'
                                };
    }
    if(selectedField.indexOf('psal|id||') === 0 || selectedField.indexOf('ae_engaged_status|engaged_status||') === 0
       || selectedField.indexOf('cld|communication_type||') === 0 || selectedField.indexOf('cld|event_type') === 0){
        operator['dropdown'] =  {
                                    'eq': 'Equals',
                                };
    }
    if(selectedField.indexOf('rfl|status||') === 0 || selectedField.indexOf('registration_instance||') === 0){
        operator['dropdown'] =  {
                                    'eq': 'Equals',
//                                    'neq': 'Does Not Equals',
                                };
    }
    if (typeof type !== 'undefined' && ['dropdown', 'text', 'number_range','date','predefined_dropdown'].indexOf(type) > -1) {        
        for (var lkey in operator[type]) {
            html += '<option value="' + lkey + '">' + operator[type][lkey] + '</option>';
        }
    }
    jQuery("[name='" + container_name + "']").html(html);
    jQuery("[name='" + container_name + "']").val(selected);
    jQuery('.chosen-select').chosen();
}

function checkDependentField(field, currentObj, type, selected){
    if(typeof field === 'undefined' || field=== ''){
        return false;
    }
    
    if(typeof selected === 'undefined'){
        selected = '';
    }
    var field_data = {};
    jQuery(currentObj).parents('.block-repeat').find('select.sel_value').each(function(){
        var prev_field = jQuery(this).data('field');
        var value = jQuery(this).val();
        field_data[prev_field]  = value;
    });
    
    var form_id = jQuery(currentObj).parents('form').find('[name="form_id"]').val();
    var collegeId = jQuery(currentObj).parents('form').find('[name="s_college_id"]').val();
    var label_name = jQuery(currentObj).find(':selected').data('label_name');
    
    field_data['current_field'] = field;
    field_data['form_id']       = form_id;
    field_data['collegeId']       = collegeId;
    var standardDropdown    = false;
    if(field.substr(0,2)=="ud"){
        standardDropdown=true;
    }
    jQuery.ajax({
        url: '/users/get-check-dependent-field',
        type: 'post',
        dataType: 'json',
        async: false,
        data: field_data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            if (json['redirect']) {
                window.location.href = json['redirect'];
            } else if (json['error']) {
                alertPopup(json['error'], 'error');
            } else if (typeof json['success'] != 'undefined' && json['success'] == 200) {                
                if(Object.keys(json['option']).length){
                    var html = '';
                    var selectedOption="";
                    var splitField = field.split('|'); 
                    
                    if(type === 'predefined_dropdown' || type === 'dropdown'){
                        if(typeof splitField[0] !== 'undefined' && splitField[0] != 'clgreg'){
                            selectedOption="";
                            if(selected !== '' && Object.values(JSON.parse(selected)).indexOf('0') > -1) {
                                selectedOption=" selected ";
                            }
                            html += '<option value="0" '+selectedOption+'>' + label_name+jsVars.notAvailableText+' </option>';
                        }
                    }
                    for (var lkey in json['option']) {
                        selectedOption="";
                        if(standardDropdown){
                            if(selected.indexOf(lkey)!== -1){
                                selectedOption=" selected ";
                            }
                            html += '<option value="' + lkey + '"'+selectedOption+'>' + json['option'][lkey] + '</option>';
                        }else if(type === 'predefined_dropdown' || type === 'dropdown' || type === 'select'){
                            if(selected.indexOf(lkey + ";;;"+json['option'][lkey])!== -1){
                                selectedOption=" selected ";
                            }
                            html += '<option value="' + lkey + ";;;"+json['option'][lkey]+'"'+selectedOption+'>' + json['option'][lkey] + '</option>';
                        }else{
                            if(selected.indexOf(lkey)!== -1){
                                selectedOption=" selected ";
                            }
                            html += '<option value="' + lkey + '"'+selectedOption+'>' + json['option'][lkey] + '</option>';
                        }
                    }
                    
                    var splitField = field.split('|'); //For Registration Dependent
                    if(typeof splitField[0] !== 'undefined' && splitField.length>1 && $.inArray(splitField[0],['ud','clgreg']) > -1 &&
                       jQuery(currentObj).parents('.block-repeat').find('.'+splitField[0]+'\\|'+splitField[1]).length > 0) {

                        jQuery(currentObj).parents('.block-repeat').find('.'+splitField[0]+'\\|'+splitField[1]).html(html);
                    }else if(jQuery(currentObj).parents('.block-repeat').find('.' + field).length > 0){
                        jQuery(currentObj).parents('.block-repeat').find('.' + field).html(html);
                    }
                }
            }
        
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/**
 * 
 * @param {type} elem
 * @param {type} type
 * @returns {Boolean}
 */
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
 * remove Application block
 * @param {type} elem
 * @returns {Boolean}
 */

function removeBlockCondition(elem) {
    var div_class = 'form0';
    var regexFieldName = new RegExp('application_advance_filter\\[\\d\\]', 'gi');
    jQuery(elem).closest('.block-repeat').prev('div.block_criteria').remove();
    jQuery(elem).closest('.block-repeat').remove();

    var block_count = 0;

    jQuery('#' + div_class + '_block .block-repeat').each(function () {
        // radio button rename
        jQuery(this).find('input[type="radio"]').each(function () {
            var fields_name = $(this).attr('name').replace(regexFieldName, 'application_advance_filter[' + block_count + ']');
            $(this).attr('name', fields_name);
        });

        jQuery(this).find('select').each(function () {
            var fields_name = $(this).attr('name').replace(regexFieldName, 'application_advance_filter[' + block_count + ']');
            $(this).attr('name', fields_name);
        });

        jQuery(this).find('[type="text"]').each(function () {
            if (typeof $(this).attr('name') != 'undefined' && $(this).attr('name') != '') {
                var fields_name = $(this).attr('name').replace(regexFieldName, 'application_advance_filter[' + block_count + ']');
                $(this).attr('name', fields_name);
            }
        });
        
        jQuery(this).find('.sel_value_hidden').each(function () {
            if (typeof $(this).attr('name') != 'undefined' && $(this).attr('name') != '') {
                var fields_name = $(this).attr('name').replace(regexFieldName, 'application_advance_filter[' + block_count + ']');
                $(this).attr('name', fields_name);
            }
        });

        block_count++;
    });
    jQuery('.chosen-select').chosen();
	setDroupClass();
    return false;
}

    
//get All Registration Dependent Child Values
function getChildtaxonomyValues(html_field_id, cur_val_name, label_name , refresh ){
    
    if(typeof refresh === 'undefined'){
        refresh = '';
    }
    var parentFieldName = '';
    var childType = '';
    var curFieldName =  cur_val_name.replace('[values][]', '[fields]');
    if($.inArray(html_field_id,['ud|state_id','ud|city_id','ud|district_id','ud|specialization_id']) >= 0 ){
        
        if(html_field_id === 'ud|state_id'){
            parentFieldName = 'country_id';
            childType = 'State';
        }else if(html_field_id === 'ud|district_id' ){
            $("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.ud\\|city_id').html('');
            if(refresh === 'true'){
                $("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.ud\\|city_id')[0].sumo.reload();
            }
            parentFieldName = 'state_id';
            childType = 'District';
        }else if(html_field_id === 'ud|city_id'){
            var isDistrictEnable = $("[name='" + curFieldName + "']").find('option[data-input_id="district_id"]').length;
            if($("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.ud\\|district_id').length || isDistrictEnable !== 0){
                parentFieldName = 'district_id';
            }else{
                parentFieldName = 'state_id';
            }
            childType = 'City';
        }else if(html_field_id === 'ud|specialization_id'){
            parentFieldName = 'course_id';
            childType = 'Specialisation';
        }
        /// load value from 
        if($("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.ud\\|'+parentFieldName).length){
            var selectedEvents = $("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.ud\\|'+parentFieldName).val();
            var html = getSelectedChildTaxonomy(selectedEvents,childType);
                html = '<option value="0">' + label_name +  jsVars.notAvailableText+' </option>' + html;
            $("[name='" + cur_val_name + "']").html(html);
            if(refresh === 'true'){
                $("[name='" + cur_val_name + "']")[0].sumo.reload();
            }
        }
    }
}

function getSelectedChildTaxonomy(selectedParentId, childType){
    
    var html = '';
    var college_id = $("#FilterLeadForm #user_college_id").val();
    if (selectedParentId !== null && selectedParentId !== '') {
        $.each(selectedParentId, function (k,  selectedValue) {
            if (typeof selectedValue !== 'undefined' && selectedValue !== '') {
                $.ajax({
                    url: '/common/GetChildByMachineKeyForRegistration',
                    type: 'post',
                    dataType: 'json',
                    data: {key: selectedValue,college_id:college_id,fetchType:'applications','childType':childType},
                    async: false,
                    headers: {
                        "X-CSRF-Token": jsVars._csrfToken
                    },
                    success: function (json) {
                        if (json['redirect']) {
                            location = json['redirect'];
                        }
                        if (json['error']) {
                            alertPopup(json['error'], 'error');
                        } else if (json['success']) {

                            for (var key in json['list']) {
                                html += '<option value="' + key + '">' + json['list'][key] + '</option>';
                            }
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    }
                });
            }
        });
    }
    return html;
}

 
/**
 * add block in condition logic ajax 
 * @returns {Boolean}
 */

function addMoreBlockConditionAjax() {

    var college_id  = jQuery('#FilterLeadForm #user_college_id').val();
    var form_id = $("#FilterLeadForm #form_id").val();
    if(college_id === '' || college_id === 0 || college_id === '0'){
        $('#college_error').html('<small class="text-danger">Please Select Institute</small>');
        return false;
    }
    var radio_val = $('#app_block_condition').val();
    var index     = parseInt($('div.block-repeat').length) ;
              
    $.ajax({
        url: '/leads/load-single-block' ,
        type: 'post',
        data: {form_id: form_id, 'college_id': college_id, index: index, block_radio: radio_val,'view':'LM'},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            hideLoader();
        },
        success: function (Html) {
            if (Html === 'session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (Html === 'key_error') {
                alert('Parameter missing!');
            } else if (Html === 'value_error') {
                alert('Parameter value missing!');
            } else if (Html === 'unable') {
                alert('Unable to process request!');
            } else {
                $("#addnewBlock").append(Html);
                $('.chosen-select').chosen();
                $('#addMoreBlockBtn').show();
				// Select DropUp
				setDroupClass();

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}
    
    
function getAdvanceFilterOptions(optionArray,callFrom){
    var asyncVal = true;
    if(callFrom === 'changeCollege'){
        asyncVal = false;
    }
    if(optionArray){
        $.ajax({
            url: '/leads/load-single-block',
            type: 'post',
            dataType: 'html',
            async:asyncVal,
            data: {'index':0,'optionArray':optionArray,'view':'LM'},
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            beforeSend: function () {
//                    showLoader();
            },
            complete: function () {
//                    hideLoader();
            },
            success: function (html) {
                if (html === 'session' ) {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else {
                    $("#savedAdvanceFilter").html('');
                    $("#addnewBlock").html(html);
                    $('.chosen-select').chosen();
                    $('#addMoreBlockBtn').show();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

function resetFilterValue(){
    $('#addMoreBlockBtn').hide();
    $("#advanceFilterMessageDiv").html('');
    $(".advancefilter_error_msg").html('');
    $("#savedAdvanceFilter").html('');
    $("#addnewBlock").html('');
    $("#search_common").val('');
    $("#sort_options").val('');
    var college_id=$('#user_college_id').val();
    advanceFilterColumnOptions(college_id,0, 'resetFilter');
//    resetFormRelatedData();
//    $('#FilterLeadForm #form_id').trigger('change');
    $('.savedFilterOpt a.columnList').removeClass('makeActive');
    $('.default-filterlist').addClass('makeActive');
    $('#savedFilterList .default-txt-view').text('Default View');
    LoadMoreLeadsUser('reset');
}

/**
 * method to render saved filter or URL Filter
 * @param {type} valueObj
 * @param {type} module
 * @returns {Boolean}
 */
function renderSavedFilter(valueObj, module) {
    if(typeof valueObj === 'string'){
        valueObj = JSON.parse(valueObj);
    }
    var college_id  = jQuery('#FilterLeadForm #user_college_id').val();
    var form_id = $("#FilterLeadForm #singleFormId").val();
    if(college_id === '' || college_id === 0 || college_id === '0'){
        alert('Please Select college first');
        return false;
    }
    var asyncVar = true;
    if(module === 'fromUrl'){
        asyncVar = false;
    }
    $.ajax({
        url: '/leads/render-saved-filter' ,
        type: 'post',
        data: {form_id: form_id, 'college_id': college_id,'valueObj':valueObj,'view':'LM'},
        dataType: 'html',
        async : asyncVar,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            showFilterLoader();
        },
        success: function (Html) {
            if (Html === 'session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (Html === 'key_error') {
                alert('Unable to process request!');
            } else {
                $("#addnewBlock").html('');
                $("#savedAdvanceFilter").html(Html);
                $('.chosen-select').chosen();
                $('#addMoreBlockBtn').show();
                if(module !== 'fromUrl')
                {
                    LoadMoreLeadsUser("reset");
                }
                hideFilterLoader();
                setDroupClass();			
					
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            hideFilterLoader();
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

/**
 * 
 * @param {type} elem
 * @param {type} getvalue
 * @param {type} select_name_value
 * @param {type} class_name
 * @param {type} tfc
 * @returns {Boolean}
 */

function getCampaignsSourceConfig(elem, getvalue, select_name_value, class_name, tfc) {

    if (typeof tfc === "undefined" || tfc === "") {
        tfc = 1;
    }

    if (typeof getvalue === "undefined" || getvalue === "") {
        return false;
    }
    if (typeof select_name_value === 'undefined') {
        select_name_value = [];
    }

    if (typeof class_name === 'undefined' || class_name === '') {
        class_name = 'campu\\|source_value';
    }
    var default_value = select_name_value[$(elem).parents('.block-repeat').find('.' + class_name).attr('name')];
    
    var college_id = $("#FilterLeadForm #user_college_id").val();
    $.ajax({
        url: '/campaign-manager/getSourceMediumName',
        type: 'post',
        dataType: 'html',
        beforeSend: function () {
            if($(".loader-block").length){
                $(".loader-block").show();
            }
        },
        complete: function () {
            if($(".loader-block").length){
                $(".loader-block").hide();
            }
        },
        async: false,

        data: {'publisherId': getvalue, 'collegeId': college_id, 'default_value': default_value, 'trafficChannel': tfc,'instanceType':'pri_register'},

        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            var responseObject = $.parseJSON(json);
            if(responseObject.status==1 && $(elem).parents('.block-repeat').find('.' + class_name).length > 0){
                if(typeof responseObject.data.sourceList === "object"){
                    var sourceList    = responseObject.data.sourceList;
                    var html = '';
                    $.each(sourceList, function (index, item) {
                        html +='<option value="'+index+'">'+item+'</option>';
//                        $("select[name='filter[campu|source_value][]']").append('<option value="'+index+'">'+item+'</option>');
                    });
                        if(appendFlag === 0){
                        appendFlag = 1;
                            $(elem).parents('.block-repeat').find('.' + class_name).html(html);                    
                        }else{
                            $(elem).parents('.block-repeat').find('.' + class_name).append(html);
                        }
                        var options = {};
                        $(elem).parents('.block-repeat').find('.' + class_name+' option').each(function () {
                            if (options[this.value]) {
                                $(this).remove();
                            } else {
                                options[this.value] = this.text;
                            }
                        });
                    if(typeof default_value !== 'undefined' && default_value !== ''){
                        $.each(JSON.parse(default_value), function(k, v){
                            $(elem).parents('.block-repeat').find('.' + class_name+' option[value="'+ v.toLowerCase() +'"]').prop('selected', true);
                        });
                    }
                    $(elem).parents('.block-repeat').find('.' + class_name+' option[value=""]').remove(); 
                    if($(elem).parents('.block-repeat').find('.' + class_name)[0].sumo){
                        $(elem).parents('.block-repeat').find('.' + class_name)[0].sumo.reload();
                    }
                }
            }else if(responseObject.status===0){
                $(elem).parents('.block-repeat').find('.' + class_name).html('');
            }else{
                if (responseObject.message === 'session') {
                    window.location.href = jsVars.FULL_URL;
                } else {
                   // console.log(responseObject.message);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

function getCampaignsMediumConfig(elem, getvalue, select_name_value, class_name) {
    if (typeof getvalue === "undefined" || getvalue == 0) {
        return false;
    }
    var default_value = '';
    if (typeof select_name_value === 'undefined') {
        select_name_value = [];
    }
    if (typeof class_name === 'undefined' || class_name === '') {
        class_name = 'campu\\|medium_value';
    }

    if (class_name === 'campu\\|medium_value') {
        default_value = select_name_value[$(elem).parents('.block-repeat').find('.' + class_name).attr('name')];
    } else {
        default_value = select_name_value[$(elem).parents('.block-repeat').find('.' + class_name).attr('name')];
    }
    var trafficChannelVal = 1;
    trafficChannelVal = $(elem).parents('.block-repeat').find('.traffic_channel').val();
    if(trafficChannelVal === 'undefined'){
        trafficChannelVal = $("select.traffic_channel").val();
    }
    var publisherVal = 1;
    publisherVal = $(elem).parents('.block-repeat').find('.publisher_filter').val();
    if(publisherVal === 'undefined'){
        publisherVal = $(".publisher_filter").val();
    }
    var college_id = $("#FilterLeadForm #user_college_id").val();
    $.ajax({
        url: '/campaign-manager/getSourceMediumName',
        type: 'post',
        dataType: 'html',
        beforeSend: function () {
            if($(".loader-block").length){
                $(".loader-block").show();
            }
        },
        complete: function () {
            if($(".loader-block").length){
                $(".loader-block").hide();
            }
        },
        async: false,

        data: {'source': getvalue, "collegeId": college_id, 'publisherId': publisherVal,trafficChannel:trafficChannelVal},

        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            var responseObject = $.parseJSON(json);
            if(responseObject.status==1 && $(elem).parents('.block-repeat').find('.' + class_name).length > 0){
                if(typeof responseObject.data.mediumList === "object"){
                    var mediumList    = responseObject.data.mediumList;
                    var html = '';
                    $.each(mediumList, function (index, item) {
                        html += '<option value="'+index+'">'+item+'</option>';
//                        $("select[name='filter[campu|medium_value][]']").append('<option value="'+index+'">'+item+'</option>');
                    });
                    if(appendFlag === 0){
                        appendFlag = 1;
                        $(elem).parents('.block-repeat').find('.' + class_name).html(html);
                    }else{
                        $(elem).parents('.block-repeat').find('.' + class_name).append(html);
                    }
                    if(typeof default_value !== 'undefined' && default_value != ''){
                        $.each(JSON.parse(default_value), function(k, v){
                            $(elem).parents('.block-repeat').find('.' + class_name+' option[value="'+ v +'"]').prop('selected', true);
                        });
                    }
                    $(elem).parents('.block-repeat').find('.' + class_name+' option[value=""]').remove(); 
                    if($(elem).parents('.block-repeat').find('.' + class_name)[0].sumo){
                        $(elem).parents('.block-repeat').find('.' + class_name)[0].sumo.reload();
                    }
                }
            }else if(responseObject.status==0){
                $(elem).parents('.block-repeat').find('.' + class_name).html('');
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    console.log(responseObject.message);
                }
            }
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

function getCampaignsNameConfig(elem, getvalue, select_name_value, class_name,parent_source) {
    
    if (typeof getvalue === "undefined" || getvalue === '') {
        return false;
    }
    var default_value, publisher_val;

    if (typeof select_name_value === 'undefined') {
        select_name_value = [];
    }
    if (typeof class_name === 'undefined' || class_name === '') {
        class_name = 'campu\\|name_value';
    }
    if (typeof parent_source === 'undefined') {
        parent_source = '';
    }
    if (class_name === 'campu\\|name_value') {
        default_value = select_name_value[$(elem).parents('.block-repeat').find('.' + class_name).attr('name')];
        publisher_val = $(elem).parents('.block-repeat').find(".campu\\|publisher_id.sel_value").val();
    } else {
        default_value = select_name_value[$(elem).parents('.block-repeat').find('.' + class_name).attr('name')];
        publisher_val = $(elem).parents('.block-repeat').find(".publisher_filter.sel_value").val();
    }
    var college_id = $("#FilterLeadForm #user_college_id").val();
    var trafficChannelVal = 1;
    trafficChannelVal = $(elem).parents('.block-repeat').find('.traffic_channel').val();
    if(trafficChannelVal === 'undefined'){
        trafficChannelVal = $("select.traffic_channel").val();
    }
    var publisherId = 1;
    publisherId = $(elem).parents('.block-repeat').find('.publisher_filter').val();
    if(publisherId === 'undefined'){
        publisherId = $(".publisher_filter").val();
    }
    $.ajax({
        url: '/campaign-manager/getSourceMediumName',
        type: 'post',
        dataType: 'html',
        beforeSend: function () {
            if($(".loader-block").length){
                $(".loader-block").show();
            }
        },
        complete: function () {
            if($(".loader-block").length){
                $(".loader-block").hide();
            }
        },
        async: false,

        data: {'medium': getvalue,'publisherId':publisherId,'trafficChannel':trafficChannelVal, 'collegeId': college_id, 'default_value': default_value,'parent_source':parent_source},
   
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            var responseObject = $.parseJSON(json);
            console.log(responseObject);
            if(responseObject.status==1 && $(elem).parents('.block-repeat').find('.' + class_name).length > 0 ){
                if(typeof responseObject.data.campaignNameList === "object"){
                    var campaignNameList    = responseObject.data.campaignNameList;
                    var html = '';
                    $.each(campaignNameList, function (index, item) {
                        html += '<option value="'+index+'">'+item+'</option>';
//                        $("select[name='filter[campu|name_value][]']").append('<option value="'+index+'">'+item+'</option>');
                    });
                     if(appendFlag === 0){
                        appendFlag = 1;
                        $(elem).parents('.block-repeat').find('.' + class_name).html(html);
                    }else{
                        $(elem).parents('.block-repeat').find('.' + class_name).append(html);
                    }

                    if(typeof default_value !== 'undefined' && default_value !== ''){
                        $.each(JSON.parse(default_value), function(k, v){
                            $(elem).parents('.block-repeat').find('.' + class_name+' option[value="'+ v +'"]').prop('selected', true);
                        });
                    }
                    $(elem).parents('.block-repeat').find('.' + class_name+' option[value=""]').remove(); 
                    if($(elem).parents('.block-repeat').find('.' + class_name)[0].sumo){
                        $(elem).parents('.block-repeat').find('.' + class_name)[0].sumo.reload();
                    }
                }
            } else if(responseObject.status===0){
                $(elem).parents('.block-repeat').find('.' + class_name).html('');
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    console.log(responseObject.message);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

function populatePublisherReferrers(currentElementObj, select_name_value, selectedChannel){
    if($(currentElementObj).parents('.block-repeat').find('.publisher_filter').length ){
        $(currentElementObj).parents('.block-repeat').find('.publisher_filter' ).html('');
        if($(currentElementObj).parents('.block-repeat').find('.publisher_filter' )[0].sumo){
            $(currentElementObj).parents('.block-repeat').find('.publisher_filter' )[0].sumo.reload();
        }
    }
    resetCampaignDependent();
    if(typeof selectedChannel !== 'undefined' && selectedChannel !== null){
        appendFlag = 0;
        $.each(selectedChannel, function(k,channelVal){
            if(k >= 1){
               appendFlag = 1;
            } 
            if (channelVal == '1' || channelVal=='2' || channelVal=='7' || channelVal == '8' || channelVal == '9') {//campaign option                      
                getPublisherListConfig(currentElementObj, select_name_value, 'publisher_filter',channelVal);
            } else if (channelVal == '5' || channelVal == '3' || channelVal == '4') {                
                getReferrerListConfig(currentElementObj, select_name_value, 'publisher_filter',channelVal);
            } else if(channelVal == '6'){
                getDirectListConfig(currentElementObj, select_name_value, 'publisher_filter',channelVal)
            } else if(channelVal == '9'){
                getOfflineListConfig(currentElementObj, select_name_value, 'publisher_filter');
            } else if(channelVal == '10'){
                getChatListConfig(currentElementObj, select_name_value, 'publisher_filter',channelVal)
            }
        });
        appendFlag = 0;
    }
}

function getOfflineListConfig(elem, select_name_value, class_name) {

    if (typeof select_name_value === 'undefined') {
        select_name_value = [];
    }
    if (typeof class_name === 'undefined' || class_name === '') {
        class_name = 'campu\\|publisher_id';
    }
    
    if($(elem).parents('.block-repeat').find('.' + class_name).length > 0){
        var options = "<option value='1' >Offline</option>";
        if(appendFlag == 0){
            $(elem).parents('.block-repeat').find('.' + class_name).html(options);
            appendFlag = 1;
        }else{
            $(elem).parents('.block-repeat').find('.' + class_name).append(options);
        }
    }

    if($(elem).parents('.block-repeat').find('.' + class_name)[0] && $(elem).parents('.block-repeat').find('.' + class_name)[0].sumo ){
       $(elem).parents('.block-repeat').find('.' + class_name)[0].sumo.reload();                    
    }
    
}

function getPublisherListConfig(elem, select_name_value, class_name, publisherId) {

    var college_id = $("#FilterLeadForm #user_college_id").val();

    if (typeof select_name_value === 'undefined') {
        select_name_value = [];
    }
    if(typeof publisherId === 'undefined'){
        publisherId = $(elem).val();
    }
    if (typeof class_name === 'undefined' || class_name === '') {
        class_name = 'campu\\|publisher_id';
    }
    
    if (college_id) {
        $.ajax({
            url: '/campaign-manager/get-publisher-list',
            type: 'post',
            data: {college_id: college_id, traffic_channel:publisherId, selected : 0,'instance_val':'pri_register'},
            dataType: 'html',
            beforeSend: function () {
                if($(".loader-block").length){
                    $(".loader-block").show();
                }
            },
            complete: function () {
                if($(".loader-block").length){
                    $(".loader-block").hide();
                }
            },
            async: false,
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json)
            {  
                var responseObject = $.parseJSON(json);
                if(responseObject.status==1){
                    if(typeof responseObject.data.sourceList === "object"){
                        var sourceList    = responseObject.data.sourceList;
                        html = '';
                        $.each(sourceList, function (index, item) {
                            html += '<option value="'+index+'">'+item+'</option>';
                            //$('#publisher_filter').append('<option value="'+index+'">'+item+'</option>');
                        });
                        //console.log(class_name);
                        var publisher_id = select_name_value[$(elem).parents('.block-repeat').find('.' + class_name).attr('name')];
                        //console.log($(elem).parents('.block-repeat').find('.' + class_name).length);
                        if($(elem).parents('.block-repeat').find('.' + class_name).length > 0){
                            if(appendFlag == 0){
                                $(elem).parents('.block-repeat').find('.' + class_name).html(html);
                                appendFlag = 1;
                            }else{
                                $(elem).parents('.block-repeat').find('.' + class_name).append(html);
                            }
                            //console.log($(elem).parents('.block-repeat').find('.' + class_name).html());
                            $(elem).parents('.block-repeat').find('.' + class_name+' option[value=""]').remove();              
                        }
                        //console.log(publisher_id);
                        if (typeof publisher_id !== 'undefined' && publisher_id !== null && publisher_id.length > 0 ) {
                            $(elem).parents('.block-repeat').find('.' + class_name).val($.parseJSON(publisher_id));
                        }

                        if($(elem).parents('.block-repeat').find('.' + class_name)[0] && $(elem).parents('.block-repeat').find('.' + class_name)[0].sumo ){
                           $(elem).parents('.block-repeat').find('.' + class_name)[0].sumo.reload();                    
                        }
                    }
                } else if(responseObject.status===0){
                    $(elem).parents('.block-repeat').find('.' + class_name).html('');
                } else {
                    if (responseObject.message === 'session') {
                        location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                    } else {
                        console.log(responseObject.message);
                        alertPopup(responseObject.message,'error');
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    } else{
        $(elem).parents('.block-repeat').find('.' + class_name).html('');
    }
    
    
}


function getReferrerListConfig(elem, select_name_value, class_name,tfc) 
{
    var college_id = $("#FilterLeadForm #user_college_id").val();
    if (typeof select_name_value === 'undefined') {
        select_name_value = [];
    }
    if(typeof tfc === 'undefined'){
        tfc = $(elem).val();
    }
    if (typeof class_name === 'undefined' || class_name === '') {
        class_name = 'campu\\|publisher_id';
    }
    $.ajax({
        url: '/campaign-manager/get-referrer-list',
        type: 'post',
        dataType: 'html',
        beforeSend: function () {
            if($(".loader-block").length){
                $(".loader-block").show();
            }
        },
        complete: function () {
            if($(".loader-block").length){
                $(".loader-block").hide();
            }
        },
        async: false,
        data: {'college_id': college_id, 'traffic_channel': tfc,'registration_instance':'pri_register'},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            var responseObject = $.parseJSON(json);
            if(responseObject.status==1){
                if(typeof responseObject.data.sourceList === "object"){
                    var sourceList    = responseObject.data.sourceList;
                    var html = '';
                    $.each(sourceList, function (index, item) {
                        html += '<option value="'+index+'">'+item+'</option>';
//                        $('#publisher_filter').append('<option value="'+index+'">'+item+'</option>');
                    });
                }
                var publisher_id = select_name_value[$(elem).parents('.block-repeat').find('.' + class_name).attr('name')];
                if(appendFlag == 0){
                    appendFlag = 1;
                    $(elem).parents('.block-repeat').find('.' + class_name).html(html);
                }else{
                    $(elem).parents('.block-repeat').find('.' + class_name).append(html);
                }
                $(elem).parents('.block-repeat').find('.' + class_name+' option[value=""]').remove();  
                if (typeof publisher_id !== 'undefined' && publisher_id !== null && publisher_id.length > 0) {
                    $(elem).parents('.block-repeat').find('.' + class_name).val($.parseJSON(publisher_id));
                }
                if($(elem).parents('.block-repeat').find('.' + class_name)[0] && $(elem).parents('.block-repeat').find('.' + class_name)[0].sumo){
                    $(elem).parents('.block-repeat').find('.' + class_name)[0].sumo.reload();
                }
            }else if(responseObject.status==0){
                $(elem).parents('.block-repeat').find('.' + class_name).html('<option value="">Publisher Name</option>');
            }else{
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    console.log(responseObject.message);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

function getDirectListConfig(elem, select_name_value, class_name,tfc){
    if (typeof select_name_value === 'undefined') {
        select_name_value = [];
    }
    if(typeof tfc === 'undefined'){
        tfc = $(elem).val();
    }
    if (typeof class_name === 'undefined' || class_name === '') {
        class_name = 'campu\\|publisher_id';
    }
    
    var html  = "<option value=''>Publisher/Referrer</option>";
        html  += "<option value='30' >Direct</option>";
    if (appendFlag == 0) {
        appendFlag = 1;
        $(elem).parents('.block-repeat').find('.' + class_name).html(html);
    } else {
        $(elem).parents('.block-repeat').find('.' + class_name).append(html);
    }    
    var publisher_id = select_name_value[$(elem).parents('.block-repeat').find('.' + class_name).attr('name')];

    $(elem).parents('.block-repeat').find('.' + class_name + ' option[value=""]').remove();
    if (typeof publisher_id !== 'undefined' && publisher_id !== null && publisher_id.length > 0) {
        $(elem).parents('.block-repeat').find('.' + class_name).val($.parseJSON(publisher_id));
    }
    if ($(elem).parents('.block-repeat').find('.' + class_name)[0] && $(elem).parents('.block-repeat').find('.' + class_name)[0].sumo) {
        $(elem).parents('.block-repeat').find('.' + class_name)[0].sumo.reload();
    }
}

function getChatListConfig(elem, select_name_value, class_name,tfc){
    if (typeof select_name_value === 'undefined') {
        select_name_value = [];
    }
    if(typeof tfc === 'undefined'){
        tfc = $(elem).val();
    }
    if (typeof class_name === 'undefined' || class_name === '') {
        class_name = 'campu\\|publisher_id';
    }
    
    var html  = "<option value=''>Publisher/Referrer</option>";
        html  += "<option value='151'>Chat</option>";
    if (appendFlag == 0) {
        appendFlag = 1;
        $(elem).parents('.block-repeat').find('.' + class_name).html(html);
    } else {
        $(elem).parents('.block-repeat').find('.' + class_name).append(html);
    }    
    var publisher_id = select_name_value[$(elem).parents('.block-repeat').find('.' + class_name).attr('name')];

    $(elem).parents('.block-repeat').find('.' + class_name + ' option[value=""]').remove();
    if (typeof publisher_id !== 'undefined' && publisher_id !== null && publisher_id.length > 0) {
        $(elem).parents('.block-repeat').find('.' + class_name).val($.parseJSON(publisher_id));
    }
    if ($(elem).parents('.block-repeat').find('.' + class_name)[0] && $(elem).parents('.block-repeat').find('.' + class_name)[0].sumo) {
        $(elem).parents('.block-repeat').find('.' + class_name)[0].sumo.reload();
    }
}

$(document).ready(function(){
	$('.advanceFilterModal, .advanceFilter .close, .btn-cancel').click(function(){
		$('.advanceFilterModal').toggleClass('active');
		$('#advanceFilter').toggleClass('active');
		$('body').toggleClass('filterOpen');
		filterHeight();
		$(window).resize(filterHeight);	
	});
	// Add the tour of AdvanceFilter
	tourLF();
})

function filterHeight(){
	if ($(window).width() > 767) {
		var winHeight = $(window).height();
		var filterBodyHeight = $(window).height() - 110;
		$('.advanceFilter .filter-body, .advanceFilter .aligner-middle').css('height', filterBodyHeight);
	}
}

function filterCloseOutSide(){
	$(document).on('click', function (event) {
		$('#advanceFilter, .advanceFilterModal').removeClass('active');
	});
	$('#advanceFilter, .advanceFilterModal').on('click', function (event) {
	  event.stopPropagation();
	});
}

function filterClose(){
	$('.advanceFilterModal, .advanceFilter').removeClass('active');
	$('body').removeClass('filterOpen');
}
function filterOpen(){
	$('.advanceFilterModal, .advanceFilter').addClass('active');
	$('body').addClass('filterOpen');
}

// Filter Hide once click on any dropdown
$('.dropdown').on('show.bs.dropdown', function(){
  filterClose();
})

// For Close Dropdown with custom link
$(".widget-header .close").click(function() {
    $('#savedFilterList').trigger('click');
});

if(jQuery('.logicBox').height() > 200){ 
	//alert('hello');
}
/*$.ajaxPrefilter(function( options, original_Options, jqXHR ) {
    options.async = true;
});*/

//call getChildtaxonomyValues() for registration dependent field
$(document).on('change', "select.ud\\|country_id.sel_value,select.ud\\|state_id.sel_value,\n\
                            select.ud\\|district_id.sel_value,select.ud\\|course_id.sel_value", function () {
    
    var childField = '';
    var findChildField = '';
    var childObjName = '';
    var childObjElemName = '';
    var label_name = '';
    var cur_val_name = $(this).attr('name');
    var curFieldName =  cur_val_name.replace('[values][]', '[fields]');
            
    if($(this).hasClass('ud|country_id')){
        childField = 'ud|state_id';
        findChildField = 'ud\\|state_id';
        var findChildCityField = 'ud\\|city_id';
        var cityChildObjName = $(this).parents('.block-repeat').find('.' + findChildCityField).attr('name');
        if(cityChildObjName !== undefined){
            $("[name='" + cityChildObjName + "']").html('');
            $("[name='" + cityChildObjName + "']")[0].sumo.reload();
        }
        
    }else if($(this).hasClass('ud|state_id')){
        var isDistrictEnable = $("[name='" + curFieldName + "']").find('option[data-input_id="district_id"]').length;
        if($(this).parents('div.block-repeat').find('.ud\\|district_id').length || isDistrictEnable !== 0){
            childField = 'ud|district_id';
            findChildField = 'ud\\|district_id';
        }else{
            childField = 'ud|city_id';
            findChildField = 'ud\\|city_id';
        }
    }else if($(this).hasClass('ud|district_id')){
        if($(this).parents('div.block-repeat').find('.ud\\|city_id').length){
            childField = 'ud|city_id';
            findChildField = 'ud\\|city_id';
        }
    }else if($(this).hasClass('ud|course_id')){
        childField = 'ud|specialization_id';
        findChildField = 'ud\\|specialization_id';
    }
    
    childObjName = $(this).parents('.block-repeat').find('.' + findChildField).attr('name');
    if(childObjName !== undefined){
        childObjElemName =  childObjName.replace('[values][]', '[fields]');
        label_name = $("[name='" + childObjElemName + "']").find(":selected").data('label_name');
        var checkDependentFieldVal = $(this).attr('checkDependentFieldVal');
        if(checkDependentFieldVal != 0){
            getChildtaxonomyValues(childField, childObjName, label_name , 'true');
        }
    }
    
});

//call getCampaignsMedium() medium_value by source_value 
$(document).on('change', "select.campap\\|conversion_source_value.sel_value", function () {
    
    if ($(this).val() === '') {//check publisher value
        return false;
    }
    var source_value_arr = $(this).val();
    var currentObj = $(this);
    if(source_value_arr !== null && source_value_arr !== ''){
        $.each(source_value_arr, function(k, source_value){
            if(typeof source_value !== 'undefined' && source_value !== ''){
                var source_name_ar = source_value.toString().split('___');
                source_value = source_name_ar[0];
            }
            var sel_mvalue = '';
            getCampaignsMediumConfig(currentObj, source_value, sel_mvalue, 'campap\\|conversion_medium_value');
            getCampaignsNameConfig(currentObj, source_value, sel_mvalue, 'campap\\|conversion_name_value');
        });
        appendFlag = 0; 
    }
});

//call getCampaignsName() name_value by medium_value 
$(document).on('change', "select.campap\\|conversion_medium_value.sel_value", function () {
    //getCampaignsName();
    $(this).parents('.block-repeat').find(".campap\\|conversion_name_value").html("<option value=''>Campaign Name</option>");
    
    if ($(this).val() === '') {//check publisher value
        return false;
    }
    var medium_values = $(this).val();
    
    if(medium_values.length > 0){
        $.each(medium_values, function(k, medium_value){
            var medium_name_ar = medium_value.split('___');
            medium_value = medium_name_ar[0];
            var sel_nvalue = '';
            getCampaignsNameConfig(this, medium_value, sel_nvalue, 'campap\\|conversion_name_value');
        });
    }
});

//call getCampaignsMedium() medium_value by source_value 
$(document).on('change', "select.campu\\|source_value.sel_value", function () {
    if ($(this).val() === '') {//check publisher value
        return false;
    }
    
    var source_val_arr = $(this).val();
    var currentObj = $(this);
    
    if(source_val_arr !== null && typeof source_val_arr !== 'undefined' && source_val_arr !== ''){
        $.each(source_val_arr, function(k, source_value){
            
            if(typeof source_value !== 'undefined' && source_value !== ''){
                var source_name_ar = source_value.toString().split('___');
                source_value = source_name_ar[0];
                var sel_mvalue = '';
                getCampaignsNameConfig(currentObj, source_value, sel_mvalue,'','source_value');
                getCampaignsMediumConfig(currentObj, source_value, sel_mvalue);
            }
        });
        appendFlag = 0;
    }
});

//call getCampaignsName() name_value by medium_value 
$(document).on('change', "select.campu\\|medium_value.sel_value", function () {
    //getCampaignsName();
    $(this).parents('.block-repeat').find(".campu\\|name_value").html("<option value=''>Campaign Name</option>");
    
    var medium_value_arr = $(this).val();
    var currentObj = $(this);
   
    if(medium_value_arr !== null && medium_value_arr !== ''){
       $.each(medium_value_arr, function(k, medium_value){
        if(typeof medium_value !== 'undefined' && medium_value!== ''){
            var medium_name_ar = medium_value.split('___');
            medium_value = medium_name_ar[0];
        }
        var sel_nvalue = '';
        getCampaignsNameConfig(currentObj, medium_value, sel_nvalue);
      });
      appendFlag = 0;
   }
    
});

//call publister list by traffic channel selected campain options
$(document).on('change', "select.traffic_channel.sel_value", function () {

    var selectedChannel = $(this).val();
    var currentElementObj = $(this);
    
    populatePublisherReferrers(currentElementObj, [], selectedChannel);
    
});

//call getCampaignsSource() by publisher id  and Campaion source values and medium ,Name withour values
$(document).on('change', "select.campu\\|publisher_id.sel_value,select.publisher_filter.sel_value", function () {
    //When Publisher value will change then reset all below div id value
    resetCampaignDependent();
    var sel_svalue = '';
    var pub_value = $(this).val(); 
    var currentObject = $(this);
    appendFlag = 0;
    var trafficChannel = $(this).parents('.block-repeat').find('.traffic_channel').val();
    if(trafficChannel === 'undefined'){
        trafficChannel = 1;
    }
    //var trafficChannel = $("select.traffic_channel").val();
    if(pub_value !== null){
        $.each(pub_value, function(k,pub_val_single){
            var pub_val_ar = pub_val_single.split('___');
            var pub_val = pub_val_ar[0];
            getCampaignsSourceConfig(currentObject, pub_val, sel_svalue,'',trafficChannel);
            getCampaignsSourceConfig(currentObject, pub_val, sel_svalue, 'campap\\|conversion_source_value',trafficChannel);

        });
    }
    appendFlag = 0; //reinitialize
});

$(document).on('change', "select.sel_value", function () {
    var ct = $(this).data('ct');
    var field = $(this).data('field');
    var objValueFieldName =  $(this).attr('name');
    var objElemFieldName =  objValueFieldName.replace('[values][]', '[fields]');
    var dependentField = $("[name='" + objElemFieldName + "']").find(":selected").data('dependentgroup');
    var objElemVal = $("[name='" + objElemFieldName + "']").val();
    var type  = '';
    var arr = objElemVal.split("||");
    if (arr.length > 2) {
        type = arr[1];
    }
    if(typeof field === 'undefined' || field === ''){
        return;
    }
    if(ct === 'application' && typeof dependentField !== 'undefined' && dependentField !== '' ){
    
        var field_data = {};
        var form_id = jQuery(this).parents('form').find('[name="form_id"]').val();
        var collegeId = jQuery(this).parents('form').find('[name="s_college_id"]').val();
         
        field_data[field]           = jQuery(this).val();
        field_data['current_field'] = field;
        field_data['form_id']       = form_id;
        field_data['collegeId']       = collegeId;
        field_data['find_value_type']= 'next';
        var standardDropdown    = false;
        if(field.substr(0,1)=="ud"){
            standardDropdown=true;
        }
        jQuery.ajax({
            url: '/users/get-check-dependent-field',
            type: 'post',
            dataType: 'json',
            async: false,
            data: field_data,
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            success: function (json) {
                if (json['redirect']) {
                    window.location.href = json['redirect'];
                } else if (json['error']) {
                    alertPopup(json['error'], 'error');
                } else if (typeof json['success'] !== 'undefined' && json['success'] === 200) {
                        var html = '';
                        if(Object.keys(json['option']).length){
                            for (var lkey in json['option']) {
                                if(standardDropdown){
                                    html += '<option value="' + lkey + '">' + json['option'][lkey] + '</option>';
                                }
                                else if(type === 'predefined_dropdown' || type === 'dropdown' || type === 'select'){
                                   html += '<option value="' + lkey +";;;"+json['option'][lkey]+ '">' + json['option'][lkey] + '</option>'; 
                                }else{
                                    html += '<option value="' + lkey + '">' + json['option'][lkey] + '</option>';
                                }
                            }
                        }
                        
                        var splitField = field.split('|');
                        var prefix = '';
                        if(typeof json['child_field'] !== 'undefined' && json['child_field'] != '') {
                            prefix = splitField[0];
                            //Reset All dropdown Option
                            if(typeof json['registrationDependentField'] !== 'undefined' && json['registrationDependentField'] !== '') {
                                resetRegistrationDependentOption(json['registrationDependentField'], json['child_field'], prefix,objValueFieldName);
                            }
                            
                            if(typeof splitField[0] !== 'undefined' && splitField.length>1 && $.inArray(splitField[0],['ud','clgreg']) > -1 ) {
                                
                                if(jQuery('.'+splitField[0]+'\\|'+splitField[1]).parents('.block-repeat').find('.'+splitField[0]+'\\|'+json['child_field']).length > 0) {
                                    if(type === 'predefined_dropdown' || type === 'dropdown'){
                                        var label_name = jQuery('.'+splitField[0]+'\\|'+splitField[1]).parents('.block-repeat').find('.'+splitField[0]+'\\|'+json['child_field']).parents('.condition_div').find(".sel_field").find(':selected').data('label_name');
                                        if(splitField[0] != 'clgreg'){
                                            html = '<option value="0">' + label_name+jsVars.notAvailableText+' </option>'+html;
                                        }
                                    }

                                if(jQuery('[name="'+objValueFieldName+'"]').closest('.block-repeat').find('.'+splitField[0]+'\\|'+json['child_field']).length>0){
                                    jQuery('[name="'+objValueFieldName+'"]').closest('.block-repeat').find('.'+splitField[0]+'\\|'+json['child_field']).html(html);
                                    jQuery('[name="'+objValueFieldName+'"]').closest('.block-repeat').find('.'+splitField[0]+'\\|'+json['child_field'])[0].sumo.reload();
                                }
                                }
                            } else if(typeof json['child_field'] !== 'undefined' && jQuery('.'+field).parents('.block-repeat').find('.'+json['child_field']).length > 0){
                                var childfield = json['child_field'];
                                jQuery('.'+field).parents('.block-repeat').find('.'+childfield).html(html);
                                jQuery('.'+field).parents('.block-repeat').find('.'+childfield)[0].sumo.reload();
                            }
                        }                       
                        

                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
});

function resetCampaignDependent(){
    if($(this).parents('.block-repeat').find(".campu\\|source_value").length > 0 ){
        $(this).parents('.block-repeat').find(".campu\\|source_value").html("");
        $(this).parents('.block-repeat').find(".campu\\|source_value")[0].sumo.reload();
    
    }
    if($(this).parents('.block-repeat').find(".campu\\|medium_value").length > 0){
        $(this).parents('.block-repeat').find(".campu\\|medium_value").html("");
        $(this).parents('.block-repeat').find(".campu\\|medium_value")[0].sumo.reload();
    }
    
    if($(this).parents('.block-repeat').find(".campu\\|name_value").length > 0){
        $(this).parents('.block-repeat').find(".campu\\|name_value").html("");
        $(this).parents('.block-repeat').find(".campu\\|name_value")[0].sumo.reload();
    }
    if($(this).parents('.block-repeat').find(".campap\\|conversion_source_value").length > 0 ){
        $(this).parents('.block-repeat').find(".campap\\|conversion_source_value").html("");
        $(this).parents('.block-repeat').find(".campap\\|conversion_source_value")[0].sumo.reload();
    
    }
    if($(this).parents('.block-repeat').find(".campap\\|conversion_medium_value").length > 0){
        $(this).parents('.block-repeat').find(".campap\\|conversion_medium_value").html("");
        $(this).parents('.block-repeat').find(".campap\\|conversion_medium_value")[0].sumo.reload();
    }
    
    if($(this).parents('.block-repeat').find(".campap\\|conversion_name_value").length > 0){
        $(this).parents('.block-repeat').find(".campap\\|conversion_name_value").html("");
        $(this).parents('.block-repeat').find(".campap\\|conversion_name_value")[0].sumo.reload();
    }
}

function UpdateCreatedBySelect(CreatedByList,CreatedByIdSelected)
{
    if(!CreatedByIdSelected)
    {
        var OptionHtml = '<option selected="selected" value="">Created By</option>';
    }
    else
    {
        var OptionHtml = '<option value="">Created By</option>';
    }
    if(CreatedByList)
    {
        for(var i in CreatedByList)
        {
            if(CreatedByIdSelected && (i == CreatedByIdSelected))
            {
                OptionHtml += '<option selected="selected" value="'+ i +'">'+ CreatedByList[i] +'</option>';
            }
            else
            {
                OptionHtml += '<option value="'+ i +'">'+ CreatedByList[i] +'</option>';
            }
        }
    }
    $('#FilterLeadForm #CreatedBySelect').html(OptionHtml);
    $("#CreatedBySelect").trigger("chosen:updated");
    $('#FilterLeadForm .CreatedBySelect').html(OptionHtml);
    $('#FilterLeadForm .CreatedBySelect option[value=""]').remove(); 
    if($(".CreatedBySelect")[0] && $(".CreatedBySelect")[0].sumo){
        $(".CreatedBySelect")[0].sumo.reload();
    }
    
}

/*** Show & Hide Loader ***/
function showFilterLoader() {
    $("#filterLoader").show();
}
function hideFilterLoader() {
    $("#filterLoader").hide();
} 

function tourLF(){
	var tourLeadFilter = new Tour({
        steps: [
            {
                element: ".expended-search-link",
                title: "Search <sup class='text-danger'>New</sup>",
                content: "Search by Registered Email ID, Mobile No. or Name",
                template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><button class='btn btn-xs btn-npf btn-end' data-role='end'>Close</button><button class='btn btn-xs btn-npf btn-next pull-right' data-role='next'>Next</button></nav></div>",
                placement: "left", 
            },
            {
                element: ".filter_btn",
                title: "Advance Filter <sup class='text-danger'>New</sup>",
                content: "Search leads that satisfy one or multiple conditions.",
                template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><button class='btn btn-xs btn-npf btn-prev' data-role='prev'>Prev</button><button class='btn btn-xs btn-npf btn-next pull-right' data-role='next'>Next</button></nav></div>",
                placement: "left", 
            },

            {
                element: ".import_module",
                title: "Import <sup class='text-danger'>New</sup>",
                content: "Add a single lead or upload leads in bulk.",
                template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><button class='btn btn-xs btn-npf btn-prev' data-role='prev'>Prev</button><button class='btn btn-xs btn-npf btn-next pull-right' data-role='next'>Next</button></nav></div>",
                placement: "left", 
            },
            {
                element: ".circlebtn",
                title: "Save Smart View<sup class='text-danger'>New</sup>",
                content: "Create quick view with a blend of advanced filter, columns and sorting",
                template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><button class='btn btn-xs btn-npf btn-prev' data-role='prev'>Prev</button><button class='btn btn-xs btn-npf btn-next pull-right' data-role='next'>Next</button></nav></div>",
                placement: "right", 
            },
            {
                element: ".addremoveColumn",
                title: "Customize Column<sup class='text-danger'>New</sup>",
                content: "View relevant details by adding, removing or sorting columns.",
                template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><button class='btn btn-xs btn-npf btn-prev' data-role='prev'>Prev</button><button class='btn btn-xs btn-npf btn-end pull-right' data-role='end'>Close</button></nav></div>",
                placement: "left", 
            }
          ],
		name : 'leadManager1',	
		backdrop: true,
	}); 

    	// Initialize the tour
	tourLeadFilter.init();
	// Start the tour
	tourLeadFilter.start();
}

 
// this will bind all sorting icon.
$(document).on('click','span.sorting_span i', function (){
    jQuery("span.sorting_span i").removeClass('active');
    var field = jQuery(this).data('column');
    var data_sorting = jQuery(this).data('sorting');
    $('#sort_options').val(field+"|"+data_sorting);
    jQuery(this).addClass('active');
    LoadMoreLeadsUser('reset','sorting');
});

function setDroupClass(){
	$('.condition_div').each(function(i,val){
		$(this).removeClass('dropup');
		var x = $(this).offset();
		if(x.top > 430){
			$(this).addClass('dropup');
		}
		if(x.top > 320){
			$(this).addClass('dropup-date');
		}
	})
}

function checkConditionalFormFilter(){
    var flag = 0;
    var errorMsg = "Please select 'Form Stage' and 'Form Stage Status'";
    var formMaxStageVal = 0;
    $('.block-repeat').each(function(i,val){
        if(i === 0){
            var formStageStatus = '';
            var formMaxStage = '';
            var andCondition = $("[name='application_advance_filter[0][condition]']:checked").val();
            $('.condition_div').each(function(i,val){
                var fieldName = $(this).find('.sel_field').val();
                if(fieldName.indexOf("fsd|step_status||") !== -1 && (formStageStatus === '' || formStageStatus === '1')){
                    var fieldType = $(this).find('.sel_type').val();
                    var fieldValue = $(this).find('.sel_value').val();
                    if(fieldType === 'eq' && fieldValue == '1' && fieldValue.length === 1){
                        formStageStatus = '1';
                    }else{
                        errorMsg = "'Form Stage Status' must be Completed.";
                        formStageStatus = '0';
                    }
                }
                if(fieldName.indexOf("fd|max_stage||") !== -1 && (formMaxStage === '' || formMaxStage === '1')){
                    var fieldType = $(this).find('.sel_type').val();
                    var fieldValue = $(this).find('.sel_value').val();
                    if(fieldType === 'eq' && fieldValue.length === 1){
                        formMaxStage = '1';
                        formMaxStageVal = parseInt(fieldValue);
                    }else{
                        formMaxStage = '0';
                        errorMsg = "Please select single 'Form Stage' ";
                    }
                }
            });
            if(andCondition === 'and' && formStageStatus === '1' && formMaxStage === '1'){
                flag = 1;
            }
        }else{
            flag = 0;
        }
    });
    return (flag === 0 ? "Error::"+errorMsg : "Form Stage::"+formMaxStageVal);
}

/**
 * method to get selcted counsellor id from filter
 * @returns {Number}
 */
function getSelectedCounsellorId(){
    var flag = 0;
    var counsellorId = 0;
    var multipleCounsellorId = 0;
    var multiSelectCounsellor = false;
    $('.block-repeat').each(function(i,val){
        if(i === 0){
            //console.log("i"+i)
            var singleCounsellorSelected = '';
            
            var andCondition = $("[name='application_advance_filter[0][condition]']:checked").val();
            $('.condition_div').each(function(i,val){
                var fieldName = $(this).find('.sel_field').val();
                if(fieldName.indexOf("councellor_id||") !== -1 && (singleCounsellorSelected === '' || singleCounsellorSelected === '1')){
                    var fieldType = $(this).find('.sel_type').val();
                    var fieldValue = $(this).find('.sel_value').val();
                    if(fieldType === 'eq' && fieldValue !=null && fieldValue.length ===  1 && singleCounsellorSelected === ''){
                        singleCounsellorSelected = '1';
                            counsellorId = fieldValue[0];
                        }else{
                        singleCounsellorSelected = '0';
                        if(fieldType === 'eq' && fieldValue !=null && fieldValue.length > 1){
                            multipleCounsellorId = fieldValue;
                            multiSelectCounsellor  = true;
                            }
                        }
                    }
            });
            if(andCondition === 'and' && singleCounsellorSelected === '1'){
                flag = 1;
            }else{
                counsellorId = 0;
            }
        }else{
            flag = 0;
            counsellorId = 0;
        }
    });
    if(multiSelectCounsellor){
      counsellorId = multipleCounsellorId;
    }
    return counsellorId;
}

function datePickerChangeTrigger(){
    $('.daterangepicker_report_right, .daterangepicker_report_right_dynamic, .daterangepicker_report_center, .daterangepicker_report').on('apply.daterangepicker',function(){
        is_filter_button_pressed = 0;
    });
}

function resetRegistrationDependentOption(dependentDropdownFieldList, currentField, prefix,objValueFieldName) {
    /**************** For Registration Related Dependent Dropdown Code Start Here *********************/
    
    //Blank All dropdown Value of Dependent Field
    var getLastValue = 0;
    if(typeof dependentDropdownFieldList !== 'undefined' && dependentDropdownFieldList != '') {
        $(dependentDropdownFieldList).each(function(key,fieldId){

            //if getLastValue > 0 then return from here. Dont execute Below code 
            if(getLastValue >0) {
                return false;
            }
            var isFieldFound = 0;
            $.each(fieldId, function(childKey,childFieldId){
                
                if(childFieldId == 'CourseId' && $("#"+childFieldId).length == 0){
                    childFieldId = 'ud\\|course_id';
                }


                //if field match then increase the counter and store the increament value into getLastValue variable
                if(childFieldId == currentField) {
                    isFieldFound++;
                    getLastValue = isFieldFound;
                }   
                if(isFieldFound > 0) {
                    
                    if(prefix !== '' && jQuery('[name="'+objValueFieldName+'"]').closest('.block-repeat').find('.'+prefix+'\\|'+childFieldId).length > 0) {
                                                
                        var labelname = $("#"+childFieldId).data('label');
                        var defaultOption =''; //<option value="">'+labelname+'</option>';                        
                        
                        //For <Label> Not Available
                        if($.inArray(childFieldId,[prefix+'\\|course_id','CourseId']) >= 0 ){
                            defaultOption += '<option value="0">' + labelname + jsVars.notAvailableText +' </option>';
                        }
                        jQuery('[name="'+objValueFieldName+'"]').closest('.block-repeat').find('.'+prefix+'\\|'+childFieldId).html(defaultOption);
                        jQuery('[name="'+objValueFieldName+'"]').closest('.block-repeat').find('.'+prefix+'\\|'+childFieldId)[0].sumo.reload();
                    }
                }
            });
        });
    }
}

//call publister list by traffic channel selected campain options
$(document).on('change', ".lead_stage.sel_value", function () {

    var selectedStage = $(this).val();
    var currentElementObj = $(this);
    if($(".sel_value.ud\\|lead_sub_stage").length > 0){
        getSubstage(selectedStage,currentElementObj,[]);
    }
    //populatePublisherReferrers(currentElementObj, [], selectedChannel);
    
});


function getSubstage(stage, currentElementobj,select_name_value) {
    class_name = 'ud\\|lead_sub_stage';
    var collegeId = $("#FilterLeadForm #user_college_id").val();
    if(stage==0 && stage.constructor != Array){
        $(currentElementobj).parents('.block-repeat').find('.' + class_name+' option').remove(); 
        //$(currentElementobj).parents('.block-repeat').find('.' + class_name)[0].sumo.reload();  
        return;
    }
    $.ajax({
        url: jsVars.getLeadSubStagesLink,
        type: 'post',
        data: {'collegeId': collegeId, 'stageId': stage,'type':'LM'},
        dataType: 'json',
        async: false,
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            showLoader();
            if(Object.keys(select_name_value).length === 0){
                this.async = true;
            }else{
               this.async = false; 
            }
        },
        complete: function () {
            hideLoader();
            if(Object.keys(select_name_value).length === 0){
                this.async = false;
            }
        },   
        success: function (json) {
            if (json['redirect']) {
                location = json['redirect'];
            } else if (json['error']) {
               // alert(json['error']);
            } else  if (json['success'] === 200) {
                    html = '';
                    for(var subStageId in json['subStageList']) {   
                        html += '<option value="'+subStageId+'">'+json['subStageList'][subStageId]+'</option>';
                    }
                    //console.log(class_name);
                    if($(currentElementobj).parents('.block-repeat').find('.' + class_name).length > 0){
                        $(currentElementobj).parents('.block-repeat').find('.' + class_name).html(html);
                    }
                    var substage_id = select_name_value[$(currentElementobj).parents('.block-repeat').find('.' + class_name).attr('name')];
     
                    if (typeof substage_id !== 'undefined' && substage_id !== null && substage_id.length > 0 ) {
                        substage_id =$.parseJSON(substage_id);
                        //console.log(substage_id);
                        $(currentElementobj).parents('.block-repeat').find('.' + class_name).val(substage_id);
                    }
                    
                     //$(currentElementobj).parents('.block-repeat').find('.' + class_name).val(substage_id[0]);

     
                    if($(currentElementobj).parents('.block-repeat').find('.' + class_name)[0] && $(currentElementobj).parents('.block-repeat').find('.' + class_name)[0].sumo ){
                        $(currentElementobj).parents('.block-repeat').find('.' + class_name)[0].sumo.reload();                    
                    }
                    return;
                   
                    
                }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
