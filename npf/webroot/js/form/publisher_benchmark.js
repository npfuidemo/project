$(document).on('click', '#upload_csv', function(e) {
    var fileName = $("#benchmark_file").val();
    if(fileName == ''){
	$("#csv_file_error").text('select file');
	return;
    }else{
	$("#ajaxUploadPublisherBenchmarkForm").submit();
    }
});

$(document).on('change', '#benchmark_file', function(e) {
    var fileName = e.target.files[0].name;
    $("#filePath").text(fileName);
    $("#csv_file_error").text('');
});

function checkBenchmarkingData(Form)
{  
    var formData = $('#publisherBenchmarkingData').serializeArray();
    $("#data_already_exists").html("");
    $.ajax({
        url: '/form/ajaxUploadPublisherBenchmark/'+jsVars.form_pass_id,        
        data: formData,
        dataType: "html",
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        }, 
        beforeSend: function () {
            $('body div.loader-block').show();
        },
        complete: function () {
            $('body div.loader-block').hide();
        },
        success: function (data) {
            if(data)
            {
               // console.log(data);
                $("#alreadyData").html(data);
            }
            else{
                $("#uploadFile").show();
            }
        },
        error: function (response) {
            //alertPopup(response.responseText);
        },
        failure: function (response) {
           // alertPopup(response.responseText);
        }
    });
} 

function downloadSampleCsv(type){
    var form_id	    = $("#form_id").val();
    if (form_id>0) {
        $.ajax({
            url: jsVars.downloadSamplePublisherCsvLink,
            type: 'post',
            data: {form_id: form_id, 'onlyCrmCollege' : jsVars.onlyCrmCollege, 'appSubmitted' : jsVars.appSubmitted, 'appPaymentApproved' : jsVars.appPaymentApproved},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () { 
            },
            complete: function () {
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
        if($("#form_id").val() =='') {
            $("#form_id_error").html("Please select forms");
        }
    }
}

var downloadLeadFile = function(url){
    window.open(url, "_self");
};

function getPublisherLogList(type) {
    $(".lead_error").html('');
    if (type == 'reset') {
        PublisherLogPage  = 1;
        $('#publisher_log_container').html("");
        $("#publisher_log_container").parent().hide();
    }
    
    $('#load_more_button').hide();
    $("#if_record_exists").hide();
    if($("#college_id").val()==''){
        $("#load_msg_div").show();
        hideLoader();
        return;
    }
    var data = $('#FilterPublisherLogs').serializeArray();
    data.push({name: "college_id", value: $("#college_id").val()});
    data.push({name: "form_id", value: $("#form_id").val()});
    data.push({name: "page", value: PublisherLogPage});
    $.ajax({
        url: jsVars.FULL_URL+ '/form/publisher-log-list',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function () {
           $('#parent').css('min-height', '50px');
           showLoader();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (response) {
			PublisherLogPage+=1;
			var responseObject = $.parseJSON(response); 
			if (responseObject.message === 'session'){
                            window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
			}
                        if(responseObject.status==1){
                            data = responseObject.data.html.replace("<head/>", '');
                            $('#publisher_log_container').parent().removeClass('hide');
                            $('#publisher_log_container').append(data);
                            $("#totalRecords").html('Total <strong>'+responseObject.data.totalRecords+'</strong>&nbsp;Records');
                            $("#if_record_exists").show();
                            $("#load_msg_div").hide();
                            $("#publisher_log_container").parent().show();
                        }else if(typeof responseObject.message!=="undefined" && responseObject.message!==''){
                            $("#load_msg").html(responseObject.message);
                            $("#load_msg_div").show();
                            //alertPopup(responseObject.message,"error");
                        }
            
			$('.offCanvasModal').modal('hide');
            dropdownMenuPlacement();
            
        },
        
        error: function (xhr, ajaxOptions, thrownError) {
            //window.location.reload(true);
        },
        complete: function () {
            hideLoader();
            
        }
    });

    return false;
}


function getAllFormList(cid, default_val, multiselect) {
    if(typeof default_val=='undefined'){
        default_val = '';
    }
    if(typeof multiselect=='undefined'){
        multiselect = '';
    }
    
    if(cid == '' || cid == '0' ){
        $("#formListDiv").html("<select name='form_id' id='form_id'  class='chosen-select' ><option value='0'>Form</option></select>");
	$('.chosen-select').chosen();
        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        return false;
    }
    
    $.ajax({
        url: jsVars.FULL_URL+'/voucher/get-forms',
        type: 'post',
        data: {
            "college_id": cid,
            "default_val": default_val,
            "multiselect":multiselect
        },
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
           //currentObj.text('Wait..');
        },
        success: function (json) {
            if (json == 'session_logout') {
                window.location.reload(true);
            } else {
                $("#formListDiv").html(json);
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            }
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            ;
        }
    });
}

/*** Show & Hide Loader ***/
function showLoader() {
    $("#listloader").show();
}
function hideLoader() {
    $("#listloader").hide();
}

function resetform(){  
    $("#FilterApplicationForms")[0].reset();
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    $('.chosen-select').trigger('chosen:updated');
    LoadMoreFeeWithdrawConfig('reset');
}

function initiateUploadErrorLog(requestId){
    $.ajax({
        url: jsVars.FULL_URL+ '/form/publisher-log-details',
        type: 'post',
        dataType: 'html',
        data: {mongoId:requestId},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session') {
                window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if (responseObject.status == 1) {
                if( typeof responseObject.redirectURL!=="undefined" ){
                    location = responseObject.redirectURL;
                }else if( typeof responseObject.data.error !=="undefined" ){
                    var html = '<ul>';
                    $.each(responseObject.data.error, function (index, item) {
                       html += '<li>'+item+'</li>';
                    });
                    html += '</ul>';
                    $('#uploadErrorPopup .modal-body').html(html);
                    $('#uploadErrorPopup').modal('show'); 
                }else{
                    $('#uploadErrorPopup .modal-body').html('<div id="errorText" class="alert alert-warning">No Error Found</div>');
                    $('#uploadErrorPopup').modal('show'); 
                }
            } else {
                $('#uploadErrorPopup .modal-body').html('<div id="errorText" class="alert alert-warning">'+responseObject.message+'</div>');
                $('#uploadErrorPopup').modal('show'); 
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}