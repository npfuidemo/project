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

//Save Counsellor config section data
function SaveSectionData(Section) {
    // loader
    $('#CollegeConfigurationSection .loader-block').show();
    // serialize all form data
    var data = $('#' + Section).serialize();
    $.ajax({
        url: '/users/saveCounsellorConfig/' + jsVars.CounsellorConfigurationString,
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            //$('#graphStatsLoaderConrainer').show();
        },
        complete: function () {
            // hide loader
            $('#CollegeConfigurationSection .loader-block').hide();
        },
        success: function (json) {
            $('span.lead_error').html('').hide();
            if (json['redirect']) {
                // if session is out
                location = json['redirect'];
            } else if (json['error']) {
                // error display in popup
                alertPopup(json['error'], 'error');
            } else if (typeof json['error_text'] != 'undefined' && json['error_text'] != '') {
//                error display in logic builder's fields
                for (var i in json['error_text']) {
                    // form id found in Application manager counsellor logic builder
                    if (typeof json['form_id'] != 'undefined' && json['form_id'] != '') {
                        var form_id = json['form_id'] + '_';
                    } else {
                        // for lms logic builder form id is blank
                        var form_id = '';
                    }
                    for (var j in json['error_text'][i]) {
                        if (json['error_text'][i][j] == 1) {
//                            console.log('#errorlead_'+i+'_'+j);
                            // display error inline
                            $('#errorlead_' + form_id + i + '_' + j).show().html('Error!!');
                        }
                    }
                }
            } else if (json['success'] == 200) {
                alertPopup(json['Msg'], 'Success');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

//Set Width dynamically to all select box where .default class is found
$(document).ready(function () {
    $("li.search-field > input.default").css("width", "250px");
});

/**
 * add more or remove function for config
 * @var object elem
 * @var int form_id
 **/

function addMoreApplCondition(elem, form_id) {
    var div_class = 'form' + form_id;
    var stgClone = jQuery(elem).closest('.' + div_class + '>div').eq(0).clone();

    // remove chosen select container
    jQuery(stgClone).find('.chosen-container').remove();

    // add delete button
    jQuery(stgClone).find('.removeElementClass').html('<a href="#" class="text-danger" onclick="return confirmDelete(this,' + form_id + ',\'condition\');"><i class="fa fa-minus-circle fa-2x" aria-hidden="true"></i></a>');

    // reset all select box value
    jQuery(stgClone).find('select').val('');

    // blank textbox value
    jQuery(stgClone).find('input').attr('placeholder', 'Input Value').val('');

    // remove hidden for autocomplete
    jQuery(stgClone).find('.sel_value_hidden').remove();
    jQuery(stgClone).find('.typeahead').remove();
    jQuery(stgClone).find('.lead_error, .error').remove();

    // hide type(condition) fields and value fields
    jQuery(stgClone).find('.field_value_div>div').hide();
    jQuery(stgClone).find('.field_value_condition>div').hide();

    // get block number
    var obj_name = jQuery(stgClone).find('select.sel_field').attr('name');
    var re = /\d+(?:\]\[)/gi;
    // calculate error span id
    if (form_id > 0) {
        var block_num = obj_name.match(re)[1].replace('][', '');
        var error_span = 'errorlead_' + form_id + '_' + block_num + '_1';
    } else {
        var block_num = obj_name.match(re)[0].replace('][', '');
        var error_span = 'errorlead_' + block_num + '_1';
    }
    // add error span
    jQuery(stgClone).append('<span class="col-md-12 lead_error" id="' + error_span + '"></span>');
    // append clone object
    jQuery(elem).closest('.' + div_class).append(stgClone);

    var stage_count = 0;
    // reset stage count

    jQuery(elem).parents('.block_first').find('.' + div_class + '>div').each(function () {

        var fields_name = $(this).find('.sel_field').attr('name').replace(/\[[\d]\]\[fields\]/gi, "[" + stage_count + "][fields]");
        $(this).find('.sel_field').attr('name', fields_name);

        var fields_name = $(this).find('.sel_type').attr('name').replace(/\[[\d]\]\[types\]/gi, "[" + stage_count + "][types]");
        $(this).find('.sel_type').attr('name', fields_name);

        var fields_name = $(this).find('.sel_value').attr('name').replace(/\[[\d]\]\[values\]/gi, "[" + stage_count + "][values]");
        $(this).find('.sel_value').attr('name', fields_name);

        if (typeof $(this).find('.sel_value_hidden').attr('name') != 'undefined') {
            var fields_name = $(this).find('.sel_value_hidden').attr('name').replace(/\[[\d]\]\[values_id\]/gi, "[" + stage_count + "][values_id]");
            $(this).find('.sel_value_hidden').attr('name', fields_name);
        }
//
        if (typeof $(this).find('.lead_error') != 'undefined') {
            var fields_name = $(this).find('.lead_error').attr('id').replace(/\d$/gi, stage_count);
            $(this).find('.lead_error').attr('id', fields_name);
        }
        stage_count++;
    });
    jQuery('.chosen-select').chosen();
    return false;
}

/**
 * remove condition field, operation and value
 * @param object elem
 * @param int form_id
 * @returns {Boolean}
 */
function removeApplCondition(elem, form_id) {
    var div_class = 'form' + form_id;
    var cond_block = jQuery(elem).parents('.block_first');
    $(elem).closest('.row').remove();
    var stage_count = 0;
    // reset stage count
    //application_allocation_conditions[0][0][fields]

    cond_block.find('.' + div_class + '>div').each(function () {
        // reset array number after delete
        var fields_name = $(this).find('.sel_field').attr('name').replace(/\[[\d]\]\[fields\]/gi, "[" + stage_count + "][fields]");
        $(this).find('.sel_field').attr('name', fields_name);

        var fields_name = $(this).find('.sel_type').attr('name').replace(/\[[\d]\]\[types\]/gi, "[" + stage_count + "][types]");
        $(this).find('.sel_type').attr('name', fields_name);

        var fields_name = $(this).find('.sel_value').attr('name').replace(/\[[\d]\]\[values\]/gi, "[" + stage_count + "][values]");
        $(this).find('.sel_value').attr('name', fields_name);

        if (typeof $(this).find('.sel_value_hidden').attr('name') != 'undefined') {
            var fields_name = $(this).find('.sel_value_hidden').attr('name').replace(/\[[\d]\]\[values_id\]/gi, "[" + stage_count + "][values_id]");
            $(this).find('.sel_value_hidden').attr('name', fields_name);
        }

        if (typeof $(this).find('.lead_error') != 'undefined') {
            var fields_name = $(this).find('.lead_error').attr('id').replace(/\d$/gi, stage_count);
            $(this).find('.lead_error').attr('id', fields_name);
        }
        stage_count++;
    });

    return false;
}

/**
 * add block in condition logic ajax add_more_block_condition.ctp
 * use in lms, and application manager
 * @param int form_id
 * @param string call_type
 * @returns {Boolean}
 */
//Add more form fields
function addMoreBlockConditionAjax(form_id, call_type) {

    if (form_id !== '') {
        var college_id = jQuery('input[name="college_id"], select[name="college_id"]').val();
        var radio_val;
        if (typeof call_type == 'undefined' || call_type == '') {
            call_type = 'application';
        }
        var index = parseInt($('#form' + form_id + '_block div.block_first').length) + 1;
        if (call_type == 'lead') {
            radio_val = $('#CounsellorLeadConfigContainer  #lead_block_condition').val();
        } else {
            radio_val = $('#CounsellorFormConfigContainer' + form_id + ' #app_block_condition_' + form_id).val();
        }
        //alert(index);
        $.ajax({
            url: '/users/add-more-block-condition',
            type: 'post',
            data: {form_id: form_id, index: index, block_radio: radio_val, 'call_type': call_type, 'college_id': college_id},
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
            },
            complete: function () {
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
                    $('#form' + form_id + '_block').append(Html);
                    $('#form' + form_id + '_block select.chosen-select').chosen();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
    return false;
}

/**
 * remove Application block
 * @param object elem
 * @param string div_class
 * @returns {Boolean}
 */

function removeBlockCondition(elem, form_id) {
    var div_class = 'form' + form_id;
    var regexFieldName = new RegExp('application_allocation_conditions\\[' + form_id + '\\]\\[\\d\\]', 'gi');
    jQuery(elem).closest('.block_first').prev('div.block_criteria').remove();
    jQuery(elem).closest('.block_first').remove();

    var block_count = 0;

    jQuery('#' + div_class + '_block .block_first').each(function () {
        // radio button rename
        jQuery(this).find('input[type="radio"]').each(function () {
            var fields_name = $(this).attr('name').replace(regexFieldName, 'application_allocation_conditions[' + form_id + '][' + block_count + ']');
            $(this).attr('name', fields_name);
        });

        jQuery(this).find('select').each(function () {
            var fields_name = $(this).attr('name').replace(regexFieldName, 'application_allocation_conditions[' + form_id + '][' + block_count + ']');
            $(this).attr('name', fields_name);
        });

        jQuery(this).find('[type="text"]').each(function () {
            if (typeof $(this).attr('name') != 'undefined' && $(this).attr('name') != '') {
                var fields_name = $(this).attr('name').replace(regexFieldName, 'application_allocation_conditions[' + form_id + '][' + block_count + ']');
                $(this).attr('name', fields_name);
            }
        });

        jQuery(this).find('.sel_value_hidden').each(function () {
            if (typeof $(this).attr('name') != 'undefined' && $(this).attr('name') != '') {
                var fields_name = $(this).attr('name').replace(regexFieldName, 'application_allocation_conditions[' + form_id + '][' + block_count + ']');
                $(this).attr('name', fields_name);
            }
        });

        block_count++;
    });
    jQuery('.chosen-select').chosen();
    return false;
}

/**
 * remove lead block
 * @param {type} elem
 * @param {type} div_class
 * @returns {Boolean}
 */

function removeLeadBlockCondition(elem, form_id)
{
    var div_class = 'form' + form_id;
    var regexFieldName = new RegExp('lead_allocation_conditions\\[\\d\\]', 'gi');
    jQuery(elem).closest('.block_first').prev('div.block_criteria').remove();
    jQuery(elem).closest('.block_first').remove();

    var block_count = 0;

    jQuery('#' + div_class + '_block .block_first').each(function () {
        // radio button rename
        jQuery(this).find('input[type="radio"]').each(function () {
            var fields_name = $(this).attr('name').replace(regexFieldName, 'lead_allocation_conditions[' + block_count + ']');
            $(this).attr('name', fields_name);
        });

        jQuery(this).find('select').each(function () {
            var fields_name = $(this).attr('name').replace(regexFieldName, 'lead_allocation_conditions[' + block_count + ']');
            $(this).attr('name', fields_name);
        });

        jQuery(this).find('[type="text"]').each(function () {
            if (typeof $(this).attr('name') != 'undefined' && $(this).attr('name') != '') {
                var fields_name = $(this).attr('name').replace(regexFieldName, 'lead_allocation_conditions[' + block_count + ']');
                $(this).attr('name', fields_name);
            }
        });
        jQuery(this).find('.sel_value_hidden').each(function () {
            if (typeof $(this).attr('name') != 'undefined' && $(this).attr('name') != '') {
                var fields_name = $(this).attr('name').replace(regexFieldName, 'lead_allocation_conditions[' + block_count + ']');
                $(this).attr('name', fields_name);
            }
        });

        block_count++;
    });
    jQuery('.chosen-select').chosen();
    return false;
}

/**
 *
 * @param object elem
 * @param int form_id
 * @param string type
 * @param string call_type
 * @returns {Boolean}
 *
 */
function confirmDelete(elem, form_id, type, call_type) {
    if (typeof call_type == 'undefined' || call_type == '') {
        call_type = 'application';
    }

    $('#ConfirmMsgBody').html('Do you want to delete ' + type + '?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();
                if (type == 'condition') {
                    removeApplCondition(elem, form_id);
                } else {
                    if (call_type == 'lead') {
                        removeLeadBlockCondition(elem, form_id);
                    } else {
                        removeBlockCondition(elem, form_id);
                    }
                }
                $('#ConfirmPopupArea').modal('hide');
            });
    return false;
}


function loadApplicationAllocConfig(call_type, form_id) {
    $('#CollegeConfigurationSection .loader-block').show();
    if (typeof form_id == 'undefined' || form_id == '') {
        form_id = 0;
    }
    if (typeof call_type == 'undefined' || call_type == '') {
        call_type = 'application';
        $('#lead_accordion_body #form0_block').html('');
    }
    if (call_type == 'lead') {
//        $('#collapseAppAllocConfig .form_logic_block').html('');
    }

    $.ajax({
        url: '/users/load-application-alloc-config/' + jsVars.CounsellorConfigurationString,
        type: 'post',
        data: {'form_id': form_id, 'call_type': call_type},
        dataType: 'html',
        async: false,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#CollegeConfigurationSection .loader-block').show();
        },
        complete: function () {

        },
        success: function (html) {
            if (html === 'session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (html === 'error') {
                alertPopup('Parameter missing!', 'error');
            } else {
                if ('application' == call_type) {
                    $('#aac_add_more_' + form_id).show();
                    $('#button_aac_form_' + form_id).show();
                    $('#accordion_body_' + form_id + ' #form' + form_id + '_block').html(html);
                } else {
                    $('#button_lead_form').show();
                    $('#lead_accordion_body #form0_block').html(html);
                }
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                $('.chosen-select').trigger('chosen:updated');
            }
            $('#CollegeConfigurationSection .loader-block').hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

//field_value_div
function createInputApplicationCounsellorConfig(currentObj, selected, typeselected) {
    if (typeof selected == 'undefined') {
        selected = '';
    }
    if (typeof typeselected == 'undefined') {
        typeselected = '';
    }
    var cur_elem_name = $(currentObj).attr('name');
    var cur_val_name = cur_elem_name.replace('[fields]', '[values]');
    var cur_type_name = cur_elem_name.replace('[fields]', '[types]');

    var labelname = 'Select Option'; //$(currentObj).data('label_name');
//    var InputId     = $(currentObj).attr('id');
//    var key_source  = $(currentObj).data('key_source');
    var value_field = $(currentObj).val();
    var arr = value_field.split("||");
    var html = '';
    var type = "";
    var class_date = '';
    var multSelectFields = [];
    var multiValue = false;
    var fieldLabelmapping = {'ud|country_id': "Country", 'ud|state_id': "State", 'ud|city_id': "City", 'ud|course_id': "Course"
        , 'ud|specialization_id': "Specialization", 'ud|university_id': "Campus", 'ud|district_id': "District"};
    
    var dependentParentKey = '';var currentFieldLabel = '';var childFieldLabel = '';var dependentStageKey = '';
    var parentFieldKey = '';var childFieldKey = '';
    var parentField = '';var childField = '';
    var registrationDependentData = jsVars.registrationDependentData;
    
    var flatDependentFieldList = Object.keys(registrationDependentData).reduce(function (r, k) {
        return r.concat(k, registrationDependentData[k]);
    }, []);
    
    if (arr.length > 2) {
        if ($.trim($("#muli_select_fields").val()) !== '' && $("#muli_select_fields").val() !== null) {
            multSelectFields = JSON.parse($("#muli_select_fields").val());
        }
        var type = arr[1];
        var val_json = arr[2];
        var html_field_id = '';
        // for not break ajax on created by, ID CreatedBySelect
        html_field_id = arr[0];
        var fieldKey = html_field_id.split("|");
        console.log("html_field_id:",html_field_id);
        var sls = false;
        if (type == "dropdown" || type == "predefined_dropdown" || type == "select") {
            if ('pub|publisher_id' == html_field_id) {
                html = "<select class='chosen-select publisher_filter sel_value' name='" + cur_val_name + "'>";
            } else if ('campu|traffic_channel' == html_field_id) {
                multiValue = true;
                html = "<select class='traffic_channel sel_value multi-dynamic " + html_field_id + "' multiple='multiple' name='" + cur_val_name + "[]'>";
            } else if ('u|registration_instance' == html_field_id) {
                html = "<select class='chosen-select registration_instance sel_value' name='" + cur_val_name + "'>";
            } else if ('ap|payment_status' == html_field_id) {
                html = "<select class='chosen-select payment_status sel_value' name='" + cur_val_name + "'>";
            } else if ('ap|payment_method' == html_field_id) {
                html = "<select class='chosen-select payment_method sel_value' name='" + cur_val_name + "'>";
            } else if ('ud|lead_stage' === html_field_id) {
                multiValue = true;
                childField = 'lead_sub_stage';
                html = "<select class=' sel_value multi-dynamic " + html_field_id + "' multiple='multiple' name='" + cur_val_name + "[]'  onchange = \"return getLeadSubstage(this,\'"+fieldKey[0]+"\\\\|"+childField+"\','lead_stage');\">";
            } else if ('fd|application_stage' === html_field_id) {
                if (selected.indexOf('[') === -1) {
                    selected = '["'+selected+'"]';
                }
                multiValue = true;
                childField = 'application_sub_stage';
                html = "<select class=' sel_value multi-dynamic " + html_field_id + "' multiple='multiple' name='" + cur_val_name + "[]'  onchange = \"return getLeadSubstage(this,\'fde\\\\|"+childField+"\','application_stage');\">";
            }else if ($.inArray(html_field_id, multSelectFields) !== -1) {
                multiValue = true;
                
                if ('ud|lead_sub_stage' === html_field_id) {
                    childFieldKey = parentFieldKey = fieldKey[0];
                    parentField = fieldKey[1];
                    dependentStageKey = 'lead_stage';
                }
                if ('fde|application_sub_stage' === html_field_id) {
                    parentFieldKey = 'fd';
                    childFieldKey = fieldKey[0];
                    parentField = fieldKey[1];
                    dependentStageKey = 'application_stage';
                }
                
                if (typeof registrationDependentData != 'undefined' && $.inArray(fieldKey[1], flatDependentFieldList) !== -1) {
                    //get child key
                    childFieldKey = parentFieldKey = fieldKey[0];
                    childField = registrationDependentData[fieldKey[1]];

                    //get parent key
                    for (var prop in registrationDependentData) {
                        if(registrationDependentData[prop] === fieldKey[1]){
                          dependentParentKey = prop;
                          parentField = fieldKey[1];
                          break;
                        }
                    }

                    if (typeof jsVars.fieldLabelMapping[html_field_id] !== 'undefined') {
                        currentFieldLabel = jsVars.fieldLabelMapping[html_field_id];
                    }else{
                        currentFieldLabel = 'Select Field';
                    }

                    if (typeof jsVars.fieldLabelMapping[childFieldKey+"|"+childField] !== 'undefined') {
                        childFieldLabel = jsVars.fieldLabelMapping[childFieldKey+"|"+childField];
                    }else{
                        childFieldLabel = 'Select Field';
                    }
                }
                
                if(typeof childField !== "undefined" && childField !== ''){
                    html = "<select class=' sel_value multi-dynamic " + html_field_id + "' multiple='multiple' name='" + cur_val_name + "[]'  onchange = \"return GetChildForDependentField(this,\'"+childFieldKey+"\\\\|"+childField+"\',\'"+childFieldLabel+"\');\">";
                }else{
                    html = "<select class=' sel_value multi-dynamic " + html_field_id + "' multiple='multiple' name='" + cur_val_name + "[]'>";
                }
            } else  if (typeof registrationDependentData != 'undefined' && $.inArray(fieldKey[1], flatDependentFieldList) !== -1) {
                //get child key
                childFieldKey = parentFieldKey = fieldKey[0];
                childField = registrationDependentData[fieldKey[1]];
                
                //get parent key
                for (var prop in registrationDependentData) {
                    if(registrationDependentData[prop] === fieldKey[1]){
                      dependentParentKey = prop;
                      parentField = fieldKey[1];
                      break;
                    }
                }
                
                if (typeof jsVars.fieldLabelMapping[html_field_id] !== 'undefined') {
                    currentFieldLabel = jsVars.fieldLabelMapping[html_field_id];
                }else{
                    currentFieldLabel = 'Select Field';
                }
                
                if (typeof jsVars.fieldLabelMapping[childFieldKey+"|"+childField] !== 'undefined') {
                    childFieldLabel = jsVars.fieldLabelMapping[childFieldKey+"|"+childField];
                }else{
                    childFieldLabel = 'Select Field';
                }
                
                if(typeof childField !== "undefined" && typeof childField !== ''){
                    html = "<select class='chosen-select sel_value " + html_field_id + "' name='" + cur_val_name + "' onchange = \"return GetChildForDependentField(this,\'"+childFieldKey+"\\\\|"+childField+"\',\'"+childFieldLabel+"\');\">";
                }else{
                    html = "<select class='chosen-select sel_value " + html_field_id + "' name='" + cur_val_name + "'>";
                }
            }else {
                html = "<select class='chosen-select sel_value " + html_field_id + "' name='" + cur_val_name + "'>";
            }
            if ('s_lead_status' != html_field_id && 'show_campaigns_in' != html_field_id && !multiValue) {
                html += '<option value="">' + labelname + '</option>';
            }

            if ($.inArray(html_field_id, ['ud|country_id', 'ud|state_id', 'ud|city_id', 'ud|course_id', 'ud|specialization_id', 'ud|university_id', 'ud|district_id']) >= 0) {
                if (typeof jsVars.fieldLabelMapping[html_field_id] != 'undefined') {
                    html += '<option value="0">' + jsVars.fieldLabelMapping[html_field_id] + jsVars.notAvailableText + ' </option>';
                } else {
                    html += '<option value="0">' + fieldLabelmapping[html_field_id] + ' Not Available </option>';
                }
            }
            var obj_json = (val_json != '') ? JSON.parse(val_json) : [];
            for (var key in obj_json) {
                //default select pri registration in registration instance
                var select = '';
                if (key == 'pri_register_date') {
                    select = 'selected';
                }
                if (typeof obj_json[key] == 'object') {
                    html += '<optgroup label="' + key + '">';
                    for (var key2 in obj_json[key]) {
                        if ('predefined_dropdown' === type) {
                            var jsonValue = key2 + ';;;' + obj_json[key][key2];
                        } else {
                            var jsonValue = key2;
                        }
                        html += "<option " + select + " value=\"" + jsonValue + "\">" + obj_json[key][key2] + "</option>";
                    }
                    html += '</optgroup>';
                } else {
                    if ('predefined_dropdown' === type) {
                        var jsonValue = key + ';;;' + obj_json[key];
                    } else {
                        var jsonValue = key;
                    }
                    html += "<option " + select + " value=\"" + jsonValue + "\">" + obj_json[key] + "</option>";
                }
            }
            html += "</select>";

            if (html_field_id == 'payment_status') {
                updateOperator('payment_dropdown', cur_type_name, typeselected, arr, multiValue );
            }
            else {
                if ('predefined_dropdown' == type) {
                    updateOperator('predefined_dropdown', cur_type_name, typeselected, arr, multiValue);
                } else {
                    updateOperator('dropdown', cur_type_name, typeselected, arr, multiValue);
                }
            }

        } else if (type == "date") {
            if (jQuery("[name='" + cur_type_name + "']").val() == 'between') {
                class_date = "daterangepicker_report";
            } else {
                class_date = "datepicker_report";
            }

            html = "<input type='text' class='form-control sel_value " + class_date + "' name='" + cur_val_name + "' value='' readonly='readonly' placeholder='" + labelname + "' id='" + html_field_id + "'>";
            updateOperator('date', cur_type_name, typeselected, arr, multiValue);
        }
        else if (type == "text_string") {
            html = "<input type='text' class='form-control sel_value' name='" + cur_val_name + "' value='' placeholder='" + labelname + "' id='" + html_field_id + "'>";
                updateOperator('text_string', cur_type_name, typeselected, arr, multiValue);
        }
        else if (type == "paragraph") {
            html = "<input type='text' class='form-control sel_value' name='" + cur_val_name + "' value='' placeholder='" + labelname + "' id='" + html_field_id + "'>";
            updateOperator('paragraph', cur_type_name, typeselected, arr, multiValue);
        } 
        else {
            html = "<input type='text' class='form-control sel_value' name='" + cur_val_name + "' value='' placeholder='" + labelname + "' id='" + html_field_id + "'>";
            updateOperator('text', cur_type_name, typeselected, arr, multiValue);
        }
    } else {
        html = "<input type='text' class='form-control sel_value' name='" + cur_val_name + "' value='" + selected + "' placeholder='" + labelname + "'>";
        updateOperator('text', cur_type_name, typeselected, arr, multiValue);
    }

    var multi_class = '';
    if (sls) {
        multi_class = 'multiSelectBox';
    }
    // finally show the field in DOM
    if (html) {
//        console.log($('#u|device').val());

        if (typeof type != "" && type == 'date') {
            html = '<div class="dateFormGroup' + multi_class + '"><div class="iconDate"><i aria-hidden="true" class="fa fa-calendar-check-o"></i></div><div class="input text">' + html + '</div></div>';
        } else {
            html = '<div class="' + multi_class + '">' + html + '</div>';
        }
        var finalhtml = html;
        if ($("[name='" + cur_val_name + "']").parents('.field_value_div').length > 0) {
            $("[name='" + cur_val_name + "']").parents('.field_value_div').html(finalhtml);
        }
        if ($("[name='" + cur_val_name + "[]']").parents('.field_value_div').length > 0) {
            $("[name='" + cur_val_name + "[]']").parents('.field_value_div').html(finalhtml);
        }
    }
    
    if(dependentParentKey !== ''){
        GetChildForDependentField($("."+parentFieldKey+"\\|"+dependentParentKey+""), childFieldKey+"\\|"+parentField, currentFieldLabel);
    }
    if(dependentStageKey !== ''){
        getLeadSubstage($("."+parentFieldKey+"\\|"+dependentStageKey+""), childFieldKey+"\\|"+parentField,dependentStageKey);
    }
    
    // sync value
    if (selected == '' && ('campu|publisher_id' == html_field_id || 'pub|publisher_id' == html_field_id)) {
        /// load value from
        var channel_val = $('.traffic_channel').last().val();
        populatePublisherReferrers(currentObj, [], channel_val);
    }
    
    if (selected == '' && 'campu|source_value' == html_field_id) {
        /// load value from
        var pub_val = $("[name='" + cur_val_name + "']").parents('div.block_first').find('.campu\\|publisher_id').last().val();
        if (typeof pub_val != 'undefined' && pub_val != '') {
            var pub_val_ar = pub_val.split('___');
            pub_val = pub_val_ar[0];
            getCompaignsSourceConfig(currentObj, pub_val);
        } else if ($("[name='" + cur_val_name + "']").parents('div.block_first').find('.publisher_filter').last().val()) {
            // application manager
            var pub_val = $("[name='" + cur_val_name + "']").parents('div.block_first').find('.publisher_filter').last().val();
            if (typeof pub_val != 'undefined' && pub_val != '') {
                var pub_val_ar = pub_val.split('___');
                pub_val = pub_val_ar[0];

                if($(currentObj).parents('.block_first').find('.campap\\|conversion_source_value').length>0) {
                    getCompaignsSourceConfig(currentObj, pub_val, '', 'campap\\|conversion_source_value');
                }
                else{
                    getCompaignsSourceConfig(currentObj, pub_val);
                }
            }
        }
    }

    if (selected == '' && 'campu|medium_value' == html_field_id) {

        /// load value from
        var source_val_arr = $('.campu\\|source_value').last().val();
        if(typeof source_val_arr !== 'undefined' && source_val_arr !== '' && source_val_arr != null){
            $.each(source_val_arr, function(k, source_val){
                if(typeof source_val !== 'undefined' && source_val !== ''){
                    var source_val_ar = source_val.split('___');
                    source_val = source_val_ar[0];
                    if(html_field_id === 'campap|conversion_medium_value'){
                        getCompaignsMediumConfig(currentObj, source_val, '', 'campap\\|conversion_medium_value');
                    }else{
                        getCompaignsMediumConfig(currentObj, source_val);
                    }
                    
                }
            });
            appendFlag = 0;
        }

    }

    if (selected == '' && 'campu|name_value' == html_field_id) {
        /// load value from
        appendFlag = 0; 
        var medium_val = $('.campu\\|medium_value').last().val();
        if(medium_val !== null && medium_val !== ''){
            for (var ii in medium_val) {
                var source_value = medium_val[ii];
                if(typeof source_value !== 'undefined' && source_value !== ''){
                    var source_name_ar = source_value.toString().split('___');
                    source_value = source_name_ar[0];
                }
                var sel_mvalue = '';
                getCompaignsNameConfig(currentObj, source_value, sel_mvalue);
            }
        }
    }

    //******** application **************/

    if (selected == '' && 'campap|conversion_source_value' == html_field_id) {
        /// load value from
        var pub_val = $("[name='" + cur_val_name + "']").parents('div.block_first').find('.publisher_filter').last().val();
        if (typeof pub_val != 'undefined' && pub_val != '') {
            var pub_val_ar = pub_val.split('___');
            pub_val = pub_val_ar[0];
            getCompaignsSourceConfig(currentObj, pub_val, '', 'campap\\|conversion_source_value');
        }
    }

    if (selected == '' && 'campap|conversion_medium_value' == html_field_id) {

        /// load value from
        var source_val = $("[name='" + cur_val_name + "']").parents('div.block_first').find('.campap\\|conversion_source_value').last().val();
        if (typeof source_val != 'undefined' && source_val != '') {
            var source_val_ar = source_val.split('___');
            source_val = source_val_ar[0];
            var pubId = source_val_ar[1];
            getCompaignsMediumConfig(currentObj, source_val, '', 'campap\\|conversion_medium_value',pubId);
        }
    }

    if (selected == '' && 'campap|conversion_name_value' == html_field_id) {
        /// load value from

        var medium_val = $("[name='" + cur_val_name + "']").parents('div.block_first').find('.campap\\|conversion_medium_value').last().val();

        if (typeof medium_val != 'undefined' && medium_val != '') {
            var medium_val_ar = medium_val.split('___');
            medium_val = medium_val_ar[0];
            getCompaignsNameConfig(currentObj, medium_val, '', 'campap\\|conversion_name_value');
        } else {
            var source_val = $("[name='" + cur_val_name + "']").parents('div.block_first').find('.campap\\|conversion_source_value').last().val();
            if (typeof source_val != 'undefined' && source_val != '') {
                var source_val_ar = source_val.split('___');
                source_val = source_val_ar[0];
                getCompaignsNameConfig(currentObj, source_val, [], 'campap\\|conversion_name_value', 'source_value');
            }
        }
    }

    if ('ud|specialization_id' == html_field_id) {
        GetChildByMachineKeyConfig($(".ud\\|course_id"), "specialization_id", "Specialization");
    }
    
    $("[name='" + cur_val_name + "']").val(selected);
    $('.chosen-select').chosen();
    $('.chosen-select').trigger('chosen:updated');
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    
    if($("[name='" + cur_val_name + "']")[0] && $("[name='" + cur_val_name + "']")[0].sumo ){
        $("[name='" + cur_val_name + "']")[0].sumo.reload();                    
    }
    // hide value div if change is made
    if (multiValue) {
        cur_val_name = cur_val_name + "[]";
    }
    $("[name='" + cur_val_name + "']").parents('.field_value_div>div').hide();

    if (selected == '') {
        // remove hidden field if change is made
        $("[name='" + cur_val_name + "']").parents('div.condition_div').find('.sel_value_hidden').remove();
    }

    // hide condition div if blank
    if (value_field == '') {
        $("[name='" + cur_type_name + "']").parents('.field_value_condition>div').hide();
    } else {
        $("[name='" + cur_type_name + "']").parents('.field_value_condition>div').show();
    }
    if (type == "date") {
        LoadReportDatepicker();
        LoadReportDateRangepicker();
    }
    if (sls) {
        $('#s_lead_status').multiselect({
            numberDisplayed: 2
        });
    }

    if (multiValue) {
        $('select.multi-dynamic').SumoSelect({placeholder: labelname, search: true, searchText: labelname, captionFormatAllSelected: "All Selected.", triggerChangeCombined: true, selectAll: false});
        if (selected != '') {
            if (selected.indexOf('[') === -1) {
                selected = '["'+selected+'"]';
            }
            selected = JSON.parse(selected);
            if (typeof selected != 'object') {
                selected = [selected];
            }
            $.each(selected, function (i, e) {
                $("[name='" + cur_val_name + "']")[0].sumo.selectItem(e);
//                $("[name='" + cur_val_name + "[]']")[0].sumo.selectItem(e);
            });
        }
    }
}

$(document).on('change', 'select.multi-dynamic', function () {
        var selectedValues = $(this).find("option:selected");
        var cur_val_name = $(this).attr('name');
        var cur_type_name = cur_val_name.replace('[values]', '[types]');
        var cur_type_name = cur_type_name.replace('[]', '');
        var type_selected = $("[name='" + cur_type_name + "']").val();
        if(type_selected === 'contains' || type_selected === 'not_contains'){
            $("[name='" + cur_val_name + "']").find("option").prop("disabled", true);
            if(selectedValues.length > 0){
                selectedValues.each(function(){
                    var optionval = $(this).val();
                    $("[name='" + cur_val_name + "']").find("option[value='" + optionval + "']").removeAttr("disabled");
                });
            }else{
                $("[name='" + cur_val_name + "']").find("option").prop("disabled", false);
            }
            $("[name='" + cur_val_name + "']")[0].sumo.reload();
        }else{
            $("[name='" + cur_val_name + "']").find("option").prop("disabled", false);
        }
});

function checkConditionType(elem,editFlag = false) {
    var val = $(elem).val();
    var name = $(elem).attr('name');
    var cur_val_name = name.replace('[types]', '[values]');
    var multiple = $("select[name='" + cur_val_name + "[]'][multiple]").length;
    var fieldName = "[name='" + cur_val_name + "']";
    if (multiple) {
        fieldName = "[name='" + cur_val_name + "[]']";
        cur_val_name = cur_val_name + "[]";
    }
    var selected = $("" + fieldName).val();
    
    if(editFlag === false){
        selected = '';
        $("[name='" + cur_val_name + "']").find("option").prop("disabled", false);
    }
    
    jQuery("[name='" + cur_val_name + "']").removeAttr('disabled');
    $("[name='" + cur_val_name + "']").removeAttr("oninput");

    if ($("" + fieldName).parents('.field_value_div').length > 0) {

        if ('Select Condition' == val || '' == val) {
            $("" + fieldName).parents('.field_value_div>div').hide();
            // if hide then selected value reset
            selected = '';
        } else {
            $("" + fieldName).parents('.field_value_div>div').show();
        }
    }
    var dateFieldHtml = '';
    var dateFieldId = '';
    if ($.inArray(val, ['between', 'before', 'after', 'ago']) !== -1) {
        if ($("[name='" + cur_val_name + "']").parents('.dateFormGroup').length === 0) {
            dateFieldId = $("[name='" + cur_val_name + "']").attr('id');
            dateFieldHtml = "<input type='text' class='form-control sel_value datepicker_report' name='" + cur_val_name + "' value='' readonly='readonly' placeholder='Select Option' id='" + dateFieldId + "'>";
            dateFieldHtml = '<div class="dateFormGroup"><div class="iconDate"><i aria-hidden="true" class="fa fa-calendar-check-o"></i></div><div class="input text">' + dateFieldHtml + '</div></div>';
            if ($("[name='" + cur_val_name + "']").parents('.field_value_div').length > 0) {
                $("[name='" + cur_val_name + "']").parents('.field_value_div').html(dateFieldHtml);
            }
        }
    }


    if (val == 'between') {
        jQuery('.datepicker,.daterangepicker').remove();

        jQuery("[name='" + cur_val_name + "']").val('');
//        jQuery("[name='"+cur_val_name+"']").attr('class','').addClass('daterangepicker_report');
        jQuery("[name='" + cur_val_name + "']").removeClass('datepicker_report').addClass('daterangepicker_report');
        jQuery("[name='" + cur_val_name + "']").datepicker('remove');
        $("" + fieldName).val(selected);

    } else if (val == 'before' || val == 'after') {
        jQuery('.datepicker,.daterangepicker').remove();
        jQuery("[name='" + cur_val_name + "']").val('');
//        jQuery("[name='"+cur_val_name+"']").attr('class','').addClass('datepicker_report');
        jQuery("[name='" + cur_val_name + "']").removeClass('daterangepicker_report').addClass('datepicker_report');
        $("" + fieldName).val(selected);
    } else if (val === 'ago') {
        $("[name='" + cur_val_name + "']").val('');
        dateFieldId = $("[name='" + cur_val_name + "']").attr('id');
        var html = "<input type='text' id='" + dateFieldId + "' class='form-control sel_value' name='" + cur_val_name + "' value='' placeholder='Enter number of day'>";
        var finalhtml = '<div class="">' + html + '<span id="' + dateFieldId + '_info" class="info">(eg. 5d, 10h)</span></div>';
        if ($("[name='" + cur_val_name + "']").parents('.field_value_div').length > 0) {
            $("[name='" + cur_val_name + "']").parents('.field_value_div').html(finalhtml);
        }
        $("" + fieldName).val(selected);

    }else if (val === 'empty' || val === 'not_empty') {
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
        jQuery("[name='" + cur_val_name + "']").removeClass('datepicker_report datetimepicker_report daterangepicker_report date_time_rangepicker_report');
        jQuery("[name='" + cur_val_name + "']").datepicker('remove');
        
        jQuery("[name='" + cur_val_name + "']").attr('disabled',true);
        if($("[name='" + cur_val_name + "']")[0] && $("[name='" + cur_val_name + "']")[0].sumo){ 
            $("[name='" + cur_val_name + "']")[0].sumo.reload();
        }
        
    }
    else{
        if(selected === 'empty' || selected === 'not_empty'){
            selected = '';
        }else{
            $("[name='" + cur_val_name + "'] option[value='Not Empty']").remove();  
            $("[name='" + cur_val_name + "'] option[value='Empty']").remove(); 
        }
        $("" + fieldName).val(selected);
        if($("[name='" + cur_val_name + "']")[0] && $("[name='" + cur_val_name + "']")[0].sumo){
            $("[name='" + cur_val_name + "']")[0].sumo.reload();
        }
    }
    LoadReportDatepicker();
    LoadReportDateRangepicker();
    $('.chosen-select').chosen();
    $('.chosen-select').trigger('chosen:updated');

//    return false;
}

function GetChildByMachineKeyConfig(elem, ContainerId, Choose, select_name_value) {

    var labelMappingArray = {'City': 'ud|city_id', 'State': 'ud|state_id', 'Course': 'ud|course_id', 'Specialisation': 'ud|specialization_id', 'Specialization': 'ud|specialization_id', 'District': 'ud|district_id'};
    if (elem && ContainerId) {
        var key = $(elem).val();
        if (typeof select_name_value == 'undefined') {
            select_name_value = [];
        }
        if (ContainerId == 'specialization_id') {
            ContainerId = 'ud\\|specialization_id';
        }
        else if (ContainerId == 'course_id') {
            ContainerId = 'ud\\|course_id';
        }
        $.ajax({
            url: '/common/GetChildByMachineKeyForRegistration',
            type: 'post',
            dataType: 'json',
            data: {key: key},
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
                        var html = '';
//                    if ($.inArray(Choose, ['City', 'State', 'Course', 'Specialization', 'Specialisation', 'District']) >= 0) {
//                        var html = '<option value="">Registered ' + jsVars.fieldLabelMapping[labelMappingArray[Choose]] + '</option>';
//                    } else {
//                        var html = '<option value="">Registered ' + Choose + '</option>';
//                    }
                    if ((Choose == 'State') && ($(elem).parents('.block_first').find('.cityid').length > 0))
                    {
                        $(elem).parents('.block_first').find('.cityid').html('<option value="">Registered City</option>');
                    }

                    var default_val = select_name_value[$(elem).parents('.block_first').find('.' + ContainerId).attr('name')];
                    if ($.inArray(Choose, ['City', 'State', 'Course', 'Specialization', 'Specialisation', 'District']) >= 0) {
                        if (typeof jsVars.fieldLabelMapping[labelMappingArray[Choose]] != 'undefined') {
                            html += '<option value="0">' + jsVars.fieldLabelMapping[labelMappingArray[Choose]] + jsVars.notAvailableText + ' </option>';
                        } else {
                            html += '<option value="0">' + Choose + ' Not Available </option>';
                        }
                    }
                    for (var key in json['list']) {
                        if (key == default_val) {

                            html += '<option value="' + key + '" selected="selected">' + json['list'][key] + '</option>';
                        } else {
                            html += '<option value="' + key + '">' + json['list'][key] + '</option>';
                        }
                    }
                    $(elem).parents('.block_first').find('.' + ContainerId).html(html);
                    
                    //set black dropdown in all sub childs for dependent fields
                    var registrationDependentData = jsVars.registrationDependentData;
                    if (registrationDependentData) {
                        var depandentContainerId = '';
                        var childField = ContainerId.split('|'); 
                        for (var prop in registrationDependentData) {
                            if(registrationDependentData[prop] === childField[1]){
                                depandentContainerId = childField[0] + "|" + childField[1];
                                if(depandentContainerId !== ContainerId){
                                    $(elem).parents('.block_first').find('.' + depandentContainerId).html('');
                                }
                                childField[1] = registrationDependentData[childField[1]];
                            }
                        }
                    }
                    

                    $('.chosen-select').chosen();
                    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                    $('.chosen-select').trigger('chosen:updated');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
    return false;
}

/**
 * function: Get All Publisher of a College
 * @param {type} CollegeId
 * @returns {undefined}
 */

function getPublisherListConfig(elem, select_name_value, class_name, tchannel)
{
    var college_id = $(elem).parents().find('input[name="college_id"], select[name="college_id"]').val();
    var instance_val = $(".registration_instance").val();
    if(typeof instance_val == 'undefined' || instance_val == null || instance_val == ''){
        instance_val = 'pri_register';
    }
    
//     var college_id = jQuery('input[name="college_id"]').val();

    if (typeof select_name_value == 'undefined') {
        select_name_value = [];
    }
    if (typeof tchannel == 'undefined'  || tchannel == null) {
        tchannel = $(elem).val();
    }
    if (typeof class_name == 'undefined' || class_name == '') {
        class_name = 'campu\\|publisher_id';
    }
    var htmlOption = '';
    
    if (college_id) {
        $.ajax({
            url: '/campaign-manager/get-publisher-list',
            type: 'post',
            data: {'college_id': college_id, 'traffic_channel': tchannel,'instance_val':instance_val},
            dataType: 'html',
            async: false,
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json)
            {
                var responseObject = $.parseJSON(json);
                if(responseObject.status === 1) {
                    if(typeof responseObject.data.sourceList === "object"){
                        
                        var sourceList    = responseObject.data.sourceList;
                        $.each(sourceList, function (index, item) {
                            htmlOption +='<option value="'+index+'">'+item+'</option>';
                        });
                        
                        var publisher_id = select_name_value[$(elem).parents('.block_first').find('.' + class_name).attr('name')];
                        if(appendFlag == 0){
                            $(elem).parents('.block_first').find('.' + class_name).html(htmlOption);
                            appendFlag = 1;
                        }else{
                            $(elem).parents('.block_first').find('.' + class_name).append(htmlOption);
                        }
                        if (typeof publisher_id != 'undefined' && publisher_id !== null && publisher_id != "") {
                            $(elem).parents('.block_first').find('.' + class_name).val(publisher_id);
                        }
                        $(elem).parents('.block_first').find('.' + class_name).trigger('chosen:updated');
                        
                        if($(elem).parents('.block_first').find('.' + class_name)[0] && $(elem).parents('.block_first').find('.' + class_name)[0].sumo ){
                            $(elem).parents('.block_first').find('.' + class_name)[0].sumo.reload();                    
                        }
                    }
                }
                else {
                    if (responseObject.message === 'session') {
                        location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                    }
                    else {
                        console.log(responseObject.message);
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    } else {
        $(elem).parents('.block_first').find('.' + class_name).html('<option value="">Publisher Name</option>');
        $(elem).parents('.block_first').find('.' + class_name).trigger('chosen:updated');
    }
}

/**
 * @param {object} elem
 * @param {int} getvalue
 * @param {int} college_id
 * @param {int} default_value
 * @returns {Boolean}
 */

function getCompaignsSourceConfig(elem, getvalue, select_name_value, class_name) {

    if (typeof getvalue == "undefined" || getvalue == "") {
        return false;
    }
    if (typeof select_name_value == 'undefined') {
        select_name_value = [];
    }

    if (typeof class_name == 'undefined' || class_name == '') {
        class_name = 'campu\\|source_value';
    }
    var tfc = $(elem).parents('.block_first').find('.traffic_channel').val();
    if(typeof tfc === 'undefined' || tfc === null){
        tfc = 1;
    }
    
    var default_value = select_name_value[$(elem).parents('.block_first').find('.' + class_name).attr('name')];
    var college_id = $("[name='college_id']").val();
    var htmlOption = '<option value="">Campaign Source</option>';
    var registration_instance = $(elem).parents('.block_first').find('.registration_instance').val();
    if(typeof registration_instance == 'undefined' || registration_instance == null || registration_instance == ''){
        registration_instance = 'pri_register';
    }
    
    if(tfc==3 || tfc == 4 || tfc == 5){
        $(elem).parents('.block_first').find('.' + class_name).html('');
        return false;
    }

    
    $.ajax({
        url: '/campaign-manager/getSourceMediumName',
        type: 'post',
        dataType: 'html',
        async: false,
        data: {'publisherId': getvalue, 'collegeId': college_id, 'trafficChannel': tfc,'instanceType':registration_instance, 'type':'automation'},
//        data: {'get_value': getvalue, 'college_id': college_id, 'default_value': default_value,'registration_instance':instance_val},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {

            var responseObject = $.parseJSON(json);
            if(responseObject.status==1){
                if(typeof responseObject.data.sourceList === "object"){
                    var sourceList    = responseObject.data.sourceList;
                    $.each(sourceList, function (index, item) {
                        htmlOption +='<option value="'+index+'">'+item+'</option>';
                    });
                    
                    if ($(elem).parents('.block_first').find('.' + class_name).length > 0) {
                        $(elem).parents('.block_first').find('.' + class_name).html(htmlOption);
        //                $(elem).parents('.block_first').find('.' + class_name).trigger('chosen:updated');
                        if($(elem).parents('.block_first').find('.' + class_name)[0] && $(elem).parents('.block_first').find('.' + class_name)[0].sumo ){
                            $(elem).parents('.block_first').find('.' + class_name)[0].sumo.reload();
                        }
                    }
                }
            }
            else{
                if (responseObject.message === 'session') {
                    location.reload();
                }
                else {
                    console.log(responseObject.message);
                }
            }
//            getCompaignsMediumConfig(elem, default_value, select_name_value);
//            getCompaignsNameConfig(elem, default_value, select_name_value, '', 'source_value');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

function getCompaignsMediumConfig(elem, getvalue, select_name_value, class_name,publisherId) {
    var htmlOption = '<option value="">Campaign Medium</option>';
    
    var publisher_val = '';
    var default_value = '';
    if (typeof select_name_value == 'undefined') {
        select_name_value = [];
    }
    if (typeof class_name == 'undefined' || class_name == '') {
        class_name = 'campu\\|medium_value';
    }
    if (typeof getvalue == "undefined" || getvalue == 0) {
        if ($(elem).parents('.block_first').find('.' + class_name).length > 0) {
            $(elem).parents('.block_first').find('.' + class_name).html(htmlOption);
            if ($(elem).parents('.block_first').find('.' + class_name)[0] && $(elem).parents('.block_first').find('.' + class_name)[0].sumo) {
                $(elem).parents('.block_first').find('.' + class_name)[0].sumo.reload();
            }
        }
        return false;
    }

    if (class_name == 'campu\\|medium_value') {
        publisher_val = $(elem).parents('.block_first').find(".campu\\|publisher_id.sel_value").val();
        if(typeof publisher_val != ''){
            publisher_val = $(elem).parents('.block_first').find(".publisher_filter").val();
        }
        default_value = select_name_value[$(elem).parents('.block_first').find('.' + class_name).attr('name')];
    } else {
        publisher_val = $(elem).parents('.block_first').find(".publisher_filter").val();
        default_value = select_name_value[$(elem).parents('.block_first').find('.' + class_name).attr('name')];
    }

    if(typeof publisherId !=='undefined' && publisherId != null){
        publisher_val = publisherId;
    }

    var trafficChannelVal = '';
    if($(elem).parents('.block_first').find('.campu\\|traffic_channel').length >= 1){
        trafficChannelVal = $(elem).parents('.block_first').find('.campu\\|traffic_channel').val();
    }

    if(typeof trafficChannelVal !=='undefined' && trafficChannelVal !==null && (trafficChannelVal == 3 || trafficChannelVal == 4 || trafficChannelVal == 5)){
        $(elem).parents('.block_first').find('.' + class_name).html('');
        return false;
    }

//    var registration_instance = 'pri_register';
    var registration_instance = $(elem).parents('.block_first').find('.registration_instance').val();
    if(typeof registration_instance == 'undefined' || registration_instance == null || registration_instance == ''){
        registration_instance = 'pri_register';
    }
    
    var college_id = $("[name='college_id']").val();
    $.ajax({
        url: '/campaign-manager/getSourceMediumName',
        type: 'post',
        dataType: 'html',
        async: false,
        data: {
            'publisherId': publisher_val,
            'collegeId': college_id,
            'trafficChannel':trafficChannelVal,
            'instanceType':registration_instance,
            'source': getvalue,
            'type':'automation'
        },
//        data: {'get_value': getvalue, 'publisher_id': publisher_val, "college_id": college_id, 'default_value': default_value,'registration_instance':registration_instance},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            var responseObject = $.parseJSON(json);
            if(responseObject.status==1){
                if(typeof responseObject.data.mediumList === "object"){
                    var sourceList    = responseObject.data.mediumList;
                    $.each(sourceList, function (index, item) {
                        htmlOption +='<option value="'+index+'">'+item+'</option>';
                    });
                    if ($(elem).parents('.block_first').find('.' + class_name).length > 0) {
                        $(elem).parents('.block_first').find('.' + class_name).html(htmlOption);
                        if ($(elem).parents('.block_first').find('.' + class_name)[0] && $(elem).parents('.block_first').find('.' + class_name)[0].sumo) {
                            $(elem).parents('.block_first').find('.' + class_name)[0].sumo.reload();
                        }
                    }
                }
            }
            else {
                if (responseObject.message === 'session') {
                    location.reload();
                }
                else {
                    console.log(responseObject.message);
                }
            }
            getCompaignsNameConfig(elem, default_value, select_name_value);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

function getCompaignsNameConfig(elem, getvalue, select_name_value, class_name, parent_source) {
    var htmlOption = '<option value="">Campaign Name</option>';
    
    var labelname = 'Select Option';
    $('select.multi-dynamic').SumoSelect({placeholder: labelname, search: true, searchText: labelname, captionFormatAllSelected: "All Selected.", triggerChangeCombined: true, selectAll: false});
    var default_value, publisher_val;

    if (typeof select_name_value == 'undefined') {
        select_name_value = [];
    }
    if (typeof class_name == 'undefined' || class_name == '') {
        class_name = 'campu\\|name_value';
    }
    
    if (typeof getvalue == "undefined" || getvalue == '') {
      
        if ($(elem).parents('.block_first').find('.' + class_name).length > 0) {
            $(elem).parents('.block_first').find('.' + class_name).html(htmlOption);
            $(elem).parents('.block_first').find('.' + class_name)[0].sumo.reload();
        }
        return false;
    }
    
    if (typeof parent_source == 'undefined') {
        parent_source = '';
    }
    if (class_name == 'campu\\|name_value') {
        default_value = select_name_value[$(elem).parents('.block_first').find('.' + class_name).attr('name')];
        publisher_val = $(elem).parents('.block_first').find(".campu\\|publisher_id.sel_value").val();
    } else {
        default_value = select_name_value[$(elem).parents('.block_first').find('.' + class_name).attr('name')];
        publisher_val = $(elem).parents('.block_first').find(".publisher_filter.sel_value").val();
    }

    var registration_instance = $(elem).parents('.block_first').find('.registration_instance').val();
    if(typeof registration_instance == 'undefined' || registration_instance == null || registration_instance == ''){
        registration_instance = 'pri_register';
    }

    var trafficChannelVal = '';
    if($('.campu\\|traffic_channel').length >= 1){
        trafficChannelVal = $('.campu\\|traffic_channel').val();
    }

    if(typeof trafficChannelVal != 'undefined' && trafficChannelVal != null && (trafficChannelVal == 3 || trafficChannelVal == 4 || trafficChannelVal == 5)){
        $(elem).parents('.block_first').find('.' + class_name).html('');
        return false;
    }

    
    var college_id = $("[name='college_id']").val();

    $.ajax({
        url: '/campaign-manager/getSourceMediumName',
        type: 'post',
        dataType: 'html',
        async: false,
        data: {
            'publisherId'   : publisher_val,
            'collegeId'     : college_id,
            'trafficChannel': trafficChannelVal,
            'instanceType'  : registration_instance,
            'medium'        : getvalue,
            'type'          :'automation'
        },
//        data: {'get_value': getvalue, 'publisher_id': publisher_val, 'college_id': college_id, 'default_value': default_value, 'parent_source': parent_source},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            var responseObject = $.parseJSON(json);
            if(responseObject.status==1){
                if(typeof responseObject.data.campaignNameList === "object"){
                    var sourceList    = responseObject.data.campaignNameList    ;
                    $.each(sourceList, function (index, item) {
                        htmlOption +='<option value="'+index+'">'+item+'</option>';
                    });
                    if(appendFlag === 0){
                        appendFlag = 1;
                        $(elem).parents('.block_first').find('.' + class_name).html(htmlOption);
                    }else{
                        $(elem).parents('.block_first').find('.' + class_name).append(htmlOption);
                    }
                    
                    if ($(elem).parents('.block_first').find('.' + class_name).length > 0) {
                        $(elem).parents('.block_first').find('.' + class_name)[0].sumo.reload();
                    }
                }
            }
            else{
                if (responseObject.message === 'session') {
                    location.reload();
                }
                else {
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

/**
 *
 * @param {type} elem
 * @param {type} select_name_value
 * @param {type} class_name
 * @returns {Boolean}
 */
function getReferrerListConfig(elem, select_name_value, class_name, tfc) {
    var college_id = $(elem).parents().find('input[name="college_id"], select[name="college_id"]').val();
    if (typeof select_name_value == 'undefined') {
        select_name_value = [];
    }
    if (typeof tfc == 'undefined') {
        var tfc = $(elem).val();
    }
    if (typeof class_name == 'undefined' || class_name == '') {
        class_name = 'campu\\|publisher_id';
    }
    var htmlOption = '';
    
    var registration_instance = $(".registration_instance").val();
    if(typeof registration_instance == 'undefined' || registration_instance == null || registration_instance == ''){
        registration_instance = 'pri_register';
    }
    $.ajax({
        url: '/campaign-manager/get-referrer-list',
        type: 'post',
        dataType: 'html',
        async: false,
        data: {'college_id': college_id, 'traffic_channel': tfc,'registration_instance':registration_instance},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            var responseObject = $.parseJSON(json);
            if(responseObject.status === 1) {
                if(typeof responseObject.data.sourceList === "object"){

                    var sourceList    = responseObject.data.sourceList;
                    $.each(sourceList, function (index, item) {
                        htmlOption +='<option value="'+index+'">'+item+'</option>';
                    });

                    var publisher_id = select_name_value[$(elem).parents('.block_first').find('.' + class_name).attr('name')];
                    if(appendFlag == 0){
                        appendFlag = 1;
                        $(elem).parents('.block_first').find('.' + class_name).html(htmlOption);
                    }else{
                        $(elem).parents('.block_first').find('.' + class_name).append(htmlOption);
                    }
                    if (typeof publisher_id != 'undefined' && publisher_id !== null && publisher_id != "") {
                        $(elem).parents('.block_first').find('.' + class_name).val(publisher_id);
                    }
                    $(elem).parents('.block_first').find('.' + class_name).trigger('chosen:updated');
                    
                    if($(elem).parents('.block_first').find('.' + class_name)[0] && $(elem).parents('.block_first').find('.' + class_name)[0].sumo ){
                        $(elem).parents('.block_first').find('.' + class_name)[0].sumo.reload();                    
                    }

                }
            }
            else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }
                else {
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

/**
 *
 * @param {type} elem
 * @param {type} select_name_value
 * @param {type} class_name
 * @returns {Boolean}
 */
function getOfflineListConfig(elem, select_name_value, class_name, tfc) {
    var college_id = $(elem).parents().find('input[name="college_id"], select[name="college_id"]').val();
    if (typeof select_name_value == 'undefined') {
        select_name_value = [];
    }
    if (typeof tfc == 'undefined') {
        var tfc = $(elem).val();
    }
    if (typeof class_name == 'undefined' || class_name == '') {
        class_name = 'campu\\|publisher_id';
    }

    var finalHtml = "<option value='1'>Offline</option>";
    var publisher_id = select_name_value[$(elem).parents('.block_first').find('.' + class_name).attr('name')];
    $(elem).parents('.block_first').find('.' + class_name).html(finalHtml);
    if (publisher_id !== undefined && publisher_id !== "") {
        $(elem).parents('.block_first').find('.' + class_name).val(publisher_id)
    }
    $(elem).parents('.block_first').find('.' + class_name).trigger('chosen:updated');

    return false;
}

function loadDefaultValueOnLoad(select_name_value, div_id) {
//     $('#CollegeConfigurationSection .loader-block').show();
    // load city if
    if (typeof select_name_value == 'undefined') {
        select_name_value = [];
    }
    $('#' + div_id + ' select.sel_value').each(function () {
        // call function according to class type
        var elemClass = $(this).attr('class');
        if (typeof elemClass != 'undefined' && elemClass.indexOf('countryid') > -1) {

            //GetChildByMachineKeyConfig(this, "stateid", "State", select_name_value);
        } else if (typeof elemClass != 'undefined' && elemClass.indexOf('stateid') > -1) {
            //GetChildByMachineKeyConfig(this, "cityid", "City", select_name_value);
        } else if (typeof elemClass != 'undefined' && elemClass.indexOf('traffic_channel') > -1) {
            $(this).trigger('change');
        } else if (typeof elemClass != 'undefined' && elemClass.indexOf('publisher_id') > -1) {
            var pub_value = $(this).val();
            var nm = this.name;
            nm = nm.replace('[]', '');
            var selectedOption = select_name_value[nm];
            if (selectedOption != null && typeof selectedOption != 'undefined' && selectedOption != '') {
                //$(this).val(selectedOption);
                selectedOption = JSON.parse(selectedOption);
                if (typeof selectedOption !== 'object') {
                    selectedOption = [selectedOption];
                }
                for (var ii in selectedOption) {
                    $(this).find('option[value="' + selectedOption[ii] + '"]').attr('selected', 'selected');
                }
                $(this)[0].sumo.reload();
            }
            if (typeof pub_value != 'undefined' && pub_value != '' && pub_value != null) {
                var pub_value_ar = pub_value.split('___');
                pub_value = pub_value_ar[0];
            }
            $(this).trigger('change');
//            getCompaignsSourceConfig(this, pub_value, select_name_value);
        } else if (typeof elemClass != 'undefined' && elemClass.indexOf('source_value') > -1) {
//            var source_value = $(this).val();
            var nm = this.name;
            nm = nm.replace('[]', '');
            var arraySelectedOption = eval(select_name_value[nm]);
            for (var ii in arraySelectedOption) {
                $(this).find('option[value="' + arraySelectedOption[ii] + '"]').attr('selected', 'selected');
            }
            if($(this)[0] && $(this)[0].sumo ){
                $(this)[0].sumo.reload();
            }
            $(this).trigger('change');
        } else if (typeof elemClass != 'undefined' && elemClass.indexOf('medium_value') > -1) {
            var nm = this.name;
            nm = nm.replace('[]', '');
            var arraySelectedOption = eval(select_name_value[nm]);
            for (var ii in arraySelectedOption) {
                $(this).find('option[value="' + arraySelectedOption[ii] + '"]').attr('selected', 'selected');
            }
            $(this)[0].sumo.reload();
            $(this).trigger('change');
        } else if (typeof elemClass != 'undefined' && elemClass.indexOf('name_value') > -1) {
            var nm = this.name;
            nm = nm.replace('[]', '');
            var arraySelectedOption = eval(select_name_value[nm]);
            for (var ii in arraySelectedOption) {
                $(this).find('option[value="' + arraySelectedOption[ii] + '"]').attr('selected', 'selected');
            }
            $(this)[0].sumo.reload();
        }
    });
}


function loadDefaultValueOnLoadApplication(select_name_value, div_id) {
//     $('#CollegeConfigurationSection .loader-block').show();
    // load city if
    if (typeof select_name_value == 'undefined') {
        select_name_value = [];
    }

    $('#' + div_id + ' select.sel_value').each(function () {
        // call function according to class type
        var elemClass = $(this).attr('class');
        if (typeof elemClass != 'undefined' && elemClass.indexOf('countryid') > -1) {
            //GetChildByMachineKeyConfig(this, "stateid", "State", select_name_value);
        }
        else if (typeof elemClass != 'undefined' && elemClass.indexOf('stateid') > -1) {
            //GetChildByMachineKeyConfig(this, "cityid", "City", select_name_value);
        }
        else if (typeof elemClass != 'undefined' && elemClass.indexOf('traffic_channel') > -1) {
//            if (['1','2','6','7','8','9','10'].indexOf($(this).val())>-1) {//campaign option
//                getPublisherListConfig(this, select_name_value, 'publisher_filter');
//            }
//            else if ($(this).val() == 3 || $(this).val() == 4 || $(this).val() == 5) {
//                getReferrerListConfig(this, select_name_value, 'publisher_filter');
//            }
            var selectedChannel = $(this).val();
            var currentElementObj = $(this);
            populatePublisherReferrers(currentElementObj, select_name_value , selectedChannel);


        }
        else if (typeof elemClass != 'undefined' && elemClass.indexOf('publisher_filter') > -1) {

            var pub_value = $(this).val();
            if (typeof pub_value != 'undefined' && pub_value != '') {
                var pub_value_ar = pub_value.split('___');
                pub_value = pub_value_ar[0];
            }
            //conversion source
            if($(this).parents('.block_first').find('.campap\\|conversion_source_value').length>0) {
                getCompaignsSourceConfig(this, pub_value, select_name_value, 'campap\\|conversion_source_value');
            }
            else {
                // registration source
                getCompaignsSourceConfig(this, pub_value, select_name_value);
            }
        }
        else if (typeof elemClass != 'undefined' && elemClass.indexOf('conversion_source_value') > -1) {
            var pubId = '';
            var source_value = $(this).val();
            if (typeof source_value != 'undefined' && source_value != '') {
                var source_name_ar = source_value.split('___');
                source_value = source_name_ar[0];
                pubId        = source_name_ar[1];
            }
            getCompaignsMediumConfig(this, source_value, select_name_value, 'campap\\|conversion_medium_value',pubId);
//            getCompaignsNameConfig(this, source_value, select_name_value, 'campap\\|conversion_name_value');
        }
        else if (typeof elemClass != 'undefined' && elemClass.indexOf('source_value') > -1) {
            var source_value = $(this).val();
            var pubId = '';
            if (typeof source_value != 'undefined' && source_value != '') {
                var source_name_ar = source_value.split('___');
                source_value = source_name_ar[0];
                pubId = source_name_ar[1];
            }
            getCompaignsMediumConfig(this, source_value, select_name_value,'',pubId);
//            getCompaignsNameConfig(this, source_value, select_name_value);

        }
        else if (typeof elemClass != 'undefined' && elemClass.indexOf('conversion_medium_value') > -1) {
            var medium_value = $(this).val();
            if (typeof medium_value != 'undefined' && medium_value != '') {
                var medium_name_ar = medium_value.split('___');
                medium_value = medium_name_ar[0];
            }

            getCompaignsNameConfig(this, medium_value, select_name_value, 'campap\\|conversion_name_value');
        }
        else if (typeof elemClass != 'undefined' && elemClass.indexOf('medium_value') > -1) {

            var medium_value = $(this).val();
            if (typeof medium_value != 'undefined' && medium_value != '') {
                var medium_name_ar = medium_value.split('___');
                medium_value = medium_name_ar[0];
            }
            getCompaignsNameConfig(this, medium_value, select_name_value);
        }
    });
}


//call getCompaignsMedium() medium_value by source_value
$(document).on('change', "select.campap\\|conversion_source_value.sel_value", function () {
//    $(this).parents('.block_first').find(".campap\\|conversion_medium_value").html("<option value=''>Campaign Medium</option>");
//    $(this).parents('.block_first').find(".campap\\|conversion_name_value").html("<option value=''>Campaign Name</option>");
    $('select').trigger('chosen:updated');

    if ($(this).val() == '') {//check publisher value
        return false;
    }
    var source_value = $(this).val();
    var pubId = '';
    if (typeof source_value != 'undefined' && source_value != '') {
        var source_name_ar = source_value.split('___');
        source_value = source_name_ar[0];
        pubId = source_name_ar[1];
    }
    var sel_mvalue = '';
    getCompaignsMediumConfig(this, source_value, sel_mvalue, 'campap\\|conversion_medium_value',pubId);
//    getCompaignsNameConfig(this, source_value, sel_mvalue, 'campap\\|conversion_name_value');
});

//call getCompaignsName() name_value by medium_value
$(document).on('change', "select.campap\\|conversion_medium_value.sel_value", function () {
    //getCompaignsName();
//    $(this).parents('.block_first').find(".campap\\|conversion_name_value").html("<option value=''>Campaign Name</option>");

    if ($(this).val() == '') {//check publisher value
        return false;
    }
    var medium_value = $(this).val();
    if (typeof medium_value != 'undefined' && medium_value != '') {
        var medium_name_ar = medium_value.split('___');
        medium_value = medium_name_ar[0];
    }
    var sel_nvalue = '';
    getCompaignsNameConfig(this, medium_value, sel_nvalue, 'campap\\|conversion_name_value');
});



//call getCompaignsMedium() medium_value by source_value
$(document).on('change', "select.campu\\|source_value.sel_value", function () {
//    $(this).parents('.block_first').find(".campu\\|medium_value").html("<option value=''>Campaign Medium</option>");
//    $(this).parents('.block_first').find(".campu\\|name_value").html("<option value=''>Campaign Name</option>");
    $('select').trigger('chosen:updated');

    //if ($(this).val() == '') {//check publisher value
        //return false;
    //}
    var source_value = $(this).val();
    var source_name_arName = [];
    var source_name_arIds = [];
    var sel_mvalue = '';
    if (typeof source_value != 'undefined' && source_value != null && source_value.length > 0) {
        for (var svi in source_value) {            
            var source_name_ar = source_value[svi].split('___');
            source_name_arName.push(source_name_ar[0]);
            if(source_name_arIds.indexOf(source_name_ar[1]) === -1){  
                source_name_arIds.push(source_name_ar[1]);    
            }  
                      
            //getCompaignsNameConfig(this, source_name_ar[0], sel_mvalue, '', 'source_value');
            //getCompaignsMediumConfig(this, source_name_ar[0], sel_mvalue,'',source_name_ar[1]);
        }        
    }
    getCompaignsMediumConfig(this, source_name_arName, sel_mvalue,'',source_name_arIds);
});

//call getCompaignsName() name_value by medium_value
$(document).on('change', "select.campu\\|medium_value.sel_value", function () {
    //getCompaignsName();
//    $(this).parents('.block_first').find(".campu\\|name_value").html("<option value=''>Campaign Name</option>");

    var medium_value = $(this).val();
    var medium_name_arName = [];
    var sel_nvalue = '';
    appendFlag = 0; 
    if (medium_value != null && typeof medium_value != 'undefined' && medium_value.length > 0) {
        for (var svi in medium_value) {
            var medium_name_ar = medium_value[svi].split('___');
            medium_name_arName.push(medium_name_ar[0]);
            //getCompaignsNameConfig(this, medium_name_ar[0], sel_nvalue);
        }
    }
    getCompaignsNameConfig(this, medium_name_arName, sel_nvalue);
});


//call publister list by traffic channel selected campain options
//$(document).on('change', "select.traffic_channel.sel_value", function () {
//    if (['1','2','6','7','8','9','10'].indexOf($(this).val())>-1) {//campaign option
//        if ($('.campu\\|publisher_id').length > 0) {
//            if($(this).parents('.block_first').find('.publisher_filter').length>0){
//                getPublisherListConfig(this, [], 'publisher_filter');
//            }
//            else{
//                getPublisherListConfig(this);
//            }
//        }
//    } else if ($(this).val() == 3 || $(this).val() == 4 || $(this).val() == 5) {
//        if ($('.campu\\|publisher_id').length > 0) {
//            if($(this).parents('.block_first').find('.publisher_filter').length>0){
//                getReferrerListConfig(this, [], 'publisher_filter');
//            }
//            else{
//                getReferrerListConfig(this);
//            }
//        }
//    } else {
//        //unset drop down on traffic channel without campains
//        $(this).parents('.block_first').find('.campu\\|publisher_id').html("<option value=''>Publisher/Referrer</option>");
//        // conversion source, conversion medium, conversion name
//        $(this).parents('.block_first').find('.publisher_filter').html("<option value=''>Publisher/Referrer</option>");
//        $('select').trigger('chosen:updated');
//        return false;
//    }
//});

$(document).on('change', "select.traffic_channel.sel_value", function () {

    var selectedChannel = $(this).val();
    var currentElementObj = $(this);
    populatePublisherReferrers(currentElementObj, [], selectedChannel);
    
});

function populatePublisherReferrers(currentElementObj, select_name_value, selectedChannel){
    if($(currentElementObj).parents('.block_first').find('.campu\\|publisher_id').length ){
        $(currentElementObj).parents('.block_first').find('.campu\\|publisher_id' ).html('');
        if($(currentElementObj).parents('.block_first').find('.campu\\|publisher_id' )[0].sumo){
            $(currentElementObj).parents('.block_first').find('.campu\\|publisher_id' )[0].sumo.reload();
        }
    }
    resetCampaignDependent();
    if(typeof selectedChannel !== 'undefined' && selectedChannel !== null){
        appendFlag = 0;
        for (var ii in selectedChannel) {
            var k = ii;
            var channelVal = selectedChannel[ii];
            if(k >= 1){
               appendFlag = 1;
            } 
            if (channelVal == '1' || channelVal=='2' || channelVal=='7' || channelVal == '8' || channelVal == '9') {//campaign option                      
                getPublisherListConfig(currentElementObj, select_name_value, 'campu\\|publisher_id',channelVal);
            } else if (channelVal == '5' || channelVal == '3' || channelVal == '4') {                
                getReferrerListConfig(currentElementObj, select_name_value, 'campu\\|publisher_id',channelVal);
            } else if(channelVal == '6'){
                getDirectListConfig(currentElementObj, select_name_value, 'campu\\|publisher_id',channelVal);
            } else if(channelVal == '9'){
                getOfflineListConfig(currentElementObj, select_name_value, 'campu\\|publisher_id');
            } else if(channelVal == '10'){
                getChatListConfig(currentElementObj, select_name_value, 'campu\\|publisher_id',channelVal);
            }
        }
        appendFlag = 0;
    }
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
    
    var html  = "";
        html  += "<option value='30' >Direct</option>";
    if (appendFlag == 0) {
        appendFlag = 1;
        $(elem).parents('.block_first').find('.' + class_name).html(html);
    } else {
        $(elem).parents('.block_first').find('.' + class_name).append(html);
    }    
    var publisher_id = select_name_value[$(elem).parents('.block_first').find('.' + class_name).attr('name')];

    $(elem).parents('.block_first').find('.' + class_name + ' option[value=""]').remove();
    if (typeof publisher_id !== 'undefined' && publisher_id !== null && publisher_id.length > 0) {
        $(elem).parents('.block_first').find('.' + class_name).val($.parseJSON(publisher_id));
    }
    if ($(elem).parents('.block_first').find('.' + class_name)[0] && $(elem).parents('.block_first').find('.' + class_name)[0].sumo) {
        $(elem).parents('.block_first').find('.' + class_name)[0].sumo.reload();
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
    
    var html  = "";
        html  += "<option value='151'>Chat</option>";
    if (appendFlag == 0) {
        appendFlag = 1;
        $(elem).parents('.block_first').find('.' + class_name).html(html);
    } else {
        $(elem).parents('.block_first').find('.' + class_name).append(html);
    }    
    var publisher_id = select_name_value[$(elem).parents('.block_first').find('.' + class_name).attr('name')];

    $(elem).parents('.block_first').find('.' + class_name + ' option[value=""]').remove();
    if (typeof publisher_id !== 'undefined' && publisher_id !== null && publisher_id.length > 0) {
        $(elem).parents('.block_first').find('.' + class_name).val($.parseJSON(publisher_id));
    }
    if ($(elem).parents('.block_first').find('.' + class_name)[0] && $(elem).parents('.block_first').find('.' + class_name)[0].sumo) {
        $(elem).parents('.block_first').find('.' + class_name)[0].sumo.reload();
    }
}

function getOfflineListConfig(elem, select_name_value, class_name) {

    if (typeof select_name_value === 'undefined') {
        select_name_value = [];
    }
    if (typeof class_name === 'undefined' || class_name === '') {
        class_name = 'campu\\|publisher_id';
    }
    
    if($(elem).parents('.block_first').find('.' + class_name).length > 0){
        var options = "<option value='1' >Offline</option>";
        if(appendFlag == 0){
            $(elem).parents('.block_first').find('.' + class_name).html(options);
            appendFlag = 1;
        }else{
            $(elem).parents('.block_first').find('.' + class_name).append(options);
        }
    }

    if($(elem).parents('.block_first').find('.' + class_name)[0] && $(elem).parents('.block_first').find('.' + class_name)[0].sumo ){
       $(elem).parents('.block_first').find('.' + class_name)[0].sumo.reload();                    
    }
    
}

function resetCampaignDependent(){
    if($(this).parents('.block_first').find(".campu\\|source_value").length > 0 ){
        $(this).parents('.block_first').find(".campu\\|source_value").html("");
        $(this).parents('.block_first').find(".campu\\|source_value")[0].sumo.reload();
    
    }
    if($(this).parents('.block_first').find(".campu\\|medium_value").length > 0){
        $(this).parents('.block_first').find(".campu\\|medium_value").html("");
        $(this).parents('.block_first').find(".campu\\|medium_value")[0].sumo.reload();
    }
    
    if($(this).parents('.block_first').find(".campu\\|name_value").length > 0){
        $(this).parents('.block_first').find(".campu\\|name_value").html("");
        $(this).parents('.block_first').find(".campu\\|name_value")[0].sumo.reload();
    }
    if($(this).parents('.block_first').find(".campap\\|conversion_source_value").length > 0 ){
        $(this).parents('.block_first').find(".campap\\|conversion_source_value").html("");
        $(this).parents('.block_first').find(".campap\\|conversion_source_value")[0].sumo.reload();
    
    }
    if($(this).parents('.block_first').find(".campap\\|conversion_medium_value").length > 0){
        $(this).parents('.block_first').find(".campap\\|conversion_medium_value").html("");
        $(this).parents('.block_first').find(".campap\\|conversion_medium_value")[0].sumo.reload();
    }
    
    if($(this).parents('.block_first').find(".campap\\|conversion_name_value").length > 0){
        $(this).parents('.block_first').find(".campap\\|conversion_name_value").html("");
        $(this).parents('.block_first').find(".campap\\|conversion_name_value")[0].sumo.reload();
    }
}

//call getCompaignsSource() by publisher id  and Campaion source values and medium ,Name withour values
$(document).on('change', "select.campu\\|publisher_id.sel_value,select.publisher_filter.sel_value", function () {
    //When Publisher value will change then reset all below div id value
//    $(this).parents('.block_first').find(".campu\\|source_value").html("<option value=''>Campaign Source</option>");
//    $(this).parents('.block_first').find(".campu\\|medium_value").html("<option value=''>Campaign Medium</option>");
//    $(this).parents('.block_first').find(".campu\\|name_value").html("<option value=''>Campaign Name</option>");
//    $('select').trigger('chosen:updated');
//    var sel_svalue = '';
//    var pub_value = $(this).val();
//    if(pub_value !== null){
//        for (var ii in pub_value) {
//            var pub_val_ar = pub_value[ii].split('___');
//            var pub_val = pub_val_ar[0];
//            getCompaignsSourceConfig(this, pub_val, sel_svalue,'');
//            getCompaignsSourceConfig(this, pub_val, sel_svalue, 'campap\\|conversion_source_value');  
//        }
//    }
});

function leadAndOrBlockCondition(elem) {
    $('#CounsellorLeadConfigContainer .block_criteria a.btn_or,#CounsellorLeadConfigContainer .block_criteria a.btn_and').removeClass('active');
    if ($(elem).hasClass('btn_or')) {
        $('#CounsellorLeadConfigContainer .block_criteria a.btn_or').addClass('active');
        $('#CounsellorLeadConfigContainer #lead_block_condition').val('or');
    } else if ($(elem).hasClass('btn_and')) {
        $('#CounsellorLeadConfigContainer .block_criteria a.btn_and').addClass('active');
        $('#CounsellorLeadConfigContainer #lead_block_condition').val('and');
    }
    return false;
}


function applicationAndOrBlockCondition(elem, form_id) {
    $('#CounsellorFormConfigContainer' + form_id + ' .block_criteria a.btn_or,#CounsellorFormConfigContainer' + form_id + ' .block_criteria a.btn_and').removeClass('active');
    if ($(elem).hasClass('btn_or')) {
        $('#CounsellorFormConfigContainer' + form_id + ' .block_criteria a.btn_or').addClass('active');
        $('#CounsellorFormConfigContainer' + form_id + ' #app_block_condition_' + form_id).val('or');
    } else if ($(elem).hasClass('btn_and')) {
        $('#CounsellorFormConfigContainer' + form_id + ' .block_criteria a.btn_and').addClass('active');
        $('#CounsellorFormConfigContainer' + form_id + ' #app_block_condition_' + form_id).val('and');
    }
    return false;
}
/**
 *
 * @param {type} type
 * @param {type} container_name
 * @returns {undefined}
 */

function updateOperator(type, container_name, selected, arr, multiValue) {

    if (typeof selected == 'undefined') {
        selected = '';
    }
    
    var html = '<option value="">Select Condition</option>';
  
    if((arr[0].match(/u\|/g) || arr[0].match(/ud\|/g) || arr[0].match(/clgreg\|/g) || arr[0].match(/fd\|/g)) ){
        var dropdownOperator = {
            'eq_dd': 'Matches',
            'neq_dd': 'Does not Matches',
            'contains': 'Contains',
            'not_contains': 'Does not contain',
            'empty': 'Is empty',
            'not_empty': 'Is not empty'
        };
        var predefinedDropdownOperator = {
            'eq_dd': 'Matches',
            'neq_dd': 'Does not Matches',
            'contains': 'Contains',
            'not_contains': 'Does not contain',
            'empty': 'Is empty',
            'not_empty': 'Is not empty'
        };
    }else if(arr[0].match(/gdpi_sb/g)){
        var dropdownOperator = {
            'eq_dd': 'Matches',
            'neq_dd': 'Does not Matches',
            'empty': 'Is empty',
            'not_empty': 'Is not empty'
        };
        var predefinedDropdownOperator = {
            'eq_dd': 'Matches',
            'neq_dd': 'Does not Matches',
            'empty': 'Is empty',
            'not_empty': 'Is not empty'
        };
    }else{
        var dropdownOperator = {
            'eq_dd': 'Matches',
            'neq_dd': 'Does not Matches'
        };
        var predefinedDropdownOperator = {
            'eq_dd': 'Matches',
            'neq_dd': 'Does not Matches'
        };
    }
    
    if((arr[2].match(/file_yes/g) || arr[2].match(/file_no/g) )){
        delete dropdownOperator['contains'];
        delete dropdownOperator['not_contains'];
    }
    
    var operator = {
        'dropdown': dropdownOperator,
        'predefined_dropdown': predefinedDropdownOperator,
        'text': {
            'lt': 'Less than',
            'lteq': 'Less than or Equal to',
            'eq': 'Equal to',
            'gt': 'Greater than',
            'gteq': 'Greater than or equal to',
            'neq': 'Not Equal to',
            'starts_with': 'Starts with',
            'ends_with': 'Ends with',
            'contains': 'Contains',
            'not_contains': 'Does not contain',
            'eq_like': 'Exactly Matches',
            'empty': 'Is empty',
            'not_empty': 'Is not empty'
        },
        'text_string': {
            'starts_with': 'Starts with',
            'ends_with': 'Ends with',
            'contains': 'Contains',
            'not_contains': 'Does not contain',
            'empty': 'Is empty',
            'not_empty': 'Is not empty'
        },
        'date': {
            'between': 'Between',
            'before': 'Before',
            'after': 'After',
            'ago': 'Ago'
        },
        'payment_dropdown': {
            'payment_approved': 'Payment Approved',
            'payment_pending': 'Payment Pending',
        },
        'paragraph': {
            'empty': 'Is empty',
            'not_empty': 'Is not empty'
        }
    };
//    console.log(operator[type]);
    if (typeof type != 'undefined' && ['dropdown', 'text', 'text_string', 'date', 'predefined_dropdown', 'payment_dropdown','paragraph'].indexOf(type) > -1) {
        for (var lkey in operator[type]) {
            html += '<option value="' + lkey + '">' + operator[type][lkey] + '</option>';
        }
    }
    jQuery("[name='" + container_name + "']").html(html);
    jQuery("[name='" + container_name + "']").val(selected);
    jQuery('.chosen-select').chosen();
}

//function createTypeahead(elem, type) {
//    elem.typeahead({
//        hint: true,
//        highlight: true,
//        minLength: 3,
//        source: function (request, response) {
//            var search = $(elem).val();
//            var college_id = $('[name="college_id"]').val();
//            // calculated and return parent id
//            var parent_id = getParentId(elem, type);
//            if (search) {
//                $.ajax({
////                    url: '/common/GetChildByMachineKeyForRegistration', // call if state is selected
//                    url: '/common/entityAutoSearch',
//                    data: {
//                        'search': search,
//                        'college_id': college_id,
//                        'parent_id': parent_id,
//                        'type': type
//                    },
//                    dataType: "json",
//                    type: "POST",
//                    headers: {
//                        "X-CSRF-Token": jsVars._csrfToken
//                    },
//                    //contentType: "application/json; charset=utf-8",
//                    success: function (data) {
//                        items = [];
//                        var map = [];
//                        $.each(data.list, function (i, item) {
//                            //console.log(j);console.log(item2.application_no);
//                            var name = item;
//                            map.push({name: name, i: i, field: $(elem).attr('name')});
//                        });
//                        response(map);
//                        $(".dropdown-menu").css("height", "auto");
//                    },
//                    error: function (response) {
//                        alertPopup(response.responseText);
//                    },
//                    failure: function (response) {
//                        alertPopup(response.responseText);
//                    }
//                });
//            }
//        },
//        updater: function (item) {
//            var field_name = item.field;
//            field_name = field_name.replace('[values]', '[values_id]');
//            $("[name='" + field_name + "']").remove();
//            $("[name='" + item.field + "']")
//                    .parents('.field_value_div')
//                    .append('<input type="hidden" name="' + field_name + '" value="' + item.i + '" class="sel_value_hidden" />');
//            return item;
//        }
//    }).blur(validateSelection);
//}


function getParentId(elem, type) {
    var parent_id = '';
    if (type == 'city') {
        // get state id by name of element
        // auto complete id is saved in hidden field with name values_id
        var parent_name = $(elem).parents('.block_first').find('.ud\\|state_id').last().attr('name');
        if (typeof parent_name != 'undefined' && parent_name != '') {
            parent_name = parent_name.replace('values]', 'values_id]');
            parent_id = $('[name="' + parent_name + '"]').val();
        }
    } else if (type == 'state') {
        // get country id
        var parent_id = $(elem).parents('.block_first').find('.countryid').last().val();
    } else if (type == 'district') {
        // get state id by name of element
        // auto complete id is saved in hidden field with name values_id
        var parent_name = $(elem).parents('.block_first').find('.ud\\|state_id').last().attr('name');
        if (typeof parent_name != 'undefined' && parent_name != '') {
            parent_name = parent_name.replace('values]', 'values_id]');
            parent_id = $('[name="' + parent_name + '"]').val();
        }
    }
    return parent_id;
}

function validateSelection() {
    var parent_name = $(this).attr('name');
    var parent_name_id = parent_name.replace('filter[values]', 'filter[values_id]');
    if ($('[name="' + parent_name_id + '"]').length <= 0) {
        $(this).val('');
    }
}

function GetChildForDependentField(elem, ContainerId, Choose, select_name_value) {
    if (elem && ContainerId) {
        var key = $(elem).val();
        if (typeof select_name_value === 'undefined') {
            select_name_value = [];
        }
        
        //set black dropdown in all sub childs for dependent fields
        var registrationDependentData = jsVars.registrationDependentData;
        if (registrationDependentData) {
            var depandentContainerId = '';
            var childField = ContainerId.split('|'); 
            for (var prop in registrationDependentData) {
                if(registrationDependentData[prop] === childField[1]){
                    depandentContainerId = childField[0] + "|" + childField[1];
                    if(depandentContainerId !== ContainerId){
                        $(elem).parents('.block_first').find('.' + depandentContainerId).html('');
                        if($(elem).parents('.block_first').find('.' + depandentContainerId)[0] && $(elem).parents('.block_first').find('.' + depandentContainerId)[0].sumo ){
                            $(elem).parents('.block_first').find('.' + depandentContainerId)[0].sumo.reload();                    
                        }
                    }
                    childField[1] = registrationDependentData[childField[1]];
                }
            }
        }
        
        var isFieldExits = $(elem).parents('.block_first').find('.' + ContainerId).length;
        if(isFieldExits === 0){
            return false;
        }
                  
        $.ajax({
            url: '/common/GetChildByMachineKeyForRegistration',
            type: 'post',
            dataType: 'json',
            data: {key: key},
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
                    //var html = '<option value="">Registered ' + Choose + '</option>';
                    var html = '';
                    var default_val = select_name_value[$(elem).parents('.block_first').find('.' + ContainerId).attr('name')];
                    var ContainerIdSplit = ContainerId.split('|');
                    
                    if ($.inArray(ContainerIdSplit[1], ['city_id', 'state_id', 'course_id', 'specialization_id', 'specialisation_id', 'district_id']) >= 0) {
                        html += '<option value="0">' + Choose + ' Not Available </option>';
                    }
                    for (var key in json['list']) {
                        if ($.inArray(ContainerIdSplit[1], ['city_id', 'state_id', 'course_id', 'specialization_id', 'specialisation_id', 'district_id']) >= 0) {
                            var jsonValue = key;
                        } else {
                            var jsonValue = key + ';;;' + json['list'][key];
                        }
                        if (key === default_val) {
                            html += '<option value="' + jsonValue +'" selected="selected">' + json['list'][key] + '</option>';
                        } else {
                            html += '<option value="' + jsonValue +'">' + json['list'][key] + '</option>';
                        }
                    }
                    $(elem).parents('.block_first').find('.' + ContainerId).html(html);
                    
                    $('.chosen-select').chosen();
                    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                    $('.chosen-select').trigger('chosen:updated');
                    
                    if($(elem).parents('.block_first').find('.' + ContainerId)[0] && $(elem).parents('.block_first').find('.' + ContainerId)[0].sumo ){
                        $(elem).parents('.block_first').find('.' + ContainerId)[0].sumo.reload();                    
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
    return false;
}

function getLeadSubstage(elem, ContainerId, type) {
    if (elem && ContainerId) {
        var selectedStage = $(elem).val();
        var isFieldExits = $(elem).parents('.block_first').find('.' + ContainerId).length;
        
        if(isFieldExits === 0){
            return false;
        }
        
        if(type === 'application_stage'){
            var formId = $("#automationListFormId").val();
            var data = {'formId': formId, 'stageId': selectedStage,'calledFrom':'applicantDocumentConfig'};
        }
        else{
            var collegeId = $("#automationCollegeId").val();
            var data = {'collegeId': collegeId, 'stageId': selectedStage,'type':'LM'};
        }
               
        $.ajax({
            url: jsVars.getLeadSubStagesLink,
            type: 'post',
            dataType: 'json',
            data: data,
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
                } else if (json['success'] === 200) {
                    var html = '';
                    for(var subStageId in json['subStageList']) {   
                        html += '<option value="'+subStageId+'">'+json['subStageList'][subStageId]+'</option>';
                    }
                    $(elem).parents('.block_first').find('.' + ContainerId).html(html);
                    
                    if($(elem).parents('.block_first').find('.' + ContainerId)[0] && $(elem).parents('.block_first').find('.' + ContainerId)[0].sumo ){
                        $(elem).parents('.block_first').find('.' + ContainerId)[0].sumo.reload();                    
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
    return false;
}