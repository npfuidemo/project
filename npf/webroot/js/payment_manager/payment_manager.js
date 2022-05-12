var PaymentManagerPage = 1;
var installmentDetailsArr;
$(document).ready(function () {
    $(".erroralert").delay(5000).slideUp(300);
    $(".successalert").delay(5000).slideUp(300);

    $('#seacrhList').attr('onclick', 'LoadMorePaymentConfig("reset")');

    bindPaymentAjaxCall();

    $('.daterangepicker_fee').daterangepicker({
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
        opens: 'left',
        //drops: 'up',
    }, function (start, end, label) {
        //console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
    });

    $('.daterangepicker_fee').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
    });

    $('.daterangepicker_fee').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });

    showHideSearchBox();
    $("#form_id").change(function () {
        showHideSearchBox();
    });

    var defaultCollegeId = $('#college_id').val();
    if (defaultCollegeId != '' || defaultCollegeId != '0') {
        getAllPaymentMethod(defaultCollegeId);
        loadDiscountFilter(defaultCollegeId);
    }
    if (defaultCollegeId == 524) {
        $("#search_sent_university_div").show();
    } else {
        $("#search_sent_university_div").hide();
    }
});

function showHideSearchBox() {
    $("#search_application_div").hide();
    $("#search_application").val('');
    if (typeof jsVars.searchApplicationNo != "undefined" && jsVars.searchApplicationNo != "") {
        $("#search_application").val(jsVars.searchApplicationNo);
    }
    if ($("#form_id").val() !== '' && $("#form_id").val() !== '0' && $("#form_id").val() !== null) {
        $("#search_application_div").show();
    }
}

function LoadMorePaymentConfig(type, module) {
    $(".lead_error").html('');
//    if($('#college_id').val() == '' || $('#college_id').val() == '0' ){
//        $('#college_error').html('<small class="text-danger">Please Select Institute</small>');
//        return false;
//    }

    if (type == 'reset') {
        if (typeof module === 'undefined' || module !== 'sorting') {
            $("#sort_options").val('');
        }
        PaymentManagerPage = 1;
//        checkPayConfig();
        $("#search-field-error").hide();
        if ($.trim($('#search_common').val()) != '' && $.trim($('#search_by_field').val()) == '') {
            $("#search-field-error").text("Please select field");
            $("#search-field-error").show();
            $('.offCanvasModal').modal('hide');
            return false;
        } else {
            $("#search-field-error").text("");
            $("#search-field-error").hide();
        }
        if($.trim($('#search_common').val()) !== '') {
            if(typeof jsVars.maximumEmailMobileSearch !== 'undefined') {
                var splitText = $.trim($('#search_common').val()).split(',');
                if(splitText.length > jsVars.maximumEmailMobileSearch) {
                    alertPopup('Maximum search length is ' + jsVars.maximumEmailMobileSearch,'error');
                    return false;
                }
            }
        }
    }
    if (PaymentManagerPage == 1) {
        $("#selectionRow").hide();
        $("#selectAllAvailableRecordsLink").hide();
        $("#clearSelectionLink").hide();
        $('#select_page_payment_ids').attr('checked', false);
        $('#select_all').attr('checked', false);
        $('.select_payment').attr('checked', false);
    }

    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').hide();
    is_filter_button_pressed = 1;
    var data = $('#FilterApplicationForms').serializeArray();
    data.push({name: "page", value: PaymentManagerPage});

    $.ajax({
        url: '/payment-manager/payments-list',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function () {
            $('#parent').css('min-height', '50px');
            showLoader();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (response) {
            PaymentManagerPage += 1;
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session') {
                window.location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
            } else if (responseObject.message === "no_record_found") {
                //Check Pay Config Button
//                checkPayConfig(true);

                if (PaymentManagerPage == 2) {
                    $('#load_msg').html('No Payment Found');
                    $('#load_msg_div').show();
                    $('#load_more_results').parent().addClass('hide');
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Payment");
                    $('#load_more_button').hide();
                    if ($(window).width() < 992) {
                        $('.offCanvasModal').modal('hide');
                    }

                } else {
                    $('#load_msg').html('');
                    $('#load_msg_div').hide();
                    $('#load_more_button').html("<i class='fa fa-database' aria-hidden='true'></i>&nbsp;No More Payment");
                    $('#load_more_button').show();
                }
                if (type != '' && PaymentManagerPage == 2) {
                    $('#if_record_exists').hide();
                    $('#showPaymentDownload').hide();
                    $('#single_lead_add').hide();
                }
            } else if (responseObject.status == 1) {
                if (type === 'reset') {
                    //Check Pay Config Button
//                checkPayConfig(true);
                    $('#load_more_results').html("");
                }
                data = responseObject.data.html.replace("<head/>", '');
                $('#load_more_results').parent().removeClass('hide');
                $('#load_more_results').append(data);
                dropdownMenuPlacement();
                $('#load_msg_div').hide();
                $('#parent').show();
                $('.itemsCount').show();
                $('.offCanvasModal').modal('hide');
                table_fix_rowcol();
                var ttl = $('#current_record').val();
                if (parseInt(ttl) < 10) {
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Payment");
                    $('#load_more_button').hide();
                } else {
                    $('#load_more_button').removeAttr("disabled");
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Payment");
                    $('#load_more_button').show();
                }
                if (type != '') {
                    $('#if_record_exists').fadeIn();
                    $('#showPaymentDownload').fadeIn();
                }
                if ($('#select_page_payment_ids:checked').length > 0 && $('#select_all:checked').length < 1) {
                    var recordOnDisplay = $('input:checkbox[name="selected_payment_id[]"]').length;
                    $("#currentSelectionMessage").html("All " + recordOnDisplay + " payments on this page are selected. ");
                }
            } else {
                $('#parent').hide();
                $('#load_msg_div').show();
                $('#load_msg').html(responseObject.message);
                $('#load_more_results').html("");
                $('#load_more_button').hide();
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Payment");
                if (type != '') {
                    $('#if_record_exists').hide();
                    $('#showPaymentDownload').hide();
                }
                $('.offCanvasModal').modal('hide');
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            //window.location.reload(true);
        },
        complete: function () {
            is_filter_button_pressed = 1;
            hideLoader();
        }
    });

    return false;
}

function bindPaymentAjaxCall() {

    if ($(".dateinput").length > 0) {
        $('.dateinput').datetimepicker({format: 'DD/MM/YYYY HH:mm', viewMode: 'years'});
    }

    $("#form_fields").change(function () {
        getDropdownValueList(this.value);
    });

}

function getAllFormList(cid, default_val, multiselect) {
    if (typeof default_val == 'undefined') {
        default_val = '';
    }
    if (typeof multiselect == 'undefined') {
        multiselect = '';
    }

    if (cid == '' || cid == '0') {
        $("#formListDiv").html("<select name='form_id' id='form_id'  class='chosen-select' ><option value='0'>Form</option></select>");
        $('.chosen-select').chosen();
        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        return false;
    }

    $.ajax({
        url: '/payment-manager/get-forms',
        type: 'post',
        data: {
            "college_id": cid,
            "default_val": default_val,
            "multiselect": multiselect
        },
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            //currentObj.text('Wait..');
        },
        success: function (json) {
            if (json == 'session_logout') {
                window.location.reload(true);
            } else {
                $("#formListDiv").html(json);
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                showHideSearchBox();
                $("#form_id").change(function () {
                    showHideSearchBox();
                });
            }
            getAllFormListForFeeType(cid);
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            ;
        }
    });
}

function getAllFormListForFeeType(cid) {
    if (cid == '' || cid == '0') {
        $("#formListDiv").html("<select name='fee_form_id' id='fee_form_id'  class='chosen-select' ><option value='0'>Form</option></select>");
        $('.chosen-select').chosen();
        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        return false;
    }

    $.ajax({
        url: '/payment-manager/get-forms-for-fee-type',
        type: 'post',
        data: {
            "college_id": cid
        },
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            //currentObj.text('Wait..');
        },
        success: function (json) {
            if (json == 'session_logout') {
                window.location.reload(true);
            } else {
                $("#formListDiv2").html(json);
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                $('#formListDiv2').append('<span class="error" id="formListDiv2_error"></span>');
            }
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            ;
        }
    });
}

