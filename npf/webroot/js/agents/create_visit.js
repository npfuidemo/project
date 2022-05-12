$(document).ready(function(){
  $('#applicationDeadLineSelector').datepicker({
    format: 'dd/mm/yyyy',
    startDate: new Date(new Date().setDate(new Date().getDate() - 4)),
    endDate: new Date(),
  });
  setTimeout(function(){ $('.fadeInUp').hide();}, 5000);
  if($('#coaching_offerd').length > 0) {
    $('#coaching_offerd').SumoSelect({search: true, searchText:jsVars.visitAllEmpty.coaching_offered, selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
  }
  if($("#h_college_id").length){
      $('#college_id').val($("#h_college_id").val());
      $('#college_id').trigger('change');
      $('#college_id').trigger('chosen:updated');
  }
  $('#formVisitBtn').click(function(){
    $.ajax({
      url: jsVars.FULL_URL +'/agents/savevisit',
      type: 'post',
      data: $('form#formVisit').serializeArray(),
      dataType: 'json',
      headers: {
        "X-CSRF-Token": jsVars._csrfToken
      },
      beforeSend: function () {
        $('#formVisitBtn').addClass('hidden');
        $('#save_loader').removeClass('hidden');
      },
      complete: function () {
        $('#save_loader').addClass('hidden');
        $('#formVisitBtn').removeClass('hidden');
      },
      success:function(json){
        $('.error').text('');
        if(json['status']==1){
          if(json['message']!=''){
            $('#toperror').text(json['message']);
          }
          count = 0;
          $.each(json['error'], function (index, value) {
            if(value!=''){
              $('#'+index+'_validation').text(value);
              if(count==0){
                $('html, body').animate({
                  scrollTop: $('#'+index+'_validation').offset().top-200
                },500);
              }
              count++;
            }
          });
        }
        else if(json['status']==0 && json['redirect']!=''){
          window.location =  json['redirect'];
        }
      }
    });      
  });
});

  ///////custom////
function visitModeJs(val){
  if(val=='physical'){
    $('.visitmode').css('display','block');
  }
  else{
    $('#formVisitLocation').val('');
    $('#formTeamMemberLocation').val('');
    $('.visitmode').css('display','none');
    $('#formVisitLocation').trigger('chosen:updated');
    $('#formTeamMemberLocation').trigger('chosen:updated');
  }
}
function schoolRegister(val){
    if(val=='no'){
      $('.schoolnotregister').css('display','block');
    }
    else{
      $('#select_registering').val('');
      $('#select_registering').trigger('chosen:updated');
      $('#formOtherReason').val('');
      $('.schoolnotregister').css('display','none');
    }
}
function otherTemplate(e){
    if(e.value=='other'){
      $('.otherreason').css('display','block');
    }
    else{
      $('#formOtherReason').val('');
      $('.otherreason').css('display','none');
    }
  }
  function activityPerformed1(val) {
    if(val=='yes'){
      $('#activityPerformedDiv').css('display','block');
    }
    else{
      $('#activityPerformedDiv').css('display','none');
      $('#activityPerformedDiv').find('input[type=textfield]').val('');
      $('#activityPerformedDiv').find('input[type=hidden]').val('');
      $('#activityPerformedDiv').find('input[type=number]').val('');
      $('#activityPerformedDiv').find('input[type=text]').val('');
      $('#activityPerformedDiv').find('input').prop('checked', false);
      $('.resource-download').hide();
    }
  }
  function souvenir(val) {
    if(val=='yes'){
      $('.souvenirdiv').css('display','block');
    }
    else{
      $('#formYesPresented').val('');
      $('#souvenirCount').val('');
      $('#formSouvierDescription').val('');
      $('.souvenirdiv').css('display','none');
    }
  }
  function activityPerformed(check,id='',value){
    var valuebyid = ($('#'+id).val());
    if(check.checked==true && valuebyid === value){
      $('.'+id).css('display','block');
    }
    else if(check.checked==false && valuebyid === value){
      $('.'+id).css('display','none');
      $('.'+id).find('input').val('');
      $('#dow_file_'+id+' a').attr('href','');
      $('#dow_file_'+id).hide();
      $('#del_file_'+id).hide();
    }
  }
function GetChildByMachineKey(key,setValue,OptionVal,center='',searchWithPlace='') {   
    var geturl = ''; 
    var college_id = 0;
    var place_type = '';
    college_id = $('#college_id').val();
    $('#place_type_validation').text('');
    if(center!=''){
        if($('#place_type').val()===''){
            $('#place_type_validation').text('Please select visit type for School/Centre/Agency list.');
            //return false;
        }
        place_type = $('#place_type').val();
      geturl = jsVars.FULL_URL+'/agents/getCenter';
    }
    else{
      geturl = jsVars.FULL_URL+'/common/getChildListByTaxonomyId';
    }
    if(key==''){
        return false;
    }
      if(setValue=='district'){
        if(typeof jsVars.visitAllEmpty.district != 'undefined' && jsVars.visitAllEmpty.district != null){
            $('#district').html('<option value="">'+  jsVars.visitAllEmpty.district+'</option>');
        }
        if(typeof jsVars.visitAllEmpty.city != 'undefined' && jsVars.visitAllEmpty.city != null){
            $('#city').html('<option value="">'+ jsVars.visitAllEmpty.city+'</option>');
        }
        if(typeof jsVars.visitAllEmpty.visit_center != 'undefined' && jsVars.visitAllEmpty.visit_center != null){
           $('#center').html('<option  value="">'+jsVars.visitAllEmpty.visit_center+'</option>');
        } 
      }
      else if(setValue=='city'){
          
        if(typeof jsVars.visitAllEmpty.city != 'undefined' && jsVars.visitAllEmpty.city != null){
            $('#city').html('<option value="">'+ jsVars.visitAllEmpty.city+'</option>');
        }
        if(typeof jsVars.visitAllEmpty.visit_center != 'undefined' && jsVars.visitAllEmpty.visit_center != null){
           $('#center').html('<option  value="">'+jsVars.visitAllEmpty.visit_center+'</option>');
        } 
      }
      else if(setValue=='center'){
        if(typeof jsVars.visitAllEmpty.visit_center != 'undefined' && jsVars.visitAllEmpty.visit_center != null){
           $('#center').html('<option  value="">'+jsVars.visitAllEmpty.visit_center+'</option>');
        }
      }
      $('.chosen-select').trigger('chosen:updated');
     
    $.ajax({
        url: geturl,
        type: 'post',
        dataType: 'json',
        data: {
            "parentId": key,"college_id":college_id,"placeType":place_type,"searchWithPlace":searchWithPlace
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (response) {
          if (response.status == 1) {
                if (typeof response.data === "object") {
                    if (typeof response.data.childList === "object") {
                        var value = '<option selected="selected" value="">Select '+OptionVal+'</option>';
                        $.each(response.data.childList, function (index, item) {
                            value += '<option value="' + index + '">' + item + '</option>';
                        });
                        $('#'+setValue).html(value);
                    }
                }
                $('#'+setValue).trigger('chosen:updated');
                $('#'+setValue+'_validation').text('');
                $('.chosen-select').trigger('chosen:updated');
            } else {
                $('.chosen-select').trigger('chosen:updated');
                //console.log(response.message);
                $('#'+setValue+'_validation').text(response.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
function getCenterDetails(mongo_id){
  college_id = $('#college_id').val();
  if(mongo_id=='' || college_id==''){
    return false;
  }
  $.ajax({
      url: jsVars.FULL_URL+'/agents/getCenterDetails',
      type: 'post',
      dataType: 'json',
      data: {
          "center_mongo_id":mongo_id,'college_id':college_id
      },
      headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
      success: function (response) {
        //console.log(response)
        var responseObject = response;
        if (responseObject.status == 1) {
          if (typeof responseObject.data === "object") {
            $('#formOwnerName').val(responseObject.data.principal_name);
            $('#schoolAgencyEmail').val(responseObject.data.prinicipal_email_id);
            $('#formPrincipalConactNo').val(responseObject.data.principal_mobile);
            $('#formEmailId').val(responseObject.data.school_email_id);
            $('#formContactno').val(responseObject.data.school_representative_mobile);
            $('#formContactPerson').val(responseObject.data.school_representative_name);
          }
        }
        else{
          $('#formOwnerName').val('');
          $('#schoolAgencyEmail').val('');
          $('#formPrincipalConactNo').val('');
          $('#formEmailId').val('');
          $('#formContactno').val('');
          $('#formContactPerson').val('');
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {
          console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
      }
  });
}
function ajaxUploadFiles(field_id,file_key=''){
    var college_id = $('#college_id').val();
    if(college_id==''){
      $('#'+field_id+'_validation').removeClass('text-success');
      $('#'+field_id+'_validation').addClass('error');
      $('#'+field_id+'_validation').text('Please select Institute from Institute list');
      return false;
    }
    let formData = new FormData();
    var filesinfo = document.getElementById(field_id).files;
    if(filesinfo == null){
      return false;
    }
    for(let i=0;i<filesinfo.length;i++){
      if(filesinfo[i].name==''){
        return false;
      }
      if(parseInt(filesinfo[i].size/(1024*1024)) > 10){
        $('#'+field_id+'_validation').text('File size cant\'t be more than 10 mb');
        return false;
      }
      formData.append('files', filesinfo[i], filesinfo[i].name);
    }
    if(college_id){
      formData.append('college_id',college_id);
    }
    if(file_key){
      formData.append('file_key',file_key);
    }
    $('#'+field_id+'_validation').removeClass('error');
    $('#'+field_id+'_validation').addClass('text-success');
    $('#'+field_id+'_validation').text('Uploading...');

    var uploadedfile = $('#put_'+field_id).val();
    if(uploadedfile!=''){
      $('#'+field_id+'_validation').removeClass('text-success');
      $('#'+field_id+'_validation').addClass('error');
      $('#'+field_id+'_validation').text('File already uploaded');
      return false;
    }
    $('#dow_'+field_id).hide();
    $('#dow_'+field_id+' a').attr('href','');
    $('#del_'+field_id).hide();
    $.ajax({
        url: jsVars.FULL_URL+'/agents/savefile',
        type: 'post',
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'json',
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
          if(data['success']){
            $('#'+field_id+'_validation').removeClass('error');
            $('#'+field_id+'_validation').addClass('text-success');
            $('#'+field_id+'_validation').text('');
            $('#put_'+field_id).val(data['file_path']);
            $('#dow_'+field_id).show();
            $('#dow_'+field_id+' a').attr('href',data['downloadlink']);
            $('#del_'+field_id).show();

          }
          else{
            $('#dow_'+field_id).hide();
            $('#dow_'+field_id+' a').attr('href','');
            $('#del_'+field_id).hide();
            $('#'+field_id+'_validation').removeClass('text-success');
            $('#'+field_id+'_validation').addClass('error');
            $('#'+field_id+'_validation').text('');
            $('#'+field_id+'_validation').text(data['error']);
            $('#put_'+field_id).val('');

          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return;
}
function deleteFile(field_id){
  $('#dow_'+field_id).hide();
  $('#dow_'+field_id+' a').attr('href','');
  $('#del_'+field_id).hide();
  $('#'+field_id+'_validation').removeClass('error');
  $('#'+field_id+'_validation').addClass('text-success');
  $('#'+field_id+'_validation').text('File successfully deleted');
  $('#put_'+field_id).val('');
  return false;
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
                        var value = '<option selected="selected" value="">Select Team Member</option>';
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


function onlyAlphabets(e, t)
{
    try
    {
        if (window.event) {
            var charCode = window.event.keyCode;
        }
        else if (e) {
            var charCode = e.which;
        }
        else {
            return true;
        }

        if ((charCode == 8) || (charCode == 32) || (charCode == 46))
        {
            return true;                    //allow space/backspace/delete key
        }
        else if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    catch (err) {
        alertPopup(err.Description, 'error');
    }
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function validateEmail(x) {
    var atpos = x.indexOf("@");
    var dotpos = x.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
        return false;
    }
    return true;
}

$(document).ready(function(){
   $('#place_type').on('change',function(){
      var city  = $('#city').val();
      GetChildByMachineKey(city,"center","School/Centre Name OR Agency Name","getCenter","searchWithPlace"); 
   });
   //$('#applicationDeadLineSelector').
});

$(function() {
    $("#applicationDeadLineSelector").on("changeDate",function(){
        var selected_date = $(this).val();
        var teamUserId = $('#team_member').val();
        getUserLocation(selected_date,teamUserId);
    });
});

function getTeamLoation(teamUserId){
    var visit_date = $('#applicationDeadLineSelector').val();
    getUserLocation(visit_date,teamUserId);
}

function getUserLocation(visit_date,teamUserId){
    var collegeId = $('#college_id').val();
    if(collegeId === ''){
        return false;
    }
    $.ajax({
        url: jsVars.FULL_URL+'/agents/getUserLocation',
        type: 'post',
        dataType: 'json',
        data: {
            "collegeId": collegeId,"visitDate":visit_date,"teamUserId":teamUserId
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function(response) {
            if(response.status === 0){
                if(response['redirect']!=''){
                    window.location =  response['redirect'];
                }
                alertPopup(response['error'], 'error');
            }
            else if(response.status === 200){
                var address = '<option value="">Select Your Location</option>';
                var teamAddress = '<option value="">Select Accompanying Team member Location</option>';
                if(typeof response['addressList'] === "object"){
                    $.each(response['addressList'], function (index, item) {
                        address += '<option value="' + item + '">' + item + '</option>';
                    });
                }
                if(typeof response['teamAddressList'] === "object"){
                    $.each(response['teamAddressList'], function (index, item) {
                        teamAddress += '<option value="' + item + '">' + item + '</option>';
                    });
                }
                $('#formVisitLocation').html(address);
                $('#formTeamMemberLocation').html(teamAddress);
            }
            $('#formVisitLocation').trigger('chosen:updated');
            $('#formTeamMemberLocation').trigger('chosen:updated');           
        }        
    });
}
