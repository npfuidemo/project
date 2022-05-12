
var appendFlag = 0;

/* 
 * To handle User Counsellor Config Js Functions.
 */
//alert popup
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

/************ User Manager code********/

function SaveQueyData(container,fromId){
    if(typeof container == 'undefined' || container != 'UserConfigurationSection'){
        return false;
    }
    
    var data = $('#' + fromId).serializeArray();
    $.ajax({
        url: '/users/saveQueryConfig/' + jsVars.paramString,
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#UserConfigurationSection .loader-block').show();
        },
        complete: function () {
            // hide loader
            $('#UserConfigurationSection .loader-block').hide();
        },
        success: function (json) {
            if (json['session_logout']) {
                // if session is out
                location = FULL_URL;
            } 
            else if (json['status']==0) {
                // error display in popup
                alertPopup(json['message'], 'error');
            }
            else if (json['status'] == 200){
                alertPopup(json['message'], 'Success');
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

function updateQueryCategoryStatus(id){
    if(id === "viewAllQueryPermission"){
        if($("#viewAllQueryPermission").is(":checked")){
            $("select[name='assigned_query_category[]']").val('').attr("disabled","disabled").trigger('chosen:updated');
        }else{
            $("select[name='assigned_query_category[]']").removeAttr("disabled").trigger('chosen:updated');
        }
    }else{
        if($("select[name='assigned_query_category[]']").val() === null || $("select[name='assigned_query_category[]']").val() === undefined){
            $("#viewAllQueryPermission").removeAttr("disabled");
        }else{
            $("#viewAllQueryPermission").attr("disabled","disabled");
        }
    }
    
}


function GetUserUnMaskCollegeView(CollegeSelected,role,UserSelected) {
    if($("#AllowToUnmaskCollege").prop("checked") == false){
        return false;
    }
    var cid = CollegeSelected.split(',');
    $.ajax({
        url: jsVars.GetUserUnMaskCollegeLink,
        type: 'post',
        data: {role: role, CollegeSelected: cid, UserSelected: UserSelected},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (html) {
            if (html == 'session')
            {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } 
            else if (html == 'required')
            {
                alertPopup('College and user role both are required.', 'error');
            } 
            else if (html == 'error')
            {
                alertPopup('College and user role both are required.', 'error');
                if(role == jsVars.GROUP_PUBLISHER_ID_JS){
                    $('#UserUnmaskSection').html('');
                }
            } 
            else
            {
                $('#UserUnmaskSection').html(html);
                $('.panel-group').on('hidden.bs.collapse1', toggleIcon);
                $('.panel-group').on('shown.bs.collapse1', toggleIcon);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function toggleIcon(e)
{
    $(e.target)
            .prev('.panel-heading')
            .find(".more-less")
            .toggleClass('glyphicon-plus glyphicon-minus');
}

function SaveUnmaskedData(container, fromId){
    if(typeof container == 'undefined' || container != 'UserConfigurationSection'){
        return false;
    }
   
    var data = $('#' + fromId).serializeArray();
    $.ajax({
        url: '/users/saveUnmaskConfig/' + jsVars.paramString,
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#UserConfigurationSection .loader-block').show();
        },
        complete: function () {
            // hide loader
            $('#UserConfigurationSection .loader-block').hide();
        },
        success: function (json) {
            if (json['session_logout']) {
                // if session is out
                location = FULL_URL;
            } 
            else if (json['status']==0) {
                // error display in popup
                alertPopup(json['message'], 'error');
            }
            else if (json['status'] == 200){
                alertPopup(json['message'], 'Success');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}


function PopulateStateCityList(value) {
    if(value.length > 2 ){
        $.ajax({
            url: '/users/populate-state-city',
            type: 'post',
            data: { key: value},
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (html) {
                if (html === 'session_logout'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else if(html === 'error') {
                    //do nothing
                } else {
                    $('#load_table_column').html(html);
                    $('#load_table_column').show();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }else{
        $('#load_table_column').html('');
        $('#load_table_column').hide();
    }
}


function setTableTagValue(key,label) {
 
    var existing_val = $('#assigned_area').val();
    var duplicateFlag = 0;
    if (existing_val === '') {
        existing_val = key;
    } else {
        var existing_val_array = existing_val.split(',');
        if($.inArray(''+key, existing_val_array) === -1){
            existing_val += ',' + key;
        }else{
            duplicateFlag = 1;
        }
    }
    
    var tag_key = '<span id="' + key + '">' + label + ' <i onclick="deleteAliasField(\'' + key + '\',this);" aria-hidden="true" class="fa fa-times"></i></span>';
    if(duplicateFlag === 0){
        $('#assigned_area').val(existing_val);
        $("#border_selected_tag").append(tag_key);
        $("#input_enter" ).val('');
        $('#load_table_column').html('');
        $('#load_table_column').hide();
    }
    


}

function deleteAliasField(key, elem) {

    var alias_value = $('#assigned_area').val();
    if (alias_value !== '') {
        var alias_value_array = alias_value.split(',');

        var index = alias_value_array.indexOf(key);
        if (index > -1) {
            alias_value_array.splice(index, 1);
        }
        var alias_val = '';
        if (alias_value_array.length > 0) {
            alias_val = alias_value_array.toString();
        }
        $('#assigned_area').val(alias_val);
        jQuery(elem).parent('span').remove();
    }
}

function SaveAreaData(container, fromId){
    if(typeof container == 'undefined' || container != 'UserConfigurationSection'){
        return false;
    }
    
    var data = $('#' + fromId).serializeArray();
    $.ajax({
        url: '/users/saveAreaConfig/' + jsVars.paramString,
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#UserConfigurationSection .loader-block').show();
        },
        complete: function () {
            // hide loader
            $('#UserConfigurationSection .loader-block').hide();
        },
        success: function (json) {
            if (json['session_logout']) {
                // if session is out
                location = FULL_URL;
            } 
            else if (json['status']==0) {
                // error display in popup
                alertPopup(json['message'], 'error');
            }
            else if (json['status'] == 200){
                alertPopup(json['message'], 'Success');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}
/*******************End User Manager Code*******************/

function SaveUserConfigOptionData(Section, collapseDivId, collegeId) 
{
    if((typeof collegeId === 'undefined') || (parseInt(collegeId) === '') || (parseInt(collegeId) < 1)) {
        return false;
    }
    //remove all error msg
    $('#' + Section + ' #'+collapseDivId+ collegeId + ' div.has-error').removeClass('has-error');
    $('#' + Section + ' #'+collapseDivId+ collegeId + ' span.help-block').html('').hide();
    // loader
    $('#UserConfigurationSection .loader-block').show();
    // serialize all form data
    var data = $('#' + Section + ' #'+collapseDivId+ collegeId + ' input, #' + Section + ' #'+collapseDivId + collegeId + ' textarea').serializeArray();
    data.push({name: "college_id", value: collegeId});
    $.ajax({
        url: '/users/SaveUserConfigOptionData/' + jsVars.paramString,
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
            // hide loader
            $('#UserConfigurationSection .loader-block').hide();
        },
        success: function (json) {
            if (json['redirect']) {
                // if session is out
                location = json['redirect'];
            } 
            else if (json['error']) {
                // error display in popup
                alertPopup(json['error'], 'error');
            }
            else if (json['errorList']) {
                for(var field in json['errorList']) {
                    var parent = $('#' + Section + ' #collapseTelephony' + collegeId + ' div.' + field);
                    $(parent).find('span').html(json['errorList'][field]).show();
                    $(parent).addClass('has-error');
                }
            }
            else if (json['status'] == 200){
                alertPopup(json['message'], 'Success');
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

/**
 * SaveSenderIDConfigData - for overriding the college level sender ids
 * @param {type} Section
 * @param {type} collegeId
 * @returns {Boolean}
 */
function SaveSenderIDConfigData(Section, collegeId) 
{
    if((typeof collegeId === 'undefined') || (parseInt(collegeId) === '') || (parseInt(collegeId) < 1)) {
        return false;
    }
    //remove all error msg
    $('#' + Section + ' #collapseSenderID' + collegeId + ' div.has-error').removeClass('has-error');
    $('#' + Section + ' #collapseSenderID' + collegeId + ' span.help-block').html('').hide();
    // loader
    $('#UserConfigurationSection .loader-block').show();
    // serialize all form data
    var data = $('#' + Section + ' #collapseSenderID' + collegeId + ' input, #' + Section + ' #collapseSenderID' + collegeId + ' select').serializeArray();
    data.push({name: "college_id", value: collegeId});
    $.ajax({
        url: '/users/saveCounsellorSenderIDConfig/' + jsVars.paramString,
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
            // hide loader
            $('#UserConfigurationSection .loader-block').hide();
        },
        success: function (json) {
            if (json['redirect']) {
                // if session is out
                location = json['redirect'];
            } 
            else if (json['error']) {
                // error display in popup
                alertPopup(json['error'], 'error');
            }
            else if (json['errorList']) {
                for(var field in json['errorList']) {
                    var parent = $('#' + Section + ' #collapseTelephony' + collegeId + ' div.' + field);
                    $(parent).find('span').html(json['errorList'][field]).show();
                    $(parent).addClass('has-error');
                }
            }
            else if (json['success'] == 200){
                alertPopup(json['Msg'], 'Success');
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

