//$.material.init();

$(document).ready(function () {
    $('[data-toggle="popover"]').popover();

    if(jsVars.preferences_configuration != null && typeof jsVars.preferences_configuration !='undefined' && jsVars.preferences_configuration.field != null && typeof jsVars.preferences_configuration.field !='undefined' && jsVars.preferences_configuration.field != '' ){

        $('form[id^="save_data"]').on('change', '[name="'+jsVars.preferences_configuration.field+'[]"]', function(){
            $('.pref_change_'+jsVars.preferences_configuration.field).val('1');
            disabledAlreadyUsedPreferences(jsVars.preferences_configuration.field);
//            if(typeof jsVars.preferences_configuration.paid !='undefined' && jsVars.preferences_configuration.paid != ''){
                calcPreferenceCount(jsVars.preferences_configuration.field);
//            }
        });

        $('#md_save_data').on('change', '[name="'+jsVars.preferences_configuration.field+'[]"]', function(){
            $('.pref_change_'+jsVars.preferences_configuration.field).val('1');
            disabledAlreadyUsedPreferences(jsVars.preferences_configuration.field);
//            if(typeof jsVars.preferences_configuration.paid !='undefined' && jsVars.preferences_configuration.paid != ''){
               calcPreferenceCount(jsVars.preferences_configuration.field);
//            }
        });
        //need to apply condition for drag and drop functionality
        if(typeof dragDrop!='undefined'){
            $('.pref_change_'+jsVars.preferences_configuration.field).val('1');
            disabledAlreadyUsedPreferences(jsVars.preferences_configuration.field);
            calcPreferenceCount(jsVars.preferences_configuration.field);
        }
    }

    if( $("#communication_country").length && $("#communication_country").val()!='' ){
        if(jsVars.college_id != null && typeof jsVars.college_id != 'undefined'){
            $('#communication_country').trigger('chosen:updated');
            var state = $('#communication_country').data('state')
            getComunicationStateList(state,jsVars.college_id);
        }
    }

    // custom js for onchange,onblur validation
    if(typeof jsVars.form_inline_validation !='undefined' && jsVars.form_inline_validation != null && jsVars.form_inline_validation == 1){
        $('#save_data select,#save_data input[type="text"],#save_data input[type="email"],#save_data textarea').on('change',function(){
            changeInlineFieldValidation(this);
        });

        $('#save_data input[type="text"],#save_data input[type="text"][readonly],#save_data textarea').on('blur',function(){
            blurInlineFieldValidation(this);
        });
        
        $('#save_data input[type="text"],#save_data input[type="email"]').on('keydown',function(e){
            return keydownInlineFieldValidation(this,e);
        });
        
        $('#save_data radio,#save_data input[type="checkbox"]').on('click',function(){
           clickInlineFieldValidation(this);
        });
    }

$('.previewpage #next_btn').click(
    function(){
    var error = false;
$('.preview_save_link').each(function(){

            if($(this).is(':visible')===true){
                var elemId = $(this).attr('id');
                $('#'+elemId).parents('.panel-default').find('.preview').before('<div class="preview_error">Please save the changes to proceed forward</div>')
                $([document.documentElement, document.body]).animate({
                    scrollTop: $("#"+elemId).offset().top
                }, 500);

                setTimeout(function () {
                    $('.preview_error').remove();
                }, 5000);

                error = true;
                return false;
            }
        });

        if(error === true){
        return false;
        }

        return true;
    }
);

    
});
$(window).load(function() {
    $('.loader-block').hide();
    $('.loader-block').removeClass("loaderOveride");
    if($("#missingFieldErrorMessageDiv").length && $("#missingFieldErrorMessageDiv").is(":visible") ){
        $('html, body').animate({
           scrollTop: $("#missingFieldErrorMessageDiv").offset().top - 150
        }, 10);
    }
    if($(".checkoutContainer").length>0 && $("#communication_country").length>0)
    {
        //$("#communication_country").val('')
        $("#communication_country").attr('selected', false);
        $("#communication_country").trigger('chosen:updated');
        //$("#communication_state").val('')
        $("#communication_state").attr('selected', false);
        $("#communication_state").trigger('chosen:updated');
    }
});

$('.msg_success').show().delay(8000).fadeOut();
$('.msg_error,#msg_error').show().delay(10000).fadeOut();

$('.user_data_copy_message').show().delay(10000).fadeOut();

//hide dropdown menu on body click
$(document).on('click',function(){
    if($('#menu-block, .datepicker').length > 0)
    {
        $('#menu-block, .datepicker').collapse('hide');
    }
});

$(document).on('click','.datepicker td.day',function(){
    $('.datepicker').collapse('hide');
});

$(document).on('click', '.join-now a, .forget-password a', function () {
    if(!$('body').hasClass('modal-open-secondry'))
    {   if(!$(this).hasClass('notaddbodyclass'))
            $('body').addClass('modal-open-secondry');
    }  
});


$(document).on('click','#forget-password .npf-close, #already-registered  .npf-close, #register-now  .npf-close, #college-instruction .npf-close, #verify-student  .npf-close, #reset-link-sent  .npf-close, #change-password .npf-close', function (e) {
    if($('body').hasClass('modal-open-secondry'))
    {
        $('body').removeClass('modal-open-secondry');
    }
    $(this).parents("div.modal").modal('hide');
    $(this).parents("div.modal")
    .find("input,textarea,select")
       .val('')
       .end()
    .find("input[type=checkbox], input[type=radio]")
       .prop("checked", "")
       .end();
});

$(document).on('click','#contact-us-final  .npf-close, .allclose .npf-close',function(e){
    if($('body').hasClass('modal-open-secondry'))
    {
        $('body').removeClass('modal-open-secondry');
    }
   $(this).parents("div.modal").modal('hide'); 
});

$(document).ready(function () {
	var trigger = $('.hamburger'),
		overlay = $('.overlay'),
		isClosed = false;
		trigger.click(function() {
		hamburger_cross();
	});

	function hamburger_cross() {
		if (isClosed == true) {
			overlay.hide();
			trigger.removeClass('is-open');
			trigger.addClass('is-closed');
			isClosed = false;
		} else {
			overlay.show();
			trigger.removeClass('is-closed');
			trigger.addClass('is-open');
			isClosed = true;
		}
	}
	$('[data-toggle="offcanvas"]').click(function() {
		$('#wrapper').toggleClass('toggled');
	});
	$('.overlay').click(function() {
		overlay.hide();
		$('#wrapper').removeClass('toggled');
		trigger.removeClass('is-open');
		trigger.addClass('is-closed');
		isClosed = false;
	});

    //if CSRF is not set then reload the page for setting CSRF in cookie
    if(typeof jsVars._csrfToken!='undefined' && (jsVars._csrfToken==null || jsVars._csrfToken=='')){
       location.reload();
    }
  
});

//Lead Success Pop up trigger
$(document).ready(function () {
    if(typeof jsVars.LeadSuccess != 'undefined'){
        $('#LeadSuccessLink').trigger('click');
    }
    if($('#ul_dial_code li').length>0){ /* if check dial code like +91 etc */
        if($('#country_dial_code').val() == '+91'){
            $('select#StateId, select#CityId').parent().show();
        } else {
            $('#StateId').val('');
            $('#CityId').val('');
            $('select#StateId, select#CityId').parent().hide();
        }
        $('.chosen-select').trigger('chosen:updated');
        try{
            if($('.sumo-select-new').length > 0){
                $('.sumo-select-new').each(function(i,j){
                  $('.sumo-select-new')[i].sumo.reload();
                });
            }
        }catch(error) {}

        $('#ul_dial_code li').on('click', function(){
            var cdc = $(this).data("value");
            if(cdc!='' && cdc!='+91'){
                $('#StateId').val('');
                $('#CityId').val('');
                $('select#StateId, select#CityId').parent().hide();
            }else if(cdc=='+91'){
                $('select#StateId, select#CityId').parent().show();
            }
            $('.chosen-select').trigger('chosen:updated');
        });
    }
});

/*********************Function start for applicant form submit steps************************/

/// Preview Page Submit Logic, store all global variables data

//function updateAllRequiredFields(validate){
//   for (var x in disableSpecificFields){
//      var index =  validate.indexOf(disableSpecificFields[x]);
//      if(index!= -1){
//          validate.splice(index,1);
//      }
//  }
//  return validate;
//}

var curPageReqFields = [];

