$(document).ready(function () {
    $('#college_id').SumoSelect({placeholder: 'Institute Name', search: true, searchText:'Institute Name', triggerChangeCombined: false });
    LoadReportDateRangepicker();
    if($('#clienthelgth').length>0){
        ajaxClientHealthMonitoring('reset');
    } 
    if($('#qareports').length>0){
        ajaxQaMonitoring('reset');
    }
    if($("#financeMonitoring").length>0){
        ajaxFinaceMonitoring('reset');
    }
    if($("#creditMonitoring").length > 0){
        ajaxCreditMonitoring('reset');
    }
    // this will bind all sorting icon.
    $(document).on('click','span.sorting_span i', function (){
        jQuery("span.sorting_span i").removeClass('active');
        var field = jQuery(this).data('column');
        var data_sorting = jQuery(this).data('sorting');
        
        $('#sort_options').val(field+"||"+data_sorting);
        jQuery(this).addClass('active');
        //client health monitoring
        if($("#clienthelgth").length>0){
            ajaxClientHealthMonitoring("reset");
        }
        //finance monitoring
        if($("#financeMonitoring").length>0){
            ajaxFinaceMonitoring("reset");
        }
        //qa monitoring
        if($("#qareports").length>0){
            ajaxQaMonitoring("reset");
        }

        // credit monitoring
        if($("#creditMonitoring").length>0){
            ajaxCreditMonitoring('reset');
        }
    });
});

