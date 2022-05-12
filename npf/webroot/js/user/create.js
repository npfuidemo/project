//Create/Edit user
$(document).ready(function () {
    if($("#createUser").length>0){
        $('#createUser #college_ids').SumoSelect({placeholder: 'Select Institutes to Allocate', search: true, searchText:'Search Institute', selectAll : false, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });  
        $('#createUser #publisherDropdown').SumoSelect({placeholder: 'Select Publisher', search: true, searchText:'Search Publisher', selectAll : false, captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });  
        $('#createUser #account_manager').SumoSelect({placeholder: 'Select Institutes to Allocate Account Manager', search: true, searchText:'Search Institute', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });  
        $('#createUser #select-form').SumoSelect({placeholder: 'Select Forms to be assigned', search: true, searchText:'Search Forms', selectAll : false, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });  
        $('#createUser #assigned-child-users').SumoSelect({placeholder: 'Add reportees', search: true, searchText:'Search reportees', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });  
        
    }
    
    jQuery('.filter_dial_code').on('click', function (e) {
        e.stopPropagation();
    });
	
    if(typeof jsVars.collegeUser !='undefined'){
        if(jsVars.collegeUser==true){
            populateForms();
            loadAssignUsers();
            if(typeof jsVars.checkLimitValidation !='undefined' && jsVars.checkLimitValidation==true){
                checkLimitValidation();
            }
        }
    }
    
});


$( document ).on( 'click', '.bs-dropdown-to-select-group .dropdown-menu-list li', function( event ) {
var $target = $( event.currentTarget );
        var fieldId = $(this).data("fieldid");
        $target.closest('.bs-dropdown-to-select-group')
                .find('[data-bind="bs-drp-sel-value"]').val($target.attr('data-value'))
                .end()
                .children('.dropdown-toggle').dropdown('toggle');
        $target.closest('.bs-dropdown-to-select-group')
        //.find('[data-bind="bs-drp-sel-label"]').text($target.context.textContent);
        .find('[data-bind="bs-drp-sel-label"]').text($target.attr('data-value'));

        //When Select the option from dropdown then close the open dropdown
      $target.closest('.bs-dropdown-to-select-group').removeClass('open');

        //Bydefault remove the value when value will change
        $('#'+fieldId).val('');

        //For change Maxlength value of Mobile Input Box as per selection of country code
        if ($target.attr('data-value') == jsVars.defaultCountryCode) {
            $('#'+fieldId).attr('maxlength',jsVars.maxMobileLength);
        } else {
            $('#'+fieldId).attr('maxlength',jsVars.internationalMaxMobileLength);
        }
        return false;
});

function changeRoleBasedCollegeDropdown(value) {

    $('#select_form_div').show();
    $('#required_form_span').show();
    $('#select_pub_div').hide();
    $('#account_manager_div').hide();
    $('#publisherDropdown').val('');
    $('#publisherDropdown')[0].sumo.reload();
    if(typeof jsVars.collegeUser !='undefined'){
        populateForms();
        loadAssignUsers();
        if(typeof jsVars.checkLimitValidation !='undefined' && jsVars.checkLimitValidation==true){
            checkLimitValidation();
        }
        return false;
    }
    if(value == jsVars.GROUP_PUBLISHER_ID_JS){
        //role publisher has been choosen
        $('#message-div').hide();
        $('#select_pub_div').show();

        $('#account_manager_div').hide();
        
        $('#select-form').val('');
        $('#select_form_div').hide();

        $('#college_ids').val('').attr('disabled', false);
        populateUserColleges('multiple');
        $('select#college_ids')[0].sumo.reload();
        
    }else if (value == jsVars.collegeStaffGroupId || value == jsVars.collegeAdminGroupId) {
        $('#college_ids').removeAttr('multiple');
        populateUserColleges();
        if (value == jsVars.collegeAdminGroupId) {
            $('#select_form_div').hide();
        }
        $('#college_ids').val('').attr('disabled', false);
        $('select#college_ids')[0].sumo.reload();
    }else if (value == jsVars.GROUP_COUNSELLOR_ID_JS) {
        $('#college_ids').removeAttr('multiple');
        $('#college_ids').val('').attr('disabled', false);
        $('select#college_ids')[0].sumo.reload();
        populateUserColleges();
    }else if (value == jsVars.GROUP_AGENT_ID_JS) {
        $('#college_ids').removeAttr('multiple');
        $('#college_ids').val('').attr('disabled', false);
        $('select#college_ids')[0].sumo.reload();
        populateUserColleges();
    }else if (value == jsVars.GROUP_OPERATIONS_ID_JS) {
        $('#account_manager_div').show();
        $('#college_ids').val('').attr('disabled', false);
        populateUserColleges('multiple');
        $('select#account_manager')[0].sumo.reload();
        $('select#college_ids')[0].sumo.reload();
    } else if(value == jsVars.groupCollegeSuperadminId){
        $('#college_ids').val('').attr('disabled', false);
        populateUserColleges('multiple');
        $('#select-form').val('');
        $('#select_form_div').hide();

    }else {
        $('#college_ids').val('').attr('disabled', false);
        populateUserColleges('multiple');
         $('select#college_ids')[0].sumo.reload();
    }
    
    $('#college_ids').val('')
    $('select#college_ids')[0].sumo.reload();
    $('#select-form').val('')
    $('select#select-form')[0].sumo.reload();
    return false;
}

