var ajaxInprocess = 0;

$(document).ready(function () {

    if ($('#connectorCollegeId').length > 0) {
        $("#connectorCollegeId").change(function () {
            var cId = $("#connectorCollegeId").val();
            loadCollegeForms(cId);
            loadTriggerPoints();
            $('#parent_div_load_appstage').hide();
        });
    }
    
    if($('#form_id').length > 0){
        if($('#form_id').val() != ''){
            loadFormFieldsAndTokens($('#form_id').val()); 
        }
    }
    
    if ($('#connector_college_id').length > 0) {
         LoadErpData('reset');
    }
    
    $("#connectorVendor").change(function () {
        var vendor = $("#connectorVendor").val();
        if(vendor == 'other'){
            $('#otherVendorName').show();
        }else{
            $('#otherVendorName').hide();
        }
    });
        
    enableDisableTriggerOption();
    showHideJsonValidator();
});

/** call form tokens **/
$("html").on('change', '#form_id', function () {
    var ffId = $("#form_id").val();
    loadFormFieldsAndTokens(ffId);
    loadTriggerPoints(ffId);
    $('#parent_div_load_appstage').hide();
    $('#parent_div_load_tokenFee').hide();
});

$('html').on('change','#template_format_type',function(){
    showHideJsonValidator();
});

$('html').on('change','#trigger_point_config',function(){
    var triggerPoints = $('#trigger_point_config').val();
    
    if(triggerPoints === null || triggerPoints.indexOf('app_stage') < 0){
        $('#parent_div_load_appstage').hide();
        $('#app_stage').val('').trigger('chosen:updated');
    }  else {
        $('#parent_div_load_appstage').show();
    }
    
    if(triggerPoints === null || triggerPoints.indexOf('token_fee') < 0){
        $('#parent_div_load_tokenFee').hide();
        $('#token_fee').val('').trigger('chosen:updated');
    }  else {
        $('#parent_div_load_tokenFee').show();
    }
    enableDisableTriggerOption();
});

function enableDisableTriggerOption() {
    var triggerPoints = $('#trigger_point_config').val();
    if(typeof triggerPoints  !== "undefined") {
        if(triggerPoints !== null && triggerPoints.indexOf('lead_verified') >= 0){
            $('#trigger_point_config').find('option[value="lead_v_u_both"]').prop('disabled', true).trigger('chosen:updated');
        }
        if(triggerPoints !== null && triggerPoints.indexOf('lead_unverified') >= 0){
            $('#trigger_point_config').find('option[value="lead_v_u_both"]').prop('disabled', true).trigger('chosen:updated');
        }
        if(triggerPoints !== null && triggerPoints.indexOf('lead_v_u_both') >= 0){
            $('#trigger_point_config').find('option[value="lead_verified"]').prop('disabled', true).trigger('chosen:updated');
            $('#trigger_point_config').find('option[value="lead_unverified"]').prop('disabled', true).trigger('chosen:updated');
        }
        if(triggerPoints === null || (triggerPoints.indexOf('lead_verified') < 0 && triggerPoints.indexOf('lead_unverified') < 0 && triggerPoints.indexOf('lead_v_u_both') < 0)){
            $('#trigger_point_config').find('option[value="lead_verified"]').prop('disabled', false).trigger('chosen:updated');
            $('#trigger_point_config').find('option[value="lead_unverified"]').prop('disabled', false).trigger('chosen:updated');
            $('#trigger_point_config').find('option[value="lead_v_u_both"]').prop('disabled', false).trigger('chosen:updated');
        }
    }
}

function showHideJsonValidator(){
    var template_format_type = $("#template_format_type").val();
    if(template_format_type == 'xml'){
        $('.form-data-key').hide();
        $('.validate-json').hide();
        $('.form-data-key-name').hide();
        $('.form-data-format').hide();
        $('.validate-xml').show();
    } else if(template_format_type == 'form-data'){
        $('.form-data-key').show();
        $('.validate-json').show();
        $('.form-data-key-name').hide();
        $('.form-data-format').hide();
        $('.validate-xml').hide();
    } else if(template_format_type == 'json'){
        $('.form-data-key').hide();
        $('.validate-json').show();
        $('.form-data-key-name').hide();
        $('.form-data-format').hide();
        $('.validate-xml').hide();
    }
    
    if($("#form_data_key").is(':checked')) {
        $('.form-data-key-name').show();
        $('.form-data-format').show();
    }
}

