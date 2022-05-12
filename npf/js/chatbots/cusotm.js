
function validateEmail(x) {
    var atpos = x.indexOf("@");
    var dotpos = x.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
        return false;
    }
    return true;
}


function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
   
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

//Refresh captcha on click
$(document).on('click','#CaptchaRefreshBtn',function(){
    getCaptchaCode();
});

$(window).load(function(){
    getCaptchaCode();
});

function getCaptchaCode() {
    var d = new Date();
    var n = d.getTime(); 
    var cid='';
    var u='';
    var wid='';
    //alert(jsVars.uniqid);
    if(typeof jsVars.college_id !== 'undefined'){
        cid = '&cid='+jsVars.college_id;
    }
    
    if(typeof jsVars.uniqid !== 'undefined'){
        u = '&u='+jsVars.uniqid;
    }
    
    if(typeof jsVars.widgetId !== 'undefined'){
        wid = '&wid='+jsVars.widgetId;
    }

    $("#CaptchaImage").attr('src',jsVars.CaptchaLink +'?'+n+cid+u+wid);
}