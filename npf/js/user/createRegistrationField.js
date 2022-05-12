var dirtyFields = [];
function initRegistrationFields(){
    $(".chosen-select").chosen();
    $('#manageFieldsLoader').hide();
    $(".validationDiv").hide();
    $("#field_type").on('change', function() {
        updateFieldType();
    });
    $("#field_validations_input_type").change(updateInputType);
    $("#field_validations_numeric_type").change(updateNumericType);
    $("#field_validations_is_predefined").change(populatePredefinedValues);
    $("#field_validations_date_format").change(function(){
        onChangeDateFormat();
    });
    $("#field_validations_allow_multiple").change(allowMultipleOptions);
    $("#field_validations_multiple_upload").change(allowMultipleUpload);
    $("#required").change(syncFieldNameWithOthers);
    $("#field_validations_max_char").change(showJsCounterField);
    // $("#submitbutton").on("click",submitForm);
    $('#field_label').one('input',function(e){
        dirtyFields.push('label');
    });    
    $('#placeholder').one('input',function(e){
        dirtyFields.push('placeholder');
    });    
    $('#validation_error_message').one('input',function(e){
        dirtyFields.push('error_message');
    });
    if($("#field_type").length){
        updateFieldType(1);
    }

    var ajaxReq = 'ready';
    var typingTimer;

    $('#field_validations_is_predefined_chosen').on('click', function(e) {
        $(this).removeClass('chosen-container-single-nosearch').find('input').attr('readonly', false);
    });

    $('#field_validations_machinekey_country_code_chosen').on('click', function(e) {
        $(this).removeClass('chosen-container-single-nosearch').find('input').attr('readonly', false);
    });

    $('#field_validations_is_predefined_chosen input').on('input', function(e) {
        populateTaxonomies(this, 'field_validations_is_predefined',e);
    });

    $('#field_validations_machinekey_country_code_chosen input').on('input', function(e) {
        populateTaxonomies(this, 'field_validations_machinekey_country_code',e);
    });
    
    function populateTaxonomies(obj, id, event) {
        var txt = $(obj).val();
        clearTimeout(typingTimer);
        typingTimer = setTimeout(function() {
            var data = '<option value="">Select An Option</option>';
            if(id == 'field_validations_is_predefined' && ($('#fieldKey').val() == '' || $.inArray($('#fieldKey').val(), ['country_id', 'state_id', 'district_id', 'city_id', 'university_id', 'course_id', 'specialization_id', 'gdpi_id']) < 0))
                data +='<option value="not_predefined">Not Predefined</option>';
            if(ajaxReq === 'ready') {
                if(txt.length > 2) {
                    ajaxReq = $.ajax({
                        url: '/common/getTaxonomyAjaxList',
                        type: 'post',
                        data: {search:txt},
                        dataType: 'json',
                        headers: {
                            "X-CSRF-Token": jsVars.csrfToken
                        },
                        beforeSend: function () {
                            ajaxReq = 'notready';
                        },
                        complete: function () {
                            ajaxReq = 'ready';
                        },
                        success: function (response) {
                            if(response.error != '') {
                                if(response.error == 'invalid_session' || response.error == 'invalid_csrf') {
                                    window.location.reload();
                                } else{
                                    alert(response.error);
                                }
                            } else {
                                if(response.data.length) {
                                    for (var key in response.data) {
                                        data += '<option value="'+response.data[key].machine_key+'">'+response.data[key].machine_key+'('+response.data[key].title+')</option>';
                                    }
                                }
                                $('#'+id).empty();
                                $('#'+id).html(data);
                            }
                            $('#'+id).trigger('chosen:updated');
                            $('#'+id+'_chosen').removeClass('chosen-container-single-nosearch').find('input').attr('readonly', false);
                            $('#'+id+'_chosen input').val(txt);
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                        }
                    });
                } else {
                    ajaxReq = 'notready';
                    $('#'+id).html(data);
                    $('#'+id).trigger('chosen:updated');
                    $('#'+id+'_chosen').removeClass('chosen-container-single-nosearch').find('input').attr('readonly', false);
                    $('#'+id+'_chosen input').val(txt);
                    ajaxReq = 'ready';
                }
            }
        }, 500);
    }
//    updateInputType();
//    updateNumericType();
//    populatePredefinedValues();
//    updateDateFormat();
//    allowMultipleOptions();
//    showJsCounterField();
    if($("#field_type").val()==="captcha" || $("#field_type").val()==="agreement"){
        $("#fieldTypeDiv").hide();
    }
    
    $(function(){
        $('[rel="popover"]').popover({
                container: 'body',
                html: true,
                content: function () {
                    var clone = $($(this).data('popover-content')).clone(true).removeClass('hide');
                    return clone;
                }
            }).click(function(e) {
                e.preventDefault();
            });
    });
    
    if($('#field_password_validations').length) {
        showHideMinMaxCharacterField($('#field_password_validations').val());
        $("#field_password_validations").change(function(){
            showHideMinMaxCharacterField($('#field_password_validations').val());
        });
        
    }
    
    $("#field_enable_custom_days").change(showHideCustomDays);
    $('.timepicker').datetimepicker({
        format: 'HH:mm'
    });
}

