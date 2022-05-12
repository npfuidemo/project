/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
 var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
$(document).ready(function(){
    if(typeof jsVars.chatConfig['api_id']!='undefined'){
        (function(){
        var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
        s1.async=true;
        s1.src='https://embed.tawk.to/'+jsVars.chatConfig['api_id']+'/default';
        s1.charset='UTF-8';
        s1.setAttribute('crossorigin','*');
        s0.parentNode.insertBefore(s1,s0);
        })();
    }
});

if(jsVars.bypassLeadPool==true){
    var name= email= '';
    if(typeof jsVars.user_name!='undefined'){
        name = jsVars.user_name;
    }
    if(typeof jsVars.user_email!='undefined'){
        email = jsVars.user_email;
    }
    var Tawk_API=Tawk_API||{};
    Tawk_API.visitor = {
    name : name,
    email : email
    };
}else{
    
    Tawk_API = Tawk_API || {};
    Tawk_API.onPrechatSubmit = function(data){
        var data = data;
        $.ajax({
            url: jsVars.preRegisterChatUrl,
            type: 'post',
            data: {data,type:'tawk_to'},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },                
            success: function (json) {
                if (json['success'] == 200)
                {}
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    };

    Tawk_API.onOfflineSubmit = function(data){
        var data = data;
        $.ajax({
            url: jsVars.preRegisterChatUrl,
            type: 'post',
            data: {data,type:'tawkOffline'},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },                
            success: function (json) {
                if (json['success'] == 200)
                {}
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    };
}