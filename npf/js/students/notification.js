//get latest notification list
function getLatestNotification() 
{
    $("#notificationListId").parent('div').addClass('hidden');
    $('#newNotificationCount').html('');
    $.ajax({
        url: jsVars.getNewNotificationCountUrl,
        type: 'post',
        data: {"forCountAndList": true, pageNo: 1},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {            
            var li = '';            
            if (json['redirect']) {
                location = json['redirect'];
            }
            else if (json['notificationList']) {
                var list = json['notificationList'];
                for (var i in list) {
                    li += list[i]['notification'];
                }
            }
            
            if (li != '') {
                $("#notificationListId").parent('div').removeClass('hidden')
                $("#notificationListId").html(li);
                if (jsVars.onDashboardClass == '') {
                    $("#notificationListId").find('li').addClass('').addClass('submitToDashboard');
                } else {
                    $("#notificationListId").find('li').addClass(jsVars.onDashboardClass);
                }
                $(".showNotificationList").removeClass('hidden');
                $("#listPage").val(1);
            }
        },
        error: function () {
        }
    });
}

$('body').delegate('.onDashboardClick, .onDashboard', 'click', function () {
    var pageNo = $("#listPage").val();
    $(".notificationList").html('');
    notificationList(pageNo);
});


$('body').delegate('#loadMoreList', 'click', function () {
    var pageNo = $("#listPage").val();
    notificationList(pageNo,'doNotScroll');
});

$('body').delegate('.submitToDashboard', 'click', function () {
    window.location = jsVars.myNotificationUrl;
})

function notificationList(pageNo, doScroll) {
    pageNo = Number(pageNo);
    $.ajax({
        url: jsVars.getNewNotificationCountUrl,
        type: 'post',
        data: {"forList": true, pageNo: pageNo},
        dataType: 'json',

        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            var li = '';
            var pagelimit = 10;
            var count = 0;
            if (json['redirect']) {
                location = json['redirect'];
            }
            else if (json['notificationList']) {
                var list = json['notificationList'];
                for (var i in list) {
                    li += list[i]['notification'];
                    count++;
                }
            }
            
            if (pageNo === 1) {
                var html = '<ul class="notificationUl"> ' + li + '</ul>';
                if (json['loadMoreAttributeHtml']) {
                    html += json['loadMoreAttributeHtml'];
                } else {
                    html += '<div class="text-center"><button id="loadMoreList" style="border:1px solid #ccc" class="btn btn-sm w-text npf-btn m0"><i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Show More</button></div>';
                }
                $(".notificationList").parent('div').removeClass('hidden');
                $(".notificationList").removeClass('hidden');
                $(".notificationList").append(html);
            } else {
                $('.notificationUl').append(li);
            }

            if (count >= pagelimit) {
                var nextPage = pageNo + 1;
                $("#listPage").val(nextPage);
            }
            
            if (count < pagelimit) {
                $('#loadMoreList').addClass('hidden');
            }
            if (typeof doScroll == 'undefined') {
                var topVal = $("#divNotificationList").offset().top - 70;
                jQuery("html, body").animate({scrollTop: topVal}, 500);
            }
        },

        error: function () {
        }
    });
}