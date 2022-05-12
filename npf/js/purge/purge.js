//Purge Summery Ajax Hit Variables
var stopPurgeSummeryAjaxRequest = false;
var purgeSummeryAjaxHits = [];
var counterPurgeSummaryAjax = 0;
var dataPurgeHeading = 'Data Purge Request';
var dataPurgeApprovelHeading = 'Approval Pop-up';
var dataPurgeRevertHeading = 'Data Purge Revert';
var singlePurge = '';

$(document).ready(function(){
    //Hide Full Purge option by default
    $('div.showOnAllSelect').hide();

    //By default Load Calender
    if($('#purge_date').length) {
        LoadReportDateRangepicker();
    }

    //By default Load Calender
    if($('form#purgeDataSave #date_range').length) {
        LoadReportDateRangepicker('left', 'up');
    }
    //Load Result
    if(typeof purgeCollegeId !== 'undefined' && purgeCollegeId >0) {

        //Load All forms of selected college
        LoadForms(purgeCollegeId,purgeFormId);
        $("#filter").appendTo("#FilterPurgedData");
        modalFix();
        //Load Result
        LoadMorePurgeDataListing('reset');

    }

    //Load Purge Detail Data
    if(typeof purgeDetailId !== 'undefined' && purgeDetailId >0) {

        //Load Result
        LoadMorePurgeDetailListing('reset');
    }
});



function validateEmail(x) {
    var atpos = x.indexOf("@");
    var dotpos = x.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
        return false;
    }
    return true;
}

//For Change Placeholder
$(document).on('click','input[name=purge_criteria]',function(){
    $('div.hideOnAllSelect').show();
    $('div.showOnAllSelect').hide();
    if ($(this).val() =='email') {
        $('#emailMobileDiv').text('Enter Email IDs');
        $('#email_mobile').attr('placeholder','Enter Email IDs');
        $('#user_ids').val('');
        $('#date_range_all').val('');
        $('#email_mobile').removeAttr('disabled');
        $('#date_range').removeAttr('disabled');
        $('#ip_range').removeAttr('disabled');
        LoadReportDateRangepicker('left', 'up');
    } else if($(this).val() =='mobile') {
        $('#emailMobileDiv').text('Enter Mobile Numbers');
        $('#email_mobile').attr('placeholder','Enter Mobile Numbers');
        $('#user_ids').val('');
        $('#date_range_all').val('');
        $('#email_mobile').removeAttr('disabled');
        $('#date_range').removeAttr('disabled');
        $('#ip_range').removeAttr('disabled');
        LoadReportDateRangepicker('left', 'up');
    } else {
        $('#email_mobile').val('');
        $('#date_range').val('');
        $('#ip_range').val('');
        $('div.hideOnAllSelect').hide();
        $('div.showOnAllSelect').show();
        $('select#date_filter_all_condition').val('between').trigger("chosen:updated");
        checkConditionType();
    }
});


//For Purge Validation
function validPurgeForm(){
    var error='';
    if($('input[name=purge_criteria]:checked').length ==0){
        error += 'Please select purge data on the basis of<br>';
    }

//    if(typeof $('#email_mobile').attr('disabled') === 'undefined') {
//        if($.trim($('#email_mobile').val()) == ''){
//            if($('input[name=purge_criteria]:checked').length >0){
//                if($('input[name=purge_criteria]').val() == 'email') {
//                    error += 'Please enter registered email address <br>';
//                } else if($('input[name=purge_criteria]').val() == 'mobile') {
//                    error += 'Please enter registered mobile no. <br />';
//                }
//            } else {
//                error += 'Please enter registered email address <br />';
//            }
//        }
//    }

    if(error !== '') {
        alertPopup(error,'error');
        return false;
    }else {
        showPurgeSummary();
        return true;
    }
}


function showPurgeSummary(){
    $('body div.loader-block').show();
    $("#ConfirmPopupArea").modal('hide');
    //get purge Summery Data Ajax List From Js
    if (typeof jsVars.purgeSummeryAjaxHits !== 'undefined') {
        purgeSummeryAjaxHits = jsVars.purgeSummeryAjaxHits;
    }
    //call first ajax function
    if (purgeSummeryAjaxHits.length > 0) {
        stopPurgeSummeryAjaxRequest == false;
        counterPurgeSummaryAjax = 0;
        $('#dataToBePurgedModalBox tbody#dataToBePurgedBody').html('');
        $('#dataToBePurgedModalBox tbody#dataToBePurgedBody').append('<tr width="100%" id="loaderTR"><td  colspan="5" white-space="nowrap" class="text-center"><button class="btn btn-info btn-sm">Please wait we are fetching data. <span><i class="fa fa-refresh fa-spin" style="font-size:12px;"></i></span></button></td></tr>');
        $(".nav-tabs li:eq(1)").removeClass('disabled').find('a').trigger('click');
        $(".nav-tabs li:eq(0)").addClass('stepPrev');
        eval(purgeSummeryAjaxHits[0]);
    }
    else {
        alertPopup('Unable to show you purge summery.','error');
    }
    return false;
}

