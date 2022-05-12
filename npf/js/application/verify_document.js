/* 
 * Verify Document javascript function .
 */
function submitVerification(userId,formId,applicationNo,action) {
    var data = [];
    var allfields =[];
    var html = '';
    var error = false;
    $('.error').hide();
    $('.error').val();
    
    
    var documentStatusConfigVal = $("#documentStatusConfig").val();
    if(documentStatusConfigVal== '' || documentStatusConfigVal == undefined){
        alertPopup('Please Enable Configuration Settings','error');
        return;
    }
    var documentStatusConfig = JSON.parse($("#documentStatusConfig").val());
    $(".doc-verification").each(function() {
        var field = $(this).attr("data-id");
        var fieldStatus = $('#'+field).val();
        allfields.push(field);
        
        if(fieldStatus !== undefined){
            data.push({
                    id:  field,
                    label: $(this).attr("data-label"), 
                    value:  fieldStatus,
                    remark:  $('#document_remark_'+field).val()
                });
                
            if(documentStatusConfig[fieldStatus]){
                var statusConfig = documentStatusConfig[fieldStatus];
                var remarkdata = $('#document_remark_'+field).val();
                if(statusConfig.remark == 1 && remarkdata == ''){
                    $('#'+field+'_error').html("Kindly enter Remarks.");
                    $('#'+field+'_error').show();
                    error = true;
                }
            }
        }
    });
    
    
    if(typeof data == 'undefined' || data.length <= 0){
        alertPopup('Please Select Document','error');
        return;
    }
    
    if(error){
        return false;
    }  
    
    $.ajax({
        url: jsVars.FULL_URL+'/applications/changed-document-status',
        type: 'post',
        data: {'userId' : userId, 'formId':formId, 'data': data},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('div.loader-block-a').show();
        },
        complete: function () {
            $('div.loader-block-a').hide();
        },
        success: function (result) {
            var result = $.parseJSON(result);
            if(typeof result['message'] !=='undefined' && result['message'] != ''){
               if(result['message'] =='session') {
                   window.location.reload(true);
               } else {
                   alertPopup(result['message'],'error');
                   return false;
               }
            }
            
            if(result['status'] == 1){
                var allStatus = JSON.parse($("#allDocumentVerificationStatus").val());
                html += '<div><p>You have marked the Document Verfication Status for <strong>'+applicationNo+'</strong> as below:</p><div class=""><table class="table table-bordered table-condensed">';
                
                if(result['updatedData'].length > 0){
                    $.each(result['updatedData'], function (i, doc) {
                        html += '<tr class="font14"><td width="70%">'+doc.label+'</td>';
                        if(allStatus[doc.value]){
                            if(doc.value == 2){
                                var class1 = 'text-danger';
                            }else{
                                var class1 = 'text-success';
                            }
                            html += '<td class="'+class1+' text-right">'+allStatus[doc.value]+'</div>';
                        }else{
                            html += '<td class="text-muted text-right">Not Select</div>';
                        }

                        html += '</tr>';
                    }); 

                    html += '</table><div class="row margin-top-10"></div><div class="margin-top-10"><div class="toggle__checkbox small"><input type="checkbox" name="comm_doc_verification" value="1" id="comm_doc_verification"><label for="comm_doc_verification">Toggle</label>&nbsp;Send Document Verification Status Communication to Applicant</div></div><div class="row margin-top-10"><div class="col-sm-7 margin-top-5">Would you like to continue?</div><div class="col-sm-5 text-right"><button type="button" class="btn btn-sm btn-danger" style="margin:0 5px 0 0" onclick="discardVerifyDocument()">No</button><button type="button" style="margin:0" class="btn btn-sm btn-npf" id="save-verify-document" onclick="saveVerifyDocument('+userId+','+formId+',\''+applicationNo+'\',\''+action+'\')">Yes</button></div></div></div>';

                    $('#viewScheduleModalLabel').html('Document Verification Confirmation');
                    $("#viewExamScheduleModal").css('z-index', 1111111);
                    $('#save-verify-document').prop('disabled', false);
                    $("#viewExamScheduleModal .close").addClass('npf-close');
                    $("#viewExamScheduleModal .close > span").css('font-size', '24px')
                    $('#showExamScheduleList').html(html);
                    $('#viewExamScheduleModal').modal();
                }else{
                    alertPopup("Kindly mark the verification status",'error');
                    return false;
                }
            }
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function discardVerifyDocument() {
    $('#viewExamScheduleModal').modal('hide');
}

function saveVerifyDocument(userId,formId,applicationNo,action)
{
    if(userId=='' || formId=='' || applicationNo==''){
        alertPopup('Invalid Data','error');
        return;
    }
    var fieldIds = [];
    $(".doc-verification").each(function() {
        var field = $(this).attr("data-id");
        var fieldStatus = $('#'+field).val();
        if(fieldStatus !== undefined){
            fieldIds.push({
                    id: field, 
                    value:  $('#'+field).val(),
                    label:  $(this).attr("data-label"),
                    remark:  $('#document_remark_'+field).val()
                });
        }
    });
    //var remark      = $("#remark").val();
    var collegeId  = $("#college_id").val();
    $('#save-verify-document').prop('disabled', true);
    
    var sendComm = $('input[name="comm_doc_verification"]:checked').val();
    
    $.ajax({
        url: jsVars.verifyDocument,
        type: 'post',
        data: {'collegeId': collegeId, 'userId' : userId, 'formId':formId, 'applicationNo':applicationNo, 'fieldIds':fieldIds, 'sendComm':sendComm},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('div.loader-block-a').show();
        },
        complete: function () {
            $('div.loader-block-a').hide();
        },
        success: function (data) {
            var data = $.parseJSON(data);
            console.log(data)
            if(typeof data['error'] !=='undefined'){
               if(data['error'] =='session_logout') {
                   window.location.reload(true);
               } else {
                   $('#viewExamScheduleModal').modal('hide');
                   alertPopup(data['error'],'error');
                   return false;
               }
            }
            
            if(data['status'] == 1){
                if(action == 'profile'){
                    $('#viewExamScheduleModal').modal('hide');
                    getApplicantDocuments();
                }else{
                    $('#viewExamScheduleModal').modal('hide');
                    $("#document-details").modal('hide');
                }   
                alertPopup('Document Updated Successfully','success');
            }
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
