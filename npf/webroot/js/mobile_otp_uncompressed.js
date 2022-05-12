/* 
 * Handle Mobile OTP Related js.
 */

/**
 * define global variable for use time, and clear timer
 * @type String
 */
var timeinterval = [];

/**
 * 
 * @param object elem
 * @returns {Boolean}
 * check onkeyup event if digit 10 then enable verify link
 */

function showOTPVerifyLink(elem,disableElem,key,bypassIntOtp){
    if(typeof key=="undefined" || key==null || key=="undefined"){
        key = '';
    }
    // start typing disable submit button
    $('#'+disableElem).attr('disabled','disabled');
    $('#otpverifylink_a'+key).hide();  /* hide verify link */
    $('#otpverifylink-text'+key).remove(); /* hide "OTP sent"/wait text */
    var number = $(elem).val();
    //console.log(number);
    /* count 10 digit */
    var validNumber = false;
    var max_length  = 10; // for india
    var min_length  = 10; // for india
    var start_chars = ["9","8","7","6","5","4"];
    var interOtpSetting = false;
    if(($('#country_dial_code'+key).length > 0 &&  $.trim($('#country_dial_code'+key).val())!== "+91") || ($('#country_dialcode'+key).length > 0 &&  $.trim($('#country_dialcode'+key).val())!== "+91")){
        max_length  = 16; // other than india
        min_length  = 6; // other than india
        start_chars = ["0","1","2","3","4","5","6","7","8","9"];
        if(parseInt(bypassIntOtp)==1){
            interOtpSetting = true;
            $('#'+disableElem).removeAttr('disabled');
            $(".hideShowOptBypass").hide();
        }
    }
    $(elem).parent().parent().find('.help-block').html('');
    //$('#registerBtn').removeAttr('disabled');

    if(Math.floor(number) == number && $.isNumeric(number) && number.indexOf('.') == -1) {
        // check the length of mobile number and also the start character for India numbers
        if(number.length<=max_length && number.length>=min_length && jQuery.inArray(number.charAt(0), start_chars)>=0){                         validNumber = true;
        }
        if(validNumber && interOtpSetting==false){
            showVerifylink(key);
        }
    }
}

/**
 * call when mobile digit is 10 and user fail to sent otp
 * hide otp part like disable otp and resend link etc
 * @returns none 
 */

function showVerifylink(key){
    if(typeof key=="undefined" || key==null || key=="undefined"){
        key = '';
    }
    $('#otpverifylink-text'+key).remove();
    $('#otpresendlink'+key).hide();
    $('#otpverified'+key).hide();
    $('#otpunverified'+key).hide();
    $('#clockdiv'+key).hide();
    $('#showMObileVerified').hide();
    $('#otpverifylink_a'+key).show();
    $('#otpverifylink'+key).show();
}

/**
 * call when OTP send successfully, it hide verify button and related element
 * @returns {undefined}
 */

function showOTPlink(key){
    if(typeof key=="undefined" || key==null || key=="undefined"){
        key = '';
    }
    
    $('#otpverifylink_a'+key).hide();
    $('#otpverifylink-text'+key).remove();
    $('#otpresendlink'+key).hide();
    // append text on verify link
    $('#otpverifylink'+key).append('<span id="otpverifylink-text'+key+'">OTP Sent</span>');
    $('#otpverifylink-text'+key).css({"color": "#b8b8b8","font-size": "12px;"});
    $('#opt_data'+key).removeAttr('disabled'); // enable opt button
    $('#otpverified'+key).hide();
    $('#otpunverified'+key).hide();
}

/**
 * call after opt is verified, remvoe timer and related element
 * @returns {undefined}
 */
function showAfterVerified(disableElem,key){
    if(typeof key=="undefined" || key==null || key=="undefined"){
        key = '';
    }
    $('#otpresendlink'+key).hide();
    $('#clockdiv'+key).hide();
    $('#otpverifylink_a'+key).hide();
    $('#otpunverified'+key).hide();
    $('#otpverified'+key).show();
    $('#opt_data'+key).attr('readonly',true);
    $('#'+disableElem).removeAttr('disabled');
    sendMobileOTPVerifiedDatalayer();
}

/**
 * call when otp is not verified, enable resent link and diable otp field etc
 * @returns {undefined}
 */
function showAfterUnverified(disableElem, key){
    if(typeof key=="undefined" || key==null || key=="undefined"){
        key = '';
    }
    $('#otpverifylink-text'+key).remove();
    $('#otpverified'+key).hide();
    $('#otpverifylink_a'+key).hide();  
    $('#clockdiv'+key).hide();
    $('#otpunverified'+key).show();
    $('#otpresendlink'+key).show();
    $('#'+disableElem).attr('disabled','disabled');
            
}

