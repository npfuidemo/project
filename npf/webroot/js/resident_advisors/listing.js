/****For display requested listing***/
function raListing(listingType) {
    //make buttun disable
    var search = $('#raEmailMobileSearch').val();
    if ($("#s_college_id").val() == '') {
        $('#listing_container').html('');
        $('#load_msg_div').show();
        $("#listing_container, #if_record_exists, #load_more_button").hide();
        $('#college_error').html('<small class="text-danger">Please Select Institute</small>');
        return false;
    }
    if (listingType === 'reset') {
        varPage = 0;
        $('#listing_container').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
    }
    data = $('#ListingRaForm').serializeArray();
    data.push({name: "page", value: varPage});
    data.push({name: "sText", value: $('#raEmailMobileSearch').val()});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $.ajax({
        url: jsVars.FULL_URL + '/resident-advisors/ajax-listing',
        type: 'post',
        dataType: 'html',
        data: data,
        async: true,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $('#raListingLoader').show();
            $('.daterangepicker_report').prop('disabled', true);
            $('#college_error').html('');
        },
        complete: function () {
            $('#raListingLoader').hide();
            $('.daterangepicker_report').prop('disabled', false);
        },
        success: function (data) {

            varPage = varPage + 1;
            var checkError = data.substring(0, 6);
            if (data === "session") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (checkError === 'ERROR:') {
                alert(data.substring(6, data.length));
                $('#load_more_button').hide();
            } else {
                $('#load_msg_div').hide();
                $('#listing_container, #table-data-view, .download-after-data, #if_record_exists, #load_more_button').show();
                data = data.replace("<head/>", '');
                var countRecord = countResult(data);

                if (listingType === 'reset') {
                    $('#listing_container').html(data);
                } else {
                    $('#listing_container').find("tbody").append(data);
                }
                if (countRecord < 10) {
                    $('#load_more_button').hide();
                } else {
                    $('#load_more_button').show();
                }
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Data');
                $('[data-toggle="popover"]').popover();
//                dropdownMenuPlacement();
            }
            $('.offCanvasModal').modal('hide');
			dropdownMenuPlacement();
			//determineDropDirection();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}
//Reset all avlue
function resetRaListing() {
    $('#raEmailMobileSearch').val('');
    $('#s_college_id').val('');
    $('#download_medium').val('');
    $('#raEmailMobileSearch').val();
    $('.chosen-select').trigger('chosen:updated');
    $('#created_on').val('');
//    downloadRequestList('reset');
}

function countResult(html) {
    var len = (html.match(/listDataRow/g) || []).length;
    return len;
}

//Manage Users: Change User Status
function showEnableDisableConfirmationPopup(firstData){
    var currentObj = $('#userChangeStatus_'+firstData);
    var status = currentObj.attr('alt');
    var data = currentObj.attr('data');
    if(status==2){
        var txt = 'Enable';
    }
    else{
        var txt = 'Disable';
    }
    var message = 'Are you sure you want to '+txt.toLowerCase()+' this user?';
    $('#ConfirmAlertYesBtn').unbind();
    $('#ConfirmAlertNoBtn').unbind();
    $('#ConfirmAlertPopUpTextArea').html(message);
    $('#ConfirmAlertPopUpSection .modal-title').html(txt+" User");
    $("#ConfirmAlertPopUpSection").modal("show");
    $("#ConfirmAlertYesBtn").on("click",function(){
        changeStatusUser(firstData, status, data);
    });
}

function changeStatusUser(user_id, status, data,from) {

    $.ajax({
        url: '/resident-advisors/change-ra-user-status',
        type: 'post',
        data: {'user_id': user_id, 'status': status,'data':data},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
           showLoader();
        },
        success: function (json) {
            if (json['status'] == 200) {
                alertPopup(json['message'], 'error');
                $('#alertTitle').html('User Created');
                raListing('reset');
                $('#OkBtn').show();
            }
            else {
                // System Error
                alertPopup('Some Error occured, please try again.', 'error');
            }
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
//            window.location.reload(true);
        },
        complete: function () {
            hideLoader();
        }
    });
}

$('#OkBtn').on('click',function(){
    $("#SuccessPopupArea .npf-close").trigger('click');
});


function hitUserPopupBatchBind() {
    $('.modalButton').on('click', function (e) {
        $( "#confirmDownloadYes").off( "click" );
        $('#confirmDownloadTitle').text('Download Confirmation');
	$('#ConfirmDownloadPopupArea .npf-close').hide();
        $('.confirmDownloadModalContent').text('Do you want to download the RA Users ?');//download the leads
        var confirmation=$(this).text();
        var $form = $("#ListingRaForm");
            var action_attr = $form.attr("action");
            var searchText =  $('#raEmailMobileSearch').val();
            $form.attr("action", jsVars.FULL_URL+'/resident-advisors/ra-users-download');
            $form.attr("target", 'modalIframe');
            var onsubmit_attr = $form.attr("onsubmit");
            $('#confirmDownloadYes').on('click',function(){
                $('#ConfirmDownloadPopupArea').modal('hide');
                $form.append($("<input>").attr({"value": searchText, "name": "stext", 'type': "hidden", "id": "stext"}));
                var data = $form.serializeArray();
                $.ajax({ 
                    url: jsVars.FULL_URL+'/resident-advisors/ra-users-download',
                    type: 'post',
                    data : data,
                    dataType:'html', 
                    headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                    success:function (response){
                        if(response == 'session_logout') {
                            window.location.href = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                        } else if(response != '') {
                            alertPopup(response,'error');
                        } else {
                            var requestType=$('#requestType').val();
                            if(requestType!='undefined'){
                                $('#muliUtilityPopup').find('#alertTitle').html('Download Success');
                                $('#muliUtilityPopup').modal('show');
                                $('#muliUtilityPopup .close').addClass('npf-close');
                            }
                        }
                    }
                });
                $form.attr("action", action_attr);
                $form.removeAttr("onsubmit");
                $form.removeAttr("target");
            });
    });
    $('#myModal').on('hidden.bs.modal', function () {
        $("#modalIframe").html("");
        $("#modalIframe").attr("src", "");
    });
}