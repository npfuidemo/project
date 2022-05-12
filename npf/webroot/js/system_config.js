function saveSystemConfigurationData(){ 
//    if(validateForm()==true) {
        $.ajax({
            url: jsVars.SaveSystemConfigurationURL,
            type: 'post',
            dataType: 'json',
            async:false,
            data: $("form#SaveConfiguration").serialize(),
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {

                if(json['redirect']){
                    location = json['redirect'];
                } else if(json['invalid_token']){
                    alertPopup(json['invalid_token'],'error');
                    alert('ddfff');
                }
                if(json['success']){
                    $('#SuccessPopupArea p#MsgBody').text(json['msg']);
                    $('#SuccessLink').trigger('click');
                    $('#SuccessPopupArea').removeAttr('tabindex');
                    $('#SuccessPopupArea a#OkBtn').show();
                    $('#SuccessPopupArea .npf-close,#SuccessPopupArea  .oktick').hide();
                    $('#SuccessPopupArea a#OkBtn').attr('href',window.location.href);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {            
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
//    }
}

/**
 * Validate the form
 */
function validateForm() {
    var getElement=document.getElementsByName('system_config[]');
    var totalLength=getElement.length;
    var totalBlankField=0;
    if(totalLength>0) {
        for (var i=0;i<totalLength;i++){
            if ( $.trim(getElement[i].value)=='' ) {
              totalBlankField++;
            }
        }
    }
    if (totalBlankField >0) {
        alertPopup('All fields are mandatory','error');
        return false;
    }
    return true;    
}

/*For Encrypt Decrypt Value*/
function encryptDecryptData(field_value,type){ 
    if($.trim(field_value) == '') {
        alertPopup('Please enter value.','error');
        return false;
    }   
        $('#showFinalValue').text('');
        var data=$("form#encryptForm").serializeArray(); 
        data.push({name: "enc_dec_type", value: type});
        $.ajax({
            url: jsVars.encryptDecryptURL,
            type: 'post',
            dataType: 'json',
            async:false,
            data: data,
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {

                if(json['redirect']){
                    location = json['redirect'];
                } else if(json['invalid_token']){
                    alertPopup(json['invalid_token'],'error');
                }  else if(json['configure_error']){
                    alertPopup(json['configure_error'],'error');
                } else {
                    if(json['success']){
                        if(json['success']!= '') {
                            if(type=='encrypt') {
                                $('#decrypt_key').show().attr('disabled',false);
                                $('#decrypt_key').val(json['data']);
                                $('#decryptBtn').show();
                                $('#decryptBtn').attr('disabled',false);
                            } else if (type=='decrypt') {                        
                                $('#showFinalValue').text('Decrypted Value is: ' + json['data']);
                            }
                        } else {
                            $('#showFinalValue').text('');
                        }
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {            
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    
}