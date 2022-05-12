$(document).ready(function () {
    $(".erroralert").delay(5000).slideUp(300);
    $(".successalert").delay(5000).slideUp(300);
    
    if($('select#form_id').length > 0) {
        $('select#form_id').SumoSelect({placeholder: 'Form', search: true, searchText:'search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
        getFeeTypeList();
    }
    
    if ($(".dateinput").length > 0) {
        $('.dateinput').datetimepicker({format: 'DD/MM/YYYY HH:mm', viewMode: 'days'});
    }

    $("#save_withdraw_module_config").click(function () {
        saveWithdrawModuleConfig(jsVars.urls);
    });
    
    $(function () {
        $('[rel="popover"]').popover({
            container: 'body',
            html: true,
            content: function () {
                var clone = $($(this).data('popover-content')).clone(true).removeClass('hide');
                return clone;
            }
        }).click(function (e) {
            e.preventDefault();
        });
    });
    
    $('#listloader').hide();
    
    $("#condition_fd_field").change(function () {
        getDropdownValueList();
    });
});


function getAllFormList(cid, default_val, multiselect) {
    if (typeof default_val == 'undefined') {
        default_val = '';
    }
    if (typeof multiselect == 'undefined') {
        multiselect = '';
    }

    if (cid == '' || cid == '0') {
        $("#formListDiv").html("<select name='form_id' id='form_id'  class='chosen-select' ><option value='0'>Form</option></select>");
        $('.chosen-select').chosen();
        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        return false;
    }

    $.ajax({
        url: '/voucher/get-forms',
        type: 'post',
        data: {
            "college_id": cid,
            "default_val": default_val
        },
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            //currentObj.text('Wait..');
        },
        success: function (json) {
            if (json == 'session_logout') {
                window.location.reload(true);
            } else {
                $("#formListDiv").html(json);
                $('#form_id').on('change', getAllDropdown);
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                $('.chosen-select').trigger('chosen:updated');
            }
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            ;
        }
    });
}

function alertPopup(msg, type, location) {
    var selector_parent, selector_titleID, selector_msg, title_msg, btn;
    if (type === 'error') {
        selector_parent = '#ErrorPopupArea';
        selector_titleID = '#ErroralertTitle';
        selector_msg = '#ErrorMsgBody';
        btn = '#ErrorOkBtn';
        title_msg = 'Error';
    } else {
        selector_parent = '#SuccessPopupArea';
        selector_titleID = '#alertTitle';
        selector_msg = '#MsgBody';
        btn = '#OkBtn';
        title_msg = 'Success';
    }

    $(selector_titleID).html(title_msg);
    $(selector_msg).html(msg);
    $('.oktick').hide();

    if (typeof location !== 'undefined') {
        $(btn).show();

        $(selector_parent).modal({keyboard: false}).one('click', btn, function (e) {
            e.preventDefault();
            window.location.href = location;
        });
    } else {
        $(selector_parent).modal();
    }
}

function Epoch(date) {
    return Math.round(new Date(date).getTime() / 1000.0);
}

function validateFeeWithdrawData() {
    $('.error').hide();
    var error = false;
    var file_type = ['gif','jpeg','png','jpg','doc','pdf','docx','txt','rtf','xls','xlsx','ppt','pptx'];

    if ($("#colleges").val() == "") {
        $('#college_id_error').html("Field is required.");
        $('#college_id_error').show();
        error = true;
    }
    
    if ($("#form_id").val() == "" || $("#form_id").val() == 0 || $("#form_id").val()== null) {
        $('#form_id_error').html("Field is required.");
        $('#form_id_error').show();
        error = true;
    }
    if($("#payment_process_type").val()=="" || $("#payment_process_type").val()== null){
        $('#error_payment_process_type').html("Field is required.");
        $('#error_payment_process_type').show();
        error=true;
    }
    if($("#withdraw_btn_name").val()==""){
        $('#withdraw_btn_name_error').html("Field is required.");
        $('#withdraw_btn_name_error').show();
        error=true;
    }
    if($("#withdraw_start_date").val()==""){
        $('#withdraw_start_date_error').html("Field is required.");
        $('#withdraw_start_date_error').show();
        error=true;
    }
    if($("#withdraw_end_date").val()==""){
        $('#withdraw_end_date_error').html("Field is required.");
        $('#withdraw_end_date_error').show();
        error=true;
    }
    
    var startDateVal = $("#withdraw_start_date").val().split(' ');
    var endDateVal = $("#withdraw_end_date").val().split(' ');
    var startDate = startDateVal[0].split('/');
    var startTime = startDateVal[1].split(':');
    var endDate = endDateVal[0].split('/');
    var endTime = endDateVal[1].split(':');
    var startMonth = parseInt(startDate[1])-1;
    var endMonth = parseInt(endDate[1])-1;
    var startDateEpoch = Epoch(new Date(startDate[2], startMonth, startDate[0], startTime[0], startTime[1]));
    var endDateEpoch = Epoch(new Date(endDate[2], endMonth, endDate[0], endTime[0], endTime[1]));
    if(endDateEpoch < startDateEpoch){
        $('#withdraw_end_date_error').html("End Date should be greater than Start date.");
        $('#withdraw_end_date_error').show();
        error=true;
    }
    
    if( $("#condition_fd_field").val()!="0" && $("#condition_fd_field").val()!="" && $("#condition_fd_field").val()!=null ){
        if($("#condition_fd_field_value").val()=="" || $("#condition_fd_field_value").val()=="0" || $("#condition_fd_field_value").val()==null){
            $('#condition_fd_field_value_error').html("Field is required.");
            $('#condition_fd_field_value_error').show();
            error=true;
        }
    }

    var $withdrawFields = $("#withdraw_module_field_div").find('#withdraw_field_name, #withdraw_field_type, #withdraw_mandatory_field, #withdraw_sort, #withdraw_min_char, #withdraw_max_char,#withdraw_file_size,#withdraw_file_type');
    var withdrawSortArray = [];
    $withdrawFields.each(function() {
        var withdrawFieldId = $(this).attr("data-id");
        if($(this).attr("id") === 'withdraw_sort'){
            withdrawSortArray.push($.trim($(this).val()));
            withdrawSortArray = withdrawSortArray.sort();

            for (var i = 0; i < withdrawSortArray.length - 1; i++) {
                if (withdrawSortArray[i + 1] === withdrawSortArray[i]) {
                    withdrawSortArray.splice($.inArray(withdrawSortArray[i], withdrawSortArray), 1);
                    $('#err_'+$(this).attr('id')+'_'+withdrawFieldId).show().html('Duplicate sort order.');
                    error = true;
                }
            }
        }
           
        if(($(this).attr("id") === 'withdraw_min_char' || ($(this).attr("id") === 'withdraw_max_char'))){
            var withdraw_min_char = '';
            var withdraw_max_char = '';
            withdraw_min_char = parseInt($('#withdraw_'+withdrawFieldId+ ' #withdraw_min_char').val());
            withdraw_max_char = parseInt($('#withdraw_'+withdrawFieldId+ ' #withdraw_max_char').val());
            if (withdraw_min_char !== '' && withdraw_max_char !== ''){
                if (withdraw_max_char < withdraw_min_char) {
                    $('#err_'+$(this).attr('id')+'_'+withdrawFieldId).show().html('Max must be greater than min.');
                    error = true;
                }
            }
        }else if ($.trim($(this).val()) === '') {
            $('#err_'+$(this).attr('id')+'_'+withdrawFieldId).show().html('Please enter '+$(this).attr('id').replace(/\_/g, " ")+'.');
            error = true;
        }
//        var withdraw_file_size = parseInt($('#withdraw_file_size_'+withdrawFieldId).val());
//        var withdraw_file_type = $('#withdraw_file_type_'+withdrawFieldId).val();
//        if(($(this).attr("id") === 'withdraw_file_size_'+withdrawFieldId)){  
//            if((withdraw_file_size=== null || withdraw_file_size=='' || isNaN(withdraw_file_size))) {
//                    $('#err_'+$(this).attr('id')+'_'+withdrawFieldId).show().html("File size can't be empty.");
//                    error = true;
//            }
//        }
//        if(($(this).attr("id") === 'withdraw_file_type_'+withdrawFieldId)){  
//            if((typeof withdraw_file_type === "undefined" || withdraw_file_type=== null || withdraw_file_type==='' || isNaN(withdraw_file_type))) {
//                    $('#err_'+$(this).attr('id')+'_'+withdrawFieldId).show().html("File type can't be empty.");
//                    error = true;
//            }else{
//                    var data = [];
//                $.each(file_type, function(){
//                    var self = this.toString();
//                    if(withdraw_file_type.indexOf(self) === -1){
//                        data.push(self);
//                    }
//                    $('#err_'+$(this).attr('id')+'_'+withdrawFieldId).show().html("File type not allowed.");
//                    error = true;
//                });
//            }
//        }     
    });  

    if (error === false) {
        return true;
    } else {
        $('html, body').animate({
            scrollTop: $("#error_anchor").offset().top
        }, 1000);
        return false;
    }
}

function saveWithdrawModuleConfig(urls) {

    if (validateFeeWithdrawData() == false) {
        return;
    }
    //make buttun disable
    var data = [];
    
    data = $('#withdraw_module_config').serializeArray();
    arrayClean(data, 'payment_process_type[]');
    payment_process_type = []
    unipe_process_type = []
    $("#payment_process_type :selected").each(function($index) {
        feetype = $(this).data('feetype')
        if(feetype == 'npf'){
            data.push({name: 'payment_process_type[]', value: $(this).val()});
        }
        if(feetype == 'unipe'){
            data.push({name: 'unipe_process_type[]', value: $(this).val()});
        }
    });
    //delete data['payment_process_type']
    data.push({name: 'urlParams', value: urls});
    $.ajax({
        url: jsVars.saveWithdrawConfigLink,
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $('#listloader').show();
            window.scrollTo(0, 0);
        },
        complete: function () {
            $('#listloader').hide();
            $(':input[type="button"]').removeAttr("disabled");
        },
        async: true,
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session') {
                window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if (responseObject.status == 1) {
                $('#alert_msg').html("<i class='fa fa-check'></i>&nbsp;Fee withdraw configuration successfully saved.");
                if(typeof responseObject.data!=="undefined" && typeof responseObject.data.urlParams!=="undefined"){
                    location = jsVars.feeWithdrawModule+"/"+responseObject.data.urlParams;
                }else{
                    location = jsVars.feeWithdrawModule;
                }
            } else {
                alertPopup(responseObject.message, 'error');
                return;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            setTimeout("location.reload();", 5000);
        }
    });
}

