$(function () {
    if($(".sumo-select").length){
        $(".sumo-select").SumoSelect({search: true, placeholder:$(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText:$(this).data('placeholder'), triggerChangeCombined: true });
    }

});

function editProfile(){
    $(".profile_input").removeAttr('disabled');
    $("#SaveProfileBtn").show();
    $("#showEmailVerifyBtn").show();
    $("#cancelProfileEditBtn").show();
    $("#editProfileBtn").hide();
    $(".profile_input.sumo-select").each(function(){
        $(this)[0].sumo.enable();    
    });
}

function cancelEditProfile(){
    location.reload();
    return;
    $(".profile_input").attr('disabled',true);
    $("#showEmailVerifyBtn").hide();
    $("#SaveProfileBtn").hide();
    $("#cancelProfileEditBtn").hide();
    $("#editProfileBtn").show();
    $(".profile_input.sumo-select").each(function(){
        $(this)[0].sumo.disable();    
    });
}

function saveProfileData(form){
    $("span.help-block").text('');
    if(runConditionalJs()){
        return false;
    }
//    if( $('span#mobileError').length>0 ){
//        $("span#mobileError").text('');
//        $("span#mobileError").hide();
//    }
    $.ajax({
        url: jsVars.SaveProfileUrl,
        type: 'post',
        data: new FormData($(form)[0]),
        dataType: 'json',
        processData: false,
        contentType: false,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
        	$('div.newLoader').show();
	},
        complete: function() {
		$('div.newLoader').hide();
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
                        if(i=='Email' && $('#showEmailVerifyBtn').length>0){
                            $('#showEmailVerifyBtn').hide();
                        }
                        if(i=='Mobile' && $('span#mobileError').length>0 && $.trim($("span#mobileError").html())==""){
                            $("span#mobileError").append(json['error'][i]);
                            $("span#mobileError").show();
                            $("span#mobileError").addClass('has-error');
                        }
                        $('#showEmailVerified').hide();
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
                if(json['social_login']){
                    alertPopup(json['social_login']+' '+json['email'],'success');
                    return;
                }
                if(json['location']){
                    location = json['location'];
                }else{
                    if(json['msg']!==''){
                        alertPopup(json['msg'],'success');
                    }
                    cancelEditProfile();
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

function resendMail()
{
    $.ajax({
        url: jsVars.ResendMailUrl,
        type: 'post',
        data: {action:'mail',newEmail:$('#Email').val()},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
            $('div.newLoader').show();
            $('#SaveProfileBtn').prop('disabled',true);
	},
        complete: function() {
            $('div.newLoader').hide();
            $('#SaveProfileBtn').prop('disabled',false);
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
//                alertPopup(json['msg'],'success','\logout');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
        }
    });
}

var otpVerifyAttribute = $("#otpverifylink_aMobile").attr("onclick");

$(".checkMobileExist").on("change", function()
{
    let leadMobile = $(".leadMobile").val();
    let changedMobile = $(".checkMobileExist").val();
    if(leadMobile != changedMobile && changedMobile != '')
    {
        $("#mobileUpdated").attr("data-restrict", 1);
        email = "";
        var collegeId = $('#collegeId').val();
        $.ajax({
            url: '/common/check-mobile-exist',
            type: 'post',
            dataType: 'json',
            async: false,
            data: {
                mobile: $.trim(changedMobile),
                email: $.trim(email),
                collegeId: collegeId,
                uploadVia: "email"
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            beforeSend: function() {
                $('div.newLoader').show();
            },
            complete: function() {
                $('div.newLoader').hide();
            },
            success: function (response) {
                if (typeof response['data'] !== 'undefined' && response['data'] != '') {
                    $("span#mobileError").parents('div.form-group').addClass("has-error");
                    $("span#mobileError").text('');
                    $("span#mobileError").append("Mobile already exists. Kindly use a different mobile number");
                    $("span#mobileError").show();
                    
                    $('#SaveProfileBtn').prop('disabled',true);
                    $('#otpverifylink_aMobile').removeAttr('onclick');
                    $("#mobileUpdated").attr("data-restrict", 0);
                } else {
                    $("span#mobileError").parents('div.form-group').removeClass("has-error");
                    $("span#mobileError").text('');
                    $("span#mobileError").hide();
                    $('#SaveProfileBtn').prop('disabled',false);
                    $('#otpverifylink_aMobile').attr('onclick', otpVerifyAttribute);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
});

function sendEmailVerificationMail(leadEmail = '')
{
    // TO AVOID POPUP ON SAVE
    $("#emailUpdated").attr("data-restrict", 0);
    leadEmail = (leadEmail != '') ? leadEmail : $("#Email").val();
    if(leadEmail == '')
    {
        alertPopup("Email can't be blank", 'error');
        return false;
    }
    
    var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/igm;
    if (!re.test(leadEmail)) {
        alertPopup("Invalid email entered", 'error');
        return false;
    }
    if(jsVars.uniqueEmailRegister == 0)
    {
        let uniqueEmailError = false;
        var collegeId = $('#collegeId').val();
        let mobile = "";
            $.ajax({
                url: '/common/check-email-exist',
                type: 'post',
                dataType: 'json',
                async: false,
                data: {
                    mobile: $.trim(mobile),
                    email: $.trim(leadEmail),
                    collegeId: collegeId,
                    uploadVia: "email",
                    excludeCurrentUser:1
                },
                headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                complete: function(){
                    $("#emailUpdated").attr("data-restrict", 0);
                },
                success: function (response) {
                    if (typeof response['data'] !== 'undefined' && response['data'] != '') {
                        uniqueEmailError = true;
                    } else {
                        uniqueEmailError = false;
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });

        if(uniqueEmailError)
        {
            alertPopup("Email already exists. Kindly use a different email.", 'error');
            return false;
        }
    }
    
    $.ajax({
        url: '/send-verification-mail',
        type: 'post',
        dataType: 'json',
        beforeSend: function () {
            $('div.newLoader').show();
            $('#emailverifylink').attr('disabled', 'disabled').html('Please wait..&nbsp;<i class="fa fa-spinner fa-spin"></i>');
        },
        complete: function () {
            $('div.newLoader').hide();
            $('#emailverifylink').removeAttr('disabled').html('Send Verification Email');
            $("#emailUpdated").attr("data-restrict", 0);
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        data: {
            email: leadEmail
        },
        success: function (json) 
        {
            if (json['redirect'])
            {
                location = json['redirect'];
            }else if(typeof json['error'] !== 'undefined' && json['error'] != '')
            {
//                alertPopup(json['error'],'error');
                $("span.email-help-block").parent().addClass('has-error');
                $(document).find("span.email-help-block").text('');
                $(document).find("span.email-help-block").text(json['error']);
                
            }else if(typeof json['email_sent'] !== 'undefined' && json['email_sent'] != '')
            {
                alertPopup(json['message'],'success');
            }else
            {
//                alertPopup("Something went wrong. Please try again",'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function showEmailVerifyLink()
{
    $("#showEmailVerified").hide();
    $("#emailverifylink").show();
}

function updateLeadMobile(numberToUpdate)
{
    let requestRunning = $("#mobileUpdated").attr("data-requestrunning");
    if(requestRunning == 1)
    {
        return false;
    }
    
    let leadId = $(".leadId").val();
    let numberBreak = numberToUpdate.split("-");
    let leadMobile, countryDialCode;

    if(numberBreak.length > 1)
    {
        countryDialCode = numberBreak[0];
        leadMobile = numberBreak[1];
    }else{
        countryDialCode = $("#country_dialcodeMobile").val();
        leadMobile = numberBreak[0];
    }

    var collegeId = $('#collegeId').val();
    $.ajax({
        url: '/update-lead-mobile',
        type: 'post',
        dataType: 'json',
        async: false,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
            $('div.newLoader').show();
            $("#mobileUpdated").attr("data-requestrunning", 1);
        },
        complete: function() {
            $('div.newLoader').hide();
            $("#mobileUpdated").attr("data-requestrunning", 0);
        },
        data: {
            userId: leadId,
            mobile: leadMobile,
            countryDialCode: countryDialCode,
            collegeId: collegeId
        },
        success: function (json) 
        {
            if (json['redirect'])
            {
                location = json['redirect'];
            }else if(typeof json['error'] !== 'undefined' && json['error'] != '')
            {
                alertPopup(json['error'],'error');
            }else
            {
                alertPopup("Mobile number has been successfully verified",'success');
                $("#Mobile").val(leadMobile);
                $("#mobileDialCode").val(countryDialCode);
                $("span#mobileError").text('');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$("#Email").on("input", function()
{
    let leadEmail = $("#leadEmail").data('value');
    let leadEmailStatus = $("#leadEmail").data('verified');
    $("#emailUpdated").attr("data-restrict", 1);
    $("#SaveProfileBtn").attr("onclick", "checkEmailMobileUpdated(this);");
    let enteredEmail = $(this).val();
    if(leadEmail !== '')
    {
        if(enteredEmail == '')
        {
            $('#emailverifylinkSpan a#emailverifylink, #showEmailVerified').hide();
            return false;
        }
        if(enteredEmail == leadEmail && leadEmailStatus == 1)
        {
            $('#emailverifylinkSpan a#emailverifylink').hide();
            $('#showEmailVerified').show();
        }else{
            $('#showEmailVerified').hide();
            $('#emailverifylinkSpan a#emailverifylink').show();
            showEmailVerifyLink();
        }
    }
});

$("#Mobile").on("input", function()
{
    $(this).removeAttr("onkeydown");
    let leadMobile = $(".leadMobile").val();
    let leadMobileStatus = $(".leadMobile").data('verified');
    let enteredMobile = $(this).val();
    $("#mobileUpdated").attr("data-restrict", 1);
    $("#SaveProfileBtn").attr("onclick", "checkEmailMobileUpdated(this);");
    if(enteredMobile == '')
    {
        $('#otpverifylinkMobile a#otpverifylink_aMobile, #showMObileVerified').hide();
        return false;
    }
    if(enteredMobile == leadMobile && leadMobileStatus == 1)
    {
        $('#otpverifylinkMobile a#otpverifylink_aMobile').hide();
        $('#showMObileVerified').show();
    }else{
        $('#showMObileVerified').hide();
        let onKeyDownMobile = $(this).data('onkeydown');
        $(this).attr('onkeydown', onKeyDownMobile);
        $(this).keydown();
    }
});

function checkEmailMobileUpdated(elem)
{
    let email = $("#Email").val();
    let mobile = $("#Mobile").val();
    let leadEmail = $("#leadEmail").attr("data-value");
    let leadMobile = $(".leadMobile").val();
    let checkEmailUpdated = $("#emailUpdated").attr("data-restrict");
    var blockLevel = 0;
    let html = '';
    
    if(email == '')
    {
        alertPopup("Email can't be empty.", "error");
        return false;
    }
    
    var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/igm;
    if (!re.test(email)) {
        alertPopup("Invalid email entered", 'error');
        return false;
    }
    
    if(mobile == '')
    {
        alertPopup("Mobile can't be empty.", "error");
        return false;
    }
    
    if(checkEmailUpdated == 1 && leadEmail != '' && leadEmail != email)
    {
        blockLevel = 1;
    }
    let checkMobileUpdated = $("#mobileUpdated").attr("data-restrict");
    if(checkMobileUpdated == 1 && leadMobile != '' && leadMobile != mobile)
    {
        let mobileLimit = 0;
        let countryDialCode = '';

        if($('#country_dialcodeMobile').length)
        {
            countryDialCode = $('#country_dial_codeMobile').val();
        }

        if(countryDialCode === '' || countryDialCode === "+91")
        {
            mobileLimit = 10;
        }else{
            mobileLimit = 16;
        }

        if(
            ((countryDialCode === '' || countryDialCode === "+91") && mobile.length === mobileLimit) ||
            (countryDialCode !== '' && countryDialCode !== "+91" && mobile.length <= mobileLimit && mobile.length >= 5)
            )
        {
            if(blockLevel === 1)
            {
                blockLevel = 3;
            }else{
                blockLevel = 2;
            }
        }else{
            alertPopup("Please enter valid mobile number.", "error");
            return false;
        }
    }
    
    if(blockLevel === 1)
    {
        html += "You have changed email id but not sent verification mail. Click on <strong>CANCEL</strong> to go back and send verification mail or <strong>SAVE ANYWAY</strong> to proceed without changing email id.";
    }else if(blockLevel === 2)
    {
        html += "You have changed mobile number but not sent OTP. Click on <strong>CANCEL</strong> to go back and send OTP or <strong>SAVE ANYWAY</strong> to proceed without changing mobile number.";
    }else{
        html += "You have changed email id & mobile number but not sent verification email & OTP. Click on <strong>CANCEL</strong> to go back and send verification mail & OTP or <strong>SAVE ANYWAY</strong> to proceed without changing email & mobile number.";
    }
    
    if(blockLevel !==0)
    {
        $('#confirmPopupEmailMobileEditMsgBody').html(html);
        $('#confirmPopupEmailMobileEdit').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmPopupEmailMobileEditYes', function () {
            $('#confirmPopupEmailMobileEdit').modal('hide');
            $("#emailUpdated").attr("data-restrict","0");
            $("#mobileUpdated").attr("data-restrict","0");
            setTimeout(function(){$(elem).trigger("click");}, 500);
            return true;
        })
        .one('click', '#confirmPopupEmailMobileEditNo', function () {
            $('#confirmPopupEmailMobileEdit').modal('hide');
            
            return false;
        });
        return false;
    }
    
    $(elem).attr("onclick", "saveProfileData(this.form);");
    $(elem).trigger("click");
}

function fieldUpdated(type)
{
    $("#"+type+"Updated").attr("data-restrict", "1");
    $("#SaveProfileBtn").attr("onclick", "checkEmailMobileUpdated(this);");
}

function disableSaveProfile()
{
    $("#SaveProfileBtn").attr("disabled", "disabled");
}

function hideOtpField()
{
    $(".hideShowOptBypass").hide();
}

$(function() {
    $('#Email').on('keypress', function(e) {
        if (e.which == 32){
            return false;
        }
    });
});

function removeSpacesfromEmail(string) {
    return string.split(' ').join('');
}

function deleteUploadRegFile(userId,fileId,collegeId,fieldName,id){
    $('#ConfirmMsgBody').html("Are you sure you want to delete this file?");
    
    $('#confirmYes').unbind('click');
    
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false});
    $('#ConfirmPopupArea').addClass('cmodal-sm')
    $('#confirmYes').click(function (e) {
        if(userId)
        {   
            $.ajax({
                url: jsVars.FULL_URL+'/deleteRegFile',
                type: 'post',
                data: {userId:userId,fileId:fileId,collegeId:collegeId,fieldName:fieldName},
                dataType: 'json',
                headers: {
                    "X-CSRF-Token": jsVars._csrfToken
                },
                beforeSend: function() {                    
                        //$('div.loader-block-a').show();
                },
                complete: function() {
                        //$('div.loader-block-a').hide();
                },
                success: function (data) 
                {
                    if(data['status']){
                        $('#'+fieldName+'_'+fileId).closest('li').remove()
                    }else{
                        if(data['message'])
                        {
                            alertPopup(data['message'],'error');
                        }
                    }

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    $('div.loader-block-a').hide();
                }
            });
            $('#ConfirmPopupArea').modal('hide');
        }
    });
}


function resetInputFile(el){
    var fieldId = $(el).data("id")
    $('#'+fieldId).val('')
    $('#'+fieldId+'_choose_files').val('')
}

//stop play video in background
$('.stop-video').click(function(){
     $('video').each(function(){ 
         $(this).get(0).pause(); 
    }) 
});

$(document).keydown(function(e) {
    // Enable esc
    if (e.keyCode == 27) {
	 $('.stop-video').trigger('click');
    }
});

//$('[data-toggle=modal]').on('click', function (e) {
//    $('.newLoader').show()
//    var $target = $($(this).data('target'));
//    $target.data('triggered',true);
//    setTimeout(function() {
//        if ($target.data('triggered')) {
//            $('.newLoader').hide()
//            $target.modal('show')
//                .data('triggered',false); // prevents multiple clicks from reopening
//        };
//    }, 2000); // milliseconds
//    return false;
//});
//


