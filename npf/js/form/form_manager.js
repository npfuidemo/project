$(document).ready(function () {
   SumitFilterFormNew(0);
});

function SumitFilterFormNew(pageNo,typeAdd = 'append')
{
    $('.total_query_count').html(0);
    pageno = parseInt(pageNo);
    var data = $("form#FilterForm, #FilterFormSearch").serializeArray();
    data.push({name: 'pageNo',  value:  pageno});
    $.ajax({
        url: '/form/form-manager-list',
        type: 'post',
        data: data,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
		beforeSend: function () { 
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
        },
        success: function (html) {
            if(typeAdd=='add' ){
                $('#select-block-container').html(html);
            }else{
                $('#select-block-container').append(html);
            }
			table_fix_rowcol();
            $('.offCanvasModal').modal('hide');
            $('.total_query_count').html($('#queryCount').val());
            $("#LoadMoreArea").removeClass('hide');
            pageno = pageno+1;
            $('#load_more_form').attr('p',pageno);
            $('#DownloadCSVButton').attr('href','/form/download-form-c-s-v/'+jsVars.DownloadCSVString);
            if(html==''){
				$('#select-block-container').append("<tr><td colspan='8' class=' text-danger text-center fw-500'>No Record found.</td></tr>");
                $('#LoadMoreArea').addClass('hide');
            }else{
                $('#LoadMoreArea').removeClass('hide');
            }
			dropdownMenuPlacement();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
    return false;
    
}

function LoadMoreFormNew()
{
        var pageNo = $('#load_more_form').attr('p');
        SumitFilterFormNew(pageNo);
}

//Manage Form: Change Form Status
$(document).on('click', '#FormChangeStatusNew', function (e) {
    e.preventDefault();
    var MainParentDiv = $(this).parents("div.application-form-block");
    var FormId = $(this).attr('fid');
    var FormName = $(this).attr('data');
    if (FormId > 0)
    {
	$.ajax({
            url: jsVars.getFormDetailCount,
            type: 'post',
            data: {formID: FormId},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                //$(".npf-close").trigger('click');
                $('div.loader-block').show();
            },
            complete: function () {
                $('div.loader-block').hide();
            },
            success: function (json) {

                if (json['redirect'])
                {
                    location = json['redirect'];
                }
                else if (json['error'])
                {
                    alertPopup(json['error'], 'error');
                }
                else if (json['success'] == 200)
                {
		    var LiStatus = $("#nav-tabs li.active").prop('title');
		    var PopUpStatus = (LiStatus == 'enable') ? 'disable' : 'enable';
		    var PopUpConfirmStatus = (LiStatus == 'enable') ? 'disabled' : 'enabled';
		    $("#change-status2 button#ChangeStatusBtn").attr("onclick", 'ChangeFormStatus(\'' + FormId + '\',\'' + FormName + '\',\'' + PopUpConfirmStatus + '\');');
			
		    if(json['count'] <= 0){
			$("#change-status2 p#DisableEnableFormPopUpTextArea").text('Do you want to ' + PopUpStatus + ' the form \'' + FormName + '\' ?');
			if(PopUpStatus=='enable'){            
			    $("#change-status2 p#DisableEnableFormPopUpTextArea").append('<br />Auto Increament Start No: <input type="text" name="auto_in_id" id="auto_in_id" value="'+$.trim($(MainParentDiv).find('#auto_inc_id').val())+'" />');
			}      	
		    }else{
			$("#change-status2 p#DisableEnableFormPopUpTextArea").text('Do you want to enable the form \'' + FormName + '\' ?');
			$("#change-status2 p#DisableEnableFormPopUpTextArea").append('<br />If you want to restart the Increment No, purge already present applications.');
		    } 
		    $("#change-status2").modal('show');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });    
    }
    else
    {
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
});


//Manage Form: show embed code
$(document).on('click', '.ShowEmbededCodeNew', function (e) {
    e.preventDefault();
//    var MainParentDiv = $(this).parents("div.application-form-block1");
//    var FormId = $(MainParentDiv).prop('id');
    var FormId = $(this).data('embedform');
    if (FormId > 0)
    {
        $.ajax({
            url: jsVars.getFormEmbedDetailUrl,
            type: 'post',
            data: {formID: FormId},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                //$(".npf-close").trigger('click');
                $('div.loader-block').show();
            },
            complete: function () {
                $('div.loader-block').hide();
            },
            success: function (json) {
                
                if (json['redirect'])
                {
                    location = json['redirect'];
                }
                else if (json['error'])
                {
                    alertPopup(json['error'], 'error');
                }
                else if (json['success'] == 200)
                {
                    // on successfull
//                    $("#embed #EmbededHtmlLink").attr('href',json['embedLink']);
                    $("#embed #EmbededHtmlLink").val(json['embedLink']);
                    $("#full_url_campaign1").html(json['embedLink']);
                    $("#college_id_campaign1").html(json['college_id']);
                    
                    $("#embed #EmbededHtmlCode").html(json['embedHtml']);
                        if(typeof json['generate_slug'] =='undefined' ||  json['generate_slug']==1){
                            $("#embed .formhtmlurl").hide();
                            $("#embed #slugButton").html('');
                            $('<input>').attr({
                                type    : 'button',
                                name    : 'generate_slug',
                                value   : 'Generate Slug',
                                id      : 'generate_slug',
                                class : 'btn btn-default w-text npf-btn',
                                onClick : "return generateFormSlug("+json['form_id']+",'"+json['CollegeUrl']+"');"
                            }).appendTo('#slugButton');
                    }else{
                        $("#embed .formhtmlurl").show();
                        $("#embed #EmbededHtmlLinkForm").val(json['embedLinkForm']);
                        $("#embed #EmbededHtmlCodeForm").html(json['embedHtmlForm']);
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //$(".npf-close").trigger('click');
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();

            }
        });
    }
    else
    {
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
});



    $('.daterangepicker_fee').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY',
            separator: ', ',
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
        //console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
    });

    $('.daterangepicker_fee').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
    });

    $('.daterangepicker_fee').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });









//changeFormSlug
$(document).on('click', '.changeFormSlug', function (e) {
    $('#error_span_form_slug').hide().html('');
    $('[name="form_slug"]').val('');
    e.preventDefault();
    var FormId = $(this).data('formid');
    var formslug = $(this).data('formslug');
    var collegeId = $(this).data('collegeslug');
    if (FormId > 0) {
        //formslug
        $('#currentFormSlug').html("<div class='small'><div><strong>Old Slug</strong>:</div>"+formslug+"</div>");
        $('#form_id').val(FormId);
        $('#collegeId').val(collegeId);
    }else{
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
});

$(document).on('click','#saveSlug', function() {
    
    $('#error_span_form_slug').hide().html('');
    if($('[name="form_slug"]').val()===''){
        $('#error_span_form_slug').show().html('Please enter form slug.');
        return;
    }

    if($('[name="form_slug"]').val()!==''){
        var formSlug = $('[name="form_slug"]').val();
        if(!formSlug.match(/^[0-9a-z\-]+$/)){
            $('#error_span_form_slug').show().html('Invalid Pattern');
            return;
        }

        if(formSlug.match(/[\-]{2,}/)){
            $('#error_span_form_slug').show().html('More than 1 hyphen not allowed');
            return;
        }
        if(!formSlug.match(/^[a-zA-Z0-9]+/)){
            $('#error_span_form_slug').show().html('First letter should be alpha numeric');
            return;
        }
        if(!formSlug.match(/[a-zA-Z0-9]+$/)){
            $('#error_span_form_slug').show().html('Last letter should be alpha numeric');
            return;
        }
    }




    $(".npf-close").trigger('click');
    $("#confirmYes").removeAttr('onclick');
    $('#confirmTitle').html("Confirm");
    $("#confirmYes").html('Ok');
    $("#confirmNo").html('Cancel');
    $('#ConfirmMsgBody').html('Are you sure to update form slug?');
    $('#ConfirmPopupArea').css('z-index', '11111');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
            e.preventDefault();
            $('#ConfirmPopupArea').modal('hide');
            changeFormSlug();
        });
});


