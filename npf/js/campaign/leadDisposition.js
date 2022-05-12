$(document).ready(function(){
	$('[data-toggle="popover"]').popover();
    loadReportDateRangepicker();
    if($("#college_id").val()!==""){
        intializeDisposition();
    }
    if($('#dateRangeDisposition').length > 0){
        /*$('#dateRangeDisposition').on('apply.daterangepicker', function (ev, picker) {
           $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
           searchDispositionDetails('again');
       });
       $('#dateRangeDisposition').on('cancel.daterangepicker', function (ev, picker) {
            $(this).val('');
           searchDispositionDetails('again');
       });*/
    }
    $(document).on('click', 'span.sorting_span i', function () {
        var sortField   = jQuery(this).data('column');
        var sortOrder   = jQuery(this).data('sorting');
        searchDispositionDetails('',sortField,sortOrder);
    });
    $('#resetButton').on('click', function () {
        $('#UniversityId').html('');
        $('#UniversityId')[0].sumo.reload();
        $('#CourseId').html('');
        $('#CourseId')[0].sumo.reload();
        $('#SpecializationId').html('');
        $('#SpecializationId')[0].sumo.reload();
        $('#dateRangeDisposition').val('');
        getDispositionflter($("#college_id").val());
        setTimeout(function(){
            $('#lead_stage').val('');
            $('#lead_stage')[0].sumo.reload();
            $('#lead_channel').val('');
            $('#lead_channel')[0].sumo.reload();
        }, 200);
    });
    $(document).on('click','a.linkTable', function() {
        var action = '';
        if($(this).hasClass('lmLink')) {
            action += jsVars.lmLink;
        } else {
            action += jsVars.amLink;
        }
        $('#linkForm').prop('action',action);
        $('#linkForm #hash_filters').val($(this).data('hash'));
        $('#linkForm').submit();
        $('#linkForm #hash_filters').val('');
    });
});
$(document).ajaxComplete(function() {
    $('[data-toggle="popover"]').popover();
});
function intializeDisposition(){
    if($("#college_id").val()==""){
        $('#CampaignManagerDispositionSection').html("<table class='table'><tr><td><h4 class='text-center text-danger'> Please select a institute name to view campaign details.</h4></td></tr></table></div>");
        return;
    }
    getDispositionflter($("#college_id").val());
    searchDispositionDetails();
    showHideCourseVsSource();
}

