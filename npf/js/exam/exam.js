$(document).ready(function(){
    /*if($('.daterangepicker_report').length > 0){
        LoadReportDateRangepicker();
    }
    */
    $('[data-toggle="popover"]').popover();
    jQuery(".initHide").addClass('initShow');

    $('input[name ="exam_vendor[]"]').on('change',function(){
       var vendor = $(this).val();
       if(vendor=='cocubes' || vendor=='wheebox'){
            if($("#exam-vendor-"+vendor).is(":checked")){
                $("#vendor_version_"+vendor).css("display",'block');
            }else{
                $("#vendor_version_"+vendor).css("display",'none');
            }
        }
    });


    if($('.application_stages').length>0){
        $('.sumo_select').SumoSelect({placeholder: 'Select Application Stage',search: true, searchText: 'Select Application Stage',csvDispCount:3});
    }

    if($('.exam_vendor').length>0){
        $('.sumo_select').SumoSelect({placeholder: 'Select Exam Partner',search: true, searchText: 'Select Exam Partner'});
    }

    $('#total_retake').on('focusout',function(){
            retakeAdmitCard();
    });

    if ($('.registration_no').length > 0) {
        $('.clientCandidateIDType').each(function () {
            var vendor_id=$(this).attr('vendor_id');
            if ($(this).val() == 'registration_no') {

            } else {
                $("#"+vendor_id+"Form").find('.registration_no').each(function (){
                    $(this).closest('.formChildNoMargin').hide();
                });
            }
        })
        $('.clientCandidateIDType').on('change', function () {
            var vendor_id=$(this).attr('vendor_id');
            if ($(this).val() == 'registration_no') {
                $("#"+vendor_id+"Form").find('.registration_no').each(function () {
                    $(this).closest('.formChildNoMargin').show();
                });
            } else {
                $("#"+vendor_id+"Form").find('.registration_no').each(function () {
                    $(this).closest('.formChildNoMargin').hide();
                });
            }
        });
    }
});

$('input[name ="exam_vendor[]"]').each(function(){
       var vendor = $(this).val();
       if(vendor=='cocubes' || vendor=='wheebox'){
            if($("#exam-vendor-"+vendor).is(":checked")){
                $("#vendor_version_"+vendor).css("display",'block');
            }else{
                $("#vendor_version_"+vendor).css("display",'none');
            }
        }
});
$('.modalButton').on('click', function(e) {
    var $form = $("#ExamForm");
    $form.attr("action",'/exam/ead-listing-downloads');
    $form.attr("target",'modalIframe');
    $form.append($("<input>").attr({"value":"export", "name":"export",'type':"hidden","id":"export"}));
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    $form.submit();
    $form.attr("onsubmit",onsubmit_attr);
    $form.find('input[name="export"]').val("");
    $form.removeAttr("target");
});

$(document).on('click', '#snuModalButton', function(event) {
    var $form = $("#ExamForm");
    $form.attr("action",'/exam/snu-reports-downloads');
    $form.attr("target",'modalIframe');
    $form.append($("<input>").attr({"value":"export", "name":"export",'type':"hidden","id":"export"}));
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    $form.submit();
    $form.attr("onsubmit",onsubmit_attr);
    $form.find('input[name="export"]').val("");
    $form.removeAttr("target");
});
$('#myModal').on('hidden.bs.modal', function(){
    $("#modalIframe").html("");
    $("#modalIframe").attr("src", "");
});
var downloadVoucherFile = function (url) {
    window.open(url, "_self");
};

