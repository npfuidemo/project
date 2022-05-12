function changeStatus(hashed_data, status, connectorKey) {
    //$('.modal').modal('hide');
    var statusText = '';
    var newStatusText = '';
    var newStatus = 0;
    if (status == 1) {
        statusText = 'Enable';
        newStatusText = 'Disable';
        newStatus = 0;
    } else {
        statusText = 'Disable';
        newStatusText = 'Enable';
        newStatus = 1;
    }
    $('#ConfirmMsgBody').html('Are you sure you want to ' + statusText + '?');
    $('#ConfirmPopupArea').css('z-index', 99999);
    $('#ConfirmPopupArea').modal({
            backdrop: 'static',
            keyboard: false
        })
        .off('click', '#confirmYes')
        .one('click', '#confirmYes', function (e) {
            e.preventDefault();
            $('#ConfirmPopupArea').modal('hide');
            savePublisherConfiguration(hashed_data, 'status', status, connectorKey);
            $('#' + connectorKey + '_status').attr('onclick', 'changeStatus("' + hashed_data + '","' + newStatus + '","' + connectorKey + '")');
            $('#' + connectorKey + '_status').html(newStatusText);
            $('#' + connectorKey + '_status').closest('.connector-list').find('.statusIcon').toggle();
            if (newStatus === 1) {
                $('#' + connectorKey + '_status').removeClass('btn-line-danger');
                $('#' + connectorKey + '_status').addClass('btn-line-success');
            } else {
                $('#' + connectorKey + '_status').addClass('btn-line-danger');
                $('#' + connectorKey + '_status').removeClass('btn-line-success');
            }
        });
}

function savePublisherConfiguration(hashed_data, actionType, status, connectorKey) {
    //$('.modal').modal('hide');

    if (actionType == 'date') {
        if ($.trim($('#start_date').val()) != '' && $.trim($('#end_date').val()) != '') {
            var splitStartDate = ($('#start_date').val()).split('/');
            var splitEndDate = ($('#end_date').val()).split('/');

            var startDate = new Date(splitStartDate[2] + '/' + splitStartDate[1] + '/' + splitStartDate[0]);
            var endDate = new Date(splitEndDate[2] + '/' + splitEndDate[1] + '/' + splitEndDate[0]);

            if (startDate > endDate) {
                alertPopup('End date should be greater than start date', 'error');
                $('#ErrorPopupArea').css('z-index', 99999);
                return false;
            }
        }
    }

    var nonMandatoryFileds = [];
    if ($('.filed_ids').length > 0) {
        $('.filed_ids').each(function () {
            if (!$(this).is(':checked')) {
                nonMandatoryFileds.push($(this).attr('data-field'));
            }
        });
    }

    $.ajax({
        url: '/college-settings/savePublisherConfiguration',
        type: 'post',
        dataType: 'json',
        data: {
            'hashed': hashed_data,
            'action': actionType,
            'nonMandatoryFileds': nonMandatoryFileds,
            'start_date': $('#start_date').val(),
            'end_date': $('#end_date').val(),
            'dataporting_ip': $('#dataporting_ip').val(),
            'status': status
        },
        beforeSend: function (xhr) {
            $('.sectionLoader').show();
        },
        headers: {
            'X-CSRF-TOKEN': jsVars._csrfToken
        },
        success: function (data) {
            if (typeof data['error'] != 'undefined' && data['error'] == 'session') {
                location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
            } else if (typeof data['error'] != 'undefined') {
                alertPopup(data['error'], 'error');
                $('#ErrorPopupArea').css('z-index', 99999);
            } else {
                alertPopup(data['message'], 'success');
                $('#SuccessPopupArea').css('z-index', 99999);

                if (actionType == 'status') {
                    var statusText;
                    var newStatus = '';
                    if (status == 1) {
                        statusText = 'Disable';
                        newStatus = 0;
                    } else {
                        statusText = 'Enable';
                        newStatus = 1;
                    }

                    //$('#statusId').html('<i class="fa fa-cogs" aria-hidden="true"></i>&nbsp;&nbsp;' + statusText).attr('onclick','changeStatus(\''+hashed_data+'\',\''+newStatus+'\')');

                    if (typeof connectorKey !== 'undefined') {
                        //$("#"+connectorKey,parent.document).trigger('click');
                    }
                } else {
                    $('#extensionpopup').modal('hide');
                    //$("#load_connectors_category",parent.document).trigger('click');
                }


            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.sectionLoader').hide();
        }
    });

    //return false;
}
     function removeIvrVendorData(collegeId, vendor, event) {
    $('#ConfirmMsgBody').html('Do you want to remove configuration?');
    $('#confirmYes').unbind('click');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false}).off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $('#ConfirmPopupArea').modal('hide');
        $.ajax({
            url: '/college-settings/removeIvrVendorData',
            type: 'post',
            dataType: 'json',
            data: {'vendor': vendor, 'collegeId': collegeId},
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            success: function (data) {
                if (typeof data['session'] != 'undefined') {
                    window.location.reload(true);
                } else if (typeof data['error'] != 'undefined') {
                    alertPopup(data['error'], 'error');
                    $('#ErrorPopupArea').css('z-index', 99999);
                    $('#' + vendor).prop("checked", true);
                } else {
                    alertPopup(data['message'], 'success');
                    $('#SuccessPopupArea').css('z-index', 99999);
                    $('#' + vendor + '_remove').hide();
                    $('#' + vendor + '_enable').hide();

                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            },
            complete: function (jqXHR, textStatus) {
                $('.sectionLoader').hide();
            }
        });
    });
}

