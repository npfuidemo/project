jQuery(function () {
    $('.sectionLoader').hide();
    $("div.bhoechie-tab-menu>div.list_group>a").click(function (e) {
        e.preventDefault();
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
        var index = $(this).index();
        $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
        $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
    });
    
    showFields();
})

function showFields() {
    var val = $('#sync_email').val();
    if(val == 'all_emails' || val == 'exist_npf' || val == 'default') {
        $("#search_keywords").hide(); 
        $("#keywords textarea").val(''); 
        $("#keywords").hide(); 
    } else {
        $("#search_keywords").show(); 
        $("#keywords").show(); 
    }
}

function disconnectGmailApisAccount(hashed_data) {
    $('.modal').modal('hide');
    $('#ConfirmMsgBody').html('Are you sure you want to disconnect with Gmail Account? This action will delete all mapping data.');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();
                ajaxDisconnectGmailApisAccount(hashed_data);
            });
}

function ajaxDisconnectGmailApisAccount(hashed_data) {
    $('.modal').modal('hide');
    $.ajax({
        url: '/connectors/gmail-apis/disconnect-gmail-apis-account',
        type: 'post',
        dataType: 'json',
        data: {'hashed': hashed_data},
        beforeSend: function () {
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (typeof data['session'] != 'undefined') {
                window.location.reload(true);
            } else if (typeof data['error'] != 'undefined') {
                alertPopup(data['error'], 'error');
            } else {
                alertPopup('Successfully Disconnected', 'success', '/college-settings/connectors-list');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.sectionLoader').hide();
        }
    });

    return false;
}

function ajaxSaveEmailImapSettings(hashed_data) {
    $("#map_label_error").html("");
    var data = $('#gmailApisConfigForm').serializeArray();
    
    $.ajax({
        url: '/connectors/gmail-apis/update-email-imap-settings/'+hashed_data,
        type: 'post',
        dataType: 'json',
        data: data,
        beforeSend: function (xhr) {
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (data == 'session') {
                window.location.reload(true);
            } else if (data.error) {
                /*if(data.error == 'Invalid Emails') {
                    $("#exclude_email_error").html('Please enter valid emails.');
                } */
                alertPopup(data.error, 'error');
            } else if (data.success == 200) {
                //$("#exclude_email_error").html('');
                alertPopup('Configuration saved successfully.', 'success');
            } else {
                //$("#exclude_email_error").html('');
                alertPopup('error', 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.sectionLoader').hide();
        }
    });
}