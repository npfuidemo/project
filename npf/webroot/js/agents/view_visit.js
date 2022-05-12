$(document).ready(function(){
    $('#applicationDeadLineSelector').datepicker({
      format: 'dd/mm/yyyy',
      //startDate: new Date(new Date().setDate(new Date().getDate() - 4)),
      endDate: new Date(),
    });
    dateRange();
    setTimeout(function(){ $('.fadeInUp').hide();}, 5000);
    tooltipInit();
    popoverInit();
    if($("#h_college_id").length){
        $('#college_id').val($("#h_college_id").val());
        $('#college_id').trigger('chosen:updated');
    }
});
  ///////custom////
 
function LoadVisitData(type) {
    $('#college_id_validation').text('');
    if($('#college_id').val()===''){
        $('#college_id_validation').text('Please select Institute');
        return false;
    }
    var data = [];
    $('.close').click();
    $('#LoadMoreArea').hide();
    if(type == 'reset') {
        ColPage = 0;
        $('#load_more_results_record').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
        $('#recordDiv .text-danger').remove();
    }
    data = $('#FilterInstituteForm').serializeArray();
    data.push({name: "page", value: ColPage});
    data.push({name: "type", value: type});

    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;Loading...');
    //$('#tot_records').html("");

    $.ajax({
        url: jsVars.FULL_URL +'/agents/ajax-visit-list',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () { 
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
        },
        success: function (data) {
          if(data=='collegeIdRequired'){
            $('#recordDiv').hide();
            $('#LoadMoreArea').hide();
            $('#load_msg_div').show();
            return false;
          }

            ColPage = ColPage + 1;
            if (data == "session_logout") {
                window.location.reload(true);
            } else if (data == "norecord") {
                if (ColPage == 1){
                  $('#recordDiv').hide();
                  $('#LoadMoreArea').hide();
                  $('#load_msg_div').show();
                  $('#load_msg').text('No Records found');
                  $('#tot_records').html("");
                  $('#downloadExcel').hide();
                }
                else{
                  error_html = "No More Record";
                  $('#recordDiv').append("<div class='text-center text-danger margin-top-10'>" + error_html + "</div>");
                  $('.text-danger + .text-danger').hide(); 
                  $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Load More Record');
                  $('#load_more_button').hide();
                }
//                  if (type != '' && Page==1) {
//                        $('#if_record_exists').hide();
//                  }
            } else {
                data = data.replace("<head/>", '');
                $('#load_more_results_record').append(data);
                $('#load_more_button').removeAttr("disabled");
                $('.offCanvasModal').modal('hide');
                table_fix_rowcol();
                dropdownMenuPlacement();           
                tooltipInit();
                popoverInit();
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Load More Record');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getVisitActivity(college_id,visit_id){
  var visit_id = visit_id;
  var college_id = college_id;
  if(visit_id=='' || college_id==''){
    return false;
  }   
  $.ajax({
    url: jsVars.FULL_URL+'/agents/get-activity-by-visit-ids',
    type: 'post',
    dataType: 'html',
    async: false,
    data: {
      "visit_id": visit_id,'college_id':college_id,
    },
    headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
    success: function (response) {
      $('#activitydata').html(response);
      tooltipInit();
      //popoverInit();
    },
    error: function (xhr, ajaxOptions, thrownError) {
      console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
    }
  });
}
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

function popoverInit(){
  if($('[data-toggle="popover"]').length > 0){
    $('[data-toggle="popover"]').popover();
  }
}
function tooltipInit(){
  if($('[data-toggle="tooltip"]').length > 0){
    $('[data-toggle="tooltip"]').tooltip();
  }
}

function hitVisitPopupBind() {
  $('.modalButton').on('click', function (e) {
  $('#confirmDownloadYes').off('click');
  $('#confirmDownloadTitle').text('Download Confirmation');
  $('#ConfirmDownloadPopupArea .npf-close').hide(); 
  $('#download_type').show();
  $('#csv').prop('checked',true);
  $('.confirmDownloadModalContent').text('Do you want to download the visits ?');//download the leads
  //var confirmation=$(this).text();
  var $form = $("#FilterInstituteForm");

  if($('#downloadConfig').length && $('#downloadConfig').val()==1){
    $('#confirmDownloadYes').on('click',function(e){
      e.preventDefault();
      $('#ConfirmDownloadPopupArea').modal('hide');
      var type = 'visit'+$("input[name='export_type']:checked").val();
      $("#export_visit").val(type);
      var requestType=$('#requestType').val();
      $form.ajaxSubmit({ 
      url: jsVars.FULL_URL+'/agents/visit-downloads',
      type: 'post',
      dataType:'json', 
      headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
      success:function (response){
        if(response.error != '') {
          if(response.error == 'session_logout') {
            window.location.href = jsVars.LOGOUT_PATH;
          } else if(response.error == 'invalid_request') {
            alertPopup('Something went wrong','error');
          } else {
            alertPopup(response.error,'error');
          }
        } else {
          if(requestType!='undefined'){
            $('#muliUtilityPopup').find('#alertTitle').html('Download Success');
            //$('#dynamicMessage').html('Note: Downloaded data will be sorted by (Descending) Visits added date.');
            $('#muliUtilityPopup').modal('show');
            $('#downloadListing').show();
            $('#downloadListingExcel').hide();
            $('#muliUtilityPopup .close').addClass('npf-close').css('margin-top', '2px');
          }
        }
      }
    });
    
  }); 
  }
});
  
}
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
function filterResetModalVisit(){
    $('.offCanvasModal input[type="text"]').each(function(){
       $(this).val('');
    });
    if($('.offCanvasModal .chosen-select').length > 0){
            $('.offCanvasModal .chosen-select').each(function(){
               this.selected = false;
               $(this).val('').trigger("change");
               
               $(this).trigger("chosen:updated");
            });
    }
    
    
}