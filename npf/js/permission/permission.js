/* 
 * To handle permission related javascript.
 */

if ($('#PermissionListPage').length > 0)
{
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
}

 

function LoadMorePermission(action) {
    if(action == 'reset')
    {
        Page = 0;
        $('#load_more_button').show();
    }
    var data = $('#PermissionFilterListForm').serializeArray();
    data.push({name:'page',value:Page});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $.ajax({
        url: '/permissions/ajax-permission-list',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            data = data.replace("<head/>", '');
            Page = Page + 1;
            if (data == "error") {

                if(action == 'reset')
                {
                    $('#load_more_results').html("<div class='alert alert-danger'>No More Records</div>");
                }
                else
                {
                    $('#load_more_results').append("<div class='alert alert-danger'>No More Records</div>");
                }                
                $('#load_more_button').hide();
            } else {
                if(action == 'reset')
                {
                    $('#load_more_results').html(data);
                }
                else
                {
                    $('#load_more_results').append(data);
                }

                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html("Next Page");
//                $.material.init();
            }
            //console.log(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function LoadMethods(value, default_val) {
    $('#div_load_method').html("<select name='controller_method' id='controller_method' class='chosen-select'><option value=''>Loading...</option></select>");
    $.ajax({
        url: jsVars.GetControllerMethodLink,
        type: 'post',
        dataType: 'html',
        data: {
            "controller": value,
            "method": "controller_method",
            "default_val": default_val
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#div_load_method').html(data);
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.chosen-select').trigger('chosen:updated');
            //console.log(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$(document).on('change', '#s_college_id', function () {
    $('#search_by_text').val('');
    $('#s_module').val('');
    $('#s_group').val('');
    $('#search_roles').submit();
});

$(document).on('click', '.search_button', function () {
    var search_text = $('#search_by_text').val();
    if(search_text.trim().length>0 && search_text.trim().length<3){
        $('.search_error').html('Please enter atleast 3 letters.');
        return false;
    }else{
        $('.search_error').html('');
    }
    $(this).attr('disabled',true);
    $('#search_roles').submit();
});

$(document).on('click', '#update_permission', function () {
    $(this).attr('disabled',true);
    $('#FilterApplicationForm').submit();
});



$(document).on('keypress', '#search_by_text', function (event) {
    var search_text = $('#search_by_text').val();
    if (event.which == 13) {
        event.preventDefault();
        if(search_text.trim().length>0 && search_text.trim().length<3){
            $('.search_error').html('Please enter atleast 3 letters.');
            return false;
        }else{
            $('.search_error').html('');
        }
       $('#search_roles').submit();
    }
});

function SubmitPermissionForm(){
    
    var data = $('#FilterApplicationForm, #search_roles').serializeArray();
    data.push({'name':'update','value':'update'});
    $.ajax({
        url: '/permissions/colleges-view',
        type: 'post',
        dataType: 'json',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if(json['redirect']){
                location = json['redirect'];
            }else if(json['error']){
                alertPopup(json['error'],'error');
            }else if(json['status']==200){
                
                alertPopup('Permisson Successfully Saved','success','/permissions/colleges-view');
            }
            
            //console.log(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
    return false;
    
}


function SubmitNPFPermission(){
    
    var data = $('#FilterApplicationForm, #search_roles').serializeArray();
    data.push({'name':'update','value':'update'});
    $.ajax({
        url: '/permissions/view',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        success: function (json) {
            if(typeof json['redirect'] != 'undefined' && json['redirect'] != ''){
                location = json['redirect'];
            }else if(json['error']){
                alertPopup(json['error'],'error');
            }else if(json['status']==200){
                
                alertPopup('Permisson Successfully Saved','success','/permissions/view');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();

        }
    });
    
    return false;
    
}

function enablePublisherPerissionCollege(){
        if($("#s_college_id").length){
            if($("#permission_type").val()=="college"){
                $("#s_college_id").prop("disabled",false);
            }else{
                 $("#s_college_id").val("");
                $("#s_college_id").prop("disabled",true);
            }
            $("#s_college_id").trigger('chosen:updated');
        }
}

function validatePublisherPermissionForm(){
    if($("#permission_type").length){
        if($("#permission_type").val()==""){
            alertPopup('Please select Permission Type !', 'error');
            return false;
        }else if($("#permission_type").val()=="college"){
            if($("#s_college_id").length){
                if($("#s_college_id").val()==""){
                    alertPopup('Please select Institute !', 'error');
                    return false;
                }
            }
        }
    }else{
        if($("#s_college_id").length){
            if($("#s_college_id").val()==""){
                alertPopup('Please select Institute !', 'error');
                return false;
            }
        }
    }
    return true;
}

function SubmitPublisherPermissionForm(){
    if($("#permission_type").length){
        if($("#permission_type").val()==""){
            alertPopup('Please select Permission Type !', 'error');
            return false;
        }
    }else{
        if($("#s_college_id").length){
            if($("#s_college_id").val()==""){
                alertPopup('Please select Institute !', 'error');
                return false;
            }
        }
    }
    
    var data = $('#FilterApplicationForm, #publisherPermissionForm').serializeArray();
    data.push({'name':'update','value':'update'});
    $.ajax({
        url: '/permissions/saveCollegePublisherPermissions',
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
                $('#publisherPermissionForm').submit();
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

function dependentPermission(obj,key,name){
    var val = obj.checked;
    switch(name){
        case 'enableCheckinCheckout':
            if(!val){
                $(document).find("input[data-uid='enablefieldForceLocationTracking" + key + "']")
                        .prop('checked',val);
                $(document).find("input[data-uid='enableLocationCheckinCheckout" + key + "']")
                        .prop('checked',val);
            }
            break;
        case 'enableLocationCheckinCheckout':
            if(val){
                $(document).find("input[data-uid='enableCheckinCheckout" + key + "']").prop('checked',val);
            }
            if(!val){
                $(document).find("input[data-uid='enablefieldForceLocationTracking" + key + "']")
                        .prop('checked',val);
            }
            break;
        case 'enablefieldForceLocationTracking':
            if(val){
                $(document).find("input[data-uid='enableCheckinCheckout" + key + "']").prop('checked',val);
                $(document).find("input[data-uid='enableLocationCheckinCheckout" + key + "']").prop('checked',val);
            }
            break;
    }
}
