var ajaxStatus_LoadMoreLeadsUser = 'ready';
var leadManager;
var currentUserId           = '';
var currentCollegeId        = '';
var currentStage            = '';
var currentUserName         = '';
var disallowDown            = false;
var disallowFollowup        = false;
var disallowRemark          = false;
var disallowCommunication   = false;
var stageList               = [];
var currentCounsellorId     = jsVars.counsellorId;
var isLeadSubStageConfigure;
var dependentDropdownFieldList;
var counsellorsAvailableForFollowup = false;
var applicationReassignCheck = '';
var queryReassignCheck = '';

/**
 * @function called by when clicked on 'change lead stage' from bulk ations
 */
function getLeadStagesForBulkUpdate(){
    $('#saveFollowUpButton').attr('disabled',false);
    if($("#user_college_id").val()=='' || $("#user_college_id").val()==0 || $("#user_college_id").val()==null){
        alertPopup('Please select college','error');
        return;
    }
    if($('input:checkbox[name="selected_users[]"]:checked').length < 1 && $('#select_all:checked').val()!=='select_all'){
        alertPopup('Please select User','error');
        return;
    }
    currentCollegeId        = $("#user_college_id").val();
    $("#counsellorListDiv").html("");
    $("#followUpMessageDiv").html("");
    $("#counsellorListDiv").html("");
    $('#stage_error').html("");
    $("#followupModal").modal('show');
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
    if ($("#followupModal select#lead_sub_stage").length > 0) {
        $("#followupModal select#lead_sub_stage").val("");
        $("#followupModal #div_profile_sub_stage").hide();
        if (isLeadSubStageConfigure) {
            $("#followupModal #div_profile_sub_stage").show();
        }
        var leadSubStages  = '<label class="floatify__label float_addedd_js" for="lead_sub_stage">Lead Sub Stage</label><select name="lead_sub_stage" id="lead_sub_stage" class="chosen-select" tabindex="-1"><option value="">Lead Sub Stage</option></select>';
        $('#followupModal #leadSubStagesDiv').html(leadSubStages);
		floatableLabel();
    }
    
    var leadStages  = '<label class="floatify__label float_addedd_js" for="lead_stage">Lead Stage</label><select name="lead_stage" id="lead_stage" class="chosen-select" tabindex="-1"><option value="" selected="selected">Application Stage</option></select>';
    $('#leadStagesDiv').html(leadStages);
    $('.chosen-select').chosen();
    $('#saveFollowUpButton').unbind( "click" );
    $("#saveFollowUpButton").on('click',updateLeadStageBulk);
    
    $.ajax({
        url: jsVars.getLeadStagesLink,
        type: 'post',
        data: {'userId' : 'bulk', 'collegeId':currentCollegeId, moduleName:'lead'},
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
                    stageList               = responseObject.data.stageIds;
                    var subStageConfigure   = responseObject.data.subStageConfigure;
                    var leadSubStageList    = responseObject.data.subStageList;
                    if(typeof responseObject.data.overdueFollowUpCount!=='undefined' && responseObject.data.overdueFollowUpCount>0 && userId!='bulk'){
                        $('#div_followup_check').show();
                    }else{
                        $('#div_followup_check').hide();
                    }
                    if(typeof responseObject.data.stageList === "object" && typeof stageList === "object"){
                        var onChangeLeadStage = '';
                        if (subStageConfigure == 1) {
                            onChangeLeadStage = 'onchange = "getLeadSubStages(\''+ currentCollegeId +'\', this.value, \'lead_sub_stage\', \'chosen\', \'leadSubStagesDiv\');"';
                        }
                        var leadStages  = '<label class="floatify__label float_addedd_js" for="lead_stage">Lead Stage</label><select name="lead_stage" id="lead_stage" class="chosen-select" tabindex="-1" ' + onChangeLeadStage +'><option value="">Lead Stage</option>';
                        $.each(stageList, function (index, item) {
                            leadStages += '<option value="'+item+'">'+responseObject.data.stageList[item]+'</option>';
                        });
                        leadStages += '</select>';
                        $('#leadStagesDiv').html(leadStages);
						floatableLabel();
                    }
                    
                    //add sub stage list data
                    if (subStageConfigure == 1) {
                        var leadSubStages  = '<label class="floatify__label float_addedd_js" for="lead_sub_stage">Lead Sub Stage</label><select name="lead_sub_stage" id="lead_sub_stage" class="chosen-select" tabindex="-1"><option value="">Lead Sub Stage</option>';
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
function getBlockAccountForBulkUpdate(){
    //$('#saveFollowUpButton').attr('disabled',false);
    $("#ConfirmPopupArea").css('z-index', 12001);
    var popupmsg="<p>All actions for the users will be blocked and user will not be able to view or perform any action.</p><p> Are you sure you want to block?<p>";
    $('#ConfirmMsgBody').html(popupmsg);
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
    .off('click', '#confirmYes').one('click', '#confirmYes', function (e) { 
     if($("#user_college_id").val()=='' || $("#user_college_id").val()==0 || $("#user_college_id").val()==null){
         $('#ConfirmPopupArea').modal('hide');
        alertPopup('Please select college','error');
        return;
    }
      if($('input:checkbox[name="selected_users[]"]:checked').length < 1 && $('#select_all:checked').val()!=='select_all'){
          $('#ConfirmPopupArea').modal('hide');
        alertPopup('Please select User','error');
        return;
    }
     if($('input:checkbox[name="selected_users[]"]:checked').length >100){
         $('#ConfirmPopupArea').modal('hide');
        alertPopup('A maximum of 100 users can be blocked','error');
        return;
    }

    var users   = [];
    $('input:checkbox[name="selected_users[]"]').each(function () {
        if(this.checked){
            users.push(parseInt($(this).val()));
    }
    currentCollegeId= $("#user_college_id").val();
    });
    var $form = $("#bulkUpdateStageForm");
    $form.find('input[name="collegeId"]').val($("#user_college_id").val());
        $form.find('input[name="leadStage"]').val($("#lead_stage").val());
    if($('#select_all:checked').val()==='select_all'){
        $form.find('input[name="userId"]').val("all");
        $form.find('input[name="filters"]').val($("#leadsListFilters").val());
        $form.find('input[name="totalRecords"]').val($("#all_records_val").val());
    }else{
        $form.find('input[name="userId"]').val(users);
        $form.find('input[name="filters"]').val($("#leadsListFilters").val());
        $form.find('input[name="totalRecords"]').val(users.length);
    }
     var data = [];
    $.ajax({
         url: '/leads/block-account',
        type: 'post',
        data: $form.serialize(),
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        success: function (json) {
            $('#ConfirmPopupArea').modal('hide');
           if (typeof json['error'] !=='undefined' && json['error'] === 'session_logout') {
                window.location.reload(true);
            }else if(typeof json['error'] !=='undefined' && json['error'] === 'token_error'){
                $('#ConfirmPopupArea').modal('hide');
                alertPopup("Token Mismatch",'error');
            }else if(typeof json['error'] !=='undefined' && json['error'] === 'invalid_request'){
                $('#ConfirmPopupArea').modal('hide');
                alertPopup("Invalid Request",'error');
            }
            else if(json['status']==1){
                $('#ConfirmPopupArea').modal('hide');
                //popup from ui team
                alertPopup("Account blocked successfully");
            }else{
                $('#ConfirmPopupArea').modal('hide');
                alertPopup(json['error'],'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    });
}
function getLeadStages(userId, collegeId, userName) {
    $('input[name=leadFollowupCheck]').attr('checked', false);
    $('#saveFollowUpButton').attr('disabled',false);
    $("#followUpMessageDiv").html("");
    $('#counsellorListDiv').html("");
    $("#lead_stage").val("");
    $("#lead_remark").val("");
    $("#lead_followup_date").val("");
    $(".hidden_for_bulk").show();
    setCounsellorsDropDownForFollowups(userId, collegeId);
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
    getActivityLogsForStagePopup('reset');
    $('#saveFollowUpButton').unbind( "click" );
    $("#saveFollowUpButton").on('click',followUp);
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
                    $("#followupModal #actionType").val('stage'); //set required parameter to validate stage & sub stage
                    currentStage            = responseObject.data.stage;
                    currentSubStage         = responseObject.data.sub_stage;
                    stageList               = responseObject.data.stageIds;
                    disallowDown            = responseObject.data.disallow_down;
                    disallowFollowup        = responseObject.data.disallow_followup;
                    disallowRemark          = responseObject.data.disallow_remark;
                    disallowCommunication   = responseObject.data.disallow_communication;
                    var subStageConfigure   = responseObject.data.subStageConfigure;
                    var leadSubStageList    = responseObject.data.subStageList;
                    if(typeof responseObject.data.overdueFollowUpCount!=='undefined' && responseObject.data.overdueFollowUpCount>0 && userId!='bulk'){
                        $('#div_followup_check').show();
                    }else{
                        $('#div_followup_check').hide();
                    }
                    if(typeof responseObject.data.stageList === "object" && typeof stageList === "object"){
                        var onChangeLeadStage = '';
                        if (subStageConfigure == 1) {
                            onChangeLeadStage = 'onchange = "getLeadSubStages(\''+ collegeId +'\', this.value, \'lead_sub_stage\', \'chosen\', \'leadSubStagesDiv\');"';
                        }
                        var leadStages  = '<label class="floatify__label float_addedd_js" for="lead_stage">Lead Stage</label><select name="lead_stage" id="lead_stage" class="chosen-select" tabindex="-1" ' + onChangeLeadStage +'><option value="">Lead Stage</option>';
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
                    
                    //add sub stage list data
                    if (subStageConfigure == 1) {
                        var leadSubStages  = '<select name="lead_sub_stage" id="lead_sub_stage" class="chosen-select" tabindex="-1"><option value="">Lead Sub Stage</option>';
                        if (typeof leadSubStageList === "object") {
                            for(var subStageId in leadSubStageList) {
                                if (currentSubStage == subStageId) {
                                    leadSubStages += '<option value="' + subStageId + '" selected="selected">' + leadSubStageList[subStageId] + '</option>';
                                } else {
                                    leadSubStages += '<option value="' + subStageId + '">' + leadSubStageList[subStageId] + '</option>';
                                }
                            }
                        }
                        leadSubStages += '</select>';
                        $('#leadSubStagesDiv').html(leadSubStages);
                        $("#followupModal #div_profile_sub_stage").show();
			floatableLabel()
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

function setCounsellorsDropDownForFollowups(userId, collegeId) {
    counsellorsAvailableForFollowup = false;
    $('#counsellorListDiv').html("");
    $.ajax({
        url: jsVars.FULL_URL+"/counsellors/get-counsellors-list-for-followups",
        type: 'post',
        data: {'userId' : userId, 'collegeId':collegeId, moduleName:"lead"},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: false,
        beforeSend: function () {},
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
                    if(typeof responseObject.data.counsellors === "object"){
//                        if(responseObject.data.counsellors.length <= 0) {
//                            $("#followUpMessageDiv").html("<div class='alert-warning'>No counsellor assigned to this lead, Please assign a counsellor first in order to add a followup.</div>");
//                        }else 
                        if(typeof responseObject.data.counsellors === "object"){
                            counsellorsAvailableForFollowup = true;
                            var counsellors  = '<label class="floatify__label float_addedd_js" for="counsellorId">Assigned To</label><select name="counsellorId" id="counsellorId" class="" tabindex="-1">';
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
        data: {'userId' : currentUserId, 'userName' : currentUserName, 'collegeId':currentCollegeId, 'activityCode':['10012','10013','10014','10112','10291'], 'moduleName':'lead', 'page':$("#stageActivityPage").val(), 'viewType':'popup'},
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
        success: function (html) {
            var checkError  = html.substring(0, 6);
            console.log(checkError)
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
    if(currentUserId == '' && currentCollegeId == '') {
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
    var leadSubStage = 0;
    if ($("#lead_sub_stage").length > 0) {
        leadSubStage = $("#lead_sub_stage").val();
    }
    
    var actionType = '';
    if ($("#followupModal #actionType").length > 0) {
        actionType = $("#followupModal #actionType").val();
    }
    
    if(actionType === 'stage' && $('#lead_stage').val()=='') {
        $("#stage_error").html("Mandatory to select lead stage.");
        $("#stage_error").show();
        return;
    }
    
    
    var submitData = {};
    addNewFollowUptoggle = 0
    if($("#new_follow_up_toggle").is(':checked'))
     {addNewFollowUptoggle = 1}
    submitData = {'userId' : currentUserId, 'collegeId':currentCollegeId, 'leadStage':$("#lead_stage").val(), 'leadSubStage': leadSubStage, 'leadRemark':$("#lead_remark").val(), 'leadFollowupDate':$("#lead_followup_date").val(), moduleName:'lead', 'actionType':actionType,'addNewFollowUptoggle':addNewFollowUptoggle};
    
    if($("#counsellorId").length > 0 && ($("#counsellorId").val() === '' || $("#counsellorId").val() === null || $("#counsellorId").val() === 0) && $("#lead_followup_date").val() !== '') {
        if(counsellorsAvailableForFollowup===true){
            $("#followUpMessageDiv").html("<div class='alert-danger'>Please select a counsellor to add follow-up.</div>");
            return false;
        }
        submitData["followupAssignedTo"] = 0;
    } else {
        submitData["followupAssignedTo"] = $("#counsellorId").val();
    } 
    var leadFollowupCheck = false;
    if ($("#leadFollowupCheck").length > 0 && $('input[name=leadFollowupCheck]').is(':checked') == true) {
        leadFollowupCheck = true;
    } 
    submitData["leadFollowupCheck"] = leadFollowupCheck;
    $("#saveFollowUpButton").hide();
    $('#saveFollowUpButton').attr('disabled',true);
    $("#saveFollowUpButtonWait").show();
    $.ajax({
        url: jsVars.followUpLink,
        type: 'post',
        data: submitData,
        dataType: 'html',
        //async: false,
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            showLoader();
        },
        complete: function () {            
            $("#saveFollowUpButton").show();
            $("#saveFollowUpButtonWait").hide();
            $('#saveFollowUpButton').removeAttr('disabled');
            hideLoader();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response); 
            // alert(responseObject.message)
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                $("#followUpMessageDiv").html("<div class='alert-success'>Details saved.</div>");
                if(typeof responseObject.data === "object"){
                    currentStage            = responseObject.data.stage;                    
                    disallowDown            = responseObject.data.disallow_down;
                    disallowFollowup        = responseObject.data.disallow_followup;
                    disallowRemark          = responseObject.data.disallow_remark;
                    disallowCommunication   = responseObject.data.disallow_communication;
                    if (typeof responseObject.data.sub_stage != 'undefined') {
                        currentSubStage         = responseObject.data.sub_stage;
                    }
                }     
                $('#followupModal').modal('hide');
                LoadMoreLeadsUser('reset');
            }else{
//                if(responseObject.follow_up_toggle){
//                    
//                }
//                console.log(responseObject)
                $("#followUpMessageDiv").html("<div class='alert-danger'>"+responseObject.message+"</div>");               
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#saveFollowUpButton').attr('disabled',false);
        }
    });
}

/**
 * @function called by when bulk stage change is triggered (click on save button in popup)
 */
function updateLeadStageBulk(){
    $("#followUpMessageDiv").html("");
    if($("#lead_stage").val()===''){
        $("#followUpMessageDiv").html("<div class='alert-danger'>Please select stage !</div>");
        return;
    }
    if(currentCollegeId==''){
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
        $form.find('input[name="collegeId"]').val($("#user_college_id").val());
        $form.find('input[name="leadStage"]').val($("#lead_stage").val());
        //add sub stage
        if ($("#lead_sub_stage").length > 0) {
            $form.find('input[name="leadSubStage"]').val($("#lead_sub_stage").val());
        }
        
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
            data: $form.serialize(),
            success: function (responseObject) {
                responseObject = $.parseJSON(responseObject);
                // $('#saveFollowUpButton').attr('disabled',false);
                if (responseObject.status == 1) {
                    //Change Lead Stage in Bulk request
                    saveLeadStageBulkRequest();
                    return;
                } else {
                    if (responseObject.message != undefined) {
                        $("#followUpMessageDiv").html("<div class='alert-danger'>" + responseObject.message + "</div>");
                        $('#myModal').modal('hide');
                    }
                    return;
                }
            }
        });        
    }
}

/*
 * @functionto close batch
 */
var closeLeadStageBatch = function(){
    $('#myModal').modal('hide');
    LoadMoreLeadsUser('reset');
};

function initiateReassignLead(userId, type){
    $("#leadReassignMessageDiv").html("");
    $("#singleBulkTitle").html('');
    if(type==='bulk'){
        $("#singleBulkTitle").html('s');
        if($('input:checkbox[name="selected_users[]"]:checked').length < 1 && $('#select_all:checked').val()!='select_all'){
            alertPopup('Please select User','error');
            return;
        }
    }
    getCounsellorsList(userId, $("#user_college_id").val());
    $('#leadReassignModal').modal('show');
	floatableLabel();
}

function getCounsellorsList(userId, collegeId){
    var assignedTo  = '<select name="assignedTo" id="assignedTo" class="" tabindex="-1" ><option value="">Counsellor - Assigned To</option></select>';
    $('#assignedToListDiv').html(assignedTo);
    
    var unassignFrom  = '<label class="floatify__label float_addedd_js">From <span class="requiredStar"></span></label><select name="unassignedFrom[]" multiple="multiple" id="unassignedFrom" class="" tabindex="-1" data-placeholder="Unassign From"></select>';
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
	$("#reassignRemark").parent().removeClass('floatify__active');
    $("#leadReassignMessageDiv").html('');
    $.ajax({
        url: jsVars.getCounsellorsListLink,
        type: 'post',
        data: {'userId' : userId, 'collegeId':collegeId, moduleName:'lead'},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: false,
        beforeSend: function () { 
            showLoader();
            currentUserId           = '';
            currentCollegeId        = '';
        },
        complete: function () {
            hideLoader();
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
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
                    if(typeof responseObject.data.counsellors === "object"){
                        var counsellors  = '<label class="floatify__label float_addedd_js">To <span class="requiredStar">*</span></label><select name="assignedTo" id="assignedTo" class="" tabindex="-1" ><option value="">Counsellor - Assigned To</option>';
                        if(userId==='' && currentCounsellorId.length > 1){
                          responseObject.data.currentCounsellor   = {};
                        }
                        $.each(responseObject.data.counsellors, function (index, item) {
                            if(userId==='' && currentCounsellorId!=""){
                                if(currentCounsellorId.length > 1){
                                    if(currentCounsellorId.indexOf(index)!== -1){
                                        responseObject.data.currentCounsellor[index]  = item;
                                    }else{
                                        counsellors += '<option value="'+index+'">'+item+'</option>';
                                    }
                                }else{
                                    if(currentCounsellorId==index){
                                        responseObject.data.currentCounsellor   = {};
                                        responseObject.data.currentCounsellor[index]   = item;
                                    }else{
                                        counsellors += '<option value="'+index+'">'+item+'</option>';
                                    }
                                }
                            }else{
                                counsellors += '<option value="'+index+'">'+item+'</option>';
                            }
                        });
                        counsellors += '</select>';
                        $('#assignedToListDiv').html(counsellors);
                    }
                    if(typeof responseObject.data.currentCounsellor === "object"){
                        var unassignFrom  = '<label class="floatify__label float_addedd_js">From <span class="requiredStar"></span></label><select name="unassignedFrom[]" multiple="multiple" id="unassignedFrom" class="" tabindex="-1" data-placeholder="Unassign From">';
                        var isex = false;
                        $.each(responseObject.data.currentCounsellor, function (index, item) {
                            unassignFrom += '<option value="'+index+'" selected="selected">'+item+'</option>';
                            isex=true;
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
            ($("#assignedTo").val()=='unassigned' || IsExists===true)){
        $("#leadReassignMessageDiv").html("<div class='alert-danger'>Please select a counsellor in 'From'</div>");
        return;
    }
    if($("#assignedTo").val()==''){
        $("#leadReassignMessageDiv").html("<div class='alert-danger'>Please select a counsellor in 'To'</div>");
        return;
    }
    
    $("#leadReassignMessageDiv").html("");
    if(currentUserId==''){
        preCheckBulkReassign();
        return;
    }
 
    $.ajax({
        url: jsVars.preManualReassignmentCheckLink,
        type: 'post',
        data: {'userId' : currentUserId, 'collegeId':currentCollegeId, 'assignedTo':$("#assignedTo").val(), 'unassignedFrom':$("#unassignedFrom").val(), 'reassignRemark':$("#reassignRemark").val(), moduleName:'lead', 'assignedName':$("#assignedTo option:selected").text()},
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
                
                $('#ConfirmPopupReassignCounsellor #confirmTitle').html('Re-assign Lead(s)');
                $('#ConfirmPopupReassignCounsellor #assignedToCounsellorText').html("Taking this action will re-assign lead(s) to counselor "+$("#assignedTo option:selected").text()+".<br>");
                $('#ConfirmPopupReassignCounsellor #counsellorNoteText').html("(Disable toggle if only lead has to be re-assigned.)");
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
function selectAllAvailableRecords(totalAvailableRecords){
    if($('#select_page_users').is(":checked")===false){
        $('#select_page_users').trigger('click');
    }
    $("#selectionRow").show();
    $("#selectAllAvailableRecordsLink").hide();
    $("#clearSelectionLink").show();
    $("#currentSelectionMessage").html("All "+totalAvailableRecords+" leads are selected.");
    $('#select_all').each(function(){
        this.checked = true;
    });
    // $('.select_lead').each(function(){
    //     this.checked = true;
    // });
}

function clearSelection(){
    $("#selectionRow").hide();
    $("#selectAllAvailableRecordsLink").hide();
    $("#clearSelectionLink").hide();
    $('.select_lead').attr('checked',false);
    $('#select_page_users').attr('checked',false);
    $('#select_all').attr('checked',false);
}

function selectAllLead(elem){
    // facebook-custom-audiences
    $('div.loader-block').show();
    $("#selectionRow").hide();
    $("#clearSelectionLink").hide();
    $('#select_all').attr('checked',false);
    if(elem.checked){
        //console.log(elem.checked);
        $("#selectAllAvailableRecordsLinkSpan").html('<a id="selectAllAvailableRecordsLink" href="javascript:void(0);" onclick="selectAllAvailableRecords('+ $("#all_records_val").val() +');"> Select all <b>'+ $("#all_records_val").val() +'</b>&nbsp;leads</a>');
        
        $('.select_lead').each(function(){
            this.checked = true;
        });
        
        var recordOnDisplay = $('input:checkbox[name="selected_users[]"]').length;
        $("#currentSelectionMessage").html("All "+recordOnDisplay+" leads on this page are selected. ");
        $("#selectionRow").show();
        $("#selectAllAvailableRecordsLink").show();
        $("#clearSelectionLink").hide();
        $('#li_bulkCommunicationAction,#li_facebookCustomAudiences').show();
    }
    else{
        $('.select_lead').attr('checked',false);
        $("#selectAllAvailableRecordsLink").hide();
        $('#li_bulkCommunicationAction,#li_facebookCustomAudiences').hide();
    }
    $('div.loader-block').hide();
}

function bulkReassignLeads(){
    var users   = [];
    $('input:checkbox[name="selected_users[]"]').each(function () {
        if(this.checked){
            users.push(parseInt($(this).val()));
        }
    });
    if($('#select_all:checked').val()=='select_all'){
        var data    = {'userId' : 'all', 'collegeId':$("#user_college_id").val(), 'assignedTo':$("#assignedTo").val(), 'unassignedFrom':$("#unassignedFrom").val(), 'reassignRemark':$("#reassignRemark").val(), moduleName:'lead', 'filters':$("#leadsListFilters").val(),'applicationReassignCheck':applicationReassignCheck,'queryReassignCheck':queryReassignCheck};
    }else{
        var data    = {'userId' : users, 'collegeId':$("#user_college_id").val(), 'assignedTo':$("#assignedTo").val(), 'unassignedFrom':$("#unassignedFrom").val(), 'reassignRemark':$("#reassignRemark").val(), moduleName:'lead','applicationReassignCheck':applicationReassignCheck,'queryReassignCheck':queryReassignCheck};
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
                $('#leadReassignModal').modal('hide');
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
                    alertPopup("Request for re-assigned leads saved successfully.",'sucess');
                    LoadMoreLeadsUser('reset');
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

function getReferrerList(tfc){
    var college_id = $('#user_college_id').val();
    var registration_instance = $("select[name='filter[registration_instance]']").val();
    if(registration_instance == ''){
        registration_instance = 'pri_register';
    }
    $('#publisher_filter').html('<option value="">Publisher/Referrer</option>');
    $.ajax({
        url: '/campaign-manager/get-referrer-list',
        type: 'post',
        dataType: 'html',
        async:false,
        beforeSend: function () { showLoader();},
        complete: function () { 
            $('#publisher_filter').trigger('chosen:updated');
            hideLoader();
        },
        data: {'college_id': college_id,'traffic_channel':tfc,'registration_instance':registration_instance},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                if(typeof responseObject.data.sourceList === "object"){
                    var sourceList    = responseObject.data.sourceList;
                    $.each(sourceList, function (index, item) {
                        $('#publisher_filter').append('<option value="'+index+'">'+item+'</option>');
                    });
                }
            }else{
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
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

function getDirectSourceList(college_id){
     if(college_id){
        var html  = "<option value=''>Publisher/Referrer</option>";
            html  += "<option value='30' >Direct</option>";
                $("#publisher_filter").html(html);
                $('#publisher_filter').trigger('chosen:updated');
    }
}

function getChatSourceList(college_id){
     if(college_id){
        var html  = "<option value=''>Publisher/Referrer</option>";
            html  += "<option value='151' >Chat</option>";
                $("#publisher_filter").html(html);
                $('#publisher_filter').trigger('chosen:updated');
    }
}


function filter(element, listid) {
    var value = $(element).val().toLowerCase();
    var cols_count = 0;
    $("#" + listid + " li ul li").each(function () {
        if ($(this).text().toLowerCase().search(value) > -1) {
            $(this).addClass('active').show();
            cols_count++;
        } else {
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


/*
 * function use for reset all form values
 * NPF-1211 10.3 || LMS & Application Manager revamp
 */
//function resetFilterValue() {
//    $('#filter_elements_html').find('input[type="text"]').each(function () {
//        $(this).val('');
//    });
//    $('#filter_elements_html').find('select').each(function () {
//        this.selected = false;
//        $(this).val('');
//        $(this).trigger("chosen:updated");
//    });
//    $('#FilterLeadForm select#user_college_id').val('');
//    $('#FilterLeadForm select#user_college_id').trigger("chosen:updated");
//    $('#FilterLeadForm #search_common').val('');
//    $('#load_more_results').html('<tbody><tr><td><div class="col-md-12"><h4 class="text-center text-danger">Please select institute name and click search button to view leads.</h4></div></td></tr><tr></tr></tbody>');
//    $('.if_record_exists').hide();
//    $('#load_more_button').hide();
//    $('#load_slider_data').html("");
//    $('#view_by').val("");
//    return false;
//}

/**
 * This function for display data for user leads and rest form ,
 * NPF-1211 10.3 || LMS & Application Manager revamp
 */
function LoadMoreLeadsUser(type,module) {

    if(ajaxStatus_LoadMoreLeadsUser=='not_ready'){
        return false;
    }
//    graphMakeDisabledFields('all');
    //$('button[name="search_btn"]').attr("disabled", "disabled");
//   callTrigger("id","table-view");//for select table view always in search case
//    $('#table-view').show();
    
    //$('#push_application').hide();
    
    $(".lead_error").html('');
//    $('#table-view').show();
//    $('#push_application').hide();
    if($('#user_college_id').val() == '' || $('#user_college_id').val() == '0' ){
        $('#college_error').html('<small class="text-danger">Please Select Institute</small>');
        $('#load_msg_div').show();
        $('#load_more_results').html("");
        $('#if_record_exists').hide();
        $('#load_more_button').hide();
        $('#load_msg').html('Please select an Institute Name from filter and click apply to view Leads.');
        return false;
    }
    if (type === 'reset') {
        if(typeof module === 'undefined' || module !== 'sorting'){
            $("#sort_options").val('');
        }
        
        if($('#user_college_id').val()>0){
            if($.trim($('#search_common').val()) !== '') {
                if(typeof jsVars.maximumEmailMobileSearch !== 'undefined') {
                    var splitText = $.trim($('#search_common').val()).split(',');
                    if(splitText.length > jsVars.maximumEmailMobileSearch) {
                        alertPopup('Maximum search length is ' + jsVars.maximumEmailMobileSearch,'error');
                        return false;
                    }
                }
            }
        }
        
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
//        $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;&nbsp;Loading...');
        $('#view_by').val('');
        $('button[name="search_btn"]').attr('disabled','disabled');
        
        if(jsVars.counsellorOrStaffUser){
            $("#li_bulkCommunicationAction").hide();
            checkBulkCommunicatePermission();
        }
        currentCounsellorId     = jsVars.counsellorId;
        if($("#councellor_id").length && $("#councellor_id").val()!==""){
            currentCounsellorId    = $("#councellor_id").val();
        }
        var filterCounsellorId = getSelectedCounsellorId();
//        if(filterCounsellorId !== "" && filterCounsellorId !== 0 ){
//            currentCounsellorId    = filterCounsellorId;
//            $("#li_bulkReassignAction").show();
//        }else{
//            $("#li_bulkReassignAction").hide();
//        }
        if(typeof jsVars.showBulkReAssignButton !== "undefined" && (jsVars.showBulkReAssignButton == true)){
            $("#li_bulkReassignAction").show();
        }
        else if(filterCounsellorId !== "" && filterCounsellorId !== 0 ){  
            $("#li_bulkReassignAction").show();
            currentCounsellorId    = filterCounsellorId;
        }else{
            $("#li_bulkReassignAction").hide();
        }
        $('li.customListClass').remove();
    }
    
    if(typeof jsVars.showBulkReAssignButton !== "undefined" && (jsVars.showBulkReAssignButton == true)){
        $("#bulk_reassign").show();
    }
    
    if (Page == 0) {
            $('button[name="search_btn"]').attr("disabled", "disabled");
    }
    
//    $('#export').remove();
    
    var data = $('#FilterLeadForm').serializeArray();
    downloadRequestPopupMessage('lead',$('#user_college_id').val());
    data.push({name: "page", value: Page});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;&nbsp;Loading...');
    $('#seacrhList, #create_view_apply').attr('disabled', 'disabled').html('Applying&nbsp;<i class="fa fa-spinner fa-spin"></i>');
    
    
    // $('#column_li_list .column_create_keys').each(function(){
    //     if($(this).is(':checked')){
    //         data.push({name: "column_create_keys[]", value: $(this).val()});
    //     }
    // });

    $('input[name="column_sorting_order[]"]').each(function(){
        data.push({name: "column_create_keys[]", value: $(this).val()});
    });

    $('#list_view_fields_selected').val($('#realignment_order').val());
   
    // return false;
    leadManager =  $.ajax({
        url: '/leads/lead-manager-lists',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function () {          
//           showLoader();
            ajaxStatus_LoadMoreLeadsUser  = 'not_ready';
            $(".expandableSearch .btn-default").prop("disabled",true);
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        async:true,
        success: function (data) {
            var checkError  = data.substring(0, 12);
            $(".expandableSearch .btn-default").prop("disabled",false);
            ajaxStatus_LoadMoreLeadsUser  = 'ready';
            $('#seacrhList,#create_view_apply').removeAttr('disabled').html('Apply');
            Page = Page + 1;
            if (data === "session_logout") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (data === "search_mandatory") {
                    $('#load_msg').html('Please Search Leads');
                    $('#load_msg_div').show();
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Leads");
                    $('#load_more_button').hide();
                    if ($(window).width() < 992) {
                        filterClose();
                    }
                    
                    $("#tot_records").html("Total 0 Records");
            } else if (data === "error") {
                if (Page == 1) {
                    $('#load_msg').html('No Leads found');
                    $('#load_msg_div').show();
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Leads");
                    $('#load_more_button').hide();
                    if ($(window).width() < 992) {
                        filterClose();
                    }
                    
                    $("#tot_records").html("Total 0 Records");
//                    error_html = "No Records found";
//                    $('#load_more_results').html('<tbody><tr><td><div class="col-md-12"><h4 class="text-center text-danger">' + error_html + '</h4></div></td></tr><tr></tr></tbody>');
                } else {
                    $('#load_msg').html('');
                    $('#load_msg_div').hide();
                    $('#load_more_button').html("<i class='fa fa-database' aria-hidden='true'></i>&nbsp;No More Leads");
                    $('#load_more_button').show();
//                    $('#if_record_exists').show();
                }
                if (type != '' && Page==1) {
                    $('#if_record_exists').hide();
                    $('#single_lead_add').hide();
                }
                
//                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Show More Leads');
//                $('#load_more_button').hide();
//                if ($(window).width() < 992) {
//                        filterClose();
//                }

            } else if (data == "select_college") {
                $('#load_msg_div').show();
                $('#load_msg').html("Please select an Institute Name from filter.");
                $('#load_more_results').html("");
                $('#load_more_button').hide();
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Leads");
                if (type != '') {
                       $('#if_record_exists').hide();
                }
            } else if (data == "select_stage") {
                $('#load_msg_div').show();
                $('#load_msg').html('Please select Lead Stage first.');
                $('#load_more_results').html("");
                $('#load_more_button').hide();
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Leads");
                if (type != '') {
                       $('#if_record_exists').hide();
                } 
            }else if (checkError === "error_filter") {
                $('#load_msg_div').show();
                $('#load_msg').html('Please check condition in Filter.');
                $('#load_more_results').html("");
                $('#load_more_button').hide();
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Leads");
                var errorString  = data.substring(14);
                errorStringArray =  errorString.split('_'); 
                if(errorStringArray.length==3){
                    $('#errorlead_'+errorStringArray[0]+'_'+errorStringArray[1]).show().html('<small class="text-danger">'+errorStringArray[2]+'</small>');
                }else{
                    $('#errorlead_'+errorStringArray[0]+'_'+errorStringArray[1]).show().html('<small class="text-danger">Either remove the condition or select a value</small>');
                }
                filterOpen();
                
                
//                $('#load_more_results').html('<tbody><tr><td><div class="col-md-12"><h4 class="text-center text-danger">Please check condition in Filter.</h4></div></td></tr><tr></tr></tbody>');
//                $('#load_more_button').hide();
//                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Show More Leads');
//                var errorString  = data.substring(14);
//                errorStringArray =  errorString.split('_'); 
//                $('#errorlead_'+errorStringArray[0]+'_'+errorStringArray[1]).show().html('<small class="text-danger">Either remove the condition or select a value</small>');
//                filterOpen();
            } else {
//                $('#if_record_exists').show();
                if (type == 'reset') {
                    $('#load_more_results').html("");
                }
                data = data.replace("<head/>", '');
                $('#load_more_results').parent().removeClass('hide');
                $('#load_more_results').append(data);
                $('#load_msg_div').hide();
                $('.itemsCount').show();
                filterClose();
                var ttl = $('#tot_records').html().split(' ');
                if (parseInt(ttl[1]) <= parseInt($('#items_no_show_chosen > a > span').html())) {

                    $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Show More Leads');
                    $('#load_more_button').hide();
                } else {
                    var current_record = $("#current_record").val();//current_record_count
                    if (current_record < 10) {
                        $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Show More Leads');
                        $('#load_more_button').hide();
                    } else {
                        $('#load_more_button').removeAttr("disabled");
                        $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Show More Leads');
                    }

                }
                if (type != '') {
                    $('#if_record_exists').fadeIn();
                }
                table_fix_rowcol();
                dropdownMenuPlacement();
                $('#ameyoIframeDiv').fadeIn(2000);
                if($('#select_page_users:checked').length>0 && $('#select_all:checked').length<1){
                    var recordOnDisplay = $('input:checkbox[name="selected_users[]"]').length;
                    $("#currentSelectionMessage").html("All "+recordOnDisplay+" leads on this page are selected. ");
                }
//                // hold onto the drop down menu                                             
//                 var dropdownMenu;
//                // and when you show it, move it to the body                                     
//                $('.ellipsis-left').on('show.bs.dropdown', function (e) {
//
//                        // grab the menu        
//                        dropdownMenu = $(e.target).find('.dropdown-menu');
//                        dropHeight = dropdownMenu.outerHeight() - 15;
//
//                        // detach it and append it to the body
//                        $('body').append(dropdownMenu.detach());
//
//                        // grab the new offset position
//                        var eOffset = $(e.target).offset();
//
//                        // make sure to place it where it would normally go (this could be improved)
//                        dropdownMenu.css({
//                                'display': 'block',
//                                //'top': eOffset.top + $(e.target).outerHeight(),
//                                'top': eOffset.top - dropHeight,
//                                'left': eOffset.left - 124
//                        });
//                });
//
//                // and when you hide it, reattach the drop down, and hide it normally                                                   
//                $('.ellipsis-left').on('hide.bs.dropdown', function (e) {
//                        $(e.target).append(dropdownMenu.detach());
//                        dropdownMenu.hide();
//                });
//				
//				// Add dynamic Height on Table for thead Fix
////				var windowHeight = jQuery(window).height() - 275;
////				jQuery('#parent').css('max-height', windowHeight);
//                
                if(Page == 1 && $('#data-tab-container').length) {
                    makeScrollable();	
                }
            }
            $('#addRemoveColumnModal').modal('hide');
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function () {
            is_filter_button_pressed = 1;
            hideLoader();
			//$('#parent').removeAttr('style');
        }
    });

    return false;
}

function checkBulkCommunicatePermission(){
    $.ajax({
        url: jsVars.checkBulkCommunicatePermissionLink,
        type: 'post',
        data: {'collegeId':$("#user_college_id").val(), 'stage':$("#ud\\|lead_stage").val(), moduleName:'lead'},
        dataType: 'html',
        async: false,
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

/**
 * This function for rest all values in FilterLeadForm form
 * NPF-1211 10.3 || LMS & Application Manager revamp
 */
function ResetFilterUserLeadsValue($this) {
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
    
//    $('#FilterLeadForm select#user_college_id').val('');
//    $('#FilterLeadForm select#user_college_id').trigger("chosen:updated");
    
    $('#FilterLeadForm #search_common').val('');
    $('#load_more_results').html('');
    $('#if_record_exists').hide();
    $('#load_msg').html("Please select an Institute Name and click Search to view Leads.");
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
/**
 * This function use for hide all data
 * NPF-1211 10.3 || LMS & Application Manager revamp
 */
function userleadsCollegeHide() {
    $("#load_more_results").html('');
    $('#load_more_button').hide();
    $(".if_record_exists").hide();
    $("#filter_elements_html").html('');
    $('#load_more_results').html('<tbody><tr><td><div class="col-md-12"><h4 class="text-center text-danger">Please select an Institute Name and click Search to view Leads.</h4></div></td></tr><tr></tr></tbody>');
    hideChartGraph();
}

function isNumberKey(evt)
 {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && (charCode > 31||charCode == 13) 
      && (charCode < 48 || charCode > 57)){
       return false;
    }
    return true;
 }
 
function rangeInput(html_field_id){
    changeEventForFilter();
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
    
    $('#'+html_field_id).trigger('change');
}

/**
 * This function use for get college config based filter append
 * NPF-1211 10.3 || LMS & Application Manager revamp
 */
function getCollegeConfigFilterWithDefault(college_id, form_id) {
    isLeadSubStageConfigure = 0;
    $(".filterAdvancelead").hide();//filter deropdoun show
     $("#load_more_button").hide();
    $("#filter_li_list").html('');//blank filter
    $("#column_li_list").html('');//blank column
    if (typeof college_id == "undefined") {
        return false;
    }
    var data = $('#FilterLeadForm').serializeArray();
    data.push({name: "form_id", value: form_id});
    $.ajax({
        url: '/leads/get-college-config-filter-column', 
        type: 'post',
        dataType: 'json',
        data: data,
        async:false,
        beforeSend: function () { showLoader(); },
        complete: function () { hideLoader(); },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                window.location.href = json['redirect'];
            } else if (typeof json['status'] != 'undefined' && json['status'] == 200) {
                $("#filter_li_list").append(json['filter']);
                $('#filter_li_list li').each(function(i)
                {
                   filterVal = $(this).find('input:checkbox').val();
                   if(filterVal.match('field_form_stage_') !== null) {
                       $(this).remove();
                   }
                });
                $("#column_li_list").append(json['column']);
                //$("#form_id").html(jQuery.parseJSON(json['form']));
                //$('#form_id').trigger('chosen:updated');
                if (typeof json['isLeadSubStageConfigure'] != 'undefined') { 
                isLeadSubStageConfigure = json['isLeadSubStageConfigure'];
                } 
                /**
                 * Create extra data attribute in filter because from now onwards admin can save the filter
                 */
                addDataAttribute();
                
                createUserFilter();//for show default country state ,city ..
                
                //For Registration Dependent 
                dependentFieldSelection();                
                if (typeof json['registrationDependentField'] !== 'undefined' && json['registrationDependentField'] != '') {
                    dependentDropdownFieldList = json['registrationDependentField'];
                }
                
                if(!$('select#s_lead_status').is(':visible')){//if hidden incase career utsav counsellor
                    if($("select#s_lead_status option[value=4]").length > 0 )
                        $('select#s_lead_status')[0].sumo.selectItem('4');
                }
                
                if($("select#s_lead_status option[value=2]").length > 0 ){
                    $("select#s_lead_status option[value=2]").attr('selected','selected');
                }
                if($("select#s_lead_status option[value=1]").length > 0 ){
                    $("select#s_lead_status option[value=1]").attr('selected','selected');
                }
                
//                $('select#s_lead_status')[0].sumo.reload();

                $('.filterCollasp').unbind('click');
                $('.filterCollasp').bind('click', function(e) {
                    if($(this).parent().hasClass('active')) {
                        $('.filterCollasp').parent().removeClass('active');
                    } else {
                        $('.filterCollasp').parent().removeClass('active');
                        $(this).parent().addClass('active');
                    }
                    e.preventDefault();
                });

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}
/**
 * This function use for append  filter in Div
 *NPF-1211 10.3 || LMS & Application Manager revamp
 */
function createUserFilter() {
    $(".filterAdvancelead").show();//filter deropdoun show
    $('button[name="search_btn"]').removeAttr("disabled");
    $('#filter_elements_html').html('');    
    $('.dynamic-lms-filter').remove(); // reset the added filters
    var col_class = 4;//class col-md-3
    var isDistrictPresent = false;
    var isZoneStatePresent = false;
    var isLeadSubStageFilterPresent = false;
    
    //var InputId     = $(currentObj).attr('id');
    $('input[name="filter_create_keys[]"]:checked').each(function () {
        if($(this).data('input_id') == 'district_id'){
            isDistrictPresent = true;
        } else if($(this).data('input_id') == 'state_id') {
            isZoneStatePresent = true;
        } else if($(this).data('input_id') == 'leadSubStageFilterId') {
            isLeadSubStageFilterPresent = true;
        }
    });

    var i = 0;
    $('input[name="filter_create_keys[]"]:checked').each(function () {
        if($(this).data('input_id') == 'state_id' && isDistrictPresent == true){
            $(this).data('isDistrictPresent', 'district_exist');
        } else if($(this).data('input_id') == 'zone_mapping_id' && isZoneStatePresent == true){
            $(this).data('isZoneStatePresent', 'zone_state_exist');
        } else if($(this).data('input_id') == 'leadStageFilterId') {
            $(this).data('isLeadSubStageFilterPresent', '');
            if (isLeadSubStageFilterPresent == true) {
                $(this).data('isLeadSubStageFilterPresent', 'lead_sub_stage_exist');
            }
        }
        createInputUser(this, col_class, i++);
//        if($(this).data("input_id")=="widget_id"){
////            $(this).parent().parent("li").remove();
//            $("select[name='filter[u|widget_id]']").val('');
//            showHideWidgetFilter();
//        }
    });

    return false;
}
/**
 * This function use for append  filter
 * NPF-1211 10.3 || LMS & Application Manager revamp
 */
function createInputUser(currentObj, col_class, ii) {
    var isDistrictPresent = $(currentObj).data('isDistrictPresent');
    var isZoneStatePresent = $(currentObj).data('isZoneStatePresent');
    var isLeadSubStageFilterPresent = $(currentObj).data('isLeadSubStageFilterPresent');
    var labelname = $(currentObj).data('label_name');
    var InputId = $(currentObj).attr('id');
    var key_source = $(currentObj).data('key_source');
    var childId  = $(currentObj).data('child');
    var value_field = $(currentObj).val();
    var arr = value_field.split("||");
    var html = '';
    var type = "";
    var SumoSelect = "";
    var dateFormat = '';
    var dateId = '';
    var customDateFormats = [];
    var fieldLabelmapping = {'ud|country_id':"Country", 'ud|course_id':"Course",'ud|university_id':"Campus",'ud|district_id':"District"};
    var class_date = '';
    if (arr.length > 2) {
        var type = arr[1];
        var val_json = arr[2];
        var html_field_id = '';
        // for not break ajax on created by, ID CreatedBySelect
        html_field_id = arr[0];
        //create drop down
        
        var multi_select_city = $("#multi_select_city").val(); //select for multiple select dropdown for lead manager only
       
        if (type == "dropdown" || type == "select") {//drop down
            
            var dataLabel = '';
            if(typeof $(currentObj).data('label') !== 'undefined') {
                dataLabel = $(currentObj).data('label');                        
            }
                
            var multivalue = $(currentObj).data('multivalue');//sumo drop down
            
            if(multivalue){
                multivalue = "multiple='multiple'";
            }else if(('ud|city_id' == html_field_id) && (typeof multi_select_city!='undefined') && (multi_select_city=='yes')){
                   multivalue = "multiple='multiple'";
            }
            
            if(typeof childId !== 'undefined' && childId!=''){
                dependentFieldId = html_field_id;
                if(typeof $(currentObj).data('registrationdependent') !== 'undefined') {
                    dependentFieldId = $(currentObj).data('registrationdependent');                        
                }
                var dataLabel = '';
                if(typeof $(currentObj).data('label') !== 'undefined') {
                    dataLabel = $(currentObj).data('label');                        
                }
                html = "<select data-key_source="+InputId+" onchange = \"return GetChildByMachineKey(this.value, '"+childId+"','','','','',true);\" class='chosen-select' name='filter[" + arr[0] + "]' id='"+dependentFieldId+"' data-label='"+dataLabel+"'>"; 

            }else if ('campu|publisher_id' == html_field_id) {
                html = "<select data-key_source=" + InputId + "  class='chosen-select publisher_filter' name='filter[" + arr[0] + "]' id='publisher_filter'>";
            }else if('ud|country_id' == html_field_id){
                html = "<select data-key_source=" + InputId + " class='chosen-select' name='filter[" + arr[0] + "]' id='CountryId' onchange = 'return GetChildByMachineKey(this.value,\"StateId\",\"State\");'>";
            }  else if('ud|district_id' == html_field_id){
                var college_id = $('select#user_college_id').val();
                html = "<select data-key_source=" + InputId + " class='chosen-select' name='filter[" + arr[0] + "]' id='DistrictId' onchange = 'return GetChildByMachineKey(this.value,\"CityId\",\"City\","+college_id+");'>";
            }else if('ud|state_id' == html_field_id){
                var college_id = $('select#user_college_id').val();                
                if(isDistrictPresent == 'district_exist'){
                   html = "<select data-key_source=" + InputId + " class='chosen-select' name='filter[" + arr[0] + "]' id='StateId' onchange = 'return GetChildByMachineKey(this.value,\"DistrictId\",\"District\","+college_id+");'>";
                }else{                
                    html = "<select data-key_source=" + InputId + " class='chosen-select' name='filter[" + arr[0] + "]' id='StateId' onchange = 'return GetChildByMachineKey(this.value,\"CityId\",\"City\","+college_id+");'>";
                }
                
            } else if('ud|lead_stage' == html_field_id){
                var college_id = $('select#user_college_id').val();                
                if(isLeadSubStageFilterPresent == 'lead_sub_stage_exist'){
                   multivalue = "";
                   html = "<select data-key_source=" + InputId + " class='chosen-select' name='filter[" + arr[0] + "]' id='leadStageFilterId' multiple='multiple' onchange=\"getLeadSubStages('" + college_id + "', this.value, 'leadSubStageFilterId', 'sumo', 'FilterLeadForm');\">";
                }else{                
                    html = "<select placeholder=' " + labelname + "' data-key_source=" + InputId + " class='form-control multi-dynamic'  multiple='multiple' name='filter[" + arr[0] + "][]' id='leadStageFilterId'>";
                }
                
            } else if('ud|lead_sub_stage' == html_field_id) {
                html = "<select placeholder=' " + labelname + "' data-key_source='" + InputId + "' class='form-control multi-dynamic'  multiple='multiple' name='filter[" + arr[0] + "][]' id='leadSubStageFilterId'>";
            } else if('ud|zone_mapping_id' == html_field_id) {  //zone mapping
                /*var college_id = $('select#user_college_id').val();
                if(isZoneStatePresent == 'zone_state_exist'){
                    html = "<select data-key_source=" + InputId + " class='chosen-select' name='filter[" + arr[0] + "]' id='ZoneMappingId' onchange = 'return GetChildByMachineKey(this.value, \"StateId\", \"State\", " + college_id + ");'>";
                }else{    */            
                    html = "<select data-key_source=" + InputId + " class='chosen-select' name='filter[" + arr[0] + "]' id='ZoneMappingId'>";
                //}
                
            } else if(('ud|city_id' == html_field_id) && (typeof multi_select_city!='undefined') &&  (multi_select_city=='yes')){
                labelname = 'Registered ' + labelname ;
                html = "<select placeholder=' "+labelname+"' data-key_source='" + InputId + "' class='form-control multi-dynamic'  multiple='multiple' name='filter[" + arr[0] + "][]' id='CityId'>";
            } else if('ud|city_id' == html_field_id){
                labelname = 'Registered '+ labelname ;
                html = "<select data-key_source='" + InputId + "' class='chosen-select' name='filter[" + arr[0] + "]' id='CityId'>";
            } else if('ud|course_id' == html_field_id){
                html = "<select data-key_source='" + InputId + "' class='chosen-select "+html_field_id.replace('|','-')+"' name='filter[" + arr[0] + "]' id='" + html_field_id + "' onchange = 'return GetChildByMachineKey(this.value,\"SpecialisationId\",\"Specialisation\");'  data-label='"+dataLabel+"'>";
            } else if('ud|specialization_id' == html_field_id){
                html = "<select data-key_source='" + InputId + "' class='chosen-select "+html_field_id.replace('|','-')+"' name='filter[" + arr[0] + "]' id='SpecialisationId' data-label='Specialization' data-label='"+dataLabel+"'>";
            }else if('form_id' ==html_field_id){
                html = "<select data-key_source=" + InputId + " class='chosen-select "+html_field_id.replace('|','-')+"' name='" + arr[0] + "' id='" + html_field_id + "'>";
            }else if(multivalue){
               html = "<select data-key_source='" + InputId + "' class='form-control multi-dynamic' name='filter[" + arr[0] + "][]' id='" + html_field_id + "' "+multivalue+">";
            }
            else {
                
                //If RegistrationDependent Data key is exist then capture that and set in the id
                if(typeof $(currentObj).data('registrationdependent') !== 'undefined') {
                    html_field_id = $(currentObj).data('registrationdependent');
                }
                
                html = "<select data-key_source=" + InputId + " class='chosen-select "+html_field_id.replace('|','-')+"' name='filter[" + arr[0] + "]' id='" + html_field_id + "' data-label='"+dataLabel+"'>";
            }

            
            if ('s_lead_status' != html_field_id && 'show_campaigns_in' != html_field_id) {
                if('ud|state_id' == html_field_id){
                     html += '<option value="">Registered ' + labelname + '</option>';
                     html += '<option value="0">' + labelname + jsVars.notAvailableText + '</option>';
                } else if ('ud|lead_sub_stage' == html_field_id) {
                    html += '<option value="0">' + labelname + jsVars.notAvailableText + '</option>';
                }else if(('ud|city_id' == html_field_id) && (typeof multi_select_city!='undefined') && (multi_select_city=='yes')){
//                     html += '<option value="">Registered City</option>';
                }else if('ud|city_id' == html_field_id){
                     html += '<option value="">Registered ' + labelname + '</option>';
                }else if(!multivalue) {
                    html += '<option value="">' + labelname + '</option>';
                    if($.inArray(html_field_id,['ud|country_id','ud|course_id','ud|university_id','ud|district_id']) >= 0 ){
                        html += '<option value="0">' + labelname + jsVars.notAvailableText + ' </option>';
                    } else if(html_field_id.indexOf("clgreg") >= 0 && $.inArray(html_field_id,['clgreg|isValidEmail','clgreg|isValidMobile']) < 0 ){
                        html += '<option value="empty_value">' + labelname + jsVars.notAvailableText + ' </option>';
                    }
                }
               
            }
            obj_json = JSON.parse(val_json);
            
            if(html_field_id === 'campu|traffic_channel' || html_field_id === 'acd|lead_type' || html_field_id === 'u|form_initiated' || html_field_id === 'form_id'){
                var obj_array = [];
                for (var key in obj_json) {  
                    obj_array.push({
                        key:key,
                        val:obj_json[key]
                    })
                }
                if(html_field_id === 'u|form_initiated'){
                    // desc order sort
                    obj_json = obj_array.sort(function (a, b) {
                        return b.val.localeCompare( a.val );
                    });
                }else{
                    obj_json = obj_array.sort(function (a, b) {
                        return a.val.localeCompare( b.val );
                    });
                }
                
            }
            
            for (var key in obj_json) {  
                var value   = obj_json[key];
                if(html_field_id === 'campu|traffic_channel' || html_field_id === 'acd|lead_type' || html_field_id === 'u|form_initiated' || html_field_id === 'form_id'){
                    value   = obj_json[key]['val'];
                    key     = obj_json[key]['key'];
                }
//                if('u|traffic_channel' == html_field_id && key ==1){
//                    html += "<option value=\"" + key + "\" selected>" + obj_json[key] + "</option>";
//                }else 
                if('registration_instance' == html_field_id && key == "pri_register"){
                     html += "<option value=\"" + key + "\" selected>" + value + "</option>";
                }else{                   
                    html += "<option value=\"" + key + "\">" + value + "</option>";                                   
                }
               
            }
            html += "</select>";
        } 
        else if (type == "date") {//date
            var operator_sel = $(currentObj).val();
            dateFormat = $(currentObj).data('date_format');
            dateId = $(currentObj).data('date_id');
            
             if(dateFormat != '' && dateId !=''  && dateFormat != 'DD/MM/YYYY'){
                class_date = dateId;
                customDateObj = {
                    'class' : class_date,
                    'dateFormat' : dateFormat
                };
                
                customDateFormats.push(customDateObj);
                
            }else if (operator_sel.indexOf('u|created||date')==0 ||operator_sel.indexOf('u|final_register_date||date')==0
                     ){
                if(ii%3==0){
                    // change class for every 1 or 2 position in a row
                    class_date = "date_time_rangepicker_report_right";
                }else if(ii%3==1){
                    // change class for every 1 or 2 position in a row
                    class_date = "date_time_rangepicker_report_center";
                }else{
                    class_date = "date_time_rangepicker_report";
                }
            } else if (operator_sel.indexOf('u|modified||date')) {
                if(ii%3==0){
                    // change class for every 1 or 2 position in a row
                    class_date = "daterangepicker_report_right";
                }else if(ii%3==1){
                    // change class for every 1 or 2 position in a row
                    class_date = "daterangepicker_report_center";
                }else{
                    class_date = "daterangepicker_report";
                }
            } else {
                class_date = "datepicker_report";
            }
         
            html = "<input type='text' data-key_source=" + InputId + "  class='form-control " + class_date + "' name='filter[" + arr[0] + "]' value='' readonly='readonly' placeholder='" + labelname + "' id='" + html_field_id + "'>";

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
            html = "<input type='text' data-key_source=" + InputId + "  class='form-control' name='filter[" + arr[0] + "]' value='' placeholder='" + labelname + "' id='" + html_field_id + "'>";
        }
    } 
    else {
        html = "<input type='text' data-key_source=" + InputId + " class='form-control' name='filter[" + arr[0] + "]' value='' placeholder='" + labelname + "'>";
    }
    var multi_class = '';
    var finalhtml = '';
    // finally show the field in DOM
    if(typeof type != "" && type == 'date') {
        html = '<div class="form-group formAreaCols dateFormGroup'+multi_class+'"><div class="iconDate"><i aria-hidden="true" class="fa fa-calendar-check-o"></i></div><div class="input text">' + html + '</div></div>';
        finalhtml = $('<div class="col-md-' + col_class + ' col-xs-12 div_' + key_source + ' dynamic-lms-filter "></div>').wrapInner(html);
        appendFilterInContainer(finalhtml);
    }else  {
        html = '<div class="form-group formAreaCols '+multi_class+'">' + html + '</div>';
        finalhtml = $('<div class="col-md-' + col_class + ' col-xs-12 div_' + key_source + ' dynamic-lms-filter"></div>').wrapInner(html);
        appendFilterInContainer(finalhtml);
        
    }

    
    if(multivalue){
        $('select.multi-dynamic').SumoSelect({placeholder: labelname, search: true, searchText:labelname, captionFormatAllSelected: "All Selected.", triggerChangeCombined: true, selectAll : false });
    }
    else {
        $('.chosen-select').chosen();
        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    }
    if (type == "date") {//case of date for date picker
       // $('.filter_user_date').datepicker({startView : 'year', format : 'yyyy', minViewMode: "years"});
        LoadReportDatepicker(customDateFormats);
        LoadReportDateRangepicker();
        LoadDateTimeRangepicker();
        datePickerChangeTrigger();
    }

}
/*
 * batch popup show
 * NPF-1211 10.3 || LMS & Application Manager revamp
 */
function hitUserPopupBatchBind() {

    $('.modalButton').on('click', function (e) {
        // filter changed but not applied
        if(typeof is_filter_button_pressed ==='undefined' || is_filter_button_pressed !== 1){
            alertPopup('It seems you have changed the filter but not Applied it. Please re-check the same to proceed further.','error');
            return false;
        }
        $('#csv').prop("checked", true);
        $('#confirmDownloadYes').off('click');
        $('#confirmDownloadTitle').text('Download Confirmation');
	$('#ConfirmDownloadPopupArea .npf-close').hide();
        $('.confirmDownloadModalContent').text('Do you want to download the leads ?');//download the leads
        var confirmation=$(this).text();
        var $form = $("#FilterLeadForm");
        $form.attr("action", jsVars.FULL_URL+'/leads/user-leads-downloads');
        $form.attr("target", 'modalIframe');
        var onsubmit_attr = $form.attr("onsubmit");
        $form.removeAttr("onsubmit");
        if($('#downloadConfig').length && $('#downloadConfig').val()==1){
            $('#confirmDownloadYes').on('click',function(e){
                e.preventDefault();
                $('#ConfirmDownloadPopupArea').modal('hide');
                var type = 'leads'+$("#export_type").val();
                $("#export_lead").val(type);
                var requestType=$('#requestType').val();
//                var data = $form.serializeArray();
                var data=[];
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
                // return;
                $form.ajaxSubmit({ 
                    url: jsVars.FULL_URL+'/leads/user-leads-downloads',
                    type: 'post',
                    data : data,
                    dataType:'json', 
                    headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                    success:function (response){
                        if(response.error != '') {
                            if(response.error == 'session_logout') {
                                window.location.href = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                            } else if(response.error == 'invalid_request') {
                                alertPopup('Something went wrong','error');
                            } else if(response.error == 'search_mandatory') {
                                alertPopup('Please Search Leads.','error');
                            } else {
                                alertPopup(response.error,'error');
                            }
                        } else {
                            if(requestType!='undefined'){
                                $('#muliUtilityPopup').find('#alertTitle').html('Download Success');
                                $('#dynamicMessage').html('Note: Downloaded data will be sorted by (Descending) User registration date.');
                                $('#muliUtilityPopup').modal('show');
                                if(type==='leadsexcel'){
                                    $('#downloadListing').hide();
                                    $('#downloadListingExcel').show();
                                } else {
                                    $('#downloadListing').show();
                                    $('#downloadListingExcel').hide();
                                }

                                $('#muliUtilityPopup .close').addClass('npf-close');
                            }
                        }
                        $('#addRemoveColumnModal').modal('hide');
                    }
                });
                $form.attr("onsubmit", onsubmit_attr);
                $form.removeAttr("target");
            }); 
        }else{
            $form.submit();
            $form.attr("onsubmit", onsubmit_attr);
            $form.removeAttr("target"); 
        }
    });
    $('#myModal').on('hidden.bs.modal', function () {
        $("#modalIframe").html("");
        $("#modalIframe").attr("src", "");
    });
}

function getCompaignsSource(publisher) {
    var registration_instance = $("select[name='filter[registration_instance]']").val();
    if(registration_instance == ''){
        registration_instance = 'pri_register';
    }

    publisher_val = (typeof publisher ==="undefined"&& publisher>0) ? publisher : $('select[name="filter[campu|publisher_id]"]').val();
    var college_id = $('select#user_college_id').val();
    if(typeof $("select[name='filter[campu|source_value][]']").html("")[0] !== 'undefined'){
        $("select[name='filter[campu|source_value][]']").html("")[0].sumo.reload();
    }
    if(typeof $("select[name='filter[campu|medium_value][]']").html("")[0] !== 'undefined'){
        $("select[name='filter[campu|medium_value][]']").html("")[0].sumo.reload();
    }
    if(typeof $("select[name='filter[campu|name_value][]']").html("")[0] !== 'undefined'){
        $("select[name='filter[campu|name_value][]']").html("")[0].sumo.reload();
    }
    
    var trafficChannelVal = '';
    if($("select[name='filter[campu|traffic_channel]']").length >= 1){
        trafficChannelVal = $("select[name='filter[campu|traffic_channel]']").val();
    } else if($("select[name='filter[campu|sec_traffic_channel]']").length >= 1){
        trafficChannelVal = $("select[name='filter[campu|sec_traffic_channel]']").val();
    }else if($("select[name='filter[campu|ter_traffic_channel]']").length >= 1){
        trafficChannelVal = $("select[name='filter[campu|ter_traffic_channel]']").val();
    }
    
    if (typeof publisher_val == "undefined" || $.trim(publisher_val).length <= 0 || typeof trafficChannelVal == "undefined" || $.trim(trafficChannelVal).length <= 0) {
        return false;
    }
    
    $.ajax({
        url: '/campaign-manager/getSourceMediumName',
        type: 'post',
        dataType: 'html',
        async: false,
        data: {'publisherId': publisher_val, 'collegeId': college_id, 'trafficChannel':trafficChannelVal,'instanceType':registration_instance},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () { 
           showLoader();
        },
        complete: function () {
            $("select[name='filter[campu|source_value][]']")[0].sumo.reload();
            hideLoader();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                if(typeof responseObject.data.sourceList === "object"){
                    var sourceList    = responseObject.data.sourceList;
                    $.each(sourceList, function (index, item) {
                        $("select[name='filter[campu|source_value][]']").append('<option value="'+index+'">'+item+'</option>');
                    });
                    unsetLoadListVar();
                }
            }else{
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
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

function getCompaignsMedium(source,publisher) {
    var registration_instance = $("select[name='filter[registration_instance]']").val();
    if(registration_instance == ''){
        registration_instance = 'pri_register';
    }
    publisher_val = (typeof publisher ==="undefined"&& publisher>0) ? publisher : $('select[name="filter[campu|publisher_id]"]').val();
    var college_id = $('select#user_college_id').val();
    
    if(typeof $("select[name='filter[campu|medium_value][]']").html("")[0] !== 'undefined'){
        $("select[name='filter[campu|medium_value][]']").html("")[0].sumo.reload();
    }
    if(typeof $("select[name='filter[campu|name_value][]']").html("")[0] !== 'undefined'){
        $("select[name='filter[campu|name_value][]']").html("")[0].sumo.reload();
    }
    
    var trafficChannelVal = '';
    if($("select[name='filter[campu|traffic_channel]']").length >= 1){
        trafficChannelVal = $("select[name='filter[campu|traffic_channel]']").val();
    } else if($("select[name='filter[campu|sec_traffic_channel]']").length >= 1){
        trafficChannelVal = $("select[name='filter[campu|sec_traffic_channel]']").val();
    }else if($("select[name='filter[campu|ter_traffic_channel]']").length >= 1){
        trafficChannelVal = $("select[name='filter[campu|ter_traffic_channel]']").val();
    }
    
    if (typeof source == "undefined" || $.trim(source).length <= 0 || typeof publisher_val == "undefined" || $.trim(publisher_val).length <= 0 || typeof trafficChannelVal == "undefined" || $.trim(trafficChannelVal).length <= 0) {
        return false;
    }
    
    $.ajax({
        url: '/campaign-manager/getSourceMediumName',
        type: 'post',
        dataType: 'html',
        async: false,
        data: {'publisherId': publisher_val, 'collegeId': college_id, 'trafficChannel':trafficChannelVal,'instanceType':registration_instance,source:source},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () { 
           showLoader();
        },
        complete: function () {
            $("select[name='filter[campu|medium_value][]']")[0].sumo.reload();
            hideLoader();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                if(typeof responseObject.data.mediumList === "object"){
                    var mediumList    = responseObject.data.mediumList;
                    $.each(mediumList, function (index, item) {
                        $("select[name='filter[campu|medium_value][]']").append('<option value="'+index+'">'+item+'</option>');
                    });
                }
            }else{
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    console.log(responseObject.message);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function getCompaignsName(medium,publisher) {
    var registration_instance = $("select[name='filter[registration_instance]']").val();
    if(registration_instance == ''){
        registration_instance = 'pri_register';
    }
    publisher_val = (typeof publisher ==="undefined"&& publisher>0) ? publisher : $('select[name="filter[campu|publisher_id]"]').val();
    var college_id = $('select#user_college_id').val();
    
    if(typeof $("select[name='filter[campu|name_value][]']").html("")[0] !== 'undefined'){
        $("select[name='filter[campu|name_value][]']").html("")[0].sumo.reload();
    }
    
    var trafficChannelVal = '';
    if($("select[name='filter[campu|traffic_channel]']").length >= 1){
        trafficChannelVal = $("select[name='filter[campu|traffic_channel]']").val();
    } else if($("select[name='filter[campu|sec_traffic_channel]']").length >= 1){
        trafficChannelVal = $("select[name='filter[campu|sec_traffic_channel]']").val();
    }else if($("select[name='filter[campu|ter_traffic_channel]']").length >= 1){
        trafficChannelVal = $("select[name='filter[campu|ter_traffic_channel]']").val();
    }
    
    if (typeof medium == "undefined" || $.trim(medium).length <= 0 || typeof publisher_val == "undefined" || $.trim(publisher_val).length <= 0 || typeof trafficChannelVal == "undefined" || $.trim(trafficChannelVal).length <= 0) {
        return false;
    }
    
    $.ajax({
        url: '/campaign-manager/getSourceMediumName',
        type: 'post',
        dataType: 'html',
        async: false,
        data: {'publisherId': publisher_val, 'collegeId': college_id, 'trafficChannel':trafficChannelVal,'instanceType':registration_instance,medium:medium},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () { 
           showLoader();
        },
        complete: function () {
            $("select[name='filter[campu|name_value][]']")[0].sumo.reload();
            hideLoader();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                if(typeof responseObject.data.campaignNameList === "object"){
                    var campaignNameList    = responseObject.data.campaignNameList;
                    $.each(campaignNameList, function (index, item) {
                        $("select[name='filter[campu|name_value][]']").append('<option value="'+index+'">'+item+'</option>');
                    });
                }
            }else{
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    console.log(responseObject.message);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/*
 * function user for tigger call
 * attrtype means id or class
 * attrname  id or classs name
 * NPF-1211 10.3 || LMS & Application Manager revamp
 */
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
/*
 * publisher selected on source,medium,name checked and uncheck checkbox
 * NPF-1211 10.3 || LMS & Application Manager revamp
 */

function getRangeWiseUserRegister() {
    var councellor_id = 0;
    var college_id = $('#user_college_id').val();
    var range_value = $('#final-registration-date').val();
    var range_type_view = $('.range-tab-active a.active').text();
    if($('#councellor_id').length>0){
        councellor_id = $('#councellor_id').val();
    }
    
    $.ajax({
        url: '/leads/userAjaxLineChartGraph',
        type: 'post',
        dataType: 'json',
        data: {'college_id': college_id, 'range_value': range_value, 'range_type_view': range_type_view,councellor_id:councellor_id},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        async:false,
        beforeSend: function () {showLoader();},
        complete: function () {hideLoader();},
        success: function (json) {
            if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                window.location.href = json['redirect'];
            } else if (typeof json['success'] != 'undefined' && json['success'] == 200) {
                json['pdf_center'] =  'Date Range - '+$('#final-registration-date').val().replace(',', ' to ');;
                json['pdf_h3'] = 'Applications Trend - '+ $('.range-tab-active a.active').text();
                makeLinearGraph(json);
                if(json['content'].length != 0) {
                    $('#line-chart-graph').siblings('.graph-footer-msg').remove();
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function hideChartGraph() {
    $('#table-data-view').show();
    $('#snapshot-data-view').hide();
    $('#parent-graph-tab li').removeClass('active');
    $('#parent-graph-tab li:first').addClass('active');
    $('#line-chart-graph').html("");
    $("#stage-wise-chart-graph").html("");
    $("#score-wise-chart-graph").html("");
//    $('#publisher-wise-chart-graph').html("");
    $('#snapshot-data-view > .tab-content').html("");
    $('.country_selected_id').text("");
}
/*
 * this function use for get publisher  list by traffic channel select campain option
 * NPF-1211 10.3 || LMS & Application Manager revamp
 */

function getPublisherList(tchannel) {
    var college_id = $('#user_college_id').val();
    var instance_val = $("select[name='filter[registration_instance]']").val();
    if(instance_val == ''){
        instance_val = 'pri_register';
    }
    $('#publisher_filter').html('<option value="">Publisher/Referrer</option>');
    $.ajax({
        url: '/campaign-manager/get-publisher-list',
        type: 'post',
        dataType: 'html',
        async:false,
        beforeSend: function () {showLoader();},
        complete: function () {                 
            $('#publisher_filter').trigger('chosen:updated');
            hideLoader();
        },
        data: {'college_id': college_id, 'traffic_channel': tchannel, 'instance_val':instance_val},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                if(typeof responseObject.data.sourceList === "object"){
                    var sourceList    = responseObject.data.sourceList;
                    $.each(sourceList, function (index, item) {
                        $('#publisher_filter').append('<option value="'+index+'">'+item+'</option>');
                    });
                    
                   unsetLoadListVar();
                }
            }else{
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
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

function getStateWiseUserRegister() {
    var college_id = $('#user_college_id').val();
    var range_value = $('#final-registration-date').val();
    var councellor_id = 0;
     if($('#councellor_id').length>0){
        councellor_id = $('#councellor_id').val();
    }
    
    $('.state-wise-container > .tab-content').html('');
    $('.state-wise-container .country_selected_id').text('');
    if ($('.parent-graph-tab li a.state-wise-container').hasClass('country')) {
        var findParam = 'country';
    } else if ($('.parent-graph-tab li a.state-wise-container').hasClass('state')) {
        var findParam = 'state';
    } else if ($('.parent-graph-tab li a.state-wise-container').hasClass('city')) {
        var findParam = 'city';
    }
    if (typeof findParam != 'undefined') {
        $.ajax({
            url: '/leads/ajaxStateWiseData',
            type: 'post',
            dataType: 'json',
            data: {'college_id': college_id, 'range_value': range_value, 'type': findParam,councellor_id:councellor_id},
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            async:false,
            beforeSend: function () {showLoader();},
            complete: function () {hideLoader();},
            success: function (json) {
                if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                    window.location.href = json['redirect'];
                } else if (typeof json['success'] != 'undefined' && json['success'] == 200) {
                    json['pdf_center'] =  'Date Range - '+$('#final-registration-date').val().replace(',', ' to ');
                    makePieChart(json);
                    if(json['content'].length != 0) {
                        $('#country-wise-download').siblings('.graph-footer-msg').remove();
                        $('#country-wise-download').after('<div class="graph-footer-msg">* Click on the Country/State to view corresponding city-wise chart</div>');
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    } else {
        console.log('missmatch data');
        hideLoader();
    }
}

function getStageWiseUserRegister() {
    var councellor_id = 0;
    var college_id = $('#user_college_id').val();
    if($('#councellor_id').length>0){
        councellor_id = $('#councellor_id').val();
    }
    //var range_value = $('#final-registration-date').val();
    $('#stage-wise-chart-graph').html('');
    $.ajax({
        url: '/leads/ajaxStageWiseLeads',
        type: 'post',
        dataType: 'json',
        data: {'collegeId': college_id,councellor_id:councellor_id},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        async:false,
        beforeSend: function () {showLoader();},
        complete: function () {hideLoader();},
        success: function (json) {
            if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                window.location.href = json['redirect'];
            } else if (typeof json['success'] != 'undefined' && json['success'] == 200) {
                if( typeof json['content']=='object' && json['content'].length > 1){
                    makeBarGraph(json);
                }else{
                    $('#stage-wise-chart-graph').html('<img src="/img/line_no_data_image.jpg">')
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getScoreWiseUserRegister() {
    var councellor_id = 0;
    var college_id = $('#user_college_id').val();
    
    if($('#councellor_id').length>0){
        councellor_id = $('#councellor_id').val();
    }
    $('#score-wise-chart-graph').html('');
    $.ajax({
        url: '/leads/ajaxScoreWiseLeads',
        type: 'post',
        dataType: 'json',
        data: {'collegeId': college_id,councellor_id:councellor_id},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        async:false,
        beforeSend: function () {showLoader();},
        complete: function () {hideLoader();},
        success: function (json) {
            if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                window.location.href = json['redirect'];
            } else if (typeof json['success'] != 'undefined' && json['success'] == 200) {
                if( typeof json['content']=='object' && json['content'].length > 1){
                    makeColumnBarGraph(json);
                }else{
                    $('#score-wise-chart-graph').html('<img src="/img/line_no_data_image.jpg">')
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function checkCollegeConfigRegistration(college_id) {
    if (college_id.length <= 0) {
        college_id = 0;//blank colleage id
    }
    if ($('.parent-graph-tab li a.state-wise-container').hasClass('country')) {
        $('.parent-graph-tab li a.state-wise-container').removeClass('country');
    } else if ($('.parent-graph-tab li a.state-wise-container').hasClass('state')) {
        $('.parent-graph-tab li a.state-wise-container').removeClass('state');
    } else if ($('.parent-graph-tab li a.state-wise-container').hasClass('city')) {
        $('.parent-graph-tab li a.state-wise-container').removeClass('city');
    }

    $.ajax({
        url: '/leads/checkCollegeConfigRegistration',
        type: 'post',
        dataType: 'json',
        data: {'college_id': college_id,'downloadtype':'leads'},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        async:false,
        beforeSend: function () {showLoader();},
        complete: function () {hideLoader();},
        success: function (json) {
            if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                window.location.href = json['redirect'];
            } else if (typeof json['status'] != 'undefined' && json['status'] == 200 && typeof json['existvalue'] != 'undefined') {
                if (json['existvalue']['key'] == 'country') {
//                    $('.parent-graph-tab li a.state-wise-container').text('Country-wise Registration');
                    $('.parent-graph-tab li a.state-wise-container').parent().show();
                    $('.parent-graph-tab li a.state-wise-container').addClass('country');
                } else if (json['existvalue']['key'] == 'state') {
//                    $('.parent-graph-tab li a.state-wise-container').text('State-wise Registration');
                    $('.parent-graph-tab li a.state-wise-container').parent().show();
                    $('.parent-graph-tab li a.state-wise-container').addClass('state');
                } else if (json['existvalue']['key'] == 'city') {
//                    $('.parent-graph-tab li a.state-wise-container').text('City-wise Registration');
                    $('.parent-graph-tab li a.state-wise-container').parent().show();
                    $('.parent-graph-tab li a.state-wise-container').addClass('city');
                } else {
                    if ($('.parent-graph-tab li a.state-wise-container').length) {
                        $('.parent-graph-tab li a.state-wise-container').parent().hide();
                    }
                }
            } else {
                if ($('.parent-graph-tab li a.state-wise-container').length) {
                    $('.parent-graph-tab li a.state-wise-container').parent().hide();
                }
            }
            if(typeof json['registration_date'] != 'undefined'){
                $('#final-registration-date').val(json['registration_date']);
                $('#default_date').text(json['registration_date']);
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
/*
 * select filter for get value form url
 */
function filterSelectFromUrl() {
    //get filter from url varaibles
    var filterOption = jsVars.filterOption;//only all filter key
    var url_filter = jsVars.url_filter;// all filter array with key=>value
    //console.log(jQuery('#filter_li_list li').find('input'));
    jQuery('#filter_li_list li').find('input').each(function () {
        var v = jQuery(this).val();//values
        for (var i = 0; i < filterOption.length; i++) {
            if (v.indexOf(filterOption[i]) >= 0) {//check key match
                if (typeof filterOption[i] != "undefined" && filterOption[i] != '') {//check 
                    this.checked = true;
                } //check 
            }//end if 
        }
    });
    
    //If s_lead_status is exist and greater than 0 then unset all selected value and set value which is come from url selected
    if(typeof url_filter['s_lead_status'] !== 'undefined' && url_filter['s_lead_status'] >0) {
        $('select#s_lead_status')[0].sumo.unSelectAll();        
        $('select#s_lead_status')[0].sumo.selectItem(url_filter['s_lead_status']);
        $('select#s_lead_status')[0].sumo.reload();
    } 

    createUserFilter();// call apply button
    //assign value
    var get_traffic_channel = '';
    var get_publisher_id = '';
    var get_medium_value = '';
    var get_source_value = '';
    var college_id = $('select#user_college_id').val();
	//only for refrel url
    if(typeof url_filter['campu|traffic_channel'] != 'undefined' && url_filter['campu|traffic_channel'] > 0){
        get_traffic_channel = url_filter['campu|traffic_channel'];
    }else if(typeof url_filter['campu|sec_traffic_channel'] != 'undefined' && url_filter['campu|sec_traffic_channel'] > 0){
        get_traffic_channel = url_filter['campu|sec_traffic_channel'];
    }else if(typeof url_filter['campu|ter_traffic_channel'] != 'undefined' && url_filter['campu|ter_traffic_channel'] > 0){
        get_traffic_channel = url_filter['campu|ter_traffic_channel'];
    }    
        
    if (get_traffic_channel == 1 || get_traffic_channel == 2 || get_traffic_channel == 7 || get_traffic_channel == 8 || get_traffic_channel == 9) {//campain option 
        getPublisherList(get_traffic_channel);
    }else if( get_traffic_channel == 3 || get_traffic_channel == 4 || get_traffic_channel == 5 ){
        getReferrerList(get_traffic_channel );
    }else if(get_traffic_channel == 6){
        getDirectSourceList(college_id);
    }else if(get_traffic_channel == 10){
        getChatSourceList(college_id);
    }
    var publisherValue  = 0;
    if (filterOption.length > 0) {//check length of filter array
        for (var i = 0; i < filterOption.length; i++) {
            var key = 'filter[' + filterOption[i] + ']';
            if ($('input[name="' + key + '"]').length) {//text box
                $('input[name="' + key + '"]').val(url_filter[filterOption[i]]);
            } else if ($('select[name="' + key + '"]').length) {//dropdown
                if(filterOption[i] == 'ud|state_id') {
                    if($('select[name="' + key + '"]').find("option").length < 2 && $('select[name="filter[ud|country_id]"]').length>0){
                        GetChildByMachineKey($('select[name="filter[ud|country_id]"]').val(),"StateId","State",college_id);
                    }
                }else if(filterOption[i] == 'ud|specialization_id') {
                    if($('select[name="' + key + '"]').find("option").length < 2 && $('select[name="filter[ud|course_id]"]').length>0){
                        GetChildByMachineKey($('select[name="filter[ud|course_id]"]').val(),"SpecialisationId","Specialisation",college_id);
                    }
                }else if(filterOption[i] == 'campu|publisher_id'){
                    publisherValue  = url_filter[filterOption[i]];
                }                
                $('select[name="' + key + '"]').val(url_filter[filterOption[i]]);
                if(filterOption[i] == 'registration_instance') {
                    if(url_filter[filterOption[i]] == 'sec_register'){
                        $(".formAreaCols .u-lead_type").attr('name','filter[acd|sec_lead_type]');
                        $(".formAreaCols .u-traffic_channel").attr('name','filter[campu|raffic_channel]');
                    } else if(url_filter[filterOption[i]] == 'ter_register'){
                        $(".formAreaCols .u-lead_type").attr('name','filter[acd|ter_lead_type]');
                        $(".formAreaCols .u-traffic_channel").attr('name','filter[campu|traffic_channel]');
                    } else if(url_filter[filterOption[i]] == 'pri_register'){
                        $(".formAreaCols .u-lead_type").attr('name','filter[acd|lead_type]');
                        $(".formAreaCols .u-traffic_channel").attr('name','filter[campu|traffic_channel]');
                    }
                }
            }
            else if ($('select[name="' + key + '[]"]').length) {// multi select like lead stages
                //url_filter[filterOption[i]] should be array
                if(filterOption[i] == 'ud|city_id') {
                    if($('select[name="' + key + '[]"]').find("option").length < 2 && $('select[name="filter[ud|state_id]"]').length>0){
                        GetChildByMachineKey($('select[name="filter[ud|state_id]"]').val(),"CityId","City",college_id);
                        if( !$.isArray(url_filter[filterOption[i]]) ){
                            url_filter[filterOption[i]] = [parseInt(url_filter[filterOption[i]])];
                        }
                    }
                }else if (filterOption[i] == "campu|source_value") {//get source_value list
                    getCompaignsSource(publisherValue);
                }else if (filterOption[i] == "campu|medium_value") {//get medium_value list
                    get_source_value = $("select[name='filter[campu|source_value][]']").val();
                    getCompaignsMedium(get_source_value,publisherValue);
                }else if (filterOption[i] == "campu|name_value") {//get medium_value lis
                    get_medium_value = $("select[name='filter[campu|medium_value][]']").val();
                    getCompaignsName(get_medium_value,publisherValue);
                }
                $('select[name="' + key + '[]"] option').each( function(index) {
                    if ($.inArray(parseInt($(this).val()), url_filter[filterOption[i]]) >= 0) {
                        $('select[name="' + key + '[]"]')[0].sumo.selectItem(index);
                    } else if($.inArray($(this).val(), url_filter[filterOption[i]]) >= 0){
                        $('select[name="' + key + '[]"]')[0].sumo.selectItem(index);
                    }
                });
                $('select[name="' + key + '[]"]')[0].sumo.reload();
            }
            else if(key=='filter[acd|lead_type]'){
                // because lead_type name is changed in sec and ter instance
                var leadTypename = $(".formAreaCols .u-lead_type").attr('name');
                if($('select[name="' + leadTypename + '"]').length){
                    $('select[name="' + leadTypename + '"]').val(url_filter[filterOption[i]]);
                }
            }else if(key=='filter[form_id]'){
                // because lead_type name is changed in sec and ter instance
                if($('select[name="form_id"]').length){
                    $('select[name="form_id"]').val(url_filter[filterOption[i]]);
                }
            }
            $('select').trigger('chosen:updated');//update dropdown
        }
    }
//    showHideWidgetFilter();
    callTrigger("id", "search_btn_hit");//call search button tigger
}

function graphMakeDisabledFields(type) {
    if (type == 'show') {
        $('#if_record_exists #items-no-show').removeAttr('disabled');
        $('#if_record_exists #sort_order').removeAttr('disabled');
        $('#if_record_exists .btn-for-a-view').removeAttr('disabled');
        $('#if_record_exists .action-btn-select button').removeAttr('disabled');
        $('.hide_extraparam').show();
    } else if (type == 'hide') {
        $('#if_record_exists #items-no-show').attr('disabled', 'disabled');
        $('#if_record_exists #sort_order').attr('disabled', 'disabled');
        $('#if_record_exists .btn-for-a-view').attr('disabled', 'disabled');
        $('#if_record_exists .action-btn-select button').attr('disabled', 'disabled');
        $('.hide_extraparam').hide();
    } else {
        $('.parent-graph-tab li').removeClass('active');
        $('.parent-graph-tab li a').removeClass('active');
        $('.parent-graph-tab li:first').addClass('active');
        $('.parent-graph-tab li:first a').addClass('active');

        $('.graph-container li').removeClass('active');
        $('.graph-container li a').removeClass('active');
        $('.graph-container li:first').addClass('active');
        $('.graph-container li:first a').addClass('active');
        $('.graph-container').show();
        $('#if_record_exists').hide();
        $('#country-wise-chart-graph, #state-wise-chart-graph, #city-wise-chart-graph, #country_selected_id, #line-chart-graph, #stage-wise-chart-graph, #score-wise-chart-graph').empty();
//        $('.parent-graph-tab .registration-container').text('Day-wise Registrations');
        $('.state-wise-container h3').remove();
        $('.graph-footer-msg').remove();
    }
    $('.chosen-select').trigger('chosen:updated');
}

function GetChildByMachineKey(key, ContainerId, Choose, college_id, parentContainerId, selectedId, isRegistrationSection,isQuickLead, ...args){
    var multi_select_city = $("#multi_select_city").val();
    var labelMappingArray = {'City' : 'city_id','State':'state_id','Specialization':'specialization_id','District' : 'district_id'};
    var childContainerId = ContainerId;

    if(ContainerId == 'CourseId' && typeof isQuickLead === 'undefined'){
        if($("#FilterLeadForm #"+ContainerId).length == 0 ) {
            ContainerId = 'ud\\|course_id';
        }
    }

    if(typeof ContainerId !== "undefined" && $("#"+ContainerId).length){
        if(typeof college_id == 'undefined' || college_id == ""){
            college_id = $.trim($("#user_college_id").val());
        }

        /**************** For Registration Related Dependent Dropdown Code Start Here *********************/
        var isRegistration = false;
        if(typeof isRegistrationSection !== 'undefined' && isRegistrationSection == true) {
           isRegistration = true;
        }

        if(typeof args[1] !== 'undefined' && args[1] == true) {
            var isDependentCourseField = true;
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


                    if(childFieldId == 'CourseId' && typeof isQuickLead === 'undefined'){
                        if($("#FilterLeadForm #"+childFieldId).length == 0 ) {
                            childFieldId = 'ud\\|course_id';

                        }
                    }else if(childFieldId == 'SpecialisationId' && typeof isQuickLead === 'undefined'){
                        if($("#FilterLeadForm #"+childFieldId).length == 0 ) {
                            childFieldId = 'SpecializationId';
                        }
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
                            if($.inArray(childFieldId,['ud\\|course_id','CourseId','SpecialisationId']) >= 0 &&
                                    ((typeof isQuickLead === 'undefined') || (typeof isDependentCourseField !== 'undefined' && isDependentCourseField == true))
                               ){
                                defaultOption += '<option value="0">' + labelname + jsVars.notAvailableText +' </option>';
                            }
                            if(typeof isQuickLead !== 'undefined' && isQuickLead == true) {
                                $('#addQuickLeadForm #'+childFieldId).html(defaultOption);
                            } else {
                                $('#'+childFieldId).html(defaultOption);
                            }
                        }
                    }
                });

                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                $('.chosen-select').trigger('chosen:updated');
            });
        }

        /********** Special case handle For Dependent dropdown ****************/
        if(typeof args[0] !== 'undefined' && args[0] == true) {
            isRegistration = true;
        }

        /********** Special case handle For Dependent dropdown ****************/

        /**************** For Registration Related Dependent Dropdown Code End Here *********************/
        if(typeof key !== "undefined" && key !== '') {
            $.ajax({
                url: '/common/GetChildByMachineKeyForRegistration',
                type: 'post',
                dataType: 'json',
                async: false,
                data: {key:key,college_id:college_id, childType:Choose, fetchType:'leads', cf:'lm-user-profile-back'},
    //            headers: {
    //                "X-CSRF-Token": jsVars._csrfToken
    //            },
                success: function (json) {
                    if(json['redirect']){
                        location = json['redirect'];
                    }
                    if(json['error']){
                        alertPopup(json['error'],'error');
                    }
                    else if(json['success']){
                        if(ContainerId != 'SpecialisationId'){
                            if($.inArray(Choose,['City','State','Specialization','District']) >= 0 ){
                                if(typeof json['labelMapping'][labelMappingArray[Choose]] == 'undefined'){
                                    json['labelMapping'][labelMappingArray[Choose]] = Choose;
                                }
                                var html = '<option value="">Registered '+json['labelMapping'][labelMappingArray[Choose]]+'</option>';
                            }else{

                                if((typeof Choose == 'undefined' || Choose == '')  && typeof $("#"+ContainerId).data('label') !== 'undefined') {
                                    Choose = $("#"+ContainerId).data('label');
                                }
                                var html = '<option value="">Registered '+Choose+'</option>';
                            }
                        }else{
                            var html = '<option value="">'+json['labelMapping']['specialization_id']+'</option>';
                                html += '<option value="0"> '+json['labelMapping']['specialization_id']+jsVars.notAvailableText+'</option>';
                        }
                        if((Choose == 'State') && ($('#CityId').length > 0))
                        {
                            if(typeof parentContainerId == 'undefined' || parentContainerId == ""){
                                $('#CityId').html('<option value="">Registered '+json['labelMapping']['city_id']+'</option>');
                            }else{
                                $('#'+parentContainerId +' #CityId').html('<option value="">Registered '+json['labelMapping']['city_id']+'</option>');
                            }
                        }
                        if ((Choose == 'City') && ($('#CityId').length > 0) && (typeof multi_select_city!='undefined') && (multi_select_city=='yes')){
                              html = '<option value="0"> '+json['labelMapping']['city_id']+jsVars.notAvailableText+'</option>';

                        }else if((Choose == 'City') && ($('#CityId').length > 0)){
                                if(typeof parentContainerId == 'undefined' || parentContainerId == ""){
                                    $('#CityId').removeAttr('disabled');
                                }else{
                                    $('#'+parentContainerId +' #CityId').removeAttr('disabled');
                                }
                                html = '<option value="0"> '+json['labelMapping']['city_id']+jsVars.notAvailableText+'</option>';
                        }

                        if((Choose == 'State') && ($('#StateId').length > 0)){
                            html += '<option value="0"> '+json['labelMapping']['state_id']+jsVars.notAvailableText+'e</option>';
                        }
                         if((Choose == 'State') && ($('#CityId').length > 0))
                        {
                            $('#CityId').html('<option value="0"> '+json['labelMapping']['city_id']+jsVars.notAvailableText+'e</option>');
                            $('#CityId')[0].sumo.reload();
                        }
                        if((Choose == 'District') && ($('#DistrictId').length > 0))
                        {
                            if(json['labelMapping']['district_id'] == 'undefined'){
                                json['labelMapping']['district_id'] = 'District';
                            }

                            html += '<option value="0"> '+json['labelMapping']['district_id']+jsVars.notAvailableText+'</option>';
                            //reset city also
                            if ($('#CityId').length > 0) {
                                $('#CityId').html('<option value="0"> '+json['labelMapping']['city_id']+jsVars.notAvailableText+'</option>');
                                $('#CityId')[0].sumo.reload();
                            }
                        }

                        var skipColonField = ['CourseId','SpecialisationId'];
                        if($.inArray(ContainerId,['CourseId','ud\\|course_id']) >= 0 &&
                            ( (typeof isQuickLead === 'undefined') || (typeof isDependentCourseField !== 'undefined' && isDependentCourseField == true) )

                            ) {
                            if((typeof Choose == 'undefined' || Choose == '')  && typeof $("#"+ContainerId).data('label') !== 'undefined') {
                                Choose = $("#"+ContainerId).data('label');
                            }
                            html += '<option value="0"> '+Choose+jsVars.notAvailableText+'</option>';
                        }

                        if(json['CategoryOptions']){
                            html += json['CategoryOptions'];
                        } else {
                            for(var key in json['list'])
                            {
                                optionvalue = key;
                                if(isRegistration && ($.inArray(ContainerId,skipColonField) < 0)) {
                                    optionvalue = key+';;;'+json['list'][key];
                                }
                                html += '<option value="'+optionvalue+'">'+json['list'][key]+'</option>';
                            }                            
                        }

                        if(typeof isQuickLead !== 'undefined' && isQuickLead ==true) {
                            $('#addQuickLeadForm #'+ContainerId).html(html);
                        } else {
                            $('#'+ContainerId).html(html);
                        }

                        //FOr selected city id
                        if(typeof selectedId !== 'undefined' && selectedId !=''){
                            if((Choose == 'State') && ($('#StateId').length > 0)){
                                $('#StateId').val(selectedId);
                            }else if((Choose == 'District') && ($('#DistrictId').length > 0)){
                                $('#DistrictId').val(selectedId);
                            }else if((Choose == 'City') && ($('#CityId').length > 0)){
                                $('#CityId').val(selectedId);
                            }else if(($('#'+ContainerId).length > 0)){
                                $('#'+ContainerId).val(selectedId);
                            }
                        }
                        if ((Choose == 'City') && ($('#CityId').length > 0) && (typeof multi_select_city!='undefined')  && (multi_select_city=='yes')){
                          $('#CityId')[0].sumo.reload();
                        }

                        //If result not return
                        if(json['list'].length == 0 && typeof $("#"+ContainerId).data('label') !== 'undefined'){
                            var defaultOption ='<option value="">'+$("#"+ContainerId).data('label')+'</option>';
                            $("#"+ContainerId).html(defaultOption);
                        }

                        $('.chosen-select').chosen();
                        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                        $('.chosen-select').trigger('chosen:updated');
                    }
                },
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
//        createInput(elem,col_class);
        if(typeof ContainerId != 'undefined' && ContainerId == 'StateId') {
            var option = $('<option></option>').attr("value", "").text("Registered State");
            $("#"+ContainerId).empty().append(option);
            $('.chosen-select').trigger('chosen:updated');
            $("#"+ContainerId).trigger('change');
        }
        if(typeof ContainerId != 'undefined' && ContainerId == 'DistrictId') {
            var option = $('<option></option>').attr("value", "").text("Registered District");
            $("#"+ContainerId).empty().append(option);
            $('.chosen-select').trigger('chosen:updated');
            $("#"+ContainerId).trigger('change');
        }
        if(typeof ContainerId != 'undefined' && ContainerId == 'CityId') {
//            var option = $('<option></option>').attr("value", "").text("");
//            $("#"+ContainerId).empty().append(option);
            $("#"+ContainerId).empty();
             if ( typeof multi_select_city != 'undefined'  && multi_select_city == 'yes'){
                $('#CityId')[0].sumo.reload();
            }else{
                $('.chosen-select').trigger('chosen:updated');
            }
        }
        // for quick lead registration field
        if(typeof ContainerId != 'undefined' && ContainerId == 'addQuickLeadDiv #StateId') {
            var option = $('<option></option>').attr("value", "").text("Registered State");
            $("#"+ContainerId).empty().append(option);
            $('.chosen-select').trigger('chosen:updated');
            $("#"+ContainerId).trigger('change');
        } if(typeof ContainerId != 'undefined' && ContainerId == 'addQuickLeadDiv #CityId') {
            var option = $('<option></option>').attr("value", "").text("Registered City");
            $("#"+ContainerId).empty().append(option);
            $('.chosen-select').trigger('chosen:updated');
        } if(typeof ContainerId != 'undefined' && ContainerId == 'SpecialisationId') {
            var option = $('<option></option>').attr("value", "").text("Specialization ");
            $("#"+ContainerId).empty().append(option);
            $('.chosen-select').trigger('chosen:updated');
        }
    }
    return false;
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

function getleadCampaignInstance() {
    var college_id = $('#user_college_id').val();
    $('#score-wise-chart-graph').html('');
    $('#listloader').show();
    $.ajax({
        url: '/leads/getCampaignLeadType',
        type: 'post',
        dataType: 'json',
        async: false,
        data: {'collegeId': college_id},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                window.location.href = json['redirect'];
            } else if (typeof json['success'] != 'undefined' && json['success'] == 200) {
                if( typeof json['content']=='object' && json['content'].length > 1){
                    makeBarChartGraph(json);
                }else{
                    $('#lead-campaign-chart-graph').html('<img src="/img/line_no_data_image.jpg">')
                }
            }
            $('#listloader').hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function showAddQuickLeadPopup(){
    
    var college_id = $.trim($("#user_college_id").val());
    if($("#ShowWildCardUserBox").length>0){
        $("#ShowWildCardUserBox").remove();
    }
        
    $.ajax({
        url: '/leads/show_lead_registration_fields',
        type: 'post',
        dataType: 'html',
        data: {'college_id':college_id},
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
                $('#showAddQuickLeadPopUp').trigger('click');
				$('body').addClass('vScrollRemove');
				$('.offCanvasModal').on('hide.bs.modal', function () {
				  $('body').removeClass('vScrollRemove');
				})
                $('.chosen-select').chosen();
                $('.chosen-select').trigger('chosen:updated');
                if($("#ShowWildCardUserBox").length>0){
                    $("#ShowWildCardUserBox").appendTo("body");
                }


            }
            $('[data-toggle="tooltip"]').tooltip();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
}

// this function is used when there is mobile dial country code is selected in form applicant
function filterDialCode() {
    var value = $('#lead_filter_dial_code').val();
    value = value.toLowerCase();    
    $("#lead_ul_dial_code > li").each(function() {
        if ($(this).text().toLowerCase().search(value) > -1) {
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });
}

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
    if($('#user_college_id').val()===''){
        return false;
    }
    var college_id=$('#user_college_id').val();
//    ResetFilterValue();
    ResetFilterUserLeadsValue();
    $('#sort_options').val('');
    $('#savedFilterList').trigger('click');
    $("#user_college_id").val(college_id);
    $("#user_college_id").trigger('chosen:updated');
//    $('#CreateLeadStartBtn').hide(); 
    $('.default-txt-view').text('System Default View');
    advanceFilterColumnOptions(college_id,'','changeCollege');
    if(reload_filter_list){
        getSavedFilterList(college_id,'advanceLM','smart_view','smart_view_li_list');
    }
//    checkCollegeConfigRegistration(college_id);
    LoadMoreLeadsUser('reset');

};


function showAgentOtp(userId,college_id){
    if( userId && college_id){
        $("#otp_code").val('');
        $("#otp_error").html("");
        $("#otp_user_id").val(userId);
        $("#otp_college_id").val(college_id);
        
        $('#otpresendlink').show();
        $('#clockdiv').html('');
        $('#clockdiv').hide();
        $('#resend_otp').attr('onclick','return reSendMobileOTP(\''+userId+'\',\''+college_id+'\')');
    }
}


function verifyLeadThroghOTP(){
    $("#otp_error").html("");
    var otp = $.trim($("#otp_code").val());
    if(otp == '' || otp == 'undefined'){
        $("#otp_error").html("Please enter code");
        return false;
    }
    var data  = $("#otpVerifyForm").serializeArray();
    showLoader();
    $.ajax({
        url : "/leads/verifyLeadThroghOtp",
        type : "post",
        data : data,
        dataType : 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        complete : function(){
            hideLoader();
        },
        success : function (responseObject){
            if (responseObject.redirect === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if (typeof responseObject.error != 'undefined'){
                $("#otp_error").html(responseObject.error);
            }
            if(responseObject.status === 'success' ){
                $('.otp_'+responseObject.userId+'_enter_code').hide();
                $("#agentOTPModal").modal('hide');
                alertPopup("Code verified sucessfully",'sucess');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
      
}

/**
 * For Resent Mobile
 * @param {type} college_id
 * @param {type} user_id
 * @returns {Boolean}
 */
function reSendMobileOTP(user_id,college_id){
    /* get csrf token form hidden field */
    var csrfToken = $('form input[name=\'_csrfToken\']').val();
    
    /* hide some field  */
    $('#otpverifylink_a').hide();
    $('#otpresendlink').hide();
    $('#otpverifylink-text').remove();
    $('#otpverifylink').append('<span id="otpverifylink-text">Wait...</span>');
    $('#opt_data').removeAttr('readonly');
    
    $.ajax({
        url: '/leads/resend-mobile-otp',
        type: 'post',
        dataType: 'json',
        data:{'user_id':user_id,'college_id':college_id},
        headers: {'X-CSRF-TOKEN': csrfToken},
        success: function (json) {
            if(json['error']){
                alertPopup(json['error'],'error');
                $('#otpresendlink').show();
                $('#clockdiv').hide();
            }else if(json['success']==200){                
                countdownStart(); /* 30 seconds timer start */
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
    return false;
}

function appendFilterInContainer(finalhtml){
    if($('#filter_elements_html').siblings().children('div:visible').length < 3){
       $('#filter_elements_html').siblings().append(finalhtml);
    }else{
       $('#filter_elements_html').append(finalhtml);
    }
}


function proceedToReassign(){
     $.ajax({
        url: jsVars.reassignLeadLink,
        type: 'post',
        data: {'userId' : currentUserId, 'collegeId':currentCollegeId, 'assignedTo':$("#assignedTo").val(), 'unassignedFrom':$("#unassignedFrom").val(), 'reassignRemark':$("#reassignRemark").val(), moduleName:'lead','applicationReassignCheck':applicationReassignCheck,'queryReassignCheck':queryReassignCheck},
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
            if(responseObject.status==1){
                LoadMoreLeadsUser('reset');                
            }else{
                alertPopup(responseObject.message,'alert');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText,'error');
        }
    });
}

function preCheckBulkReassign(){
    var users   = [];
    $('input:checkbox[name="selected_users[]"]').each(function () {
        if(this.checked){
            users.push(parseInt($(this).val()));
        }
    });
    if($('#select_all:checked').val()=='select_all'){
        var data    = {'userId' : 'all', 'collegeId':$("#user_college_id").val(), 'assignedTo':$("#assignedTo").val(), 'unassignedFrom':$("#unassignedFrom").val(), 'reassignRemark':$("#reassignRemark").val(), moduleName:'lead', 'filters':$("#leadsListFilters").val(),'preCheckBulkReassign':1, 'assignedName':$("#assignedTo option:selected").text()};
    }else{
        var data    = {'userId' : users, 'collegeId':$("#user_college_id").val(), 'assignedTo':$("#assignedTo").val(), 'unassignedFrom':$("#unassignedFrom").val(), 'reassignRemark':$("#reassignRemark").val(), moduleName:'lead','preCheckBulkReassign':1, 'assignedName':$("#assignedTo option:selected").text()};
    }
    if(users.length > 0 || $('#select_all:checked').val()=='select_all'){
         $.ajax({
            url: jsVars.preManualReassignmentCheckLink,
            type: 'post',
            data: data,
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
                    $('#ConfirmPopupReassignCounsellor #confirmTitle').html('Re-assign Lead(s)');
                    $('#ConfirmPopupReassignCounsellor #assignedToCounsellorText').html("Taking this action will re-assign lead(s) to counselor "+$("#assignedTo option:selected").text()+".<br>");
                    $('#ConfirmPopupReassignCounsellor #counsellorNoteText').html("(Disable toggle if only lead has to be re-assigned.)");
                    $('#ConfirmPopupReassignCounsellor #ConfirmMsgBody').removeClass('text-center').addClass('text-left');
                    $('#ConfirmPopupReassignCounsellor').addClass('modalCustom');
                    $('#ConfirmPopupReassignCounsellor #ConfirmMsgBody').addClass('modalScroll');
                    $('#ConfirmPopupReassignCounsellor a#confirmYes').html('OK');
                    $('#ConfirmPopupReassignCounsellor .modal-body button').html('Cancel');
                    $('#ConfirmPopupReassignCounsellor').modal({backdrop: 'static', keyboard: false})
                        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                        e.preventDefault();
                        applicationReassignCheck = $('#ConfirmPopupReassignCounsellor input[name="applicationReassignCheck"]:checked').val();
                        queryReassignCheck = $('#ConfirmPopupReassignCounsellor input[name="queryReassignCheck"]:checked').val();
                        bulkReassignLeads();
                        $('#ConfirmPopupReassignCounsellor').modal('hide');
                });
                }else{
                    bulkReassignLeads();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText,'error');
            }
        });
    }else{
        alertPopup('Please select users.', 'error');
    }
}
function datePickerChangeTrigger(){
    $('.daterangepicker_report_right, .daterangepicker_report_center, .daterangepicker_report').on('apply.daterangepicker',function(){
        is_filter_button_pressed = 0;
    });
}
function changeEventForFilter(){
    $(document).on( "change","#UserSearchArea select, #UserSearchArea input, #filter_li_list input, #search_common",function(){
       is_filter_button_pressed = 0;
    });
}
function dependentFieldSelection(){
    $('.registration_child .filter_create_keys').click(function(){
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

function setDownloadLeadForLPU(collegeId){
    if((collegeId == jsVars.LPU_COLLEGE_ID || collegeId == 524) && jsVars.exportPermission == true){
       
	$(".actions-all").append('<li id="lpu-download"><a onclick="javascript:void(0);" id="modalButtonLPU" href="#" class="modalButtonLPU dropdown-item" data-toggle="modal" data-target="#myModal" href="#">Download Leads LPU</a></li>');
        
    }else{
	if($('.actions-all #lpu-download').length > 0){
             
	    $('.actions-all #lpu-download').remove();
	}
    }
}

function showPopOver(id, stage, last_activity_time, score) {
    $('#lead_'+id).popover({
        container: 'body',
        html: true,
        trigger: 'hover',
        placement: 'right',
        content: '<div class="leadscore__circle"><div><span class="leadscore__title">Score</span><span class="leadscore__data">'+score+'</span></div></div><div class="leadStage__div"><span>Lead Stage:</span> <strong>'+stage+'</strong><br><span>Last Activity</span>: <strong>'+last_activity_time+'</strong></div>',
		template: '<div class="popover quickLead" role="tooltip"><div class="popover-content"></div></div>',
    });
    $('#lead_'+id).popover('show');
}

function unsetLoadListVar(){
    return;
    console.log('ml');
    if(ajaxStatus_LoadMoreLeadsUser == 'not_ready'){
        leadManager.abort(leadManager);
        ajaxStatus_LoadMoreLeadsUser = 'ready';
    }
}

function clickUserRegisterGraphBtn() {
    var rangeVal = $('#final-registration-date').val();
    $('#final-registration-date').siblings('.error').remove();
    $('.state-wise-container h3').remove();
    $('#country-wise-chart-graph, #state-wise-chart-graph, #city-wise-chart-graph, #country_selected_id, #line-chart-graph, #stage-wise-chart-graph, #score-wise-chart-graph').empty();
    if (typeof rangeVal != 'undefined' && rangeVal != "") {
        if ($('.parent-graph-tab li a.active').hasClass('registration-container')) {
            getRangeWiseUserRegister();
        }
        else if ($('.parent-graph-tab li a.active').hasClass('state-wise-container')) {
            $('div.state-wise-container').show();
            getStateWiseUserRegister();
        }
        else if ($('.parent-graph-tab li a.active').hasClass('stage-wise-container')) {
            $('div.stage-wise-container').show();
            getStageWiseUserRegister();
        }
        else if ($('.parent-graph-tab li a.active').hasClass('score-wise-container')) {
            $('div.score-wise-container').show();
            getScoreWiseUserRegister();
        }
        else if ($('.parent-graph-tab li a.active').hasClass('lead-campaign-instance-container')) {
            $('div.lead-campaign-instance-container').show();
            getleadCampaignInstance();
        }
    } else {
        $('#final-registration-date').after('<span class="error">Please select a valid date range.</span>');
    }
}

function rangeTabClick(e) {
    e.preventDefault();
    if($(this).hasClass('daytab')) {
//            $('.parent-graph-tab .registration-container').text('Day-wise Registrations');
    } else if($(this).hasClass('weektab')) {
//            $('.parent-graph-tab .registration-container').text('Week-wise Registrations');
    } else if($(this).hasClass('monthtab')) {
//            $('.parent-graph-tab .registration-container').text('Month-wise Registrations');
    }
    $('.range-tab-active a').removeClass('active');
    $('.range-tab-active li').removeClass('active');
    $(this).parent().addClass('active');
    $(this).addClass('active');
    getRangeWiseUserRegister();
}

function parentGraphTabClick() {
    $("#quickViewDateDiv").show();
    $('.parent-graph-tab li').removeClass('active');
    $('.parent-graph-tab li a').removeClass('active');
    $(this).addClass('active');
    $(this).parent().addClass('active');
    $('.graph-container').hide();
    if ($(this).hasClass('registration-container')) {
        $('div.registration-container').show();
        if ($('#line-chart-graph').is(':empty')) {
            getRangeWiseUserRegister();
        }
    }
    else if ($(this).hasClass('state-wise-container')) {
        $('div.state-wise-container').show();
        if ($('.parent-graph-tab li a.state-wise-container').hasClass('country')) {
            var findParam = 'country';
        } else if ($('.parent-graph-tab li a.state-wise-container').hasClass('state')) {
            var findParam = 'state';
        } else if ($('.parent-graph-tab li a.state-wise-container').hasClass('city')) {
            var findParam = 'city';
        }
        if ($('#'+findParam+'-wise-chart-graph').is(':empty')) {
            getStateWiseUserRegister();
        }
    }
    else if ($(this).hasClass('stage-wise-container')) {
        $("#quickViewDateDiv").hide();
        $('div.stage-wise-container').show();
        if ($('#stage-wise-chart-graph').is(':empty')) {
            getStageWiseUserRegister();
        }
    }
    else if ($(this).hasClass('score-wise-container')) {
        $("#quickViewDateDiv").hide();
        $('div.score-wise-container').show();
        if ($('#score-wise-chart-graph').is(':empty')) {
            getScoreWiseUserRegister();
        }
    }
    else if ($(this).hasClass('lead-campaign-instance')) {
        $("#quickViewDateDiv").hide();
        $('div.lead-campaign-instance-container').show();
        if ($('#lead-campaign-chart-graph').is(':empty')) {
            getleadCampaignInstance();
        }
    }

}

function downloadAsCsvClicked(e) {
    var selectedType = '';
    var findParam = '';
    var range_type_view = '';
    if($('.parent-graph-tab li.active a').hasClass('registration-container')) {
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
    } else if($('.parent-graph-tab li.active a').hasClass('stage-wise-container')) {
        selectedType = 'stage_wise_container';

    } else if($('.parent-graph-tab li.active a').hasClass('score-wise-container')) {
        selectedType = 'score_wise_container';
    } else if($('.parent-graph-tab li.active a').hasClass('lead-campaign-instance')) {
        selectedType = 'lead-campaign-instance-container';
    }

    var $form = $("#FilterLeadForm");

    $form.attr("target",'modalIframe');
    $form.append($("<input>").attr({"value":"snapshot_csv", "name":"export",'type':"hidden","id":"export"}));
    $form.append($("<input>").attr({"value":selectedType, "name":"selectedType",'type':"hidden"}));
    $form.append($("<input>").attr({"value":range_type_view, "name":"range_type_view",'type':"hidden"}));
    $form.append($("<input>").attr({"value":findParam, "name":"findParam",'type':"hidden"}));
    var onsubmit_attr = $form.attr("onsubmit");
    var action_attr = $form.attr("action");
    $form.removeAttr("onsubmit");
    $form.attr("action",'/leads/snapshot-download-as-csv');
    $form.submit();
    $form.attr("onsubmit",onsubmit_attr);
    $form.attr("action",action_attr);
    $form.find('input[name="export"]').val("");
    $form.removeAttr("target");
    $('#myModal').on('hidden.bs.modal', function(){
        $("#modalIframe").html("");
        $("#modalIframe").attr("src", "");
    });

}

function showMobileDialCodes(event) {
    var $target = $(event.currentTarget);
    var fieldId = $target.closest('.bs-dropdown-to-select-group').parent().find('input.mobile-type-field').attr('id');
    $target.closest('.bs-dropdown-to-select-group')
            .find('[data-bind="bs-drp-sel-value"]').val($target.attr('data-value'))
            .end()
            .children('.dropdown-toggle').dropdown('toggle');
    $target.closest('.bs-dropdown-to-select-group')
            //.find('[data-bind="bs-drp-sel-label"]').text($target.context.textContent);
            .find('[data-bind="bs-drp-sel-label"]').text($target.attr('data-value'));

    //When Select the option from dropdown then close the open dropdown
    $target.closest('.bs-dropdown-to-select-group').removeClass('open');

    //Bydefault remove the value when value will change
    $('#' + fieldId).val('');

    //For change Maxlength value of Mobile Input Box as per selection of country code
    if ($target.attr('data-value') == '+91') {
        $('#' + fieldId).attr('maxlength', 10);
    } else {
        $('#' + fieldId).attr('maxlength', 16);
    }
    return false;
}



/****************************************** AM functions ****************************/
/**
 * on college change load all filter and column
 * @param {type} college_id
 * @param {type} form_id
 * @param {type} callFrom
 * @returns {Boolean}
 */
function advanceFilterColumnOptions(college_id,form_id, callFrom,onlyColumns){
    if(typeof form_id === 'undefined'){
        form_id = 0;
    }
    if(typeof callFrom === 'undefined'){
        callFrom = '';
    }
    checkCollegeConfigRegistration(college_id, callFrom);
    $('#seacrhList').attr('disabled', 'disabled').html('Applying&nbsp;<i class="fa fa-spinner fa-spin"></i>');
    $('#filterLoader').show();
    var asyncVal = true;
    if(callFrom === 'changeCollege' ){
        asyncVal = false;
    }else if(callFrom === 'resetFilter'){
        asyncVal = false;
    }
    $.ajax({
        url: '/leads/get-college-config-filter-column',
        type: 'post',
        dataType: 'json',
        data: {'college_id':college_id},
        async:asyncVal,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () {  showFilterLoader(); },
        complete: function () { hideFilterLoader(); },
        success: function (json) {
            $('#seacrhList').removeAttr('disabled').html('Apply');
            if (typeof json['redirect'] !== 'undefined' && json['redirect'] !== "") {
                window.location.href= json['redirect'];
            }
            else if (typeof json['status'] !== 'undefined' && json['status'] === 200) {
                $('#column_li_list').html('');
                $('#column_li_list').html(json['column']);
                $("#realignment_order").val(json['default_column_list']);
                $("#singleFormId").val(json['singleFormId']);
                createDefaultSortable(json['default_column_list'],'reset');
                if( typeof onlyColumns!=="undefined" && onlyColumns === '1'){
                    return;
                }
                if(callFrom !== 'changeCollege'  ){
                    getSavedFilterList(college_id,'advanceLM','smart_view','smart_view_li_list');
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
//                    if($(this).parent().hasClass('active')) {
//                        $('.filterCollasp').parent().removeClass('active');
//                    } else {
//                        $('.filterCollasp').parent().removeClass('active');
//                        $(this).parent().addClass('active');
//                    }
                    e.preventDefault();
                });
                

//                $('#seacrhList').removeAttr('disabled').html('Apply');
                $('#filterLoader').hide();
                if(college_id){
                    $(".filterAdvancelead").show();
                }else{
                    $(".filterAdvancelead").hide();
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
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

function changeCollege(){
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
//            LoadFormsOnApplication(college_id,'','','Application'); 
            advanceFilterColumnOptions(college_id,'','changeCollege');
        }
        
        getSavedFilterList(college_id,'advanceLM','smart_view','smart_view_li_list');

        if(typeof jsVars.url_filter === 'undefined' || $(jsVars.url_filter).length === 0){
            if($('.savedFilterOpt a.makeActive').length && $.trim($('.savedFilterOpt a.makeActive').text()) === 'System Default View'){

            } else if($('#smart_view_li_list li.default-active').length){
                $('#smart_view_li_list li.default-active a.columnList').trigger('click');
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
}

$(document).on('change', '#filter_li_list li input[type="checkbox"]', function () {
    var isCheckMedium = false;//mediumn campaign
    var isCheck = false;//publisher
    var isCheckSource = false;//source campaign
    var isCheckCampain = false;//source campaign
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
                ) {
            $('input[type="checkbox"][data-input_id="traffic_channel"]').prop('checked', true);
            //$('input[type="checkbox"][data-input_id="registration_instance"]').prop('checked', true);//campain for registration instance
        }
        if (input_id == 'source_value') {//medium_ campaign
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
                ) {
            $('input[type="checkbox"][data-input_id="traffic_channel"]').prop('checked', false);
            //$('input[type="checkbox"][data-input_id="registration_instance"]').prop('checked', false);//campain for registration instance
        }
        if (input_id == 'source_value') {//medium_ campaign
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
    }
});

var get_source_val = '';
var get_medium_val = '';
function getCompaignsSourceAM(getvalue, type, where_cond,default_value) {
    var college_id = $("#user_college_id").val();
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

function getCompaignsMediumAM(getvalue,default_value,conversion) {
    publisher_val = $(".publisher_filter").val();
    var college_id = $("#user_college_id").val();
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

function getCompaignsNameAM(getvalue, default_value,conversion) {
    publisher_val = $(".publisher_filter").val();
    var college_id = $("#user_college_id").val();
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

function getPublisherListAM(elem, tfc){
    college_id = $('#user_college_id').val();
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

function getReferrerListAM(college_id,tfc){
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

function getOfflineSourceListAM(college_id){
     if(college_id){
        var html  = "<option value=''>Publisher/Referrer</option>";
            html  += "<option value='1' >Offline</option>";
                $("#publisher_filter").html(html);
                $('#publisher_filter').trigger('chosen:updated');
                $('#publisher_filter').val("1");
    }
}


//call getCompaignsSourceAM() by publisher id  and Campaion source values and medium ,Name withour values
$(document).on('change', "select[name='filter[pub|publisher_id]']", function () {
    getCompaignsSourceAM($(this).val(), "source_value", 'publisher_id', '');
});

//call getCompaignsMediumAM() medium_value by source_value 
$(document).on('change', "select[name='filter[campu|source_value]']", function () {
   
    if (($(".publisher_filter").val()).length <= 0) {//check publisher value
        return false;
    }
    getCompaignsMediumAM($(this).val());
});

//call getCompaignsName() name_value by medium_value 
$(document).on('change', "select[name='filter[campu|medium_value]']", function () {
    
    $("select[name='filter[campu|name_value']").html('');
    $("select[name='filter[campu|medium_value']").html('');
    getCompaignsNameAM($(this).val(),'');
});

//call publister list by traffic channel selected campain options
$(document).on('change', "select[name='filter[u|traffic_channel]']", function () {
    var college_id=$('select#user_college_id').val();
    
     if(typeof college_id != 'undefined' && college_id != "") {
        if($(this).val()==1){//campain option
            getPublisherListAM(this);
        }else if($(this).val()==8){//telephony option
            getPublisherListAM(this, $(this).val());
        }else if($(this).val()== '0'){//campain option
            var html =  "<option value=''>Publisher/Referrer</option>";
                html += "<option value='1'>Offline</option>";
            $("#publisher_filter").html(html);
            $('#publisher_filter').trigger('chosen:updated');
        }else if($(this).val() == 5 || $(this).val() == 3 || $(this).val() == 4){
            var tfc = $(this).val();
            getReferrerListAM(college_id,tfc);
        }else if($(this).val() == '9'){
            getOfflineSourceListAM(college_id);
        } else{
            //unset drop down on traffic channel without campains
            $("#publisher_filter").html("<option value=''>Publisher/Referrer</option>");
            $("select[name='filter[campu|source_value]']").html("<option value=''>Campaign Source</option>");
            $("select[name='filter[campu|medium_value]']").html("<option value=''>Campaign Medium</option>");
            $("select[name='filter[campu|name_value]']").html("<option value=''>Campaign Name</option>");
            $('select').trigger('chosen:updated');
            //getPublisherListAM();
             return false;
        }
     }
});

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


/****************************************** AM functions ENDS ****************************/


$(document).ready(function () {
    jQuery('.btn-group').on('show.bs.dropdown', function () {
      jQuery('.chosen-select').trigger('chosen:close');
    });
    
    $(document).on( "change","#advanceFilter select, #advanceFilter input, #search_common",function(){
        is_filter_button_pressed = 0;
    });
    
    $("#saveFollowUpButton").on('click',followUp);
    
//    $('#s_lead_status').SumoSelect({placeholder: 'Select Lead Status', search: true, searchText:'Search Lead Status', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });  
    $(".filterAdvancelead").hide();//filter deropdoun hide
    $('.filter_collapse').dropdown('toggle');//filter and coulums drop down open close
    
    //If college id is pre selected (In case of College Admin/College Staff) then call these function
    if (typeof LeadsCollegeId != 'undefined' && parseInt(LeadsCollegeId)>0) {
        /******************** commmenting as taking these to .ctp file as per AM logic *********
        getCollegeConfigFilterWithDefault(LeadsCollegeId,LeadsFormId);
        checkCollegeConfigRegistration(LeadsCollegeId);
        //userleadsCollegeHide();
        
        if($('li.default-active').length){
            $('li.default-active').remove();
        }
        getSavedFilterList(LeadsCollegeId,'leadusers','filter','saved_filter_li_list');
        getSavedFilterList(LeadsCollegeId,'leadusers','column','quick_advance_view_li_list');
        if($(jsVars.url_filter).length == 0){
            if($('.savedFilterOpt a.makeActive').length && $.trim($('.savedFilterOpt a.makeActive').text()) == 'System Default View'){
            } else if($('#saved_filter_default_li_list li.default-active').length){
                $('#saved_filter_default_li_list li.default-active a.columnList').trigger('click');
            }
        } 
        
        hideChartGraph();
         //if url_filter is not undefined and url_filter object is not empty && jQuery.isEmptyObject(jsVars.url_filter) != false
        if (typeof jsVars.url_filter != 'undefined' && jsVars.url_filter != '' ){
           filterSelectFromUrl();//call  filter checkbox select from url
        } else {
            LoadMoreLeadsUser('reset'); //Load result automatically in case of COllege Admin /College Staff
        }
        *********/
    }
    
    // as per AM
    $("#FilterLeadForm select#user_college_id").bind("change",changeCollege);
    // as per LM
    $("#FilterLeadForm select#user_college_id").bind("change", function () {
	//show download lead for LPU
	setDownloadLeadForLPU(this.value);
        return; // executing AM logic
        // remove selected if there
        if($('li.default-active').length){
            $('li.default-active').remove();
        }
        $('.columnApplicationCheckAll').removeClass('checked');
        $('.columnApplicationCheckAll').attr('checked', false);
        callTrigger("id","table-view");//for select table view always in search case
        $('#load_more_results').html('<tbody><tr><td style="background-color:#f8f8f8;"><h4 class="text-center text-danger">Please click search button to view leads.</h4></td></tr><tr></tr></tbody>');
        var form_id = '';
        
        if(this.value == '' || this.value.length == 0){
            $("#filter_elements_html").html("");
            $("#if_record_exists").hide();
            $("#load_more_button").hide();
            $(".filterAdvancelead").hide();//filter  hide
            return false;
        }
        
	//show download lead for LPU
	setDownloadLeadForLPU(this.value);
	
        getCollegeConfigFilterWithDefault(this.value, form_id);//call filter and columns by college id  with enables form
        //userleadsCollegeHide();//hide data
        checkCollegeConfigRegistration(this.value);
        graphMakeDisabledFields('all');
        
        $('select#s_lead_status')[0].sumo.unSelectItem('4');
        $('select#s_lead_status')[0].sumo.selectItem('2');
        $('select#s_lead_status')[0].sumo.selectItem('1');
        $('select#s_lead_status')[0].sumo.reload();
        
        
        getSavedFilterList(this.value,'advanceLM','smart_view','smart_view_li_list');
        
        if($(jsVars.url_filter).length === 0){
            if($('.savedFilterOpt a.makeActive').length && $.trim($('.savedFilterOpt a.makeActive').text()) === 'System Default View'){
            } else if($('#smart_view_li_list li.default-active').length){
                if($('#smart_view_li_list li.default-active a.makeActive').length) {
                    $('#smart_view_li_list li.default-active a.columnList').trigger('click');
                }
            }
        }   
    });
    
    $('.get-user-register').on('click', clickUserRegisterGraphBtn);

    $('.range-tab-active a').on('click', rangeTabClick);

    $('.parent-graph-tab li a').on('click', parentGraphTabClick);

    LoadReportDatepicker();
    LoadReportDateRangepicker();
    LoadDateTimeRangepicker();
    $('.download-as-pdf').on('click', function (e) {
        e.preventDefault();
        downloadGraph('leads');
    });
    
    $('.download-as-csv').on('click', downloadAsCsvClicked);   
    
    if($("#lead_followup_date").length > 0){
        var lfdPlaceholder = $('#lead_followup_date').attr('placeholder');
        $('#lead_followup_date').datetimepicker({
            format: 'DD/MM/YYYY HH:mm', 
            minDate:new Date(),
            viewMode: 'years'
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
    $('.columnApplicationCheckAll').on('click', function(e){
        $(this).toggleClass('checked');
        if($(this).hasClass('checked')) {
            var isEngamentStatusChecked = $("#column_li_list ").find("input:checkbox[data-filter_value='ae_engaged_status|engaged_status']").prop('checked');
            var isEngamentDateChecked = $("#column_li_list ").find("input:checkbox[data-filter_value='ae_create_date|create_date']").prop('checked');
            var isLeadStrengthChecked = $("#column_li_list ").find("input:checkbox[data-filter_value='ud|percentile']").prop('checked');
            $('#column_li_list input:checkbox:not(:disabled)').prop('checked', true);
            if(typeof isEngamentStatusChecked !=="boolean" || isEngamentStatusChecked===false){
                $("#column_li_list ").find("input:checkbox[data-filter_value='ae_engaged_status|engaged_status']").prop('checked', false);
            }
            if(typeof isEngamentDateChecked !=="boolean" || isEngamentDateChecked===false){
                $("#column_li_list ").find("input:checkbox[data-filter_value='ae_create_date|create_date']").prop('checked', false);
            }
            if(typeof isLeadStrengthChecked !=="boolean" || isLeadStrengthChecked===false){
                $("#column_li_list ").find("input:checkbox[data-filter_value='ud|percentile']").prop('checked', false);
            }
        } else {
            $('#column_li_list input:checkbox:not(:disabled)').prop('checked', false);
        }
    });
    
    //For Dropdown Menu Country Dial Code
    $( document ).on('click', '.bs-dropdown-to-select-group .dropdown-menu-list li', showMobileDialCodes);

    jQuery('.filter_dial_code').on('click', function (e) {
        e.stopPropagation();
    });


    //Application Manager Filter Form
    if ($('#FilterApplicationForm #start_date, #FilterApplicationForm #end_date').length > 0) {
        //$('#FilterApplicationForm #start_date, #FilterApplicationForm #end_date').datepicker({startView: 'month', format: 'd M yyyy', enableYearToMonth: true, enableMonthToDay: true})/*.on('changeDate', function () {})*/;
        $('#FilterApplicationForm #start_date, #FilterApplicationForm #end_date').datetimepicker({format: 'DD/MM/YYYY HH:mm',viewMode: 'years'});
    }
    changeEventForFilter();
    
    $('#viewCounsellorActivityDiv .close').on('click', function (e) {
        $("#viewCounsellorActivityDiv").modal('hide');
    });
});

jQuery(window).load(function(){
    jQuery(".initHide").addClass('initShow');
});

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

$(document).on('click','#modalButtonLPU',function(e) {
    var $form = $("#FilterLeadForm");
    var action_attr = $form.attr("action");
    $form.attr("action", '/leads/user-leads-downloads-lpu');
    $form.attr("target", 'modalIframe');
    //$form.append($("<input>").attr({"value": "export", "name": "export", 'type': "hidden", "id": "export"}));
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    $form.submit();
    $form.attr("action",action_attr);
    $form.attr("onsubmit", onsubmit_attr);
    $form.removeAttr("target");
});


// this will bind all sorting icon.
$(document).on('click','span.sorting_span i', function (){
    
//    console.log(this);
    jQuery("span.sorting_span i").removeClass('active');
    var field = jQuery(this).data('column');
    var data_sorting = jQuery(this).data('sorting');
    $('#sort_options').val(field+"|"+data_sorting);
//    console.log(this);
//    console.log($(this).attr('class'));
    jQuery(this).addClass('active_pp');
    LoadMoreLeadsUser('reset','sorting');
});
/***
$(document).on('change', "select[name='filter[campu|publisher_id]'],select[name='filter[registration_instance]']", function () {
    //When Publisher value will change then reset all below div id value
    if(typeof $("select[name='filter[campu|source_value][]']").html("")[0] !=="undefined"){
        $("select[name='filter[campu|source_value][]']").html("")[0].sumo.reload();
    }
    if(typeof $("select[name='filter[campu|medium_value][]']").html("")[0] !=='undefined'){
        $("select[name='filter[campu|medium_value][]']").html("")[0].sumo.reload();
    }
    if(typeof $("select[name='filter[campu|name_value][]']").html("")[0] !=='undefined'){
        $("select[name='filter[campu|name_value][]']").html("")[0].sumo.reload();
    }
    
    if($(this).attr('name') == 'filter[registration_instance]') {
        $(".formAreaCols .u-lead_type").attr('name','filter[acd|lead_type]');
        $(".formAreaCols .u-traffic_channel").attr('name','filter[campu|traffic_channel]');
        $(".formAreaCols .u-lead_type").val("");
        $(".formAreaCols .u-traffic_channel").val("");
        if($(this).val() == 'sec_register'){
            $(".formAreaCols .u-lead_type").attr('name','filter[acd|sec_lead_type]');
            $(".formAreaCols .u-traffic_channel").attr('name','filter[campu|traffic_channel]');
            if($('select#s_lead_status').val() == 4 || $('select#s_lead_status').val() == null){
                $('select#s_lead_status')[0].sumo.selectItem('2');
                $('select#s_lead_status')[0].sumo.selectItem('1');
            }
            $('select#s_lead_status')[0].sumo.unSelectItem('4');
            $('select#s_lead_status')[0].sumo.reload();
        } else if($(this).val() == 'ter_register'){
            $(".formAreaCols .u-lead_type").attr('name','filter[acd|ter_lead_type]');
            $(".formAreaCols .u-traffic_channel").attr('name','filter[campu|traffic_channel]');
            if($('select#s_lead_status').val() == 4 || $('select#s_lead_status').val() == null){
                $('select#s_lead_status')[0].sumo.selectItem('2');
                $('select#s_lead_status')[0].sumo.selectItem('1');
            }
            $('select#s_lead_status')[0].sumo.unSelectItem('4');
            $('select#s_lead_status')[0].sumo.reload();
        } else if($(this).val() == 'pri_register'){
            $(".formAreaCols .u-lead_type").attr('name','filter[acd|lead_type]');
            $(".formAreaCols .u-traffic_channel").attr('name','filter[campu|traffic_channel]');
            if($('select#s_lead_status').val() == 4 || $('select#s_lead_status').val() == null){
                $('select#s_lead_status')[0].sumo.selectItem('2');
                $('select#s_lead_status')[0].sumo.selectItem('1');
            }
            $('select#s_lead_status')[0].sumo.unSelectItem('4');
            $('select#s_lead_status')[0].sumo.reload();
        }else if($(this).val() == ''){
            $(".formAreaCols .u-lead_type").val("");
            $(".formAreaCols .u-traffic_channel").val("");
        }
        $(".formAreaCols .u-lead_type").trigger('chosen:updated');
    }
    
    getCompaignsSource();
});
***********/
/***
$(document).on('change', "select#s_lead_status", function () {
    var s_lead_status_val = $(this).val();
    if(typeof s_lead_status_val != 'undefined' && s_lead_status_val != null && s_lead_status_val != ''){
        var s_lead_status_val_str = s_lead_status_val.toString().split(",");
        if (s_lead_status_val_str.indexOf("4") !== -1) {
            $("select[name='filter[registration_instance]']").val("");
            $("select[name='filter[registration_instance]']").trigger('change');
        }
    } else if(s_lead_status_val == null) {
        $("select[name='filter[registration_instance]']").val("");
        $("select[name='filter[registration_instance]']").trigger('change');
    }
});

$(document).on('change', "select[name='filter[campu|source_value][]']", function () {
    if (($(".publisher_filter").val()).length <= 0) {//check publisher value
        return false;
    }
    $("select[name='filter[campu|medium_value][]']").html('')[0].sumo.reload();
    $("select[name='filter[campu|name_value][]']").html('')[0].sumo.reload();
    var sel_mvalue = '';
    getCompaignsMedium($(this).val());
});

$(document).on('change', "select[name='filter[campu|medium_value][]']", function () {

    $("select[name='filter[campu|name_value][]']").html('')[0].sumo.reload();
//    $("select[name='filter[campu|medium_value']").html('');
    var sel_nvalue = '';
    getCompaignsName($(this).val(), sel_nvalue);
});
************/
/***
//call publister list by traffic channel selected campain options
$(document).on('change', "select[name='filter[campu|traffic_channel]'],select[name='filter[u|sec_traffic_channel]'],select[name='filter[u|ter_traffic_channel]']", function () {
    var college_id = $('select#user_college_id').val();

    $("#publisher_filter").html("<option value=''>Publisher/Referrer</option>");
    if(typeof $("select[name='filter[campu|source_value][]']").html("")[0] !== 'undefined'){
        $("select[name='filter[campu|source_value][]']").html("")[0].sumo.reload();
    }
    if(typeof $("select[name='filter[campu|medium_value][]']").html("")[0] !== 'undefined'){
        $("select[name='filter[campu|medium_value][]']").html("")[0].sumo.reload();
    }
    if(typeof $("select[name='filter[campu|name_value][]']").html("")[0] !== 'undefined'){
        $("select[name='filter[campu|name_value][]']").html("")[0].sumo.reload();
    }
    $("#publisher_filter").trigger('chosen:updated');
    if (typeof college_id != 'undefined' && college_id != "") {
        var trafficChannel  = $(this).val();
        if (trafficChannel == 1 || trafficChannel == 2 || trafficChannel == 7 || trafficChannel == 8 || trafficChannel == 9) {//campain option 
            getPublisherList(trafficChannel);
        }else if( trafficChannel == 3 || trafficChannel == 4 || trafficChannel == 5 ){
            getReferrerList(trafficChannel );
        }else if(trafficChannel == 6){
            getDirectSourceList(college_id);
        }else if(trafficChannel == 10){
            getChatSourceList(college_id);
        }
    }

});
****************************/

/******************8
$(document).on('change', '#filter_li_list li input[type="checkbox"]', function () {
    var isCheckMedium = false;//mediumn campaign
    var isCheck = false;//publisher
    var isCheckSource = false;//source campaign
    var isCheckCampain = false;//source campaign
    if ($(this).is(':checked')) {//check checkbox true
        var input_id = '';
        if (typeof $(this).data('input_id') != 'undefined') {//get id
            input_id = $(this).data('input_id');
        }
        if (input_id == 'publisher_id') {//publisher
            var sci = $('input[type="checkbox"][data-input_id="registration_channel"]').prop('checked', true);//campain for traffic channel
        }
        if (input_id == 'source_value' || input_id == 'medium_value' || input_id == 'name_value' || input_id == 'publisher_id') {
            var sci = $('input[type="checkbox"][data-input_id="registration_channel"]').prop('checked', true);
        }
        if (input_id == 'source_value') {//medium_ campaign
            var sci1 = $('input[type="checkbox"][data-input_id="publisher_id"]').prop('checked', true);//publisher
        }
        if (input_id == 'medium_value') {//medium_ campaign
            var sci1 = $('input[type="checkbox"][data-input_id="publisher_id"]').prop('checked', true);//publisher
            var sci3 = $('input[type="checkbox"][data-input_id="source_value"]').prop('checked', true);//source
        }
        if (input_id == 'name_value') {//name campaign
            var sci1 = $('input[type="checkbox"][data-input_id="publisher_id"]').prop('checked', true);//publisher
            var sci2 = $('input[type="checkbox"][data-input_id="medium_value"]').prop('checked', true);//mediumn
            var sci3 = $('input[type="checkbox"][data-input_id="source_value"]').prop('checked', true);//source
        }

    } else {

        $('#filter_li_list li input[type="checkbox"]:checked').each(function () {//loop for checked is true
            var input_id = '';
            if (typeof $(this).data('input_id') != 'undefined') {//get id
                input_id = $(this).data('input_id');
            }

            if (input_id == 'medium_value') {//mediumn 
                isCheckMedium = true;
            }
            if (input_id == 'publisher_id') {//publisher
                isCheck = true;
            }
            if (input_id == 'source_value') {//source
                isCheckSource = true;
            }
            if (input_id == 'registration_channel') {//campain for traffic channel
                isCheckCampain = true;
            }
        });
        if (!isCheckMedium) {//medium unchecked 
            $('input[type="checkbox"][data-input_id="name_value"]').prop('checked', false);
        }
        if (!isCheck) {//case for publisher unchecked
            $('input[type="checkbox"][data-input_id="source_value"]').prop('checked', false);
            $('input[type="checkbox"][data-input_id="medium_value"]').prop('checked', false);
            $('input[type="checkbox"][data-input_id="name_value"]').prop('checked', false);
        }
        if (!isCheckSource) {//source unchecked campagin unchecked
            $('input[type="checkbox"][data-input_id="medium_value"]').prop('checked', false);
            $('input[type="checkbox"][data-input_id="name_value"]').prop('checked', false);
        }
        if (!isCheckCampain) {//campain for traffic channel unchecked
            $('input[type="checkbox"][data-input_id="publisher_id"]').prop('checked', false);
            $('input[type="checkbox"][data-input_id="source_value"]').prop('checked', false);
            $('input[type="checkbox"][data-input_id="medium_value"]').prop('checked', false);
            $('input[type="checkbox"][data-input_id="name_value"]').prop('checked', false);
        }
    }
});
*********************/

$("#user_college_id").change(function(){
    $("#selectionRow").hide();
});

determineDropDirection();
$(window).scroll(determineDropDirection);


$('html').on('click','.bulk-action-button',function(){
    var merged = $('#lead_merge_available').val();
    if(merged == 'yes'){
        $('.actions-all').hide();
    } else {
        $('.actions-all').show();
    }
});

$(document).on('change','#assignedTo',showMessage);
$(document).on('change','#unassignedFrom',showMessage);

$(document).on('click', '.select_lead',function(e) {
    var recordOnDisplay = $('input:checkbox[name="selected_users[]"]').length;
    var selected_records = $('.select_lead:checked').length;
    $('#select_page_users').attr('checked',false);
    $('#select_all').attr('checked',false);
    if(selected_records<1){
        $("#selectionRow").hide();
        $("#selectAllAvailableRecordsLink").hide();
        $("#clearSelectionLink").hide();
        $('#li_bulkCommunicationAction,#li_facebookCustomAudiences').hide();
    }else{
        // $('#li_bulkCommunicationAction,#li_facebookCustomAudiences').show();
        var display_message = selected_records+" leads on this page are selected. ";
        if(selected_records == recordOnDisplay){
            display_message = "All "+selected_records+" leads on this page are selected. ";
            $('#select_page_users').attr('checked',true);
            $('#select_page_users').trigger('click');
        }
        $("#selectionRow").show();
        $("#currentSelectionMessage").html(display_message);
        $("#selectAllAvailableRecordsLinkSpan").html('<a id="selectAllAvailableRecordsLink" href="javascript:void(0);" onclick="selectAllAvailableRecords('+ $("#all_records_val").val() +');"> Select all <b>'+ $("#all_records_val").val() +'</b>&nbsp;leads</a>');
        $("#selectAllAvailableRecordsLink").show();
        $("#clearSelectionLink").hide();
        if(selected_records>1){
            $('#li_bulkCommunicationAction,#li_facebookCustomAudiences').show();
        }
    }
});


function leadDelete(hash) {
    if(hash){
        $("#delete_user_id").val(hash);
        $("#lead_delete_error").html('');
    }
}

function softDeleteLead() {
    $('#lead_delate_btn').attr('disabled', true);
    var data  = $("#leadDeleteForm").serializeArray();
    showLoader();
    $.ajax({
        url : "/leads/leadSoftDelete",
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
        success : function (resObject){
            if (resObject.redirect === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if (typeof resObject.error != 'undefined'){
                $("#lead_delete_error").html(resObject.error);
            }
            if(resObject.status == '1' ) {
                $("#leadDelete").modal('hide');
                LoadMoreLeadsUser('reset');
                alertPopup("Lead deleted sucessfully",'sucess');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function initiateCampaignUpdate(userId, type){
    $('#pageNumberButtonId').prop('disabled',false);
    $('#campaignFormDiv .error').hide().html('');
    $('#update_source,#update_medium,#update_campaign').val('');
    $("#campaignUpdateMessageDiv").html("");
    $("#campaignUpdateTitle").html('');
    if(type=='bulk'){
        if($("#user_college_id").val()=='' || $("#user_college_id").val()==0 || $("#user_college_id").val()==null){
            alertPopup('Please select college','error');
            return;
        }
        var formId = $("#user_college_id").val();
        if($('input:checkbox[name="selected_users[]"]:checked').length < 1 && $('#select_all:checked').val()!='select_all'){
            alertPopup('Please select User','error');
            return;
        }

        if(typeof is_filter_button_pressed =='undefined' || is_filter_button_pressed != 1){
            alertPopup('It seems you have changed the filter but not Applied it. Please re-check the same to proceed further.','error');
            $('#listloader').hide();
            return;
        }

        var sel_field = $(".sel_field").map(function() {
                if($(this).val() =='acd|lead_type||dropdown||["Offline","Online","Chat","API","Widget","Telephony"]'){
                    return $(this).val();
                }
                }).get();

        if(sel_field == null || typeof sel_field == 'undefined' || sel_field.length!==1){
            alertPopup('Please select lead origin filter only one time','error');
            return;
        }


        var sel_name = $(".sel_field").map(function(index,elem) {
                if($(this).val() =='acd|lead_type||dropdown||["Offline","Online","Chat","API","Widget","Telephony"]'){
                    var selectName =  $(elem).attr('name');
                    var typesName  = selectName.replace('fields','types');
                    var valuesName = selectName.replace('fields','values][');

                    var typesNameValue  = $('[name="'+typesName+'"]').val();
                    var valuesNameValue = $('[name="'+valuesName+'"]').val();

                    if(typesNameValue == 'eq' && valuesNameValue != null && typeof valuesNameValue != 'undefined' && valuesNameValue.length == 1 ){
                        return true;
                    }
                    return false;
                }
                }).get();

            if(sel_name[0] == null || typeof sel_name[0] == 'undefined' || sel_name[0]==false){
                alertPopup('Please select lead origin filter with equal condition','error');
                return;
            }


             var radio_criteria = $(".radio_criteria").map(function() {
                if($(this).is(':checked') && $(this).val()=='or'){
                    return $(this).val();
                }
                }).get();

             if(radio_criteria[0] != null && typeof radio_criteria[0] != 'undefined' && radio_criteria.length >0 ){
                alertPopup('Please select lead "All Criteria" in filter','error');
                return;
            }

    }

    $('#campaignUpdateModal .modal-title').html('Bulk Campaign Update');
    $('#campaignUpdateModal').modal('show');
    floatableLabel();
}



function updateCampaignDataConfirm() {
    var users   = [];
    $('input:checkbox[name="selected_users[]"]').each(function () {
        if(this.checked){
            users.push(parseInt($(this).val()));
        }
    });

    var error = false;
    if(typeof $("#update_source").val()=='undefined' || $("#update_source").val()=='' || $("#update_source").val()==0 || $("#update_source").val()==null){
        $('#error_span_update_source').show().html('Please Enter Source Name');
        error = true;
    }
    if(typeof $("#update_medium").val()=='undefined' || $("#update_medium").val()=='' || $("#update_medium").val()==0 || $("#update_medium").val()==null){
        $('#error_span_update_medium').show().html('Please Enter Medium Name');
        error = true;
    }
    if(typeof $("#update_campaign").val() =='undefined' || $("#update_campaign").val()=='' || $("#update_campaign").val()==0 || $("#update_campaign").val()==null){
        $('#error_span_update_campaign').show().html('Please Enter Campaign Name');
        error = true;
    }

    if(error == true){
        return;
    }


    $("#confirmYes").removeAttr('onclick');
    $('#confirmTitle').html("Confirm");
    $("#confirmYes").html('Ok');
    $("#confirmNo").html('Cancel');
    $('#ConfirmMsgBody').html('Are you sure to Update campaign?');
    $('#ConfirmPopupArea').css('z-index', '11111');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
            e.preventDefault();
            $('#ConfirmPopupArea').modal('hide');
            updateCampaignData();
        });
    return false;
}
function updateCampaignData() {
    var users   = [];
    $('input:checkbox[name="selected_users[]"]').each(function () {
        if(this.checked){
            users.push(parseInt($(this).val()));
        }
    });
    
    var error = false;
    if(typeof $("#update_source").val()=='undefined' || $("#update_source").val()=='' || $("#update_source").val()==0 || $("#update_source").val()==null){
        $('#error_span_update_source').show().html('Please Enter Source Name');
        error = true;
    }
    if(typeof $("#update_medium").val()=='undefined' || $("#update_medium").val()=='' || $("#update_medium").val()==0 || $("#update_medium").val()==null){
        $('#error_span_update_medium').show().html('Please Enter Medium Name');
        error = true;
    }
    if(typeof $("#update_campaign").val() =='undefined' || $("#update_campaign").val()=='' || $("#update_campaign").val()==0 || $("#update_campaign").val()==null){
        $('#error_span_update_campaign').show().html('Please Enter Campaign Name');
        error = true;
    }

    if(error == true){
        return;
    }

    $('#pageNumberButtonId').prop('disabled',true);
    
    if(users.length > 0 || $('#select_all:checked').val()==='select_all'){
        //new_source_name
        var $form = $("#bulkUpdateCampaignData");
        $form.find('input[name="collegeId"]').val($("#user_college_id").val());
        $form.find('input[name="new_source_name"]').val($("#update_source").val());
        $form.find('input[name="new_medium_name"]').val($("#update_medium").val());
        $form.find('input[name="new_campaign_name"]').val($("#update_campaign").val());
        $form.find('input[name="cmp_lead_type"]').val($(".acd\\\|lead_type").val());
        
        if($('#select_all:checked').val()==='select_all'){
            $form.find('input[name="userId"]').val("all");
            $form.find('input[name="filters"]').val($("#leadsListFilters").val());
            $form.find('input[name="totalRecords"]').val($("#all_records_val").val());
        }else{
            $form.find('input[name="userId"]').val(users);
            $form.find('input[name="filters"]').val($("#leadsListFilters").val());
            $form.find('input[name="totalRecords"]').val(users.length);
        }
        
        $('#myModal').modal('show');
        $form.attr("action",'/leads/bulkUpdateCampaignData');
        $form.attr("target",'modalIframe');
        $form.submit();
        $form.removeAttr("target");

        $('#myModal').on('hidden.bs.modal', function(){
            $("#modalIframe").html("");
            $("#modalIframe").attr("src", "");
        });
        $('#campaignUpdateModal').modal('hide');
        return;
    }else{
        alertPopup('Please select User','error');
    }
    
}

var pdata ;
 function leadPushtoErp(data){
    $('#repushlead_success').hide();
     $("#repushlead_selecterror").hide();  
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
           if(result!=""){
            var responseObject = jQuery.parseJSON(result);
            pdata = {'enctyptedData':data};
            var option = '';
                var selectTrigger  = '';
                option += '<option value="select">Select Triger Point</option>';
                $.each(responseObject, function (index, item) {
                      option += '<option value="'+item +'">'+item+'</option>';
                });
                  selectTrigger += '<div class="text-center margin-top-8"><button id="repush_button" class="btn btn-npf pull-right m-0" onclick="rePushErpLeadData(pdata); ">Push</button></div>';
       
                $('#rePushPopupLead .modal-dialog').addClass('modal-sm');
                $('#repushlead_button').html(selectTrigger);
                $('#repushlead_id').html(option);
                $('#rePushPopupLead').modal('show');                   
            }else {
                $('#rePushPopupLead .modal-body').html('<div id="errorText" class="alert alert-warning">Erp Not Active</div>');
                   $('#rePushPopupLead').modal('show');
            }
            $('.chosen-select').trigger('chosen:updated');
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}

function rePushErpLeadData(data){
    if($('#repushlead_id').val()!=='select'){
      $("#repushlead_selecterror").hide(); 
        $.ajax({
           url: '/connector/repush-applicationtoErp',
           type: 'post',
           dataType: 'html',
           data: {data:data,trigerpoint:$('#repushlead_id').val()},
           headers: {
               "X-CSRF-Token": jsVars._csrfToken
           },
           success: function (responseData) {
               $('#repush_button').prop('disabled', true);
               $("#repushlead_success").show();                
           }
       });
   }else{
       
       $("#repushlead_selecterror").show();  
       $('#repush_button').prop('disabled', false);
   }
}

function viewCounsellorActivity(collegeId,userId,listingType){
    
    if(listingType === 'loadmore'){
        collegeId   = $("#counsellorActivityCollegeId").val();
        userId      = $("#counsellorActivityUserId").val();
    }else{
        $("#counsellorActivityPage").val(1);
        $("#counsellorActivityCollegeId").val(collegeId);
        $("#counsellorActivityUserId").val(userId);
    }
    
    
    $.ajax({
        url: jsVars.viewCounsellorActivityLink,
        type: 'post',
        data: {'user_id' : userId, 'college_id':collegeId, 'page':$("#counsellorActivityPage").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
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
                    $("#counsellorActivityLogsDiv").html(html);
                }else{
                    $('#counsellorActivityLogsDiv').find("ul").append(html);
                }
                if(countRecord < 5){
                    $('#LoadMoreCounsellorActivity').hide();
                }else{
                    $('#LoadMoreCounsellorActivity').show();
                }
                $("#counsellorActivityPage").val(parseInt($("#counsellorActivityPage").val())+1);
                $("#viewCounsellorActivityDiv").modal('show');   
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            ;
        }
    });
}

function saveLeadStageBulkRequest() {
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
                if (json['downloadUrl']) {
                    $('#stageChangePopup #downloadListing').attr('href',json['downloadUrl']);
                    $('#stageChangePopup #showlink').show();
                } else {
                    $('#stageChangePopup #showlink').hide();
                }
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

function editFollowUpDetails()
{
    let applicantEngagementId = $("#applicantEngagementId").val();
    let editLeadFollowupDate = $("#edit_lead_followup_date").val();
    let editLeadRemark = $("#edit_lead_remark").val();
    let collegeId = $("#collegeId").val();

    if(editLeadFollowupDate == $followupDateTime) {
        $('#edit_followup_error').show().html("You have not changed followup datetime to save.");
        return false;
    }else{
        $('#edit_followup_error').html("").hide();
    }
    
    $.ajax({
        url: jsVars.FULL_URL+'/counsellors/editFollowup',
        type: 'post',
        data: {"note": editLeadRemark, "followupDate": editLeadFollowupDate, "collegeId" : $('#user_college_id').val(), "applicantEngagementId" : applicantEngagementId},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        async: false,
        beforeSend: function () {
            showLoader();
            $('#editFollowUpButton').attr('disabled', 'disabled').html('Updating&nbsp;<i class="fa fa-spinner fa-spin"></i>');
        },
        complete: function () {
            hideLoader();
            $('#editFollowUpButton').removeAttr('disabled').html('Update');
        },
        success: function (responseObject) {
            responseObject = $.parseJSON(responseObject);
            if (responseObject.error === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                $("#edit_lead_followup_date").val("");
                $("#edit_lead_remark").val("");
                $('#followupEditModal').modal('hide');
                alertPopup("Followup details have been updated");
                
            }else{
                $('#edit_remark_error, #edit_followup_error').hide();
                if(responseObject.message != "") {
                    validationErrObj = responseObject.message;
                    if(typeof validationErrObj == 'object') {
                        if(validationErrObj.remark_error != undefined) {
                            $('#edit_remark_error').show();
                            $('#edit_remark_error').html(validationErrObj.remark_error);
                        }                         
                    }
                }
            }
            floatableLabel();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#editFollowUpButton').removeAttr('disabled').html('Update');
        }
    });
}

function setFollowupEditVariables(cId,remarks,followupDateTime, appEngId){
    $("#edit_lead_remark").val(remarks);
    $("#applicantEngagementId").val(appEngId);
    $('#followupModal').modal("hide");
    $('#edit_lead_followup_date').datetimepicker({format: 'DD/MM/YYYY HH:mm', minDate:new Date(),viewMode: 'days'});
    $("#edit_lead_followup_date").val(followupDateTime);
    $followupDateTime = followupDateTime;
}

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
        $('#addRemoveColumnModal').removeClass('downloadmodal');

    } else if (action === 'download') {
        if (typeof is_filter_button_pressed === 'undefined' || is_filter_button_pressed !== 1) {
            alertPopup('It seems you have changed the filter but not Applied it. Please re-check the same to proceed further.', 'error');
            return false;
        }
        $('#export_type').val('csv');
        $('#download_type_option').show();
        $('.list-action-btn').hide();
        $('#download_all').val('no');
        $('.download-action-btn').show();
        $('#addRemoveColumnModal .modal-title > span').html('Download');
        $('#addRemoveColumnModal .modal-title').addClass('downloadtitle');
        $('.download-action-btn').removeAttr('disabled');
        $('#addRemoveColumnModal').addClass('downloadmodal');
        $('#download_all_chosen .chosen-search,#export_type_chosen .chosen-search').hide();
    }
    $('#addRemoveColumnModal').modal('show');
    $('#add_remove_column_serach').val('').trigger('onkeyup');
    if (list_view_fields_selected.length > 0) {
        createDefaultSortable(list_view_fields_selected, 'restore');
    } else {
        resetAddRemoveColumnPopup();
    }
    $('.chosen-select').trigger('chosen:updated');
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
    $('#ConfirmDownloadTrigger').trigger('click');
    $('.download-action-btn').attr('disabled','disabled');
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
    }
}
function initiateBulkUpdate(){
    if(typeof is_filter_button_pressed =='undefined' || is_filter_button_pressed != 1){
        alertPopup('It seems you have changed the filter but not Applied it. Please re-check the same to proceed further.','error');
        return false;
    }
    $('#bulk_update_popup').html('');
    var college_id = $.trim($("#user_college_id").val());
    var users   = [];
    $('input:checkbox[name="selected_users[]"]').each(function () {
        if(this.checked){
            users.push(parseInt($(this).val()));
        }
    });
    if(college_id=='' || college_id==0 || college_id==null){
        alertPopup('Please select a college','error');
        return;
    }
    if(users.length < 1 && $('#select_all:checked').val()!=='select_all'){
        alertPopup('Please select users','error');
        return;
    }
    var total_records = users.length;
    if($('#select_all:checked').val()==='select_all'){
        total_records = $("#all_records_val").val();
    }
    if(total_records > jsVars.maximum_record_allowed){
        alertPopup('Maximum '+jsVars.maximum_record_allowed+' records can be selected at a time, you have selected '+total_records+' records.','error');
        $('#ErroralertTitle').html('Notification');
        return;
    }

    if(users.length > 0 || $('#select_all:checked').val()==='select_all'){
        

        $.ajax({
            url: '/leads/bulk-update-lead-data',
            type: 'post',
            dataType: 'html',
            data: {'college_id':college_id},
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
                  if (html === 'session_logout'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else if (checkError === 'ERROR:'){
                    alertPopup(html.substring(6, html.length),'error');
                }else{
                    $('#bulk_update_popup').html(html); 
                    $('#showBulkUpdateLeadPopUp').trigger('click');
                    $('body').addClass('vScrollRemove');
                    $('.offCanvasModal').on('hide.bs.modal', function () {
                      $('body').removeClass('vScrollRemove');
                    })
                    $('.chosen-select').chosen();
                    $('.chosen-select').trigger('chosen:updated');
                    var $form = $("#bulkUpdateLeadForm");
                    $form.find('input[name="collegeId"]').val(college_id);
                    if($('#select_all:checked').val()==='select_all'){
                        $form.find('input[name="userId"]').val("all");
                        $form.find('input[name="filters"]').val($("#leadsListFilters").val());
                        $form.find('input[name="totalRecords"]').val($("#all_records_val").val());
                    }else{
                        $form.find('input[name="userId"]').val(users);
                        $form.find('input[name="filters"]').val($("#leadsListFilters").val());
                        $form.find('input[name="totalRecords"]').val(users.length);
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}


function createDefaultSortable(defaultFields, restoreIt) {
    const defaultFieldArr = defaultFields.split(",");
    let default_li = '';
    let default_fixed_li = '';
    const disable_realignment_fields_leads = jsVars.disable_realignment_fields_leads;
    const avilable_columns = [];
    if (restoreIt === 'restore') {
        $("ul#column_li_list .column_create_keys").each(function () {
            let $col = $(this);
            let column_val = $col.val();
            $col.prop('checked', false);
            avilable_columns.push(column_val);
            $col.removeAttr('disabled');
            defaultFieldArr.forEach(function (default_columns, index) {
                if (column_val.indexOf(default_columns) !== -1) {
                    $col.prop('checked', true);
                    defaultFieldArr[index] = column_val;
                }
            });
            if ($.inArray(column_val, disable_realignment_fields_leads) !== -1) {
                $col.attr('disabled', true);
            }
        });
    } else {
        $("#column_li_list .column_create_keys").each(function () {
            $(this).removeAttr('disabled');
            avilable_columns.push($(this).val());
            if ($.inArray($(this).val(), disable_realignment_fields_leads) !== -1) {
                $(this).attr('disabled', true);
            }
        });
    }
    defaultFieldArr.forEach(function (item) {
        if (avilable_columns.length > 0 && $.inArray(item, avilable_columns) !== -1) {
            const fieldNameArr = item.split("||");
            let isDisabled = $("input.column_create_keys[value='" + item + "']").attr('disabled');
            if (fieldNameArr[0] === 'ud|name') {
                default_fixed_li += '<li class="draggable_column_item" data-field-value="' + item + '">';
                default_fixed_li += '<input type="hidden" name="column_sorting_order[]" value="' + item + '">';
                default_fixed_li += fieldNameArr[1];
                default_fixed_li += '</li>';
            } else {
                default_li += '<li class="draggable_column_item" data-field-value="' + item + '">';
                default_li += '<input type="hidden" name="column_sorting_order[]" value="' + item + '">';
                default_li += fieldNameArr[1];
                if (!isDisabled) {
                    default_li += '<button type="button" data-clickable="true" class="remove_draggable" data-toggle="tooltip" data-placement="left"  title="Click here to remove" aria-label="remove_draggable" data-field_value="' + item + '">×</button>';
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
        var $filterForm = $("#FilterLeadForm");
        $filterForm.attr("onsubmit", 'return LoadMoreLeadsUser("reset");');
        $filterForm.removeAttr("target");
    });
});

function resetAddRemoveColumnPopup(){
    $('#add_remove_column_serach').val('');
    let college_id = $("#user_college_id").val();
    let form_id = 0;
    let callFrom = '';
    advanceFilterColumnOptions(college_id,form_id,callFrom,'1');
    return false;
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
        if($.trim($('input#search_common').val()).length>0){
            $('input#search_common').val('');
            $('#seacrhList').trigger('click');
        }
    });
});

function viewAsLead(UserId,collegeId){
     var mappedLocation = '';
    if( $("#mapped_location").length ){
        if( $("#mapped_location").val()==="" ){
            alertPopup('Please select a location.', 'error');
            return;
        }else{
            mappedLocation = $("#mapped_location").val();
        }
    }
    $('#ConfirmMsgBody').html("Are you sure you want to view as Lead?");
    $('#confirmYes').unbind('click');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false}).off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $.ajax({
            url: jsVars.FULL_URL+'/leads/viewAsLead',
            type: 'post',
            data: { userId : UserId, collegeId : collegeId,mappedLocation:mappedLocation },
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
                        window.open( json['loginLink'], 'viewAsLead', 'width=1200, height=600, scrollbars=yes, left=100, top=50');
                    } else {
                        alertPopup('Something went wrong!', 'error');
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        $('#ConfirmPopupArea').modal('hide');
    });
}
