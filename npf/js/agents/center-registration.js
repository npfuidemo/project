$(document).ready(function () {
    $(".erroralert").delay(5000).slideUp(300);
    $(".successalert").delay(5000).slideUp(300);
    
    $("#save_center_registration").click(function () {
        saveCenterRegistration(jsVars.urls);
    });
    
    $(function () {
        $('[rel="popover"]').popover({
            container: 'body',
            html: true,
            content: function () {
                var clone = $($(this).data('popover-content')).clone(true).removeClass('hide');
                return clone;
            }
        }).click(function (e) {
            e.preventDefault();
        });
    });
    
    dateRange();
    $('#listloader').hide();
    if($("#h_college_id").length){
        $('#college_id').val($("#h_college_id").val());
        $('#college_id').trigger('change');
        $('#college_id').trigger('chosen:updated');
    }
});

function dateRange(){
    $('.daterangepicker_fee').daterangepicker({
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY',
            separator: ', '
        },
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'left',
        drops: 'down',
    }, function (start, end, label) {
    });

    $('.daterangepicker_fee').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
    });

    $('.daterangepicker_fee').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
}

function alertPopup(msg, type, location) {
    var selector_parent, selector_titleID, selector_msg, title_msg, btn;
    if (type === 'error') {
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

    if (typeof location !== 'undefined') {
        $(btn).show();

        $(selector_parent).modal({keyboard: false}).one('click', btn, function (e) {
            e.preventDefault();
            window.location.href = location;
        });
    } else {
        $(selector_parent).modal();
    }
}

function validateCenterRegistration() {
    $('.error').hide();
    var error = false;
    
    if ($("#college_id").val() === "") {
        $('#college_id_error').html("Field is required.");
        $('#college_id_error').show();
        error = true;
    }
    
    if($("#project").val()===""){
        $('#project_error').html("Field is required.");
        $('#project_error').show();
        error=true;
    } 
     
    if($("#school_name").val()==="" || $("#school_name").val()===null || $("#school_name").val()===undefined){
        $('#school_name_error').html("Field is required.");
        $('#school_name_error').show();
        error=true;
    }
    
    if($("#type").val()==="" || $("#type").val()===null || $("#type").val()===undefined){
        $('#type_error').html("Field is required.");
        $('#type_error').show();
        error=true;
    } 
    
    if($("#type").val()!=="" && $("#type").val() === 'school'){
        if($("#board_of_school").val()==="" || $("#board_of_school").val()===null || $("#board_of_school").val()===undefined){
            $('#board_of_school_error').html("Field is required.");
            $('#board_of_school_error').show();
            error=true;
        } 
    }
    
    if($("#address").val()===""){
        $('#address_error').html("Field is required.");
        $('#address_error').show();
        error=true;
    }
    if($("#mobile").val()===""){
        $('#mobile_error').html("Field is required.");
        $('#mobile_error').show();
        error=true;
    }
    
//    if($("#address").val()!=="" && !($("#address").val().match(/^[0-9a-zA-Z\ ]+$/))){
//        $('#token_name_error').html("Invalid Address. Only Aplhanumeric Characters allowed.");
//        $('#token_name_error').show();
//        error=true;
//    }
    
    var remunerationType = $('input[name="remuneration_type"]:checked').val();
    if(remunerationType==="" || remunerationType===null || remunerationType===undefined){
        $('#remuneration_type_error').html("Field is required.");
        $('#remuneration_type_error').show();
        error=true;
    } 
    
    if(remunerationType){
        if(remunerationType == 'registration_based'){
            
            $('.calcCostMaleRB , .calcCostFemaleRB').each(function() {
                if(!$.isNumeric($(this).val())){
                    var myId = $(this).attr('id');
                    $('#'+myId+'_error').html("Only Numeric value allowed.");
                    $('#'+myId+'_error').show();
                    error=true;
                }
            });
            
            if($("#registrationBasedMaleUniversityMargin").val() == ""){
                $('#registrationBasedMaleUniversityMargin_error').html("Field is required.");
                $('#registrationBasedMaleUniversityMargin_error').show();
                error=true;
            }
            if($("#registrationBasedMaleUniversityMargin").val() !== "" && $("#registrationBasedMaleUniversityMargin").val() < 200){
                $('#registrationBasedMaleUniversityMargin_error').html("Min Value should be 200.");
                $('#registrationBasedMaleUniversityMargin_error').show();
                error=true;
            }
            if($("#registrationBasedFemaleUniversityMargin").val() == ""){
                $('#registrationBasedFemaleUniversityMargin_error').html("Field is required.");
                $('#registrationBasedFemaleUniversityMargin_error').show();
                error=true;
            }
            if($("#registrationBasedFemaleUniversityMargin").val() !== "" && $("#registrationBasedFemaleUniversityMargin").val() < 100){
                $('#registrationBasedFemaleUniversityMargin_error').html("Min Value should be 100.");
                $('#registrationBasedFemaleUniversityMargin_error').show();
                error=true;
            }
            if($("#registrationBasedMaleCenterMarginOnRegistration").val() == "" || $("#registrationBasedMaleCenterMarginOnRegistration").val() < 0){
                $('#registrationBasedMaleCenterMarginOnRegistration_error').html("Field is required.");
                $('#registrationBasedMaleCenterMarginOnRegistration_error').show();
                error=true;
            }
            if($("#registrationBasedFemaleCenterMarginOnRegistration").val() == "" || $("#registrationBasedFemaleCenterMarginOnRegistration").val() < 0){
                $('#registrationBasedFemaleCenterMarginOnRegistration_error').html("Field is required.");
                $('#registrationBasedFemaleCenterMarginOnRegistration_error').show();
                error=true;
            }
            if($("#registrationBasedMaleCenterMargin2OnRegistration").val() == "" || $("#registrationBasedMaleCenterMargin2OnRegistration").val() < 0){
                $('#registrationBasedMaleCenterMargin2OnRegistration_error').html("Field is required.");
                $('#registrationBasedMaleCenterMargin2OnRegistration_error').show();
                error=true;
            }
            if($("#registrationBasedFemaleCenterMargin2OnRegistration").val() == "" || $("#registrationBasedFemaleCenterMargin2OnRegistration").val() < 0){
                $('#registrationBasedFemaleCenterMargin2OnRegistration_error').html("Field is required.");
                $('#registrationBasedFemaleCenterMargin2OnRegistration_error').show();
                error=true;
            }
            
            //Centre's Margin on Registration (B)
            var registrationBasedMaleUniversityMarginValue  = $("#registrationBasedMaleUniversityMargin").val(); //C value
            var registrationBasedMaleCenterMarginOnRegistrationValueCalc = 1000 - registrationBasedMaleUniversityMarginValue;
            if($("#registrationBasedMaleCenterMarginOnRegistration").val() != "" && $("#registrationBasedMaleCenterMarginOnRegistration").val() > registrationBasedMaleCenterMarginOnRegistrationValueCalc){
                $('#registrationBasedMaleCenterMarginOnRegistration_error').html("Upper limit is (A)-(C).");
                $('#registrationBasedMaleCenterMarginOnRegistration_error').show();
                error=true;
            }
            
            var registrationBasedFemaleUniversityMarginValue  = $("#registrationBasedFemaleUniversityMargin").val(); //C value
            var registrationBasedFemaleCenterMarginOnRegistrationValueCalc = 500 - registrationBasedFemaleUniversityMarginValue;
            if($("#registrationBasedFemaleCenterMarginOnRegistration").val() != "" && $("#registrationBasedFemaleCenterMarginOnRegistration").val() > registrationBasedFemaleCenterMarginOnRegistrationValueCalc){
                $('#registrationBasedFemaleCenterMarginOnRegistration_error').html("Upper limit is (A)-(C).");
                $('#registrationBasedFemaleCenterMarginOnRegistration_error').show();
                error=true;
            }
            
            //Centre's Margin (II) on Registration (B1 optional) 
            var registrationBasedMaleCenterMarginOnRegistrationValue  = $("#registrationBasedMaleCenterMarginOnRegistration").val(); //B value
            var registrationBasedMaleCenterMargin2OnRegistrationValueCalc = 1000 - registrationBasedMaleUniversityMarginValue - registrationBasedMaleCenterMarginOnRegistrationValue;
            if($("#registrationBasedMaleCenterMargin2OnRegistration").val() != "" && $("#registrationBasedMaleCenterMargin2OnRegistration").val() > registrationBasedMaleCenterMargin2OnRegistrationValueCalc){
                $('#registrationBasedMaleCenterMargin2OnRegistration_error').html("Upper limit is (A)-(C)-(B).");
                $('#registrationBasedMaleCenterMargin2OnRegistration_error').show();
                error=true;
            }
            
            var registrationBasedFemaleCenterMarginOnRegistrationValue  = $("#registrationBasedFemaleCenterMarginOnRegistration").val();
            var registrationBasedFemaleCenterMargin2OnRegistrationValueCalc = 500 - registrationBasedFemaleUniversityMarginValue - registrationBasedFemaleCenterMarginOnRegistrationValue;
            if($("#registrationBasedFemaleCenterMargin2OnRegistration").val() != "" && $("#registrationBasedFemaleCenterMargin2OnRegistration").val() > registrationBasedFemaleCenterMargin2OnRegistrationValueCalc){
                $('#registrationBasedFemaleCenterMargin2OnRegistration_error').html("Upper limit is (A)-(C)-(B).");
                $('#registrationBasedFemaleCenterMargin2OnRegistration_error').show();
                error=true;
            }
            
        }else if(remunerationType === 'registration_appearance_based'){
            
            $('.calcCostMaleRBA , .calcCostFemaleRBA').each(function() {
                if(!$.isNumeric($(this).val())){
                    var myId = $(this).attr('id');
                    $('#'+myId+'_error').html("Only Numeric value allowed.");
                    $('#'+myId+'_error').show();
                    error=true;
                }
            });
                
            if($("#registrationAppearanceBasedMaleCenterMarginOnRegistration").val() == "" || $("#registrationAppearanceBasedMaleCenterMarginOnRegistration").val() < 0){
                $('#registrationAppearanceBasedMaleCenterMarginOnRegistration_error').html("Field is required.");
                $('#registrationAppearanceBasedMaleCenterMarginOnRegistration_error').show();
                error=true;
            }
            if($("#registrationAppearanceBasedFemaleCenterMarginOnRegistration").val() == "" || $("#registrationAppearanceBasedFemaleCenterMarginOnRegistration").val() < 0){
                $('#registrationAppearanceBasedFemaleCenterMarginOnRegistration_error').html("Field is required.");
                $('#registrationAppearanceBasedFemaleCenterMarginOnRegistration_error').show();
                error=true;
            }
            
            if($("#registrationAppearanceBasedMaleCenterMarginOnRegistration").val() != "" && $("#registrationAppearanceBasedMaleCenterMarginOnRegistration").val() > 800){
                $('#registrationAppearanceBasedMaleCenterMarginOnRegistration_error').html("Upper limit is (A)-(C).");
                $('#registrationAppearanceBasedMaleCenterMarginOnRegistration_error').show();
                error=true;
            }
            
            if($("#registrationAppearanceBasedFemaleCenterMarginOnRegistration").val() != "" && $("#registrationAppearanceBasedFemaleCenterMarginOnRegistration").val() > 400){
                $('#registrationAppearanceBasedFemaleCenterMarginOnRegistration_error').html("Upper limit is (A)-(C).");
                $('#registrationAppearanceBasedFemaleCenterMarginOnRegistration_error').show();
                error=true;
            }
            
        }
    }
    
    if($("#school_email_id").val()===""){
        $('#school_email_id_error').html("Field is required.");
        $('#school_email_id_error').show();
        error=true;
    } 
    
    if($("#school_email_id").val()!=="" && !($("#school_email_id").val().match(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/))){
        $('#school_email_id_error').html("Invalid Email Id.");
        $('#school_email_id_error').show();
        error=true;
    }
    
    var pinCode = $("#pinCode").val();
    if(pinCode != "" && (!$.isNumeric(pinCode) || pinCode.length !== 6)){
        $('#pinCode_error').html("Invalid Pincode.");
        $('#pinCode_error').show();
        error=true;
    }
    
    var principalMobile = $("#principal_mobile").val();
    if(principalMobile != "" && (!$.isNumeric(principalMobile) || principalMobile.length < 10 || principalMobile.length > 10)){
        $('#principal_mobile_error').html("Invalid Mobile No.");
        $('#principal_mobile_error').show();
        error=true;
    }
    
    var principalLandLine = $("#principal_landline").val();
    if(principalLandLine != "" && (!$.isNumeric(principalLandLine) || principalLandLine.length < 3 || principalLandLine.length > 16)){
        $('#principal_landline_error').html("Invalid LandLine No.");
        $('#principal_landline_error').show();
        error=true;
    }
    
    var mobile = $("#mobile").val();
    if(mobile != "" && (!$.isNumeric(mobile) || mobile.length < 10 || mobile.length > 10)){
        $('#mobile_error').html("Invalid Mobile No.");
        $('#mobile_error').show();
        error=true;
    }
    

    if (error === false) {
        return true;
    } else {
        $('html, body').animate({
            scrollTop: $("#error_anchor").offset().top
        }, 1000);
        return false;
    }
}

function saveCenterRegistration(urls) {

    if (validateCenterRegistration() === false) {
        return;
    }
    //make buttun disable
    var data = [];
    data = $('#center_registration').serializeArray();
    data.push({name: 'urlParams', value: urls});
    
    $.ajax({
        url: jsVars.saveCenterRegistrationLink,
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $('#listloader').show();
            window.scrollTo(0, 0);
        },
        complete: function () {
            $('#listloader').hide();
            $(':input[type="button"]').removeAttr("disabled");
        },
        async: true,
        success: function (response) {
            var responseObject = response;
            if (responseObject.message === 'session') {
                window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if (responseObject.status === 1) {
                //$('#alert_msg').html("<i class='fa fa-check'></i>&nbsp; Center Registration successfully saved.");
                window.location = jsVars.FULL_URL+'/agents/centre-register';
            } else {
                alertPopup(responseObject.message, 'error');
                return;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //setTimeout("location.reload();", 5000);
        }
    });
}

function showLoader() {
    $("#listloader").show();
}
function hideLoader() {
    $("#listloader").hide();
}

$(document).on('change', '#type', function() {
    if(this.value === 'school'){
        $(".board_school_div").show();
    }else{
        $(".board_school_div").hide();
    }
});

$(document).on('change', '.remuneration_type', function() {
    //$(".remuneration_type_div").hide();
    $(".registration_based_div").hide();
    $(".registration_appearance_based_div").hide();
    if(this.value === 'registration_based'){
        //$(".remuneration_type_div").show();
        $(".registration_based_div").show();
        
        $(".calcCostMaleRB").trigger("change");
        $(".calcCostFemaleRB").trigger("change");
    }
    else if(this.value === 'registration_appearance_based'){
        //$(".remuneration_type_div").show();
        $(".registration_appearance_based_div").show();
        
        $(".calcCostMaleRBA").trigger("change");
        $(".calcCostFemaleRBA").trigger("change");
    }
    
    $(".calcCostMaleRB").trigger("change");
});

$(document).on('change', '.calcCostMaleRB', function() {
    var calcCostMale = 0;
    $('.calcCostMaleRB').each(function() {
        calcCostMale += Number($(this).val());
    });
    $("#registrationBasedMaleCostToApplicant").val(calcCostMale);
});

$(document).on('change', '.calcCostFemaleRB', function() {
    var calcCostFemale = 0;
    $('.calcCostFemaleRB').each(function() {
        calcCostFemale += Number($(this).val());
    });
    $("#registrationBasedFemaleCostToApplicant").val(calcCostFemale);
});

$(document).on('change', '.calcCostMaleRBA', function() {
    var calcCostMale = 0;
    $('.calcCostMaleRBA').each(function() {
        calcCostMale += Number($(this).val());
    });
    $("#registrationAppearanceBasedMaleCostToApplicant").val(calcCostMale);
});

$(document).on('change', '.calcCostFemaleRBA', function() {
    var calcCostFemale = 0;
    $('.calcCostFemaleRBA').each(function() {
        calcCostFemale += Number($(this).val());
    });
    $("#registrationAppearanceBasedFemaleCostToApplicant").val(calcCostFemale);
});

$('.removesearch').on("click",function(){
   $('#search').val("");
   $('#searchBy').val("").trigger("chosen:updated");
   LoadMoreCenter('reset');
});
//$(document).on('change', '#registrationAppearanceBasedMaleUniversityMargin', function() {
//    var universityMarginCost = $("#registrationAppearanceBasedMaleUniversityMargin").val();
//    var centerMarginAppearanceValue = 0;
//    if(universityMarginCost == 200){
//        centerMarginAppearanceValue = 300;
//    }
//    else if(universityMarginCost == 100){
//        centerMarginAppearanceValue = 150;
//    }
//    $("#registrationAppearanceBasedMaleCenterMarginOnAppearance").val(centerMarginAppearanceValue);
//});

function getVisitedSchoolList(collegeId,selectedVisit=null,edit=''){
    if(typeof collegeId === 'undefined' || collegeId === null || collegeId === ''){
        return false;
    }
    if(edit!=''){
        return false;
    }    
    $.ajax({
        url: jsVars.FULL_URL+'/agents/ajax-visited-list',
        data: {collegeId: collegeId},
        dataType: "json",
        type: "POST",
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            if(typeof json['error'] !=='undefined' && json['error'] === 'session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(json['error']) {
                alertPopup(json['error'],'error');
            }
            else if(json['status'] === 200) {
                var listHtml = '<option value="">Select School/Centre</option>';
                
                if(json['allVisitedSchool']) {
                    for(var listId in json['allVisitedSchool']) {
                        listHtml += '<option value="'+ listId +'">'+ json['allVisitedSchool'][listId] +'</option>';
                    }
                }
                $('#school_name').html(listHtml);
                $("#school_name").val(selectedVisit).trigger("chosen:updated");
                
                var teamMembersHtml = '<option value="">Select Team Members</option>';
                if(json['teamMembers']) {
                    for(var listId in json['teamMembers']) {
                        teamMembersHtml += '<option value="'+ listId +'">'+ json['teamMembers'][listId] +'</option>';
                    }
                }
                $('#team_members').html(teamMembersHtml);
                $("#team_members").val(selectedVisit).trigger("chosen:updated");
            }
        },
        error: function (response) {
            alertPopup(response.responseText);
        },
        failure: function (response) {
            alertPopup(response.responseText);
        }
    });
   
}


function loadCenterAutoField(centerId){
    var collegeId = $("#college_id").val();
    $("#center_name_error").html('');
    $("#center_name_error").hide();
    if(typeof collegeId === 'undefined' || collegeId === null || collegeId === ''){
        return false;
    }
    if(typeof centerId === 'undefined' || centerId === null || centerId === ''){
        return false;
    }
    
    $.ajax({
        url: jsVars.FULL_URL+'/agents/load-center-auto-field',
        data: {collegeId: collegeId, centerId: centerId},
        dataType: "json",
        type: "POST",
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            if(typeof json['error'] !=='undefined' && json['error'] === 'session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(json['error']) {
//                if(json['error'] === 'centre_already_registerd_error'){
//                    $("#center_name_error").html('Centre is already registered');
//                    $("#center_name_error").show();
//                }else{
                    alertPopup(json['error'],'error');
                //}
            }
            else if(json['status'] === 200) {
                if(json['msg'] === 'centre_already_registerd_error'){
                    $("#center_name_error").html('Centre is already registered');
                    $("#center_name_error").show();
                }
                if(json['stateList']) {
                    var stateHtml = '';
                    for(var listId in json['stateList']) {
                        stateHtml += '<option value="'+ listId +'">'+ json['stateList'][listId] +'</option>';
                    }
                    $('#state_id').html(stateHtml);
                    $("#state_id").val(json['schoolDetails']['state']).trigger("chosen:updated");
                }
                if(json['districtList']) {
                    var districtHtml = '';
                    for(var listId in json['districtList']) {
                        districtHtml += '<option value="'+ listId +'">'+ json['districtList'][listId] +'</option>';
                    }
                    $('#district_id').html(districtHtml);
                    $("#district_id").val(json['schoolDetails']['district']).trigger("chosen:updated");
                }
                if(json['cityList']) {
                    var cityHtml = '';
                    for(var listId in json['cityList']) {
                        cityHtml += '<option value="'+ listId +'">'+ json['cityList'][listId] +'</option>';
                    }
                    $('#city_id').html(cityHtml);
                    $("#city_id").val(json['schoolDetails']['city']).trigger("chosen:updated");
                }
                if(json['schoolDetails']['type']) {
                    var placeType = jsVars.placeType;
                    var typeHtml = '<option value="'+ json['schoolDetails']['type'] +'">'+ placeType[json['schoolDetails']['type']] +'</option>';
                    $('#type').html(typeHtml);
                    $("#type").val(json['schoolDetails']['type']).trigger("chosen:updated");
                    //$("#type").attr("disabled", 'disabled');
                }
                if(json['teamMembers']) {
                    var teamMembersHtml = '<option value="">Select Team Members</option>';
                    for(var listId in json['teamMembers']) {
                        teamMembersHtml += '<option value="'+ listId +'">'+ json['teamMembers'][listId] +'</option>';
                    }
                    $('#team_members').html(teamMembersHtml);
                    $("#team_members").val(json['schoolDetails']['city']).trigger("chosen:updated");
                }
                if(json['schoolDetails']) {
                    if(json['schoolDetails']['type'] && json['schoolDetails']['type'] == 'school'){
                        $("#board_of_school").val(json['schoolDetails']['school_board']);
                        $(".board_school_div").show();
                    }else{
                        $("#board_of_school").val('');
                        $(".board_school_div").hide();
                    }
//                    if(json['schoolDetails']['state']){
//                        GetChildByMachineKey(json['schoolDetails']['state'],"district_id","District");
//                    }
//                    if(json['schoolDetails']['district']){
//                        GetChildByMachineKey(json['schoolDetails']['district'],"city_id","City");
//                    }
                    $("#address").val(json['schoolDetails']['address']);
                    $("#state_id").val(json['schoolDetails']['state']);
                    $("#city_id").val(json['schoolDetails']['city']);
                    $("#district_id").val(json['schoolDetails']['district']);
                    $("#school_email_id").val(json['schoolDetails']['school_representative_email_id']);
                    $("#pinCode").val(json['schoolDetails']['pin_code']);
                    $("#website").val(json['schoolDetails']['web_site']);
                    $("#principal").val(json['schoolDetails']['principal_name']);
                    $("#principal_mobile").val(json['schoolDetails']['principal_mobile']);
                    $("#principal_landline").val(json['schoolDetails']['principal_landline']);
                    $("#school_representative").val(json['schoolDetails']['school_representative_name']);
                    $("#designation").val(json['schoolDetails']['school_representative_designation']);
                    $("#mobile").val(json['schoolDetails']['school_representative_mobile']);
                    
                    $('.chosen-select').trigger('chosen:updated');
                }
            }
        },
        error: function (response) {
            alertPopup(response.responseText);
        },
        failure: function (response) {
            alertPopup(response.responseText);
        }
    });
}

