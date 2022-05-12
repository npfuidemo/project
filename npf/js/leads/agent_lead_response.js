//$.material.init();
$(document).ready(function () {
    //$('#college_id').SumoSelect({placeholder: 'Listing Fields', search: true, searchText:'Listing Fields', selectAll : false, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });  
    var NPFAgentStats=0;
    PopupBatchBind();
});

function getAllAgentList(college_id) {
    $.ajax({
        url: '/agentLeads/getAllAgentList',
        type: 'post',
        dataType: 'html',
        data: {'college_id':college_id},
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
                $('#agent_id').html(responseObject.data);
                $("#agent_id").trigger('chosen:updated');
               
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


function getAgentStatusList(type){
    if (type == 'reset') {
        NPFAgentStats = 0;
        $('#load_more_results').closest('div').removeClass('table-border');
        $('.if_record_exists').hide();
        $('#load_more_results').html("");
        //removefilter 
        $('.offCanvasModal').modal('hide');
        $('#load_more_results_msg').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
    }
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').hide();
    var data = $('#FilterAgentPanel').serializeArray();
    data.push({name: "page", value: NPFAgentStats});
    $.ajax({
        url: '/agentLeads/ajaxAgentLeadResponseLogs',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function () {
           $('#parent').css('min-height', '50px');
           $('.expandableSearch').hide();
           //showLoader();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            NPFAgentStats = NPFAgentStats + 1;
            if(data=='session_logout'){
                window.location.reload(true);
            }else if(data=='invalid_request_csrf'){
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;Load more users");
                $('#load_more_button').hide();
                $('.if_record_exists').hide();
                $('#load_more_results').html('<h4 class="text-center text-danger">Invalid Request.</h4>');
            }else if(data=='no_record_found'){
                $('#load_more_button').html("Load More Leads");
                $('#load_more_button').hide();
                if(NPFAgentStats==1){
                    $('#load_more_results').html('<div class="noDataFoundDiv"><div class="innerHtml"><img src="/img/no-record.png" alt="no-record"><span>No Data Found</span></div></div>');
                    $('.expandableSearch').show();
                    $('.table-responsive').removeClass('newTableStyle');
                }else{
                    $('#load_more_results_msg').html('<div class="noDataFoundDiv"><div class="innerHtml"><img src="/img/no-record.png" alt="no-record"><span>No Data Found</span></div></div>');
                    $('.expandableSearch').show();
                    $('.table-responsive').removeClass('newTableStyle');
                }
            }else if(data=='select_college'){
                $('#load_more_button').html("");
                $('#load_more_button').hide();
                
                $('#load_more_results_msg').html('<div class="aligner-middle"><div class="text-center text-info font16"><span class="lineicon-43 alignerIcon"></span><br><span id="load_msg">Please select an Institute Name from filter and click apply to view Logs.</span></div></div>');
                $('#agent_lead_msg').hide();
                
            }else{
                data = data.replace("<head/>", '');
                $('.expandableSearch').show();
                $('.table-responsive').addClass('newTableStyle');
                if (type == 'reset') {
                    $('#load_more_results').html(data);
                    
                }else{
                    $('#load_more_results').append(data);
                    
                }
                var ttl = $('#current_record').val();  
                
                if(parseInt(ttl) < 10){
                    $('#LoadMoreArea').hide();
                }else{
                    $('#LoadMoreArea').show();
                }
                $('#load_more_results').closest('div').addClass('table-border');
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;Load More Users");
                $('.if_record_exists').fadeIn();
                $('#load_more_button').fadeIn();
                $('#load_more_button').show();
		        $('.hide_extraparam').show();
            }
//			dropdownMenuPlacement();
//			determineDropDirection();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //window.location.reload(true);
        },
        complete: function () {
            hideLoader();
        }
    });
}

function PopupBatchBind(){
    $('.modalButton').on('click', function(e) {
        var $form = $("#FilterAgentPanel");
        $form.attr("action",'/agentLeads/ajaxAgentLeadResponseLogs');
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

function viewApplicationNum(uid,college_id) {
    $.ajax({
        url: '/agentLeads/getApplicationNumber',
        type: 'post',
        dataType: 'html',
        data: {'user_id':uid,'college_id':college_id},
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
                alertPopup('Application Numbers: '+responseObject.data, 'success');
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
        title_msg = 'Application Numbers';
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