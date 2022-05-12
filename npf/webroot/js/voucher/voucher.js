$(document).ready(function(){
    if(typeof detailPageCollegeId !== 'undefined') {
        defaultFormId = 0;
        if(typeof detailPageFormId !== 'undefined') {
            defaultFormId = detailPageFormId;
        }
        LoadForms(detailPageCollegeId, defaultFormId,'','') 
        //Used Voucher Manager Page Js
        if($('#voucher-management').length > 0)
        {            
            GetMoreVouchersListView('reset');
        }
    }
    jQuery('.datepicker').datepicker({startView: 'month', format: "dd-mm-yyyy", enableYearToMonth: true, enableMonthToDay: true, endDate: ""});
});

function exportVoucher(url){
    $('#myModal').modal('show');
    $("#myModal iframe").attr({
		'src': url
    });
    $('#myModal').on('hidden.bs.modal', function(){
        $("#modalIframe").html("");
        $("#modalIframe").attr("src", "");
    });
}


function GetMoreVouchersListView(listingType)
{
    var Page,old_search;
    if(listingType == 'reset')
    {
        old_search = JSON.stringify($('#ListVoucherSearchArea #college_id,#ListVoucherSearchArea #form_id,#ListVoucherSearchArea input[name=\'s_voucher_code\'],#ListVoucherSearchArea  input[name=\'s_application_no\'],#ListVoucherSearchArea  input[name=\'s_from_date\'],#ListVoucherSearchArea  input[name=\'s_to_date\']').serializeArray());
        Page = 0;
        $('#ListingType').val('reset');
    }
    else if(listingType == 'load')
    {
        Page = parseInt($('#OffsetStart').val());
        Page = Page + 1;
        $('#ListingType').val('load');
    }
    $('#OffsetStart').val(Page);
    $.ajax({
        url: jsVars.loadMoreVoucherListLink,
        type: 'post',
        data: $('#ListVoucherSearchArea input,#ListVoucherSearchArea select'),
        dataType: 'html',
        async:true,
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#VoucherListLoader').show();
        },
        complete: function () {
            $('#VoucherListLoader').hide();
        },
        success: function (html) {
            if (html == 'No Vouchers Found'){
				$('#LoadMoreArea').hide();
			}else{
				if (html == 'session')
				{
					location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
				}             
				else if (html == 'no_more')
				{
					$('#LoadMoreArea').hide();
				} 
				else if (html == 'date_error')
				{
					$('#ErrorMsgBody').html('From date should be less than To date.');
					$('#ErrorLink').trigger('click');
					$('#LoadMoreArea').hide();
				}
				else
				{
					var countRecord = CountTotalReturnResult(html, listingType);
					
					if(listingType == 'reset')
					{
						$('#OldSearch').val(old_search);
						$('#VoucherListContainerSection').html(html);
					}
					else if(listingType == 'load')
					{
                        $('#VoucherListContainer tbody').append(html);
                        //$('#LoadMoreArea').show();
					}
                    //show/hide load more area
                    //alert(countRecord);
					if(countRecord > 10)
					{
                        //alert(countRecord);
						$('#LoadMoreArea').show();
					}
					/*else if(countRecord < 10)
					{
						$('#LoadMoreArea').show();
					}*/
				}
			}
			$('.offCanvasModal').modal('hide');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function GetMoreVouchersView(listingType)
{
    var Page,old_search;
    if(listingType == 'reset')
    {
        if($('#college_id').val() == '') {
			$('#table-data-view').hide();
			$('#if_record_exists').hide();
			$('#load_msg_div').show();
			$('#load_msg').html('Please select an Institute Name from filter and click apply to view Lists.');
            return false;
        }
        old_search = JSON.stringify($('#VoucherSearchArea #college_id,#VoucherSearchArea input[name=\'s_from_date\'],#VoucherSearchArea  input[name=\'s_to_date\']').serializeArray());
        Page = 0;
        $('#ListingType').val('reset');
    }
    else if(listingType == 'load')
    {
        Page = parseInt($('#OffsetStart').val());
        Page = Page + 1;
        $('#ListingType').val('load');
    }
    $('#OffsetStart').val(Page);
    
    var data = $('#VoucherListForm').serializeArray();
    data.push({name: "page", value: Page});
    
    $.ajax({
        url: jsVars.loadMoreVoucherLink,
        type: 'post',
        data: data,
        dataType: 'html',
		async: true,
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
        },
        success: function (html) {
            if (html == 'session')
            {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }             
            else if (html == 'no_more')
            {
                $('#LoadMoreArea').hide();
				$('#load_more_results tbody').append('<tr><td colspan="5" class="text-center text-danger fw-500">No More Record</td></tr>');
                if(listingType == 'reset') {
					$('#table-data-view').hide();
                    $('#if_record_exists').hide();
					$('#load_msg_div').show();
                    $('#load_msg').html('No record found');
                }
            } 
            else if (html == 'date_error')
            {
                $('#ErrorMsgBody').html('From date should be less than To date.');
                $('#ErrorLink').trigger('click');
                $('#load_more_results, #if_record_exists, #table-data-view, #LoadMoreArea').hide();
            }
            else
            {
                $('#table-data-view').show();
				$('#load_msg_div').hide();
                if(listingType == 'reset')
                {
                    $('#OldSearch').val(old_search);
                    $('#load_more_results').html(html);
                    $('#load_more_results, #if_record_exists, #table-data-view, #LoadMoreArea').show();
                }
                else if(listingType == 'load')
                {
                    $('#load_more_results tbody').append(html);
                }
                
                var countRecord = $('#totalRecords').val();
                
                //show/hide load more area
                if(countRecord >= 10)
                {
                    $('#load_more_button').show();
                }
                else if(countRecord < 10)
                {
                    $('#load_more_button').hide();
                }
            }
			$('.offCanvasModal').modal('hide');
			//modalFix();
			dropdownMenuPlacement();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function CountTotalReturnResult(html,listingType)
{
    var data = {};
    var len = 0;
    data.html = html;
    if(listingType == 'reset')
    {       
        //console.log($.parseHTML(data.html));
        $.grep($.parseHTML(data.html), function(el, i) { 
            len = $(el).find('div.voucher-block').length;
        });
    }
    else
    {
        len = $.grep($.parseHTML(data.html), function(el, i) {
          return $(el);
        }).length;
    }
    //alert(len);
    return len;
}

function ShowHideVoucherBox(formId){
    if(formId > 0) {
        $('#FieldValueMainDiv').show();
        getAllDropdown(formId);
    } else {
        $('#FieldValueMainDiv').hide();
        $('select #if_field').val('');
        $('select #if_value').val('');        
        $('.chosen-select').trigger('chosen:updated');
    }
}

/**
 * Load forms as per selection of college id
 * @param {type} value
 * @param {type} default_val
 * @returns {undefined}
 */
function LoadVoucherForms(value, default_val) {    
    $.ajax({
        url: '/voucher/get-forms',
        type: 'post',
        dataType: 'html',
        data: {
            "college_id": value,
            "default_val": default_val
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if(data=="session_logout"){
                window.location.reload(true);
            }
            $('#div_load_forms').html(data);
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('#form_id').attr('onChange','ShowHideVoucherBox(this.value);');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function getAllDropdown(formId) {    
    $.ajax({
        url: '/voucher/get-all-dropdown',
        type: 'post',
        dataType: 'json',
        data: {
            "formId": formId
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if(typeof json['redirect'] !== 'undefined'){
                window.location(json['redirect']);
            }            
            $('#if_field').html(json['optionList']);
            $('#if_field').attr('onChange','getDropdownValueList(this.value)');
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.chosen-select').trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getDropdownValueList(value) {    
    $.ajax({
        url: '/voucher/get-dropdown-value-list',
        type: 'post',
        dataType: 'json',
        data: {
            "value": value
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if(typeof json['redirect'] !== 'undefined'){
                window.location(json['redirect']);
            }            
            $('#if_value').html(json['optionList']);
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.chosen-select').trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function saveVoucher(){
    $.ajax({
        url: '/voucher/save-voucher',
        type: 'post',
        dataType: 'json',
        data: $('#createVoucherFormId').serializeArray(),
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if(typeof json['redirect'] !== 'undefined'){
                window.location(json['redirect']);
            }   
            
            //If there is any error then display
            if(typeof json['errorList'] !== 'undefined') {
                errorList = '';
                $('.error').html('');
                $.each(json['errorList'], function(i,v){
                    $('#'+i.toLowerCase()+'_error').html(v);
                });
            }
            
            if(typeof json['postURL'] !== 'undefined') {
                var $form = $("#createVoucherFormId");
                $form.attr("action",json['postURL']);
                $form.attr("target",'modalIframe');
                var onsubmit_attr = $form.attr("onsubmit");
                $form.removeAttr("onsubmit");
                $('#myModal').modal('show');
                $form.submit();
                $form.attr("onsubmit",onsubmit_attr);
                $form.removeAttr("target");
            }
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function viewVoucherInfo(voucherId){    
    $.ajax({
       url: '/voucher/get-voucher-info',
       type: 'post',
       dataType: 'html',
       data: {voucherId:voucherId},
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       success: function (data) {
           if(data=='session_logout'){
               window.location.reload(true);
           }else if(data == 'error'){
               alertPopup('Data Not found','error');
           } else {            
            $('#ConfirmAlertPopUpSection').find('.modal-header').after().html('<h2 class="modal-title">View Batch Details</h2><button aria-hidden="true" data-dismiss="modal" class="close npf-close" type="button"><span class="glyphicon glyphicon-remove"></span></button>');
            $('#ConfirmAlertPopUpSection').find('.modal-dialog').css('width','500px');
            $('#ConfirmAlertYesBtn,#ConfirmAlertNoBtn').remove();
            $('#ConfirmAlertPopUpSection').find('div.modal-body').html(data);
            $("#ConfirmAlertPopUpButton").trigger('click');
            }
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });    
}

function modalFix(){
	$('.filter_btn .btn').click(function() {
	  $('#content').toggleClass('layerUnset');
	});
	$('#filter').on('show.bs.modal', function () {
	  $('#content').addClass('layerUnset');
	});
	$('#filter').on('hidden.bs.modal', function () {
	  $('#content').removeClass('layerUnset');
	});
}