function stopPurgeSummeryAjax()
{
    stopPurgeSummeryAjaxRequest == true;
    $('#dataToBePurgedModalBox tbody#dataToBePurgedBody tr#loaderTR').remove();
}

function getPurgeSummaryData(fetchData, formIds)
{
    var data = $('#purgeDataSave').serializeArray();
    data.push({name: "parameter", value: jsVars.urlData});
    data.push({name: "countType", value: fetchData});
    data.push({name: "formIds", value: formIds});
    $.ajax({
        url: jsVars.FULL_URL + '/purges/show-summary',
        data: data,
        dataType: "json",
        cache: false,
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            $('body div.loader-block').hide();
            if (typeof json['redirect'] !== 'undefined') {
                location = json['redirect'];
            }
            //If there is any error
            if (typeof json['error'] !== 'undefined') {
                $(".nav-tabs li:eq(1)").addClass('disabled');
                $(".nav-tabs li:eq(0)").find('a').trigger('click').removeClass('stepPrev');
                alertPopup(json['error'],'error');
            }
            else if (typeof json['stopAjaxRequest'] !== 'undefined' && json['stopAjaxRequest'] == 1) {
                stopPurgeSummeryAjaxRequest == true;
                $('#dataToBePurgedModalBox tbody#dataToBePurgedBody tr#loaderTR').remove();
                $('#dataToBePurgedModalBox tbody#dataToBePurgedBody').append(json['message']);
                $(".nav-tabs li:eq(1)").addClass('disabled');
                $(".nav-tabs li:eq(0)").find('a').trigger('click').removeClass('stepPrev');
                alertPopup('No Matching Record Found.','error');
            }
            else if (typeof json['success'] !== 'undefined' && json['success'] == 200) {
                $('#dataToBePurgedModalBox tbody#dataToBePurgedBody tr#loaderTR').remove();
                $('#dataToBePurgedModalBox tbody#dataToBePurgedBody').append(json['message']);
                $('#dataToBePurgedModalBox tbody#dataToBePurgedBody').append('<tr width="100%" id="loaderTR"><td  colspan="5" white-space="nowrap" class="text-center"><button class="btn btn-info btn-sm">Please wait we are fetching data. <span><i class="fa fa-refresh fa-spin" style="font-size:12px;"></i></span></button></td></tr>');

                counterPurgeSummaryAjax++;
                if ((stopPurgeSummeryAjaxRequest == false) && (typeof purgeSummeryAjaxHits[counterPurgeSummaryAjax] !== 'undefined')) {
                    eval(purgeSummeryAjaxHits[counterPurgeSummaryAjax]);
                    $(".nav-tabs li:eq(1)").removeClass('disabled').find('a').trigger('click');
					$(".nav-tabs li:eq(0)").addClass('stepPrev');
                }
                else if (typeof purgeSummeryAjaxHits.counterPurgeSummaryAjax === 'undefined') {
                    stopPurgeSummeryAjaxRequest == true;
                    $('#dataToBePurgedModalBox tbody#dataToBePurgedBody tr#loaderTR').remove();
                    var proceedBtnHtml =   '    <tr>';
                        proceedBtnHtml +=  '        <td colspan="5" class="text-center">';
                        proceedBtnHtml +=  '            <a href="javascript:void(0);" onclick="savePurgeData()" id="proceedPurgeBtn"  class="btn w-text npf-btn font16" style="text-transform: capitalize;">Proceed <i class="fa fa-angle-double-right" aria-hidden="true"></i></a>';
                        proceedBtnHtml +=  '        </td>';
                        proceedBtnHtml +=  '    </tr>';
                    $('#dataToBePurgedModalBox tbody#dataToBePurgedBody').append(proceedBtnHtml);
                }
            } else {
                alertPopup('We got some error, please try again later.','error');
            }

        },
        error: function (response) {
            alertPopup(response.responseText);
        },
        failure: function (response) {
            alertPopup(response.responseText);
        }
    });
}