function formDataKeySelection(e){
    if($(e).prop("checked") == true){
       $('.form-data-key-name').show();
       $('.form-data-format').show();
    } else {
       $('.form-data-key-name').hide();
       $('.form-data-format').hide();
    }
}

$('.erpStep1').click(function () {
    //$('#div_load_tokenFee').find("input[name='unipe_fee[]']").remove()
    //$('#div_load_tokenFee').find("input[name='token_fee[]']").remove()
    npf_token_fee = $("select[name='token_fee[]']").val()
    $("#token_fee :selected").each(function($index,$value) {
        feetype = $(this).data('feetype')
        if(feetype == 'unipe'){
            const index = npf_token_fee.indexOf($(this).val());
            if (index > -1) {
              npf_token_fee.splice(index, 1);
            }
            $('#div_load_tokenFee').append("<input type = 'hidden' name = 'unipe_fee[]' value='"+$(this).val()+"'>")
        }
    });
    $("select[name='token_fee[]']").val(npf_token_fee)
    var valid = validateErpConfig();
    if(valid) {
        validateErpAjax();
    }
    if($('#form_id').val() == 0){
        loadFormFieldsAndTokens(0); 
    }
    if($('#field_id option').length > 1) {
        $('#div_load_form_tokens').show();
    } else {
        $('#div_load_form_tokens').hide();
    }
    if($('#paymentRelatedTokenId option').length > 1) {
        $('#div_load_payment_related_tokens').show();
    }
    else {
        $('#div_load_payment_related_tokens').hide();
    }
    if($('#additionalTokenId option')   .length > 1) {
        $('#div_load_additional_tokens').show();
    }
    else {
        $('#div_load_additional_tokens').hide();
    }
});

function validateErpConfig(){
    var valid = true;
    if($('#connectorCollegeId').val().trim() == ''){
        $('#connectorCollegeId').parent().addClass('has-error');
        $('#connectorCollegeId').parent().find('.error').html('Please select college name');
        valid = false;
    } else {
        $('#connectorCollegeId').parent().removeClass('has-error');
        $('#connectorCollegeId').parent().find('.error').html(''); 
    }
    
    if($('#trigger_point_config').val() === null){
        $('#trigger_point_config').parent().addClass('has-error');
        $('#trigger_point_config').parent().find('.error').html('Please select trigger point.');
        valid = false;
    } else if($('#trigger_point_config').val().indexOf('app_stage') >= 0 || $('#trigger_point_config').val().indexOf('token_fee') >= 0) {
        if($('#trigger_point_config').val().indexOf('app_stage') >= 0 && $('#app_stage').val() === null){
            $('#app_stage').parent().addClass('has-error');
            $('#app_stage').parent().find('.error').html('Please select staging point.');
            valid = false;
        }
        if($('#trigger_point_config').val().indexOf('token_fee') >= 0 && $('#token_fee').val() === null){
            if($("input[name='unipe_fee[]']").val() == '' || $("input[name='unipe_fee[]']").val() == undefined){
                $('#token_fee').parent().addClass('has-error');
                $('#token_fee').parent().find('.error').html('Please select token fee.');
                valid = false;
            }
            
        }
    }  else {
        $('#trigger_point_config').parent().removeClass('has-error');
        $('#trigger_point_config').parent().find('.error').html(''); 
    }
    
    if($('#connectorVendor').val().trim() == ''){
        $('#connectorVendor').parent().addClass('has-error');
        $('#connectorVendor').parent().find('.error').html('Please select vendor type.');
        valid = false;
    } else {
        $('#connectorVendor').parent().removeClass('has-error');
        $('#connectorVendor').parent().find('.error').html(''); 
    }
    
    if($('#template_format_type').val() == 'form-data') {
        if($("#form_data_key").is(':checked') && $('#form_data_key_name').val().trim() == ''){
            $('#form_data_key_name').parent().addClass('has-error');
            $('#form_data_key_name').parent().siblings('.error').html('Please enter data key name.');
            valid = false;
        } else {
            $('#form_data_key_name').parent().removeClass('has-error');
            $('#form_data_key_name').parent().siblings('.error').html(''); 
        }
    }
    
    $("#connectorCollegeId").change(function(){
        $('#connectorCollegeId').parent().removeClass('has-error');
        $('#connectorCollegeId').parent().find('.error').html('');
        $('#form_id').parent().removeClass('has-error');
    });
    
    $("#connectorVendor").change(function(){
        $('#connectorVendor').parent().removeClass('has-error');
        $('#connectorVendor').parent().find('.error').html('');
    });
    
    $("#trigger_point_config").change(function(){
        $('#trigger_point_config').parent().removeClass('has-error');
        $('#trigger_point_config').parent().find('.error').html('');
        if($('#trigger_point_config').val() === null || $('#trigger_point_config').val().indexOf('app_stage') < 0) {
            $('#app_stage').parent().removeClass('has-error');
            $('#app_stage').parent().find('.error').html('');
        }
        if($('#trigger_point_config').val() === null || $('#trigger_point_config').val().indexOf('token_fee') < 0) {
            $('#token_fee').parent().removeClass('has-error');
            $('#token_fee').parent().find('.error').html('');
        }
    });
    
    $("#app_stage").change(function(){
        $('#app_stage').parent().removeClass('has-error');
        $('#app_stage').parent().find('.error').html('');
    });
    $("#token_fee").change(function(){
        $('#token_fee').parent().removeClass('has-error');
        $('#token_fee').parent().find('.error').html('');
    });
    
    return valid;
}


