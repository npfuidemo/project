//$.material.init();
$(document).ready(function () {
    var NPFScorePanelDeails=0;
    LoadDateTimeRangepicker();
    $('#evaluator_id').SumoSelect({okCancelInMulti:true, search: true, searchText:'Search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
    PopupBatchBind();
    
    $(document).on('click','span.sorting_span i', function (){
        jQuery("span.sorting_span i").removeClass('active');
        var field = jQuery(this).data('column');
        var data_sorting = jQuery(this).data('sorting');
        $('#sort_options').val(field+"||"+data_sorting);
        jQuery(this).addClass('active');
        getScoreDetails('reset');
    });
    
    $(".erroralert").delay(5000).slideUp(300);
    $(".successalert").delay(5000).slideUp(300);
    $('#msgView').hide();
	$('#filterView').show();
    $('.user-tabuler-data').on('click', function () {
        var container_id = $(this).attr('id');
        if (container_id == 'table-view') {
            $(".showforList").show();
            $('#snapshot-view').removeClass('active');
            $('#snapshot-view').parent().removeClass('active');
            $(this).addClass('active');
            $(this).parent().addClass('active');
            $('#table-data-view').show();
            $('#snapshot-data-view, .onlySnapshotView').hide();
            $('#table-data-view, #LoadMoreArea').show();
            $('.hide_extraparam').show();
            $('#searchBtnreset').attr('disabled',false);
            getScoreDetails('reset');
            //$('#for-snapshot').removeClass('disableArea');
            //$('#for-snapshot .label_snapshot').hide();
			$('#msgView').hide();
			$('#filterView').show();
        }else if (container_id == 'snapshot-view') {
            if($("#college_id").val()!=''){
                $("#snapshot-view").show();
                $(".showforList").hide();
                $(this).addClass('active');
                $(this).parent().addClass('active');
                $('#table-view').removeClass('active');
                $('#table-view').parent().removeClass('active');
                $('#table-data-view, #LoadMoreArea').hide();
                $('.hide_extraparam').hide();
                $('#snapshot-data-view, .onlySnapshotView').show();
                $('#searchBtnreset').attr('disabled',true);
                //$('#for-snapshot').addClass('disableArea');
				$('#msgView').show();
				$('#filterView').hide();
                //$('#for-snapshot .label_snapshot').show();
                google.charts.load("current", {packages: ["corechart"]});
                google.charts.setOnLoadCallback(function(){
                    getUserGraphData();
                });
            }else{
                alertPopupAssignedInstitute("Please Select College.", "error");
            }
        }
    });
    
    if ($('#updateAllocationDate').length > 0) {
        var d = new Date();
        $('#updateAllocationDate').datetimepicker({format: 'DD/MM/YYYY HH:mm:ss',viewMode: 'years', minDate:new Date(d.getFullYear(), d.getMonth(), d.getDate(), 00, 00, 00, 00)});
        $('.datetimepicker').datetimepicker({format: 'DD/MM/YYYY',viewMode: 'years'});
        
    }
    if ($('#singleupdateAllocationDate').length > 0) {
        var d = new Date();
        $('#singleupdateAllocationDate').datetimepicker({format: 'DD/MM/YYYY HH:mm:ss',viewMode: 'years', minDate:new Date(d.getFullYear(), d.getMonth(), d.getDate(), 00, 00, 00, 00)});
        $('.datetimepicker').datetimepicker({format: 'DD/MM/YYYY',viewMode: 'years'});
    }
    
    $('.modal').on('show.bs.modal', function (e) {
        if($('#assignedTo').length>0) {
            $("#showNotes").hide();
        }
    });
    
    $(document).on('change', '#assignedTo', function() {
        var selval = $('#assignedTo option:selected').val();
        if(selval=='unassign') {
            $("#showNotes").show();
        }else{
            $("#showNotes").hide();
        }
    });
    getEvaluatorsGroup();
});

jQuery(window).load(function(){
    jQuery(".initHide").addClass('initShow');
});
var currentCounsellorId     = jsVars.counsellorId;
var currentCollegeId        = '';

function getUserGraphData() {
    var data = $('#FilterApplicationNumber').serializeArray();
    $.ajax({
        url: jsVars.FULL_URL+'/settings/getEvaluatorGraphData',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function () {
            $('#parent').css('min-height', '50px');
            showLoader();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (response) {
            $("#graphReponseDiv").hide();
            $(".graphContainerClass").hide();
            $('#parent').css('min-height', '0');
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 200) {
                if (typeof responseObject.data === "object") {
                    if(typeof responseObject.data.graphData === "object"){
                        $(".chatDiv").show().addClass('fadeInUp');
                       /* $(".chatDiv").show(function () {
                           // $("html, body").animate({scrollTop: 200}, "slow");
                        });*/
                        $("#graphDivtotal").show();
                        drawCounsellorWiseBarChart('', 'reg_chart_div', responseObject.data.graphData)
                    }
                    if (typeof responseObject.data.evaluatorList === "object") {
                        //set evaluator list
                        var value   = '';
                        var counter = 0;
                        var value= '';
                        var counsellorsSelectList='';
                        $.each(responseObject.data.evaluatorList, function (index, item) {
                            counsellorsSelectList = responseObject.data.evaluatorSelected
                           
                            if(counsellorsSelectList.indexOf(parseInt(index)) >= 0){ ++counter;
                                value += '<option value="'+index+'" selected="true">'+item+'</option>';
                            }
                            else 
                            if(counsellorsSelectList.indexOf(index) >= 0){ ++counter;  //unassigned selected
                                value += '<option value="'+index+'" selected="true">'+item+'</option>';
                            } 
                            else if((counsellorsSelectList.length > 10) && (++counter<=10)){
                                value += '<option value="'+index+'" selected="true">'+item+'</option>';
                            }
                            else{
                                value += '<option value="'+index+'">'+item+'</option>';
                            }
                        });
                        $('#evaluator_id').html(value);
                        $('#evaluator_id')[0].sumo.reload();
                    }
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError);
        },
        complete: function () {
            hideLoader();
        }
    });
}

function getEvaluatorList(panel_id) {
    var college_id = $('select#college_id').val();
    if(college_id=='' || college_id==null){
        return false;
    }
    $.ajax({
        url: jsVars.FULL_URL+'/settings/getEvaluatorList',
        type: 'post',
        dataType: 'html',
        data: {'college_id':college_id,'panel_id':panel_id},
        beforeSend: function () { 
            //$('#listloader').show();
        },
        complete:function(){
            //$('#listloader').hide();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        async:false,
        success: function (html) {
            var responseObject = $.parseJSON(html);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            
            if (responseObject.status == 1) {
                $('#evaluator_name').html(responseObject.data);
                $("#evaluator_name").trigger('chosen:updated');
            } else {
                //alertPopup(responseObject.message, 'error');
                console.log(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //window.location.reload(true);
        }
    });
    
}


function getPanelList(college_id, defaultValue){
    $.ajax({
        url: jsVars.FULL_URL+'/settings/getPanelList',
        type: 'post',
        dataType: 'html',
        data: {'college_id':college_id,'defaultValue':defaultValue},
        beforeSend: function () { 
            //$('#listloader').show();
        },
        complete:function(){
            //$('#listloader').hide();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        async:false,
        success: function (html) {
            var responseObject = $.parseJSON(html);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            
            if (responseObject.status == 1) {
                $('#scoring_panel').html(responseObject.data);
                $("#scoring_panel").trigger('chosen:updated');
            } else {
                //alertPopup(responseObject.message, 'error');
                console.log(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //window.location.reload(true);
        }
    });
}

$(document).ready(function() 
 {
    $('#evaluation_date').on('apply.daterangepicker', function(ev, picker) {
        setGroupRangeList();
    });
    $('#evaluation_date').on('cancel.daterangepicker', function(ev, picker) {
        setGroupRangeList();
    });
 });

function setGroupRangeList(){
    setTimeout(function() { 
        $('#evaluation_date_for_group').val($("#evaluation_date").val());
        var evaluator_id = $('#evaluator_name').val();
        getGroupList(evaluator_id);
    }, 100);
}

function getGroupList(evaluator_id){
    var college_id = $('#college_id').val();
    var panel_id = $('#scoring_panel').val();
    var evaluation_date = $('#evaluation_date_for_group').val();

    $.ajax({
        url: jsVars.FULL_URL+'/settings/getGroupList',
        type: 'post',
        dataType: 'html',
        data: {'evaluator_id':evaluator_id,'college_id':college_id,'panel_id':panel_id,'evaluation_date':evaluation_date},
        beforeSend: function () { 
            //$('#listloader').show();
        },
        complete:function(){
            //$('#listloader').hide();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        async:false,
        success: function (html) {
            var responseObject = $.parseJSON(html);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            
            if (responseObject.status == 1) {
                $('#group').html(responseObject.data);
                $("#group").trigger('chosen:updated');
            } else {
                //alertPopup(responseObject.message, 'error');
                console.log(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //window.location.reload(true);
        }
    });
}

$(document).on('change','#evaluator_name', function(){
    onchangefunction();
})
$(document).on('change','#status', function(){
    onchangefunction();
})
$(document).on('change','#group', function(){
    onchangefunction();
})

function onchangefunction(){
    $(".hideShow").hide();
    $("#LoadMoreArea").hide();
    $("#load_msg_div").show();
    $("#load_no_record_msgs").hide();
    $("#load_more_results_msg").html('<h4 class="text-center text-danger">Looks Like you have changed the filters but have not applied. Kindly click on Apply button to view the results.</h4>');
}


function getScoreDetails(type){
    $(".hideShow").show();
    $('#load_msg_div').hide();
    $("#load_more_results_msg").html('');
    $("#search-field-error").hide();
    if (type == 'reset') {
        NPFScorePanelDeails = 0;
        $('#load_more_results').closest('div').removeClass('table-border');
        $('.if_record_exists').hide();
        $('#load_more_results').html("");
		$('#load_msg_div').hide();
        $('#load_more_results_msg').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
    }
    //$("#reassignId").hide();
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').hide();
//    if($("#college_id").val()!='' && $("#scoring_panel").val()!='' && $("#evaluator_name").val()!='' && $("#status").val()=='0'){
//        $("#reassignId").show();
//    }else{
//        $("#reassignId").hide();
//    }
    var data = $('#FilterApplicationNumber').serializeArray();
    data.push({name: "page", value: NPFScorePanelDeails});
    
    var status = $("#status").val();
    if(status == 1 && jsVars.editApplicantScoringPanelPermission == false){
	$(".bulkevalution").hide();
    }else{
	$(".bulkevalution").show();
    }
    
    $.ajax({
        url: jsVars.FULL_URL+'/settings/ajaxEvaluatorDetails',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function () {
           $('#parent').css('min-height', '50px');
           $('#searchBtnreset').attr('disabled',true);
           showLoader();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        async:true,
        success: function (data) {
			//$('#listloader').hide();
            $("#search-field-error").hide();
            NPFScorePanelDeails = NPFScorePanelDeails + 1;
            if(data=='session_logout'){
                window.location.reload(true);
            }else if(data=='invalid_request_csrf'){
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;Load more users");
                $('#load_more_button').hide();
                $('.if_record_exists').hide();
				//$('.hideonError').hide();
				$('#load_msg_div').show();
                $('#load_more_results_msg').html('Invalid Request.');
            }else if(data=='no_record_found'){
                $('#load_more_button').html("Load More Leads");
                $('#load_more_button').hide();
                //$('.hideonError').hide();
                if(NPFScorePanelDeails==1){
					$('#load_msg_div').show();
                    $('#load_more_results_msg').html('No Record Found');
                }else{
                    $('#load_more_results_msg').html('<div class="text-center text-danger">No More Record</div>');
                }
            }else if(data=='select_college'){
                $('#load_more_button').html("");
                //$('.hideonError').hide();
				$('#load_more_button').hide();
				$('#load_msg_div').show();
                $('#load_more_results_msg').html('Please Select Institute.');
            }else if(data=='scoring_panel'){
                $('#load_more_button').html("'");
                $('#load_more_button').hide();
				//$('.hideonError').hide();
				$('#load_msg_div').show();
                $('#load_more_results_msg').html('Please Select Scoring Panel.');
            }else if(data=='evaluator_name'){
                $('#load_more_button').html("'");
				//$('.hideonError').hide();
                $('#load_more_button').hide();
				$('#load_msg_div').show();
                $('#load_more_results_msg').html('Please Select Evaluator.');
            }else if(data=='config_missing'){
                $('#load_more_button').html("'");
				//$('.hideonError').hide();
                $('#load_more_button').hide();
				$('#load_msg_div').show();
                $('#load_more_results_msg').html('Configuration missing or scoring fields is not available');
            }else{
                data = data.replace("<head/>", '');
                $('.hideonError').show();
                $('#load_more_results').append(data);
                var ttl = $('#current_record').val();
                var error = $("#error").val();
                if(parseInt(ttl) < 10){
                    $('#LoadMoreArea').hide();
                }else{
                    $('#LoadMoreArea').show();
                }
                $('#load_more_results').closest('div').addClass('table-border');
                $('#load_more_button').removeAttr("disabled");
                if(typeof error === 'undefined'){
                    $('#load_no_record_msgs').hide();
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;Load More Users");
                }else if(error === 'no_record_found'){
                    $('#LoadMoreArea').hide();
                    $('#load_no_record_msgs').show();
                    $('#load_no_record_msgs').html('<div class="text-center text-danger">No More Record</div>');
                }  
                $('.if_record_exists').fadeIn();
                $('#load_more_button').fadeIn();
				table_fix_rowcol();
				//dropdownMenuPlacement();
                //determineDropDirection();
                currentCounsellorId     = jsVars.counsellorId;
                if($("#evaluator_name").length && $("#evaluator_name").val()!==""){
                    currentCounsellorId    = $("#evaluator_name").val();
                }
                $(".trigerTableView").on('click', function (e) {
                    $('#snapshot-view').removeClass('active');
                    $('#snapshot-view').parent().removeClass('active');
                    $("#table-view").addClass('active');
                    $("#table-view").parent().addClass('active');
                    $('#table-data-view').show();
                    $('#snapshot-data-view').hide();
                    $('.mobDropCorg').show();
                    //$('#for-snapshot').removeClass('disableArea');
                    //$('#for-snapshot .label_snapshot').hide();
					$('#msgView').hide();
					$('#filterView').show();
                    $('#searchBtnreset').attr('disabled',false);
                    $('#table-data-view, #LoadMoreArea').show();
                    $('.onlySnapshotView').hide();
                    $('.hide_extraparam').show();
                    e.preventDefault();
                });
                var searchField = $('#searchFields').val();
                var searchByField = $.trim($('#search_by_field').val());

                if((searchField !='') && (searchByField == '') ) {
                    if(searchByField == '') {
                        $("#search-field-error").text("Please select field");
                        $("#search-field-error").show();
                    } else {
                        $("#search-field-error").text("");
                        $("#search-field-error").hide();
                    }
                }
            }
            dropdownMenuPlacement();
            $('.offCanvasModal').modal('hide');
            showHideVideoLink();
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //window.location.reload(true);
        },
        complete: function () {
            hideLoader();
            $('#searchBtnreset').attr('disabled',false);
			//$('#listloader').hide();
        }
    });
}
function mappingPopup(){
    var html = $('#popupContentText').html();
	$('#ActivityLogPopupArea').removeClass('offCanvasModal right');
	$('#ActivityLogPopupArea .close').css({"color":"#fff", "font-size":"16px", "margin-top":"5px", "opacity":"0.8"});
    $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
    $('#ActivityLogPopupArea #alertTitle').text('Steps to Follow');
    $('#ActivityLogPopupHTMLSection').html(html);
    $('#ActivityLogPopupLink').trigger('click');
}

function PopupBatchBind(){
    
    $('.modalButton').on('click', function(e) {
        var $form = $("#FilterApplicationNumber");
        
        $form.attr("action",'/settings/ajaxEvaluatorDetails');
        $form.attr("target",'modalIframe');
        $form.append($("<input>").attr({"value":"export", "name":"export",'type':"hidden","id":"export"}));
        var onsubmit_attr = $form.attr("onsubmit");
        $form.removeAttr("onsubmit");
        $form.submit();
        $form.attr("onsubmit",onsubmit_attr);
        $form.find('input[name="export"]').val("");
        $form.removeAttr("target");
    });
    $('#myModal').on('hidden.bs.modal', function(){
        $("#modalIframe").html("");
        $("#modalIframe").attr("src", "");
    });
}

function selectAllLead(elem){
    
    $('#select_all').attr('checked',true);
    if(elem.checked){
        //console.log(elem.checked);
        $('.select_lead').each(function(){
            this.checked = true;
        });
       
    }else{
        $('.select_lead').attr('checked',false);
    }
    
    $('div.loader-block').hide();
}

$(document).on('click', '.select_lead',function(e) {
    
    $('#select_all').attr('checked',false);
    
});


function initiateReassignLead() {
    $("#leadReassignMessageDiv").html("");
    
    if($('#evaluator_name').val()==''){
        alertPopup('Please select Evaluator','error');
        return;
    }
    
    if($('#status').val()==''){
        alertPopup('Please select Status','error');
        return;
    }
    if($('#status').val()!=0){
        alertPopup('Please select Status Value "Pending"','error');
        return;
    }
    if($('#video_meeting_schedule').val() == ''){
        alertPopup('Please select Video Meeting Status','error');
        return;
    }
    if($('input:checkbox[name="selected_users[]"]:checked').length < 1 && $('#select_all:checked').val()!='select_all'){
        alertPopup('Please select Applicants','error');
        return;
    }
    getEvaluators($("#college_id").val());
    $('#reassign').attr('onClick','reassignLead("/settings/bulkReassignEvaluator")');
    $('#evaluatorReassignModal').modal('show');
}

var collegeIdForSlotDelete = '';
var formIdForSlotDelete = '';
var applicantIdForSlotDelete = '';
var panelIdForSlotDelete = '';
var gdpiProcessIdForSlotDelete = '';
var applicationNoForSlotDelete = '';
function deleteSlotModal(panelId, collegeId, formId, applicantId, gdpiProcessId, applicationNo) {
    panelIdForSlotDelete = panelId;
    collegeIdForSlotDelete = collegeId;
    formIdForSlotDelete = formId;
    applicantIdForSlotDelete = applicantId;
    gdpiProcessIdForSlotDelete = gdpiProcessId;
    applicationNoForSlotDelete = applicationNo;
    $(document).find('#applicantSlotDeletion').attr('disabled', true);
    $('.slotDeletion').SumoSelect({placeholder: 'Select Interview Process', search: true, searchText:'Select Interview Process'});
    $(document).find('#gdpiProcessId')[0].sumo.enable();
    $.ajax({
        url: jsVars.FULL_URL+'/virtual-post-applications/getBookedGdpiProcess/'+collegeIdForSlotDelete,
        type: 'post',
        data: {'collegeId':collegeIdForSlotDelete, 'formId':formIdForSlotDelete, 'applicantId':applicantIdForSlotDelete},
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
        success: function (response) {
            if(response['status'] ===0 && response['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(response['status'] ===1) {
                var options = '<option value="">Select Interview Process</option>';
                var disableSelect = false;
                $.each( response['data']['processList'], function( index, value ){
                    if(value['process_id'] == gdpiProcessId && gdpiProcessId != '0') {
                        options += '<option value="'+value['process_id']+'" selected>'+value['name']+'</option>';
                        disableSelect = true;
                    } else {
                        options += '<option value="'+value['process_id']+'">'+value['name']+'</option>';
                    }
                });
                $(document).find('#gdpiProcessId').html(options);
                $(document).find('#deletionRemarks').val('');
                $(document).find('#gdpiProcessId')[0].sumo.reload();
                if(disableSelect === true) {
                    $(document).find('#gdpiProcessId')[0].sumo.disable();
                    $(document).find('#applicantSlotDeletion').attr('disabled', false);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    $('#slotDeletionModal').modal('show');
}

$(document).on('change', '#gdpiProcessId', function (){
    $(document).find('#loadGdpiSlotData').html('');
    $(document).find('#applicantSlotDeletion').attr('disabled', true);
    var processId = $(this).val();
    if(processId === '') {
        return false;
    }
    $(document).find('#applicantSlotDeletion').attr('disabled', false);
});

$(document).on('click', '#applicantSlotDeletion', function(){
    $('#slotDeletionModal').modal('hide');
    $('#ConfirmAlertYesBtn').unbind();
    $('#ConfirmAlertNoBtn').unbind();
    $('#ConfirmAlertPopUpTextArea').html("You have requested to delete slot for Application No "+applicationNoForSlotDelete+". This will also delete any video meetings scheduled for the candidate. Would you like to proceed?");
    $('#ConfirmAlertPopUpSection .modal-title').html("Delete Slot");
    $("#ConfirmAlertPopUpSection").modal("show");
    $("#ConfirmAlertYesBtn").on("click", function () {
        slotDeletion();
    });
});

function slotDeletion() {
    var processId = $(document).find('#gdpiProcessId').val();
    if(processId === '') {
        return false;
    }
    var remarks = $(document).find('#deletionRemarks').val();
    $.ajax({
        url: jsVars.FULL_URL+'/virtual-post-applications/deleteSlotBookingAndMeeting/'+collegeIdForSlotDelete,
        type: 'post',
        data: {'collegeId':collegeIdForSlotDelete, 'formId':formIdForSlotDelete, 'applicantId':applicantIdForSlotDelete, 'processId':processId, 'panelId':panelIdForSlotDelete, 'remarks':remarks, 'applicationNo':applicationNoForSlotDelete},
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
        success: function (response) {
            if(response['status'] ===0 && response['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(response['status'] ===1) {
                alertPopup('Slot deleted successfully','success');
                getScoreDetails('reset');
            } else {
                alertPopup(response['message'],'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function initiateReassignGroup() {
    $("#leadReassignMessageDiv").html("");
    
    if($('#evaluator_name').val()==''){
        alertPopup('Please select Evaluator','error');
        return;
    }
    
    if($('#status').val()==''){
        alertPopup('Please select Status','error');
        return;
    }
    if($('#group').val()==''){
        alertPopup('Please select Group','error');
        return;
    }
    if($('#status').val()!=0){
        alertPopup('Please select Status Value "Pending"','error');
        return;
    }
    if($('#video_meeting_schedule').val() == '' || $('#video_meeting_schedule').val() == 1){
        alertPopup('Please select Video Meeting Status Value "No"','error');
        return;
    }
    
    if($('input:checkbox[name="selected_users[]"]:checked').length < 1 && $('#select_all:checked').val()!='select_all'){
        alertPopup('Please select Applicants','error');
        return;
    }
    
    getEvaluatorsGroup();
    $('#reassign').attr('onClick','reassignLead("/settings/bulkReassignGroup")');
    $('#evaluatorReassignModal').modal('show');
}

function getEvaluatorsGroup() {    
    
    
    $("#leadReassignMessageDiv").html('');
    
    var groupRange = $('#group_range').val();
    var assignFrom = $('#group option:selected').text();
    
    var unassignFrom  = '<select name="unassignedFrom" id="unassignedFrom" class="sumo-select" tabindex="-1" data-placeholder="Unassign From"><option value="'+assignFrom+'" selected="selected">'+assignFrom+'</option></select>'; 
    $('#unassignFromDiv').html(unassignFrom);
   
    var counsellors  = '<select name="assignedTo" id="assignedTo" class="sumo-select" tabindex="-1" ><option value="">Select Group</option>';
    for(var groupID=1;groupID<=groupRange;groupID++) {
	if(groupID != assignFrom)
	counsellors += '<option value="'+groupID+'">'+groupID+'</option>';
    }
    counsellors += '</select>';
    $('#assignedToListDiv').html(counsellors);
    $('.sumo-select').SumoSelect({placeholder: 'Select Group', search: true, searchText:'Select Group'});
    
}

function initiateDateAllocation() {
    $("#dateAllocationMessageDiv").html("");
    if($('#evaluator_name').val()==''){
        alertPopup('Please select Evaluator','error');
        return;
    }
    
    if($('#status').val()==''){
        alertPopup('Please select Status','error');
        return;
    }
    if($('#status').val()!=0){
        alertPopup('Please select Status Value "Pending"','error');
        return;
    }
    if($('#video_meeting_schedule').val() == '' || $('#video_meeting_schedule').val() == 1){
        alertPopup('Please select Video Meeting Status Value "No"','error');
        return;
    }
    if($('input:checkbox[name="selected_users[]"]:checked').length < 1 && $('#select_all:checked').val()!='select_all'){
        alertPopup('Please select Applicants','error');
        return;
    }
    $('#evaluationDateAllocationModal').modal('show');
}

function initiateBulkEvaluation() {
    $("#dateAllocationMessageDiv").html("");
    if($('#evaluator_name').val()==''){
        alertPopup('Please select Evaluator,Status and Group to continue','error');
        return;
    }
    
    if($('#status').val()==''){
        alertPopup('Please select Evaluator,Status and Group to continue','error');
        return;
    }
    
    
    if($('#group').val()==''){
        alertPopup('Please select Evaluator,Status and Group to continue','error');
        return;
    }
    
    if($('#evaluator_name').val()!=jsVars.counsellorId){
	alertPopup('Access Denied','error');
        return;
    }
    
    var data = $("form#FilterApplicationNumber").serializeArray();
    $.ajax({
            url: jsVars.getHash,
            type: 'post',
            data: data,
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('#evaluationDateAllocationModal').modal('hide');
                showLoader();
            },
            complete: function () {
                $('#evaluationDateAllocationModal').modal('hide');
                hideLoader();
            },
            success: function (response) {
                var responseObject = $.parseJSON(response);
                if (responseObject.status === 1) {
                    if(responseObject.version==1){
                        location = '/score-card/group-scoring-panel/'+responseObject.hash;
                    }else{
                        location = '/settings/group-scoring-panel/'+responseObject.hash;
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
	
//    var $form = $("#FilterApplicationNumber");    
//    $form.attr("action",'/settings/group-scoring-panel');
//    $form.submit();
    
}

function updateAllocationDate() {
    if ($("#updateAllocationDate").val() == '') {
        $("#dateAllocationMessageDiv").html("<div class='alert-danger'>Please select date</div>");
        return;
    }
    $("#dateAllocationMessageDiv").html("");
    proceedToUpdateAllocation();
}

function proceedToUpdateAllocation() {
    var users = [];
    $('input:checkbox[name="selected_users[]"]').each(function () {
        if (this.checked) {
            users.push(parseInt($(this).val()));
        }
    });
    if ($('#select_all:checked').val() == 'select_all') {
        var data = {'userId': 'all', 'collegeId': $("#college_id").val(), 'updateAllocationDate': $("#updateAllocationDate").val(), 'scoring_panel': $("#scoring_panel").val(), 'evaluator_name': $("#evaluator_name").val(), 'status': $("#status").val(), 'filters': $("#leadsListFilters").val()};
    } else {
        var data = {'userId': users, 'collegeId': $("#college_id").val(), 'updateAllocationDate': $("#updateAllocationDate").val(), 'scoring_panel': $("#scoring_panel").val(), 'evaluator_name': $("#evaluator_name").val(), 'status': $("#status").val()};
    }
    if (users.length > 0 || $('#select_all:checked').val() == 'select_all') {
        $.ajax({
            url: jsVars.bulkupdateAllocationDateLink,
            type: 'post',
            data: data,
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('#evaluationDateAllocationModal').modal('hide');
                showLoader();
            },
            complete: function () {
                $('#evaluationDateAllocationModal').modal('hide');
                hideLoader();
            },
            success: function (response) {
                var responseObject = $.parseJSON(response);
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }
                if (responseObject.status == 1) {
                    if(responseObject.data==0){
                        alertPopup("Tentative Evaluation Date did not changed or assigned.", 'error');
                    }else{
                        alertPopup(responseObject.message, 'alert');
                    }
                    getScoreDetails('reset');
                } else {
                    alertPopup(responseObject.message, 'alert');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

    } else {
        alertPopup('Please select User', 'error');
    }
}

function initiateSingleDateAllocation(uid,cid) {
    $("#singleDateAllocationMessageDiv").html("");
    if($('#evaluator_name').val()==''){
        alertPopup('Please select Evaluator','error');
        return;
    }
    
    if($('#status').val()==''){
        alertPopup('Please select Status','error');
        return;
    }
    if($('#status').val()!=0){
        alertPopup('Please select Status Value "Pending"','error');
        return;
    }
    if($('#video_meeting_schedule').val() == '' || $('#video_meeting_schedule').val() == 1){
        alertPopup('Please select Video Meeting Status Value "No"','error');
        return;
    }
    if(uid==''){
        alertPopup('Please select Applicants','error');
        return;
    }
    $("#singleAllocationDateUpdate").removeAttr('onclick');
    $("#singleAllocationDateUpdate").attr('onclick', 'javascript:singleUpdateAllocationDate("'+uid+'","'+cid+'");');
    $('#singleDateAllocationModal').modal('show');
}

function singleUpdateAllocationDate(uid,cid) {
    if ($("#singleupdateAllocationDate").val() == '') {
        $("#singleDateAllocationMessageDiv").html("<div class='alert-danger'>Please select date</div>");
        return;
    }
    $("#singleDateAllocationMessageDiv").html("");
    singleAllocationDate(uid,cid);
}

function singleAllocationDate(uid,cid) {
   
    var data = {'userId': uid, 'collegeId': $("#college_id").val(), 'updateAllocationDate': $("#singleupdateAllocationDate").val(), 'scoring_panel': $("#scoring_panel").val(), 'evaluator_name': $("#evaluator_name").val(), 'status': $("#status").val()};
    
    if (uid.length > 0) {
        $.ajax({
            url: jsVars.singleupdateAllocationDateLink,
            type: 'post',
            data: data,
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('#singleDateAllocationModal').modal('hide');
                showLoader();
            },
            complete: function () {
                $('#singleDateAllocationModal').modal('hide');
                hideLoader();
            },
            success: function (response) {
                var responseObject = $.parseJSON(response);
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }
                if (responseObject.status == 1) {
                    if(responseObject.data==0){
                        alertPopup("Tentative Evaluation Date did not changed or assigned.", 'error');
                    }else{
                        alertPopup(responseObject.message, 'alert');
                    }
                    getScoreDetails('reset');
                } else {
                    alertPopup(responseObject.message, 'alert');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

    } else {
        alertPopup('Please select User', 'error');
    }
}

function alertPopup(msg, type, location) {
    var selector_parent, selector_titleID, selector_msg, title_msg, btn;
    if (type == 'error') {
        selector_parent = '#ErrorPopupArea';
        selector_titleID = '#ErroralertTitle';
        selector_msg = '#ErrorMsgBody';
        btn = '#ErrorOkBtn';
        title_msg = 'Error';
    } else {
        selector_parent = '#SuccessPopupArea';
        selector_titleID = '#alertTitle';
        selector_msg = '#MsgBody';
        btn = '#OkBtn';
        title_msg = 'Success';
    }

    $(selector_titleID).html(title_msg);
    $(selector_msg).html(msg);
    $('.oktick').hide();

    if (typeof location != 'undefined') {
        $(btn).show();

        $(selector_parent).modal({keyboard: false}).one('click', btn, function (e) {
            e.preventDefault();
            window.location.href = location;
        });
    } else {
        $(selector_parent).modal();
    }
}

function getEvaluators(collegeId) {
    var assignedTo  = '<select name="assignedTo" id="assignedTo" class="sumo-select" tabindex="-1" ><option value="">Select Evaluator</option></select>';
    $('#assignedToListDiv').html(assignedTo);
    
    var unassignFrom  = '<select name="unassignedFrom[]" multiple="multiple" id="unassignedFrom" class="sumo-select" tabindex="-1" data-placeholder="Unassign From"></select>';
    $('#unassignFromDiv').html(unassignFrom);
    $("#unassignFromRow label span[class='requiredStar']").html('*');
    
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    $('.sumo-select').SumoSelect({placeholder: 'Select Evaluator', search: true, searchText:'Select Evaluator'});
    
    $("#leadReassignMessageDiv").html('');
    
    $.ajax({
        url: jsVars.getEvaluatorListLink,
        type: 'post',
        data: {'collegeId':collegeId, 'panel_id' : $("#scoring_panel").val(), 'evaluator_name' : $("#evaluator_name").val(), 'status' : $("#status").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        async: false,
        beforeSend: function () { 
            showLoader();
            currentCollegeId        = '';
        },
        complete: function () {
            hideLoader();
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.sumo-select').SumoSelect({placeholder: 'Select Evaluator', search: true, searchText:'Select Evaluator'}); 
        },
        success: function (response) {
            var responseObject = $.parseJSON(response); 
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    
                    currentCollegeId        = collegeId;
                    if(typeof responseObject.data.counsellors === "object"){
                        var counsellors  = '<select name="assignedTo" id="assignedTo" class="sumo-select" tabindex="-1" ><option value="">Select Evaluator</option>';
                        $.each(responseObject.data.counsellors, function (index, item) {
                            if(currentCounsellorId!=""){
                                if(currentCounsellorId==index){
                                    responseObject.data.currentCounsellor   = {};
                                    responseObject.data.currentCounsellor[index]   = item;
                                }else{
                                    if($('#video_meeting_schedule').val() != '' && $('#video_meeting_schedule').val() == 0){
                                        counsellors += '<option value="'+index+'">'+item+'</option>';
                                    }
                                }
                            }else{
                                if($('#video_meeting_schedule').val() != '' && $('#video_meeting_schedule').val() == 0){
                                    counsellors += '<option value="'+index+'">'+item+'</option>';
                                }
                            }
                        });
                        counsellors += '<option value="unassign">Unassigned</option>';
                        counsellors += '</select>';
                        $('#assignedToListDiv').html(counsellors);
                    }
                    if(typeof responseObject.data.currentCounsellor === "object"){
                        var unassignFrom  = '<select name="unassignedFrom" id="unassignedFrom" class="sumo-select" tabindex="-1" data-placeholder="Unassign From">';
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
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function reassignLead(url) {
    var IsExists = false;
    $('#unassignedFrom option').each(function () {
        if (this.value != '')
            IsExists = true;
    });
    if (($("#unassignedFrom").val() == '' || $("#unassignedFrom").val() == null)) {
        $("#leadReassignMessageDiv").html("<div class='alert-danger'>Please select a evaluator in 'From'</div>");
        return;
    } else if (($("#unassignedFrom").val() == '' || $("#unassignedFrom").val() == null) && 
            (IsExists === true)) {
        $("#leadReassignMessageDiv").html("<div class='alert-danger'>Please select a evaluator in 'From'</div>");
        return;
    }
    if ($("#assignedTo").val() == '') {
        $("#leadReassignMessageDiv").html("<div class='alert-danger'>Please select a evaluator in 'To'</div>");
        return;
    }

    $("#leadReassignMessageDiv").html("");
    proceedToReassign(url);
}

function proceedToReassign(urls) {
    var users = [];
    $('input:checkbox[name="selected_users[]"]').each(function () {
        if (this.checked) {
            users.push(parseInt($(this).val()));
        }
    });
    if ($('#select_all:checked').val() == 'select_all') {
        var search = $("application-no").val();
        if(search === null || search === 'undefined' || search === ''){
            users: 'all';
        }
        var data = {'userId': users, 'collegeId': $("#college_id").val(), 'assignedTo': $("#assignedTo").val(), 'unassignedFrom': $("#unassignedFrom").val(), 'scoring_panel': $("#scoring_panel").val(), 'evaluator_name': $("#evaluator_name").val(), 'status': $("#status").val(), 'filters': $("#leadsListFilters").val(), 'search_filter': $("#application-no").val()};
    } else {
        var data = {'userId': users, 'collegeId': $("#college_id").val(), 'assignedTo': $("#assignedTo").val(), 'unassignedFrom': $("#unassignedFrom").val(), 'scoring_panel': $("#scoring_panel").val(), 'evaluator_name': $("#evaluator_name").val(), 'status': $("#status").val()};
    }
    if (users.length > 0 || $('#select_all:checked').val() == 'select_all') {
        $.ajax({
            url: urls,
            type: 'post',
            data: data,
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                //$('#evaluatorReassignModal').modal('hide');
                showLoader();
            },
            complete: function () {
                //$('#evaluatorReassignModal').modal('hide');
                hideLoader();
            },
            success: function (response) {
                var responseObject = $.parseJSON(response);
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }
                if (responseObject.status == 1) {
                    if(responseObject.data==0){
                        alertPopup("Application did not assigned.", 'error');
                    }else if(responseObject.data=='error'){
			$("#leadReassignMessageDiv").html(responseObject.message);
			return;
		    }else{
                        alertPopup(responseObject.message, 'alert');
                    }
		    $('#evaluatorReassignModal').modal('hide');
                    getScoreDetails('reset');
                } else {
                    alertPopup(responseObject.message, 'alert');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

    } else {
        alertPopup('Please select User', 'error');
    }
}

function markAbsent(aesId, collegeId) {
    $('#ConfirmAlertYesBtn').unbind();
    $('#ConfirmAlertNoBtn').unbind();
    $('#ConfirmAlertPopUpTextArea').html("Do you want to mark absent?");
    $('#ConfirmAlertPopUpSection .modal-title').html("Mark Absent");
    $("#ConfirmAlertPopUpSection").modal("show");
    $("#ConfirmAlertYesBtn").on("click", function () {
        processMarkAbsent(aesId, collegeId);
    });
}
        
        
function processMarkPending(aesId, collegeId) {
    $.ajax({
        url: jsVars.FULL_URL+'/settings/marksPending',
        type: 'post',
        data: {'aesId': aesId, 'college_id': collegeId},
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
        success: function (response) {
            if (response.message === 'session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (response.status == 1) {
                getScoreDetails('reset');
            } else {
                alertPopup(response.message, 'alert');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function markPending(aesId, collegeId) {
    $('#ConfirmAlertYesBtn').unbind();
    $('#ConfirmAlertNoBtn').unbind();
    $('#ConfirmAlertPopUpTextArea').html("Do you want to Mark status as Pending?");
    $('#ConfirmAlertPopUpSection .modal-title').html("Confirmation");
    $("#ConfirmAlertPopUpSection").modal("show");
    $("#ConfirmAlertYesBtn").on("click", function () {
        processMarkPending(aesId, collegeId);
    });
}
        
        

function processMarkAbsent(aesId, collegeId) {
    $.ajax({
        url: jsVars.FULL_URL+'/settings/marksAbsent',
        type: 'post',
        data: {'aesId': aesId, 'college_id': collegeId},
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
        success: function (response) {
            if (response.message === 'session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (response.status == 1) {
                getScoreDetails('reset');
            } else {
                alertPopup(response.message, 'alert');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/**
 * Drow chart bar chart
 * @param {type} title
 * @param {type} chart_div
 * @param {type} arr_chart_data
 * @returns {undefined}
 */
function drawCounsellorWiseBarChart(title, chart_div, arr_chart_data) {
    var data = new google.visualization.arrayToDataTable(arr_chart_data);
    // find max for all columns to set top vAxis number
    var maxVaxis = 0;
    for (var i = 1; i < data.getNumberOfColumns(); i++) {
        if (data.getColumnType(i) === 'number') {
            maxVaxis = Math.max(maxVaxis, data.getColumnRange(i).max);
        }
    }
    var length = (arr_chart_data.length - 1);
    if (length > 5) {
        var grpWidth = "90%";
    } else if (length >= 3) {
        var grpWidth = "60%";
    } else {
        var grpWidth = "35%";
    }
    var options = {
        title: title,
        legend: {position: 'top', maxLines: 3, alignment: 'center'},
        bars: 'vertical',
        vAxis: {format: 'decimal', maxValue: maxVaxis + maxVaxis / 6, },
        height: 380,
        bar: {groupWidth: grpWidth},
        width: '100%',
        chartArea: {left: '5%', top: '10%', width: '90%', height: '80%'},
        colors: ['#00b0f0', '#ffc000', '#92d050', '#ff3399'],
        annotations: {alwaysOutside: true, textStyle: {color: '#000', fontSize: 12}},
        series: {
            0: {annotations: {stem: {length: 20}}},
            1: {annotations: {stem: {length: 2}}},
            2: {annotations: {stem: {length: 20}}},
            3: {annotations: {stem: {length: 2}}}
        },
        hAxis: {
            textStyle: {
                fontSize: 13 // or the number you want
            }
        }
    };
    var chart = new google.visualization.ColumnChart(document.getElementById(chart_div));
    google.visualization.events.addListener(chart, 'ready', AddNamespaceHandler);
    chart.draw(data, options);
}

function AddNamespaceHandler(id) {
    var svg = jQuery('svg');
    svg.attr("xmlns", "http://www.w3.org/2000/svg");
    svg.css('overflow', 'visible');
}

function downloadScorecard() {
    var $form = $("#FilterApplicationNumber");
    $form.append($("<input>").attr({"value":"evaluator_wise_export", "name":"export",'type':"hidden","id":"export"}));
    $.ajax({
        url: jsVars.FULL_URL+'/settings/ajaxEvaluatorDetails',
        type: 'post',
        data: $form.serialize(),
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            //$('#evaluatorReassignModal').modal('hide');
            showLoader();
        },
        complete: function () {
            //$('#evaluatorReassignModal').modal('hide');
            hideLoader();
        },
        success: function (response) {
            if (response === 'success') {
                $form.find('input[name="export"]').val("");
                $('#muliUtilityPopup').modal('show');
                $('#muliUtilityPopup .close').addClass('npf-close').css('margin-top', '2px');
            } else {
                alertPopup(response, 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


$(document).on('click', '#FilterApplicationNumber .btnOk', function(){
    getUserGraphData();
});

function showHideVideoLink(){
    var unix = Math.round(new Date()/1000);
    if($('.zoom-call').length > 0){
        $('.zoom-call').each(function(){
            meeting_id = $(this).data('meeting-id');
            start_time = $(this).data('start-time');
            end_time = $(this).data('end-time');
            if(unix >= start_time && unix <=end_time){
                $(this).show();
            } else {
               $(this).hide(); 
            }
        });
    }
}

setInterval(function(){
    showHideVideoLink();
},60000);

$('html').on('click','.zoom-call',function(){
    var unix = Math.round(new Date()/1000);
    meeting_id = $(this).data('meeting-id');
    meeting_account = $(this).data('meeting-account');
    start_time = $(this).data('start-time');
    end_time = $(this).data('end-time');
    if(unix >= start_time && unix <=end_time){
        getMeetingLink(meeting_id,meeting_account);
    } else {
        showHideVideoLink();
    }
});

function getMeetingLink(meeting_id,meeting_account){
    $.ajax({
        url: jsVars.getMeetingLink,
        type: 'post',
        dataType: 'json',
        data: {'meeting_id' : meeting_id,'meeting_account':meeting_account},
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            console.log(data);
            if (typeof data['session'] != 'undefined') {
                window.location.reload(true);
            }else if (typeof data['status'] !='undefined' && data['status'] == 0) {
                 alertPopup(data['message'],'error');
            }else if(typeof data['status'] !='undefined' && data['status'] == 1)  {                
                zoom_link = data['join_url']
                window.open(zoom_link,"_blank");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
        }
    });
}
//Enter key
$('#searchFields').bind('keypress', function(e) {
    if (e.which === 13) {
       $("#search_button").click();
    }
});