function savePurgeData(){
    var data = $('#purgeDataSave').serializeArray();
    data.push({name: "parameter", value: jsVars.urlData});
    $("#dataToBePurgedModalBox input[type=\"hidden\"]").each(function() {
       data.push({name: "purge_summary[" + $(this).attr('title') +"]", value: $(this).val()});
    });
    $('#dataToBePurgedModalBox a#proceedPurgeBtn').append('&nbsp;<span><i class="fa fa-refresh fa-spin" style="font-size:12px;"></i></span>');
    $.ajax({
        url: jsVars.FULL_URL + '/purges/save-data',
        data: data,
        dataType: "json",
        cache: false,
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            $('#dataToBePurgedModalBox a#proceedPurgeBtn').parent('td').find('i.fa-refresh').remove();
            if (typeof json['success'] !== 'undefined' && json['success'] == 200) {
                //Remove Onclick Event
                $("#dataToBePurgedModalBox").modal('hide');
                //$("div#SuccessPopupArea a#OkBtn").removeAttr('onClick').hide();
                $("div#SuccessPopupArea a#OkBtn").hide();
                //$("#SuccessPopupArea .npf-close").hide();
                alertPopup(json['message'],'success');
                $('div#SuccessPopupArea #alertTitle').text(dataPurgeHeading);
                $('div#SuccessPopupArea [data-dismiss="modal"]').on('click',function(){
                    window.location.href=json['redirect_link'];
                });
            }
        },
        error: function (response) {
            alertPopup(response.responseText);
        },
        failure: function (response) {
            alertPopup(response.responseText);
        }
    });
    return false;
}


function LoadMorePurgeDataListing(type) {

    //$('#push_application').hide();
    if (type == 'reset') {

        if($('#s_college_id').val() == '') {
            $('#load_more_results').html('<tbody><tr><td><div class="aligner-middle"><div class="text-center text-info font16"><span class="lineicon-43 alignerIcon"></span><br><span id="load_msg">Please select an Institute Name and click Search to view data purge history</span></div></div></td></tr><tr></tr></tbody>');
            return false;
        }

        Page = 0;
        $('#load_more_results').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
        $('button[name="search_btn"]').attr('disabled', false);

    }
    if (Page == 0) {
        $('button[name="search_btn"]').attr("disabled", "disabled");
    }

    var data = $('#FilterPurgedData').serializeArray();
    data.push({name: "page", value: Page});
    // $('#search_btn_hit').trigger('click');

    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $.ajax({
        url: '/purges/ajax-list-purge-data',
        type: 'post',
        dataType: 'html',
        data: data,
        async:false,
        beforeSend: function () {
            $('#search_btn').prop('disabled', true);
            $('button[name="search_btn"]').addClass('pointer-none');
            showLoader();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('.offCanvasModal').modal('hide');
            $('#parent').removeClass('newTableStyle');
            $('#parent table').removeClass('table-hover');
            Page = Page + 1;
            hideLoader();
            if (data == "session_logout") {
                window.location.reload(true);
            } else if (data == "error") {
                $('button[name="search_btn"]').attr('disabled', false);
                $('#parent').removeClass('newTableStyle');
                $('#parent table').removeClass('table-hover');
                if (Page == 1) {
                    $("#tot_records").html("Total 0 Purge Requests");
                    $('.expandableSearch').hide();
                    error_html = "No Records found";
                    $('#load_more_results_table').html('<tbody><tr><td><div class="no-record-list"><div class="noDataFoundDiv"><div class="innerHtml"><img src="/img/no-record.png" alt="no-record"><span>'+ error_html +'</span></div></div></div></td></tr><tr></tr></tbody>');
                } else {
                    $('#if_record_exists').show();
                    // $('.expandableSearch').show();
                    if (Page == 0) {
                        $("#tot_records").html("Total 0 Purge Requests");
                    }
                    error_html = "No More Record";
                }
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i> Show more Data");
                $('#load_more_button').hide();
                $('#parent').removeClass('newTableStyle');
                $('#parent table').removeClass('table-hover');

            } else if (data == "select_college") {
                $('#load_more_results_table').html('<tbody><tr><td><div class="aligner-middle"><div class="text-center text-info font16"><span class="lineicon-43 alignerIcon"></span><br><span id="load_msg">Please select an Institute Name and click Search to view data purge history</span></div></div></td></tr><tr></tr></tbody>');
                $('#load_more_button').hide();
                $('.offCanvasModal').modal('hide');
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i> Show more Data");
                $('#parent').removeClass('newTableStyle');
                $('#parent table').removeClass('table-hover');
                $('.table>tbody>tr>td,.table>thead>tr>td').css('border-color','transparent');
            } else {
                $('#if_record_exists').show();
                // $('.expandableSearch').show();
                $('#parent').addClass('newTableStyle');
                $('#parent table').addClass('table-hover');
                if (type == 'reset') {
                    $('#load_more_results_table').html("");
                }
                data = data.replace("<head/>", '');
                $('#load_more_results_table').append(data);
                dropdownMenuPlacement();
                var totalRecords = $('#totalRecords').val();
                if (parseInt(totalRecords) <= parseInt(jsVars.ITEM_PER_PAGE)) {

                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i> Show more Data");
                    $('#load_more_button').hide();
                } else {
                    var current_record = $("#current_record").val();//current_record_count
                    if (current_record < jsVars.ITEM_PER_PAGE) {
                        $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>  Show more Data");
                        $('#load_more_button').hide();
                    } else {
                        $('#load_more_button').removeAttr("disabled");
                        $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i> Show more Data");
                    }

                }


            }
            $('#parent').addClass('newTableStyle');
            $('button[name="search_btn"]').attr("disabled", false);
            $('button[name="search_btn"]').removeClass('pointer-none');
            table_fix_rowcol();
            hideLoader();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function () {
            hideLoader();
        }
    });

    return false;
}

function ResetFilter(){

    $("#s_college_id").html('<option value="">Select Institute</option>');
    $("#s_college_id").trigger("chosen:updated");

    $("#form_id").html('<option value="0">Form</option>');
    $("#form_id").trigger("chosen:updated");

    $('input[type="text"]').val('');
}

function canCreateNewPurgeRequest(url,params)
{
    $.ajax({
        url: jsVars.FULL_URL + '/purges/can-create-new-purge-request',
        data: {parameter: params},
        dataType: "json",
        cache: false,
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            $('body div.loader-block').hide();
            if (typeof json['redirect'] !== 'undefined') {
                location = json['redirect'];
            }
            //If there is any error
            if (typeof json['error'] !== 'undefined') {
                alertPopup(json['error'],'error');
                $('div#ErrorPopupArea #ErroralertTitle').text(dataPurgeHeading);
            }
            else if (typeof json['success'] !== 'undefined' && json['success'] == 200) {
                window.open(jsVars.FULL_URL + '/'+ url + '/' + params, '_blank'); //open in new Tab
            } else {
                alertPopup('We got some error, please try again later.','error');
                $('div#ErrorPopupArea #ErroralertTitle').text(dataPurgeHeading);
            }

        },
        error: function (response) {
            alertPopup(response.responseText);
        },
        failure: function (response) {
            alertPopup(response.responseText);
        }
    });
}

