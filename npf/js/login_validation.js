$(document).ready(function () {
	$('.loader-block').fadeIn();
    //College Login/Forgot Password Page 
    if ($('.login-screen').length > 0)
    {
        if(jsVars.error)
        {
            for(var key in jsVars.error)
            {
                $("#" + key).parents("div.form-group").addClass("has-error");
                $("#" + key).parents("div.form-group").find(".requiredError").html(jsVars.error[key]);
                $("#" + key).focus();
            }
        }
    }
    
    //College Reset Password Page
    if ($('#reset-password').length > 0)
    {
        if(jsVars.error)
        {
            for(var key in jsVars.error)
            {
                $("#" + key).parents("div.form-group").addClass("has-error");
                $("#" + key).parents("div.form-group").find(".requiredError").text(jsVars.error[key]);
                $("#" + key).focus();
            }
        }
    }
    //call for mobile app callback
    if(typeof interface != 'undefined' ){
        interface.callFromJS();
    }
});

function createCookie(name,value) {
    if(typeof name != 'undefined' && typeof value != 'undefined'){
       document.cookie = name+"="+value+"; path=/";
    }
}

jQuery(window).load(function(){
  $('.loader-block').fadeOut();
})


