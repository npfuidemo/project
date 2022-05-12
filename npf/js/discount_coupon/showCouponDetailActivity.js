$(document).ready(function(){
    loadMoreActivity('reset');
});

function loadMoreActivity(listingType){
    $.ajax({
        url: jsVars.FULL_URL + '/discount-coupons/couponHistoryDetails',
        type: 'post',
        data: {couponCode: jsVars.couponCodeLink,disCouponId:jsVars.disCouponIdLink, conditionalFieldValue: jsVars.conditionalFieldValueLink,collegeId: jsVars.collegeIdLink,'page':$("#page").val()},
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
        success: function (html)
        {
            console.log(html)
            var countRecord = countResult(html);
            html    = html.replace("<head/>", "");
            if(listingType === 'reset'){
                $('#VoucherListContainerSection').html(html);
            }else{
                // scroll to bottom
                $('#parent').animate({scrollTop: $('#parent').prop("scrollHeight")});
                $('#VoucherListContainerSection').find("tbody").append(html);
            }
            if(countRecord < 5){
                $('#LoadMoreActivityArea').hide();
            }else{
                $('#LoadMoreActivityArea').show();
            }
            $("#page").val(parseInt($("#page").val())+1);
//
//$("#discountCouponDetail").html(data);
            //$('#discountCouponDetailModal').modal('show');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('div.loader-block').hide();
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function countResult(html){
    var len = (html.match(/listDataRow/g) || []).length;
    return len;
}