function changeFormSlug(){
    var data = $("form#formslugForm").serializeArray();
    $.ajax({
        url: jsVars.saveFormSlugUrl,
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            //$(".npf-close").trigger('click');
            $('div.loader-block').show();
        },
        complete: function () {
            $('div.loader-block').hide();
        },
        success: function (json) {


            if (json['redirect'])
            {
                location = json['redirect'];
            }
            else if (json['error'])
            {
                alertPopup(json['error'], 'error');
            }
            else if (json['success'] == 200)
            {
                $(".npf-close").trigger('click');
                alertPopup("Updated successfully, refreshing the page.", 'success');
                LoadMoreFormNew();
                $("#formslugForm")[0].reset();
                setTimeout(function(){
                    location.reload(true);
                }, 2000);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //$(".npf-close").trigger('click');
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
        }
    });
}

function editFormEndDate(formId,date){
    $.ajax({
       url: '/form/edit-form-end-date',
       type: 'post',
       dataType: 'html',
       data:{'formId':formId,'formEndDate':date},
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },

       success: function (response) {
           var responseObject = $.parseJSON(response);
        if(responseObject.status===1){
                $('#formEndDate').html(responseObject.data.html);
                $('#editEndDate').modal('show');
            }else{
                if (responseObject.message === 'session'){
                    // location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message, 'error');
                }
            }
            
        },
        complete: function () {
        //    $('#end_date').datetimepicker({format: 'DD/MM/YYYY HH:mm',viewMode: 'years'});
        },  
       error: function (xhr, ajaxOptions, thrownError) {
        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
    },
   });

}

