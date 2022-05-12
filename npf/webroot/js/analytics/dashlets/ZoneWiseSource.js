var initilizeZoneWise = function () {
    $("#ZoneWiseSourceDashlet").find(".applyDates").click(function () 
    {
        $("#ZoneWiseSource_range1StartDate").val("");
        $("#ZoneWiseSource_range1EndDate").val("");
        if ($("#ZoneWiseSourceDashlet").find(".inputBaseStartDate").val() !== "" && $("#ZoneWiseSourceDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#ZoneWiseSource_range1StartDate").val($("#ZoneWiseSourceDashlet").find(".inputBaseStartDate").val());
            $("#ZoneWiseSource_range1EndDate").val($("#ZoneWiseSourceDashlet").find(".inputBaseEndDate").val());
        }
        createZoneWiseSourceGraph();
    });
    $("#ZoneWiseSourceDashlet").find(".cancelDates").click(function () {
        $("#ZoneWiseSource_range1StartDate").val("");
        $("#ZoneWiseSource_range1EndDate").val("");
        createZoneWiseSourceGraph();
    });
    createZoneWiseSourceGraph();
};

var createZoneWiseSourceGraph = function () {
    var dashletUrl = $("#ZoneWiseSourceDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#ZoneWiseSource_collegeId").val($("#collegeId").val());
    var filters = $("#ZoneWiseSourceFilterForm").serializeArray();
    $.ajax({
        url: dashletUrl,
        type: 'post',
        data: filters,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
            $('#ZoneWiseSourceDashletHTML .panel-loader').hide();
            $('#ZoneWiseSourceDashletHTML .panel-heading, #ZoneWiseSourceDashletHTML .panel-body').removeClass('pvBlur');
            table_fix_rowcol();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    updateZoneWiseSourceTable(responseObject.data);
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(responseObject.message);
                }
            }
            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

};

function updateZoneWiseSourceTable(dashletData) 
{
    var dateRangeHtml = "(" + dashletData.startDate + " to " + dashletData.endDate + ")";
    if (typeof dashletData.compareStartDate !== "undefined" && typeof dashletData.compareEndDate !== "undefined") {
        dateRangeHtml = dateRangeHtml + " vs (" + dashletData.compareStartDate + " to " + dashletData.compareEndDate + ")";
    }
    $("#ZoneWiseSource_dateRange").html(dateRangeHtml);
    $("#ZoneWiseSource_dateRange_mobile").html(dateRangeHtml);
    $("#ZoneWiseSource_table").html("");
    
    var ver_p = lead_c = app_c = l_to_a = 0; 

    $.each(dashletData.leads, function (key, value) {
       var customClass = '';
       if(key == 'total'){
            return;
           key = 'OverAll';
           customClass = 'fw-500';
       }
        ver_p = (value.lead > 0) ? ((value.verified/value.lead)*100).toLocaleString('en-IN') : 0;
        lead_c = (dashletData.leads.total.lead > 0) ? ((value.lead/dashletData.leads.total.lead)*100).toLocaleString('en-IN') : 0;
        app_c = (dashletData.leads.total.application > 0) ? ((value.application/dashletData.leads.total.application)*100).toLocaleString('en-IN') : 0;
        l_to_a = (value.lead > 0) ? ((value.application/value.lead)*100).toLocaleString('en-IN') : 0;

       $("#ZoneWiseSource_table").append("<tr>\n\
        <td class='fw-500 text-left colGroup1'>" + key + "</td>\n\
        <td class='text-center colGroup2 "+customClass+"'>" + value.lead.toLocaleString('en-IN') + "</td>\n\
        <td class='text-center colGroup2 "+customClass+"'>" + parseFloat(ver_p).toFixed(2) + " %</td>\n\
        <td class='text-center colGroup2 "+customClass+"'>" + parseFloat(lead_c).toFixed(2) + " %</td>\n\
        <td class='text-center colGroup2 "+customClass+"'>" + value.application.toLocaleString('en-IN') + "</td>\n\
        <td class='text-center colGroup2 "+customClass+"'>" + parseFloat(app_c).toFixed(2) + " %</td>\n\
        <td class='text-center colGroup2 "+customClass+"'>" + parseFloat(l_to_a).toFixed(2) + " %</td>\n\
        <td class='text-center colGroup2 "+customClass+"'>" + value.enrollment.toLocaleString('en-IN') + "</td>\n\
        </tr>");
   });
    
    if($("#ZoneWiseSource_ap_button").hasClass("open"))
    {
        $(".ZoneWiseSource_ap_button").trigger("click");
    }
}

    function ZoneWiseSource_downloadCSV() {
        $("#ZoneWiseSourceFilterForm").submit();
    }

    function resetZoneWiseSourceFilterForm() {
        $("#ZoneWiseSourceFilterForm").find('select.dashletFilter').each(function () {
            $(this).val('');
        });
        $('.chosen-select').trigger('chosen:updated');
    }

    function GetChildByMachineKeyForZoneWiseDashlet(key,ContainerId){
    if(typeof ContainerId !== "undefined" && $("#"+ContainerId).length){
        $("#"+ContainerId+' option[value!=""]').remove();
        $('#ZoneWiseSource_specialization_id option[value!=""]').remove();
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
        

        var haveChosenClass = true;
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
