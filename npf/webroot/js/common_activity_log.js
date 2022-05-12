
//make ticket number clickable in user activity logs
$(document).on('click', '.ticket-log-details', function(){    
    var ticketNo = $(this).attr('title');
    var ticketDetails = $(this).attr('alt');
    $('#ActivityLogPopupArea .modal-title').html('Ticket Raised:#'+ticketNo);
    $('#ActivityLogPopupHTMLSection').html(ticketDetails);
    $('#ActivityLogPopupArea').modal({backdrop: 'static', keyboard: false});
    //$('#ActivityLogPopupArea .modal-header').css('background-color', '#a0c348');
    $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
});
//make Log number clickable in user activity logs
$(document).on('click', '.template-log-details', function(){    
    var logId = $(this).attr('alt');
    var template_type = $(this).attr('title');  
    var datakey = $(this).attr('data-key');
    var applicantId  =  $("#userId",$(".profileDetail")).val();
    getCommunicationPreview(logId, template_type,applicantId,datakey);
});

/**
 * getCommunicationPreview - this function will show the email/sms template in popup on basis of communication log ID
 * @param {type} logId
 * @param {type} template_type
 * @returns {undefined}
 */

function getCommunicationPreview(logId, template_type,applicantId,datakey) {
    $.ajax({
        url: jsVars.GetCommunicationPreview,
        data: {communicationId: logId,applicantId: applicantId,datakey: datakey},
        dataType: "json",
        async: false,
        cache: false,
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('body div.loader-block').show();
            $("#ConfirmPopupArea").modal('hide');
        },
        complete: function () {
            $('body div.loader-block').hide();
        },
        success: function (json) {
            var template_body = '';
            if(json['comLog'] != ''){
                if(json['comLog'].type == 'sms' || json['comLog'].type == 'automation_sms'){                    
                    template_text = "<div class='report-popup-main'>";
                    if(json['comLog'].dlt_template_id){                        
                        template_text += "<small class='text-muted font-weight-bold d-inline-block mr-5'>Template DLT Id</small><p class='d-inline-block'>"+json['comLog'].dlt_template_id+"</p>";
                    }
//                    if(json['comLog'].version){
//                       template_text += "<div class='report-popup'><div class='report-popup-left ag-popup-left'>Version</div><div class='report-popup-right ag-popup-right'>"+json['comLog'].version+"</div></div>";
//                    }
//                    if(json['comLog'].template_title){
//                       template_text += "<div class='report-popup'><div class='report-popup-left ag-popup-left'>Template Name</div><div class='report-popup-right ag-popup-right'>"+json['comLog'].template_title+"</div></div>";
//                    }
//                    if(json['comLog'].channel){
//                       template_text += "<div class='report-popup'><div class='report-popup-left ag-popup-left'>Nature of Template</div><div class='report-popup-right ag-popup-right'>"+json['comLog'].channel+"</div></div>";
//                    }                    
                    template_text += "</div>";
                    template_body = json['comLog'].body;
                    

                }else if(json['comLog'].type === 'whatsapp' || json['comLog'].type === 'automation_whatsapp_send' || json['comLog'].type === 'whatsapp_business'){                    
                    template_text = "<div class='report-popup-main'>";
//                    if(json['comLog'].version){
//                        template_text += "<div class='report-popup'><div class='report-popup-left ag-popup-left'>Version</div><div class='report-popup-right ag-popup-right'>"+json['comLog'].version+"</div></div>";
//                    }
                    if(json['comLog'].whatsapp_template_id){
                       template_text += "<small class='text-muted font-weight-bold d-inline-block mr-5'>Whatsapp Template Title</small><p class='d-inline-block'>"+json['comLog'].whatsapp_template_id+"</p>";
                    }
                    
                    if(typeof json.comLog.attachment !== "undefined") {
                        template_text += "<div class='marign-top-15'><small class='text-muted font-weight-bold d-inline-block mr-5'>Attachment</small><p class='d-inline-block'>";
                        $.each(json.comLog.attachment, function(key,value) {
                            //template_text +="<br><b class='nowrap'><i class='fa fa-paperclip' aria-hidden='true'></i> Attachment:-</b><a href="+value.file_path+" download>"+ value.file_name+"</a>";
                            template_text += "&nbsp;<a href=="+value.file_path+" download><i class='fa fa-paperclip' aria-hidden='true'></i>"+ value.file_name+"</a>";                            
                        });
                        template_text +="</p></div>";
                    }
                    template_body = json['comLog'].body;

                }else{    
                    template_text = "<div class='report-popup-main'>";
//                    if(json['comLog'].version){
//                       template_text += "<div class='report-popup'><div class='report-popup-left ag-popup-left'>Version</div><div class='report-popup-right ag-popup-right'>"+json['comLog'].version+"</div></div>";
//                    }
//                    if(json['comLog'].template_title){
//                       template_text += "<div class='report-popup'><div class='report-popup-left ag-popup-left'>Template Name</div><div class='report-popup-right ag-popup-right'>"+json['comLog'].template_title+"</div></div>";
//                    }
//                    if(json['comLog'].sender_name){
//                       template_text += "<div class='report-popup'><div class='report-popup-left ag-popup-left'>From Name</div><div class='report-popup-right ag-popup-right'>"+json['comLog'].sender_name+"</div></div>";
//                    }
//                    if(json['comLog'].from_email){
//                       template_text += "<div class='report-popup'><div class='report-popup-left ag-popup-left'>From Email</div><div class='report-popup-right ag-popup-right'>"+json['comLog'].from_email+"</div></div>";
//                    }
                    if(json['comLog'].subject){
                       template_text += "<small class='text-muted font-weight-bold d-inline-block mr-5'>Subject</small><p class='d-inline-block'>"+json['comLog'].subject+"</p>";
                    }
//                    if(json['comLog'].channel){
//                       template_text += "<div class='report-popup'><div class='report-popup-left ag-popup-left'>Nature of Template</div><div class='report-popup-right ag-popup-right'>"+json['comLog'].channel+"</div></div>";
//                    }
                    
                    if(typeof json.comLog.attachment !== "undefined") {
                        template_text += "<div class='marign-top-15'><small class='text-muted font-weight-bold d-inline-block mr-5'>Attachment</small><p class='d-inline-block'>";
                        $.each(json.comLog.attachment, function(key,value) {
                            //template_text +="<br><b class='nowrap'><i class='fa fa-paperclip' aria-hidden='true'></i> Attachment:-</b><a href="+value.file_path+" download>"+ value.file_name+"</a>";
                            template_text += "&nbsp;<a href=="+value.file_path+" download><i class='fa fa-paperclip' aria-hidden='true'></i>"+ value.file_name+"</a>";                            
                        });
                        template_text +="</p></div>";
                    } 
                    template_text += "</div>";
                    template_body = json['comLog'].body;
                }
                if(json['comLog'].version){
                    $('#templatePreviewModal .modal-title').html('<span class="templatename" data-toggle="tooltip" title="'+json['comLog'].template_title+'" data-placement="bottom">'+json['comLog'].template_title+'</span><span class="versionname margin-left-8">(v'+json['comLog'].version+')</span>');
                    
                }
                else{
                    $('#templatePreviewModal .modal-title').html(template_type+' Preview');
                }
  
                template_body = '<div class="iframeloader"><div style="overflow:auto; border:1px solid #ccc; height: calc(100vh - 130px);padding:10px" width="100%" id="myIframe">'+template_body+'</div></div>';
                template_text += template_body;                
                $('.modal#templatePreviewModal #MsgBody').html(stripslashes(template_text));
                $('#templatePreviewModal').modal({backdrop: 'static', keyboard: false});
                $('#templatePreviewModal .modal-dialog').addClass('modal-lg');
                $('#templatePreviewModal .modal-body').removeClass('text-center');
                setTimeout(function(){
                   $('.iframeloader').css('background-image', 'url("")');
                }, 1000);
            }
        },
        error: function (response) {
            alertPopup(response.responseText,'error');
        },
        failure: function (response) {
            alertPopup(response.responseText,'error');
        }
    });
}

