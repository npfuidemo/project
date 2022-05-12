$(document).ready(function(){
    if($('.daterangepicker_report').length > 0){
        LoadReportDateRangepicker('left', 'down');
    }
    
    if($('select#transactional_msg_category').length > 0) {
        $('select#transactional_msg_category').SumoSelect({placeholder: 'Job Type', search: true, searchText:'Job Type', captionFormatAllSelected: "All Selected.",selectAll : true,triggerChangeCombined: false});
    }
    
    if($('select#CommunicationStatus').length > 0) {
        $('select#CommunicationStatus').SumoSelect({placeholder: 'Communication Status', search: true, searchText:'Communication Status', captionFormatAllSelected: "All Selected.",selectAll : true,triggerChangeCombined: false});
    }
    if($('select#webhookStatus').length > 0) {
        $('select#webhookStatus').SumoSelect({placeholder: 'Webhook Status', search: true, searchText:'Webhook Status', captionFormatAllSelected: "All Selected.",selectAll : true,triggerChangeCombined: false});
    }
    
    $('.filter_collapse').dropdown('toggle');
    $('.panel-group').on('hidden.bs.collapse', toggleIcon);
    $('.panel-group').on('shown.bs.collapse', toggleIcon);
     selected_college_id = $.trim($("#s_college_id").val());
    if($("#transactional_msg_category").length >0 && typeof selected_college_id != 'undefined' && selected_college_id != ''){
        GetTransactionalCategory(selected_college_id);
    }
    if($("#communication_medium").length >0 && typeof selected_college_id != 'undefined' && selected_college_id != ''){
        var CommunicationStatus = $("#CommunicationStatus").val();
        getStatusList(CommunicationStatus);
        emptyTableList();
    }
    
    $(document).on('change', '#communication_type', function () {
        $('#channel').val("");
        $('.chosen-select').trigger('chosen:updated');
        var collegeg_id = $("#s_college_id").val();
            if(typeof collegeg_id != 'undefined' && collegeg_id != ''){
                console.log(typeof this.value);
                if(typeof this.value != 'undefined' && this.value=='automation'){
                $(".automationListSegment").show();
                getAutomationListUrl(collegeg_id,'');
            }else{
                $(".automationListSegment").hide();
                return false;
            }
        }
        
        return false;
    });

    $('#communication_medium').change(function(){
        getStatusList();
        emptyTableList();
    });
    
    $(document).on('change', '#channel', function () {
        $('#communication_type').val("");
        $('.chosen-select').trigger('chosen:updated');
        return false;
    });

   downloadRequestPopupMessage('communications',$('#s_college_id').val());
   checkCollegeConfigRegistration($('#s_college_id').val());
}); 
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
        data: {'college_id': college_id,'downloadtype':'communications'},
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
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

function exportWeeklyPlanCsv(){
    var $form = $("#FilterWeeklyPlanList");
    $form.attr("action",jsVars.exportWeeklyPlanCsvLink);
    $form.attr("target",'modalIframe');
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    $('#myModal').modal('show');
    $form.submit();
    $form.attr("onsubmit",onsubmit_attr);
    $form.removeAttr("target");
}

function exportTransactionReportCsv(){
    var $form = $("#CommunicationTransactionForm");
    $form.attr("action",jsVars.exportTransactionReportCsvLink);
    $form.attr("target",'modalIframe');
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    $('#myModal').modal('show');
    $form.submit();
    $form.attr("onsubmit",onsubmit_attr);
    $form.removeAttr("target");
}

var downloadDetailReportFile = function(url){
    window.open(url, "_self");
};

function getCommunicationExpense(){
    $("#divShowExpenses").show();
    var sval=$("#communication_medium :selected").val();
    if(sval=="" || sval=="undefined"){
        alertPopup("Please select medium of communication.","error");
        return false;
    }
    getCommunicationCountData();
}


