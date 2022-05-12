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
        GetPanelName($("#college_id").val());
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
        url: '/settings/validateLeadCsv',
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



 
    function saveOfflineLead(){
        $("#map_label_error").html("");
        
        var field_flag      = [];
        var duplicate_flag  = [];
        var selectedArray   = [];
        var checkMapped   = [];
        var panel_id = $('#panel_id').val().trim();
        var counsellor_id = $('#counsellor_id').val().trim();
        $("select[name^=mapped_column]").each(function(i, k){
           
            if($.inArray($.trim($(this).val()),selectedArray) !== -1 ){
                duplicate_flag.push(i);
            }
            if($(this).val() === 'Select Label'){
                field_flag.push(i);
            }else if($.trim($(this).val()) != '' && $(this).val() !== 'do_not_import') {
                selectedArray.push($(this).val());
            }
            checkMapped.push($(this).val());
            $("#map_label_error-"+i).html("");
           
        });
       
        $(".emailError, #map_label_error").html("");
        if(field_flag.length > 0){
            $.each(field_flag, function(i){
                $("#map_label_error-"+field_flag[i]).html("All CSV label must be mapped with NPF label.");
            });
            return false;
        }else if(duplicate_flag.length > 0){
             $.each(duplicate_flag, function(i){
                $("#map_label_error-"+duplicate_flag[i]).html("Duplicate mapping of NPF label is not allowed.");
            });
            return false;
        }else if(checkMapped.length > 0){
            if($.inArray('application_no',checkMapped) == -1 ){
               $("#map_label_error").html("Mandatory to map Application Number");
               return false;
            }
            if($.inArray('counsellor_name',checkMapped) == -1 && counsellor_id==''){
               $("#map_label_error").html("Mandatory to map Evaluator Name");
               return false;
            }
        }else{
            $("#map_label_error").html("Mandatory to map Application Number and Evaluator Name");
            return false;
        }
        
        var $form = $("#uploadLeadForm");
        $form.attr("action",jsVars.saveOfflineleadLink);
        $form.submit();
    };
    
    
    var successUploadMsg = function(url){
        window.open(jsVars.FULL_URL+url, "_self");
    };

function GetPanelName(college_id){
    
     if (college_id) {
        $.ajax({
            url: '/settings/getPanelData',
            type: 'post',
            data: {college_id: college_id},
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
                else if (json['status'] == 1) {
                    
                    $('#panel_name').html(json['data']);
                    $('#panel_name').trigger('chosen:updated');
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


function downloadSampleLeadCsv(){
    var college_id = $("#college_id").val();
    var panel_id = $("#panel_id").val();
    
    if (college_id) {
        $.ajax({
            url: jsVars.downloadSampleLeadCsvLink,
            type: 'post',
            data: {CollegeId: college_id,panel_id: panel_id},
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

   //Funcion: communication Get status detail
function showOfflineListStatusDetail(errorMsg)
{
   
    $('#StatusDetailPopupArea .modal-body').removeClass('text-center');
    $('#StatusDetailPopupHTMLSection').html(errorMsg);
    $('#StatusDetailPopupLink').trigger('click');
}

