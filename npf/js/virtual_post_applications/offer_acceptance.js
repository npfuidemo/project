
$(document).ready(function(){
    if($("#page_title").length > 0){
        getOfferPageTitle();
    }
});

$(document).on('keydown', 'form', function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        return;
    }
});
$(document).on('click', '#page_title_tab', getOfferPageTitle);
$(document).on('click', '.gdpi_offer_acceptance_page_title_save', saveGdpiOfferAcceptancePageTitle);
$(document).on('change', '.criteriaSelection', updateCriteriaSelection);
$(document).on('change', '.applicationStageSelection', getApplicationSubStage);
$(document).on('click', '#saveEnablementConfiguration', saveEnablementConfiguration);
$(document).on('click', '#savePaymentConfiguration', savePaymentConfiguration);
$(document).on('click','.configStatus', changeConfigStatus);

function getOfferPageTitle() {
    $(document).find('#page_title_tab').attr('offerPageTitleId', '0');
    $.ajax({
        url: jsVars.FULL_URL + '/virtual-post-applications/get-offer-page-title',
        type: 'post',
        dataType: 'html',
        data: {collegeId:jsVars.collegeId, formId:jsVars.formId, postApplicationProcessId:jsVars.postApplicationProcessId},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        complete:function(){
            $("html, body").animate({scrollTop:0}, 1000);
            $(this).parent('.tab-pane').addClass('fadeIn');

        },
        beforeSend: function () {
          //  showLoader();
        },
        async: false,
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status===1){
                if(responseObject.data.html) {
                    $(document).find("#page_title").html(responseObject.data.html);
                }
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message, 'error');
                }
            }
            if($(".sumo-select").length){
                $(".sumo-select").SumoSelect();
            }
        //    window.history.replaceState(null, null, "?page=pagetimeline");

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function () {
            $('.chosen-select').chosen();
           // hideLoader();
        }
    });
}

