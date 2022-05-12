/*
 * To handle all functions of Applicant CallBack.
 */
$(document).on('click','div#applicant-callback-div a#call-back-btn',function() {
    $('div#applicant-callback-div #thankyou_html').hide();
    $('div#applicant-callback-div #form_container_html').show();
    $('div#applicant-callback-div').toggleClass('open');
    $(".cont-rght-side-fixed").removeClass('open');
});

$(document).on('click','div#applicant-callback-div a#call-back-btn-mob',function() {
    $('div#applicant-callback-div #thankyou_html').hide();
    $('div#applicant-callback-div #form_container_html').show();
    $('div#callbackModal').modal();
    $('div#contact-us-block').modal('hide');
});



$(document).on('click','div#applicant-callback-div #callProceedBtn',function() {
    $(this).attr('disabled', true);
    $('div#applicant-callback-div div#thankyou_html').html('').hide();
    $.ajax({
        url: jsVars.FULL_URL+'/proceed-callback-data',
        data : { callHash:$("div#applicant-callback-div input#callHash").val() },
        type: 'post',
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('div#callLoaderContainer').show();
        },
        complete: function () {
            $('div#callLoaderContainer').hide();
            $('div#applicant-callback-div #callProceedBtn').removeAttr('disabled');
        },
        success: function (json) {
            $('div#applicant-callback-div #callProceedBtn').removeAttr('disabled');
            if (json['error']) {
                 $('div#applicant-callback-div div#thankyou_html').addClass('errormsg').html(json['error']).show();
            } else if (json['status'] && json['status'] == 'success') {
                $('div#applicant-callback-div div#thankyou_html').show().html('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button> <p>Your request is processed successfully.</p>');
                $('div#applicant-callback-div div#form_container_html').hide();
               // $('div#contact-us-block').removeClass('in').css('display','none')
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
//            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
});