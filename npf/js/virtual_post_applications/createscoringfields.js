var dirtyFields = [];
$(document).ready(function(){
    $(".chosen-select").chosen();
    $('#manageFieldsLoader').hide();
    $(".validationDiv").hide();
    $("#field_type").change(updateFieldType);
    $("#field_validations_input_type").change(updateInputType);
    $("#field_validations_numeric_type").change(updateNumericType);
    $("#field_validations_is_predefined").change(populatePredefinedValues);
    $("#field_validations_date_format").change(function(){
        $('.datepicker').datepicker('remove');
        $('.datepicker').val('');
        updateDateFormat();
    });
    $("#field_validations_allow_multiple").change(allowMultipleOptions);
    $("#required").change(syncFieldNameWithOthers);
    $("#field_validations_max_char").change(showJsCounterField);
    $("#submitbutton").on("click",submitForm);
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
        updateFieldType();
    }
    $("#multiple_upload").change(updateUploadsField);
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
    var typingTimer;
    var ajaxReq = 'ready';
    
    $('#field_validations_is_predefined_chosen').on('click', function(e) {
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
                        url: jsVars.FULL_URL+'/common/getTaxonomyAjaxList',
                        type: 'post',
                        data: {search:txt},
                        dataType: 'json',
                        headers: {
                            "X-CSRF-Token": jsVars._csrfToken
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
    
    $("#closeScoringField").on('click',function(){
        $('.offCanvasModal').modal('hide');
    });
});

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

function updateFieldType(){
    $(".fieldattributes_setting").hide();
    $(".setting_head").hide();
    $(".diveder").hide();
    $(".validationDiv").hide();
    var value=$("#field_type").val()
    if(typeof value !="undefined" && value!="" && value!="email"){
        $(".fieldattributes_setting").show();
        $(".fieldattributes_setting").addClass('box');
        $(".setting_head").show();
        $(".diveder").show();
        
    }    
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
    }else if($("#field_type").val()==='uploads'){
        $(".uploadsValidation").show();
    }
    updateInputType();
    updateNumericType();
    populatePredefinedValues();
    updateDateFormat();
    allowMultipleOptions();
    showJsCounterField();
    syncFieldNameWithOthers();
    updateUploadsField();
}

function updateUploadsField(){
    $("#maxUploadsDiv").hide();
    if($("#multiple_upload").val()==="true"){
        $("#maxUploadsDiv").show();
    }
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
    if($("#field_validations_is_predefined").val()!=='' && $('#field_type').val()=='select'){
        if($("#field_validations_is_predefined").val()==='not_predefined') {
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
                url: jsVars.FULL_URL+'/common/getTaxonomyChildList',
                type: 'post',
                data: {parentKey:$("#field_validations_is_predefined").val(), 'college_id':college_id_md},
                dataType: 'html',
                headers: {
                    "X-CSRF-Token": jsVars._csrfToken
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
        $("#field_validations_custom_option_error").html("Maximum 5 options allowed. For more options please use predefined values instead.");
        return;
    }
    $("#dropdownOptionContainerDiv").append('<div class="row"><br><div class="col-sm-7 padding-left-0"><input type="text" name="dropdown_option[]" class="form-control dropdown_option" placeholder="Dropdown Option '+(parseInt($(".dropdown_option").length)+1)+'"></div><div class="col-sm-5"><label><input type="radio" name="default_dropdown_option"> Make Default</label><a onclick="removeDropdownOption(this);" href="javascript:void(0);" class="padding-left-10"><i class="fa fa-minus"></i></a></div></div>');
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
}

function showJsCounterField(){
    $("#showCounterDiv").hide();
    if($("#field_type").val()==='textarea' && $("#field_validations_max_char").val()!=="" && $.isNumeric($("#field_validations_max_char").val()) && Math.floor($("#field_validations_max_char").val()) == $("#field_validations_max_char").val()){
            $("#showCounterDiv").show();
    }
}

function submitForm(){
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
            if($("#field_validations_allow_multiple").val()===""){
                errorMessages["#field_validations_allow_multiple_error"]  = "Please select an option.";
            }else{
                if($("#field_validations_allow_multiple").val()==="true" ){
                    if($("#field_validations_multiselect_limit").val()!==''){
                        if(!$.isNumeric($("#field_validations_multiselect_limit").val()) || Math.floor($("#field_validations_multiselect_limit").val()) != $("#field_validations_multiselect_limit").val()){
                            errorMessages["#field_validations_multiselect_limit_error"]  = "Value must be numeric.";
                        }
                    }else{
                            errorMessages["#field_validations_multiselect_limit_error"]  = "Please provide max selections allowed.";
                    }
                }
            }
            if($("#field_validations_is_predefined").val()==="" && jsVars.fieldKey!=='state_id' && jsVars.fieldKey!=='city_id' && jsVars.fieldKey!=='district_id' && jsVars.fieldKey!=='specialization_id'){
                errorMessages["#field_validations_is_predefined_error"]  = "Please select an option.";
            }else{
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
            }
        }else if($("#field_type").val()==='date'){
            if($("#field_validations_date_format").val()===""){
                errorMessages['#field_validations_date_format_error']   = "Please select date format.";
            }
            if($("#field_validations_date_from").val()===""){
                errorMessages['#field_validations_date_from_error']     = "Please select date range from.";
            }
            if($("#field_validations_date_to").val()===""){
                errorMessages['#field_validations_date_to_error']       = "Please select date range to.";
            }
        }else if($("#field_type").val()==='mobile'){
            if($("#field_validations_country_code").val()==="true" && $("#field_validations_machinekey_country_code").val()===""){
                errorMessages['#field_validations_machinekey_country_code_error']   = "Please select taxonomy mapping.";
            }
        }else if($("#field_type").val()==='uploads'){
            if($("#multiple_upload").val()==="true" && $("#max_no_files").val()===""){
                errorMessages['#max_no_files_error']   = "Please enter max no of file.";
            }
            if($("#upload_file_format").val()==null){
                errorMessages['#upload_file_format_error']   = "Please select file format.";
            }
            if($("#max_file_size").val()===""){
                errorMessages['#max_file_size_error']   = "Please enter file size.";
            }
        }else if($("#field_type").val()==='ratingscale'){
            if($("#maximum-rating-value").val()===""){
               errorMessages['#maximum_field_value_error']   = "Please select maximum rating scale.";
            }
            var maximumRatingScaleCount = $('#maximum-rating-value').val();
            var counter =1;
            if(maximumRatingScaleCount>0){
                for (var i = 0; i < maximumRatingScaleCount ; i++) {
                    var scoreName = $('.scoreName_' + counter).val(); 
                    if(typeof scoreName!='undefined'){
                        var scoreLength = $('.scoreName_' + counter).val().length;
                        if(scoreName==''){
                           errorMessages['#rating_label_value_error_'+counter]   = "Please enter rating label.";
                        }else if(scoreLength > 30){
                           errorMessages['#rating_label_value_error_'+counter]   = "Rating label length 30.";
                        }
                        counter++;
                    }
                }
            }
        }
    }
    
    if($("#required").val()===""){
        //errorMessages["#required_error"]  = "Please select an option.";
    }
    if($("#placeholder").val()===""){
        errorMessages["#placeholder_error"]  = "Please enter place holder text.";
    }
    if($("#validation_error_message").val()===""){
        errorMessages["#validation_error_message_error"]  = "Please enter custom error message.";
    }
    if($("#hide").val()===""){
        //errorMessages["#hide_error"]  = "Please select an option.";
    }
    if($("#order").val()===""){
        //errorMessages["#order_error"]  = "Please enter sort order.";
    }else{
        if(!$.isNumeric($("#order").val()) || Math.floor($("#order").val()) != $("#order").val()){
            //errorMessages["#order_error"]  = "Order must be numeric.";
        }
    }
    console.log(errorMessages);
    if($.isEmptyObject(errorMessages)){
        var data = $("#createScoringField").serialize();
            $("#submitbutton").prop('disabled',true);
            var fieldKey=$("#fieldKeyEncoded").val();
            
            if(typeof fieldKey=='undefined'){
                fieldKey='';
            }
            $.ajax({
                url: jsVars.saveScoringFields+'/'+fieldKey,
                type: 'post',
                dataType: 'html',
                data: data,
                headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                beforeSend: function () {
                             $('#manageFieldsLoader.loader-block').show();
                        },
                success: function (result) {
                    var response = JSON.parse(result);
                    //console.log(result['message']);
                    if(response['status']!='200'){
                        $('#manageFieldsLoader.loader-block').hide();
                        if(response['error']=="session_logout"){
                            window.location.reload(true);
                        }
                        if(response['validationErrors'] != ''){
                            for( obj in response['validationErrors']){
                               for (msg in response['validationErrors'][obj]){
                                    $('#'+obj+'_error').html(response['validationErrors'][obj][msg]);
                               }
                            }
                        }
                        $('.errormsg').html('Error Occured','Error').fadeOut(2000, function() {
                                    $(this).html('');
                        });
                        $("#submitbutton").prop('disabled',false);
                    }else{
                        $('.succesmsg').show();
                        $('.succesmsg').html(response['message'],'success').fadeOut(1000, function() {                            
                            $('.offCanvasModal').modal('hide');                           
                            $.ajax({
                                    url:jsVars.getscoringfields,
                                    type: 'post',
                                    dataType: 'json',
                                    data: data,
                                    headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                                    success: function (res) {
                                        $('#manageFieldsLoader.loader-block').hide();
                                        if(res['status']=='200'){
                                            var ref_val=$('#fieldtoselected').val();
                                            if(typeof ref_val=='undefined'){
                                                ref_val='';
                                            }
                                            
                                            $("#socring_evalution").find('.group_form_fields_option').each(function(){
                                                var sel_val=$(this).val();
                                                var html = "";
                                                html += '<option value="" >Select fields</option>';
                                                $.each(res['data'],function(index, value){
                                                    if(sel_val!="" && sel_val==index){
                                                         html += '<option value="'+index+'" selected="selected" >' + value + '</option>';
                                                    }else{
                                                         html += '<option value="'+index+'" >' + value + '</option>';
                                                    }                                                   
                                                });
                                                html += '<option value="open_addscorcard_popup" >Add New Fields</option>';
                                                $(this).html(html);
                                                $(this)[0].sumo.reload();
                                            });
                                            if(ref_val!=''){
                                                var html=""
                                                html += '<option value="" >Select fields</option>';
                                                $.each(res['data'],function(index, value){
                                                    if(index!="undefined" && response['data']['fieldkey']!="undefined" && response['data']['fieldkey']==index){
                                                         html += '<option value="'+index+'" selected="selected">' + value + '</option>';
                                                    }else{
                                                        html += '<option value="'+index+'" >' + value + '</option>';
                                                    }

                                                });
                                                html += '<option value="open_addscorcard_popup" >Add New Fields</option>';
                                                $("#socring_evalution").find("#"+ref_val).html(html);
                                                $("#socring_evalution").find("#"+ref_val)[0].sumo.reload();
                                            }
                                            if(typeof fieldKey=='undefined' ||fieldKey==''){
                                                saveScorefieldsSetting(jsVars.savescoringfieldsettings,'onScoreFieldCreation');
                                                $("#scoringfieldsettings-tab").trigger('click');
                                            }
                                            setTimeout(function(){$('.offCanvasModal').modal('hide');}, 10)
                                            
                                        }
                                    }
                                });
                                                        
                                 
                        });
                        
                    }       
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
        });
    }else{
        $.each(errorMessages,function(errorField,errorMessage){
            $(errorField).html(errorMessage);
        });
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
            if(['text','textarea','email','mobile'].indexOf($("#field_type").val()) >=0){
                $('#placeholder').val("Enter "+fieldNameValue);
            }else if($("#field_type").val()==='date' || $("#field_type").val()==='select'){
                $('#placeholder').val("Select "+fieldNameValue);
            }
        }
    }
    if(dirtyFields.indexOf('error_message') < 0 ){
        $('#validation_error_message').val("");
        if(fieldNameValue!==''){
            if(['text','textarea','email','mobile'].indexOf($("#field_type").val()) >=0){
                $('#validation_error_message').val("Please Enter a Valid "+fieldNameValue);
            }else if($("#required").val()==="true" && ($("#field_type").val()==='date' || $("#field_type").val()==='select')){
                $('#validation_error_message').val(fieldNameValue+" is Mandatory");
            }
        }
    }
}

function showHideAdditionFied(value){
    $(".showHideOnHidenField").hide();
    if(typeof value!='undefined'){
        if(value=='true'){
            $(".showHideOnHidenField").show();
        }else if(value=='false'){
            $(".showHideOnHidenField").hide();
        }
    }
}

$("#hide-true").on('click',function(){
    $(".showHideOnHidenField").show();
});

$("#hide-false").on('click', function(){
    $(".showHideOnHidenField").hide();
});


function setAllowMultipleOption(value){
    if(value == 'not_predefined'){
	var data = '<option value="false">No</option><option value="true">Yes</option>';
    }else{
	var data = '<option value="false">No</option>';
    }
    $('#field_validations_allow_multiple').html(data);
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
}