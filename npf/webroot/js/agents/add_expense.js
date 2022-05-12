$(document).ready(function(){
    $('#expense_date').datepicker({
        format: 'dd/mm/yyyy',
        startDate: new Date(new Date().setDate(new Date().getDate() - 3)),
        endDate: new Date(),
    });
    if($("#h_college_id").length){
        $('#collegeId').val($("#h_college_id").val());
        $('#collegeId').trigger('change');
        $('#collegeId').trigger('chosen:updated');
    }
    setTimeout(function(){ $('.fadeInUp').hide();}, 5000);
    $('#formExpenseBtn').click(function(){
        $('#receipt_validation').removeClass('text-success');
        $('#receipt_validation').addClass('error');
        $.ajax({
            url: jsVars.FULL_URL +'/agents/saveExpense',
            type: 'post',
            data: $('form#formExpense').serializeArray(),
            dataType: 'json',
            headers: {
              "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
              $('#formExpenseBtn').addClass('hidden');
              $('#save_loader').removeClass('hidden');
            },
            complete: function () {
              $('#save_loader').addClass('hidden');
              $('#formExpenseBtn').removeClass('hidden');
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
                }
                else if(json['status'] === 200 && json['redirect']!==''){
                    window.location = json['redirect'];
                } 
            }
        });      
    });
});

function checkUserExists(val){
    if(val===''){
        return false;
    }
    $('#user_id').val('');
    $('#centre_name_validation').text('');
    $.ajax({
        url: jsVars.FULL_URL+'/agents/checkUserExists',
        type: 'post',
        dataType: 'json',
        data: {
            "centre":val
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (response) {
            if(response.status === 0){
                $('#message').text(response.message);
                if(response.redirect !== undefined){
                    window.location = response.redirect;
                }
                $('#centre_name_validation').text('Centre user details doesn\'t exist.');
                $('#formExpenseBtn').addClass('disabled');
            }
            if (response.status === 200) {
                if (typeof response.user === "object" && response.user.id !== '') {
                    $('#user_id').val(response.user.id);
                    $('#formExpenseBtn').removeClass('disabled');
                }
                else{
                    $('#centre_name_validation').text('Centre user details doesn\'t exist.');
                    $('#formExpenseBtn').addClass('disabled');
                }
            }
        },
        error: function (xhr, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });   
}

function getRegisteredCentre(collegeId=0) {  
    if(collegeId <= 0){
        return false;
    }
    $.ajax({
        url: jsVars.FULL_URL+'/agents/getRegisteredCentre',
        type: 'post',
        dataType: 'json',
        data: {
            "collegeId":collegeId
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (response) {
            if(response.status === 0){
                $('#message').text(response.message);
                if(response.redirect !== undefined && response.redirect!==null){
                    window.location =  response.redirect;
                }
            }
            if (response.status === 200) {
                if (typeof response.data === "object") {
                    var value = '<option selected="selected" value="">Select Centre Name</option>';
                    $.each(response.data, function (index, item) {
                        value += '<option value="' + index + '">' + item + '</option>';
                    });
                    $('#centre_name').html(value);
                }
                $('#centre_name').trigger('chosen:updated');
                $('#centre_name_validation').text('');
                
            } else {
                $('.chosen-select').trigger('chosen:updated');
                $('#centre_name_validation').text(response.message);
            }
        },
        error: function (xhr, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
  ///////requestType//////
function requestType(val){  
    if(val==='lpunest_fee_collected'){
        $('#textwithtype').text('Upload Application Receiving Form');
        $('.receipt').hide();
        $('#receipt_no').val('');
        //$('.receipt').text('Receipt No.');
        $('.remark').html('Remarks <span class="requiredStar">*</span>');
    }
    else if(val==='deposit_lpunest_fee'){
        $('#textwithtype').text('Upload Receipt');
        $('.receipt').show();
        //$('.receipt').html('Receipt No. <span class="requiredStar receipt">*</span>');
        $('.remark').text('Remarks');
    }
    else if(val==='remuneration_paid'){
        $('#textwithtype').text('Upload Remuneration Receiving Form');
        $('.receipt').hide();
        $('#receipt_no').val('');
        //$('.receipt').text('Receipt No.');
        $('.remark').text('Remarks');
    }
    else{
        $('#textwithtype').text('');
        $('.receipt').hide();
        $('#receipt_no').val('');
        //$('.receipt').text('Receipt No.');
        $('.remark').text('Remarks');
    }
}

function ajaxUploadFiles(){
    var collegeId = $('#collegeId').val();
    if(collegeId === ''){
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
    $.ajax({
        url: jsVars.FULL_URL+'/agents/save-receipt',
        type: 'post',
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'json',
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
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

function onlyAlphabets(e, t)
{
    try
    {
        if (window.event) {
            var charCode = window.event.keyCode;
        }
        else if (e) {
            var charCode = e.which;
        }
        else {
            return true;
        }

        if ((charCode === 8) || (charCode === 32) || (charCode === 46))
        {
            return true;                    //allow space/backspace/delete key
        }
        else if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    catch (err) {
        alertPopup(err.Description, 'error');
    }
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function validateEmail(x) {
    var atpos = x.indexOf("@");
    var dotpos = x.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
        return false;
    }
    return true;
}

