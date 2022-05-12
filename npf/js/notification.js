$(document).on('click', 'a.loadMoreNotifi', function(e) {
    $('.notifiDD').addClass('open');
    e.stopPropagation();
});

$(document).on('click', 'button#notificationLabel', function(e) {
    $('#notificationCount').hide();
    if (typeof notificationsUpdated != 'undefined' && notificationsUpdated == false) {
        $.ajax({
            url:  jsVars.FULL_URL+'/colleges/markNotificationRead',
            type: 'GET',
            async: false,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                if(json.status == 0) {
                    if(json.message == 'session_logout' || json.message == 'invalid_csrf') {
                        window.location.reload(true);
                    } else {
                        alertPopup('Something went wrong while updating notifications.', 'error');
                    }
                } else {
                    notificationsUpdated = true;
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
});

//load more bell icon callers
//function loadMoreNotification() {
//    
//    if(typeof notificationPage == 'undefined') {
//        notificationPage = 2;
//    }
//    
//    $.ajax({
//        url:  '/colleges/loadMoreNotification',
//        type: 'post',
//        data: {page:notificationPage,fetch:'loadMoreCallers'},
//        async: false,
//        dataType: 'html',
//        headers: {
//            "X-CSRF-Token": jsVars._csrfToken
//        },
//        success: function (json) {
//            if(json == 'session_logout') {
//                window.location.reload(true);
//            }
//            else if (json == 'csrfToken') {
//                alert('Invalid csrfToken token');
//            }
//            else if (json == 'missing')
//            {
//                alert('Request parameter missing/invalid.');
//            }
//            else {
//                notificationPage = notificationPage + 1;
//                $('#notificationBox').append(json);
//                //$('button#notificationLabel').trigger('click');				
//            }
//        },
//        error: function (xhr, ajaxOptions, thrownError) {
//            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
//        }
//    });   
//}