function stripslashes(str) {
    str = str.replace(/\\'/g, '\'');
    str = str.replace(/\\"/g, '"');
    str = str.replace(/\\0/g, '\0');
    str = str.replace(/\\\\/g, '\\');
    return str;
}

$(document).on('click', '.whatsapp-template-log-details', function(){    
    var communicationtype = $(this).attr('alt');
    var template_type = $(this).attr('title');
    var collegeId = $("#collegeId").val();
    getWhatsappCommunicationPreview(communicationtype, template_type,collegeId);
});

function getWhatsappCommunicationPreview(communicationtype, template_type,collegeId) {
    $.ajax({
        url: '/communications/get-communication-whatsapp-preview',
        data: {communicationtype: communicationtype,collegeId: collegeId},
        dataType: "json",
        async: false,
        cache: false,
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('body div.loader-block').show();
            $("#ConfirmPopupArea").modal('hide');
        },
        complete: function () {
            $('body div.loader-block').hide();
        },
        success: function (json) {
            if(json['comLog'] !== ''){                   
                var template_text = json['comLog'].body;
                $('#ActivityLogPopupArea .modal-title').html(template_type+' Preview');
                $('#ActivityLogPopupHTMLSection').html(template_text);
                $('#ActivityLogPopupArea').modal({backdrop: 'static', keyboard: false});
                $('#ActivityLogPopupArea .modal-dialog').addClass('modal-lg');
                $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
            }
        },
        error: function (response) {
            alertPopup(response.responseText,'error');
        },
        failure: function (response) {
            alertPopup(response.responseText,'error');
        }
    });
}

