var disallowDown            = false;
var disallowFollowup        = false;
var disallowRemark          = false;
var disallowCommunication   = false;
var currentStage            = '';
var currentSubStage         = '';
var formPercentage	    = '';
var leadApplicationSamePage  = false;
var leadApplicationModuleName = '';
var leadApplicationFormId   = '';
var counsellorsAvailableForFollowup = false;
var applicationReassignCheck = '';
var queryReassignCheck = ''
var leadReassignCheck = '';
// Define custom method on Array prototype
// Pass the array as parameter
Array.prototype.diff = function (arr) {
    return this.filter(elm => {
        return arr.indexOf(elm) < 0;
    });
};


$(document).ready(function(){
    $("#saveFollowUpButton").on('click',followUp);
	//$('[data-toggle="tooltip"]').tooltip();
	/*$('[data-toggle="popover"]').on('show.bs.popover', function () {
		$('body').append('<div class="popover-backdrop fade in"></div>');
	})
	$('[data-toggle="popover"]').on('hidden.bs.popover', function () {
		$('.popover-backdrop').detach();
	})*/
	$('#getFormPercentage').on('shown.bs.popover', function () {
		getFormPercentage();
	})

    getLeadStagePermissions();
    $('#userProfileLoader').hide();
    $("#communicationLogFiltersDiv").hide();
    var lead_followup_date_edit = $('#lead_followup_date_edit').val();
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

    $('#lead_followup_date_edit').datetimepicker({format: 'DD/MM/YYYY HH:mm', minDate:new Date(),viewMode: 'days'});
    $('#lead_followup_date_edit').val(lead_followup_date_edit);
    LoadReportDateRangepicker();
    $("#activityCode").change(getActivityLogs);
    $('#activityDate').on('apply.daterangepicker', getActivityLogs);
    $('#activityDate').on('cancel.daterangepicker', getActivityLogs);
    $("#activityType").change(getFollowupAndRemarks);
    $('#followupDate').on('apply.daterangepicker', getFollowupAndRemarks);
    $('#followupDate').on('cancel.daterangepicker', getFollowupAndRemarks);
    getCommunicationLogSummary();
    $("#communicationType").change(getCommunicationLogs);
    $('#communicationDate').on('apply.daterangepicker', getCommunicationLogs);
    $('#communicationDate').on('cancel.daterangepicker', getCommunicationLogs);
    $("#ticketStatus").change(getTickets);
    $('#ticketDate').on('apply.daterangepicker', getTickets);
    $('#ticketDate').on('cancel.daterangepicker', getTickets);
    $("#CommunicationSingleAction").find('div.loader-block').remove();

    if ($('.dynamicRegMultiValue').length > 0) {//for multivalue dynamic registraion fields
        $('.dynamicRegMultiValue').each(function () {
            var regId = $(this).attr('id');
            $('select#' + regId).SumoSelect({placeholder: $(this).data('placeholder'), search: true, searchText: 'select', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true});
            $(this).data("prev",$(this).val());
            if( typeof $(this).data("limit") !== "undefined" && parseInt($(this).data("limit")) > 0 ){
                $(this).on('change', function(evt) {
                    if ($(this).val() != null && $(this).val().length > parseInt($(this).data("limit"))) {
                        alert('Max '+parseInt($(this).data("limit"))+' selections allowed!');
                        var $this           = $(this);
                        var optionsToSelect = $(this).data("prev");
                        $this[0].sumo.unSelectAll();
                        $.each(optionsToSelect, function (i, e) {
                            $this[0].sumo.selectItem($this.find('option[value="' + e + '"]').index());
                        });
                        last_valid_selection    = optionsToSelect;
                    } else if($(this).val() != null){
                        $(this).data("prev",$(this).val());
                    }
                });
            }
        });
    }
    //get summary of ivr call log
    if($("#ivrCallSummary").length){
        getIvrCallLogSummary();
    }
    //calling
    setTimeout(function() {
        $('.calling').fadeOut('fast');
    }, 30000); // <-- 30 secound

	// Steps
var back =jQuery(".prev");
		var	next = jQuery(".next");
		var	steps = jQuery(".step");

		next.bind("click", function() {
			jQuery.each( steps, function( i ) {
				if (!jQuery(steps[i]).hasClass('current') && !jQuery(steps[i]).hasClass('done')) {
					jQuery(steps[i]).addClass('current');
					jQuery(steps[i - 1]).removeClass('current').addClass('done');
					return false;
				}
			})
		});
		back.bind("click", function() {
			jQuery.each( steps, function( i ) {
				if (jQuery(steps[i]).hasClass('done') && jQuery(steps[i + 1]).hasClass('current')) {
					jQuery(steps[i + 1]).removeClass('current');
					jQuery(steps[i]).removeClass('done').addClass('current');
					return false;
				}
			})
		});

	/*** Mobile & Tablet Screens ***/
	if (document.documentElement.clientWidth < 992) {
		$('.profileSideMenu [data-toggle="tooltip"]').tooltip({
			placement: 'top',
		})
		$('.nextPrevBtn [data-toggle="tooltip"]').tooltip({
			placement: 'bottom',
		})
		//$('.profileSideMenu').removeClass('fadeInRight');
		//$('.profileSideMenu').addClass('fadeInUp');
	}
	if (document.documentElement.clientWidth > 993) {
		$('[data-toggle="tooltip"]').tooltip({ trigger : 'hover'});
		//$('.profileSideMenu').removeClass('fadeInUp');
		//$('.profileSideMenu').addClass('fadeInRight');
	}
        $(".close",$("#followupModal")).on('click',oncloseStagePopup);

    $("#MakeEditable").click(function(){
        getLeaduploadedFiles();
        getCounsellorForFollowups();
    });
    
    if($(".registration-date-time").length){
        $(".registration-date-time").each(function(){
            var dateFormat  = $(this).data("format");
            var startDate   = $(this).data("startdate");
            var endDate     = $(this).data("enddate");
            var customdays  = $(this).data("customdays");
            var startDateArr = startDate.split("/");
            var endDateArr = endDate.split("/");

            var daysOfWeekDisabledArr = [];
            if(typeof customdays !='undefined'){
                for (var weekkey in customdays.weeks) {
                    if(customdays.weeks[weekkey] === '0'){
                        daysOfWeekDisabledArr.push(weekkey);
                    }
                }
            }

            var startDateNew = startDateArr[2] + "-" + startDateArr[1] + "-" + startDateArr[0];
            var endDateArrNew = endDateArr[2] + "-" + endDateArr[1] + "-" + endDateArr[0];

            if(dateFormat=='DD/MM/YYYY'){
                $(this).datetimepicker({ format: "DD/MM/YYYY HH:mm", minDate: new Date(startDateNew), maxDate: new Date(endDateArrNew) });
            }else if(dateFormat=="MM/YYYY"){
                $(this).datepicker({startView : 'decade', format : 'mm/yyyy', minViewMode: "months",startDate: startDate,endDate:endDate});
            }else if(dateFormat=="YYYY"){
                $(this).datepicker({startView : 'decade', format : 'yyyy', minViewMode: "years", startDate: String(startDate), endDate:String(endDate)});
            }
        });
    }
});

