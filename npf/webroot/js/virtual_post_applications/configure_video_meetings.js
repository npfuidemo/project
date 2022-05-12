function changeStatus(collegePrefix,formPrefix,type){
    var statusText = '';
    var newStatus = 0;
    var checkboxId
    var typeText = '';
    if(type === 'Zoom') {
        typeText =  ' Zoom Video Platform for Scheduling Meetings?';
        checkboxId = '#zoomStatus';
    } else if(type === 'Calendar') {
        typeText = ' Google Meet Platform for Scheduling Meetings?';
        checkboxId = '#calendarStatus';
    } else if(type === 'MsTeams'){
        typeText = ' Microsoft Teams Platform for Scheduling Meetings?';
        checkboxId = '#msTeamsStatus';
    }
    if($(checkboxId).is(':checked')) {
        statusText = 'Enable';
        newStatus = 1;
    } else {
        statusText = 'Disable';
        newStatus = 0;
    }
    $('#ConfirmMsgBody').html('Are you sure you want to ' + statusText +' '+ typeText);
    $('#ConfirmPopupArea').css('z-index',99999);
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
   .off('click', '#confirmYes')
   .one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $('#ConfirmPopupArea').modal('hide');
        saveVideoConfiguration(collegePrefix, formPrefix,type,newStatus);
    })
    .off('click', '#confirmNo, #crossIcon')
    .one('click', '#confirmNo, #crossIcon', function () {
        revertToggle(checkboxId,newStatus);
        return true;
    });
}

function saveVideoConfiguration(collegePrefix, formPrefix, type, newStatus){
    $.ajax({
        url: jsVars.saveVideoConfiguration,
        type: 'post',
        dataType: 'json',
        data: {'cPrefix': collegePrefix, 'fPrefix' : formPrefix,'type':type, 'newStatus' : newStatus},
        beforeSend: function (xhr) {
            $('.loader-block').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            console.log(data);
            if (typeof data['session'] != 'undefined') {
                window.location.reload(true);
            }
            else if (typeof data['error'] !='undefined') {
                alertPopup(data['error'],'error');
                $('#ErrorPopupArea').css('z-index',99999);
                revertToggle(2,newStatus);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.loader-block').hide();
        }
    });
    
    //return false;
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
    }
    else {
        $(selector_parent).modal();
    }
}

function revertToggle(id,status){
    if(status){
        checkedFlag = false;
    }else{
        checkedFlag = true; 
    }
    $(id).prop('checked',checkedFlag);
}

function checkRadia(){
    $('input[name=communicateMeetingApplicant]').on('change', function() {
       if($(this).val() == 1){
           $('.communicate-with-applicants').removeClass('hide');
       } else {
           $('.communicate-with-applicants').addClass('hide');
       }
    });
    $('input[name=communicatemeetinginvites1]').on('change', function() {
        if($(this).val() == 1){
            $('.communicate-with-evaluators').removeClass('hide');
        } else {
            $('.communicate-with-evaluators').addClass('hide');
        }
    });
}

$('html').on('click','.communcationCheckBox',function(){
    var sectionId = $(this).attr('id');
    var sectionId = sectionId+'Section';
    if($(this).is(':checked')){
        $('.'+sectionId).removeClass('hide');
    }else {
        $('.'+sectionId).addClass('hide');
    }
});

