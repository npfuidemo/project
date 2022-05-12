function LoadMoreAssessmentListing(listingType) {
    //make buttun disable
    if($("#score_operator_q").val()!='' && $("#score_val_q").val()=='') {
        $('#score_val_q_error').html('Please enter valid value.');
        return false;
    }else{
        $('#score_val_q_error').html('');
    }
    if($("#score_operator_o").val()!='' && $("#score_val_o").val()=='') {
        $('#score_val_o_error').html('Please enter valid value.');
        return false;
    }else{
        $('#score_val_o_error').html('');
    }
    
    if($("#score_operator_l").val()!='' && $("#score_val_l").val()=='') {
        $('#score_val_l_error').html('Please enter valid value.');
        return false;
    }else{
        $('#score_val_l_error').html('');
    }
    if($("#score_operator_log").val()!='' && $("#score_val_log").val()=='') {
        $('#score_val_log_error').html('Please enter valid value.');
        return false;
    }else{
        $('#score_val_log_error').html('');
    }
    
    var data = [];
    if (listingType === 'reset' || listingType === 'apply') {
        varPage = 0;
        $('#assessment_listing_container').html("");
        $('#if_record_exists').hide();

	var email_id = $('#email_id').val();
	var search_by_field = $('#search_by_field').val();
        $("#search-field-error").hide().html('');
        if(email_id!='' && search_by_field=='') {
            $("#search-field-error").show().html('Please select search criteria.');
            return false;
        }
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
	var $form = $("#assessmentListingFormMain");
	$form.append($("<input>").attr({"value":email_id, "name":"email_id",'type':"hidden","id":"email_id"}));
	$form.append($("<input>").attr({"value":search_by_field, "name":"search_by_field",'type':"hidden","id":"search_by_field"}));
    }
    
    $("#if_record_exists").hide();
    $("#actionDivId").hide();
    data = $('#assessmentListingForm, #assessmentListingFormMain').serializeArray();
    data.push({name: "page", value: varPage});
    data.push({name: "type", value: listingType});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-spin fa-refresh" aria-hidden="true"></i>&nbsp;Loading...');
    $('div.loader-block').show();

    cId = $('#s_college_id').val();
    testVendor = $('#testVendor').val();
    //console.log('cId =>' + cId);
    //console.log('testVendor =>' + testVendor);
    if (cId == '' || testVendor == '') {
        $('#communicationReportLoader').hide();
        $('#load_more_button').hide();
        if (listingType === 'reset') {
            $('#filterButton').click();
        }
        $('#errorMsg').addClass('alert alert-danger').html('Please select College & Vendor.');
        return false;
    }
    $.ajax({
        url: jsVars.FULL_URL + '/assessments/ajax-assessments-listing',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function (xhr) {
            $('.loader-block').show();
            $('#search_btn_hit').prop("disabled", true);
            $('#divShowExpenses').html("");
            $('.daterangepicker_report').prop('disabled', true);
        },
        success: function (data) {
            varPage = varPage + 1;
            var checkError = data.substring(0, 6);
            if (data === "session_logout") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (checkError === 'ERROR:') {
                alert(data.substring(6, data.length));
                $('#load_more_button').hide();
            } else {
                data = data.replace("<head/>", '');
                var countRecord = countResult(data);
                if (listingType === 'reset' || listingType === 'apply') {
                    $('#assessment_listing_container').html(data);
                    $('#if_record_exists').show();
                } else {
                    $('#assessment_listing_container').find("tbody").append(data);
                    $('#if_record_exists').show();
                }
                if (countRecord == 0 && varPage == 1) {
                    $("#if_record_exists").hide();
		            $("#actionDivId").hide();
                } else {
                    $("#if_record_exists").show();
		            $("#actionDivId").show();
                }
                if (countRecord < 10) {
                    $('#load_more_button').hide();
                } else {
                    $('#load_more_button').show();
                }
                $('#load_more_button').removeAttr("disabled");
                $('#testEnrolmentDate').removeAttr("disabled");
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Records');
            }
            table_fix_rowcol();
            $('.offCanvasModal').modal('hide');
            $('#errorMsg').html('').removeClass('alert alert-danger');
        },
        complete: function () {
            $('.loader-block').hide();
            $('#search_btn_hit').prop("disabled", false);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function countResult(html) {
    var len = (html.match(/listDataRow/g) || []).length;
    return len;
}

function resetAssessmentFilters() {
    $('#email_id').val('');
    $('#actionDivId').hide();
    $('form#assessmentListingFormMain select').val('').trigger('chosen:updated');
    $('form#assessmentListingFormMain input').val('');
    $('form#assessmentListingFormMain select').val('');
    $('.sumo-select')[0].sumo.reload();
    
}

$(document).on('click', '#modalButton', function(e) {
    e.preventDefault();
    $('#confirmDownloadTitle').text('Download Confirmation');
    $('#ConfirmDownloadPopupArea .npf-close').hide();
    $('.confirmDownloadModalContent').text('Do you want to download the assessments score ?');//download the leads
    $('#confirmDownloadYes').on('click', function () {
        $('#modalButton, #confirmDownloadYes').off('click');
        $('#ConfirmDownloadPopupArea').modal('hide');
        downloadAssessmentsScoreData();
    });
    $('#popupDismiss').on('click', function () {
        $('#modalButton, #confirmDownloadYes').off('click');
    });
});

function downloadAssessmentsScoreData() {
    var data = $('#assessmentListingFormMain').serializeArray();
    data.push({name: "export", value: "export"});
    $.ajax({
        url: jsVars.FULL_URL + '/assessments/assessments-downloads',
        type: 'post',
        dataType: 'json',
        data: data,
        beforeSend: function (xhr) {
           $("#communicationReportLoader").show();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if(typeof data.message !== 'undefined' && data.message !== '') {
                if(data.message =='session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(data.message,'error');
                    return;
                }
            } else if (typeof data.status !== 'undefined' && data.status == 1) {

                $('#muliUtilityPopup').find('#alertTitle').html('Download Success');
                $('#muliUtilityPopup').find('#downloadListing').attr('href', data.downloadUrl);
                $('#muliUtilityPopup').find('#requestMessage').html('assessments score');
                //$('#muliUtilityPopup').find('#dynamicMessage').html('Note: Downloaded data will be sorted by (Descending) Assessments Score Created date.');
                $('#muliUtilityPopup .close').addClass('npf-close').css('margin-top', '2px');
                $('#muliUtilityPopup').modal('show');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function () {
            $("#communicationReportLoader").hide();
        }
    });
}

function alertPopup(msg, type, location) {
    if (type === 'error') {
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

    if (typeof location !== 'undefined') {
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

$(document).ready(function() {
    //option A
    $("form").submit(function(e){
        e.preventDefault(e);
    });
    $('.sumo-select').SumoSelect({placeholder: 'Select Country', search: true, searchText:'Select Country'});
});

function getCountryList(val) {
    $.ajax({
        url: jsVars.FULL_URL + '/assessments/getCuntryList',
        type: 'post',
        dataType: 'html',
        data: {cid:val},
        beforeSend: function (xhr) {
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session_logout'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                htmlOption = '';
                for (var key in responseObject.data) {

                    htmlOption +='<option value="'+key+'">'+responseObject.data[key]+'</option>';
                }
                $("#country").html(htmlOption);
            }else{
                console.log(responseObject.message);
            }
            $('.sumo-select')[0].sumo.reload();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function () {

        }
    });
}

function singleCommUpdate(value) {
    if($('#single_communication').length > 0) {
        $('#single_communication').val(value);
    }
}

function LoadReportDateRangepicker() {
    $('.daterangepicker_report').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY',
            separator: ', ',
        },
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'left'
    }, function (start, end, label) {
        //console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
    });

    $('.daterangepicker_report').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
    });

    $('.daterangepicker_report').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
}

function selectAllCheckbox(elem, ...args){
    
    if(typeof args[0] === 'undefined' && $('.'+args[0]).length == 0) return false;
    
    showLoader();
    $("#selectionRow").hide();
    $("#clearSelectionLink").hide();
    $('#select_all').attr('checked',false);
    if($('#isSelectedAllUser').length) {
        $('#isSelectedAllUser').val('0');
    }
    singleCommUpdate(false);
    var selectCheckboxClass = args[0];
    
    var dynamicClassName = args[0];
    var message = 'data ';
    if(typeof args[1] !== 'undefined' && $.trim(args[1]) != '') {
        message = args[1];
    }
    if(elem.checked){
        //console.log(elem.checked);
        //$("#selectAllAvailableRecordsLinkSpan").html('<a id="selectAllAvailableRecordsLink" href="javascript:void(0);" onclick="selectAllAvailableRecordsExam('+ $("#totalRecord").val() +',\''+dynamicClassName+'\',\''+message+'\');"> Select all <b>'+ $("#totalRecord").val() +'</b>&nbsp;'+message+'</a>');
        $('.'+dynamicClassName).each(function(){
            this.checked = true;
        });
        var recordOnDisplay = $('input:checkbox[name="selected_users[]"]').length;
        //$("#currentSelectionMessage").html("All "+recordOnDisplay+ " " + message + " on this page are selected. ");
        //$("#selectionRow").show();
        //$("#selectAllAvailableRecordsLink").show();
        $("#clearSelectionLink").hide();
        $('#li_bulkCommunicationAction').show();
    }else{
        $('.'+dynamicClassName).attr('checked',false);
        $("#selectAllAvailableRecordsLink").hide();
        $('#li_bulkCommunicationAction').hide();
    }
    
    hideLoader();
}

function clearSelectionExam(dynamicCLassName){
    if($('.'+dynamicCLassName).length == 0) return false;
    
    $("#selectionRow").hide();
    $("#selectAllAvailableRecordsLink").hide();
    $("#clearSelectionLink").hide();
    $('.'+dynamicCLassName).attr('checked',false);
    $('#select_page_users').attr('checked',false);
    $('#select_all').attr('checked',false);
    if($('#isSelectedAllUser').length) {
        $('#isSelectedAllUser').val('0');
    }
}

function selectAllAvailableRecordsExam(totalAvailableRecords, ...args){
    var dynamicClassName = args[0];
    var message = args[1];
    
    $("#selectionRow").show();
    $("#selectAllAvailableRecordsLink").hide();
    $("#clearSelectionLink").show();
    $("#currentSelectionMessage").html("All "+totalAvailableRecords +' ' +message + " are selected.");
    $('#select_all').each(function(){
        this.checked = true;
    });
    $('.'+dynamicClassName).attr('checked',true);
    
    if($('#isSelectedAllUser').length) {
        $('#isSelectedAllUser').val('1');
    }
}

function assessmentRepush() {
    var arr = $('.select_users:checked').map(function(){
        return this.value;
    }).get();
    var alldata = $('#assessmentListingFormMain').serializeArray();
    alldata.push({name: "selected_users", value: arr});
    
    $.ajax({
        url: jsVars.FULL_URL + '/assessments/repush',
        type: 'post',
        dataType: 'html',
        data: alldata,
        beforeSend: function (xhr) {
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session_logout'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                startTest(responseObject.hash, 'testEP1');
            }else{
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function () {

        }
    });
}

function startTest(hash, lId,testURL) {
    //alert(jsVars._csrfToken);
    if (hash != '') {
        
        if(typeof testURL==="undefined" || testURL=='' || testURL==null){
            testURL = '/exam/enroll';
        }
        
        anchorText = $('#'+lId).text();
        
        $.ajax({
            url: testURL,
            type: 'post',
            dataType: 'json',
            data: {
                "hash": hash,
            },
            beforeSend: function (xhr) {
                $('#'+lId).html('Please Wait.');
                $('#'+lId).attr('disabled',true);
            },
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            success: function (data) {
                if(data=="session_logout"){
                    window.location.reload(true);
                }
                
                if (data.data.status == 1) {
                    if(lId=='testEP1'){
                        alert('Repush Success');
                        LoadMoreAssessmentListing('reset');
                    }else{
                        window.location.href = data.data.ssoUrl;
                    }
                }
                else if (data.data.status == 3) {
                    $('#'+lId).html(data.data.message);
                    $('#'+lId).attr('disabled',true);
                }
                else {
                    if (data.data.message != '') {
                        alert(data.data.message);
                    }
                    else {
                        alert('Cuurently this feature is not working. Please try again.');
                    }

                    $('#'+lId).attr('disabled',false);
                    $('#'+lId).html(anchorText);
                    
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            },
            complete: function (jqXHR, textStatus) {
                //$('#'+lId).html('Redirecting.');
            }
        });
    }
    else {
        alert('Invalid Request.');
        return false;
    }
}


function showHideAssesmentFilter(value){
    if($.trim(value)!= '') {
        if($.trim(value)== 'excelsoft') 
        {
              $(".logicBox").show();
              $("#productcode").show();
              $("#status_excelsoft").show();
              $("#status_its").hide();
        }
        if($.trim(value)== 'its') 
        {
             $(".logicBox").hide();
             $("#productcode").hide();
             $("#status_excelsoft").hide();
             $("#status_its").show();
           
        }
    }
    }
   