$(document).ready(function(){
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    $('.chosen-select').trigger('chosen:updated');
    //$('#no_of_parts').trigger('chosen:open');
    $(document).on('change', '.condition_fd_field', getDropdownValueList);
});

$(document).on('change', '#no_of_parts', function() {  
   var noOfParts = this.value;
   if(noOfParts !=''){
       noOfParts = parseInt(noOfParts);
   }
   var form_submit_stage=$("#submit_config_parts").val();
   var applicantCount = $('#applicantCount').val();
   if(noOfParts < form_submit_stage){
       alertPopup("Your selected option is less than form submit trigger point",'error');
       return false;
   }
   if(noOfParts==''){
    $(".submit_part").hide();   
   }else{
     $(".submit_part").show();  
   }
   if((applicantCount == '') || (form_submit_stage=='')){
        submitTrigger(noOfParts);
   }
   loadLogic(noOfParts);
});

function getDropdownValueList() {
    var value   = $(this).val();
    var fd_value_field  = "#condition_fd_field_value_"+$(this).data("index");
    if (value == '' || value == '0') {
        $(fd_value_field).html("<option value=''>Select Field Value</option>");
        $(fd_value_field).trigger('chosen:updated');
        return false;
    }
    $("#subStageDropdownDiv").hide();
    $("#subStageDropdown").html("");
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
            $(fd_value_field).html(json['optionList']);
            $(fd_value_field).trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function disableFormAndPaymentStages(currentPart) {
    $("#part-block-"+currentPart).find(".payment_stages > option").prop("selected", false);
    disableStages(currentPart);
}

function disableStages(currentPart){
    var selected = $("#part-block-"+currentPart).find(".form_stages option:selected");
    $("#part-block-"+currentPart).find(".payment_stages > option").prop("disabled", true);
    selected.each(function(){
        var optionval = $(this).val();
        $("#part-block-"+currentPart).find(".payment_stages > option[value=" + optionval + "]").removeAttr("disabled");
        if ($("#part-block-"+currentPart).find(".payment_stages")[0].length > 0) {
            $("#part-block-"+currentPart).find(".payment_stages")[0].sumo.reload();
        }
    });
}

function loadLogic(noOfParts)
{  
    var collegeId   = $("#collegeId").val();
    var formId      = $("#formId").val();
   
    var applicantCount = $('#applicantCount').val();
    $.ajax({
        url: jsVars.FULL_URL+'/form/loadPartWiseFormConfig',        
        data: {collegeId: collegeId, formId: formId, noOfParts: noOfParts},
        dataType: "html",
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        }, 
        beforeSend: function () {
            $('body div.loader-block').show();
        },
        complete: function () {
            $('body div.loader-block').hide();
        },
        success: function (html) {
            $('#loadPartWiseFormDiv').html(html);
            if(html)
            if($('.sumo_select').length){
                $('.sumo_select').SumoSelect({placeholder: 'Select Value', search: true, searchText:'Search Value', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });  
            }
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.chosen-select').trigger('chosen:updated');
            floatableLabel();
            $('#partwise_config_box').show();
            $('#verticalTab').easyResponsiveTabs({
                type: 'vertical',
                width: 'auto',
                fit: true
            });


            for (var i = 1; i <= noOfParts; i++) {
                disableStages(i);
            }
            if(applicantCount=='' && $("#submit_parts").val() == '' ){
            $(".enable_part").prop('disabled', false).trigger("chosen:updated");  
            }
        },
        error: function (response) {
            //alertPopup(response.responseText);
        },
        failure: function (response) {
           // alertPopup(response.responseText);
        }
    });
}