function getCommunicationCountData(){
   
    var data = $('#CommunicationReportForm, #CommunicationReportForm1').serializeArray();
    $.ajax({
        url: '/communications/get-communication-count-data',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {                    
            $('#listloader').show();
            $('#communicationCountData').prop("disabled",true);
        },
        complete: function() {
            $('#listloader').hide();
            $('#communicationCountData').prop("disabled",false);
        },
        success: function (data) {
            if (data === "session_logout") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (data === 'inavlid_request'){
                alertPopup("Inavlid request.","error");
            } else {
                $("#divShowExpenses").html(data);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function LoadMoreCommunicationreports(listingType) {
    //make buttun disable
    var data = [];
    if (listingType === 'reset') {
        varPage = 0;
        $('#communication_report_container').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
        $('.modalButton').hide();
    }
    data = $('#CommunicationReportForm, #CommunicationReportForm1').serializeArray();
    data.push({name: "page", value: varPage});
    data.push({name: "type", value: listingType});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-spin fa-refresh" aria-hidden="true"></i>&nbsp;Loading...');
    $('div.loader-block').show();
    $.ajax({
        url: jsVars.FULL_URL + '/communications/ajax-communication-reports',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function (xhr) {
            $('.loader-block').show();
            $('#search_btn_hit').prop("disabled",true);
            $('#divShowExpenses').html("");
			$('.daterangepicker_report').prop('disabled', true);
        },
        success: function (data) {
            varPage = varPage + 1;
            var checkError  = data.substring(0, 6);
            if (data === "session_logout") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(data.substring(6, data.length));
                $('#load_more_button').hide();
            } else {
                data = data.replace("<head/>", '');
                var countRecord = countResult(data);
                if(countRecord == 0){
                   $('.modalButton').hide();
                }else{
                    $('.modalButton').show();
                }
                if (listingType === 'reset') {
                    $('#communication_report_container').html(data);
                } else {
                    $('#communication_report_container').find("tbody").append(data);
                }
                if(countRecord == 0 && varPage == 1){
                    $("#if_record_exists").hide();
                }else{
                    $("#if_record_exists").show();
                }
                i
                if (countRecord < 10) {
                    $('#load_more_button').hide();
                } else {
                    $('#load_more_button').show();
                }
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Reports');
            }
		$('.offCanvasModal').modal('hide');
		dropdownMenuPlacement();
        },
        complete: function () {
            $('.loader-block').hide();
            $('#search_btn_hit').prop("disabled",false);
            var communicationSelVal=$("#communication_medium :selected").val();
            if(communicationSelVal=="sms"){
               communicationSelVal="SMS"; 
            }
            $('#communicationStatName').html(communicationSelVal+" ");
            if ((communicationSelVal == 'notification') && ($('#communicationCountData').length > 0)) {
                $('#communicationCountData').hide();
            }
		$('.daterangepicker_report').prop('disabled', false);
                $('[data-toggle="tooltip"]').tooltip();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function countResult(html) {
    var len = (html.match(/listDataRow/g) || []).length;
    return len;
}

$(document).on('click',".sumo_graph_agent_id .btnOk",function(){
    loadAgentGraph();
});

//change +/- icon for accordion
function toggleIcon(e)
{
    $(e.target)
    .prev('.panel-heading')
    .find(".more-less")
    .toggleClass('glyphicon-plus glyphicon-minus');
}

function emptyTableList(){
    $('#communication_report_container').html("");
    $('#load_more_button').hide();
    //$("#if_record_exists").hide();
    $("#divShowExpenses").hide();
}

function GetTransactionalCategory(college_id){
    if(college_id === undefined){
        college_id = $.trim($("#s_college_id").val());
    }
     if (college_id) {
        $('#categoryList').html('');
        var medium = $.trim($("#communication_medium").val());
        $.ajax({
            url: jsVars.GetTransactionalCategoryLink,
            type: 'post',
            data: {CollegeId: college_id,medium:medium},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json)
            {
                if (json['redirect'])
                    location = json['redirect'];
                else if (json['error'])
                    alertPopup(json['error'], 'error');
                else if (json['status'] == 200) {
                    var html = "";
                        html += json["userList"];
                    $('#transactional_msg_category').html(html);
                    $('#categoryList').val(json["categoryList"]);
                }else{
                    $('#transactional_msg_category').html('');
                }
                $('#transactional_msg_category')[0].sumo.reload();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        
    } else {
        $('#transactional_msg_category').html('');
        $('#transactional_msg_category')[0].sumo.reload();
    }
}

function changeChannel(channel){
    if(channel == 'promotional'){
        $('#transactional_msg_category')[0].sumo.unSelectAll();
        $('#transactional_msg_category')[0].sumo.disable();
    }else{
        $("#transactional_msg_category").removeAttr('disabled');
        $('#transactional_msg_category')[0].sumo.enable();
    }
//    $('#transactional_msg_category')[0].sumo.reload();
}

function showRegion(type){
    if(type == 'sms'){
        $("#sms_region").val('');
        $("#sms_region_div").show();
    }else{
        $("#sms_region").val('');
        $("#sms_region_div").hide();
    }
    $('.chosen-select').trigger('chosen:updated');
//    $('#transactional_msg_category')[0].sumo.reload();
}

function resetCommunicationReport(){
    $('#transactional_msg_category')[0].sumo.unSelectAll();
    $('#job_id').val('');
    $('#s_college_id').val('');
    $('#communication_medium').val('');
    $('#channel').val('');
    $('.chosen-select').trigger('chosen:updated');
    $('#created_on').val('');
    $('#divShowExpenses').html('');
    LoadMoreCommunicationreports('reset');
}

function resetCommunicationTransactionReport(){
    $('#s_college_id').val('');
    $('#communication_medium').val('');
    $('#credit_type').val('');
    $('.chosen-select').trigger('chosen:updated');
    $('#created_on').val('');
    LoadMoreCommunicationTransactionreports('reset');
}

function LoadMoreCommunicationTransactionreports(listingType) {
    //make buttun disable
    var data = [];
    if($("#s_college_id").val() === ''){
        /*var finalHtml = '<table id="load_more_results" class="table table-striped border-collapse-unset bothCellFixed">\
				<tr>\
				<td>\
					<div class="col-md-12">\
						<h4 class="text-center text-danger">Please select an Institute Name and click Search to view reports sdfgh.</h4>\
					</div>\
				</td>\
			<tr>\
		</table>';*/
        $('#transaction_report_container').html('');
		$('#load_msg_div').show();
        $("#transaction_report_container, #if_record_exists, #load_more_button").hide();
        return false;
    }
    if (listingType === 'reset') {
        varPage = 0;
        $('#transaction_report_container').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
    }
    data = $('#CommunicationTransactionForm').serializeArray();
    data.push({name: "page", value: varPage});
    data.push({name: "type", value: listingType});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $.ajax({
        url: jsVars.FULL_URL + '/communications/ajax-communication-transaction-reports',
        type: 'post',
        dataType: 'html',
        data: data,
		async: true,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
		beforeSend: function () { 
            $('#communicationReportLoader').show();
			$('.daterangepicker_report').prop('disabled', true);
        },
        complete: function () {
            $('#communicationReportLoader').hide();
			$('.daterangepicker_report').prop('disabled', false);
        },
        success: function (data){
            varPage = varPage + 1;
            var checkError  = data.substring(0, 6);
            if (data === "session_logout") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(data.substring(6, data.length));
                $('#load_more_button').hide();
            } else {
                    $('#load_msg_div').hide();
                    $('#transaction_report_container, #table-data-view, .download-after-data, #if_record_exists, #load_more_button').show();
                data = data.replace("<head/>", '');
                var countRecord = countResult(data);
                if (listingType === 'reset') {
                    $('#transaction_report_container').html(data);
                } else {
                    $('#transaction_report_container').find("tbody").append(data);
                }
                /*if(countRecord == 0 && varPage == 1){
                    $("#if_record_exists").hide();
                }else{
                    $("#if_record_exists").show();
                }*/
                if (countRecord < 10) {
                    $('#load_more_button').hide();
                } else {
                    $('#load_more_button').show();
                }
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html("Load More ");
            }
			$('.offCanvasModal').modal('hide');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
function LoadMoreCommunicationRemovedUserReports(listingType,getTotalCount) {
    //make buttun disable
    
    var data = [];
    if (listingType === 'reset') {
        varPage = 0;
        $('#communication_report_container').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
    }
    
    data = $('#CommunicationReportForm, #CommunicationReportForm1').serializeArray();
    data.push({name: "page", value: varPage});
    data.push({name: "type", value: listingType});
    data.push({name: "getTotalCount", value: getTotalCount});

    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $('div.loader-block').show();
    
    $.ajax({
        url: jsVars.FULL_URL + '/communications/ajax-communication-removed-user',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        complete: function () {
            $('div.loader-block').hide();
        },
        async: false,
        success: function (data) {

            varPage = varPage + 1;
            var checkError  = data.substring(0, 6);
            if (data === "session_logout") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(data.substring(6, data.length));
                $('#load_more_button').hide();
            } else {
                data = data.replace("<head/>", '');
                var countRecord = countResult(data);
                if (listingType === 'reset') {
                    $('#communication_report_container').html(data);
                } else {
                    $('#communication_report_container').find("tbody").append(data);
                }
                if(countRecord == 0 && varPage == 1){
                    $("#if_record_exists").hide();
                }else{
                    $("#if_record_exists").show();
                }
                if (countRecord < 10) {
                    $('#load_more_button').hide();
                } else {
                    $('#load_more_button').show();
                }
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html("Load More ");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getAutomationListUrl(college_id,selected) {
    if(typeof selected =='undefined'){
        selected = '';
    }
    $("#automationList").html('<option value="">Automation Name</option>');
    $('.chosen-select').trigger('chosen:updated');
    $.ajax({
        url: jsVars.getAutomationListUrl,
        type: 'post',
        dataType: 'json',
        data: {'college_id':college_id,'bypass':'search'},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        complete: function () {
            $('div.loader-block').hide();
        },
//        async: false,
        success: function (jsonD) {
            if(jsonD.success == 200){
                list='';
                list +='<option value="">Automation Name</option>';
                $.each( jsonD.listAutomation, function( key, value ) {
                  list +='<option value="'+key+'">'+value+'</option>';
                });
              $("#automationList").html(list);
              $("#automationList").val(selected);
              $('.chosen-select').trigger('chosen:updated');
            }
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function resetAutomationRemovedReport(){
    $('#job_id').val('');
    $('#s_college_id').val('');
    $('#communication_medium').val('');
    $('#channel').val('');
    $('#created_on').val('');
    $('#automationList').val('');
    $("#automationList").html('<option value="">Automation Name</option>');
    $('.chosen-select').trigger('chosen:updated');
}


function getLeadStages(collegeId){
    $("#stage_id").html('<option value="">Select Stage</option>');
    $('.chosen-select').trigger('chosen:updated');
   
    $.ajax({
        url: jsVars.getLeadStagesLink,
        type: 'post',
        data: {'userId' : 'bulk', 'collegeId':collegeId, moduleName:'lead'},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: false,
        beforeSend: function () { 
            showLoader();
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
                    stageList               = responseObject.data.stageIds;
                    if(typeof responseObject.data.stageList === "object" && typeof stageList === "object"){
                        var leadStages  = '<option value="">Select Stage</option>';
                        $.each(stageList, function (index, item) {
                            if(currentStage==item){
                                leadStages += '<option value="'+item+'" selected="selected">'+responseObject.data.stageList[item]+'</option>';
                            }else{
                                leadStages += '<option value="'+item+'">'+responseObject.data.stageList[item]+'</option>';
                            }
                        });
                        $('#stage_id').html(leadStages);
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

function LoadMoreLeadStageReports(type) {
    $(".lead_error").html('');
    if (type === 'reset') {
        StagePage  = 0;
        $('#static_token_container').html("");
        $("#static_token_container").parent().hide();
        $('.modalButton').hide();
    }
    
    $('#load_more_button').hide();
    if($("#college_id").val()===''){
        $("#load_msg_div").show();
        hideLoader();
        return;
    }
    var data = $('#CommunicationReportForm input, #CommunicationReportForm select').serializeArray();
    
    data.push({name: "s_college_id", value: $("#s_college_id").val()});
    data.push({name: "form_id", value: $("#form_id").val()});
    data.push({name: "stage_id", value: $("#stage_id").val()});
    data.push({name: "created_on", value: $("#created_on").val()});
    data.push({name: "stage_type", value: $("#stage_type").val()});
    data.push({name: "page", value: StagePage});
    data.push({name: "type", value: type});
    $.ajax({
        url: '/communications/ajax-lead-stage-reports',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function () {
           $('#parent').css('min-height', '50px');
           showLoader();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (response) {
            StagePage+=1;
	    var responseObject = $.parseJSON(response); 
	    if (responseObject.message === 'session'){
		window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
	    }else if(responseObject.message ==="no_record_found"){    
                if(StagePage===1){
                    $('#load_msg').html('No Report Found');
                    $('#load_msg_div').show();
					$('#load_more_results').parent().addClass('hide');
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Report");
                    $('#load_more_button').hide();
					if ($(window).width() < 992) {
						//filterClose();
					}
                }else {
                    $('#load_msg').html('');
                    $('#load_msg_div').hide();
                    $('#load_more_button').html("<i class='fa fa-database' aria-hidden='true'></i>&nbsp;No More Report");
                    $('#load_more_button').show();
                }
                if (type !== '' && StagePage===1) {
                    $('#if_record_exists').hide();
                    $('#single_lead_add').hide();
                }
	    }else if(responseObject.status===1){
                if (type === 'reset') {
                    $('#load_more_results').html("");
                }
                data = responseObject.data.html.replace("<head/>", '');
                $('#load_more_results').parent().removeClass('hide');
                $('#load_more_results').append(data);
                $('#load_msg_div').hide();
				$('#parent').show();
                $('.itemsCount').show();
				$('body').css('padding-right', '0px');
				//filterClose();	
                if(typeof responseObject.data.totalRecords!=="undefined"){
                    $("#totalRecords").html('Total <strong>'+responseObject.data.totalRecords+'</strong>&nbsp;Records');
                }
                 
		var ttl = $("#current_record").val();
                if(parseInt(ttl) < 10){
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Report");
                    $('#load_more_button').hide();
                }else{
                    $('#load_more_button').removeAttr("disabled");
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Report");
		    $('#load_more_button').show();
                }
                if (type !== '') {
                    $('#if_record_exists').fadeIn();
                }
                
	    }else{
		$('#parent').hide();
                $('#load_msg_div').show();
                $('#load_msg').html(responseObject.message);
                $('#load_more_results').html("");
                $('#load_more_button').hide();
                $('#load_more_results').parent().addClass('hide');
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Report");
                 if (type !== '') {
                        $('#if_record_exists').hide();
                 }
                 dropdownMenuPlacement();
		//filterClose();
	    }
            $('.offCanvasModal').modal('hide');
			dropdownMenuPlacement();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //window.location.reload(true);
        },
        complete: function () {
            hideLoader();
        }
    });

    return false;
}
   
function resetLeadStageFilter(){
    $('#job_id').val('');
    $('#s_college_id').val('');
    $('#form_id').val('');
    $('#stage_id').val('');
    $('#automationList').val('');
    $('.chosen-select').trigger('chosen:updated');
    $('#created_on').val('');
    LoadMoreLeadStageReports('reset');
}


function getStatusList(CommunicationStatus=''){
    var sval=$("#communication_medium :selected").val();
    $.ajax({
        url: '/communications/ajax-get-communication-status',
        data: {comm_medium: sval},
        dataType: "json",
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        success: function (json) {
            if(typeof json['error'] !=='undefined' && json['error'] === 'session') {
                window.location.reload(true);
            }
            else if(json['error']) {
                alertPopup(json['error'],'error');
            }
            else if(json['status'] === 200) {
                var listHtml = '';
                if(json['listCommStatus']) {
                    for(var listId in json['listCommStatus']) {
                        listHtml += '<option value="'+ listId +'">'+ json['listCommStatus'][listId] +'</option>';
                    }
                }
                $('#CommunicationStatus').html(listHtml);
                $('#CommunicationStatus').val(CommunicationStatus);
                $('#CommunicationStatus')[0].sumo.reload();
            }
        },
        error: function (response) {
            alertPopup(response.responseText);
        },
        failure: function (response) {
            alertPopup(response.responseText);
        }
    });
}


function resetAutomationAllocateLeadFilter(){
    $('#job_id').val('');
    $('#s_college_id').val('');
    $('#automationList').val('');
    $('.chosen-select').trigger('chosen:updated');
    $('#created_on').val('');
    LoadMoreAutomationAllocateLeadReports('reset');
}

function resetWhatsappMessageReports(){
    $('#job_id').val('');
    $('#s_college_id').val('');
    $('#automationList').val('');
    $('.chosen-select').trigger('chosen:updated');
    $('#created_on').val('');
    loadMoreWhatsappMessageReports('reset');
}


function LoadMoreAutomationAllocateLeadReports(listingType) {
    //make buttun disable
    var data = [];
    if (listingType === 'reset') {
        varPage = 0;
        $('#communication_report_container').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
        $('.modalButton').hide();
    }
    data = $('#CommunicationReportForm, #CommunicationReportForm1').serializeArray();
    data.push({name: "page", value: varPage});
    data.push({name: "type", value: listingType});

    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;Loading...');
    $('div.loader-block').show();
    
    $.ajax({
//        url: jsVars.FULL_URL + '/communications/ajax-communication-reports',
        url: jsVars.FULL_URL + '/communications/ajax-automation-allocate-lead-reports',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        complete: function () {
            $('div.loader-block').hide();
        },
        async: false,
        success: function (data) {
            varPage = varPage + 1;
            var checkError  = data.substring(0, 6);
            if (data === "session_logout") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if (checkError === 'ERROR:'){
                alert(data.substring(6, data.length));
                $('#load_more_button').hide();
            }
            else {
                data = data.replace("<head/>", '');
                var countRecord = countResult(data);
                if (listingType === 'reset') {
                    $('#communication_report_container').html(data);
                } else {
                    $('#communication_report_container').find("tbody").append(data);
                }
                if(countRecord == 0 && varPage == 1){
                    $("#if_record_exists").hide();
                }else{
                    $("#if_record_exists").show();
                }
                if (countRecord < 10) {
                    $('#load_more_button').hide();
                } else {
                    $('#load_more_button').show();
                }
				$('.offCanvasModal').modal('hide');
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More');                
            }
            dropdownMenuPlacement();            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function LoadFormsInReports(collegeId) {
    $.ajax({
        url: '/voucher/get-forms',
        type: 'post',
        dataType: 'html',
//        async: false,
        data: {
            "college_id": collegeId,
            "default_val": '',
            "multiselect":''
        },
//        beforeSend: function () {  showFilterLoader(); },
//        complete: function () { hideFilterLoader(); },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        //async:false,
        success: function (data) {
            if(data=="session_logout"){
                window.location.reload(true);
            }
            $('#formId').html(data);
            $('.chosen-select').trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function loadMoreWhatsappMessageReports(listingType) {
    //make buttun disable
    var data = [];
    if (listingType === 'reset') {
        varPage = 0;
        $('#communication_report_container').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
    }
    data = $('#CommunicationReportForm, #CommunicationReportForm1').serializeArray();
    data.push({name: "page", value: varPage});
    data.push({name: "type", value: listingType});

    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;Loading...');
    $('div.loader-block').show();

    $.ajax({
//        url: jsVars.FULL_URL + '/communications/ajax-communication-reports',
        url: jsVars.FULL_URL + '/communications/ajax-automation-whatsapp-send-report',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        complete: function () {
            $('div.loader-block').hide();
        },
        async: false,
        success: function (data) {
            varPage = varPage + 1;
            var checkError  = data.substring(0, 6);
            if (data === "session_logout") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if (checkError === 'ERROR:'){
                alert(data.substring(6, data.length));
                $('#load_more_button').hide();
            }
            else {
                data = data.replace("<head/>", '');
                var countRecord = countResult(data);
                if (listingType === 'reset') {
                    $('#communication_report_container').html(data);
                } else {
                    $('#communication_report_container').find("tbody").append(data);
                }
                if(countRecord == 0 && varPage == 1){
                    $("#if_record_exists").hide();
                }else{
                    $("#if_record_exists").show();
                }
                if (countRecord < 10) {
                    $('#load_more_button').hide();
                } else {
                    $('#load_more_button').show();
                }
		$('.offCanvasModal').modal('hide');
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

 
//Funcion: Get Applicant Activity TimeLine 
function GetApplicantActivityTimeLine(uniqid){
    var json = $("#"+uniqid).val();
    html = '';
    if(json != 'undefined' && json != ''){
        json  = JSON.parse(json);
    }
    if (json != ''){
        var html = getIframeTemplate(json.template_id,json.user_id,json.applicant,json.mobileOrEmail,json.mongo_id);
        $('#templatePreviewModal .modal-body').addClass('customBodyHeight').css({"height": "calc(100% - 100px)", "padding-bottom": "15px","overflow":"hidden"});
        $('.modal-backdrop+.modal-backdrop').hide();
        $('[data-toggle="tooltip"]').tooltip();
        $('#OkBtn').hide();
        $('.modal-backdrop').addClass('in');
        $('#templatePreviewModal #MsgBody').html(html).css({"margin":"0","height":"100%"});
        if(typeof $('#template_title').val()!='undefined' && $('#template_title').val()!=''){ 
            var title = $('#template_title').val();
        }else{ 
            var title = 'Template Preview'; 
        }
        var version = $('#version').text();
        $('#templatePreviewModal h2#templatePreviewModalLabel').html('<span class="templatename" data-toggle="tooltip" title="'+title+'" data-placement="bottom">'+title+'</span><span class="versionname margin-left-8">(v'+version+')</span>');
        $('[data-toggle="tooltip"]').tooltip();                   
        $('.template-preview-dropdown').addClass('hide');
        setTimeout(function(){
            $('#templatePreviewModal #MsgBody iframe').show();
            $('.iframeloader').css('background-image', 'url("")');
        }, 1000);
    } else{
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
    //getCommunicationPreview(json.template_id,json.user_id,json.applicant,json.mobileOrEmail,json.mongo_id);
}

/**
 * getCommunicationPreview - this function will show the email/sms template in popup on basis of communication log ID
 * @param {type} logId
 * @param {type} template_type
 * @returns {undefined}
 */

function getCommunicationPreview(logId,applicantId,applicant,mobileOrEmail,mongo_id) {
    $.ajax({
        url: jsVars.GetCommunicationPreview,
        data: {communicationId: logId,applicantId: applicantId,from:'communication_detail',mongo_id:mongo_id},
        dataType: "json",
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
        success: function (json) {
            
            if(json['comLog'] != ''){
                var com_type = json['comLog'].type;
                if(com_type.indexOf('sms') !== -1){  
                    var type = 'a sms';
                    $('#ActivityLogPopupArea #alertTitle .title').html('SMS Activity Feed');
                    
                    template_text = "<div class='report-popup-main'>";
                    if(json['comLog'].version){
                        template_text += "<div class='report-popup'><div class='report-popup-left ag-popup-left'>Version</div><div class='report-popup-right ag-popup-right'>"+json['comLog'].version+"</div></div>";
                    }
                    if(json['comLog'].template_title){
                        template_text += "<div class='report-popup'><div class='report-popup-left ag-popup-left'>Template Name</div><div class='report-popup-right ag-popup-right'>"+json['comLog'].template_title+"</div></div>";
                    }
                    if(json['comLog'].channel){
                        template_text += "<div class='report-popup'><div class='report-popup-left ag-popup-left'>Nature of Template</div><div class='report-popup-right ag-popup-right'>"+json['comLog'].channel+"</div></div>";
                    }
                    template_text += json['comLog'].body;
                    template_text += "</div>";
                    
                    var subject_line = ' template ';
                    json['comLog'].subject = "View Template";
                }else if(com_type.indexOf('whatsapp') !== -1){     
                    var type = 'a whatsapp';
                    $('#ActivityLogPopupArea #alertTitle .title').html('Whatsapp Activity Feed');
                    template_text = "<div class='report-popup-main'>";
                    if(json['comLog'].version){
                        template_text += "<div class='report-popup'><div class='report-popup-left ag-popup-left'>Version</div><div class='report-popup-right ag-popup-right'>"+json['comLog'].version+"</div></div>";
                    }
                    if(json['comLog'].template_title){
                        template_text += "<div class='report-popup'><div class='report-popup-left ag-popup-left'>Template Name</div><div class='report-popup-right ag-popup-right'>"+json['comLog'].template_title+"</div></div>";
                    }
                    template_text += json['comLog'].body;
                    template_text += "</div>";
                    var subject_line = ' template ';
                    json['comLog'].subject = "View Template";
                    if(typeof json.comLog.attachment !== "undefined") {
                        $.each(json.comLog.attachment, function(key,value) {
                            template_text +="<br><b class='nowrap'><i class='fa fa-paperclip' aria-hidden='true'></i> Attachment:-</b><a href="+value.file_path+" target='_blank'>"+ value.file_name+"</a>";
                        });
                    }
                }else{          
                    var type = "an email";
                    $('#ActivityLogPopupArea #alertTitle .title').html('Email Activity Feed');
                    var subject_line = ' the subject line ';
                    template_text = "<div class='report-popup-main'>";
                    if(json['comLog'].version){
                        template_text += "<div class='report-popup'><div class='report-popup-left ag-popup-left'>Version</div><div class='report-popup-right ag-popup-right'>"+json['comLog'].version+"</div></div>";
                    }
                    if(json['comLog'].template_title){
                        template_text += "<div class='report-popup'><div class='report-popup-left ag-popup-left'>Template Name</div><div class='report-popup-right ag-popup-right'>"+json['comLog'].template_title+"</div></div>";
                    }
                    if(json['comLog'].sender_name){
                        template_text += "<div class='report-popup'><div class='report-popup-left ag-popup-left'>From Name</div><div class='report-popup-right ag-popup-right'>"+json['comLog'].sender_name+"</div></div>";
                    }
                    if(json['comLog'].from_email){
                        template_text += "<div class='report-popup'><div class='report-popup-left ag-popup-left'>From Email</div><div class='report-popup-right ag-popup-right'>"+json['comLog'].from_email+"</div></div>";
                    }
                    if(json['comLog'].subject){
                        template_text += "<div class='report-popup'><div class='report-popup-left ag-popup-left'>Subject</div><div class='report-popup-right ag-popup-right'>"+json['comLog'].subject+"</div></div>";
                    }
                    if(json['comLog'].channel){
                        template_text += "<div class='report-popup'><div class='report-popup-left ag-popup-left'>Nature of Template</div><div class='report-popup-right ag-popup-right'>"+json['comLog'].channel+"</div></div>";
                    }
                    template_text += json['comLog'].body;
                    if(typeof json.comLog.attachment !== "undefined") {
                        $.each(json.comLog.attachment, function(key,value) {
                            template_text +="<br><b class='nowrap'><i class='fa fa-paperclip' aria-hidden='true'></i> Attachment:-</b><a href="+value.file_path+" target='_blank'>"+ value.file_name+"</a>";
                        });
                    }
                    template_text += "</div>";
                }
                var activity_text = '<strong>'+json['comLog'].created_by+"</strong> sent " +type+" to <strong>" + applicant +" </strong> on <strong>"+ mobileOrEmail +"</strong> with "+subject_line+": <a href='javascript:void(0);' class='template-view' >"+json['comLog'].subject+" </a>.";
                $('.activity-text').html(activity_text);
                $('.preview').empty().html(stripslashes(template_text));
                $('#ActivityLogPopupArea').modal({backdrop: 'static', keyboard: false});
            }
        },
        error: function (response) {
            alertPopup(response.responseText,'error');
        },
        failure: function (response) {
            alertPopup(response.responseText,'error');
        }
    });
}

function stripslashes(str) {
    str = str.replace(/\\'/g, '\'');
    str = str.replace(/\\"/g, '"');
    str = str.replace(/\\0/g, '\0');
    str = str.replace(/\\\\/g, '\\');
    return str;
}

$('html').on('click','.back-button',function(){
   $('.preview').hide(); 
   $('.timeline').show(); 
   $('.back-button').addClass('hide');
});

$('html').on('click','.template-view',function(){
   $('.preview').show(); 
   $('.timeline').hide(); 
   $('.back-button').removeClass('hide');
});

function loadStages(){
    var collegeId   = $("#s_college_id").val();
    var formId      = $("#form_id").val();
    var stageType   = $("#stage_type").val();
    
    if(stageType === 'application' && formId === ''){
        alertPopup("Please Select Form","error");
        return false;
    }
    $.ajax({
        url: jsVars.FULL_URL + '/automation/ajax-get-stages',
        data: {collegeId: collegeId, formId: formId, stageType: stageType, selectedStage: ''},
        dataType: "json",
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        success: function (json) {
            if(typeof json['error'] !=='undefined' && json['error'] === 'session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(json['error']) {
                alertPopup(json['error'],'error');
            }
            else if(json['status'] === 200) {
                if(stageType === 'application'){
                    $('#stage_id').html("<option value=''>Application Stage</option>");
                    $('#stage_id').trigger('chosen:updated');  
                    var html = "<option value=''>Application Stage</option>";
                    for (var key in json["applicationStageList"]) {
                        var stage_sel_val='';
                        html += "<option value='" + key + "' "+stage_sel_val+">" + json["applicationStageList"][key] + "</option>";
                    }
                    $('#stage_id').html(html);
                    $('#stage_id').trigger('chosen:updated');
//                    if(json['applicationSubStageConfigure']){
//                        $("#stage_id")[0].setAttribute("onchange", "getApplicationSubStages("+formId+",this.value,'application_sub_stage', 'chosen', 'applicationSubStagesDiv')");
//                    }
                }
                else{
                    $('#stage_id').html("<option value=''>Lead Stage</option>");
                    $('#stage_id').trigger('chosen:updated');
                    
                    var html = "<option value=''>Lead Stage</option>";
                    for (var key in json["leadStageList"]) {
                        var stage_sel_val='';
                        html += "<option value='" + key + "' "+stage_sel_val+">" + json["leadStageList"][key] + "</option>";
                    }
                    $('#stage_id').html(html);
                    $('#stage_id').trigger('chosen:updated');
                }  
            }
        },
        error: function (response) {
            alertPopup(response.responseText);
        },
        failure: function (response) {
            alertPopup(response.responseText);
        }
    });
}

function getAllFormList(cid, default_val, multiselect) {
    if(typeof default_val=='undefined'){
        default_val = '';
    }
    if(typeof multiselect=='undefined'){
        multiselect = '';
    }
    
    if(cid == '' || cid == '0' ){
        $("#formListDiv").html("<select name='form_id' id='form_id'  class='chosen-select' ><option value='0'>Form</option></select>");
	$('.chosen-select').chosen();
        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        return false;
    }
    
    $.ajax({
        url: jsVars.FULL_URL + '/voucher/get-forms',
        type: 'post',
        data: {
            "college_id": cid,
            "default_val": default_val,
            "multiselect":multiselect
        },
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
           //currentObj.text('Wait..');
        },
        success: function (json) {
            if (json == 'session_logout') {
                window.location.reload(true);
            } else {
                $("#formListDiv").html(json);
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            }
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            ;
        }
    });
}

function alertPopup(msg, type, location) {
    var selector_parent, selector_titleID, selector_msg, title_msg, btn;
    if (type === 'error') {
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

    if (typeof location !== 'undefined') {
        $(btn).show();

        $(selector_parent).modal({keyboard: false}).one('click', btn, function (e) {
            e.preventDefault();
            window.location.href = location;
        });
    } else {
        $(selector_parent).modal();
    }
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
    $('div.loader-block').show();
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
             $('div.loader-block').hide();
        },
        success: function (json) { 
            if (json['error']){
                alertPopup(json['error'], 'error');
            }else if (json['success'] == 200){ 
                $('body').css('padding-right', '0');
                alertPopup('The user '+json['email']+' has been resubscribed to the mailing list', 'success');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return;
}

function LoadMoreWebhookRequestreports(listingType) {
    var data = [];
    if (listingType === 'reset') {
        varPage = 0;
        $('#webhook_report_container').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
        $('.modalButton').hide();
    }
    data = $('#webhookReportForm, #webhookReportForm1').serializeArray();
    data.push({name: "page", value: varPage});
    data.push({name: "type", value: listingType});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-spin fa-refresh" aria-hidden="true"></i>&nbsp;Loading...');
    $('div.loader-block').show();
    $.ajax({
        url: jsVars.FULL_URL + '/communications/ajax-automation-webhook-request-report',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function (xhr) {
            $('.loader-block').show();
            $('#search_btn_hit').prop("disabled",true);
            $('.daterangepicker_report').prop('disabled', true);
        },
        success: function (data) {
            varPage = varPage + 1;
            var checkError  = data.substring(0, 6);
            if (data === "session_logout") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(data.substring(6, data.length));
                $('#load_more_button').hide();
            } else {
                data = data.replace("<head/>", '');
                var countRecord = countResult(data);
                if(countRecord == 0){
                   $('.modalButton').hide();
                }else{
                    $('.modalButton').show();
                }
                if (listingType === 'reset') {
                    $('#webhook_report_container').html(data);
                } else {
                    $('#webhook_report_container').find("tbody").append(data);
                }
                if(countRecord == 0 && varPage == 1){
                    $("#if_record_exists").hide();
                }else{
                    $("#if_record_exists").show();
                }
                if (countRecord < 10) {
                    $('#load_more_button').hide();
                } else {
                    $('#load_more_button').show();
                }
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Reports');
            }
		$('.offCanvasModal').modal('hide');
		dropdownMenuPlacement();
        },
        complete: function () {
            $('.loader-block').hide();
            $('#search_btn_hit').prop("disabled",false);
            $('.daterangepicker_report').prop('disabled', false);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function resetWebhookReport(){
    $('#job_id').val('');
    //$('#college_id').val('');
    $('#form_id').val('');
    $('#automationList').val('');
    $('#webhookStatus').val('');
    $('#created_on').val('');
    $('.chosen-select').trigger('chosen:updated');
    LoadMoreWebhookRequestreports('reset');
}

function viewErpDetail(id,collection_name,key_name){
    if(typeof key_name == 'undefined'){
        key_name = '';
    }
    $.ajax({
        url: jsVars.FULL_URL + '/datalogs/view-detail',
        type: 'post',
        dataType: 'html',
        data: {id:id,collection_name:collection_name,key_name:key_name},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            data = data.replace("<head/>", '');
            if (data == "session_logout") {
                window.location.reload(true);
            }
            else {
                jQuery("#mongoDocumentList").html(data);
                jQuery("#mongoDoc").modal();    
                
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$(document).on('click', '.stagereport', function () {
    $('#confirmDownloadYes').off('click');
    $('#confirmDownloadTitle').text('Download Confirmation');
    $('#ConfirmDownloadPopupArea .npf-close').hide();
    $('.confirmDownloadModalContent').text('Do you want to download the Stage Detailed Report?');
    var $form = $("#CommunicationReportForm");
    var action = $form.attr("action");
    $form.attr("target", 'modalIframe');
    var onsubmit_attr = $form.attr("onsubmit");
    $form.attr("action", jsVars.FULL_URL+'/communications/download-lead-stage-report');
    if($('#downloadConfig').length && $('#downloadConfig').val()==1){
        $('#confirmDownloadYes').on('click',function(){
            $('.draw-cross').css('display','block');
            $('#ConfirmDownloadPopupArea').modal('hide');
            $form.attr("target", 'modalIframe');
            var data = $form.serializeArray();

            data.push({name: "s_college_id", value: $("#s_college_id").val()});
            data.push({name: "form_id", value: $("#form_id").val()});
            data.push({name: "stage_id", value: $("#stage_id").val()});
            data.push({name: "created_on", value: $("#created_on").val()});
            data.push({name: "stage_type", value: $("#stage_type").val()});

            $.ajax({
                url: jsVars.FULL_URL+'/communications/download-lead-stage-report',
                type: 'post',
                data : data,
                dataType:'json', 
                headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                success:function (response){
                    if (response.error === "session_logout") {
                        location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                    }
                    else if(response.status == true) {
                        $('#muliUtilityPopup').modal('show');
                        //$('#downloadListing').prop('href',JSON.parse(response).downloadUrlCsvFile);
                    } 
                    else{
                        alertPopup(response.error,'error');
                    }
                }
            });
//                $form.submit();
            $form.attr("onsubmit", onsubmit_attr);
            $form.removeAttr("target"); 
        }); 
    }else{
        $form.submit();
        $form.attr("onsubmit", onsubmit_attr);
        $("#job_id_hidden").remove();
        $form.attr("action", action);
        $form.removeAttr("target");  
    }

});
$('#myModal').on('hidden.bs.modal', function () {
    $("#modalIframe").html("");
});


$(document).on('click', '.allocatereport', function () {
    $('#confirmDownloadYes').off('click');
    $('#confirmDownloadTitle').text('Download Confirmation');
    $('#ConfirmDownloadPopupArea .npf-close').hide();
    $('.confirmDownloadModalContent').text('Do you want to download the Allocate Lead Report?');
    var $form = $("#CommunicationReportForm");
    var action = $form.attr("action");
    $form.attr("target", 'modalIframe');
    var onsubmit_attr = $form.attr("onsubmit");
    $form.attr("action", jsVars.FULL_URL+'/communications/download-allocate-lead-report');
    if($('#downloadConfig').length && $('#downloadConfig').val()==1){
        $('#confirmDownloadYes').on('click',function(){
            $('.draw-cross').css('display','block');
            $('#ConfirmDownloadPopupArea').modal('hide');
            $form.attr("target", 'modalIframe');
            var data = $form.serializeArray();
            data.push({name: "s_college_id", value: $("#s_college_id").val()});
            data.push({name: "job_id", value: $("#job_id").val()});
            data.push({name: "automationList", value: $("#automationList").val()});
            data.push({name: "created_on", value: $("#created_on").val()});
            data.push({name: "allocationType", value: $("#allocationType").val()});
            data.push({name: "formId", value: $("#formId").val()});
            downloadRequestPopupMessage('Allocate Lead Report',$('#s_college_id').val());
            $('#downloadListing').prop('href',$('#requestDownloadUrl').val());
            
            $.ajax({
                url: jsVars.FULL_URL+'/communications/download-allocate-lead-report',
                type: 'post',
                data : data,
                dataType:'json', 
                headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                success:function (response){
                    if (response.error === "session_logout") {
                        location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                    }
                    else if(response.status == true) {
                        $('#muliUtilityPopup').modal('show');
                        //$('#downloadListing').prop('href',JSON.parse(response).downloadUrlCsvFile);
                    } 
                    else{
                        alertPopup(response.error,'error');
                    }
                }
            });
//                $form.submit();
            $form.attr("onsubmit", onsubmit_attr);
            $form.removeAttr("target"); 
        }); 
    }else{
        $form.submit();
        $form.attr("onsubmit", onsubmit_attr);
        $("#job_id_hidden").remove();
        $form.attr("action", action);
        $form.removeAttr("target");  
    }

});
$('#myModal').on('hidden.bs.modal', function () {
    $("#modalIframe").html("");
});

function getIframeTemplate(logId,applicantId,applicant,mobileOrEmail,mongo_id) {
   var returnHTML = '';
   $.ajax({
       url: jsVars.FULL_URL + '/communications/getCommunicationPreviewIframe',
       data: {communicationId: logId,applicantId: applicantId,from:'communication_detail',mongo_id:mongo_id},
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
       //contentType: "application/json; charset=utf-8",
       success: function (html) {
           if (html == 'session_logout') {
//                returnHTML = json['template_text'];
               location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
           }
           else if (html == 'invalid_request') {
               returnHTML = 'We got some error, please try again later.';
               alertPopup(returnHTML, 'error');
//                returnHTML = '<audio controls><source src="'+json['template_text']+'" type="audio/wav"></audio>';
           }
           else {
               returnHTML = html;
           }
           
           
       },
       error: function (response) {
           alertPopup(response.responseText);
       },
       failure: function (response) {
           alertPopup(response.responseText);
       }
   });
   return returnHTML;
}