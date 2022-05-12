$(document).ready(function(){
    loadMoreClientDataIssues();
});

function loadMoreClientDataIssues(){
    
    var data = $('#FilterForm').serializeArray();
    var collegeId = $("#college_id").val();
    var dateRange = $('#date_range_productivity').val();
    $.ajax({
        url: jsVars.FULL_URL + '/reports/ajax-client-data-issues-list',
        type: 'post',
        dataType: 'html',
        data: {
            "data": data,
            "page": page,
            "collegeId" : collegeId,
            "dateRange": dateRange
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () { 
            $('#load_more_button').attr("disabled", "disabled");
            $('#load_more_button').html("Loading...");
        },
        complete: function () {
            $('#load_more_button').attr("disabled", false);
            $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Data');
        },
        success: function (response) { 
            
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                if(responseObject.data.html) {
                    $("#load_more_results").append(responseObject.data.html);
                } else {
                    $('#load_more_results').append("<tr><td colspan='5'><div class='text-danger text-center fw-500'>No More Records</div></td></tr>");
                    $('#load_more_button').hide();
                }
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message);
                }
            }
            page = page + 1;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr);
            console.log(thrownError);
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}