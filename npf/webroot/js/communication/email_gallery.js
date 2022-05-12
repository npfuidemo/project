//code for Email Gallery
$(document).on('click', '#savedraft', function() {
   saveTemplate('draft');
});

$(document).on('click', 'input[name="allRadio"]', function() {
    $('input[name="galleryRadio"]').prop('checked', false);
    $('input[name="predefinedRadio"]').prop('checked', false);
    updateEmailGalleryTemplates('mytemplate', $(this).val());
});
$(document).on('click', 'input[name="predefinedRadio"]', function() {
    $('input[name="galleryRadio"]').prop('checked', false);
    $('input[name="allRadio"]').prop('checked', false);
    updateEmailGalleryTemplates('predefined', $(this).val());
});

$(document).on('click', 'input[name="galleryRadio"]', function() {
    $('input[name="predefinedRadio"]').prop('checked', false);
    $('input[name="allRadio"]').prop('checked', false);
    updateEmailGalleryTemplates('basic', $(this).val());
});

var emailPreviewUrl = '';
$(document).on('click', 'button.pbtn', function() {
    $('a.desktop-preview, a.mobile-preview').removeClass('active');
    $('a.desktop-preview').addClass('active');
    $('#previewpopUpButoonEditor').attr('data-tid' , $(this).attr('data-tid'));
    emailPreviewUrl = $(this).data('url');
   $('#previewDiv').html('<div class="desktopview mediaView"><iframe src="'+$(this).data('url')+'" width="967px" border="0" style="border:0;"></iframe></div>');
});

$(document).on('click', 'button.pbtn_new', function() {
    $('a.desktop-preview, a.mobile-preview').removeClass('active');
    $('a.desktop-preview').addClass('active');
    $('#previewpopUpButoonEditor').attr('data-tid' , $(this).attr('data-tid'));
    emailPreviewUrl = $(this).data('url');
   $('#previewDiv').html('<div class="desktopview mediaView"><iframe src="'+$(this).data('url')+'" width="967px" border="0" style="border:0;"></iframe></div>');
});

$(document).on('click', 'a.mobile-preview', function() {
    if(!$(this).hasClass('active'))    $(this).addClass('active');
    $('a.desktop-preview').removeClass('active');
    $('#previewDiv').html('<div class="mobileView mediaView"><iframe src="'+emailPreviewUrl+'" width="350px" border="0"></iframe></div>');
});

$(document).on('click', 'a.desktop-preview', function() {
    if(!$(this).hasClass('active'))    $(this).addClass('active');
    $('a.mobile-preview').removeClass('active');
    $('#previewDiv').html('<div class="desktopview mediaView"><iframe src="'+emailPreviewUrl+'" width="967px" border="0" style="border:0;"></iframe></div>');
});

$(document).on('click', 'a.blankPage', function() {
    $("#listloader").show();
    $("#template-layout-id").val(0);
    $('div#template-container a.tmp-img, div#template-container div.tmp-img').removeClass('active');
    $(this).addClass('active');
    saveEmailTemplateLayout('savenext');
});

$(document).on('click', 'button.sbtn', function() {
    $("#template-layout-id").val($(this).data('tid'));
    $('div#template-container a.tmp-img, div#template-container div.tmp-img').removeClass('active');
    $(this).parents('div.tmp-img').addClass('active');
    saveEmailTemplateLayout('savenext');
});

var addTag = false;
/*$("#search_tag").keyup(function () {
    addTag = false;
    $("#suggesstion-box").hide();
    var search_tag = $(this).val();
    if(search_tag.length > 20) return false;
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
            data: {search_common: search_tag, college_id: clg_id, type: 'email_page'},
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            async: false,
            success: function (json) {
                if (typeof json['session_error'] != 'undefined' && json['session_error'] == 'session_logout') {
                    window.location.reload(true);
                } else if (typeof json['error'] != 'undefined' && json['error'] != '') {
                    alertPopup(json['error'], 'error');

                } else if (typeof json['data']['tag'] != 'undefined' && json['data']['tag'] != '') {
                    if (typeof json['data']['count'] != 'undefined' && json['data']['count'] > 0) {
                        if(json['data']['matchtag'].indexOf(search_tag) < 0){
                            addTag = true;
                        }
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
});*/

