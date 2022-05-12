
function LoadForms(value, default_val,multiselect,module) {
    if(typeof multiselect =='undefined'){
        multiselect = '';
    }
    if(typeof value !='undefined'){
        $('#collegeError').html('');
    }
    $.ajax({
        url: jsVars.FULL_URL + '/voucher/get-forms',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "college_id": value,
            "default_val": default_val,
            "multiselect":multiselect,
            "type":"vip"
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if(data=="session_logout"){
                window.location.reload(true);
            }
            $('#div_load_forms').html('<label for="" class="form-label">Choose Application Form</label>'+data+'<span class="error" id="formError"></span>');
            if(typeof value !='undefined' && value!=""){
                $('#div_load_forms').attr('style','display:inline-block');
                $('.college_cond').css('visibility','visible');
            }
            
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('#college_id_chosen').addClass("choosen_sel");
            $('#form_id_chosen').addClass("choosen_sel")
            var sel_form=$('#form_id').val();
            if(typeof sel_form =='undefined' || sel_form=="" || sel_form=="0"){
                $('#form_id_chosen').trigger('mousedown');
            }else{
                $('.form_cond').css('visibility','visible');
            }            
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$("#submitNextBtn").on('click',function(e){
    cid = Number(jsVars.collegeformIdSufix)+Number($('#college_id').val());
    fid = Number(jsVars.collegeformIdSufix)+Number($('#form_id').val());
    $('#collegeError').html('');
    $('#formError').html('');
    if(typeof $('#college_id').val()=='undefined' || $('#college_id').val()==null ||  $('#college_id').val()=='') {
        $('#collegeError').html('Please select institute.');
        return false;
    }
    if(typeof $('#form_id').val()=='undefined' || $('#form_id').val()==null || $('#form_id').val()=='' ||$('#form_id').val()=='0') {
        $('#formError').html('Please select form.');
        return false;
    }
    var url = $('.virtualPostApplicationForm').attr('action');
    $('.virtualPostApplicationForm').attr('action',url+'/'+cid+'/'+fid);
    $('.virtualPostApplicationForm').submit();
});

$("#processNextBtn").on('click',function(e) {
    
    if($("#sortable1").find("input[name*='process_name']").length<=0){
        $("#process_error").show().text("Please design a workflow first to proceed further with configuring Post Application Stages. To do the same, you can pick any of the Post Application Process Stages and drop the same as part of the Workflow!");
        return false;
    }       
    $('#processNextBtn').prop('disabled', true);
    $('.virtualPostApplicationProcessForm').submit();
});
$(document).ready(function(){
    var sel_college=$("#college_id").val();
    if(typeof sel_college =="undefined" || sel_college==""){
       $('#college_id_chosen').trigger('mousedown');
    }
    
    var sel_form=$("#college_id").val();
    if(typeof sel_form!="undefined" && sel_form!=""){
        $('.form_cond').css('visibility','visible');
    }
});

function form_sel(context){
    var sel_form=$(context).val();
    if(typeof sel_form!="undefined" && sel_form!=""){
        $('.form_cond').css('visibility','visible');
    }
    
}
$('[data-toggle="popover"]').popover();