//This function will return CDD data of User
function viewCDDData(...args){
    var collegeId = args[0];
    var formId = args[1];
    var userId = args[2];
    var type = args[3];

    $('#utilityPopup .modal-title').html('Client Demographic Post Data');
    $.ajax({
       url: '/exam/view-cdddata',
       type: 'post',
       dataType: 'html',
       data: {'collegeId':collegeId, 'formId':formId, 'userId':userId, 'type':type},
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       success: function (data) {
           if(typeof data['error'] !=='undefined'){
               if(data['error'] =='session_logout') {
                   window.location.reload(true);
               } else {
                   alertPopup(data['error'],'error');
                   return false;
               }
           }else if(data == 'permision_denied'){
               window.location.href= '/permissions/error';
           }
		   $('#utilityPopup .modal-dialog').removeClass('modal-lg').addClass('modal-sm');
           $('#utilityPopup .modal-body').html(data);
           $('#utilityPopup').modal('show');

       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}

/**
 * This function will load EAD data of User
 * @param {type} listingType
 * @returns {undefined}
 */
function loadMoreEADLogs(listingType){

    singleCommUpdate(false);
    if(listingType == 'reset'){
        $('#college_error').html('');
        if($('#college_id').val() == '') {
            $('#college_error').html('<small class="text-danger">Please Select Institute</small>');
            return false;
        }


        if($('#isSelectedAllUser').length) {
            $('#isSelectedAllUser').val('0');
        }
        Page = 0;
        if($('#load_more_button').length == 0) {
            $('#LoadMoreArea').html('<button style="display:none;" id="load_more_button" type="button" onclick="javascript:loadMoreEADLogs();" class="btn btn-md btn-info w-text m0"><i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Load More</button>');
        }
        $('#eadSearchBtn').attr('disabled',true).val('Please Wait...');
    }


    var data = $('form#ExamForm').serializeArray();
    data.push({name: "page", value: Page});
    $.ajax({
        url: '/exam/ajax-ead-listing',
        type: 'post',
        data: data,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
            $('#eadSearchBtn').removeAttr('disabled').val('Search');
        },
        success: function (html) {
            $('.loader-block').hide();
            $('#eadSearchBtn').removeAttr('disabled').val('Search');
            Page = Page + 1;
            if (html === 'session_logout'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if(html == 'error'){
					if (document.documentElement.clientWidth < 967) {
						$('.offCanvasModal').modal('hide');
					}
                    if(Page>1) {
                        $('#LoadMoreArea').html('<h4 class="text-center text-danger">No More Record</h4>');
                    } else {
                        $('#load_more_results').html('');
                        $('#load_more_results, #parent').hide();
                        $('#load_msg_div').show();
                        $('#load_msg').html('No record found');
                    }
                    if (Page==1) {
                      $('#tot_records, #LoadMoreArea, #perPageRecordDivId, #mdc, #selectionRow').hide();
                    }
            }else{
                html = html.replace("<head/>", "");
                if(listingType === 'reset'){
                    $('#load_msg_div, #selectionRow').hide();
                    $('#tot_records, #perPageRecordDivId, #mdc').show();
                    $('#load_more_results').html(html);
                    $('#actionDivId, #parent, #load_more_results, #tot_records, #perPageRecordDivId, #mdc').show();
                }else{
                    $('#load_more_results').find("tbody").append(html);
                }

                var countRecord = $('#totalRecord').val();
                if(countRecord < jsVars.RecordPerPage){
                    $('#load_more_button').hide();
                }else{
                    $('#load_more_button, #LoadMoreArea').show();
                    $('#load_more_button').removeAttr("disabled").html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Show more Data');
                }
				setDownloadReportsForSnu($('#college_id').val());
				table_fix_rowcol();
                dropdownMenuPlacement();
                $('.offCanvasModal').modal('hide');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#eadSearchBtn').removeAttr('disabled').val('Search');
        }
    });
};


function LoadForms(value, default_val, formDropdownText, ...args) {

    //Blank all option from form dropdown
    $('#form_id option[value!=""]').remove();
    $('#form_id').html('<option value="">'+formDropdownText+'</option>');
    $('#form_id').trigger("chosen:updated");



    //If form Id is empty then return false from here
    if(value <= 0 || value =='') {
        if($('#application_no').length > 0) {
            $('#application_no').hide();
        }
        return false;
    }
    var addFunction = (typeof args[0] !== 'undefined' && args[0] == true) ? true : false;
    var blankAllField = (typeof args[0] !== 'undefined' && args[0] == 'blankAllField') ? true : false;
    var addUtilityOnChange = (typeof args[1] !== 'undefined' && args[1] == 'add_utility_onchange') ? true : false;

    if(blankAllField) {
        $('#skipConfigAndvendorName, #actionType').val('');
        $('#applicationNo').val('');

        $('.chosen-select').trigger("chosen:updated");
    }
    $.ajax({
        url: '/voucher/get-forms',
        type: 'post',
        dataType: 'html',
        data: {
            "college_id": value,
            "default_val": default_val
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if(data=="session_logout"){
                window.location.reload(true);
            }
            $('#div_load_forms').html(data);
            $('.div_load_forms').html(data);

            if(typeof formDropdownText !== 'undefined' && formDropdownText != '') {
                $('#form_id').attr('data-placeholder', formDropdownText);

                if(addFunction) {
                    $('#form_id').attr('onchange','showHide(this.value);showExamName(this.value);');
                }

                if(addUtilityOnChange) {
                    $('#form_id').attr('onchange','showFormDetailField(this.value);showExamName(this.value);');
                }

                $('#form_id option[value="0"]').html(formDropdownText);
            }

            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function showUserData(params, showType, isCallFromPopup, showErrorMsg){

    if(typeof showErrorMsg === 'undefined') {
        showErrorMsg = '';
    }

     $.ajax({
        url: '/exam/show-user-data-by-type',
        type: 'post',
        dataType: 'html',
        data: {
            "params": params,
            "showType": showType,
            "showErrorMsg": showErrorMsg
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if(typeof data == 'session_logout') {
                window.location.href='/';
            }

            $('#EADPreviewModal .modal-title').html('Data Detail');
            $('#showEADPreviewContainer').html(data);

            if(typeof isCallFromPopup == 'undefined' || isCallFromPopup == '') {
                $("#EADPreviewModal").modal();
            }

            $('#EADPreviewModal').on('shown.bs.modal', function (e) {
              $('body').addClass('scrollHidden');
            });

            $('#EADPreviewModal').on('hidden.bs.modal', function (e) {
              $('body').removeClass('scrollHidden');
            });


            if($('#postDataDiv').length) {

                $('#EditAdmitCardDataDiv').hide();

                $('.popupClass').removeClass('active');

                var showParams = $('#showParams').val();
                var editParams = $('#editParams').val();

                $('#postDataDiv > a').attr('onclick','showUserData(\''+showParams+'\', \'post_data\', \'1\')');
                $('#admitCardDataDiv > a').attr('onclick','showUserData(\''+showParams+'\', \'admit_card_data\', \'1\')');
                $('#examResultDataDiv > a').attr('onclick','showUserData(\''+showParams+'\', \'section_question_details\', \'1\')');

                //Display Edit Admit card AS per condition
                if($('#canEditAdmitCard').length && $('#canEditAdmitCard').val() == 1) {
                    $('#EditAdmitCardDataDiv').show();
                    $('#EditAdmitCardDataDiv > a').attr('onclick','showUserData(\''+editParams+'\', \'edit_admit_card\', \'1\')');
                }

                var divIdName = '';
                switch(showType) {
                    case 'post_data':
                        divIdName = 'postDataDiv';
                        $('.preview_btn').hide();
                        break;
                        case 'admit_card_data':
                            divIdName = 'admitCardDataDiv';
                            $('.preview_btn').show();
                        break;
                    case 'section_question_details':
                        divIdName = 'examResultDataDiv';
                        break;
                    case 'edit_admit_card':
                        divIdName = 'EditAdmitCardDataDiv';
                        break;
                }
                $('#'+divIdName).addClass('active');
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/**
 * Below function can use everywhere for check all checkbox
 * @param {type} elem
 * @param {type} args
 * args[0] => First Index should be class name
 * args[1] => Second Index should be message
 * @returns {Boolean}
 */
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
        $("#selectAllAvailableRecordsLinkSpan").html('<a id="selectAllAvailableRecordsLink" href="javascript:void(0);" onclick="selectAllAvailableRecordsExam('+ $("#totalRecord").val() +',\''+dynamicClassName+'\',\''+message+'\');"> Select all <b>'+ $("#totalRecord").val() +'</b>&nbsp;'+message+'</a>');
        $('.'+dynamicClassName).each(function(){
            this.checked = true;
        });
        var recordOnDisplay = $('input:checkbox[name="selected_users[]"]').length;
        $("#currentSelectionMessage").html("All "+recordOnDisplay+ " " + message + " on this page are selected. ");
        $("#selectionRow").show();
        $("#selectAllAvailableRecordsLink").show();
        $("#clearSelectionLink").hide();
        $('#li_bulkCommunicationAction').show();
    }else{
        $('.'+dynamicClassName).attr('checked',false);
        $("#selectAllAvailableRecordsLink").hide();
        $('#li_bulkCommunicationAction').hide();
    }

    hideLoader();
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

function showExamConfigByVendor(vendorKey){
    $('.examVendorClass').hide();
    $('.examTabClass').removeClass('active');
    $('#examTabId'+vendorKey).addClass("active").show();
    $('#examDivId'+vendorKey).show();
    $('.showhideresultsclass').show();
}

function saveExamConfig(vendorKey, params){

    /*
    var file_data = $('input[name="certificate"]').prop('files')[0];
    var form_data = new FormData('#'+vendorKey+'Form');
    form_data.append('file', file_data);


    var data = $('#'+vendorKey+'Form').serializeArray();
    var file_data = $('input[name="certificate"]').prop('files');
    data.push({name: "file", value: file_data});
    console.log(form_data);



    var data = new FormData();

    if($('#'+vendorKey+'Form input[name="certificate"]').length) {
        var file_data = $('#'+vendorKey+'Form input[name="certificate"]').prop('files')[0];
        data.append('file', file_data);
    }

    var other_data = $('#'+vendorKey+'Form').serializeArray();
    $.each(other_data,function(key,input){
        data.append(input.name,input.value);
    });



    $.ajax({
        url: '/exam/save-exam-config', // point to server-side PHP script
        dataType: 'text',  // what to expect back from the PHP script, if anything
        cache: false,
        contentType: false,
        processData: false,
        data: data,
        type: 'post',
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function(php_script_response){

            //alert(php_script_response); // display response from the PHP script, if any
        }
     });


    var data = $('#'+vendorKey+'Form').serializeArray();
    */
    var data = new FormData();

    if($('#'+vendorKey+'Form input[name="certificatePath"]').length) {
        var file_data = $('#'+vendorKey+'Form input[name="certificatePath"]').prop('files')[0];
        data.append('files', file_data);
    }

    var other_data = $('#'+vendorKey+'Form').serializeArray();
    $.each(other_data,function(key,input){
        data.append(input.name,input.value);
    });

    data.append('params', params);
    data.append('vendorName', vendorKey);

    //data.push({name: "params", value: params});
    //data.push({name: "vendorName", value: vendorKey});

    $.ajax({
        url: '/exam/save-exam-config',
        type: 'post',
        dataType: 'json',
        data: data,
        contentType: false,
        processData: false,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if(typeof json['error'] !== 'undefined'){

                if(json['error'] =="session_logout") {
                    window.location.reload(true);
                } else {
                    alertPopup(json['error'],'error');
                    return false;
                }
            }else if(typeof json['errorList'] !== 'undefined' && json['errorList'] != ''){
                $('.error').remove();
                $.each(json['errorList'], function(fieldName, errorMsg) {
                    var fldName = fieldName.toLowerCase();
                    if($('form#'+vendorKey+'Form #'+fldName).length) {
                        errElement = $('form#'+vendorKey+'Form #'+fldName);
                        if($('form#'+vendorKey+'Form #'+fldName).attr('class').includes("SumoUnder") || $('form#'+vendorKey+'Form #'+fldName).attr('class').includes("chosen-select")){
                            errElement= errElement.next();
                        }
                        errElement.after('<span class="error">'+errorMsg+'</span>');
						var errorPos = jQuery('.error').offset().top - 90;
						$("html, body").animate({scrollTop: errorPos}, 1000);
                    }
                });
            }else if(typeof json['successMsg'] !== 'undefined' && json['successMsg'] != ''){
				$('.error').remove();
				$('.succesmsg').show();
				$('.succesmsg').html(json['successMsg'],'success').fadeOut(4000, function() {
                                    $(this).html('');
                                });
                //alertPopup();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function resetExamFilterValue() {
    $('input[type="text"]').each(function () {
        $(this).val('');
    });
    $('button[name="search-btn"]').attr('disabled', false);
    $('select').each(function () {
        this.selected = false;
        $(this).val('');
        $(this).trigger("chosen:updated");
    });

    $('#load_more_results, #tot_records').html('');
    $('#parent, #load_more_button').hide();
    $('#load_msg_div').show();
    singleCommUpdate(false);
    return false;
}

function LoadMoreManageExam(type) {
    //$('#table-view').show();
    if (type == 'reset') {
        $('#college_error').html('');
        if($('#collegeId').val() == '') {
            $('#college_error').html('<small class="text-danger">Please Select Institute</small>');
            return false;
        }

        Page = 0;
        $('#load_more_results').html("");
        $('#load_more_button').show();
        $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;&nbsp;Loading...');
        $('button[name="search-btn"]').attr('disabled', false);
        clearSelectionExam();
    }
    if (Page == 0) {
        $('#search_btn_hit').attr("disabled", "disabled");
    }

    var data = $('#ManageExamForm').serializeArray();
    data.push({name: "page", value: Page});

    $('#load_more_button').attr("disabled", "disabled").hide();
    $.ajax({
        url: '/exam/manage-exam-lists',
        type: 'post',
        dataType: 'html',
        data: data,
        async:false,
        beforeSend: function () {
           showLoader();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (html) {
            $('#search_btn_hit').removeAttr("disabled");
            $('.loader-block').hide();
            Page = Page + 1;
            if (html === 'session_logout'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if(html == 'error'){

                    if(Page>1) {
                        $('#LoadMoreArea').html('<div class="text-center text-danger">No More Record</div>');
                    } else {
                        $('#load_more_results').html('');
                        $('#load_more_results, #parent').hide();
                        $('#load_msg_div').show();
                        $('#load_msg').html('No record found');
                    }
                    if (Page==1) {
                      $('#tot_records, #LoadMoreArea, #perPageRecordDivId, #mdc, #selectionRow, #if_record_exists').hide();
                    }

            }else{
                html = html.replace("<head/>", "");
                if(type === 'reset'){
                    $('#load_msg_div, #selectionRow').hide();
                    $('#LoadMoreArea').html('<button id="load_more_button" type="button" onclick="javascript:LoadMoreManageExam();" class="btn btn-sm btn-info w-text m0"><i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Load More Data</button>');
                    $('#load_more_results').html(html);
                    $('#parent, #load_more_results, #tot_records, #perPageRecordDivId, #mdc, #if_record_exists').show();
                }else{
                    $('#load_more_results').find("tbody").append(html);
                }

                var countRecord = $('#totalRecord').val();
                if(countRecord < jsVars.RecordPerPage){
                    $('#load_more_button').hide();
                }else{
                    $('#load_more_button, #LoadMoreArea').show();
                    $('#load_more_button').removeAttr("disabled").html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Show more Data');
                }
                //filterClose();
				$('.offCanvasModal').modal('hide');

                dropdownMenuPlacement();
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

function validateExamConfigStepOne(){
    var totalError = false;

    //Initially hide all message
    $('.error').hide();

    //For Institute Name
    if($('#instituteId').val() == '') {
        $('#instituteError').show().html('Please select Institute name.');
        totalError = true;
    }

    //For Form Name
    if($('#form_id').val() == 0) {
        $('#formIdError').show().html('Please select form name.');
        totalError = true;
    }


    if($('input:select[name="exam_vendor[]"]:checked').length == 0) {
        $('#examVendorSpanID').show().html('Please select exam vendor.');
        totalError = true;
    }

    if($('input:checkbox[name="exam_action[]"]:checked').length == 0) {
        $('#examActionSpanID').show().html('Please select exam config.');
        totalError = true;
    }

    $.each($('input:checkbox[name="exam_action[]"]:checked'), function(){

        //For Retake
        if($(this).val() == 'exam_retake') { //For Retake
            if($('#retake_trigger').val() === null || $('#retake_trigger').val() == '') {
                $('#retake_trigger').next('div').after('<span class="error">Select retake trigger.</span>').show();
                totalError = true;
            }

            if($('#total_retake').val() <= 0) {
                $('#total_retake').after('<span class="error">Select no. of retake.</span>').show();
                totalError = true;
            }

            if($('#retake_payment').val() === null || $('#retake_payment').val() == '') {
                $('#retake_payment').next('div').after('<span class="error">Select retake payment.</span>').show();
                totalError = true;
            }

            if($('#retake_button_label').val() <= 0) {
                $('#retake_button_label').after('<span class="error">Select retake label.</span>').show();
                //totalError = true;
            }

            if($('#total_retake').val()> 0 && $("#actionId_retake_admit").is(":checked")) {
               for(var retake_count=1;retake_count<=$('#total_retake').val();retake_count++){
                   if(typeof $("#retake_admitcard_"+retake_count).val()=='undefined' || $("#retake_admitcard_"+retake_count).val()=='' || $("#retake_admitcard_"+retake_count).val()=='0'){
                       $("#Retake_admitcard_"+retake_count).html('<span class="error">Select admit card template.</span>').show();
                       totalError = true;
                    }
               }
            }
        }

        //For Re-Schedule
        if($(this).val() == 'exam_re_schedule') { //For Re-Schedule

            if($('#reschedule_label').val() === null || $('#reschedule_label').val() == '') {
                $('#reschedule_label').after('<span class="error">Please enter ReSchedule label</span>').show();
                totalError = true;
            }

            if($('#reschedule_time').val() === null || $('#reschedule_time').val() == '') {
                $('#reschedule_time').after('<span class="error">Please enter ReSchedule time</span>').show();
                totalError = true;
            }
        }

        //For Enable Slot Booking
        if($(this).val() == 'exam_slot_booking') {
            if($('input[name="slot_booking_form_level[eligibility_date_type]"]:checked').length ==0){
                $('#eligibilityDateId').after('<span class="error">Please select date type</span>').show();
                totalError = true;
            } else {
                var getDateType = $('input[name="slot_booking_form_level[eligibility_date_type]"]:checked').val();
                var sdateedaterequered =false;

                if(sdateedaterequered==true){
                    if(getDateType == 'static') {
                        //For Slot Booking Start Date
                        if($('#slot_booking_start_date').val() == 0 ) {
                            $('#slot_booking_start_date').after('<span class="error">Please select eligibility start date.</span>').show();
                            totalError = true;
                        }

                        //For Slot Booking End Date
                        if($('#slot_booking_end_date').val() == 0) {
                            $('#slot_booking_end_date').after('<span class="error">Please select eligibility end date.</span>').show();
                            totalError = true;
                        }

                        if($.trim($('#slot_booking_start_date').val()) != '' && $.trim($('#slot_booking_end_date').val()) != '') {

                            var startDate = new Date($.trim($('#slot_booking_start_date').val()));
                            var endDate = new Date($.trim($('#slot_booking_end_date').val()));

                            if(startDate >= endDate) {
                                $('#slot_booking_end_date').after('<span class="error">Eligibility end date should be greater than eligibility start date.</span>').show();
                                totalError = true;
                            }
                        }
                    } else if(getDateType == 'dynamic') {
                        if($('#slot_booking_dynamic_start_date').val() == 0) {
                            $('#slot_booking_dynamic_start_date_chosen').after('<span class="error">Please select eligibility start date.</span>').show();
                            totalError = true;
                        }

                        if($.trim($('#slot_booking_dynamic_end_date').val()) == '' && $.trim($('#slot_booking_dynamic_fixed_end_date').val()) == '') {
                            $('#slot_booking_dynamic_end_date').after('<span class="error">Please select eligibility end date.</span>').show();
                            totalError = true;
                        }else if($.trim($('#slot_booking_dynamic_end_date').val()) !== '' && $.trim($('#slot_booking_dynamic_fixed_end_date').val()) !== '') {
                            $('#slot_booking_dynamic_end_date').after('<span class="error">You can set eligibility end date only in one field.</span>').show();
                            totalError = true;
                        }
                    }
                }
            }
        }

        //For Exam Graph
        if($(this).val() == 'exam_graph') { //For Exam Graph

            if($('#examGraphEventListID').val() === null || $('#examGraphEventListID').val() == '') {
                $('#examGraphEventListID').next().after('<span class="error">Please select Graph </span>').show();
                totalError = true;
            }
        }

    });

    if($("#score_card_type").val() != '' && $("#score_card_type").val() == 'dynamic'){
        var examCodeArray = [];
        $('.error').hide().html('');
        var $scoreCardTemplateFields = $("#dynamic_score_card_template_div").find('#score_card_alias, #exam_code, #score_card_template');
        $scoreCardTemplateFields.each(function() {
            var scoreCardTemplateId = $(this).attr("data-id");
            if($(this).attr("id") == 'exam_code'){
                examCodeArray.push($.trim($(this).val()));
                examCodeArray = examCodeArray.sort();

                for (var i = 0; i < examCodeArray.length - 1; i++) {
                    if (examCodeArray[i + 1] == examCodeArray[i]) {
                        examCodeArray.splice($.inArray(examCodeArray[i], examCodeArray), 1);
                        $('#err_'+$(this).attr('id')+'_'+scoreCardTemplateId).show().html('Duplicate exam code.');
                        totalError = true;
                    }
                }
            }
            if ($.trim($(this).val()) == '') {
                $('#err_'+$(this).attr('id')+'_'+scoreCardTemplateId).show().html('Please enter '+$(this).attr('id').replace(/\_/g, " ")+'.');
                totalError = true;
            }
        });
    }

    if(typeof $("#exam_email_whitelist").val()!="undefined" && $("#exam_email_whitelist").val() != ''){
        var emaillist = $("#exam_email_whitelist").val().split(',');
        var emailflag=false;
        emaillist.forEach(function(key,val){
            if(!validateEmail(key)){
               emailflag=true;
            }
        });
        if(emailflag){
            totalError=true;
            $("#examEmailWhitelistError").html("Enter Valid emails.").show();
        }
        if(!emailflag && emaillist.length>10){
            $("#examEmailWhitelistError").html("WhiteListed Email max limit is 10").show();
            totalError=true;
        }
    }
    if(typeof $("#exam_ip_whitelist").val()!="undefined" && $("#exam_ip_whitelist").val() != ''){
        var iplist = $("#exam_ip_whitelist").val().split(',');
        var ipflag=false;
        iplist.forEach(function(key,val){
            if(!ValidateIPaddress(key)){
               ipflag=true;
            }
        });
        if(ipflag){
            totalError=true;
            $("#examIpWhitelistError").html("Enter Valid IPs.").show();
        }
        if(!ipflag && iplist.length>10){
            $("#examIpWhitelistError").html("WhiteListed IP max limit is 10").show();
            totalError=true;
        }

    }

    if(totalError) {
        return false;
    }

    return true;
}

function editExamDataByType(params){
     $.ajax({
        url: '/exam/show-ead-detail-by-type',
        type: 'post',
        dataType: 'html',
        data: {
            "params": params
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if(typeof data == 'session_logout') {
                window.location.href='/';
            }
            $('#EADPreviewModal .modal-title').html('Data Detail');
            $('#showEADPreviewContainer').html(data);
            $("#EADPreviewModal").modal();

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function updateEADData(params){
    $('span').removeClass('error');
    var data = $('#EADPopUpData').serializeArray();
    data.push({name: "params", value: params});
     $.ajax({
        url: '/exam/update-ead-data',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if(typeof json['error'] !== 'undefined') {
                if(json['error']== 'session_logout') {
                    window.location.href='/';
                } else {
                    $('#EADPreviewModal').modal('toggle');
                    alertPopup(data['error'],'error');
                    return false;
                }
            } else if(typeof json['errorList'] !== 'undefined') {

                $.each(json['errorList'], function(fieldKey, errorMsg) {
                   $('#'+fieldKey+'_error').addClass('error').html(errorMsg);
                });
            } else if(typeof json['successMsg'] !== 'undefined') {
                $('#EADPreviewModal').modal('toggle');
                alertPopup(json['successMsg'],'success');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function alertPopup(msg, type, location) {
    var selector_parent, selector_titleID, selector_msg, title_msg, btn;
    if (type == 'error') {
        selector_parent = '#ErrorPopupArea';
        selector_titleID = '#ErroralertTitle';
        selector_msg = '#ErrorMsgBody';
        btn = '#ErrorOkBtn';
        title_msg = 'Notification';
    } else {
        selector_parent = '#SuccessPopupArea';
        selector_titleID = '#alertTitle';
        selector_msg = '#MsgBody';
        btn = '#OkBtn';
        title_msg = 'Success';
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
    } else {
        $(selector_parent).modal();
    }
}

function alertPopup1(msg, type, location) {
    var selector_parent, selector_titleID, selector_msg, title_msg, btn;
    if (type == 'error') {
        selector_parent = '#ErrorPopupArea';
        selector_titleID = '#ErroralertTitle';
        selector_msg = '#ErrorMsgBody';
        btn = '#ErrorOkBtn';
        title_msg = 'Error';
    } else {
        selector_parent = '#SuccessPopupArea';
        selector_titleID = '#alertTitle';
        selector_msg = '#MsgBody';
        btn = '#OkBtn';
        title_msg = 'Success';
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
    } else {
        $(selector_parent).modal();
    }
}

function updateExamStatus(Obj, params, status){
    var formName = $(Obj).data('formname');
    var currentId = $(Obj).data('id');
    if (formName)
    {
        $('#confirmTitle').html("Confirm");
        var statusText = (status == 1) ? 'Disable' : 'Enable';
        $('#ConfirmMsgBody').html('Are you sure to ' + statusText + ' exam config of "' + formName + '"?');
        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();

        $.ajax({
            url: jsVars.changeStatusURL,
            type: 'post',
            data: {params: params},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('#listloader').show();
            },
            complete: function () {
                $('#listloader').hide();
            },
            success: function (json) {
                $('#listloader').hide();
                if (json['redirect'])
                {
                    location = json['redirect'];
                }
                else if (json['error'])
                {
                    $('#ConfirmPopupArea').modal('hide');
                    alertPopup(json['error'], 'error');
                }
                else if (json['success'] == 200)
                {
                    $('#ConfirmPopupArea').modal('hide');
                    if (json['changes'])
                    {
                       $('#status_'+currentId).html(json['changes']['newStatusText']);
                       $('#linkId_'+currentId).html(json['changes']['newStatusAnchor']);
                       $('#linkId_'+currentId).attr('onClick', 'updateExamStatus(this,\''+json['params']+'\', \''+json['changes']['newStatus']+'\')');
                       alertPopup(json['changes']['statusChangeText'], 'success');
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('#listloader').hide();
            }
          });
       });
    }
}

/**
 * This function will load EAD data of User
 * @param {type} listingType
 * @returns {undefined}
 */
function loadMoreExamErrorLogs(listingType){

    //console.log(listingType);
    //console.log($('#dataType').val());
    if(listingType == 'reset'){
        var hasError = false;
        $('#college_error, #dataTypeError').html('');
        if($('#college_id').val() == '') {
            $('#college_error').html('<small class="text-danger">Please Select Institute</small>');
            hasError = true;
        }

        if($('#dataType').val() == '' || $('#dataType').val() == null) {
            $('#dataTypeError').html('<small class="text-danger">Please Select Data Type</small>');
            hasError = true;
        }

        if(hasError) return false;

        if($('#isSelectedAllUser').length) {
            $('#isSelectedAllUser').val('0');
        }
        Page = 0;
        if($('#load_more_button').length == 0) {
            $('#LoadMoreArea').html('<button style="display:none;" id="load_more_button" type="button" onclick="javascript:loadMoreExamErrorLogs();" class="btn btn-md btn-info w-text m0"><i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Load More</button>');
        }
        $('#eadSearchBtn').attr('disabled',true).val('Please Wait...');
    }


    var data = $('form#ExamForm').serializeArray();
    data.push({name: "page", value: Page});
    $.ajax({
        url: '/exam/ajax-exam-error-log-listing',
        type: 'post',
        data: data,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
            $('#eadSearchBtn').removeAttr('disabled').val('Search');
        },
        success: function (html) {
            $('.loader-block').hide();
            $('#eadSearchBtn').removeAttr('disabled').val('Search');
            Page = Page + 1;
            if (html === 'session_logout'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if(html == 'error'){
                    if(Page>1) {
                        $('#LoadMoreArea').html('<h4 class="text-center text-danger">No More Record</h4>');
                    } else {
                        $('#load_more_results').html('');
                        $('#load_more_results, #parent').hide();
                        $('#load_msg_div').show();
                        $('#load_msg').html('No record found');
                    }
                    if (Page==1) {
                      $('#tot_records, #LoadMoreArea, #perPageRecordDivId, #mdc, #selectionRow').hide();
                    }
            }else{
                html = html.replace("<head/>", "");
                if(listingType === 'reset'){
                    $('#load_msg_div, #selectionRow').hide();
                    $('#tot_records, #perPageRecordDivId, #mdc').show();
                    $('#load_more_results').html(html);
                    $('#actionDivId, #parent, #load_more_results, #tot_records, #perPageRecordDivId, #mdc').show();
                }else{
                    $('#load_more_results').find("tbody").append(html);
                }

                var countRecord = $('#totalRecord').val();
                if(countRecord < jsVars.RecordPerPage){
                    $('#load_more_button').hide();
                }else{
                    $('#load_more_button, #LoadMoreArea').show();
                    $('#load_more_button').removeAttr("disabled").html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Show more Data');
                }
                dropdownMenuPlacement();
				$('.offCanvasModal').modal('hide');
                //filterClose();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#eadSearchBtn').removeAttr('disabled').val('Search');
        }
    });
};

function showHide(formId) {
    if(formId > 0) {
        $('#application_no').show();
        $('#exam_name').show();
    } else {
        $('#application_no').hide();
        $('#exam_name').hide();
    }
}

function checkManualSubmitValidation(){
    $('.error').html('');
    var hasError = false;

    //For College Id
    if($('#collegeId').val() == '') {
        $('#collegeIdError').html('Please select college.');
        hasError = true;
    }

    //For Form id
    if($('#form_id').val() == '' || $('#form_id').val() == 0) {
        $('#formIdError').html('Please select form name.');
        hasError = true;
    }

    if($.trim($('#applicationNo').val()) == '') {
        $('#applicationNoError').html('Please enter Application No.');
        hasError = true;
    }

    if($.trim($('#actionType').val()) == '') {
        $('#actionTypeError').html('Please select action type.');
        hasError = true;
    }


    if(hasError) {
        return false;
    }

    $('#confirmTitle').html("Confirm");
    var statusText = (status == 1) ? 'Disable' : 'Enable';
    $('#ConfirmMsgBody').html('Are you sure to push data?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
    .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
    e.preventDefault();

    $('#search_btn').html('Please Wait...').attr('disabled','disabled');
    var data = $('form#manualExamForm').serializeArray();
    //data.push({name: "page", value: Page});

    $.ajax({
        url: '/exam/validateManualExamSubmit',
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            //$('#listloader').show();
        },
        complete: function () {
            //$('#listloader').hide();
        },
        success: function (json) {

            if (json['redirect'])
            {
                location = json['redirect'];
            }
            else if (json['error'])
            {
                $('#ConfirmPopupArea').modal('hide');
                alertPopup(json['error'], 'error');
            }
            else if (json['success'] == 200)
            {
                $('#ConfirmPopupArea').modal('hide');
                var totalUser = (typeof json['success'] !== 'totalUserAdded') ? json['totalUserAdded'] : 0;
                alertPopup('Total ' +totalUser +' user(s) data submitted successfully.', 'success');
            }

            $('#search_btn').html('Save').removeAttr('disabled');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#search_btn').html('Save').removeAttr('disabled');
        }
      });
   });

}

function setDownloadReportsForSnu(collegeId){
    if(collegeId == '276'){
	if($('#actionID #snu-download').length == 0){
	    $("#actionID").append('<li id="snu-download"><a href="" id="snuModalButton" class="setDownloadReportsForSnu dropdown-item" data-toggle="modal" data-target="#myModal" href="#">Download Reports SNU</a></li>');
	}
    }else{
	if($('#actionID #snu-download').length > 0){
	    $('#actionID #snu-download').remove();
	}
    }
    }

function showHideActionOption(actionName){
    if($('#actionId_'+actionName+':checked').length > 0) {
        switch(actionName){
            case 'exam_slot_booking':
                $('#eligibilityDateId').show();
                $('#datetimePicker').show();
                $('#actionDivId_'+actionName).show();
                break;
            default:
                $('#actionDivId_'+actionName).show();
        }

    } else {
        switch(actionName){
            case 'exam_slot_booking':
                $('#eligibilityDateId').hide();
                $('#datetimePicker').hide();
                $('#actionDivId_'+actionName).hide();
                break;
            default:
                $('#actionDivId_'+actionName).hide();
        }
    }
}


/**
 * Communication Popup Code
 *
 */
function AuthorizationPopup(type)
{
    var total_checked=0;
    var display_popup = false;
    if(type == 'approve') {
        if($('#utility_status').val() == '') {
            alertPopup('Kindly select authorization as pending from the filters.\n You can only approve authorizations that are in Pending Stage.','error');
            return false;
        }
    }else if(type == 'update') {
        if($('#vendor').val() == '') {
            alertPopup('Please select vendor','error');
            return false;
        }

        if($('#form_id').val() == 0) {
            alertPopup('Please select form name','error');
            return false;
        }
    }


    $('input:checkbox[name="selected_users[]"]').each(function () {
        if(this.checked){
            display_popup = true;
            total_checked++;
        }
    });

    if(total_checked == 0) {
        alertPopup('Please select Authorization Exam','error');
        return false;
    }

    $('#viewExamScheduleModal').modal();
    $('.loader-block-a').show();
    var data = $('form#ExamForm').serializeArray();
    data.push({name: "actionType", value: type});
    $.ajax({
        url: '/exam/load-authorization-popup',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () {
            $('div.loader-block-lead-list').show();
        },
        success: function (html) {
            $('.loader-block-a').hide();

            if(html=='error:session'){
                window.location.reload();
            }
            else if(html.indexOf('error:')>-1){
                alertPopup(html.replace(/error:/,''),'error');
            } else {
                $("#viewExamScheduleModal").css('z-index', 11001);
                $('#showExamScheduleList').removeClass('text-center').addClass('text-left');
                $('#showExamScheduleList').html(html);

                $('#viewExamScheduleModal .modal-dialog').css('width','');
                var heading;
                switch(type) {
                    case 'approve':
                        heading = 'Approve/Reject Authorization ID';
                        break;
                    case 'update':
                        heading = 'Update Authorization';
                        $('#viewExamScheduleModal .modal-dialog').css('width','700px');
                        break;
                    default:
                        heading = 'Send New Authorization ID';
                }

                $('#viewScheduleModalLabel').html(heading);

                if($('#newAuthorizationForm .chosen-select').length >0) {
                    $('.chosen-select').chosen();
                    $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
                    $('.chosen-select').trigger('chosen:updated');
                }
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/**
 * This function will send request for second Authorization ID
 * @returns {undefined}
 */
function requestNewAuthorization(actionType)
{
    var isStatusFieldExist = false;
    if($('#auth_status').length > 0) {
        if($('#auth_status').val() == '') {
            $('#auth_status_error').html('Please select status');
            return false;
        }

        //Finaly status selected then unset error
        $('#auth_status_error').html('');
        isStatusFieldExist = true;
    }

    if($('#authorization_remark').val() == '') {
        $('#remark_error').html('Please enter remarks');
        return false;
    }

    $('#remark_error').html('');

    $("#ConfirmPopupArea").css('z-index', 12500);
    $('#confirmTitle').html("Confirm");

    var confirmMsg = 'Are you sure to send new Authorization ?';
    if(actionType == 'approve') {
        confirmMsg = 'Are you sure to '+$('#auth_status option:selected').text() +' Authorization ?';
    }

    $('#ConfirmMsgBody').html(confirmMsg);
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
    .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
    e.preventDefault();

    $('#ConfirmPopupArea').modal();
    $('.loader-block-a').show();
    var data = $('form#ExamForm').serializeArray();
    data.push({name: "remark", value: $('#authorization_remark').val()});
    data.push({name: "actionType", value: actionType});

    if(isStatusFieldExist) {
        data.push({name: "auth_status", value: $('#auth_status').val()});
    }

    $.ajax({
        url: '/exam/requestAuthorization',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () {
            $('div.loader-block-lead-list').show();
        },
        success: function (json) {
            $('.loader-block-a').hide();

            if(typeof json['error'] !== 'undefined' && json['error'] != ''){
                if(json['error'] == 'session') {
                    window.location.reload();
                } else {
                    $('#ConfirmPopupArea').modal('hide');
                    $("#ErrorPopupArea").css('z-index', 12000);
                    alertPopup(json['error'],'error');
                    return false;
                }
            } else {
                $('#ConfirmPopupArea').modal('hide');
                $('#ErrorPopupArea').modal('hide');
                $('#viewExamScheduleModal').modal('hide');
                if(typeof json['status'] !== 'undefined' && json['status'] == 1) {
                    if(json['type']=='Reject'){
                        alertPopup('Total ' + json['totalEAD'] + ' EAD reject request accepted successfully.','success');
                    }else{
                        alertPopup('Total ' + json['totalEAD'] + ' EAD approve request accepted successfully.','success');
                        
                    }
                    
                }
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
  });
}

function approveAuthorization(){
    if($('#utility_status').val() == '') {
       alertPopup('Please select utility status','error');
       return false;
    }
}

function blockUtility(params,showMsg) {
    $.ajax({
        url: '/exam/block-utility',
        type: 'post',
        dataType: 'html',
        data: {'params':params},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (html) {
            if(html=='error:session'){
                window.location.reload();
            }
            else if(html.indexOf('error:')>-1){
                alertPopup(html.replace(/error:/,''),'error');
            }
            else{
                $('#viewExamScheduleModal .modal-header  button[type="button"]').addClass('close npf-close');
                $("#viewExamScheduleModal").css('z-index', 11001);
                $('#showExamScheduleList').removeClass('text-center').addClass('text-left');
                $('#showExamScheduleList').html(html);
                $('#viewScheduleModalLabel').html('Test Security Action');
                $('#viewExamScheduleModal').modal();

                if(typeof showMsg !== 'undefined' && showMsg !== '') {
                    $('#showMessage').addClass('text-success mb-10').html(showMsg).fadeOut(4000);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/*For Call block utility */
function updateBlockUtility(st,id) {
    var statusTitle = (st == 1) ? 'Unblock' : 'Block';
    var labelName = $('#labelId'+id).text();
    $("#ConfirmPopupArea").css('z-index', 12001);
    $('#ConfirmMsgBody').html('Are you sure you want to ' +statusTitle+' "' + labelName +'"?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
    .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {

            var data = $('form#blockActionForm').serializeArray();
            data.push({name: "st", value: st});
            data.push({name: "id", value: id});
            $.ajax({
               url: '/exam/update-block-utility',
               type: 'post',
               dataType: 'json',
               data: data,
               headers: {
                   "X-CSRF-Token": jsVars._csrfToken
               },
               success: function (json) {
                   //$('#viewExamScheduleModal, #ConfirmPopupArea').modal('hide');
                   if (typeof json['error'] !=='undefined' && json['error'] === 'session') {

                       window.location.reload(true);
                   }
                   else if (typeof json['error'] !=='undefined' && json['error'] !== '') {
                       alertPopup(json['error'],'error');
                   }
                   else if(typeof json['success'] !=='undefined' && json['success'] === 200){
                       //$("#SuccessPopupArea").css('z-index', 12001);
                       //alertPopup(json['msg'],'success');

                       $('#ConfirmPopupArea').modal('hide');
                       blockUtility($('#blockActionForm > #params').val(), '"<strong>' +labelName +'</strong>" ' + statusTitle+'ed Successfully');
                       //$('#showMessage').html('User successfully '+ statusTitle);
                   }
               },
               error: function (xhr, ajaxOptions, thrownError) {
                   console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
               }
           });
    });
}
function updateBlockUtilityMultiple(st,id) {
    var statusTitle = (st == 1) ? 'Unblock' : 'Block';
    $("#ConfirmPopupArea").css('z-index', 12001);
    $('#ConfirmMsgBody').html('Are you sure you want to '+statusTitle+'?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
    .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {

            var data = $('form#blockActionForm').serializeArray();
            data.push({name: "st", value: st});
            data.push({name: "id", value: id});
            $.ajax({
               url: '/exam/update-block-utility',
               type: 'post',
               dataType: 'json',
               data: data,
               headers: {
                   "X-CSRF-Token": jsVars._csrfToken
               },
               success: function (json) {
                   if (typeof json['error'] !=='undefined' && json['error'] === 'session') {

                       window.location.reload(true);
                   }
                   else if (typeof json['error'] !=='undefined' && json['error'] !== '') {
                       alertPopup(json['error'],'error');
                   }
                   else if(typeof json['success'] !=='undefined' && json['success'] === 200){
                       $('#ConfirmPopupArea').modal('hide');
                       blockUtility($('#blockActionForm > #params').val(), statusTitle+'ed Successfully');
                   }
               },
               error: function (xhr, ajaxOptions, thrownError) {
                   console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
               }
           });
    });
}
function showFormDetailField(fid, selected) {
    if(fid == '') {
        $('#block_utility_field_name').html('<option value="">Select Field</option>').trigger("chosen:updated");
        return false;
    }
    $.ajax({
        url: '/exam/load-form-details-field',
        type: 'post',
        dataType: 'json',
        data: {
            "fid": fid,
            "selected": selected
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if (typeof json['error'] !=='undefined' && json['error'] === 'session_logout') {
                window.location.reload(true);
            }else if(typeof json['data'] !== 'undefined' && json['data'] !== '') {
                var html = '<option value="">Select Field</option>';
                $.each(json['data'], function(key, label){
                    html += '<option value='+key+'>'+label+'</option>';
                });
                $('#block_utility_field_name').html(html).trigger("chosen:updated");

                var html = '<option value="">Select Field</option>';
                $.each(json['data'], function(key, label){
                   if(key=='exam_mode'){
                        html += '<option value='+key+'>'+label+'</option>';
                    }
                });
                $('#reschedule_form_level_exam_mode').html(html).trigger("chosen:updated");

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function showExamName(fid) {
    if(fid == '') {
        return false;
    }
    $('#exam-name-div').hide();
    $.ajax({
        url: '/exam/load-exam-name-field',
        type: 'post',
        dataType: 'json',
        data: {
            "fid": fid,'cid':$('#college_id').val()
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if (typeof json['error'] !=='undefined' && json['error'] === 'session_logout') {
                window.location.reload(true);
            }else if(typeof json['error'] !=='undefined' && json['error'] === 'invalid_configuration'){
                $('#exam-name-div').hide();
            }else if(typeof json['data'] !== 'undefined' && json['data'] !== '') {
                var html = '<option value="">Exam Name</option>';
                $.each(json['data'], function(key, label){
                    html += '<option value='+key+'>'+label+'</option>';
                });
                $('#exam_name').html(html).trigger("chosen:updated");
                $('#exam_name').css("display", "none");
                $('#exam-name-div').show();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/**
 * This function will use on exam config
 * @param {type} args
 * @returns {undefined}
 */
function verifyConfig(...args){

    if(typeof args[0] !== '' && args[0] =='pearson' && typeof args[1] !== '' && args[1] =='sftp') {
        var data = $('#'+args[0]+'Form').serializeArray();
        var buttonText = $('#checkBtn'+args[1]).text();
        $('#checkBtn'+args[1]).attr('disabled','disabled').html('Please Wait');
        $.ajax({
            url: '/exam/verifySFTPConnection',
            type: 'post',
            dataType: 'json',
            data: data,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            beforeSend: function () {
                $('div.loader-block-lead-list').show();
            },
            success: function (json) {
                $('.loader-block-a').hide();

                if(typeof json['error'] !== 'undefined' && json['error'] != ''){
                    if(json['error'] == 'session') {
                        window.location.reload();
                    } else {
                        $('#ConfirmPopupArea').modal('hide');
                        $("#ErrorPopupArea").css('z-index', 12000);
                        alertPopup(json['error'],'error');
                    }
                } else {
                    if(typeof json['status'] !== 'undefined' && json['status'] == 200) {
                        alertPopup(json['message'],'success');
                    }
                }
                $('#checkBtn'+args[1]).removeAttr('disabled').html(buttonText);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $('#checkBtn'+args[1]).removeAttr('disabled').html(buttonText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

/**
 * This function will Update Authorization
 * @returns {undefined}
 */
function updateAuthorization()
{
    $('#showMessage').removeClass('alert alert-danger text-center').html('');
    var isStatusFieldExist = false;
    if($('#authorizationTransactionType').val() == '') {
       $('#showMessage').addClass('alert alert-danger text-center').html('<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp;Please select atleast one value');
       return false;
    }
    if($('#authorizationTransactionType').val() == '' &&
       $('#examStatus').val() == '' && $('#eligibilityLastDate').val() == '') {
       $('#showMessage').addClass('alert alert-danger text-center').html('<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp;Please select atleast one value');
       return false;
    }

    //Check eligibility Date validation
    if($('#eligibilityLastDate').val() != '') {
        var todaysDate = new Date();
        var endDate = new Date($.trim($('#eligibilityLastDate').val()));
        if(endDate < todaysDate) {
            $('#showMessage').addClass('error').html('Eligibility end date should be greater than today\'s date.');
            return false;
        }
    }

    if($('#exam_slot_booked').val() != '') {
        var todaysDate = new Date();
        var exam_slot_booked_date = new Date($.trim($('#exam_slot_booked').val()));
        var examStatus = $('#examStatus').val();
        if((todaysDate < exam_slot_booked_date) && (examStatus=='examdelivered' || examStatus=='resultavailable' || examStatus=='noshow')) {
            $('#showMessage').addClass('error').html('Exam date should be leass than or equal to today\'s date.');
            return false;
        }
    }

    $("#ConfirmPopupArea").css('z-index', 12500);
    $('#confirmTitle').html("Confirm");

    $('#ConfirmMsgBody').html('Are you sure you want to update the Authorization? Once updated, you cannot revert the changes.');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
    .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
    e.preventDefault();

    $('#ConfirmPopupArea').modal();
    $('.loader-block-a').show();
    var data = $('form#ExamForm, form#newAuthorizationForm').serializeArray();

    $.ajax({
        url: '/exam/updateAuthorization',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () {
            $('div.loader-block-lead-list').show();
        },
        success: function (json) {
            $('.loader-block-a').hide();

            if(typeof json['error'] !== 'undefined' && json['error'] != ''){
                if(json['error'] == 'session') {
                    window.location.reload();
                } else {
                    $('#ConfirmPopupArea').modal('hide');
                    $("#ErrorPopupArea").css('z-index', 12000);
                    alertPopup(json['error'],'error');
                    return false;
                }
            } else {
                $('#ConfirmPopupArea').modal('hide');
                $('#ErrorPopupArea').modal('hide');
                $('#viewExamScheduleModal').modal('hide');
                if(typeof json['successMessage'] !== 'undefined' && json['successMessage'] !== '') {
                    alertPopup(json['successMessage'],'success');
                }
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
  });
}

/**
 * This function will load vendor list as per college Id
 * @param {type} cid
 * @returns {undefined}
 */
function LoadVendorList(cid) {

    //Blank all option from form dropdown
    $('#vendor option[value!=""]').remove();
    $('#vendor').html('<option value="">Select Vendor</option>');
    $('#vendor').trigger("chosen:updated");

    if(cid == '') return false;

    $.ajax({
        url: '/exam/load-vendor-list',
        type: 'post',
        dataType: 'json',
        data: {
            "collegeId": cid
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if (typeof json['error'] !=='undefined' && json['error'] === 'session') {
                window.location.reload(true);
            }else if(typeof json['vendorList'] !== 'undefined' && json['vendorList'] !== '') {
                var html = '<option value="">Select Vendor</option>';
                $.each(json['vendorList'], function(key, label){
                    html += '<option value='+key+'>'+label+'</option>';
                });
                $('#vendor').html(html).trigger("chosen:updated");

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function showHideEligibilityDate(){
    if($('input[name="slot_booking_form_level[eligibility_date_type]"]:checked').length > 0) {
        $('#eligibilityDateId').show();
        var selectedValue = $('input[name="slot_booking_form_level[eligibility_date_type]"]:checked').val();
        if(selectedValue == 'static'){
            $('#staticDateId').show();
            $('#eiWiseDate').hide();
            $('#dynamicDateId').hide();
        }else if(selectedValue == 'dynamic'){
            $('#staticDateId').hide();
            $('#eiWiseDate').hide();
            $('#dynamicDateId').show();
        }else if(selectedValue == 'eiwise'){
            $('#staticDateId').hide();
            $('#dynamicDateId').hide();
            $('#eiWiseDate').show();
        }
    } else {
        $('#eligibilityDateId, #staticDateId, #dynamicDateId').hide();
    }
}

//For Show hide event
function showHideExamCommonFunction(obj){

    var currentObj = $(obj);

    var currentId = currentObj.attr('id');

        $('.showhideclass').fadeOut();
        $('.'+currentObj.val()+'Class').fadeIn(1000);

    /*
    if(currentObj.val() == 'api') {
        $('.showhideclass'+currentId).hide();
    }else if(currentObj.val() == 'sftp') {
        $('.showhideclass'+currentId).show();
    }*/
}

function showHideResultsExamCommonFunction(obj) {
    var currentObj = $(obj);

    var currentId = currentObj.attr('id');

    $('.showhideresultsclass').fadeOut();
    $('.'+currentObj.val()+'Class').fadeIn(1050);
}

function showHideAppoitmentExamCommonFunction(obj) {
    var currentObj = $(obj);

    var currentId = currentObj.attr('id');

    $('.showhideadmitcardclass').fadeOut();
    $('.'+currentObj.val()+'Class').fadeIn(1050);
}

function showHideScoreTemplateField(scorecardType){
    $("#static_score_card_template").hide();
    $("#dynamic_score_card_template").hide();

    if(scorecardType == 'static'){
        $("#static_score_card_template").show();
    }else if(scorecardType == 'dynamic'){
        $("#dynamic_score_card_template").show();
    }
}

function loadScoreCardTemplate(cid){
    if(cid == ''){
        alertPopup('Please select institute','error');
        return false;
    }
    var scorecardType = $("#score_card_type").val();
    $.ajax({
        url: '/exam/get-scorecard-template',
        type: 'post',
        dataType: 'json',
        data: {
            "collegeId": cid
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () {
            $("#static_score_card_template").hide();
            $("#dynamic_score_card_template").hide();
        },
        success: function (json) {
            if (typeof json['error'] !=='undefined' && json['error'] === 'session') {
                window.location.reload(true);
            }else if(typeof json['scoreCardTemplateList'] !== 'undefined' && json['scoreCardTemplateList'] !== '') {
                var html = '<option value="">Select Template</option>';
                $.each(json['scoreCardTemplateList'], function(key, label){
                    html += '<option value='+key+'>'+label+'</option>';
                });
                $('.score-card').html(html).trigger("chosen:updated");

            }
            if(scorecardType == 'static'){
                $("#static_score_card_template").show();
            }else if(scorecardType == 'dynamic'){
                $("#dynamic_score_card_template").show();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function addScoreCardTemplateMapping(){
    var addCount = +$("#add_more_count").val() + 1;
    var sampleHtml = $('#score_template_1').clone();
    $("#add_more_count").val(addCount);
    $("#dynamic_score_card_template_div").append("<div class='score_template_mapping_div margin-top-10' id='score_template_"+addCount+"'>"+sampleHtml.html()+"</div>");
//    $('#form_register_'+addCount+' .registration_field_value').attr('name','form_mapping[registration_field_value]['+$("#add_more_count").val()+'][]');

    $('#score_template_'+addCount+' .score-card').val("");
    $('#score_template_'+addCount+' .score-card').attr("data-id",addCount);
    $('#score_template_'+addCount+' .score-card').show();
    $('#score_template_'+addCount+' #err_score_card_alias_1').attr('id','err_score_card_alias_'+addCount);
    $('#score_template_'+addCount+' #err_exam_code_1').attr('id','err_exam_code_'+addCount);
    $('#score_template_'+addCount+' #err_score_card_template_1').attr('id','err_score_card_template_'+addCount);

    if($('#score_template_'+addCount+' .chosen-select').length > 0) {
        $('#score_template_'+addCount+' .chosen-container').remove();
        $('#score_template_'+addCount+' .chosen-select').chosen();
    }
}

function removeScoreCardTemplateMapping(element){
    var scoreCardTemplateId = $(element).attr("data-id");
    $('#score_template_'+scoreCardTemplateId).remove();
}

function singleCommUpdate(value) {
    if($('#single_communication').length > 0) {
        $('#single_communication').val(value);
    }
}

function reprocessImage(collegeId,formId,registrationId)
{

    $("#ConfirmPopupArea").css('z-index', 12500);
    $('#confirmTitle').html("Confirm");

    $('#ConfirmMsgBody').html('Are you sure you want to reprocess biometric images of '+ registrationId +'?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
    .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
    e.preventDefault();

    $('#ConfirmPopupArea').modal();
    $('.loader-block-a').show();


    $.ajax({
        url: '/exam/reprocessImage',
        type: 'post',
        dataType: 'json',
        data: {'collegeId':collegeId, 'formId':formId, 'registrationId':registrationId},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () {
            $('div.loader-block-lead-list').show();
        },
        success: function (json) {
            $('.loader-block-a').hide();

            if(typeof json['error'] !== 'undefined' && json['error'] != ''){
                if(json['error'] == 'session_logout') {
                    window.location.reload();
                } else {
                    $('#ConfirmPopupArea').modal('hide');
                    $("#ErrorPopupArea").css('z-index', 12000);
                    alertPopup(json['error'],'error');
                    return false;
                }
            } else {
                $('#ConfirmPopupArea').modal('hide');
                $('#ErrorPopupArea').modal('hide');
                if(typeof json['successMessage'] !== 'undefined' && json['successMessage'] !== '') {
                    alertPopup(json['successMessage'],'success');
                }
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
  });
}



($('#exam-vendor-ishinfosystem')).on('click',function(){
    if($('#exam-vendor-ishinfosystem').prop('checked')==true){
        $('#slot_booking_start_date_level').html('Eligibility Start Date');
        $('#slot_booking_end_date_level').html('Eligibility End Date');
    }else{
        $('#slot_booking_start_date_level').html('Eligibility Start Date <span class="requiredStar">*</span>');
        $('#slot_booking_end_date_level').html('Eligibility End Date <span class="requiredStar">*</span>');
    }

});

($('#exam-vendor-einfosolutions')).on('click',function(){
    if($('#exam-vendor-einfosolutions').prop('checked')==true){
        $('#slot_booking_start_date_level').html('Eligibility Start Date');
        $('#slot_booking_end_date_level').html('Eligibility End Date');
    }else{
        $('#slot_booking_start_date_level').html('Eligibility Start Date <span class="requiredStar">*</span>');
        $('#slot_booking_end_date_level').html('Eligibility End Date <span class="requiredStar">*</span>');
    }

});

function showHideEligibilityDateType(){
//    $('#slot_booking_start_date').datetimepicker({
//        format: 'YYYY/MM/DD'
//    });
//    $('#slot_booking_end_date').datetimepicker({
//        format: 'YYYY/MM/DD'
//    });
//
//    $('#slot_booking_dynamic_fixed_end_date').datetimepicker({
//        format: 'YYYY/MM/DD'
//    });
}

$(document).ready(function(){
    if($('#resultapitype').length>0) {
        $('#resultapitype').trigger('change');
    }
    if($("#examseriescodetype").length>0) {
        $('select[name ="examSeriesCodeType"]').each(function(){
            var value = $(this).val();
            var vendor_id=$(this).attr('vendor_id');
            if(value=='1'){
               $("#"+vendor_id+"Form").find('input[name ="examSeriesCode"]').closest('.formChildNoMargin').hide();
            }else{
                $(this).val('0');
                $(this).trigger("chosen:updated");
                $("#"+vendor_id+"Form").find('select[name ="assignTestFields"]').closest('.formChildNoMargin').hide();
            }
        });
        $('select[name ="examSeriesCodeType"]').on('change',function(){
            var value = $(this).val();
            var vendor_id=$(this).attr('vendor_id');
            if(value=='1'){
               $("#"+vendor_id+"Form").find('select[name ="assignTestFields"]').closest('.formChildNoMargin').show();
               $("#"+vendor_id+"Form").find('input[name ="examSeriesCode"]').closest('.formChildNoMargin').hide();
            }else{
                $("#"+vendor_id+"Form").find('select[name ="assignTestFields"]').closest('.formChildNoMargin').hide();
                $("#"+vendor_id+"Form").find('input[name ="examSeriesCode"]').closest('.formChildNoMargin').show();
            }
        });
    }
});
function getfieldsValue(element){
    var elementVal= $(element).val();
    if(elementVal=='application_stage'){

         $.ajax({
            url:jsVars.FULL_URL+'/exam/getApplicationStages',
            type: 'post',
            dataType: 'html',
            data: {collegeId:jsVars.college_id,formId:jsVars.form_id},
            beforeSend: function () {
                $('.loader-block').show();
            },
            complete: function () {
                $('.loader-block').hide();
            },
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (result) {
                json=JSON.parse(result);

            if (json['status'] !==200) {
                var html = '';
                $(element).closest('.row').find('.updatedfields').html(html);
                if(json['message'] =='session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(json['message'], 'error');
                }
            } else if(json['status']==200 && json['data']==''){
                var html = "<select  name='application_stages[]' multiple='multiple'  class='ifselect form-control sumo_select' id ='application_stages'>\n\
                            </select>";
                $(element).closest('.row').find('.updatedfields').html(html);
                if($('.application_stages').length>0){
                    $('.sumo_select').SumoSelect({placeholder: 'Select Application Stage',search: true, searchText: 'Select Application Stage',csvDispCount:3});
                }
                $(element).closest('.row').find('.updatedfields').css('display','block');
            }else{
              var html = "<select  name='application_stages[]' multiple='multiple'  class='ifselect form-control sumo_select application_stages' id ='application_stages'>";
               $.each(json['data'], function(index, value) {
                    selected = '';

                    html += '<option value="'+index+'" '+selected+'>' + value + '</option>';
                });
                html+='</select>';

                $(element).closest('.row').find('.updatedfields').html(html);
                 if($('.application_stages').length>0){
                    $('.sumo_select').SumoSelect({placeholder: 'Select Application Stage',search: true, searchText: 'Select Application Stage',csvDispCount:3});
                 }
               $(element).closest('.row').find('.updatedfields').css('display','block');
            }

            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

    }else if (elementVal=='payment_approved_on_token'){

        $.ajax({
            url:jsVars.FULL_URL+'/exam/getFeeConfigs',
            type: 'post',
            dataType: 'html',
            data: {collegeId:jsVars.college_id,formId:jsVars.form_id},
            beforeSend: function () {
                $('.loader-block').show();
            },
            complete: function () {
                $('.loader-block').hide();
            },
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (result) {
                json=JSON.parse(result);

            if (json['status'] !==200) {
                var html = '';
                $(element).closest('.row').find('.updatedfields').html(html);
                if(json['message'] =='session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(json['message'], 'error');
                }
            } else if(json['status']==200 && json['data']==''){
                var html = "<select  name='token_fees'  class='form-control token_fees chosen-select' id ='token_fees'></select>";

                $(element).closest('.row').find('.updatedfields').html(html);
                $(element).closest('.row').find('.updatedfields').css('display','block');
            }else{
              var html = "<select  name='token_fees'  class='form-control chosen-select token_fees' id ='token_fees'><option value=''>Select Token Fee</option>";
               $.each(json['data'], function(index, value) {
                    selected = '';

                    html += '<option value="'+index+'" '+selected+'>' + value + '</option>';
                });
                html+='</select>';
                $(element).closest('.row').find('.updatedfields').html(html);
                $(element).closest('.row').find('.updatedfields').css('display','block');
                $('.chosen-select').chosen();;

            }

            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
    else{
           $(element).closest('.row').find('.updatedfields').css('display','none');
    }
}

function cancelSlot(vendor,user_id,clientAuthorizationID){

    var college_id= $("#college_id").val();
    var form_id= $("#form_id").val();
    if(typeof college_id=='undefined' || college_id=='' || college_id=='0' || typeof form_id=='undefined' || form_id=='' || form_id=='0' || typeof vendor=='undefined' || vendor=='' || typeof user_id=='undefined' || user_id=='' || typeof clientAuthorizationID=='undefined' || clientAuthorizationID==''){
        alertPopup1('Select Form and Vendor !', 'error');
        return false;
    }
    $('#viewExamScheduleModal').modal();
    $('.loader-block-a').show();
    $.ajax({
        url: '/exam/load-delete-authorization-popup',
        type: 'post',
        dataType: 'html',
        data: {
            actionType:"Delete",s_college_id:college_id,vendor:vendor,
            user_id:user_id,form_id:form_id,clientAuthorizationID:clientAuthorizationID
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () {
            $('div.loader-block-lead-list').show();
        },
        success: function (html) {
            $('.loader-block-a').hide();
            if(html=='error:session'){
                window.location.reload();
            }
            else {
                $('#viewExamScheduleModal .modal-dialog').css('width','500px');
                $("#viewExamScheduleModal").css('z-index', 11001);
                $('#showExamScheduleList').removeClass('text-center').addClass('text-left');
                $('#showExamScheduleList').html(html);
                var heading='';
                heading = "Cancel/Delete Slot";
                $('#viewScheduleModalLabel').html(heading);
                if($('#deleteAuthorizationForm .chosen-select').length >0) {
                    $('.chosen-select').chosen();
                    $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
                    $('.chosen-select').trigger('chosen:updated');
                }
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

}

function deleteSlot(){

    if($("#idhash").val()=='undefined' || $("#idhash").val()=='' ){
        alertPopup("invalid request",'error');
        return false;
    }

    var actionType = $("#authorizationTransactionType").val();
    var deleteFrom = $("#deleteFrom").val();
    var authorizationRemark = $("#authorization_remark").val();
    $('#remark_error').text("");
    if(typeof actionType=='undefined' || actionType=='' || actionType==null) {
        $('#remark_error').text('Please select Transaction Type');
        $("#confirmNo").trigger('click');
        return false;
    }
    if(typeof deleteFrom=='undefined' || deleteFrom=='' || deleteFrom==null) {
        $('#remark_error').text('Please select Delete From');
        $("#confirmNo").trigger('click');
        return false;
    }
    if(typeof authorizationRemark=='undefined' || authorizationRemark=='' || authorizationRemark==null) {
        $('#remark_error').text('Please enter remark.');
        $("#confirmNo").trigger('click');
        return false;
    }

    $("#confirmYes").text("Confirm");
    $("#confirmNo").text("Cancel");
    $('#ConfirmMsgBody').html("Are you sure you want to cancel slot?</br>This will lead to deletion of the record from the system.");
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
    .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $('#ConfirmPopupArea').modal();
        $('.loader-block-a').show();
        var data=$("Form#deleteAuthorizationForm").serializeArray();
        $.ajax({
                url:jsVars.FULL_URL+'/exam/cancelSlot',
                type: 'post',
                dataType: 'json',
                data: data,
                beforeSend: function () {
                    $('.loader-block').show();
                },
                complete: function () {
                    $('.loader-block').hide();
                },
                headers: {
                    "X-CSRF-Token": jsVars._csrfToken
                },
                success: function (json) {
                    $('.loader-block-a').hide();
                    if (json['status'] != 200 || (typeof json['error'] !== 'undefined' && json['error'] != '')) {
                        if (json['error'] == 'session') {
                            window.location.reload();
                        } else {
                            $('#ConfirmPopupArea').modal('hide');
                            $("#ErrorPopupArea").css('z-index', 12000);
                            alertPopup(json['message'], 'error');
                            return false;
                        }
                    } else {
                        loadMoreEADLogs('reset');
                        $('#ConfirmPopupArea').modal('hide');
                        $('#ErrorPopupArea').modal('hide');
                        $('#viewExamScheduleModal').modal('hide');
                        if (typeof json['status'] !== 'undefined' && json['status'] == 200) {
                            alertPopup('EAD data deleted successfully.', 'success');
                        }
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
        });

    });

    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
    .off('click', '#confirmNo').one('click', '#confirmNo', function (e) {
        $('.closemodalclass').trigger('click');
        loadMoreEADLogs('reset');
    });
}
function ValidateIPaddress(inputText)
{
    var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (inputText.match(ipformat))
        {return true;}
    else
        {return false;}
}

function validateEmail(x) {
    var atpos = x.indexOf("@");
    var dotpos = x.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
        return false;
    }
    return true;
}

function retakeAdmitCard(){
    var total_retake = $('#total_retake').val();
    var instituteId = $('#instituteId').val();
    if(typeof total_retake =='undefined' || total_retake=='' || typeof instituteId=='undefined' || instituteId=='' || instituteId=='0'){
        return false;
    }
    $.ajax({
        url:jsVars.FULL_URL+'/exam/retakeAdmitCard',
        type: 'post',
        dataType: 'html',
        data:{instituteId:instituteId,total_retake:total_retake},
        beforeSend: function () {
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if (json['status'] != 200 || (typeof json['error'] !== 'undefined' && json['error'] != '')) {
                if (json['error'] == 'session_logout' || json['error'] == 'invaid_req') {
                    window.location.reload();
                } else {
                    $("#actionDivId_retake_admit").html(json);
                    $('.chosen-select').chosen();
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
function updateOperatorScore(type, container_name, selected) {

    if (typeof selected === 'undefined') {
        selected = '';
    }
    var curFieldName = container_name.replace('[expression]', '[ifField]');
    var selectedField = jQuery("[name='" + curFieldName + "']").val();
    var html = '<option value="">Select Condition</option>';
    var operator = {
        'dropdown': {
            'is_equal_to': 'Is Equal To',
            'is_not_equal_to': 'Is Not Equal To',
            'is_not_empty': 'Is Not Empty',
            'is_empty': 'Is Empty',
            'less_than': 'Less Than (<)',
            'less_than_equal': 'Less Than & Equal To (<=)',
            'greater_than': 'Greater Than (>)',
            'greater_than_equal': 'Greater Than & Equal To (>=)'
        },
        'predefined_dropdown': {
            'is_equal_to': 'Is Equal To',
            'is_not_equal_to': 'Is Not Equal To',
            'is_not_empty': 'Is Not Empty',
            'is_empty': 'Is Empty',
            'less_than': 'Less Than (<)',
            'less_than_equal': 'Less Than & Equal To (<=)',
            'greater_than': 'Greater Than (>)',
            'greater_than_equal': 'Greater Than & Equal To (>=)'
        },
        'text': {
            'is_equal_to': 'Is Equal To',
            'is_not_equal_to': 'Is Not Equal To',
            'is_not_empty': 'Is Not Empty',
            'is_empty': 'Is Empty',
            'less_than': 'Less Than (<)',
            'less_than_equal': 'Less Than & Equal To (<=)',
            'greater_than': 'Greater Than (>)',
            'greater_than_equal': 'Greater Than & Equal To (>=)'
        },
        'number_range': {
            'is_equal_to': 'Is Equal To',
            'is_not_equal_to': 'Is Not Equal To',
            'is_not_empty': 'Is Not Empty',
            'is_empty': 'Is Empty',
            'less_than': 'Less Than (<)',
            'less_than_equal': 'Less Than & Equal To (<=)',
            'greater_than': 'Greater Than (>)',
            'greater_than_equal': 'Greater Than & Equal To (>=)'
        },
        'date': {
            'between': 'Between',
            'before': 'Before',
            'after': 'After',
            'not_empty': 'Is not empty',
            'empty': 'Is empty'
        }
    };
    if (typeof type !== 'undefined' && ['dropdown', 'text', 'number_range','date','predefined_dropdown'].indexOf(type) > -1) {
        for (var lkey in operator[type]) {
            html += '<option value="' + lkey + '">' + operator[type][lkey] + '</option>';
        }
    }
    jQuery("[name='" + container_name + "']").html(html);
    jQuery("[name='" + container_name + "']").val(selected);
    jQuery('.chosen-select').chosen();
}


function checkDependentFieldScore(field, currentObj, type, selected){
    if(typeof field === 'undefined' || field=== ''){
        return false;
    }

    if(typeof selected === 'undefined'){
        selected = '';
    }
    var field_data = {};
    jQuery(currentObj).parents('.logic_block_div').find('select.sel_value').each(function(){
        var prev_field = jQuery(this).data('field');
        //var value = jQuery(this).data('value');
        var selected = $(this).find('option:selected', this);
        var selectedData = [];
        selected.each(function() {
            selectedData.push($(this).data('value'));
        });
        field_data[prev_field]  = selectedData;
    });

    var form_id = $("#formId").val();
    var collegeId = $("#collegeId").val();

    field_data['current_field'] = field;
    field_data['form_id']       = form_id;
    field_data['collegeId']       = collegeId;
    jQuery.ajax({
        url: jsVars.FULL_URL+'/users/get-check-dependent-field',
        type: 'post',
        dataType: 'json',
        async: false,
        data: field_data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            if (json['redirect']) {
                window.location.href = json['redirect'];
            } else if (json['error']) {
                alertPopup(json['error'], 'error');
            } else if (typeof json['success'] != 'undefined' && json['success'] == 200) {
                if(Object.keys(json['option']).length){
                    var html = '';
                    var selectedOption="";
                    for (var lkey in json['option']) {
                        selectedOption="";
                        if(selected.indexOf(json['option'][lkey])!== -1){
                            selectedOption=" selected ";
                        }
//                        if(type === 'predefined_dropdown' || type === 'dropdown'){
//                           html += '<option value="' + lkey + ";;;"+json['option'][lkey]+'"'+selectedOption+'>' + json['option'][lkey] + '</option>';
//                        }else{
//                            html += '<option value="' + lkey + '"'+selectedOption+'>' + json['option'][lkey] + '</option>';
//                        }
                        html += '<option value="' + json['option'][lkey] + '" data-value="' + lkey + ";;;"+json['option'][lkey]+'" '+selectedOption+'>' + json['option'][lkey] + '</option>';
                    }

                    if(jQuery(currentObj).parents('.logic_block_div').find('.' + field).length > 0){
                        jQuery(currentObj).parents('.logic_block_div').find('.' + field).html(html);
                    }
                }
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$(document).on('change', "select.sel_value", function () {
    var ct = $(this).data('ct');
    var field = $(this).data('field');
    var objValueFieldName =  $(this).attr('name');
    var objElemFieldName =  objValueFieldName.replace('[value][]', '[ifField]');
    var dependentField = $("[name='" + objElemFieldName + "']").find(":selected").data('dependentgroup');
    var objElemVal = $("[name='" + objElemFieldName + "']").find(":selected").data('value');
    var type  = '';
    var arr = objElemVal.split("||");
    if (arr.length > 2) {
        type = arr[1];
    }
    if(typeof field === 'undefined' || field === ''){
        return;
    }
    if(typeof dependentField !== 'undefined' && dependentField !== '' ){

        var field_data = {};
        var form_id = $("#formId").val();
        var collegeId = $("#collegeId").val();
        var selected = $(this).find('option:selected', this);
        var selectedData = [];
        selected.each(function() {
            selectedData.push($(this).data('value'));
        });
        field_data[field]           = selectedData;
        field_data['current_field'] = field;
        field_data['form_id']       = form_id;
        field_data['collegeId']       = collegeId;
        field_data['find_value_type']= 'next';

        jQuery.ajax({
            url: jsVars.FULL_URL+'/users/get-check-dependent-field',
            type: 'post',
            dataType: 'json',
            async: false,
            data: field_data,
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            success: function (json) {
                if (json['redirect']) {
                    window.location.href = json['redirect'];
                } else if (json['error']) {
                    alertPopup(json['error'], 'error');
                } else if (typeof json['success'] !== 'undefined' && json['success'] === 200) {

                    var html = '';
                    if(Object.keys(json['option']).length){
                        for (var lkey in json['option']) {
//                            if(type === 'predefined_dropdown' || type === 'dropdown'){
//                                html += '<option value="' + lkey +";;;"+json['option'][lkey]+ '">' + json['option'][lkey] + '</option>';
//                            }else{
//                                html += '<option value="' + lkey + '">' + json['option'][lkey] + '</option>';
//                            }
                            html += '<option value="' + json['option'][lkey] + '" data-value="' + lkey +";;;"+json['option'][lkey]+ '">' + json['option'][lkey] + '</option>';
                        }
                    }
                    if(typeof json['child_field'] !== 'undefined' && json['child_field'] != '') {
                       if(jQuery('.'+field).parents('.logic_block_div').find('.'+json['child_field']).length > 0){
                            var childfield = json['child_field'];
                            jQuery('.'+field).parents('.logic_block_div').find('.'+childfield).html(html);
                            jQuery('.'+field).parents('.logic_block_div').find('.'+childfield)[0].sumo.reload();
                        }
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
});

//get All Registration Dependent Child Values
function getChildtaxonomyValuesScore(html_field_id, cur_val_name, label_name , refresh ){

    if(typeof refresh === 'undefined'){
        refresh = '';
    }
    var parentFieldName = '';
    var childType = '';
    var curFieldName =  cur_val_name.replace('[value][]', '[ifField]');
    if($.inArray(html_field_id,['ud|state_id','ud|city_id','ud|district_id','ud|specialization_id']) >= 0 ){

        if(html_field_id === 'ud|state_id'){
            parentFieldName = 'country_id';
            childType = 'State';
        }else if(html_field_id === 'ud|district_id' ){
            $("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.ud\\|city_id').html('');
            if(refresh === 'true'){
                $("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.ud\\|city_id')[0].sumo.reload();
            }
            parentFieldName = 'state_id';
            childType = 'District';
        }else if(html_field_id === 'ud|city_id'){
            var isDistrictEnable = $("[name='" + curFieldName + "']").find('option[data-input_id="district_id"]').length;
            if($("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.ud\\|district_id').length || isDistrictEnable !== 0){
                parentFieldName = 'district_id';
            }else{
                parentFieldName = 'state_id';
            }
            childType = 'City';
        }else if(html_field_id === 'ud|specialization_id'){
            parentFieldName = 'course_id';
            childType = 'Specialisation';
        }
        /// load value from
        if($("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.ud\\|'+parentFieldName).length){
            var selectedEvents = $("[name='" + cur_val_name + "']").parents('div.block-repeat').find('.ud\\|'+parentFieldName).val();
            var html = getSelectedChildTaxonomy(selectedEvents,childType);
                html = '<option value="0">' + label_name +  jsVars.notAvailableText+' </option>' + html;
            $("[name='" + cur_val_name + "']").html(html);
            if(refresh === 'true'){
                $("[name='" + cur_val_name + "']")[0].sumo.reload();
            }
        }
    }
}



function buildAutomationCreateInput(currentObj, i, innerBlockCounter, selectedValue, typeselected,module){
if (typeof typeselected === 'undefined') {
        typeselected = '';
    }
    currentObj = $( "#retakefields" )[ 0 ] ;
    $(currentObj).parent().parent().find('.lead_error').html('');
    $(currentObj).parent().parent().find('.dependent_info').html('');

    var cur_elem_name = $(currentObj).attr('name');
    var labelname = $(currentObj).find(':selected').data('label_name');
    var label_name = $(currentObj).find(':selected').data('label_name');
    var dependentField = $(currentObj).find(':selected').data('dependentgroup');
    var parentFieldId = $(currentObj).find(':selected').data('parent');
    var element = $(currentObj).find('option:selected');
    var childFieldId = element.attr("data-child");
    var cur_val_name = cur_elem_name.replace('[ifField]', '[value][]');
    var cur_type_name = cur_elem_name.replace('[ifField]', '[expression]');
    var InputId = 'var InputId' //$(currentObj).attr('id');
    var key_source = $(currentObj).data('key_source');
    var value_field = element.attr("data-value");
    if(typeof value_field === 'undefined') {
    $("[name='" + cur_val_name + "']").parents('.selectValueDivClass>div').hide();
        return false;
    }
    if(typeof labelname === 'undefined') {
        labelname = 'Select an Option';
    }

    var arr = value_field.split("||");
    var html = '';
    var type = "";
    var class_date = '';
    var checkDependentFieldVal = 1;
    if(arr[2] !== '[]'){
        checkDependentFieldVal = 0;
    }
    var field_name = 'select_value['+i+']['+innerBlockCounter+']';
    var selValue = '';
    if(typeof selectedValue !== 'undefined') {
        selValue = selectedValue;
        var newSelectVal = selectedValue.split(';;;')[1];
        if(typeof newSelectVal !== 'undefined') {
            newSelectVal = '["'+newSelectVal;
            selValue = newSelectVal;
        }
    }

    if(typeof parentFieldId !== 'undefined' && parentFieldId !== '' ){
        //for fixed dependent fields
        var tmp = $(currentObj).find('option[data-input_id="'+parentFieldId+'"]').text();
        if((typeof tmp ==='undefined' || tmp === '' ) && parentFieldId === 'district_id'){
            tmp = $(currentObj).find('option[data-input_id="state_id"]').text();
        }
        if(typeof tmp !=='undefined' && tmp !== ''){
            if(checkDependentFieldVal === 1){
                $(currentObj).parent().parent().find('.dependent_info').html('This field is dependent on '+tmp);
            }
        }
    }else if(typeof dependentField !== 'undefined' && dependentField !== '' ){
        //form fields dependent
        var curInputId = $(currentObj).find(':selected').data('input_id');
        var tmp = $(currentObj).find('option[data-child="'+curInputId+'"]').text();
        if(typeof tmp !=='undefined' && tmp !== ''){
            if(checkDependentFieldVal === 1){
                setTimeout(function() {
                    $(currentObj).parent().parent().find('.dependent_info').html('This field is dependent on '+tmp);
                  }, 5);

            }
        }
    }

    if (arr.length > 2) {
        var type = arr[1];
        var val_json = arr[2];
        var html_field_id = '';
        // for not break ajax on created by, ID CreatedBySelect
        if (arr[0].match(/created_by/i)) {
            html_field_id = 'CreatedBySelect';
        } else if (arr[0].match(/UD\|city_id/i)) {
            html_field_id = 'registerCityID';
        } else {
            html_field_id = arr[0];
        }
        if(type === "select"){
            type = "dropdown";
        }
        if (type === "dropdown" || type === "predefined_dropdown") {
            if ('UD|state_id' == html_field_id) {
                html = "<select data-key_source=" + InputId + " onchange = 'return GetChildByMachineKey(this.value,\"registerCityID\",\"City\");' class='chosen-select sel_value' name='" + field_name + "' id='" + html_field_id + "'>";
            } else if ('s_lead_status' == html_field_id) {
                html = "<select data-key_source=" + InputId + " multiple='multiple' class='form-control sel_value' name='" + field_name + "' id='" + html_field_id + "' data-placeholder='Select lead status' placeholder='Select lead status'>";
                sls = true;
            }   else if('application_stage' === html_field_id) {
                var closestDiv = $(currentObj).closest('.block-repeat');
                if($(".sel_value.application_sub_stage",closestDiv).length > 0){
                    html = "<select  placeholder='Select an Option' class='sumo_select sel_value " + html_field_id + "' name='" + cur_val_name + "' data-field='"+html_field_id+"' data-ct='score'>";
                }else{
                    html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select sel_value " + html_field_id + "' name='" + cur_val_name + "' data-field='"+html_field_id+"' checkDependentFieldVal='"+checkDependentFieldVal+"' data-ct=='score'>";
                }
            } else {
                html = "<select multiple='multiple' placeholder='Select an Option' class='sumo_select sel_value " + html_field_id + "' name='" + cur_val_name + "' data-field='"+html_field_id+"' checkDependentFieldVal='"+checkDependentFieldVal+"' data-ct='score'>";
            }

            if(html_field_id == 'application_sub_stage'){
                    var currentDiv  = $(currentObj).closest('.logic_block_div');
                    if($(".sel_value."+parentFieldId,currentDiv).length > 0 && $("select.sel_value."+parentFieldId,currentDiv).prop("multiple")){
                    }
                    var selected = $(".sel_value."+parentFieldId,currentDiv).find('option:selected', this);
                    var selectedStage = [];
                    selected.each(function() {
                        selectedStage.push($(this).data('value'));
                    });
                    if(selectedStage){
                      getSubstage(selectedStage,$(".sel_value."+parentFieldId,currentDiv),[],selValue);
                    }
            }

//            if ('s_lead_status' != html_field_id && 'show_campaigns_in' != html_field_id) {
//                html += '<option value="">' + labelname + '</option>';
//            }

            obj_json = JSON.parse(val_json);
            for (var key in obj_json) {
//                if(type == "predefined_dropdown") {
                    var prfixDropdownKey1 = key + ';;;' + obj_json[key];
                    var prfixDropdownKey = obj_json[key] ;
//                } else {
//                    var prfixDropdownKey = key;
//                }
                var prfixDropdownVal = obj_json[key];

                var selected = '';
                if(selValue == prfixDropdownKey) {
                    selected = 'selected=selected';
                }

                if(html_field_id === 'application_stage'){
                    html += "<option value=\"" + key + "\" data-value=\"" + key + "\" " +selected+" >" + prfixDropdownVal + "</option>";
                }else{
                    html += "<option value=\"" + prfixDropdownKey + "\" " +selected+" data-value=\"" +prfixDropdownKey1+ "\" >" + prfixDropdownVal + "</option>";
                }
            }
            html += "</select>";
            if(type === 'predefined_dropdown'){
                updateOperatorScore('predefined_dropdown', cur_type_name, typeselected);
            }else{
                updateOperatorScore('dropdown', cur_type_name, typeselected);
            }
        } else if (type == "date") {
            if (jQuery("[name='" + cur_type_name + "']").val() === 'between') {
                class_date = "date_time_rangepicker_report";
            } else {
                class_date = "datetimepicker_report";
            }

            html = "<input type='text' class='form-control sel_value " + class_date + "' name='" + cur_val_name + "' value='' readonly='readonly' placeholder='" + labelname + "' data-id='" + html_field_id + "' data-field='"+html_field_id+"'>";
            updateOperatorScore('date', cur_type_name, typeselected);

        } else {
            html = "<input type='text' class='form-control sel_value' name='" + cur_val_name + "' value='' placeholder=' Enter Value' data-id='" + html_field_id + "' data-field='"+html_field_id+"'>";
            if(type === "number_range"){
                updateOperatorScore('number_range', cur_type_name, typeselected);
            }else{
                updateOperatorScore('text', cur_type_name, typeselected);
            }
        }
    } else {
        html = "<input type='text' class='form-control sel_value' name='" + cur_val_name + "' value='" + selValue + "' placeholder='Enter Value' data-field='"+html_field_id+"'>";
        updateOperatorScore('text', cur_type_name, typeselected);
        if(type === "number_range"){
            updateOperatorScore('number_range', cur_type_name, typeselected);
        }else{
            updateOperatorScore('text', cur_type_name, typeselected);
        }
    }

    // finally show the field in DOM
    if (html) {

        if (typeof type !== "undefined" && type === 'date') {
            html = '<div class="dateFormGroup "><div class="iconDate"><i aria-hidden="true" class="fa fa-calendar-check-o"></i></div><div class="input text">' + html + '</div></div>';
        } else {
            html = '<div class="">' + html + '</div>';
        }
        var finalhtml = html;

        if ($("[name='" + cur_val_name + "']").parents('.selectValueDivClass').length > 0) {
            $("[name='" + cur_val_name + "']").parents('.selectValueDivClass').html(finalhtml);
           // $("[name='" + cur_val_name + "']")[0].sumo.reload();
        }
    }

     // hide value div if change is made
    $("[name='" + cur_val_name + "']").parents('.selectValueDivClass>div').show();

    if(checkDependentFieldVal === 1){
        //get All Registration Dependent Child Values
        getChildtaxonomyValuesScore(html_field_id, cur_val_name, label_name);
    }

    if ((type === "dropdown" || type === "predefined_dropdown") && selValue !== '') {
         $("[name='" + cur_val_name + "']").val(JSON.parse(selValue));
    }else if(selValue !== ''){
        selected = JSON.parse(selValue);
        if (typeof selected != 'object') {
            selected = [selected];
        }
        $.each(selected, function (i, e) {
            //("[name='" + cur_val_name + "']")[0].sumo.selectItem(e);
            $("[name='" + cur_val_name + "']").val(e);
        });

    }

    $('.chosen-select').chosen();
    $('.chosen-select').trigger('chosen:updated');
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});


    if(selValue === ''){
    // remove hidden field if change is made
        $("[name='" + cur_val_name + "']").parents('div.condition_div').find('.sel_value_hidden').remove();
    }


     if(module === 'renderCtp'){
            $("[name='" + cur_val_name + "']").val(selected);
        }

    if (type === "date") {
        LoadDateTimeRangepicker();
          $("[name='" + cur_val_name + "']").removeClass('daterangepicker_report').addClass('datepicker_report');

    }
     LoadReportDatepicker();
    LoadReportDateRangepicker();
    //&& dependentField.indexOf('fixed_') !== 0  //commented fixed
    if(typeof dependentField !== 'undefined' && dependentField !== ''){
        checkDependentFieldScore(html_field_id,currentObj,type,selValue);
    }

    $('select.sumo_select').SumoSelect({placeholder: labelname, search: true, searchText:labelname, captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
     //$(".sumo_select")[0].sumo.reload();
}
function renderJson(vendorname,typeflag) {
    try {
      var input = eval('(' + $('#templateFormatTextArea_'+vendorname).val() + ')');
    }
    catch (error) {
        $('#json-renderer_'+vendorname).hide();
        $('#add_result_mapping_block_'+vendorname).hide();
        $('#result_'+vendorname).html(error);
        $('#result_'+vendorname).removeClass();
        $('#result_'+vendorname).addClass("alert alert-danger");
      //return alert("Cannot eval JSON: " + error);
      return false;
    }
    var options = {
      collapsed: true,
      rootCollapsable: false,
      withQuotes: false,
      withLinks: false
    };
    $('#json-renderer_'+vendorname).show();
    $('#json-renderer_'+vendorname).jsonViewer(input, options);
    $('#result_'+vendorname).removeClass();
    $('#result_'+vendorname).html("<i class='fa fa-check' aria-hidden='true'></i>&nbsp;JSON is valid!");
    $('#result_'+vendorname).addClass("alert alert-success");
    $('#add_result_mapping_block_'+vendorname).show();
    //code start for debug
     jQuery.ajax({
            url: jsVars.FULL_URL+'/exam/result-mapping',
            type: 'post',
            dataType: 'json',
            async: false,
            data: input,
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            success: function (json) {
                if (json['redirect']) {
                    window.location.href = json['redirect'];
                } else if (json['error']) {
                    alertPopup(json['error'], 'error');
                } else if (typeof json['success'] !== 'undefined' && json['success'] === 200) {
                    //console.log(json['data']);
                    var html = '';
                    var parsedjson=JSON.stringify(json);
                            $('#add_result_mapping_condition_'+vendorname).find('.resultMappingkeys_'+vendorname).each(function(){
                                var sel_val=$(this).val();
                                var jsonvalue = '<option selected="selected" value="">Select Fields</option>';
                                html += '<option value="" >Select fields</option>';
                                $.each(json.data,function(index, value){
                                    if(sel_val!="" && sel_val==index){
                                         jsonvalue += '<option value="'+index+'" selected="selected" >' + index + '</option>';
                                    }else{
                                         jsonvalue += '<option value="'+index+'" >' + index + '</option>';
                                    }
                                });
                                $(this).html(jsonvalue);
                                //$(this)[0].sumo.reload();
                                $(this).trigger("chosen:updated");
                            });
                            $('#resultMappingParsedJson_'+vendorname).val(parsedjson);



                }
            },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
        });
    //code end here
  }


    function addMoreResultMappingBlockConditionAjax(vendorname) {
    var countVal= $(".retake_"+vendorname).length;
    var college_id  = jsVars.college_id;
    var form_id = jsVars.form_id;
    var adminFieldList = jsVars.adminFieldList;
    var dbData = jsVars.dbData;
    var resultMappingParsedJson=$('#resultMappingParsedJson_'+vendorname).val();
    var totalincrementalcounter=$('#totalcounter_'+vendorname).val();
    if(college_id === '' || college_id === 0 || college_id === '0'){
        $('#college_error').html('<small class="text-danger">Please Select Institute</small>');
        return false;
    }
    $.ajax({
        url: '/exam/loadResultMappingLogicBlock' ,
        type: 'post',
        data: {form_id: form_id, 'college_id': college_id, 'dbData': dbData, 'adminFieldList': adminFieldList, 'resultMappingParsedJson': resultMappingParsedJson,'vendorname':vendorname,'totalincrementalcounter':totalincrementalcounter,'countVal':countVal},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            hideLoader();
        },
        success: function (Html) {
            //alert(Html);
            if (Html === 'session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (Html === 'key_error') {
                alert('Parameter missing!');
            } else if (Html === 'value_error') {
                alert('Parameter value missing!');
            } else if (Html === 'unable') {
                alert('Unable to process request!');
            } else {
                   $("#add_result_mapping_condition_"+vendorname).append(Html);
                   $('.chosen-select').chosen();
                   $('#totalcounter_'+vendorname).val(totalincrementalcounter+1);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}
function confirmDeleteResultMapping(elem, type) {
    $("#ConfirmPopupArea").css('z-index',1111111);
	$(".modal-backdrop").css('z-index', 1111110);
    $('#ConfirmMsgBody').html('Do you want to delete ' + type + '?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
             .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                e.preventDefault();
                    removeApplConditionScoreMapping(elem);
                $('#ConfirmPopupArea').modal('hide');
            });
    return false;
}
function removeApplConditionScoreMapping(elem) {
    $(elem).closest('.mapping-card').remove();
    return false;
}

/**
 *
 * @param {type} type
 * @param {type} container_name
 * @param {type} selected
 * @returns {undefined}
 */

 function createAdminFieldsByPopUp(type){
    if(typeof type=='undefined'){
        type='';
    }
    $.ajax({
       url: '/exam/create-admin-fields-by-pop-up',
       type: 'post',
       dataType: 'html',
       data:{'type':type},
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       success: function (response) {
        var responseObject = $.parseJSON(response);
          if(responseObject.status===1){
            $('#idValue').val(type);
                $('#showAdminFile').html(responseObject.data.html);
                $('#addAdminField').modal('show');
          }else{
            if (responseObject.message === 'session'){
                // location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else{
                alertPopup(responseObject.message, 'error');
            }
        }

       },
       error: function (xhr, ajaxOptions, thrownError) {
        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
    },
   });
}

 function showStudentsData(formId,userId,collegeId,eventType){
     $.ajax({
        url: '/exam/show-students-data/',
        type: 'post',
        dataType: 'html',
        data: {'collegeId':collegeId,'formId':formId, 'userId':userId,'eventType':eventType},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (response) {
           $('#EADPreviewModal').modal('hide');
           $('#showStdData').html(response);
           $('#dataPreview').modal('show');
           $('#dataPreview').on('hidden.bs.modal', function (e) {
               $('#EADPreviewModal').modal('show');
          })
        }
    });
 }

 function createAdminFields() {

    jQuery.ajax({
        url: '/exam/create-admin-fields',
        type: 'post',
        data: $('#createAdminFields').serialize(),
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            var ref_val = $('#idValue').val();
            if(typeof ref_val=='undefined'){
                ref_val='';
            }
           
            if(json.status===1){
              
              var currenSelectBox=$(this);
                $('#addAdminField').modal('hide');
                alertPopup("Field saved successfully.","success");
           
                $('.mapping-card').find('#'+ref_val).each(function(){
                    var jsonvalue = '<option value="">Select Fields</option>';
    
                    if(ref_val!=''){
                        $.each(json.data,function(index, value){
                            if(index!="undefined" && json.field['fieldkey']!="undefined" || json.field['fieldkey']==index){
                                jsonvalue += '<option value="'+index+'" selected="selected">' + value + '</option>';
                                jsonvalue1 = '<option value="'+index+'" >' + value + '</option>';
                            }else{
                                jsonvalue += '<option value="'+index+'" >' + value + '</option>';
                            }

                        });
                    }
                    // jsonvalue += '<option value="open_addscorcard_popup">Add New Fields</option>';
                    jsonvalue1 += '<option value="open_addscorcard_popup">Add New Fields</option>';
                    $(this).html(jsonvalue);
                    $(this).trigger("chosen:updated");
                    
                });
                var allSelect = $('.show-admin-fields');
                    $.each(allSelect,function (index,value){
                        if(ref_val != $(value).attr('id')){
                            $(value).append(jsonvalue1);
                        }
                        var selectId = $(value).attr("id");
                        $("#"+selectId).trigger("chosen:updated");
                    });
                    
            }
            if(json.status===0){
                if(json.validationErrors.field_name!=undefined && json.validationErrors.field_name['_empty']!=undefined){
                    $('#field_name_error').html('Please enter field name.');
                }else if(json.validationErrors.field_name!= undefined && json.validationErrors.field_name.notUnique!=''){
                    $('#field_name_error').html('This field name is already present.');
                }else{
                    $('#field_name_error').html('');
                }
                if(json.validationErrors.field_label != undefined && json.validationErrors.field_label['_empty']!=undefined){
                    $('#field_label_error').html('Please select field lable.');
                }else{
                    $('#field_label_error').html('');
                }
                if(json.validationErrors.field_type!=undefined && json.validationErrors.field_type['_empty']!=undefined){
                    $('#field_type_error').html('Please select field type.');
                }else{
                    $('#field_type_error').html('');
                }
                if(json.validationErrors.date_format!= undefined && json.validationErrors.date_format[0]!=undefined){
                    $('#field_validations_date_format_error').html('Please select date format.');
                }else{
                    $('#field_validations_date_format_error').html('');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getadminfieldsfromDropdown(context){
    var value=$(context).val();
    var selc_class= $(context).attr('id');
    if(value ==''){
        return false;
    }
    if(value=='open_addscorcard_popup'){
        createAdminFieldsByPopUp(selc_class);
        $('#content').css('z-index', 'unset');
    }
}

function getExamInformationBlock() {
    $.ajax({
        url: '/exam/getExamInformationBlock' ,
        type: 'post',
        data: '',
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            hideLoader();
        },
        success: function (Html) {
            if (Html === 'session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (Html === 'key_error') {
                alert('Parameter missing!');
            } else if (Html === 'value_error') {
                alert('Parameter value missing!');
            } else if (Html === 'unable') {
                alert('Unable to process request!');
            } else {
                   $("#eiWiseDate").append(Html);
                   $('.dateinput').datetimepicker({format: 'YYYY/MM/DD HH:mm:ss', viewMode: 'years'});
                   $('.chosen-select').chosen();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

function confirmDeleteExamInformationBlock(elem, type) {
    $("#ConfirmPopupArea").css('z-index',1111111);
$(".modal-backdrop").css('z-index', 1111110);
    $('#ConfirmMsgBody').html('Do you want to delete ' + type + '?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
             .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                e.preventDefault();
                removeExamBlock(elem);
                $('#ConfirmPopupArea').modal('hide');
            });
    return false;
}

function removeExamBlock(elem) {
    $(elem).closest('.exam-information-block').remove();
    return false;
}

function showHideVendorVersion(vendorName){

    var exam_vendor=$('.exam_vendor').val();
         
    if (jQuery.inArray('wheebox', exam_vendor)!== -1) {
        $('.vendor_version_wheebox').show();
    }else{
        $('.vendor_version_wheebox').hide();
    }
    if(jQuery.inArray('cocubes', exam_vendor)!== -1){
        $('.vendor_version_cocubes').show();
    }else{
        $('.vendor_version_cocubes').hide();
    }

}

function defaultSelectedGraphValue(){

   var data= [...document.querySelector("#examGraphEventListID").options].map( opt => opt.value);
   console.log(data);
   var selectedValue = [data[1],data[3],data[4],data[5],data[6],data[11]];
   var check=[1,3,4,5,6,11];

            $.each(selectedValue, function(key,value){
                $("#examGraphEventListID option[value='" + value + "']").prop("selected","selected" );
                $("#examGraphEventListID option[value='" + value + "']").attr("disabled", 'disabled');
                $("#examGraphEventListID option[value='" + value + "']").addClass('notactive');
                $('#examGraphEventListID').trigger("chosen:updated");
            });
            $.each(check, function(key,values){
                // $('.search-choice-close[data-option-array-index="'+values+'"]').remove();
                
            });
}

function showExamGraphBox(){
    $('#actionId_exam_graph').prop('checked', true);
    $('#actionId_exam_graph').prop('readonly', true);
     if($('#actionId_exam_graph:checked').length){
     $('#actionId_exam_graph').attr('readonly',true); // On Load, should it be read only?
     }
    $('#actionDivId_exam_graph').show();
}

