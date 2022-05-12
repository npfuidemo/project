(function(){
    // feedback 
    $('#getApplicantFeedback').click(function(){
        $('#scaletext').html('');
        $('#preferencesModal #preferencesModalLabel').html('We would appreciate your feedback');
        $('#preferencesModal #preferencesModalLabel').after('<p id="scaletext">On a scale of 0-5 with 5 being most positive.</p>');
        
        $.ajax({
            url: jsVars.FULL_URL+"/get-feedback-form",
            type: 'post',
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('#userProfileLoader').show();
                $('.overlay').trigger('click');
            },
            complete: function () {
                $('#userProfileLoader').hide();
            },
            success: function (html) {
                $('#scaletext').html('');
                $('#preferencesModal #preferencesModalLabel').html('We would appreciate your feedback');
                $('#preferencesModal #preferencesModalLabel').after('<p id="scaletext">On a scale of 0-5 with 5 being most positive.</p>');
                $('#comm_pref').html(html);
                $('#preferencesModal').modal({backdrop: 'static', keyboard: false});
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });
 
    // feddback
    $(document).on('click','#rating_submit_button',function(){
        var data = $('#feedbackRatingForm').serializeArray();
        $('#rating_submit_button').prop('disabled',true);
        $.ajax({
            url: jsVars.FULL_URL+"/save-feedback-form",
            type: 'post',
            data: data,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('#userProfileLoader').show();
                $('.overlay').trigger('click');
            },
            complete: function () {
                $('#userProfileLoader').hide();
            },
            success: function (data) {    
                if (data['error'] === "session") {
                    window.location.reload(true);
                }
                else if(typeof data['error'] !=='undefined' && data['error']!==''){
                    $('#preferencesModal').modal('hide');
                    alertPopup(data['error'],'error');
                    $('#rating_submit_button').prop('disabled',false);
                }
                else if (data['success'] === 200) {
                    $('#preferencesModal').modal('hide');
                    alertPopup('Feedback successfully saved','success');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });   
})();