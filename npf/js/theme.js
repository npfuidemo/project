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
//Allow only Aphabet and space
function onlyAlphabets(e, t)
{
    try
    {
        if (window.event) {
            var charCode = window.event.keyCode;
        }
        else if (e) {
            var charCode = e.which;
        }
        else {
            return true;
        }

        if ((charCode == 8) || (charCode == 32) || (charCode == 46))
        {
            return true;                    //allow space/backspace/delete key
        }
        else if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    catch (err) {
        alertPopup(err.Description, 'error');
    }
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
function validateEmail(x) {
    var atpos = x.indexOf("@");
    var dotpos = x.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
        return false;
    }
    return true;
}

/* 
 * To handle form label and add placeholder related js.
 */
$(document).ready(function () {
    
    if($("#filter_dial_codeMobile").length){
        $("#filter_dial_codeMobile").parent().css("z-index", "99999");
    }
    $('#registerForm label.control-label').remove();
    $('#registerForm input').each(function () {
        var id = $(this).attr('id');
        if (id == 'Password') {
            $(this).attr('placeholder', 'Any Password of Your Choice * ');
        } else if (id == 'Captcha') {
            $(this).attr('placeholder', 'Enter ' + id + ' * ');
        } else if (id == 'opt_data') {
            $(this).attr('placeholder', 'Enter OTP ');
        } else if (id == 'filter_dial_code') { //If country Dial Code then display blank for placeholder
            $(this).attr('placeholder', '');
        } else if (id == 'filter_dial_codeMobile') { //If country Dial Code then display blank for placeholder
            $(this).attr('placeholder', '');
        } else if (id !== undefined && id != 'undefined' && id.indexOf("opt_data") === 0) {
            $(this).attr('placeholder', 'Enter OTP ');
        } else {
            //$(this).attr('placeholder', 'Your ' + id + ' * ');
        }
    });
    $('#LoginForm label.control-label,#loginForm label.control-label').remove();
    $('#loginForm input').each(function () {
        var id = $(this).attr('id');        
        if(typeof id !== 'undefined') {            
            var id = id.replace("login", "");
        }
        if(id=='Email'){
            if(typeof jsVars.loginPlaceHolder!='undefined'){
                $(this).attr('placeholder',  jsVars.loginPlaceHolder + ' * ');
            }else{
                $(this).attr('placeholder', 'Your ' + id + ' * ');
            }
        }else{
            $(this).attr('placeholder', 'Your ' + id + ' * ');
        }

    });
    $('#forgotForm label.control-label').remove();
    $('#forgotForm input').each(function () {
        var id = $(this).attr('id');
        if(typeof id !== 'undefined') {            
            var id = id.replace("forget", "");
        }
        var placeholder = 'Enter Your Registered ' + id + ' ID ' + '';
        if(typeof jsVars.loginPlaceHolder!='undefined'){
            placeholder = jsVars.loginPlaceHolder;
            placeholder = placeholder.replace('or Mobile No.','');
        }
        $(this).attr('placeholder',  placeholder + ' * ');
    });
    $('#resendVlinkForm label.control-label').remove();
    $('#resendVlinkForm input').each(function () {
        var id = $(this).attr('id');
        if(typeof id !== 'undefined') {            
            var id = id.replace("resentVerification", "");
        }
        $(this).attr('placeholder', 'Enter Your Registered ' + id + ' ID ' + ' * ');
        
    });
});

/**
 * This is for Registration/login/forgot password focus/focusout event
 */
$(document).ready(function () {  
    //When user clicks on register form focus event
    $('#registerForm input').focus(function () {
        var id = $(this).attr('id');
        $('#'+id).parent('div').parent('div').removeClass('has-error').addClass('is-focused');
    });
    
    //For Select Case
    $('#registerForm select').focus(function () {
        var id = $(this).attr('id');
        $('#'+id).parent('div').removeClass('has-error').addClass('is-focused');
    });
    
    //For Register Focusout Event
    $('#registerForm input').focusout(function () {
        var id = $(this).attr('id');
        $('#'+id).parent('div').parent('div').removeClass('is-focused');
    });
    
    $('#registerForm select').focusout(function () {
        var id = $(this).attr('id');
        $('#'+id).parent('div').removeClass('is-focused');
    });
    
    //For Login form focus event
    $('#loginForm input').focus(function () {
        var id = $(this).attr('id');
        $('#'+id).parent('div').parent('div').removeClass('has-error').addClass('is-focused');
    });
    
    //For Login Focusout Event
    $('#loginForm input').focusout(function () {
        var id = $(this).attr('id');
        $('#'+id).parent('div').parent('div').removeClass('is-focused');
    });
    
    
    //When user clicks on register form focus event
    $('#forgotForm input').focus(function () {
        var id = $(this).attr('id');
        $('#'+id).parent('div').parent('div').removeClass('has-error').addClass('is-focused');
    });
    
    //For Forgot Password Focusout Event
    $('#forgotForm input').focusout(function () {
        var id = $(this).attr('id');
        $('#'+id).parent('div').parent('div').removeClass('is-focused');
    });
    
});

/**
 * This function is for publish theme
 * @returns null
 */
function publishTheme(post_data, check, msg){
    var templatealert = false;
    if(check == 1) {
        $('#confirmYes').html('Publish');
        $('#confirmTitle').html('Confirm Publish Action');
        $('#confirmYes').next('button').html('Cancel');
        $('#ConfirmMsgBody').html('It is recommended to check all the pages carefully before publishing. Any changes done will be visible within 2 minutes. Are you sure you want to Publish ?');
    } else {
        $('#confirmYes').html('Yes');
        $('#confirmTitle').html('Confirm');
        $('#confirmYes').next('button').html('Cancel');
        $('#ConfirmMsgBody').html(msg);
    }
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                e.preventDefault();
                $.ajax({
                    url: jsVars.publishURL,
                    type: 'post',
                    data: {'post_data': post_data,'action': 'publish', check_already_live: check},
                    dataType: 'json',
                    async: false,
                    headers: {
                        "X-CSRF-Token": jsVars._csrfToken
                    },
                    beforeSend: function () {
                        $('#preview').attr('disabled');
                        $('div.loader-block').show();
                    },
                    complete: function () {
                        $('div.loader-block').hide();
                        $('#preview').removeAttr('disabled');
                    },
                    success: function (json) {
                        if(typeof json['alert'] !='undefined' && json['alert'] != '') {
                            templatealert = true;
                            publishTheme(post_data, 0, json['alert']);
                        } else if (typeof json['redirect'] !='undefined' && json['redirect'] !='') {
                            window.location.href='/';
                        } else if (typeof json['error'] !='undefined' && json['error'] !='') {
                            alertPopup(json['error'], 'error');
                        } else if (typeof json['status'] !='undefined' && json['status'] == 200) {                            
                            alertPopup( json['message'], "success"); //,jsVars.siteURL
                            
                            //Refresh the parent window so it will redirect to listing page
                            opener.location.href = '/templates/manage-landing-page';
                            
                            //Auto close modal and close the main window after 2 seconds
                            setTimeout(function () {
                                $('#ConfirmPopupArea').modal('hide');
                                window.close();
                            }, 2000);
                        }
                        return false;
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);                        
                    }
                });
                if(templatealert == false) $('#ConfirmPopupArea').modal('hide');
            });
    return false;        
}
/**
 * This function will dynamically set iframe height
 * @param (string) page
 * @returns null
 */
