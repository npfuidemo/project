function modifyDetailSubmit(){

    $('#next_btn').prop('disabled',true);
    var data = $('#md_save_data').serializeArray();
    $.ajax({
        url: college_slug+'/form/modify-detail-submit',
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#listloader').show();
            $('#next_btn').prop('disabled',true);
        },
        complete: function (){
            $('#listloader').hide();
        },
        success: function (json) {
            if (typeof json['error'] !=='undefined' && json['error'] === 'session') {
                window.location.reload(true);
            }
            else if (typeof json['error'] !=='undefined' && json['error'] !== '') {
                alertPopup(json['error'],'error');
                $('#next_btn').prop('disabled',false);
            }
            else if(typeof json['success'] !=='undefined' && json['success'] === 200){
                
                if(typeof json['location'] !='undefined' && json['location']!=''){
                    window.location.href = json['location'];
                }
                else {
                    $('#SuccessPopupArea').on('hidden.bs.modal', function () {
                        window.location.href = json['pop_location'];
                    });

                    $("#SuccessPopupArea #alertTitle").html("Success");
                    alertPopup(json['msg'],'success');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
//            hideFilterLoader();
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}