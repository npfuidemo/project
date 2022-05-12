/* 
 * Handle Mobile OTP Related js.
 */

/**
 * define global variable for use time, and clear timer
 * @type String
 */
var timeinterval = '';

/**
 * 
 * @param object elem
 * @returns {Boolean}
 * check onkeyup event if digit 10 then enable verify link
 */

function showOTPVerifyLink(elem,disableElem){
    // start typing disable submit button
    $('#'+disableElem).attr('disabled','disabled');
    $('#otpverifylink_a').hide();  /* hide verify link */
    $('#otpverifylink-text').remove(); /* hide "OTP sent"/wait text */
    var number = $(elem).val();
    //console.log(number);
    /* count 10 digit */
    var validNumber = false;
    var max_length  = 10; // for india
    var min_length  = 10; // for india
    var start_chars = ["9","8","7","6","5","4"];
    if($('#country_dial_code').length > 0 &&  $.trim($('#country_dial_code').val())!== "+91"){
        max_length  = 16; // other than india
        min_length  = 6; // other than india
        start_chars = ["1","2","3","4","5","6","7","8","9"];
    }
    if(Math.floor(number) == number && $.isNumeric(number) && number.indexOf('.') == -1) {
        // check the length of mobile number and also the start character for India numbers
        if(number.length<=max_length && number.length>=min_length && jQuery.inArray(number.charAt(0), start_chars)>=0){                         validNumber = true;
        }
        if(validNumber){
            showVerifylink();
        }
    }
}

/**
 * call when mobile digit is 10 and user fail to sent otp
 * hide otp part like disable otp and resend link etc
 * @returns none 
 */

function showVerifylink(){
    $('#otpverifylink-text').remove();
    $('#opt_data').val('');
    $('#opt_data').attr('disabled','disabled');
    $('#otpresendlink').hide();
    $('#otpverified').hide();
    $('#otpunverified').hide();
    $('#clockdiv').hide();
    
    $('#otpverifylink_a').show();
}

/**
 * call when OTP send successfully, it hide verify button and related element
 * @returns {undefined}
 */

function showOTPlink(){
    
    $('#otpverifylink_a').hide();
    $('#otpverifylink-text').remove();
    $('#otpresendlink').hide();
    // append text on verify link
    $('#otpverifylink').append('<span id="otpverifylink-text">OTP Sent</span>');
    $('#opt_data').removeAttr('disabled'); // enable opt button
    $('#otpverified').hide();
    $('#otpunverified').hide();
}

/**
 * call after opt is verified, remvoe timer and related element
 * @returns {undefined}
 */
function showAfterVerified(disableElem){
    
    $('#otpresendlink').hide();
    $('#clockdiv').hide();
    $('#otpverifylink_a').hide();
    $('#otpunverified').hide();
    $('#otpverified').show();
    $('#opt_data').attr('readonly',true);
    $('#'+disableElem).removeAttr('disabled');
}

/**
 * call when otp is not verified, enable resent link and diable otp field etc
 * @returns {undefined}
 */
function showAfterUnverified(disableElem){
    $('#otpverifylink-text').remove();
    $('#otpverified').hide();
    $('#otpverifylink_a').hide();  
    $('#clockdiv').hide();
    $('#otpunverified').show();
    $('#otpresendlink').show();
    $('#'+disableElem).attr('disabled','disabled');
            
}

/**
 * ajax for send OTP
 * @param int college_id
 * @returns true|false
 */
function sendMobileOTP(college_id){
    /* get csrf token form hidden field */
    var csrfToken = $('form input[name=\'_csrfToken\']').val();
    
    /* hide some field  */
    $('#otpverifylink_a').hide();
    $('#otpresendlink').hide();
    $('#otpverifylink-text').remove();
    $('#otpverifylink').append('<span id="otpverifylink-text">Wait...</span>');
    $('#opt_data').removeAttr('readonly');
    var mobile = $('#Mobile').val();
    if($("#country_dial_code").length && $("#country_dial_code").val().length){
        mobile  =  $("#country_dial_code").val()+"-"+mobile;
    }
    $.ajax({
        url: '/students/sent-mobile-otp',
        type: 'post',
        dataType: 'json',
        data:{'mobile':mobile,'college_id':college_id},
        headers: {'X-CSRF-TOKEN': csrfToken},
        success: function (json) {
            if(json['error']){
                showVerifylink();
                if(json['error']=='limit'){ /* when user's 100 changes is cross then hide link */
                    $('#otpverifylink_a').hide();
                    $('#otpresendlink').hide();
                }
            }else if(json['success']==200){
                showOTPlink(); /* after success show OTP Fields */
                countdownStart(); /* 30 seconds timer start */
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
    return false;
}
/**
 * ajax for verifing Mobile OTP
 * @param int college_id
 * @returns TRUE|FALSE
 */
function verifyMobileOTP(college_id,disableElem){
    var otp_value   = $('#opt_data').val();
    if(otp_value.toString().length == 6)
    {
        $('div#profile-page div.loader-block').show();
        /* get csrf token form hidden field */
        var csrfToken = $('form input[name=\'_csrfToken\']').val();
        
        var mobile      = $('#Mobile').val();
        /* hide otp (un)verified text */
        $('#otpverified').hide();
        $('#otpunverified').hide();
        if($("#country_dial_code").length && $("#country_dial_code").val().length){
            mobile  =  $("#country_dial_code").val()+"-"+mobile;
        }
        $.ajax({
            url: '/students/verify-mobile-otp',
            type: 'post',
            dataType: 'json',
            data:{'otp_value':otp_value,'mobile':mobile,'college_id':college_id},
            headers: {'X-CSRF-TOKEN': csrfToken},
            success: function (json) {
                $('div#profile-page div.loader-block').hide();
                if(json['status']==1){
                    
                    /**
                     * if verified, hide resent otp, timer, clear timer
                     */
                    if(typeof timeinterval !='undefined'){
                        clearInterval(timeinterval);
                    }
                    showAfterVerified(disableElem);
                }else{
                    showAfterUnverified(disableElem);
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
        $('#otpverified').hide();
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
function resentOTPLink(id){

    // if timer already running and again req sent then clear previous timer
    if(typeof timeinterval !='undefined'){
        clearInterval(timeinterval);
    }

  var endtime =  new Date();
  endtime.setSeconds(endtime.getSeconds() + 30);

  var clock = document.getElementById(id);
  timeinterval = setInterval(function(){
    var t = getTimeRemaining(endtime);
    clock.innerHTML = t.seconds+' seconds';
    if(t.total<=0){
      clearInterval(timeinterval);
      $('#otpresendlink').show();
      $('#clockdiv').hide();
    }
  },1000);
}

/**
 * call for display timer
 * @returns {undefined}
 */
function countdownStart(){
    $('#clockdiv').show();
    var clock = $('#clockdiv');
    clock.html('30 seconds'); /* initial display 30 seconds */
    resentOTPLink('clockdiv'); /* call 30 secs timer */
}