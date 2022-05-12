$(document).ready(function () {
    $('[data-toggle="popover"]').popover();
  
    $("#new_password").keyup(function(){
        validatePassword('new_password');
    });
    $("#new_password").focus(function(){
        validatePassword('new_password');
    });
  
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
     
     $('#span_old_password, #span_new_password, #span_confirm_password').hide();
     
     if($('form#bk_change_password #old_password').val()==""){
        error="Old password is required.";
        $('#span_old_password').html(error);
        $('#span_old_password').fadeIn();
     }
     if($('form#bk_change_password #new_password').val()==""){
        error="New password is required.";
        $('#span_new_password').html(error);
        $('#span_new_password').fadeIn();
     }
     if($('form#bk_change_password #confirm_password').val()==""){
        error="Confirm password is required.";
        $('#span_confirm_password').html(error);
        $('#span_confirm_password').fadeIn();
     }
     
     if($('form#bk_change_password #new_password').val().indexOf(' ') >= 0){
        error="Spaces are not allowed";
        $('#span_new_password').html(error);
        $('#span_new_password').fadeIn();
     }
     
     if(error==""){
        if(validatePassword('new_password')==false){
           error="Entered Password doesn't meet the criteria mentioned.";
           $('#span_new_password').html(error);
           $('#span_new_password').fadeIn();
        }
        if($('form#bk_change_password #new_password').val()!=$('form#bk_change_password #confirm_password').val()){
           error="New Password and Confirm Password doesn't match.\n";
           $('#span_confirm_password').html(error);
           $('#span_confirm_password').fadeIn();
        }
     }
     
     if(error=="") return true;
     else return false;
     //alert(error);
     //return false;
 }
 
 
