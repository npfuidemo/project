
var appendFlag = 0;

/* 
 * To handle User Counsellor Config Js Functions.
 */
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
            } 
            else if (json['error']) {
                // error display in popup
                alertPopup(json['error'], 'error');
            }
            else if (typeof json['error_text'] !='undefined' && json['error_text'] !=''){
//                error display in logic builder's fields
                for(var i in json['error_text']){
                    // form id found in Application manager counsellor logic builder
                    if(typeof json['form_id'] !='undefined' && json['form_id']!=''){
                        var form_id = json['form_id']+'_';
                    }else{
                        // for lms logic builder form id is blank
                        var form_id = '';
                    }
                    for(var j in json['error_text'][i]){
                        if(json['error_text'][i][j]==1){
                            // display error inline
                            $('#errorlead_'+form_id+i+'_'+j).show().html('<div class="text-danger">Error! You cannot leave a condition blank<div>');
                        }
                    }
                }
            } else if (json['success'] == 200){
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
 //   jQuery(stgClone).find('div.SumoSelect').removeAttr('class');
//    jQuery(stgClone).find('.SumoSelect select').html('');
//    jQuery(stgClone).find('.SumoSelect select').html('');
       
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
    if(form_id > 0) {
        var block_num = obj_name.match(re)[1].replace('][','');
        var error_span ='errorlead_'+form_id+'_'+block_num+'_1';
    }else{
        var block_num = obj_name.match(re)[0].replace('][','');
        var error_span ='errorlead_'+block_num+'_1';
    }
    // add error span
    jQuery(stgClone).append('<span class="col-md-12 lead_error" id="'+error_span+'"></span>');
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
        if (typeof $(this).find('.lead_error') !='undefined') {
            var fields_name = $(this).find('.lead_error').attr('id').replace(/\d$/gi, stage_count);
            $(this).find('.lead_error').attr('id',fields_name);
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
        
        if (typeof $(this).find('.lead_error') !='undefined') {
            var fields_name = $(this).find('.lead_error').attr('id').replace(/\d$/gi, stage_count);
            $(this).find('.lead_error').attr('id',fields_name);
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
function addMoreBlockConditionAjax(form_id, call_type, segmentEditString,is_segment) {

    if (form_id !== '') {
        if($(".loader-block").length){
            $(".loader-block").show();
        }
        if(typeof is_segment === 'undefined'){
            is_segment = '';
        }
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
        var urlString = '';
        if ((typeof segmentEditString !== 'undefined') && (segmentEditString !== '')) {
            urlString = '/' + segmentEditString;
        }        
        $.ajax({
            url: '/users/add-more-block-condition' + urlString,
            type: 'post',
            data: {form_id: form_id, index: index, block_radio: radio_val, 'call_type': call_type, 'college_id': college_id},
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
            },
            complete: function () {
                if($(".loader-block").length){
                    $(".loader-block").hide();
                }
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
               
                if(typeof segmentEditString !='undefined' || typeof is_segment !== 'undefined' && is_segment == 'segment'){
                    $('.sumo_select').SumoSelect({placeholder: 'Select Lead Status', search: true, searchText:'Search Lead Status', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        
        // if 4 condition then hide button
        if(typeof is_segment !== 'undefined' && is_segment == 'segment'){
            $('.sumo_select').SumoSelect({placeholder: 'Select Lead Status', search: true, searchText:'Search Lead Status', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
            
            if($('#CounsellorLeadConfigContainer .block_first').length>=3){
                $('#saveSegmentForm .make-outer-copy').hide();
                return false;
            }
        }
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
                    // for segment only
                    if($('#segmentManager .block_first').length<3){
                        $('#saveSegmentForm .make-outer-copy').show();
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
    if(call_type=='lead'){
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
                    $('#allocate_lead_form_' + form_id).show();
                    $('#accordion_body_' + form_id + ' #form' + form_id + '_block').html(html);
                } else {
                    $('#button_lead_form').show();
                    $('#allocate_lead_form').show();
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
function createInputApplicationCounsellorConfig(currentObj, selected, typeselected,call_type) {
    if (typeof selected == 'undefined') {
        selected = '';
    }
    if (typeof typeselected == 'undefined') {
        typeselected = '';
    }
    if (typeof call_type == 'undefined') {
        call_type = '';
    }
    var cur_elem_name = $(currentObj).attr('name');
    var cur_val_name = cur_elem_name.replace('[fields]', '[values][]');
    var cur_type_name = cur_elem_name.replace('[fields]', '[types]');
    var fieldLabelmapping = {'ud|country_id':"Country", 'ud|state_id':"State",'ud|city_id':"City",'ud|course_id':"Course"
                            ,'ud|specialization_id':"Specialization",'ud|university_id':"Campus",'ud|district_id':"District",'ud|lead_sub_stage':"Lead Sub Stage"};
    var labelname = 'Select Option'; //$(currentObj).data('label_name');

    var value_field = $(currentObj).val();
    var arr = value_field.split("||");
    var html = '';
    var type = "";
    var class_date = '';
    var childDependentName = '';
    if (arr.length > 2) {
        var type = arr[1];
        var val_json = (typeof arr[2] !== 'undefined' && arr[2] != '') ? arr[2] : '{}';
        var html_field_id = '';
        // for not break ajax on created by, ID CreatedBySelect
        if (arr[0].match(/created_by/i)) {
            html_field_id = 'CreatedBySelect';
        } else {
            html_field_id = arr[0];
        }
        var sls = false;
        
        if (type == "dropdown" || type == "select" || type == "predefined_dropdown") {
            
            var dependentDropdownJson = (typeof $(currentObj).data('registrationdependent') !== 'undefined') ? $(currentObj).data('registrationdependent') :'';
            var getDependentData = setDependentFieldAttributes(currentObj,html_field_id);
                        
            var parentDependentName = getDependentData['parentDependentName'];
            childDependentName = getDependentData['childDependentName'];
            
            if ('ud|country_id' == html_field_id) {
                html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select sel_value countryid' name='" + cur_val_name + "' data-field='"+html_field_id+"'>";
            }
            else if ('campu|publisher_id' == html_field_id || 'pub|publisher_id' == html_field_id) {
                html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select publisher_filter sel_value' name='" + cur_val_name + "' data-field='"+html_field_id+"'>";
            } else if ('u|traffic_channel' == html_field_id) {
                html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select traffic_channel sel_value' name='" + cur_val_name + "' data-field='"+html_field_id+"'>";
            } else if ('u|registration_instance' == html_field_id) {
                html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select registration_instance sel_value' name='" + cur_val_name + "' data-field='"+html_field_id+"'>";
            } else if ('ap|payment_status' == html_field_id) {
                html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select payment_status sel_value' name='" + cur_val_name + "' data-field='"+html_field_id+"'>";
            } else if ('ap|payment_method' == html_field_id) {
                html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select payment_method sel_value' name='" + cur_val_name + "' data-field='"+html_field_id+"'>";
            }else {                
                html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select sel_value " + html_field_id + "' name='" + cur_val_name + "' data-field='"+html_field_id+"' data-child='"+parentDependentName+"' data-childname='"+childDependentName+"' data-ct='"+call_type+"'>";
            }

            var obj_json = JSON.parse(val_json);
            if($.inArray(html_field_id,['ud|country_id','ud|state_id','ud|city_id','ud|course_id','ud|specialization_id','ud|university_id','ud|district_id','ud|lead_sub_stage']) >= 0 ){
                if(typeof jsVars.fieldLabelMapping[html_field_id] != 'undefined'){
                    html += '<option value="0">' + jsVars.fieldLabelMapping[html_field_id] +  jsVars.notAvailableText+' </option>';
                }else{
                    html += '<option value="0">' + fieldLabelmapping[html_field_id] + jsVars.notAvailableText+' </option>';
                }
            }
            for (var key in obj_json) {
                //default select pri registration in registration instance
                var select = '';
                if (key == 'pri_register_date') {
                    select = 'selected';
                }
                if(typeof obj_json[key] == 'object'){
                    html += '<optgroup label="'+key+'">';
                    for (var key2 in obj_json[key]) {
                        html += "<option " + select + " value=\"" + key2 + "\">" + obj_json[key][key2] + "</option>";
                    }
                    html += '</optgroup>';
                }else{
                    html += "<option " + select + " value=\"" + key + "\">" + obj_json[key] + "</option>";
                }
            }
            html += "</select>";
            
            
            if('predefined_dropdown'== type){
                updateOperator('predefined_dropdown', cur_type_name, typeselected);
            }else{
                updateOperator('dropdown', cur_type_name, typeselected);
            }
            
        } else if (type == "date") {
            if (jQuery("[name='" + cur_type_name + "']").val() == 'between') {
                class_date = "daterangepicker_report";
            } else {
                class_date = "datepicker_report";
            }

            html = "<input type='text' class='form-control sel_value " + class_date + "' name='" + cur_val_name + "' value='' readonly='readonly' placeholder='" + labelname + "' data-id='" + html_field_id + "' data-field='"+html_field_id+"'>";
            updateOperator('date', cur_type_name, typeselected);
        } else {
            // for auto complete create textbox
            if ('ud|lead_sub_stage' == html_field_id) {   
                var autoSpanId = fetchAutoSpanId(cur_elem_name);
                html = '<div class="border_input" style="background:#fff">';
                html += "<input type='hidden' name='" + cur_val_name + "' class='sel_value " + html_field_id + "' value='' >";
                html +='<div class="border_selected_tag" id="border_selected_tag_'+autoSpanId+'"></div>';
                html += "<div class='border_input_tag' ><input type='text' class='input_here' id='input_here_" + autoSpanId + "' value='' placeholder='Type Lead Sub Stage Name' onclick=\"hideAutoSpan()\" onkeyup=\"populateLeadSubStageDropdown('"+cur_val_name+"',this.value, '"+autoSpanId+"')\" autocomplete='off' >";
                html += '<span class="autoloadspan" id="load_table_column_'+autoSpanId+'"></span> ';
                html += '</div></div>';
                updateOperator('dropdown', cur_type_name, typeselected);
            } else if ('ud|city_id' == html_field_id) {               
                var autoSpanId = fetchAutoSpanId(cur_elem_name);
                html = '<div class="border_input" style="background:#fff">';
                html += "<input type='hidden' name='" + cur_val_name + "' class='sel_value " + html_field_id + "' value='' >";
                html +='<div class="border_selected_tag" id="border_selected_tag_'+autoSpanId+'"></div>';
                html += "<div class='border_input_tag' ><input type='text' class='input_here' id='input_here_" + autoSpanId + "' value='' placeholder='Type City Name' onclick=\"hideAutoSpan()\" onkeyup=\"populateCityDropdown('"+cur_val_name+"',this.value, '"+autoSpanId+"')\" autocomplete='off' >";
                html += '<span class="autoloadspan" id="load_table_column_'+autoSpanId+'"></span> ';
                html += '</div></div>';
                updateOperator('dropdown', cur_type_name, typeselected);
            } else if ('ud|district_id' == html_field_id) {         
                var autoSpanId = fetchAutoSpanId(cur_elem_name);
                html = '<div class="border_input" style="background:#fff">';
                html += "<input type='hidden' name='" + cur_val_name + "' class='sel_value " + html_field_id + "' value='' >";
                html +='<div class="border_selected_tag" id="border_selected_tag_'+autoSpanId+'"></div>';
                html += "<div class='border_input_tag' ><input type='text' class='input_here' id='input_here_" + autoSpanId + "' value='' placeholder='Type District Name' onclick=\"hideAutoSpan()\" onkeyup=\"populateDistrictDropdown('"+cur_val_name+"',this.value, '"+autoSpanId+"')\" autocomplete='off' >";
                html += '<span class="autoloadspan" id="load_table_column_'+autoSpanId+'"></span> ';
                html += '</div></div>';
                updateOperator('dropdown', cur_type_name, typeselected);
            } 
            else if('ud|state_id' == html_field_id){
                html = "<input type='text' class='form-control sel_value " + html_field_id + "' name='" + cur_val_name + "' value='' placeholder='Type State Name'  autocomplete='off'>";
                updateOperator('dropdown', cur_type_name, typeselected);
            } 
            
            else {
                html = "<input type='text' class='form-control sel_value' name='" + cur_val_name + "' value='' placeholder='" + labelname + "' data-id='" + html_field_id + "' data-field='"+html_field_id+"'>";
                updateOperator('text', cur_type_name, typeselected);
            }

        }
    } else {
        html = "<input type='text' class='form-control sel_value' name='" + cur_val_name + "' value='" + selected + "' placeholder='" + labelname + "' data-field='"+html_field_id+"'>";
        updateOperator('text', cur_type_name, typeselected);
    }

    var multi_class = '';
    if (sls) {
        multi_class = 'multiSelectBox';
    }
    // finally show the field in DOM
    if (html) {

        if (typeof type != "" && type == 'date') {
            html = '<div class="dateFormGroup' + multi_class + '"><div class="iconDate"><i aria-hidden="true" class="fa fa-calendar-check-o"></i></div><div class="input text">' + html + '</div></div>';
        } else {
            html = '<div class="' + multi_class + '">' + html + '</div>';
        }
        var finalhtml = html;
        
        if ($("[name='" + cur_val_name + "']").parents('.field_value_div').length > 0) {
            $("[name='" + cur_val_name + "']").parents('.field_value_div').html(finalhtml);  
            
            //Attach onChange Event For Dynamic Registration Dropdown Field
            if(typeof arr[0] !== 'undefined' && dependentDropdownJson != '') {
                //Attach in Parent
                //$(curForm).find("[name='" + cur_val_name + "']").attr('onchange','getRegistrationDependentValue(this,\'parent\',\'\');');
                $("[name='" + cur_val_name + "']").attr('onchange','getRegistrationDependentValue(this,\'parent\',\'\');');
                getRegistrationDependentValue(currentObj,'child','');
            }
            
            sumoDropdown();
            
        }
      
    }
    
    // sync value
    if (selected == '' && ('campu|publisher_id' == html_field_id || 'pub|publisher_id' == html_field_id )) {
      
        /// load value from 
        var channel_val = $("[name='" + cur_val_name + "']").parents('div.block_first').find('.traffic_channel').last().val();
        
        populatePublisherReferrers(currentObj, [], channel_val, html_field_id);
        
    }
   
    if (selected == '' && 'campu|source_value' == html_field_id) {
        
        /// load value from
        var pub_val = $("[name='" + cur_val_name + "']").parents('div.block_first').find('.campu\\|publisher_id').last().val();
        
        if(typeof pub_val !='undefined' && pub_val.length != 0){
            var tfc = '';
            $.each(pub_val, function(k,pub_val_single){
                var tfc = '';
                var pub_val_ar = pub_val_single.split('___');
                pub_val = pub_val_ar[0];
                tfc = pub_val_ar[1];
                getCompaignsSourceConfig(currentObj, pub_val, '', '', tfc);

            });
            appendFlag = 0;
            
        }else if($("[name='" + cur_val_name + "']").parents('div.block_first').find('.publisher_filter').last().val()){
            
            // application manager
            var pub_val = $("[name='" + cur_val_name + "']").parents('div.block_first').find('.publisher_filter').last().val();

            if(typeof pub_val !='undefined' && pub_val.length != 0){
                $.each(pub_val, function(k,pub_val_single){
                    var pub_val_ar = pub_val_single.split('___');
                    pub_val = pub_val_ar[0];
                    getCompaignsSourceConfig(currentObj, pub_val);
                    getCompaignsSourceConfig(currentObj, pub_val, '', 'campap\\|conversion_source_value');

                });
                appendFlag = 0;
            }
        }
    }
    
    if (selected == '' && 'campu|medium_value' == html_field_id) {
        /// load value from 
        var source_val_arr = $("[name='" + cur_val_name + "']").parents('div.block_first').find('.campu\\|source_value').last().val();
        
        if(typeof source_val_arr !='undefined' && source_val_arr !=''){
            $.each(source_val_arr, function(k, source_val){
                if(typeof source_val !='undefined' && source_val !=''){
                    var source_val_ar = source_val.split('___');
                    source_val = source_val_ar[0];
                    getCompaignsMediumConfig(currentObj, source_val);
                }
            });
            appendFlag = 0;
        }
    }
    
    if (selected == '' && 'campu|name_value' == html_field_id) {
        /// load value from 
         
        var medium_val_arr = $("[name='" + cur_val_name + "']").parents('div.block_first').find('.campu\\|medium_value').last().val();
        
        if(typeof medium_val_arr !='undefined' && medium_val_arr!=''){
            $.each(medium_val_arr, function(k, medium_val){
                var medium_val_ar = medium_val.split('___');            
                medium_val = medium_val_ar[0];
                getCompaignsNameConfig(currentObj, medium_val);
            });
            appendFlag = 0;
        }else{
            var source_val_arr = $("[name='" + cur_val_name + "']").parents('div.block_first').find('.campu\\|source_value').last().val();
            if(typeof source_val_arr !='undefined' && source_val_arr !=''){
                $.each(source_val_arr, function(k, source_val){
                    var source_val_ar = source_val.split('___');
                    source_val = source_val_ar[0];
                    getCompaignsNameConfig(currentObj, source_val,[],'','source_value');
                });
                appendFlag = 0;
            }
        }
    }
    
    //******** application **************/
    
     if (selected == '' && 'campap|conversion_source_value' == html_field_id) {         
        /// load value from
        var pub_val_arr = $("[name='" + cur_val_name + "']").parents('div.block_first').find('.publisher_filter').last().val();
        
        if(pub_val_arr != null && pub_val_arr != ''){
            $.each(pub_val_arr, function(k, pub_val){
                if(typeof pub_val !='undefined' && pub_val !=''){
                    var pub_val_ar = pub_val.split('___');
                    pub_val = pub_val_ar[0];
                    getCompaignsSourceConfig(currentObj, pub_val, '', 'campap\\|conversion_source_value');
                }
            });
            appendFlag = 0;
        }
        
    }
   
    if (selected == '' && 'campap|conversion_medium_value' == html_field_id) {
        
        /// load value from 
        var source_val_arr = $("[name='" + cur_val_name + "']").parents('div.block_first').find('.campap\\|conversion_source_value').last().val();
        
        if(source_val_arr != null && source_val_arr != ''){
            $.each(source_val_arr, function(k, source_val){                
                if(typeof source_val !='undefined' && source_val !=''){
                    var source_val_ar = source_val.split('___');
                    source_val = source_val_ar[0];
                    getCompaignsMediumConfig(currentObj, source_val, '', 'campap\\|conversion_medium_value');
                }
            });
            
            appendFlag = 0;
        }
        
    }
    
    if (selected == '' && 'campap|conversion_name_value' == html_field_id) {
        /// load value from 
         
        var medium_val_arr = $("[name='" + cur_val_name + "']").parents('div.block_first').find('.campap\\|conversion_medium_value').last().val();

        if(typeof medium_val_arr !='undefined' && medium_val_arr !='' && medium_val_arr != null){
            $.each(medium_val_arr, function(k, medium_val){
                var medium_val_ar = medium_val.split('___');
                medium_val = medium_val_ar[0];
                getCompaignsNameConfig(currentObj, medium_val, '', 'campap\\|conversion_name_value');
            });
            appendFlag = 0;
        }else{
            var source_val_arr = $("[name='" + cur_val_name + "']").parents('div.block_first').find('.campap\\|conversion_source_value').last().val();
            
            if(typeof source_val_arr != 'undefined' && source_val_arr != null && source_val_arr != ''){
                $.each(source_val_arr, function(k, source_val){
                    if(typeof source_val !='undefined' && source_val !=''){
                        var source_val_ar = source_val.split('___');
                        source_val = source_val_ar[0];
                        getCompaignsNameConfig(currentObj, source_val,[],'campap\\|conversion_name_value','source_value');
                    }
                });
                appendFlag = 0;
            }
            
        }
    }
    // load specilisation
    if (html_field_id == 'ud|specialization_id' ) {
        /// load value from 
        if($("[name='" + cur_val_name + "']").parents('div.block_first').find('.ud\\|course_id').length){
            var isRegistrationDependentExist = false;
            if(typeof $(currentObj).data('registrationdependent') !== 'undefined' && $(currentObj).data('registrationdependent') != '' &&
               $("[name='" + cur_val_name + "']").parents('div.block_first').find('.ud\\|university_id').length) {
                isRegistrationDependentExist = true;
            }
                        
            if(!isRegistrationDependentExist) {
                var selectedEvents = $("[name='" + cur_val_name + "']").parents('div.block_first').find('.ud\\|course_id').val();
                var html = getSelectedCourseSpecialisation(selectedEvents);
                $("[name='" + cur_val_name + "']").html(html);
            }
        }
    }
    
    if ((type == "dropdown" || type == "predefined_dropdown") && selected != '') {
         $("[name='" + cur_val_name + "']").val(JSON.parse(selected));
    }else if(selected != ''){        
        selected = JSON.parse(selected);
       
        $("[name='" + cur_val_name + "']").val(selected[0]);
    }
    
    $('.chosen-select').chosen();
    $('.chosen-select').trigger('chosen:updated');
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});

    // hide value div if change is made
    $("[name='" + cur_val_name + "']").parents('.field_value_div>div').hide();
    
    if(selected==''){
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

    if("application" == call_type){
        if(childDependentName !== '') { //If dependent exist then dont attach below function
            
        } else {
            checkDependentField(html_field_id,currentObj);
        }
    }
 
    sumoDropdown();
}

function checkConditionType(elem) { //alert('check condition type');
    var val  = $(elem).val();
    var name = $(elem).attr('name');
    var cur_val_name = name.replace('[types]', '[values][]');
    var selected     = $("[name='" + cur_val_name + "']").val();
    
    if ($("[name='" + cur_val_name + "']").parents('.field_value_div').length > 0) {

        if ('Select Condition' == val || '' == val) {
            $("[name='" + cur_val_name + "']").parents('.field_value_div>div').hide();
            // if hide then selected value reset
            selected = '';
        } else {
            $("[name='" + cur_val_name + "']").parents('.field_value_div>div').show();
        }
    }
    if (val == 'between') {
        jQuery('.datepicker,.daterangepicker').remove();

        jQuery("[name='" + cur_val_name + "']").val('');
//        jQuery("[name='"+cur_val_name+"']").attr('class','').addClass('daterangepicker_report');
        jQuery("[name='" + cur_val_name + "']").removeClass('datepicker_report').addClass('daterangepicker_report');
        jQuery("[name='" + cur_val_name + "']").datepicker('remove');


    } else if (val == 'before' || val == 'after') {
        jQuery('.datepicker,.daterangepicker').remove();
        jQuery("[name='" + cur_val_name + "']").val('');
//        jQuery("[name='"+cur_val_name+"']").attr('class','').addClass('datepicker_report');
        jQuery("[name='" + cur_val_name + "']").removeClass('daterangepicker_report').addClass('datepicker_report');

    }
    $("[name='" + cur_val_name + "']").val(selected);
    LoadReportDatepicker();
    LoadReportDateRangepicker();
    
    if($('#createSegmentSection').length>0){
        $('#createSegmentSection .sumo_select').SumoSelect({placeholder: 'Select Lead Status', search: true, searchText:'Search Lead Status', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
    }
//    return false;
}

function GetChildByMachineKeyConfig(elem, ContainerId, Choose, select_name_value) {
    if (elem && ContainerId) {
        var key = $(elem).val();
        if (typeof select_name_value == 'undefined') {
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
                    if ((Choose == 'State') && ($(elem).parents('.block_first').find('.cityid').length > 0))
                    {
                        $(elem).parents('.block_first').find('.cityid').html('<option value="">Registered City</option>');
                    }

                    var default_val = select_name_value[$(elem).parents('.block_first').find('.' + ContainerId).attr('name')];

                    for (var key in json['list']) {
                        if (key == default_val) {

                            html += '<option value="' + key + '" selected="selected">' + json['list'][key] + '</option>';
                        } else {
                            html += '<option value="' + key + '">' + json['list'][key] + '</option>';
                        }
                    }
                    $(elem).parents('.block_first').find('.' + ContainerId).html(html);

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

/**
 * function: Get All Publisher of a College
 * @param {type} CollegeId
 * @returns {undefined}
 */

function getPublisherListConfig(elem, select_name_value, class_name, traffic_channel) {

    var college_id = $(elem).parents().find('input[name="college_id"], select[name="college_id"]').val();
//     var college_id = jQuery('input[name="college_id"]').val();

    if (typeof select_name_value == 'undefined') {
        select_name_value = [];
    }
    if(typeof traffic_channel =='undefined'){
        traffic_channel = $(elem).val();
    }
    if (typeof class_name == 'undefined' || class_name == '') {
        class_name = 'campu\\|publisher_id';
    }
    var htmlOption = '<option value="">Publisher/Referrer</option>';
    if (college_id) {
        $.ajax({
            url: '/campaign-manager/get-publisher-list',
            type: 'post',
            data: {college_id: college_id, 'traffic_channel':traffic_channel},
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
                if(responseObject.status === 1) {
                    if(typeof responseObject.data.sourceList === "object"){
                        var sourceList    = responseObject.data.sourceList;
                        $.each(sourceList, function (index, item) {
                            htmlOption +='<option value="'+index+'">'+item+'</option>';
                        });
                        var publisher_id = select_name_value[$(elem).parents('.block_first').find('.' + class_name).attr('name')];
                        if($(elem).parents('.block_first').find('.' + class_name).length > 0){
                            if(appendFlag == 0){
                                $(elem).parents('.block_first').find('.' + class_name).html(htmlOption);
                                appendFlag == 1;
                            }
                            else{
                                $(elem).parents('.block_first').find('.' + class_name).append(htmlOption);
                            }
                            $(elem).parents('.block_first').find('.' + class_name+' option[value=""]').remove();
                        }
                        if (typeof publisher_id != 'undefined' && publisher_id != null && publisher_id.length > 0 ) {
                            $(elem).parents('.block_first').find('.' + class_name).val($.parseJSON(publisher_id));
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
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    } else{
        $(elem).parents('.block_first').find('.' + class_name).html('');
    }
    
    
}

/**
 * @param {object} elem
 * @param {int} getvalue
 * @param {int} college_id
 * @param {int} default_value
 * @returns {Boolean}
 */

function getCompaignsSourceConfig(elem, getvalue, select_name_value, class_name, tfc) {

    if (typeof tfc == "undefined" || tfc == "") {
        tfc = 1;
    }

    if (typeof getvalue == "undefined" || getvalue == "") {
        return false;
    }
    if (typeof select_name_value == 'undefined') {
        select_name_value = [];
    }

    if (typeof class_name == 'undefined' || class_name == '') {
        class_name = 'campu\\|source_value';
    }
    var default_value = select_name_value[$(elem).parents('.block_first').find('.' + class_name).attr('name')];
    
    var college_id = $("[name='college_id']").val();
    $.ajax({
        url: '/leads/get-compaigns-source',
        type: 'post',
        dataType: 'json',
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

        data: {'get_value': getvalue, 'college_id': college_id, 'default_value': default_value, 'traffic_channel': tfc},

        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {

            if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                window.location.href = json['redirect'];
            } else if (typeof json['status'] != 'undefined' && json['status'] == 200 && $(elem).parents('.block_first').find('.' + class_name).length > 0) {

                if(appendFlag == 0){
                    appendFlag = 1;
                    $(elem).parents('.block_first').find('.' + class_name).html($.parseJSON(json['dropdown_values']));                    
                }else{
                    $(elem).parents('.block_first').find('.' + class_name).append($.parseJSON(json['dropdown_values']));
                }
                
                var sourceObj = $(elem).parents('.block_first').find('.' + class_name);
                
                if(typeof default_value != 'undefined' && default_value != ''){
                    $.each(JSON.parse(default_value), function(k, v){
                        $(elem).parents('.block_first').find('.' + class_name+' option[value="'+ v +'"]').prop('selected', true);
                    });
                }
                
                $(elem).parents('.block_first').find('.' + class_name+' option[value=""]').remove();  
                //Load Sumo Select
                var childSelection = $(elem).parents('.block_first').find('.' + class_name);
                childSelection.SumoSelect({search: true, searchText: 'Search here.', triggerChangeCombined: false  });
                $(elem).parents('.block_first').find('.' + class_name)[0].sumo.reload();
            }
            // open in edit mode then open medium
//            alert(class_name);
          //  getCompaignsMediumConfig(elem, default_value, select_name_value);
          //  getCompaignsNameConfig(elem, default_value, select_name_value,'','source_value');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

function getCompaignsMediumConfig(elem, getvalue, select_name_value, class_name) {
    if (typeof getvalue == "undefined" || getvalue == 0) {
        return false;
    }
    var publisher_val = '';
    var default_value = '';
    if (typeof select_name_value == 'undefined') {
        select_name_value = [];
    }
    if (typeof class_name == 'undefined' || class_name == '') {
        class_name = 'campu\\|medium_value';
    }

    if (class_name == 'campu\\|medium_value') {
        publisher_val = $(elem).parents('.block_first').find(".campu\\|publisher_id.sel_value").val();
        default_value = select_name_value[$(elem).parents('.block_first').find('.' + class_name).attr('name')];
    } else {
        publisher_val = $(elem).parents('.block_first').find(".publisher_filter").val();
        default_value = select_name_value[$(elem).parents('.block_first').find('.' + class_name).attr('name')];
    }

    var college_id = $("[name='college_id']").val();
    $.ajax({
        url: '/leads/get-compaigns-medium',
        type: 'post',
        dataType: 'json',
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

       // data: {'get_value': getvalue, 'publisher_id': publisher_val, "college_id": college_id, 'default_value': default_value},
        data: {'get_value': getvalue, "college_id": college_id, 'default_value': default_value},

        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                window.location.href = json['redirect'];
            } else if (typeof json['status'] != 'undefined' && json['status'] == 200 && $(elem).parents('.block_first').find('.' + class_name).length > 0) {
                
                if(appendFlag == 0){
                    appendFlag = 1;
                    $(elem).parents('.block_first').find('.' + class_name).html($.parseJSON(json['dropdown_values']));
                }else{
                    $(elem).parents('.block_first').find('.' + class_name).append($.parseJSON(json['dropdown_values']));
                }
                if(typeof default_value != 'undefined' && default_value != ''){
                    $.each(JSON.parse(default_value), function(k, v){
                        $(elem).parents('.block_first').find('.' + class_name+' option[value="'+ v +'"]').prop('selected', true);
                    });
                }

                $(elem).parents('.block_first').find('.' + class_name+' option[value=""]').remove(); 
                
                //Load Sumo Select
                var childSelection = $(elem).parents('.block_first').find('.' + class_name);
                childSelection.SumoSelect({search: true, searchText: 'Search here.', triggerChangeCombined: false  });
                $(elem).parents('.block_first').find('.' + class_name)[0].sumo.reload();
            }
            
             
            
            //getCompaignsNameConfig(elem, default_value, select_name_value);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

function getCompaignsNameConfig(elem, getvalue, select_name_value, class_name,parent_source) {
    
    if (typeof getvalue == "undefined" || getvalue == '') {
        return false;
    }
    var default_value, publisher_val;

    if (typeof select_name_value == 'undefined') {
        select_name_value = [];
    }
    if (typeof class_name == 'undefined' || class_name == '') {
        class_name = 'campu\\|name_value';
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
    var college_id = $("[name='college_id']").val();

    $.ajax({
        url: '/leads/get-compaigns-name',
        type: 'post',
        dataType: 'json',
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

       // data: {'get_value': getvalue, 'publisher_id': publisher_val, 'college_id': college_id, 'default_value': default_value,'parent_source':parent_source},
        data: {'get_value': getvalue, 'college_id': college_id, 'default_value': default_value,'parent_source':parent_source},
   
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            
            if (typeof json['redirect'] != 'undefined' && json['redirect'] != "" ) {
                window.location.href = json['redirect'];
            } else if (typeof json['status'] != 'undefined' && json['status'] == 200 
                    && $(elem).parents('.block_first').find('.' + class_name).length > 0) {
              
                if(appendFlag == 0){
                    appendFlag = 1;
                    $(elem).parents('.block_first').find('.' + class_name).html($.parseJSON(json['dropdown_values']));
                }else{
                    $(elem).parents('.block_first').find('.' + class_name).append($.parseJSON(json['dropdown_values']));
                }
                
                if(typeof default_value != 'undefined' && default_value != ''){
                    $.each(JSON.parse(default_value), function(k, v){
                        $(elem).parents('.block_first').find('.' + class_name+' option[value="'+ v +'"]').prop('selected', true);
                    });
                }
                $(elem).parents('.block_first').find('.' + class_name+' option[value=""]').remove();
                
                //Load Sumo Select
                var childSelection = $(elem).parents('.block_first').find('.' + class_name);
                childSelection.SumoSelect({search: true, searchText: 'Search here.', triggerChangeCombined: false  });
                $(elem).parents('.block_first').find('.' + class_name)[0].sumo.reload();
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
function getReferrerListConfig(elem, select_name_value, class_name,tfc) 
{
    var college_id = $(elem).parents().find('input[name="college_id"], select[name="college_id"]').val();
    if (typeof select_name_value == 'undefined') {
        select_name_value = [];
    }
    if(typeof tfc =='undefined'){
        var tfc = $(elem).val();
    }
    if (typeof class_name == 'undefined' || class_name == '') {
        class_name = 'campu\\|publisher_id';
    }
    var htmlOption = '<option value="">Publisher/Referrer</option>';
    
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
        data: {'college_id': college_id, 'traffic_channel': tfc},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {

            var responseObject = $.parseJSON(json);
            if(responseObject.status==1){
                if(typeof responseObject.data.sourceList === "object"){
                    var sourceList    = responseObject.data.sourceList;
                    $.each(sourceList, function (index, item) {
                        htmlOption +='<option value="'+index+'">'+item+'</option>';
                    });
                    var publisher_id = select_name_value[$(elem).parents('.block_first').find('.' + class_name).attr('name')];
                    $(elem).parents('.block_first').find('.' + class_name).append(htmlOption);
                    $(elem).parents('.block_first').find('.' + class_name+' option[value=""]').remove();

                    if (typeof publisher_id !== 'undefined' && publisher_id !== null && publisher_id.length > 0) {
                        $(elem).parents('.block_first').find('.' + class_name).val($.parseJSON(publisher_id));
                    }
                    if($(elem).parents('.block_first').find('.' + class_name).length > 0){
                        //Load Sumo Select
                        var childSelection = $(elem).parents('.block_first').find('.' + class_name);
                        childSelection.SumoSelect({search: true, searchText: 'Search here.', triggerChangeCombined: false  });
                        $(elem).parents('.block_first').find('.' + class_name)[0].sumo.reload();
                    }
                }
            }else{
                if (responseObject.message === 'session') {
                    location.reload();
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

function loadDefaultValueOnLoad(select_name_value, div_id) {
//     $('#CollegeConfigurationSection .loader-block').show();
    // load city if
    if (typeof select_name_value == 'undefined') {
        select_name_value = [];
    }

    $('#' + div_id + ' .sel_value').each(function () {

        // call function according to class type
        var elemClass = $(this).attr('class');
        var currentElementObj = $(this);
        if (typeof elemClass != 'undefined' && elemClass.indexOf('countryid') > -1) {
            //GetChildByMachineKeyConfig(this, "stateid", "State", select_name_value);
        }else if (typeof elemClass != 'undefined' && elemClass.indexOf('district_id') > -1) {
            loadSavedAliases(currentElementObj,'district_id');
        }
        else if (typeof elemClass != 'undefined' && elemClass.indexOf('lead_sub_stage') > -1) {
            loadSavedAliases(currentElementObj,'lead_sub_stage');
        }
        else if (typeof elemClass != 'undefined' && elemClass.indexOf('city_id') > -1) {
            loadSavedAliases(currentElementObj,'city_id');
        } else if (typeof elemClass != 'undefined' && elemClass.indexOf('traffic_channel') > -1) {

               populatePublisherReferrers(currentElementObj, select_name_value, $(this).val(), '');

        } else if (typeof elemClass != 'undefined' && elemClass.indexOf('publisher_filter') > -1) {

            $.each($(this).val(), function(k,pub_value){
                var tfc = 1;
                if(pub_value != null && typeof pub_value !='undefined' && pub_value!='' && (/___/.test(pub_value))){
                    var pub_value_ar = pub_value.split('___');
                    pub_value = pub_value_ar[0];
                    if(typeof pub_value_ar[1] !='undefined'){
                        tfc = pub_value_ar[1];
                    }
                }
                getCompaignsSourceConfig(currentElementObj, pub_value, select_name_value,'', tfc);
            });
            appendFlag = 0;


        } else if (typeof elemClass != 'undefined' && elemClass.indexOf('source_value') > -1) {
            var source_val_arr = $(this).val();
            if(source_val_arr != null && typeof source_val_arr !='undefined' && source_val_arr !=''){
                
                $.each(source_val_arr, function(k, source_value){
                     if(source_value != null && typeof source_value !='undefined' && source_value!='' && source_value.indexOf('__') > -1){
                        var source_name_ar = source_value.toString().split('___');
                        source_value = source_name_ar[0];
                    }

                    getCompaignsMediumConfig(currentElementObj, source_value, select_name_value);
                    getCompaignsNameConfig(currentElementObj, source_value, select_name_value,'','source_value');
                });
                appendFlag = 0;
            }
            
        } else if (typeof elemClass != 'undefined' && elemClass.indexOf('medium_value') > -1) {
            
            var medium_value_arr = $(this).val();
            if(medium_value_arr != null && medium_value_arr != ''){
                $.each(medium_value_arr, function(k, medium_value){
                    if(medium_value != null && typeof medium_value !='undefined' && medium_value!=''){
                    var medium_name_ar = medium_value.split('___');
                    medium_value = medium_name_ar[0];
                }
                getCompaignsNameConfig(currentElementObj, medium_value, select_name_value);
              });
              appendFlag = 0;
           }
            
        }else if (typeof elemClass != 'undefined' && elemClass.indexOf('career_utsav_id') > -1) {
            var selectedEvents = $(this).val();
            populateCareerUtsavAreaOfIntrest(currentElementObj, selectedEvents, select_name_value);            
        }else if (typeof elemClass != 'undefined' && elemClass.indexOf('career_utsav_area_id') > -1) {            
            var selectedEvents = $(currentElementObj).parents('div.block_first').find('.career_utsav_id').last().val();
            var selectedUtsavArea = $(this).val();
            populateCareerUtsavSeminarMockPrefList(currentElementObj, selectedEvents, selectedUtsavArea, select_name_value);                      
        }
    });
}


function loadDefaultValueOnLoadApplication(select_name_value, div_id) {
//     $('#CollegeConfigurationSection .loader-block').show();
    // load city if
    if (typeof select_name_value == 'undefined') {
        select_name_value = [];
    }

    $('#' + div_id + ' .sel_value').each(function () {
        // call function according to class type
        var elemClass = $(this).attr('class');
        var currentElementObj = $(this);
        var elemName = $(this).attr('name');
        
        if (typeof elemClass != 'undefined' && elemClass.indexOf('field_') > -1) {
            
            var default_value = select_name_value[elemName];
            
            if(typeof default_value != 'undefined' && default_value != ''){
                if($(currentElementObj).parents('.block_first').find('[name="' + elemName+'"]').length){
                    
                    $.each(JSON.parse(default_value), function(k, v){  
                        $(currentElementObj).parents('.block_first').find('[name="' + elemName+'"] option[value="'+ v +'"]').prop('selected', true);
                    });                
                    $(currentElementObj).parents('.block_first').find('[name="' + elemName+'"]')[0].sumo.reload();
                }
                
            }
            
        } else if(typeof elemClass != 'undefined' && elemClass.indexOf('countryid') > -1) {
            //GetChildByMachineKeyConfig(this, "stateid", "State", select_name_value);
        } else if (typeof elemClass != 'undefined' && elemClass.indexOf('stateid') > -1) {
            //GetChildByMachineKeyConfig(this, "cityid", "City", select_name_value);
        } 
        else if (typeof elemClass != 'undefined' && elemClass.indexOf('district_id') > -1) {
            
            loadSavedAliases(currentElementObj,'district_id');
        }else if (typeof elemClass != 'undefined' && elemClass.indexOf('lead_sub_stage') > -1) {
            loadSavedAliases(currentElementObj,'lead_sub_stage');
        }
        else if (typeof elemClass != 'undefined' && elemClass.indexOf('city_id') > -1) {
            
            loadSavedAliases(currentElementObj,'city_id');
        } else if (typeof elemClass != 'undefined' && elemClass.indexOf('traffic_channel') > -1) {
            if ($(this).val() == 1) {//campaign option
                getPublisherListConfig(this, select_name_value, 'publisher_filter');
            } else if ($(this).val() == 5 || $(this).val() == 3 || $(this).val() == 4) {
                getReferrerListConfig(this, select_name_value, 'publisher_filter');
            }
        } else if (typeof elemClass != 'undefined' && elemClass.indexOf('publisher_filter') > -1) {
            
             $.each($(this).val(), function(k,pub_value){
                var tfc = 1;
                if(typeof pub_value !='undefined' && pub_value!='' && (/___/.test(pub_value))){
                    var pub_value_ar = pub_value.split('___');
                    pub_value = pub_value_ar[0];
                    if(typeof pub_value_ar[1] !='undefined'){
                        tfc = pub_value_ar[1];
                    }
                }
                //conversion source
                getCompaignsSourceConfig(currentElementObj, pub_value, select_name_value, 'campap\\|conversion_source_value');
                getCompaignsSourceConfig(currentElementObj, pub_value, select_name_value,'', tfc);
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

                    getCompaignsMediumConfig(currentElementObj, source_value, select_name_value, 'campap\\|conversion_medium_value');
                    getCompaignsNameConfig(currentElementObj, source_value, select_name_value, 'campap\\|conversion_name_value');
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
                    getCompaignsMediumConfig(currentElementObj, source_value, select_name_value);
                    getCompaignsNameConfig(currentElementObj, source_value, select_name_value);
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

                getCompaignsNameConfig(currentElementObj, medium_value, select_name_value, 'campap\\|conversion_name_value');
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
                getCompaignsNameConfig(currentElementObj, medium_value, select_name_value);
              });
              appendFlag = 0;
           }
        }else if (typeof elemClass != 'undefined' && elemClass.indexOf('career_utsav_id') > -1) {
            var selectedEvents = $(this).val();
            populateCareerUtsavAreaOfIntrest(currentElementObj, selectedEvents, select_name_value);
        }else if (typeof elemClass != 'undefined' && elemClass.indexOf('career_utsav_area_id') > -1) {            
            var selectedEvents = $(currentElementObj).parents('div.block_first').find('.career_utsav_id').last().val();
            var selectedUtsavArea = $(this).val();
            populateCareerUtsavSeminarMockPrefList(currentElementObj, selectedEvents, selectedUtsavArea, select_name_value);                      
        }
    });
}


//call getCompaignsMedium() medium_value by source_value 
$(document).on('change', "select.campap\\|conversion_source_value.sel_value", function () {
    
    if ($(this).val() == '') {//check publisher value
        return false;
    }
    var source_value_arr = $(this).val();
    var currentObj = $(this);
    
    if(source_value_arr != null && source_value_arr != ''){
        $.each(source_value_arr, function(k, source_value){
            if(typeof source_value !='undefined' && source_value != ''){
                var source_name_ar = source_value.toString().split('___');
                source_value = source_name_ar[0];
            }
            var sel_mvalue = '';
            getCompaignsMediumConfig(currentObj, source_value, sel_mvalue, 'campap\\|conversion_medium_value');
            getCompaignsNameConfig(currentObj, source_value, sel_mvalue, 'campap\\|conversion_name_value');
        });
        appendFlag = 0; 
    }
    
});

//call getCompaignsName() name_value by medium_value 
$(document).on('change', "select.campap\\|conversion_medium_value.sel_value", function () {
    //getCompaignsName();
    $(this).parents('.block_first').find(".campap\\|conversion_name_value").html("<option value=''>Campaign Name</option>");
    
    if ($(this).val() == '') {//check publisher value
        return false;
    }
    var medium_values = $(this).val();
    
    if(medium_values.length > 0){
        $.each(medium_values, function(k, medium_value){
            var medium_name_ar = medium_value.split('___');
            medium_value = medium_name_ar[0];
            var sel_nvalue = '';
            getCompaignsNameConfig(this, medium_value, sel_nvalue, 'campap\\|conversion_name_value');
        });
    }
    
    
});



//call getCompaignsMedium() medium_value by source_value 
$(document).on('change', "select.campu\\|source_value.sel_value", function () {
    
    if ($(this).val() == '') {//check publisher value
        return false;
    }
    
    var source_val_arr = $(this).val();
    var currentObj = $(this);
    
    if(source_val_arr != null && typeof source_val_arr !='undefined' && source_val_arr !=''){
        $.each(source_val_arr, function(k, source_value){
            console.log("source_value: ",source_value);
            if(typeof source_value !='undefined' && source_value != ''){
                var source_name_ar = source_value.toString().split('___');
                source_value = source_name_ar[0];
                var sel_mvalue = '';
                getCompaignsNameConfig(currentObj, source_value, sel_mvalue,'','source_value');
                getCompaignsMediumConfig(currentObj, source_value, sel_mvalue);
            }
        });
        appendFlag = 0;
    }
    
    
});

//call getCompaignsName() name_value by medium_value 
$(document).on('change', "select.campu\\|medium_value.sel_value", function () {
    //getCompaignsName();
    $(this).parents('.block_first').find(".campu\\|name_value").html("<option value=''>Campaign Name</option>");
    
    var medium_value_arr = $(this).val();
    var currentObj = $(this);
   
    if(medium_value_arr != null && medium_value_arr != ''){
       $.each(medium_value_arr, function(k, medium_value){
        if(typeof medium_value !='undefined' && medium_value!=''){
            var medium_name_ar = medium_value.split('___');
            medium_value = medium_name_ar[0];
        }
        var sel_nvalue = '';
        getCompaignsNameConfig(currentObj, medium_value, sel_nvalue);
      });
      appendFlag = 0;
   }
    
});

//populate career utsav area of interest for career utsav event
$(document).on('change', "select.career_utsav_id.sel_value", function () {

    var selectedEvents = $(this).val();
    var currentElementObj = $(this);
    
    populateCareerUtsavAreaOfIntrest(currentElementObj, selectedEvents);
         
});

//populate career utsav Mock and Semianr Preference list
$(document).on('change', "select.career_utsav_area_id.sel_value", function () {

    var selectedUtsavArea = $(this).val();    
    var currentElementObj = $(this);    
    var selectedEvents = $(currentElementObj).parents('.block_first').find('select.career_utsav_id.sel_value').val();
    
    populateCareerUtsavSeminarMockPrefList(currentElementObj, selectedEvents, selectedUtsavArea);
    
     
});

//call publister list by traffic channel selected campain options
$(document).on('change', "select.traffic_channel.sel_value", function () {

    var selectedChannel = $(this).val();
    var currentElementObj = $(this);
     
    populatePublisherReferrers(currentElementObj, [], selectedChannel)
    
});

//call getCompaignsSource() by publisher id  and Campaion source values and medium ,Name withour values
$(document).on('change', "select.campu\\|publisher_id.sel_value,select.publisher_filter.sel_value", function () {
    //When Publisher value will change then reset all below div id value
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
    
    
    var sel_svalue = '';
    var pub_value = $(this).val(); 
    var currentObject = $(this);

    $.each(pub_value, function(k,pub_val_single){
        var pub_val_ar = pub_val_single.split('___');
        var pub_val = pub_val_ar[0];
        getCompaignsSourceConfig(currentObject, pub_val, sel_svalue);
        getCompaignsSourceConfig(currentObject, pub_val, sel_svalue, 'campap\\|conversion_source_value');
        
    });
    
    appendFlag = 0; //reinitialize
});

$(document).on('change', "select.sel_value", function () {
            
    var ct = $(this).data('ct');
    var field = $(this).data('field');
    if(typeof field =='undefined' || field==''){
        return;
    }
    if(ct!='application'){
        return;
    }
    
    var field_data = {};
    var form_id = jQuery(this).parents('form').find('[name="form_id"]').val();
    
    field_data[field]           = jQuery(this).val();
    field_data['current_field'] = field;
    field_data['form_id']       = form_id;
    field_data['find_value_type']= 'next';
    
    //If registration dependent html data is exist then return from here (Dont execute child dependent ajax)
    var currentFieldName = $(this).attr('name');
    var parentName    = currentFieldName.replace('[values][]', '[fields]');
    var currentObj = jQuery(this).parents('form').find("[name='" + parentName + "']");
    if(typeof currentObj !== 'undefined' && currentObj.length) {
        var dependentDropdownJson = (typeof $(currentObj).data('registrationdependent') !== 'undefined') ? $(currentObj).data('registrationdependent') :'';
        
        /*
        var getDependentData = setDependentFieldAttributes(currentObj,html_field_id);
                        
        var parentDependentName = getDependentData['parentDependentName'];
        var childDependentName = getDependentData['childDependentName'];
        */
        return;
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
                    for (var lkey in json['option']) {
                        html += '<option value="' + lkey + '">' + json['option'][lkey] + '</option>';
                    }
                    if(typeof json['child_field'] !='undefined' && jQuery('.'+field).parents('.block_first').find('.'+json['child_field']).length > 0){
                        var childfield = json['child_field'];
                        jQuery('.'+field).parents('.block_first').find('.'+childfield).html(html);
                        jQuery('.'+field).parents('.block_first').find('.'+childfield)[0].sumo.reload();
                    }
                }
//                alert(jQuery(currentObj).parents('.block_first').find('.' + field).length);
                
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
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

function updateOperator(type, container_name, selected) {

    if (typeof selected == 'undefined') {
        selected = '';
    }

    var html = '<option value="">Select Condition</option>';
    var operator = {
        'dropdown': {
            'eq_dd': 'Include',
            'neq_dd': 'Exclude'
        },
        'predefined_dropdown': {
            'eq_pd': 'Include',
            'neq_pd': 'Exclude'
        },
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
            'eq_like': 'Exactly Matches'
        },
        'date': {
            'between': 'Between',
            'before': 'Before',
            'after': 'After'
        }
    };

    if (typeof type != 'undefined' && ['dropdown', 'text', 'date','predefined_dropdown'].indexOf(type) > -1) {        
        for (var lkey in operator[type]) {
            html += '<option value="' + lkey + '">' + operator[type][lkey] + '</option>';
        }
    }
    jQuery("[name='" + container_name + "']").html(html);
    jQuery("[name='" + container_name + "']").val(selected);
    jQuery('.chosen-select').chosen();
}

function createTypeahead(elem, type) {
    elem.typeahead({
        hint: true,
        highlight: true,
        minLength: 3,
        source: function (request, response) {
            var search = $(elem).val();
            var college_id = $('[name="college_id"]').val();
            // calculated and return parent id
            var parent_id =   getParentId(elem,type);
            
            if (search) {
                $.ajax({
                    url: '/common/entityAutoSearch',
                    data: {
                        'search': search,
                        'college_id': college_id,
                        'parent_id': JSON.stringify(parent_id),
                        'type': type
                    },
                    dataType: "json",
                    type: "POST",
                    headers: {
                        "X-CSRF-Token": jsVars._csrfToken
                    },                   
                    success: function (data) {
                        items = [];
                        var map = [];
                        $.each(data.list, function (i, item) {
                            var name = item;
                            map.push({name: name, i: i, field: $(elem).attr('name')});
                        });
                        response(map);
                        $(".dropdown-menu").css("height", "auto");
                    },
                    error: function (response) {
                        alertPopup(response.responseText);
                    },
                    failure: function (response) {
                        alertPopup(response.responseText);
                    }
                });
            }
        },
        updater: function (item) {
            var field_name = item.field;
            field_name = field_name.replace('[values]', '[values_id]');
            $("[name='" + field_name + "']").remove();
            $("[name='" + item.field + "']")
                    .parents('.field_value_div')
                    .append('<input type="hidden" name="' + field_name + '" value="' + item.i + '" class="sel_value_hidden" />');
            return item;
        }
    });
}


function getParentId(elem,type){
    var parent_id = '';
    if(type=='city'){
        // get state id by name of element
        // auto complete id is saved in hidden field with name values_id
        var parent_name = $(elem).parents('.block_first').find('.ud\\|state_id').last().attr('name');
        if(typeof parent_name != 'undefined' && parent_name !=''){
            parent_id = $('[name="'+parent_name+'"]').val();
        }
    }else if(type=='lead_sub_stage'){
        // get state id by name of element
        // auto complete id is saved in hidden field with name values_id
        var parent_name = $(elem).parents('.block_first').find('.ud\\|lead_stage').last().attr('name');
        if(typeof parent_name != 'undefined' && parent_name !=''){
            parent_id = $('[name="'+parent_name+'"]').val();
        }
    }else if(type=='district'){
        // get state id by name of element
        // auto complete id is saved in hidden field with name values_id
        var parent_name = $(elem).parents('.block_first').find('.ud\\|state_id').last().attr('name');
        if(typeof parent_name != 'undefined' && parent_name !=''){
            parent_id = $('[name="'+parent_name+'"]').val();
        }
    }else if(type=='state'){
        // get country id 
        var parent_id = $(elem).parents('.block_first').find('.countryid').last().val();
    }
    return parent_id;
}
 
function checkDependentField(field,currentObj, selected){
    
    if(typeof field =='undefined' || field==''){
        return
    }
    var field_data = {};
    jQuery(currentObj).parents('.block_first').find('select.sel_value').each(function(){
        var prev_field = jQuery(this).data('field');
        var value = jQuery(this).val();
        field_data[prev_field]  = value;
    });
    
    var form_id = jQuery(currentObj).parents('form').find('[name="form_id"]').val();
    
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
                    for (var lkey in json['option']) {
                        html += '<option value="' + lkey + '">' + json['option'][lkey] + '</option>';
                    }
                    
                    if(jQuery(currentObj).parents('.block_first').find('.' + field).length > 0){
                        jQuery(currentObj).parents('.block_first').find('.' + field).html(html);
                        jQuery(currentObj).parents('.block_first').find('.' + field)[0].sumo.reload();
                    }
                }
            }
        
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

//Save Counsellor config section data
function SaveTelephonyConfigData(Section, collegeId) 
{
    if((typeof collegeId === 'undefined') || (parseInt(collegeId) === '') || (parseInt(collegeId) < 1)) {
        return false;
    }
    //remove all error msg
    $('#' + Section + ' #collapseTelephony' + collegeId + ' div.has-error').removeClass('has-error');
    $('#' + Section + ' #collapseTelephony' + collegeId + ' span.help-block').html('').hide();
    // loader
    $('#CollegeConfigurationSection .loader-block').show();
    // serialize all form data
    var data = $('#' + Section + ' #collapseTelephony' + collegeId + ' input, #' + Section + ' #collapseTelephony' + collegeId + ' select').serializeArray();
    data.push({name: "college_id", value: collegeId});
    $.ajax({
        url: '/users/saveCounsellorTelephonyConfig/' + jsVars.CounsellorConfigurationString,
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
            if (json['redirect']) {
                // if session is out
                location = json['redirect'];
            } 
            else if (json['error']) {
                // error display in popup
                alertPopup(json['error'], 'error');
            }
            else if (json['errorList']) {
                for(var field in json['errorList']) {
                    var parent = $('#' + Section + ' #collapseTelephony' + collegeId + ' div.' + field);
                    $(parent).find('span.help-block').html(json['errorList'][field]).show();
                    $(parent).addClass('has-error');
                }
            }
            else if (json['success'] == 200){
                alertPopup(json['Msg'], 'Success');
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

function sumoDropdown(){

    $('#CounsellorFormConfigContainerAllocation, #collapseLeadAllocConfig').find('.sumo_select').each(function(){ 
       this.selected = false;
       id =$(this); //.attr('id'); 
       if(id !=='items-no-show'){
          placeholder =$(this).data('placeholder');
       id.SumoSelect({placeholder: placeholder, search: true, searchText:placeholder,  triggerChangeCombined: false }); 

        id[0].sumo.reload();  
       }
    });

}

function populatePublisherReferrers(currentElementObj, select_name_value, selectedChannel, html_field_id){
    if(typeof selectedChannel != 'undefined' && selectedChannel !== null){
        $.each(selectedChannel, function(k,channelVal){
           if(k >= 1){
               appendFlag = 1;
           } 
           if (channelVal == 1 || channelVal == 8) {//campaign option                      

                getPublisherListConfig(currentElementObj, select_name_value, 'publisher_filter',channelVal);
            } else if (channelVal == 5 || channelVal == 3 || channelVal == 4) {                

                getReferrerListConfig(currentElementObj, select_name_value, 'publisher_filter',channelVal);
            } 
        });
        
        appendFlag = 0;
    }

}

//apply_lead_allocation_to_application
//changing the configuration based on radio selection
$(document).ready(function(){
    var checkedLeadAllocation = $('input[type=radio][name=apply_lead_allocation_to_application]:checked').val();
    
    if(checkedLeadAllocation == 1){
        $('#CounsellorFormConfigContainer').show();
        $('#CounsellorFormConfigContainerAllocation').hide();
        $('#allocationByleadSubmitCont').show();
    }else{            
        $('#CounsellorFormConfigContainerAllocation').show();
        $('#allocationByleadSubmitCont').hide();
    }
    
    $('input[type=radio][name=apply_lead_allocation_to_application]').on('change', function(){
        var val = $(this).val();
        if(val == 1){
            $('#CounsellorFormConfigContainer').show();
            $('#CounsellorFormConfigContainerAllocation').hide();
            $('#allocationByleadSubmitCont').show();
        }else{            
            $('#CounsellorFormConfigContainerAllocation').show();
            $('#allocationByleadSubmitCont').hide();
            //collapsed all the form conditions
            $('#collapseAppAllocConfig .accordion-content').each(function(){
                $(this).find('.form_logic_block').html('');
                $(this).find('.row div a').hide();
                $(this).find('.row div button').hide();
            });
           
        }
    });
    
    
});

function hideAutoSpan(){
    //make autospan hide whenever clicked on input search box
    $('ul.autosuggest').remove();
}

function populateDistrictDropdown(elem, searchText, autoSpanId) {
    if(searchText.length >= 3){
        var html = '';
        var results = {};
        var parnetElem = $('[name="' + elem + '"]');
        var table_columns_obj = fetchCityValues(parnetElem, 'district', searchText) ;
        for (key in table_columns_obj) {
            
            var str = table_columns_obj[key];
            var re = new RegExp(searchText, 'i');
            if (re.test(str)) {
                html += "<li onclick=\"setDistrictValue('" + elem + "','" + autoSpanId + "','" + key + "','" + str + "')\">" + str + "</li>";
            }
        }

        if (html != '') {
            var ul = "<ul class='autosuggest'>" + html + "</ul>";
            jQuery('#load_table_column_' + autoSpanId).show();
            jQuery('#load_table_column_' + autoSpanId).html(ul);

        }
    }
    
}

function populateCityDropdown(elem, searchText, autoSpanId){
    
    if(searchText.length >= 3){
        var html = '';
        var results = {};
        var parnetElem = $('[name="' + elem + '"]');
        var prevVal = $(parnetElem).val();
        var prevValExplode = prevVal.split(',');
        var table_columns_obj = fetchCityValues(parnetElem, 'city', searchText) ;
        for (key in table_columns_obj) {
            
            var str = table_columns_obj[key];
            var re = new RegExp(searchText, 'i');
            if (re.test(str)) {
                if($.inArray( key, prevValExplode)==-1){
                    html += "<li onclick=\"setCityValue('" + elem + "','" + autoSpanId + "','" + key + "','" + str + "')\">" + str + "</li>";
                }
            }
        }

        if (html != '') {
            var ul = "<ul class='autosuggest'>" + html + "</ul>";
            jQuery('#load_table_column_' + autoSpanId).show();
            jQuery('#load_table_column_' + autoSpanId).html(ul);

        }
    }
    
}

function populateLeadSubStageDropdown(elem, searchText, autoSpanId){
    
    if(searchText.length >= 3){
        var html = '';
        var results = {};
        var parnetElem = $('[name="' + elem + '"]');
        var prevVal = $(parnetElem).val();
        var prevValExplode = prevVal.split(',');
        var table_columns_obj = fetchCityValues(parnetElem, 'lead_sub_stage', searchText) ;
        for (key in table_columns_obj) {
            
            var str = table_columns_obj[key];
            var re = new RegExp(searchText, 'i');
            if (re.test(str)) {
                if($.inArray( key, prevValExplode)==-1){
                    html += "<li onclick=\"setLeadSubStageValue('" + elem + "','" + autoSpanId + "','" + key + "','" + str + "')\">" + str + "</li>";
                }
            }
        }

        if (html != '') {
            var ul = "<ul class='autosuggest'>" + html + "</ul>";
            jQuery('#load_table_column_' + autoSpanId).show();
            jQuery('#load_table_column_' + autoSpanId).html(ul);

        }
    }
    
}

function setLeadSubStageValue(elem, k, key, str) {
    
    var tag_key = '<span id="' + key + '">' + str + ' <i onclick="removeAliasField(\'' + elem + '\',\'' + k + '\', \'' + key + '\',this);" aria-hidden="true" class="fa fa-times"></i></span>';
    $("#border_selected_tag_" + k).append(tag_key);
    
    $('#input_here_'+k).val('');
    $('#load_table_column_' + k).html('');
    $('#load_table_column_' + k).hide();

    var existing_val =  $('[name="' + elem + '"]').val();
    if (existing_val == '') {
        existing_val = key;
    } else {
        existing_val += ',' + key;
    }

    $('[name="' + elem + '"]').val(existing_val);
}

function setCityValue(elem, k, key, str) {

    var tag_key = '<span id="' + key + '">' + str + ' <i onclick="removeAliasField(\'' + elem + '\',\'' + k + '\', \'' + key + '\',this);" aria-hidden="true" class="fa fa-times"></i></span>';
    $("#border_selected_tag_" + k).append(tag_key);
    
    $('#input_here_'+k).val('');
    $('#load_table_column_' + k).html('');
    $('#load_table_column_' + k).hide();

    var existing_val =  $('[name="' + elem + '"]').val();
    if (existing_val == '') {
        existing_val = key;
    } else {
        existing_val += ',' + key;
    }

    $('[name="' + elem + '"]').val(existing_val);

}

function setDistrictValue(elem, k, key, str) {
 
    var tag_key = '<span id="' + key + '">' + str + ' <i onclick="removeAliasField(\'' + elem + '\',\'' + k + '\', \'' + key + '\',this);" aria-hidden="true" class="fa fa-times"></i></span>';
    $("#border_selected_tag_" + k).append(tag_key);
    
    $('#input_here_'+k).val('');
    $('#load_table_column_' + k).html('');
    $('#load_table_column_' + k).hide();

    var existing_val =  $('[name="' + elem + '"]').val();
    if (existing_val == '') {
        existing_val = key;
    } else {
        existing_val += ',' + key;
    }

    $('[name="' + elem + '"]').val(existing_val);

}

function removeAliasField(elem, k, key, aliasElem) {

    var alias_value = $('[name="' + elem + '"]').val();
    if (alias_value != '') {
        alias_value_array = alias_value.split(',');

        var index = alias_value_array.indexOf(key);
        if (index > -1) {
            alias_value_array.splice(index, 1);
        }
        var alisa_val = '';
        if (alias_value_array.length > 0) {
            var alisa_val = alias_value_array.toString();
        }
        $('[name="' + elem + '"]').val(alisa_val);
        jQuery(aliasElem).parent('span').remove();
    }
}

function fetchCityValues(elem, type, search) {

    var college_id = $('[name="college_id"]').val();
    // calculated and return parent id
    var parent_id =   getParentId(elem,type);
    var map = {};
    
    $.ajax({
        url: '/common/entityAutoSearch',
        data: {
            'search': search,
            'college_id': college_id,
            'parent_id': JSON.stringify(parent_id),
            'entity_ids': '',
            'type': type
        },
        dataType: "json",
        type: "POST",
        async:false,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },                   
        success: function (data) {
            items = [];

            $.each(data.list, function (i, item) {
                var name = item;
                map[i] = name;
                
            });

            //$(".dropdown-menu").css("height", "auto");
        },
        error: function (response) {
            alertPopup(response.responseText);
        },
        failure: function (response) {
            alertPopup(response.responseText);
        }
    });
    
    
    return map;
    
}
function fetchAutoSpanId(cur_elem_name){
    var autoSpanId = cur_elem_name.replace(/\[|\]/g, '_');
    
    autoSpanId = autoSpanId.split('__');   

    autoSpanIdLength = autoSpanId.length;
    autoSpanIdPart1 = autoSpanId[0].split('_');
    autoSpanIdPart1 = autoSpanIdPart1[3];
    
    if(autoSpanIdLength >= 4 && autoSpanId[2] != 'values'){
        autoSpanIdPart2 = autoSpanId[1]+""+autoSpanId[2];
    }
    else{
        autoSpanIdPart2 = autoSpanId[1];
        
    }
    
    autoSpanId = autoSpanIdPart1+''+autoSpanIdPart2;
    
    return autoSpanId;
        
}
function loadSavedAliases(currentObj,callFrom){
    
    var college_id = $('[name="college_id"]').val();
    var selectedValues = currentObj.val();
    var cur_elem_name = currentObj.attr('name');
    var k = fetchAutoSpanId(cur_elem_name);
    
    if(selectedValues.trim() != ''){
        selectedValues = selectedValues.split(',');
    }
    
    if(selectedValues.length > 0){
        $.ajax({
            url: '/common/entityAutoSearch',
            data: {
                'search': 'none',
                'college_id': college_id,
                'entity_ids': JSON.stringify(selectedValues),
                'type': 'all',
                'callFrom': callFrom
            },
            dataType: "json",
            type: "POST",
            async:false,
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },                   
            success: function (data) {
                items = [];
                map = [];
                currentObj.val(''); //empty the current value for filling it thorugh setCityValue
                $.each(data.list, function (i, item) {
                    var name = item;                          
                    setCityValue(cur_elem_name, k, i, name);
                });
                
            },
            error: function (response) {
                alertPopup(response.responseText);
            },
            failure: function (response) {
                alertPopup(response.responseText);
            }
        });
    }

}

// Show/Hide IVR vendor Section 
function showHideIvrVendorSection(parentDiv, prefix, vendor)
{
    var vendorUpperCase = 'Ozontel';
    showHideAccordionSection(vendorUpperCase, parentDiv, prefix, vendor);
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


function PushtoVoiceSnap(Section, collegeId,CounsellorName,CounsellorEmail,cousellerID){
    if((typeof collegeId === 'undefined') || (parseInt(collegeId) === '') || (parseInt(collegeId) < 1) || typeof cousellerID=='undefined' || typeof CounsellorName=='undefined' || typeof CounsellorEmail=='undefined') {
        return false;
    }
    $('#' + Section + ' #collapseTelephony' + collegeId + ' div.has-error').removeClass('has-error');
    $('#' + Section + ' #collapseTelephony' + collegeId + ' span.help-block').html('').hide();
    // loader
    $('#CollegeConfigurationSection .loader-block').show();
    var data = $('#' + Section + ' #collapseTelephony' + collegeId + ' input, #' + Section + ' #collapseTelephony' + collegeId + ' select').serializeArray();
    data.push({name: "college_id", value: collegeId});
    data.push({name: "CounsellorName", value: CounsellorName});
    data.push({name: "CounsellorEmail", value: CounsellorEmail});
    data.push({name: "CousellerID", value: cousellerID});
    $.ajax({
        url: '/counsellors/pushToVoiceSnap/',
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
            if (json['redirect']) {
                // if session is out
                location = json['redirect'];
            } 
            else if (json['error']) {
                // error display in popup
                alertPopup(json['error'], 'error');
            }
            else if (json['errorList']) {
                for(var field in json['errorList']) {
                    var parent = $('#' + Section + ' #collapseTelephony' + collegeId + ' div.' + field);
                    $(parent).find('span').html(json['errorList'][field]).show();
                    $(parent).addClass('has-error');
                }
            }
            else if (json['success'] == 200){
                SaveTelephonyConfigData(Section,collegeId);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

}


/**
 * It will call on allocate button and allocate leads and application to given counsellor
 * @param {type} Section
 * @returns {undefined}
 */
function allocateLeadsToCounsellor(Section){
    var data = $('#' + Section).serialize();
    if(Section){
        $.ajax({
            url: jsVars.LeadsAllocationToCounsellorUrl+ '/' +jsVars.CounsellorConfigurationString,
            type: 'post',
            data: data,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('#CollegeConfigurationSection .loader-block').show();
            },
            complete: function () {
                $('#CollegeConfigurationSection .loader-block').hide();
            },
            success: function (json) {
                $('span.lead_error').html('').hide();
                if (json['error']) {
                    // error display in popup
                    alertPopup(json['error'], 'error');
                }else{
                    alertPopup(json['message'], 'Success');               
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }else{
        alertPopup('Some error occurred!', 'error');
    }
}
/**
 * Populate Career Utsav Area of Intrest List
 * @param {type} elem
 * @param {type} selectedEvents
 * @param {type} select_name_value
 * @returns {undefined}
 */
function populateCareerUtsavAreaOfIntrest(elem, selectedEvents, select_name_value){
    
    //empty dependent fields
    if($(elem).parents('.block_first').find('.career_utsav_area_id').length){
        $(elem).parents('.block_first').find('.career_utsav_area_id').html('');
        $(elem).parents('.block_first').find('.career_utsav_area_id')[0].sumo.reload();
    }
    if($(elem).parents('.block_first').find('.seminar_preference_id').length){  
        $(elem).parents('.block_first').find('.seminar_preference_id').html('');
        $(elem).parents('.block_first').find('.seminar_preference_id')[0].sumo.reload();
    }
    if($(elem).parents('.block_first').find('.mock_preference_id').length){
        $(elem).parents('.block_first').find('.mock_preference_id').html('');
        $(elem).parents('.block_first').find('.mock_preference_id')[0].sumo.reload();
    }
    
    if(selectedEvents !== null && selectedEvents.length){//prepare parameter
        selectedEvents = selectedEvents.join(',');        
    }else{
        return;
    }
    
    if (typeof select_name_value == 'undefined') {
        select_name_value = [];
    }
    
    $.ajax({
        url: '/common/get-career-area-list',
        type: 'post',
        dataType: 'json',
        data: {career_utsav_id:selectedEvents, fetch:'option'},
        async: false,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json)
        {

            if (json['redirect']) {
                location = json['redirect'];
            } else if (json['error']) {
                alertPopup(json['error'], 'error');
                $(elem).parents('.block_first').find('.career_utsav_area_id').html('');
            } else if(json['success']){
                
                var default_value = select_name_value[$(elem).parents('.block_first').find('.career_utsav_area_id').attr('name')];
                
                if($(elem).parents('.block_first').find('.career_utsav_area_id').length > 0){
                    $(elem).parents('.block_first').find('.career_utsav_area_id').html(json['careerUtsavArea']);
                    $(elem).parents('.block_first').find('.career_utsav_area_id')[0].sumo.reload();
                }  
                
                if(typeof default_value != 'undefined' && default_value != ''){
                    $.each(JSON.parse(default_value), function(k, v){
                        $(elem).parents('.block_first').find('.career_utsav_area_id'+' option[value="'+ v +'"]').prop('selected', true);
                    });
                    $(elem).parents('.block_first').find('.career_utsav_area_id')[0].sumo.reload();
                }

            } 

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
        }
    });
    
    
}

/**
 * populate seminar or Mock Preference List
 * @param {type} elem
 * @param {type} className
 * @param {type} selectedEvents
 * @param {type} selectedUtsavArea
 * @param {type} select_name_value
 * @returns {undefined}
 */
function populateCareerUtsavSeminarMockPrefList(elem, selectedEvents, selectedUtsavArea, select_name_value){
    
    //empty dependent fields
    if($(elem).parents('.block_first').find('.seminar_preference_id').length){  
        $(elem).parents('.block_first').find('.seminar_preference_id').html('');
        $(elem).parents('.block_first').find('.seminar_preference_id')[0].sumo.reload();
    }
    if($(elem).parents('.block_first').find('.mock_preference_id').length){
        $(elem).parents('.block_first').find('.mock_preference_id').html('');
        $(elem).parents('.block_first').find('.mock_preference_id')[0].sumo.reload();
    }
    
    if(selectedUtsavArea !== null && selectedUtsavArea.length
            && selectedEvents !== null && selectedEvents.length){//prepare parameter
        selectedEvents = selectedEvents.join(',');
        selectedUtsavArea = selectedUtsavArea.join('|||'); 
    }else{
        return;
    }
        
    if (typeof select_name_value == 'undefined') {
        select_name_value = [];
    }
    
    $.ajax({
        url: '/common/get-area-preference-list',
        type: 'post',
        dataType: 'json',
        data: { career_utsav_id:selectedEvents, 
                career_utsav_area_id:selectedUtsavArea, 
                fetch:'option',
                mock_preference_id:'',
                seminar_preference_id:''
            },
        async: false,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json)
        {

            if (json['redirect']) {
                location = json['redirect'];
            } else if (json['error']) {
                alertPopup(json['error'], 'error');
            } else if(json['success'] == 200){
                
                if(json['preferenceList']){//it will contains both mock & seminar preference list
                    
                    var preferenceLists = json['preferenceList'];
                    
                    $.each(preferenceLists, function(key, list){
                        
                        var className = '';
                        
                        if(key == 'mockList'){
                            className = 'mock_preference_id';
                        }else if(key == 'seminarList'){
                            className = 'seminar_preference_id';
                        }
                        
                        if(className != ''){
                            
                            var default_value = select_name_value[$(elem).parents('.block_first').find('.'+className).attr('name')];
                
                            if($(elem).parents('.block_first').find('.'+className).length > 0){
                                $(elem).parents('.block_first').find('.'+className).html(list);
                                $(elem).parents('.block_first').find('.'+className)[0].sumo.reload();
                            }  

                            if(typeof default_value != 'undefined' && default_value != ''){
                                $.each(JSON.parse(default_value), function(k, v){
                                    $(elem).parents('.block_first').find('.'+className+' option[value="'+ v +'"]').prop('selected', true);
                                });
                                $(elem).parents('.block_first').find('.'+className)[0].sumo.reload();
                            }
                            
                        }
                        
                    });
                    
                }
                
            } 

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
        }
    });
    
    
}

/**
 * SaveSenderIDConfigData - for overriding the college level sender ids
 * @param {type} Section
 * @param {type} collegeId
 * @returns {Boolean}
 */
function SaveSenderIDConfigData(Section, collegeId) 
{
    if((typeof collegeId === 'undefined') || (parseInt(collegeId) === '') || (parseInt(collegeId) < 1)) {
        return false;
    }
    //remove all error msg
    $('#' + Section + ' #collapseSenderID' + collegeId + ' div.has-error').removeClass('has-error');
    $('#' + Section + ' #collapseSenderID' + collegeId + ' span.help-block').html('').hide();
    // loader
    $('#CollegeConfigurationSection .loader-block').show();
    // serialize all form data
    var data = $('#' + Section + ' #collapseSenderID' + collegeId + ' input, #' + Section + ' #collapseSenderID' + collegeId + ' select').serializeArray();
    data.push({name: "college_id", value: collegeId});
    $.ajax({
        url: '/users/saveCounsellorSenderIDConfig/' + jsVars.CounsellorConfigurationString,
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
            // hide loader
            $('#CollegeConfigurationSection .loader-block').hide();
        },
        success: function (json) {
            if (json['redirect']) {
                // if session is out
                location = json['redirect'];
            } 
            else if (json['error']) {
                // error display in popup
                alertPopup(json['error'], 'error');
            }
            else if (json['errorList']) {
                for(var field in json['errorList']) {
                    var parent = $('#' + Section + ' #collapseTelephony' + collegeId + ' div.' + field);
                    $(parent).find('span').html(json['errorList'][field]).show();
                    $(parent).addClass('has-error');
                }
            }
            else if (json['success'] == 200){
                alertPopup(json['Msg'], 'Success');
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}


//populate course base specialization 
$(document).on('change', "select.ud\\|course_id.sel_value", function () {
    if ($(this).parents('.block_first').find(".ud\\|specialization_id").length > 0) {
        var selectedCourse = $(this).val();
        html = getSelectedCourseSpecialisation(selectedCourse)
        $(this).parents('.block_first').find(".ud\\|specialization_id").html(html);
        $(this).parents('.block_first').find(".ud\\|specialization_id")[0].sumo.reload();
    }
});

function getSelectedCourseSpecialisation(selectedCourse){
    
    if(typeof jsVars.fieldLabelMapping['ud|specialization_id'] != 'undefined'){
        html = '<option value="0">'+jsVars.fieldLabelMapping['ud|specialization_id']+jsVars.notAvailableText+'</option>'; 
    }else{
        html = '<option value="0">Specialization Not Available</option>';
    }
    if (selectedCourse != null && selectedCourse != '') {
        $.each(selectedCourse, function (k, courseValue) {
            if (typeof courseValue != 'undefined' && courseValue != '') {
                $.ajax({
                    url: '/common/GetChildByMachineKeyForRegistration',
                    type: 'post',
                    dataType: 'json',
                    data: {key: courseValue},
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

//Save Counsellor config section data
function SaveQMSConfigData(Section) {
    
    // loader
    $('#CollegeConfigurationSection .loader-block').show();
    // serialize all form data
    var data = $('#' + Section).serializeArray();
    $.ajax({
        url: '/users/saveQmsConfig/' + jsVars.CounsellorConfigurationString,
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
            if (json['redirect']) {
                // if session is out
                location = json['redirect'];
            } 
            else if (json['error']) {
                // error display in popup
                alertPopup(json['error'], 'error');
            }
            else if (json['success'] == 200){
                alertPopup(json['Msg'], 'Success');
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

function SaveUserConfigOptionData(Section, collapseDivId, collegeId) 
{
    if((typeof collegeId === 'undefined') || (parseInt(collegeId) === '') || (parseInt(collegeId) < 1)) {
        return false;
    }
    //remove all error msg
    $('#' + Section + ' #'+collapseDivId+ collegeId + ' div.has-error').removeClass('has-error');
    $('#' + Section + ' #'+collapseDivId+ collegeId + ' span.help-block').html('').hide();
    // loader
    $('#CollegeConfigurationSection .loader-block').show();
    // serialize all form data
    var data = $('#' + Section + ' #'+collapseDivId+ collegeId + ' input, #' + Section + ' #'+collapseDivId + collegeId + ' textarea').serializeArray();
    data.push({name: "college_id", value: collegeId});
    $.ajax({
        url: '/users/SaveUserConfigOptionData/' + jsVars.CounsellorConfigurationString,
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
            // hide loader
            $('#CollegeConfigurationSection .loader-block').hide();
        },
        success: function (json) {
            if (json['redirect']) {
                // if session is out
                location = json['redirect'];
            } 
            else if (json['error']) {
                // error display in popup
                alertPopup(json['error'], 'error');
            }
            else if (json['errorList']) {
                for(var field in json['errorList']) {
                    var parent = $('#' + Section + ' #collapseTelephony' + collegeId + ' div.' + field);
                    $(parent).find('span').html(json['errorList'][field]).show();
                    $(parent).addClass('has-error');
                }
            }
            else if (json['status'] == 200){
                alertPopup(json['message'], 'Success');
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}