function showHideCourseVsSource(){
    if($("#college_id").val()==''){
        $("#courseVsSourceTab").hide();
        return;
    }
     $.ajax({
        url: jsVars.getCourseVsSourceLabelLink,
        type: 'post',
        data: {'collegeId':$("#college_id").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $("#courseVsSourceTab").hide();
            $('#campaignListLoader.sectionLoader').show();
        },
        complete: function () {
            $('#campaignListLoader.sectionLoader').hide();
        },
        success: function (response) { 
            var responseObject = $.parseJSON(response); 
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                if(responseObject.data['parentFieldLabel']!==''){
                    $("#courseVsSourceTab").show();
                    $("#courseVsSourceTitle").html( responseObject.data['parentFieldLabel'] );
                }
            }else{
                console.log(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function searchDispositionDetails(type,sortField,sortOrder){
    if(typeof type=='undefined'){
        var type='';
    }
    if(typeof sortField==="undefined"||sortField===null){
        sortField   = '';
    }
    if(typeof sortOrder==="undefined"||sortOrder===null){
        sortOrder   = '';
    }
    $("#sortField").val(sortField);
    $("#sortOrder").val(sortOrder);
    
    if($("#lead_channel").val()==null || $("#lead_channel").val()==''){
        $("#CampaignManagerDispositionSection").html("<table class='table'><tr><td><h4 class='text-center text-danger'>Please select at least one channel.</h4></td></tr></table>");
        return false;
    }
    if($("#lead_stage").val()==null || $("#lead_stage").val()==''){
        $("#CampaignManagerDispositionSection").html("<table class='table'><tr><td><h4 class='text-center text-danger'>Please select at least one stage.</h4></div></div></td></tr></table>");
        return false;
    }
    $.ajax({
        url: jsVars.loadCampaignDispositionLink,
        type: 'post',
        data: {'lead_stage':$("#lead_stage").val(),'lead_channel':$("#lead_channel").val(),'collegeId':$("#college_id").val(),
            'university_id': $('#UniversityId').val(), 'course_id': $('#CourseId').val(), 'specialization_id': $('#SpecializationId').val(),
            'dateRange':$("#dateRangeDisposition").val(),sortField:sortField,sortOrder:sortOrder},
        dataType: 'html',
        async : true,
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#campaignListLoader.loader-block').show();
        },
        complete: function () {
            $('#campaignListLoader.loader-block').hide();
        },
        success: function (html) { 
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
            }else{
                if(html== '') {
                    $('#divDownload').hide();
                } else {
                    $('#divDownload').show();
                }
                $("#tabsDisposition").show();
                $('#lead_stage').SumoSelect({locale : ['Apply', 'Cancel', 'Select All'], selectAll:true, okCancelInMulti: false, placeholder: 'Select Stage', search: true, searchText:'Select Stage'});
                $('#lead_channel').SumoSelect({locale : ['Apply', 'Cancel', 'Select All'], selectAll:true, okCancelInMulti: false, placeholder: 'Select Channel', search: true, searchText:'Select Channel'});
                $("#CampaignManagerDispositionSection").html(html);
            }
            //table_fix_rowcol();
            if(type!='again'){
                $(".sumo_lead_channel p.btnOk").click(function(){
                    searchDispositionDetails('again');
                });
                $(".sumo_lead_stage p.btnOk").click(function(){
                    searchDispositionDetails('again');
                });
            }
			$('.offCanvasModal').modal('hide');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getDispositionflter(cid){
    $.ajax({
        url: jsVars.loadDispositionFilterLink,
        type: 'post',
        data: {'collegeId':cid},
        dataType: 'json',
        async : false,
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#campaignListLoader.loader-block').show();
        },
        complete: function () {
            $('#campaignListLoader.loader-block').hide();
        },
        success: function (responseObject) {
            //var responseObject = $.parseJSON(json);
            if(typeof responseObject.leadStages=='object'){
                $('#lead_stage').SumoSelect({okCancelInMulti:false, floatWidth:300,forceCustomRendering:true, search: true, searchText:'Search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
                //$('#lead_stage').SumoSelect({locale : ['Apply', 'Cancel', 'Select All'], selectAll:true, okCancelInMulti: true, placeholder: 'Select Stateges', search: true, searchText:'Select Stages'});
                var stageOptions = '';
                $.each(responseObject.leadStages, function (index, item) {
                    stageOptions += '<option value="'+index+'" selected>'+item+'</option>';
                });
                $('#lead_stage').html(stageOptions);
                $('select#lead_stage')[0].sumo.reload();
            }
            if(typeof responseObject.leadChannel=='object'){
                $('#lead_channel').SumoSelect({okCancelInMulti:false,floatWidth:300,forceCustomRendering:true, search: true, searchText:'Search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
              
                //$('#lead_channel').SumoSelect({locale : ['Apply', 'Cancel', 'Select All'], selectAll:true, okCancelInMulti: true, placeholder: 'Select Stateges', search: true, searchText:'Select Stages'});
                var channelOptions = '';
                $.each(responseObject.leadChannel, function (index, item) {
                    index = index.replace('traffic_channel_', '');
                    channelOptions += '<option value="'+index+'" selected>'+item+'</option>';
                });

                $('#lead_channel').html(channelOptions);
                $('select#lead_channel')[0].sumo.reload();
            }
            var showCourse = showSpecialization = false;
            if ((typeof responseObject.course_id.list == 'object' && Object.keys(responseObject.course_id.list).length > 0) ||
                    (typeof responseObject.onChangeUniversityId != 'undefined' && responseObject.onChangeUniversityId != '')) {
                showCourse = true;
            }
            if ((typeof responseObject.specialization_id.list == 'object' && Object.keys(responseObject.specialization_id.list).length > 0) ||
                    (typeof responseObject.onChangeCourse != 'undefined' && responseObject.onChangeCourse != '')) {
                showSpecialization = true;
            }
            if (typeof responseObject.university_id == 'object') {
                $('#UniversityId').SumoSelect({okCancelInMulti: false, floatWidth: 300, forceCustomRendering: true, search: true, searchText: 'Search '+responseObject.university_id.name, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false, placeholder: 'Select '+responseObject.university_id.name});
                if (typeof responseObject.university_id.list == 'object' && Object.keys(responseObject.university_id.list).length > 0) {
                    var universityOptions = '<option value="0">Not Available</option>';
                    $.each(responseObject.university_id.list, function (index, item) {
                        universityOptions += '<option value="' + index + '">' + item + '</option>';
                    });
                    $('#UniversityId').html(universityOptions);
                    $('#UniversityId')[0].sumo.reload();
                    if($('#graph_university_id_container').hasClass('display-none'))   $('#graph_university_id_container').removeClass('display-none');
                } else {
                    if(!$('#graph_university_id_container').hasClass('display-none'))   $('#graph_university_id_container').addClass('display-none');
                }
                if (typeof responseObject.onChangeUniversityId != 'undefined' && responseObject.onChangeUniversityId != '') {
                    $('select#UniversityId').on('change', function () {
                        GetChildByMachineKey('UniversityId', "CourseId");
                    });
                }
            }
            if (typeof responseObject.course_id == 'object') {
                $('#CourseId').SumoSelect({okCancelInMulti: false, floatWidth: 300, forceCustomRendering: true, search: true, searchText: 'Search '+responseObject.course_id.name, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false, placeholder:'Select '+responseObject.course_id.name});
                if (typeof responseObject.course_id.list == 'object' && Object.keys(responseObject.course_id.list).length > 0) {
                    var courseOptions = '<option value="0">Not Available</option>';
                    $.each(responseObject.course_id.list, function (index, item) {
                        courseOptions += '<option value="' + index + '">' + item + '</option>';
                    });
                    $('#CourseId').html(courseOptions);
                    $('#CourseId')[0].sumo.reload();
                    if($('#graph_course_id_container').hasClass('display-none'))   $('#graph_course_id_container').removeClass('display-none');
                } else {
                    if(showCourse == true) {
                        if($('#graph_course_id_container').hasClass('display-none')) $('#graph_course_id_container').removeClass('display-none');
                    } else {
                        if(!$('#graph_course_id_container').hasClass('display-none')) $('#graph_course_id_container').addClass('display-none');
                    }
                }
                if (typeof responseObject.onChangeCourse != 'undefined' && responseObject.onChangeCourse != '') {
                    $('select#CourseId').on('change', function () {
                        GetChildByMachineKey('CourseId', 'SpecializationId');
                    });
                }
            }
            if (typeof responseObject.specialization_id == 'object') {
                $('#SpecializationId').SumoSelect({okCancelInMulti: false, floatWidth: 300, forceCustomRendering: true, search: true, searchText: 'Search '+responseObject.specialization_id.name, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false, placeholder:'Select '+responseObject.specialization_id.name});
                if (typeof responseObject.specialization_id.list == 'object' && Object.keys(responseObject.specialization_id.list).length > 0) {
                    var specializationOptions = '<option value="0">Not Available</option>';
                    $.each(responseObject.specialization_id.list, function (index, item) {
                        specializationOptions += '<option value="' + index + '">' + item + '</option>';
                    });
                    $('#SpecializationId').html(specializationOptions);
                    $('#SpecializationId')[0].sumo.reload();
                    if($('#graph_specialization_id_container').hasClass('display-none'))   $('#graph_specialization_id_container').removeClass('display-none');
                } else {
                    if(showSpecialization == true) {
                        if($('#graph_specialization_id_container').hasClass('display-none'))   $('#graph_specialization_id_container').removeClass('display-none');
                    } else {
                        if(!$('#graph_specialization_id_container').hasClass('display-none'))   $('#graph_specialization_id_container').addClass('display-none');
                    }
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function downloadDispositionTable(type){
    $("#collgeSelected").val($("#college_id").val());
    $("#dateSelected").val($("#dateRangeDisposition").val());
    if( $("#downloadtype").length ){
        $("#downloadtype").val(type);
    }else{
        $("#tableHtmlForm").append($("<input>").attr({"value":type, "name":"downloadtype",'type':"hidden","id":"downloadtype"}));
    }
    $("#leadStagesSelected").val($("#lead_stage").val());
    $("#leadChannelSelected").val($("#lead_channel").val());
    $("#universityIdsSelected").val(JSON.stringify($("#UniversityId").val()));
    $("#courseIdsSelected").val(JSON.stringify($("#CourseId").val()));
    $("#specializationIdsSelected").val(JSON.stringify($("#SpecializationId").val()));
    $("#tableHtmlForm").submit();
}

function GetChildByMachineKey(key,ContainerId){
    if(typeof ContainerId !== "undefined" && $("#"+ContainerId).length){
        //Blank All dropdown Value of Dependent Field
        if(key == 'UniversityId'){
            if($('#CourseId').length > 0) {
                $('#CourseId').empty();
                $("#CourseId.sumo-select")[0].sumo.reload();
            }
            if($('#SpecializationId').length > 0) {
                $('#SpecializationId').empty();
                $("#SpecializationId.sumo-select")[0].sumo.reload();
            }
        }
        if(key == 'CourseId'){
            if($('#SpecializationId').length > 0) {
                $('#SpecializationId').empty();
                $("#SpecializationId.sumo-select")[0].sumo.reload();
            }
        }

        if(typeof key !== "undefined" && key !== '') {
            var keyName = '';
            if(key == 'UniversityId') {
                keyName = 'ud|university_id';
            } else if(key == 'CourseId') {
                keyName = 'ud|course_id';
            }

            var postData = {'collegeId':$('#college_id').val(), 'find_value_type' : 'next', 'current_field' : keyName};
            postData[keyName] = $('#'+key).val();
            $.ajax({
                url: '/users/get-check-dependent-field',
                type: 'post',
                dataType: 'json',
                data: postData,
                headers: {
                    "X-CSRF-Token": jsVars.csrfToken
                },
                success: function (json) {
                    if(json['redirect']) {
                        location = json['redirect'];
                    }
                    if(json['error']){
                        alertPopup(json['error'],'error');
                    }
                    else if(json['success']){
                        var html = '<option value="0">Not Available</option>';
                        if(json['option']){
                            for(var key in json['option']) {
                                html += '<option value="'+key+';;;'+json['option'][key]+'">'+json['option'][key]+'</option>';
                            }
                        }
                        $("#"+ContainerId).html(html);
                        $("#"+ContainerId)[0].sumo.reload();
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        }
    }
}
