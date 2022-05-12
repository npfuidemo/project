var initilizeStateWise = function () {
    $("#StateWiseSourceDashlet").find(".applyDates").click(function () 
    {
        $("#StateWiseSource_range1StartDate").val("");
        $("#StateWiseSource_range1EndDate").val("");
        if ($("#StateWiseSourceDashlet").find(".inputBaseStartDate").val() !== "" && $("#StateWiseSourceDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#StateWiseSource_range1StartDate").val($("#StateWiseSourceDashlet").find(".inputBaseStartDate").val());
            $("#StateWiseSource_range1EndDate").val($("#StateWiseSourceDashlet").find(".inputBaseEndDate").val());
        }
        createStateWiseSourceGraph();
    });
    $("#StateWiseSourceDashlet").find(".cancelDates").click(function () {
        $("#StateWiseSource_range1StartDate").val("");
        $("#StateWiseSource_range1EndDate").val("");
        createStateWiseSourceGraph();
    });
    createStateWiseSourceGraph();
};

var createStateWiseSourceGraph = function () {
    var dashletUrl = $("#StateWiseSourceDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#StateWiseSource_collegeId").val($("#collegeId").val());
    var filters = $("#StateWiseSourceFilterForm").serializeArray();
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
            $('#StateWiseSourceDashletHTML .panel-loader').hide();
            $('#StateWiseSourceDashletHTML .panel-heading, #StateWiseSourceDashletHTML .panel-body').removeClass('pvBlur');
            table_fix_rowcol();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    updateStateWiseSourceTable(responseObject.data);
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

function updateStateWiseSourceTable(dashletData) 
{
    var dateRangeHtml = "(" + dashletData.startDate + " to " + dashletData.endDate + ")";
    if (typeof dashletData.compareStartDate !== "undefined" && typeof dashletData.compareEndDate !== "undefined") {
        dateRangeHtml = dateRangeHtml + " vs (" + dashletData.compareStartDate + " to " + dashletData.compareEndDate + ")";
    }
    $("#StateWiseSource_dateRange").html(dateRangeHtml);
    $("#StateWiseSource_dateRange_mobile").html(dateRangeHtml);
    $("#StateWiseSource_table").html("");
    $.each(dashletData.leads, function (key, value) {
       var customClass = '';
       if(key == 'total'){
           key = 'Over All';
           customClass = 'fw-500';
       }
       $("#StateWiseSource_table").append("<tr>\n\
        <td class='fw-500 text-left colGroup1'>" + key + "</td>\n\
        <td class='text-center colGroup2 "+customClass+"'>" + value.lead.toLocaleString('en-IN') + "</td>\n\
        <td class='text-center colGroup2 "+customClass+"'>" + value.verified.toLocaleString('en-IN') + " %</td>\n\
        <td class='text-center colGroup2 "+customClass+"'>" + value.lead_contri.toLocaleString('en-IN') + " %</td>\n\
        <td class='text-center colGroup2 "+customClass+"'>" + value.application.toLocaleString('en-IN') + "</td>\n\
        <td class='text-center colGroup2 "+customClass+"'>" + value.application_contri.toLocaleString('en-IN') + " %</td>\n\
        <td class='text-center colGroup2 "+customClass+"'>" + value.leadtoapplication.toLocaleString('en-IN') + " %</td>\n\
        <td class='text-center colGroup2 "+customClass+"'>" + value.enrollment.toLocaleString('en-IN') + "</td>\n\
        </tr>");
   });
    if($("#StateWiseSource_ap_button").hasClass("open"))
    {
        $(".StateWiseSource_ap_button").trigger("click");
    }
}

    function StateWiseSource_downloadCSV() {
        $("#StateWiseSourceFilterForm").submit();
    }

    function resetStateWiseSourceFilterForm() {
        $("#StateWiseSourceFilterForm").find('select.dashletFilter').each(function () {
            $("#specialization_id option[value!='']").remove();
            $(this).val('');
        });
        $('.chosen-select').trigger('chosen:updated');
    }

    function GetChildByMachineKeyForStateWiseDashlet(key,ContainerId){
        if(typeof ContainerId !== "undefined" && $("#"+ContainerId).length){
            $("#"+ContainerId+' option[value!=""]').remove();
            $('#StateWiseSource_specialization_id option[value!=""]').remove();   
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

function sortStateWise(span_caret){
    var $this = $(span_caret)
    jQuery("span.sorting_span i").removeClass('active');
    var field = jQuery($this).data('column');
    var data_sorting = jQuery($this).data('sorting');
    $('#StateWiseSource_SortOption').val(field+"|"+data_sorting);
    jQuery($this).addClass('active');
    createStateWiseSourceGraph();
}