$(document).ready(function(){
    if($("#h_college_id").length){
        $('#collegeId').val($("#h_college_id").val());
        $('#collegeId').trigger('change');
        $('#collegeId').trigger('chosen:updated');
    }
    setTimeout(function(){ $('.fadeInUp').hide();}, 5000);
    $('#formDailyReportBtn').click(function(){
        $('#formDailyReportBtn').addClass('hidden');
        $('#save_loader').removeClass('hidden');
        $.ajax({
            url: jsVars.FULL_URL +'/agents/saveDailyReport',
            type: 'post',
            data: $('form#formDailyReport').serializeArray(),
            dataType: 'json',
            headers: {
              "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
              $('#formDailyReportBtn').addClass('hidden');
              $('#save_loader').removeClass('hidden');
            },
            complete: function () {
              
            },
            success:function(json){
                $('.error').text('');
                if(json['status'] === 0){
                    if(json['message']!==''){
                        $('#toperror').text(json['message']);
                    }
                    
                    if(json['status'] === 0 && json['redirect'] !== undefined && json['redirect'] !==null){
                        window.location = json['redirect'];
                    }
                    count = 0;
                    $.each(json['error'], function (index, value) {
                        if(value!==''){
                            $('#'+index+'_validation').text(value);
                            if(count==0){
                                $('html, body').animate({
                                    scrollTop: $('#'+index+'_validation').offset().top-200
                                },500);
                            }
                            count++;
                        }
                    });
                    $('#save_loader').addClass('hidden');
                    $('#formDailyReportBtn').removeClass('hidden');
                }
                else if(json['status'] === 200 && json['redirect']!==''){
                    window.location = json['redirect'];
                } 
            }
        });      
    });
});

function Getuserlist(collegeId) {
    if(collegeId===''){
      return false;
    }   
    getLocaion(collegeId);
    $.ajax({
        url: jsVars.FULL_URL+'/agents/getUserList',
        type: 'post',
        dataType: 'json',
        data: {
            "college_id": collegeId,
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (response) {
            var responseObject = (response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data.childList === "object") {
                        var value = '<option selected="selected" value="">Select Accompanied Team Member</option>';
                        $.each(responseObject.data.childList, function (index, item) {
                            value += '<option value="' + index + '">' + item + '</option>';
                        });
                        $('#team_member').html(value);
                    }
                }
                $('#team_member').trigger('chosen:updated');
            } else {
                console.log(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function ajaxUploadFiles(){
    var collegeId = $('#collegeId').val();
    if(collegeId === ''){
        $('#formDailyReportBtn').attr("disabled", false);
        $('#receipt_validation').removeClass('text-success');
        $('#receipt_validation').addClass('error');
        $('#receipt_validation').text('Please select Institute from Institute list');
        return false;
    }
    
    let formData = new FormData();
    var filesinfo = document.getElementById('receipt').files;
    if(filesinfo === null){
        return false;
    }
    for(let i=0;i<filesinfo.length;i++){
        if(filesinfo[i].name === ''){
            return false;
        }
        if(parseInt(filesinfo[i].size/(1024*1024)) > 10){
            $('#receipt_validation').text('File size cant\'t be more than 10 mb');
            return false;
        }
        formData.append('files', filesinfo[i], filesinfo[i].name);
    }
    if(collegeId){
        formData.append('collegeId',collegeId);
    }
    formData.append('daily_report',1);
    
    $('#receipt_validation').removeClass('error');
    $('#receipt_validation').addClass('text-success');
    $('#receipt_validation').text('Uploading...');
    var uploadedfile = $('#receipt_file').val();
    if(uploadedfile!==''){
        $('#receipt_validation').removeClass('text-success');
        $('#receipt_validation').addClass('error');
        $('#receipt_validation').text('File already uploaded');
        return false;
    }
    $('#dow_file_receipt').hide();
    $('#dow_file_receipt a').attr('href','');
    $('#formDailyReportBtn').attr("disabled", true);
    $.ajax({
        url: jsVars.FULL_URL+'/agents/save-receipt',
        type: 'post',
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'json',
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if(data['status'] === 0 && data['redirect'] !== undefined && data['redirect'] !==null){
                window.location = data['redirect'];
            }
            if(data['success']){
            $('#receipt_validation').removeClass('error');
            $('#receipt_validation').addClass('text-success');
            $('#receipt_validation').text('');
            $('#receipt_file').val(data['file_path']);
            $('#dow_file_receipt').show();
            $('#dow_file_receipt a').attr('href',data['downloadlink']);
            $('#fname').val(data['filename']);
          }
          else{
            $('#dow_file_receipt').hide();
            $('#dow_file_receipt a').attr('href','');
            $('#receipt_validation').removeClass('text-success');
            $('#receipt_validation').addClass('error');
            $('#receipt_validation').text(data['error']);
            $('#receipt_validation').val('');
            $('#fname').val('');
          }
          $('#formDailyReportBtn').attr("disabled", false);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return;
}
function deleteFile(){
    $('#dow_file_receipt').hide();
    $('#dow_file_receipt a').attr('href','');
    $('#receipt_file').val('');
    $('#fname').val('');
    $('#receipt').val('');
    $('#receipt_validation').removeClass('error');
    $('#receipt_validation').addClass('text-success');
    $('#receipt_validation').text('Receipt successfully deleted');
    return false;
}

function getLocaion(collegeId) {
    if(collegeId==''){
      return false;
    }   
    $.ajax({
        url: jsVars.FULL_URL+'/agents/getLocation',
        type: 'post',
        dataType: 'json',
        data: {
            "collegeId": collegeId,
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (response) {
            var responseObject = (response);
            if (responseObject.status == 200) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data.childList === "object") {
                        var value = '<option selected="selected" value="">Select Location</option>';
                        $.each(responseObject.data.childList, function (index, item) {
                            value += '<option value="' + index + '">' + item + '</option>';
                        });
                        $('#location').html(value);
                    }
                }
                $('#location').trigger('chosen:updated');
            } else {
                console.log(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
