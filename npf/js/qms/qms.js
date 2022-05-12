/*
 * To handle Query manager Javascript Functions.
 */
var stopLoadMoreOnMobile = false;
$(document).ready(function(){
    //Set Default Category Options
    if($('input[name=\'Ticket[ParentCategory]\']').length > 0)
    {
        var DefaultRadioCategoryId = $('input[name=\'Ticket[ParentCategory]\']').val();
        if(parseInt(DefaultRadioCategoryId) > 0)
        {
            ChangeCategoryList(DefaultRadioCategoryId);
        }
    }

    //Student My Ticket Page Js
    if (parseInt($('div#StudentMyTicketPage').length) > 0)
    {
        if((typeof jsVars.isMobile != 'undefined') && (typeof jsVars.TicketNumber == 'undefined'))
        {
            var MyTicketStartPage = 0;
            LoadMoreMyTickets('reset','','',MyTicketStartPage);
    //        $(document).on('scrollstart',function(){ alert('asdf');
    //           //LoadMoreMyTickets('listing');
    //        });

            $(window).scroll(function() {
                if(($(this).scrollTop() + $(this).height()) == $(document).height()) {
                    if (!stopLoadMoreOnMobile) {
                        LoadMoreMyTickets('listing');
                    }
                }
            });
        }
        else if(typeof jsVars.isMobile == 'undefined')
        {
            var MyTicketStartPage = 0;
            LoadMoreMyTickets('reset','','',MyTicketStartPage);
        }
        //show requested ticket number details
        if((typeof jsVars.isMobile != 'undefined') && (typeof jsVars.TicketNumber != 'undefined'))
        {
            $('#LoadMoreSection').hide();
            ShowTicketDetails(jsVars.TicketNumber,'TicketDetailsDivContainer');
        }
        else if(typeof jsVars.TicketNumber != 'undefined')
        {
            ShowTicketDetails(jsVars.TicketNumber,'TicketDetailsDivContainer');
        }
    }

    //Student My Ticket Page Js
    if ($('#TicketDetailsDivContainer').length > 0)
    {
        //show requested ticket number details
        if(typeof jsVars.TicketNumber != 'undefined')
        {
            ShowTicketDetails(jsVars.TicketNumber,'TicketDetailsDivContainer');
        }
    }
    var selected_college_id = $('#college_id').val();
    var s_college_id = $('select[name="s_college_id[]"]');
    if(s_college_id.length > 0 && s_college_id != '' && s_college_id !='undefined' && s_college_id != 0){
        $('#CreateLeadStartBtn').hide();
        LoadMultipleCollegeFormsMultipleSelect(s_college_id);
        var preSelectedUser = '';
        if (typeof jsVars.filterAssignedToUser != 'undefined') {
            preSelectedUser = jsVars.filterAssignedToUser;
        }
        getCollegeAllUsersData(preSelectedUser);
        getCategoryOptionsByCollege(s_college_id);
    }
    $("#payment_statusid").hide();
//    if(selected_college_id !='' && selected_college_id !='undefined' && selected_college_id != 0){
//        var _this = $('#college_id');
//        $('#CreateLeadStartBtn').hide();
//        LoadMultipleCollegeFormsMultipleSelect(_this);
//        getCollegeAllUsersData();
//        getCategoryOptionsByCollege(_this);
//    }
});

