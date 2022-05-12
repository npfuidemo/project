function LoadMaskingForms(value, default_val) {
    
    $('#final_columns').html('');
    $.ajax({
        url: '/form/get-masking-forms',
        type: 'post',
        dataType: 'json',
        data: {
            "college_id": value,
            "default_val": default_val
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if(typeof json['redirect'] !='undefined' && json['redirect'] !=""){
                   window.location.href= json['redirect'];
            }else if(json['status']==200){
                $('#allCollegeformsList').html(json['data']);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