function ajaxFinaceMonitoring(type){
    if (type == 'reset') {
        Page=0;
    }
    var data = $('#financeMonitoring').serializeArray();
    data.push({name: "page", value: Page});
        $.ajax({
            url: '/reports/ajaxFinanceMonitoring',
            type: 'post',
            dataType: 'html',
            data: data,
            beforeSend: function (xhr) {
                $('#listloader').show();
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                 $('#load_more_results_msg').html('');
                 $('#load_more_button').show();
                
                Page = Page + 1;
                if (data == "session_logout") {
                    window.location.reload(true);
                }else if (data == "record_not_found") {
                    if(Page==1){
                        error_html="No Records found";
                        $('#financeMonitoringHtml').html("");
                    } else {
                        error_html="No More Record";
                     }
                     $('#parent').hide();
                    $('#load_msg_div').show();
                    $('#load_msg').html(error_html);
                    $('#load_more_button').hide();
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Applications");
                   
                    //$('#financeMonitoringHtml').html("");
                }else if(data == 'csrf_mismatched'){
                    error_html="Csrf Token Mismatched";
                    $('#parent').hide();
                    $('#load_msg_div').show();
                    $('#load_msg').html(error_html);
                    $('#financeMonitoringHtml').html("");
                }else{
                    if (type == 'reset') {
                        $('#financeMonitoringHtml').html("");
                    }
                    $('#parent').show();
                    $('#load_msg_div').hide();
                    $("#financeMonitoringHtml").append(data);
                    $(".offCanvasModal").modal('hide')
                    var current_records = $("#current_record").val();
                    if(current_records<10){
                        $('#load_more_button').hide();
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            },
            complete: function (jqXHR, textStatus) {
                $('#listloader').hide();
                table_fix_rowcol()
            }
        });
}

function ajaxClientHealthMonitoring(type){
    if (type == 'reset') {
        Page=0;
    }
    var data = $('#clienthelgth').serializeArray();
    data.push({name: "page", value: Page});
        $.ajax({
            url: '/reports/ajaxClientHealthMonitoring',
            type: 'post',
            dataType: 'html',
            data: data,
            beforeSend: function (xhr) {
                $('#listloader').show();
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                $('#load_more_results_msg').html('');
                 $('#load_more_button').show();
                Page = Page + 1;
                if (data == "session_logout") {
                    window.location.reload(true);
                }else if (data == "record_not_found") {
                    if(Page==1){
                        error_html="No Records found";
                        $('#leadClientHelth').html("");
                        $('#parent').hide();
                    } else {
                        error_html="No More Record";
                    }
                    
                    $('#load_msg_div').show();
                    $('#load_msg').html(error_html);
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Records");
                    $('#load_more_button').hide();
                    
                }else if(data == 'csrf_mismatched'){
                    error_html="Csrf Token Mismatched";
                    $('#parent').hide();
                    $('#load_msg_div').show();
                    $('#load_msg').html(error_html);
                    $('#leadClientHelth').html("");
                }else{
                    if (type == 'reset') {
                        $('#leadClientHelth').html("");
                    }
                    $('#parent').show();
                    $('#load_msg_div').hide();
                    $("#leadClientHelth").append(data);
                    //$('.offCanvasModal').modal('hide');
                    var current_records = $("#current_record").val();
                    if(current_records<2 && Page ==1){
                        $('#load_more_button').hide();
                    }
                }
                $('.offCanvasModal').modal('hide');
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            },
            complete: function (jqXHR, textStatus) {
                $('#listloader').hide();
                table_fix_rowcol()
            }
        });
}

function ajaxQaMonitoring(type){
    if (type == 'reset') {
        Page=0;
    }
    var data = $('#qareports').serializeArray();
    data.push({name: "page", value: Page});
        $.ajax({
            url: '/reports/ajaxQaMonitoring',
            type: 'post',
            dataType: 'html',
            data: data,
            beforeSend: function (xhr) {
                $('#listloader').show();
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                $('#load_more_results_msg').html('');
                $('#load_more_button').show();
                Page = Page + 1;
                if (data == "session_logout") {
                    window.location.reload(true);
                }else if (data == "record_not_found") {
                    if(Page==1){
                        error_html="No Records found";
                    }else {
                        error_html="No More Record";
                    }
                    $('#parent').hide();
                    $('#load_msg_div').show();
                    $('#load_msg').html(error_html);
                    $('#load_more_button').hide();
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Applications");                    
                }else if(data == 'csrf_mismatched'){
                    error_html="Csrf Token Mismatched";
                    $('#parent').hide();
                    $('#load_msg_div').show();
                    $('#load_msg').html(error_html);
                    $('#qaMonitoring').html("");
                }else{
                    if (type == 'reset') {
                        $('#qaMonitoring').html("");
                    }
                    $('#parent').show();
                    $('#load_msg_div').hide();
                    $("#qaMonitoring").append(data);
                    $('.offCanvasModal').modal('hide');
                    var current_records = $("#current_record").val();
                    if(current_records<10){
                        $('#load_more_button').hide();
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            },
            complete: function (jqXHR, textStatus) {
                $('#listloader').hide();

            }
        });
}
/*
 * rest values
 */
function ResetMonitoringFilterValue(){
        $('#college_id').val('');
        $('#college_id').SumoSelect({placeholder: 'Institute Name', search: true, searchText:'Institute Name', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false }); 
        $('#college_id')[0].sumo.reload();
        $('#college_id').trigger("chosen:updated");
        $('#college_status').val('');
        $('#college_status').trigger("chosen:updated");
}

//downloadReports
function qaBatchBind() {
    
    $('.downloadReports').on('click', function (e) {
        var $form = $("#qareports");
        $form.attr("action", '/reports/qa-reports-download');
        $form.attr("target", 'modalIframe');
        var onsubmit_attr = $form.attr("onsubmit");
        $form.removeAttr("onsubmit");
        $form.submit();
        $form.attr("onsubmit", onsubmit_attr);
        $form.removeAttr("target");
    });
    $('#myModal').on('hidden.bs.modal', function () {
        $("#modalIframe").html("");
        $("#modalIframe").attr("src", "");
    });
}

function financeBatchBind() {
    $('.downloadReports').on('click', function (e) {
        var $form = $("#financeMonitoring");
        $form.attr("action", '/reports/finance-reports-download');
        $form.attr("target", 'modalIframe');
        var onsubmit_attr = $form.attr("onsubmit");
        $form.removeAttr("onsubmit");
        $form.submit();
        $form.attr("onsubmit", onsubmit_attr);
        $form.removeAttr("target");
    });
    $('#myModal').on('hidden.bs.modal', function () {
        $("#modalIframe").html("");
        $("#modalIframe").attr("src", "");
    });
}

function clientHealthBatchBind() {
    $('.downloadReports').on('click', function (e) {
        var $form = $("#clienthelgth");
//        alert('fffffffffffff');
        $form.attr("action", '/reports/clienthealth-reports-download');
        $form.attr("target", 'modalIframe');
        var onsubmit_attr = $form.attr("onsubmit");
        $form.removeAttr("onsubmit");
        $form.submit();
        $form.attr("onsubmit", onsubmit_attr);
        $form.removeAttr("target");
    });
    
    $('#myModal').on('hidden.bs.modal', function () {
        $("#modalIframe").html("");
        $("#modalIframe").attr("src", "");
    });
}

function ajaxCreditMonitoring(type){
    if (type == 'reset') {
        Page=0;
    }
    $('#per_page_record').trigger('chosen:updated')
    
    var data = $('#creditMonitoring').serializeArray();
    data.push({name: "page", value: Page});
    data.push({name: "max", value: $('#per_page_record').val()});

        $.ajax({
            url: '/reports/ajax-credit-monitoring',
            type: 'post',
            dataType: 'html',
            data: data,
            beforeSend: function (xhr) {
                $('#listloader').show();
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                $('#load_more_results_msg').html('');
                $('#load_more_button').show();
                Page = Page + 1;
                
                if (data == "session_logout") {
                    window.location.reload(true);
                }else if (data == "record_not_found") {
                    if(Page==1){
                        error_html="No Records Found";
                    }else {
                        error_html="No More Record";
                    }
                    $('#load_msg_div').show();
                    $('#load_msg').html(error_html);
                    $('#load_more_button').hide();
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More");                    
                }else{
                    if (type == 'reset') {
                        $('#load_more_results').html("");
                    }
                    $('.table-border').removeClass('hide');
                    if(Page==1) {
                        $('#load_more_results').append(data);
                    } else {
                        $('#load_more_results > tbody > tr:last').after(data);
                    }
                    $('#load_msg_div').hide();
                    
                    if($("#current_count").val()<10){
                        $('#load_more_button').hide();
                    }
                }
                $(".offCanvasModal").modal('hide');

            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            },
            complete: function (jqXHR, textStatus) {
                $('#listloader').hide();

            }
        });
}