/**
 * Enable or disable chat status
 * @param {int} id
 * @param {string} key
 * @param {int} status
 */
function checkChangeChatStatus(id,status,isUpdate,key) {
    var ajaxCallStatus = '';
    if((typeof key === 'undefined') || (key === null)) { key = ''; }
    
    $.ajax({
        url: '/college-settings/check-change-chat-status',
        type: 'post',
        dataType: 'json',
        async: false,
        data: {'hashed': id, 'status': status, 'isUpdate': isUpdate},
        beforeSend: function (xhr) {
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (typeof data['session'] !== 'undefined') {
                window.location.reload(true);
            }
            else if (typeof data['error'] !== 'undefined') {
                ajaxCallStatus = false;
                alertPopup(data['error'],'error');
                $('#ErrorPopupArea').css('z-index',99999);
                if(status === 1 && key !== '') {
                    $('#'+key).prop('checked', false);
                }
            } else {
                if(key === '') {
                    ajaxCallStatus = true;
                } else {
                    if(status === 1) {
                        window.location.href = '/college-settings/chat-configuration/'+key+'/'+id;
                    } else {
                        alertPopup('Status successfully changed.','success');
                        $('#SuccessPopupArea').css('z-index',99999);
                        $('#'+key).prop('checked', false);
                    }
                }
            }
            $("#extensionList").trigger('click');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.sectionLoader').hide();
        }
    });
    
    if(key === '') {
        return ajaxCallStatus;
    }
}

/**
 * Save chat configuration 
 * @param {string} section
 */
function SaveChatConfiguration(section,hashString) {   
    var ajaxCallStatus = checkChangeChatStatus(hashString,1,1);
    
    if(ajaxCallStatus) {
        var data = $('#'+section+' input[type=\'hidden\'], #'+section+' input:checked, #'+section+' input[type=\'text\'], #'+section+' select, #'+section+' textarea').serialize();
        var url = '/college-settings/save-chat-configuration/'+hashString;
    
        $.ajax({
            url: url,
            type: 'post',
            data: data,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function() {
                $('#CollegeConfigurationSection .loader-block').show();
            },
            complete: function() {
                $('#CollegeConfigurationSection .loader-block').hide();
            },
            success: function (json) {
                if (json['redirect']) {
                   location = json['redirect'];
                } else if(json['error']) {
                   alertPopup(json['error'],'error');
                } else if(json['api_error']) {
                   $('#api_error').html(json['api_error']);
                } else if(json['success'] === 200) {
                   $('#api_error').html('');
                   alertPopup(json['Msg'],'Success');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}





