/* 
 * Common javascript function .
 */
$(function(){
    //restrict special character for email
    if($('#Email,#email').length> 0)
    {
        $('#Email,#email').keyup(function()
        {
                var yourInput = $(this).val();
                re = /[`~!#$%^&*()|+\=?;:'",<>\{\}\[\]\\\/]/gi;
                var isSplChar = re.test(yourInput);
                if(isSplChar)
                {
                        var no_spl_char = yourInput.replace(/[`~!#$%^&*()|+\=?;:'",<>\{\}\[\]\\\/]/gi, '');
                        $(this).val(no_spl_char);
                }
        }); 
    }
});
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
        alertPop(err.Description);
    }
}

//enter only numbers
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

//Refresh captcha on click
$(document).on('click','#CaptchaRefreshBtn',function(){
    var d = new Date();
    var n = d.getTime(); 
    $("#CaptchaImage").attr('src',jsVars.CaptchaLink +'?'+n);
});


function alertPopup(msg,type,location){
    
    if(type=='error'){
        var selector_parent     = '#ErrorPopupArea';
        var selector_titleID    = '#ErroralertTitle';
        var selector_msg        = '#ErrorMsgBody';
        var btn                 = '#ErrorOkBtn';
        var title_msg           = 'Error';
    }else{
        var selector_parent     = '#SuccessPopupArea';
        var selector_titleID    = '#alertTitle';
        var selector_msg        = '#MsgBody';
        var btn                 = '#OkBtn';
        var title_msg           = 'Alert';
    }

    $(selector_titleID).html(title_msg);
    $(selector_msg).html(msg);
    $('.oktick').hide();
        
    if(typeof location != 'undefined'){
         $(btn).show();

        $(selector_parent).modal({keyboard:false}).one('click',btn,function(e){
            window.location.href=location;
        });
    }
    else{
        $(selector_parent).modal();
    }    
}


function showMobileHeader()
{
    jQuery(".showhidemobile").fadeIn(); 
     jQuery(".inlineBlockFull").removeClass("zeromargin"); 
     jQuery(".login-common").removeClass("loginmargin"); 
     jQuery(".fixedshowicon").fadeOut();
}

//Resend mail Function
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
                $("p#SuccessMsgTag").text('');
                $("p#SuccessMsgTag").append(json['msg']);                
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
        }
    });
}

$(document).on('click','.allclose .npf-close',function(e){
    if($('body').hasClass('modal-open-secondry'))
    {
        $('body').removeClass('modal-open-secondry');
    }
   $(this).parents("div.modal").modal('hide'); 
});

