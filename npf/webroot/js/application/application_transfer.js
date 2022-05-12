
function submitApplicationTransfer(applicationTransferUrl) {
    $("#appTransferButton").hide();
    $("#appTransferButtonWait").show();
    $.ajax({
        url: '/form/submitApplicationTransfer/'+applicationTransferUrl,
        type: 'get',
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        complete:function(){
            $("#appTransferButton").show();
            $("#appTransferButtonWait").hide();
        },
        success: function (response) {
	    var responseObject = $.parseJSON(response); 
	    if (responseObject.message === 'session'){
                alertPopup("Session expired. Please login and try again.",'error');
//                window.parent.redirectTologin();
//                window.close('','_parent','');
//		window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
	    }else if(responseObject.status==1){
                var selector_parent = '#SuccessPopupArea';
                var selector_titleID = '#alertTitle';
                var selector_msg = '#MsgBody';
                var btn = '#OkBtn';
                var title_msg = 'Program Transfer Successful';

                $(selector_titleID).html(title_msg);
                $(selector_msg).html(responseObject.message);
                $(selector_parent).modal();
                if($("#OkBtn").length){
                    $("#OkBtn").show();
                    $("#OkBtn").html("Continue");
                    $("#OkBtn").css({"width":"40%"});
                    $("#OkBtn").click(function(){
                        window.close();
                    });
                }
                $("#SubmitAppTransferButtonDiv").hide();
//                window.parent.showSuccessfulTransferMessage(responseObject.message);
//                window.close('','_parent','');
            }else if( typeof responseObject.message !=='undefined' && $.trim(responseObject.message)!=='' ){
                alertPopup(responseObject.message,'error');
                return false;
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
   });
}
