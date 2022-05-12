$(document).ready(function(){
    dateRange();
    $('#listloader').hide();

    $('#merge').on('show.bs.modal',function(){
        $('.chosen-select').chosen();
        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        $('.chosen-select').trigger('chosen:updated');
    });
    if($("#h_college_id").length){
        $('#college_id').val($("#h_college_id").val());
        $('#college_id').trigger('change');
        $('#college_id').trigger('chosen:updated');
    }
});

function dateRange(){
    $('.daterangepicker_fee').daterangepicker({
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY',
            separator: ', '
        },
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'left',
        drops: 'down',
    }, function (start, end, label) {
    });

    $('.daterangepicker_fee').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
    });

    $('.daterangepicker_fee').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
}

function LoadMoreSchoolRequest(type) {
    $(".error").html('');
    if (type == 'reset') {
        SchoolRequestPage  = 1;
        $('#school_request_container').html("");
        $("#school_request_container").parent().hide();
    }
    
    $('#load_more_button').hide();
    if($("#college_id").val()===''){
        $("#load_msg_div").show();
        
        $("#college_error").html('Please select college');
        $("#college_error").show();
        hideLoader();
        return;
    }
    var data = $('#FilterApplicationForms, #FilterCenterFormSearch').serializeArray();
    data.push({name: "page", value: SchoolRequestPage});
    $.ajax({
        url: '/agents/school-request-list',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function () {
           $('#parent').css('min-height', '50px');
           showLoader();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (response) {
            SchoolRequestPage+=1;
	    var responseObject = $.parseJSON(response); 
	    if (responseObject.message === 'session'){
		window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
	    }else if(responseObject.message ==="no_record_found"){    
                if(SchoolRequestPage===2){
                    $('#load_msg').html('No School/Centre Found');
                    $('#load_msg_div').show();
					$('#school_request_container').parent().addClass('hide');
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More School/Centre Request");
                    $('#load_more_button').hide();
					if ($(window).width() < 992) {
						//filterClose();
					}
                }else {
                    $('#load_msg').html('');
                    $('#load_msg_div').hide();
                    $('#load_more_button').html("<i class='fa fa-database' aria-hidden='true'></i>&nbsp;No More School/Centre Request");
                    $('#load_more_button').show();
                }
                if (type !== '' && SchoolRequestPage===2) {
                    $('#if_record_exists').hide();
                    $('#single_lead_add').hide();
                }
	    }else if(responseObject.status===1){
                if (type === 'reset') {
                    $('#school_request_container').html("");
                }
                
                if (responseObject.message !== '') {
                    alertPopup(responseObject.message, 'error');
                    return;
                }
                data = responseObject.data.html.replace("<head/>", '');
                $('#school_request_container').parent().removeClass('hide');
                $('#school_request_container').parent().show();
                $('#school_request_container').append(data);
                $('#load_msg_div').hide();
		        $('#parent').show();
                $('.itemsCount').show();
		        $('body').css('padding-right', '0px');
                if(typeof responseObject.data.totalRecords!=="undefined"){
                    $("#totalRecords").html('Total <strong>'+responseObject.data.totalRecords+'</strong>&nbsp;Records');
                }
                 
		        var ttl = $("#current_record").val();
                if(parseInt(ttl) < 10){
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More School/Centre Request");
                    $('#load_more_button').hide();
                }else{
                    $('#load_more_button').removeAttr("disabled");
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More School/Centre Request");
		            $('#load_more_button').show();
                }
                if (type !== '') {
                    $('#if_record_exists').fadeIn();
                }
                dropdownMenuPlacement();
	    }else{
		$('#parent').hide();
                $('#load_msg_div').show();
                $('#load_msg').html(responseObject.message);
                $('#school_request_container').html("");
                $('#load_more_button').hide();
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More School/Centre Request");
                 if (type !== '') {
                        $('#if_record_exists').hide();
                 }
	    }
            $('.offCanvasModal').modal('hide');
            table_fix_rowcol();
            tooltipInit();
            //dropdownMenuPlacement();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //window.location.reload(true);
        },
        complete: function () {
            hideLoader();
        }
    });

    return false;
}

//alert popup
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

function showStatusChangeConfirmationPopup(status,params){
    
    $('#ConfirmAlertYesBtn').unbind();
    $('#ConfirmAlertNoBtn').unbind();
    if(status==2){
        $('#ConfirmAlertPopUpTextArea').html("Do you want to disable?");
        $('#ConfirmAlertPopUpSection .modal-title').html("Disable Fee Withdraw Configuration");
    }else{
        $('#ConfirmAlertPopUpTextArea').html("Do you want to enable?");
        $('#ConfirmAlertPopUpSection .modal-title').html("Enable Fee Withdraw Configuration");
    }
    $("#ConfirmAlertPopUpSection").modal("show");
    $("#ConfirmAlertYesBtn").on("click",function(){
        changeStatusUser(params);
    });
}

function changeStatusUser(params) {
    
    $.ajax({
        url: '/fee-withdraw/changeStatus/'+params,
        type: 'get',
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
           showLoader();
        },
        success: function (json) {
            if (json['status'] == 1) { 
                alertPopup(json['message'],'success');
                $('#alertTitle').html('Success');
                LoadMoreSchoolRequest('reset');
                $('#OkBtn').show();      
            }
            else {
                // System Error
                alertPopup('Some Error occured, please try again.', 'error');
            }
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError);
        },
        complete: function () {
            hideLoader();
        }
    });
}