function LoadMoreCenter(type) {
    $(".error").html('');
    if($('#search').val()!='' && $('#searchBy').val()==''){
        $('#error').text('Please select search criteria.');
        return false;
    }
    if (type == 'reset') {
        CenterRequestPage  = 1;
        $('#center_register_container').html("");
        $("#center_register_container").parent().hide();
        if($('#searchBy').val()=='center_email' && $('#search').val()!=''){
            $('.filterCollaspData li label #column_create_keys_12').prop('checked',true);
        }
    }
    
    $('#load_more_button').hide();
    if($("#college_id").val()===''){
        $("#load_msg_div").show();
        
        $("#college_error").html('Please select college');
        $("#college_error").show();
        hideLoader();
        return;
    }
        
    var data = $('#FilterApplicationForms').serializeArray();
    data.push({name: "page", value: CenterRequestPage});
    $.ajax({
        url: jsVars.FULL_URL+'/agents/centre-register-list',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function () {
           $('#parent').css('min-height', '50px');
           showLoader();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (response) {
            CenterRequestPage+=1;
	    var responseObject = $.parseJSON(response); 
	    if (responseObject.message === 'session'){
		window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
	    }else if(responseObject.message ==="no_record_found"){    
                if(CenterRequestPage===2){
                    $('#load_msg').html('No Centre Found');
                    $('#load_msg_div').show();
                    $('#center_register_container').parent().addClass('hide');
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Centre");
                    $('#load_more_button').hide();
                    if ($(window).width() < 992) {
                            //filterClose();
                    }
                }else {
                    $('#load_msg').html('');
                    $('#load_msg_div').hide();
                    $('#load_more_button').html("<i class='fa fa-database' aria-hidden='true'></i>&nbsp;No More Centre");
                    $('#load_more_button').show();
                }
                if (type !== '' && CenterRequestPage===2) {
                    $('#if_record_exists').hide();
                    $('#single_lead_add').hide();
                }
	    }else if(responseObject.status===1){
                if (type === 'reset') {
                    $('#center_register_container').html("");
                }
                
                if (responseObject.message !== '') {
                    $('#load_msg_div').show();
                    $('#if_record_exists').hide();
                    $('#load_msg').text(responseObject.message);
                    //alertPopup(responseObject.message, 'error');
                    return;
                }
                data = responseObject.data.html.replace("<head/>", '');
                $('#center_register_container').parent().removeClass('hide');
                $('#center_register_container').parent().show();
                $('#center_register_container').append(data);
                $('#load_msg_div').hide();
		        $('#parent').show();
                $('.itemsCount').show();
		        $('body').css('padding-right', '0px');
                if(typeof responseObject.data.totalRecords!=="undefined"){
                    $("#totalRecords").html('Total <strong>'+responseObject.data.totalRecords+'</strong>&nbsp;Records');
                }
                 
		var ttl = $("#current_record").val();
                if(parseInt(ttl) < 10){
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Centre Register");
                    $('#load_more_button').hide();
                }else{
                    $('#load_more_button').removeAttr("disabled");
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Centre Register");
		    $('#load_more_button').show();
                }
                if (type !== '') {
                    $('#if_record_exists').fadeIn();
                }
	        }else{
		        $('#parent').hide();
                $('#load_msg_div').show();
                $('#load_msg').html(responseObject.message);
                $('#center_register_container').html("");
                $('#load_more_button').hide();
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Centre");
                if (type !== '') {
                       $('#if_record_exists').hide();
                }
	    }
            $('.offCanvasModal').modal('hide');
            table_fix_rowcol();
            dropdownMenuPlacement();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //window.location.reload(true);
        },
        complete: function () {
            hideLoader();
        }
    });

    return false;
}

function getVisitActivityByCenterId(collegeId,centerId) {
    var returnHTML = '';
    $.ajax({
        url: jsVars.FULL_URL+'/agents/get-activity-by-visit-ids',
        data: {college_id: collegeId,center_id: centerId},
        dataType: "html",
        async: false,
        cache: false,
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('body div.loader-block').show();
            $("#ConfirmPopupArea").modal('hide');
        },
        complete: function () {
            $('body div.loader-block').hide();
        },
        success: function (html) {
            if (html == 'session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if (html === 'invalid_request') {
                returnHTML = 'We got some error, please try again later.';
                alertPopup(returnHTML, 'error');
            }
            else {
                $('#activitydata').html(html);
                $('#activitypopup').modal('show');
            }
        },
        error: function (response) {
            alertPopup(response.responseText);
        },
        failure: function (response) {
            alertPopup(response.responseText);
        }
    });
    return returnHTML;
}

