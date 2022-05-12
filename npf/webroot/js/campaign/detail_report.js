
var loaderCount=0;

$(document).ready(function(){
    LoadReportDateRangepicker();
    $('#detailReportLoader.loader-block').hide();
    $("#instance_type").change(changeInstanceType);
    $("#source").change(changeSource);
    $("#medium").change(changeMedium);
    loadListing('reset');
    loadSummary();
    changeInstanceType();
    $(document).on('click', 'span.sorting_span i', function () {
        $("#sortField").val(jQuery(this).data('column'));
        $("#sortOrder").val(jQuery(this).data('sorting'));
        loadListing('reset');
    });

    $(document).on('keyup','#change_campaign_publisher_chosen input',function(evt){
        if($.trim($(this).val()).length>2){
            $("#change_campaign_publisher_chosen").find("ul").show();
        }else{
            $("#change_campaign_publisher_chosen").find("ul").hide();
        }
    });
});

function loadSummary(){
    $.ajax({
        url: jsVars.campaignSummaryLink, 
        type: 'post',
        data:  $("#filterTrackCampaignForm").serialize(),
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $('#detailReportLoader.loader-block').show();
            loaderCount++;
        },
        complete: function () {
            loaderCount--;
            if(loaderCount==0){
                $('.offCanvasModal').modal('hide');
                $('#detailReportLoader.loader-block').hide();
            }
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    $("#totalPrimaryRegistrations").html(responseObject.data.primaryLeads);
                    $("#totalSecondaryRegistrations").html(responseObject.data.secondaryLeads);
                    $("#totalTertiaryRegistrations").html(responseObject.data.tertiaryLeads);
                    $("#totalRegistrations").html(responseObject.data.totalLeads);
                    $("#totalVerifiedRegistrations").html(responseObject.data.verifiedLeads);
                    $("#totalUnverifiedRegistrations").html(responseObject.data.unverifiedLeads);
                    if($("#totalApplications").length){
                        $("#totalApplications").html(responseObject.data.applications);
                        $("#totalSubmittedApplications").html(responseObject.data.submittedApplications);
                    }
                    if($("#totalEnrollment").length){
                        $('#totalEnrollment').html(responseObject.data.enrollments);
                    }
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
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

var downloadDetailReportFile = function(url){
    window.open(url, "_self");
};

function exportDetailReportCsv(){
    $.ajax({
        url: jsVars.exportDetailReportCsvLink, 
        type: 'post',
        data:  $("#filterTrackCampaignForm").serialize(),
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $('#detailReportLoader.loader-block').show();
            loaderCount++;
        },
        complete: function () {
            loaderCount--;
            if(loaderCount==0){
                $('#detailReportLoader.loader-block').hide();
            }
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data.url !== "undefined") {
                    downloadDetailReportFile(responseObject.data.url);
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
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function loadListing(listingType){
    if(listingType === 'reset'){
        $("#page").val(1);
    }
    $.ajax({
        url: jsVars.campaignListingLink,
        type: 'post',
        data:  $("#filterTrackCampaignForm").serialize(),
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#detailReportLoader.loader-block').show();
            loaderCount++;
        },
        complete: function () {
            loaderCount--;
            if(loaderCount==0){
                $('#detailReportLoader.loader-block').hide();
                $('.offCanvasModal').modal('hide');
            }
        },
        success: function (html) {            
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
                $('#LoadMoreArea').hide();
            }else{
                var countRecord = countResult(html);
                html    = html.replace("<head/>", "");
                if(listingType === 'reset'){
                    $('#detailReportContainerSection').html(html);
                }else{
                    $('#detailReportContainerSection').find("tbody").append(html);
                }
                if(countRecord < 10){
                    $('#LoadMoreArea').hide();
                }else{
                    $('#LoadMoreArea').show();
                }
                $("#page").val(parseInt($("#page").val())+1);
                $(".campaign-publisher").change(updatePublisherConfirmation);
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                
                if($("#select_all").prop('checked') === true){
                    $('.select_field').not(".disable-check").each(function(){
                        this.checked = true;
                    });
                }
                
            }
            //table_fix_rowcol();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
};

function changeInstanceType(){
    var source      = '<select id="source" class="chosen-select" tabindex="-1" name="campaignSource"><option selected="selected" value="">Source</option></select>';
    $('#sourceDiv').html(source);
    var medium      = '<select id="medium" class="chosen-select" tabindex="-1" name="campaignMedium"><option selected="selected" value="">Medium</option></select>';
    $('#mediumDiv').html(medium);
    var name    = '<select tabindex="-1" class="chosen-select" id="name"  name="campaignName"><option value="">Campaign Name</option></select>';
    $('#campaignNameDiv').html(name);
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    $('#detailReportLoader.loader-block').hide();
    var instanceType    = $("#instance_type").val();
    var collegeId       = $("#collegeId").val();
    var publisherId     = $("#publisherId").val();
    var trafficChannel  = $("#trafficChannel").val();
    $.ajax({
        url: jsVars.getFiltersLink,
        type: 'post',
        data: {'collegeId' : collegeId,'publisherId' : publisherId, trafficChannel:trafficChannel, 'instanceType':instanceType},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#detailReportLoader.loader-block').show();
        },
        complete: function () {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('#detailReportLoader.loader-block').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    if(typeof responseObject.data.sourceList === "object"){
                        var sourceList    = responseObject.data.sourceList;
                        var value   = '<select id="source" class="chosen-select" tabindex="-1" name="campaignSource" style="display: none;"><option selected="selected" value="">Source</option>';
                        $.each(sourceList, function (index, item) {
                            value += '<option value="'+index+'">'+item+'</option>';
                        });
                        value += '</select>';
                        $('#sourceDiv').html(value);
                        $("#source").change(changeSource);
                    }
                    if(typeof responseObject.data.mediumList === "object"){
                        var mediumList    = responseObject.data.mediumList;
                        var value   = '<select id="medium" class="chosen-select" tabindex="-1" name="campaignMedium" style="display: none;"><option selected="selected" value="">Medium</option>';
                        $.each(mediumList, function (index, item) {
                            value += '<option value="'+index+'">'+item+'</option>';
                        });
                        value += '</select>';
                        $('#mediumDiv').html(value);
                        $("#medium").change(changeMedium);
                    }
                    if(typeof responseObject.data.campaignNameList === "object"){
                        var campaignNameList    = responseObject.data.campaignNameList;
                        var value   = '<select id="name" class="chosen-select" tabindex="-1" name="campaignName" style="display: none;"><option selected="selected" value="">Campaign Name</option>';
                        $.each(campaignNameList, function (index, item) {
                            value += '<option value="'+index+'">'+item+'</option>';
                        });
                        value += '</select>';
                        $('#campaignNameDiv').html(value);
                    }
                }
            }else{
                alert(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function changeSource(){
    var medium      = '<select id="medium" class="chosen-select" tabindex="-1" name="campaignMedium"><option selected="selected" value="">Medium</option></select>';
    $('#mediumDiv').html(medium);
    var name    = '<select tabindex="-1" class="chosen-select" id="name"  name="campaignName"><option value="">name Name</option></select>';
    $('#campaignNameDiv').html(name);
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    $('#detailReportLoader.loader-block').hide();
    var collegeId       = $("#collegeId").val();
    var publisherId     = $("#publisherId").val();
    var instanceType    = $("#instance_type").val();
    var trafficChannel  = $("#trafficChannel").val();
    var source          = $("#source").val();
    $.ajax({
        url: jsVars.getFiltersLink,
        type: 'post',
        data: {'collegeId' : collegeId,'publisherId' : publisherId, trafficChannel:trafficChannel, 'instanceType':instanceType, 'source':source},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#detailReportLoader.loader-block').show();
        },
        complete: function () {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('#detailReportLoader.loader-block').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    if(typeof responseObject.data.mediumList === "object"){
                        var mediumList    = responseObject.data.mediumList;
                        var value   = '<select id="medium" class="chosen-select" tabindex="-1" name="campaignMedium" style="display: none;"><option selected="selected" value="">Medium</option>';
                        $.each(mediumList, function (index, item) {
                            value += '<option value="'+index+'">'+item+'</option>';
                        });
                        value += '</select>';
                        $('#mediumDiv').html(value);
                        $("#medium").change(changeMedium);
                    }
                }
                if(typeof responseObject.data === "object"){
                    if(typeof responseObject.data.campaignNameList === "object"){
                        var campaignNameList    = responseObject.data.campaignNameList;
                        var value   = '<select id="name" class="chosen-select" tabindex="-1" name="campaignName" style="display: none;"><option selected="selected" value="">Campaign Name</option>';
                        $.each(campaignNameList, function (index, item) {
                            value += '<option value="'+index+'">'+item+'</option>';
                        });
                        value += '</select>';
                        $('#campaignNameDiv').html(value);
                    }
                }
            }else{
                alert(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function changeMedium(){
    var name    = '<select tabindex="-1" class="chosen-select" id="name"  name="campaignName"><option value="">Campaign Name</option></select>';
    $('#campaignNameDiv').html(name);
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    $('#detailReportLoader.loader-block').hide();
    var collegeId       = $("#collegeId").val();
    var publisherId     = $("#publisherId").val();
    var instanceType    = $("#instance_type").val();
    var trafficChannel  = $("#trafficChannel").val();
    var source          = $("#source").val();
    var medium          = $("#medium").val();
    $.ajax({
        url: jsVars.getFiltersLink,
        type: 'post',
        data: {'collegeId' : collegeId,'publisherId' : publisherId, trafficChannel:trafficChannel, 'instanceType':instanceType, 'source':source, 'medium':medium},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#detailReportLoader.loader-block').show();
        },
        complete: function () {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('#detailReportLoader.loader-block').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    if(typeof responseObject.data.campaignNameList === "object"){
                        var campaignNameList    = responseObject.data.campaignNameList;
                        var value   = '<select id="name" class="chosen-select" tabindex="-1" name="campaignName" style="display: none;"><option selected="selected" value="">Campaign Name</option>';
                        $.each(campaignNameList, function (index, item) {
                            value += '<option value="'+index+'">'+item+'</option>';
                        });
                        value += '</select>';
                        $('#campaignNameDiv').html(value);
                    }
                }
            }else{
                alert(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function countResult(html){
    var len = (html.match(/listDataRow/g) || []).length;
    return len;
}

function updatePublisherConfirmation( ){
    var campaign            = $(this).parent("td").find(".campaignId").val();
    var mappedPublisherId    = $(this).parent("td").find(".mappedPublisherId").val();
    var newPublisherId = $(this).val();
    $(this).val(mappedPublisherId).trigger("chosen:updated");;
    var option  = $(this).find("option[value='"+newPublisherId+"']").html();
    $("#ConfirmPopupArea").modal('show');
    $("#ConfirmPopupArea p#ConfirmMsgBody").text('Do you want to map campaign with publisher '+option+' ?');
    $('#SuccessPopupArea p#MsgBody').text('Publisher detail has been updated..');
    $("#ConfirmPopupArea a#confirmYes").attr("onclick", 'updatePublisher('+campaign+','+newPublisherId+',1);');
}

function updatePublisher (){
    var newTrafficChannel = $('#change_traffic_channel').val();
    var newPublisherId = $('#change_campaign_publisher').val();
    var campaign  = $('#change_campaign_id').val();
    var collegeId  = $('#collegeId').val();

    $.ajax({
        url: jsVars.mapCampaignToPublisherLink,
        type: 'post',
        data: {'publisherId' : $("#publisherId").val(),'newTrafficChannel':newTrafficChannel, 'campaign':campaign, 'newPublisherId':newPublisherId, 'collegeId':collegeId},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#detailReportLoader.loader-block').show();
        },
        complete: function () {
            $('#detailReportLoader.loader-block').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                $('#changePublisherModal').modal('hide');
                syncApplicantData();
                loadMoreDetail('reset');
            }else{
                alert(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function filterModalReset(){
    $('.offCanvasModal input[type="text"]').each(function(){
       $(this).val('');
    });
    $('.offCanvasModal .chosen-select').each(function(){
       this.selected = false;
       $(this).val('');
       $(this).trigger("chosen:updated");
    });
    $('.offCanvasModal .sumo-select').each(function(){
       this.selected = false;
       $(this).val('');
       $(this)[0].sumo.reload();
    });
    return false;
}

function syncApplicantData(){
    $.ajax({
        url: '/DataSync/syncAplicantsWithElastic/'+$("#collegeId").val(),
        type: 'get',
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $('#trackCampaignLoader.loader-block').show();
        },
        complete: function () {
            setTimeout(function() {location.reload(); }, 5000);
        },
        success: function (response) { 
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr);
            console.log(thrownError);
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function triggerChangeTrafficChannel(){
    var college_id = $('#collegeId').val();
    if (typeof college_id != 'undefined' && college_id != "") {
        var trafficChannel  = $('#change_traffic_channel').val();
        if(trafficChannel == 6){
           getDirectSourceList(college_id);
        }else {
           getPublisherList(trafficChannel); 
        }
    }
}

function changePublisher(campaignId,trafficChannel,publisherId,isManualMapped){
    $('#orig_traffic_channel').val(trafficChannel);
    $('#orig_publisher_id').val(publisherId);
    if(trafficChannel){
        $('#change_traffic_channel').val(trafficChannel);
        $("#change_traffic_channel").trigger('chosen:updated');
        triggerChangeTrafficChannel();
    }
    $('#changePublisherModal').modal('show');
    if(publisherId){
        $('#change_campaign_publisher').val(publisherId);
        $("#change_campaign_publisher").trigger('chosen:updated');
    }
    $('#change_campaign_id').val(campaignId);
    $('.changePublisher').attr('onclick', 'return updatePublisher();');
}


//call publister list by traffic channel selected campain options
$('html').on('change', "#change_traffic_channel", function () {
    triggerChangeTrafficChannel();
    disableEnablePublisherChangeButton();
});

$('html').on('change', "#change_campaign_publisher", function () {
    disableEnablePublisherChangeButton();
});

function disableEnablePublisherChangeButton(){
    var orgTrfcChnnl = $('#orig_traffic_channel').val();
    var newTrfcChnnl = $('#change_traffic_channel').val();
    var orgPublisher = $('#orig_publisher_id').val();
    var newPublisher = $('#change_campaign_publisher').val();
    if(( orgTrfcChnnl == newTrfcChnnl && orgPublisher == newPublisher) || 
       $('#change_campaign_publisher').val() == ''
       ){
        $('.changePublisher').addClass('disabled').attr('disabled',true); 
    } else {
        $('.changePublisher').removeClass('disabled').attr('disabled',false);
    }
}

function getPublisherList(tchannel) {
    var college_id = $('#collegeId').val();
    var instance_val = 'pri_register';
    var all_publishers = 0;
    if( tchannel == 3 || tchannel == 4 || tchannel == 5 ){
        var url = '/campaign-manager/get-referrer-list';
    } else {
        var url = '/campaign-manager/get-publisher-list';
        all_publishers = 1;
    }
    $('#change_campaign_publisher').html('<option value="">Publisher/Referrer</option>');
    $.ajax({
        url: url,
        type: 'post',
        dataType: 'html',
        async:false,
        beforeSend: function () {showLoader();},
        complete: function () {    
            $("#change_campaign_publisher_chosen").find("ul").hide();
            $('#change_campaign_publisher').trigger('chosen:updated');
            hideLoader();
        },
        data: {'college_id': college_id, 'traffic_channel': tchannel, 'instance_val':instance_val,'all_publishers':all_publishers},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                if(typeof responseObject.data.sourceList === "object"){
                    var sourceList    = responseObject.data.sourceList;
                    $.each(sourceList, function (index, item) {
                        $('#change_campaign_publisher').append('<option value="'+index+'">'+item+'</option>');
                    });
                }
            }else{
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    console.log(responseObject.message);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

function getDirectSourceList(college_id){
     if(college_id){
        var html  = "<option value=''>Publisher/Referrer</option>";
            html  += "<option value='30' >Direct</option>";
                $("#change_campaign_publisher").html(html);
                $('#change_campaign_publisher').trigger('chosen:updated');
    }
}

function getCampaignCounts(){
    $.ajax({
        url: jsVars.campaignCountLink, 
        type: 'post',
        data:  $("#filterTrackCampaignForm").serialize(),
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $('#trackCampaignLoader.loader-block').show();
            loaderCount++;
        },
        complete: function () {
            loaderCount--;
            if(loaderCount==0){
                $('#trackCampaignLoader.loader-block').hide();
            }
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    $("#campaignCount").html(responseObject.data.campaignCount);
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
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
}

function alertPopup(msg, type, location) {
    if (type === 'error') {
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

    if (typeof location !== 'undefined') {
        $(btn).show();

        $(selector_parent).modal({keyboard: false}).one('click', btn, function (e) {
            e.preventDefault();
            window.location.href = location;
        });
    }
    else {
        $(selector_parent).modal();
    }
}

function selectAll(elem){
    if(elem.checked){
        $('.select_field').not(".disable-check").each(function(){
            this.checked = true;
        });
    }else{
        $('.select_field').not(".disable-check").attr('checked',false);
    }
}


function bulkChangePublisher(){
    if($('input:checkbox[name="selected_campaign[]"]:checked').length < 1){
        alertPopup('Please select Campaign','error');
        return;
    }
    
    var campaignIds = [];
    $('input:checkbox[name="selected_campaign[]"]:checked').each(function(){
        campaignIds.push($(this).val());
    });
    
    if(campaignIds.length > 50){
        alertPopup('Only 50 campaigns allowed at a time.','error');
        return;
    }
    
    var trafficChannel  = $("#bulkTrafficChannel").val();
    var publisherId     = $("#bulkPublisherId").val();
    
    $('#orig_traffic_channel').val(trafficChannel);
    $('#orig_publisher_id').val(publisherId);
    if(trafficChannel){
        $('#change_traffic_channel').val(trafficChannel);
        $("#change_traffic_channel").trigger('chosen:updated');
        triggerChangeTrafficChannel();
    }
    $('#changePublisherModal').modal('show');
    if(publisherId){
        $('#change_campaign_publisher').val(publisherId);
        $("#change_campaign_publisher").trigger('chosen:updated');
    }
    $('#change_campaign_id').val(campaignIds);
    $('.changePublisher').attr('onclick', 'return updateBulkPublisher();');
}

function updateBulkPublisher (){
    var newTrafficChannel = $('#change_traffic_channel').val();
    var newPublisherId = $('#change_campaign_publisher').val();
    var campaignIds  = $('#change_campaign_id').val();
    var collegeId  = $('#collegeId').val();

    $.ajax({
        url: jsVars.mapCampaignToPublisherInBulkLink,
        type: 'post',
        data: {'publisherId' : $("#publisherId").val(),'newTrafficChannel':newTrafficChannel, 'campaignIds':campaignIds, 'newPublisherId':newPublisherId, 'collegeId':collegeId},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#detailReportLoader.loader-block').show();
        },
        complete: function () {
            $('#detailReportLoader.loader-block').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                $('#changePublisherModal').modal('hide');
                syncApplicantData();
                loadMoreDetail('reset');
            }else{
                alert(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

