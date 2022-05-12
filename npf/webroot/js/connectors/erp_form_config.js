$(document).ready(function(){
    if($('.sumo-select').length){
        $('.sumo-select').SumoSelect({placeholder: 'Select Option', search: true, searchText:'Select Option', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });  
    }
});
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

    if(typeof location != 'undefined' && location == 'reload'){
        $(selector_parent).modal();
        $(btn).show();

        $(selector_parent).modal({keyboard: false}).one('click', btn, function (e) {
            e.preventDefault();
            window.location.reload();
        });
    } else if (typeof location != 'undefined') {
        $(btn).show();

        $(selector_parent).modal({keyboard: false}).one('click', btn, function (e) {
            e.preventDefault();
            window.location.href = location;
        });
    } else {
        $(selector_parent).modal();
    }
}

/************ Save Step Two Three code********/

function SaveErpConfig(container,fromId,tab=''){
    if(typeof container == 'undefined' || !(container == 'ErpConfigurationSection' || container == 'ErpThirdStepConfig')){
        return false;
    }
    if(container == 'ErpThirdStepConfig'){
        var method = 'saveThirdStepConfig';
        if(tab == 'requestResponse'){
            var request_type = $('input[name="request_type"]:checked').val();
            var request_1_url = $('input[name="request_1_url"]').val();
            var request_2_url = $('input[name="request_2_url"]').val();
            var request_xml = $('textarea[name="request_1_xml_header"]').val();
            if(validateUrl(request_1_url)){ 
                $('#request_1_url').parent().addClass('has-error');
                $('#request_1_url').parent().siblings('.error').html('Please enter valid URL.');
                return;
            } else {
                $('#request_1_url').parent().removeClass('has-error');
                $('#request_1_url').parent().siblings('.error').html(''); 
            }

            if(request_type == 'two_step' && validateUrl(request_2_url)){ 
                $('#request_2_url').parent().addClass('has-error');
                $('#request_2_url').parent().siblings('.error').html('Please enter valid URL.');
                return;
            } else {
                $('#request_2_url').parent().removeClass('has-error');
                $('#request_2_url').parent().siblings('.error').html('');
            }
            if(request_type == 'two_step' && request_xml == ''){ 
                $('#request_1_xml_header').parent().addClass('has-error');
                $('#request_1_xml_header').parent().siblings('.error').html('Please enter XML Header.');
                return;
            } else {
                $('#request_1_xml_header').parent().removeClass('has-error');
                $('#request_1_xml_header').parent().siblings('.error').html('');
            }
        } else if(tab == 'databaseConfig'){
            var db_hostname = $('input[name="db_hostname"]').val();
            var db_username = $('input[name="db_username"]').val();
            var db_password = $('input[name="db_password"]').val();
            var db_port = $('input[name="db_port"]').val();
            var db_name = $('input[name="db_name"]').val();
            var valid =true;
            if(db_hostname == ''){ 
                $('#db_hostname').parent().addClass('has-error');
                $('#db_hostname').parent().siblings('.error').html('Please enter DB hostname.');
                valid =false;
            } else {
                $('#db_hostname').parent().removeClass('has-error');
                $('#db_hostname').parent().siblings('.error').html(''); 
            }
            if(db_username == ''){ 
                $('#db_username').parent().addClass('has-error');
                $('#db_username').parent().siblings('.error').html('Please enter DB username.');
                valid =false;
            } else {
                $('#db_username').parent().removeClass('has-error');
                $('#db_username').parent().siblings('.error').html(''); 
            }
            if(db_password == ''){ 
                $('#db_password').parent().addClass('has-error');
                $('#db_password').parent().siblings('.error').html('Please enter DB password.');
                valid =false;
            } else {
                $('#db_password').parent().removeClass('has-error');
                $('#db_password').parent().siblings('.error').html(''); 
            }
            if(db_port == ''){ 
                $('#db_port').parent().addClass('has-error');
                $('#db_port').parent().siblings('.error').html('Please enter DB port.');
                valid =false;
            } else {
                $('#db_port').parent().removeClass('has-error');
                $('#db_port').parent().siblings('.error').html(''); 
            }
            if(db_name == ''){ 
                $('#db_name').parent().addClass('has-error');
                $('#db_name').parent().siblings('.error').html('Please enter DB name.');
                valid =false;
            } else {
                $('#db_name').parent().removeClass('has-error');
                $('#db_name').parent().siblings('.error').html(''); 
            }
            if(!valid) {
                return;
            }
        } else if(tab == 'fileConfig'){
            var file_upload_type = $('#file_upload_type').val();
            if(!validateFileConfig(file_upload_type)){ 
               return; 
            }
        }
    } else {
       var method = 'saveErpConfig'; 
    }
    var data = $('#' + fromId).serializeArray();
    $.ajax({
        url: '/Connectors/'+method+'/' + jsVars.paramString,
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#ErpConfigurationSection .loader-block').show();
        },
        complete: function () {
            $('#ErpConfigurationSection .loader-block').hide();
        },
        success: function (json) {
            if (json['session_logout']) {
                location = FULL_URL;
            } 
            else if (json['status']==0) {
                // error display in popup
                alertPopup(json['message'], 'error');
            }
            else if (json['status'] == 200){
                alertPopup(json['message'], 'Success','reload');
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

function updateDefaultValue(elem){
    $(elem).parent().siblings('.default-input-value').show();
    var defaultInput  = $(elem).parent().siblings('.default-input-value').find('input');
    $(defaultInput).attr('name','default_value['+$(elem).val()+']');
    $(elem).parent().siblings('.addRemoveDefault').show();
}

$('html').on('click','.addDefaultConfig',function(){
var html = '<div class="rowSpaceReduce defaultBlock margin-top-5">';
    html += '<div class="col-sm-4">';
    html += '<select name="default_value_field_config[]" class="chosen-select default-value-config" title="Default Value Fields" onchange="updateDefaultValue(this);">';
    html += '<option value="">select</option>';
    $.each(jsVars.allTokens,function(index,value){
        html += '<option value="'+index+'">'+value+'</option>';
    });
    html += '</select></div>';
    html += '<div class="col-sm-4 default-input-value" style="display:none">';
    html += '<input type="text" name="default_value[]" class="form-control" require="require" placeholder="Enter Default value" value="">';
    html += '</div>';
    html += '<div class="col-sm-2 addRemoveDefault" style="display:none">';
    html += '<div><a href="javascript:void(0);" class="text-danger removeDefaultConfig font20" onclick="return confirmDelete(this,\'default_value_fields\')"><i class="fa fa-minus-circle" aria-hidden="true"></i></a>';
    html += '<a href="javascript:void(0);" class="text-info font20 addDefaultConfig"><i class="fa fa-plus-circle margin-left-8" aria-hidden="true"></i></a>';
    html += '</div></div></div>';

    $(this).parent().parent().parent().parent().append(html);
    var lastRow = $('#view_default_value_config_div').find('.defaultBlock:last');
    $(lastRow).find('.default-value-config').trigger('chosen:updated').chosen();

});

function updateReplaceValue(elem){
    $(elem).parent().siblings('.replace-input-value').show();
    var defaultInput  = $(elem).parent().siblings('.replace-input-value').find('input');
    $(defaultInput).attr('name','replace_value['+$(elem).val()+']');
    $(elem).parent().siblings('.addRemoveReplace').show();
}

$('html').on('click','.addReplaceConfig',function(){
var html = '<div class="rowSpaceReduce replaceBlock right-align margin-top-15">';
    html += '<div class="col-sm-4">';
    html += '<select name="replace_value_field_config[]" class="chosen-select replace-value-config" title="Replace Value Fields" onchange="updateReplaceValue(this);">';
    html += '<option value="">select</option>';
    $.each(jsVars.allTokens,function(index,value){
        html += '<option value="'+index+'">'+value+'</option>';
    });
    html += '</select></div>';
    html += '<div class="col-sm-4 replace-input-value" style="display:none">';
    html += '<div class="input text"><input type="text" name="replace_value[]" class="form-control" require="require" placeholder="Enter Replace json" value="">';
    html += '</div></div>';
    html += '<div class="col-sm-2 addRemoveReplace" style="display:none">';
    html += '<div class="margin-top-8"><a href="javascript:void(0);" class="text-danger removeReplaceConfig font20" onclick="return confirmDelete(this,\'replace_value_fields\')"><i class="fa fa-minus-circle" aria-hidden="true"></i></a>';
    html += '<a href="javascript:void(0);" class="text-info font20 addReplaceConfig"><i class="fa fa-plus-circle margin-left-8" aria-hidden="true"></i></a>';
    html += '</div></div>';

    $(this).parent().parent().parent().parent().append(html);
    var lastRow = $('#view_replace_value_config_div').find('.replaceBlock:last');
    $(lastRow).find('.replace-value-config').trigger('chosen:updated').chosen();

});

function updateFileFields(elem){
    $(elem).parent().siblings('.file-input-config').show();
    var defaultInput  = $(elem).parent().siblings('.file-input-config').find('input');
    $(defaultInput).attr('name','file_name_replace['+$(elem).val()+']');
    $(elem).parent().siblings('.addRemovefileConfig').show();
}

$('html').on('click','.addFileConfig',function(){
var html = '<div class="rowSpaceReduce fileBlock right-align margin-top-15">';
    html += '<div class="col-sm-4">';
    html += '<select name="file_fields_config[]" class="chosen-select file-config" title="File Fields" onchange="updateFileFields(this);">';
    html += '<option value="">select</option>';
    $.each(jsVars.fileTokens,function(index,value){
        html += '<option value="'+index+'">'+value+'</option>';
    });
    html += '</select></div>';
    html += '<div class="col-sm-5 file-input-config" style="display:none">';
    html += '<div class="input text"><input type="text" name="file_name_replace[]" class="form-control" require="require" placeholder="Enter Default value" value="">';
    html += '</div></div>';
    html += '<div class="col-sm-2 addRemovefileConfig" style="display:none">';
    html += '<div class="margin-top-8"><a href="javascript:void(0);" class="text-danger removeFileConfig font20" onclick="return confirmDelete(this,\'file_fields\')"><i class="fa fa-minus-circle" aria-hidden="true"></i></a>';
    html += '<a href="javascript:void(0);" class="text-info font20 addFileConfig"><i class="fa fa-plus-circle margin-left-8" aria-hidden="true"></i></a>';
    html += '</div></div>';

    $(this).parent().parent().parent().parent().append(html);
    var lastRow = $('#view_files_config_div').find('.fileBlock:last');
    $(lastRow).find('.file-config').trigger('chosen:updated').chosen();

});

/**
 * 
 * @param {type} elem
 * @param {type} type
 * @returns {Boolean}
 */
function confirmDelete(elem, type) {
    var blockName; var addMoreButtonClass;
    if (type === 'default_value_fields') {
        blockName = '.defaultBlock'; addMoreButtonClass = 'addDefaultConfig';
    } else if(type === 'date_fields'){
        blockName = '.dateBlock'; addMoreButtonClass = 'addDateConfig';
    } else if(type === 'split_data_fields'){
        blockName = '.splitDataBlock'; addMoreButtonClass = 'addSplitFieldConfig';
    } else if(type === 'replace_value_fields'){
        blockName = '.replaceBlock'; addMoreButtonClass = 'addReplaceConfig';
    } else if(type === 'file_fields'){
        blockName = '.fileBlock'; addMoreButtonClass = 'addFileConfig';
    } else if(type === 'conditional_filter_fields'){
        blockName = '.conditionalFieldBlock'; addMoreButtonClass = 'addConditionalFilter';
    }
    var defaultBlockLen = $(blockName).length;
    
    $("#ConfirmPopupArea").css('z-index',11001);
	$("#ConfirmPopupArea .npf-close").hide();
    $('#ConfirmMsgBody').html('Do you want to delete ' + type + '?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();
                $(elem).parent().parent().closest(blockName).remove(); 
                $('#ConfirmPopupArea').modal('hide');
            });
    if(defaultBlockLen <=1){
        $('.'+addMoreButtonClass).trigger('click');
    }        
    return false;
}

function updateDateFormat(elem){
    $(elem).parent().siblings('.date-format-block').show();
    var dateSelect  = $(elem).parent().siblings('.date-format-block').find('select');
    $(dateSelect).attr('name','date_format['+$(elem).val()+']');
    $(elem).parent().siblings('.addRemoveDateField').show();
}

$('html').on('click','.addDateConfig',function(){
var html = '<div class="rowSpaceReduce dateBlock margin-top-5">';
    html += '<div class="col-sm-4">';
    html += '<select name="date_field_config[]" class="chosen-select date-field-config" title="date Fields" onchange="updateDateFormat(this);">';
    html += '<option value="">select</option>';
    $.each(jsVars.allTokens,function(index,value){
        html += '<option value="'+index+'">'+value+'</option>';
    });
    html += '</select></div>';
    html += '<div class="col-sm-4 date-format-block" style="display:none">';
    html += '<select name="date_format[]" class="chosen-select date-format" title="date formats">';
    html += '<option value="">select required date format</option>';
    $.each(jsVars.dateFormats,function(index,value){
        html += '<option value="'+index+'">'+value+'</option>';
    });
    html += '</select></div>';
    html += '<div class="col-sm-2 addRemoveDateField" style="display:none">';
    html += '<div><a href="javascript:void(0);" class="text-danger removeDefaultConfig font20" onclick="return confirmDelete(this,\'date_fields\');"><i class="fa fa-minus-circle" aria-hidden="true"></i></a>';
    html += '<a href="javascript:void(0);" class="text-info addDateConfig font20 margin-left-8"><i class="fa fa-plus-circle" aria-hidden="true"></i></a>';
    html += '</div></div></div>';

    $(this).parent().parent().parent().parent().append(html);
    var lastRow = $('#view_date_field_config_div').find('.dateBlock:last');
    $(lastRow).find('.date-field-config').trigger('chosen:updated').chosen();
    $(lastRow).find('.date-format').trigger('chosen:updated').chosen();
    $(lastRow).find('.date-format').hide();
});

function updateSplitFields(elem){
    $(elem).parent().siblings('.split-separator-block').show();
    $(elem).parent().siblings('.split-index-block').show();
    var separatorSelect  = $(elem).parent().siblings('.split-separator-block').find('select');
    var indexSelect  = $(elem).parent().siblings('.split-index-block').find('select');
    $(separatorSelect).attr('name','split_data_separator['+$(elem).val()+']');
    $(indexSelect).attr('name','split_data_index['+$(elem).val()+']');
    $(elem).parent().siblings('.addRemoveSplitDataField').show();
}

//if($('.sumo-select').length > 0){
   // $('.sumo-select').SumoSelect({placeholder:'Select Options', search:true, searchText:'Search...'}); 
//}

function updateConditionalFieldOption(elem,resetCondition = true,selected,typeselected){
    var multSelectFields = [];
    var multiValue = false;
    var logicMethod = 1;//old
    if(typeselected == undefined){
        var typeselected = '';
    }
    
    var type = 'dropdown';
    var classDate = "datepicker_report";
    var value_field = $(elem).val();
    var arr = value_field.split("||");
    var options = [];
    var curValName = value_field;var htmlFieldId = '';
    var dependentField = $(elem).find(':selected').data('dependentgroup');
    var parentFieldId = $(elem).find(':selected').data('parent');
    var label_name = $(elem).find(':selected').data('label_name');
    htmlFieldId = ''
    var checkDependentFieldVal = 1;
    
    if (arr.length > 2) {
        logicMethod = 2;//new
        curValName = arr[0]+'||'+arr[1]+'||';
        htmlFieldId = arr[0];
        type = arr[1];
        options = (arr[2] !== '') ? JSON.parse(arr[2]) : [];
        if(arr[2] != '[]'){
            checkDependentFieldVal = 0;
        }
        //in case of dynamic registration select field
        if(type === "select"){
            type = "dropdown";
        }
    }
    if(resetCondition == true){
        if(typeof parentFieldId !== 'undefined' && parentFieldId !== '' ){
            //for fixed dependent fields
            var tmp = $(elem).find('option[data-input_id="'+parentFieldId+'"]').text();
            if((typeof tmp ==='undefined' || tmp === '' ) && parentFieldId === 'district_id'){
                tmp = $(elem).find('option[data-input_id="state_id"]').text();
            }
            if(typeof tmp !=='undefined' && tmp !== ''){
                if(checkDependentFieldVal == 1){
                    $(elem).parents('.conditionalFieldBlock').find('.dependent_info').html('This field is dependent on '+tmp);
                }
            }
        }else if(typeof dependentField !== 'undefined' && dependentField !== '' ){
            //form fields dependent 
            var curInputId = $(elem).find(':selected').data('input_id');
            var tmp = $(elem).find('option[data-child="'+curInputId+'"]').text();
            if(typeof tmp !=='undefined' && tmp !== ''){
                if(checkDependentFieldVal == 1){
                   $(elem).parents('.conditionalFieldBlock').find('.dependent_info').html('This field is dependent on '+tmp);
                }
            }
        }
    }
    
    
    $(elem).parent().siblings('.conditional-type-block').show();
    $(elem).parent().siblings('.conditional_options-block').show();
    var typeSelect  = $(elem).parent().siblings('.conditional-type-block').find('select');
    var optionSelect  = $(elem).parent().siblings('.conditional_options-block').find('select');
    var curTypeName = 'condition_type['+curValName+']';
    var curTypeValue = 'condition_value['+$(elem).val()+']';
    $(typeSelect).attr('name',curTypeName);
    $(optionSelect).attr('name','condition_value['+$(elem).val()+']');
    $(optionSelect).attr('data-field',htmlFieldId);
    $(elem).parent().siblings('.addRemoveConditionalFilter').show();
    html = '<select name="condition_value['+$(elem).val()+']" class="chosen-select conditional-filter-option" title="Select Options">';
    html += '<option value="">Select Option</option></select>';
    $(elem).parent().siblings('.conditional_options-block').html(html);
    $(elem).parent().siblings('.conditional_options-block').find('.conditional-filter-option').trigger('chosen:updated').chosen();
    if($(elem).val() == '') {
        return false
    }
    
    if ($.inArray(htmlFieldId, jsVars.muliSelectFields) !== -1) {
        multiValue = true;
    }
    
    if(resetCondition){
      updateOperator(type, curTypeName, typeselected, arr);  
    }
    var fieldKey = $(elem).val();
    if(logicMethod === 1){
        $.ajax({
            url: '/Connectors/getDropdownOptionAjax',
            type: 'post',
            data: {'fieldKey':fieldKey,'collegeId':$('#collegeId').val(), 'formId':$('#formId').val()},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('#ErpConfigurationSection .loader-block').show();
            },
            complete: function () {
                $('#ErpConfigurationSection .loader-block').hide();
            },
            success: function (json) {
                if (json['session_logout']) {
                    location = FULL_URL;
                }else if (json['status'] == 200){
                    if(fieldKey === 'ud_lead_stage' || fieldKey === 'campu_publisher_id'){
                        multiValue = true;
                        html = '<select name="condition_value['+$(elem).val()+'][]" class="multi-dynamic sumo-select sel_value ' + htmlFieldId + '" data-field = "'+htmlFieldId+'" multiple="multiple" title="Select Options">';
                    }else{
                        html = '<select name="condition_value['+$(elem).val()+']" class="chosen-select conditional-filter-option" title="Select Options">';
                    }
                    html += '<option value="">Select Option</option>';
                    $.each(json.data.options,function(index,value){
                        html += '<option value="'+index+'">'+value+'</option>';
                    });
                    html += '</select>';
                    $(elem).parent().siblings('.conditional_options-block').html(html);
                    $(elem).parent().siblings('.conditional_options-block').find('.conditional-filter-option').trigger('chosen:updated').chosen();
                    if (multiValue) {
                        $('.sumo-select').SumoSelect({placeholder: 'Select Option', search: true, searchText: 'Select Option', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true, selectAll: false});
                        if ($('.sumo-select')[0] && $('select.multi-dynamic')[0].sumo) {
                            $('.sumo-select')[0].sumo.reload();
                        }
                    }
                }

            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }else{
        if(multiValue === true && type != 'date'){
            html = '<select name="condition_value['+curValName+'][]" class="multi-dynamic sumo-select sel_value ' + htmlFieldId + '" data-field = "'+htmlFieldId+'" multiple="multiple" title="Select Options">';
        }else if (type === "date") {
            classDate = "daterangepicker_report";
            html = "<input type='text' class='form-control " + classDate + "' name='condition_value[" + curValName +"]' value='' readonly='readonly' placeholder='Select Option' id='"+curValName+"'>";
        }else{
            html = '<select name="condition_value[' + curValName + ']" class="chosen-select conditional-filter-option" title="Select Options">';
        }

        if (typeof type !== "" && type === 'date') {
            html = '<div class="dateFormGroup"><div class="iconDate"><i aria-hidden="true" class="fa fa-calendar-check-o"></i></div><div class="input text">' + html + '</div></div>';
        }else{
            if(options.length === 0){
                html += '<option value="">Select Option</option>';
            }
            $.each(options,function(index,value){
                if ('predefined_dropdown' === type) {
                    var jsonValue = index + ';;;' + value;
                } else {
                    var jsonValue = index;
                }
                selectOption = ''
                
                if(selected != undefined){
                    if(selected.indexOf(String(jsonValue)) !== -1){
                        selectOption = 'selected'
                    }
                }
                if(arr[0] != 'ud|lead_stage' || (arr[0] == 'ud|lead_stage' && jsonValue != 0)){
                    html += '<option value="'+jsonValue+'" '+selectOption+'>'+value+'</option>';
                }
                
            });
            html += '</select>';
        }
        $(elem).parent().siblings('.conditional_options-block').html(html);
        $(elem).parent().siblings('.conditional_options-block').find('.conditional-filter-option').trigger('chosen:updated').chosen();

        if (typeof type !== "" && type === 'date') {
            $("[name='" + curTypeValue + "']").prop("disabled", true);
            LoadReportDatepicker();
            LoadReportDateRangepicker();
        }
        //&& dependentField.indexOf('fixed_') !== 0  //commented fixed
        
        if (multiValue) {
            $('.sumo-select').SumoSelect({placeholder: 'Select Option', search: true, searchText: 'Select Option', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true, selectAll: false});
            if ($('.sumo-select')[0] && $('select.multi-dynamic')[0].sumo) {
                $('.sumo-select')[0].sumo.reload();
            }
        }
        if(checkDependentFieldVal == 1){
            //get All Registration Dependent Child Values
            getChildtaxonomyValues(htmlFieldId, curTypeValue, label_name,elem,selected);
        }
        if(typeof dependentField !== 'undefined' && dependentField !== ''){
            //selected = ''
            checkDependentField(htmlFieldId,elem,type,selected);
        }
    }
}

function updateOperator(type, container_name, selected, arr) {
    if (typeof selected == 'undefined') {
        selected = '';
    }
    var dropdownOperator = {
            'eq': 'include',
            'neq': 'exclude',
            'empty': 'Is empty',
            'not_empty': 'Is not empty',
            'like': 'contains'
        };
    if(((arr[0] !== 'aca|counsellor_id' && arr[0] !== 'councellor_id') && (type != 'dropdown' && arr[0].indexOf('fd|') == -1))){
        delete dropdownOperator['empty'];
        delete dropdownOperator['not_empty'];
    }
        
    var html = '<option value="">Select Condition</option>';
    var operator = {
        'dropdown': dropdownOperator,
        'predefined_dropdown': {
            'eq': 'include',
            'neq': 'exclude',
            'empty': 'Is empty',
            'not_empty': 'Is not empty'
        },
        'select': {
            'eq': 'include',
            'neq': 'exclude',
            'empty': 'Is empty',
            'not_empty': 'Is not empty'
        },
        'date': {
            'between': 'Between',
            'before': 'Before',
            'after': 'After',
            'ago': 'Ago'
        }
    };
    if (typeof type != 'undefined' && ['predefined_dropdown','select','dropdown','date'].indexOf(type) > -1) {
//        if(typeSelected != undefined){
//            selectCondition = 'selected'
//        }
//        selectCondition = ''
        for (var lkey in operator[type]) {
            html += '<option value="' + lkey + '">' + operator[type][lkey] + '</option>';
        }
    }
    
    if(type === 'date'){
        $("[name='" + container_name + "']").attr('onchange','return checkConditionType(this);');
    }
    
    jQuery("[name='" + container_name + "']").html(html);
    jQuery("[name='" + container_name + "']").val(selected);
    jQuery("[name='" + container_name + "']").trigger('chosen:updated').chosen();
}

function checkConditionType(elem,editFlag = false) {
    
    var val = $(elem).val();
    if(val != 'like'){
       updateConditionalFieldOption($(elem).parent().prev().find('.conditional-filter'),false) 
    }
    var name = $(elem).attr('name');
    var cur_val_name = name.replace('condition_type', 'condition_value');
    var fieldName = "[name='" + cur_val_name + "']";
    var selected = $("" + fieldName).val();
    var multiple = $("select[name='" + cur_val_name + "[]'][multiple]").length;
    if (multiple) {
        fieldName = "[name='" + cur_val_name + "[]']";
        cur_val_name = cur_val_name + "[]";
    }
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
    var dateFieldId = '';
    if (val == '') {
        $("[name='" + cur_val_name + "']").prop("disabled", true);
    }

    if (val == 'between') {
        jQuery('.datepicker,.daterangepicker').remove();

        jQuery("[name='" + cur_val_name + "']").val('');
        jQuery("[name='" + cur_val_name + "']").removeClass('datepicker_report').addClass('daterangepicker_report');
        jQuery("[name='" + cur_val_name + "']").datepicker('remove');
        $("" + fieldName).val(selected);

    } else if (val == 'before' || val == 'after') {
        jQuery('.datepicker,.daterangepicker').remove();
        jQuery("[name='" + cur_val_name + "']").val('');
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
        jQuery("[name='" + cur_val_name + "']").removeClass('datepicker_report datetimepicker_report daterangepicker_report date_time_rangepicker_report');
        jQuery("[name='" + cur_val_name + "']").datepicker('remove');
        
        jQuery("[name='" + cur_val_name + "']").attr('disabled',true);
        if($("[name='" + cur_val_name + "']")[0] && $("[name='" + cur_val_name + "']")[0].sumo){ 
            $("[name='" + cur_val_name + "']")[0].sumo.reload();
        }
        
    } else if(val == 'like'){
        
        if(multiple){
            jQuery('#conditionalFilterConfigurationContainer').find("select[name='"+cur_val_name+"']").removeAttr('multiple')
            jQuery('#conditionalFilterConfigurationContainer').find("select[name='" + cur_val_name + "'] option[value='Not Empty']").remove();  
            jQuery('#conditionalFilterConfigurationContainer').find("select[name='" + cur_val_name + "'] option[value='Empty']").remove(); 
            jQuery('#conditionalFilterConfigurationContainer').find("select[name='"+cur_val_name+"']").val('Select Options');
            jQuery('#conditionalFilterConfigurationContainer').find("select[name='"+cur_val_name+"']")[0].sumo.reload();
            newName = cur_val_name.replace('[]', '');
            jQuery('#conditionalFilterConfigurationContainer').find("select[name='"+cur_val_name+"']").attr('name',newName)
            
        }
        
    }
    else{
        if(selected === 'empty' || selected === 'not_empty'){
            selected = '';
        }else{
            $("[name='" + cur_val_name + "'] option[value='Not Empty']").remove();  
            $("[name='" + cur_val_name + "'] option[value='Empty']").remove(); 
            if($("[name='" + cur_val_name + "']")[0] && $("[name='" + cur_val_name + "']")[0].sumo){ 
                $("[name='" + cur_val_name + "']")[0].sumo.reload();
            }
        }
        $("" + fieldName).val(selected);
//        if($("[name='" + cur_val_name + "']")[0] && $("[name='" + cur_val_name + "']")[0].sumo){
//            $("[name='" + cur_val_name + "']")[0].sumo.reload();
//        }
    }
    LoadReportDatepicker();
    LoadReportDateRangepicker();
}

$('html').on('click','.addSplitFieldConfig',function(){
var html = '<div class="rowSpaceReduce splitDataBlock margin-top-5">';
    html += '<div class="col-sm-4">';
    html += '<select name="split_data_config[]" class="chosen-select split-data-config" title="split data Fields" onchange="updateSplitFields(this);">';
    html += '<option value="">select</option>';
    $.each(jsVars.allTokens,function(index,value){
        html += '<option value="'+index+'">'+value+'</option>';
    });
    html += '</select></div>';
    html += '<div class="col-sm-2 split-separator-block" style="display:none">';
    html += '<select name="split_data_separator[]" class="chosen-select split-data" title="Separator">';
    html += '<option value="">select Separator</option>';
    html += '<option value="-">-</option>';
    html += '<option value=",">,</option>';
    html += '<option value="|">|</option>';
    html += '<option value=";">;</option>';
    html += '<option value="/">/</option>';
    html += '<option value="|||">|||</option>';
    html += '</select></div>';
    html += '<div class="col-sm-2 split-index-block" style="display:none">';
    html += '<select name="split_data_index[]" class="chosen-select split-data" title="Index position">';
    html += '<option value="">select index position</option>';
    for (let i = 1; i <= 30; i++) {
        html += '<option value='+i+'>'+i+'</option>';
    }
    html += '</select></div>';
    html += '<div class="col-sm-2 addRemoveSplitDataField" style="display:none">';
    html += '<div><a href="javascript:void(0);" class="text-danger removeDefaultConfig font20" onclick="return confirmDelete(this,\'split_data_fields\');"><i class="fa fa-minus-circle" aria-hidden="true"></i></a>';
    html += '<a href="javascript:void(0);" class="text-info addSplitFieldConfig font20 margin-left-8"><i class="fa fa-plus-circle" aria-hidden="true"></i></a>';
    html += '</div></div></div>';

    $(this).parent().parent().parent().parent().append(html);
    var lastRow = $('#view_split_data_field_config_div').find('.splitDataBlock:last');
    $(lastRow).find('.split-data-config').trigger('chosen:updated').chosen();
    $(lastRow).find('.split-data').trigger('chosen:updated').chosen();
    $(lastRow).find('.split-data').hide();
});

$('html').on('click','.addConditionalFilter',function(){
//var html = '<div class="rowSpaceReduce conditionalFieldBlock margin-top-5">';
//    html += '<div class="col-sm-4">';
//    html += '<select name="conditional_filter_config[]" class="chosen-select conditional-filter" title="Conditional Filter Field" onchange="updateConditionalFieldOption(this);">';
//    html += '<option value="">Select Conditional Filter Field</option>';
//    $.each(jsVars.avaliableDDField,function(index,value){
//        html += '<option value=\'' + index + '\'>'+value+'</option>';
//    });
//    html += '</select></div>';
//    html += '<div class="col-sm-2 conditional-type-block" style="display:none">';
//    html += '<select name="condition_type[]" class="chosen-select conditional-filter-type" title="Condition Type" onchange="checkConditionType(this);">';
//    html += '<option value="">Condition Type</option>';
//    html += '<option value="eq">include</option>';
//    html += '<option value="neq">exclude</option>';
//    html += '</select></div>';
//    html += '<div class="col-sm-2 conditional_options-block" style="display:none">';
//    html += '<select name="condition_value[]" class="chosen-select conditional-filter-option" title="Select Options">';
//    html += '<option value="">Select Option</option>';
//    html += '</select></div>';
//    html += '<div class="col-sm-2 addRemoveConditionalFilter" style="display:none">';
//    html += '<div><a href="javascript:void(0);" class="text-danger removeDefaultConfig font20" onclick="return confirmDelete(this,\'conditional_filter_fields\');"><i class="fa fa-minus-circle" aria-hidden="true"></i></a>';
//    html += '<a href="javascript:void(0);" class="text-info addConditionalFilter font20 margin-left-8"><i class="fa fa-plus-circle" aria-hidden="true"></i></a>';
//    html += '</div></div></div>';
    
    var stgClone = jQuery(this).closest('.conditionalFieldBlock').eq(0).clone();
    // remove chosen select container
    $(stgClone).find('.conditional-filter').val('');
    $(stgClone).find('.dependent_info').empty();
    $(stgClone).find('.chosen-container').remove();
    $(stgClone).find('.conditional-type-block').hide();
    $(stgClone).find('.conditional_options-block').hide();
    $(stgClone).find('.addRemoveConditionalFilter').hide();
    $(this).parent().parent().parent().parent().append(stgClone);
    
    $('.chosen-select').chosen();
    var lastRow = $('#view_conditional_filter_config_div').find('.conditionalFieldBlock:last');
    $(lastRow).find('.conditional-filter').trigger('chosen:updated').chosen();
    $(lastRow).find('.conditional-filter-type').trigger('chosen:updated').chosen();
    $(lastRow).find('.conditional-filter-type').hide();
    $(lastRow).find('.conditional-filter-option').trigger('chosen:updated').chosen();
    $(lastRow).find('.conditional-filter-option').hide();
});

$(document).on('change', '.conditional-filter-type', function() {
   $(this).parent().siblings('.conditional_options-block').find('.conditional-filter-option').val('').trigger('chosen:updated');
});

/** show hide content Type **/
function changeContentType(elem){
    if($(elem).val() == 'post'){
        $(elem).parent().parent().siblings('.content-type').show();
    } else {
        $(elem).parent().parent().siblings('.content-type').hide();
    }
}

/** append request param **/
$('html').on('click','.add_request_param',function(){
    var id = $(this).attr('id');
    var html = '';
    html += '<div class="row mb-10 animated"><div class="col-sm-4">';
    html += '<input type="text" name="'+id+'[key][]" placeholder="key" class="form-control pull-left"></div><div class="col-sm-4">';
    html += '<input type="text" name="'+id+'[value][]" placeholder="value" class="form-control pull-right"></div><div class="col-sm-4">';
    html += '<select name="'+id+'[param_type][]" class="chosen-select request-select-param"><option value="body">Body</option><option value="header">Header</option><option value="basic_auth">Basic Auth Header</option></select>';
    html += '</div></div>';
	//$('#'+id).parent().parent().siblings('.keyValue').children().removeClass('fadeIn');
    $('#'+id).parent().parent().siblings('.keyValue').show().append(html);
    $(".request-select-param").chosen({search_contains:true,disable_search_threshold: 10});
    $(".request-select-param").trigger('chosen');
});

/** append response param **/
$('html').on('click','.add_response_param',function(){
    var id = $(this).attr('id');
    var html = '';
    html += '<div class="row mb-10 animated"><div class="col-sm-4">';
    html += '<input type="text" name="'+id+'[key][]" placeholder="key" class="form-control pull-left"></div><div class="col-sm-4">';
    html += '<input type="text" name="'+id+'[value][]" placeholder="value" class="form-control pull-right"></div><div class="col-sm-4">';
    html += '<select name="'+id+'[param_type][]" class="response-select-param"><option value="body">Body</option><option value="header">Header</option></select>';
    html += '</div></div>';
	//$('#'+id).parent().parent().siblings('.keyValue').children().removeClass('fadeIn');
    $('#'+id).parent().parent().siblings('.keyValue').show().append(html);
    $(".response-select-param").chosen({search_contains:true,disable_search_threshold: 10});
    $(".response-select-param").trigger('chosen');
});


/** Radio button selection**/
$('input[name="request_type"]').change(function(){
   if($(this).val() == 'two_step'){
       $('.two-request').show();
       $('#div_for_xml_header').show();
   } else{
       $('.two-request').hide();
       $('#div_for_xml_header').hide();
   }
});

function validateUrl(url){
//    /^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(url)
    if(/^(http|https):\/\/?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/i.test(url)) {
      return false;
    } else {
      return true;
    } 
}

function validateFileConfig(fileUploadType){
    var valid = true;
    if(fileUploadType == 'ftp'){
        if($('#ftp_host').val().trim() == ''){
            $('#ftp_host').parent().addClass('has-error');
            $('#ftp_host').parent().siblings('.error').html('Please enter valid Host.');
            valid = false;
        } else {
            $('#ftp_host').parent().removeClass('has-error');
            $('#ftp_host').parent().siblings('.error').html(''); 
        }
        
        if($('#ftp_password').val().trim() == ''){
            $('#ftp_password').parent().addClass('has-error');
            $('#ftp_password').parent().siblings('.error').html('Please enter valid Password.');
            valid = false;
        } else {
            $('#ftp_password').parent().removeClass('has-error');
            $('#ftp_password').parent().siblings('.error').html(''); 
        }
        
        if($('#ftp_user').val().trim() == ''){
            $('#ftp_user').parent().addClass('has-error');
            $('#ftp_user').parent().siblings('.error').html('Please enter valid User.');
            valid = false;
        } else {
            $('#ftp_user').parent().removeClass('has-error');
            $('#ftp_user').parent().siblings('.error').html(''); 
        }

    } else if(fileUploadType == 'sftp'){
        if($('#sftp_host').val().trim() == ''){
            $('#sftp_host').parent().addClass('has-error');
            $('#sftp_host').parent().siblings('.error').html('Please enter valid Host.');
            valid = false;
        } else {
            $('#sftp_host').parent().removeClass('has-error');
            $('#sftp_host').parent().siblings('.error').html(''); 
        }
        
        if($('#sftp_password').val().trim() == ''){
            $('#sftp_password').parent().addClass('has-error');
            $('#sftp_password').parent().siblings('.error').html('Please enter valid Password.');
            valid = false;
        } else {
            $('#sftp_password').parent().removeClass('has-error');
            $('#sftp_password').parent().siblings('.error').html(''); 
        }
        
        if($('#sftp_user').val().trim() == ''){
            $('#sftp_user').parent().addClass('has-error');
            $('#sftp_user').parent().siblings('.error').html('Please enter valid User.');
            valid = false;
        } else {
            $('#sftp_user').parent().removeClass('has-error');
            $('#sftp_user').parent().siblings('.error').html(''); 
        }

    } else if(fileUploadType == 'amazon'){
        if($('#amazon_key').val().trim() == ''){
            $('#amazon_key').parent().addClass('has-error');
            $('#amazon_key').parent().siblings('.error').html('Please enter valid key.');
            valid = false;
        } else {
            $('#amazon_key').parent().removeClass('has-error');
            $('#amazon_key').parent().siblings('.error').html(''); 
        }
        
        if($('#amazon_secret').val().trim() == ''){
            $('#amazon_secret').parent().addClass('has-error');
            $('#amazon_secret').parent().siblings('.error').html('Please enter valid Secret.');
            valid = false;
        } else {
            $('#amazon_secret').parent().removeClass('has-error');
            $('#amazon_secret').parent().siblings('.error').html(''); 
        }
        
        if($('#amazon_region').val().trim() == ''){
            $('#amazon_region').parent().addClass('has-error');
            $('#amazon_region').parent().siblings('.error').html('Please enter valid Region.');
            valid = false;
        } else {
            $('#amazon_region').parent().removeClass('has-error');
            $('#amazon_region').parent().siblings('.error').html(''); 
        }
        if($('#amazon_version').val().trim() == ''){
            $('#amazon_version').parent().addClass('has-error');
            $('#amazon_version').parent().siblings('.error').html('Please enter valid Version.');
            valid = false;
        } else {
            $('#amazon_version').parent().removeClass('has-error');
            $('#amazon_version').parent().siblings('.error').html(''); 
        }
        if($('#amazon_folder').val().trim() == ''){
            $('#amazon_folder').parent().addClass('has-error');
            $('#amazon_folder').parent().siblings('.error').html('Please enter valid Folder.');
            valid = false;
        } else {
            $('#amazon_folder').parent().removeClass('has-error');
            $('#amazon_folder').parent().siblings('.error').html(''); 
        }
        if($('#amazon_bucket').val().trim() == ''){
            $('#amazon_bucket').parent().addClass('has-error');
            $('#amazon_bucket').parent().siblings('.error').html('Please enter valid Bucket.');
            valid = false;
        } else {
            $('#amazon_bucket').parent().removeClass('has-error');
            $('#amazon_bucket').parent().siblings('.error').html(''); 
        }
    }
    return valid;
}

$('.csv-to-json').on('click',function(){
    $('#jsonTextArea').hide();
    $('#showError').hide();
    $('#browseModal').modal();
});

$('#trigger_point_config').on('change',function(){
    var val = $('#trigger_point_config').val();
    if(val !== null && val.includes("app_stage")){
        $('.application-stage').show();
    } else {
        $('#app_stage').val('');
        $('#app_stage').trigger('chosen:updated').chosen();
        $('.application-stage').hide();
    }
});

function changeFileUploadType(elem){
    var val = $(elem).val();
    if(val== 'ftp'){
        $('.ftp-configuration').show();
        $('.sftp-configuration').hide();
        $('.amazon-configuration').hide();
    } else if (val== 'sftp'){
        $('.sftp-configuration').show();
        $('.ftp-configuration').hide();
        $('.amazon-configuration').hide();
    } else if (val== 'amazon'){
        $('.amazon-configuration').show();
        $('.sftp-configuration').hide();
        $('.ftp-configuration').hide();
    } else {
        $('.amazon-configuration').hide();
        $('.sftp-configuration').hide();
        $('.ftp-configuration').hide();  
    }
}

/**
 * This function will use on exam config
 * @param {type} args
 * @returns {undefined}
 */
function verifyConfig(...args){
    var method = args[0];
    var valid = validateFileConfig(method);
    if(valid) {
        var host = $('#'+method+'_host').val().trim();
        var user = $('#'+method+'_user').val().trim();
        var password = $('#'+method+'_password').val().trim();
        var port = $('#'+method+'_port').val().trim();
        var ssl = $('#'+method+'_ssl').val();
        var buttonText = $('#checkBtn'+args[1]).text();
        $('#checkBtn'+args[1]).attr('disabled','disabled').html('Please Wait');
        $.ajax({
            url: '/Connectors/verifyFTPConnection',
            type: 'post',
            dataType: 'json',
            data: {host:host,user:user,password:password,port:port,ssl:ssl,method:method},
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            beforeSend: function () {
                $('#listloader').show();
            },
            success: function (json) {
                $('#listloader').hide();

                if(typeof json['error'] !== 'undefined' && json['error'] != ''){
                    if(json['error'] == 'session') {
                        window.location.reload();
                    } else {
                        $('#ConfirmPopupArea').modal('hide');
                        $("#ErrorPopupArea").css('z-index', 12000);
                        alertPopup(json['error'],'error');
                    }
                } else { 
                    if(typeof json['status'] !== 'undefined' && json['status'] == 200) {
                        alertPopup(json['message'],'success');
                    }
                }
                $('#checkBtn'+args[1]).removeAttr('disabled').html(buttonText);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $('#listloader').hide();
                $('#checkBtn'+args[1]).removeAttr('disabled').html(buttonText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
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
    $(currentObj).parents('#view_conditional_filter_config_div').find('select.sel_value').each(function(){
        var prev_field = $(this).data('field');
        var value = $(this).val();
        field_data[prev_field]  = value;
    });
    
    var form_id = jQuery('#formId').val()
    var collegeId = jQuery('#collegeId').val()
    
    field_data['current_field'] = field;
    field_data['form_id']       = form_id;
    field_data['collegeId']       = collegeId;
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
                        if(selected.indexOf(lkey)!== -1){
                            selectedOption=" selected ";
                        }
                        if(type === 'predefined_dropdown' || type === 'dropdown'){
                           html += '<option value="' + lkey + ";;;"+json['option'][lkey]+'"'+selectedOption+'>' + json['option'][lkey] + '</option>';
                        }else{
                            html += '<option value="' + lkey + '"'+selectedOption+'>' + json['option'][lkey] + '</option>';
                        }
                    }
                    var splitField = field.split('|'); //For Registration Dependent
                    field = field.replace('|','\\|');
                    if(typeof splitField[0] !== 'undefined' && splitField.length>1 && $.inArray(splitField[0],['ud','clgreg']) > -1 &&
                       jQuery(currentObj).parents('#view_conditional_filter_config_div').find('.'+splitField[0]+'\\|'+splitField[1]).length > 0) {
                        jQuery(currentObj).parents('#view_conditional_filter_config_div').find('.'+splitField[0]+'\\|'+splitField[1]).html(html);
                        
                        jQuery(currentObj).parents('#view_conditional_filter_config_div').find('.'+splitField[0]+'\\|'+splitField[1])[0].sumo.reload();
                    }else if(jQuery(currentObj).parents('#view_conditional_filter_config_div').find('.' + field).length > 0){
                        jQuery(currentObj).parents('#view_conditional_filter_config_div').find('.' + field).html(html);
                        jQuery(currentObj).parents('#view_conditional_filter_config_div').find('.conditional_options-block').find('.' + field)[0].sumo.reload();
                        
                        //jQuery(currentObj).parents('#view_conditional_filter_config_div').find('.' + field)[0].sumo.reload();
                    }
                }
            }
        
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

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

$(document).on('change', "select.sel_value", function () {
    var ct = 'application'
    var field = $(this).data('field');
    var objValueFieldName =  $(this).attr('name');
    var objElemFieldName =  objValueFieldName.replace('[values][]', '[fields]');
    //var dependentField = $("[name='" + objElemFieldName + "']").find(":selected").data('dependentgroup');
    var dependentField = $(this).closest('.conditionalFieldBlock').find('.conditional-filter').find(":selected").data('dependentgroup');
    var objElemVal = $(this).closest('.conditionalFieldBlock').find('.conditional-filter').val();
    
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
        var form_id = jQuery(this).parents('form').find('[name="form_id"]').val();
        var collegeId = jQuery(this).parents('form').find('[name="s_college_id"]').val();

        field_data[field]           = jQuery(this).val();
        field_data['current_field'] = field;
        field_data['form_id'] = jQuery('#formId').val()
        field_data['collegeId'] = jQuery('#collegeId').val()
        field_data['find_value_type']= 'next';
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
                                if(type === 'predefined_dropdown'){
                                   html += '<option value="' + lkey +";;;"+json['option'][lkey]+ '">' + json['option'][lkey] + '</option>'; 
                                }else{
                                    html += '<option value="' + lkey + '">' + json['option'][lkey] + '</option>';
                                }
                            }
                        }
                        var splitField = field.split('|');
                        var prefix = '';
                        
                        if(typeof json['child_field']!== 'undefined' && json['child_field'].indexOf(splitField[0]) == -1){
                            json['child_field'] = splitField[0]+'\\|'+json['child_field']
                        }
                        if(typeof json['child_field'] !== 'undefined' && json['child_field'] != '') {
                            prefix = splitField[0];
                            //Reset All dropdown Option
//                            if(typeof json['registrationDependentField'] !== 'undefined' && json['registrationDependentField'] !== '') {
//                                resetRegistrationDependentOption(json['registrationDependentField'], json['child_field'], prefix);
//                            }
                            field = field.replace('|','\\|')
                            
                            if(typeof splitField[0] !== 'undefined' && splitField.length>1 && $.inArray(splitField[0],['ud','clgreg']) > -1 ) {
                                if(jQuery('[name="'+objValueFieldName+'"]').parents('#view_conditional_filter_config_div').find('.'+json['child_field']).length > 0) {
                                    jQuery('[name="'+objValueFieldName+'"]').parents('#view_conditional_filter_config_div').find('.'+json['child_field']).html(html);
                                    jQuery('[name="'+objValueFieldName+'"]').parents('#view_conditional_filter_config_div').find('.'+json['child_field'])[0].sumo.reload();
                                }
                            } else if(typeof json['child_field'] !== 'undefined' && jQuery('.'+field).parents('#view_conditional_filter_config_div').find('.'+json['child_field']).length > 0){
                                var childfield = json['child_field'];
                                jQuery('.'+field).parents('#view_conditional_filter_config_div').find('.'+childfield).html(html);
                                jQuery('.'+field).parents('#view_conditional_filter_config_div').find('.'+childfield)[0].sumo.reload();
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
function getChildtaxonomyValues(html_field_id, cur_val_name, label_name , elem ,selected){
    
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
            $(elem).parents('#view_conditional_filter_config_div').find('.ud\\|city_id').html('');
            if(refresh === 'true'){
                $(elem).parents('#view_conditional_filter_config_div').find('.ud\\|city_id')[0].sumo.reload();
            }
            parentFieldName = 'state_id';
            childType = 'District';
        }else if(html_field_id === 'ud|city_id'){
           var isDistrictEnable = $(elem).find('option[data-input_id="district_id"]').length;
            if($(elem).parents('#view_conditional_filter_config_div').find('.ud\\|district_id').length || isDistrictEnable !== 0){
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
        
            if($(elem).parents('#view_conditional_filter_config_div').find('.ud\\|'+parentFieldName).length){
            var selectedEvents = $(elem).parents('#view_conditional_filter_config_div').find('.ud\\|'+parentFieldName).val();
           
            var html = getSelectedChildTaxonomy(selectedEvents,childType);
            
            html = '<option value="0">' + label_name +  ' Not available'+' </option>' + html;
                html_field_id = html_field_id.replace("|", "\\|");
            $(elem).parents('#view_conditional_filter_config_div').find('.'+html_field_id).html(html);
            if(selected != undefined && selected != '')
            {
                selected = selected.replace("[", "");
                selected = selected.replace("]", "");
                selected = selected.split(",");
                for(i=0;i<selected.length;i++){
                    $(elem).parents('#view_conditional_filter_config_div').find('.'+html_field_id).find("option[value="+selected[i]+"]").attr('selected',"selected");
                }
            }
            $(elem).parents('#view_conditional_filter_config_div').find('.'+html_field_id)[0].sumo.reload();
            if(refresh === 'true'){
                $("[name='" + cur_val_name + "']")[0].sumo.reload();
            }
        }
    }
}

function getSelectedChildTaxonomy(selectedParentId, childType){
    
    var html = '';
    var college_id = $("#FilterApplicationForms #college_id").val();
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