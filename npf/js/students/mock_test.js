function startTest(hash, lId,testURL) {
    //alert(jsVars._csrfToken);
    if (hash != '') {
        
        if(typeof testURL==="undefined" || testURL=='' || testURL==null){
            testURL = 'exam/enroll';
        }
        
        anchorText = $('#'+lId).text();
        
        $.ajax({
            url: testURL,
            type: 'post',
            dataType: 'json',
            data: {
                "hash": hash,
            },
            beforeSend: function (xhr) {
                $('#'+lId).html('Please Wait.');
                $('#'+lId).attr('disabled',true);
            },
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            success: function (data) {
                if(data=="session_logout"){
                    window.location.reload(true);
                }
                
                if (data.data.status == 1) {
                   window.open(data.data.ssoUrl, "_blank");
                   $('#'+lId).attr('disabled',false);
                   $('#'+lId).html(anchorText);
                }
                else if (data.data.status == 3) {
                    $('#'+lId).html(data.data.message);
                    $('#'+lId).attr('disabled',true);
                }
                else {
                    if (data.data.message != '') {
                        alert(data.data.message);
                    }
                    else {
                        alert('Cuurently this feature is not working. Please try again.');
                    }

                    $('#'+lId).attr('disabled',false);
                    $('#'+lId).html(anchorText);
                    
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            },
            complete: function (jqXHR, textStatus) {
                //$('#'+lId).html('Redirecting.');
            }
        });
    }
    else {
        alert('Invalid Request.');
        return false;
    }
}