/*$(document).ready(function () {
    
    $('#StartDate,#EndDate').datepicker({startView : 'month', format : 'd M yyyy', enableYearToMonth: true, enableMonthToDay : true});
});
*/
$(document).ready(function () {
    $('#search_common').keypress(function (e) {
    var key = e.which;
    if(key === 13)  // the enter key code
     {
        LoadMoreActivityLogs('reset');
        return false;
     }
    });
    
    $('#search_common_webhook').keypress(function (e) {
    var webhookkey = e.which;
    if(webhookkey === 13)  // the enter key code
     {
        loadWebhookLogs('reset');
        return false;
     }
    });
    
    $("#communicationGroup").on("click", function(){
        window.location.href = jsVars.communicationLogsUrl;
    });
    $("#webhooksGroup").on("click", function(){
        window.location.href = jsVars.webhookLogsUrl;
    });
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
    } else {
        $(selector_parent).modal();
    }
}

// function: Get All Forms of a College
function GetAllRelatedForms(CollegeId, Condition,communication_for,form_id) {
    
    if(typeof jsVars.onlyCrmEnable!='undefined' && jsVars.onlyCrmEnable==1){
        return false;
    }
    
    if(typeof form_id =='undefined'){
        form_id = 0;
    }
    if(typeof communication_for !== 'undefined' && communication_for=='offline_lead') {
        
    } else {
        restvalues();//rest values on collge dropdown changes
    }
    if (CollegeId && Condition) {
        $.ajax({
            url: jsVars.GetAllRelatedFormUrl,
            type: 'post',
            data: {CollegeId: CollegeId, Condition: Condition},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json)
            {
                if (json['redirect'])
                    location = json['redirect'];
                else if (json['error'])
                    alertPopup(json['error'], 'error');
                else if (json['success'] == 200) {
                    var html = "<option value=''>All Forms</option>";
                    for (var key in json["FormList"]) {
                        html += "<option value='" + key + "'>" + json["FormList"][key] + "</option>";
                    }

                    //alert(html);
                    $('#FormIdSelect').html(html);
                    if(form_id !== 0){
                        $('#FormIdSelect').val(form_id);
                    }
                    $('#FormIdSelect').trigger('chosen:updated');
                    
                    //Dynamically add Onchange attributes in form dropdown list
                    //$('#FormIdSelect').attr('onchange','getUserListByCollegeId($("#CollegeIdSelect").val(),this.value,\'\')');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
}

//Funcion: Load More Activity Log 
var Page = 1;
function LoadMoreActivityLogs(type) 
{
    $("#college_error").html('');
    if (type == 'reset') {
        if($('#CollegeIdSelect').val()=='') {
            $("#college_error").html('Please Select Institute');
            return false;
        }else{
          Page = 0; 
          $('#load_more_results').html("");
          $('#load_more_results_msg').html("");
        }
        $('#selectionRow, .downloadBtn').hide();
    }
    var search_common = $('#search_common').val();
    var data = $('#ActivityLogFilterForm').serializeArray();
    data.push({name: "page", value: Page});
    data.push({name: "search", value: search_common});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-spin fa-refresh" aria-hidden="true"></i>&nbsp;Loading...');
    var showWebhook = $('#comm-tab').attr('style');
    $.ajax({
        url: jsVars.LoadMoreCommunicationLogsUrl,
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: data,
        beforeSend: function (xhr) {
            $('#listloader').show();
            $('#searchList').prop("disabled",true);
			$('.daterangepicker_report').prop('disabled', true);
                        $("#comm-tab").hide();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            data = data.replace("<head/>", '');
            Page = Page+ 1;
            if(data == "session_logout"){
               window.location.reload(true);
            }else if (data == "error") {
                if(Page>1) {
                    $('#load_more_results > tbody').append('');
                } else {
					$('#load_msg_div').show();
                    $('#load_msg').html('<div class="noDataFoundDiv"><div class="innerHtml"><img src="/img/no-record.png" alt="no-record"><span>No Data Found</span></div></div>');
                }
                if(showWebhook === ''){
                    $("#comm-tab").show();
                }
                $('#load_more_button').hide();
                if (type != '' && Page==1) {                    
                    $('#if_record_exists').hide();
                  }
            }
            else {
                if (type != '') {
                    $('#if_record_exists').fadeIn();
                }
                
                $('#load_more_button').show();
                $('.table-border').removeClass('hide');
                if(Page==1) {
                    $('#load_more_results').append(data);
					dropdownMenuPlacement();
					table_fix_rowcol();
					$('#selectionRow, .downloadBtn').show();
                } else {
                    $('#load_more_results > tbody > tr:last').after(data);
					dropdownMenuPlacement();
					table_fix_rowcol();
                }
				$('#load_msg_div').hide();
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Logs');
            }
            $('.offCanvasModal').modal('hide');
            $('[data-toggle="tooltip"]').tooltip();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
            $('#searchList').prop("disabled",false);
            $('.daterangepicker_report').prop('disabled', false);
           // table_fix_rowcol(); 
        }
    });
}

//Funcion: Get Pop up data
function GetPopupData(LogId,Section)
{
    $.ajax({
        url: jsVars.GetCommunicationsLogPopupDataUrl,
        type: 'post',
        dataType: 'html',
        data: {
            LogId: LogId,
            Section: Section
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function() {
            $('#listloader').show();
        },
        complete: function() {
            $('#listloader').hide();
        },
        success: function (html) {
            if(html == 'session')
            {
                alertPopup('User session has expired.','error');
            }
            
            if(html == 'error')
            {
                alertPopup('Unable to process request.','error');
            }
            else if(html == 'empty')
            {
                alertPopup('No data found.','error');
            }
            else
            {
                var Title = 'Alert';
                if(Section == 'report')
                {
                    Title = 'Delivery Report';
                }
				else if(Section == 'download_data')
                {
                    Title = 'Download Data';
                }
                else if(Section == 'preview')
                {
                    Title = 'Preview';
                }
                else if(Section == 'json_criteria')
                {
                    Title = 'Search Criteria';
                }else if(Section == 'debug')
                {
                    Title = 'Debug Log';
                }
                $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
                //$('#ActivityLogPopupTitle').text(Title);
                $('#ActivityLogPopupArea h2').html(Title);
                $('#ActivityLogPopupHTMLSection').html(html);
                $('#ActivityLogPopupLink').trigger('click');
				$('#ActivityLogPopupArea .modal-dialog').addClass('modal-lg');
                if(Section=='download' || Section=='download_data') {
                    $(".modalButtonDR").trigger('click');
					$("#myModalDR").hide();
                }
				if(Section=='report') {
					$("#myModalDR").hide();
					$('.modalButtonDR').on('click', function(e) { 
						setTimeout(function(){
							$("#myModalDR").hide();
						}, 1000);
					});
				}
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/*This function will return all user list as per college id*/
function getUserListByCollegeId(collegeId,formId,sel_value) {
    if ($.trim(collegeId)>0) {
        $.ajax({
            url: '/communications/get-all-assigned-user',
            type: 'post',
            data: {s_college_id: collegeId,form_id:formId,skip_email:1,entity_type:'college'},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json)
            {
                if (json['error'] == "session") {
                    location = json['redirect'];
                } else if(json['status'] == 200) {
                    var html='<option value="">Sent By</option>';
                    if( json['option'] !='') {
                        html+=json['option'];
                    }
//                    else if(typeof sel_value!='undefined' && sel_value!=''){
//                        html+="<option value='"+sel_value+"' selected>"+jsVars.userName+"<\option>";
//                    }
                    
                    $('#created_by').html(html);
                    $('.chosen-select').chosen();
                    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                    $('.chosen-select').trigger('chosen:updated');
                    
                    //If value is selected in the dropdown then set this value as selected
//                    if (typeof sel_value != 'undefined') {
//                        $("#created_by option[value='"+sel_value+"']").attr("selected","selected");   
//                        $('.chosen-select').chosen();
//                        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
//                        $('.chosen-select').trigger('chosen:updated');
//                    }                    
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
}
    /*Download Communcation log excels*/
    function communcationExcelsDownload() {
        var $form = $("#ActivityLogFilterForm");
        var action  = $form.attr("action");
        $form.attr("action",'/communications/download-excel');
        var onsubmit_attr = $form.attr("onsubmit");
        $form.submit();
        $form.attr("onsubmit",onsubmit_attr);
        $form.attr("action",action);
        return false;
    }
    /*
 * This function will return all list name as per college id
 * @param {int} college_id
 * @returns {undefined}
 */
function getAllListnameByCollegeId(college_id,div_id,selected) {
    
    $.ajax({
        url: '/offline/getAllListnameByCollegeId',
        type: 'post',
        dataType: 'json',
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        data: {'college_id':college_id},
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
        },
        success: function (json) {
            if(typeof json['session_error'] !='undefined' && json['session_error']=='session_logout'){
               window.location.reload(true);
            }
            /*
            if(typeof json['error'] !='undefined' && json['error']!=''){
               alertPopup(json['error'], 'error');
            }
            */
           var $el = $('#'+div_id);
               $el.empty();
               if(div_id != 'segment-list') {
                    $el.append($("<option>Marketing Lead List</option>").attr("value", ""));
                }    
            
            //If record found
            if(typeof json['data'] !='undefined' && json['data'] != '') { 
                $.each(json['data'], function(key, value) {
                    $el.append($("<option></option>")
                                   .attr("value",value['id'])
                                   .text(value['name']));
               });               
            } 
             $('.chosen-select').trigger('chosen:updated');
            if($.trim(selected)!='') {
               $el.val(selected).val();
               $el.trigger("chosen:updated");
            }
            if(div_id == 'segment-list') {
                $('#'+div_id)[0].sumo.reload(); 
            }
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
$(document).on('change', '#CommunicationForSelect', function () {
//        $(".hideofflinesegment").hide();
        var collegeg_id = $("#CollegeIdSelect").val();
        if(typeof collegeg_id != 'undefined' && collegeg_id != ''){
            if(typeof this.value != 'undefined'){
                OfflineListShow(this.value);
            }else{
                return false;
            }
        }
        
        return false;
    });
/*
 * call segment  list name by list id
 */
function OfflineListShow(showlead){
    $(".automationListSegment").hide();
    $('#offlineListType').val('');
    $("#automationList").val('');
    $('#segemntofflineList').html('<option value="">List or Segment List</option>');
    
    if(typeof showlead != 'undefined' && showlead == 'offline_lead'){
        //$(".hideofflinesegment").show();        
    }
    else if(typeof showlead != 'undefined' && showlead == 'automation'){
//        $(".hideofflinesegment").hide();
        $(".automationListSegment").show();
    }
    $('.chosen-select').trigger('chosen:updated');
 }
//segment and list drpdownlist call 
$(document).on('change', '#offlineListType', function () {
    $('#segemntofflineList').html('<option value="">List or Segment List</option>');
    $('.chosen-select').trigger('chosen:updated');
       collegeg_id=$("#CollegeIdSelect").val();
        if(typeof collegeg_id != 'undefined' && collegeg_id != ''){
            if (typeof this.value != 'undefined') {
                if(this.value == 'list'){
                   getAllListnameByCollegeId(collegeg_id,'segemntofflineList'); 
                }else if(this.value == 'segment'){
                    callSegmentListname(collegeg_id,'segemntofflineList');
                }

            }
        }
        return false;
        
});
 /* This function will return all list name as per college id
 * @param {int} list_id
 * @param div_id display data id
 * @returns {undefined}
 */

function callSegmentListname(college_id,div_id,selected) {
    
    $.ajax({
        url: '/offline/getSegmentListname',
        type: 'post',
        dataType: 'json',
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        data: {"college_id":college_id},
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
        },
        success: function (json) {
            if(typeof json['session_error'] !='undefined' && json['session_error']=='session_logout'){
               window.location.reload(true);
            }
            if(typeof json['error'] !='undefined' && json['session_error']=='error'){
               alertPopup(json['error'], 'error');
            }
            var $el = $('#'+div_id);
               $el.empty();
            
            //If record found
            $el.append($("<option></option>")
                                   .attr("value",'')
                                   .text("Segment List"));
            if(typeof json['data'] !='undefined' && json['data'] != '') { 
                $.each(json['data'], function(key, value) {
                    $el.append($("<option></option>")
                                   .attr("value",value['id'])
                                   .text(value['name']));
               });               
            } 
            $el.trigger("chosen:updated");
            if($.trim(selected)!='') {
               $el.val(selected).val();
               $el.trigger("chosen:updated");
            }
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
/*
 * rest values on collge dropdown changes
 */
function restvalues(){
    $('#if_record_exists').hide();
    $('#load_more_button').hide();
    $('#selectionRow, .downloadBtn').hide();
	$('.table-border').addClass('hide');
	$('#load_msg_div').show();
    $("#load_msg").html("<span class='lineicon-43 alignerIcon'></span><br>Please select college to view log listing.");
    $('#tot_records').html("Total <strong>0</strong> &nbsp; Records");
//    $(".hideofflinesegment").hide();
    $('#CommunicationForSelect').val('');
    $('#offlineListType').val('');
    
    //$('#TypeSelect').val('');
    
    var $el = $('#TypeSelect');
    $el.empty();
    $.each(jsVars.communicationList, function(key, value) {   
        $el.append($("<option></option>")
                       .attr("value",key)
                       .text(value));
    });
    
    $('#CommunicationStatus').val('');
    
    //$('#commType').val(jsVars.communicationType);
    
    var $el = $('#commType');
    $el.empty();
    $.each(jsVars.communicationType, function(key, value) {   
        $el.append($("<option></option>")
                       .attr("value",key)
                       .text(value));
    });

    $('#segemntofflineList').html('<option value="">List or Segment List</option>');
    $('#FormIdSelect').html('<option value="">Form</option>');
    $('.chosen-select').trigger('chosen:updated');
    $("#commDate").val('');
    
    //Empty Communication Summary
    $('#show_expense_detail').html('');
    $('#load_more_results_msg').empty();
}

/*For Stop List Action*/
function stopAction(logidcollege,id){
        
        $("#confirmYes").removeAttr('onclick');
        $('#confirmTitle').html("Confirm close action");
        $("#confirmYes").html('Ok');
        $("#confirmYes").siblings('button').html('Cancel');

        $('#ConfirmMsgBody').html('Are you sure you want to Close this Job#'+id+'?');
        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                e.preventDefault();
                $.ajax({
                    url: '/communications/stop-job-id',
                    type: 'post',
                    data: {'data':logidcollege},
                    dataType: 'json',
                    headers: {
                        "X-CSRF-Token": jsVars._csrfToken
                    },
                    beforeSend: function () {
                        $('#listloader').show();
                    },
                    complete: function () {
                        $('#listloader').hide();
                    },
                    success: function (json) {
                        if (typeof json['session_error'] !='undefined' && json['session_error'] !='') {
                            alertPopup(json['session_error'], 'error');
                        } else if (typeof json['error'] !='undefined' && json['error'] !='') {
                            alertPopup(json['error'], 'error');
                        } else if (typeof json['status'] !='undefined' && json['status'] == 200) { 
                            alertPopup(json['data']['sucess'], "success");
                            //Load the result
                            LoadMoreActivityLogs('reset');
                        }
                        return false;
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);                        
                    }
                });
                $('#ConfirmPopupArea').modal('hide');
            });
        return false;
    }
    /*
     * save saveRetargeting
     */
function saveRetargeting(){
    job_log_id =jsVars.job_log_id;
    college_id =$("#s_college_id").val();
    log_id =$("#log_id").val();
//    if(typeof college_id =='undefined' || college_id.length==0){
//        alertPopup("Please select Institute Name", 'error');
//        return false;
//    }
//    if(typeof log_id =='undefined' || log_id.length==0){
//        alertPopup("Please select Job Id", 'error');
//        return false;
//    }
    //start validation for condtion and select values
    validation_status = false;
    validation_status = vaildationCondition();
    if(validation_status ==false){
        return false;
    }
    //end va;lidation
    if(typeof job_log_id !="undefined" && job_log_id !=""){
        var data = $('#RetargetingCreationForm').serializeArray();
        $("#confirmYes").removeAttr('onclick');
        $('#confirmTitle').html("Confirm Create action");
        $("#confirmYes").html('Ok');
        $("#confirmYes").siblings('button').html('Cancel');

        $('#ConfirmMsgBody').html('Are you sure you create new Retargeting for this Job#'+job_log_id+'?');
        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                e.preventDefault();
                $.ajax({
                    url: '/communications/save-retargeting',
                    type: 'post',
                    data: data,
                    dataType: 'json',
                    headers: {
                        "X-CSRF-Token": jsVars._csrfToken
                    },
                    beforeSend: function () {
                        $('#listloader').show();
                    },
                    complete: function () {
                        $('#listloader').hide();
                    },
                    success: function (json) {
                        if (typeof json['session_error'] !='undefined' && json['session_error'] !='') {
                            alertPopup(json['session_error'], 'error');
                        } else if (typeof json['error'] !='undefined' && json['error'] !='') {
                            alertPopup(json['error'], 'error');
                        } else if (typeof json['status'] !='undefined' && json['status'] == 200) { 
                            alertPopup(json['data']['sucess'], "success");
                            if(typeof json['data']['url'] !='undefined' && json['data']['url'] !=''){
                                window.location.href = json['data']['url'];
                              
                            }
                         }
                        return false;
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);                        
                    }
                });
                $('#ConfirmPopupArea').modal('hide');
            });
        return false;
    }else{
        return false;
    }
    
}

$(document).ready(function () {
/**
    * This is for Export data using batch as per dynamic condition
    */
   if (typeof pageType !='undefined') {
       switch(pageType) {
           
           case 'communications_log':
               var filterOption = jsVars.filterOption;//only all filter key
               if(filterOption.length > 0){
                  filterSelectFromUrl();
               }
               break;
        }
    }
});
   /*
 * select filter for get value form url
 */
function filterSelectFromUrl() {
    
    //get filter from url varaibles segemnt_offline_list
    var filterOption = jsVars.filterOption;//only all filter key
    var url_filter = jsVars.url_filter;// all filter array with key=>value
    if (filterOption.length > 0) {//check length of filter array
        for (var i = 0; i < filterOption.length; i++) {
            var key = filterOption[i];
            if ($('input[name="' + key + '"]').length) {//text box
                $('input[name="' + key + '"]').val(url_filter[filterOption[i]]);
             } else if ($('select[name="' + key + '"]').length) {//dropdown
                if(key == 'offline_list_type'){
                    $('select[name="segment_offline_list"]').val(jsVars.segment_offline_list);
                }else{
                   $('select[name="' + key + '"]').val(url_filter[filterOption[i]]); 
                }
                
            }
            $('select').trigger('chosen:updated');//update dropdown
        }
    }
    callTrigger("id", "searchList");//call search button tigger
}
/*
 * function user for tigger call
 * attrtype means id or class
 * attrname  id or classs name
 * 
 */
function callTrigger(attrtype, attrname) {
    var t = '';
    if (attrtype == 'id') {
        t = $("#" + attrname)
    } else if (attrtype == 'class') {
        t = $("." + attrname)
    } else {
        t = attrtype;
    }

    t.trigger('click');
}

/*
 * function user for get jogids by collge id
 *
 */
function getJobIdByCollegeId(collegeId,sel_value) {
    $("#log_subject").html("");
    $("#log_email_template_id").html("");
    $("#log_id").html("<option value=''>Job Id</option>");
    $('.chosen-select').trigger('chosen:updated');
    if ($.trim(collegeId)>0) {
        var data = $('#RetargetingCreationForm').serializeArray();
        $.ajax({
            url: '/communications/getJobIdByCollegeId',
            type: 'post',
            data: data,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json)
            {
                if (json['redirect'])
                    location = json['redirect'];
                else if (json['error'])
                    alertPopup(json['error'], 'error');
                else if (json['success'] == 200) {
                    
                        html =json["joblist"];
                    $('#log_id').html(html);
                    $('.chosen-select').chosen();
                    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                    $('.chosen-select').trigger('chosen:updated');
                    
                    //If value is selected in the dropdown then set this value as selected
                    if (typeof sel_value != 'undefined') {
                        $("#log_id option[value='"+sel_value+"']").attr("selected","selected");   
                        $('.chosen-select').chosen();
                        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                        $('.chosen-select').trigger('chosen:updated');
                    }                    
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
}
/*
 * get log detail
 */
function getlogDetail(logid) {

    if ($.trim(logid)>0) {
        var data = $('#RetargetingCreationForm').serializeArray();
        $.ajax({
            url: '/communications/getLogDeatilByLogId',
            type: 'post',
            data: data,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json)
            {
                if (json['redirect'])
                    location = json['redirect'];
                else if (json['error'])
                    alertPopup(json['error'], 'error');
                else if (json['success'] == 200) {
                    $('#log_subject').html(json["subject"]);
                    if(json["template_url"] !=''){
                       $('#log_email_template_id').html('<a href="'+json["template_url"]+'" target ="_blank">Click here</a>'); 
                    }else{
                        $('#log_email_template_id').html('');
                    }
                    
                   
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
}

$(document).on('click', '#make_another_criteria', function () {
    var MAX_DIV=10;
        var div = $("div.search_criteria:first");//first div
        var cloned = div.clone();
        $(cloned).find('.chosen-container').remove(); //  remove chosen dropdown hidden div
        var total_div=$(".search_criteria").length;//count div
        if(total_div >= MAX_DIV){
            return false;
        }
        $(".search_criteria:last").after(cloned);
        var new_div='adv_filter_row_'+(total_div+1)+parseInt(new Date().getUTCMilliseconds());
        $(".search_criteria:last").attr('id',new_div);
        $("#"+new_div).find(".error_include").html("");
        $("#"+new_div).find(".error_condition_selected").html("");
        $(cloned).hide(); // this is for effect.
        $(cloned).fadeIn('slow'); // this is for effect.
        $('.chosen-select').chosen();
        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        $(".search_criteria:last").trigger('chosen:updated');
    });
    
    //remove div
  function Removerow(elem){
    //Check if any div exist with these class
    var total_row=$('div.search_criteria').length;
    if(total_row==1){
        var div_id=$(elem).parent('div').parent('div').parent('div').attr('id');
        $('#'+div_id).attr('id','adv_filter_row_1');
    }
    if(total_row >1) {
        if(typeof $(elem).parent('div').parent('div').attr('id') !='undefined') {
            var div_id=$(elem).parent('div').parent('div').attr('id');
            $('#'+div_id).remove();
        }
    }
}
/*
 * view count by condtion for retargeting
 */
function viewCount() {
    validation_status = false;
    validation_status = vaildationCondition();
    if(validation_status ==false){
        return false;
    }
    var data = $('#RetargetingCreationForm').serializeArray();
    $.ajax({
            url: '/communications/view-count',
            type: 'post',
            data: data,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
				$('#listloader').show();
			},
            complete: function () {
                $('#listloader').hide();
            },
            success: function (json)
            {
                $("#div_view_count").show();
                if (json['redirect'])
                    location = json['redirect'];
                else if (json['error'])
                    alertPopup(json['error'], 'error');
                else if (json['success'] == 200) {
                    $('#div_view_count').html('<label id="view_count" class="view_count">'+json['count']+'</label>'); 
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('#listloader').hide();
            }
        });
}
/*
 * validation retargating condtion validation
 */
function vaildationCondition(){
    $('label.error_include').html(''); //Initially blank this html
    $('label.error_condition_selected').html(''); //Initially blank this html
    
    var total_error=0;
    
    //Iterate all the div
    $('.group-container > div').each(function(index,value) {
        
        //Skip first index because it is displaying text
        if(index>0) { 
            
            //If selected dropdown is blank then display error message
            if($.trim($(this).find('div > select.include_exclude').val()) =='') {
                $(this).find('div > label.error_include').html('<span class="segment-name-error error">Please select values</span>');
                total_error++;
            }
            
            //If selected dropdown is blank then display error message
            if($.trim($(this).find('div > select.condition_selected').val()) =='') {
                $(this).find('div > label.error_condition_selected').html('<span class="segment-name-error error">Please select condition</span>');
                total_error++;
            }            
        }      
    });
    
    if(total_error >0) {
        return false;
    } else {
        return true;
    }
}

function RetargetMsgPreview(ctype,msg_type){
    var email_content = $("#log_old_email_body").val();//old email content
    var subject = $("#log_old_subject").val();//old Subject
    var template_id = $("#log_old_template_id").val();//old Template Id
    if(ctype == "preview"){
     $('#blockEditorAction').modal();  
   }else if(ctype =="save"){
       
        if(typeof CKEDITOR.instances['editor'] != 'undefined'){
         email_content = CKEDITOR.instances['editor'].getData();///new content
        }
                
        var error='';
        if(msg_type=='email') {
            if($.trim($('#subject').val())=='') {
                error+='Please enter subject.<br />';
            }
        }
        
        if($.trim(email_content)=='') {
           error+='Please enter body.';
        }
        
       
        if(error!='') {
            alertPopup(error,"error");
            return false;
        } else {            
            $("#log_new_email_body").html(email_content);
            $("#log_new_subject").val(subject);
            $("#log_new_template_id").val(template_id);
            
            if(msg_type=='email') {
                $("#log_subject").html($("#subject").val()+'<br />');
            } else {
                $("#log_subject").html('');
            }
          // alertPopup("Save Content","sucess");
            $('#blockEditorAction').modal("toggle");  
        }
   }
    return false;
}

function initRetargetCKEditor(tokens){
    
     if(typeof CKEDITOR == 'undefined')
     {
         return;
     }
    if(typeof tokens =='undefined' || tokens == ''){
        tokens = [["", ""]];
    }
    
    var old_data = '';
    if(typeof CKEDITOR.instances['editor'] != 'undefined'){
        var old_data = CKEDITOR.instances['editor'].getData();
        
        delete CKEDITOR.instances['editor'];
        jQuery('#cke_editor').remove();
    }    

    CKEDITOR.replace( 'editor',{
        extraPlugins: 'token',
        availableTokens: tokens,

            tokenStart: '{{',
            tokenEnd: '}}',
            on: {
                instanceReady: function( evt ) {
                    $('div.loader-block').hide();
                },
                change: function( evt ) {
                    if($("#is_edit_template").length > 0) {
                        $("#is_edit_template").val(1);
                    }
                }
        }
    });

    if(old_data != ''){
        CKEDITOR.instances['editor'].setData(old_data);
    }
}

// for ck editor for token drop down  show
 $.fn.modal.Constructor.prototype.enforceFocus = function() {
  modal_this = this
  $(document).on('shown.bs.modal', function (e) {
    if (modal_this.$element[0] !== e.target && !modal_this.$element.has(e.target).length 
    && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_select') 
    && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_text')) {
      modal_this.$element.focus()
    }
  })
};


/**
 * THis function will display expense about email/sms
 * @returns {undefined}
 */
function getCommunicationExpense(){
    if($('#CollegeIdSelect').val()==''){
        return false;
    }
    $('#emailInfoBtn').show();
    $('#smsInfoBtn').show();
    if($('#CollegeIdSelect').val() == 279){
        $('#whatsappInfoBtn').hide();
    }else{
        $('#whatsappInfoBtn').show();
    }
    if ((typeof jsVars.showEmailAndSMSConsumptionBtn != 'undefined') && (jsVars.showEmailAndSMSConsumptionBtn == 'false')) {
        $('#emailInfoBtn').hide();
        $('#smsInfoBtn').hide();
        $('#whatsappInfoBtn').hide();
    }
    
    var typevalue = $('#ActivityLogFilterForm #TypeSelect').val();
    if(typeof typevalue!='undefined' && typevalue=='all'){
//        getEmailSMSCommunicationExpenseOld(data);
    }else{
        if(typevalue === 'email'){
            $('#smsInfoBtn').hide();
            $('#whatsappInfoBtn').hide();
        }else if(typevalue === 'sms'){
             $('#emailInfoBtn').hide();
             $('#whatsappInfoBtn').hide();
        }else if(typevalue === 'whatsapp'){
             $('#emailInfoBtn').hide();
             $('#smsInfoBtn').hide();
        }
       
//      getCommunicationExpenseSingle(data);  
    }  
    
    
}

function getCommunicationExpenseSingle(data,filterTypeValue){
    $.ajax({
        url: '/communications/get-communication-expense',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},        
        beforeSend: function() {                    
            $('#listloader').show();
        },
        complete: function() {
            $('#listloader').hide();
        },
        success: function (json) {
            if(typeof json['session_logout'] !='undefined' && json['session_logout']==1){
               window.location.reload(true);
            }
            
            var final_html='';
            if(typeof json['data']['final_price_arr'] !='undefined' && json['data']['final_price_arr']!=''){
                final_html+='<div class="col-lg-12"><div class="summaryData">';
                $.each(json['data']['final_price_arr'], function (key_heading, type) {
                    
                
                    $.each(type, function (index_key, total_count) {
                        final_html+='<div class="summaryDataList">';
                        
                        if(index_key == 'Expense') {
                            total_count=' Rs  '+ total_count;
                        }
                        
                        final_html+=key_heading + ' ' + index_key + '<br> <strong class="font24">' +total_count + '</strong>';
                        final_html+='</div>';
                    });
                    
                });                
                final_html+='</div></div>';
            }
            
            if(typeof json['data']['isSmsOrEmailSent'] !='undefined' && json['data']['isSmsOrEmailSent']==1) {
                if(typeof json['data']['mongoSmsEmailTotal'] !='undefined' && json['data']['mongoSmsEmailTotal']!=''){
                    final_html+='<div class="col-lg-12"><div class="summaryData">';
                    $.each(json['data']['mongoSmsEmailTotal'], function (key_heading, type) {
                        
                        if(typeof type[0] !='undefined'){
                            type=type[0];
                        }

                        $.each(type, function (index_key, total_count) {                            
                            if(index_key!='_id' && index_key!='Percentage') {
                                final_html+='<div class="summaryDataList">';
                                final_html+=key_heading + ' ' + index_key + '<br><strong class="font24">' +total_count + '</strong>';
                                
                                if(typeof type['Percentage'][index_key] !=='undefined') {
                                    final_html+='<p class="text-muted noteBtmMsg">' +type['Percentage'][index_key] + '</p>';
                                }
                                final_html+='</div>';
                            }                             
                        });
                       
                    });                
                    final_html+='</div></div>';
                }
            }
            
//            $('#show_expense_detail').html(final_html);      
            showExpenseInPopup(final_html,filterTypeValue);
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getEmailSMSCommunicationExpenseOld(data){
    $.ajax({
        url: '/communications/get-email-sms-communication-expense',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},        
        success: function (data) {
            if(typeof data !='undefined' && data == 'session_logout'){
               window.location.reload(true);
            }
            $('#show_expense_detail').html(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
function getEmailSMSCommunicationExpense(type){
   
    if(type){
        var data = $('#ActivityLogFilterForm').serializeArray();
        var filterTypeValue = $('#ActivityLogFilterForm #TypeSelect').val();
//        if(filterTypeValue === 'sms' || filterTypeValue === 'email'){
//            getCommunicationExpenseSingle(data,filterTypeValue); 
//            return false;
//        }
        data.push({name: 'communicationType', value: type});
        
        $.ajax({
            url: '/communications/get-email-sms-expense-detail',
            type: 'post',
            dataType: 'html',
            data: data,
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function() {                    
                $('#listloader').show();
            },
            complete: function() {
                $('#listloader').hide();
            },
            success: function (data) {

                var checkError  = data.substring(0, 6);
                if (data === "session_logout") {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else if (checkError === 'ERROR:'){
                    alertPopup(data.substring(6, data.length));
                } else {
                    $("#communication_expense_div").html(data);
                    $('#communicationExpenseInfoModal').modal('show');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}


//List all automation list of college
function getCollegeAutomationList()
{
    var college_id = $('form#ActivityLogFilterForm select#CollegeIdSelect').val();
    if (college_id)
    {
        $.ajax({
            url: jsVars.getAutomationListUrl,
            data: {bypass: 'search', college_id: college_id},
            dataType: "json",
            type: "POST",
            headers: {
                "X-CSRF-Token": jsVars.csrfToken
            },
            success: function (json) {
                if(json['redirect']) {
                    location = json['redirect'];
                }
                else if(json['error']) {
                    alertPopup(json['error'],'error');
                }
                else if(json['success'] == 200) {
                    var listHtml = '<option value="" selected="selected">Select Automation List</option>';
                    if(json['listAutomation']) {
                        for(var listId in json['listAutomation']) {
                            listHtml += '<option value="'+ listId +'">'+ json['listAutomation'][listId] +'</option>'
                        }
                    }
                    $('#automationList').html(listHtml).trigger('chosen:updated');
                }
            },
            error: function (response) {
                alertPopup(response.responseText);
            },
            failure: function (response) {
                alertPopup(response.responseText);
            }
        });
    }
}

/**
 * show communication logs breakup for automation
 * @param int LogId
 * @param string Section
 * @returns {undefined}
 */

function showAutomationCommLogBreakups(LogId, Section){
    
    $.ajax({
        url: jsVars.showAutomationCommLogBreakupsUrl,
        type: 'post',
        dataType: 'html',
        data: {
            LogId: LogId,
            Section: Section
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function() {
            $('#listloader').show();
        },
        complete: function() {
            $('#listloader').hide();
        },
        success: function (html) {
            if(html == 'session'){
                alertPopup('User session has expired.','error');
            }
            
            if(html == 'error'){
                alertPopup('Unable to process request.','error');
            }
            else if(html == 'empty'){
                alertPopup('No data found.','error');
            }
            else{
                var Title = 'Alert';
                if(Section == 'report'){
                    Title = 'Report';
                }
                else if(Section == 'preview'){
                    Title = 'Preview';
                }
                else if(Section == 'json_criteria'){
                    Title = 'Search Criteria';
                }
                $('#ActivityLogPopupArea .modal-dialog').addClass('modal-lg');
                $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
                $('#ActivityLogPopupTitle').text(Title);
                $('#ActivityLogPopupHTMLSection').html(html);
                $('#ActivityLogPopupLink').trigger('click');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    }); 
}

   //Funcion: communication Get status detail
function showCommunicationStatusDetail(LogId)
{
    
    $.ajax({
        url: jsVars.GetCommunicationsStatusDetailUrl,
        type: 'post',
        dataType: 'html',
        data: {
            LogId: LogId
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function() {
            $('#listloader').show();
        },
        complete: function() {
            $('#listloader').hide();
        },
        success: function (html) {
            if(html == 'session')
            {
                alertPopup('User session has expired.','error');
            }
            
            if(html == 'error')
            {
                alertPopup('Unable to process request.','error');
            }
            else if(html == 'empty')
            {
                alertPopup('No data found.','error');
            }
            else
            {
                $('#StatusDetailPopupArea .modal-body').removeClass('text-center');
                $('#StatusDetailPopupHTMLSection').html(html);
                $('#StatusDetailPopupLink').trigger('click');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function showSmsBreakup(smsType){
    if(smsType === '2'){
        $(".combined_sms").hide();
        $(".national_sms").show();
        $(".international_sms").hide();
    }else if(smsType === '3'){
        $(".combined_sms").hide();
        $(".national_sms").hide();
        $(".international_sms").show();
    }else {
        $(".combined_sms").show();
        $(".national_sms").hide();
        $(".international_sms").hide();
    }
}

function showWhatsappBreakup(whatsappType){
    if(whatsappType === '2'){
        $(".combined_whatsapp").hide();
        $(".national_whatsapp").show();
        $(".international_whatsapp").hide();
    }else if(whatsappType === '3'){
        $(".combined_whatsapp").hide();
        $(".national_whatsapp").hide();
        $(".international_whatsapp").show();
    }else {
        $(".combined_whatsapp").show();
        $(".national_whatsapp").hide();
        $(".international_whatsapp").hide();
    }
}

function showExpenseInPopup(html , type){
    if(type === 'sms'){
        type = "SMS";
    }else {
        type = "Email";
    }
    var finalHtml = '<div class="modal fade modalCustom" tabindex="-1" role="dialog" id="communicationExpenseInfoModal">\n\
                        <div class="modal-dialog" role="document">\n\
                            <div class="modal-content">\n\
                                <div class="modal-header">\n\
                                    <button type="button" class="close npf-close" data-dismiss="modal" aria-label="Close"><span class="glyphicon glyphicon-remove"></span></button>\n\
                                    <h4 class="modal-title">'+type+' Expense Info</h4>\n\
                                </div>\n\
                            <div class="modal-body ">\n\
                                <div class="row npf-form-group">';
    finalHtml += html;
    finalHtml += '</div></div></div></div></div>';
    $("#communication_expense_div").html(finalHtml);
    $('#communicationExpenseInfoModal').modal('show');
}


/*
 *  select form_details_<form_id> for detail of table 
 *   and get all field whose type is mobile and email
 *   and append into communication for dropdown for filtering on  parent mobile and email
 */
function getFormDetailEmailMobile(formId) {
   var CollegeId = document.getElementById("CollegeIdSelect").value;
   var type = $('#TypeSelect').val();
    if (CollegeId && formId) {
        $.ajax({
            url: jsVars.getFormDetailEmailMobileUrl,
            type: 'post',
            data: {CollegeId: CollegeId, formId: formId},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json)
            {
               
                if(json['status']==200){
                    var html = "<option value=''>Communication For</option>";
                    for (var key in json['CommunicationFor']) {
                         if(key=='reg_lead'){
                            
                             html += "<optgroup label='" + json["CommunicationFor"][key]['val'] + "'>" + json["CommunicationFor"][key]['val'];
                             var subarray={};
                             subarray=  json["CommunicationFor"][key]['subArray']
                            for (var optGroupKey in subarray) {
                             html += "<option value='" + optGroupKey + "'>" + subarray[optGroupKey] + "</option>";
                             }
                             html += "</optgroup>";
                        } else {
                             html += "<option value='" + key + "'>" + json["CommunicationFor"][key] + "</option>";
                    }
                       
                    }

                    $('#CommunicationForSelect').html(html);
//                    $('#CommunicationForSelect').val(form_id);
                    $('#CommunicationForSelect').trigger('chosen:updated');                    
                    
                }
                
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
    getTemplateList(CollegeId,formId,type);
}



function GetAutomationRemovedUserCount(LogId,college_id,Section)
{
    if(typeof Section == 'undefined'){
        Section = '';
    }
    
    $.ajax({
        url: '/communications/ajax-automation-removed-user-count',
        type: 'post',
        dataType: 'html',
        data: {
            LogId: LogId,
            college_id: college_id,
            Section:Section
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function() {
            $('#listloader').show();
        },
        complete: function() {
            $('#listloader').hide();
        },
        success: function (html) {
        $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
        $('#ActivityLogPopupTitle').text('Communication');
        $('#ActivityLogPopupHTMLSection').html(html);
        $('#ActivityLogPopupLink').trigger('click');
        
        if(Section=='download' || Section=='download_data') {
            $(".modalButtonDR").trigger('click');
        }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/**
 * show remove user's breakup for automation
 * @param int LogId
 * @param string Section
 * @returns {undefined}
 */

function showAutomationRemoveUserBreakups(LogId, collegeId,Section){
    
    $.ajax({
        url: '/communications/show-automation-remove-user-breakups',
        type: 'post',
        dataType: 'html',
        data: {
            LogId: LogId,
            Section: Section,
            'collegeId':collegeId
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function() {
            $('#listloader').show();
        },
        complete: function() {
            $('#listloader').hide();
        },
        success: function (html) {
            if(html == 'session'){
                alertPopup('User session has expired.','error');
            }
            
            if(html == 'error'){
                alertPopup('Unable to process request.','error');
            }
            else if(html == 'empty'){
                alertPopup('No data found.','error');
            }
            else{
                var Title = 'Alert';
                if(Section == 'report'){
                    Title = 'Report';
                }
                else if(Section == 'preview'){
                    Title = 'Preview';
                }
                else if(Section == 'json_criteria'){
                    Title = 'Search Criteria';
                }
                $('#ActivityLogPopupArea .modal-dialog').addClass('modal-lg');
                $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
                $('#ActivityLogPopupTitle').text(Title);
                $('#ActivityLogPopupHTMLSection').html(html);
                $('#ActivityLogPopupLink').trigger('click');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    }); 
}

function getCollegeRelatedData(collegeId){
    GetAllRelatedForms(collegeId,'both');
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    getUserListByCollegeId(collegeId,'');
    getCollegeAutomationList();
    getcommCampaingTypeCategorisList(collegeId);
    var formId = $('#FormIdSelect').val();
    var type = $('#TypeSelect').val();
    getTemplateList(collegeId,formId,type);
}


var jbid;
function adminDownloadReportCSV(job_id,communication_medium ) {
    
    $('#confirmDownloadTitle').text('Download Confirmation');
    $('#ConfirmDownloadPopupArea .npf-close').hide();
    $('.confirmDownloadModalContent').text('Do you want to download the communication logs?');
    $('#ConfirmDownloadPopupArea').modal();

    $('#confirmDownloadYes').attr('id', 'confirmDownload');
    $('#confirmDownload').on('click',function() {

        $('.draw-cross').css('display','block');
        $('#ConfirmDownloadPopupArea').modal('hide');
        if (job_id == jbid) {
            return false;
        }
        $('#muliUtilityPopup').modal('show');
        $('#muliUtilityPopup .close').addClass('npf-close').css('margin-top', '2px');
        saveFormRequest(job_id, communication_medium);
        jbid = job_id;
    });
}
    
    $('#popupDismiss').on('click',function() {
        $( "#confirmDownload").unbind( "click" );
    });
    
    function saveFormRequest(job_id, communication_medium) {
            $( "#confirmDownload").unbind( "click" );
            var s_college_id = $("#CollegeIdSelect").val();
            //add more inputs
            var hiddenInput = '';
            hiddenInput += '<input type="hidden" id="job_id_hidden" name="job_id" value="' + job_id +'"/>';
            hiddenInput += '<input type="hidden" id="college_id_hidden" name="s_college_id" value="' + s_college_id +'"/>';
            hiddenInput += '<input type="hidden" id="communication_medium_hidden" name="communication_medium" value="' + communication_medium +'"/>';
            
            $("#downloadFormFields").html(hiddenInput);
            $("#ActivityLogFilterForm").attr("action", '/communications/download-comm-report-csv');
            $("#ActivityLogFilterForm").attr("target", 'modalIframe');
            $("#ActivityLogFilterForm").submit();
    }



//Funcion: Get Pop up data
function getCampaignData(LogId)
{
    $('.error').hide().html('');
    $.ajax({
        url: "/communications/get-campaign-data",
        type: 'post',
        dataType: 'html',
        data: {
            LogId: LogId
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function() {
            $('#listloader').show();
        },
        complete: function() {
            $('#listloader').hide();
        },
        success: function (html) {
            if(html == 'session') {
                window.location.reload(true);
            }
            else{
                var Title = 'Add Campaign Details';
                $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
                //$('#ActivityLogPopupTitle').text(Title);
                $('#ActivityLogPopupArea h2').html(Title);
                $('#ActivityLogPopupHTMLSection').html(html);
                $('#ActivityLogPopupLink').trigger('click');
                //$('#ActivityLogPopupArea .modal-dialog').addClass('modal-lg');
				$('.chosen-select').chosen();
				$('.chosen-select').trigger("chosen:updated");
				floatableLabel();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}



//Funcion: Get Pop up data
function saveCampaignData()
{
    $('#saveCampaignButtonId').prop('disabled',true);
    $('.error').hide().html('');
    var error = validateCampaignData();
    if(error === true){
        $('#common_error_msg').show().html('<div class="alert alert-warning radius-none"><div class="text-left">Please select either Campaign Name or Type to add Campaign Details or click on the cross button to cancel.</div></div>');
        $('#saveCampaignButtonId').prop('disabled',false);
        return false;
    }

    var formData = $('#communication-log-campaign-data').serializeArray();
    $.ajax({
        url: "/communications/save-campaign-data",
        type: 'post',
        dataType: 'json',
        data: formData,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function() {
            $('#listloader').show();
        },
        complete: function() {
            $('#listloader').hide();
        },
        success: function (json) {
            if(typeof json.error !== 'undefined' && json.error === 'session') {
                window.location.reload(true);
            }
            else if(typeof json.error !== 'undefined' && json.error !==''){
                if(json.error_field !== null && typeof json.error_field !== 'undefined'){
                    for(var fld in json.error_field){
                        $('#block_'+fld+'_span').show().html(json.error_field[fld]);
                    }
                }
                else{
                    alertPopup(json.error,'error');
                }
                $('#saveCampaignButtonId').prop('disabled',false);
            }
            else if(json.status === 200 && json.msg !==''){
                $('#ActivityLogPopupArea').modal('hide');
                alertPopup(json.msg,'success');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log('Custom server error');
        }
    });
}

function getNewCommunicationTypeForm(elem){
    if(typeof elem !== 'undefined' && elem.value === 'add_new_campaign_category'){
        $('.add_new_campaign_category').show();
    }
    else{
        $('.add_new_campaign_category').hide();
    }
    return;
}


//List all automation list of college
function getcommCampaingTypeCategorisList(college_id)
{
    if (college_id)
    {
        $.ajax({
            url: '/communications/ajax-get-all-campaign-type-categories',
            data: {college_id: college_id},
            dataType: "json",
            type: "POST",
            headers: {
                "X-CSRF-Token": jsVars.csrfToken
            },
            success: function (json) {
                if(typeof json['error'] !=='undefined' && json['error'] == 'session') {
                    window.location.reload(true);
                }
                else if(json['error']) {
                    alertPopup(json['error'],'error');
                }
                else if(json['status'] == 200) {
                    var listHtml = '<option value="" selected="selected">Select Campaign Type</option>';
                    if(json['listCommCampaignCats']) {
                        for(var listId in json['listCommCampaignCats']) {
                            listHtml += '<option value="'+ listId +'">'+ json['listCommCampaignCats'][listId] +'</option>'
                        }
                    }
                    $('#communication_campaign_category_id').html(listHtml).trigger('chosen:updated');
                }
            },
            error: function (response) {
                alertPopup(response.responseText);
            },
            failure: function (response) {
                alertPopup(response.responseText);
            }
        });
    }
}


function validateCampaignData(){
    var error = false;


    if((typeof $('#communication-log-campaign-data  #campaign_name').val() == 'undefined' || $('#communication-log-campaign-data  #campaign_name').val() == '') && (typeof $('#communication-log-campaign-data  #communication_campaign_category_id').val() == 'undefined' || $('#communication-log-campaign-data  #communication_campaign_category_id').val() == '')){
        if(typeof $('#communication-log-campaign-data  #campaign_name').val() == 'undefined' || $('#communication-log-campaign-data  #campaign_name').val() == ''){

    //        $('#block_campaign_name_span').show().html('Please enter campaign name');
            error = true;
        }

        if(typeof $('#communication-log-campaign-data  #communication_campaign_category_id').val() == 'undefined' || $('#communication-log-campaign-data  #communication_campaign_category_id').val() == ''){
    //        $('#block_communication_campaign_category_id_span').show().html('Please enter campaign detail');
            error = true;
        }
    }

    if(typeof $('#communication-log-campaign-data  #communication_campaign_category_id').val() != 'undefined' && $('#communication-log-campaign-data  #communication_campaign_category_id').val() != '' &&
            $('#communication-log-campaign-data #communication_campaign_category_id').val() == 'add_new_campaign_category'){

        if(typeof $('#communication-log-campaign-data  #add_new_campaign_category').val() == 'undefined' || $('#communication-log-campaign-data  #add_new_campaign_category').val() == '' ){
//            $('#block_add_new_campaign_category_span').show().html('Please enter campaign detail');
            error = true;
        }
    }
    return error;
}

var webhookPage = 1;
function loadWebhookLogs(type) {
    $("#college_error").html('');
    if (type == 'reset') {
        if ($('#CollegeIdSelect').val() == '') {
            $("#college_error").html('Please Select Institute');
            return false;
        } else {
            webhookPage = 0;
            $('#load_more_results').html("");
            $('#load_more_results_msg').html("");
        }
    }
    var search_common = $('#search_common_webhook').val();
    var data = $('#WebhookLogFilterForm').serializeArray();
    data.push({name: "page",value: webhookPage});
    data.push({name: "search",value: search_common});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-spin fa-refresh" aria-hidden="true"></i>&nbsp;Loading...');

    $.ajax({
        url: jsVars.LoadMoreWebhookLogsUrl,
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function (xhr) {
            $('#listloader').show();
            $('#searchList').prop("disabled", true);
            $('.daterangepicker_report').prop('disabled', true);
            $("#comm-tab").hide();
        },
        headers: {
            'X-CSRF-TOKEN': jsVars.csrfToken
        },
        success: function (data) {
            data = data.replace("<head/>", '');
            webhookPage = webhookPage + 1;
            if (data == "session_logout") {
                window.location.reload(true);
            } else if (data == "error") {
                if (webhookPage > 1) {
                    $('#load_more_results > tbody').append('');
                } else {
                    $('#load_msg_div').show();
                    $('#load_msg').html('<div class="noDataFoundDiv"><div class="innerHtml"><img src="/img/no-record.png" alt="no-record"><span>No Data Found</span></div></div>');
                }
                $("#comm-tab").show();
                $('#load_more_button').hide();
                if (type != '' && webhookPage == 1) {
                    $('#if_record_exists').hide();
                }
            } else {
                if (type != '') {
                    $('#if_record_exists').fadeIn();
                }

                $('#load_more_button').show();
                $('.table-border').removeClass('hide');
                if (webhookPage == 1) {
                    $('#load_more_results').append(data);
                    dropdownMenuPlacement();
                    table_fix_rowcol();
                    $('#selectionRow, .downloadBtn').show();
                } else {
                    $('#load_more_results > tbody > tr:last').after(data);
                    dropdownMenuPlacement();
                    table_fix_rowcol();
                }
                $('#load_msg_div').hide();
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Logs');
            }
            $('.offCanvasModal').modal('hide');
            $('[data-toggle="tooltip"]').tooltip();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
            $('#searchList').prop("disabled", false);
            $('.daterangepicker_report').prop('disabled', false);
        }
    });
}

//function templateAutoSearch(){
//    $(".chosen-select").chosen();
//    $('#template_chosen input').on('input', function(e) {
//        var college_id = $('#CollegeIdSelect').val();
//        if(college_id === '') {
//            $("#college_error").html('Please Select Institute');
//            return false;
//        }
//        $("#college_error").html('');
//        var text_val = $(this).val();
//        getTemplateList(college_id,text_val);
//    });
//}

function getTemplateList(college_id,formId='',type=''){
//    if(text_val.trim() == ''){
//        var value = '<option selected="selected" value="">Select Template</option>';
//        $('#template').html(value);
//        $('#template').chosen();
//        $('#template').trigger('chosen:updated');
//        return;
//    }
    if(college_id === '') {
        $("#college_error").html('Please Select Institute');
        return false;
    }

    $.ajax({
        url: jsVars.FULL_URL+'/communications/getTemplateList',
        type: 'post',
        dataType: 'json',
        data: {
            "collegeId":college_id,"formId":formId,"type":type
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (response) {
            var value = '<option selected="selected" value="">Select Template</option>';
            if (response.status == 200) {
                if (typeof response.template === "object") {
                    $.each(response.template, function (index, item) {
                        value += '<option value="' + index + '">' + item + '</option>';
                    });
                    $('#template').html(value);
                }
                else{
                    $('#template').html(value);        
                }
            } else {
                if(typeof response.redirect!='undefined' && response.redirect!=''){
                    location = response.redirect;
                }
                $('#template').html(value);
            }
            //$('#template').chosen();
            $('#template').trigger('chosen:updated');
            //$('#template_chosen input').val(text_val);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$(document).on('change','#TypeSelect',function(){
    var college_id = $('#CollegeIdSelect').val();
    var formId = $('#FormIdSelect').val();
    var type = $(this).val();
    //if(type !='' && college_id!=''){
       getTemplateList(college_id,formId,type);
    //}
});
function GetPopupDataIframe(LogId,Section){
    if (LogId > 0){
        var html = getIframeTemplate(LogId,Section);
        $('#templatePreviewModal .modal-body').addClass('customBodyHeight').css({"height": "calc(100% - 100px)", "padding-bottom": "15px","overflow":"hidden"});
        $('.modal-backdrop+.modal-backdrop').hide();
        $('[data-toggle="tooltip"]').tooltip();
        $('#OkBtn').hide();
        $('.modal-backdrop').addClass('in');
        $('#templatePreviewModal #MsgBody').html(html).css({"margin":"0","height":"100%"});
        if(typeof $('#template_title').val()!='undefined' && $('#template_title').val()!=''){ 
            var title = $('#template_title').val();
        }else{ 
            var title = 'Template Preview'; 
        }
        $('#templatePreviewModal h2#templatePreviewModalLabel').html('<span class="templatename" data-toggle="tooltip" title="'+title+'" data-placement="bottom">'+title+'</span><span class="versionname margin-left-8">(v'+$("#version_"+LogId).text()+')</span>');
        $('.template-preview-dropdown').addClass('hide');
        setTimeout(function(){
            $('#templatePreviewModal #MsgBody iframe').show();
            $('.iframeloader').css('background-image', 'url("")');
        }, 1000);
    } else{
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
}

function getIframeTemplate(LogId,Section='') {
    var returnHTML = '';
    $.ajax({
        url: jsVars.GetCommunicationsLogPopupDataUrl,
        data: {LogId: LogId,Section: Section},
        dataType: "html",
        async: false,
        cache: false,
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('body div.loader-block').show();
            $("#ConfirmPopupArea").modal('hide');
        },
        complete: function () {
            $('body div.loader-block').hide();
        },
        //contentType: "application/json; charset=utf-8",
        success: function (html) {
            if (html == 'session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if (html == 'invalid_request') {
                returnHTML = 'We got some error, please try again later.';
                alertPopup(returnHTML, 'error');
            }
            else {
                returnHTML = html;
            }
       },
       error: function (response) {
           alertPopup(response.responseText);
       },
       failure: function (response) {
           alertPopup(response.responseText);
       }
   });
   return returnHTML;
}