 var hours =0;
 var mins =0;
 var seconds =0;
 var timex = 0;
 let timerInterval;
 function DisplayCurrentTime() {
   var date = new Date();
   var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
   var am_pm = date.getHours() >= 12 ? "PM" : "AM";
   hours = hours < 10 ? "0" + hours : hours;
   var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
   var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
   time = hours + ":" + minutes + ":" + seconds + " " + am_pm;
   var lblTime = document.getElementById("currentTime");
   lblTime.innerHTML = time;
};


 $(document).on("click","#timer_start",function(e) {
  var last_status = $("#timer_start").text().replace("-","");
  $("#widget_last_status").val(last_status);
  var checkin_time = new Date().getTime();
  markCheckinCheckoutForUser();
  var checkin_duration = $("#widget_checkin_duration").val();
  $(this).hide();
  $("#timer_stop").show();
});

$(document).on("click","#timer_stop",function(e) {
  var last_status = $("#timer_stop").text().replace("-","");
  $("#widget_last_status").val(last_status);
  markCheckinCheckoutForUser();
  var checkin_duration = $("#widget_checkin_duration").val();
  $(this).hide();
  $("#timer_start").show();
});

 function startTimer(){
   timex = setTimeout(function(){
       seconds++;
     if(seconds >59){seconds=0;mins++;
        if(mins>59) {
         mins=0;hours++;
          if(hours <10) {$("#timer_hours").text('0'+hours+' :')} else $("#timer_hours").text(hours+' :');
       }
                        
       if(mins<10){                     
        $("#timer_mins").text('0'+mins+' :');
       }       
       else $("#timer_mins").text(mins+' :');
     }    
     if(seconds <10) {
       $("#timer_seconds").text('0'+seconds);} else {
       $("#timer_seconds").text(seconds);
       }
      // recursive call to timer
      startTimer()
   },1000);
  }

  function formatTime(timeInSeconds) {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    if(hours <10) {
        $("#timer_hours").text('0'+hours+' :');
    } else {
        $("#timer_hours").text(hours+' :');
    }

    if(minutes<10){
        $("#timer_mins").text('0'+minutes+' :');
    }
    else{
        $("#timer_mins").text(minutes+' :');
    }
     if(seconds <10) {
        $("#timer_seconds").text('0'+seconds);
     } else {
        $("#timer_seconds").text(seconds);
     }
}


function updateTimerDisplay(timeDifference) {
    const timeInSeconds = Math.max(Math.floor(timeDifference / 1000), 0); // Ensure non-negative time
    formatTime(timeInSeconds);
}
let timeDifference = 0;
function startCheckinCheckoutTimer(checkin_time,last_status,checkin_duration,last_time=0,server_time) {
    var duration = get_duration(checkin_time,last_status,checkin_duration,last_time,server_time);
    var user_id = $("#widget_user_id").val();
    timeDifference = duration;
    if(last_status == "checkin"){
        clearInterval(timerInterval);
        timerInterval = setInterval(function () {
        timeDifference = timeDifference+1000;
        if (timeDifference < 1000) {
            clearInterval(timerInterval);
            updateTimerDisplay(timeDifference);
        }else {
            updateTimerDisplay(timeDifference);
        }
        }, 1000);
    }else{
        if(last_status == "checkout"  && duration!=undefined){
            if(timerInterval !=undefined){
                clearInterval(timerInterval);
            }
            if(timeDifference==undefined || timeDifference== 0){
                timeDifference = duration*1000;
            }
            updateTimerDisplay(timeDifference);
        }
    }
}


function get_duration(checkin_time,last_status,checkin_duration,last_time,server_time){
    var duration = checkin_duration*1000;
    if(last_status=="checkin"){
       if(duration!= 0){
            const now = parseInt(server_time)*1000;
            var elapse_time = now - parseInt(last_time)*1000;
            duration+= elapse_time;
       }
       else{
           const now = parseInt(server_time)*1000;
           var elapse_time = now - parseInt(checkin_time*1000);
           duration += elapse_time;
       }
    }
    return duration;
}
