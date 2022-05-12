//User Productivity Data Page Js
var productivityDataPage = 0;
$(document).ready(function () {
    $("#filter").appendTo("#FilterProductivityForm");
    modalFix();
    LoadReportDateRangepicker();
    var CollegeId= $('#sCollegeId').val();
    var currentStage = '';
    var sUserId = '';
    if (typeof jsVars.sUserId !== 'undefined') {
        sUserId = jsVars.sUserId;
    }
    if (typeof jsVars.sStageId !== 'undefined') {
        currentStage = jsVars.sStageId;
    }
    if(CollegeId != '') {
        GetUsersByCollegeId(sUserId);
        getLeadStages(currentStage);
        LoadMoreProductivityData('reset', sUserId, currentStage);
    }

});

$(document).on('change', '#sCollegeId', function () {
    var CollegeId= $('#sCollegeId').val();
    if(CollegeId == '') {
        $('#sUserId').html('<option value="">Select User</option>').trigger('chosen:updated');
        $('#stageIds').html('<option value="">Select Stage</option>').trigger('chosen:updated');
        return false;
    }
    GetUsersByCollegeId();
    getLeadStages();
});

$('button.down-excl-btn').on('click', function (e) {
    e.preventDefault();
    $('div#ConfirmDownloadPopupArea #confirmDownloadTitle').text('Download Confirmation');
    $('div#ConfirmDownloadPopupArea #ConfirmDownloadMsgBody').text('Do you want to download the productivity logs ?');
    $('div#ConfirmDownloadPopupArea .modal-header .draw-cross').css({
		'font-size': '14px',
		'top': '5px',
		'position': 'relative',
	})
	$('div#ConfirmDownloadPopupArea').modal();
    //exportProductivityDataLog();
});

$(document).on('click', 'div#ConfirmDownloadPopupArea a#confirmDownloadYes', function (e) {
    e.preventDefault();
    $('div#ConfirmDownloadPopupArea').modal('hide');
    exportProductivityDataLog();
});