/**
 * ajax for send OTP
 * @param int college_id
 * @returns true|false
 */
function sendMobileOTP(college_id,key, module,userId=null,otp_digits=null){
    var emailValiationError = false;
    var emailVal = '';
    var nameVal = '';
    if($('.reg_email_div').length){
        emailVal = $('.reg_email_div input').val();
        if(!$.trim(emailVal)){
            $('.reg_email_div .help-block').text('Enter Email Address *').css({ display: "block", color:"rgb(169, 68, 66)" });
            emailValiationError = true;
        } else if(validateEmail(emailVal) == false){
            $('.reg_email_div .help-block').text('Enter Correct Email Address').css({ display: "block", color:"rgb(169, 68, 66)" });
            emailValiationError = true;
        }
    }
    
    if($('.reg_name_div').length) {
        nameVal = $('.reg_name_div input').val();
    }else if($("#Name").length){
        nameVal = $("#Name").val();
    }
    
    if(emailValiationError) {
        return false;
    }
    
    var mobileId    = 'Mobile';
    if(typeof key=="undefined" || key==null || key=="undefined"){
        key = '';
    }else{
        mobileId    = key;
    }
    if(typeof module=="undefined" || module==null ){
        module = '';
    }
    var opt_digit_count = null;
    if(typeof otp_digits != "undefined" && otp_digits != null && otp_digits != "undefined"){
        opt_digit_count = otp_digits; 
    }

    /* get csrf token form hidden field */
    var marketingPage = (typeof jsVars.marketingPage != "undefined" && jsVars.marketingPage == true ? true : false);
    if(marketingPage === true){
        var csrfToken = $("form#registerForm input[name=\'_csrfToken\']").val();
    }else{
        var csrfToken = $('form input[name=\'_csrfToken\']').val();
    }
    
    $('#otpverifylink-text'+key).remove();
    
    /* hide some field  */
    $("#showMObileVerified").hide();
    $('#otpverifylink_a'+key).hide();
    $('#otpresendlink'+key).hide();
    $('#otpverifylink-text'+key).remove();
    $('#otpverifylink'+key).append('<span id="otpverifylink-text'+ key +'">Wait...</span>');
    $('#otpverifylink-text'+key).css({"color": "#b8b8b8","font-size": "12px;"});
    $('#opt_data'+key).removeAttr('readonly');
    var mobile = $('#'+mobileId).val();
    if($("#country_dial_code"+key).length && $("#country_dial_code"+key).val().length){
        mobile  =  $("#country_dial_code"+key).val()+"-"+mobile;
    } else if($("#country_dialcode"+key).length && $("#country_dialcode"+key).val().length){
        mobile  =  $("#country_dialcode"+key).val()+"-"+mobile;
    }
    $.ajax({
        url: (typeof jsVars.marketingPage != "undefined" && jsVars.marketingPage == true ? jsVars.FULL_URL : "") + '/students/sent-mobile-otp',
        type: 'post',
        dataType: 'json',
        async: false,
        data:{'mobile':mobile,'college_id':college_id,'module':module, email: emailVal, name:nameVal, userId:userId,opt_digit_count:opt_digit_count,'marketingPage':marketingPage},
        headers: {'X-CSRF-TOKEN': csrfToken},
        success: function (json) {
            if (json['redirect'])
            {
                location = json['redirect'];
            }
            if(json['error']){
                showVerifylink(key);
                if(json['error']=='limit'){ /* when user's 100 changes is cross then hide link */
                    $('#otpverifylink_a'+key).hide();
                    $('#otpresendlink'+key).hide();
                }
                if(typeof json['email'] != 'undefined'){
                    $('.reg_email_div .help-block').text(json['email']).css({ display: "block", color:"rgb(169, 68, 66)" });
                }
            }else if(json['success']==200){
                showOTPlink(key); /* after success show OTP Fields */
                countdownStart(key); /* 30 seconds timer start */
                $('#opt_data'+key).val('');
                //$('#opt_data'+key).attr('disabled','disabled');
                $('.hideShowOptBypass').show();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
    return false;
}



function sendMobileOTPForEmailChange(college_id,key,otptype) {
    
    var mobileId    = 'Mobile';
    if(typeof key=="undefined" || key==null || key=="undefined"){
        key = '';
    }else{
        mobileId    = key;
    }
    var csrfToken = $('form input[name=\'_csrfToken\']').val();
    var uuid = $("#uuid").val();
    var mobile = $('#'+mobileId).val();
    $.ajax({
        url: '/students/sent-mobile-otp-change-email',
        type: 'post',
        dataType: 'json',
        data:{'uuid':uuid,'college_id':college_id,'mobile':mobile},
        headers: {'X-CSRF-TOKEN': csrfToken},
        success: function (json) {
            if(json['error']){
                if(json['error']=='limit'){ /* when user's 100 changes is cross then hide link */
                    $("#notSentError").html('you have try too many times.');
                }
            }else if(json['success']==200){
                $('#otpverifylink_aMobile').hide();
                $('#VerifyOtpEmailChange').attr('disabled', false);
                $("#otpresendlink"+key).show();
                if(typeof otptype != 'undefined' && otptype =='resend') {
                    $("#otpresendlink"+key).html('');
                } else {
                    $('#otpverifylinkMobile').append('<span id="otpverifylink-text'+key+'">OTP Sent</span>');
                }
            } else {
                $("#notSentError").html('Invalid Request.');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function verifyMobileOtpForEmailChange(college_id,disableElem,key) {
    var mobileId    = 'Mobile';
    if(typeof key=="undefined" || key==null || key=="undefined"){
        key = '';
    }else{
        mobileId    = key;
    }
    var csrfToken = $('form input[name=\'_csrfToken\']').val();
    var uuid = $("#uuid").val();
    var mobile = $('#'+mobileId).val();
    var otp_value   = $('#opt_data'+key).val();
    $.ajax({
        url: '/students/verify-mobile-otp-for-change-email',
        type: 'post',
        dataType: 'json',
        data:{'otp_value':otp_value,'mobile':mobile,'college_id':college_id, 'uuid': uuid},
        headers: {'X-CSRF-TOKEN': csrfToken},
        success: function (json) {
            $('div#profile-page div.loader-block').hide();
            if(json['status']==1){
                window.location = jsVars.postUrl;
            }else{
                if(typeof json['error'] != 'undefined'){
                    $("#notVerified").html(json['error']);
                } else {
                    $("#notVerified").html('Invalid Request');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div#profile-page div.loader-block').hide();
        }
    });
}
/**
 * ajax for verifing Mobile OTP
 * @param int college_id
 * @returns TRUE|FALSE
 */
function verifyMobileOTP(college_id,disableElem,key){
    var mobileId    = 'Mobile';
    if(typeof key=="undefined" || key==null || key=="undefined"){
        key = '';
    }else{
        mobileId    = key;
    }
    var otp_value   = $('#opt_data'+key).val();
    var ml          = $('#opt_data'+key).attr('maxLength');
    if(otp_value.toString().length == ml)
    {
        $('div#profile-page div.loader-block').show();
        /* get csrf token form hidden field */
        var marketingPage = (typeof jsVars.marketingPage != "undefined" && jsVars.marketingPage == true ? true : false);
        if(marketingPage === true){
            var csrfToken = $("form#registerForm input[name=\'_csrfToken\']").val();
        }else{
            var csrfToken = $('form input[name=\'_csrfToken\']').val();
        }
        
        var mobile      = $('#'+mobileId).val();
        /* hide otp (un)verified text */
        $('#otpverified'+key).hide();
        $('#otpunverified'+key).hide();
        if($("#country_dial_code"+key).length && $("#country_dial_code"+key).val().length){
            mobile  =  $("#country_dial_code"+key).val()+"-"+mobile;
        }
        
        $.ajax({
            url: (typeof jsVars.marketingPage != "undefined" && jsVars.marketingPage == true ? jsVars.FULL_URL : "") + '/students/verify-mobile-otp',
            type: 'post',
            dataType: 'json',
            data:{'otp_value':otp_value,'mobile':mobile,'college_id':college_id,'marketingPage':marketingPage},
            headers: {'X-CSRF-TOKEN': csrfToken},
            success: function (json) {
                $('div#profile-page div.loader-block').hide();
                if(json['status']==1){
                    
                    /**
                     * if verified, hide resent otp, timer, clear timer
                     */
                    if(typeof timeinterval[key] !='undefined'){
                        clearInterval(timeinterval[key]);
                    }
                    if(typeof updateLeadMobile !='undefined'){
                        updateLeadMobile(json['verified_number']);
                    }
                    showAfterVerified(disableElem,key);
                    if($('#showMObileVerified').length > 0) {
                        $('#showMObileVerified').show();
                        $('#otpverifylinkMobile').hide();
                    }
                }else{
                    showAfterUnverified(disableElem,key);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div#profile-page div.loader-block').hide();
            }
        });
    }
    else
    {
        $('#otpverified'+key).hide();
    }
}

/**
 * user for calculate time from current time
 * @param object endtime
 * @returns json object
 * 
 */
function getTimeRemaining(endtime){
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor( (t/1000) % 60 );
  var minutes = Math.floor( (t/1000/60) % 60 );
  var hours = Math.floor( (t/(1000*60*60)) % 24 );
  var days = Math.floor( t/(1000*60*60*24) );
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}


/**
 * use for count 30 sec timer 
 * @param string id
 * @returns {undefined}
 */
function resentOTPLink(id,key){
    if(typeof key=="undefined" || key==null || key=="undefined"){
        key = '';
    }

    // if timer already running and again req sent then clear previous timer
    if(typeof timeinterval[[key]] !='undefined'){
        clearInterval(timeinterval[key]);
    }

  var endtime =  new Date();
  endtime.setSeconds(endtime.getSeconds() + 30);

  var clock = document.getElementById(id+key);
  timeinterval[key] = setInterval(function(){
    var t = getTimeRemaining(endtime);
    clock.innerHTML = t.seconds+' seconds';
    if(t.total<=0){
      clearInterval(timeinterval[key]);
      $('#otpresendlink'+key).show();
      $('#clockdiv'+key).hide();
    }
  },1000);
}

/**
 * call for display timer
 * @returns {undefined}
 */
function countdownStart(key){
    if(typeof key=="undefined" || key==null || key=="undefined"){
        key = '';
    }
    $('#clockdiv'+key).show();
    var clock = $('#clockdiv'+key);
    clock.html('30 seconds'); /* initial display 30 seconds */
    resentOTPLink('clockdiv',key); /* call 30 secs timer */
}


function resentforGetOTPLink(id,key){
    if(typeof key=="undefined" || key==null || key=="undefined"){
        key = '';
    }

    // if timer already running and again req sent then clear previous timer
    if(typeof timeinterval[[key]] !='undefined'){
        clearInterval(timeinterval[key]);
    }

  var endtime =  new Date();
  endtime.setSeconds(endtime.getSeconds() + 30);

  var clock = document.getElementById(id+key);
  timeinterval[key] = setInterval(function(){
    var t = getTimeRemaining(endtime);
    clock.innerHTML = t.seconds+' seconds';
    if(t.total<=0){
      clearInterval(timeinterval[key]);
      $('#resent').show();
      $('#clockdivForget').hide();
    }
  },1000);
}

/**
 * call for display timer
 * @returns {undefined}
 */
function countdownStartFOrget(key){
    $('#clockdivForget').show();
    var clock = $('#clockdivForget');
    clock.html('30 seconds'); /* initial display 30 seconds */
    resentforGetOTPLink('clockdivForget',key); /* call 30 secs timer */
}

$('#loginOtpForm label.control-label').remove();
$('#loginOtpForm input').each(function () {
    var id = $(this).attr('id');
    var placeholder = id;
    if(id=='otpField' && jsVars.enableMobileOTPLogin ===1 && jsVars.enableEMailOTPLLogin ===1){
        placeholder = 'Enter Mobile No./Email ID';
    } else if(id=='otpField' && jsVars.enableMobileOTPLogin ===1) {
        placeholder = 'Enter Mobile No';
    } else if(id=='otpField' && jsVars.enableEMailOTPLLogin ===1) {
        placeholder = 'Enter Email ID';
    }
    else if(id=='otpValue') {
        placeholder = 'Enter OTP';
    }
   
    $(this).attr('placeholder',  placeholder + ' * ');
    if(id=='filter_dial_codeMobile_otp') {
        $(this).attr('placeholder',  '');
    }
    if(typeof id !== 'undefined' && id.search('digit-') !== -1) {
        //placeholder = id.substr(6);
        $(this).attr('placeholder',  '');
    }
});

var otpTimer;
var otpFieldVal = '';
$(document).on('click', '#loginViaOtp', loginViaOtpFunctionality);
function loginViaOtpFunctionality() {
    $('#LoginTabContainer').hide();
    $('#login_form_without_popup').hide();
    $('#LoginWithOtpTabContainer').fadeIn();
    $("#otpField").val('');
    $("#mobileOtpDialCode").hide();
    $("#helpInstruction").hide();
    defaultLoginOtpForm();
}
$(document).on('click', '#registerTab', redirectToRegisterTab);
function redirectToRegisterTab() {
    $('.nav-tabs a[href="#cfregister"]').tab('show');
    $('.nav-tabs a[href="#tab1default"]').tab('show');
    $("#cfregister").addClass('active in');
    $("#tab1default").addClass('active in');
    $("#cflogin").removeClass('active in');
    $("#tab2default").removeClass('active in');
    //$("#otpField").removeClass('withCountrycode');
    $('#LoginTabContainer').show();
    $('#login_form_without_popup').show();
    $('#LoginWithOtpTabContainer').hide();
    $("#otpField").val('');
    $("#mobileOtpDialCode").css('display', 'table-cell');
    $("#helpInstruction").hide();
    defaultLoginOtpForm();
}
$(document).on('keyup', '#otpField', showHideCountryCode);

function showHideCountryCode() {
    var otpInput=$(this).val();
    if($.isNumeric(otpInput) && jsVars.enableMobileOTPLogin ===1) {
        //$("#otpField").addClass('withCountrycode');
        $("#mobileOtpDialCode").css('display', 'table-cell');
        $("#helpInstruction").show();
    } else {
        //$("#otpField").removeClass('withCountrycode');
        $("#mobileOtpDialCode").hide();
        $("#helpInstruction").hide();
    }
    if (otpInput !== otpFieldVal) {
        otpFieldVal = otpInput;
        defaultLoginOtpForm();
    }
}
if($('[data-toggle="tooltip"]').length){
    $('[data-toggle="tooltip"]').tooltip();
}

$(document).on('change', '#otpField', function() {
    var otpInput = $.trim($("input[name=otpField]").val());
    if (otpInput !== otpFieldVal) {
        defaultLoginOtpForm();
    }
});
function defaultLoginOtpForm(){
    var otpInput = $.trim($("input[name=otpField]").val());
    clearInterval(otpTimer);
    if(otpInput !== '') {
        $("#getOtpBtn").show();
    } else {
        $("#getOtpBtn").hide();
        $("#mobileOtpDialCode").css('display', 'table-cell');
    }
    $("#otpValue").val('');
    $("#getOtpBtnWait").attr('id','getOtpBtn');
    $("#getOtpBtn").html('Get OTP');
    //$("#otpValue").attr('disabled', true);
    $("#otpMsgBlock").html('');
    $("#otpTimer").html('');
    var parentDiv = $("form#loginOtpForm #otpField").parents('div.form-group');
    $(parentDiv).removeClass('has-error');
    $(parentDiv).find("span.help-block").text('');
   
    var parentDiv = $("form#loginOtpForm #otpValue").parents('div.form-group');
    $(parentDiv).removeClass('has-error');
    $(parentDiv).find("span.help-block").text('');
   
    $("#otpSubmitBtn").attr('disabled', true);
    $(".otpValueBox").attr('readonly', true);
    //$("#otpValueBoxMsg").text('');
    $("#otpMsgBlock").css("color", "#000");
    $(".otpValueBox").val('');
    showCountryCodeMsg();
}

$(document).on('click', '.loginViaPassword', function(){
   $('#LoginWithOtpTabContainer').hide();  
   $('#LoginTabContainer').fadeIn();
   $('#login_form_without_popup').fadeIn();
});

$(document).ready(function(){
    showCountryCodeMsg();
});
function showCountryCodeMsg() {
    var contryCodeValue = $("#country_dial_codeMobile_otp").val();
    if(typeof contryCodeValue === 'undefined') {
        return;
    }
    var otpInput=$("#otpField").val();
    if(otpInput === ''){
        $("#mobileOtpDialCode").hide();
    }else if($.isNumeric(otpInput) && jsVars.enableMobileOTPLogin ===1) {
        $("#getOtpBtn").show();
        $("#mobileOtpDialCode").css('display', 'table-cell');
    }
    var parentDiv = $("form#loginOtpForm #otpField").parents('.merge_field_div');
    if(contryCodeValue !== '+91') {
        $(parentDiv).addClass('has-error');
        $(parentDiv).find("span.help-block").text('');
        $(parentDiv).find("span.help-block").append('<span>Login via OTP is available only for India. Please proceed with <a class="loginViaPassword" href="javascript:void(0);">Login via Password</a></span>');
        $("#otpField").attr('disabled', true);
        $("#getOtpBtn").hide();
    } else {
        $(parentDiv).removeClass('has-error');
        $(parentDiv).find("span.help-block").text('');
        $("#otpField").attr('disabled', false);
    }
}
$(document).on("click",".updateOtpDialCode", function(){
    setTimeout(function() {
        showCountryCodeMsg();
    }, 100);
});

$(document).on('click', '#getOtpBtn', function(){
   event.preventDefault();
   
   var parentDiv = $("form#loginOtpForm #otpField").parents('.merge_field_div');
   $(parentDiv).removeClass('has-error');
   $(parentDiv).find("span.help-block").text('');
   
   var otpInput = $.trim($("input[name=otpField]").val());
   //$("#otpValue").attr('disabled', true);
   $(".otpValueBox").attr('readonly', true);
   $(".otpValueBox").val('');
   var isValid = false;
   var mobile= '';
   var email='';
   if($.isNumeric((otpInput)) && otpInput.length !== 10) {
       $(parentDiv).addClass('has-error');
       $(parentDiv).find("span.help-block").text('');
       $(parentDiv).find("span.help-block").append('Please enter the correct mobile number');
   }else if($.isNumeric((otpInput)) && otpInput.length === 10) {
       isValid = true;
       mobile=otpInput;
       $("#inputField").val('mobile');
   } else if(!$.isNumeric((otpInput))) {
       var emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
       if(!emailRegex.test(otpInput)) {
           $(parentDiv).addClass('has-error');
           $(parentDiv).find("span.help-block").text('');
           $(parentDiv).find("span.help-block").append('Invalid Email');
       } else {
            isValid = true;
            email = otpInput;
            $("#inputField").val('email');
       }
   }
    var csrfToken = jsVars.csrfToken;
    if(jsVars.csrfToken=='' || jsVars.csrfToken==null){
       csrfToken = $('form input[name=\'_csrfToken\']').val();
    }
   if(isValid === true) {
        var inputField = $("#inputField").val();
        var collegeId = $("#collegeId").val();
        clearInterval(otpTimer);
        otpFieldVal = otpInput;
        $.ajax({
                url: '/students/validate-and-send-otp',
                type: 'post',
                dataType: 'json',
                async: false,
                data:  {'email':email, 'mobile':mobile, 'inputField':inputField, 'collegeId':collegeId},
                headers: {'X-CSRF-TOKEN': csrfToken},
                beforeSend: function(){
                    $("#getOtpBtn").html('wait');  
                },
                success: function (data) {
                    if (data['status'] ===0 && typeof data['message'] !== 'undefined') {
                        if (typeof data['limitValidity'] !== 'undefined' && data['limitValidity'] ===1) {
                            $("#otpMsgBlock").css("color", "#f54242");
                            $("#otpMsgBlock").html(data['message']);
                            $('#otpTimer').html("");
                            $("#getOtpBtn").html('Get OTP');
                        } else {
                            $(parentDiv).addClass('has-error');
                            $(parentDiv).find("span.help-block").text('');
                            if (typeof data['redirectRegister'] !== 'undefined' && data['redirectRegister'] ===1) {
                                data['message'] += ' <span><a id="registerTab" href="javascript:void(0);">Click Here</a></span> to Register';
                            }
                            $(parentDiv).find("span.help-block").append(data['message']);
                            $("#getOtpBtn").html('Get OTP');
                        }
                    }        
                    if (typeof data['status'] !== 'undefined' && data['status'] ===1) {
                        $("#getOtpBtn").html('OTP Sent');
                        $("#getOtpBtn").attr('id','getOtpBtnWait');
                        $(".otpValueBox").attr('readonly', true);
                        $(".otpValueBox").val('');
                        $(".otpValueBox").first().attr('readonly', false);
                        $(".otpValueBox").first().focus();
                        //$("#otpSubmitBtn").attr('disabled', false);
                        $("#otpMsgBlock").html('<span id="otpMsgSpan">Resend OTP </span>');
                        timerForOtp();
                    }      
            },
            error: function (xhr, ajaxOptions, thrownError) {            
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
   }
});

function timerForOtp() {
    var counter = 30;
    $('#otpTimer').text('in '+counter+' Secs');
    otpTimer = setInterval(function() {
        counter--;
        if (counter <= 0) {
            clearInterval(otpTimer);
            $("#otpMsgBlock").css("color", "#000");
            $("#otpMsgBlock").html('Did not receive OTP? ');
            $('#otpTimer').html("<a href='javascript:void(0);' id='resendLoginOtp'>Resend OTP</a>");  
            return;
        }else{
            $('#otpTimer').text('in '+counter+' Secs');
        }
    }, 1000);
}

$(document).on('click', '#resendLoginOtp', function(){
    $("#otpMsgBlock").html('');
    var otpInput = $.trim($("input[name=otpField]").val());
    var isValid = false;
    var mobile= '';
    var email='';
    if($.isNumeric((otpInput)) && otpInput.length === 10) {
        isValid = true;
        mobile=otpInput;
    } else if(!$.isNumeric((otpInput))) {
        var emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
        if(emailRegex.test(otpInput)) {
            isValid = true;
            email = otpInput;
        }
    }
    var csrfToken = jsVars.csrfToken;
    if(jsVars.csrfToken=='' || jsVars.csrfToken==null){
       csrfToken = $('form input[name=\'_csrfToken\']').val();
    }
    if(isValid === true) {
        var inputField = $("#inputField").val();
        var collegeId = $("#collegeId").val();
        $.ajax({
                url: '/students/validate-and-send-otp',
                type: 'post',
                dataType: 'json',
                async: false,
                data:  {'email':email, 'mobile':mobile, 'inputField':inputField, 'collegeId':collegeId},
                headers: {'X-CSRF-TOKEN': csrfToken},
                success: function (data) {
                    if (data['status'] ===0 && typeof data['message'] !== 'undefined') {
                        if (typeof data['limitValidity'] !== 'undefined' && data['limitValidity'] ===1) {
                            $("#otpMsgBlock").css("color", "#f54242");
                            $("#otpMsgBlock").html(data['message']);
                            $('#otpTimer').html("");
                        } else {
                            var parentDiv = $("form#loginOtpForm #otpField").parents('div.form-group');
                            $(parentDiv).addClass('has-error');
                            $(parentDiv).find("span.help-block").text('');
                            $(parentDiv).find("span.help-block").append(data['message']);
                        }
                    }      
                    if (typeof data['status'] !== 'undefined' && data['status'] ===1) {
                        $("#otpMsgBlock").css("color", "#000");
                        $("#otpMsgBlock").html('Resend OTP ');
                        $(".otpValueBox").attr('readonly', true);
                        $(".otpValueBox").val('');
                        $(".otpValueBox").first().attr('readonly', false);
                        timerForOtp();
                    }      
            },
            error: function (xhr, ajaxOptions, thrownError) {            
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
});

$(document).on('click', '#otpSubmitBtn', function () {
    var isValid = true;
    $(".otpValueBox").each(function(){
       var otpBoxVal = $.trim($(this).val());
       if(otpBoxVal === '') {
            clearInterval(otpTimer);
            //$("#otpValueBoxMsg").text('Enter valid OTP Value');
            $("#otpMsgBlock").text('Incorrect OTP. ');
            $("#otpMsgBlock").css("color", "#f54242");
            $('#otpTimer').html("<a href='javascript:void(0);' id='resendLoginOtp'>Resend OTP</a>");  
            isValid = false;
            return false;
       }
    });
    if(isValid === true) {
        var _csrfToken = $("form#loginOtpForm input[name='_csrfToken']").val();

        $.ajax({
            url: jsVars.LoginWithOtpUrl,
            type: 'post',
            data: $("form#loginOtpForm").serialize(),
            async: false,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": _csrfToken
            },
            beforeSend: function() {
                    //$('#already-registered div.loader-block,#register-now div.loader-block').show();
            },
            complete: function() {
                    //$('#already-registered div.loader-block,#register-now div.loader-block').hide();
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
                    else if (json['error']['list'])
                    {
                        json['error']['list'] = changesOfFullBannerLayout('loginOtpForm',json['error']['list']);
                        for (var i in json['error']['list'])
                        {
                            var id=i;
                            if(i=='Email'){
                                id = 'otpField';
                                var parentDiv = $("form#loginOtpForm #" + id).parents('div.form-group');
                                $(parentDiv).addClass('has-error');
                                $(parentDiv).find("span.help-block").text('');
                                $(parentDiv).find("span.help-block").append(json['error']['list'][i]);
                            }
                            if(i=='OtpValue'){
                                if(typeof json['error']['list'][i] !== 'undefined'){
                                    //$("#otpValueBoxMsg").text(json['error']['list'][i]);
                                    $("#otpMsgBlock").text(json['error']['list'][i]+' ');
                                    $("#otpMsgBlock").css("color", "#f54242");
                                } else {
                                    //$("#otpValueBoxMsg").text('Enter valid OTP Value');
                                    $("#otpMsgBlock").text('Incorrect OTP. ');
                                    $("#otpMsgBlock").css("color", "#f54242");
                                }
                                clearInterval(otpTimer);
                                $('#otpTimer').html("<a href='javascript:void(0);' id='resendLoginOtp'>Resend OTP</a>");  
                            }
                        }
                    }
                }
                else if (json['success'] == 200)
                {
                    //Push data in Datalayer for LPU
                    pushLoginWithOTPinDatalayer();
                    location = json['location'];
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
});

$('.digit-group').find('input').each(function() {
    $(this).attr('maxlength', 1);
    $(this).on('keyup touchend', function(e) {
        var keyCode = e.which;
        if(keyCode === 229) {
            var str = this.value.toUpperCase();
            var charCode = str.charCodeAt(str.length-1);
            keyCode = charCode;
        }
        var parent = $($(this).parent());
        if(keyCode === 8 || keyCode === 37) {
            var prev = parent.find('input#' + $(this).data('previous'));
            $(this).attr('readonly', true);
            $(".otpValueBox").first().attr('readonly', false);
            if(prev.length) {
                $(prev).select();
            }
        } else if((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 96 && keyCode <= 105) || keyCode === 39) {
            var otpBoxVal = $(this).val();
            if(otpBoxVal === '') {
                return;
            }
            var next = parent.find('input#' + $(this).data('next'));
            $(next).attr('readonly', false);
            if(next.length) {
                $(next).select();
            } else {
                if(parent.data('autosubmit')) {
                    parent.submit();
                }
            }
        }
        disableLoginSubmitBtn();
    });
});

function disableLoginSubmitBtn() {
    var validOtpVal = true;
    $(".otpValueBox").each(function(){
       var otpBoxVal = $.trim($(this).val());
       if(otpBoxVal === '') {
            validOtpVal = false;
       }
    });
    if(validOtpVal === true) {
        $("#otpSubmitBtn").attr('disabled', false);
    } else {
        $("#otpSubmitBtn").attr('disabled', true);
    }
}

var sendFbLoginData = 0;
var sendFbSignupData = 0;
var sendGoogleLoginData = 0;
var sendGoogleSignupData = 0;
var sendLoginWithOtpData = 0;
var sendMobileOTPVerifiedData = 0;
var sendSaveAndContinueData = 0;
var sendMobileVerifyClickData = 0;

$(document).on('click', '.fbLogin', function() {
    var htmlText = $(this).html();
    var signup = htmlText.search(/sign/i);
    var login = htmlText.search(/login/i);
    if(signup !== -1) {
        signup = 1;
    } 
    if(login !== -1){
        login = 1;
    }
    var collegeId = $("#collegeId").val();
    if(collegeId == 524 && sendFbLoginData === 0 && login === 1) {
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
          'event': 'Login',
          'category': 'Login',
          'action': 'Submit',
          'label': 'Login with Facebook'
        });
        sendFbLoginData = 1;
    }
    if(collegeId == 524 && sendFbSignupData === 0 && signup === 1) {
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
          'event': 'New User Registration',
          'category': 'New User Registration',
          'action': 'Submit',
          'label': 'Register with Facebook'
        });
        sendFbSignupData = 1;
    }
});

$(document).on('click', '.gpLogin', function() {
    var htmlText = $(this).html();
    var signup = htmlText.search(/sign/i);
    var login = htmlText.search(/login/i);
    if(signup !== -1) {
        signup = 1;
    } 
    if(login !== -1){
        login = 1;
    }
    var collegeId = $("#collegeId").val();
    if(collegeId == 524 && sendGoogleLoginData === 0 && login === 1) {
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
          'event': 'Login',
          'category': 'Login',
          'action': 'Submit',
          'label': 'Login with Google'
        });
        sendGoogleLoginData = 1;
    }
    if(collegeId == 524 && sendGoogleSignupData === 0 && signup === 1) {
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
          'event': 'New User Registration',
          'category': 'New User Registration',
          'action': 'Submit',
          'label': 'Register with Google'
        });
        sendGoogleSignupData = 1;
    }
});

function pushLoginWithOTPinDatalayer() {
    var collegeId = $("#collegeId").val();
    if(collegeId == 524 && sendLoginWithOtpData === 0) {
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
          'event': 'Login',
          'category': 'Login',
          'action': 'Submit',
          'label': 'Login with OTP'
        });
        sendLoginWithOtpData = 1;
    }
}

function sendMobileOTPVerifiedDatalayer() {
    var collegeId = $("#collegeId").val();
    if(collegeId == 524 && sendMobileOTPVerifiedData === 0) {
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
          'event': 'Profile',
          'category': 'Application - Profile | Mobile Verify',
          'action': 'Submit',
          'label': 'OTP Verified'
        });
        sendMobileOTPVerifiedData = 1;
    }
}

$(document).on('click', '#SaveProfileBtn', function() {
    var collegeId = $("#collegeId").val();
    if(collegeId == 524 && sendSaveAndContinueData === 0) {
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
          'event': 'Profile',
          'category': 'Application - Profile',
          'action': 'Submit',
          'label': 'Save & Continue'
        });
        sendSaveAndContinueData = 1;
    }
});

$(document).on('click', '#otpverifylink_aMobile', function() {
    var collegeId = $("#collegeId").val();
    if(collegeId == 524 && sendMobileVerifyClickData === 0) {
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
          'event': 'Profile',
          'category': 'Application - Profile | Mobile Verify',
          'action': 'Submit',
          'label': 'Verify Mobile'
        });
        sendMobileVerifyClickData = 1;
    }
});