function changePurgeStatus(id, status)
{
    var confirmMsg = 'Are you sure you want to update request?';
    var confirmTitle = 'Confirmation';
    switch(status) {
        case jsVars.PURGE_REQUEST_APPROVED:
            confirmTitle = 'Approval Pop-up';
            confirmMsg = 'Are you sure you want to Approve the Purge Request? Please make sure you have verified the Data in Leads Manager, Application Manager and Dashboards?';
            break;
        case jsVars.PURGE_REQUEST_STOP_REVERT:
            confirmTitle = 'Data Purge Revert';
            confirmMsg = 'Are you sure you want to Revert the Purge Request?';
            break;
    }

    $("#confirmYes").removeAttr('onclick');
    $('#confirmTitle').html(confirmTitle);
    $("#confirmYes").html('Confirm');
    $("#confirmYes").siblings('button').html('Cancel');
    $('#ConfirmMsgBody').html(confirmMsg);
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/purges/change-purge-status',
            type: 'post',
            dataType: 'json',
            data: {'id':id,'status':status,'action':'update'},
            beforeSend: function () {
                $('#listloader').show();
            },
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            success: function (json) {
                $('#listloader').show();
                if (typeof json['redirect'] != 'undefined' && json['redirect']!='') {
                    window.location.reload(true);
                }
                else if(typeof json['error'] != 'undefined' && json['error']!=''){
                    alertPopup(json['error'], 'error');
                    $('div#ErrorPopupArea #ErroralertTitle').text(dataPurgeHeading);
                }
                else{
                    alertPopup(json['message'], 'success');
                    $('div#SuccessPopupArea #alertTitle').text(dataPurgeHeading);
                    LoadMorePurgeDataListing('reset');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $('#listloader').show();
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            },
            complete: function () {
                $('#listloader').hide();
            }
        });

        $('#ConfirmPopupArea').modal('hide');
    });
    return false;
}