function validateFormData() {
    $('.error').hide();
    var error = false;
    var currentPage = '';
    $('.button_label').each(function () {
        var btnLabelId = $(this).attr('id');
        var arr = btnLabelId.split('button_label_');
        var labelId = arr[1];
        if (this.value == "") {
            $(this).parent().parent().find('.error').html("Field is required.");
            $(this).parent().parent().find('.error').show();
            error = true;
            currentPage = labelId;
        }
    });
    var continue_messages   = [];
    $('.continue_message').each(function () {
        if( $(this).val()!==null && $.trim($(this).val())!=="" ){
            if( $.inArray($.trim($(this).val()), continue_messages) == -1 ){
                continue_messages.push($(this).val());
            }else{
                $(this).parent().parent().find('.error').html("Continue Message should be unique in each part.");
                $(this).parent().parent().find('.error').show();
                error = true;
            }
        }
    });
    
    $('.sort_order').each(function () {
        var sortorderId = $(this).attr('id');
        var arr = sortorderId.split('sort_order_');
        var sortorderId = arr[1];
        if (this.value == "") {
            $(this).parent().parent().find('.error').html("Field is required.");
            $(this).parent().parent().find('.error').show();
            error = true;
            currentPage = sortorderId;
        }
        
        if (this.value != "" && !$.isNumeric(this.value)) {
            $(this).parent().parent().find('.error').html("Only numeric value allowed.");
            $(this).parent().parent().find('.error').show();
            error = true;
            currentPage = sortorderId;
        }
    });
    
    $('.form_stages').each(function () {
        var formStagesId = $(this).attr('id');
        var arr = formStagesId.split('form_stages_');
        var stageId = arr[1];
        if (this.value == "" || this.value == null || this.value == undefined) {
            $(this).parent().parent().find('.error').html("Field is required.");
            $(this).parent().parent().find('.error').show();
            error = true;
            currentPage = stageId;
        }
    });

    $('.condition_fd_field').each(function () {
        $('#condition_fd_field_validation_'+$(this).data("index")).html("");
        $('#condition_fd_field_validation_'+$(this).data("index")).hide();
        $('#condition_fd_field_value_validation_'+$(this).data("index")).html("");
        $('#condition_fd_field_value_validation_'+$(this).data("index")).hide();
        
        var fd_value_field  = "#condition_fd_field_value_"+$(this).data("index");
        if( $(this).val()!="0" && $(this).val()!="" && $(this).val()!=null ){
            if($(fd_value_field).val()=="" || $(fd_value_field).val()=="0" || $(fd_value_field).val()==null){
                $('#condition_fd_field_value_validation_'+$(this).data("index")).html("Please select a field value.");
                $('#condition_fd_field_value_validation_'+$(this).data("index")).show();
                error=true;
            }
        }
        if($(fd_value_field).val()!="" && $(fd_value_field).val()!="0" && $(fd_value_field).val()!=null){
            if( $(this).val()=="0" || $(this).val()=="" || $(this).val()==null ){
                $('#condition_fd_field_validation_'+$(this).data("index")).html("Please select a field.");
                $('#condition_fd_field_validation_'+$(this).data("index")).show();
                error=true;
            }
        }
    });

    if ($("#no_of_parts").val() == "") {
        $('#no_of_parts_error').html("Field is required.");
        $('#no_of_parts_error').show();
        error = true;
    }
    
    if(error == true && currentPage != ''){
        $(".resp-tab-content").hide();
        $(".resp-tab-content").removeClass("resp-tab-content-active");
        $("#tab-item-div-"+currentPage).addClass("resp-tab-content-active");
        $("#tab-item-div-"+currentPage).show();
        $(".resp-tabs-list > li").removeClass("resp-tab-active");
        $("#tab-item-"+currentPage).addClass("resp-tab-active");  
    }
    
    if (error == false) {
        return true;
    } else {
        $('html, body').animate({
            scrollTop: $("#error_anchor").offset().top
        }, 1000);
        return false;
    }
}

$(document).on('click', '#save_partwise_config', function() {
    
    if (validateFormData() == false) {
        return;
    }
    
    var data = [];
    data = $('#partwise_config').serializeArray();
    $.ajax({
        url: jsVars.FULL_URL+'/form/savePartWiseConfig',
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
            if (responseObject.status == 200) {
                if( typeof responseObject.redirectURL!=="undefined" ){
                    location = responseObject.redirectURL;
                }else{
                    alertPopup(responseObject.message, 'success');
                    return;
                }
            } else {
                alertPopup(responseObject.message, 'error');
                return;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //setTimeout("location.reload();", 5000);
        }
    });
});

function alertPopup(msg, type, location) {
    if (type == 'error') {
        var selector_parent = '#ErrorPopupArea';
        var selector_titleID = '#ErroralertTitle';
        var selector_msg = '#ErrorMsgBody';
        var btn = '#ErrorOkBtn';
        var title_msg = 'Error';
    } else if (type == 'alert') {
        var selector_parent = '#ErrorPopupArea';
        var selector_titleID = '#ErroralertTitle';
        var selector_msg = '#ErrorMsgBody';
        var btn = '#ErrorOkBtn';
        var title_msg = 'Alert';
    }else {
        var selector_parent = '#SuccessPopupArea';
        var selector_titleID = '#alertTitle';
        var selector_msg = '#MsgBody';
        var btn = '#OkBtn';
        var title_msg = 'Success';
    }


    $(selector_titleID).html(title_msg);
    $(selector_parent+" "+selector_msg).html(msg);
    $('.oktick').hide();

    if (typeof location != 'undefined') {
        $(btn).show();

        $(selector_parent).modal({keyboard: false}).one('click', btn, function (e) {
            e.preventDefault();
            window.location.href = location;
        });
    } else {
        $(selector_parent).modal();
    }
}