function showModal() {
  $('#myModal').modal('show');
}
$(".modal").on("hidden.bs.modal", function(){
   $('#addVendorButton').removeAttr("disabled");
   $('#addNewVendor').trigger("reset");
   $('#showSuccessMessage').html("");
   $('.error').html("");  
});

function savePublisherIplistConfiguration(hashed_data, actionType) {
    $.ajax({
        url: '/college-settings/savePublisherConfiguration',
        type: 'post',
        dataType: 'json',
        data: {
            'hashed': hashed_data,
            'action': actionType,
            'dataporting_ip': $('#dataporting_ip').val()
        },
        beforeSend: function (xhr) {
            $('.sectionLoader').show();
        },
        headers: {
            'X-CSRF-TOKEN': jsVars._csrfToken
        },
        success: function (data) {
            if (typeof data['error'] != 'undefined' && data['error'] == 'session') {
                location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
            } else if (typeof data['error'] != 'undefined') {
                alertPopup(data['error'], 'error');
                $('#ErrorPopupArea').css('z-index', 99999);
            } else {
                alertPopup(data['message'], 'notification');
                $('#SuccessPopupArea').css('z-index', 99999);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.sectionLoader').hide();
        }
    });
}

function savePublisherCampaignDuration(hashed_data, actionType) {
    $(".validationError").html('');
    $.ajax({
        url: '/college-settings/savePublisherConfiguration',
        type: 'post',
        dataType: 'json',
        data: {
            'hashed': hashed_data,
            'action': actionType,
            'start_date': $('#start_date').val(),
            'end_date': $('#end_date').val()
        },
        beforeSend: function (xhr) {
            $('.sectionLoader').show();
        },
        headers: {
            'X-CSRF-TOKEN': jsVars._csrfToken
        },
        success: function (data) {
            if (typeof data['error'] != 'undefined' && data['error'] == 'session') {
                location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
            } else if (typeof data['error'] != 'undefined') {
                try {
                    var errorMsg = $.parseJSON(data['error']);
                    if (typeof errorMsg['startDate'] !== 'undefined') {
                        $("#startDateError").html("Start Date should not be less than today's date");
                    }
                    if (typeof errorMsg['endDate'] !== 'undefined') {
                        $("#endDateError").html('End Date should be greater than Start Date');
                    }
                    return;
                } catch (e) {
                    //console.log("error: "+e);
                };
                alertPopup(data['error'], 'error');
                $('#ErrorPopupArea').css('z-index', 99999);
            } else {
                alertPopup(data['message'], 'notification');
                $('#SuccessPopupArea').css('z-index', 99999);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.sectionLoader').hide();
        }
    });
}

function savePublisherLeadParam(hashed_data, actionType) {
    var nonMandatoryFileds = [];
    if ($('.filed_ids').length > 0) {
        $('.filed_ids').each(function () {
            if (!$(this).is(':checked')) {
                nonMandatoryFileds.push($(this).attr('data-field'));
            }
        });
    }
    $.ajax({
        url: '/college-settings/savePublisherConfiguration',
        type: 'post',
        dataType: 'json',
        data: {
            'hashed': hashed_data,
            'action': actionType,
            'nonMandatoryFileds': nonMandatoryFileds
        },
        beforeSend: function (xhr) {
            $('.sectionLoader').show();
        },
        headers: {
            'X-CSRF-TOKEN': jsVars._csrfToken
        },
        success: function (data) {
            if (typeof data['error'] != 'undefined' && data['error'] == 'session') {
                location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
            } else if (typeof data['error'] != 'undefined') {
                alertPopup(data['error'], 'error');
                $('#ErrorPopupArea').css('z-index', 99999);
            } else {
                alertPopup(data['message'], 'notification');
                $('#SuccessPopupArea').css('z-index', 99999);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.sectionLoader').hide();
        }
    });
}

function showConnectContent(connectorName) {
    switch (connectorName) {
        case "Digilocker":
            var contentHtml = '<div class="content h100"><div class="innergap h100"><h2> <a href="javascript:void(0);" class="back overlaybackbtn"><i class="fa fa fa-long-arrow-left"></i></a>' + connectorName + '</h2>';
            contentHtml += '<p>NoPaperForms allows you to connect with Digilocker. DigiLocker is an initiative of Ministry of Electronics & IT (MeitY), Government of India that allows Indian citizens to import/export authentic digital documents. The issued documents in DigiLocker system are deemed to be at par with original physical documents as per Rule 9A of the Information Technology (Preservation and Retention of Information by Intermediaries providing Digital Locker facilities) Rules, 2016 notified on February 8, 2017 vide G.S.R. 711(E).</p>';
            contentHtml += '<p class="fw500 margin-bottom-0">Best used for:</p>';
            contentHtml += '<p>Importing authentic documents such as Aadhaar Card, Driving License, Marksheets, etc. that are legally at par with originals</p>';
            contentHtml += '<p class="fw500 margin-bottom-0">Key Features:</p>';
            contentHtml += '<ul class="nolist">';
            contentHtml += '<li><i class="fa fa-check"></i>&nbsp;Verify applicant’s Aadhaar demographics and Aadhaar card</li>';
            contentHtml += '<li><i class="fa fa-check"></i>&nbsp;Allow applicant’s to upload documents directly from Digilocker</li>';
            contentHtml += '</ul>';
            contentHtml += '<p class="text-right absoluteBottom"><a href="javascript:void(0);" class="btn btn-fill-blue radius-20 margin-top-30 connectBtnPopUp"><i class="fa fa-cogs" aria-hidden="true"></i> &nbsp; Connect &nbsp; &nbsp;</a></p></div></div>';
            $(document).find('#connectorContent').html(contentHtml);
            $(document).find('#connectorContent').parent().addClass('in');
            $(document).find('#load_connectors_category').hide();
            break;
        default:
            var contentHtml = '<div class="content h100"><div class="innergap h100"><h2> <a href="javascript:void(0);" class="back overlaybackbtn"><i class="fa fa fa-long-arrow-left"></i></a>' + connectorName + '</h2>';
            contentHtml += '<p>NoPaperForms allow you to connect with any Publisher/Digital Agency</p>';
            contentHtml += '<p class="fw500 margin-bottom-0">Best used for:</p>';
            contentHtml += '<p>Capturing leads enquiring about your institute/course</p>';
            contentHtml += '<p class="fw500 margin-bottom-0">Key Features:</p>';
            contentHtml += '<ul class="nolist">';
            contentHtml += '<li><i class="fa fa-check"></i>&nbsp;Set daily limit on the maximum number of leads than can be sent by Publisher/Digital Agency</li>';
            contentHtml += '<li><i class="fa fa-check"></i>&nbsp;Set algorithm based dynamic lead limit to improve the quality of leads sent by Publisher/Digital Agency</li>';
            contentHtml += '<li><i class="fa fa-check"></i>&nbsp;Set Campaign duration to allow lead insertion only during specific time period </li>';
            contentHtml += '<li><i class="fa fa-check"></i>&nbsp;Restrict lead insertion from specific IPs</li>';
            contentHtml += '<li><i class="fa fa-check"></i>&nbsp;Enable/Disable integration with one click</li>';
            contentHtml += '</ul>';
            contentHtml += '<p class="text-right absoluteBottom"><a href="javascript:void(0);" class="btn btn-fill-blue radius-20 margin-top-30 connectBtnPopUp"><i class="fa fa-cogs" aria-hidden="true"></i> &nbsp; Connect &nbsp; &nbsp;</a></p></div></div>';
            $(document).find('#connectorContent').html(contentHtml);
            $(document).find('#connectorContent').parent().addClass('in');
            $(document).find('#load_connectors_category').hide();
    }
}

$(document).on('click', '.overlaybackbtn', function () {
    $(document).find('#connectorContent').parent().removeClass('in');
    $(document).find('#load_connectors_category').show();
    $('#searchbytext').show();
});

$(document).on('click', '.connectBtnPopUp', function () {
    alertPopup('Please contact your account manager to enable the integration', 'notification');
});

function alertPopup(msg, type, location) {
    var selector_parent, selector_titleID, selector_msg, title_msg, btn;
    if (type === 'error') {
        selector_parent = '#ErrorPopupArea';
        selector_titleID = '#ErroralertTitle';
        selector_msg = '#ErrorMsgBody';
        btn = '#ErrorOkBtn';
        title_msg = 'Error';
    } else if (type === 'notification') {
        selector_parent = '#SuccessPopupArea';
        selector_titleID = '#alertTitle';
        selector_msg = '#MsgBody';
        btn = '#OkBtn';
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

    if (typeof location !== 'undefined') {
        $(btn).show();

        $(selector_parent).modal({
            keyboard: false
        }).one('click', btn, function (e) {
            e.preventDefault();
            window.location.href = location;
        });
    } else {
        $(selector_parent).modal();
    }
}


$('[data-toggle="tooltip"]').tooltip();

$(document).on('click', '.setDynamicLimit', function () {
    var limitType = $(this).val();
    if (limitType === 'dynamic') {
        $(document).find('#setDynamicLimitDiv').show();
        $(document).find('.unlimitedLimitInfo').hide();
        $(document).find('.staticLimitInfo').hide();
        $(document).find('.dynamicLimitInfo').show();
        $(document).find('.dailyLimitDiv').show();
    } else if (limitType === 'static') {
        $(document).find('#setDynamicLimitDiv').hide();
        $(document).find('.unlimitedLimitInfo').hide();
        $(document).find('.staticLimitInfo').show();
        $(document).find('.dynamicLimitInfo').hide();
        $(document).find('.dailyLimitDiv').show();
    } else if (limitType === 'unlimited') {
        $(document).find('#setDynamicLimitDiv').hide();
        $(document).find('.unlimitedLimitInfo').show();
        $(document).find('.staticLimitInfo').hide();
        $(document).find('.dynamicLimitInfo').hide();
        $(document).find('.dailyLimitDiv').hide();
    }
});

$(document).on('click', '.updateDayLimit', function () {
    $(this).toggle();
    $(document).find('#displayDayLimit').toggle();
    $(document).find('#insertDayLimit').toggle();
});

$(document).on('click', '#leadLimitSaveBtn', function () {
    var isValid = true;
    $('#leadLimitForm').find('.validationError').html('');
    var dynamicLimit = $('input[name="limitType"]:checked').val();
    if (dynamicLimit === "dynamic") {
        var percentFieldId = ['criteriaVal1', 'criteriaVal2', 'updateVal1', 'updateVal2'];
        $("#leadLimitForm input[type=text]").each(function () {
            if (this.name !== '' && this.value === '') {
                $(this).siblings('.validationError').html('Required Field');
                isValid = false;
            } else if (this.name !== '' && (percentFieldId.indexOf(this.id) !== -1)) {
                var value = parseInt(this.value);
                if (value > 100 || value < 1) {
                    $(this).siblings('.validationError').html('Please enter the value of % between 0 and 100');
                    isValid = false;
                }
            }
        });
        var dailyLimit = parseInt($(document).find("#perDayLimit").val());
        if (dailyLimit <= 0 || dailyLimit > 99999) {
            $(document).find("#dailyLimitError").html('Please enter a lead limit greater than 0');
            isValid = false;
        }
        var minThreshold = parseInt($(document).find("#minThreshold").val());
        var maxThreshold = parseInt($(document).find("#maxThreshold").val());
        if ($(document).find("#perDayLimit").val() !== '' && minThreshold > dailyLimit) {
            $(document).find("#minThresholdError").html('Minimum threshold should be less than the daily lead limit set');
            isValid = false;
        }
        if ($(document).find("#perDayLimit").val() !== '' && maxThreshold < dailyLimit) {
            $(document).find("#maxThresholdError").html('Maximum threshold should be greater than or equal to daily lead limit set');
            isValid = false;
        }

    } else if (dynamicLimit === "static") {
        if ($(document).find("#perDayLimit").val() === '') {
            $(document).find("#dailyLimitError").html('Required Field');
            isValid = false;
        }
        var dailyLimit = parseInt($(document).find("#perDayLimit").val());
        if (dailyLimit < 0 || dailyLimit > 99999) {
            $(document).find("#dailyLimitError").html('Please enter a lead limit greater than 0');
            isValid = false;
        }
    }
    var criteriaVal1 = parseInt($("#criteriaVal1").val());
    var criteriaVal2 = parseInt($("#criteriaVal2").val());
    if (typeof criteriaVal2 !== 'undefined') {
        var criteria1 = $("#criteria1").val();
        if (criteria1 === 'greater' && criteriaVal2 >= criteriaVal1) {
            $("#criteriaVal2Error").html('Value should be less than ' + criteriaVal1 + "%");
            isValid = false;
        }
        if (criteria1 === 'lesser' && criteriaVal2 <= criteriaVal1) {
            $("#criteriaVal2Error").html('Value should be greater than ' + criteriaVal1 + "%");
            isValid = false;
        }
    }

    if (isValid === false) {
        return false;
    }
    $.ajax({
        url: '/college-settings/savePublisherLeadLimit',
        type: 'post',
        dataType: 'json',
        data: $("#leadLimitForm").serialize(),
        beforeSend: function (xhr) {
            $('.sectionLoader').show();
        },
        headers: {
            'X-CSRF-TOKEN': jsVars._csrfToken
        },
        success: function (json) {
            if (json['status'] === 0 && json['message'] === 'session') {
                location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
            } else if (json['status'] === 1) {
                alertPopup(json['message'], 'notification');
                if (dynamicLimit !== "unlimited") {
                    $(document).find('#rate_limit_' + json['data']['connectorId']).show();
                } else {
                    $(document).find('#rate_limit_' + json['data']['connectorId']).hide();
                }
            } else {
                alertPopup(json['message'], 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.sectionLoader').hide();
        }
    });
});

$(document).on('click', '#addNewCondition', function () {
    var criteria1 = $("#criteria1").val();
    var type1 = $("#type1").val();
    var criteriaVal1 = $("#criteriaVal1").val();
    var updateVal1 = $("#updateVal1").val();
    if (criteriaVal1 === '') {

    }
    if (updateVal1 === '') {

    }
    var html = '<div class="form-group logicalbox"><div class="row">';
    html += '<div class="col-sm-4 text-center">';
    html += '<label class="form-label-bg">If (%) of verified leads is</label></div>'
    html += '<div class="col-sm-3">';
    html += '<div class="floatifyDiv floatify__left"><label class="floatify__label float_addedd_js">Select option</label><select name="dynamicCondition2[criteria]" id="criteria2" class="sumo-select bordernone dynamicCondition2">';
    if (criteria1 === 'greater') {
        html += '<option value="lesser">Less</option>';
    } else {
        html += '<option value="greater">Greater</option>';
    }
    html += '</select></div>';
    html += '</div>';
    html += '<div class="col-sm-3 text-center"><label class="form-label-bg">than</label></div>';
    html += '<div class="col-sm-2">';
    html += '<div class="floatifyDiv floatify floatify__left"><input type="text" name="dynamicCondition2[criteriaVal]" id="criteriaVal2" class="form-control" placeholder="Enter the %" maxlength="2" onkeypress="return isNumber(event)"><span id="criteriaVal2Error" class="validationError error"></span></div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="row">';
    html += '<div class="col-sm-4 text-center">';
    html += '<label class="form-label-bg">then</label></div>';
    html += '<div class="col-sm-3">';
    html += '<div class="floatifyDiv floatify__left"><label class="floatify__label float_addedd_js">Select option</label><select class="sumo-select bordernone type2 dynamicCondition2" id="type2" name="dynamicCondition2[type]">';
    if (type1 === 'increase') {
        html += '<option value="decrease">Decrease</option>';
    } else {
        html += '<option value="increase">Increase</option>';
    }
    html += '</select></div>';
    html += '</div>';
    html += '<div class="col-sm-3 text-center"><label class="form-label-bg">leads allowed per day by</label></div>';
    html += '<div class="col-sm-2">';
    html += '<div class="floatifyDiv floatify floatify__left"><input type="text" name="dynamicCondition2[updateVal]" id="updateVal2" class="form-control" placeholder="Enter the %" maxlength="2" onkeypress="return isNumber(event)"><span id="updateVal2Error" class="validationError error"></span></div>';
    html += '</div>';
    html += '</div>';
    html += '<button type="button" class="text-danger remove" type="button" id="removeCondition"><i class="fa fa-trash" aria-hidden="true"></i></button>';
    html += '</div>';
    $(document).find('#addNewLoginDiv').html(html);
    $(this).hide();
    $('.dynamicCondition2').SumoSelect({
        placeholder: '',
        search: true,
        searchText: 'Search',
        triggerChangeCombined: false
    });
    if (criteria1 === 'greater') {
        $('select#criteria1')[0].sumo.disableItem(1);
    } else {
        $('select#criteria1')[0].sumo.disableItem(0);
    }
    if (type1 === 'increase') {
        $('select#type1')[0].sumo.disableItem(1);
    } else {
        $('select#type1')[0].sumo.disableItem(0);
    }
    floatableLabel();
});

$(document).on('change', '#criteria1', updateCriteriaType);

function updateCriteriaType() {
    var criteria2 = $("#criteria2").val();
    if (typeof criteria2 === 'undefined') {
        var criteria1 = $("#criteria1").val();
        if (criteria1 === 'greater') {
            $('select#type1')[0].sumo.enableItem(0);
            $('select#type1')[0].sumo.disableItem(1);
        } else {
            $('select#type1')[0].sumo.enableItem(1);
            $('select#type1')[0].sumo.disableItem(0);
        }
    }
}

$(document).on('click', '#removeCondition', function () {
    $(document).find('#addNewLoginDiv').html('');
    var criteria1 = $("#criteria1").val();
    var type1 = $("#type1").val();
    if (criteria1 === 'greater') {
        $('select#criteria1')[0].sumo.enableItem(1);
    } else {
        $('select#criteria1')[0].sumo.enableItem(0);
    }
    $(document).find("#addNewCondition").show();
});

$('.daterangepicker_log').daterangepicker({
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
});

$('.daterangepicker_log').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
});

$('.daterangepicker_log').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
});
$('.daterangepicker_log').on('click', function (ev, picker) {
    $(this).val('');
});

$(document).on('click', '.loadViewLogs', function () {
    $(document).find("#logDate").val('');
    var publisherId = $(this).attr('id');
    getPublisherLogDetails(publisherId);
});

function getPublisherLogDetails(publisherId, page = 0, startDate = '', endDate = '') {
    var hashedData = $("#hashed_data").val();
    $.ajax({
        url: '/college-settings/getPublisherLogDetails',
        type: 'post',
        dataType: 'html',
        data: {
            'publisherId': publisherId,
            'hashedData': hashedData,
            'startDate': startDate,
            'endDate': endDate,
            'page': page
        },
        beforeSend: function (xhr) {
            $('.publisherLoader').show();
        },
        headers: {
            'X-CSRF-TOKEN': jsVars._csrfToken
        },
        success: function (response) {

            var responseObject = $.parseJSON(response);
            if (responseObject.status === 1) {
                if (responseObject.data.html) {
                    $(document).find("#loadDailyLimitLog").html(responseObject.data.html);
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(responseObject.message, 'error');
                }
            }
            $('[data-toggle="tooltip"]').tooltip()
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function () {
            $('.publisherLoader').hide();
        }
    });
}

$(document).on('click', '.getNextLogDetails', function () {
    var page = $(this).attr('id');
    var publisherId = $('#publisherLogId').val();
    var logDate = $("#logDate").val();
    var startDate = '';
    var endDate = '';
    if (logDate !== '') {
        logDate = logDate.split(',');
        startDate = logDate[0];
        endDate = logDate[1];
    }
    getPublisherLogDetails(publisherId, page, startDate, endDate);
});

$(document).on('click', '#loadPublisherLog', function () {
    var publisherId = $('#publisherLogId').val();
    var logDate = $("#logDate").val();
    var startDate = '';
    var endDate = '';
    if (logDate !== '') {
        logDate = logDate.split(',');
        startDate = logDate[0];
        endDate = logDate[1];
    }
    getPublisherLogDetails(publisherId, 0, startDate, endDate);
});

$(document).on("keyup", "#search_by_text", searchByText);

function searchByText() {
    $("#noDataFoundDiv").hide();
    $('#load_connectors_category').removeClass('listfound');
    var searchText = $(this).val().toLowerCase();
    var showCurrentDiv;
    $('div#load_connectors_category > div.connectorName').each(function () {
        var currentDivText = $(this).attr('connectortext').toLowerCase();
        showCurrentDiv = currentDivText.indexOf(searchText) !== -1;
        $(this).toggle(showCurrentDiv);
    });
    var displayNoDataFound = 1;
    $('div.connectorName').each(function () {
        if ($(this).css('display') === 'block') {
            displayNoDataFound = 0;
        }
    });
    if (displayNoDataFound === 1) {
        $("#noDataFoundDiv").show();
    } else {
        $('#load_connectors_category').addClass('listfound');
    }
    if (searchText == '') {
        $('#load_connectors_category').removeClass('listfound');
    }
}

function saveDigilockerWalletConfiguration(hashed_data) {
    $.ajax({
        url: '/college-settings/saveDigilockerWalletConfiguration',
        type: 'post',
        dataType: 'json',
        data: {
            'hashed': hashed_data,
            'digilockerAppId': $('#digilockerAppId').val(),
            'digilockerAppKey': $('#digilockerAppKey').val()
        },
        beforeSend: function (xhr) {
            $('#aadhar_wallet_save').prop('disabled', true);
        },
        headers: {
            'X-CSRF-TOKEN': jsVars._csrfToken
        },
        success: function (data) {
            if (typeof data['error'] != 'undefined' && data['error'] == 'session') {
                location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
            } else if (typeof data['error'] != 'undefined') {
                alertPopup(data['error'], 'error');
                $('#ErrorPopupArea').css('z-index', 99999);
            } else {
                alertPopup(data['message'], 'notification');
                $('#SuccessPopupArea').css('z-index', 99999);
                // $('#aadhar_wallet_save').prop('disabled', true);
                //changeDigilockerConfigStatus(hashed_data, 1, 'digilocker');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.sectionLoader').hide();
        }
    });
}

function saveDigilockerAadharAuthenticationConfiguration(hashed_data) {
    var matchedCheckboxValues = [];

    $('.matchingFields:checked').each(function () {
        if (this.checked) {
            matchedCheckboxValues.push($(this).val());
        }
    });
    matchedCheckboxValues = matchedCheckboxValues.toString();

    $.ajax({
        url: '/college-settings/saveDigilockerAadharAuthenticationConfiguration',
        type: 'post',
        dataType: 'json',
        data: {
            'hashed': hashed_data,
            'clientID': $('#clientID').val(),
            'clientSecret': $('#clientSecret').val(),
            'matchedFields': matchedCheckboxValues
        },
        beforeSend: function (xhr) {
            $('#aadhar_authentication_save').prop('disabled', true);
        },
        headers: {
            'X-CSRF-TOKEN': jsVars._csrfToken
        },
        success: function (data) {
            if (typeof data['error'] != 'undefined' && data['error'] == 'session') {
                location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
            } else if (typeof data['error'] != 'undefined') {
                alertPopup(data['error'], 'error');
                $('#ErrorPopupArea').css('z-index', 99999);
            } else {
                alertPopup(data['message'], 'notification');
                $('#SuccessPopupArea').css('z-index', 99999);
                //$('#aadhar_authentication_save').prop('disabled', true);
                //changeDigilockerConfigStatus(hashed_data, 1, 'digilocker');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.sectionLoader').hide();
        }
    });
}

function changeDigilockerConfigStatus(hashed_data, status, connectorKey) {
    var statusText = '';
    var newStatusText = '';
    var newStatus = 0;
    if (status == 1) {
        statusText = 'Enable';
        newStatusText = 'Disable';
        newStatus = 0;
    } else {
        statusText = 'Disable';
        newStatusText = 'Enable';
        newStatus = 1;
    }
    $('#ConfirmMsgBody').html('Are you sure you want to ' + statusText + '?');
    $('#ConfirmPopupArea').css('z-index', 99999);
    $('#ConfirmPopupArea').modal({
            backdrop: 'static',
            keyboard: false
        })
        .off('click', '#confirmYes')
        .one('click', '#confirmYes', function (e) {
            e.preventDefault();
            $('#ConfirmPopupArea').modal('hide');
            saveDigilockerConfiguration(hashed_data, status);
            $('#' + connectorKey + '_status').attr('onclick', 'changeDigilockerConfigStatus("' + hashed_data + '","' + newStatus + '","' + connectorKey + '")');
            $('#' + connectorKey + '_status').html(newStatusText);
            $('#' + connectorKey + '_status').closest('.connector-list').find('.statusIcon').toggle();
            if (newStatus === 1) {
                $('#' + connectorKey + '_status').removeClass('btn-line-danger');
                $('#' + connectorKey + '_status').addClass('btn-line-success');
            } else {
                $('#' + connectorKey + '_status').addClass('btn-line-danger');
                $('#' + connectorKey + '_status').removeClass('btn-line-success');
            }
        });
}

function saveDigilockerConfiguration(hashed_data, status) {

    $.ajax({
        url: '/college-settings/saveDigilockerConfiguration',
        type: 'post',
        dataType: 'json',
        data: {
            'hashed': hashed_data,
            'status': status
        },
        beforeSend: function (xhr) {
            $('.sectionLoader').show();
        },
        headers: {
            'X-CSRF-TOKEN': jsVars._csrfToken
        },
        success: function (data) {
            if (typeof data['error'] != 'undefined' && data['error'] == 'session') {
                location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
            } else if (typeof data['error'] != 'undefined') {
                alertPopup(data['error'], 'error');
                $('#ErrorPopupArea').css('z-index', 99999);
            } else {
                alertPopup(data['message'], 'success');
                $('#SuccessPopupArea').css('z-index', 99999);

                var statusText;
                var newStatus = '';
                if (status == 1) {
                    statusText = 'Disable';
                    newStatus = 0;
                } else {
                    statusText = 'Enable';
                    newStatus = 1;
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.sectionLoader').hide();
        }
    });
}



function activeFbFieldMappingTab(){
//    $('#campaignMappingContent').removeClass("active");
//    $('#campaignMappingMenu').removeClass("active");
//    $('#fieldMappingMenu').addClass("active");
//    $('#fieldMappingContent').addClass("active");
    $('#fieldMappingContent').trigger('click');
}

/**
 * save JustDial form field mapping with ajax requiest
 * @returns if error then return otherwise it redirect to form list page
 */
function savejustDialFormFieldMapping(){

    $("#map_label_error").html("");
    var email_flag = "0";
    var field_flag = [];
    var duplicate_flag = [];
    var selectedArray = [];

    var emailKey = $('#email_key').val().trim();
    
    $("select[name^=mapped_column]").each(function (i, k) {
        if ($(this).val() == emailKey) {
            email_flag = "1";
        }
        
        if ($.inArray($.trim($(this).val()), selectedArray) !== -1) {
//            duplicate_flag.push(i);
        }
        if ($(this).val() === 'Select Label') {
            field_flag.push(i);
        } else if ($.trim($(this).val()) != '' && $(this).val() !== 'do_not_import') {
            selectedArray.push($(this).val());
        }

        $("#map_label_error-" + i).html("");
    });

    $(".emailError, #map_label_error").html("");
    if (field_flag.length > 0) {
        $.each(field_flag, function (i) {
            $("#map_label_error-" + field_flag[i]).html("All JustDial label must be mapped with NPF label.");
        });
       activeFbFieldMappingTab(); 
       
        return false;
    } else if (email_flag == "0") {
        if ($('.emailError').length > 0) {
//            $(".emailError").html("Mapping of NPF Email label is mandatory.");
        } else {
//            $("#map_label_error").html("Mapping of NPF Email label is mandatory.");
        }
        activeFbFieldMappingTab(); 
//        return false;
    } else if (duplicate_flag.length > 0) {
        $.each(duplicate_flag, function (i) {
            $("#map_label_error-" + duplicate_flag[i]).html("Duplicate mapping of NPF label is not allowed.");
        });
//        alert('22222');
//console.log(duplicate_flag);
        activeFbFieldMappingTab();
        return false;
    }
    var data = $('#justDialFieldsMapping').serializeArray();
    $.ajax({
        url: '/college-settings/saveJdFormFieldMapping',
        type: 'post',
        dataType: 'json',
        data: data,
        beforeSend: function (xhr) {
//            $('div.loader-block').show();
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            console.log(data);
            if (data == 'session') {
                window.location.reload(true);
            } else if (data.error) {
                $(".list_group_item, .bhoechie-tab-content").removeClass("active");
                $("#defaultFormFieldsMenu, #defaultFormFieldsContent").addClass("active");
                $(".error").text("");
                if(typeof data.error.missing_fields !== "undefined") {
                    var missingFiledsError = data.error.missing_fields;       
                    delete data.error.missing_fields;
                    if(missingFiledsError != undefined) {
                        alertPopup(missingFiledsError + " Please refresh your page to continue", 'error');
                    }                    
                }
                if(typeof data.error.mandatory !== "undefined") {
                    var mandatoryError = data.error.mandatory;       
                    delete data.error.mandatory;
                    if(mandatoryError != undefined) {
                        alertPopup(mandatoryError, 'error');
                    }                    
                }
                $.each(data.error, function(key, val) {
                    if(typeof $("#"+key) !== "undefined") {
                       $("#"+key).text(val);
                    }
                });

            } else if (data.success == 200) {
                $('.field_mapping_id').val(data.id)
                alertPopup('Field configuration saved successfully.', 'success');
                
            } else {
                alertPopup('error', 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {

//            $('div.loader-block').hide();
            $('.sectionLoader').hide();
        }
    });
}

// Common Function  For custom file
function customFile() {
	$('input[type="file"]').change(function(e){
		var fileName = e. target. files[0]. name;
		//alert('The file "' + fileName + '" has been selected.' );
		$(this).siblings('.form-control').val(fileName);
	});
}
