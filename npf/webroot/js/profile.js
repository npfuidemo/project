/* 
 * Handle ApplicantProfile related js.
 */

$(document).ready(function () {
    $('#datepickerIcon').datepicker({startView: 'month', format: 'dd-m-yyyy', enableYearToMonth: true, enableMonthToDay: true});
});

$(document).on("click", "#EditProfile", function (event) {
    event.preventDefault();
    $('.form-control, #ProfilePic').removeAttr("disabled");
    $(".edit-submit-btn, #ProfileDetailsForm .btn-password-change").css("display", "block");
    $('#ProfileChangePasswordForm, #ChangePasswordBtn').css("display", "none");
});
$(document).on("click", "#ChangePasswordBtn", function (event) {
    event.preventDefault();

    if ($('#ProfileChangePasswordForm').is(":visible"))
    {
        $('#ProfileChangePasswordForm').css("display", "none");
        $('.btn-password-change').css("display", "block");
        $(".edit-submit-btn").css("display", "none");
    } 
    else
    {

        $('#ProfileChangePasswordForm').css("display", "block");
    }
});

function saveProfileData(form)
{
    $("span.help-block").text('');
    if(runConditionalJs()){
        return false;
    }
    $.ajax({
        url: jsVars.SaveProfileUrl,
        type: 'post',
        data: $(form).serializeArray(),
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
        success: function (json) {

            if (json['redirect'])
            {
                location = json['redirect'];
            }
            else if (json['error'])
            {
                if (json['error'])
                {
                    for (var i in json['error'])
                    {
                        //if(json['error']['list'][i])
                        var parentDiv = $("#" + i).parents('div.form-group');
                        //alert(parentDiv.html());
                        $(parentDiv).addClass('has-error');
                        $(parentDiv).find("span.help-block").text('');
                        $(parentDiv).find("span.help-block").append(json['error'][i]);
                    }
                }
            }
            else if (json['success'] == 200)
            {      
                if(json['location'])
                {
                    location = json['location'];
                }
                else if(json['popup'])
                {
                    $('#change-password button.npf-close').trigger('click');
                    $('#PasswordMode').val('change');
                }
                if(json['msg']!==''){
                    alertPopup(json['msg'],'success');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#already-registered div.loader-block').hide();
        }
    });
}

function resendMail()
{
    $.ajax({
        url: jsVars.ResendMailUrl,
        type: 'post',
        data: {action:'mail'},
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
        success: function (json) {

            if (json['redirect'])
            {
                location = json['redirect'];
            }
            else if (json['error'])
            {
                if (json['error']['msg'])
                {
                    alertPopup(json['error']['msg'],'error');
                }                
            }
            else if (json['success'] == 200)
            { 
                alertPopup(json['msg'],'success');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
        }
    });
}
