/*
 * Application Manager javascript function .
 */


var dependentDropdownFieldList;

 /*code for chane stage, follow up, add remark and commnicate starts */
var currentUserId           = '';
var currentCollegeId        = '';
var currentFormId           = '';
var currentUserName         = '';
var currentStage            = '';
var disallowDown            = false;
var disallowFollowup        = false;
var disallowRemark          = false;
var disallowCommunication   = false;
var stageList               = [];
var processList               = [];
var currentCounsellorId     = jsVars.counsellorId;
var nextStepCondition           = 0;
var counsellorsAvailableForFollowup = false;
var applicationReassignCheck = '';
var queryReassignCheck = '';
var leadReassignCheck = '';

$(document).ready(function(){
    $('#lead_followup_date').on("blur", function() {
       if($('#lead_followup_date').val() != "") {
           // $("#div_followup_check").show();
           $("#followup_error").hide()
       } /*else {
           $("#div_followup_check").hide();
       }*/
    });
    if($("#lead_followup_date").length > 0){
        var lfdPlaceholder = $('#lead_followup_date').attr('placeholder');
        $('#lead_followup_date').datetimepicker({
			format: 'DD/MM/YYYY HH:mm',
			minDate:new Date(),
			viewMode: 'days'
			})
			.on('dp.hide', function(){
			if(this.value!=''){
				$(this).parent().addClass('floatify__active');
				$(this).attr('placeholder', '');
			}else{
				$(this).parent().removeClass('floatify__active');
				$(this).attr('placeholder', lfdPlaceholder);
			}
		});
    }
    if($("#form_stage_deadline").length > 0){
        $('#form_stage_deadline').datetimepicker({format: 'DD/MM/YYYY HH:mm', minDate:new Date(),viewMode: 'years'});
    }


    if($("#created_date").length > 0){
        $('#created_date').datetimepicker({format: 'DD/MM/YYYY',viewMode: 'years'});
    }
    if($("#date_start").length > 0){
        $('#date_start').datetimepicker({format: 'DD/MM/YYYY',viewMode: 'years'});
    }
    if($("#date_end").length > 0){
        $('#date_end').datetimepicker({format: 'DD/MM/YYYY',viewMode: 'years'});
    }

    if($("#reopenFormLogic").length > 0){
       $('#reopenFormLogic #logic_form_fields_stage').SumoSelect({placeholder: 'Form Stage'});
       $('#reopenFormLogic #logic_form_fields').SumoSelect({placeholder: 'Form Fields', selectAll : true, captionFormatAllSelected: "All Selected.",triggerChangeCombined: false,});
    }













    if($("#logic_form_startTime").length > 0){
        var lfsPlaceholder = $('#logic_form_startTime').attr('placeholder');
        $('#logic_form_token_payment').change(function(){
            let logicVal = $('#logic_form_token_payment').val();
            if(logicVal){
                $('#logic_form_startTime').data('DateTimePicker').minDate(false);
                $('#logic_form_startTime').data('DateTimePicker').maxDate(false);
                $('#logic_form_startTime').prop('placeholder', 'Select Edit Start Date')

                $('#logic_form_endTime').data('DateTimePicker').minDate(false);
                $('#logic_form_endTime').data('DateTimePicker').maxDate(false);
                $('#logic_form_endTime').prop('placeholder', 'Select Edit End Date')
            }
            
        });
        $('#logic_form_startTime').datetimepicker({
            format: 'DD/MM/YYYY HH:mm:ss',
            viewMode: 'years',
            widgetPositioning: {'vertical':'top'},
        })
            .on('dp.hide', function(){
            if(this.value!=''){
                $(this).parent().addClass('floatify__active');
                $(this).attr('placeholder', '');
            }else{
                $(this).parent().removeClass('floatify__active');
                $(this).attr('placeholder', lfsPlaceholder);
            }
		});
    }

    if($("#logic_form_endTime").length > 0){
        var lfePlaceholder = $('#logic_form_endTime').attr('placeholder');
        $('#logic_form_endTime').datetimepicker({
            format: 'DD/MM/YYYY HH:mm:ss',
            widgetPositioning: {'vertical':'top'},
            viewMode: 'years'})
            .on('dp.hide', function(){
            if(this.value!=''){
                $(this).parent().addClass('floatify__active');
                $(this).attr('placeholder', '');
            }else{
                $(this).parent().removeClass('floatify__active');
                $(this).attr('placeholder', lfePlaceholder);
            }
        });
    }
    
  if($("#edit_startTime").length > 0){
	var esPlaceholder = $('#edit_startTime').attr('placeholder');
        $('#edit_startTime').datetimepicker({
			format: 'DD/MM/YYYY HH:mm',
			viewMode: 'years'})
			.on('dp.hide', function(){
			if(this.value!=''){
				$(this).parent().addClass('floatify__active');
				$(this).attr('placeholder', '');
			}else{
				$(this).parent().removeClass('floatify__active');
				$(this).attr('placeholder', esPlaceholder);
			}
	});
    }

    if($("#edit_endTime").length > 0){
        var eePlaceholder = $('#edit_endTime').attr('placeholder');
        $('#edit_endTime').datetimepicker({
            format: 'DD/MM/YYYY HH:mm',
            viewMode: 'years'})
            .on('dp.hide', function(){
            if(this.value!=''){
				$(this).parent().addClass('floatify__active');
				$(this).attr('placeholder', '');
            }else{
				$(this).parent().removeClass('floatify__active');
				$(this).attr('placeholder', ee);
            }
        });
    }

    //Load Saved Filter List
//    $("#FilterApplicationForms select#college_id").bind("change", function () {
//        getSavedFilterList(this.value,'application','filter','saved_filter_li_list');
//    });

    //$('#otp_enter_code_id').click(function(){
        //alert('ggg');
    //});
	jQuery('.btn-group').on('show.bs.dropdown', function () {
	  jQuery('.chosen-select').trigger('chosen:close');
	})

    $(document).on( "change","#advanceFilter select, #advanceFilter input, #search_common",function(){
        is_filter_button_pressed = 0;
    });
    // for show/hide template filed  basis on checkbox

   // const checkbox = $('#communication_enable');
    $(document).on("change",'#communication_enable',function(){
//    checkbox.addEventListener('change', (event) => {

      if ($('#communication_enable').prop('checked')==true) {
        $(".sms-template-col").removeClass('display-none');
        $(".email-template-col").removeClass('display-none');
      } else {
        $(".sms-template-col").addClass('display-none');
        $(".email-template-col").addClass('display-none');
      }
    });

    $(document).on("change", "input[id='check_all_docs']", function () {
        if (this.checked) {
            $("input[name='download_doc[]']").prop("checked",true);
        }else{
            $("input[name='download_doc[]']").prop("checked",false);
        }
    });
    $(document).on("change", "input[name='download_doc[]']", function () {
        if ($("input[name='download_doc[]']:checked").length == $("input[name='download_doc[]']").length) {
            $("input[id='check_all_docs']").prop("checked",true);
        }else{
            $("input[id='check_all_docs']").prop("checked",false);
        }
    });

    $(document).on("click",'.bulk-doc td [data-toggle="collapse"]',function(){
        $('.bulk-doc .additional-row.collapse').removeClass('in');
        $(this).parent().parent().next().find('.additional-row.collapse').addClass('in');
        $('.bulk-doc td [data-toggle="collapse"]').attr("aria-expanded",false);
        $('.bulk-doc tr').removeClass("parent-request");
        if($(this).attr("aria-expanded")){
            $(this).attr("aria-expanded",true);
            $(this).parent().parent().addClass("parent-request");
        }else{
            $(this).attr("aria-expanded",false);
            $(this).parent().parent().removeClass("parent-request");
        }

    });
    $(document).on("click",'.bulk-doc td [data-toggle="collapse"][aria-expanded="true"]',function(){
        $(this).attr("aria-expanded",false);
        $('.bulk-doc tr').removeClass("parent-request");
    });
    $(document).on("change",'#doc_folder_structure',function(){
        $(".fa-exclamation-circle").addClass("hidden");
        if($("#doc_folder_structure").val()=="app_no_wise"){
            $("input[name=downloadFolderName]").parent().hide();
            $("input[name=prefix]").parent().removeAttr("style");
            $("input[name=suffix]").parent().removeAttr("style");

        }else{
            $("input[name=downloadFolderName]").parent().removeAttr("style");
            $("input[name=prefix]").parent().hide();
            $("input[name=suffix]").parent().hide();

        }
    });
    $(document).on("change",'#paymnet_enable',function(){
        if(($("#all_tokens").val() == '') || ($("#all_tokens").val() === null )){
            alertPopup("Token Fee Not Configure For this form","error");
            $("#ErrorOkBtn").on('click',function(){
              $('#paymnet_enable').prop('checked',false)
            });
            return false;
      }else if($('#paymnet_enable').prop('checked')==true) {
        $(".payment-show-col").removeClass('display-none');
        $('.sumo_select').SumoSelect({up: true});
      } else {
        $(".payment-show-col").addClass('display-none');
//        $('#logic_form_endTime').removeClass('pointer-none');
            $('#logic_form_startTime').data('DateTimePicker').minDate(false);
            $('#logic_form_startTime').data('DateTimePicker').maxDate(false);
            $('#logic_form_startTime').prop('placeholder', 'Select Edit Start Date')

            $('#logic_form_endTime').data('DateTimePicker').minDate(false);
            $('#logic_form_endTime').data('DateTimePicker').maxDate(false);
            $('#logic_form_endTime').prop('placeholder', 'Select Edit End Date')
      }
    });

});

//$(".selectAll",$("#reopenFormLogic")).on("click", function() {
//    if(!$(this).hasClass('selected')){
//        obj = $(this).siblings("li");
//        obj.removeClass('selected');
//    }else{
//        obj = $(this).siblings("li");
//        obj.addClass('selected');
//    }
//    //$(this).next().children("option").prop("selected", false);
//    //$(this).prev().children("option").prop("selected", false);
//});


 $('form#reopenFormLogic').on('submit', function (e) {

            if($("#ctype").length<0 || $("#ctype").val() != 'applications'){ //for application LMS
                return;
            }
            for (instance in CKEDITOR.instances) {
                CKEDITOR.instances[instance].updateElement();
            }
            var alldata = $('#reopenFormLogic, #FilterApplicationForms').serializeArray();
                $.ajax({
                url: '/applications/reopen-form-logic-save',
                type: 'post',
                dataType: 'json',
                data: alldata,
                headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                beforeSend: function () {
                    $('#save').attr('disabled', 'disabled');
                },
                success: function (obj) {
                    if (obj.status == 200) {
                       $('#disperror').html('');
                       $('#disperror').hide();
                       $('#dispsuccess').show();
                       var divHtml = "<div class='aligner-middle'><div class='text-center'><i class='fa fa-check-circle-o text-success fa-4x' aria-hidden='true' style='display:block;'></i><h1 id='SuccessMsz' class='text-success' style='margin-top:0'>Thank You !</h1>";
                       divHtml += "<p class='font16'>Your request for <strong>Re-Submit Form <strong> is saved successfully.</p></div></div>";
                       $('#dispsuccess').html('Re-Submit Form Request saved successfully.');
                       $('#reopen_form_logic').html(divHtml);
                       $(".modal-content").animate({ scrollTop: 0}, 1000);
                       $("*", "#reopenFormLogic").prop('disabled',true);
                    $('div.loader-block').hide();
                    $('#donothing').focus();

                   }else if (typeof obj.totalUserToBeCommunicateMessage != 'undefined' && obj.totalUserToBeCommunicateMessage != '') {
                        $("#confirmYes").removeAttr('onclick');
                        $('#confirmTitle').html("Confirm");
                        $("#confirmYes").html('Ok');
                        $("#confirmYes").siblings('button').html('Cancel');

                        $('#totalUserCount').val(obj.totalUserCount);

                        $('#ConfirmMsgBody').html(obj.totalUserToBeCommunicateMessage);
                        $('#ConfirmPopupArea').css('z-index', '11111');
                        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
                            .one('click', '#confirmYes', function (e) {
                            e.stopImmediatePropagation();
                            e.preventDefault();

                            if($('#isCD',$('#reopenFormLogic')).length > 0) {
                                $('#isCD',$('#reopenFormLogic')).val('1');
                                $('form#reopenFormLogic').submit();
                                $('#ConfirmPopupArea').modal('hide');
                                $('#ConfirmPopupArea').css('z-index', '11111');
                            }
                            return false;
                        });
                    }else if(typeof obj.communicationMessageCheck != 'undefined' && obj.communicationMessageCheck != '') {
                        $('#TemplateCreationSubmitBtn1').removeAttr('disabled');
                        $('.modalLoader, #listloader').hide();
                        $('.modalLoader').css('position', 'absolute');
                        $("#confirmYes").removeAttr('onclick');
                        $('#confirmTitle').html("Confirm");
                        $("#confirmYes").html('Ok');
                        $("#confirmYes").siblings('button').remove();
                        $('#ConfirmMsgBody').html(obj.communicationMessageCheck);
                        $('#ConfirmPopupArea').css('z-index', '11111');

                        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
                            .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                            e.preventDefault();

                            if($('#isCD').length > 0) {
                                window.location.href='';
                            }
                        });
                    }else{
                        if(obj.status == 400){
                        $(".error").hide();
//                        if(obj.error["disperror"]==''){
//                            obj.error["disperror"] = 'Required Fields is missing.';
//                        }
                        for(var x in obj.error){
                            $('#'+x).show();
                            $('#'+x).html(obj.error[x]);
                        }
                        //$('#disperror').show();
                        $('#dispsuccess').hide();
                        //$('#disperror').html('Some Fields is missing');
                         $(".modal-content").animate({ scrollTop: 0}, 1000);
                       }else{
                       //$('#disperror').show();
                        $('#dispsuccess').hide();
                        var divHtml = "<div><div id='errorMsz' style='margin-left:35%;font-size:35px;margin-top:150px;color:red;'> <b>Oh! Snap </b></div>";
                           divHtml += "<h1 style='font-size:20px;margin-left:13%'> There is Some Problem. Please try again later. </h1> </div>";
                           $('#reopen_form_logic').html(divHtml);
                        $('#dispsuccess').html('');
                        //$('#disperror').html('Some Error in save, please try again later.');
                       }
                    }
                    setTimeout(function() {
                        $("form#reopenFormLogic #save").removeAttr('disabled');
                    }, 1000);
                   //$("form#reopenFormLogic #save").removeAttr('disabled');
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });

            $('#ConfirmPopupArea').modal('hide');
            return false;
    });

    function saveResubmitAfterConfirm(){
        if($("#ctype").length<0 || $("#ctype").val() != 'applications'){ //for application LMS
                return;
            }
            for (instance in CKEDITOR.instances) {
                CKEDITOR.instances[instance].updateElement();
            }
            $("#confirmYes").attr('disabled','disabled');
            var alldata = $('#reopenFormLogic, #FilterApplicationForms').serializeArray();
                 $.ajax({
                url: '/applications/reopen-form-logic-save',
                type: 'post',
                dataType: 'json',
                data: alldata,
                headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                success: function (obj) {

                    if (obj.status == 200) {
                       $('#disperror').html('');
                       $('#disperror').hide();
                       $('#dispsuccess').show();
                       var divHtml = "<div class='aligner-middle'><div class='text-center'><i class='fa fa-check-circle-o text-success fa-4x' aria-hidden='true' style='display:block;'></i><h1 id='SuccessMsz' class='text-success' style='margin-top:0'>Thank You !</h1>";
                           divHtml += "<p class='font16'>Your request for <strong>Re-Submit Form <strong> is saved successfully.</p></div></div>";
                       $('#dispsuccess').html('Re-Submit Form Request saved successfully.');
                       $('#reopen_form_logic').html(divHtml);
                       $(".modal-content").animate({ scrollTop: 0}, 1000);
                       $("*", "#reopenFormLogic").prop('disabled',true);
                    $('div.loader-block').hide();
                    $('#donothing').focus();
                   }else{
                        if(obj.status == 400){
                        $(".error").hide();
//                        if(obj.error["disperror"]==''){
//                            obj.error["disperror"] = 'Required Fields is missing.';
//                        }
                        for(var x in obj.error){
                            $('#'+x).show();
                            $('#'+x).html(obj.error[x]);
                        }
                        //$('#disperror').show();
                        $('#dispsuccess').hide();
                        //$('#disperror').html('Some Fields is missing');
                         $(".modal-content").animate({ scrollTop: 0}, 1000);
                       }else{
                      // $('#disperror').show();
                        $('#dispsuccess').hide();
                        var divHtml = "<div><div id='errorMsz' style='margin-left:35%;font-size:35px;margin-top:150px;color:red;'> <b>Oh! Snap </b></div>";
                           divHtml += "<h1 style='font-size:20px;margin-left:13%'> There is Some Problem. Please try again later. </h1> </div>";
                           $('#reopen_form_logic').html(divHtml);
                        $('#dispsuccess').html('');
                        //$('#disperror').html('Some Error in save, please try again later.');
                       }
                    }
                    $("#confirmYes").removeAttr('disabled');
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });

            $('#ConfirmPopupArea').modal('hide');
            return false;
    }

function getLeadStagesForBulkUpdate(){
    $('#saveFollowUpButton').attr('disabled',false);
    if($("#college_id").val()=='' || $("#college_id").val()==0 || $("#college_id").val()==null){
        alertPopup('Please select college','error');
        return;
    }
    if($("#form_id").val()=='' || $("#form_id").val()==0 || $("#form_id").val()==null){
        alertPopup('Please select form','error');
        return;
    }
    if($('input:checkbox[name="selected_users[]"]:checked').length < 1 && $('#select_all:checked').val()!=='select_all'){
        alertPopup('Please select User','error');
        return;
    }
    $("#counsellorListDiv").html("");
    $('#stage_error').html("");
    currentCollegeId        = $("#college_id").val();
    currentFormId           = $("#form_id").val();
    //hide lead sub stage for now
    if (($("#followupModal select#lead_sub_stage").length > 0)) {
        $("#followupModal select#lead_sub_stage").val("");
        $("#followupModal #div_profile_sub_stage").hide();
    }
    $("#div_followup_check").hide();
    $.ajax({
        url: jsVars.getFormFlowTypeLink,
        type: 'post',
        data: {'formId':currentFormId},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: true,
        beforeSend: function () {
            stageList               = [];
        },
        complete: function () {
            $('.chosen-select').chosen();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    var formFlowType    = responseObject.data.formFlowType;
                    ajaxGetLeadStagesForBulkUpdate(formFlowType);
                }
            }else{
                console.log(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

}

function ajaxGetLeadStagesForBulkUpdate(formFlowType){
    $("#div_form_stage_deadline").hide();
    var formStage   = '';
    $("#div_form_stage_deadline").hide();
    $("#form_stage_deadline").val('');

    if( formFlowType == "3"){

        var formFieldsName = '';
        var formStageStatus= '';
        var conditionValue = '';
        var finalSelectedValue = '';
        var allowMaxStage = false;
        var allowStageStatus = false;
        $(".form_element_name" ).each(function() {
            var formFieldsNameVal = $(this).find("select").val();

            formFieldsName = formFieldsNameVal.split("fd|max_stage||dropdown||");

            if(typeof formFieldsName[1]!='undefined') {
                formFieldsName = $.parseJSON(formFieldsName[1]);
                if(typeof formFieldsName=='object'){
                    finalSelectedValue = $(this).parents("div.condition_div").find("div.field_value_div").find("select").val();
                    if(finalSelectedValue.length==1 && typeof finalSelectedValue[0]!='undefined'){
                        formStage   = finalSelectedValue[0];
                        conditionValue = $(this).parents("div.condition_div").find("div.field_value_condition").find("select").val();
                        if(finalSelectedValue!='' && conditionValue=='eq'){
                            allowMaxStage = true;
                        }
                    }
                }
            }

            formStageStatus = formFieldsNameVal.split("fsd|step_status||dropdown||");
            if(typeof formStageStatus[1]!='undefined') {
                formStageStatus = $.parseJSON(formStageStatus[1]);
                if(typeof formFieldsName=='object'){
                    finalSelectedValue = $(this).parents("div.condition_div").find("div.field_value_div").find("select").val();
                    conditionValue = $(this).parents("div.condition_div").find("div.field_value_condition").find("select").val();

                    if(finalSelectedValue=='1'){
                        if(conditionValue=='eq'){
                            allowStageStatus = true;
                        }
                    }else if(finalSelectedValue=='0'){
                        if(conditionValue=='eq'){
                            allowStageStatus = true;
                        }
                    }else{
                        alertPopup("Please select 'Form Stage' and 'Form Stage Status'.",'error');
                        return false;
                    }
                }
            }

        });

        if(allowMaxStage===false || allowStageStatus===false){
            alertPopup("Please select 'Form Stage' and 'Form Stage Status'.",'error');
            return false;
        }
    }
    $("#followUpMessageDiv").html("");
    $("#followupModal").modal('show');
    $("#form_stage_deadline").val('');
    if(!$("#div_profile_follow_up_date").hasClass('hidden_by_permission')){
        $("#div_profile_follow_up_date").addClass('hidden_for_bulk');
        $("#div_profile_follow_up_date").hide();
        $("#div_profile_new_follow_up_toggle").hide();
    }
    if(!$("#div_profile_remarks").hasClass('hidden_by_permission')){
        $("#div_profile_remarks").addClass('hidden_for_bulk');
        $("#div_profile_remarks").hide();
    }
    $("#stageActivityPageDiv").addClass('hidden_for_bulk');
    $("#stageActivityPageDiv").hide();
    $("#lead_stage").val("");

    var leadStages  = '<label class="floatify__label float_addedd_js" for="lead_stage">Application Stage</label><select name="lead_stage" id="lead_stage" class="chosen-select" tabindex="-1"><option value="" selected="selected">Application Stage</option></select>';
    $('#leadStagesDiv').html(leadStages);
    $('.chosen-select').chosen();
    $('#saveFollowUpButton').unbind( "click" );
    $("#saveFollowUpButton").on('click',updateLeadStageBulk);
    $.ajax({
        url: jsVars.getLeadStagesLink,
        type: 'post',
        data: {'userId' : 'bulk', 'collegeId':currentCollegeId, 'formId':currentFormId, 'moduleName':'application', 'formStage':formStage},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: true,
        beforeSend: function () {
            stageList               = [];
        },
        complete: function () {
            $('.chosen-select').chosen();
            $("#lead_stage").change(function(){
                $("#div_form_stage_deadline").hide();
                if($("#form_stage_deadline").val() !== '' && $("#lead_stage").val() !=='' ){
                    if(nextStepCondition==$("#lead_stage").val()){
                        $("#div_form_stage_deadline").show();
                    }
                }
            });
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    nextStepCondition       = responseObject.data.nextStepCondition;
                    stageList               = responseObject.data.stageIds;
                    var subStageConfigure   = responseObject.data.subStageConfigure;
                    var leadSubStageList    = responseObject.data.subStageList;
                    if (!subStageConfigure && ($("#followupModal select#lead_sub_stage").length > 0)) {
                        $("#followupModal select#lead_sub_stage").val("");
                        $("#followupModal #div_profile_sub_stage").hide();
                    }
                    if(typeof responseObject.data.stageList === "object" && typeof stageList === "object"){
                         var onChangeLeadStage = '';
                        if (subStageConfigure == 1) {
                            onChangeLeadStage = 'onchange = "getApplicationSubStages(\''+ currentFormId +'\', this.value, \'lead_sub_stage\', \'chosen\', \'leadSubStagesDiv\');"';
                        }
                        var leadStages  = '<label class="floatify__label float_addedd_js" for="lead_stage">Application Stage </label><select name="lead_stage" id="lead_stage" class="chosen-select" tabindex="-1" ' + onChangeLeadStage +'><option value="">Application Stage</option>';
                        $.each(stageList, function (index, item) {
                            leadStages += '<option value="'+item+'">'+responseObject.data.stageList[item]+'</option>';
                        });
                        leadStages += '</select>';
                        $('#leadStagesDiv').html(leadStages);
						floatableLabel();
                    }
                    //add sub stage list data
                    if (subStageConfigure == 1) {
                        var leadSubStages  = '<label class="floatify__label float_addedd_js" for="lead_sub_stage">Application Sub Stage</label><select name="lead_sub_stage" id="lead_sub_stage" class="chosen-select" tabindex="-1"><option value="">Application Sub Stage</option>';
                        if (typeof leadSubStageList === "object") {
                        for(var subStageId in leadSubStageList) {
                            leadSubStages += '<option value="' + subStageId + '">' + leadSubStageList[subStageId] + '</option>';
                        }
                        }
                        leadSubStages += '</select>';
                        $('#followupModal #leadSubStagesDiv').html(leadSubStages);
                        $("#followupModal #div_profile_sub_stage").show();
                        floatableLabel();
                    }
                    if(!$("#div_profile_stage").hasClass('hidden_by_permission') && typeof responseObject.data.nextStepDealine !== "undefined" && responseObject.data.nextStepDealine!=''){
                        $("#form_stage_deadline").val(responseObject.data.nextStepDealine);
                    }
                }
            }else{
                $("#followUpMessageDiv").html("<div class='alert-danger'>"+responseObject.message+"</div>");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

}


function getLeadStages(userId, collegeId, formId, userName){
    $('#saveFollowUpButton').attr('disabled',false);
    currentUserId           = userId;
    currentCollegeId        = collegeId;
    currentFormId           = formId;
    currentUserName         = userName;
    // $("#div_followup_check").hide();
    $('input[name=leadFollowupCheck]').attr('checked', false);
    if (($("#followupModal select#lead_sub_stage").length > 0)) {
        $("#followupModal select#lead_sub_stage").val("");
        $("#followupModal #div_profile_sub_stage").hide();
    }
    $('#remark_error, #sub_stage_error, #followup_error, #stage_error').hide();
    $("#actionType").val("stage");
    $.ajax({
        url: jsVars.getFormFlowTypeLink,
        type: 'post',
        data: {'formId':currentFormId},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: true,
        beforeSend: function () {
            stageList               = [];
        },
        complete: function () {
            $('.chosen-select').chosen();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    var formFlowType    = responseObject.data.formFlowType;
                    ajaxGetLeadStages(formFlowType);
                }
            }else{
                console.log(responseObject.message);
            }
			floatableLabel();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

}

function ajaxGetLeadStages(formFlowType){
    $("#div_form_stage_deadline").hide();
    $("#form_stage_deadline").val('');
    $('#counsellorListDiv').html("");
    $("#followUpMessageDiv").html("");
    $("#lead_stage").val("");
    $("#lead_remark").val("");
    $("#lead_followup_date").val("");
    $(".hidden_for_bulk").show();
    setCounsellorsDropDownForFollowups(currentUserId, currentCollegeId, currentFormId);
    var leadStages  = '<label class="floatify__label float_addedd_js" for="lead_stage">Application Stage</label><select name="lead_stage" id="lead_stage" class="chosen-select" tabindex="-1"><option value="" selected="selected">Application Stage</option></select>';
    $('#leadStagesDiv').html(leadStages);
    if ($("#followupModal select#lead_sub_stage").length > 0) {
        $("#followupModal select#lead_sub_stage").val("");
        var leadSubStages  = '<select name="lead_sub_stage" id="lead_sub_stage" class="chosen-select" tabindex="-1"><option value="">Application Sub Stage</option></select>';
        $('#followupModal #leadSubStagesDiv').html(leadSubStages);
    }
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    getActivityLogsForStagePopup();
    $('#saveFollowUpButton').unbind( "click" );
    $("#saveFollowUpButton").on('click',followUp);
    nextStepCondition   = 0;
    $.ajax({
        url: jsVars.getLeadStagesLink,
        type: 'post',
        data: {'userId' : currentUserId, 'collegeId':currentCollegeId, 'formId':currentFormId, moduleName:'application'},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: true,
        beforeSend: function () {
            currentStage            = '';
            stageList               = [];
        },
        complete: function () {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $("#lead_stage").change(function(){
                $('#remark_error, #sub_stage_error, #followup_error, #stage_error').hide();
                if($("#form_stage_deadline").val() !== '' && $("#lead_stage").val() !=='' ){
                    $("#div_form_stage_deadline").hide();
                    if(nextStepCondition==$("#lead_stage").val()){
                        $("#div_form_stage_deadline").show();
                    }
                }
            });
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    currentStage            = responseObject.data.stage;
                    currentSubStage         = responseObject.data.sub_stage;
                    stageList               = responseObject.data.stageIds;
                    disallowDown            = responseObject.data.disallow_down;
                    disallowFollowup        = responseObject.data.disallow_followup;
                    disallowRemark          = responseObject.data.disallow_remark;
                    disallowCommunication   = responseObject.data.disallow_communication;
                    nextStepCondition       = responseObject.data.nextStepCondition;
                    var subStageConfigure   = responseObject.data.subStageConfigure;
                    var leadSubStageList    = responseObject.data.subStageList;
                    if(typeof responseObject.data.overdueFollowUpCount!=='undefined' && responseObject.data.overdueFollowUpCount>0){
                        $('#div_followup_check').show();
                    }else{
                        $('#div_followup_check').hide();
                    }
                    if (!subStageConfigure && ($("#followupModal select#lead_sub_stage").length > 0)) {
                        $("#followupModal select#lead_sub_stage").val("");
                        $("#followupModal #div_profile_sub_stage").hide();
                    }
                    if(typeof nextStepCondition === "undefined" || nextStepCondition===""){
                        nextStepCondition=0;
                    }
                    if(typeof responseObject.data.stageList === "object" && typeof stageList === "object"){
                         var onChangeLeadStage = '';
                        if (subStageConfigure == 1) {
                            onChangeLeadStage = 'onchange = "getApplicationSubStages(\''+ currentFormId +'\', this.value, \'lead_sub_stage\', \'chosen\', \'leadSubStagesDiv\');"';
                        }
                        var leadStages  = '<label class="floatify__label float_addedd_js" for="lead_stage">Application Stage</label><select name="lead_stage" id="lead_stage" class="chosen-select" tabindex="-1" '+onChangeLeadStage +'><option value="">Application Stage</option>';
                        $.each(stageList, function (index, item) {
                            if(currentStage==item){
                                leadStages += '<option value="'+item+'" selected="selected">'+responseObject.data.stageList[item]+'</option>';
                            }else{
                                leadStages += '<option value="'+item+'">'+responseObject.data.stageList[item]+'</option>';
                            }
                        });
                        leadStages += '</select>';
                        $('#leadStagesDiv').html(leadStages);
                          //add sub stage list data
                        if (subStageConfigure == 1) {
                            var leadSubStages = '<label class="floatify__label float_addedd_js" for="lead_sub_stage">Application Sub Stage</label><select name="lead_sub_stage" id="lead_sub_stage" class="chosen-select" tabindex="-1"><option value="">Application Sub Stage</option>';
                            if (typeof leadSubStageList === "object") {
                                for (var subStageId in leadSubStageList) {
                                    if (currentSubStage == subStageId) {
                                        leadSubStages += '<option value="' + subStageId + '" selected="selected">' + leadSubStageList[subStageId] + '</option>';
                                    } else {
                                        leadSubStages += '<option value="' + subStageId + '">' + leadSubStageList[subStageId] + '</option>';
                                    }
                                }
                            }
                            leadSubStages += '</select>';
                            $('#followupModal #leadSubStagesDiv').html(leadSubStages);
                            $("#followupModal #div_profile_sub_stage").show();
                            floatableLabel();
                            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                        }

                        if(formFlowType == "3" && !$("#div_profile_stage").hasClass('hidden_by_permission') && typeof responseObject.data.nextStepDealine !== "undefined" && responseObject.data.nextStepDealine!=''){
                            if(currentStage==nextStepCondition){
                                $("#div_form_stage_deadline").show();
                            }
                            $("#form_stage_deadline").val(responseObject.data.nextStepDealine);
                        }
                    }
                }
            } else {
                console.log(responseObject.message);
            }
            floatableLabel();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

}

function setCounsellorsDropDownForFollowups(userId, collegeId, formId) {
    counsellorsAvailableForFollowup = false;
    $('#counsellorListDiv').html("");
    $.ajax({
        url: jsVars.FULL_URL+"/counsellors/get-counsellors-list-for-followups",
        type: 'post',
        data: {'userId' : userId, 'collegeId':collegeId, 'formId':formId, moduleName:"application"},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: false,
        beforeSend: function () {
        },
        complete: function () {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('#counsellorId').SumoSelect({placeholder: 'Select Counsellor', search: true, searchText:'Select Counsellor', selectAll : true, captionFormatAllSelected: "All Selected."});
		},
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
//                    if(responseObject.data.counsellors.length <= 0) {
//                        $("#followUpMessageDiv").html("<div class='alert-warning'>No counsellor assigned to this application, Please assign a counsellor first in order to add a followup.</div>");
//                    }else
                    if(typeof responseObject.data.counsellors === "object"){
                        counsellorsAvailableForFollowup = true;
                        var counsellors  = '<label class="floatify__label float_addedd_js" for="counsellorId">Assigned To</label><select name="counsellorId" id="counsellorId" class="" tabindex="-1" >';

                        var counsellorsOptions  = '';
                        var counsellorsOptionsLength  = '';
                        $.each(responseObject.data.counsellors, function (index, item) {
                            counsellorsOptions += '<option value="'+index+'">'+item+'</option>';
                            counsellorsOptionsLength++;
                        });
                        if(responseObject.data.isCounsellorLoggedIn == "0" && counsellorsOptionsLength>1) {
                            counsellorsOptions  = '<option value="">Select Counsellor</option>'+counsellorsOptions;
                        }
                        counsellors = counsellors+counsellorsOptions+'</select>';

                        $('#counsellorListDiv').html(counsellors);
                    }
                }
                setTimeout(function(){ $('#followupModal #counsellorId').trigger('change'); }, 500);
            }else{
                console.log(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getActivityLogsForStagePopup(listingType){
    if(listingType !== 'loadmore'){
        $("#stageActivityPage").val(1);
    }
    $.ajax({
        url: jsVars.getUserActivityLogsLink,
        type: 'post',
        data: {'userId' : currentUserId, 'userName' : currentUserName, 'collegeId':currentCollegeId, 'activityCode':['10012','10013','10014','10112','10291'], 'moduleName':'application', 'formId':currentFormId, 'page':$("#stageActivityPage").val(), 'viewType':'popup'},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('div.loader-block-a').show();
        },
        complete: function () {
            $('div.loader-block-a').hide();
        },
        success: function (html) {
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
            }else{
                html    = html.replace("<head/>", "");
                var countRecord = countResult(html);
                if(listingType !== 'loadmore'){
                    $("#stageActivityLogsDiv").html(html);
                }else{
                    $('#stageActivityLogsDiv').find("ul").append(html);
                }
                if(countRecord < 10){
                    $('#LoadMoreStageActivity').hide();
                }else{
                    $('#LoadMoreStageActivity').show();
                }
                $("#stageActivityPage").val(parseInt($("#stageActivityPage").val())+1);
                var check = $('#upcomingFollowups').val();
                $('#new_follow_up_toggle').prop('checked', false);
                if(check){
                    $('#div_profile_new_follow_up_toggle').show()
                }else{
                    $('#div_profile_new_follow_up_toggle').hide()
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function countResult(html){
    var len = (html.match(/tmMsg/g) || []).length;
    return len;
}

function followUp(){
    var requestPosts = {};
    $("#followUpMessageDiv").html("");
    if(currentUserId =='' || currentCollegeId=='' || currentFormId==''){
        $("#followUpMessageDiv").html("<div class='alert-danger'>Something went wrong. please refresh page and try again.</div>");
        return false;
    }
    if(currentStage && disallowDown){
        if(stageList.indexOf(parseInt(currentStage)) > stageList.indexOf(parseInt($("#lead_stage").val()))){
            $("#followUpMessageDiv").html("<div class='alert-danger'>You can not disgrade stage at this stage.</div>");
            return false;
        }
    }
    if(disallowFollowup && $("#lead_followup_date").val().length>0){
        $("#followUpMessageDiv").html("<div class='alert-danger'>You can't follow up at this stage.</div>");
        return false;
    }
    if(disallowRemark && $("#lead_remark").val().length>0){
        $("#followUpMessageDiv").html("<div class='alert-danger'>You can't add a remark at this stage.</div>");
        return false;
    }
    if($("#actionType").val() == "stage") {
        moduleName = $("input[name=moduleName]").val() != "" ? $("input[name=moduleName]").val() : '';
        if($('#lead_stage').val()==''){
            $("#stage_error").html("Mandatory to mark "+ moduleName +" stage");
            $("#stage_error").show();
            return false;
        }
    }
    var leadFollowupCheck = false;
    if ($("#leadFollowupCheck").length > 0 && $('input[name=leadFollowupCheck]').is(':checked') == true) {
        leadFollowupCheck = true;
    }
    var leadSubStage = 0;
    if ($("#lead_sub_stage").length > 0) {
        leadSubStage = $("#lead_sub_stage").val();
    }
    addNewFollowUptoggle = 0
    if($("#new_follow_up_toggle").is(':checked'))
    {addNewFollowUptoggle = 1}
    requestPosts = {'userId' : currentUserId, 'collegeId':currentCollegeId, 'formId':currentFormId, 'leadStage':$("#lead_stage").val(),'leadSubStage': leadSubStage, 'leadRemark':$("#lead_remark").val(), 'leadFollowupDate':$("#lead_followup_date").val(), 'formStepDeadline':$("#form_stage_deadline").val(), 'moduleName':'application', 'leadFollowupCheck': leadFollowupCheck, 'actionType':$("#actionType").val(),'isInlineErr':1,'addNewFollowUptoggle':addNewFollowUptoggle};
    if($("#counsellorId").length > 0 && ($("#counsellorId").val() === '' || $("#counsellorId").val() === null || $("#counsellorId").val() === 0) && $("#lead_followup_date").val() !== '') {
        if(counsellorsAvailableForFollowup===true){
            $("#followUpMessageDiv").html("<div class='alert-danger'>Please select a counsellor to add follow-up.</div>");
            return false;
        }
        requestPosts["followupAssignedTo"] = 0;
    } else {
        requestPosts["followupAssignedTo"] = $("#counsellorId").val();
    }
    $('#saveFollowUpButton').attr('disabled',true);
    $("#saveFollowUpButton").hide();
    $("#saveFollowUpButtonWait").show();
    $.ajax({
        url: jsVars.followUpLink,
        type: 'post',
        data: requestPosts,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('div.loader-block-a').show();
        },
        complete: function () {
            $("#saveFollowUpButton").show();
            $("#saveFollowUpButtonWait").hide();
            $('#saveFollowUpButton').removeAttr('disabled');
            $('div.loader-block-a').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            // $('#saveFollowUpButton').attr('disabled',false);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    currentStage            = responseObject.data.stage;
                    disallowDown            = responseObject.data.disallow_down;
                    disallowFollowup        = responseObject.data.disallow_followup;
                    disallowRemark          = responseObject.data.disallow_remark;
                    disallowCommunication   = responseObject.data.disallow_communication;
                }
                $('#followupModal').modal('hide');
                LoadMoreApplication('reset');
            }else{
                $('#remark_error, #sub_stage_error, #followup_error').hide();
                if(responseObject.message != "") {
                    if(responseObject.message.charAt(0) !== "{"){
                        $('#followUpMessageDiv').html("<div class='alert-danger'>"+responseObject.message+"<div>");
                    }else{
                        validationErrObj = $.parseJSON(responseObject.message);

                        if(typeof validationErrObj == 'object') {
                            if(validationErrObj.remark_error != undefined) {
                                $('#remark_error').show();
                                $('#remark_error').html(validationErrObj.remark_error);
                            }
                            if(validationErrObj.sub_stage_error != undefined) {
                                $('#sub_stage_error').show();
                                $('#sub_stage_error').html(validationErrObj.sub_stage_error);
                            }
                            if(validationErrObj.followup_error != undefined) {
                                $('#followup_error').show();
                                $('#followup_error').html(validationErrObj.followup_error);
                            }
                        }
                    }
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#saveFollowUpButton').removeAttr('disabled');
        }
    });
}

function updateLeadStageBulk(){
    $("#followUpMessageDiv").html("");
    if($("#lead_stage").val()===''){
        $("#followUpMessageDiv").html("<div class='alert-danger'>Please select stage !</div>");
        return;
    }
    if(currentCollegeId=='' || currentFormId==''){
        $("#followUpMessageDiv").html("<div class='alert-danger'>Something went wrong. please refresh page and try again.</div>");
        return false;
    }
    $('#saveFollowUpButton').attr('disabled',true);
    var users   = [];
    $('input:checkbox[name="selected_users[]"]').each(function () {
        if(this.checked){
            users.push(parseInt($(this).val()));
        }
    });

    if(users.length > 0 || $('#select_all:checked').val()==='select_all'){
        var $form = $("#bulkUpdateStageForm");
        $form.find('input[name="collegeId"]').val($("#college_id").val());
        $form.find('input[name="formId"]').val($("#form_id").val());
        $form.find('input[name="leadStage"]').val($("#lead_stage").val());
        //add sub stage
        if ($("#lead_sub_stage").length > 0) {
            $form.find('input[name="leadSubStage"]').val($("#lead_sub_stage").val());
        }
        $form.find('input[name="formStepDeadline"]').val($("#form_stage_deadline").val());
        if($('#select_all:checked').val()==='select_all'){
            $form.find('input[name="userId"]').val("all");
            $form.find('input[name="filters"]').val($("#leadsListFilters").val());
            $form.find('input[name="totalRecords"]').val($("#all_records_val").val());
        }else{
            $form.find('input[name="userId"]').val(users);
            $form.find('input[name="filters"]').val($("#leadsListFilters").val());
            $form.find('input[name="totalRecords"]').val(users.length);
        }

       $.ajax({
          url: jsVars.validateLeadStageBulkLink,
          type: 'POST',
          data : $form.serialize(),
          success: function(responseObject){
            responseObject = $.parseJSON(responseObject);
            // $('#saveFollowUpButton').attr('disabled',false);
            if(responseObject.status==1){
                //Change Application Stage in Bulk request
                saveApplicationStageBulkRequest();
                return;
            } else {
                if(responseObject.message != undefined) {
                    $("#followUpMessageDiv").html("<div class='alert-danger'>"+responseObject.message+"</div>");
                    $('#myModal').modal('hide');
                }
                return;
            }
          }
        });
    }
}
var closeLeadStageBatch = function(url){
    $('#myModal').modal('hide');
    LoadMoreApplication('reset');
};

function initiateReassignLead(userId,formId,type){
    $("#leadReassignMessageDiv").html("");
    $("#singleBulkTitle").html('');
    if(type=='bulk'){
        $("#singleBulkTitle").html('s');
        if($("#form_id").val()=='' || $("#form_id").val()==0 || $("#form_id").val()==null){
            alertPopup('Please select form','error');
            return;
        }
        var formId          = $("#form_id").val();
        if($('input:checkbox[name="selected_users[]"]:checked').length < 1 && $('#select_all:checked').val()!='select_all'){
            alertPopup('Please select User','error');
            return;
        }
    }
    getCounsellorsList(userId, $("#college_id").val(), formId);
    $('#leadReassignModal').modal('show');
}

function getCounsellorsList(userId, collegeId, formId){
    var assignedTo  = '<label class="floatify__label float_addedd_js" for="assignedTo">Counsellor</label><select name="assignedTo" id="assignedTo" class="" tabindex="-1" ><option value="">Select Counsellor - Assigned To</option></select>';
    $('#assignedToListDiv').html(assignedTo);

    var unassignFrom  = '<label class="floatify__label float_addedd_js" for="unassignedFrom">Unassign From</label><select name="unassignedFrom[]" multiple="multiple" id="unassignedFrom" class="" tabindex="-1" data-placeholder="Unassign From"></select>';
    $('#unassignFromDiv').html(unassignFrom);
    $("#unassignFromRow label span[class='requiredStar']").html('*');
    if(currentCounsellorId=="" || currentCounsellorId=='unassigned'){
        $("#unassignFromRow label span[class='requiredStar']").html('');
    }
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    $('#assignedTo').SumoSelect({placeholder: 'Counsellor - Assigned To', search: true, searchText:'Select Counsellor - Assigned To', selectAll : true, captionFormatAllSelected: "All Selected."});
	$('#unassignedFrom').SumoSelect({placeholder: 'Counsellor(s) - Assigned From', search: true, searchText:'Select Counsellor(s) - Assigned From', selectAll : true, captionFormatAllSelected: "All Selected."});
	$("#reassignRemark").val('');
    $("#leadReassignMessageDiv").html('');
    $.ajax({
        url: jsVars.getCounsellorsListLink,
        type: 'post',
        data: {'userId' : userId, 'collegeId':collegeId, 'formId':formId, moduleName:'application'},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: true,
        beforeSend: function () {
            currentUserId           = '';
            currentCollegeId        = '';
            currentFormId           = '';
        },
        complete: function () {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            //$('.sumo-select').SumoSelect({placeholder: 'Select Counsellors', search: true, searchText:'Select Counsellors'});
			$('#assignedTo').SumoSelect({placeholder: 'Counsellor - Assigned To', search: true, searchText:'Select Counsellor - Assigned To', selectAll : true, captionFormatAllSelected: "All Selected."});
			$('#unassignedFrom').SumoSelect({placeholder: 'Counsellor(s) - Assigned From', search: true, searchText:'Select Counsellor(s) - Assigned From', selectAll : true, captionFormatAllSelected: "All Selected."});
		},
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    currentUserId           = userId;
                    currentCollegeId        = collegeId;
                    currentFormId           = formId;
                    if(typeof responseObject.data.counsellors === "object"){
                        var counsellors  = '<label class="floatify__label float_addedd_js" for="assignedTo">Counsellor</label><select name="assignedTo" id="assignedTo" class="" tabindex="-1" ><option value="">Select Counsellor - Assigned To</option>';
                        $.each(responseObject.data.counsellors, function (index, item) {
                            if(userId==='' && currentCounsellorId!=""){
                                if(currentCounsellorId==index){
                                    responseObject.data.currentCounsellor   = {};
                                    responseObject.data.currentCounsellor[index]   = item;
                                }else{
                                    counsellors += '<option value="'+index+'">'+item+'</option>';
                                }
                            }else{
                                counsellors += '<option value="'+index+'">'+item+'</option>';
                            }
                        });
                        counsellors += '</select>';
                        $('#assignedToListDiv').html(counsellors);
                    }
                    if(typeof responseObject.data.currentCounsellor === "object"){
                        var unassignFrom  = '<label class="floatify__label float_addedd_js" for="unassignedFrom">Unassign From</label><select name="unassignedFrom[]" multiple="multiple" id="unassignedFrom" class="" tabindex="-1" data-placeholder="Unassign From">';
                        var isex = false;
                        $.each(responseObject.data.currentCounsellor, function (index, item) {
                            unassignFrom += '<option value="'+index+'" selected="selected">'+item+'</option>';
                            isex = true;
                        });
                        unassignFrom += '</select>';
                        $('#unassignFromDiv').html(unassignFrom);
                        if(isex==true){
                            $("#unassignFromRow label span[class='requiredStar']").html('*');
                        }
                    }
                }
            }else{
                console.log(responseObject.message);
            }
			floatableLabel();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function reassignLead(){
    var IsExists = false;
    $('#unassignedFrom option').each(function(){
        if (this.value != '')
            IsExists = true;
    });
    if(($("#unassignedFrom").val()=='' || $("#unassignedFrom").val() == null)
            && currentCounsellorId!='unassigned' && currentUserId==''){
        $("#leadReassignMessageDiv").html("<div class='alert-danger'>Please select a counsellor in 'From'</div>");
        return;
    }else if(($("#unassignedFrom").val()=='' || $("#unassignedFrom").val() == null) &&
            currentUserId!='' &&
            ($("#assignedTo").val()=='unassigned' || IsExists)){
        $("#leadReassignMessageDiv").html("<div class='alert-danger'>Please select a counsellor in 'From'</div>");
        return;
    }
    if($("#assignedTo").val()==''){
        $("#leadReassignMessageDiv").html("<div class='alert-danger'>Please select a counsellor in 'To'</div>");
        return;
    }
    $("#leadReassignMessageDiv").html("");
    if(currentUserId==''){
        bulkReassignLeads();
        return;
    }
    $.ajax({
        url: jsVars.preManualReassignmentCheckLink,
        type: 'post',
        data: {'userId' : currentUserId, 'collegeId':currentCollegeId, 'assignedTo':$("#assignedTo").val(), 'unassignedFrom':$("#unassignedFrom").val(), 'reassignRemark':$("#reassignRemark").val(), moduleName:'application', 'assignedName':$("#assignedTo option:selected").text()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: false,
        beforeSend: function () {
           showLoader();
        },
        complete: function () {
            $('#leadReassignModal').modal('hide');
           hideLoader();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.alertMsg != ''){
                if(responseObject.selectOptions != ''){
                    $('#ConfirmPopupReassignCounsellor #selectOptions').prev().show();
                    $('#ConfirmPopupReassignCounsellor #selectOptions').html(responseObject.selectOptions);
                }else{
                     $('#ConfirmPopupReassignCounsellor #selectOptions').empty()
                     $('#ConfirmPopupReassignCounsellor #selectOptions').prev().hide();
                }
                if(responseObject.completeOverdueMsg != ''){
                    $('#ConfirmPopupReassignCounsellor #completeOverdueMsg').show().html(responseObject.completeOverdueMsg);
                }else{
                    $('#ConfirmPopupReassignCounsellor #completeOverdueMsg').hide()
                }
                $('#ConfirmPopupReassignCounsellor #confirmTitle').html('Re-assign Application(s)');
                $('#ConfirmPopupReassignCounsellor #assignedToCounsellorText').html("Taking this action will re-assign application(s) to counselor "+$("#assignedTo option:selected").text()+".<br>");
                $('#ConfirmPopupReassignCounsellor #counsellorNoteText').html("(Disable toggle if only application has to be re-assigned.)");
                $('#ConfirmPopupReassignCounsellor #ConfirmMsgBody').removeClass('text-center').addClass('text-left');

                //('#ConfirmPopupArea h2#confirmTitle').html('Confirmation Required');
                $('#ConfirmPopupReassignCounsellor').addClass('modalCustom');
                $('#ConfirmPopupReassignCounsellor #ConfirmMsgBody').addClass('modalScroll');
                $('#ConfirmPopupReassignCounsellor a#confirmYes').html('Okay');
                $('#ConfirmPopupReassignCounsellor .modal-body button').html('Cancel');
                $('#ConfirmPopupReassignCounsellor').modal({backdrop: 'static', keyboard: false})
                    .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                    e.preventDefault();
                    applicationReassignCheck = $('#ConfirmPopupReassignCounsellor input[name="applicationReassignCheck"]:checked').val();
                    queryReassignCheck = $('#ConfirmPopupReassignCounsellor input[name="queryReassignCheck"]:checked').val();
                    leadReassignCheck = $('#ConfirmPopupReassignCounsellor input[name="leadReassignCheck"]:checked').val();
                    proceedToReassign();
                    $('#ConfirmPopupReassignCounsellor').modal('hide');
                });
            }else{
                proceedToReassign();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText,'error');
        }

    });

}


function bulkReassignLeads(){

    $.ajax({
        url: jsVars.preManualReassignmentCheckLink,
        type: 'post',
        data: {'userId' : currentUserId, 'collegeId':currentCollegeId, 'assignedTo':$("#assignedTo").val(), 'unassignedFrom':$("#unassignedFrom").val(), 'reassignRemark':$("#reassignRemark").val(), moduleName:'application','preCheckBulkReassign':1, 'assignedName':$("#assignedTo option:selected").text()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: false,
        beforeSend: function () {
           showLoader();
        },
        complete: function () {
            $('#leadReassignModal').modal('hide');
           hideLoader();
        },
        success: function (response) {
            console.log(response)
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }

            if(responseObject.alertMsg != ''){
                if(responseObject.selectOptions != ''){
                    $('#ConfirmPopupReassignCounsellor #selectOptions').prev().show();
                    $('#ConfirmPopupReassignCounsellor #selectOptions').html(responseObject.selectOptions);
                }else{
                     $('#ConfirmPopupReassignCounsellor #selectOptions').empty()
                     $('#ConfirmPopupReassignCounsellor #selectOptions').prev().hide();
                }
                if(responseObject.completeOverdueMsg != ''){
                    $('#ConfirmPopupReassignCounsellor #completeOverdueMsg').show().html(responseObject.completeOverdueMsg);
                }else{
                    $('#ConfirmPopupReassignCounsellor #completeOverdueMsg').hide()
                }
                $('#ConfirmPopupReassignCounsellor #confirmTitle').html('Re-assign Application(s)');
                $('#ConfirmPopupReassignCounsellor #assignedToCounsellorText').html("Taking this action will re-assign application(s) to counselor "+$("#assignedTo option:selected").text()+".<br>");
                $('#ConfirmPopupReassignCounsellor #counsellorNoteText').html("(Disable toggle if only application has to be re-assigned.)");
                $('#ConfirmPopupReassignCounsellor #ConfirmMsgBody').removeClass('text-center').addClass('text-left');

                //('#ConfirmPopupArea h2#confirmTitle').html('Confirmation Required');
                $('#ConfirmPopupReassignCounsellor').addClass('modalCustom');
                $('#ConfirmPopupReassignCounsellor #ConfirmMsgBody').addClass('modalScroll');
                $('#ConfirmPopupReassignCounsellor a#confirmYes').html('Okay');
                $('#ConfirmPopupReassignCounsellor .modal-body button').html('Cancel');
                $('#ConfirmPopupReassignCounsellor').modal({backdrop: 'static', keyboard: false})
                    .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                    e.preventDefault();
                    applicationReassignCheck = $('#ConfirmPopupReassignCounsellor input[name="applicationReassignCheck"]:checked').val();
                    queryReassignCheck = $('#ConfirmPopupReassignCounsellor input[name="queryReassignCheck"]:checked').val();
                    leadReassignCheck = $('#ConfirmPopupReassignCounsellor input[name="leadReassignCheck"]:checked').val();
                    proceedToBulkReassign();
                    $('#ConfirmPopupReassignCounsellor').modal('hide');
                });
            }else{
                proceedToBulkReassign();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText,'error');
        }

    });
}

function communicateApplicant(lmsCommunicate, userId, collegeId, formId){
    window.open('/form/preview/'+lmsCommunicate, 'prev_'+userId, 'width=1200, height=600, scrollbars=yes, left=100, top=50');
}
/*code for chane stage, follow up, add remark and commnicate ends */

if($('#DDRejectedSelect').length > 0)
{
    if(typeof jsVars.ShowDDRejectedSelect == 'undefined')
    {
        $('#DDRejectedSelect').closest('div.col-md-4').hide();
    }
}

var CollegeWiseCreaterList;
var postedCreatedBy;
if(typeof jsVars.CollegeWiseCreaterList != 'undefined' && jsVars.CollegeWiseCreaterList!="")
{
    CollegeWiseCreaterList = $.parseJSON(jsVars.CollegeWiseCreaterList);
}

if(typeof jsVars.postedCreatedBy != 'undefined')
{
    postedCreatedBy = jsVars.postedCreatedBy;
}

//AutoReload Form Filter if College is selected
if(typeof jsVars.postedCollegeId != 'undefined')
{
    $(document).ready(function(){
        if($('#FilterApplicationForm select#Institute').length > 0)
        {
            $('#FilterApplicationForm select#Institute').trigger('change');
        }
        else if(typeof jsVars.postedFormId != 'undefined')
        {
            UpdateFormSelect(jsVars.AllFormList,jsVars.postedFormId);
        }
    });
}

$(document).on('change','#FilterApplicationForm select#Institute', function(){
    var CollegeId;
    if(this.value)
    {
        CollegeId = this.value;
        var Condition = 'only_enable_form';
        GetAllRelatedForms(CollegeId,Condition);
        GetAllRelatedStates(CollegeId,0);
        GetAllRelatedCouponCampaigns(CollegeId, '');

        if(CollegeId in CollegeWiseCreaterList['CollegeWise'])
        {
            UpdateCreatedBySelect(CollegeWiseCreaterList['CollegeWise'][CollegeId],postedCreatedBy);
        }
        else
        {
            UpdateCreatedBySelect([]);
        }
    }
    else
    {
        CollegeId = '';
        UpdateFormSelect(jsVars.AllFormList);
        UpdateCreatedBySelect(CollegeWiseCreaterList['UserWise']);
    }

    //call payment method function
    GetAllRelatedPaymentMethod();

    if(typeof jsVars.StateList != 'undefined')
    {
        var StateList = $.parseJSON(jsVars.StateList);

        (typeof jsVars.StateSelected != 'undefined')?UpdateStateList(StateList, CollegeId, '', jsVars.StateSelected):UpdateStateList(StateList, CollegeId, '','');

    }
    $('.advance-filter-block').addClass('display-none');
});

//If Form is PreSelected
if(typeof jsVars.postedFormId != 'undefined')
{
    $(document).ready(function(){
        $('#FilterApplicationForm select#InstituteForms').trigger('change');
    });
}

//Show Advanced filter if form selected
$(document).on('change','#FilterApplicationForm select#InstituteForms', function (){
    var FormId;
    if(this.value)
    {
        var CollegeId = $('#Institute').val();
        FormId = this.value;
        GetFormRelatedFieldsUrl(FormId);
        GetAllRelatedStates(CollegeId,FormId);
        GetAllRelatedCouponCampaigns(CollegeId, FormId);
    }
    else
    {
        FormId = '';
        $('.advance-filter-block').addClass('display-none');
    }

    if(typeof jsVars.StateList != 'undefined')
    {
        var StateList = $.parseJSON(jsVars.StateList);

        if(typeof jsVars.postedCollegeId != 'undefined')
        {
            (typeof jsVars.StateSelected != 'undefined')?UpdateStateList(StateList, jsVars.postedCollegeId, FormId, jsVars.StateSelected):UpdateStateList(StateList, jsVars.postedCollegeId, FormId,'');
        }
        else
        {
            if(($('#FilterApplicationForm select#Institute').length > 0) && (FormId == ''))
            {
                $('#FilterApplicationForm select#Institute').trigger('change');
            }
            else
            {
                (typeof jsVars.StateSelected != 'undefined')?UpdateStateList(StateList, '', FormId, jsVars.StateSelected):UpdateStateList(StateList, '', FormId,'');
            }
        }

    }
});

//Advanced Filter Add More Button
$(document).on('click','#AddMoreSearchButton', function(){
    $('#SelectBoxArea').append(jsVars.FormSelectFields);
    $('.chosen-select').chosen();
});

$(document).on('change','#SelectArea select.chosen-select', function (){
    if(this.value)
    {
        var $Key = this.value;
        var KeyArray = $Key.split("||");
        var Colomn = KeyArray[0];
        var PreSelect = '';
        if(typeof jsVars.AdvancedSearch != 'undefined')
        {
            var valueFields =  jsVars.AdvancedSearch.value;

            if(Colomn in valueFields)
            {
                PreSelect = valueFields[Colomn];
            }
        }

        var Html = GenrateHtmlField(KeyArray,this,PreSelect);
        var TopParent = $(this).parents('div#SelectArea').parent();
        if($(TopParent).find('div#ValueArea').length > 0)
        {
            $(TopParent).find('div#ValueArea').remove();
        }
        if(KeyArray[1] != 'machine_key')
        {
            $(TopParent).append(Html);
            $('.chosen-select').chosen();
            $('.datepicker').datepicker({startView : 'month', format : 'dd/mm/yyyy', enableYearToMonth: true, enableMonthToDay : true});
        }
        $('.chosen-select').trigger('chosen:updated');
    }
    else
    {
        var TopParent = $(this).parents('div#SelectArea').parent();
        if($(TopParent).find('div#ValueArea').length > 0)
        {
            $(TopParent).find('div#ValueArea').remove();
        }
    }
});

//Application Manager Filter Form
if ($('#FilterApplicationForm #start_date, #FilterApplicationForm #end_date').length > 0) {
    //$('#FilterApplicationForm #start_date, #FilterApplicationForm #end_date').datepicker({startView: 'month', format: 'd M yyyy', enableYearToMonth: true, enableMonthToDay: true})/*.on('changeDate', function () {})*/;
    $('#FilterApplicationForm #start_date, #FilterApplicationForm #end_date').datetimepicker({format: 'DD/MM/YYYY HH:mm',viewMode: 'years'});
}

function onlinePaymentDetails(ApplicationId)
{
    if(ApplicationId)
    {
        callAjaxRequest(ApplicationId,'onlinePaymentDetails');
    }
}

function offlinePaymentDetails(ApplicationId)
{
    if(ApplicationId)
    {
        callAjaxRequest(ApplicationId,'offlinePaymentDetails');
    }
}

function demandDraftDetails(ApplicationId)
{
    if(ApplicationId)
    {
        callAjaxRequest(ApplicationId,'demandDraftDetails');
    }
}

function voucherDetails(ApplicationId)
{
    if(ApplicationId)
    {
        callAjaxRequest(ApplicationId,'voucherDetails');
    }
}

function UpdateDemandDraftDetails(ApplicationId,form_id)
{
    if(ApplicationId)
    {
        var rejectdd        = '';
        var reject_reason   = '';
        if(typeof $('#rejectdd').val() != 'undefined' && $('#rejectdd').val()!=''){
            rejectdd = $('#rejectdd').val();
            reject_reason = $('#reject_reason').val();

        }
        var error = false;

        $('#DDRecieved, #DDRecievedDate, #DDNumber,#DDNumber,#DDDate,#DrawnOn,#Branch,#reject_reason').removeAttr('style');
        $('.DDRecievedDate_error,.DDRecieved_error').html('');

        if($('#DDRecieved:checkbox:checked').length < 1){
            $('.requiredError').show();
            $('.DDRecieved_error').html('Please check');
            $('#DDRecieved').css('border','1px solid red');
            error = true;

        }

        if($('#DDRecievedDate').val() == ''){
            $('.requiredError').show();
            $('.DDRecievedDate_error').html('Please select date');
            $('#DDRecievedDate').css('border','1px solid red');
            error = true;

        }

        if($('#DDNumber').val() == ''){
            $('#DDNumber').css('border','1px solid red');
            error = true;
        }
        if($('#DDDate').val() == ''){
            $('#DDDate').css('border','1px solid red');
            error = true;
        }
        if($('#DrawnOn').val() == ''){
            $('#DrawnOn').css('border','1px solid red');
            error = true;
        }
        if($('#Branch').val() == ''){
            $('#Branch').css('border','1px solid red');
            error = true;
        }

//        if($('#reject_reason').val() == ''){
//            $('#reject_reason').css('border','1px solid red');
//            error = true;
//        }
        if(error == true){
            console.log('ERROR!');
            return false;
        }
        else if($('#DDRecieved:checked') && ($('#DDRecievedDate').val() != ''))
        {
            var DDRecievedDate = $('#DDRecievedDate').val();
            var DDNumber = $('#DDNumber').val();
            var DrawnOn = $('#DrawnOn').val();
            var Branch = $('#Branch').val();
            var DDDate = $('#DDDate').val();

            var data = [];
            data = $('form#ddform_html').serializeArray();

            data.push({name: "id", value: ApplicationId});
            data.push({name: "area", value: 'UpdateDemandDraftDetails'});
            data.push({name: "DDRecievedDate", value: DDRecievedDate});
            data.push({name: "form_id", value: form_id});
            data.push({name: "rejectdd", value: rejectdd});
            data.push({name: "reject_reason", value: reject_reason});
            data.push({name: "DDNumber", value: DDNumber});
            data.push({name: "DrawnOn", value: DrawnOn});
            data.push({name: "Branch", value: Branch});
            data.push({name: "DDDate", value: DDDate});

            $('form#ddform_html').ajaxSubmit({
                url: jsVars.SaveGetApplicationInfoUrl,
                type: 'post',
                data: data, //{id:ApplicationId,area:'UpdateDemandDraftDetails',DDRecievedDate:DDRecievedDate,form_id:form_id,rejectdd:rejectdd,reject_reason:reject_reason,'DDNumber':DDNumber,'DrawnOn':DrawnOn,'Branch':Branch,'DDDate':DDDate},
                dataType: 'json',
                cache: false,
                processData: false, // Don't process the files
                contentType: false,
                headers: {
                    "X-CSRF-Token": jsVars._csrfToken
                },
                beforeSend: function() {
                        $('div.loader-block-a').show();
                },
                complete: function() {
                        $('div.loader-block-a').hide();
                },
                success: function (json)
                {
                    if(json['redirect'])
                    {
                        location = json['redirect'];
                    }
                    else if(json['error'])
                    {
                        alertPopup(json['error'],'error');
                    }
                    else if(json['success'] == 200)
                    {
                        if(($('span#ApplicationPaymentStatusSpan'+ApplicationId)).lenght>0){

                        $('span#ApplicationPaymentStatusSpan'+ApplicationId).removeClass('payment-not-recieve-message');
                        $('span#ApplicationPaymentStatusSpan'+ApplicationId).addClass('payment-recieve-message');
                        $('span#ApplicationPaymentStatusSpan'+ApplicationId).text(jsVars.StatusList['5']);
                        }
                        $('.npf-close').trigger('click');
                        alertPopup(json['msg']);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    $('div.loader-block-a').hide();
                }
            });
        }
    }
}

function remarkDetails(ApplicationId)
{
    if(ApplicationId)
    {
        alertPopup('Getting error to open popup.');
        //var data = 'id='+ApplicationId+'&area=onlinePaymentDetails';
        //callAjaxRequest(data);
    }
}

function documentDetails(ApplicationId,formId,app_num,stu_name, userId)
{
    if(ApplicationId || userId)
    {
        $.ajax({
            url: jsVars.manageDocumentsInfoUrl,
            type: 'post',
            data: {id:ApplicationId,form_id:formId,userId:userId},
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function() {
                    $('div.loader-block-a').show();
            },
            complete: function() {
                    $('div.loader-block-a').hide();
            },
            success: function (data)
            {
             //$('#result').html(json);
                $("#fileloadResults").html(data);
				$("#document-details .modal-dialog").removeClass('modal-sm').addClass('modal-lg');
				$("#document-details .modal-dialog .modal-body").addClass('full-scroll');
                $("#document-details").modal();
				$('#document-details [data-toggle="tooltip"]').tooltip({
					placement: 'top',
					trigger : 'hover',
					template: '<div class="tooltip layerTop" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
				});
             //return false;
             /*

                if(json['redirect'])
                {
                    location = json['redirect'];
                }
                else if(json['error'])
                {
                        $("#stu_name_e").html(stu_name);
                        $("#app_num_e").html(app_num);
                         $('#errorText').html(json['error']);
                         $("#document-error").modal();
                }
                else if(json['success'] == 200)
                {
                   // console.log(json['data']);
                   $("#stu_name").html(stu_name);
                   $("#app_num").html(app_num);

                   var htmlData = '';
                   var srno = 1;
                   var admitcardlink='';
                   var downloadLink = [];
                   if(typeof json['download_admit_card']!='undefined' && json['download_admit_card']==1){
                       if(json['admitcard']){
                           var dwnData = {"link":json['admitcard'],"filename":"AdmitCard.pdf"};
                           downloadLink.push(dwnData);

                           admitcardlink+='<tr>';
                           admitcardlink+='<td>'+srno+'.</td>';
                           admitcardlink+='<td><label class="docdetlabel">Admit Card</label></td>';
                           admitcardlink+='<td class="text-center"><label class="docdetlabel"><a class="btn btn-default btn-doc" href="'+json['admitcard']+'" target="_blank">Print</a></label></td>';
                           admitcardlink+='</tr>';
                           srno++;
                        }
                    }

                   if(json['ackcard']){

                       var dwnData = {"link":json['ackcard'],"filename":"AcknowledgementCard.pdf"};
                       downloadLink.push(dwnData);

                       admitcardlink+='<tr>';
                       admitcardlink+='<td>'+srno+'.</td>';
                       admitcardlink+='<td><label class="docdetlabel">Acknowledgement Card</label></td>';
                       admitcardlink+='<td class="text-center"><label class="docdetlabel"><a class="btn btn-default btn-doc" href="'+json['ackcard']+'" target="_blank">Print</a></label></td>';
                       admitcardlink+='</tr>';
                   }

                   if(json['data'])
                   {
                        for(var doc_data in json['data'])
                        {
                            srno++;
                        // console.log(json['data'][doc_data].name);


                        htmlData+='<tr>';

                        htmlData+='<td> '+srno+' </td>';
                        htmlData+='<td>';
                        htmlData+='<label class="docdetlabel">'+json['data'][doc_data].name+'</label>';
                        htmlData+='</td><td class="text-center"><label class="docdetlabel">';
                        if(json['data'][doc_data].path=='' || typeof json['data'][doc_data].path =='undefined')
                        {
                            htmlData+=' Document Not Uploaded';
                        }
                        else
                        {
                            var dwnData = {"link":json['data'][doc_data].path,"filename":json['data'][doc_data].filename};
                            downloadLink.push(dwnData);
                            htmlData+='<a href="'+json['data'][doc_data].path+'" class="btn btn-default btn-doc">Download</a>';
                        }
                        htmlData+='</label></td></tr>';



                        }

                    }
//                    admitcardlink = '';
//                    htmlData = '';
                    if(htmlData=='' && admitcardlink==''){
                        htmlData ='<tr><td colspan="3" style="padding:0;"><div id="errorText" class="alert alert-warning text-center">No Documents</div></td></tr>';
                        $('#ApplicantDocList').html(htmlData);
                    }else{
                        // download zip button
                        if(downloadLink.length>0){

                            if(typeof json['application_no'] == 'undefined' || json['application_no'] ==''){
                                if(typeof app_num !='undefined' && app_num!=''){
                                    json['application_no'] = app_num.replace('/','-');
                                }else{
                                    json['application_no'] = 'DownloadDocument';
                                }
                            }else{
                                json['application_no'] = json['application_no'].replace("/", "-");
                            }

                            var docForm = jQuery('<form>', {'action': '/common/download-document-zip','method': 'post'});
                            //for(var ii in downloadLink){
                            docForm.append(jQuery('<input>',{'name': 'docpath','value': JSON.stringify(downloadLink),'type': 'hidden'}));
                            docForm.append(jQuery('<input>',{'name': 'application_no','value': json['application_no'],'type': 'hidden'}));
                            //}
                            docForm.append(jQuery('<input>', {'name': 'Submit','value': 'Download','type': 'submit','class':'btn btn-default btn-npf'}));
                            $('#downloaddocLink').html(docForm);

                        }

//                        ///$('<form action="/common/downloadDocumentZip"></form>').appendTo('body').submit();
                        console.log(docForm);
                        console.log(admitcardlink+htmlData);
                        $('#ApplicantDocList').html(admitcardlink+htmlData);
                    }
                    $("#document-details").modal();

                }*/
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block-a').hide();
            }
        });

        return;
    }
}

function deleteApplicationDetails(ApplicationId)
{
    if(ApplicationId)
    {
        alertPopup('Getting error to open popup.');
        //var data = 'id='+ApplicationId+'&area=onlinePaymentDetails';
        //callAjaxRequest(data);
    }
}
//var alreadyopen = false;
//common ajax function
function callAjaxRequest(ApplicationId,area,form_id)
{

    $('#reject_reason').val('');
    $('#reject_reason_html').hide();
    $('#li_payment_list').hide();
    $('#rejectdd').remove();
    $('.requiredError').html('');
    $('#DDRecieved, #DDRecievedDate, #DDNumber,#DDNumber,#DDDate,#DrawnOn,#Branch,#reject_reason').removeAttr('style');
     $('#activeDD,#rejectedDD').removeClass('active');

    $.ajax({
            url: jsVars.SaveGetApplicationInfoUrl,
            type: 'post',
            data: {id:ApplicationId,area:area,form_id:form_id},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function() {
                    $('div.loader-block-a').show();
            },
            complete: function() {
                    $('div.loader-block-a').hide();
            },
            success: function (json)
            {
                if(json['redirect'])
                {
                    location = json['redirect'];
                }
                else if(json['error'])
                {
                    alertPopup(json['error'],'error');
                }
                else if(json['success'] == 200)
                {
                    if(area == 'onlinePaymentDetails')
                    {
                        $('#online-payment-details #CaptionTitle').text('Online Payment Details');
                        $('#online-payment-details div.modal-body').html(json['data']);
                        $('#OnlinePaymentDetailsBtn').trigger('click');
                    }
                    else if(area == 'offlinePaymentDetails')
                    {
                        $('#online-payment-details #CaptionTitle').text('Offline Payment Details');
                        $('#online-payment-details div.modal-body').html(json['data']);
                        $('#OnlinePaymentDetailsBtn').trigger('click');
                    }
                    else if(area == 'freePaymentDetails')
                    {
                        $('#online-payment-details #CaptionTitle').text('Free Payment Details');
                        $('#online-payment-details div.modal-body').html(json['data']);
                        $('#OnlinePaymentDetailsBtn').trigger('click');
                    }
                    else if(area == 'demandDraftDetails' || area == 'rejectedDraftDetails')
                    {
                        var DDTitle = 'Demand Draft';
                        var DD1TabTitle = 'DD-1';
                        var DD2TabTitle = 'DD-2';
                        var DDNumberTitle = 'DD Number';
                        var DDDateTitle = 'DD Date';
                        var DDReceicedDateTitle = 'DD Date';
                        var DDReceicedTitle = 'DD Received';
                        var secondReasonDDTitle = 'Reason for 2nd DD';
                        var DDReceiptTitle = 'DD Receipt';
                        if(json['DDAlias'] !== 'DD') {
                            DDTitle = json['data']['DDAlias'];
                            DD1TabTitle = DDTitle + '-1';
                            DD2TabTitle = DDTitle + '-2';
                            DDNumberTitle = DDTitle + ' Number';
                            DDDateTitle = DDTitle + ' Date';
                            DDReceicedDateTitle = DDTitle + ' Received Date';
                            DDReceicedTitle = DDTitle + ' Received';
                            secondReasonDDTitle = 'Reason for 2nd ' + DDTitle;
                            DDReceiptTitle = DDTitle + ' Receipt';
                        }

                        $('#ddH2Div').text(DDTitle + ' Details');
                        $('#rejectedDD').text(DD1TabTitle);
                        $('#activeDD').text(DD2TabTitle);

                        $('#DDNumberlabel').text(DDNumberTitle);
                        $('#DDDatelabel').text(DDDateTitle);
                        $('#DDReceicedDatelabel').text(DDReceicedDateTitle);
                        $('#DDReceivedlabel').text(DDReceicedTitle);
                        $('#2ndDDReasonlabel').text(secondReasonDDTitle);
                        $('#DDReceiptlabel').text(DDReceiptTitle);

                        if(json['data']['display_reject_button']==0){

                            $('#addNewDD a').hide();
                        }else{

                            $('#addNewDD a').show();
                        }

                        $('#reject_reason').val('');

                        if(area == 'rejectedDraftDetails'){

                            $('#reject_reason_html').hide();


                            $('#activeDD').attr('onclick','callAjaxRequest('+ApplicationId+',\'demandDraftDetails\','+form_id+');');
                            $('#rejectedDD').attr('onclick','callAjaxRequest('+ApplicationId+',\'rejectedDraftDetails\','+form_id+');');
                            $('#rejectedDD').addClass('active');
                            $('#li_payment_list').show();
                            //$('#rejectdd_html').hide();
                            $('#addNewDD').hide();
                            $('#reject_reason').val('');
                            $('#DDRecievedDate_html,#DDRecieved_html').hide();

                        }else if((typeof json['data']['rejected']!='undefined' && json['data']['rejected']==1)){


                            $('#rejectdd').removeAttr('checked');
                            $('#rejectBlock').show();
                            $('#reject_reason_html').show();

                            if(typeof json['data']['reject_reason']!='undefined' && json['data']['reject_reason']!=''){
                                $('#reject_reason').val(json['data']['reject_reason']);

                            }


                            $('#activeDD').attr('onclick','callAjaxRequest('+ApplicationId+',\'demandDraftDetails\','+form_id+');');
                            $('#rejectedDD').attr('onclick','callAjaxRequest('+ApplicationId+',\'rejectedDraftDetails\','+form_id+');');
                            $('#activeDD').addClass('active');
                            $('#li_payment_list').show();
                            $('#addNewDD').hide();
                             $('#DDRecievedDate_html,#DDRecieved_html').show();

                        }else{
                            $('#rejectBlock').hide();
                            $('#reject_reason_html').hide();
                            $('#reject_reason').html('');
                            $('#rejectdd_html').show();
                            $('#li_payment_list').hide();
                            $('#addNewDD').show();
                             $('#DDRecievedDate_html,#DDRecieved_html').show();
                        }

                        $('#js_app_id').val(ApplicationId);
                        $('#js_form_id').val(form_id);

//                        else if((typeof json['data']['reject_reason']!='undefined' && json['data']['reject_reason']!='')){
//
//
//
//                        }else{
//                            $('#rejectdd').removeAttr('checked');
//                            $('#rejectBlock').show();
//                            $('#activeDD,#rejectedDD').removeAttr('onclick');
//                            $('#li_payment_list').hide();
//                        }



                        $('#rejectdd').removeAttr('checked');
                        $('#PaidBy').val(json['data']['PaidBy']);
                        $('#DDNumber').val(json['data']['DDNumber']);
                        $('#DDDate').val(json['data']['DDDate']);
                        $('#DrawnOn').val(json['data']['DrawnOn']);
                        $('#Branch').val(json['data']['Branch']);
                        $('#DDRecievedDate').val(json['data']['DDRecievedDate']);
                        $('#LastModifiedBy').text(json['data']['LastModifiedBy']);
                        $('#showDDReceiptDiv').html('');

                        if(json['data']['DDReceiptFile'] != '') {
                            $('#showDDReceiptDiv').show();
                            $('#RemoveBtnParentDiv').hide();
                            $('#showDDReceiptDiv').html('<a href="'+json['data']['DDReceiptFile']+'" target="_blank">View Receipt</a>');
                        }

                        if(json['data']['DDRecievedDate'] != '')
                        {


                            $('#DDRecievedDate').css('border','none');
//                            $('#DDRecieved').attr('checked',true);
                            if($('#DDRecieved').length>0){
                            document.getElementById("DDRecieved").checked = true;
                            }

                            $('#PaidBy,#DDNumber,#DDDate,#DrawnOn,#Branch, #DDRecievedDate, #reject_reason').attr('disabled',true);
                            $('#buttonSection').html('<button type="button" class="btn btn-default btn-npf btn-npf-alt"  data-dismiss="modal" >Close</button>');

                        }
                        else if(json['data']['DDRecievedDate'] == '')
                        {
                            if(area == 'rejectedDraftDetails'){
                                $('#buttonSection').html('<button type="button" class="btn btn-default btn-npf btn-npf-alt"  data-dismiss="modal" >Close</button>');
                            }else{
                                if($('#SaveDDStatus').length){
                                    $('#SaveDDStatus').attr('onclick','UpdateDemandDraftDetails('+ApplicationId+','+form_id+');');
                                }else{
                                    $('#buttonSection').html('<button type="button" class="btn btn-default btn-npf" id="SaveDDStatus">Save</button><button type="button" class="btn btn-default btn-npf btn-npf-alt"  data-dismiss="modal" >Cancel</button>');
                                    $('#SaveDDStatus').attr('onclick','UpdateDemandDraftDetails('+ApplicationId+','+form_id+');');
                                }

                            }


                            $('#DDRecieved').attr('checked',false);
                            $('#DDRecievedDate, #DDRecieved').attr('disabled',false);
                        }
                        // check if show then not trigger click
                        if(!($("#demand-draft").data('bs.modal') || {}).isShown){
                            $('#DemandDraftBtn').trigger('click');
                        }

                        //$('#DDDate').attr('disabled','disabled');

                    }
                    else if(area == 'voucherDetails')
                    {
                        $('#voucher-payment-details div.modal-body').html(json['data']);
                        $('#VoucherPaymentDetailsBtn').trigger('click');
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block-a').hide();
            }
        });
    return;
}

// function: Get All Forms of a College
function GetAllRelatedForms(CollegeId,Condition)
{
    if(CollegeId && Condition)
    {
        $.ajax({
            url: jsVars.GetAllRelatedFormUrl,
            type: 'post',
            data: {CollegeId:CollegeId,Condition:Condition},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function() {
                    $('div.loader-block').show();
            },
            complete: function() {
                    $('div.loader-block').hide();
            },
            success: function (json)
            {
                if(json['redirect'])
                {
                    location = json['redirect'];
                }
                else if(json['error'])
                {
                    alertPopup(json['error'],'error');
                }
                else if(json['success'] == 200)
                {
                    //Set Form Id
                    if(typeof jsVars.postedFormId != 'undefined')
                    {
                        UpdateFormSelect(json['FormList'], jsVars.postedFormId);
                    }
                    else
                    {
                        UpdateFormSelect(json['FormList'], 0);
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
}

function GetAllRelatedStates(CollegeId,FormId){
    if(CollegeId){

        if(typeof jsVars.js_state_name == 'undefined'){
            defaultval = '';
        }else{
            defaultval = jsVars.js_state_name;
        }

        $.ajax({
            url: '/applications/get-all-related-states/',
            type: 'post',
            data: {college_id:CollegeId,form_id:FormId,defaultval:defaultval},
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function() {
                    $('div.loader-block').show();
            },
            complete: function() {
                    $('div.loader-block').hide();
            },
            success: function (data)
            {
                data = data.replace("<head/>", '');
                if(data == 'session_logout'){
                    location = '/';
                }
                else{

                    //Set Form Id
                    $('#InstituteState').html(data);
                    $('.chosen-select').chosen();
                    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                    $('.chosen-select').trigger('chosen:updated');

                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
}

function UpdateFormSelect(FormList,FormIdSelected)
{
    if(!FormIdSelected)
    {
        var OptionHtml = '<option selected="selected" value="">Select form</option>';
    }
    else
    {
        var OptionHtml = '<option value="">Select form</option>';
    }
    if(FormList)
    {
        for(var i in FormList)
        {
            if(FormIdSelected && (i == FormIdSelected))
            {
                OptionHtml += '<option selected="selected" value="'+ i +'">'+ FormList[i] +'</option>';
            }
            else
            {
                OptionHtml += '<option value="'+ i +'">'+ FormList[i] +'</option>';
            }
        }
    }

    $('#FilterApplicationForm #InstituteForms').html(OptionHtml);
    $("#InstituteForms").trigger("chosen:updated");
}

function UpdateCreatedBySelect(CreatedByList,CreatedByIdSelected)
{
    if(!CreatedByIdSelected)
    {
        var OptionHtml = '<option selected="selected" value="">Created By</option>';
    }
    else
    {
        var OptionHtml = '<option value="">Created By</option>';
    }
    if(CreatedByList)
    {
        for(var i in CreatedByList)
        {
            if(CreatedByIdSelected && (i == CreatedByIdSelected))
            {
                OptionHtml += '<option selected="selected" value="'+ i +'">'+ CreatedByList[i] +'</option>';
            }
            else
            {
                OptionHtml += '<option value="'+ i +'">'+ CreatedByList[i] +'</option>';
            }
        }
    }

    $('#FilterLeadForm #CreatedBySelect, #FilterApplicationForm #CreatedBySelect').html(OptionHtml);
    $("#CreatedBySelect").trigger("chosen:updated");
}

// function: Get All Forms of a College
function LoadMoreApplication()
{

    var page,loadedApplications;
    var countApplication = parseInt($('div.select-option-block').length);

    if(countApplication <= jsVars.APPLICATION_START_PAGE)
    {
        page = 2;
    }
    else if(countApplication > jsVars.APPLICATION_START_PAGE)
    {
        loadedApplications = countApplication - jsVars.APPLICATION_START_PAGE;
        page = countApplication / jsVars.ITEM_PER_PAGE;
        page = page + 1;
    }


    if(page > 0)
    {
        $.ajax({
            url: jsVars.loadMoreApplicationsUrl + '?page=' + page,
            type: 'post',
            data: $('#FilterApplicationForm input, #FilterApplicationForm select'),
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function() {
                    $('div.select-block-container #LoadMoreArea').text('Loading...');
            },
            complete: function() {
                    $('div.select-block-container #LoadMoreArea').text('');
                    $('div.select-block-container #LoadMoreArea').html('<input type="button" onclick="LoadMoreApplication();" value="Load More Applications" class="btn btn-default btn-sm w-text npf-btn">');
            },
            success: function (response)
            {
                $('div.select-block-container #LoadMoreArea').remove();
                $('div.select-block-container').append(response);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.select-block-container #LoadMoreArea').html('<input type="button" onclick="LoadMoreApplication();" value="Load More Applications" class="btn btn-default btn-sm w-text npf-btn">');
            }
        });
    }
}

function GetFormRelatedFieldsUrl(FormId)
{
    $.ajax({
            url: jsVars.GetFormRelatedFieldsUrl,
            type: 'post',
            data: {form_id:FormId},
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function() {
                    //$('div.select-block-container #LoadMoreArea').text('Loading...');
            },
            complete: function() {
                    //$('div.select-block-container #LoadMoreArea').text('');
                    //$('div.select-block-container #LoadMoreArea').html('<input type="button" onclick="LoadMoreApplication();" value="Load More Applications" class="btn btn-default w-text npf-btn">');
            },
            success: function (response)
            {
                jsVars.FormSelectFields = response;
                $('#SelectBoxArea').html(response);
                $('.advance-filter-block').removeClass('display-none');
                $('.chosen-select').chosen();
                if(typeof jsVars.AdvancedSearch != 'undefined')
                {
                    var searchFields =  jsVars.AdvancedSearch.search;
                    var start = 1;
                    for(var index in searchFields)
                    {
                        if(start == 1)
                        {
                            $('#SelectBoxArea .row:nth-child('+ start +') #SelectArea select.chosen-select option[value=\''+ searchFields[index] +'\']').attr('selected', true)
                            $('#SelectBoxArea .row:nth-child('+ start +') #SelectArea select.chosen-select').trigger('chosen:updated');
                            $('#SelectBoxArea .row:nth-child('+ start +') #SelectArea select.chosen-select').trigger('change');
                        }
                        else
                        {
                            $('#AddMoreSearchButton').trigger('click');
                            $('#SelectBoxArea .row:nth-child('+ start +') #SelectArea select.chosen-select option[value=\''+ searchFields[index] +'\']').attr('selected', true)
                            $('#SelectBoxArea .row:nth-child('+ start +') #SelectArea select.chosen-select').trigger('chosen:updated');
                            $('#SelectBoxArea .row:nth-child('+ start +') #SelectArea select.chosen-select').trigger('change');
                        }
                        start++;
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                //$('div.select-block-container #LoadMoreArea').html('<input type="button" onclick="LoadMoreApplication();" value="Load More Applications" class="btn btn-default w-text npf-btn">');
            }
        });
}

function GenrateHtmlField(KeyArray, CurrentObj,PreSelect)
{
    var Colomn = KeyArray[0];
    var FieldType = KeyArray[1];
    var Html = '';
    switch(FieldType) {
        case 'textbox':
            Html += '<div class="col-md-4" id="ValueArea">';
            Html += '   <div class="form-group formAreaCols">';
            Html += '       <input type="text" class="form-control" name="Filter[Advanced][value]['+ Colomn +']" placeholder="Search Text" value="'+ PreSelect +'"/>';
            Html += '   </div>';
            Html += '</div>';
            break;
        case 'machine_key':
            if (typeof KeyArray[2] != 'undefined') {
                var MachineKey = KeyArray[2];
                GetMachineKeyOption(MachineKey,Colomn,CurrentObj,PreSelect);
            }
            break;
        case 'dropdown':
            if (typeof KeyArray[2] != 'undefined') {
                var options = JSON.parse(KeyArray[2]);
            }
            Html += '<div class="col-md-4" id="ValueArea">';
            Html += '   <div class="form-group formAreaCols">';
            Html += '       <select name="Filter[Advanced][value]['+ Colomn +']"  class="chosen-select">';
            Html += '           <option value="">Select Option</option>';
            if(typeof options != 'undefined')
            {
                for(var index in options)
                {
                    if(PreSelect == options[index])
                    {
                        Html += '   <option value="'+ options[index] +'" selected="selected">'+ options[index] +'</option>';
                    }
                    else
                    {
                        Html += '   <option value="'+ options[index] +'">'+ options[index] +'</option>';
                    }
                }
            }
            Html += '   </select>';
            Html += '   </div>';
            Html += '</div>';
            break;
        case 'date':
            Html += '<div class="col-md-4" id="ValueArea">';
            Html += '   <div class="form-group formAreaCols">';
            Html += '       <input type="text" class="form-control datepicker" name="Filter[Advanced][value]['+ Colomn +']" placeholder="Select Date" readonly value="'+ PreSelect +'"/>';
            Html += '   </div>';
            Html += '</div>';
            break;
        default:
            '';
    }
    return Html;
}

function GetMachineKeyOption(MachineKey,field_id,CurrentObj,PreSelect)
{
    $.ajax({
            url: jsVars.GetMachineKeyFieldsUrl,
            type: 'post',
            data: {key:MachineKey,field_id:field_id, selected_value:PreSelect,place_holder:'Select value'},
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function() {
                    //$('div.select-block-container #LoadMoreArea').text('Loading...');
            },
            complete: function() {
                    //$('div.select-block-container #LoadMoreArea').text('');
                    //$('div.select-block-container #LoadMoreArea').html('<input type="button" onclick="LoadMoreApplication();" value="Load More Applications" class="btn btn-default w-text npf-btn">');
            },
            success: function (response)
            {
                var Html = '<div class="col-md-4" id="ValueArea">';
                Html += '   <div class="form-group formAreaCols">';
                Html += '       <select name="Filter[Advanced][value]['+ field_id +']"  class="chosen-select">';
                Html += response;
                Html += '   </select>';
                Html += '   </div>';
                Html += '</div>';
                var TopParent = $(CurrentObj).parents('div#SelectArea').parent();
                if($(TopParent).find('div#ValueArea').length > 0)
                {
                    $(TopParent).find('div#ValueArea').remove();
                }
                $(TopParent).append(Html);
                $('.chosen-select').chosen();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                //$('div.select-block-container #LoadMoreArea').html('<input type="button" onclick="LoadMoreApplication();" value="Load More Applications" class="btn btn-default w-text npf-btn">');
            }
        });
}

function UpdateStateList(AllStateList,CollegeId,FormId,StateSelected)
{
    if(!StateSelected)
    {
        var OptionHtml = '<option selected="selected" value="">Select State</option>';
    }
    else
    {
        var OptionHtml = '<option value="">Select State</option>';
    }

    if(AllStateList)
    {
        var StateList;
        if(FormId != '' && typeof AllStateList['FormLevel'] !='undefined')
        {
            StateList =  (FormId in AllStateList['FormLevel'])?AllStateList['FormLevel'][FormId]:[];
        }
        else if(CollegeId != '' && typeof AllStateList['CollegeLevel'] !='undefined')
        {
            StateList =  (CollegeId in AllStateList['CollegeLevel'])?AllStateList['CollegeLevel'][CollegeId]:[];
        }
        else
        {
            StateList =  AllStateList['All'];
        }

        for(var i in StateList)
        {
            if(StateSelected && (i == StateSelected))
            {
                OptionHtml += '<option selected="selected" value="'+ i +'">'+ StateList[i] +'</option>';
            }
            else
            {
                OptionHtml += '<option value="'+ i +'">'+ StateList[i] +'</option>';
            }
        }
    }

    $('#FilterApplicationForm #InstituteState').html(OptionHtml);
    $("#InstituteState").trigger("chosen:updated");
}

function addNewDD(){

//    if($(elem).prop('checked')){

        var form_id         = $('#js_form_id').val();
        var ApplicationId   = $('#js_app_id').val();

        $('#addNewDD').hide();
        $('#DDNumber').val('');
        $('#DDDate').val('');
        $('#DrawnOn').val('');
        $('#Branch').val('');
        $('#DDRecievedDate').val('');
        $('#LastModifiedBy').text('');
        $('#DDRecieved').removeAttr('checked',false);
        $('#DDRecieved').removeAttr('disabled');
        $('#ddform_html').append('<input type="hidden" name="rejectdd" id="rejectdd" value="yes">');
        $('#showDDReceiptDiv').hide().html('');
        $('#RemoveBtnParentDiv').show();

        $('#DDRecievedDate').removeAttr('disabled');
        $('#DDDate').removeAttr('disabled');

        $('#reject_reason').removeAttr('disabled');
        $('#reject_reason').val('');
        $('#reject_reason_html').show();
//        console.log('dlsdfof.d');

        $('#DDNumber,#DDDate,#DrawnOn,#Branch,#DDRecievedDate,#LastModifiedBy').removeAttr('readonly');
        $('#DDNumber,#DDDate,#DrawnOn,#Branch,#DDRecievedDate,#LastModifiedBy').removeAttr('disabled');

        //$('#buttonSection').html('<button type="button" class="btn btn-default btn-npf" id="SaveDDStatus">Save</button><button type="button" class="btn btn-default btn-npf btn-npf-alt"  data-dismiss="modal" >Cancel</button>');

        $('#SaveDDStatus').attr('onclick','UpdateDemandDraftDetails('+ApplicationId+','+form_id+');');

//    }

//    else{
//
//        $('#reject_reason').val('');
//        $('#reject_reason_html').hide();
//        var app_id = $('#js_app_id').val();
//        var form_id = $('#js_form_id').val();
//        callAjaxRequest(app_id,'demandDraftDetails',form_id);
//        $('#DDNumber,#DDDate,#DrawnOn,#Branch,#DDRecievedDate,#LastModifiedBy').attr('readonly','readonly');
//    }
    return false;
}

// function: Get All Forms of a College
function GetAllRelatedPaymentMethod()
{
    var CollegeId = $('#Institute').val();

    $.ajax({
            url: jsVars.PaymentMethodUrl,
            type: 'post',
            data: {CollegeId:CollegeId},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function() {
                    $('div.loader-block').show();
            },
            complete: function() {
                    $('div.loader-block').hide();
            },
            success: function (json)
            {
                if(json['redirect'])
                {
                    location = json['redirect'];
                }
                else if(json['success'] == 200)
                {
                    if(json['allow_dd_rejected_option'] == 1)
                    {
                        $('#DDRejectedSelect').closest('div.col-md-4').show();
                    }
                    else
                    {
                        $('#DDRejectedSelect').closest('div.col-md-4').hide();
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
}

// function: download custom csv form
function downloadCustomCsvForm(){
//
    var $form = $("#FilterApplicationForm");
    var action_attr = $form.attr("action");
    $form.attr("action",'/applications/download-custom-csv-form');
    $form.submit();
    $form.attr("action",action_attr);
    return false;
}

/*For Call Cash Payment Method Type*/
function getApplicationCashInfo(ApplicationId,area,form_id) {
    $('.loader-block-a').show();
    $.ajax({
        url: jsVars.SaveGetApplicationCashInfoUrl,
        type: 'post',
        dataType: 'html',
        data: {id:ApplicationId,area:area,form_id:form_id},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (data) {
            $('.loader-block-a').hide();
            if(data == 'session')
            {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(data == 'refresh')
            {
                alertPopup('Getting error.Please refresh page and try again.','error');
            }
            else{
                $('#CashPaymentModalBox #CashPaymentBody').html(data);
                $("#CashPaymentBtn").trigger('click');
                $('#CashReceiptDate,#CashReceiveDate').datepicker({startView : 'month', format : 'dd/mm/yyyy', enableYearToMonth: true, enableMonthToDay : true, endDate:'NOW'});
                if($('#CashPaymentModalBox #payment_status_text').length >0 && ($('#CashPaymentModalBox #payment_status_text').val() != ''))
                {
                    $('#CashReceiptDate,#CashReceiveDate').datepicker( 'remove');
                }

                var cashTitle='';
                if(typeof $('#CashPaymentBody #cashTitle').val() !== 'undefined' && $.trim($('#CashPaymentBody #cashTitle').val()) != '') {
                    cashTitle = $('#CashPaymentBody #cashTitle').val();
                } else {
                    cashTitle = 'Cash Payment';
                }
                $('#CashPaymentModalBox h2').html(cashTitle);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

//Save Cash Payment Status Form
$(document).on('submit', 'form#CashPaymentForm',function(e) {
    e.preventDefault();
    $('.help-block').text('');
    var data = $(this).serializeArray();

    $('.loader-block-a').show();
    $(this).ajaxSubmit({
        url: jsVars.SaveGetApplicationCashInfoUrl,
        type: 'post',
        data : data,
        dataType:'html',
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success:function (data){
            $('.loader-block-a').hide();
            if(data == 'session')
            {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(data == 'refresh')
            {
                alertPopup('Getting error.Please refresh page and try again.','error');
            }
            else{
                $('#CashPaymentModalBox #CashPaymentBody').html(data);
                $('#CashReceiptDate,#CashReceiveDate').datepicker({startView : 'month', format : 'dd/mm/yyyy', enableYearToMonth: true, enableMonthToDay : true, endDate:'NOW'});
                if($('#CashPaymentModalBox #payment_status_text').length >0 && ($('#CashPaymentModalBox #payment_status_text').val() != ''))
                {
                    var AppId = $('#CashPaymentModalBox #ApplicationId').val();
                    $('#ApplicationPaymentStatusSpan'+AppId).removeClass('payment-not-recieve-message');
                    $('#ApplicationPaymentStatusSpan'+AppId).addClass('payment-recieve-message');
                    $('#ApplicationPaymentStatusSpan'+AppId).text($('#CashPaymentModalBox #payment_status_text').val());
                    $('#CashReceiptDate,#CashReceiveDate').datepicker( 'remove');
                }

            }
        },
        resetForm: false
    });
});

/*For Call Retake Payment Method Type*/
function getRetakeDetails(hash) {
    $('.loader-block-a').show();
    $.ajax({
        url: jsVars.StudentReTakeDetailsUrl,
        type: 'post',
        dataType: 'html',
        data: {hash:hash,area:'retake'},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (data) {
            $('.loader-block-a').hide();
            if(data == 'session')
            {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(data == 'refresh')
            {
                alertPopup('Getting error.Please refresh page and try again.','error');
            }
            else{
                $('#RetakePaymentModalBox #RetakePaymentBody').html(data);
                $("#RetakePaymentBtn").trigger('click');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

// function: Get All Coupon Campaigns of a College
function GetAllRelatedCouponCampaigns(CollegeId,formId)
{
    if(CollegeId)
    {
        var postedFormId = '';
        if(typeof jsVars.postedFormId != 'undefined')
        {
            postedFormId = jsVars.postedFormId;
        }else{
            postedFormId = formId;
        }

        $.ajax({
            url: jsVars.GetAllRelatedCouponCampaignUrl,
            type: 'post',
            data: {CollegeId:CollegeId, formId:postedFormId},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function() {
                    $('div.loader-block').show();
            },
            complete: function() {
                    $('div.loader-block').hide();
            },
            success: function (json)
            {
                if(json['redirect'])
                {
                    location = json['redirect'];
                }
                else if(json['error'])
                {
                    alertPopup(json['error'],'error');
                }
                else if(json['success'] == 200)
                {
                    //Set Form Id
                    if(typeof jsVars.postedCouponCampaignId != 'undefined')
                    {
                        UpdateCouponCampaignSelect(json['couponCampaignList'], jsVars.postedCouponCampaignId);
                    }
                    else
                    {
                        UpdateCouponCampaignSelect(json['couponCampaignList'], 0);
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
}

function UpdateCouponCampaignSelect(couponCampaignList,postedCouponCampaignId)
{
    if(!postedCouponCampaignId)
    {
        var OptionHtml = '<option selected="selected" value="">Select Coupon Campaign</option>';
    }
    else
    {
        var OptionHtml = '<option value="">Select Coupon Campaign</option>';
    }
    if(couponCampaignList)
    {
        for(var i in couponCampaignList)
        {
            if(postedCouponCampaignId && (i == postedCouponCampaignId))
            {
                OptionHtml += '<option selected="selected" value="'+ i +'">'+ couponCampaignList[i] +'</option>';
            }
            else
            {
                OptionHtml += '<option value="'+ i +'">'+ couponCampaignList[i] +'</option>';
            }
        }
    }

    $('#FilterApplicationForm #InstituteCouponCampaigns').html(OptionHtml);
    $("#InstituteCouponCampaigns").trigger("chosen:updated");
}


function verifyLeadThroghOTP(userId, collegeId){
    $("#agentOTPMessageDiv").html("");
    $("#otp_code").val("");
    currentUserId           = userId;
    currentCollegeId        = collegeId;
    $.ajax({
        url: jsVars.getLeadStagesLink,
        type: 'post',
        data: {'userId' : userId, 'collegeId':collegeId, 'formId':formId, moduleName:'application'},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: true,
        beforeSend: function () {
            currentStage            = '';
            stageList               = [];
        },
        complete: function () {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    currentStage            = responseObject.data.stage;
                    stageList               = responseObject.data.stageIds;
                    disallowDown            = responseObject.data.disallow_down;
                    disallowFollowup        = responseObject.data.disallow_followup;
                    disallowRemark          = responseObject.data.disallow_remark;
                    disallowCommunication   = responseObject.data.disallow_communication;
                    if(typeof responseObject.data.stageList === "object" && typeof stageList === "object"){
                        var leadStages  = '<label class="floatify__label float_addedd_js" for="lead_stage">Application Stage</label><select name="lead_stage" id="lead_stage" class="chosen-select" tabindex="-1"><option value="">Application Stage</option>';
                        $.each(stageList, function (index, item) {
                            if(currentStage==item){
                                leadStages += '<option value="'+item+'" selected="selected">'+responseObject.data.stageList[item]+'</option>';
                            }else{
                                leadStages += '<option value="'+item+'">'+responseObject.data.stageList[item]+'</option>';
                            }
                        });
                        leadStages += '</select>';
                        $('#leadStagesDiv').html(leadStages);
                    }
                }
            }else{
                console.log(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function initiateReallocateGdpi(userId, collegeId, formId,centreTaxonomyKey,application_no){
    $("#reallocateGdpiMessageDiv").html("");
    if(formId =='' || formId == 0 || formId == null){
        alertPopup('Please select form','error');
        return;
    }
    if(collegeId=='' || collegeId==0 || collegeId==null){
        alertPopup('Please select college','error');
        return;
    }
    if(userId=='' || userId==0 || userId==null){
        alertPopup('Invalid request Please refresh the page and try again! ','error');
        return;
    }
    if(typeof application_no=='undefined' ){
        application_no = '';
    }
    $.ajax({
        url: '/gdpi/checkGdpiAllocation',
        type: 'post',
        dataType: 'html',
        data: {college_id:collegeId,form_id:formId,user_id:userId,key:centreTaxonomyKey,application_no:application_no},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
            showLoader();
        },
        complete: function() {
            hideLoader();
        },
        success: function (data) {

            var checkError  = data.substring(0, 6);
            if (data === "session_logout") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alertPopup(data.substring(6, data.length));
            } else {
                $("#reallocate_gdpi_div").html(data);
                $('#reallocateGdpiModal').modal('show');
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

function getGdpiCentreConfig(collegeId,formId,venue_key,filterType) {
    $('#reallocateGdpiMessageDiv').html('');
    if(venue_key ){

        $.ajax({
            url: '/gdpi/getGdpiCentreConfig',
            type: 'post',
            dataType: 'json',
            data: {college_id:collegeId,form_id:formId,key:venue_key},
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function() {
                showLoader();
            },
            complete: function() {
                hideLoader();
            },
            success: function (json) {
                if(json['redirect']){
                    location = json['redirect'];
                }
                if(json['error']){
                    $('#reallocateGdpiMessageDiv').html(json['error']);
                    $('#reallocate_gdpi_form #venue_address').html('<option value="">Select address</option>');
                    $('#reallocate_gdpi_form #gd_pi_date').html('<option value="">Select date</option>');
                    $('#reallocate_gdpi_form #gd_pi_panel_number').html('<option value="">Select panel</option>');
                    $('#reallocate_gdpi_form #gd_pi_time_slot').html('<option value="">Select slot</option>');
                    $('.chosen-select').chosen();
                    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                    $('.chosen-select').trigger('chosen:updated');
                }
                else if(json['success']){

                    var html = '<option value="">Select address</option>';
                    for(var key in json['address_list']){
                        html += '<option value="'+key+'">'+json['address_list'][key]+'</option>';
                    }
                    if(typeof filterType != 'undefined' && filterType == 'application'){
                        $(".div_filter_application #venue_address").html(html);
                    } else {
                        $("#reallocate_gdpi_form #venue_address").html(html);
                    }

                    html = '<option value="">Select panel</option>';
                    for(var key in json['panel_list']){
                        html += '<option value="'+key+'">'+json['panel_list'][key]+'</option>';
                    }
                    if(typeof filterType != 'undefined' && filterType == 'application'){
                        $(".div_filter_application #gd_pi_panel_number").html(html);
                    } else {
                        $("#reallocate_gdpi_form #gd_pi_panel_number").html(html);
                    }


                    html = '<option value="">Select slot</option>';
                    for(var key in json['slot_list']){
                        html += '<option value="'+key+'">'+json['slot_list'][key]+'</option>';
                    }
                    if(typeof filterType != 'undefined' && filterType == 'application'){
                        $(".div_filter_application #gd_pi_time_slot").html(html);
                    } else {
                        $("#reallocate_gdpi_form #gd_pi_time_slot").html(html);
                    }


                    html = '<option value="">Select date</option>';
                    for(var key in json['date_list']){
                        html += '<option value="'+key+'">'+json['date_list'][key]+'</option>';
                    }
                    if(typeof filterType != 'undefined' && filterType == 'application'){
                        $(".div_filter_application #gd_pi_date").html(html);
                    } else {
                        $("#reallocate_gdpi_form #gd_pi_date").html(html);
                    }

                    $('.chosen-select').chosen();
                    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                    $('.chosen-select').trigger('chosen:updated');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    } else {
        $('#reallocate_gdpi_form #venue_address').html('<option value="">Select address</option>');
        $('#reallocate_gdpi_form #gd_pi_date').html('<option value="">Select date</option>');
        $('#reallocate_gdpi_form #gd_pi_panel_number').html('<option value="">Select panel</option>');
        $('#reallocate_gdpi_form #gd_pi_time_slot').html('<option value="">Select slot</option>');
        $('.chosen-select').chosen();
        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        $('.chosen-select').trigger('chosen:updated');
    }
}


function reallocateGdpi(collegeId,formId,userId){
    $(".error").html("");
    $('#reallocateGdpiMessageDiv').html('');
    var gdpi_slot   = $.trim($("#reallocate_gdpi_form #gd_pi_time_slot").val());
    var gdpi_date   = $.trim($("#reallocate_gdpi_form #gd_pi_date").val());
    var gdpi_panel  = $.trim($("#reallocate_gdpi_form #gd_pi_panel_number").val());
    var gdpi_address = $.trim($("#reallocate_gdpi_form #venue_address").val());
    var gdpi_venue  = $.trim($("#reallocate_gdpi_form #gdpi_venue").val());
    var error_flag = 0;
    if(typeof collegeId == 'undefined' || collegeId == '' || typeof formId=='undefined' || formId == '' || typeof userId == 'undefined' || userId == ''  ){
        $('#reallocateGdpiModal').modal('hide');
        alertPopup('Please refersh page and try again','error');
    }
    if(gdpi_venue == ''){
        error_flag = 1;
        $("#gdpi_venue_span").html("Please select venue");
    }
    if(gdpi_address == ''){
        error_flag = 1;
        $("#gdpi_address_span").html("Please select address");
    }
    if(gdpi_panel == ''){
        error_flag = 1;
        $("#gdpi_panel_span").html("Please select panel");
    }
    if(gdpi_slot == ''){
        error_flag = 1;
        $("#gdpi_slot_span").html("Please select slot");
    }
    if(gdpi_date == ''){
        error_flag = 1;
        $("#gdpi_date_span").html("Please select date");
    }
    if(error_flag == 0){
        $("#ConfirmPopupArea").css({'z-index':'120000'});
        $('#ConfirmMsgBody').html('Are you sure you want to Re-Allocate Gd-PI data for this student?');
        $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();
                $('#ConfirmPopupArea').modal('hide');
            var data = [];
            data = $('#reallocate_gdpi_form').serializeArray();
            data.push({name: "college_id", value: collegeId});
            data.push({name: "form_id", value: formId});
            data.push({name: "user_id", value: userId});

                $.ajax({
                    url: '/gdpi/reallocateGdpi',
                    type: 'post',
                    dataType: 'json',
                    data: data,
                    headers: {
                        "X-CSRF-Token": jsVars._csrfToken
                    },
                    beforeSend: function() {
                        showLoader();
                        $("#reallocate_btn").attr("disabled",'disabled');
                    },
                    complete: function() {
                        hideLoader();
                        $("#reallocate_btn").removeAttr("disabled");
                    },
                    success: function (json) {
                        if(json['redirect']){
                            location = json['redirect'];
                        }
                        if(json['error']){
                            $('#reallocateGdpiMessageDiv').html(json['error']);
                        }
                        else if(json['success']){

                            $('#reallocateGdpiModal').modal('hide');
                            alertPopup("Data has been sucessfully updated",'success');
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    }
                });
        });
    }
}


//hide DD Rejected option on application view
if($('#DDRejectedSelect').length > 0)
{
    if(typeof jsVars.ShowDDRejectedSelect == 'undefined')
    {
        $('#DDRejectedSelect').closest('div.col-md-4').hide();
    }
}

var CollegeWiseCreaterList;
var postedCreatedBy;
if(typeof jsVars.CollegeWiseCreaterList != 'undefined' && jsVars.CollegeWiseCreaterList!="")
{
    CollegeWiseCreaterList = $.parseJSON(jsVars.CollegeWiseCreaterList);
}

if(typeof jsVars.postedCreatedBy != 'undefined')
{
    postedCreatedBy = jsVars.postedCreatedBy;
}

//AutoReload Form Filter if College is selected
if(typeof jsVars.postedCollegeId != 'undefined')
{
    $(document).ready(function(){
        if($('#FilterApplicationForm select#Institute').length > 0)
        {
            $('#FilterApplicationForm select#Institute').trigger('change');
        }
        else if(typeof jsVars.postedFormId != 'undefined')
        {
            UpdateFormSelect(jsVars.AllFormList,jsVars.postedFormId);
        }


    });
}
$(document).on('change', '#FilterApplicationForms select#form_id', function () {
    if (this.value > 0)
    {
        $('#CreateLeadStartBtn').removeClass("display-none");
    } else
    {
        $('#CreateLeadStartBtn').addClass("display-none");
    }
//    if($(this).val()=='' || $(this).val()==0){
//        updatePaymentType();
//    }
});

//create offline leads
//$(document).ready(function(){
//    if($('#FilterApplicationForms').length>0){
//        $(document).on("change",'#Email,#Mobile',function(){
//            var CollegeId = $('select#college_id').val();
//            var FormId = $('select#form_id').val();
//            $('#CreateLeadForm #CollegeId').val(CollegeId);
//            $('#CreateLeadForm #FormId').val(FormId);
//            CreateLeadOffline('message');
//        });
//    }
//});

$(document).on('click', '#CreateLeadForm #CreateleadBtn', function () {
    if($('#FilterApplicationForms').length>0){
        var CollegeId = $('select#college_id').val();
        var FormId = $('select#form_id').val();
        $('#CreateLeadForm #CollegeId').val(CollegeId);
        $('#CreateLeadForm #FormId').val(FormId);
        CreateLeadOffline();
    }
});


function CreateLeadOffline(type)
{
    if(typeof type=='undefiend'){
        $("#CreateleadBtn").show();
    }
    $('.popup-span-error').remove();
    $.ajax({
        url: jsVars.CreateLeadOfflineUrl,
        type: 'post',
        data: $('#CreateLeadForm').serializeArray(),
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            hideLoader();
        },
        success: function (json)
        {
            if (json['redirect'])
            {
                location = json['redirect'];
            } else if (json['error'])
            {
                for (var key in json.error)
                {
                    //$("#" + key).parents("div.form-group").addClass("padding-bottom-25 has-error");
                    $("#" + key).parents("div.form-group").addClass("has-error").attr('style','padding-bottom:0px');
                    $("#" + key).next("span.help-block").text('');
                    $("#" + key).after('<span class="popup-span-error" style="color:#f44336">'+json.error[key]+'</span>');
                    $("#" + key).focus();
                }
                if(json.form_status=='Incomplete' && typeof type=='undefined'){
                    $("#CreateleadBtn").show();
                    location = json['location'];
                }
                if(json.form_status=='Incomplete'){
                    $("#CreateleadBtn").show();
                }
            } else if (json['success'] == 200)
            {
                location = json['location'];
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            hideLoader();
        }
    });

}
/************application manager new *****************/
$(document).ready(function () {
    //$('#payment_status').SumoSelect({placeholder: 'Payment Status', okCancelInMulti:true, search: true, searchText:'Payment Status', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
    if ($('#payment_date').length > 0) {
        LoadReportDateRangepicker();
    }
    $('.filterCollasp').unbind('click');
    $('.filterCollasp').on('click', function(e) {
        if($(this).parent().hasClass('active')) {
            $('.filterCollasp').parent().removeClass('active');
        } else {
            $('.filterCollasp').parent().removeClass('active');
            $(this).parent().addClass('active');
        }
        e.preventDefault();
    });
    hitPopupBatchBind();

});

function SetHiddenAdvdata(adv_column, adv_value){
     $('#adv_column').val(adv_column);
     $('#adv_value').val(adv_value);
     //$('#if_record_exists').fadeIn();
     LoadMoreApplication('adv_filter');
}


function checkBulkCommunicatePermission(){
    $("#leadReassignMessageDiv").html("");
    $.ajax({
        url: jsVars.checkBulkCommunicatePermissionLink,
        type: 'post',
        data: {'collegeId':$("#college_id").val(), 'formId':$("#form_id").val(), 'stage':$("#fd\\|application_stage").val(), moduleName:'application'},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            $('#leadReassignModal').modal('hide');
            hideLoader();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1 && responseObject.data.permission==true){
                $("#li_bulkCommunicationAction").show();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText,'error');
        }
    });
}

var applicationJsVar = {
    selectAllAvailableRecords: function (totalAvailableRecords) {
        if($('#select_page_users').is(":checked")===false){
            $('#select_page_users').trigger('click');
        }
        $("#selectionRow").show();
        $("#selectAllAvailableRecordsLink").hide();
        $("#clearSelectionLink").show();
        $("#currentSelectionMessage").html("All "+totalAvailableRecords+" applications are selected.");
        $('#select_all').each(function(){
            this.checked = true;
        });
        // $('.select_application').attr('checked',true);
    }
};

function clearSelection(){
    $("#selectionRow").hide();
    $("#selectAllAvailableRecordsLink").hide();
    $("#clearSelectionLink").hide();
    $('.select_application').attr('checked',false);
    $('#select_page_users').attr('checked',false);
    $('#select_all').attr('checked',false);
}

function selectAllApplications(elem){
    showLoader();
    $("#selectionRow").hide();
    $("#clearSelectionLink").hide();
    $('#select_all').attr('checked',false);
    if(elem.checked){
        //console.log(elem.checked);
        $("#selectAllAvailableRecordsLinkSpan").html('<a id="selectAllAvailableRecordsLink" href="javascript:void(0);" onclick="applicationJsVar.selectAllAvailableRecords('+ $("#all_records_val").val() +');"> Select all <b>'+ $("#all_records_val").val() +'</b>&nbsp;applications</a>');
        $('.select_application').each(function(){
            this.checked = true;
        });
        var recordOnDisplay = $('input:checkbox[name="selected_users[]"]').length;
        $("#currentSelectionMessage").html("All "+recordOnDisplay+" applications on this page are selected. ");
        $("#selectionRow").show();
        $("#selectAllAvailableRecordsLink").show();
        $("#clearSelectionLink").hide();
        $('#li_bulkCommunicationAction').show();
    }else{
        $('.select_application').attr('checked',false);
        $("#selectAllAvailableRecordsLink").hide();
        $('#li_bulkCommunicationAction').hide();
    }

    hideLoader();
}

$(document).on('click', '.select_application',function(e) {
    var recordOnDisplay = $('input:checkbox[name="selected_users[]"]').length;
    var selected_records = $('.select_application:checked').length;
    $('#select_page_users').attr('checked',false);
    $('#select_all').attr('checked',false);
    if(selected_records<1){
        $("#selectionRow").hide();
        $("#selectAllAvailableRecordsLink").hide();
        $("#clearSelectionLink").hide();
        $('#li_bulkCommunicationAction').hide();
    }else{
        var display_message = selected_records+" applications on this page are selected. ";
        if(selected_records == recordOnDisplay){
            display_message = "All "+selected_records+" applications on this page are selected. ";
            $('#select_page_users').attr('checked',true);
            $('#select_page_users').trigger('click');
        }
        $("#selectionRow").show();
        $("#currentSelectionMessage").html(display_message);
        $("#selectAllAvailableRecordsLinkSpan").html('<a id="selectAllAvailableRecordsLink" href="javascript:void(0);" onclick="applicationJsVar.selectAllAvailableRecords('+ $("#all_records_val").val() +');"> Select all <b>'+ $("#all_records_val").val() +'</b>&nbsp;applications</a>');
        $("#selectAllAvailableRecordsLink").show();
        $("#clearSelectionLink").hide();
        if(selected_records>1){
            $('#li_bulkCommunicationAction').show();
        }
    }
    // $('#select_page_users').attr('checked',false);
});

$("#college_id").change(function(){
    $("#selectionRow").hide();
});

function checkMarkAsPaymentApprovedFilter(){
    var flag = 0;
    $('.block-repeat').each(function(i,val){
        if(i === 0){
            var paymentMethod = '';
            var paymentStatus = '';
            var andCondition = $("[name='application_advance_filter[0][condition]']:checked").val();
            $('.condition_div').each(function(i,val){
                var fieldName = $(this).find('.sel_field').val();
                if(fieldName.indexOf("ap|payment_method||") !== -1 && (paymentMethod === '' || paymentMethod === '1')){
                    var fieldType = $(this).find('.sel_type').val();
                    var fieldValue = $(this).find('.sel_value').val();
                    if(fieldType === 'eq' && fieldValue == 'offline'){
                        paymentMethod = '1';
                    }else{
                        paymentMethod = '0';
                    }
                }
                if(fieldName.indexOf("ap|payment_status||") !== -1 && (paymentStatus === '' || paymentStatus === '1')){
                    var fieldType = $(this).find('.sel_type').val();
                    var fieldValue = $(this).find('.sel_value').val();
                    if(fieldType === 'eq' && fieldValue == 'payment_pending'){
                        paymentStatus = '1';
                    }else{
                        paymentStatus = '0';
                    }
                }
            });
            if(andCondition === 'and' && paymentMethod === '1' && paymentStatus === '1'){
                flag = 1;
            }
        }else{
            flag = 0;
        }
    });
    return flag;
}
var ajaxStatus_LoadMoreApplication='ready';
function LoadMoreApplication(type,module) {
    if(ajaxStatus_LoadMoreApplication=='not_ready'){
        return false;
    }
    $(".lead_error").html('');
    $('#table-view').show();
    $('#push_application').hide();
    $("#search-field-error").hide();
    if($('#college_id').val() == '' || $('#college_id').val() == '0' ){
        $('#college_error').html('<small class="text-danger">Please Select Institute</small>');
        $('#load_msg_div').show();
        $('#load_more_results').html("");
        $('#if_record_exists').hide();
        $('#load_more_button').hide();
        $('#load_msg').html('Please select an Institute Name from filter and click apply to view Applications.');
        return false;
    }
    if (type === 'reset') {
        if(typeof module === 'undefined' || module !== 'sorting'){
            $("#sort_options").val('');
        }
        if($('#college_id').val()>0){
            if($.trim($('#search_common').val()) !== '') {
//                if(typeof jsVars.maximumEmailMobileSearch !== 'undefined') {
//                    var splitText = $.trim($('#search_common').val()).split(',');
//                    if(splitText.length > jsVars.maximumEmailMobileSearch) {
//                        alertPopup('Maximum search length is ' + jsVars.maximumEmailMobileSearch,'error');
//                        return false;
//                    }
//                }
                var splitText = $.trim($('#search_common').val()).split(',');
                if($('#college_id').val() == 4000) {
                    if(splitText.length > 2000) {
                        alertPopup('Maximum search length is 2000','error');
                        return false;
                    }
                } else {
                    if(splitText.length > 1000) {
                        alertPopup('Maximum search length is 1000','error');
                        return false;
                    }
                }
                if($.trim($('#search_by_field').val()) == '') {
                    $("#search-field-error").text("Please select field");
                    $("#search-field-error").show();
                    $('#advanceFilter').removeClass('active');
                    return false;
                } else {
                    $("#search-field-error").text("");
                    $("#search-field-error").hide();
                }
            }

            if($("#form_stage").val() == ''){
                var errorFlag = 0;
                $('input[name="column_create_keys[]"]:checked').each(function () {
                    if ($(this).val().match(/^fsd\|deadline_date/)) {
                        alertPopup('Please select Form Stage first','error');
                        errorFlag = 1;
                        return false;
                    }
                });
                if(errorFlag === 1){
                    return false;
                }
            }
        }

        graphMakeDisabledFields('all');
        Page = 0;
        is_filter_button_pressed = 1;
        $('#load_more_results').html("");
        $('#load_msg').html("");
        $('#load_msg_div').hide();
        $('#load_more_button').show();
        $('#adv_column').val("");
        $('#adv_value').val("");
        $('#load_slider_data').html("");
        clearSelection();
//        $('#load_more_button').html("Loading...");
        $('#view_by').val('');
        $('button[name="search_btn"]').attr('disabled','disabled');
        // if offline and payment pending is selected then show pushApplication button

        if(parseInt($('#form_id').val())>0 && $('[name="filter[ap|payment_method]"]').val()=='offline' && $('#payment_status').val()=='payment_pending'){
            $('#push_application').show();
        }
        if(parseInt($('#form_id').val())>0){
            var pushApplication = checkMarkAsPaymentApprovedFilter();
            if(pushApplication === 1){
                $('#push_application').show();
            }
            getCSVMappingList();
        }
        //$('.chosen-select').chosen();
        //$('.chosen-select-deselect').chosen({allow_single_deselect: true});
        if(jsVars.counsellorOrStaffUser){
            $("#li_bulkCommunicationAction").hide();
            if(parseInt($("#form_id").val()) > 0){
                checkBulkCommunicatePermission();
            }
        }
        currentCounsellorId     = jsVars.counsellorId;
//        if($("#councellor_id").length && $("#councellor_id").val()!==""){
//            currentCounsellorId    = $("#councellor_id").val();
//        }

        //get cousellor id from filter if only one counsellor is selected
        var filterCounsellorId = getSelectedCounsellorId();
        if(filterCounsellorId !== "" && filterCounsellorId !== 0 ){
            currentCounsellorId    = filterCounsellorId;
            $("#bulk_reassign").show();
        }else{
            $("#bulk_reassign").hide();
        }
        //if( currentCounsellorId!==""){
//        if($("#councellor_id").length && $("#councellor_id").val()!==""){
//            $("#bulk_reassign").show();
//        }else{
//            $("#bulk_reassign").hide();
//        }
        $('li.customListClass').remove();
    }
    else if (type == 'adv_filter') {
        Page = 0;
        $('#load_more_results').html("");
        $('#load_msg').html("");
        $('#load_msg_div').hide();
        $('#load_more_button').show();
//        $('#load_more_button').html("Loading...");
        $('li.customListClass').remove();
    }
    if(typeof jsVars.showBulkReAssignButton !== "undefined" && (jsVars.showBulkReAssignButton == true)){
        $("#bulk_reassign").show();
    }
    //Below line of code will check if page no is 0 and form id and standard list both are selected then display error message
    if(Page==0) {
        if($('#standard_list_id').length == 1 && $('#div_load_forms #form_id').val() > 0) {
            $('#load_msg_div').show();
            $('#load_msg').html('Please select an Institute Name from filter and click apply to view Applications.');
            $('#load_more_button, #single_lead_add').hide();
            $('button[name="search_btn"]').removeAttr('disabled');
            return false;
        }
    }

    $('#export').remove();

    //show/hide upload single lead btn
    if($('#CreateLeadStartBtn').length > 0)
    {
        $('#CreateLeadStartBtn').hide();
        if(($('#college_id').val() > 0) && ($('#form_id').val() > 0))
        {
            $('#CreateLeadStartBtn').show();
        }
    }


    var data = $('#FilterApplicationForms').serializeArray();
    downloadRequestPopupMessage('applications',data[20]['value']);
    if(type=='total_record') {
        data.push({name: "type", value: type});
        data.push({name: "page", value: 0});
    }else{
        data.push({name: "page", value: Page});
    }
    // $('ul#column_li_list .column_create_keys').each(function(){
    //     if($(this).is(':checked')){
    //         data.push({name: "column_create_keys[]", value: $(this).val()});
    //     }
    // });

    $('input[name="column_sorting_order[]"]').each(function(){
        data.push({name: "column_create_keys[]", value: $(this).val()});
    });

    $('#list_view_fields_selected').val($('#realignment_order').val());

    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;&nbsp;Loading...');
    $('#seacrhList,#create_view_apply').attr('disabled', 'disabled').html('Applying&nbsp;<i class="fa fa-spinner fa-spin"></i>');
    $.ajax({
        url: '/applications/ajax-lists',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: data,
        beforeSend: function (xhr) {
//           showLoader();
            ajaxStatus_LoadMoreApplication  = 'not_ready';
            $(".expandableSearch .btn-default").prop("disabled",true);
            if($('#college_id').val()==526){
                if(type=='total_record'){
                    $('#count-skeleton').show();
                    $('.itemsCount').hide();
                }
            }
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        async:true,
        success: function (data) {
            //hard coded for HCL
            if($('#college_id').val()==526){
                if(type=='total_record') {
                    $("#tot_records").text("Total "+data+" Records");
                    $("#all_records_val").val(data);
                }else if(type=='reset'){
                    $("#tot_records").text("");
                    $("#all_records_val").val();
                }
            }
            var checkError  = data.substring(0, 12);
            //$('button[name="search_btn"]').removeAttr('disabled');
             $(".expandableSearch .btn-default").prop("disabled",false);
            ajaxStatus_LoadMoreApplication = 'ready';
            $('#seacrhList,#create_view_apply').removeAttr('disabled').html('Apply');
            $('#addRemoveColumnModal').modal('hide');

            Page = Page + 1;
            if (data === "session_logout") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (data === "search_mandatory") {
                    $('#load_msg').html('Please Search Applications.');
                    $('#load_msg_div').show();
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Applications");
                    $('#load_more_button').hide();
					if ($(window).width() < 992) {
						filterClose();
					}
            }
            else if (data === "error") {
                if(Page==1){
                    $('#load_msg').html('No Applications found');
                    $('#load_msg_div').show();
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Applications");
                    $('#load_more_button').hide();
					if ($(window).width() < 992) {
						filterClose();
					}
                }else {
                    $('#load_msg').html('');
                    $('#load_msg_div').hide();
                    $('#load_more_button').html("<i class='fa fa-database' aria-hidden='true'></i>&nbsp;No More Applications");
                    $('#load_more_button').show();
                }
                if (type != '' && Page==1) {
                    $('#if_record_exists').hide();
                    $('#single_lead_add').hide();
                }
            }else if (data === "select_college") {
                $('#load_msg_div').show();
                $('#load_msg').html("Please select an Institute Name from filter.");
                $('#load_more_results').html("");
                $('#load_more_button').hide();
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Applications");
                 if (type != '') {
                        $('#if_record_exists').hide();
                 }

            }else if (data === "select_stage") {
                $('#load_msg_div').show();
                $('#load_msg').html('Please select Form Stage first.');
                $('#load_more_results').html("");
                $('#load_more_button').hide();
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Applications");
                if (type != '') {
                       $('#if_record_exists').hide();
                }
            }else if (checkError === "error_filter") {
                $('#load_msg_div').show();
                $('#load_msg').html('Please check condition in Filter.');
                $('#load_more_results').html("");
                $('#load_more_button').hide();
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Applications");
                var errorString  = data.substring(14);
                errorStringArray =  errorString.split('_');
                $('#errorlead_'+errorStringArray[0]+'_'+errorStringArray[1]).show().html('<small class="text-danger">Either remove the condition or select a value</small>');
                filterOpen();
            }else if(data === "select_resubmit_logic"){
                $('#load_msg_div').show();
                $('#load_msg').html('No Applications found');
                $('#load_more_results').html("");
                $('#load_more_button').hide();
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Applications");
                alertPopup('To view the Re-Submit Application details, you first need to select filter for Re-Submit Application Logic.', 'error');
                if($('#ErroralertTitle').length>0){
                    $('#ErroralertTitle').html('Notification');
                }
                if (type != '') {
                       $('#if_record_exists').hide();
                }
            }else {
                if (type === 'reset') {
                    $('#load_more_results').html("");

                    if($('#college_id').val()==526){
                        setTimeout(function(){ LoadMoreApplication('total_record'); }, 2000);
                    }
                }

                //For Single Lead Button
                if(parseInt($('#form_id').val())>0){
                    $('#single_lead_add').fadeIn();
                }else{
                    $('#single_lead_add').hide();
                }

                data = data.replace("<head/>", '');
                //console.log(data);
                $('#load_more_results').parent().removeClass('hide');
                if(Page==1){
                        $('#load_more_results').append(data);
                }else{
                    if(type!='total_record') {
                        $('#load_more_results > tbody').append(data);
                    }
                }

                $('.itemsCount').show();

                if($('#college_id').val()==526){
                    if(type=='reset') {
                        $("#select_page_users").attr("disabled", true);
                        $("#ambulkactiondivid").hide();
                        $("#ampagelistingcountid").hide();
                        $("#amhidesearch").hide();
                    }else{
                        $("#select_page_users").removeAttr("disabled");
                        $("#ambulkactiondivid").show();
                        $("#ampagelistingcountid").show();
                        $("#amhidesearch").show();
                    }
                    if(type=='total_record'){
                        $('.itemsCount').show();
                        $('#count-skeleton').hide();
                    }
                }

                $('#load_msg_div').hide();
				filterClose();
                //alert($('#items_no_show_chosen > a > span').html());
                var ttl = $('#current_record').val();
                if(parseInt(ttl) < 10){
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Applications");
                    $('#load_more_button').hide();
                }else{
                    $('#load_more_button').removeAttr("disabled");
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Applications");
                }

                if (type != '') {
                    $('#if_record_exists').fadeIn();
                }

                //$.material.init();
                table_fix_rowcol();
				dropdownMenuPlacement();
                //determineDropDirection();
                if($('#select_page_users:checked').length>0 && $('#select_all:checked').length<1){
                    var recordOnDisplay = $('input:checkbox[name="selected_users[]"]').length;
                    $("#currentSelectionMessage").html("All "+recordOnDisplay+" applications on this page are selected. ");
                }


                // Add dynamic Height on Table for thead Fix
//					var windowHeight = jQuery(window).height() - 275;
//					jQuery('#parent').css('max-height', windowHeight);

                if(Page == 1 && $('#data-tab-container').length) {
                    var snapshot_options = $('#form_id').html();
                    $('#snapshot-form-list').html(snapshot_options);
                    $('#snapshot-form-list').val($('#snapshot-form-list option:nth-child(2)').val());
                    $('#snapshot-form-list').trigger('chosen:updated');
                    makeScrollable();

                    $(".trigerTableView").on('click', function () {
                        $('#snapshot-view').removeClass('active');
                        $('#snapshot-view').parent().removeClass('active');
                        $("#table-view").addClass('active');
                        $("#table-view").parent().addClass('active');
                        $('#table-data-view').show();
						$('.mobDropCorg').show();
                        $('#snapshot-data-view').hide();
                        graphMakeDisabledFields('show');
                        $('#for-snapshot').removeClass('disableArea');
                        $('#for-snapshot .label_snapshot').hide();
//                        $( "#table-view").trigger("click");
                    });
                }
            }
            if($('[data-toggle="popover"]').length > 0){
                $('body').on('click', function (e) {
                    $('[data-toggle="popover"]').each(function () {
                        //the 'is' for buttons that trigger popups
                        //the 'has' for icons within a button that triggers a popup
                        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                            $(this).popover('hide');
                        }
                    });
                });
                $('[data-toggle="popover"]').popover();
            }
            $('[data-toggle="tooltip"]').tooltip();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function () {
            hideLoader();
        }
    });
    return false;
}

function removeConditionFormFlowFilter(){
    $("#fsd\\|deadline_date,#fsd\\|step_status").parent().parent().remove();
}
 //on form changes
 $(document).on('change','#FilterApplicationForms select#form_id', function (){
    $('.columnApplicationCheckAll').removeClass('checked');
    $('.columnApplicationCheckAll').attr('checked', false);
    $(".div_filter_application").remove();//form level filter updated on form changes
    removeConditionFormFlowFilter();
   getformFilterCols(this.value);
});

function resetFormRelatedData(){
    var formId = $('#FilterApplicationForms select#form_id').val();
    $('.columnApplicationCheckAll').removeClass('checked');
    $('.columnApplicationCheckAll').attr('checked', false);
    $(".div_filter_application").remove();//form level filter updated on form changes
    removeConditionFormFlowFilter();
    getformFilterCols(formId, 'resetFilter');
};


function getformFilterCols(formid , callFrom){
    $('.div_form').remove();
    if($('#college_id').length>0 && $('#college_id').val()>0){
        filterColumnOptionsCollegeApplication($('#college_id').val(),formid, callFrom);
    }

    if(parseInt($('#form_id').val())>0){

    }else{
        $('#single_lead_add').hide();
    }
}


//update means reload default payment type.
//function updatePaymentType(){
//    $('#FilterApplicationForms select#payemnt_type').html('<option value="" selected>Payment Type</option><option value="postpaid">Post-payment</option><option value="prepaid">Pre-payment</option><option value="midpayment">Mid-payment</option>');
//}
function getFormStages(elem){
    var form_id=elem;
    $.ajax({
        url: '/applications/formstage',
        type: 'post',
        dataType: 'json',
        data: {
            "form_id": form_id
        },
        beforeSend: function () {  showLoader(); },
        complete: function () { hideLoader(); },
        async:true,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                window.location.href= json['redirect'];
            }else if (typeof json['status'] != 'undefined' && json['status'] == 200) {
                if(typeof json['stage_list'] != 'undefined'){
                    $('#form_stage').html('');
                    $('#form_stage').html(json['stage_list']);
                    $('.chosen-select').trigger('chosen:updated');
                }
                if(typeof json['payment_type'] != 'undefined'){
                    $('#payemnt_type').html('');
                    $('#payemnt_type').html(json['payment_type']);
                    $('.chosen-select').trigger('chosen:updated');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


/**
 * on college change load all filter and column
 * @param {type} college_id
 * @param {type} form_id
 * @param {type} callFrom
 * @returns {Boolean}
 */
function filterColumnOptionsCollegeApplication(college_id,form_id, callFrom,onlyColumns){
    if(typeof form_id === 'undefined'){
        form_id = 0;
    }
    if(typeof callFrom === 'undefined'){
        callFrom = '';
    }
    if(typeof onlyColumns === 'undefined' && onlyColumns!=='1'){
        checkCollegeConfigRegistration(college_id, callFrom);
    }
    $('#seacrhList').attr('disabled', 'disabled').html('Applying&nbsp;<i class="fa fa-spinner fa-spin"></i>');
    $('#filterLoader').show();
    var asyncVal = true;
    if(callFrom === 'changeCollege'){
        asyncVal = false;
    }else if(callFrom === 'resetFilter'){
        asyncVal = false;
    }
    var applicable_for = '';
    if(form_id>0){
        applicable_for = 'onlyCrop';
    }
    $.ajax({
        url: '/applications/filter-column-options-college-application',
        type: 'post',
        dataType: 'json',
        data: {'college_id':college_id,'form_id':form_id,'applicable_for':applicable_for},
        async:asyncVal,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () {  showFilterLoader(); },
        complete: function () { hideFilterLoader(); },
        success: function (json) {
            if (typeof json['redirect'] !== 'undefined' && json['redirect'] !== "") {
                window.location.href= json['redirect'];
            }
            else if (typeof json['status'] !== 'undefined' && json['status'] === 200) {
                $('ul#column_li_list').html('');
                $('ul#column_li_list').html(json['column']);
                /** Realignment Columns **/
                $("#realignment_order").val(json['default_column_list']);
                createDefaultSortable(json['default_column_list'],'reset');
                if( typeof onlyColumns!=="undefined" && onlyColumns === '1'){
                    return;
                }
                if(callFrom !== 'changeCollege'  ){
                    getSavedFilterList(college_id,'application','smart_view','smart_view_li_list');
                }
                addDataAttribute();


               /****filter**********/
                if(callFrom !== 'renderSavedFilter'){
                    var myJSON = JSON.stringify(json['filterArray']);
                    getAdvanceFilterOptions(myJSON,callFrom);
                }

                $('#payment_mode').html(json['payment_method']);
                $('.chosen-select').trigger('chosen:updated');
                $('.filterCollasp').unbind('click');
                $('.filterCollasp').bind('click', function(e) {
                    e.preventDefault();
                });


                $('#seacrhList').removeAttr('disabled').html('Apply');
                $('#filterLoader').hide();
                if(college_id){
                    $(".filterAdvance").show();
                }else{
                    $(".filterAdvance").hide();
                }
                dependentFieldSelection();


                //Handle Special cases for Application Stage When form will change
                if($('ul.filter_miscellaneous').find('[data-filter_value="fd\\|application_stage"]').length) {
                    if($('div.div_filter_miscellaneous').find('#fd\\|application_stage').length) {
                        var applicationStage = $('ul.filter_miscellaneous').find('[data-filter_value="fd\\|application_stage"]').val();
                        if(applicationStage != '') {
                            var splitValue = applicationStage.split('||');
                            if(typeof splitValue[2] !== 'undefined') {
                                var html = '';
                                var obj_json = JSON.parse(splitValue[2]);
                                for (var key in obj_json) {
                                    var value   = obj_json[key];
                                    html += "<option value=\"" + key + "\">" + value + "</option>";
                                }
                            }
                            $('#fd\\|application_stage').html(html);
                            $('#fd\\|application_stage')[0].sumo.reload();
                        }
                    }
                }

                //Call this function incase of college Admin/College Staff
                if (typeof jsVars.s_college_id != 'undefined' && parseInt(jsVars.s_college_id) >0) {
                    //NPF-5793
//                    LoadMoreApplication('reset');
                }
                //$("#filter_elements_html").html('');

                //For Registration Dependent
                if (typeof json['registrationDependentField'] !== 'undefined' && json['registrationDependentField'] != '') {
                    dependentDropdownFieldList = json['registrationDependentField'];
                }
                if (typeof json['showSlotBookingAction'] !== 'undefined' && json['showSlotBookingAction'] == 1) {
                    $("#FilterApplicationForms #li_assign_slot").show();
                } else {
                    $("#FilterApplicationForms #li_assign_slot").hide();
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

function createFilterApplication() {
    $('#filter_elements_html').html('');
    var col_class = 4;
    var i=0;
    var isDistrictPresent = false;

    //var InputId     = $(currentObj).attr('id');
    $('input[name="filter_create_keys[]"]:checked').each(function () {
        if($(this).data('input_id') == 'district_id'){
            isDistrictPresent = true;
        }
    });

    $('input[name="filter_create_keys[]"]:checked').each(function () {
        if($(this).data('input_id') == 'state_id' && isDistrictPresent == true){
            $(this).data('isDistrictPresent', 'district_exist');
        }
        createInputApplication(this,col_class,++i);
    });

    /**
    * Create extra data attribute in filter because from now onwards admin can save the filter
    */
    $('#filter_li_list li input[type="checkbox"]').each(function () {
       var value=$(this).val();
       var exp_data=value.split('||');
       if(typeof exp_data[0] !== 'undefined' && exp_data[0] !='') {
           $(this).attr('data-filter_value',exp_data[0]);
       }
    });

    return false;
}

function createInputApplication(currentObj,col_class,ii){
    var formID = $('#form_id').val();
    var isDistrictPresent = $(currentObj).data('isDistrictPresent');
    var labelname   = $(currentObj).data('label_name');
    var InputId     = $(currentObj).attr('id');
    var key_source  = $(currentObj).data('key_source');
    var childId  = $(currentObj).data('child');
    var value_field = $(currentObj).val();
    var arr         = value_field.split("||");
    var html        = '';
    var paymentStatus        = '';
    var paymentMethod        = '';
    var type        = "";
    var class_date = '';
    var customDateFormats = [];
    var fieldLabelmapping = {'ud|country_id':"Country", 'ud|course_id':"Course",'ud|university_id':"Campus",'ud|district_id':"District"};

    if (arr.length > 2) {
        var type = arr[1];
        var val_json = arr[2];
        var html_field_id = '';
        // for not break ajax on created by, ID CreatedBySelect
        if(arr[0].match(/created_by/i)){
            html_field_id = 'CreatedBySelect';
        }
//        else if(arr[0].match(/ud\|city_id/i)){
//            html_field_id = 'registerCityID';
//        }
        else{
            html_field_id = arr[0];
        }

        var multi_select_city = $("#multi_select_city").val();
        var sls = false;
        var SumoSelect = "";

        if (type == "dropdown" || type == "predefined_dropdown" || type == "select") {
            var dataLabel = '';
            if(typeof $(currentObj).data('label') !== 'undefined') {
                dataLabel = $(currentObj).data('label');
            }

            var multivalue = $(currentObj).data('multivalue');//sumo drop down
            if(multivalue){
                multivalue = "multiple='multiple'";
            }else if(((html_field_id == 'permanent_city') || (html_field_id == 'correspondence_city') ||  ('ud|city_id' == html_field_id)) && (multi_select_city=='yes')){
               multivalue = "multiple='multiple'";
            }
            var college_id  = $('#FilterApplicationForms select#college_id').val();
            var form_id     = $('#FilterApplicationForms select#form_id').val();

            if(typeof childId!='undefined' && childId!=''){
                if(typeof key_source !== 'undefined' && key_source == 'filter_registration') { //For DYnamic College Registration Field
                    dependentFieldId = html_field_id;
                    if(typeof $(currentObj).data('registrationdependent') !== 'undefined') {
                        dependentFieldId = $(currentObj).data('registrationdependent');
                    }
                    var dataLabel = '';
                    if(typeof $(currentObj).data('label') !== 'undefined') {
                        dataLabel = $(currentObj).data('label');
                    }
                    html = "<select data-key_source="+InputId+" onchange = \"return GetChildByMachineKey(this.value, '"+childId+"','','','',true);\" class='chosen-select' name='filter[" + arr[0] + "]' id='"+dependentFieldId+"' data-label='"+dataLabel+"'>";
                } else {
                    html = "<select data-key_source="+InputId+" onchange = \"return loadDependentChildCategory('"+html_field_id+"', '"+childId+"', '',"+formID+");\" class='chosen-select' name='filter[" + arr[0] + "]' id='"+html_field_id+"'>";
                }
            }
            else if('ud|state_id' == html_field_id ){

                if(isDistrictPresent == 'district_exist'){
                    html = "<select data-key_source="+InputId+" onchange = 'return GetChildByMachineKey(this.value,\"DistrictId\",\"District\","+college_id+");' class='chosen-select' name='filter[" + arr[0] + "]' id='StateId'>";
                }else{
                    html = "<select data-key_source="+InputId+" onchange = 'return GetChildByMachineKey(this.value,\"CityId\",\"City\","+college_id+");' class='chosen-select' name='filter[" + arr[0] + "]' id='StateId'>";
                }
            }else if('ud|district_id' == html_field_id ){
                html = "<select data-key_source="+InputId+" onchange = 'return GetChildByMachineKey(this.value,\"CityId\",\"City\","+college_id+");' class='chosen-select' name='filter[" + arr[0] + "]' id='DistrictId'>";
            }else if('ud|country_id' == html_field_id){
                html = "<select data-key_source=" + InputId + " class='chosen-select' name='filter[" + arr[0] + "]' id='CountryId' onchange = 'return GetChildByMachineKey(this.value,\"StateId\",\"State\");'>";
            } else if(('ud|city_id' == html_field_id ) && (multi_select_city=='yes')){
                 html = "<select data-key_source=" + InputId + " class='form-control multi-dynamic commonSummoReload' multiple='multiple' name='filter[" + arr[0] + "][]' id='CityId'>";
            }else if('ud|city_id' == html_field_id){
                html = "<select data-key_source=" + InputId + " class='chosen-select' name='filter[" + arr[0] + "]' id='CityId'>";
            }else if ('pub|publisher_id' == html_field_id) {
                html = "<select data-key_source=" + InputId + "  class='chosen-select publisher_filter' name='filter[" + arr[0] + "]' id='publisher_filter'>";
            }else if ('u|traffic_channel' == html_field_id) {
                html = "<select data-key_source=" + InputId + "  class='chosen-select traffic_channel' name='filter[" + arr[0] + "]' id='traffic_channel'>";
            }else if ('u|registration_instance' == html_field_id) {
                html = "<select data-key_source=" + InputId + "  class='chosen-select registration_instance' name='filter[" + arr[0] + "]' id='registration_instance'>";
            }
            else if('ud|career_utsav_id' == html_field_id){
                SumoSelect = 'CareerUtsavId';
                html = "<select data-key_source='" + InputId + "' class='form-control' name='filter[" + arr[0] + "][]' id='CareerUtsavId' multiple='multiple'>";
            }
            else if('ap|payment_status' == html_field_id){
                html = '';
            }else if('ap|payment_method' == html_field_id){
                html = '';
            }else if('gdpi_center' == html_field_id){
                html = "<select data-key_source="+InputId+" class='chosen-select' onchange = 'return getGdpiCentreConfig("+college_id+","+form_id+",this.value,\"application\");' name='filter[" + arr[0] + "]' id='"+html_field_id+"'>";
            }else if('venue_address' == html_field_id){
                html = "<select data-key_source="+InputId+" class='chosen-select'  name='filter[" + arr[0] + "]' id='"+html_field_id+"'>";
            }else if((html_field_id == 'permanent_city' || html_field_id == 'correspondence_city') && (multi_select_city=='yes')){
             html = "<select data-key_source="+InputId+"  class='form-control multi-dynamic commonSumoReload' multiple='multiple' name='filter[" + arr[0] + "][]' id='"+html_field_id+"'>";
            }else if(multivalue){
                html = "<select data-key_source="+InputId+" class='form-control multi-dynamic' name='filter[" + arr[0] + "][]' id='"+html_field_id+"' multiple='multiple'>";
            }
            else if(html_field_id == 'correspondence_country' || html_field_id == 'correspondence_district' || html_field_id == 'correspondence_state' || html_field_id == 'permanent_country' || html_field_id == 'permanent_district' || html_field_id == 'permanent_state'){
                html = "<select data-key_source="+InputId+" onchange = 'return loadDependentChildCategory(this.id, dependent_field_id, selected_value,formId); getCityByStateCityPincode(this.value, \""+html_field_id+"\", "+college_id+");' class='chosen-select' name='filter[" + arr[0] + "]' id='"+html_field_id+"'>";
            }
            else if('ud|course_id' == html_field_id){
                html = "<select data-key_source="+InputId+" class='chosen-select' name='filter[" + arr[0] + "]' id='"+html_field_id+"' onchange = 'return GetChildByMachineKey(this.value,\"specialization_id\",\"Specialization\","+college_id+");' data-label='"+dataLabel+"' >";
            }
            else{

                //If RegistrationDependent Data key is exist then capture that and set in the id
                if(typeof $(currentObj).data('registrationdependent') !== 'undefined') {
                    html_field_id = $(currentObj).data('registrationdependent');
                }
                html = "<select data-key_source="+InputId+" class='chosen-select' name='filter[" + arr[0] + "]' id='"+html_field_id+"' data-label='"+dataLabel+"'>";
            }

            if(labelname === 'Specialisation'){
                labelname = "Specialization";
            }
            if(!multivalue && 's_lead_status' != html_field_id && 'show_campaigns_in' != html_field_id && 'ud|career_utsav_id' != html_field_id){
                html += '<option value="">' + labelname + '</option>';
                if($.inArray(html_field_id,['ud|country_id','ud|course_id','ud|university_id','ud|state_id']) >= 0 ){
                    html += '<option value="0">' + labelname + jsVars.notAvailableText +' </option>';
                }
            }
            obj_json = JSON.parse(val_json);
            if(html_field_id === 'u|traffic_channel' || html_field_id === 'u|lead_type'){
                var obj_array = [];
                for (var key in obj_json) {
                    obj_array.push({
                        key:key,
                        val:obj_json[key]
                    })
                }
                obj_json = obj_array.sort(function (a, b) {
                    return a.val.localeCompare( b.val );
                });
            }
            for (var key in obj_json) {
                //default select pri registration in registration instance
                var value   = obj_json[key];
                if(html_field_id === 'u|traffic_channel' || html_field_id === 'u|lead_type'){
                    value   = obj_json[key]['val'];
                    key     = obj_json[key]['key'];
                }
                var select= '';
                if(key=='pri_register_date'){
                    select = 'selected';
                }
                if('ap|payment_method' == html_field_id){
                    paymentMethod += "<option "+select+" value=\"" + key + "\">" + value + "</option>";
                }else if('ap|payment_status' == html_field_id){
                    paymentStatus += "<option "+select+" value=\"" + key + "\">" + value + "</option>";
                }else{
                    if(type == "predefined_dropdown"){
                        html += "<option "+select+" value=\"" + key +";;;"+value+ "\">" + value + "</option>";
                    }else{
                        html += "<option "+select+" value=\"" + key + "\">" + value + "</option>";
                    }
                }
            }
            html += "</select>";
            if(paymentStatus!=''){
                html = '';
                $('#payment_status').html('<option value="">Payment Status</option>'+paymentStatus);
            }
            if(paymentMethod!=''){
                html = '';
                $('#payment_mode').html('<option value="">Payment Method</option>'+paymentMethod);
            }
        } else if (type == "date") {
            var operator_sel=$(currentObj).val();
            var dateFormat = $(currentObj).data('date_format');
            var dateId = $(currentObj).data('date_id');

             if(dateFormat != '' && dateId !='' && dateFormat != 'DD/MM/YYYY'){
                class_date = dateId;
               var customDateObj = {
                    'class' : class_date,
                    'dateFormat' : dateFormat
                };

                customDateFormats.push(customDateObj);

            }else
            if(operator_sel.indexOf('ap|payment_end_date') !== -1 ||
                    operator_sel.indexOf('created||date') ||
                    operator_sel.indexOf('updated||date') ||
                    operator_sel.indexOf('u|created||')
                    ){
                if(ii%3==1){
                    // change class for every 1 or 2 position in a row
                    class_date = "daterangepicker_report_right";
                }else if(ii%3==2){
                    // change class for every 1 or 2 position in a row
                    class_date = "daterangepicker_report_center";
                }else{
                    class_date = "daterangepicker_report";
                }
            }else{
                class_date = "datepicker_report";
            }
            html = "<input type='text' data-key_source="+InputId+"  class='form-control " + class_date + "' name='filter[" + arr[0] + "]' value='' readonly='readonly' placeholder='" + labelname + "' id='"+html_field_id+"'>";
        }
        else if (type == "number_range") {//date
            html_field_id = html_field_id.replace("|", "_");
			if(ii%3==2){
                    // change class for every 1 or 2 position in a row
                    class_rangePos = "rengeleft";

			}else{
                    class_rangePos = "rengeright";
			}

            html    =

            '<input data-key_source=' +InputId+ '  class="form-control" value="" id="' + html_field_id + '" name="filter[' + arr[0] + ']" type="text" placeholder="' + labelname + '" onclick="rangeInput(\'' +html_field_id+ '\')" /> '+

            '<div id="rangeDiv'+html_field_id+'" class="rangeNumber '+class_rangePos+'">'+
            	'<div class="">'+
                    '<div class="col-md-5">'+
                        '<ul>'+
                            '<li class="opt" id="opt1'+html_field_id+'" data-operator=">">Greater Than</li>'+
                            '<li class="opt" id="opt2'+html_field_id+'" data-operator=">=">Greater Than or Equal to</li> '+
                            '<li class="opt" id="opt3'+html_field_id+'" data-operator="<">Less than</li>'+
                            '<li class="opt" id="opt4'+html_field_id+'" data-operator="<=">Less than or Equal to</li>'+
                            '<li class="opt" id="opt5'+html_field_id+'" data-operator="<>">Between (Inclusive)</li>'+
                            '<li class="opt" id="opt6'+html_field_id+'" data-operator="=">Equal to</li>'+
                        '</ul>'+
                     '</div>'+
                	'<div class="minMaxBox col-md-7">'+
                         '<div class="minMax">'+
                            '<div class="minField">'+
                                '<input id="min' +html_field_id+'" name="filter[' + arr[0] + '_min]" type="number" onkeypress="return isNumberKey(event)" placeholder="Minimum Value" disabled="true" /><br>'+
                            '</div>'+
                            '<div class="maxField">'+
                                '<input id="max'+html_field_id+'" name="filter[' + arr[0] + '_max]" type="number" onkeypress="return isNumberKey(event)" placeholder="Maximum Value" disabled="true" /><br>'+
                            '</div>'+
                            '<input id="operator' +html_field_id+'" name="filter[' + arr[0] + '_operator]" type="hidden" /><br>'+
                         '</div>'+
                          '<div class="text-center spaceLR10 filter-btns">'+
                                '<button id="search_btn'+html_field_id+'" type="button" class="btn btn-raised btn-sm filter-btn btn-apply center-btn">Apply</button>'+
                                '<button id="reset_btn'+html_field_id+'" type="button" class="btn btn-raised btn-sm filter-btn center-btn">Reset</button>'+
                           '</div>'+
                	'</div>'+
                 '</div>'+
            '</div>';

        }
        else {
            html = "<input type='text' data-key_source="+InputId+"  class='form-control' name='filter[" + arr[0] + "]' value='' placeholder='" + labelname.replace(/\\'/g, '&apos;') + "' id='"+html_field_id+"'>";
        }
    } else {
        html = "<input type='text' data-key_source="+InputId+" class='form-control' name='filter[" + arr[0] + "]' value='' placeholder='" + labelname.replace(/\\'/g, '&apos;') + "'>";
    }
    var multi_class = '';
    if(sls){
        multi_class = 'multiSelectBox';
    }
    // finally show the field in DOM
    if(html){
        var finalhtml;
        if(typeof type != "" && type == 'date') {
            html = '<div class="form-group formAreaCols dateFormGroup'+multi_class+'"><div class="iconDate"><i aria-hidden="true" class="fa fa-calendar-check-o"></i></div><div class="input text">' + html + '</div></div>';
            finalhtml = $('<div class="col-md-'+col_class+' div_'+key_source+'"></div>').wrapInner(html);
            $('#filter_elements_html').append(finalhtml);
        }
        else  {
            html = '<div class="form-group formAreaCols '+multi_class+'">' + html + '</div>';
            finalhtml = $('<div class="col-md-'+col_class+' div_'+key_source+'"></div>').wrapInner(html);
            $('#filter_elements_html').append(finalhtml);
        }

    }

    if(SumoSelect != "") {
        //onChange = 'getAreaOfInterestForList();' Common.js
        $('select#'+SumoSelect).SumoSelect({placeholder: 'Career Utsav Event', search: true, searchText:'Career Utsav Event', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
        $('select#CareerUtsavAreaId').SumoSelect({placeholder: 'Career Utsav Area of Interest', search: true, searchText:'Career Utsav Area of Interest', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
        $('select#SeminarPreferenceId').SumoSelect({placeholder: 'Seminar Preference Name', search: true, searchText:'Seminar Preference Name', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
        $('select#MockPreferenceId').SumoSelect({placeholder: 'Mock Preference Name', search: true, searchText:'Mock Preference Name', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });

        if(SumoSelect == 'CareerUtsavId') {
            $('select#'+SumoSelect).on('change', function() {
                getAreaOfInterestForList('lead',false);
            });
        }
    }else if(multivalue){
        $('select.multi-dynamic').SumoSelect({placeholder: labelname, search: true, searchText:labelname, captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
    }
    else {
        $('.chosen-select').chosen();
        $('.chosen-select').trigger('chosen:updated');
        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    }

    if (html_field_id == 'CreatedBySelect'){
        if($('#FilterApplicationForms select#college_id').val().length){
            if (typeof CollegeWiseCreaterList != "undefined" && $('#FilterApplicationForms select#college_id').val() in CollegeWiseCreaterList['CollegeWise'])
            {
                UpdateCreatedBySelect(CollegeWiseCreaterList['CollegeWise'][$('#FilterApplicationForms select#college_id').val()], postedCreatedBy);
            }
        }
    }

    if (type == "date") {
        LoadReportDatepicker(customDateFormats);
        LoadReportDateRangepicker();
    }
    if(sls){
        $('#s_lead_status').multiselect({
            numberDisplayed: 2
        });
    }
}
jQuery(function(){
    $('.filter_collapse').dropdown('toggle');
});
function filterApplication(element,listid) {
    var value = $(element).val().toLowerCase();
    var cols_count = 0;
    $("ul#"+listid+"  li ul li").each(function() {
        if ($(this).text().toLowerCase().search(value) > -1) {
            $(this).addClass('active').show();
            cols_count++;
        }
        else {
            $(this).removeClass('active').hide();
        }
    });
    $("ul#"+listid+" > li").each(function(){
        if($(this).children('ul').children('li.active').length){
            $(this).show();
        }else{
            $(this).hide();
        }
    });
    if(cols_count==0){
        $('#column_search_error').show();
    }else{
        $('#column_search_error').hide();
    }
}


function GetChildByMachineKey(key,ContainerId,Choose,college_id,selectedId,isRegistrationSection){
    var multi_select_city = $("#multi_select_city").val();
    var labelMappingArray = {'City' : 'city_id','State':'state_id','Specialization':'specialization_id','District' : 'district_id'};

    if(ContainerId == 'CourseId' && $("#"+ContainerId).length == 0){
        ContainerId = 'ud\\|course_id';
    }else if(ContainerId == 'specialization_id'){
        ContainerId = 'ud\\|specialization_id';
    }

    if(typeof ContainerId !== "undefined" && $("#"+ContainerId).length){
        if(typeof college_id == 'undefined'){
            if(($('#college_id').length > 0)){
                var college_id = $('#college_id').val();
            }else{
                var college_id = 0;
            }
        }


        /**************** For Registration Related Dependent Dropdown Code Start Here *********************/
        var isRegistration = false;
        if(typeof isRegistrationSection !== 'undefined' && isRegistrationSection == true) {
           isRegistration = true;
        }

        //Blank All dropdown Value of Dependent Field
        var getLastValue = 0;
        if(typeof dependentDropdownFieldList !== 'undefined' && dependentDropdownFieldList != '') {
            $(dependentDropdownFieldList).each(function(key,fieldId){

                //if getLastValue > 0 then return from here. Dont execute Below code
                if(getLastValue >0) {
                    return false;
                }
                var isFieldFound = 0;
                $.each(fieldId, function(childKey,childFieldId){

                    if(childFieldId == 'CourseId' && $("#"+childFieldId).length == 0){
                        childFieldId = 'ud\\|course_id';

                    }


                    //if field match then increase the counter and store the increament value into getLastValue variable
                    if(childFieldId == ContainerId) {
                        isFieldFound++;
                        getLastValue = isFieldFound;
                    }
                    if(isFieldFound > 0) {

                        if($('#'+childFieldId).length) {
                            var labelname = $("#"+childFieldId).data('label');
                            var defaultOption ='<option value="">'+labelname+'</option>';

                            //For <Label> Not Available
                            if($.inArray(childFieldId,['ud\\|course_id','CourseId']) >= 0 ){
                                defaultOption += '<option value="0">' + labelname + jsVars.notAvailableText +' </option>';
                            }
                            $("#"+childFieldId).html(defaultOption);
                        }
                    }
                });
            });
        }

        $('.chosen-select').chosen();
        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        $('.chosen-select').trigger('chosen:updated');

        /**************** For Registration Related Dependent Dropdown Code End Here *********************/
        if(typeof key !== "undefined" && key !== '') {
            $.ajax({
                url: '/common/GetChildByMachineKeyForRegistration',
                type: 'post',
                dataType: 'json',
                data: {key:key,college_id:college_id, childType:Choose, fetchType:'applications',"cf":"lm-user-profile-back"},
                headers: {
                    "X-CSRF-Token": jsVars._csrfToken
                },
                beforeSend: function (xhr) {
                    showLoader();
                },
                async:true,
                success: function (json) {
                    if(json['redirect']){
                        location = json['redirect'];
                    }
                    if(json['error']){
                        alertPopup(json['error'],'error');
                    }
                    else if(json['success']){
                        if($('.commonSumoReload').length>0){
                          var html = '';
                        }else{
                            if($.inArray(Choose,['City','State','Specialization','District']) >= 0 ){
                                if(typeof json['labelMapping'][labelMappingArray[Choose]] == 'undefined'){
                                    json['labelMapping'][labelMappingArray[Choose]] = Choose;
                                }
                                html += '<option value="">' + json['labelMapping'][labelMappingArray[Choose]] +' </option>';
                            }else{
                                if((typeof Choose == 'undefined' || Choose == '')  && typeof $("#"+ContainerId).data('label') !== 'undefined') {
                                    Choose = $("#"+ContainerId).data('label');
                                }
                                var html = '<option value="">'+Choose+'</option>';
                            }

                        }

                        if((Choose == 'State') && ($('#CityId').length > 0))
                        {
                            $('#CityId').html('<option value="">Registered City'+json['labelMapping']['city_id']+'</option>');
                        }
                        if ((Choose == 'City') && ($('#CityId').length > 0) && (multi_select_city=='yes')){
                           html = '';
                        }

                        if($.inArray(Choose,['City','State','Specialization','District']) >= 0 ){
                            html += '<option value="0">' + json['labelMapping'][labelMappingArray[Choose]] + jsVars.notAvailableText +' </option>';
                            //reset city also
                            if ((Choose == 'District') && $('#CityId').length > 0) {
                                $('#CityId').html('<option value="0">' + json['labelMapping'][labelMappingArray['City']] + jsVars.notAvailableText +' </option>');
                                $('#CityId')[0].sumo.reload();
                            }
                        }

                        for(var key in json['list'])
                        {
                            optionvalue = key;
                            if(isRegistration) {
                                optionvalue = key+';;;'+json['list'][key];
                            }
                            html += '<option value="'+optionvalue+'">'+json['list'][key]+'</option>';
                        }
                        $('#'+ContainerId).html(html);

                        //FOr selected city id
                        if(typeof selectedId !== 'undefined' && selectedId !=''){
                            if((Choose == 'State') && ($('#StateId').length > 0)){
                                $('#StateId').val(selectedId);
                            }else if((Choose == 'District') && ($('#DistrictId').length > 0)){
                                $('#DistrictId').val(selectedId);
                            }else if((Choose == 'City') && ($('#CityId').length > 0)){
                                $('#CityId').val(selectedId);
                            }
                        }
                        if ((Choose == 'City') && ($('#CityId').length > 0) && (multi_select_city=='yes')){
                            $('#CityId')[0].sumo.reload();
                        }

                        //If result not return
                        if(json['list'].length == 0 && typeof $("#"+ContainerId).data('label') !== 'undefined'){
                            var defaultOption ='<option value="">'+$("#"+ContainerId).data('label')+'</option>';
                            $("#"+ContainerId).html(defaultOption);
                        }

                        if($('.commonSumoReload').length>0){
                            $('.commonSumoReload')[0].sumo.reload();
                        }

                        $('.chosen-select').chosen();
                        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                        $('.chosen-select').trigger('chosen:updated');
                    }
                },
                complete: function () { hideLoader(); },
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        }
    }
    else
    {
        var col_class = 3;
        var total_filter = $('input[name="filter_create_keys[]"]:checked').length;
        if(total_filter<4){
            col_class = parseInt(12/total_filter);
        }

        var InputObjectId = $('#'+ContainerId).data('key_source');
        $('#'+ContainerId).parents('div.col-md-3').remove();
        var elem = $('#'+InputObjectId);
        if(ContainerId === 'StateId') {
            var option = $('<option></option>').attr("value", "").text("State");
            $("#"+ContainerId).empty().append(option);
            $('.chosen-select').trigger('chosen:updated');
            $("#"+ContainerId).trigger('change');
        }
        if(ContainerId === 'DistrictId') {
            var option = $('<option></option>').attr("value", "").text("District");
            $("#"+ContainerId).empty().append(option);
            $('.chosen-select').trigger('chosen:updated');
            $("#"+ContainerId).trigger('change');
        }
        if(ContainerId === 'CityId') {
            $("#"+ContainerId).empty();
             if ( typeof multi_select_city != 'undefined'  && multi_select_city == 'yes'){
                $('#CityId')[0].sumo.reload();
            }else{
                $('.chosen-select').trigger('chosen:updated');
            }
        }
        if(ContainerId === 'specialization_id') {
            ContainerId = 'ud\\|specialization_id';
            var option = $('<option></option>').attr("value", "").text("Specialization");
            $("#"+ContainerId).empty().append(option);
            $('.chosen-select').trigger('chosen:updated');
            $("#"+ContainerId).trigger('change');
            //alert($("#ud|specialization_id").val())
        }
//        createInput(elem,col_class);

    }
    return false;
}

function ResetFilterValue($this){
    $("#selectionRow").hide();
    $('.columnApplicationCheckAll').removeClass('checked');
    $('.columnApplicationCheckAll').attr('checked', false);
//    $('.dropdown-menu-tc').remove();
    $('#parent').removeAttr('style');
    $("#filter_elements_html").html('');
    $('#filter_elements_html').find('input[type="text"]').each(function(){
       $(this).val('');
    });
     $('#collapseFilter').find('input[type="text"]').each(function(){
       $(this).val('');
    });
    $('#collapseFilter').find('select').each(function(){
       this.selected = false;
       $(this).val('');
       $(this).trigger("chosen:updated");
    });
    $('#filter_elements_html').find('select').each(function(){
       this.selected = false;
       $(this).val('');
       $(this).trigger("chosen:updated");
    });

    $('#FilterApplicationForms select#college_id').val('');
    $('#FilterApplicationForms select#college_id').trigger("chosen:updated");

    $('#FilterApplicationForms select#form_id').val('');
    $('#FilterApplicationForms select#form_id').html('<option value="">Form</option>');
    $('#FilterApplicationForms select#form_id').trigger("chosen:updated");

    $('#FilterApplicationForms select#form_stage').val('');
    $('#FilterApplicationForms select#form_stage').html('<option value="">Form Stage</option>');
    $('#FilterApplicationForms select#form_stage').trigger("chosen:updated");

    $('#FilterApplicationForms select#payemnt_type').val('');
    //$('#FilterApplicationForms select#payemnt_type').html('<option value="" selected>Payment Type</option><option value="postpaid">Post-payment</option><option value="prepaid">Pre-payment</option>');
//    updatePaymentType();
    $('#FilterApplicationForms select#payemnt_type').trigger("chosen:updated");

    $('#FilterApplicationForms #search_common').val('');
    $('#load_more_results').html('');
    $('#if_record_exists').hide();
    $('#load_msg').html("Please select an Institute Name and click Search to view Applications.");
    $('#load_msg_div').hide();
    $('#load_more_button').hide();
    $('#load_slider_data').html("");
    $('#view_by').val("");

    //For Unchecked Lead Status Checked Value
    //$('#payment_status')[0].sumo.reload();
    $('#savedFilterList').parent().parent().hide();
    if(typeof $($this).attr('class') !== 'undefined'){
        $('.default-txt-view').text('System Default View');
    }
    return false;
}
function hitPopupBatchBind(){

    $('.modalButton').on('click', function(e) {
        validateFilter();
    });
    $('#myModal').on('hidden.bs.modal', function(){
        $("#modalIframe").html("");
        $("#modalIframe").attr("src", "");
    });

}

function UpdateCreatedBySelect(CreatedByList,CreatedByIdSelected,cur_val_name)
{
    var OptionHtml = '';
    if(typeof cur_val_name === 'undefined'){
        if(!CreatedByIdSelected)
        {
            var OptionHtml = '<option selected="selected" value="">Created By</option>';
        }
        else
        {
            var OptionHtml = '<option value="">Created By</option>';
        }
    }
    if(CreatedByList)
    {
        for(var i in CreatedByList)
        {
            if(CreatedByIdSelected && (i == CreatedByIdSelected))
            {
                OptionHtml += '<option selected="selected" value="'+ i +'">'+ CreatedByList[i] +'</option>';
            }
            else
            {
                OptionHtml += '<option value="'+ i +'">'+ CreatedByList[i] +'</option>';
            }
        }
    }
    /// load value from
    if($("[name='" + cur_val_name + "']").parents('div.block_first').find('.CreatedBySelect').length){
        $("[name='" + cur_val_name + "']").html(OptionHtml);
    }
    $('#FilterApplicationForms #CreatedBySelect').html(OptionHtml);
    $("#CreatedBySelect").trigger("chosen:updated");
}

//call publister list by traffic channel selected campain options
$(document).on('change', "select[name='filter[u|traffic_channel]']", function () {
    var college_id=$('select#college_id').val();

     if(typeof college_id != 'undefined' && college_id != "") {
        if($(this).val()==1){//campain option
            getPublisherList(this);
        }else if($(this).val()==8){//telephony option
            getPublisherList(this, $(this).val());
        }else if($(this).val()== '0'){//campain option
            var html =  "<option value=''>Publisher/Referrer</option>";
                html += "<option value='1'>Offline</option>";
            $("#publisher_filter").html(html);
            $('#publisher_filter').trigger('chosen:updated');
        }else if($(this).val() == 5 || $(this).val() == 3 || $(this).val() == 4){
            var tfc = $(this).val();
            getReferrerList(college_id,tfc);
        }else if($(this).val() == '9'){
            getOfflineSourceList(college_id);
        } else{
            //unset drop down on traffic channel without campains
            $("#publisher_filter").html("<option value=''>Publisher/Referrer</option>");
            $("select[name='filter[campu|source_value]']").html("<option value=''>Campaign Source</option>");
            $("select[name='filter[campu|medium_value]']").html("<option value=''>Campaign Medium</option>");
            $("select[name='filter[campu|name_value]']").html("<option value=''>Campaign Name</option>");
            $('select').trigger('chosen:updated');
            //getPublisherList();
             return false;
        }
     }
});

/*
 * this function use for get publisher  list by traffic channel select campain option
 * NPF-1238 10.3 || Application & Application Manager revamp
 */
function getPublisherList(elem, tfc)
{
    college_id = $('#college_id').val();
    if (typeof tfc === 'undefined' || tfc === null) {
        tfc = $(elem).val();
    }

    var htmlOption = '<option value="">Publisher/Referrer</option>';
    $.ajax({
        url: '/campaign-manager/get-publisher-list',
        type: 'post',
        dataType: 'html',
        data: {'college_id': college_id, 'traffic_channel':tfc},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            var responseObject = $.parseJSON(json);
            if(responseObject.status === 1) {
                if(typeof responseObject.data.sourceList === "object"){

                    var sourceList    = responseObject.data.sourceList;
                    $.each(sourceList, function (index, item) {
                        htmlOption +='<option value="'+index+'">'+item+'</option>';
                    });
                    $("#publisher_filter").html(htmlOption);
                    $('#publisher_filter').trigger('chosen:updated');
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
        }
    });
    return false;
}

//call getCompaignsSource() by publisher id  and Campaion source values and medium ,Name withour values
$(document).on('change', "select[name='filter[pub|publisher_id]']", function () {
    getCompaignsSource($(this).val(), "source_value", 'publisher_id', '');
});
//call getCompaignsMedium() medium_value by source_value
$(document).on('change', "select[name='filter[campu|source_value]']", function () {

    if (($(".publisher_filter").val()).length <= 0) {//check publisher value
        return false;
    }
    getCompaignsMedium($(this).val());
});
//call getCompaignsName() name_value by medium_value
$(document).on('change', "select[name='filter[campu|medium_value]']", function () {

    $("select[name='filter[campu|name_value']").html('');
    $("select[name='filter[campu|medium_value']").html('');
    getCompaignsName($(this).val(),'');
});

//conversion
//call getCompaignsMedium() medium_value by source_value
$(document).on('change', "select[name='filter[campap|conversion_source_value]']", function () {
    if (($(".publisher_filter").val()).length <= 0) {//check publisher value
        return false;
    }

    getCompaignsMedium($(this).val(),'','conversion');
});
//call getCompaignsName() name_value by medium_value
$(document).on('change', "select[name='filter[campap|conversion_medium_value]']", function () {

    $("select[name='filter[campu|name_value']").html('');
    $("select[name='filter[campu|medium_value']").html('');
    getCompaignsName($(this).val(),'','conversion');
});

/*
 * this function use for get Campaion Source by source_value
 * NPF-1211 10.3 || LMS & Application Manager revamp
 */
var get_source_val = '';
function getCompaignsSource(getvalue, type, where_cond,default_value) {
    var college_id = $("#college_id").val();
    var publisher_val = $(".publisher_filter").val();
    //if ($.trim(getvalue).length <= 0) {

        $("select[name='filter[campu|source_value]']").html("<option value=''>Campaign Source</option>");
        $("select[name='filter[campu|medium_value]']").html("<option value=''>Campaign Medium</option>");
        $("select[name='filter[campu|name_value]']").html("<option value=''>Campaign Name</option>");
        //conversion
        $("select[name='filter[campap|conversion_source_value]']").html("<option value=''>Conversion Source</option>");
        $("select[name='filter[campap|conversion_medium_value]']").html("<option value=''>Conversion Medium</option>");
        $("select[name='filter[campap|conversion_name_value]']").html("<option value=''>Conversion Name</option>");
        $('select').trigger('chosen:updated');
        //return false;
    //}
    $.ajax({
        url: '/leads/get-compaigns-source',
        type: 'post',
        dataType: 'json',
        async:true,
        data: {'get_value': getvalue, 'type': type, 'where_cond': where_cond, 'publisher_id': publisher_val, 'college_id' : college_id, 'default_value':default_value, 'traffic_channel': $("select[name='filter[u|traffic_channel]']").val(), 'registration_instance':'pri_register'},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () {  showLoader(); },
        complete: function () { hideLoader(); },
        success: function (json) {
            if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                window.location.href = json['redirect'];
            } else if (typeof json['status'] != 'undefined' && json['status'] == 200) {
                $("select[name='filter[campu|source_value]']").html($.parseJSON(json['dropdown_values']));
                $("select[name='filter[campu|source_value]']").trigger('chosen:updated');

                //conversion

                $("select[name='filter[campap|conversion_source_value]']").html($.parseJSON(json['dropdown_values']));
                $("select[name='filter[campap|conversion_source_value]'] option:first").html('Conversion Source');
                $("select[name='filter[campap|conversion_source_value]']").trigger('chosen:updated');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

/*
 * this function use for get Campaion Medium by source_value
 * NPF-1211 10.3 || LMS & Application Manager revamp
 */
var get_source_val = '';
function getCompaignsMedium(getvalue,default_value,conversion) {
    publisher_val = $(".publisher_filter").val();
    var college_id = $("#college_id").val();
    //$(".medium_value").remove();//remove Compaigns Medium befor exits
    //$(".name_value").remove();//remove Compaigns Medium befor exits
    if (getvalue.length <= 0) {
        //conversion
        if(conversion){
            $("select[name='filter[conversion_campap|medium_value]']").html("<option value=''>Conversion Medium</option>");
            $("select[name='filter[conversion_campap|name_value]']").html("<option value=''>Conversion Campaign Name</option>");
            $('select').trigger('chosen:updated');
        }else{
            $("select[name='filter[campu|medium_value]']").html("<option value=''>Registration Medium</option>");
            $("select[name='filter[campu|name_value]']").html("<option value=''>Registration Name</option>");
        }
        return false;
    }
    $.ajax({
        url: '/leads/get-compaigns-medium',
        type: 'post',
        dataType: 'json',
        beforeSend: function () {  showLoader(); },
        complete: function () { hideLoader(); },
        async:true,
        data: {'get_value': getvalue,'publisher_id': publisher_val,'college_id':college_id,'default_value':default_value, 'registration_instance':'pri_register'},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {

            if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                window.location.href = json['redirect'];
            } else if (typeof json['status'] != 'undefined' && json['status'] == 200) {
                //conversion
                if(conversion){
                    $("select[name='filter[campap|conversion_medium_value]").html($.parseJSON(json['dropdown_values']));
                    $("select[name='filter[campap|conversion_medium_value]'] option:first").html('Conversion Medium');
                    $("select[name='filter[campap|conversion_medium_value]").trigger('chosen:updated');
                }else{
                    $("select[name='filter[campu|medium_value]").html($.parseJSON(json['dropdown_values']));
                    $("select[name='filter[campu|medium_value]").trigger('chosen:updated');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

/*
 * this function use for get Campaion source list by publisher id
 * NPF-1211 10.3 || LMS & Application Manager revamp
 */
var get_medium_val = '';
function getCompaignsName(getvalue, default_value,conversion) {
    publisher_val = $(".publisher_filter").val();
    var college_id = $("#college_id").val();
    if ($.trim(getvalue).length <= 0) {
        $("select[name='filter[campu|name_value]']").html("<option value=''>Registration Campaign Name</option>");
        //conversion
        $("select[name='filter[campap|conversion_name_value]']").html("<option value=''>Conversion Campaign Name</option>");
        $('select').trigger('chosen:updated');
        return false;
    }
    $.ajax({
        url: '/leads/get-compaigns-name',
        type: 'post',
        dataType: 'json',
        beforeSend: function () {  showLoader(); },
        complete: function () { hideLoader(); },
        async:true,
        data: {'get_value': getvalue, 'publisher_id': publisher_val,'college_id':college_id,'source':$("select[name='filter[campu|source_value]']").val(), 'default_value':default_value, 'registration_instance':'pri_register'},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                window.location.href = json['redirect'];
            } else if (typeof json['status'] != 'undefined' && json['status'] == 200) {
                //conversion
                if(conversion){
                    $("select[name='filter[campap|conversion_name_value]").html($.parseJSON(json['dropdown_values']));
                    $("select[name='filter[campap|conversion_name_value]'] option:first").html('Conversion Campaign Name');
                    $("select[name='filter[campap|conversion_name_value]").trigger('chosen:updated');
                }else{
                    $("select[name='filter[campu|name_value]").html($.parseJSON(json['dropdown_values']));
                    $("select[name='filter[campu|name_value]").trigger('chosen:updated');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

/*
 * publisher selected on source,medium,name checked and uncheck checkbox
 * NPF-1211 10.3 || LMS & Application Manager revamp
 */

$(document).on('change', '#filter_li_list li input[type="checkbox"]', function () {
    var isCheckMedium = false;//mediumn campaign
    var isCheck = false;//publisher
    var isCheckSource = false;//source campaign
    var conversion_isCheckSource = false;//conversion_ source campaign
    var isCheckCampain = false;//source campaign
    var conversion_isCheckMedium = false;//conversion_ medium
    var isCheckCampainInstance = false; //registration instance
    if ($(this).is(':checked')) {//check checkbox true
        var input_id = '';
        if (typeof $(this).data('input_id') != 'undefined') {//get id
            input_id = $(this).data('input_id');
        }

        if (input_id == 'publisher_id') {//publisher
            $('input[type="checkbox"][data-input_id="traffic_channel"]').prop('checked', true);//campain for traffic channel
            //$('input[type="checkbox"][data-input_id="registration_instance"]').prop('checked', true);//campain for registration instance
        }
        if (input_id == 'source_value'
                || input_id == 'medium_value'
                || input_id == 'name_value'
                || input_id =='publisher_id'
                || input_id == 'conversion_source_value'
                || input_id == 'conversion_medium_value'
                || input_id == 'conversion_name_value'
                ) {
            $('input[type="checkbox"][data-input_id="traffic_channel"]').prop('checked', true);
            //$('input[type="checkbox"][data-input_id="registration_instance"]').prop('checked', true);//campain for registration instance
        }
        if (input_id == 'source_value' || input_id == 'conversion_source_value') {//medium_ campaign
            $('input[type="checkbox"][data-input_id="publisher_id"]').prop('checked', true);//publisher
        }
        if (input_id == 'medium_value') {//medium_ campaign
            $('input[type="checkbox"][data-input_id="publisher_id"]').prop('checked', true);//publisher
            $('input[type="checkbox"][data-input_id="source_value"]').prop('checked', true);//source
        }
        if (input_id == 'name_value') {//name campaign
            $('input[type="checkbox"][data-input_id="publisher_id"]').prop('checked', true);//publisher
            $('input[type="checkbox"][data-input_id="medium_value"]').prop('checked', true);//mediumn
            $('input[type="checkbox"][data-input_id="source_value"]').prop('checked', true);//source
            $('input[type="checkbox"][data-input_name="traffic_channel"]').prop('checked', true);//trafic
        }
        //conversion check conditions
        if (input_id == 'conversion_medium_value') {//medium_ campaign
            $('input[type="checkbox"][data-input_id="publisher_id"]').prop('checked', true);//publisher
            $('input[type="checkbox"][data-input_id="conversion_source_value"]').prop('checked', true);//source
        }
        if (input_id == 'conversion_name_value') {//name campaign
            $('input[type="checkbox"][data-input_id="publisher_id"]').prop('checked', true);//publisher
            $('input[type="checkbox"][data-input_id="conversion_medium_value"]').prop('checked', true);//mediumn
            $('input[type="checkbox"][data-input_id="conversion_source_value"]').prop('checked', true);//source
            $('input[type="checkbox"][data-input_name="traffic_channel"]').prop('checked', true);//trafic
        }

        if(input_id =='ebs_status'){
            var sci = $('input[type="checkbox"][data-input_id="ebs_test_no"]').prop('checked',true);
        }

        if(input_id =='ebs_test_no'){
            var sci = $('input[type="checkbox"][data-input_id="ebs_status"]').prop('checked',true);
        }

        // check All GDPI Filter
        if (input_id === 'venue_address'  || input_id === 'gd_pi_date' || input_id === 'gd_pi_panel_number' ||
            input_id === 'gd_pi_time_slot'|| input_id === 'gdpi_center')
        {
                $('input[type="checkbox"][data-input_id="gdpi_center"]').prop('checked', true);
                $('input[type="checkbox"][data-input_id="venue_address"]').prop('checked', true);
                $('input[type="checkbox"][data-input_id="gd_pi_time_slot"]').prop('checked', true);
                $('input[type="checkbox"][data-input_id="gd_pi_date"]').prop('checked', true);
                $('input[type="checkbox"][data-input_id="gd_pi_panel_number"]').prop('checked', true);
        }

    } else {
        var input_id = '';
        if (typeof $(this).data('input_id') != 'undefined') {//get id
            input_id = $(this).data('input_id');
        }

        if (input_id == 'publisher_id') {//publisher
            $('input[type="checkbox"][data-input_id="traffic_channel"]').prop('checked', false);//campain for traffic channel
            //$('input[type="checkbox"][data-input_id="registration_instance"]').prop('checked', false);//campain for registration instance
        }
        if (input_id == 'source_value'
                || input_id == 'medium_value'
                || input_id == 'name_value'
                || input_id =='publisher_id'
                || input_id == 'conversion_source_value'
                || input_id == 'conversion_medium_value'
                || input_id == 'conversion_name_value'
                ) {
            $('input[type="checkbox"][data-input_id="traffic_channel"]').prop('checked', false);
            //$('input[type="checkbox"][data-input_id="registration_instance"]').prop('checked', false);//campain for registration instance
        }
        if (input_id == 'source_value' || input_id == 'conversion_source_value') {//medium_ campaign
            $('input[type="checkbox"][data-input_id="publisher_id"]').prop('checked', false);//publisher
        }
        if (input_id == 'medium_value') {//medium_ campaign
            $('input[type="checkbox"][data-input_id="publisher_id"]').prop('checked', false);//publisher
            $('input[type="checkbox"][data-input_id="source_value"]').prop('checked', false);//source
        }
        if (input_id == 'name_value') {//name campaign
            $('input[type="checkbox"][data-input_id="publisher_id"]').prop('checked', false);//publisher
            $('input[type="checkbox"][data-input_id="medium_value"]').prop('checked', false);//mediumn
            $('input[type="checkbox"][data-input_id="source_value"]').prop('checked', false);//source
            $('input[type="checkbox"][data-input_name="traffic_channel"]').prop('checked', false);//trafic
        }
        //conversion check conditions
        if (input_id == 'conversion_medium_value') {//medium_ campaign
            $('input[type="checkbox"][data-input_id="publisher_id"]').prop('checked', false);//publisher
            $('input[type="checkbox"][data-input_id="conversion_source_value"]').prop('checked', false);//source
        }
        if (input_id == 'conversion_name_value') {//name campaign
            $('input[type="checkbox"][data-input_id="publisher_id"]').prop('checked', false);//publisher
            $('input[type="checkbox"][data-input_id="conversion_medium_value"]').prop('checked', false);//mediumn
            $('input[type="checkbox"][data-input_id="conversion_source_value"]').prop('checked', false);//source
            $('input[type="checkbox"][data-input_name="traffic_channel"]').prop('checked', false);//trafic
        }

        if(input_id =='ebs_status'){
            var sci = $('input[type="checkbox"][data-input_id="ebs_test_no"]').prop('checked',false);
        }

        if(input_id =='ebs_test_no'){
            var sci = $('input[type="checkbox"][data-input_id="ebs_status"]').prop('checked',false);
        }

        // uncheck All GDPI group  Filter
        if (input_id === 'venue_address'  || input_id === 'gd_pi_date' || input_id === 'gd_pi_panel_number' ||
            input_id === 'gd_pi_time_slot'|| input_id === 'gdpi_center')
        {
                $('input[type="checkbox"][data-input_id="gdpi_center"]').prop('checked', false);
                $('input[type="checkbox"][data-input_id="venue_address"]').prop('checked', false);
                $('input[type="checkbox"][data-input_id="gd_pi_time_slot"]').prop('checked', false);
                $('input[type="checkbox"][data-input_id="gd_pi_date"]').prop('checked', false);
                $('input[type="checkbox"][data-input_id="gd_pi_panel_number"]').prop('checked', false);
        }
    }
});

function loadSliderData(count_field) {

    if($('#view_by').val()=="") return false;

     var arr = count_field.split("|");

    var data = $('#FilterApplicationForms').serializeArray();
    data.push({name: "field_count_column", value: arr[0]});
    data.push({name: "field_count_label", value: arr[1]});
    $.ajax({
        url: '/leads/load-slider-data',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: data,
        beforeSend: function (xhr) {
            showLoader();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
          //console.log(data);
          //return false;
            if (data == "error") {
                //$('#load_slider_data').html("<div class='alert alert-danger'>No Records</div>");
            }else if (data == "select_college") {
                $('#load_slider_data').html("<div class='alert alert-danger'>Please select institute name to view their leads.</div>");
            }else {
                $('#load_slider_data').html(data);
//                $.material.init();
                LoadOwl();
            }
            //console.log(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            hideLoader();

        }
    });
}

function LoadOwl(){
         $("#owl-demo").owlCarousel({
        autoPlay: 3000,
        items : 4,
        itemsDesktop : [1199,3],
        itemsDesktopSmall : [979,3],
        navigation:true,
        pagination:false,
        navigationText: [
      "<i class='fa fa-chevron-left'></i>",
      "<i class='fa fa-chevron-right'></i>"
      ],
        stopOnHover : true
      });
    $(".flip").click(function(){
        $(".slide-content").slideToggle("slow");
    });
}

$(document).ready(function() {
//    LoadOwl();
//    $(".trigerTableView").on('click', function () {
//        $( "#table-view").trigger("click");
//        e.preventDefault();
//    });
    $('.user-tabuler-data').on('click', function () {
        var container_id = $(this).attr('id');
        if (container_id == 'table-view') {
            $('#snapshot-view').removeClass('active');
            $('#snapshot-view').parent().removeClass('active');
            $(this).addClass('active');
            $(this).parent().addClass('active');
            $('#table-data-view').show();
            $('#snapshot-data-view').hide();
            graphMakeDisabledFields('show');
			$('.mobDropCorg').show();
            $('#for-snapshot').removeClass('disableArea');
            $('#for-snapshot .label_snapshot').hide();
			$('.msg-filter').hide();
			$('.advanceFilterModal').show();
        }
        else if (container_id == 'snapshot-view') {
            $(this).addClass('active');
            $(this).parent().addClass('active');
            $('#table-view').removeClass('active');
            $('#table-view').parent().removeClass('active');
            $('#table-data-view').hide();
            $('#snapshot-data-view').show();
			$('.msg-filter').show();
			$('#advanceFilter').removeClass('active');
			$('.advanceFilterModal').hide();
			$('.mobDropCorg').hide();
            if ($('#line-chart-graph').is(':empty')) {
                form_id  = $('#snapshot-form-list option:nth-child(2)').val();
                $.ajax({
                    url: '/applications/collegeApplicationsMinMaxDate',
                    type: 'post',
                    dataType: 'json',
                    data: {'form_id':form_id},
                    headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                    success: function (json) {
                        if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                            window.location.href = json['redirect'];
                        } else if (typeof json['success'] != 'undefined' && json['success'] == 200) {
                            if(typeof json['registration_date'] != 'undefined'){
                                $('#final-registration-date').val(json['registration_date']);
                                $('#default_date').text(json['registration_date']);
                            }
                            $('.get-user-register').trigger('click');
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    }
                });
            }
            graphMakeDisabledFields('hide');
            $('#for-snapshot').addClass('disableArea');
            $('#for-snapshot .label_snapshot').show();
        }
        makeScrollable();
    });
    $('#snapshot-form-list').on('change', function() {
        $('#final-registration-date').siblings('.error').remove();
        $('.state-wise-applications h3').remove();
        $('#line-chart-graph, #country-wise-chart-graph, #state-wise-chart-graph, #city-wise-chart-graph, #country_selected_id, #form-wise-chart-graph, #stage-wise-chart-graph').empty();
        if ($('.parent-graph-tab li a.active').hasClass('application-container')) {
            getRangeWiseApplications();
        } else if($('.parent-graph-tab li a.active').hasClass('state-wise-container')) {
            getStateWiseApplicants();
        } else if($('.parent-graph-tab li a.active').hasClass('form-wise-container')){
            $('#form-wise-chart-graph').empty();
            var form_id = $('#snapshot-form-list').val();
            $('#snapshot-form-list').siblings('.error').remove();
            if(typeof form_id != 'undefined' && form_id != '' && form_id != 0) {
                getFormWiseApplicants();
            } else {
                $('#snapshot-form-list').parent().append('<span class="error">Please select form.</span>');
            }
        } else if($('.parent-graph-tab li a.active').hasClass('stage-wise-container')){
            $('#stage-wise-chart-graph').empty();
            var form_id = $('#snapshot-form-list').val();
            $('#snapshot-form-list').siblings('.error').remove();
            if(typeof form_id != 'undefined' && form_id != '' && form_id != 0) {
                getStageWiseUserRegister();
            } else {
                $('#snapshot-form-list').parent().append('<span class="error">Please select form.</span>');
            }
        }


    });

    $('.parent-graph-tab li a').on('click', function(){
        $('.parent-graph-tab li').removeClass('active');
        $('.parent-graph-tab li a').removeClass('active');
        $(this).addClass('active');
        $(this).parent().addClass('active');
        $('.graph-container').hide();
        $('.application-date-range').hide();
        if ($(this).hasClass('application-container')) {
            $('div.application-container').show();
            $('.application-date-range').show();
            if ($('#line-chart-graph').is(':empty')) {
                $('.get-user-register').trigger('click');
            }
        }
        else if($(this).hasClass('state-wise-container')) {
            $('div.state-wise-applications').show();
            if($('.parent-graph-tab li a.state-wise-container').hasClass('country')) {
                var findParam = 'country';
            } else if($('.parent-graph-tab li a.state-wise-container').hasClass('state')) {
                var findParam = 'state';
            } else if($('.parent-graph-tab li a.state-wise-container').hasClass('city')) {
                var findParam = 'city';
            }
            if ($('#'+findParam+'-wise-chart-graph').is(':empty')) {
                $('#snapshot-form-list').trigger('change');
            }
        } else if($(this).hasClass('form-wise-container')){
            $('div.form-wise-applications').show();
            if($('#form-wise-chart-graph').is(':empty')) {
                var form_id = $('#snapshot-form-list').val();
                $('#snapshot-form-list').siblings('.error').remove();
                if(typeof form_id != 'undefined' && form_id != '' && form_id != 0) {
                    getFormWiseApplicants();
                } else {
                    $('#snapshot-form-list').parent().append('<span class="error">Please select form.</span>');
                }
            }
        } else if($(this).hasClass('stage-wise-container')){
            $('div.stage-wise-applications').show();
            if($('#stage-wise-chart-graph').is(':empty')) {
                var form_id = $('#snapshot-form-list').val();
                $('#snapshot-form-list').siblings('.error').remove();
                if(typeof form_id != 'undefined' && form_id != '' && form_id != 0) {
                    getStageWiseUserRegister();
                } else {
                    $('#snapshot-form-list').parent().append('<span class="error">Please select form.</span>');
                }
            }
        }
    });
    $('.range-tab-active a').on('click', function (e) {
        e.preventDefault();
//        if($(this).hasClass('daytab')) {
//            $('.parent-graph-tab .application-container').text('Day-wise Applications');
//        } else if($(this).hasClass('weektab')) {
//            $('.parent-graph-tab .application-container').text('Week-wise Applications');
//        } else if($(this).hasClass('monthtab')) {
//            $('.parent-graph-tab .application-container').text('Month-wise Applications');
//        }
        $('.range-tab-active a').removeClass('active');
        $('.range-tab-active li').removeClass('active');
        $(this).parent().addClass('active');
        $(this).addClass('active');
        getRangeWiseApplications();
    });
    $('#final-registration-date').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY',
            separator: ', ',
        },
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'left'
    }, function (start, end, label) {
        //console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
    });

    $('#final-registration-date').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
        $('.get-user-register').trigger('click');
    });

    $('#final-registration-date').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val($('#default_date').text());
        $('.get-user-register').trigger('click');
    });

    $('.get-user-register').on('click', function () {
        var rangeVal = $('#final-registration-date').val();
        $('#final-registration-date').siblings('.error').remove();
        getRangeWiseApplications();
    });

    if (typeof jsVars.college_id != 'undefined' && parseInt(jsVars.college_id) >0) {
        createFilterApplication();
    }
    $('.columnApplicationCheckAll').on('click', function(e){
        $(this).toggleClass('checked');
        if($(this).hasClass('checked')) {

           var disabledfieldonSelectAll=[
               'rfl|submitted_on||Re-submit Application Date',
               'psal|title||Re-submit Application Name',
               'rfl|status||Re-submit Application Status'
           ];

            $('#column_li_list input:checkbox:not(:disabled)').prop('checked', true);

            for(field in disabledfieldonSelectAll){
                $('#column_li_list input:checkbox[value="'+disabledfieldonSelectAll[field]+'"]').prop('checked', false);
            }

        } else {
            $('#column_li_list input:checkbox:not(:disabled)').prop('checked', false);
        }
    });
    $('.download-as-pdf').on('click', function (e) {
        e.preventDefault();
        downloadGraph('application');
    });
    $('.download-as-csv').on('click', function (e) {
        var selectedType = '';
        var findParam = '';
        var range_type_view = '';
        if($('.parent-graph-tab li.active a').hasClass('application-container')) {
            selectedType = 'application_container';
            range_type_view = $('.range-tab-active a.active').text();
        } else if($('.parent-graph-tab li.active a').hasClass('state-wise-container')) {
            selectedType = 'state_wise_container';
            if($('.parent-graph-tab li a.state-wise-container').hasClass('country')) {
                findParam = 'country';
            } else if($('.parent-graph-tab li a.state-wise-container').hasClass('state')) {
                findParam = 'state';
            } else if($('.parent-graph-tab li a.state-wise-container').hasClass('city')) {
                findParam = 'city';
            }
        } else if($('.parent-graph-tab li.active a').hasClass('form-wise-container')){
            selectedType = 'form_wise_container';
        } else if($('.parent-graph-tab li.active a').hasClass('stage-wise-container')){
            selectedType = 'stage_wise_container';
        }

        var $form = $("#FilterApplicationForms");

        $form.attr("target",'modalIframe');
        $form.append($("<input>").attr({"value":"snapshot_csv", "name":"export",'type':"hidden","id":"export"}));
        $form.append($("<input>").attr({"value":selectedType, "name":"selectedType",'type':"hidden"}));
        $form.append($("<input>").attr({"value":range_type_view, "name":"range_type_view",'type':"hidden"}));
        $form.append($("<input>").attr({"value":findParam, "name":"findParam",'type':"hidden"}));
        var onsubmit_attr = $form.attr("onsubmit");
        var action_attr = $form.attr("action");
        $form.removeAttr("onsubmit");
        $form.attr("action",'/applications/snapshot-download-as-csv');
        $form.submit();
        $form.attr("onsubmit",onsubmit_attr);
        $form.attr("action",action_attr);
        $form.find('input[name="export"]').val("");
        $form.removeAttr("target");
        $('#myModal').on('hidden.bs.modal', function(){
            $("#modalIframe").html("");
            $("#modalIframe").attr("src", "");
        });
    });
 });

 /**
 *
 * @param {type} data encoded value
 * @returns {html}
 */
 function viewhistory(data){
    $.ajax({
       url: '/leads/get-payment-history',
       type: 'post',
       dataType: 'html',
       data: {data:data},
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       success: function (data) {
           if(data=='session_logout'){
               window.location.reload(true);
           }else if(data == 'permision_denied'){
               window.location.href= '/permissions/error';
           }
		   $('#utilityPopup .modal-dialog').addClass('modal-sm');
		   $('#utilityPopup .modal-title').html('Payment History');
		   $('#utilityPopup .modal-body').html(data);
           $('#utilityPopup').modal('show');
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}
 var pdata ;
 function PushtoErp(data){
    $('#repush_success').hide();
    $("#repushapp_selecterror").hide();
    $.ajax({
       url: '/connector/get-repush',
       type: 'post',
       dataType: 'html',
       data: {data:data},
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       success: function (result) {
           if(data=='session_logout'){
               window.location.reload(true);
           }else if(result == 'permision_denied'){
               window.location.href= '/permissions/error';
           }
           console.log(result);
            if(result!=""){
                var responseObject = jQuery.parseJSON(result);
                pdata = {'enctyptedData':data};
                var option = selectTrigger = '';
                option += '<option value="select">Select Triger Point</option>';
                $.each(responseObject, function (index, item) {
                    option += '<option value="'+item +'">'+item+'</option>';
                });
                selectTrigger += '<div class="text-center margin-top-8"><button id="repushapp_button" class="btn btn-npf pull-right m-0" onclick="rePushErpData(pdata);">Push</button></div>';

                $('#rePushPopup .modal-dialog').addClass('modal-sm');
                $('#repush_button').html(selectTrigger);
                $('#repush_id').html(option);
                $('#rePushPopup').modal('show');
            }else {
                $('#rePushPopup .modal-body').html('<div id="errorText" class="alert alert-warning">Erp Not Active</div>');
                $('#rePushPopup').modal('show');
            }
            $('.chosen-select').trigger('chosen:updated');
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}
/**
 *
 * @param {string} json_encode data
 * @returns null
 */
function AddUserToWildCardTable(data,type){
    $("#add_remove_user_wild_card_list").hide();//hide message
    var postData='';
    var loadPopup=0;
    if(typeof type !='undefined' && type=='add'){ //When add user to list function will fire
        var postData = $('#addWildCardUserForm').serialize();
    } else { //When display the popup
        jQuery('#showAddToListContainer').html('loading...');
        postData={data:data};
        loadPopup=1;

        //Blank These Field
        $('#wildcard_user_id').val('');
        $('#wildcard_college_id').val('');
        $('#wildcard_form_id').val('');

        var html = '<option value="" selected="selected">Select List</option>';
        $('#menu_id').html(html);
        $('#menu_id').trigger("chosen:updated");

        $("#add_remove_user_wild_card_list").removeClass("alert alert-success");
        $("#add_remove_user_wild_card_list").html("");
    }
    $.ajax({
       url: '/reports/add-remove-user-wild-card-list',
       type: 'post',
       dataType: 'json',
       data: postData,
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       success: function (json) {
           if((typeof json['session_error'] !='undefined' && json['session_error']=='session_logout') ||
              (typeof json['token_error'] !='undefined' && json['token_error']=='token_error')){
               window.location.reload(true);
           } /*else if(json == 'permision_denied'){
               window.location.href= '/permissions/error';
           } */

           if(loadPopup==1) {
               if(json['data'] != '') {
					$('#wildcard_user_id').val(json['data']['user_id']);
					$('#wildcard_college_id').val(json['data']['college_id']);
					$('#wildcard_form_id').val(json['data']['form_id']);
					$('#wildcard_application_id').val(json['data']['application_no']);
					var html='';
					if (json['data']['menuList'] !='') {
						var html = '<option value="" selected="selected">Select List</option>';
						obj_json = (json['data']['menuList']);
						for (var key in obj_json) {
							html += '<option value="' + key + '">' + obj_json[key] + '</option>';
						}
						$('#menu_id').html(html);
						$('#menu_id').trigger("chosen:updated");
					}
				}
                $('#showAddToListPopUp').trigger('click');
				floatableLabel();
           }


           //Display Error
           $('.show_err').html('');
           if(typeof json['error'] !='undefined'){
                for (var i in json['error']) {
                    $('#'+i+'_error').html(json['error'][i]).addClass('error');
                }
            }

           if(typeof json['data_update'] !='undefined' && json['data_update']=='update'){
                 //$('#ConfirmPopupArea').modal('hide');
                $("#add_remove_user_wild_card_list").show();
                $("#add_remove_user_wild_card_list").addClass("alert alert-success").html("User successfully add to Wildcard List");

                //After successful update blank these dropdown value
                $('#menu_id').val("");
                $('#menu_id').trigger("chosen:updated");

                $('#list_id').val("");
                $('#list_id').trigger("chosen:updated");

                //Call this function so it will load the result
                 LoadMoreLeadsNew('reset');
             }
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}


function getAllCustomMenuListByCollegeId(){
    var data = $('#addWildCardUserForm').serializeArray();
    $.ajax({
        url: '/reports/getListNameByCollegeAndType',
        data: data,
        type: "POST",
        dataType: 'json',
        async:true,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {

            if ((typeof json['redirect'] != 'undefined' && json['redirect'] != "") ||
                 (typeof json['token_error'] != 'undefined' && json['token_error'] != "")) {
                window.location.href= json['redirect'];
            }
            else if (typeof json['status'] != 'undefined' && json['status'] == 200) {
                $('#list_id').html(json['data']);
                $('#list_id').trigger("chosen:updated");
            }
        },
        error: function (response) {
            alertPopup(response.responseText);
        },
        failure: function (response) {
            alertPopup(response.responseText);
        }
    });
    return false;

}

function bulkEmailCommunicationApplication(){
    $('div.loader-block').hide();
    var total_count = $('#tot_records').text();
    var all_records = $('#all_records_val').val();
    var data = $('#FilterApplicationForms').serializeArray();
    data.push({name: "total_count", value: total_count});
    data.push({name: "all_records", value: all_records});
    $.ajax({
        url: '/communications/bulk-email-communication',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () {
            $('div.loader-block-lead-list').show();
        },
        success: function (data) {
            $('div.loader-block-lead-list').hide();
            $('#bulkloader').show();
            $('#bulk_communication_html').html(data);
            //$.material.init();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function bulkSmsCommunicationApplication(){
     $('div.loader-block').hide();
    $('#bulkloader').show();
    var data = $('#FilterApplicationForms').serializeArray();
    var total_count = $('#tot_records').text();
    data.push({name: "total_count", value: total_count});
     $.ajax({
        url: '/communications/bulk-sms-communication',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#bulk_communication_html').html(data);
            //$.material.init();
            $('div.loader-block').hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function labelPrintingSendAction(){
    showLoader();
    var display_popup = false;
    $('input:checkbox[name="selected_users[]"]').each(function () {
        if(this.checked){
            display_popup = true;
        }
    });
    var select_all = $('#select_all:checked').val();
    if(display_popup || select_all == 'select_all'){
        // display bulk action popup
        $('#labelPrintingSendAction').modal();
        $.ajax({
        url: '/applications/label-printing-send',
        data: $('#FilterApplicationForms').serializeArray(),
        dataType: "json",
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                window.location.href= json['redirect'];
            }
            else if (typeof json['status'] != 'undefined' && json['status'] == 200) {
                jQuery('#labelPrintingSendContainer').html(json['html']);
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
                $('.chosen-select').trigger('chosen:updated');
				floatableLabel();
            }
        },
        error: function (response) {
            alertPopup(response.responseText);
        },
        failure: function (response) {
            alertPopup(response.responseText);
        }
    });
    hideLoader();
    }else{
        hideLoader();
        alertPopup('Please select User','error');
    }
    return false;
}

function labelDownloadPrint(type){
    $('#disperror').remove();
    var template_id = $('#print_template_id').val();
    if(typeof template_id !='undefined' && template_id>0){
        var $form  = $('#FilterApplicationForms');
//        var $form1 = $("#FilterApplicationForms");
        var action = $form.attr("action");
        $form.attr("action",'/communications/label-download-print');
        $form.append($("<input>").attr({"value":type, "name":"print_download",'type':"hidden","id":"print_download"}));
        $form.append($("<input>").attr({"value":template_id, "name":"template_id",'type':"hidden","id":"template_id"}));
//        $form.append($form1.html());
        if(type=='print'){
            $form.attr("target",'newblank');
        }else{
            $form.attr("target",'label_iframe');
        }

        var onsubmit_attr = $form.attr("onsubmit");
        $form.removeAttr("onsubmit");
        $form.submit();
        $form.attr("onsubmit",onsubmit_attr);
        $form.attr("action",action);
//        $("#ViewApplicationForm #advanceFilter").remove();
    }else{
        var html = '<div id="disperror" class="alert alert-danger">Please Select Template</div>';
        jQuery('#labelPrintingSendContainer').append(html);

    }
    return false;
}

function SuccessLabelPopup(){
   $("#labelPrintingSendAction .npf-close").trigger( "click" );
    alertPopup('Request Successfully submitted');
    return false;
}

function getStateWiseApplicants() {
    var form_id = $('#snapshot-form-list').val();
    if($('.parent-graph-tab li a.state-wise-container').hasClass('country')) {
        var findParam = 'country';
    } else if($('.parent-graph-tab li a.state-wise-container').hasClass('state')) {
        var findParam = 'state';
    } else if($('.parent-graph-tab li a.state-wise-container').hasClass('city')) {
        var findParam = 'city';
    }
    var councellor_id = 0;
    if($('#councellor_id').length>0){
        councellor_id = $('#councellor_id').val();
    }
    if(typeof findParam != 'undefined' && form_id != 0) {
        var college_id = $('#college_id').val();
        $('.state-wise-container .tab-content').html('');
        $('.state-wise-container .country_selected_id').text('');
        $.ajax({
            url: '/applications/ajaxStateWiseData',
            type: 'post',
            dataType: 'json',
            data: {'college_id': college_id, 'type': findParam, 'form_id':form_id,councellor_id:councellor_id},
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (json) {
                if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                    window.location.href = json['redirect'];
                } else if (typeof json['success'] != 'undefined' && json['success'] == 200) {
                    applicantsMakePieChart(json);
                    if(json['content'].length != 0) {
                        $('#country-wise-download').siblings('.graph-footer-msg').remove();
                        $('#country-wise-download').after('<div class="graph-footer-msg">* Click on the Country/State to view corresponding city-wise chart</div>');
                    }
                }
                hideLoader();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    } else {
        $('#country-wise-chart-graph').html("");
        $('#state-wise-chart-graph').html("");
        $('#city-wise-chart-graph').html("");
    }
 }

 function getFormWiseApplicants() {
    var college_id = $('#college_id').val();
    var form_id = $('#snapshot-form-list').val();
    var councellor_id = 0;
    if($('#councellor_id').length>0){
        councellor_id = $('#councellor_id').val();
    }
    showLoader();
    $.ajax({
        url: '/applications/getFormWiseApplicants',
        type: 'post',
        dataType: 'json',
        data: {'college_id': college_id, form_id:form_id,councellor_id:councellor_id},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                window.location.href = json['redirect'];
            } else if (typeof json['success'] != 'undefined' && json['success'] == 200) {
                if(json['showGraph']==true) {
                    json['pdf_h3'] = $('#snapshot-form-list option:selected').text();
                    makeColumnBarGraph(json);
                } else {
                    $('#'+json['id_container']).html('<div>No data found!</div>');
                }
            }
            hideLoader();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
 }

function getStageWiseUserRegister() {
    var college_id = $('#college_id').val();
    var form_id = $('#snapshot-form-list').val();
    //var range_value = $('#final-registration-date').val();
    $('#stage-wise-chart-graph').html('');
    showLoader();
    var councellor_id = 0;
    if($('#councellor_id').length>0){
        councellor_id = $('#councellor_id').val();
    }
    $.ajax({
        url: '/applications/ajaxStageWiseApplications',
        type: 'post',
        dataType: 'json',
        data: {'collegeId': college_id, 'formId':form_id,councellor_id:councellor_id},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                window.location.href = json['redirect'];
            } else if (typeof json['success'] != 'undefined' && json['success'] == 200) {
                if(typeof json['content']=='object' && json['content'].length > 1){
                    makeBarGraph(json);
                }else{
                    $('#stage-wise-chart-graph').html('<img src="/img/line_no_data_image.jpg">')
                }
            }
            hideLoader();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

 function checkCollegeConfigRegistration(college_id, callFrom){
    if (college_id.length <= 0) {
        college_id = 0;//blank colleage id
    }
    if($('.parent-graph-tab li a.state-wise-container').hasClass('country')) {
        $('.parent-graph-tab li a.state-wise-container').removeClass('country');
    } else if($('.parent-graph-tab li a.state-wise-container').hasClass('state')) {
        $('.parent-graph-tab li a.state-wise-container').removeClass('state');
    } else if($('.parent-graph-tab li a.state-wise-container').hasClass('city')) {
        $('.parent-graph-tab li a.state-wise-container').removeClass('city');
    }
    graphMakeDisabledFields('all', callFrom);
    $.ajax({
        url: '/leads/checkCollegeConfigRegistration',
        type: 'post',
        dataType: 'json',
        data: {'college_id': college_id,'downloadtype':'Applications'},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
//        beforeSend: function () { showLoader(); },
        async:true,
//        complete: function () { hideLoader(); },
        success: function (json) {
            if (typeof json['redirect'] !== 'undefined' && json['redirect'] !== "") {
                window.location.href = json['redirect'];
            } else if (typeof json['status'] !== 'undefined' && json['status'] === 200 && typeof json['existvalue'] !== 'undefined') {
               if(json['existvalue']['key'] === 'country') {
                   $('.parent-graph-tab li a.state-wise-container').parent().show();
                   $('.parent-graph-tab li a.state-wise-container').addClass('country');
               } else if(json['existvalue']['key'] === 'state') {
                   $('.parent-graph-tab li a.state-wise-container').parent().show();
                   $('.parent-graph-tab li a.state-wise-container').addClass('state');
               } else if(json['existvalue']['key'] === 'city') {
                   $('.parent-graph-tab li a.state-wise-container').parent().show();
                   $('.parent-graph-tab li a.state-wise-container').addClass('city');
               }
            } else {
                $('.parent-graph-tab li a.state-wise-container').parent().hide();
                $('.parent-graph-tab li a.state-wise-container').parent().removeClass('active');
                $('.parent-graph-tab li a.state-wise-container').removeClass('active');

                $('.parent-graph-tab li a.application-container').parent().show();
                $('.parent-graph-tab li a.application-container').parent().addClass('active');
                $('.parent-graph-tab li a.application-container').addClass('active');
            }
            if(typeof json['downloadRequestListModule'] !== 'undefined' && json['downloadRequestListModule'] == 1){
                 $('#showlink').hide();
            }
            if(typeof json['downloadUrl'] !== 'undefined' && json['downloadUrl'] !== ''){
                $('#downloadListing').attr('href',json['downloadUrl']);
            }
            if(typeof json['downloadexcelUrl'] !== 'undefined' && json['downloadexcelUrl'] !== ''){
                $('#downloadListingExcel').attr('href',json['downloadexcelUrl']);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}


function applicantsMakePieChart(json) {
    if(json['content'].length == 0 && typeof json['type'] != 'undefined' && (json['type'] == 'country' || json['type'] == 'state')) {
       $('#'+json['id_container']).html('<h4 class="text-danger">Data Not Found</h4>');
    } else {
		if (document.documentElement.clientWidth < 767) {
			width="";
		}else{
			width=500;
		}
        google.charts.load('current', {
            callback: function () {
            var type = json['type'];
            // Create the data table.
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Name');
            data.addColumn('number', 'Count');
            data.addRows(json['content']);
            // Set chart options
            var options = {
                title: json['title'],
                titleTextStyle: {
                    color: '#333',
                    fontSize: '16'
                },
                height: 350,
                width: width,
                pieHole: 0.5,
                colors: ['#00b0f0', '#ffc000', '#92d050', '#93cddd', '#e46c0a', '#8a56e2', '#e25668', '#e256ae', '#56e2cf', '#e0c933'],
                legend: {position:'right', alignment:'center'}
            };
            if(json['clickingvalue'] == 'Others') {
                $('#'+json['id_container']).html('');
            } else {
                $('#'+json['id_container']).html('<h4 class="text-danger">Data Not Found</h4>');
            }

            // Instantiate and draw our chart, passing in some options.
            if(json['content'].length >= 1) {
                var chart = new google.visualization.PieChart(document.getElementById(json['id_container']));
                google.visualization.events.addListener(chart, 'ready', downloadGraphAPI);
                var selectedval = 0;
                if(type != 'none') {
                    function selectHandler() {
                        if(type == 'state') {
                            if($('.country_selected_id').length) {
                                var selectedval = $('.country_selected_id').text();
                            }
                        }
                        var selectedItem = chart.getSelection()[0];
                        if(typeof selectedItem != 'undefined') {
                            var clickingvalue = data.getValue(selectedItem.row, 0);
                        } else {
                            clickingvalue = json['maxRecordName'];
                        }
                        var college_id = json['college_id'];
                        var form_id = $('#snapshot-form-list').val();
                        var selectedval = $('.country_selected_id').html();
                        showLoader();
                        $.ajax({
                            url: '/applications/ajaxStateWiseData',
                            type: 'post',
                            dataType: 'json',
                            data: {'college_id': college_id, 'type':type, 'form_id':form_id, 'clickingvalue':clickingvalue, 'selectedval':selectedval},
                            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                            success: function (json) {
                                if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                                    window.location.href = json['redirect'];
                                } else if (typeof json['success'] != 'undefined' && json['success'] == 200) {
                                    applicantsMakePieChart(json);
                                    if(typeof json['selected'] != 'undefined' && type == 'state') {
                                        $('.country_selected_id').text(json['selected']);
                                    }
                                }
                                hideLoader();
                            },
                            error: function (xhr, ajaxOptions, thrownError) {
                                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                            }
                        });
                    }
                    google.visualization.events.addListener(chart, 'ready', selectHandler);
                    google.visualization.events.addListener(chart, 'select', selectHandler);
                }
                var imageId = 'img-'+json['id_container'];
                google.visualization.events.addListener(chart, 'ready', function () {
                    $("#"+imageId).remove();
                    png = '<img id ="'+imageId+'" src="' + chart.getImageURI() + '"/>';
                    $('#pdf-'+json['id_container']).append(png);
                });
                google.visualization.events.addListener(chart, 'select', function () {
                    $("#"+imageId).remove();
                    png = '<img id ="'+imageId+'" src="' + chart.getImageURI() + '"/>';
                    $('#pdf-'+json['id_container']).append(png);
                });
                chart.draw(data, options);
                chart.setSelection([{row:0}]);
            }
        },
        'packages':['corechart']
        });


    }
}

//In Lead list when form will select from the filter select dropdown then dynamically set the form id in hiddenFormId hidden input
$(document).on('click','#FilterApplicationForms #single_lead_add, #CreateLeadStartBtn, #CreateLeadPopupBtn', function (){


    if ( $.trim($('#college_id').val())>0 && ($.trim($('#form_id').val())>0 || $('#allowToViewAsApplicantPermission').val() == 1)) {
        if(this.id=='CreateLeadPopupBtn'){
            //reset email & mobile value
            $('form#CreateLeadForm input#Email, form#CreateLeadForm input#Mobile').val('');
//            $('#create-lead').modal('toggle');
            showAddQuickLeadPopup();
        }
        $("#CreateleadBtn").hide();
        $('#hiddenCollegeId').val($.trim($('#college_id').val()));
        $('#hiddenFormId').val($.trim($('#form_id').val()));
        $.ajax({
            url: '/common/getCountryDialCode',
            type: 'post',
            dataType: 'html',
            data: {'form_id':$.trim($('#form_id').val()),'college_id':$.trim($('#college_id').val())},
            async: true,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            beforeSend: function () {
                $('.modalLoader').show();
				$('#CreateLeadPopupBtn').addClass('disabled');
            },
            success: function (data) {
                $('div.loader-block-lead-list').hide();
                $("#CreateleadBtn").show();
				$('.modalLoader').hide();
                var response=data.split("||");
                if($.trim(response[2]) != ''){
                     if($.trim(response[0]) != '') {//if mobile enabled

                        $('#ShowHidePhone').html('');
                        $('#showWithDialCode').html('<div class="input-group labelUpContainer"><div class="input-group-btn bs-dropdown-to-select-group"><button type="button" class="btn btn-default dropdown-toggle as-is bs-dropdown-to-select" data-toggle="dropdown" style="margin-right:-1px;height:38px;"><span data-bind="bs-drp-sel-label">+91</span><input name="country_dial_code" data-bind="bs-drp-sel-value" value="+91" type="hidden"><span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button><div class="dropdown-menu"><input name="filter" class="search_box_code" onkeyup="javascript:filterDialCode()" id="filter_dial_code" type="text"><ul class="dropdown-menu-list" role="menu" id="ul_dial_code"></ul></div></div><input name="mobile" id="Mobile" placeholder="Mobile Number*" autocomplete="false" maxlength="10" class="form-control" type="text"><span class="help-block" style="font-size:12px;"></span></div></div></div>');
                        $('#ul_dial_code').html(response[0]);
                    } else {
                        //$('#ul_dial_code').html(response[0]);
                        $('#showWithDialCode').html('');
                        $('#ShowHidePhone').html('<div class="labelUpContainer"><input name="mobile" id="Mobile" autocomplete="false" maxlength="10" class="form-control" type="text" placeholder="Mobile Number*" ><span class="help-block" style="font-size:12px;"></span></div></div>');
                    }
                }else{
                    $('#showWithDialCode').html('');
                    $('#ShowHidePhone').html('');
                }

                //setting hidden form field on basis of mobile field configured
                $('#isMobileEnabled').val($.trim(response[2]));
                $('#isMobileRequired').val($.trim(response[3]));
                if($.trim(response[3]) == ''){
                    $('label.Mobile span.required').html('');
                }
               floatableLabel();
			   $('#CreateLeadPopupBtn').removeClass('disabled');

                if($("#ShowWildCardUserBox").length>0){
                    $("#ShowWildCardUserBox").appendTo("body");
                }
            },

            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        return false;

    }else if($.trim($('#college_id').val())=='' || $.trim($('#college_id').val())== '0') {
        alertPopup("Please Select College","error");
    }else if($.trim($('#form_id').val())=='' || $.trim($('#form_id').val())== '0') {
        alertPopup("Please Select Form","error");
    }
});

function showAddQuickLeadPopup(){
    $("#Mobile_error, #Email_error").html("");
    $("#Mobile_error, #Email_error").hide();
    var college_id = $.trim($("#college_id").val());
    var form_id = $.trim($("#form_id").val());

    if($("#ShowWildCardUserBox").length>0){
        $("#ShowWildCardUserBox").remove();
    }

    $.ajax({
        url: '/leads/show_lead_registration_fields',
        type: 'post',
        dataType: 'html',
        data: {'college_id':college_id,'form_id':form_id,'ctype':'application'},
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
                $('#add_quick_leadpopup').html(html);
                //$('#addQuickLeadDiv').css('width','770px');
                $('#addQuickLeadDiv .modal-title').text('Upload Single Application');
                $('#showAddQuickLeadPopUp').trigger('click');
				$('body').addClass('vScrollRemove');
				$('.offCanvasModal').on('hide.bs.modal', function () {
				  $('body').removeClass('vScrollRemove');
				})
                $('.chosen-select').chosen();
                $('.chosen-select').trigger('chosen:updated');
            }
            $('[data-toggle="tooltip"]').tooltip();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

}

/*
 * select filter for get value form url
 */
function filterSelectFromUrl(filterOption){
    var url_filter = jsVars.url_filter;
    if(typeof url_filter.search_common != 'undefined'){
        $('#search_common').val(url_filter.search_common);
    }

//    jQuery('#filter_li_list li ul li label').find('input').each(function(){
//            var v = jQuery(this).val();//values
//            for(var i=0;i<filterOption.length;i++){
//                if(v.indexOf(filterOption[i])>=0){//check key match
//                    if(typeof filterOption[i] != "undefined" && filterOption[i] !=''){//check
//
//                           this.checked=true;
//
//                    } //check
//                }//end if
//            }
//    });

    //createFilterApplication();// call apply button
    //assign value
    if(filterOption.length>0){
        for(var i=0;i<filterOption.length;i++){
            var key = 'filter['+filterOption[i]+']';
            if($('input[name="'+key+'"]').length) {//text box
                $('input[name="'+key+'"]').val(url_filter[filterOption[i]]);

            }else if($('select[name="'+key+'"]').length) {//dropdown
               $('select[name="'+key+'"]').val(url_filter[filterOption[i]]);
                if (typeof url_filter['u|traffic_channel'] != 'undefined' && url_filter['u|traffic_channel'] > 1 && (url_filter['u|traffic_channel']!='9' && url_filter['u|traffic_channel']!='8')) {
                    var college_id = $('#college_id').val();
                    if (typeof college_id != 'undefined' && college_id != "") {
                        getReferrerList(college_id, url_filter['u|traffic_channel']);
                    }
                }else if(typeof url_filter['u|traffic_channel'] != 'undefined' && url_filter['u|traffic_channel'] == '9'){
                    var college_id = $('#college_id').val();
                    if (typeof college_id != 'undefined' && college_id != "") {
                        getOfflineSourceList(college_id);
                    }
                }
                if(filterOption[i] == "campu|source_value"){//get source_value list
                   get_publisher_id = $(".publisher_filter").val();
                   getCompaignsSource(get_publisher_id, "source_value", 'publisher_id',url_filter[filterOption[i]]);
                }
               if(filterOption[i] == "campu|medium_value"){//get medium_value list
                   $('select').trigger('chosen:updated');//update dropdown
                   get_source_value=$("select[name='filter[campu|source_value]']").val();
                   getCompaignsMedium(get_source_value,url_filter[filterOption[i]]);
               }
               if(filterOption[i] == "campu|name_value"){//get name_value list
                   get_medium_value=$("select[name='filter[campu|medium_value]']").val();
                   getCompaignsName(get_medium_value,url_filter[filterOption[i]]);
               }
               //conversion
               if(filterOption[i] == "campap|conversion_source_value"){//get source_value list
                   get_publisher_id = $("select[name='filter[pub|publisher_id]']").val();
                   getCompaignsSource(get_publisher_id, "source_value", 'publisher_id',url_filter[filterOption[i]],'conversion');
               }
               if(filterOption[i] == "campap|conversion_medium_value"){//get medium_value list
                   $('select').trigger('chosen:updated');//update dropdown
                   get_source_value=$("select[name='filter[campap|conversion_source_value]']").val();
                   getCompaignsMedium(get_source_value,url_filter[filterOption[i]],'conversion');
               }
               if(filterOption[i] == "campap|conversion_name_value"){//get name_value list
                   get_medium_value=$("select[name='filter[campap|conversion_medium_value]']").val();
                   getCompaignsName(get_medium_value,url_filter[filterOption[i]],'conversion');
               }
            }
           $('select').trigger('chosen:updated');//update dropdown
        }
     }//end
    var pval=$('#payment_status').val();
    if(pval=='payment_pending'){
        $("#show_payment_intiated_status").show();
    }else{
        $("#show_payment_intiated_status").hide();
    }
    callTrigger("id","seacrhList");//call search button tigger
}

function getOfflineSourceList(college_id){
     if(college_id){
        var html  = "<option value=''>Publisher/Referrer</option>";
            html  += "<option value='1' >Offline</option>";
                $("#publisher_filter").html(html);
                $('#publisher_filter').trigger('chosen:updated');
                $('#publisher_filter').val("1");
    }
}

function callTrigger(attrtype, attrname) {
    var t = '';
    if (attrtype == 'id') {
        t = $("#" + attrname)
    } else if (attrtype == 'class') {
        t = $("." + attrname)
    } else {
        t = attrtype;
    }

    t.trigger('click');
}

function graphMakeDisabledFields(type, callFrom){
    if(type == 'show') {
        $('#if_record_exists #items-no-show').removeAttr('disabled');
        $('#if_record_exists #sort_order').removeAttr('disabled');
        $('#if_record_exists .btn-for-a-view').removeAttr('disabled');
        $('#if_record_exists .action-btn-select button').removeAttr('disabled');
        $('.hide_extraparam').show();
    } else if(type == 'hide'){
        $('#if_record_exists #items-no-show').attr('disabled','disabled');
        $('#if_record_exists #sort_order').attr('disabled','disabled');
        $('#if_record_exists .btn-for-a-view').attr('disabled','disabled');
        $('#if_record_exists .action-btn-select button').attr('disabled','disabled');
        $('.hide_extraparam').hide();
    } else {
        $("#load_more_results").html('');
        $('#load_more_button').hide();
        $(".if_record_exists").hide();
        if(callFrom == 'resetFilter'){
            $('#load_msg').html('');
        }else{
            $('#load_msg').html('Please click apply button to view Applications.');
            $('#load_msg_div').show();
        }

        $('.tab-content').html("");
        $('.country_selected_id').text("");
        $('#table-data-view').show();
        $('#snapshot-data-view').hide();
        $('#if_record_exists').hide();
        $('.tablViewtab li').removeClass('active');
        $('.tablViewtab li a').removeClass('active');
        $('#table-view').addClass('active');
        $('#table-view').parent().addClass('active');
        $('#line-chart-graph, #country-wise-chart-graph, #state-wise-chart-graph, #city-wise-chart-graph, #country_selected_id, #form-wise-chart-graph, #stage-wise-chart-graph').empty();
        $('.parent-graph-tab li').removeClass('active');
        $('.parent-graph-tab li a').removeClass('active');
        $('.parent-graph-tab li:first').addClass('active');
        $('.parent-graph-tab li:first a').addClass('active');

        $('.graph-container li').removeClass('active');
        $('.graph-container li a').removeClass('active');
        $('.graph-container li:first').addClass('active');
        $('.graph-container li:first a').addClass('active');
        $('.graph-container').show();
        $('.state-wise-applications h3').remove();
        $('.graph-footer-msg').remove();
//        $('.parent-graph-tab .application-container').text('Day-wise Applications');
    }
    $('.chosen-select').trigger('chosen:updated');
}

function pushApplication(){
//    showLoader();

    var display_popup = false;
    $('input:checkbox[name="selected_users[]"]').each(function () {
        if(this.checked){
            display_popup = true;
        }
    });
    var select_all = $('#select_all:checked').val();
    if(display_popup || select_all == 'select_all'){

        $("#ConfirmPopupArea").css({'z-index':'120000'});
        $('#ConfirmMsgBody').html('Are you sure you want to mark offline payment?');
        $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();
                $('#ConfirmPopupArea').modal('hide');
                    var total_count = $('#tot_records').text();
                    var data = $('#FilterApplicationForms').serializeArray();
                    data.push({name: "total_count", value: total_count});
                    $.ajax({
                        url: '/leads/pushApplications',
                        type: 'post',
                        dataType: 'json',
                        data: data,
                //        async: false,
                        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                        beforeSend: function () {
                            $('div.loader-block-lead-list').show();
                        },
                        success: function (json) {
                            $('div.loader-block-lead-list').hide();
                            console.log(json)
                           if(typeof json['redirect'] != 'undefined' && json['redirect']!=''){
                               window.location = json['redirect'];
                           }else if(typeof json['error'] != 'undefined' && json['error']!=''){
                               alertPopup(json['error'],'error');
                           }else if(typeof json['success'] != 'undefined' && json['success']==200){
                               alertPopup('Successfully moved','success');
                           }else{
                               alertPopup('Error!','error');
                           }
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                        }
                    });

        });
    }else{
        hideLoader();
        alertPopup('Please select User','error');
    }

    return false;
}

jQuery(window).load(function(){
 jQuery(".initHide").addClass('initShow');
});

function getRangeWiseApplications(){
    $('.application-date-range').show();
    var college_id = $('#college_id').val();
    var form_id = $('#snapshot-form-list').val();
    var range_value = $('#final-registration-date').val();
    var range_type_view = $('.range-tab-active a.active').text();
    var councellor_id = 0;
    if($('#councellor_id').length>0){
        councellor_id = $('#councellor_id').val();
    }
    showLoader();
    $.ajax({
        url: '/applications/ajaxRangeWiseApplications',
        type: 'post',
        dataType: 'json',
        data: {'college_id': college_id, 'form_id':form_id, 'range_value': range_value, 'range_type_view': range_type_view,councellor_id:councellor_id},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                window.location.href = json['redirect'];
            } else if (typeof json['success'] != 'undefined' && json['success'] == 200) {
                json['pdf_center'] =  'Date Range - '+$('#final-registration-date').val().replace(',', ' to ');
                json['pdf_h3'] = 'Applications Trend - '+ $('.range-tab-active a.active').text();
                makeLinearGraph(json);
                if(json['content'].length != 0) {
                    $('#line-chart-graph').siblings('.graph-footer-msg').remove();
                    $('#line-chart-graph').after('<div class="graph-footer-msg">* The plot represents only those Applicants who have successfully made the payment.</div>');
                }
            }
            hideLoader();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function applicationsSelectAll(elem){
    $('div.loader-block').show();
    if(elem.checked){
        //console.log(elem.checked);
        $('.select_application').each(function(){
            this.checked = true;
        });
    }
    $('div.loader-block').hide();
}

// determineDropDirection
/*function determineDropDirection(){
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
determineDropDirection();
$(window).scroll(determineDropDirection);*/

function downloadCustomCsvFormApplication(){

    $('.customCsvDownload').on('click', function(e) {
        var $form = $('#FilterApplicationForms');
//        var $form1 = $('#FilterApplicationForms');
        var csv_id=$(this).data('id');
        $form.attr("action",jsVars.FULL_URL+'/applications/download-custom-csv-form-application');
        $form.attr("target",'modalIframe');
        $form.append($("<input>").attr({"value":"export", "name":"export",'type':"hidden","id":"export"}));
        $form.append($("<input>").attr({"value":csv_id, "name":"csv_id",'type':"hidden","id":"csv_id"}));
//        $form.append($form1.html());
        var onsubmit_attr = $form.attr("onsubmit");
        $form.removeAttr("onsubmit");
        var data = $form.serializeArray();

       // $form.submit();
        $form.ajaxSubmit({
            url: jsVars.FULL_URL+'/applications/download-custom-csv-form-application',
            type: 'post',
            data : data,
            dataType:'json',
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            success:function (data){

                if(data['error'] && data['error']=="session"){
                    window.location = jsVars.LOGOUT_PATH;
                }else if(data['error']){
                    if(data['error'].indexOf('request_already_pending|||') >= 0){
                       data['error'] =  data['error'].split('request_already_pending|||')[1];
                    }
                    alertPopup(data['error'],'error');
                }else{
                    $('#downloadListing').attr('href', data.downloadUrl);
                    $('#requestMessage').html('custom csv download');
                    $('#muliUtilityPopup').modal('show');
                    $('#muliUtilityPopup .close').addClass('npf-close').css('margin-top', '2px');
                    $('#downloadListing').show();
                    $('#downloadListingExcel').hide();
                }

            }
        });
        $form.attr("onsubmit",onsubmit_attr);
        $form.find('input[name="export"]').remove();
        $form.find('input[name="csv_id"]').remove();
        $form.removeAttr("target");
//        $("#ViewApplicationForm #advanceFilter").remove();
    });
    $('#myModal').on('hidden.bs.modal', function(){
        $("#modalIframe").html("");
        $("#modalIframe").attr("src", "");
    });


}

function LoadFormsOnApplication(value, default_val,multiselect,module) {
    if(typeof multiselect =='undefined'){
        multiselect = '';
    }
    if(typeof module === 'undefined'){
        module = '';
    }
    var asyncvalue = true;
    if(default_val !== '' && default_val != '0'){
        asyncvalue = false;
    }
    if(module === 'renderSavedFilter'){
        asyncvalue = false;
//        if(default_val !== '' && default_val != '0'){
//            filterColumnOptionsCollegeApplication(value , default_val, module);
//        }
    }
    $.ajax({
        url: '/voucher/get-forms',
        type: 'post',
        dataType: 'html',
        async: asyncvalue,
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "college_id": value,
            "default_val": default_val,
            "multiselect":multiselect
        },
        beforeSend: function () {  showFilterLoader(); },
        complete: function () { hideFilterLoader(); },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        //async:false,
        success: function (data) {
            if(data=="session_logout"){
                window.location.reload(true);
            }
            $('#div_load_forms').html(data);
            $('.div_load_forms').html(data);

            if(module === 'Application' || module === 'renderSavedFilter'){
                $("#form_id").find('option[value="0"]').text("Select Form Name");
            }
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            // Change Select box Caption for discount coupon module
            if(module === 'Discount Coupon'){
                $("#form_id_chosen input").val("Select Form");
            }
            //console.log(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


/**
 *
 * @param {type} college_id
 * @param {type} tfc traffic chanel
 * @returns {Boolean}
 */
function getReferrerList(college_id,tfc){
    var htmlOption = '<option value="">Publisher/Referrer</option>';
    $.ajax({
        url: '/campaign-manager/get-referrer-list',
        type: 'post',
        dataType: 'html',
        //async: false,
        data: {'college_id': college_id,'traffic_channel':tfc},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {


            var responseObject = $.parseJSON(json);
            if(responseObject.status === 1) {
                if(typeof responseObject.data.sourceList === "object"){

                    var sourceList    = responseObject.data.sourceList;
                    $.each(sourceList, function (index, item) {
                        htmlOption +='<option value="'+index+'">'+item+'</option>';
                    });
                    $("#publisher_filter").html(htmlOption);
                    if(typeof jsVars.url_filter !== 'undefined'){
                        var url_filter = jsVars.url_filter;
                        $("#publisher_filter").val(url_filter['pub|publisher_id']);
                    }
                    $('#publisher_filter').trigger('chosen:updated');
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
        }
    });

    return false;
}

//show when payment sttaus is pending
$("#payment_status").on('change',function(){
    $('#payment_initiated_status').val('');
    var pval=$(this).val();
    if(pval=='payment_pending'){
        $("#show_payment_intiated_status").show();
    }else{
        $("#show_payment_intiated_status").hide();
    }
    //$('#show_payment_intiated_status').trigger('chosen:updated');
    $('#payment_initiated_status').selected = false;
    $('#payment_initiated_status').val('');
    $('#payment_initiated_status').trigger("chosen:updated");
});

$(document).on('change', "select[name='filter[u|lead_type]']", function () {
    showHideWidgetFilter();
});

function showHideWidgetFilter(){
    var leadType    = $("select[name='filter[u|lead_type]']").val();
    if($("select[name='filter[u|widget_id]']").length > 0){
        $("select[name='filter[u|widget_id]']").val('');
    }
    if(leadType=='4'){
        if($("select[name='filter[u|widget_id]']").length > 0){
            $("select[name='filter[u|widget_id]']").parent().parent("div.div_filter_campain").show();
        }else{
            if($('input[data-input_id="widget_id"]').length > 0){
                $('input[data-input_id="widget_id"]').trigger('click');
                createFilterApplication();
                $('input[data-input_id="widget_id"]').parent().parent("li").remove();
            }
        }
    }else{
        if($("select[name='filter[u|widget_id]']").length > 0){
            $("select[name='filter[u|widget_id]']").parent().parent("div.div_filter_campain").hide();
        }
    }
}

// this function is used when there is mobile dial country code is selected in form applicant
function filterDialCode() {
    var value = $('#filter_dial_code').val();
    value = value.toLowerCase();
    $("#ul_dial_code > li").each(function() {
        if ($(this).text().toLowerCase().search(value) > -1) {
//            $(this).text(src_str);
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });
}


//For Dropdown Menu Country Dial Code
$(document).ready(function(e){
    $( document ).on( 'click', '.bs-dropdown-to-select-group .dropdown-menu-list li', function( event ) {
    	var $target = $( event.currentTarget );
        var fieldId = $target.closest('.bs-dropdown-to-select-group').parent().find('input.mobile-type-field').attr('id');
		$target.closest('.bs-dropdown-to-select-group')
			.find('[data-bind="bs-drp-sel-value"]').val($target.attr('data-value'))
			.end()
			.children('.dropdown-toggle').dropdown('toggle');
		$target.closest('.bs-dropdown-to-select-group')
                //.find('[data-bind="bs-drp-sel-label"]').text($target.context.textContent);
    		.find('[data-bind="bs-drp-sel-label"]').text($target.attr('data-value'));

                //Bydefault remove the value when value will change
                $('#' + fieldId).val('');

                //For change Maxlength value of Mobile Input Box as per selection of country code
                if ($target.attr('data-value') == '+91') {
                    $('#' + fieldId).attr('maxlength', 10);
                } else {
                    $('#' + fieldId).attr('maxlength', 16);
                }

                //When Select the option from dropdown then close the open dropdown
                $target.closest('.bs-dropdown-to-select-group').removeClass('open');

		return false;
	});

        /********************REDIRECT DOWNLOAD REQUEST PAGE*********************/
             var urlSplit=window.location.pathname.split('/');
            if(urlSplit[3] !='' && urlSplit[3]!=undefined){
                checkCollegeConfigRegistration($('#college_id').val(),'changeCollege');
            }
        /**************************END REDIRECT REQUEST PAGE********************/

});

function addDataAttribute(){
    /**
    * Create extra data attribute in filter because from now onwards admin can save the filter
    */
   $('#filter_li_list li input[type="checkbox"]').each(function () {
      var value=$(this).val();
      var exp_data=value.split('||');
      if(typeof exp_data[0] !== 'undefined' && exp_data[0] !='') {
          $(this).attr('data-filter_value',exp_data[0]);
      }
   });

   /**
    * Create extra data attribute in view because from now onwards admin can save the view
    */
   $('#column_li_list li input[type="checkbox"]').each(function () {
       var value=$(this).val();
       var exp_data=value.split('||');
       if(typeof exp_data[0] !== 'undefined' && exp_data[0] !='') {
           $(this).attr('data-filter_value',exp_data[0]);
       }
   });
}


function filterDefault(reload_filter_list=false) {
    $('#smart_view_li_list li a.columnList').removeClass('makeActive');
    $('.default-filterlist').addClass('makeActive');
    if($('#college_id').val()===''){return false;}

    var college_id=$('#college_id').val();

    ResetFilterValue();
    $('#sort_options').val('');
    $('#savedFilterList').trigger('click');
    $("#college_id").val(college_id);
    $("#college_id").trigger('chosen:updated');
//
    $('#CreateLeadStartBtn').hide();
//    LoadFormsOnApplication(college_id,'');
//
//    //filterColumnOptionsCollegeApplication(college_id);
//
//    $('#seacrhList').trigger('click');
    $('.default-txt-view').text('System Default View');
    LoadFormsOnApplication(college_id,'','','Application');
    filterColumnOptionsCollegeApplication(college_id,'','changeCollege');
    if(reload_filter_list){
        getSavedFilterList(college_id,'application','smart_view','smart_view_li_list');
    }
//    if (typeof jsVars.s_college_id === 'undefined' || parseInt(jsVars.s_college_id) === 0) {
//        LoadMoreApplication('reset');
//    }
    LoadMoreApplication('reset');
};


function GetGdpiChildByMachineKey(key,ContainerId,Choose){
    if(key && ContainerId){

       if(typeof Choose == 'undefined'){
           Choose = '';
       }

        $.ajax({
            url: '/gdpi/getGdpiChildrenList',
            type: 'post',
            dataType: 'json',
            data: {key:key},
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                if(json['redirect']){
                    location = json['redirect'];
                }
                if(json['error']){
                    alertPopup(json['error'],'error');
                }
                else if(json['success']){

                    var html = '<option value="">Select '+Choose+'</option>';
                    if(Choose === 'address'){
                        $('#gd_pi_time_slot').html('<option value="">Select slot</option>');
                    }

                    for(var key in json['list']){
                        html += '<option value="'+key+'">'+json['list'][key]+'</option>';
                    }
                    $('#'+ContainerId).html(html);
                    $('.chosen-select').chosen();
                    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                    $('.chosen-select').trigger('chosen:updated');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    } else {
        if(Choose === 'address'){
            $('#venue_address').html('<option value="">Select address</option>');
            $('#gd_pi_time_slot').html('<option value="">Select slot</option>');
        }
        if(Choose === 'slot'){
            $('#gd_pi_time_slot').html('<option value="">Select slot</option>');
        }
        $('.chosen-select').chosen();
        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        $('.chosen-select').trigger('chosen:updated');
    }
}


function getCityByStateCityPincode(chooseVal, html_field_id, college_id){
    if(html_field_id == 'correspondence_state' && $('select#correspondence_city').length && $('select#correspondence_district').length === 0){
        $('#correspondence_city').html('<option value="">Correspondence City</option>').trigger('chosen:updated');
        if(typeof chooseVal == 'undefined' || chooseVal == ""){
            return;
        }
        if($('select#correspondence_country option').length == 2){
            $.ajax({
                url: '/applications/getCityByStateCityPincode',
                type: 'post',
                dataType: 'json',
                data: {state:chooseVal},
                headers: {
                    "X-CSRF-Token": jsVars._csrfToken
                },
                success: function (json) {
                    if(json['redirect']){
                        location = json['redirect'];
                    }
                    if(json['error']){
                        alertPopup(json['error'],'error');
                    }
                    else if(json['success']){

                        var html = '<option value="">Correspondence City</option>';
                        for(var key in json['list']){
                            html += '<option value="'+key+'">'+json['list'][key]+'</option>';
                        }
                        $('#correspondence_city').html(html).trigger('chosen:updated');
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        } else {
            GetChildByMachineKey(chooseVal,"correspondence_city","Correspondence City",college_id);
        }
    } else if(html_field_id == 'correspondence_country' && $('select#correspondence_state').length){
        if($('select#correspondence_country option').length == 2){
           return;
        }
        $('select#correspondence_state').html('<option value="">Correspondence State</option>').trigger('chosen:updated');
        if($('select#correspondence_district').length){
            $('select#correspondence_district').html('<option value="">Correspondence District</option>').trigger('chosen:updated');
        }
        if($('select#correspondence_city').length){
            $('select#correspondence_city').html('<option value="">Correspondence City</option>').trigger('chosen:updated');
        }
        if($('select#correspondence_district').length){
            $('select#correspondence_district').html('<option value="">Correspondence District</option>').trigger('chosen:updated');
        }
        if(typeof chooseVal == 'undefined' || chooseVal == ""){
            return;
        }
        GetChildByMachineKey(chooseVal,"correspondence_state","Correspondence State",college_id);
    } else if(html_field_id == 'correspondence_state' && $('select#correspondence_city').length && $('select#correspondence_district').length){
        $('select#correspondence_district').html('<option value="">Correspondence District</option>').trigger('chosen:updated');
        $('select#correspondence_city').html('<option value="">Correspondence City</option>').trigger('chosen:updated');
        if(typeof chooseVal == 'undefined' || chooseVal == ""){
            return;
        }
        GetChildByMachineKey(chooseVal,"correspondence_district","Correspondence District",college_id);
    } else if(html_field_id == 'correspondence_district' && $('select#correspondence_city').length){
        $('select#correspondence_city').html('<option value="">Correspondence City</option>').trigger('chosen:updated');
        if(typeof chooseVal == 'undefined' || chooseVal == ""){
            return;
        }
        GetChildByMachineKey(chooseVal,"correspondence_city","Correspondence City",college_id);
    } else if(html_field_id == 'permanent_state' && $('select#permanent_city').length && $('select#permanent_district').length === 0){
        $('select#permanent_city').html('<option value="">Permanent City</option>').trigger('chosen:updated');
        if(typeof chooseVal == 'undefined' || chooseVal == ""){
            return;
        }
        if($('select#permanent_country option').length == 2){
            $.ajax({
                url: '/applications/getCityByStateCityPincode',
                type: 'post',
                dataType: 'json',
                data: {state:chooseVal},
                headers: {
                    "X-CSRF-Token": jsVars._csrfToken
                },
                success: function (json) {
                    if(json['redirect']){
                        location = json['redirect'];
                    }
                    if(json['error']){
                        alertPopup(json['error'],'error');
                    }
                    else if(json['success']){

                        var html = '<option value="">Permanent City</option>';
                        for(var key in json['list']){
                            html += '<option value="'+key+'">'+json['list'][key]+'</option>';
                        }
                        $('#permanent_city').html(html).trigger('chosen:updated');
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        } else {
            GetChildByMachineKey(chooseVal,"permanent_city","Permanent City",college_id);
        }
    } else if(html_field_id == 'permanent_country' && $('select#permanent_state').length){
        if($('select#permanent_country option').length == 2){
            return;
        }
        $('select#permanent_state').html('<option value="">Permanent State</option>').trigger('chosen:updated');
        if($('select#permanent_district').length){
            $('select#permanent_district').html('<option value="">Permanent District</option>').trigger('chosen:updated');
        }
        if($('select#permanent_city').length){
            $('select#permanent_city').html('<option value="">Permanent City</option>').trigger('chosen:updated');
        }

        if($('select#permanent_district').length){
            $('select#permanent_district').html('<option value="">Permanent District</option>').trigger('chosen:updated');
        }

        if(typeof chooseVal == 'undefined' || chooseVal == ""){
            return;
        }
        GetChildByMachineKey(chooseVal,"permanent_state","Permanent State",college_id);
    } else if(html_field_id == 'permanent_state' && $('select#permanent_city').length && $('select#permanent_district').length){
        $('select#permanent_district').html('<option value="">Permanent District</option>').trigger('chosen:updated');
        $('select#permanent_city').html('<option value="">Permanent City</option>').trigger('chosen:updated');
        if(typeof chooseVal == 'undefined' || chooseVal == ""){
            return;
        }
        GetChildByMachineKey(chooseVal,"permanent_district","Permanent District",college_id);
    } else if(html_field_id == 'permanent_district' && $('select#permanent_city').length){
        $('select#permanent_city').html('<option value="">Permanent City</option>').trigger('chosen:updated');
        if(typeof chooseVal == 'undefined' || chooseVal == ""){
            return;
        }
        GetChildByMachineKey(chooseVal,"permanent_city","Permanent City",college_id);
    }
}

function getCSVMappingList() {
    $.ajax({
        url: '/applications/get-csv-mapping-list',
        type: 'post',
        data: {'college_id':$("#college_id").val(), 'form_id':$("#form_id").val()},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
//            showLoader();
        },
        complete: function () {
//            hideLoader();
        },
        success: function (json) {
            if(typeof json['redirect'] !== 'undefined') {
                location = json['redirect'];
            } else {
                if(typeof json['data'] !== 'undefined') {
                    //remove all Custom li
                    $('li.customListClass').remove();
                    $('#downloadCustomCsvForm').hide();
                    $('ul#actionID').find('li:first').after(json['data']);
                    downloadCustomCsvFormApplication();
                } else {
                    //remove all Custom li
                    $('li.customListClass').remove();
                    //$('#downloadCustomCsvForm').show();
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText,'error');
        }
    });
}

$(document).on('change','#assignedTo',showMessage);
$(document).on('change','#unassignedFrom',showMessage);
function showMessage(){
    var aval = $('#assignedTo').val();
    if(aval=='unassigned'){
        var textUnfrom='';
        $("#unassignedFrom option:selected").each(function() {
            textUnfrom += $(this).text().charAt(0).toUpperCase() + $(this).text().slice(1)+', ';
        });
        if(textUnfrom=='' || textUnfrom==' '){
            $("#assignedToListDiv #ErrorMessageForAssign").remove();
        }else{
            $("#assignedToListDiv #ErrorMessageForAssign").remove();
            $("#assignedToListDiv").append("<p id='ErrorMessageForAssign' style='color:red'>Please note Lead will be unassigned from "+textUnfrom.replace(/,\s*$/, "")+"<p/>");
        }
    }else{
        $("#assignedToListDiv #ErrorMessageForAssign").remove();
    }
}

function rangeInput(html_field_id){
    $('#rangeDiv'+html_field_id).show();
//    $('#min'+html_field_id).prop("disabled", true);
//    $('#max'+html_field_id).prop("disabled", true);
    $(document).bind('focusin.#rangeDiv'+html_field_id+' click.#rangeDiv'+html_field_id,function(e) {
            if ($(e.target).closest('#rangeDiv'+html_field_id+', #'+html_field_id).length) return;
            $(document).unbind('#rangeDiv'+html_field_id);
            $('#rangeDiv'+html_field_id).fadeOut('medium');
    });

    $('#opt1'+html_field_id+',#opt2'+html_field_id).click(function(){
        $('#min'+html_field_id).prop("placeholder", "Minimum Value");
        $('#max'+html_field_id).prop("placeholder", "Maximum Value");
        $('#'+html_field_id).val('');
        $('#min'+html_field_id).val('');
        $('#max'+html_field_id).val('');
        $('#rangeDiv'+html_field_id+' li').removeClass('active');
        $(this).addClass('active');
        $('#max'+html_field_id).prop("disabled", true);
        $('#min'+html_field_id).prop("disabled", false);
    });
    $('#opt3'+html_field_id+',#opt4'+html_field_id).click(function(){
        $('#min'+html_field_id).prop("placeholder", "Minimum Value");
        $('#max'+html_field_id).prop("placeholder", "Maximum Value");
        $('#'+html_field_id).val('');
        $('#min'+html_field_id).val('');
        $('#max'+html_field_id).val('');
        $('#rangeDiv'+html_field_id+' li').removeClass('active');
        $(this).addClass('active');
        $('#max'+html_field_id).prop("disabled", false);
        $('#min'+html_field_id).prop("disabled", true);
    });
    $('#opt5'+html_field_id).click(function(){
        $('#'+html_field_id).val('');
        $('#min'+html_field_id).val('');
        $('#max'+html_field_id).val('');
        $('#min'+html_field_id).prop("placeholder", "Minimum Value");
        $('#max'+html_field_id).prop("placeholder", "Maximum Value");
        $('#rangeDiv'+html_field_id+' li').removeClass('active');
        $(this).addClass('active');
        $('#max'+html_field_id).prop("disabled", false);
        $('#min'+html_field_id).prop("disabled", false);
    });
    $('#opt6'+html_field_id).click(function(){
        $('#'+html_field_id).val('');
        $('#min'+html_field_id).val('');
        $('#max'+html_field_id).val('');
        $('#rangeDiv'+html_field_id+' li').removeClass('active');
        $(this).addClass('active');
        $('#min'+html_field_id).prop("disabled", false);
        $('#max'+html_field_id).prop("disabled", true);
        $('#min'+html_field_id).prop("placeholder", "Enter Value");
        $('#max'+html_field_id).prop("placeholder", "");
    });

    $("#search_btn"+html_field_id).click(function(){
        var value   = $('#rangeDiv'+html_field_id+' li.active').html();
        if( $('#min'+html_field_id).prop("disabled") == false && $('#min'+html_field_id).val() != '' && $('#max'+html_field_id).prop("disabled") == false && $('#max'+html_field_id).val() != ''){
            value   += ' '+$('#min'+html_field_id).val()+', '+$('#max'+html_field_id).val();
        } else if( $('#min'+html_field_id).prop("disabled") == false && $('#min'+html_field_id).val() != '' ){
            value   += ' '+$('#min'+html_field_id).val();
        } else if( $('#max'+html_field_id).prop("disabled") == false && $('#max'+html_field_id).val() != '' ){
            value   += ' '+$('#max'+html_field_id).val();
        }else{
           value    = '';
        }
        $('#'+html_field_id).val(value);
        $('#operator'+html_field_id).val($('#rangeDiv'+html_field_id+' li.active').attr('data-operator'));
        $('#rangeDiv'+html_field_id).fadeOut('medium');
    });

    $("#reset_btn"+html_field_id).click(function(){
        $('#'+html_field_id).val('');
        $('#min'+html_field_id).val('');
        $('#max'+html_field_id).val('');
        $('#min_label'+html_field_id).hide();
        $('#max_label'+html_field_id).hide();
        $('#rangeDiv'+html_field_id).fadeOut('medium');
    });
}

function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && (charCode > 31||charCode == 13)
      && (charCode < 48 || charCode > 57)){
       return false;
    }
    return true;
}

//$('select[name="s_college_id"]').bind('change', function(e) {
$('body').on('change', 'select[name="s_college_id"]', function() {
    $('.div_form').remove();
    $('.custom_li_filter').remove();
    $('.custom_li_filter_college').remove();
    $('.div_college').remove();
    $(".lead_error").html('');

    // show view by
    $('#view_by_select').show();
    $('#view_by').val('');
    $('#single_lead_add').hide();
    $('.columnApplicationCheckAll').removeClass('checked');
    $('.columnApplicationCheckAll').attr('checked', false);
    $("#filter_elements_html").html('');
//    updatePaymentType();
    var college_id = $(this).val();
    if(college_id != '' && college_id != 'undefined'){
        // remove selected if there
        if($('li.default-active').length){
            $('li.default-active').remove();
        }

        var collegeChangeEvent = true;
        if(typeof jsVars.url_filter === 'undefined' || $(jsVars.url_filter).length === 0){
            if($('.savedFilterOpt a.makeActive').length && $.trim($('.savedFilterOpt a.makeActive').text()) === 'System Default View'){

            } else if($('#smart_view_li_list li.default-active').length){
                collegeChangeEvent = false;
            }
        }
        if(collegeChangeEvent){
            LoadFormsOnApplication(college_id,'','','Application');
            filterColumnOptionsCollegeApplication(college_id,'','changeCollege');
        }

        getSavedFilterList(college_id,'application','smart_view','smart_view_li_list');

        if(typeof jsVars.url_filter === 'undefined' || $(jsVars.url_filter).length === 0){
            if($('.savedFilterOpt a.makeActive').length && $.trim($('.savedFilterOpt a.makeActive').text()) === 'System Default View'){

            } else if($('#smart_view_li_list li.default-active').length){
                setTimeout(function() { $('#smart_view_li_list li.default-active a.columnList').trigger('click'); }, 200);
            }

        }

    }else{
        $('#savedAdvanceFilter').html('');
        $('#addnewBlock').html('');
        $('#app_block_condition').val('');
        $('#addMoreBlockBtn').hide();
        $('#FilterApplicationForms #form_id').val(0);
        $('#FilterApplicationForms #form_id').chosen();
        $('#FilterApplicationForms #form_id').trigger('chosen:updated');
    }

});


function loadDependentChildCategory(field_id, dependent_field_id, selected_value,formId){
    //$('#error_div').hide();
    var place_holder = 'Select';
    var place_holder_array = {};
    if(dependent_field_id.indexOf(',')>-1){
        var dependent_field_id_array = dependent_field_id.split(',');
        dependent_field_id = dependent_field_id_array[0];
        for(var fid in dependent_field_id_array){
            var txt = $("#"+dependent_field_id_array[fid]+" option[value='']").text();
            if(txt!=''){
                place_holder_array[dependent_field_id_array[fid]] = txt;
            }
        }
    }
    var parent_id=$('#'+field_id).val();
    if(parent_id.indexOf(';;;')>-1){
        var arrayOfparent_id = parent_id.split(';;;;');
        if(arrayOfparent_id.length>0){
            parent_id = arrayOfparent_id[0];
        }
    }
    // if multi field not found chagne placeholder
    if(dependent_field_id.indexOf(',')<0){
        if($("#"+dependent_field_id+" option[value='']").text().length>0){
            var place_holder =  $("#"+dependent_field_id+" option[value='']").text();
        }
    }

    if(parent_id==''){
        $('#'+dependent_field_id).val('');
        $('#'+dependent_field_id).trigger('change');
    }

    if(formId == 2644) {
        ajaXUrl = '/common/get-child-category-new';
    }
    else {
        ajaXUrl = '/common/get-child-category';
    }

    $.ajax({
     url: ajaXUrl,
     //url: college_slug+'/common/get-city',
     type: 'post',
     dataType: 'html',
     //async:false,
     //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
     data: {
         "parent_id": parent_id,
         "field_id": field_id,
         "selected_value":selected_value,
         "place_holder":place_holder,
         "formId":formId,
         "dependent_field_id":dependent_field_id,
         "nosemicolon":"yes"
     },
     headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
     success: function (data) {
        var count= (data.match(/<option/g) || []).length;
        if(data!="" && count > 1){
            if(typeof dependent_field_id_array!='undefined' &&  dependent_field_id_array.length>0){
                for(var ii=0;ii<dependent_field_id_array.length;ii++){
                    if($('#'+dependent_field_id_array[ii]).length>0){
                        $('#'+dependent_field_id_array[ii]).html(data);
                        if(typeof place_holder_array[dependent_field_id_array[ii]] !='undefined'){
                            $("#"+dependent_field_id_array[ii]+" option[value='']").text(place_holder_array[dependent_field_id_array[ii]]);
                        }
                    }
                }
            }else{
                $('#'+dependent_field_id).html(data);
            }
        }
        $('.chosen-select').trigger('chosen:updated');
        if($('.commonSumoReload').length>0){
                $('#'+dependent_field_id+".commonSumoReload option[value='']").remove();
            $('.commonSumoReload')[0].sumo.reload();
        }
        //console.log(data);
     },
     error: function (xhr, ajaxOptions, thrownError) {
         //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
         console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
     }
 });
}
function dependentFieldSelection(){

    $('.filter_application_child .filter_create_keys, .filter_registration_child .filter_create_keys').click(function(){
        if($(this).is(':checked')){
            var dependentgroup = $(this).data('dependentgroup');
            var dependentlevel = $(this).data('dependentlevel');
            if(typeof dependentgroup !='undefined' && typeof dependentlevel !='undefined'){
                dependentlevel = parseInt(dependentlevel);
                if(dependentlevel>0){
                    for(var i=0;i<dependentlevel;i++){
                        if(i==0){
                            if($("input[data-dependentlevel='0']").length>0){
                                var dependentGroups = $("input[data-dependentlevel='0']").data('dependentgroup');
                                if(dependentGroups.indexOf(dependentgroup)>-1){
                                    $("input[data-dependentgroup='"+dependentGroups+"'][data-dependentlevel='"+i+"']").prop('checked', false);
                                    $("input[data-dependentgroup='"+dependentGroups+"'][data-dependentlevel='"+i+"']").prop('checked', true);
                                }
                                else{
                                    if($("input[data-dependentgroup='"+dependentgroup+"'][data-dependentlevel='"+i+"']").length>0){
                                        $("input[data-dependentgroup='"+dependentgroup+"'][data-dependentlevel='"+i+"']").prop('checked', false);
                                        $("input[data-dependentgroup='"+dependentgroup+"'][data-dependentlevel='"+i+"']").prop('checked', true);
                                    }
                                }
                            }
                        }else{
                            if($("input[data-dependentgroup='"+dependentgroup+"'][data-dependentlevel='"+i+"']").length>0){
                               $("input[data-dependentgroup='"+dependentgroup+"'][data-dependentlevel='"+i+"']").prop('checked', false);
                               $("input[data-dependentgroup='"+dependentgroup+"'][data-dependentlevel='"+i+"']").prop('checked', true);
                            }
                        }

                    }
                }
            }
        }
        else{
            var dependentlevel = $(this).data('dependentlevel');
            if(dependentlevel==0){

                var dependentgroup = $(this).data('dependentgroup');
                if(typeof dependentgroup !== 'undefined' && dependentgroup.indexOf(',')>-1){
                    var dependentgroup_array = dependentgroup.split(',');

                    for(var grp in dependentgroup_array){
                        $("input[data-dependentgroup='"+dependentgroup_array[grp]+"']").each(function(){
                            $(this).prop('checked', false);
                        });
                    }
                }else{
                    $("input[data-dependentgroup='"+dependentgroup+"']").each(function(){
                        $(this).prop('checked', false);
                    });
                }
            }
        }
    });
}

function addCourseWiseApplicationNo(collegeId,formId,userId,courses){
    $("#courseWiseApplicationForm_inputs").html('');
    $("#coursewiseApplicationMessageDiv").html("");
    $("#courseWiseApplicationForm_collegeId").val(collegeId);
    $("#courseWiseApplicationForm_formId").val(formId);
    $("#courseWiseApplicationForm_userId").val(userId);
    $('#coursewiseApplicationModal').modal('show');
    var courseList      = courses.split("|||");
    var html            = '';
    $.each(courseList, function( index, courseValue ) {
        var courseDetail  = courseValue.split(";;;");
        html    = '<div class="row field-block"> \
                        <label class="col-md-7 margin-top-5 labelTheme">'+courseDetail[1]+'</label> \
                        <div class="form-group marginTopNone col-md-5"> \
                            <input name="application_no['+courseDetail[0]+']" autocomplete="false" maxlength="50" class="form-control application_no" type="text"> \
                        </div> \
                    </div>';
        $("#courseWiseApplicationForm_inputs").append(html);
    });
}

function updateCourseWiseApplicationNo(){
    $("#coursewiseApplicationMessageDiv").html("");
    var errorMessage    = '';
    var applicationList = [];
    $("#courseWiseApplicationForm").find(".application_no").each(function(){
        var applicationNo   = $(this).val();
        $(this).css('borderColor',"grey");
        if( !$.isNumeric(applicationNo) || applicationNo.length<9 || applicationNo.substring(0, 4) !='2018' || parseInt(applicationNo.substring(4, 5)) > 4 ){
            $(this).css('borderColor',"red");
            errorMessage    = "Invalid Application No.";
        }else if($.inArray(applicationNo, applicationList) > -1){
            errorMessage    = "All application numbers must be unique.";
            return;
        }else{
            applicationList.push(applicationNo);
        }
    });
    if(errorMessage!=''){
        $("#coursewiseApplicationMessageDiv").html(errorMessage);
        return;
    }
    $.ajax({
        url: jsVars.updateCourseWiseApplicationNoLink,
        type: 'post',
        data: $("#courseWiseApplicationForm").serialize(),
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('div.loader-block-a').show();
        },
        complete: function () {
            $('div.loader-block-a').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                $('#coursewiseApplicationModal').modal('hide');
                LoadMoreApplication('reset');
            }else{
                $("#coursewiseApplicationMessageDiv").html(responseObject.message);
                if(typeof responseObject.data.existingApplicationNo ==="object"){
                    $("#courseWiseApplicationForm").find(".application_no").each(function(){
                        var applicationNo   = $(this).val();
                        if($.inArray(applicationNo, responseObject.data.existingApplicationNo) > -1){
                            $(this).css('borderColor',"red");
                        }
                    });
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function validateFilter() {
    // filter changed but not applied
    if(typeof is_filter_button_pressed =='undefined' || is_filter_button_pressed != 1){
        $("#ConfirmDownloadPopupArea").modal();
        alertPopup('It seems you have changed the filter but not Applied it. Please re-check the same to proceed further.','error');
        return false;
    }
    $('#csv').prop("checked", true);
    var data = $('#FilterApplicationForms').serializeArray();
    $.ajax({
        url: jsVars.FULL_URL+'/applications/validate-advance-filter',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function (xhr) {
            $('#confirmDownloadYes').off('click');
           $('#ConfirmDownloadPopupArea .npf-close').hide();
           $('.confirmDownloadModalContent').text('Do you want to download the applications?');
           showLoader();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        async:true,
        success: function (data) {
            var checkError  = data.substring(0, 12);
            if (data === "session_logout") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
             else if (data === "select_college") {
                $('#college_error').html("Please select an Institute Name from filter.");
                $('#modalCloseButton', window.parent.document).click();
                filterOpen();
            }else if (data === "select_stage") {
                $("#college_error").html('Please select Form Stage first.');
                $('#modalCloseButton', window.parent.document).click();
                filterOpen();
            }else if (checkError === "error_filter") {
                var errorString  = data.substring(14);
                errorStringArray =  errorString.split('_');
                $('#errorlead_'+errorStringArray[0]+'_'+errorStringArray[1]).show().html('<small class="text-danger">Either remove the condition or select a value</small>');
                filterOpen();
                $('#modalCloseButton', window.parent.document).click();
            }else if(data === "select_resubmit_logic"){
                $("#college_error").html('To view the Re-Submit Application details, you first need to select filter for Re-Submit Application Logic.');
                $('#modalCloseButton', window.parent.document).click();
                filterOpen();
            }else {
                $('#confirmDownloadYes').off('click');
                $('#confirmDownloadTitle').text('Download Confirmation');
                $('#ConfirmDownloadPopupArea .npf-close').hide();
                $('.confirmDownloadModalContent').text('Do you want to download the applications?');
                var $form = $("#FilterApplicationForms");
                $form.attr("action", jsVars.FULL_URL+'/applications/ajax-lists');
                $form.attr("target",'modalIframe');
                var onsubmit_attr = $form.attr("onsubmit");
                $form.removeAttr("onsubmit");
                if($('#downloadConfig').length && $('#downloadConfig').val()==1){
                    $('#confirmDownloadYes').on('click',function(){
                        $('#ConfirmDownloadPopupArea').modal('hide');
                        $('#addRemoveColumnModal').modal('hide');
                        $form.append($("<input>").attr({"value": "export", "name": "export", 'type': "hidden", "id": "export"}));
                        var exporttype = 'applications'+$('#export_type').val();
                        $('#export_application').val(exporttype);
//                        var data = $form.serializeArray();
                        var data = [];
                        let download_all = $("#download_all").val();
                        data.push({name: "download_all", value:download_all});
                        if(download_all === 'all'){
                            $('#column_li_list .column_create_keys').each(function(){
                                data.push({name: "column_create_keys[]", value: $(this).val()});
                            });
                        }else{
                            $('input[name="column_sorting_order[]"]').each(function(){
                                data.push({name: "column_create_keys[]", value: $(this).val()});
                            });
                        }

                            $form.ajaxSubmit({
                            url: jsVars.FULL_URL+'/applications/ajax-lists',
                            type: 'post',
                           data : data,
                            dataType:'html',
                            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                            success:function (response){

                                if(response == 'session_logout') {
                                    window.location.href = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                                } else if(response.indexOf('request_already_pending|||') >= 0) {
                                    alertPopup(response.split('request_already_pending|||')[1],'error');
                                } else if(response == 'error') {
                                    alertPopup('Something went wrong.','error');
                                }else if(response == 'count_error') { //zero record stage changed
                                    alertPopup('It seems like you have changed the selcted data. Please re-check the same to proceed further.','error');
                                } else {
                                    $('#muliUtilityPopup').modal('show');

                                    $('#requestMessage').html('applications');
                                    if(exporttype==='applicationsexcel') {
                                        $('#downloadListing').hide();
                                        $('#downloadListingExcel').show();
                                        $('#downloadListingExcel').attr('href', response);
                                    } else {
                                        $('#downloadListing').show();
                                        $('#downloadListingExcel').hide();
                                        $('#downloadListing').attr('href', response);
                                    }
                                    $('#muliUtilityPopup .close').addClass('npf-close').css('margin-top', '2px');
                                }
                            }
                        });
                        $form.attr("onsubmit", onsubmit_attr);
                        $form.find('input[name="export"]').val("");
                        $form.removeAttr("target");
                        $("#export").remove();
                    });
                }else{
                    $form.submit();
                    $form.attr("onsubmit", onsubmit_attr);
                    $form.find('input[name="export"]').val("");
                    $("#export").remove();
                    $form.removeAttr("target");
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function () {
            hideLoader();
        }
    });
}

function updatePwdFieldConfirm(userId,collegeId,formId) {

    $('.loader-block-a').show();
    $.ajax({
        url: '/applications/get-pwd-update-form',
        type: 'post',
        dataType: 'html',
        data: {'user_id':userId,'college_id':collegeId,'form_id':formId},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (html) {
            $('.loader-block-a').hide();
            if(html=='error:session'){
                window.location.reload();
            }
            else if(html.indexOf('error:')>-1){
                alertPopup(html.replace(/error:/,''),'error');
            }
            else{
                $("#ConfirmPopupArea").css('z-index', 110011);
				$(".modal-backdrop").css('z-index', 110010);
                $('#ConfirmMsgBody').removeClass('text-center').addClass('text-left');
                $('#ConfirmMsgBody').html(html);
                $('#confirmTitle').html('PwD Status');
                $('#confirmYes').html('Save');
                $('#ConfirmPopupArea .modal-body button[type="submit"]').html('Cancel');
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
                $('.chosen-select').trigger('chosen:updated');

                $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
                .on('click', '#confirmYes', function (e) {
                    var pwd_status = $('#pwd_status').val();
                    var pwd_remark = $('#pwd_remark').val();
                    var accommodations = $('#accommodations').val();

                    $('#pwd_status_error,#accommodations_error,#pwd_remark_error').html('');

                    var error = false;
                    if(typeof pwd_status =='undefined' || pwd_status =='' || pwd_status == null){
                        $('#pwd_status_error').html('PWD Status is mendatory');
                        error = true;
                    }

                    if(typeof accommodations =='undefined' || accommodations =='' || accommodations == null){
                        $('#accommodations_error').html('PWD Accommodation Code is mendatory');
                        error = true;
                    }

                    if(typeof pwd_remark =='undefined' || pwd_remark =='' || pwd_remark == null){
                        $('#pwd_remark_error').html('PWD Remark is mendatory');
                        error = true;
                    }

                    if(error==true){
                        return false;
                    }

                    updatePwdField(userId,collegeId,formId,pwd_status,accommodations,pwd_remark);
                    is_filter_button_pressed = 0;
                    $('#ConfirmPopupArea').modal('hide');
                });
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

/*For Call  chagne PWD status */
function updatePwdField(userId,collegeId,formId,pwdStatus,accommodations,pwdRemark) {

    $('.loader-block-a').show();
    $.ajax({
        url: '/applications/update-pwd-field',
        type: 'post',
        dataType: 'json',
        data: {'user_id':userId,'college_id':collegeId,'form_id':formId,'pwd_status':pwdStatus,'accommodations':accommodations,'pwd_remark':pwdRemark},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            $('.loader-block-a').hide();
            if (typeof json['error'] !=='undefined' && json['error'] === 'session') {
                window.location.reload(true);
            }
            else if (typeof json['error'] !=='undefined' && json['error'] !== '') {
                alertPopup(json['error'],'error');
            }
            else if(typeof json['success'] !=='undefined' && json['success'] === 200){
                alertPopup(json['msg'],'success');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

function viewScoreCard(userId,formId,collegeId){
    if(userId=='' || formId=='' || collegeId==''){
        alertPopup('Invalid Data','error');
        return;
    }
    $.ajax({
        url: jsVars.viewScoreCard,
        type: 'post',
        data: {'userId' : userId, 'collegeId':collegeId, 'formId':formId},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('div.loader-block-a').show();
        },
        complete: function () {
            $('div.loader-block-a').hide();
        },
        success: function (data) {
            if(typeof data['error'] !=='undefined'){
               if(data['error'] =='session_logout') {
                   window.location.reload(true);
               } else {
                   alertPopup(data['error'],'error');
                   return false;
               }
            }
            $('#viewScoreCard .modal-body').html(data);
            $('#viewScoreCard').modal('show');
			$('.scoreCardList [data-toggle="tooltip"]').tooltip({
				placement: 'left',
				trigger : 'hover',
				template: '<div class="tooltip layerTop" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
			});
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function markSinglePaymentApproved(userId,formId,collegeId){
//    if(type=='bulk'){
//        $("#singleBulkTitle").html('s');
//        if($("#form_id").val()=='' || $("#form_id").val()==0 || $("#form_id").val()==null){
//            alertPopup('Please select form','error');
//            return;
//        }
//        var formId          = $("#form_id").val();
//        if($('input:checkbox[name="selected_users[]"]:checked').length < 1 && $('#select_all:checked').val()!='select_all'){
//            alertPopup('Please select User','error');
//            return;
//        }
//    }
//    getCounsellorsList(userId, $("#college_id").val(), formId);

    $.ajax({
        url: jsVars.allPaymentModeLink,
        type: 'post',
        data: {'userId' : userId, 'collegeId':collegeId, 'formId':formId},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('div.loader-block-a').show();
        },
        complete: function () {
            $('div.loader-block-a').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (typeof responseObject.message !== 'undefined' && responseObject.message !== ''){
                if(responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    alertPopup('There is some error','error');
                }
            }else if (responseObject.data !== 'undefined'){
                var html ='';
                if(typeof responseObject.data.paymentMethod !== 'undefined') {
                    var paymentMethodCounter = 0;
                    $.each(responseObject.data.paymentMethod, function(value,label) {
                        var checkedBtn = '';
                        if(paymentMethodCounter == 0) {
                            checkedBtn = 'checked="checked"';
                        }
                        html += '<div class="inbl margin-right-15"><input type="radio" id="payment_mode_'+value+'" name="payment_mode" value="'+value+'" onclick="javascript:showHideField(this.value)" '+checkedBtn+'><label style="margin:0 0 0 2px" for="payment_mode_'+value+'">'+label+'</label></div>';
                        paymentMethodCounter++;
                    });
                }
                $('#paymentMethodDivId').html(html);

                if(typeof responseObject.data.paymentAttributes !== 'undefined') {
                    var html = '';
                    var paymentModeName = '';
                    var allPaymentModeCounter = 0;
                    $.each(responseObject.data.paymentAttributes, function(paymentMode,attributes) {
                        if(allPaymentModeCounter == 0) {
                            paymentModeName = paymentMode;
                        }
                        html += '<div id="'+paymentMode+'DivId">';
                        var dynamicClass = paymentMode+'OfflinePaymentApprovedClass';
                        $.each(attributes, function(fieldName,fieldAttributes) {
                            switch(fieldAttributes['field_type']){
                                case 'text':
                                    var textboxValue = '';
                                    if(typeof fieldAttributes['value'] !== 'undefined' && fieldAttributes['value'] != '') {
                                        textboxValue = fieldAttributes['value'];
                                    }

                                    var disabled = false;
                                    if(typeof fieldAttributes['disabled'] !== 'undefined' && fieldAttributes['disabled'] == 1) {
                                        disabled = 'disabled="disabled"';
                                    }
                                    html += '<div class="labelUpContainer allOfflinePaymentApprovedJsClass '+dynamicClass+'" style="display:none;">';
                                    html += '<input type="text" name="'+fieldName+'" id="'+fieldAttributes['id']+'" label="false" class="form-control" placeholder="'+fieldAttributes['placeholder']+'" value="'+textboxValue+'" '+disabled+'>';
                                    html += '</div>';
                                    break;
                                case 'date':
                                    html += '<div class="labelUpContainer allOfflinePaymentApprovedJsClass '+dynamicClass+'" style="display:none;"><div class="dateFormGroup"><div class="iconDate"><i aria-hidden="true" class="fa fa-calendar-check-o"></i></div>';
                                    html += '<input type="text" readonly="readonly" name="'+fieldName+'" id="'+fieldAttributes['id']+'" label="false" class="form-control datepicker_picker_class" placeholder="'+fieldAttributes['placeholder']+'">';
                                    html += '</div></div>';
                                    break;
                                case 'checkbox':
                                    html += '<div class="labelUpContainer allOfflinePaymentApprovedJsClass '+dynamicClass+'" style="display:none;"><div class="toggle__checkbox">';
                                    if(typeof fieldAttributes['valueList'] !== 'undefined') {
                                        $.each(fieldAttributes['valueList'], function(checkboxValue,checkboxLabel) {
                                            html += fieldAttributes['label']+'<input type="checkbox" name="'+fieldName+'" id="'+fieldAttributes['id']+'" value="'+checkboxValue+'" label="false">';
                                        })
                                    }
                                    html += '<label style="margin-left:10px;" data-id="'+fieldAttributes['id']+'" onclick="" class="dash_2 " for="'+fieldAttributes['id']+'">Toggle</label></div></div>';
                                    break;
                                case 'file':
                                    html += '<div class="fileBrowseCustom labelUpContainer"><div class="input-group allOfflinePaymentApprovedJsClass '+dynamicClass+'" style="display:none;">';
                                    html += '<input type="text" class="form-control" placeholder="Choose Your Files" aria-describedby="basic-addon2"><input type="file" name="'+fieldName+'" id="'+fieldAttributes['id']+'" class="input_file" label="false"><span class="input-group-addon fw500" id="basic-addon2">Browse&nbsp;<i class="fa fa-paperclip" aria-hidden="true"></i></span>';
                                    html += '</div></div>';
                                    break;
                                case 'textarea':
                                    html += '<div class="labelUpContainer allOfflinePaymentApprovedJsClass '+dynamicClass+'" style="display:none;">';
                                    html += '<textarea name="'+fieldName+'" id="'+fieldAttributes['id']+'" label="false" class="form-control" placeholder="'+fieldAttributes['placeholder']+'"></textarea>';
                                    html += '</div>';
                                    break;
                            }
                        });
                        html += '</div>';
                        allPaymentModeCounter++;
                    });

                    $('#showHtml').html(html);
					floatableLabel();
					customFile();
					$('#singleMarkPaymentApprovedModal').on('show.bs.modal', function () {
						$('body').removeClass('vScrollRemove');
						$('body').addClass('overflowHidden');
					});
					$('#singleMarkPaymentApprovedModal').on('hidden.bs.modal', function () {
						$('body').removeClass('overflowHidden');
					})

					var ddPlaceholder = $('#dd_date').attr('placeholder');
					$('#dd_date').datepicker({format : 'dd/mm/yyyy',endDate: 'today'})
					.on('hide', function(e) {
						if(this.value!=''){
							$(this).parent().addClass('floatify__active');
							$(this).attr('placeholder', '');
						}else{
							$(this).parent().removeClass('floatify__active');
							$(this).attr('placeholder', ddPlaceholder);
						}
					})

					var ddrdPlaceholder = $('#dd_received_date').attr('placeholder');
					$('#dd_received_date').datepicker({format : 'dd/mm/yyyy',endDate: 'today'})
					.on('hide', function(e) {
						if(this.value!=''){
							$(this).parent().addClass('floatify__active');
							$(this).attr('placeholder', '');
						}else{
							$(this).parent().removeClass('floatify__active');
							$(this).attr('placeholder', ddrdPlaceholder);
						}
					});

					var crtdPlaceholder = $('#cash_receipt_date').attr('placeholder');
					$('#cash_receipt_date').datepicker({format : 'dd/mm/yyyy',endDate: 'today'})
					.on('hide', function(e) {
						if(this.value!=''){
							$(this).parent().addClass('floatify__active');
							$(this).attr('placeholder', '');
						}else{
							$(this).parent().removeClass('floatify__active');
							$(this).attr('placeholder', crtdPlaceholder);
						}

					});

					var crdPlaceholder = $('#cash_receive_date').attr('placeholder');
					$('#cash_receive_date').datepicker({format : 'dd/mm/yyyy',endDate: 'today'})
					.on('hide', function(e) {
						if(this.value!=''){
							$(this).parent().addClass('floatify__active');
							$(this).attr('placeholder', '');
						}else{
							$(this).parent().removeClass('floatify__active');
							$(this).attr('placeholder', crdPlaceholder);
						}
					});

                    //Call First Time so it will checked by default
                    showHideField(paymentModeName);
                }

                $("#singleMarkPaymentApprovedMessageDiv").html("");
                $('#singleMarkPaymentApprovedModal').modal('show');
				$('#singleMarkPaymentApprovedModal .modal-dialog').addClass('modal-sm');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    currentUserId = userId;
    currentFormId = formId;
    currentCollegeId = collegeId;
    /*
    $("#paymentMethod").val('offline');
    $("#discountType").val('coupon');
    $("#couponCode").val('');
    $("#singleMarkPaymentApprovedMessageDiv").html("");
    $('#singleMarkPaymentApprovedModal').modal('show');
    */
}

function validateSingleOfflinePaymentApproved(){

    $("#singleMarkPaymentApprovedMessageDiv").html("");
    if(currentUserId=='' || currentFormId == '' || currentCollegeId== ''){
        alertPopup('There is some error. Please refresh the page and try again','error');
        return;
    }

    var data = [];
    data = $('form#offlinePaymentApprovedForm').serializeArray();
    data.push({name: "userId", value: currentUserId});
    data.push({name: "collegeId", value: currentCollegeId});
    data.push({name: "formId", value: currentFormId});
    data.push({name: "submitType", value: 'validation'});

    $('form#offlinePaymentApprovedForm').ajaxSubmit({
        url: jsVars.markPaymentApprovedLink,
        type: 'post',
        data: data, //{'userId' : currentUserId, 'collegeId':currentCollegeId, 'formId':currentFormId, 'couponCode':$("#couponCode").val()},
        dataType: 'json',
        cache: false,
        processData: false, // Don't process the files
        contentType: false,
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('div.loader-block-a').show();
        },
        complete: function () {
            $('div.loader-block-a').hide();
        },
        success: function (response) {
            if (response.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(typeof response.status !== 'undefined' && response.status==1){
                $("#ConfirmPopupArea").css({'z-index':'120000'});
                $('#ConfirmMsgBody').html(response.msg);
                $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
                    .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                        e.preventDefault();

                        singleMarkPaymentApproved();
                });
            } else {
                $("#singleMarkPaymentApprovedMessageDiv").html("<div class='alert alert-danger'>"+response.message+"</div>");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function singleMarkPaymentApproved(){

    $("#singleMarkPaymentApprovedMessageDiv").html("");
    if(currentUserId=='' || currentFormId == '' || currentCollegeId== ''){
        alertPopup('There is some error. Please refresh the page and try again','error');
        return;
    }

    var data = [];
    data = $('form#offlinePaymentApprovedForm').serializeArray();
    data.push({name: "userId", value: currentUserId});
    data.push({name: "collegeId", value: currentCollegeId});
    data.push({name: "formId", value: currentFormId});

    $('form#offlinePaymentApprovedForm').ajaxSubmit({
        url: jsVars.markPaymentApprovedLink,
        type: 'post',
        data: data, //{'userId' : currentUserId, 'collegeId':currentCollegeId, 'formId':currentFormId, 'couponCode':$("#couponCode").val()},
        dataType: 'json',
        cache: false,
        processData: false, // Don't process the files
        contentType: false,
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('div.loader-block-a').show();
        },
        complete: function () {
            $('div.loader-block-a').hide();
        },
        success: function (response) {
            if (response.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }

            $("#ConfirmPopupArea").modal('hide');

            if(typeof response.status !== 'undefined' && response.status==1 && typeof response.msg !== 'undefined' && response.msg != ''){
                $("#singleMarkPaymentApprovedMessageDiv").html("<div class='alert alert-success'>"+response.message+"</div>");
                LoadMoreApplication('reset');
                $('#singleMarkPaymentApprovedModal').modal('hide');
                alertPopup(response.msg,'success');
            } else {
                $("#singleMarkPaymentApprovedMessageDiv").html("<div class='alert alert-danger'>"+response.message+"</div>");
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function updateActionMenuForCRMColg() {
    if($('#onlyCRMColg').val() == 1) {
        $('#all_menu').hide();
    } else {
        $('#all_menu').show();
    }
}


/**
 * Resubmit Logic  Popup Code
 *
 */
function reopenFormLogicPopup()
{

     $('div.loader-block').hide();
     //CKEDITOR.instances['editor'] = false;
    if ($("#college_id").val() == '' || $("#college_id").val() == 0 || $("#college_id").val() == null) {
        alertPopup('Please select college', 'error');
        return;
    }
    if ($("#form_id").val() == '' || $("#form_id").val() == 0 || $("#form_id").val() == null) {
        alertPopup('Please select form', 'error');
        return;
    }
    if ($('input:checkbox[name="selected_users[]"]:checked').length < 1 && $('#select_all:checked').val() !== 'select_all') {
        alertPopup('Please select Applicant', 'error');
        return;
    }
    var collegeId = $("#college_id").val();
    var formId = $("#form_id").val();
    showLoader();
    var ctype = $('input#ctype').val();
    if (ctype !== 'applications') {
        alertPopup('Some error occur.', 'error');
        return;
    }
    $('#ReopenFormLogic').modal();
    $('#alertTitle',$('#ReopenFormLogic')).html('Application Re-submission');
    getAllResubmitLogic(collegeId, formId);
    hideLoader();
    return false;
}

function getAllResubmitLogic(collegeId, formId) {
    $.ajax({
        url: jsVars.FULL_URL + '/applications/getAllResubmitLogic',
        type: 'post',
        dataType: 'html',
        data: {'collegeId':collegeId, 'formId':formId},
        headers: {"X-CSRF-Token": jsVars._csrfToken},
        beforeSend: function () {
            $('div.loader-block-a').show();
        },
        complete: function () {
            $('div.loader-block-a').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status===1){
                if (responseObject.message === 'no_resubmit_logic'){
                    displayResubmitForm();
                }
                else if(responseObject.data.html) {
                    $("#ReopenFormLogic").find('.modal-dialog').removeClass('modal-lg');
                    $("#ReopenFormLogic").find('.modal-dialog').addClass('modal-lg');
                    $('#reopen_form_logic',$("#ReopenFormLogic")).html(responseObject.data.html);
                }
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message, 'error');
                }
            }


        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
var hideEventOnPopup = 0;

function changeRealTimeResubmitEvent() {
    var filterSearchFields="";
    if ($('#realtime_enable').prop('checked')===true && $(document).find('#select_all').is(':checked')) {
      enableRealTimeResubmission();
    } else if ($('#realtime_enable').prop('checked')===true && !$(document).find('#select_all').is(':checked')) {
        hideEventOnPopup = 1;
        var totalSelect=$('#currentSelectionMessage').html();
        var all_records= parseInt(totalSelect.match(/\d+/),10)
        $('#realtime_enable').prop('checked', false);
        $("#ConfirmPopupArea").css('z-index',11001);
        $("#ConfirmPopupArea").find('#confirmNo').hide();
        $("#ConfirmPopupArea").find('#confirmYes').html('Confirm');
        var filterSearchFieldsComa='';
        $(".sel_field").each(function(index) {
        var filterFields= $('select[name="application_advance_filter[0]['+index+'][fields]"').find(":selected").text();
        filterSearchFieldsComa+=filterFields+", ";
    });
    filterSearchFields= filterSearchFieldsComa.substring(0, filterSearchFieldsComa.length-2);
         $('#ConfirmMsgBody').html('This action will enable real-time Re-submission not just for <strong>'+all_records+'</strong> selected Candidates but for all the Candidates meeting the filtered criteria<br><strong>'+filterSearchFields+' </strong><br>Please confirm to proceed with the action or cross to proceed with just <strong>'+all_records+'</strong> Candidates selected.');
        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
            e.preventDefault();
            $('#selectAllAvailableRecordsLink').click();
            $('#realtime_enable').prop('checked', true);
            enableRealTimeResubmission();
            $('#ConfirmPopupArea').modal('hide');
            $("#successText", $("#confirlRealtimeLogic")).html('You have chosen to enable real-time Re-submission not just for <strong>'+all_records+'</strong> selected Candidates but for all the Candidates meeting the filtered criteria');
            $('#confirlRealtimeLogic').modal('show');
        });
    } else {
      $(".real_time_interval_div").addClass('display-none');
      $('#communication_enable').prop('disabled',false);
    }
    $('.chosen-select').trigger('chosen:updated');
}

function enableRealTimeResubmission() {
    $(".real_time_interval_div").removeClass('display-none');
    $('input[name=" communication_enable"]').val('0');
    $("#template_email").val('');
    $("#template_sms").val('');
    $("#after_update_template_email").val('');
    $("#after_update_template_sms").val('');
    $(".sms-template-col").addClass('display-none');
    $(".email-template-col").addClass('display-none');
    $("#communication_enable").prop('checked',false);
    $('#communication_enable').prop('disabled',true);
}

function resubmitConfirmation(){
    if($('select[name="resubmit_logic"]').val()){
        var totalSelect=$('#currentSelectionMessage').html();
        var SelectCount= parseInt(totalSelect.match(/\d+/),10)
        var selectedLogic = $(document).find('#resubmit_logic option:selected').text();
        var selected_records = $('.select_application:checked').length;
        $("#popupText", $("#selectedLogic")).html('This action will enable application resubmission : <strong> '+selectedLogic+'</strong> for <strong> '+SelectCount+'</strong> candidates. Would you like to proceed?');
        $('#selectedLogic').modal('show');
    }
  }

function editResubmitSave() {
    var validData = true;
    $(document).find('.resubmitValidationError').html('');
    if(!$(document).find('#resubmit_logic').val()) {
        $(document).find('.resubmitValidationError').html('Please select resubmit logic');
        validData = false;
    }
    if(validData === true) {
        updateResubmitWithNewApplicants();
        $('#ReopenFormLogic').modal('hide');
    }
}

function updateResubmitWithNewApplicants() {
    var filterData = $('#FilterApplicationForms').serializeArray();
    var resubmitLogicId = $('#resubmit_logic').val();
    filterData.push({name: "resubmitLogicId", value: resubmitLogicId});
    var selectedLogic = $(document).find('#resubmit_logic option:selected').text();
    $.ajax({
        url: jsVars.FULL_URL + '/applications/updateResubmitWithNewApplicants',
        type: 'post',
        data: filterData,
        async: false,
        dataType: 'json',
        headers: {"X-CSRF-Token": jsVars._csrfToken},
        beforeSend: function () {
            $('div.loader-block-a').show();
        },
        complete: function () {
            $('div.loader-block-a').hide();
        },
        success: function (json) {
            if(json['status'] ===1) {
                alertPopup('You have enabled application resubmission :<strong> '+selectedLogic+'</strong> for <span class="font500">'+json['data']['totalUserSelected']+'</span> candidates');
            } else if(json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else {
                alertPopup(json['message'], 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function displayResubmitForm() {
    var total_count = $('#tot_records').text();
    var all_records = $('#all_records_val').val();
    var ctype = $('input#ctype').val();
    var data = $(' #FilterApplicationForms').serializeArray();
    data.push({name: "total_count", value: total_count});
    data.push({name: "all_records", value: all_records});
    data.push({name: "ctype", value: ctype});
    $.ajax({
        url: '/applications/reopen-form-logic',
        data: data,
        dataType: "html",
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
                $('div.loader-block-a').show();
        },
        complete: function () {
                $('div.loader-block-a').hide();
        },
        success: function (data) {
            $("#ReopenFormLogic").find('.modal-dialog').removeClass('modal-sm');
            $("#ReopenFormLogic").find('.modal-dialog').addClass('modal-lg');
            $('#reopen_form_logic',$("#ReopenFormLogic")).html(data);
            $('.chosen-select', $('#reopen_form_logic')).chosen();
            $('.chosen-select-deselect',$('#reopen_form_logic')).chosen({allow_single_deselect: true});
            $('.chosen-select', $('#reopen_form_logic')).trigger('chosen:updated');
            floatableLabel();
            getReopenFormLogicToken();
        },
        error: function (response) {
            alertPopup(response.responseText);
        },
        failure: function (response) {
            alertPopup(response.responseText);
        }
    });
}

function openResubmitPaymentPopup()
{
    hideEventOnPopup = 1;
    $("#ConfirmPopupArea").css('z-index',11001);
    $('#ConfirmMsgBody').html('<strong>Applications can be re-opened only for Paid Applicants. Please click Confirm to Select only Paid Applicants for Re-submission</strong>');
    $("#ConfirmPopupArea").find('#confirmNo').hide();
    $("#ConfirmPopupArea").find('#confirmYes').html('Confirm');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .one('click', '#confirmYes', function (e) {
            e.preventDefault();
            $("#advanceFilter").find(".block-repeat").each(function(index, condBlockObj) {
                setPaymentApprovedInFilter(index, condBlockObj);
            });
            $('.chosen-select').trigger('chosen:updated');
            $("#advanceFilter").find("#seacrhList").click();
            $('#ConfirmPopupArea').modal('hide');
            setTimeout(function(){
                $('#paymentFilter').modal('show');
            }, 2000);

    });
}

function setPaymentApprovedInFilter(index, condBlockObj) {
    var paymentAvailableFilter = false;
    var emptyCondBlock = false;
    if(index > 0) {
        if($(condBlockObj).length === 1 && $(condBlockObj).find('.sel_field').last().val() === '') {
            emptyCondBlock = true;
        }
    }
    if(emptyCondBlock === false) {
        $(condBlockObj).find('.sel_field').each(function(i, paymentStatusField) {
            if($(paymentStatusField).val() == 'ap|payment_status||dropdown||{"payment_pending":"Payment Pending","payment_approved":"Payment Approved"}') {
                $(paymentStatusField).closest('.condition_div').find('.sel_type').val('eq');
                $(paymentStatusField).closest('.condition_div').find('.sel_value').prop("disabled", false);
                $(paymentStatusField).closest('.condition_div').find('.sel_value').val(['payment_approved']);
                $(condBlockObj).find(".payment_status").SumoSelect().sumo.reload();
                paymentAvailableFilter = true;
            }
        });
    }
    $(condBlockObj).find('.radio_criteria').first().prop("checked", true);
    if(paymentAvailableFilter === false && emptyCondBlock === false) {
        if($(condBlockObj).find('.sel_field').last().val() !== '') {
            $(condBlockObj).find(".condition_div").last().find('.addMoreApplCondition').click();
        }
        $(condBlockObj).find('.sel_field').last().val('ap|payment_status||dropdown||{"payment_pending":"Payment Pending","payment_approved":"Payment Approved"}');
        createApplicationFilterConfig($(condBlockObj).find('.sel_field').last(),"","","application")
        $(condBlockObj).find('.sel_type').last().val('eq');
        checkConditionType($(condBlockObj).find('.sel_type').last())
        $(condBlockObj).find('.sel_value').last().val(['payment_approved']);
        $(condBlockObj).find(".payment_status").SumoSelect().sumo.reload();
    }
}
$(document).find('#ConfirmPopupArea').on('hidden.bs.modal', function () {
    if(hideEventOnPopup) {
        $("#ConfirmPopupArea").find('#confirmNo').show();
        $("#ConfirmPopupArea").find('#confirmYes').html('Yes');
        hideEventOnPopup = 0;
    }
});

    function getFieldsStageWise(val,default_val,multiselect) {

        if(typeof multiselect =='undefined'){
            multiselect = '';
        }
        var pages= $("#logic_form_fields_stage").val();
        var formId = $("#form_id").val();
        $.ajax({
            url: '/applications/form-stage-fields',
            type: 'post',
            dataType: 'json',
            data: {
                "form_id": formId,
                "pageNo":pages,
                "default_val": default_val,
                "multiselect":multiselect
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
			beforeSend: function () {
				$('#modalLoaderDiv').show();
			},
			complete: function () {
				$('#modalLoaderDiv').hide();
			},
            success: function (json) {
                if(json['redirect']) {
                    window.location = json['redirect'];
                } else if (json['error']) {
                    alertPopup(json['error'], 'error');
                } else if (json['html']) {

                    $('#logic_form_fields').html('');
                    $('#logic_form_fields').html(json['html']);
                    $('select#logic_form_fields')[0].sumo.reload();
                }
            }
        });
    }

/****For display reopen Form listing***/
function LoadFormLogicsData(type) {
    var data = [];

    if (type == 'reset') {
        varPage = 0;
        $('#load_more_form_logic').html("");
        $('#load_more_button').show();
        $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;Loading...');
    }
    if($('#college_id',$("#FilterFormLogicsList")).val()=='' ||$('#college_id',$("#FilterFormLogicsList")).val()=='undefined' ){
        $("#dispCollegeError",$("#FilterFormLogicsList")).html('Select College');
        $("#dispCollegeError",$("#FilterFormLogicsList")).show();
        return true ;
    }else{
         $("#dispCollegeError",$("#FilterFormLogicsList")).hide();
    }
    data = $('#FilterFormLogicsList, #lpsearch').serializeArray();
    data.push({name: "page", value: varPage});
    data.push({name: "type", value: type});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;Loading...');
    $.ajax({
        url: jsVars.FULL_URL + '/applications/reopen-form-lists',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $('.sectionLoader').show();
        },
        complete: function () {
            $('.sectionLoader').hide();
        },
        async: true,
        success: function (data) {
            $(':input[type="button"]').removeAttr("disabled");
            varPage = varPage + 1;
            if (data == "session_logout") {
                window.location.reload(true);
            } else if (data == "norecord") {
                if (varPage == 1)
                    error_html = "No Records found";
                else
                    error_html = "No More Record";
                $('#load_more_form_logic').append("<tr><td class=' text-danger text-center fw-500' colspan='7'>" + error_html + "</td></tr>");
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Templates');
                if (type == 'reset') {
                    $('#tot_records').html("");
                }
                $('#load_more_button').hide();
            } else {
                data = data.replace("<head/>", '');
                $('#logicListContainerSection').removeClass('display-none');
                $('#load_more_form_logic').append(data);
                $('#load_msg_div').hide();
                $('.offCanvasModal').modal('hide');
                dropdownMenuPlacement();
                table_fix_rowcol();
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Data');
                $('#load_more_button').show();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/**
 * resubmit Application Edit dates
 * @param  $logicId
 */
function reSubmitLogicEditDates(logicId, formId = 0) {
    if (logicId == 'undefined' || logicId == 0) {
        return;
    }
    if (formId != 0) {
        $("#alertTitle", $("#EditReopenFormLogic")).html("View Enable Fields");
    }
    $("#EditReopenFormLogic").modal();
    $.ajax({
        cache: false,
        url: '/applications/edit-resubmit-application-dates',
        type: 'post',
        data: {'logic_id': logicId, 'formId': formId},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('.modalLoader').show();
        },
        complete: function () {
            //$('div.loader-block').hide();
            $('.modalLoader').hide();
        },
        success: function (response) {
            $('#edit_reopen_form_logic').html(response);
			floatableLabel();
            $('.modalLoader').hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return;
}


function updateResubmitLogicDate() {
    var alldata = $('#editReopenForm').serializeArray();
    var startTime = $("#edit_startDate", $('#editReopenForm')).val;
    var endTime = $("#edit_endDate", $('#editReopenForm')).val;
    if (startTime == '' || endTime == '' || endTime == 0 || startTime == 0 || endTime == null || startTime == null) {
        alertPopup('Please fill Correct values');
        return;
    }
    alldata.push({name: "collegeId", value: $("#college_id").val()});
    alldata.push({name: "edit_startTime", value: $("#edit_startTime").val()});
    alldata.push({name: "edit_endTime", value: $("#edit_endTime").val()});
    $.ajax({
        url: '/applications/update-resubmit-logic',
        type: 'post',
        dataType: 'json',
        data: alldata,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (obj) {

            if (obj.status == 200) {
                $('#disperror').html('');
                $('#disperror').hide();
                $('#dispsuccess').show();
                $('#dispsuccess').html('Request update successfully.');
                $(".modal-content").animate({scrollTop: 0}, 1000);
                $("*", "#editReopenForm").prop('disabled', true);
                $('div.loader-block').hide();
                $('#donothing').focus();
            } else {
                if (obj.status == 400) {
                    $('#disperror').show();
                    $('#dispsuccess').hide();
                    $('#disperror').html(obj.error + '<br>');
                    $(".modal-content").animate({scrollTop: 0}, 1000);
                } else {
                    $('#disperror').show();
                    $('#dispsuccess').hide();
                    $('#dispsuccess').html('Something going wrong! Try again later.');
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


//function initCKEditor() {
//    if (typeof CKEDITOR == 'undefined')
//    {
//        window.setTimeout(function () {
//            initCKEditor();
//        }, 500);
//        return;
//    }
//    //$('#CommunicationBulkAction div.loader-block').show();
////    if (typeof tokens == 'undefined' || tokens == '') {
////        tokens = [["", ""]];
////    }
//    var old_data = '';
//    if (typeof CKEDITOR.instances['editor'] != 'undefined') {
//        var old_data = CKEDITOR.instances['editor'].getData();
//        delete CKEDITOR.instances['editor'];
//        jQuery('#cke_editor').remove();
//    }
//    //CKEDITOR.instances['editor'] = null;
//    CKEDITOR.replace('editor', {
//        on: {
//            instanceReady: function (evt) {
//                $('div.loader-block').hide();
//                //                    alert('dddrr');
//            }
//        }
//    });
//
//}
function showHideField(value){
    //Hide All Field
    $('.allOfflinePaymentApprovedJsClass').hide();
    $('.'+value+'OfflinePaymentApprovedClass').show();
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

//create CK Editor
function initMultipleCKEditor(id, token=[]){
//    if(typeof CKEDITOR == 'undefined')
//    {
//        window.setTimeout(function(){
//            initCKEditor();
//        }, 500);
//        return;
//    }

    if(typeof id =='undefined' || id == ''){
        id = '';
    }

    var newToken = [];
    jQuery.each(token, function (index, category) {
        if(category !== ''){
            jQuery.each(category, function (index, value) {
                value = $.parseJSON(value);
                newToken.push(value);
            });
        }
    });

    if(id != '')
    {
        if($("#"+id).length >0){
            var old_data = '';
            if(typeof CKEDITOR.instances[id] != 'undefined'){
                var old_data = CKEDITOR.instances[id].getData();
                delete CKEDITOR.instances[id];
                $('#cke_'+id).remove();
            }

            CKEDITOR.replace( id,{
                extraPlugins: 'token,justify',
                allTokens: token,
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

            if(old_data != ''){
                CKEDITOR.instances[id].setData('');
            }
        }
    }
}


function reopenLogicLoadForms(value,val3,mulVal){
    return;
}
/**
 * For Download Documents
 * @returns {undefined}
 */
function downloadBulkDocument(){
    if($('#form_id').val() == '' || $('#form_id').val() == '0') {
        alertPopup('Please select form','error');
        return false;
    }

    var total_checked=0;
    var display_popup = false;
    var message = 'Please select User';
    $('input:checkbox[name="selected_users[]"]').each(function () {
        if(this.checked){
            display_popup = true;
            total_checked++;
        }
    });

    var select_all = $('#select_all:checked').val();

    if(select_all === null || typeof select_all === 'undefined' ){
        select_all = '';
    }

    if(display_popup == false && select_all != 'select_all'){
        alertPopup(message,'error');
        return;
    }
    var data = $('#FilterApplicationForms').serializeArray();
    $.ajax({
        url: '/applications/downloadDocuments',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if(typeof data.error !== 'undefined' && data.error !== '') {
                if(data.error =='session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(data.error,'error');
                    return;
                }
            }else if(typeof data.success !== 'undefined' && data.success == 1){
                $('#bulk-document-details .modal-header  button[type="button"]').addClass('close npf-close');
                $("#bulk-document-details").css('z-index', 11001);
                var html = '<div class="rowSpaceReduce sticky-row"><div class="col-sm-3"><select name="doc_folder_structure" id="doc_folder_structure" class="chosen-select" tabindex="-1"><option value="">Select Folder Structure</option><option selected="selected" value="app_no_wise">Application No. Wise</option><option value="doc_wise">Document Wise</option></select></div></div><div class="table-responsive table-border " style="overflow:visible">';
                html +='<table class="table table-hover table-condensed">';
                html += '<thead>';
                html += '<tr><th>Applicant Documents</th><th class="text-right"><div class="toggle__checkbox toggle__checkbox_blue"><span class="margin-right-8">Select All</span><input type="checkbox" id="check_all_docs" class="check_all_docs" value="1"><label for="check_all_docs">Select all</label></div></th></tr></thead>';
                html +='<tbody>';
                var listCounter=0;
                $.each(data.fieldList.document_config, function(fieldName,label){
                    var selectAppAutoId = "";
                    var selectAppNo = "";
                    var prefix = "";
                    var suffix = "";
                    listCounter++;
                    var downloadFolderName = "";
                    if(!jQuery.isEmptyObject(data.fieldAttribute) && jQuery.inArray(fieldName, Object.keys(data.fieldAttribute)) !== -1 ){
                            if(!jQuery.isEmptyObject(data.fieldAttribute[fieldName])){
                                prefix = data.fieldAttribute[fieldName]['prefix'];
                                suffix = data.fieldAttribute[fieldName]['suffix'];
                                downloadFolderName = data.fieldAttribute[fieldName]['downloadFolderName'];
                                if(data.fieldAttribute[fieldName]['mapping_with']=='application_no'){
                                    var selectAppNo = 'selected="selected"';
                                }else if(data.fieldAttribute[fieldName]['mapping_with']=='application_auto_id'){
                                    var selectAppAutoId = 'selected="selected"';
                                }
                            }
                        
                        html += '<tr class=""><td><a href="#download_acc_'+fieldName+'" class="" data-toggle="collapse" aria-expanded="false" data-parent="#bulk-document-details">'+label+'<span class="hidden error_field_'+fieldName+' fa fa-exclamation-circle text-danger margin-left-8" data-toogle="tooltip" data-placement="right" data-trigger="hover" title="Please&nbsp;define&nbsp;downloading&nbsp;format"></span></a></td><td class="text-right"><div class="toggle__checkbox toggle__checkbox_blue"><input type="checkbox" name="download_doc[]" id="download_doc_'+fieldName+'" value='+fieldName+'><label for="download_doc_'+fieldName+'">Toggle</label></div></td>';
                        html +='<tr class="additional-row collapse" id="download_acc_'+fieldName+'">\
                                <td>\
                                    <form class="rowSpaceReduce" id="download_doc_attr_form_'+fieldName+'" >\
                                    <div class="col-sm-4">\
                                      <label>Prefix </label><input type="text" name="prefix" id="download_doc_attr_'+fieldName+'" class="blk-download-prefix-suffix form-control" placeholder="Prefix" value="'+prefix+'"><span class="small text-muted">Do not use * or / </span>\
                                    </div>\
                                    <div class="col-sm-4">\
                                      <label>Name<span class="text-danger"> *</span></label><select name="mapping_with" id="download_doc_attr_'+fieldName+'"\
                                        class="form-control sumo-select ">\
                                        <option value="">Select an Option</option>\
                                        <option '+selectAppNo+' value="application_no">Application no</option>\
                                        <option '+selectAppAutoId+' value="application_auto_id">Application auto id</option>\
                                      </select>\
                                    </div>\
                                    <div class="col-sm-4">\
                                      <label>Suffix</label><input type="text" name="suffix" id="download_doc_attr_'+fieldName+'" class="blk-download-prefix-suffix form-control" placeholder="Suffix" value="'+suffix+'"><span class="small text-muted">Do not use * or / </span>\
                                    </div>\
                                    <div class="col-sm-4" style="display:none">\
                                      <label>Folder Name<span class="text-danger"> *</span></label><input type="text" name="downloadFolderName" id="download_doc_attr_'+fieldName+'" class="form-control" placeholder="Folder Name" value="'+downloadFolderName+'"><span class="small text-muted">Do not use * or / </span>\
                                    </div>';
                        if (typeof data.fieldAttribute[fieldName]['parent_id'] !== "undefined") {
                            html +='<input type="hidden" name="parentFieldId" id="download_doc_attr_'+fieldName+'" class="form-control" placeholder="Folder Name" value="'+data.fieldAttribute[fieldName]['parent_id']+'">';
//                            html +='<input type="hidden" name="parentFieldId" id="download_doc_attr_'+fieldName+'" class="form-control" placeholder="Folder Name" value="nationality1">';
                        }
                        html +='</form></td>\
                                <td class="text-center">\
                                  <button class="btn btn-line-blue" onclick="javascript:saveFieldAttribute(this,'+"'"+fieldName+"'"+')" type="button">Save</button>\
                                </td>\
                              </tr>';
                    }else if(Object.prototype.toString.call(data.fieldList.document_config[fieldName])=="[object Object]"){
                        html+='<tr class=""><td><a href="#download_acc_'+fieldName+'" class="" data-toggle="collapse" aria-expanded="false" data-parent="#bulk-document-details">'+label.buttonText+'<span class="hidden error_field_'+fieldName+' fa fa-exclamation-circle text-danger margin-left-8" data-toogle="tooltip" data-placement="right" data-trigger="hover" title="Please&nbsp;define&nbsp;downloading&nbsp;format"></span></a></td><td class="text-right"><div class="toggle__checkbox toggle__checkbox_blue"><input type="checkbox" name="download_doc[]" id="download_doc_'+fieldName+'" value='+fieldName+'><label for="download_doc_'+fieldName+'">Toggle</label></div></td>';
                        html +='<tr class="additional-row collapse" id="download_acc_'+fieldName+'">\
                                <td colspan="2">\
                                    <form class="rowSpaceReduce" id="download_doc_attr_form_'+fieldName+'" >\
                                    <div class="col-sm-5">\
                                      <label>File Name</label><input readonly="readonly" type="text" name="label_message" id="download_doc_attr_'+fieldName+'" class="form-control" placeholder="Prefix" value="'+data.fieldList.document_config[fieldName]['buttonText']+'">\
                                    </div>';
//                        if(data.fieldList.document_config[fieldName]['admitCardMessage'] != undefined){
//                            html +='<div class="col-sm-1 text-center" style="padding-top: 30px;"><strong>or</strong></div>';
//                            html += '<div class="col-sm-3">\
//                                          <label>Show Message</label><input type="text" name="admit_card_message" id="download_doc_attr_'+fieldName+'" class="form-control" placeholder="Admit Card Message" value="'+data.fieldList.document_config[fieldName]['admitCardMessage']+'">\
//                                        </div>';
//                        }
                        html += '</form></td>\
                              </tr>';
                    }else{
                        html+='<tr class=""><td>'+label+'</td>\
                              <td class="text-right">\
                               <div class="toggle__checkbox toggle__checkbox_blue"><input type="checkbox" name="download_doc[]" id="download_doc_'+fieldName+'" value='+fieldName+'><label for="download_doc_'+fieldName+'">Toggle</label></div>\
                               </td>\
                               </tr>';
                    }
                });
                html += '</tbody></table></div>';


                $('#bulk-document-details .modal-body').html(html);
                $('#bulk-document-details .modal-title').html('Bulk Download of Applicant Documents');
                $('[data-toogle="tooltip"]').tooltip();

                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                $('.chosen-select').trigger('chosen:updated');
                $('#bulk-document-details .sumo-select').SumoSelect();
                if(listCounter >9){
                    if ($('#bulk-document-details table tr:nth-last-child(1) .sumo-select').length){
                        $('#bulk-document-details table tr:nth-last-child(1) .sumo-select')[0].sumo.unload();
                    }
                    if ($('#bulk-document-details table tr:nth-last-child(3) .sumo-select').length){
                        $('#bulk-document-details table tr:nth-last-child(3) .sumo-select')[0].sumo.unload();
                    }
                    $('#bulk-document-details table tr:nth-last-child(1) .sumo-select, table tr:nth-last-child(3) .sumo-select').SumoSelect({up: true});
                }
//                $('.sumo-select1').SumoSelect();
//                $('table tr:nth-last-child(1) .sumo-select1').SumoSelect({up: true});
                $('#bulk-document-details').modal();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function () {
            hideLoader();
        }
    });
}


function confirmBulkDownloadDocument(){
    var data = $('#FilterApplicationForms').serializeArray();
    var array = [];
    $("input:checkbox[name='download_doc[]']:checked").each(function() {
        array.push($(this).val());
    });

    if($('#doc_folder_structure').val() =='') {
        alertPopup('Please select folder structure.','error');
        return false;
    }

    if(array.length ==0) {
        alertPopup('Please select atleast one document.','error');
        return false;
    }

    data.push({name: "download_doc", value: array});
    data.push({name: "doc_folder_structure", value: $('#doc_folder_structure').val()});
    $('#downloadDocBtnId').attr("disabled", "disabled");
    $.ajax({
        url: '/applications/confirmBulkDownloadDocument',
        type: 'post',
        dataType: 'json',
        data: data,
        beforeSend: function (xhr) {
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#downloadDocBtnId').removeAttr('disabled');
            if(typeof data.error !== 'undefined' && data.error !== '') {
                if(data.error =='session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else if(!jQuery.isEmptyObject(data.errorFields)){
                    $.each(data.errorFields, function(key,fieldName){
                        if(fieldName=='application_form'){
                            //Do nothing
                        }else{
                            $(".error_field_"+fieldName).removeClass("hidden");
                        }
                    });
                } else {
                    alertPopup(data.error,'error');
                    return false;
                }
            }else if(typeof data.totalRecord !== 'undefined' && data.totalRecord !== ''){
                $("#ConfirmPopupArea").css({'z-index':'120000'});
                $('#ConfirmMsgBody').html('You have requested to download documents for '+data.totalRecord+ ' applicants. Would you like to proceed?');
                $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
                    .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                        e.preventDefault();

                        $('#ConfirmPopupArea').modal('hide');
                        saveBulkDownloadDocument();
                });
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#downloadDocBtnId').removeAttr('disabled');
        },
        complete: function () {
            hideLoader();
        }
    });
}

function saveBulkDownloadDocument(){
    var data = $('#FilterApplicationForms').serializeArray();
    var array = [];
    $("input:checkbox[name='download_doc[]']:checked").each(function() {
        array.push($(this).val());
    });

    /*
    if($('#doc_folder_structure').val() =='') {
        alertPopup('Please select folder structure.','error');
        return false;
    }

    if(array.length ==0) {
        alertPopup('Please select atleast one checkbox.','error');
        return false;
    }
    */

    data.push({name: "download_doc", value: array});
    data.push({name: "doc_folder_structure", value: $('#doc_folder_structure').val()});
    $('#downloadDocBtnId').attr("disabled", "disabled");
    $.ajax({
        url: '/applications/saveDownloadRequestData',
        type: 'post',
        dataType: 'json',
        data: data,
        beforeSend: function (xhr) {
//           showLoader();
            //$(".expandableSearch .btn-default").prop("disabled",true);
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#downloadDocBtnId').removeAttr('disabled');
            if(typeof data.error !== 'undefined' && data.error !== '') {
                if(data.error =='session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(data.error,'error');
                    return;
                }
            }else if(typeof data.success !== 'undefined' && data.success == 1){

                $('#bulk-document-details').modal('hide');

                $('#downloadListing').attr('href', data.downloadUrl);
                $('#requestMessage').html('bulk document download');
                $('#muliUtilityPopup').modal('show');

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#downloadDocBtnId').removeAttr('disabled');
        },
        complete: function () {
            hideLoader();
        }
    });
}

function getApplicationSubStages(formId, val, selector, dropdown_class, parent, subStageValue) {
    if ((typeof formId == 'undefined') || (typeof val == 'undefined') || (typeof selector == 'undefined') || (typeof parent == 'undefined')
        || (typeof dropdown_class == 'undefined') || (typeof jsVars.getLeadSubStagesLink == 'undefined')) {
        return;
    }
    if(formId=='NA'){
        formId = $("#formId").val();
    }
    //reset filter
    $('#div_profile_sub_stage').show();
    if ((dropdown_class == 'chosen') && ((val == '') || (val  < 1))) {
        var leadSubStageHtml = '<label class="floatify__label float_addedd_js">Lead Sub Stage</label><select name="'+ selector +'" id="'+ selector +'" class="chosen-select" tabindex="-1"><option value="" selected="selected">Lead Sub Stage</option></select>';
        $('#' + parent).html(leadSubStageHtml);
        $('#' + parent + ' select#'+ selector +'').chosen();
        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        return;
    } else if ((dropdown_class == 'sumo') && ((val == '') || (val  < 1))) {
        var leadSubStageHtml = '<option value="0">Lead Sub Stage ' + jsVars.notAvailableText + '</option>';
        $('select#' + selector).html(leadSubStageHtml)[0].sumo.reload();
        return;
    }

    $.ajax({
        url: jsVars.getLeadSubStagesLink,
        type: 'post',
        data: {'formId': formId, 'stageId': val},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            hideLoader();
        },
        success: function (json) {
            if (json['redirect']) {
                location = json['redirect'];
            } else if (json['error']) {
                alert(json['error']);
            } else  if (json['success'] === 200) {
                $('#div_profile_sub_stage').show();
                if (json['subStageList'] && (dropdown_class == 'chosen')) {
                    var leadSubStageHtml = '<label class="floatify__label float_addedd_js">Application Sub Stage</label><select name="'+ selector +'" id="'+ selector +'" class="chosen-select" tabindex="-1"><option value="" selected="selected">Application Sub Stage</option>';
                    for(var subStageId in json['subStageList']) {
                        if (json['subStageList'].hasOwnProperty(subStageId)) {
                            leadSubStageHtml += '<option value="'+ subStageId +'">'+ json['subStageList'][subStageId] +'</option>';
                        }
                    }
                    leadSubStageHtml += '</select>';
                    $('#' + parent).html(leadSubStageHtml);
                    $('#' + parent + ' select#'+ selector +'').chosen();
                    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                } else if (json['subStageList'] && (dropdown_class == 'sumo')) {
                    var leadSubStageHtml = '<option value="0">Lead Sub Stage ' + jsVars.notAvailableText + '</option>';
                    for(var subStageId in json['subStageList']) {
                        var selected = '';
                        leadSubStageHtml += '<option value="'+ subStageId +'" ' + selected +'>'+ json['subStageList'][subStageId] +'</option>';
                    }
                    $('select#' + selector).html(leadSubStageHtml);
                    if ((typeof subStageValue != 'undefined')) {
                        $('select#' + selector).val(subStageValue);
                    }
                    $('select#' + selector)[0].sumo.reload();
                }

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function allocateEvaluatorScoringPanel(userId=null){
    var bulkEvaluate = false;
    if(userId === null){
        bulkEvaluate = true;
    }
    if($("#college_id").val()=='' || $("#college_id").val()==='0' || $("#college_id").val()===null){
        alertPopup('Please select college','error');
        return;
    }
    if($("#form_id").val()==='' || $("#form_id").val()==='0' || $("#form_id").val()===null){
        alertPopup('Please select form','error');
        return;
    }

    if(bulkEvaluate === true){
        if($('input:checkbox[name="selected_users[]"]:checked').length < 1 && $('#select_all:checked').val()!=='select_all'){
            alertPopup('Please select User','error');
            return;
        }
    }
    $.ajax({
        url: jsVars.allocateEvaluatorScoringPanel,
        type: 'post',
        data: {'collegeId':$("#college_id").val(),'formId':$("#form_id").val(),'userId':userId},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('div.loader-block-a').show();
        },
        complete: function () {
            $('div.loader-block-a').hide();
        },
        success: function (data) {
            if(typeof data['error'] !=='undefined'){
               if(data['error'] ==='session_logout') {
                   window.location.reload(true);
               } else {
                   alertPopup(data['error'],'error');
                   return false;
               }
            }
            $("#scorecard-header").text("Manual Assignment of Panels");
            $('#viewScoreCard .modal-body').html(data);
            $('#viewScoreCard').modal('show');
            $('.chosen-select').chosen();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


$(document).on("change",'#panel_id',function(){
    var panel_id = $("#panel_id").val();
    $('#group_range').val('');
    $('#groupRange').hide();
    $('#is_group_mandatory').val(false);
    if(panel_id !== ''){
        $.ajax({
            url: '/scores/getScoringPanelDetails',
            type: 'post',
            data: {'panel_id' : panel_id, 'college_id':$("#college_id").val()},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars.csrfToken
            },
            beforeSend: function () {
                $('div.loader-block-a').show();
            },
            complete: function () {
                $('div.loader-block-a').hide();
            },
            success: function (response) {
                if (typeof response.message !== 'undefined' && response.message !== ''){
                    if(response.message === 'session') {
                        location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                    } else {
                        //alertPopup(response.message,'error');
                    }
                }else if (response.data !== 'undefined'){
                    var group_range = response.data.groupRange;

                    var evaluatorhtml = '';
                    $.each(response.data.evaluatorList, function(value,label) {
                        evaluatorhtml += '<option value="'+value+'">'+label+'</option>';
                    });
                    $('#evaluator_name').html(evaluatorhtml).trigger('chosen:updated');

                    if(typeof group_range !== 'undefined' && group_range > 0){
                        var groupRangehtml = '<option value="">Group Range</option>';
                        for(var i=1;i<=group_range;i++){
                            groupRangehtml += '<option value="'+i+'">'+i+'</option>';
                        }
                        $('#group_range').html(groupRangehtml).trigger('chosen:updated');
                        $('#groupRange').show();
                        $('#is_group_mandatory').val(true);
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
});




function validateAllocateScoreCard(checkVideoSettings = true) {
    $('.error').hide();
    var error = false;

    if ($("#panel_id").val() === "") {
        $('#panel_id_error').html("Please select Scorecard name for Assignment.");
        $('#panel_id_error').show();
        error = true;
    }

    if ($("#evaluator_name").val() === "" || $("#evaluator_name").val() === null) {
        $('#evaluator_name_error').html("Please select atleast one evaluator name for assignment");
        $('#evaluator_name_error').show();
        error = true;
    }
    if ($("#tentative_evaluation_date").val() === "" || $("#tentative_evaluation_date").val() === null) {
        $('#tentative_evaluation_date_error').html("Mandatory to select the above field!");
        $('#tentative_evaluation_date_error').show();
        error = true;
    }

    if($('#is_group_mandatory').val() === 'true'){
        if ($("#group_range").val() === "" || $("#group_range").val() === 0) {
            $('#group_range_error').html("Please enter Group Number for Assignment.");
            $('#group_range_error').show();
            error = true;
        }
    }
    console.log(checkVideoSettings);
    if($('#svmeetingyes').is(':checked') && checkVideoSettings){
        if($('#zoom_accounts').val() == '' || $('#zoom_accounts').val() == 0){
            $('#zoom_accounts_error').html("Mandatory to select the above field!");
            $('#zoom_accounts_error').show();
            error = true;
        }
        if($('#meeting_host').val() == '' || $('#meeting_host').val() == 0){
            $('#meeting_host_error').html("Mandatory to select the above field!");
            $('#meeting_host_error').show();
            error = true;
        }
        if($('#topic').val() == ''){
            $('#topic_error').html("Mandatory to select the above field!");
            $('#topic_error').show();
            error = true;
        }
        if($('#duration').val() == '' || $('#duration').val() == 0){
            $('#duration_error').html("Mandatory to select the above field!");
            $('#duration_error').show();
            error = true;
        }
        if($('#max_duration').val() == ''){
            $('#max_duration_error').html("Mandatory to select the above field!");
            $('#max_duration_error').show();
            error = true;
        }
        if($('#buffer_time').val() == ''){
            $('#buffer_time_error').html("Mandatory to select the above field!");
            $('#buffer_time_error').show();
            error = true;
        }
    }

    if (error === false) {
        return true;
    } else {
        return false;
    }
}



function allocateApplicantToScoreCard(userId=null){
    var bulkEvaluate = false;
    if(userId === null){
        bulkEvaluate = true;
    }

    if($("#college_id").val()=='' || $("#college_id").val()===0 || $("#college_id").val()===null){
        alertPopup('Please select college','error');
        return;
    }

    if($("#form_id").val()==='' || $("#form_id").val()===0 || $("#form_id").val()===null){
        alertPopup('Please select form','error');
        return;
    }

    var users   = [];
    if(bulkEvaluate === true){
        if($('input:checkbox[name="selected_users[]"]:checked').length < 1 && $('#select_all:checked').val()!=='select_all'){
            alertPopup('Please select User','error');
            return;
        }

        if($('#select_all:checked').val()==='select_all'){
            users = 'all';
        }else{
            $('input:checkbox[name="selected_users[]"]').each(function () {
                if(this.checked){
                    users.push(parseInt($(this).val()));
                }
            });
        }
    }else{
        users.push(parseInt(userId));
    }

    if (validateAllocateScoreCard() === false) {
        return;
    }

    if(bulkEvaluate === true){
        var url = jsVars.saveAllocateEvaluatorScoringPanelBulk;
    }else{
        var url = jsVars.saveAllocateEvaluatorScoringPanel;
    }

    var data = [];
    data = $('form#allocateToScorecard').serializeArray();
    data.push({name: "formId", value: $("#form_id").val()});
    data.push({name: "userIds", value: users});
    data.push({name: "isBulk", value: bulkEvaluate});

    if($('#select_all:checked').val()==='select_all'){
        data.push({name: "filters", value: $("#leadsListFilters").val()});
        data.push({name: "totalRecords", value: $("#all_records_val").val()});
    }

    $.ajax({
        url: url,
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#allocatebtn').hide();
            $('div.loader-block-a').show();
        },
        complete: function () {
            $('div.loader-block-a').hide();
            $('#allocatebtn').show();
        },
        success: function (response) {
            $(this).show();
            if (typeof response.message !== 'undefined' && response.message !== '' && response.status !== 200){
                if(response.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(response.message,'error');
                }
            }else if (response.status === 200){
                $('#viewScoreCard').modal('hide');

                if(bulkEvaluate === true){
                    $('#allocateEvaluatorPopup').modal('show');
                    $('#allocateEvaluatorPopup .close').addClass('npf-close').css('margin-top', '2px');
                }else{
                    alertPopup(response.message,'success');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}














function getPageNumberHistoryForBulkUpdate(userId,formId,type) {
    $("#PageHistoryDiv").html("");
    $("#PageNumberTitle").html('');
    $('#error_span_page_number_history').hide().html('');
    if(type=='bulk'){
        if($("#form_id").val()=='' || $("#form_id").val()==0 || $("#form_id").val()==null){
            alertPopup('Please select form','error');
            return;
        }
        var formId          = $("#form_id").val();
        if($('input:checkbox[name="selected_users[]"]:checked').length < 1 && $('#select_all:checked').val()!='select_all'){
            alertPopup('Please select User','error');
            return;
        }
    }
    getPageNumberHistory(userId, $("#college_id").val(), formId);
    $('#PageHistoryModal').modal('show');
}


function getPageNumberHistory(userId, collegeId, formId){
    var assignedTo  = '<label class="floatify__label float_addedd_js" for="assignedTo">Page Number History</label><select name="pa" id="page_number_history" class="sumo-select" tabindex="-1" ><option value="">Select Page Number</option></select>';
    $('#pageNumberListDiv').html(assignedTo);

    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    $('.sumo-select').SumoSelect({placeholder: 'Select Page Number', search: true, searchText:'Select Counsellors'});

    $.ajax({
        url: jsVars.getpageNumberHistoryBulkLink,
        type: 'post',
        data: {'userId' : userId, 'collegeId':collegeId, 'formId':formId, moduleName:'application'},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: true,
        beforeSend: function () {
            currentUserId           = '';
            currentCollegeId        = '';
            currentFormId           = '';
        },
        complete: function () {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.sumo-select').SumoSelect({placeholder: 'Page Number History', search: true, searchText:'Page Number History'});
        },
        success: function (response) {
            var responseObject = response;
            if (typeof responseObject['redirect'] !=='undefined' && responseObject['redirect'] !==''){
                location = responseObject['redirect'];
            }
            else if (typeof responseObject['error'] !=='undefined' && responseObject['error'] !==''){
                console.log(responseObject['error']);
            }
            else if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    if(typeof responseObject.data.pagenumber === "object"){
                        var pagenumber  = '<label class="floatify__label float_addedd_js" for="assignedTo">Page Number History</label><select name="page_number_history" id="page_number_history" class="sumo-select" tabindex="-1" ><option value="">Select Page Number History</option>';
                        $.each(responseObject.data.pagenumber, function (index, item) {
                            pagenumber += '<option value="'+index+'">'+item+'</option>';
                        });
                        pagenumber += '</select>';
                        $('#pageNumberListDiv').html(pagenumber);
                    }
                }
            }
			floatableLabel();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function updatePageHistoryConfirm(){

    $('#error_span_page_number_history').hide().html('');
    var users   = [];
    $('input:checkbox[name="selected_users[]"]').each(function () {
        if(this.checked){
            users.push(parseInt($(this).val()));
        }
    });

    if($("#page_number_history").val()=='' || $("#page_number_history").val()==0 || $("#page_number_history").val()==null){
        $('#error_span_page_number_history').show().html('Please select page number');
        return;
    }
    $("#confirmYes").removeAttr('onclick');
    $('#confirmTitle').html("Confirm");
    $("#confirmYes").html('Ok');
    $("#confirmNo").html('Cancel');
    $('#ConfirmMsgBody').html('Are you sure to update page history?');
    $('#ConfirmPopupArea').css('z-index', '11111');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
            e.preventDefault();
            $('#ConfirmPopupArea').modal('hide');
            updatePageHistory();
        });
    return false;
}


function updatePageHistory(){
    var users   = [];
    $('input:checkbox[name="selected_users[]"]').each(function () {
        if(this.checked){
            users.push(parseInt($(this).val()));
        }
    });

    if($("#page_number_history").val()=='' || $("#page_number_history").val()==0 || $("#page_number_history").val()==null){
        $('#error_span_page_number_history').show().html('Please select page number');
        return;
    }

    if(users.length > 0 || $('#select_all:checked').val()==='select_all'){
        var $form = $("#bulkUpdateStageForm");
        $form.find('input[name="collegeId"]').val($("#college_id").val());
        $form.find('input[name="formId"]').val($("#form_id").val());
        $form.find('input[name="page_number_history"]').val($("#page_number_history").val());

        if($('#select_all:checked').val()==='select_all'){
            $form.find('input[name="userId"]').val("all");
            $form.find('input[name="filters"]').val($("#leadsListFilters").val());
            $form.find('input[name="totalRecords"]').val($("#all_records_val").val());
        }else{
            $form.find('input[name="userId"]').val(users);
            $form.find('input[name="filters"]').val($("#leadsListFilters").val());
            $form.find('input[name="totalRecords"]').val(users.length);
        }

        var oldaction = $("#bulkUpdateStageForm").attr('action');
        $('#myModal').modal('show');
        $form.attr("action",jsVars.bulkUpdatePageNumberLink);
        $form.attr("target",'modalIframe');
        $form.submit();
        $form.removeAttr("target");
        $form.attr("action",oldaction);

        $('#myModal').on('hidden.bs.modal', function(){
            $("#modalIframe").html("");
            $("#modalIframe").attr("src", "");
        });
        $('#PageHistoryModal').modal('hide');
        return;

    }else{
        alertPopup('Please select User','error');
    }

    return false;
}

function markOnlinePaymentApproved(userId,formId,collegeid) {
    $("#onlinePaymentApprovedTitle").html('');
    if(typeof $("#form_id").val()== 'undefined' && $("#form_id").val()=='' || $("#form_id").val()==0 || $("#form_id").val()==null){
        alertPopup('Please select form','error');
        return;
    }
    var formId          = $("#form_id").val();

    getTransactionIdList(userId, collegeid, formId);
    $('#onlinePaymentApprovedModal').modal('show');
}

if($("#CreateSessionDownlaodPopupBtn").length>0) {
    $("#CreateSessionDownlaodPopupBtn").click(function(){
        $("#error_span_session_year").html("");
        //$("#onlinePaymentApprovedTitle").html('');
        if(typeof $("#college_id").val()== 'undefined' && $("#college_id").val()=='' || $("#college_id").val()==0 || $("#college_id").val()==null){
            alertPopup('Please select college','error');
            return;
        }
        var collegeid          = $("#college_id").val();
        $('.sumo-select').SumoSelect({placeholder: 'Select Session', search: true, searchText:'Select Session'});
        //getSessionList(collegeid);
        $('#session_year').val('');
        $('#session_year')[0].sumo.reload();
        $('#downloadSessionDataModal').modal('show');
        $("#downloadSessionDataLink").html('');
    });
}

function downloadSessionDataConfirm() {
    $("#error_span_session_year").html("");
    if(typeof $("#college_id").val()== 'undefined' && $("#college_id").val()=='' || $("#college_id").val()==0 || $("#college_id").val()==null){
        alertPopup('Please select college','error');
        return;
    }
    var collegeid          = $("#college_id").val();
    var session_year          = $("#session_year").val();
    if(typeof $("#session_year").val()== 'undefined' && $("#session_year").val()=='' || $("#session_year").val()==0 || $("#session_year").val()==null){
        $("#error_span_session_year").html("Please select session");
        return;
    }

    $.ajax({
        url: '/applications/getSessionData',
        type: 'post',
        data: {'session_year':session_year,'collegeid':collegeid},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('div.loader-block-a').show();
        },
        complete: function () {
            $('div.loader-block-a').hide();
        },
        success: function (responseObject) {
            if (typeof responseObject['redirect'] !== 'undefined' && responseObject['redirect']!=''){
                location = responseObject['redirect'];
            }
            else if(typeof responseObject['error'] !== 'undefined' && responseObject['error']!=''){
                //console.log(responseObject['error']);
                $("#downloadSessionDataLink").html("");
                //alertPopup(responseObject['error'],'error');
                $("#error_span_session_year").html(responseObject['error']);
            }
            else if(responseObject['status']==200) {
                $("#downloadSessionDataLink").html('<a class="btn btn-npf m-0" href="'+responseObject['message']+'" download>Download Previous Session Data</a>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

}

function getTransactionIdList(userId, collegeId, formId){
    $('#onlinePaymentApprovedModal .error').hide().html('');
    $('#updateOnlinepayment').prop('disabled',false);

    var assignedTo  = '<label class="floatify__label float_addedd_js" for="orderid">Transaction ids</label><select name="pa" id="online_transaction_id" class="sumo-select" tabindex="-1" ><option value="">Select Order Id</option></select>';
    $('#onlinePaymentApprovedListDiv').html(assignedTo);

    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    $('.sumo-select').SumoSelect({placeholder: 'Select Order Id', search: true, searchText:'Select Orders'});

    $('#payment_end_date').val('');
    $('#transaction_id').val('');

    $.ajax({
        url: '/applications/get-order-lists',
        type: 'post',
        data: {'userId' : userId, 'collegeId':collegeId, 'formId':formId, moduleName:'application'},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: true,
        beforeSend: function () {
            currentUserId   = 0;
            currentCollegeId= 0;
            currentFormId   = 0;

        },
        complete: function () {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.sumo-select').SumoSelect({placeholder: 'Select Orders', search: true, searchText:'Select Orders'});
        },
        success: function (responseObject) {
            if (typeof responseObject['redirect'] !=='undefined' && responseObject['redirect'] !== ''){
                location = responseObject['redirect'];
            }
            else if (typeof responseObject['error'] !=='undefined' && responseObject['error'] !== ''){
                console.log(responseObject['error']);
            }
            else if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    // use this variable in updatePaymentStatus() function
                    currentUserId           = userId;

                    if(typeof responseObject.data.order === "object"){
                        var order  = '<label class="floatify__label float_addedd_js" for="assignedTo">Order ID</label><select name="online_transaction_id" id="online_transaction_id" class="sumo-select" tabindex="-1" ><option value="">Select Order Id</option>';
                        $.each(responseObject.data.order, function (index, item) {
                            order += '<option value="'+index+'">'+item+'</option>';
                        });
                        order += '</select>';
                        $('#onlinePaymentApprovedListDiv').html(order);
                    }
                    else{
                        $('#error_span_online_transaction_id').show().html('Order ID is blank.');
                        $('#updateOnlinepayment').prop('disabled',true);
                        return;
                    }
                }
                LoadReportDatepicker();
            }
			floatableLabel();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    $('#myModal').on('hidden.bs.modal', function(){
        $("#modalIframe").html("");
        $("#modalIframe").attr("src", "");
    });
}

function rePushErpData(data){
    if($('#repush_id').val()!=="select"){
        $("#repushapp_selecterror").hide();
        $.ajax({
           url: '/connector/repush-applicationtoErp',
           type: 'post',
           dataType: 'html',
           data: {data:data,trigerpoint:$('#repush_id').val()},
           headers: {
               "X-CSRF-Token": jsVars._csrfToken
           },
           success: function (responseData) {
               $('#repushapp_button').prop('disabled', true);
               $("#repush_success").show();
           }
       });
   }else{

       $("#repushapp_selecterror").show();
       $('#repushapp_button').prop('disabled', false);
   }
}


function updatePaymentStatusConfirm(){
    $('#onlinePaymentApprovedModal .error').hide().html('');
    var orderId = $("#online_transaction_id").val();
    var paymentEndDate = $("#payment_end_date").val();
    var transaction_id = $("#transaction_id").val();
    var error = false;

    if(typeof orderId == 'undefined' || orderId=='' || orderId==0 || orderId==null) {
        $('#error_span_online_transaction_id').show().html('Order ID is required');
        error = true;
    }
    if(typeof paymentEndDate == 'undefined' || paymentEndDate=='' || paymentEndDate==0 || paymentEndDate==null) {
        $('#error_span_payment_end_date').show().html('Payment end date is required');
         error = true;
    }
    if(typeof transaction_id == 'undefined' || transaction_id=='' || transaction_id==0 || transaction_id==null) {
        $('#error_span_transaction_id').show().html('Transaction ID required');
        error = true;
    }
    if( error == true){
        return;
    }

    $("#confirmYes").removeAttr('onclick');
    $('#confirmTitle').html("Confirm");
    $("#confirmYes").html('Ok');
    $("#confirmNo").html('Cancel');
    $('#ConfirmMsgBody').html('Are you sure to update payment details?');
    $('#ConfirmPopupArea').css('z-index', '11111');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
            e.preventDefault();
            $('#ConfirmPopupArea').modal('hide');
            updatePaymentStatus();
        });
    return false;
}
function updatePaymentStatus() {
    $('#updateOnlinepayment').prop('disabled',true);
    //online_transaction_id
    var error = false;
    var orderId = $("#online_transaction_id").val();
    var paymentEndDate = $("#payment_end_date").val();
    var transaction_id = $("#transaction_id").val();
    var currentCollegeId        = $("#college_id").val();
    var currentFormId           = $("#form_id").val();

    if(orderId=='' || orderId==0 || orderId==null) {
        $('#error_span_online_transaction_id').show().html('Order ID is required');
        error = true;
    }
    if( error == true){
        return;
    }

    $.ajax({
        url: '/applications/updateOnlinePayment',
        type: 'post',
        data: {'transaction_id':transaction_id,'payment_end_date':paymentEndDate,'order_id':orderId,'userId' : currentUserId, 'collegeId':currentCollegeId, 'formId':currentFormId, moduleName:'application'},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: true,
        beforeSend: function () {

        },
        complete: function () {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.sumo-select').SumoSelect({placeholder: 'Select Orders', search: true, searchText:'Select Orders'});
        },
        success: function (responseObject) {
            if (typeof responseObject['redirect'] !== 'undefined' && responseObject['redirect']!=''){
                location = responseObject['redirect'];
            }
            else if(typeof responseObject['error'] !== 'undefined' && responseObject['error']!=''){
                console.log(responseObject['error']);
                alertPopup(responseObject['error'],'error');
                $('#updateOnlinepayment').prop('disabled',false);
            }
            else if(responseObject['status']==200){
                $('#onlinePaymentApprovedModal').modal('hide');
                alertPopup(responseObject.message,'success');
            }
			floatableLabel();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function sendEmailSmsToReferee(UserId,formId,collegeId) {
//    alert(jQuery(elem).attr('id'));

    $('#ConfirmMsgBody').html("Are you sure you want to send Email/SMS to referee?");

    $('#confirmYes').unbind('click');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false});
    $('#confirmYes').click(function (e) {
            e.preventDefault();

        $.ajax({
           url: '/applications/allow-manual-referee-communication',
           type: 'post',
           dataType: 'json',
           data: {id:UserId,form_id:formId,collegeId:collegeId},
           headers: {
               "X-CSRF-Token": jsVars._csrfToken
           },
           beforeSend:function(){
            $('div#listloader').show();
            },
           success: function (data) {
                $('div#listloader').hide();
                if(data['error'] && data['error']=="session"){
                    window.location = jsVars.LOGOUT_PATH;
                }else if(data['error']){
                    alertPopup(data['error'],'error');
                }else{
                    alertPopup(data['message'],'success');
                }

           },
           error: function (xhr, ajaxOptions, thrownError) {
               console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
           }
       });

        //console.log(global_data);
        $('#ConfirmPopupArea').modal('hide');

    });
}

function saveApplicationStageBulkRequest() {
    $('#saveFollowUpButton').attr('disabled',true);
    var data = $('#bulkUpdateStageForm').serializeArray();
    $.ajax({
        url: jsVars.updateLeadStageBulkLink,
        type: 'post',
        dataType: 'json',
        data:data,
        beforeSend: function () {
            $('div#listloader').show();
        },
        complete: function () {
            $('div#listloader').hide();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json)
        {
            // $('#saveFollowUpButton').attr('disabled',false);
            if (json['redirect']) {
                location = json['redirect'];
            } else if (json['error']) {
                alertPopup(json['error'], 'error');
            } else if (json['status'] == 200) {
                $('#myModal').modal('hide');
                $("#followupModal").modal('hide');
                $('#stageChangePopup').find('#alertTitle').html('Stage Change Success');
//                if (json['downloadUrl']) {
//                    $('#stageChangePopup #downloadListing').attr('href',json['downloadUrl']);
//                    $('#stageChangePopup #showlink').show();
//                } else {
//                    $('#stageChangePopup #showlink').hide();
//                }
                $('#stageChangePopup').modal('show');
                $('#stageChangePopup .close').addClass('npf-close').css('margin-top', '2px');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
            $('#saveFollowUpButton').attr('disabled',false);
        }
    });

    return false;
}

function autoAssigmentInScoringPanel() {
    $('#autoassignmentModal').modal('show');
    var data = $('#FilterApplicationForms').serializeArray();
    data.push({name:'gdpi_prcess_id',value:'1'});
    $.ajax({
        url: jsVars.autoAssigmentInScoringPanel,
        type: 'post',
        dataType: 'html',
        data:data,
        beforeSend: function () {
            $('div#listloader').show();
        },
        complete: function () {
            $('div#listloader').hide();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (html)
        {
            if (html['message']) {
                location = json['redirect'];
            }else{
                $("#autoassignmentBodyId").html(html);
            }
            $('#scname').SumoSelect();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
        }
    });
    return false;
}

function checkPanelType(val) {
    if(typeof val!='undefined') {
        $('#autoassignmentModal').modal('show');
        var data = $('#FilterApplicationForms').serializeArray();
        data.push({name:'gdpi_prcess_id',value:'1'});
        data.push({name:'panel_id',value:val});
        $.ajax({
            url: jsVars.autoAssigmentInScoringPanelForm,
            type: 'post',
            dataType: 'html',
            data:data,
            beforeSend: function () {
                $('div#listloader').show();
            },
            complete: function () {
                $('div#listloader').hide();
            },
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (html)
            {
                if (html['message']) {
                    location = json['redirect'];
                }else{
                    $("#scorecardContailner").html(html);
                }
                $('.scname').SumoSelect();
                $("#enterApplicantCount").focusout(function(){
                    divideintogroup();
                });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
        return false;
    }
}

function getCreateEvalutor(){
    $('#create_evaluatorsModal').modal('show');
    $('#create_evaluatorsModal').find('.error').text('');
    $('#create_evaluatorsModal').find('.success').text('');
    $.ajax({
        url: jsVars.FULL_URL+'/score-card/create-evaluator',
        type: 'post',
        dataType: 'html',
        data:{type:'get_page'},
        beforeSend: function () {
            $('div#listloader').show();
        },
        complete: function () {
            $('div#listloader').hide();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (html)
        {
            if (html['message']) {
                location = html['redirect'];
            }else{
                $("#body_evaluatorsModal").html(html);
            }
            $('.sumo-select').SumoSelect();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
            $('#saveFollowUpButton').attr('disabled',false);
        }
    });
   return false;
}

function CreateEvaluatorUser(type){

    if(typeof type=='undefined'){
        type='';
    }

    var collegeId=$("#college_id").val();
    if(typeof collegeId =='undefined' || collegeId=='')
        return false;

    var data = $('#createvaluators').serializeArray();
    data.push({name:'collegeId',value:collegeId});
    $.ajax({
        url: jsVars.FULL_URL+'/users/create-evaluator-user',
        type: 'post',
        dataType: 'json',
        data:data,
        beforeSend: function () {
            $('div#listloader').show();
        },
        complete: function () {
            $('div#listloader').hide();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json)
        {
            $('#createvaluators').find('.text-danger').text('');
            if(json['status']!=200) {
                data=JSON.parse(json['message']);
                if(data=='session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    $.each(data,function(k,v){
                        if($('#createvaluators').find('.error_'+k).length>0){
                            $('#createvaluators').find('.error_'+k).text(v);
                        }else{
                            var txt='';
                            txt=$('#create_evaluatorsModal').find('.error').html();
                            v=v.split('.')[0];
                            $('#create_evaluatorsModal').find('.error').html(txt+v);

                        }
                    });

                }
            }else{
                $('#create_evaluatorsModal').find('.success').text(json['message']);

                $.ajax({
                        url: jsVars.FULL_URL+'/score-card/getEvaluatorList',
                        type: 'post',
                        dataType: 'json',
                        data:{collegeId:collegeId},
                        beforeSend: function () {
                            $('div#listloader').show();
                        },
                        complete: function () {
                            $('div#listloader').hide();
                        },
                        headers: {
                            "X-CSRF-Token": jsVars._csrfToken
                        },
                        success: function (result){
                            if(result['status']=='200'){
                                var html = "<select  name='evaluator_id[]'  class='sumo-select scname' onchange='addNewEvaluator(this)'>";
                                 $.each(result['data'],function(index, value){
                                     html += '<option value="'+index+'" >' + value + '</option>';
                                 });
                                 html+='</select>';

                                 $('.eval_list').each(function(){
                                     $(this).html(html);
                                 });
                                 if($('.scname').length>0){
                                     $('.scname').SumoSelect();
                                 }
                            }else{
                                if(result['message']=='session'){
                                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                                }
                            }
                        }

                });
                if(type=='add_more'){
                    $('#createvaluators').find('.form-control').val('');
                    $('.country_dial_code')[0].sumo.unload();
                    $('.country_dial_code').val('+91');
                    $('.country_dial_code').SumoSelect();
                }else{
                     $('#create_evaluatorsModal').modal('hide');
                }
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
            $('#saveFollowUpButton').attr('disabled',false);
        }
    });
    return false;
}

function addNewEvaluator(context){
    var value=$(context).val();
    if(typeof value=='undefined'){
        return false;
    }
    if(value=='open_add_evaluator'){
        getCreateEvalutor();
    }
    return false;
}

$("#panelAssigments").click(function(){
    var allocationData = $("#autoAllocationForms").serializeArray();
    var data = $('#autoAllocationForms,#FilterApplicationForms').serialize();
    $.ajax({
        url: jsVars.FULL_URL+'/score-card/panelassigment',
        type: 'post',
        dataType: 'json',
        data:data,
        beforeSend: function () {
            $('div#listloader').show();
        },
        complete: function () {
            $('div#listloader').hide();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (html)
        {

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
});

$(document).on('change', '#followupModal #counsellorId',function(e) {
    $('#leadFollowupCheck').attr('checked',false);
    if(currentUserId == '' && currentCollegeId == '') {
        $("#followUpMessageDiv").html("<div class='alert-danger'>Something went wrong. please refresh page and try again.</div>");
        return false;
    }
    var counsellor_id  = $(this).val();
    var data = {'user_id' : currentUserId, 'college_id':currentCollegeId,'counsellor_id':counsellor_id};
    showLoader();
    $.ajax({
        url : "/counsellors/get-over-due-followup-count",
        type : "post",
        data : data,
        dataType : 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        complete : function(){
            hideLoader();
            $('#lead_delate_btn').attr('disabled', false);
        },
        success : function (responseObject){
            if(typeof responseObject.data.overdueFollowUpCount!=='undefined' && responseObject.data.overdueFollowUpCount>0){
                $('#div_followup_check').show();
            }else{
                $('#div_followup_check').hide();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
});


function divideintogroup(){
    var maxGrpNumber = Number($("#enterApplicantCount").val());
    var data = $('#FilterApplicationForms').serializeArray();
    var panel_id = $("#scname").val();
    data.push({name:'gdpi_prcess_id',value:'1'});
    data.push({name:'maxGrpNumber',value:maxGrpNumber});
    data.push({name:'panel_id',value:panel_id});
    $.ajax({
        url: jsVars.FULL_URL+'/score-card/getGroupSlotWise',
        type: 'post',
        dataType: 'html',
        data:data,
        beforeSend: function () {
            $('div#listloader').show();
        },
        complete: function () {
            $('div#listloader').hide();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (html)
        {
            if (html['message']) {
                location = html['redirect'];
            }else{
                $("#slotdetailstable").html(html);
            }
            $('.sumo-select').SumoSelect();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
            $('#saveFollowUpButton').attr('disabled',false);
        }
    });

}

$('html').on('change','#evaluator_name',function(){
    $('#svmeetingno').trigger('click');
});

$('html').on('click','#tentative_evaluation_date',function(){
     $('#svmeetingno').trigger('click');
});

$('html').on('change','#group_range',function(){
     $('#svmeetingno').trigger('click');
});

var newMeeting = '';
function getMeetingBox(context){
    newMeeting = context;
    $("#schedulevideomeeting").html('');
    $('#meetingPlatform').addClass('hide');
    $('#meeting_platform').val('');
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true,'placeholder':'Please Select Video Meeting Platform to be used'});
    $('.chosen-select').trigger('chosen:updated');
    if(context == 'no'){
        return;
    }else{
        if (validateAllocateScoreCard(false) === false) {
            $('#svmeetingno').prop("checked",true);
            $('#meetingPlatform').addClass('hide');
            return;
        }else{
            $('#meetingPlatform').removeClass('hide');
        }
    }
}

$('html').on('change','#meeting_platform',function(){
    if($(this).val() == ''){
       $("#schedulevideomeeting").html('');
       return;
    }
    getMeetingBoxAjax();
});


function getMeetingBoxAjax(){
    console.log(newMeeting);
     $.ajax({
        url: jsVars.FULL_URL+'/score-card/getMeetingBox',
        type: 'post',
        dataType: 'html',
        data:{'panel_id':$("#panel_id").val(),'tentative_time':$("#tentative_evaluation_date").val(),'group_range':$("#group_range").val(),
              'userId':$("#userId").val(),'collegeId':$("#college_id").val(),'formId':$("#form_id").val(),'context':newMeeting,'meeting_platform':$('#meeting_platform').val()},
        beforeSend: function () {
            $('div#listloader').show();
        },
        complete: function () {
            $('div#listloader').hide();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (html)
        {
            if (html=='session') {
               location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else{
                $("#schedulevideomeeting").html(html);
            }
            $('.sumo-select').SumoSelect();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
            $('#saveFollowUpButton').attr('disabled',false);
        }
    });
}

function getHost(){
    var accouint_id= $('#zoom_accounts').val();
    var meeting_platform= $('#meeting_platform').val();
    console.log(meeting_platform);
    if(meeting_platform != 'zoom'){
        return;
    }
    if ($("#evaluator_name").val() === "" || $("#evaluator_name").val() === null) {
        $('#evaluator_name_error').html("Mandatory to select the above field!");
        $('#evaluator_name_error').show();
        $('#zoom_accounts').val('');
        $('#meeting_host').val('');
        $('#zoom_accounts')[0].sumo.reload();
        $('#meeting_host')[0].sumo.reload();
    }
    if(accouint_id=="" || accouint_id ==0){
        $('#zoom_accounts_error').html("Mandatory to select the above field!");
        $('#zoom_accounts_error').show();
    }else{

        $.ajax({
            url: jsVars.FULL_URL+'/virtual-post-applications/get-host',
            type: 'post',
            dataType: 'json',
            data:{account_id:accouint_id,'evaluators':$("#evaluator_name").val(),'form_id':$("#form_id").val()},
            beforeSend: function () {
                $('div#listloader').show();
            },
            complete: function () {
                $('div#listloader').hide();
            },
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (data) {
                if (data=='session') {
                   location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else if(typeof data['hosts'] != 'undefined'){
                    if(typeof data['hosts'] === "object" ){
                        htmlOption = '';
                        $.each(data['hosts'], function (index, value) {
                            htmlOption +='<option value="'+index+'">'+value+'</option>';
                        });
                        $("#meeting_host").html(htmlOption);
                        $('.meeting-config').removeClass('hide');
                    }else {
                         $('.meeting-config').addClass('hide');
                    }
                    $('#meeting_host')[0].sumo.reload();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
                $('#saveFollowUpButton').attr('disabled',false);
            }
        });

     }
}

function sendBulkEmailSmsToReferee() {
    var total_checked=0;
    var display_popup = false;
    $('input:checkbox[name="selected_users[]"]').each(function () {
        if(this.checked){
            display_popup = true;
            total_checked++;
        }
    });
    var checkbox_alert  = false;
    var select_all      = $('#select_all:checked').val();
    var ctype           = $('input#ctype').val();
    if($('#form_id').val() == '' || $('#form_id').val() == '0') {
        alertPopup('Please select form','error');
        return false;
    }
    $('#ConfirmMsgBody').html("Are you sure you want to send Email/SMS to referee?");
    if(display_popup ||
       select_all == 'select_all' ||
       ($('#single_user_id').length>0 && $('#single_user_id').val() != '' )
            ){

    }else{
        var message='Please select User';
        alertPopup(message,'error');
        return false;
    }
    $('#confirmYes').unbind('click');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false}).off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        var data = $('#FilterApplicationForms').serializeArray();
        $.ajax({
            url: '/applications/validate-advance-filter',
            type: 'post',
            dataType: 'html',
            data: data,
            beforeSend: function (xhr) {

               showLoader();
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            async:true,
            success: function (data) {


                var $form = $("#FilterApplicationForms");
                $form.attr("action",jsVars.FULL_URL+'/applications/ajax-lists');
                $form.attr("target",'modalIframe');
                $form.append($("<input>").attr({"value":"export", "name":"export",'type':"hidden","id":"export"}));
                $form.append($("<input>").attr({"value":"bulkRefereeCommunication", "name":"bulkRefereeCommunication",'type':"hidden","id":"bulkRefereeCommunication"}));

                var onsubmit_attr = $form.attr("onsubmit");
                $form.removeAttr("onsubmit");
                //ajax form submit
                var data = $form.serializeArray();
                $form.ajaxSubmit({
                    url: jsVars.FULL_URL+'/applications/ajax-lists',
                    type: 'post',
                    data : data,
                    dataType:'html',
                    headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                    success:function (data){
                        $form.find('input[name="bulkRefereeCommunication"]').remove();
                        $form.find('input[name="export"]').remove();
                        if(data['error'] && data['error']=="session"){
                            window.location = jsVars.LOGOUT_PATH;
                        }else if(data['error']){
                            alertPopup(data['error'],'error');
                        }else{
                            $('#bulkRefereeCommunicationPopup').modal('show');
                            //alertPopup("We have Received Your Request. We are currently processing your request.",'success');
                        }
                        //$('#SuccessPopupArea').modal('show');

                        //$('#muliUtilityPopup .close').addClass('npf-close').css('margin-top', '2px');
                        //$('#SuccessPopupArea p').html("Mail Sent Successfully")

                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        $form.find('input[name="export"]').remove();
                        $form.find('input[name="bulkRefereeCommunication"]').remove();
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    }
                })
                $form.attr("onsubmit", onsubmit_attr);
                $form.find('input[name="export"]').val("");
                $form.removeAttr("target");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            },
            complete: function () {
                hideLoader();
            }
        });
        $('#ConfirmPopupArea').modal('hide');
    });
}

function getViewAsApplicantLink(userId, formId, collegeId) {
    var mappedLocation = '';
    if( $("#mapped_location").length ){
        if( $("#mapped_location").val()==="" ){
            alertPopup('Please select a location.', 'error');
            return;
        }else{
            mappedLocation = $("#mapped_location").val();
        }
    }
    $('#ConfirmMsgBody').html("Are you sure you want to view as Applicant?");
    $('#confirmYes').unbind('click');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false}).off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $.ajax({
            url: jsVars.getViewAsApplicantLink,
            type: 'post',
            data: { userId : userId, collegeId : collegeId, formId : formId, mappedLocation:mappedLocation },
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars.csrfToken
            },
            beforeSend: function () {
                $('div.loader-block-a').show();
            },
            complete: function () {
                $('div.loader-block-a').hide();
            },
            success: function (json) {
                if (json['redirect']) {
                    location = json['redirect'];
                } else if (json['error']) {
                    alertPopup(json['error'], 'error');
                } else if (json['status'] == 200) {
                    if (json['loginLink']) {
                        //window.open( json['loginLink'], '_blank');
                        window.open( json['loginLink'], 'viewAsApplicantWindow', 'width=1200, height=600, scrollbars=yes, left=100, top=50');
                    } else {
                        alertPopup('Something went wrong!', 'error');
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

        //console.log(global_data);
        $('#ConfirmPopupArea').modal('hide');
    });
}

function triggerApplicationTransfer(applicationTransferUrl, formName, applicantName) {
    $.ajax({
        url: '/applications/applicationTransfer/'+applicationTransferUrl,
        type: 'get',
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (response) {
	    var responseObject = $.parseJSON(response);
	    if (responseObject.message === 'session'){
		window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
	    }else if(responseObject.status==1){
                $('#utilityPopup .modal-title').html('Program Transfer');
                data = responseObject.data.html.replace("<head/>", '');
                $('#utilityPopup .modal-dialog').removeClass('modal-lg').addClass('modal-sm');
                $('#utilityPopup .modal-body').html(data);
                $('#utilityPopup').modal('show');
                $("#app_transferred_applicant").val(applicantName);
                $("#app_transferred_application").val(formName);
                $('#app_transferred_to').chosen();
                $('#app_transferred_to').trigger('chosen:updated');
            }else if( typeof responseObject.message !=='undefined' && $.trim(responseObject.message)!=='' ){
                alertPopup(responseObject.message,'error');
                return false;
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
   });
}

function triggerRecieptNoTransfer(applicationTransferUrl) {
    $.ajax({
        url: jsVars.FULL_URL+'/applications/recieptNoTransfer/'+applicationTransferUrl,
        type: 'get',
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (response) {
	    var responseObject = $.parseJSON(response);
	    if (responseObject.message === 'session'){
		window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
	    }else if(responseObject.status==1){
                $('#utilityPopup .modal-title').html('Receipt Transfer');
                var data = responseObject.data.html.replace("<head/>", '');
                $('#utilityPopup .modal-dialog').removeClass('modal-lg').addClass('modal-sm');
                $('#utilityPopup .modal-body').html(data);
                $('#utilityPopup').modal('show');
            }else if( typeof responseObject.message !=='undefined' && $.trim(responseObject.message)!=='' ){
                alertPopup(responseObject.message,'error');
                return false;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
   });
}

function receiptTransfer(applicationTransferUrl) {
    var receipt_no    = $("#receipt_no").val();
    var arndate    = $("#receipt_no_date").val();
    var amount    = $("#amount").val();
    $("#appTransferError").html("");
    $("#app_transfer_to_error").html("");
    $("#app_transfer_remark_error").html("");
    var valid   = true;
    if($.trim(receipt_no)===""){
        $("#receipt_no_error").html("Please select an application.");
        valid   = false;
    }
    if( typeof receipt_no==="undefined" || receipt_no==="" || receipt_no== null){
        $("#receipt_no_error").html("Please enter receipt number.")
        valid   = false;
    }
    if( typeof arndate==="undefined" || arndate==="" || arndate== null){
        $("#receipt_no_date_error").html("Please select date.")
        valid   = false;
    }
    if( typeof amount==="undefined" || amount==="" || amount== null){
        $("#amount_error").html("Please enter amount.")
        valid   = false;
    }
    if(!valid){
        return false;
    }
    $("#appTransferButton").hide();
    $("#appTransferButtonWait").show();
    $.ajax({
        url: jsVars.FULL_URL+'/form/receiptTransfer/'+applicationTransferUrl,
        type: 'post',
        data:{receipt_no:receipt_no, rcdate:arndate,amount:amount},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        complete:function(){
            $("#appTransferButton").show();
            $("#appTransferButtonWait").hide();
        },
        success: function (response) {
	    var responseObject = $.parseJSON(response);
	    if (responseObject.message === 'session'){
		window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
	    }else if(responseObject.status==1){
                $('#utilityPopup .modal-title').html('');
                $('#utilityPopup .modal-body').html('');
                $('#utilityPopup').modal('hide');
                window.open('/form/preview/'+responseObject.data.applicationEditLink, 'prev_'+responseObject.data.userId, 'width=1200, height=600, scrollbars=yes, left=100, top=50');
            }else if( typeof responseObject.message !=='undefined' && $.trim(responseObject.message)!=='' ){
                $("#appTransferError").html(responseObject.message);
                $("#appTransferError").show();
                return false;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
   });
}

function applicationTransfer(applicationTransferUrl) {
    var appTransferredTo    = $("#app_transferred_to").val();
    var appTransferRemarks    = $("#app_transfer_remarks").val();
    $("#appTransferError").html("");
    $("#app_transfer_to_error").html("");
    $("#app_transfer_remark_error").html("");
    var valid   = true;
    if($.trim(appTransferredTo)===""){
        $("#app_transfer_to_error").html("Please select an application.");
        valid   = false;
    }
    if( typeof appTransferRemarks==="undefined" || appTransferRemarks==="" || appTransferRemarks== null){
        $("#app_transfer_remark_error").html("Please enter remarks.")
        valid   = false;
    }else if(appTransferRemarks.length > 255){
        $("#app_transfer_remark_error").html("Maximum length of remarks is 255.")
        valid   = false;
    }
    if(!valid){
        return false;
    }
    $("#appTransferButton").hide();
    $("#appTransferButtonWait").show();
    $.ajax({
        url: '/form/transferApplication/'+applicationTransferUrl,
        type: 'post',
        data:{appTransferredTo:appTransferredTo, appTransferRemarks:appTransferRemarks},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        complete:function(){
            $("#appTransferButton").show();
            $("#appTransferButtonWait").hide();
        },
        success: function (response) {
	    var responseObject = $.parseJSON(response);
	    if (responseObject.message === 'session'){
		window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
	    }else if(responseObject.status==1){
                $('#utilityPopup .modal-title').html('');
                $('#utilityPopup .modal-body').html('');
                $('#utilityPopup').modal('hide');
                window.open('/form/preview/'+responseObject.data.applicationEditLink, 'prev_'+responseObject.data.userId, 'width=1200, height=600, scrollbars=yes, left=100, top=50');
            }else if( typeof responseObject.message !=='undefined' && $.trim(responseObject.message)!=='' ){
                $("#appTransferError").html(responseObject.message);
                return false;
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
   });
}

function triggerMinimumAmount(applicationTransferUrl, formName, applicantName) {
    $.ajax({
        url: '/applications/minimumAmount/'+applicationTransferUrl,
        type: 'get',
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (response) {
	    var responseObject = $.parseJSON(response);
	    if (responseObject.message === 'session'){
		window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
	    }else if(responseObject.status==1){
                $('#utilityPopup .modal-title').html('Enter Minimum Amount');
                data = responseObject.data.html.replace("<head/>", '');
                $('#utilityPopup .modal-dialog').removeClass('modal-lg').addClass('modal-sm');
                $('#utilityPopup .modal-body').html(data);
                $('#utilityPopup').modal('show');
                $("#minimum_amt_applicant").val(applicantName);
                $("#minimum_amt_form_name").val(formName);
            }else if( typeof responseObject.message !=='undefined' && $.trim(responseObject.message)!=='' ){
                alertPopup(responseObject.message,'error');
                return false;
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
   });
}

function saveMinimumAmount(applicationTransferUrl) {
    var minimumAmount    = $("#minimum_amount").val();
    $("#minimum_amount_error").html("");
    var valid   = true;
    if($.trim(minimumAmount)==="" || isNaN(parseFloat(minimumAmount)) || parseFloat(minimumAmount) > parseFloat(minimumAmount) ){
        $("#minimum_amount_error").html("Please enter valid minimum amount.");
        valid   = false;
    }
    if(!valid){
        return false;
    }
    $("#saveMinimumAmountButton").hide();
    $("#saveMinimumAmountButtonWait").show();
    $.ajax({
        url: '/applications/saveMinimumAmount/'+applicationTransferUrl,
        type: 'post',
        data:{minimumAmount:minimumAmount},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        complete:function(){
            $("#saveMinimumAmountButton").show();
            $("#saveMinimumAmountButtonWait").hide();
        },
        success: function (response) {
	    var responseObject = $.parseJSON(response);
	    if (responseObject.message === 'session'){
		window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
	    }else if(responseObject.status==1){
                $('#utilityPopup .modal-title').html('');
                $('#utilityPopup .modal-body').html('');
                $('#utilityPopup').modal('hide');
                alertPopup(responseObject.message,'success');
            }else if( typeof responseObject.message !=='undefined' && $.trim(responseObject.message)!=='' ){
                $("#minimum_amount_error").html(responseObject.message);
                return false;
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
   });
}

function confirmationForMinimumAmountApproval(applicationTransferUrl, formName, applicantName) {
    $.ajax({
        url: '/applications/confirmationForMinimumAmountApproval/'+applicationTransferUrl,
        type: 'get',
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (response) {
	    var responseObject = $.parseJSON(response);
	    if (responseObject.message === 'session'){
		window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
	    }else if(responseObject.status==1){
                $('#utilityPopup .modal-title').html('Approve Minimum Amount');
                data = responseObject.data.html.replace("<head/>", '');
                $('#utilityPopup .modal-dialog').removeClass('modal-lg').addClass('modal-sm');
                $('#utilityPopup .modal-body').html(data);
                $('#utilityPopup').modal('show');
                $("#minimum_amt_applicant").val(applicantName);
                $("#minimum_amt_form_name").val(formName);
            }else if( typeof responseObject.message !=='undefined' && $.trim(responseObject.message)!=='' ){
                alertPopup(responseObject.message,'error');
                return false;
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
   });
}

function approveMinimumAmount(applicationTransferUrl) {
    $.ajax({
        url: '/applications/approveMinimumAmount/'+applicationTransferUrl,
        type: 'post',
        data:{},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        complete:function(){
        },
        success: function (response) {
	    var responseObject = $.parseJSON(response);
	    if (responseObject.message === 'session'){
		window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
	    }else if(responseObject.status==1){
                $('#utilityPopup .modal-title').html('');
                $('#utilityPopup .modal-body').html('');
                $('#utilityPopup').modal('hide');
                alertPopup(responseObject.message,'success');
            }else if( typeof responseObject.message !=='undefined' && $.trim(responseObject.message)!=='' ){
                alertPopup(responseObject.message,'error');
                return false;
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
   });
}

var showSuccessfulTransferMessage   = function(message){
    $('#utilityPopup .modal-title').html('Program Transfer Successfull.');
    $('#utilityPopup .modal-body').html(message);
    $('#utilityPopup').modal('show');
}

var redirectTologin  = function(){
    window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
}

function getGdpiProcess(userId, collegeId, formId){
    $(".slot_msg").html('');
    $(".slot_msg").hide();
    $('.slot_msg').removeClass('error');
    $(".slotBookingDetailsDiv").html('');
    $("#processListDiv").show();
    $(".slotBookingDetailsDiv").show();
    currentUserId           = userId;
    currentCollegeId        = collegeId;
    currentFormId           = formId;
    $.ajax({
        url: '/virtual-post-applications/get-gdpi-process-list',
        type: 'post',
        data: {'formId':currentFormId, collegeId:currentCollegeId},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: false,
        beforeSend: function () {
            processList               = [];
        },
        complete: function () {
            $('.chosen-select').chosen();
        },
        success: function (json) {
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(json['status'] ===1 && typeof json['data']['processList'] !== 'undefined') {
                processList               = json['data']['processList'];
                var processListDiv  = '<label class="floatify__label" for="process_name">Please Select Process Name</label><select name="gdpi_process_id" id="gdpi_process_id" class="chosen-select changeGdpiProcess" tabindex="-1"><option value="">Select Process</option>';
                $.each(processList, function (index, item) {
                    processListDiv += '<option value="'+item['processId']+'">'+item['processName']+'</option>';
                });
                processListDiv += '</select>';
                $('#processListDiv').html(processListDiv);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

}

$(document).on('change', '.changeGdpiProcess', function(){
    var gdpiProcessId = $(this).val();
    if(gdpiProcessId === '' || gdpiProcessId === 0) {
        $(".slotBookingDetailsDiv").html('');
        return;
    }
    $.ajax({
        url: '/virtual-post-applications/gdpiSlotBookingThroughAm',
        type: 'post',
        data: {'formId':currentFormId, collegeId:currentCollegeId, 'gdpiProcessId':gdpiProcessId, 'applicantId':currentUserId},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: false,
        beforeSend: function () {
            $(".slotBookingDetailsDiv").html('');
        },
        complete: function () {
            $('.chosen-select').chosen();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status===1){
                if(responseObject.data.html) {
                    $(document).find(".slotBookingDetailsDiv").html(responseObject.data.html);
                }
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message, 'error');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
});

function bulkSlotAssignment(){
    if($("#college_id").val()=='' || $("#college_id").val()==0 || $("#college_id").val()==null){
        alertPopup('Please select college','error');
        return;
    }
    if($("#form_id").val()=='' || $("#form_id").val()==0 || $("#form_id").val()==null){
        alertPopup('Please select form','error');
        return;
    }
//    if($('input:checkbox[name="selected_users[]"]:checked').length < 1 && $('#select_all:checked').val()!=='select_all'){
//        alertPopup('Please select User','error');
//        return;
//    }
    $("#counsellorListDiv").html("");
    currentCollegeId        = $("#college_id").val();
    currentFormId           = $("#form_id").val();
    $("#slotAssignmentModal").modal('show');
    $(".slot_msg").html('');
    $(".slot_msg").hide();
    $('.slot_msg').removeClass('error');
    $(".slotBookingDetailsDiv").html('');
    $("#processListDiv").show();
    $(".slotBookingDetailsDiv").show();
    $.ajax({
        url: '/virtual-post-applications/get-gdpi-process-list',
        type: 'post',
        data: {'formId':currentFormId, collegeId:currentCollegeId},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: false,
        beforeSend: function () {
            processList               = [];
        },
        complete: function () {
            $('.chosen-select').chosen();
        },
        success: function (json) {
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(json['status'] ===1 && typeof json['data']['processList'] !== 'undefined') {
                processList               = json['data']['processList'];
                var processListDiv  = '<label class="floatify__label float_addedd_js" for="process_name">Please Select Process Name</label><select name="gdpi_process_id" id="gdpi_process_id" class="chosen-select changeGdpiProcessBulk" tabindex="-1"><option value="">Select Process</option>';
                $.each(processList, function (index, item) {
                    processListDiv += '<option value="'+item['processId']+'">'+item['processName']+'</option>';
                });
                processListDiv += '</select>';
                $('#processListDiv').html(processListDiv);
                floatableLabel();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$(document).on('change', '.changeGdpiProcessBulk', function(){
    var gdpiProcessId = $(this).val();
    if(gdpiProcessId === '' || gdpiProcessId === 0) {
        $(".slotBookingDetailsDiv").html('');
        return;
    }
    var selectedApplicantId = [];
    var totalRecords = 0;
    if($('#select_all:checked').val() === 'select_all') {
        selectedApplicantId.push('all');
        totalRecords = $("#all_records_val").val();
    } else {
        var splitedUserId;
        $('input:checkbox[name="selected_users[]"]:checked').each(function(){
           splitedUserId = parseInt($(this).val().split('_')[0]);
           selectedApplicantId.push(splitedUserId);
        });
        totalRecords = selectedApplicantId.length;
    }
//    if(selectedApplicantId.length === 0){
//        alertPopup('Please select User','error');
//        return;
//    }
    var filterVal = $("#leadsListFilters").val();
    $.ajax({
        url: '/virtual-post-applications/gdpiSlotBookingThroughAmBulk',
        type: 'post',
        data: {'formId':currentFormId, collegeId:currentCollegeId, 'gdpiProcessId':gdpiProcessId, 'selectedApplicantId':selectedApplicantId, 'totalRecords':totalRecords, 'filterVal':filterVal},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: false,
        beforeSend: function () {
            $(".slotBookingDetailsDiv").html('');
        },
        complete: function () {
            $('.chosen-select').chosen();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status===1){
                if(responseObject.data.html) {
                    $(document).find(".slotBookingDetailsDiv").html(responseObject.data.html);
                }
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message, 'error');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
});

/**
 *
 * @param {type} data encoded value
 * @returns {html}
 */
 function viewDigilockerStatus(data){
    $.ajax({
       url: '/leads/get-digilocker-status',
       type: 'post',
       dataType: 'html',
       data: {data:data},
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       success: function (data) {
           if(data=='session_logout'){
               window.location.reload(true);
           }else if(data == 'permision_denied'){
               window.location.href= '/permissions/error';
           }
		   $('#utilityPopup .modal-dialog').addClass('modal-sm');
		   $('#utilityPopup .modal-title').html('View Aadhaar Verification Details');
		   $('#utilityPopup .modal-body').html(data);
           $('#utilityPopup').modal('show');
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}


// Start : [65.8.8] Download Realignment Work
// action : 'list' for listing and 'download' for downloading leads
function addRemoveColumnPopup(action = 'list') {
    let list_view_fields_selected = $('#list_view_fields_selected').val();
    $('#download_type_option').hide();
    if (action === 'list') {
        $('.download-action-btn').hide();
        $('.list-action-btn').show();
        $('#addRemoveColumnModal .modal-title > span').html('Customize Column');
        $('#addRemoveColumnModal .modal-title').removeClass('downloadtitle');
    } else if (action === 'download') {
        if (typeof is_filter_button_pressed === 'undefined' || is_filter_button_pressed !== 1) {
            alertPopup('It seems you have changed the filter but not Applied it. Please re-check the same to proceed further.', 'error');
            return false;
        }
        $('#export_type').val('csv');
        $('#download_type_option').show();
        $('#download_all').val('no');
        $('.list-action-btn').hide();
        $('.download-action-btn').show();
        $('#addRemoveColumnModal .modal-title > span').html('Download');
        $('#addRemoveColumnModal .modal-title').addClass('downloadtitle');
        $('#download_all_chosen .chosen-search,#export_type_chosen .chosen-search').hide();
    }
    if (list_view_fields_selected.length > 0) {
        createDefaultSortable(list_view_fields_selected, 'restore');
    } else {
        resetAddRemoveColumnPopup();
    }
    $('#addRemoveColumnModal').modal('show');
    $('#add_remove_column_serach').val('').trigger('onkeyup');
    $('.chosen-select').trigger('chosen:updated');
    createFieldsOrder();
    return false;
}

// selected_fields : 'all_fields' for selecting all fields and download
// selected_fields : 'selected_fields' for selecting specified fields and download
function downloadConfirmPopup(){
    var record_count = $("#all_records_val").val();
    var users   = [];
    $('input:checkbox[name="selected_users[]"]').each(function () {
        if(this.checked){
            users.push(parseInt($(this).val()));
        }
    });

    if(users.length > 0 || $('#select_all:checked').val()==='select_all'){

        if($('#select_all:checked').val()==='select_all'){
            record_count = $("#all_records_val").val();
        }else{
            record_count = users.length;
        }
    }
    $('.selected_user_counts').html(record_count);
    validateFilter();
    $('#ConfirmDownloadTrigger').trigger('click');
    return false;
}

function createDefaultSortable(defaultFields, restoreIt,collegeId = '',formId = '') {
    let default_li = '';
    let default_fixed_li = '';
    const defaultFieldArr = defaultFields.split(",");
    const disable_realignment_fields = jsVars.disable_realignment_fields;
    const avilable_columns = [];
    if (restoreIt === 'restore') {
        if(formId != ''){
            $.ajax({
                url: '/applications/filter-column-options-college-application',
                type: 'post',
                dataType: 'json',
                data: {'college_id':collegeId,'form_id':formId},
                async:false,
                headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                beforeSend: function () {  showFilterLoader(); },
                complete: function () { hideFilterLoader(); },
                success: function (json) {
                    if (typeof json['redirect'] !== 'undefined' && json['redirect'] !== "") {
                        window.location.href= json['redirect'];
                    }
                    else if (typeof json['status'] !== 'undefined' && json['status'] === 200) {
                        $('ul#column_li_list').html('');
                        $('ul#column_li_list').html(json['column']);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        }
        $("ul#column_li_list .column_create_keys").each(function () {
            let $col = $(this);
            let column_val = $col.val();
            $col.prop('checked', false);
            avilable_columns.push(column_val);
            $col.removeAttr('disabled');
            defaultFieldArr.forEach(function (default_columns,index) {
                if (default_columns.indexOf('||')!== -1 && column_val == default_columns) {
                    $col.prop('checked', true);
                    defaultFieldArr[index] = column_val;
                }else if(default_columns.indexOf('||') == -1 && column_val.indexOf(default_columns) !== -1){
                    $col.prop('checked', true);
                    defaultFieldArr[index] = column_val;
                }
            });
            if ($.inArray(column_val, disable_realignment_fields) !== -1) {
                $col.attr('disabled', true);
            }
        });
    } else {
        $("ul#column_li_list .column_create_keys").each(function () {
            avilable_columns.push($(this).val());
            $(this).removeAttr('disabled');
            if ($.inArray($(this).val(), disable_realignment_fields) !== -1) {
                $(this).attr('disabled', true);
            }
        });
    }
    defaultFieldArr.forEach(function (item) {
        if (avilable_columns.length > 0  && $.inArray(item, avilable_columns) !== -1) {
            const fieldNameArr = item.split("||");
            let isDisabled = $("input.column_create_keys[value='" + item + "']").attr('disabled');
            if (fieldNameArr[0] === 'ud|name' || fieldNameArr[0] === 'fd|application_no' || fieldNameArr[0] === 'f|form_title') {
                default_fixed_li += '<li class="draggable_column_item" data-field-value="' + item + '">';
                default_fixed_li += '<input type="hidden" name="column_sorting_order[]" value="' + item + '">';
                default_fixed_li += fieldNameArr[1];
                default_fixed_li += '</li>';
            } else {
                default_li += '<li class="draggable_column_item" data-field-value="' + item + '">';
                default_li += '<input type="hidden" name="column_sorting_order[]" value="' + item + '">';
                default_li += fieldNameArr[1];
                if (!isDisabled) {
                    default_li += '<button type="button" data-clickable="true" data-toggle="tooltip" data-placement="left" title="Click here to remove"  class="remove_draggable"  aria-label="remove_draggable" data-field_value="' + item + '">×</button>';
                }
                default_li += '</li>';
            }
        }
    });
    $('#non_dragable,#dragItemBox').html('');
    $('#non_dragable').html(default_fixed_li);
    $('#dragItemBox').html(default_li);
    $('[data-toggle="tooltip"]').tooltip();
}
// Realign Columns
$(document).ready(function(){
    $('#dragItemBox').sortable().on('sortable:stop',function(e, ui){
        createFieldsOrder();
    })
    $('#ConfirmDownloadPopupArea,#addRemoveColumnModal').on('hidden.bs.modal', function () {
        $('.download-action-btn').removeAttr('disabled');
        let $filterForm = $("#FilterApplicationForms");
        $filterForm.attr("onsubmit", 'return LoadMoreApplication("reset");');
        $filterForm.removeAttr("target");
    });
});

function resetAddRemoveColumnPopup(){
    $('#add_remove_column_serach').val('');
    let college_id = $("#college_id").val();
    let formId = $("#form_id").val();
    filterColumnOptionsCollegeApplication(college_id,formId,'','1');
    return false;
}

// End : [65.8.8] Download Realignment Work

function updateTransactionNumber() {
    $("#transactionButtonValidate").prop('disabled', false);
    $("#TransactionIDModalDiv").html("");
    $("#TransactionTitle").html('');
    $("#transactionid").val('');
    $("#transactionAmount").val('');
    $("#transaction_no_date").val('');
    $("#transaction_mode").val('');
    $("#bank_name").val('');
    $("#account_number").val('');
    $("#deposit_bank_account_number").val('');
    $("#deposit_bank_name").val('');
    $('.chosen-select').trigger('chosen:updated');
    $('#error_span_transactionAmount').hide().html('');
    $('#error_span_transactionMode').hide().html('');
    $('#error_span_transaction_no_date').hide().html('');

    $('#error_span_transaction_id').hide().html('');

    if($("#form_id").val()=='' || $("#form_id").val()==0 || $("#form_id").val()==null){
        alertPopup('Please select form','error');
        return;
    }
    var formId          = $("#form_id").val();
    if($('input:checkbox[name="selected_users[]"]:checked').length < 1 && $('#select_all:checked').val()!='select_all'){
        alertPopup('Please select User','error');
        return;
    }

    $(".dependentDiv").hide();
    //getPageNumberHistory(userId, $("#college_id").val(), formId);

    $('#TransactionIDModal').modal('show');
}

function validatePaymentData() {
    $("#transactionButtonValidate").prop('disabled', true);
    var users   = [];
    $('input:checkbox[name="selected_users[]"]').each(function () {
        if(this.checked){
            users.push(parseInt($(this).val()));
        }
    });

    if($("#transactionid").val()=='' || $("#transactionid").val()==0 || $("#transactionid").val()==null){
        $('#error_span_transaction_id').show().html('Please enter transaction id');
        $("#transactionButtonValidate").prop('disabled', false);
        return;
    }

    if($("#transactionAmount").val()=='' || $("#transactionAmount").val()==0 || $("#transactionAmount").val()==null){
        $('#error_span_transactionAmount').show().html('Please enter transaction amount');
        $("#transactionButtonValidate").prop('disabled', false);
        return;
    }

    if($("#transaction_no_date").val()=='' || $("#transaction_no_date").val()==0 || $("#transaction_no_date").val()==null){
        $('#error_span_transaction_no_date').show().html('Please enter transaction date');
        $("#transactionButtonValidate").prop('disabled', false);
        return;
    }

    if($("#transaction_mode").val()=='' || $("#transaction_mode").val()==0 || $("#transaction_mode").val()==null){
        $('#error_span_transactionMode').show().html('Please enter transaction Mode');
        $("#transactionButtonValidate").prop('disabled', false);
        return;
    }
    $('#error_span_transactionMode').hide().html('');
    $('#error_span_transactionAmount').hide().html('');
    $('#error_span_transaction_no_date').hide().html('');
    $('#error_span_transaction_id').hide().html('');

    var $form = $("#bulkUpdateStageForm");
    $form.find('input[name="collegeId"]').val($("#college_id").val());
    $form.find('input[name="formId"]').val($("#form_id").val());
    $form.find('input[name="transaction_id"]').val($("#transactionid").val());
    $form.find('input[name="transaction_amount"]').val($("#transactionAmount").val());
    $form.find('input[name="transaction_no_date"]').val($("#transaction_no_date").val());
    $form.find('input[name="transaction_mode"]').val($("#transaction_mode").val());
    $form.find('input[name="account_number"]').val($("#account_number").val());
    $form.find('input[name="bank_name"]').val($("#bank_name").val());
    $form.find('input[name="deposit_bank_account_number"]').val($("#deposit_bank_account_number").val());
    $form.find('input[name="deposit_bank_name"]').val($("#deposit_bank_name").val());

    if($('#select_all:checked').val()==='select_all'){
        $form.find('input[name="userId"]').val("all");
        $form.find('input[name="filters"]').val($("#leadsListFilters").val());
        $form.find('input[name="totalRecords"]').val($("#all_records_val").val());
    }else{
        $form.find('input[name="userId"]').val(users);
        $form.find('input[name="filters"]').val($("#leadsListFilters").val());
        $form.find('input[name="totalRecords"]').val(users.length);
    }
    var data = $('#bulkUpdateStageForm').serializeArray();

    $.ajax({
       url: '/applications/validatePaymentAmount',
       type: 'post',
       dataType: 'json',
       data: data,
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       success: function (data) {
           $("#transactionButtonValidate").prop('disabled', false);
            if(data=='session'){
               window.location.reload(true);
            }
            if(data.status==1) {
               updateTransactionConfirm();
            }else{
                $('#error_span_transactionAmount').show().html(data.message);
            }

       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}


function updateTransactionConfirm(){
    $('#error_span_transaction_id').hide().html('');
    if($("#transactionid").val()=='' || $("#transactionid").val()==0 || $("#transactionid").val()==null){
        $('#error_span_transaction_id').show().html('Please enter transaction id');
        return;
    }


    if($("#transactionAmount").val()=='' || $("#transactionAmount").val()==0 || $("#transactionAmount").val()==null){
        $('#error_span_transactionAmount').show().html('Please enter transaction amount');
        return;
    }

    if($("#transaction_no_date").val()=='' || $("#transaction_no_date").val()==0 || $("#transaction_no_date").val()==null){
        $('#error_span_transaction_no_date').show().html('Please enter transaction date');
        return;
    }

    if($("#transaction_mode").val()=='' || $("#transaction_mode").val()==0 || $("#transaction_mode").val()==null){
        $('#error_span_transactionMode').show().html('Please enter transaction Mode');
        return;
    }

    $('#error_span_transactionMode').hide().html('');
    $('#error_span_transactionAmount').hide().html('');
    $('#error_span_transaction_no_date').hide().html('');
    $('#error_span_transaction_id').hide().html('');

    $("#confirmYes").removeAttr('onclick');
    $('#confirmTitle').html("Confirm");
    $("#confirmYes").html('Ok');
    $("#confirmNo").html('Cancel');
    $('#ConfirmMsgBody').html('Are you sure to update transaction details?');
    $('#ConfirmPopupArea').css('z-index', '11111');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
            e.preventDefault();
            $('#ConfirmPopupArea').modal('hide');
            updateTransactionDetails();
        });
    return false;
}

$(document).on("change","#transaction_mode",function(){
    //dependentDiv
    var sel = $(this).val();
    if(sel=='Through NEFT/RTGS' || sel=='Cash Deposit to the Bank') {
        $(".dependentDiv .form-control").val('');
        $(".dependentDiv").show();
    }else{
        $(".dependentDiv").hide();

    }
});

function updateTransactionDetails(){
    var users   = [];
    $('input:checkbox[name="selected_users[]"]').each(function () {
        if(this.checked){
            users.push(parseInt($(this).val()));
        }
    });

    if($("#transactionid").val()=='' || $("#transactionid").val()==0 || $("#transactionid").val()==null){
        $('#error_span_transaction_id').show().html('Please select page number');
        return;
    }


    if($("#transaction_no_date").val()=='' || $("#transaction_no_date").val()==0 || $("#transaction_no_date").val()==null){
        $('#error_span_transaction_no_date').show().html('Please enter transaction date');
        return;
    }

    if($("#transactionAmount").val()=='' || $("#transactionAmount").val()==0 || $("#transactionAmount").val()==null){
        $('#error_span_transactionAmount').show().html('Please enter transaction amount');
        return;
    }

    if($("#transaction_mode").val()=='' || $("#transaction_mode").val()==0 || $("#transaction_mode").val()==null){
        $('#error_span_transactionMode').show().html('Please enter transaction Mode');
        return;
    }

    if(users.length > 0 || $('#select_all:checked').val()==='select_all'){
        var $form = $("#bulkUpdateStageForm");
        $form.find('input[name="collegeId"]').val($("#college_id").val());
        $form.find('input[name="formId"]').val($("#form_id").val());
        $form.find('input[name="transaction_id"]').val($("#transactionid").val());
        $form.find('input[name="transaction_amount"]').val($("#transactionAmount").val());
        $form.find('input[name="transaction_no_date"]').val($("#transaction_no_date").val());
        $form.find('input[name="transaction_mode"]').val($("#transaction_mode").val());
        $form.find('input[name="account_number"]').val($("#account_number").val());
        $form.find('input[name="bank_name"]').val($("#bank_name").val());
        $form.find('input[name="deposit_bank_account_number"]').val($("#deposit_bank_account_number").val());
        $form.find('input[name="deposit_bank_name"]').val($("#deposit_bank_name").val());

        if($('#select_all:checked').val()==='select_all'){
            $form.find('input[name="userId"]').val("all");
            $form.find('input[name="filters"]').val($("#leadsListFilters").val());
            $form.find('input[name="totalRecords"]').val($("#all_records_val").val());
        }else{
            $form.find('input[name="userId"]').val(users);
            $form.find('input[name="filters"]').val($("#leadsListFilters").val());
            $form.find('input[name="totalRecords"]').val(users.length);
        }

        var oldaction = $("#bulkUpdateStageForm").attr('action');
        $('#myModal').modal('show');
        $form.attr("action",jsVars.transactionDetailUpdate);
        $form.attr("target",'modalIframe');
        $form.submit();
        $form.removeAttr("target");
        $form.attr("action",oldaction);

        $('#myModal').on('hidden.bs.modal', function(){
            $("#modalIframe").html("");
            $("#modalIframe").attr("src", "");
        });
        $('#TransactionIDModal').modal('hide');
        return;

    }else{
        alertPopup('Please select User','error');
    }
    return false;
}

function getReopenFormLogicToken() {
    var tokenList = [];
    var collegeId = $("#college_id").val();
    var formId = $("#form_id").val();
    var ctype = $('input#ctype').val();
    if (ctype != 'applications') {
        alertPopup('Some error occur.', 'error');
        return;
    }
    $.ajax({
        url: '/communications/get-reopen-form-logic-token',
        data: {'formId':formId, collegeId:collegeId, 'ctype':ctype},
        dataType: "json",
        type: "POST",
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if(json['status'] ===0 && json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if(json['status'] ===1 && typeof json['data']['tokenList'] !== 'undefined') {
                tokenList = json['data']['tokenList'];
            }
            initMultipleCKEditor('confirm_msz',tokenList);
        },
        error: function () {
           initMultipleCKEditor('confirm_msz');
        }
    });
}

function proceedToReassign(){
    $.ajax({
        url: jsVars.reassignLeadLink,
        type: 'post',
        data: {'userId' : currentUserId, 'collegeId':currentCollegeId, 'formId':currentFormId, 'assignedTo':$("#assignedTo").val(), 'unassignedFrom':$("#unassignedFrom").val(), 'reassignRemark':$("#reassignRemark").val(), moduleName:'application','applicationReassignCheck':applicationReassignCheck,'queryReassignCheck':queryReassignCheck,'leadReassignCheck':leadReassignCheck},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('div.loader-block-a').show();
        },
        complete: function () {
            $('#leadReassignModal').modal('hide');
            $('div.loader-block-a').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                LoadMoreApplication('reset');
            }else{
                alertPopup(responseObject.message,'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function proceedToBulkReassign(){
    var users   = [];
    $('input:checkbox[name="selected_users[]"]').each(function () {
        if(this.checked){
            users.push(parseInt($(this).val()));
        }
    });
    if($('#select_all:checked').val()=='select_all'){
        var data    = {'userId' : 'all', 'collegeId':$("#college_id").val(), 'formId':$("#form_id").val(), 'assignedTo':$("#assignedTo").val(), 'unassignedFrom':$("#unassignedFrom").val(), 'reassignRemark':$("#reassignRemark").val(), moduleName:'application', 'filters':$("#leadsListFilters").val(),'applicationReassignCheck':applicationReassignCheck,'queryReassignCheck':queryReassignCheck,'leadReassignCheck':leadReassignCheck};
    }else{
        var data    = {'userId' : users, 'collegeId':$("#college_id").val(), 'formId':$("#form_id").val(), 'assignedTo':$("#assignedTo").val(), 'unassignedFrom':$("#unassignedFrom").val(), 'reassignRemark':$("#reassignRemark").val(), moduleName:'application','applicationReassignCheck':applicationReassignCheck,'queryReassignCheck':queryReassignCheck,'leadReassignCheck':leadReassignCheck};
    }
    if(users.length > 0 || $('#select_all:checked').val()=='select_all'){
        $.ajax({
            url: jsVars.bulkReassignLeadLink,
            type: 'post',
            data: data,
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars.csrfToken
            },
            beforeSend: function () {
                $('div.loader-block-a').show();
            },
            complete: function () {
                $('#leadReassignModal').modal('hide');
                $('div.loader-block-a').hide();
            },
            success: function (response) {
                var responseObject = $.parseJSON(response);
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }
                if(responseObject.status==1){
                    LoadMoreApplication('reset');
                }else{
                    alertPopup(responseObject.message,'error');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

    }else{
        alertPopup('Please select User','error');
    }

    return false;
}

function leadDocumentDetails(userId,collegeId,formId)
{
    if(userId)
    {
        $.ajax({
            url: jsVars.FULL_URL+'/leads/manageDocuments',
            type: 'post',
            data: {userId:userId,collegeId:collegeId,formId:formId},
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function() {
                    $('div.loader-block-a').show();
            },
            complete: function() {
                    $('div.loader-block-a').hide();
            },
            success: function (data)
            {

             //$('#result').html(json);
                $("#fileloadResults").html(data);
        $("#document-details .modal-dialog").removeClass('modal-sm').addClass('modal-md');
                $("#document-details").modal();
                    $('#document-details [data-toggle="tooltip"]').tooltip({
                            placement: 'top',
                            trigger : 'hover',
                            template: '<div class="tooltip layerTop" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
                    });

            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block-a').hide();
            }
        });

        return;

        //return;
    }
}


function previewFile(fileName,type,previewUrl){
    var html  = ''
    $('.upladcontent').closest('#enlargecontent').removeClass('small_modal')
    if(type == 'doc'){
        $('.upladcontent').closest('#enlargecontent').addClass('small_modal')
        html  = '<div class="uplodeddocfile"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>Download to view the file ('+fileName+'). Click below link to download the file. <br><a href="'+previewUrl+'">Download Here</a></div>'

    }else if(type == 'pdf'){
        html  = '<iframe src="'+previewUrl+'"></iframe>'
    }else if(type == 'image'){
        html  = '<div class="uploadimg_container"><img src="'+previewUrl+'" alt=""></div>'
    }else if(type == 'video'){
        html  = '<video controls><source src="'+previewUrl+'" type="video/mp4">Your browser does not support the video tag.</video>'
    }
    $('.file_name').html(fileName)
    $('.upladcontent').html(html)
}


//search collaspable
$('.expended-search-link').click(function () {
    $('.expended-search-wrpper').addClass('active');
});
$('[data-dismiss="search"]').click(function () {
    $('.expended-search-wrpper').removeClass('active');
});

$(document).ready(function(){
    $('[data-dismiss="search"]').click(function(){
        $('input#search_common').val('');
        $('input#search_common').attr('placeholder', 'Search By');
        $('#search-field-error').hide();
        if($.trim($('#search_by_field').val()).length>0){
            $('#search_by_field').val('');
            $('#search_by_field').trigger('chosen:updated');
            $('#seacrhList').trigger('click');
        }
    });
});

$('.chosen-select').on('chosen:showing_dropdown', function (evt, params) {
    $(this).closest('.rowSpaceReduce').css('overflow','visible');
});
$('.chosen-select').on('chosen:hiding_dropdown	', function (evt, params) {
    $(this).closest('.rowSpaceReduce').css('overflow','hidden');
});

function pullMeritList(){

    if (validatePullApiData() == false) {
        return;
    }
//    if($("#form_id").val()=='' || $("#form_id").val()==0 || $("#form_id").val()==null){
//        alertPopup('Please select form','error');
//        return;
//    }
    var $form = $('#pullMeritListData');
    var data = $form .serializeArray();

    data.push({name:'form_id',value:$("#form_id").val()});
    data.push({name:'college_id',value:$("#college_id").val()});
    postUrl = '/applications/pull-merit-list-data';

    $.ajax({
        url: jsVars.FULL_URL+'/applications/pull-merit-list-data',
        type: 'post',
        data: data,
        /*dataType: 'json',*/
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {

        },
        complete: function () {
           $('.offCanvasModal').modal('hide');
        },
        success: function (result) {
            var response = JSON.parse(result);
            if (result === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (response.status == 0){
                alertPopup(response.message,'error');
            }else if (response.status == 1){
//                $('.offCanvasModal').modal('hide');
//                $('#showManageRegistrationPopup').trigger('click');
//                $('#SuccessPopupArea').modal('show');
//                $('#MsgBody').html(response.message);
                if(response.downloadUrl){
                    var html  = "<a target='_blank' href = '"+response.downloadUrl+"'>Clicking here </a>"
                    alertPopup('We are processing your applications update request.You may check the status of your request by  '+ html +' ','success');
                }
            }


        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function validatePullApiData(){
    $('.error').hide();
    var error = false;

//    if ($("#type").val() == "") {
//        $('#type_error').html("Field is required.");
//        $('#type_error').show();
//        error = true;
//    }

    if ($("#program_group").val() == "") {
        $('#program_group_error').html("Field is required.");
        $('#program_group_error').show();
        error = true;
    }
//    if ($("#exceptional_program").val() == "") {
//        $('#exceptional_program_error').html("Field is required.");
//        $('#exceptional_program_error').show();
//        error = true;
//    }
    if ($("#academic_year").val() == "") {
        $('#academic_year_error').html("Field is required.");
        $('#academic_year_error').show();
        error = true;
    }

    if ($("#category").val() == "") {
        $('#category_error').html("Field is required.");
        $('#category_error').show();
        error = true;
    }
//    if ($("#sub_category").val() == "") {
//        $('#sub_category_error').html("Field is required.");
//        $('#sub_category_error').show();
//        error = true;
//    }
//    if ($("#campus").val() == "") {
//        $('#campus_error').html("Field is required.");
//        $('#campus_error').show();
//        error = true;
//    }
//    if ($("#specialization").val() == "") {
//        $('#specialization_error').html("Field is required.");
//        $('#specialization_error').show();
//        error = true;
//    }
    if ($("#phase").val() == "") {
        $('#phase_error').html("Field is required.");
        $('#phase_error').show();
        error = true;
    }

    if ($("#session").val() == "") {
        $('#session_error').html("Field is required.");
        $('#session_error').show();
        error = true;
    }




    if (error == false) {
        return true;
    } else {
        $('html, body').animate({
            scrollTop: $("#error_anchor").offset().top
        }, 1000);
        return false;
    }
}

$('#li_pullMeritList').click(function(){
    $('#pull_merit_list').show()
    resetPullMeritFilterValue()
})
function resetPullMeritFilterValue(){
    $('#pullMeritListData input[type="text"],#pullMeritListData select').val('')
    $('#pullMeritListData select').trigger('chosen:updated');
    $('#pullMeritListData .error').hide();
    program_codes = $('#nmims_program_groups').val()

    if(program_codes != ''){
        program_groups = $.parseJSON(program_codes);
        html = "<option value=''>Select Program Group</option>"
        for (var key in program_groups) {
            html += "<option value='" + key + "'>" + program_groups[key] + "</option>";
        }
        $('#program_group').html(html);
        $('#program_group').trigger('chosen:updated');
    }
}

function saveFieldAttribute(obj,fieldName){
    var data = $('#download_doc_attr_form_'+fieldName).serializeArray();
    data.push({name:'fieldName',value:fieldName});
    data.push({name:'formId',value:$("#form_id").val()});
    data.push({name:'collegeId',value:$("#college_id").val()});
    data.push({name:'doc_folder_structure',value:$("#doc_folder_structure").val()});
    $.ajax({
        url: jsVars.FULL_URL+'/applications/save-field-attribute-bulk-download',
        type: 'post',
        data: data,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (result) {
            var response = JSON.parse(result);
            if (result === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (response.status == 0){
                alertPopup(response.message,'error');
                return false;
            }else if (response.status == 1){
                $(".error_field_"+response.field).addClass("hidden");
                alertPopup(response.message,'success');
                return false;
            }
//            $("#bulk-document-details").modal('show');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function saveDynamicDocData(obj,fieldName){
    var data = $('#download_doc_attr_form_'+fieldName).serializeArray();
    data.push({name:'fieldName',value:fieldName});
    data.push({name:'formId',value:$("#form_id").val()});
    data.push({name:'collegeId',value:$("#college_id").val()});
    $.ajax({
        url: jsVars.FULL_URL+'/applications/save-dynamic-doc-data-bulk-download',
        type: 'post',
        data: data,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (result) {
            var response = JSON.parse(result);
            if (result === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (response.status == 0){
                alertPopup(response.message,'error');
                return false;
            }else if (response.status == 1){
                $(".error_field_"+response.field).addClass("hidden");
                alertPopup(response.message,'success');
                return false;
            }
//            $("#bulk-document-details").modal('show');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function tokenFeeDate(selectedToken){
    var tokenId = $(selectedToken).val();
    var collegeId = $("#college_id").val();
    var formId = $("#form_id").val();
    $.ajax({
        url: jsVars.FULL_URL+'/applications/token-fee-date',
        type: 'post',
        data: {'tokenId':tokenId,'collegeId':collegeId,'formId':formId},
        /*dataType: 'json',*/
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
          // $('.offCanvasModal').modal('hide');
        },
        success: function (result) {
            var response = $.parseJSON(result);
            if (result === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (response.status == 0){
                alertPopup(response.message,'error');
            }else if (response.status == 1){
                $('#logic_form_endTime').val(response.token_end_date);    
                $('#logic_form_startTime').val(response.token_start_date);    
  //              $('#logic_form_endTime').addClass('pointer-none'); 
                $('#logic_form_startTime').data('DateTimePicker').minDate(response.token_start_date);
                $('#logic_form_startTime').data('DateTimePicker').maxDate(response.token_end_date);
                
                $('#logic_form_endTime').data('DateTimePicker').minDate(response.token_start_date);
                $('#logic_form_endTime').data('DateTimePicker').maxDate(response.token_end_date);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });   
}

function reSubmitLogicDisableEnable(logicid,formid,message) {
    $('#ConfirmMsgBody').html('Are you sure want to '+ message+' the Resubmission ?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
            $.ajax({
                url: jsVars.FULL_URL + jsVars.enableDisableUrl,
                type: 'post',
                dataType: 'json',
                data: {logicid:logicid,formid:formid},
                headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                beforeSend: function () {
                    $('.loader-block').show();
                },
                complete: function () {
                    $('.loader-block').hide();
                },
                success: function (data) {
                    if (data['message'] == "session") {
                        window.location.reload(true);
                    } else if (data['status'] == 0) {
                        alertPopup(data['message'],'error');
                        return false;
                    } else if (data['status'] == 1) {
                        alertPopup(data['message'],'success');
                        LoadFormLogicsData('reset');
                        return false;
                    } else {
                        alertPopup(data['message'],'error');
                        return false;
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
            $('#ConfirmPopupArea').modal('hide');
        });
}