function UpdateRequiredFields(id) {
    required_fields = eval("required_fields_" + id);
    email_fields = eval("email_fields_" + id);
    max_min_field = eval("max_min_field_" + id);
    max_chars = eval("max_chars_" + id);
    min_chars = eval("min_chars_" + id);
    max_file_field = eval("max_file_field_" + id);
    max_no_files = eval("max_no_files_" + id);
    numeric_fields = eval("numeric_fields_" + id);
    alphabet_fields = eval("alphabet_fields_" + id);
    alphanumeric_field = eval("alphanumeric_field_" + id);
    numeric_fields_max_value = eval("numeric_fields_max_value_" + id);
    numeric_fields_max_field_id = eval("numeric_fields_max_field_id_" + id);
    decimal_fields = eval("decimal_fields_" + id);
    decimal_counts = eval("decimal_counts_" + id);

    all_date_fields = eval("all_date_fields_" + id);
    
    white_list_chars = eval("white_list_chars_" + id);
    white_list_chars_field = eval("white_list_chars_field_" + id);
    
    mobile_fields = eval("mobile_fields_"+id);
    // check disablefields validation 
//    if(typeof disableSpecificFields != 'undefined'){
//       required_fields =  updateAllRequiredFields(required_fields);
//    }
    //For check Email Validation
    emailFieldDNSSetup();
    //console.log(disabledFieldsForReopen);
    curPageReqFields = required_fields;

//        console.log(required_fields);
    }

    function ShowHideLink(id){
        $('.preview_save_link').hide(); // hide all save button of all pages
        $('.preview_edit_link').show(); // show all edit button of all pages
        $('.form-control').attr("disabled","disabled"); // disale all forms fields
        $('input[type="checkbox"]').attr("disabled","disabled"); // disable all checkbox field
        $('input[type="radio"]').attr("disabled","disabled"); // disable all checkbox field
        $('.form-control').addClass("disabled"); /* add class diabled */
        //NPF-9327:Free Country Dial Code With Mobile Type Field
        if ($('#countryDialCodeDiv').length > 0) {
            $('#countryDialCodeDiv button.bs-dropdown-to-select').addClass("disabled");
        }
        
        UpdateRequiredFields(id); // update requred fields
        
        $('#link_'+id).hide();
        $('#update_'+id).show();
        $('#save_data_'+id+' .form-control').removeAttr("disabled");
        //NPF-9327:Free Country Dial Code With Mobile Type Field
        if ($('#save_data_' + id + ' #countryDialCodeDiv').length > 0) {
            $('#save_data_' + id + ' #countryDialCodeDiv button.bs-dropdown-to-select').removeClass("disabled");
        }
        $('#save_data_'+id+' input[type="checkbox"]').removeAttr("disabled");
        $('#save_data_'+id+' input[type="radio"]').removeAttr("disabled");
        $('.form-control',$('#save_data_'+id)).removeClass("disabled");
        $('.chosen-select',$('#save_data_'+id)).not('[id$="_read_only"]').prop('disabled', false).trigger("chosen:updated");

        
        try{
            if($('.sumo-select-new').length>0){
                $('.sumo-select-new').each(function(i,j){
                    $('.sumo-select-new').not('[id$="_read_only"]').prop('disabled', false)[i].sumo.reload();
                });
            }
        }catch(error) {}

        
        // disabled field Form Configuration basis 
        disableEditApplicationFields();
        
        LoadDatePicker();
        maskDateFields();

        preferenceOptionUpdate(id);
    }
    function SavePreviewData(id, current_page,go_to_dashboard){
        
//        UpdateRequiredFields(id);
        if(typeof disableSpecificFields != 'undefined'){
           for (var x in disableSpecificFields){
                if($("[id^='"+disableSpecificFields[x]+"']").has('option').length >0){
                        $("[id^='"+disableSpecificFields[x]+"']").prop('disabled',false);  
                        $("#"+disableSpecificFields[x]+" option").prop('disabled',false).trigger("chosen:updated");
                    }else{
                        $("[id^='"+disableSpecificFields[x]+"']").prop('disabled',false);  
                    }
                    if($("[id='other_"+disableSpecificFields[x]+"']").length > 0){
                        $("[id='other_"+disableSpecificFields[x]+"']").prop('disabled',false);  
                    }
           }
        }
        var flag=false;
        //return false;
        // check conditional logic for required field etc
        if (ResetJS() == true) {
            flag = true;
        }
        if(CheckRequiredFields(id)==true){
            flag=true;
        }
        if(CheckEmailFields()==true){
            flag=true;
        }
        if(CheckMaxMinFields()==true){
            flag=true;
        }
        if(CheckMaxMinWordsFields()==true){
            flag=true;
        }
        if(CheckDecimalPlaces()==true){
            flag=true;
        }
        if(custom_script()==true){
            flag=true;
        }
        if(CheckNumericFields()==true){
            flag=true;
        }
         if(CheckMaxValueInNumericFields()==true){
            flag=true;
        }
        if(CheckAlphabetFields()==true){
            flag=true;
        }
        
        if(tableYearCondition()==true){
            flag=true;
        }
        if(CheckUniqueFieldsGroupPreview(id)==true){
            flag=true;
        }
        if(CheckDateValue()==true){
            flag=true;
        }
        if(CheckMobileFields()==true){
            flag=true;
        }
        if (CheckWhiteListChars() == true) {
            flag = true;
        }
        
        //if All form builder validation pass
        if(!flag) {
            if (ResetJS() == true) {
                flag = true;
            }
        }
        
        if(checkAadharPreview(id)==true){
            flag=true;
        }

        if(typeof lastScrollOffset !='undefined' && lastScrollOffset>0){
            $('html, body').animate({
                  scrollTop: lastScrollOffset - 100
               }, 700);
                lastScrollOffset = 0;
        }

        



        if(flag==true){
              // FinallySave(redirect_type);
            disableEditApplicationFields();
            return false;
        }
        else{
             getDynamicFeeByFormIdPreview(id);
             FinallySavePreview(id, current_page,go_to_dashboard);
             getFormDynamicName();
             return true;
         }



        
    }
    
    function FinallySavePreview(id, current_page,go_to_dashboard){
   
         /*var data = $('#save_data').serialize();
                    $.ajax({
                    url: college_slug+'/form/submit/'+current_page,
                    type: 'post',
                    dataType: 'json',
                    //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
                    data: $('#save_data').serialize(),
//                    {
//                        "filled_data": data,
//                        "form_id" : jsVars.form_id
//                    },*/
//              var str ="'";
//              for(var x in disableSpecificFields ){
//                if(x == disableSpecificFields.length-1){
//                    str += '#'+disableSpecificFields[x];
//                  }else{
//                   str += '#'+disableSpecificFields[x]+',';
//                }
//              }
//              str +="'";
                var data = $('#save_data_'+id).serialize();
                
//                if(typeof disableSpecificFields != 'undefined'){
//                   data = data.replace(/&?[^=]+=&|&[^=]+=$/g,'');
//                  // data = $('#save_data_'+id).not(str).serialize();
//                }

                    $.ajax({
                    url: college_slug+'/form/submit/'+current_page,
                    type: 'post',
                    dataType: 'json',
                    //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
                    data:data,
					beforeSend: function () {
						$('.loader-block').show();
                                                $('.full-page-loader-overlay').show();
					},
					complete: function () {
						$('.loader-block').hide();
					},
                    headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                    success: function (data) {
                        $('.full-page-loader-overlay').hide();
                        $('span[id^=requiredError_]').hide();
                        $('span[id^=otherError_]').hide();
                        if(typeof data.error !='undefined' && Object.keys(data.error).length>0){
                            for (var key in data.error) {
                              if (data.error.hasOwnProperty(key)) {
                                if(key=='required'){
                                    var req_field = data.error['required'];
                                    for(var key in req_field){
                                        $('#requiredError_'+key).show();
                                        if(req_field[key] != ""){
                                            $('#requiredError_'+key).html(req_field[key]);
                                        }
                                    }
                                }else if(key=='other'){
                                    var other_field = data.error['other'];
                                    for(var key in other_field){
                                       $('#otherError_'+key).show();
                                       $('#otherError_'+key).html(other_field[key]);
                                    }
                                }
                              }
                            }
                        }else{
                            $('#link_'+id).show();
                            $('#update_'+id).hide();
                            $('#save_data_'+id+' .form-control').attr("disabled","disabled");
                            $('#save_data_'+id+' input[type="checkbox"]').attr("disabled","disabled");
                            $('#save_data_'+id+' input[type="radio"]').attr("disabled","disabled");
                            $('.form-control').addClass("disabled");
                            $('.chosen-select').prop('disabled', true).trigger("chosen:updated");
                            $('.plusMinIcon').hide();

                            try{
                                if($('.sumo-select-new').length>0){
                                    $('.sumo-select-new').each(function(i,j){
                                      $('.sumo-select-new').prop('disabled', true)[i].sumo.reload();
                                    });
                                }
                            }catch(error) {}
                            
                            if(data['referesh_popup']==0){
                               setTimeout("window.location.href= '"+college_slug+"/';",5000);
                               return false;
                            }
                            var examFlag=true;
                            if(typeof data['exam_redirection_url'] != 'undefined' || data['exam_redirection_url']!='' || typeof data['exam_error_messg'] != 'undefined' ||data['exam_error_messg']!=''){
                               examFlag=false;
                            }
                            if(typeof data['dashboard_flag'] != 'undefined' && data['dashboard_flag']!='' && data['dashboard_flag']=='1'){
                               examFlag=true;
                            }                            
                            if(go_to_dashboard=="1" && examFlag){
                                //alert("aaaaa");
                                setTimeout("window.location.href= '"+college_slug+"/';",3000);     
                            }
                            $('h4#alertTitle').html('Success');
                            //alertPopup('Application updated successfully','success');
                            
                            var enabletokenRetakeFeeID = $('#enabletokenRetakeFeeID').val();
                            if(enabletokenRetakeFeeID){
                                $('#payRetakeFee').show()
                                window.location.href = $('#payRetakeFee').val()
                            }else{
                                if(typeof data['exam_error_messg'] != 'undefined' && data['exam_error_messg']!='' && !examFlag){
                                    alertPopup(data['exam_error_messg'],'error');
                                    setTimeout("window.location.href= '"+college_slug+"/';",2000);
                                }else{
                                    if(typeof data['dependent_logic'] !='undefined' && data['dependent_logic'] !='') {
                                        alertPopup(data['dependent_logic'],'success');
                                    }else{
                                        alertPopup('Application updated successfully','success');
                                    }
                                }                                
                            }                            
                            if(typeof data['exam_redirection_url'] != 'undefined' && data['exam_redirection_url']!='' && !examFlag){
                                window.location.href=data['exam_redirection_url'];
                            }                            
                            
                            
                       //return false;
                            
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    }
                });
    }
// End of Preview Page Submit Logic

function CheckFilesSelectedByFieldId(field_id,max_upload){
    var flag=false;
    if(field_id!=""){
        max=parseInt(max_upload);
        var len=$('#'+field_id).get(0).files.length;
        if(max>=1){
            var existingNofFiles   = $("div."+field_id).find("#list_files_"+field_id+" li").length;
            if(!existingNofFiles && $("#total_files_"+field_id).length){
                existingNofFiles    = $.trim($("#total_files_"+field_id).html());
            }
            len = parseInt(len)+parseInt(existingNofFiles);
        }
        if(len>max){
             flag=true;
             $('#requiredError_'+field_id).hide();
             $('#otherError_'+field_id).show();
             $('#otherError_'+field_id).html("Maximum Files allowed is : "+max);
             $('#'+field_id).val("");
        }
    }
   return flag;
}

function CheckFilesFormatByFieldId(field_id,upload_format){
    var flag=false;
    
    if(field_id!="" && upload_format!=""){

        // convert string to array
        var upload_format_ar = upload_format.split(',');

        var file_length=$('#'+field_id).get(0).files.length;
        var file_info=$('#'+field_id).get(0).files;

        if(typeof file_info != 'undefined'){
          for(var i=0; i<file_length; i++){
            var filename = file_info[i].name;
            var ext = filename.split('.').pop().toLowerCase();
           // check if ext find in array
           if(upload_format_ar.indexOf(ext) == -1){
             flag=true;
             $('#requiredError_'+field_id).hide();
              $('#otherError_'+field_id).show();
              $('#otherError_'+field_id).html("Files Format allowed is : "+upload_format);
           }
          }  
        }

    }
    // if error found
    if(flag==true){
      $('#'+field_id).val("");
    }
   return flag;
}

function CheckFilesSizeByFieldId(field_id,max_file_size){
        var flag = false;
    var kbsize = max_file_size;
    max_file_size = max_file_size * 1024;
    var maxFilenameLength = 150;
    if (field_id != "" && max_file_size != "" && max_file_size > 0) {

        var file_length = $('#' + field_id).get(0).files.length;
        var file_info = $('#' + field_id).get(0).files;
        if (typeof file_info != 'undefined') {
            for (var i = 0; i < file_length; i++) {
                var filesize = file_info[i].size;
                var filename = file_info[i].name;

                if (filename.length > maxFilenameLength) {
                    flag = true;
                    $('#requiredError_' + field_id).hide();
                    $('#otherError_' + field_id).show();
                    $('#otherError_' + field_id).html("File name should not be greater than " + maxFilenameLength +" characters.");
                } else if (filesize > max_file_size) {
                    flag = true;
                    $('#requiredError_' + field_id).hide();
                    $('#otherError_' + field_id).show();
                    $('#otherError_' + field_id).html("Max file size allowed is : " + kbsize + ' KB');

                }
            }
        }
                            

        }
        // if error found
        if(flag==true){
          $('#'+field_id).val("");
        }
       return flag;
}

var formSubmitted = false;
  
  function UploadFiles(field_id,max_upload,form_id,upload_format, max_file_size){
      //alert('dsd');return;
     // $('#'+field_id).blur();
     var enableAjax = 1;
        if (typeof reopen_form_logic_id != 'undefined') {
          if(reopen_form_logic_id != 0 ){
              $("*","#save_data").prop('disabled',false) ;
              $("option","#save_data").prop('disabled',false).trigger("chosen:updated");

           }
       }
      if(formSubmitted  == true) { formSubmitted = false; return false;}
      if(CheckFilesSelectedByFieldId(field_id,max_upload)==true){
           //$('input[type="text"]').focus();
           $('#next_btn, .right_edit_link').focus();
           scrollToField(field_id);
            return false;
      }else if(CheckFilesFormatByFieldId(field_id,upload_format)==true){
            $('#next_btn, .right_edit_link').focus();
            scrollToField(field_id);
            return false;
      }else if(CheckFilesSizeByFieldId(field_id,max_file_size)==true){
             $('#next_btn, .right_edit_link').focus();
             scrollToField(field_id);
            return false;
      }
      else{
            $('.file-loader-block').show();

            if(enableAjax===1){
                ajaxUploadFiles(form_id,field_id,max_upload);
            }
            else{
                $('#'+form_id+' input[name="current_file_upload_id"]').val(field_id);
                $('#'+form_id+' input[name="current_file_max_no_files"]').val(max_upload);
                $('#'+form_id).submit();
            }

            formSubmitted  = true;
            $('#percent_progress').html("1%");
            $('#percent_progress').css("width","1%");
            //LoadFileProgressBar(field_id);
            
           $('#'+form_id+' input[name="current_file_upload_id"]').val("");
           $('#'+form_id+' input[name="current_file_max_no_files"]').val('');
            $('#otherError_'+field_id).hide();
            //
              //max_file_field
             // max_no_files
            // remove the id from the required fields of files
            var index = max_file_field.indexOf(field_id);
            $('#'+field_id).val('');
            $('#'+field_id).attr('data-file_status','already_upload');
            if(index>-1){
                    max_file_field.splice(index, 1);  
                    //delete max_file_field[index];

                    max_no_files.splice(index, 1);  
                    //delete max_no_files[index];
                   
            }
            
           // if( document.ready() ) {
             //   $('.file-loader-block').hide();
          //  }
           
        }
        if (typeof reopen_form_logic_id != 'undefined') {
               if(reopen_form_logic_id != 0 ){
                   $("*","#save_data").not(".acc-link").prop('disabled',true) ;
                   $(".textfield","#save_data").attr('style', 'color :graytext !important');
                    $(".datepicker","#save_data").attr('style', 'color :graytext !important');
                   $("option","#save_data").attr('disabled',false).trigger("chosen:updated"); 
                   for(var x in reopenFields){
                       if($("[id^='"+reopenFields[x]+"']").has('option').length >0){
                           $("[id^='"+reopenFields[x]+"']").prop('disabled',false);  
                           $("#"+reopenFields[x]+" option").prop('disabled',false).trigger("chosen:updated");
                           $("[id^='"+reopenFields[x]+"']").prop('readonly',false);
                       }else{
                          $("[id^='"+reopenFields[x]+"']").prop('disabled',false);  
                          $("[id^='"+reopenFields[x]+"']").prop('readonly',false);
                       }
                   }
              }
        }
        return true;
      //alert("hello");
  }
  
    function hideFileLoader(file_link,field_id, files, isReferenceUser,call_from = '') {
       formSubmitted = false;
        var enable_crop = $('#total_uploaded_files_'+field_id).attr('data-enable_crop');
        if(typeof enable_crop == 'undefined' || enable_crop == ''){
           enable_crop = 0
        }
        if(typeof isReferenceUser == 'undefined'){
            isReferenceUser = 0;
        }
       
       $('.file-loader-block').hide();
       ShowApplicantFiles(files, field_id,1,enable_crop, isReferenceUser,call_from);
//       $('input[type="file"]').val("");
       if(file_link!=""){
            $('#total_uploaded_files_'+field_id).html(file_link);
            $('#list_files_'+field_id).html("");
            $('#list_files_'+field_id).hide();
        }
  }
  
  function DeleteFile(file_id, field_id,max_uploadfile, isReferenceUser,call_from = ''){
    if(typeof isReferenceUser == 'undefined'){
        isReferenceUser = 0;
    }
    if($('input[name="college_form_edit"]').length > 0 ){
        $("#ConfirmPopupArea .npf-close").css({'display':'none'});
        $("#ConfirmPopupArea .btn-npf-alt").css("cssText", "background-color: #9c9c9c !important;");
        $("#ConfirmPopupArea .modal-title").css("cssText", "color: #fff !important;");
//        $("#ConfirmPopupArea .btn-npf:hover").css("cssText", "color: #fff !important;");
        $('#ConfirmMsgBody').html("<strong>Are you sure you want to remove the attachment ?</strong> <div style='margin-top:15px;'> <small style='color: #666'> Please Note: The attachment would not be restored once detached whether application form is saved or not!</small></div>");
        $('#confirmYes').unbind('click');
        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false});
        $('#confirmYes').click(function (e) {
            e.preventDefault();
            DeleteFileConfimed(file_id, field_id,max_uploadfile, isReferenceUser,call_from);
            $('#ConfirmPopupArea').modal('hide');
        });
        return false;
    }else{    
        DeleteFileConfimed(file_id, field_id,max_uploadfile, isReferenceUser);
    }
  }
  
  function DeleteFileConfimed(file_id, field_id,max_uploadfile, isReferenceUser,call_from = ''){
    $.ajax({
        url: college_slug+'/form/delete-file',
        type: 'post',
        dataType: 'html',
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        data: {
                    "form_id" : jsVars.form_id,
                    'file_id' : file_id,
                    'field_id' : field_id,
                    'isReferenceUser' : isReferenceUser,
                    'call_from' : call_from
        },
        success: function (data) {
            $('#li_file_id_'+file_id).remove();

            if(data=="no_file"){
                if(max_file_field.length == max_no_files.length && parseInt(max_uploadfile)>0){
                    max_file_field.push(field_id);  
                    max_no_files.push(max_uploadfile);  
                }

                $('#'+field_id).removeAttr('data-file_status');
                $('#total_uploaded_files_'+field_id).html('');
            }else{
                $('#total_uploaded_files_'+field_id).html(data);
            }
            //console.log(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
  }
  
  function HideFiles(field_id){
    $('#arrow_up_'+field_id).hide();
    $('#arrow_down_'+field_id).show();
    $('#list_files_'+field_id).hide("slow");
  }
  
  function ShowApplicantFiles(files, field_id,max_upload_file,crop_enable, isReferenceUser,call_from = '',removeCrossIcon='') {

        var isPreviewPostPage = 0;
        if(typeof jsVars.isPreviewPostPage != 'undefined')
        {
            isPreviewPostPage = 1;
        }

        if(typeof crop_enable == 'undefined'){
            crop_enable = $('#total_uploaded_files_'+field_id).data('enable_crop');
        }
        if(typeof crop_enable == 'undefined'){
            crop_enable = 0;
        }
        if(typeof isReferenceUser == 'undefined'){
            isReferenceUser = 0;
        }
    $.ajax({
        url: college_slug+'/form/get-files',
        type: 'post',
        dataType: 'html',
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        data: {
            "form_id" : jsVars.form_id,
            'files' : files,
            'field_id'       : field_id,
            'max_upload_file': max_upload_file,
            'isPreviewPostPage':isPreviewPostPage,
            'crop_enable'      : crop_enable,
            'isReferenceUser'      : isReferenceUser,
            'call_from':call_from,
            removeCrossIcon: removeCrossIcon
        },
        success: function (data) {
            if(data!=""){
                $('#list_files_'+field_id).html(data);
                $('#list_files_'+field_id).slideDown();
                $('#arrow_up_'+field_id).show();
                $('#arrow_down_'+field_id).hide();
                 
                if($('[onclick^=confirmResubmitSave]').length>0 || $('.reSubmitLogicForm').length>0){
                    if($('#'+field_id).is(':disabled')){
                        $('#list_files_'+field_id+' li span[onclick]').remove();
                    }
                }
            }
    //                        console.log(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
/*
function LoadFileProgressBar(field_id){
    post_field_id=field_id;
    //console.log(post_field_id);
                    $.ajax({
                    url: '/progress.php',
                    type: 'post',
                    dataType: 'html',
                    data:  'field_id='+field_id,
                    headers: "",
                    success: function (data) {
                        if(parseInt(data)>1){
                            $('#percent_progress').html(data+"%");
                            $('#percent_progress').css("width",data+"%");
                        }
                        if(data=="100" || data=="error"){
                               $('.file-loader-block').hide();
                        }
                       else{
                                setTimeout("LoadFileProgressBar(post_field_id)",2000);
                        }
                        console.log(data);
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    }
                });
}
 */

function CheckFilesSelected(field_id){
    var flag=false;
    var arr_length = max_file_field.length;

    for (var i = 0; i < arr_length; i++) {
        field_id=max_file_field[i];
        if(field_id!=""){
             max=parseInt(max_no_files[i]);
             var len=$('#'+field_id).get(0).files.length;
             if(len>max){
                  flag=true;
                  $('#requiredError_'+field_id).hide();
                  $('#otherError_'+field_id).show();
                  $('#otherError_'+field_id).html("Maximum Files allowed is : "+max);
                  $('#'+field_id).val("");
             }
         }

    }
    return flag;
}  


function CheckMaxValueInNumericFields(){
    var flag=false;
    var arr_length = numeric_fields_max_field_id.length;

    for (var i = 0; i < arr_length; i++) {
        field_id=numeric_fields_max_field_id[i];
        max_field_value=parseInt(numeric_fields_max_value[i]);
        if(field_id!="" && ($('#'+field_id+'[name=\''+field_id+'\']').length > 0) && $('#'+field_id).val()!=""){
            var val=$('#'+field_id).val();
            if(parseInt(val) > max_field_value){
                flag=true;
                $('#requiredError_'+field_id).hide();
                $('#otherError_'+field_id).show();
                $('#otherError_'+field_id).html("Maximum Value can be "+max_field_value);
                scrollToField(field_id);
            }
        }
    }
    return flag;
}

function CheckNumericFields(){
    var flag=false;
    var arr_length = numeric_fields.length;
    for (var i = 0; i < arr_length; i++) {
        field_id=numeric_fields[i];
        if(field_id!="" && ($('#'+field_id+'[name=\''+field_id+'\']').length > 0) && $('#'+field_id).val()!=""){
            var val=$('#'+field_id).val();
            if(isNaN(val)){
                flag=true;
                $('#requiredError_'+field_id).hide();
                $('#otherError_'+field_id).show();
                $('#otherError_'+field_id).html("Only Numbers Allowed");
                makeTableBorderRed(field_id);                                     
                scrollToField(field_id);
            }
        }
    }
    return flag;
}
/**
 * check whitelist chars
 * @release NPF-674 
 * @returns {Boolean}
 */
function CheckAlphabetFields(){
    
    var flag = false;
    var arr_length = alphabet_fields.length;
    // remove blank element from array
    white_list_chars_field = white_list_chars_field.filter(Boolean);
    if(white_list_chars_field.length>0){
//        console.log(white_list_chars_field);
//        alert(white_list_chars_field.length);
        flag = CheckWhiteListChars();
    }else{
        for (var i = 0; i < arr_length; i++) {
            field_id=alphabet_fields[i];
            if(field_id!="" && ($('#'+field_id+'[name=\''+field_id+'\']').length > 0) && $('#'+field_id).val()!=""){
                var val=$('#'+field_id).val();
                //if(!isNaN(val)){
                 if (!/^[a-zA-Z_ ]*$/.test(val)) {
                    flag=true;
                    $('#requiredError_'+field_id).hide();
                    $('#otherError_'+field_id).show();
                    $('#otherError_'+field_id).html("Only Alphabets Allowed");
                    makeTableBorderRed(field_id);
                    scrollToField(field_id);
                 }
            }
        }
    }
    return flag;
                
}

function CheckMaxMinFields(){
    var flag=false;
    var arr_length = max_min_field.length;
       
    for (var i = 0; i < arr_length; i++) {
        field_id = max_min_field[i];
        if(field_id!="" && ($('#'+field_id+'[name=\''+field_id+'\']').length > 0)){
            max=parseInt(max_chars[i]);
            min=parseInt(min_chars[i]);
            $('#otherError_'+field_id).hide();

            var val=$('#'+field_id).val();
            if(val.length>max && val!=""){
                flag=true;
                $('#requiredError_'+field_id).hide();
                $('#otherError_'+field_id).show();
                $('#otherError_'+field_id).html("Maximum Characters allowed is : "+max);
                scrollToField(field_id);
            }
            else if(val.length<min && val!=""){
                flag=true;
                $('#requiredError_'+field_id).hide();
                $('#otherError_'+field_id).show();
                $('#otherError_'+field_id).html("Minimum Characters should be : "+min);
                 scrollToField(field_id);
            }
         }
    }
    return flag;
 }
 
function CheckMaxMinWordsFields(){
  
    var flag=false;
    var arr_length = max_min_field_words.length;
    for (var i = 0; i < arr_length; i++) {
        field_id = max_min_field_words[i];
        
        if(field_id!="" && ($('#'+field_id+'[name=\''+field_id+'\']').length > 0)){
            var minChar = $("#"+field_id).data('min_character_'+field_id);
            var maxChar = $("#"+field_id).data('max_character_'+field_id);
            if(minChar!='undefined' && maxChar!='undefined'  ){
                
                var val = jQuery.trim( $('#'+field_id).val() );
                var val_len = val.length;
                if(val_len > maxChar && val!=""){
                flag=true;
                $('#requiredError_'+field_id).hide();
                $('#otherError_'+field_id).show();
                    $('#otherError_'+field_id).html("Maximum Character allowed is : "+maxChar);
                    scrollToField(field_id);
                }
                else if(val_len < minChar && val!=""){
                    flag=true;
                    $('#requiredError_'+field_id).hide();
                    $('#otherError_'+field_id).show();
                    $('#otherError_'+field_id).html("Minimum Character should be : "+ minChar);
                    scrollToField(field_id);
                }
 
            }else{
                max=parseInt(max_words[i]);
                min=parseInt(min_words[i]);
                $('#otherError_'+field_id).hide();

                var val=$('#'+field_id).val();
                val = jQuery.trim( val );
                var val_len = val.split(' ').length
                if(val_len>max && val!=""){
                flag=true;
                $('#requiredError_'+field_id).hide();
                $('#otherError_'+field_id).show();
                $('#otherError_'+field_id).html("Maximum words allowed is : "+max);
                scrollToField(field_id);
                }
                else if(val_len<min && val!=""){
                    flag=true;
                    $('#requiredError_'+field_id).hide();
                    $('#otherError_'+field_id).show();
                    $('#otherError_'+field_id).html("Minimum words should be : "+min);
                    scrollToField(field_id);
                }
          }
        }
    }
//     return true;
    return flag;
}
 
function ShowHideOther(field_id, value){
   // alert(/;;;Other/g.test(value));
    if(value=="Other" ||  (/;;;Other/g.test(value))==true){
        //alert(/;;;Other/g.test(value));
         $('#other_'+field_id).show();
         if($('.'+field_id+' input[value="Other"]').prop("checked")==true){
              $('#other_'+field_id).show();
         }
         else if($('#'+field_id).val()=="Other" || (/;;;Other/g.test($('#'+field_id).val()))==true){
              $('#other_'+field_id).show();
         }
         else{
              $('#other_'+field_id).hide();
              $('#other_'+field_id).val("");
         }
    }
    else{
        $('#other_'+field_id).hide();
        
        // if radio button then blank value on unselect other
        if ($("input[name='" + field_id + "'][type='radio']:checked").length > 0 || jQuery("select[name='" + field_id + "']").length > 0) { 
            $('#other_'+field_id).val("");
        }
    }
    
    
    /* check if already other checkbox is select dropdown value is select */
    /* CHECKBOX */
    if (jQuery("input:checkbox[name='" + field_id + "[]']:checked").length > 0) {
        jQuery("input:checkbox[name='" + field_id + "[]']:checked").each(function () {
            /* if found other then show textbox */
            if ($(this).val() == 'Other') {
                $('#other_' + field_id).show();
            }
        });
    }
    /* DROPDOWN */
    if (jQuery("select[name='" + field_id + "[]']").length > 0) {
        var selVals = jQuery("select[name='" + field_id + "[]']").val();
        if (typeof selVals != 'undefined' && selVals != null && selVals.indexOf("Other") > -1) {
            /* if found other then show textbox */
            $('#other_' + field_id).show();
        } else {
            /* not found then blank and hide textbox */
            $('#other_' + field_id).hide();
            $('#other_' + field_id).val("");
        }
    }
 }
            
function ShowJsCounter(field_id,max_len){
    var content=$('#'+field_id).val();
    $('#counter_'+field_id).html(content.length);
    if(parseInt(max_len)>0 && content.length>parseInt(max_len)){
        var new_content=content.substr(0, max_len);
        $('#'+field_id).val(new_content);
    }
}

function ShowJsCounterWord(field_id,max_len){
    $('#otherError_'+field_id).html('').hide();
    var content=$('#'+field_id).val();
//    content = $.trim(content);
    if(content.length>0){
        if($.trim(content) === '') {
            $('#'+field_id).val('');
            $('#counter_'+field_id).html(0);
        } else {
            var val_len = content.match(/\S+/g).length;
            $('#counter_'+field_id).html(val_len);
            var space = (content[content.length -1] === ' ') ? true : false;
            max_len =parseInt(max_len);
            if(max_len>0 && (val_len>max_len || (val_len==max_len && space == true) )){
                $('#requiredError_'+field_id).hide();
                $('#otherError_'+field_id).html('You have reached the allowed limit of '+max_len+ ' words').show();
                var content_arr = content.split(/\s+/, max_len);
                var new_content = content_arr.join(' ');
                $('#'+field_id).val(new_content + ' ');
                $('#counter_'+field_id).html(max_len);
            }
            $('#counter_word_'+field_id).val(val_len);
        }
    }else{
        $('#counter_'+field_id).html(0);
    }
    
}

function ShowJsCounterChar(field_id,max_len){
    $('#otherError_'+field_id).html('').hide();
    var content=$('#'+field_id).val();
    if($.trim(content) === '') {
        $('#'+field_id).val('');
        $('#counter_'+field_id).html(0);
    } else {
        $('#counter_'+field_id).html(content.length);
        max_len =parseInt(max_len);
        if(max_len>0 && content.length >= max_len){
            $('#requiredError_'+field_id).hide();
            $('#otherError_'+field_id).html('You have reached the allowed limit of '+max_len+' characters').show();
            var new_content=content.substr(0, max_len);
            $('#'+field_id).val(new_content);
            $('#counter_'+field_id).html(max_len);
        }
    }
}

// this function is used in CheckDateValue function to check the date validation
function isValidDate(str,field_format){
    if(field_format.toLowerCase()=="yyyy"){
      str="01/01/"+str;
    }else if(field_format.toLowerCase()=="mm/yyyy"){
        str="01/"+str;
    }else if(field_format.toLowerCase()=="dd/mm/yyyy hh:mm:ss a"){
        str= str.split(' ')[0];
    }else{
        // do nothing
    }
    
    var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(str);
    if (matches == null) return false;
        var d = matches[1];
        var m = matches[2]-1;
        var y = matches[3];
        var composedDate = new Date(y, m, d);
        flag= composedDate.getDate() == d && composedDate.getMonth() == m && composedDate.getFullYear() == y;
     return flag;
}

// function to check the date values is in correct format or not
function CheckDateValue(){
    var flag=false;
    var arr_length = all_date_fields.length;
    for (var i = 0; i < arr_length; i++) {
        field_and_format=all_date_fields[i].split("||");
        field_id=field_and_format[0];
        field_format=field_and_format[1];
        if(field_id!=""){
            $('#otherError_'+field_id).hide();
            if(($('#'+field_id+'[name=\''+field_id+'\']').length > 0) && $('#'+field_id).val()!="" &&  !isValidDate($('#'+field_id).val(),field_format)){
                flag=true;
                $('#requiredError_'+field_id).hide();
                $('#otherError_'+field_id).show();
                $('#otherError_'+field_id).html("Please enter a valid Date");
            }
        }
    }
    return flag;
}

function maskDateFields(){
    var arr_length = all_date_fields.length;
    //console.log(all_date_fields);
    for (var i = 0; i < arr_length; i++) {
       field_and_format=all_date_fields[i].split("||");
       field_id=field_and_format[0];
       field_format=field_and_format[1];
       //console.log(field_format);
        if(field_id!=""){
            if(field_format.toLowerCase()=="yyyy"){
                mask="9999";
            }else if(field_format.toLowerCase()=="mm/yyyy"){
               mask="99/9999";
            }else if(field_format.toLowerCase()=="dd/mm/yyyy hh:mm:ss a"){
               mask="99/99/9999 99:99:99 **";
            }else  mask="99/99/9999";

            $.mask.definitions['~'] = "[+-]";
            $("#"+field_id).mask(mask,{placeholder:field_format,autoclear: false});
        }
    }
}
    
function LoadDatePicker(){
    var arr_length = date_fields.length;
    for (var i = 0; i < arr_length; i++) {
       field_id=date_fields[i];
       field_format=date_fields_format[i];
       field_start_date=date_fields_startdate[i];
       field_end_date=date_fields_enddate[i];
        if(field_id!=""){
            if(field_format=="yyyy"){
                minViewMode=2;
                jQuery('#'+field_id).datepicker({minViewMode : minViewMode, format : field_format, enableYearToMonth: true, enableMonthToDay : true, endDate : field_end_date, startDate:field_start_date,autoclose: true, clearBtn: true});
            }
            else if(field_format=="mm/yyyy"){
                minViewMode=1;
                jQuery('#'+field_id).datepicker({minViewMode : minViewMode, format : field_format, enableYearToMonth: true, enableMonthToDay : true, endDate : field_end_date, startDate:field_start_date,autoclose: true, clearBtn: true});
            }else if(field_format==="dd/mm/yyyy hh:mm:ss a"){
                jQuery('#'+field_id).datetimepicker({format : 'DD/MM/YYYY hh:mm:ss A', viewMode: 'days'});
            }
            else {
                minViewMode=2;
                jQuery('#'+field_id).datepicker({startView : minViewMode, format : field_format, enableYearToMonth: true, enableMonthToDay : true, endDate : field_end_date, startDate:field_start_date,autoclose: true, clearBtn: true});
            }

            
           $('#'+field_id).addClass("datepicker");
        }
    }
}

function CheckUniqueFieldsGroup(){
    var flag=false;
    var arr_length = unique_fields_group.length;

    for (var i = 0; i < arr_length; i++) { // multiple groups array
       field_id_arr=unique_fields_group[i];
       var sub_arr_length = field_id_arr.length;
       for (var a = 1; a < sub_arr_length; a++) { // get all fields of array
            compare_field_from=field_id_arr[a];
            
            if($('#'+compare_field_from).val()!="" && ($('#'+compare_field_from).val()=='Other' || (/;;;Other/g.test($('#'+compare_field_from).val()))==true) && $('#other_'+compare_field_from).length>0){
                var compare_form_val = '';//$('#other_'+compare_field_from).val();
            }
            else{
                var compare_form_val = $('#'+compare_field_from).val();
            }
            for (var b = a+1; b < sub_arr_length; b++) { // compare field value with other array fields
                compare_field_to=field_id_arr[b];
                
                if($('#'+compare_field_to).val()!="" && ($('#'+compare_field_to).val()=='Other' || (/;;;Other/g.test($('#'+compare_field_to).val()))==true ) && $('#other_'+compare_field_to+'[name=\'other_'+compare_field_to+'\']').length>0 ){
                    var compare_to_val = $('#other_'+compare_field_to+'[name=\'other_'+compare_field_to+'\']').val();
                }else{
                    var compare_to_val = $('#'+compare_field_to+'[name=\''+compare_field_to+'\']').val();
                }
                
                //$('#otherError_'+compare_field_from).hide();
               // $('#otherError_'+compare_field_to).hide();
                if(compare_field_from !="" && compare_field_to !="" 
                        && $('#'+compare_field_from+'[name=\''+compare_field_from+'\']').length 
                        && compare_form_val!=""  
                        && compare_form_val==compare_to_val
                        )
                {
                    
                    
                    flag=true;
                    $('#otherError_'+compare_field_from).show();
                    $('#otherError_'+compare_field_to).show();
                    $('#otherError_'+compare_field_from).html(field_id_arr[0]);
                    $('#otherError_'+compare_field_to).html(field_id_arr[0]);
                    scrollToField(compare_field_from);
                }
            }

        }
    }
    return flag;
}

 function checkAadharNo(){
    return false;
    var flag=false;

    if($('#aadhar_card_no[name=\'aadhar_card_no\']').length > 0 && $('#aadhar_card_no').val()!=""){
        var val_aadhar=$('#aadhar_card_no').val();
        $.ajax({
            url: college_slug+'/form/check-unique-value/'+current_page,
            type: 'post',
            //async: false,
            dataType: 'json',
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            data: {
                "form_id"   : jsVars.form_id,
                'value'     : val_aadhar,
                'check'     : "unique_aadhar"
            },
            success: function (data) {
                if(data['session_logout']=="1"){
                    window.location.href= college_slug+'/dashboard/';                           
                }else{
                   
                    if(data['message']=="1"){
                        flag=true;
                        $('#otherError_aadhar_card_no').show();
                        $('#otherError_aadhar_card_no').html("Duplicate Aadhaar No");
                        scrollToField("aadhar_card_no");
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        }); // ajax closes
    } // aadhar_card_no
    return flag;
}
    
    function CheckRequiredFields(stageId){
        var flag=false;
        var arr_length = required_fields.length;//curPageReqFields.length;//required_fields.length;
        //console.log(required_fields);
        //console.log(curPageReqFields);
        $('.requiredError').hide();
        var formAttrId ='';
        var addressFields = ["correspondence_state","correspondence_district", "correspondence_city","permanent_state", "permanent_district", "permanent_city"];
        if(typeof stageId!='undefined' && stageId!='' && stageId!=null){
            if($('#newApplicationEditView'+stageId).length>0){
                formAttrId = '#save_data_'+stageId+' ';
            }
        }
        for (var i = 0; i < arr_length; i++) {
            var file_status = '';
            field_id = required_fields[i];
                if(field_id!=""){
                    if($(formAttrId+'#'+field_id).attr('data-file_status')!='' && $(formAttrId+'#'+field_id).attr('data-file_status')=='already_upload'){
                        file_status = $('#'+field_id).attr('data-file_status');
                        //return false;
                    }

                    if(file_status!='already_upload'){

                       // alert(field_id);
                       var str = field_id;
                       field_id = str.replace("[]", "");
                        /* if CHECKBOX is unchecked*/
                        if($(formAttrId+'input[name="'+field_id+'[]"]').is(':checkbox') && jQuery(formAttrId+"input:checkbox[name='"+field_id+"[]']:checked").length<=0){
                            flag=true;
                            if (typeof errorInRequiredFields != 'undefined') {
                                errorInRequiredFields.push(field_id);
                            }
                            $('#requiredError_'+field_id).show();
                            $('#otherError_'+field_id).hide();
                            scrollToField(field_id);
                        }
                        /* if CHECKBOX is checked and other is slected */
                        else if($(formAttrId+'input[name="' + field_id + '[]"]').is(':checkbox') && jQuery(formAttrId+"input:checkbox[name='" + field_id + "[]']:checked").length > 0){

                            jQuery(formAttrId+"input:checkbox[name='" + field_id + "[]']:checked").each(function () {
                                if ($(this).val() == 'Other' && jQuery.trim(jQuery(formAttrId+"#other_" + field_id).val()) == '') {
                                    flag = true;
                                    if (typeof errorInRequiredFields != 'undefined') {
                                        errorInRequiredFields.push(field_id);
                                    }
                                    $('#requiredError_' + field_id).show();
                                    $('#otherError_'+field_id).hide();
                                    scrollToField(field_id);
                                }
                            });
                        }
                         /* MULTI SELECT DROPDOWN*/
                        else if (jQuery(formAttrId+"select[name='" + field_id + "[]']").length > 0
                        && ((jQuery(formAttrId+"select[name='" + field_id + "[]']").val() == '' || jQuery(formAttrId+"select[name='" + field_id + "[]']").val() == null) ||
                                (/* if only select "Other" and other text box is empty */
                                        jQuery(formAttrId+"select[name='" + field_id + "[]']").val().length > 0
                                        && jQuery(formAttrId+"select[name='" + field_id + "[]']").val().indexOf('Other') > -1
                                        && jQuery.trim(jQuery(formAttrId+"#other_" + field_id).val()) == ''
                                        )

                                )) {


                            flag = true;
                            if (typeof errorInRequiredFields != 'undefined') {
                                errorInRequiredFields.push(field_id);
                            }
                            $('#otherError_'+field_id).hide();
                            $('#requiredError_' + field_id).show();
                            $('div.' + field_id + ' .form-group').addClass("has-error");
                            scrollToField(field_id);

                        }
                        /* SINGLE SELECT DROPDOWN or other is select with balank value */
                        else if (jQuery(formAttrId+"select[name='" + field_id + "']").length > 0
                        && (jQuery(formAttrId+"select[name='" + field_id + "']").val() == ""
                                || ((jQuery(formAttrId+"select[name='" + field_id + "']").val() == 'Other' || (/;;;Other/g.test(jQuery(formAttrId+"select[name='" + field_id + "']").val()))==true) && jQuery.trim(jQuery(formAttrId+"#other_" + field_id).val()) == '')
                                )
                        ) {
                            if(addressFields.indexOf(field_id) != -1 && $('.'+field_id).is(":visible") == false){
                                continue;
                            }
                            flag = true;
                            if (typeof errorInRequiredFields != 'undefined') {
                                errorInRequiredFields.push(field_id);
                            }
                            $('#otherError_'+field_id).hide();
                            $('#requiredError_' + field_id).show();
                            $('div.' + field_id + ' .form-group').addClass("has-error");
                            scrollToField(field_id);
                            makeTableBorderRed(field_id);                    
                        }
                        /*else if($("input:radio[name='"+field_id+"']").length > 0 && $("input:radio[name='"+field_id+"']:checked").val()==""){
                             alert($("input:radio[name='"+field_id+"']:checked").val());
                             flag=true;
                             $('#requiredError_'+field_id).show();
                             scrollToField(field_id);
                        }*/
                        else if ($(formAttrId+'input[name="' + field_id + '"]').is(':radio') && (!$(formAttrId+"input[name='" + field_id + "'][type='radio']:checked").val() || (
                            $(formAttrId+"input[name='" + field_id + "'][type='radio']:checked").val() == 'Other' && jQuery.trim(jQuery(formAttrId+"#other_" + field_id).val()) == ''

                        ))) {
                            //$('input[name="'+field_id+'"][type="radio"]:checked').val()
                            flag=true;
                            if (typeof errorInRequiredFields != 'undefined') {
                                errorInRequiredFields.push(field_id);
                            }
                            $('#otherError_'+field_id).hide();
                            $('#requiredError_'+field_id).show();
                            scrollToField(field_id);
                        }
                        else if($(formAttrId+'#'+field_id).is(':file') && $(formAttrId+'#'+field_id).get(0).files.length<=0 ){
                            flag=true;
                            if (typeof errorInRequiredFields != 'undefined') {
                                errorInRequiredFields.push(field_id);
                            }
                            $('#otherError_'+field_id).hide();
                            $('#requiredError_'+field_id).show();
                            $('div.' + field_id + ' .form-group').addClass("has-error");
                            scrollToField(field_id);

                        }
                        else if(($(formAttrId+'#'+field_id+'[name=\''+field_id+'\']').length > 0) &&  $.trim($(formAttrId+'#'+field_id).val())==""){
                            flag=true;
                            if (typeof errorInRequiredFields != 'undefined') {
                                errorInRequiredFields.push(field_id);
                            }
                            $('#otherError_'+field_id).hide();
                            $('#requiredError_'+field_id).show();
                            $('div.'+field_id+' .form-group').addClass("has-error"); 
                            makeTableBorderRed(field_id);
                            scrollToField(field_id);
                        }
                }
            }
        }
        return flag;
    }
var lastScrollOffset = 0;

function scrollToField(field_id){

    if($("div."+field_id) !=null && $("div."+field_id).length>0){
        //alert(field_focus);
        if(lastScrollOffset==0){
            lastScrollOffset = $("div."+field_id).offset().top;
        }
        if(lastScrollOffset>=$("div."+field_id).offset().top){
            lastScrollOffset = $("div."+field_id).offset().top;
        }
    }

    
/*
    if(lastScrollOffset>=$("div."+field_id).offset().top){
        lastScrollOffset = $("div."+field_id).offset().top;
//return;
    if(field_focus==false){
       if($("div."+field_id).length>0){
            $('html, body').animate({
               scrollTop: $("div."+field_id).offset().top - 100
            }, 700);
//            lastScrollOffset = 0;
//            field_focus=true;
        }else if($("input[name="+field_id+"]").length>0){
            $('html, body').animate({
               scrollTop: $("input[name="+field_id+"]").offset().top - 100
            }, 700);
//            lastScrollOffset = 0;
//            field_focus=true;
        } 
     }
     }
    */
}

    var email_filter=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,12}(?:\.[a-z]{2})?)$/i
    function CheckEmailFields(){ 
        var flag=false;
        var arr_length = email_fields.length;
        for (var i = 0; i < arr_length; i++) {
            field_id = email_fields[i];
            if (field_id != ""){
                    $('#otherError_'+field_id).hide();
                    //remove validation for masked field "field_id_mask
                    if(($('#'+field_id+'[name=\''+field_id+'\']').length > 0) && ($('#'+field_id).val()!="")  && !email_filter.test($('#'+field_id).val())){
                        flag = true;
                        $('#requiredError_'+field_id).hide();
                        $('#otherError_'+field_id).show();
                        $('#otherError_'+field_id).html("This email id seems wrong. Kindly check.");
                    } else if ((typeof jsVars.verifyEmailDomain !== 'undefined') && ($('#'+field_id+'[name=\''+field_id+'\']').length > 0) && ($('#'+field_id).val()!="")) {
                        var DNSVerify = verifyEmailDNS($('#' + field_id).val());
                        if (DNSVerify !== true) {
                            flag = true;
                            $('#otherError_' + field_id).show();
                            $('#otherError_' + field_id).html(DNSVerify);
                        }
                    }
            }
        }
        return flag;
    }
   var field_focus=false; 
   function SaveForm(redirect_type){
        var flag=false;
        if (typeof reopen_form_logic_id != 'undefined') {
           if(reopen_form_logic_id != 0 ){
                $("*","#save_data").prop('disabled',false) ;
                $("option","#save_data").prop('disabled',false).trigger("chosen:updated");
            }
        }
        field_focus=false;
        //copyPermanentCorrespondenceAddress(MACHINE_NPF_ADDRESS);
        if(redirect_type==="exit_wt_req"){
            redirect_type='exit';
        }else if(redirect_type==="skip"){
            redirect_type='next';
        }else if(redirect_type==="stepwise_preview"){
            redirect_type='preview';
        } else {
            if (CheckRequiredFields() == true && !jsVars.isNextPageLocked) {
                //IFMR forms condition
                if ((typeof currentPageFieldsList != 'undefined') && (typeof jsVars.redirectToPreviousPage != 'undefined') && 
                    (typeof errorInRequiredFields != 'undefined') && (currentPageFieldsList.length > 0) && (errorInRequiredFields.length > 0)) {
                    //console.log('errorInRequiredFields : ' + JSON.stringify(errorInRequiredFields));
                    //console.log('currentPageFieldsList : ' + JSON.stringify(currentPageFieldsList));
//                    console.log(jsVars.redirectToPreviousPage);
                    for (var i = 0; i < errorInRequiredFields.length; i++) {
                        var fieldId = errorInRequiredFields[i];
                        if (currentPageFieldsList.indexOf(fieldId) == -1) {
                            //console.log(fieldId);
                            //setTimeout(function(){
                                window.location.href =  jsVars.redirectToPreviousPage;
                            //}, 5000);
                        }
                    }
                }
                flag = true;
            }
        }
        
        if(CheckEmailFields()==true){
            flag=true;
        }
        if(CheckMaxMinFields()==true){
            flag=true;
        }
        if(CheckMaxMinWordsFields()==true){
            flag=true;
        }
        if(CheckDecimalPlaces()==true){
            flag=true;
        }
        if(custom_script()==true){
            flag=true;
        }
        if(CheckNumericFields()==true){
            flag=true;
        }
        if(CheckMaxValueInNumericFields()==true){
            flag=true;
        }
        if(CheckAlphabetFields()==true){
            flag=true;
        }
        if(tableYearCondition()==true){
            flag=true;
        }
        if(CheckUniqueFieldsGroup()==true){
            flag=true;
        }
        
        if(CheckDateValue()==true){
            flag=true;
        }
        if(CheckMobileFields()==true){
            flag=true;
        }
        if (CheckWhiteListChars() == true) {
            flag = true;
        }
        //if All form builder validation pass
        if(!flag) {
            $('#conditional_js_error').hide();
            if(ResetJS()==true){
                $('#conditional_js_error').html("There is some error in form. Please check fields from starting stage.")
                $('#conditional_js_error').fadeIn();
                flag=true;
            }
        }
        
        if(checkAadharNo()==true){
            flag=true;
        }

        if(typeof lastScrollOffset !='undefined' && lastScrollOffset>0){
            $('html, body').animate({
                  scrollTop: lastScrollOffset - 100
               }, 700);
                lastScrollOffset = 0;
        }

        if(flag==true){
              // FinallySave(redirect_type);
              
               if (typeof reopen_form_logic_id != 'undefined') {
                if(reopen_form_logic_id != 0 ){
                    $("*","#save_data").not(".acc-link").prop('disabled',true) ;
                    $(".textfield","#save_data").attr('style', 'color :graytext !important');
                    $(".datepicker","#save_data").attr('style', 'color :graytext !important');
                    if($("option[disabled]","#save_data").length>0){
                        $("option","#save_data").attr('disabled',false).trigger("chosen:updated"); 
                    }
                    for(var x in reopenFields){
                        if($("[id^='"+reopenFields[x]+"']").has('option').length >0){
                            $("[id^='"+reopenFields[x]+"']").prop('disabled',false);  
                            $("#"+reopenFields[x]+" option").prop('disabled',false).trigger("chosen:updated");
                            $("[id^='"+reopenFields[x]+"']").prop('readonly',false);
                        }else{
                           $("[id^='"+reopenFields[x]+"']").prop('disabled',false);  
                           $("[id^='"+reopenFields[x]+"']").prop('readonly',false);
                        }
                    }
               }
            }
                return false;
        }
        else{
            
            if(redirect_type == 'offline')
            {
               current_page = offline_current_page;                
            }
//            if(url_page_no == lastReopenPage && lastReopenPage!=0 && redirect_type !='preview'){
//                $("#ConfirmPopupArea").css('z-index', 11001);
//                if(reopenConfirmMsz==''){
//                    reopenConfirmMsz = "Are you Want to update?";
//                }
//                $('#ConfirmMsgBody').html(reopenConfirmMsz);
//                $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
//                     .one('click', '#confirmYes', function (e) {
//                      $('.loader-block').show();
//                      FinallySave(redirect_type);
//                $('#ConfirmPopupArea').modal('hide');
//                });
//                return false;
//            }else{
                $('.loader-block').show();
                FinallySave(redirect_type);
           // }
            return true;
        }     
    }
    
    
     function CalculatePercentage(){
          $('#error_div').hide();
            var data = $('#save_data').serializeArray();
                $.ajax({
                url: college_slug+'/form/cal-percent',
                type: 'post',
                dataType: 'json',
                //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
                data: {
                    "form_id" : jsVars.form_id
                },
                headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                success: function (data) {

                    if(data['session_logout']=="1"){
                        window.location.href= college_slug+'/dashboard/';                           
                    }
                    else{
                        if(data["common"] != ""){
                            var minus=0;
                            if(parseInt(data["common"])>0 && parseInt(data["common"])<100)  minus=5;
                            $('#progress_bar_2').animate({"left":(parseInt(data["common"])-minus)+"%"});
                            $('#progress_bar_1').css({"width":data["common"]+"%"});

                            $('#progress_bar_3').html(data["common"]);

                        }
                        if(typeof data["page_wise"] != 'undefined'){

                           for(var i in data["page_wise"]){
                               var p=parseInt(data["page_wise"][i]["percent_saved"]);
                               $('#page_wise_percent_'+i).html(p);
                               $('.page_wise_percent_'+i).attr('class', 'page_wise_percent_'+i+' c100 p'+p+' green small');
                               $('.page_wise_percent_mobile_'+i).attr('class', 'page_wise_percent_'+i+' c100 p'+p+' green ex-small');
                           }
                        }
                    }
                     return false;
                    //console.log(data);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
    }
    var run_autosave="1";
    function AutoSaveApplicantForm(){
        if(run_autosave=="1"){
            FinallySave('draft');
            setTimeout("AutoSaveApplicantForm()",30000);
        }
    }
    
    function AutoCheckHashKey(hashkey,form_id,user_id){
        checkFormHashKey(hashkey,form_id,user_id);
        setTimeout("AutoCheckHashKey('"+hashkey+"',"+form_id+","+user_id+")",30000);
    }
    
    function checkFormHashKey(hashkey,form_id,user_id){
        $.ajax({
            url: college_slug+'/form/check-form-hashkey/',
            type: 'post',
            dataType: 'json',
            data: 'session_hashkey='+hashkey+'&form_id='+form_id+'&user_id='+user_id,

            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                if(data['referesh_popup']==0){
                    window.location.href= college_slug+'/dashboard/';                           
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        
    }
    
    var isVarFinallySave=false;
    function FinallySave(redirect_type){
            if(isVarFinallySave==true) { //check whether ajax hit is already calle. If already called then return from here
                return;
            }    
            isVarFinallySave=true; //If ajax hit is called then set this variable to true
            
            //Disable the Submit Button
            $("form#save_data #next_btn").attr('disabled','disabled');
            $('#conditional_js_error').hide();
            
            run_autosave="0";
            DeleteUploadedFileOnHide();
            var data_save = $('#save_data').serializeArray();
            
            data_save.push({name:"redirect_type",value:redirect_type});
            if(typeof hidden_file_ids !='undefined'){
                data_save.push({name:"hidden_file_ids",value:hidden_file_ids});
            }     
                $.ajax({
                    url: college_slug+'/form/submit/'+current_page,
                    type: 'post',
                    dataType: 'json',
                    //async: false,
                    //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
                    data: data_save,//$('#save_data').serialize(),
//                    {
//                        "filled_data": data,
//                        "form_id" : jsVars.form_id
//                    },
                    headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                    success: function (data) {
                        isVarFinallySave=false;
                        //If there is any error then dont hide any error message
                        //$('span[id^=requiredError_]').hide();
                       // $('span[id^=otherError_]').hide();
                        if(typeof data.error !='undefined' && Object.keys(data.error).length>0){
                           
                            for (var key in data.error) {
                              if (data.error.hasOwnProperty(key)) {
                                if(key=='required'){
                                    var req_field = data.error['required'];
                                    for(var key in req_field){
                                        $('#otherError_'+key).hide();
                                        $('#requiredError_'+key).show();
                                        if(req_field[key] != ""){ 
                                            $('#requiredError_'+key).html(req_field[key]);
                                            scrollToField(key);
                                            $('#requiredError_'+key).parent().addClass('has-error');
                                            
                                        }
                                    }
                                }else if(key=='other'){
                                    var other_field = data.error['other'];
                                    for (var key in other_field) {
                                        $('#requiredError_'+key).hide();
                                        showOtherErrorDelay(key, other_field[key]);
                                        scrollToField(key);
                                        $('#otherError_'+key).parent().addClass('has-error');
                                    }
                                }
                              }
                            }

                            if(typeof lastScrollOffset !='undefined' && lastScrollOffset>0){
                                $('html, body').animate({
                                      scrollTop: lastScrollOffset - 100
                                   }, 700);
                                    lastScrollOffset = 0;
                            }
                            
                            run_autosave="1";
                            $('.loader-block').hide();
                            $("form#save_data #next_btn").removeAttr('disabled');
                        }else{
                            
                            
                        
                        //Remove disabled
                        $("form#save_data #next_btn").removeAttr('disabled');
            
                        if(redirect_type=="next"){
                            if(typeof data['redirect_success'] !=='undefined' && data['redirect_success']!==null){
                                var split_content=data['redirect_success'].split("||");
                                if(split_content[0]=="blank_fields"){
                                    window.location.href= college_slug+'/form/submit/'+split_content[1];
                                }
                                return false;
                            }
                            if(data['referesh_popup']==0){
                               
                                window.location.href= college_slug+'/dashboard/';                           
                            }else if(data['referesh_popup']==2){
                                $('#ConfirmPopupArea').modal('hide');
                                $('.loader-block').hide();
                                alertPopup('The deadline for submitting the application has exceeded, please contact the admission team','success',college_slug+'/dashboard/');
                                $('h4#alertTitle').html('Notification');
                                $('h2#alertTitle').html('Notification');
                            }else if(typeof data['resubmission_payment'] !=='undefined' && data['resubmission_payment']!=='' && data['resubmission_payment']!==null){
                                location = data['resubmission_payment'];
                            }else if(typeof data['resubmission_unipe_payment'] !=='undefined' && data['resubmission_unipe_payment']!=='' && data['resubmission_unipe_payment']!==null && data['resubmission_unipe_payment']==1){
                                    unipePayment('resubmission_unipe_payment',data['formId'],data['resubmissionLogicId'],data['unipe_fee_id']);
                            }else{
                                window.location.href= college_slug+'/form/submit/'+next_page
                            } 
                        }
                        else if(redirect_type=="preview"){
                            if(typeof data['redirect_success'] !=='undefined' && data['redirect_success']!==null){
                                var split_content=data['redirect_success'].split("||");
                                if(typeof split_content[0]!=='undefined' && typeof split_content[1]!=='undefined' && split_content[0]=="preview"){
                                    window.location.href= college_slug+'/form/preview/'+split_content[1]
                                }
                            }else{
                                window.location.href= college_slug+'/form/preview/'+next_page
                            }
                        }
                        else if(redirect_type=="exit"){
                            //alertPopup("Your Application Saved",'success',college_slug+'/dashboard/');
                            window.location.href= college_slug+'/dashboard/';
                            
                        }
                        else if(redirect_type=="offline-draft"){
                            //alertPopup("Your Application Saved",'success',college_slug+'/dashboard/');
                            window.location.href= '/form/submit-offline/'+offline_draft_current_page;
                            
                        }
                        else if(redirect_type=="offline"){
                            //alertPopup("Your Application Saved",'success',college_slug+'/dashboard/');
                            window.location.href= '/form/submit-offline/'+current_page;
                            
                        }
                        else if(redirect_type=="submit_application"){
                            var split_content=data['redirect_success'].split("||");
                            if(split_content[0]=="blank_fields"){
                                window.location.href= college_slug+'/form/submit/'+split_content[1];
                            }else{
                                window.location.href= college_slug+'/payment/success/'+split_content[1];
                            }
                            return false;
                        }
                        else if(redirect_type=="partwise_submit_application"){
                            var split_content=data['redirect_success'].split("||");
                            console.log(split_content);
                            if(split_content[0]=="blank_fields"){
                                window.location.href= college_slug+'/form/submit/'+split_content[1];
                            }else{
                                window.location.href= college_slug+'/payment/success/'+split_content[1];
                            }
                            return false;
                        }
                        else if(redirect_type=="getFormTitle"){
                            CalculatePercentage();
                            getFormDynamicName();
                        }else if(redirect_type=="part_wise_payment"){
                            if(typeof data['redirect_success'] !=='undefined' && data['redirect_success']!==null){
                                var split_content=data['redirect_success'].split("||");
                                if(split_content[0]=="blank_fields"){
                                    window.location.href= college_slug+'/form/submit/'+split_content[1];
                                }
                            }else{
                                window.location.href= college_slug+jsVars.partWisePaymentUrl;
                            }
                            return false;
                        }else{
                            if(data['referesh_popup']==0){
                               
                                window.location.href= college_slug+'/dashboard/';                           
                            }else if(data['referesh_popup']==2){
                                $('#ConfirmPopupArea').modal('hide');
                                $('.loader-block').hide();
                                alertPopup('The deadline for submitting the application has exceeded, please contact the admission team','success',college_slug+'/dashboard/');
                                $('h4#alertTitle').html('Notification');
                                $('h2#alertTitle').html('Notification');
                            }else{
                            
                            // if auto saving then calculate the percentage
                                CalculatePercentage();
                                run_autosave="1"; // if autosave is executed 
                            // progress_bar_1
                            }
                        }
                        
                    }
                        
                        //console.log(data);
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    }
                });
    }
    
    function showOtherErrorDelay(field, msg) {
        setTimeout(() => {
            $('#otherError_'+field).html(msg);
            $('#otherError_'+field).show();
        }, 200);
    }
    function SaveCoupon(){
          $('#error_div').hide();
          $('#success_div').hide();
          $('#fee_breakup').hide();
          $('#payment_info_div').html('');
        
          $('#apply_coupon').attr("disabled","disabled");
          $('.loader-block').show();
          $('#coupon_code_applied').val("0");
          $("#pay_amount_online").val($("#original_pay_amount").val());
          data=new Array();
          var coupon_code=$('#coupon_code').val();
          if(coupon_code==""){
               $('#error_div').fadeIn();
                $('.loader-block').hide();
               $('#error_div').html("Please enter coupon code.");
               $('#apply_coupon').removeAttr("disabled","disabled");
             return false;
        }
          
            data.push({name:"coupon_code",value:coupon_code});
            data.push({name:"form_id",value:jsVars.form_id});
            data.push({name:"type",value:"payment"});
            
            if(typeof $('[name="payment_mode"]').val() !='undefined' && $('[name="payment_mode"]').val()!=''){
                var check_payment_mode = $('[name="payment_mode"]:checked').val();
                data.push({name:"check_payment_mode",value:check_payment_mode});
            }
                $.ajax({
                url: college_slug+'/form/apply-coupon',
                type: 'post',
                dataType: 'html',
                data: data,
                headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                success: function (data) {
                    if(data == 'referesh_popup'){
                        window.location.href= college_slug+'/dashboard/';
                        return false;
                    }else{
                            var split_content=data.split("||");
                             $('#apply_coupon').removeAttr("disabled","disabled");
                            
                             if(split_content[0]=="error"){
                                $('.loader-block').hide();
                                $('#error_div').show();
                                $('#error_div').html(split_content[1]);
                                return false;
                            }
                            else  if(split_content[0]=="success"){
                                $('.loader-block').hide();
                                $('#success_div').show();
                                return_val=JSON.parse(split_content[1]);  
                                //console.log(return_val);
                                $('#success_div').html(return_val["success"]);
                                $('.fee_breakup_div_parent').show();
                                $('#fee_breakup').show();
                                $('#payment_info_div').html(return_val["paymentInfo"]);
                                if($('#pay_amount_online').length>0){
                                    var extra_charge = 0;
                                    if(typeof return_val["extra_charge"]!='undefined' && return_val["extra_charge"]!=''){
                                        extra_charge = return_val["extra_charge"];
                                    }
                                    $('#pay_amount_online').val(parseFloat(return_val["new_payment_amount"])+parseFloat(extra_charge));
                                    $('#coupon_code_applied').val("1");
                                }
                                if($('.FeeSyntax').length>0){
                                    $('.application_fee_span').hide();
                                }
                                
                                return false;
                            }
                    }
                    //console.log(data);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
    }
    var changePaymentBtnText = 0;
    function applyInstallmentPayAmount(paymentTextBoxId){
        var baseAmtBreakUp = 0;
        if(paymentTextBoxId === 'base_fee_amt_value') {
            baseAmtBreakUp = 1;
        }
        var installment_amount=parseFloat($('#'+paymentTextBoxId).val().trim());
        if(isNaN(installment_amount)){
            $('#installmentError').show();
            $('#installmentError').html("Please enter valid amount.");
            return false;
        }
        $('#installmentError').html('');
        $('#installmentError').hide();
        $('#apply_installment').attr("disabled","disabled");
        $('.loader-block').show();
        $("#pay_amount_online").val($("#original_pay_amount").val());
        data    = new Array();
        data.push({name:"installment_amount",value:installment_amount});
        data.push({name:"form_id",value:jsVars.form_id});
        data.push({name:"type",value:"payment"});
        data.push({name:"pay_amount",value:$("#original_pay_amount").val()});
        data.push({name:"ccAvenueHybridEnable",value:jsVars.ccAvenueHybridEnable});
        if (typeof jsVars.fee_config_id !== 'undefined') {
            data.push({name:"fee_config_id",value:jsVars.fee_config_id});
        }
            
        if(typeof $('[name="payment_mode"]').val() !=='undefined' && $('[name="payment_mode"]').val()!==''){
            var check_payment_mode = $('[name="payment_mode"]:checked').val();
            data.push({name:"check_payment_mode",value:check_payment_mode});
        }
        data.push({name:'installmentAmountHash', value:jsVars.installmentAmountHash});
        $.ajax({
            url: college_slug+'/payment/apply-installment-amount',
            type: 'post',
            dataType: 'html',
            data: data,
            async:false,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                $('#apply_installment').removeAttr("disabled","disabled");
                var responseObject = $.parseJSON(data);
                if(responseObject.status==1){
                    $('.loader-block').hide();
                    if(responseObject.data.payment_mode === 'online' && parseFloat(responseObject.data.installmentFee['base_fee_amt_show']) != parseFloat(responseObject.data.installmentFee['online_amount_amt_show'])) {
                        changePaymentBtnText = 1;
                        $("#taxInfo_online").show();
                    } else if(responseObject.data.payment_mode === 'online' && parseFloat(responseObject.data.installmentFee['base_fee_amt_show']) == parseFloat(responseObject.data.installmentFee['online_amount_amt_show'])) {
                        changePaymentBtnText = 0;
                    }
                    else if((responseObject.data.payment_mode === 'cash' || responseObject.data.payment_mode === 'dd') && parseFloat(responseObject.data.installmentFee['base_fee_amt_show']) != parseFloat(responseObject.data.installmentFee['other_amount_amt_show'])) {
                        changePaymentBtnText = 1;
                        if(responseObject.data.payment_mode === 'cash') {
                            $("#taxInfo_cash").show();
                        } else if(responseObject.data.payment_mode === 'dd') {
                            $("#taxInfo_dd").show();
                        }
                    } else if((responseObject.data.payment_mode === 'cash' || responseObject.data.payment_mode === 'dd') && parseFloat(responseObject.data.installmentFee['base_fee_amt_show']) == parseFloat(responseObject.data.installmentFee['other_amount_amt_show'])) {
                        changePaymentBtnText = 0;
                    }
                    if(baseAmtBreakUp === 1) {
                        if(responseObject.data.payment_mode === 'online' && parseFloat(responseObject.data.installmentFee['base_fee_amt_show']) != parseFloat(responseObject.data.installmentFee['online_amount_amt_show'])) {
                            $("#make_payment").html('Continue');
                            $("#taxInfo_online").show();
                        } else if(responseObject.data.payment_mode === 'online' && parseFloat(responseObject.data.installmentFee['base_fee_amt_show']) == parseFloat(responseObject.data.installmentFee['online_amount_amt_show'])) {
                            $("#make_payment").html('Make Payment');
                        }
                        else if((responseObject.data.payment_mode === 'cash' || responseObject.data.payment_mode === 'dd') && parseFloat(responseObject.data.installmentFee['base_fee_amt_show']) != parseFloat(responseObject.data.installmentFee['other_amount_amt_show'])) {
                            $("#make_payment").html('Continue');
                            if(responseObject.data.payment_mode === 'cash') {
                                $("#taxInfo_cash").show();
                            } else if(responseObject.data.payment_mode === 'dd') {
                                $("#taxInfo_dd").show();
                            }
                        } else if((responseObject.data.payment_mode === 'cash' || responseObject.data.payment_mode === 'dd') && parseFloat(responseObject.data.installmentFee['base_fee_amt_show']) == parseFloat(responseObject.data.installmentFee['other_amount_amt_show'])) {
                            $("#make_payment").html('Make Payment');
                        } else {
                            $("#make_payment").html('Make Payment');
                        }
                        return true;
                    }
                    if( $('#pay_amount_online').length>0 && responseObject.data.payment_mode === 'online'){
                        if(isNaN(responseObject.data.installmentFee['base_fee_gst_amt_show']) || responseObject.data.installmentFee['base_fee_gst_amt_show'] == ''){
                            responseObject.data.installmentFee['base_fee_gst_amt_show'] = 0;
                        }
                        if(isNaN(responseObject.data.installmentFee['npf_surcharge_amt_show']) || responseObject.data.installmentFee['npf_surcharge_amt_show'] == ''){
                            responseObject.data.installmentFee['npf_surcharge_amt_show'] = 0;
                        }
                        if(isNaN(responseObject.data.installmentFee['npf_surcharge_gst_amt_show']) || responseObject.data.installmentFee['npf_surcharge_gst_amt_show'] == ''){
                            responseObject.data.installmentFee['npf_surcharge_gst_amt_show'] = 0;
                        }
                        if(isNaN(responseObject.data.installmentFee['payment_gateway_amt_show']) || responseObject.data.installmentFee['payment_gateway_amt_show'] == ''){
                            responseObject.data.installmentFee['payment_gateway_amt_show'] = 0;
                        }
                        if(isNaN(responseObject.data.installmentFee['payment_gateway_gst_amt_show']) || responseObject.data.installmentFee['npf_surcharge_gst_amt_show'] == ''){
                            responseObject.data.installmentFee['npf_surcharge_gst_amt_show'] = 0;
                        }
                        
                        if((jsVars.ccAvenueHybridEnable==1) && !isNaN(responseObject.data.installmentFee['ccAvenueCharge'])){
                            responseObject.data.installmentFee['payment_gateway_amt_show'] = responseObject.data.installmentFee['ccAvenueCharge'];
                            responseObject.data.installmentFee["online_amount_amt_show"] = (parseFloat(responseObject.data.installmentFee["online_amount_amt_show"]) + parseFloat(responseObject.data.installmentFee['payment_gateway_amt_show'])).toFixed(2);
                        }
                        $('#pay_amount_online').val( responseObject.data.installmentFee["online_amount_amt_show"] );
                        $('#pay_amount_online_span').html( responseObject.data.installmentFee["online_amount_amt_show"] );
                        var totalTaxesOnline    = parseFloat(responseObject.data.installmentFee['base_fee_gst_amt_show']);
                        if(responseObject.data.installmentFee['npf_surcharge_paid_by']=="applicant" && parseFloat(responseObject.data.installmentFee['npf_surcharge_amt_show']) > 0){
                            $('#onlineConveyanceChargesSpan').html( parseFloat(responseObject.data.installmentFee["npf_surcharge_amt_show"]).toFixed(2) );
                            $("#onlineConveyanceChargesDiv").show();
                            if(parseFloat(responseObject.data.installmentFee['npf_surcharge_gst_amt_show']) > 0) {
                                totalTaxesOnline    += parseFloat(responseObject.data.installmentFee['npf_surcharge_gst_amt_show']);;
                            }
                        }else{
                            $("#onlineConveyanceChargesDiv").hide();
                        }
                        
                        if(responseObject.data.installmentFee['payment_gateway_paid_by']=="applicant" && parseFloat(responseObject.data.installmentFee['payment_gateway_amt_show']) > 0){
                            $('#pgChargesSpan').html( parseFloat(responseObject.data.installmentFee["payment_gateway_amt_show"]).toFixed(2) );
                            $("#onlinePgChargesDiv").show();
                            if(parseFloat(responseObject.data.installmentFee['payment_gateway_gst_amt_show']) > 0) {
                                totalTaxesOnline    += parseFloat(responseObject.data.installmentFee['payment_gateway_gst_amt_show']);
                            }
                        }else{
                            $("#onlinePgChargesDiv").hide();
                        }
                        if(totalTaxesOnline > 0){
                            $('#onlineTaxesSpan').html( totalTaxesOnline.toFixed(2) );
                            $("#onlineTaxesDiv").show();
                        }else{
                            $("#onlineTaxesDiv").hide();
                        }
                        if( parseFloat(responseObject.data.installmentFee["base_fee_amt_show"]) > 0) {
                            $('#onlineSubtotalSpan').html(responseObject.data.installmentFee["base_fee_amt_show"]);
                        }
                    } else if( $('#pay_amount_cash').length>0 && responseObject.data.payment_mode === 'cash'){
                        if(isNaN(responseObject.data.installmentFee['base_fee_gst_amt_show']) || responseObject.data.installmentFee['base_fee_gst_amt_show'] == ''){
                            responseObject.data.installmentFee['base_fee_gst_amt_show'] = 0;
                        }
                        if(isNaN(responseObject.data.installmentFee['npf_surcharge_amt_show']) || responseObject.data.installmentFee['npf_surcharge_amt_show'] == ''){
                            responseObject.data.installmentFee['npf_surcharge_amt_show'] = 0;
                        }
                        if(isNaN(responseObject.data.installmentFee['npf_surcharge_gst_amt_show']) || responseObject.data.installmentFee['npf_surcharge_gst_amt_show'] == ''){
                            responseObject.data.installmentFee['npf_surcharge_gst_amt_show'] = 0;
                        }
                        if(isNaN(responseObject.data.installmentFee['payment_gateway_amt_show']) || responseObject.data.installmentFee['payment_gateway_amt_show'] == ''){
                            responseObject.data.installmentFee['payment_gateway_amt_show'] = 0;
                        }
                        if(isNaN(responseObject.data.installmentFee['payment_gateway_gst_amt_show']) || responseObject.data.installmentFee['npf_surcharge_gst_amt_show'] == ''){
                            responseObject.data.installmentFee['npf_surcharge_gst_amt_show'] = 0;
                        }
                        
                        if((jsVars.ccAvenueHybridEnable==1) && !isNaN(responseObject.data.installmentFee['ccAvenueCharge'])){
                            responseObject.data.installmentFee['payment_gateway_amt_show'] = responseObject.data.installmentFee['ccAvenueCharge'];
                            responseObject.data.installmentFee["online_amount_amt_show"] = (parseFloat(responseObject.data.installmentFee["online_amount_amt_show"]) + parseFloat(responseObject.data.installmentFee['payment_gateway_amt_show'])).toFixed(2);
                        }
                        $('#pay_amount_cash').val( responseObject.data.installmentFee["other_amount_amt_show"] );
                        $('#pay_amount_cash_span').html( responseObject.data.installmentFee["other_amount_amt_show"] );
                        var totalTaxesOnline    = parseFloat(responseObject.data.installmentFee['base_fee_gst_amt_show']);
                        if(responseObject.data.installmentFee['npf_surcharge_paid_by']=="applicant" && parseFloat(responseObject.data.installmentFee['npf_surcharge_amt_show']) > 0){
                            $('#cashConveyanceChargesSpan').html( parseFloat(responseObject.data.installmentFee["npf_surcharge_amt_show"]).toFixed(2) );
                            $("#cashConveyanceChargesDiv").show();
                            if(parseFloat(responseObject.data.installmentFee['npf_surcharge_gst_amt_show']) > 0) {
                                totalTaxesOnline    += parseFloat(responseObject.data.installmentFee['npf_surcharge_gst_amt_show']);;
                            }
                        }else{
                            $("#cashConveyanceChargesDiv").hide();
                        }
                        
                        if(totalTaxesOnline > 0){
                            $('#cashTaxesSpan').html( totalTaxesOnline.toFixed(2) );
                            $("#cashTaxesDiv").show();
                        }else{
                            $("#cashTaxesDiv").hide();
                        }
                        if( parseFloat(responseObject.data.installmentFee["base_fee_amt_show"]) > 0) {
                            $('#cashSubtotalSpan').html(responseObject.data.installmentFee["base_fee_amt_show"]);
                        }
                    } else if( $('#pay_amount_dd').length>0 && responseObject.data.payment_mode === 'dd'){
                        if(isNaN(responseObject.data.installmentFee['base_fee_gst_amt_show']) || responseObject.data.installmentFee['base_fee_gst_amt_show'] == ''){
                            responseObject.data.installmentFee['base_fee_gst_amt_show'] = 0;
                        }
                        if(isNaN(responseObject.data.installmentFee['npf_surcharge_amt_show']) || responseObject.data.installmentFee['npf_surcharge_amt_show'] == ''){
                            responseObject.data.installmentFee['npf_surcharge_amt_show'] = 0;
                        }
                        if(isNaN(responseObject.data.installmentFee['npf_surcharge_gst_amt_show']) || responseObject.data.installmentFee['npf_surcharge_gst_amt_show'] == ''){
                            responseObject.data.installmentFee['npf_surcharge_gst_amt_show'] = 0;
                        }
                        if(isNaN(responseObject.data.installmentFee['payment_gateway_amt_show']) || responseObject.data.installmentFee['payment_gateway_amt_show'] == ''){
                            responseObject.data.installmentFee['payment_gateway_amt_show'] = 0;
                        }
                        if(isNaN(responseObject.data.installmentFee['payment_gateway_gst_amt_show']) || responseObject.data.installmentFee['npf_surcharge_gst_amt_show'] == ''){
                            responseObject.data.installmentFee['npf_surcharge_gst_amt_show'] = 0;
                        }
                        
                        if((jsVars.ccAvenueHybridEnable==1) && !isNaN(responseObject.data.installmentFee['ccAvenueCharge'])){
                            responseObject.data.installmentFee['payment_gateway_amt_show'] = responseObject.data.installmentFee['ccAvenueCharge'];
                            responseObject.data.installmentFee["online_amount_amt_show"] = (parseFloat(responseObject.data.installmentFee["online_amount_amt_show"]) + parseFloat(responseObject.data.installmentFee['payment_gateway_amt_show'])).toFixed(2);
                        }
                        $('#pay_amount_dd').val( responseObject.data.installmentFee["other_amount_amt_show"] );
                        $('#pay_amount_dd_span').html( responseObject.data.installmentFee["other_amount_amt_show"] );
                        var totalTaxesOnline    = parseFloat(responseObject.data.installmentFee['base_fee_gst_amt_show']);
                        if(responseObject.data.installmentFee['npf_surcharge_paid_by']=="applicant" && parseFloat(responseObject.data.installmentFee['npf_surcharge_amt_show']) > 0){
                            $('#ddConveyanceChargesSpan').html( parseFloat(responseObject.data.installmentFee["npf_surcharge_amt_show"]).toFixed(2) );
                            $("#ddConveyanceChargesDiv").show();
                            if(parseFloat(responseObject.data.installmentFee['npf_surcharge_gst_amt_show']) > 0) {
                                totalTaxesOnline    += parseFloat(responseObject.data.installmentFee['npf_surcharge_gst_amt_show']);;
                            }
                        }else{
                            $("#ddConveyanceChargesDiv").hide();
                        }
                        
                        if(totalTaxesOnline > 0){
                            $('#ddTaxesSpan').html( totalTaxesOnline.toFixed(2) );
                            $("#ddTaxesDiv").show();
                        }else{
                            $("#ddTaxesDiv").hide();
                        }
                        if( parseFloat(responseObject.data.installmentFee["base_fee_amt_show"]) > 0) {
                            $('#ddSubtotalSpan').html(responseObject.data.installmentFee["base_fee_amt_show"]);
                        }
                    }
                }else{
                    if (responseObject.message === 'referesh_popup'){
                        window.location.href= college_slug+'/dashboard/';
                    }else{
                        $('.loader-block').hide();
                        $('#installmentError').show();
                        $('#installmentError').html(responseObject.message);
                    }
                }
                return false;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $('#apply_coupon').removeAttr("disabled","disabled");
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
    
    function applyDiscountCoupon(){
        var coupon_code=$('#coupon_code').val().trim();
//        if(coupon_code==""){
//            $('#couponError').show();
//            $('#couponError').html("Please enter coupon code.");
//            return false;
//        }
        $('#couponError').html('');
        $('#couponError').hide();
        $('#apply_coupon').attr("disabled","disabled");
        $('.loader-block').show();
        $('#coupon_code_applied').val("0");
        $('#discountAmount').val("0");
        $("#pay_amount_online").val($("#original_pay_amount").val());
        data    = new Array();
        data.push({name:"coupon_code",value:coupon_code});
        data.push({name:"form_id",value:jsVars.form_id});
        data.push({name:"type",value:"payment"});
        data.push({name:"pay_amount",value:$("#original_pay_amount").val()});
        data.push({name:"ccAvenueHybridEnable",value:jsVars.ccAvenueHybridEnable});
        if (typeof jsVars.fee_config_id !== 'undefined') {
            data.push({name:"fee_config_id",value:jsVars.fee_config_id});
        }
            
        if(typeof $('[name="payment_mode"]').val() !=='undefined' && $('[name="payment_mode"]').val()!==''){
            var check_payment_mode = $('[name="payment_mode"]:checked').val();
            data.push({name:"check_payment_mode",value:check_payment_mode});
        }
        $.ajax({
            url: college_slug+'/payment/apply-discount-coupon',
            type: 'post',
            dataType: 'html',
            data: data,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                $('#apply_coupon').removeAttr("disabled","disabled");
                var responseObject = $.parseJSON(data);
                if(responseObject.status==1){
                    $('.loader-block').hide();
                    if( $('#pay_amount_online').length>0 ){
                        if(isNaN(responseObject.data.discountedFee['base_fee_gst_amt_show']) || responseObject.data.discountedFee['base_fee_gst_amt_show'] == ''){
                            responseObject.data.discountedFee['base_fee_gst_amt_show'] = 0;
                        }
                        if(isNaN(responseObject.data.discountedFee['npf_surcharge_amt_show']) || responseObject.data.discountedFee['npf_surcharge_amt_show'] == ''){
                            responseObject.data.discountedFee['npf_surcharge_amt_show'] = 0;
                        }
                        if(isNaN(responseObject.data.discountedFee['npf_surcharge_gst_amt_show']) || responseObject.data.discountedFee['npf_surcharge_gst_amt_show'] == ''){
                            responseObject.data.discountedFee['npf_surcharge_gst_amt_show'] = 0;
                        }
                        if(isNaN(responseObject.data.discountedFee['payment_gateway_amt_show']) || responseObject.data.discountedFee['payment_gateway_amt_show'] == ''){
                            responseObject.data.discountedFee['payment_gateway_amt_show'] = 0;
                        }
                        if(isNaN(responseObject.data.discountedFee['payment_gateway_gst_amt_show']) || responseObject.data.discountedFee['npf_surcharge_gst_amt_show'] == ''){
                            responseObject.data.discountedFee['npf_surcharge_gst_amt_show'] = 0;
                        }
                        
                        if((jsVars.ccAvenueHybridEnable==1) && !isNaN(responseObject.data.discountedFee['ccAvenueCharge'])){
                            responseObject.data.discountedFee['payment_gateway_amt_show'] = responseObject.data.discountedFee['ccAvenueCharge'];
                            responseObject.data.discountedFee["online_amount_amt_show"] = (parseFloat(responseObject.data.discountedFee["online_amount_amt_show"]) + parseFloat(responseObject.data.discountedFee['payment_gateway_amt_show'])).toFixed(2);
                        }
                        $('#pay_amount_online').val( responseObject.data.discountedFee["online_amount_amt_show"] );
                        $('#pay_amount_online_span').html( responseObject.data.discountedFee["online_amount_amt_show"] );
                        var totalTaxesOnline    = parseFloat(responseObject.data.discountedFee['base_fee_gst_amt_show']);
                        
                        if(responseObject.data.discountedFee['npf_surcharge_paid_by']=="applicant" && parseFloat(responseObject.data.discountedFee['npf_surcharge_amt_show']) > 0){
                            $('#onlineConveyanceChargesSpan').html( parseFloat(responseObject.data.discountedFee["npf_surcharge_amt_show"]).toFixed(2) );
                            $("#onlineConveyanceChargesDiv").show();
                            totalTaxesOnline    += parseFloat(responseObject.data.discountedFee['npf_surcharge_gst_amt_show']);;
                        }else{
                            $("#onlineConveyanceChargesDiv").hide();
                        }
                        
                        if(responseObject.data.discountedFee['payment_gateway_paid_by']=="applicant" && parseFloat(responseObject.data.discountedFee['payment_gateway_amt_show']) > 0){
                            $('#pgChargesSpan').html( parseFloat(responseObject.data.discountedFee["payment_gateway_amt_show"]).toFixed(2) );
                            $("#onlinePgChargesDiv").show();
                            totalTaxesOnline    += parseFloat(responseObject.data.discountedFee['payment_gateway_gst_amt_show']);;
                        }else{
                            $("#onlinePgChargesDiv").hide();
                        }
                        
                        if(totalTaxesOnline > 0){
                            $('#onlineTaxesSpan').html( totalTaxesOnline.toFixed(2) );
                            $("#onlineTaxesDiv").show();
                        }else{
                            $("#onlineTaxesDiv").hide();
                        }
                        if( parseFloat(responseObject.data.discountedFee["discount_online_amt_show"]) > 0) {
                            $('#coupon_code_applied').val("1").attr('disabled', true);
                            $('#coupon_code').attr('readonly', true);
                            $('#discountAmountVal').html(responseObject.data.discountedFee["discount_online_amt_show"]);
                            $("#discountDiv").show();
                        }else{
                            $("#discountDiv").hide();
                        }                        
                    }
                    //show/hide Application No area
                    $('div#discountConditionalFieldValueDiv').hide();
                    if (($('div#discountConditionalFieldValueDiv').length > 0) && (typeof responseObject.data.conditionalFieldValue != 'undefined') 
                        && (responseObject.data.conditionalFieldValue != '') && (responseObject.data.conditionalFieldValue != null)) {
                        $('div#discountConditionalFieldValueDiv').show();
                    }
                }else{
                    if (responseObject.message === 'referesh_popup'){
                        window.location.href= college_slug+'/dashboard/';
                    }else{
                        $('.loader-block').hide();
                        $('#couponError').show();
                        $('#couponError').html(responseObject.message);
                        $('div#discountConditionalFieldValueDiv').hide();
                    }
                }
                return false;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $('#apply_coupon').removeAttr("disabled","disabled");
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
    
    function SavePayment(){
        $('#error_div').hide();  
        if( $("#new_checkout_page").length && $("#new_checkout_page").val()==="1" ){
            var error   = false;
            if( $("#communication_country").length && $("#communication_country").val()=="" ){
                $("#communication_country_error").html("Please select country.");
                $("#communication_country_error").show();
                error   = true;
            }else{
                $("#communication_country_error").html("");
                $("#communication_country_error").hide();
            }
            if( $("#communication_state").length && ($("#communication_state").val()=="" ||  $("#communication_state").val()==null )){
                $("#communication_state_error").html("Please select state.");
                $("#communication_state_error").show();
                error   = true;
            }else{
                $("#communication_state_error").html("");
                $("#communication_state_error").hide();
            }
            if( $("#communication_address").length && $("#communication_address").val()=="" ){
                $("#communication_address_error").html("Please enter address.");
                $("#communication_address_error").show();
                error   = true;
            }else{
                $("#communication_address_error").html("");
                $("#communication_address_error").hide();
            }

            if($("#payment_mode2").is(":checked")  && $("#payment_mode2").val() == 'DD'){
                if( $("#dd_bank_name").length && $("#dd_bank_name").val()=="" ){
                    $("#dd_bank_name_error").html("Feild is mandatory.");
                    $("#dd_bank_name_error").show();
                    error   = true;
                }else{
                    $("#dd_bank_name_error").html("");
                    $("#dd_bank_name_error").hide;
                }
                if( $("#dd_bank_branch").length && $("#dd_bank_branch").val()=="" ){
                    $("#dd_bank_branch_error").html("Feild is mandatory.");
                    $("#dd_bank_branch_error").show();
                    error   = true;
                }else{
                    $("#dd_bank_branch_error").html("");
                    $("#dd_bank_branch_error").show();
                }
                if( $("#dd_number").length && $("#dd_number").val()=="" ){
                    $("#dd_number_error").html("Feild is mandatory.");
                    $("#dd_number_error").show();
                    error   = true;
                }else{
                    $("#dd_number_error").html("");
                    $("#dd_number_error").show();
                }
                if( $("#dd_date").length && $("#dd_date").val()=="" ){
                    $("#dd_date_error").html("Feild is mandatory.");
                    $("#dd_date_error").show();
                    error   = true;
                }else{
                    $("#dd_date_error").html("");
                    $("#dd_date_error").show();
                }
            }
            if(error){
                return false;
            }
        }
        
          $('#make_payment').attr("disabled","disabled");
          $('.loader-block').show();
          
              var data = $('#save_data').serializeArray();
                $.ajax({
                url: college_slug+'/form/payment',
                type: 'post',
                dataType: 'html',
                //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
                data: {
                    "filled_data": data,
                    "form_id" : jsVars.form_id,
                    "type" : "payment"
                },
                headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                success: function (data) {
                    if(data == 'referesh_popup'){
                        window.location.href= college_slug+'/dashboard/';
                        return false;
                    }else if(data=="online"){
                        window.location.href= college_slug+'/payment/process/'+current_page;
                        return false;
                    }
                    else{
                            var split_content=data.split("||");
                            //alert(split_content);

                             //$('#make_payment').html("Continue");
                            $('#make_payment').removeAttr("disabled","disabled");
                            if(split_content[0]=="online") {
                               window.location.href= split_content[1];
                               return false;
                            } else if(split_content[0]=="dd"){
                                //alert("Form Saved");
                                window.location.href= college_slug+'/payment/success/'+split_content[1];
                                return false;
                            }
                            else if(split_content[0]=="voucher"){
                                //alert("Form Saved");
                                window.location.href= college_slug+'/payment/success/'+split_content[1];
                                return false;
                            }
                            else if(split_content[0]=="online_redirect"){
                                //alert("Form Saved");
                                window.location.href= college_slug+'/payment/success/'+split_content[1];
                                return false;
                            }
                            else if(split_content[0]=="cash"){
                                //alert("Form Saved");
                                window.location.href= college_slug+'/payment/success/'+split_content[1];
                                return false;
                            }else if(split_content[0]=="blank_fields"){
                                //console.log(college_slug+'/form/submit/'+split_content[1]);
                                //return false;
                                window.location.href= college_slug+'/form/submit/'+split_content[1];
                                return false;
                            }
                            else if(split_content[0]=="errorCash") {
                                $('.loader-block').hide();
                                $('#success_div').hide();
                                $('#showOnlyToAgentsCashValueError').text(split_content[1]);
                                $('#showOnlyToAgentsCashValueError').css('margin-top','15px').show();
                                return false;
                            } else if(split_content[0] == "error") {
                                $('.loader-block').hide();
                                $('#success_div').hide();
                                $('#error_div').css('margin-top','15px').show();
                                $('#error_div').html(split_content[1]);
                                return false;
                            }
                    }
                    //console.log(data);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
                });  
    }
    
    function submitFormPwdApproval(){
        $('#error_div').hide();
        $('#submitpwdapproval').prop("disabled",true);
        $('.loader-block').show();
        var data = $('#save_data').serializeArray();
        data.push({name:"js_form_id",value:jsVars.form_id});
        $.ajax({
            url: college_slug+'/form/submit-form-pwd-approval',
            type: 'post',
            dataType: 'json',
            data: data,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (json) {

                if (typeof json['error'] !=='undefined' && json['error'] === 'session') {
                    window.location.reload(true);
                }
                else if (typeof json['error'] !=='undefined' && json['error'] !== '') {
                    $('#submitpwdapproval').prop('disabled',false);
                    $('.loader-block').hide();
                    $('#success_div').hide();
                    $('#error_div').css('margin-top','15px').show();
                    $('#error_div').html(json['error']);
                    return false;
                }
                else if(typeof json['success'] !=='undefined' && json['success'] == 200){

                    $('.loader-block').hide();
                    window.location.href = college_slug+'/dashboard/';

//                    $('#preferencesModal').on('hidden.bs.modal', function () {
//                        window.location.href = college_slug+'/dashboard/';
//                    });
//                    $('#preferencesModal #preferencesModalLabel').html('Success');
//                    $('#preferencesModal #myModalLabel').html('Success');
//                    $('#scaletext').html('');
//                    $('#comm_pref').html('Successfully saved');
//                    $('#preferencesModal').modal({backdrop: 'static', keyboard: false});
                    
//                    $("#SuccessPopupArea #alertTitle").html("Success");
//                    alertPopup(json['msg'],'success');
                   return false;
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
    
    
    function setCityValue(value, field_id, html_val){
            $('#'+field_id).val(html_val);
            //$('#auto_'+field_id).val(html_val);
            $('#load_city_'+field_id).html("");
            var arr=html_val.split(",");
            if(MACHINE_NPF_CORRESPONDENCE_LOCATION==field_id){
                    if($('#'+correspondence_city).length > 0){
                        $('#'+correspondence_city).val($.trim(arr[1]));
                    }
                     if($('#'+correspondence_state).length > 0){
                        $('#'+correspondence_state).val($.trim(arr[2]));
                    }
                     if($('#'+correspondence_country).length > 0){
                        $('#'+correspondence_country).val($.trim(arr[3]));
                    }
                     if($('#'+correspondence_pincode).length > 0){
                        $('#'+correspondence_pincode).val($.trim(arr[0]));
                    }
            }
            else if(MACHINE_NPF_PERMANENT_LOCATION==field_id){
                    if($('#'+permanent_city).length > 0){
                        $('#'+permanent_city).val($.trim(arr[1]));
                    }
                     if($('#'+permanent_state).length > 0){
                        $('#'+permanent_state).val($.trim(arr[2]));
                    }
                     if($('#'+permanent_country).length > 0){
                        $('#'+permanent_country).val($.trim(arr[3]));
                    }
                     if($('#'+permanent_pincode).length > 0){
                        $('#'+permanent_pincode).val($.trim(arr[0]));
                    }
            }
        }
        
        function getCityById(id, field_id){
                 //$('#error_div').hide();
                    
                    $.ajax({
                      url: '/common/get-citybyid',
                      //url: college_slug+'/common/get-city',
                      type: 'post',
                      dataType: 'html',
                      //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
                      data: {
                          "id": id
                      },
                      headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                      success: function (data) {
                          if(data!=""){
                                 //$('#'+field_id).val(data);
                          }
                          else{
                              $('#load_city_'+field_id).html("");
                          }
                          //console.log(data);
                      },
                      error: function (xhr, ajaxOptions, thrownError) {
                          //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                          console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                      }
                  });
    }
        
        function LoadCityPincode(sText, field_id){
                 //$('#error_div').hide();
                 if(sText.length<3) return false;
                 
                 $('#load_city_'+field_id).html("Searching...");
                 
                      $.ajax({
                      url: '/common/get-city',
                      //url: college_slug+'/common/get-city',
                      type: 'post',
                      dataType: 'html',
                      //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
                      data: {
                          "sText": sText,
                          "field_id": field_id
                      },
                      headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                      success: function (data) {
                          if(data!=""){
                                 $('#load_city_'+field_id).html(data);
                                // setTimeout("$('#load_city_'+field_id).html('');",5000);
                         }
                         else{
                               $('#load_city_'+field_id).html("");
                         }
                          //console.log(data);
                      },
                      error: function (xhr, ajaxOptions, thrownError) {
                          //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                          console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                      }
                  });
    }
    
        
    

 function ShowHidePaymentOption(show){
        $('#error_div').hide();
        $('.pay_div').hide();
        $('#'+show).show();
        // merge fee breakup with coupon detail 
        if(show != 'Online'){
            $('.fee_breakup_div_parent').hide();
            $('#fee_breakup, #payment_info_div').hide();
            $('#success_div').hide();
        }else if($("#payment_info_div").text() != ""){
            $('.fee_breakup_div_parent').show();
            $("#fee_breakup").show();
            $("#payment_info_div").hide();
        }
    }
    
    var jsonData    = {};    
    
    function getCcavenueHybridCards(url,access_code,amount,currency){
        $.ajax({
             url        : url + '&access_code='+access_code+'&currency='+currency+'&amount='+amount,
             dataType   : 'jsonp',
             jsonp      : false,
             jsonpCallback: 'processData',
             success: function (data) { 
                jsonData = data;
                if($("input[name='payment_mode']:checked").length){
                    $("input[name='payment_mode']:checked").trigger('click');
                }
             },
             error: function(xhr, textStatus, errorThrown) {
                 console.log('An error occurred! ' + ( errorThrown ? errorThrown :xhr.status ));
             }
        });
        
    }
        
    function selectHybridPGPayMode(){
            var paymentOption   = "";
            var cardArray       = "";
            paymentOption = $(this).data('cardtype');
            $("#card_type").val(paymentOption.replace("OPT",""));
            $("#card_name").children().remove(); // remove old card names from old one
            $("#card_name").append("<option value=''>Select Card Name</option>");

            $.each(jsonData, function(index,value) {
                if(value.payOpt==paymentOption){
                    cardArray = $.parseJSON(value[paymentOption]);
                    $.each(cardArray, function() {
                    $("#card_name").find("option:last").after("<option class='"+this['dataAcceptedAt']+" "+this['status']+"'  value='"+this['cardName']+"'>"+this['cardName']+"</option>");
                    });
                }
            });
            
            $('#card_name').trigger('chosen:updated');
        }
	  
    $("#card_name").change(function(){
        if($(this).find(":selected").hasClass("DOWN")){
            alert("Selected option is currently unavailable. Select another payment option or try again later.");
        }
        if($(this).find(":selected").hasClass("CCAvenue")){
            $("#data_accept").val("Y");
        }else{
            $("#data_accept").val("N");
        }
    });
    
    function ValidateString(e) {
        e = e || window.event;
        var bad = /[^\sa-z\d]/i,
            key = String.fromCharCode( e.keyCode || e.which );   
 
        if ( e.which !== 0 && e.charCode !== 0 && bad.test(key) ) {
            e.returnValue = false;
            if ( e.preventDefault ) {
                e.preventDefault();
            }
        } 
     }
     
   function ValidateNumber(evt) {
      
        evt = evt || window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
             evt.returnValue = false;
             if ( evt.preventDefault ) {
                    evt.preventDefault();
             }
        }
        return true;
     }  

// saurabh         
function addRequired(elem){
    if(elem.indexOf('[]') > -1){
        elem = elem.replace('[]', '');
    }
    
    var index = required_fields.indexOf(elem);
    if(index<0){
        required_fields.push(elem);
    }
    required_fields = removeDuplicates(required_fields);
    $.each(required_fields, function( index, value ) {
        var errorClass = 'span_req_star_'+value;
        $('.'+errorClass).html('*');
    });
}

function addRequiredTableElms(elem){
    jQuery('.'+elem+' [type=text],.'+elem+' select').each(function(index){
        if(jQuery(this).attr('name') !== undefined && jQuery(this).attr('name').indexOf('other')<0){
            required_fields.push(jQuery(this).attr('name'));
        }
    });
    required_fields = removeDuplicates(required_fields);

    if(required_fields.length>0){
        $.each(required_fields, function( index, value ) {
            var cols_arr = value.match(/^(field_[0-9]+)_([0-9]+)_([0-9]+)$/);
            if(cols_arr != null && cols_arr.length>3){
                if(cols_arr[1] != null && typeof cols_arr[1] !='undefined' && cols_arr[3] != null && typeof cols_arr[3] !='undefined'){
                    var errorClass = 'span_req_star_col_'+cols_arr[1]+'_'+cols_arr[3];
                    $('.'+errorClass).html('*');
                }
                if(cols_arr[1] != null && typeof cols_arr[1] !='undefined' && cols_arr[2] != null && typeof cols_arr[2] !='undefined'){
                    var errorClass = 'span_req_star_row_'+cols_arr[1]+'_'+cols_arr[2];
                    $('.'+errorClass).html('*'); 
                }
            }
        });
    }
}

function removeRequired(elem){
    if(elem.indexOf('[]') > -1){
        elem = elem.replace('[]', '');
    }
   
    var index = required_fields.indexOf(elem);
    if(index>-1){
      required_fields.splice(index, 1);  
//      delete required_fields[index];
    }
    
    //Remove required (*)
    if($('.span_req_star_'+elem).length) {
        $('.span_req_star_'+elem).html('');
    }
    
}
function removeRequiredTableElms(elem){
    jQuery('.'+elem+' [type=text],.'+elem+' select').each(function(index){
        var ele = jQuery(this).attr('name');
        
        //if elem is undefined then return from here
        if(typeof ele === 'undefined') return;
        
        var index = required_fields.indexOf(ele);
        if(index>-1){
          required_fields.splice(index, 1);
          //delete required_fields[index];
        }
        
        //Remove required (*)
        var cols_arr = ele.match(/^(field_[0-9]+)_([0-9]+)_([0-9]+)$/);        
        if(cols_arr != null && cols_arr.length>3){
            if(cols_arr[1] != null && typeof cols_arr[1] !='undefined' && cols_arr[3] != null && typeof cols_arr[3] !='undefined'){
                var errorClass = 'span_req_star_col_'+cols_arr[1]+'_'+cols_arr[3];
                $('.'+errorClass).html('');
            }
            if(cols_arr[1] != null && typeof cols_arr[1] !='undefined' && cols_arr[2] != null && typeof cols_arr[2] !='undefined'){
                var errorClass = 'span_req_star_row_'+cols_arr[1]+'_'+cols_arr[2];
                $('.'+errorClass).html(''); 
            }
        }
        
    });
}


if (navigator.userAgent.match(/MSIE 9/) !== null) {
   

$(document).ready(function(){
    $('.navbar-toggle').click(function(event){
        event.stopPropagation();
         $("#menu-block").slideToggle("fast");
    });
    $(".navbar-toggle").on("click", function (event) {
        event.stopPropagation();
    });
});

$(document).on("click", function () {
    $("#menu-block").hide();
});

}
/*********************End of Function for applicant form submit steps************************/    


/**
 * google map address code
 */

    function checkLocationValidation(field_id){
        if(field_id=="google_correspondence_location"){
             if(($('#correspondence_city').length && $('#correspondence_city').val()=="") ||
                     ($('#correspondence_state').length && $('#correspondence_state').val()=="") ||
                      ($('#correspondence_country').length && $('#correspondence_country').val()=="")){
                    $('#otherError_google_correspondence_location').html("Unable to find your location.");
                    $('#otherError_google_correspondence_location').show();
             }
             else{
                 $('#otherError_google_correspondence_location').html("");
                 $('#otherError_google_correspondence_location').hide();
             }
           
        }
        else if(field_id=="google_permanent_location"){
             if(($('#permanent_city').length && $('#permanent_city').val()=="") ||
                     ($('#permanent_state').length && $('#permanent_state').val()=="") ||
                      ($('#permanent_country').length && $('#permanent_country').val()=="")){
                    $('#otherError_google_permanent_location').html("Unable to find your location.");
                    $('#otherError_google_permanent_location').show();
             }
             else{
                 $('#otherError_google_permanent_location').html("");
                 $('#otherError_google_permanent_location').hide();
             }
           
        }
    }

    function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    // var MACHINE_GOOGLE_PERMANENT_LOCATION define on submit/mobile_submit/preview
        if(jQuery('#'+MACHINE_GOOGLE_PERMANENT_LOCATION).length>0){

            autocomplete = new google.maps.places.Autocomplete(
                /** @type {!HTMLInputElement} */(document.getElementById(MACHINE_GOOGLE_PERMANENT_LOCATION)),
                {types: ['geocode']});

            // When the user selects an address from the dropdown, populate the address
            // fields in the form.
            autocomplete.addListener('place_changed', fillInAddress);
        }

        if(jQuery('#'+MACHINE_GOOGLE_CORRESPONDENCE_LOCATION).length>0){

            corres_autocomplete = new google.maps.places.Autocomplete(
                /** @type {!HTMLInputElement} */(document.getElementById(MACHINE_GOOGLE_CORRESPONDENCE_LOCATION)),
                {types: ['geocode']});

            // When the user selects an address from the dropdown, populate the address
            // fields in the form.
            corres_autocomplete.addListener('place_changed', fillInAddressCorrespondence);
        }

    }

      function fillInAddress() {
        // Get the place details from the autocomplete object.
        var place = autocomplete.getPlace();

        for (var component in componentForm) {
          document.getElementById(permanentMapElem[component]).value = '';
          document.getElementById(permanentMapElem[component]).disabled = false;
        }

        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        for (var i = 0; i < place.address_components.length; i++) {
          var addressType = place.address_components[i].types[0];
          if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            
            document.getElementById(permanentMapElem[addressType]).value = val;
          }
        }
        
        checkLocationValidation('google_permanent_location');
      }
      function fillInAddressCorrespondence() {
        // Get the place details from the autocomplete object.
        var place = corres_autocomplete.getPlace();

        for (var component in componentForm) {
          document.getElementById(correspondenceMapElem[component]).value = '';
          document.getElementById(correspondenceMapElem[component]).disabled = false;
        }

        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        for (var i = 0; i < place.address_components.length; i++) {
          var addressType = place.address_components[i].types[0];
          if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            
            document.getElementById(correspondenceMapElem[addressType]).value = val;
          }
        }
        
        checkLocationValidation('google_correspondence_location');
      }

      // Bias the autocomplete object to the user's geographical location,
      // as supplied by the browser's 'navigator.geolocation' object.
      function geolocate() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
              center: geolocation,
              radius: position.coords.accuracy
            });
            
//            if(typeof autocomplete != 'undefined')
              autocomplete.setBounds(circle.getBounds());
          
//            if(typeof corres_autocomplete != 'undefined')
                corres_autocomplete.setBounds(circle.getBounds());
          });
        }
      }

function alertPopupPref(msg,type,location) {
    
    if(type=='error'){
        var selector_parent     = '#ErrorPopupArea';
        var selector_titleID    = '#ErroralertTitle';
        var selector_msg        = '#ErrorMsgBody';
        var btn                 = '#ErrorOkBtn';
        var title_msg           = 'Error';
    }else if(type=='alert'){
        var selector_parent     = '#SuccessPopupArea';
        var selector_titleID    = '#SuccessPopupArea #alertTitle';
        var selector_msg        = '#MsgBody';
        var btn                 = '#OkBtn';
        var title_msg           = 'Alert';
    }else{
        var selector_parent     = '#SuccessPopupArea';
        var selector_titleID    = '#alertTitle';
        var selector_msg        = '#MsgBody';
        var btn                 = '#OkBtn';
        var title_msg           = 'Success';
    }

    $(selector_titleID).html(title_msg);
    $(selector_parent+" "+selector_msg).html(msg);
    $('.oktick').hide();
        
    if(typeof location != 'undefined'){
         $(btn).show();

        $(selector_parent).modal({keyboard:false}).one('click',btn,function(e){
            window.location.href=location;
        });
    }
    else{
        $(selector_parent).modal();
    }
}

function alertPopup(msg,type,location){
    
    if(type=='error'){
        var selector_parent     = '#ErrorPopupArea';
        var selector_titleID    = '#ErroralertTitle';
        var selector_msg        = '#ErrorMsgBody';
        var btn                 = '#ErrorOkBtn';
        var title_msg           = 'Error';
    }else if(type=='alert'){
        var selector_parent     = '#SuccessPopupArea';
        var selector_titleID    = '#SuccessPopupArea #alertTitle';
        var selector_msg        = '#MsgBody';
        var btn                 = '#OkBtn';
        var title_msg           = 'Alert';
    }else{
        var selector_parent     = '#SuccessPopupArea';
        var selector_titleID    = '#alertTitle';
        var selector_msg        = '#MsgBody';
        var btn                 = '#OkBtn';
        var title_msg           = 'Success';
    }

    $(selector_titleID).html(title_msg);
    $(selector_parent+" "+selector_msg).html(msg);
    $('.oktick').hide();
        
    if(typeof location != 'undefined'){
         $(btn).show();

        $(selector_parent).modal({keyboard:false}).one('click',btn,function(e){
            window.location.href=location;
        });
    }
    else{
        $(selector_parent).modal();
    }
}

//Allow only Aphabet and space
function onlyAlphabets(e, t) 
{
    try 
    {
        if (window.event) {
            var charCode = window.event.keyCode;
        }
        else if (e) {
            var charCode = e.which;
        }
        else { 
            return true; 
        }
        
        if ((charCode == 8) || (charCode == 32) || (charCode == 46))
        {    
            return true;                    //allow space/backspace/delete key
        }
        else if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123))
        {    
            return true;
        }
        else
        {
            return false;
        }
    }
    catch (err) {
        alertPopup(err.Description,'error');
    }
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
   
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}


$(function(){
    
//Contact form submit function
$(document).on('click', '#contactBtn', function () {
    $("span.help-block").text('');
    $.ajax({
        url: jsVars.ContactUrl,
        type: 'post',
        data: $("form#contactForm").serialize(),
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
        	$('#contact-us-final div.loader-block').show();
	},
        complete: function() {
		$('#contact-us-final div.loader-block').hide();
        },
        success: function (json) {

            if (json['redirect'])
            {
                location = json['redirect'];
            }
            else if (json['error'])
            {
                if (json['error']['msg'])
                {
                    alertPopup(json['error']['msg'],'error');
                }
                else if (json['error']['list'])
                {
                    for (var i in json['error']['list'])
                    {
                        var parentDiv = $("form#contactForm #" + i).parents('div.form-group');
                        //alert(parentDiv.html());
                        $(parentDiv).addClass('has-error');
                        $(parentDiv).find("span.help-block").text(json['error']['list'][i]);
                    }
                }
            }
            else if (json['success'] == 200)
            {
                $("span.help-block").text('');
                $("div.form-group").removeClass('has-error');
                $(".npf-close").trigger('click');
                $("#reset-link-sent .modal-title").text("Thankyou");
                $("#reset-link-sent p#MsgBody").text(json['msg']);
                $("#SuccessLink").trigger('click');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#contact-us-final div.loader-block').hide();
        }
    });
});
});


function showMobileHeader()
{
    jQuery(".showhidemobile").fadeIn(); 
     jQuery(".inlineBlockFull").removeClass("zeromargin"); 
     jQuery(".login-common").removeClass("loginmargin"); 
     jQuery(".fixedshowicon").fadeOut();
}


function createCookie(name,value,days) {
    if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}
/* for set tab on form dashboard */
jQuery(function(){
    jQuery('#online-admission-management-system #nav-tabs li a').click(function(){
        var tabnum = jQuery(this).attr('href');
        createCookie('tabnum',tabnum,1);
    });
    var tabnum = readCookie('tabnum');
    if(typeof tabnum != 'undefined' && tabnum!=""){
        $('#online-admission-management-system #nav-tabs li a[href="'+tabnum+'"]').tab('show');
    }
});

          
function tableYearCondition(){
    
    var educationObj={
        'field_10_pass_year':"NA",
        'field_12_pass_year':"NA",
        'field_diploma_year_of_passing':"NA",
        'field_graduation_pass_year':"NA",
        'field_pg_year_of_passing':"NA",
        'field_phd_year_of_passing':"NA"
    };
//    var educationErrorArray=["10th","12th","diploma","graduation","post graduation","phd"];
    
    if(typeof field_phd_year_of_passing != "undefined"){
        educationObj.field_phd_year_of_passing=(getTimeByFieldId(field_phd_year_of_passing));
    }
    
    if(typeof field_pg_year_of_passing != "undefined"){
        educationObj.field_pg_year_of_passing=(getTimeByFieldId(field_pg_year_of_passing));
    }
    
    if(typeof field_graduation_pass_year != "undefined"){
        educationObj.field_graduation_pass_year=(getTimeByFieldId(field_graduation_pass_year));
    }
    
    if(typeof field_diploma_year_of_passing != "undefined"){
        educationObj.field_diploma_year_of_passing=(getTimeByFieldId(field_diploma_year_of_passing));
    }
    
    if(typeof field_12_pass_year != "undefined"){
        educationObj.field_12_pass_year=(getTimeByFieldId(field_12_pass_year));
    }
    
    if (typeof field_10_pass_year != "undefined"){
        educationObj.field_10_pass_year=(getTimeByFieldId(field_10_pass_year));
    }
    
    var flag=false;
    var eduValues=Object.values(educationObj);
    var eduKeys=Object.keys(educationObj);
    var i,j,k;
    for (i = 0; i < eduValues.length; i++){
        if(eduValues[i]!="NA" && eduValues[i]!=-1){
            k = (i==1)?i+2:i+1;
            for(j=k;j<eduValues.length;j++){
                if(eduValues[j]!="NA" && eduValues[j]!=-1 && eduValues[i] > eduValues[j]){
                    showErrorOnField(eval(eduKeys[j]),"Please Enter Valid Year of Passing.");
                    flag=true;
                }
            }
        }
    }
   return flag;
}

function selectDropDownValue(selected_value,field_id){
    if(typeof selected_value !='undefined' && selected_value!=''){
        var result = selected_value.split('|||');
        for(i=0;i<result.length;i++){
            if(result[i]!=""){
                taxIdArr=result[i].split(';;;');
                // other case
                var otherOption = taxIdArr[0].split('|');
                if(otherOption.length>1 && taxIdArr[0].indexOf('Other')>-1){
                    $('#'+field_id+' option[value="Other"]').prop("selected",true);
                }
                else{
//                $('#'+field_id+' option[value*="'+taxIdArr[0]+';;;"]').attr("selected","selected");
                    $('#'+field_id+' option[value*="'+taxIdArr[0]+';;;"]').prop("selected",true);
                }
            }
        }
    }
}

/*
 * here collegeId and formId is added to disabled/Enabled options of gdpi venue 
 * if gdpi venue reached its maximum capacity
 */
function LoadCategoryByKey(key, field_id, selected_value, place_holder,collegeId,formId, ...args){
    
    var getParentKey = '';
    var currentValue = '';
    var asyncValue = true;
    if(typeof args[0] !== 'undefined' && args[0]=='skipHit') {
        
        if(typeof $('#'+field_id).attr('disabled') !== 'undefined' && $('#'+field_id).attr('disabled') == 'disabled') {
            return false;
        }
        
        asyncValue = false;
        //Count TOtal Option in Dropdown
        var totalOption = parseInt($("#"+field_id+' > option[value!=""]').length);
        
        //if totalOption > 1 then All option is loaded
        if(totalOption > 1) {
            return false;
        } 
        
        var option = $('<option></option>').attr("value", "").text("Loading...");
        $("#"+field_id).empty().append(option);
        $('#'+field_id).trigger('chosen:updated');
        
        if(typeof args[1] !== 'undefined' && args[1] == 'getParentKey') {
            getParentKey = 1;
        }
        
        if(typeof args[2] !== 'undefined' && args[2] !== '') {
            currentValue = args[2];
        }
    }
    
    if(typeof FORM_SUBMIT_STATUS =='undefined' || FORM_SUBMIT_STATUS == null){
        FORM_SUBMIT_STATUS = 0;
    }
    
    if(typeof collegeId == "undefined" || collegeId =='' || collegeId == '0'){
        collegeId = 0;
    }
    if(typeof formId == "undefined" || formId =='' || formId == '0'){
        formId = 0;
    }
    if(formId == 0 && typeof jsVars.form_id !='undefined'){
        formId = jsVars.form_id;
    }
                 //$('#error_div').hide();
                 if(key=="") return false;
                     $.ajax({
                      url: '/common/get-category',
                      //url: college_slug+'/common/get-city',
                      type: 'post',
                      dataType: 'html',
                      async: asyncValue,
                      //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
                      data: {
                          "key": key,
                          "field_id": field_id,
                          "selected_value":selected_value,
                          "place_holder":place_holder,
                          "collegeId":collegeId,
                          "formId":formId,
                          "getParentKey":getParentKey,
                          "cf":"applicant-form",
                          "submit_status" : FORM_SUBMIT_STATUS
                      },
                      headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                      success: function (data) {
                          if(data!=""){
                              if($("#" + field_id + "_read_only").length ) {
                                  field_id = field_id + "_read_only";
                              }
                            if(typeof $('#'+field_id).attr('multiple') != 'undefined' && $('#'+field_id).attr('multiple') !=='' && $('#'+field_id).attr('multiple') == 'multiple'){
                                data = data.replace("<option value=''>Select</option>",'');
                            }
                            $('#'+field_id).html(data);
                            
                            selectDropDownValue(selected_value,field_id);
                            
                            if($("#" + field_id + "[multiple]").length && $('#'+field_id).children('option').length && $('#'+field_id).children('option:first').val()=='' && $('#'+field_id).hasClass('chosen-select')){
                                $('#'+field_id).children('option:first').attr('disabled',"disabled");
                            }
                            
                            //if value is not empty then set the value selected
                            if(currentValue !== '') {  
                                
                                //In case of same address as permanent then dont select value                                
                                if(typeof permanent_country !== 'undefined' && permanent_country == field_id &&
                                   typeof MACHINE_NPF_ADDRESS !== 'undefined' && $("input:radio[name="+MACHINE_NPF_ADDRESS+"]").length && 
                                   $('input[name="'+MACHINE_NPF_ADDRESS+'"]:checked').val() =='No') {
                                    
                                } else {                                
                                
                                    $("#"+field_id+' > option[value="'+currentValue+'"]').attr('selected','selected');
                                }
                            }
                            try{
                                if($('.chosen-select').length > 0){
                                    $('.chosen-select').trigger('chosen:updated');
                                }
                            }catch(error) {}
                            
                            

                            try{

                                if($('.sumo-select-new').length>0){

                                    var dropValue = [];
                                    if(typeof $('#'+field_id).data('append') !='undefined' && $('#'+field_id).data('append') == 'yes'){
                                        
//                                      $('#'+field_id).children('option').attr('disabled',"disabled");
                                        $(".preview_missing_fields #"+field_id +" option:selected" ).each(function() {
                                          $(this).prop('disabled',true);
                                          dropValue.push($(this).text());
                                        });
                                    }
                                    $('.sumo-select-new').each(function(i,j){
                                        $('.sumo-select-new')[i].sumo.reload();
                                    });
                                    
                                    setTimeout(function(){
                                        if(dropValue.length>0){
                                            $('.sumo_'+field_id+' .CaptionCont span.placeholder').html(dropValue.join(', '));
                                        }
                                    },800);
                                    
                                }
                                
                                if(typeof $('.preview_missing_fields #'+field_id).data('append') !='undefined' && $('.preview_missing_fields #'+field_id).data('append') == 'yes'){
                                    $(".preview_missing_fields #"+field_id +" option:selected" ).each(function() {
                                        $(this).prop('disabled',true);
                                    });
                                }
                            }catch(error) {}

                            //In case of skipHit Again Retrigger below function
                            if (typeof args[0] !== 'undefined' && args[0]=='skipHit') { 
                                if(typeof customScriptAutoload == 'function') {
                                    customScriptAutoload();
                                }
                                
                                if(typeof custom_script == 'function') {
                                    custom_script();
                                }
                            }
                         }
                          //console.log(data);
                      },
                      error: function (xhr, ajaxOptions, thrownError) {
                          //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                          console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                      }
                  });
    }
    
    function LoadChildCategory(field_id, dependent_field_id, selected_value,place_holder,parent_value, ...args){
                 //$('#error_div').hide();
        if(typeof args[0] !== 'undefined' && args[0]=='skipHit') {
            //Count TOtal Option in Dropdown
            var totalOption = parseInt($("#"+dependent_field_id+' > option[value!=""]').length);
                        
            //if totalOption > 1 then All option is loaded
            if(totalOption > 1) {
                return false;
            }
            
            

            var option = $('<option></option>').attr("value", "").text("Loading...");
            $("#"+dependent_field_id).empty().append(option);
            $('#'+dependent_field_id).trigger('chosen:updated');
        }
        
        $("#"+dependent_field_id+' > option[value!=""]').remove();
        
        var formId= 0;
        var parent_id=$('#'+field_id).val();
         if(parent_id=="") {
             parent_id=parent_value;
         }
        if(typeof jsVars.form_id !='undefined'){
            formId = jsVars.form_id;
        }
        
        if(typeof FORM_SUBMIT_STATUS =='undefined' || FORM_SUBMIT_STATUS == null){
            FORM_SUBMIT_STATUS = 0;
        }
        
        //do dependent other field input value empty if parent dropdown value is changed
        if ((parent_value == '') && (place_holder == 'Select') && (typeof selected_value != 'undefined') && (selected_value == '') && 
            ($('input[name = \'other_' + dependent_field_id + '\']').length > 0)) {
            $('input[name = \'other_' + dependent_field_id + '\']').val("").hide();
        }
        
        if(formId == 2644) {
            ajaXUrl = '/common/get-child-category-new';
        }
        else {
            ajaXUrl = '/common/get-child-category';
        }
    
                    $.ajax({
                        url: ajaXUrl,
                      //url: college_slug+'/common/get-city',
                      type: 'post',
                      dataType: 'html',
                      //async:false,
                      //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
                      data: {
                          "parent_id": parent_id,
                          "field_id": field_id,
                          "selected_value":selected_value,
                          "place_holder":place_holder,
                          "formId":formId,
                          "dependent_field_id":dependent_field_id,
                          "cf":"applicant-form",
                          "submit_status" : FORM_SUBMIT_STATUS
                      },
                      headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                      success: function (data) {
                         var count= (data.match(/<option/g) || []).length;
                        
                          if(data!="" && count > 1){
                                if($("#" + dependent_field_id + "_read_only").length ) {
                                    dependent_field_id = dependent_field_id + "_read_only";
                                }

                                if(typeof $('#'+dependent_field_id).attr('multiple') != 'undefined' && $('#'+dependent_field_id).attr('multiple') !=='' && $('#'+dependent_field_id).attr('multiple') == 'multiple'){
                                data = data.replace("<option value=''>Select</option>",'');
                            }
                                 $('#'+dependent_field_id).html(data);                                 
                                 selectDropDownValue(selected_value,dependent_field_id);
                                 $('div.'+dependent_field_id).fadeIn();
                         }
                         else{
                               $('div.'+dependent_field_id).hide();
                         }
                          $('.chosen-select').trigger('chosen:updated');
                            try{
                                if($('.sumo-select-new').length>0){
                                    $('.sumo-select-new').each(function(i,j){
                                        $('.sumo-select-new')[i].sumo.reload();
                                    });
                                }
                            }catch(error) {}

                          //console.log(data);
                          
                            //In case of skipHit Again Retrigger below function
                            if (typeof args[0] !== 'undefined' && args[0]=='skipHit') { 
                                if(typeof customScriptAutoload == 'function') {
                                    customScriptAutoload();
                                }

                                if(typeof custom_script == 'function') {
                                    custom_script();
                                }
                            }
                      },
                      error: function (xhr, ajaxOptions, thrownError) {
                          //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                          console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                      }
                  });
    }
    
    
    function LoadCategoryByKeyForTable(key, place_holder,field_id, ...args){
        
        var currentValue= '';
        if(typeof args[0] !== 'undefined' && args[0]=='skipHit') {
            
            //In disable Case dont trigger Ajax Event
            if(typeof $('#'+field_id).attr('disabled') !== 'undefined' && $('#'+field_id).attr('disabled') == 'disabled') {
                return false;
            }
            
           
            
            //asyncValue = false;
            //Count TOtal Option in Dropdown
            var totalOption = parseInt($("#"+field_id+' > option[value!=""]').length);
            
            //if totalOption > 1 then All option is loaded
            if(totalOption > 1) {
                return false;
            } 

            var option = $('<option></option>').attr("value", "").text("Loading...");
            $("#"+field_id).empty().append(option);
            $('#'+field_id).trigger('chosen:updated');

            if(typeof args[2] !== 'undefined' && args[2] !== '') {
                currentValue = args[2];
            }
        }
        
        selected_value = '';
        if(typeof $('#'+field_id).val() != 'undefined'){
            selected_value = $('#'+field_id).val();
        }
        
        if(typeof FORM_SUBMIT_STATUS =='undefined' || FORM_SUBMIT_STATUS == null){
            FORM_SUBMIT_STATUS = 0;
        }
    
        var formId = 0;
        if(typeof jsVars.form_id !='undefined'){
            formId = jsVars.form_id;
        }
        if(typeof field_id =='undefined'){
            field_id = 0;
        }
                 //$('#error_div').hide();
                 if(key=="") return false;
                     $.ajax({
                      url: '/common/get-category',
                      //url: college_slug+'/common/get-city',
                      type: 'post',
                      dataType: 'html',
                      //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
                      data: {
                          "key": key,
                          "for_table": "1",
                          "selected_value":selected_value,
                          "place_holder":place_holder,
                          "formId":formId,
                          'field_id':field_id,
                          "cf":"applicant-form",
                          "submit_status" : FORM_SUBMIT_STATUS
                      },
                      headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                      success: function (data) {
                          if(data!=""){
                                if(typeof args[0] !== 'undefined' && args[0]=='skipHit') {
                                    $("#"+field_id).html(data);
                                } else {
                                    $('.table_'+key+ " select").html(data);
                                }
                                 SetTableValues();
                                 
                                 //if value is not empty then set the value selected
                                if(currentValue !== '') {                                
                                    $("#"+field_id+' > option[value="'+currentValue+'"]').attr('selected','selected');
                                }
                                $('.chosen-select').trigger('chosen:updated');
                                
                                //If chosen class exist then update dropdown
                                if(typeof args[0] !== 'undefined' && args[0]=='skipHit' && $("#"+field_id).hasClass( "chosen-select" ) === true) {
                                    $('#'+field_id).trigger('chosen:updated');
                                }
                                if(typeof args[0] !== 'undefined' && args[0]=='skipHit' && $("#"+field_id).hasClass( "sumo-select-new" ) === true) {
                                    try{
                                        $('#'+field_id)[0].sumo.reload();
                                    }
                                    catch(error){}
                                }
                                
                                //In case of skipHit Again Retrigger below function
                                if (typeof args[0] !== 'undefined' && args[0]=='skipHit') { 
                                    if(typeof customScriptAutoload == 'function') {
                                        customScriptAutoload();
                                    }

                                    if(typeof custom_script == 'function') {
                                        custom_script();
                                    }
                                }
                         }
                        
                      },
                      error: function (xhr, ajaxOptions, thrownError) {
                          //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                          console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                      }
                  });
    }
    function toggleChevron(e) {
    $(e.target)
        .prev('.panel-heading')
        .find("i.indicator")
        .toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
}
$('#accordion').on('hidden.bs.collapse', toggleChevron);
$('#accordion').on('shown.bs.collapse', toggleChevron);



function showHideDashboardForm(catid){
    $('#nav-tabs li').removeClass('active');
    $('#li_'+catid).addClass('active');
    $('table tbody tr').hide();
    $("table.course-wise-applications tbody tr").show();
    $('tr.category_form_'+catid).fadeIn();
    if($("#slabbanner").length > 0){
        if(catid==62){
            $("#slabbanner").hide();
        }else{
            $("#slabbanner").show();
        }
    }
    createCookie('dashboard_tab_select',catid,30);
}

function AutoRediect(url){
    setTimeout("window.location.href='"+url+"'",5000);
}

function parseDateIntoSecs(val,format){
    return_date_secs=0;
    if(val!=""){
        var split_date=val.split("/");
        if(format=="DD/MM/YYYY"){
            return_date_secs=(new Date(split_date[1]+"/"+split_date[0]+"/"+split_date[2]+" 00:00:00"))/1000;
        }
        else if(format=="MM/YYYY"){
             return_date_secs=(new Date(split_date[0]+"/01/"+split_date[1]+" 00:00:00"))/1000;
        }
    }
    
    //console.log(return_date_secs);
    return return_date_secs;
}

function getDateIntoSeconds(date){
    if(typeof date=="undefined" || date==''){
        return 0;
    }
    date = convertDateToHyphenFormat(date);
    date = new Date(date);
    return date.getTime();
}

function getDynamicFeeByFormIdPreview(id){
    
    if(typeof jsVars.EnableUserDynamicFee == 'undefined' || jsVars.EnableUserDynamicFee==0){
        return false;
    }
    
    if($('#save_data_'+id).length>0){
    var data = $('#save_data_'+id).serialize();
    $.ajax({
        url: college_slug+'/form/get-dynamic-fee-formid/',
        type: 'post',
        dataType: 'json',
        data:data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if (json['redirect']){
                location = json['redirect'];
            }
            else if (json['error']){
//                console.log(json['error']);
            }
            else if (json['success'] == 200){
                if (json['dynamic_fee'] >=0) {
                    $("#form_price_h2").show();
                    if(typeof json['dynamic_fee_with_currency'] !=="undefined" && json['dynamic_fee_with_currency']!==''){
                        $("#dynamic_field_amt").html(json['dynamic_fee_with_currency']);
                    }else{
                        $("#dynamic_field_amt").html(json['dynamic_fee']);
                    }
                } else if (json['dynamic_fee'] == '-') {
                    $("#form_price_h2").show();
                    $("#dynamic_field_amt").html(json['dynamic_fee']);
                }else if(typeof json['integral_fee'] !=="undefined" && json['integral_fee']=="1"){
                    $("#form_price_h2").hide();
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    }
}

function DeleteUploadedFileOnHide(){
    hidden_file_ids = [];
    $('#save_data').find('div.file').each(function(){
        //var html_class = $(this).attr('class');
//        var html_displ = $(this).attr('class');
        //console.log(html_class);
        
        if(!$(this).is(":visible")){
            var html_id = $(this).find('input').attr('id');
            hidden_file_ids.push(html_id);
        }
    });
    
//    console.log(hidden_file_ids);    
}

function getFormattedDateDiff(date1, date2) {
    var b = moment(date1),
        a = moment(date2),
        intervals = ['months','days'],
        out = [],
        dayLabel = { one: 'day', other: 'days' };

        
    for(var i=0; i<intervals.length; i++){
        var diff = a.diff(b, intervals[i]);
        b.add(diff, intervals[i]);
        out.push(diff);
    }
    var yearsAndMonth="";
    if(out[0]>0){
        //call because of calculation issue with moment library in case of leap day year only
        yearsAndMonth += getMonthsInYearsAndMonths(out[0]);              
    }
    var addComma=(yearsAndMonth!='')?' , ':'';
    if(out[1]>0){
        yearsAndMonth += addComma+out[1]+" "+getPlural(out[1],dayLabel);
    }
    return yearsAndMonth;
}

function getPlural(number, word) {
    return number === 1 && word.one || word.other;
}
    
function getMonthsInYearsAndMonths(monthCount) {
    var months = { one: 'month', other: 'months' },
        years = { one: 'year', other: 'years' },
        m = monthCount % 12,
        y = Math.floor(monthCount / 12),
        result = [];

    y && result.push(y + ' ' + getPlural(y, years));
    m && result.push(m + ' ' + getPlural(m, months));
    return result.join(' , ');
}

function convertDateToHyphenFormat(date){
    if(typeof date=="undefined" || date==""){
        return 0;
    }
    var dateArray=[];
    dateArray=date.split("/");
    if(dateArray.length==3){
        return dateArray[2]+"-"+dateArray[1]+"-"+dateArray[0];
    }else if(dateArray.length==2){
        return dateArray[1]+"-"+dateArray[0]+"-01";
    }else if(dateArray.length==1){
        return dateArray[0]+"-01-01";
    }else{
        return 0;
    }
}

function date_to_ymd_leap_year(dateFieldIds){
    
    if(dateFieldIds.length!=2){
        return false;
    }
    var cd1=convertDateToHyphenFormat(($("#"+dateFieldIds[0]).val()));
    var cd2=convertDateToHyphenFormat(($("#"+dateFieldIds[1]).val()));
    var d1=new Date(cd1);
    var d2=new Date(cd2);
    return getFormattedDateDiff(d2, d1);
}

function seconds_to_ymd(seconds, detail) {
  // Return a string containing the number of years, days, hours,
  // minutes, and seconds in the given numeric seconds argument.
  // The optional detail argument can limit the about of detail.
  // Note: 1 year is treated as 365.25 days to approximate "leap
  // years" TAGS: secToYMDHMS, secToDHMS
  //
  // Some Examples:
  // 
  // fmt_duration(35000000)
  // returns "1 year, 39 days, 20 hours, 13 minutes, 20 seconds"
  //
  // fmt_duration(24825601)
  // returns "287 days, 8 hours, 1 second"
  //
  // fmt_duration(24825601, 3)
  // returns "287 days, 8 hours"
  //
  // fmt_duration(24825601, 1)
  // returns "less than one year"
  // 
  "use strict";
  var labels = ['years','months','days', 'hours', 'minutes', 'seconds'],
    increments = [31557600,2629800, 86400, 3600, 60, 1],
    result = "",
    i,
    increment,
    label,
    quantity;
  detail = detail === undefined ? increments.length : detail;
  detail = Math.min(detail, increments.length);

  for (i = 0; i < detail; i += 1) {
    increment = increments[i];
    label = labels[i];

    if (seconds >= increment) {
      quantity = Math.floor(seconds / increment);
      if (quantity === 1) {
        // if singular, strip the 's' off the end of the label
        label = label.slice(0, -1);
      }
      seconds -= quantity * increment;
      result = result + " " + quantity + " " + label + ",";
    }
  }

  result = result.slice(1, -1);
  if (result === "") {
    result = "less than one " + labels[detail - 1].slice(0, -1);
  }

  return result;
}

function CheckDecimalPlaces() {
    var flag=false;
    var arr_length = decimal_fields.length;
    if(arr_length>0){
        for (var i = 0; i < arr_length; i++) {
            field_id = decimal_fields[i];
            if(field_id!=""){
                var dc_num = parseInt(decimal_counts[i]);
                $('#otherError_'+field_id).hide();
                var val=$('#'+field_id+'[name=\''+field_id+'\']').val();                
                var dc_val = countDecimalPlaces(val);
                if(dc_val>dc_num){
                    flag=true;
                    $('#requiredError_'+field_id).hide();
                    $('#otherError_'+field_id).show();
                    $('#otherError_'+field_id).html("Maximum "+dc_num+" places of decimal.");
                    makeTableBorderRed(field_id);
                    scrollToField(field_id);
                }
            }
        }
    }
    return flag;
}

function countDecimalPlaces(value){
    
    if(typeof value != 'undefined' && value !=''){
        
    //  var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    //  if (!match) { return 0; }
    //  return Math.max(
    //       0,
    //       // Number of digits right of decimal point.
    //       (match[1] ? match[1].length : 0)
    //       // Adjust for scientific notation.
    //       - (match[2] ? +match[2] : 0));

        if(Math.floor(value) === value) return 0;
        var match = value.toString().split(".");
        return match[1]?match[1].length:0;
    }
}



function getFormDynamicName(){
            var form_id = $('form:first input[name="form_id"]').val();
            $.ajax({
            url: college_slug+'/form/get-form-title/',
            type: 'post',
            dataType: 'json',
            //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
            data:'form_id='+form_id,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
			beforeSend: function () {
				$('.loader-block').show();
			},
			complete: function () {
				$('.loader-block').hide();
			},
            success: function (data) {
               line_1_text=data["line_1_text"];
               line_2_text=data["line_2_text"];
               //console.log(line_2_text)
                if(line_1_text!='' || line_2_text!=''){
                    $('#form_heading_title').html(""+line_1_text+"<br>"+line_2_text);
                }
                return false;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
 }
 
 /*******This is for mobile only ***************/
 $('.collapse').on('shown.bs.collapse', function(){
    $(this).parent().find(".glyphicon-chevron-down").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
    $(this).parent().find(".panel-heading").css("border","0px solid #ff0000");
}).on('hidden.bs.collapse', function(){
$(this).parent().find(".glyphicon-chevron-up").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
});
/**********************/

function makeTableBorderRed(field_id){
    
    var field_part = field_id.split('_');
    if(field_part.length>3){ // only for tables
        field_part.pop();
        var field_id_str = field_part.join('_');
        if($('#headingOne'+field_id_str).length>0){
            $('#headingOne'+field_id_str).css("border","2px solid #ff0000");
        }else{
            $('#'+field_id).addClass("error_td");
        }
    }
}
$('.table-for-ticket').on('click', 'tbody tr', function(event) {
    $(this).addClass('highlight').siblings().removeClass('highlight');
});


function applicationSubmit(){

    
    $('#ConfirmMsgBody').html('Are you sure to submit application?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $('#loaderas').show();
        var act = $('#applicationSubmit').attr('action');
        $.ajax({
            url: '/form/application-submit',
            type: 'post',
            dataType: 'json',
            data:$('#applicationSubmit').serializeArray(),
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (json) {
                $('#loaderas').hide();
//                console.log(json);
                if(typeof json['redirect'] !='undefined' && json['redirect']!=''){
                    window.location = json['redirect'];
                }else if(typeof json['error']!='undefined' && json['error']!=''){
                    alertPopup(json['error'],'error');
                    
                }else if(typeof json['success']!='undefined' && json['success']=='200'){
                    alertPopup('Aplication Successfully submitted.','success',act);
                }
                
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
//                $('#loaderas').hide();
            }
        });
        $('#ConfirmPopupArea').modal('hide');
    });
    return false;
}

/** Crop Image Script Start **/
/**
 * display modal popup call by form/getfile
 * @param int fileId
 * @param string filePath
 * @param string fileName
 * @returns {Boolean}
 */
function CropImage(fileId,filePath,fileName){
    $('.loader-block').show();
    
    $.ajax({
        url: '/common/crop-student-image',
        type: 'post',
        dataType: 'html',
        data:{
            fileId  :fileId,
            filePath:filePath,
            fileName:fileName
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (html) {
            /* assign html to modal */
            $('#ActivityLogPopupArea .modal-title').html('Crop Image');
            $('#ActivityLogPopupHTMLSection').html(html);
            //$('#ActivityLogPopupArea .modal-content').css('width','550px');
            loadCropScript();
            $('#ActivityLogPopupArea').modal({backdrop: 'static', keyboard: false});
            $('.loader-block').hide();
            /** initalize crop script to modal **/
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('.loader-block').hide();
        }
    });
    return false;
}
/**
 * image cropper defined code
 * @returns {undefined}
 */
function loadCropScript() {
      if($('#pictureImage').length>0){
      var $image = $('#pictureImage');
      var minAspectRatio = 0;
      var maxAspectRatio = 1;

      $image.cropper({
        ready: function () {
          var containerData = $image.cropper('getContainerData');
          var cropBoxData = $image.cropper('getCropBoxData');
          var aspectRatio = cropBoxData.width / cropBoxData.height;
          var newCropBoxWidth;

          if (aspectRatio < minAspectRatio || aspectRatio > maxAspectRatio) {
            newCropBoxWidth = cropBoxData.height * ((minAspectRatio + maxAspectRatio) / 2);

            $image.cropper('setCropBoxData', {
              left: (containerData.width - newCropBoxWidth) / 2,
              width: newCropBoxWidth
            });
          }
        },
        cropmove: function () {
          var cropBoxData = $image.cropper('getCropBoxData');
          var aspectRatio = cropBoxData.width / cropBoxData.height;

          if (aspectRatio < minAspectRatio) {
            $image.cropper('setCropBoxData', {
              width: cropBoxData.height * minAspectRatio
            });
          } else if (aspectRatio > maxAspectRatio) {
            $image.cropper('setCropBoxData', {
              width: cropBoxData.height * maxAspectRatio
            });
          }
        },
        crop: function (e) {
            var json = [
                  '{"x":' + e.x,
                  '"y":' + e.y,
                  '"height":' + e.height,
                  '"width":' + e.width,
                  '"rotate":' + e.rotate + '}'
                ].join();

            $('#avatar_data').val(json);
          }
      });
      
    }
    }
/**
 * save cropped image ajax function
 * @returns {Boolean}
 */
    function cropStudentImageSave(){
        $('.loader-block').show();
        var file_id = $('#file_id').val();
        $.ajax({
            url: '/common/crop-student-image-save',
            type: 'post',
            dataType: 'json',
            data:$('#crop_form').serializeArray(),
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (json) {
               
                $('.loader-block').hide();
                if(typeof json['error'] !='undefined'){
                    $('#ActivityLogPopupArea').modal('hide');
                    alertPopup(json['errors'],'error');
                }else if(typeof json['message'] !='undefined' && json['message']!=''){
                    $('#crop_error').html(json['message']);
                }else{
                    $('#ActivityLogPopupArea').modal('hide');
                    /* display cropped image */
                    var d = new Date();
                    var src = json['result'];
                    $("#li_file_id_"+file_id+" img").attr("src",src+'?'+d.getTime());
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('.loader-block').hide();
            }
        });
       return false;
    }
    /** CROP IMAGE END**/
    
/**
 * 
 * This function is for repayment
 */
function saveRePayment(){
      $('#error_div').hide();
      $('#make_payment').attr("disabled","disabled");
      $('.loader-block').show();
        var data = $('#save_data').serializeArray();            
            $.ajax({
            url: college_slug+'/form/re-payment/'+current_page,
            type: 'post',
            dataType: 'html',                
            data: {
                "filled_data": data,
                "form_id" : jsVars.form_id,
                "type" : "payment"
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                if(data=="online"){
                    window.location.href= college_slug+'/payment/reprocess/'+current_page;
                    return false;
                }else if(data=="online_redirect"){
                    window.location.href= college_slug+'/payment/resuccess';
                    return false;
                }else{
                    $('#make_payment').removeAttr("disabled","disabled");
                    var split_content=data.split("||");
                    if(split_content[0]=="error"){
                        $('.loader-block').hide();
                        $('#error_div').show();
                        $('#error_div').html(split_content[1]);
                        return false;
                     }
                 } 
               
                                 
            },
            error: function (xhr, ajaxOptions, thrownError) {                    
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
}


// will be use in showing error on applicant form
function showError(field_id, errorText){
    $('.file-loader-block').hide();
    $('#requiredError_'+field_id).hide();
    $('#otherError_'+field_id).show();
    $('#otherError_'+field_id).html(errorText);
    $('#otherError_'+field_id).parent().addClass('has-error');
}

// this will remove error_td class under table fields when focus in on that field.
// added by Lalit
$("table tr td input, table tr td select" ).click(function() {
  $(this).removeClass("error_td");
});


// release no 8.10, adhoc task
// check the mobile fields is valid or not for all mobile values
function CheckMobileFields(){
    var flag=false;
    var arr_length = mobile_fields.length;
    for (var i = 0; i < arr_length; i++) {
       field_id=mobile_fields[i];
       error=0;
        // check field id exists on DOM or not.
        if(field_id!="" && ($('#'+field_id+'[name=\''+field_id+'\']').length > 0) &&  $.trim($('#'+field_id).val())!=""){
            // if dial code hidden field exists and India is not selected then if condition will work
            //alert($.trim($('#dial_code_'+field_id).val()));
            if($('#dial_code_'+field_id).length > 0 &&  $.trim($('#dial_code_'+field_id).val())!="+91"){
                max_length=16; // other than india
                min_length=6; // other than india
                start_chars=["0","1","2","3","4","5","6","7","8","9"];
            }else{
                max_length=10; // for india
                min_length=10; // for india
                start_chars=["9","8","7","6","5","4"];
            }
            var val=$('#'+field_id).val(); // get the mobile number
            // check the length of mobile number and also the start character for India numbers
            
             if(Math.floor(val) == val && $.isNumeric(val) && val.indexOf('.') == -1){
                if(val.length>max_length || val.length<min_length || 
                        (start_chars.length> 0 && jQuery.inArray(val.charAt(0), start_chars)<0)){                                error=1;
                } // val.length>max_length || val.length<min_length
            }else{
                   error=1;
            }
            
            if(error==1){
                flag=true; // if error found then flag is true
                $('#requiredError_'+field_id).hide();
                $('#otherError_'+field_id).show(); // show other error;
                $('#otherError_'+field_id).html("Invalid Mobile Number"); // set the error text
                $('div.'+field_id+' .form-group').addClass("has-error");  // add a material class
                makeTableBorderRed(field_id); // if it is table the  make the border red.
                scrollToField(field_id); // scroll to that field
            }
        }//$('#'+field_id).length > 0 &&  $.trim($('#'+field_id).val())!=""
    } // for loop
   return flag;
} // CheckMobileFields
 
 
// this function is used when there is mobile dial country code is selected in form applicant
function filter(field_id) {
    var value = $('#filter_'+field_id).val();
    value = value.toLowerCase();
    $("#ul_dial_code_"+field_id+" > li").each(function() {
        if ($(this).text().toLowerCase().search(value) > -1) {
            $(this).show();
        }else {
            $(this).hide();
        }
    });
} // function filter

$(document).ready(function(e){
    // this click is for dial code dropdown selection
    $( document ).on( 'click', '.bs-dropdown-to-select-group .dropdown-menu-list li', function( event ) {
        var $target = $( event.currentTarget );
            $target.closest('.bs-dropdown-to-select-group')
                    .find('[data-bind="bs-drp-sel-value"]').val($target.attr('data-value'))
                    .end()
                    .children('.dropdown-toggle').dropdown('toggle');
            $target.closest('.bs-dropdown-to-select-group')
            //.find('[data-bind="bs-drp-sel-label"]').text($target.context.textContent);
            .find('[data-bind="bs-drp-sel-label"]').text($target.attr('data-value'));   
   
            return false;
    }); // on click function
    // end of click of dial code selection
   
    emailFieldDNSSetup();  // suggestion for email whether DNS/MX is correct or not
}); // ready function

// check the mx record for email fields.
function checkEmailDNS(field_id){
    if($.trim($('#'+field_id).val()) == ''){
        return false;
    }
    //Call this ajax function
    $.ajax({
            url: '/common/check-email',
            type: 'post',
            dataType: 'json',
            //async: false,
            data:  'email='+$.trim($('#'+field_id).val()),        
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {            
            if(data == 'session_logout'){                
                window.location.href= college_slug+'/dashboard/';                           
            }
            
            if (typeof data['message'] !== 'undefined' && data['message']!='') {
                $('#requiredError_'+field_id).hide();
                $('#otherError_'+field_id).show();
                $('#otherError_'+field_id).html(data['message']);
                makeTableBorderRed(field_id);
                scrollToField(field_id);
                $('div.' + field_id + ' .form-group').addClass("has-error");
            }           
        },
        error: function (xhr, ajaxOptions, thrownError) {            
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });      
} // function checkEmailDNS

// Bind all email fields with on change method
function emailFieldDNSSetup(){
    if(typeof email_fields != 'undefined'){ //if email_fields is not undefined
        email_fields=cleanArray(email_fields);
        var arr_email_length = email_fields.length; // get the length of all email fields.
        if(arr_email_length>0){
            emailStr=email_fields.join(", #"); // make a string for multiple fields
            if(emailStr!=''){
                $(document).on('change', '#'+emailStr, function () { // initialize the method
                    checkEmailDNS(this.id);// ajax method to check the email is correct or not.
                });
            }
        }//arr_email_length>0
    }
} // function emailFieldDNSSetup

// this will remove all blank/empty values from an array
function cleanArray(actual) {
  var newArray = new Array();
  for (var i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

//End of release no 8.10

//8.9 - check whitelist chars alowed if set in form builder
/**
 * NPF-794
 * @returns {Boolean}
 */
function CheckWhiteListChars() {
    var flag = false;
    var arr_length = white_list_chars_field.length;
    for (var i = 0; i < arr_length; i++) {
        field_id = white_list_chars_field[i];
        
        if (field_id != "" && ($('#' + field_id+'[name=\''+field_id+'\']').length > 0) && $('#' + field_id).val() != "" && ( alphabet_fields.indexOf(field_id)>-1 ||  alphanumeric_field.indexOf(field_id)>-1 )) {  
            
            var pattern = '';
            var val = $('#' + field_id).val();
            var allowed = white_list_chars[i];
            if(alphabet_fields.indexOf(field_id)>-1){
                pattern  = '^[a-zA-Z_ '+allowed+']*$';
            }else if(alphanumeric_field.indexOf(field_id)>-1){
                pattern  = '^[a-zA-Z_0-9 '+allowed+']*$';
            }

            if(pattern!=''){
                var regEx = new RegExp(pattern, 'gi');
                if(val.search(regEx)<0){
                    flag = true;
                    $('#otherError_' + field_id).show();
                    $('#otherError_' + field_id).html("Invalid Data");
                    makeTableBorderRed(field_id);
                    scrollToField(field_id);
                }
            }
        }
    }
    return flag;
}
/**
 * user by consitional logic
 * @param {type} value
 * @param {type} array_value
 * @param {type} opr
 * @returns {Boolean}
 */
function compareArrayValue(value,array_value,opr){
    var flag = false;
    if(array_value.length>0){
    
    for (var i = 0; i < array_value.length; i++) {
        try {
            flag = eval(array_value[i]+opr+value);
        }
        catch(err) {
            // console.log(err)
        }

        if (flag) {
            return true;
        }
    }
    }
}
/**
 * @param array num
 * @returns {Array|removeDuplicates.out}
 */
function removeDuplicates(num) {
  var x,
      len=num.length,
      out=[],
      obj={};
 
  for (x=0; x<len; x++) {
    obj[num[x]]=0;
  }
  for (x in obj) {
    out.push(x);
  }
  return out;
}

function digicallnew(arg) {
    
    var returnText;
    $.ajax({
        url: college_slug+'/form/digi-file-upload',
        type: 'post',
        //async: false,
        dataType: 'json',
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        data: {"arg":arg, "college_id":dig_college_id, "form_id" :  dig_form_id},
        success: function (json) {
            if(typeof json['status'] != 'undefined' && json['status'] == 210) {
                var field_id = json['field_id'];
                $('#digi_'+field_id+' .digi-error,#digi_'+field_id+' span').remove();
                $('#'+field_id+ ' .digi-error').remove();
                var error = json['error'];
                var field_id = json['field_id'];
                $('#digi_'+field_id).append('<div class="digi-error">'+error+'</div>');
                returnText= 'FAILURE';
            } else if(typeof json['status'] != 'undefined' && json['status'] == 200) {
                var files = json['file_id'];
                var field_id = json['field_id'];
                $('#digi_'+field_id+' .digi-error,#digi_'+field_id+' span').remove();
                var max_upload_file = 1;
                var crop_enable = 0;
                ShowApplicantFiles(files, field_id,max_upload_file,crop_enable);
                $('#'+field_id).attr('data-file_status','already_upload');
                returnText= 'SUCCESS';
            }
           
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
       
    });
    return returnText;
}

function calcPayAmount(elem){
    ShowHidePaymentOption('Online');
    if($('#coupon_code').length>0 && $('#coupon_code').val()!=''){
        if($("#new_checkout_page").length){
            applyDiscountCoupon();
        }else{
            SaveCoupon();
        }
    }
    else{
        jsCalcConveyanceCharge();
    }
    return ;
}

function jsCalcConveyanceCharge(){

    $('#payment_info_div').html('');
    $('.loader-block').show();

    var pay_amount = $('#original_pay_amount').val();
    data=new Array(); 
    data.push({name:"form_id",value:jsVars.form_id});
    data.push({name:"pay_amount",value:pay_amount});

    if(typeof $('[name="payment_mode"]').val() !='undefined' && $('[name="payment_mode"]').val()!=''){
        var check_payment_mode = $('[name="payment_mode"]:checked').val();
        data.push({name:"check_payment_mode",value:check_payment_mode});
    }
    $.ajax({
        url: college_slug+'/form/calc-conveyance-charge',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {"X-CSRF-TOKEN": jsVars.csrfToken},
        success: function (data) {
            if(data == 'session_out'){
                window.location.href= college_slug+'/dashboard/';
                return false;
            }else{
                var split_content=data.split("||");
                if(split_content[0]=="error"){
                    $('.loader-block').hide();
                    $('#error_div').show();
                    $('#error_div').html(split_content[1]);
                    return false;
                }
                else  if(split_content[0]=="success"){
                    $('.loader-block').hide();
                    return_val=JSON.parse(split_content[1]);  
                    $('#fee_breakup').show();
                    $('.fee_breakup_div_parent').show();
                    $('#payment_info_div').html(return_val["paymentInfo"]);
                    if($('#pay_amount_online').length>0){
                        var extra_charge = 0;
                        if(typeof return_val["extra_charge"]!='undefined' && return_val["extra_charge"]!=''){
                            extra_charge = return_val["extra_charge"];
                        }
                        $('#pay_amount_online').val(parseFloat(return_val["new_payment_amount"])+parseFloat(extra_charge));
                    }
                    
                    if($('.FeeSyntax').length>0){
                        $('.application_fee_span').hide();
                    }
                    return false;
                }
            }
            //console.log(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return;
}


function calcCartPayAmount(){
//    ShowHidePaymentOption('Online');
    if($('#coupon_code').length>0 && $('#coupon_code').val()!=''){
        if($("#new_checkout_page").length){
            applyDiscountCoupon();
        }else{
            SaveCoupon();
        }
    }
    else{
        getPGCharges();
    }
    return ;
}

function getPGCharges(){

    $('#payment_info_div').html('');
    $('.loader-block').show();

    var pay_amount = $('#original_pay_amount').val();
    data=new Array(); 
    data.push({name:"form_id",value:jsVars.form_id});
    data.push({name:"pay_amount",value:pay_amount});

    if(typeof $('[name="payment_mode"]').val() !='undefined' && $('[name="payment_mode"]').val()!=''){
        var check_payment_mode = $('[name="payment_mode"]:checked').val();
        data.push({name:"check_payment_mode",value:check_payment_mode});
    }
    $.ajax({
        url: college_slug+'/form/calc-conveyance-charge',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {"X-CSRF-TOKEN": jsVars.csrfToken},
        success: function (data) {
            if(data == 'session_out'){
                window.location.href= college_slug+'/dashboard/';
                return false;
            }else{
                var split_content=data.split("||");
                if(split_content[0]=="error"){
                    $('.loader-block').hide();
                    alertPopup(split_content[1],'error');
//                    $('#error_div').show();
//                    $('#error_div').html(split_content[1]);
                    return false;
                }
                else  if(split_content[0]=="success"){
                    $('.loader-block').hide();
                    return_val=JSON.parse(split_content[1]);  
                    if($('#pay_amount_online').length>0){
                        var extra_charge = 0;
                        if(typeof return_val["extra_charge"]!='undefined' && return_val["extra_charge"]!=''){
                            extra_charge = return_val["extra_charge"];
                        }
                        $('#pay_amount_online').val(parseFloat(parseFloat(return_val["new_payment_amount"])+parseFloat(extra_charge)).toFixed(2));
                        $("#pay_amount_online_span").html($('#pay_amount_online').val());
                        
                        if($('#pgChargesSpan').length>0){
                            $("#pgChargesSpan").html(extra_charge);
                            $('#Online').show();
                            $('#Cash').hide();
                            $('#DD').hide();
                            $('#Voucher').hide();
                            if(parseFloat($('#pgChargesSpan').html()) > 0){
                                $("#onlinePgChargesDiv").show();
                            }else{
                                $("#onlinePgChargesDiv").hide();
                            }
                        }
                    }
                    
                    if($('.FeeSyntax').length>0){
                        $('.application_fee_span').hide();
                    }
                    return false;
                }
            }
            //console.log(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return;
}

function addFeeWithApplicationFee(element) {
    var baseAmount      = $(element).data("baseamount");
    var baseAmountOther = $(element).data("baseamount");
    
    var pgcharges       = $(element).data("pgcharges");
    
    var onlinetaxes     = $(element).data("onlinetaxes");
    var onlinetotal     = $(element).data("onlinetotal");
    
    var onlineconveyancecharges = $(element).data("onlineconveyancecharges");
    var otherconveyancecharges  = $(element).data("otherconveyancecharges");
    
    var onlinetaxes     = $(element).data("onlinetaxes");
    var onlinetotal     = $(element).data("onlinetotal");
    
    var othertaxes      = $(element).data("othertaxes");
    var othertotal      = $(element).data("othertotal");
    if($(element).is(":checked")){
        $("#onlineTotalItemsSpan").html( parseInt($('#onlineTotalItemsSpan').html()) + 1 );
        $("#ddTotalItemsSpan").html( parseInt($('#ddTotalItemsSpan').html()) + 1 );
        $('#onlineSubtotalSpan').html( parseFloat(parseFloat($('#onlineSubtotalSpan').html())+parseFloat(baseAmount)).toFixed(2));
        $('#onlineConveyanceChargesSpan').html( parseFloat(parseFloat($('#onlineConveyanceChargesSpan').html())+parseFloat(onlineconveyancecharges)).toFixed(2));
        $('#pgChargesSpan').html( parseFloat(parseFloat($('#pgChargesSpan').html())+parseFloat(pgcharges)).toFixed(2));
        $('#onlineTaxesSpan').html( parseFloat(parseFloat($('#onlineTaxesSpan').html())+parseFloat(onlinetaxes)).toFixed(2));
        $('#pay_amount_online').val( parseFloat(parseFloat($('#pay_amount_online').val())+parseFloat(onlinetotal)).toFixed(2));
        $('#original_pay_amount').val( parseFloat(parseFloat($('#original_pay_amount').val())+parseFloat(onlinetotal)).toFixed(2));
        $("#pay_amount_online_span").html($('#pay_amount_online').val());

        $('#ddSubtotalSpan').html( parseFloat(parseFloat($('#ddSubtotalSpan').html())+parseFloat(baseAmountOther)).toFixed(2));
        $('#ddTaxesSpan').html( parseFloat(parseFloat($('#ddTaxesSpan').html())+parseFloat(othertaxes)).toFixed(2));
        $('#pay_amount_dd_span').html( parseFloat(parseFloat($('#pay_amount_dd_span').html())+parseFloat(othertotal)).toFixed(2));
        $('#pay_amount').val( parseFloat(parseFloat($('#pay_amount').val())+parseFloat(othertotal)).toFixed(2));

        $('#amount_pay').val( parseFloat(parseFloat($('#amount_pay').val())+parseFloat(othertotal)).toFixed(2));
        
    }else{
        $("#onlineTotalItemsSpan").html( parseInt($('#onlineTotalItemsSpan').html()) - 1 );
        $("#ddTotalItemsSpan").html( parseInt($('#ddTotalItemsSpan').html()) - 1 );
        $('#onlineSubtotalSpan').html( parseFloat(parseFloat($('#onlineSubtotalSpan').html())-parseFloat(baseAmount)).toFixed(2));
        $('#onlineConveyanceChargesSpan').html( parseFloat(parseFloat($('#onlineConveyanceChargesSpan').html())-parseFloat(onlineconveyancecharges)).toFixed(2));
        $('#pgChargesSpan').html( parseFloat(parseFloat($('#pgChargesSpan').html())-parseFloat(pgcharges)).toFixed(2));
        $('#onlineTaxesSpan').html( parseFloat(parseFloat($('#onlineTaxesSpan').html())-parseFloat(onlinetaxes)).toFixed(2));
        $('#pay_amount_online').val( parseFloat(parseFloat($('#pay_amount_online').val())-parseFloat(onlinetotal)).toFixed(2));
        $('#original_pay_amount').val( parseFloat(parseFloat($('#original_pay_amount').val())-parseFloat(onlinetotal)).toFixed(2));
        $("#pay_amount_online_span").html($('#pay_amount_online').val());

        $('#ddSubtotalSpan').html( parseFloat(parseFloat($('#ddSubtotalSpan').html())-parseFloat(baseAmountOther)).toFixed(2));
        $('#ddConveyanceChargesSpan').html( parseFloat(parseFloat($('#ddConveyanceChargesSpan').html())-parseFloat(otherconveyancecharges)).toFixed(2));
        $('#ddTaxesSpan').html( parseFloat(parseFloat($('#ddTaxesSpan').html())-parseFloat(othertaxes)).toFixed(2));
        $('#pay_amount_dd_span').html( parseFloat(parseFloat($('#pay_amount_dd_span').html())-parseFloat(othertotal)).toFixed(2));
        $('#pay_amount').val( parseFloat(parseFloat($('#pay_amount').val())-parseFloat(othertotal)).toFixed(2));

        $('#amount_pay').val( parseFloat(parseFloat($('#amount_pay').val())-parseFloat(othertotal)).toFixed(2));
    }
    if(parseFloat($('#onlineConveyanceChargesSpan').html()) > 0){
        $("#onlineConveyanceChargesDiv").show();
    }else{
        $("#onlineConveyanceChargesDiv").hide();
    }
    if(parseFloat($('#onlineTaxesSpan').html()) > 0){
        $("#onlineTaxesDiv").show();
    }else{
        $("#onlineTaxesDiv").hide();
    }
    if(parseFloat($('#pgChargesSpan').html()) > 0){
        $("#onlinePgChargesDiv").show();
    }else{
        $("#onlinePgChargesDiv").hide();
    }
    if(parseFloat($('#ddTaxesSpan').html()) > 0){
        $("#ddTaxesDiv").show();
    }else{
        $("#ddTaxesDiv").hide();
    }
    if(parseFloat($('#ddConveyanceChargesSpan').html()) > 0){
        $("#ddConveyanceChargesDiv").show();
    }else{
        $("#ddConveyanceChargesDiv").hide();
    }
    if($(".hybridPGOption").length > 0){
        calcCartPayAmount();
    }
}

var country_from= 'correspondence_country';
var country_to  = 'permanent_country';
var state_from  = 'correspondence_state';
var state_to    = 'permanent_state';
var district_from = 'correspondence_district';
var district_to = 'permanent_district';
var city_from   = 'correspondence_city';
var city_to     = 'permanent_city';
var address1_from = 'correspondence_address1'; 
var address1_to = 'permanent_address1';
var address2_from = 'correspondence_address2';
var address2_to = 'permanent_address2';
var pincode_from= 'correspondence_pincode';
var pincode_to  = 'permanent_pincode';
var city1_from  = 'correspondence_city1';
var city1_to    = 'permanent_city_1';

//For copy address
function getFromAddressToAddressField(){
        //Get correspondence country position
        var correspondence_country_pos = 0;
        if($('#correspondence_country_read_only').length) {
            correspondence_country_pos = $( "select" ).index($('#correspondence_country_read_only'));
        } else {
            correspondence_country_pos = $( "select" ).index($('#correspondence_country'));
        }
            
        //get permanent country position
        var permanent_country_pos = 0;
        if($('#permanent_country_read_only').length) {
            permanent_country_pos = $( "select" ).index($('#permanent_country_read_only'));
        } else {
            permanent_country_pos = $( "select" ).index($('#permanent_country'));
        }
            
        //if correspondence country position is greater than permanent country position it means 
        //permanent details is above correspondence address details. In this case change all the keys
        if(correspondence_country_pos > permanent_country_pos) {
            country_from = 'permanent_country';
            country_to = 'correspondence_country';
            state_from = 'permanent_state';
            state_to = 'correspondence_state';
            district_from = 'permanent_district';
            district_to = 'correspondence_district';
            city_from = 'permanent_city';
            city_to = 'correspondence_city'; 
            address1_from = 'permanent_address1'; 
            address1_to = 'correspondence_address1'; 
            address2_from = 'permanent_address2'; 
            address2_to = 'correspondence_address2'; 
            pincode_from = 'permanent_pincode'; 
            pincode_to = 'correspondence_pincode';
            city1_from  = 'permanent_city_1';
            city1_to    = 'correspondence_city1';
        }
}

var alreadyBindAddressField=false;
function bindAllAddressFields(){
    if(alreadyBindAddressField==false){
        
            $("#"+country_from+", #"+state_from+", #"+district_from+", #"+city_from+", #"+address1_from+", #"+address2_from+", #"+pincode_from+", #"+city1_from).change(function(){
                if($('input[name="'+MACHINE_NPF_ADDRESS+'"]').length && $('input[name="'+MACHINE_NPF_ADDRESS+'"]:checked').val() !='No') {
                    copyPermanentCorrespondenceAddress(MACHINE_NPF_ADDRESS);
                }
            });
            alreadyBindAddressField=true;
        
    }
}

/**
 * This function will hide the address to field
 * @returns {undefined}
 */
function showHideAddressField(){
    //For Country
    if($('#'+country_to).length) { 
        $('div.'+country_to).hide();
        $('div.'+country_to).prev('div').hide();
    }
    //For State
    if($('#'+state_to).length) { 
        $('div.'+state_to).hide(); 
    }
    //For District
    if($('#'+district_to).length) {   
        $('div.'+district_to).hide();
    }
    //For City
    if($('#'+city_to).length) {
        $('div.'+city_to).hide();
    }
    if($('#'+city1_to).length) {
        $('div.'+city1_to).hide();
    }
    //For Address 1
    if($('#'+address1_to).length) { 
        $('div.'+address1_to).hide();
    }
    //For Address 2
    if($('#'+address2_to).length) {
        $('div.'+address2_to).hide();
    }
    //For Pincode
    if($('#'+pincode_to).length) {   
        $('div.'+pincode_to).hide();
    }
}
//'performOnlyCopy' will come only when user change radio options
function copyPermanentCorrespondenceAddress(field_name, call_from,show_hide)
{
    //First time hide all address field of bottom section
    if(typeof show_hide !== 'undefined' && show_hide =='hide') {
        getFromAddressToAddressField();
        showHideAddressField();
    }
    if (($('input[name="'+field_name+'"]').length) && ($('input[name="'+field_name+'"]').is(":checked"))) {
        
        getFromAddressToAddressField();
        bindAllAddressFields();
            
        if($('input[name="'+field_name+'"]:checked').val()=='Yes') {   
            //For Country
            if (($('#'+country_from).length) && ($('#'+country_to).length)) {
                
                $('div.'+country_to).prev('div').hide();

                if($('#'+country_from+'_read_only').length) {
                    $('#'+country_to).html($("#"+country_from+"_read_only > option").clone());
                } else {
                    $('#'+country_to).html($("#"+country_from+" > option").clone());
                }
                $('#'+country_to).find("option[value = '" + $('#'+country_from).val() + "']").prop("selected", true);
                $('#'+country_to).trigger("chosen:updated");
                $('div.'+country_to).hide();                
            }
                                
            //For State
            if (($('#'+state_from).length) && ($('#permanent_state').length)) {
                
                if($('#'+state_from+'_read_only').length) {
                    $('#'+state_to).html($("#"+state_from+"_read_only > option").clone());
                } else {
                    $('#'+state_to).html($("#"+state_from+" > option").clone());                    
                }
                $('#'+state_to).find("option[value = '" + $('#'+state_from).val() + "']").prop("selected", true);
                $('#'+state_to).trigger("chosen:updated");
                $('div.'+state_to).hide();               
            }
            
            //For District
            if (($('#'+district_from).length) && ($('#'+district_to).length)) {
                
                if($('#'+district_from+'_read_only').length) {
                    $('#'+district_to).html($("#"+district_from+"_read_only > option").clone());
                } else {
                    $('#'+district_to).html($("#"+district_from+" > option").clone());                    
                }

                $('#'+district_to).find("option[value = '" + $('#'+district_from).val() + "']").prop("selected", true);
                $('#'+district_to).trigger("chosen:updated");
                $('div.'+district_to).hide();                
            }
            
            //For City
            if (($('#'+city_from).length) && ($('#'+city_to).length)) {
                
                //If city is textbox
                if($("#"+city_from).is("input") === true) {
                    $('#'+city_to).val($('#'+city_from).val());
                } else {
                    if($('#'+city_from+'_read_only').length) {
                        $('#'+city_to).html($("#"+city_from+"_read_only > option").clone());
                    } else {
                        $('#'+city_to).html($("#"+city_from+" > option").clone());                    
                    }                    
                    $('#'+city_to).find("option[value = '" + $('#'+city_from).val() + "']").prop("selected", true);
                    $('#'+city_to).trigger("chosen:updated");
                }
                $('div.'+city_to).hide();
            }

            //For City1
            if (($('#'+city1_from).length) && ($('#'+city1_to).length)) {

                //If city is textbox
                if($("#"+city1_from).is("input") === true) {
                    $('#'+city1_to).val($('#'+city1_from).val());
                } else {
                    if($('#'+city1_from+'_read_only').length) {
                        $('#'+city1_to).html($("#"+city1_from+"_read_only > option").clone());
                    } else {
                        $('#'+city1_to).html($("#"+city1_from+" > option").clone());
                    }
                    $('#'+city1_to).find("option[value = '" + $('#'+city1_from).val() + "']").prop("selected", true);
                    $('#'+city1_to).trigger("chosen:updated");
                }
                $('div.'+city1_to).hide();
            }
            
            //For Address Line 1
            if (($('#'+address1_from).length) && ($('#'+address1_to).length)) { 
                
                $('div.'+address1_to).hide();
                $('#'+address1_to).val($('#'+address1_from).val());
            }
            
            //For Address Line 2
            if (($('#'+address2_from).length) && ($('#'+address2_to).length)) { 
                
                $('div.'+address2_to).hide();
                $('#'+address2_to).val($('#'+address2_from).val());
            }
            
            //For Correspondence Pincode
            if (($('#'+pincode_from).length) && ($('#'+pincode_to).length)) { 
                $('div.'+pincode_to).hide();
                $('#'+pincode_to).val($('#'+pincode_from).val());
            }
                
        } else if (call_from != 'ajax_stop') {
            //For Country
            if($('#'+country_to).length) { 
                $('div.'+country_to).show();
                $('div.'+country_to).prev('div').show();
                $('#'+country_to).find("option[value = '" + $('#'+country_to).val() + "']").removeAttr("selected");                
                $('#'+country_to).trigger("chosen:updated"); 
            }
            //For State
            if($('#'+state_to).length) { 
                $('div.'+state_to).show();
                //hide dependent field
                if ((typeof dependentFieldsHide != 'undefined') && ($.inArray( state_to, dependentFieldsHide ))) {
                    $('div.'+state_to).hide();
                }                
                $('#'+state_to).find("option[value = '" + $('#'+state_to).val() + "']").removeAttr("selected");
                $('#'+state_to).trigger("chosen:updated"); 
            }
            //For District
            if($('#'+district_to).length) {   
                $('div.'+district_to).show();
                //hide dependent field
                if ((typeof dependentFieldsHide != 'undefined') && ($.inArray( district_to, dependentFieldsHide ))) {
                    $('div.'+district_to).hide();
                }
                $('#'+district_to).find("option[value = '" + $('#'+district_to).val() + "']").removeAttr("selected");
                $('#'+district_to).trigger("chosen:updated"); 
            }
            //For City
            if($('#'+city_to).length) {
                $('div.'+city_to).show();
                //hide dependent field
                if ((typeof dependentFieldsHide != 'undefined') && ($.inArray( city_to, dependentFieldsHide ))) {
                    $('div.'+city_to).hide();
                }

                if($("#"+city_from).is("input") === true) {
                    $('#'+city_to).val("");
                } else {
                    $('#'+city_to).find("option[value = '" + $('#'+city_to).val() + "']").removeAttr("selected");
                    $('#'+city_to).trigger("chosen:updated");
                }
            }
            //For City1
            if($('#'+city1_to).length) {
                $('div.'+city1_to).show();
                //hide dependent field
                if ((typeof dependentFieldsHide != 'undefined') && ($.inArray( city1_to, dependentFieldsHide ))) {
                    $('div.'+city1_to).hide();
                }
                
                if($("#"+city1_from).is("input") === true) {
                    $('#'+city1_to).val("");
                } else {
                    $('#'+city1_to).find("option[value = '" + $('#'+city1_to).val() + "']").removeAttr("selected");
                    $('#'+city1_to).trigger("chosen:updated");
                }
            }
            //For Address 1
            if($('#'+address1_to).length) { 
                $('div.'+address1_to).show();
                $('#'+address1_to).val("");
            }
            //For Address 2
            if($('#'+address2_to).length) {
                $('div.'+address2_to).show();
                $('#'+address2_to).val("");
            }
            //For Pincode
            if($('#'+pincode_to).length) {   
                $('div.'+pincode_to).show();
                $('#'+pincode_to).val("");
            }
        }
    }
    
}


function saveRejectFieldData(id, current_page,field, fieldType)
{    
    $("#confirmYes").removeAttr('onclick');
    $('#confirmTitle').html("Confirmation Required");
    $('#ConfirmPopupArea div.modal-header').css({"background-color":"#75b740","padding":"5px 10px","min-height":"16.43px"});
    $('#ConfirmPopupArea button.npf-close').css("background-color","red");
    $('#ConfirmPopupArea a#confirmYes').addClass('btn-sm').css("width","110px");
    $('#ConfirmPopupArea button[type="submit"]').addClass('btn-sm btn-raised').removeClass('btn-npf').css("width","110px");
    $("#confirmYes").html('Confirm');
    $("#confirmYes").siblings('button').html('Cancel');
    $('#ConfirmMsgBody').html('Are you sure you want to delete the data? Data once deleted cannot be restored.');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        
        var data = $('#save_data_'+id).serializeArray();
        data.push({name: "fieldName", value: field});
        data.push({name: "fieldType", value: fieldType});
            $.ajax({
            url: college_slug + '/form/save-reject-field-data/' + current_page,
            type: 'post',
            dataType: 'json',
            data:data,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                
                if(typeof data['redirect'] !== 'undefined'){
                    window.location.href= data['redirect'];
                }else if(typeof data['error'] !== 'undefined'){
                    alertPopup(data['error'],'error');
                }else if(typeof data['status'] !== 'undefined' && data['status'] == 200){
                   
                    $('#link_'+id).show();
                    $('#update_'+id).hide();
                    $('#save_data_'+id+' .form-control').attr("disabled","disabled");
                    $('#save_data_'+id+' input[type="checkbox"]').attr("disabled","disabled");
                    $('#save_data_'+id+' input[type="radio"]').attr("disabled","disabled");
                    $('.form-control').addClass("disabled");
                    $('.chosen-select').prop('disabled', true).trigger("chosen:updated");

                    try{
                        if($('.sumo-select-new').length>0){
                            $('.sumo-select-new').each(function(i,j){
                              $('.sumo-select-new').prop('disabled', true)[i].sumo.reload();
                            });
                        }
                        
                      }catch(error) {}

                    switch(fieldType) {
                        case 'textbox':
                        case 'date':
                        case 'email':
                        case 'paragraph':
                            $('#'+field).val('');
                            break;
                        case 'dropdown':
                            //If other is exist
                            if($('#other_'+field).length>0) {
                               $('#other_'+field).remove(); 
                            }

                            $('#'+field).val('');
                            $('#'+field).prop('disabled', true).trigger("chosen:updated");
                            break;
                        case 'file':
                            $('#'+field).val('');
                            $('#arrow_down_'+field).remove();
                            break;
                        case 'radio':
                            $('input[name="'+field+'"]').removeAttr('disabled');
                            $('input[name="'+field+'"]').attr('checked',false);
                            $('input[name="'+field+'"]').attr('disabled','disabled');
                            $('#arrow_down_'+field).remove();
                            break;
                        case 'checkbox':
                            $('input[name="'+field+'\[]"]').attr('checked',false);
                            $('input[name="'+field+'"]').attr('disabled','disabled');
                            $('#arrow_down_'+field).remove();
                            break;
                        case 'table':
                        case 'table_cell':
                            switch($('#'+field)[0].nodeName.toLowerCase()) {
                                case 'select':
                                    //If other is exist
                                    if($('#other_'+field).length>0) {
                                       $('#other_'+field).remove(); 
                                    }
                                    $('#'+field).val('');
                                    $('#'+field).prop('disabled', true).trigger("chosen:updated"); 
                                    break;
                                default:
                                    $('#'+field).val(''); 
                                    break;
                            }
                            break;
                    }
                    $('#cross_btn_'+field).remove();
                    alertPopup('Data removed successfully.','success');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        
        $('#ConfirmPopupArea').modal('hide');
        });
}

/*Check Email Validation*/
function verifyEmailDNS(value) {
    var DNSVerified = true; 
    if ($.trim(value) != '') {
        //Call this ajax function
        $.ajax({
            url: '/common/check-email',
            type: 'post',
            dataType: 'json',
            //async: false,
            data:  {email : $.trim(value), verifyDNS : 1 },        
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                if (typeof data['message'] !== 'undefined' && data['message']!='') {
                    DNSVerified = data['message'];
                }           
            },
            error: function (xhr, ajaxOptions, thrownError) {            
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        }); 
    }
    return DNSVerified;
}

function SaveReferenceData(id, current_page) {

    var flag = false;
    if (CheckRequiredFields() == true) {
        flag = true;
    }
    if (CheckEmailFields() == true) {
        flag = true;
    }
    if (CheckMaxMinFields() == true) {
        flag = true;
    }
    if (CheckMaxMinWordsFields() == true) {
        flag = true;
    }
    if (CheckDecimalPlaces() == true) {
        flag = true;
    }
    if (custom_script() == true) {
        flag = true;
    }
    if (CheckNumericFields() == true) {
        flag = true;
    }
    if (CheckMaxValueInNumericFields() == true) {
        flag = true;
    }
    if (CheckAlphabetFields() == true) {
        flag = true;
    }

    if (tableYearCondition() == true) {
        flag = true;
    }
    if (CheckUniqueFieldsGroup() == true) {
        flag = true;
    }
    if (CheckDateValue() == true) {
        flag = true;
    }
    if (CheckMobileFields() == true) {
        flag = true;
    }
    if (CheckWhiteListChars() == true) {
        flag = true;
    }

    //if All form builder validation pass
    if (!flag) {
        if (ResetJS() == true) {
            flag = true;
        }
    }

    if (checkAadharNo() == true) {
        flag = true;
    }
    
    if(typeof lastScrollOffset !='undefined' && lastScrollOffset>0){
        $('html, body').animate({
              scrollTop: lastScrollOffset - 100
           }, 700);
            lastScrollOffset = 0;
    }

    if (flag == true) {
        // FinallySave(redirect_type);
        return false;
    } else {        
        FinallySaveReference(id, current_page);
        return true;
    }
}

function FinallySaveReference(id, current_page) {
    $('#confirmTitle').html("Confirmation");
    $('#ConfirmMsgBody').html('Are you sure you want to submit ? After form submission you will not be able to do any changes on form.');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
            $('#ConfirmPopupArea').modal('hide');
            $('div.loader-block').show();
            var data = $('#save_data_' + id).serialize();
            $.ajax({
                url: college_slug + '/form/reference-details-save/' + current_page,
                type: 'post',
                dataType: 'json',
                data: data,
                headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                success: function (data) {
                    $('div.loader-block').hide();
                    $('span[id^=requiredError_]').hide();
                    $('span[id^=otherError_]').hide();
                    if (typeof data.redirect != 'undefined') {
                        location  = data.redirect;
                    }
                    else if (typeof data.error != 'undefined' && Object.keys(data.error).length > 0) {
                        for (var key in data.error) {
                            if (data.error.hasOwnProperty(key)) {
                                if (key == 'required') {
                                    var req_field = data.error['required'];
                                    for (var key in req_field) {
                                        $('#requiredError_' + key).show();
                                        if (req_field[key] != "") {
                                            $('#requiredError_' + key).html(req_field[key]);
                                        }
                                    }
                                } else if (key == 'other') {
                                    var other_field = data.error['other'];
                                    for (var key in other_field) {
                                        $('#otherError_' + key).show();
                                        $('#otherError_' + key).html(other_field[key]);
                                    }
                                }
                            }
                        }
                    } else if (typeof data.alert != 'undefined') {
                        alertPopup(data.alert, 'error');
                    }
                    else {
                        $('#link_' + id).show();
                        $('#update_' + id).hide();
                        $('#save_data_' + id + ' .form-control').attr("disabled", "disabled");
                        $('#save_data_' + id + ' input[type="checkbox"]').attr("disabled", "disabled");
                        $('#save_data_' + id + ' input[type="radio"]').attr("disabled", "disabled");
                        $('.form-control').addClass("disabled");
                        $('.chosen-select').prop('disabled', true).trigger("chosen:updated");

                        try{
                            if($('.sumo-select-new').length>0){
                                $('.sumo-select-new').each(function(i,j){
                                  $('.sumo-select-new').prop('disabled', true)[i].sumo.reload();
                                });
                            }
                        }catch(error) {}

                        
                        if($('#thankyouPageInformation').length > 0){
                            $('#thankyouPageInformation').show()
                        }else{
                            var prependHtml =   '<div class="panel-body bg-success">';
                            prependHtml +=  '   <div class="text-center text-success">Form submitted successfully.</div>';
                            prependHtml +=  '</div>';
                            $('#RecommendationPage form').before(prependHtml);
                        }
                        $('#RecommendationPage form').remove();
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });            
        });
    return false;
 
}

 /**
  * create to get the javascript date object by fieldId
  * @param {type} field_id
  * @returns {Number|String|getTimeByFieldId.field_val|jQuery} 
  */
function getTimeByFieldId(field_id){
    var field_val = $("#"+field_id+'[name=\''+field_id+'\']').val();
    if(typeof field_val != "undefined"){

        var field_val_array = field_val.split('/');

        if(field_val_array.length==3){
            field_val = field_val_array[2]+'-'+field_val_array[1]+'-'+field_val_array[0];
        }else if(field_val_array.length==2){
            field_val = field_val_array[1]+'-'+field_val_array[0]+'-01';
        }else if(field_val_array.length==1 && field_val_array[0]!=''){
            field_val = field_val_array[0]+'-01-01';
        }

        field_val = new Date(field_val).getTime();
        if(isNaN(field_val)){
            field_val=-1;
        }
    }
    return field_val;
}

/**
 * show error to respective field by field id
 * @param {type} field_id
 * @param {type} errorMessage
 * @returns {undefined}
 */
function showErrorOnField(field_id,errorMessage){
    $('#requiredError_'+field_id).hide();
    $('#otherError_'+field_id).show();
    $('#otherError_'+field_id).html(errorMessage);
    makeTableBorderRed(field_id);
    scrollToField(field_id);
}


function validationPrefCount(field){
    var totalPrefOption = 1;
    var maxSelectedPref = 0;
    var maxAllowdPreferences = $('[name="'+field+'[]"]').length;

    if(maxAllowdPreferences<1){
        return false;
    }

    
    $('[name="'+field+'[]"]').each(function(){
        if($(this).val()!=='' && $(this).val()!== null){
            maxSelectedPref++;
        }
    });

    if($('[name="'+field+'[]"]').eq(0).find('option').length>0){
        totalPrefOption = parseInt($('[name="'+field+'[]"]').eq(0).find('option').length)-1;
    }
    
    if(jsVars.preferences_configuration != null && typeof jsVars.preferences_configuration !='undefined' && jsVars.preferences_configuration.max_preferences != null && typeof jsVars.preferences_configuration.max_preferences !='undefined' && jsVars.preferences_configuration.max_preferences != '' ){
        if(totalPrefOption > jsVars.preferences_configuration.max_preferences && jsVars.preferences_configuration.max_preferences>0){
            totalPrefOption = jsVars.preferences_configuration.max_preferences;
        }
    }
    return {
        'maxAllowdPreferences':maxAllowdPreferences,
        'totalPrefOption':totalPrefOption,
        'maxSelectedPref':maxSelectedPref
    };

}

function calcPreferenceCount(field){
    var data = validationPrefCount(field);
    var maxSelectedPref = data.maxSelectedPref;
    var totalPrefOption = data.totalPrefOption;

    if(jsVars.preferences_configuration != null && typeof jsVars.preferences_configuration !='undefined'
            && jsVars.preferences_configuration.preference_amount != null
            && typeof jsVars.preferences_configuration.preference_amount !='undefined'
            && jsVars.preferences_configuration.preference_amount != '' ){
        
        var amout =0;
        var disabledFieldCount = 0;
        $('[name="'+field+'[]"]:disabled').each( function(){
            if($(this).val()!=='' && $(this).val()!== null){
                disabledFieldCount++;
            }
        });
        
        if(disabledFieldCount > jsVars.preferences_configuration.free_preferences){
            var paid_preferences = parseInt(maxSelectedPref - disabledFieldCount);
        }
        else{
            var paid_preferences = maxSelectedPref - parseInt(jsVars.preferences_configuration.free_preferences);
        }
        if(paid_preferences>0){
            amout = paid_preferences*jsVars.preferences_configuration.preference_amount;
        }
    }
    if($('#preferences_breakup').length>0){
        $('#preferences_breakup span.pref_count').html(maxSelectedPref);
        $('#preferences_breakup span.total_pref').html(totalPrefOption);
        $('#preferences_breakup span.pref_amount').html(amout);
    }
}

var alreadySelected = [];
function addMorePreferences(elem,field,selected,default_disabled) {
    $('.loadb').show();
    
    var data = validationPrefCount(field);
    var maxAllowdPreferences = data.maxAllowdPreferences;
    var totalPrefOption = data.totalPrefOption;
    
    if(maxAllowdPreferences>=totalPrefOption){
        var formId = 0;
        if(typeof jsVars.form_id !='undefined'){
            formId = jsVars.form_id;
        }
        if(formId==2){
            alertPopupPref('Max Free choice exhausted. Additional School selection can be done after completion of registration.','alert');
        }else{
            alertPopup('Max limit reached.','error');
        }
        $('.loadb').hide();
        return false;
    }
    
    
    var div_class = 'addmore_dropdown';
    var alloct  = $('[name="'+field+'[]"]').serializeArray();

    for(var i in alloct){
        alreadySelected.push(alloct[i].value);
    }
    
    // for some fields are disabled explicit
    if(typeof options_default_value !='undefined'){
        for(var i in options_default_value){
            alreadySelected.push(options_default_value[i]);
        }
    }

//    var stgClone = jQuery(elem).closest('.' + div_class).eq(0).clone();
    var stgClone = jQuery(elem).closest('.' + div_class + ' div.row').eq(0).clone();


    // remove chosen select container
    jQuery(stgClone).find('.chosen-container').remove();

    jQuery(stgClone).find('select').val('');
    jQuery(stgClone).find('select').prop('disabled',false);
    jQuery(stgClone).find('select').removeAttr('disabled');
    jQuery(stgClone).find('.plusMinIcon').show();
    
    jQuery(stgClone).find('option').each(function () {
        if(alreadySelected.indexOf($(this).attr('value'))>-1){
            $(this).prop('disabled', true);
        }
    });

    // add delete button
    jQuery(stgClone).find('.removeElementClass').html('<a href="javascript:void(0);" class="text-danger" onclick="return confirmDelete(this,\''+field+'\');"><i class="fa fa-minus-circle" aria-hidden="true"></i></a>');
//    jQuery(stgClone).find('.pref_count').html(':'+eval(maxAllowdPreferences+1));

    // reset all select box value

    
    if(typeof selected !='undefined' && selected !='' && selected !=null){
        jQuery(stgClone).find('select').val(selected);
    }
    // blank textbox value
    jQuery(elem).closest('.' + div_class+'>div').append(stgClone);
    jQuery('.chosen-select').chosen();
//    calcPreferenceCount(field);
    $('.loadb').hide();
    return false;
}

function confirmDelete(elem, field) {
    $("#ConfirmPopupArea").css('z-index', 11001);
    $('#ConfirmMsgBody').html('Do you want to delete ?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
             .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                removePreferences(elem,field);
                is_filter_button_pressed = 0;
                $('#ConfirmPopupArea').modal('hide');
            });
    return false;
}

function removePreferences(elem,field) {
    $('.pref_change_'+field).val('1');
    jQuery(elem).closest('div.row').remove();
    disabledAlreadyUsedPreferences(field);
    $('[name="'+field+'[]"]').trigger('change');
    calcPreferenceCount(field);
    return false;
}

function disabledAlreadyUsedPreferences(field){
    if($('[name="'+field+'[]"]').length<1){
        return false;
    }
    
    alreadySelected = [];
    var alloct  = $('[name="'+field+'[]"]').serializeArray();
    for(var i in alloct){
       alreadySelected.push(alloct[i].value);
    }

    // for some fields are disabled explicit
    if(typeof options_default_value !='undefined'){
        
        for(var i in options_default_value){
            alreadySelected.push(options_default_value[i]);
        }
    }

    alreadySelected = removeDuplicates(alreadySelected);
    
    $('select[name="'+field+'[]"]').each(function(){
        $(this).find('option').prop('disabled', false);
        var aa = JSON.parse(JSON.stringify(alreadySelected));
        var tmpAlredySelected = aa;
        var curval = $(this).val();
        var delid = tmpAlredySelected.indexOf(curval);
        delete tmpAlredySelected[delid];

        jQuery(this).find('option').each(function () {
           if($(this).attr('value')!='' && tmpAlredySelected.indexOf($(this).attr('value'))>-1){
               $(this).prop('disabled',true);
           }
       });
        $('.chosen-select').chosen();
        $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
        $('.chosen-select').trigger('chosen:updated');
    });
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
    $('.chosen-select').trigger('chosen:updated');
}

function removeDuplicates(num) {
  var x,
      len=num.length,
      out=[],
      obj={};

  for (x=0; x<len; x++) {
    obj[num[x]]=0;
  }
  for (x in obj) {
    out.push(x);
  }
  return out;
}

function getComunicationStateList(selectedState = '',college_id = 0) {
    if ($("#communication_country").val() === '' ) {
        $('#communication_state').html('<option selected="selected" value="">Select State</option>');
        $('#communication_state').trigger('chosen:updated');
        return;
    }
    
    if(college_id == null || typeof college_id == 'undefined'){
        college_id = 0;
    }

    $.ajax({
        url: college_slug+'/common/getChildListByTaxonomyId',
        type: 'post',
        dataType: 'html',
        data: {
            "parentId": $("#communication_country").val(),
            "college_id":college_id
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data.childList === "object") {
                        var value = '<option value="">Select State</option>';
                        $.each(responseObject.data.childList, function (index, item) {
                            if(item.toLowerCase() === selectedState.toLowerCase()){
                                value += '<option selected = "selected" value="' + index + '">' + item + '</option>';
                            }else{
                                value += '<option value="' + index + '">' + item + '</option>';
                            }
                            
                        });
                        $('#communication_state').html(value);
                    }
                }
                $('#communication_state').trigger('chosen:updated');
            } else {
                console.log(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function preferenceOptionUpdate(id){
    $('.plusMinIcon').hide();
    if(jsVars.preferences_configuration != null && typeof jsVars.preferences_configuration !='undefined' && jsVars.preferences_configuration.field != null && typeof jsVars.preferences_configuration.field !='undefined' && jsVars.preferences_configuration.field != '' ){
        if($('#link_'+id).parents('.panel-default').find('.plusMinIcon').length>0){
            $('.plusMinIcon').show();
            disabledAlreadyUsedPreferences(jsVars.preferences_configuration.field);
        }
    }
}
function confirmSaveForm(redirect_type){

    $("#ConfirmPopupArea #confirmTitle").html('Alert!!');
    $("#ConfirmPopupArea button[type='submit']").html('Cancel');
    $("#ConfirmPopupArea").css({'z-index':'120000'});
    $('#ConfirmMsgBody').html('Form once submitted cannot be edited. Are you sure you want to submit the form?');
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmYes', function (e) {
            e.preventDefault();
            $('#ConfirmPopupArea').modal('hide');
            SaveForm(redirect_type);
    });
}

function confirmSaveFormRedirect(redirect){

    $("#ConfirmPopupArea #confirmTitle").html('Alert!!');
    $("#ConfirmPopupArea button[type='submit']").html('Cancel');
    $("#ConfirmPopupArea").css({'z-index':'120000'});
    $('#ConfirmMsgBody').html('Form once submitted cannot be edited. Are you sure you want to submit the form?');
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmYes', function (e) {
            e.preventDefault();
            $('#ConfirmPopupArea').modal('hide');
            window.location.href=redirect;
    });
}

function  keydownInlineFieldValidation(elem,event){
    return CheckNumericFieldsSingle(elem,event);
    
}

function changeInlineFieldValidation(elem){
    checkRequiredFieldsSingle(elem);
    CheckEmailFieldsSingle(elem);
}

function blurInlineFieldValidation(elem){
    checkRequiredFieldsSingle(elem);
}

function clickInlineFieldValidation(elem){
    checkRequiredFieldsSingle(elem);
}

function checkRequiredFieldsSingle(elem){
    
    if(typeof elem == 'undefined' || elem == null || typeof elem.name == 'undefined' || elem.id == null ){
        return false;
    }
    var file_status = '';    
    var field_id = elem.name;    
    var str = field_id;
    field_id = str.replace("[]", "");
    //field_id = field_id.replace("other_", "");
    if(required_fields.indexOf($.trim(field_id))>-1){
        
        if($('#'+field_id).attr('data-file_status')!='' && $('#'+field_id).attr('data-file_status')=='already_upload'){
            file_status = $('#'+field_id).attr('data-file_status');
            //return false;
        }
        if(file_status=='already_upload'){
            return false;
        }
        /* if CHECKBOX is unchecked*/
        if($('input[name="'+field_id+'[]"]').is(':checkbox') && jQuery("input:checkbox[name='"+field_id+"[]']:checked").length<=0){
            showRequiredError(field_id);
        }
        /* if CHECKBOX is checked and other is slected */
        else if($('input[name="' + field_id + '[]"]').is(':checkbox') && jQuery("input:checkbox[name='" + field_id + "[]']:checked").length > 0){
            jQuery("input:checkbox[name='" + field_id + "[]']:checked").each(function () {
                if ($(this).val() == 'Other' && jQuery.trim(jQuery("#other_" + field_id).val()) == '') {
                    showRequiredError(field_id);
                }
            });
        }
        /* MULTI SELECT DROPDOWN*/
       else if (jQuery("select[name='" + field_id + "[]']").length > 0
       && ((jQuery("select[name='" + field_id + "[]']").val() == '' || jQuery("select[name='" + field_id + "[]']").val() == null) ||
               (/* if only select "Other" and other text box is empty */
                       jQuery("select[name='" + field_id + "[]']").val().length > 0
                       && jQuery("select[name='" + field_id + "[]']").val().indexOf('Other') > -1
                       && jQuery.trim(jQuery("#other_" + field_id).val()) == ''
                       )

               )) {
            showRequiredError(field_id);
        }
        /* SINGLE SELECT DROPDOWN or other is select with balank value */
        else if (jQuery("select[name='" + field_id + "']").length > 0
        && (jQuery("select[name='" + field_id + "']").val() == ""
                || ((jQuery("select[name='" + field_id + "']").val() == 'Other' || (/;;;Other/g.test(jQuery("select[name='" + field_id + "']").val()))==true) && jQuery.trim(jQuery("#other_" + field_id).val()) == '')
                )
        ) {
            showRequiredError(field_id);;
        }
        else if ($('input[name="' + field_id + '"]').is(':radio') && (!$("input[name='" + field_id + "'][type='radio']:checked").val() || (
            $("input[name='" + field_id + "'][type='radio']:checked").val() == 'Other' && jQuery.trim(jQuery("#other_" + field_id).val()) == ''

        ))) {
            showRequiredError(field_id);
        }
        else if($('#'+field_id).is(':file') && $('#'+field_id).get(0).files.length<=0 ){
            showRequiredError(field_id);
        }
        else if(($('#'+field_id+'[name=\''+field_id+'\']').length > 0) &&  $.trim($('#'+field_id).val())==""){
            showRequiredError(field_id);
        }
    }
}

function CheckEmailFieldsSingle(elem){
    if(typeof elem == 'undefined' || elem == null || typeof elem.name == 'undefined' || elem.id == null){
        return false;
    }    
    var field_id = elem.name;
    var hasError = false;
    if(email_fields.indexOf(field_id)>-1){
        $('#otherError_'+field_id).hide();
        if(($('#'+field_id+'[name=\''+field_id+'\']').length > 0) && ($('#'+field_id).val()!="")  && !email_filter.test($('#'+field_id).val())){
            showOtherFieldError(field_id,"This email id seems wrong. Kindly check.")
            hasError = true;
            
        } else if ((typeof jsVars.verifyEmailDomain !== 'undefined') && ($('#'+field_id+'[name=\''+field_id+'\']').length > 0) && ($('#'+field_id).val()!="")) {
            var DNSVerify = verifyEmailDNS($('#' + field_id).val());
            if (DNSVerify !== true) {
                showOtherFieldError(field_id,DNSVerify);
                hasError = true;
            }
        }
        
        //If there is no any error then remove error class
        if(!hasError && $('#'+field_id+'[name=\''+field_id+'\']').length > 0 &&  $('#'+field_id+'[name=\''+field_id+'\']').parent('div').hasClass('has-error')) {
            $('#'+field_id+'[name=\''+field_id+'\']').parent('div').removeClass('has-error');
        }
    }
}



function CheckNumericFieldsSingle(elem,event){
    if(typeof elem == 'undefined' || elem == null || typeof elem.name == 'undefined' || elem.name == null){
        return true;
    }
    
    var field_id = elem.name;
    if(numeric_fields.indexOf(field_id)>-1  && decimal_fields.indexOf(field_id)<=-1){
        return validateNumberKeyPress(elem,event);
    }
}

function validateNumberKeyPress(el, e) {
    if( ((e.which == 9) || (e.which == 46) || (e.which == 8) || (e.which == 110) || (e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105))){
        if(e.which ==110 || e.shiftKey===true){
            
            return false;
        }
    }
    else{
        return false
    }
    return true;
}

function showRequiredError(field_id){
    console.log(field_id);
    setTimeout(function(){
        $('#otherError_'+field_id).hide();
        $('#requiredError_'+field_id).show();
        $('div.' + field_id + ' .form-group').addClass("has-error");
        makeTableBorderRed(field_id);
    },100);
}


function showOtherFieldError(field_id,error_msg){
    setTimeout(function(){
        $('#requiredError_'+field_id).hide();
        $('#otherError_'+field_id).show();
        $('#otherError_'+field_id).html(error_msg);
        makeTableBorderRed(field_id);
        $('div.' + field_id + ' .form-group').addClass("has-error");
    },100);
}
function disableEditApplicationFields(){
    if(typeof disableSpecificFields != 'undefined'){
           for (var x in disableSpecificFields){
               if($("[id^='"+disableSpecificFields[x]+"']").has('option').length >0){
                    $("[id^='"+disableSpecificFields[x]+"']").prop('disabled',true);  
                    $("#"+disableSpecificFields[x]+" option").prop('disabled',true).trigger("chosen:updated");
                }else{
                    $("[id^='"+disableSpecificFields[x]+"']").prop('disabled',true);  
                }
                if($("[id='other_"+disableSpecificFields[x]+"']").length > 0){
                    $("[id='other_"+disableSpecificFields[x]+"']").prop('disabled',true);  
                }
           }
        }
}
function stripslashes(str) {
    str = str.replace(/\\'/g, '\'');
    str = str.replace(/\\"/g, '"');
    str = str.replace(/\\0/g, '\0');
    str = str.replace(/\\\\/g, '\\');
    return str;
}
function confirmResubmitSave(redirect_type){
        $("#ConfirmPopupArea").css('z-index', 11001);
        $("#ConfirmPopupArea .btn-default").css('background-color','#d9d9d9');
         $("#ConfirmPopupArea .btn-default").css('padding','5px 25px');
         
        if(reopenConfirmMsz==''){
            reopenConfirmMsz = "Do you Want to update?";
        }
        
        var div = document.createElement("div");
        div.innerHTML = reopenConfirmMsz;
        var text = div.textContent || div.innerText || "";
        var textLength = text.length;
        if(textLength >= 1000){
            $("#ConfirmPopupArea .modal-dialog").addClass('modal-lg');
        }
        $('#ConfirmMsgBody').html(stripslashes(reopenConfirmMsz));
        
        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .one('click', '#confirmYes', function (e) {
            
        var flag=false;
        if($("option[disabled]","#save_data").length>0){
            $("option","#save_data").prop('disabled',false).trigger("chosen:updated");
        }
        if($("*","#save_data").prop('disabled')){
            $("*","#save_data").prop('disabled',false) ;
        }
        
        field_focus=false;
        //copyPermanentCorrespondenceAddress(MACHINE_NPF_ADDRESS);
        if(redirect_type==="exit_wt_req"){
            redirect_type='exit';
        }else if(redirect_type==="skip"){
            redirect_type='next';
        }else if(redirect_type==="stepwise_preview"){
            redirect_type='preview';
        } else {
            if (CheckRequiredFields() == true && (!jsVars.isNextPageLocked || (typeof reopen_form_logic_id != 'undefined' && reopen_form_logic_id != 0))) {
                
                //IFMR forms condition
                if ((typeof currentPageFieldsList != 'undefined') && (typeof jsVars.redirectToPreviousPage != 'undefined') && 
                    (typeof errorInRequiredFields != 'undefined') && (currentPageFieldsList.length > 0) && (errorInRequiredFields.length > 0)) {
 
                    for (var i = 0; i < errorInRequiredFields.length; i++) {
                        var fieldId = errorInRequiredFields[i];
                        if (currentPageFieldsList.indexOf(fieldId) == -1) {
                            //console.log(fieldId);
                            //setTimeout(function(){
                                window.location.href =  jsVars.redirectToPreviousPage;
                            //}, 5000);
                        }
                    }
                }
                flag = true;
            }
        }
        
        if(CheckEmailFields()==true){
            flag=true;
        }
        if(CheckMaxMinFields()==true){
            flag=true;
        }
        if(CheckMaxMinWordsFields()==true){
            flag=true;
        }
        if(CheckDecimalPlaces()==true){
            flag=true;
        }
        if(custom_script()==true){
            flag=true;
        }
        if(CheckNumericFields()==true){
            flag=true;
        }
        if(CheckMaxValueInNumericFields()==true){
            flag=true;
        }
        if(CheckAlphabetFields()==true){
            flag=true;
        }
        if(tableYearCondition()==true){
            flag=true;
        }
        if(CheckUniqueFieldsGroup()==true){
            flag=true;
        }
        if(CheckDateValue()==true){
            flag=true;
        }
        if(CheckMobileFields()==true){
            flag=true;
        }
        if (CheckWhiteListChars() == true) {
            flag = true;
        }
        
        //if All form builder validation pass
        if(!flag) {
            $('#conditional_js_error').hide();
            if(ResetJS()==true){
                $('#conditional_js_error').html("There is some error in form. Please check fields from starting stage.")
                $('#conditional_js_error').fadeIn();
                flag=true;
            }
        }
        
        if(checkAadharNo()==true){
            flag=true;
        }

        if(typeof lastScrollOffset !='undefined' && lastScrollOffset>0){
            $('html, body').animate({
                  scrollTop: lastScrollOffset - 100
               }, 700);
                lastScrollOffset = 0;
        }
        
        if(flag==true){
              // FinallySave(redirect_type);
            if (typeof reopen_form_logic_id != 'undefined') {
                if(reopen_form_logic_id != 0 ){
                    $("*","#save_data").not(".acc-link").prop('disabled',true) ;
                    $(".textfield","#save_data").attr('style', 'color :graytext !important');
                     $(".datepicker","#save_data").attr('style', 'color :graytext !important');
                    $("option","#save_data").attr('disabled',false).trigger("chosen:updated"); 
                    for(var x in reopenFields){
                        if($("[id^='"+reopenFields[x]+"']").has('option').length >0){
                            $("[id^='"+reopenFields[x]+"']").prop('disabled',false);  
                            $("#"+reopenFields[x]+" option").prop('disabled',false).trigger("chosen:updated");
                            $("[id^='"+reopenFields[x]+"']").prop('readonly',false);
                        }else{
                           $("[id^='"+reopenFields[x]+"']").prop('disabled',false);  
                           $("[id^='"+reopenFields[x]+"']").prop('readonly',false);
                        }
                    }
               }
            $('#ConfirmPopupArea').modal('hide');
            }
            
            return false;
        }
        else{
            
            if(redirect_type == 'offline')
            {
               current_page = offline_current_page;                
            }
//            if(url_page_no == lastReopenPage && lastReopenPage!=0 && redirect_type !='preview'){
//                $("#ConfirmPopupArea").css('z-index', 11001);
//                if(reopenConfirmMsz==''){
//                    reopenConfirmMsz = "Are you Want to update?";
//                }
//                $('#ConfirmMsgBody').html(reopenConfirmMsz);
//                $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
//                     .one('click', '#confirmYes', function (e) {
//                      $('.loader-block').show();
//                      FinallySave(redirect_type);
//                $('#ConfirmPopupArea').modal('hide');
//                });
//                return false;
//            }else{
                $('.loader-block').show();
                FinallySave(redirect_type);
           // }
            
        }     
    });
    return true;
  }


    function ajaxUploadFiles(form_id,field_id,max_upload){
        var isReferenceUser = 0;
        let fieldName = $('#'+field_id).attr('name');
        let formData = new FormData();
        var filesinfo = document.getElementById(field_id).files;

        if($('[name="college_form_edit"]').length>0){
            formData.append('college_form_edit',$('[name="college_form_edit"]').val());
        }
        
        if($('[name="reference_fields"]').length>0){
            formData.append('reference_fields',$('[name="reference_fields"]').val());
        }

        formData.append('current_file_upload_id',field_id );
        formData.append('current_file_max_no_files',max_upload );
        if($('#post_submission').length>0 && $('#post_submission').val()==='post_editable_fields'){
            formData.append('post_submission','post_editable_fields' );
        }

        for(let i=0;i<filesinfo.length;i++){
            formData.append(fieldName, filesinfo[i], filesinfo[i].name);
        }
        if($('#'+form_id).attr('action').match(/\/form\/reference-details-save\//)){
            var uploadUrl  = $('#'+form_id).attr('action').replace('/form/reference-details-save/','/form/uploadfiles/');
        }
        else if($('#'+form_id).attr('action').match(/\/form\/submit\//)){
            var uploadUrl  = $('#'+form_id).attr('action').replace('/form/submit/','/form/uploadfiles/');
        }
        $.ajax({
            url: uploadUrl,
            type: 'post',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                if(typeof data['error'] !=='undefined' && (data['error'] === 'redirect' || data['error'] === 'error')){
                    window.location.href= college_slug+'/dashboard/';
                }
                else if(typeof data['err_msg'] !=='undefined' && data['err_msg']!==''){
                    $('.file-loader-block').hide();
                    showError(field_id, data['err_msg']);
                }
                else if(typeof data['success'] !=='undefined' && data['success']===200){
                    var file_link   = data['file_link'];
                    var files_params = data['files_params'];
                    var call_from = data['call_from']
                    if(typeof data['isReferenceUser'] !=='undefined' && data['isReferenceUser'] !== null){
                        isReferenceUser = data['isReferenceUser'];
                    }
                    hideFileLoader(file_link,field_id, files_params,isReferenceUser,call_from);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        return;
    }

//this is for page wiase edit application
function checkAadharPreview(stageId) {
    var formAttrId ='';
    if(typeof stageId!='undefined' && stageId!='' && stageId!=null){
        if($('#newApplicationEditView'+stageId).length>0){
            formAttrId = '#save_data_'+stageId+' ';
        }
    }

    var flag=false;
    if($(formAttrId+'#aadhar_card_no[name=\'aadhar_card_no\']').length > 0 && $(formAttrId+'#aadhar_card_no').val()!=""){
        var val_aadhar=$(formAttrId+'#aadhar_card_no').val();
        $.ajax({
            url: college_slug+'/form/check-unique-value/'+current_page,
            type: 'post',
            //async: false,
            dataType: 'json',
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            data: {
                "form_id"   : jsVars.form_id,
                'value'     : val_aadhar,
                'check'     : "unique_aadhar"
            },
            success: function (data) {
                if(data['session_logout']=="1"){
                    window.location.href= college_slug+'/dashboard/';
                }else{

                    if(data['message']=="1"){
                        flag=true;
                        $('#otherError_aadhar_card_no').show();
                        $('#otherError_aadhar_card_no').html("Duplicate Aadhaar No");
                        scrollToField("aadhar_card_no");
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        }); // ajax closes
    } // aadhar_card_no
    return flag;
}


function CheckUniqueFieldsGroupPreview(stageId) {
    var formAttrId ='';
    if(typeof stageId!='undefined' && stageId!='' && stageId!=null){
        if($('#newApplicationEditView'+stageId).length>0){
            formAttrId = '#save_data_'+stageId+' ';
        }
    }
    var flag=false;
    var arr_length = unique_fields_group.length;

    for (var i = 0; i < arr_length; i++) { // multiple groups array
       field_id_arr=unique_fields_group[i];
       var sub_arr_length = field_id_arr.length;
       for (var a = 1; a < sub_arr_length; a++) { // get all fields of array
            compare_field_from=field_id_arr[a];
            

            if(($(formAttrId+'#'+compare_field_from).val()!="" && $(formAttrId+'#'+compare_field_from).val()=='Other') && ($(formAttrId+'#other_'+compare_field_from).length>0)){
                var compare_form_val = '';//$(formAttrId+' #other_'+compare_field_from).val();
            }
            else{
                var compare_form_val = $(formAttrId+'#'+compare_field_from).val();
            }
            for (var b = a+1; b < sub_arr_length; b++) { // compare field value with other array fields
                compare_field_to=field_id_arr[b];
                
                if(($(formAttrId+'#'+compare_field_to).val()!="" && $(formAttrId+'#'+compare_field_to).val()=='Other') && ($(formAttrId+'#other_'+compare_field_to+'[name=\'other_'+compare_field_to+'\']').length>0)){
                    var compare_to_val = $(formAttrId+'#other_'+compare_field_to+'[name=\'other_'+compare_field_to+'\']').val();
                }else{
                    var compare_to_val = $(formAttrId+'#'+compare_field_to+'[name=\''+compare_field_to+'\']').val();
                }
                
                //$('#otherError_'+compare_field_from).hide();
               // $('#otherError_'+compare_field_to).hide();
                if(compare_field_from !="" && compare_field_to !="" 
                        && $(formAttrId+'#'+compare_field_from+'[name=\''+compare_field_from+'\']').length 
                        && compare_form_val!=""  
                        && compare_form_val==compare_to_val
                        )
                {
                    
                    
                    flag=true;
                    $('#otherError_'+compare_field_from).show();
                    $('#otherError_'+compare_field_to).show();
                    $('#otherError_'+compare_field_from).html(field_id_arr[0]);
                    $('#otherError_'+compare_field_to).html(field_id_arr[0]);
                    scrollToField(compare_field_from);
                }
            }

        }
    }
    return flag;
}

function initializeSumoSelect(){
    try{
        if($('.sumo-select-new').length>0){
            $('.sumo-select-new').SumoSelect({search: true, searchText: 'Search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true});
        }
    }
    catch(error){}
}

$(document).on('click','.view_pdf',function(){
    var link = $(this).attr('href');
    window.open(link, "_blank", "width=1200, height=600, scrollbars=yes, left=100, top=50");
    return false;
})
//$(document).ready(function () {
//    $('#SuccessPopupArea').on('hidden.bs.modal', function () {
//        if(typeof college_slug!='undefined'){
//            window.location.href = college_slug+'/dashboard/';    
//        }
//    });
//});
   
function unipePayment(paymentType,formId,resubmissionLogicId,unipe_fee_id){
    $.ajax({
        url: jsVars.FULL_URL+'/get-token-fee-payment-button',
        type: 'post',
        dataType: 'json',
        async: false,
        data: {
            "formId": formId,"paymentType":paymentType,"unipe_fee_id":unipe_fee_id
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
              $('#viewOnlineOffline').html('<div class="Loader-block"></div>');
        },
        complete: function () {
            //$('#showExamScheduleList').html('');
        },
        success: function (json) {
            if (json['redirect']) {
                location = json['redirect'];
            } else if (json['error']) {
                notifyAlert(json['error'], 'error');
            } else if (json['uniPeFeeUrlString']) {
                 unipeOrderGenerate(json['uniPeFeeUrlString'],resubmissionLogicId);  
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });    
}
function unipeOrderGenerate(data,resubmissionLogicId){
    $.ajax({
        url: jsVars.FULL_URL + '/generate-order',
        type: 'post',
        dataType: 'json',
        async: true,
        data: {
            "feeData": data,"resubmissionLogicId":resubmissionLogicId
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('.newLoader').show();
        },
        success: function (data) {
            if (data['url']) {
                window.location.href = data['url'];
            } else {
                $('.newLoader').hide();
                var error = 'Something went wrong!';
                if (data['error']) {
                    error = data['error'];
                }
                alertPopup(error, 'error');
            }
        },
        complete: function () {
            //$('.newLoader').hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