$(window).load(function(){
        runAutoLoadJs();
	$('#userProfileLoaderPage').hide();
	$('.arrow-steps').addClass('fadeIn');
	/*$('.resp-accordion').click(function(){
		var xya = $(this).attr('aria-controls');
		alert(xya);
	});*/

	/*$("h2.resp-accordion[aria-controls=tab_item-0]").click(function(){
		alert("fsdfsd");
	});*/
	$("h2.resp-accordion[aria-controls=tab_item-1]").click(function(){
		getActivityLogs();
	});
	$("h2.resp-accordion[aria-controls=tab_item-2]").click(function(){
		getFollowupAndRemarks();
	});
	$("h2.resp-accordion[aria-controls=tab_item-3]").click(function(){
		getCommunicationLogs();
	});
	$("h2.resp-accordion[aria-controls=tab_item-4]").click(function(){
		getApplicantDocuments();
	});
	$("h2.resp-accordion[aria-controls=tab_item-5]").click(function(){
		getTickets();
	});
	$("h2.resp-accordion[aria-controls=tab_item-6]").click(function(){
		getIvrDetails();
	});

});
$('#lead_followup_date').on("blur", function() {
   if(($("#moduleName").val() == "lead" || $("#moduleName").val() == "application" ) && $('#lead_followup_date').val() != "" && ($("#actionType").val() == "followup" || $("#actionType").val() == "stage")) {
        $("#followup_error").hide();
        // $("#div_followup_check").show();
   } /*else {
       $("#div_followup_check").hide();
   }*/
});
// $('#lead_followup_date_edit').on("blur", function() {
//    if(($("#moduleName").val() == "lead" || $("#moduleName").val() == "application" ) && $('#lead_followup_date_edit').val() != "") {
//         $("#div_followup_check_edit").show();
//    } else {
//        $("#div_followup_check_edit").hide();
//    }
// });
$("#lead_stage").on("change", function() {
    if($("#moduleName").val() == "application") {
        $("#stage_error").hide();
    }
});
function getLeadStagePermissions(){
    $.ajax({
        url: jsVars.getLeadStagePermissionsLink,
        type: 'post',
        data: {'group': jsVars.group, 'userId' : $("#userId").val(), 'collegeId':$("#collegeId").val(), 'moduleName':$("#moduleName").val(), 'formId':$("#formId").val()},
        dataType: 'html',
        async   : false,
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#userProfileLoader').show();
        },
        complete: function () {
            $('#userProfileLoader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    disallowDown            = responseObject.data.disallow_down;
                    disallowFollowup        = responseObject.data.disallow_followup;
                    disallowRemark          = responseObject.data.disallow_remark;
                    disallowCommunication   = responseObject.data.disallow_communication;
                    if(disallowCommunication==true){
                        $(".communicationButton").hide();
                    }
                    currentStage            = responseObject.data.stage;
                    currentSubStage         = responseObject.data.sub_stage;
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


function communicate(lmsCommunicate,userId, module,type){
    if(disallowCommunication){
        alert("You can not communicate at this stage");
        return false;
    }
    if(module=='lead'){
        if(type=='whatsapp') {
            ClickToWhatsApp($("#userId").val(),0,'userleads', $("#collegeId").val());
        } else {
            singleCommunicationWindow($("#userId").val(),0,'userleads', $("#collegeId").val());
        }
        $('#CommunicationSingleAction').on('hidden.bs.modal', function () {
            getCommunicationLogSummary();
            getCommunicationLogs();
        });
    }else{
        var openedWindow    = window.open('/form/preview/'+lmsCommunicate, 'prev_'+userId, 'width=1200, height=600, scrollbars=yes, left=100, top=50');
        $(openedWindow).on("beforeunload", function(){
            getCommunicationLogSummary();
            getCommunicationLogs();
        });
    }
    return;
}

followUpAction  = '';
showSubStage = '';
function resetFollowup(action_type){
    $('#counsellorListDiv').html("");
    $('#remark_error, #sub_stage_error, #followup_error, #stage_error').hide();
    $('.followup_error_msg').hide();
    $("#lead_followup_date").val('');
    $("#lead_remark").val('');
    $("#lead_stage").val(currentStage);
    $("#div_followup_check").hide();
    $('input[name=leadFollowupCheck]').attr('checked', false);
    $('#lead_stage').trigger("chosen:updated");
	$('#lead_followup_date').attr('placeholder', 'Followup Date');
	$('#lead_followup_date, #lead_remark').parent().removeClass('floatify__active');
	floatableLabel();
    if ($("#lead_sub_stage").length > 0) { //$("#moduleName").val() == 'lead') &&
        if ((typeof isLeadSubStageConfigure != 'undefined') && (isLeadSubStageConfigure == 1)) {
            showSubStage = 'show';
        }
        $("#lead_sub_stage").val(currentSubStage);
        $('#lead_sub_stage').trigger("chosen:updated");
    }
    $("#actionType").val(action_type);
    getLeadStages($("#moduleName").val(), action_type);
    /**
     * If action_type is not blank then show/hide the div as per action name
     */
    if(typeof action_type !== 'undefined') {
        followUpAction  = action_type;
        getActivityLogsForStagePopup('reset');
    }

	if(action_type == 'stage') {
            var dynamicModuleName = $('#resetStage').attr('data-original-title');
            $('#followupModal .modal-title').text(dynamicModuleName);
    }
	if(action_type == 'note') {
        $('#followupModal .modal-title').text('Add Note');
    }
	if(action_type == 'followup') {
        $('#followupModal .modal-title').text('Add Followup');
    }
    $('#followUpMessageDiv').html("").hide();
}

function followUp(){
    var requestPosts = {};
    $("#followUpMessageDiv").html("").show();
    $('.followup_error_msg').html('');
    var leadStages      = $.parseJSON($("#leadStageList").val());
    if(currentStage && disallowDown){
        if(leadStages.indexOf(parseInt(currentStage)) > leadStages.indexOf(parseInt($("#lead_stage").val()))){
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

    moduleName = $("#moduleName").val() != "" ? $("#moduleName").val() : '';
    if(followUpAction == 'stage' && $('#lead_stage').val()=='') {
        $("#stage_error").html("Mandatory to select "+ moduleName +" stage.");
        $("#stage_error").show();
        return;
    }
    if(followUpAction == 'followup' && $('#lead_followup_date').val()=='') {
        $("#followup_error").html("Followup date cannot be blank.");
        $("#followup_error").show();
        return;
    }
    if(followUpAction == 'note' && $('#lead_remark').val()=='') {
        $("#remark_error").html("Note field cannot be blank.");
        $("#remark_error").show();
        return;
    }

    var leadFollowupCheck = false;
    if ($("#leadFollowupCheck").length > 0 && $('input[name=leadFollowupCheck]').is(':checked') == true) {
        leadFollowupCheck = true;
    }
    var addNewFollowUptoggle = 0
    if($("#new_follow_up_toggle").is(':checked'))
    {addNewFollowUptoggle = 1}
    requestPosts = {'userId' : $("#userId").val(), 'collegeId':$("#collegeId").val(), 'leadStage':$("#lead_stage").val(),'leadSubStage':$("#lead_sub_stage").val(), 'leadRemark':$("#lead_remark").val(), 'leadFollowupDate':$("#lead_followup_date").val(), 'moduleName':$("#moduleName").val(), 'formId':$("#formId").val(), 'actionType':$("#actionType").val(), 'leadFollowupCheck': leadFollowupCheck, 'isInlineErr':1,'addNewFollowUptoggle':addNewFollowUptoggle};

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
    requestPosts["isTelephonyCall"] =0;
    //set Telephony call
    if (($('form#UserProfileSave input#is_called').length) && ($('form#UserProfileSave input#is_called').val() == 1)) {//set outbound call
        requestPosts["isTelephonyCall"] = 1;
    } else if (($('form#UserProfileSave input#is_ivr_call').length) && ($('form#UserProfileSave input#is_ivr_call').val() == 1)) {//set inbound call
        requestPosts["isTelephonyCall"] = 1;
    } else if (($('form#UserProfileSave input#isCampaigncall').length) && ($('form#UserProfileSave input#isCampaigncall').val() == 1)) {//set campaign call
        requestPosts["isTelephonyCall"] = 1;
    }

    //set campaign call
    if ((requestPosts["isTelephonyCall"] === 1) && ($('form#UserProfileSave input#mongoId').length)) {
        requestPosts["telephonyCallMongoId"] = $('form#UserProfileSave input#mongoId').val();
    }
    var moduleName = $("#moduleName").val();
    var formId = $("#formId").val();
    var ajaxError = 0;
    $.ajax({
        url: jsVars.followUpLink,
        type: 'post',
        data: requestPosts,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#userProfileLoader').show();
        },
        complete: function () {
            //$('#followupModal').modal('hide');
            $('#userProfileLoader').hide();
            $("#saveFollowUpButton").show();
            $("#saveFollowUpButtonWait").hide();
            $('#saveFollowUpButton').removeAttr('disabled');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    disallowDown            = responseObject.data.disallow_down;
                    disallowFollowup        = responseObject.data.disallow_followup;
                    disallowRemark          = responseObject.data.disallow_remark;
                    disallowCommunication   = responseObject.data.disallow_communication;
                    currentStage            = responseObject.data.stage;
                    currentSubStage         = responseObject.data.sub_stage;
                    /***  update lead detail edit ***/
                    var updateEditBox = 1;
                    if((moduleName =='lead' && leadApplicationSamePage == true)){ // change lead stage from application page
                        updateEditBox = 0;
                    }
                    if(currentStage !='undefined' && currentStage != '' && $("#lead_stage_name").length >0 && updateEditBox){
                        $("#lead_stage_name").val(currentStage);
                        $('#lead_stage_name').trigger("chosen:updated");
                        if($("#lead_sub_stage_name").length >0){
                            if(moduleName == 'application'){
                                getApplicationSubStages('NA', currentStage, 'lead_sub_stage_name', 'chosen', 'leadSubStagesNameDiv');
                            } else {
                                getLeadSubStages($("#collegeId").val(), currentStage, 'lead_sub_stage_name', 'chosen', 'leadSubStagesNameDiv');
                            }
                        }
                    }
                    if(currentSubStage !='undefined' && currentSubStage != '' && $("#lead_sub_stage_name").length >0 && updateEditBox){
                        setTimeout(function () {
                            $("#lead_sub_stage_name").val(currentSubStage);
                            $('#lead_sub_stage_name').trigger("chosen:updated");
                        },2000);
                    }
                    if(disallowCommunication==true){
                        $(".communicationButton").hide();
                    }else{
                        $(".communicationButton").show();
                    }

                    //For only CRM
                    if(jsVars.isOnlyCRMInstitute){
                        resetOCLeadDetailTimeLine();
                    }
                    $('#followupModal').modal('hide');
                    if($("h2.resp-accordion[aria-controls=tab_item-2]").hasClass('resp-tab-active')){
                        getFollowupAndRemarks();
                    }
                    if($("h2.resp-accordion[aria-controls=tab_item-1]").hasClass('resp-tab-active')){
                        getActivityLogs();
                    }
                    alertPopup('Details saved successfully.','success');
                    //$(".leadStageBox a").html($("#lead_stage option:selected").text()+"&nbsp;<span class=\"draw-pencil\"></span>");
                    //window.location.reload();
                }
            }else{
                $("#moduleName").val(moduleName);
                ajaxError = 1;
                $('#remark_error, #sub_stage_error, #followup_error, #stage_error, #mark_overdue_fu_permission_error').hide();
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
                            if(validationErrObj.mark_overdue_fu_permission_error != undefined) {
                                $('#mark_overdue_fu_permission_error').show();
                                $('#mark_overdue_fu_permission_error').html(validationErrObj.mark_overdue_fu_permission_error);
                            }
                        }
                    }
                }
            }
            // $('#saveFollowUpButton').attr('disabled',false);
            $("#saveFollowUpButton").show();
            $("#saveFollowUpButtonWait").hide();
            if(moduleName == 'application') {
                $("#moduleName").val(moduleName);
                $("#formId").val(formId);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $("#saveFollowUpButton").show();
            $("#saveFollowUpButtonWait").hide();
            $('#saveFollowUpButton').removeAttr('disabled');
        }
    });
    if(leadApplicationSamePage == true && ajaxError ==0){
        $("#moduleName").val(leadApplicationModuleName);
        $("#formId").val(leadApplicationFormId);
    }
}

function resetOCLeadDetailTimeLine() {
    return;
     if(jsVars.isOcApplicationEnable && jsVars.ocApplicationStages.length > 0){
        var ocAppSubFieldName = jsVars.isOcApplicationStageType;
        if(jsVars.isOcApplicationStageType=='lead'){
            ocAppSubFieldName = 'lead_stage';
        }
        if(jsVars.ocApplicationStages.indexOf($("#"+ocAppSubFieldName).val()) > -1){
            $('#ocAppSubmitted').addClass('filled');
            $('#ocAppSubmittedCount').html('1');
        }else{
            $('#ocAppSubmitted').removeClass('filled');
            $('#ocAppSubmittedCount').html('0');
        }
    }

    if(jsVars.isOcApplicationStartedEnable && jsVars.ocApplicationStartedStages.length > 0){
        var ocAppStartedFieldName = jsVars.isOcPaymentApprovedStageType;
        if(jsVars.isOcApplicationStartedStageType=='lead'){
            ocAppStartedFieldName = 'lead_stage';
        }
        if(jsVars.ocApplicationStartedStages.indexOf($("#"+ocAppStartedFieldName).val()) > -1){
            $('#ocApplicationStarted').addClass('filled');
            $('#ocApplicationStartedCount').html('1');
        }else{
            $('#ocApplicationStarted').removeClass('filled');
            $('#ocApplicationStartedCount').html('0');
        }
    }

    if(jsVars.isOcPaymentApprovedEnable && jsVars.ocPaymentApprovedStages.length > 0){
        var ocAppApprovedFieldName = jsVars.isOcPaymentApprovedStageType;
        if(jsVars.isOcApplicationStageType=='lead'){
            ocAppApprovedFieldName = 'lead_stage';
        }
        if(jsVars.ocPaymentApprovedStages.indexOf($("#"+ocAppApprovedFieldName).val()) > -1){
           $('#ocPaymentApproved').addClass('filled');
           $('#ocPaymentApprovedCount').html('1');
       }else{
           $('#ocPaymentApproved').removeClass('filled');
           $('#ocPaymentApprovedCount').html('0');
       }
    }

    if(jsVars.isOcEnrollmentEnable && jsVars.ocEnrollmentStages.length > 0){
        var ocEnrollmentFieldName = jsVars.isOcEnrollmentStageType;
        if(jsVars.isOcApplicationStageType=='lead'){
            ocEnrollmentFieldName = 'lead_stage';
        }
        if(jsVars.isOcEnrollmentEnable && jsVars.ocEnrollmentStages.length > 0 && jsVars.ocEnrollmentStages.diff(jsVars.ocApplicationStages).length === 0 && jsVars.ocEnrollmentStages.indexOf($("#"+ocEnrollmentFieldName).val()) > -1){
            $('#ocEnrolment').addClass('filled');
            $('#ocEnrolmentCount').html('1');
        }else{
            $('#ocEnrolment').removeClass('filled');
            $('#ocEnrolmentCount').html('0');
        }
    }
}

var userActivityGroupsLoaded = false;
function getActivityLogs(listingType){
    $('#userProfileLoader').show();
    if(listingType !== 'loadmore'){
        $("#activityPage").val(1);
        if($("#scoreSpan").length){
            //getLeadScoreAndStrength();
        }
    }else{
        $("#LoadMoreActivity").hide();
    }

    if(!userActivityGroupsLoaded){
        getUserActivityGroups();
    }
    $.ajax({
        url: jsVars.getUserActivityLogsLink,
        type: 'post',
        data: {'userId' : $("#userId").val(), 'userName' : $("#userName").val(), 'collegeId':$("#collegeId").val(), 'dateRange':$("#activityDate").val(), 'activityGroup':$("#activityCode").val(), 'moduleName':$("#moduleName").val(), 'formId':$("#formId").val(), 'page':$("#activityPage").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#userProfileLoader').show();
        },
        complete: function () {
            $('#userProfileLoader').hide();
        },
        success: function (html) {
            $("#LoadMoreActivity").show();
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
            }else{
                html    = html.replace("<head/>", "");
                var countRecord = countResult(html);
                if(listingType !== 'loadmore'){
                    $("#activityLogsDiv").html(html);
                }else{
                    $('#activityLogsDiv').find("ul").append(html);
                }
                if(countRecord < 10){
                    $('#LoadMoreActivity').hide();
                }else{
                    $('#LoadMoreActivity').show();
                }
                $("#activityPage").val(parseInt($("#activityPage").val())+1);
				$('.timeline [data-toggle="tooltip"]').tooltip();
                //play one player at a time
                document.addEventListener('play', function(e){
                    var audios = document.getElementsByTagName('audio');
                    for(var i = 0, len = audios.length; i < len;i++){
                        if(audios[i] !== e.target){
                            audios[i].pause();
                        }
                    }
                }, true);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getUserActivityGroups(){
    userActivityGroupsLoaded    = true;
    $.ajax({
        url: jsVars.getUserActivityGroupsLink,
        type: 'post',
        data: {'userId' : $("#userId").val(), 'collegeId':$("#collegeId").val(), 'moduleName':$("#moduleName").val(), 'formId':$("#formId").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#userProfileLoader').show();
        },
        complete: function () {
            $('#userProfileLoader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                if(typeof responseObject.data.activityTypeList === "object"){
                    $.each(responseObject.data.activityTypeList, function (index, item) {
                        $("#activityCode").append('<option value="'+index+'">'+item+'</option>');
                    });
                    $('#activityCode').trigger("chosen:updated");
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
    var activityList    = [];
    switch(followUpAction){
        case 'stage':
            $('#div_profile_stage').show();
            if ((showSubStage == 'show') && $('#div_profile_sub_stage').length > 0) {
            $('#div_profile_sub_stage').show();
            }
            $('#div_profile_follow_up_date').show();
            $('#div_profile_remarks').show();
            activityList    = ['10014','10112','10013','10012','10291'];
            break;
        case 'followup':
            $('#div_profile_stage').hide();
            if ($('#div_profile_sub_stage').length > 0) {
            $('#div_profile_sub_stage').hide();
            }
            $('#div_profile_follow_up_date').show();
            $('#div_profile_remarks').show();
            activityList    = ['10013','10012','10291'];
            break;
        case 'note':
            $('#div_profile_stage').hide();
            if ($('#div_profile_sub_stage').length > 0) {
            $('#div_profile_sub_stage').hide();
            }
            $('#div_profile_follow_up_date').hide();
            $('#div_profile_remarks').show();
            activityList    = ['10012', '10507'];
            break;
    }
    if(jsVars.showActivity){
        $.ajax({
            url: jsVars.getUserActivityLogsLink,
            type: 'post',
            data: {'userId' : $("#userId").val(), 'userName' : $("#userName").val(), 'collegeId':$("#collegeId").val(), 'activityCode':activityList, 'moduleName':$("#moduleName").val(), 'formId':$("#formId").val(), 'page':$("#stageActivityPage").val(), 'viewType':'popup'},
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars.csrfToken
            },
            beforeSend: function () {
                $('#userProfileLoader').show();
            },
            complete: function () {
                $('#userProfileLoader').hide();
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
}

function countResult(html){
    var len = (html.match(/tmMsg/g) || []).length;
    return len;
}

function getFollowupAndRemarks(){
    $.ajax({
        url: jsVars.getFollowUpAndRemarksLink,
        type: 'post',
        data: {'userId' : $("#userId").val(), 'userName' : $("#userName").val(), 'collegeId':$("#collegeId").val(), 'dateRange':$("#followupDate").val(), 'activityType':$("#activityType").val(), 'moduleName':$("#moduleName").val(), 'formId':$("#formId").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#userProfileLoader').show();
        },
        complete: function () {
            $('#userProfileLoader').hide();
        },
        success: function (html) {
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
            }else{
                html    = html.replace("<head/>", "");
                $("#followupAndRemarksListingDiv").html(html);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getCommunicationLogSummary(){
    $.ajax({
        url: jsVars.getCommunicationLogSummaryLink,
        type: 'post',
//        data: {'group': jsVars.group,'userId' : $("#userId").val(), 'collegeId':$("#collegeId").val(), 'moduleName':$("#moduleName").val(), 'formId':$("#formId").val()},
        data: {'group': jsVars.group,'userId' : $("#userId").val(), 'collegeId':$("#collegeId").val(), 'moduleName':'lead', 'formId':0},
        dataType: 'html',
//        async   : false,
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#userProfileLoader').show();
        },
        complete: function () {
            $('#userProfileLoader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    $(".communicationLogEmailSentCount").html(responseObject.data.emailSent);
                    $("#communicationLogEmailOpenRate").html(responseObject.data.emailOpenRate+'%');
                    $("#communicationLogEmailClickRate").html(responseObject.data.emailClickRate+'%');
                    $("#communicationLogEmailBouncedCount").html(responseObject.data.emailBounced);
                    $(".communicationLogSmsSentCount").html(responseObject.data.smsSent);
                    $("#communicationLogSmsDeliveredCount").html(responseObject.data.smsDelivered);
                    if(parseInt(responseObject.data.emailSent) > 0 || parseInt(responseObject.data.smsSent) > 0){
                        $("#communicationLogFiltersDiv").show();
                    }
                    if(responseObject.data.whatsappConfig === true){
                        $(".whatsappReportDiv").show();
                        $(".communicationLogWhatsappSentCount").html(responseObject.data.whatsappSent);
                        $("#communicationLogWhatsappDeliveredCount").html(responseObject.data.whatsappDelivered);
                        $("#communicationLogWhatsappClickRate").html(responseObject.data.whatsappClicked);
                        $("#communicationLogWhatsappUnsubscribeCount").html(responseObject.data.WhatsappUnsubscribe);
                        $("#communicationLogAutoReplyCount").html(responseObject.data.WhatsappAutoReply);
                    }else{
                        $(".whatsappReportDiv").hide();
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

function getLeadScoreAndStrength(){
    $.ajax({
        url: jsVars.getLeadScoreAndStrengthLink,
        type: 'post',
        data: {'userId' : $("#userId").val(), 'collegeId':$("#collegeId").val()},
        dataType: 'html',
        async   : false,
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    $("#scoreSpan").html(responseObject.data.score);
                    $("#strengthSpan").html(responseObject.data.strength+'% ile');
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

function getCommunicationLogs(listingType){

    if(listingType !== 'loadmore'){
        $("#communicationPage").val(1);
        if($("#scoreSpan").length){
            //getLeadScoreAndStrength();
        }
    }
    $.ajax({
        //url: jsVars.getCommunicationLogsLink,
        url: jsVars.getUserActivityLogsLink,
        type: 'post',
        data: {
            //'userId' : $("#userId").val(), 'userName' : $("#userName").val(), 'collegeId':$("#collegeId").val(), 'dateRange':$("#communicationDate").val(),'activityType':$("#communicationType").val(), 'activityGroup':'Communicate', 'moduleName':$("#moduleName").val(), 'formId':$("#formId").val(), 'page':$("#communicationPage").val()},
            'userId' : $("#userId").val(), 'userName' : $("#userName").val(), 'collegeId':$("#collegeId").val(), 'dateRange':$("#communicationDate").val(),'activityType':$("#communicationType").val(), 'activityGroup':'Communicate', 'moduleName':'lead', 'formId':0, 'page':$("#communicationPage").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#userProfileLoader').show();
        },
        complete: function () {
            $('#userProfileLoader').hide();
        },
        success: function (html) {
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
            }else{
//                html    = html.replace("<head/>", "");
//                $("#communicationLogsListingDiv").html(html);
                var countRecord = countResult(html);
                if(listingType !== 'loadmore'){
                    $("#communicationLogsListingDiv").html(html);
                }else{
                    $('#communicationLogsListingDiv').find("ul").append(html);
                }
                if(countRecord < 10){
                    $('#LoadMoreCommunication').hide();
                }else{
                    $('#LoadMoreCommunication').show();
                }
                $("#communicationLogFiltersDiv").show();
                $("#communicationPage").val(parseInt($("#communicationPage").val())+1);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getApplicantDocuments(){
    $.ajax({
        url: jsVars.getApplicantDocumentsLink,
        type: 'post',
        data: {'userId' : $("#userId").val(), 'collegeId':$("#collegeId").val(), 'userName' : $("#userName").val(), 'moduleName':$("#moduleName").val(), 'formId':$("#formId").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#userProfileLoader').show();
        },
        complete: function () {
            $('#userProfileLoader').hide();
        },
        success: function (html) {
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
            }else{
                html    = html.replace("<head/>", "");
                $("#applicantDocumentsListingDiv").html(html);
                if ($('.chosen-select').length > 0) {
                    $('.chosen-select').chosen();
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function downloadFile(file,fileFieldId){
    if(typeof fileFieldId !=='undefined' && fileFieldId != '') {
        document.getElementById('downloadDocumentIframe').src = jsVars.downloadApplicantDocumentsLink+'&'+fileFieldId;
    } else {
        document.getElementById('downloadDocumentIframe').src = jsVars.downloadFileLink+"/"+file;
    }
}

function downloadApplicantDocuments(){
    if($(".docName").length<1){
        alert("No document to download !");
        return;
    }
    document.getElementById('downloadDocumentIframe').src = jsVars.downloadApplicantDocumentsLink;
}

function getTickets(){
    $.ajax({
        url: jsVars.getTicketsLink,
        type: 'post',
        data: {'userId' : $("#userId").val(), 'collegeId':$("#collegeId").val(), 'userName' : $("#userName").val(), 'dateRange':$("#ticketDate").val(), 'status':$("#ticketStatus").val(), 'moduleName':$("#moduleName").val(), 'formId':$("#formId").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#userProfileLoader').show();
        },
        complete: function () {
            $('#userProfileLoader').hide();
        },
        success: function (html) {
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
            }else{
                html    = html.replace("<head/>", "");
                $("#ticketsListingDiv").html(html);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function saveLeadMergeData(){
    var leadMergeData = '';
    leadMergeData = $("#LeadMergeForm").serializeArray();
//    console.log(leadMergeData);
     $.ajax({
        url: '/counsellors/saveLeadMergeData',
        type: 'post',
        data: leadMergeData,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#userProfileLoader').show();
            $("#saveLeadMerge").prop('disabled',true);
        },
        complete: function () {
            $('#userProfileLoader').hide();
        },
        success: function (data) {
            if (data.status == 'success'){
                $(".leadMergeError").removeClass('alert-danger').addClass("alert-success alert");
                $(".leadMergeError").html(data.message);
//                console.log(data);
            }else{
                $(".leadMergeError").removeClass('alert-success').addClass("alert-danger alert");
                $(".leadMergeError").html(data.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
function showLeadMergePopUp(){
    $('div#LeadMergeModalBox').modal('show');
    $(".confirmLeadMerge").html("");
}

function saveProfileUsers(form){

    let requestCheck = $("#saveProfileButton").attr("data-requestrunning");
    if(requestCheck == 1)
    {
        return false;
    }

    if(runConditionalJs()){
        return false;
    }
    if(typeof form == "undefined"){
        $('div#LeadMergeModalBox').modal('hide');
    }
    $("#actionType").val('stage');
    $("select.dynamicRegMultiValue option:selected").removeAttr('disabled');
    if($("#lead_followup_date_edit").val()!='' && $("#follow_up_assigned_to").val()=='' && counsellorsAvailableForFollowup===true){
        alertPopup('Please select a counsellor to add follow-up.', 'error');
        return false;
    }

//    var leadMobile = $("#leadMobile").val();
//    var changedMobile = $("#Mobile").val();
//    var isOtpVerified = $("#isOtpVerified").val();
//    if((leadMobile != changedMobile) && ($(".otpEnable").length > 0))
//    {
//        if(isOtpVerified != 'verified')
//        {
//            alertPopup('Please enter otp and verify the mobile number', 'error');
//            return false;
//        }
//    }

    showLoader();
    $("#saveProfileButton").attr("data-requestrunning", 1);
    //var data = $(form).serializeArray();
    var data = new FormData($(form)[0]);
    $.ajax({
        url: jsVars.SaveProfileUrl,
        type: 'post',
        async: true,
        data: data,
        dataType: 'html',
        processData: false,
        contentType: false,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        complete: function() {
            hideLoader();
            $("#saveProfileButton").attr("data-requestrunning", 0);
        },
        success: function (response) {
                try {   //if json response comes
                    var data = JSON.parse(response);
                } catch (e) { //if html response comes
                    var data = response;
                }
                $(".confirmLeadMerge").html("");
                if(typeof data == 'object')
                {
                    if(data['error']) {
                        $('input[type="file"]').val('')
                        $('input[placeholder="Choose Your Files"]').val('')
                        //alert(data['error']);
                        alertPopup(data['error'], 'error');
                        $('#ErrorMsgBody').addClass('error')
                    }else if(data['status']==200 && data['type']=='leadmerge'){
//                        $(".modal-header").find("span").remove();
                        $('div#LeadMergeModalBox div#LeadMergeBody').html(data['html']);
                        $(".confirmLeadMerge").show().html(data['buttonText']);
//                        $('div#LeadMergeModalBox div#LeadMergeBody').html(data['html']);
//                        $('div#LeadMergeModalBox').modal('show');
//                        $("div#LeadMergeModalBox .modal-header").append("<span style='color:#fff;'>Lead Merge</span>");
                    }
                    
                    $('form').find('input[type=file]').val('')
                    $('form').find('input[type=file]').siblings('.form-control').val('');
                    $('#field_profile_picture_choose_files').val('')
                }
                else if($(form).attr('id')!='UserProfileSaveAdditional' &&
                        ($("#lead_stage_name").val()!='' || $("#lead_followup_date_edit").val() || $("#lead_remark_name").val())){
                        $("#ShowEditMode").hide();
                        $("#viewMode").html(data);
                        saveLeadStage(data);
                        //For only CRM
                        if(jsVars.isOnlyCRMInstitute){
                            resetOCLeadDetailTimeLine();
                        }
                }
                else {
                    $("#ShowEditMode").hide();
                    $("#ShowEditModeAdditional").hide();
                    if($(form).attr('id')=='UserProfileSaveAdditional'){
                        $("#viewModeAdditional").html(data);
                        $("#viewModeAdditional").show();
                    }else{
                        $("#viewMode").html(data);
                        if($('form#inboundUserProfileFormOnEdit').length > 0) {
                            $('form#inboundUserProfileFormOnEdit').submit();
                        }
                        $("#viewMode").show();
                    }
                    //For only CRM
                    if(jsVars.isOnlyCRMInstitute){
                        resetOCLeadDetailTimeLine();
                    }
                }
                hideVerificationPanel();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#already-registered div.loader-block').hide();
        }
    });
}

if($("#MakeEditable").length>0){
    if(typeof jsVars.cloud_telephony!='undefined' && jsVars.cloud_telephony==1){
        makeScrollable();
    }
    $("#otpverified, #otpunverified").hide();
    $("#viewMode").show();
    $("#ShowEditMode").hide();
    $("#MakeEditable").on('click',function(){
        if($("#ShowEditModeAdditional").length>0){
            $("#ShowEditModeAdditional").hide();
        }
        if($("#viewModeAdditional").length>0){
            $("#viewModeAdditional").hide();
        }
        $("#lead_followup_date_edit").val('');
        $("#lead_remark_name").val('');
        $("#ShowEditMode").show();
        $("#viewMode").hide();
        $("#otpverified, #otpunverified").hide();
    });
}
if ($("#lead_details").length > 0) {
    $("#lead_details").on('click', function () {
        $("#viewMode").show();
        $("#ShowEditMode").hide();
        $("#ShowEditModeAdditional").hide();
        $("#viewModeAdditional").hide();
        $(this).addClass('active');
        $('#additional_details').removeClass('active');
        hideVerificationPanel();
    });
}
$("#additional_details").on('click',function(){
    $("#viewMode").hide();
    $("#ShowEditMode").hide();
    $("#ShowEditModeAdditional").hide();
    $("#viewModeAdditional").show();
    if($("#viewModeAdditional").text()=='') {
        $("#ShowEditModeAdditional").show();
    }
    $(this).addClass('active');
    $('#lead_details').removeClass('active');
});
if($("#MakeEditableAdditional").length>0){
    $("#MakeEditableAdditional").on('click',function(){
        $("#viewMode").hide();
        $("#ShowEditMode").hide();
        $("#viewModeAdditional").hide();
        $("#ShowEditModeAdditional").show();
        getLeaduploadedFiles();
    });
}
//for saving lead details
function saveLeadStage(data){
    var leadSubStage = 0;
    if ($("#lead_sub_stage_name").length > 0) {
        leadSubStage = $("#lead_sub_stage_name").val();
    }

    var actionType = '';
    if ($("#actionType").val() != "") {
        actionType = $("#actionType").val();
    }

    var isTelephonyCall = 0;
    var telephonyCallMongoId = '';
    //set Telephony call
    if (($('form#UserProfileSave input#is_called').length) && ($('form#UserProfileSave input#is_called').val() == 1)) {//set outbound call
        isTelephonyCall = 1;
    } else if (($('form#UserProfileSave input#is_ivr_call').length) && ($('form#UserProfileSave input#is_ivr_call').val() == 1)) {//set inbound call
        isTelephonyCall = 1;
    } else if (($('form#UserProfileSave input#isCampaigncall').length) && ($('form#UserProfileSave input#isCampaigncall').val() == 1)) {//set campaign call
        isTelephonyCall = 1;
    }

    //set campaign call
    if ((isTelephonyCall === 1) && ($('form#UserProfileSave input#mongoId').length)) {
        telephonyCallMongoId = $('form#UserProfileSave input#mongoId').val();
    }

    $.ajax({
        url: jsVars.followUpLink,
        type: 'post',
        data: {'userId' : $("#userId").val(), "followupAssignedTo":$("#follow_up_assigned_to").val(), 'collegeId':$("#collegeId").val(), 'leadStage':$("#lead_stage_name").val(),'leadSubStage':leadSubStage, 'leadRemark':$("#lead_remark_name").val(), 'leadFollowupDate':$("#lead_followup_date_edit").val(), 'moduleName':$("#moduleName").val(), 'formId':$("#formId").val(), 'actionType': actionType, 'isTelephonyCall': isTelephonyCall, 'telephonyCallMongoId': telephonyCallMongoId , 'leadFollowupCheck' : 'false'},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#userProfileLoader').show();
        },
        complete: function () {
            $('#followupModal').modal('hide');
            $('#userProfileLoader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    $("#viewMode").html(data);
                    if($('form#inboundUserProfileFormOnEdit').length > 0) {
                        $('form#inboundUserProfileFormOnEdit').submit();
                    } else {
                        $("#ShowEditMode").hide();
                        alertPopup('Details saved successfully.','success');
                        $("#viewMode").show();
                    }

                }
                currentStage = $("#lead_stage_name").val();
                $("#div_followup_check_edit").hide();
            }else{
                alertPopup(responseObject.message,'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    $('input[name=leadFollowupCheck]').attr('checked', false);
}

function makeScrollable(){
    var tabLocation = $('#MakeEditable').offset().top-120;
    $('html, body').animate({scrollTop: tabLocation}, 500);
}

$(document).on('click', '.ivr-log-details', function(){
    var mongoid = $(this).data('mid');
    var cid = $(this).attr('title');
    var vender = $(this).data('vender');
    if(typeof mongoid !='undefined' && mongoid!=''){
        $.ajax({
            url: jsVars.getIvrDetailsLink,
            data: {mongoId: mongoid,collegeId: cid,vender:vender},
            dataType: "html",
            async: false,
            cache: false,
            type: "POST",
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('body div.loader-block').show();
                $("#ConfirmPopupArea").modal('hide');
            },
            complete: function () {
                $('body div.loader-block').hide();
            },
            success: function (data) {
                if (data === 'session_logout'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }
                data = data.replace("<head/>", '');
                $('#ActivityLogPopupArea .modal-title').html('Call Logs');
                $('#ActivityLogPopupHTMLSection').html(data);
                $('#ActivityLogPopupArea').modal({backdrop: 'static', keyboard: false});
                //$('#ActivityLogPopupArea .modal-header').css('background-color', '#a0c348');
                $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
                //$('#ActivityLogPopupArea .modal-dialog').css('width', '600px');
            },
            error: function (response) {
                alertPopup(response.responseText);
            },
            failure: function (response) {
                alertPopup(response.responseText);
            }
        });
    }else{
        alertPopup('Id not found');
    }
});

function getIvrDetails(listingType){
    if(listingType !== 'loadmore'){
        $("#ivrPage").val(1);
        getIvrCallLogSummary();
    }
    $.ajax({
        url: jsVars.getIvrActivityLogs,
        type: 'post',
        data: {'userId' : $("#userId").val(), 'userName' : $("#userName").val(), 'collegeId':$("#collegeId").val(), 'activityCode':$("#activity_code").val(), 'moduleName':$("#moduleName").val(), 'formId':$("#formId").val(), 'page':$("#ivrPage").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#userProfileLoader').show();
        },
        complete: function () {
            $('#userProfileLoader').hide();
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
                    $("#avrLogsDiv").html(html);
                }else{
                    $('#avrLogsDiv').find("ul").append(html);
                }
                if(countRecord < 10){
                    $('#LoadMoreIvr').hide();
                }else{
                    $('#LoadMoreIvr').show();
                }
                $("#ivrPage").val(parseInt($("#ivrPage").val())+1);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function showProfileNoteList(listingType){
    if(listingType !== 'loadmore'){
        $("#ivrPage").val(1);
    }
    $.ajax({
        url: jsVars.getIvrActivityLogs,
        type: 'post',
        data: {'userId' : $("#userId").val(), 'userName' : $("#userName").val(), 'collegeId':$("#collegeId").val(), 'activityCode':$("#activity_code").val(), 'moduleName':$("#moduleName").val(), 'formId':$("#formId").val(), 'page':$("#ivrPage").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#userProfileLoader').show();
        },
        complete: function () {
            $('#userProfileLoader').hide();
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
                    $("#avrLogsDiv").html(html);
                }else{
                    $('#avrLogsDiv').find("ul").append(html);
                }
                if(countRecord < 10){
                    $('#LoadMoreIvr').hide();
                }else{
                    $('#LoadMoreIvr').show();
                }
                $("#ivrPage").val(parseInt($("#ivrPage").val())+1);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/**
 * This function will use when counsellor update the profile then display
 * updated data in Lead Status/Lead Source and so on
 * @param {type} json_data
 * @returns {undefined}
 */
function showUpdateData(json_data){
    if(json_data!='') {
        var parseData=jQuery.parseJSON(json_data);
        if(typeof parseData['lead_status'] !=='undefined') {
            $('#profile_lead_status_div').html(parseData['lead_status']);
            if(parseData['lead_status']=='Verified'){
                $("#email").prop("disabled",true);
                $("#Mobile").prop("disabled",true);
                $("#countryDialCodeId").prop("disabled",true);
            }
        }

        //add Lead Source
        if(typeof parseData['lead_source'] !=='undefined') {
            $('#profile_lead_source_div').html(parseData['lead_source']);
        }

        if(typeof parseData['change_graph'] !== 'undefined') {
            $( "div.lead-step:eq(0)" ).removeClass('active');
            $( "div.lead-step:eq(0)" ).addClass('filled');
            $( "div.lead-step:eq(1)" ).addClass('active');
            if(parseData['change_graph'] == 2) {
                $( "div.lead-step:eq(1)" ).removeClass('active');
                $( "div.lead-step:eq(1)" ).addClass('filled');
                $( "div.lead-step:eq(2)" ).addClass('active');
            }
        }

        if(typeof parseData['email_sent'] !=='undefined') {
            $('.communicationLogEmailSentCount').html(parseInt($('.communicationLogEmailSentCount').html())+1);
        }
        if(typeof parseData['email_id_change'] !=='undefined') {
            $('#successmessage').html("");
            if(jsVars.emailByPass)
            {
                alertPopup("Email Id has been updated and mail sent to " + parseData['email_id_change'] + ". Once an applicant clicks on the link, the email id will be marked as verified.", 'success');
            }else{
                alertPopup("Email Id has been updated and verification mail sent to " + parseData['email_id_change'] + " . Once an applicant clicks on the verification link, the email id will be marked as verified.", 'success');
            }
//            $('#successmessage').html();
        }
        if(typeof parseData['overwrite_email_sent'] !=='undefined') {
            $('#successmessage').html("");
            alertPopup("Confirmation mail to change email id has been sent to applicant. Once applicant clicks on the verification link, new email id will be updated.", 'success');

//            $('#successmessage').html();
        }
        //mobile_status
        if(typeof parseData['mobile_status'] !=='undefined' && parseData['mobile_status']=='1') {
            $('#mobileVerified').html('<i class="fa fa-check verifyField" aria-hidden="true"></i>');
        }
    }
}

function getIvrCallLogSummary(){
     $("#ivrCallSummaryBox").show();
    $.ajax({
        url: jsVars.getIvrCallLogSummaryLink,
        type: 'post',
        data: {'group': jsVars.group, 'userId' : $("#userId").val(), 'collegeId':$("#collegeId").val(), 'moduleName':$("#moduleName").val(), 'formId':$("#formId").val()},
        dataType: 'html',
        async   : false,
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#userProfileLoader').show();
        },
        complete: function () {
            $('#userProfileLoader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    if(responseObject.data.inboundCallCount == "0" && responseObject.data.outboundCallCount == "0"  && responseObject.data.ivrCallDuration == "0" ){
                        $("#ivrCallSummaryBox").hide();
                    }
                    $(".ivrInboundCallCount").html(responseObject.data.inboundCallCount);
                    $(".ivrOutboundCallCount").html(responseObject.data.outboundCallCount);
                    $("#ivrCalldurationCount").html(responseObject.data.ivrCallDuration);
                    $("#ivrOutboundMissedCallCount").html(responseObject.data.outboundMissed);
                    $("#ivrOutboundConnectedCallCount").html(responseObject.data.outboundConnected);
                    $("#ivrInboundMissedCallCount").html(responseObject.data.inboundMissed);
                    $("#ivrInboundConnectedCallCount").html(responseObject.data.inboundConnected);
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

/*function getAllTabs(){
	alert('hello')
}*/

function getXyz(e){
alert(e);

}

function initiateReassignLead(userId,formId){
    $("#leadReassignMessageDiv").html("");
    $("#singleBulkTitle").html('');
    getCounsellorsList(userId, $("#collegeId").val(), formId);
    $('#leadReassignModal').modal('show');

	floatableLabel();
	/*if($('#unassignedFrom').length > 0){
		if($('#unassignedFrom').val() !==''){
			$('#unassignedFrom').parent().parent().parent().addClass('floatify floatify__left floatify__active');
		}
		$('#unassignedFrom').change(function(){
			if($('#unassignedFrom').val() !==''){
				$('#unassignedFrom').parent().parent().parent().addClass('floatify floatify__left floatify__active');
			}else{
				$('#unassignedFrom').parent().parent().parent().removeClass('floatify__active');
			}
		})
	}
	if($('#assignedTo').length > 0){
		if($('#assignedTo').val() !==''){
			$('#assignedTo').parent().parent().parent().addClass('floatify floatify__left floatify__active');
		}
		$('#assignedTo').change(function(){
			if($('#assignedTo').val() !==''){
				$('#assignedTo').parent().parent().parent().addClass('floatify floatify__left floatify__active');
			}else{
				$('#assignedTo').parent().parent().parent().removeClass('floatify__active');
			}
		})
	}*/

}

function getCounsellorsList(userId, collegeId, formId){
    var assignedTo  = '<label class="floatify__label float_addedd_js" for="assignedTo">Assigned To</label><select name="assignedTo" id="assignedTo" class="" tabindex="-1" ></select>';
    $('#assignedToListDiv').html(assignedTo);

    var unassignFrom  = '<label class="floatify__label float_addedd_js" for="unassignedFrom">Unassigned From</label><select name="unassignedFrom[]" multiple="multiple" id="unassignedFrom" class="" tabindex="-1" data-placeholder="Unassign From"></select>';
    $('#unassignFromDiv').html(unassignFrom);

    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    $('#assignedTo').SumoSelect({placeholder: 'Counsellor - Assigned To', search: true, searchText:'Select Counsellor - Assigned To', selectAll : true, captionFormatAllSelected: "All Selected."});
	$('#unassignedFrom').SumoSelect({placeholder: 'Counsellor(s) - Assigned From', search: true, searchText:'Select Counsellor(s) - Assigned From', selectAll : true, captionFormatAllSelected: "All Selected."});
	$("#reassignRemark").val('');
    $("#leadReassignMessageDiv").html('');
    $.ajax({
        url: jsVars.getCounsellorsListLink,
        type: 'post',
        data: {'userId' : userId, 'collegeId':collegeId, 'formId':formId, moduleName:$('#moduleName').val()},
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
                        var counsellors  = '<label class="floatify__label float_addedd_js" for="assignedTo">Assigned To</label><select name="assignedTo" id="assignedTo" class="" tabindex="-1" ><option value="">Counsellor - Assigned To</option>';
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
                        var unassignFrom  = '<label class="floatify__label float_addedd_js" for="unassignedFrom">Unassigned From</label><select name="unassignedFrom[]" multiple="multiple" id="unassignedFrom" class="" tabindex="-1" data-placeholder="Unassign From">';
                        $.each(responseObject.data.currentCounsellor, function (index, item) {
                            unassignFrom += '<option value="'+index+'" selected="selected">'+item+'</option>';
                        });
                        unassignFrom += '</select>';
                        $('#unassignFromDiv').html(unassignFrom);
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
    if($("#assignedTo").val()==''){
        $("#leadReassignMessageDiv").html("<div class='alert-danger'>Please select a counsellor in 'To'</div>");
        return;
    }
    $("#leadReassignMessageDiv").html("");
    $("#reassignButtonId").hide();
    $("#reassignButtonIdButtonWait").show();
    
        $.ajax({
        url: jsVars.preManualReassignmentCheckLink,
        type: 'post',
        data: {'userId' : currentUserId, 'collegeId':currentCollegeId,'formId':currentFormId, 'assignedTo':$("#assignedTo").val(), 'unassignedFrom':$("#unassignedFrom").val(), 'reassignRemark':$("#reassignRemark").val(), moduleName:$('#moduleName').val(), 'assignedName':$("#assignedTo option:selected").text()},
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
                if($('#moduleName').val() == 'application'){
                    $('#ConfirmPopupReassignCounsellor #confirmTitle').html('Re-assign Application(s)');
                    $('#ConfirmPopupReassignCounsellor #assignedToCounsellorText').html("Taking this action will re-assign application(s) to counselor "+$("#assignedTo option:selected").text()+".<br>");
                    $('#ConfirmPopupReassignCounsellor #counsellorNoteText').html("(Disable toggle if only application has to be re-assigned.)");
                }else{
                    $('#ConfirmPopupReassignCounsellor #confirmTitle').html('Re-assign Lead(s)');
                    $('#ConfirmPopupReassignCounsellor #assignedToCounsellorText').html("Taking this action will re-assign lead(s) to counselor "+$("#assignedTo option:selected").text()+".<br>");$('#ConfirmPopupReassignCounsellor #counsellorNoteText').html("(<strong>Note</strong>: In case none of the options are selected, only lead will be reassigned. In case application toggle is enabled and both lead & application are assigned to different counselors, then lead will be reassigned to new counselor and application will be assigned to the new counselor in addition to the existing one.)");
                    $('#ConfirmPopupReassignCounsellor #counsellorNoteText').html("(Disable toggle if only lead has to be re-assigned.)");
                }
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


function validateInput(){
    switch(followUpAction){
        case 'stage':
            if($('#lead_stage').val()=='' && $('#lead_followup_date').val()=='' && $('#lead_remark').val()==''){
                return false;
            }
            break;
        case 'followup':
            if($('#lead_followup_date').val()=='' && $('#lead_remark').val()==''){
                return false;
            }

            break;
        case 'note':
            if($('#lead_remark').val()==''){
                return false;
            }
            break;
    }
    return true;
}

// this function is used when there is mobile dial country code is selected in form applicant
function filterDialCode(fieldId)
{
    if(typeof fieldId=="undefined" || fieldId==null || fieldId=="undefined"){
        fieldId = '';
    }
    var value = $('#filter_dial_code'+fieldId).val();
    value = value.toLowerCase();
    $("#ul_dial_code"+fieldId+" > li").each(function() {
        if ($(this).text().toLowerCase().search(value) > -1) {
//            $(this).text(src_str);
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });
}

function getFormPercentage(){
	//if(formPercentage != '') return false;

	var formIds = $('#startedFormId').val();
	if(formIds == '')
		return false;

	$.ajax({
        url: jsVars.formPercentageLink,
        type: 'post',
        data: {'formIds' : formIds, 'userId' : $('#userId').val()},
        dataType: 'html',
        async   : false,
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
	    formPercentage = responseObject;
	    if(responseObject.status){
		for(var i in responseObject.data){
			$('#form-' + i).html(responseObject.data[i]);
			$('#form-' + i).parent().attr('aria-valuenow', responseObject.data[i]);
			$('#form-' + i).parent().css('width', responseObject.data[i]+'%');
		}
	    }else{
		if(responseObject.statusCode == 401){
			location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
		}else{
			console.log(responseObject.statusCode + ' >> ' + responseObject.error);
		}
	    }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/**
*Function to return lead strength.
*
*/
function showStrength(score, cId, uId) {
    //alert(jsVars._csrfToken);
    if (score != '' && cId != '') {

        $.ajax({
            url: '/counsellors/getLeadStrength',
            type: 'post',
            dataType: 'json',
            data: {
				"score":score,
                "uId": uId,
                "cId": cId
            },
            beforeSend: function (xhr) {
                //$('#'+lId).html('Please Wait.');
                //$('#'+lId).attr('disabled',true);
				$('.strenghtLoader').show();
				$('.strenghtLeadText').css("color", "#fff");
            },
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            success: function (data) {
                if(data=="session_logout"){
                    window.location.reload(true);
                }

                if (data.status == 1) {
					var leadStrenght = data.data.strength;
					var leadStrenghtPercent = data.data.strength+"%";
					$('#strengthProgress').html('<div class="progress"><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="'+leadStrenght+'" aria-valuemin="0" aria-valuemax="100" style="max-width:'+leadStrenghtPercent+'"><span class="sr-only">'+leadStrenghtPercent+' Complete (success)</span></div></div>');
					$('#strengthSpan').html(leadStrenght+"<small>&nbsp;%ile</small>");
					$('.lead-strength-info').show();
					$('#scoreSpan').css('display', 'inline-block');
					$('.strengthcontainer').addClass('fadeIn');
                    //$('#showStength').attr('disabled',true);
                }
                else {
                    //$('#'+lId).attr('disabled',false);
                    //$('#'+lId).html(anchorText);

                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            },
            complete: function (jqXHR, textStatus) {
                //$('#'+lId).html('Redirecting.');
				$('.strenghtLoader').hide();
				//$('.strenghtLeadText').show();
				$('.strenghtLeadText').css("color", "#004467");
            }
        });
    }
    else {
        alert('Invalid Request.');
        return false;
    }
}


// Resend Communication function , call from get_user_activity_logs.ctp

function resendCommunication(obj,userId,activityCode,ctype){
    var parentObj = obj.parent();
    var jobId = parentObj.find('.template-log-details').attr('alt');
    if(jobId ==''|| userId == '' || activityCode == ''){
        return false;
    }

    $('#ConfirmMsgBody').html("<strong> Do you want to resend this communication?</strong>");
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false});
    $('#confirmYes').unbind('click').one('click',function (e) {
    e.preventDefault();
     resendCommunicationAfterConfirm(jobId,userId,activityCode,ctype);
    $('#ConfirmPopupArea').modal('hide');
    return false;
    });


}

function resendCommunicationAfterConfirm(jobId,userId,activityCode,ctype){
    var data = new Array();
   // var ctype = $("#ctype").val();
    data.push({name: "jobId", value:jobId });
    data.push({name: "userId", value: userId});
    data.push({name: "activityCode", value: activityCode});
    data.push({name: "ctype", value: ctype});
    $.ajax({
        url: '/communications/resend-communication-from-timeline',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () {
            $('div.loader-block-lead-list').show();
        },
        complete: function () {
            $('div.loader-block-lead-list').hide();
        },
        success: function (ndata) {
        if(ndata.hasOwnProperty('error')){
           alertPopup(ndata['error'],'error');
        }else{
            if(ndata['type']=='sms'){
                 sendResendSMS(ndata['data']);
            }else if(ndata['type']==='whatsapp'){
                 sendResendWhatsapp(ndata['data']);
            }else{
                sendResendMail(ndata['data']);
            }
        }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function sendResendMail(data){
    $.ajax({
            url: '/communications/communication-email',
            type: 'post',
            dataType: 'html',
            data: data,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            beforeSend: function () {
                $('div.loader-block-lead-list').show();
            },
            success: function (data) {
                  if( data == 'done'){
                    alertPopup('Email resent successfully.','success');
                  }else{
                    alertPopup(data,'error');
                  }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
}

function sendResendSMS(data){
     $.ajax({
            url: '/communications/communication-sms',
            type: 'post',
            dataType: 'html',
            data: data,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            beforeSend: function () {
                $('div.loader-block-lead-list').show();
            },
            success: function (data) {
                  if(data == 'done'){
                    alertPopup('SMS resent successfully.','success');
                  }else{
                    alertPopup(data,'error');
                  }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
}

function sendResendWhatsapp(data){
    $.ajax({
            url: '/communications/communication-whatsapp-business',
            type: 'post',
            dataType: 'html',
            data: data,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            beforeSend: function () {
                $('div.loader-block-lead-list').show();
            },
            success: function (response) {
                var responseObject = $.parseJSON(response);
                  if( responseObject.data === 'delivered'){
                    alertPopup('Whatsapp resent successfully.','success');
                  }else{
                    alertPopup(responseObject.data,'error');
                  }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
}

function resetFollowupFromInfo(stage,clickModule,formId){
    leadApplicationSamePage  = true;
    leadApplicationModuleName = $("#moduleName").val();
    leadApplicationFormId = $("#formId").val();
    if(clickModule == 'lead' &&  leadApplicationModuleName == 'application'){
       $("#moduleName").val(clickModule);
       $("#formId").val('');
       getLeadStagePermissions();
       resetFollowup(stage);
       $(".modal-title",$("#followupModal")).html('Change Lead Stage');
       getLeadStages(clickModule);
    }else if(clickModule == 'application' &&  leadApplicationModuleName == 'lead'){
            $("#moduleName").val(clickModule);
            $("#formId").val(formId);
            getLeadStagePermissions();
            resetFollowup(stage);
            $(".modal-title",$("#followupModal")).html('Change Application Stage');
            getLeadStages(clickModule);

    } else{
        resetFollowup(stage); //leadApplicationModuleName.charAt(0).toUpperCase() + leadApplicationModuleName.substr(1).toLowerCase()
        $(".modal-title",$("#followupModal")).html('Change '+leadApplicationModuleName.charAt(0).toUpperCase() + leadApplicationModuleName.substr(1).toLowerCase()+' Stage');
        getLeadStages(clickModule);
    }

    //var moduleName=
}

function oncloseStagePopup(){
   if(leadApplicationSamePage == true){
        $("#moduleName").val(leadApplicationModuleName);
        $("#formId").val(leadApplicationFormId);
    }
}

function getLeadStages(clickModule, action_type){
    $('#saveFollowUpButton').attr('disabled',false);
    clickModule = clickModule.charAt(0).toUpperCase() + clickModule.substr(1).toLowerCase()
    nextStepCondition   = 0;
    var module = $("#moduleName").val();

    if(typeof action_type==="undefined"){
        action_type = '';
    }
    //create counsellors Dropdown
    if(action_type != "note") {
        setCounsellorsDropDownForFollowups($("#userId").val(), $("#collegeId").val(), $("#formId").val());
    }
    $.ajax({
        url: jsVars.getLeadStagesLink,
        type: 'post',
        data: {'userId' : $("#userId").val(), 'collegeId':$("#collegeId").val(), 'formId':$("#formId").val(), moduleName:module},
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
                    currentSubStage         = responseObject.data.sub_stage;

                    var subStageConfigure   = responseObject.data.subStageConfigure;
                    var leadSubStageList    = responseObject.data.subStageList;
                    if(typeof responseObject.data.overdueFollowUpCount!=='undefined' && responseObject.data.overdueFollowUpCount>0 && action_type != "note"){
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
                    if (subStageConfigure == 1) {
                        if(clickModule == 'Lead'){
                            onChangeLeadStage = 'onchange = "getLeadSubStages(\''+ $("#collegeId").val() +'\', this.value, \'lead_sub_stage\', \'chosen\', \'leadSubStagesDiv\');"';

                        }else{
                            onChangeLeadStage = 'onchange = "getApplicationSubStages(\''+ $("#formId").val() +'\', this.value, \'lead_sub_stage\', \'chosen\', \'leadSubStagesDiv\');"';
                        }
                    }else{
                        onChangeLeadStage = '';
                    }
                    if(typeof responseObject.data.stageList === "object" && typeof stageList === "object"){

                        var leadStages  = '<label class="floatify__label float_addedd_js" for="lead_stage">'+clickModule+' Stage</label><select name="lead_stage" id="lead_stage" class="chosen-select" tabindex="-1" '+onChangeLeadStage+'><option value="">'+clickModule+' Stage</option>';
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
                     if (typeof leadSubStageList != "undefined" && subStageConfigure && $("#actionType").val() == 'stage') {
                            var leadSubStages  = '<label class="floatify__label float_addedd_js" for="lead_sub_stage">'+clickModule+' Sub Stage</label><select name="lead_sub_stage" id="lead_sub_stage" class="chosen-select" tabindex="-1"><option value="">'+clickModule+' Sub Stage</option>';
                            for(var subStageId in leadSubStageList) {
                                //leadSubStages += '<option value="' + subStageId + '">' + leadSubStageList[subStageId] + '</option>';
                                if (currentSubStage == subStageId) {
                                     leadSubStages += '<option value="' + subStageId + '" selected="selected">' + leadSubStageList[subStageId] + '</option>';
                                 } else {
                                     leadSubStages += '<option value="' + subStageId + '">' + leadSubStageList[subStageId] + '</option>';
                                 }
                            }
                            leadSubStages += '</select>';
                            $('#followupModal #leadSubStagesDiv').html(leadSubStages);
                            floatableLabel();
                             $('#div_profile_sub_stage').show();
                             //$('#' + parent + ' select#'+ selector +'').chosen();
                             $('.chosen-select-deselect').chosen({allow_single_deselect: true});
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

function getCounsellorForFollowups() {
    counsellorsAvailableForFollowup = false;
    $.ajax({
        url: jsVars.FULL_URL+"/counsellors/get-counsellors-list-for-followups",
        type: 'post',
        data: {'userId' : $("#userId").val(), 'collegeId':$("#collegeId").val(), 'formId':$("#formId").val(), moduleName:$('#moduleName').val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: false,
        beforeSend: function () {
        },
        complete: function () {
            $('#follow_up_assigned_to').chosen();
            $('#follow_up_assigned_to').trigger("chosen:updated");
            $('#follow_up_assigned_to').chosen({allow_single_deselect: true});
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    var counsellors = '';
                    if(typeof responseObject.data.counsellors === "object"){
                        counsellorsAvailableForFollowup = true;
                        var counsellorsOptions  = '';
                        var counsellorsOptionsLength  = '';
                        $.each(responseObject.data.counsellors, function (index, item) {
                            counsellorsOptions += '<option value="'+index+'">'+item+'</option>';
                            counsellorsOptionsLength++;
                        });
                        if(responseObject.data.isCounsellorLoggedIn == "0" && counsellorsOptionsLength>1) {
                            counsellorsOptions  = '<option value="">Select Counsellor</option>'+counsellorsOptions;
                        }
                        counsellors = counsellors+counsellorsOptions;
                    }
                    $('#follow_up_assigned_to').html(counsellors);
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

function getLeaduploadedFiles() {
    counsellorsAvailableForFollowup = false;
    $.ajax({
        url: jsVars.FULL_URL+"/counsellors/get-lead-uploaded-files",
        type: 'post',
        data: {'userId' : $("#userId").val(), 'collegeId':$("#collegeId").val(), 'formId':$("#formId").val(), moduleName:$('#moduleName').val(),"cf":"lm-user-profile-back"},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: false,
        beforeSend: function () { 
        },
        complete: function () {
//            $('#follow_up_assigned_to').chosen();
//            $('#follow_up_assigned_to').trigger("chosen:updated");
//            $('#follow_up_assigned_to').chosen({allow_single_deselect: true});
        },
        success: function (response) {
            var responseObject = $.parseJSON(response); 
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                $.each(responseObject.data, function(k, v) {
                    $('#'+k+'_show').empty();
                    $('#'+k+'_show').html(v);
                    $('#'+k).val('')
                    $('#'+k+'_choose_files').val('')
                });
            }else{
                console.log(responseObject.message);
            }
//            $('.thumbnaillist').empty()
//            $('.thumbnaillist').html(responseObject.data)
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
function setCounsellorsDropDownForFollowups(userId, collegeId, formId) {
    counsellorsAvailableForFollowup = false;
    $.ajax({
        url: jsVars.FULL_URL+"/counsellors/get-counsellors-list-for-followups",
        type: 'post',
        data: {'userId' : userId, 'collegeId':collegeId, 'formId':formId, moduleName:$('#moduleName').val()},
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
//                        $("#followUpMessageDiv").html("<div class='alert-warning'>No counsellor assigned to this "+$('#moduleName').val()+", Please assign a counsellor first in order to add a followup.</div>");
//                    }
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
		$('#div_profile_sub_stage').hide();
        return;
    } else if ((dropdown_class == 'sumo') && ((val == '') || (val  < 1))) {
        var leadSubStageHtml = '<option value="0">Lead Sub Stage ' + jsVars.notAvailableText + '</option>';
        $('select#' + selector).html(leadSubStageHtml)[0].sumo.reload();
		$('#div_profile_sub_stage').hide();
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
                if (json['subStageList'] && (dropdown_class == 'chosen')) {
                    var leadSubStageHtml = '<label class="floatify__label float_addedd_js">Application Sub Stage</label><select name="'+ selector +'" id="'+ selector +'" class="chosen-select" tabindex="-1"><option value="" selected="selected">Application Sub Stage</option>';
                    for(var subStageId in json['subStageList']) {
                        if (json['subStageList'].hasOwnProperty(subStageId)) {
                            leadSubStageHtml += '<option value="'+ subStageId +'">'+ json['subStageList'][subStageId] +'</option>';
                        }
                    }
                    leadSubStageHtml += '</select>';
                    $('#' + parent).html(leadSubStageHtml);
                    $('#div_profile_sub_stage').show();
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

function initiateRa(userIdHashed, module){
    if(module == 'assigned_ra'){
        var ajaxUrl = '/resident-advisors/initiate-assign-to-ra';
        $('#lead-ra-assignment span.error').html('');
    }else if(module == 'installment'){
        var ajaxUrl = '/resident-advisors/initiate-ra-installment';
        $('#initiate-ra-installment span.error').html('');
    }
    $('#assignRaModal #raMessageDiv').html('');
    $.ajax({
        url: ajaxUrl,
        type: 'post',
        data: {'userIdHashed' : userIdHashed },
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        async: false,
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            hideLoader();
        },
        success: function (responseHtml) {
            if (responseHtml === 'error:session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(responseHtml.indexOf('error:')>-1){
                $('#assignRaModal').modal('hide');
                var errorMsg = responseHtml.replace('error:','');
                alertPopup(errorMsg,'error');
            }
            else if(typeof responseHtml !='undefined'){

                $('#assignRaModal #raMessageDiv').html(responseHtml);
                $('#userRaId').chosen();
                $('#userRaId').attr('disabled', false);
                $('#userRaId').trigger("chosen:updated");
                $('#assignRaModal .modal-title').html('Add Installment');
                $('#assignRaModal').modal('show');
                floatableLabel();
            }
            else{
                $('#assignRaButtonId').ramoveAttr('disabled');
                console.log(responseHtml);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });


}



function isValidInstallmentAmount(amount){
    if(typeof amount == 'undefined' || amount == null || amount == '' || amount<=0 || !amount.match(/^\d+$/)){
        return false;
    }
    return true;
}

function paidInstallmentRa(){
        var name = $('#installment_ra_name').text();
        var balance = $('#installment_ra_balance').text();
        var amount = $('#paid_amount').val();
        $('#Paid_amountError').html('');
        var message = 'Rs. '+amount+' to be paid to '+name;

        var amtStatus = isValidInstallmentAmount(amount);

        if(amtStatus==false){
            var errorStatus = 'Kindly enter amount which is an integer value and between 0 and '+balance;
            $('#Paid_amountError').html(errorStatus);
            $('#ConfirmPopupArea').modal('hide');
            return false;
        }

        $('#ConfirmMsgBody').html(message);
        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
                .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                    e.preventDefault();
                    processPaidInstallmentRa();
                    $('#ConfirmPopupArea').modal('hide');
                });
        return false;
    }

function processPaidInstallmentRa(){
    var formData = $('#initiate-ra-installment').serializeArray();
    $('#paidInstallmentRaButtonId').attr('disabled','disabled');
    $('#initiate-ra-installment span.error').html('');

    $.ajax({
        url: '/resident-advisors/paid-installment-ra',
        type: 'post',
        data: formData,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        async: false,
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            hideLoader();
        },
        success: function (responseObject) {
            if (responseObject.error === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(typeof responseObject.validation_error != 'undefined'){
                for(var i in responseObject.validation_error){
                    $('span#'+i+'Error').html(responseObject.validation_error[i]);
                    console.log(responseObject.validation_error[i]);
                    $('#paidInstallmentRaButtonId').removeAttr('disabled');
                }
            }
            else if(typeof responseObject.error != 'undefined'){
                alertPopup(responseObject.error,'error');
                $('#paidInstallmentRaButtonId').removeAttr('disabled');

            }
            if(responseObject.status==200){
                $('#assignRaModal').modal('hide');
                alertPopup(responseObject.message,'success');
            }
            else{
                $('#paidInstallmentRaButtonId').removeAttr('disabled');
                console.log(responseObject.error);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
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
        data: {"note": editLeadRemark, "followupDate": editLeadFollowupDate, "collegeId" : collegeId, "applicantEngagementId" : applicantEngagementId},
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
                let activeTab = $.trim($("#leadProfile ul li.resp-tab-active a").text());
                if(activeTab == "Timeline")
                {
                    getActivityLogs();
                }
                if(activeTab == "Follow up & Notes")
                {
                    getFollowupAndRemarks();
                }
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

function sendOtp(mobileNumber = '')
{
    var collegeId = $('#college_id').val();
    var userId = $('#user_id').val();
    var leadName = $('#leadName').val();
    var formId = $("#form_id").val();
    let mobileUniq = true;
    if(mobileNumber === '')
    {
        var mobile = $('#Mobile').val();
        var countryDialCodeMobileId = $('#country_dial_codeMobile').val();
        $("#otpresendlink a").attr("onclick", "return sendOtp();");
        var inputOtpAttribute = "return verifyMobileOTP();";
    }else{
        breakNumber = mobileNumber.split("-");
        var mobile = breakNumber[1];
        mobileUniq  = mobileUniqueness(mobile, collegeId);
        if(!mobileUniq)
        {
            alertPopup("Mobile already exists. Kindly use a different mobile number", "error");
            $("#mobileUpdated").attr("data-restrict", 0);
            return false;
        }

        var countryDialCodeMobileId = breakNumber[0];
        $("#otpresendlink a").attr("onclick", "return sendOtp('"+ mobileNumber +"');");
        var inputOtpAttribute = "return verifyMobileOTP('" + mobileNumber + "');";
    }

    // check mobile uniqueness for international
    if(mobileUniq && countryDialCodeMobileId != "+91")
    {
        mobileUniq  = mobileUniqueness(mobile, collegeId);
        if (!mobileUniq) {
            $("#Mobile_error").show();
            $("#Mobile_error").addClass("error");
            $("#Mobile_error").html("Mobile already exists. Kindly use a different mobile number");
            $("#getOtpButton").prop("disabled", "disabled");
            $("#mobileUpdated").attr("data-restrict", 0);
            return false;
        } else {
            $('#showOTPVerified').hide();
            $("#Mobile_error").html('');
            $("#Mobile_error").hide();
        }
    }

    showVerificationPanel();
    if($("#otpverifylink-text").length)
    {
        $("#otpverifylink-text").remove();
    }
    if($('input#isMobileSwapOtpVerified').length)
    {
        $('input#isMobileSwapOtpVerified').val('0');
    }
    $('#getOtpButton').hide();
    $('span.verifyMobileButton').append('<span id="otpverifylink-text">Wait...</span>');
    $('#otpverifylink-text').css({ color: "#b8b8b8", "font-size": "12px;" });
    $('#getOtpButton').attr('disabled','disabled');
    $('#inputOtp').val('');$("#otpverified, #otpunverified").hide();

    $("#inputOtp").attr("onkeyup", inputOtpAttribute);
    $("#inputOtp").attr("onkeydown", inputOtpAttribute);

    $("#otpunverifiedMobile").show();
    $.ajax({
        url: '/counsellors/sentMobileOtp',
        type: 'post',
        data: {'collegeId' : collegeId, 'userId' : userId, 'mobile' : mobile, 'leadName': leadName, 'countryDialCodeMobileId' : countryDialCodeMobileId, 'formId' : formId},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        async: false,
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            hideLoader();
            $("#mobileUpdated").attr("data-restrict", 0);
        },
        success: function (responseObject) {
            if (responseObject.error === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject['error']){
                if(responseObject['error'] === 'limit_error')
                {
                    alertPopup("You have reached maximum limit(5) of sending OTP. Please try after sometime.", 'error');
                    $("#ErroralertTitle").html("Limit Exhausted");
                }else{
                    alertPopup(responseObject['error'], 'error');
                }
                hideVerificationPanel();
                $('#otpverifylink-text').html('OTP limit exhaust');
            }else if(responseObject['success']==200){
                var successText = '';
                if(typeof responseObject['mobile_added'] != 'undefined' && responseObject['mobile_added'] == '1')
                {
                    successText += "Mobile Number has been updated and OTP with verification link has been sent on " + countryDialCodeMobileId + "-" + mobile + ". For verification, collect OTP from the applicant and enter here or ask the applicant to click on the verification link.";
                }else{
                    successText += "OTP with verification link has been sent on " + countryDialCodeMobileId + "-" + mobile + ". For verification, collect OTP from the applicant and enter here or ask the applicant to click on the verification link. Mobile Number will be updated only once the number is verified.";
                }
                alertPopup(successText, 'success');
                countdownStart(); /* 30 seconds timer start */
                $('#inputOtp').val('');
                $('#inputOtp').removeAttr('disabled');
                $('#otpresendlink').hide();
                $('#otpverifylink-text').html('OTP Sent');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
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

function verifyMobileOTP(overwriteNumber = '')
{
    var collegeId = $('#college_id').val();
    if(overwriteNumber === '')
    {
        var mobile = $('#Mobile').val();
        if ($("#country_dial_codeMobile").length && $("#country_dial_codeMobile").val().length) {
            mobile = $("#country_dial_codeMobile").val() + "-" + mobile;
        }
    }else{
        var mobile = overwriteNumber;
    }
    var mobileSwapped = 0;
    if ($('#isMobileSwapOtpVerified').length > 0) {
        mobileSwapped = $('#isMobileSwapOtpVerified').val();
    }
    var otp_value   = $('#inputOtp').val();
    var userId = $('#user_id').val();
    if(otp_value.toString().length == jsVars.otpDigits)
    {
        /* get csrf token form hidden field */
        var csrfToken = $('form input[name=\'_csrfToken\']').val();
        /* hide otp (un)verified text */
        $('#otpverified').hide();
        $('#otpunverified').hide();


        $.ajax({
            url: '/counsellors/verify-mobile-otp',
            type: 'post',
            dataType: 'json',
            data:{'otpValue':otp_value,'mobile':mobile,'collegeId':collegeId, 'userId' : userId, mobileSwapped : mobileSwapped},
            headers: {'X-CSRF-TOKEN': csrfToken},
            success: function (json) {
                $('div#profile-page div.loader-block').hide();
                if(json['status']==1){
                    /**
                     * if verified, hide resent otp, timer, clear timer
                     */
                    if(typeof timeinterval !='undefined'){
                        clearInterval(timeinterval);
                    }
                    showAfterVerified();
                    updateMobileNumber(json['verified_number'], mobile);
                }else{
                    showAfterUnverified();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
    else
    {
        $('#otpverified').hide();
    }
}

function updateMobileNumber(mobile, maskFlag)
{
    if(mobile === '')
    {
        return false;
    }
    var countryDialCode = '+91';

    if(mobile.indexOf("-") != -1)
    {
        countryDialCode = mobile.split("-")[0];
        mobile = mobile.split("-")[1];
    }
    var collegeId = $('#college_id').val();
    var userId = $('#user_id').val();

    /* get csrf token form hidden field */
    var csrfToken = $('form input[name=\'_csrfToken\']').val();
    /* hide otp (un)verified text */

    if ($("#country_dial_codeMobile").length && $("#country_dial_codeMobile").val().length) {
        countryDialCode = $("#country_dial_codeMobile").val();
    }
    
    //add mobile swapping fields value
    var isMobileSwapOtpVerified = $('input#isMobileSwapOtpVerified').val();
    
    //VERIFY MOBILE
    $.ajax({
        url: '/counsellors/update-lead-mobile-as-verified',
        type: 'post',
        dataType: 'json',
        data: {'mobile': mobile, 'collegeId': collegeId, 'userId': userId, 'mobileDialCode': countryDialCode, isMobileSwapOtpVerified: isMobileSwapOtpVerified},
        headers: {'X-CSRF-TOKEN': csrfToken},
        success: function (json) {
            $('div#profile-page div.loader-block').hide();
            if (json['error'] != '' && json['error'] == 'session_logout') {
                location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
            } else if (json['error'] != '') {
                alertPopup(json['error'], "error");
            } else {
                var successTxt = "Mobile number has been successfully verified";
                if (typeof json['mobile_swapped'] != 'undefined') {
                    successTxt = "Mobile number has been successfully swapped";
                }
                alertPopup(successTxt, "success");
                if (maskFlag.indexOf("**") != -1) {
                    // condition for masked mobile
                } else {
                    $("#Mobile, #leadMobile").val(mobile);
                    $("#mobileCountryDialCode").text(countryDialCode);
                    $("#country_dial_codeMobile").val(countryDialCode);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

}

function mobileUniqueness(mobile, collegeId)
{
    if(!jsVars.uniqueMobileConfig)
    {
        return true;
    }
    let uniqueMobile = false;
    // check for uniqueness
    $.ajax({
        url: '/common/check-mobile-exist',
        type: 'post',
        dataType: 'json',
        async: false,
        data: {
            mobile: $.trim(mobile),
            email: "",
            collegeId: collegeId,
            uploadVia: "email"
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        complete: function(){
        },
        success: function (response) {
            if (typeof response['data'] !== 'undefined' && response['data'] != '') {
                uniqueMobile = false;
            }else{
                uniqueMobile = true;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return uniqueMobile;
}


function countdownStart(){
    $('#clockdiv').show();
    var clock = $('#clockdiv');
    clock.html('30 seconds'); /* initial display 30 seconds */
    resentOTPLink('clockdiv'); /* call 30 secs timer */
}

function resentOTPLink(){

  var endtime =  new Date();
  endtime.setSeconds(endtime.getSeconds() + 30);

  // if timer already running and again req sent then clear previous timer
if(typeof timeinterval !='undefined'){
    clearInterval(timeinterval);
}

  var clock = document.getElementById("clockdiv");
  timeinterval = setInterval(function(){
    var t = getTimeRemaining(endtime);
    clock.innerHTML = t.seconds+' seconds';
    if(t.total<=0){
      clearInterval(timeinterval);
      $('#otpresendlink').show();
      $('#clockdiv').hide();
    }
  },1000);
}

function getTimeRemaining(endtime){
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor( (t/1000) % 60 );
  var minutes = Math.floor( (t/1000/60) % 60 );
  var hours = Math.floor( (t/(1000*60*60)) % 24 );
  var days = Math.floor( t/(1000*60*60*24) );
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

function showAfterVerified(){

    $('#otpverified, #showOTPVerified').show();
    $('#getOtpButton, #otpverifylink-text, #otpresendlink, #clockdiv, #otpunverified, #Mobile_error').hide();
    $('#isOtpVerified').val("verified");
    $('#inputOtp').attr('disabled',"disabled");
    $('#getOtpButton').attr('disabled','disabled');
}

function showAfterUnverified(){
    $('#otpverified, #clockdiv').hide();
    $('#otpunverified').show();
    $('#isOtpVerified').val("0");
    $('#getOtpButton').removeAttr('disabled');
}

$(".otpEnable").on("input", function()
{
    let mobileLimit = 0;
    let countryDialCode = '';
    let changedMobile = $(this).val();
    let leadMobile = $("#leadMobile").val();
    let leadMobileStatus = $("#leadMobile").data('verified');

    hideVerificationPanel();
    $('span.verifyMobileButton #otpverifylink-text').remove();
    if(changedMobile === '' || !$.isNumeric(changedMobile))
    {
        $('#getOtpButton, #showOTPVerified').hide();
        return false;
    }

    if($('#country_dial_codeMobile').length)
    {
        countryDialCode = $('#country_dial_codeMobile').val();
    }
    if(countryDialCode === '' || countryDialCode === "+91")
    {
        mobileLimit = 10;
    }else{
        mobileLimit = 16;
    }

    if(
            ((countryDialCode === '' || countryDialCode === "+91") && changedMobile.length === mobileLimit) ||
            (countryDialCode !== '' && countryDialCode !== "+91" && changedMobile.length <= mobileLimit && changedMobile.length >= 5)
            )
    {

        if(changedMobile == leadMobile && leadMobileStatus == 1)
        {
            $('div#Mobile_error').html('').hide();
            $('#showOTPVerified').show();
            $('#getOtpButton').hide();
            return false;
        }else{
            $('#getOtpButton').show();
            $('#showOTPVerified').hide();
            if(countryDialCode !== "+91")
            {
                // hit checkMobileExist on clicking of verify number for international
                $('#showOTPVerified').hide();
                $('#getOtpButton').show();
                $("#Mobile_error").html('');
                $("#Mobile_error").hide();
                $("#getOtpButton").removeAttr("disabled");
            }else{
                checkMobileExist();
            }
            let otpVerified = $("#isOtpVerified").val();
            if(otpVerified == 'verified')
            {
                $('#isOtpVerified').val("0");
                $("#Mobile_error").html('');
                $("#Mobile_error").hide();
                showAfterUnverified();
            }
        }
    }else{
        $('#getOtpButton, #showOTPVerified').hide();
        return false;
    }
});

function showVerificationPanel()
{
    $("#otpVerification").show();
}

/*Check Duplicate Mobile no Validation*/
function checkMobileExist() {

    var leadMobile = $("#leadMobile").val();
    var changedMobile = $('#Mobile').val();
    if(leadMobile != changedMobile)
    {
        $("#mobileUpdated").attr("data-restrict", 1);
        email = "";
        collegeId = $('#college_id').val();
        $.ajax({
            url: '/common/check-mobile-exist',
            type: 'post',
            dataType: 'json',
            async: false,
            data: {
                mobile: $.trim(changedMobile),
                email: $.trim(email),
                collegeId: collegeId,
                uploadVia: "email",
                requestBy: "profilePage"
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            complete: function(){
//              $("#mobileUpdated").attr("data-restrict", 0);
            },
            success: function (response) {  
                if ((typeof response['data'] === 'undefined') && (typeof response['errorMsg'] !== 'undefined') && (response['errorMsg'] != '')) {
                    alertPopup("Something went wrong!", 'error');
                } else if ((typeof response['data'] !== 'undefined') && (response['data'] != '')) {                    
                    var errorText = "Mobile already exists. Kindly use a different mobile number.";
                    if ((typeof response['data1'] !== 'undefined') && (response['data1'] != '')) {
                        errorText += "<a class='roundcircle' href='javascript:void(0)' data-value='"+leadMobile+'~'+changedMobile+'~'+$('#userId').val()+'~'+collegeId+'~'+response['data1']+"' id='mobileSwappingLink' data-toggle='tooltip' data-placement='bottom' data-container='body' title='Click&nbsp;here&nbsp;to&nbsp;Swap&nbsp;Mobile&nbsp;Number'><i class='lineicon-swap1'></i></a>";
                    }
                    $("#Mobile_error").show();
                    $("#Mobile_error").addClass("error");
                    $("#Mobile_error").html(errorText);
                    $("#getOtpButton").prop("disabled","disabled");
                    $("#mobileUpdated").attr("data-restrict", 0);
                } else {

                    $('#showOTPVerified').hide();
                    $('#getOtpButton').show();
                    $("#Mobile_error").html('');
                    $("#Mobile_error").hide();
                    $("#getOtpButton").removeAttr("disabled");
                }
                $('[data-toggle="tooltip"]').tooltip();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }else{
        $('#profileSave').show();
    }
}

function hideVerificationPanel()
{
    if($("#otpVerification").length)
    {
        $("#otpVerification").hide();
        $("#inputOtp").val('');
    }
}

function showEmailVerifiLink()
{
    $('#showEmailVerified').hide();
    $('#verifyEmailButton').show();
    $('#verifyEmailButton').removeAttr('disabled');
}

function fieldUpdated(type)
{
    $("#"+type+"Updated").attr("data-restrict", "1");
    $("#profileSave").attr("onclick", "checkEmailMobileUpdated(this);");
}

$("#email").on("input", function()
{
    let leadEmail = $("#leadEmail").val();
    let leadEmailStatus = $("#leadEmail").data('verified');
    let enteredEmail = $(this).val();
    if(leadEmail !== '')
    {
        if(enteredEmail == '')
        {
            $('button#verifyEmailButton, #showEmailVerified').hide();
            return false;
        }

        if(enteredEmail == leadEmail && leadEmailStatus == 1)
        {
            $('button#verifyEmailButton').hide();
            $('#showEmailVerified').show();
        }else{
            $('#showEmailVerified').hide();
            $('button#verifyEmailButton').show();
            showEmailVerifiLink();
        }
    }
});

function checkIfEmailExist(enteredEmail)
{
    var leadEmail = $("#leadEmail").val();
    var changedEmail = $('#email').val();
    let leadEmailStatus = $("#leadEmail").data('verified');
    let collegeId = $('#college_id').val();
    if(changedEmail === '')
    {
        alertPopup("Please enter an email.", 'error');
        return false;
    }

    if(leadEmail !== changedEmail)
    {
        var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/igm;
        if (!re.test(changedEmail) && changedEmail.indexOf("**") === -1) {
            alertPopup("Invalid email entered", 'error');
            return false;
        }

        mobile = "";
        $.ajax({
            url: '/common/check-email-exist',
            type: 'post',
            dataType: 'json',
            async: false,
            data: {
                mobile: $.trim(mobile),
                email: $.trim(changedEmail),
                collegeId: collegeId,
                excludeCurrentUser: $('#userId').val(),
                uploadVia: "email",
                requestBy: "profilePage"
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            complete: function(){
                $("#emailUpdated").attr("data-restrict", 0);
            },
            success: function (response) {
                if ((typeof response['data'] === 'undefined') && (typeof response['errorMsg'] !== 'undefined') && (response['errorMsg'] != '')) {
                    alertPopup("Something went wrong!", 'error');
                } else if ((typeof response['data'] !== 'undefined') && (response['data'] != '')) {                    
                    var errorText = "Email already exists. Kindly use a different email.";
                    if ((typeof response['data1'] !== 'undefined') && (response['data1'] != '')) {
                        errorText += "<a class='roundcircle' href='javascript:void(0);' data-value='"+$.trim(leadEmail)+'~'+$.trim(changedEmail)+'~'+$('#userId').val()+'~'+collegeId+'~'+response['data1']+"' id='emailSwapping' data-toggle='tooltip' data-placement='bottom' data-container='body' title='Click here to Swap Email'><i class='lineicon-swap1'></i></a>";
                    }
                    $("#Email_error").show();
                    $("#Email_error").addClass("error");
                    $("#Email_error").html(errorText);
                    $('#verifyEmailButton').attr('disabled','disabled');
                } else {
                    $("#Email_error").html('');
                    $("#Email_error").hide();
                    $('#verifyEmailButton').removeAttr('disabled');
                    var userId = $('#userId').val();
                    sendEmailVerificationLink(userId, changedEmail, collegeId);
                }
                $('[data-toggle="tooltip"]').tooltip();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }else if (leadEmailStatus === 0 && leadEmail === changedEmail){
        $("#Email_error").html('');
        $("#Email_error").hide();
        $('#verifyEmailButton').removeAttr('disabled');
        var userId = $('#userId').val();
        sendEmailVerificationLink(userId, changedEmail, collegeId);
    }else{
        alertPopup("No email change detected", 'alert');
        return false;
    }
}

function sendEmailVerificationLink(userId, changedEmail, collegeId)
{
    let formId = $("#form_id").val();

    let uniqueEmail = emailUniqueness(changedEmail, collegeId);
    if(uniqueEmail)
    {
        alertPopup("Email already exists. Kindly use a different email.", "error");
        $("#emailUpdated").attr("data-restrict", 0);
        return false;
    }

    $.ajax({
        url: '/counsellors/ajax-send-verification-email',
        type: 'post',
        dataType: 'json',
        data: {
            userId: userId,
            formId: formId,
            email: changedEmail,
            collegeId: collegeId
        },
        beforeSend: function () {
            $('#verifyEmailButton').attr('disabled', 'disabled').html('Please wait..&nbsp;<i class="fa fa-spinner fa-spin"></i>');
        },
        complete: function () {
            $('#verifyEmailButton').removeAttr('disabled').html('Send Verification Email');
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (response)
        {
            if (typeof response['error'] !=='undefined' && response['error'] === 'session_logout'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if(typeof response['error'] !=='undefined' && response['error'] !== ''){
                alertPopup(response['error'], 'error');
            }else if(typeof response['email_sent'] !=='undefined' && response['email_sent'] == true){
                $('#successmessage').html("");
                alertPopup("Confirmation mail to change email id has been sent to applicant. Once applicant clicks on the verification link, new email id will be updated.", 'success');
            }else if(typeof response['email_updated'] !=='undefined' && response['email_updated'] == true){
                $('#successmessage').html("");
                alertPopup(response['email_updated_msg'], 'success');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$(document).on('change', '#followupModal #counsellorId',function(e) {
    $('#leadFollowupCheck').attr('checked',false);
    var counsellor_id  = $(this).val();
    var user_id  = $("#userId").val();
    var college_id  = $("#collegeId").val();
    if(user_id == '' && college_id == '') {
        $("#followUpMessageDiv").html("<div class='alert-danger'>Something went wrong. please refresh page and try again.</div>").show();
        return false;
    }
    var data = {'user_id' : user_id, 'college_id':college_id,'counsellor_id':counsellor_id};
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

if (typeof jsVars.otherFieldsCursorNone !== 'undefined' && jsVars.otherFieldsCursorNone != '')
{
//    let independentFields = ['lead_stage_name_chosen', 'lead_sub_stage_name_chosen', 'follow_up_assigned_to_chosen'];
    let independentFields = [];
    setTimeout(function () {
        if ($('#ShowEditMode .chosen-container').length > 0) {
            $('#ShowEditMode .chosen-container').each(function (i, chosenElemet)
            {
                let chosenId = $(chosenElemet).attr("id");
                let elementId = chosenId.slice(0,-7);
                if (jQuery.inArray(chosenId, independentFields) === -1 && $("#" + elementId).val() !== '' && $("#" + elementId).val() !== '0')
                {
                    $(chosenElemet).css('pointer-events', 'none');
                }
            });
        }

//        if ($('#ShowEditMode .sumo-select-new').length > 0) {
//            $('#ShowEditMode .sumo-select-new').each(function (i, sumoElemet) {
////                console.log($(sumoElemet).attr("id"));
//                $(sumoElemet).css('pointer-events', 'none');
//            });
//        }

    }, 2000);

    setTimeout(function () {
        if ($('#ShowEditModeAdditional .chosen-container').length > 0) {
            $('#ShowEditModeAdditional .chosen-container').each(function (i, chosenElemet)
            {
                let chosenId = $(chosenElemet).attr("id");
                let elementId = chosenId.slice(0,-7);
                if (jQuery.inArray(chosenId, independentFields) === -1 && $("#" + elementId).val() !== '' && $("#" + elementId).val() !== '0')
                {
                    $(chosenElemet).css('pointer-events', 'none');
                }
            });
        }
    }, 2000);
}

let invalidInputFieldsArray = ['inputOtp', 'filter_dial_codeMobile', 'filter_dial_codeAlternate_Mobile', 'lead_followup_date_edit', 'lead_remark_name'];
var blankValueExist = blankAdditionalValueExist = false;
$("#UserProfileSave input").each(function()
{
    if(
            $(this).attr("type") != 'hidden' &&
            ($(this).val() == '' || $(this).val() == 'NA' || $(this).val() == null) &&
            jQuery.inArray($(this).attr("id"), invalidInputFieldsArray) === -1
        )
    {
        blankValueExist = true;
    }
});
let independentSelectFields = ['lead_stage_name', 'lead_sub_stage_name', 'follow_up_assigned_to'];
$("#UserProfileSave select").each(function()
{
    let elementId = $(this).attr("id");
    if(($(this).val() == '' || $(this).val() == 'NA' || $(this).val() == null) && jQuery.inArray(elementId, independentSelectFields) === -1)
    {
        blankValueExist = true;
    }
});

// ENABLE EDIT IF ANY FIELD IS BLANK AND USER DOES NOT HAVE PERMISSION
if(jsVars.enableProfileEditButton === false && blankValueExist)
{
    $("#targetEdit").html('<a href="javascript:void(0)" id="MakeEditable"><i class="draw-edit" aria-hidden="true"></i></a>');
    if(typeof jsVars.cloud_telephony!='undefined' && jsVars.cloud_telephony==1){
        makeScrollable();
    }
    $("#otpverified, #otpunverified").hide();
    $("#viewMode").show();
    $("#ShowEditMode").hide();
    $("#MakeEditable").on('click',function(){
        if($("#ShowEditModeAdditional").length>0){
            $("#ShowEditModeAdditional").hide();
        }
        if($("#viewModeAdditional").length>0){
            $("#viewModeAdditional").hide();
        }
        $("#lead_followup_date_edit").val('');
        $("#lead_remark_name").val('');
        $("#ShowEditMode").show();
        $("#viewMode").hide();
        $("#otpverified, #otpunverified").hide();
        getCounsellorForFollowups();
    });
}


$("#ShowEditModeAdditional input").each(function()
{
    if(
            typeof $(this).attr("id") != 'undefined' &&
            $(this).attr("type") != 'hidden' &&
            ($(this).val() == '' || $(this).val() == 'NA' || $(this).val() == null)
        )
    {
        blankAdditionalValueExist = true;
    }
});

$("#ShowEditModeAdditional select").each(function()
{
    if($(this).val() == '' || $(this).val() == 'NA' || $(this).val() == null)
    {
        blankAdditionalValueExist = true;
    }
});

// ENABLE EDIT IF ANY FIELD IS BLANK AND USER DOES NOT HAVE PERMISSION
if(jsVars.enableProfileEditButton === false && blankAdditionalValueExist)
{
    $("#targetAdditionalEdit").html('<a href="javascript:void(0)" id="MakeEditableAdditional"><i class="draw-edit" aria-hidden="true"></i></a>');
    $("#MakeEditableAdditional").on('click',function(){
        $("#viewMode").hide();
        $("#ShowEditMode").hide();
        $("#viewModeAdditional").hide();
        $("#ShowEditModeAdditional").show();
    });
}

function checkEmailMobileUpdated(elem = "")
{
    let email = $("#email").val();
    let mobile = $("#Mobile").val();
    let leadEmail = $("#leadEmail").val();
    let leadMobile = $("#leadMobile").val();
    let checkEmailUpdated = $("#emailUpdated").attr("data-restrict");
    let checkMobileUpdated = $("#mobileUpdated").attr("data-restrict");
    var blockLevel = 0;
    let html = '';

//    if(email == '')
//    {
//        alertPopup("Email can't be empty.", "error");
//        return false;
//    }

//    var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/igm;
//    if (!re.test(email) && email.indexOf("**") === -1)
//    {
//        alertPopup("Invalid email entered", 'error');
//        return false;
//    }

//    if(mobile == '')
//    {
//        alertPopup("Mobile can't be empty.", "error");
//        return false;
//    }

    if(checkEmailUpdated == 1 && leadEmail != '' && leadEmail != email)
    {
        blockLevel = 1;
    }


    if(checkMobileUpdated == 1 && leadMobile != '' && leadMobile != mobile)
    {
        let mobileLimit = 0;
        let countryDialCode = '';

        if($('#country_dial_codeMobile').length)
        {
            countryDialCode = $('#country_dial_codeMobile').val();
        }

        if(countryDialCode === '' || countryDialCode === "+91")
        {
            mobileLimit = 10;
        }else{
            mobileLimit = 16;
        }

        if(
            ((countryDialCode === '' || countryDialCode === "+91") && mobile.length === mobileLimit) ||
            (countryDialCode !== '' && countryDialCode !== "+91" && mobile.length <= mobileLimit && mobile.length >= 5)
            )
        {
            if(blockLevel === 1)
            {
                blockLevel = 3;
            }else{
                blockLevel = 2;
            }
        }else{
            alertPopup("Please enter valid mobile number.", "error");
            return false;
        }
    }

    if(blockLevel === 1)
    {
        html += "You have changed email id but not sent verification mail. Click on <strong>CANCEL</strong> to go back and send verification mail or <strong>SAVE ANYWAY</strong> to proceed without changing email id.";
    }else if(blockLevel === 2)
    {
        html += "You have changed mobile number but not sent OTP. Click on <strong>CANCEL</strong> to go back and send OTP or <strong>SAVE ANYWAY</strong> to proceed without changing mobile number.";
    }else{
        html += "You have changed email id & mobile number but not sent verification email & OTP. Click on <strong>CANCEL</strong> to go back and send verification mail & OTP or <strong>SAVE ANYWAY</strong> to proceed without changing email & mobile number.";
    }


    if(blockLevel !==0)
    {
        $("#confirmPopupEmailMobileEditYes, #confirmPopupEmailMobileEditNo").unbind("click");
        $('#confirmPopupEmailMobileEditMsgBody').html(html);
        $('#confirmPopupEmailMobileEdit').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmPopupEmailMobileEditYes', function () {
            $('#confirmPopupEmailMobileEdit').modal('hide');
            $("#emailUpdated").attr("data-restrict","0");
            $("#mobileUpdated").attr("data-restrict","0");
            setTimeout(function(){$(elem).trigger("click");}, 1000);
            return true;
        })
        .one('click', '#confirmPopupEmailMobileEditNo', function () {
            $('#confirmPopupEmailMobileEdit').modal('hide');
            return false;
        });
        return false;
    }
    $(elem).attr("onclick", "saveProfileUsers(this.form);");
    $(elem).trigger("click");
}

function emailUniqueness(email, collegeId)
{
    if(jsVars.emailByPass)
    {
        return false;
    }
    let mobile = "";
    let emailFound = false;
    // check for uniqueness
    mobile = "";
        $.ajax({
            url: '/common/check-email-exist',
            type: 'post',
            dataType: 'json',
            async: false,
            data: {
                mobile: $.trim(mobile),
                email: $.trim(email),
                collegeId: collegeId,
                excludeCurrentUser: $('#userId').val(),
                uploadVia: "email"
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            complete: function(){
                $("#emailUpdated").attr("data-restrict", 0);
            },
            success: function (response) {
                if (typeof response['data'] !== 'undefined' && response['data'] != '') {
                    emailFound = true;
                } else {
                    emailFound = false;
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

    return emailFound;
}


// Code by Gabbar Singh
$(document).on('click','#resubscribeUserLink',function(){
    var vallink = $("#resubscribeUserLink").data('value');
    $("#dynamicData").html(vallink);
    $('#viewReSubsribedModal').modal({backdrop: 'static', keyboard: false});
});
function singleReSubscribeWindow(){
    var fdata = $("#dynamicData").text();
    $('#viewReSubsribedModal').modal('hide');
    showLoader();
    $.ajax({
        cache: false,
        url: jsVars.FULL_URL + '/communications/re-subscribeuser',
        type: 'post',
        data: {'fdata':fdata},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        complete: function () {
            hideLoader();
        },
        success: function (json) { 
            if (json['error']){
                alertPopup(json['error'], 'error');
            }else if (json['success'] == 200){ 
                $('body').css('padding-right', '0');
                $('#resubscribeUserLink').removeClass('display-inlineBlock');
                $('#resubscribeUserLink').css("display","none");
                alertPopup('The user '+json['email']+' has been resubscribed to the mailing list', 'success');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return;
}


$(document).on('click','#emailSwapping',function(){
    var emailData = $("#emailSwapping").data('value').split("~");
    $("#fromemail").html(emailData[0]);
    $("#toemail").html(emailData[1]);
    $("#EmailcrntUserId").html(emailData[2]);
    $("#EmailcollegeId").html(emailData[3]);
    if(emailData[4]=='email_disabled_swapping'){
        singleEmailSwapping();
    }else{
        $('#emailSwapModal').modal({backdrop: 'static', keyboard: false});        
    }
    
});

function singleEmailSwapping(){
    var fromemail = $("#fromemail").text();
    var toemail = $("#toemail").text();
    var crntUserId = $("#EmailcrntUserId").text();
    var collegeId = $("#EmailcollegeId").text();
    $('#emailSwapModal').modal('hide');
    showLoader();
    $.ajax({
        cache: false,
        url: jsVars.FULL_URL + '/counsellors/email-swapping',
        type: 'post',
        data: {'fromemail':fromemail, 'toemail':toemail, 'crntUserId':crntUserId, 'collegeId':collegeId},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        complete: function () {
            hideLoader();
        },
        success: function (json) { 
            if (json['redirect']) {
                location = json['redirect'];
            }else if (json['error']){
                alertPopup(json['error'], 'error');
            }else if (json['success'] == 200){ 
                $('body').css('padding-right', '0');
                if(json['msg']=='enableEmail'){
                    var successText = "An email is sent on " + toemail + " &nbsp;with a verification link. Once lead will click the link email id will be changed automatically.";
                    alertPopup(successText, 'success');
                }else if(json['msg']=='disableEmail'){
                    window.location.reload(true);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return;
}

$(document).on('click','#mobileSwappingLink',function(){
    var mobileData = $("#mobileSwappingLink").data('value').split("~");
    $("#frommobile").html(mobileData[0]);
    $("#tomobile").html(mobileData[1]);
    $("#MobilecrntUserId").html(mobileData[2]);
    $("#MobilecollegeId").html(mobileData[3]);
    if(mobileData[4]=='otp_disabled_swapping'){
        $('#mobileSwapModal').modal({backdrop: 'static', keyboard: false});
    }else{
        singleMobileSwapping();
    }
});

function singleMobileSwapping(){
    var frommobile = $("#frommobile").text();
    var tomobile = $("#tomobile").text();
    var crntUserId = $("#MobilecrntUserId").text();
    var collegeId = $("#MobilecollegeId").text();
    var countryDialCode = '';
    if ($("input#country_dial_codeMobile").length > 0) {
        countryDialCode = $("input#country_dial_codeMobile").val();
    }
    if ((countryDialCode == '') || (countryDialCode == null)) {
        countryDialCode = '+91';
    }
    $('#mobileSwapModal').modal('hide');
    showLoader();
    $.ajax({
        cache: false,
        url: jsVars.FULL_URL + '/counsellors/mobile-swapping',
        type: 'post',
        data: {'frommobile':frommobile, 'tomobile':tomobile, countryDialCode: $.trim(countryDialCode) ,  'crntUserId':crntUserId, 'collegeId':collegeId},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        complete: function () {
            hideLoader();
        },
        success: function (json) { 
            if (json['redirect']) {
                location = json['redirect'];
            }else if (json['error']){
                alertPopup(json['error'], 'error');
            }else if (json['success'] == 200){ 
                $('body').css('padding-right', '0');
                if(json['msg']=='enableOtp'){
                    var successText = "OTP with a link has been sent on " + countryDialCode + "-" + tomobile + ". For mobile swapping, collect OTP from the applicant and enter here or ask the applicant to click on the link.";
                    alertPopup(successText, 'success');
                    showVerificationPanel();
                    countdownStart(); /* 30 seconds timer start */
                    $('#inputOtp').val('');
                    $('#inputOtp').removeAttr('disabled');
                    $('#otpresendlink a').attr('onclick', 'return sendMobileSwappingOtp();');
                    $('#otpresendlink').hide();
                    $('#otpverifylink-text').html('OTP Sent');
                    $('input#isMobileSwapOtpVerified').val('1');
                }else if(json['msg']=='disableOtp'){
                    window.location.reload(true);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return;
}

$(function() {
    $('#email').on('keypress', function(e) {
        if (e.which == 32){
            return false;
        }
    });   
});

function removeSpacesfromEmail(string) {
    return string.split(' ').join('');
}

function sendMobileSwappingOtp() {
    $('a#mobileSwappingLink').trigger('click');
}

function proceedToReassign(){
    $.ajax({
        url: jsVars.reassignLeadLink,
        type: 'post',
        data: {'userId' : currentUserId, 'collegeId':currentCollegeId, 'formId':currentFormId, 'assignedTo':$("#assignedTo").val(), 'unassignedFrom':$("#unassignedFrom").val(), 'reassignRemark':$("#reassignRemark").val(), moduleName:$('#moduleName').val(),'applicationReassignCheck':applicationReassignCheck,'queryReassignCheck':queryReassignCheck,'leadReassignCheck':leadReassignCheck},
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
                //If Lead is Re-Assigned from user profile page
                if($("#reassign_lead_from").length > 0){
                    let activeTab = $("#leadProfile ul li.resp-tab-active a").text();
                    if(activeTab == "Timeline")
                    {
                        getActivityLogs();
                    }
                    if(activeTab == "Follow up & Notes ")
                    {
                        getFollowupAndRemarks();
                    }
                }
            }else{
                alertPopup(responseObject.message,'error');
            }
            $("#reassignButtonId").show();
            $("#reassignButtonIdButtonWait").hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $("#reassignButtonId").show();
            $("#reassignButtonIdButtonWait").hide();
        }
    });
}

function showSelectedFiles(id) {
    $('#'+id).parent().removeClass('file')
    $('#'+id+'_choose_files').val('')
    var input = document.getElementById(id);
    var output = document.getElementById(id+'_show');
    var chooseFiles = document.getElementById(id+'_choose_files');
    var children = "";
    var selectFiles = "";
    for (var i = 0; i < input.files.length; ++i) {
        if(i>0){
            selectFiles = (i+1) + " files" ;
        }else{
             selectFiles += input.files.item(i).name ;
        }
        children += '<span class="badge">' + input.files.item(i).name + '</span>&nbsp;';
        
    }
    chooseFiles.value = selectFiles;
}

function deleteUploadRegFile(userId,fileId,collegeId,fieldName,id){
    
    $('#ConfirmMsgBody').html("Are you sure you want to delete this file?");
    
    $('#confirmYes').unbind('click');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false});
    $('#confirmYes').click(function (e) {
        if(userId)
        {   
            
            $.ajax({
                url: jsVars.FULL_URL+'/counsellors/deleteRegFile',
                type: 'post',
                data: {userId:userId,fileId:fileId,collegeId:collegeId,fieldName:fieldName},
                dataType: 'json',
                headers: {
                    "X-CSRF-Token": jsVars._csrfToken
                },
                beforeSend: function() {                    
                        //$('div.loader-block-a').show();
                },
                complete: function() {
                        //$('div.loader-block-a').hide();
                },
                success: function (data) 
                {
                    if(data['status']){
                        $('#'+fieldName+'_'+fileId).closest('li').remove()
                        $('#'+fieldName+'_'+fileId+'_additional').closest('li').remove()
                    }else{
                        if(data['message'])
                        {
                            alertPopup(data['message'],'error');
                        }
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    $('div.loader-block-a').hide();
                }
            });
            $('#ConfirmPopupArea').modal('hide');
        }
    });
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

function resetInputFile(el){
    var fieldId = $(el).data("id")
    $('#'+fieldId).val('')
    $('#'+fieldId+'_choose_files').val('')
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