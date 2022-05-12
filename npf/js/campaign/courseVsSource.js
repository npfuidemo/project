$(document).ready(function(){
    $(".chosen-select").chosen();
    //Set Width dynamically to all select box where .default class is found
    $(".loader-block").hide();
    if($("#college_id").val()!=''){
        //get lead stages for filter
        getCollegeLeadStages($("#college_id").val());
    
        applyCourseVsSourceFilter();
    }
    $(document).on('click', 'span.sorting_span i', function () {
        var sortField   = jQuery(this).data('column');
        var sortOrder   = jQuery(this).data('sorting');
        loadCourseVsSourceDetails(sortField,sortOrder);
    });
    loadReportDateRangepicker();
});

function applyCourseVsSourceFilter() {
    $("#parent_dimension_field_value").val('');
    $("#listingHeadersList").val('');
    loadCourseVsSourceDetails();
}

function loadCourseVsSourceDetails(sortField,sortOrder, parentRowNo){
    if(typeof sortField==="undefined"||sortField===null){
        sortField   = '';
    }
    if(typeof sortOrder==="undefined"||sortOrder===null){
        sortOrder   = '';
    }
    if(typeof parentRowNo==="undefined"||parentRowNo===null){
        parentRowNo   = '';
    }
    
    $("#tableHtmlForm input[name='sortOrder']").val(sortOrder);
    $("#tableHtmlForm input[name='sortOrder']").val(sortOrder);
    var parentDimensionFieldValue = $("#parent_dimension_field_value").val();
    var data = {
        collegeId   : $("#college_id").val(),
        filter_field    : $("#filter_field").val(),
        parent_dimension_field  : $("#parent_dimension_field").val(),
        parent_dimension_field_value  : parentDimensionFieldValue,
        child_dimension_field   : $("#child_dimension_field").val(),
        parent_field_label  : $("#parent_field_label").val(),
        child_field_label   : $("#child_field_label").val(),
        sortField   : sortField,
        sortOrder   : sortOrder
    };
    
    if($("#dateRange").length){
        data['dateRange']  = $("#dateRange").val();
        $("#tableHtmlForm input[name='dateRange']").val($("#dateRange").val());
    }
    
    if($("#filter_application_status").length){
        data['filter_application_status']  = $("#filter_application_status").val();
        $("#tableHtmlForm input[name='filter_application_status']").val($("#filter_application_status").val());
    }
    
    if($("select#leadStages").length){
        data['leadStages']  = $("select#leadStages option:selected").val();
        $("#tableHtmlForm input[name='leadStages']").val($("#leadStages").val());
    }
    
    if($("#filter_field_value").length){
        data['filter_field_value']  = $("#filter_field_value").val();
        $("#tableHtmlForm input[name='filter_field_value']").val($("#filter_field_value").val());
    }
    
    if($("#listingHeadersList").val() !== ''){
        data['header_list']  = $("#listingHeadersList").val();
    }
    
    if(parentRowNo !== ''){
        data['parent_row_no']  = parentRowNo;
    }
    
    $.ajax({
        url: jsVars.loadCourseVsSourceDetailsLink,
        type: 'post',
        dataType: 'html',
        data: data,
        async: true,
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
			//table_fix_rowcol();
            $('.offCanvasModal').modal('hide');
        },
        success: function (html) { 
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                 location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (checkError === 'ERROR:'){
                 alert(html.substring(6, html.length));
            } else {                
                if (parentDimensionFieldValue !== '') {
                    //remove old child listing
                    removeChildData(parentRowNo);
                    //add new child listing
                    $('#courseVsSourceSection tr#parent' + parentRowNo).after(html);
                    table_fix_rowcol();
                } else {
                    $("#tableDiv").show();
                    html = html.replace("<head/>", "");
                    $('#courseVsSourceSection').html(html);
                    table_fix_rowcol();
                    $('.arwAbsRight').click(function(){
                            $(this).hide();
                            $(this).siblings().show();
                    });
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function downloadTable(type){
    $("#tableHtmlForm input[name='downloadtype']").val(type);
    $("#tableHtmlForm").submit();
}


function loadChildData(parent, parentRowNo) {
    if ((typeof parent !== 'undefined') && (parent !== '')) {
        $("#parent_dimension_field_value").val(parent);
        loadCourseVsSourceDetails(null, null, parentRowNo);
    }
}

//remove old child listing
function removeChildData(parentRowNo) {
    if ((typeof parentRowNo !== 'undefined') && (parentRowNo !== '')) {        
        $('#courseVsSourceSection tr#child' + parentRowNo).remove();
    }
}

function getCollegeLeadStages(collegeId) {
    if(collegeId < 0) {
        return;
    }
    
    data = {
        "collegeId" : collegeId,
        "moduleName": "lead",
        "userId": jsVars.userId
    };
    
    $.ajax({
        url: "/counsellors/get-lead-stages",
        type: 'post',
        dataType: 'json',
        data: data,
        async: true,
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
        },
        success: function (resultData) { 
            console.log(resultData);
            
            if(resultData['status'] == '1') {
                var leadStages = resultData['data']['stageList'];
                var stagesHtml   = '';
                stagesHtml += '<option value="">Select Lead Stage</option>';
                stagesHtml += '<option value="0">Untouched</option>';
                if(leadStages !== '') {
                    $.each(leadStages, function (index, item) {
                        stagesHtml += '<option value="'+index+'">'+item+'</option>';
                    });
                }
                $("select#leadStages").html(stagesHtml);
                $("select#leadStages").trigger('chosen:updated');
            }
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}