function validate(evt) {
  var theEvent = evt || window.event;

  // Handle paste
  if (theEvent.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
  } else {
  // Handle key press
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
  }
  var regex = /[0-9]|\./;
  if( !regex.test(key) ) {
    theEvent.returnValue = false;
    if(theEvent.preventDefault) theEvent.preventDefault();
  }
}
$(document).ready(function () {
    $('.filterCollasp').unbind('click');
    $('.filterCollasp').on('click', function(e) {
        if($(this).parent().hasClass('active')) {
            $('.filterCollasp').parent().removeClass('active');
        } else {
            $('.filterCollasp').parent().removeClass('active');
            $(this).parent().addClass('active');
        }
        e.preventDefault();
    }); 
});

$('.columnApplicationCheckAll').on('click', function(e){
        $(this).toggleClass('checked');
        if($(this).hasClass('checked')) {
           
           var disabledfieldonSelectAll=[
               'rfl|submitted_on||Re-submit Application Date',
               'psal|title||Re-submit Application Name',
               'rfl|status||Re-submit Application Status'
           ];
            
            $('#column_li_list input:checkbox:not(:disabled)').prop('checked', true);
            
            for(field in disabledfieldonSelectAll){
                $('#column_li_list input:checkbox[value="'+disabledfieldonSelectAll[field]+'"]').prop('checked', false);
            }
            
        } else {
            $('#column_li_list input:checkbox:not(:disabled)').prop('checked', false);
        }
    });
