$(document).ready(function(){
    getCollegeWisePublisherPermissions();
});

$('#collegeId').on('change',function(){
    getCollegeWisePublisherPermissions();
});

function SubmitPublisherPermissionForm(publisherId,unset){
    if(validatePublisherPermissionForm(publisherId)==false){
        return false;
    }
    var data = $('#publisherPermissionForm'+publisherId).serializeArray();
    data.push({'name':'update','value':'update'});
    if(unset == 'delete'){
       data.push({'name':'unset','value':1}); 
    }
    $.ajax({
        url: '/users/saveCollegePublisherPermissions',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (response) {
            var responseObject = $.parseJSON(response); 
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                var location = window.location.pathname;
                alertPopup('Publisher Permisson Successfully Saved', 'success', location);
            }else{
                alertPopup(responseObject.message,'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
    return false;
    
}



function validatePublisherPermissionForm(publisherId) {
    if (publisherId == 0 || publisherId == '' || publisherId == 'undefined') {
        alertPopup('Some error occurred', 'error');
        return false;
    }
    var publisherForm = $("#publisherPermissionForm"+publisherId);
    if ( $(publisherForm).find('.istrial').is(":checked") == true && (($(publisherForm).find('.startDate').val()=='undefined') || $(publisherForm).find('.startDate').val()=='')) {
    }
    var packageSelected = $(publisherForm).find('input[name=package]:checked').val();
    if(typeof packageSelected == 'undefined' || packageSelected == ''){
        alertPopup('Please Select Package', 'error');
        return false;
    }
    return true;
    
    var data = $('#FilterApplicationForm, #search_roles').serializeArray();
    data.push({'name': 'update', 'value': 'update'});
    $.ajax({
        url: '/users/publisher-user-config',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if (json['redirect']) {
                location = json['redirect'];
            } else if (json['error']) {
                alertPopup(json['error'], 'error');
            } else if (json['status'] == 200) {
                alertPopup('Publisher Permisson Successfully Saved', 'success', '/users/publisher-user-config');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;

}


$('html').on('change','.publisherPermissionRadioButton', function () {
    var publisherId   = $(this).data('publisherid');
    var selected = $("#collapseQueryID"+publisherId).find('input[name=package]:checked').val();
    $("#collapseQueryID"+publisherId).find('.showIsTrial').addClass('hidden');
    if (selected == 'advanced') {
        $("#collapseQueryID"+publisherId).find('.showIsTrial').removeClass('hidden');
        $("#collapseQueryID"+publisherId).find('.advancedClass').removeClass('hidden');
        $("#collapseQueryID"+publisherId).find('.basicClass').addClass('hidden');

    } else {
        $("#collapseQueryID"+publisherId).find('.istrial').prop('checked', false);
        $("#collapseQueryID"+publisherId).find('.basicClass').removeClass('hidden');
        $("#collapseQueryID"+publisherId).find('.advancedClass').addClass('hidden');
        $("#collapseQueryID"+publisherId).find('.isTriaDate').addClass('hidden');
    }
});

$('html').on('change','.istrial', function () {
    if ($(this).is(":checked") == true) {
        $(this).parents('.showIsTrial').find('.isTriaDate').removeClass('hidden');
    } else {
        $(this).parents('.showIsTrial').find('.isTriaDate').addClass('hidden');
    }
});



$('html').on('click','.unmask', function () {
    if ($(this).is(":checked") == true) {
        $(this).val('1');
    } else {
        $(this).val('0');
    }
});

/*
 *  for selected package
 */
function selectAdvacePackage(){
    if($(".collegePermission").length){
        $(".collegePermission").each(function(){
            var selectedPackage = $(this).find('input[name=package]:checked').val();
               if (selectedPackage == 'advanced') {
                $(this).find('.showIsTrial').removeClass('hidden');
                $(this).find('.advancedClass').removeClass('hidden');
                $(this).find('.basicClass').addClass('hidden');
            } else {
                $(this).find('.istrial').prop('checked', false);
                $(this).find('.basicClass').removeClass('hidden');
                $(this).find('.advancedClass').addClass('hidden');
                $(this).find('.isTriaDate').addClass('hidden');
            }
            
        });
    }
}


function getCollegeWisePublisherPermissions(){
    var collegeId = $('#collegeId').val();
    var paramString = $('input[name=paramString]').val();
    if(collegeId == ''){
        return false;
    }
    $('#listloader').show();
    $.ajax({
        url: '/users/college-wise-publisher-permission',
        type: 'post',
        dataType: 'html',
        data: {'collegeId':collegeId,'paramString':paramString},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (response) {
            if (response === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(response == 'Invalid Request'){
                alertPopup(response,'error');
            } else {
                $('#publisher-permissions').empty().append(response);
                initializeDatepickers();
                selectAdvacePackage();
				if($(".unmaskVerified").length>0){
					$('.unmaskVerified').SumoSelect({placeholder: 'Select Verified Unmasking Lead', search: true, searchText:'Search Verified Unmasking Lead', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
				}
				if($(".unmaskUnverified").length>0){
					$('.unmaskUnverified').SumoSelect({placeholder: 'Select Unverified Unmasking Lead', search: true, searchText:'Search Unverified Unmasking Lead', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
				}
            }
        },
        onComplete : function(){
            $('#listloader').hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
    return false;
    
}

function initializeDatepickers(){
    if ($('.startDate').length > 0) {
    $('.startDate').datetimepicker({format: 'DD/MM/YYYY', viewMode: 'days'});
    }
    if ($('.endDate').length > 0) {
        $('.endDate').datetimepicker({format: 'DD/MM/YYYY', viewMode: 'days'});
    }
}

function resetEndTrialDate() {
    $('.endDate').val('');
    event.preventDefault();
}
