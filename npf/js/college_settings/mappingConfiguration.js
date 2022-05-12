$(document).ready(function(){
    $(".chosen-select").chosen();
    //Set Width dynamically to all select box where .default class is found
    $(".loader-block").hide();
    
    $(".sumo-select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true, okCancelInMulti: true});
    
});

//Save Counsellor config section data
function saveSectionData() {
    $('.loader-block').show();
    var data        = {'config':$("#mappingConfigurationForm").serialize(),'forms':[]};
    var errorFlag   = false;
    
    $("#parent_dimension_field_error").html('');
    $("#child_dimension_field_error").html('');
    if($("#parent_dimension_field").val()==''){
        $("#parent_dimension_field_error").html("Please select a value");
        errorFlag=true;
    }else if($("#parent_dimension_field").val()==$("#filter_field").val()){
        $("#parent_dimension_field_error").html("Filter Field and Parent Dimension Field can not be same.");
        errorFlag=true;
    }
    
    if($("#child_dimension_field").val()==''){
//        $("#child_dimension_field_error").html("Please select a value");
    }else if($("#child_dimension_field").val()==$("#filter_field").val()){
        $("#child_dimension_field_error").html("Filter Field and Child Dimension Field can not be same.");
        errorFlag=true;
    }else if($("#parent_dimension_field").val()==$("#child_dimension_field").val()){
        $("#child_dimension_field_error").html("Parent Dimension Field and Child Dimension Field can not be same.");
        errorFlag=true;
    }
    
    if($("#tat_activity_code").val()!='') {
        errorFlag=false;
    }
    
    if(errorFlag){ // if any invalid data found then return
        $('.loader-block').hide();
        return false;
    }
    
    $.ajax({
        url: '/college-settings/saveMappingConfig',
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
            if (json['status'] == "0") {
                // if session is out
                if(json['message'] === "session"){
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


function saveSectionDataTAT() {
    $('.loader-block').show();
    var data        = {'config':$("#mappingConfigurationForm").serialize(),'forms':[]};
    var errorFlag   = false;
    
    
    
    if($("#tat_activity_code").val()=='') {
        errorFlag=false;
    }
    
    if(errorFlag){ // if any invalid data found then return
        $('.loader-block').hide();
        return false;
    }
    $("#confirmYes").text("Confirm");
    $("#confirmNo").text("Cancel");
    $("#confirmTitle").text("Confirmation Message");
    $('#ConfirmMsgBody').html("Enabling/Making changes in the configuration will enable data in Lead Manager. Note: This setting will only be applied for new leads entering the system.Are you sure you want to proceed?");
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
    .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $('#ConfirmPopupArea').modal();
        $('.loader-block-a').show();
    $.ajax({
        url: '/college-settings/saveMappingConfig',
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
            if (json['status'] == "0") {
                // if session is out
                if(json['message'] === "session"){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(json['message'], 'error');
                }
            } else{
                alertPopup(json['message'], 'success');
            }
            $('#ConfirmPopupArea').modal('hide');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    });
}

function mappingPopup(){
    var html = $('#popupContentText').html();
    $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
    $('#ActivityLogPopupArea #alertTitle').text('Mapping Configuration');
    $('#ActivityLogPopupHTMLSection').html(html);
    $('#ActivityLogPopupLink').trigger('click');
}

function showAdditionalConfig(){
    showConfig('mappingConfig');
    openCity(event, 'tconfig');
    $("#mappingsidebar > a").removeClass('active')
    $("#mappingConfig").addClass('active')
    floatableLabel();
}

$('html').on('click','.list_group_item',function(){
    var tab = $(this).attr('id');
    showConfig(tab);
});

function showConfig(tab){
  if($("#college_id").val()==""){
    $('#load_msg_div').show();
    $('#mappingsidebar').addClass('disable');
    $('.camapign-config').hide();
//    $('.common-manager').html("<div class='col-lg-12'><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'> Please select an institute name to view additional configuration. </h4></div></div> </div>");
    return;
  } else {
    $('#load_msg_div').hide();
    $('#mappingsidebar').removeClass('disable');
    $('.camapign-config').show();
  }
  $.ajax({
    url: jsVars.fetchCampiagnConfigUrl,
    type: 'post',
    data: {'collegeId':$("#college_id").val(),'tab':tab},
    headers: {
      "X-CSRF-Token": jsVars._csrfToken
    },
    beforeSend: function () { 
        $('#mappingLoader').show();
    },
    complete: function () {
        $('#mappingLoader').hide();
        
    },
    success: function (html) {
      $("#load_msg_div").hide();
      $(".camapign-config").html(html);
      $(".chosen-select").chosen();
      //$("#mappingConfig").addClass('active');
      $(".sumo-select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder')});
    },
    error: function (xhr, ajaxOptions, thrownError) {
      alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
    }
  });
}

function openCity(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active");
     
  }
  $('#'+cityName).show();
  var id = $(this).attr('id');
  
  if(id!='mappingConfig'){
    $("#mappingConfig").removeClass('active');
  }
  if(id!='submitCountConfig'){
    $("#submitCountConfig").removeClass('active');
  }
  if(id!='submitTATConfig'){
    $("#submitTATConfig").removeClass('active');
  }
  evt.currentTarget.className += " active";
}

$(document).on('submit','#instConfigs',function(ev)
{
  ev.preventDefault();
  var dashletUrl = $("#instConfigs").attr('action');
  
  console.log(dashletUrl);
  var tconfigs = $("#instConfigs").serializeArray();
  $.ajax({
    url: dashletUrl,
    type: 'post',
    data: tconfigs,
    dataType: 'html',
    headers: {
      "X-CSRF-Token": jsVars._csrfToken
    },
    beforeSend: function () {
    },
    complete: function () {
// $('#applicationTimeSlotDashletHTML .panel-loader').hide();
// $('#applicationTimeSlotDashletHTML .panel-heading, #applicationTimeSlotDashletHTML .panel-body').removeClass('pvBlur');
},
success: function (response) 
{
  var responseObject = $.parseJSON(response);
  if (responseObject.status == 1) {
    alertPopup(responseObject.message); 
  }
// return;
},
error: function (xhr, ajaxOptions, thrownError) {
  alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
}
});
});

function changeTime() {
    var type = $("#time_type_fields").val();
    var option = '<option value="">Select Time</option>';
    if(type=='h'){
        var n =24;
    }else if(type=='m') {
        var n =60;
    }else if(type=='d') {
        var n =31;
    }
    
    for (var i = 1; i <= n; i++) {
        option += '<option value="'+i+'">'+i+'</option>';
    }
    
    $("#tattime_field").html(option);
    $("#tattime_field").trigger("chosen:updated");
}