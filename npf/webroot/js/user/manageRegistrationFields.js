$(document).ready(function(){
    $(".chosen-select").chosen();
    //$('#manageFieldsLoader').hide();
	$('[data-toggle="tooltip"]').tooltip(); 
    $("#collegeId").change(changeCollege);
    $('.select_field').on('click' ,function(e) {
        $('#select_all').attr('checked',false);
    });
	table_fix_rowcol();
	var clgName = $( "#collegeId option:selected" ).text();
	$('#clgName').text('('+clgName+')');
	
	$('a[aria-controls="applicationAttribute"]').click(function(){
		$('.leadAttribute').hide();
		$('.appAttribute').show();
	})
	$('a[aria-controls="listingContainerSection"]').click(function(){
		$('.leadAttribute').show();
		$('.appAttribute').hide();
	});
        
    if(jsVars.tab !='undefined' && jsVars.tab == 'application'){
        $('a[aria-controls="applicationAttribute"]').trigger('click');
    }

    $('#manage_reg_field_reset_btn').on('click',function(){
        var field_type = $(this).attr('field_type');
        if(field_type == 'leads'){
            var college_id = $(this).attr('data-college_id');
            var fieldKey = $(this).attr('data-fieldKey');
            var action = $(this).attr('data-action');
            createRegistrationField(college_id,fieldKey,action,true);
        }else if(field_type == 'application'){
            var college_id = $(this).attr('data-college_id');
            var formId = $(this).attr('data-formId');
            var fieldKey = $(this).attr('data-fieldKey');
            var action = $(this).attr('data-action');
            createApplicationRegistrationField(college_id,formId,fieldKey,action,true);
        }else if(field_type == 'leads'){
            var college_id = $(this).attr('data-college_id');
            var formId = $(this).attr('data-formId');
            createApplicationStatusMapping(college_id,formId,true);
        }
    });
});


function selectAll(elem){
    if(elem.checked){
        $('.select_field').not(".disable-check").each(function(){
            this.checked = true;
        });
    }else{
        $('.select_field').not(".disable-check").attr('checked',false);
    }
}


function changeCollege(){
    var searchField      = '<select name="searchField" id="searchField" class="chosen-select" tabindex="-1"><option selected="selected" value="">Search Field</option></select>';
    $('#searchFieldDiv').html(searchField);
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    
    if($("#collegeId").val()==''){
        return;
    }
    $.ajax({
        url: jsVars.getRegistrationFieldsLink,
        type: 'post',
        data: {collegeId:$("#collegeId").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#manageFieldsLoader.loader-block').show();
        },
        complete: function () {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('#manageFieldsLoader.loader-block').hide();
        },
        success: function (response) {            
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                        var searchField      = '<select name="searchField" id="searchField" class="chosen-select" tabindex="-1"><option selected="selected" value="">Search Field</option>';
                        $('#searchFieldDiv').html(searchField);
                        $.each(responseObject.data, function (index, item) {
                            searchField += '<option value="'+index+'">'+item+'</option>';
                        });
                        searchField += '</select>';
                        console.log(searchField);
                        $('#searchFieldDiv').html(searchField);
                }
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alert(responseObject.message);
                }
            }
			var clgName = $( "#collegeId option:selected" ).text();
			$('#clgName').text('('+clgName+')');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function submitForm(){
    if($("#collegeId").val()==""){
		$('#dependentContentAjax').hide();
		$('#clgName').text('');	
        $('#listingContainerSection').html('<div id="load_msg_div"><div class="aligner-middle"><div class="text-center text-info font16"><span class="lineicon-43 alignerIcon"></span><br><span id="load_msg">Please select an Institute Name from filter and click apply to view Applications.</span></div></div></div>');
        return;
    }
	$('#manageFieldsLoader').show();
    $("#filterRegistrationFieldsForm").submit();
	$('#load_msg_div').hide();
}

function createRegistrationField(college_id,fieldKey,action,reset=false){
    $.ajax({
        url: '/users/create-registration-field-ajax',
        type: 'post',
        data: {college_id:college_id,fieldKey:fieldKey},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
           
        },
        complete: function () {
           
        },
        success: function (response) {
            var checkError  = response.substring(0, 6);
            if (response === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alertPopup(response.substring(6, response.length),'error');
            }else{     
                $('#create_reg_field_title').html(action+" Registration Form Field");
                $('#registration_fields_data').html(response);
                $("#submitbutton").removeAttr('disabled').attr('field_type','leads');
                $('.chosen-select').chosen();
                initRegistrationFields();
                if(!reset){
                    $('#showManageRegistrationPopup').trigger('click');
                }
                $('#manage_reg_field_reset_btn').attr('data-college_id',college_id).attr('data-fieldKey',fieldKey).attr('data-action',action).attr('field_type','leads');
            }
            floatableLabel();  
            $('[data-toggle="tooltip"]').tooltip();
            $('[data-toggle="popover"]').popover();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function createApplicationRegistrationField(college_id,formId,fieldKey,action,reset=false){
    $.ajax({
        url: '/college-settings/create-application-registration-field-ajax',
        type: 'post',
        data: {college_id:college_id,formId:formId,fieldKey:fieldKey},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
           
        },
        complete: function () {
           
        },
        success: function (response) {
            var checkError  = response.substring(0, 6);
            if (response === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alertPopup(response.substring(6, response.length),'error');
            }else{     
                $('#create_reg_field_title').html(action+" Application Registration Form Field");
                $('#registration_fields_data').html(response);
                $("#submitbutton").removeAttr('disabled').attr('field_type','application');
                
                $('.chosen-select').chosen();
                initRegistrationFields();
                if(!reset){
                    $('#showManageRegistrationPopup').trigger('click');
                }
                $('#manage_reg_field_reset_btn').attr('data-college_id',college_id).attr('data-formId',formId).attr('data-fieldKey',fieldKey).attr('data-action',action).attr('field_type','application');
            }
            floatableLabel();   
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function createApplicationStatusMapping(college_id,formId,reset=false){
    $.ajax({
        url: '/college-settings/create-application-status-mapping-ajax',
        type: 'post',
        data: {college_id:college_id,formId:formId},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
           
        },
        complete: function () {
           
        },
        success: function (response) {
            var checkError  = response.substring(0, 6);
            if (response === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alertPopup(response.substring(6, response.length),'error');
            }else{     
                $('#application_status_mapping_fields_data').html(response);
                $("#submitbuttonstatusmapping").removeAttr('disabled');
                $('.chosen-select').chosen();
                initRegistrationFields();
                if(!reset){
                    $('#showApplicationStatusMappingPopup').trigger('click');
                }
                $('#manage_reg_field_reset_btn').attr('data-college_id',college_id).attr('data-formId',formId).attr('field_type','mapping');
            }
            floatableLabel();
            $('.sumo-select').SumoSelect({placeholder: 'Select Value', search: true, searchText:'Search Value', triggerChangeCombined: false }); 
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
