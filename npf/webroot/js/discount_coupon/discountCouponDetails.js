$(document).ready(function(){
    loadMoreCoupons('reset');
    // code for search box starts
    if ($('#search').length > 0) {
            //Manage Application Search Field
            $('#search').typeahead({
                hint: true,
                highlight: true,
                minLength: 1
                , source: function (request, response) {
                    var search = $('#search').val();
                    if (search)
                    {
                        $.ajax({
                            url: jsVars.searchDiscountCouponLink,
                            data: {search: search},
                            dataType: "json",
                            type: "POST",
                            headers: {
                                "X-CSRF-Token": jsVars._csrfToken
                            },
                            //contentType: "application/json; charset=utf-8",
                            success: function (data) {
                                items = [];
                                map = {};
                                $.each(data.listDiscountCoupons, function (i, item) {
                                    var name = item;
                                    map[name] = {name: name};
                                    items.push(name);
                                });
                                response(items);
                                $(".dropdown-menu").css("height", "auto");
                            },
                            error: function (response) {
                                alertPopup(response.responseText);
                            },
                            failure: function (response) {
                                alertPopup(response.responseText);
                            }
                        });
                    }
                }
            });
        }
    // code for search box ends
    
    $('.searchCollegeCoupon').keypress(function (e) {
        var key = e.which;
        if(key === 13)  // the enter key code
        {
            loadMoreCoupons('reset');
        }
    });    
    
});

function loadMoreCoupons(listingType){
    if(listingType === 'reset'){
        $("#page").val(1);
    }
    $.ajax({
        url: jsVars.loadMoreCollegeCouponLink,
        type: 'post',
        data: {'discountCouponId':jsVars.discountCouponId, 'searchDiscountCoupon':jsVars.searchDiscountCoupon,'searchCollegeCoupon':$('#search').val(), 'page':$("#page").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#couponListLoader.loader-block').show();
        },
        complete: function () {
            $('#couponListLoader.loader-block').hide();
        },
        success: function (html) {
//            alert(html); return;
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
                $('#LoadMoreArea').hide();
            }else{
                var countRecord = countResult(html);
                html    = html.replace("<head/>", "");
                if(listingType === 'reset'){
                    $('#VoucherListContainerSection').html(html);
                }else{
                    // scroll to bottom
                    $('#parent').animate({scrollTop: $('#parent').prop("scrollHeight")});
                    $('#VoucherListContainerSection').find("tbody").append(html);
                }
                if(countRecord < 10){
                    $('#LoadMoreArea').hide();
                }else{
                    $('#LoadMoreArea').show();
                }
                $("#page").val(parseInt($("#page").val())+1);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
};

function countResult(html){
    var len = (html.match(/listDataRow/g) || []).length;
    return len;
}


function confirmDisable(collegeCouponId,collegeId,couponCode,token){
    $("#confirmModal .modal-body").html("<p>Are you sure you want to disable this coupon?</p>");
    $("#confirmButton").attr("onclick",'disableCoupon('+collegeCouponId+','+collegeId+',"'+couponCode+'","'+token+'");');
    $('#confirmModal').modal('show');
}
function disableCoupon(collegeCouponId,collegeId,couponCode, token){
    $('#confirmModal').modal('hide');
    $.ajax({
        url: jsVars.disableCollegeCouponLink,
        type: 'post',
        data: {'collegeCouponId' : collegeCouponId,'collegeId' : collegeId,'couponCode' : couponCode,'token' : token},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#couponListLoader.loader-block').show();
        },
        complete: function () {
            $('#couponListLoader.loader-block').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                $("#couponStatus"+collegeCouponId).html("Disabled");
                $("#couponDisableLink"+collegeCouponId).attr('style', 'display:none');
                $("#couponEnableLink" + collegeCouponId).attr('style', 'display:block');
            }else if(responseObject.status=='reload'){                
                $("#couponStatus"+collegeCouponId).html("Disabled");
                $("#couponDisableLink"+collegeCouponId).attr('style', 'display:none');
                $("#couponEnableLink" + collegeCouponId).attr('style', 'display:block');
                parent.location.reload();
            }else{
                alert(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function confirmEnable(linkId, token) {
    $("#confirmModal .modal-body").html("<p>Are you sure you want to enable this coupon?</p>");
    $("#confirmButton").attr("onclick", 'enableCoupon(' + linkId + ',"' + token + '");');
    $('#confirmModal').modal('show');
}
function enableCoupon(linkId, token) {
    $('#confirmModal').modal('hide');
    $.ajax({
        url: jsVars.enableCollegeCouponLink,
        type: 'post',
        data: {'token': token},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#couponListLoader.loader-block').show();
        },
        complete: function () {
            $('#couponListLoader.loader-block').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                $("#couponStatus" + linkId).html("Enabled");
                $("#couponEnableLink" + linkId).attr('style', 'display:none');
                $("#couponDisableLink" + linkId).attr('style', 'display:block');
            } else if (responseObject.status == 'reload') {
                $("#couponStatus" + linkId).html("Enabled");
                $("#couponEnableLink" + linkId).attr('style', 'display:none');
                $("#couponDisableLink" + linkId).attr('style', 'display:block');
                parent.location.reload();
            } else {
                alert(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}