function validatePart(PartId) {
    $('.error').hide();
    var error = false;
    
    if ($("#button_label_"+PartId).val() == "") {
        $("#button_label_"+PartId).parents().parents().find("#button_label_error").html("Field is required.");
        $("#button_label_"+PartId).parents().parents().find("#button_label_error").show();
        error = true;
    }
    if ($("#sort_order_"+PartId).val() == "") {
        $("#sort_order_"+PartId).parents().parents().find("#sort_order_error").html("Field is required.");
        $("#sort_order_"+PartId).parents().parents().find("#sort_order_error").show();
        error = true;
    }
    if ($("#sort_order_"+PartId).val() != "" && !$.isNumeric($("#sort_order_"+PartId).val())) {
        $("#sort_order_"+PartId).parents().parents().find("#sort_order_error").html("Only numeric value allowed.");
        $("#sort_order_"+PartId).parents().parents().find("#sort_order_error").show();
        error = true;
    }
    if ($("#form_stages_"+PartId).val() == "" || $("#form_stages_"+PartId).val() == null || $("#form_stages_"+PartId).val() == undefined) {
        $("#form_stages_"+PartId).parents().parents().find("#form_stages_error").html("Field is required.");
        $("#form_stages_"+PartId).parents().parents().find("#form_stages_error").show();
        error = true;
    }

    if( $("#condition_fd_field_"+PartId).val()!="0" && $("#condition_fd_field_"+PartId).val()!="" && $("#condition_fd_field_"+PartId).val()!=null ){
        if($("#condition_fd_field_value_"+PartId).val()=="" || $("#condition_fd_field_value_"+PartId).val()=="0" || $("#condition_fd_field_value_"+PartId).val()==null){
            $('#condition_fd_field_value_validation_'+PartId).html("Please select a field value.");
            $('#condition_fd_field_value_validation_'+PartId).show();
            error=true;
        }
    }
    if( $("#condition_fd_field_value_"+PartId).val()!="0" && $("#condition_fd_field_value_"+PartId).val()!="" && $("#condition_fd_field_value_"+PartId).val()!=null ){
        if($("#condition_fd_field_"+PartId).val()=="" || $("#condition_fd_field_"+PartId).val()=="0" || $("#condition_fd_field_"+PartId).val()==null){
            $('#condition_fd_field_validation_'+PartId).html("Please select a field.");
            $('#condition_fd_field_validation_'+PartId).show();
            error=true;
        }
    }
    
    if (error == false) {
        return true;
    } else {
        return false;
    }
}

function loadNextPart(PartId){
    
    if (validatePart(PartId) == false) {
        return;
    }
    var nextPart = PartId + 1;
    $("#tab-item-div-"+PartId).hide();
    $("#tab-item-div-"+PartId).removeClass("resp-tab-content-active");
    $("#tab-item-div-"+nextPart).addClass("resp-tab-content-active");
    $("#tab-item-div-"+nextPart).show();
    $(".resp-tabs-list > li").removeClass("resp-tab-active");
    $("#tab-item-"+nextPart).addClass("resp-tab-active");  
    
}
function submitTrigger(noOfParts){
    var select = document.getElementById("submit_parts");
    $('#submit_parts').empty(); 
    var el = document.createElement("option");
    el.textContent = 'Trigger Point';
    el.value='';
    select.appendChild(el);
    for (var i = 1; i <= noOfParts; i++) {
    var optn = i;
    var el = document.createElement("option");
    el.textContent = optn;
    el.value = optn;
    select.appendChild(el);
 }
    $('#submit_parts').trigger("chosen:updated");
}

function partwisecheck(e){
    $(".enable_part").prop('disabled', false).trigger("chosen:updated");  
    var count=0;
    for(var i = 1; i <= e; i++) {
      $("#partwise_"+count).prop('checked', true);
      $("#partwise_"+count).prop('disabled', true);
      count++;
    }
    $(".enable_part").trigger("chosen:updated"); 
  }

