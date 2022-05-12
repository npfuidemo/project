$(document).ready(function (){
    //jQuery(".initHide").addClass('initShow');
    $('#scoreAutomationLoader').hide();
    if(typeof logicNumber !== 'undefined' && logicNumber==1){  
        loadBuilderConfig();
    }    
    if(typeof scoreLogicCollegeId !== 'undefined' && scoreLogicCollegeId > 0) {        
        ScoresLoadForms(scoreLogicCollegeId, scoreLogicFormId);
    }

    $(document).on("click", '.classNumber', function(event) {
        editCalculatorData(this,'num');
    });

    $(document).on("click", '.classCharc', function(event) {
        editCalculatorData(this);
    });

});


function createScorePopup(hashId){
    
    if(typeof hashId == 'undefined') {
        hashId = '';
    }
    
    $.ajax({
        url: '/scores/create_score_workflow_step_one',
        type: 'post',
        dataType: 'html',
        data: {'hashId': hashId},
        beforeSend: function () { 
          showLoader();  
        },
        complete:function(){
           hideLoader();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (html){
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alertPopup(html.substring(6, html.length),'error');
            }else{
				$('#utilityPop1').modal();
				$('#utilityPop1 .modal-header .modal-title').html('Create Automation Workflow');
				$('#utilityPop1 .modal-dialog').addClass('modal-sm');
                $('#utilityPop1 .modal-body').html(html); 
             
                $('.chosen-select').chosen();
                $('.chosen-select').trigger('chosen:updated');
				floatableLabel();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
}


function ScoresLoadForms(value, default_val,selectBoxId,multiselect) {
    
    if(value == '') {
        $('#'+selectBoxId).html('<option value="">Select Form</option>');
        $('select').trigger("chosen:updated");
        return false;
    }
    if(typeof multiselect =='undefined'){
        multiselect = '';
    }
    
    var selectedFormonly =0;
    if($("#type-post_application").is(':checked')===true) {
        selectedFormonly = 1;
    }
    
    $.ajax({
        url: '/voucher/get-forms',
        type: 'post',
        dataType: 'html',
        data: {
            "college_id": value,
            "default_val": default_val,
            "multiselect":multiselect,
            "selectedFormonly":selectedFormonly
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if(data=="session_logout"){
                window.location.reload(true);
            }
            
            if(selectBoxId == 's_form_id') {
                $('#'.selectBoxId).attr('name','s_form_id').attr('id','s_form_id');
                $('#created_on').val('');
            }
            
            //$('#form_id').html(data);
            $('#'+selectBoxId).html(data);
            
            if(selectBoxId == 'form_id') {
                if($("#type-post_application").is(':checked')===false) {
                    $("#"+selectBoxId).find('option[value="0"]').text("Select Form*");
                }else{
                    $("#"+selectBoxId).find('option[value="0"]').text("Select Form*");
                }
            }
            
            $('select').trigger("chosen:updated");
			floatableLabel();
        }
    });
}


function listBuilderCtp(selectedData) {
    //default error message blank
    $(".error_custom_list").html('');
    $("#error_college_id").html("");
    $("#error_form_id").html("");
    $("#finalCreationSubmitBtn").show();//show submit button all case
    var callctp = '';
    var form_id=$("#form_id").val();
    //check college select or not
    if($("#college_id").length>0 && $("#college_id").val()==""){
       $("#error_college_id").show();
       $("#error_college_id").html("Please select college name");
       return false;
    }
    
    $("#CreateCustomListForm").attr("target",'');
    $("#CreateCustomListForm").attr("role",'');
    $("#finalCreationSubmitBtn").attr("data-target",'');
    $("#loadUpdateList").html('');
    callctp = 'build_criteria';

    if(selectedData == '') {
        var alldata = $('#CreateCustomListForm').serializeArray();
        alldata.push({name: "callctp", value: callctp});
        alldata.push({name: "counter", value: 1});
        alldata.push({name: "showtype", value: 1});
        alldata.push({name: "startloop", value: 1});
        alldata.push({name: "form_id", value: form_id});
    } else {
        selectedData.callctp = callctp;
        alldata = selectedData;
    }
   

    $.ajax({
        url: '/scores/list-builder-ctp',
        type: 'post',
        dataType: 'html',
        data: alldata,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if (data == "session_logout") {
                window.location.reload(true);
            }
            
            $("#loadBuildCriteria").html(data);
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
            // do not show only if one row 
            if($('.row-count').length == 1) {
                $('.row-condition').hide();
            }
            if($('.row-count').length == 5) {
                $('.add-more').hide();
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
  }

function  removeFromFormula(elem){
    var formObj = $(elem).closest("form");
    var rowContainer = ".parLogicDivClass "; //".row-"+i+" ";
    
    $(formObj).find(".summary_textarea span:last").remove();
    //$(rowContainer + '.summary_textarea span:last').remove();
    var final_calc_text="";
    var calc_text=$(formObj).find('.summary_textarea span');
    var separator = "";
    $(calc_text).each(function( index ) {
        final_calc_text+=separator+$( this ).attr("data-all");
        separator = ';;;';
    });
    $(formObj).find('#rowtextarea').val(final_calc_text);
}

function editCalculatorData(element,editType){

    var typeCheck =$(element).data('all');
    if(typeof typeCheck !='undefined' && typeCheck != null && typeCheck !=''){
        var type = typeCheck.split('||')[0];
    }
    if(type == 'field'){
        return;
    }
    
    var selectedValue = $.trim($(element).text());
    var rowContainer = '#'+$(element).parents('.panel-collapse').attr('id');
    var formObj = $(element).closest("form");

    var html = '<div class="row"><div class="col-sm-5 text-right">Replace with&nbsp;:&nbsp;</div><div class="col-sm-4"><select name="newValue" id="newValue" class="chosen-select"><option value="">Remove</option>';

    if (editType == 'num') {
        var cssClass ='classNumber';
        for (var i = 0; i < 10; i++) {
            if (selectedValue == i) {
                html += '<option value="' + i + '" selected="selected">' + i + '</option>';
            }
            else {
                html += '<option value="' + i + '">' + i + '</option>';
            }
        }
    }
    else{
        var cssClass ='classCharc';
        var arr= ['(',')','/','-','+','*','.','Min','Max','Top','Sum','Avg',',','Ceil','Floor'];
        for(var i in arr){
            if(selectedValue == arr[i]){
                html +='<option value="'+arr[i]+'" selected="selected">'+arr[i]+'</option>';
            }
            else{
                html +='<option value="'+arr[i]+'">'+arr[i]+'</option>';
            }
        }
    }

    html +='</select></div></div>';
    var elem = $(element);
    

    $('#confirmTitle').html('Update Logic');
    $('#ConfirmMsgBody').html(html);
    $('#newValue').chosen();
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        $('#ConfirmPopupArea').modal('hide');
        e.preventDefault();
        var newValue = $('#newValue').val();
        var type = '';
        var typeCheck =$(elem).data('all');
        if(typeof typeCheck !='undefined' && typeCheck != null && typeCheck !=''){
            var type = typeCheck.split('||')[0];
        }
        if(type=="operator"){
            if(newValue == ''){
                $(elem).replaceWith("");
            }
            else{
                $(elem).replaceWith("<span data-all='operator||"+newValue+"' class='"+cssClass+"'>"+newValue+"</span>");
            }
        }
        
        if($(rowContainer+' .summary_textarea span').length >= 1) {
            final_calc_text="";
            calc_text=$(rowContainer+' .summary_textarea span');
            $(calc_text).each(function( index ) {
                if(final_calc_text=="")
                    final_calc_text+=$( this ).attr("data-all");
                else 
                    final_calc_text+=";;;"+$( this ).attr("data-all");
            });
            
            $(formObj).find('#rowtextarea').val(final_calc_text);
        }
    });
}

$(".closeScoringFieldVariable").on('click',function(){
    $('.select_variables_for_calc').val('');
    $('.select_variables_for_calc').trigger("chosen:updated");
    $('.offCanvasModal').modal('hide');
});

$(document).on('click', '#saveScoringVariable', function() {
    $("#scoring_variable_error").html('');
    $("#scoring_value_error").html('');
    var error =false;
    if($("#scoring_variable").val() === '') {
        $("#scoring_variable_error").html('Please enter variable name');
        error = true;
    }
    if($("#scoring_value").val() === '') {
        $("#scoring_value_error").html('Please enter variable value');
        error = true;
    }
    if(isNaN($("#scoring_value").val())) {
        $("#scoring_value_error").html('Only integer or float value is allowed');
        error = true;
    }
    if(error === true) {
        return false;
    }
    if(error === false) {
        $("#saveScoringVariable").prop('disabled', true);
        $.ajax({
            url: '/scores/saveScoringVariable',
            type: 'post',
            data: {'variableName':$("#scoring_variable").val(), 'variableValue':$("#scoring_value").val(), 'encryptId':$("#logic_enrypt_id").val(),'encrypt_Variableid':$("#encrypt_Idvariable").val()},
            async: false,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                $("#saveScoringVariable").prop('disabled', false);
                if(json['status'] ===0 && json['message'] === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else if(json['status'] ===0 && json['message'] === 'error'){
                    $.each( json['data'], function( index, value ){
                        $("#"+index).html(value);
                    });
                } else if(json['status'] ===1) {
                    $("select.select_variables_for_calc option:last").remove();
                    $(".select_variables_for_calc").append('<option value="'+json['data']['key']+'">'+json['data']['title']+'</option>');
                    $(".select_variables_for_calc").append('<option value="addNewVariable">Add New Variable</option>');
                    $('.select_variables_for_calc').trigger("chosen:updated");
                    $('.offCanvasModal').modal('hide');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
});
function appendToFormula(elem,type,logicNumber){
    if($(elem).val() === 'addNewVariable') {
        $("#logic_enrypt_id").val($(elem).attr('encryptId'));
        $("#scoring_variable_error").html('');
        $("#scoring_value_error").html('');
        $("#scoring_variable").val('');
        $("#scoring_value").val('');
        $("#variableFieldForm").find('.floatify__active').removeClass('floatify__active');
        $('#scoringfieldVariable').modal();
        return true;
    } else if ($(elem).val() === '') {
        $('.select_variables_for_calc').trigger("chosen:updated");
        return true;
    }
    var formObj = $(elem).closest("form");
    var rowContainer = "#collapse_"+logicNumber+" ";
    var cssClass = 'classCharc';
    if(type=="operators"){
        if($.isNumeric($(elem).text()) === true) {
            cssClass = 'classNumber';
        }
        $(rowContainer + '.summary_textarea').append("<span data-all='operator||"+$(elem).text()+"' class="+cssClass+">"+$(elem).text()+"</span>");
    } 
    else if(type=="variables"){
        var txt=$(rowContainer +"select.select_variables_for_calc option[value="+$(elem).val()+"]").text();
        $(rowContainer + '.summary_textarea').append("<span data-all='variable||"+$(elem).val()+"' classs="+cssClass+">"+txt+"</span>");
        $(rowContainer + 'select.select_variables_for_calc').val('');
    }
    else{
        if($.isNumeric($(elem).val()) === true) {
            cssClass = 'classNumber';
        }
        var txt=$(rowContainer +"select.select_fields_for_calc option[value="+$(elem).val()+"]").text();
        $(rowContainer + '.summary_textarea').append("<span data-all='field||"+$(elem).val()+"' classs="+cssClass+">"+txt+"</span>");
        $(rowContainer + 'select.select_fields_for_calc').val('');
    }

    if($(rowContainer+'.summary_textarea span').length >= 1) {
        final_calc_text="";
        calc_text=$(rowContainer+'.summary_textarea span');
        $(calc_text).each(function( index ) {
            if(final_calc_text=="")
                final_calc_text+=$( this ).attr("data-all");
            else 
                final_calc_text+=";;;"+$( this ).attr("data-all");
        });
        
        $(formObj).find('#rowtextarea').val(final_calc_text);
    }
}

function ShowHideUpdateField(elem, counter){
    var updateTypeValue = $(elem).val();
    
    var formObj = $(elem).closest("form");
    var conditionType = formObj.find("select[name='condition_type']").val();
    
    $(formObj).find('.parLogicDivClass').hide();
    $(formObj).find('.conditionTypeDivClass').hide();
	$(formObj).find('.selectFieldUpdateClass').removeClass('dropup');
    
    switch(updateTypeValue) {
        case 'update_field':
            $(formObj).find('.conditionTypeDivClass').show();
			$(formObj).find('.selectFieldUpdateClass').addClass('dropup');
            updateTypeSetValue(formObj.find("select[name='select_fields_update']"));
            break;
        case 'update_logic':
            $(formObj).find('.parLogicDivClass').show();
            break;
    }
}

/**
 * This function will use in score logic section when change update Type
 * @param {type} currentObj
 * @param {type} i
 * @param {type} selValue
 * @returns {undefined}
 */
function updateTypeSetValue(currentObj, selValue){
    
    var element = $(currentObj).find('option:selected');
    var labelname = $(element).text();
    var InputId = 'var InputId' //$(currentObj).attr('id');
    var key_source = $(currentObj).data('key_source');
    var value_field = element.attr("data-value");
    
    if(typeof value_field == 'undefined') {
        return false;
    }
    var arr = value_field.split("||");
    var html = '';
    var type = "";
    var class_date = '';
    var field_name = 'condition_type_field_value';
    
    var selectedValue = '';
    if(typeof selValue !== 'undefined') {
        selectedValue = selValue;
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
        
        var sls = false;
        if (type == "dropdown" || type == "predefined_dropdown") {
            if ('UD|state_id' == html_field_id) {
                html = "<select data-key_source=" + InputId + " onchange = 'return GetChildByMachineKey(this.value,\"registerCityID\",\"City\");' class='chosen-select sel_value' name='" + field_name + "' id='" + html_field_id + "'>";
            } else if ('s_lead_status' == html_field_id) {
                html = "<select data-key_source=" + InputId + " multiple='multiple' class='form-control sel_value' name='" + field_name + "' id='" + html_field_id + "' data-placeholder='Select lead status' placeholder='Select lead status'>";
                sls = true;
            } else {
                html = "<select data-key_source=" + InputId + " class='chosen-select sel_value' name='" + field_name + "' id='" + html_field_id + "'>";
            }

            if ('s_lead_status' != html_field_id && 'show_campaigns_in' != html_field_id) {
                html += '<option value="">' + labelname + '</option>';
            }

            obj_json = JSON.parse(val_json);
            for (var key in obj_json) {
                if(type == "predefined_dropdown") {
                    var prfixDropdownKey = key + ';;;' + obj_json[key];
                } else {
                    var prfixDropdownKey = key;
                }
                var prfixDropdownVal = obj_json[key];
                var selected = '';
                if(selectedValue == prfixDropdownKey) {
                    selected = 'selected=selected';
                }
                html += "<option value=\"" + prfixDropdownKey + "\" " +selected+">" + prfixDropdownVal + "</option>";
            }
            html += "</select>";
        } else if (type == "date") {

            var operator_sel = $(currentObj).val();
            class_date = "datepicker_report";
            html = "<input type='text' data-key_source=" + InputId + "  class='form-control sel_value" + class_date + "' name='" + field_name + "' value='"+selectedValue+"' placeholder='" + labelname + "' id='" + html_field_id + "'>";

        } else {
            html = "<input type='text' data-key_source=" + InputId + "  class='form-control sel_value' name='" + field_name + "' value='"+selectedValue+"' placeholder='" + labelname + "' id='" + html_field_id + "'>";
        }
    } else {
        html = "<input type='text' data-key_source=" + InputId + " class='form-control sel_value' name='" + field_name + "' value='"+selectedValue+"' placeholder='" + labelname + "'>";
    }
    
    var multi_class = '';
    if (sls) {
        multi_class = 'multiSelectBox';
    }
    
    var formObj = $(currentObj).closest("form");
    var conditionType = formObj.find("select[name='condition_type']").val();
    
    $(formObj).find('[name="condition_type_field_value"]').parent('div').hide();
    $(formObj).find('.conditionTypeDivClass').hide();
	$(formObj).find('.selectFieldUpdateClass').removeClass('dropup');
    if(conditionType =='update_field') {
        $(formObj).find('[name="condition_type_field_value"]').parent('div').html(html);
        $(formObj).find('[name="condition_type_field_value"]').parent('div').show();
        $(formObj).find('.conditionTypeDivClass').show();
		$(formObj).find('.selectFieldUpdateClass').addClass('dropup');
    }
    
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});

    if (type == "date") {
        LoadReportDatepicker();
        LoadReportDateRangepicker();
    }
    
    if (sls) {
        $('#s_lead_status').multiselect({
            numberDisplayed: 2
        });
    }
}

/**
 * This function is for step one
 * @returns {Boolean}
 */
function saveStepOne(){
    $('span.error').remove();
    var hasError = false;
    if($('#college_id').val() =='') {
        $('#college_id_chosen').after('<span class="error">Please select institute name</span>');
        hasError = true;
    }
    
    //if($("#type-post_application").is(':checked')===false) {
        if($('#form_id').val() =='' || $('#form_id').val() ==null || $('#form_id').val() =='undefined' || $('#form_id').val() == 0) {
            $('#form_id_chosen').after('<span class="error">Please select form name</span>');
            hasError = true;
        }
    //}
    
    if($.trim($('#workflow_title').val()) =='') {
        $('#workflow_title').after('<span class="error">Please enter title of the Workflow</span>');
        hasError = true;
    }
    
    if($.trim($('#status').val()) =='') {
        $('#status_chosen').after('<span class="error">Please select status</span>');
        hasError = true;
    }
    
    if(hasError) {
        return false;
    }
    
    $.ajax({
        url: '/scores/saveWorkflowStepOne',
        type: 'post',
        data: $('#CreateCustomListForm').serializeArray(),
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#scoreAutomationLoader .loader-block').show();
            $(".panel-body").addClass('fadeIn');
            $('.panel-collapse.in').collapse('hide');
        },
        complete: function () {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.chosen-select').trigger('chosen:updated');
            $('#scoreAutomationLoader .loader-block').hide();
            
                        
        },
        success: function (json) {
            
            if(typeof json['error'] !== 'undefined') {
                if(json['error'] == 'session_logout') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(json['error'], 'error');
                }
            } else if(typeof json['redirect_url'] !== 'undefined' && json['redirect_url'] !== '') {
                location = json['redirect_url'];
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


/////////////////////////////
function loadBuilderConfig() {
    $('.loader-block').show();
    $('#scoreLogicDiv').show();
    $.ajax({
        url: '/scores/load-builder-config',
        type: 'post',
        data: {hashData: $("#hashData").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#scoreAutomationLoader .loader-block').show();
            $(".panel-body").addClass('fadeIn');
            $('.panel-collapse.in').collapse('hide');
        },
        complete: function () {
            $('.loader-block').hide();
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.chosen-select').trigger('chosen:updated');
            $('#scoreAutomationLoader .loader-block').hide();
            
            //$('.allocation_title').focus();
            var scrollBottom = $(window).scrollTop() + $(window).height();
            $("html, body").animate({ scrollTop: scrollBottom }, "slow");
            //alert('sdfg');
            setTimeout(function(){
                $('.panel-default').removeClass('panel-added');
            }, 3000);
                        
        },
        success: function (html) {
            $('.loader-block').hide();
            if (html === 'session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (html === 'error') {
                alertPopup('Parameter missing!', 'error');
            } else {
                $("#collapseScoreBuilderConfig .panel-group").append(html);
		$("#collapse_1 .panel-body").addClass('fadeIn');
                $("#addLogicButton").attr('disabled', true);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('.loader-block').hide();
        }
    });
}

//Save Logic Builder data
function saveScoringAutomationSectionData(elem, hashId) {
    $('.loader-block').show();
    var data        = {'config':$("#scoresConfigForm").serialize(),'forms':[], 'hashId':[]};
    
    var errorFlag   = false;
    var form = $(elem).closest("form");
    
    $(".lead_error").html("");
    
        $(form).each(function(){
            data.forms.push($(this).serialize());
            
            $(this).find(".block_first").each(function(){
                var parentBlock = this; 
                $(parentBlock).find(".lead_error").html("");
                jQuery(this).find(".sel_field").each(function () {
                    if($(this).val()==='' || $(this).val()===null){
                        errorFlag   = true;
                        $(this).closest('div.rowSpaceReduce').find(".lead_error").html("Field cannot be blank !").show();
                    }
                });
                
                if(!errorFlag){
                    $(parentBlock).find(".expression_error").html("");
                    jQuery(this).find(".sel_expression").each(function (i, elem) {

                        if($(this).val()===''  || $(this).val()===null){
                            errorFlag   = true; 
                            $(this).closest('div').find(".expression_error").html("Field cannot be blank !").show();
                        }
                    });
                }
                
                if(!errorFlag){
                    $(parentBlock).find(".ifValueClass").html("");
                    jQuery(this).find(".sel_value").each(function (i, elem) { 

                            var attributeName = $(this).attr('name');
                            var fields_name = attributeName.replace('[values][]', '[types]');
                            var expressionValue = $(form).find("select[name=\'"+fields_name+"\']").val();
                            if(expressionValue =='is_empty' || expressionValue =='is_not_empty') {
                                $(this).val('');
                                $('.chosen-select').trigger('chosen:updated');
                            } else if($(this).val()==''  || $(this).val()===null){
                                errorFlag   = true;
                                $(this).parents('.selectValueDivClass').append('<span class="error ifValueClass small">Field cannot be blank !</span>').show();
                            }
                    });
                }
                
            });
            
            var conditionTypeValue = $(this).find("select[name='condition_type']").val();
            if(conditionTypeValue==='' || conditionTypeValue===null){                    
                $(this).find('.conditionTypeClass').next('div').html("Field cannot be blank !");
                errorFlag   = true;
            } else {
                $(this).find(".select_fields_update_error").html('');
                if($(this).find("select[name='select_fields_update']").val() == '' || $(this).find("select[name='select_fields_update']").val() == null) {
                    $(this).find(".select_fields_update_error").html("Field cannot be blank !").show();
                    errorFlag   = true;
                }
                
                if(conditionTypeValue =='update_field') {
                    $(this).find(".condition_type_field_value_error").html('');
                    if($(this).find("[name='condition_type_field_value']").val() == '' || $(this).find("[name='condition_type_field_value']").val() == null) {
                        $(this).find(".condition_type_field_value_error").html("Field cannot be blank !").show();
                        errorFlag   = true;
                    }
                    
                } else if(conditionTypeValue =='update_logic') {
                    $(this).find("div.par_logic_error").html('');
                    if($(this).find("input[name='rowtextarea']").val() == '' || $(this).find("input[name='rowtextarea']").val() == null) {
                        $(this).find("div.par_logic_error").html("Field cannot be blank !").show();
                        errorFlag   = true;
                    }
                }
            }  
            
            var sortOrderValue = $.trim($(this).find("input[name='sort_order']").val());
            $(this).find(".sort_order_error").html('');
            var sortOrderMsg = '';
            if(sortOrderValue==='' || sortOrderValue===null){                    
                sortOrderMsg = 'Field cannot be blank !';
            } else if(sortOrderValue <= 0) {
                sortOrderMsg = 'Value should be greater then 0';
            }
            
            if(sortOrderMsg !== '') {
                $(this).find('.sort_order_error').html(sortOrderMsg).show();
                errorFlag   = true;
            }
        });
    
    
    if(errorFlag){ // if any invalid data found then return
        $('.loader-block').hide();
        return false;
    }
    
    if(typeof hashId !== 'undefined' && hashId != '') {
        data.hashId.push(hashId);
    }
    
    $.ajax({
        url: '/scores/saveBuilderConfig',
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
            $('.loader-block').hide();
            $("#addLogicButton").attr('disabled', false);
        },
        success: function (json) {
            $('.lead_error').html('').hide();
            
            if (typeof json['error'] !=="undefined") {
                if(json['error'] =='session_logout') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(json['error'], 'error');
                }
            } else {
                alertPopup(json['message'], 'success');
                
                //Load Listing if not edit
                if(typeof hashId == 'undefined') {                    
                    loadLogicListing();
                }
            }            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function addMoreLogicBlock(){
    if ($('#addLogicButton').attr('disabled') == 'disabled') {
        return false;
    } else {
        loadBuilderConfig();
    }
}

/**
 * This function will load single logic section
 * @param {type} hash
 * @param {type} obj
 * @returns {Boolean}
 */
function loadSingleLogicSection(hash, obj) {
    if($(obj).hasClass('collapsed') === false) {
        $("#collapse_" + hash).find(".counsellorAllocationDiv").remove();
	$("#collapse_" + hash).find(".panel-body").removeClass('fadeIn');
        return false;
    }
    $.ajax({
        url: '/scores/loadSingleLogicSection',
        type: 'post',
        dataType: 'html',
        data: {hashId: hash, hashData: $("#hashData").val()},
        beforeSend: function () {
            $('.loader-block').show();
            $(".counsellorAllocationDiv").remove();
			$("#collapse_" + hash).find(".panel-body").removeClass('fadeIn');
            if($("#headingOne_1").length>0) $("#headingOne_1").parent('div.panel-default').remove();
            $('#addLogicButton').attr('disabled', false);
        },
        complete: function () {
            $('.loader-block').hide();
			$('.logicListClass .panel-default:first-child .block_first').removeClass('dropup');
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (html) {
            if(html == 'invalid_session' || html== 'invalid_csrf') window.location.reload();
            else if(html == 'invalid_request')  alertPopup(html, 'Something went wrong.');
            else {
                $("#collapse_" + hash).find("div.panel-body").addClass('fadeIn'); 
                $("#collapse_" + hash).find("div.panel-body").html(html);
                var posAllocateAc = $("#collapse_" + hash).offset().top - 105;
                $("html, body").animate({ scrollTop: posAllocateAc }, "slow");
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

/**
 * This function will remove logic block
 * @param {type} elem
 * @param {type} hashId
 * @returns {Boolean}
 */
function confirmDeleteScoringAutomationLogic(elem, hashId){
    $('#ConfirmMsgBody').html('Do you want to delete this logic?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();
                
                if(hashId ==0) { //First time added
                    $('#ConfirmPopupArea').modal('hide');
                    $(elem).parents('.panel-default').remove();
                    alertPopup('The selected logic has been removed!', 'success');
                    $("#addLogicButton").attr('disabled', false);
                    if($('.panel-title').length ==0) {
                        loadBuilderConfig();
                    }
                } else {
                    $.ajax({
                        url: '/scores/deleteLogic',
                        type: 'post',
                        dataType: 'json',
                        data: {hash: hashId},
                        beforeSend: function () {
                            $('.loader-block').show(); 
                        },
                        complete: function () {
                            $('.loader-block').hide();
                        },
                        headers: {
                            "X-CSRF-Token": jsVars._csrfToken
                        },
                        success: function (json) {
                            if (typeof json['error'] !=="undefined") {
                                if(json['error'] =='session_logout') {
                                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                                } else {
                                    alertPopup(json['error'], 'error');
                                }
                            } else {
                                $('#ConfirmPopupArea').modal('hide');
                                $(elem).parents('.panel-default').remove();
                                alertPopup(json['message'], 'success');
                                
                                if($('.panel-title').length ==0) {
                                    loadBuilderConfig();
                                }
                            }
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                        }
                    });
                }

            });
    return false;
}

/**
 * This function will load EAD data of User
 * @param {type} listingType
 * @returns {undefined}
 */
function loadMoreScore(listingType){
    
    if(listingType == 'reset'){
        $('#college_error').html('');
        if($('#s_college_id').val() == '') {
            $('#college_error').html('<small class="text-danger">Please Select Institute</small>');
            return false;
        }
        
        Page = 0;
        if($('#load_more_button').length == 0) {
            $('#LoadMoreArea').html('<button style="display:none;" id="load_more_button" type="button" onclick="javascript:loadMoreScore();" class="btn btn-md btn-info w-text m0"><i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Load More</button>');
        }
        $('#scoreSearchBtn').attr('disabled',true).val('Please Wait...');
    }
    
    
    var data = $('form#scoreManager').serializeArray();
    data.push({name: "page", value: Page});
    $.ajax({
        url: '/scores/ajax-score-listing',
        type: 'post',
        data: data,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
            $('#scoreSearchBtn').removeAttr('disabled').val('Search');
        },
        success: function (html) { 
            $('.loader-block').hide();
            $('#scoreSearchBtn').removeAttr('disabled').val('Search');
            Page = Page + 1;
            if (html === 'session_logout'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if(html == 'error'){
					if (document.documentElement.clientWidth < 967) {
						$('.offCanvasModal').modal('hide');
					}
                    if(Page>1) {
                        $('#LoadMoreArea').html('<h4 class="text-center text-danger">No More Record</h4>');
                    } else {
                        $('#load_more_results').html('');
                        $('#load_more_results, #parent').hide();
                        $('#load_msg_div').show();
                        $('#load_msg').html('No record found');
                    }
                    if (Page==1) {                    
                      $('#tot_records, #LoadMoreArea, #perPageRecordDivId, #mdc, #selectionRow').hide();
                    }
            }else{                
                html = html.replace("<head/>", "");
                if(listingType === 'reset'){
                    $('#load_msg_div, #selectionRow').hide();
                    $('#tot_records, #perPageRecordDivId, #mdc').show();
                    $('#load_more_results').html(html);
                    $('#actionDivId, #parent, #load_more_results, #tot_records, #perPageRecordDivId, #mdc').show();
                }else{
                    $('#load_more_results').find("tbody").append(html);
                }
                
                var countRecord = $('#totalRecord').val();
                if(countRecord < jsVars.RecordPerPage){
                    $('#load_more_button').hide();
                }else{
                    $('#load_more_button, #LoadMoreArea').show();
                    $('#load_more_button').removeAttr("disabled").html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Show more Data'); 
                }
				
				table_fix_rowcol();
                dropdownMenuPlacement();
                $('.offCanvasModal').modal('hide');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#scoreSearchBtn').removeAttr('disabled').val('Search');
        }
    });
};

function resetScoreLogicFilterValue() {
    $('input[type="text"]').each(function () {
        $(this).val('');
    });
    $('button[name="search-btn"]').attr('disabled', false);
    $('select').each(function () {
        this.selected = false;
        $(this).val('');
        $(this).trigger("chosen:updated");
    });
    
    $('#load_more_results, #tot_records').html('');
    $('#parent, #load_more_button').hide();
    $('#load_msg_div').show();
    return false;
}

//Run Logic Data
function runScoreLogic(runFrom) {
    //$('.loader-block').show();    
    if(runFrom == 'application') {
        if($('#workflowId').val() =='') {
            $('#workflowError').html('Please select workflow');
            return false;
        }
        var data = $('#FilterApplicationForms').serializeArray();
        data.push({name: "workflowId", value: $('#workflowId').val()});
        $("#runLogicButton").attr('disabled', 'disabled');
    } else {
        var data = $('#scoresConfigForm').serializeArray();
    }
    
    $.ajax({
        url: '/scores/runScoreLogic',
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
            $('.loader-block').hide();
            $("#runLogicButton").attr('disabled', false);
        },
        success: function (json) {
            $('.lead_error').html('').hide();
            if (typeof json['error'] !=="undefined") {
                if(json['error'] =='session_logout') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                   // alertPopup(json['error'], 'error');
					$('#workflowError').html(json['error']);
                }
            } else {
				$('#workflowError').html('');
				$('#scoreAutomationPopup').modal('hide');
                alertPopup(json['message'], 'success');
            }            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function showScoreAutomationLogicPopup() {
    
    if($('#form_id').val() ==''){
        alertPopup('Please select form name', 'error');
        return false;
    }
    
    $('#scoreAutomationResultDiv').html('');
    $("#runLogicButton").attr('disabled', 'disabled');
    var data = $('#FilterApplicationForms').serializeArray();
    $.ajax({
        url: '/scores/getAllWorkflowData',
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
            $('.loader-block').hide();
            $("#runLogicButton").attr('disabled', false);
        },
        success: function (json) {
            $('.lead_error').html('').hide();
            
            if (typeof json['error'] !=="undefined") {
                if(json['error'] =='session_logout') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(json['error'], 'error');
                }
            } else {
                $('#scoreAutomationPopup').modal();
                var html ='<select class="chosen-select" name="workflowId" id="workflowId">';
                html +='<option value="">Select Workflow</option>';
                for(var key in json['dataList'])
                {
                    html += '<option value="'+key+'">'+json['dataList'][key]+'</option>';
                }
                html +='</select>';
                
                var finalHtml = '<div class="rowSpaceReduce"><div class="col-sm-12 text-center margin-bottom-8">'+json['totalUser']+' applicants selected!</div></div>';
                finalHtml += '<div class="rowSpaceReduce">';
                finalHtml += '<div class="col-sm-4"><label class="control-label" for="college_id">Workflow Name<span class="requiredStar">*</span></label></div>';
                finalHtml += '<div class="col-sm-8">'+html+'<span id="workflowError" class="error"></span></div>';
                finalHtml += '</div>';
                finalHtml += '<div class="rowSpaceReduce margin-top-15"><div class="col-sm-8 col-sm-offset-4"><button class="btn btn-npf m-0" type="button" id="runLogicButton" onclick="runScoreLogic(\'application\');"><i class="fa fa-bolt" aria-hidden="true"></i>&nbsp;Execute</button></div></div>';
                
                $('#scoreAutomationResultDiv').html(finalHtml);
                $('#workflowId').chosen();
				$('#workflowId').trigger('chosen:updated');
                //alertPopup(json['message'], 'success');
            }            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function showHideBoxByExpression(elem){
    var formObj = $(elem).closest("form");
    var attributeName = $(elem).attr('name');
    var fields_name = attributeName.replace(/select_expression/gi, "select_value");    
    $(formObj).find("[name='"+fields_name+"']").parent('div').show();
    switch($(elem).val()){
        case 'is_empty':
        case 'is_not_empty':
            $(formObj).find("[name='"+fields_name+"']").parent('div').hide();
            break;
    }
}

function loadLogicListing(){
    $.ajax({
        url: '/scores/load-logic-listing',
        type: 'post',
        data: $('#scoresConfigForm').serializeArray(),
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#scoreAutomationLoader .loader-block').show();
        },
        complete: function () {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.chosen-select').trigger('chosen:updated');
            $('#scoreAutomationLoader .loader-block').hide();
        },
        success: function (json) {
            
            if (typeof json['error'] !=='undefined') {
                if(json['error'] =='session_logout') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }
            } else {
                
                if(typeof json['logicList'] !== 'undefined' && json['logicList'] !=='') {
                    var html = '';
                    var counter = 1;
                    
                    for(var key in json['logicList'])
                    {
                        if($.trim(json['logicList'][key]) !=='') {
                            var title = json['logicList'][key];
                        } else {
                            var title = 'Logic Title '+counter;
                        }
                        html +='<div class="panel panel-default">';
                        html +='<div class="panel-heading hasArrow" role="tab" id="headingOne'+key+'">';
                        html +='<h4 class="panel-title accor-title">';
                        html +='<a role="button" class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapse_'+key+'" aria-expanded="false" aria-controls="collapse_'+key+'" onclick="loadSingleLogicSection(\''+key+'\', this)">';
                        html +='<span>'+title+'</span>';
                        html +='</a>';
                        html +='</h4>';
                        html +='</div>';
                        html +='<div id="collapse_'+key+'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne'+key+'">';
                        html +='<div class="panel-body animated"></div>';
                        html +='</div>';
                        html +='</div>'; 
                        counter++;
                    }
                    $('.logicListClass').html(html);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function alertPopup(msg, type, location) {
    if (type === 'error') {
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

    if (typeof location !== 'undefined') {
        $(btn).show();

        $(selector_parent).modal({keyboard: false}).one('click', btn, function (e) {
            e.preventDefault();
            window.location.href = location;
        });
    }
    else {
        $(selector_parent).modal();
    }
}

$(document).on('click', '.updateVariableValue', function(){
    $(this).closest('tr').find('.variableValueSpan').hide();
    $(this).closest('tr').find('.variableValue').show();
    $(this).closest('tr').find('.checkVariableValue').show();
    $(this).closest('tr').find('.updateVariableValue').hide();
    $("#saveVariableList").show();
});

$(document).on('click', '.checkVariableValue', function(){
    $(this).closest('tr').find(".validationError").html('');
    var error =false;
    var variableVal = $(this).closest('tr').find(".variableValue").val();
    if(variableVal === '') {
        $(this).closest('tr').find(".validationValueError").html('Please enter variable value');
        error = true;
    }
    if(isNaN(variableVal)) {
        $(this).closest('tr').find(".validationValueError").html('Only integer or float value is allowed');
        error = true;
    }
    if(error === true) {
        return false;
    }
    $(this).closest('tr').find(".variableValue").val(parseFloat(variableVal));
    $(this).closest('tr').find('.variableValueSpan').show();
    $(this).closest('tr').find('.variableValueSpan').html(parseFloat(variableVal));
    $(this).closest('tr').find('.variableValue').hide();
    $(this).closest('tr').find('.checkVariableValue').hide();
    $(this).closest('tr').find('.updateVariableValue').show();
});

$(document).on('click', '#addMoreFieldVariable', function(){
    var index = $('.variableData').length;
    var addVariableHtml = '<tr class="variableData">';
    addVariableHtml += '<td style="width:400px"><input type="text" class="variableName form-control maxword250" name="variables['+index+'][title]" value=""><div class="validationError validationNameError text-left text-danger" id="validation_name_error_'+index+'"></div></td>';
    addVariableHtml += '<td style="height:41px"><input type="text" class="variableValue form-control maxword250" name="variables['+index+'][value]" value=""><div class="validationError validationValueError text-left text-danger" id="validation_value_error_'+index+'"></div></td>';
    addVariableHtml += '<td style="width:50px"><button aria-hidden="true" class="close-row removeVariable" type="button" title="Delete"><i class="fa fa-trash" aria-hidden="true"></i></button></td></tr>';
    $(document).find('#variableListBody').append(addVariableHtml);
    $("#saveVariableList").show();
});

$(document).on('click', '.removeVariable', function(){
    $(this).closest('.variableData').remove();
});

$(document).on('click', '#saveVariableList', function(){
    var error = false;
    $('.validationError').html('');
    $(".variableValue").each(function() {
        if(this.value === '') {
            $(this).closest('tr').find(".validationValueError").html('Please enter variable value');
            error = true;
        }
        if(isNaN(this.value)) {
            $(this).closest('tr').find(".validationValueError").html('Only integer or float value is allowed');
            error = true;
        }
    });
    $(".variableName").each(function() {
        if(this.value === '') {
            $(this).closest('tr').find(".validationNameError").html('Please enter variable name');
            error = true;
        }
    });
    if(error === true) {
        return false;
    }
    if(error === false) {
       // $("#saveVariableList").hide();
        $.ajax({
            url: '/scores/saveScoringVariableList',
            type: 'post',
            data: $("#variableListForm").serialize(),
            async: false,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                if(json['status'] ===0 && json['message'] === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else if(json['status'] ===0 && json['message'] === 'error'){
                    $.each( json['data'], function( index, value ){
                        $("#"+value.id).html(value.msg);
                    });
                } else if(json['status'] ===1) {
                    $("#refresh").load(location.href+" #refresh>");
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
});
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
            'greater_than_equal': 'Greater Than & Equal To (>=)'
        },
        'predefined_dropdown': {
            'is_equal_to': 'Is Equal To',
            'is_not_equal_to': 'Is Not Equal To',
            'is_not_empty': 'Is Not Empty',
            'is_empty': 'Is Empty',
            'less_than': 'Less Than (<)',
            'less_than_equal': 'Less Than & Equal To (<=)',
            'greater_than': 'Greater Than (>)',
            'greater_than_equal': 'Greater Than & Equal To (>=)'
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



function buildScoringAutomationCreateField(currentObj, i, innerBlockCounter, selectedValue, typeselected){
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
        $('.hideExpression').hide();
        $('.hideValue').hide();
        return false;
    }
    if(typeof labelname === 'undefined') {
        labelname = 'Select an Option';
        $('.hideExpression').show();
        $('.hideValue').show();
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
                    html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select sel_value " + html_field_id + "' name='" + cur_val_name + "' data-field='"+html_field_id+"' checkDependentFieldVal='"+checkDependentFieldVal+"' data-ct=='score'>";
                }
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
function checkConditionTypeExpression(elem,module) { 
    if(typeof module === 'undefined'){
        module = '';
    }
    var val     = $(elem).val();
    var curForm = $(elem).parents('form');
    var name = $(elem).attr('name');
    var cur_val_name = name.replace('[expression]', '[value][]');
    var selected     = $(curForm).find("[name='" + cur_val_name + "']").val();
    jQuery("[name='" + cur_val_name + "']").removeAttr('disabled');
    $("[name='" + cur_val_name + "']").removeAttr("oninput");
    if ($(curForm).find("[name='" + cur_val_name + "']").parents('.selectValueDivClass').length > 0) {
        if ('Select Condition' == val || '' == val) {
            $(curForm).find("[name='" + cur_val_name + "']").parents('.selectValueDivClass>div').hide();
            // if hide then selected value reset
            selected = '';
        } else {
            $(curForm).find("[name='" + cur_val_name + "']").parents('.selectValueDivClass>div').show();
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

//for select program dropdown
function buildScoringAutomationCreateProgram(currentObj, i, innerBlockCounter, selectedValue, typeselected){
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
                    html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select sel_value " + html_field_id + "' name='" + cur_val_name + "' data-field='"+html_field_id+"' checkDependentFieldVal='"+checkDependentFieldVal+"' data-ct=='score'>";
                }
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
     // for select program dropdown comment this line
 //   $("[name='" + cur_val_name + "']").parents('.selectValueDivClass>div').hide();
    
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
function calculateDataProgramSelect(){
    resetData();  
    var data = $('.datapost').serializeArray();
    var inputValue = '';
    if(data[0]['value'] == ''){
        alertPopup("Please Select Programs",'error');
    }else if(data[1]['value'] == ''){
        alertPopup("Please Select Operators",'error'); 
    }else if(data[2]['value'] == ''){
        alertPopup("Please Select InputValue",'error');
    }
    if(data !== ''){
        $.ajax({
            url: '/scores/calculateDataProgramSelect/'+jsVars.encryptId,
            type: 'post',
            dataType: 'json',
            data: data,
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (response){
                    if(response.status===1){
                    var value = response['data']['dashboardStats']['total'];
                        if(value === '') {
                            $("#usercount").html(0);
                        } else {
                            $("#usercount").val(value);
                        }
                    var mean = response['data']['dashboardStats']['mean']; 
                        if(mean === '') {
                            $("#meanget").html(0);
                        } else {
                            $("#meanget").text(mean);
                        }
                    var median = response['data']['dashboardStats']['median']; 
                        if(median === null) {
                            $("#medianget").html(0);
                        } else {
                            $("#medianget").text(median);
                        }
                    var mode = response['data']['dashboardStats']['mode']; 
                        if(mode === '' || mode === null) {
                            $("#modeget").html(0);
                        } else {
                            $("#modeget").text(mode);
                        } 
                    
                    if(typeof response['data']['dashboardStats']['genderGraph'] !== 'undefined') {
                        var totalGender_count = 0;
                        var naGenderData = '';
                        var allGenderData = '';
                        var genderAll = '';
                        var getGenderName ='';
                        var totalgender = '';
                    $.each(response['data']['dashboardStats']['genderGraph'], function(genderGraph, gender){
                             genderAll = gender['gender'];
                             getGenderName = genderAll.split(';;;');
                            if(gender === 'NA') {
                                naGenderData = '<tr><td>'+getGenderName[1]+'</td><td>'+gender['count']+'</td></tr>';
                            } else {
                                allGenderData += '<tr><td>'+getGenderName[1]+'</td><td>'+gender['count']+'</td></tr>';
                            }
                            totalGender_count = Number(totalGender_count)+Number(gender['count']);
                    });
                            totalgender += '<tr><td><b>'+'Total'+'</b></td><td><b>'+totalGender_count+'</b></td></tr>';
                            allGenderData += naGenderData;
                            allGenderData += totalgender;
                            
                            $("#genderData").html(allGenderData);
                            
                    }
                    if(typeof response['data']['dashboardStats']['academic'] !== 'undefined') {
                        var totalAcademic_count = 0;
                        var naGraduationData = '';
                        var allGraduationData = '';
                        var totalAcademic = '';
                        var removeTaxonomy = '';
                        var getGraduationName = '';
                    $.each(response['data']['dashboardStats']['academic'], function(academic, graduation){ 
                        removeTaxonomy = graduation['graduation'];
                        getGraduationName = removeTaxonomy.split(';;;');
                        if(graduation === 'NA') {
                                naGraduationData = '<tr><td>'+getGraduationName[1]+'</td><td>'+graduation['count']+'</td></tr>';
                            } else {
                                allGraduationData += '<tr><td>'+getGraduationName[1]+'</td><td>'+graduation['count']+'</td></tr>';
                            }
                            totalAcademic_count = Number(totalAcademic_count)+Number(graduation['count']);
                    });
                            totalAcademic += '<tr><td><b>'+'Total'+'<b></td><td><b>'+totalAcademic_count+'</b></td></tr>';
                            allGraduationData += naGraduationData;
                            allGraduationData += totalAcademic;
                            $("#graduationData").html(allGraduationData);                                                                   
                    }
                   if(typeof response['data']['dashboardStats']['workexperience'] !== 'undefined') {
                        var totalExperience_count = '';
                        var allExperienceData = '';
                        var workexperience_0_12 = response['data']['dashboardStats']['workexperience']['0-12 months'];
                        var workexperience_12_24 = response['data']['dashboardStats']['workexperience']['12-24 months'];
                        var workexperience_24_above =response['data']['dashboardStats']['workexperience']['24 & above'];
                        totalExperience_count = Number(workexperience_0_12)+Number(workexperience_12_24)+Number(workexperience_24_above);
                   
                        allExperienceData += '<tr><td>'+'0-12 months'+'</td><td>'+workexperience_0_12+'</td></tr>';
                        allExperienceData += '<tr><td>'+'12-24 months'+'</td><td>'+workexperience_12_24+'</td></tr>';
                        allExperienceData += '<tr><td>'+'24 & above'+'</td><td>'+workexperience_24_above+'</td></tr>';
                        allExperienceData += '<tr><td><b>'+'Total'+'</b></td><td><b>'+totalExperience_count+'</b></td></tr>';
                        $("#workExperience").html(allExperienceData);                                                                   
                    }
                    }else{
                        if (response.message === 'session'){
                        location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                    }else{
                        alertPopup(response.message);
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        }); 
    }
}
//variableSearch
function searchVariable(){
    var varibaleSearch = '';
    varibaleSearch = $("#Variablesearch").val(); 
    $.ajax({
        url : '/scores/scoringVariableList/'+jsVars.encryptId,
        type : 'post',
        dataType : 'json',
        data : {'varibaleSearch':varibaleSearch},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (response){
            
        },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }     
        });
    
    }