function onChangeDateFormat() {
    $('.datepicker').datepicker('remove');
    $('.datepicker').val('');
    updateDateFormat();

    var selectedFormat = $("#field_validations_date_format").val();
    if(selectedFormat == 'DD/MM/YYYY'){
        $(".customDaysConfig").show();
        var selectedCustomDay = $("#field_enable_custom_days").val();
        if(selectedCustomDay == 'no'){
            $(".customDaysDiv").hide();
        }
    }else{
        $(".customDaysConfig").hide();
    }
}



function showHideCustomDays(){
    var cdays = $("#field_enable_custom_days").val();
    if(cdays == 'yes'){
        $(".customDaysDiv").show();
    }else{
        $(".customDaysDiv").hide();
    }
}

/*
 * This function will show/Hide min and max character field if field exist
 */
function showHideMinMaxCharacterField(val){
    if(val == 1) {
        $('#field_validations_min_char').parent('div').parent('div').parent('div').hide();
        $('#field_validations_max_char').parent('div').parent('div').parent('div').hide();
    } else {
        $('#field_validations_min_char').parent('div').parent('div').parent('div').show();
        $('#field_validations_max_char').parent('div').parent('div').parent('div').show();
    }
}

function updateFieldType(onPageLoad=0){
    if (onPageLoad === 0 && $(document).find('#autofill_datetime').is(":checked")) {
        $('#autofill_datetime').trigger('click');
    }
    $(".validationDiv").hide();
    if($("#field_type").val()==='text'){
        $(".textValidation").not("#numericTypeDiv,#decimalPointsDiv,#whitelistCharsDiv").show();
        
        //In case of field key is password then display the dropdown
        if($.trim($("#fieldKey").val())=='password'){
            $("#passwordValidationDiv").show();
            $("#previousPasswordValidationDiv").show();
        }
    }else if($("#field_type").val()==='textarea'){
        $(".textAreaValidation").show();
    }else if($("#field_type").val()==='date'){
        $(".dateValidation").show();
    }else if($("#field_type").val()==='select'){
        $(".selectValidation").not("#defaultValueDiv,#customOptionDiv,#multiselectLimitDiv,#multiselectAppendDiv").show();
    }else if($("#field_type").val()==='mobile'){
        $(".mobileValidation").show();
        $("#field_validations_input_type").val('');
        $("#field_validations_numeric_type").val('');
    }else if($("#field_type").val()==='file'){
        $(".uploadValidation").show();
        $("#read_only_hidden_field").parent().parent().hide();
    }
    updateInputType();
    updateNumericType();
    populatePredefinedValues();
    updateDateFormat();
    allowMultipleOptions();
    allowMultipleUpload();
    showJsCounterField();
    syncFieldNameWithOthers();
}

function updateInputType(){
    $("#numericTypeDiv").hide();
    $("#decimalPointsDiv").hide();
    $("#whitelistCharsDiv").hide();
    if($("#field_validations_input_type").val()==="numeric"){
        $("#numericTypeDiv").show();
    }else if($("#field_validations_input_type").val()==="alphanumeric" || $("#field_validations_input_type").val()==="alphabet"){
        $("#whitelistCharsDiv").show();
    }
}

