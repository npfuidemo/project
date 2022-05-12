$(document).ready(function(){
});


function submitFormStageConfigForm(formId){
    var data = $('#formStageConfigForm'+formId).serializeArray();
    data.push({'name':'update','value':'update'});
    $.ajax({
        url: '/users/saveFormStageConfig',
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
                alertPopup('Configuration Successfully Saved', 'success');
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


function submitCampusWiseTrendAnalysisConfigForm(formId){
    var data = $('#campusTrendAnalysisConfigForm'+formId).serializeArray();
    data.push({'name':'update','value':'update'});
    $.ajax({
        url: '/users/saveCampusWiseTrendAnalysisConfig',
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
                alertPopup('Configuration Successfully Saved', 'success');
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
