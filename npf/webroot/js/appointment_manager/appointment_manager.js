$(document).on('click', '#submitGetStarted', submitGetStarted);
function submitGetStarted(){
    var cid = Number(jsVars.collegeformIdSufix)+Number($('#college_id').val());
    $('#collegeError').html('');
    if(typeof $('#college_id').val()=='undefined' || $('#college_id').val()==null ||  $('#college_id').val()=='') {
        $('#collegeError').html('Please select institute.');
        return false;
    }
    var url = $('.appointmentManagerForm').attr('action');
    $('.appointmentManagerForm').attr('action',url+'/'+cid);
    $('.appointmentManagerForm').submit();
}

$("#processNextBtn").on('click',function(e) {
    
    if($("#sortable1").find("input[name*='process_name']").length<=0){
        $("#process_error").show().text("Please design a workflow first to proceed further with configuring Post Application Stages. To do the same, you can pick any of the Post Application Process Stages and drop the same as part of the Workflow!");
        return false;
    }       
    $('#processNextBtn').prop('disabled', true);
    $('.virtualPostApplicationProcessForm').submit();
});
$(document).ready(function(){
    var collegeId=$("#college_id").val();
    if(typeof collegeId =="undefined" || collegeId==""){
       $('#college_id_chosen').trigger('mousedown');
    }
});
$('[data-toggle="popover"]').popover();
