$(document).ready(function(){
    if($('.daterangepicker_report').length > 0 || $('.daterangepicker_report_center').length > 0){
        LoadReportDateRangepicker();
    }
    $("#college_id").change(function(){
        $("#s_college_id_error").html('');
    });
    $("#primary_upload_type").change(function(){
        $("#primary_upload_type_error").html('');
    });
    if($("#college_id").val()!=='' && $('#imported_by').length > 0){
        GetLeadUploadedUsers($("#college_id").val());        
    }
});


function uploadCsv(){
            
    var fd = new FormData();
    var file_data = $('input[type="file"]')[0].files; // for multiple files
    for(var i = 0;i<file_data.length;i++){
        fd.append("file_"+i, file_data[i]);
    }

    var other_data = $('#csv_leads').serializeArray();
    $.each(other_data,function(key,input){
        fd.append(input.name,input.value);
    });
    $(".requiredError").html('');
    $.ajax({
        url: '/leads/validateLeadCsv',
        type: 'post',
        data: fd,
        dataType: 'json',
        async : false,
        cache : false,
        contentType: false,                
        processData: false,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
//        	$('#contact-us-final div.loader-block').show();
        },
        complete: function () {
//		$('#contact-us-final div.loader-block').hide();
        },
        success: function (json) {
            var error_count = 0;
            for(var prop in json['errors']){
                if(json['errors'].hasOwnProperty(prop)){
                    error_count =1;
                    $("#"+prop+"_error").html(json['errors'][prop]);
                }
            }
            
            if(!error_count){
                //remove disable attr of counsellor name in case of add and update new leads
                $('#counsellor_id').removeAttr("disabled");
                $("#csv_leads").submit();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
        
        
function LoadLeadImportDetails(listingType){
    
    if(listingType === 'reset'){
        $("#page").val(1);
    }
    $.ajax({
        url: jsVars.loadLeadImportDetailsLink,
        type: 'post',
        data: $('#filterOfflineImportForm input,#filterOfflineImportForm select'),
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#importLeadLoader.loader-block').show();
        },
        complete: function () {
            $('#importLeadLoader.loader-block').hide();
        },
        success: function (html) {            
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
                $('#LoadMoreArea').hide();
            }else{
                var countRecord = countResult(html);
                console.log(countRecord);
                html    = html.replace("<head/>", "");
                if(listingType === 'reset'){
                    $('#tableViewContainer').html(html);
                }else{
                    $('#tableViewContainer').find("tbody").append(html);
                }
                if(countRecord < 10){
                    $('#load_more_button').hide();
                }else{
                    $('#load_more_button').show();
                }
                $("#page").val(parseInt($("#page").val())+1);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
};

function countResult(html){
    var len = (html.match(/listDataRow/g) || []).length;
    return len;
}


function exportDetailReportCsv(){
    var $form = $("#filterDiscountCouponForm");
    $form.attr("action",jsVars.exportDetailReportCsvLink);
    $form.attr("target",'modalIframe');
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    $('#myModal').modal('show');
    $form.submit();
    $form.attr("onsubmit",onsubmit_attr);
    $form.removeAttr("target");
}

var downloadDetailReportFile = function(url){
    window.open(url, "_self");
};



function communicationSelectAll(elem){
    $('div.loader-block').show();
//    console.log(elem.checked);
    if(elem.checked){
        //console.log(elem.checked);
        $('.select_users').each(function(){
            this.checked = true;
        });
    }else{
        $('.select_users').attr('checked',false);
    }
    
    $('div.loader-block').hide();
}

$(document).on('click', '.select_users',function(e) {
    
    if($('.select_users:checked').length<=1){
        $('#li_bulkCommunicationAction').hide();
    }else{
        $('#li_bulkCommunicationAction').show();
    }
    $('#select_all').attr('checked',false);
    
});


 
    function saveOfflineLead(){
        $("#map_label_error").html("");
        var email_flag      = "0";
        var course_flag     = "0";
        var mobile_flag     = "0";
        var field_flag      = [];
        var duplicate_flag  = [];
        var selectedArray   = [];

        var emailKey = $('#email_key').val().trim();
        var mobileKey = $('#mobile_key').val().trim();
        var courseId  = $("#course_id").val().trim();
        var isCourseEnabled  = $("#is_course_enabled").val().trim();
        var leadProcessedType  = $("#lead_processed_type").val().trim();
        
        if((courseId != '' && courseId != '0') || (isCourseEnabled == '0')){
            course_flag = "1";
        }
        
        var primary_upload_type = $('#primary_upload_type').val().trim();
        $("select[name^=mapped_column]").each(function(i, k){
            if($(this).val() == emailKey){
                email_flag = "1";
            }
            
            if($(this).val() == mobileKey){
                mobile_flag = "1";
            }
            
            if($(this).val() == 'course_id'){
                course_flag = "1";
            }
            
            if($.inArray($.trim($(this).val()),selectedArray) !== -1 ){
                duplicate_flag.push(i);
            }
            if($(this).val() === 'Select Label'){
                field_flag.push(i);
            }else if($.trim($(this).val()) != '' && $(this).val() !== 'do_not_import') {
                selectedArray.push($(this).val());
            }
            
            $("#map_label_error-"+i).html("");
           
        });
       
        $(".emailError, #map_label_error").html("");
        if(field_flag.length > 0){
            $.each(field_flag, function(i){
                $("#map_label_error-"+field_flag[i]).html("All CSV label must be mapped with NPF label.");
            });
            return false;
        }else if(email_flag == "0"  && primary_upload_type=='email'){
            if($('.emailError').length > 0){
                $(".emailError").html("Mapping of NPF Email label is mandatory.");
            }else{
                $("#map_label_error").html("Mapping of NPF Email label is mandatory.");
            }            
            return false;
        }else if(mobile_flag == "0" && primary_upload_type=='mobile'){
            if($('.emailError').length > 0){
                $(".emailError").html("Mapping of NPF Mobile Number label is mandatory.");
            }else{
                $("#map_label_error").html("Mapping of NPF Mobile Number label is mandatory.");
            }            
            return false;
        }else if(duplicate_flag.length > 0){
             $.each(duplicate_flag, function(i){
                $("#map_label_error-"+duplicate_flag[i]).html("Duplicate mapping of NPF label is not allowed.");
            });
            return false;
        }else if(course_flag == "0" && primary_upload_type=='email' && leadProcessedType == 'insert'){
            var courseLabel = $("select[name^=mapped_column]:first option[value='course_id']").text();
            if(courseLabel == '' || typeof courseLabel == 'undefined'){
                courseLabel = "Course";
            }
            $("#map_label_error").html("Mandatory to select "+courseLabel+"  field while uploading. If "+courseLabel+"  is not known, use value as “"+courseLabel+"  Not Available” under course column.");
            return false;
        }else if((primary_upload_type==='email'||primary_upload_type==='mobile') && jsVars.requireCampaignSource===true ){
            var source_tag_flag = false;
            var medium_tag_flag = false;
            var name_tag_flag   = false;
            $("select.campaign-publisher").each(function(){
                if($(this).val()==="source_tag"){
                    source_tag_flag = true;
                }else if($(this).val()==="medium_tag"){
                    medium_tag_flag = true;
                }else if($(this).val()==="campaign_tag"){
                    name_tag_flag   = true;
                }
            });
            if(source_tag_flag===false){
                $("#map_label_error").html("Mandatory to select Lead Source field while uploading.");
                return false;
            }else if(jsVars.requireCampaignMedium===true && medium_tag_flag===false){
                $("#map_label_error").html("Mandatory to select Lead Medium field while uploading.");
                return false;
            }else if(jsVars.requireCampaignName===true && name_tag_flag===false){
                $("#map_label_error").html("Mandatory to select Lead Campaign field while uploading.");
                return false;
            }
        }
        
        // All validation pass so Now submit the from  
            var $form = $("#uploadLeadForm");
            $form.attr("action",jsVars.saveOfflineleadLink);
//            $form.attr("target",'modalIframe');
//            var onsubmit_attr = $form.attr("onsubmit");
//            $form.removeAttr("onsubmit");
//            $('#myModal').modal('show');
            $form.submit();
//            $form.attr("onsubmit",onsubmit_attr);
//            $form.removeAttr("target");

    };
    
    
    var successUploadMsg = function(url){
        window.open(jsVars.FULL_URL+url, "_self");
    };


function GetLeadUploadedUsers(college_id){
     if (college_id) {
        $.ajax({
            url: jsVars.GetLeadUploadedUsersLink,
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
                    var html = "<option value=''>Imported By</option>";
                        html += json["userList"];
                    $('#imported_by').html(html);
                    $('#imported_by').trigger('chosen:updated');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
        
    } else {
        $('#imported_by').html('<option value="">Imported By</option>');
        $('#imported_by').trigger('chosen:updated');
    }
}


function importLeadErrorLog(type,lead_id){
    if(type){
        var college_id = $("#college_id").val();
        $.ajax({
            url: jsVars.importLeadErrorLogLink,
            type: 'post',
            data: {s_college_id: college_id,lead_id:lead_id,type:type},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () { 
                $('#importLeadLoader.loader-block').show();
            },
            complete: function () {
                $('#importLeadLoader.loader-block').hide();
            },
            success: function (json)
            {
                if (json['redirect'])
                    location = json['redirect'];
                else if (json['error'])
                    alertPopup(json['error'], 'error');
                else if (json['status'] == 200) {
                    var downloadUrl = json['downloadUrl'];
                    if(downloadUrl!=='' && downloadUrl !==null){
                       downloadLeadFile(downloadUrl);
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
}

var downloadLeadFile = function(url){
    window.open(url, "_self");
};


function downloadStateCityListCsv(){
    var college_id = $("#college_id").val();
    if (college_id) {
        $.ajax({
            url: jsVars.downloadStateCityListLink,
            type: 'post',
            data: {CollegeId: college_id,'cf':'bulk_upload'},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () { 
                $('#uploadLeadLoader.loader-block').show();
            },
            complete: function () {
                $('#uploadLeadLoader.loader-block').hide();
            },
            success: function (json)
            {
                if (json['redirect'])
                    location = json['redirect'];
                else if (json['error'])
                    alertPopup(json['error'], 'error');
                else if (json['status'] == 200) {
                    var downloadUrl = json['downloadUrl'];
                    if(downloadUrl!=='' && downloadUrl !==null){
                       downloadLeadFile(downloadUrl);
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
        
    } else {
        $("#s_college_id_error").html("Please select college from list");
            $('html, body').animate({ scrollTop: 0 }, 0);
    }
}


function downloadSampleLeadCsv(){
    var college_id = $("#college_id").val();
    var primary_upload_type = $("#primary_upload_type").val();
    
    var course_id ='';
    if($('#course_id').length>0) {
        course_id = $('#course_id').val();
    }
    var university_id =0;
    if($('#university_id').length>0) {
        university_id = $('#university_id').val();
    }
    if (college_id) {
        $.ajax({
            url: jsVars.downloadSampleLeadCsvLink,
            type: 'post',
            data: {CollegeId: college_id,primary_upload_type: primary_upload_type,course_id:course_id,university_id:university_id},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () { 
                $('#uploadLeadLoader.loader-block').show();
            },
            complete: function () {
                $('#uploadLeadLoader.loader-block').hide();
            },
            success: function (json)
            {
                if (json['redirect'])
                    location = json['redirect'];
                else if (json['error'])
                    alertPopup(json['error'], 'error');
                else if (json['status'] == 200) {
                    var downloadUrl = json['downloadUrl'];
                    if(downloadUrl!=='' && downloadUrl !==null){
                       downloadLeadFile(downloadUrl);
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
        
    } else {
        if($("#college_id").val() =='') {
            $("#s_college_id_error").html("Please select college from list");
        }
        if($("#primary_upload_type").val() =='') {
            $("#primary_upload_type_error").html("Please select upload with primary");
        }
    }
}


function uploadLeadFile(){
    
    var college_id = $("#college_id").val();
    var primary_upload_type = $("#primary_upload_type").val();
    if (college_id && primary_upload_type) {
        $("#csv_filter").submit();
    }else{
        if($("#college_id").val() =='') {
            $("#s_college_id_error").html("Please select college from list");
        }
        if($("#primary_upload_type").val() =='') {
            $("#primary_upload_type_error").html("Please select upload with primary");
        }
    }
}

    
function LoadEnquiryFormDetails(listingType){
    $("#showDownloadEnquiryBtn").hide();
    if(listingType === 'reset'){
        $("#page").val(1);
    }
    $.ajax({
        url: jsVars.loadEnquiryFormDetailsLink,
        type: 'post',
        data: $('#filterEnquiryForm input,#filterEnquiryForm select'),
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#importLeadLoader.loader-block').show();
        },
        complete: function () {
            $('#importLeadLoader.loader-block').hide();
        },
        success: function (html) {            
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
                $('#LoadMoreArea').hide();
            }else{
                var countRecord = countResult(html);
                html    = html.replace("<head/>", "");
                if(html.indexOf("Data not available with selected filters") < 0){
                    $("#showDownloadEnquiryBtn").show();
                }
                if(listingType === 'reset'){
                    $('#tableViewContainer').html(html);
                }else{
                    $('#tableViewContainer').find("tbody").append(html);
                }
                if(countRecord < 10){
                    $('#load_more_button').hide();
                }else{
                    $('#load_more_button').show();
                }
                $("#page").val(parseInt($("#page").val())+1);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
};


function exportEnquiryFormCsv(){
    var $form = $("#filterEnquiryForm");
    $form.attr("action",jsVars.exportEnquiryFormCsvLink);
    $form.attr("target",'modalIframe');
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    $('#myModal').modal('show');
    $form.submit();
    $form.attr("onsubmit",onsubmit_attr);
    $form.removeAttr("target");
};

var downloadEnquiryFormFile = function(url){
    window.open(url, "_self");
};

$(document).on('change', '#primary_upload_type',function(e) {
    
    if($(this).val()=='email' || $(this).val() =='') {
        $('.emailInfoJS').show();
        $('.mobileInfoJS').hide();
    } else if($(this).val() =='mobile') {
        $('.emailInfoJS').hide();
        $('.mobileInfoJS').show();
    }
    
});


function changeCounsellorStatus(val){
    if(val === 'insert'){
        $('#counsellor_id').removeAttr("disabled");
        $('#counsellor_id').val('');
        $('#counsellor_id').trigger('chosen:updated');
    }else{
        $('#counsellor_id').attr("disabled", "disabled");
        $('#counsellor_id').val('');
        $('#counsellor_id').trigger('chosen:updated');
    }
}

function changeLMtoAMAssignStatus(val){
    $('#lead_2_app_div').hide();
    $('#lead_to_application').val('');
    $('#lead_to_application').trigger('chosen:updated');
    if(val === 'append'){
        $('#lead_2_app_div').show();
    }
}

   //Funcion: communication Get status detail
function showOfflineListStatusDetail(errorMsg)
{
   
    $('#StatusDetailPopupArea .modal-body').removeClass('text-center');
    $('#StatusDetailPopupHTMLSection').html(errorMsg);
    $('#StatusDetailPopupLink').trigger('click');
}


function GetChildByMachineKey(key,ContainerId){
    if(typeof ContainerId !== "undefined" && $("#"+ContainerId).length){
        
        var labelName = 'Select '+jsVars.speacilizationLabel+' Name';
        if(typeof $("#"+ContainerId).data('label') !== 'undefined') {
            labelName = $("#"+ContainerId).data('label');
        }
        //var html = '<option value="">Select '+jsVars.speacilizationLabel+' Name</option>';
        var html = '<option value="">'+labelName+'</option>';
        $("#"+ContainerId).html(html);
        $("#"+ContainerId).chosen();
        $("#"+ContainerId).trigger('chosen:updated');
        
        //Blank All dropdown Value of Dependent Field
        var getLastValue = 0;
        
        if(typeof jsVars.dependentDropdownFieldList !== 'undefined') {
            $(jsVars.dependentDropdownFieldList).each(function(key,fieldId){
                //if getLastValue > 0 then return from here
                if(getLastValue >0) {
                    return false;
                }
                var isFieldFound = 0;
                $.each(fieldId, function(childKey,childFieldId){
                    
                    //if field match then increase the counter and store the increament value into getLastValue variable
                    if(childFieldId == ContainerId) {
                        isFieldFound++;
                        getLastValue = isFieldFound;
                    }                    
                    if(isFieldFound > 0) {
                        
                        if($('#'+childFieldId).length) {
                            var defaultOption ='<option value="">'+$("#"+childFieldId).data('label')+'</option>';
                            $("#"+childFieldId).html(defaultOption);
                            $("#"+childFieldId).chosen();
                            $("#"+childFieldId).trigger('chosen:updated');
                        }
                    }
                });
            });
        }
        
        
        if( typeof key !== "undefined" && key !== '')
        {
            var postData    = {key:key};
            if($("#college_id").length){
                postData['college_id']  = $("#college_id").val();
            }
           
            $.ajax({
                url: jsVars.GetTaxonomyLink,
                type: 'post',
                dataType: 'json',
                data: postData,
                headers: {
                    "X-CSRF-Token": jsVars._csrfToken
                },
                beforeSend: function() {
                    $('#register-now div.loader-block,#register-page div.loader-block').show();
                },
                complete: function() {
                    $('#register-now div.loader-block,#register-page div.loader-block').hide();
                },
                success: function (json) {
                    if(json['redirect']){
                        location = json['redirect'];
                    }
                    if(json['error']){
                        alertPopup(json['error'],'error');
                    }
                    else if(json['success']){
                        var html='<option value="">'+labelName+'</option>';
                        if(json['CategoryOptions']){
                            html += json['CategoryOptions'];
                        } else {
                            for(var key in json['list'])
                            {
                                if(key != ''){
                                    html += '<option value="'+key+'">'+json['list'][key]+'</option>';
                                }
                            }
                        }
                        $("#"+ContainerId).html(html);
                        $("#"+ContainerId).chosen();
                        $("#"+ContainerId).trigger('chosen:updated');
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        }
    }
}