$("#communicationsettings-tab").on('click',function() {
    $.ajax({
        url: jsVars.communicationConfiguration,
        type: 'post',
        dataType: 'html',
        data:{type:'get_data'},
        beforeSend: function (xhr) {
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (data=='session') {
                window.location.reload(true);
            }
            $("#communicationsettings").html(data);
            checkRadia();
            bindSaveFunction();
            $(".sumo-select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true});
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.sectionLoader').hide();
        }
    });
});

function bindSaveFunction() {
    $('#saveCommunicationSetting').on('click',function(){
        var data = $("#videoCommunication").serializeArray();
        $.ajax({
            url: jsVars.saveCommunicationConfiguration,
            type: 'post',
            dataType: 'json',
            data: data,
            beforeSend: function (xhr) {
                $('.sectionLoader').show();
            },
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            success: function (data) {
                console.log(data);
                if (typeof data['session'] != 'undefined') {
                    window.location.reload(true);
                }
                else if (typeof data['error'] !='undefined') {
                    alertPopup(data['error'],'error');
                    $('#ErrorPopupArea').css('z-index',99999);
                    revertToggle(2,newStatus);
                }
                else {         
                    alertPopup(data['message'],'success');
                    $('#SuccessPopupArea').css('z-index',99999);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            },
            complete: function (jqXHR, textStatus) {
                $('.sectionLoader').hide();
            }
        });
    });
}


$("#zoom-account-setting").on('click',function() {
    url = jsVars.zoomAccountSetting;
    getZoomConfigurationAjax(url);
    $('#setupzoommeeting').modal('show');
});

$("#google-calendar-setting").on('click',function() {
    url = jsVars.googleCalendarSetting;
    getGoogleCalendarConfigurationAjax(url);
    $('#setupgooglecalendar').modal('show');
});

$("html").on('click','#link_more_accounts',function() {
    url = jsVars.configureZoom;
    getZoomConfigurationAjax(url);
});

$("html").on('click','#link_more_gc_accounts',function() {
    url = jsVars.configureGoogleCalendar;
    getGoogleCalendarConfigurationAjax(url);
});

function getZoomConfigurationAjax(url){
    $.ajax({
        url: url,
        type: 'post',
        dataType: 'html',
        data:{type:'get_data'},
        beforeSend: function (xhr) {
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (data=='session') {
                window.location.reload(true);
            }else if (typeof data['error'] !='undefined') {
                alertPopup(data['error'],'error');
                $('#ErrorPopupArea').css('z-index',99999);
            }
            $("#zoom-modal-body").html(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.sectionLoader').hide();
            $('#errorText').hide();
            $(".sumo-select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true});
        }
    });
}

function getGoogleCalendarConfigurationAjax(url){
    $.ajax({
        url: url,
        type: 'post',
        dataType: 'html',
        data:{type:'get_data'},
        beforeSend: function (xhr) {
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (data=='session') {
                window.location.reload(true);
            }else if (typeof data['error'] !='undefined') {
                alertPopup(data['error'],'error');
                $('#ErrorPopupArea').css('z-index',99999);
            }
            $("#gc-modal-body").html(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.sectionLoader').hide();
            $('#errorText').hide();
            $(".sumo-select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true});
        }
    });
}

$("html").on('click','#verify_alias',function(){
    
    $.ajax({
        url: jsVars.varfiyZoomAlias,
        type: 'post',
        dataType: 'json',
        data: {'cPrefix': $('#cPrefix').val(),'fPrefix': $('#fPrefix').val(),'pPrefix': $('#pPrefix').val(), 'zoomAlias' : $('#zoom_alias').val()},
        beforeSend: function (xhr) {
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (typeof data['session'] != 'undefined') {
                window.location.reload(true);
            }else if (typeof data['status'] !='undefined' && data['status'] == 0) {
                $('#errorText').show();
                $('#errorText').html(data['message']);
            }else if(typeof data['status'] !='undefined' && data['status'] == 1)  {                
                zoom_link = data['loginLink']
                window.open(zoom_link,"_self");
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
});

$("html").on('click','#verify_gc_alias',function(){
    
    $.ajax({
        url: jsVars.verfiyGcAlias,
        type: 'post',
        dataType: 'json',
        data: {'cPrefix': $('#cPrefix').val(),'fPrefix': $('#fPrefix').val(),'pPrefix': $('#pPrefix').val(), 'gcAlias' : $('#gc_alias').val()},
        beforeSend: function (xhr) {
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (typeof data['session'] != 'undefined') {
                window.location.reload(true);
            }else if (typeof data['status'] !='undefined' && data['status'] == 0) {
                $('#errorText').show();
                $('#errorText').html(data['message']);
            }else if(typeof data['status'] !='undefined' && data['status'] == 1)  {                
                gc_link = data['loginLink']
                window.open(gc_link,"_self");
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
});


$('html').on('click','.account-list',function(){
    var account_id = $(this).attr('id');
    if($(this).find('a').hasClass('collapsed')){
        getAccountDetails(account_id);
    }
});

function getAccountDetails(account_id){
    $.ajax({
        url: jsVars.accountDetails,
        type: 'post',
        dataType: 'html',
        data: { account_id : account_id },
        beforeSend: function (xhr) {
            $('.loader-block').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (data=='session') {
                window.location.reload(true);
            }else if (typeof data['error'] !='undefined') {
                alertPopup(data['error'],'error');
                $('#ErrorPopupArea').css('z-index',99999);
            }
            $("#accountDetails"+account_id).html(data);
            $('#setupzoommeeting').modal('show');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.loader-block').hide();
            $('#errorText').hide();
            $(".sumo-select").SumoSelect({search: true, placeholder:$(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText:$(this).data('placeholder'), triggerChangeCombined: true });
            disableSelectedUser();
        }
    });
}

$('html').on('click','#map_users',function(){
    var formData = $("#zoomUserMapping").serializeArray();
    $.ajax({
        url: jsVars.zoomUserMapping,
        type: 'post',
        dataType: 'json',
        data: formData,
        beforeSend: function (xhr) {
            $('.loader-block').show();
            $('#map_users').attr('disabled',true);
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (data=='session') {
                window.location.reload(true);
            }else if (typeof data['error'] !='undefined' || (typeof data['status'] !='undefined' && data['status']== 0)) {
                alertPopup(data['error'],'error');
                $('#ErrorPopupArea').css('z-index',99999);
            } else {         
                alertPopup(data['message'],'success');
                $('#SuccessPopupArea').css('z-index',99999);              
                $('[data-toggle="collapse"]').trigger('click');               
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('#map_users').attr('disabled',false);
            $('.loader-block').hide();
            $('#errorText').hide();
            $(".sumo-select").SumoSelect({search: true, placeholder:$(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText:$(this).data('placeholder'), triggerChangeCombined: true });
        }
    });
})


$('[data-toggle="popover"]').popover();

function disconnectZoomAccount(account_id){
    $('#ConfirmMsgBody').html('Are you sure to disconnect this account ?');
    $('#ConfirmPopupArea').css('z-index',99999);
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
   .off('click', '#confirmYes')
   .one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $('#ConfirmPopupArea').modal('hide');
        disconnectZoomAjax(account_id);
    })
}

function disconnectGoogleAccount(account_id){
    $('#ConfirmMsgBody').html('Are you sure to disconnect this account ?');
    $('#ConfirmPopupArea').css('z-index',99999);
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
   .off('click', '#confirmYes')
   .one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $('#ConfirmPopupArea').modal('hide');
        disconnectGoogleAjax(account_id);
    })
}

function disconnectZoomAjax(account_id){
    $.ajax({
        url: jsVars.disconnectZoomAccount,
        type: 'post',
        dataType: 'json',
        data: {'account_id': account_id,},
        beforeSend: function (xhr) {
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (typeof data['session'] != 'undefined') {
                window.location.reload(true);
            }
            else if (typeof data['error'] !='undefined') {
                alertPopup(data['error'],'error');
                $('#ErrorPopupArea').css('z-index',99999);
            }
            else {                
                alertPopup(data['message'],'success');
                $("#zoom-account-setting").trigger('click');
                $('#SuccessPopupArea').css('z-index',99999);
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
}

function disconnectGoogleAjax(account_id){
    $.ajax({
        url: jsVars.disconnectGoogleAccount,
        type: 'post',
        dataType: 'json',
        data: {'account_id': account_id,},
        beforeSend: function (xhr) {
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (typeof data['session'] != 'undefined') {
                window.location.reload(true);
            }
            else if (typeof data['error'] !='undefined') {
                alertPopup(data['error'],'error');
                $('#ErrorPopupArea').css('z-index',99999);
            }
            else {                
                alertPopup(data['message'],'success');
                $("#google-calendar-setting").trigger('click');
                $('#SuccessPopupArea').css('z-index',99999);
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
}

$('html').on('click','.emailTempList',addNewTemplate);

var redirectCommunicationTemplate = function(tid,tname){
    $('#templateModal').modal('hide');
    $(document).find('#applicantEmail')[0].sumo.add(tid,tname, -1);
    $(document).find('#applicantEmail')[0].sumo.selectItem(tid);
    $(document).find('#evaluatorEmail')[0].sumo.add(tid,tname, -1);
    $(document).find('#evaluatorEmail')[0].sumo.selectItem(tid);
};

function addNewTemplate(){
    $(document).find('select').removeClass('addNewTemplate');
    if( $(this).val()==="addNewCommuTemplate" ){
        var sumoSelectId = $(this).attr('id');
        $('#applicantEmail').addClass('addNewTemplate');
        $('#evaluatorEmail').addClass('addNewTemplate');
        createCommunicationTemplate(sumoSelectId);
    }
}

function createCommunicationTemplate(sumoSelectId){
    $('#templateModal').modal('show');
    var iframeSrc;
    if(sumoSelectId === 'applicantEmail' || sumoSelectId === 'evaluatorEmail') {
        iframeSrc = jsVars.createEmailTemplateLink+'/'+sumoSelectId;
    } 
    $("#templateModal iframe").attr({
            'src':iframeSrc
    });
    $('#templateModal').on('hidden.bs.modal', function(){
        $("#modalIframeEmbed").html("");
        $("#modalIframeEmbed").attr("src", "");
    });
}

/***********Microsoft Teams Setting Ajax***************/
$("#msteams-account-setting").on('click',function() {
    var url = jsVars.msTeamsAccountSetting;
    getMsTeamsConfigurationAjax(url);
    $('#setupmsteamsmeeting').modal('show');
});

function getMsTeamsConfigurationAjax(url){
    $.ajax({
        url: url,
        type: 'post',
        dataType: 'html',
        data:{type:'get_data'},
        beforeSend: function (xhr) {
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (data=='session') {
                window.location.reload(true);
            }else if (typeof data['error'] !='undefined') {
                alertPopup(data['error'],'error');
                $('#ErrorPopupArea').css('z-index',99999);
            }
            $("#msteams-modal-body").html(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.sectionLoader').hide();
            $('#errorText').hide();
            $(".sumo-select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true});
        }
    });
}


$("html").on('click','#verify_msteams_alias',function(){
    $.ajax({
        url: jsVars.verifyMsTeamsAlias,
        type: 'post',
        dataType: 'json',
        data: {'cPrefix': $('#cPrefix').val(),'fPrefix': $('#fPrefix').val(),'pPrefix': $('#pPrefix').val(), 'msTeamsAlias' : $('#ms_teams_alias').val()},
        beforeSend: function (xhr) {
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (typeof data['session'] != 'undefined') {
                window.location.reload(true);
            }else if (typeof data['status'] !='undefined' && data['status'] == 0) {
                $('#errorText').show();
                $('#errorText').html(data['message']);
            }else if(typeof data['status'] !='undefined' && data['status'] == 1)  {                
                var ms_teams_link = data['loginLink']
                window.open(ms_teams_link,"_self");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.sectionLoader').hide();
        }
    });
});

$("html").on('click','#link_more_msteams_accounts',function() {
    url = jsVars.configureMsTeams;
    getMsTeamsConfigurationAjax(url);
});


function disconnectMsTeamsAccount(account_id){
    $('#ConfirmMsgBody').html('Are you sure to disconnect this account ?');
    $('#ConfirmPopupArea').css('z-index',99999);
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
   .off('click', '#confirmYes')
   .one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $('#ConfirmPopupArea').modal('hide');
        disconnectMsTeamsAjax(account_id);
    })
}


function disconnectMsTeamsAjax(account_id){
    $.ajax({
        url: jsVars.disconnectMsTeamsAccount,
        type: 'post',
        dataType: 'json',
        data: {'account_id': account_id,},
        beforeSend: function (xhr) {
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (typeof data['session'] != 'undefined') {
                window.location.reload(true);
            }
            else if (typeof data['error'] !='undefined') {
                alertPopup(data['error'],'error');
                $('#ErrorPopupArea').css('z-index',99999);
            }
            else {                
                alertPopup(data['message'],'success');
                $("#msteams-account-setting").trigger('click');
                $('#SuccessPopupArea').css('z-index',99999);
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

$('html').on('click','.ms-account-list',function(){
    var account_id = $(this).attr('id');
    if($(this).find('a').hasClass('collapsed')){
        getMsTeamsAccountDetails(account_id);
    }
});

function getMsTeamsAccountDetails(account_id){
    $.ajax({
        url: jsVars.msTeamsAccountDetails,
        type: 'post',
        dataType: 'html',
        data: { account_id : account_id },
        beforeSend: function (xhr) {
            $('.loader-block').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (data=='session') {
                window.location.reload(true);
            }else if (typeof data['error'] !='undefined') {
                alertPopup(data['error'],'error');
                $('#ErrorPopupArea').css('z-index',99999);
            }
            $("#accountDetails"+account_id).html(data);
            $('#setupmsteamsmeeting').modal('show');
        },
        error: function (xhr, ajaxOptions, thrownError) {            
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.loader-block').hide();
            $('#errorText').hide();
            $(".sumo-select").SumoSelect({search: true, placeholder:$(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText:$(this).data('placeholder'), triggerChangeCombined: true });
        }
    });
}

$('html').on('click','#ms_teams_map_users',function(){
    var formData = $("#msTeamsUserMapping").serializeArray();
    $.ajax({
        url: jsVars.msTeamsUserMapping,
        type: 'post',
        dataType: 'json',
        data: formData,
        beforeSend: function (xhr) {
            $('.loader-block').show();
            $('#ms_teams_map_users').attr('disabled',true);
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (data=='session') {
                window.location.reload(true);
            }else if (typeof data['error'] !='undefined' || (typeof data['status'] !='undefined' && data['status']== 0)) {
                alertPopup(data['error'],'error');
                $('#ErrorPopupArea').css('z-index',99999);
            } else {         
                alertPopup(data['message'],'success');
                $('#SuccessPopupArea').css('z-index',99999);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {           
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('#ms_teams_map_users').attr('disabled',false);
            $('.loader-block').hide();
            $('#errorText').hide();
            $(".sumo-select").SumoSelect({search: true, placeholder:$(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText:$(this).data('placeholder'), triggerChangeCombined: true });
        }
    });
});
