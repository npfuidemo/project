/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


//For Dropdown Menu Country Dial Code
$(document).ready(function(e){
    $( document ).on( 'click', '.bs-dropdown-to-select-group .dropdown-menu-list li', function( event ) {
    	var $target = $( event.currentTarget );
                var fieldId = $(this).data("fieldid");
		$target.closest('.bs-dropdown-to-select-group')
			.find('[data-bind="bs-drp-sel-value"]').val($target.attr('data-value'))
			.end()
			.children('.dropdown-toggle').dropdown('toggle');
		$target.closest('.bs-dropdown-to-select-group')
                //.find('[data-bind="bs-drp-sel-label"]').text($target.context.textContent);
    		.find('[data-bind="bs-drp-sel-label"]').text($target.attr('data-value'));

                //When Select the option from dropdown then close the open dropdown
              $target.closest('.bs-dropdown-to-select-group').removeClass('open');

                //Bydefault remove the value when value will change
                $('#'+fieldId).val('');

                //For change Maxlength value of Mobile Input Box as per selection of country code
                if ($target.attr('data-value') == jsVars.defaultCountryCode) {
                    $('#'+fieldId).attr('maxlength',jsVars.maxMobileLength);
                } else {
                    $('#'+fieldId).attr('maxlength',jsVars.internationalMaxMobileLength);
                }
		return false;
	});
        jQuery('.filter_dial_code').on('click', function (e) {
                  e.stopPropagation();
               });
});


