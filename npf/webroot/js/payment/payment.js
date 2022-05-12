var loadMsg = "Load More Logs";
var defaultMsgResponsePaymnet = "Please select a college from filter and click apply to view payment response logs.";

//data display
function LoadPaymentResponse(type) {
    $('#push_application').hide();
    if (type == 'reset') {
        Page = 0;
        $('#load_more_results').html("");
        $('#load_more_results_msg').html("");
        $('#load_more_results_msg').show("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
        $('button[name="search_btn"]').attr('disabled', 'disabled');

    }
    var data = $('#FilterPaymentLogForm').serializeArray();
    data.push({name: "page", value: Page});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $.ajax({
        url: '/payment/ajax-lists-payment-response',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function(){
            $('.expandableSearch button[type="submit"]').prop('disabled', true);
        },
        success: function (data) {
            $('.offCanvasModal').modal('hide');
            $('.expandableSearch').show();
            $('#parent').addClass('newTableStyle');
            $('#load_more_results').addClass('table');
            $('button[name="search_btn"]').removeAttr('disabled');
            Page = Page + 1;

            if (data == "session_logout") {
                window.location.href = '/colleges/login';
            } else if (data == "error" || data == "no_data_found") {
                $('.expandableSearch button[type="submit"]').removeAttr('disabled');
                if (Page == 1){
                    error_html = "No Records found";
                    $('#load_more_results_msg').append("<div id='load_msg_div'><div class='noDataFoundDiv'><div class='innerHtml'><img src='/img/no-record.png'><span>" + error_html + "</span></div></div></div>");
                    $('#load_more_button').hide();
                    $('#parent').removeClass('newTableStyle');
                }else{
                    error_html = "No More Record";
                $('#load_more_results_msg').append("<div class='text-center text-danger margin-top-10'>" + error_html + "</div>");
                $('#load_more_button').html(loadMsg);
                $('#load_more_button').hide();
                $('#parent').show();
            }
                if (type != '' && Page == 1) {
                    $('#if_record_exists').hide();
                    $('.expandableSearch button[type="submit"]').removeAttr('disabled');
                }
            } else if (data == "select_college") {
                $('#load_more_results_msg').html("<div id='load_msg_div'><div class='aligner-middle'><div class='text-center text-info font16'><span class='lineicon-43 alignerIcon'></span><br><span id='load_msg'>" + defaultMsgResponsePaymnet + "</span></div></div></div>");
                $('#load_more_button').hide();
                $('#load_more_button').html(loadMsg);
                $('.expandableSearch button[type="submit"]').removeAttr('disabled');
                if (type != '') {
                    $('#if_record_exists').hide();
                }
            } else {
                data = data.replace("<head/>", '');
                $('.expandableSearch').show();
                $('#load_more_results').append(data);
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html(loadMsg);
                if (type != '') {
                    $('#if_record_exists').fadeIn();
                }
                //$.material.init();
                //table_fix_rowcol();
                $('.expandableSearch button[type="submit"]').removeAttr('disabled');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}


//reset value of form
function ResetPaymentResponseFilterValue() {
    $('#FilterPaymentLogForm select#college_id').val('');
    $('#FilterPaymentLogForm select#college_id').trigger("chosen:updated");
    $('#FilterPaymentLogForm select#paymentvender').val('');
    $('#FilterPaymentLogForm select#paymentvender').trigger("chosen:updated");
    $('#FilterPaymentLogForm #paymet_date').val('');
    $('#FilterPaymentLogForm #search_common').val('');
    $('#load_more_results').html('<tbody><tr><td><div id="load_msg_div"><div class="aligner-middle"><div class="text-center text-info font16"><span class="lineicon-43 alignerIcon"></span><br><span id="load_msg">' + defaultMsgResponsePaymnet + '</span></div></div></div></td></tr><tr></tr></tbody>');
    $('#if_record_exists').hide();
    $('#load_more_results_msg').html("");
    $('#load_more_button').hide();
    return false;
}


//show data in popup
function showResponseData(response =''){
    var valueResponse =$("#"+response).html();
    $('#mainData').html(valueResponse);
    $("#payment-response-history").trigger('click');
}
