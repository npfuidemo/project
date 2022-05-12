/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function(){
    //initMultipleCKEditor('editor', jsVars.tokenList);
    initMultipleCKEditor('editor');
    if (typeof jsVars.isLabelPrintTemplate != 'undefined') {
        $('select#template_type').trigger('change');    
    }
    
    $(document).on('change','select#template_type', function(){
        if (this.value == 'label_printing') {
            $('div#labelPerRowDiv, div#rowPerPageDiv, div#editorHeaderTextDiv, div#editorFooterTextDiv').show();
            initMultipleCKEditor('editorHeaderText');
            initMultipleCKEditor('editorFooterText');
        }
        else {
            $('div#labelPerRowDiv, div#rowPerPageDiv, div#editorHeaderTextDiv, div#editorFooterTextDiv').hide();
            removeCKEditor('editorHeaderText');
            removeCKEditor('editorFooterText');
        }
    });

    
    $(document).on('change', '#documentTemplateForm #college_id', function () {
       college_id=$(this).val();
       checkExamConfig(college_id);
       checkAdminFieldConfig(college_id);
       getGdpiBookingToken(college_id);
    });
    $(document).on('change', '#documentTemplateForm #template_type', function () {
       var template_type = $(this).val();
       showHideSubType(template_type);
       if(template_type == 'admit-card' || template_type == 'ack-pdf' || template_type == 'print_application') {
           $('#token_format').closest('div.form-group.formAreaCols').show();
       } else {
            $('#token_format').val('').trigger('chosen:updated').closest('div.form-group.formAreaCols').hide();
       }
       if(template_type === 'offline_lead_sheet' ) {
           $("#displayLeadSheetInfo").show();
       } else {
           $("#displayLeadSheetInfo").hide();
       }
    });
    
    if($('#college_id').val()!=""){
        checkExamConfig($('#college_id').val());
        checkAdminFieldConfig($('#college_id').val());
        getGdpiBookingToken($('#college_id').val());
    }
});

function checkExamConfig(college_id) {
    $('#exam_module_tokens').hide();
    $.ajax({
        url: '/exam/check-exam-config',
        type: 'post',
        dataType: 'json',
        data: {
            "cid": college_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        async:false,
        success: function (data) {
            if(data["msg_type"]=="error"){
                if(data["error_text"]=="session_logout"){
                    window.location.reload(true);
                }else if(data["error_text"]=="data_missing"){
                    $('#exam_module_tokens').html("");
                    $('#exam_module_tokens').hide();
                }
            }else if(data["msg_type"]=="success"){
                var finalToken = '';
                $(data["tokens"]).each(function(index, value) {
                    finalToken += value;
                });
                
                $('#exam_module_tokens').html(finalToken);
                $('#exam_module_tokens').fadeIn();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function checkAdminFieldConfig(college_id) {
    $('#admin_fields_tokens').hide();
    $.ajax({
        url: jsVars.FULL_URL+'/applicationfields/check-admin-field-config',
        type: 'post',
        dataType: 'json',
        data: {
            "cid": college_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        async:false,
        success: function (data) {
            
            if(data["msg_type"]=="error"){
                if(data["error_text"]=="session_logout"){
                    window.location.reload(true);
                }else if(data["error_text"]=="data_missing"){
                    $('#admin_fields_tokens').html("");
                    $('#admin_fields_tokens').hide();
                }
            }else if(data["msg_type"]=="success"){
                var finalToken = '';
                $(data["tokens"]).each(function(index, value) {
                    finalToken += value;
                });
                $('#admin_fields_tokens').html(finalToken);
                $('#admin_fields_tokens').fadeIn();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getGdpiBookingToken(college_id) {
    $('#gdpi_booking_tokens').hide();
    $.ajax({
        url: jsVars.FULL_URL+'/applicationfields/getGdpiBookingToken',
        type: 'post',
        dataType: 'json',
        data: {
            "cid": college_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        async:false,
        success: function (data) {
            
            if(data["msg_type"]=="error"){
                if(data["error_text"]=="session_logout"){
                    window.location.reload(true);
                }else if(data["error_text"]=="data_missing"){
                    $('#gdpi_booking_tokens').html("");
                    $('#gdpi_booking_tokens').hide();
                }
            }else if(data["msg_type"]=="success"){
                var finalToken = '';
                $(data["tokens"]).each(function(index, value) {
                    finalToken += value;
                });
                $('#gdpi_booking_tokens').html(finalToken);
                $('#gdpi_booking_tokens').fadeIn();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function showHideSubType(template_type){
    if(template_type=='admit-card'){
        $('#template_sub_type_wrapper').show();
    }else{
        $('#template_sub_type_wrapper').hide();
    }
}