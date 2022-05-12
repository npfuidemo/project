var initilizeCounsellorWiseLeadApplication = function () {
    dateRangeHtml = "";
    $("#CounsellorWiseSourceDashlet").find(".applyDates").click(function () 
    {
        $("#CounsellorWiseSource_range1StartDate").val("");
        $("#CounsellorWiseSource_range1EndDate").val("");
        if ($("#CounsellorWiseSourceDashlet").find(".inputBaseStartDate").val() !== "" &&
                $("#CounsellorWiseSourceDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#CounsellorWiseSource_range1StartDate").val($("#CounsellorWiseSourceDashlet").find(".inputBaseStartDate").val());
            $("#CounsellorWiseSource_range1EndDate").val($("#CounsellorWiseSourceDashlet").find(".inputBaseEndDate").val());
            startDateObj = new Date($("#CounsellorWiseSourceDashlet").find(".inputBaseStartDate").val());
            startDate = startDateObj.getDate() + " " +startDateObj.getMonthName() + " " + startDateObj.getFullYear()
            endDateObj = new Date($("#CounsellorWiseSourceDashlet").find(".inputBaseEndDate").val());
            endDate = endDateObj.getDate() + " " +endDateObj.getMonthName() + " " + endDateObj.getFullYear()
            dateRangeHtml = "(" + startDate + " to " + endDate + ")";                
        }
        $("#CounsellorWiseSource_dateRange").html(dateRangeHtml);
        createCounsellorWiseSourceGraph();
    });
    if(dateRangeHtml == "") {
        getcurrentDate();
        $("#CounsellorWiseSource_dateRange").html(dateRangeHtml);
    }

    $("#CounsellorWiseSourceDashlet").find(".cancelDates").click(function () {
        getcurrentDate();
        createCounsellorWiseSourceGraph();
    });
    $('.sumo-select').SumoSelect({
        search: true,
        searchText: 'Select Counsellor',
        selectAll: true,
	placeholder: 'Select Counsellor', 
        captionFormatAllSelected: "All Selected.", 
        triggerChangeCombined: true, 
        okCancelInMulti: true,
        floatWidth: 600,
        forceCustomRendering: true,
        nativeOnDevice: ['Android', 'BlackBerry', 'iPhone', 'iPad', 'iPod', 'Opera Mini', 'IEMobile', 'Silk'],        
    });    
    createCounsellorWiseSourceGraph();
};
var getcurrentDate = function() {
    $("#CounsellorWiseSource_range1StartDate").val("");
    $("#CounsellorWiseSource_range1EndDate").val("");    
    dateObj = new Date();
    dateRangeHtml = "Till : (" + dateObj.getDate() + " " +dateObj.getMonthName() + " " + dateObj.getFullYear() + ")";
    $("#CounsellorWiseSource_dateRange").html(dateRangeHtml);   
}

