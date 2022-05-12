var loaderCount = 0;
/**
 * ajax for load counsellor followup
 * @returns {undefined}
 */
function ajaxListFollowupList(list_status,type,sorting){
    if(loaderCount>0){
        alertPopup('Another request in process. Please try again.','error');
        return false;
    }
    $('#followupTasksHtmlDiv').show();
    $('.sort_count_div,#parent').show();
    var searchBtn = false;
    var serializeData = $('#followUpFilter').serializeArray();
    
    if(type=='reset' && sorting !== 'sorting'){
        // reset form data
        var serializeData = [];
    }
    
    if(type=='sort'){
     type='reset';
    }
    
    if(type=='search'){
        searchBtn = true;
        type = 'reset';
    }
    
    if(type == 'reset'){
        Page = 1;
        $('#followupTasksHtml').html('');
    }
    $('#NoRecordMsg').hide();
    $('#load_more_button').show();
	$('.mobTabHorizontal li').click(function(){
		$(this).addClass('active'); 
		$(this).siblings().removeClass('active'); 
	});

    serializeData.push({name: "list_status", value: list_status});
    serializeData.push({name: "page", value: Page});
    
    $.ajax({
        url: jsVars.loadCounsellorAjaxFollowupList,
        type: 'post',
        data: serializeData,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            loaderCount++;
            $('#leadDetailsLoader').show();
        },
        complete: function () {
            loaderCount--;
            if(loaderCount==0){
                $('#leadDetailsLoader').hide();
            }
			/*$(".modal").appendTo("body");
			if(jQuery('#sidebar').hasClass('active')){ 
				if (document.documentElement.clientWidth > 768) {
					jQuery('.modal:not(.offCanvasModal) .modal-dialog').css('left', '45px');
				}	
			}*/
			
			$('#followup_status, #followup_lead_stages_filter, #followup_course_id_filter,#followup_specialization_id_filter').chosen();
            $('#followup_status #followup_lead_stages_filter, #followup_course_id_filter,#followup_specialization_id_filter').trigger('chosen:updated');
            $('#counsellor_id.sumo_select').SumoSelect({search: true, searchText: 'Select Counsellor', selectAll: true});
            
        },
        success: function (response) {
            Page = Page + 1;
            if(response=='session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(response=='norecord'){
                if(searchBtn==true){
                    $('.sort_count_div,#parent').hide();
                }
                else{
                    if(type == 'reset'){
                        $('#followupTasksHtmlDiv, .sort_count_div').hide();
                    }
                }
                $('#load_more_button,#leadDetailsLoader').hide();
                $('#NoRecordMsg').show();
                if(list_status=='today'){
                    var noRecMsg = 'No follow-up scheduled for today';
                }else if(list_status=='upcoming'){
                    var noRecMsg = 'No upcoming follow-up';
                }else if(list_status=='overdue'){
                    var noRecMsg = 'No overdue follow-up';
                }else if(list_status=='completed'){
                    var noRecMsg = 'No follow-up marked as complete';
                }else if(list_status=='all'){
                    var noRecMsg = 'No follow-up found';
                }
                noRecMsg = '<p class="text-center noDataFound asdfg" style="margin-bottom:80px;">'+noRecMsg+'</p>';
                
                if(Page>2){
                    noRecMsg ='<p class="text-center">No more follow-up found</p>';
                }
                $('#NoRecordMsg').html('<div class="blend-line"></div>'+noRecMsg+'</div>');
                    //Pramod: commenting these 2 lines because records list hiding after load more ended
                    //$('.download_btn').hide();
                    //$('.tableNew').hide();
            }
            else if(response!=''){
                
                if(type == 'reset' ){
                    $('#followupTasksHtmlDiv').html(response);
                }else{
                    $('#followupTasksHtml').append(response);
                }
				$('.thField').show();
            }
            if($('#load_more_button').length>0){
                if(list_status=='today'){
                    $('#load_more_button').attr('onclick','javascript:ajaxListFollowupList("today");');
                }
                else if(list_status=='upcoming'){
                    $('#load_more_button').attr('onclick','javascript:ajaxListFollowupList("upcoming");');
                }
                else if(list_status=='overdue'){
                    $('#load_more_button').attr('onclick','javascript:ajaxListFollowupList("overdue");');
                }
                else if(list_status=='completed'){
                    $('#load_more_button').attr('onclick','javascript:ajaxListFollowupList("completed");');
                }
                else if(list_status=='all'){
                    $('#load_more_button').attr('onclick','javascript:ajaxListFollowupList("all");');
                }
            }
			
			 var dataFormFields = $('#formFields').html();
			 //alert(dataFormFields);
			 $('#dataFromAjax').html(dataFormFields);
			 $('#formFields, .daterangepicker').remove();
             $('#filter').modal('hide');
			 $('#date_range_productivity').focus(function(){
				 LoadReportDateRangepicker();
			 })
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function followupMarkComplete(followup_id,college_id){
    $('.modal').modal('hide');
    $("#ConfirmPopupArea").modal('show');
    $("#ConfirmPopupArea p#ConfirmMsgBody").text('Do you want to mark this follow-up as complete?');
    $('#SuccessPopupArea p#MsgBody').text('Follow-up successfully mark as completed');
    $("#ConfirmPopupArea a#confirmYes").attr("onclick", 'return followupMarkCompleteAjax('+followup_id+','+college_id+');');
    
    $('#ConfirmPopupArea').on('hidden.bs.modal', function () {
        $('[name="f_check_'+followup_id+'"]').prop('checked', false);  
    });
    return;
}



function followupMarkCompleteAjax(followup_id,college_id){
    if(typeof followup_id =='undefined' || followup_id==''){
        return;
    }
    $("#ConfirmPopupArea").modal('hide');
    $.ajax({
        url: '/counsellors/followup-mark-complete',
        type: 'post',
        data: {followup_id:followup_id,college_id:college_id},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            loaderCount++;
            $('#leadDetailsLoader').show();
        },
        complete: function () {
            loaderCount--;
            if(loaderCount==0){
                $('#leadDetailsLoader').hide();
            }
        },
        success: function (json) {
            if(json.status==200){
                // follow up listing page
                if($('#followup_'+followup_id+'.tr_today').length>0){
                    $('td.td_f_check_'+followup_id).html('<input type="checkbox" disabled="disabled">');
                    $('#followup_'+followup_id+'.tr_today .td_status').html('<span class="complete_span text-success">Completed</span>');
                    if($('#f_edit_'+followup_id).length>0){
                        $('#f_edit_'+followup_id).hide();
                    }
                }else if($('#followup_'+followup_id).length>0){
                    $('#followup_'+followup_id).remove();
                } // for user profile page
                else if($('.f_check_'+followup_id).length>0){
                    $('.f_check_'+followup_id).html('<b>Status:</b> <span class="complete_span text-success">Completed</span>');
                    if($('#f_edit_'+followup_id).length>0){
                        $('#f_edit_'+followup_id).hide();
                    }
                }
                $("#SuccessLink").trigger('click');
            }
            else if(typeof json.error !='undefined' && json.error=='session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else{
                if(typeof json.error !='undefined' && json.error!=''){
                    alertPopup(json.error,'error');
                }
                else{
                    alertPopup('Error while saving!!','error');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return;
}

function getActivityLogsForStagePopupFT(userId,userName,moduleName,collegeId,formId){
//    $('#followupActivityModal').modal('hide');
    var activityList    = ['10014','10112','10013','10012','10291'];
    
    $.ajax({
        url: '/counsellors/getUserActivityLogs',
        type: 'post',
        data: {'userId' :userId, 'userName' :userName, 'collegeId':collegeId, 'activityCode':activityList, 'moduleName':moduleName, 'formId':formId, 'page':1, 'viewType':'popup'},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $('#userProfileLoader').show();
        },
        complete: function () {
            $('#userProfileLoader').hide();
        },
        success: function (html) {
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
            }
            else{
                html    = html.replace("<head/>", "");
                $("#stageActivityLogsDiv").html(html);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function resetSearchFilter(list_type){
    $('#counsellor_id').val('');
    $('#followup_status').val('');
    $('#date_range_productivity').val('');
    ajaxListFollowupList(list_type,'reset');
    $('#filter').modal('hide');
    return;
}

function requestBasedDownloadPopupBatchBind() {

    $('.modalButton').on('click', function (e) {
        $('#confirmDownloadYes').off('click');
        $('#confirmDownloadTitle').text('Download Confirmation');
	$('#ConfirmDownloadPopupArea .npf-close').hide();
        $('.confirmDownloadModalContent').text('Do you want to download the follow up ?');//download the leads
        var confirmation=$(this).text();
        var $form = $("#followUpFilter");
        $form.attr("action", jsVars.FULL_URL+'/counsellors/download-followup');
        $form.attr("target", 'modalIframe');
        var onsubmit_attr = $form.attr("onsubmit");
        var listStatus = $(".mobTabHorizontal li.active").attr('data-id');
        $form.append('<input type="hidden" name="list_status" value="'+listStatus+'" /> ');
        $form.removeAttr("onsubmit");
        $('#confirmDownloadYes').on('click',function(){
            $('.draw-cross').css('display','block');
            $form.attr("target", 'modalIframe');
            $('#ConfirmDownloadPopupArea').modal('hide');
            var data = $form.serializeArray();
            $.ajax({ 
                url: jsVars.FULL_URL+'/counsellors/download-followup',
                type: 'post',
                data : data,
                dataType:'html', 
                headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                success:function (response) {
                    if(response != '') {
                        alertPopup(response,'error');
                    } else {
                        $('#muliUtilityPopup').modal('show');
                        $('#muliUtilityPopup .close').addClass('npf-close').css('margin-top', '2px');
                    }
                }
            });
            $form.attr("onsubmit", onsubmit_attr);
            $form.removeAttr("target"); 
        }); 
                     
    });
    $('#myModal').on('hidden.bs.modal', function () {
        $("#modalIframe").html("");
        $("#modalIframe").attr("src", "");
    });
    
    if(jsVars.downloadListModuleUrl !== 'undefined' && jsVars.downloadListModuleUrl !== '') {
        $('#downloadListing').prop('href',jsVars.downloadListModuleUrl);
        $('#showlink').show();
    } else {
        $('#showlink').hide();
    }
}

$(document).on('click','span.followup_sorting i', function (){
    jQuery("span.followup_sorting i").removeClass('active');
    var field = jQuery(this).data('column');
    var data_sorting = jQuery(this).data('sorting');
    $('#sort_options').val(field+"|"+data_sorting);
    jQuery(this).addClass('active');
    var listStatus = $(".mobTabHorizontal li.active").attr('data-id');
    ajaxListFollowupList(listStatus,'reset','sorting');
});


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
            window.location.href = location;
        });
    }
    else {
        $(selector_parent).modal();
    }
}
