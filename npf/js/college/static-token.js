$(document).ready(function () {
    $(".erroralert").delay(5000).slideUp(300);
    $(".successalert").delay(5000).slideUp(300);
    
    if ($(".dateinput").length > 0) {
        $('.dateinput').datetimepicker({format: 'DD/MM/YYYY HH:mm', viewMode: 'days'});
    }

    $("#save_static_token").click(function () {
        saveStaticToken(jsVars.urls);
    });
    
    $(function () {
        $('[rel="popover"]').popover({
            container: 'body',
            html: true,
            content: function () {
                var clone = $($(this).data('popover-content')).clone(true).removeClass('hide');
                return clone;
            }
        }).click(function (e) {
            e.preventDefault();
        });
    });
    
    $('#listloader').hide();
    dateRange();
});

function dateRange(){
    $('.daterangepicker_static').daterangepicker({
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY',
            separator: ', '
        },
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'left',
        drops: 'down',
    }, function (start, end, label) {
    });

    $('.daterangepicker_static').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
    });

    $('.daterangepicker_static').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
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


function LoadMoreStaticTokens(type) {
    $(".lead_error").html('');
    if (type === 'reset') {
        StaticTokenPage  = 1;
        $('#static_token_container').html("");
        $("#static_token_container").parent().hide();
    }
    
    $('#load_more_button').hide();
    if($("#college_id").val()===''){
        $("#load_msg_div").show();
        hideLoader();
        return;
    }
    var data = $('#FilterStaticTokenForms').serializeArray();
    data.push({name: "page", value: StaticTokenPage});
    $.ajax({
        url: '/colleges/static-token-list',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function () {
           $('#parent').css('min-height', '50px');
           showLoader();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (response) {
            StaticTokenPage+=1;
	    var responseObject = $.parseJSON(response); 
	    if (responseObject.message === 'session'){
		window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
	    }else if(responseObject.message ==="no_record_found"){    
                if(StaticTokenPage===2){
                    $('#load_msg').html('No Static Token Found');
                    $('#load_msg_div').show();
					$('#load_more_results').parent().addClass('hide');
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Token");
                    $('#load_more_button').hide();
					if ($(window).width() < 992) {
						//filterClose();
					}
                }else {
                    $('#load_msg').html('');
                    $('#load_msg_div').hide();
                    $('#load_more_button').html("<i class='fa fa-database' aria-hidden='true'></i>&nbsp;No More Token");
                    $('#load_more_button').show();
                }
                if (type !== '' && StaticTokenPage===2) {
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
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Token");
                    $('#load_more_button').hide();
                }else{
                    $('#load_more_button').removeAttr("disabled");
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Token");
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
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Token");
                 if (type !== '') {
                        $('#if_record_exists').hide();
                 }
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

function validateStaticTokenData() {
    $('.error').hide();
    var error = false;
    
    if ($("#colleges").val() === "") {
        $('#college_id_error').html("Field is required.");
        $('#college_id_error').show();
        error = true;
    }
    
    if($("#token_name").val()===""){
        $('#token_name_error').html("Field is required.");
        $('#token_name_error').show();
        error=true;
    } 
    
    if($("#token_name").val()!=="" && !($("#token_name").val().match(/^[0-9a-zA-Z\ ]+$/))){
        $('#token_name_error').html("Invalid Token Name. Only Aplhanumeric Characters allowed.");
        $('#token_name_error').show();
        error=true;
    } 
    
    if($("#token_value").val()===""){
        $('#token_value_error').html("Field is required.");
        $('#token_value_error').show();
        error=true;
    } 
    
//    if(!$("#token_value").val().match(/^[a-zA-Z'.\s]{1,40}$/)) {
//        $('#token_value_error').html("Invalid Token Value.");
//        $('#token_value_error').show();
//        error=true;
//    }

    if (error === false) {
        return true;
    } else {
        return false;
    }
}

function saveStaticToken(urls) {

    if (validateStaticTokenData() === false) {
        return;
    }
    //make buttun disable
    var data = [];
    data = $('#static-tokens').serializeArray();
    data.push({name: 'urlParams', value: urls});
    
    $.ajax({
        url: jsVars.saveStaticTokenLink,
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $('#listloader').show();
            window.scrollTo(0, 0);
        },
        complete: function () {
            $('#listloader').hide();
            $(':input[type="button"]').removeAttr("disabled");
        },
        async: true,
        success: function (response) {
            var responseObject = response;
            if (responseObject.message === 'session') {
                window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if (responseObject.status === 1) {
                $('#alert_msg').html("<i class='fa fa-check'></i>&nbsp;Static token successfully saved.");
                if(typeof responseObject.data!=="undefined" && typeof responseObject.data.urlParams!=="undefined"){
                    location = jsVars.staticTokenModule+"/"+responseObject.data.urlParams;
                }else{
                    location = jsVars.staticTokenModule;
                }
            } else {
                alertPopup(responseObject.message, 'error');
                return;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            setTimeout("location.reload();", 5000);
        }
    });
}

function showTokenStatusChangeConfirmationPopup(status,params){
    
    $('#ConfirmAlertYesBtn').unbind();
    $('#ConfirmAlertNoBtn').unbind();
    if(status===2){
        $('#ConfirmAlertPopUpTextArea').html("Do you want to disable?");
        $('#ConfirmAlertPopUpSection .modal-title').html("Disable Token");
    }else{
        $('#ConfirmAlertPopUpTextArea').html("Do you want to enable?");
        $('#ConfirmAlertPopUpSection .modal-title').html("Enable Token");
    }
    $("#ConfirmAlertPopUpSection").modal("show");
    $("#ConfirmAlertYesBtn").on("click",function(){
        changeStatusToken(params);
    });
}

function changeStatusToken(params) {
    
    $.ajax({
        url: '/colleges/changeStatusToken/'+params,
        type: 'get',
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
           showLoader();
        },
        success: function (json) {
            
            if (json['message'] === 'session') {
                window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if (json['status'] === 1) { 
                alertPopup(json['message'],'success');
                $('#alertTitle').html('Success');
                LoadMoreStaticTokens('reset');
                $('#OkBtn').show();      
            }
            else {
                // System Error
                alertPopup('Some Error occured, please try again.', 'error');
            }
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError);
        },
        complete: function () {
            hideLoader();
        }
    });
}

$('#OkBtn').on('click', function () {
    $("#SuccessPopupArea .npf-close").trigger('click');
});

function showLoader() {
    $("#listloader").show();
}
function hideLoader() {
    $("#listloader").hide();
}