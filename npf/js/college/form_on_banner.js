/* 
 * To handle Full banner layout related js.
 */
$(document).ready(function () {
    $('#registerForm label.control-label').remove();
    $('#registerForm input').each(function () {
        var id = $(this).attr('id');
        if (id == 'opt_data') {
            $(this).attr('placeholder', 'Enter OTP ');
//        } else if (id == 'Captcha') {
//            $(this).attr('placeholder', 'Enter ' + id + ' * ');
//        } else if (id == 'Password') {
//            $(this).attr('placeholder', 'Any Password of Your Choice * ');
//        } else if (id == 'filter_dial_code') { //If country Dial Code then display blank for placeholder
//            $(this).attr('placeholder', '');
//        } else {
//            $(this).attr('placeholder', 'Your ' + id + ' * ');
        }
    });
    $('#LoginForm label.control-label,#loginForm label.control-label').remove();
    $('#loginForm input').each(function () { 
        var id = $(this).attr('id');
        var placeholder = id;
        if(id=='loginEmail'){
            if(typeof jsVars.loginPlaceHolder!='undefined'){
                $(this).attr('placeholder',  jsVars.loginPlaceHolder + ' * ');
            }else{
                placeholder = 'Email';
                $(this).attr('placeholder', 'Your ' + placeholder + ' * ');
            }
        }
        else if(id == 'loginPassword'){
            placeholder = 'Password';
            $(this).attr('placeholder', 'Your ' + placeholder + ' * ');
        }else{
            $(this).attr('placeholder', 'Your ' + placeholder + ' * ');
        }
    });
    $('#forgotForm label.control-label').remove();
    $('#forgotForm input').each(function () {
        var id = $(this).attr('id');
        var placeholder = id;
        if(id=='forgetEmail'){
            placeholder = 'Enter Your Registered Email ID';
            if(typeof jsVars.loginPlaceHolder!='undefined'){
                // not required mobile no from foget placeholder
                placeholder = jsVars.loginPlaceHolder;
                placeholder = placeholder.replace('or Mobile No.','');
            }
        }
        $(this).attr('placeholder',  placeholder + ' * ');
    });

    // Extra Thing
    $("nav").removeClass("showhidemobile");

    var maxHeight = 0;
    $(".desktop-bform .tab-pane").each(function () {
        $(this).addClass("active");
        var height = $(this).height();
        maxHeight = height > maxHeight ? height : maxHeight;
        maxHeight=maxHeight+5;
        $(this).removeClass("active");
    });
    $(".desktop-bform .tab-pane:first").addClass("active");
    $(".desktop-bform").height(maxHeight);

});

/* 
 * To handle full banner height auto adjust according to form fields
 */
if(typeof jsVars.isMobile != 'undefined' && jsVars.isMobile=='Mobile') {
    
}else {
    $(document).ready(function () {
        var $formheight = $('.colleges-cform');
        var $mysliderheight = $('.carousel');
        var $cinnerheight = $('.carousel-inner');
        var $fillheight = $('.fill');

        var $window = $(window).on('resize', function () {
            var height = $formheight.height() + 20;
            $mysliderheight.height(height);
            $fillheight.height(height);
            $cinnerheight.height(height);
        }).trigger('resize');
    });
}