function validateQMSFilter(){
    if($('#downloadRequestUrl').val() =='' || $('#college_id').val() == null || $('#college_id').val().length != 1 ) {
        alertPopup('Please select Only One College and Apply Filter','error');
        return false;
    }
    if($('#downloadRequestUrl').val() != '') {
        $('#downloadListing').attr('href',$('#downloadRequestUrl').val());
    }
    //$('#downloadRequestUrl').val('');
    $('#confirmDownloadTitle').text('Download Confirmation');
    $('#ConfirmDownloadPopupArea .npf-close').hide();
    $('.confirmDownloadModalContent').text('Do you want to download the queries?');
    $('#ConfirmDownloadPopupArea').modal();
    var $form = $("#FilterLeadForm");
    $form.attr("action",jsVars.FULL_URL+'/query/ajax-lists');
    $form.attr("target",'modalIframe');
    $form.append($("<input>").attr({"value":"export", "name":"type",'type':"hidden","id":"export"}));
    $form.append($("<input>").attr({"value":$('#ticket_id').val(), "name":"ticket_id",'type':"hidden","id":"ticket_id_hidden"}));
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    $('#confirmDownloadYes').on('click',function(){
        $('#ConfirmDownloadPopupArea').modal('hide');
        //$form.append($("<input>").attr({"value": "export", "name": "export", 'type': "hidden", "id": "export"}));
        $( "#confirmDownloadYes").unbind( "click" );
        var data = $form.serializeArray();
        $form.ajaxSubmit({
            url: jsVars.FULL_URL+'/query/ajax-lists',
            type: 'post',
            data : data,
            dataType:'html',
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            success:function (response){
                if(response == 'session_logout') {
                    window.location.href = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else if(response != 'error') {
                    alertPopup(response,'error');
                } else {
                    $('#muliUtilityPopup').modal('show');
                    $('#muliUtilityPopup .close').addClass('npf-close').css('margin-top', '2px');
                }
            }
        });
        $form.attr("onsubmit", onsubmit_attr);
        $form.find('input[name="export"]').val("");
        $form.find('#ticket_id_hidden').val("");
        $form.removeAttr("target");
        $form.removeAttr("onsubmit");
        $("#export").remove();
        $("#ticket_id_hidden").remove();
    });
}

$('#popupDismiss').on('click',function() {
    if($('#QueryMangerBackend').length>0) {
        $( "#confirmDownloadYes").unbind( "click" );
    }
});





function getFileData(myFile){
    var file = myFile.files[0];
    var filename = file.name;
    if(filename!='undefined'){
        $('#attachmentPlaceholder').val(filename);
    }
}
$(document).on('click','#formsubmitbtn',function(){
    $('form#QueryForm').submit();
});

//Submit Query Form
var isVarQueryForm=false;
$(document).on('submit', 'form#QueryForm',function(e) {
    e.preventDefault();
    if(isVarQueryForm==true) { //check whether ajax hit is already calle. If already called then return from here
        return;
    }
    isVarQueryForm=true; //If ajax hit is called then set this variable to true

    //Disable the Submit Button
    $("form#QueryForm #formsubmitbtn").attr('disabled','disabled');

    $('.help-block').text('');
    var data = $(this).serializeArray();
    $('div#QMSLoaderContainer').show();
    $(this).ajaxSubmit({
        data : data,
        async: false,
        dataType:'json',
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success:function (json){
            //Remove disabled
            $("form#QueryForm #formsubmitbtn").removeAttr('disabled');

            isVarQueryForm=false;

            $('div#QMSLoaderContainer').hide();
            if(json['redirect'])
            {
                location = json['redirect'];
            }
            else if(json['error'])
            {
                for(var name in json['error'])
                {
                    //alert(json['error'][name]);
                    var Parent = $('#'+name).closest('div.form-group');
                    $(Parent).find('p.help-block').html(json['error'][name]);
                    $(Parent).addClass('has-error');
                }
            }
            else if(json['success'] == 200)
            {
                $('#form_container_html').hide();
                $('#thankyou_html').html(json['msg']);
                $('#thankyou_html').show();

                // REST FORM VALUE
                resetQueryForm('QueryForm');

                if(typeof jsVars.isMobile != 'undefined')
                {
                    $('#formsubmitbtn').text('OK');
                    $('#formsubmitbtn').attr('onclick','location=window.location.href');
                }

                // auto close after 10 sec
                setTimeout(function(){
                    if(typeof jsVars.isMobile != 'undefined')
                    {
                        $('#MobileQmsCloseBtn').trigger('click');
                        $('#form_container_html').show();
                        getQMSData();
                        $('#thankyou_html').html('');
                        $('#thankyou_html').hide();
                    }
                    else
                    {
                        if($('.cont-rght-side-fixed').length>0){
                            var class_html = $('.cont-rght-side-fixed').attr('class');
                            var class_html_array = class_html.split(' ');
                            if(class_html_array.indexOf('open')>-1){
                                $('.cont-rght-side-fixed').toggleClass('open');
                            }
                        }
                    }

                }, 10000);


            }
        },
        resetForm: false
    });
    return false;
});



$(document).on('click','#replyButton',function(){
    //$('.help-block').hide();
    $("#replyButton").prop('disabled', true);
    var data = $('#TicketReplyForm').serializeArray();
    $('#TicketConversationLoaderContainer').show();
    $('#TicketReplyForm').ajaxSubmit({
        data : data,
        dataType:'json',
        complete: function () {
            $("#replyButton").prop('disabled', false);
        },
        error: function (xhr, ajaxOptions, thrownError) {
//            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $("#replyButton").prop('disabled', false);
        },
        success:function (json){

            $('div#TicketConversationLoaderContainer').hide();
            if(json['redirect'])
            {
                location = json['redirect'];
            }
            else if(json['error'])
            {
                if(json['error']['ticket_closed']) {
                    location.reload();
                } else {
                    for(var name in json['error'])
                    {
                        if((typeof jsVars.StudentGroupId == 'undefined') && (name == 'reply_text'))
                        {
                            $('#error_editor').html(json['error'][name]).show();
                        }
                        else if($('#error_'+name).length > 0)
                        {
                            $('#error_'+name).html(json['error'][name]).show();
                        }
                        $('div.'+name).addClass('has-error');
                    }
                }
            }
            else if(json['success'] == 200){
                $('#ParentHtmlContainerDiv').html(json['msg']);
                location.reload();
            }
        },
        resetForm: false
    });
    return false;
});

//on click TicketReplyForm's Submit btn
$(document).on('click','#SubmitReplyFormBtn',function(){
    $('form#TicketReplyForm').submit();
});

//Submit Ticket Reply Form
$(document).on('submit', 'form#TicketReplyForm',function(e) {
    e.preventDefault();
    //$('.help-block').hide();
    if(typeof CKEDITOR != 'undefined' && typeof CKEDITOR.instances['editor'] != 'undefined')
    {
        var old_data = CKEDITOR.instances['editor'].getData();
        $('textarea[name=\'TicketDetails[reply_text]\']').val(old_data);
    }
    var data = $(this).serializeArray();
    $('#TicketConversationLoaderContainer').show();
    $(this).ajaxSubmit({
        data : data,
        dataType:'json',
        success:function (json){
            $('div#TicketConversationLoaderContainer').hide();
            if(json['redirect'])
            {
                location = json['redirect'];
            }
            else if(json['error'])
            {
                for(var name in json['error'])
                {
                    if((typeof jsVars.StudentGroupId == 'undefined') && (name == 'reply_text'))
                    {
                        $('#error_editor').html(json['error'][name]).show();
                    }
                    else if($('#error_'+name).length > 0)
                    {
                        $('#error_'+name).html(json['error'][name]).show();
                    }
                    $('div.'+name).addClass('has-error');
                }
            }
            else if(json['success'] == 200)
            {

                $('#ParentHtmlContainerDiv').html(json['msg']);
                if(typeof jsVars.StudentGroupId == 'undefined' && typeof CKEDITOR != 'undefined')
                {
                    //rmove ckeditor
                    delete CKEDITOR.instances['editor'];
                    jQuery('#cke_editor').remove();
                }
                ShowTicketDetails(json['Ticket'],'TicketDetailsDivContainer');
            }
        },
        resetForm: false
    });
    return false;
});

//on click TicketReplyForm's Submit btn
$(document).on('click','#TicketFeedbackPopupSubmitBtn',function(){
    $('form#TicketFeedbackPopupForm').submit();
});

//Submit Ticket Reply Form
$(document).on('submit', 'form#TicketFeedbackPopupForm',function(e) {
    e.preventDefault();
    var data = $(this).serializeArray();
    $('div#TicketFeedbackPopupLoaderContainer').show();
    $(this).ajaxSubmit({
        data : data,
        dataType:'json',
        success:function (json){
            $('div#TicketFeedbackPopupLoaderContainer').hide();
            if(json['redirect'])
            {
                location = json['redirect'];
            }
            else if(json['error'])
            {
                for(var name in json['error'])
                {
                    $('p.help-block').html(json['error'][name]);
                }
            }
            else if(json['success'] == 200)
            {
                $('#TicketFeedbackPopup #MsgBody').html(json['msg']);
                $('#TicketFeedbackPopup #msgHeader').html('Your Feedback has been submitted successfully');
                $('#TicketFeedbackPopup .npf-close, #TicketFeedbackPopup .close').hide();
                $('#TicketFeedbackPopupForm').remove();
                $('#TicketFeedbackPopupSubmitBtn').text('OK');
                $('#TicketFeedbackPopupSubmitBtn').attr('onclick','location=window.location.href');
                $('#TicketFeedbackPopupSubmitBtn').show();

                 setTimeout(function(){
                    location=window.location.href;
                }, 10000);

            }
        },
        resetForm: false
    });
    return false;
});

$(document).on('click','.studentdashboardfooter',function(){
    if(parseInt($('#form_container_html').length) > 0){
        $('#thankyou_html').hide();
        $('#form_container_html').show();
        getQMSData();
        if($('.cont-rght-side-fixed').length>0){

            var class_html = $('.cont-rght-side-fixed').attr('class');
            var class_html_array = class_html.split(' ');
            if(class_html_array.indexOf('open')>-1){
                $('.cont-rght-side-fixed').toggleClass('open');
            }
        }
    }
});

$(document).on('click','.cont-rght-side-fixed #cont-us-btn',function(){
    $('#thankyou_html').hide();
    $('#form_container_html').show();
    $(".call-rght-side-fixed").removeClass('open');

    getQMSData();
    $('.cont-rght-side-fixed').toggleClass('open');
});

$(document).on('click','#quieryFormModalLink',function(){
    getQMSData();
    $('#callbackModal').modal('hide');
    $('#contact-us-block').modal('show');
});

function getQMSData()
{
    if($("#QueryForm").length){
        return;
    }
    $.ajax({
        url: jsVars.FULL_URL+'/getQMSData',
        data : {qms_new_design_applicable:$("#qms_new_design_applicable").val()},
        type: 'post',
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('div#QMSLoaderContainer').show();
        },
        complete: function () {
            $('div#QMSLoaderContainer').hide();
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
            $('.chosen-select').trigger('chosen:updated');
        },
        success: function (html) {
            $("#qmsFormDiv").html(html);
        },
        error: function (xhr, ajaxOptions, thrownError) {
//            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

//Mark Read/Unread Status
$(document).on('click','a.jsMark',function(){
    var CurrentStatus = $(this).attr('data-id');
    //var ParentTr = $(this).attr('data-number')
    var TicketNumber = $(this).attr('data-number')

    if(TicketNumber && CurrentStatus)
    {
        MarkAsStatus(TicketNumber,CurrentStatus);
    }
});

$(document).on("click", ".load_summary_records",function(){
    status=$(this).data("status");
	$('.lditem').removeClass('active');
	$(this).addClass('active');
    //prefill old deta
    //preFilledOldSearchCriteria('status_id',status);
    $('#status_id').val(status);
    //console.log($(this).data("status"));
    //alert("The paragraph was clicked.");
    // if(status=="total")LoadQMSDataNew("reset");
    //else
    LoadQMSDataNew("summary_data");
});

$(document).on('change', '#FilterLeadForm #form_id',function(e) {
   getCollegeAllUsersData();
});

 //Function: Mark as read/unread
 function MarkAsStatus(TicketNumber,CurrentStatus)
 {
    if(TicketNumber,CurrentStatus)
    {
        $.ajax({
            url: jsVars.MarkMyTicketStatusLink,
            type: 'post',
            dataType: 'json',
            data: {TicketNumber:TicketNumber,CurrentStatus:CurrentStatus},
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            beforeSend: function () {
                $('#listloader').show();
            },
            complete: function () {
                $('#listloader').hide();
            },
            success: function (json) {
                if (json['redirect']) {
                    location = json['redirect'];
                }
                else if(json['error'])
                {
                    alert(json['error']);
                }
                else if (json['success'] == 200)
                {
                    if(json['msg'])
                    {
                        if(CurrentStatus == 'unread')
                        {
                            $('tr#'+TicketNumber).addClass('readTicket');
                        }
                        else
                        {
                            $('tr#'+TicketNumber).removeClass('readTicket');
                        }
                        $('a#MarkStatusSection-'+TicketNumber).html(json['msg']['text']).attr('data-id',json['msg']['status']);
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('#listloader').hide();
            }
        });
    }

 }

//Parent Category change
function ChangeCategoryList(RadioCategoryId)
{
    //Hide Form List If Gen Category Selected
    if(typeof jsVars.QMS_GENERAL_CATEGORY != 'undefined')
    {

        var explodeCatname = RadioCategoryId.split('_');
        if(typeof explodeCatname[0]!='undefined' && explodeCatname[0] == jsVars.QMS_GENERAL_CATEGORY)
        {
            $('#QueryForm .makeMidetoryStar').html(' ');
        }
        else
        {
            $('#QueryForm .makeMidetoryStar').html('*');
        }
    }
//    var _csrfToken = (jsVars._csrfToken != 'null')?jsVars._csrfToken:$('#QueryForm input[name=\'_csrfToken\']').val();
//    $.ajax({
//        url: jsVars.GetChildCategoryListByParentId,
//        type: 'post',
//        dataType: 'json',
//        data: {id:RadioCategoryId,action:'get'},
//        headers: {'X-CSRF-TOKEN': _csrfToken},
//        success: function (json)
//        {
//            if (json['error'] == "session") {
//                location = json['redirect'];
//            }
//            else if(json['status'] == 200)
//            {
//                var CategoryHtml = json['html'];
//                $('#QueryForm #taxonomy_id').html(CategoryHtml);
//                $('.chosen-select').trigger('chosen:updated');
//            }
//        },
//        error: function (xhr, ajaxOptions, thrownError) {
//            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
//        }
//    });
}

//count characters
function ShowJsCounter(field_id,max_len)
{
    var content=$('#'+field_id).val();
    $('#counter_'+field_id).html(content.length);
    if(parseInt(max_len)>0 && content.length>parseInt(max_len))
    {
        var new_content=content.substr(0, max_len);
        $('#'+field_id).val(new_content);
    }
}

//show feedback popup
function ShowFeedbackPopup(TicketNumber)
{
    if(TicketNumber)
    {
        $('#TicketFeedbackPopupForm #unique_ticket_id').val(TicketNumber);
        $('#TicketFeedbackPopupLink').trigger('click');
    }
}


function LoadQMSDataNew(type,hide_modal,sortField,sortOrder) {
    var data = [];
        if (type == 'reset') {
            if(typeof hide_modal !== 'undefined') {
                $('#reAssignTicketsHTML').modal('hide');
            }

            $("#selectionRow").hide();
            Page = 0;
            $('#load_more_results').html("");
            $('#load_more_results_msg').html("");
            $('#load_more_button').show();
            $('#load_slider_data').html("");
            $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;Loading...');
            $('#status_id').val("");
            //$('#ticket_id').val("");
           // $('#OldSearchCriteria').val('');

            //data = $('#FilterLeadForm').serializeArray();
            //$('#OldSearchCriteria').val(JSON.stringify(data));
        }

        /*else if (type == 'ticket_search') {
            Page = 0;
            $('#load_more_results').html("");
            $('#load_more_results_msg').html("");
            $('#load_more_button').show();
            $('#load_more_button').html("Loading...");

            //based on old search
            //var OldSearch = $('#OldSearchCriteria').val();
            //data = $.parseJSON(OldSearch);
        }*/

       else  if(type=="summary_data"){
            Page = 0;
            $('#load_more_results').html("");
            $('#load_more_results_msg').html("");
            $('#load_more_button').show();
             $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;Loading...');
            //$('#ticket_id').val("");
            //based on old search
            //var OldSearch = $('#OldSearchCriteria').val();
            //data = $.parseJSON(OldSearch);
            //console.log(data);
        }
        /*else
        {
            //var OldSearch = $('#OldSearchCriteria').val();
            //data = $.parseJSON(OldSearch);
        }*/

        var per_page_record = $('select[name="per_page_record"] option:selected').val();
        data = $('#FilterLeadForm, #FilterLeadFormSearch').serializeArray();
        data.push({name:"per_page_record",value:per_page_record});
        if(typeof sortField !== 'undefined' && typeof sortOrder !== 'undefined') {
            data.push({name:"sortField",value:sortField});
            data.push({name:"sortOrder",value:sortOrder});
        }

        if(type == 'ticket_search')$('#load_more_button').hide();


        data.push({name: "page", value: Page});
        data.push({name: "type", value: type});

        $('#load_more_button').attr("disabled", "disabled");
        $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;Loading...');

        //If button tag is exist with name=search_btn then disable the button
        if ($('button[name="search_btn"]').length) {
            $('button[name=search_btn]').attr('disabled','disabled');
        }

        if(typeof jsVars.showHideDownload=='undefined' || jsVars.showHideDownload==false || jsVars.showHideDownload=='') {
            $('#showlink').hide();
        }

        $.ajax({
            url: '/query/ajax-lists',
            type: 'post',
            dataType: 'html',
            //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
            data: data,
            beforeSend: function() {
                $('#listloader').show();
            },
            complete: function() {
                $('#listloader').hide();
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                //If button tag is exist with name=search_btn then enable the button
                if ($('button[name="search-btn"]').length) {
                    $('button[name=search-btn]').removeAttr('disabled');
                }

                Page = Page + 1;
                if (data == "session_logout") {
                    window.location.reload(true);
                }
                else if (data == "error" || data == "erroremail" || data == "errormobile" || data == "errorSingleCollege" || data == "errorSingleCollegePaymentStatus") {
                    $('.table-border').hide();
                    var errormsg="No Records found";
                    if(data == "errorSingleCollege"){
                        errormsg = "Please select an institute to filter with email/mobile.";
                    }
                    if(data == "erroremail"){
                        errormsg="Enter valid Email id";
                    }
                    if(data == "errormobile"){
                        errormsg="Enter valid mobile no.";
                    }
                    if(data == "errorSingleCollegePaymentStatus"){
                        $('#load_msg_div').show();
                        errormsg='';
                    }
                    else
                    {
                         $('#load_msg_div').hide();
                    }
                    if(Page==1)error_html=errormsg;
                    else error_html="No More Record";
                    $('#load_more_results_msg').append("<div class='text-danger text-center'>"+error_html+"</div>");
                    $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Record');
                    $('#load_more_button').hide();
					$('.table-border').show();
                      if (type != '' && Page==1) {
                            $('#if_record_exists').hide();
							$('.table-border').hide();
                      }
                }else {
                    data = data.replace("<head/>", '');
                    $('#load_more_results').append(data);
					$('.table-border').show();
                    $('#load_more_button').removeAttr("disabled");
                    $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Record');
                    if (type != '') {
                        $('#if_record_exists').fadeIn();
                    }
                    //$.material.init();
					$('.offCanvasModal').modal('hide');
					dropdownMenuPlacement();
					determineDropDirection();
                    //LoadOwl();
                    table_fix_rowcol();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }


function initCKEditor(tokens){
     if(typeof CKEDITOR == 'undefined')
     {
          window.setTimeout(function(){
            initCKEditor(tokens);
        }, 500);
         return;
     }
     var showToken = true;
    if(typeof tokens =='undefined' || tokens == ''){
        showToken==false;
    }

    var old_data = '';
    if(typeof CKEDITOR.instances['editor'] != 'undefined'){
        var old_data = CKEDITOR.instances['editor'].getData();

        delete CKEDITOR.instances['editor'];
        jQuery('#cke_editor').remove();
    }

    if(typeof tokens =='undefined' || showToken=='') {
         CKEDITOR.replace( 'editor',{
                tokenStart: '{{',
                tokenEnd: '}}',
                on: {
                    instanceReady: function( evt ) {
                        $('div.loader-block').hide();
                    },
                    change: function( evt ) {
                        if($("#is_edit_template").length > 0) {
                            $("#is_edit_template").val(1);
                        }
                    }
            }
        });
    }else{
        CKEDITOR.replace( 'editor',{
            extraPlugins: 'token',
            availableTokens: tokens,
                tokenStart: '{{',
                tokenEnd: '}}',
                on: {
                    instanceReady: function( evt ) {
                        $('div.loader-block').hide();
                    },
                    change: function( evt ) {
                        if($("#is_edit_template").length > 0) {
                            $("#is_edit_template").val(1);
                        }
                    }
            }
        });
    }

    if(old_data != ''){
        CKEDITOR.instances['editor'].setData(old_data);
    }
}

function ChangePagePerRecord(ElementName,ElementValue)
{
    //prefill old deta
    preFilledOldSearchCriteria(ElementName,ElementValue);
    LoadQMSDataNew("summary_data");
}

 //function: change new field value in pre search criteria
 function preFilledOldSearchCriteria(ElementName,ElementValue)
 {
     //prefill old deta
    var OldSearch = $('#OldSearchCriteria').val();
    var criteria = $.parseJSON(OldSearch);
    for(var elem in criteria)
    {
        var elemName = criteria[elem]['name'];
        if(elemName == ElementName)
        {
            criteria[elem]['value'] = ElementValue;
        }
    }
    //console.log(criteria);
    $('#OldSearchCriteria').val(JSON.stringify(criteria));
 }



function setOrderBy(OrderBy)
{
    $('#OrderByFilter').val(OrderBy);
    var explode = OrderBy.split('||');
    var sorting,AddClass,RemoveClass,SelectedId;
    if(explode[1] == 'asc')
    {
        sorting = 'desc';
        AddClass = 'fa-caret-up';
        RemoveClass = 'fa-caret-down';
    }
    else
    {
        sorting = 'asc';
        AddClass = 'fa-caret-down';
        RemoveClass = 'fa-caret-up';
    }
    if(explode[0] == 'status')
    {
        SelectedId = 'StatusSort';
    }
    else
    {
        SelectedId = 'LastActionSort';
    }
    OrderBy = explode[0]+'||'+sorting;

    $('#'+SelectedId).attr('onclick','setOrderBy(\''+OrderBy+'\');');
    $('#'+SelectedId+' i').removeClass(RemoveClass).addClass(AddClass);

   LoadMoreMyTickets('reset');
}

function LoadMoreMyTickets(ListingType)
{
    var OrderBy;
    if($('#OrderByFilter').val() != '')
    {
        OrderBy = $('#OrderByFilter').val();

    }
    if(ListingType == 'reset')
    {
        MyTicketStartPage = 0;
    }
    if((typeof jsVars.isMobile != 'undefined') && (typeof jsVars.TicketNumber == 'undefined'))
    {
        $('#NoRecordMsg').text('Loading..');
        $('#LoadMoreSectionMobile').show();
    }
    else
    {
        $('#NoRecordMsg').hide();
        $('#StudentMyTicketPageLoaderContainer').show();
    }
    var queryStatus = $("#query_status").val();

    var data={
        MyTicketStartPage: MyTicketStartPage, ListingType: ListingType, OrderBy: OrderBy,queryStatus:queryStatus,
        'formData':[],
    };
    data.formData.push($('#FilterLeadForm, #FilterLeadFormSearch').serialize());

    $.ajax({
        url: jsVars.LoadMyTickets,
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if((typeof jsVars.isMobile != 'undefined') && (typeof jsVars.TicketNumber == 'undefined'))
            {
                $('#NoRecordMsg').text('');
                $('#LoadMoreSectionMobile').hide();
            }
            else
            {
                $('#StudentMyTicketPageLoaderContainer').hide();
            }

            MyTicketStartPage = MyTicketStartPage + 1;
            if (data == "Session") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(data == 'NoRecord')
            {
                console.log("page: "+MyTicketStartPage);
                if(MyTicketStartPage == 0){
                    $('#MyTicketTableContainer').html('');
                }

                //show on desktop/mobile
                $('#NoRecordMsg').html('<i class="fa fa-database fa-2x text-muted" aria-hidden="true"></i> &nbsp; You have not raised any ticket.');
                $('#NoRecordMsg').show();
                $('#LoadMoreBtn').hide();
                //stop load more hits on window scroll
                if((typeof jsVars.isMobile != 'undefined') && (typeof jsVars.TicketNumber == 'undefined')) {
                    stopLoadMoreOnMobile = true;
                }
            }
            else if (data == "error")
            {
                if(MyTicketStartPage==1)error_html="No Records found";
                else error_html="No More Record";
                $('#NoRecordMsg').append("<div class='alert alert-danger'>"+error_html+"</div>");
                $('#LoadMoreBtn').html('<i class="fa fa-refresh" aria-hidden="true"></i> &nbsp;Load More Queries');
                $('#LoadMoreBtn').hide();

            }
            else {
                data = data.replace("<head/>", '');
                var RowCount  = CountTotalReturnResult(data);
                if(RowCount < 5)
                {
                    $('#LoadMoreBtn').hide();
                }else{
                    $('#LoadMoreBtn').show();
                }
                if(ListingType == 'reset')
                {
                    $('#MyTicketTableContainer').html(data);
                }
                else
                {
                    $('#MyTicketTableContainer').append(data);
                }
                $('#LoadMoreBtn').removeAttr("disabled");
                $('#LoadMoreBtn').html('<i class="fa fa-refresh" aria-hidden="true"></i> &nbsp;Load More Tickets');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function CountTotalReturnResult(html)
{
    var data = {};
    data.html = html;

    var len = $.grep($.parseHTML(data.html), function(el, i) {
      return $(el)
    }).length;
    return len;
}

function ShowTicketDetails(TicketNumber,AppendSection)
{
    if(TicketNumber)
    {
        $('#StudentMyTicketPageLoaderContainer').show();
        $.ajax({
            url: jsVars.GetTicketDetails,
            type: 'post',
            dataType: 'html',
            data: {TicketNumber:TicketNumber,counsellorEditApplicaton:jsVars.counsellorEditApplicaton},
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data)
            {
                $('#StudentMyTicketPageLoaderContainer').hide();
                if (data == "Session") {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }
                else if(data == 'error')
                {
                    alert('Unable to process request.');
                }
                else {
                    data = data.replace("<head/>", '');
                    $('#'+AppendSection).html(data);
                    $('.chosen-select').chosen();
                    if(typeof jsVars.StudentGroupId == 'undefined')
                    {
                        initCKEditor();
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            },
            complete: function () {
                if(jsVars.scrollDown == 1) {
                    $('html,body').animate({ scrollTop: $(document).height() }, 'slow');
                    jsVars.scrollDown =0;
                }
            }
        });
    }
}

function getCollegeAllUsersData(preSelectedUser) {

    $.ajax({
        url: '/users/get-college-all-users-data',
        type: 'post',
        dataType: 'json',
        data: $('#FilterLeadForm, #FilterLeadFormSearch').serializeArray(),
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json)
        {
            if (json['error'] == "session") {
                location = json['redirect'];
            }
            else if(json['status'] == 200) {

                $('#assigned_to').html(json['option']);
                if (typeof preSelectedUser != 'undefined') {
                    $('#assigned_to').val(preSelectedUser);
                }

                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                $('.chosen-select').trigger('chosen:updated');

                //$('.multiSelectBox select').multiselect('rebuild');
                $('#assigned_to').SumoSelect({placeholder: 'Assigned To', search: true, searchText:'Assigned To',  triggerChangeCombined: false });
                $('#assigned_to')[0].sumo.reload();
                if ($('#payment_status_id').length > 0) {
                        $('#payment_status_id')[0].sumo.reload();
                    }


            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function ResetFilterValue(){

     $('#FilterLeadForm').find('input[type="text"]').each(function(){
       $(this).val('');
    });
    $("#email").val('');
    $('#FilterLeadForm').find('select').each(function(){
       this.selected = false;
       id =$(this).attr('id');
        if(id == 'form_id' || id == 'assigned_to'){
            $(this).html('');
        }else if(id =='items-no-show'){

        }else{
            $(this).val('');
        }

       $(this).trigger("chosen:updated");
       $(this).trigger("chosen:refresh");
    });
     sumoDropdown();
    $('#load_more_results').html('<tbody><tr><td><div class="col-md-12"><br><div class="alert alert-danger">Please select a college to view list.</div></div></td></tr><tr></tr></tbody>');
    $('#if_record_exists').hide();
    $('#load_more_results_msg').html("");
    $('#load_more_button').hide();
    $('#load_slider_data').html("");
    $('#view_by').val("");
    LoadQMSDataNew('reset');

    return false;
}

function LoadOwl(){
         $("#owl-demo").owlCarousel({
        autoPlay: 3000,
        items : 4,
        itemsDesktop : [1199,3],
        itemsDesktopSmall : [979,3],
        navigation:true,
        pagination:false,
        navigationText: [
      "<i class='fa fa-chevron-left'></i>",
      "<i class='fa fa-chevron-right'></i>"
      ],
        stopOnHover : true
      });
    $(".flip").click(function(){
        $(".slide-content").slideToggle("slow");
    });
}

function resetQueryForm(id){
    $('#'+id).find('input[type="text"]').each(function(){
        $(this).val('');
    });
    $('#'+id).find('select').each(function(){
       this.selected = false;
       $(this).val('');
       $(this).trigger("chosen:updated");
    });
    $('form#QueryForm .help-block').text('');
    $('#'+id+' textarea').val('');
    $('#'+id+' #attachment').val('');

    if(typeof jsVars.QMS_GENERAL_CATEGORY != 'undefined')
    {
        $('form#QueryForm').find('radio').each(function(){
            if(parseInt(this.val()) == parseInt(jsVars.QMS_GENERAL_CATEGORY))
            {
                var DefaultRadioCategoryId = jsVars.QMS_GENERAL_CATEGORY;
                ChangeCategoryList(DefaultRadioCategoryId);
            }
        });
    }
}

function reAssignTickets(CollegeId,ticket_id,user_id=null,singleOrBulk){
//    alert('ddddddddd');

    var assignType='single';
    var postData = [];

    if(typeof singleOrBulk !== 'undefined' && singleOrBulk == 'bulk') {
        if($('input:checkbox[name="selected_tickets[]"]:checked').length < 1 && $('#select_all:checked').val()!=='select_all'){
            alertPopup('Please select Ticket(s)','error');
            return;
        }
        var assignType=singleOrBulk;
        postData = $('#FilterLeadForm, #FilterLeadFormSearch').serializeArray();
    } else {
        postData.push({name: "CollegeId", value: CollegeId});
        postData.push({name: "ticket_id", value: ticket_id});
        if(singleOrBulk != 'bulk'){
            postData.push({name: "user_id", value: user_id});
        }
    }
    postData.push({name: "assign_type", value: assignType});

    var reAssignFrom ='detail_page';
    if($('#QMSListSearchArea select#college_id').length>0) {
        reAssignFrom = 'list_page';
    }
    postData.push({name: "reassign_from", value: reAssignFrom});

    $('#reAssignTicketsHTML').modal();
    jQuery('#reAssignTicketContainer').html('loading...');
    $.ajax({
        url: '/query/re-assign-tickets',
        data: postData,
        dataType: "html",
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (data) {
            if(data=="session_logout"){
               window.location.reload(true);
            }
            else{
                jQuery('#reAssignTicketContainer').html(data);
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
                $('.chosen-select').trigger('chosen:updated');
            }
        },
        error: function (response) {
            alertPopup(response.responseText);
        },
        failure: function (response) {
            alertPopup(response.responseText);
        }
    });
    return false;
}

function changeChildCatList(RadioCategoryId,SelectedChildCategoryId,assign_type){

    if(typeof SelectedChildCategoryId == 'undefined')
    {
        SelectedChildCategoryId = '';
    }

    if($('#jsReassignID').length>0 && $('#jsReassignID:visible').length == 1) {
        var CollegeId = $("form#FilterLeadForm #college_id").val()[0];
        var _csrfToken = (jsVars._csrfToken != 'null')?jsVars._csrfToken:$('form#FilterLeadForm input[name=\'_csrfToken\']').val();
    } else {
        var CollegeId = $('form#TicketAssignForm input[name=\'CollegeId\']').val();
        var _csrfToken = (jsVars._csrfToken != 'null')?jsVars._csrfToken:$('form#TicketAssignForm input[name=\'_csrfToken\']').val();
    }

    var assignType ='';
    if(typeof assign_type !== 'undefined') {
        assignType = assign_type;
    }
    $.ajax({
        url: jsVars.GetChildCategoryListByParentId,
        type: 'post',
        dataType: 'json',
        data: {id:RadioCategoryId,select:SelectedChildCategoryId,CollegeId:CollegeId,action:'get','assign_type':assignType},
        headers: {'X-CSRF-TOKEN': _csrfToken},
        success: function (json)
        {
            if (json['redirect']) {
                location = json['redirect'];
            }
            else if(json['status'] == 200)
            {
                $('#child_category').html(json['html']);
                $('.chosen-select').trigger('chosen:updated');
            }

            //hide user list for technical category
            $('#reAssignTicketContainer div#users_list_chosen').css('display','block');

            if($('#from_user_id').length>0) {
                $('#reAssignTicketContainer div#from_user_id_chosen').css('display','block');
            }
            if(typeof jsVars.QMS_TECHNICAL_CATEGORY != 'undefined' && (parseInt(jsVars.QMS_TECHNICAL_CATEGORY) == parseInt(RadioCategoryId)))
            {
                $('#reAssignTicketContainer div#users_list_chosen').css('display','none');
                $('#reAssignTicketContainer div#users_list_chosen').parent().next('span').text('');

                if($('#from_user_id').length>0) {
                    $('#reAssignTicketContainer div#from_user_id_chosen').css('display','none');
                    $('#reAssignTicketContainer div#from_user_id_chosen').parent().next('span').text('');
                }
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

}

function queryCategoryUser(qms_cat_id,CollegeId,SelectedUser,from_user_id){
    if(typeof SelectedUser == 'undefined')
    {
        SelectedUser = '';
    }

    if(typeof from_user_id == 'undefined')
    {
        from_user_id = '';
    }

    var ticket_id ='';
    if($('#TicketAssignForm input[name=\'ticket_id\']').length > 0) {
        if($('#TicketAssignForm input[name=\'ticket_id\']').val()>0) {
            ticket_id = $('#TicketAssignForm input[name=\'ticket_id\']').val();
        }
    }
    $.ajax({
        url: '/users/query-category-user',
        data: {'qms_cat_id':qms_cat_id,'CollegeId':CollegeId,SelectedUser:SelectedUser,'from_user_id':from_user_id,'ticket_id':ticket_id},
        dataType: "json",
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if(typeof json['redirect'] !='undefined' && json['redirect'] != ''){
               window.location.href= json['redirect'];
            }
            else if(typeof json['error'] != 'undefined' && json['error'] != ''){

                alertPopup(json['error'],'error');

            }else if(typeof json['status'] != 'undefined' && json['status']==200){

                jQuery('#users_list').html(json['option']);
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
                $('.chosen-select').trigger('chosen:updated');
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

function reAssignTicketsSubmit(){

    var data = $('#TicketAssignForm').serializeArray();

    //In case of bulk ReAssign send multiple form's data
    if($('input[name="assign_type"]').val()=='bulk') {
        var data = $("#FilterLeadForm, #TicketAssignForm").serializeArray();
        var tickets   = [];
        $('input:checkbox[name="selected_tickets[]"]').each(function () {
            if(this.checked){
                tickets.push(parseInt($(this).val()));
            }
        });
        if($('#select_all:checked').val()=='select_all'){
            console.log('all tickets selected');
        }else{
            data.push({name: "ticket_ids", value: tickets});
        }
    }
    $.ajax({
        url: '/query/re-assign-tickets',
        data: data,
        dataType: "html",
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (data) {
            if(data=="session_logout"){
               window.location.reload(true);
            }
            else{
                //console.log(data);
                $('#reAssignTicketContainer').html(data);
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
                $('.chosen-select').trigger('chosen:updated');
            }
        },
        error: function (response) {
            alertPopup(response.responseText);
        },
        failure: function (response) {
            alertPopup(response.responseText);
        }
    });
    return false;

}
//myVar = setTimeout(function, milliseconds);
//clearTimeout(myVar);

//load multiple forms of multiple college
function LoadMultipleCollegeFormsMultipleSelect(SelectObj)
{
    if($(SelectObj).val() != 'null')
    {
        $.ajax({
            url: '/form/get-all-related-multiple-form-url',
            type: 'post',
            dataType: 'json',
            data: $(SelectObj).serializeArray(),
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (json)
            {
                if(json['redirect'])
                {
                    location = json['redirect'];
                }
                else if(json['error'])
                {
                    alertPopup(json['error'],'error');
                }
                else if(json['success'] == 200)
                {
                    $('#form_id').html(json['option']);
                    $('.chosen-select').trigger('chosen:updated');

                    //$('.multiSelectBox select').multiselect('rebuild');
                    $('#form_id').SumoSelect({placeholder: 'Forms', search: true, searchText:'Forms', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
                     $('#form_id')[0].sumo.reload();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

//load multiple forms of single college
function LoadMultipleFormsMultipleSelect(SelectObj)
{
    if($(SelectObj).val() != null)
    {
        $("#payment_status_id").val('');
         $("#payment_statusid").show();
    }
    else
    {
        $("#payment_statusid").hide();
        $("#payment_status_id").val('');

    }
}
//load multiple forms of multiple college
function getCategoryOptionsByCollege(elem)
{
//    if($(elem).val() != 'null'){
    var qmsReportwidgetList = '';
    if($('#qmsReportwidgetList').length>0 && typeof $('#qmsReportwidgetList').val() != 'undefined'){
        qmsReportwidgetList = $('#qmsReportwidgetList').val();
    }

        var collegeIds = $(elem).val();
        $.ajax({
            url: '/query/get-category-options-college',
            type: 'post',
            dataType: 'json',
            data: {collegeIds:collegeIds},
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (json)
            {
                if(json['session'])
                {
                    location = '/';
                }
                else if(json['error'])
                {
                    alertPopup(json['error'],'error');
                }
                else if(json['success'] == 200)
                {
                    var taxonomy_type = '';
                    for(var obj in json.option){
                        if(typeof json.option[obj] === "object"){
                            taxonomy_type += '<optgroup label="'+obj+'">';
                            $.each(json.option[obj], function (index, item) {
                                taxonomy_type += '<option value="'+index+'">'+item+'</option>';
                            });
                            taxonomy_type += '</optgroup>';
                        }
                    }

                    $('#taxonomy_id').html(taxonomy_type);

                    if(qmsReportwidgetList!=''){
                        $('#taxonomy_id').val(qmsReportwidgetList);
                    }
                    $('#taxonomy_id')[0].sumo.reload();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
//    }
}
function selectCategoryList(element){
    var radio   = $(element).find("input:radio");
    $(radio).prop("checked", true);
    ChangeCategoryList($(radio).val());
}

$(document).ready(function(){
$('#save_data input[type="text"], #save_data input[type="file"], #save_data input[type="checkbox"], #save_data input[type="radio"], #save_data select,#save_data textarea').change(function(){
    if(this.value!=''){
        $(this).closest('.form-group').find(".otherError").hide();
        $(this).closest('.form-group').find(".requiredError").hide();
        $(this).closest('.form-group').removeClass("has-error");
		$(this).closest('.form-group').siblings(".requiredError").hide();
    }
});

//    $('.datepicker').datepicker()
//    .on('hide', function(e) {
//        if(this.value!=''){
//            $(this).find(".otherError").hide();
//            $(this).find(".requiredError").hide();
//            $(this).parents('.form-group').removeClass("has-error");
//        }
//        // `e` here contains the extra attributes
//    });
    // Dropdown error remove on click
//    $(".form-group").on("click",function(){
//        $(this).removeClass("has-error");
//        $(this).find(".requiredError").hide();
//        $(this).find(".otherError").hide();
//    });

    // Select option color change when select for table and table cell wise
    $(".npf-form-group .table .select_blk select.form-control, .npf-form-group .table_cell_wise .select_blk select.form-control").on("change", function(){
        $(this).css({'color' : '#444'});
    });
});

function sumoDropdown(){
    $('#FilterLeadForm').find('.sumo_select').each(function(){
       this.selected = false;
       id =$(this).attr('id');
       if(id !=='items-no-show'){
          placeholder =$(this).data('placeholder');
       $('#'+id).SumoSelect({placeholder: placeholder, search: true, searchText:placeholder,  triggerChangeCombined: false });

        $('#'+id)[0].sumo.reload();
       }
    });

}

/*********************For Bulk Re-Assign Query*************************/
function selectAllQuery(elem){
    $('div.loader-block').show();
    $("#selectionRow").hide();
    $("#clearSelectionLink").hide();
    $('#select_all').attr('checked',false);
    if(elem.checked){
        //console.log(elem.checked);
        $("#selectAllAvailableRecordsLinkSpan").html('<a id="selectAllAvailableRecordsLink" href="javascript:void(0);" onclick="selectAllAvailableRecords('+ $("#all_records_val").val() +');"> Select all <b>'+ $("#all_records_val").val() +'</b>&nbsp;query(s)</a>');
        $('.select_ticket').each(function(){
            this.checked = true;
        });
        var recordOnDisplay = $('input:checkbox[name="selected_tickets[]"]').length;
        $("#currentSelectionMessage").html("All <span class='fw-500'>"+recordOnDisplay+"</span>  query(ies) on this page are selected. ");
        $("#selectionRow").show();
        $("#selectAllAvailableRecordsLink").show();
        $("#clearSelectionLink").hide();
        $('#li_bulkCommunicationAction').show();
    }else{
        $('.select_ticket').attr('checked',false);
        $("#selectAllAvailableRecordsLink").hide();
        $('#li_bulkCommunicationAction').hide();
    }

    $('div.loader-block').hide();
}

function selectAllAvailableRecords(totalAvailableRecords){
    $("#selectionRow").show();
    $("#selectAllAvailableRecordsLink").hide();
    $("#clearSelectionLink").show();
    $("#currentSelectionMessage").html("All <span class='fw-500'>"+totalAvailableRecords+"</span> query(ies) are selected.");
    $('#select_all').each(function(){
        this.checked = true;
    });
    $('.select_ticket').attr('checked',true);
}

function clearSelection(){
    $("#selectionRow").hide();
    $("#selectAllAvailableRecordsLink").hide();
    $("#clearSelectionLink").hide();
    $('.select_ticket').attr('checked',false);
    $('#select_page_query').attr('checked',false);
    $('#select_all').attr('checked',false);
}

$(document).on('click', '.select_ticket',function(e) {
    $("#selectionRow").hide();
    $("#selectAllAvailableRecordsLink").hide();
    $("#clearSelectionLink").hide();
    $('#select_all').attr('checked',false);
    $('#select_page_users').attr('checked',false);
});

//show the Re-Assign Ticket butyon show if single user is selected else hide the button
$(document).on('change','select#college_id, select#assigned_to, select#taxonomy_id',function(e){
    if($('form#FilterLeadForm select#assigned_to :selected').length==1 &&
       $('form#FilterLeadForm select#college_id :selected').length==1 &&
       $('form#FilterLeadForm select#taxonomy_id :selected').length==1) {
        $('#jsReassignID').css('display', 'inline-block');
    } else {
        $('#jsReassignID').css('display', 'none');
    }
});
/*************************Bulk Re-Assign Query****************************/

function reAssignTicketOnPopupSubmit(){
    var isError = false;
    $('.errorClass').remove();
    if($('#parent_category').val()=='' || $('#parent_category').val()<=0) {
        $('#parent_category').next('div').after('<span class="errorClass" style="display:block; color:red; font-size:11px;">Please Select Parent Category</span>');
        isError = true;
    }
    if($('#child_category').val()=='' || $('#child_category').val()<=0) {
        $('#child_category').next('div').after('<span class="errorClass" style="display:block; color:red; font-size:11px;">Please Select Child Category</span>');
        isError = true;
    }

    if(($('#parent_category').val() != '' && $('#parent_category').val()>0) && $('#parent_category').val() !== jsVars.QMS_TECHNICAL_CATEGORY) {
        if($('#from_user_id').val()=='' || $('#from_user_id').val()<=0) {
            $('#from_user_id').next('div').after('<span class="errorClass" style="display:block; color:red; font-size:11px;">Please Select From User Name</span>');
            isError = true;
        }

        if($('#users_list').val()=='' || $('#users_list').val()<=0) {
            $('#users_list').next('div').after('<span class="errorClass" style="display:block; color:red; font-size:11px;">Please Select User.</span>');
            isError = true;
        }

        if($('#from_user_id').val()>0 && $('#users_list').val() > 0) {
            if($('#users_list').val() == $('#from_user_id').val()) {
                $('#users_list').next('div').after('<span class="errorClass" style="display:block; color:red; font-size:11px;">From User and To User Cannot be same.</span>');
                isError = true;
            }
        }
    }

    if(isError) {
        return false;
    }

    var data = $("#FilterLeadForm, #TicketAssignForm, #FilterLeadFormSearch").serializeArray();
    $.ajax({
        url: '/query/check-assign-user-config',
        data: data,
        dataType: "json",
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            console.log(json);
            //return false;
            if(typeof json['session_logout'] !== 'undefined' && json['session_logout'] == "session_logout"){
               window.location.reload(true);
            }
            else{
                var popupMessage;
                if(typeof json['counsellor_data'] !== 'undefined') {
                    $('#reAssignTicketsHTML').modal('hide');
                    var popupMessage = 'Queries corresponding to  ';
                    var leadMsg = '';
                    var applicationMsg = '';
                    var andMessage = '';
                    if(typeof json['counsellor_data']['lead'] !== 'undefined') {
                        leadMsg += ' assigned Leads ';
                    }

                    if(typeof json['counsellor_data']['application'] !== 'undefined' &&
                       typeof json['counsellor_data']['formList'] !== 'undefined') {
                        applicationMsg += ' assigned Applications for form name:' + json['counsellor_data']['formList'];
                    }

                    if(leadMsg !='' && applicationMsg != '') {
                        andMessage += ' and ';
                    }

                    popupMessage += leadMsg + andMessage + applicationMsg + ' will only be assigned to the Counsellor: ' + json['counsellor_data']['userName'] + '<br>';
                    $('#ConfirmMsgBody').html(popupMessage);
                    $('#ConfirmMsgBody').removeClass('text-center font500').addClass('text-left');
					$('#ConfirmMsgBody').css('max-height', '350px');
					$('#ConfirmMsgBody').css('overflow', 'auto');
                                        $("p.are_you_sure").remove();
					$('<p class="font500 m0 text-left are_you_sure">Are you sure you want to re-assign queries?</p>').insertAfter( "#ConfirmMsgBody" );
					$('#ConfirmPopupArea').addClass('modalWide');
                    $('#ConfirmPopupArea h2#confirmTitle').html('Confirmation Required');
                    $('#ConfirmPopupArea a#confirmYes').html('Okay');
                    $('#ConfirmPopupArea .modal-body button').html('Cancel');
                    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
                        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                            e.preventDefault();
                            $('#ConfirmPopupArea').modal('hide');
							$('#ConfirmPopupArea').removeClass('modalWide');
                            reAssignTicketsSubmit();
                            //Load the result
                            LoadQMSDataNew('reset');
                        });
                } else {
                    if(typeof json['allowReassign'] !== 'undefined' && json['allowReassign'] == 1) {
                        reAssignTicketsSubmit();
                    }
                }

            }
        },
        error: function (response) {
            //alertPopup(response.responseText);
        },
        failure: function (response) {
            //alertPopup(response.responseText);
        }
    });
    return false;
}

$(document).on('click', 'span.sorting_span i', function () {
    var sortField   = jQuery(this).data('column');
    var sortOrder   = jQuery(this).data('sorting');
    $("#sortField").val(sortField);
    $("#sortOrder").val(sortOrder);
    LoadQMSDataNew('summary_data','',sortField,sortOrder);
});

//Reopen Ticket
function ReopenTicket(TicketNumber, url, reload) {
    if(TicketNumber) {
        $('#ConfirmAlertYesBtn').unbind();
        $('#ConfirmAlertNoBtn').unbind();
        $('#ConfirmAlertPopUpTextArea').html('Are you sure you wish to <strong>Re-open</strong> the Ticket?');
	$('#ConfirmAlertPopUpSection .modal-header').addClass('modal-header-custom');
        $('#ConfirmAlertPopUpSection .modal-title').addClass('modal-title-cust');
        $('#ConfirmAlertPopUpSection .modal-title').html("Re-open Query");
        $('#ConfirmAlertPopUpSection .btn-npf-alt').addClass('btn-reset mgr5').removeClass('btn-npf-alt');
        $('#ConfirmAlertPopUpSection .btn-npf').addClass('btn-brand');
        $("#ConfirmAlertPopUpSection").modal("show");
        $("#ConfirmAlertYesBtn").on("click",function(){
            $.ajax({
                url: jsVars.reopenUrl,
                data: {ticket_number: TicketNumber, scroll:reload},
                dataType: "json",
                type: "POST",
                headers: {
                    "X-CSRF-Token": jsVars._csrfToken
                },
                success: function (json) {
                    if(json.success == true) {
                        if(reload != 'undefined' || reload == 1) {
                            if (url == '' || url == 'undefined')
                                window.location.reload();
                            else
                                window.location.href = url;
                        } else {
                            LoadQMSDataNew('reset');
                        }
                    } else if (json.msg == 'session' || json.msg == 'invalid_csrf') {
                        window.location.reload();
                    } else {
                        alertPopup(json.msg, 'error');
                    }
                },
                error: function (response) {
                    //alertPopup(response.responseText);
                },
                failure: function (response) {
                    //alertPopup(response.responseText);
                }
            });
        });
    }
}

//alert popup
function alertPopup(msg, type, location) {
    var selector_parent, selector_titleID, selector_msg, title_msg, btn;
    if (type == 'error') {
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
