//Create/Edit user

if ($('#userCreateForm').length > 0) {

    //show/hide permission overwrite/masking/unmasked  section    
    showHidePermissionSection();
    showHideMaskingSection();
    showHideUnMaskCollegeSection();
     var defaultPermissionTrigger = 0;
     var defaultMaskingTrigger = 0;
    //Code to uncheck Un-Masked College List checkbox on college change has been commented
    $(document).on('change','#select_institute',function(){
        var role = $('#roleDropdown').val();
        if ((role != jsVars.GROUP_PUBLISHER_ID_JS) || this.value == '' || this.value == 'undefined')
        {
            $('#UserUnmaskSection').html('');
            $('#AllowToUnmaskCollege').attr('checked', false);
        }
        
        if(role == jsVars.GROUP_PUBLISHER_ID_JS && $('#AllowToUnmaskCollege').is(':checked')){
            
            GetUserUnMaskCollegeView();
        }
        
    });
    
    $(document).on('change', '#roleDropdown', function () {
        showHidePermissionSection();
        showHideMaskingSection();
        showHideUnMaskCollegeSection();
        showHideAssignedUserSection();
    });

    //user overwrite masking section
    $(document).on('click', '#AllowOverwriteMasking', function () {
        if ($(this).is(':checked'))
        {
            GetUserMaskingView();
        } else
        {
            $('#UserMaskingSection').html('');
        }
    });

    //user overwrite permission section
    $(document).on('click', '#AllowOverwritePermission', function () {
        if ($(this).is(':checked'))
        {   
            var role = $('#roleDropdown').val();
            if(defaultPermissionTrigger == 0 && role == jsVars.GROUP_PUBLISHER_ID_JS ){
                overridePublisherPermission();
            }else{
                GetUserPermissionView();
            }
        } else
        {
            $('#UserPermissionSection').html('');
        }
        defaultPermissionTrigger = 0;
    });
    
    //user unmask college data Section 
    $(document).on('click', '#AllowToUnmaskCollege', function () {
        if ($(this).is(':checked'))
        {
            GetUserUnMaskCollegeView();
        }
        else
        {
            $('#UserUnmaskSection').html('');
        }
    });

    $('.panel-group').on('hidden.bs.collapse', toggleIcon);
    $('.panel-group').on('shown.bs.collapse', toggleIcon);

    //load user masking view
    if (typeof jsVars.loadMaskingView != 'undefined')
    {
        $('#AllowOverwriteMasking').trigger('click');
    }

    //load user permission view
    if (typeof jsVars.loadPermissionView != 'undefined' && jsVars.loadPermissionView != '0')
    {
        defaultPermissionTrigger = 1;
        $('#AllowOverwritePermission').trigger('click');
    }
    
    //load user unmask college view
    if (typeof jsVars.loadUnmaskCollegeView != 'undefined' && jsVars.loadUnmaskCollegeView != '0')
    {
        $('#AllowToUnmaskCollege').trigger('click');
    }
    $(document).on('click', '#user_form_submit',function(){
        $("span.error").remove();
        /******** validations for password starts */
        //spacial characters allowed are _$.@
        var validPassword   = true;
        if($("#password").length){
            validPassword   = false;
            var password    = $("#password").val();
            var passwordErr = "Enter a correct password. Refer info tip for password validations.";
            if(password.length >= 8 && password.toLowerCase() !== $("#formEmailId").val()){
                var upperCase   = 0;
                var lowerCase   = 0;
                var numeric     = 0;
                var special     = 0;
                if(password.toLowerCase()!==password){
                    upperCase   = 1;
                }
                if(password.toUpperCase()!==password){
                    lowerCase   = 1;
                }
                if(/\d/.test(password)){
                    numeric = 1;
                }
                var formatMatch = /[!@#$%^&*()_+\-=\[\]{}`~;':"\\|,.<>\/?]/;
                if(formatMatch.test(password) == true) {
                    special = 1;
                } 

                if( ((upperCase+lowerCase+numeric+special) >= 3) && /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{}`~;':"\\|,.<>\/?]*$/.test(password) ){
                    validPassword   = true;
                }else{
//                    passwordErr = 'Password must contain characters from at least three of these groupings: upper case letter, lower case letter, numeric, and special characters.';
                }

            }else{
                if(password.length < 8){
//                    passwordErr = 'Password must be minimum of eight characters in length.';
                }else{
//                    passwordErr = 'Password can not be same as the Email Id.';
                }                
            }
        }
        /******** validations for password starts */
        
        if(validPassword){
            $('form#userCreateForm').submit();
        }else{
            $("#password").parent('div').after('<span class="error">'+passwordErr+'</span>');
            $("#password").focus();
            $('html, body').animate({
                scrollTop: 0
            }, 1000);
        }
    });
    //File upload progress bar
    $(document).on('submit', 'form#userCreateForm', function (e) {
        if ($('#user_image').val()) { 
            $('#uploaderrro').html('');
            e.preventDefault();
            $(this).ajaxSubmit({
                beforeSubmit: function () {
                    $("#progress-bar").show();
                    $("#progress-bar").width('0%');
                },
                uploadProgress: function (event, position, total, percentComplete) {

                    $("#progress-bar").width(percentComplete + '%');
                    $("#progress-bar").html('<div id="progress-status">' + percentComplete + ' %</div>')
                },
                success: function (data) {

                    if (data.search(/session_logout/ig) > -1) {
                        window.location.href = '/users/dashboard/';
                    } else {
                        var errordata = /uploaderror/ig;
                        if (data.search(errordata) > -1) {
                            var error_str = data.replace("uploaderror::", "");
                            $('#uploaderrro').html(error_str);
                        } else {
                            //console.log(data);
                            $('#uploaderrro').html('');
                            $('#UploadFileInfoContainer').html(data);
                            $('#user_image').val('');
                            $("#progress-bar").hide();
                            $('div.loader-block').hide();
                        }
                    }


                },
                resetForm: false
            });
            return false;
        } else {
//            $(this).submit();
            // submit form and add/update user
            return true;
        }
    });
}

//User Manager Page Js
if($('#UserManagementSection').length > 0)
{
    GetMoreUsersView('reset');
}

function GetMoreUsersView(listingType)
{
    var Page,old_search;
    if(listingType == 'reset')
    {
        old_search = JSON.stringify($('#userFilterForm #search-username,#userFilterForm #institute_selected,#userFilterForm #role_selected,#userFilterForm #UserStatus,#userFilterForm #createdon,#userFilterForm #createdtill').serializeArray());
        Page = 0;
        $('#ListingType').val('reset');
    }
    else if(listingType == 'load')
    {
        Page = parseInt($('#OffsetStart').val());
        Page = Page + 1;
        $('#ListingType').val('load');
    }
    $('#OffsetStart').val(Page);
    $.ajax({
        url: jsVars.loadMoreUserUrl,
        type: 'post',
        data: $('#userFilterForm input,#userFilterForm select'),
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#UserManagementSection .loader-block').show();
        },
        complete: function () {
            $('#UserManagementSection .loader-block').hide();
        },
        success: function (html) {
            if (html == 'session')
            {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }             
            else if (html == 'no_more')
            {
                $('#LoadMoreArea').hide();
            } 
            else if (html == 'date_error')
            {
                $('#ErrorMsgBody').html('Created On date should be less than Created Till date.');
                $('#ErrorLink').trigger('click');
                $('#LoadMoreArea').hide();
            }
            else
            {
                var countRecord = CountTotalReturnResult(html,listingType);
                //alert(countRecord);
                if(listingType == 'reset')
                {
                    $('#OldSearch').val(old_search);
                    $('#UserListDataContainer').html(html);
                }
                else if(listingType == 'load')
                {
                    $('#UserListContainer').append(html);
                }
                //show/hide load more area
                if(countRecord >= 10)
                {
                    $('#LoadMoreArea').show();
                }
                else if(countRecord < 10)
                {
                    $('#LoadMoreArea').hide();
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function CountTotalReturnResult(html,listingType)
{
    var data = {};
    var len = 0;
    data.html = html;
    if(listingType == 'reset')
    {       
        //console.log($.parseHTML(data.html));
        $.grep($.parseHTML(data.html), function(el, i) { 
            len = $(el).find('div.application-form-block').length;
        });
    }
    else
    {
        len = $.grep($.parseHTML(data.html), function(el, i) {
          return $(el);
        }).length;
    }
    //alert(len);
    return len;
}

function showHideMaskingSection()
{
    var role = $('#roleDropdown').val();
    $('#AllowOverwriteMaskingSection').hide();
    $('#UserMaskingSection').html('');
    $('#AllowOverwriteMasking').attr('checked', false);
    if ((role == jsVars.collegeAdminGroupId) || (role == jsVars.collegeStaffGroupId))
    {
        $('#AllowOverwriteMaskingSection').show();
    }
}

function GetUserMaskingView()
{
    var UserSelected = 0;
    if ($('#userId').length > 0)
    {
        UserSelected = $('#userId').val();
    }
    var CollegeSelected = $('#select_institute').val();
    var role = $('#roleDropdown').val();
    //remove error
    $('#select_institute').parent().find('span.error').remove();
    $.ajax({
        url: jsVars.GetUserMaskingLink,
        type: 'post',
        data: {role: role, CollegeSelected: CollegeSelected, UserSelected: UserSelected},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {

        },
        complete: function () {

        },
        success: function (html) {
            if (html == 'session')
            {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (html == 'required')
            {
                $('#select_institute').parent().append('<span class="error">College and user role both are required.</span>');
                $('#AllowOverwriteMasking').attr('checked', false);
            } else if (html == 'error')
            {
                $('#select_institute').parent().append('<span class="error">Unable to load override masking view.</span>');
                $('#AllowOverwriteMasking').attr('checked', false);
            } else if (html == 'no_more')
            {
                $('#select_institute').parent().append('<span class="error">Masking not assigned to the selected role for this college.</span>');
                $('#AllowOverwriteMasking').attr('checked', false);
            } else
            {
                $('#UserMaskingSection').html(html);
                $('.panel-group').on('hidden.bs.collapse', toggleIcon);
                $('.panel-group').on('shown.bs.collapse', toggleIcon);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function showHidePermissionSection()
{
    var role = $('#roleDropdown').val();
    $('#AllowOverwritePermissionSeection').hide();
    $('#UserPermissionSection').html('');
    $('#AllowOverwritePermission').attr('checked', false);
    if ((role == jsVars.collegeAdminGroupId) || (role == jsVars.collegeStaffGroupId) || role == jsVars.GROUP_OPERATIONS_ID_JS || 
            role == jsVars.GROUP_SALES_ID_JS || role == jsVars.GROUP_PUBLISHER_ID_JS || 
            role == jsVars.GROUP_COUNSELLOR_ID_JS || role == jsVars.GROUP_AGENT_ID_JS )
    {
        $('#AllowOverwritePermissionSeection').show();
    }
}

function overridePublisherPermission(){
    var role = $('#roleDropdown').val();
    if(role == jsVars.GROUP_PUBLISHER_ID_JS && $('#AllowOverwritePermission').is(':checked')){
        GetUserPermissionView('publisherCollegeChange');
//        $("#collapsePublisher input:checkbox").each(function() {
//            this.checked = false;
//        });
    }
}

function GetUserPermissionView(event)
{
    var UserSelected = 0;
    if ($('#userId').length > 0)
    {
        UserSelected = $('#userId').val();
    }
    var CollegeSelected = $('#select_institute').val();
    var role = $('#roleDropdown').val();
    var asyncTrue = true;
    if(event == 'publisherCollegeChange'){
        asyncTrue = false;
    }
    //remove error
    $('#select_institute').parent().find('span.error').remove();
    $.ajax({
        url: jsVars.GetUserPermissionLink,
        type: 'post',
        data: {role: role, CollegeSelected: CollegeSelected, UserSelected: UserSelected},
        dataType: 'html',
        async :asyncTrue,
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {

        },
        complete: function () {

        },
        success: function (html) {
            if (html == 'session')
            {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (html == 'required')
            {
                $('#select_institute').parent().append('<span class="error">College and user role both are required.</span>');
                $('#AllowOverwritePermission').attr('checked', false);
            } else if (html == 'error')
            {
                $('#select_institute').parent().append('<span class="error">Unable to load override permission view.</span>');
                $('#AllowOverwritePermission').attr('checked', false);
            } else if (html == 'no_more')
            {
                $('#select_institute').parent().append('<span class="error">Permissions not assigned to the selected role for this college.</span>');
                $('#AllowOverwritePermission').attr('checked', false);
                if(role == jsVars.GROUP_PUBLISHER_ID_JS){
                    $('#UserPermissionSection').html('');
                }
            } else
            {
                $('#UserPermissionSection').html(html);
                $('.panel-group').on('hidden.bs.collapse', toggleIcon);
                $('.panel-group').on('shown.bs.collapse', toggleIcon);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function toggleIcon(e)
{
    $(e.target)
            .prev('.panel-heading')
            .find(".more-less")
            .toggleClass('glyphicon-plus glyphicon-minus');
}

function populateForms(defaultForm, defaultCategoy) {

    $.ajax({
        url: '/colleges/populate-dependent-forms',
        type: 'post',
        data: $("form#userCreateForm").serialize(),
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
               
                    populateQueryCategory(defaultCategoy);
               
            if (json['status'] == 200 || json['status'] == 1) {
                var selectedform = [];
                // Success
//                console.log(json['formList']);
                $('#select-form :selected').each(function (i, selected) {
                    selectedform[i] = $(selected).val();
                });


                $('#formlistdata').html(json['formList']);

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

                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                $('.chosen-select').trigger('chosen:updated');
               
                  
               
            } else if (json['status'] == 0) {
                // Success
                $('#formlistdata').html(json['formList']);
            } else {
                alert('Some Error occured, please try again.');
            }
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function populateQueryCategory(defaultCategoy) {

    $.ajax({
        url: '/query/get-query-category',
        type: 'post',
        data: $("form#userCreateForm").serialize(),
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#listbox_selectForm_wrapper').addClass('user-loader-form');
            //        	$('#contact-us-final div.loader-block').show();
        },
        complete: function () {
            $('#listbox_selectForm_wrapper').removeClass('user-loader-form');
        },
        success: function (json) {
            if (json['status'] == 200 || json['status'] == 1) {

                $('#catlistdata').html(json['categoryList']);

                if (typeof defaultCategoy != 'undefined' && defaultCategoy.length > 0) {
                    for (var ind in defaultCategoy) {
                        $("#assigned_query_category option[value='" + defaultCategoy[ind] + "']").attr("selected", "selected");
                    }
                    $("#viewAllQueryPermission").attr("checked",false);
                    $("#viewAllQueryPermission").attr("disabled",'disabled');
                }else{
                    $("#viewAllQueryPermission").attr("checked",false);
                    $("#viewAllQueryPermission").removeAttr("disabled");
                }

                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                $('.chosen-select').trigger('chosen:updated');

            } else {
                alertPopup('Some Error occured, please try again.', 'error');
            }
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function changeRoleBasedCollegeDropdown(value) {

//    $('#select_institute').val('');
    $('#select_form_div').show();
    $('#required_form_span').show();
    $('#select_cat_div').show();
    $('#view_query_cat_div').show();
    $('#select_pub_div').hide();
    
    if(value == jsVars.GROUP_PUBLISHER_ID_JS){
        //role publisher has been choosen
        
        $('#profile-div').hide();
        $('#message-div').hide();
        $('#select_pub_div').show();
        $('#publisherDropdown').val('').trigger('chosen:updated');
        
        $('#select-form').val('').trigger('chosen:updated');
        $('#assigned-query-category').val('').trigger('chosen:updated');
        $('#select_form_div').hide();
        $('#select_cat_div').hide();
        $('#view_query_cat_div').hide();
        $('#profile-div').val('').hide();
        $('#message-div').val('').hide();
        $('#select_area_div').hide();
        
        $('#select_institute').chosen('destroy');
        $('#select_institute').trigger('chosen:updated');
        $('#select_institute').val('').attr('disabled', true).trigger('chosen:updated');
        $('#select_institute').attr('multiple', 'multiple');
        
    }else if (value == jsVars.collegeStaffGroupId || value == jsVars.collegeAdminGroupId) {
        $('#select_institute').removeAttr('multiple');
        $('#select_institute').chosen('destroy');
        $('#select_area_div').hide();
        $('#profile-div').show();
        $('#message-div').show();
        populateUserColleges();
        if (value == jsVars.collegeAdminGroupId) {
            
            $('#select-form').val('').trigger('chosen:updated');
            $('#assigned-query-category').val('').trigger('chosen:updated');
            $('#select_form_div').hide();
            $('#select_cat_div').hide();
            $('#view_query_cat_div').hide();
        }
    }else if (value == jsVars.GROUP_COUNSELLOR_ID_JS) {
        $('#select_institute').removeAttr('multiple');
        $('#select_institute').chosen('destroy');
        $('#assigned-query-category').val('').trigger('chosen:updated');
        $('#select_cat_div').hide();
        $('#select_area_div').hide();
        populateUserColleges();
    }else if (value == jsVars.GROUP_AGENT_ID_JS) {
        $('#select_institute').removeAttr('multiple');
        $('#select_institute').chosen('destroy');
        $('#assigned-query-category').val('').trigger('chosen:updated');
        $('#select_cat_div').hide();
        $('#profile-div').hide();
        $('#message-div').hide();
        $('#select_area_div').show();
        $('#required_form_span').hide();
        $('#view_query_cat_div').hide();
        populateUserColleges();
    } else {
        populateUserColleges('multiple');
        $('#assigned-query-category').val('').trigger('chosen:updated');
        $('#select_cat_div').hide();
        $('#select_area_div').hide();
        $('#view_query_cat_div').hide();
        $('#select_institute').chosen('destroy');
    }
    $('#select_institute').val('').trigger('chosen:updated');
    $('#select_institute').chosen();
    $('#select_institute').trigger('chosen:updated');
    $('#select-form').val('').trigger('chosen:updated');
    return false;
}

// function: Delete Email Attachment Uploaded File
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
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
}

function getActivityCodes(val) {
    $.ajax({
        url: '/users/get-activity-codes',
        type: 'post',
        dataType: 'html',
        data: 'val=' + val,
        //data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if (data == "session_logout") {
                window.location.reload(true);
            } else if (data == "error") {

            } else {
                $('#activity_code').html(data);
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                $('.chosen-select').trigger('chosen:updated');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

function LoadMoreActivity(type) {

    if (type == 'reset') {
        Page = 0;
        $('#load_more_results').html("");
        $('#load_more_results_msg').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
    }

    var data = $('#FilterActivityForm').serializeArray();
    data.push({name: "page", value: Page});

    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $.ajax({
        url: '/users/ajax-activity',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            Page = Page + 1;
            if (data == "session_logout") {
                window.location.reload(true);
            } else if (data == "error") {
                if (Page == 1)
                    error_html = "No Records found";
                else
                    error_html = "No More Record";
                $('#load_more_results_msg').append("<div class='alert alert-danger'>" + error_html + "</div>");
                $('#load_more_button').html("Load More Leads");
                $('#load_more_button').hide();
                if (type != '' && Page == 1) {
                    $('#if_record_exists').hide();
                }
            } else if (data == "select_college") {
                $('#load_more_results_msg').html("<div class='alert alert-danger'>Please select a college to view user's activity.</div>");
                $('#load_more_button').hide();
                $('#load_more_button').html("Load More Record");
                if (type != '') {
                    $('#if_record_exists').hide();
                }
            } else {
                data = data.replace("<head/>", '');
//                    console.log(data);
                $('#load_more_results').append(data);
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html("Load More Record");
                if (type != '') {
                    $('#if_record_exists').fadeIn();
                }
//                $.material.init();
                table_fix_rowcol();
            }
            //console.log(data);

            //$("#load_more_results").tableHeadFixer({"left": 1});
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}
/*******this is for mongo******/
function LoadMoreActivityMongo(type){
    
    if (type == 'reset') {
        Page = 0;
        $('#load_more_results').html("");
        $('#load_more_results_msg').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
    }

    var data = $('#FilterActivityForm').serializeArray();
    data.push({name: "page", value: Page});

    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $.ajax({
        url: '/users/ajax-activity',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            Page = Page + 1;
            if (data == "session_logout") {
                window.location.reload(true);
            } else if (data == "error") {
                if (Page == 1)
                    error_html = "No Records found";
                else
                    error_html = "No More Record";
                $('#load_more_results_msg').append("<div class='alert alert-danger'>" + error_html + "</div>");
                $('#load_more_button').html("Load More Leads");
                $('#load_more_button').hide();
                if (type != '' && Page == 1) {
                    $('#if_record_exists').hide();
                }
            } else if (data == "select_college") {
                $('#load_more_results_msg').html("<div class='alert alert-danger'>Please select a college to view user's activity.</div>");
                $('#load_more_button').hide();
                $('#load_more_button').html("Load More Record");
                if (type != '') {
                    $('#if_record_exists').hide();
                }
            } else {
                data = data.replace("<head/>", '');
//                    console.log(data);
                $('#load_more_results').append(data);
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html("Load More Record");
                if (type != '') {
                    $('#if_record_exists').fadeIn();
                }
//                $.material.init();
                table_fix_rowcol();
            }
            //console.log(data);

            //$("#load_more_results").tableHeadFixer({"left": 1});
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

function LoadMoreUserSessions(type) {


    if (type == 'reset') {
        Page = 0;
        $('#load_more_results').html("");
        $('#load_more_results_msg').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
        $('#view_by').val('');
    }

    $('#newsernotify').html('');
    var data = $('#FilterUserActivity').serializeArray();
    data.push({name: 'page', value: Page});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $.ajax({
        url: '/users/ajax-manage-session',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            Page = Page + 1;
            data = data.replace("<head/>", '');
            if(data == 'no-college'){
                $('#no-college').show();
                $('#parent').hide();
                $('#if_record_exists').hide();
                $('#load_more_button').hide();
            }else
            if (data == "error") {
                $('#no-college').hide();
                $('#parent').show();
                $('#if_record_exists').show();
                $('#load_more_results').append(" <tr><td colspan='9'><div class='text-danger'><h4 class='text-center'>No More Records</h4><div></td></tr>");
                $('#load_more_button').hide();
                if(Page == 1){
                    $('#tot_records').html("0");
                }
            } else {
                $('#no-college').hide();
                $('#parent').show();
                $('#if_record_exists').show();
                $('#load_more_results').append(data);
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html("Next Page");
				
				// hold onto the drop down menu                                             
                 var dropdownMenu;
                // and when you show it, move it to the body                                     
                $('.ellipsis-left').on('show.bs.dropdown', function (e) {

                        // grab the menu        
                        dropdownMenu = $(e.target).find('.dropdown-menu');
                        dropHeight = dropdownMenu.outerHeight() - 15;

                        // detach it and append it to the body
                        $('body').append(dropdownMenu.detach());

                        // grab the new offset position
                        var eOffset = $(e.target).offset();

                        // make sure to place it where it would normally go (this could be improved)
                        dropdownMenu.css({
                                'display': 'block',
                                //'top': eOffset.top + $(e.target).outerHeight(),
                                'top': eOffset.top - dropHeight,
                                'left': eOffset.left - 124
                        });
                });
                // and when you hide it, reattach the drop down, and hide it normally                                                   
                $('.ellipsis-left').on('hide.bs.dropdown', function (e) {
                        $(e.target).append(dropdownMenu.detach());
                        dropdownMenu.hide();
                });
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

function destroyUserSession(session_id,userId) {
    if(userId === 'undefined'){
        userId = 0;
    }
    $('#ConfirmMsgBody').html('Do you want to destroy session successfully?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();
                $.ajax({
                    url: '/users/user-session-destroy',
                    type: 'post',
                    data: {'user_session_id': session_id,'user_id':userId},
                    dataType: 'json',
                    headers: {
                        "X-CSRF-Token": jsVars.csrfToken
                    },
                    beforeSend: function () {
                        //$('#contact-us-final div.loader-block').show();
                    },
                    complete: function () {
                        //$('#contact-us-final div.loader-block').hide();
                    },
                    success: function (json) {

                        if (json['status'] == 200) {
                            alertPopup("Session Destroyed Successfully", "success", '/users/manage-sessions');
                        } else {
                            // System Error
                            alertPopup('Some Error occured, please try again.', 'error');
                        }
                        return false;
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                        ;
                    }
                });

                $('#ConfirmPopupArea').modal('hide');
            });
    return false;
}

function ajaxCountTotalRecords() {

    var data = $('#FilterUserActivity').serializeArray();
    $.ajax({
        url: '/users/ajax-count-total-records',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if (json['redirect'])
                location = json['redirect'];
            else if (json['status'] == 200) {
                var current_total = json['logged_user_count'] - parseInt($('#tot_records').text());
                if (current_total > 0) {
                    $('#newsernotify').html(current_total + ' new session(s)');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}


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
    if(pbId != ''){
        $('#select_institute').removeProp('disabled').val('').trigger('chosen:updated');
       
        $.ajax({
            url: '/publishers/populate-selected-colleges',
            type: 'post',
            data: $("form#userCreateForm").serialize(),
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
//                    var selectedColleges = [];
                    // Success
                    $('#select_institute :selected').each(function (i, selected) {
                        selectedColleges[i] = $(selected).val();
                    });


                    $('#collegelistdata').html(json['collegeList']);

                    $('#select_institute option').each(function () {
                        if (selectedColleges.indexOf($(this).val()) != -1) {
                            $(this).attr('selected', 'selected');
                        }
                    });

                    if (typeof selectedColleges != 'undefined' && selectedColleges.length > 0) {
                        for (var ind in selectedColleges) {
                            $("#select_institute option[value='" + selectedColleges[ind] + "']").attr("selected", "selected");
                        }
                    }

                    $('.chosen-select').chosen();
                    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                    $('.chosen-select').trigger('chosen:updated');



                } else if (json['status'] == 0) {
                    // Success
                    $('#collegelistdata').html(json['collegeList']);
                } else {
                    alert('Some Error occured, please try again.');
                }
                return false;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }else{
        $('#select_institute').attr('disabled', true).val('').trigger('chosen:updated');
       
    }
    
}


function populateUserColleges(multiple)
{    
    if(typeof multiple !='undefined' && multiple == 'multiple'){
        multiple = true;
    }else{
        multiple = false;
    }
    $('#select_institute').removeProp('disabled').val('').trigger('chosen:updated');
       
    $.ajax({
        url: '/users/populate-user-colleges',
        type: 'get',        
        dataType: 'json',
        async: false,
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
                var selectedform = [];
                // Success
                $('#select-form :selected').each(function (i, selected) {
                    selectedform[i] = $(selected).val();
                });


                $('#collegelistdata').html(json['collegeList']);

                $('#select_institute option').each(function () {
                    if (selectedform.indexOf($(this).val()) != -1) {
                        $(this).attr('selected', 'selected');
                    }
                });

                if (typeof selectedColleges != 'undefined' && selectedColleges.length > 0) {
                    for (var ind in selectedColleges) {
                        $("#select_institute option[value='" + selectedColleges[ind] + "']").attr("selected", "selected");
                    }
                }

            } else if (json['status'] == 0) {
                // Success
                $('#collegelistdata').html(json['collegeList']);
            } else {
                alert('Some Error occured, please try again.');
            }
            
            if(multiple==true){
                $('#select_institute').attr('multiple', 'multiple');
            }
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.chosen-select').trigger('chosen:updated');
            
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

// function to download user activity in csv

function exportUserActivityCsv(){
    var $form = $("#FilterActivityForm");
    $form.attr("action",jsVars.exportUserActivityCsvLink);
    $form.attr("target",'modalIframe');
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    $('#myModal').modal('show');
    $form.submit();
    $form.attr("onsubmit",onsubmit_attr);
    $form.removeAttr("target");
    
}

var downloadUserActivityFile = function(url){
    window.open(url, "_self");
};

function updateQueryCategoryStatus(id){
    if(id === "viewAllQueryPermission"){
        if($("#viewAllQueryPermission").is(":checked")){
            $("select[name='assigned_query_category[]']").val('').attr("disabled","disabled").trigger('chosen:updated');
        }else{
            $("select[name='assigned_query_category[]']").removeAttr("disabled").trigger('chosen:updated');
        }
    }else{
        if($("select[name='assigned_query_category[]']").val() === null || $("select[name='assigned_query_category[]']").val() === undefined){
            $("#viewAllQueryPermission").removeAttr("disabled");
        }else{
            $("#viewAllQueryPermission").attr("disabled","disabled");
        }
    }
    
}

function showHideUnMaskCollegeSection()
{
    var role = $('#roleDropdown').val();
    $('#AllowToUnmaskCollegeSection').hide();
    $('#UserUnmaskSection').html('');
    $('#AllowToUnmaskCollege').attr('checked', false);
    if ((role == jsVars.GROUP_PUBLISHER_ID_JS))
    {
        $('#AllowToUnmaskCollegeSection').show();
    }
}

function showHideAssignedUserSection(){
    var role = $('#roleDropdown').val();
    $("#userListOfCounselor").hide();
    $('#assigned-child-users > option').each(function(){
        this.selected = false;
    });
    if (role == jsVars.GROUP_COUNSELLOR_ID_JS ||  role == jsVars.collegeStaffGroupId){
        $("#userListOfCounselor").show();
    }
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    $('.chosen-select').trigger('chosen:updated');
}
    
function GetUserUnMaskCollegeView()
{
    var UserSelected = 0;
    if ($('#userId').length > 0)
    {
        UserSelected = $('#userId').val();
    }
    var CollegeSelected = $('#select_institute').val();
    var role = $('#roleDropdown').val();
    //remove error
    $('#select_institute').parent().find('span.error').remove();
    $.ajax({
        url: jsVars.GetUserUnMaskCollegeLink,
        type: 'post',
        data: {role: role, CollegeSelected: CollegeSelected, UserSelected: UserSelected},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        success: function (html) {
            if (html == 'session')
            {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } 
            else if (html == 'required')
            {
                $('#select_institute').parent().append('<span class="error">College and user role both are required.</span>');
                $('#AllowToUnmaskCollege').attr('checked', false);
            } 
            else if (html == 'error')
            {
                $('#select_institute').parent().append('<span class="error">Unable to load unmasked colleges list view.</span>');
                $('#AllowToUnmaskCollege').attr('checked', false);
                if(role == jsVars.GROUP_PUBLISHER_ID_JS){
                    $('#UserUnmaskSection').html('');
                }
            } 
            else
            {
                $('#UserUnmaskSection').html(html);
                $('.panel-group').on('hidden.bs.collapse', toggleIcon);
                $('.panel-group').on('shown.bs.collapse', toggleIcon);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}



function PopulateStateCityList(value) {
    if(value.length > 2 ){
        $.ajax({
            url: '/users/populate-state-city',
            type: 'post',
            data: { key: value},
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars.csrfToken
            },
            success: function (html) {
                if (html === 'session_logout'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else if(html === 'error') {
                    //do nothing
                } else {
                    $('#load_table_column').html(html);
                    $('#load_table_column').show();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }else{
        $('#load_table_column').html('');
        $('#load_table_column').hide();
    }
}

function setTableTagValue(key,label) {
 
    var existing_val = $('#assigned_area').val();
    var duplicateFlag = 0;
    if (existing_val === '') {
        existing_val = key;
    } else {
        var existing_val_array = existing_val.split(',');
        if($.inArray(''+key, existing_val_array) === -1){
            existing_val += ',' + key;
        }else{
            duplicateFlag = 1;
        }
    }
    
    var tag_key = '<span id="' + key + '">' + label + ' <i onclick="deleteAliasField(\'' + key + '\',this);" aria-hidden="true" class="fa fa-times"></i></span>';
    if(duplicateFlag === 0){
        $('#assigned_area').val(existing_val);
        $("#border_selected_tag").append(tag_key);
        $("#input_enter" ).val('');
        $('#load_table_column').html('');
        $('#load_table_column').hide();
    }
    


}

function deleteAliasField(key, elem) {

    var alias_value = $('#assigned_area').val();
    if (alias_value !== '') {
        var alias_value_array = alias_value.split(',');

        var index = alias_value_array.indexOf(key);
        if (index > -1) {
            alias_value_array.splice(index, 1);
        }
        var alias_val = '';
        if (alias_value_array.length > 0) {
            alias_val = alias_value_array.toString();
        }
        $('#assigned_area').val(alias_val);
        jQuery(elem).parent('span').remove();
    }
}

function uploadMouForm(userId, $this){
    if($('#institute_selected').val() == ''){
        alertPopup('Please select institute.', 'error');
        return false;
    }
    
    $.ajax({
        url: '/area/uploadMouForm',
        type: 'post',
        data: { userId: userId, collegeId:$('#institute_selected').val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (html) {
            if(html == 'Invalid'){
                alertPopup('Please select institute.', 'error');
            }else{
                $('#add_uplaodmouform_popup').html(html);
                $('#uploadmouformPopUp').trigger('click');
                fileSelectShow();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function saveUploadMouForm(){
    var form = $('#addUploadMouForm')[0];
    var formData = new FormData(form);
    $('.upload_mou-error').html();
    if($('.upload_moufile').val() != ''){
        $.ajax({
            url: $(form).attr("action"),
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function (json) {
                if(json['status'] != 'success'){
                    $('.upload_mou-error').html(json['status']);
                } else {
                    var successMessage = '';
                    if(json['deleted'] == 'deleted'){
                        successMessage = '<p class="text-center" style="color:green">File deleted successfully!</p>';
                    }
                    if(json['uploaded'] == 'success'){
                        successMessage = successMessage + '<p class="text-center" style="color:green">File uploaded successfully!</p>';
                    }
                    $('#add_uplaodmouform_popup .modal-body').html(successMessage);
                }
            },
            cache: false,
            contentType: false,
            processData: false
        });
    } else {
        $('.upload_mou-error').html('Field is required!');
    }
}

$(document).ready(function () {
    // We can attach the `fileselect` event to all file inputs on the page
    if($('#UserManagementSection').length != 0){
        $(document).on('change', ':file', function () {
            var input = $(this),
                numFiles = input.get(0).files ? input.get(0).files.length : 1,
                label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
                input.trigger('fileselect', [numFiles, label]);
        });
    }
});

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

function remove_upload_mou_saved($this){
    if($this != 'mou'){
        $('.mou-remove-first').hide();
        $('.confirm-remove-mou').show();
    } else {
        $('#moualreadyupload').val(0);
        var form = $('#addUploadMouForm')[0];
        var formData = new FormData(form);
        $.ajax({
            url: $(form).attr("action"),
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function (json) {
                if(json['status'] != 'success'){
                    $('.upload_mou-error').html(json['status']);
                } else {
                    if(json['deleted'] == 'deleted'){
                        $('.confirm-remove-mou').hide();
                        $('.saved-uploaded').hide();
                        $('.mou-upload-container').show();
                    }
                }
            },
            cache: false,
            contentType: false,
            processData: false
        });
    }
    
//    $('.form-upload-field').show();
//    $('.saved-fields').hide();
//    
}

function loadAssignUsers(){
    var college_id = $.trim($("#select_institute").val());
    var default_assigned_child_users = $.trim($("#default_assigned_child_users").val());
    var roleDropdown = $.trim($("#roleDropdown").val());
    $.ajax({
        url: '/users/show-hierarchy-users',
        type: 'post',
        dataType: 'html',
        data: {'college_id':college_id,'default_assigned_child_users':default_assigned_child_users,'roleDropdown':roleDropdown},
        beforeSend: function () { 
            $('#listloader').show();
        },
        complete:function(){
            $('#listloader').hide();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
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
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                $('.chosen-select').trigger('chosen:updated');
            } else {
                //alertPopup(responseObject.message, 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
}