function updateCriteriaSelection() {
    var selectedCriteria = $(this).val();
    var collegeId = jsVars.collegeId;
    var formId = jsVars.formId;
    var criteriaSelectionDiv = $(this).closest(".criteriaSelectionDiv");
    if(selectedCriteria === 'applicationStage') {
        $(this).closest('form').find(".applicationSubStageDiv").remove();
        $("#applicationStage").remove();
        $.ajax({
            url: '/virtual-post-applications/get-application-stages',
            type: 'post',
            data: {'collegeId':collegeId, 'formId':formId},
            async: false,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                if(typeof json['status'] !== 'undefined' && json['status'] ===0 && typeof json['message'] !== 'undefined' && json['message'] === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else if(typeof json['status'] !== 'undefined' && json['status'] ===1 && typeof json['data']['applicationStages'] !== 'undefined') {
                    $('.applicationStageDiv').remove();
                     var applicationStageOption = '';
                     $.each( json['data']['applicationStages'], function( index, value ){
                        applicationStageOption += '<option value="'+index+'">'+value+'</option>';
                    });
                    applicationStageOption = '<option value="">Select Application Stage</option>'+applicationStageOption;
                    var applicationStageHtml = '<div class="col-sm-4 applicationStageDiv">';
                    applicationStageHtml += '<div class="form-group">';
                    applicationStageHtml += '<select name="json_attributes[applicationStage]" id="applicationStage" class="form-control applicationStageSelection">'+applicationStageOption;
                    applicationStageHtml += '</select>';
                    applicationStageHtml += '</div>';
                    applicationStageHtml += '</div>';
                    criteriaSelectionDiv.find('.stageSelectionRow').append(applicationStageHtml);
                    $('.applicationStageSelection').SumoSelect({placeholder: '', search: true, searchText: 'Search', triggerChangeCombined: false});
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    } else {
        $(".applicationStageDiv").remove();
        $(".applicationSubStageDiv").remove();
    }
}

function getApplicationSubStage() {
    $(this).closest('form').find(".applicationSubStageDiv").remove();
    var formId = jsVars.formId;
    var applicationStage = $(this).val();
    var criteriaSelectionDiv = $(this).closest('.applicationStageDiv');
    if(applicationStage !== '') {
        $.ajax({
            url: '/virtual-post-applications/get-application-sub-stages',
            type: 'post',
            data: {'stageId':applicationStage, 'formId':formId},
            async: false,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                if(typeof json['status'] !== 'undefined' && json['status'] ===0 && typeof json['message'] !== 'undefined' && json['message'] === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else if(typeof json['status'] !== 'undefined' && json['status'] ===1 && typeof json['data']['applicationSubStages'] !== 'undefined') {
                    var applicationSubStageOption = '';
                    $.each( json['data']['applicationSubStages'], function( index, value ){
                        applicationSubStageOption += '<option value="'+index+'">'+value+'</option>';
                    });
                    if (applicationSubStageOption !== '') {
                        applicationSubStageOption = '<option value="">Select Application Sub Stage</option>'+applicationSubStageOption;
                        var applicationSubStageHtml = '<div class="col-sm-4 applicationSubStageDiv">';
                        applicationSubStageHtml += '<div class="form-group">';
                        applicationSubStageHtml += '<select name="json_attributes[applicationSubStage]" class="form-control applicationSubStage">'+applicationSubStageOption;
                        applicationSubStageHtml += '</select>';
                        applicationSubStageHtml += '</div>';
                        applicationSubStageHtml += '</div>';
                        criteriaSelectionDiv.parent().append(applicationSubStageHtml);
                        $('.applicationSubStage').SumoSelect({placeholder: '', search: true, searchText: 'Search', triggerChangeCombined: false});
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}
//Enable Configuration Ajax load
function getEnablementConfiguration() {
    $(document).find('#enablemenet_config_tab').attr('enblementConfigurationId', '1');
    $.ajax({
        url: jsVars.FULL_URL + '/virtual-post-applications/get-enablement-configuration',
        type: 'post',
        dataType: 'html',
        data: {'collegeId':jsVars.collegeId, 'formId':jsVars.formId},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        complete:function(){
            $("html, body").animate({scrollTop:0}, 1000);
            $(this).parent('.tab-pane').addClass('fadeIn');
        },
        beforeSend: function () {
            
        },
        async: false,
        success: function (response) {
            if (response == "session") {
                window.location.reload(true);
            }else if(response == "invaid_req"){
               window.location.replace(jsVars.FULL_URL+'/post-applications/');
            }
            $(document).find("#enablemenet_config").html(response);

            if($(".sumo-select").length){
                $(".sumo-select").SumoSelect();
            }
         //   window.history.replaceState(null, null, "?page=enablementconfiguration");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function () {
            $('.chosen-select').chosen();
           // hideLoader();
        }
    });
}

//Payment Configuration Ajax load
function getPaymentConfiguration() {
    // $(document).find('#payment_config_tab').attr('enblementConfigurationId', '1');
    $.ajax({
        url: jsVars.FULL_URL + '/virtual-post-applications/get-payment-configuration',
        type: 'post',
        dataType: 'html',
        data: {'collegeId':jsVars.collegeId, 'formId':jsVars.formId,},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        complete:function(){
            $("html, body").animate({scrollTop:0}, 1000);
            $(this).parent('.tab-pane').addClass('fadeIn');

        },
        beforeSend: function () {
          //  showLoader();
        },
        async: false,
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status===1){
                if(responseObject.data.html) {
                    $(document).find("#payment_config").html(responseObject.data.html);
                }
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message, 'error');
                }
            }
            if($(".sumo-select").length){
                $(".sumo-select").SumoSelect();
            }
          //  window.history.replaceState(null, null, "?page=paymentconfiguration");

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function () {
            $('.chosen-select').chosen();
           // hideLoader();
        }
    });
}

function saveGdpiOfferAcceptancePageTitle(type) {
    var applicant_eligibility_criteria = $("#applicant_eligibility_criteria").val();
    var btnTextMatch = /[!@#$%&*()_\-+={[}\]\<,>?\/\\~`]/g
    var checkValidation = true;
    if(applicant_eligibility_criteria == "selectapplicanteligibilitycriteria" || applicant_eligibility_criteria.trim()==''){
        $(".criteria-error").html("Please select this field.");
        checkValidation = false;
    }
    var start_date = $("#start_date").val();
    if(start_date ==''){
      $(".start-date-error").html("Please select this field.");
      checkValidation = false;
    }
    var end_date = $("#end_date").val();
    if(end_date ==''){
       $(".end-date-error").html("Please select this field.");
        checkValidation = false; 
    }
    var btn_txt = $("#btn_txt").val();
    if(btn_txt.trim() ==''){
       $(".btn-error").html("Please select this field.");
        checkValidation = false;   
    }else if(btnTextMatch.test(btn_txt)){
       $(".btn-error").html("Special characters not allowed."); 
       checkValidation = false;
    }
    var page_heading = $("#page_heading").val();
    if(page_heading.trim() ==''){
        $(".title-error").html("Please select this field.");
        checkValidation = false;
    }
    if(checkValidation==false){
        return false;
    }else if(checkValidation == true){
    event.preventDefault();
    for (instance in CKEDITOR.instances)
    {
        CKEDITOR.instances[instance].updateElement();
    }
    $.ajax({
        url: '/virtual-post-applications/save-gdpi-offer-acceptance_page_title',
        type: 'post',
        data: $('#save-gdpi-offer-acceptance_page_title').serialize(),
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if(typeof json['status'] !== 'undefined' && json['status'] ===0 && typeof json['message'] !== 'undefined' && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(typeof json['status'] !== 'undefined' && (json['status'] ===1 || json['status'] ===true)) {
                //var panelBodyId = $("#processtabs li.active").find('.gdpiProcess').attr('href');
                if(type == 'save'){
                    alertPopup("Candidate Flow Configuration saved successfully.",'success');
                    $("#offerClass").removeClass("disabled");
                    $(".hideError").html('');
                    $('.close').click(function () {
                    window.location.reload(true);
                });
                }else{
                    $('#myTab').find('#pref_config_tab').trigger('click');
                    $("#offerClass").removeClass("disabled");
                }
                if($(".sumo-select").length){
                    $(".sumo-select").SumoSelect();
                }
            } else{
                alertPopup(json['message'], 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    }
}


function savePaymentConfiguration() {
    event.preventDefault();
    for (instance in CKEDITOR.instances)
    {
        CKEDITOR.instances[instance].updateElement();
    }
    $.ajax({
        url: '/virtual-post-applications/save-payment-configuration',
        type: 'post',
        data: $(this).closest('form').serialize(),
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if(typeof json['status'] !== 'undefined' && json['status'] ===0 && typeof json['message'] !== 'undefined' && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(typeof json['status'] !== 'undefined' && (json['status'] ===1 || json['status'] ===true)) {
                //var panelBodyId = $("#processtabs li.active").find('.gdpiProcess').attr('href');
                alertPopup("Offer Acceptance Configuration saved successfully.","success");
            } else{
                alertPopup(json['message'], 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function saveEnablementConfiguration(type) {
    var alias_name_error = $("#offer_alias_name").val();
    var validate = true;
    if(alias_name_error.trim() == ""){
        $(".offer-alias-error").html("Field cann't be empty");
        validate =  false;
    }
    var offer_status_error = $("#offer_status").val();
    if(offer_status_error.trim() == ''){
        $(".offer-status-error").html("Field cann't be empty");
        validate =  false;
    }
    if(validate === false){
        return false;
    }else if(validate === true){
    event.preventDefault();
    for (instance in CKEDITOR.instances)
    {
        CKEDITOR.instances[instance].updateElement();
    }
    $.ajax({
        url: '/virtual-post-applications/save-enablement-configuration',
        type: 'post',
        data: $('#enablement').serialize(),
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if(typeof json['status'] !== 'undefined' && json['status'] ===0 && typeof json['message'] !== 'undefined' && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(typeof json['status'] !== 'undefined' && (json['status'] ===1 || json['status'] ===true)) {
                //var panelBodyId = $("#processtabs li.active").find('.gdpiProcess').attr('href');
                if(type==='save'){
                    alertPopup("Configuration Status saved successfully.","success");
                    $("#paymentConfigClass").removeClass("disabled");
                    $(".offer-alias-error").html("");
                    $(".offer-status-error").html("");
                }else{
                    $('#myTab').find('#payment_config_tab').trigger('click');
                    $("#paymentConfigClass").removeClass("disabled");
                }
            } else{
                alertPopup(json['message'], 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
}

function offerPrefConfig() {
    $("#prefConfig").html('');
    $.ajax({
        url: '/virtual-post-applications/offer-preference-config',
        type: 'post',
        dataType: 'html',
        data: {"type": 'get_page','collegeId':jsVars.collegeId, 'formId':jsVars.formId,},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
        },
        success: function (data) {
            if (data == "session") {
                window.location.reload(true);
            }else if(data == "invaid_req"){
               window.location.replace(jsVars.FULL_URL+'/post-applications/');
            }

            $("#pref_config").html(data);
            $(".sumo_select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true});

            $(".headBox").addClass('ui-sortable-handle');
            $(".dragheading").addClass('ui-sortable');

            $('input[name*="scoringview"]').click(function(){
                var inputValue = $(this).attr("value");
                var targetBox = $("." + inputValue);
                $(".scoringappyes").not(targetBox).hide();
                $(targetBox).show();
            });

           $(function() {
               $( ".sortablecolumn" ).sortable();
               $( ".sortablecolumn" ).disableSelection();
           });

           $(function() {
                $( ".collapse_and_drag" ).sortable();
                $( ".collapse_and_drag" ).disableSelection();
           });

          $(function() {
               $( ".collapse_and_drag" ).sortable();
               $( ".collapse_and_drag" ).disableSelection();
          });
        //    window.history.replaceState(null, null, "?page=prefconfig");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getColumnValue(context, url) {
    var val_id = $(context).attr('data-id');
    var subcount = $("#" + val_id).find('.max_subcount').val();
    $("#ref_id").val(val_id + "$" + subcount);
    $("#ref_url").val(url);
}

function addNewRow(context) {
    $(context).closest(".actionbtn").removeClass("open");
    var ref_id = $("#ref_id").val();
    var column_count = $(context).val();
    var id = ref_id.split("$")[0];
    var url = $("#ref_url").val();
    $.ajax({
        url: jsVars.FULL_URL + url,
        type: 'post',
        dataType: 'html',
        data: {ref_id: ref_id, column_count: column_count,'collegeId':jsVars.collegeId, 'formId':jsVars.formId},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (data == "session_logout") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else {
                $("#" + id).append(data);
                $(".sumo_select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true});
                $("#" + id).find(".form-group").addClass('ui-sortable-handle');
                $("#" + id).find('.max_subcount').val(Number(ref_id.split("$")[1]) + 1);
                $(function() {
                $( ".sortablecolumn" ).sortable();
                $( ".sortablecolumn" ).disableSelection();
            });
            }
        }});
}
function removeRow(context, type) {
    var name_sel = '';
    if (typeof type == "undefined") {
        return false;
    } else if (type == 'ap') {
        name_sel = 'application_form_fields';
    }
    
    if(type == 'ifCond' || type == 'ifCondReq'){
        remove_row_condition(context, type, name_sel)
    }else{
        remove_row(context, type, name_sel);
    }
    

    return false;
}

function remove_row(context, type,name_sel) {
    $('#ConfirmMsgBody').html('Do you want to delete ?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
    .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                e.preventDefault();
                var id = "#" + $(context).siblings().attr('data-id');
                $($("#" + $(context).siblings().attr('data-id')).find('.max_subcount')).val(($("#" + $(context).siblings().attr('data-id')).find('.max_subcount').val() - 1));
                $(context).closest('.row.form-group').remove();
                var stage_count = 1;
                var head_count = Number(jQuery(id).siblings('.row').find('.count_stage').text()) - 1;
                //alert(id);
                jQuery(id).find('.row.form-group').each(function () {
                    //alert(jQuery(this).find('.count_sub_stage'));
                    jQuery(this).find('.count_sub_stage').html(stage_count);
                    if (type == 'eval') {
                        jQuery(this).find('.dataTarget').attr('data-target', '#helptextfield' + stage_count);
                        jQuery(this).find('.collapse').attr('id', 'helptextfield' + stage_count);
                    }
                    if(type=='ifCondCalc'){
                        var parent_index=id.split('updatecalc_if_')[1];
                        jQuery(this).find('.if_sel_value').attr('name', 'add_rule[update_calculate]['+parent_index+'][select_value][' + (Number(stage_count) - 1) + ']');
                        removeClass=jQuery(this).find('.selectValueDivClass').attr("class").match(/[\w-]*criteria[\w-]*/g);
                        jQuery(this).find('.selectValueDivClass').removeClass(removeClass);
                        jQuery(this).find('.selectValueDivClass').addClass('criteria-calculate-field-calc-'+ (Number(stage_count) - 1) );
                        jQuery(this).find('.rule_if').attr('onchange', 'buildScoringAutomationCreateInputForCalc(this,' + (Number(stage_count) - 1) + ',"",'+parent_index+',"")');
                        jQuery(this).find('.rule_if').attr('name', 'add_rule[update_calculate]['+parent_index+'][select_if]' + '[' + (Number(stage_count) - 1) + ']');
                        jQuery(this).find('.sel_expression').attr('name', 'add_rule[update_calculate]['+parent_index+'][select_expression]' + '[' + (Number(stage_count) - 1) + ']');
                        removeClass=jQuery(this).find('.sel_expression').parent().parent().attr('class').match(/[\w-]*condition-expression[\w-]*/g);
                        jQuery(this).find('.sel_expression').parent().parent().removeClass(removeClass);
                        jQuery(this).find('.sel_expression').parent().parent().addClass('condition-expression-field-cal-' + (Number(stage_count) - 1));
                        
                    }else {
                        jQuery(this).find('.sumo_select').each(function () {
                            if (type == 'group' || type == 'eval') {
                                jQuery(this).attr('name', name_sel + '[' + (Number(stage_count) - 1) + '][]')
                            } else {
                                jQuery(this).attr('name', name_sel + '[' + head_count + '][' + (Number(stage_count) - 1) + '][]')
                            }

                            //alert(head_count);
                        });
                    }
                    stage_count++;
                });
                $('#ConfirmPopupArea').modal('hide');
            });
}

function savePrefConfig(url,type) {
    $('.error').text('');
    var ifConnected = window.navigator.onLine;
    if(!ifConnected){
        alertPopup("Connection Error !", 'error');
        return false;
    }  
    var checkValue = $("#fieldSelect").val(); 
    if(checkValue == ''){
        $("#field-error").html("Please Select field");
        return false;
    }
    var data = $("form#prefConfig").serializeArray();
    data.push({name:"collegeId",value:jsVars.collegeId});
    data.push({name:"formId",value:jsVars.formId});
    $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (data['message'] == "session") {
                window.location.reload(true);
            }else if(data['message'] == "invaid_req"){
               window.location.replace(jsVars.FULL_URL+'/post-applications/'); 
            }else if (data['status'] == 0) {
                for (var i in data['data']) {
                    $(".error_" + i).text(data['data'][i]);
                    //$(".error_" + i).scrollTop(0);
                }
            } else if (data['status'] == 1) {
                if(data['data']!=''){
                    setTimeout(function(){ window.location = data['data']; }, 3000);
                }else if(type==='saveandnext'){
                    $("#enablemenet_config_tab").trigger('click');
                    $("#configStatusClass").removeClass("disabled");
                }else if(type==='save'){
                    alertPopup("Offer Details config saved successfully.","success"); 
                    $("#configStatusClass").removeClass("disabled");
                    $("#field-error").html("");
                }
                    
            }else {
                alertPopup(data['message'], 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$(document).on('click',"#offer_details_prev",function(){
    $("#page_title_tab").trigger('click');
});
$(document).on('click',"#payment_prev",function(){
    $("#enablemenet_config_tab").trigger('click');
});
$(document).on('click',"#config_status_prev",function(){
    $("#pref_config_tab").trigger('click');
});

function initCKEditor(tokens, setData){
    if(typeof CKEDITOR == 'undefined')
    {
        window.setTimeout(function(){
            initCKEditor(tokens);
        }, 500);
        return;
    }

    var newToken = [];
    jQuery.each(tokens, function (index, category) {
        if(category !== ''){
            jQuery.each(category, function (index, value) {
                value = $.parseJSON(value);
                newToken.push(value);
            });
        }
    });

    if(typeof tokens =='undefined' || tokens == ''){
        tokens = [["", ""]];
    }
    if(typeof newToken =='undefined' || newToken == ''){
        newToken = [["", ""]];
    }

    if(typeof CKEDITOR.instances['editor'] != 'undefined'){
        delete CKEDITOR.instances['editor'];
        jQuery('#cke_editor').remove();
    }

    if(typeof fullPageCkEditorHtml != 'undefined' && fullPageCkEditorHtml === true) {
        fullPageCk = true;
        allowedContent = true;
    } else {
        fullPageCk = false;
        allowedContent = false;
    }

    CKEDITOR.replace( 'offerEditor',{
        fullPage: fullPageCk,
        allowedContent: allowedContent,
        extraPlugins: 'token,justify',
        allTokens: tokens,
        availableTokens: newToken,

            tokenStart: '{{',
            tokenEnd: '}}',
            on: {
                instanceReady: function( evt ) {
                    $('div.loader-block').hide();
                },
                change: function( evt ) {
                    if($("#is_edit_template").length > 0) {
                        $("#is_edit_template").val(1);
                    }
                }
        }
    });
    if(setData != ''){
        CKEDITOR.instances['editor'].setData(setData);
    }
}
function getCkeditorTokenList(bookingSubmitText='') {
    var tokenList = [];
    $.ajax({
        url: '/communications/getCkeditorTokenList',
        type: 'post',
        data: {collegeId:jsVars.collegeId, formId:jsVars.formId,type:"offer_exceptance"},
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(json['status'] ===1 && typeof json['data']['tokenList'] !== 'undefined') {
                tokenList = json['data']['tokenList'];
            }
            initCKEditor(tokenList, json['data']['responseText']);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function changeConfigStatus() {
    var status = 0;
    var thisObj = $(this);
    if($(this).is(":checked")) {
        status = 1;
        $(this).prop('checked', false);
    } else {
        $(this).prop('checked', true);
    }
    var gdpi_process_id =  $("#gdpi_process_id").val();
    var textForPopUp = 'Do you want to disable this configuration ?';
    var successTextForPopUp = 'This configuration is disabled successfully.';
    if(status===1){
        textForPopUp = 'Do you want to enable this configuration ?';
        successTextForPopUp = 'This configuration is enabled successfully.';
    }
    $("#ConfirmPopupArea").css('z-index',11001);
    $('#ConfirmPopupArea .npf-close').hide();
    $('#ConfirmMsgBody').html(textForPopUp);
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/virtual-post-applications/updateConfigStatus',
            type: 'post',
            data: {'gdpiProcessId':gdpi_process_id,'collegeId':jsVars.collegeId, 'formId':jsVars.formId, 'status':status},
            async: false,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                if(json['status'] ===0 && json['message'] === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }
                alertPopup(successTextForPopUp, 'notification');
                if(status === 1) {
                    $(thisObj).prop('checked', true);
                } else {
                    $(thisObj).prop('checked', false);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        $('#ConfirmPopupArea').modal('hide');
    });
}

function btncheck(e) {
//for multiple checkbox select code hide fro further enhacement
//    if(multiple == 0){
//        var checkboxName = document.getElementsByClassName('disableCheckbox');
//        for (var i = 0; i < checkboxName.length; i++) {
//            if (!e.checked) {
//                checkboxName[i].disabled = false;
//            } else {
//                if (!checkboxName[i].checked) {
//                    checkboxName[i].disabled = true;
//                } else {
//                    checkboxName[i].disabled = false;
//            }
//        }
//        }
//    }
    $( "tr" ).each(function( index ) {
        if ($("#enable_config_on_"+index).prop("checked") == false) {
            $('.'+index).prop('disabled',true);
            $(".btnenable").prop('disabled',true);
        }
    });
    if(e.checked){
        var index = $(e).attr('id');
        var split = index.split('_');
        $('.'+split[3]).removeAttr("disabled");
        $(".btnenable").removeAttr("disabled");
    }

}

function saveOfferPreference(type){
    var data = $("#offer_accept").serializeArray();
    data.push({name: "type", value: type});
    $.ajax({
        url: '/virtual-post-applications/save-offer-preference-user-select',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (response) {
            if (response['message'] == "session") {
               window.location.reload(true);
            }else if(response['message'] == "invaid_req"){
               window.location.replace(jsVars.FULL_URL+'/post-applications/'); 
            }else if (response['status'] == 1) {
                if(type==='save'){
                    alertPopup("Data saved successfully","success"); 
                    $('.close').click(function () {
                        window.location.reload(true);
                    });
                }else if(type==='saveandpayment'){
                    location =response['redirecrUrl']; 
                }
            }else {
                alertPopup(data['message'], 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


    









