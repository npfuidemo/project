/*!
 * Discount Coupon Activity Logs
 * Date: 2017-05-09T07:44:44.656Z
 */

/* Load listing on page log */
$(document).ready(function(){
    LoadReportDateRangepicker();
    loadMoreActivityLogs('reset');
    $('.daterangepicker').addClass('couponListDateRange');
    var selected_college_id = $('#CollegeIdInput').val();
    if(selected_college_id !='' && selected_college_id !='undefined' && selected_college_id != 0){
        loadCollegeAssociatedUser('yes');
    }
});

function loadMoreActivityLogs(listingType){
    /* first time load */
    if(listingType === 'reset'){
        $("#page").val(1);
    }
    /* ajax to load data */
    $.ajax({
        url: jsVars.loadMoreDiscountCouponActivityLink,
        type: 'post',
        data: $('#filterActivityLogs').serializeArray(),
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
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alertPopup(html.substring(6, html.length),'error');
                $('#LoadMoreArea').hide();
            }else{
                var countRecord = countResult(html);
                html    = html.replace("<head/>", "");
                if(listingType === 'reset'){
                    $('#VoucherListContainerSection').html(html);
                }else{
                    $('#VoucherListContainerSection').find("tbody").append(html);
                }
                if(countRecord < jsVars.ITEM_PER_PAGE){
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
/**
 * count table row, use for display loadmore or not
 * @param string html
 * @returns {Number|jQuery.length}
 */
function countResult(html){
    var data = {};
    var len = 0;
    data.html = "<table>"+html+"</table>";
    $.grep($.parseHTML(data.html), function(el, i) { 
        len = $(el).find('tr.listDataRow').length;
    });
    return len;
}

//fetch User on change of college start here
function loadCollegeAssociatedUser(select_user)
{
    if(typeof select_user == 'undefined' || select_user==''){
        select_user = 'no';
    }
    $.ajax({
        url: jsVars.GetCollegeUsersList,
        type: 'post',
        dataType: 'json',
        async:false,
        data: $('#CollegeIdInput'),
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if (json['redirect']){
                    location = json['redirect'];
            }
            else if (json['error']){
//                alertPopup(json['error'], 'error');
                var html = '<option value="0">Select User</option>';
                $('#UserListSection').html(html);    
                $('#UserListSection').trigger('chosen:updated');
            }
            else if (json['success'] == 200){
                if(json['UsersList'].length == 0)
                {
                    alertPopup('No user found!', "error");
                }
                var html = '';
                if(select_user=='yes'){
                    var html = '<option value="0">Select User</option>';
                }else{
                    var html = '';
                }
                var PreSelected = jsVars.UserAccessList;
                for(var UserId in json['UsersList'])
                {
                    if(UserId in PreSelected)
                    {
                        html += '<option value="'+UserId+'" selected="selected">'+json['UsersList'][UserId]+'</option>';
                    }
                    else
                    {
                        html += '<option value="'+UserId+'">'+json['UsersList'][UserId]+'</option>';
                    }
                }
                
                $('#UserListSection').html(html);    
                $('#UserListSection').trigger('chosen:updated');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}    