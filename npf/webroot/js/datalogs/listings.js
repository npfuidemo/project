/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function loadMoreLogs(type){
    var collection_name = $('#collection_name').val();
    var college_id = $('#college_id').val();
    var api_name = $('#api_name').val();
    var institute = $('#institute').val();
    if(college_id==''){
        alertPopup('Please select Institute Name','error');
        return false;
    }
    if((typeof collection_name =='undefined' || collection_name=='') && (typeof college_id =='undefined' || college_id=='')){
        alertPopup('Please select Institute Name and Collection Name','error');
        return;
    }
	if(typeof college_id =='undefined' || college_id==''){
        alertPopup('Please select Institute Name','error');
        return;
    }
	if(typeof collection_name =='undefined' || collection_name==''){
        alertPopup('Please select Collection Name','error');
        return;
    }
    
    if (typeof type !='undefined' && type == 'reset') {
        Page = 0;
        $('#load_more_results').html("");
    }
    if(collection_name == 'purge_records' && !$('#purge_type').val()){
        alertPopup('Please select Purge type','error');
        return false;
    }
    
    var data = $('#FilterMongoLogsForm').serializeArray();
    data.push({name: "page", value: Page});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $.ajax({
        url: '/datalogs/ajax-listing',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        
	beforeSend: function () { 
            $('input[name="search_btn"]').prop('disabled', true);
            showLoader();
        },
        complete: function () {
            $('input[name="search_btn"]').prop('disabled', false);
            hideLoader();
        },
        success: function (data) {
            data = data.replace("<head/>", '');
            Page = Page + 1;
            if (data == "session_logout") {
                window.location.reload(true);
            }
            else if (data == "norecord" || data =='access_denied') {
                if (Page == 1){
                    var error_html = "No Records found";
					$('#load_msg_div').show();
					$('#load_msg').html('').append(error_html);
					$('#parent').hide();
                                        $('#tot_download').hide(); 
				}
                else{
                    var error_html = '<tr><td colspan="9" class="text-center text-danger fw-500">No More Record</td></tr>';
					$('#load_more_results tbody').append(error_html);
					$('#parent').show();
				}
                $('#load_more_button').hide();
                $('#tot_records').html("");
            }
            else {
                $('#parent').show();
                $('#load_msg').html('');
                $('#load_msg_div').hide();
                if (Page==1) {
                    $('#load_more_results').append(data);
                }
                else {
                    $('#load_more_results tbody').append(data);
                }
                $('.offCanvasModal').modal('hide');
				$('#tot_download').show();
                $('#load_more_button').show();
//                $('#load_more_button').html("Loading...");
                
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html("Load More Logs");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            hideLoader();
        }
    });
    return false;
}

function viewDetail(id,collection_name,key_name){
    if(typeof key_name == 'undefined'){
        key_name = '';
    }
    $.ajax({
        url: '/datalogs/view-detail',
        type: 'post',
        dataType: 'html',
        data: {id:id,collection_name:collection_name,key_name:key_name},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            data = data.replace("<head/>", '');
            if (data == "session_logout") {
                window.location.reload(true);
            }
            else {
                
                jQuery("#mongoDocumentList").html(data);
                jQuery("#mongoDoc").modal();    
                
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function exportDataLogsData(){
    
    var $form = $("#FilterMongoLogsForm");
    $form.attr("action",jsVars.exportDataLogsDataLink);
    $form.attr("target",'modalIframe');
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    $('#myModal').modal('show');
    $form.submit();
    $form.attr("onsubmit",onsubmit_attr);
    $form.removeAttr("target");
}

var downloadDetailReportFile = function(url){
    window.open(url, "_self");
};


function getAutomationListUrl(elem) {
        var college_id = $('#college_id').val();
        $("#automationList").html('<option value="">Automation Name</option>');
        $('.chosen-select').trigger('chosen:updated');
        
        if($('#collection_name').val() == 'pingback_detail_lead') {
            $('#div_ad_lead_type').css('display', 'block');
        } else {
            $('#ad_lead_type').val('');
            $('#div_ad_lead_type').css('display', 'none');
        }
        
        if($('#collection_name').val() == 'purge_records') {
            $('#div_purge_records_type').css('display', 'block');
        } else {
            $('#purge_type').val('');
            $('#div_purge_records_type').css('display', 'none');
        }
        
        if($('#collection_name').val()=='automation_rabbit_request'){
        $.ajax({
            url: '/automation/search-automation-list-name',
            type: 'post',
            dataType: 'json',
            data: {'college_id':college_id,'bypass':'search'},
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            complete: function () {
                $('div.loader-block').hide();
            },
    //        async: false,
            success: function (jsonD) {
                if(jsonD.success == 200){
                    var list='';
                    list +='<option value="">Automation Name</option>';
                    $.each( jsonD.listAutomation, function( key, value ) {
                      list +='<option value="'+key+'">'+value+'</option>';
                    });
                  $("#automationList").html(list);
                  $('.chosen-select').trigger('chosen:updated');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    } 
    $('.chosen-select').trigger('chosen:updated');
}

    $('#mongoDoc').on('hidden.bs.modal', function (e) { 
        $("#mongoDocumentList").html('');
     });

function changeStatus(userId,formId){
    var college_id = $('#college_id').val();
    if(college_id==''){
        alertPopup('Please select college','error');
        return false;
    }
    if(userId==''){
        alertPopup('User can\'t blank','error');
        return false;
    }
    if(formId==''){
        alertPopup('Form can\'t blank','error');
        return false;
    }
    $("#confirmYes").removeAttr('onclick');
    $('#confirmTitle').html("Confirm");
    $("#confirmYes").html('Confirm');
    $("#confirmYes").siblings('button').html('Cancel');
    $('#ConfirmMsgBody').html('Are you sure you want to change Re-push status?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        changeStatusConfirm(college_id,userId,formId);
        $('#ConfirmPopupArea').modal('hide');
    });
    
    
}
function changeStatusConfirm(college_id,userId,formId){
    $.ajax({
        url: jsVars.FULL_URL+'/datalogs/changeErpStatus',
        type: 'post',
        dataType: 'json',
        data: {'collegeId':college_id,'user_id':userId,'form_id':formId},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        complete: function () {
            $('div.loader-block').hide();
        },
        success: function (response) {
            if(response.status == 200){
                loadMoreLogs('reset');
                alertPopup('Erp Re-push status successfully changed.','Success');
            }
            if(response.status==0 && response.error!=''){
                if(response.error == 'session_logout' && typeof response.redirect!='undefined'){
                    location = response.redirect;
                }
                else{
                    alertPopup(response.error,'error');
                }
                
            }
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
$("#collection_name").change(function(){
  var value = $("#collection_name option:selected").val();
  if (value == "crm_data" || value == "crm_data_error" ){
    $(".inst").show();
    $(".api").show();
  }
  else{
     $(".inst").hide();
     $(".api").hide();
  }
});

