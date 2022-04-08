$(document).ready(function(){
    $("#notification_bell").on('click',function(e){
        $("#notificationCount").hide();
        e.preventDefault();
        getNotificationPopupList('all','1')
    });
    $("#mark_all_read").on('click',markAllRead);

    //get notification from nodejs
    if(typeof user_id !=="undefined" && user_id !='0' && user_id !='' && NOTIFICATION_URI !="undefined"){
        console.log(NOTIFICATION_URI);
        var socketNotification = io.connect(NOTIFICATION_URI);
        socketNotification.on('connect', function () {
            socketNotification.emit('user_id', user_id);
        });
        socketNotification.on('bellcount', function (datacount) {
            if((typeof datacount != 'undefined') && (datacount > 0)) {
               $('#notificationCount').html(datacount).show();
            }else{
                $('#notificationCount').hide();
            }
        });
    }
});
function getNotificationPopupList(notification_type,reset){
    $.ajax({
        url:  showNotificationPopup,
        type: 'POST',
        async: false,
        dataType: 'html',
        data:{type:notification_type,reset:reset},
        success: function (data) {
            var checkError  = data.substring(0, 6);
            if (data === 'session_logout'){
                window.location.reload(true)
            }else if (checkError === 'ERROR:'){
                alertPopup(data.substring(6, data.length),'error')
            }else{
                $("#notification").modal();
                if(reset=='1'){
                    $('#notificationPopupDiv').html(data);
                }else{
                    if(notification_type=='all'){
                    console.log(notification_type)
                        $('#viewall').html(data);
                    }else if(notification_type=='task'){
                        $('#task-tab').html(data);
                        console.log(notification_type)
                    }else if(notification_type=='notification'){
                        $('#notification-tab').html(data);
                        console.log(notification_type)
                    }
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
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
function markAllRead(){
    var objClicked = $(this);
    $.ajax({
        url: markAllReadNotification,
        type: 'POST',
        data:{mark_all_read:true,action:'read'},
        async: false,
        dataType: 'json',
        beforeSend: function () {
        },
        success: function (response) {
            if(response.status != 1){
                if(response.msg == "session_logout"){
                    window.location.reload(true)
                }
            }else{
                $('.unread-count-text').html('<span class="badge bg-primary">0</span>');
                $('li.unclicked-item').removeClass('unclicked-item');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            objClicked.html('Mark all as Read');
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}