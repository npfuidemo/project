$(document).ready(function(){
    dateRange();
    setTimeout(function(){ $('.fadeInUp').hide();}, 5000);
});
if($("#h_college_id").length){
    $('#collegeId').val($("#h_college_id").val());
    $('#collegeId').trigger('change');
    $('#collegeId').trigger('chosen:updated');
}
  ///////custom////
 
function LoadDailyReportData(type) {
    if($('#collegeId').val()===''){
        $('#collegeId_validation').text('Please select Institute');
        return false;
    }
    $('.close').click();
    if(type === 'reset') {
        ColPage = 1;
        $('#load_more_results').html("");
        //$('#LoadMoreArea').show();
        $('#load_more_button').html("Loading...");
        $('#load_more_button').attr("disabled", "disabled");
    }
    data = $('#FilterInstituteForm').serializeArray();
    data.push({name: "page", value: ColPage});
    data.push({name: "type", value: type});
    $.ajax({
        url: jsVars.FULL_URL +'/agents/ajax-daily-report-list',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () { 
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
        },
        success: function (data) {
            var responseObj = $.parseJSON(data);
            if(responseObj.status===0){
                if(responseObj.redirect!=='' && typeof responseObj.redirect!=="undefined"){
                    window.location = responseObj.redirect;
                }
                if(responseObj.message==='no_record_found'){
                    $('#load_msg').text('Records not found');
                }
                $('#recordDiv').hide();
                $('#LoadMoreArea').hide();
                $('#load_msg_div').show();
                $('#tot_records').html("");
                $('#downloadExcel').hide();
                return false;
            }
            else if(responseObj.status===200){
                if(ColPage==1){
                    if(typeof responseObj.data.totalRecords!=="undefined"){
                        $('#tot_records').html('Total <strong>'+responseObj.data.totalRecords+'</strong>&nbsp;Records');
                    }
                }
                data = responseObj.data.html.replace("<head/>", '');
                $('#load_msg_div').hide();
                $('#recordDiv').show();
                $('#load_more_results').append(data);
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Load More Records');
                $('.offCanvasModal').modal('hide');
                table_fix_rowcol();
                if(data.trim()===''){
                    $('#LoadMoreArea').hide();
                }
            } else if(responseObj === "session_logout" && typeof responseObj.redirect!=="undefined") {
                window.location = responseObj.redirect;
                //window.location.reload(true);
            } else {
                $('#recordDiv').hide();
                $('#LoadMoreArea').hide();
                $('#load_msg_div').show();
                $('#tot_records').html("");
                $('#downloadExcel').hide();
                return false;
            }
            ColPage = ColPage + 1;
            dropdownMenuPlacement();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function dateRange(){
    $('.daterangepicker_fee').daterangepicker({
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY',
            separator: ', '
        },
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'left',
        drops: 'down',
    }, function (start, end, label) {
    });

    $('.daterangepicker_fee').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
    });

    $('.daterangepicker_fee').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
}

function filterResetModalReport(){
    $('.offCanvasModal input[type="text"]').each(function(){
       $(this).val('');
    });
    if($('.offCanvasModal .chosen-select').length > 0){
        $('.offCanvasModal .chosen-select').each(function(){
            this.selected = false;
            $(this).val('').trigger("change");
            $(this).trigger("chosen:updated");
        });
    }
}

function Getuserlist(collegeId) {
    if(collegeId==''){
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
                        var value = '<option selected="selected" value="">Created By</option>';
                        $.each(responseObject.data.childList, function (index, item) {
                            value += '<option value="' + index + '">' + item + '</option>';
                        });
                        $('#created_by').html(value);
                    }
                }
                $('#created_by').trigger('chosen:updated');
            } else {
                console.log(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function hitVisitPopupBind() {
    $('.modalButton').on('click', function (e) {
        $('#confirmDownloadYes').off('click');
        $('#confirmDownloadTitle').text('Download Confirmation');
        $('#ConfirmDownloadPopupArea .npf-close').hide(); 
        $('#download_type').show();
        $('.confirmDownloadModalContent').text('Do you want to download the Daily Report ?');
        //var confirmation=$(this).text();
        var $form = $("#FilterInstituteForm");
        if($('#downloadConfig').length && $('#downloadConfig').val()==1){
            $('#confirmDownloadYes').on('click',function(e){
                e.preventDefault();
                $('#ConfirmDownloadPopupArea').modal('hide');
                var type = 'visit'+$("input[name='export_type']:checked").val();
                $("#export_visit").val(type);
                var requestType=$('#requestType').val();
                $form.ajaxSubmit({ 
                    url: jsVars.FULL_URL+'/agents/download-daily-report',
                    type: 'post',
                    dataType:'json', 
                    headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                    success:function (response){
                        if(response.error !== '') {
                            
                            if(response.status === 0 && response.redirect !== undefined && response.redirect !==null){
                                window.location = response.redirect;
                            }
                            
//                            if(response.error === 'session_logout') {
//                                window.location.href = jsVars.LOGOUT_PATH;
//                            }
                            else if(response.error === 'invalid_request') {
                                alertPopup('Something went wrong','error');
                            } else {
                                alertPopup(response.error,'error');
                            }
                        } else {
                            if(requestType!=='undefined'){
                                $('#muliUtilityPopup').find('#alertTitle').html('Download Success');
                                //$('#dynamicMessage').html('Note: Downloaded data will be sorted by (Descending) Visits added date.');
                                $('#muliUtilityPopup').modal('show');
                                $('#downloadListing').show();
                                $('#downloadListingExcel').hide();
                                $('#muliUtilityPopup .close').addClass('npf-close').css('margin-top', '2px');
                            }
                        }
                    }
                });
            }); 
        }
    });
}

function alertPopup(msg, type, location) {
    if (type == 'error') {
        var selector_parent = '#ErrorPopupArea';
        var selector_titleID = '#ErroralertTitle';
        var selector_msg = '#ErrorMsgBody';
        var btn = '#ErrorOkBtn';
        var title_msg = 'Error';
    } else {
        var selector_parent = '#SuccessPopupArea';
        var selector_titleID = '#alertTitle';
        var selector_msg = '#MsgBody';
        var btn = '#OkBtn';
        var title_msg = 'Success';
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
    }
    else {
        $(selector_parent).modal();
    }
}

function getLocaion(collegeId) {
    if(collegeId===''){
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