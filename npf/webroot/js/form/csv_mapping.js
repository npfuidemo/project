/*For csv Mapping List*/
function LoadMoreCsvMapping(action) {
    if(action == 'reset')
    {
        Page = 0;
        $('#load_more_button').show();
        $('.list_data, #load_more_results, #load_more_button, #load_more_results_msg').show();
        $('#load_more_results_msg').html('');
    }
    var data = $('#CsvMappingListForm').serializeArray();
    data.push({name:'page',value:Page});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;Loading...');
    $.ajax({
        url: '/form/ajax-csv-mapping-list',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
		async: true,
		beforeSend: function () { 
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
        },
        success: function (data) {
            data = data.replace("<head/>", '');
            Page = Page + 1;
            if (data == "error") {
                
                if(Page==1){
                    $('#TotalCsvMappingCount').html('Total <strong>0</strong> Records');
                   // $('#load_more_button').hide();                    
                    //$('#load_more_results').hide();
                    $('.list_data, #load_more_results, #load_more_button').hide();
                }
                
                if(action == 'reset')
                {
                    $('#load_more_results_msg').append("<tr><td colspan='4' class=' text-danger text-center fw-500'><div class='noDataFoundDiv noDataFoundBlock' style=min-height:300px;'><div class='innerHtml'><img src='/img/no-record.png' alt='no-record'><span>No Data Found</span></div></div></td></tr>");                    
                }
                else
                {                   
                    $('#load_more_results_msg').append("<tr><td colspan='4' class=' text-danger text-center fw-500'><div class='noDataFoundDiv noDataFoundBlock' style=min-height:300px;'><div class='innerHtml'><img src='/img/no-record.png' alt='no-record'><span>No Data Found</span></div></div></td></tr>");
                }                
                $('#load_more_button').hide();
            } else {
                if(action == 'reset')
                {
                    $('#load_more_results').html(data);
                }
                else
                {
                    $('#load_more_results').append(data);
                }
				$('.offCanvasModal').modal('hide');
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Data');
				dropdownMenuPlacement();
//                $.material.init();
            }
            //console.log(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

//Manage Institute: Change Institute Status as delete
function DeleteCsvMappingById(post_data,name){    
    $('#ConfirmMsgBody').html('Are you sure to delete "' + name + '" form mapping records?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();
                $.ajax({
                    url: jsVars.DELETE_URL,
                    type: 'post',
                    data: {'post_data': post_data, 'action': 'delete'},
                    dataType: 'json',
                    headers: {
                        "X-CSRF-Token": jsVars._csrfToken
                    },
                    beforeSend: function () {
                        //$('#contact-us-final div.loader-block').show();
                    },
                    complete: function () {
                        //$('#contact-us-final div.loader-block').hide();
                    },
                    success: function (json) {

                        if (json['status'] == 1) {
                            jQuery("#csv_mp_row_" + json['id']).hide();
                            alertPopup( name + " data has been deleted", "success", jsVars.CSV_HOME_URL);
                        }else {
                            // System Error
                            alertPopup('Some Error occured, please try again.', 'error');
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

/*****Validate Fields for showing csv breaking fields********/
function validateCsv(){
    $.ajax({
        url: '/form/validateCsv',
        type: 'post',
        data: $("form#csvCreateForm").serialize(),
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        success: function (json) {
            if(json['success']==200){
                populateCsv();
            }else{
                alertPopup(json['error'], 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}    
/*****Populate CSV fields and auto fields*****/
function populateCsv(){
     $.ajax({
        url: '/form/populateCsv',
        type: 'post',
        data: $("form#csvCreateForm").serialize(),
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#listbox_selectForm_wrapper').show();
        },
        complete: function () {
            $('#listbox_selectForm_wrapper').hide();
        },
        success: function (json) {
            $('#populatelabel').html(json);
            $("#showBtnCSVMapping").show();
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
 $(document).on('change', '#csvCreateForm #select-form', function () {

      refrashJsonData();
});
//#csvCreateForm #select_institute
 /******Save and Edit CSV FORM*****/
$("#csv_form_submit").on('click', function(){
    
    len=required_fields.length;
    error=0;
    for(i=0;i<len;i++){
        //console.log($('#'+required_fields[i]).val());
        if($.trim($('#'+required_fields[i]).val())==""){
            $("#"+required_fields[i]+'_error').html("Required");
            $(".requiredError").show();
            error=1; 
        }
    }
    //alert(error); return false
    if(error==1) return false;
    
    $.ajax({
        url: '/form/saveCsvMapping',
        type: 'post',
        data: $("form#csvCreateForm").serialize(),
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#listbox_selectForm_wrapper').show();
        },
        complete: function () {
            $('#listbox_selectForm_wrapper').hide();
        },
        success: function (json) {
            if(json.redirect){
                window.location.reload(true);
            }else if(json.success==200){
               alertPopup("Data Saved Successfully", "success", '/form/csv-mapping-list');
           }else{
               $(".requiredError").html('');
               $.each(json.error, function(key, val){
                   $("#"+key+"_validation").html(json.error[key]);
                   $("#"+key+"_validation").show();
               });
           }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
});       
  
 /*********it will call on change on any fields after fill*******/
    function refrashJsonData(){
       $('button#populateData').attr('disabled', 'disabled');  
       var select_institute = $("#select_institute").val();
       var select_form = $("#select-form").val();
       //console.log(select_form);
       var csv_label_id = $("#csv_label_id").val();
       if(csv_label_id!='' && select_form!='' && select_form!=null  && select_institute!=''){
           validateCsv();
           //console.log($("#select-form").val());
       }
    }
 
function populateFormsCsv(defaultForm) {

    $.ajax({
        url: '/colleges/populateDependentForms',
        type: 'post',
        data: $("form#csvCreateForm").serialize(),
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#listbox_selectForm_wrapper').show();
        },
        complete: function () {
            $('#listbox_selectForm_wrapper').hide();
        },
        success: function (json) {
            if (json['status'] == 200 || json['status'] == 1) {
                var selectedform = [];
                // Success
//                console.log(json['formList']);
                $('#select-form :selected').each(function (i, selected) {
                    selectedform[i] = $(selected).val();
                });
                $('#formlistdata').html(json['formList']);

                $('#select-form option').each(function () {
                    if (selectedform.indexOf($(this).val()) != -1) {
                        $(this).attr('selected', 'selected');
                    }
                });

                if (typeof defaultForm != 'undefined' && defaultForm.length > 0) {
                    for (var ind in defaultForm) {
                        $("#select-form option[value='" + defaultForm[ind] + "']").attr("selected", "selected");
                    }
                }

                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                $('.chosen-select').trigger('chosen:updated');
            } else if (json['status'] == 0) {
                // Success
                $('#formlistdata').html(json['formList']);
            } else {
                alert('Some Error occured, please try again.');
            }
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/**
 * This function will load data in csv data mapping page
 * @param {type} type
 * @param {type} search_from
 * @returns {Boolean}
 */
function loadCsvMappingDropdownList(type,search_from){    
    
    if($('#dropdown_name').val()=='') {
        alertPopup('Please select value from dropdown!', 'error');
        return false;
    }
    
    if(type=='reset') {
        $('#csv_data_mapping, #load_more_results_msg').html('');        
        $('#csvHeading, #searchBoxDivID, #searchBtnDivID, #showDataMappingId').show();
        $('#load_msg_div').hide();
        csvPage=0;
        
        if(search_from =='dropdown') {
            $('#sText').val('');
        }
    }
    
    var data = $('#formCsvDataMapping').serializeArray();
    data.push({name: "csv_page_no", value: csvPage});
    
    $.ajax({
        url: '/form/load-csv-mapping-dropdown-list',
        type: 'post',
        data: data,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#listloader').show();
        },
        complete: function () {
            $('#listloader').hide();
        },
        success: function (data) {            
            if (data == 'session_logout') { 
                window.location.reload(true);
            } else if ($.trim(data) !=='') { 
                $('#load_more_button').show();
                csvPage = csvPage + 1;
                $('#csv_data_mapping').append(data);
            } else {                
                var message='';
                if(csvPage==0) {
                    message = '<div class="noDataFoundDiv"><div class="innerHtml"><img src="/img/no-record.png" alt="no-record"><span>No Data Found</span></div></div>';
                    $('#csvHeading').hide();
                } else {
                    message = '<div class="noDataFoundDiv"><div class="innerHtml"><img src="/img/no-record.png" alt="no-record"><span>No Data Found</span></div></div>';
                }
                $('#load_more_results_msg').append("<div>"+message+"</div>");
                $('#load_more_button').hide();
                $('#showDataMappingId').hide();

                
            }
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/**
 * This function will save csv setting / data mapping
 * @param {type} position
 * @param {type} setting
 * @returns {undefined}
 */
function saveCSVDataMapping(position,setting){
    if(typeof setting == 'undefined') {
        //if data is empty for selected field then return
        /*if($.trim($('#mapping_list_'+position).val()) == ''){
            return;
        }
        */
        $('#spanMessage_'+position).html('').show();
    }
    var data = $('#formCsvDataMapping').serializeArray();
    data.push({name:'position',value:position});
    
    var isSetting=false;
    if(typeof setting != 'undefined') {
        $('#spanMappingId').html('').show();
        isSetting = true;
        var settings=0;
        if($('#name_mapping:checked').length>0){
            settings = 1;
        }
       data.push({name:'settings',value:settings}); 
    }
    
    var csv_form_id = $.trim($('#csv_form_id').val());
    var csv_college_id = $.trim($('#csv_college_id').val());
    var mapping_id = $.trim($('#mapping_id').val());
    var db_value = $.trim($('#mapping_list_hidden_'+position).val());
    var mapped_value = $.trim($('#mapping_list_'+position).val());
    var field_name = $.trim($('#dropdown_name').val());
    $.ajax({
        url: '/form/saveCsvDataMapping',
        type: 'post',
        data: {'csv_form_id': csv_form_id,
               'csv_college_id': csv_college_id,
               'mapping_id': mapping_id,
               'db_value': db_value,
               'mapped_value': mapped_value,
               'field_name':field_name},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#listloader').show();
        },
        complete: function () {
            $('#listloader').hide();
        },
        success: function (json) {            
            if (typeof json['session_logout'] !=='undefined' && json['session_logout'] == 'session_logout') { 
                window.location.reload(true);
            } else if (typeof json['success'] !=='undefined') { 
                if(isSetting) {
                    $('#spanMappingId').html('Setting Saved Successfully!').fadeOut(3000).css({'color':'green'});
                } else {
                    if(typeof json['message_type'] !=='undefined') {
                        var message=(json['message_type']=='insert'?'Data Saved!':'Data Deleted!');
                        $('#spanMessage_'+position).html(message).fadeOut(4000).css({'color':'green'});
                    }
                }                
            } else {
                alertPopup('Some Error occured, please try again!', 'error');
            }
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function enableSubmitButton(){
    $('button#populateData').removeAttr('disabled');
}
