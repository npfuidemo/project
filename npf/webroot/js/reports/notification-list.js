/****For display requested listing***/
var log_data_college_id = 0;
function notificationList(type) {
    var data = $('#FilterNotificationForm').serializeArray();
    if(type == 'reset'){
        Page = 1;
    }
    data.push({name: "page", value: Page});
    $('#LoadMoreAreaNotification').show();
    $('#LoadMoreAreaNotification button').attr("disabled", "disabled").html("Loading...").show();
    $.ajax({
        url: jsVars.FULL_URL + '/reports/notification-ajax-list',
        type: 'post',
        dataType: 'html',
        data: data,
        async: true,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () { 
            $('#downloadReportLoader').show();
            $('#college_error').html('');
            $('#bulkUpdateLoader').show();
            $('#bulkUpdateLoader').css('height','100vh');
            $('body').css('overflow', 'hidden');
             
        },
        complete: function () {
            $('#downloadReportLoader').hide();
            $('#bulkUpdateLoader').hide();
            $('#bulkUpdateLoader').css('height','auto');
            $('body').css('overflow', 'auto');
        },
        success: function (data){
            var checkError  = data.substring(0, 6);
            if (data === 'session_logout'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alertPopup(data.substring(6, data.length),'error');
            }else{
                if(type=='reset'){
                    if(data === 'no_data_found'){ 
                        var no_data = '<div class="noDataFoundDiv"><div class="innerHtml"><img src="../img/no-record.png" alt="no-record"><span>No Data Found</span></div></div>';
                        $('#load_more_results').html(no_data); 
                        $('#LoadMoreAreaNotification').hide();
                        $('#markAllread').hide();
                    }else{
                        $('#table-data-view').show();
                        $('#load_msg_div').hide();
                        $('#load_more_results').html(data);
                        $('#markAllread').show(); 
                    }
                }else if(type=='append'){
                    if(data === 'no_data_found'){ 
                        $('#LoadMoreAreaNotification').hide();
                    }else{
                        $('#load_more_results').append(data); 
                        Page = Page+1;
                    }
                }
                $('#LoadMoreAreaNotification button').removeAttr("disabled").html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;Load More Data").show();
            }
            $('.offCanvasModal').modal('hide');          
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function displayLogData(process_id,college_id){
    log_data_college_id = college_id;
    var data = $('#FilterNotificationForm').serializeArray();
    data.push({name: 'process_id', value:process_id});
    data.push({name: 's_college_id', value:college_id});
    $('#displayLogDataPopup').modal('show');
    $.ajax({
        url: jsVars.FULL_URL + '/reports/display-log-data',
        type: 'post',
        dataType: 'html',
        data: data,
        async: true,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () { 
            $('#downloadReportLoader').show();
            $('#college_error').html('');
        },
        complete: function () {
            $('#downloadReportLoader').hide();
        },
        success: function (data){
            var checkError  = data.substring(0, 6);
            if (data === 'session_logout'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alertPopup(data.substring(6, data.ength),'error');
            }else{
                $('#log-data-popup').show();
                $('#log-data-popup').html(data);    
                $('.chosen-select').chosen();
            }
            $('[data-toggle="tooltip"]').tooltip();  
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


$(document).on('click', 'button#notification_bell', function(e) {
    $('#notificationCount').hide();
    getNotificationPopupList('all',1);
});

function getNotificationPopupList(notification_type,reset){
    $.ajax({
        url:  jsVars.FULL_URL+'/colleges/show-notification-popup',
        type: 'POST',
        async: false,
        dataType: 'html',
        data:{type:notification_type,reset:reset},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (data) {
            var checkError  = data.substring(0, 6);
            if (data === 'session_logout'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alertPopup(data.substring(6, data.length),'error');
            }else{
                if(reset==1){
                    $('#notificationPopupDiv').html(data);           
                }else{
                    if(notification_type=='all'){
                        $('#all-notification-tab').html(data);           
                    }else if(notification_type=='task'){
                        $('#task-tab').html(data);           
                    }else if(notification_type=='notification'){
                        $('#notification-tab').html(data);    
                    }
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$(document).on('click', '#bulk_data_activity a', function(e) {
    var action = $(this).attr('data-action');
    var nextPage = parseInt($('#logPage').val());
    var max_page = $('#total_pages').val();
    if(action == 'next'){
        nextPage = nextPage+1;
        $('#logPageJump').val(nextPage);
        $('#logPage').val(nextPage);
    }else if(action == 'prev'){
        nextPage = nextPage-1;
        $('#logPageJump').val(nextPage);
        $('#logPage').val(nextPage);
    }
    displayAjaxLogdata(nextPage);
});

$(document).on('change', '#logPageJump', function(e) {
    var max_page = parseInt($('#total_pages').val());
    var nextPage = parseInt($(this).val());
    if(nextPage !=0 && nextPage<max_page){
        $('#logPage').val(nextPage);
        displayAjaxLogdata(nextPage);
    }
});



function displayAjaxLogdata(page){
    var data = $('#displayLogDataAjax').serializeArray()
    data.push({name: 's_college_id', value:log_data_college_id});
    data.push({name: "page", value: page});
    var max_page = $('#total_pages').val();
    $.ajax({
        url:  jsVars.FULL_URL+'/reports/display-ajax-log-data',
        type: 'POST',
        data:data,
        async: false,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (data) {
            var checkError  = data.substring(0, 6);
            if (data === 'session_logout'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alertPopup(data.substring(6, data.length),'error');
            }else{
                $('#load_more_logs').html(data);
                $('#current_page').val(page);
                if(page==1){
                    $('.data_activity_pagination li.prev').addClass('disabled');
                }else{
                    $('.data_activity_pagination li.prev').removeClass('disabled');

                }

                if(page==max_page){
                    $('.data_activity_pagination li.next').addClass('disabled');
                }else{
                    $('.data_activity_pagination li.next').removeClass('disabled');
                }
            }
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


$(document).on('click', '.mark-all-notification-read', function(e) {
    var $objClicked = $(this);
    $.ajax({
        url:  jsVars.FULL_URL+'/colleges/notifications-actions',
        type: 'POST',
        data:{mark_all_read:true,action:'read'},
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            // $objClicked.html('Mark all as Read...');
        },
        success: function (response) {
            // $objClicked.html('Mark all as Read');
            $('.unread-count-text').html('<span class="badge bg-primary">0</span>');
            $('li.unclicked-item').removeClass('unclicked-item');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $objClicked.html('Mark all as Read');
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
});


$(document).on('click', '.read-notification-bulk-update', function(e) {
    var $clickedObj = $(this);
    var read_status = parseInt($clickedObj.attr('data-read'));
    var object_id = $clickedObj.attr('data-object_id');
    var action = read_status==0?'read':'';
    if(read_status == 1){
        return false;
    }
    $.ajax({
        url:  jsVars.FULL_URL+'/colleges/notifications-actions',
        type: 'POST',
        data:{action:action,object_id:object_id},
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (response) {
            $clickedObj.attr('data-read',1);
            $clickedObj.addClass('disabled');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
});

function resetNotificationList(){
    var college_id = jsVars.s_college_id;
    if(typeof college_id!='undefined' && parseInt(college_id)>0){
        $('#s_college_id').val(college_id);
        $('#s_college_id').trigger("chosen:updated");
    }else{
        $('#s_college_id').val('');
        $('#s_college_id').trigger("chosen:updated");
    }
    notificationList('reset');
}

function downloadLogData(process_id,college_id){
    $('#confirmLogDownloadPopup').modal('show');
    $('#csv_log').prop("checked", true);
    $('#confirmLogDownloadYes').off('click');
    $('#confirmLogDownloadYes').on('click',function(e){
        e.preventDefault();
        $('#confirmLogDownloadPopup').modal('hide');
        $.ajax({
            url:  jsVars.FULL_URL+'/reports/download-log-data',
            type: 'POST',
            data:{process_id:process_id,college_id:college_id},
            async: false,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (response) {
                if(response.error != '') {
                    if(response.error == 'session_logout') {
                        window.location.href = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                    } else if(response.error == 'invalid_request') {
                        alertPopup('Something went wrong','error');
                    } else {
                        alertPopup(response.error,'error');
                    }
                }else{
                    $('#muliUtilityLogPopup').find('#alertLogTitle').html('Download Success');
                    $('#dynamicLogMessage').hide();
                    $('#muliUtilityLogPopup').modal('show');
                    if(typeof response.url!=='undefined'){
                        $('#downloadLogListing').attr('href',response.url);
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });
}

function alertPopup(msg, type, location) {
    if (type == 'error') {
        var selector_parent = '#ErrorPopupArea';
        var selector_titleID = '#ErroralertTitle';
        var selector_msg = '#ErrorMsgBody';
        var btn = '#ErrorOkBtn';
        var title_msg = 'Error';
    } else {
        var selector_parent = '#SuccessPopupArea';
        var selector_titleID = '#alertTitle';
        var selector_msg = '#MsgBody';
        var btn = '#OkBtn';
        var title_msg = 'Success';
    }
    $(selector_titleID).html(title_msg);
    $(selector_msg).html(msg);
    $('.oktick').hide();
    if (typeof location != 'undefined') {
        $(btn).show();
        $(selector_parent).modal({keyboard: false}).one('click', btn, function (e) {
            e.preventDefault();
            window.location.href = location;
        });
    } else {
        $(selector_parent).modal();
    }
}