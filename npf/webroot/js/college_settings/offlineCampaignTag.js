$(document).ready(function(){
    $('[name="dependent_campaign"]').click(function(){
        var dependent_campaign = $(this).val();
        if(dependent_campaign==1){
            ajaxCampaignTagsDependent(0, 'loadCampaignTagHtml',0);
        }
        else{
            ajaxCampaignTagsIndependent();
        }
    });

    $(".chosen-select").chosen();
    $("#custom_tag_enable").click(function(){

        $('.text-danger').html('');
        if($("#custom_tag_enable").is(":checked")){
            $("#check_dependent_div").show();
            $("#custom_tag_enable").val(1);
            if(typeof jsVars.dependent_campaign != 'undefined'){
                $('[name="dependent_campaign"][value="'+jsVars.dependent_campaign+'"]').attr('checked','checked');
                $('[name="dependent_campaign"][value="'+jsVars.dependent_campaign+'"]').trigger('click');
            }
            saveOfflineTagConfiguration($('#configCollegeId').val());
        }else{

            $('#ConfirmMsgBody').html('Are you sure of this action? <br> Note: This action will disable the pre-defined campaign list.');
            $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
                .one('click', '#confirmYes', function (e) {
                    e.preventDefault();
                    $("#source_tags").val('');
                    $("#medium_tags").val('');
                    $("#campaign_tags").val('');
                    $("#campaign_tag_div").hide();
                    $("#custom_tag_enable").val(0);
                    $("#custom_tag_enable").removeAttr('checked');
                    $("#custom_tag_enable").prop('checked',false);
                    
                    $("#loadCampaignTagHtml").html('');
                    $("#check_dependent_div").hide();
                    $('[name="dependent_campaign"]').removeAttr('checked');
                    $('[name="dependent_campaign"]').prop('checked',false);
                    $('#ConfirmPopupArea').modal('hide');
                    
                    removeOfflineTagConfiguration($('#configCollegeId').val());
                    $("#custom_tag_enable").removeAttr('checked');
                })
                .one('click', '.btn-npf-alt', function (e) {
                    e.preventDefault();
                    $('#custom_tag_enable').prop('checked',true);
                })
                .one('click', '.npf-close', function (e) {
                    e.preventDefault();
                    $('#custom_tag_enable').prop('checked',true);
                });

        }
    });
    $("li.search-field > input.default").css("width", "250px");
    $(".loader-block").hide();
    
    
    
    //Manage Taxonomy: Delete Category
    $(document).on('click', '#TagDeleteStatusConfirm', function (e) {
        e.preventDefault();
        var MainParentDiv = $(this).parents("li.dd-item");
        var TagId = $(MainParentDiv).attr('data-id');    
        if (TagId > 0)
        {
            var TagName = $(MainParentDiv).find("input#value_text_"+TagId).val();
            var PopUpStatus = 'delete';
            var PopUpConfirmStatus = 'deleted';
            $("#ConfirmPopupArea p#ConfirmMsgBody").text('Do you want to ' + PopUpStatus + ' the category \'' + TagName + '\'.');
            $('#SuccessPopupArea p#MsgBody').text('Category \'' + TagName + '\' has been ' + PopUpConfirmStatus + '.');
            $("#ConfirmPopupArea a#confirmYes").attr("onclick", 'deleteCampaignTag(\'' + TagId + '\',\'DeleteCategory\',\'\');');
        }
        else
        {
            alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
        }
    });

});

function submitForm(){
    if($("#collegeId").val()===""){
        $('#listingContainerSection').html('<div class="alert alert-danger">Please select institute to view fields.</div>');
        return;
    }
    $("#campaignTagForm").submit();
}

var appendFlag = 0;

