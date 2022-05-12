$(document).ready(function(){
    $('[data-toggle="popover"]').popover();
    LoadReportDateRangepicker();
    $('#detailReportLoader.loader-block').hide();
    $("#instance_type").change(getReferrerList);
    loadpublisherSummaryLink();
    loadMoreDetail('reset');    
    $(document).on('click', 'span.sorting_span i', function () {
        $("#sortField").val(jQuery(this).data('column'));
        $("#sortOrder").val(jQuery(this).data('sorting'));
        loadMoreDetail('reset');
    });
});
$(document).ajaxComplete(function() {
    $('[data-toggle="popover"]').popover();
});
var loaderCount=0;
function changeInstanceType(){
    var source      = '<select id="source" class="chosen-select" tabindex="-1" name="source"><option selected="selected" value="">Source</option></select>';
    $('#sourceDiv').html(source);
    var medium      = '<select id="medium" class="chosen-select" tabindex="-1" name="medium"><option selected="selected" value="">Medium</option></select>';
    $('#mediumDiv').html(medium);
    var name    = '<select tabindex="-1" class="chosen-select" id="name"  name="name"><option value="">Campaign Name</option></select>';
    $('#campaignNameDiv').html(name);
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    $('#detailReportLoader.loader-block').hide();
    var instanceType    = $("#instance_type").val();
    var collegeId       = $("#collegeId").val();
    var publisherId     = $("#publisherId").val();
    $.ajax({
        url: jsVars.getFiltersLink,
        type: 'post',
        data: {'collegeId' : collegeId,'publisherId' : publisherId, 'instanceType':instanceType},
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
                        var value   = '<select id="source" class="chosen-select" tabindex="-1" name="source" style="display: none;"><option selected="selected" value="">Source</option>';
                        $.each(sourceList, function (index, item) {
                            value += '<option value="'+index+'">'+item+'</option>';
                        });
                        value += '</select>';
                        $('#sourceDiv').html(value);
                        $("#source").change(changeSource);
                    }
                }
                if(typeof responseObject.data === "object"){
                    if(typeof responseObject.data.mediumList === "object"){
                        var mediumList    = responseObject.data.mediumList;
                        var value   = '<select id="medium" class="chosen-select" tabindex="-1" name="medium" style="display: none;"><option selected="selected" value="">Medium</option>';
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
                        var value   = '<select id="name" class="chosen-select" tabindex="-1" name="name" style="display: none;"><option selected="selected" value="">Campaign Name</option>';
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
    var medium      = '<select id="medium" class="chosen-select" tabindex="-1" name="medium"><option selected="selected" value="">Medium</option></select>';
    $('#mediumDiv').html(medium);
    var name    = '<select tabindex="-1" class="chosen-select" id="name"  name="name"><option value="">name Name</option></select>';
    $('#campaignNameDiv').html(name);
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    $('#detailReportLoader.loader-block').hide();
    var collegeId       = $("#collegeId").val();
    var publisherId     = $("#publisherId").val();
    var instanceType    = $("#instance_type").val();
    var source          = $("#source").val();
    $.ajax({
        url: jsVars.getFiltersLink,
        type: 'post',
        data: {'collegeId' : collegeId,'publisherId' : publisherId, 'instanceType':instanceType, 'source':source},
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
                        var value   = '<select id="medium" class="chosen-select" tabindex="-1" name="medium" style="display: none;"><option selected="selected" value="">Medium</option>';
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
                        var value   = '<select id="name" class="chosen-select" tabindex="-1" name="name" style="display: none;"><option selected="selected" value="">Campaign Name</option>';
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
    var name    = '<select tabindex="-1" class="chosen-select" id="name"  name="name"><option value="">Campaign Name</option></select>';
    $('#campaignNameDiv').html(name);
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    $('#detailReportLoader.loader-block').hide();
    var collegeId       = $("#collegeId").val();
    var publisherId     = $("#publisherId").val();
    var instanceType    = $("#instance_type").val();
    var source          = $("#source").val();
    var medium          = $("#medium").val();
    $.ajax({
        url: jsVars.getFiltersLink,
        type: 'post',
        data: {'collegeId' : collegeId,'publisherId' : publisherId, 'instanceType':instanceType, 'source':source, 'medium':medium},
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
                        var value   = '<select id="name" class="chosen-select" tabindex="-1" name="name" style="display: none;"><option selected="selected" value="">Campaign Name</option>';
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

function loadMoreDetail(listingType){
    if(jsVars.canViewDetailedReportTable==false){
        return false;
    }
    if(listingType === 'reset'){
        $("#page").val(1);
    }
    $.ajax({
        url: jsVars.loadMoreDetailedReportLink,
        type: 'post',
        data: $('#publisherDetailSearchArea input,#publisherDetailSearchArea select'),
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
					$("#collegeSummarySpan").html('');
                    //$("#collegeSummarySpan").append(" "+jsVars.collegeName);
					$("#collegeSummarySpan").append('<a tabindex="1" class="icon-info" style="font-size:11px;" role="button" data-placement="top" data-container="body" data-toggle="popover" data-trigger="focus" data-html="true" data-content="'+jsVars.collegeName+'"><span class="lineicon-info" aria-hidden="true"></span></a>');
                }else{
                    $('#detailReportContainerSection').find("tbody").append(html);
                }
//                if(countRecord < 10){
//                    $('#LoadMoreArea').hide();
//                }else{
//                    $('#LoadMoreArea').show();
//                }
                $("#page").val(parseInt($("#page").val())+1);
                $(".campaign-publisher").change(updatePublisherConfirmation);
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            }
            //table_fix_rowcol();
			$('.offCanvasModal').modal('hide');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
};

function countResult(html){
    var len = (html.match(/listDataRow/g) || []).length;
    return len;
}

function updatePublisherConfirmation(){
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

function updatePublisher (campaign,newPublisherId,isConfirmBox){
    $("#ConfirmPopupArea").modal('hide');
    var collegeId = $("#collegeId").val();
    if(typeof collegeId == 'undefinded') {
        collegeId = '';
    }

    $.ajax({
        url: jsVars.mapCampaignToPublisherLink,
        type: 'post',
        data: {'publisherId' : $("#publisherId").val(), 'campaign':campaign, 'newPublisherId':newPublisherId, 'collegeId':collegeId},
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
                loadMoreDetail('reset');
            }else{
                alert(responseObject.message);
            }
            if(isConfirmBox == "1"){
                $("#SuccessLink").trigger('click');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function exportDetailReportCsv(){
    var $form = $("#filterDiscountCouponForm");
    $form.attr("action",jsVars.exportDetailReportCsvLink);
    $form.attr("target",'modalIframe');
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    $('#myModal').modal('show');
    var isleadTypeDisabled = "0";
    $form.submit();
    $form.attr("onsubmit",onsubmit_attr);
    $form.removeAttr("target");
    
}

var downloadDetailReportFile = function(url){
    window.open(url, "_self");
};


/**
 * 
 * load all campaign summary
 */
function loadpublisherSummaryLink(){
    return;
    var instanceType    = $("#instance_type").val();
    var collegeId       = $("#collegeId").val();
    var publisherId     = $("#publisherId").val();
    var date_range      = $("#date_range").val();
    var trafficChannel  = $("#trafficChannel").val();
    var referrer  = $("#referrer").val();
   
    if($("#instance_type").val() === "sec_campaign_id"){
         var data = {'referrer': referrer, 's_college_id' : collegeId,'publisher_id' : publisherId, 'date_range' : date_range, 'instance_type':instanceType, 'form_id':$("#interest_on_forms").val(), 'trafficChannel':trafficChannel};
    }else if($("#instance_type").val() === "ter_campaign_id"){
         var data = {'referrer': referrer, 's_college_id' : collegeId,'publisher_id' : publisherId, 'date_range' : date_range, 'instance_type':instanceType,  'form_id':$("#interest_on_forms").val(), 'trafficChannel':trafficChannel};
    }else{
         var data = {'referrer': referrer, 's_college_id' : collegeId,'publisher_id' : publisherId, 'date_range' : date_range, 'instance_type':instanceType, 'form_id':$("#interest_on_forms").val(), 'trafficChannel':trafficChannel};
    }
    $.ajax({
        url: jsVars.loadPublisherSummaryLink, 
        type: 'post',
        data:  data,
        dataType: 'json',
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
        success: function (json) { 
            if (json['redirect']){
                location = json['redirect'];
            }else if (json['error']){
                alertPopup(json['error'], 'error');
            }else if (json['dataList'] != undefined) {
                $("#totalPrimaryRegistrations").html(json['dataList'][0]['primary_count']);
                $("#totalSecondaryRegistrations").html(json['dataList'][0]['secondary_count']);
                $("#totalTertiaryRegistrations").html(json['dataList'][0]['tertiary_count']);
                $("#totalRegistrations").html(json['dataList'][0]['total_count']);
                $("#totalVerifiedRegistrations").html(json['dataList'][0]['verified']);
                $("#totalUnverifiedRegistrations").html(json['dataList'][0]['unverified']);
                $("#totalApplications").html(json['dataList'][0]['application_count']);
                if($("#totalEnrollment").length>0){
                    $("#totalEnrollment").html(json['dataList'][0]['enrolment_count']);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getReferrerList(){
    var registration_instance    = $("#instance_type").val();
    var college_id               = $("#collegeId").val();
    var trafficChannel          = $("#trafficChannel").val();
    $("#referrer").html('<option selected="selected" value="">Publisher/Referrer</option>');
    $.ajax({
        url: jsVars.getReferrerDetailedReportFiltersLink,
        type: 'post',
        dataType: 'html',
        data: {'college_id': college_id,'traffic_channel':trafficChannel,'registration_instance':registration_instance},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () { 
            $('#detailReportLoader.loader-block').show();
        },
        complete: function () {
            $('#referrer').trigger("chosen:updated");
            $('#detailReportLoader.loader-block').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                if(typeof responseObject.data.sourceList === "object"){
                    var sourceList    = responseObject.data.sourceList;
                    $.each(sourceList, function (index, item) {
                        $('#referrer').append('<option value="'+index+'">'+item+'</option>');
                    });
                }
            }else{
                alert(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}
