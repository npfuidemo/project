$(document).ready(function(){
    $('[data-toggle="popover"]').popover();
    if($('#verticalTab').length){
    $('#verticalTab').easyResponsiveTabs({
        type: 'vertical',
        width: 'auto',
        fit: true
    });
}
    //call load templates on page load
    if($("#manage-widget-layout").length>0){
        LoadWidgetData("reset");
        LoadReportDateRangepicker();
    }
    if($("#verification_mail").length > 0 || $("#otp_enabled").length > 0){
        $("select[name='college_id']").on("change", getDefaultVerificationMailAndOtpConfig);
    }
    /*$(".ellipsis-left .removeHover").hover(function(){
        $('.dropdown').removeClass('open');
        $(this).removeClass('open');
    });*/
    if($("#create-widget-step-one").length>0){
        $('.select_field').on('click' ,function(e) {
            $('#select_all').attr('checked',false);
        });
    }
    
	if($('#accordion').length > 0){
		var panelPos = $('#accordion').offset().top - 180;
		//alert(panelPos);
		$('.panel').on('hide.bs.collapse', function (e) {
			$(this).find('.more-less').toggleClass('fa-angle-down fa-angle-up')
			$(this).find('.panel-collapse').removeClass('animated fadeIn');
			$("html, body").animate({ scrollTop: panelPos });
		})
		$('.panel').on('show.bs.collapse', function (e) {
			$(this).find('.more-less').toggleClass('fa-angle-down fa-angle-up');
			$(this).find('.panel-collapse').addClass('animated fadeIn');
			$("html, body").animate({ scrollTop: panelPos });
		})
	}
	
 /**
    * drang and drop function of nestable
    * @returns {undefined}
    */
    if($("#create-widget-step-three").length>0){
        $('#nestable3').nestable();
        $('#nestable').nestable();
        
        // We can watch for our custom `fileselect` event like this
        $(document).ready( function() {
        // We can attach the `fileselect` event to all file inputs on the page
        $(document).on('change', ':file', function() {
        var input = $(this),
         numFiles = input.get(0).files ? input.get(0).files.length : 1,
         label = input.val().replace(/\\/g, '/').replace(/.*\//, '');

        input.trigger('fileselect', [numFiles, label]);
        });
            fileSelectShow();
        });
    }

// remove upload css on step wise page
    $(document).on('click', '.removeJsContainer', function () {
        $(this).parents('.upload_js_file-blk').remove();
        $('.upload-js-lable:first').show();
        if($('.upload_js_file-blk').length == 1) {
            $('.removeJsContainer').remove();
        }
    });
// add more upload js on step wise page
    $(document).on('click', '.AddMoreJs', function () {
        var UploadJs = $('.upload_js_file-blk').length;
        var UploadedJsAdded = $('.upload_js_added-blk').length;
        if ((UploadedJsAdded+UploadJs) < 10) {
            var removeButton = '<button class="btn-info btncustom removeJsContainer" type="button"><i aria-hidden="true" class="fa fa-minus"></i></button>';
            var jsHtml = $(".upload_js_file-blk:first").clone();
            //remove text value on add more for remove previouse value
            $(jsHtml).find(":text").val('');
            $(this).parents('.upload_js_file-blk').after(jsHtml);
            $('.removeJsContainer').remove();
            $('.AddMoreJs').after(removeButton);
            $('.upload-js-lable').hide();
            $('.upload-js-lable:first').show();
            fileSelectShow();   
        } else {
            alertPopup('A maximum of 10 Js can be uploaded.', 'error');
            $('#ErroralertTitle').html('Js Upload Maximum Limit reached');
        }
    });
    
    
    // remove upload css on step wise page
    $(document).on('click', '.removeCssContainer', function () {
        $(this).parents('.upload_css_file-blk').remove();
        $('.upload-css-lable:first').show();
        if($('.upload_css_file-blk').length == 1) {
            $('.removeCssContainer').remove();
        }
    });
    
    // add more upload css on step wise page
    $(document).on('click', '.AddMoreCss', function () {
        var UploadCss = $('.upload_css_file-blk').length;
        var UploadedCssAdded = $('.upload_css_added-blk').length;
        if ((UploadedCssAdded+UploadCss) < 5) {
            var removeButton = '<button class="btn-info btncustom removeCssContainer" type="button"><i aria-hidden="true" class="fa fa-minus"></i></button>';
            var cssHtml = $(".upload_css_file-blk:first").clone();
            $(cssHtml).find(":text").val('');
            $(this).parents('.upload_css_file-blk').after(cssHtml);
            $('.removeCssContainer').remove();
            $('.AddMoreCss').after(removeButton);
            $('.upload-css-lable').hide();
            $('.upload-css-lable:first').show();
            fileSelectShow();
        } else {            
            alertPopup('A maximum of 5 CSS can be uploaded.', 'error');
            $('#ErroralertTitle').html('CSS Upload Maximum Limit reached');
        }
    });
    
	if($(".sumo-select").length){
		$('.sumo_select').SumoSelect({placeholder: 'Select Value', search: true, searchText:'Search reportees', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });  
	}
    
    
    $(document).on('click','.checkboxSpace',function(){
        var keyName = $(this).attr('data');
        var childKey = $(this).attr('alt');
        var Ccounter=0;
        var childCounter=0;
        if(keyName=='course_id'){
            
            $(".class_"+keyName).each(function() {
                if ($(this).is(':checked')) {
                    Ccounter++;
                }
            });
            
            $(".child_class_"+keyName+'_'+childKey).each(function() {
                if ($(this).is(':checked')) {
                    childCounter++;
                }
            });
            
            if($('#parentId'+childKey).is(':checked')){
            }else{
                $(".child_class_"+keyName+'_'+childKey).prop('checked', false);
            }
            
            var courseCount = 0;
            if(childCounter==1 && Ccounter==1)
                courseCount = Ccounter+childCounter;
            
            if(courseCount==2){
                $("#autoSaveId"+keyName).show();
            }else{
                $("#autoSaveId"+keyName).hide();
                $("#autoSaveIdCheckbox"+keyName).prop('checked', false);
            }
        }else{
            var otherCount = 0;
            $(".class_"+keyName).each(function() {
                if ($(this).is(':checked')) {
                    otherCount++;
                }
            });

            if(otherCount==1){
                $("#autoSaveId"+keyName).show();
            }else{
                $("#autoSaveId"+keyName).hide();
                $("#autoSaveIdCheckbox"+keyName).prop('checked', false);
            }
        }
        
    });
    
    if($("#form_mapping_by_registration_field_div").length){
        disableSelectedRegistrationField();
    }
    sumoDropdown();
    getThnankYouSetting();
    $(document).on('click','input[name="dimensions[thankyou_type]"]', function(){
        getThnankYouSetting();
    });

    });
    
function sumoDropdown(){
    $('.form_register_mapping_div').each(function(){
       this.selected = false;
       id =$(this).attr('id');
	$('#'+id+' .registration_field_value').SumoSelect({placeholder: 'Select Field', search: true, searchText:'Select Field', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
        if($('#'+id+' .registration_field_value')[0] && $('#'+id+' .registration_field_value')[0].sumo ){
            $('#'+id+' .registration_field_value')[0].sumo.reload();
        }
        
        $('#'+id+' .calling_button_field').SumoSelect({placeholder: 'Select Field', search: true, searchText:'Select Field', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
        if($('#'+id+' .calling_button_field')[0] && $('#'+id+' .calling_button_field')[0].sumo ){
            $('#'+id+' .calling_button_field')[0].sumo.reload();
        }
    });
}


function getDefaultVerificationMailAndOtpConfig(){
    $('#verification_mail').html('');
    $('#otp_enabled').html('');
    if( $("select[name='college_id']").val()==='' ){
        return;
    }
    $.ajax({
        url: jsVars.getVerificationMailAndOtpConfigLink,
        type: 'post',
        data: {collegeId:$("select[name='college_id']").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        complete: function () {
            $('#verification_mail').trigger("chosen:updated");
            $('#otp_enabled').trigger("chosen:updated");
        },
        success: function (response) {            
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    if(responseObject.data.widget_verification_mail == "1"){
                        $('#verification_mail').html('<option value="1" selected=true>Yes</option><option value="0">No</option>');
                        $("#communicationDiv").hide();
                    }else{
                        $('#verification_mail').html('<option value="0" selected=true>No</option><option value="1">Yes</option>');
                        $("#communicationDiv").show();
                    }
                    if(responseObject.data.otp_enabled == "1"){
                        $('#otp_enabled').html('<option value="1" selected=true>Yes</option><option value="0">No</option>');
                    }else{
                        $('#otp_enabled').html('<option value="0" selected=true>No</option><option value="1">Yes</option>');
                    }
                }
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alert(responseObject.message);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
}

function LoadWidgetData(listingType) {
    //make buttun disable
    $(':input[type="button"]').attr("disabled", true);
    var data = [];
    if (listingType === 'reset') {
        varPage = 0;
        $('#load_more_widget_container').html("");
        $('#load_more_button').show();
        $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;&nbsp;Loading...');
    }
    data = $('#FilterWidgetList,#FilterWidgetList1').serializeArray();
    data.push({name: "page", value: varPage});
    data.push({name: "type", value: listingType});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;&nbsp;Loading...');
    $.ajax({
        url: jsVars.FULL_URL + '/templates/ajax-manage-widget',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
            $(':input[type="button"]').removeAttr("disabled");
        },
        async: true,
        success: function (data) {
            varPage = varPage + 1;
            var checkError  = data.substring(0, 6);
            if (data === "session_logout") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(data.substring(6, data.length));
                $('#load_more_button').hide();
            } else {
                data = data.replace("<head/>", '');
                var countRecord = countResult(data);
				//alert(countRecord);
                if (listingType === 'reset') {
                    $('#load_more_widget_container').html(data);
                } else {
                    $('#load_more_widget_container').find("tbody").append(data);
                }
                if (countRecord < 10) {
                    $('#load_more_button').hide();
                } else {
                    $('#load_more_button').show();
                }
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Load More Widgets');
				table_fix_rowcol();
				dropdownMenuPlacement();
				determineDropDirection();
				$('.offCanvasModal').modal('hide');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function countResult(html) {
    var len = (html.match(/listDataRow/g) || []).length;
    return len;
}



function GetWidgetUsers(college_id){
     if (college_id) {
        $.ajax({
            url: jsVars.GetWidgetUsersLink,
            type: 'post',
            data: {CollegeId: college_id},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json)
            {
                if (json['redirect'])
                    location = json['redirect'];
                else if (json['error'])
                    alertPopup(json['error'], 'error');
                else if (json['status'] == 200) {
                    var html = "<option value=''>Updated by</option>";
                        html += json["updateList"];
                    $('#updated_by').html(html);
                    
                    var html = "<option value=''>Created by</option>";
                        html += json["userList"];
                    $('#created_by').html(html);
                    
                    $('#created_by').trigger('chosen:updated');
                    $('#updated_by').trigger('chosen:updated');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        
    } else {
        $('#created_by').html('<option value="">Created by</option>');
        $('#updated_by').trigger('<option value="">Published by</option>');
        $('#created_by').trigger('chosen:updated');
        $('#updated_by').trigger('chosen:updated');
    }
}


function LoadCollegeForms(value, default_val) {
        var data =  'college_id='+value+'&default_val='+default_val;
    $.ajax({
        url: '/voucher/get-forms',
        type: 'post',
        dataType: 'html',
       
        data:data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        async:false,
        success: function (data) {
            if(data === "session_logout"){
                window.location.reload(true);
            }
            
            $('#div_load_forms').html(data);
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.chosen-select').trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getFormIinterestedInList(collegeId){
    LoadCollegeForms(collegeId, '');
    $("#form_id").find("option[value='0']").text('Select Form Interested In');
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    $('.chosen-select').trigger('chosen:updated');
}


/**
 * return all form name of given widget
 * @param {int} widget_id
 * @return {html}
 */
function showWidgetForms(widget_id) {
   
    $.ajax({
        url: jsVars.FULL_URL + '/templates/get-widget-forms',
        type: 'post',
        dataType: 'html',
        
        data: {'widget_id':widget_id},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('div.loader-block').show();
        },
        complete: function () {
            $('div.loader-block').hide();
        },
        async:false,
        success: function (response) {
            if(response === 'session_logout'){
                window.location.reload(true);
                return false;
            }
            $('#mainData').html(response);
            $("#DisplayFormsHere").trigger('click');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


/****this function added for only file type fieds*****/
function fileSelectShow(){
      $(':file').on('fileselect', function(event, numFiles, label) {
          var input = $(this).parents('.input-group').find(':text'),
              log = numFiles > 1 ? numFiles + ' files selected' : label;
              
          if( input.length ) {
              input.val(log);
          } else {
              if( log ) alert(log);
          }
      });
}

function selectAll(elem){
    if(elem.checked){
        $('.select_field').not(".disable-check").each(function(){
            this.checked = true;
        });
    }else{
        $('.select_field').not(".disable-check").attr('checked',false);
    }
}

// to get child list of machine key rendered in html

function getChildList(div_id,machine_key,widgetId,fieldKey, collegeId, parentKey){
    if(machine_key && machine_key !== undefined && machine_key !== null ){
        $.ajax({
            url : jsVars.FULL_URL + '/templates/get-child-list',
            type : 'post',
            dataType : 'html',
            data: {'machine_key':machine_key,'widgetId':widgetId,'fieldKey':fieldKey, 'collegeId':collegeId, 'parentKey':parentKey,'field_info':div_id},
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('div.loader-block').show();
            },
            complete: function () {
                $('div.loader-block').hide();
            },
            success: function (response) {
                if(response === 'session_logout'){
                    window.location.reload(true);
                    return false;
                }
                
                $('#childListContainer_'+div_id).html(response);
                $('#childListContainer_'+div_id).show();
                $('#hide_btn_'+div_id).show();
                $('#btn_'+div_id).hide();
				
				$('#childListContainer_'+div_id).siblings().not(".listDataRow").hide();
				$('#hide_btn_'+div_id).parents().parents().siblings().find('.hideOpt').hide();
                $('#btn_'+div_id).parents().parents().siblings().find('.showOpt').show();
               
                $('.sumo_select').SumoSelect({placeholder: 'Select Value', search: true, searchText:'Search reportees', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });  
                $('select#level_value_'+fieldKey)[0].sumo.reload();
				$('select.sumo_select').on('sumo:opened', function(sumo) {
				// Do stuff here
				//console.log("Drop down opened", sumo);
				//alert('hello');
				$('.optionGroup').parent().parent().siblings().addClass('optionGroupChild');
				$('.optionGroup').parent().parent().removeClass('optionGroupChild');
                                
                                $("i.optionLastChild").each(function(){
                                    $(this).parent().parent().addClass('optionGroupChild2');
                                });
			});
                
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        })
    }
    
    
}

// function to hide child list dive
    function hideOptions(div_id){
        $('#childListContainer_'+div_id).hide();
        $('#hide_btn_'+div_id).parent().parent().removeClass('bghighlight');
        $('#hide_btn_'+div_id).hide();
        $('#btn_'+div_id).show();
    }
    
    function loadPreview(format){
        $('#dynamic_load').parent("div").removeClass("desktop");
        $('#dynamic_load').parent("div").removeClass("mobile");
        $('#dynamic_load').parent("div").removeClass("mobile_portrait");
        $('#dynamic_load').parent("div").removeClass("tablet");
        $('#dynamic_load').parent("div").removeClass("tablet_portrait");
        $('#dynamic_load').parent("div").removeClass("zoomIn");
		 $('#dynamic_load').parent("div").removeClass("custom-frame");
        $('#dynamic_load').parent("div").hide();
        $("#dynamic_load").css({"height": "", "width": ""});
        $('.widgetFrame').hide();
         
        if(format=="custom"){
            width = $('#preview_width').val();
            height = $('#preview_height').val();
			$('#dynamic_load').parent("div").addClass('custom-frame');
            $("#dynamic_load").css({"height": height+"px", "width": width+"px"});
            
            $('iframe').css('height',(height)+"px");
            
        }else{
            $('#preview_width').val("");
            $('#preview_height').val("");
            $('#dynamic_load').parent("div").addClass(format);
            //var height = $('div.'+format).css('height');
            var height = $('#dynamic_load').css('height');
            height=parseInt(height.replace("px", ""));
            $('iframe').css('height',(height)+"px");
            
        }
		$('i').removeClass('active');
		$('i.preview_'+format).addClass('active');
        
        $('#dynamic_load').parent("div").show();
        $('#dynamic_load').parent("div").addClass("zoomIn");
         $('.widgetFrame').show();
         
        
       
        
        
    }
    
    
    
    function updateWidgetStatus(status_text,w_id, c_id){
        
        $('#confirmTitle').html('Confirm Action');
        $('#ConfirmMsgBody').html('Are you sure you want to ' + status_text + ' this widget?');
        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();
    
                $.ajax({
                    url : jsVars.FULL_URL + '/templates/widget-status',
                    type : 'post',
                    dataType : 'html',
                    data: {'status_text':status_text,'w_id':w_id,'c_id':c_id},
                    headers: {
                        "X-CSRF-Token": jsVars._csrfToken
                    },
                    beforeSend: function () {
                        $('div.loader-block').show();
                    },
                    complete: function () {
                        $('div.loader-block').hide();
                    },
                    success: function (response) {
                        if(response === 'session_logout'){
                            window.location.reload(true);
                            return false;
                        }
                        
                        if(response=="error"){
                            window.location.reload(true);
                            return false;
                        }else{
                            alertPopup("Widget has been "+status_text+"d.", "success", location);
                            $("#SuccessPopupArea #alertTitle").html("Success");
                            $("#SuccessPopupArea #OkBtn").attr("href",location);
                            $("#SuccessPopupArea #OkBtn").show();
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    }
                })
            
                $('#ConfirmPopupArea').modal('hide');
          });
        return false;
        
    }
    
    
    
    
    function getCode(w_id){
        $.ajax({
            url : jsVars.FULL_URL + '/templates/get-code',
            type : 'post',
            dataType : 'html',
            data: {'w_id':w_id},
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('div.loader-block').show();
            },
            complete: function () {
                $('div.loader-block').hide();
            },
            success: function (response) {
                if(response === 'session_logout'){
                    window.location.reload(true);
                    return false;
                }

                if(response=="error"){
                    window.location.reload(true);
                    return false;
                }else{
                    alertPopup(response, "success", 'javascript:void(0)');
					$("#SuccessPopupArea").addClass('modalCustom');
                    $("#SuccessPopupArea #alertTitle").html("Embed JS Code");
                    $("#SuccessPopupArea #OkBtn").hide();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        return false;
        
    }
	
	




function exportWidgetCsv(){
    var $form = $("#FilterWidgetList");
    $form.attr("action",jsVars.exportWidgetCsvLink);
    $form.attr("target",'modalIframe');
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    $('#myModal').modal('show');
    $form.submit();
    $form.attr("onsubmit",onsubmit_attr);
    $form.removeAttr("target");
}

var downloadWidgetFile = function(url){
    window.open(url, "_self");
};


function publishWidget(w_id){
        
        $('#ConfirmMsgBody').html('Are you sure to publish this widget?');
        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();
    
                $.ajax({
                    url : jsVars.FULL_URL + '/templates/publish-widget',
                    type : 'post',
                    dataType : 'html',
                    data: {'w_id':w_id},
                    headers: {
                        "X-CSRF-Token": jsVars._csrfToken
                    },
                    beforeSend: function () {
                        $('div.loader-block').show();
                    },
                    complete: function () {
                        $('div.loader-block').hide();
                    },
                    success: function (response) {
                        if(response === 'session_logout'){
                            window.location.reload(true);
                            return false;
                        }
                        
                        if(response=="error"){
                            window.location.reload(true);
                            return false;
                        }else{
                            alertPopup("Widget has been published successfully..", "success", location);
                            $("#SuccessPopupArea #alertTitle").html("Success");
                            $("#SuccessPopupArea #OkBtn").attr("href",location);
                            $("#SuccessPopupArea #OkBtn").show();
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    }
                });
            
                $('#ConfirmPopupArea').modal('hide');
          });
        return false;
        
    }


function selectMandatory(field){
    if($('#all_'+field).prop('checked')==true){
        $('#man_'+field).attr("checked","checked");
        $('#man_'+field).prop("checked",true);
    }else{
        $('#man_'+field).removeAttr("checked");
    }
}

/**copy code ***/

function selectText(id){
    var sel, range;
    var el = document.getElementById(id); //get element id
    if (window.getSelection && document.createRange) { //Browser compatibility
      sel = window.getSelection();
      if(sel.toString() == ''){ //no text selection
         window.setTimeout(function(){
            range = document.createRange(); //range object
            range.selectNodeContents(el); //sets Range
            sel.removeAllRanges(); //remove all ranges from selection
            sel.addRange(range);//add Range to a Selection.
        },1);
      }
    }else if (document.selection) { //older ie
        sel = document.selection.createRange();
        if(sel.text == ''){ //no text selection
            range = document.body.createTextRange();//Creates TextRange object
            range.moveToElementText(el);//sets Range
            range.select(); //make selection.
        }
    }
}

function copyToClipboard(element) {
	
	selectText(element); 
	  var $temp = $("<input>");
          //alert('hello');
	  $("body").append($temp);
	  $temp.val($('#'+element).text()).select();
	  document.execCommand("copy");
	  $temp.remove();
}

function chekCountOfSelection(elemt,keyField) {
    
    $("#autoSaveId"+keyField).hide();
    var selectedValue = $('#level_value_'+keyField).val();
    $("#autoSaveIdCheckbox"+keyField).prop('checked', false);
    
    var isDependentField = false;
    if(typeof jsVars.dependentFieldList[keyField] !== 'undefined' &&
       jsVars.dependentFieldList[keyField] != '') {
        isDependentField = true;
    }
    
    if(keyField=='course_id' || isDependentField){
        
        var dependnt = false;
        $('#level_value_'+keyField+' option').each(function(){
            var selectedItems   = $(this).val();
            var explode = selectedItems.split('_');
            if(typeof explode[1]!='undefined') {
                dependnt = true;
                return false;
            }
        });
        if(dependnt){
            var hh = $('#level_value_'+keyField).SumoSelect();
            var allVal = $(elemt).val();
            $(allVal).each(function(i,val){
                var explode = val.split('_');
                if(typeof explode[1]!='undefined' && explode[1]!='') {
                    if(explode.length>2) { //For Handle Registration Dependent Field
                        var lastValue='';
                        $(explode).each(function(childDependentKey,childDependentVal){
                            if(lastValue != '') {
                                lastValue = lastValue+'_'+childDependentVal;
                            } else {
                                lastValue = childDependentVal;
                            }                            
                            $('#level_value_'+keyField)[0].sumo.selectItem(lastValue);
                        });
                    } else {
                        var st = explode[0].toString();
                        hh.sumo.selectItem(st);
                    }
                }
            });
            var selectedValue = $('#level_value_'+keyField).val();
            if(selectedValue!=null && selectedValue.length >=2 && selectedValue.length <=3){
                //Handle for dependent Dropdown
                if(selectedValue.length>2) { //If more than 2 checkbox is selected
                    //Split last index value so we can check for dependent dropdown
                    var checkChild = selectedValue[(selectedValue.length)-1].split('_');
                    if(checkChild.length >2 && typeof checkChild[0]!='undefined' && selectedValue[0]==checkChild[0]) {
                        $("#autoSaveId"+keyField).show();
                    }
                } else {
                    var checkChild = selectedValue[1].split('_');
                    if(typeof checkChild[0]!='undefined' && selectedValue[0]==checkChild[0]) {
                        $("#autoSaveId"+keyField).show();
                    }
                }
            }
        }else{
            if(selectedValue.length==1){
                $("#autoSaveId"+keyField).show();
            }
        }
    }else{
        if(selectedValue.length==1){
            $("#autoSaveId"+keyField).show();
        }
    }
}


//communicationDiv
function showCommunicationDiv(val) {
    if(val==0){
        $("#communicationDiv").show();
    }else{
        $("#communicationDiv").hide();
    }
}


function getTemplateList(collegeId){
    
    $.ajax({
        url: '/templates/getWidgetsTemplateList',
        type: 'post',
        dataType: 'html',
        data:{collegeId:collegeId},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        async:false,
        success: function (data) {
            var responseObject = $.parseJSON(data); 
            if(responseObject.message === "session_logout"){
                window.location.reload(true);
            }
            if(responseObject.status==1) {
                var options = "<option value=''>Select Email Template</option>";
                $.each(responseObject.data.email, function (index, item) {
                    options += "<option value='"+index+"'>"+item+"</option>";
                });
                $("#email_communication_templates").html(options);
                
                options = "<option value=''>Select SMS Template</option>";
                $.each(responseObject.data.sms, function (index, item) {
                    options += "<option value='"+index+"'>"+item+"</option>";
                });
                $("#sms_communication_templates").html(options);
                
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                $('.chosen-select').trigger('chosen:updated');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
}

$(document).on('change', '.registered-fields',function() {
    var field = this.value;
    var collegeId = $("#college_id").val();
    var divId = $(this).parent().attr('id');
    
    
    $.ajax({
        url: '/templates/get-child-field-dropdown',
        type: 'post',
        dataType: 'json',
        data: {
            "field": field,"college_id": collegeId
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            if(typeof json['redirect'] !== 'undefined'){
                window.location(json['redirect']);
            }            
            $('#'+divId+' .registration_field_value').html(json['optionList']);
            $('#'+divId+' .registration_field_value').SumoSelect({placeholder: 'Select Field', search: true, searchText:'Select Field', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
	    $('#'+divId+' .registration_field_value')[0].sumo.reload();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
});

function changeFormMappingField(mappingField){
    $("#form_mapping_by_registration_field_div").hide();
    $("#form_mapping_by_form_div").hide();
    if(mappingField=="registration_field"){
	if($('#form_register_1 .registration_field_value').length > 0) {
	    $('#form_register_1 .registration_field_value').SumoSelect({placeholder: 'Select Value', search: true, searchText:'Search Value', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
	}
        $("#form_mapping_by_registration_field_div").show();
    }else if(mappingField=="form"){
        $("#form_mapping_by_form_div").show();
    }
}

function addFormRegistrationFieldMapping(){
    var addCount = +$("#add_more_count").val() + 1;
    $("#add_more_count").val(addCount);
    $("#form_mapping_by_registration_field_div").append("<div class='form_register_mapping_div animated fadeInUp' id='form_register_"+addCount+"'>"+$('#form_course_mapping_sample_div').html()+"</div>");
    $('#form_register_'+addCount+' .registration_field_value').attr('name','form_mapping[registration_field_value]['+$("#add_more_count").val()+'][]');
    if($('#form_register_'+addCount+' .registration_field_value').length > 0) {
		$('#form_register_'+addCount+' .registration_field_value').SumoSelect({placeholder: 'Select Field', search: true, searchText:'Select Field', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
    }
	if($('#form_register_'+addCount+' .chosen-select').length > 0) {
		$('#form_register_'+addCount+' .chosen-container').remove();
		$('#form_register_'+addCount+' .chosen-select').chosen();
		//$('#form_register_'+addCount+' .chosen-select').trigger("chosen:updated");
    }
    
    disableSelectedForms();
    disableSelectedRegistrationField();
}

function removeFormRegistrationFieldMapping(element){
    $(element).parent().parent("div.form_register_mapping_div").remove();
    disableSelectedForms();
    disableSelectedRegistrationField();
}

function disableSelectedForms(){
//    $(".form_register_mapping_div").find('select.form option').attr('disabled',false);
//    $(".form_register_mapping_div").find('select.form').each(function(){
//        if($(this).val()!== null && $(this).val().length){
//            var selectedItem   = $(this).val();
//            $(".form_register_mapping_div").find('select.form option[value="'+selectedItem+'"]:not(:selected)').attr('disabled',true);
//        }
//    });
//    $(".form_register_mapping_div").find('select.form').trigger('chosen:updated');
}

function disableSelectedRegistrationField(){
//    $(".form_register_mapping_div").find('select.course option').attr('disabled',false);
//    $(".form_register_mapping_div").find('select.course').each(function(){
//        if($(this).val()!== null && $(this).val().length){
//            var selectedItem   = $(this).val();
//            $(".form_register_mapping_div").find('select.course option[value="'+selectedItem+'"]:not(:selected)').attr('disabled',true);
//        }
//    });
//    $(".form_register_mapping_div").find('select.course').trigger('chosen:updated');
}

function getSignAgreement(div_id,widgetId,collegeId){
    if(widgetId && widgetId !== undefined && widgetId !== null ){
        $.ajax({
            url : jsVars.FULL_URL + '/templates/get-sign-agreement',
            type : 'post',
            dataType : 'html',
            data: {'widgetId':widgetId,'collegeId':collegeId},
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('div.loader-block').show();
            },
            complete: function () {
                $('div.loader-block').hide();
            },
            success: function (response) {
                if(response === 'session_logout'){
                    window.location.reload(true);
                    return false;
                }
                $('#childListContainer_'+div_id).html(response);
                $('#childListContainer_'+div_id).show();
                $('#hide_btn_'+div_id).show();
                $('#btn_'+div_id).hide();
                CKEDITOR.replace('agreement_text', {
                    toolbarGroups: [
                        {"name": "basicstyles", "groups": ["basicstyles"]},
                        {"name": "document", "groups": ["mode"]},
                        { "name": 'paragraph', "groups": [ 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
                        { "name": 'links', "groups": [ 'links' ]},
                        { "name": 'insert', "groups": [ 'insert' ]},
                    ],
                    removeButtons: 'Source,Save,NewPage,ExportPdf,Preview,Print,Cut,Templates,Copy,Paste,PasteText,PasteFromWord,Replace,Redo,Undo,Find,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Superscript,Subscript,Strike,RemoveFormat,CopyFormatting,Outdent,Indent,CreateDiv,Blockquote,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,Language,BidiRtl,BidiLtr,Anchor,Image,Flash,Table,HorizontalRule,Smiley,PageBreak,Iframe,Format,Font,FontSize,Styles,TextColor,BGColor,ShowBlocks,Maximize,About,SpecialChar'
                });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

function getWidgetFieldSetting(div_id,widgetId,collegeId){
    if(widgetId && widgetId !== undefined && widgetId !== null ){
       $.ajax({
            url : jsVars.FULL_URL + '/templates/get-widget-field-setting',
            type : 'post',
            dataType : 'html',
            data: {'widgetId':widgetId,'collegeId':collegeId,'field_info':div_id},
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('div.loader-block').show();
            },
            complete: function () {
                $('div.loader-block').hide();
            },
            success: function (response) {
                var checkError  = response.substring(0, 6);
                if (response === 'session_logout'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else if (checkError === 'ERROR:'){
                    alertPopup(response.substring(6, response.length),'error');
                }else{
                    //close accordio when anotheris open 
                    $('#childListContainer_'+div_id).siblings().not(".listDataRow").hide();
                    $('#hide_btn_'+div_id).parents().parents().siblings().find('.hideOpt').hide();
                    $('#btn_'+div_id).parents().parents().siblings().find('.showOpt').show();
                    $('.listDataRow ').removeClass('bghighlight');

                    $('#childListContainer_'+div_id).html(response);
                    $('#childListContainer_'+div_id).show();
                    $('#hide_btn_'+div_id).parent().parent().addClass('bghighlight');
                    $('#hide_btn_'+div_id).show();
                    $('#btn_'+div_id).hide();
                    $('.chosen-select').chosen();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

function getThnankYouSetting(){
    var thankyou_type = $('input[name="dimensions[thankyou_type]"]:checked').val();
    if(typeof thankyou_type!='undefined' && thankyou_type=='1'){
        $('#thank_you_external_url').show();
    } else {
        $('#thank_you_external_url').hide();
        $('#dimensions-thankyou-external-url').val('');
        $('#thankyou_redirect_delay').val('').trigger('chosen:updated');
    }
}

$(document).ready(function(){
    var validDomian = new RegExp(/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i); 
    $('#widget_form').on('submit',function(){
        var thankyou_type = $('input[name="dimensions[thankyou_type]"]:checked').val();
        var external_url = $('#dimensions-thankyou-external-url').val().trim();
        if(thankyou_type=='1' && !external_url.match(validDomian)){
            alertPopup("Invalid thankyou external url",'error');
            return false;
        }
    });
});