$('#OkBtn').on('click',function(){
    $("#SuccessPopupArea .npf-close").trigger('click');
});

/*** Show & Hide Loader ***/
function showLoader() {
    $("#listloader").show();
}
function hideLoader() {
    $("#listloader").hide();
}

function resetform(){  
    $("#FilterApplicationForms")[0].reset();
    $("#search").val('');
    $('.chosen-select').chosen();
        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        $('.chosen-select').trigger('chosen:updated');
    LoadMoreSchoolRequest('reset');
}
function getMergeVal(mongo_id,college_id){
    $('#mongo_id').val(mongo_id);
    $('#collegeId').val(college_id);
}
function getMergeList(mongo_id,college_id,text_val){

if(text_val.trim() == ''){
    var value = '<option selected="selected" value="">Select Centre</option>';
    $('#mergelist').html(value);
    $('#mergelist').chosen();
            $('#mergelist').trigger('chosen:updated');
            return;
}

    $.ajax({
        url: jsVars.FULL_URL+'/agents/getAllCentre',
        type: 'post',
        dataType: 'json',
        data: {
            "mongo_id": mongo_id,"college_id":college_id,'search_val':text_val.trim()
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (response) {
            var value = '<option selected="selected" value="">Select Centre</option>';
            if (response.status == 200) {
                if (typeof response.data === "object") {
                    if (typeof response.data === "object") {
                        
                        $.each(response.data, function (index, item) {
                            value += '<option value="' + index + '">' + item + '</option>';
                        });
                        $('#mergelist').html(value);
                        
                    }
                    else{
                    $('#mergelist').html(value);        
                    }
                }
                else{
                    $('#mergelist').html(value);
                }
                //$('#mergelist_chosen').removeClass('chosen-container-single').find('input').attr('readonly', false);
            
            } else {
                $('#mergelist').html(value);
            }

            // $('#mergelist').chosen("destroy");
            $('#mergelist').chosen();
            $('#mergelist').trigger('chosen:updated');
            $('#mergelist_chosen input').val(text_val);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
function merge(){
    var collegeId = $('#collegeId').val();
    var mongo_id = $('#mongo_id').val();
    var merge_mongo_id = $('#mergelist').val();
    if(collegeId=='' || merge_mongo_id=='' || mongo_id==''){
        $('#merge_validation').text('Please select Centre from list');
        return false;
    }
    $.ajax({
        url: jsVars.FULL_URL+'/agents/merge-update',
        type: 'post',
        dataType: 'json',
        data: {
            "mongo_id": mongo_id,"collegeId":collegeId,'merge_mongo_id':merge_mongo_id
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (response) {
            if (response.status == 200) {
                $('.close').click();
                $('#message').addClass('text-success');
                $('#message').text(response.message);
                LoadMoreSchoolRequest('reset');
                //window.location = jsVars.FULL_URL +response['redirect'];
            } else {
                if(response['error']!=''){
                    $('#merge_validation').text(response['error']);
                }
                if(response['redirect']!=''){
                    window.location = jsVars.FULL_URL +response['redirect'];
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
function changeStatus(mid,status){
    $.ajax({
        url: jsVars.FULL_URL+'/agents/centre-change-status',
        type: 'post',
        dataType: 'json',
        data: {
            "mid":mid,"status":status
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (response) {
            
            if (response.status == 200) {
                
                $('.close').click();
                $('#message').addClass('text-success');
                $('#message').text(response.message);
                LoadMoreSchoolRequest('reset');
                
                //window.location = jsVars.FULL_URL +response['redirect'];
            } else {
                if(response['error']!=''){
                    $('#merge_validation').text(response['error']);
                }
                if(response['redirect']!=''){
                    window.location = jsVars.FULL_URL +response['redirect'];
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
} 
function Getuserlist(key) {
  if(key==''){
    return false;
  }   
  $.ajax({
        url: jsVars.FULL_URL+'/agents/getUserList',
        type: 'post',
        dataType: 'json',
        data: {
            "college_id": key,
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (response) {
            var responseObject = (response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data.childList === "object") {
                        var value = '<option selected="selected" value="">Select Created By</option>';
                        $.each(responseObject.data.childList, function (index, item) {
                            value += '<option value="' + index + '">' + item + '</option>';
                        });
                        $('#team_member').html(value);
                    }
                }
                $('#team_member').trigger('chosen:updated');
            } else {
                console.log(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
function centreAutoSearch(){
    $(".chosen-select").chosen();
    $('#mergelist_chosen input').on('input', function(e) {
        var college_id = $('.modal-footer #collegeId').val();
        var mongo_id = $('.modal-footer #mongo_id').val();
        var text_val = $(this).val();
        // if(text_val.length > 2){
            getMergeList(mongo_id,college_id,text_val);
        // }
    });
} 
function tooltipInit(){
  if($('[data-toggle="tooltip"]').length > 0){
    $('[data-toggle="tooltip"]').tooltip();
  }
}