/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function(){
    if(typeof jsVars.chatConfig['api_id']!='undefined'){
        window.$zopim||(function(d,s){var z=$zopim=function(c){z._.push(c)},$=z.s=
        d.createElement(s),e=d.getElementsByTagName(s)[0];z.set=function(o){z.set.
        _.push(o)};z._=[];z.set._=[];$.async=!0;$.setAttribute("charset","utf-8");
        $.src="https://v2.zopim.com/?"+jsVars.chatConfig['api_id'];z.t=+new Date;$.
        type="text/javascript";e.parentNode.insertBefore($,e)})(document,"script");
    }
});


$(document).ready(function(){ //for zopim tracking
    if(jsVars.bypassLeadPool==true){
        var name= email= mobile='';
        if(typeof jsVars.user_name!='undefined'){
            name = jsVars.user_name;
        }
        if(typeof jsVars.user_email!='undefined'){
            email = jsVars.user_email;
        }
        if(typeof jsVars.user_phone!='undefined'){
            mobile = jsVars.user_phone;
        }
        $zopim(function() {
        $zopim.livechat.setName(name);
        $zopim.livechat.setEmail(email);
        $zopim.livechat.setPhone(mobile);
      });
    }else{
        $zopim(function(a) {
            $zopim.livechat.clearAll();
            $zopim.livechat.setOnChatStart(function() {
                var email = $zopim.livechat.getEmail();
                var phone = $zopim.livechat.getPhone();
                var name = $zopim.livechat.getName();
                userRegisterByChat(email, phone, name, 'zopim');
            });
        }); 
   }
});
