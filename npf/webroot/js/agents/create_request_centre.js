$(document).ready(function(){
    setTimeout(function(){ $('.fadeInUp').hide();}, 5000);
    $('#RequestCentreBtn').click(function(){
        addupdate('/agents/save_request_centre');
    });
    $('#updateRequestCentreBtn').click(function(){
        addupdate('/agents/update_request_centre');
    });
    $('#updateApprove').click(function(){
        var updateStatus = 'approve';
        addupdate('/agents/update_request_centre',updateStatus);
    });
    if($("#h_college_id").length){
        $('#college_id').val($("#h_college_id").val());
        $('#college_id').trigger('chosen:updated');
    }
});
function addupdate(url,status=''){
    var formdata = $('form#formCentreRequest').serializeArray();
    formdata.push({ name: "updateStatus", value: status });
    $.ajax({
            url: jsVars.FULL_URL +url,
            type: 'post',
            data: formdata,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('#RequestCentreBtn').addClass('hidden');
                $('#updateRequestCentreBtn').addClass('hidden');
                $('#save_loader').removeClass('hidden');
            },
            complete: function () {
                $('#save_loader').addClass('hidden');
                $('#RequestCentreBtn').removeClass('hidden');
                $('#updateRequestCentreBtn').removeClass('hidden');
            },
            success:function(json){
                $('.error').text('');
                if(json['status']==0){
                    if(json['message']!=''){
                        $('#toperror').text(json['message']);
                    }
                    if(json['status']==0 && json['redirect']!=''){
                        window.location = json['redirect'];
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
                else if(json['status']==200 && json['redirect']!=''){
                    window.location = json['redirect'];
                }    
            } 
        }); 
}

function GetChildByMachineKey(key,setValue,OptionVal,selectedVal='') {   
    var geturl = ''; 
    var college_id = 0;
    college_id = $('#college_id').val();
    if(key==''){
        if(setValue=='district'){
            $('#district').html('<option value="">'+jsVars.emptyValue.district+'</option>');
            $('#city').html('<option  value="">'+jsVars.emptyValue.city+'</option>');
            $('#district').trigger('chosen:updated');
            $('#city').trigger('chosen:updated');
        }
        else if(setValue=='city'){
            $('#city').html('<option  value="">'+jsVars.emptyValue.city+'</option>');
            $('#city').trigger('chosen:updated');
        }
        return false;
    }
    
    $.ajax({
        url: jsVars.FULL_URL+'/common/getChildListByTaxonomyId',
        type: 'post',
        dataType: 'json',
        data: {
            "parentId": key,"college_id":college_id
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (response) {
            if (response.status == 1) {
                if (typeof response.data === "object") {
                    if (typeof response.data.childList === "object") {
                        var value = '<option selected="selected" value="">'+OptionVal+'</option>';
                        $.each(response.data.childList, function (index, item) {                            
                            value += '<option value="' + index + '">' + item + '</option>';
                        });
                        $('#'+setValue).html(value);
                    }
                }
                if(selectedVal > 0){
                    $('#'+setValue).val(selectedVal);
                }
                $('#'+setValue).trigger('chosen:updated');
                $('#'+setValue+'_validation').text('');
                $('.chosen-select').trigger('chosen:updated');
            } else {
                $('.chosen-select').trigger('chosen:updated');
                $('#'+setValue+'_validation').text(response.message);
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
function selectType(value,autoselect=false){
    if(value=='school' || value=='center' || value=='polytechnic' || value=='iti' || value=='college'){
        $('#level_centre_name').text('School / Centre Name ');
        $('#school_centre_agency_name').attr('placeholder','School / Centre Name');
        $('#owner_name').text('Principal Name');
        $('#principal_owner_name').attr('placeholder','Principal Name');
        $('#owner_email').text('Principal Email');
        $('#principal_owner_email').attr('placeholder','Principal Email');
        $('#owner_mobile').text('Principal Mobile');
        $('#principal_owner_mobile').attr('placeholder','Principal Mobile');
        $('#owner_website').text('School WebSite');
        $('#school_agency_website').attr('placeholder','School WebSite');
        $('#school_email').text('School Email Id');
        $('#school_agency_email').attr('placeholder','School Email Id');
    }
    else if(value=='bookseller' || value=='internet_cafe'){
        $('#level_centre_name').text('Agency Name ');
        $('#school_centre_agency_name').attr('placeholder','Agency Name');
        $('#owner_name').text('Owner Name');
        $('#principal_owner_name').attr('placeholder','Owner Name');
        $('#owner_email').text('Owner Email');
        $('#principal_owner_email').attr('placeholder','Owner Email');
        $('#owner_mobile').text('Owner Mobile');
        $('#principal_owner_mobile').attr('placeholder','Owner Mobile');
        $('#owner_website').text('Agency Website');
        $('#school_agency_website').attr('placeholder','Agency Website');
        $('#school_email').text('School/Agency Email ID');
        $('#school_agency_email').attr('placeholder','School/Agency Email ID');
        $('#school_agency_email').val('');
    }
    else{
        $('#level_centre_name').text('School/Centre Name OR Agency Name ');
        $('#school_centre_agency_name').attr('placeholder','School/Centre Name OR Agency Name');
        $('#owner_name').text('Principal/Owner Name ');
        $('#principal_owner_name').attr('placeholder','Principal/Owner Name');
        $('#owner_email').text('Principal/Owner Email ID');
        $('#principal_owner_email').attr('placeholder','Principal/Owner Email ID');
        $('#owner_mobile').text('Principal/Owner Mobile');
        $('#principal_owner_mobile').attr('placeholder','Principal/Owner Mobile');
        $('#owner_website').text('School/Agency Website');
        $('#school_agency_website').attr('placeholder','School/Agency Website');
    }
    if(value=='school'){
        $('#board_affiliation_name').text('Board of School');
        if(autoselect==false){
            $('#board_affiliation').val('');
        }
        $('.board_affiliation .chosen-select').trigger('chosen:updated');
        $('.board_affiliation').show();
    }
    else if(value=='center' || value=='bookseller' || value=='internet_cafe' || value==''){
        $('#board_affiliation_name').text('Select Board of School OR Affiliation University');
        $('#board_affiliation').val('');
        $('.board_affiliation .chosen-select').trigger('chosen:updated');
        $('.board_affiliation').hide();
    }
    else{
        $('#board_affiliation_name').text('Affiliation/University');
        //$('#board_affiliation').val('');
        $('.board_affiliation .chosen-select').trigger('chosen:updated');
        $('.board_affiliation').show();
    }
    if(value=='bookseller' || value=='internet_cafe' || value==''){
        $('.total_strength').hide();
        $('#total_strength').val('');
        $('.sciences_trength').hide();
        $('#sciences_trength').val('');
        $('.no_of_teacher').hide();
        $('#no_of_teacher').val('');
        $('.no_of_branches').hide();
        $('#no_of_branches').val('');
        $('.level').hide();
        $('#level').val('');
        $('.remark').hide();
        $('#remark').val('');
        $('.school_agency_email').hide();
        $('#school_agency_email').val('');
    }
    else{
        $('.total_strength').show();
        $('.sciences_trength').show();
        $('.no_of_teacher').show();
        $('.no_of_branches').show();
        $('.level').show();
        $('.remark').show();
        $('.school_agency_email').show();
    }
    if(autoselect==false){
        $('#other_affiliation_board').val('');
        $('.other_affiliation').hide();
    }
}
function otherTemplate(value){
    if(value=='other'){
        $('.other_affiliation').show();
    }
    else{
        $('#other_affiliation_board').val('');
        $('.other_affiliation').hide();
    }
}
function groupChange(value){
    if(value=='branch'){
        $('.group_name').show();
    }
    else{
        $('.group_name').hide();
        $('#branch_list').val('');
        $('.group_name .chosen-select').trigger('chosen:updated');
    }
}
$(function () {
    if ($('#searchSuggession #school_centre_agency_name').length > 0) {
        //Manage Application Search Field
        $('#searchSuggession #school_centre_agency_name').typeahead({
            hint: true,
            highlight: true,
            minLength: 1,
            source: function (request, response) {
                //var search = $('#searchSuggession #school_centre_agency_name').val();
                $('#school_centre_agency_name_validation').text('');
                var collegeId = $('#college_id').val();
                if(collegeId === ''){
                    $('#school_centre_agency_name_validation').text('Please select Institute form list to find registered centre list');
                    return false;
                }
                if (request)
                {
                    $.ajax({
                        url: jsVars.FULL_URL+'/agents/getAllCentre',
                        data: {search_val: request, college_id: collegeId,'mongo_id':'',otherVal:true},
                        dataType: "json",
                        type: "POST",
                        headers: {
                            "X-CSRF-Token": jsVars._csrfToken
                        },
                        //contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            items = [];
                            map = [];
                            if(typeof data.data != 'undefined' && data.data !=null){
                                $.each(data.data, function (i,item) {
                                    var name = item.name;
                                    map.push(item);
                                    items.push(name);
                                });                                
                            }                           
                            response(items);
                            $(".dropdown-menu").css("height", "auto");
                        },
                        error: function (response) {
                            alertPopup(response.responseText);
                        },
                        failure: function (response) {
                            alertPopup(response.responseText);
                        }
                    });
                }
            },
             updater: function(selection){
                 $('#searchSuggession #school_centre_agency_name').val(selection);
                 map.forEach(function(item){
                     if(item.name == selection){
                         $('#campus_name').val(item.campus_name);
                         $('#address').val(item.address);
                         $('#pincode').val(item.pin_code);
                         $('#state').val(item.state);
                         $('#state').trigger('chosen:updated');
                         
                         if(item.state > 0){
                             var college_id = $('#college_id').val();
                             var key = item.state;
                             var district = item.district;
                             var setValue = 'district';
                             $.ajax({
                                 url: jsVars.FULL_URL+'/common/getChildListByTaxonomyId',
                                 type: 'post',
                                 dataType: 'json',
                                 data: {
                                     "parentId": key,"college_id":college_id
                                 },
                                 headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                                 success: function (response) {
                                     if (response.status == 1) {
                                         if (typeof response.data === "object") {
                                             if (typeof response.data.childList === "object") {
                                              var value = '<option selected="selected" value="">Select Centre District</option>';
                                                 $.each(response.data.childList, function (index, item) {
                                                     value += '<option value="' + index + '">' + item + '</option>';
                                                 });
                                                 $('#'+setValue).html(value);
                                             }
                                          }
                                          $('#'+setValue).val(district);
                                          $('#'+setValue).trigger('chosen:updated');
                                          $('#'+setValue+'_validation').text('');
                                          $('.chosen-select').trigger('chosen:updated');
                                      } else {
                                          $('.chosen-select').trigger('chosen:updated');
                                          $('#'+setValue+'_validation').text(response.message);
                                      }
                                      if(district > 0){
                                          GetChildByMachineKey(district,"city","Select Centre City",item.city);
                                      }                                      
                                  },
                                  error: function (xhr, ajaxOptions, thrownError) {
                                     console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                                  }
                              });                            
                         }
                     }
                 });
                 return selection;
            }
        });
    }
});