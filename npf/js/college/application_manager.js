/* 
 * Application Manager javascript function .
 */

//hide DD Rejected option on application view

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
var currentCounsellorId     = jsVars.counsellorId;
var nextStepCondition           = 0;
var applicationReassignCheck = '';
var queryReassignCheck = '';

$(document).ready(function(){
    if($("#lead_followup_date").length > 0){
        $('#lead_followup_date').datetimepicker({format: 'DD/MM/YYYY HH:mm', minDate:new Date(),viewMode: 'days'});
    }
    if($("#form_stage_deadline").length > 0){
        $('#form_stage_deadline').datetimepicker({format: 'DD/MM/YYYY', minDate:new Date(),viewMode: 'years'});
    }
    
    //Load Saved Filter List
//    $("#FilterApplicationForms select#college_id").bind("change", function () {
//        getSavedFilterList(this.value,'application','filter','saved_filter_li_list');
//    });
    
    $('#otp_enter_code_id').click(function(){
        alert('ggg');
    });
});

function getLeadStagesForBulkUpdate(){
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

    currentCollegeId        = $("#college_id").val();
    currentFormId           = $("#form_id").val();

    $.ajax({
        url: jsVars.getFormFlowTypeLink,
        type: 'post',
        data: {'formId':currentFormId},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: false,
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
        if($('#fsd\\|step_status').length && $('#fsd\\|step_status').val()=='1' && $('#form_stage').length && $('#form_stage').val() !==''){
            formStage   = $('#form_stage').val();
        }else{
            if($('#fsd\\|step_status').length && $('#fsd\\|step_status').val()=='0'){
                alertPopup("'Form Stage Status' must be Completed.",'error');
            }else{
                alertPopup("Please select 'Form Stage' and 'Form Stage Status'.",'error');
            }
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

    var leadStages  = '<select name="lead_stage" id="lead_stage" class="chosen-select" tabindex="-1"><option value="" selected="selected">Application Stage</option></select>';
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
        async: false,
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
                    if(typeof responseObject.data.stageList === "object" && typeof stageList === "object"){
                        var leadStages  = '<select name="lead_stage" id="lead_stage" class="chosen-select" tabindex="-1"><option value="">Application Stage</option>';
                        $.each(stageList, function (index, item) {
                            leadStages += '<option value="'+item+'">'+responseObject.data.stageList[item]+'</option>';
                        });
                        leadStages += '</select>';
                        $('#leadStagesDiv').html(leadStages);
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

    currentUserId           = userId;
    currentCollegeId        = collegeId;
    currentFormId           = formId;
    currentUserName         = userName;

    $.ajax({
        url: jsVars.getFormFlowTypeLink,
        type: 'post',
        data: {'formId':currentFormId},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: false,
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
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
}

function ajaxGetLeadStages(formFlowType){
    $("#div_form_stage_deadline").hide();
    $("#form_stage_deadline").val('');

    $("#followUpMessageDiv").html("");
    $("#lead_stage").val("");
    $("#lead_remark").val("");
    $("#lead_followup_date").val("");
    $(".hidden_for_bulk").show();
    var leadStages  = '<select name="lead_stage" id="lead_stage" class="chosen-select" tabindex="-1"><option value="" selected="selected">Application Stage</option></select>';
    $('#leadStagesDiv').html(leadStages);
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
        async: false,
        beforeSend: function () { 
            currentStage            = '';
            stageList               = [];
        },
        complete: function () {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $("#lead_stage").change(function(){
                console.log($("#form_stage_deadline").is(":visible"));
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
                    stageList               = responseObject.data.stageIds;
                    disallowDown            = responseObject.data.disallow_down;
                    disallowFollowup        = responseObject.data.disallow_followup;
                    disallowRemark          = responseObject.data.disallow_remark;
                    disallowCommunication   = responseObject.data.disallow_communication;
                    nextStepCondition       = responseObject.data.nextStepCondition;
                    if(typeof nextStepCondition === "undefined" || nextStepCondition===""){
                        nextStepCondition=0;
                    }
                    if(typeof responseObject.data.stageList === "object" && typeof stageList === "object"){

                        var leadStages  = '<select name="lead_stage" id="lead_stage" class="chosen-select" tabindex="-1"><option value="">Application Stage</option>';
                        $.each(stageList, function (index, item) {
                            if(currentStage==item){
                                leadStages += '<option value="'+item+'" selected="selected">'+responseObject.data.stageList[item]+'</option>';
                            }else{
                                leadStages += '<option value="'+item+'">'+responseObject.data.stageList[item]+'</option>';
                            }
                        });
                        leadStages += '</select>';
                        $('#leadStagesDiv').html(leadStages);
                        if(formFlowType == "3" && !$("#div_profile_stage").hasClass('hidden_by_permission') && typeof responseObject.data.nextStepDealine !== "undefined" && responseObject.data.nextStepDealine!=''){
                            if(currentStage==nextStepCondition){
                                $("#div_form_stage_deadline").show();
                            }
                            $("#form_stage_deadline").val(responseObject.data.nextStepDealine);
                        }
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
                $('#new_follow_up_toggle').prop('checked', false);
                var check = $('#upcomingFollowups').val();
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
    addNewFollowUptoggle = 0
    if($("#new_follow_up_toggle").is(':checked'))
    {addNewFollowUptoggle = 1}
    $.ajax({
        url: jsVars.followUpLink,
        type: 'post',
        data: {'userId' : currentUserId, 'collegeId':currentCollegeId, 'formId':currentFormId, 'leadStage':$("#lead_stage").val(), 'leadRemark':$("#lead_remark").val(), 'leadFollowupDate':$("#lead_followup_date").val(), 'formStepDeadline':$("#form_stage_deadline").val(), moduleName:'application','addNewFollowUptoggle':addNewFollowUptoggle},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('div.loader-block-a').show();
        },
        complete: function () {
            $('#followupModal').modal('hide');
            $('div.loader-block-a').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response); 
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
    var users   = [];
    $('input:checkbox[name="selected_users[]"]').each(function () {
        if(this.checked){
            users.push(parseInt($(this).val()));
        }
    });
    
    if(users.length > 0 || $('#select_all:checked').val()==='select_all'){
        $('#followupModal').modal('hide');
        $('#myModal').modal('show');
        var $form = $("#bulkUpdateStageForm");
        $form.find('input[name="collegeId"]').val($("#college_id").val());
        $form.find('input[name="formId"]').val($("#form_id").val());
        $form.find('input[name="leadStage"]').val($("#lead_stage").val());
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
        $form.attr("action",jsVars.updateLeadStageBulkLink);
        $form.attr("target",'modalIframe');
        $form.submit();
        $form.removeAttr("target");

        $('#myModal').on('hidden.bs.modal', function(){
            $("#modalIframe").html("");
            $("#modalIframe").attr("src", "");
        });
        return;    
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
    var assignedTo  = '<select name="assignedTo" id="assignedTo" class="sumo-select" tabindex="-1" ><option value="">Counsellor - Assigned To</option></select>';
    $('#assignedToListDiv').html(assignedTo);
    
    var unassignFrom  = '<select name="unassignedFrom[]" multiple="multiple" id="unassignedFrom" class="sumo-select" tabindex="-1" data-placeholder="Unassign From"></select>';
    $('#unassignFromDiv').html(unassignFrom);
    $("#unassignFromRow label span[class='requiredStar']").html('*');
    if(currentCounsellorId=="" || currentCounsellorId=='unassigned'){
        $("#unassignFromRow label span[class='requiredStar']").html('');
    }
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    $('.sumo-select').SumoSelect({placeholder: 'Select Counsellors', search: true, searchText:'Select Counsellors'});
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
        async: false,
        beforeSend: function () { 
            currentUserId           = '';
            currentCollegeId        = '';
            currentFormId           = '';
        },
        complete: function () {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.sumo-select').SumoSelect({placeholder: 'Select Counsellors', search: true, searchText:'Select Counsellors'});
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
                        var counsellors  = '<select name="assignedTo" id="assignedTo" class="sumo-select" tabindex="-1" ><option value="">Counsellor - Assigned To</option>';
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
                        var unassignFrom  = '<select name="unassignedFrom[]" multiple="multiple" id="unassignedFrom" class="sumo-select" tabindex="-1" data-placeholder="Unassign From">';
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
    $('#leadReassignModal').modal('hide');
    hideLoader();
    $('#ConfirmPopupReassignCounsellor #ConfirmMsgBody').removeClass('text-center').addClass('text-left');
    $('#ConfirmPopupReassignCounsellor').addClass('modalCustom');
    $('#ConfirmPopupReassignCounsellor #ConfirmMsgBody').addClass('modalScroll');
    $('#ConfirmPopupReassignCounsellor a#confirmYes').html('Okay');
    $('#ConfirmPopupReassignCounsellor .modal-body button').html('Cancel');
    $('#ConfirmPopupReassignCounsellor').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        applicationReassignCheck = $('#ConfirmPopupReassignCounsellor input[name="applicationReassignCheck"]:checked').val();
        queryReassignCheck = $('#ConfirmPopupReassignCounsellor input[name="queryReassignCheck"]:checked').val();
        proceedToReassign();
        $('#ConfirmPopupReassignCounsellor').modal('hide');
    });
    
}


function bulkReassignLeads(){
    var users   = [];
    $('input:checkbox[name="selected_users[]"]').each(function () {
        if(this.checked){
            users.push(parseInt($(this).val()));
        }
    });
    if($('#select_all:checked').val()=='select_all'){
        var data    = {'userId' : 'all', 'collegeId':$("#college_id").val(), 'formId':$("#form_id").val(), 'assignedTo':$("#assignedTo").val(), 'unassignedFrom':$("#unassignedFrom").val(), 'reassignRemark':$("#reassignRemark").val(), moduleName:'application', 'filters':$("#leadsListFilters").val()};
    }else{
        var data    = {'userId' : users, 'collegeId':$("#college_id").val(), 'formId':$("#form_id").val(), 'assignedTo':$("#assignedTo").val(), 'unassignedFrom':$("#unassignedFrom").val(), 'reassignRemark':$("#reassignRemark").val(), moduleName:'application'};
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
                    alertPopup(responseObject.message,'alert');
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
                $("#document-details").modal();
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
        async: false,
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
                        var leadStages  = '<select name="lead_stage" id="lead_stage" class="chosen-select" tabindex="-1"><option value="">Application Stage</option>';
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
            $('#listloader').show();
        },
        complete: function() {
            $('#listloader').hide();
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
                $('#listloader').show();
            },
            complete: function() {
                $('#listloader').hide();
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
                        $('#listloader').show();
                        $("#reallocate_btn").attr("disabled",'disabled');
                    },
                    complete: function() {
                        $('#listloader').hide();
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

function proceedToReassign(){
    $.ajax({
        url: jsVars.reassignLeadLink,
        type: 'post',
        data: {'userId' : currentUserId, 'collegeId':currentCollegeId, 'formId':currentFormId, 'assignedTo':$("#assignedTo").val(), 'unassignedFrom':$("#unassignedFrom").val(), 'reassignRemark':$("#reassignRemark").val(), moduleName:'application','applicationReassignCheck':applicationReassignCheck,'queryReassignCheck':queryReassignCheck},
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
