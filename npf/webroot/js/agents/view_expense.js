$(document).ready(function(){
    dateRange();
    setTimeout(function(){ $('.fadeInUp').hide();}, 5000);
    if($("#h_college_id").length){
        $('#collegeId').val($("#h_college_id").val());
        $('#collegeId').trigger('change');
        $('#collegeId').trigger('chosen:updated');
    }
});
  ///////custom////
 
function LoadExpenseData(type) {
    if($('#collegeId').val()===''){
        $('#collegeId_validation').text('Please select Institute');
        return false;
    }
    var data = [];
    $('.close').click();
    $('#LoadMoreArea').hide();
    if(type == 'reset') {
        ColPage = 0;
        $('#load_more_results_record').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
        $('#recordDiv .text-danger').remove();
    }
    data = $('#FilterInstituteForm').serializeArray();
    data.push({name: "page", value: ColPage});
    data.push({name: "type", value: type});
    
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;Loading...');
    //$('#tot_records').html("");

    $.ajax({
        url: jsVars.FULL_URL +'/agents/ajax-expense-list',
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
            if(data.status===0){
                $('#message').text(data.message);
                $('#recordDiv').hide();
                $('#LoadMoreArea').hide();
                $('#load_msg_div').show();
                return false;
            }
            ColPage = ColPage + 1;
            if (data === "session_logout") {
                window.location.reload(true);
            } else if (data === "norecord") {
                if (ColPage === 1){
                    $('#recordDiv').hide();
                    $('#LoadMoreArea').hide();
                    $('#load_msg_div').show();
                    $('#load_msg').text('No Records found');
                    $('#tot_records').html("");
                }
                else{
                    error_html = "No More Record";
                    $('#recordDiv').append("<div class='text-center text-danger margin-top-10'>" + error_html + "</div>");
                    $('.text-danger + .text-danger').hide(); 
                    $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Load More Record');
                    $('#load_more_button').hide();
                }
            } else {
                data = data.replace("<head/>", '');
                $('#load_more_results_record').append(data);
                $('#load_more_button').removeAttr("disabled");
                $('.offCanvasModal').modal('hide');
                table_fix_rowcol();
                dropdownMenuPlacement();           
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Load More Record');
            }
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

function getRegisteredCentre(collegeId=0) {
    var value = '<option selected="selected" value="">Select Centre Name</option>';
    $('#centre_name').html(value);
    $('#collegeId_validation').text('');
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
                $('#centre_name').trigger('chosen:updated');
                if(response.redirect !== undefined){
                    window.location = response.redirect;
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

function filterResetModalExpense(){
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
function getApiResponse(collegeId,mongoId,createdBy){
    if(collegeId==='' || mongoId===''){
        return false;
    }
    $('#apiResponse').text('');
    $('#responsemsg').text('');
    $('#resend').addClass("hidden");
    $.ajax({
        url: jsVars.FULL_URL+'/agents/getExpenseDetails',
        type: 'post',
        dataType: 'json',
        data: {
            "collegeId":collegeId,'mongoId':mongoId
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (response) {
            if(response.status === 0){
                if(response.redirect !== undefined){
                    window.location =  response.redirect;
                }
            }
            if (response.status === 200) {
                if(response.data.api_status === 0){
                    //$('#apiResponse').removeClass('text-success');
                    //$('#apiResponse').addClass('error');
                    //response.data.api_response.errorMsg
                    if(response.data.api_response === undefined){
                        var text = '<ul style="margin:0; padding:0;list-style:none;"><li><strong>Status : </strong><span class="text-danger">Fail</span></li><li><strong>Message :</strong>  Entry Failed to be recorded in LPU Expense Management System.</li></ul>';                        
                    }
                    else{
                        var text = '<ul style="margin:0; padding:0;list-style:none;"><li><strong>Status : </strong><span class="text-danger">Fail</span></li><li style="padding:10px 0"><strong>Error code : </strong> '+ response.data.api_response.code +'</li><li><strong>Message :</strong>  Entry Failed to be recorded in LPU Expense Management System.</li></ul>';                       
                    }
                    
                    $('#apiResponse').html(text);
                    //////////////data///
                    $('#request_type_api').val(response.data.request_type);
                    $('#centre_mongo_id').val(response.data.centre_mongo_id);
                    $('#amount').val(response.data.amount);
                    $('#expense_date_api').val(response.data.expense_date);
                    $('#remarks').val(response.data.remarks);
                    $('#receipt_file').val(response.data.receipt_file);
                    $('#receipt_no').val(response.data.receipt_no);
                    $('#lpu_uid').val(response.data.lpu_uid);
                    $('#mongoId').val(mongoId);
                    $('#collgeId_api').val(collegeId);
                    if(response.UserId===response.data.created_by){
                        $('#resend').removeClass("hidden");
                    }
                }
                else{
                    //$('#apiResponse').removeClass('error');
                    //$('#apiResponse').addClass('text-success');
                    ///response.data.api_response
                    var text = '<ul style="margin:0; padding:0;list-style:none;"><li><strong>Status :</strong> <span class="text-success">Success</span></li><li style="padding:10px 0"><strong>Message :</strong> Entry recorded in LPU Expense Management System Successfully.</li></ul>';
                    $('#apiResponse').html(text);
                }
            } 
        },
        error: function (xhr, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });   
}
function apiResend(){
    setTimeout(function(){ $('.fadeInUp').hide();}, 5000);
    $('#responsemsg').text('');
    $.ajax({
        url: jsVars.FULL_URL +'/agents/expenseLpuApiResend',
        type: 'post',
        data: $('form#resubmitForm').serializeArray(),
        dataType: 'json',
        headers: {
          "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
          $('#resend').addClass('hidden');
          $('#save_loader').removeClass('hidden');
        },
        complete: function () {
          $('#save_loader').addClass('hidden');
          $('#resend').addClass('hidden');
        },
        success:function(json){
            if(json){
                $('#resend').addClass('hidden');
                $('#save_loader').addClass('hidden');
                $('#responsemsg').text('Request successfully resend');
            }
            setTimeout(function(){ 
                $('.close').click();
            }, 2000);
        }
    });      
}