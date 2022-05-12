/*
 * function use for onload  and drop down on change on call function
 *  NPF-1211 10.3 || LMS & Application Manager revamp
 */
var ajaxStatus_LoadMoreLeadsUser = 'ready';
var leadManager;

var currentCounsellorId = 0;
var engagementRemarks = 0;
var createdBy = 0;
var leadFollowupDate = 0;
var applicantEngagementId = 0;
var collegeId = 0;

$(document).ready(function () {

    $('#lead_followup_date').on("blur", function() {
       if($('#lead_followup_date').val() != "") {
           $("#div_followup_check").show();
       } else {
           $("#div_followup_check").hide();
       }
    });   
    
    $("#editFollowUpButton").on('click',editFollowUpAction);
    if($("#lead_followup_date").length > 0){
        var lfdPlaceholder = $('#lead_followup_date').attr('placeholder');
        $('#lead_followup_date').datetimepicker({
                format: 'DD/MM/YYYY HH:mm', 
                minDate:new Date(),
                viewMode: 'days'
        }).on('dp.hide', function(){
                if(this.value!=''){
                        $(this).parent().addClass('floatify__active');
                        $(this).attr('placeholder', '');
                }else{
                        $(this).parent().removeClass('floatify__active');
                        $(this).attr('placeholder', lfdPlaceholder);
                }
        });
    }
});