jQuery(function(){
    $('.filter_collapse').dropdown('toggle');
});
function filterApplication(element,listid) {
    //alert(listid);
    var value = $(element).val();
    value = value.toLowerCase();
    $("ul#"+listid+"  li ul li").each(function() {
        if ($(this).text().toLowerCase().search(value) > -1) {
//            $(this).text(src_str);
            $(this).show();
            $("ul#"+listid+"  li").addClass('active');
        }
        else {
            $(this).hide();
        }
    });
}
function Getuserlist(key) {
  if(key==''){
    return false;
  }   
  getStateList(key);
  
  $.ajax({
        url: jsVars.FULL_URL+'/agents/getUserListWithUserIds',
        type: 'post',
        dataType: 'json',
        data: {
            "college_id": key,
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (response) {
            var responseObject = (response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data.childList === "object") {
                        var value = '';//<option selected="selected" value="">Select Created By</option>';
                        var team_member = '';
                        $.each(responseObject.data.childList, function (index, item) {
                            if($.inArray(index,response.created_by)){
                                value += '<option value="' + index + '">' + item + '</option>';                                
                            }
                            if($.inArray(index,response.team_members)){
                                team_member += '<option value="' + index + '">' + item + '</option>';                          
                            }
                        });
                        $('.created_sumo_select').html(value);
                        $('.created_sumo_select').SumoSelect().sumo.reload();
                        team_member = team_member+'<option value="n/a">N/A</option>';
                        $('.team_sumo_select').html(team_member);
                        $('.team_sumo_select').SumoSelect().sumo.reload();                        
                    }
                }
                //('.team_sumo_select').SumoSelect().sumo.reload();
                //$('#team_member').trigger('chosen:updated');
               
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function hitCentreRegPopupBind() {
    $('.modalButton').on('click', function (e) {
        $('#confirmDownloadYes').off('click');
        $('#confirmDownloadTitle').text('Download Confirmation');
        $('#ConfirmDownloadPopupArea .npf-close').hide(); 
        $('#download_type').show();
        $('#csv').prop( "checked", true );
        $('.confirmDownloadModalContent').text('Do you want to download the Registered Centres ?');//download the leads
        //var confirmation = $(this).text();
        var $form = $("#FilterApplicationForms");
        if($('#downloadConfig').length && $('#downloadConfig').val()==1){
            $('#confirmDownloadYes').on('click',function(e){
                e.preventDefault();
                $('#ConfirmDownloadPopupArea').modal('hide');
                var type = 'regCentre'+$("input[name='export_type']:checked").val();
                //alert(type);
                $("#export_regCentre").val(type);
                var requestType=$('#requestType').val();
                //alert(requestType);
                var data = $('#FilterApplicationForms').serializeArray();
                $.ajax({ 
                    url: jsVars.FULL_URL+'/agents/registered-centre-downloads',
                    type: 'post',
                    data:data,
                    dataType:'json', 
                    headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                    success:function (response){
                        if(response.error != '') {
                            if(response.error == 'session_logout') {
                                window.location.href = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                            } else if(response.error == 'invalid_request') {
                                alertPopup('Something went wrong','error');
                            } else {
                                alertPopup(response.error,'error');
                            }
                        } else {
                            if(requestType!='undefined'){
                                $('#muliUtilityPopup').find('#alertTitle').html('Download Success');
                                //$('#dynamicMessage').html('Note: Downloaded data will be sorted by (Descending) Visits added date.');
                                $('#muliUtilityPopup').modal('show');
                                $('#downloadListing').show();
                                $('#downloadListingExcel').hide();
                                $('#muliUtilityPopup .close').addClass('npf-close').css('margin-top', '2px');
                            }
                        }
                    }
                });
            }); 
        }
    });
}

// not use
//function GetChildByMachineKey(key) {
//    if(key===''){
//        return false;
//    } 
//    $.ajax({
//        url: jsVars.FULL_URL+'/common/getChildListByTaxonomyId',
//        type: 'post',
//        dataType: 'json',
//        data: {
//            "parentId": key
//        },
//        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
//        success: function (response) {
//          if (response.status == 1) {
//                if (typeof response.data === "object") {
//                    if (typeof response.data.childList === "object") {
//                        var value = '<option selected="selected" value="">Select District</option>';
//                        $.each(response.data.childList, function (index, item) {
//                            value += '<option value="' + index + '">' + item + '</option>';
//                        });
//                        $('#district_id').html(value);
//                    }
//                }
//                $('#district_id').trigger('chosen:updated');
//                
//            } else {
//                $('.chosen-select').trigger('chosen:updated');
//            }
//        },
//        error: function (xhr, ajaxOptions, thrownError) {
//            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
//        }
//    });
//}


function getStateList(collegeId) {   
    if(collegeId===''){
        return false;
    } 
    $.ajax({
        url: jsVars.FULL_URL+'/agents/getStatlistFromTexonomy',
        type: 'post',
        dataType: 'json',
        data: {"collegeId":collegeId},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (response) {
            
            if(response.status===0){
                $('#college_error').text(response.message);
                //if(response.redirect!)
            }
            else if (response.status == 200) {
                if (typeof response.stateList === "object") {
                    var value = '<option selected="selected" value="">Select State</option>';
                    $.each(response.stateList, function (index, item) {
                        value += '<option value="' + index + '">' + item + '</option>';
                    });
                    $('#state_id').html(value);
                }
                $('#state_id').trigger('chosen:updated');
                
            } else {
                $('.chosen-select').trigger('chosen:updated');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
function getApplicantDetails(assignTo=0,type=''){
    if(type=='reset'){
        page = 0;
        assignTo = assignTo;
        $('#assign_to').val(assignTo);
        $('#applicantDetails').html('');
        $('#LoadMoreApplicant').hide();
        
    }else{
        assignTo = $('#assign_to').val();
    }
    
    if(assignTo <= 0){
        //$('.draw-cross').click();
        $('.notFound').removeClass('hide');
        $('.applicantTable').hide();
        return false;
    }
    $('.notFound').addClass('hide');
    $('.applicantTable').show();
    
    var collegeId = $('#college_id').val();
    if(collegeId==''){
        return flalse;
    }
    $.ajax({
        url: jsVars.FULL_URL+'/agents/applicantDetails',
        type: 'post',
        dataType: 'html',
        data: {"assign_to":assignTo,"collegeId":collegeId,'page':page},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (response) {
            if(response.status === 0){
                if(response.redirect !== "undefined"){
                    window.location = response.redirect;
                }
            }
            else{
                if(response.trim()==''){
                    $('#LoadMoreApplicant').hide();
                }
                if(type=='reset' && response.trim()==''){
                    $('#applicantDetails').hide();
                    $('.notFound').removeClass('hide');
                    $('.applicantTable').hide();
                }
                page = page + 1;
                $('#applicantDetails').append(response);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    }); 
}

function viewCount(user_id,mongoId=''){
    
    var collegeId = $('#college_id').val();
    if(collegeId=='' || user_id <=0){
        $('.viewCountText_'+mongoId).hide();
        $('.showCount_'+mongoId).show();
        return false;
    }
    $('#viewCountText_'+user_id).hide();
    $('#showCount_'+user_id).show();
    $.ajax({
        url: jsVars.FULL_URL+'/agents/applicantAbsentCount',
        type: 'post',
        dataType: 'json',
        data: {"assign_to":user_id,"collegeId":collegeId},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function(response) {
            if(response.status==0){
                if(response.redirect!='' && response.redirect != undefined){
                    window.location = response.redirect;
                }
                return false;
            }
            else{
               if(typeof response.viewCount!=='undefined'){
                    if(response.viewCount > 0)
                        countlink = '<a data-toggle="modal" data-target="#applicant_details" onclick="return getApplicantDetails('+user_id+',\'reset\');">'+response.viewCount+'</a>';
                    else
                        countlink = 0;    
                  $('#showCount_'+user_id).html(countlink);
               }
            }
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return ;
}


function enableBackendUser(collegeId,centerId,registerId){

    $("#confirmYes").removeAttr('onclick');
    $('#confirmTitle').html("Confirmation Required");
    $("#confirmYes").html('Confirm');
    $("#confirmYes").siblings('button').html('Cancel');
    $('#ConfirmMsgBody').html('Are you sure you want to Enable User?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
       
        agentEnableUser(collegeId,centerId,registerId);


    $('#ConfirmPopupArea').modal('hide');
    });

}

function getCouponCodeLink(collegeId,centerId,registerId,short_url){

    var data = {'college_id':collegeId,'center_id':centerId,'register_id':registerId,'short_url':short_url};
    $.ajax({
        url: jsVars.FULL_URL+'/agents/get-coupon-code-link',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $('#listloader').show();
        },
        complete: function () {
            $('#listloader').hide();
        },
        async: true,
        success: function (responseObject) {
            
            if (typeof responseObject.redirect !='undefined' && responseObject.redirect !== '') {
                window.location = responseObject.redirect;
            }
            else if (responseObject.status === 200) {
                var url = responseObject.url
                if(url){
                    $("#embed #EmbededHtmlLink").val(url);
                    $(".popupscroll > h4:first-child ").html('')
                    //$("#full_url_campaign1").html(url);
                    $("#college_id_campaign1").closest('.custom-bg-popup').html('');
                    $('#embed .popupscroll p').html('')
                    $("#embed #EmbededHtmlCode").html(url);
                    $("#EmbededHtmlCode").prev('p').html("");
                    $('#embed').modal({backdrop: 'static', keyboard: false})
                   // $("#EmbededHtmlCode").before('<p>Embed the HTML code snippet into your website to fully streamline the enquiry. </p>');
                    $("#EmbededHtmlCode").parent().parent().hide()
                    $(".formhtmlurl").hide(); 
                }
            }
            else {
                alertPopup(responseObject.error, 'error');
                return;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //setTimeout("location.reload();", 5000);
        }
    });

}
function agentEnableUser(collegeId,centerId,registerId){
    var data = {'college_id':collegeId,'center_id':centerId,'register_id':registerId};
    $.ajax({
        url: jsVars.FULL_URL+'/agents/enable-user',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $('#listloader').show();
        },
        complete: function () {
            $('#listloader').hide();
        },
        async: true,
        success: function (responseObject) {

            if (typeof responseObject.redirect !='undefined' && responseObject.redirect !== '') {
                window.location = responseObject.redirect;
            }
            else if (responseObject.status === 200) {
                alertPopup(responseObject.message,'success',jsVars.FULL_URL+'/agents/centre-register');
                //$('#alert_msg').html("<i class='fa fa-check'></i>&nbsp; Center Registration successfully saved.");
                // window.location = jsVars.FULL_URL+'/agents/centre-register';
            }
            else {
                alertPopup(responseObject.error, 'error');
                return;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //setTimeout("location.reload();", 5000);
        }
    });
}
function viewApplicationCount(user_id,mongoId=''){
    var collegeId = $('#college_id').val();
    if(collegeId=='' || user_id <=0){
        $('.applicViewCountText_'+mongoId).hide();
        $('.applicShowCount_'+mongoId).show().html(0);
        return false;
    }
    $('#applicViewCountText_'+user_id).hide();
    $('#applicShowCount_'+user_id).show();
    $.ajax({
        url: jsVars.FULL_URL+'/agents/getLpuNestApplicationCount',
        type: 'post',
        dataType: 'json',
        data: {"assign_to":user_id,"collegeId":collegeId},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function(response) {
            if(response.status==0){
                if(response.redirect!='' && response.redirect != undefined){
                    window.location = response.redirect;
                }
                return false;
            }
            else{
               if(typeof response.viewCount!=='undefined'){
                    if(response.viewCount > 0)
                        countlink = '<span class="viewCount">'+response.viewCount+'</span>';
                    else{
                        countlink = 0;    
                    }
                  $('#applicShowCount_'+user_id).html(countlink);
               }
            }
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            ///console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return ;
}

$(document).ready(function() {
   $('.columnCenterRegistationReportsAll').on('click', function(){
        if (this.checked) {
            $("#reports_subcolumn .reports_subcolumn11").prop("checked", true);
        } else {
            $("#reports_subcolumn .reports_subcolumn11").prop("checked", false);
        }	
   });
 
   $(".reports_subcolumn11").on('click', function(){
      var numberOfCheckboxes = $(".reports_subcolumn11").length;
      var numberOfCheckboxesChecked = $('.reports_subcolumn11:checked').length;
      if(numberOfCheckboxes == numberOfCheckboxesChecked) {
         $(".columnCenterRegistationReportsAll").prop("checked", true);
      } else {
         $(".columnCenterRegistationReportsAll").prop("checked", false);
      }
   });
   $('.remunerantion_registration, .remuneration_appearance').focusout(function(){
       getRemunerationValidation();            
    });
    $('#registration_based, #registration_appearance_based').click(function(){
        getRemunerationValidation();
    });
});

function getRemunerationValidation(){
    var renumeration = $('input[name="remuneration_type"]:checked').val();
    var level_2_approval = $('#level_2_approval').val();
    var level_3_approval = $('#level_3_approval').val();
    //console.log(level_3_approval);
    var registrationBasedMaleUniversityMargin = $('#registrationBasedMaleUniversityMargin').val();
    var registrationBasedFemaleUniversityMargin = $('#registrationBasedFemaleUniversityMargin').val();
    var registrationAppearanceBasedMaleUniversityMargin = $('#registrationAppearanceBasedMaleUniversityMargin').val();
    var registrationAppearanceBasedFemaleUniversityMargin=$('#registrationAppearanceBasedFemaleUniversityMargin').val();
    if(level_2_approval !== ''){
        level_2_approval = $.parseJSON(level_2_approval);
    }
    if(level_3_approval !== ''){
        level_3_approval = $.parseJSON(level_3_approval);
    }

    var male_university_margin = '';
    var female_university_margin = '';
    if(renumeration === 'registration_based'){
        male_university_margin = registrationBasedMaleUniversityMargin;
        female_university_margin = registrationBasedFemaleUniversityMargin;
    }
    else if(renumeration === 'registration_appearance_based'){
        male_university_margin = registrationAppearanceBasedMaleUniversityMargin;
        female_university_margin = registrationAppearanceBasedFemaleUniversityMargin;
    }
    ////////////////////condition/////////////
    var text_message = '';
    var text = 'This centre will need to Approved before it is enabled because the Remuneration entered by you is exceeding the set limits.';
    if(level_2_approval.males_operator !== '' && level_2_approval.males_operator === 'greater_than' && male_university_margin !== ''){
       if(male_university_margin < level_2_approval.males_operator_value){
           text_message = text;
       }           
    }
    if(text_message === '' && level_2_approval.females_operator !=='' && level_2_approval.females_operator === 'greater_than' && female_university_margin !== ''){
       if(female_university_margin < level_2_approval.females_operator_value){
           text_message = text;
       }           
    }
    if(text_message === '' && level_3_approval.males_operator !=='' && level_3_approval.males_operator === 'greater_than' && male_university_margin !== ''){
       if(male_university_margin < level_3_approval.males_operator_value){
           text_message = text;
       }           
    }
    if(text_message === '' && level_3_approval.females_operator !=='' && level_3_approval.females_operator === 'greater_than' && female_university_margin !== ''){
       if(female_university_margin < level_3_approval.females_operator_value){
           text_message = text;
       }           
    }
    $('#renumeration_error').text(text_message);
}

function getRemuneration(collegeId,registerId,user_level=''){
    $.ajax({
        url: jsVars.FULL_URL+'/agents/remuneration_list',
        type: 'post',
        dataType: 'html',
        data: {'college_id':collegeId,'register_id':registerId,'user_level':user_level},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function(response) {
            if(response=='session_logout'){
                window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                return false;
            }
            else{
                $('#remunerationDiv').html(response);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function remunerationAction(action){
    /////////////validation////////////
    $('.error').hide();
    var error = false;
    var remunerationType = $('input[name="remuneration_type"]:checked').val();
    if(remunerationType==="" || remunerationType===null || remunerationType===undefined){
        $('#remuneration_type_error').html("Field is required.");
        $('#remuneration_type_error').show();
        error=true;
    } 
    if(remunerationType){
        if(remunerationType == 'registration_based'){
            
            $('.calcCostMaleRB , .calcCostFemaleRB').each(function() {
                if(!$.isNumeric($(this).val())){
                    var myId = $(this).attr('id');
                    $('#'+myId+'_error').html("Only Numeric value allowed.");
                    $('#'+myId+'_error').show();
                    error=true;
                }
            });
            
            if($("#registrationBasedMaleUniversityMargin").val() == ""){
                $('#registrationBasedMaleUniversityMargin_error').html("Field is required.");
                $('#registrationBasedMaleUniversityMargin_error').show();
                error=true;
            }
            if($("#registrationBasedMaleUniversityMargin").val() !== "" && $("#registrationBasedMaleUniversityMargin").val() < 200){
                $('#registrationBasedMaleUniversityMargin_error').html("Min Value should be 200.");
                $('#registrationBasedMaleUniversityMargin_error').show();
                error=true;
            }
            if($("#registrationBasedFemaleUniversityMargin").val() == ""){
                $('#registrationBasedFemaleUniversityMargin_error').html("Field is required.");
                $('#registrationBasedFemaleUniversityMargin_error').show();
                error=true;
            }
            if($("#registrationBasedFemaleUniversityMargin").val() !== "" && $("#registrationBasedFemaleUniversityMargin").val() < 100){
                $('#registrationBasedFemaleUniversityMargin_error').html("Min Value should be 100.");
                $('#registrationBasedFemaleUniversityMargin_error').show();
                error=true;
            }
            if($("#registrationBasedMaleCenterMarginOnRegistration").val() == "" || $("#registrationBasedMaleCenterMarginOnRegistration").val() < 0){
                $('#registrationBasedMaleCenterMarginOnRegistration_error').html("Field is required.");
                $('#registrationBasedMaleCenterMarginOnRegistration_error').show();
                error=true;
            }
            if($("#registrationBasedFemaleCenterMarginOnRegistration").val() == "" || $("#registrationBasedFemaleCenterMarginOnRegistration").val() < 0){
                $('#registrationBasedFemaleCenterMarginOnRegistration_error').html("Field is required.");
                $('#registrationBasedFemaleCenterMarginOnRegistration_error').show();
                error=true;
            }
            if($("#registrationBasedMaleCenterMargin2OnRegistration").val() == "" || $("#registrationBasedMaleCenterMargin2OnRegistration").val() < 0){
                $('#registrationBasedMaleCenterMargin2OnRegistration_error').html("Field is required.");
                $('#registrationBasedMaleCenterMargin2OnRegistration_error').show();
                error=true;
            }
            if($("#registrationBasedFemaleCenterMargin2OnRegistration").val() == "" || $("#registrationBasedFemaleCenterMargin2OnRegistration").val() < 0){
                $('#registrationBasedFemaleCenterMargin2OnRegistration_error').html("Field is required.");
                $('#registrationBasedFemaleCenterMargin2OnRegistration_error').show();
                error=true;
            }
            
            //Centre's Margin on Registration (B)
            var registrationBasedMaleUniversityMarginValue  = $("#registrationBasedMaleUniversityMargin").val(); //C value
            var registrationBasedMaleCenterMarginOnRegistrationValueCalc = 1000 - registrationBasedMaleUniversityMarginValue;
            if($("#registrationBasedMaleCenterMarginOnRegistration").val() != "" && $("#registrationBasedMaleCenterMarginOnRegistration").val() > registrationBasedMaleCenterMarginOnRegistrationValueCalc){
                $('#registrationBasedMaleCenterMarginOnRegistration_error').html("Upper limit is (A)-(C).");
                $('#registrationBasedMaleCenterMarginOnRegistration_error').show();
                error=true;
            }
            
            var registrationBasedFemaleUniversityMarginValue  = $("#registrationBasedFemaleUniversityMargin").val(); //C value
            var registrationBasedFemaleCenterMarginOnRegistrationValueCalc = 500 - registrationBasedFemaleUniversityMarginValue;
            if($("#registrationBasedFemaleCenterMarginOnRegistration").val() != "" && $("#registrationBasedFemaleCenterMarginOnRegistration").val() > registrationBasedFemaleCenterMarginOnRegistrationValueCalc){
                $('#registrationBasedFemaleCenterMarginOnRegistration_error').html("Upper limit is (A)-(C).");
                $('#registrationBasedFemaleCenterMarginOnRegistration_error').show();
                error=true;
            }
            
            //Centre's Margin (II) on Registration (B1 optional) 
            var registrationBasedMaleCenterMarginOnRegistrationValue  = $("#registrationBasedMaleCenterMarginOnRegistration").val(); //B value
            var registrationBasedMaleCenterMargin2OnRegistrationValueCalc = 1000 - registrationBasedMaleUniversityMarginValue - registrationBasedMaleCenterMarginOnRegistrationValue;
            if($("#registrationBasedMaleCenterMargin2OnRegistration").val() != "" && $("#registrationBasedMaleCenterMargin2OnRegistration").val() > registrationBasedMaleCenterMargin2OnRegistrationValueCalc){
                $('#registrationBasedMaleCenterMargin2OnRegistration_error').html("Upper limit is (A)-(C)-(B).");
                $('#registrationBasedMaleCenterMargin2OnRegistration_error').show();
                error=true;
            }
            
            var registrationBasedFemaleCenterMarginOnRegistrationValue  = $("#registrationBasedFemaleCenterMarginOnRegistration").val();
            var registrationBasedFemaleCenterMargin2OnRegistrationValueCalc = 500 - registrationBasedFemaleUniversityMarginValue - registrationBasedFemaleCenterMarginOnRegistrationValue;
            if($("#registrationBasedFemaleCenterMargin2OnRegistration").val() != "" && $("#registrationBasedFemaleCenterMargin2OnRegistration").val() > registrationBasedFemaleCenterMargin2OnRegistrationValueCalc){
                $('#registrationBasedFemaleCenterMargin2OnRegistration_error').html("Upper limit is (A)-(C)-(B).");
                $('#registrationBasedFemaleCenterMargin2OnRegistration_error').show();
                error=true;
            }
            
        }else if(remunerationType === 'registration_appearance_based'){
            
            $('.calcCostMaleRBA , .calcCostFemaleRBA').each(function() {
                if(!$.isNumeric($(this).val())){
                    var myId = $(this).attr('id');
                    $('#'+myId+'_error').html("Only Numeric value allowed.");
                    $('#'+myId+'_error').show();
                    error=true;
                }
            });
                
            if($("#registrationAppearanceBasedMaleCenterMarginOnRegistration").val() == "" || $("#registrationAppearanceBasedMaleCenterMarginOnRegistration").val() < 0){
                $('#registrationAppearanceBasedMaleCenterMarginOnRegistration_error').html("Field is required.");
                $('#registrationAppearanceBasedMaleCenterMarginOnRegistration_error').show();
                error=true;
            }
            if($("#registrationAppearanceBasedFemaleCenterMarginOnRegistration").val() == "" || $("#registrationAppearanceBasedFemaleCenterMarginOnRegistration").val() < 0){
                $('#registrationAppearanceBasedFemaleCenterMarginOnRegistration_error').html("Field is required.");
                $('#registrationAppearanceBasedFemaleCenterMarginOnRegistration_error').show();
                error=true;
            }
            
            if($("#registrationAppearanceBasedMaleCenterMarginOnRegistration").val() != "" && $("#registrationAppearanceBasedMaleCenterMarginOnRegistration").val() > 800){
                $('#registrationAppearanceBasedMaleCenterMarginOnRegistration_error').html("Upper limit is (A)-(C).");
                $('#registrationAppearanceBasedMaleCenterMarginOnRegistration_error').show();
                error=true;
            }
            
            if($("#registrationAppearanceBasedFemaleCenterMarginOnRegistration").val() != "" && $("#registrationAppearanceBasedFemaleCenterMarginOnRegistration").val() > 400){
                $('#registrationAppearanceBasedFemaleCenterMarginOnRegistration_error').html("Upper limit is (A)-(C).");
                $('#registrationAppearanceBasedFemaleCenterMarginOnRegistration_error').show();
                error=true;
            }
            
        }
    }
    if(error){
        return false;        
    }
    /////////////////////////////////
    var college_id = $('#college_id').val();
    var data = $('#remuneration_form').serializeArray();
    data.push({name: 'action', value: action});
    data.push({name:'college_id', value:college_id});
    $.ajax({
        url: jsVars.FULL_URL+'/agents/remuneration_action',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            if(action === 'approve'){
                $('#approve').addClass('hidden');
                $('#save_loader_approve').removeClass('hidden');
            }
            if(action === 'reject'){
                $('#reject').addClass('hidden');
                $('#save_loader_reject').removeClass('hidden');                
            }
        },
        complete: function () {
            if(action === 'approve'){
                $('#save_loader_approve').addClass('hidden');
                $('#approve').removeClass('hidden');                 
            }
            if(action === 'reject'){
                $('#save_loader_reject').addClass('hidden');
                $('#reject').removeClass('hidden');                 
            }
                       
        },
        success: function(response) {            
            if(typeof response.redirect != "undefined" && response.redirect!=''){
                 window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                 return false;
            }
            else if(response.message!='' && response.status == 200){
                $('.close').trigger('click');
                LoadMoreCenter('reset');
                alertPopup(response.message, 'success');
            }
            else if(typeof response.error !='undefined' && response.error!=''){
                alertPopup(response.error, 'error');
            }
            else{
                alertPopup(response.message, 'error');
                return false;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
function filterReset(){
    $('#centre_type').val("").trigger("chosen:updated");
    $('#enable_user').val("").trigger("chosen:updated");
    $('#created_by').val("");
    $('#team_member').val("");
    $('#created_on').val("");
    $('.created_sumo_select').SumoSelect().sumo.reload();
    $('.team_sumo_select').SumoSelect().sumo.reload();
    
}
function editRmuneration(){
    var renumeration = $('input[name="remuneration_type"]:checked').val();
    if(renumeration=='registration_based'){
        $('#registrationBasedMaleUniversityMargin').removeAttr("readonly");
        $('#registrationBasedFemaleUniversityMargin').removeAttr("readonly");
        $('#registrationBasedMaleCenterMarginOnRegistration').removeAttr("readonly");
        $('#registrationBasedMaleCenterMargin2OnRegistration').removeAttr("readonly");
        $('#registrationBasedFemaleCenterMargin2OnRegistration').removeAttr("readonly");
        $('#registrationBasedFemaleCenterMarginOnRegistration').removeAttr("readonly");        
    }
    else if(renumeration=='registration_appearance_based'){
        $('#registrationAppearanceBasedMaleCenterMarginOnRegistration').removeAttr("readonly");
        $('#registrationAppearanceBasedFemaleCenterMarginOnRegistration').removeAttr("readonly");
    }
}
