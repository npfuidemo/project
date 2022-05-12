window.onload = getCityData();
 
function saveBookGdpislot(){
    $("#save_button_gdpi").hide();
    var data=$('#gd_pi_form').serializeArray(); 
    data.push({name : "venue_city" , value : $("#venue_city").val()});
    data.push({name : "venue_address" , value : $("#venue_address").val()});
    data.push({name : "gdpi_date" , value : $("#gdpi_date").val()});
    data.push({name : "gdpi_time_slot" , value : $("#gdpi_time_slot").val()}); 
    $.ajax({
        url: jsVars.FULL_URL+'/form/save-book-gdpi-slot/'+jsVars.fid,
        type: 'post',
        dataType: 'json',
        data: data,
        beforeSend: function (xhr) {
            $('.newLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if(data.status==true){
                 $('.success_message span').html(data.message).parent().show();
                 $("#save_button_gdpi").hide();
                 $("#venue_city_chosen").attr("disabled",true);
                 $("#venue_address").attr("disabled",true);
                 $("#gdpi_date").attr("disabled",true);
                 $("#gdpi_time_slot").attr("disabled",true);
                 $('.msg_error').hide();
            }else if(data.status==false && data.message=="session_logout"){
                window.location=jsVars.FULL_URL;
            }else{
                 $('.msg_error').html(data.message).show();
                 $("#save_button_gdpi").show();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $(".newLoader").hide();
        }
    });
} 

function getCityData(){
    var data = $('#gd_pi_form').serializeArray(); 
    if($("#venue_city > option").length>0){
        data.push({name : "venue_city" , value :$("#venue_city").val() });
    }else{
        data.push({name : "venue_city" , value :jsVars.gdpi_center });
    }
    $.ajax({
        url: jsVars.FULL_URL+'/form/save-gdpi-stu-config/'+jsVars.fid,
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if(data=="session_logout"){
                window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if(data=="invalid_parameters"){
                $("#msg_error").html("Invalid Request , please try again.");
            }else if(data=="invalid_formId"){
                $("#msg_error").html("Invalid form id , please try again.");
            }else if(data=="invalid_college"){
                $("#msg_error").html("Invalid college id , please try again.");
            }else if(data=="invalid_city"){
                $("#msg_error").html("Venue city not found. , please try again.");
            }else if(data=="firt_step_missing"){
                $("#msg_error").html("GDPI first step is not done. , please try again.");
            }else if(data=="is_predefined_missing"){
                $("#msg_error").html("GDPI taxonomies are not mapped properly. , please try again.");
            }else{
                if(data){
                    $("#city_data").html(data); 
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
        }
    });
}
	