// Onchange of Registration fields:
$(document).on('change','[name="registration_fields[]"]',function(event){
    var $this = $(this);
    var previous_group = $this.closest('.bulk-form-group').attr('data-previous');
    if($this.val().trim().length==0){
        removeDataGroup(previous_group);
        return;
    }
    var data_group = $('option:selected',this).attr('data-group');
    var selected_field = $('option:selected',this).attr('key');
    var target_id = 'bulk_upload_input_'+selected_field;
    var UpperCaseId = selected_field.replace(/(^|_)./g, s => s.slice(-1).toUpperCase());
    var validation_id = 'bulk_upload_validation_'+UpperCaseId;
    var count_fields = $('[name="registration_fields[]"]').length;
    
    $this.closest('.bulk-form-group').attr('data-previous',data_group).attr('id',validation_id);
    $this.closest('.reg_fields').next().attr('data-target',selected_field).attr('id',target_id);  
    $this.closest('.reg_fields').next().next().find('.remove-row').attr('data-target',data_group);
    $this.closest('.reg_fields').next().next().next().find('.error').hide().html('');
    $this.closest('.reg_fields').next().next().next().find('.depends').hide().html('');
    var selected_field_value = $this.val();
    
    var $selected_data_group = $this.find('option[data-group="'+data_group+'"]');
    var totalFieldsCount = parseInt($selected_data_group.length)+parseInt(count_fields)-1;

    removeDataGroup(previous_group); // Remove previous selected group
    composeInputFields([selected_field_value],data_group,target_id,true);
    // console.log('totalFieldsCount:',totalFieldsCount);
    if(parseInt(totalFieldsCount) > jsVars.maximum_field_allowed){
        alertPopup('Maximum '+jsVars.maximum_field_allowed+' fields can be updated at once','error');
        $('#ErroralertTitle').html('Notification');
        $this.val('');
        $this.closest('.bulk-form-group').attr('data-previous','na');
        $this.closest('.bulk-form-group').removeAttr('id');
        $this.closest('.reg_fields').next().removeAttr('id');  
        $this.closest('.reg_fields').next().next().find('.remove-row').attr('data-target','na');
        $this.chosen();
        $this.trigger("chosen:updated");
        return false;
    }
    // Compose Dependent Fields
    if(parseInt($selected_data_group.length) > 1){
        var dependent_fields = new Array();
        $selected_data_group.each(function(){
            if($(this).val()!=selected_field_value){
                dependent_fields.push($(this).val());
            }
        });
        if(dependent_fields.length>0){
            composeInputFields(dependent_fields,data_group,validation_id,false);
        }
    }
    $('input[name="totalFields"]').val(totalFieldsCount);
    disableSelected();

});


$(document).on('click','.remove-row',function(event){
    var data_target = $(this).attr('data-target');
    if(data_target=='na'){
        $(this).closest('.bulk-form-group').remove();
    }else{
        removeDataGroup(data_target);
    }
    var count_fields = $('[name="registration_fields[]"]').length; 
    $('input[name="totalFields"]').val(parseInt(count_fields));
});


$(document).on('click','.add-row',function(event){
    var field_count = $('[name="registration_fields[]"]').length;
    // console.log('field_count:',field_count);
    if(parseInt(field_count)>=jsVars.maximum_field_allowed){
        alertPopup('Maximum '+jsVars.maximum_field_allowed+' fields can be updated at once','error');
        $('#ErroralertTitle').html('Notification');
        return;
    }
    var $newRow = $('.first-row').clone();
    $newRow.removeClass('first-row').attr('data-previous','na');
    $newRow.find('.reg_fields select').val('');
    $newRow.find('.reg_fields_input').removeAttr('id');
    $newRow.find('.reg_fields_input').attr('data-target','na');
    $newRow.find('.reg_fields_input').html('<div class="form-control empty-cell" style="line-height:10px;">Select Field</div>');
    $newRow.find('.chosen-container').remove();
    $newRow.find('.actionbox .remove-row').show().attr('data-target','na');
    $newRow.find('.depends-and-error .error').hide().html('');
    $('#registration_field_row').append($newRow);
    $newRow.find('.chosen-select').chosen();
    $newRow.find('.chosen-select').trigger("chosen:updated");
    count_fields = $('[name="registration_fields[]"]').length; 
    $('input[name="totalFields"]').val(parseInt(count_fields));
    disableSelected();
});


function removeDataGroup(data_group){
    if(data_group!='na'){
        $("[data-previous="+data_group+"]").each(function(){
            $(this).find('.error').hide().html('');
            $(this).find('.depends').hide().html('');
            if($(this).hasClass('first-row')){
                $(this).closest('.bulk-form-group').attr('data-previous','na').removeAttr('id');
                $(this).find('.reg_fields select').val('');
                $(this).find('.reg_fields_input').attr('data-previous','na').html('<div class="form-control empty-cell" style="line-height:10px;">Select Field</div>').removeAttr('id');
                $(this).find('.actionbox .remove-row').attr('data-target','na');
            }else{
                $(this).remove();
            }
        });
    }
    var count_fields = $('[name="registration_fields[]"]').length; 
    $('input[name="totalFields"]').val(parseInt(count_fields));
    disableSelected();

}

