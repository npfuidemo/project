var ajaxReq = 'ready';
var typingTimer;
var couponDetailsFilterButtonPressed = 0;
    
$(document).ready(function () {
    SumitFilterFormNew(0);
    $('#couponSearchArea #assigned_to').on('blur', function () {
        if ($(this).val().trim() == '') {
            $('#couponSearchArea #assigned_to_hiden').val('');
        }
    });
    
    $('#couponSearchArea #assigned_from').on('blur', function () {
        if ($(this).val().trim() == '') {
            $('#couponSearchArea #assigned_from_hiden').val('');
        }
    });
    
    $('#couponReassignModal #assignedTo').on('blur', function () {
        if ($(this).val().trim() == '') {
            $('#couponReassignModal #assignedToHidden').val('');
        }
    });
});

$(document).on("change", "#filterCollegeCouponForm select, #filterCollegeCouponForm input", function () {
    couponDetailsFilterButtonPressed = 0;
});

$(document).on('click', '#saveCouponAssignButton', function () {
    updateCouponAssignee();
});

$(function () {
    var mapFilterAssignedTo = {};
    $('#couponSearchArea #assigned_to').typeahead({
        hint: true,
        highlight: true,
        minLength: 1,
        source: function (request, response) {
            var autoSearch = $('#couponSearchArea #assigned_to').val();
            $('#couponSearchArea #assigned_to_hiden').val(autoSearch);
            populateAssigneeUsers(autoSearch, response, mapFilterAssignedTo,'filter');
        },
        updater: function (item) {
            $('#couponSearchArea #assigned_to_hiden').val(mapFilterAssignedTo[item].id);
            return item;
        }
    });
    
    var mapFilterAssignedFrom = {};
    $('#couponSearchArea #assigned_from').typeahead({
        hint: true,
        highlight: true,
        minLength: 1,
        source: function (request, response) {
            var autoSearch = $('#couponSearchArea #assigned_from').val();
            $('#couponSearchArea #assigned_from_hiden').val(autoSearch);
            populateAssigneeUsers(autoSearch, response, mapFilterAssignedFrom,'filter');
        },
        updater: function (item) {
            $('#couponSearchArea #assigned_from_hiden').val(mapFilterAssignedFrom[item].id);
            return item;
        }
    });
    
    var mapSingleBulkAssignedTo = {};
    $('#couponReassignModal #assignedTo').typeahead({
        hint: true,
        highlight: true,
        minLength: 1,
        source: function (request, response) {
            var autoSearch = $('#couponReassignModal #assignedTo').val();
            $('#couponReassignModal #assignedToHidden').val(autoSearch);
            populateAssigneeUsers(autoSearch, response, mapSingleBulkAssignedTo);
        },
        updater: function (item) {
            $('#couponReassignModal #assignedToHidden').val(mapSingleBulkAssignedTo[item].id);
            return item;
        }
    });
});


