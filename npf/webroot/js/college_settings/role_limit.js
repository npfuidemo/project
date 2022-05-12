$(document).ready(function(){
    if($('#role_limit_list').length>0){
        $('#role_limit_list #college_id').SumoSelect({placeholder: 'Select Institutes', search: true, searchText:'Search Institute', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
        $('#role_limit_list #role_id').SumoSelect({placeholder: 'Select Role', search: true, searchText:'Search Role', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });

        NPFUserLimitList = 0;
        getUserLimitList('reset');
    }
    loadRolesLimit();
});


function bindAfterAjaxCall(){
    $(".all_roles_input, #limit_type").change(function(){
        calculateTotalUsers();
    });
}

function calculateTotalUsers(){
    if($('#limit_type').val()=="role_wise"){
        $(".div_roles").fadeIn();
        total=0;
        $(".all_roles_input").each(function() {
            if($(this).val()!=""){
                var val=$(this).val();
                total = total + parseInt(val);
            }
        });
        if(parseInt($("#role_3").val())!=1){
            $("#role_3").val("1");
            total = 1;
        }
        $('#role_total').val(total);
        $('#role_total').attr('readonly','readonly');
    }else{
        $(".all_roles_input").val("");
        $(".div_roles").fadeOut();
        $('#role_total').removeAttr('readonly');
    }
}

function saveRolesLimit(){
    //make buttun disable
    var data = [];
    data = $('#role_limit_form').serializeArray();

    $.ajax({
        url: jsVars.FULL_URL + '/college-settings/save-roles-limit',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $('#listloader').show();
        },
        complete: function () {
            $('#listloader').hide();
            $(':input[type="button"]').removeAttr("disabled");
        },
        async: false,
        success: function (response) {
            var responseObject = $.parseJSON(response);

            //return;
            if (responseObject.data == "session") {
                location.reload();
            }else if (responseObject.data== "invalid_request"){
                location.reload();
            }else if (responseObject.data == "college_missing"){
                $('#load_all_roles').html("<div class='error'>Please select an institute to continue.</div>");
            } else if (responseObject.data == "success"){
                $('.error_message').html("");
                alertPopup('User limit configuration saved successfully','success');
            }else if (responseObject.data == "error"){
                $('.error_message').html("");
                $.each(responseObject.post, function(index, value) {
                    $('#error_'+index).html(value);
                });
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            setTimeout("location.reload();",5000);
        }
    });
}

function loadRolesLimit() {
    //make buttun disable
    var data = [];
    data = $('#role_limit_form').serializeArray();

    $.ajax({
        url: jsVars.FULL_URL + '/college-settings/role-limit-ajax',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
           showLoader();
		   $('#parent').css('min-height', '200px')
        },
        complete: function () {
            hideLoader();
            $(':input[type="button"]').removeAttr("disabled");
        },
        async: false,
        success: function (data) {
			$('#parent').css('min-height', '0')
            if (data == "session") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (data == "invalid_request"){
                location.reload();
            }else if (data == "college_missing"){
                $('#load_all_roles').html("<div class='error text-center'>Please select an institute to continue.</div>");
            } else {
                data = data.replace("<head/>", '');
                $('#load_all_roles').html(data);
                $('#load_msg_div').hide();
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                bindAfterAjaxCall();
                $('.offCanvasModal').modal('hide');
            }


        },
        error: function (xhr, ajaxOptions, thrownError) {
            //console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            setTimeout("location.reload();",5000);
        }
    });
}


function getUserLimitList(type){
    if (type == 'reset') {
        NPFUserLimitList = 0;
        $('#load_more_results').html("");
        $('#load_more_results_msg').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
    }
    $('#load_more_button').attr("disabled", "disabled");
	$('#search_btn').attr("disabled", "disabled");
    $('#load_more_button').hide();
    var data = $('#role_limit_list').serializeArray();
    data.push({name: "page", value: NPFUserLimitList});

    $.ajax({
        url: '/college-settings/ajax-role-limit-list',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function () {
		   $('#parent').css('min-height', '50px');
           showLoader();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
			$('#parent').css('min-height', 'auto');
            NPFUserLimitList = NPFUserLimitList + 1;
            if(data=='session_logout'){
                window.location.reload(true);
            }else if(data=='no_record_found'){
                //$('#load_more_button').html("Load More Record");
                $('#load_more_button').hide();
                $('.if_record_exists').show();
                if(NPFUserLimitList==1){
                    $('#load_more_results').html('<div class="col-md-12 col-xs-12" id="load_more_results_msg" style=""><table class="table table-striped list_data"><tbody><tr><td><div class="row"><div class="col-md-12"><h4 class="text-center text-danger">No Record Found</h4></div></div> </td></tr><tr></tr></tbody></table></div>');
                }else{
                    $('#load_more_results_msg').html('<div class="col-md-12 col-xs-12" id="load_more_results_msg" style=""><table class="table table-striped list_data"><tbody><tr><td><div class="row"><div class="col-md-12"><h4 class="text-center text-danger">No More Record</h4></div></div> </td></tr><tr></tr></tbody></table></div>');
                }
            }else{
                data = data.replace("<head/>", '');
                $('.if_record_exists').show();
                $('#load_more_results').append(data);
		$('#search_btn').removeAttr("disabled");
                $('#load_more_button').show().removeAttr("disabled");
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;Load More Record");
                $('.offCanvasModal').modal('hide');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //window.location.reload(true);
        },
        complete: function () {
            hideLoader();
        }
    });
}

function downloadUserLimit(type){
    $("#downloadXls").html($("<input>").attr({"value":type, "name":"downloadtype",'type':"hidden","id":"downloadtype"}));
    $("#role_limit_list").submit();
}

function alertPopup(msg, type, location) {

    if (type == 'error') {
        var selector_parent = '#ErrorPopupArea';
        var selector_titleID = '#ErroralertTitle';
        var selector_msg = '#ErrorMsgBody';
        var btn = '#ErrorOkBtn';
        var title_msg = 'Error';
    } else {
        var selector_parent = '#SuccessPopupArea';
        var selector_titleID = '#alertTitle';
        var selector_msg = '#MsgBody';
        var btn = '#OkBtn';
        var title_msg = 'Success';
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
    }
    else {
        $(selector_parent).modal();
    }
}