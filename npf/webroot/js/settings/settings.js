$(document).ready(function(){
    if ($('#EnrolmentConfigContainer').length > 0) {
       $('#lead_stage_type').SumoSelect({placeholder: 'Select stages', search: true, searchText:'Search Stages', selectAll : false, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });

    }

    if(jsVars.userCollegeId != ''){
	$('#enrollmentDetailsButton').click();

    }
});

function getEnrollmentDetails(event){
    event.preventDefault();
    var collegeId = $('#collegeId').val();
    if(collegeId != ''){
        $.ajax({
            url: '/settings/getCollegeEnrolmentConfig',
            type: 'post',
            data: {'collegeId': collegeId},
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function() {
                //$('#CollegeConfigurationSection .loader-block').show();
                $('#enrollmentDetailsButton').prop('disabled', true);
            },
            complete: function() {
                //$('#CollegeConfigurationSection .loader-block').hide();
                 $('.offCanvasModal').modal('hide');
                 $('#load_msg_div').hide();
            },
            success: function (html) {
                $('#enrollmentDetailsButton').removeAttr('disabled');
                if (html=='session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else if(html== 'invalid request'){
                    $('#lead_stage_type').html("");
                    $('select#lead_stage_type')[0].sumo.reload();
                    alertPopup('Invalid request','error');
                }
                else{
                    $('#listingContainerSettingSection').html(html);
//                    $.material.init();
                    $('#lead_stage_type').SumoSelect({placeholder: 'Select stages', search: true, searchText:'Search Stages', selectAll : false, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
                    $('#enrolment_stage_type').SumoSelect({placeholder: 'Select stages', search: true, searchText:'Search Stages', selectAll : false, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
                    $('#oc_application_initiated_config_type').SumoSelect({placeholder: 'Select stages', search: true, searchText:'Search Stages', selectAll : false, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
                    $('#oc_payment_approved_config_type').SumoSelect({placeholder: 'Select stages', search: true, searchText:'Search Stages', selectAll : false, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
                    $('.chosen-select').chosen();
                    $('.chosen-select').trigger('chosen:updated');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }else{
        $('#listingContainerSettingSection').html('');
    }
}

function getEnrolmentStages(type,cid){

    $.ajax({
        url: '/settings/getEnrolmentStages',
        type: 'post',
        data: {'type':type,'collegeId':cid},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
            //$('#CollegeConfigurationSection .loader-block').show();
        },
        complete: function() {
            //$('#CollegeConfigurationSection .loader-block').hide();
        },
        success: function (json) {

            if (json['message']=='session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if(json['status']==0){
                $('#lead_stage_type').html("");
                    $('select#lead_stage_type')[0].sumo.reload();
                    //alertPopup(json['message'],'error');
            }
            else if(json['status'] == 200){
                if(typeof json.data=='object'){
                    var stageOptions = '';
                    $('#lead_stage_type').html(json.data.stageList);
                    $('select#lead_stage_type')[0].sumo.reload();
                }else{
                    $('#lead_stage_type').html("");
                    $('select#lead_stage_type')[0].sumo.reload();
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
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
            $(selector_parent).on('hide.bs.modal', function () {
                window.location.href = location;
            });
            $(selector_parent).modal('hide');
        });
    }
    else {
        $(selector_parent).modal();
    }
}

function SaveSectionData(){
    var data = [];
    data = $('#EnrolmentSetting').serializeArray();

    $.ajax({
        url: jsVars.FULL_URL + '/settings/save-enrolment-mapping/'+jsVars.base64String,
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $('#listloader').show();
        },
        complete: function () {
            $('#listloader').hide();
            $(':input[type="button"]').removeAttr("disabled");
        },
        async: false,
        success: function (json) {
            if (json['session']) {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(json['status']==0 || json['status']==1){
                alertPopup(json['message'],'error');
            }
            else if(json['status'] == 200){
                alertPopup(json['message'],'success');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            //setTimeout("location.reload();",5000);
        }
    });
}

function enrolmentPopup(){
    var html = $('#popupContentText').html();
    $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
    $('#ActivityLogPopupArea #alertTitle').text('Enrolment Mapping');
    $('#ActivityLogPopupHTMLSection').html(html);
    $('#ActivityLogPopupLink').trigger('click');
}

function SaveOcApplicationData(){
    var data = [];
    var dataAS = $('#OcApplicationSetting').serializeArray();
    var dataAI = $('#OcApplicationInitiatedSetting').serializeArray();
    var dataPA = $('#OcPaymentAppSetting').serializeArray();

    data  = data.concat(dataAS,dataAI,dataPA);

    $.ajax({
        url: jsVars.FULL_URL + '/settings/save-oc-application-mapping/'+jsVars.base64String,
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $('#listloader').show();
        },
        complete: function () {},
        async: false,
        success: function (json) {
            if (json['session']) {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(json['status']==0 || json['status']==1){
                $('#listloader').hide();
                $(':input[type="button"]').removeAttr("disabled");
                alertPopup(json['message'],'error');
            }
            else if(json['status'] == 200) {
                SaveOcEnrolmentData();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            //setTimeout("location.reload();",5000);
        }
    });
}

function SaveOcEnrolmentData(){
    var data = [];
    data = $('#OcEnrolmentSetting').serializeArray();

    $.ajax({
        url: jsVars.FULL_URL + '/settings/save-oc-enrolment-mapping/'+jsVars.base64String,
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {},
        complete: function () {
            $('#listloader').hide();
            $(':input[type="button"]').removeAttr("disabled");
        },
        async: false,
        success: function (json) {
            if (json['session']) {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(json['status']==0 || json['status']==1){
                alertPopup(json['message'],'error');
            }
            else if(json['status'] == 200){
                console.log('here in enrol');
                alertPopup(json['message'],'success');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            //setTimeout("location.reload();",5000);
        }
    });
}




function resetEnrolStages(){
    var enrolStages = {};
    $('#lead_stage_type > option:selected').each(function(){
        enrolStages[$(this).val()] = $(this).text();
    });
    var str = '';
    for(var i in enrolStages){
        var selected = jsVars.selectedEnrolStages.indexOf(i) > -1 ? 'selected' : '';
        str += '<option value="'+ i + '" '+ selected + '>' + enrolStages[i] + '</option>'
    }
    $('#enrolment_stage_type').html(str);
    $('#enrolment_stage_type')[0].sumo.reload();
}


function resetEnrolStagesNew(count){
    try{
        var enrolStages = {};
        var j;
        //do some thing
        $('select.datapointOptionValue_'+count+' > option:selected').each(function(){
            enrolStages[$(this).val()] = $(this).text();
        });
        for(j=count+1; j<=4; j++) {
            var str = '';
            for(var i in enrolStages) {
                var selected = (typeof jsVars.selectedEnrolStages!='undefined' && jsVars.selectedEnrolStages.indexOf(i) > -1) ? 'selected' : '';
                str += '<option value="'+ i + '" '+ selected + '>' + enrolStages[i] + '</option>'
            }
            $('select.datapointOptionValue_'+j).html(str);
            $('select.datapointOptionValue_'+j)[0].sumo.reload();
        }
    }catch(err) {
        alert(err);
    }

}

/**
 * Only CRM Configuration
 * @param {type} location
 * @param {type} optValue
 * @returns {undefined}
 */
function showDataPointValue(location, optValue) {
    try {

        var position = location.split('_');
        var count = parseInt(position[1]);
        if(typeof optValue=='undefined' || optValue=='') {
            var num = $(".datapointOptionValue_"+count+" option").length;
            for(var i=0; i<num; i++){
              $("select.datapointOptionValue_"+count)[0].sumo.unSelectItem(i);
            }
            $('select.datapointOptionValue_'+count)[0].sumo.reload();

            var enrolStages = {};
            $('select.datapointOptionValue_'+(count-1)+' > option:selected').each(function(){
                enrolStages[$(this).val()] = $(this).text();
            });
            for(var j=count+1; j<=4; j++) {
                var str = '';
                for(var i in enrolStages) {
                    var selected = (typeof jsVars.selectedEnrolStages!='undefined' && jsVars.selectedEnrolStages.indexOf(i) > -1) ? 'selected' : '';
                    str += '<option value="'+ i + '" '+ selected + '>' + enrolStages[i] + '</option>'
                }
                $('select.datapointOptionValue_'+j).html(str);
                $('select.datapointOptionValue_'+j)[0].sumo.reload();
            }

            return false;
        }

        if(typeof location=='undefined' || location=='') {
            throw 'invalid request11.';
        }

        $.ajax({
            url: jsVars.FULL_URL + '/settings/getCrmOptions/'+jsVars.base64String,
            type: 'post',
            dataType: 'json',
            data: {'optValue':optValue},
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            beforeSend: function () {
                $('#listloader').show();
            },
            complete: function () {},
            async: false,
            success: function (json) {
                if (json['session']) {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }
                else if(json['status']==0 || json['status']==1){
                    $('#listloader').hide();
                    //$(':input[type="button"]').removeAttr("disabled");
                    alertPopup(json['message'],'error');
                }
                else if(json['status'] == 200){
                    var i;
                    for(i=count; i<=4; i++) {
                        //do some thing
                        $('select#datapoints_'+i).val(optValue);
                        $('select#datapoints_'+i).trigger("chosen:updated");

                        $('select.datapointOptionValue_'+i).html(json.data.stageList);
                        $('select.datapointOptionValue_'+i)[0].sumo.reload();
                    }
                    if(count>1){
                        var j;
                        for(j=count-1; j>=1; j--) {
                            $('select.datapointOptionValue_'+j).html('');
                            $('select.datapointOptionValue_'+j)[0].sumo.reload();

                            $('select#datapoints_'+j).val('');
                            $('select#datapoints_'+j).trigger("chosen:updated");
                        }
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                //setTimeout("location.reload();",5000);
            }
        });
    }
    catch(err) {
        alert(err);
    }
}