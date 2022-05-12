$(document).ready(function (){
    //jQuery(".initHide").addClass('initShow');
    $('#scoreAutomationLoader').hide();
    if(typeof logicNumber !== 'undefined' && logicNumber==1){  
        loadBuilderConfig();
    }    
    if(typeof scoreLogicCollegeId !== 'undefined' && scoreLogicCollegeId > 0) {        
        ScoresLoadForms(scoreLogicCollegeId, scoreLogicFormId);
    }

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
        $('#'+selectBoxId).html('<option value="">Select Form *</option>');
        $('select').trigger("chosen:updated");
        return false;
    }
    if(typeof multiselect =='undefined'){
        multiselect = '';
    }
    $.ajax({
        url: '/voucher/get-forms',
        type: 'post',
        dataType: 'html',
        data: {
            "college_id": value,
            "default_val": default_val,
            "multiselect":multiselect
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
                $("#"+selectBoxId).find('option[value="0"]').text("Select Form *");
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

function appendToFormula(elem,type,logicNumber){
    var formObj = $(elem).closest("form");
    var rowContainer = "#collapse_"+logicNumber+" ";
    var cssClass = 'classCharc';
    if(type=="operators"){
        if($.isNumeric($(elem).text()) === true) {
            cssClass = 'classNumber';
        }
        $(rowContainer + '.summary_textarea').append("<span data-all='operator||"+$(elem).text()+"' class="+cssClass+">"+$(elem).text()+"</span>");
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

function buildScoringAutomationCreateInput(currentObj, i, innerBlockCounter, selectedValue){

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
    var field_name = 'select_value['+i+']['+innerBlockCounter+']';
    var selValue = '';
    if(typeof selectedValue !== 'undefined') {
        selValue = selectedValue;
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
                html = "<select data-key_source=" + InputId + " multiple='multiple' class='form-control if_sel_value' name='" + field_name + "' id='" + html_field_id + "' data-placeholder='Select lead status' placeholder='Select lead status'>";
                sls = true;
            } else {
                html = "<select data-key_source=" + InputId + " class='chosen-select if_sel_value' name='" + field_name + "' id='" + html_field_id + "'>";
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
                if(selValue == prfixDropdownKey) {
                    selected = 'selected=selected';
                }
                html += "<option value=\"" + prfixDropdownKey + "\" " +selected+">" + prfixDropdownVal + "</option>";
            }
            html += "</select>";
        } else if (type == "date") {

            var operator_sel = $(currentObj).val();
            class_date = " datepicker_report";
            html = "<input type='text' data-key_source=" + InputId + "  class='form-control if_sel_value" + class_date + "' name='" + field_name + "' value='" +selValue +"' placeholder='" + labelname + "' id='" + html_field_id + "'>";

        } else {
            html = "<input type='text' data-key_source=" + InputId + "  class='form-control if_sel_value' name='" + field_name + "' value='" +selValue +"' placeholder='" + labelname + "' id='" + html_field_id + "'>";
        }
    } else {
        html = "<input type='text' data-key_source=" + InputId + " class='form-control if_sel_value' name='" + field_name + "' value='" +selValue +"' placeholder='" + labelname + "'>";
    }
    
    var multi_class = '';
    if (sls) {
        multi_class = 'multiSelectBox';
    }
    $('.criteria-calculate-field-' + i+'-'+innerBlockCounter).html(html);
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

function addmoreScoreAutomationInnerBlock(elem, blockCounter, counter){
    var cloned = $('div.innerAddMoreClass:first').clone();
        
    //Reset select value
    jQuery(cloned).find('select').val('');
    
    jQuery(cloned).find('.lead_error').html('');
    jQuery(cloned).find('.expression_error').html('');
    jQuery(cloned).find('.select_value_error').html('');
    jQuery(cloned).find('.removeElementClass').show();
    
    //Reset input box
    jQuery(cloned).find('input').val('').attr('placeholder','');
    
    jQuery(cloned).find('.sel_field').attr('onChange', 'buildScoringAutomationCreateInput(this,1,0);');
    
    //jQuery(cloned).find('.removeElementClass').css('display','block');
    $('div.innerAddMoreClass:last').after(cloned);
    
    jQuery(cloned).find('.chosen-container').remove(); 
    jQuery('.chosen-select').chosen();
        
    //Regenerate All input Name
    var lastElem ='';
    jQuery('div.innerBlockClass').each(function (inner_counter, elem) {
        
        var fields_name = $(elem).find('.sel_field').attr('name').replace(/select_if\[[\d]*\]\[[\d]*\]/gi, "select_if[" + blockCounter + "]["+inner_counter+"]");
        $(elem).find('.sel_field').attr('name', fields_name).attr('onChange', 'buildScoringAutomationCreateInput(this,'+blockCounter+','+inner_counter+');');
        
        var fields_name = $(elem).find('.sel_expression').attr('name').replace(/select_expression\[[\d]*\]\[[\d]*\]/gi, "select_expression[" + blockCounter + "]["+inner_counter+"]");
        $(elem).find('.sel_expression').attr('name', fields_name);
         
        var fields_name = $(elem).find('.if_sel_value').attr('name').replace(/select_value\[[\d]*\]\[[\d]*\]/gi, "select_value[" + blockCounter + "]["+inner_counter+"]");
        $(elem).find('.if_sel_value').attr('name', fields_name);
        
        
        $(elem).find('.selectValueDivClass').removeAttr('class').addClass('col-sm-4 selectValueDivClass criteria-calculate-field-'+blockCounter+'-'+inner_counter);
        
        lastElem = elem;
        counter++;
    });
    $(lastElem).find('.selectValueDivClass span.ifValueClass').remove(); 
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

            var fields_name = $(elem).find('.sel_field').attr('name').replace(/select_if\[[\d]*\]\[[\d]*\]/gi, "select_if[" + blockCounter + "]["+inner_counter+"]");
            $(elem).find('.sel_field').attr('name', fields_name).attr('onChange', 'buildScoringAutomationCreateInput(this,'+blockCounter+','+inner_counter+');');

            var fields_name = $(elem).find('.sel_expression').attr('name').replace(/select_expression\[[\d]*\]\[[\d]*\]/gi, "select_expression[" + blockCounter + "]["+inner_counter+"]");
            $(elem).find('.sel_expression').attr('name', fields_name);

            var fields_name = $(elem).find('.if_sel_value').attr('name').replace(/select_value\[[\d]*\]\[[\d]*\]/gi, "select_value[" + blockCounter + "]["+inner_counter+"]");
            $(elem).find('.if_sel_value').attr('name', fields_name);


            $(elem).find('.selectValueDivClass').removeAttr('class').addClass('col-sm-4 selectValueDivClass criteria-calculate-field-'+blockCounter+'-'+inner_counter);
        });
        
        //Hide the modal Box
        $('#ConfirmPopupArea').modal('hide');
    });
    return false;
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
    
    if($('#form_id').val() =='' || $('#form_id').val() ==null || $('#form_id').val() =='undefined' || $('#form_id').val() == 0) {
        $('#form_id_chosen').after('<span class="error">Please select form name</span>');
        hasError = true;
    }
    
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
            //$('.chosen-select').trigger('chosen:updated');
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
        url: '/scores/load-post-application-builder-config',
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
            //$('.chosen-select').trigger('chosen:updated');
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
            
            if($(this).find("input[name='logic_title']").val() == '') {
                $(this).find(".allocation_title_err").html("Field cannot be blank !").show();
                errorFlag   = true;
            }
            
            var connector = $(this).find("select[name='connector']").val();
            if(connector==='' || connector===null){                    
                //$(this).find('.conditionTypeClass').next('div').html("Field cannot be blank !");
                $(this).find(".connector_error").html("Field cannot be blank !").show();
                errorFlag   = true;
            } else {
                $(this).find(".select_fields_update_error").html('');
                if($(this).find("select[name='product']").val() == '' || $(this).find("select[name='product']").val() == null) {
                    $(this).find(".product_error").html("Field cannot be blank !").show();
                    errorFlag   = true;
                }
                if(connector=='applicants_scores') {
                    if($(this).find("select[name='dynamic_payment_logic']").val()==0 || $(this).find("select[name='dynamic_payment_logic']").val()==='' || $(this).find("select[name='dynamic_payment_logic']").val()==null){
                        $(this).find(".dynamic_payment_logic_error").html("Field cannot be blank !").show();
                        errorFlag   = true;
                    }
                }
            }
            if($(this).find("select[name='update_type']").val() == '' || $(this).find("select[name='update_type']").val() == null) {
                $(this).find(".update_type_error").html("Field cannot be blank !").show();
                errorFlag   = true;
            }
            if($(this).find("select[name='application_fields']").val() == '' || $(this).find("select[name='application_fields']").val() == null) {
                $(this).find(".application_fields_error").html("Field cannot be blank !").show();
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
        url: '/scores/saveConnectorBuilderConfig',
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
                //if(typeof hashId == 'undefined') {                    
                    loadLogicListing();
                //}
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
        url: '/scores/loadWorkFlowLogicSection',
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
                $("#collapse_" + hash).find("div.panel-body").addClass('fadeIn'); $("#collapse_" + hash).find("div.panel-body").html(html);var posAllocateAc = $("#collapse_" + hash).offset().top - 105;$("html, body").animate({ scrollTop: posAllocateAc }, "slow");
            }
            
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            //$('.chosen-select').trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


$('#confirmNo').on('click',function() {
    window.location.reload();
});

if ($('#ConfirmPopupArea .close').length > 0) {
    $( "#ConfirmPopupArea .close" ).click(function() {
        window.location.reload();
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

function getProducts(elem, hashId,prod,logic,applicationField) {
    var connector = $("#connector_"+hashId).val();
    var configId = $("#postAppConfigId_"+hashId).val();
    var collegeId = $("#postAppcollegeId_"+hashId).val();
    var formId = $("#form_id_"+hashId).val();
    $(".connector_error").html('');
    
    if(connector=='' || connector==null) {
        $("#product_"+hashId).html('<option value="">Select Product Name</option>');
        $('.chosen-select').trigger('chosen:updated');
        return false;
    }
    
    $.ajax({
            url: '/scores/getProducts',
            type: 'post',
            dataType: 'json',
            data: {hash: hashId, connector:connector,configId:configId,collegeId:collegeId,formId:formId},
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
                if (json['status'] !=200) {
                    if(json['message'] =='session') {
                        location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                    } else {
                        $("#product_"+hashId).html('<option value="">Select Product Name</option>');
                        $('.chosen-select').trigger('chosen:updated');
                        alertPopup(json['message'], 'error');
                    }
                } else {
                    var html = '<option value="">Select Product Name</option>';
                    var selected = '';
                    $.each(json['data'], function(index, value) {
                        selected = '';
                        if(index==prod){
                            selected = 'selected';
                        }
                        html += '<option value="'+index+'" '+selected+'>' + value + '</option>';
                    });
                    $("#product_"+hashId).html(html);
                    $('.chosen-select').trigger('chosen:updated');
                    if(typeof prod!='undefined') {
                        getDynamicLogic(elem, hashId,logic,applicationField);
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
}


function getDynamicLogic(elem, hashId,logic,applicationField) {
    var connector = $("#connector_"+hashId).val();
    var product = $("#product_"+hashId).val();
    var configId = $("#postAppConfigId_"+hashId).val();
    var collegeId = $("#postAppcollegeId_"+hashId).val();
    $(".product_error").html('');
    
    $.ajax({
            url: '/scores/getDynamicLogic',
            type: 'post',
            dataType: 'json',
            data: {hash: hashId, product:product,configId:configId,collegeId:collegeId,connector:connector},
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
                if (json['status'] !==200) {
                    if(json['message'] =='session') {
                        location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                    } else {
                        $(".product_error").html(json['message']);
                    }
                } else if(json['status']==200 && json['data']==''){
                    $("#dynamicCondtionalBlock_"+hashId).hide();
                }else{
                    var html = '';
                    var selected = '';
                    $.each(json['data'], function(index, value) {
                        selected = '';
                        if(index==logic){
                            selected = 'selected';
                        }
                        html += '<option value="'+index+'" '+selected+'>' + value + '</option>';
                    });
                    $("#dynamicCondtionalBlock_"+hashId).show();
                    $("#dynamic_payment_logic_"+hashId).html(html);
                    $('.chosen-select').trigger('chosen:updated');
                    
                }
                
                if(typeof applicationField!='undefined') {
                    getUpdateFieldsB(elem, hashId,applicationField);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
}

function getUpdateFieldsB(elem, hashId,applicationField) {
    var product = $("#product_"+hashId).val();
    var connector = $("#connector_"+hashId).val();
    var update_type = $("#update_type_"+hashId).val();
    var configId = $("#postAppConfigId_"+hashId).val();
    var collegeId = $("#postAppcollegeId_"+hashId).val();
    $("#applicationValueUpdate_"+hashId).hide();
    $("#applicationValueUpdate_"+hashId).html("");
    $(".update_type_error").html("");
    
    $.ajax({
        url: '/scores/getUpdateFieldsB',
        type: 'post',
        dataType: 'json',
        data: {hash: hashId, product:product,configId:configId,collegeId:collegeId,update_type:update_type,connector:connector},
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
            if (json['status'] !==200) {
                var html = '<option value="">Dynamic Application Fields</option>';
                $("#application_fields_"+hashId).html(html);
                $('.chosen-select').trigger('chosen:updated');
                if(json['message'] =='session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(json['message'], 'error');
                }
            } else if(json['status']==200 && json['data']==''){
                var html = '<option value="">Dynamic Application Fields</option>';
                $("#application_fields_"+hashId).html(html);
                $('.chosen-select').trigger('chosen:updated');
            }else{
                var html = '<option value="">Dynamic Application Fields</option>';
                var selected = '';
                
                $.each(json['data'], function(index, value) {
                    selected = '';
                    if(index==applicationField){
                        selected = 'selected';
                    }
                
                    html += '<option value="'+index+'" '+selected+'>' + value + '</option>';
                });
                $("#application_fields_"+hashId).html(html);
                $('.chosen-select').trigger('chosen:updated');
                
                if(typeof applicationField!='undefined') {
                    getUpdateValueFields(elem, hashId);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getUpdateValueFields(elem, hashId,formId) {
    var product = $("#product_"+hashId).val();
    var fieldsName = $("#application_fields_"+hashId).val();
    var update_type = $("#update_type_"+hashId).val();
    var configId = $("#postAppConfigId_"+hashId).val();
    var collegeId = $("#postAppcollegeId_"+hashId).val();
    if(typeof formId=='undefined') {
        var formId = $("#form_id_"+hashId).val();
    }
    $(".application_fields_error").html("");
    if(update_type=='application_stage') {
        $.ajax({
            url: '/common/getLeadSubStages',
            type: 'post',
            dataType: 'json',
            data: {stageId:fieldsName,formId:formId},
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
                if((typeof json.error=='undefined' || json.error==null) && Object.keys(json['subStageList']).length>0){
                    var html = '<select class="form-control chosen-select applicationFieldClass" name="updateThisValue"><option value="">Sub Stage</option>';
                    var selected = '';
                    $.each(json['subStageList'], function(index, value) {
                        selected = '';
                        if(typeof $('#subStage_'+hashId).val()!='undefined' && index==$('#subStage_'+hashId).val() ){
                            selected = 'selected';
                        }
                        html += '<option value="'+index+'" '+selected+'>' + value + '</option>';
                    });
                    html +="</select>";
                    $("#applicationValueUpdate_"+hashId).html(html);
                    $("#applicationValueUpdate_"+hashId).show();
                    $('.chosen-select').chosen();
                    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
					//$('.chosen-select').trigger('chosen:updated');
                }else{
                    $("#applicationValueUpdate_"+hashId).html('');
                    $("#applicationValueUpdate_"+hashId).hide();
                    $('.chosen-select').chosen();
                    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
					//$('.chosen-select').trigger('chosen:updated');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }else{
        $.ajax({
            url: '/applicationfields/getUpdateValueFields',
            type: 'post',
            dataType: 'html',
            data: {hashData: $("#hashData").val(),encrypted:$("#hashId_"+hashId).val(),hash: hashId, product:product,configId:configId,collegeId:collegeId,update_type:update_type,fieldsName:fieldsName},
            beforeSend: function () {
                $('.loader-block').show();
            },
            complete: function () {
                $('.loader-block').hide();
            },
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (html) {
                $("#applicationValueUpdate_"+hashId).html(html);
                $("#applicationValueUpdate_"+hashId).show();
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
				//$('.chosen-select').trigger('chosen:updated');
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

function runAllocationLogic(hashId) {
    $.ajax({
        url: '/applicationfields/runAllocationLogic',
        type: 'post',
        dataType: 'json',
        data: {hashId:hashId},
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
            if (json['status'] !==200) {
                if(json['message'] =='session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(json['message'], 'error');
                }
            }else{
                alertPopup(json['message'], 'success');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