/**
 * Reset the filters on activity form
 * @returns {Boolean}
 */
function ResetFilterValue(){
    $('#FilterActivityForm').find('input[type="text"]').each(function(){
       $(this).val('');
    });
    $('#FilterActivityForm').find('select').each(function(){
       this.selected = false;
       $(this).val('');
       $(this).trigger("chosen:updated");
    });
  
    return false;
}

/**
 * - get filters preview for LMS and Application download activity
 * @param {type} filters
 * @param {type} type
 * @returns {undefined}
 */
function getFiltersPreview(filters, type){
    var filtersConfig = '';
    if(type == 'Application'){
        filtersConfig = jsVars.ApplicationFiltersConfig;
    }else if(type == 'LMS'){
        filtersConfig = jsVars.LMSFiltersConfig;
    }else if(type == 'ProductivityReport'){
        filtersConfig = '';
    }else{
        return;
    }
    
    $.ajax({
        url: jsVars.GetFiltersPreview,
        data: {filters: filters, filtersConfig: filtersConfig, type : type},
        dataType: "html",
        async: false,
        cache: false,
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('body div.loader-block').show();
            $("#ConfirmPopupArea").modal('hide');
        },
        complete: function () {
            $('body div.loader-block').hide();
        },
        success: function (data) {
            
            data = data.replace("<head/>", '');
            
            $('#ActivityLogPopupArea .modal-title').html('Filters Preview');
            $('#ActivityLogPopupHTMLSection').html(data);
            $('#ActivityLogPopupArea').modal({backdrop: 'static', keyboard: false});
            //$('#ActivityLogPopupArea .modal-header').css('background-color', '#a0c348');
            $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
            $('#ActivityLogPopupArea .modal-dialog').css('width', '600px');
            
            
        },
        error: function (response) {
            alertPopup(response.responseText);
        },
        failure: function (response) {
            alertPopup(response.responseText);
        }
    });
    
}

$(document).on('click', '.chat-log-details', function(){
    var logId = $(this).data('mid');
    var college_id = $(this).attr('title');
    getChatPreview(logId,college_id);
});

/**
 * getChatPreview - this function will show the email/sms template in popup on basis of communication log ID
 * @param {type} chatId
 * @param {type} college_id
 * @returns {undefined}
 */

