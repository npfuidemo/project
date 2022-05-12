function ChangeSession(type,value) {
    
    var c_controller = $('.currentController').val();
    var c_method = $('.currentMethod').val();
    $.ajax({
        url: '/common/set-college',
        type: 'post',
        dataType: 'json',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "value": value,
            "type": type,
            "c_controller":c_controller,
            "c_method":c_method
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (data) {
            if(data.code == 200 && (data.url != '')){
                window.location.href = data.url;
            }else if(data.code == 500 && (data.message != '')){
                alertPopup(data.message, 'error', location.href);
            }else{
                window.location.href = location.href;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function alertPopup(msg, type, location) {
    var selector_parent, selector_titleID, selector_msg, title_msg, btn;
    if (type === 'error') {
        selector_parent = '#ErrorPopupArea';
        selector_titleID = '#ErroralertTitle';
        selector_msg = '#ErrorMsgBody';
        btn = '#ErrorOkBtn';
        title_msg = 'Error';
    } else {
        selector_parent = '#SuccessPopupArea';
        selector_titleID = '#alertTitle';
        selector_msg = '#MsgBody';
        btn = '#OkBtn';
        title_msg = 'Success';
    }

    $(selector_titleID).html(title_msg);
    $(selector_msg).html(msg);
    $('.oktick').hide();

    if (typeof location !== 'undefined') {
        $(btn).show();

        $(selector_parent).modal({keyboard: false}).one('click', btn, function (e) {
            e.preventDefault();
            window.location.href = location;
        });
    } else {
        $(selector_parent).modal();
    }
}