function LoadMorePurgeDetailListing(type) {

    //$('#push_application').hide();
    if (type == 'reset') {

        if($('#collegeId').val() == '') {
            $('#load_more_results').html('<tbody><tr><td><div class="aligner-middle"><div class="text-center text-info font16"><span class="lineicon-43 alignerIcon"></span><br><span id="load_msg">Please select an Institute Name and click Search to view data purge history</span></div></div></td></tr><tr></tr></tbody>');
            return false;
        }


        Page = 0;
        $('#load_more_results').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
        $('button[name="search_btn"]').attr('disabled', false);

    }
    if (Page == 0) {
        $('button[name="search_btn"]').attr("disabled", "disabled");
    }

    var data = $('#FilterPurgedData').serializeArray();
    data.push({name: "page", value: Page});

    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $.ajax({
        url: '/purges/ajax-purge-detail',
        type: 'post',
        dataType: 'html',
        data: data,
        async:false,
        beforeSend: function () {
           showLoader();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('button[name="search_btn"]').attr("disabled", false);
            Page = Page + 1;
            if (data == "session_logout") {
                window.location.reload(true);
            } else if (data == "error") {
                $('button[name="search_btn"]').attr('disabled', false);
                if (Page == 1) {
                    $("#tot_records").html("Total 0 Purged Data");
                    error_html = "No Records found";
                    $('#load_more_results').html('<tbody><tr><td><div class="col-md-12"><h4 class="text-center text-danger">' + error_html + '</h4></div></td></tr><tr></tr></tbody>');
                } else {
                    $('#if_record_exists').show();
                    if (Page == 0) {
                        $("#tot_records").html("Total 0 Purged Data");
                    }
                    error_html = "No More Record";
                }
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i> Show more Data");
                $('#load_more_button').hide();

            } else if (data == "select_college") {
                $('#load_more_results').html('<tbody><tr><td><div class="col-md-12"><h4 class="text-center text-danger">Please select an Institute Name and click Search to view Data.</h4></div></td></tr><tr></tr></tbody>');
                $('#load_more_button').hide();
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i> Show more Data");
            } else {
                $('#if_record_exists').show();
                if (type == 'reset') {
                    $('#load_more_results').html("");
                }
                data = data.replace("<head/>", '');
                $('#load_more_results').append(data);
                var totalRecords = $('#totalRecords').val();
                if (parseInt(totalRecords) <= parseInt(jsVars.ITEM_PER_PAGE)) {

                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i> Show more Data");
                    $('#load_more_button').hide();
                } else {
                    var current_record = $("#current_record").val();//current_record_count
                    if (current_record < jsVars.ITEM_PER_PAGE) {
                        $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i> Show more Data");
                        $('#load_more_button').hide();
                    } else {
                        $('#load_more_button').removeAttr("disabled");
                        $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i> Show more Data");
                    }

                }


            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function () {
            hideLoader();
        }
    });

    return false;
}

/**
 * Generate & Download Zip File
 * @param {type} fetchData
 * @param {type} formIds
 * @returns {undefined}
 */
function downloadPurgeFile(purgeId,collegeId)
{
    $('body div.loader-block').show();
    $.ajax({
        url: jsVars.FULL_URL + '/purges/download-file',
        data: {'id':purgeId,'college_id':collegeId,'action':'download'},
        dataType: "json",
        cache: false,
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            $('body div.loader-block').hide();
            if (typeof json['redirect'] !== 'undefined') {
                location = json['redirect'];
            }
            //If there is any error
            if (typeof json['error'] !== 'undefined') {
                alertPopup(json['error'],'error');
            }
            else if (typeof json['success'] !== 'undefined' && json['success'] == 200) {
                if (typeof json['downloadLink'] !== 'undefined') {
                    location = json['downloadLink'];
                }
                else if (typeof json['message'] !== 'undefined') {
                    alertPopup(json['message'],'success');
                }
            } else {
                alertPopup('We got some error, please try again later.','error');
            }
        },
        error: function (response) {
            alertPopup(response.responseText);
        },
        failure: function (response) {
            alertPopup(response.responseText);
        }
    });
}

function checkConditionType() {
    var val  = $('select#date_filter_all_condition').val();
    $("input#date_range_all").removeAttr('disabled');
    $("input#date_range_all").removeAttr("oninput");

    if (val === 'between') {
        $('.datepicker, .daterangepicker').remove();

        $("input#date_range_all").val('');
        var classDate = 'date_time_rangepicker_report';
        var removeClass = 'datetimepicker_report';
        if($("input#date_range_all").hasClass(removeClass)) {
            $("input#date_range_all").data('DateTimePicker').destroy();
        }
        $("input#date_range_all").removeClass(removeClass);
        $("input#date_range_all").addClass(classDate);

        $("input#date_range_all").datepicker('remove');
        $("input#date_range_all").attr("placeholder", "Select Date Range");
        LoadDateTimeRangepicker('left', 'up');
    } else if (val === 'before' || val === 'after') {
        $('.datepicker,.daterangepicker').remove();
        $("input#date_range_all").val('');
        var removeClassDate = 'date_time_rangepicker_report';
        var addClassDate = 'datetimepicker_report';
        $("input#date_range_all").removeClass(removeClassDate).addClass(addClassDate);
        $("input#date_range_all").off('hide.daterangepicker');
        $("input#date_range_all").attr("placeholder", "Select Date");
        LoadDateTimePickerInit();
    }
}

 function LoadDateTimePickerInit() {
    $('input#date_range_all').datetimepicker({
        showClear: true,
        format: 'DD/MM/YYYY HH:mm',
        widgetPositioning: {
            horizontal: "auto",
            vertical: "top"
        }
    });
 }

 function purgeData(type='', applicant_id='', isCrmCollege=0){
    try {
        var singlePurge = '';
        if (typeof is_filter_button_pressed === 'undefined' || is_filter_button_pressed !== 1) {
            alertPopup('It seems you have changed the filter but not Applied it. Please re-check the same to proceed further.', 'error');
            return false;
        }
        var record_count = $("#all_records_val").val();
        var users   = [];
        var isUserSelected = false;
        if (applicant_id){
            isUserSelected = true;
            users.push(parseInt(applicant_id));
            singlePurge = applicant_id
            $("#singlePurge").val(singlePurge);
        }
        else{
            $("#singlePurge").val("");
            $('input:checkbox[name="selected_users[]"]').each(function () {
                if(this.checked){
                    isUserSelected = true;
                    users.push(parseInt($(this).val()));
                }
            });
        }

        if (isUserSelected) {
            if (users.length > 0 || $('#select_all:checked').val() === 'select_all') {
                if ($('#select_all:checked').val() === 'select_all' && singlePurge === '') {
                    record_count = $("#all_records_val").val();
                    users = 'select_all';
                } else {
                    record_count = users.length;
                }
            }
            var msg = "";
            var module="";
            $('.selected_user_counts').html(record_count);
            switch(type){
                case 'lead':
                    var lmFilter = $("#leadsListFilters").val();
                    var amCount = getApplicationCount(lmFilter, users);
                    if(amCount.error){
                        throw amCount.error;
                    }
                    module = 'lead';
                    msg= "Do you want to purge the leads?";
                    break;
                case 'application':
                    if($('#form_id').val() == '' || $('#form_id').val() == '0') {
                        alertPopup('Please select form','error');
                        return false;
                    }
                    module = 'application';
                    msg= "Do you want to purge the application?";
                    break;
                default:
                    msg= "Do you want to continue.";
                    break;
            }
            $("#confirmPurgeDataModule").val(module)
            // $("#confirmPurgeDataMsgBody").text(msg);
            $("#confirmPurgeDataYes")
                    .addClass('disabled')
                    .prop('disabled', true);
            
            var dataPointsList = JSON.parse(jsVars.purge_data_points);
            if(typeof dataPointsList[module] === 'undefined') {
                throw "module not found in list";
            }
            if (isCrmCollege && Boolean(parseInt(isCrmCollege))){
                var dataPoints = dataPointsList['only_crm_points'];

                $('ul#purgeDataPoints').html("");
                $.each(dataPoints, function(key, value){
                    $('<li/>', {id: key, html: value}).appendTo('ul#purgeDataPoints')
                })

            }
            else{
                var dataPoints = dataPointsList[module];
                $('ul#purgeDataPoints').html("");
                $.each(dataPoints, function(key, value){
                    $('<li/>', {id: key, html: value}).appendTo('ul#purgeDataPoints')
                })

                if(module == 'lead'){
                    var application = $('ul#purgeDataPoints li#application');
                    var ul = document.createElement('ul');
                    ul.setAttribute('class', 'mb-15');
                    $.each(amCount.data, function(key, value){
                        var li = document.createElement('li');
                        li.setAttribute('id', key);
                        li.innerHTML = value.name + " : " + value.value;
                        li.setAttribute('id', key);
                        ul.appendChild(li);
                    })

                    application.append(ul);
                }
            }
            var mod = module.charAt(0).toUpperCase() + module.slice(1);
            $('#purgeDeleteModalInput').val('').attr('placeholder','Type Here');
            $("#purgeAlertTitle").html('Delete '+ mod + ((singlePurge === '')? 's': ''));
            $("#textModuleName").html($("#textModuleName").html().replace('{{module}}', mod +((singlePurge === '')? 's': '')));
            $.each($('#purgeDeleteModal .record_count'), function(){
                var count_msg = $(this).data('text');
                var count_msg = count_msg.replace('{{count}}', record_count);
                var n_msg = count_msg.replace('{{module}}', 'Record' + ((singlePurge === '')? 's': ''));
                $(this).html(n_msg);
                //$(this).html(count_msg.replace('Record', 'Record' + ((singlePurge === '')? 's': '')));
            });
            $('#purgeDeleteModal').modal('show');

        } else {
            alertPopup('Please select User', 'error');
        }
    } catch (e) {
        if(e == 'session_logout'){
            window.location.href = jsVars.FULL_URL+jsVars.LOGOUT_PATH
        }
        else{
            if(e = "approved_payment"){
                alertPopup('You are trying to delete {{count}} paid applications. Please remove the paid applications by Reapplying the filters and try again.'.replace('{{count}}', amCount['count']), 'error');
            }
            else{
                alertPopup('Something went wrong', 'error');
            }
        }
    }
}

$('#purgeDeleteModal').on('click','#confirmPurgeDataYes', function(e){
    e.preventDefault();
    $('#purgeDeleteModal').modal('hide');
    $("#ConfirmDeleteArea").css('z-index', 11001);
//    $("#ConfirmDeleteArea").data('cid', collegeId);
    $("#ConfirmDeleteArea").data('trigger_from', 'purge');
    $('#ConfirmDeleteMsgBody').html('Do you really want to delete these records? The data once deleted will not be recoverable.');
    $('#ConfirmDeleteMsgBody').next().next().prop("class", "confirmDeleteYes btn btn-fill-blue margin-left-15");
    $('#ConfirmDeleteArea').modal({backdrop: 'static', keyboard: false})
             .off('click', '.confirmDeleteYes').one('click', '.confirmDeleteYes', function (e) {
                confirmPurgeData();
                $('#ConfirmDeleteArea').modal('hide');
            });
})

function confirmPurgeData(){
    var module = $("#confirmPurgeDataModule").val();
    if(!module)
        throw "error";
    
    try {
        
        var $form = null;
        switch(module){
            case 'lead':
                var $form = $("#FilterLeadForm");
                break;
            case 'application':
                var $form = $("#FilterApplicationForms");
                break;
            default:
                break;
        }

        if($form){
            $form.attr("action",jsVars.FULL_URL+'/purges/create');
            $form.attr("target",'modalIframe');
            var onsubmit_attr = $form.attr("onsubmit");
            var data = [];
            var partObj = {
                name: 'is_single_purge',
                value: 0,
            };
            data.push({name: "module", value:module});
            var singlePurge = $("#singlePurge").val();
            if (singlePurge){
                partObj['value'] = 1;
                $('input[name="selected_users[]"]:checked').prop("checked", false)
                $("#selectionRow").hide();
                if (module=="lead"){
                    data.push({name:'selected_users[]', value: singlePurge+ "_0"});
                }
                else{
                    data.push({name:'selected_users[]', value: singlePurge+ '_' + $('#form_id').val()});
                }
            }
            data.push(partObj);
            $form.removeAttr("onsubmit");
            $form.ajaxSubmit({
                url: jsVars.FULL_URL+'/purges/create',
                type: 'post',
                data : data,
                dataType:'json',
                headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                success:function (response){
                    if(response.error == 'session_logout') {
                        window.location.href = jsVars.FULL_URL+jsVars.LOGOUT_PATH
                    }else if(response.error == 'search_mandatory') {
                        alertPopup('Please Search '+ module,'error');
                    }else if(response.error != '') {
                        alertPopup(response.error, 'error');
                    } else {
                        if (response.status == true) {
                            switch (module) {
                                case 'lead':
                                    LoadMoreLeadsUser('reset');
                                    break;
                                case 'application':
                                    LoadMoreApplication('reset');
                                    break;
                                default:
                                    break;
                            }

                            setTimeout(function () {
                                $('#purgeRequestPopup').find('#alertTitle').html('Delete Action Successfully Completed');
                                $('#purgeRequestPopup').find('#purgeRequestPopupURL').attr('href', response.downloadUrl);
                                $('#purgeRequestPopup').modal('show');
                                $('#purgeRequestPopup .close').addClass('npf-close');
                            }, 2000);
                        }
                    }
                }
            });
            $form.attr("onsubmit", onsubmit_attr);
            $form.removeAttr("target");
        }
    }catch (e) {
        switch(e){
            case 'search_mandatory':
                alertPopup('Please Search '+ module,'error');
                break;
            case 'session_logout':
                window.location.href = jsVars.FULL_URL+jsVars.LOGOUT_PATH
                break;
            case 'invalid_request':
            default :
                alertPopup('Something went wrong', 'error');
                break;
        }
    }
   
}

$('#purgeDeleteModal,#fullPurgeDeleteModal').on('drop cut copy paste contextmenu','#purgeDeleteModalInput,#fullPurgeDeleteModalInput', function(e){
    e.preventDefault();
});

$('#purgeDeleteModal').on('keyup keypress','#purgeDeleteModalInput', function(){
    var txt_input = $(this).val();
    var txt_compair = $.trim($('#purgeDeleteModal').find('strong[data-validate="true"]').html());
    if(txt_input === txt_compair){
        $("#confirmPurgeDataYes")
                .removeClass('disabled')
                .prop('disabled', false);
    }else{
        $("#confirmPurgeDataYes")
                .addClass('disabled')
                .prop('disabled', true);
    }
});

$('#fullPurgeDeleteModal').on('keyup keypress','#fullPurgeDeleteModalInput', function(){
    var txt_input = $(this).val();
    var txt_compair = $.trim($('#fullPurgeDeleteModal').find('strong[data-validate="true"]').html());
    if(txt_input === txt_compair){
        $("#confirmFullPurgeDataYes")
                .removeClass('disabled')
                .prop('disabled', false);
    }else{
        $("#confirmFullPurgeDataYes")
                .addClass('disabled')
                .prop('disabled', true);
    }
});

function getApplicationCount(lmFilter, users){
    return function () {
        var result= {
            'error': false,
            'data': null,
        };
        $.ajax({
            url: jsVars.FULL_URL + '/purges/getApplicationCount',
            type: 'post',
            data: {lm_filter: lmFilter, 'user_id': users},
            async: false,
            dataType: 'json',
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            success: function (response) {
                if (response.error != '') {
                    result['error'] = response.error;
                    if (response['count']){
                        result['count'] = response.count;
                    }
                } else {
                    if (response.status == true) {
                        result['error'] = false;
                        result['data'] = response.data;
                    }
                }
            }
        });

        return result;
    }();
}

function fullPurge(collegeId, isCrmCollege=0){
    $("#fullPurgeDataPoints").show();
    $("#fullPurgeCrmDataPoints").hide();
    if (isCrmCollege && Boolean(parseInt(isCrmCollege))){
        $("#fullPurgeDataPoints").hide();
        $("#fullPurgeCrmDataPoints").show();
    }
    $("#fullPurgeDeleteModalInput").val("");
    $("#confirmPurgeDataModule").val(collegeId);
    $("#fullPurgeDeleteModal").modal('show');
}

$("#confirmFullPurgeDataYes").on("click", function(){
    var collegeId = $("#confirmPurgeDataModule").val();
    if(!collegeId)
        return false;
    $("#fullPurgeDeleteModal").modal('hide');
    $("#ConfirmPopupArea").css('z-index', 11001);
    $("#ConfirmPopupArea").data('cid', collegeId);
    $("#ConfirmPopupArea").data('trigger_from', 'purge');
    $('#ConfirmMsgBody').html('Do you really want to delete these records? The data once deleted will not be recoverable.');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
             .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                $('#ConfirmPopupArea').modal('hide');
            });
});

$('#confirmYes').on('click', function (e) {
    var collegeId = $("#ConfirmPopupArea").data('cid');
    var trigger_from = $("#ConfirmPopupArea").data('trigger_from');
    if(typeof trigger_from !== "undefined" && trigger_from === 'purge'){
        $.ajax({
            url: jsVars.FULL_URL + '/purges/fullPurge',
            type: 'post',
            data: {college_id: collegeId},
            dataType: 'json',
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            success: function (response) {
                if (response.error != '') {
                    if (response.error == 'session_logout') {
                        window.location.href = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
                    } else if (response.error == 'invalid_request') {
                        alertPopup('Something went wrong', 'error');
                    } else if (response.error == 'search_mandatory') {
                        alertPopup('Please Search ' + module, 'error');
                    } else {
                        alertPopup(response.error, 'error');
                    }
                } else {
                    if (response.status == true) {
                        $('#purgeRequestPopup').find('#alertTitle').html('Delete Action Successfully Completed');
                        $('#purgeRequestPopup').find('#purgeRequestPopupURL').attr('href', response.downloadUrl);
                        $('#purgeRequestPopup').modal('show');
                        $('#purgeRequestPopup .close').addClass('npf-close');
                    }
                }
            }
        });
    }
});


