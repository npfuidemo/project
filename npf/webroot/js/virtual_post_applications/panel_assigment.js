$(document).ready(function () {
    $('.group_form_fields_option').SumoSelect({placeholder: 'Listing Fields', search: true, searchText: 'Listing Fields', selectAll: false, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false});
    $(this).SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true});
    
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
    
    var downloadLeadFile = function(url){
    window.open(url, "_self");
};


function downloadSampleLeadCsv(){   
    var method = $('#sampleDownloadCSV').val();    
    var college_id = $("#college_id").val();
    var panel_id = $("#panel_id").val();    
    var counsellor_id = $("#counsellor_id").val(); 
    if (college_id) {
        $.ajax({
            url: jsVars.downloadSampleLeadCsvLink,
            type: 'post',
            data: {CollegeId: college_id,panel_id: panel_id,method:method,counsellor_id:counsellor_id},
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