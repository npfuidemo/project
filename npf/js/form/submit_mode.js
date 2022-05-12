$(document).ready(function () {
    $('[data-toggle="popover"]').popover();
    
    $("#saveBtn" ).click(function() {
        validateFormData();
    });
});

$(window).load(function() {
    $('.loader-block').hide();
    $('.loader-block').removeClass("loaderOveride");
});


function validateFormData(){
    $('#span_submit_mode').hide();
    if($("input:radio[name='submit_mode']").is(":checked")) {
        var mode=$("input:radio[name='submit_mode']:checked").val();
        
        $('#ConfirmMsgBody').html('Are you sure to proceed with '+mode+' application mode?');
        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                $('#submit_mode').submit();
                $('#ConfirmPopupArea').modal('hide');
            return true;
        });
    }else{
        $('#span_submit_mode').html("Please select your application mode.");
        $('#span_submit_mode').fadeIn();
        return false;
    }
}