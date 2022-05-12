
 function selectExamMode(){
    var examModeChange = $('.examModeChange').val();     
    if(examModeChange=='' || examModeChange==null){
        $('.errorMessage').text('Please Select Exam Mode');
    }else{
        var examUrl =  $('input[name=exam_mode]').val();
        if((examUrl!='') && (examModeChange!=null || examModeChange!='')){
            var url = examUrl;
            var firstStr = url.substring(0, url.lastIndexOf("/") + 1);
            var lastStr = url.substring(url.lastIndexOf("/") + 1, url.length);
            var finalExamUrl = firstStr+examModeChange+'/'+lastStr;
            $(".btnChangeExamMode").attr("disabled","disabled");
            window.location.href=finalExamUrl;                
        }else{
            $('.errorMessage').text('Please Select Exam Mode');
        }          
    } 
}


(function(){
    $('#neither').click(function(){
        if($(this).is(':checked')){
            $('#field_opt_preference_phone_yes').removeAttr('checked');
            $('#field_opt_preference_sms_yes').removeAttr('checked');
        }
    });

    $('#field_opt_preference_phone_yes,#field_opt_preference_sms_yes').click(function(){
        if($(this).is(':checked')){
            $('#neither').removeAttr('checked');
        }
    });

	/*if($('.msg_dismissible').length){
		$('.msg_dismissible .close').click(function(){
			$(this).parent().fadeOut();
		})
	}*/

    function getCommunicationLogsActivity(listingType){
        $('#userProfileLoader').show();
        if(listingType !== 'loadmore'){
            $("#activityPage").val(1);
        }

        $.ajax({
            url: jsVars.getUserCommunicationActivityLogsLink,
            type: 'post',
            data: {'page':$("#activityPage").val()},
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars.csrfToken
            },
            beforeSend: function () { 
                $('#userProfileLoader').show();
            },
            complete: function () {
                $('#userProfileLoader').hide();
            },
            success: function (html) {
                var checkError  = html.substring(0, 6);
                if (html === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }
                else if (checkError === 'ERROR:'){
                    alert(html.substring(6, html.length));
                }
                else{
                    html    = html.replace("<head/>", "");
                    var countRecord = countResult(html);
                    if(listingType !== 'loadmore'){
                        $("#activityLogsDiv").html(html);
                    }
                    else{
                        $('#activityLogsDiv ul').append(html);
                    }

                    if(countRecord < 10){
                        $('#LoadMoreActivity').hide();
                    }
                    else{
                        $('#LoadMoreActivity').show();
                    }
                    $("#activityPage").val(parseInt($("#activityPage").val())+1);
                    //play one player at a time
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
    function countResult(html){
        var len = (html.match(/tmMsg/g) || []).length;
        return len;
    }
    
        
    $(document).on('click','.template-log-details',function(){
        var id = $(this).data('key');
        var title = $(this).attr('title').toUpperCase();
        $.ajax({
            url: jsVars.getUserCommunicationActivityLogsViewLink,
            type: 'post',
            data: {'id':id},
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars.csrfToken
            },
            beforeSend: function () { 
                $('#userProfileLoader').show();
            },
            complete: function () {
                $('#userProfileLoader').hide();
            },
            success: function (html) {
                var checkError  = html.substring(0, 6);
                if (html === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }
                else if (checkError === 'ERROR:'){
                    alertPopup(html.substring(6, html.length),'error');
                }
                else{
                    html    = html.replace("<head/>", "");
                    alertPopup(html,'success');
                    $('#SuccessPopupArea').addClass('modalWide');
                    $('#SuccessPopupArea #MsgBody').addClass('scrollContent');
                    $('#SuccessPopupArea .modal-title').html(title);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });
    
    $('#getCommunicationPreferences').click(function(e){
        $.ajax({
            url: jsVars.FULL_URL+"/communication-preferences",
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
                $('#preferencesModal #preferencesModalLabel').html('Communication Preference');
                $('#preferencesModal #myModalLabel').html('Communication Preference');
                $('#scaletext').html('');
                $('#comm_pref').html(html);
                $('#preferencesModal').modal({backdrop: 'static', keyboard: false});
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });
    
    window.getCommunicationLogsActivity = getCommunicationLogsActivity;
    
})();

    function submitCommPreference(id){
        if(typeof id == 'undefined' || id == null || id == ''){
            id = '';
        }
        else{
            id = '#'+id;
        }
        var formData =  $(id+' form#communication_preference_form').serializeArray();
        
//        alert($('[name="field_opt_preference_sms"]:checked').val());
//        $(id+' form#communication_preference_form').ajaxSubmit({
        $.ajax({
            url: jsVars.FULL_URL+'/form/update-communication-preference',
            type: 'post',
            dataType: 'json',
            data:formData,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                if (data['error'] === "session") {
                    window.location.reload(true);
                }
                else if(typeof data['error'] !=='undefined' && data['error']!==''){
                    $('#preferencesModal').modal('hide');
                    $('#preferencesModal_Dashboard').modal('hide');
                    alertPopup(data['error'],'error');
                }
                else if (data['success'] === 200) {
                    $('#preferencesModal').modal('hide');
                    $('#preferencesModal_Dashboard').modal('hide');
                    alertPopup(data['msg'],'success');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
//        return;
    }

    

function alertPopup(msg, type, location) {
    var selector_parent, selector_titleID, selector_msg, title_msg, btn;
    if (type == 'error') {
        selector_parent = '#ErrorPopupArea';
        selector_titleID = '#ErroralertTitle';
        selector_msg = '#ErrorMsgBody';
        btn = '#ErrorOkBtn';
        title_msg = 'Error';
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

    if (typeof location != 'undefined') {
        $(btn).show();

        $(selector_parent).modal({keyboard: false}).one('click', btn, function (e) {
            e.preventDefault();
            window.location.href = location;
        });
    } else {
        $(selector_parent).modal();
    }
}
if (document.documentElement.clientWidth > 968) {
	$('.modal').on('hidden.bs.modal', function (e) {
	  $('body').css('padding-right', 0);
	})
}

// Introduce My Prep Link
if (window.location.href.indexOf("?test-preparation") > -1) {
	var testPrepPos = $('#test-preparation').offset().top - 20;
	$('html, body').animate({scrollTop: testPrepPos}, 100);
	$('.myPrepLink').addClass('active');
	$('.dashboardLink ').removeClass('active');
}

if (document.documentElement.clientWidth > 968) {
	var dataUrlDashboard  = $('.dashboardLink > a').attr('href');
	var dataUrlmyPrep  = $('.myPrepLink > a').attr('href');
	if(window.location.href === dataUrlDashboard || window.location.href === dataUrlmyPrep ){
		$('.myPrepLink > a').click(function(e){
			var testPrepPos = $('#test-preparation').offset().top;
			$('.myPrepLink').addClass('active');
			$('.dashboardLink').removeClass('active');
			$('html, body').animate({scrollTop: testPrepPos}, 100);
			e.preventDefault();
		});
		$('.dashboardLink > a').click(function(e){
			$('.myPrepLink').removeClass('active');
			$('.dashboardLink').addClass('active');
			$('html, body').animate({scrollTop: 0}, 100);
			e.preventDefault();
		});
	}
}