/* 
 * To handle node js + payment functions.
 */

//set minutes 
var mins = 5;

//calculate the seconds 
var secs = mins * 60;

document.addEventListener('contextmenu', event => event.preventDefault());

$(document).keydown(function(e){
    if(e.which === 123){
       return false;
    }
});

$(document).ready(function () {    
    //start count douwn
    countdown();
});

//countdown function is evoked when page is loaded 
function countdown() {
    setTimeout('Decrement()', 60);
}

//Decrement function decrement the value. 
function Decrement() {
    if (document.getElementById) {
        minutes = document.getElementById("minutes");
        seconds = document.getElementById("seconds");

        //if less than a minute remaining 
        //Display only seconds value. 
        if (seconds < 59) {
            seconds.textContent = secs;
        }

        //Display both minutes and seconds 
        //getminutes and getseconds is used to 
        //get minutes and seconds 
        else {
            minutes.textContent = getminutes();
            seconds.textContent = getseconds();
        }
        //when less than a minute remaining 
        //colour of the minutes and seconds 
        //changes to red 
        if (mins < 1) {
            minutes.style.color = "red";
            seconds.style.color = "red";
        }
        //if seconds becomes zero, 
        //then page alert time up 
        if (mins < 0) {
            cancelredirect();
            minutes.textContent = 0;
            seconds.textContent = 0;
        }
        //if seconds > 0 then seconds is decremented 
        else {
            secs--;
            setTimeout('Decrement()', 1000);
        }
    }
}

function getminutes() {
    //minutes is seconds divided by 60, rounded down 
    mins = Math.floor(secs / 60);
    return mins;
}

function getseconds() {
    //take minutes remaining (as seconds) away  
    //from total seconds remaining 
    return secs - Math.round(mins * 60);
}

function cancelredirect() {
    if (typeof jsVars.paymentCancelUrl != 'undefined') {
        location = jsVars.paymentCancelUrl;
    } else {
        location = jsVars.FULL_URL;
    }
}

function successPayment(payment) {
    
    if ((typeof payment[0]['order_status'] != 'undefined') && (payment[0]['order_status'] == 'failed')) {
        cancelredirect();
    }
    //console.log(JSON.stringify(payment));
    $.ajax({
        url:  jsVars.validatePaymentDetailsUrl,
        type: 'post',
        data: {data:payment},
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if (json['status'] === 200)
            {
                if(json['data'].length > 0) {
                    $('#ipnProcessData').val(json['data']);
                    document.paymentForm.submit();
                } else {
                    cancelredirect();
                }
            } else if ((json['status'] === 0) && (json['message'] == 'redirect')) {
                location = jsVars.FULL_URL;
            } else {
                location = jsVars.FULL_URL;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