function getChatPreview(chatId,college_id) {
    $.ajax({
        url: jsVars.getChatDetails,
        data: {chat_detail_id: chatId, college_id:college_id},
        dataType: "html",
        async: false,
        cache: false,
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('body div.loader-block').show();
            $("#ConfirmPopupArea").modal('hide');
        },
        complete: function () {
            $('body div.loader-block').hide();
        },
        success: function (json) {
            if(json=='session_logout'){
                window.location.reload(true);
            }
            if(json!= ''){
                $('#ActivityLogPopupArea .modal-title').html('Chat Preview');
                $('#ActivityLogPopupHTMLSection').html(json);
                $('#ActivityLogPopupArea').modal({backdrop: 'static', keyboard: false});
                //$('#ActivityLogPopupArea .modal-header').css('background-color', '#a0c348');
                $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
            }
        },
        error: function (response) {
            alertPopup(response.responseText);
        },
        failure: function (response) {
            alertPopup(response.responseText);
        }
    });
}

function showUserUpdatedData(user_id){
    var html = $('#userassignedinstitute'+user_id).html();
    $('#ActivityLogPopupArea .modal-title').html('User Manager Edit Activity');
    $('#ActivityLogPopupHTMLSection').html(html);
    $('#ActivityLogPopupArea').modal({backdrop: 'static', keyboard: false});
    //$('#ActivityLogPopupArea .modal-header').css('background-color', '#a0c348');
    $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
}

function showEmailContent(mongo_id,college_id) {
    $.ajax({
//        url: '/connectors/gmail-apis/get-email-content',
        url: '/connectors/gmail-apis/iframe-email-content',
        data: {mongo_id:mongo_id, college_id:college_id},
        dataType: "json",
        async: false,
        cache: false,
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('body div.loader-block').show();
            $("#ConfirmPopupArea").modal('hide');
        },
        complete: function () {
            $('body div.loader-block').hide();
        },
        success: function (response) {
            if(typeof response.redirect != 'undefined' && response.redirect !==''){
                window.location.href = response.redirect;
            }
            else if(typeof response.error != 'undefined' && response.error != ''){
                $('#gmailContentPopupArea .modal-title').html('Email Content');
                $('#gmailContentPopupHTMLSection').html(response.error);
                $('#gmailContentPopupArea').modal({backdrop: 'static', keyboard: false});
                $('#gmailContentPopupArea .modal-dialog').addClass('modal-lg');
                $('#gmailContentPopupArea .modal-body').removeClass('text-center');
            }
            else if(typeof response.iframe!= 'undefined' && response.iframe != ''){
                $('#gmailContentPopupArea .modal-title').html('Email Content');
                $('#gmailContentPopupHTMLSection').html(response.iframe);
                $('#gmailContentPopupArea').modal({backdrop: 'static', keyboard: false});
                $('#gmailContentPopupArea .modal-dialog').addClass('modal-lg');
                $('#gmailContentPopupArea .modal-body').removeClass('text-center');
            }
        },
        error: function (response) {
            alertPopup(response.responseText);
        },
        failure: function (response) {
            alertPopup(response.responseText);
        }
    });
}

