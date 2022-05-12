function TemplatesLoadForms(value, default_val) {
    $.ajax({
        url: '/voucher/get-forms',
        type: 'post',
        dataType: 'html',
        data: {
            "college_id": value,
            "default_val": default_val,
            "multiselect": "multiselect"
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        async:true,
        success: function (data) {
            if(data=="session_logout"){
                window.location.reload(true);
            }
            // on submit show dependent form fields after submit page
            $("input[name = 'layout_template_id']").parent().find('.error').remove();
            if(!$('.error').is(":visible")) {
                $('.error').hide();
                $("select[name = 'device_type']").val("");
            }
            $('#div_load_forms').html(data);
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

$(document).ready(function(){
    var college_id = parseInt($("#FilterTemplateList #college_id").val());
    if(parseInt($("#FilterTemplateList #college_id").val()) > 0){
        var promise = new Promise(function(resolve, reject) {
            LoadTemplateData("reset");
            resolve();
        });
        promise.then(function(){
            LoadFormshere(college_id, "");
        });
    }
    $('select').bind('change', function(){
        $(this).siblings('.error').hide();
    });
    $('input').bind('keypress', function(){
        $(this).parent().siblings('.error').hide();
    });
    $('form#template-page').on('submit', function() {
        var counter = 0;
        var template_type = $('input[name="template_type"]').val();
        $("div.common-fields select.required, div."+template_type+" select.required").each(function() {
            if ($(this).val() === "") {
                $(this).siblings('.error').remove();
                $(this).parent().append('<span class="error">'+$(this).data('errormsg')+'</span>');
               counter++;
            }
        });
        $("div.common-fields input.required, div."+template_type+" input.required").each(function() {
            if ($(this).val() === "") {
                $(this).parent().siblings('.error').remove();
                $(this).parent().parent().append('<span class="error">'+$(this).data('errormsg')+'</span>');
               counter++;
            }
        });
        if(counter > 0){
            return false;
        }
    });

    $("input[name ='template_type']").bind('click', function(){
        if($(this).val() == 'marketing_page') {
            getMarketingDomains();
            $('.landing_page').hide();
            $('.marketing_page').show();
        } else {
            $('.landing_page').show();
            $('.marketing_page').hide();
        }
    });
    // hide template style and title when create page
//    if(jsVars.create_template != 'undefined' && jsVars.create_template == true) {
//        if($('select[name="layout_template_id"]').val() == "" && $('input[name="title"]').val() == "") {
//            $('.device-type-options').hide();
//        }
//    }
    $("select[name = 'device_type']").bind('change', function(){
        var val = $(this).val();
        var college_id = $('select[name="college_id"]').val();
        if(college_id == "") {
            $('select[name="college_id"]').parent().find('.error').remove();
            $('select[name="college_id"]').parent().append('<span class="error">Field mandatory!</span>');
            return false;
        }
        if(val != "") {
            $.ajax({
                url: '/templates/getTemplateList',
                type: 'post',
                dataType: 'json',
                data:  {device_type:val, college_id:college_id},
                headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                async:true,
                success: function (json) {
                    if(json=="session_logout"){
                        window.location.reload(true);
                    }
                    if (typeof json['layout_template_id'] != 'undefined') {
                        $("input[name = 'layout_template_id']").parent().find('.error').remove();
                        if(json['has_option'] == false) {
                            $("input[name = 'layout_template_id']").after('<span class="error">Template style can only be selected/edited from Basic Configuration of the college.</span>');
                        }
                        $("select[name = 'layout_template_id']").empty();
                        $("select[name = 'layout_template_id']").append(json['layout_template_id']);
//                        $('.device-type-options').show();
                        $('.chosen-select').trigger('chosen:updated');
                        $("input[name = 'layout_template_id']").val($(json['layout_template_id']).val());

                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        }
    });
    
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
    // add more body block on second and third page
    $(document).on('click', '.block_add_more_btn', function () {
        var bodyBlockHtml = $('.body-blk-container:first').clone();
        $(bodyBlockHtml).find(".form-control").attr('name', 'body_'+($('.body-blk-container').length+1));
        $(bodyBlockHtml).find(".form-control").attr('data-id', 0);
        $(bodyBlockHtml).attr('data-id', 0);
        $(bodyBlockHtml).find(".form-control").val('');
        $('.body-blk-container:last').after(bodyBlockHtml);
    });
    
    // edit block
    $(document).on('click', '.edit-block', function () {
        $('#blockEditorAction').modal();
        var data_name = $(this).parents('.formAreaCols').find(".form-control").attr('name');
        var data_id = $(this).parents('.formAreaCols').find(".form-control").attr('data-id');
        var t_id = $('#template_id_content').val();
        $.ajax({
            url: '/templates/stepBlockModal',
            type: 'post',
            dataType: 'html',
            data:  {data_name: data_name, data_id: data_id, tid: t_id},
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            async:true,
            success: function (data) {
                if(data=="session_logout"){
                    window.location.reload(true);
                }
                $('#block-body-form').html(data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });
    
    //delete block
    $(document).on('click', '.delete-block', function () {
        var data_name = $(this).parents('.formAreaCols').find(".form-control").attr('name');
        var data_id = $(this).parents('.formAreaCols').find(".form-control").attr('data-id');
        $('#ConfirmMsgBody').html('Do you want to proceed to delete action?');
        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
                .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
            e.preventDefault();
            $.ajax({
                url: '/templates/ajaxStepDeleteBlock',
                type: 'post',
                dataType: 'json',
                data: {data_name: data_name, data_id: data_id, page:$('#page_type_content').val(), tid:$('#template_id_content').val()},
                headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                async:true,
                success: function (json) {
                    if(typeof json.error != 'undefined') {
                        if (json.error == "session_logout") {
                            location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                        } else if(json.error == "invalid_csrf") {
                            window.location.reload(true);
                        } else if(json.error == 'invalid_request'){
                            alertPopup('Something went wrong', 'error');
                        } else {
                            alertPopup(json.error, 'error');
                        }
                    } else {
                        if ((typeof json.success != 'undefined' && json.success == true) || data_id == 0) {
                            if (data_name == 'header_prefix' || data_name == 'header' || data_name == 'footer' || data_name == 'footer_suffix') {
                                $('input[name="' + data_name + '"]').parent().append(json['message']);
                                $('input[name="' + data_name + '"]').attr('data-id', 0);
                                $('input[name="' + data_name + '"]').val('');
                            } else {
                                if ($('.body-blk-container').length == 1) {
                                    $('input[name="' + data_name + '"]').attr('data-id', 0);
                                    $('input[name="' + data_name + '"]').val('');
                                } else {
                                    $('input[name="' + data_name + '"]').parents('.body-blk-container').remove();
                                }
                            }
                        }
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
            $('#ConfirmPopupArea').modal('hide');
        });
    });
    
    //copy block
    $(document).on('click', '.copy-block', function () {
        var data_name = $(this).parents('.formAreaCols').find(".form-control").attr('name');
        var data_id = $(this).parents('.formAreaCols').find(".form-control").attr('data-id');
        $.ajax({
            url: '/templates/ajaxStepCopyBlock',
            type: 'post',
            dataType: 'json',
            data:  {data_name: data_name, data_id: data_id, page:$('#page_type_content').val(), tid:$('#template_id_content').val()},
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            async:true,
            success: function (json) {
                if(json['error'] != '') {
                    if (json['error'] == "session_logout") {
                        location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                    } else if(json['error'] == "invalid_csrf") {
                        window.location.reload(true);
                    } else if(json['error'] == 'invalid_request'){
                        alertPopup('Something went wrong', 'error');
                    } else {
                        alertPopup(json.error, 'error');
                    }
                } else {
                    if(json['success'] == true) {
                        var bodyBlockHtml = $('input[name="'+data_name+'"]').parents('.body-blk-container').clone();
                        $(bodyBlockHtml).find(".form-control").attr('name', json['data_name']);
                        $(bodyBlockHtml).find(".form-control").attr('data-id', json['data_id']);
                        $(bodyBlockHtml).find(".form-control").val(json['title']);
                        $('input[name="'+data_name+'"]').parents('.body-blk-container').after(bodyBlockHtml);
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });

    //check availability
    $(document).on('click', '#checkAvailability', function () {
        $('#domainMsg, #domainStatus').html('');
        var domain = $('#marketingPageDomain').val(), path = $.trim($('#marketingPagePath').val());
        //var collegeId = $("select[name = 'college_id']").val();
        var collegeId = $("#college_id").val();
        if (domain == '' && path == '') {
            $('#domainMsg').html('<span class="error">Please select domain and enter path.</span>');
        } else if (domain == '') {
            $('#domainMsg').html('<span class="error">Please select domain.</span>');
        } else if (path == '') {
            $('#domainMsg').html('<span class="error">Please enter path.</span>');
        } else if(path.indexOf('/') === 0 || path.indexOf('/') === (path.length -1) || path.indexOf('-') === 0 || path.indexOf('-') === (path.length -1)) {
            $('#domainMsg').html('<span class="error">Invalid path.</span>');
        } else if(path.length > 150) {
            $('#domainMsg').html('<span class="error">Invalid path, length should be upto 150 characters.</span>');
        } else if(collegeId == '') {
            $("select[name = 'college_id']").parents('div').find('span.error').html($("select[name = 'college_id']").data('errormsg'));
        } else {
            var pathArr = path.split("/");
            var length = pathArr.length;
            if(pathArr[length-1] == 'index') {
                $('#domainMsg').html('<span class="error">Invalid path, index.html file name not allowed.</span>');
                return false;
            }
            $.ajax({
                url: jsVars.checkMarketingUrlAvailability,
                type: 'post',
                dataType: 'json',
                data: {domain: domain, path: path, college_id: collegeId},
                headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                success: function (data) {
                    if (data.redirect != '') {
                        location = data.redirect;
                    } else if (data.error != '') {
                        if (data.error == 'invalid_csrf') {
                            window.location.reload(true);
                        } else {
                            alertPopup(data.error, 'error');
                        }
                    } else {
						$('#domainMsg').html('');
                        if (data.status == true) {
							$('#domainStatus').html('<span class="error"><i class="fa fa-times" aria-hidden="true"></i>&nbsp;URL Not Available</span>');
                            //alertPopup('The URL is not available', 'error');
                        } else {
                           // alertPopup('The URL is available', 'success');
						   $('#domainStatus').html('<span class="text-success"><i class="fa fa-check-circle" aria-hidden="true"></i>&nbsp;URL Available</span>');
                        }
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        }
    });

    $('#marketingPageDomain').on('change', function() {
        console.log('cd',jsVars.collegeDomain);
        console.log('vv',this.value);
        console.log('mar',jsVars.marketingPageSlug);
        if(this.value == jsVars.collegeDomain) {
            $('#mktPageSlugContainer').html(jsVars.marketingPageSlug);
        } else {
            $('#mktPageSlugContainer').html('/');
        }
    });

    // save on block edit by popup
    $(document).on('submit', 'form#step-block-form', function (e) {
        e.preventDefault();
        $('form#step-block-form .error').remove();
        $("input.required, textarea.required").each(function() {
            if ($(this).val() === "") {
                $(this).parent().siblings('.error').remove();
                $(this).parent().parent().append('<span class="error">Field mandatory!</span>');
            }
        });
        data = $('form#step-block-form').serializeArray();
        data.push({name: "page", value: $('#page_type_content').val()});
        data.push({name: "template_id", value: $('#template_id_content').val()});
        $.ajax({
            url: jsVars.FULL_URL+'/templates/ajaxStepModalEditorSave',
            type: 'post',
            dataType: 'json',
            data:  data,
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            async:true,
            success: function (json) {
                if(typeof json['error'] != 'undefined' && json['error'] != '') {
                    if (json['error'] == "session_logout") {
                        location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                    } else if(json['error'] == "invalid_csrf") {
                        window.location.reload(true);
                    } else if(json['error'] == 'invalid_request'){
                        alertPopup('Something went wrong', 'error');
                    } else {
                        alertPopup(json.error, 'error');
                    }
                } else {
                    if(json['success'] == true) {
                        $('input[name="'+json['data_old_name']+'"]').val(json['title']);
                        $('input[name="'+json['data_old_name']+'"]').attr('data-id', json['data_id']);
                        $('input[name="'+json['data_old_name']+'"]').parents('.body-blk-container').attr('data-id', json['data_id']);
                        $('input[name="'+json['data_old_name']+'"]').attr('name', json['data_name']);
                        dropDownMovement('li.body-blk-container');
                        $('#blockEditorAction').modal('hide');
                        $('#block-body-form').empty();
                        alertPopup('Data updated successfully.', "success");
                    }
                }
                
//                $('#block-body-form').html(json);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
//        $('#blockEditorAction').modal('hide');
    });
    
    //call load templates on page load
    if($("#manage-template-layout").length>0){
        //LoadTemplateData("reset");
        LoadReportDateRangepicker();
    }
    /**
    * drang and drop function of nestable
    * @returns {undefined}
    */
    if($("#create-template-step-one").length>0){
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
    if($('#body-draggable').length) {
        $('#body-draggable').nestable().on('change', function(){
            dropDownMovement('li.body-blk-container');
        });
    }

    $('form#gallery-template-page').on('submit', function() {

    });
});
function dropDownMovement(cl){
    values = [];
    $(cl).each(function(i,el){
        var value = $(el).attr('data-id');
        if(value != 0) {
            values.push(value);
        }
    });
    if(values.length) {
        $('div.loader-block').show();
        $.ajax({
            url: jsVars.FULL_URL + '/templates/ajaxBodySortorder',
            type: 'post',
            dataType: 'html',
            data: {
                "sortData": values
            },
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            success: function (json) {
                if (json == "session_logout") {
                    window.location.reload(true);
                }
                $('div.loader-block').hide();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

/****For display template listing***/
    function LoadTemplateData(type) {  
        //make buttun disable
        if ($('#college_id').val() == '' || $('#user_college_id').val() == '0') {
            alertPopup('Please Select College Name','error');
            $('#load_msg_div').show();
            return false;
        }
        $(':input[type="button"]').attr("disabled", true);
        var data = [], varPage = $('#pageJump').val(), rows = $('#rows').val();
        if (type == 'reset') {
            varPage = 1;
            $('#pageJump').val(varPage);
            $('#load_more_results_template').html("");
//            $('#load_more_button').show();
//            $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;Loading...');
        }        
        data = $('#FilterTemplateList, #lpsearch').serializeArray();
        data.push({name: "page", value: varPage});
        data.push({name: "rows", value: rows});
        data.push({name: "type", value: type});

//        $('#load_more_button').attr("disabled", "disabled");
//        $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;Loading...');

        $.ajax({
            url: jsVars.FULL_URL + '/templates/ajax-lists',
            type: 'post',
            dataType: 'html',
            data: data,
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            beforeSend: function () {
                $('#listloader').show();
            },
            complete: function () {
               $('#listloader').hide();
            },
            async:true,
            success: function (data) {
                $(':input[type="button"]').removeAttr("disabled");
                if (data == "session_logout") {
                    window.location.reload(true);
                } else if (data == "norecord") {
                    if (varPage == 1)
                        error_html = "No Records found";
                    else
                        error_html = "No More Record";
                    $('#load_more_results_template').append("<tr><td class=' text-danger text-center fw-500' colspan='10'>" + error_html + "</td></tr>");
//                    $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Templates');
                    if(type=='reset'){
                        $('#tot_records').html("");
                    }
//                    $('#load_more_button').hide();
                    $('.pageContainer').show();
                    $('#load_msg_div').hide();
                    $('.offCanvasModal').modal('hide');
                    $('.layoutPagination').hide();
                } else {
                    $('.layoutPagination').show();
                    $('#load_msg_div').hide();
                    data = data.replace("<head/>", '');
                    $('#load_more_results_template').html(data);
                    if(varPage == 1 && maxPage != 'undefined') {
                        $('#maxPage').html(maxPage);
                        if(maxPage == 1) {
                            $('.prev, .next').removeClass('disabled').addClass('disabled');
                        } else {
                            $('.prev').removeClass('disabled').addClass('disabled');
                            $('.next').removeClass('disabled');
                        }
                    } else if(maxPage != 'undefined' && varPage == maxPage) {
                        $('.prev').removeClass('disabled');
                        $('.next').removeClass('disabled').addClass('disabled');
                    } else {
                        $('.prev, .next').removeClass('disabled');
                    }
//                    var lmrtLenght = $('#load_more_results_template > tr').length;
//                    if (lmrtLenght < 10){
//                        $('#load_more_button').hide();
//                    }
                    $('.offCanvasModal').modal('hide');
					$('.pageContainer').show();
                    dropdownMenuPlacement();
					table_fix_rowcol();
					tableHeight();
					window.onresize = function() {
						tableHeight();
					}
//                    $('#load_more_button').removeAttr("disabled");
//                    $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Templates');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }

$('#pageJump').bind('keypress', function(e) {
    if ((e.which >= 48 && e.which <= 57) ||
        e.which === 8 || //Backspace key
        e.which === 13   //Enter key
        ) {
    } else {
      e.preventDefault();
    }
});
$('#pageJump').on("paste",function(e) {
    e.preventDefault();
});

$(document).on('change', '#pageJump', function() {
    if($('#pageJump').val() == '' || $('#pageJump').val().match(/^\d+$/) == null) {
        alertPopup('Invalid Page Number', 'error');
        return false;
    } else if(parseInt($('#pageJump').val()) < 1 || parseInt($('#pageJump').val()) > parseInt($('#maxPage').html())) {
        alertPopup('Invalid Page Number', 'error');
        return false;
    }
    LoadTemplateData('');
});

$(document).on('change', '#rows', function() {
    $('#pageJump').val('1');
    LoadTemplateData('');
});

$(document).on('click', '.prev', function(event) {
    if($('#pageJump').val().match(/^\d+$/) == null) {
        alertPopup('Invalid Page Number', 'error');
        return false;
    } else if(parseInt($('#pageJump').val()) > parseInt($('#maxPage').html())) {
        alertPopup('Invalid Page Number', 'error');
        return false;
    } else if(parseInt($('#pageJump').val()) < 2) {
        event.preventDefault();
        return false;
    }
    var updatePageValue = parseInt($('#pageJump').val()) - 1;
    if(updatePageValue < 2) {
        $(this).addClass('disabled');
        $('.next').removeClass('disabled');
    }
    $('#pageJump').val(updatePageValue);
    LoadTemplateData('');
});

$(document).on('click', '.next', function(event) {
    if($('#pageJump').val().match(/^\d+$/) == null) {
        alertPopup('Invalid Page Number', 'error');
        return false;
    } else if(parseInt($('#pageJump').val()) < 1) {
        alertPopup('Invalid Page Number', 'error');
        return false;
    } else if(parseInt($('#pageJump').val()) >= parseInt($('#maxPage').html())) {
        event.preventDefault();
        return false;
    }
    var updatePageValue = parseInt($('#pageJump').val()) + 1;
    if(updatePageValue >= $('#maxPage').html()) {
        $(this).addClass('disabled');
        $('.prev').removeClass('disabled');
    }
    $('#pageJump').val(updatePageValue);
    LoadTemplateData('');
});

/**
 * return all form name only of give college
 * @param {type} cid
 * @return {html}
 */
function showAllForms(cid) {
    $.ajax({
        url: jsVars.FULL_URL + '/templates/get-all-forms',
        type: 'post',
        dataType: 'html',
        
        data: {'template_id':cid},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            //$('div.loader-block').show();
			$('#abc'+cid).append('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>')
        },
        complete: function () {
            //$('div.loader-block').hide();
			$('#abc'+cid).children('.fa-spin').remove();
        },
        async:true,
        success: function (response) {
            if(response=='session_logout'){
                window.location.reload(true);
                return false;
            }
            //$('#mainData').html(response);
			//$('.popover-content').html(response);
			//$('.getForms').attr('data-content', response);
			$('#abc'+cid).popover({
                container: 'body',
                html: true,
				trigger: 'focus',
				title: 'Assigned to Forms',
				placement: 'left',
                content: response
            });
            $('#abc'+cid).popover('show');
            //$("#DisplayFormsHere").trigger('click');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function initLayoutCKEditor(tokens){
     if(typeof CKEDITOR == 'undefined')
     {
         return;
     }
    //$('#CommunicationBulkAction div.loader-block').show();
    if(typeof tokens =='undefined' || tokens == ''){
        tokens = [["", ""]];
    }
    
    var old_data = '';
    if(typeof CKEDITOR.instances['editor'] != 'undefined'){
        var old_data = CKEDITOR.instances['editor'].getData();
        
        delete CKEDITOR.instances['editor'];
        jQuery('#cke_editor').remove();
    }    

//CKEDITOR.instances['editor'] = null;
    
    
    var newToken = [];
    jQuery.each(tokens, function (index, category) {
        if(category !== ''){
            jQuery.each(category, function (index, value) {
                value = $.parseJSON(value);
                newToken.push(value);
            });
        }
    });
    if(typeof newToken =='undefined' || newToken == ''){
        newToken = [["", ""]];
    }
    console.log(tokens);
    console.log(newToken);
    CKEDITOR.replace( 'editor',{
        extraPlugins: 'token',
//        availableTokens: [
//            ["", ""],
//            ["token1"+Math.floor((Math.random() * 100) + 1), "token1"],
//            ["token2"+Math.floor((Math.random() * 100) + 1), "token2"],
//            ["token3"+Math.floor((Math.random() * 100) + 1), "token3"],
//        ],
        allTokens: tokens,
        availableTokens: newToken,

            tokenStart: '{{',
            tokenEnd: '}}',
            on: {
                instanceReady: function( evt ) {
                    $('div.loader-block').hide();
//                    alert('dddrr');
                },
                change: function( evt ) {
                    if($("#is_edit_template").length > 0) {
                        $("#is_edit_template").val(1);
                    }
                }
        }
    });

    if(old_data != ''){
        CKEDITOR.instances['editor'].setData(old_data);
    }
}

// for ck editor
 $.fn.modal.Constructor.prototype.enforceFocus = function() {
  modal_this = this
  $(document).on('shown.bs.modal', function (e) {
    if (modal_this.$element[0] !== e.target && !modal_this.$element.has(e.target).length 
    && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_select') 
    && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_text')) {
      modal_this.$element.focus()
    }
  })
};


/**
 * 
 * @param (string) post_data
 * @param (string) name
 * @returns {Boolean}
 */
function deleteTemplateById(post_data,name){
    $("#confirmYes").removeAttr('onclick');
    $('#confirmTitle').html("Confirm Delete action");
    $("#confirmYes").html('Delete');
    $("#confirmYes").siblings('button').html('Cancel');
    $('#ConfirmMsgBody').removeClass('font500');
    $('#ConfirmMsgBody').html('<p>Are you sure you want to <span class="fw-500 text-danger">delete</span> the <span class="fw-500">"' + name + '"</span> template ? </p> <p class="text-muted">Once deleted all data related to the template will be lost.</p>');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                e.preventDefault();
                $.ajax({
                    url: '/templates/delete',
                    type: 'post',
                    data: {'post_data': post_data, 'action': 'delete'},
                    dataType: 'json',
                    headers: {
                        "X-CSRF-Token": jsVars._csrfToken
                    },
                    beforeSend: function () {
                        $('div.loader-block').show();
                    },
                    complete: function () {
                        $('div.loader-block').hide();
                    },
                    success: function (json) {
                        if (typeof json['redirect'] !='undefined' && json['redirect'] !='') {
                            alertPopup(json['error'], 'error','/templates/layout-lists');
                        } else if (typeof json['error'] !='undefined' && json['error'] !='') {
                            alertPopup(json['error'], 'error');
                        } else if (typeof json['status'] !='undefined' && json['status'] == 200) {                            
                            alertPopup( json['message'], "success");
                            LoadTemplateData("reset");
                        }
                        return false;
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);                        
                    }
                });
                $('#ConfirmPopupArea').modal('hide');
            });
    return false;        
}


/**get templates list for liting page**/
/**
 * 
 * @param {type} device
 * @returns {undefined} html
 */
function LoadTemplateshere(device){
    //getTemplates
    $.ajax({
        url: jsVars.FULL_URL + '/templates/getTemplateListForFilter',
        type: 'post',
        dataType: 'json',
        data: {
            "device_type": device
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            if (json == "session_logout") {
                window.location.reload(true);
            }
            $("#template_type").html("");
            $("#template_type").html(json['layout_template_id']);
            $('.chosen-select').trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/**
 * This function will open a new window which will show the 
 * frontend for theme preview
 * @param {string} preview_link
 * @param {string} type
 * @returns {Boolean}
 */
function previewThemeURL(preview_link,type) {
    if(type=="mobile"){
        var newWin= window.open(preview_link, '_blank', 'width=420, height=600, left=400, scrollbars=yes')
    } else {
        var width=$( window ).width();;
        var newWin= window.open(preview_link, '_blank', 'width='+width+', height=700, left=0, scrollbars=yes')
    }

    if(!newWin || newWin.closed || typeof newWin.closed=='undefined') {
        setTimeout("window.location.reload();",10000);
        return false;
    }
}

/**
 * Remove js and css on click cross button in step one
 * Remove whole div on click
 */
$(".removeDiv").on('click', function(){
    $(this).parent().parent().parent().parent().parent().remove();
});



/**
 * this function for make standard template on form submit after selecting templates
 * @param (string) post_data
 * @param (string) name
 * @returns {Boolean}
 */
function makeItStandard_onsubmit(post_data,name){
    
    var data = [];
    data = $('#makeDefault').serializeArray();
    data.push({name: "post_data", value: post_data});
    $.ajax({
        url: '/templates/makeItStandard',
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('div.loader-block').show();
        },
        complete: function () {
            $('div.loader-block').hide();
        },
        async:true,
        success: function (json) {
            if (typeof json['redirect'] !='undefined' && json['redirect'] !='') {
                alertPopup(json['error'], 'error','/templates/layout-lists');
            } else if (typeof json['error'] !='undefined' && json['error'] !='') {
                $("#message").html(json['error']);
            } else if (typeof json['status'] !='undefined' && json['status'] == 200) {                            
                alertPopup( json['message'], "success");
                LoadTemplateData("reset");
                $('#ConfirmPopupArea').modal('hide');
            }
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);                        
        }
    });
                
    return false;        
}

/**
 * make its stantdard on click on button from list page of templates
 * @param {type} post_data
 * @param {type} name
 * @returns {Boolean}
 */
function makeItStandard(post_data,name){
    $("#confirmYes").removeAttr('onclick');
    $('#confirmTitle').html("Confirm make it standard ?");
    $("#confirmYes").html('Make it Standard');
    $("#confirmYes").siblings('button').html('Cancel');
    $('#ConfirmMsgBody').removeClass('font500');
    $('#ConfirmMsgBody').html('<p>Are you sure you want to make the "<span class="fw-500">' + name + '</span>" a standard template?</p> <p class="text-muted">This template will then be reflected in the Basic configuration under "<span class="fw-500">Choose landing page template style</span>"</p>');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false}).off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                e.preventDefault();
                $.ajax({
                    url: '/templates/make_standards',
                    type: 'post',
                    data: {'post_data': post_data, 'action': 'showTemplate'},
                    dataType: 'html',
                    headers: {
                        "X-CSRF-Token": jsVars._csrfToken
                    },
                    beforeSend: function () {
                        $('div.loader-block').show();
                    },
                    complete: function () {
                        $('div.loader-block').hide();
                    },
                    async:true,
                    success: function (json) {
                        if(json=="session_logout"){
                            window.location.reload(true);
                        }
                        if(json=='mobile' || json=='desktop'){
                            
                            if(json=='mobile'){
                                var dtype='Desktop';
                            }else{
                                var dtype='Mobile';
                            }
                            
                            $('#ConfirmPopupArea').modal('hide');
                            alertPopup('Make it standard popup "'+dtype+' Template not found. Please make both desktop and mobile templates to select this template as a "Standard Template"".', 'error');
                        }else{
                            $("#confirmTitle").html('Make it Standard');
                            $("#confirmYes").html('Make it Standard');
                            $("#confirmYes").siblings('button').html('Close');
                            $("#confirmYes").attr('onclick','makeItStandard_onsubmit("'+post_data+'","'+name+'")');
                            $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false});
                            $('#ConfirmMsgBody').html(json);
                            $('.chosen-select').trigger('chosen:updated');
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);                        
                    }
                });
        //$('#ConfirmPopupArea').modal('hide');
    });
    return false;   
}

/****this function added for only file type fieds*****/
function fileSelectShow(){
      $(':file').on('fileselect', function(event, numFiles, label) {
          var input = $(this).parents('.filescustom').find(':text'),
              log = numFiles > 1 ? numFiles + ' files selected' : label;
              
          if( input.length ) {
              input.val(log);
          } else {
              if( log ) alert(log);
          }
      });
}

/**
 * make its stantdard on click on button from list page of templates
 * @param {type} post_data
 * @param {type} name
 * @returns {Boolean}
 */
function makeItUndo(post_data,name){
    $("#confirmYes").removeAttr('onclick');
    $('#confirmTitle').html("Confirm UNDO Action");
    $("#confirmYes").html('Confirm');
    $("#confirmYes").siblings('button').html('Cancel');
    $('#ConfirmMsgBody').removeClass('font500');
    $('#ConfirmMsgBody').html('<p>Are you sure you want to <span class="fw-500">undo</span> the "<span class="fw-500">'+name+'</span>" template?<p> <p class="text-muted">Please note once done the action cannot be redone.</p>');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                e.preventDefault();
                $.ajax({
                    url: '/templates/makeUndo',
                    type: 'post',
                    data: {'post_data': post_data, 'action': 'showTemplate'},
                    dataType: 'html',
                    headers: {
                        "X-CSRF-Token": jsVars._csrfToken
                    },
                    beforeSend: function () {
                        $('div.loader-block').show();
                    },
                    complete: function () {
                        $('div.loader-block').hide();
                    },
                    async:true,
                    success: function (json) {
                        if(json=="session_logout" || json=="invalid_csrf"){
                            window.location.reload(true);
                        } else if(json=="invalid_request") {
                            alertPopup('Something went wrong', "error");
                        } else {
                            alertPopup( json, "success");
                            LoadTemplateData("reset");
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

function disableTemplateById(post_data,name,type){
    $("#confirmYes").removeAttr('onclick');
    $("#confirmYes").siblings('button').html('Cancel');
    if(type =='enable'){
        $('#confirmTitle').html("Confirm Enable action");
        $("#confirmYes").html('Enable');
    }else{
        $('#confirmTitle').html("Confirm Disable action");
        $("#confirmYes").html('Disable');
    }
	$('#ConfirmMsgBody').removeClass('font500');
    $('#ConfirmMsgBody').html('Are you sure to <span class="fw-500">'+type+'</span> the <span class="fw-500">"' + name + '"</span> template ?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                e.preventDefault();
                $.ajax({
                    url: '/templates/disable',
                    type: 'post',
                    data: {'post_data': post_data, 'action': 'disable'},
                    dataType: 'json',
                    headers: {
                        "X-CSRF-Token": jsVars._csrfToken
                    },
                    beforeSend: function () {
                        $('div.loader-block').show();
                    },
                    complete: function () {
                        $('div.loader-block').hide();
                    },
                    success: function (json) {
                        if (typeof json['redirect'] !='undefined' && json['redirect'] !='') {
                            alertPopup(json['error'], 'error','/templates/layout-lists');
                        } else if (typeof json['error'] !='undefined' && json['error'] !='') {
                            alertPopup(json['error'], 'error');
                        } else if (typeof json['status'] !='undefined' && json['status'] == 200) {                            
                            alertPopup( json['message'], "success");
                            LoadTemplateData("reset");
                        }
                        return false;
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);                        
                    }
                });
                $('#ConfirmPopupArea').modal('hide');
            });
    return false;        
}

function getMarketingDomains() {
    if($('input[name="template_type"]').val() == 'marketing_page' && $('select[name="college_id"]').val() != '') {
        $.ajax({
            url: jsVars.marketingDomainsUrl,
            type: 'post',
            dataType: 'json',
            data: { college_id: $('select[name="college_id"]').val() },
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            success: function (data) {
                if(data.redirect != ''){
                    location = data.redirect;
                } else if (data.error != '') {
                    if(data.error == 'invalid_csrf') {
                        window.location.reload(true);
                    } else {
                        alertPopup(data.error, 'error');
                    }
                } else if (data.status == true) {
                    let domains = '<option value="">Select Domain</option>';
                    jsVars.collegeDomain = data.domains.clg;
                    $('#mktPageSlugContainer').html('/');
                    if(data.domains.clg != '') {
                        jsVars.collegeDomain = data.domains.clg;
                        domains+= '<option value="'+data.domains.clg+'" >'+data.domains.clg+'</option>';
                    }
                    if(data.domains.mkt.length > 0) {
                        for(let i=0; i<data.domains.mkt.length;i++) {
                            domains+= '<option value="'+data.domains.mkt[i]+'" >'+data.domains.mkt[i]+'</option>';
                        }
                    }
                    $('select[name="marketing_domain"]').html(domains);
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
    }
}
var addTag = false;
$("#search_tag").keyup(function () {
    addTag = false;
    $("#suggesstion-box").hide();
    var search_tag = $(this).val();
    if(search_tag.length > 15) return false;
    var clg_id = 0;
    if($('select[name="college_id"]').length > 0) {
        clg_id = $('select[name="college_id"]').val();
    } else if($('input[name="college_id"]').length > 0) {
        clg_id = $('input[name="college_id"]').val();
    }
    if (search_tag.length > 2 && clg_id != '' && clg_id != 0) {
        $.ajax({
            url: '/offline/get-tag-list-auto-search',
            type: 'post',
            dataType: 'json',
            data: {search_common: search_tag, college_id: clg_id, type: 'landing_page'},
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            async: false,
            success: function (json) {
                if (typeof json['session_error'] != 'undefined' && json['session_error'] == 'session_logout') {
                    window.location.reload(true);
                } else if (typeof json['error'] != 'undefined' && json['error'] != '') {
                    alertPopup(json['error'], 'error');

                } else if (typeof json['data']['tag'] != 'undefined' && json['data']['tag'] != '') {
                    if (typeof json['data']['count'] != 'undefined' && json['data']['count'] > 0) {
                        $("#suggesstion-box").show();
                        $("#suggesstion-box").html(json['data']['tag']);
                        $("#search-box").css("background", "#FFF");
                    } else {
                        addTag = true;
                    }
                } else {
                    alertPopup("error", 'error');
                }
            }
        });
    } else {
        return false;
    }
});

//tag show on div
function showTagOnDiv(tagid, tagname) {
    var all_tag_id = $("#tag_id_val").val();
    var tagIns = all_tag_id.split(',');
    var added = false;
    if ($.inArray(tagid, tagIns) >= 0) {
        added = true;
    }
    if (!added) {
        tagIns.push(tagid);
        $("#showtagdivid_" + tagid).addClass("disabled");
        $("#search_tag").val(tagname);
        var name = '<span class="tag label label-primary remove_tag" onClick="removeTagId(\'' + tagid + '\');" id=\'remove_tag_' + tagid + '\'>' + tagname + ' <i aria-hidden="true" class="fa fa-times"></i><input value=' + tagname + ' type="hidden"></span>  ';
        $("#show_tag_list").append(name);
        $("#tag_id_val").val(tagIns.join(','));
    }
    suggesstionbox();
}
//remove show tag form div
function removeTagId(removetagid) {
    suggesstionbox();
    var all_tag_id = $("#tag_id_val").val();
    var tagIns = all_tag_id.split(',');
    tagIns = jQuery.grep(tagIns, function (value) {
        return value != removetagid;
    });
    $("#remove_tag_" + removetagid).remove();
    $("#tag_id_val").val(tagIns.join(','));
}
//hide  suggesstionbox
function suggesstionbox() {
    $("#search_tag").val('');
    $("#suggesstion-box").hide();
    $("#suggesstion-box").html('');
}
//add new tag
function addNewTag() {
    addTag = true;
    var add_search_tag = $("#search_tag").val();
    var clg_id = 0;
    if($('select[name="college_id"]').length > 0) {
        clg_id = $('select[name="college_id"]').val();
    } else if($('input[name="college_id"]').length > 0) {
        clg_id = $('input[name="college_id"]').val();
    }
    $('select[name="college_id"]').val()
    $.ajax({
        url: '/offline/add-new-tag',
        type: 'post',
        dataType: 'json',
        data: {name: add_search_tag.toLowerCase(), college_id: clg_id, module: 'landing_page'},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        async: false,
        success: function (json) {
            if (typeof json['session_error'] != 'undefined' && json['session_error'] == 'session_logout') {
                window.location.reload(true);
            } else if (typeof json['error'] != 'undefined' && json['error'] != '') {
                alertPopup(json['error'], 'error');
            } else if (typeof json['data']['sucess'] != 'undefined' && json['data']['sucess'] != '') {
                addTag = false;
                showTagOnDiv(json['data']['id'], json['data']['name']);
                $("#search_tag").val('');
            } else {
                alertPopup("error", 'error');
            }
        }
    });
}

function initUnlayerEditor(params, templateJson) {
    if(typeof unlayer == 'undefined') {
        window.setTimeout(function(){
            initUnlayerEditor(params, templateJson)
        }, 500);
        return;
    }    
    var initParams = {
        id: 'editor-container',
        projectId: jsVars.unlayerProjectId,
        displayMode: 'web',
        locale: 'en-US',
        translations: {
          'en-US': {
            "labels.merge_tags": "Tokens",
          }
        },
        appearance: {
            theme: 'light',
            panels: {
                tools: {
                  dock: 'right'
                }
            }
        },
        features: {
            textEditor: {
                spellChecker: true
            },
            imageEditor: true,     //Paid
            stockImages: true,     //Paid
        },
        customJS: [jsVars.FULL_URL+'/js/unlayer/custom_tools.js?'+jsVars.timestamp,'https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.8.2/tinymce.min.js'],
        customCSS: [".tox-statusbar {display: none !important;}"],
        tools: {
            'custom#text_over_image_tool' : {
                properties: {
                    position: {
                      editor: {
                        data: {
                          options: [
                            { label: 'fixed', value: 'fixed' },
                            { label: 'absolute', value: 'absolute' },
                            { label: 'static', value: 'static' },
                            { label: 'sticky', value: 'sticky' },
                            { label: 'relative', value: 'relative' },
                            { label: 'unset', value: 'unset' },
                            { label: 'inherit', value: 'inherit' }
                          ]
                        }
                      }
                    },
                    position2: {
                      editor: {
                        data: {
                          options: [
                            { label: 'fixed', value: 'fixed' },
                            { label: 'absolute', value: 'absolute' },
                            { label: 'static', value: 'static' },
                            { label: 'sticky', value: 'sticky' },
                            { label: 'relative', value: 'relative' },
                            { label: 'unset', value: 'unset' },
                            { label: 'inherit', value: 'inherit' }
                          ]
                        }
                      }
                    }
                }
            },
            'custom#tab-tool' : {
                properties: {
                    tabplacement: {
                      editor: {
                        data: {
                          options: [
                            { label: 'Horizontal', value: 'horizontal_tab' },
                            { label: 'Vertical', value: 'vertical_tab' }
                          ]
                        }
                      }
                    }
                }
            }
        }
    };
    if(typeof params != 'undefined' && params != '') {
        initParams.mergeTags = params;
    }
    unlayer.init(initParams);
    if((typeof templateJson != 'undefined') && (templateJson != '') && (typeof templateJson === 'object')) {
        unlayer.loadDesign(templateJson);
    } else if((typeof templateJson != 'undefined') && (templateJson != '')) {
        unlayer.loadDesign($.parseJSON(templateJson));
    }
    $('body').addClass('scroolStop');
    if(typeof unlayer != 'undefined') {
        unlayer.addEventListener('design:updated', function(data) {
            if($("#is_edit_template").length > 0) {
                $("#is_edit_template").val(1);
            }
        });
    }
}

$(document).on('click', '#savenext', function() {
   saveLayoutTemplate('savenext');
}); 
$(document).on('click', '#savedraft', function() {
   saveLayoutTemplate('savedraft');
});

function saveLayoutTemplate(type,background='') {
    try {
        unlayer.exportHtml(function(data) {
            $.parseJSON(JSON.stringify(data.design));
            var reqdata = data.chunks;
            if(reqdata.fonts.length > 0) {
                reqdata.fonts = JSON.stringify(reqdata.fonts);
            } else {
                delete reqdata.fonts;
            }
            reqdata.json = JSON.stringify(data.design);
            reqdata.type = type;
            reqdata.background = background;
            reqdata.page = $('input[name="page"]').val();
            $.ajax({
                url: jsVars.saveLayoutTemplate,
                type: 'post',
                dataType: 'json',
                data: reqdata,
                headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                async: false,
                success: function (json) {
                    if (typeof json.error != 'undefined' && json.error != "") {
                        if(json.error == 'invalid_csrf') {
                            window.location.reload(true);
                        } else {
                            alertPopup(json.error, 'error');
                        }
                    } else if (json.status == true) {
                        if(json.redirect != '') {
                            window.location.href = json.redirect;
                        } else {
                            if(background!='auto'){
                                alertPopup('Successfully Saved', 'success');
                            }
                        }
                    }
                }
            });
        });
    }
    catch (err) {
        alertPopup('Please recheck the changes done and try saving again.', 'error');
    }
}

$(document).on('click', 'input[name="predefinedRadio"]', function() {
    $('input[name="galleryRadio"]').prop('checked', false);
    updateGalleryTemplates('predefined', $(this).val());
});

$(document).on('click', 'input[name="galleryRadio"]', function() {
    $('input[name="predefinedRadio"]').prop('checked', false);
    updateGalleryTemplates('gallery', $(this).val());
});

var previewUrl = '';
$(document).on('click', 'button.pbtn', function() {
    $('a.desktop-preview, a.mobile-preview').removeClass('active');
    $('a.desktop-preview').addClass('active');
    previewUrl = $(this).data('url');
   $('#previewDiv').html('<div class="desktopview mediaView"><iframe src="'+$(this).data('url')+'" width="967px" height="480px" border="0" style="border:0;"></iframe></div>');
});

$(document).on('click', 'a.mobile-preview', function() {
    if(!$(this).hasClass('active'))    $(this).addClass('active');
    $('a.desktop-preview').removeClass('active');
    $('#previewDiv').html('<div class="mobileView mediaView"><iframe src="'+previewUrl+'" width="350px" height="480px" border="0"></iframe></div>');
});

$(document).on('click', 'a.desktop-preview', function() {
    if(!$(this).hasClass('active'))    $(this).addClass('active');
    $('a.mobile-preview').removeClass('active');
    $('#previewDiv').html('<div class="desktopview mediaView"><iframe src="'+previewUrl+'" width="967px" height="480px" border="0" style="border:0;"></iframe></div>');
});

$(document).on('click', 'a.blankPage', function() {
    $("#template-layout-id").val(0);
    $('div#template-container a.tmp-img, div#template-container div.tmp-img').removeClass('active');
    $(this).addClass('active');
});

$(document).on('click', 'button.sbtn', function() {
    $("#template-layout-id").val($(this).parents('div.template-details').data('tid'));
    $('div#template-container a.tmp-img, div#template-container div.tmp-img').removeClass('active');
    $(this).parents('div.tmp-img').addClass('active');
});

$(document).on('click', 'input[name="layout_template_type"]', function() {
    $('.loader-block').show();
    $('#TemplateChooseForm').submit();
});

function updateGalleryTemplates(type, id) {
    $("#template-layout-id").val('');
    $.ajax({
        url: jsVars.galleryTemplatesUrl,
        type: 'post',
        dataType: 'html',
        data: {
            id: id,
            type : type,
            college_id: $('input[name="college_id"]').val(),
            device_type: $('input[name="device_type"]').val(),
            template_type: $('input[name="template_type"]').val(),
            template_editor: $('input[name="template_editor"]').val(),
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        async: false,
        success: function (html) {
            if (html == 'invalid_csrf') {
                window.location.reload(true);
            } else if(html == 'invalid_request') {
                alertPopup('Something went wrong.', 'error');
            } else if(html == 'session_logout') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else {
                $('#template-container').html(html);
            }
        }
    });
}

function saveTemplateLayout(type) {
    var template_layout_id = $("#template-layout-id").val();
    if(template_layout_id === '') {
        alertPopup('Please select a template or blank to proceed.', 'error');
        return false;
    }
    $.ajax({
        url: jsVars.saveTemplateLayoutUrl,
        type: 'post',
        dataType: 'json',
        data: {layout_id:template_layout_id, type: type},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        async: false,
        success: function (json) {
            if (typeof json.error != 'undefined' && json.error != "") {
                if(json.error == 'invalid_csrf') {
                    window.location.reload(true);
                } else {
                    alertPopup(json.error, 'error');
                }
            } else if (json.status == true) {
                if(json.redirect != '') {
                    window.location.href = json.redirect;
                } else {
                    alertPopup('Successfully Saved', 'success');
                }
            }
        }
    });
}

function getUrl(data) {
    var template_layout_id = $("#template-layout-id").val();
    if(template_layout_id === '') {
        alertPopup('Please select a template or blank to proceed.', 'error');
        return false;
    }
    $.ajax({
        url: '/templates/getUrl',
        type: 'post',
        dataType: 'html',
        data: {post_data:data},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (html) {
            if(html == 'invalid_csrf') {
                window.location.reload(true);
            }else if(html == 'session_logout') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(html == 'invalid_request'){
                alertPopup('Something went wrong', 'error');
            } else {
                $('#ChangeFormArea h2.modal-title').text('URL(s)');
				$('#ChangeFormArea div#mainData').removeClass('row');
                $('#ChangeFormArea div#mainData').html('<div class="text-left mb-10">'+html+ '</div>');
                $('#ChangeFormArea').modal('show');
				$('#ChangeFormArea .btn-default').removeClass('btn-npf btn-npf-alt');
            }
        }
    });
}
function checkRevisionExist(params, page_type, editor) {
    if(typeof params == 'undefined' || params == '' || typeof page_type == 'undefined' || page_type == '' || typeof editor == 'undefined' || editor == '') {
        alertPopup('Something went wrong', 'error');
        return false;
    }
    $.ajax({
        url: '/templates/check-revision-exist',
        type: 'post',
        dataType: 'json',
        data: {params:params, page_type: page_type},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            if(json.error != '') {
                if(json.error == 'invalid_csrf') {
                    window.location.reload(true);
                } else if(json.error == 'session_logout') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else if(json.error == 'invalid_request'){
                    alertPopup('Something went wrong', 'error');
                } else {
                    alertPopup(json.error, 'error');
                }
            } else {
                if(json.status == true) {
                    if(page_type == 'landing' && editor == 'ck') {
                        location = jsVars.FULL_URL + '/templates/landing-page-template-step-three/'+params;
                    }
                } else {
                    if(page_type == 'landing' && editor == 'ck') {
                        alertPopup('Please edit and save atleast one block before proceed', 'error');
                    }
                }
            }
        }
    });
}

function resetTags() {
    $('#search_tag, #tag_id_val').val('');
    $("#show_tag_list").html('');
}
$('#marketingPagePath').bind('keypress', function(e) {
    if ((e.which < 97 || e.which > 122) && (e.which < 48 || e.which > 57) && e.which != 45 && e.which != 47) {
        e.preventDefault();
    }
});
$('#marketingPagePath').on("paste",function(e) {
    e.preventDefault();
});

$("#search").keydown(function (e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        LoadTemplateData('reset');
    }
});

$("#search_tag").keydown(function (e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        if(addTag == true) {
            addNewTag();
        }
    }
});

function landingPageSave(params, page_type, editor) {
    if(typeof params == 'undefined' || params == '' || typeof page_type == 'undefined' || page_type == '' || typeof editor == 'undefined' || editor == '') {
        alertPopup('Something went wrong', 'error');
        return false;
    }
    $.ajax({
        url: '/templates/check-revision-exist',
        type: 'post',
        dataType: 'json',
        data: {params:params, page_type: page_type},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            if(json.error != '') {
                if(json.error == 'invalid_csrf') {
                    window.location.reload(true);
                } else if(json.error == 'session_logout') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else if(json.error == 'invalid_request'){
                    alertPopup('Something went wrong', 'error');
                } else {
                    alertPopup(json.error, 'error');
                }
            } else {
                if(json.status == true) {
                    if(page_type == 'landing' && editor == 'ck') {
                        alertPopup('Data successfully updated.', 'success');
                    }
                } else {
                    if(page_type == 'landing' && editor == 'ck') {
                        alertPopup('Please edit and save atleast one block before proceed', 'error');
                    }
                }
            }
        }
    });
}


if (('#landingPageTemplateHistory').length > 0) {
   $(document).on('click', '#landingPageTemplateHistory', function (e) {
       e.preventDefault();
       var templateId = $(this).attr("rel");
       var type = $(this).data("type");
       var college_id = $(this).data("college");
       if (templateId > 0)
       {
           $.ajax({
               url: jsVars.landingPageRevisionList,
               data: {template_id: templateId, type : type, college_id : college_id},
               dataType: "html",
               async: false,
               type: "POST",
               headers: {
                   "X-CSRF-Token": jsVars._csrfToken
               },
               beforeSend: function () {
                   $('body div.loader-block').show();
                   $("#ConfirmPopupArea").modal('hide');
                   $('.dropdown-menu-tc').hide();
               },
               complete: function () {
                   $('body div.loader-block').hide();
               },
               success: function (html) {
                   if(typeof html !== 'undefined' && html === 'session') {
                       location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                   }
                   else if(typeof html !== 'undefined' && html === 'invalid_request'){
                       alertPopup('We got some error, please try again later.','error');
                   }
                   else if(typeof html !== 'undefined' && html === 'data_not_found'){
                       alertPopup('No Hisory found.','error');
                   }
                   else{
                       $('#StatusDetailPopupArea').addClass('right offCanvasModal in');
                       $('#StatusDetailPopupArea .modal-dialog').addClass('modal-xlg').css('left','auto');
                       $('#StatusDetailPopupArea .modal-header').addClass('offCanvasModalheader');
                       $('#StatusDetailPopupArea .modal-header .close').html('<span class="glyphicon glyphicon-remove"></span>');
                       $('#StatusDetailPopupArea .modal-body').removeClass('text-center');
                       $('#StatusDetailPopupArea h2#alertTitle').html('View Version History');
                       $('#StatusDetailPopupArea #StatusDetailPopupHTMLSection').html(html);
                       $("#StatusDetailPopupArea").modal();
                   }
                   $('[data-toggle="tooltip"]').tooltip();
               },
               error: function (response) {
                   alertPopup('Something went wrong','error');
               },
               failure: function (response) {
                   alertPopup('Failure','error');
               }
           });
       } else
       {
           alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
       }
   });
}

if (('#landingPagePreview').length > 0) {
    $(document).on('click', '#landingPagePreview', function (e) {
        e.preventDefault();
        $(".email-btn").hide();
        var templateId = $(this).attr("rel");
        var revisionId = $(this).attr("revision");
        var type = $(this).data("type");
        if (templateId > 0){
            var html = getLandingPageTemplateText(templateId,revisionId,type);
            window.open(html, "_blank");
        } else{
           alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
        }
   });
}

function getLandingPageTemplateText(templateId,revisionId='',type='') {
    var returnHTML = '';
    $.ajax({
        url: jsVars.landingPageTemplateTextGet,
        data: {template_id: templateId,revision_id: revisionId,type: type},
        dataType: "html",
        async: false,
        cache: false,
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('body div.loader-block').show();
            $("#ConfirmPopupArea").modal('hide');
        },
        complete: function () {
            $('body div.loader-block').hide();
        },

        success: function (html) {
            if (html == 'session_logout') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (html == 'invalid_request') {
                returnHTML = 'We got some error, please try again later.';
                alertPopup(returnHTML, 'error');
            }else {
                returnHTML = html;
            }
        },
        error: function (response) {
            alertPopup(response.responseText);
        },
        failure: function (response) {
            alertPopup(response.responseText);
        }
    });
    return returnHTML;
}
function showCustomCssJsPopup(template_id,page,college_id){   
    $.ajax({
        url: '/templates/custom_css_js',
        type: 'post',
        dataType: 'html',
        data: {'template_id':template_id, 'page':page, 'college_id':college_id},
        beforeSend: function () {
            $('div.listloader').show();
        },
        complete: function () {
            $('div.listloader').hide();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (html){
            $('#custom_css_js_popup').html(html); 
            $("#content").css("z-index", 'unset');
            $('#showCustomCssJsPopUp').trigger('click');
            $('body').addClass('vScrollRemove');
            $('.offCanvasModal').on('hide.bs.modal', function () {
                $('body').removeClass('vScrollRemove');
            })
            $('[data-toggle="tooltip"]').tooltip();
            $('#addcssjsModal .modal-dialog').addClass('modal-lg').css('left','auto');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });    
}

function saveCustomCssJs(){
    var url = '/templates/add-custom-css-js';
    var css = $("#upload_css").val();
    var js = $("#upload_js").val();
    var formData = new FormData($('#addCustomcssjsForm')[0]);
    $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: formData,
        processData: false,
        contentType: false,
        headers: {
           "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('div.listloader').show();
        },
        complete: function () {
            $('div.listloader').hide();
        },
        success: function (json) {
            if(json['status']=='success'){
                $('.offCanvasModal').modal('hide');
                alertPopup('Data has added sucessfully.', 'success');
            }else{
                alertPopup('Something went wrong.', 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}