$('#editEndDate').on('shown.bs.modal', function (e) {
    $('#end_date').datetimepicker({format: 'DD/MM/YYYY HH:mm',viewMode: 'years'});
});

function updateFormEndDate() {
    event.preventDefault();
    $.ajax({
        url: '/form/update-form-end-date',
        type: 'post',
        data: $('#editEndDataForm').serialize(),
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
           if(json.status===1){
               $('#editEndDate').modal('hide');
               $('#endDate-success').html('End date has been updated successfully');
               $('#success-popup-enddate').modal('show');
           }else if(json.status===2){
               $('#dedlinde_date_error').html('Deadline date should be greater than start date');
           }else{
            if (responseObject.message === 'session'){
                // location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else{
                alertPopup(responseObject.message, 'error');
            }
        }
          
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function editFormStartDate(formId,date,declearDate){
    $.ajax({
        url: '/form/edit-form-start-date',
        type: 'post',
        dataType: 'html',
        data:{'formId':formId,'formStartDate':date,'declearDate':declearDate},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);

         if(responseObject.status===1){
             $('#formStartDate').html(responseObject.data.html);
             $('#startFormDate').modal('show');
            }else{
                if (responseObject.message === 'session'){
                    // location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message, 'error');
                }
            }
            
        },
        complete: function () {
            // $('#start_Date').datetimepicker({format: 'DD/MM/YYYY HH:mm',viewMode: 'years'});
         },  
        error: function (xhr, ajaxOptions, thrownError) {
         console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
     },
    });
}

$('#startFormDate').on('shown.bs.modal', function (e) {
    $('#start_Date').datetimepicker({format: 'DD/MM/YYYY HH:mm',viewMode: 'years'});
});


function updateFormStartDate() {
    event.preventDefault();
    $.ajax({
        url: '/form/update-form-start-date',
        type: 'post',
        data: $('#editStartDataForm').serialize(),
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
           if(json.status===1){
               $('#startFormDate').modal('hide');
               $('#startDate-success').html('Start date has been updated successfully');
               $('#success-popup-startdate').modal('show');
           }else if(json.status===2){
            $('#start_date_error').html('Form start date should not be greater than application deadline date');
          }else{
            if (responseObject.message === 'session'){
                // location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else{
                alertPopup(responseObject.message, 'error');
            }
        }
          
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function editExtraConfig(formId){
    $.ajax({
        url: '/form/edit-extra-config',
        type: 'post',
        dataType: 'html',
        data:{'formId':formId},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);

         if(responseObject.status===1){
                 $('#extraConfigEdit').html(responseObject.data.html);
                 $('#editExtraData').modal('show');
           }else{
             if (responseObject.message === 'session'){
                 // location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
             }else{
                 alertPopup(responseObject.message, 'error');
             }
         }
 
        },
        error: function (xhr, ajaxOptions, thrownError) {
         console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
     },
    });
}

function updateExtraConfig() {
    event.preventDefault();
    $.ajax({
        url: '/form/update-extra-config',
        type: 'post',
        data: $('#editExtraConfig').serialize(),
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
           if(json.status===1){
               $('#editExtraData').modal('hide');
               $('#extraconfig-success').html('Extra config has been updated successfully');
               $('#success-popup-extraConfig').modal('show');
           }else if(json.status===2){
            alertPopup("Please enter valid email id","error")
           }else{
            if (responseObject.message === 'session'){
                // location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else{
                alertPopup(responseObject.message, 'error');
            }
        }
          
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}