function getStateCityById(stateCityValue,defaultValue){
    if(typeof defaultValue == 'undefined'){
        defaultValue = '';
    }
    var dataVal = {};
    var htmlId = '';
    var ajaxUrl = '';
    if(typeof stateCityValue.country != 'undefined' && stateCityValue.country !='' ){
        dataVal = {'country':stateCityValue.country};
        htmlId  = '#state';
        ajaxUrl = '/common/getStateList';
    }
    else if(typeof stateCityValue.state != 'undefined' && stateCityValue.state !='' ){
        dataVal = {'state':stateCityValue.state};
        ajaxUrl = '/common/getCityList';
        htmlId = '#city';
    }
    
    if(htmlId != ''){
        $.ajax({
            url: ajaxUrl,
            type: 'post',
            data: dataVal,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {

                if (json['redirect'])
                {
                    location = json['redirect'];
                } else if (json['error'])
                {
                    alertPopup(json['error'], 'error');
                } else if (json['success'] == 200)
                {
                    if(htmlId == '#state'){
                    var html = '<option value="" selected="selected">Select state</option>';
                        for (var i in json['States']) {
                            html += '<option value="' + i + '">' + json['States'][i] + '</option>';
                        }
                    }
                    else if(htmlId == '#city'){
                        var html = '<option value="" selected="selected">Select city</option>';
                        for (var i in json['Cities']) {
                            html += '<option value="' + i + '">' + json['Cities'][i] + '</option>';
                        }
                    }

                    $(htmlId).html(html);
                    $(htmlId).attr('disabled', false);
                    $(htmlId).trigger("chosen:updated");

                    if(defaultValue != ''){
                        $(htmlId).val(defaultValue);
                        $(htmlId).attr('disabled', false);
                        $(htmlId).trigger("chosen:updated");
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

$(document).on('change', '#create-resident-advisors #country', function () {
    if (this.value) {
        getStateCityById({'country':this.value});
    }
    else {
        $('#state').html('<option value="">Select state</option>');
        $('#state').attr('disabled', true);
        $("#state").trigger("chosen:updated");
        $('#city').html('<option value="">Select city</option>');
        $('#city').attr('disabled', true);
        $("#city").trigger("chosen:updated");
    }
});

$(document).on('change', '#create-resident-advisors #state', function () {
    if (this.value)
    {
        getStateCityById({'state':this.value});
    } else
    {
        $('#city').html('<option value="">Select city</option>');
        $('#city').attr('disabled', true);
        $("#city").trigger("chosen:updated");
    }
});


function getCounsellorsList(userId, collegeId,defaultValue){

    if(typeof defaultValue =='undefined'){
        defaultValue = '';
    }
    $.ajax({
//        url: jsVars.getCounsellorsListLink,
        url: jsVars.FULL_URL+"/counsellors/get-counsellors-list-for-followups",
        type: 'post',
        data: {'userId' : userId, 'collegeId':collegeId, moduleName:'lead'},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        async: false,
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            hideLoader();
//            $('.chosen-select').chosen();
//            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
//            $('.sumo-select').SumoSelect({placeholder: 'Select Counsellors', search: true, searchText:'Select Counsellors'});
        },
        success: function (response) {

            console.log(response);

            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    if(typeof responseObject.data.counsellors === "object"){
                        var counsellors  = '<option value="">Select Counsellor</option>';
                        $.each(responseObject.data.counsellors, function (index, item) {
                            counsellors += '<option value="'+index+'">'+item+'</option>';
                        });

                        $('#counsellor_id').html(counsellors);
                        $('#counsellor_id').attr('disabled', false);
                        $('#counsellor_id').trigger("chosen:updated");

                        if(defaultValue!=''){
                            $('#counsellor_id').val(defaultValue);
                            $('#counsellor_id').attr('disabled', false);
                            $('#counsellor_id').trigger("chosen:updated");
                        }
                    }
                }
            }
            else{
                console.log(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}




// function: Get All Forms of a College
function ajaxGetCounsellorList(CollegeId,defaultValue)
{
    if(typeof defaultValue =='undefined'){
        defaultValue = '';
    }
    
    if (CollegeId)
    {
        $.ajax({
            url: '/communications/ajaxGetCounsellorList',
            type: 'post',
            data: {CollegeId: CollegeId},
             dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (obj_json)
            {
//                var obj_json = JSON.parse(json);
                if (obj_json.redirect){
                    location = obj_json.redirect;
                }else if (obj_json['error']){
                    alertPopup(obj_json.error, 'error');
                }
                obj_jsonObj = obj_json.data;

                var html = "<option value=''>Select Counsellors</option>";
                for (var key in obj_jsonObj)
                {
                    var val = obj_jsonObj[key];
                    html += "<option value='" + key + "'>" + val + "</option>";
                }

                $('#counsellor_id').html(html);
                $('#counsellor_id').attr('disabled', false);
                $('#counsellor_id').trigger("chosen:updated");

                if(defaultValue!=''){
                    $('#counsellor_id').val(defaultValue);
                    $('#counsellor_id').attr('disabled', false);
                    $('#counsellor_id').trigger("chosen:updated");
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
}

function saveResidentAdvisors(){
    $('span.error').html('');
    $('#submitbutton').attr('disabled','disabled');
    var formData = $('#create-resident-advisors').serializeArray();
    $.ajax({
        url: '/resident-advisors/save-data-ra/',
        type: 'post',
        data: formData,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        async: false,
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            hideLoader();
//            $('.chosen-select').chosen();
//            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
//            $('.sumo-select').SumoSelect({placeholder: 'Select Counsellors', search: true, searchText:'Select Counsellors'});
        },
        success: function (response) {
            if (response.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(typeof response.validation_error != 'undefined'){
                for(var i in response.validation_error){
                   
                    $('span#'+i+'Error').html(response.validation_error[i]);
                    console.log(response.validation_error[i]);
                    $('#submitbutton').removeAttr('disabled');
                }
            }
            else if(typeof response.error != 'undefined'){
                alertPopup(response.error,'error');
                $('#submitbutton').removeAttr('disabled');
            }
            else if(response.success===200){
                // redirect code
                alertPopup(response.message,'success','/resident-advisors/listing');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}


// this function is used when there is mobile dial country code is selected in form applicant
function filterDialCode(fieldId)
{
    if(typeof fieldId=="undefined" || fieldId==null || fieldId=="undefined"){
        fieldId = '';
    }
    var value = $('#filter_dial_code'+fieldId).val();
    value = value.toLowerCase();
    $("#ul_dial_code"+fieldId+" > li").each(function() {
        if ($(this).text().toLowerCase().search(value) > -1) {
//            $(this).text(src_str);
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });
}


function alertPopup(msg, type, location) {

    if (type == 'error') {
        var selector_parent = '#ErrorPopupArea';
        var selector_titleID = '#ErroralertTitle';
        var selector_msg = '#ErrorMsgBody';
        var btn = '#ErrorOkBtn';
        var title_msg = 'Error';
    } else {
        var selector_parent = '#SuccessPopupArea';
        var selector_titleID = '#alertTitle';
        var selector_msg = '#MsgBody';
        var btn = '#OkBtn';
        var title_msg = 'Success';
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
    }
    else {
        $(selector_parent).modal();
    }
}