//edit folloup popup
function editFollowup(userId, collegeId, userName) {
    return;
    $("#followUpMessageDiv").html("");
    $("#lead_stage").val("");
    $('#counsellorListDiv').html("");
    $("#lead_remark").val("");
    $("#lead_followup_date").val("");
    $("#div_followup_check").hide();
    $('#remark_error, #sub_stage_error, #followup_error, #stage_error').hide();
    $('#leadFollowupCheck').prop('checked', false);
    $(".hidden_for_bulk").show();
    $("#actionType").val('stage');
    var leadStages = '<label class="floatify__label float_addedd_js" for="lead_stage">Lead Stage</label><select name="lead_stage" id="lead_stage" class="chosen-select" tabindex="-1"><option value="" selected="selected">Lead Stage</option></select>';
    $('#leadStagesDiv').html(leadStages);
    if (($("#followupModal select#lead_sub_stage").length > 0)) {
        $("#followupModal select#lead_sub_stage").val("");
        $("#followupModal #div_profile_sub_stage").hide();
        if (isLeadSubStageConfigure) {
            $("#followupModal #div_profile_sub_stage").show();
        }
        var leadSubStages  = '<label class="floatify__label float_addedd_js" for="lead_sub_stage">Lead Sub Stage</label><select name="lead_sub_stage" id="lead_sub_stage" class="chosen-select" tabindex="-1"><option value="">Lead Sub Stage</option></select>';
        $('#followupModal #leadSubStagesDiv').html(leadSubStages);
		floatableLabel();
    }
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    currentUserId           = userId;
    currentCollegeId        = collegeId;
    currentUserName         = userName;
    $('#editFollowUpButton').unbind( "click" );
    $("#editFollowUpButton").on('click',editFollowUpAction);

    $.ajax({
        url: jsVars.getLeadStagesLink,
        type: 'post',
        data: {'userId' : userId, 'collegeId':collegeId, moduleName:'lead'},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: false,
        beforeSend: function () { 
            showLoader();
            currentStage            = '';
            stageList               = [];
        },
        complete: function () {
            hideLoader();
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
                    currentSubStage         = responseObject.data.sub_stage;
                    stageList               = responseObject.data.stageIds;
                    disallowDown            = responseObject.data.disallow_down;
                    disallowFollowup        = responseObject.data.disallow_followup;
                    disallowRemark          = responseObject.data.disallow_remark;
                    disallowCommunication   = responseObject.data.disallow_communication;
                    var subStageConfigure   = responseObject.data.subStageConfigure;
                    var leadSubStageList    = responseObject.data.subStageList;

                    if(typeof responseObject.data.stageList === "object" && typeof stageList === "object"){
                        var onChangeLeadStage = '';
                        if (subStageConfigure == 1) {
                            onChangeLeadStage = 'onchange = "getLeadSubStages(\''+ collegeId +'\', this.value, \'lead_sub_stage\', \'chosen\', \'leadSubStagesDiv\');"';
                        }
                        var leadStages  = '<label class="floatify__label float_addedd_js" for="lead_stage">Lead Stage</label><select name="lead_stage" id="lead_stage" class="chosen-select" tabindex="-1" ' + onChangeLeadStage +'>';
                        $.each(stageList, function (index, item) {
                            if(currentStage==item){
                                leadStages += '<option value="'+item+'" selected="selected">'+responseObject.data.stageList[item]+'</option>';
                            }else{
                                if(jsVars.sourceEdit !== true) {
                                    leadStages += '<option value="'+item+'">'+responseObject.data.stageList[item]+'</option>';
                                }
                            }
                        });
                        leadStages += '</select>';
                        $('#leadStagesDiv').html(leadStages);
                    }
                    
                    //add sub stage list data
                    if (typeof leadSubStageList === "object" && subStageConfigure) {
                        var leadSubStages  = '<select name="lead_sub_stage" id="lead_sub_stage" class="chosen-select" tabindex="-1"><option value="">Lead Sub Stage</option>';
                        for(var subStageId in leadSubStageList) {
                            if (currentSubStage == subStageId) {
                                leadSubStages += '<option value="' + subStageId + '" selected="selected">' + leadSubStageList[subStageId] + '</option>';
                            } else {
                                if(jsVars.sourceEdit !== true) {
                                    leadSubStages += '<option value="' + subStageId + '">' + leadSubStageList[subStageId] + '</option>';
                                }
                            }
                        }
                        leadSubStages += '</select>';
                        $('#leadSubStagesDiv').html(leadSubStages);
						floatableLabel()
                    }
                    
                    if(engagementRemarks) {
                        $("#lead_remark").val(engagementRemarks);
                    }
                    
                    if(leadFollowupDate) {
                        $("#lead_followup_date").val(leadFollowupDate);
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

//update followup
function editFollowUpAction(){
    $("#followUpMessageDiv").html("");
    $('#followup_error').hide().html("");
    if($("#lead_followup_date").val() == $followupDateTime) {
        $('#followup_error').show().html("You have not changed followup datetime to save.");
        return false;
    }
    $.ajax({
        url: jsVars.FULL_URL+'/counsellors/editFollowup',
        type: 'post',
        data: {'note':$("#lead_remark").val(), 'followupDate':$("#lead_followup_date").val(), 'applicantEngagementId': applicantEngagementId,'collegeId':collegeId},
        dataType: 'html',
        async: false,
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            showLoader();
        },
        complete: function () {
            
            hideLoader();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response); 
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                $("#followUpMessageDiv").html("<div class='alert-success'>Details saved.</div>");
                $('#followupModal').modal('hide');
                $("#FollowUpData li.active a").trigger("click");
            }else{
                $('#remark_error, #followup_error').hide();
                if(responseObject.message != "") {
                    validationErrObj = $.parseJSON(responseObject.message);
                    if(typeof validationErrObj == 'object') {
                        if(validationErrObj.remark_error != undefined) {
                            $('#remark_error').show();
                            $('#remark_error').html(validationErrObj.remark_error);
                        }                         
                    }
                }                
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function setFollowupEditVariables(cId,remarks,followupDateTime, appEngId){
    collegeId = cId;
    applicantEngagementId = appEngId;
    $followupDateTime = followupDateTime;
    $("#lead_followup_date").val(followupDateTime)
    $("#lead_remark").val(remarks);
}

//Using on LM/User Profile
function getLeadSubStages(collegeId) { 
    $("#leadSubStagesNameDiv").hide();
    var val = $("#followup_lead_stages_filter").val();
    if ( typeof collegeId == 'undefined' || typeof val == 'undefined' || typeof jsVars.getLeadSubStagesLink == 'undefined' || val=="") {
        return;
    }

    $.ajax({
        url: jsVars.getLeadSubStagesLink,
        type: 'post',
        data: {'collegeId': collegeId, 'stageId': val},
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
//                alert(json['error']);
            } else  if (json['success'] === 200) {
                    var leadSubStageHtml = '<label class="floatify__label float_addedd_js">Lead Sub Stage</label><select name="followup_lead_substages_filter" id="followup_lead_substages_filter" class="chosen-select" tabindex="-1"><option value="" selected="selected">Lead Sub Stage</option>';
                    for(var subStageId in json['subStageList']) {
                       if (json['subStageList'].hasOwnProperty(subStageId)) {
                           leadSubStageHtml += '<option value="'+ subStageId +'">'+ json['subStageList'][subStageId] +'</option>';
                       }
                    }
                    
                    leadSubStageHtml += '</select>';

                    if(typeof subStageId=="string"){
                        $("#leadSubStagesNameDiv").show();
                        $("#subStageLabel").show();
                    }
                    $('#leadSubStagesNameDiv').html(leadSubStageHtml);
                    $('#div_profile_sub_stage').show();
                    $('#leadSubStagesNameDiv select#followup_lead_substages_filter').chosen();
                    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

//get specialization after selecteion of course in filter
function getSpecializationList (courseId, ref_id) 
{
    if(courseId == "" || courseId == 0) {
        return;
    }
    var college_id_md = 0;
    if( $("[name='h_college_id']").length > 0 && typeof $("[name='h_college_id']").val() != "undefined" ){
        college_id_md = $("[name='h_college_id']").val();
    }
    
    $.ajax({
        url: '/common/getChildListByTaxonomyId',
        type: 'post',
        data: {"parentId" : courseId, "college_id":college_id_md},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $("#"+ref_id).empty();
        },
        complete: function () {
//            $('#'+ref_id).chosen();
//            $('#'+ref_id).trigger('chosen:updated');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) 
            {
                if (typeof responseObject.data === "object") 
                {
                    var selectBox = '<label class="floatify__label float_addedd_js">Course Specialization</label><select name="followup_specialization_id_filter" id="followup_specialization_id_filter" class="chosen-select" tabindex="6"><option value="" selected="selected">Specialization</option>';
                    $.each(responseObject.data.childList, function (formStage, formStageLabel) {
                       selectBox += "<option value='" + formStage + "'>" + formStageLabel + "</option>";
                    });
                    selectBox += '</select>';
                    $('#' + ref_id).html(selectBox);
                    $('#followup_specialization_id_filter').trigger('chosen:updated');
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(responseObject.message);
                }
            }
            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });   
}
