if(typeof jsVars.chatConfig['api_id']!='undefined'){
var _smartsupp = _smartsupp || {};
   _smartsupp.key = jsVars.chatConfig['api_id'];
   window.smartsupp||(function(d) {
           var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
           s=d.getElementsByTagName('script')[0];c=d.createElement('script');
           c.type='text/javascript';c.charset='utf-8';c.async=true;
           c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
   })(document);
   //smartsupp('on', 'startup', function() { console.log('startup'); });
   
   
   smartsupp('on', 'login', function(values) {
        
        var email = values.email;
        var mobile = values.number;
        var name = values.name;
        userRegisterByChat(email, mobile, name, 'smartsupp');
        //alert(values.email);
//        
//        $.ajax({
//            url: jsVars.preRegisterChatUrl,
//            type: 'post',
//            data: {
//                Email: email,
//                mobile: mobile,
//                name : name,
//                type : 'smartsupp'
//            },
//            dataType: 'json',
//            headers: {
//                "X-CSRF-Token": jsVars._csrfToken
//            },                
//            success: function (json) {
//                if (json['success'] == 200)
//                {}
//            },
//            error: function (xhr, ajaxOptions, thrownError) {
//                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
//            }
//        });
//        
//        console.log('login values: ', values);
    });
   
}


