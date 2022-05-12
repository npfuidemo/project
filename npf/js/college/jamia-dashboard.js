$(document).ready(function () {
    $.material.init();
    table_fix_rowcol();
	$('[data-toggle="popover"]').popover();
});


function LoadFormsOnDashboard(value, default_val,multiselect,module) {
    if(typeof multiselect =='undefined'){
        multiselect = '';
    }
    $.ajax({
        url: '/voucher/get-forms',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "college_id": value,
            "default_val": default_val,
            "multiselect":multiselect
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        async:false,
        success: function (data) {
            if(data=="session_logout"){
                window.location.reload(true);
            }
            $('#div_load_forms').html(data);
            $('.div_load_forms').html(data);
            $('#div_load_forms select > option:first-child').text('Select School');
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}



$(document).on('change', '#jamia-feedbackform #form_id', function () {
   form_id=$(this).val();
   feedbackDashboardAjax(form_id,"courses","","course_name");
   feedbackDashboardAjax(form_id,"teachers","","teacher_name");
});

$(document).on('change', '#jamia-feedbackform #course_name', function () {
   course_name=$(this).val();
   feedbackDashboardAjax(course_name,"semesters","","semester_name");
});


function feedbackDashboardAjax(form_id, type,selected="",select_id) {
    var college_id_md = 0;
    if(typeof multiselect =='undefined'){
        multiselect = '';
    }
    if( $("[name='h_college_id']").length > 0 && typeof $("[name='h_college_id']").val() != "undefined" ){
        college_id_md = $("[name='h_college_id']").val();
    }
    
    
    $.ajax({
        url: '/colleges/feedback-dashboard-ajax',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "form_id": form_id,
            "type": type,
            "selected":selected,
            "college_id":college_id_md
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        async:false,
        success: function (data) {
            if(data=="session_logout"){
                window.location.reload(true);
            }
            $('#'+select_id).html(data);
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.chosen-select').trigger('chosen:updated');
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}