function getAllPaymentMethod() {
    $('#payment_method').html('<option selected="selected" value="">Select Payment Method</option>');
    $('#payment_method').trigger('chosen:updated');

    if ($("#college_id").val() == '' || $("#college_id").val() == '0' || $("#college_id").val() == null) {
        return;
    }

    $.ajax({
        url: '/payment-manager/get-all-payment-method',
        type: 'post',
        dataType: 'json',
        data: {
            "collegeId": $("#college_id").val()
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (responseObject) {
            if (responseObject == 'session')
            {
                location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
            }
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data.paymentMethod === "object") {
                        var value = '<option selected="selected" value="">Select Payment Method</option>';
                        $.each(responseObject.data.paymentMethod, function (index, item) {
                            value += '<option value="' + index + '">' + item + '</option>';
                        });
                        $('#payment_method').html(value);
                    }
                }
                $('#payment_method').trigger('chosen:updated');
            } else {
                console.log(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function loadDiscountFilter() {
    if ($("#college_id").val() == '' || $("#college_id").val() == '0' || $("#college_id").val() == null) {
        $("#search_coupon_applied_div").hide();
        $("#search_agent_name_div").hide();
        $("#coupon_applied").val('');
        $("#agent_name").val('');
        return;
    }
    if ($("#college_id").val() == 524) {
        $("#search_sent_university_div").show();
    } else {
        $("#search_sent_university_div").hide();
    }

    $.ajax({
        url: '/payment-manager/load-discount-filter',
        type: 'post',
        dataType: 'json',
        data: {
            "collegeId": $("#college_id").val()
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (responseObject) {
            if (responseObject == 'session')
            {
                location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
            }
            if (responseObject.status == 1) {
                if (typeof responseObject.data.showDiscountFilter !== "undefined" && responseObject.data.showDiscountFilter == 1) {
                    $("#search_coupon_applied_div").show();
                    $("#search_agent_name_div").show();
                } else {
                    $("#search_coupon_applied_div").hide();
                    $("#search_agent_name_div").hide();
                    $("#coupon_applied").val('');
                    $("#agent_name").val('');
                }
            } else {
                console.log(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$(document).on('change', '#form_id', function () {
    $("#fee_product_type").val('');
    getAllFeeList(1);
});

$(document).on('change', '#fee_product_type', function () {
    getAllFeeList();
    $('#payment_status').val('').trigger('chosen:updated');
});

function getAllFeeList(resetFeeProduct = 0) {

    $('select#fee_type').html('<option selected="selected" value="">Select Fee</option>');
    $('select#fee_type').trigger('chosen:updated');

    if ($("#college_id").val() == '' || $("#college_id").val() == '0' || $("#college_id").val() == null) {
        return;
    }

    $.ajax({
        url: '/payment-manager/getAllFeeList',
        type: 'post',
        dataType: 'html',
        data: {
            "collegeId": $("#college_id").val(),
            "formId": $("#form_id").val(),
            "feeProductType": $("select#fee_product_type").val()
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data.feeList === "object") {
                        var value = '<option selected="selected" value="">Select Fee</option>';
                        $.each(responseObject.data.feeList, function (feeTypeId, item) {
                            $.each(item, function (index, option) {
                                value += '<option value="' + feeTypeId + '">' + option + '</option>';
                            });
                        });
                        $('select#fee_type').html(value);
                    }

                    if (typeof responseObject.data.feeProductList === "object") {
                        if (resetFeeProduct == 1) {
                            var selectedFeeProduct = 'all';
                        } else {
                            var selectedFeeProduct = $("#fee_product_type").val();
                        }
                        var value = '';
                        $.each(responseObject.data.feeProductList, function (feeProduct, item) {
                            if (selectedFeeProduct == feeProduct) {
                                value += '<option value="' + feeProduct + '" selected="selected">' + item + '</option>';
                            } else {
                                value += '<option value="' + feeProduct + '">' + item + '</option>';
                            }
                        });
                        $('select#fee_product_type').html(value);
                    }
                }

                $('select#fee_type').parent().show();
                $('#fee_type').trigger('chosen:updated');
                $('#fee_product_type').trigger('chosen:updated');

            } else {
                console.log(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

}
//alert popup
function alertPopup(msg, type, location) {
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

function selectAllLead(elem) {

    $('#select_all').attr('checked', true);
    if (elem.checked) {
        //console.log(elem.checked);
        $('.select_lead').each(function () {
            this.checked = true;
        });

    } else {
        $('.select_lead').attr('checked', false);
    }

    $('div.loader-block').hide();
}

$(document).on('click', '.select_lead', function (e) {

    $('#select_all').attr('checked', false);

});

$('.modalButton').on('click', function (e) {
    var $form = $("#FilterApplicationForms");
    if (typeof is_filter_button_pressed === 'undefined' || is_filter_button_pressed !== 1) {
        alertPopup('It seems you have changed the filter but not Applied it. Please re-check the same to proceed further.', 'error');
        return false;
    }
    $form.attr("action", '/payment-manager/download-payments-list');
    $form.attr("target", 'modalIframe');
    $form.append($("<input>").attr({"value": "export", "name": "export", 'type': "hidden", "id": "export"}));
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    $form.submit();
    $form.attr("onsubmit", onsubmit_attr);
    $form.find('input[name="export"]').val("");
    $form.removeAttr("target");
});
$('#myModal').on('hidden.bs.modal', function () {
    $("#modalIframe").html("");
    $("#modalIframe").attr("src", "");
});

var downloadVoucherFile = function (url) {
    window.open(url, "_self");
};


/*For Call Cash Payment Method Type*/
function getApplicationCashInfo(ApplicationId, area, form_id, college_id) {
    $('.loader-block-a').show();
    $.ajax({
        url: '/payment-manager/saveGetApplicationCashInfo',
        type: 'post',
        dataType: 'html',
        data: {id: ApplicationId, area: area, form_id: form_id, college_id: college_id},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (data) {
            $('.loader-block-a').hide();
            if (data == 'session')
            {
                location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
            } else if (data == 'refresh')
            {
                alertPopup('Getting error.Please refresh page and try again.', 'error');
            } else {
                $('#CashPaymentModalBox #CashPaymentBody').html(data);
                $("#CashPaymentBtn").trigger('click');
                $('#CashReceiptDate,#CashReceiveDate').datepicker({startView: 'month', format: 'dd/mm/yyyy', enableYearToMonth: true, enableMonthToDay: true, endDate: 'NOW'});
                if ($('#CashPaymentModalBox #payment_status_text').length > 0 && ($('#CashPaymentModalBox #payment_status_text').val() != ''))
                {
                    $('#CashReceiptDate,#CashReceiveDate').datepicker('remove');
                }

                var cashTitle = '';
                if (typeof $('#CashPaymentBody #cashTitle').val() !== 'undefined' && $.trim($('#CashPaymentBody #cashTitle').val()) != '') {
                    cashTitle = $('#CashPaymentBody #cashTitle').val();
                } else {
                    cashTitle = 'Cash Payment';
                }
                $('#CashPaymentModalBox h2').html(cashTitle);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/*For Call DD Payment Method Type*/
function getApplicationDDInfo(ApplicationId, form_id, college_id) {
    $('.loader-block-a').show();
    $.ajax({
        url: '/payment-manager/getApplicationDDInfo',
        type: 'post',
        dataType: 'html',
        data: {id: ApplicationId, form_id: form_id, college_id: college_id},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (data) {
            $('.loader-block-a').hide();
            if (data == 'session')
            {
                location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
            } else if (data == 'refresh')
            {
                alertPopup('Getting error.Please refresh page and try again.', 'error');
            } else {
                $('#CashPaymentModalBox #CashPaymentBody').html(data);
                $("#CashPaymentBtn").trigger('click');
                ddTitle = 'DD Payment Details';
                $('#CashPaymentModalBox h2').html(ddTitle);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

//Save Cash Payment Status Form
$(document).on('submit', 'form#CashPaymentForm', function (e) {
    e.preventDefault();
    $('.help-block').text('');
    var data = $(this).serializeArray();

    $('.loader-block-a').show();
    $(this).ajaxSubmit({
        url: '/payment-manager/saveGetApplicationCashInfo',
        type: 'post',
        data: data,
        dataType: 'html',
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            $('.loader-block-a').hide();
            if (data == 'session')
            {
                location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
            } else if (data == 'refresh')
            {
                alertPopup('Getting error.Please refresh page and try again.', 'error');
            } else {
                $('#CashPaymentModalBox #CashPaymentBody').html(data);
                $('#CashReceiptDate,#CashReceiveDate').datepicker({startView: 'month', format: 'dd/mm/yyyy', enableYearToMonth: true, enableMonthToDay: true, endDate: 'NOW'});
                if ($('#CashPaymentModalBox #payment_status_text').length > 0 && ($('#CashPaymentModalBox #payment_status_text').val() != ''))
                {
                    var AppId = $('#CashPaymentModalBox #ApplicationId').val();
                    $('#ApplicationPaymentStatusSpan' + AppId).removeClass('payment-not-recieve-message');
                    $('#ApplicationPaymentStatusSpan' + AppId).addClass('payment-recieve-message');
                    $('#ApplicationPaymentStatusSpan' + AppId).text($('#CashPaymentModalBox #payment_status_text').val());
                    $('#CashReceiptDate,#CashReceiveDate').datepicker('remove');
                }
                LoadMorePaymentConfig("reset");

            }
        },
        resetForm: false
    });
});

/*** Show & Hide Loader ***/
function showLoader() {
    $("#listloader").show();
}
function hideLoader() {
    $("#listloader").hide();
}

function resetform() {
    $("#FilterApplicationForms")[0].reset();
    $('#fee_product_type').val('');
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    $('.chosen-select').trigger('chosen:updated');
    showHideSearchBox();
    getAllFeeList();
    LoadMorePaymentConfig('reset');
}

$(document).on('click', '.viewHistory', function () {
    var historyEncryptVal = $(this).attr('id');
    $.ajax({
        url: '/payment-manager/get-payment-history/' + $("#college_id").val() + "/" + historyEncryptVal,
        type: 'get',
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (data) {
            if (data == 'session_logout') {
                window.location.reload(true);
            } else if (data == 'permision_denied') {
                window.location.href = '/permissions/error';
            }
            $('#mainData').html(data);
            $("#paymentHistoryModal").modal("show");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
});


function markSinglePaymentApproved(params) {
    $('#applicantEmailIdDiv, #applicantEmailIdDiv').hide();
    $('#applicantEmailId, #ApplicationNo, #lpuRegNo').val('');
    var data = [];
    if ($('#college_id').val() == '' || $('#college_id').val() == 0) {
        alertPopup('Please select College.', 'error');
        return false;
    }
    data.push({name: "collegeId", value: $("#college_id").val()});
    data.push({name: "formId", value: 0});
    if (typeof params !== 'undefined') {
        data.push({name: "params", value: params});
    }
    $.ajax({
        url: jsVars.allPaymentModeLink,
        type: 'post',
        data: data,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('div.loader-block-a').show();
        },
        complete: function () {
            $('div.loader-block-a').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (typeof responseObject.message !== 'undefined' && responseObject.message !== '') {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
                } else {
                    alertPopup('There is some error', 'error');
                }
            } else if (responseObject.data !== 'undefined') {
                var html = '';
                $('#encryptParam').val(responseObject.data.encryptParam);

                if (typeof responseObject.data.paymentAttributes !== 'undefined') {

                    //For Email/Application No
                    $('#applicantEmailIdDiv').show();
                    if (typeof responseObject.data.applicationNo !== 'undefined') {
                        if (responseObject.data.applicationNo == '') {
                            $('#ApplicationNo').attr('readonly', false);
                        } else {
                            $('#ApplicationNo').attr('readonly', true);
                        }
                        $('#ApplicationNo').val(responseObject.data.applicationNo);
                    }
//                    else if(typeof responseObject.data.emailId !== 'undefined' && responseObject.data.emailId !== '') {
//                        $('#applicantEmailId').val(responseObject.data.emailId);
//                        $('#applicantEmailIdDiv').show();
//                    }

                    if (typeof responseObject.data.feeTypeData !== 'undefined' && responseObject.data.feeTypeData !== '') {
                        var fee_type_html = '<option value="" selected="selected">Select Fee</option>';
                        $.each(responseObject.data.feeTypeData, function (feeTypeId, item) {
                            $.each(item, function (index, option) {
                                fee_type_html += '<option value="' + feeTypeId + '">' + option + '</option>';
                            });
                        });
                        $('#fee_type_id').html(fee_type_html).trigger('chosen:updated');
                    }

                    var html = '';
                    var paymentModeName = '';
                    var allPaymentModeCounter = 0;
                    $.each(responseObject.data.paymentAttributes, function (paymentMode, attributes) {
                        if (allPaymentModeCounter == 0) {
                            paymentModeName = paymentMode;
                        }
                        html += '<div id="' + paymentMode + 'DivId">';
                        var dynamicClass = paymentMode + 'OfflinePaymentApprovedClass';
                        $.each(attributes, function (fieldName, fieldAttributes) {
                            switch (fieldAttributes['field_type']) {
                                case 'text':
                                    var textboxValue = '';
                                    if (typeof fieldAttributes['value'] !== 'undefined' && fieldAttributes['value'] != '') {
                                        textboxValue = fieldAttributes['value'];
                                    }

                                    var disabled = false;
                                    if (typeof fieldAttributes['disabled'] !== 'undefined' && fieldAttributes['disabled'] == 1) {
                                        disabled = 'disabled="disabled"';
                                    }
                                    html += '<div class="labelUpContainer allOfflinePaymentApprovedJsClass ' + dynamicClass + '" style="display:none;">';
                                    html += '<input type="text" name="' + fieldName + '" id="' + fieldAttributes['id'] + '" label="false" class="form-control" placeholder="' + fieldAttributes['placeholder'] + '" value="' + textboxValue + '" ' + disabled + '>';
                                    html += '<span class="text-danger" id="' + fieldAttributes['id'] + '_error"><span/>';
                                    html += '</div>';
                                    break;
                                case 'checkbox':
                                    html += '<div class="labelUpContainer allOfflinePaymentApprovedJsClass ' + dynamicClass + '" style="display:none;"><div class="toggle__checkbox">';
                                    if (typeof fieldAttributes['valueList'] !== 'undefined') {
                                        $.each(fieldAttributes['valueList'], function (checkboxValue, checkboxLabel) {
                                            html += fieldAttributes['label'] + '<input type="checkbox" name="' + fieldName + '" id="' + fieldAttributes['id'] + '" value="' + checkboxValue + '" label="false">';
                                        })
                                    }
                                    html += '<label style="margin-left:10px;" data-id="' + fieldAttributes['id'] + '" onclick="" class="dash_2 " for="' + fieldAttributes['id'] + '">Toggle</label></div></div>';
                                    break;
                                case 'datepicker':
                                    html += '<div class="dateFormGroup labelUpContainer allOfflinePaymentApprovedJsClass ' + dynamicClass + '" style="display:none;">';
                                    html += '<div class="iconDate"><i class="fa fa-calendar-check-o" aria-hidden="true"></i></div>';
                                    html += '<input type="text" name="' + fieldName + '" placeholder="' + fieldAttributes['placeholder'] + '" class="form-control" id="' + fieldAttributes['id'] + '"/>';
                                    html += '<span class="text-danger" id="' + fieldAttributes['id'] + '_error"><span/>';
                                    html += '</div>';
                                    break;
                                case 'textarea':
                                    html += '<div class="labelUpContainer allOfflinePaymentApprovedJsClass ' + dynamicClass + '" style="display:none;">';
                                    html += '<textarea name="' + fieldName + '" id="' + fieldAttributes['id'] + '" label="false" class="form-control" placeholder="' + fieldAttributes['placeholder'] + '"></textarea>';
                                    html += '</div>';
                                    break;
                            }
                        });
                        html += '</div>';
                        allPaymentModeCounter++;
                    });

                    $('#showHtml').html(html);
                    $('#loadAllApplicableFee').html('');
                    //floatableLabel();
                    //customFile();
                    $('#singleMarkPaymentApprovedModal').on('show.bs.modal', function () {
                        $('body').removeClass('vScrollRemove');
                        $('body').addClass('overflowHidden');
                    });
                    $('#singleMarkPaymentApprovedModal').on('hidden.bs.modal', function () {
                        $('body').removeClass('overflowHidden');
                    })

                    var ddPlaceholder = $('#dd_date').attr('placeholder');
                    $('#dd_date').datepicker({format: 'dd/mm/yyyy', endDate: 'today'})
                            .on('hide', function (e) {
                                if (this.value != '') {
                                    $(this).parent().addClass('floatify__active');
                                    $(this).attr('placeholder', '');
                                } else {
                                    $(this).parent().removeClass('floatify__active');
                                    $(this).attr('placeholder', ddPlaceholder);
                                }
                            })

                    var ddrdPlaceholder = $('#dd_received_date').attr('placeholder');
                    $('#dd_received_date').datepicker({format: 'dd/mm/yyyy', endDate: 'today'})
                            .on('hide', function (e) {
                                if (this.value != '') {
                                    $(this).parent().addClass('floatify__active');
                                    $(this).attr('placeholder', '');
                                } else {
                                    $(this).parent().removeClass('floatify__active');
                                    $(this).attr('placeholder', ddrdPlaceholder);
                                }
                            });

                    var crtdPlaceholder = $('#cash_receipt_date').attr('placeholder');
                    $('#cash_receipt_date').datepicker({format: 'dd/mm/yyyy', endDate: 'today'})
                            .on('hide', function (e) {
                                if (this.value != '') {
                                    $(this).parent().addClass('floatify__active');
                                    $(this).attr('placeholder', '');
                                } else {
                                    $(this).parent().removeClass('floatify__active');
                                    $(this).attr('placeholder', crtdPlaceholder);
                                }

                            });

                    var crdPlaceholder = $('#cash_receive_date').attr('placeholder');
                    $('#cash_receive_date').datepicker({format: 'dd/mm/yyyy', endDate: 'today'})
                            .on('hide', function (e) {
                                if (this.value != '') {
                                    $(this).parent().addClass('floatify__active');
                                    $(this).attr('placeholder', '');
                                } else {
                                    $(this).parent().removeClass('floatify__active');
                                    $(this).attr('placeholder', crdPlaceholder);
                                }
                            });

                    //Call First Time so it will checked by default
                    showHideField(paymentModeName);
                }

                $("#singleMarkPaymentApprovedMessageDiv").html("");
                $('#singleMarkPaymentApprovedModal').modal('show');
                $('[data-toggle="tooltip"]').tooltip();
                //$('#singleMarkPaymentApprovedModal .modal-dialog').addClass('modal-sm');
            }
            if (typeof params === 'undefined') {
                $('#applicantApplicationNoDiv').hide();
                $('#lpuRegNoDiv').hide();
                $('#applicantEmailId').val('');
                $('#ApplicationNo').val('');
                $('#lpuRegNo').val('');
                $('#loadAllApplicableFee').html('');
                $('#fee_form_id').val('0');
                $('#fee_form_id').trigger("chosen:updated");
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
$(document).on('click', '#add_dd_details', function () {
    var collegeId = $("#college_id").val();
    if (collegeId == 524) {
        return false;
    }
    if ($("#add_dd_details").is(":checked")) {
        $(document).find("#dd_number").parents('.labelUpContainer').show();
        $(document).find("#dd_date").parents('.labelUpContainer').show();
        $(document).find("#bank_name").parents('.labelUpContainer').show();
    } else {
        $(document).find("#dd_number").val('');
        $(document).find("#dd_date").val('');
        $(document).find("#bank_name").val('');
        $(document).find("#dd_number").parents('.labelUpContainer').hide();
        $(document).find("#dd_date").parents('.labelUpContainer').hide();
        $(document).find("#bank_name").parents('.labelUpContainer').hide();
    }
});

function showHideField(value) {
    //Hide All Field
    $('.allOfflinePaymentApprovedJsClass').hide();
    $('.' + value + 'OfflinePaymentApprovedClass').show();
    if (value == 'offline') {
        $('#showHtml').hide();
        $('#singleMarkPaymentApprovedButtonId').hide();
    }
    var collegeId = $("#college_id").val();
    if (collegeId != 524) {
        $(document).find("#dd_number").parents('.labelUpContainer').hide();
        $(document).find("#dd_date").parents('.labelUpContainer').hide();
        $(document).find("#bank_name").parents('.labelUpContainer').hide();
    } else {
        $(document).find('#add_dd_details').closest('.allOfflinePaymentApprovedJsClass').hide();
    }
}

/******************************* For Single Payment Code End Here *************************************/

$(document).on("change", "#college_id, #form_id", function () {
    jsVars.searchApplicationNo = '';
    $("#search_application").val('');
    $("#payment_status").val('');
    $("#start_date").val('');
    $("#approved_date").val('');
    $("#payment_id").val('');
    $("#transaction_id").val('');
    $("#coupon_applied").val('');
    $("#agent_name").val('');
    $('#payment_status').trigger('chosen:updated');
});

function getAllFeeListForForm(feeFormId) {

    if ($("#college_id").val() == '' || $("#college_id").val() == '0' || $("#college_id").val() == null) {
        return;
    }
    var data = [];
    data.push({name: "collegeId", value: $("#college_id").val()});
    data.push({name: "formId", value: feeFormId});
    if (typeof params !== 'undefined') {
        data.push({name: "params", value: params});
    }
    $.ajax({
        url: jsVars.allPaymentModeLink,
        type: 'post',
        data: data,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('div.loader-block-a').show();
        },
        complete: function () {
            $('div.loader-block-a').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (typeof responseObject.message !== 'undefined' && responseObject.message !== '') {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
                } else {
                    alertPopup('There is some error', 'error');
                }
            } else if (responseObject.data !== 'undefined') {
                if (typeof responseObject.data.feeTypeData !== 'undefined' && responseObject.data.feeTypeData !== '') {
                    var fee_type_html = '<option value="" selected="selected">Select Fee</option>';
                    $.each(responseObject.data.feeTypeData, function (feeTypeId, item) {
                        $.each(item, function (index, option) {
                            fee_type_html += '<option value="' + feeTypeId + '">' + option + '</option>';
                        });
                    });
                    $('#fee_type_id').html(fee_type_html).trigger('chosen:updated');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


$(document).on('change', '#markApproved', function () {
    var feeEncryptVal = $(this).val();
    var installmentData;
    if (feeEncryptVal in installmentDetailsArr) {
        installmentData = installmentDetailsArr[feeEncryptVal];
        addInstallmentDetailsHtml(installmentData);
    }
});

var applicableTax = 0;
var calculateAmount = 0;
function addInstallmentDetailsHtml(installmentData) {
    $('.allOfflinePaymentApprovedJsClass').show();
    $(document).find("#singleMarkPaymentApprovedButtonId").prop('disabled', false);
    $(document).find('#installmentDetails').remove();
    $("#singleMarkPaymentApprovedMessageDiv").html('');
    $("#offlineDivId").prepend('<div id="installmentDetails" class="logicBox"></div>');
    var installmentDetails = '<div class="panel-body"><table class="table-border table customborder"></div>';
    installmentData['currencyClass'] = "fa " + installmentData['currencyClass']
    if (installmentData['allowInstallmentAmount'] === 1) {

        if (installmentData['finalTimesPayment'] === 1) {

            installmentDetails += '<tr class="relative"><td class="fw-700">Amount received from the applicant:</td> <td class="maxwidth80 lineinput fw-700""><i class="' + installmentData['currencyClass'] + '"></i>&nbsp;<input type="text" id="payAmount" name="pay_partial_amount" value="' + installmentData['paymentAmount'] + '" onkeypress="return isNumberWithDot(event)" disabled><span id="pay_partial_amount_error" style="left: 0; top:-8px; position: absolute;"  class="text-danger"></span></td></tr>';

        } else {

            installmentDetails += '<tr class="relative"><td class="fw-700">Amount received from the applicant:</td> <td class="maxwidth80 lineinput fw-700""><i class="' + installmentData['currencyClass'] + '"></i>&nbsp;<input type="text" id="payAmount" name="pay_partial_amount" value="' + installmentData['paymentAmount'] + '" onkeypress="return isNumberWithDot(event)" maxLength="100"><a href="javascript:void(0);" id="calculateAmount" style="background: #0074d9; color: #fff;padding: 1px 5px;float:left; margin: 4px 5px 0 10px; text-decoration:none;">Calculate</a><span id="pay_partial_amount_error" class="text-danger" style="left: 0; top:-8px; position: absolute;"></span></td></tr>';

        }

        installmentDetails += '<tr id="base_fee_tr"><td class="fw-700">Base Fee:</td> <td class="maxwidth80 nobgborder fw-700""> <i class="' + installmentData['currencyClass'] + '"></i>&nbsp;<input type="text" id="baseFee" name="payment_base_fee" value="' + installmentData['remainingPayAmount'] + '" readonly disabled></td></tr>';
        installmentDetails += '<tr id="convenience_tr"><td class="fw-700">Convenience charges:</td> <td class="maxwidth80 nobgborder fw-700""> <i class="' + installmentData['currencyClass'] + '"></i>&nbsp;<input type="text" id="convenienceCharges" name="convenienceCharges" value="' + installmentData['convenience'] + '" readonly disabled></td></tr>';
        installmentDetails += '<tr id="taxes_tr"><td class="fw-700">Taxes:</td> <td class="maxwidth80 nobgborder fw-700""> <i class="' + installmentData['currencyClass'] + '"></i>&nbsp;<input type="text" id="taxes" name="taxes" value="' + installmentData['taxes'] + '" readonly disabled></td></tr>';
        installmentDetails += '<tr><td class="mutedlbl">Minimum/partial deposit applicable:</td> <td class="maxwidth80 nobgborder mutedlbl"> <i class="' + installmentData['currencyClass'] + '"></i>&nbsp;<span>' + installmentData['minPayAmount'] + '<span></td></tr>';
        installmentDetails += '<tr><td class="mutedlbl">Total Payable Amount:</td> <td class="maxwidth80 nobgborder mutedlbl"><i class="' + installmentData['currencyClass'] + '"></i>&nbsp;<span>' + installmentData['totalPayAmount'] + '</span></td></tr>';
        installmentDetails += '<tr><td class="mutedlbl">Total Paid Amount:</td> <td class="maxwidth80 nobgborder mutedlbl"><i class="' + installmentData['currencyClass'] + '"></i>&nbsp;<span>' + installmentData['paidAmount'] + '</span></td></tr>';
        installmentDetails += '<tr><td class="mutedlbl">Total Approved Amount:</td> <td class="maxwidth80 nobgborder mutedlbl"><i class="' + installmentData['currencyClass'] + '"></i>&nbsp;<span>' + installmentData['approvedAmount'] + '</span></td></tr>';
        installmentDetails += '<tr><td class="mutedlbl">Total Remaining Amount:</td> <td class="maxwidth80 nobgborder mutedlbl"><i class="' + installmentData['currencyClass'] + '"></i>&nbsp;<span>' + installmentData['remainingPayAmount'] + '</span></td></tr>';

    } else if (installmentData['allowMinPayment'] === 1) {

        installmentDetails += '<tr class="relative"><td class="fw-700">Amount received from the applicant:</td> <td class="maxwidth80 lineinput fw-700""><i class="' + installmentData['currencyClass'] + '"></i>&nbsp;<input type="text" id="payAmount" name="pay_partial_amount" value="" onkeypress="return isNumberWithDot(event)" maxLength="100"><a href="javascript:void(0);" id="calculateAmount" style="background: #0074d9; color: #fff;padding: 1px 5px;float:left; margin: 4px 5px 0 10px; text-decoration:none;">Calculate</a><span id="pay_partial_amount_error" class="text-danger" style="left: 0; top:-8px; position: absolute;"></span></td></tr>';
        installmentDetails += '<tr id="base_fee_tr"><td class="fw-700">Base Fee:</td> <td class="maxwidth80 nobgborder fw-700""> <i class="' + installmentData['currencyClass'] + '"></i>&nbsp;<input type="text" id="baseFee" name="payment_base_fee" value="' + installmentData['remainingPayAmount'] + '" readonly disabled></td></tr>';
        installmentDetails += '<tr id="convenience_tr"><td class="fw-700">Convenience charges:</td> <td class="maxwidth80 nobgborder fw-700""> <i class="' + installmentData['currencyClass'] + '"></i>&nbsp;<input type="text" id="convenienceCharges" name="convenienceCharges" value="' + installmentData['convenience'] + '" readonly disabled></td></tr>';
        installmentDetails += '<tr id="taxes_tr"><td class="fw-700">Taxes:</td> <td class="maxwidth80 nobgborder fw-700""> <i class="' + installmentData['currencyClass'] + '"></i>&nbsp;<input type="text" id="taxes" name="taxes" value="' + installmentData['taxes'] + '" readonly disabled></td></tr>';
        installmentDetails += '<tr><td class="mutedlbl">Minimum/partial deposit applicable:</td> <td class="maxwidth80 nobgborder mutedlbl"> <i class="' + installmentData['currencyClass'] + '"></i>&nbsp;<span>' + installmentData['minPayAmount'] + '<span></td></tr>';

    } else {

        installmentDetails += '<tr><td class="fw-700">Amount received from the applicant:</td> <td class="maxwidth80 lineinput fw-700""><i class="' + installmentData['currencyClass'] + '"></i>&nbsp;<input type="text" id="payAmount" name="pay_partial_amount" value="' + installmentData['paymentAmount'] + '" onkeypress="return isNumberWithDot(event)" disabled><span id="pay_partial_amount_error" style="left: 0; top:-8px; position: absolute;" class="text-danger"></span></td></tr>';
        installmentDetails += '<tr id="base_fee_tr"><td class="fw-700">Base Fee:</td> <td class="maxwidth80 nobgborder fw-700""> <i class="' + installmentData['currencyClass'] + '"></i>&nbsp;<input type="text" id="baseFee" name="payment_base_fee" value="' + installmentData['remainingPayAmount'] + '" readonly disabled></td></tr>';
        installmentDetails += '<tr id="convenience_tr"><td class="fw-700">Convenience charges:</td> <td class="maxwidth80 nobgborder fw-700""> <i class="' + installmentData['currencyClass'] + '"></i>&nbsp;<input type="text" id="convenienceCharges" name="convenienceCharges" value="' + installmentData['convenience'] + '" readonly disabled></td></tr>';
        installmentDetails += '<tr id="taxes_tr"><td class="fw-700">Taxes:</td> <td class="maxwidth80 nobgborder fw-700""> <i class="' + installmentData['currencyClass'] + '"></i>&nbsp;<input type="text" id="taxes" name="taxes" value="' + installmentData['taxes'] + '" readonly disabled></td></tr>';

    }
    installmentDetails += '<input type="hidden" id="minPayAmount" value="' + installmentData['minPayAmount'] + '">';
    installmentDetails += '<input type="hidden" id="allowInstallmentAmount" value="' + installmentData['allowInstallmentAmount'] + '">';
    installmentDetails += '<input type="hidden" id="allowMinPayment" value="' + installmentData['allowMinPayment'] + '">';
    installmentDetails += '<input type="hidden" id="currencyClass" value="' + installmentData['currencyClass'] + '">';
    installmentDetails += '<input type="hidden" id="maxPayAmount" value="' + installmentData['paymentAmount'] + '"></table>';
    $(document).find("#installmentDetails").html(installmentDetails);
    if (installmentData['convenience'] === 0 && installmentData['taxes'] === 0) {
        $(document).find("#base_fee_tr").hide();
        $(document).find("#convenience_tr").hide();
        $(document).find("#taxes_tr").hide();
        $(document).find("#calculateAmount").hide();
        applicableTax = 0;
    } else if (installmentData['convenience'] === 0) {
        $(document).find("#convenience_tr").hide();
    } else if (installmentData['taxes'] === 0) {
        $(document).find("#taxes_tr").hide();
    }
    if (installmentData['convenience'] !== 0 || installmentData['taxes'] !== 0) {
        applicableTax = 1;
    }
    calculateAmount = 1;
    $(document).find("#calculateAmount").hide();
}

$(document).on('change', '#payAmount', function () {
    $(document).find("#pay_partial_amount_error").html('');
    if (applicableTax === 1) {
        $(document).find("#calculateAmount").show();
        $(document).find("#singleMarkPaymentApprovedButtonId").prop('disabled', true);
    } else {
        $(document).find("#calculateAmount").hide();
        $(document).find("#singleMarkPaymentApprovedButtonId").prop('disabled', false);
    }
    calculateAmount = 0;
});

$(document).on('click', '#calculateAmount', function () {
    var validAmount = calculateAmountOffline();
    if (validAmount === false) {
        return false;
    }
});

function calculateAmountOffline() {
    var payAmount = parseFloat($(document).find("#payAmount").val());
    var minAmount = parseFloat($(document).find("#minPayAmount").val());
    var maxAmount = parseFloat($(document).find("#maxPayAmount").val());
    var allowInstallmentAmount = parseInt($(document).find("#allowInstallmentAmount").val());
    $(document).find("#pay_partial_amount_error").html('');
    if (minAmount > payAmount) {
        $(document).find("#baseFee").val('');
        $(document).find("#convenienceCharges").val('');
        $(document).find("#taxes").val('');
        $(document).find("#pay_partial_amount_error").html('Amount entered is less than the minimum deposit applicable');
        return false;
    }
    if (allowInstallmentAmount === 1 && payAmount > maxAmount) {
        $(document).find("#pay_partial_amount_error").html('Amount entered is greater than the total payable amount');
        return false;
    }
    //var encryptValue = $('#markApproved').val();
    var encryptValue = $('select#fee_type_id > option:selected').data('encrypt');
    $.ajax({
        url: '/paymentManager/calculateAmountForOffline',
        type: 'post',
        dataType: 'json',
        data: {'payAmount': payAmount, 'encryptValue': encryptValue},
        headers: {"X-CSRF-Token": jsVars.csrfToken},
        success: function (response) {
            if (response.message === 'session') {
                location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
            } else if (response.status === 1) {
                var newBreakup = response.data.newBreakup;
                $(document).find("#baseFee").val(newBreakup.base_fee);
                $(document).find("#convenienceCharges").val(newBreakup.convenience);
                $(document).find("#taxes").val(newBreakup.tax);
                $(document).find("#singleMarkPaymentApprovedButtonId").prop('disabled', false);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return true;
}

function isNumberWithDot(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode === 46) {
        var payAmountValue = $("#payAmount").val();
        if (payAmountValue.indexOf(".") !== -1) {
            return false;
        }
    } else {
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
    }
    return true;
}

$(document).on('change', '.mandatoryField', function () {
    $('#loadAllApplicableFee').html('');
    //$("#singleMarkPaymentApprovedButtonId").hide();
    //$("#showHtml").hide();
});

$(document).on("change", "#fee_type_id", function () {
    $('#loadAllApplicableFee').html('');
    //$("#singleMarkPaymentApprovedButtonId").hide();
    //$("#showHtml").hide();
});

function markPaymentApprovedBtn() {
    if ($(document).find("#payAmount").val() == '') {
        $(document).find("#pay_partial_amount_error").html('Please enter amount');
        return false;
    }
    var baseFee = parseFloat($(document).find("#baseFee").val());
    var payAmount = parseFloat($(document).find("#payAmount").val());
    var allowMinPayment = parseInt($(document).find("#allowMinPayment").val());
    var allowInstallmentAmount = parseInt($(document).find("#allowInstallmentAmount").val());
    var currencyClass = $(document).find("#currencyClass").val();
    var validAmount = true;
    if (allowMinPayment === 1 && calculateAmount === 0) {
        validAmount = calculateAmountOffline();
    }
    if (validAmount === false) {
        return false;
    }
    var minAmount = parseFloat($(document).find("#minPayAmount").val());
    if (minAmount > baseFee) {
        $(document).find("#pay_partial_amount_error").html('Base fee is less than the minimum deposit applicable');
        return false;
    }
    var collegeId = $(document).find("#college_id").val();
    var valid = true;
    $("#dd_number_error").html('');
    $("#dd_date_error").html('');
    $("#bank_name_error").html('');
    if ($("input[name='payment_method']:checked").val() == 'DD') {
        if ($(document).find("#dd_number").val() == '') {
            $("#dd_number_error").html('Please enter dd number');
            valid = false;
        }
        if ($(document).find("#dd_number").val().length != 6) {
            $("#dd_number_error").html('Please enter 6 digit valid dd number');
            valid = false;
        }
        if ($(document).find("#dd_date").val() == '') {
            $("#dd_date_error").html('Please enter dd date');
            valid = false;
        }
        if ($(document).find("#bank_name").val() == '') {
            $("#bank_name_error").html('Please enter bank name');
            valid = false;
        }
        if ($(document).find("#remarks").val() == '') {
            $("#remarks_error").html('Please enter remarks');
            valid = false;
        }
//        if($(document).find("#bank_name").val() == '') {
//            $("#bank_name_error").html('Please enter bank name');
//            valid = false;
//        }
    } else if ($("input[name='payment_method']:checked").val() == 'Cash') {
        if ($(document).find("#cash_reciept").val() == '') {
            $("#cash_reciept_error").html('Please enter cash receipt number');
            valid = false;
        }
        if ($(document).find("#recipt_date").val() == '') {
            $("#recipt_date_error").html('Please enter receipt date date');
            valid = false;
        }
        if ($(document).find("#remarks").val() == '') {
            $("#remarks_error").html('Please enter remarks');
            valid = false;
        }
    } else if ($("input[name='payment_method']:checked").val() == 'Offline') {
        if ($(document).find("#remarks").val() == '') {
            $("#remarks_error").html('Please enter remarks');
            valid = false;
        }
    }
    
    if (valid === false) {
        return false;
    }


    if (allowInstallmentAmount === 1 && applicableTax === 1) {
        var modalBody = '<div>Applicant has paid <i class="' + currencyClass + '"></i>' + payAmount + '. <b>Only the base fee <i class="' + currencyClass + '"></i>' + baseFee + ' will be deducted from the Total Payable Amount</b></div>';
    } else if (allowInstallmentAmount === 1 && applicableTax === 0) {
        var modalBody = '<div><b>Applicant has paid <i class="' + currencyClass + '"></i>' + payAmount + ', which will be deducted from the Total Payable Amount</b></div>';
    } else {
        var modalBody = '<div><b>Applicant has paid <i class="' + currencyClass + '"></i>' + payAmount + '</b></div>';
    }
    modalBody += '<br><div>Are you sure you want to approve?</div>';
    modalBody += '<div>Once Approved, you cannot undo it.</div>';

    $('#ConfirmAlertYesBtn').unbind();
    $('#ConfirmAlertNoBtn').unbind();
    $("#ConfirmAlertPopUpSection").css({'z-index': '10000000'});
    $('#ConfirmAlertPopUpTextArea').html(modalBody);
    $("#ConfirmAlertPopUpTextArea").removeClass('font500');
    $('#ConfirmAlertPopUpSection .modal-title').html("Kindly Confirm");
    $("#ConfirmAlertPopUpSection").modal("show");
    $("#ConfirmAlertYesBtn").on("click", function () {
        feetype = $('#fee_type_id').find(':selected').data('feetype')
        if (feetype == 'npf') {
            markPaymentApprovedBtnUser()
        } else {
            generateOrder()
        }
    });
}

function markPaymentApprovedBtnUser() {
    var encryptValue = $('#fee_type_id').find(':selected').data('encrypt');

    var data = [];
    data = $(document).find('form#offlinePaymentApprovedForm').serializeArray();
    var payAmount = parseFloat($(document).find("#payAmount").val());
    data.push({name: "college_id", value: $('#college_id').val()});
    data.push({name: "fee_type_id", value: $('#fee_type_id').val()});
    data.push({name: "payment_mode", value: 'offline'});
    data.push({name: "encryptValue", value: encryptValue});
    data.push({name: "payAmount", value: payAmount});
    $.ajax({
        url: jsVars.markPaymentApprovedLink,
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('div.loader-block-a').show();
            document.getElementById("singleMarkPaymentApprovedButtonId").disabled = true;

        },
        complete: function () {
            $('div.loader-block-a').hide();
            document.getElementById("singleMarkPaymentApprovedButtonId").disabled = false;

        },
        success: function (response) {
            if (response.message === 'session') {
                location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
            }
            if (typeof response.status !== 'undefined' && response.status == 1 && typeof response.msg !== 'undefined' && response.msg != '') {
                $("#singleMarkPaymentApprovedMessageDiv").html("<div class='alert alert-success'>" + response.msg + "</div>");
                LoadMorePaymentConfig('reset');
                $('#singleMarkPaymentApprovedModal').modal('hide');
                alertPopup(response.msg, 'success');
            } else {
                $("#singleMarkPaymentApprovedMessageDiv").html("<div class='alert alert-danger'>" + response.message + "</div>");
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/*
 * generate order for offline unipe
 */

function generateOrder() {
    var encryptValue = $('#fee_type_id').find(':selected').data('encrypt');
    //data.push({name: "college_id", value: $('#college_id').val()});
    //data.push({name: "fee_id", value: $('#fee_type_id').val()});
    //data.push({name: "form_id", value: $('#fee_type_id').val()});
    //var data = [];
    //data.push({name: "encryptValue", value: encryptValue});
    //data.push({name: "payAmount", value: payAmount});
    //console.log(data)
    var payAmount = parseFloat($(document).find("#payAmount").val());
    $.ajax({
        url: jsVars.FULL_URL + '/process/generate-order',
        type: 'post',
        dataType: 'json',
        async: true,
        data: {
            "feeData": encryptValue,
            "payAmount": payAmount
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('.newLoader').show();
        },
        success: function (data) {
            if (data['payment_id']) {
                unipeMarkOfflinePaymentStatus(data['payment_id'], data['order_id'])
            } else {
                $('.newLoader').hide();
                var error = 'Something went wrong!';
                if (data['error']) {
                    error = data['error'];
                }
                alertPopup(error, 'error');
            }
        },
        complete: function () {
            //$('.newLoader').hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/*
 *
 * @returns {undefined|Boolean}
 */

function unipeMarkOfflinePaymentStatus(payment_id, order_id) {
    var encryptValue = $('#fee_type_id').find(':selected').data('encrypt');
    data = $(document).find('form#offlinePaymentApprovedForm').serializeArray();
    pay_partial_amount = $('#payAmount').val()


    data.push({name: "pay_partial_amount", value: pay_partial_amount});
    data.push({name: "college_id", value: $('#college_id').val()});
    data.push({name: "fee_type_id", value: $('#fee_type_id').val()});
    data.push({name: "payment_mode", value: 'offline'});
    data.push({name: "feeData", value: encryptValue});
    data.push({name: "payment_id", value: payment_id});
    data.push({name: "order_id", value: order_id});

    installmentDataId = $('#fee_type_id').find(':selected').data('feetype') + '_' + $('#fee_type_id').val() + '_' + $('#fee_type_id').find(':selected').data('count')
    installmentData = $('#' + installmentDataId).val()
    data.push({name: "installmentData", value: installmentData});
    partial_payment = $('#fee_type_id').find(':selected').data('partial')
    data.push({name: "partial_payment", value: partial_payment});
    $.ajax({
        url: jsVars.FULL_URL + '/payment-manager/unipe-mark-offline-payment-status',
        type: 'post',
        dataType: 'json',
        async: true,
        data: data,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('.newLoader').show();
        },
        success: function (response) {
            if (response.message === 'session') {
                location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
            }
            if (typeof response.status !== 'undefined' && response.status == 1 && typeof response.msg !== 'undefined' && response.msg != '') {
                $("#singleMarkPaymentApprovedMessageDiv").html("<div class='alert alert-success'>" + response.msg + "</div>");
                LoadMorePaymentConfig('reset');
                $('#singleMarkPaymentApprovedModal').modal('hide');
                alertPopup(response.msg, 'success');
            } else {
                $("#singleMarkPaymentApprovedMessageDiv").html("<div class='alert alert-danger'>" + response.message + "</div>");
            }
        },
        complete: function () {
            //$('.newLoader').hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/**
 * For Download Documents
 * @returns {undefined}
 */
function downloadBulkAckReceipt() {
    if (($('#fee_product_type').val() == 'all' || $('#fee_product_type').val() == '') && $('#payment_status').val() != '5') {
        alertPopup('Please select Fee Product Type and Payment Status Approved filter to download', 'error');
        return false;
    }
    if ($('#fee_product_type').val() == 'all' || $('#fee_product_type').val() == '') {
        alertPopup('Please select Fee Product Type filter', 'error');
        return false;
    }
    if ($('#payment_status').val() != '5') {
        alertPopup('Please select Payment Status Approved filter', 'error');
        return false;
    }

    var total_checked = 0;
    var display_popup = false;
    var message = 'Please select applicant(s) for which document is to be downloaded';
    $('input:checkbox[name="selected_payment_id[]"]').each(function () {
        if (this.checked) {
            display_popup = true;
            total_checked++;
        }
    });

    var select_all = $('#select_all:checked').val();

    if (select_all === null || typeof select_all === 'undefined') {
        select_all = '';
    }

    if (display_popup == false && select_all != 'select_all') {
        alertPopup(message, 'error');
        return;
    }

    var data = $('#FilterApplicationForms').serializeArray();
    $.ajax({
        url: '/paymentManager/downloadDocuments',
        type: 'post',
        dataType: 'json',
        data: data,
        beforeSend: function (xhr) {
//           showLoader();
            //$(".expandableSearch .btn-default").prop("disabled",true);
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if (typeof data.error !== 'undefined' && data.error !== '') {
                if (data.error == 'session') {
                    location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(data.error, 'error');
                    return;
                }
            } else if (typeof data.success !== 'undefined' && data.success == 1) {
                $('#bulk-document-details .modal-header  button[type="button"]').addClass('close npf-close');
                $("#bulk-document-details").css('z-index', 11001);

                var html = '<div class="rowSpaceReduce"><div class="col-sm-8"><select name="doc_folder_structure" id="doc_folder_structure" class="chosen-select" tabindex="-1"><option value="">Select Folder Structure</option>';
                $.each(data.folderList, function (key, value) {
                    html += '<option value="' + key + '">' + value + '</option>';
                });
                html += '</select></div></div><div class="table-responsive table-border margin-top-10">';
                html += '<table class="table table-hover table-condensed">';
                html += '<tbody>';
                $.each(data.fieldList, function (fieldName, label) {
                    html += '<tr><td>' + label + '</td><td class="text-right"><div class="toggle__checkbox"><input type="checkbox" name="download_doc[]" id="download_doc_' + fieldName + '" value=' + fieldName + '><label for="download_doc_' + fieldName + '">Toggle</label></div></td></tr>';
                });
                html += '</tbody></table></div>';
                html += '<div class="margin-top-20"><button name="downloadReceiptBtnId" id="downloadReceiptBtnId" value="Download" type="button" onclick="javascript:confirmBulkDownloadReceipt()" class="btn btn-npf pull-right m-0"><i class="fa fa-download" aria-hidden="true"></i>&nbsp;Download</button></div><style>.chosen-container .chosen-single span{font-weight:500;}</style>';

                $('#bulk-document-details .modal-body').html(html);
                $('#bulk-document-details .modal-title').html('Acknowledgement Receipt Download');

                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                $('.chosen-select').trigger('chosen:updated');

                $('#bulk-document-details').modal();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function () {
            hideLoader();
        }
    });
}


function confirmBulkDownloadReceipt() {
    var data = $('#FilterApplicationForms').serializeArray();
    var array = [];
    $("input:checkbox[name='download_doc[]']:checked").each(function () {
        array.push($(this).val());
    });

    if ($('#doc_folder_structure').val() == '') {
        alertPopup('Please select folder structure.', 'error');
        return false;
    }

    if (array.length == 0) {
        alertPopup('Please select atleast one document(s) for download.', 'error');
        return false;
    }

    data.push({name: "download_doc", value: array});
    data.push({name: "doc_folder_structure", value: $('#doc_folder_structure').val()});
    $('#downloadReceiptBtnId').attr("disabled", "disabled");
    $.ajax({
        url: '/paymentManager/confirmBulkDownloadReceipt',
        type: 'post',
        dataType: 'json',
        data: data,
        beforeSend: function (xhr) {
//           showLoader();
            //$(".expandableSearch .btn-default").prop("disabled",true);
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#downloadReceiptBtnId').removeAttr('disabled');
            if (typeof data.error !== 'undefined' && data.error !== '') {
                if (data.error == 'session') {
                    location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(data.error, 'error');
                    return;
                }
            } else if (typeof data.totalRecord !== 'undefined' && data.totalRecord !== '') {
                $("#ConfirmPopupArea").css({'z-index': '120000'});
                $('#ConfirmMsgBody').html('You have requested to download documents for ' + data.totalRecord + ' Applicant(s). Would you like to proceed?');
                $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
                        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                    e.preventDefault();

                    $('#ConfirmPopupArea').modal('hide');
                    saveBulkDownloadReceipt(data.totalRecord);
                });
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#downloadReceiptBtnId').removeAttr('disabled');
        },
        complete: function () {
            hideLoader();
        }
    });
}

function saveBulkDownloadReceipt(totalRecord) {
    var data = $('#FilterApplicationForms').serializeArray();
    var array = [];
    $("input:checkbox[name='download_doc[]']:checked").each(function () {
        array.push($(this).val());
    });
    data.push({name: "download_doc", value: array});
    data.push({name: "doc_folder_structure", value: $('#doc_folder_structure').val()});
    data.push({name: "total_record", value: totalRecord});
    $('#downloadReceiptBtnId').attr("disabled", "disabled");
    $.ajax({
        url: '/paymentManager/saveDownloadRequestData',
        type: 'post',
        dataType: 'json',
        data: data,
        beforeSend: function (xhr) {
//           showLoader();
            //$(".expandableSearch .btn-default").prop("disabled",true);
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#downloadReceiptBtnId').removeAttr('disabled');
            if (typeof data.error !== 'undefined' && data.error !== '') {
                if (data.error == 'session') {
                    location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(data.error, 'error');
                    return;
                }
            } else if (typeof data.success !== 'undefined' && data.success == 1) {

                $('#bulk-document-details').modal('hide');

                if (typeof data.downloadRequestListModule !== 'undefined' && data.downloadRequestListModule == 1) {
                    $('#showlink').hide();
                }
                if (typeof data.downloadUrl !== 'undefined' && data.downloadUrl !== '') {
                    $('#downloadListing').attr('href', data.downloadUrl);
                }

                $('#requestMessage').html('bulk document download');
                $('#muliUtilityPopup').modal('show');

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#downloadReceiptBtnId').removeAttr('disabled');
        },
        complete: function () {
            hideLoader();
        }
    });
}

function selectAllPayments(elem) {
    showLoader();
    $("#selectionRow").hide();
    $("#clearSelectionLink").hide();
    $('#select_all').attr('checked', false);
    if (elem.checked) {
        //console.log(elem.checked);
        $("#selectAllAvailableRecordsLinkSpan").html('<a id="selectAllAvailableRecordsLink" href="javascript:void(0);" onclick="selectAllAvailableRecords(' + $("#all_records_val").val() + ');"> Select all <b>' + $("#all_records_val").val() + '</b>&nbsp;Payments</a>');
        $('.select_payment').each(function () {
            this.checked = true;
        });
        var recordOnDisplay = $('input:checkbox[name="selected_payment_id[]"]').length;
        $("#currentSelectionMessage").html("All " + recordOnDisplay + " payments on this page are selected. ");
        $("#selectionRow").show();
        $("#selectAllAvailableRecordsLink").show();
        $("#clearSelectionLink").hide();
    } else {
        $('.select_payment').attr('checked', false);
        $("#selectAllAvailableRecordsLink").hide();
    }

    hideLoader();
}

function selectAllAvailableRecords(totalAvailableRecords) {
    $("#selectionRow").show();
    $("#selectAllAvailableRecordsLink").hide();
    $("#clearSelectionLink").show();
    $("#currentSelectionMessage").html("All " + totalAvailableRecords + " payments are selected.");
    $('#select_all').each(function () {
        this.checked = true;
    });
    $('.select_payment').attr('checked', true);
}

function clearSelection() {
    $("#selectionRow").hide();
    $("#selectAllAvailableRecordsLink").hide();
    $("#clearSelectionLink").hide();
    $('.select_payment').attr('checked', false);
    $('#select_page_payment_ids').attr('checked', false);
    $('#select_all').attr('checked', false);
}

$(document).on('click', '.select_payment', function (e) {
    $("#selectionRow").hide();
    $("#selectAllAvailableRecordsLink").hide();
    $("#clearSelectionLink").hide();
    $('#select_all').attr('checked', false);
    $('#select_page_payment_ids').attr('checked', false);
});

function sentUniversityConfirmationPopup(purchaseSummaryId, params) {

    $('#ConfirmAlertYesBtn').unbind();
    $('#ConfirmAlertNoBtn').unbind();
    $('#ConfirmAlertPopUpTextArea').html("Are you sure you have dispatched this to the university?");
    $("#ConfirmAlertPopUpTextArea").removeClass('font500');
    $('#ConfirmAlertPopUpSection .modal-title').html("Kindly Confirm");
    $("#ConfirmAlertPopUpSection").modal("show");
    $("#ConfirmAlertYesBtn").on("click", function () {
        sentPaymentToUniversity(purchaseSummaryId, params);
    });
}

function sentPaymentToUniversity(purchaseSummaryId, params) {
    if (purchaseSummaryId == '' || params == '') {
        return false;
    }
    $.ajax({
        url: '/paymentManager/sentPaymentToUniversity',
        type: 'post',
        dataType: 'json',
        data: {'params': params},
        headers: {"X-CSRF-Token": jsVars.csrfToken},
        success: function (response) {
            if (response.message === 'session') {
                location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
            } else if (response.status === 1) {
                alertPopup('This payment successfully sent to university', 'success');
                $(document).find('#sentToUniv_' + purchaseSummaryId).remove();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

// this will bind all sorting icon.
$(document).on('click', 'span.sorting_span i', function () {

//    console.log(this);
    jQuery("span.sorting_span i").removeClass('active');
    var field = jQuery(this).data('column');
    var data_sorting = jQuery(this).data('sorting');
    $('#sort_options').val(field + "|" + data_sorting);
//    console.log(this);
//    console.log($(this).attr('class'));
    jQuery(this).addClass('active_pp');
    LoadMorePaymentConfig('reset', 'sorting');
});


//Save Cash Payment Status Form
$(document).on('submit', 'form#ddPaymentApprovedForm', function (e) {
    e.preventDefault();
    $('.help-block').text('');
    var data = $(this).serializeArray();
    data.push({name: 'area', value: 'saveDDInfo'});
    $('.loader-block-a').show();
    $(this).ajaxSubmit({
        url: '/payment-manager/saveApplicationDDInfo',
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            $('.loader-block-a').hide();
            if ((typeof json['error'] != 'undefined') && (json['error'] == 'session'))
            {
                location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
            } else if (typeof json['error'] != 'undefined') {
                $("span#ddPaymentErrorSpan").html(json['error']);
            } else {
                $("#ConfirmAlertPopUpSection, #CashPaymentModalBox").modal("hide");
                alertPopup('DD details updated successfully.', 'success');
                LoadMorePaymentConfig("reset");
            }
        },
        resetForm: false
    });
});

function ddPaymentRejected() {
    var notes = $('input#ddNotes').val();
    if ($.trim(notes) == "") {
        $('span#spanDDNotes').text('Please enter note of reason.');
        $('span#spanDDNotes').parent().parent('div.formAreaCols').addClass('has-error is-focused');
        return;
    }
    $('#ConfirmAlertYesBtn').unbind();
    $('#ConfirmAlertNoBtn').unbind();
    $('#ConfirmAlertPopUpTextArea').html("Are you sure you want to reject it?");
    $("#ConfirmAlertPopUpTextArea").removeClass('font500');
    $('#ConfirmAlertPopUpSection .modal-title').html("Kindly Confirm");
    $("#ConfirmAlertPopUpSection").modal("show").css('z-index', '11111');
    $("#ConfirmAlertYesBtn").on("click", function (e) {
        e.preventDefault();
        $('.help-block').text('');
        $('div.formAreaCols').removeClass('has-error is-focused');
        var data = $('form#ddPaymentApprovedForm').serializeArray();
        data.push({name: 'ddRejected', value: 1});
        $('.loader-block-a').show();
        $(this).ajaxSubmit({
            url: '/payment-manager/saveApplicationDDInfo',
            type: 'post',
            data: data,
            dataType: 'json',
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            success: function (json) {
                $('.loader-block-a').hide();
                if ((typeof json['error'] != 'undefined') && (json['error'] == 'session'))
                {
                    location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
                } else if (typeof json['error'] != 'undefined') {
                    $("span#ddPaymentErrorSpan").html(json['error']);
                } else {
                    $("#ConfirmAlertPopUpSection, #CashPaymentModalBox").modal("hide");
                    alertPopup('DD details updated successfully.', 'success');
                    LoadMorePaymentConfig("reset");
                }
            },
            resetForm: false
        });
    });
}

function markSinglePaymentApprovedNew(params) {
    $('#singleMarkPaymentApprovedModal').on('show.bs.modal', function () {
        $('body').removeClass('vScrollRemove');
        $('body').addClass('overflowHidden');
    });
    $('#singleMarkPaymentApprovedModal').on('hidden.bs.modal', function () {
        $('body').removeClass('overflowHidden');
    })

    $("#singleMarkPaymentApprovedMessageDiv").html("");
    $('#singleMarkPaymentApprovedModal').modal('show');
    $('[data-toggle="tooltip"]').tooltip();
    $('#singleMarkPaymentApprovedModal .modal-dialog').addClass('modal-sm');
    $('#fee_form_id').val('')
    $('#fee_form_id').trigger('chosen:updated');
    $('#applicantEmailId').val('');
    $('#ApplicationNo').val('');
    $('#lpuRegNo').val('');
    value = 'offline'
    $('.allOfflinePaymentApprovedJsClass').hide();
    $('.' + value + 'OfflinePaymentApprovedClass').show();
    if (value == 'offline') {
        $('#showHtml').hide();
        $('#singleMarkPaymentApprovedButtonId').hide();
    }
    $('#fee_type_id').closest('.labelUpContainer').hide();

}
/******************************* For Single Payment Code Start Here *************************************/
function getAllAvailbleFees(params) {
    $('span#applicantApplicationNoDiv_error, span#applicantEmailId_error, span#formListDiv2_error, span#lpuRegNoDiv_error').text('');
    var data = [];
    if ($('#college_id').val() == '' || $('#college_id').val() == 0) {
        alertPopup('Please select college.', 'error');
        return false;
    }
    if ($('#emailId').is(":visible") && $('#applicantEmailId').val() == '') {
        $('span#applicantEmailId_error').text('Please enter email id');
        return false;
    }
    if ($('#applicantApplicationNoDiv').is(":visible")) {
        
        var error = false;
        if ($('#fee_form_id').val() == null || $('#fee_form_id').val() == '0') {
            $('span#formListDiv2_error').text('Please select form');
            error = true;
        }
        if ($('#ApplicationNo').val() == '') {
            $('span#applicantApplicationNoDiv_error').text('Please enter application no');
            error = true;
        }
        
        if (error == true) {
            return false;
        }
    }
    if ($('#lpuRegNoDiv').is(":visible")) {
        var error = false;
        if ($('#fee_form_id').val() == null || $('#fee_form_id').val() == 0) {
            $('span#formListDiv2_error').text('Please select form');
            error = true;
        }
        if ($('#lpuRegNo').val() == '') {
            $('span#lpuRegNoDiv_error').text('Please enter registration no');
            error = true;
        }
        
        if (error == true) {
            return false;
        }
    }
    data = $('form#offlinePaymentApprovedForm').serializeArray();
    data.push({name: "collegeId", value: $("#college_id").val()});
    data.push({name: "formId", value: $('#fee_form_id').val()});
    if (typeof params !== 'undefined') {
        data.push({name: "params", value: params});
    }
    $.ajax({
        url: jsVars.allPaymentDataLink,
        type: 'post',
        data: data,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            //$('div.loader-block-a').show();
            $('div.modalLoader').show();
        },
        complete: function () {
            //$('div.loader-block-a').hide();
            $('div.modalLoader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (typeof responseObject.message !== 'undefined' && responseObject.message !== '') {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
                } else if (responseObject.message === 'invalid_email') {
                    $('span#applicantEmailId_error').text('Entered email id is invalid');
                } else if (responseObject.message === 'not_eligible') {
                    alertPopup('You are not eligible to pay the fee.', 'error');
                } else {
                    alertPopup('There is some error', 'error');
                }
            } else if (responseObject.data !== 'undefined') {
                if (typeof responseObject.data.applicableFeeArr !== 'undefined' && responseObject.data.applicableFeeArr !== '') {
                    var fee_type_html = '<option value="" selected="selected">Select Fee</option>';
                    count = 1
                    $.each(responseObject.data.applicableFeeArr, function (index, item) {
                        installmentData = JSON.stringify(item.installmentData)
                        installmentDataId = item.fee_type + '_' + item.fee_type_id + '_' + count

                        installmentField = '<input type="hidden" id="' + installmentDataId + '" value=' + installmentData + '>';
                        $('#fee_type_id').after(installmentField)

                        fee_type_html += '<option data-partial = "' + item.partial + '" data-count = "' + count + '" data-encrypt = "' + index + '" data-feeType="' + item.fee_type + '" value="' + item.fee_type_id + '">' + item.fee_title + '</option>';
                        count = count + 1
                    });
                    $('#fee_type_id').closest('.labelUpContainer').show()
                    $('#fee_type_id').html(fee_type_html).trigger('chosen:updated');

                    var html = '';
                    var paymentModeName = '';
                    var allPaymentModeCounter = 0;
                    $.each(responseObject.data.paymentAttributes, function (paymentMode, attributes) {
                        if (allPaymentModeCounter == 0) {
                            paymentModeName = paymentMode;
                        }
                        html += '<div id="' + paymentMode + 'DivId">';
                        var dynamicClass = paymentMode + 'OfflinePaymentApprovedClass';
                        $.each(attributes, function (fieldName, fieldAttributes) {
                            switch (fieldAttributes['field_type']) {
                                case 'text':
                                    var textboxValue = '';
                                    if (typeof fieldAttributes['value'] !== 'undefined' && fieldAttributes['value'] != '') {
                                        textboxValue = fieldAttributes['value'];
                                    }

                                    var disabled = false;
                                    if (typeof fieldAttributes['disabled'] !== 'undefined' && fieldAttributes['disabled'] == 1) {
                                        disabled = 'disabled="disabled"';
                                    }
                                    html += '<div class="row labelUpContainer allOfflinePaymentApprovedJsClass ' + dynamicClass + '" style="display:none;">';
                                    html += '<div class="col-sm-4"><label class="control-label">' + fieldAttributes['label'] + '<span class="requiredStar">*</span>:</label></div><div class="col-sm-8"><input type="text" name="' + fieldName + '" id="' + fieldAttributes['id'] + '" label="false" class="form-control" placeholder="' + fieldAttributes['placeholder'] + '" value="' + textboxValue + '" ' + disabled + '>';
                                    html += '<span class="error" id="' + fieldAttributes['id'] + '_error"><span/></div>';
                                    html += '</div>';
                                    break;
                                case 'checkbox':
//                                    html += '<div class="labelUpContainer allOfflinePaymentApprovedJsClass '+dynamicClass+'" ><div class="toggle__checkbox">';
//                                    if(typeof fieldAttributes['valueList'] !== 'undefined') {
//                                        $.each(fieldAttributes['valueList'], function(checkboxValue,checkboxLabel) {
//                                            html += fieldAttributes['label']+'<input type="checkbox" name="'+fieldName+'" id="'+fieldAttributes['id']+'" value="'+checkboxValue+'" label="false">';
//                                        })
//                                    }
//                                    html += '<label style="margin-left:10px;" data-id="'+fieldAttributes['id']+'" onclick="" class="dash_2 " for="'+fieldAttributes['id']+'">Toggle</label></div></div>';
                                    html += '<div class="row labelUpContainer allOfflinePaymentApprovedJsClass ' + dynamicClass + '" style="display:none;">';
                                    html += '<div class="col-sm-4 col-xs-12 margin-top-8"><label class="control-label">Choose Payment Method <span class="requiredStar">*</span></label></div>'
                                    html += '<div class="col-sm-8 col-xs-12">\n\
                                                <div class="radio radio-primary">\n\
                                                    <input type="hidden" name="payment_method" value="">\n\
                                                    <label for="payment-method-cash">\n\
                                                        <input type="radio" name="payment_method" value="Cash" id="payment-method-cash" checked="checked">\n\
                                                            <span class="radio-text">Cash</span>\n\
                                                    </label>\n\
                                                    <label class="margin-left-15" for="payment-method-dd">\n\
                                                        <input type="radio" name="payment_method" value="DD" id="payment-method-dd">\n\
                                                            <span class="radio-text margin-right-15">DD</span>\n\
                                                    </label>\n\
                                                    <label class="margin-left-15" for="payment-method-offline">\n\
                                                        <input type="radio" name="payment_method" value="Offline" id="payment-method-offline">\n\
                                                            <span class="radio-text margin-right-15">Bank Transfer</span>\n\
                                                    </label>\n\
                                                </div>\n\
                                            </div>';
                                    html += '</div>';
                                    break;
                                case 'datepicker':
                                    html += '<div class="row labelUpContainer  dateFormGroup allOfflinePaymentApprovedJsClass ' + dynamicClass + '" style="display:none;">';
                                    html += '<div class="col-sm-4"><label class="control-label">' + fieldAttributes['label'] + '<span class="requiredStar">*</span>:</label></div><div class="col-sm-8"><div class="iconDate" style="right:25px"><i class="fa fa-calendar-check-o" aria-hidden="true"></i></div>';
                                    html += '<input type="text" name="' + fieldName + '" placeholder="' + fieldAttributes['placeholder'] + '" class="form-control" id="' + fieldAttributes['id'] + '"/>';
                                    html += '<span class="error" id="' + fieldAttributes['id'] + '_error"><span/></div>';
                                    html += '</div>';
                                    break;
                                case 'textarea':
                                    html += '<div class="row labelUpContainer allOfflinePaymentApprovedJsClass ' + dynamicClass + '" style="display:none;">';
                                    html += '<div class="col-sm-4"><label class="control-label">' + fieldAttributes['label'] + '<span class="requiredStar">*</span>:</label></div><div class="col-sm-8"><textarea name="' + fieldName + '" id="' + fieldAttributes['id'] + '" label="false" class="form-control" placeholder="' + fieldAttributes['placeholder'] + '"></textarea>';
                                    html += '<span class="error" id="' + fieldAttributes['id'] + '_error"><span/></div>';
                                    html += '</div>';
                                    break;
                            }
                        });
                        html += '</div>';
                        allPaymentModeCounter++;
                    });

                    $('#showHtml').html(html);
                    var ddPlaceholder = $('#dd_date').attr('placeholder');
                    $('#dd_date').datepicker({format: 'dd/mm/yyyy', endDate: 'today'})
                            .on('hide', function (e) {
                                if (this.value != '') {
                                    $(this).parent().addClass('floatify__active');
                                    $(this).attr('placeholder', '');
                                } else {
                                    $(this).parent().removeClass('floatify__active');
                                    $(this).attr('placeholder', ddPlaceholder);
                                }
                            })

                    var cashPlaceholder = $('#recipt_date').attr('placeholder');
                    $('#recipt_date').datepicker({format: 'dd/mm/yyyy', endDate: 'today'})
                            .on('hide', function (e) {
                                if (this.value != '') {
                                    $(this).parent().addClass('floatify__active');
                                    $(this).attr('placeholder', '');
                                } else {
                                    $(this).parent().removeClass('floatify__active');
                                    $(this).attr('placeholder', cashPlaceholder);
                                }
                            })
                    $('#dd_number').parents('.labelUpContainer').hide()
                    $('#bank_name').parents('.labelUpContainer').hide()
                    $('#dd_date').parents('.labelUpContainer').hide()
                }
            }


        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function validateBulkOfflinePaymentApproved() {
    showHideField('offline');
    $("#singleMarkPaymentApprovedMessageDiv").html("");
    installmentDetailsArr = '';
    if ($('#college_id').val() == '' || $('#college_id').val() == 0) {
        $("#singleMarkPaymentApprovedMessageDiv").html("<div class='alert alert-danger'>Please select College.</div>");
        return false;
    } else if ($.trim($('#ApplicationNo').val()) == '' && $.trim($('#applicantEmailId').val()) == '' && $.trim($('#lpuRegNo').val()) == '') {
        var collegeId = $('#college_id').val();
        var validationText = 'Email/Application No';
        if (collegeId == 524) {
            validationText = 'Email/Application No/Reg No';
        }
        if ($('#fee_type_id').val() == '') {
            $("#singleMarkPaymentApprovedMessageDiv").html("<div class='alert alert-danger'>Please select " + validationText + " and Fee product name to mark payment of Applicant</div>");
        } else {
            $("#singleMarkPaymentApprovedMessageDiv").html("<div class='alert alert-danger'>Please select " + validationText + ".</div>");
        }
        return false;
    } else if ($('#fee_type_id').val() == '') {
        $("#singleMarkPaymentApprovedMessageDiv").html("<div class='alert alert-danger'>Please select Fee Type.</div>");
        return false;
    } else if ($.trim($('#ApplicationNo').val()) != '' && ($('#fee_form_id').val() == '' || $('#fee_form_id').val() == 0)) {
        $("#singleMarkPaymentApprovedMessageDiv").html("<div class='alert alert-danger'>Please select Form.</div>");
        return false;
    } else {
        $("#singleMarkPaymentApprovedMessageDiv").html("");
    }


//    data = $('form#offlinePaymentApprovedForm').serializeArray();
//    data.push({name: "college_id", value: $('#college_id').val()});
//    data.push({name: "form_id", value: $('#fee_form_id').val()});
//    data.push({name: "fee_type_id", value: $('#fee_type_id').val()});
//    data.push({name: "feeType", value: $('#fee_type_id').find(':selected').data('feetype')});


    installmentDataId = $('#fee_type_id').find(':selected').data('feetype') + '_' + $('#fee_type_id').val() + '_' + $('#fee_type_id').find(':selected').data('count')
    installmentData = $('#' + installmentDataId).val()

    installmentData = $.parseJSON(installmentData);

    $(document).find('#installmentDetails').remove();
    $(document).find("#showHtml").show();
    $("#singleMarkPaymentApprovedButtonId").show();
    $("#offlineDivId").prepend('<div id="installmentDetails"></div>');
    var feeType = $('#fee_type_id').find(':selected').data('feetype')
    partial_payment = $('#fee_type_id').find(':selected').data('partial')
    $('input:radio[id=payment-method-cash]').trigger('click');
    $('input:radio[id=payment-method-offline]').parent('label').hide();
    if (feeType == 'unipe' && partial_payment) {
        var encryptValue = $('#fee_type_id').find(':selected').data('encrypt');
        data = $(document).find('form#offlinePaymentApprovedForm').serializeArray();
        data.push({name: "college_id", value: $('#college_id').val()});
        data.push({name: "fee_type_id", value: $('#fee_type_id').val()});
        data.push({name: "payment_mode", value: 'offline'});
        data.push({name: "feeData", value: encryptValue});
        //data.push({name: "payment_id", value: payment_id});
        data.push({name: "installmentData", value: $('#' + installmentDataId).val()});
        //data.push({name: "order_id", value: order_id});
        $.ajax({
            url: '/payment-manager/get-partial-due-amount',
            type: 'post',
            data: data,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                //currentObj.text('Wait..');
            },
            success: function (response) {

                if (response.status == 1) {
                    addInstallmentDetailsHtml(response.data);
                    $('#' + installmentDataId).val(JSON.stringify(response.data))
                }
                $('#dd_number').parents('.labelUpContainer').hide()
                $('#bank_name').parents('.labelUpContainer').hide()
                $('#dd_date').parents('.labelUpContainer').hide()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                ;
            }
        });
    } else {
        addInstallmentDetailsHtml(installmentData);
        if (feeType == 'unipe') {
            //Do not Show Bank Transfer Payment Option
        } else {
            $('input:radio[id=payment-method-offline]').parent('label').show();
        }
    }

    $('#dd_number').parents('.labelUpContainer').hide()
    $('#bank_name').parents('.labelUpContainer').hide()
    $('#dd_date').parents('.labelUpContainer').hide()
}

$(document).on('change', 'input:radio[name=payment_method]:checked', function () {
    if ($("input[name='payment_method']:checked").val() == 'DD') {
        $("#dd_number_error, #dd_number_error, #dd_date_error, #bank_name_error, #remarks_error").html('');
        $('#cash_reciept, #recipt_date, #remarks').val('');
        $('#cash_reciept').parents('.labelUpContainer').hide();
        $('#recipt_date').parents('.labelUpContainer').hide();

        $('#dd_number').parents('.labelUpContainer').show();
        $('#bank_name').parents('.labelUpContainer').show();
        $('#dd_date').parents('.labelUpContainer').show();
    } else if ($("input[name='payment_method']:checked").val() == 'Cash') {
        $("#cash_reciept_error, #recipt_date_error, #remarks_error").html('');
        $('#dd_number, #bank_name, #dd_date, #remarks').val('');
        $('#dd_number').parents('.labelUpContainer').hide()
        $('#bank_name').parents('.labelUpContainer').hide()
        $('#dd_date').parents('.labelUpContainer').hide()

        $('#cash_reciept').parents('.labelUpContainer').show()
        $('#recipt_date').parents('.labelUpContainer').show()
    } else if ($("input[name='payment_method']:checked").val() == 'Offline') {
        $("#dd_number_error, #dd_number_error, #dd_date_error, #bank_name_error, #cash_reciept_error, #recipt_date_error, #remarks_error").html('');
        $('#dd_number, #bank_name, #dd_date, #cash_reciept, #recipt_date, #remarks').val('');
        $('#dd_number, #bank_name, #dd_date, #cash_reciept, #recipt_date').parents('.labelUpContainer').hide();
    }
});

function paymentRejected(payment_id,form_id,college_id,fee_type_id) {


    var data = [];
    data.push({name: "collegeId", value: college_id});
    data.push({name: "formId", value: form_id});
    data.push({name: "payment_id", value: payment_id});
    data.push({name: "fee_type_id", value: fee_type_id});
    console.log('data1',data,'paymentRejectedLink',jsVars.paymentRejectedLink)
    $('#ConfirmAlertYesBtn').unbind();
    $('#ConfirmAlertNoBtn').unbind();
    $('#ConfirmAlertPopUpTextArea').html("Are you sure you want to reject it?");
    $("#ConfirmAlertPopUpTextArea").removeClass('font500');
    $('#ConfirmAlertPopUpSection .modal-title').html("Kindly Confirm");
    $("#ConfirmAlertPopUpSection").modal("show").css('z-index','11111');
    $("#ConfirmAlertYesBtn").on("click",function(e) {
        $.ajax({
            url: jsVars.paymentRejectedLink,
            type: 'post',
            data: data,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars.csrfToken
            },
            beforeSend: function () {
                $('div.loader-block-a').show();
            },
            complete: function () {
                $('div.loader-block-a').hide();
            },
            success: function (json) {
                 $('div.loader-block-a').hide();
                 console.log('json',json)
                if ((typeof json['error'] != 'undefined') && (json['error'] == 'session'))
                {
                    location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
                } else if(typeof json['error'] != 'undefined') {
                    $("span#ddPaymentErrorSpan").html(json['error']);
                } else {
                    $("#ConfirmAlertPopUpSection, #CashPaymentModalBox").modal("hide");
                    alertPopup('Payment updated successfully.','success');
                    LoadMorePaymentConfig("reset");
                }

            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });

}
$(document).on("change", "#search_common", function () {
    is_filter_button_pressed = 0;
});

function getEmailfield() {
    var email = document.getElementById("emailId");
    var application = document.getElementById("applicantApplicationNoDiv");
    var feetype = document.getElementById("feetypeRow");
    var showTable = document.getElementById("showHtml");
    document.querySelector('#applicantEmailId').value = '';
    document.querySelector('#ApplicationNo').value = '';
    document.querySelector('#fee_form_id').value = '';
    $('#formListDiv2').prev('div').find('label').html('Form Name:');
    $('#formListDiv2_error, applicantEmailId_error').text('');
    $('.chosen-select').trigger('chosen:updated');
    document.getElementById('offlinePaymentApprovedForm').reset();
    document.getElementById("applicationTab").classList.remove("active");
    document.getElementById("emailTab").className = " active";
    if ($('div#lpuRegNoDiv').length > 0) {
        document.querySelector('#lpuRegNo').value = '';
        document.getElementById("lpuRegTab").classList.remove("active");
    }
    if (email.style.display === "none") {
        email.style.display = "block";
        application.style.display = "none";
        feetype.style.display = "none";
        showTable.style.display = "none";
        if ($('div#lpuRegNoDiv').length > 0) {
            var lpuRegNo = document.getElementById("lpuRegNoDiv");
            lpuRegNo.style.display = "none";
        }
    }
}


function getAppicationfield() {
    var application = document.getElementById("applicantApplicationNoDiv");
    var email = document.getElementById("emailId");
    var feetype = document.getElementById("feetypeRow");
    var showTable = document.getElementById("showHtml");
    $('#formListDiv2').prev('div').find('label').html('Form Name: <span class="requiredStar">*</span>');
    $('#formListDiv2_error, applicantApplicationNoDiv_error').text('');
    document.querySelector('#applicantEmailId').value = '';
    document.querySelector('#ApplicationNo').value = '';
    document.querySelector('#fee_form_id').value = '';
    $('#ApplicationNo').attr('readonly', false);
    $('.chosen-select').trigger('chosen:updated');
    document.getElementById('offlinePaymentApprovedForm').reset();
    document.getElementById("emailTab").classList.remove("active");
    document.getElementById("applicationTab").className = " active";
    if ($('div#lpuRegNoDiv').length > 0) {
        document.querySelector('#lpuRegNo').value = '';
        document.getElementById("lpuRegTab").classList.remove("active");
    }
    if (application.style.display === "none") {
        application.style.display = "block";
        email.style.display = "none";
        feetype.style.display = "none";
        showTable.style.display = "none";
        if ($('div#lpuRegNoDiv').length > 0) {
            var lpuRegNo = document.getElementById("lpuRegNoDiv");
            lpuRegNo.style.display = "none";
        }
    }
}

function getLpuRegfield() {
    var lpuRegNo = document.getElementById("lpuRegNoDiv");
    var application = document.getElementById("applicantApplicationNoDiv");
    var email = document.getElementById("emailId");
    var feetype = document.getElementById("feetypeRow");
    var showTable = document.getElementById("showHtml");
    $('#formListDiv2').prev('div').find('label').html('Form Name: <span class="requiredStar">*</span>');
    $('#formListDiv2_error, lpuRegNoDiv_error').text('');
    document.querySelector('#lpuRegNo').value = '';
    document.querySelector('#applicantEmailId').value = '';
    document.querySelector('#ApplicationNo').value = '';
    document.querySelector('#fee_form_id').value = '';
    $('.chosen-select').trigger('chosen:updated');
    document.getElementById('offlinePaymentApprovedForm').reset();
    document.getElementById("emailTab").classList.remove("active");
    document.getElementById("applicationTab").classList.remove("active");
    document.getElementById("lpuRegTab").className = " active";
    if (lpuRegNo.style.display === "none") {
        lpuRegNo.style.display = "block";
        application.style.display = "none";
        email.style.display = "none";
        feetype.style.display = "none";
        showTable.style.display = "none";
    }
}

$(document).on("input", "input#applicantEmailId, input#ApplicationNo, input#lpuRegNo", function () {
    resetAppliedFeesData();
});

$(document).on("change", "select#fee_form_id", function () {
    resetAppliedFeesData();
});

function resetAppliedFeesData() {
    $('#showHtml').html('');
    var feeTypeHtml = '<option value="" selected="selected">Select Fee</option>';
    $('#fee_type_id').html(feeTypeHtml).trigger('chosen:updated');
    $('#feetypeRow').hide();
}