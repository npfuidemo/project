/*Copy Form On Environment*/
$(document).on('click','#copyFormOnEnvironmentForm #saveCopyFormBtn', function () {
    //hide error
    $('#copyFormOnEnvironmentForm span.requiredError').text('').css('display','none');
    var data = $('#copyFormOnEnvironmentForm').serializeArray();
    $('div.loader-block').css("display", "block");
    $(this).attr("disabled", "disabled");
    $.ajax({
        url: jsVars.validateFormOnEnvironmentUrl,
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            $('div.loader-block').css("display", "none");
            $('#copyFormOnEnvironmentForm #saveCopyFormBtn').removeAttr("disabled");
            if(json['redirect']) {
                location = json['redirect'];
            }
            else if(json['fieldError']) {
                // System Error
                alertPopup(json['fieldError'], 'error');
            }
            else if(json['error']) {
                for (var fieldId in json['error']) {
                    $('#copyFormOnEnvironmentForm span#' + fieldId + '_error').text(json['error'][fieldId]);
                    $('#copyFormOnEnvironmentForm span#' + fieldId + '_error').css('display','block');
                }
            }
            else if(json['success'] == 200) {
                if(json['saveUrl']) {
                    var formTitle = $('p#formTitle').text();
                    var instituteName = $('p#instituteName').text();
                    var toEnvironment = $('p#toEnvironment').text();
                    $('#ConfirmMsgBody').html('You are creating "'+ formTitle +'" under "'+ instituteName +'" on "'+ toEnvironment +'". Would you like to continue?');
                    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
                            .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                                e.preventDefault();
                        saveFormOnEnvironment(json['saveUrl']);
                        $('#ConfirmPopupArea').modal('hide');
                    });
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });        
});

function saveFormOnEnvironment(saveFormOnEnvironmentUrl)
{
    var data = $('#copyFormOnEnvironmentForm').serializeArray();
    $('div.loader-block').css("display", "block");
    $('#ConfirmPopupArea #confirmYes').attr("disabled", "disabled");
    $.ajax({
        url: saveFormOnEnvironmentUrl,
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            $('div.loader-block').css("display", "none");
            $('#ConfirmPopupArea #confirmYes').removeAttr("disabled");
            if(json['redirect']) {
                location = json['redirect'];
            }
            else if(json['fieldError']) {
                // System Error
                alertPopup(json['fieldError'], 'error');
            }
            else if(json['error']) {
                for (var fieldId in json['error']) {
                    $('#copyFormOnEnvironmentForm span#' + fieldId + '_error').text(json['error'][fieldId]);
                    $('#copyFormOnEnvironmentForm span#' + fieldId + '_error').css('display','block');
                }
            }
            else if(json['success'] == 200) {
                location = json['location'];
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}