$('#OkBtn').on('click', function () {
    $("#SuccessPopupArea .npf-close").trigger('click');
});

/*** Show & Hide Loader ***/
function showLoader() {
    $("#listloader").show();
}

function hideLoader() {
    $("#listloader").hide();
}

function addWithdrawFieldMapping(){
    var addCount = +$("#add_more_count").val() + 1;
    var sampleHtml = $('#withdraw_1').clone();
    $("#add_more_count").val(addCount);
    $("#withdraw_module_field_div").append("<div class='rowSpaceReduce margin-bottom-15'><div class='col-sm-4'></div><div class='col-sm-8'><div class='withdraw_mapping_div animated fadeInUp' id='withdraw_"+addCount+"'>"+sampleHtml.html()+"</div></div></div>");
    
    $('#withdraw_'+addCount+' .withdraw-module').val("");
    $('#withdraw_'+addCount+' .withdraw-module').attr("data-id",addCount);
    
    $('#withdraw_'+addCount+' .remove-div').removeAttr("style");
    
    $('#withdraw_'+addCount+' #err_withdraw_field_name_1').attr('id','err_withdraw_field_name_'+addCount);
    $('#withdraw_'+addCount+' #err_withdraw_field_type_1').attr('id','err_withdraw_field_type_'+addCount);
    $('#withdraw_'+addCount+' #err_withdraw_mandatory_field_1').attr('id','err_withdraw_mandatory_field_'+addCount);
    $('#withdraw_'+addCount+' #err_withdraw_sort_1').attr('id','err_withdraw_sort_'+addCount);
    $('#withdraw_'+addCount+' #onchange_field_1').attr('id','onchange_field_'+addCount);
    $('#withdraw_'+addCount+' #withdraw_file_size_1').attr('id','withdraw_file_size_'+addCount);
    $('#withdraw_'+addCount+' #withdraw_file_type_1').attr('id','withdraw_file_type_'+addCount);
    $('#withdraw_'+addCount+' #min_char_hide_1').attr('id','min_char_hide_'+addCount);
    $('#withdraw_'+addCount+' #hideDiv_1').attr('id','hideDiv_'+addCount);
    $('#withdraw_'+addCount+' #removeDisplay_1').attr('id','removeDisplay_'+addCount);
    $('#withdraw_'+addCount+' #filesize_show_1').attr('id','filesize_show_'+addCount);
    
    if($('#withdraw_'+addCount+' .chosen-select').length > 0) {
        $('#withdraw_'+addCount+' .chosen-container').remove();
        $('#withdraw_'+addCount+' .chosen-select').chosen();
    }
}

