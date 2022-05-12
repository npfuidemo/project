var triggerClickIds = [];

$(document).on("click", ".tablinks", function() {
    $(".tablinks").removeClass("active");
    $(this).addClass('active');    
    var target=$(this).attr("data-target");
    $('.tabcontent').hide();
    $("#"+target).show();
    if(triggerClickIds.indexOf($(this).attr("id")) < 0) {
        triggerClickIds.push($(this).attr("id"));
        showAdditionalConfig($(this).attr("id"), true);
    }
});


function showAdditionalConfig(targetId = '', clickLick = false)
{
    if ($("#college_id").val() == "")
    {
        $('#load_msg').html("<div class='col-lg-12'><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'> Please select an institute name to view additional configuration. </h4></div></div> </div>");
        return;
    }

    postURL = jsVars.fetchAdditionalConfigUrl;
    switch(targetId) {
        case "chatbotConfigTab":
            postURL = jsVars.fetchAdditionalChatbotConfigUrl;
            break;
        
        case "telephonyConfigTab":
            postURL = jsVars.fetchAdditionalTelephonyConfigUrl;
            break;
    }
    
    if(postURL === '') {
        alertPopup("Invalid request", 'error');
    } else {
        $.ajax({
            url: postURL,
            type: 'post',
            data: {'collegeId': $("#college_id").val()},
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
            },
            complete: function () {
            },
            success: function (html) {
                if(clickLick === true) {
                    if($("#"+targetId.substring(0,targetId.length - 3)).length) {
                        $("#"+targetId.substring(0,targetId.length - 3)).remove();
                        $("#loadResult").append(html);
                    } else {
                        $("#loadResult").append(html);
                    }                    
                } else {
                    triggerClickIds = [];
                    $("#load_msg_div").html(html);
                    if(targetId == "") {
                        $("#telephonyConfigTab").trigger("click");
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

$(document).on('submit', '#instConfigs', function (ev)
{
    ev.preventDefault();
    var dashletUrl = $("#instConfigs").attr('action');
    var tconfigs = $("#instConfigs").serializeArray();
    $.ajax({
        url: dashletUrl,
        type: 'post',
        data: tconfigs,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
// $('#applicationTimeSlotDashletHTML .panel-loader').hide();
// $('#applicationTimeSlotDashletHTML .panel-heading, #applicationTimeSlotDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response)
        {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                alertPopup(responseObject.message);
            }
// return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
});

$(document).on('submit', '#chatbotConfigs', function (ev)
{
    ev.preventDefault();
    $("#submit_next").attr("disabled", true);
    var dashletUrl = $("#chatbotConfigs").attr('action');
    var tconfigs = $("#chatbotConfigs").serializeArray();
    $(".requireFields").empty();
    $.ajax({
        url: dashletUrl,
        type: 'post',
        data: tconfigs,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
            $("#submit_next").removeAttr("disabled");
        },
        success: function (response)
        {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == "error") {
                var responseMessageObject = $.parseJSON(responseObject.message);
                $.each(responseMessageObject, function(key, value){
                    $("#error_"+key).text(value);
                });
            } else if(responseObject.status == 1) {
                showAdditionalConfig("chatbotConfigTab", true);
                alertPopup(responseObject.message);                
            } else {
                alertPopup("Error: "+responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
});

function doChosen() {
    $("select").chosen();
}

function alertPopup(msg, type, location) {
    if (type === 'error') {
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

    if (typeof location !== 'undefined') {
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