var createCounsellorWiseSourceGraph = function (event) {
    var dashletUrl = $("#CounsellorWiseSourceDashlet").data('url');
    $("#CounsellorWiseSource_collegeId").val($("#collegeId").val());
    var filters = $("#CounsellorWiseSourceFilterForm").serializeArray();
    $.ajax({
        url: dashletUrl,
        type: 'post',
        data: filters,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $("#counsellor_id_hidden").val($("#CounsellorWiseSource_counsellor_id").val())
            $("#CounsellorWiseLeadApplicationDashletHTML .panel-loader").show();
            $("#CounsellorWiseLeadApplicationDashletHTML .panel-heading").addClass("pvBlur");            
        },
        complete: function () {
            if(event !== undefined) {
                TabId = event.target.parentNode.id;
                if(TabId == 'ApplicationStagesTabParent') {
                    $("#ApplicationStages").show();
                    $("#LeadStages").hide()
                    $("#ApplicationStagesTabParent").addClass('active');
                    $("#LeadStagesTabParent").removeClass('active');
                } else if(TabId == 'LeadStagesTabParent') {
                    $("#LeadStages").show();
                    $("#ApplicationStages").hide();
                    $("#LeadStagesTabParent").addClass('active');  
                    $("#ApplicationStagesTabParent").removeClass('active');
                }                    
            } else {
                if($(".tablinks.active").attr("id") == "LeadStagesTabParent") {
                    $("#CounsellorWiseSource_university_id, #CounsellorWiseSource_course_id, #CounsellorWiseSource_specialization_id").parent().show();
                    $("#CounsellorWiseSource_form_id").parent().hide();  
                    $("#CounsellorWiseSource_dataType").val('leads');                   
                } else if($(".tablinks.active").attr("id") == "ApplicationStagesTabParent") {
                    $("#CounsellorWiseSource_university_id, #CounsellorWiseSource_course_id, #CounsellorWiseSource_specialization_id").parent().hide();
                    $("#CounsellorWiseSource_form_id").parent().show(); 
                    $("#CounsellorWiseSource_dataType").val('applications');                    
                }                
            }
            $('#CounsellorWiseSource_counsellor_id option').prop('selected', true);

            result = [];
            counsellorIds = [];
            $.each(filters, function() {
                if(this.name == "counsellor_id[]") {
                    counsellorIds.push(this.value);
                }
                result[this.name] = this.value;
            });
            if($("#CounsellorWiseSource_form_id").length > 0) {
                if(typeof $("#CounsellorWiseSource_form_id")[0].options[1] !='undefined') {
                    $('#CounsellorWiseSource_form_id').val($("#CounsellorWiseSource_form_id")[0].options[1].value).trigger('chosen:updated'); 
                }
            }
            if(result['form_id'] != "") {
                $('#CounsellorWiseSource_form_id').val(result['form_id']).trigger('chosen:updated'); 
            }
            if(counsellorIds.length > 0) {
                $("#CounsellorWiseSource_counsellor_id").val(counsellorIds);
            }
            $('.counsellorList').SumoSelect({search: true, searchText: 'Select Counsellor', selectAll: true});
            $('.counsellorList').each(function(){
               this.selected = true;
               $(this)[0].sumo.reload();
           });            
            $("#CounsellorWiseLeadApplicationDashletHTML .panel-loader").hide();
            $("#CounsellorWiseLeadApplicationDashletHTML .panel-heading").removeClass("pvBlur"); 
            table_fix_head();           
        },
        success: function (response) {
            if(response != 'undefined') {
                $("#applicationLeadVsCounsellor").html(response);
                var counsellorVsLeadStageDownload = $("#applicationLeadVsCounsellor").find('#counsellorVsLeadStageDownloadHide').val()
                
                if(counsellorVsLeadStageDownload == 1){
                    $('#CounsellorWiseSourceDashlet').find('.lineicon-download').closest('div').hide()
                }
            }
            
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
};

function CounsellorWiseSource_downloadCSV() {
    $("#CounsellorWiseSourceFilterForm").submit();
}

function openTabs(evt, TabName) {
    resetCounsellorWiseSourceFilterForm();
    getcurrentDate();
    if(TabName == 'ApplicationStages') {
        $("#ApplicationStages").show();
        $("#LeadStages").hide();
        $("#CounsellorWiseSource_university_id, #CounsellorWiseSource_course_id, #CounsellorWiseSource_specialization_id").parent().hide();
        $("#CounsellorWiseSource_form_id").parent().show(); 
        $("#CounsellorWiseSource_dataType").val('applications');
    } else if(TabName == 'LeadStages') {
        $("#ApplicationStages").hide();
        $("#LeadStages").show();        
        $("#CounsellorWiseSource_university_id, #CounsellorWiseSource_course_id, #CounsellorWiseSource_specialization_id").parent().show();
        $("#CounsellorWiseSource_form_id").parent().hide();  
        $("#CounsellorWiseSource_dataType").val('leads');
    }
    createCounsellorWiseSourceGraph(evt);
}

function resetCounsellorWiseSourceFilterForm() {
    $("#CounsellorWiseSourceFilterForm").find('select.dashletFilter').each(function () {
        $(this).val('');
    });
    $('.counsellorList').each(function(){
       this.selected = false;
       $(this).val('');
       $(this)[0].sumo.reload();
    });     
    $("#CounsellorWiseSource_range1StartDate").val("");
    $("#CounsellorWiseSource_range1EndDate").val("");    
    $('.chosen-select').trigger('chosen:updated');    
}

function loadLeadSubStages(lead_stage_id) {
    $("#"+lead_stage_id).toggleClass("collapsed");
    if($("#leadStage_"+lead_stage_id).children().length > 0) {
        $("#leadStage_"+lead_stage_id).parent().toggleClass('in');
        return false;
    }
     $.ajax({
        url: jsVars.counsellorWiseLeadSubStages,
        type: 'post',
        data: {'stageId':lead_stage_id,'collegeId':$("#collegeId").val(),'counsellor_id':$("#CounsellorWiseSource_counsellor_id").val(),'start':$("#CounsellorWiseSource_range1StartDate").val(),'end':$("#CounsellorWiseSource_range1EndDate").val(), 'university_id':$("#CounsellorWiseSource_university_id").val(), 'course_id':$("#CounsellorWiseSource_course_id").val(), 'specialization_id':$("#CounsellorWiseSource_specialization_id").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $("#leadStage_"+lead_stage_id).html("");
        },
        success: function (response) { 
            if(response.substring(2, 7) == "Error") {
                obj = JSON.parse(response);
                if (obj.Error === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else {
                    alert(obj.Error);
                }                
            } else {
                $("#leadStage_"+lead_stage_id).parent().toggleClass('in');
                $("#leadStage_"+lead_stage_id).append(response);
            }
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
function loadApplicationSubStages(application_stage_id) {
    $("#"+application_stage_id).toggleClass("collapsed");
    if($("#applicationStage_"+application_stage_id).children().length > 0 ) {
        $("#applicationStage_"+application_stage_id).parent().toggleClass('in');
        return false;
    }    
     $.ajax({
        url: jsVars.counsellorWiseApplicationSubStages,
        type: 'post',
        data: {'stageId':application_stage_id,'collegeId':$("#collegeId").val(),
            'form_id':$("#CounsellorWiseSource_form_id").val(),
            'start':$("#CounsellorWiseSource_range1StartDate").val(),
            'end':$("#CounsellorWiseSource_range1EndDate").val(),
            'counsellor_id':$("#CounsellorWiseSource_counsellor_id").val(),
            'form_id':$("#CounsellorWiseSource_form_id").val(), 
        },
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $("#applicationStage_"+application_stage_id).html("");
        },
        success: function (response) { 
            if(response.substring(2, 7) == "Error") {
                obj = JSON.parse(response);
                if (obj.Error === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else {
                    alert(obj.Error);
                }                
            }else{
                $("#applicationStage_"+application_stage_id).parent().toggleClass('in');
                $("#applicationStage_"+application_stage_id).append(response);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function GetChildByMachineKey(key,ContainerId){
    if(typeof ContainerId !== "undefined" && $("#"+ContainerId).length){
        $("#"+ContainerId+' option[value!=""]').remove();
        
        //Blank All dropdown Value of Dependent Field
        var getLastValue = 0;
        if(typeof jsVars.dependentDropdownFieldList !== 'undefined') {
            $(jsVars.dependentDropdownFieldList).each(function(key,fieldId){
                
                //if getLastValue > 0 then return from here
                if(getLastValue >0) {
                    return false;
                }
                var isFieldFound = 0;
                $.each(fieldId, function(childKey,childFieldId){
                    
                    //if field match then increase the counter and store the increament value into getLastValue variable
                    if(childFieldId == ContainerId) {
                        isFieldFound++;
                        getLastValue = isFieldFound;
                    }                    
                    if(isFieldFound > 0) {
                        
                        if($('#'+childFieldId).length) {
                            var defaultOption ='<option value="">'+$("#"+childFieldId).data('label')+'</option>';
                            if($('#'+childFieldId).hasClass( "sumo-select" )) {
                                $("#"+childFieldId).find('option[value!=""]').remove();
                                $("#"+childFieldId+".sumo-select")[0].sumo.reload();
                            } else {
                                $("#"+childFieldId).html(defaultOption);
                                
                                if($("#"+childFieldId+'_chosen').length) {
                                    $('.chosen-select').chosen();
                                    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                                    $('.chosen-select').trigger('chosen:updated');
                                }
                            }                            
                        }
                    }
                });
                
            });
        }
        

        var haveChosenClass = false;
        $("#"+ContainerId).find('option[value!=""]').remove();
        if(ContainerId == 'StateId'){
            if($('#DistrictId').length > 0){
                if ($('#DistrictId.chosen-select').length > 0) {
                    haveChosenClass = true;
                }
                $("#DistrictId").find('option[value!=""]').remove();
                if ($("#DistrictId.sumo-select").length > 0){
                    $("#DistrictId.sumo-select")[0].sumo.reload();
                }
            }
            if($('#CityId').length > 0){
                if ($('#CityId.chosen-select').length > 0) {
                    haveChosenClass = true;
                }
                $("#CityId").find('option[value!=""]').remove();
                if ($("#CityId.sumo-select").length > 0){
                    $("#CityId.sumo-select")[0].sumo.reload();
                }
            }
        }
        if(ContainerId == 'DistrictId'){
            if($('#CityId').length > 0){
                if ($('#CityId.chosen-select').length > 0) {
                    haveChosenClass = true;
                }
                $("#CityId").find('option[value!=""]').remove();
                if ($("#CityId.sumo-select").length > 0){
                    $("#CityId.sumo-select")[0].sumo.reload();
                }
            }
        }


        //prevent chosen update for mobile profile page
        if (!haveChosenClass && ($('#'+ContainerId+'.chosen-select').length > 0)) {
            haveChosenClass = true;
        }
        
        if (haveChosenClass && ($('.chosen-select').length > 0)) {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
            $('.chosen-select').trigger('chosen:updated');
        }
        
        if ($('.sumo-select').length > 0){
            if ($("#"+ContainerId+".sumo-select").length > 0){
                $("#"+ContainerId+".sumo-select")[0].sumo.reload();
            }
        }
        if(typeof key !== "undefined" && key !== '')
        {
            var currentFieldName = '';
            if(typeof $('#'+ContainerId).attr('name') !== 'undefined' && $('#'+ContainerId).attr('name') !== '') {
                currentFieldName = $('#'+ContainerId).attr('name');
            }
            
            var postData    = {key:key,'ContainerId':ContainerId, 'fieldName' : currentFieldName};
            if($("#collegeId").length){
                postData['college_id']  = $("#collegeId").val()
            }
            if(ContainerId == 'DistrictId'){
                postData['includeDistricts']  = "1"
            }
            
            if(typeof jsVars.widgetId!='undefined' && jsVars.widgetId!=''){
                postData['widgetId'] = jsVars.widgetId;
            }
            
            $.ajax({
                url: jsVars.GetTaxonomyLink,
                type: 'post',
                dataType: 'json',
                data: postData,
                success: function (json) {
                    if(json['redirect']){
                        location = json['redirect'];
                    }
                    if(json['error']){
                        alertPopup(json['error'],'error');
                    }
                    else if(json['success']){
                        var html='';
                        if(json['CategoryOptions']){
                            html = json['CategoryOptions'];
                        } else {
                            for(var key in json['list'])
                            {
                                html += '<option value="'+key+'">'+json['list'][key]+'</option>';
                            }
                        }
                        if(typeof $("#"+ContainerId).data('label') !== 'undefined'){
                            var defaultOption ='<option value="">'+$("#"+ContainerId).data('label')+'</option>';
                            $("#"+ContainerId).html(defaultOption+html);
                        } else {
                            $("#"+ContainerId).append(html);
                        }
                        
                        if(ContainerId == 'StateId'){
                            $('#StateId').attr('disabled','false');
                            $('#StateId').removeAttr('disabled');
                            if($('#DistrictId').length > 0){
                                if ($('#DistrictId.chosen-select').length > 0) {
                                    haveChosenClass = true;
                                }
                                $("#DistrictId").find('option[value!=""]').remove();
                                if ($("#DistrictId.sumo-select").length > 0){
                                    $("#DistrictId.sumo-select")[0].sumo.reload();
                                }
                            }
                            if($('#CityId').length > 0){
                                if ($('#CityId.chosen-select').length > 0) {
                                    haveChosenClass = true;
                                }
                                $("#CityId").find('option[value!=""]').remove();
                                if ($("#CityId.sumo-select").length > 0){
                                    $("#CityId.sumo-select")[0].sumo.reload();
                                }
                            }
                        }
                        if(ContainerId == 'DistrictId'){
                            $('#DistrictId').attr('disabled','false');
                            $('#DistrictId').removeAttr('disabled');

                            if($('#CityId').length > 0){
                                if ($('#CityId.chosen-select').length > 0) {
                                    haveChosenClass = true;
                                }
                                $("#CityId").find('option[value!=""]').remove();
                                if ($("#CityId.sumo-select").length > 0){
                                    $("#CityId.sumo-select")[0].sumo.reload();
                                }
                            }
                        }
                        if((ContainerId == 'CityId') && ($('#CityId').length > 0)){
                            if ($('#CityId.chosen-select').length > 0) {
                                haveChosenClass = true;
                            }
                            $('#CityId').attr('disabled','false');
                            $('#CityId').removeAttr('disabled');
                        }

                        if (haveChosenClass && ($('.chosen-select').length > 0)) {
                            $('.chosen-select').chosen();
                            $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
                            $('.chosen-select').trigger('chosen:updated');
                        }
                        if ($("#"+ContainerId+".sumo-select").length > 0){
                            $("#"+ContainerId+".sumo-select")[0].sumo.reload();
                        }
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        }
    }
}


