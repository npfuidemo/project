$(document).ready(function() {
    
});

///voucher/get-forms
function OfflineLoadForms(college_id, selected_form_id,div_id,multiselect,hidedatafrm) {
    
    if(college_id.length <= 0) {
        return false;
    }
    $.ajax({
        url: '/voucher/get-forms',
        type: 'post',
        dataType: 'html',
        data: {
            "college_id": college_id,
            "default_val": selected_form_id,
            "multiselect":multiselect
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        async:false,
        success: function (data) {
            if(data=="session_logout"){
                window.location.reload(true);
            }
            $('#'+div_id).html(data);
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.chosen-select').trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function uploadLeadFile(){
    var college_id = $("#college_id").val();
    var primary_upload_type = $("#upload_type").val();
    var form_id = $("#form_id").val();
    if (college_id && primary_upload_type && form_id) {
        $("#csv_filter").submit();
    }else{
        if($("#college_id").val() =='') {
            $("#s_college_id_error").html("Please select college from list");
        }
        if($("#form_id").val() =='') {
            $("#form_id_error").html("Please select form");
        }
        if($("#upload_type").val() =='') {
            $("#primary_upload_type_error").html("Please select upload type");
        }
    }
}

var downloadLeadFile = function(url){
    window.open(url, "_self");
};

function downloadSampleLeadCsv(type){
    var college_id = $("#college_id").val();
    var upload_type = $("#upload_type").val();
    var payment_type = $("#payment_type").val();
    
    var form_id =0;
    if($('#form_id').length>0) {
        form_id = $('#form_id').val();
    }
    if (college_id && form_id>0) {
        $.ajax({
            url: jsVars.downloadSampleApplicationCsvLink,
            type: 'post',
            data: {collegeId: college_id,upload_type: upload_type,form_id:form_id,type:type, payment_type:payment_type,'cf':'bulk_upload'},
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
        }else{
            $("#s_college_id_error").html("");
        }
        if(($("#form_id").val() =='') || ($("#form_id").val() =='0')) {
            $("#form_id_error").html("Please select forms");
        }
    }
}

function downloadSampleDataCsv() {
    
}

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
        url: '/offline-uploads/validateLeadCsv',
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
                    if(prop=='invalid_header') {
                        $(".invalid_header").show();
                    } else if(prop=='missing_header') {
                        $(".missing_header").show();
                    }
                    $("#"+prop+"_error").html(json['errors'][prop]);
                }
            }
            if(!error_count){
                $("#csv_leads").submit();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

//getLeadUploadedUsers
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
                if(html=='error') {
                    $('#load_msg_div').show();
                    $('#tableViewContainer, #LoadMoreArea').hide();
                    return false;
                }else{
                    $('#load_msg_div').hide();
                    $('#tableViewContainer, #LoadMoreArea').show();
                }
                
                var countRecord = countResult(html);
                //console.log(countRecord);
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
                $('.offCanvasModal').modal('hide');
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

function importLeadErrorLog(type,lead_id,form_id){
    if(type){
        var college_id = $("#college_id").val();
        $.ajax({
            url: jsVars.importLeadErrorLogLink,
            type: 'post',
            data: {s_college_id: college_id,lead_id:lead_id,type:type,form_id:form_id},
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


function alertPopup(msg, type, location) {
    var selector_parent, selector_titleID, selector_msg, title_msg, btn;
    if (type == 'error') {
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

function getCounsellorsList(collegeId){
    
    var formId = $("#form_id").val();
    $.ajax({
        url: jsVars.getCounsellorsListLink,
        type: 'post',
        data: {'collegeId':collegeId, 'formId':formId, moduleName:'application'},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: true,
        beforeSend: function () { 
        },
        complete: function () {
            
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session') {
                window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if (responseObject.status == 1) {
                var counsellors  = '<option value="">Select Counsellor</option>';
                $.each(responseObject.data.counsellorList, function (index, item) {
                        counsellors += '<option value="'+index+'">'+item+'</option>';
                });
                $('#counsellor_id').html(counsellors);
                
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                $('.chosen-select').trigger('chosen:updated');
            } else {
                alertPopup(responseObject.message, 'error');
                return;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function downloadSampleCounsellorCsv(){
    var college_id = $("#college_id").val();
    
    if (college_id) {
        $.ajax({
            url: jsVars.downloadSampleCounsellorCsvLink,
            type: 'post',
            data: {collegeId: college_id},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () { 
                $('#uploadCounsellorsLoader').show();
            },
            complete: function () {
                $('#uploadCounsellorsLoader').hide();
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
            $("#s_college_id_error").html("Please select college");
        }
    }
}

function uploadCounsellorCSV(urlHash){
       
    var error = false;
    var college_id  = $("#college_id").val();
    var form_id     = $("#form_id").val();
    var csv_file    = $("#csv_file").val();
    
    $(".requiredError").text('');
    $("#csv_file_error").text('');
    if(college_id == ''){
	$("#s_college_id_error").text('Select College');
	error = true
    }
    
    if(form_id == ''){
	$("#form_id_error").text('Select Form');
	error = true
    }
    
    if(csv_file == ''){
	$("#csv_file_error").text('Select File');
	error = true
    }
    
    if(error === true){
        return false;
    }
    $("form#bulkCounsellorsUploadCsv").attr("action", "/offline-uploads/bulk-counsellor/"+urlHash);
    $('form#bulkCounsellorsUploadCsv').ajaxSubmit({
        beforeSubmit: function() {
        },
        uploadProgress: function (event, position, total, percentComplete){
        },
        success:function (data){
            data = JSON.parse(data); 
            
            if(data.error){
                alertPopup(data.error, 'error');
            }else{
                window.location.reload();
            }
        },
        resetForm: false
    });
}

$(document).on('change', '#csv_file', function(e) {
    var fileName = e.target.files[0].name;
    $("#filePath").text(fileName);
    $("#csv_file_error").text('');
});