function showChatTranscriptContent(mongo_id,college_id,type) {
    $.ajax({
        url: '/leads/get-chat-transcript-content',
        data: {mongo_id:mongo_id, college_id:college_id, type:type},
        dataType: "html",
        async: false,
        cache: false,
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('body div.loader-block').show();
            $("#ConfirmPopupArea").modal('hide');
        },
        complete: function () {
            $('body div.loader-block').hide();
        },
        success: function (response) {
            if(response=='session_logout'){
                window.location.reload(true);
            }
            if(response!= ''){
                $('#ActivityLogPopupArea .modal-title').html('Chat Transcript');
                $('#ActivityLogPopupHTMLSection').html('<div class="chat_transcript">'+response+'</div>');
                $('#ActivityLogPopupArea').modal({backdrop: 'static', keyboard: false});
                $('#ActivityLogPopupArea .modal-dialog').addClass('modal-lg');
                $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
            }
        },
        error: function (response) {
            console.log(thrownError + "\r\n" + response.statusText + "\r\n" + response.responseText);
        },
        failure: function (response) {
            console.log(thrownError + "\r\n" + response.statusText + "\r\n" + response.responseText);
        }
    });
}

    
function showChatbotTranscript(channelSid,userIdentity,collegeId,applicantId,nextPageUrl){
    if(typeof(nextPageUrl)==="undefined"||nextPageUrl===null){
        nextPageUrl = '';
    }
    if($("#loadMoreNiaaConversation").length){
        $("#loadMoreNiaaConversation").remove();
    }
    $.ajax({
        url: '/chatbots/getChatbotTranscript',
        type: 'post',
        data: {'channelSid' : channelSid, 'userIdentity':userIdentity, 'collegeId' :collegeId,'nextPageUrl':nextPageUrl,'applicantId':applicantId },
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        async: true,
        beforeSend: function () {
            $('body div.loader-block').show();
            $("#ConfirmPopupArea").modal('hide');
        },
        complete: function () {
            $('body div.loader-block').hide();
        },
        success: function (responseHtml) {
            if (responseHtml === 'error:session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(responseHtml.indexOf('error:')>-1){
                var errorMsg = responseHtml.replace('error:','');
                alertPopup(errorMsg,'error');
            }
            else{
                if(nextPageUrl==''){
                    $('#ActivityLogPopupArea .modal-title').html('Niaa Conversation');
                    $('#ActivityLogPopupArea .modal-body').css('padding', '0');
                    $('#ActivityLogPopupHTMLSection').html('<div class="chat_niaa_transcript ">'+responseHtml+'</div>');
                    $('#ActivityLogPopupArea').modal({backdrop: 'static', keyboard: false});
                    $('#ActivityLogPopupArea .modal-dialog').addClass('modal-lg');
                    $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
                    $("#__npfmessageWindow").find("input,a,button.ac-pushButton").attr("disabled", true);
                }else{
                    $('#messages').append(responseHtml);
                    $("#__npfmessageWindow").find("input,a,button.ac-pushButton").attr("disabled", true);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

    
function showNpfChatbotTranscript(channelSid,userIdentity,collegeId,applicantId,page){
    if(typeof(page)==="undefined"||page===null){
        page = 1;
    }
    if($("#loadMoreNiaaConversation").length){
        $("#loadMoreNiaaConversation").remove();
    }
    $.ajax({
        url: '/chatbots/getChatbotTranscript',
        type: 'post',
        data: {'channelSid' : channelSid, 'userIdentity':userIdentity, 'collegeId' :collegeId,'page':page,'applicantId':applicantId, "npfchatbot":1 },
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        async: true,
        beforeSend: function () {
            $('body div.loader-block').show();
            $("#ConfirmPopupArea").modal('hide');
        },
        complete: function () {
            $('body div.loader-block').hide();
        },
        success: function (responseHtml) {
            if (responseHtml === 'error:session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(responseHtml.indexOf('error:')>-1){
                var errorMsg = responseHtml.replace('error:','');
                alertPopup(errorMsg,'error');
            }
            else{
                if(page==1){
                    $('#ActivityLogPopupArea .modal-title').html('Niaa Conversation');
                    $('#ActivityLogPopupArea .modal-body').css('padding', '0');
                    $('#ActivityLogPopupHTMLSection').html('<div class="chat_niaa_transcript ">'+responseHtml+'</div>');
                    $('#ActivityLogPopupArea').modal({backdrop: 'static', keyboard: false});
                    $('#ActivityLogPopupArea .modal-dialog').addClass('modal-lg');
                    $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
                }else{
                    $('#ActivityLogPopupHTMLSection').find("#messages").append(responseHtml);
                }
                $("#__npfmessageWindow").find("input,a,button.ac-pushButton,select").attr("disabled", true);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function showWhatsAppChatHistory(collegeId,applicantId,mobile_number,page){
    if(typeof(page)==="undefined"||page===null){
        page = 1;
    }
    if($("#loadMoreNiaaConversation").length){
        $("#loadMoreNiaaConversation").remove();
    }
    $.ajax({
        url: '/chatbots/getChatbotTranscript',
        type: 'post',
        data: {'channelSid' : collegeId, 'userIdentity':applicantId, 'collegeId' :collegeId,'page':page,'applicantId':applicantId, "npfWhatsAppchat":1, 'mobile_number': mobile_number },
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        async: true,
        beforeSend: function () {
            $('body div.loader-block').show();
            $("#ConfirmPopupArea").modal('hide');
        },
        complete: function () {
            $('body div.loader-block').hide();
        },
        success: function (responseHtml) {
            if (responseHtml === 'error:session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(responseHtml.indexOf('error:')>-1){
                var errorMsg = responseHtml.replace('error:','');
                alertPopup(errorMsg,'error');
            }
            else{
                $('#ActivityLogPopupArea .modal-title').html('WhatsApp Chat History');
                $('#ActivityLogPopupArea .modal-body').css('padding', '0');
                $('#ActivityLogPopupHTMLSection').html('<div class="chat_niaa_transcript">'+responseHtml+'</div>');
                $('#ActivityLogPopupArea').modal({backdrop: 'static', keyboard: false});
                $('#ActivityLogPopupArea .modal-dialog').addClass('modal-lg');
                $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
                $("#__npfmessageWindow").find("input,a,button.ac-pushButton").attr("disabled", true);
                //$('#messages').hide();
                $('#ActivityLogPopupArea').on('shown.bs.modal', function (e) {
                    if($("#messages").length > 0){
                        var scrollHeight = $("#messages").height();
                         $('#__npfdivChatMain .chatBody').scrollTop($('#__npfdivChatMain .chatBody')[0].scrollHeight);
                        //$('#messages').delay(500).fadeIn();
                    }
                });

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function showWhatsAppNumbers(collegeId){
    $('.whatsappNumberOption').SumoSelect({placeholder: 'Select Whatsapp Number', search: true, searchText:'Select Whatsapp Number'});
    $.ajax({
        url: '/chatbots/getwhatsappConfigData/'+collegeId,
        type: 'get',
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        async: true,
        beforeSend: function () {
            $('body div.loader-block').show();
            $("#ConfirmPopupArea").modal('hide');
        },
        complete: function () {
            $('body div.loader-block').hide();
        },
        success: function (response) {
            if(response['status'] ===0 && response['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(response['status'] ===1) {
                if(Object.keys(response['data']['whatsappKeys']).length == 1){
                    var collegeId = $("#collegeId").val();
                    var userId = $("#userId").val();
                    showWhatsAppChatHistory(collegeId,userId,Object.values(response['data']['whatsappKeys'])[0])
                }else{
                    var options = '<option value="">Select WhatsApp Number</option>';
                    $.each( response['data']['whatsappKeys'], function( index, value ){
                        options += '<option value="'+index+'">'+value+'</option>';
                    });
                    $(document).find('#whatsappNumber').html(options);
                    $(document).find('#whatsappNumber')[0].sumo.reload();
                    $('#whatsappNumberModal').modal('show');
                   }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
}

$(document).on('click', '#whatsapp_chat_history', function(){    
    var collegeId = $("#collegeId").val();
    showWhatsAppNumbers(collegeId)
});

$(document).on('click', '#whatsAppNumberSubmit', function(){
    var collegeId = $("#collegeId").val();
    var userId = $("#userId").val();
    var mobile_number = $("#whatsappNumber").val();
    
    if(mobile_number == ''){
        $('#whatsapp_no_error').html('Please select whatsapp number.');
        return false;
    }
    else{
         $('#whatsapp_no_error').html('');
         $("#whatsappNumberModal").modal('hide');
        showWhatsAppChatHistory(collegeId,userId,mobile_number)
    }
});