function validateErpAjax(){

    var collegeId = $('#connectorCollegeId').val();
    var form_id = $('#form_id').val();
    var trigger_point_config = $('#trigger_point_config').val();
    var app_stage = $('#app_stage').val();
    var connector_vendor = $('#connectorVendor').val();
    var format_type = $('#template_format_type').val();
    var erp_name = $('#erp-name').val();
    
    data = {
        erp_name:erp_name,
        collegeId:collegeId,
        form_id:form_id,
        vendor:connector_vendor,
        trigger_point_config:trigger_point_config,
        app_stage:app_stage,
        format_type:format_type,
        url:$('input[name="url"]').val()
    };
    if(format_type=='form-data' && $('#form_data_key').prop("checked") == true){
        data['form_data_key'] = $('#form_data_key').val();
        data['form_data_key_name'] = $('#form_data_key_name').val();
        data['form_data_format'] = $('#form_data_format').val();
    }
    
    $.ajax({
        url: '/connector/validateErpForm',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            json = JSON.parse(json);
            if (json['session_logout']) {
                // if session is out
                location = FULL_URL;
            } 
            else if (json['status']==0) {
                // error display in popup
                $('.error-block-erp').show();
                $('#error-text').html(json['message']);
            }
            else if (json['status'] == 200){
                $('.error-block-erp').hide();
                $('#error-text').html(json['message']);
                $('.ErpStep1').hide();
                $('.ErpStep2').show();
				$('.stepsErp ul li:nth-child(1)').addClass('prevState');
                $('.stepsErp ul li:nth-child(2)').addClass('active');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$('.erpStep2').click(function () {
    $('.ErpStep1').show();
    $('.ErpStep2').hide();
	$('.stepsErp ul li:nth-child(1)').removeClass('prevState');
    $('.stepsErp ul li:nth-child(2)').removeClass('active');
});

$('.erpStep3').click(function () {
    $('.ErpStep3').show();
    $('.ErpStep4').hide();
    $('.erpStep3, .showErpStep5').hide();
    $('.erpStep2').show();
    $('.erpStep4').show();
	$('.stepsErp ul li:nth-child(4)').removeClass('prevState');
	$('.stepsErp ul li:last-child').removeClass('active');
});

$('.erpStep4').click(function () {
    $('.ErpStep4, .showErpStep5').show();
    $('.ErpStep3').hide();
    $('.erpStep3').show();
    $('.erpStep2').hide();
    $('.erpStep4').hide();
	$('.stepsErp ul li:nth-child(4)').addClass('prevState');
	$('.stepsErp ul li:last-child').addClass('active');
});

/** replace token to template data **/
var $templateTextArea = $("#templateFormatTextArea");
$("html").on('change', '#field_id,#userRelatedTokenId,#paymentRelatedTokenId,#additionalTokenId', function (e) {
    if(this.value != 0){
        e.preventDefault();
        switch (this.name) {
            case "userRelatedToken":
            case "paymentRelatedToken":
            case "field_id":
            case "additionalToken":
                $templateTextArea.replaceSelectedText("{{" + this.value + "}}", "collapseToEnd");
                break;
        }
        $templateTextArea.focus();
        window.setTimeout(function () {
            $templateTextArea.focus();
        }, 0);
    }
});


/** append college forms **/
function loadCollegeForms(cId) {
    $.ajax({
        url: '/voucher/get-forms',
        type: 'post',
        dataType: 'html',
        data: {
            "college_id": cId,
            "default_val": 0,
            "multiselect": ''
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if (data == "session_logout") {
                window.location.reload(true);
            }
            data = data+'<span class="error"></span>';
            $('#div_load_forms').html(data);
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/** load trigger points **/
function loadTriggerPoints(formId=0) {
    $.ajax({
        url: '/connector/get-triggerpoints',
        type: 'post',
        dataType: 'json',
        data: {
            "form_id": formId,
            "college_id": $("#connectorCollegeId").val(),
           "multiselect": 'multiselect'
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if (data == "session_logout") {
                window.location.reload(true);
            }
            $('#div_load_triggerspoints').html(data.trriggerPoint);
            $('.chosen-select').chosen();
            $('#div_load_appstage').html(data.formStages);
            $('#div_load_tokenFee').html(data.feeConfigs);
            $('.chosen-select').chosen();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
}

/** load form based tokens **/
function loadFormFieldsAndTokens(ffId) {
    $.ajax({
        url: '/connector/get-tokens',
        type: 'POST',
        dataType: 'html',
        data: {
            "form_id": ffId,
            "college_id": $("#connectorCollegeId").val(),
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if (data == "session_logout") {
                window.location.reload(true);
            }
            data = JSON.parse(data);
            $('#div_load_form_tokens').html(data.formFieldTokens);
            $('#div_load_user_related_tokens').html(data.userRelatedTokenStr);
            $('#div_load_payment_related_tokens').html(data.paymentRelatedTokenStr);
            $('#div_load_additional_tokens').html(data.additionalTokensStr);

            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $("#field_id").trigger("chosen:updated");
            $("#userRelatedTokenId").trigger("chosen:updated");
            $("#paymentRelatedTokenId").trigger("chosen:updated");
            $("#additionalTokenId").trigger("chosen:updated");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/** On college change from filter listing **/
$("html").on('change', '#college_id', function () {
    LoadErpData('reset');
});

/****For erp listing***/
function LoadErpData(type) {
    var data = [];
    if (type == 'reset') {
        ColPage = 0;
        $('#load_more_results,#tot_records').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
    }
    data = $('#FilterErp').serializeArray();
    data.push({name: "page", value: ColPage});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;Loading...');
    if(ajaxInprocess == 0){
        ajaxInprocess = 1;
        $.ajax({
            url: jsVars.FULL_URL + '/connector/ajax-lists',
            type: 'post',
            dataType: 'html',
            data: data,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            beforeSend: function () { 
                $('.loader-block').show();
            },
            complete: function () {
                ajaxInprocess = 0;
                $('.loader-block').hide();
                $('#filter').modal('hide');
            },
            success: function (data) {
                ColPage = ColPage + 1;
                if (data == "session_logout") {
                    window.location.reload(true);
                } else if (data == "norecord") {
                    if(ColPage==1){
                        $('#tot_records').html('');
                        $('#table-data-view').hide();
                        $('#load_msg_div').show();
                    }else{
                        $('#load_more_results tbody').append("<tr><td colspan='10' class='text-center text-danger fw-500'>No More Record</td><tr>");
                    };
                    $('#load_more_button').hide();
                    if (type != '' && ColPage==1) {
                        $('#if_record_exists').hide();
                    }
                } else {
                    data = data.replace("<head/>", '');
                    if (ColPage==1) {
                        $('#load_more_results').append(data);
                    } else {
                        $('#load_more_results tbody').append(data);
                    }

                    $('#load_more_button').removeAttr("disabled");
                    $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Load More Record');
                    dropdownMenuPlacement();
                    determineDropDirection();
                    $('#load_msg_div').hide();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

/** Preview**/

function testErp(id,key_name){
    if(typeof key_name == 'undefined'){
        key_name = '';
    }
    $('#listloader').show();
    $.ajax({
        url: '/connector/testErp',
        type: 'post',
        dataType: 'html',
        data: {id:id,key_name:key_name},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        complete: function () {
            $('#listloader').hide();
        },
        success: function (data) {
            data = data.replace("<head/>", '');
            if (data == "session_logout") {
                window.location.reload(true);
            }
            else {
                var validJson = false;
                var validXml = false;
                try {
                    data = JSON.parse(data);
                    validJson = true;
                } catch (e) {
                    validJson = false;
                }
                
                if(!validJson) {
                    var obj = validateXML(data);
                    if(obj.success) {
                        validXml = true;
                    }
                }
                
                var options = {
                            collapsed: false,
                            rootCollapsable: false,
                            withQuotes: true,
                            withLinks: false
                          };
                if(key_name == 'preview') {
                    var path_name = window.location.pathname;
                    if(path_name.includes('erp-manager')){
                        $("#previewModal").modal();  
                        if(validJson){
                            $('#preview').jsonViewer(data, options);
                        } else if(validXml) {
                            $("#preview").empty();
                            $("#preview").simpleXML({ xmlString: data });
                        } else {
                            $('#preview').html(data);
                        }
                    } else {
                        if(validJson){
                            $("#preview").jsonViewer(data, options);
                        } else if(validXml) {
                            $("#preview").empty();
                            $("#preview").simpleXML({ xmlString: data });
                        } else {
                            $('#preview').html(data);
                        }    
                    }
                } else {
                    if(validJson){
                       $("#testHit").jsonViewer(data, options);
                    } else {
                        $('#testHit').html(data);
                    } 
                    $("#previewModal").modal();  
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/** change Status**/

function changeStatus(id,status,collegeId){
    if(typeof status == 'undefined') {
        return false;
    }
    var textForPopUp = 'Do you want to change status ?';
    if(status==2){
        textForPopUp = 'Before enabling make sure TEST HIT is done. Enabling ERP will start pushing data to client end. Are you sure ?';
    }
    $("#ConfirmPopupArea").css('z-index',11001);
	$('#ConfirmPopupArea .npf-close').hide();
    $('#ConfirmMsgBody').html(textForPopUp);
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();
                    $.ajax({
                        url: '/Connectors/changeStatus/'+id,
                        type: 'post',
                        dataType: 'html',
                        data: {id:id,status:status,collegeId:collegeId},
                        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                        success: function (json) {
                            json = JSON.parse(json);
                            if (json['session_logout']) {
                                // if session is out
                                location = FULL_URL;
                            } 
                            else if (json['status']==0) {
                                // error display in popup
                                alertPopup(json['message'], 'error');
                            }
                            else if (json['status'] == 200){
                                alertPopup(json['message'], 'Success');
                                LoadErpData('reset');
                            }
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                        }
                    });
                $('#ConfirmPopupArea').modal('hide');
            });
}

// dropdownMenuPlacement with body
function dropdownMenuPlacement(){
	// hold onto the drop down menu                                             
    var dropdownMenu;
    // and when you show it, move it to the body                                     
    $('.ellipsis-left').on('show.bs.dropdown', function (e) {

                        // grab the menu        
                        dropdownMenu = $(e.target).find('.dropdown-menu');
                        dropHeight = dropdownMenu.outerHeight() - 50;

                        // detach it and append it to the body
                        $('body').append(dropdownMenu.detach());

                        // grab the new offset position
                        var eOffset = $(e.target).offset();
						var offsetDropPos = eOffset.top - dropHeight;
                        // make sure to place it where it would normally go (this could be improved)
                        dropdownMenu.css({
                                'display': 'block',
                                //'top': eOffset.top + $(e.target).outerHeight(),
                                'top': (offsetDropPos < 0) ? 0 : offsetDropPos,
                                'left': eOffset.left - 135
                        });
    });
    // and when you hide it, reattach the drop down, and hide it normally                                                   
        $('.ellipsis-left').on('hide.bs.dropdown', function (e) {
            $(e.target).append(dropdownMenu.detach());
                dropdownMenu.hide();
        });
}


// determineDropDirection
function determineDropDirection(){
  $(".ellipsis-left .dropdown-menu").each( function(){
    // Invisibly expand the dropdown menu so its true height can be calculated
    $(this).css({
      visibility: "hidden",
      display: "block"
    });

    // Necessary to remove class each time so we don't unwantedly use dropup's offset top
    $(this).parent().removeClass("dropup");

    // Determine whether bottom of menu will be below window at current scroll position
    if ($(this).offset().top + $(this).outerHeight() > $(window).innerHeight() + $(window).scrollTop()){
      $(this).parent().addClass("dropup");
    }

    // Return dropdown menu to fully hidden state
    $(this).removeAttr("style");
  });
}


function renderJson() {
    try {
      var input = eval('(' + $('#templateFormatTextArea').val() + ')');
    }
    catch (error) {
        $('#json-renderer').hide();
      //return alert("Cannot eval JSON: " + error);
    }
    var options = {
      collapsed: true,
      rootCollapsable: false,
      withQuotes: false,
      withLinks: false
    };
    $('#json-renderer').show();
    $('#json-renderer').jsonViewer(input, options);
  }

$('#json-renderer').hide();
// Generate on click
$('#btn-json-viewer').click(renderJson);


$('#submit_and_next').click(function(){
    event.preventDefault();
    var formatType = $('#template_format_type').val();
    var templateData = $('#templateFormatTextArea').val();
    if(formatType=='xml') {
        xml = templateData.replace(/(\r\n|\n|\r)/gm, "");
        $('#templateFormatTextArea').val(xml);
        $('#templateFormatTextArea').format({method: 'xml'});
        xml = $('#templateFormatTextArea').val();
        var returnObj = validateXML(xml);
        if(returnObj.success) {
            $('#connectorCreate').submit();
        } else {
            document.getElementById("result").innerHTML = returnObj.msg;
            document.getElementById("result").className = "alert alert-danger";
        }
    } else {
        try {
            var result = jsonlint.parse(document.getElementById("templateFormatTextArea").value);
            if (result) {
               document.getElementById("templateFormatTextArea").value = JSON.stringify(result, null, "  ");
               $('#connectorCreate').submit();
            }
        } catch(e) {
            document.getElementById("result").innerHTML = e;
            document.getElementById("result").className = "alert alert-danger";
        }
    }
});
  

function renderXml(textAreaId) {
    var xml = $('#'+textAreaId+'').val();
    xml = xml.replace(/(\r\n|\n|\r)/gm, "");
    $('#'+textAreaId+'').val(xml);
    $('#'+textAreaId+'').format({method: 'xml'});
    xml = $('#'+textAreaId+'').val();
    $('#json-renderer').hide();
    var returnObj = validateXML(xml);
    if(returnObj.success) {
        document.getElementById("result").innerHTML = "<i class='fa fa-check' aria-hidden='true'></i>&nbsp;XML is valid!";
        document.getElementById("result").className = "alert alert-success";
        $('#json-renderer').show();
        $("#json-renderer").empty();
        $("#json-renderer").simpleXML({ xmlString: xml });
    } else {
        document.getElementById("result").innerHTML = returnObj.msg;
        document.getElementById("result").className = "alert alert-danger";
    }
}

function validateXML(xml)
{
    var returnObj = new Object();
    try
    {
        var parser=new DOMParser();
        var xmlDoc=parser.parseFromString(xml,"application/xml");
    }
    catch(err)
    {
        returnObj.msg = err.message;
        returnObj.success = 0;
        return returnObj;
    }

    if (xmlDoc.getElementsByTagName("parsererror").length>0)
    {
        checkErrorXML(xmlDoc.getElementsByTagName("parsererror")[0]);
        returnObj.msg = xt;
        returnObj.success = 0;
        return returnObj;
    }
    else
    {
        try {
            returnObj.success = 1;
        } catch (ex) {
            returnObj.msg = ex;
            returnObj.success = 0;
            return returnObj;
        }
    }
    return returnObj;
}

function checkErrorXML(x)
{
    xt=""
    h3OK=1
    checkXML(x)
}

function checkXML(n)
{
    var l,i,nam
    nam=n.nodeName
    if (nam=="h3")
    {
        if (h3OK==0)
        {
            return;
        }
        h3OK=0
    }
    if (nam=="#text")
    {
        xt=xt + n.nodeValue + "\n"
    }
    l=n.childNodes.length
    for (i=0;i<l;i++)
    {
        checkXML(n.childNodes[i])
    }
}

$(function() {
		// open in fullscreen
		$('#fullscreen .requestfullscreen').click(function() {
			$('#fullscreen').fullscreen();
			return false;
		});

		// exit fullscreen
		$('#fullscreen .exitfullscreen').click(function() {
			$.fullscreen.exit();
			return false;
		});

		// document's event
		$(document).bind('fscreenchange', function(e, state, elem) {
			// if we currently in fullscreen mode
			if ($.fullscreen.isFullScreen()) {
				$('#fullscreen .requestfullscreen').hide();
				$('#fullscreen .exitfullscreen').show();
			} else {
				$('#fullscreen .requestfullscreen').show();
				$('#fullscreen .exitfullscreen').hide();
			}
		});
	});
	$('#btn-json-viewer').click(function(){
		$('.json-container').css('background-color', '#fff');
		$('.requestfullscreen').show();
	});
        $('#btn-xml-viewer').click(function(){
		$('.json-container').css('background-color', '#fff');
		$('.requestfullscreen').show();
	});
        $('#btn-xml-header-viewer').click(function(){
		$('.json-container').css('background-color', '#fff');
		$('.requestfullscreen').show();
	});