function populateAssigneeUsers(autoSearch, response, map, action = '') {
    var couponCollegeId = $('#couponCollegeId').val();
    $.ajax({
        url: jsVars.getAllCollegeUsersLink,
        type: 'post',
        data: {autoSearch: autoSearch, collegeId: couponCollegeId,action:action},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if (json['message'] != '') {
                if (json['message'] == 'invalid_session' || json['message'] == 'invalid_csrf') {
                    window.location.reload();
                } else {
                    alert(json['message']);
                }
            } else {
                items = [];
                $.each(json['data'], function (i, item) {
                    var id = i;
                    var name = item;
                    map[name] = {id: id, name: name};
                    items.push(name);
                });
                response(items);
                $(".dropdown-menu").css("height", "auto");
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

function LoadMoreCoupons(listingType) {
    var pageno = $('#load_more_coupon').attr('p')
    if (listingType == 'reset') {
        clearSelection();
        SumitFilterFormNew(0, 'add');
    } else {
        SumitFilterFormNew(pageno)
    }

}

function SumitFilterFormNew(pageNo, typeAdd = 'append')
{
    $('#CountTotalCoupons .total_query_count').html(0);
    pageno = parseInt(pageNo);
    var data = $("form#filterCollegeCouponForm").serializeArray();
    var per_page_record = $("#items-no-show").val();
    data.push({name: 'pageNo', value: pageno});
    data.push({name: 'per_page_record', value: per_page_record});
    
    if ($('.actions-all li:visible').length < 1 ) {
        $('.actions-all').parent().removeClass('dropdown-menu');
    }
    $('#li_bulkIssueCouponAction, #li_bulkReturnCouponAction, #li_bulkReturnReceiveCouponAction, #li_bulkReceiveCouponAction, #li_bulkSellCouponAction, #li_bulkForceReturnCouponAction, #li_bulkForceReturnReceiveCouponAction').hide();
    if($('#assign_status').val() == 56){
        //56->Issued
        $('#li_bulkReceiveCouponAction').show();
    }else if($('#assign_status').val() == 58){
        //58->Received
        $('#li_bulkIssueCouponAction,#li_bulkReturnCouponAction,#li_bulkSellCouponAction,#li_bulkForceReturnCouponAction').show();
    }else if($('#assign_status').val() == 57){
        //57->Returned
        $('#li_bulkReturnReceiveCouponAction').show();
    } else if($('#assign_status').val() == 63) {
        //63->Returned & Receive
        $('#li_bulkIssueCouponAction,#li_bulkSellCouponAction').show();
    }
    else if($('#assign_status').val() == 60){
        //60->Force Returned
         $('#li_bulkForceReturnReceiveCouponAction').show();
    }
    else if($('#assign_status').val() == 61 || $('#assign_status').val() == 62 || $('#assign_status').val() == 64){
        //61->Force Return & Received 62->Created 64->Consumed
        $('#li_bulkIssueCouponAction').show();
    }
    if ($('.actions-all li:visible').length > 0) {
        $('.actions-all').parent().addClass('dropdown-menu');
    }
    floatableLabel();
    $.ajax({
        url: jsVars.FULL_URL + '/discount-coupons/detailList',
        type: 'post',
        data: data,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
        },
        success: function (html) {
            couponDetailsFilterButtonPressed = 1;
            if (typeAdd == 'add') {
                $('#collegeCouponsListContainer').html(html);
            } else {
                $('#collegeCouponsListContainer').append(html);
            }
            $('.itemsCount').show();
            pageno = pageno + 1;
            $('#load_more_coupon').attr('p', pageno);
            $('#CountTotalCoupons .total_query_count').html($('#totalCouponsList').val());
            $('.total_query_count').html($('#queryCount').val());
            var countRecord = countResult(html);
            if (countRecord==0 || countRecord<per_page_record) {
                $('#LoadMoreArea').addClass('hide');
            } else {
                $('#LoadMoreArea').removeClass('hide');
            }
            
            if (countRecord==0 && pageno == '1') {
                $('#collegeCouponsListContainer').append("<tr><td colspan='8' class=' text-danger text-center fw-500'>No Record found.</td></tr>");
                $('#LoadMoreArea').addClass('hide');
                $('.hide_extraparam').hide()
            }else{
                $('.hide_extraparam').show()
            }
            table_fix_rowcol();
            dropdownMenuPlacement();
            floatableLabel();
            $('.offCanvasModal').modal('hide');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

function confirmDisable(collegeCouponId, collegeId, couponCode, token) {
    $("#ConfirmPopupArea #ConfirmMsgBody").html("Are you sure you want to disable this coupon?");
    $("#confirmYes").attr("onclick", 'disableCoupon(' + collegeCouponId + ',' + collegeId + ',"' + couponCode + '","' + token + '");');
    $('#ConfirmPopupArea').modal('show');
}

function disableCoupon(collegeCouponId, collegeId, couponCode, token) {
    $('#ConfirmPopupArea').modal('hide');
    $.ajax({
        url: jsVars.FULL_URL + '/discount-coupons/disableCollegeCoupon',
        type: 'post',
        data: {'collegeCouponId': collegeCouponId, 'collegeId': collegeId, 'couponCode': couponCode, 'token': token},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                LoadMoreCoupons('reset');
                
            }else {
                alert(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function confirmEnable(linkId, token) {
    $("#ConfirmPopupArea #ConfirmMsgBody").html("Are you sure you want to enable this coupon?");
    $("#confirmYes").attr("onclick", 'enableCoupon(' + linkId + ',"' + token + '");');
    $('#ConfirmPopupArea').modal('show');
}

function enableCoupon(linkId, token) {
    $('#ConfirmPopupArea').modal('hide');
    $.ajax({
        url: jsVars.FULL_URL + '/discount-coupons/enableCollegeCoupon',
        type: 'post',
        data: {'token': token},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                LoadMoreCoupons('reset');
                
            }else {
                alert(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function assignCoupon(couponId, assignTo, collegeId)
{
    $.ajax({
        url: jsVars.FULL_URL + '/discount-coupons/assignCouponUser',
        type: 'post',
        data: {couponId: couponId, collegeId: collegeId},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('div.loader-block').show();
        },
        complete: function () {
            $('div.loader-block').hide();
        },
        success: function (data)
        {
            $("#fileloadResults").html(data);
            $("#document-details").modal();
            $('#document-details [data-toggle="tooltip"]').tooltip({
                placement: 'top',
                trigger: 'hover',
                template: '<div class="tooltip layerTop" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
            });
            $('.chosen-select').chosen();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
        }
    });
}

function updateCouponAssignee() {
    var requestPosts = {'couponId': $("#couponId").val(), 'assign_from_id': $("#assign_from_id").val(), 'assigned_to_id': $("#assigned_to_id").val()};
    $.ajax({
        url: jsVars.updateCouponAssignee,
        type: 'post',
        data: requestPosts,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#userProfileLoader').show();
        },
        complete: function () {
            //$('#followupModal').modal('hide');
            $('#userProfileLoader').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session') {
                location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
            }
            if (responseObject.status == 1) {

            } else {

            }
            // $('#saveFollowUpButton').attr('disabled',false);
            $("#saveFollowUpButton").show();
            $("#saveFollowUpButtonWait").hide();
            if (moduleName == 'application') {
                $("#moduleName").val(moduleName);
                $("#formId").val(formId);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $("#saveFollowUpButton").show();
            $("#saveFollowUpButtonWait").hide();
            $('#saveFollowUpButton').attr('disabled', false);
        }
    });
}

function selectAllCoupons(elem) {
    $('div.loader-block').show();
    $("#selectionRow").hide();
    $("#clearSelectionLink").hide();
    $('#select_all').attr('checked', false);
    if (elem.checked) {
        var totalListedCount = $("#all_records_val").val();
        var recordOnDisplay = $('#collegeCouponsListContainer input[name="selected_coupons[]"]:checkbox').length;
        $('.select_lead').each(function () {
            if ($(this).attr('disabled') != 'disabled') {
                this.checked = true;
            } else {
                recordOnDisplay--;
            }
        });

        $("#selectAllAvailableRecordsLinkSpan").html('<a id="selectAllAvailableRecordsLink" href="javascript:void(0);" onclick="selectAllAvailableRecords(' + totalListedCount + ');"> Select all <b>' + totalListedCount + '</b>&nbsp;Application/Coupon Number(s)</a>');
        $("#currentSelectionMessage").html("All " + recordOnDisplay + " Application/Coupon Number(s) on this page are selected. ");
        $("#selectionRow").show();
        $("#selectAllAvailableRecordsLink").show();
        $("#clearSelectionLink").hide();
    } else {
        $('.select_lead').attr('checked', false);
        $("#selectAllAvailableRecordsLink").hide();
    }
    $('div.loader-block').hide();
}

function selectAllAvailableRecords(totalAvailableRecords){
    if($('#select_page_users').is(":checked")===false){
        $('#select_page_users').trigger('click');
    }
    $("#selectionRow").show();
    $("#selectAllAvailableRecordsLink").hide();
    $("#clearSelectionLink").show();
    $("#currentSelectionMessage").html("All "+totalAvailableRecords+" Application/Coupon Number(s) are selected.");
    $('#select_all').each(function(){
        this.checked = true;
    });
}

function clearSelection(){
    $("#selectionRow").hide();
    $("#selectAllAvailableRecordsLink").hide();
    $("#clearSelectionLink").hide();
    $('.select_lead').attr('checked',false);
    $('#select_page_users').attr('checked',false);
    $('#select_all').attr('checked',false);
}

$(document).on('click', '.select_lead', function (e) {
    var recordOnDisplay = $('#collegeCouponsListContainer input:checkbox[name="selected_coupons[]"]').length;
    var selected_records = $('.select_lead:checked').length;
    $('#select_page_users').attr('checked', false);
    $('#select_all').attr('checked', false);
    if (selected_records < 1) {
        $("#selectionRow").hide();
        $("#selectAllAvailableRecordsLink").hide();
        $("#clearSelectionLink").hide();
    } else {
        var totalListedCount = $("#all_records_val").val();
        var display_message = selected_records + " Application/Coupon Number(s) on this page are selected. ";
        if (selected_records == recordOnDisplay) {
            display_message = "All " + selected_records + " Application/Coupon Number(s) on this page are selected. ";
            $('#select_page_users').attr('checked', true);
            $('#select_page_users').trigger('click');
        }
        $("#selectionRow").show();
        $("#currentSelectionMessage").html(display_message);
        $("#selectAllAvailableRecordsLinkSpan").html('<a id="selectAllAvailableRecordsLink" href="javascript:void(0);" onclick="selectAllAvailableRecords(' + totalListedCount + ');"> Select all <b>' + totalListedCount + '</b>&nbsp;Application/Coupon Number(s)</a>');
        $("#selectAllAvailableRecordsLink").show();
        $("#clearSelectionLink").hide();
    }
});

function loadMoreActivity(listingType){
    //$('#discountCouponDetailModal').modal('show');
    alert(jsVars.collegeIdLink);
    $.ajax({
        url: jsVars.FULL_URL + '/discount-coupons/showCouponDetailActivity',
        type: 'post',
        data: {couponId: jsVars.couponId, conditionalFieldValue: jsVars.conditionalFieldValue,collegeId: jsVars.collegeId},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('div.loader-block').show();
        },
        complete: function () {
            $('div.loader-block').hide();
        },
        success: function (data)
        {
            //$("#discountCouponDetail").html(data);
            //$('#discountCouponDetailModal').modal('show');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('div.loader-block').hide();
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function showCouponDetailActivity(couponCode,disCouponId,conditionalFieldValue,collegeId){
    
        $('#discountCouponDetailModal').modal('show');
        $("#discountCouponDetailModal iframe").attr({
                'src': jsVars.FULL_URL + '/discount-coupons/showCouponDetailActivity' + "?couponCode="+couponCode+"&disCouponId="+disCouponId+"&conditionalFieldValue="+conditionalFieldValue+"&collegeId="+collegeId
        });
        $('#discountCouponDetailModal').on('hidden.bs.modal', function(){
            $("#discountCouponModalIframe").html("");
            $("#discountCouponModalIframe").attr("src", "");
        });
        table_fix_rowcol();
}

function initiateCouponBulkAction(action) {
    $("#couponMessageDiv").html("").hide();
    $('#couponReassignModal #assignedFrom').val('');
    $('#couponReassignModal #assignedTo').val('');
    $('#couponReassignModal #couponRemark').val('');
    if ($('input:checkbox[name="selected_coupons[]"]:checked').length < 1 && $('#select_all:checked').val() != 'select_all') {
        alertPopup('Please select Application/Coupon Number','error');
        return;
    } else if(typeof couponDetailsFilterButtonPressed =='undefined' || couponDetailsFilterButtonPressed != 1) {
        alertPopup('It seems you have changed the filter but not Applied it. Please re-check the same to proceed further.','error');
        return;
    }
    var collegeId = $('#filterCollegeCouponForm #couponCollegeId').val();
    $('#couponReassignModal #unassignFromRow').hide();
    
    switch(action) {
        case 56://Issue
            $('#couponReassignModal #actionTitle').text('Bulk Issue');
            $('#couponReassignModal #assignedToListDiv').show();
            break;
        case 57://Return
            $('#couponReassignModal #actionTitle').text('Bulk Return');
            $('#couponReassignModal #assignedToListDiv').hide();
            break;
        case 63://Return & Receive
            $('#couponReassignModal #actionTitle').text('Bulk Return & Receive');
            $('#couponReassignModal #assignedToListDiv').hide();
            break;
        case 58://Receive
            $('#couponReassignModal #actionTitle').text('Bulk Receive');
            $('#couponReassignModal #assignedToListDiv').hide();
            break;
        case 59://Sell
            $('#couponReassignModal #actionTitle').text('Bulk Sell');
            $('#couponReassignModal #assignedToListDiv').hide();
            break;
        case 60://Force Return
            $('#couponReassignModal #actionTitle').text('Bulk Force Return');
            $('#couponReassignModal #assignedToListDiv').hide();
            break;
        case 61://Force Return & Receive
            $('#couponReassignModal #actionTitle').text('Bulk Force Return & Receive');
            $('#couponReassignModal #assignedToListDiv').hide();
            break;
    }
    
    $('#couponReassignModal #statusSaveButton').attr('onclick', 'updateCouponAssignStatusInBulk(' + collegeId + ', ' + action + ')');
    $('#couponReassignModal').modal('show');
    
    $('#couponReassignModal #assignedTo_chosen').on('click', function(e) {
        $(this).removeClass('chosen-container-single-nosearch').find('input').attr('readonly', false);
    });
    
    $('#couponReassignModal #assignedTo_chosen input').on('input', function(e) {
        populateAssigneeUsers(this, 'assignedTo', 'Assign From');
    });
    floatableLabel();
}


function initiateCouponAction(couponId, collegeId, action) {    
    $("#couponMessageDiv").html("").hide();
    $('#couponReassignModal #assignedFrom').val('');
    $('#couponReassignModal #assignedTo').val('');
    $('#couponReassignModal #couponRemark').val('');
    
    switch(action) {
        case 56://Issue
            $('#couponReassignModal #actionTitle').text('Issue');
            $('#couponReassignModal #unassignFromRow, #couponReassignModal #assignedToListDiv').show();
            getCouponAssigneeList(collegeId, 'single', couponId);
            break;
        case 57://Return
            $('#couponReassignModal #actionTitle').text('Return');
            $('#couponReassignModal #unassignFromRow, #couponReassignModal #assignedToListDiv').hide();
            break;
        case 63://Return & Receive
            $('#couponReassignModal #actionTitle').text('Return & Receive');
            $('#couponReassignModal #unassignFromRow, #couponReassignModal #assignedToListDiv').hide();
            break;
        case 58://Receive
            $('#couponReassignModal #actionTitle').text('Receive');
            $('#couponReassignModal #unassignFromRow, #couponReassignModal #assignedToListDiv').hide();
            break;
        case 59://Sell
            $('#couponReassignModal #actionTitle').text('Sell');
            $('#couponReassignModal #unassignFromRow, #couponReassignModal #assignedToListDiv').hide();
            break;
        case 60://Force Return
            $('#couponReassignModal #actionTitle').text('Force Return');
            $('#couponReassignModal #unassignFromRow, #couponReassignModal #assignedToListDiv').hide();
            break;
        case 61://Force Return & Receive
            $('#couponReassignModal #actionTitle').text('Force Return & Receive');
            $('#couponReassignModal #unassignFromRow, #couponReassignModal #assignedToListDiv').hide();
            break;
    }
    
    $('#couponReassignModal #statusSaveButton').attr('onclick', 'updateCouponAssignStatus(' + couponId + ', ' + collegeId + ', ' + action + ')');
    $('#couponReassignModal').modal('show');
    floatableLabel();
}

function updateCouponAssignStatus(couponId, collegeId, action) {    
    var assignedFrom = $('#couponReassignModal #assignedFrom').val();
    var assignedTo = $('#couponReassignModal #assignedToHidden').val();
    var couponRemark = $('#couponReassignModal #couponRemark').val();
    var disCouponId = $('#filterCollegeCouponForm #disCouponId').val();
    
    $.ajax({
        url: jsVars.updateCouponAssignedStatusLink,
        type: 'post',
        data: {couponId:couponId, collegeId:collegeId, disCouponId:disCouponId, action:action, actionType:'single', assignedFrom:assignedFrom, assignedTo:assignedTo, couponRemark:couponRemark },
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: false,
        beforeSend: function () { 
            $('#listloader').show();
        },
        complete: function () {
            $('#listloader').hide();
        },
        success: function (json) {
            if (json['redirect']) {
                location = json['redirect'];
            } else if (json['error']) {
                $('#couponReassignModal #couponMessageDiv').html(json['error']).show();
            } else if (json['status'] == 200) {
                $('#couponReassignModal').modal('hide');
                alertPopup(json['message'], 'success');
                LoadMoreCoupons('reset');
            }            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function updateCouponAssignStatusInBulk(collegeId, action) {
    var selectedCoupons   = [];
    $('input:checkbox[name="selected_coupons[]"]').each(function () {
        if (this.checked) {
            selectedCoupons.push(parseInt($(this).val()));
        }
    });
    $('#couponReassignModal #couponMessageDiv').html('')
    if ((selectedCoupons.length > 0) || ($('#select_all:checked').val() == 'select_all')) {
        var data = $('form#filterCollegeCouponForm').serializeArray();
        if ($('#select_all:checked').val() == 'select_all') {
            data.push({name: 'selectedCoupons', value: 'all'});        
        } else {
            data.push({name: 'selectedCoupons', value: selectedCoupons});
        }
        data.push({name: 'assignedTo', value: $('#couponReassignModal #assignedToHidden').val()});
        data.push({name: 'couponRemark', value: $('#couponReassignModal #couponRemark').val()});
        data.push({name: 'collegeId', value: collegeId});
        data.push({name: 'action', value: action});
        data.push({name: 'actionType', value: 'bulk'});
        $.ajax({
            url: jsVars.updateCouponAssignedStatusLink,
            type: 'post',
            data: data,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars.csrfToken
            },
            beforeSend: function () {
                $('#listloader').show();
            },
            complete: function () {
                $('#listloader').hide();
            },
            success: function (json) {
                if (json['redirect']) {
                    location = json['redirect'];
                } else if (json['error']) {
                    $('#couponReassignModal #couponMessageDiv').show()
                    $('#couponReassignModal #couponMessageDiv').html(json['error']);
                } else if (json['status'] == 200) {
                    $('#couponReassignModal').modal('hide');
                    alertPopup(json['message'], 'success');
                    filterResetModal();
                    LoadMoreCoupons('reset');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    } else {
        alertPopup('Please select Application/Coupon Number', 'error');
    }
    return false;
}

function getCouponAssigneeList(collegeId, actionType, couponId) {
    //hide Assigned From in Bulk
    if (actionType === 'single') {
        var assignedFrom  = '<label class="floatify__label float_addedd_js">From <span class="requiredStar"></span></label><select name="assignedFrom" id="assignedFrom" class="chosen-select" tabindex="-1" data-placeholder="Assigned From"></select>';
        $('#unassignFromDiv').html(assignedFrom);
    }
    
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    $("#couponRemark").val('');
    $("#couponRemark").parent().removeClass('floatify__active');
    $("#couponMessageDiv").html('');
    
    $.ajax({
        url: jsVars.getCouponAssigneeListLink,
        type: 'post',
        data: {couponId:couponId, collegeId:collegeId, actionType:actionType },
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: false,
        beforeSend: function () { 
            $('#listloader').show();
        },
        complete: function () {
            $('#listloader').hide();
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});            
        },
        success: function (responseObject) {
            if (responseObject.message === 'session') {
                location = jsVars.FULL_URL + jsVars.LOGOUT_PATH;
            }
            var currentAssignee = '';
            if ((actionType === 'single') && (typeof responseObject.couponAssignedTo !== 'undefined') && (responseObject.couponAssignedTo > 0)) {
                currentAssignee = responseObject.couponAssignedTo;
            }
            
            if (typeof responseObject.userList === "object") {
                $.each(responseObject.userList, function (index, item) {
                    if (currentAssignee != "") {
                        if (currentAssignee == index) {
                            responseObject.currentAssigneeList = {};
                            responseObject.currentAssigneeList[index] = item;
                        }                        
                    }
                });
            }
            if ((actionType == 'single') && (typeof responseObject.currentAssigneeList === "object")) {
                var unassignFrom = '<label class="floatify__label float_addedd_js">From <span class="requiredStar"></span></label><select name="assignedFrom" id="assignedFrom" class="chosen-select" tabindex="-1" data-placeholder="Assigned From">';
                var isex = false;
                $.each(responseObject.currentAssigneeList, function (index, item) {
                    unassignFrom += '<option value="' + index + '" selected="selected">' + item + '</option>';
                    isex = true;
                });
                unassignFrom += '</select>';
                $('#unassignFromDiv').html(unassignFrom);
                if (isex == true) {
                    $("#unassignFromRow label span[class='requiredStar']").html('*');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function countResult(html){
    var len = (html.match(/listDataRow/g) || []).length;
    return len;
}

if ($('.actions-all li:visible').length < 1 ) {
    $('.actions-all').parent().removeClass('dropdown-menu');
}
$('#li_bulkIssueCouponAction,#li_bulkReturnCouponAction,#li_bulkReceiveCouponAction,#li_bulkSellCouponAction,#li_bulkForceReturnCouponAction,#li_bulkForceReturnReceiveCouponAction').hide();