$(document).on("keyup",".search_tag",function () {
    addTag = false;
    $(".suggesstion-box").hide();
    var search_tag = $(this).val();
    if(search_tag.length > 20) return false;
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
            data: {search_common: search_tag, college_id: clg_id, type: 'email_page'},
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            async: false,
            success: function (json) {
                if (typeof json['session_error'] != 'undefined' && json['session_error'] == 'session_logout') {
                    window.location.reload(true);
                } else if (typeof json['error'] != 'undefined' && json['error'] != '') {
                    alertPopup(json['error'], 'error');

                } else if (typeof json['data']['tag'] != 'undefined' && json['data']['tag'] != '') {
                    if (typeof json['data']['count'] != 'undefined' && json['data']['count'] == 0) {
                        $(".norelvent_search").show();
                        $(".show_tag_list").hide();
                    }
                    if (typeof json['data']['count'] != 'undefined' && json['data']['count'] > 0) {
                        if(json['data']['matchtag'].indexOf(search_tag) < 0){
                            addTag = true;
                        }
                        $(".suggesstion-box").show();
                        $(".suggesstion-box").html(json['data']['tag']);
                        $(".search-box").css("background", "#FFF");
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
function addNewTag(name) {
    if(name==''){return false;}
    addTag = true;
    var add_search_tag = name;
    var clg_id = 0;
    if($('select[name="college_id"]').length > 0) {
        clg_id = $('select[name="college_id"]').val();
    } else if($('input[name="college_id"]').length > 0) {
        clg_id = $('input[name="college_id"]').val();
    }
    if(add_search_tag.toLowerCase()=='untagged'){
        alertPopup("Can not create this tag.", 'error');
        return false;
    }
    $('select[name="college_id"]').val();
    $.ajax({
        url: '/offline/add-new-tag',
        type: 'post',
        dataType: 'json',
        data: {name: add_search_tag.toLowerCase(), college_id: clg_id, module: 'email_page'},
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
                $(".search_tag").val('');
            } else {
                alertPopup("error", 'error');
            }
        }
    });
}
/*function addNewTag() {
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
        data: {name: add_search_tag.toLowerCase(), college_id: clg_id, module: 'email_page'},
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
}*/

/*$("#search_tag").keydown(function (e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        if(addTag == true) {
            addNewTag();
        }
    }
});*/

$(document).on("keydown",".search_tag",function (e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        if(addTag == true) {
            addNewTag(this.value);
        }
    }
});

function resetTags() {
    $('#search_tag, #tag_id_val').val('');
    $("#show_tag_list").html('');
}

function updateEmailGalleryTemplates(type, id) {
    $("#template-layout-id").val('');
    if(type=='all'){
        $('input[name="galleryRadio"]').prop('checked', false);
        $('input[name="predefinedRadio"]').prop('checked', false);
        $('input[name="allRadio"]').prop('checked', false);
    }
    $.ajax({
        url: jsVars.emailGalleryTemplatesUrl,
        type: 'post',
        dataType: 'html',
        data: {
            id: id,
            type : type,
            template_id: $('input[name="templateId"]').val(),
            college_id: $('input[name="college_id"]').val(),
            template_type: $('input[name="template_type"]').val(),
            template_editor: $('input[name="template_editor"]').val(),
            template_applicable_for: $('input[name="template_applicable_for"]').val(),
            form_id: $('input[name="form_id"]').val(),
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        async: true,
        beforeSend: function () {
            $("#listloader").show();
        },
        complete: function () {
            $("#listloader").hide();
        },
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
            $('[data-toggle="tooltip"]').tooltip();
            $("#listloader").hide();
            //searchInsideTag();

            $(".templateemailthumb").hover(function(){
                $(".templateemailthumb").not(this).addClass("hover-effect")},function(){
                    $(".templateemailthumb").removeClass("hover-effect");
            });
        }
    });
}

function saveEmailTemplateLayout(type) {
    var template_layout_id = $("#template-layout-id").val();
    if(template_layout_id === '') {
        alertPopup('Please select a template or blank to proceed.', 'error');
        return false;
    }
    $.ajax({
        url: jsVars.saveEmailTemplateLayoutUrl,
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

function sendTestEmailTemplateCommunication() {
    $(".communicationTestMailMsg").html("").show();
    var error='';   
    var comm_test_email_id = $("#comm_test_email_id").val();
    var templateId = $("#template_id").val();
    var revisionId = $("#revision_id").val();
    if($.trim($('#comm_test_email_id').val())=='') {
        error+="Please enter test email id.<br />";
    } else if(ValidateEmailAddress($.trim($('#comm_test_email_id').val())) === false) {
        error+="Please enter a valid test email id.<br />";
    }
    $("#comm_test_email_id").val("");
    if(error!='') {
       $(".communicationTestMailMsg").html(error).delay(5000).fadeOut();
       $(".communicationTestMailMsg").removeClass('text-success');
       $(".communicationTestMailMsg").addClass('error');
       return false;
    }
    $.ajax({
       url: '/communications/send-test-email-and-sms',
       type: 'post',
       dataType: 'json',
       data: {'test_email_id':comm_test_email_id,'templateId':templateId,'revisionId':revisionId, 'preview':'testemail','ctype':'templateemaillist'},
       headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
       success: function (json) {          
            if(typeof json['session_logout'] != 'undefined') {
                if(typeof json['redirect'] != 'undefined'){
                   window.location.href = json['redirect'];
                }else{
                   window.location.href='/';
                }
            }else if(typeof json.error != 'undefined' && json.error!=''){
                $(".modal-content").animate({ scrollTop: 0}, 1000);
                $('#dispsuccess').html('');
                $('#disperror').show();
                $('#dispsuccess').hide();
                $('#disperror').html(json.error);
                $('.modalLoader, #listloader').hide();
                $('.modalLoader').css('position', 'absolute');
                return false;
            }
               
            $('div.loader-block').hide();
            $('#bulkloader').hide();
             
           
            if(typeof json['data'] != 'undefined' && json['data']!='') {
                $(".communicationTestMailMsg").html(json['data']).delay(5000).fadeOut();
                $(".communicationTestMailMsg").removeClass('error');
                $(".communicationTestMailMsg").addClass('text-success');
               //alertPopup(json['data'],'success');
            }

            //hide test email dropdown
            setTimeout(function() {
                $(".template-preview-dropdown").removeClass("open");
                $('.template-preview-dropdown button').attr('aria-expanded','false');
            }, 2500);
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}

function sendTestSMSTemplateCommunication() {
    $(".communicationTestMailMsg").html("").show();
    var error='';   
    var comm_test_sms_id = $("#comm_test_sms_id").val();
    var templateId = $("#template_id").val();
    var revisionId = $("#revision_id").val();
    if($.trim($('#comm_test_sms_id').val())=='') {
        error+="&bull;&nbsp;Please enter mobile number.";
    }
    $("#comm_test_sms_id").val("");
    if(error!='') {
       $(".communicationTestMailMsg").html(error).delay(5000).fadeOut();
       $(".communicationTestMailMsg").removeClass('text-success');
       $(".communicationTestMailMsg").addClass('error');
       return false;
    }
    $.ajax({
       url: '/communications/send-test-email-and-sms',
       type: 'post',
       dataType: 'json',
       data: {'test_sms_id':comm_test_sms_id,'templateId':templateId,'revisionId':revisionId, 'preview':'testsms','ctype':'templatesmslist'},
       headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
       success: function (json) {          
            if(typeof json['session_logout'] != 'undefined') {
                if(typeof json['redirect'] != 'undefined'){
                   window.location.href = json['redirect'];
                }else{
                   window.location.href='/';
                }
            }else if(typeof json.error != 'undefined' && json.error!=''){
                $(".modal-content").animate({ scrollTop: 0}, 1000);
                $('#dispsuccess').html('');
                $('#disperror').show();
                $('#dispsuccess').hide();
                $('#disperror').html(json.error);
                $('.modalLoader, #listloader').hide();
                $('.modalLoader').css('position', 'absolute');
                return false;
            }
               
            $('div.loader-block').hide();
            $('#bulkloader').hide();
            
            
           
            if(typeof json['data'] != 'undefined' && json['data']!='') {
                $(".communicationTestMailMsg").html(json['data']).delay(5000).fadeOut();
                $(".communicationTestMailMsg").removeClass('error');
                $(".communicationTestMailMsg").addClass('text-success'); 
               //alertPopup(json['data'],'success');
            }

            //hide test sms dropdown
            setTimeout(function() {
                $(".template-preview-dropdown").removeClass("open");
                $('.template-preview-dropdown button').attr('aria-expanded','false');
            }, 2500);
            
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}

$(document).on('click', '#codeyrown', function() {
    $.ajax({
        url: jsVars.htmlEditorUrl,
        type: 'post',
        dataType: 'json',
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
});
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
    return false;
    return true;
}

function sendTestWhatsappTemplateCommunication() {
    $(".communicationTestMailMsg").html("").show();
    var error='';   
    var comm_test_whatsapp_id = $("#comm_test_whatsapp_id").val();
    var templateId = $("#template_id").val();
    var revisionId = $("#revision_id").val();
    if($.trim($('#comm_test_whatsapp_id').val())=='') {
        error+="&bull;&nbsp;Please enter mobile number.";
    }
    //$("#comm_test_whatsapp_id").val("");
    if(error!='') {
       $(".communicationTestMailMsg").html(error).delay(5000).fadeOut();
       $(".communicationTestMailMsg").removeClass('text-success');
       $(".communicationTestMailMsg").addClass('error');
       return false;
    }
    $.ajax({
       url: '/communications/send-test-email-and-sms',
       type: 'post',
       dataType: 'json',
       data: {'test_whatsapp_id':comm_test_whatsapp_id,'templateId':templateId,'revisionId':revisionId, 'preview':'testwhatsapp','ctype':'templatewhatsapplist'},
       headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
       success: function (json) {   
            if(typeof json['session_logout'] != 'undefined') {
                if(typeof json['redirect'] != 'undefined'){
                   window.location.href = json['redirect'];
                }else{
                   window.location.href='/';
                }
            }else if(typeof json.error != 'undefined' && json.error!=''){
                $(".modal-content").animate({ scrollTop: 0}, 1000);
                $('#dispsuccess').html('');
                $('#disperror').show();
                $('#dispsuccess').hide();
                $(".communicationTestMailMsg").html(json.error).delay(5000).fadeOut();
                $('.modalLoader, #listloader').hide();
                $('.modalLoader').css('position', 'absolute');
                return false;
            }
               
            $('div.loader-block').hide();
            $('#bulkloader').hide();
             
           
            if(typeof json['data'] != 'undefined' && json['data']!='') {
               $(".communicationTestMailMsg").html(json['data']).delay(5000).fadeOut();
               $(".communicationTestMailMsg").removeClass('error');
               $(".communicationTestMailMsg").addClass('text-success');
            }

            //hide test whatsapp dropdown
            setTimeout(function() {
                $(".template-preview-dropdown").removeClass("open");
                $('.template-preview-dropdown button').attr('aria-expanded','false');
            }, 2500);
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}

$(document).on("click",".loadMoreTemplateinLayout",function(){
    $("#template-layout-id").val('');
    var type = $(this).attr('data-load-more');
    if(type=='all'){
        $('input[name="galleryRadio"]').prop('checked', false);
        $('input[name="predefinedRadio"]').prop('checked', false);
        $('input[name="allRadio"]').prop('checked', false);
    }
    $.ajax({
        url: jsVars.emailGalleryTemplatesUrl,
        type: 'post',
        dataType: 'html',
        data: {
            id: '0',
            type : type,
            template_id: $('input[name="templateId"]').val(),
            college_id: $('input[name="college_id"]').val(),
            template_type: $('input[name="template_type"]').val(),
            template_editor: $('input[name="template_editor"]').val(),
            template_applicable_for: $('input[name="template_applicable_for"]').val(),
            form_id: $('input[name="form_id"]').val(),
            show_more: 1,
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        async: true,
        beforeSend: function () {
            $("#listloader").show();
        },
        complete: function () {
            $("#listloader").hide();
        },
        success: function (html) {
            if (html == 'invalid_csrf') {
                window.location.reload(true);
            } else if(html == 'invalid_request') {
                alertPopup('Something went wrong.', 'error');
            } else if(html == 'session_logout') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else {
                $('#template-container').html(html);
                $("#loadMoreTemplateinLayout"+type).hide();
            }
            $(".cat_template").addClass('show');
            $("#listloader").hide();
            $('.templateArea').scrollTop($('.templateArea')[0].scrollHeight);
            $(".templateemailthumb").hover(function(){
                $(".templateemailthumb").not(this).addClass("hover-effect")},function(){
                    $(".templateemailthumb").removeClass("hover-effect");
            });
        }
    });
});

$(document).on("click",".mytemplateTag",function (e) {
    e.stopPropagation();
    $("#TagTemplateId").val($(this).attr("data-templateId"));
    var tagId = $(".tag_id_val"+$(this).attr("data-templateId")).val();
    var templateId = $(this).attr("data-templateId");
    $("#search_tag"+templateId).val("");
    $(".suggesstion-box").hide();
    showAllTagListWithName(templateId,tagId);
});
$(document).on("click",".basicTemplateTag",function (e) {
    e.stopPropagation();
    $("#TagTemplateId").val($(this).attr("data-templateId"));
    var tagId = $(".tag_id_val"+$(this).attr("data-templateId")).val();
    var templateId = $(this).attr("data-templateId");
    $("#search_tag"+templateId).val("");
    $(".suggesstion-box").hide();
    $(".enterTag").html('');
    showAllTagListWithName(templateId,tagId);
});

$(document).on("click",".predefinedTemplateTag",function (e) {
    e.stopPropagation();
    $("#TagTemplateId").val($(this).attr("data-templateId")); 
    var tagId = $(".tag_id_val"+$(this).attr("data-templateId")).val();
    var templateId = $(this).attr("data-templateId");
    $("#search_tag"+templateId).val("");
    $(".suggesstion-box").hide();
    showAllTagListWithName(templateId,tagId);
});

function showAllTagListWithName(templateId,tagId){
    var tagArray = tagId.split(",");
    $("#show_tag_list"+templateId).html("");
    $(".tagcontainer").hide();
    $("#"+templateId).addClass('open');
    $("#"+templateId).show();
    $.ajax({
        url: '/communications/showAllTagListWithName',
        type: 'post',
        dataType: 'html',
        data: { tagId: tagArray },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        async: false,
        success: function (html) {
            $(".norelvent_search").hide();
            $(".show_tag_list").show();
            var obj = jQuery.parseJSON(html);
            if (obj.error == 'invalid_csrf') {
                window.location.reload(true);
            } else if(obj.error == 'invalid_request') {
                alertPopup('Something went wrong.', 'error');
            } else {
                if(obj.data.length > 0){
                    $.each(obj.data, function(key,value) {
                    $("#show_tag_list"+templateId).prepend('<div class="tag label label-primary remove_tag" id=\'remove_tag_id' + value.id + '\'>'+ value.name + '<a href="javascript:void(0)" class="remove" onClick="removeTagFromChooseLayout(\'' + value.id + '\',\'' + templateId + '\');" id=\'remove_tag_' + value.id + '\'><i class="fa fa-trash-o" aria-hidden="true"></i></a></div>');
                    }); 
                    $("#allTagId"+templateId).val(tagId);
                }else{
                    $(".norelvent_search").show();
                    $(".show_tag_list").hide();
                }
            }

        }
    });
}

$(function() {
  $(document).on("click", function(e) {
    if ($(e.target).is(".falseInputTag,.search_tag,.toggletag,.createdtaglist,.createtagsbox, .createnewtag, .remove, .fa-trash-o") === false) {
      $(".tagcontainer").hide();
    }
  });
})

$(document).on('click','#predesignedPage',function(){
    $('#predesignedPage').prop('disabled',false);
    $(".loader-block").show();
})


    $(".basictagsearch").on('keyup', function(){
        var value = $(this).val().toLowerCase();
        $(".basictagList > .basicrbox").each(function () {
            if ($(this).text().toLowerCase().search(value) > -1) {
              $(this).show();
              $('.basicerror').hide();
            } else {
              $(this).hide();
              $('.basicerror').show();
            }
        });
    });

    $(".predefinedtagsearch").on('keyup', function(){
        var value = $(this).val().toLowerCase();
        $(".predefinedtagList > .predefinedrbox").each(function () {
            if ($(this).text().toLowerCase().search(value) > -1) {
              $(this).show();
              $('.predefinederror').hide();
            } else {
              $(this).hide();
              $('.predefinederror').show();
            }
        });
    });

    $(".mytagsearch").on('keyup', function(){
        var value = $(this).val().toLowerCase();
        $(".mytagList > .myrbox").each(function () {
            if ($(this).text().toLowerCase().search(value) > -1) {
              $(this).show();
              $('.myerror').hide();
            } else {
              $(this).hide();
              $('.myerror').show();
            }
        });
    });


    $(document).on('click','.createnewtag', function(){
        var templateId = $(this).attr('data-id');
        var tagVal = $("#search_tag"+templateId).val();
        addNewTag(tagVal);
        $(".norelvent_search").hide();
        $(".show_tag_list").show();
    });

//remove show tag form div
function removeTagFromChooseLayout(removetagid, templateId) {
    var all_tag_id = $("#allTagId"+templateId).val();
    var tagIns = all_tag_id.split(',');
    tagIns = jQuery.grep(tagIns, function (value) {
        return value != removetagid;
    });
    
    $("#remove_tag_id" + removetagid).remove();
    $("#allTagId"+templateId).val(tagIns.join(','));
    $(".tag_id_val"+templateId).val(tagIns.join(','));
    $.ajax({
        url: '/communications/removeTagFromLayoutPage',
        type: 'post',
        dataType: 'html',
        data: { tagId: tagIns.join(','), templateId: templateId },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        async: false,
        success: function (html) {
            $(".norelvent_search").hide();
            $(".show_tag_list").show();
            var obj = jQuery.parseJSON(html);
            if (obj.error == 'invalid_csrf') {
                window.location.reload(true);
            } else if(obj.error == 'invalid_request') {
                alertPopup('Something went wrong.', 'error');
            } else {
                $("#allTagId"+templateId).val(tagId);
            }
        }
    });
}

$(document).on("keyup",".search_tag",function () {
    var x = $(this).val();
    $('.enterTag').html(x);
    if(x.trim()==''){
        $(".createnewtag").hide();
    }else{
        $(".createnewtag").show();
    }
})


 

