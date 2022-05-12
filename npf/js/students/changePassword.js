var validatePassword3LevelCheck = false;
if ((typeof jsVars.validatePassword3Level !== 'undefined') && (jsVars.validatePassword3Level === 1)) {
    validatePassword3LevelCheck = true;
}

if ((validatePassword3LevelCheck === true) && (document.documentElement.clientWidth < 900)) {
    $('#PasswordForm #Password').popover({
            placement: 'top'
    });
}

$(document).ready(function () {    
    if (validatePassword3LevelCheck === true) {
        $('[data-toggle="popover"]').popover();

        $("#PasswordForm #Password").keyup(function(){
            validatePassword('Password');
        });
        $("#PasswordForm #Password").focus(function(){
            validatePassword('Password');
        });
    }
});

function validatePassword(field){
    var validPassword   = false;
    var password        = $("#"+field).val();
    var upperCase   = 0;
    var lowerCase   = 1;
    var numeric     = 0;
    var special     = 0;
    var password_len     = 0;

    $('.ul_new_password li').removeClass("active");

    if(password.length >= 8){
        password_len=1;
        $('.ul_new_password .password_len').addClass("active");
    }

    if(password.toLowerCase() !== password){
        upperCase   = 1;
        $('.ul_new_password .capital').addClass("active");
    }
    if(password.toUpperCase() !== password){
        //lowerCase   = 1;
        //$('.ul_new_password .lowercase').addClass("active");
    }
    if(/\d/.test(password)){
        numeric = 1;
        $('.ul_new_password .numeric').addClass("active");
    }
    var formatMatch = /[!@#$%^&*()_+\-=\[\]{}`~;':"\\|,.<>\/?]/;
    if(formatMatch.test(password) == true) {
        special = 1;
        $('.ul_new_password .special').addClass("active");
    } 
    if(upperCase==1 && lowerCase==1 && numeric==1 && password_len==1 && special==1){
        validPassword   = true;
    }
    return validPassword;
 }
 
 function validateFormData(){
     var error="";
     $("span.help-block").text('');
     $("div.has-error").removeClass('has-error');
     
     if($('form#PasswordForm #OldPassword').val()==""){
        error="Please enter current password.";
        var parentDiv = $('form#PasswordForm #OldPassword').parents('div.form-group');
        $(parentDiv).addClass('has-error');
        $('#span_old_password').html(error);
        $('#span_old_password').fadeIn();
     }
     if($('form#PasswordForm #Password').val()==""){
        error="Please enter new password.";
        var parentDiv = $('form#PasswordForm #Password').parents('div.form-group');
        $(parentDiv).addClass('has-error');
        $('#span_new_password').html(error);
        $('#span_new_password').fadeIn();
     }
     if($('form#PasswordForm #Confirm').val()==""){
        error="Please enter confirm password.";
        var parentDiv = $('form#PasswordForm #Confirm').parents('div.form-group');
        $(parentDiv).addClass('has-error');
        $('#span_confirm_password').html(error);
        $('#span_confirm_password').fadeIn();
     }
     
     if($('form#PasswordForm #Password').val().indexOf(' ') >= 0){
        error="Spaces are not allowed";
        var parentDiv = $('form#PasswordForm #Password').parents('div.form-group');
        $(parentDiv).addClass('has-error');
        $('#span_new_password').html(error);
        $('#span_new_password').fadeIn();
     }
     
     if(error==""){
        if(validatePassword('Password')==false){
           error="New Password doesn't meet the criteria mentioned.";
           var parentDiv = $('form#PasswordForm #Password').parents('div.form-group');
            $(parentDiv).addClass('has-error');
           $('#span_new_password').html(error);
           $('#span_new_password').fadeIn();
        }
        if($('form#PasswordForm #Password').val()!=$('form#PasswordForm #Confirm').val()){
           error="New Password and Confirm Password doesn't match.\n";
           var parentDiv = $('form#PasswordForm #Confirm').parents('div.form-group');
            $(parentDiv).addClass('has-error');
           $('#span_confirm_password').html(error);
           $('#span_confirm_password').fadeIn();
        }
     }
     
     if(error=="") return true;
     else return false;
     //alert(error);
     //return false;
 }

function saveProfileData(form){
    if ((validatePassword3LevelCheck === true) && !validateFormData()) {
        return;
    }
    $("span.help-block").text('');
    $("div.has-error").removeClass('has-error');
    $.ajax({
        url: jsVars.SaveProfileUrl,
        type: 'post',
        data: $('#' + form + ' input'),
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
                        var parentDiv = $("#" + i).parents('div.form-group');
                        $(parentDiv).addClass('has-error');
                        $(parentDiv).find("span.help-block").text('');
                        $(parentDiv).find("span.help-block").append(json['error'][i]);
                    }
                }
            }
            else if (json['success'] == 200){      
                if(json['msg']!==''){
                    $('form#PasswordForm input').val('');
                    $('form#PasswordForm input#PasswordMode').val('change');
                    $('#successMsg').html('<div class=col-md-12"><div class="form-group" style="margin-bottom:20px;"><p class="text-success text-center"><i class="fa fa-check-circle" aria-hidden="true" style="font-size:2rem;"></i>&nbsp;Your password has been updated successfully</p></div></div>');
                    setTimeout(function() {
                            $('#successMsg').html(''); 
                    }, 5000)
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#already-registered div.loader-block').hide();
        }
    });
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

// Password Eye
jQuery(".toggle-password").click(function() {
  jQuery(this).toggleClass("fa-eye-slash fa-eye ");
  var input = jQuery(jQuery(this).attr("toggle"));
  if (input.attr("type") == "password") {
	input.attr("type", "text");
  } else {
	input.attr("type", "password");
  }
});