function removeWithdrawFieldMapping(element){
    var withdrawFieldId = $(element).attr("data-id");
    $('#withdraw_'+withdrawFieldId).remove();
}

function getAllDropdown() {
    var formId  = $("#form_id").val();
    if(formId===null || formId===''){
        $("#condition_fd_field").html("<option value=''>Select Field</option>");
        $("#condition_fd_field").trigger('chosen:updated');
        $("#condition_fd_field_value").html("<option value=''>Select Field Value</option>");
        $("#condition_fd_field_value").trigger('chosen:updated');
        $('.chosen-select').trigger('chosen:updated');
        return;
    }
    
    $.ajax({
        url: '/fee-configs/get-all-dropdown',
        type: 'post',
        dataType: 'json',
        data: {
            "formId": formId
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            if (typeof json['redirect'] !== 'undefined') {
                window.location(json['redirect']);
            }
            $('#condition_fd_field').html(json['optionList']);
            $('#condition_fd_field_value').html("<option value=''>Select Field Value</option>");
            $("#condition_fd_field").trigger('chosen:updated');
            $("#condition_fd_field_value").trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getDropdownValueList() {
    var value   = $("#condition_fd_field").val();
    if (value == '' || value == '0') {
        $("#condition_fd_field_value").html("<option value=''>Select Field Value</option>");
        $('#condition_fd_field_value').trigger('chosen:updated');
        return false;
    }
    $.ajax({
        url: '/voucher/get-dropdown-value-list',
        type: 'post',
        dataType: 'json',
        data: {
            "value": value
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            if (typeof json['redirect'] !== 'undefined') {
                window.location(json['redirect']);
            }
            $('#condition_fd_field_value').html(json['optionList']);
            $('#condition_fd_field_value').trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$('html').on('change','#colleges,#form_id', function(){
    $("#approval_template").html("");
    $("#rejection_template").html("");
    $("#processed_template").html("");
    $("#approval_template").html('<option selected="selected" value="">Select Email Template</option>');
    $("#rejection_template").html('<option selected="selected" value="">Select Email Template</option>');
    $("#processed_template").html('<option selected="selected" value="">Select Email Template</option>');
    $('.chosen-select').trigger('chosen:updated');
    getTemplateList();
    getFeeTypeList();
});

$('html').on('click','.send_mail',function(){
    console.log($(this));
    if($(this).prop("checked") == true){
       $(this).parent().parent().siblings('.email_template_div').removeClass('hide');
    } else {
       $(this).parent().parent().siblings('.email_template_div').addClass('hide');
    }
})
    
function getTemplateList(){
    if($("#colleges").val() == '' || $('#form_id').val()=='' || $('#form_id').val()==0 || $('#form_id').val() == null){
        return;
    }
    var collegeId   = $("#colleges").val();
    var formId	    = $("#form_id").val();
    
    $.ajax({
        url: '/fee/get-template-list',
        type: 'post',
        dataType: 'html',
        data: {
	    "collegeId": collegeId,
            "formId": formId
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
	success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    if(typeof responseObject.data.emailTemplates === "object"){
                        var emailTemplates    = responseObject.data.emailTemplates;
                        var value   = '<option selected="selected" value="">Select Email Template</option>';
                        $.each(emailTemplates, function (index, item) {
                            value += '<option value="'+index+'">'+item+'</option>';
                        });
                        $('#approval_template').html(value);
                        $('#rejection_template').html(value);
                        $('#processed_template').html(value);
                        $('#request_template').html(value);
                    }
                }
		$('.chosen-select').trigger('chosen:updated');
            }else{
                //console.log(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getFeeTypeList(){
    if($("#colleges").val() == '' || $('#form_id').val()=='' || $('#form_id').val()==0 || $('#form_id').val() == null){
        return;
    }
    var collegeId   = $("#colleges").val();
    var formId	    = $("#form_id").val();
    
    $.ajax({
        url: '/fee-configs/get-fee-type-list',
        type: 'post',
        dataType: 'html',
        data: {
	    "collegeId": collegeId,
            "formId": formId
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
	success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    var value = '';
                    if(typeof responseObject.data.npfFeeAliases === "object"){
                        var npfFeeAliases    = responseObject.data.npfFeeAliases;
                        var feeType = jsVars.feeType;
                        $.each(npfFeeAliases, function (index, item) {
                            selected =''
                            if($.inArray(index, feeType) !== -1){
                                value += '<option selected="selected" data-feetype="npf" value="'+index+'">'+item+'</option>';
                            }else{
                                value += '<option data-feetype="npf" value="'+index+'">'+item+'</option>';
                            }
                        });
                        
                          
                    }
                    if(typeof responseObject.data.unipeFeeAliases === "object"){
                        var unipeFeeAliases    = responseObject.data.unipeFeeAliases;
                        var unipeFeeType = jsVars.unipeFeeType;
                        $.each(unipeFeeAliases, function (index, item) {
                            selected =''
                            if($.inArray(index, unipeFeeType) !== -1){
                                value += '<option selected="selected" data-feetype="unipe" value="'+index+'">'+item+'</option>'
                            }else{
                                value += '<option data-feetype="unipe" value="'+index+'">'+item+'</option>';
                            }
                            
                        });
                    }
                    $('#payment_process_type').html(value)
                }
		$('.chosen-select').trigger('chosen:updated');
            }else{
                //console.log(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

var arrayClean = function(thisArray, thisName) {
    "use strict";
    $.each(thisArray, function(index, item) {
        if (item.name == thisName) {
            delete thisArray[index];      
        }
    });
}   
function fieldChange(fieldId,fieldtype){
    var getCount = fieldId.split("_");
    if((fieldtype === 'upload')){
     // $("#withdraw_file_size_"+getCount[2]).prop('placeholder','Enter File Size(in kb)');
        $("#min_char_hide_"+getCount[2]).attr('style','display:none');
        $("#filesize_show_"+getCount[2]).removeAttr('style','display:none');
        $("#hideDiv_"+getCount[2]).attr('style','display:none');
        $("#removeDisplay_"+getCount[2]).removeAttr('style','display:none');
    }else{
    //  $("#withdraw_min_char_"+getCount[2]).prop('placeholder','Enter min character');
        $("#min_char_hide_"+getCount[2]).removeAttr('style','display:none');
        $("#filesize_show_"+getCount[2]).attr('style','display:none');
        $("#hideDiv_"+getCount[2]).removeAttr('style','display:none');
        $("#removeDisplay_"+getCount[2]).attr('style','display:none');
   }
}

