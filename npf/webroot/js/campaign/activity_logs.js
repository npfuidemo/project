var selectedCollegeId   = '';
$(document).ready(function(){
    LoadReportDateRangepicker();
    $('#activityLogsLoader.loader-block').hide();
    $("#college_id").change(loadFilters);
    if($("#college_id").val()!=''){
        selectedCollegeId   = $("#college_id").val();
        $('#college_id').prop('disabled', true).trigger("chosen:updated");
        loadFilters();
        loadMoreLogs('reset');
    }
});

function loadFilters(){
    var user      = '<select id="user_id" class="chosen-select" tabindex="-1" name="user_id"><option selected="selected" value="">User Name</option></select>';
    $('#userDiv').html(user);
    var campaign      = '<select id="campaign_id" class="chosen-select" tabindex="-1" name="campaign_id"><option selected="selected" value="">Campaign Name</option></select>';
    $('#campaignNameDiv').html(campaign);
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    $('#activityLogsLoader.loader-block').hide();
    var collegeId       = selectedCollegeId;
    if(collegeId==''){
        collegeId   = $("#college_id").val();
    }
    if(collegeId==""){
        return ;
    }
    $.ajax({
        url: jsVars.getFiltersLink,
        type: 'post',
        data: {'collegeId' : collegeId},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#activityLogsLoader.loader-block').show();
        },
        complete: function () {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('#activityLogsLoader.loader-block').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    if(typeof responseObject.data.userList === "object"){
                        var userList    = responseObject.data.userList;
                        var value   = '<select id="user_id" class="chosen-select" tabindex="-1" name="user_id" style="display: none;"><option selected="selected" value="">User Name</option>';
                        $.each(userList, function (index, item) {
                            value += '<option value="'+index+'">'+item+'</option>';
                        });
                        value += '</select>';
                        $('#userDiv').html(value);
                    }
                    
                    if(typeof responseObject.data.campaignList === "object"){
                        var campaignNameList    = responseObject.data.campaignList;
                        var value   = '<select id="campaign_id" class="chosen-select" tabindex="-1" name="campaign_id" style="display: none;"><option selected="selected" value="">Campaign Name</option>';
                        $.each(campaignNameList, function (index, item) {
                            value += '<option value="'+index+'">'+item+'</option>';
                        });
                        value += '</select>';
                        $('#campaignNameDiv').html(value);
                    }
                }
            }else{
                alert(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function loadMoreLogs(listingType){
    var collegeId       = selectedCollegeId;
    if(collegeId==''){
        collegeId   = $("#college_id").val();
    }
    if(collegeId==""){
        
        $('#activityLogsContainerSection').html("<div class='col-lg-12'><table class='table table-striped list_data table-border'><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>Please select a college to view activity logs.</h4></div></div> </td></tr><tr></tr></table></div>");
        return;
    }
    if(listingType === 'reset'){
        $("#page").val(1);
    }
    var data    = {"college_id":collegeId,"user_id":$("#user_id").val(),"campaign_id":$("#campaign_id").val(),"date_range":$("#date_range").val(),"page":$("#page").val()};
    console.log(data);
    $.ajax({
        url: jsVars.loadMoreDetailedReportLink,
        type: 'post',
        data: data,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#activityLogsLoader.loader-block').show();
        },
        complete: function () {
            $('#activityLogsLoader.loader-block').hide();
        },
        success: function (html) {            
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
                    $('#activityLogsContainerSection').html(html);
                }else{
                    $('#activityLogsContainerSection').find("tbody").append(html);
                }
                if(countRecord < 10){
                    $('#LoadMoreArea').hide();
                }else{
                    $('#LoadMoreArea').show();
                }
                $("#page").val(parseInt($("#page").val())+1);
            }
            table_fix_rowcol();
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
