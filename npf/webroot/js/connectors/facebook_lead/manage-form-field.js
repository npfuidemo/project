/**
 * for listing connector on college setting page
 * @returns
 */
jQuery(function () {
    $('.sectionLoader').hide();
    $("div.bhoechie-tab-menu>div.list_group>a").click(function (e) {
        e.preventDefault();
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
        var index = $(this).index();
        $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
        $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
    });
})

function ajaxConnectorList() {
    var data = $('#extensionListForm').serializeArray();
    var collegeId = $("#extensionListForm").find("#collegeId").val();
    if(collegeId != '') {
        $('#searchbytext').show();
    } else {
        $('#searchbytext').hide();
    }
    $.ajax({
        url: '/college-settings/ajax-connectors-list',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function (xhr) {
//            $('div.loader-block').show();
			$('.sectionLoader').show();
			customFile();
            $('.sectionLoader').show();
            $('body').css('overflow','hidden')

        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if (data == 'session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (data.indexOf('error:') > -1) {
                var error = data.replace(/error\:/, '');
                alertPopup(error, 'error');
            } else {
                $('#listingContainerSection').html(data);
//                $("div.bhoechie-tab-menu>div.list_group>a").click(function(e) {
//                    e.preventDefault();
//                    $(this).siblings('a.active').removeClass("active");
//                    $(this).addClass("active");
//                    var index = $(this).index();
//                    $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
//                    $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
//                });
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            //$('.sectionLoader').hide();
            $('body').css('overflow','auto')

        }
    });
}

/**
 * connector configuration page
 * @param {int} id
 * @returns {undefined}
 */
function connectorConfiguration(id) {
    $('#searchbytext').hide();
    $.ajax({
        url: '/college-settings/connector-configuration',
        type: 'post',
        dataType: 'html',
        data: {id: id},
        beforeSend: function (xhr) {
//            $('div.loader-block').show();
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (data === 'session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (data.indexOf('error:') > -1) {
                var error = data.replace(/error\:/, '');
                alertPopup(error, 'error');
            } else {
                //$("#SuccessPopupArea .modal-title").html("Configuration");
//                $("#extensionpopup .content-body").html(data);
//                $("#extensionList").trigger('click');
//                $(".modal-backdrop").addClass('modal-backdrop-dark');
                $(document).find('#connectorContent').html(data);
                $('.scrolling-tabs').scrollingTabs();
                $(document).find('#connectorContent').parent().addClass('in');
                $(document).find('#load_connectors_category').hide();
                $('[data-toggle="tooltip"]').tooltip();
            }
            floatableLabel();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
//            $('div.loader-block').hide();
            $('.sectionLoader').hide();
        }
    });
}

/**
 * save facebook form field mapping with ajax requiest
 * @returns if error then return otherwise it redirect to form list page
 */

function savefbFormFieldMapping() {

    $("#map_label_error").html("");
    var email_flag = "0";
    var field_flag = [];
    var duplicate_flag = [];
    var selectedArray = [];

    var emailKey = $('#email_key').val().trim();
    $("select[name^=mapped_column]").each(function (i, k) {
        if ($(this).val() == emailKey) {
            email_flag = "1";
        }
        
        if ($.inArray($.trim($(this).val()), selectedArray) !== -1) {
//            duplicate_flag.push(i);
        }
        if ($(this).val() === 'Select Label') {
            field_flag.push(i);
        } else if ($.trim($(this).val()) != '' && $(this).val() !== 'do_not_import') {
            selectedArray.push($(this).val());
        }

        $("#map_label_error-" + i).html("");
    });

    $(".emailError, #map_label_error").html("");
    if (field_flag.length > 0) {
        $.each(field_flag, function (i) {
            $("#map_label_error-" + field_flag[i]).html("All Facebook label must be mapped with NPF label.");
        });
       activeFbFieldMappingTab(); 
       
        return false;
    } else if (email_flag == "0") {
        if ($('.emailError').length > 0) {
//            $(".emailError").html("Mapping of NPF Email label is mandatory.");
        } else {
//            $("#map_label_error").html("Mapping of NPF Email label is mandatory.");
        }
        activeFbFieldMappingTab(); 
//        return false;
    } else if (duplicate_flag.length > 0) {
        $.each(duplicate_flag, function (i) {
            $("#map_label_error-" + duplicate_flag[i]).html("Duplicate mapping of NPF label is not allowed.");
        });
//        alert('22222');
//console.log(duplicate_flag);
        activeFbFieldMappingTab();
        return false;
    }
    var data = $('#facebookFieldForm').serializeArray();
    $.ajax({
        url: '/connectors/facebook-leads/save-fb-form-field-mapping',
        type: 'post',
        dataType: 'json',
        data: data,
        beforeSend: function (xhr) {
//            $('div.loader-block').show();
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (data == 'session') {
                window.location.reload(true);
            } else if (data.error) {
                $(".list_group_item, .bhoechie-tab-content").removeClass("active");
                $("#defaultFormFieldsMenu, #defaultFormFieldsContent").addClass("active");
                $(".error").text("");
                if(typeof data.error.missing_fields !== "undefined") {
                    var missingFiledsError = data.error.missing_fields;       
                    delete data.error.missing_fields;
                    if(missingFiledsError != undefined) {
                        alertPopup(missingFiledsError + " Please refresh your page to continue", 'error');
                    }                    
                }
                $.each(data.error, function(key, val) {
                    if(typeof $("#"+key) !== "undefined") {
                       $("#"+key).text(val);
                    }
                });

            } else if (data.success == 200) {
                alertPopup('Field configuration saved successfully.', 'success', data.redirect_form_listing);
                
                $('#SuccessPopupArea').on('hidden.bs.modal', function () {
                    window.location.href = data.redirect_form_listing;
                });
                
                
            } else {
                alertPopup('error', 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
//            $('div.loader-block').hide();
            $('.sectionLoader').hide();
        }
    });
}

/**
 * remove mapping field
 * @param {type} id
 * @returns {Boolean}
 */
function removeFbFormFieldsMapping(id) {
    if (typeof id == 'undefined' || id == '') {
        return false;
    }
    $.ajax({
        url: '/connectors/facebook-leads/remove-fb-form-field-mapping',
        type: 'post',
        dataType: 'json',
        data: {'hashid': id},
        beforeSend: function (xhr) {
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (data == 'session') {
                window.location.reload(true);
            } else if (data.error) {
                alertPopup(data.error, 'error');
            } else if (data.success == 200) {
                alertPopup('Field configuration removed successfully', 'success', data.redirect_form_listing);
            } else {
                alertPopup('error', 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.sectionLoader').hide();
//            $('div.loader-block').hide();
        }
    });
    return false;
}

function loadConnectorsByCategory(category, college_id,elem) {
    if (typeof category == 'undefined' || category == ''
            || typeof college_id == 'undefined' || college_id == '') {
        return false;
    }
    if(typeof elem !='undefined'){
        $('.extension_categorylist').removeClass('active');
        $(elem).addClass('active');
    }
    
    $('#load_connectors_category').html('');
    $('#searchbytext').show();
    $('#search_by_text').val('');
    $("#noDataFoundDiv").hide();
    $.ajax({
        url: '/college-settings/load-connectors-by-category',
        type: 'post',
        dataType: 'html',
        data: {'college_id': college_id, 'category': category},
        beforeSend: function (xhr) {
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (data === 'session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (data.indexOf('error:') > -1) {
                var error = data.replace(/error\:/, '');
                alertPopup(error, 'error');
            } else {
				 if(category =="Telephony"){
					 $('#extensionpopup .modal-dialog').removeClass('modal-lg').addClass('modal-xlg');
				 }else{
					 $('#extensionpopup .modal-dialog').removeClass('modal-xlg').addClass('modal-lg');
				 }
//                alert(data);
                $('#load_connectors_category').html(data);
            }
            $(document).find('#connectorContent').parent().removeClass('in');
            $(document).find('#load_connectors_category').show();
            $('[data-toggle="tooltip"]').tooltip();
             
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.sectionLoader').hide();
            $('#listloader').hide();
        }
    });
    return false;
}

function activeFbFieldMappingTab(){
//    $('#campaignMappingContent').removeClass("active");
//    $('#campaignMappingMenu').removeClass("active");
//    $('#fieldMappingMenu').addClass("active");
//    $('#fieldMappingContent').addClass("active");
    $('#fieldMappingMenu').trigger('click');
}


function disconnectAccount(hashed_data){
    $('.modal').modal('hide');
    $('#ConfirmMsgBody').html('Are you sure of this action? <br> Note: This action will delete all mapping data.');
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
    .one('click', '#confirmYes', function (e) {
        e.preventDefault();
        ajaxDisconnectAccount(hashed_data);
    });
}


function ajaxDisconnectAccount(hashed_data){
    $('.modal').modal('hide');
    $.ajax({
        url: '/connectors/facebook-leads/disconnect-account',
        type: 'post',
        dataType: 'json',
        data: {'hashed': hashed_data},
        beforeSend: function (xhr) {
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (typeof data['session'] != 'undefined') {
                window.location.reload(true);
            }
            else if (typeof data['error'] !='undefined') {
                alertPopup(data['error'],'error');
            }
            else {
                alertPopup('Successfully Disconnected','success','/college-settings/connectors-list');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.sectionLoader').hide();
             $('#listloader').show();
        }
    });
    
    return false;
}

function ajaxAdFormlist(hashed,listingType){
    if (listingType === 'reset') {
        $('.sectionLoader').show();
        $('#request_paging').val('');
        $('#listingContainerSection').html("");
        $('#load_more_button').hide();
        // $('#load_more_button').show();
        // $('#load_more_button').html("Loading...");
        // $('#LoadMoreArea').show();
    }
    $('#load_more_button').attr("disabled", "disabled");
    // $('#load_more_button').html("Loading...");

    var request_paging = '';
    if($('#request_paging').length > 0 && typeof $('#request_paging').val()!='undefined' && $('#request_paging').val()!=''){
        request_paging = $('#request_paging').val();
    }
   $.ajax({
        url: '/connectors/facebook-leads/ajax-ad-forms',
        type: 'post',
        dataType: 'html',
        data: {'hashed':hashed,'request_paging':request_paging},
        beforeSend: function (xhr) {
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            
            if (data == 'session') {
                window.location.reload(true);
            }
            else {
                $('#load_msg_div').hide();
                $('#LoadMoreArea').show(); 
                $('#listingContainerSection, #table-data-view, .download-after-data, #if_record_exists, #load_more_button').show();
                if (listingType === 'reset') {
                    $('#listingContainerSection').html(data);
                } else {
                    $('#listingContainerSection').find("tbody").append(data);
                }
                
                $('#load_more_button').attr("onclick","return ajaxAdFormlist('"+hashed+"','')");
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Data');
                // $('#listingContainerSection').html(data);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
//            $('div.loader-block').hide();
            $('.sectionLoader').hide();
        }
    });
}
    if($('.dynamic-dropdown').length > 0) {
        $('.dynamic-dropdown').SumoSelect({
            search: true,
        });
    }
function GetChildByMachineKeyField(key ,ContainerId,label,college_id, selectedCity){
    if(typeof college_id === 'undefined'){
        college_id = 0;
    }
    if(typeof selectedCity == 'undefined' || selectedCity == null){
        selectedCity = '';
    }
    
    if(ContainerId){
        $.ajax({
            url: '/common/GetChildByMachineKeyForRegistration',
            type: 'post',
            dataType: 'json',
            async: false,
            data: {key:key,college_id:college_id},
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            success: function (json) {
                if(json['redirect']){
                    location = json['redirect'];
                }
                if(json['error']){
                    alertPopup(json['error'],'error');
                }
                else if(json['success']){
                    var html = '<option value="">Select '+label+'</option>';
                    var htmloption = '';
                    if(json['list'] != false && json['list'] !='' && json['list'] != null){
                        for(var key in json['list']) {
                            htmloption += '<option value="'+key+'">'+json['list'][key]+'</option>';
                        }
                    }
                    $('#'+ContainerId).html(html+htmloption);
                    if(selectedCity != ''){
                        if(htmloption ==''){
                           $('#'+ContainerId).val("").trigger('change');
                        }
                        else{
                            $('#'+ContainerId).val(selectedCity).trigger('change');
                        }
                    }
                    try{
                        $('.chosen-select').chosen();   
                        $('.chosen-select').trigger('chosen:updated');
                        $('#'+ContainerId)[0].sumo.reload();
                        
                    }
                    catch(err){}
                }
            },
            complete: function() {
                $('.dynmDrpDown').each(function() {
                    default_val =  $(this).attr('default_val');
                    id =  $(this).attr('id');
                    if($(this).attr("allow_multiple") != "0" && typeof default_val !== "undefined") {
                        default_val = default_val.split(",");
                        id =  $(this).attr('id');
                        $.each(default_val, function( index, value ) {
                            selecter = "select#"+id+" option[value="+value+"]";
                            $(selecter).attr("selected","selected");
                        });  
                    } else if(typeof default_val !== "undefined") {
                        if($.trim(default_val) != "") {
                            selecter = "select#"+id+" option[value='"+default_val+"']";
                            $(selecter).attr("selected","selected");                               
                        }
                    }
                    $("#"+id)[0].sumo.reload();
                }); 
                $('.chosen-select').chosen();   
                $('.chosen-select').trigger('chosen:updated');
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        
    }
    else{
        $('#'+ContainerId).html('<option value="">Select '+label+'</option>');
    }
    $('.chosen-select').chosen();
    $('.chosen-select').trigger('chosen:updated');
    return false;
}
function increaseCounter(maxLength,counterSpanId, textAreaId) {
    $("#"+counterSpanId).text("Total characters count: "+ $("#"+textAreaId).val().length  + "/" + maxLength);
}


function changeYearVal( key, fromMonth, fromYear, toMonth, toYear, monthPlaceholder, dayPlaceholder){
    $("#"+key).val( "" );
    if($("#"+key+"_month").length > 0){
        $("#"+key+"_month").html('<option value="">'+monthPlaceholder+'</option>');
    }else{
        if($("#"+key+"_year").val()!==""){
            $("#"+key).val( "01-" + "01-" + $("#"+key+"_year").val() );
        }
        return;
    }
    if($("#"+key+"_day").length > 0){
        $("#"+key+"_day").html('<option value="">'+dayPlaceholder+'</option>');
    }
    if($("#"+key+"_year").val()===""){
        return;
    }
    var startMonth = 1;
    var endMonth   = 12;
    if( parseInt($("#"+key+"_year").val()) <= parseInt(fromYear) ){
        startMonth  = parseInt(fromMonth);
    }
    if( parseInt($("#"+key+"_year").val()) >= parseInt(toYear) ){
        endMonth    = parseInt(toMonth);
    }
    var html    = '<option value="">'+monthPlaceholder+'</option>';
    for (var i=startMonth;i<=endMonth;i++){ 
        var month   = i<10 ? "0"+String(i) : String(i);
        html    += '<option value="'+month+'">'+month+'</option>';
    } 
    $("#"+key+"_month").html(html);
    $('.chosen-select').chosen();
    $('.chosen-select').trigger('chosen:updated');    
}

function changeMonthVal( key, fromDay, fromMonth, fromYear, toDay, toMonth, toYear, dayPlaceholder){
    $("#"+key).val( "" );
    if($("#"+key+"_day").length > 0){
        $("#"+key+"_day").html('<option value="">'+dayPlaceholder+'</option>');
    }else{
        if($("#"+key+"_year").val()!=="" && $("#"+key+"_month").val()!==""){
            $("#"+key).val( "01-" + $("#"+key+"_month").val() +"-"+ $("#"+key+"_year").val() );
        }
        return;
    }
    if($("#"+key+"_year").val()==="" || $("#"+key+"_month").val()===""){
        return;
    }
    
    var year    = parseInt($("#"+key+"_year").val());
    var month    = parseInt($("#"+key+"_month").val());
    var startday = 1;
    var endDay   = 31;
    if( [4,6,9,11].indexOf(month) > -1 ){
        endDay  = 30;
    }if(month===2){
        if(year%4===0){
            endDay  = 29;
        }else{
            endDay  = 28;
        }
    }
    if( year <= parseInt(fromYear) ){
        if( month <= parseInt(fromMonth) ){
            startday  = parseInt(fromDay);
        }
    }else if( year >= parseInt(toYear) ){
        if( month >= parseInt(toMonth) ){
            endDay    = parseInt(toDay);
        }
    }
    var html    = '<option value="">'+dayPlaceholder+'</option>';
    for (var i=startday;i<=endDay;i++){ 
        var day   = i<10 ? "0"+String(i) : String(i);
        html    += '<option value="'+day+'">'+day+'</option>';
    } 
    $("#"+key+"_day").html(html);
    $('.chosen-select').chosen();
    $('.chosen-select').trigger('chosen:updated');    
}

function changeDayVal(key){
    $("#"+key).val( "" );
    if($("#"+key+"_year").val()!=="" && $("#"+key+"_month").val()!==""){
        $("#"+key).val( $("#"+key+"_day").val() +"-"+ $("#"+key+"_month").val() +"-"+ $("#"+key+"_year").val() );
    }
}
$(window).load(function() {
    $('.dynmDrpDown').each(function() {
        if($(this).val() != "") {
           $(this).trigger("change"); 
        }
    });
})

function viewDetails(college_id){
    $.ajax({
        url: '/college-settings/google_lead_ads',
        type: 'post',
        dataType: 'html',
        data: {college_id: college_id},
        beforeSend: function (xhr) {
//            $('div.loader-block').show();
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (data === 'session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (data.indexOf('error:') > -1) {
                var error = data.replace(/error\:/, '');
                alertPopup(error, 'error');
            } else {
                //$("#SuccessPopupArea .modal-title").html("Configuration");
//                $("#extensionpopup .content-body").html(data);
//                $("#extensionList").trigger('click');
//                $(".modal-backdrop").addClass('modal-backdrop-dark');
                $(document).find('#connectorContent').html(data);
                $('.scrolling-tabs').scrollingTabs();
                $(document).find('#connectorContent').parent().addClass('in');
                $(document).find('#load_connectors_category').hide();
                $('[data-toggle="tooltip"]').tooltip();
            }
            floatableLabel();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
//            $('div.loader-block').hide();
            $('.sectionLoader').hide();
        }
    });
    
}
// function overlay() {
//     $(".overlaybtn" ).click(function() {
//         $(".overlaydiv").addClass('in');
//     });
        
//     $(".overlaybackbtn" ).click(function() {
//         $(".overlaydiv").removeClass('in');
//     });
// }

// $(document ).ready(function() {
//     overlay();
// });