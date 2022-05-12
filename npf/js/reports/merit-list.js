var alreadySelected = [];
$(document).ready(function () {
    /**
     * load form fields
     */
    $(document).on('change', '#form_id', function () {
        var form_id = this.value;

        if(typeof form_id =='undefined' || form_id==0 || form_id==''){
            $('select.allocate_basis_fields').html('<option value="">--Select--</option>');
            $('#allocate_field').html('<option value="">--Select--</option>');
            $('.chosen-select').trigger("chosen:updated");

            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.chosen-select').trigger('chosen:updated');
        }
        else{
            $.ajax({
                url: '/reports/get-form-fields',
                type: 'post',
                dataType: 'json',
                data: {'form_id': form_id},
                headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                success: function (json) {
                    if (json['error'] === "session") {
                        window.location.reload(true);
                    } else if (json['success'] === 200) {
                        $('.allocate_basis_fields').html(json['options']);
                        $('#allocate_field').html(json['field_cols']);
    //                    $('#rank_field').html(json['field_options']);
                        $('.chosen-select').trigger("chosen:updated");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        }
    });
    
    /**
     * merit list logic accordion open then trigger event for load condition fields
     */
    $('.merit_list_collapse').on('shown.bs.collapse', function () {
        $(".addnewLogicBlock").html('');
        var collegeId = $('#MeritListBuilderForm_Step_2 #college_id').val();
        var formId = $('#MeritListBuilderForm_Step_2 #form_id').val();
        var accordion_index = $(this).data('accordion_index');
        renderSavedFilter(collegeId, formId, accordion_index);
    });


    $('#MeritListBuilderForm_Step_1').on('keyup change paste', 'input, select, textarea', function(){
        somethingChangedStep1 = true;
    });


    /**
     * disable selected field from another select dropdown
     */
    $('#MeritListBuilderForm_Step_1').on('change', '.allocate_basis_fields', function(){
        disabledAlreadyUsedAllocateField();
    });
});

/**
 * Validate and populate allocation basis field value
 * @param {string} step
 * @param {string} logic_block_id
 * @returns {boolean}
 */

function validateMeritListFields(step,logic_block_id) {

    if (typeof step === 'undefined') { step = 'step_1'; }
    if (typeof logic_block_id === 'undefined') { logic_block_id = ''; }
    var errors = false;
    if(step === 'step_1'){
        errors = validateMeritListLogicFieldsStep_1();
    }
    
    if(errors === false){
        if(typeof $('[name="option_id"]').val() == 'undefined'){
            var errormsg = 'Once saved, you won\'t be able to change the form name. Do you want to proceed?';
        }
        else{
            var errormsg = ' Changes in merit list allocation logic will impact the final allocation. Do you want to proceed?';
        }
        if(somethingChangedStep1 === true){
            $('#ConfirmMsgBody').html(errormsg);
            $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
                .one('click', '#confirmYes', function (e) {
                    e.preventDefault();
                    $('#ConfirmPopupArea').modal('hide');
                    saveMeritListLogicFields(step,logic_block_id);
                });
        }
        else{
            saveMeritListLogicFields(step,logic_block_id);
        }    
    }
    return true;
}

/**
 * Validate Merit List Logic Step 1 Fields
 */
function validateMeritListLogicFieldsStep_1(){
    var errors = false;
    $('#commonError,.requiredError,#allocate_basis_fields_error,.error').html('').hide();
    var required = ['college_id','form_id','allocate_field'];
    var orderVals = [];
    var fieldVals = [];
    for(var id in required){
        var reqVal = $('#'+required[id]).val();
        if(typeof reqVal == 'undefined' || reqVal==='' || reqVal==='0'){
            $('#'+required[id]+'_error').show().html('Please fill');
            errors = true;
        }
    }
    var allocate_basis_fields = $('[name="allocate_basis_fields[fields][]"]').val();
    if(typeof allocate_basis_fields == 'undefined' || allocate_basis_fields===''){
        $('#allocate_basis_fields_error').show().html('Please fill');
        errors = true;
    }

    
    if(errors === false){
        var uniqfield = {};
//        console.log($('[name="allocate_basis_fields[fields][]"]').serializeArray());
        var alloct  = $('[name="allocate_basis_fields[fields][]"]').serializeArray();
        var alloctOrder  = $('[name="allocate_basis_fields[orders][]"]').serializeArray();
        
        for(var i in alloct){
            // for validation order
            if(typeof alloctOrder[i].value !='undefined' &&  alloctOrder[i].value!='' && !isNaN(alloctOrder[i].value)){
                var orderVal = alloctOrder[i].value;
                orderVals.push(orderVal);
            }

            // for validation order
            if(typeof alloct[i].value !='undefined' &&  alloct[i].value!=''){
                var fieldVal = alloctOrder[i].value;
                fieldVals.push(fieldVal);
            }
            
            var aa = alloct[i].value.split('||')[1];
            uniqfield[aa] = 'obj';
        }

        if(Object.keys(uniqfield).length !==1){
            $('#allocate_basis_fields_error').show().html('Please select valid data');
            errors = true;
        }

        if(errors === false){
            orderVals = removeDuplicates(orderVals);
            if(orderVals.length!=fieldVals.length){
                $('#allocate_basis_fields_error').show().html('Please enter valid order');
                errors = true;
            }
        }
    }
    return errors;
}



/**
 * save step 1 and step 2 form data, 
 * @param {type} step
 * @param {type} logic_block_id
 * @returns {undefined}
 */

function saveMeritListLogicFields(step,logic_block_id){
    
    if (typeof logic_block_id === 'undefined') { logic_block_id = ''; }
    
    $('#commonError,.requiredError').html('').hide();
    var formData = [];
    
    if(step === 'step_1'){
        // for step 1
        formData = $('#MeritListBuilderForm_Step_1').serializeArray();
    }
    else{
        // for step 2
        formData = $('#MeritListBuilderForm_Step_2, #'+logic_block_id).serializeArray();
    }

    // call ajax for saving data
    $.ajax({
        url: '/reports/save-merit-list-fields',
        type: 'post',
        dataType: 'json',
        data: formData,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if (data['error'] === "session") {
                window.location.reload(true);
            }
            else if(typeof data['error'] !=='undefined' && data['error']!==''){
                alertPopup(data['error'],'error');
            }
            else if (data['redirect'] !== '') {
                if(step === 'step_1'){
                    window.location.href = data['redirect'];
                }
                else{
                    var block_name = $("#"+logic_block_id+" #logic_block_lable").val();
                    alertPopup('Meritlist logic for "'+block_name+'" successfully saved','success',window.location.href);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/**
 * Add condition logic block
 * @param {type} college_id
 * @param {type} form_id
 * @param {type} accordionIndex
 * @param {type} appendType
 * @returns {Boolean}
 */

function addBlockConditionAjax(college_id, form_id, accordionIndex,appendType) {

    var radio_val = $('#app_block_condition_'+accordionIndex).val();
    if(typeof radio_val ==='undefined'){
        radio_val = 'yes';
    }
    
    var index = parseInt($('#collapse_' + accordionIndex + ' div.block-repeat').length);
    
    if(typeof appendType ==='undefined'){
        appendType = '';
    }
    else if(appendType ==='reset'){
         index = 0;
    }
    $.ajax({
        url: '/applications/load-logic-block-merit-list',
        type: 'post',
        data: {form_id: form_id, 'college_id': college_id, index: index, block_radio: radio_val},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('.sectionLoader').show();
        },
        complete: function () {
            $('.sectionLoader').hide();
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
            
                if(typeof accordionIndex !== 'undefined' && accordionIndex !==''){
                    if(appendType === 'reset'){
                        
                        $("#addnewLogicBlock_" + accordionIndex).html(Html);
                    }
                    else{
                        $("#addnewLogicBlock_" + accordionIndex).append(Html);
                    }
                }
                $('.chosen-select').chosen();
                $('.addMoreBlockBtn').show();
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
/**
 * Dropdown position change according to space available on bottom or above
 * @returns {undefined}
 */
function setDroupClass() {
    $('.condition_div').each(function (i, val) {
        $(this).removeClass('dropup');
        var x = $(this).offset();
        if (x.top > 430) {
            $(this).addClass('dropup');
        }
        if (x.top > 320) {
            $(this).addClass('dropup-date');
        }
    });
}

/**
 * create input filter
 * @param {type} currentObj
 * @param {type} selected
 * @param {type} typeselected
 * @param {type} call_type
 * @returns {undefined}
 */

function createApplicationFilterConfig(currentObj, selected, typeselected, call_type) {
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
    var dependentField = $(currentObj).find(':selected').data('dependentgroup');
    var parentFieldId = $(currentObj).find(':selected').data('parent');
    var cur_val_name = cur_elem_name.replace('[fields]', '[values][]');
    var cur_type_name = cur_elem_name.replace('[fields]', '[types]');
    var labelname = 'Select an Option';
    var value_field = $(currentObj).val();
    var arr = value_field.split("||");
    var html = '';
    var type = "";
    var class_date = '';

    if (typeof parentFieldId !== 'undefined' && parentFieldId !== '') {
        //for fixed dependent fields
        var tmp = $(currentObj).find('option[data-input_id="' + parentFieldId + '"]').text();
        if ((typeof tmp === 'undefined' || tmp === '') && parentFieldId === 'district_id') {
            tmp = $(currentObj).find('option[data-input_id="state_id"]').text();
        }
        if (typeof tmp !== 'undefined' && tmp !== '') {
            $(currentObj).parent().parent().parent().find('.dependent_info').html('This field is dependent on ' + tmp);
        }
    } else if (typeof dependentField !== 'undefined' && dependentField !== '') {
        //form fields dependent
        var curInputId = $(currentObj).find(':selected').data('input_id');
        var tmp = $(currentObj).find('option[data-child="' + curInputId + '"]').text();
        if (typeof tmp !== 'undefined' && tmp !== '') {
            $(currentObj).parent().parent().parent().find('.dependent_info').html('This field is dependent on ' + tmp);
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

        //in case of dynamic registration select field
        if (type === "select") {
            type = "dropdown";
        }
        if (type === "dropdown" || type === "predefined_dropdown") {

            if (html_field_id === 'campu|publisher_id' || html_field_id === 'pub|publisher_id') {
                val_json = '[]';
                html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select publisher_filter sel_value' name='" + cur_val_name + "' data-field='" + html_field_id + "'>";
            } else if (html_field_id === 'u|traffic_channel') {
                html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select traffic_channel sel_value' name='" + cur_val_name + "' data-field='" + html_field_id + "'>";
            } else if (html_field_id === 'u|registration_instance') {
                html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select registration_instance sel_value' name='" + cur_val_name + "' data-field='" + html_field_id + "'>";
            } else if (html_field_id === 'ap|payment_status') {
                html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select payment_status sel_value' name='" + cur_val_name + "' data-field='" + html_field_id + "'>";
            } else if (html_field_id === 'ap|payment_method') {
                html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select payment_method sel_value' name='" + cur_val_name + "' data-field='" + html_field_id + "'>";
            } else if (html_field_id === 'ud|career_utsav_id') {
                html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select career_utsav_id sel_value' name='" + cur_val_name + "' data-field='" + html_field_id + "'>";
            } else if (html_field_id === 'ud|career_utsav_area_id') {
                html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select career_utsav_area_id sel_value' name='" + cur_val_name + "' data-field='" + html_field_id + "'>";
            } else if (html_field_id === 'ud|seminar_preference_id') {
                html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select seminar_preference_id sel_value' name='" + cur_val_name + "' data-field='" + html_field_id + "'>";
            } else if (html_field_id === 'ud|mock_preference_id') {
                html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select mock_preference_id sel_value' name='" + cur_val_name + "' data-field='" + html_field_id + "'>";
            }

            else if(html_field_id === 'status'){
                html = "<select placeholder='Select an Option' class='chosen-select sel_value " + html_field_id + "' name='" + cur_val_name + "' data-field='" + html_field_id + "' data-ct='" + call_type + "'><option value=''>--Select--</option>";
            }
            else {
                html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select sel_value " + html_field_id + "' name='" + cur_val_name + "' data-field='" + html_field_id + "' data-ct='" + call_type + "'>";
            }

            var obj_json = JSON.parse(val_json);
            if ($.inArray(html_field_id, ['ud|country_id', 'ud|state_id', 'ud|city_id', 'ud|course_id', 'ud|specialization_id', 'ud|university_id', 'ud|district_id']) >= 0) {
                html += '<option value="0">' + label_name + jsVars.notAvailableText + ' </option>';
            }
            for (var key in obj_json) {
                //default select pri registration in registration instance
                var select = '';
                if (key === 'pri_register_date') {
                    select = 'selected';
                }
                if (typeof obj_json[key] === 'object') {
                    html += '<optgroup label="' + key + '">';
                    for (var key2 in obj_json[key]) {
                        html += "<option " + select + " value=\"" + key2 + "\">" + obj_json[key][key2] + "</option>";
                    }
                    html += '</optgroup>';
                } else {
                    if (type === 'predefined_dropdown') {
                        html += "<option " + select + " value=\"" + key + ";;;" + obj_json[key] + "\">" + obj_json[key] + "</option>";
                    } else {
                        html += "<option " + select + " value=\"" + key + "\">" + obj_json[key] + "</option>";
                    }
                }
            }
            html += "</select>";


            if (type === 'predefined_dropdown') {
                updateOperator('predefined_dropdown', cur_type_name, typeselected);
            } else {
                updateOperator('dropdown', cur_type_name, typeselected);
            }

        } else if (type === "date") {
            if (jQuery("[name='" + cur_type_name + "']").val() === 'between') {
                class_date = "daterangepicker_report";
            } else {
                class_date = "datepicker_report";
            }

            html = "<input type='text' class='form-control sel_value " + class_date + "' name='" + cur_val_name + "' value='' readonly='readonly' placeholder='" + labelname + "' data-id='" + html_field_id + "' data-field='" + html_field_id + "'>";
            updateOperator('date', cur_type_name, typeselected);
        } else {
            html = "<input type='text' class='form-control sel_value' name='" + cur_val_name + "' value='' placeholder=' Enter Value' data-id='" + html_field_id + "' data-field='" + html_field_id + "'>";
            if (type === "number_range") {
                updateOperator('number_range', cur_type_name, typeselected);
            } else {
                updateOperator('text', cur_type_name, typeselected);
            }
        }
    } else {
        html = "<input type='text' class='form-control sel_value' name='" + cur_val_name + "' value='" + selected + "' placeholder='Enter Value' data-field='" + html_field_id + "'>";
        updateOperator('text', cur_type_name, typeselected);
        if (type === "number_range") {
            updateOperator('number_range', cur_type_name, typeselected);
        } else {
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
    if (html_field_id === 'pub|publisher_id') {

        if ($("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.traffic_channel').last().val()) {
            appendFlag = 1;
            var selectedChannel = $("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.traffic_channel').last().val();
            var currentElementObj = $("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.publisher_filter').last();
            populatePublisherReferrers(currentElementObj, [], selectedChannel);
            appendFlag = 0;
        }

    }

    //load campaign source, medium , name value
    if (selected === '' && $.inArray(html_field_id, ['campu|source_value', 'campap|conversion_source_value']) >= 0) {

        if ($("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.publisher_filter').last().val()) {

            // application manager
            var pub_val = $("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.publisher_filter').last().val();

            if (typeof pub_val !== 'undefined' && pub_val.length !== 0) {
                $.each(pub_val, function (k, pub_val_single) {
                    var pub_val_ar = pub_val_single.split('___');
                    pub_val = pub_val_ar[0];
                    if (html_field_id === 'campap|conversion_source_value') {
                        getCampaignsSourceConfig(currentObj, pub_val, '', 'campap\\|conversion_source_value');
                    } else {
                        getCampaignsSourceConfig(currentObj, pub_val);
                        getCampaignsSourceConfig(currentObj, pub_val, '', 'campap\\|conversion_source_value');
                    }

                });
                appendFlag = 0;
            }
        }
    }

    if (selected === '' && $.inArray(html_field_id, ['campu|medium_value', 'campap|conversion_medium_value']) >= 0) {
        var searchFieldClass = 'campu\\|source_value';
        if (html_field_id === 'campap|conversion_medium_value') {
            searchFieldClass = 'campap\\|conversion_source_value';
        }
        /// load value from
        var source_val_arr = $("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.' + searchFieldClass).last().val();

        if (typeof source_val_arr !== 'undefined' && source_val_arr !== '' && source_val_arr != null) {
            $.each(source_val_arr, function (k, source_val) {
                if (typeof source_val !== 'undefined' && source_val !== '') {
                    var source_val_ar = source_val.split('___');
                    source_val = source_val_ar[0];
                    if (html_field_id === 'campap|conversion_medium_value') {
                        getCampaignsMediumConfig(currentObj, source_val, '', 'campap\\|conversion_medium_value');
                    } else {
                        getCampaignsMediumConfig(currentObj, source_val);
                    }

                }
            });
            appendFlag = 0;
        }
    }

    if (selected === '' && $.inArray(html_field_id, ['campu|name_value', 'campap|conversion_name_value']) >= 0) {
        /// load value from
        var mediumValueClass = 'campu\\|medium_value';
        var sourceValueClass = 'campu\\|source_value';
        if (html_field_id === 'campap|conversion_name_value') {
            mediumValueClass = 'campap\\|conversion_medium_value';
            sourceValueClass = 'campap\\|conversion_source_value';
        }
        var medium_val_arr = $("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.' + mediumValueClass).last().val();

        if (typeof medium_val_arr !== 'undefined' && medium_val_arr !== '' && medium_val_arr !== null) {
            $.each(medium_val_arr, function (k, medium_val) {
                var medium_val_ar = medium_val.split('___');
                medium_val = medium_val_ar[0];

                if (html_field_id === 'campap|conversion_name_value') {
                    getCampaignsNameConfig(currentObj, medium_val, '', 'campap\\|conversion_name_value');
                } else {
                    getCampaignsNameConfig(currentObj, medium_val);
                }
            });
            appendFlag = 0;
        } else {
            var source_val_arr = $("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.' + sourceValueClass).last().val();
            if (typeof source_val_arr !== 'undefined' && source_val_arr !== '' && medium_val_arr !== null) {
                $.each(source_val_arr, function (k, source_val) {
                    var source_val_ar = source_val.split('___');
                    source_val = source_val_ar[0];
                    if (html_field_id === 'campap|conversion_name_value') {
                        getCampaignsNameConfig(currentObj, source_val, [], 'campap\\|conversion_name_value', 'source_value');
                    } else {
                        getCampaignsNameConfig(currentObj, source_val, [], '', 'source_value');
                    }
                });
                appendFlag = 0;
            }
        }
    }



    //get All Registration Dependent Child Values
    getChildtaxonomyValues(html_field_id, cur_val_name, label_name);

    //get college creater list
    if (html_field_id === 'CreatedBySelect') {
        if (typeof CollegeWiseCreaterList !== "undefined" && $('#FilterApplicationForms select#college_id').val() in CollegeWiseCreaterList['CollegeWise'])
        {
            UpdateCreatedBySelect(CollegeWiseCreaterList['CollegeWise'][$('#FilterApplicationForms select#college_id').val()], postedCreatedBy, cur_val_name);
        }
    }

    if ((type === "dropdown" || type === "predefined_dropdown") && selected !== '') {
        $("[name='" + cur_val_name + "']").val(JSON.parse(selected));
    } else if (selected !== '') {
        selected = JSON.parse(selected);
        $("[name='" + cur_val_name + "']").val(selected[0]);
    }

    $('.chosen-select').chosen();
    $('.chosen-select').trigger('chosen:updated');
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});


    if (selected === '') {
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
        LoadReportDatepicker();
        LoadDynamicDateRangePicker();

    }
    if (typeof dependentField !== 'undefined' && dependentField !== '' && dependentField.indexOf('fixed_') !== 0) {
        checkDependentField(html_field_id, currentObj, type, selected);
    }

    $('select.sumo_select').SumoSelect({placeholder: labelname, search: true, searchText: labelname, captionFormatAllSelected: "All Selected.", triggerChangeCombined: true});
}

/**
 * operator according to filter
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
    if (selectedField.indexOf('fd|payment_mode||') === 0 || selectedField.indexOf('form_status||') === 0) {
        operator['dropdown'] = {
            'eq': 'Equals',
            'neq': 'Does Not Equals',
            'eq_dd': 'Contains',
            'neq_dd': 'Does Not Contains'
        };
    }
    if (typeof type !== 'undefined' && ['dropdown', 'text', 'number_range', 'date', 'predefined_dropdown'].indexOf(type) > -1) {
        for (var lkey in operator[type]) {
            html += '<option value="' + lkey + '">' + operator[type][lkey] + '</option>';
        }
    }
    jQuery("[name='" + container_name + "']").html(html);
    jQuery("[name='" + container_name + "']").val(selected);
    jQuery('.chosen-select').chosen();
}


//get All Registration Dependent Child Values
function getChildtaxonomyValues(html_field_id, cur_val_name, label_name, refresh) {

    if (typeof refresh === 'undefined') {
        refresh = '';
    }
    var parentFieldName = '';
    var childType = '';
    var curFieldName = cur_val_name.replace('[values][]', '[fields]');
    if ($.inArray(html_field_id, ['ud|state_id', 'ud|city_id', 'ud|district_id', 'ud|specialization_id']) >= 0) {

        if (html_field_id === 'ud|state_id') {
            parentFieldName = 'country_id';
            childType = 'State';
        } else if (html_field_id === 'ud|district_id') {
            $("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.ud\\|city_id').html('');
            if (refresh === 'true') {
                $("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.ud\\|city_id')[0].sumo.reload();
            }
            parentFieldName = 'state_id';
            childType = 'District';
        } else if (html_field_id === 'ud|city_id') {
            var isDistrictEnable = $("[name='" + curFieldName + "']").find('option[data-input_id="district_id"]').length;
            if ($("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.ud\\|district_id').length || isDistrictEnable !== 0) {
                parentFieldName = 'district_id';
            } else {
                parentFieldName = 'state_id';
            }
            childType = 'City';
        } else if (html_field_id === 'ud|specialization_id') {
            parentFieldName = 'course_id';
            childType = 'Specialisation';
        }
        /// load value from
        if ($("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.ud\\|' + parentFieldName).length) {
            var selectedEvents = $("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.ud\\|' + parentFieldName).val();
            var html = getSelectedChildTaxonomy(selectedEvents, childType);
            html = '<option value="0">' + label_name + jsVars.notAvailableText + ' </option>' + html;
            $("[name='" + cur_val_name + "']").html(html);
            if (refresh === 'true') {
                $("[name='" + cur_val_name + "']")[0].sumo.reload();
            }
        }
    }
}

/**
 * check condition
 * @param {type} elem
 * @param {type} module
 * @returns {undefined}
 */
function checkConditionType(elem, module) {

    if (typeof module === 'undefined') {
        module = '';
    }
    var val = $(elem).val();
    var name = $(elem).attr('name');
    var cur_val_name = name.replace('[types]', '[values][]');
    var selected = $("[name='" + cur_val_name + "']").val();
    var elemType = $("[name='" + cur_val_name + "']").attr('type');

    jQuery("[name='" + cur_val_name + "']").removeAttr('disabled');
    $("[name='" + cur_val_name + "']").removeAttr("oninput");
    if (elemType === 'text') {
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
        jQuery('.datepicker,.daterangepicker').remove();

        jQuery("[name='" + cur_val_name + "']").val('');
        jQuery("[name='" + cur_val_name + "']").removeClass('datepicker_report').addClass('daterangepicker_report');
        jQuery("[name='" + cur_val_name + "']").datepicker('remove');
        if (module === 'renderCtp') {
            $("[name='" + cur_val_name + "']").val(selected);
        }

    } else if (val === 'before' || val === 'after') {
        jQuery('.datepicker,.daterangepicker').remove();
        jQuery("[name='" + cur_val_name + "']").val('');
        jQuery("[name='" + cur_val_name + "']").removeClass('daterangepicker_report').addClass('datepicker_report');
        jQuery("[name='" + cur_val_name + "']").off('hide.daterangepicker');
        if (module === 'renderCtp') {
            $("[name='" + cur_val_name + "']").val(selected);
        }

    } else if (val === 'empty' || val === 'not_empty') {
        var parseval = 'Empty';
        if (val === 'not_empty') {
            parseval = 'Not Empty';
        }
        jQuery('.datepicker,.daterangepicker').remove();
        jQuery("[name='" + cur_val_name + "']").val(parseval);
        if (jQuery("[name='" + cur_val_name + "']").val() === null) {
            jQuery("[name='" + cur_val_name + "']").append("<option style ='display:none' value='" + parseval + "'>" + parseval + " </option>");
            jQuery("[name='" + cur_val_name + "']").val(parseval);
        }
        jQuery("[name='" + cur_val_name + "']").removeClass('datepicker_report daterangepicker_report');
        jQuery("[name='" + cur_val_name + "']").datepicker('remove');
        jQuery("[name='" + cur_val_name + "']").attr('disabled', true);
        if ($("[name='" + cur_val_name + "']")[0] && $("[name='" + cur_val_name + "']")[0].sumo) {
            $("[name='" + cur_val_name + "']")[0].sumo.reload();
        }
    } else if (val === 'num_between') {
        if (selected === 'Empty' || selected === 'Not Empty') {
            selected = '';
        } else if (selected.indexOf(',') === -1) {
            selected = '';
        }
        $("[name='" + cur_val_name + "']").val(selected);
        $("[name='" + cur_val_name + "']").attr("placeholder", "Comma seperated value");
        $("[name='" + cur_val_name + "']").attr("oninput", "validateInput(this);");
    } else {
        if (selected === 'Empty' || selected === 'Not Empty') {
            selected = '';
        }
        $("[name='" + cur_val_name + "']").val(selected);
        if ($("[name='" + cur_val_name + "']")[0] && $("[name='" + cur_val_name + "']")[0].sumo) {
            $("[name='" + cur_val_name + "'] option[value='Not Empty']").remove();
            $("[name='" + cur_val_name + "'] option[value='Empty']").remove();
            $("[name='" + cur_val_name + "']")[0].sumo.reload();
        }
    }
    var dateRangePickerElem = $("[name='" + cur_val_name + "']").hasClass('daterangepicker_report');
    var datePickerElem = $("[name='" + cur_val_name + "']").hasClass('datepicker_report');
    if (dateRangePickerElem || datePickerElem) {
        $("[name='" + cur_val_name + "']").attr("placeholder", "Select an Option");
    }
    LoadReportDatepicker();
    LoadDynamicDateRangePicker();
    $('.chosen-select').chosen();
    $('.chosen-select').trigger('chosen:updated');
}

/**
 * Add More Button for add filter
 * @param {type} elem
 * @returns {Boolean}
 */
function addMoreApplCondition(elem) {
    var div_class = 'form0';

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
    var block_num = obj_name.match(re)[0].replace('][', '');
    var error_span = 'errorlead_' + block_num + '_1';
    // add error span
    jQuery(stgClone).append('<span class="col-md-12 lead_error" id="' + error_span + '"></span>');
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
            var fields_name = $(this).find('.lead_error').attr('id').replace(/_\d$/gi, '_' + stage_count);
            $(this).find('.lead_error').attr('id', fields_name);
        }
        stage_count++;
    });
    jQuery('.chosen-select').chosen();
    setDroupClass();
    return false;
}


/**
 * Delete Condition
 * @param {type} elem
 * @param {type} type
 * @returns {Boolean}
 */
function confirmDelete(elem, type) {

    $("#ConfirmPopupArea").css('z-index', 11001);
    $('#ConfirmMsgBody').html('Do you want to delete ' + type + '?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();
                if (type === 'condition') {
                    removeApplCondition(elem);
                } 
                else if(type === 'allocatefield'){
                    removeBlockAllocatefield(elem);
                }
                else {
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

/**
 * Remove Condition Block
 * @param {type} elem
 * @returns {Boolean}
 */
function removeApplCondition(elem) {
    var div_class = 'form0';
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
            var fields_name = $(this).find('.lead_error').attr('id').replace(/_\d*$/gi, '_' + stage_count);
            $(this).find('.lead_error').attr('id', fields_name);
        }
        stage_count++;
    });
    setDroupClass();
    return false;
}

/**
 * AND/OR Blockwise condition set
 * @param {object} elem
 * @returns {Boolean}
 */
function applicationAndOrBlockCondition(elem) {
    $(elem).parents('.addnewLogicBlock').find('.block_criteria a.btn_or, .block_criteria a.btn_and').removeClass('active');
    if ($(elem).hasClass('btn_or')) {
        $(elem).parents('.addnewLogicBlock').find('.block_criteria a.btn_or').addClass('active');
        
        $(elem).parents('form.formLogicBlock').find('[name="app_block_condition"]').val('or').trigger('change');
    } else if ($(elem).hasClass('btn_and')) {
        $(elem).parents('.addnewLogicBlock').find('.block_criteria a.btn_and').addClass('active');
        
        $(elem).parents('form.formLogicBlock').find('[name="app_block_condition"]').val('and').trigger('change');
    }
    return false;
}


/**
 * Listing Meritlist Logics
 * @param {string} load_type
 * @returns {Boolean}
 */
function loadMoreMeritList(load_type) {
    
    //Check whether college is select or not
    if ($.trim($('#s_college_id').val())==='') {
		$('#load_msg_div').show();
        $('#load_msg').html("Please select an Institute Name from filter and click apply to view results.");
        $('#load_more_button').hide();
        $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i> &nbsp;Load More Data');
        if (load_type !== '') {
            $('#if_record_exists').hide();
        }
        return false;
    }
    
    if (load_type === 'reset') {
        Page = 0;
		//$('#load_msg_div').hide();
        $('#load_msg').html("");
        //$('#load_more_results').html("");
        //$('#load_more_results_msg').html("");
        //$('#load_more_results_msg').show("");
        $('#load_more_button').show();
        $('#load_slider_data').html("");
        $('#load_more_button').html("Loading...");
        $('#view_by').val('');
        $('button[name="search_btn"]').attr('disabled','disabled');
        //$('.chosen-select').chosen();
        //$('.chosen-select-deselect').chosen({allow_single_deselect: true});
    }
    
    var data = $('#FilterMeritListForm').serializeArray();
    data.push({name: "page", value: Page});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-spin fa-refresh" aria-hidden="true"></i> &nbsp;Loading...');
    $.ajax({
//        url: '/reports/ajax-list-custom-module',
        url: '/reports/ajax-merit-list-manager',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
		beforeSend: function () {
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
        },
        success: function (data) {
            $('button[name="search-btn"]').removeAttr('disabled');
            Page = Page + 1;
            if (data === "session_logout" || data ==='token_mismatch' || data ==='permission_error') {
                window.location.reload(true);
            }
            else if (data === "error") {
                if(Page===1) {
                    error_html="No Records found";
					$('#dataTable').hide();
					$('#load_msg_div').show();
					$('#load_msg').append(""+error_html+"");
                }
                else {
                    error_html="No More Record";
					$('#load_more_results > tbody').append('<tr><td colspan="3" class="text-danger text-center fw-500">'+error_html+'</td></tr>');
					//$('#load_more_button').html("");
                }
                //$('#load_more_button').html("Load More Data");
                $('#load_more_button').hide();
                if (load_type != '' && Page==1) {
                    $('#if_record_exists').hide();
                }
            }
            else if (data === "select_college") {
                $('#dataTable').hide();
                $('#load_msg_div').show();
                $('#load_msg').html("Please select an Institute Name from filter and click apply to view results.");
                //$('#load_more_results_msg').html("<div class='alert alert-danger'>Please select a college to view results.</div>");
                $('#load_more_button').hide();
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i> &nbsp;Load More Data');
                if (load_type != '') {
                    $('#if_record_exists').hide();
                }
            }
            else {
                if (load_type == 'reset') {
                    $('#load_more_results').html("");
                }
                data = data.replace("<head/>", '');
                //console.log(data);
				$('#load_msg_div').hide();
				$('#dataTable').show();
                $('#load_more_results').append(data);
                $('.offCanvasModal').modal('hide');
				dropdownMenuPlacement();
                
                var ttl = $('#tot_records').html().split(' '); 
                //alert(parseInt(ttl[1])+'==='+parseInt($('#items_no_show_chosen > a > span').html()));
                if(parseInt(ttl[1]) <=  parseInt($('#items_no_show_chosen > a > span').html())){
                    $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i> &nbsp;Load More Data');
                    $('#load_more_button').hide();
                }else{
                    $('#load_more_button').removeAttr("disabled");
                    $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i> &nbsp;Load More Data');
                } 

                if (load_type != '') {
                    $('#if_record_exists').fadeIn();
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}


function addMoreAllocateFields(elem) {
    var div_class = 'allocatefield0';
    var alloct  = $('[name="allocate_basis_fields[fields][]"]').serializeArray();
    for(var i in alloct){
        alreadySelected.push(alloct[i].value);
    }

//    var stgClone = jQuery(elem).closest('.' + div_class).eq(0).clone();
    var stgClone = jQuery(elem).closest('.' + div_class + '>div').eq(0).clone();

    // remove chosen select container
    jQuery(stgClone).find('.chosen-container').remove();
    
    jQuery(stgClone).find('option').each(function () {
//       console.log($(this).attr('value'));
        if(alreadySelected.indexOf($(this).attr('value'))>-1){
            $(this).attr('disabled','disabled');
        }
    });







    // add delete button
    jQuery(stgClone).find('.removeElementClass').html('<a href="javascript:void(0);" class="text-danger" onclick="return confirmDelete(this,\'allocatefield\');"><i class="fa fa-minus-circle" aria-hidden="true"></i></a>');

    // reset all select box value
    jQuery(stgClone).find('select').val('');
    // blank textbox value
    jQuery(stgClone).find('input').attr('placeholder', 'Order').val('');
    jQuery(elem).closest('.' + div_class).append(stgClone);
    jQuery('.chosen-select').chosen();
    return false;
}


function removeBlockAllocatefield(elem) {
//    var div_class = 'allocatefield0';
    somethingChangedStep1 = true;
    jQuery(elem).closest('.block-repeat').remove();
    disabledAlreadyUsedAllocateField();

//    jQuery(elem).closest('.block-repeat').remove();
//    jQuery('.chosen-select').chosen();
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
            if (channelVal == 1 || channelVal == 8) {//campaign option
                getPublisherListConfig(tempThis, select_name_value, 'publisher_filter',channelVal);
            } else if (channelVal == 5 || channelVal == 3 || channelVal == 4) {
                getReferrerListConfig(tempThis, select_name_value, 'publisher_filter',channelVal);
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
        }else if (typeof elemClass != 'undefined' && elemClass.indexOf('career_utsav_id') > -1) {
            var selectedEvents = $(this).val();
            populateCareerUtsavAreaOfIntrest(currentElementObj, selectedEvents, select_name_value);
        }else if (typeof elemClass != 'undefined' && elemClass.indexOf('career_utsav_area_id') > -1) {
            var selectedEvents = $(currentElementObj).parents('div.block-repeat').find('.career_utsav_id').last().val();
            var selectedUtsavArea = $(this).val();
            populateCareerUtsavSeminarMockPrefList(currentElementObj, selectedEvents, selectedUtsavArea, select_name_value);
        }
    });
}

/**
 * Render Merit list logic on edit mode
 * @param {int} college_id
 * @param {int} form_id
 * @param {string} accordion_index
 * @returns {Boolean}
 */

function renderSavedFilter(college_id, form_id, accordion_index) {
    if(college_id === '' || college_id === 0 || college_id === '0'){
        alert('Please Select college first');
        return false;
    }
    $.ajax({
        url: '/applications/render-saved-filter-merit-list',
        type: 'post',
        data: {form_id: form_id,'college_id':college_id,'accordion_index':accordion_index},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('.sectionLoader').show();
        },
        complete: function (){
            $('.sectionLoader').hide();
        },
        success: function (html) {
            if (html === 'session') {
                window.location.reload(true);
            }
            else if (html === 'key_error') {
                alert('Unable to process request!');
            }
            else if(html === 'load_default'){
                addBlockConditionAjax(college_id, form_id, accordion_index,'reset');
            }
            else {
                $("#addnewLogicBlock_"+accordion_index).html(html);
                $('.chosen-select').chosen();
                $('.addMoreBlockBtn').show();
                setDroupClass();
                // set value after load
//                $('#app_block_condition_'+accordion_index).val('');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
//            hideFilterLoader();
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

/**
 * confirm for execute query
 * @param {string} fldname
 * @returns {undefined}
 */

function confirmExecuteMeritList(fldname){
    $('#ConfirmMsgBody').html('Generate list will update Allocate field ('+fldname+') data?');
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmYes', function (e) {
            e.preventDefault();
            $('#ConfirmPopupArea').modal('hide');
            executeMeritListLogic();
        });
}
/**
 * Run SQL Query
 * @returns {undefined}
 */

function executeMeritListLogic(){
    var data = $('#MeritListBuilderForm_Step_2').serializeArray();
    $.ajax({
        url: '/reports/execute-merit-list-logic',
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#listloader').show();
            $('#executeMeritListLogicButton').html('Generate List&nbsp;<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>');
        },
        complete: function (){
            $('#listloader').hide();
            $('#executeMeritListLogicButton').html('Generate List');
        },
        success: function (json) {
            if (typeof json['error'] !=='undefined' && json['error'] === 'session') {
                window.location.reload(true);
            }
            else if (typeof json['error'] !=='undefined' && json['error'] !== '') {
                alertPopup(json['error'],'error');
            }
            else if(typeof json['success'] !=='undefined' && json['success'] === 200){
                alertPopup(json['msg'],'success','/reports/merit-list-manager');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
//            hideFilterLoader();
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function resetFilterMeritList(){
    $('#FilterMeritListForm select,#FilterMeritListForm input[type="text"]').val('');

    $('#dataTable').hide();
    $('#load_msg_div').show();
    $('#load_msg').html("Please select an Institute Name from filter and click apply to view results.");
    //$('#load_more_results_msg').html("<div class='alert alert-danger'>Please select a college to view results.</div>");
    $('#load_more_button').hide();
    $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i> &nbsp;Load More Data');
    $('#if_record_exists').hide();
    

    $('.chosen-select').trigger("chosen:updated");
    return;
}

/**
 * Delete duplicate from array
 * @param {type} num
 * @returns {Array|removeDuplicates.out}
 */
function removeDuplicates(num) {
  var x,
      len=num.length,
      out=[],
      obj={};

  for (x=0; x<len; x++) {
    obj[num[x]]=0;
  }
  for (x in obj) {
    out.push(x);
  }
  return out;
}

/**
 * Call function for form/allocatin field reset depend on parent selection
 * @param {type} val
 * @returns {undefined}
 */
function loadColegeForms(val){
    if(typeof val == 'undefined' || val=='' || val==0){
        var data = "<select name='form_id' id='form_id'  class='chosen-select' ><option value='0'>Form</option></select>";
        var dataAllocate = "<option value=''>--Select--</option>";
        $('#div_load_forms').html(data);
        $('select.allocate_basis_fields').html(dataAllocate);
        
        $('.chosen-select').chosen();
        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        $('.chosen-select').trigger('chosen:updated');
    }
    else{
        LoadForms(val,'');
    }
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

    var form_id = $('#form_id').val();

    field_data['current_field'] = field;
    field_data['form_id']       = form_id;

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
                    for (var lkey in json['option']) {
                        selectedOption="";
                        if(selected.indexOf(lkey + ";;;"+json['option'][lkey])!== -1){
                            selectedOption=" selected ";
                        }
                        if(type === 'predefined_dropdown' || type === 'dropdown'){
                            html += '<option value="' + lkey + ";;;"+json['option'][lkey]+'"'+selectedOption+'>' + json['option'][lkey] + '</option>';
                        }else{
                            html += '<option value="' + lkey + '"'+selectedOption+'>' + json['option'][lkey] + '</option>';
                        }
                    }

                    if(jQuery(currentObj).parents('.block-repeat').find('.' + field).length > 0){
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

function disabledAlreadyUsedAllocateField(){
    var alreadySelected = [];
    var alloct  = $('[name="allocate_basis_fields[fields][]"]').serializeArray();
    for(var i in alloct){
       alreadySelected.push(alloct[i].value);
    }

    alreadySelected = removeDuplicates(alreadySelected);
    $('select.allocate_basis_fields').each(function(){
        $(this).find('option').prop('disabled', false);
        var aa = JSON.parse(JSON.stringify(alreadySelected));
        var tmpAlredySelected = aa;
        var curval = $(this).val();
        var delid = tmpAlredySelected.indexOf(curval);
        delete tmpAlredySelected[delid];

        jQuery(this).find('option').each(function () {
           if($(this).attr('value')!='' && tmpAlredySelected.indexOf($(this).attr('value'))>-1){
               $(this).prop('disabled',true);
           }
       });
        $('.chosen-select').chosen();
        $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
        $('.chosen-select').trigger('chosen:updated');
    });
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
    $('.chosen-select').trigger('chosen:updated');
}