function loadApplicationAllocConfig() {
    $.ajax({
        url: '/college-settings/load-allocation-config',
        type: 'post',
        data: {'collegeId': $("#configCollegeId").val(), 'logicNumber':logicNumber},
        dataType: 'html',
        async: false,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#campaignTagLoader .loader-block').show();
        },
        complete: function () {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.chosen-select').trigger('chosen:updated');
            $('.sumo_select').SumoSelect({placeholder: 'Select', search: true, searchText:'Search', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
            $('#campaignTagLoader .loader-block').hide();
            logicNumber++;
            $('.rr_logic_counsellors').unbind( "change" );
            $(".rr_logic_counsellors").change(disabledSelectedCounsellors);
            disabledSelectedCounsellors();
        },
        success: function (html) {
            if (html === 'session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (html === 'error') {
                alertPopup('Parameter missing!', 'error');
            } else {
                $("#collapseLeadAllocConfig").append(html);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}



//Save Counsellor config section data
function saveSectionData() {
    $('.loader-block').show();
    $('.text-danger').html('');
    var errorFlag   = false;
    var i = 0;
    var data        = {'config':$("#offlineCampaignTagForm,#offlineCreateSource").serialize(),'forms':[]};
//    console.table(data);
//    alert('ff')
//    return;
    var customTagEnable = $.trim($("#custom_tag_enable").val());
    var sourceTags = $.trim($("#source_tags").val());
    var mediumTags = $.trim($("#medium_tags").val());
    var campaignTags = $.trim($("#campaign_tags").val());
    var predefinedCampaign = ['direct','organic','social','referral','other','adwords','inbound call','outbound call'];
    var duplicateTags = [];
    if(sourceTags != '' && customTagEnable == '1' ){
        var sourceTagArray = sourceTags.split(",");
        for (i = 0; i < sourceTagArray.length; ++i) {
            if($.inArray($.trim(sourceTagArray[i].toLowerCase()),predefinedCampaign) !== -1){
                errorFlag = true;
                duplicateTags.push(sourceTagArray[i]);
            }
        }
        if(duplicateTags.length > 0){
            $("#source_tags_err").html('You cannot enter Source Name: ( '+duplicateTags.join(' , ')+' ).');
        }
    }
    duplicateTags = [];
    if(mediumTags != '' && customTagEnable == '1'){
        var mediumTagArray = mediumTags.split(",");
        for (i = 0; i < mediumTagArray.length; ++i) {
            if($.inArray($.trim(mediumTagArray[i].toLowerCase()),predefinedCampaign) !== -1){
                errorFlag = true;
                duplicateTags.push(mediumTagArray[i]);
            }
        }
        if(duplicateTags.length > 0){
            $("#medium_tags_err").html('You cannot enter Medium Name: ( '+duplicateTags.join(' , ')+' ).');
        }
    }
    duplicateTags = [];
    if(campaignTags != '' && customTagEnable == '1'){
        var campaignTagArray = campaignTags.split(",");
        for (i = 0; i < campaignTagArray.length; ++i) {
            if($.inArray($.trim(campaignTagArray[i].toLowerCase()),predefinedCampaign) !== -1){
                errorFlag = true;
                duplicateTags.push(campaignTagArray[i]);
            }
        }
        if(duplicateTags.length > 0){
            $("#campaign_tags_err").html('You cannot enter Campaign Name: ( '+duplicateTags.join(' , ')+' ).');
        }
    }


    if(errorFlag){ // if any invalid data found then return
        $('.loader-block').hide();
        return false;
    }
    
    $.ajax({
        url: '/college-settings/saveOfflineCampaignTag',
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
            $('.loader-block').hide();
        },
        success: function (json) {
            $('span.lead_error').html('').hide();
            if (json['status']=="0") {
                // if session is out
                if(json['message']=="session"){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(json['message'], 'error');
                }
            } else{
                 alertPopup(json['message'], 'success');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

}


function ajaxCampaignTagsIndependent(){
    var data = $('#campaignTagForm').serializeArray();
    $.ajax({
        url: '/college-settings/offline-campaign-tags-independent',
        type: 'post',
        data: data,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $(".npf-close").trigger('click');
            $('div.loader-block').show();
        },
        complete: function () {
            $('div.loader-block').hide();
        },
        success: function (html) {
            $('span.lead_error').html('').hide();
            if(html=="session"){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(html == 'error'){
                alertPopup('error', 'error');
            }
            else{
                $('#LoadMoreArea').hide();
                $('#loadCampaignTagHtml').html(html);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function ajaxCampaignTagsDependent(parent_id, load_html_id, Start,lvl,checkcollapse) {
    if (typeof lvl == 'undefined'){
        lvl = 1;
    }
    if (typeof checkcollapse == 'undefined'){
        checkcollapse = 'yes';
    }
//    console.log(lvl);
    if (typeof Start == 'undefined'){
        var Page = 'all';
    }
    else{
        var Page = Start;
    }
    $('.addmorelink').remove();
    // for collapsable
    if(checkcollapse == 'yes' && $('#load_'+parent_id+' ol').length>0){
        $('#load_'+parent_id+' ol').remove();
        return;
    }
    
    if (load_html_id == "loadCampaignTagHtml")
    {
        $('#LoadMoreArea input').attr('disabled', true);
        $('#LoadMoreArea input').attr('value', 'Loading...');
    } else {
        $('#' + load_html_id + ' .dd-list').remove();
        $('#' + load_html_id).append("<div class='dd-list'>Loading...</div>");
    }

    $.ajax({
        url: '/college-settings/offline-campaign-tags-dependent',
        type: 'post',
        dataType: 'html',
        data: {
            "parent_id": parent_id,
            Page: Page,
            'college_id': $('#configCollegeId').val(),
            'lvl': lvl
        },
        beforeSend: function () {
//            $(".npf-close").trigger('click');
            $('div.loader-block').show();
        },
        complete: function () {
            $('div.loader-block').hide();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if(data=='error:session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(data.indexOf('error:')>-1){
                var error = data.replace(/error\:/,'');
                alertPopup(error,'error');
            }
            else{
                Page = Page + 1;
                if (load_html_id == "loadCampaignTagHtml")
                {
                    if (Page == 1)
                    {
                        if(data !='<ol class="dd-list"></ol>'){
                            $('#' + load_html_id).html(data);
                        }else{
                             $('#' + load_html_id).html("<div align='center' class='alert alert-danger'>Data Not Found.</div>");
                        }
                     } else {
                         
                         $('#'+load_html_id+' li.no_tag_found').remove();
                        $('#' + load_html_id + ' > ol.dd-list').append(data);
                    }
                } else
                {
                    $('#' + load_html_id + ' .dd-list').remove();
                    $('#' + load_html_id).append(data);
                }
                setTimeout('$("li").removeClass("fadeIn");', 2000);
                setTimeout('$("li").removeClass("animated");', 2000);
                if (load_html_id == "loadCampaignTagHtml")
                {
                    $('#LoadMoreArea button').removeAttr('disabled');
//                    $('#LoadMoreArea button').html('Load More Tags');
                    $('#LoadMoreArea button').attr('onclick', 'ajaxCampaignTagsDependent(0, \'loadCampaignTagHtml\',' + Page + ');');
                    if(data !='<ol class="dd-list"></ol>'){
                       $('#LoadMoreArea').show();
                    }
                    else{
                       $('#LoadMoreArea').hide();
                    }
                    if (data.trim() == '' || $('ol.dd-list>li').length<10)
                    {
                        $('#LoadMoreArea').hide();
                    }
                }
                else{
                    var labelName = '';
                    if(lvl==1){
                        labelName ='Medium';
                    }
                    else if(lvl==2){
                        labelName ='Campaign';
                    }
                    // first time not dispaly add more button
                   if(lvl<3 && $('#' + load_html_id+'>ol li.no_tag_found').length==0){
                            $('#' + load_html_id).append('<div class="addmorelink"><a href="javascript:void(0);" class="btn w-text npf-btn btn-sm" onclick="javascript:AddChildCampaignTag(\''+parent_id+'\', \'load_'+parent_id+'\','+lvl+');" title="Add '+labelName+'"><i class="fa fa-plus"></i>&nbsp;Add '+labelName+'</a></div>');
                    }
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function removeOfflineTagConfiguration(college_id){
    if(college_id=='' || college_id==0){
        return;
    }
    $.ajax({
        url: '/college-settings/remove-offline-tag-configuration',
        type: 'post',
        dataType: 'json',
        data: {
            "college_id": college_id,
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $(".npf-close").trigger('click');
            $('div.loader-block').show();
        },
        complete: function () {
            $('div.loader-block').hide();
        },
        success: function (json) {
            if (typeof json['redirect'] != 'undefined' && json['redirect']!='') {
                location = json['redirect'];
            }
            else if (typeof json['error'] !='undefined' && json['error']!='') {
                alertPopup(json['error'], 'error');
            }
            else if (typeof json['success'] != 'undefined' && json['success']!='') {
                alertPopup(json['success'], 'success');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function saveOfflineTagConfiguration(college_id){
    if(college_id=='' || college_id==0){
        return;
    }
    $.ajax({
        url: '/college-settings/save-offline-tag-configuration',
        type: 'post',
        dataType: 'json',
        data: {
            "college_id": college_id,
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $(".npf-close").trigger('click');
            $('div.loader-block').show();
        },
        complete: function () {
            $('div.loader-block').hide();
        },
        success: function (json) {
            if (typeof json['redirect'] != 'undefined' && json['redirect']!='') {
                location = json['redirect'];
            }
            else if (typeof json['error'] !='undefined' && json['error']!='') {
                alertPopup(json['error'], 'error');
            }
            else if (typeof json['success'] != 'undefined' && json['success']!='') {
                if(json['success']!='nothing'){
//                    alertPopup(json['success'], 'success');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function submitSource(suffix){
//    console.table(data);
//    var data = $("#offlineCampaignTagForm,#offlineCreateSource").serializeArray();
    var data = [];
    var value_text = '';
    var parent_id = '';
    var college_id = '';
    if(typeof suffix !='undefined'){
        $('#btn_' + suffix).html("Wait");
        $('#btn_' + suffix).attr("disabled",'disabled');
        value_text = $('#value_text_' + suffix).val();
        parent_id = $('#parent_id_' + suffix).val();
    }
    else{
        value_text = $('#value_text').val();
        parent_id = $('#parent_id').val();
    }
    college_id = $('#configCollegeId').val();
//    return;
    data.push({name:'college_id','value':college_id});
    data.push({name:'value_text','value':value_text});
    data.push({name:'parent_id','value':parent_id});
    
    data.push({name:'status','value':1});
    $.ajax({
        url: '/college-settings/save-offline-tag-dependent',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $(".npf-close").trigger('click');
            $('div.loader-block').show();
        },
        complete: function () {
            $('div.loader-block').hide();
            $('#btn_' + suffix).html("Save");
            $('#btn_' + suffix).removeAttr('disabled');
        },
        success: function (json) {
            if (typeof json['redirect'] != 'undefined' && json['redirect']!='') {
                location = json['redirect'];
            }
            else if (typeof json['error'] !='undefined' && json['error']!='') {
                alertPopup(json['error'], 'error');
            }
            else if (typeof json['success'] != 'undefined' && json['success']!='') {
                alertPopup(json['success'], 'success');
                if(typeof suffix !='undefined'){
                    $('#main_' + suffix).remove();
                    var lvl = $('#load_'+parent_id).data('lvl');
                    ajaxCampaignTagsDependent(parent_id, 'load_'+parent_id,'all',lvl,'no');
                }
                else{
                    ajaxCampaignTagsDependent(0, 'loadCampaignTagHtml',0);
                    
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function updateCampaignTag(id){
    var data = [];
    var value_text = '';
    var parent_id = '';
    var college_id = '';
    if(typeof id !='undefined'){
        $('#btn_' + id).html("Wait");
        value_text = $('#value_text_' + id).val();
        parent_id = $('#parent_id_' + id).val();
    }
    
    college_id = $('#configCollegeId').val();
//    return;
    data.push({name:'college_id','value':college_id});
    data.push({name:'value_text','value':value_text});
    data.push({name:'parent_id','value':parent_id});
    data.push({name:'id','value':id});
    
    data.push({name:'status','value':1});
    $.ajax({
        url: '/college-settings/save-offline-tag-dependent',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $(".npf-close").trigger('click');
            $('div.loader-block').show();
        },
        complete: function () {
            $('div.loader-block').hide();
        },
        success: function (json) {
            if (typeof json['redirect'] != 'undefined' && json['redirect']!='') {
                location = json['redirect'];
            }
            else if (typeof json['error'] !='undefined' && json['error']!='') {
                alertPopup(json['error'], 'error');
            }
            else if (typeof json['success'] != 'undefined' && json['success']!='') {
                alertPopup(json['success'], 'success');
                if(typeof id !='undefined'){
                    if(parent_id==0){
                        ajaxCampaignTagsDependent(0, 'loadCampaignTagHtml',0);
                    }
                    else{
                        var italic = '<i>'+$('.label_'+id+' i').html()+'</i>';
                        $('.label_'+id).html(italic+value_text);
                        $('#btn_' + id).html("Add");
                        $('.input_'+id).hide();
                        $('.label_'+id).fadeIn();
                        $('#load_'+id).removeClass('edittag');
//                        var lvl = $('#load_'+parent_id).data('lvl');
//                        ajaxCampaignTagsDependent(parent_id, 'load_'+parent_id,'all',lvl);
                    }
                    
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function AddChildCampaignTag(parent_id, load_html_id,lvl) {
    
    var placeholder = 'Medium';
    if(typeof lvl !='undefined' && lvl>1){
        placeholder = 'Campaign';
    }
    $('.addmorelink').remove();
    $('#'+load_html_id+' .inlineaddtag').remove();
    $('#'+load_html_id+' .no_tag_found').parent('ol').remove();
    
    var random_no = Math.floor((Math.random() * 100000) + 1);
    var suffix = random_no + "_" + parent_id;

    var html = '<div class="row form-inline common-manager inlineaddtag" id="main_' + suffix + '"><div class="col-md-4 npf-form-group"><input type="hidden" id="parent_id_' + suffix + '" value="' + parent_id + '"><input type="text" class="form-control fc-small" id="value_text_' + suffix + '" placeholder="'+placeholder+'"></div><div class="col-md-4 npf-form-group"><div class="inputBtn mt-10"><button type="button" onClick="javascript:submitSource(\'' + suffix + '\');" id="btn_' + suffix + '" class="btn btn-sm w-text npf-btn">Save</button><button  type="button" onClick="javascript:$(\'#main_' + suffix + '\').remove();" class="btn btn-sm btn-info">Close</button></div></div><div class="error col-md-12" id="error_' + suffix + '"></div></div>';
    $('#' + load_html_id).append(html);
    
    if($('#' + load_html_id+'>ol.dd-list').length>0){
    
//    $('#' + load_html_id).append('<div class="addmorelink"><a href="javascript:void(0);" class="btn npf-btn w-text" onclick="javascript:AddChildCampaignTag(\''+parent_id+'\', \'load_'+parent_id+'\','+lvl+');" title="Add '+placeholder+'"><i class="fa fa-plus"></i>&nbsp;Add '+placeholder+'</a></div>');
    }
    
//    $('html, body').animate({
//        scrollTop: $('#value_text_' + suffix).offset().top - 10
//    }, 700);
    //$('#cat_name_'+suffix).focus();
}

//enable/disable college form
function deleteCampaignTag(tagId) {
    if (tagId > 0)
    {
        var college_id = $('#configCollegeId').val();
        var parent_id = $('#parent_id_'+tagId).val();
        $.ajax({
            url: '/college-settings/delete-offline-tag-dependent',
            type: 'post',
            data: {tagId: tagId,'college_id':college_id,'parent_id':parent_id},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $(".npf-close").trigger('click');
                $('div.loader-block').show();
            },
            complete: function () {
                $('div.loader-block').hide();
            },
            success: function (json) {

                if (json['redirect']){
                    location = json['redirect'];
                }
                else if (typeof json['error'] !='undefined'){
                    alertPopup(json['error'], 'error');
                }
                else if (json['success'] == 200){
                    $('span.label_' + json['tagid']).closest('li.dd-item').remove();
                    $("#SuccessLink").trigger('click');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
    else{
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
}


function showEditTag(id) {
    $('#load_'+id).addClass('edittag');
    $('.label_' + id).hide();
    $('.input_' + id).fadeIn();
}