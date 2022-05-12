$(document).ready(function(){
    $(".chosen-select").chosen();
    $('#manageFieldsLoader').hide();
    $(".application_columns_check").each(function(){
        if(this.checked){
            if($(this).val()==="form_title"){
                $("#application_columns_check_form_short_name").attr('disabled', true);
            }
            if($(this).val()==="form_short_name"){
                $("#application_columns_check_form_title").attr('disabled', true);
            }
            if($(this).val()==="action"){
                $("#application_columns_check_action").attr('disabled', true);
            }
        }else{
            $("#application_columns_"+$(this).val()).attr('disabled', true);
            $("#application_columns_alias_"+$(this).val()).attr('disabled', true);
        }
    });
    $(".application_columns_check").click(validateCheckedColumns);
});

function validateCheckedColumns(){
    if($(this).val()==="action"){
        return;
    }
    if($('input[name="application_columns_check[]"]:checked').length > 6){
        $(this).attr('checked',false);
        alertPopup("You can select a maximum of 6 Application Form Attributes.",'error');
        return;
    }
    if(this.checked){
        if($(this).val()==="form_title"){
            $("#application_columns_check_form_short_name").attr('disabled', true);
        }
        if($(this).val()==="form_short_name"){
            $("#application_columns_check_form_title").attr('disabled', true);
        }
        if($(this).val()==="action"){
            $("#application_columns_check_action").attr('disabled', true);
        }
        $("#application_columns_"+$(this).val()).removeAttr('disabled');
        $("#application_columns_alias_"+$(this).val()).removeAttr('disabled');
    }else{
        if($(this).val()==="form_title"){
            $("#application_columns_check_form_short_name").removeAttr('disabled');
        }
        if($(this).val()==="form_short_name"){
            $("#application_columns_check_form_title").removeAttr('disabled');
        }
        $("#application_columns_"+$(this).val()).val('');
        $("#application_columns_"+$(this).val()).attr('disabled', true);
        $("#application_columns_alias_"+$(this).val()).val('');
        $("#application_columns_alias_"+$(this).val()).attr('disabled', true);
    }
}
function submitForm(){
    if($("#collegeId").val()===""){
        $('.select-block-container').html('<div class="alert alert-danger">Please select institute to view fields.</div>');
        return;
    }
    $("#filterRegistrationFieldsForm").submit();

}

function saveSettings(formId){
    if(formId==="applicationColumnsForm"){
        $(".input_error").html("");
        var error   = false;
        if($('input[name="application_columns_check[]"]:checked').length){
            var orders  = [];
            $('input[name="application_columns_check[]"]:checked').each(function(){
                var order   = $("#application_columns_"+$(this).val()).val();
                if( isNaN(parseInt(order)) || parseInt(order) < 1){
                    $("#application_columns_"+$(this).val()+"_error").html("Please provide a valid column number");
                    error   = true;
                }else{
                    //console.log(order);
                    //console.log(orders);
                    if($.inArray(order, orders)>-1){
                        $("#application_columns_"+$(this).val()+"_error").html("Please provide a unique column number");
                        error   = true;
                    }else{
                        orders.push(order);
                    }
                }
            });
        }else{
            error   = true;
        }
        if(error){
            return false;
        }
    }
    disabled = false
    if($("[name='basic_config[show_new_design]']:checkbox").prop('disabled') == true)
    {
        disabled = true; 
        $("[name='basic_config[show_new_design]']:checkbox").prop('disabled', false);
    }
    data = $("form#"+formId).serialize()
    if(disabled == true){
        $("[name='basic_config[show_new_design]']:checkbox").prop('disabled', false);
    }
    $.ajax({
        url: jsVars.saveApplicantFlowConfigurationLink,
        type: 'post',
        data: $("form#"+formId).serialize(),
        async: false,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
            $('#settingsFieldsLoader').show();
	},
        complete: function() {
            $('#settingsFieldsLoader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                alertPopup("The Applicant Flow Settings have been saved successfully.",'success');
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message,'error');
                }
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
