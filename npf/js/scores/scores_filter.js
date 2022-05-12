
function buildScoringAutomationCreateInput(currentObj, i, innerBlockCounter, selectedValue, typeselected){
    if (typeof typeselected === 'undefined') {
        typeselected = '';
    }
    $(currentObj).parent().parent().find('.lead_error').html('');
    $(currentObj).parent().parent().find('.dependent_info').html('');
    
    var cur_elem_name = $(currentObj).attr('name');
    var labelname = $(currentObj).find(':selected').data('label_name');
    var label_name = $(currentObj).find(':selected').data('label_name');
    var dependentField = $(currentObj).find(':selected').data('dependentgroup');
    var parentFieldId = $(currentObj).find(':selected').data('parent');
    var element = $(currentObj).find('option:selected');
    var childFieldId = element.attr("data-child");
    var cur_val_name = cur_elem_name.replace('[ifField]', '[value][]');
    var cur_type_name = cur_elem_name.replace('[ifField]', '[expression]');
    var InputId = 'var InputId' //$(currentObj).attr('id');
    var key_source = $(currentObj).data('key_source');
    var value_field = element.attr("data-value");
    
    if(typeof value_field === 'undefined') {
        return false;
    }
    if(typeof labelname === 'undefined') {
        labelname = 'Select an Option';
    }
    
    var arr = value_field.split("||");
    var html = '';
    var type = "";
    var class_date = '';
    var checkDependentFieldVal = 1;
    if(arr[2] !== '[]'){
        checkDependentFieldVal = 0;
    }
    var field_name = 'select_value['+i+']['+innerBlockCounter+']';
    var selValue = '';
    if(typeof selectedValue !== 'undefined') {
        selValue = selectedValue;
        var newSelectVal = selectedValue.split(';;;')[1];
        if(typeof newSelectVal !== 'undefined') {
            newSelectVal = '["'+newSelectVal;
            selValue = newSelectVal;
        }
    }
    
    if(typeof parentFieldId !== 'undefined' && parentFieldId !== '' ){
        //for fixed dependent fields
        var tmp = $(currentObj).find('option[data-input_id="'+parentFieldId+'"]').text();
        if((typeof tmp ==='undefined' || tmp === '' ) && parentFieldId === 'district_id'){
            tmp = $(currentObj).find('option[data-input_id="state_id"]').text();
        }
        if(typeof tmp !=='undefined' && tmp !== ''){
            if(checkDependentFieldVal === 1){
                $(currentObj).parent().parent().find('.dependent_info').html('This field is dependent on '+tmp);
            }
        }
    }else if(typeof dependentField !== 'undefined' && dependentField !== '' ){
        //form fields dependent 
        var curInputId = $(currentObj).find(':selected').data('input_id');
        var tmp = $(currentObj).find('option[data-child="'+curInputId+'"]').text();
        if(typeof tmp !=='undefined' && tmp !== ''){
            if(checkDependentFieldVal === 1){
                setTimeout(function() {
                    $(currentObj).parent().parent().find('.dependent_info').html('This field is dependent on '+tmp);
                  }, 5);
               
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
        } else if (arr[0].match(/UD\|city_id/i)) {
            html_field_id = 'registerCityID';
        } else {
            html_field_id = arr[0];
        }
        if(type === "select"){
            type = "dropdown";
        }
        
        if(html_field_id === 'upf|order_no'){
            $(currentObj).parent().parent().find('.dependent_info').html('This field is dependent on applicant school preference');
        }
        if (type === "dropdown" || type === "predefined_dropdown") {
            if ('UD|state_id' == html_field_id) {
                html = "<select data-key_source=" + InputId + " onchange = 'return GetChildByMachineKey(this.value,\"registerCityID\",\"City\");' class='chosen-select sel_value' name='" + field_name + "' id='" + html_field_id + "'>";
            } else if ('s_lead_status' == html_field_id) {
                html = "<select data-key_source=" + InputId + " multiple='multiple' class='form-control sel_value' name='" + field_name + "' id='" + html_field_id + "' data-placeholder='Select lead status' placeholder='Select lead status'>";
                sls = true;
            }   else if('application_stage' === html_field_id) {
                var closestDiv = $(currentObj).closest('.block-repeat');
                if($(".sel_value.application_sub_stage",closestDiv).length > 0){
                    html = "<select  placeholder='Select an Option' class='sumo_select sel_value " + html_field_id + "' name='" + cur_val_name + "' data-field='"+html_field_id+"' data-ct='score'>";
                }else{
                    html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select sel_value " + html_field_id + "' name='" + cur_val_name + "' data-field='"+html_field_id+"' checkDependentFieldVal='"+checkDependentFieldVal+"' data-ct='score'>";
                }
            }else if(html_field_id === 'upf|order_no'){
                html = "<select  placeholder='Select an Option' 'display_selected_options'=false class='chosen-select sel_value " + html_field_id + "' name='" + cur_val_name + "' data-field='"+html_field_id+"' data-ct='score'>";
                html += '<option value="">Select Order</option>';
            } else {
                html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select sel_value " + html_field_id + "' name='" + cur_val_name + "' data-field='"+html_field_id+"' checkDependentFieldVal='"+checkDependentFieldVal+"' data-ct='score'>";
            }
            
            if(html_field_id == 'application_sub_stage'){
                var currentDiv  = $(currentObj).closest('.logic_block_div');
                if($(".sel_value."+parentFieldId,currentDiv).length > 0 && $("select.sel_value."+parentFieldId,currentDiv).prop("multiple")){
                }
                var selected = $(".sel_value."+parentFieldId,currentDiv).find('option:selected', this);
                var selectedStage = [];
                selected.each(function() {
                    selectedStage.push($(this).data('value'));
                });
                if(selectedStage){
                  getSubstage(selectedStage,$(".sel_value."+parentFieldId,currentDiv),[],selValue);
                }
            }

//            if ('s_lead_status' != html_field_id && 'show_campaigns_in' != html_field_id) {
//                html += '<option value="">' + labelname + '</option>';
//            }

            obj_json = JSON.parse(val_json);
            for (var key in obj_json) {
//                if(type == "predefined_dropdown") {
                    var prfixDropdownKey1 = key + ';;;' + obj_json[key];
                    var prfixDropdownKey = obj_json[key] ;
//                } else {
//                    var prfixDropdownKey = key;
//                }
                var prfixDropdownVal = obj_json[key];
                
                var selected = '';
                if(selValue == prfixDropdownKey) {
                    selected = 'selected=selected';
                }
                
                if(html_field_id === 'application_stage'){
                    html += "<option value=\"" + key + "\" data-value=\"" + key + "\" " +selected+" >" + prfixDropdownVal + "</option>";
                }else{
                    html += "<option value=\"" + prfixDropdownKey + "\" " +selected+" data-value=\"" +prfixDropdownKey1+ "\" >" + prfixDropdownVal + "</option>";
                }
            }
            html += "</select>";
            if(type === 'predefined_dropdown'){
                updateOperatorScore('predefined_dropdown', cur_type_name, typeselected);
            }else{
                updateOperatorScore('dropdown', cur_type_name, typeselected);
            }
        } else if (type == "date") { 
            if (jQuery("[name='" + cur_type_name + "']").val() === 'between') {
                class_date = "date_time_rangepicker_report";
            } else {
                class_date = "datetimepicker_report";
            }

            html = "<input type='text' class='form-control sel_value " + class_date + "' name='" + cur_val_name + "' value='' readonly='readonly' placeholder='" + labelname + "' data-id='" + html_field_id + "' data-field='"+html_field_id+"'>";
            updateOperatorScore('date', cur_type_name, typeselected);

        } else {
            html = "<input type='text' class='form-control sel_value' name='" + cur_val_name + "' value='' placeholder=' Enter Value' data-id='" + html_field_id + "' data-field='"+html_field_id+"'>";
            if(type === "number_range"){
                updateOperatorScore('number_range', cur_type_name, typeselected);
            }else{
                updateOperatorScore('text', cur_type_name, typeselected);
            }
        }
    } else {
        html = "<input type='text' class='form-control sel_value' name='" + cur_val_name + "' value='" + selValue + "' placeholder='Enter Value' data-field='"+html_field_id+"'>";
        updateOperatorScore('text', cur_type_name, typeselected);
        if(type === "number_range"){
            updateOperatorScore('number_range', cur_type_name, typeselected);
        }else{
            updateOperatorScore('text', cur_type_name, typeselected);
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
        
        if ($("[name='" + cur_val_name + "']").parents('.selectValueDivClass').length > 0) {
            $("[name='" + cur_val_name + "']").parents('.selectValueDivClass').html(finalhtml);  
        }
    }
    
     // hide value div if change is made
    $("[name='" + cur_val_name + "']").parents('.selectValueDivClass>div').hide();
    
    if(checkDependentFieldVal === 1){
        //get All Registration Dependent Child Values
        getChildtaxonomyValuesScore(html_field_id, cur_val_name, label_name);
    }
    
    if ((type === "dropdown" || type === "predefined_dropdown") && selValue !== '') {
         $("[name='" + cur_val_name + "']").val(JSON.parse(selValue));
    }else if(selValue !== ''){
        selected = JSON.parse(selValue);
        if (typeof selected != 'object') {
            selected = [selected];
        }
        $.each(selected, function (i, e) {
            //("[name='" + cur_val_name + "']")[0].sumo.selectItem(e);
            $("[name='" + cur_val_name + "']").val(e);
        });
        
    }
    
    $('.chosen-select').chosen();
    $('.chosen-select').trigger('chosen:updated');
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});

   
    if(selValue === ''){
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
        LoadDateTimeRangepicker();
    }
    
    //&& dependentField.indexOf('fixed_') !== 0  //commented fixed
    if(typeof dependentField !== 'undefined' && dependentField !== ''){
        checkDependentFieldScore(html_field_id,currentObj,type,selValue);
    }

    $('select.sumo_select').SumoSelect({placeholder: labelname, search: true, searchText:labelname, captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
}

/**
 * 
 * @param {type} type
 * @param {type} container_name
 * @param {type} selected
 * @returns {undefined}
 */

function updateOperatorScore(type, container_name, selected) {

    if (typeof selected === 'undefined') {
        selected = '';
    }
    var curFieldName = container_name.replace('[expression]', '[ifField]');
    var selectedField = jQuery("[name='" + curFieldName + "']").val();
    var html = '<option value="">Select Condition</option>';
    var operator = {
        'dropdown': {
            'is_equal_to': 'Is Equal To',
            'is_not_equal_to': 'Is Not Equal To',
            'is_not_empty': 'Is Not Empty',
            'is_empty': 'Is Empty',
            'less_than': 'Less Than (<)',
            'less_than_equal': 'Less Than & Equal To (<=)',
            'greater_than': 'Greater Than (>)',
            'greater_than_equal': 'Greater Than & Equal To (>=)',
            'multi_contains': 'Contains',
            'not_multi_contains': 'Does Not Contains',
        },
        'predefined_dropdown': {
            'is_equal_to': 'Is Equal To',
            'is_not_equal_to': 'Is Not Equal To',
            'is_not_empty': 'Is Not Empty',
            'is_empty': 'Is Empty',
            'less_than': 'Less Than (<)',
            'less_than_equal': 'Less Than & Equal To (<=)',
            'greater_than': 'Greater Than (>)',
            'greater_than_equal': 'Greater Than & Equal To (>=)',
            'multi_contains': 'Contains',
            'not_multi_contains': 'Does Not Contains',
        },
        'text': {
            'is_equal_to': 'Is Equal To',
            'is_not_equal_to': 'Is Not Equal To',
            'is_not_empty': 'Is Not Empty',
            'is_empty': 'Is Empty',
            'less_than': 'Less Than (<)',
            'less_than_equal': 'Less Than & Equal To (<=)',
            'greater_than': 'Greater Than (>)',
            'greater_than_equal': 'Greater Than & Equal To (>=)'
        },
        'number_range': {
            'is_equal_to': 'Is Equal To',
            'is_not_equal_to': 'Is Not Equal To',
            'is_not_empty': 'Is Not Empty',
            'is_empty': 'Is Empty',
            'less_than': 'Less Than (<)',
            'less_than_equal': 'Less Than & Equal To (<=)',
            'greater_than': 'Greater Than (>)',
            'greater_than_equal': 'Greater Than & Equal To (>=)'
        },
        'date': {
            'between': 'Between',
            'before': 'Before',
            'after': 'After',
            'not_empty': 'Is not empty',
            'empty': 'Is empty'
        }
    };
    if (typeof type !== 'undefined' && ['dropdown', 'text', 'number_range','date','predefined_dropdown'].indexOf(type) > -1) {        
        for (var lkey in operator[type]) {
            html += '<option value="' + lkey + '">' + operator[type][lkey] + '</option>';
        }
    }
    jQuery("[name='" + container_name + "']").html(html);
    jQuery("[name='" + container_name + "']").val(selected);
    jQuery('.chosen-select').chosen();
}

function checkDependentFieldScore(field, currentObj, type, selected){
    if(typeof field === 'undefined' || field=== ''){
        return false;
    }
    
    if(typeof selected === 'undefined'){
        selected = '';
    }
    var field_data = {};
    jQuery(currentObj).parents('.logic_block_div').find('select.sel_value').each(function(){
        var prev_field = jQuery(this).data('field');
        //var value = jQuery(this).data('value');
        var selected = $(this).find('option:selected', this);
        var selectedData = [];
        selected.each(function() {
            selectedData.push($(this).data('value'));
        });
        field_data[prev_field]  = selectedData;
    });
    
    var form_id = $("#formId").val();
    var collegeId = $("#collegeId").val();
    
    field_data['current_field'] = field;
    field_data['form_id']       = form_id;
    field_data['collegeId']       = collegeId;
    jQuery.ajax({
        url: jsVars.FULL_URL+'/users/get-check-dependent-field',
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
                    for (var lkey in json['option']) {
                        selectedOption="";
                        if(selected.indexOf(json['option'][lkey])!== -1){
                            selectedOption=" selected ";
                        }
//                        if(type === 'predefined_dropdown' || type === 'dropdown'){
//                           html += '<option value="' + lkey + ";;;"+json['option'][lkey]+'"'+selectedOption+'>' + json['option'][lkey] + '</option>';
//                        }else{
//                            html += '<option value="' + lkey + '"'+selectedOption+'>' + json['option'][lkey] + '</option>';
//                        }
                        html += '<option value="' + json['option'][lkey] + '" data-value="' + lkey + ";;;"+json['option'][lkey]+'" '+selectedOption+'>' + json['option'][lkey] + '</option>';
                    }
                    
                    if(jQuery(currentObj).parents('.logic_block_div').find('.' + field).length > 0){
                        jQuery(currentObj).parents('.logic_block_div').find('.' + field).html(html);
                    }
                }
            }
        
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$(document).on('change', "select.sel_value", function () {
    var ct = $(this).data('ct');
    var field = $(this).data('field');
    var objValueFieldName =  $(this).attr('name');
    var objElemFieldName =  objValueFieldName.replace('[value][]', '[ifField]');
    var dependentField = $("[name='" + objElemFieldName + "']").find(":selected").data('dependentgroup');
    var objElemVal = $("[name='" + objElemFieldName + "']").find(":selected").data('value');
    var type  = '';
    var arr = objElemVal.split("||");
    if (arr.length > 2) {
        type = arr[1];
    }
    if(typeof field === 'undefined' || field === ''){
        return;
    }
    if(typeof dependentField !== 'undefined' && dependentField !== '' ){
    
        var field_data = {};
        var form_id = $("#formId").val();
        var collegeId = $("#collegeId").val();
        var selected = $(this).find('option:selected', this);
        var selectedData = [];
        selected.each(function() {
            selectedData.push($(this).data('value'));
        });
        field_data[field]           = selectedData;
        field_data['current_field'] = field;
        field_data['form_id']       = form_id;
        field_data['collegeId']       = collegeId;
        field_data['find_value_type']= 'next';

        jQuery.ajax({
            url: jsVars.FULL_URL+'/users/get-check-dependent-field',
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
//                            if(type === 'predefined_dropdown' || type === 'dropdown'){
//                                html += '<option value="' + lkey +";;;"+json['option'][lkey]+ '">' + json['option'][lkey] + '</option>'; 
//                            }else{
//                                html += '<option value="' + lkey + '">' + json['option'][lkey] + '</option>';
//                            }
                            html += '<option value="' + json['option'][lkey] + '" data-value="' + lkey +";;;"+json['option'][lkey]+ '">' + json['option'][lkey] + '</option>';
                        }
                    }
                    if(typeof json['child_field'] !== 'undefined' && json['child_field'] != '') {
                       if(jQuery('.'+field).parents('.logic_block_div').find('.'+json['child_field']).length > 0){
                            var childfield = json['child_field'];
                            jQuery('.'+field).parents('.logic_block_div').find('.'+childfield).html(html);
                            jQuery('.'+field).parents('.logic_block_div').find('.'+childfield)[0].sumo.reload();
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

//get All Registration Dependent Child Values
function getChildtaxonomyValuesScore(html_field_id, cur_val_name, label_name , refresh ){
    
    if(typeof refresh === 'undefined'){
        refresh = '';
    }
    var parentFieldName = '';
    var childType = '';
    var curFieldName =  cur_val_name.replace('[value][]', '[ifField]');
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

function checkConditionTypeScore(elem,module) {
    if(typeof module === 'undefined'){
        module = '';
    }
    var college_id = $("#college_id").val();
    var val     = $(elem).val();
    var curForm = $(elem).parents('form');
    var name = $(elem).attr('name');
    var cur_val_name = name.replace('[expression]', '[value][]');
    var cur_var_name = name.replace('[expression]','[variable][]');
    var selected     = $(curForm).find("[name='" + cur_val_name + "']").val();
    jQuery("[name='" + cur_val_name + "']").removeAttr('disabled');
    $("[name='" + cur_val_name + "']").removeAttr("oninput");
    if ($(curForm).find("[name='" + cur_val_name + "']").parents('.selectValueDivClass').length > 0) {
        if ('Select Condition' == val || '' == val) {
            $(curForm).find("[name='" + cur_val_name + "']").parents('.selectValueDivClass>div').hide();
                if(college_id === '524' || college_id === '5000'){
                $(curForm).find("[name='" + cur_var_name + "']").parents('.select_variables_for_calculation>div').hide(); 
                }
            // if hide then selected value reset
            selected = '';
        } else {
            $(curForm).find("[name='" + cur_val_name + "']").parents('.selectValueDivClass>div').show();
                if(college_id === '524' || college_id === '5000'){
                    $(curForm).find("[name='" + cur_var_name + "']").parents('.select_variables_for_calculation>div').show();
                }
        }
    }
    if (val == 'between') {
        if(selected === 'Empty' || selected === 'Not Empty'){
            selected = '';
        }
        $('.datepicker,.daterangepicker').remove();
        if(jQuery("[name='" + cur_val_name + "']").hasClass('datetimepicker_report') && jQuery("[name='" + cur_val_name + "']").data('DateTimePicker')){
            jQuery("[name='" + cur_val_name + "']").data('DateTimePicker').destroy();
        }
        $(curForm).find("[name='" + cur_val_name + "']").val('');
        $(curForm).find("[name='" + cur_val_name + "']").removeClass('datepicker_report').addClass('daterangepicker_report');
        $(curForm).find("[name='" + cur_val_name + "']").datepicker('remove');
        if(module === 'renderCtp'){
            $("[name='" + cur_val_name + "']").val(selected); 
        }
        
    } else if (val == 'before' || val == 'after') {
        if(selected === 'Empty' || selected === 'Not Empty'){
            selected = '';
        }
        $('.datepicker,.daterangepicker').remove();
        $(curForm).find("[name='" + cur_val_name + "']").val('');
        $(curForm).find("[name='" + cur_val_name + "']").removeClass('daterangepicker_report').addClass('datepicker_report');
        jQuery("[name='" + cur_val_name + "']").off('hide.daterangepicker');
        if(module === 'renderCtp'){
            $("[name='" + cur_val_name + "']").val(selected); 
        }

    } else if (val === 'empty' || val === 'not_empty' || val === 'is_not_empty' || val === 'is_empty') {
        selected = 'Empty';
        if(val === 'not_empty' || val === 'is_not_empty'){
            selected = 'Not Empty';
        }
        jQuery('.datepicker,.daterangepicker').remove();
        jQuery("[name='" + cur_val_name + "']").val(selected);
        if(jQuery("[name='" + cur_val_name + "']").val() === null){
            jQuery("[name='" + cur_val_name + "']").append("<option style ='display:none' value='"+selected+"'>"+selected+" </option>");
            jQuery("[name='" + cur_val_name + "']").val(selected);
        }
        jQuery("[name='" + cur_val_name + "']").removeClass('datepicker_report daterangepicker_report');
        jQuery("[name='" + cur_val_name + "']").datepicker('remove');
        jQuery("[name='" + cur_val_name + "']").attr('disabled',true);
        if($("[name='" + cur_val_name + "']")[0] && $("[name='" + cur_val_name + "']")[0].sumo){
            $("[name='" + cur_val_name + "']")[0].sumo.reload();
        }
    } else {
        if(selected === 'Empty' || selected === 'Not Empty'){
            selected = '';
        }
        if($("[name='" + cur_val_name + "']")[0] && $("[name='" + cur_val_name + "']")[0].sumo){
            $("[name='" + cur_val_name + "'] option[value='Not Empty']").remove();  
            $("[name='" + cur_val_name + "'] option[value='Empty']").remove(); 
            $("[name='" + cur_val_name + "']")[0].sumo.reload();
        }
    }
    
    LoadReportDatepicker();
    LoadReportDateRangepicker();
    if($("[name='" + cur_val_name + "']")[0] && $("[name='" + cur_val_name + "']")[0].sumo){
        $("[name='" + cur_val_name + "']")[0].sumo.reload();
    }
    //sumoDropdown();
//    return false;
}

function sumoDropdown(){
    $('.sumo_select').each(function(){ 
       this.selected = false;
       id =$(this); //.attr('id'); 
       if(id !=='items-no-show'){
          placeholder =$(this).data('placeholder');
       id.SumoSelect({placeholder: placeholder, search: true, searchText:placeholder,  triggerChangeCombined: false }); 

        id[0].sumo.reload();  
       }
    });
}

function addmoreScoreAutomationInnerBlock(elem, form_id, counter) {
    var div_class   = 'form' + form_id;
    var stgClone    = jQuery(elem).closest('.' + div_class + '>div').eq(0).clone();
    var college_id = $('#college_id').val();
    // remove chosen select container
    jQuery(stgClone).find('.chosen-container').remove();
    
    // add delete button
    jQuery(stgClone).find('.removeElementClass').html('<a href="#" class="text-danger" onclick="return confirmDeleteScoreBlock(this,' + form_id + ',\'condition\');"><i class="fa fa-minus-circle font20" aria-hidden="true"></i></a>');
    
    jQuery(stgClone).find('select').val('');
    jQuery(stgClone).find('input').attr('placeholder', 'Input Value').val('');
    
    // remove hidden for autocomplete
    jQuery(stgClone).find('.sel_value_hidden').remove();
    jQuery(stgClone).find('.typeahead').remove();
    jQuery(stgClone).find('.lead_error, .error, .dependent_info').remove();
     
    // hide type(condition) fields and value fields
    jQuery(stgClone).find('.selectValueDivClass>div').hide();
    jQuery(stgClone).find('.field_value_condition>div').hide();
    
    // get block number
    var obj_name = jQuery(stgClone).find('select.sel_field').attr('name');
    var re = /\d+(?:\]\[)/gi;
    // calculate error span id
    if(form_id > 0) {
        var block_num = obj_name.match(re)[1].replace('][','');
        var error_span ='errorlead_'+form_id+'_'+block_num+'_1';
        var dependent_span ='dependent_info_'+form_id+'_'+block_num+'_1';
    }else{
        var block_num = obj_name.match(re)[0].replace('][','');
        var error_span ='errorlead_'+block_num+'_1';
        var dependent_span ='dependent_info_'+block_num+'_1';
    }
    // add error span
    jQuery(stgClone).append('<div class="col-sm-12 lead_error small error" id="'+error_span+'"></div>');
    jQuery(stgClone).append('<small class="col-md-12 col-xs-12 dependent_info text-info" id="'+dependent_span+'"></small>');
    // append clone object
    jQuery(elem).closest('.' + div_class).append(stgClone);
    
    //jQuery(stgClone).find('.chosen-container').remove(); 
    jQuery('.chosen-select').chosen();
    var stage_count = 0;
    // reset stage count

    jQuery(elem).parents('.block_first').find('.' + div_class + '>div').each(function () {
        
        
        var fields_name = $(this).find('.sel_field').attr('name').replace(/\[[\d]+\]\[ifField\]/gi, "[" + stage_count + "][ifField]");
        
        $(this).find('.sel_field').attr('name', fields_name);

        var fields_name = $(this).find('.sel_expression').attr('name').replace(/\[[\d]+\]\[expression\]/gi, "[" + stage_count + "][expression]");
        
        $(this).find('.sel_expression').attr('name', fields_name);

        var fields_name = $(this).find('.sel_value').attr('name').replace(/\[[\d]+\]\[value\]/gi, "[" + stage_count + "][value]");
        
        $(this).find('.sel_value').attr('name', fields_name);
        
        if(college_id === '524' || college_id === '5000'){
        var fields_name = $(this).find('.sel_variable').attr('name').replace(/\[[\d]+\]\[variable\]/gi, "[" + stage_count + "][variable]");
        
        $(this).find('.sel_variable').attr('name', fields_name);
        }
        if (typeof $(this).find('.sel_value_hidden').attr('name') != 'undefined') {
            var fields_name = $(this).find('.sel_value_hidden').attr('name').replace(/\[[\d]+\]\[values_id\]/gi, "[" + stage_count + "][values_id]");
            
            $(this).find('.sel_value_hidden').attr('name', fields_name);
        }
//        
        if (typeof $(this).find('.lead_error') !='undefined') {
            var fields_name = $(this).find('.lead_error').attr('id').replace(/\d+$/gi, stage_count);
            $(this).find('.lead_error').attr('id',fields_name);
        }
        stage_count++;
    });
    jQuery('.chosen-select').chosen();
    return false;
}

function confirmDeleteScoreBlock(elem, blockCounter) {
    
    $('#confirmTitle').html("Confirm");
    $('#ConfirmMsgBody').html('Are you sure delete this block?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $(elem).closest('.innerBlockClass').remove();
        
        //Regenerate All input Name
        jQuery('div.innerBlockClass').each(function (inner_counter, elem) {

            var fields_name = $(elem).find('.sel_field').attr('name').replace(/scoring_conditions\[[\d]*\]\[[\d]*\]/gi, "scoring_conditions[" + blockCounter + "]["+inner_counter+"]");
            $(elem).find('.sel_field').attr('name', fields_name).attr('onChange', 'buildScoringAutomationCreateInput(this,'+blockCounter+','+inner_counter+');');

            var fields_name = $(elem).find('.sel_expression').attr('name').replace(/scoring_conditions\[[\d]*\]\[[\d]*\]/gi, "scoring_conditions[" + blockCounter + "]["+inner_counter+"]");
            $(elem).find('.sel_expression').attr('name', fields_name);

            var fields_name = $(elem).find('.sel_value').attr('name').replace(/scoring_conditions\[[\d]*\]\[[\d]*\]/gi, "scoring_conditions[" + blockCounter + "]["+inner_counter+"]");
            $(elem).find('.sel_value').attr('name', fields_name);


            $(elem).find('.selectValueDivClass').removeAttr('class').addClass('col-sm-3 selectValueDivClass criteria-calculate-field-'+blockCounter+'-'+inner_counter);
        });
        
        //Hide the modal Box
        $('#ConfirmPopupArea').modal('hide');
    });
    return false;
}
//call publister list by traffic channel selected campain options
$(document).on('change', ".application_stage.sel_value", function () {
    var selected = $(this).find('option:selected', this);
    var selectedStage = [];
    selected.each(function() {
        selectedStage.push($(this).data('value'));
    });
    var currentElementObj = $(this);
    if($(".sel_value.application_sub_stage").length > 0){
        getSubstage(selectedStage,currentElementObj,[]);
    }
});

function getSubstage(stage, currentElementobj,select_name_value,selected) {
    class_name = 'application_sub_stage';
    var form_id = $("#formId").val();
    if(stage==0){
        $(currentElementobj).parents('.logic_block_div').find('.' + class_name+' option').remove();
        return;
    }
    if(typeof selected === 'undefined'){
        selected = '';
    }
    $.ajax({
        url: jsVars.FULL_URL+'/common/getLeadSubStages',
        type: 'post',
        data: {'formId': form_id, 'stageId': stage,'calledFrom':'applicantDocumentConfig'},
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
                    var html = '';
                    for(var subStageId in json['subStageList']) {
                        var selectedOption="";
                        if(selected.indexOf(subStageId)!== -1){
                            selectedOption=" selected ";
                        }
                        html += '<option value="'+subStageId+'" '+selectedOption+'>'+json['subStageList'][subStageId]+'</option>';
                    }
                    //console.log(class_name);
                    if($(currentElementobj).parents('.logic_block_div').find('.' + class_name).length > 0){
                        $(currentElementobj).parents('.logic_block_div').find('.' + class_name).html(html);
                    }
                    var substage_id = select_name_value[$(currentElementobj).parents('.logic_block_div').find('.' + class_name).attr('name')];
                    
                    if (typeof substage_id !== 'undefined' && substage_id !== null && substage_id.length > 0 ) {
                        substage_id =$.parseJSON(substage_id);
                        $(currentElementobj).parents('.logic_block_div').find('.' + class_name).val(substage_id);
                    }
                    if($(currentElementobj).parents('.logic_block_div').find('.' + class_name)[0] && $(currentElementobj).parents('.logic_block_div').find('.' + class_name)[0].sumo ){
                        $(currentElementobj).parents('.logic_block_div').find('.' + class_name)[0].sumo.reload();                    
                    }
                    return;
                   
                    
                }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}