function alertPopup(msg, type, location) {
    var selector_parent, selector_titleID, selector_msg, title_msg, btn;
    if (type == 'error') {
        selector_parent = '#ErrorPopupArea';
        selector_titleID = '#ErroralertTitle';
        selector_msg = '#ErrorMsgBody';
        btn = '#ErrorOkBtn';
        title_msg = 'Error';
    } else {
        selector_parent = '#SuccessPopupArea';
        selector_titleID = '#alertTitle';
        selector_msg = '#MsgBody';
        btn = '#OkBtn';
        title_msg = 'Success';
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

$(document).on('click', '.ivr-log-details', function(){
    var mongoid = $(this).data('mid');
    var cid = $(this).attr('title');
    var vender = $(this).data('vender');
    if(typeof mongoid !='undefined' && mongoid!=''){
        $.ajax({
            url: jsVars.getIvrDetailsLink,
            data: {mongoId: mongoid,collegeId: cid,vender:vender},
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
            success: function (data) {
                if (data === 'session_logout'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }
                data = data.replace("<head/>", '');
                $('#ActivityLogPopupArea .modal-title').html('Call Logs');
                $('#ActivityLogPopupHTMLSection').html(data);
                $('#ActivityLogPopupArea').modal({backdrop: 'static', keyboard: false});
                //$('#ActivityLogPopupArea .modal-header').css('background-color', '#a0c348');
                $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
                //$('#ActivityLogPopupArea .modal-dialog').css('width', '600px');
            },
            error: function (response) {
                alertPopup(response.responseText);
            },
            failure: function (response) {
                alertPopup(response.responseText);
            }
        });
    }else{
        alertPopup('Id not found');
    }
});

function getLeadStages(currentStage) {
    if($('#sCollegeId').val() === '') {
        return false;
    }
    
    if (typeof currentStage === 'undefined') {
        currentStage = '';
    }
    var selectedKey = '';
    $.ajax({
        url: jsVars.getLeadStagesLink,
        type: 'post',
        data: {collegeId:$("#sCollegeId").val(), moduleName:'lead', userId : 'bulk'},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        success: function (json) {
            if (json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(json['status'] == 1) {
                if (typeof json['data'] === "object") {
                    var stageList           = json['data']['stageList'];
                    //var subStageConfigure   = json['data']['subStageConfigure'];
                    //var leadSubStageList    = json['data']['subStageList'];
                    
                    if(typeof stageList === "object") {
                        $('#stageIds').html('');
						$('#stageIds').SumoSelect({placeholder: 'Select Stage', search: true, searchText:'Search Stage', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false }); 
                        $('#stageIds')[0].sumo.reload();
                        //var leadStages = '<option value="">Select Stage</option>';
                        $('#stageIds')[0].sumo.add("", "Select Stage");
                        for(var index in stageList) {
                            //leadStages += '<option value="'+ index + '">'+ stageList[index] +'</option>';
                            if(index == currentStage) {
                                selectedKey = index;
                            }
                            $('#stageIds')[0].sumo.add(index, stageList[index]);
                        }
                        //$('#stageIds').html(leadStages);
                        //$('#stageIds').val(currentStage).trigger('chosen:updated');
                        $('#stageIds')[0].sumo.selectItem(selectedKey);
                    }
                }
            }
            floatableLabel();
            updateFilter();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function GetUsersByCollegeId (selectedUserId) {
    var CollegeId= $('#sCollegeId').val();
    if(CollegeId == '') {
        //$('#sUserId').html('<option value="">Select User</option>').trigger('chosen:updated');
        $('#sUserId').html('');
        $('#sUserId')[0].sumo.reload();
        $('#sUserId')[0].sumo.add("", "Select User");
        $('#sUserId')[0].sumo.selectItem(0);
        return false;
    } else {
        var selectedUser;
        var selectedKey = 0;
        if (typeof selectedUserId == 'undefined') {
            selectedUser = '';
        } else {
            selectedUser = selectedUserId;
        }
        $.ajax({
            url: jsVars.GetCollegeAssociatedUsersUrl,
            type: 'post',
            data: {CollegeId: CollegeId, defaulUserAccess : 1, onlyCollegeUsers : 1, staffNoAssignedChild : 1},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json)
            {
                if (json['redirect']) {
                    location = json['redirect'];
                } else if (json['error']) {
                    alertPopup(json['error'], 'error');
                } else if (json['success'] == 200) {
                    //var html = '<option value="">Select User</option>';
                    $('#sUserId').html('');
                    $('#sUserId').SumoSelect({placeholder: 'Select User', search: true, searchText:'Search User', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
                    $('#sUserId')[0].sumo.reload();
                    $('#sUserId')[0].sumo.add("", "Select User");
                    for (var key in json["UsersList"]) {
                        //html += "<option value='" + key + "'>" + json["UsersList"][key] + "</option>";
                        if(key == selectedUser) {
                            selectedKey = key
                        }
                        $('#sUserId')[0].sumo.add(key, json["UsersList"][key]);
                    }
                    //$('#sUserId').html(html);
                    //$('#sUserId').val(selectedUser).trigger('chosen:updated');
                    $('#sUserId')[0].sumo.selectItem(selectedKey);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
}

function resetProductivityDataForm() {
    filterResetModal();
    var html = '<option value="">Select User</option>';
    $('#sUserId').html(html).trigger('chosen:updated');
}

function LoadMoreProductivityData(type, sUserId, currentStage) {
    var CollegeId= $('#sCollegeId').val();
    var activityOn = $('#activityOn').val();
    if(CollegeId == '') {
        $('#sUserId').html('<option value="">Select User</option>').trigger('chosen:updated');
        if (type == 'reset') {
            $('#load_msg').html("Please select an Institute Name from filter and click apply to view productivity data.");
            $('#load_more_button').hide();
            $('#load_more_results').html('')
            $('.tableNew').removeClass('table-border');
            $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Record');
            $('#load_msg_div').show();
            if (type != '') {
                $('#if_record_exists').hide();
            }
        }
        return false;
    }
    if (type == 'reset') {
        productivityDataPage = 0;
        $('#load_more_results').html("");
        $('#load_more_results_msg').html("");
        $('#load_more_button').show();
        $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;Load More Record');
    }
    
    var data = $('#FilterProductivityForm').serializeArray();
    data.push({name: "page", value: productivityDataPage});
    data.push({activityOn: activityOn});
    if (typeof sUserId !== 'undefined') {
        data.push({name: "filter[user_id]", value: sUserId});
    } 
    //send all user ids if not selected anyone
    if ((typeof sUserId == 'undefined') && ($('#sUserId').val() == null)) {
        $('select#sUserId option').each(function() {
            data.push({name: "filter[user_id][]", value: this.value});
        });        
    }
    if (typeof currentStage !== 'undefined') {
        data.push({name: "filter[stage_id]", value: currentStage});
    }

    $('#load_more_button').attr("disabled", "disabled");
    
    $.ajax({
        url: '/users/ajax-productivity-data',
        type: 'post',
        dataType: 'html',
		async: false,
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},

        beforeSend: function () {
            $('body div.loader-block-lead-list').show();
        },
        complete: function () {
            $('body div.loader-block-lead-list').hide();
        },

        success: function (data) {
            productivityDataPage = productivityDataPage + 1;
            if (data == "session_logout") {
                window.location.reload(true);
            } else if (data == "error") {
                if (productivityDataPage == 1) {
                    error_html = "No Records found";
                } else {
                    error_html = "No More Record";
                }
                $('#load_msg').html(error_html);
                $('#load_msg_div').show();
                $('#load_more_results').html('');
                $('.tableNew').removeClass('table-border');
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Record');
                $('#load_more_button').hide();
                if (type != '' && productivityDataPage == 1) {
                    $('#if_record_exists').hide();
                }
            } else if (data == "nomore") {
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Record');
                $('#load_more_button').hide();
            } else if (data == "select_college") {
                $('#load_msg').html("Please select an Institute Name from filter and click apply to view activity.");
                $('#load_more_button').hide();
                $('#load_more_results').html('')
                $('.tableNew').removeClass('table-border');
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Record');
                $('#load_msg_div').show();
                if (type != '') {
                    $('#if_record_exists').hide();
                }
            } else if (data == "permission") {
                $('#load_msg').html("You do not have permission to view productivity data.");
                $('#load_more_button').hide();
                $('#load_more_results').html('')
                $('.tableNew').removeClass('table-border');
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Record');
                $('#load_msg_div').show();
                if (type != '') {
                    $('#if_record_exists').hide();
                }    
            } else {
                data = data.replace("<head/>", '');
				 if (productivityDataPage == 1) {
					 //alert('1')
                   $('#load_more_results').append(data);
                } else {
					//alert('2')
					//alert(data);
                    $('#load_more_results tbody').append(data);
                }
                $('.tableNew').addClass('table-border');
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Record');
                if (type != '') {
                    $('#if_record_exists').fadeIn();
                }
                $('#load_msg_div').hide();
                $('.offCanvasModal').modal('hide');
                table_fix_rowcol();
				
				/*$('#searchCommon').keypress(function (event) {
					if (event.keyCode === 10 || event.keyCode === 13) {
						event.preventDefault();
					}
				});*/
            }
            $('#listloader').hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

function exportProductivityDataLog() {
    var collegeId= $('#sCollegeId').val();
    if(collegeId == '') {
        alertPopup("Please select an Institute Name from filter and click apply to view activity.", 'error');
        return false;
    }
    
    var data = $('#FilterProductivityForm').serializeArray();
    //send all user ids if not selected anyone
    if ($('#sUserId').val() == null) {
        $('select#sUserId option').each(function() {
            data.push({name: "filter[user_id][]", value: this.value});
        });        
    }
    $.ajax({
        url: '/users/download-productivity-data-log',
        type: 'post',
        dataType: 'json',
        data:data,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json)
        {
            if (json['redirect']) {
                location = json['redirect'];
            } else if (json['error']) {
                alertPopup(json['error'], 'error');
            } else if (json['status'] == 200) {
                $('#muliUtilityPopup').find('#alertTitle').html('Download Success');
                if (json['downloadUrl']) {
                    $('#muliUtilityPopup #downloadListing').attr('href',json['downloadUrl']);
                    $('#muliUtilityPopup #showlink').show();
                } else {
                    $('#muliUtilityPopup #showlink').hide();
                }
                $('#muliUtilityPopup').modal('show'); 
                $('#muliUtilityPopup .close').addClass('npf-close').css('margin-top', '2px');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
        }
    });

    return false;
}


$(document).ready(function(){
    $(document).on('change', '#activityType', function(){
        updateFilter();
    });
});

function updateFilter() {
    var selectedActivityType = $('#activityType').val();
    var collegeId = $('#sCollegeId').val();
    $('#activityType').SumoSelect({placeholder: 'Select Activity', search: true, searchText:'Search Activity', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
    $('#stageIds').SumoSelect({placeholder: 'Select Stage', search: true, searchText:'Search Stage', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
    if(selectedActivityType == null) {
        selectedActivityType = [];
    }

    if(selectedActivityType.indexOf("follow-edited") >= 0) {
        $('#activityType')[0].sumo.disableItem(2);
        $('#activityType')[0].sumo.disableItem(3);
    }
    if(selectedActivityType.indexOf("follow-upadded") >= 0) {
        $('#activityType')[0].sumo.disableItem(3);
        $('#activityType')[0].sumo.disableItem(4);
    }
    if(selectedActivityType.indexOf("follow-upcompleted") >= 0) {
        $('#activityType')[0].sumo.disableItem(2);
        $('#activityType')[0].sumo.disableItem(4);
    }
    if(selectedActivityType.indexOf("applicationfollow-upadded") >= 0) {
        $('#activityType')[0].sumo.disableItem(6);
        $('#activityType')[0].sumo.disableItem(7);
    }
    if(selectedActivityType.indexOf("applicationfollow-edited") >= 0) {
        $('#activityType')[0].sumo.disableItem(5);
        $('#activityType')[0].sumo.disableItem(6);
    }
    if(selectedActivityType.indexOf("applicationfollow-upcompleted") >= 0) {
        $('#activityType')[0].sumo.disableItem(5);
        $('#activityType')[0].sumo.disableItem(7);
    }
    if(selectedActivityType.indexOf("follow-upcompleted") == -1 && selectedActivityType.indexOf("follow-upadded") == -1 && selectedActivityType.indexOf("follow-edited") == -1) {
        $('#activityType')[0].sumo.enableItem(2);
        $('#activityType')[0].sumo.enableItem(3);
        $('#activityType')[0].sumo.enableItem(4);
    }
    if(selectedActivityType.indexOf("applicationfollow-upcompleted") == -1 && selectedActivityType.indexOf("applicationfollow-upadded") == -1 && selectedActivityType.indexOf("applicationfollow-edited") == -1) {
        $('#activityType')[0].sumo.enableItem(5);
        $('#activityType')[0].sumo.enableItem(6);
        $('#activityType')[0].sumo.enableItem(7);
    }
    
    if(collegeId == 257) { // for bennett university
        var allowedActivity = ['inboundsuccess', 'inboundmissed', 'outboundsuccess', 'outboundmissed', 'totalsuccess', 'totalmissed', 'leadstagechanged'];
        var diff = [];
        var i = 0;
        $.grep(selectedActivityType, function(el) {
            if ($.inArray(el, allowedActivity) == -1){ 
                diff.push(el);
            }
            i++;
        });
//        if(diff.length == 0) {
//            $('#stageIds')[0].sumo.enable();
//        } else {
//            $('#stageIds')[0].sumo.disable();
//            $('#stageIds')[0].sumo.selectItem(0);
//        }
        if(diff.length == 0 && selectedActivityType.length != 0) {
            $('#stageIds')[0].sumo.reload();
            $('#stageIds')[0].sumo.enable();
        } else {
            $('#stageIds')[0].sumo.unload();
        }
    } else {
        if(selectedActivityType.length == 1 && selectedActivityType.indexOf("leadstagechanged") >= 0) {
            $('#stageIds')[0].sumo.reload();
            $('#stageIds')[0].sumo.enable();
        } else {
            $('#stageIds')[0].sumo.unload();
        }
    }
}

function CollegeLoadForms(value, default_val,selectBoxId,multiselect) {
    
    if(value == '') {
        $('#'+selectBoxId).html('<option value="">Select Form</option>');
        $('#form_id')[0].sumo.reload();
        return false;
    }
    
    var selectedFormonly =0;
    $.ajax({
        url: '/voucher/get-forms',
        type: 'post',
        dataType: 'html',
        data: {
            "college_id": value,
            "default_val": default_val,
            "multiselect": "",
            "selectedFormonly":selectedFormonly
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if(data=="session_logout"){
                window.location.reload(true);
            }
            $('#'+selectBoxId).html(data);
            $("#"+selectBoxId).find('option[value="0"]').text("Select Form");
            
            $('#form_id')[0].sumo.reload();
        }
    });
}