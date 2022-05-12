// function: Get All Roles In Selected College
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

var Page = 1;
function LoadMoreActiveUsers(type) 
{
    if($('#CollegeIdSelect').val() == '' || $('#CollegeIdSelect').val() == '0' || $('#roleId').val() == '' || $('#roleId').val() == '0' )
    {
        $("#targetTotal").html('');
        $("#dataContainer").fadeOut();
        $('#load_more_button').hide();
        $("#load_msg_div").show()
        
        if($('#roleId').val() == '' || $('#roleId').val() == '0' ){
            $("#rleId").show()
            $("#rleId").html("Please select Role Id")
        }else{
            $("#rleId").hide()
        }
        if($('#CollegeIdSelect').val() == '' || $('#CollegeIdSelect').val() == '0'){
            $("#clgId").show()
            $("#clgId").html("Please select College Id")
        }else{
            $("#clgId").hide()
        }
        return false;
    }
    $("#rleId").hide()
    $("#clgId").hide()

    $("#load_msg_div").hide()
    // if ($("#notif_users_all").is(':checked')){
    //     $("#notif_users_all").prop('checked', false)
    //     $("#selectionDiv").html("");
    //     $("#targetselection").hide();
    // }

    if (type == 'reset') {
        Page = 0; 
        $('#load_more_results').html("");
        $('#load_more_results_msg').html("");        
    }
    var requestData = $('#activeUsersFilterForm').serializeArray();
    requestData.push({name: "page", value: Page});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-spin fa-refresh" aria-hidden="true"></i>&nbsp;Loading...');
    $.ajax({
        url: jsVars.loadMoreAppUsers,
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
                if(Page>1) {
                    $(".modalButton").hide()
                    $('#load_more_results > tbody').append('<tr><td colspan="10"><h4 class="text-center text-danger">No More Record</h4></td></tr>');
                } else {
                    $(".modalButton").hide()
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
                $(".modalButton").show()
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
                $('#afterSuccessBtn').show();
                customFile();
            }
            $('.offCanvasModal').modal('hide');
            floatableLabel();
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

// count selected users
$(".sendNotification").on("click", function()
{
    var temp = 0;
    $(".notif_users").each(function()
    {
        if($(this).is(':checked'))
        {
            temp++;
        }
    });
    if(temp == 0)
    {
        alertPopup("Please select any user", 'error');
        return false;
    }
    $("#isSelectedUsers").css("display","block")
    if($("#selectAllIds").val() == 1){
        temp = $("#totalActiveUsers").html();
    }

    if($("#roleId").val() == 9){
        $(".specificToData").show()
    }else{
        $(".specificToData").hide()
    }
    $("#saveNotif").html("Send")
    $(".selectedUsers").show().html(temp + " user(s) selected");
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
        
        if(html != ''){
            $("#notifTimePeriod").prop('disabled',false);
            $("#notifTimePeriod").html(html);
            $('#notifTimePeriod').trigger('chosen:updated');
        }else{
            $("#notifTimePeriod").prop('disabled',true);
            $("#notifTimePeriod").html('');
            $('#notifTimePeriod').trigger('chosen:updated');
        }

    }else{
        $("#notifTimePeriod").html("<option value=''>Choose Time Period</option>");
        $('#notifTimePeriod').trigger('chosen:updated');
    }
    floatableLabel();
});

$("#frequency").change(function () {

    var val = $(this).val();
    if (val == "1")
    {
        $('.excludeDays').removeClass('hide');
        $('.recurringDay').addClass('hide');
        $('#timefreq').html('&nbsp;&nbsp;day');
        $('.dayWise').removeClass('hide');
        $('.weekWise').addClass('hide');
        $('#timefreqdropdownDay').val('')
        $('#timefreqdropdownWC').val('')
        $('#recurringDays').val('')
        $('#recurStartTime').val('')
        $('#recurStartTime').attr('placeholder',"Date & Time To Start *")
        $('#recurStartTime').trigger('chosen:updated');

        $('#recurEndTime').val('')
        $('#recurEndTime').attr('placeholder',"Date & Time To Stop")
        $('#recurEndTime').trigger('chosen:updated');
        
        $('#notifExcludeDay').val('')
        $('#notifExcludeDay').trigger('chosen:updated');
        $("#notifExcludeDay")[0].sumo.reload();
        $('#recurringDays').trigger('chosen:updated');
        $("#recurringDays")[0].sumo.reload();
        
    }
    else if (val == "2")
    {
        $('.excludeDays').addClass('hide');
        $('.recurringDay').removeClass('hide');
        $('#timefreq').html('&nbsp;&nbsp;week');
        $('.weekWise').removeClass('hide');
        $('.dayWise').addClass('hide');
        $('#timefreqdropdownDay').val('')
        $('#timefreqdropdownWC').val('')
        $('#recurringDays').val('')
        $('#recurStartTime').val('')
        $('#recurStartTime').attr('placeholder',"Date & Time To Start")
        $('#recurStartTime').trigger('chosen:updated');
        $('#recurEndTime').val('')
        $('#recurEndTime').attr('placeholder',"Date & Time To Stop")
        $('#recurEndTime').trigger('chosen:updated');
        $('#notifExcludeDay').val('')
        $('#notifExcludeDay').trigger('chosen:updated');
        $("#notifExcludeDay")[0].sumo.reload();
        $('#recurringDays').trigger('chosen:updated');
        $("#recurringDays")[0].sumo.reload();
    }
});

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

function insertToken()
{
    var token = $('#notifToken').val()
    var time = $("#notifTimePeriod").val()
    
    if( token != "" && time != "")
    {
        var textArea = $("#notifMessage");
        
        if(time == null){
            time = '';
        }
            
        if(textArea.val() != "")
        {
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

$("#saveNotif").click(function(ev)
{
    var notificationForm = $("#notificationForm")[0];
    var userIds = [];
    var temp = {};
    var temp_ = {};
    var validated = false;
    
    var select_All = $("#selectAllIds").val();

    if(select_All != '')
    {
        validated = true;
        temp["collegeId"] = $("#CollegeIdSelect").val();
        temp["roleId"] = $("#roleId").val();
        temp["activeDate"] = $("#activeDate").val();
        $("#notifFilters").val(JSON.stringify(temp));
    }else{
        $(".notif_users").each(function()
        {
            if($(this).is(':checked'))
            {
                validated = true;
                temp[$(this).attr("id")] = $(this).attr("data-college");
            }
        });
        $("#notifIds").val(JSON.stringify(temp));
        temp_["collegeId"] = $("#CollegeIdSelect").val();
        temp_["roleId"] = $("#roleId").val();
        temp_["activeDate"] = $("#activeDate").val();
        $("#notifFilters").val(JSON.stringify(temp_));
    }

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

    if(!validated)
    {
        alertPopup("Please select any user", 'error');
        return false;
    }

    if($("#recurStartTime").val() == "" && $('#isRecurring').is(':checked')) 
    {
        alertPopup("Date and Time to start notification is mandatory", 'error');
        return false;   
    }
    else if($("#recurEndTime").val() != "" && $("#recurStartTime").val()!="" && $('#isRecurring').is(':checked'))
    {
        var dateStrA = $("#recurEndTime").val().replace( /(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3");
        var dateStrB = $("#recurStartTime").val().replace( /(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3");

        if (new Date(dateStrA) < new Date(dateStrB))
        {
            alertPopup("Recurring notification end time cannot be less than it's start time", 'error');
            return false;   
        }
    }

    var confirmationMessage="Are you sure you want to send the notification?";
    if($('#isRecurring').is(':checked'))
    {
        confirmationMessage="Are you sure you want to schedule the notification?";
        var startDate = $("#recurStartTime").val().replace( /(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3");
        var d = new Date($.now());
        var currentDate = (d.getMonth() + 1)+"/"+d.getDate()+"/"+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes()
        if (new Date(startDate) < new Date(currentDate))
        {
            alertPopup("Recurring notification start time cannot be less than the current time", 'error');
            return false;   
        }   
    }
    
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
                if(matches.length > 3)
                {
                    alertPopup("You cannot select more than 3 tokens", 'error');
                    return false;
                }
            }

        }
    }


    if($("#roleId").val() == 9 && $('#dataSpecific').val() == ''){
        alertPopup("Please select Notification Type", 'error');
        return false;
    }
    
    $("#ConfirmPopupArea").css('z-index',1111111);
    $('#ConfirmMsgBody').html(confirmationMessage);
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
    .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
            // e.preventDefault();
            $('#ConfirmPopupArea').modal('hide');
            var formdata = new FormData(notificationForm);
            $.ajax({
                url: jsVars.saveUserNotification,
                type: 'post',
                processData: false,
                contentType: false,
                data: formdata,
                beforeSend: function (xhr) {
                    $('#listloader').show();
                    $('#searchList').prop("disabled",true);
                    $('.daterangepicker_report').prop('disabled', true);
                },
                headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                success: function (data) {
                    if (data == 'session_logout') {
                        location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                    }else{
                        var obj_json = JSON.parse(data);
                        if(obj_json.status == 1)
                        {
                            $("#selectAllIds").val("");

                            alertPopup(obj_json.message);
                            $("#userNotificationModal").modal("hide");

                            $("#notificationForm")[0].reset();
                            $('.tokens').addClass('hide');
                            $('#notifToken').val("")
                            $('#notifToken').trigger('chosen:updated')

                            $("#notifTimePeriod").val("")
                            $('#notifTimePeriod').trigger('chosen:updated')
                            $(".dependentBox").removeClass('fadeIn').addClass('hide');
                            $('#notifModule').val("")
                            $('#notifModule').trigger('chosen:updated')
                            $('#dataSpecific').val(0)
                            $('#dataSpecific').trigger('chosen:updated')

                            $('#frequency').val(1)
                            $('#frequency').trigger('chosen:updated')
                            
                            $('#recurringDays').val('')
                            $('#recurringDays').trigger('chosen:updated')
                            $("#recurringDays")[0].sumo.reload();
                            $('#notifExcludeDay').val('')
                            $('#notifExcludeDay').trigger('chosen:updated');
                            $("#notifExcludeDay")[0].sumo.reload();

                            $('.excludeDays').removeClass('hide');
                            $('.recurringDay').addClass('hide');
                            $('#timefreq').html('&nbsp;&nbsp;day');
                            $('.dayWise').removeClass('hide');
                            $('.weekWise').addClass('hide');
                            $('#timefreqdropdownDay').val('')
                            $('#timefreqdropdownDay').trigger('chosen:updated')
                            $('#timefreqdropdownWC').val('')
                            $('#timefreqdropdownWC').trigger('chosen:updated')

                            $('#recurStartTime').val('')
                            $('#recurStartTime').attr('placeholder',"Date & Time To Start")
                            $('#recurStartTime').trigger('chosen:updated')

                            $('#recurEndTime').val('')
                            $('#recurEndTime').attr('placeholder',"Date & Time To Stop")
                            $('#recurEndTime').trigger('chosen:updated')

                            $('#repeatFrequencyDay').val(1)
                            $('#repeatFrequencyDay').trigger('chosen:updated')
                            $('#repeatFrequencyWC').val(1)
                            $('#repeatFrequencyWC').trigger('chosen:updated')
                            
                            $(".notif_users").each(function(){
                            $(this).prop('checked', false)
                            });

                            if ($("#notif_users_all").is(':checked')){
                                $("#notif_users_all").prop('checked', false)
                                $("#selectionDiv").html("");
                                $("#targetselection").hide();
                            }
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
    return false;
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


function showSchedulePopup()
{
    if($(".schedulebox").is(":visible"))
    {
        $("#scheduled_time").val("");
        $(".schedulebox").slideUp("slow");
    }else{
        $(".schedulebox").slideDown("slow");
    }
}

$("body").on("click","#notif_users_all",function()
{
    let counter = 0;
    let text = "";
    let checked = this.checked;
    $('.notif_users').each(function()
    {
        $(this).prop('checked', checked);
        counter++;
    });
    if(checked)
    {
        let totalUSers = $("#totalActiveUsers").html();
        let text = "All "+ counter + " users on this page are selected. <a href='javascript:void(0)' id='selectAllUsers'>Select all " + totalUSers + " users</a>";
        $("#selectionDiv").html(text);
        $("#targetselection").show();
    }else{
        $("#selectionDiv").html("");
        $("#targetselection").hide();
    }
});

$("body").on("click",".notif_users",function()
{
    $("#selectAllIds").val("");
    $('#notif_users_all').prop("checked",false);
    $("#targetselection").hide();
});

$("body").on("click","#selectAllUsers",function()
{
    let totalUSers = $("#totalActiveUsers").html();
    let text = "All "+ totalUSers + " users are selected. <a href='javascript:void(0)' id='clearSelection'>clear selection</a> ";
    $("#selectionDiv").html(text);
//    $("#targetselection").fadeIn();
    $("#selectAllIds").val("1");
});

$("body").on("click","#clearSelection",function()
{
    $("#selectAllIds").val("");
    $('.notif_users, #notif_users_all').prop("checked",false);
    $("#targetselection").hide();
});

$('.datepicker').datepicker({startView : 'month', format : 'dd/mm/yyyy', enableYearToMonth: true, enableMonthToDay : true});

$('.modalButton').on('click', function (e) {
    var $form = $("#activeUsersFilterForm");
    $form.attr("action", '/app-notifications/active-users-downloads');
    $form.attr("target", 'modalIframe');
    $form.submit();
    $form.removeAttr("target");
    $form.attr("action","/app-notifications/app-user-listing-download");
});
$('#myModal').on('hidden.bs.modal', function () {
    $("#modalIframe").html("");
    $("#modalIframe").attr("src", "");
});

var downloadActiveUsersFile = function(url){
    if(url!=='' && url !==null && typeof(url) !== "undefined"){
        window.open(url, "_self");
    }
};


$(document).on('click', '#isRecurring', function (e) 
{
    if ($(this).is(':checked')) {
        $(".dependentBox").addClass('fadeIn').removeClass('hide');
    }
    else{
        $(".dependentBox").removeClass('fadeIn').addClass('hide');
    }
    $("#notificationForm .modal-content").animate({ scrollTop: $('.dependentBox').offset().top}, 200);
}); 

function previewNotification(){
    var preview = $("#notifMessage").val();
    preview = preview.replaceAll("<","&lt")
    $("#alertTitle").html("Preview");
    $("#SuccessPopupArea #MsgBody").html(preview);
    $("#SuccessPopupArea").modal()
}