function iFrameHeight(page){
    var height=$( window ).height();
    
    var iFrameID = document.getElementById('idIframe');
      if(iFrameID) {          
            // here you can make the height, I delete it first, then I make it again
            iFrameID.height = "";
            if(page=='thankyou'){
                iFrameID.height = (height-132) + "px";
            } else {
                iFrameID.height = (height-70) + "px";
            }
      }  
      
}


//Refresh captcha on click
$(document).on('click','#CaptchaRefreshBtn',function(){
    var d = new Date();
    var n = d.getTime(); 
    $("#CaptchaImage").attr('src',jsVars.CaptchaLink +'?'+n);
});

function emailPublishTheme(post_data, check, msg){
    var templatealert = false;
    if(check == 1) {
        $('#confirmYes').html('Publish');
        $('#confirmTitle').html('Confirm Publish Action');
        $('#confirmYes').next('button').html('Cancel');
        $('#ConfirmMsgBody').html('It is recommended to check all the pages carefully before publishing. Any changes done will be visible within 2 minutes. Are you sure you want to Publish ?');
    } else {
        $('#confirmYes').html('Yes');
        $('#confirmTitle').html('Confirm');
        $('#confirmYes').next('button').html('Cancel');
        $('#ConfirmMsgBody').html(msg);
    }
    $('#emailConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                e.preventDefault();
                $.ajax({
                    url: jsVars.emailPublishURL,
                    type: 'post',
                    data: {'post_data': post_data,'action': 'emailpublish', check_already_live: check},
                    dataType: 'json',
                    async: false,
                    headers: {
                        "X-CSRF-Token": jsVars._csrfToken
                    },
                    beforeSend: function () {
                        $('#emailpreview').attr('disabled');
                        $('div.loader-block').show();
                    },
                    complete: function () {
                        $('div.loader-block').hide();
                        $('#emailpreview').removeAttr('disabled');
                    },
                    success: function (json) {
                        if(typeof json['alert'] !='undefined' && json['alert'] != '') {
                            templatealert = true;
                            publishTheme(post_data, 0, json['alert']);
                        } else if (typeof json['redirect'] !='undefined' && json['redirect'] !='') {
                            window.location.href='/';
                        } else if (typeof json['error'] !='undefined' && json['error'] !='') {
                            alertPopup(json['error'], 'error');
                        } else if (typeof json['status'] !='undefined' && json['status'] == 200) {                            
                            alertPopup( json['message'], "success"); //,jsVars.siteURL
                            
                            //Refresh the parent window so it will redirect to listing page
                            opener.location.href = '/communications/manage-template';
                            
                            //Auto close modal and close the main window after 2 seconds
                            setTimeout(function () {
                                $('#emailConfirmPopupArea').modal('hide');
                                window.close();
                            }, 2000);
                        }
                        return false;
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);                        
                    }
                });
                if(templatealert == false) $('#emailConfirmPopupArea').modal('hide');
            });
    return false;        
}