function populateUserColleges(multiple)
{    
    if(typeof multiple !='undefined' && multiple == 'multiple'){
        multiple = true;
    }else{
        multiple = false;
    }
    $.ajax({
        url: '/users/collegeLists',
        type: 'get',        
        dataType: 'json',
        //async: false,
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            
        },
        complete: function () {
            
        },
        async:false,
        success: function (json) {
            $("#institue_error").html("");
            if(json['status']==200){
                if(typeof json['collegeList'] === "object"){
                    $('#createUser #college_ids').SumoSelect({placeholder: 'Select Institutes to Allocate', search: true, searchText:'Search Institute', selectAll : false, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
                    var stateOptions = '<option value="">Select Institutes to Allocate</option>';
                    //console.log(json['collegeList']);
//                    $.each(json['collegeList'], function (index, item) {
//                        stateOptions += '<option value="'+index+'">'+item+'</option>';
//                    });
                    
                    if (multiple==false) {
                        $('#college_ids').html(stateOptions);
                        $('#college_ids').removeAttr('multiple','multiple');
                        $('#college_ids').append(json['collegeList']);
                    }else{
                        
                        $('#college_ids').attr('multiple','multiple');
                        $('#college_ids').html(json['collegeList']);
                    }
                    
                    $('select#college_ids')[0].sumo.reload();
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //reload page
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function checkLimitValidation(){
    
    var college_id = $.trim($("#college_ids").val());
    var roleDropdown = $.trim($("#role_id").val());
    if(typeof roleDropdown=='undefined' || roleDropdown==''){
        return false;
    }
    if (roleDropdown == jsVars.GROUP_OPERATIONS_ID_JS || roleDropdown == jsVars.GROUP_SALES_ID_JS || roleDropdown == jsVars.GROUP_PUBLISHER_ID_JS) {
        return false;
    }
    var data = {'college_id':college_id,'roleDropdown':roleDropdown};
    var userIsEditing = $("#userIsEditing").val();
    var userId = $("#userId").val();
    if(userIsEditing == 2){
        var data = {'college_id':college_id,'roleDropdown':roleDropdown,'editing':2, 'user_id': userId};
    }
     $("#institue_error").html('');
    $.ajax({
        url: '/users/checkLimitValidation',
        type: 'post',
        dataType: 'json',
        data: data,
        beforeSend: function () { 
            $('#listloader').show();
        },
        complete:function(){
            $('#listloader').hide();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        async:false,
        success: function (response) {
            $("#institue_error").html('');
            console.log(response['status']);
            if(response['status']==200){
                $("#institue_error").html(response['message']);
            }else if(response['status']==0){
                return false;
                //window.location.reload(true);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //window.location.reload(true);
        }
    });
}

function loadAssignUsers(){
    var college_id = $.trim($("#college_ids").val());
    var default_assigned_child_users = $.trim($("#default_assigned_child_users").val());
    var roleDropdown = $.trim($("#role_id").val());
    if (roleDropdown == jsVars.GROUP_OPERATIONS_ID_JS || roleDropdown == jsVars.GROUP_SALES_ID_JS) {
        return false;
    }
    $.ajax({
        url: '/users/show-hierarchy-users',
        type: 'post',
        dataType: 'html',
        data: {'college_id':college_id,'default_assigned_child_users':default_assigned_child_users,'roleDropdown':roleDropdown},
        beforeSend: function () { 
            //$('#listloader').show();
        },
        complete:function(){
            //$('#listloader').hide();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        async:false,
        success: function (html) {
            var responseObject = $.parseJSON(html);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(responseObject.message== 'not_counselor'){
                $("#userListOfCounselor").hide();
            }
            if (responseObject.status == 1) {
                $("#userListOfCounselor").show();
                $('#assigned-child-users').html(responseObject.data);
                $('select#assigned-child-users')[0].sumo.reload();
            } else {
                //alertPopup(responseObject.message, 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            window.location.reload(true);
        }
    });
    
}

function populateForms(defaultForm) {
    var data = $("form#createUser").serializeArray();
    
    $.ajax({
        url: '/form/getDependentForms',
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#listbox_selectForm_wrapper').show();
        },
        complete: function () {
            $('#listbox_selectForm_wrapper').hide();
        },
        success: function (json) {
            if (json['status'] == 200) {
                var selectedform = [];
                $('#createUser #select-form').SumoSelect({placeholder: 'Select Forms to be assigned', search: true, searchText:'Search Forms', selectAll : false, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });  
        
                $('#select-form :selected').each(function (i, selected) {
                    selectedform[i] = $(selected).val();
                });
                $('#select-form').html(json['formList']);

                $('#select-form option').each(function () {
                    if (selectedform.indexOf($(this).val()) != -1) {
                        $(this).attr('selected', 'selected');
                    }
                });

                if (typeof defaultForm != 'undefined' && defaultForm.length > 0) {
                    for (var ind in defaultForm) {
                        $("#select-form option[value='" + defaultForm[ind] + "']").attr("selected", "selected");
                    }
                }
            }
            $('select#select-form')[0].sumo.reload();
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
           // window.location.reload(true);
        }
    });
}


$(document).on('change', '#role_id', function () {
    showHideAssignedUserSection();
});

function showHideAssignedUserSection(){
    var role = $('#role_id').val();
    $("#userListOfCounselor").hide();
    
    $('select#assigned-child-users')[0].sumo.reload();
    
    if (role == jsVars.GROUP_COUNSELLOR_ID_JS ||  role == jsVars.collegeStaffGroupId){
        $("#userListOfCounselor").show();
    }
    
}

if($("#createUser #password_type").length>0){
    $("#password_type").on('change',function(){
       var ptype = $("#password_type").val();
       if(ptype==0){
           $("#new_password").val('');
           $("#manualPassword").show();
           $("#generatedPassword").hide();
       }else{
           $("#manualPassword").hide();
           $("#generatedPassword").show();
       }
    });
}

$(document).on('click', '.user_form_submit',function(){
    var ptype = $("#password_type").val();
    if($(this).attr('id')=='save_next'){
        $("#submit_type").val('save_next');
    }
    if(ptype==1){
        $('form#createUser').submit();
    }
    $("span.error").remove();
    /******** validations for password starts */
    //spacial characters allowed are _$.@
    var validPassword   = true;
//    if($("#new_password").length){
//        validPassword   = false;
//        var password    = $("#new_password").val();
//        var passwordErr = "Please enter the Password.";
//        if(password.length >= 8 && password.toLowerCase() !== $("#formEmailId").val()){
//            var upperCase   = 0;
//            var lowerCase   = 0;
//            var numeric     = 0;
//            var special     = 0;
//            if(password.toLowerCase()!==password){
//                upperCase   = 1;
//            }
//            if(password.toUpperCase()!==password){
//                lowerCase   = 1;
//            }
//            if(/\d/.test(password)){
//                numeric = 1;
//            }
//            var formatMatch = /[!@#$%^&*()_+\-=\[\]{}`~;':"\\|,.<>\/?]/;
//            if(formatMatch.test(password) == true) {
//                special = 1;
//            } 
//
//            if( ((upperCase+lowerCase+numeric+special) >= 3) && /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{}`~;':"\\|,.<>\/?]*$/.test(password) ){
//                validPassword   = true;
//            }else{
//                    passwordErr = 'Entered Password doesnt meet the criteria mentioned.';
//            }
//
//        }else{
//            if(password.length ==0){
//                    //passwordErr = 'Entered Password doesnt meet the criteria mentioned.';
//            }else{
//                    passwordErr = 'Entered Password doesnt meet the criteria mentioned.';
//            }                
//        }
//    }
    /******** validations for password starts */

    console.log(jsVars.existingPassword);
    if($("#new_password").val()=="******" || (jsVars.existingPassword != 'undefined' && jsVars.existingPassword==$("#new_password").val())){
        validPassword=true;
    }else if(validatePassword('new_password')==false){
       validPassword = false;
       passwordErr = "Entered Password doesn't meet the criteria mentioned.";
    } 

    if(validPassword){
        $('form#createUser').submit();
    }else{
        $("#new_password").parent('div').after('<span class="error">'+passwordErr+'</span>');
        $("#new_password").focus();
        /*$('html, body').animate({
            scrollTop: 0
        }, 1000);*/
		hideLoader();
    }
});


/**
 * - populate the college list on the basis of selected publisher
 * @param {type} selectedColleges
 * @param {type} pbId
 * @returns {undefined}
 */
function changePublisherBasedCollegeDropdown(selectedColleges, pbId) {
    if(selectedColleges != ""){
        selectedColleges = ""+selectedColleges;
        selectedColleges = selectedColleges.split(",");
    }else{
        selectedColleges = [];
    }
    $('#college_ids').removeProp('disabled').val('');
    $('select#college_ids')[0].sumo.reload();
    return;
    if(pbId != ''){
        $('#college_ids').removeProp('disabled').val('');
        $('select#college_ids')[0].sumo.reload();
        $.ajax({
            url: '/publishers/getPublisherCollegesList',
            type: 'post',
            data: $("form#createUser").serialize(),
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars.csrfToken
            },
            beforeSend: function () {
                $('#listbox_selectCollege_wrapper').show();
            },
            complete: function () {
                $('#listbox_selectCollege_wrapper').hide();
            },
            success: function (json) {
                if (json['status'] == 200 || json['status'] == 1) {
                    $('#createUser #college_ids').SumoSelect({placeholder: 'Select Institutes to Allocate', search: true, searchText:'Search Institute', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });  
        
                    // Success
                    $('#college_ids :selected').each(function (i, selected) {
                        selectedColleges[i] = $(selected).val();
                    });
                    
                    $('#college_ids').html(json['collegeList']);
                    
                    $('#college_ids option').each(function () {
                        if (selectedColleges.indexOf($(this).val()) != -1) {
                            $(this).attr('selected', 'selected');
                        }
                    });

                    if (typeof selectedColleges != 'undefined' && selectedColleges.length > 0) {
                        for (var ind in selectedColleges) {
                            $("#college_ids option[value='" + selectedColleges[ind] + "']").attr("selected", "selected");
                        }
                    }

                    $('select#college_ids')[0].sumo.reload();
                    
                } else if (json['status'] == 0) {
                    // Success
                    $('select#college_ids').html('');
                    $('select#college_ids')[0].sumo.reload();
                } else {
                    alert('Some Error occured, please try again.');
                }
                return false;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                window.location.reload(true);
            }
        });
    }else{
        $('#select_institute').attr('disabled', true).val('').trigger('chosen:updated');
    }
    
}

function DeleteEmailAttachmentFile(FileId, LiContainer) {

    if (FileId) {
        $.ajax({
            url: '/communications/deleteEmailAttachmentFile',
            type: 'post',
            data: {FileId: FileId},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                if (json['redirect'])
                    location = json['redirect'];
                else if (json['error'])
                    alertPopup(json['error'], 'error');
                else if (json['success'] == 200) {
                    $('#' + LiContainer + ' #li_' + FileId).remove();
                    $('#' + LiContainer).html('<div class="text-center"><div class="userImgDumy"><i class="fa fa-user fa-4x"></i></div></div>');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
}

// this function is used when there is mobile dial country code is selected in form applicant
function filterDialCode(fieldId) 
{
    if(typeof fieldId=="undefined" || fieldId==null || fieldId=="undefined"){
        fieldId = '';
    }
    var value = $('#filter_dial_code'+fieldId).val();
    value = value.toLowerCase();    
    $("#ul_dial_code"+fieldId+" > li").each(function() {
        if ($(this).text().toLowerCase().search(value) > -1) {
//            $(this).text(src_str);
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });
}

//limit_on
if($("#createUserLimit").length>0){
    $("#limit_on").on('change',function(){
        if($("#limit_on").val()==1){
            $("#college_level_div").show();
            $("#role_level_div").hide();
        }else if($("#limit_on").val()==0){
            $("#role_level_div").show();
            $("#college_level_div").hide();
        }
    });
}

function alertPopup(msg, type, location) {

    if (type == 'error') {
        var selector_parent = '#ErrorPopupArea';
        var selector_titleID = '#ErroralertTitle';
        var selector_msg = '#ErrorMsgBody';
        var btn = '#ErrorOkBtn';
        var title_msg = 'Error';
    } else {
        var selector_parent = '#SuccessPopupArea';
        var selector_titleID = '#alertTitle';
        var selector_msg = '#MsgBody';
        var btn = '#OkBtn';
        var title_msg = 'Success';
    }

    $(selector_titleID).html(title_msg);
    $(selector_msg).html(msg);
    $('.oktick').hide();

    if (typeof location != 'undefined') {
        $(btn).show();

        $(selector_parent).modal({keyboard: false}).one('click', btn, function (e) {
            e.preventDefault();
            window.location.href = location;
        });
    }
    else {
        $(selector_parent).modal();
    }
}

function browseBtnImgShow(){
	$("#user_image").change(function () {
    $(".userImgDumy").html("");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;
        if (regex.test($(this).val().toLowerCase())) {
            if ($.browser.msie && parseFloat(jQuery.browser.version) <= 9.0) {
                $(".userImgDumy").show();
                $(".userImgDumy")[0].filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = $(this).val();
            }
            else {
                if (typeof (FileReader) != "undefined") {
                    $(".userImgDumy").show();
                    $(".userImgDumy").append("<img />");
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $(".userImgDumy img").attr("src", e.target.result);
                    }
                    reader.readAsDataURL($(this)[0].files[0]);
                } else {
                    alert("This browser does not support FileReader.");
                }
            }
        } else {
            alert("Please upload a valid image file.");
		}
	});
}

//check if browser supports file api and filereader features
if (window.File && window.FileReader && window.FileList && window.Blob) {
	
   //this is not completely neccesary, just a nice function I found to make the file size format friendlier
	//http://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable
	function humanFileSize(bytes, si) {
	    var thresh = si ? 1000 : 1024;
	    if(bytes < thresh) return bytes + ' B';
	    var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
	    var u = -1;
	    do {
	        bytes /= thresh;
	        ++u;
	    } while(bytes >= thresh);
	    return bytes.toFixed(1)+' '+units[u];
	}

  //this function is called when the input loads an image
	function renderImage(file){
		var reader = new FileReader();
		reader.onload = function(event){
			the_url = event.target.result
      //of course using a template library like handlebars.js is a better solution than just inserting a string
			$('.userImgDumy').html("<img src='"+the_url+"' style='max-width:100%;width:100%;height:100%;'/>")
		}
    
    //when the file is read it triggers the onload event above.
		reader.readAsDataURL(file);
	}

  //watch for change on the 
	$( "#user_image" ).change(function() {
		renderImage(this.files[0]);
	});

} else {

  alert('The File APIs are not fully supported in this browser.');

}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
   
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}