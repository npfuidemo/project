function initiateRa(userIdHashed, module){
    if(module == 'assigned_ra'){
        var ajaxUrl = '/resident-advisors/initiate-assign-to-ra';
        $('#lead-ra-assignment span.error').html('');
        var modaltitle = 'Assigned RA';
    }else if(module == 'installment'){
        var ajaxUrl = '/resident-advisors/initiate-ra-installment';
        $('#initiate-ra-installment span.error').html('');
        var modaltitle = 'Add Installment';
    }
    $('#assignRaModal #raMessageDiv').html('');
    $.ajax({
        url: ajaxUrl,
        type: 'post',
        data: {'userIdHashed' : userIdHashed },
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        async: false,
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            hideLoader();
        },
        success: function (responseHtml) {
            if (responseHtml === 'error:session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(responseHtml.indexOf('error:')>-1){
                $('#assignRaModal').modal('hide');
                var errorMsg = responseHtml.replace('error:','');
                alertPopup(errorMsg,'error');
            }
            else if(typeof responseHtml !='undefined'){
                
                $('#assignRaModal #raMessageDiv').html(responseHtml);
                $('#userRaId').chosen();
//                $('#userRaId').attr('disabled', false);
                $('#userRaId').trigger("chosen:updated");
                $('#assignRaModal .modal-title').html(modaltitle);
                $('#assignRaModal').modal('show');
                floatableLabel();
            }
            else{
                $('#assignRaButtonId').ramoveAttr('disabled');
                console.log(responseHtml);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    
}

function getRaUsersList(userIdHashed,selectorId){
//    $('#assignedToListDiv').html(assignedTo);
    $('.chosen-select').chosen();
    $("#reassignRemark").val('');
    $("#reassignRemark").parent().removeClass('floatify__active');
//    $("#leadassignMessageDiv").html('');
    $.ajax({
        url: '/resident-advisors/get-ra-users',
        type: 'post',
        data: {'userIdHashed' : userIdHashed },
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        async: false,
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            hideLoader();
        },
        success: function (responseObject) {
            if (responseObject.error === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(typeof responseObject.error != 'undefined'){
                alertPopup(responseObject.error,'error');
            }
            if(responseObject.status==200 && typeof responseObject.raUsers === "object"){
                var counsellors  = '<option value="">RA Users</option>';
                $.each(responseObject.raUsers, function (index, item) {
                    counsellors += '<option value="'+index+'">'+item+'</option>';
                });

                $('#assignedTo_'+selectorId).html(counsellors);
                $('#assignedTo_'+selectorId).attr('disabled', false);
                $('#assignedTo_'+selectorId).trigger("chosen:updated");
            }
            else{
                console.log(responseObject.error);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function assignedLeadRa(){
    var formData = $('#lead-ra-assignment').serializeArray();
    $('#lead-ra-assignment span.error').html('');
    $('#assignRaButtonId').attr('disabled','disabled');
    $.ajax({
        url: '/resident-advisors/assigned-to-ra',
        type: 'post',
        data: formData,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        async: false,
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            hideLoader();
        },
        success: function (responseObject) {
            if (responseObject.error === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(typeof responseObject.validation_error != 'undefined'){
                for(var i in responseObject.validation_error){
                    $('span#'+i+'Error').html(responseObject.validation_error[i]);
                    console.log(responseObject.validation_error[i]);
                    $('#assignRaButtonId').removeAttr('disabled');
                }
            }
            else if(typeof responseObject.error != 'undefined'){
                alertPopup(responseObject.error,'error');
            }
            if(responseObject.status==200){
                $('#assignRaModal').modal('hide');
                alertPopup(responseObject.message,'success');
            }
            else{
                console.log(responseObject.error);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function isValidInstallmentAmount(amount){
    if(typeof amount == 'undefined' || amount == null || amount == '' || amount<=0 || !amount.match(/^\d+$/)){
        return false;
    }
    return true;
}

    function paidInstallmentRa(){
        var name = $('#installment_ra_name').text();
        var balance = $('#installment_ra_balance').text();
        var amount = $('#paid_amount').val();
        $('#Paid_amountError').html('');
        var message = 'Rs. '+amount+' to be paid to '+name;

        var amtStatus = isValidInstallmentAmount(amount);

        if(amtStatus==false){
            var errorStatus = 'Kindly enter amount which is an integer value and between 0 and '+balance;
            $('#Paid_amountError').html(errorStatus);
            $('#ConfirmPopupArea').modal('hide');
            return false;
        }
            
        $('#ConfirmMsgBody').html(message);
        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
                 .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                    e.preventDefault();
                    processPaidInstallmentRa();
                    $('#ConfirmPopupArea').modal('hide');
                });
        return false;
    }

    function processPaidInstallmentRa(){
    
    var formData = $('#initiate-ra-installment').serializeArray();
    $('#paidInstallmentRaButtonId').attr('disabled','disabled');
    $('#initiate-ra-installment span.error').html('');

    $.ajax({
        url: '/resident-advisors/paid-installment-ra',
        type: 'post',
        data: formData,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        async: false,
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            hideLoader();
        },
        success: function (responseObject) {
            if (responseObject.error === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(typeof responseObject.validation_error != 'undefined'){
                for(var i in responseObject.validation_error){
                    $('span#'+i+'Error').html(responseObject.validation_error[i]);
                    console.log(responseObject.validation_error[i]);
                    $('#paidInstallmentRaButtonId').removeAttr('disabled');
                }
            }
            else if(typeof responseObject.error != 'undefined'){
                alertPopup(responseObject.error,'error');
                $('#paidInstallmentRaButtonId').removeAttr('disabled');

            }
            if(responseObject.status==200){
                $('#assignRaModal').modal('hide');
                alertPopup(responseObject.message,'success');
            }
            else{
                $('#paidInstallmentRaButtonId').removeAttr('disabled');
                console.log(responseObject.error);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}