function ajaxGetCollegeRoles(CollegeId) 
{
    if (CollegeId) 
    {
        $.ajax({
            url: jsVars.ajaxGetCollegeRole,
            type: 'post',
            data: {CollegeId: CollegeId},
            // dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json)
            {
                if(json == "session_logout"){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    var obj_json = JSON.parse(json);
                    if (obj_json['error']){
                        alertPopup(obj_json.error, 'error');
                    }else{
                        obj_json = obj_json.data;
                        var html = "<option value=''>Select Role</option>";
                        for (var key in obj_json) 
                        {
                            var val = obj_json[key];
                            html += "<option value='" + key + "'>" + val + "</option>";
                        }
                        $('#roleId').html(html);
                        $('#roleId').trigger('chosen:updated');
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
}


var Page2 = 1;
function getAppNotificationBreakup(id, collegeId)
{
    requestData = []
    requestData.push({name: "page", value: Page2});
    requestData.push({name: "jobId", value: id});
    requestData.push({name: "collegeId", value: collegeId});
    $.ajax({
            url: jsVars.ajaxGetAppNotificationBreakup,
            type: 'post',
            data: requestData,
            // dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (data)
            {
                if(data == "session_logout"){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else
                {
                    if(data == 'Empty Data'){
                        $("#alertTitle").html("Notification Breakup");
                        $("#SuccessPopupArea #MsgBody").html("No Record Found");
                        $("#SuccessPopupArea").modal()
                    }
                    else if (data == 'error')
                    {
                        if(Page2>1) {
                            $('#load_more_results > tbody').append('<tr><td colspan="7">No More Record</td></tr>');
                        } else {
                            $("#targetTotal").html('');
                            // $("#dataContainer").fadeOut();
                            $('#load_msg_div').show();
                            $('#load_msg').html('No Record Found');
                        }
                        
                        $('#load_more_button').hide();
                    }else 
                    {
                        $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
                        $("#ActivityLogPopupArea .modal-dialog").addClass('modal-lg');
                        $('#ActivityLogPopupArea #alertTitle').html("Notification Breakup");
                        $('#ActivityLogPopupHTMLSection').html(data);
                        $('#ActivityLogPopupLink').trigger('click');
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            },
            complete: function (jqXHR, textStatus) {
                $("input[name=page]").val(Page2);
            }
        });
    

}

function deleteAppNotification(id,collegeId)
{
    if (id) {
        
        $("#ConfirmPopupArea").css('z-index',1111111);
        $(".modal-backdrop").css('z-index', 1111110);
        $('#ConfirmMsgBody').html('Are you sure you want to stop this notification?');
        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
            $('#ConfirmPopupArea').modal('hide');
            $.ajax({
                url: jsVars.deleteAppNotification,
                type: 'post',
                data: {id: id,collegeId: collegeId},
                // dataType: 'json',
                headers: {
                    "X-CSRF-Token": jsVars._csrfToken
                },
                success: function (json)
                {
                    if(json == "session_logout"){
                        location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                    }else
                    {
                        var obj_json = JSON.parse(json);
                        if (obj_json['error']){
                            alertPopup(obj_json.error, 'error');
                        }else
                        {
                            obj_json = obj_json.status;
                            var html = ''
                            if(obj_json)
                            {
                                html = "Stopped Successfully!"
                            }else
                            {
                                html = "Something went wrong!"
                            }

                            $("#StatusDetailPopupHTMLSection").html(html)
                            $("#StatusDetailPopupArea .modal-title").html("")
                            $('#StatusDetailPopupArea').modal('show')
                            LoadMoreAppNotifications('reset')
                        }
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    $('div.loader-block').hide();
                }
            });
        });
    }

}

var Page = 1;
function LoadMoreAppNotifications(type) 
{
    if($('#CollegeIdSelect').val() == '' || $('#CollegeIdSelect').val() == '0' )
    {
        $("#targetTotal").html('');
        $("#dataContainer").fadeOut();        
        $('#load_more_button').hide();
        $('.topSearch').addClass('hide');
        $('.bulk_download_btn').addClass('hide');
        $('#load_msg_div').show();
        $('#load_msg').html('Please select an Institute Name from filter and click apply to view App Notifications.');
        $('#searchBox').val('');
        return false;
    }

    $('.topSearch').removeClass('hide');
    $('.bulk_download_btn').removeClass('hide');

    if (type == 'reset') {
        Page = 0; 
        $('#load_more_results').html("");
        $('#load_more_results_msg').html("");        
    }
    var requestData = $('#appNotificationsFilterForm, #appNotificationsFilterForm1').serializeArray();
    requestData.push({name: "page", value: Page});

    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-spin fa-refresh" aria-hidden="true"></i>&nbsp;Loading...');
    $.ajax({
        url: jsVars.loadMoreAppNotifications,
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: requestData,
        beforeSend: function (xhr) {
            $('#listloader').show();
            $('#searchList').prop("disabled",true);
            $('.daterangepicker_report').prop('disabled', true);
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            Page = Page+ 1;        
            if(data == "session_logout"){
               location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (data == "error") {
                
                // $('.topSearch').addClass('hide');
                $('.bulk_download_btn').addClass('hide');
                if(Page>1) {
                    $('#load_more_results > tbody').append('<tr><td colspan="10"><h4 class="text-center text-danger">No More Record</h4></td></tr>');
                } else {
                    $("#targetTotal").html('');
                    $("#dataContainer").fadeOut();
                    $('#load_msg_div').show();
                    $('#load_msg').html('No Record Found');
                }
                
                $('#load_more_button').hide();
                if (type != '' && Page==1) {                    
                    $('#if_record_exists').hide();
                  }
            }else {
                data = data.replace("<head/>", '');
                $("#dataContainer").fadeIn();
                if (type != '') {
                    $('#if_record_exists').fadeIn();
                }
                
               
                $('.table-border').removeClass('hide');
                if(Page==1) {
                    $('#load_more_results').append(data);
                    $('#selectionRow, .downloadBtn').show();
                } else {
                    $('#load_more_results > tbody > tr:last').after(data);
                }
                
                if($('#current_count').val() >= 10){
                    $('#load_more_button').show();
                }else{
                    $('#load_more_button').hide();
                }

                $('#load_msg_div').hide();
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Users');
            }
            $('.offCanvasModal').modal('hide');
            dropdownMenuPlacement();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $("input[name=page]").val(Page);
            $('#listloader').hide();
            $('#searchList').prop("disabled",false);
            $('.daterangepicker_report').prop('disabled', false);
        }
    });
}

$("body" ).on("click", ".modalPreview", function() {
    var preview = $(this).attr('data-preview');
    preview = preview.replaceAll("<","&lt")
    $("#StatusDetailPopupHTMLSection").html(preview)
    $("#StatusDetailPopupArea .modal-title").html("Preview")
    $('#StatusDetailPopupArea').modal('show');
});

$('.datepicker').datepicker({startView : 'month', format : 'dd/mm/yyyy', enableYearToMonth: true, enableMonthToDay : true});

var downloadAppNotificationFile = function(url){
    if(url!=='' && url !==null && typeof(url) !== "undefined"){
        window.open(url, "_self");
    }
};

function ajaxGetNotificationUsers(element) 
{
    var NotificationId = $(element).attr("data-id");
    if (NotificationId != '') 
    {
        $.ajax({
            url: jsVars.ajaxGetNotificationUsersList,
            type: 'post',
            data: {NotificationId: NotificationId},
            // dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json)
            {
                if(json == "session_logout"){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    var obj_json = JSON.parse(json);
                    if (obj_json['error']){
                        alertPopup(obj_json.error, 'error');
                    }else{
                        obj_json = obj_json.data;
                        if(obj_json != '')
                        {
                            html = "<ul>";
                            for (var key in obj_json) 
                            {
                                var val = obj_json[key];
                                html += "<li>" + val.name + " ( " + val.college + ") ";
                            }
                            html += "</ul>";
                            $('#showUsersList').html(html);
                        }else{
                            $('#showUsersList').html("No Users Found");
                            $('#showUsersList').addClass("text-center"); 
                        }
                        $('#showAppNotificationUSers').trigger('click');
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
}


function downloadAppNotifications(jobId,type,timestamp)
{
    var requestData = $('#appNotificationsFilterForm, #appNotificationsFilterForm1').serializeArray();
    requestData.push({name: "downloadType", value: type});
    
    if(type == 'app_notification_single_list'){
        requestData.find(item => item.name === 'jobId').value = jobId
    }else if(type == 'app_notification_breakup'){
        requestData.find(item => item.name === 'jobId').value = jobId
        requestData.push({name:'timestamp', value:timestamp});
    }

    $.ajax({ 
        url: jsVars.ajaxDownloadAppNotifications,
        type: 'post',
        data : requestData,
        dataType:'html', 
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success:function (response)
        {
            
            if(response == 'session_logout') {
                window.location.href = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(response.indexOf('request_already_pending|||') >= 0) {
                alertPopup(response.split('request_already_pending|||')[1],'error');
            } else if(response == 'Invalid request.') {
                alertPopup('Something went wrong.','error');
            }else if(response == 'Invalid Job Id.') { //zero record stage changed
                alertPopup(response,'error');
            } else {
                $("#ActivityLogPopupArea").modal("hide");
                $('#muliUtilityPopup').modal('show');
                $('#requestMessage').html('app notification listing');    
                $('#downloadListing').show();
                $('#downloadListingExcel').hide();
                $('#downloadListing').attr('href', response);
            
                $('#muliUtilityPopup .close').addClass('npf-close').css('margin-top', '2px');
            }
        }
    });

}

$('#downloadBulkAppNotif').on('click', function () 
{
    LoadMoreAppNotifications('reset');
});

$("#dataSpecific").change(function () {

    var val = $(this).val();
    $("#notifMessage").val('');
    if (val == 0){
        $('.tokens').addClass('hide');
    }
    else if (val == 1){
        $('.tokens').removeClass('hide');
        $("#notifTimePeriod").html("<option value=''>Choose Time Period</option>");
        $('#notifTimePeriod').trigger('chosen:updated');
        $("#notifToken").val("");
        $('#notifToken').trigger('chosen:updated');
    }

});

$("#notifModule").on("change",function()
{
   let module = $(this).val();
   if(module == jsVars.moduleCampaignManager)
   {
       $(".campaignDependent").fadeIn("slow");
   }else{
       if($(".campaignDependent").is(":visible"))
       {
           $(".campaignDependent").fadeOut("slow");
       }
   }
});

$("#notifToken").change(function () {

    var val = $(this).val();
    if (val != "")
    {
        var timePd = jsVars.timePeriod[val];
        html = '';

        $.each(timePd, function (index,item) 
        {
            html +='<option value="'+index+'">'+item+'</option>';
        });
        $('.tokens').removeClass('hide');
        $("#notifTimePeriod").html(html);
        $('#notifTimePeriod').trigger('chosen:updated')

    }else{
        $("#notifTimePeriod").html("<option value=''>Choose Time Period</option>");
        $('#notifTimePeriod').trigger('chosen:updated');
    }
    floatableLabel();

});

function insertToken()
{
    var token = $('#notifToken').val()
    var time = $("#notifTimePeriod").val()

    if( token != "" && time != "")
    {
        var textArea = $("#notifMessage");
        if(textArea.val() != ""){
            var matches = String(textArea.val()).match(/{{.*?}}/gi)
            if(matches != null)
            {
                if(matches.length >= 3)
                {
                    alertPopup("You cannot select more than 3 tokens", 'error');
                    return false;
                }
            }
            str = "{{"+ token + time + "}}"
            if((textArea.val().length + str.length) > 250){
                alertPopup("You have exceeded the maximum character length", 'error');
                return false;
            }
        }
        textArea.replaceSelectedText("{{"+ token + time + "}}", "collapseToEnd"); 
        textArea.focus();
        window.setTimeout(function () {
            textArea.focus();
        }, 0);

    }else
    {
        alertPopup("Please select Token and Time Period", 'error');
        return false;
    }   
}

function editAppNotification(id)
{
    $('#notification_id').val(id)
    if(id)
    {
        $.ajax({
            url: jsVars.ajaxGetNotificationDataById,
            type: 'post',
            data: {jobId: id},
            // dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json)
            {
                if(json == "session_logout"){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    var obj_json = JSON.parse(json);
                    
                    if (obj_json['message']) {
                        alertPopup(obj_json['message'], 'error');
                    }else {
                        //floatableLabel();
                        $("#notificationForm")[0].reset();
                        $("#saveNotif").html("Update")
                        $(".largeIconImg").hide()
                        $('#userNotificationModal').modal('show');
                        $('.labelUpContainer').addClass('floatify__active');
                        //floatableLabel();
                        obj_json = obj_json.data;
                        if(obj_json != '')
                        {
                            $('#role_id').val(obj_json.role_id)
                            if(obj_json.role_id == 9){
                                $(".specificToData").show()
                            }else{
                                $(".specificToData").hide()
                            }

                            $('#dataSpecific').val(obj_json.data_specific)
                            $('#dataSpecific').attr('old_value',obj_json.data_specific)
                            $('#dataSpecific').trigger('chosen:updated')

                            $('#notifTitle').val(obj_json.title)
                            $('#notifTitle').attr('old_value',obj_json.title)
                            $('#notifMessage').val(obj_json.message)
                            $('#notifMessage').attr('old_value',obj_json.message)

                            $('#notifModule').val(obj_json.module)
                            if(obj_json.module!= null){
                                $('#notifModule').attr('old_value',obj_json.module)
                            }
                            $('#notifModule').trigger('chosen:updated')
                            
                            if($('#dataSpecific').val() == 1)
                            {
                                $('.tokens').removeClass('hide');
                                $("#notifTimePeriod").html("<option value=''>Choose Time Period</option>");
                                $('#notifTimePeriod').trigger('chosen:updated');
                                $("#notifToken").val("");
                                $('#notifToken').trigger('chosen:updated');
                            
                            }else
                            {
                                $('.tokens').addClass('hide');
                            }
                            
                            if(obj_json.notification_type == 2)
                            {
                                $('#isRecurring').attr('checked',true);
                                $(".dependentBox").removeClass('hide')
                                $('#frequency').val(obj_json.notification_frequency)
                                
                                if(obj_json.notification_frequency==2)
                                {
                                    $('.excludeDays').addClass('hide');
                                    $('.recurringDay').removeClass('hide');
                                    $('#timefreq').html('&nbsp;&nbsp;week');
                                    $('.weekWise').removeClass('hide');
                                    $('.dayWise').addClass('hide');
                                    $('#repeatFrequencyWC').val(obj_json.recurring_frequency)

                                    $('#recurringDays').val(obj_json.recurring_days)
                                    $('#recurringDays').trigger('chosen:updated')
                                    $("#recurringDays")[0].sumo.reload();


                                    $('#recurStartTime').val(obj_json.notification_start_date)
                                    $('#recurEndTime').val(obj_json.notification_end_date)
                                    
                                    $('#notifExcludeDay').val('')
                                    $('#notifExcludeDay').trigger('chosen:updated');
                                    $("#notifExcludeDay")[0].sumo.reload();
                                }
                                else if(obj_json.notification_frequency == 1)
                                {
                                    $('#timefreq').html('&nbsp;&nbsp;day');
                                    $('#repeatFrequencyDay').val(obj_json.recurring_frequency)

                                    $('#recurringDays').val('')
                                    $('#recurringDays').trigger('chosen:updated')
                                    $("#recurringDays")[0].sumo.reload();

                                    $('#recurStartTime').val(obj_json.notification_start_date)
                                    $('#recurEndTime').val(obj_json.notification_end_date)
                                    
                                    $('#notifExcludeDay').val(obj_json.exclude_days)
                                    $('#notifExcludeDay').trigger('chosen:updated');
                                    $("#notifExcludeDay")[0].sumo.reload();

                                }

                                $('#isRecurring').prop('disabled',true);
                                $("#frequency").prop("disabled", true );
                                $("#repeatFrequencyDay").prop( "disabled", true );
                                $("#repeatFrequencyWC").prop( "disabled", true );
                                $("#recurringDays").prop( "disabled", true );
                                $("#recurStartTime").prop( "disabled", true );
                                $("#recurEndTime").prop( "disabled", true );
                                $("#notifExcludeDay").prop( "disabled", true );
                            
                            }else{
                                $('#isRecurring').prop('disabled',true);
                                $("#frequency").prop( "disabled", false );
                                $("#repeatFrequencyDay").prop( "disabled", false );
                                $("#repeatFrequencyWC").prop( "disabled", false );
                                $("#recurringDays").prop( "disabled", false );
                                $("#recurStartTime").prop( "disabled", false );
                                $("#recurEndTime").prop( "disabled", false );
                                $("#notifExcludeDay").prop( "disabled", false );
                            }
                            
                            $('#frequency').trigger('chosen:updated')
                            $('#repeatFrequencyWC').trigger('chosen:updated')
                            $('#repeatFrequencyDay').trigger('chosen:updated')
                            floatableLabel();
                        }
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
    
}

$(document).on('click', '#isRecurring', function (e) 
{
    if ($(this).is(':checked')) {
        $(".dependentBox").removeClass('hide')
    }
    else{
        $(".dependentBox").addClass('hide')
    }
}); 

// $("#frequency").change(function () {

//     var val = $(this).val();
//     if (val == "1")
//     {
//         $('.excludeDays').removeClass('hide');
//         $('.recurringDay').addClass('hide');
//         $('#timefreq').html('&nbsp;&nbsp;day');
//         $('.dayWise').removeClass('hide');
//         $('.weekWise').addClass('hide');
//         $('#repeatFrequencyDay').val(1)
//         $('#repeatFrequencyDay').trigger('chosen:updated')
//         $('#repeatFrequencyWC').val('')
//         $('#repeatFrequencyWC').trigger('chosen:updated')
//         $('#recurringDays').val('')
//         $('#recurStartTime').val('')
//         $('#recurStartTime').attr('placeholder',"Date & Time To Start")
//         $('#recurStartTime').trigger('chosen:updated');

//         $('#recurEndTime').val('')
//         $('#recurEndTime').attr('placeholder',"Date & Time To Stop")
//         $('#recurEndTime').trigger('chosen:updated');
//         $('#notifExcludeDay').val('')
//         $('#notifExcludeDay').trigger('chosen:updated');
//         $("#notifExcludeDay")[0].sumo.reload();
//         $('#recurringDays').trigger('chosen:updated');
//         $("#recurringDays")[0].sumo.reload();
        
//     }
//     else if (val == "2")
//     {
//         $('.excludeDays').addClass('hide');
//         $('.recurringDay').removeClass('hide');
//         $('#timefreq').html('&nbsp;&nbsp;week');
//         $('.weekWise').removeClass('hide');
//         $('.dayWise').addClass('hide');
//         $('#repeatFrequencyDay').val('')
//         $('#repeatFrequencyDay').trigger('chosen:updated')
//         $('#repeatFrequencyWC').val(1)
//         $('#repeatFrequencyWC').trigger('chosen:updated')
//         $('#recurringDays').val('')
//         $('#recurStartTime').val('')
//         $('#recurStartTime').attr('placeholder',"Date & Time To Start")
//         $('#recurStartTime').trigger('chosen:updated');

//         $('#recurEndTime').val('')
//         $('#recurEndTime').attr('placeholder',"Date & Time To Stop")
//         $('#recurEndTime').trigger('chosen:updated');

//         $('#notifExcludeDay').val('')
//         $('#notifExcludeDay').trigger('chosen:updated');
//         $("#notifExcludeDay")[0].sumo.reload();
//         $('#recurringDays').trigger('chosen:updated');
//         $("#recurringDays")[0].sumo.reload();
//     }
// });

$(".sumo-select").SumoSelect({
    search: true, 
    placeholder: $(this).data('placeholder'), 
    captionFormatAllSelected: "All Selected.", 
    searchText: $(this).data('placeholder'), 
    triggerChangeCombined: true, 
    okCancelInMulti: true,
    floatWidth: 600,
    forceCustomRendering: true,
    nativeOnDevice: ['Android', 'BlackBerry', 'iPhone', 'iPad', 'iPod', 'Opera Mini', 'IEMobile', 'Silk'],
});


$("#saveNotif").click(function(ev)
{
    var notificationForm = $("#notificationForm")[0];
    var userIds = [];
    var temp = {};
    var temp_ = {};
    var validated = false;
    
    if($("#notifTitle").val() == "" && $("#notifMessage").val() == ""){
        alertPopup("Please enter Notification Title & Message", 'error');
        return false;
    }else if($("#notifTitle").val() == ""){
        alertPopup("Please enter Notification Title", 'error');
        return false;
    }else if($("#notifMessage").val() == ""){
        alertPopup("Please enter Notification Message", 'error');
        return false;
    }

    // if($("#recurStartTime").val() == "" && $('#isRecurring').is(':checked')) 
    // {
    //     alertPopup("Date and Time to start notification is mandatory", 'error');
    //     return false;   
    // }
    // else if($("#recurEndTime").val() != "" && $("#recurStartTime").val()!="")
    // {
    //     var dateStrA = $("#recurEndTime").val().replace( /(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3");
    //     var dateStrB = $("#recurStartTime").val().replace( /(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3");

    //     if (new Date(dateStrA) < new Date(dateStrB))
    //     {
    //         alertPopup("Recurring notification end time cannot be less than it's start time", 'error');
    //         return false;   
    //     }
    // }

    // if($('#isRecurring').is(':checked'))
    // {
    //     var startDate = $("#recurStartTime").val().replace( /(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3");
    //     var d = new Date($.now());
    //     var currentDate = (d.getMonth() + 1)+"/"+d.getDate()+"/"+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes()
    //     if (new Date(startDate) < new Date(currentDate))
    //     {
    //         alertPopup("Recurring notification start time cannot be less than the current time", 'error');
    //         return false;   
    //     }   
    // }

    if($('#frequency').val() == "2" && $('#recurringDays').val() == null && $('#isRecurring').is(':checked'))
    {
        alertPopup("Please select Recurring Days", 'error');
        return false;
    }

    var tokenn = $('#notifToken').val()
    var timee = $("#notifTimePeriod").val()

    if( tokenn != "" && timee != "")
    {
        var textArea = $("#notifMessage");
        if(textArea.val() != "")
        {
            var matches = String(textArea.val()).match(/{{.*?}}/gi)
            if(matches != null)
            {
                if(matches > 3)
                {
                    alertPopup("You cannot select more than 3 tokens", 'error');
                    return false;
                }
            }
        }
    }

    if($("#roleId").val() == 9 && $('#dataSpecific').val() == ""){
        alertPopup("Please select Notification Type", 'error');
        return false;
    }

    $("#ConfirmPopupArea").css('z-index',1111111);
    $('#ConfirmMsgBody').html('Are you sure you want to update the notification?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
    .off('click', '#confirmYes').one('click', '#confirmYes', function (e) 
    {
        $('#ConfirmPopupArea').modal('hide');
        var requestData = $('#notificationForm').serializeArray();
        requestData.push({name: "update", value: 1});
        requestData.push({name: "dataspecific_old_value", value: $('#dataSpecific').attr('old_value')});
        requestData.push({name: "title_old_value", value: $('#notifTitle').attr('old_value')});
        requestData.push({name: "message_old_value", value: $('#notifMessage').attr('old_value')});
        requestData.push({name: "module_old_value", value: $('#notifModule').attr('old_value')});
        requestData.push({name: "collegeId", value: $('#CollegeIdSelect').val()});

        $.ajax({
            url: jsVars.saveUserNotification,
            type: 'post',
    //        dataType: 'html',
            data: requestData,
            beforeSend: function (xhr) {
                $('#listloader').show();
                $('#searchList').prop("disabled",true);
                $('.daterangepicker_report').prop('disabled', true);
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) 
            {
                if (data == 'session_logout') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    var obj_json = JSON.parse(data);
                    console.log(obj_json)
                    if(obj_json.status == 1)
                    {
                        alertPopup(obj_json.message);
                        $("#userNotificationModal").modal("hide");
                    }else if(obj_json.status == 2)
                    {
                        alertPopup(obj_json.message,'error');
                    }else{
                        var err = "";
                        $.each(obj_json.message,function(index, item)
                        {
                            err += item + "<br>";
                        })
                        alertPopup(err, 'error');
                    }
                }
                LoadMoreAppNotifications('reset');
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            },
            complete: function (jqXHR, textStatus) {
                $("input[name=page]").val(Page);
                $('#listloader').hide();
                $('#searchList').prop("disabled",false);
                $('.daterangepicker_report').prop('disabled', false);
            }
        });
    });
    // $("#userNotificationModal").modal("hide");
    return false;
    
});

function alertPopup(msg,type,location){
    
    if(type=='error'){
        var selector_parent     = '#ErrorPopupArea';
        var selector_titleID    = '#ErroralertTitle';
        var selector_msg        = '#ErrorMsgBody';
        var btn                 = '#ErrorOkBtn';
        var title_msg           = 'Error';
    }else if(type=='alert'){
        var selector_parent     = '#SuccessPopupArea';
        var selector_titleID    = '#SuccessPopupArea #alertTitle';
        var selector_msg        = '#MsgBody';
        var btn                 = '#OkBtn';
        var title_msg           = 'Alert';
    }else if(type=='Preview'){
        var selector_parent     = '#SuccessPopupArea';
        var selector_titleID    = '#SuccessPopupArea #alertTitle';
        var selector_msg        = '#MsgBody';
        var btn                 = '#OkBtn';
        var title_msg           = 'Preview';
    }else{
        var selector_parent     = '#SuccessPopupArea';
        var selector_titleID    = '#alertTitle';
        var selector_msg        = '#MsgBody';
        var btn                 = '#OkBtn';
        var title_msg           = 'Success';
    }

    $(selector_titleID).html(title_msg);
    $(selector_parent+" "+selector_msg).html(msg);
    $('.oktick').hide();
        
    if(typeof location != 'undefined'){
         $(btn).show();

        $(selector_parent).modal({keyboard:false}).one('click',btn,function(e){
            window.location.href=location;
        });
    }
    else{
        $(selector_parent).modal();
    }
}

$('#searchBox').keypress(function (e) {
 var key = e.which;
 if(key == 13)  // the enter key code
  {
    LoadMoreAppNotifications('reset');
    return false;  
  }
});

function previewNotification(){
    var preview = $("#notifMessage").val();
    preview = preview.replaceAll("<","&lt")
    alertPopup(preview, 'Preview');
}