// Compose fields when a field is selected
function composeInputFields(fields,data_group,target,isSingle){
    var college_id = $.trim($("#user_college_id").val());
    $('#confirmSaveBulkUpdateData').attr("disabled", "disabled");
    var loadingFields = '<div class="text-center"><span type="button" class="btn btn-xs btn-line-secondary"><i class="fa fa-spinner fa-spin"></i>&nbsp;&nbsp;Loading fields...</span></div>';
    $.ajax({
        url: '/leads/compose-input-field',
        type: 'post',
        dataType: 'html',
        data: {'college_id':college_id,'fields':fields,'data_group':data_group,isSingle:isSingle},
        beforeSend: function () { 
          // showLoader(); 
          $('#lead-update-fields').html(loadingFields); 
        },
        complete:function(){
           // hideLoader();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (htmlResponse){
            var checkError  = htmlResponse.substring(0, 6);
            if (htmlResponse === 'session_logout'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alertPopup(htmlResponse.substring(6, htmlResponse.length),'error');
                $('#ErroralertTitle').html('Notification');
            }else{
                $('#lead-update-fields').html('');
                if(isSingle){
                    $('#'+target).html(htmlResponse);
                }else{
                    $(htmlResponse).insertAfter('#'+target);
                    // $('#'+target).append(htmlResponse);
                }
                $('#confirmSaveBulkUpdateData').removeAttr("disabled");
                $('#bulkUpdateLeadForm').find('.chosen-select').chosen();
                $('#bulkUpdateLeadForm').find('.date-time-picker').datetimepicker({format: 'DD/MM/YYYY HH:mm',viewMode: 'years'});
                disableSelected();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function disableSelected(){
    var disable_items = [];
    $('select[name="registration_fields[]"]').each(function(){
        disable_items.push($(this).find('option:selected').val());
        $(this).find('option').attr('disabled',false);
    });
    $('select[name="registration_fields[]"]').each(function(){
        $(this).find('option').each(function(index,data){
            if($(this).attr('data-parent')!='na' && typeof $(this).attr('data-parent')!='undefned'){
                $(this).attr('disabled',true);
            }
            // Disable Selected Fields 
            if(disable_items.includes($(this).val()) && $(this).val()!='' && $(this).val()!=0 && $(this).val().trim().length>0){
                $(this).attr('disabled',true);
            }
            // Enable Empty Field in Each Row
            if($(this).val().length==0){
                $(this).attr('disabled',false);         
            }
        });
    });
    $('.chosen-select').chosen();
    $('.chosen-select').trigger("chosen:updated");
}

$(document).on('click','#confirmSaveBulkUpdateData',function(event){
    $('#bulk_update_error').html('');
    var total_records = $('input[name="totalRecords"]').val();
    var total_fields = 0;
    $('#ConfirmBulkUpdateYes').removeAttr("disabled", "disabled").removeClass("disabled").html('Confirm');
    
    if(total_records > jsVars.maximum_record_allowed){
        alertPopup('Maximum '+jsVars.maximum_record_allowed+' records can be selected at a time, you have selected '+total_records+' records.','error');
        $('#ErroralertTitle').html('Notification');
        return;
    }

    var $form = $("#bulkUpdateLeadForm");
    var empty_field_error = [];
    $.each($form.serializeArray(), function() {
        if(this.name.indexOf('update_fields')!=-1){
            total_fields = total_fields+1;
        }
        if(this.value.trim().length<1){
            empty_field_error.push(this.name);
        }
    });

    $('#count_lead_update_fields').html(total_fields);
    $('.count_selected_users_bulk_update').html(total_records);

    if(parseInt(total_fields)==0){
        alertPopup('No value has been selected to update data. Kindly select value and then click on Update.','error');
        $('#ErroralertTitle').html('Notification');
        return; 
    }

    var return_empty_field = return_empty_cell = false;

    if(empty_field_error.length>0){
        empty_field_error.forEach(function(item,index) {
            $("[name='"+item+"']").closest('.reg_fields_input').parent().next().find('.error').show().html('Field is Mandatory!');
        });
        return_empty_field = true;
    }

    if($('.empty-cell').length>0){
        $('.empty-cell').each(function(index) {
            console.log('Empty Cell:',this);
            $(this).closest('.reg_fields_input').parent().next().find('.error').show().html('Select a field!');
        });
        return_empty_cell =  true;
    }
    if(return_empty_cell || return_empty_field){
        return false;
    }
       
    $('#confirmSaveBulkUpdateData').attr("disabled", "disabled");
    
    $.ajax({
        url: '/leads/validate-bulk-update-data',
        type: 'post',
        dataType: 'json',
        data:$form.serialize(),
        beforeSend: function () { 
          // showLoader();  
        },
        complete:function(){
           // hideLoader();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (response){
            if(typeof response.request_error!='undefined' && response.request_error=='session_logout'){
                 location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if(response.request_error!='undefined' &&  response.request_error.length>0){
                alertPopup(response.request_error,'error');
                $('#ErroralertTitle').html('Notification');
                return;
            }else{
                if(response.status == 1){
                    for (var key in response.error) {
                       if(typeof key!=='undefined'){
                            $("#bulk_upload_validation_"+key+" .depends-and-error .error").html(response.error[key]).show();
                       }
                    }
                }else if(response.status == 0){
                    $('.validation_error').html('').hide();
                    $('#ConfirmBulkUpdate').modal('show');
                }

            }
            $('#confirmSaveBulkUpdateData').removeAttr("disabled");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return;
});

$(document).on('click','#ConfirmBulkUpdateYes',function(event){
    $(this).attr("disabled", "disabled").addClass("disabled");
    var spinner = '<i class="fa fa-spinner" aria-hidden="true"></i>';
    $(this).html('Processiing '+spinner);
    updateBulkLeadData();
});

function updateBulkLeadData(){
    var $form = $("#bulkUpdateLeadForm");
    var lead_cols = [];
    $('select[name="registration_fields[]"]').each(function(){
        if($(this).find('option:selected').val().length>0){
            lead_cols.push($(this).find('option:selected').attr('data-query-field'));
        }
    });
    var data = $form.serializeArray();
    data.push({name: "lead_cols", value: lead_cols});
    $('#confirmSaveBulkUpdateData').attr("disabled", "disabled");
    $.ajax({
        url: '/leads/update-bulk-lead-data',
        type: 'post',
        dataType: 'json',
        data:data,
        beforeSend: function () { 
          // showLoader();  
        },
        complete:function(){
           // hideLoader();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (response){
            if(typeof response.request_error!='undefined' && response.request_error==='session_logout'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (typeof response.request_error!='undefined' && response.request_error.length>0){
                $('#confirmSaveBulkUpdateData').removeAttr("disabled");
                $('#bulk_update_error').html(response.request_error);
                // alertPopup(response.request_error,'error');
            }else{
                $('#bulk_update_error').html('');
                $('#ConfirmBulkUpdate').modal('hide');
                $('#confirmSaveBulkUpdateData').removeAttr("disabled");
            }
            $('#ConfirmBulkUpdateYes').html('Confirm');
            $('#ShowBulkUpdateBox').modal('hide');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


$(document).on('change','.select-dependent-fields',function(event){
    var field_key = $(this).attr('data-key');
    getDependentFieldBulkData(field_key,this);
});

function getDependentFieldBulkData(field,selectedField){
    var $this = $(selectedField);
    var selected_value = $this.val();
    var college_id = $.trim($("#user_college_id").val());
    $.ajax({
        url: '/leads/get-dependent-for-bulk-update',
        type: 'post',
        dataType: 'json',
        data:{selected_field: field, collegeId:college_id,selected_value: selected_value},
        beforeSend: function () { 
          // showLoader();  
        },
        complete:function(){
           // hideLoader();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (response){
            if (response.status == 0 && response.error === "session_logout") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (response.status == 0 && response.error !== "session_logout") {

            }else{
                if(response.status==1 && typeof response.child!='undefined' && response.child.length!=0){
                    var dependent_options = '<option value="" selected="selected">Select an Option</option>';
                    if(typeof response.options!='undefined' && Object.keys(response.options).length){
                        for (var option_value in response.options) {
                            dependent_options += '<option value="'+ option_value +'">' + response.options[option_value] + '</option>';
                        }
                    }
                    var value_exist = $('#'+response.child_id).val();
                    $('#'+response.child_id).html(dependent_options);
                    $('#'+response.child_id).trigger('chosen:updated');
                    if(typeof value_exist != 'undefined' && value_exist!=''){
                        $('#'+response.child_id).trigger('change'); 
                    }
                                  
                    
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function resetBulkUpdate(){
    $("#registration_field_row .condition_row").each(function(){
        if($(this).hasClass('first-row')){
            $(this).closest('.bulk-form-group').attr('data-previous','na');
            $(this).find('.reg_fields select').val('');
            $(this).find('.reg_fields_input').html('<div class="form-control" style="line-height:10px;">Select Field</div>');
            $(this).find('.actionbox .remove-row').attr('data-target','na');
        }else{
            $(this).remove();
        }
    });
    var count_fields = $('[name="registration_fields[]"]').length; 
    $('input[name="totalFields"]').val(parseInt(count_fields));
    disableSelected();
}