function updateNumericType(){
    $("#decimalPointsDiv").hide();
    if($("#field_validations_numeric_type").val()==="decimal"){
        $("#decimalPointsDiv").show();
    }
}

function populatePredefinedValues(){
    $("#defaultValueDiv").hide();
    $("#customOptionDiv").hide();
    if($("#field_validations_is_predefined").val()!=='' ){
        if($("#field_validations_is_predefined").val()==='not_predefined'){
            $("#customOptionDiv").show();
        }else{
            $("#defaultValueDiv").show();
            var selectedOption  = $("#field_validations_default_value").attr("data-value");
            var defaultValue    = '<select name="default_value" id="field_validations_default_value" class="chosen-select"><option selected="selected" value="">Select An Option</option></select>';
            $('#default_value_selectbox').html(defaultValue);
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            var college_id_md = 0;
            if(typeof jsVars.college_id !='undefined' && jsVars.college_id != null){
                college_id_md = jsVars.college_id;
            }
            $.ajax({
                url: jsVars.getTaxonomyChildListLink,
                type: 'post',
                data: {parentKey:$("#field_validations_is_predefined").val(), 'college_id':college_id_md},
                dataType: 'html',
                headers: {
                    "X-CSRF-Token": jsVars.csrfToken
                },
                beforeSend: function () { 
                    $('#manageFieldsLoader.loader-block').show();
                },
                complete: function () {
                    $('.chosen-select').chosen();
                    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                    $('#manageFieldsLoader.loader-block').hide();
                },
                success: function (response) {            
                    var responseObject = $.parseJSON(response);
                    if(responseObject.status==1){
                        if(typeof responseObject.data === "object"){
                            var defaultValue      = '<select name="default_value" id="field_validations_default_value" class="chosen-select"><option selected="selected" value="">Select An Option</option>';
                            $('#default_value_selectbox').html(defaultValue);
                            $.each(responseObject.data, function (index, item) {
                                if(selectedOption==index){
                                    defaultValue += '<option value="'+index+'" selected>'+item+'</option>';
                                }else{
                                    defaultValue += '<option value="'+index+'">'+item+'</option>';
                                }
                            });
                            defaultValue += '</select>';
                            $('#default_value_selectbox').html(defaultValue);
                        }
                    }else{
                        if (responseObject.message === 'session'){
                            location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                        }else{
                            alert(responseObject.message);
                        }
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        }
    }
}

function addDropdownOption(){
    if(parseInt($(".dropdown_option").length)===5){
        $("#field_validations_custom_option_error").html("<strong>Maximum 5 options</strong> allowed. For more options please use predefined values instead.");
        return;
    }
    var plus_sign = '<a class="add" data-toggle="tooltip" title="Add" data-trigger="hover" data-placement="bottom" onclick="addDropdownOption();" href="javascript:void(0);"><i class="fa fa-plus-circle font20"></i></a>';
    $("#dropdownOptionContainerDiv").append('<div class="rowSpaceReduce margin-top-20 plusadded"><div class="col-sm-6"><div class="floatify floatify__left"><label class="floatify__label" for="">Dropdown Option '+(parseInt($(".dropdown_option").length)+1)+'</label><input type="text" name="dropdown_option[]" class="form-control dropdown_option" placeholder="Dropdown Option '+(parseInt($(".dropdown_option").length)+1)+'"></div></div><div class="col-sm-4 text-center"><div class="toggle__checkbox"><small>Make Default</small>&nbsp;<input type="radio" name="default_dropdown_option" id="default_dropdown_option'+(parseInt($(".dropdown_option").length)+1)+'"><label for="default_dropdown_option'+(parseInt($(".dropdown_option").length)+1)+'">Toggle</label></div></div><div class="col-sm-2 text-right margin-top-5"><a class="remove" data-toggle="tooltip" title="Remove" data-placement="bottom" data-trigger="hover" onclick="removeDropdownOption(this);" href="javascript:void(0);"><i class="fa fa-minus-circle text-danger font20"></i></a>&nbsp;&nbsp;'+plus_sign+'</div></div>');
    $('[data-toggle="tooltip"]').tooltip();
    floatableLabel();
    showHidePlusMinus();
}

function removeDropdownOption(elem){
    $("#field_validations_custom_option_error").html("");
    $(elem).parent().parent().remove();
    var elementCount    = 0;
    $(".dropdown_option").each(function(){
        elementCount++;
        if($(this).val()==''){
            $(this).attr('placeholder',"Dropdown Option "+elementCount);
        }
    });
    showHidePlusMinus();
}

function showHidePlusMinus(){
    var count_row = $("#dropdownOptionContainerDiv .rowSpaceReduce").length;
    $("#dropdownOptionContainerDiv .rowSpaceReduce").each(function(){
        $(this).find('.add').hide();
        $(this).find('.remove').show();
        if(count_row >1 && (count_row-1)==$(this).index()){
            $(this).find('.add').show();
        }else if(count_row == 1){
            $(this).find('.add').show();
            $(this).find('.remove').hide();
        }
    });
}

function updateDateFormat(){
    if($("#field_validations_date_format").val()=='DD/MM/YYYY'){
        $('.datepicker').datepicker({startView : 'decade', format : 'dd/mm/yyyy', enableYearToMonth: true, enableMonthToDay : true});
    }else if($("#field_validations_date_format").val()=="MM/YYYY"){
        $('.datepicker').datepicker({startView : 'decade', format : 'mm/yyyy', minViewMode: "months"});
    }else if($("#field_validations_date_format").val()=="YYYY"){
        $('.datepicker').datepicker({startView : 'decade', format : 'yyyy', minViewMode: "years"});
    }
}

function allowMultipleOptions(){
    $("#multiselectLimitDiv").hide();
    $("#multiselectAppendDiv").hide();
    if($("#field_validations_allow_multiple").val()==="true"){
        $("#multiselectLimitDiv").show();
        $("#multiselectAppendDiv").show();
    }
    addRemoveOptionFromUpdateType();
}
$(document).on('change', '#field_validations_multiselect_append', addRemoveOptionFromUpdateType);
$(document).on('click', '#autofill_datetime', autofillDatetime);
$(document).on('change', '#hide', autofillDatetime);
$(document).on('change', '#required', autofillDatetime);
$(document).on('change', '#field_enable_custom_days', autofillDatetime);
$(document).on('change', '#field_validations_date_format', autofillDatetime);

function addRemoveOptionFromUpdateType() {
    var optionExists = ($('#update_type option[value="overwrite"]').length > 0);
    if($('#field_validations_multiselect_append').val() === 'true' && optionExists === true) {
        $("#update_type option[value='overwrite']").remove();
        $('#update_type').trigger("chosen:updated");
        defaultLeadOrigin();
    } else if(optionExists === false){
        $("#update_type").append('<option value="overwrite">Overwrite</option>');
        $('#update_type').trigger("chosen:updated");
    }
}
function allowMultipleUpload(){
    $("#maxFilesUploadLimit").hide();
    if($("#field_validations_multiple_upload").val()==="true"){
        $("#maxFilesUploadLimit").show();
    }
}

function autofillDatetime() {
    if ($(document).find('#autofill_datetime').is(":checked")) {
        $(document).find('#field_validations_date_from').val('');
        $(document).find('#field_validations_date_to').val('');
        $(document).find('#hide').val('true');
        $(document).find('#hide').trigger("chosen:updated");
        $(document).find('#required').val('false');
        $(document).find('#required').trigger("chosen:updated");
        $(document).find('#field_validations_date_format').val('DD/MM/YYYY');
        $(document).find('#field_validations_date_format').trigger("chosen:updated");
        $(document).find('#field_enable_custom_days').val('no');
        $(document).find(".customDaysDiv").hide();
        $(document).find('#field_enable_custom_days').trigger("chosen:updated");
        $(document).find('#field_validations_date_from').attr('disabled',true);
        $(document).find('#field_validations_date_to').attr('disabled',true);
        $(document).find('#field_validations_default_date').attr('disabled',true);
        onChangeDateFormat();
    } else {
        $(document).find('#field_validations_date_from').attr('disabled',false);
        $(document).find('#field_validations_date_to').attr('disabled',false);
        $(document).find('#field_validations_default_date').attr('disabled',false);
    }
}

function showJsCounterField(){
    $("#showCounterDiv").hide();
    if($("#field_type").val()==='textarea' && $("#field_validations_max_char").val()!=="" && $.isNumeric($("#field_validations_max_char").val()) && Math.floor($("#field_validations_max_char").val()) == $("#field_validations_max_char").val()){
            $("#showCounterDiv").show();
    }
}
$(document).ready(function(){
    $("#submitbutton").on("click",function(){
        $(this).attr('disabled',true);
        var field_type = $(this).attr('field_type')
        if($("#field_type").val()==='mobile'){
            $("#field_validations_input_type").val('');
            $("#field_validations_numeric_type").val('');
        }
        submitFormFields(field_type);
    });
});

function submitFormFields(field_type){
    $(".requiredError").html('');
    if($("input[name='default_dropdown_option']:checked" ).length > 0){
        var radio = $("input[name='default_dropdown_option']:checked" );
        $(radio).val($(radio).parent().parent().parent().find("input[name='dropdown_option[]']").val());
    }
    var errorMessages   = {};
    if($("#field_name").val()===""){
        errorMessages["#field_name_error"]  = "Please enter field name.";
    }
    if($("#field_label").val()===""){
        errorMessages["#field_label_error"]  = "Please enter field label.";
    }
    if($("#field_type").val()===""){
        errorMessages["#field_type_error"]  = "Please select field type.";
    }else{
        if($("#field_type").val()==='textarea' || $("#field_type").val()==='text'){
            
            if($("#field_validations_min_char").val()!=="" && !$.isNumeric($("#field_validations_min_char").val()) || Math.floor($("#field_validations_min_char").val()) != $("#field_validations_min_char").val()){
                errorMessages["#field_validations_min_char_error"]  = "Value must be numeric.";
            }
            if($("#field_validations_max_char").val()!=="" && !$.isNumeric($("#field_validations_max_char").val()) || Math.floor($("#field_validations_max_char").val()) != $("#field_validations_max_char").val()){
                errorMessages["#field_validations_max_char_error"]  = "Value must be numeric.";
            }
        }
        if($("#field_type").val()==='text'){
            if($("#field_validations_input_type").val()===""){
                errorMessages['#field_validations_input_type_error']    = "Please select input type.";
            }else if($("#field_validations_input_type").val()==="numeric"){
                if($("#field_validations_numeric_type").val()===""){
                    errorMessages["#field_validations_numeric_type_error"]  = "Please select numeric type.";
                }else{
                    if($("#field_validations_numeric_type").val()==="decimal" && $("#field_validations_decimal_points").val()===""){
                        errorMessages["#field_validations_decimal_points_error"]  = "Please select decimal points.";
                    }
                }
            }
        }else if($("#field_type").val()==='select'){
            /*
            if($("#field_validations_allow_multiple").val()===""){
                errorMessages["#field_validations_allow_multiple_error"]  = "Please select an option.";
            }else{
                */
                if($("#field_validations_allow_multiple").val()==="true" ){
                    if($("#field_validations_multiselect_limit").val()!==''){
                        if(!$.isNumeric($("#field_validations_multiselect_limit").val()) || Math.floor($("#field_validations_multiselect_limit").val()) != $("#field_validations_multiselect_limit").val()){
                            errorMessages["#field_validations_multiselect_limit_error"]  = "Value must be numeric.";
                        }
                    }else{
                            errorMessages["#field_validations_multiselect_limit_error"]  = "Please provide max selections allowed.";
                    }
                }

            //}
            /*
            if($("#field_validations_is_predefined").val()==="" && jsVars.fieldKey!=='state_id' && jsVars.fieldKey!=='city_id' && jsVars.fieldKey!=='district_id' && jsVars.fieldKey!=='specialization_id'){
                errorMessages["#field_validations_is_predefined_error"]  = "Please select an option.";
            }else{*/
            //}
//            if($("#field_validations_is_predefined").val()==="" && jsVars.fieldKey!=='state_id' && jsVars.fieldKey!=='city_id' && jsVars.fieldKey!=='district_id' && jsVars.fieldKey!=='specialization_id'){
//                errorMessages["#field_validations_is_predefined_error"]  = "Please select an option.";
//            }else{
                if($("#field_validations_is_predefined").val()==="not_predefined"){
                    var dropdownValue   = false;
                    $(".dropdown_option").each(function(){
                        if($(this).val()!==''){
                            dropdownValue   = true;
                        }
                    });
                    if(dropdownValue===false){
                        errorMessages["#field_validations_custom_option_error"]  = "Please provide atlease one dropdown option.";
                    }
                }

            //}

//            }

        }else if($("#field_type").val()==='date'){
            var autofillDate = false;
            if ($(document).find('#autofill_datetime').is(":checked")) {
                autofillDate =true;
            }
            if($("#field_validations_date_format").val()===""){
                errorMessages['#field_validations_date_format_error']   = "Please select date format.";
            }
            if($("#field_validations_date_from").val()==="" && autofillDate ===false){
                errorMessages['#field_validations_date_from_error']     = "Please select date range from.";
            }
            if($("#field_validations_date_to").val()==="" && autofillDate ===false){
                errorMessages['#field_validations_date_to_error']       = "Please select date range to.";
            }
            if($("#field_enable_custom_days").val()==='yes'){
                
                $(".customWeekRow input:checkbox").each(function() {
                    if ($(this).is(":checked")) {
                        var rowid = $(this).parent().parent().attr('data-rowid');
                        var timeFrom = $(this).parent().parent().find('.time_from').val();
                        var timeTo = $(this).parent().parent().find('.time_to').val();
                        if(timeFrom == ''){
                            errorMessages['#time_from_to_error_'+rowid] = "Select Time";
                        }
                        if(timeTo == ''){
                            errorMessages['#time_to_to_error_'+rowid] = "Select Time";
                        }
                    }
                });
            }
        }else if($("#field_type").val()==='mobile'){
            if($("#field_validations_country_code").val()==="true" && $("#field_validations_machinekey_country_code").val()===""){
                errorMessages['#field_validations_machinekey_country_code_error']   = "Please select taxonomy mapping.";
            }
        }else if($('#field_type').val()=='file'){
            if(!$("#field_validations_upload_format").val()){
                errorMessages["#field_validations_upload_format_error"]  = "Please select upload file format.";
            }
            if($("#field_validations_max_file_size").val()===""){
                errorMessages["#field_validations_max_file_size_error"]  = "Please enter maximum file size.";
            }
            if(isNaN($("#field_validations_max_file_size").val()) || $("#field_validations_max_file_size").val()<1){
                errorMessages["#field_validations_max_file_size_error"]  = "Please enter positive integer number.";
            }
            if( $("#field_validations_max_file_size").val()>10){
                errorMessages["#field_validations_max_file_size_error"]  = "Maximum file size must be less than 10 MB.";
            }
            if($("#field_validations_multiple_upload").val()==="true"){
                if($("#field_validations_max_files").val()===""){
                    errorMessages["#field_validations_max_files_error"]  = "Please enter maximum files to be uploaded.";
                }
                if(isNaN($("#field_validations_max_files").val()) || $("#field_validations_max_files").val()<1){
                    errorMessages["#field_validations_max_files_error"]  = "Please enter positive integer number.";
                }
            }else{
                $("#field_validations_max_files").val('1');
            }
        }
    }
    
    if($("#required").val()===""){
        errorMessages["#required_error"]  = "Please select an option.";
    }
    if($("#placeholder").val()===""){
        errorMessages["#placeholder_error"]  = "Please enter place holder text.";
    }
    if($("#validation_error_message").val()===""){
        errorMessages["#validation_error_message_error"]  = "Please enter custom error message.";
    }
    if($("#hide").val()===""){
        errorMessages["#hide_error"]  = "Please select an option.";
    }
    if($("#order").val()===""){
        // errorMessages["#order_error"]  = "Please enter sort order.";
    }else{
        if(!$.isNumeric($("#order").val()) || Math.floor($("#order").val()) != $("#order").val()){
            errorMessages["#order_error"]  = "Order must be numeric.";
        }
    }
    if($("#single_application_hide").val()==='hide' && $("#single_application_required").val()==='true'){
        errorMessages["#single_application_hide_error"]  = "Field is hidden so cannot be made mandatory.";
    }
    if($.isEmptyObject(errorMessages)){
        // $("#createRegistrationField").submit();
        saveFormFields(field_type);
    }else{
        $.each(errorMessages,function(errorField,errorMessage){
            $(errorField).html(errorMessage);
        });
        $('#submitbutton').removeAttr('disabled');
        return;
    }
}

function syncFieldNameWithOthers(){
    var fieldNameValue  = $("#field_name").val();

    if($("#field_name").attr("readonly")=="readonly" || $("#field_name").attr("readonly")==true){
        return;
    }
    
    if(dirtyFields.indexOf('label') < 0 ){
        $('#field_label').val("");
        if(fieldNameValue!==''){
            $('#field_label').val(fieldNameValue);
        }
    }
    if(dirtyFields.indexOf('placeholder') < 0 ){
        $('#placeholder').val("");
        if(fieldNameValue!==''){
            if(['text','textarea','email','mobile','file'].indexOf($("#field_type").val()) >=0){
                $('#placeholder').val("Enter "+fieldNameValue);
            }else if($("#field_type").val()==='date' || $("#field_type").val()==='select'){
                $('#placeholder').val("Select "+fieldNameValue);
            }
        }
    }
    if(dirtyFields.indexOf('error_message') < 0 ){
        $('#validation_error_message').val("");
        if(fieldNameValue!==''){
            if(['text','textarea','email','mobile','file'].indexOf($("#field_type").val()) >=0){
                $('#validation_error_message').val("Please Enter a Valid "+fieldNameValue);
            }else if($("#required").val()==="true" && $("#field_type").val()==='date'){
                $('#validation_error_message').val(fieldNameValue+" is Mandatory");
            }else if($("#required").val()==="true" &&  $("#field_type").val()==='select'){
                $('#validation_error_message').val("Please Select "+fieldNameValue+" !");
            }
        }
    }
}

function saveFormFields(field_type){
    var $form = $('#saveRegistrationField');
    var data = $form .serialize();
    var postUrl = '/users/save-registration-field-ajax';
    if(field_type=='leads'){
        postUrl = '/users/save-registration-field-ajax';
    }else{
        postUrl = '/college-settings/save-application-registration-field-ajax';
    }

     $.ajax({
        url: postUrl,
        type: 'post',
        data: data,
        /*dataType: 'json',*/
        beforeSend: function () { 
           
        },
        complete: function () {
           
        },
        success: function (result) {
           console.log(result);
            var response = JSON.parse(result);   
            if (result === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (response.status == 0 && typeof response.error!='undefined'){
                renderCreateRegistrationErrors(response.error);
                $('#submitbutton').removeAttr('disabled');
            }else if (response.status == 1){
                $('#showManageRegistrationPopup').trigger('click');
                $('#SuccessPopupArea').modal('show');
                $('#MsgBody').html(response.message);
                $('#OkBtn').show().on("click",submitForm);
                // alertPopup(response.message,'success');
                // submitForm();
            }         
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function resetAllErrorDisplay(){
    $('#field_name_error').html('');
    $('#field_label_error').html('');
    $('#field_type_error').html('');
    $('#hide_field_show_at_error').html('');
    $('#field_validations_input_type_error').html('');
    $('#placeholder_error').html('');
    $('#field_validations_min_char_error').html('');
    $('#field_validations_max_char_error').html('');
    $('#field_validations_numeric_type_error').html('');
    $('#field_validations_decimal_points_error').html('');
    $('#required_error').html('');
    $('#validation_error_message_error').html('');
    $('#field_validations_whitelist_chars_error').html('');
    $('#field_validations_date_format_error').html('');
    $('#field_validations_date_from_error').html('');
    $('#field_validations_date_to_error').html('');
    $('#field_validations_default_date_error').html('');
    $('#field_validations_is_calender_view').html('');
    $('#field_validations_is_predefined_error').html('');
    $('#field_validations_custom_option_error').html('');
    $('#field_validations_default_value_error').html('');
    $('#field_validations_allow_multiple_error').html('');
    $('#field_validations_multiselect_limit_error').html('');
    $('#field_validations_multiselect_append_error').html('');
    $('#field_validations_country_code_error').html('');
    $('#field_validations_machinekey_country_code_error').html('');
    $('#field_validations_country_code_error').html('');
    $('#field_validations_show_counter_error').html('');
    $('#hide_error').html('');
    $('#read_only_hidden_field_error').html('');
    $('#order_error').html('');
    $('#hide_error').html('');
    $('#single_application_hide_error').html('');
    $('#single_application_required_error').html('');
    $('#field_custom_days').html('');
}

function renderCreateRegistrationErrors(validation_errors){
    resetAllErrorDisplay();
    for (const [key_name, errors] of Object.entries(validation_errors)) {
        var display_error_array = Object.values(errors);
        var display_error = display_error_array.join();
        var error_field_id = '';
        switch(key_name) {
            case 'field_name':
                error_field_id = 'field_name_error';
                break;
            case 'field_label':
                error_field_id = 'field_label_error';
                break;
            case 'field_type':
                error_field_id = 'field_type_error';
                break;
            case 'hide_field_show_at':
                error_field_id = 'hide_field_show_at_error';
                break;
            case 'input_type':
                error_field_id = 'field_validations_input_type_error';
                break;
            case 'placeholder':
                error_field_id = 'placeholder_error';
                break;
            case 'min_char':
                error_field_id = 'field_validations_min_char_error';
                break;
            case 'max_char':
                error_field_id = 'field_validations_max_char_error';
                break;
            case 'numeric_type':
                error_field_id = 'field_validations_numeric_type_error';
                break;
            case 'decimal_points':
                error_field_id = 'field_validations_decimal_points_error';
                break;
            case 'required':
                error_field_id = 'required_error';
                break;
            case 'validation_error_message':
                error_field_id = 'validation_error_message_error';
                break;
            case 'whitelist_chars':
                error_field_id = 'field_validations_whitelist_chars_error';
                break;
            case 'date_format':
                error_field_id = 'field_validations_date_format_error';
                break;
            case 'date_from':
                error_field_id = 'field_validations_date_from_error';
                break;
            case 'date_to':
                error_field_id = 'field_validations_date_to_error';
                break;
            case 'default_date':
                error_field_id = 'field_validations_default_date_error';
                break;
            case 'calender_view':
                error_field_id = 'field_validations_is_calender_view';
                break;
            case 'is_predefined':
                error_field_id = 'field_validations_is_predefined_error';
                break;
            case 'dropdown_option':
                error_field_id = 'field_validations_custom_option_error';
                break;
            case 'default_value':
                error_field_id = 'field_validations_default_value_error';
                break;
            case 'allow_multiple':
                error_field_id = 'field_validations_allow_multiple_error';
                break;
            case 'multiselect_limit':
                error_field_id = 'field_validations_multiselect_limit_error';
                break;
            case 'multiselect_append':
                error_field_id = 'field_validations_multiselect_append_error';
                break;
            case 'country_code':
                error_field_id = 'field_validations_country_code_error';
                break;
            case 'machinekey_country_code':
                error_field_id = 'field_validations_machinekey_country_code_error';
                break;
            case 'country_code':
                error_field_id = 'field_validations_country_code_error';
                break;
            case 'show_counter':
                error_field_id = 'field_validations_show_counter_error';
                break;
            case 'hide':
                error_field_id = 'hide_error';
                break;
            case 'read_only_hidden_field':
                error_field_id = 'read_only_hidden_field_error';
                break;
            case 'order':
                error_field_id = 'order_error';
                break;
            case 'dp_lead_update':
                error_field_id = 'hide_error';
                break;
            case 'single_application_hide':
                error_field_id = 'single_application_hide_error';
                break;
            case 'single_application_required':
                error_field_id = 'single_application_required_error';
                break;
            case 'update_from':
                error_field_id = 'hide_error';
                break;
            case 'update_type':
                error_field_id = 'hide_error';
                break;
            case 'custom_days':
                error_field_id = 'field_custom_days';
                break;              

        }
        if(display_error!=='' && error_field_id!=''){
            $('#'+error_field_id).html(display_error);
        }
    }
}

$(document).on('change', '#update_type', defaultLeadOrigin);

function defaultLeadOrigin() {
    var updateType = $(document).find('#update_type').val();
    if(updateType === 'update') {
        setTimeout(function(){
            $('select#update_from')[0].sumo.selectAll();
            $('select#update_from')[0].sumo.disable();
        }, 300);
    } else {
        setTimeout(function(){
            $('select#update_from')[0].sumo.enable();
        }, 300);
    }
}