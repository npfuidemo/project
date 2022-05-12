
$(window).load(function(){
    runAutoLoadJs();
});

$(document).ready(function(){
    if($(".sumo-select").length){
        $(".sumo-select").each(function(){
            $(this).SumoSelect({search: true, placeholder:$(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText:$(this).data('placeholder'), triggerChangeCombined: true });
            $(this).data("prev",$(this).val());
            if( typeof $(this).data("limit") !== "undefined" && parseInt($(this).data("limit")) > 0 ){
                $(this).on('change', function(evt) {
                    if ($(this).val() != null && $(this).val().length > parseInt($(this).data("limit"))) {
                        alert('Max '+parseInt($(this).data("limit"))+' selections allowed!');
                        var $this           = $(this);
                        var optionsToSelect = $(this).data("prev");
                        $this[0].sumo.unSelectAll();
                        $.each(optionsToSelect, function (i, e) {
                            $this[0].sumo.selectItem($this.find('option[value="' + e + '"]').index());
                        });
                        last_valid_selection    = optionsToSelect;
                    } else if($(this).val() != null){
                        $(this).data("prev",$(this).val());
                    }
                });
            }
        });
    }
    $("[myAttri='additionalTabFields']").hide();
    if($("[myAttri='additionalTabFields']").length == 0){
        $("#additionalDetailsTab").hide();
    }
//alert($(".registration-date").length);
    if($(".registration-date").length){
        $(".registration-date").each(function(){
            var dateFormat = $(this).data("format");
            var startDate   = $(this).data("startdate");
            var endDate     = $(this).data("enddate");
            if(dateFormat=='DD/MM/YYYY'){
				//alert('saDSDF');
                $(this).datepicker({startView : 'decade', format : 'dd/mm/yyyy', enableYearToMonth: true, enableMonthToDay : true,startDate: startDate,endDate:endDate}).on('hide', function(e) {
					$(this).parent().addClass('floatify__active');
				});
            }else if(dateFormat=="MM/YYYY"){
                $(this).datepicker({startView : 'decade', format : 'mm/yyyy', minViewMode: "months",startDate: startDate,endDate:endDate}).on('hide', function(e) {
					$(this).parent().addClass('floatify__active');
				});;
            }else if(dateFormat=="YYYY"){
                $(this).datepicker({startView : 'decade', format : 'yyyy', minViewMode: "years",startDate: String(startDate),endDate:String(endDate)}).on('hide', function(e) {
					$(this).parent().addClass('floatify__active');
				});;
            }
        });
    }
    
    //add sumo class on seminar/mock preference select
    if($('#addQuickLeadForm select#SeminarPreferenceId').length > 0) {
        $('#addQuickLeadForm select#SeminarPreferenceId').SumoSelect({placeholder: 'Seminar Preference Name', search: true, searchText:'Seminar Preference Name', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
    }
    
    if($('#addQuickLeadForm select#MockPreferenceId').length > 0) {
        $('#addQuickLeadForm select#MockPreferenceId').SumoSelect({placeholder: 'Mock Preference Name', search: true, searchText:'Mock Preference Name', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
    }
     var r = $('#ul_dial_codeMobile').closest(".bs-dropdown-to-select-group").find('[data-bind="bs-drp-sel-label"]').text();
            "" != r && "+91" != r ? ($("#StateId").length && ($("#StateId").val(""), void 0 !== $("select#StateId")[0].sumo && ($("select#StateId")[0].sumo.unSelectAll(), $("select#CityId")[0].sumo.unSelectAll())), $("#CityId").length && ($("#CityId").val(""), void 0 !== $("select#CityId")[0].sumo && $("select#CityId")[0].sumo.unSelectAll()), $(".chosen-select").length && $(".chosen-select").trigger("chosen:updated"), $("div.StateId, div.CityId").hide()) : "+91" == r && $("#StateId").parent().is(':visible') && $("#CityId").parent().is(':visible') && $("div.StateId, div.CityId").show()
    $( document ).on( 'click', '.bs-dropdown-to-select-group .dropdown-menu-list li', function( event ) {
    	var $target = $( event.currentTarget );
                var fieldId = $(this).data("fieldid");
		$target.closest('.bs-dropdown-to-select-group')
			.find('[data-bind="bs-drp-sel-value"]').val($target.attr('data-value'))
			.end()
			.children('.dropdown-toggle').dropdown('toggle');
		$target.closest('.bs-dropdown-to-select-group')
                //.find('[data-bind="bs-drp-sel-label"]').text($target.context.textContent);
    		.find('[data-bind="bs-drp-sel-label"]').text($target.attr('data-value'));
                
                //When Select the option from dropdown then close the open dropdown
              $target.closest('.bs-dropdown-to-select-group').removeClass('open');
                
                //Bydefault remove the value when value will change
                $('#addQuickLeadForm #'+fieldId).val('');
                
                //For change Maxlength value of Mobile Input Box as per selection of country code
                if ($target.attr('data-value') == jsVars.defaultCountryCode) {
                    $('#addQuickLeadForm #'+fieldId).attr('maxlength',jsVars.maxMobileLength);
                } else {
                    $('#addQuickLeadForm #'+fieldId).attr('maxlength',jsVars.internationalMaxMobileLength);
                }
		return false;
    });
    jQuery('.filter_dial_code').on('click', function (e) {
              e.stopPropagation();
    });
    
    if($('#addQuickLeadForm #ul_dial_codeMobile li').length>0){ /* if check dial code like +91 etc */
        $('#addQuickLeadForm #ul_dial_codeMobile li').on('click', function(){
            var cdc = $(this).data("value");
            if(cdc!='' && cdc!='+91'){
                $('#addQuickLeadForm #StateId').val('');
                $('#addQuickLeadForm #CityId').val('');
                $('div.StateId, div.CityId').hide();
            }else if(cdc=='+91'){
                $('div.StateId, div.CityId').show();
            }
        });
    }
});


function GetChildListByMachineKey(key,ContainerId){
    if(typeof ContainerId !== "undefined" && $("#"+ContainerId).length){
        $("#addQuickLeadForm #"+ContainerId).find('option[value!=""]').remove();
        if ($('.chosen-select').length > 0){
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
            $('.chosen-select').trigger('chosen:updated');
        }
        if(typeof key !== "undefined" && key !== '')
        {
            var postData    = {key:key};
            if($("#addQuickLeadForm #collegeId").length){
                postData['college_id']  = $("#addQuickLeadForm #collegeId").val()
            }
            if(ContainerId == 'DistrictId'){
                postData['includeDistricts']  = "1"
            }
            postData['cf']  = "lm-user-profile-back";
            $.ajax({
                url: '/common/GetChildByMachineKeyForRegistration',
                type: 'post',
                dataType: 'json',
                data: postData,
    //            headers: {
    //                "X-CSRF-Token": jsVars._csrfToken
    //            },
                beforeSend: function() {
                    $(".modalLoader").show();
                },
                complete: function() {
                    $(".modalLoader").hide();
                },
                success: function (json) {
                    if(json['redirect']){
                        location = json['redirect'];
                    }
                    if(json['error']){
                        alertPopup(json['error'],'error');
                    }
                    else if(json['success']){
                        var html='';
                        if(json['CategoryOptions']){
                            html = json['CategoryOptions'];
                        } else {
                            for(var key in json['list'])
                            {
                                html += '<option value="'+key+'">'+json['list'][key]+'</option>';
                            }
                        }
                        $("#addQuickLeadForm #"+ContainerId).append(html);
                        if(ContainerId == 'StateId'){
                            $('#addQuickLeadForm #StateId').attr('disabled','false');
                            $('#addQuickLeadForm #StateId').removeAttr('disabled');
                            if($('#addQuickLeadForm #DistrictId').length > 0){
                                $("#addQuickLeadForm #DistrictId").find('option[value!=""]').remove();
                            }
                            if($('#addQuickLeadForm #CityId').length > 0){
                                $("#addQuickLeadForm #CityId").find('option[value!=""]').remove();
                            }
                        }
                        if(ContainerId == 'DistrictId'){
                            $('#addQuickLeadForm #DistrictId').attr('disabled','false');
                            $('#addQuickLeadForm #DistrictId').removeAttr('disabled');
                            if($('#addQuickLeadForm #CityId').length > 0){
                                $("#addQuickLeadForm #CityId").find('option[value!=""]').remove();
                            }
                        }
                        if((ContainerId == 'CityId') && ($('#addQuickLeadForm #CityId').length > 0)){
                            $('#addQuickLeadForm #CityId').attr('disabled','false');
                            $('#addQuickLeadForm #CityId').removeAttr('disabled');
                        }
                        if ($('.chosen-select').length > 0){
                            $('.chosen-select').chosen();
                            $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
                            $('.chosen-select').trigger('chosen:updated');
                        }
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        }
    }
}


function saveQuickLead(viewAsApplicant = ''){
    if(runConditionalJs()){
        return false;
    }
    var valid_email = $.trim($("#valid_email").val());
    var url = '/leads/add-quick-lead';
    if(valid_email == "1" || valid_email == ""){
        $(".error").html("");
        var campaignError   = false;
        if( $("#source_tag").val()!=="" &&$("#source_tag").val().indexOf("'") !== -1 ){
            $("#LeadSource_error").html("Invalid Source.");
            campaignError   = true;
        }
        if( $("#medium_tag").val()!=="" &&$("#medium_tag").val().indexOf("'") !== -1 ){
            $("#LeadMedium_error").html("Invalid Medium.");
            campaignError   = true;
        }
        if( $("#campaign_tag").val()!=="" &&$("#campaign_tag").val().indexOf("'") !== -1 ){
            $("#LeadCampaign_error").html("Invalid Campaign.");
            campaignError   = true;
        }
        if(campaignError){
            return false;
        }
        $("#quickLeadLoader").show();
        $("#add_edit").attr('disabled','disabled');
        $("#view_as_applicant").attr('disabled','disabled');
        var upload_via = $('input[name=upload_via]:checked').val();
        if($('#quickLeadCtype').val() == 'lead'){
            var college_id = $.trim($("#user_college_id").val());
        } else {
            var college_id = $.trim($("#college_id").val());
            url = '/leads/CreateLeadAccount';
        }
        var formData   = new FormData($('#addQuickLeadForm')[0]);
        formData.append('s_college_id',college_id);
        formData.append('viewAsApplicant',viewAsApplicant);
        //var formData   = $("#addQuickLeadForm").serializeArray();
        //formData[formData.length] = { name: "s_college_id", value: college_id};
        //formData[formData.length] = { name: "viewAsApplicant", value: viewAsApplicant};
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
               "X-CSRF-Token": jsVars._csrfToken
            },
            begin : function(data){
				
            },
	    beforeSend: function () {
		$("#quickLeadLoader").hide();
                $('.modalLoader').show();
            },
            complete : function(data){
                //$("#quickLeadLoader").hide();
		$('.modalLoader').hide();
                $("#add_edit").removeAttr('disabled');
                $("#view_as_applicant").removeAttr('disabled');
            },
            success: function (json) {
                if(json['redirect']){
                    $('.modalLoader').show();
                    if(json['viewAsApplicant']){
                        $('#ShowWildCardUserBox').removeClass('in').hide();
                        $('.modal-backdrop').remove();
                        window.open( json['redirect'], 'viewAsApplicantWindow', 'width=1200, height=600, scrollbars=yes, left=100, top=50');
                    }else{
                        location = json['redirect'];
                    }
                }
                if(json['error']){
                    $(".error").show();
                    $(".show_err").hide();
                    $("#add_edit").removeAttr('disabled');
                    $("#view_as_applicant").removeAttr('disabled');
                    for(var objKey in json['error']){
                        if(json['error'].hasOwnProperty(objKey)){
                               if(objKey=='source_tag'){
                               $("#LeadSource_error").html(json['error']['source_tag']); 
                                
                            }
                            if(objKey=='medium_tag'){
                               $("#LeadMedium_error").html(json['error']['medium_tag']); 
                                
                            }
                            if(objKey=='campaign_tag'){
                               $("#LeadCampaign_error").html(json['error']['campaign_tag']); 
                                
                            }
                            if(objKey=='common'){
                                $(".show_err").show();
                            }else if(objKey.indexOf("Field")===0){
                                $("#additionalDetailsTab").click();
                            }else{
                                //$("#leadDetailsTab").click();
                                if(upload_via == 'mobile'){
                                    $("#emailIdDiv").hide();
                                }
                            }
                            
                            // commenting menika's code as it was incompatible with some browser instead using titleCase()
                            errorKeyName  = titleCase(objKey);
                            
                            /*** commenting menika's code as it was incompatible with some browsers
                            errorKeyName = objKey.replaceAll("_"," ");
                            errorKeyName = errorKeyName.toLowerCase().replaceAll(/\b[a-z]/g, function(letter) {
                                return letter.toUpperCase();
                            });
                            errorKeyName = errorKeyName.replaceAll(" ","");
                            ***/
                            if(objKey == 'interest_on_forms'){
                                $('#interest_on_forms_error').html(json['error'][objKey]);
                            }else{
                                $('#'+errorKeyName+"_error").html(json['error'][objKey]);
                            }
                        }
                    }
                }else if(json['status'] == 200){
                    if(json['redirect']){
                        $("#addQuickLeadForm").html('');
                    } else {
                        $("#addQuickLeadForm").html("<div class='alert alert-success' >Lead is added sucessfully.</div>");
                    }
                    $('#addQuickLeadDiv .modal-footer').remove();
                }

            },
            error: function (xhr, ajaxOptions, thrownError) {
               console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
               $("#add_edit").removeAttr('disabled');
               $("#view_as_applicant").removeAttr('disabled');
            }
        });
    }
}

function titleCase(str) {
   var splitStr = str.toLowerCase().split('_');
   for (var i = 0; i < splitStr.length; i++) {
       // You do not need to check if i is larger than splitStr length, as your for does that for you
       // Assign it back to the array
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
   }
   // Directly return the joined string
   return splitStr.join(''); 
}

// this function is used when there is mobile dial country code is selected in form applicant
function filterDialCode(fieldId){
    if(typeof fieldId=="undefined" || fieldId==null || fieldId=="undefined"){
        fieldId = '';
    }
    var value = $('#filter_dial_code'+fieldId).val();
    value = value.toLowerCase();    
    $("#ul_dial_code"+fieldId+" > li").each(function() {
        if ($(this).text().toLowerCase().search(value) > -1) {
//            $(this).text(src_str);
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });
}

/*Check Duplicate Email Validation*/
function isEmailExist(){
    if($("#Email").val() != "" && $("#application-manager").length < 1) {
        email = $("#Email").val(); 
        collegeId = "";
        if($('#quickLeadCtype').val() == 'lead'){
            collegeId = $.trim($("#user_college_id").val());
        } else {
            collegeId = $.trim($("#college_id").val());
        }
        $.ajax({
                url: '/common/check-email-exist',
                type: 'post',
                dataType: 'json',
                async: false,
                data:  {
                 email : $.trim(email),
                 collegeId:collegeId
                },        
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (response) {
                if (typeof response['data'] !== 'undefined' && response['data']!='') {
                    $("#Email_error").show();
                    $("#Email_error").html(response['data']);
                } else {
                    $("#Email_error").html('');        
                    $("#Email_error").hide();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {            
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });          
    }
}

function isEmailExist() {
    mobile = $("#Mobile-mobile").val(); 
    email = $("#Email").val(); 
    collegeId = "";
    uploadVia = $('input[name=upload_via]:checked').val();
    if($('#quickLeadCtype').val() == 'lead'){
        collegeId = $.trim($("#user_college_id").val());
    } else {
        collegeId = $.trim($("#college_id").val());
    }
    requestType = $("#application-manager").length == 1 ? "application" : "lead";
    $.ajax({
            url: '/common/check-email-exist',
            type: 'post',
            dataType: 'json',
            async: false,
            data:  {
             mobile : $.trim(mobile),
             email : $.trim(email),
             collegeId:collegeId,
             requestType:requestType,
             uploadVia:uploadVia
            },        
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (response) {
            if (typeof response['data'] !== 'undefined' && response['data']!='') {
                $("#Email_error").show();
                $("#Email_error").html(response['data']);
            } else {
                $("#Email_error").html(''); 
                $("#Email_error").hide();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {            
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/*Check Duplicate Mobile no Validation*/
function isMobileExist(){
    mobile = $("#Mobile-mobile").val(); 
    email = $("#Email").val(); 
    collegeId = "";
    uploadVia = $('input[name=upload_via]:checked').val();
    if($('#quickLeadCtype').val() == 'lead'){
        collegeId = $.trim($("#user_college_id").val());
    } else {
        collegeId = $.trim($("#college_id").val());
    }
    requestType = $("#application-manager").length == 1 ? "application" : "lead";
    $.ajax({
            url: '/common/check-mobile-exist',
            type: 'post',
            dataType: 'json',
            async: false,
            data:  {
             mobile : $.trim(mobile),
             email : $.trim(email),
             collegeId:collegeId,
             requestType:requestType,
             uploadVia:uploadVia
            },        
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (response) {
            if (typeof response['data'] !== 'undefined' && response['data']!='') {
                $("#Mobile_error").show();
                $("#Mobile_error").html(response['data']);
            } else {
                $("#Mobile_error").html(''); 
                $("#Mobile_error").hide();
            } 
        },
        error: function (xhr, ajaxOptions, thrownError) {            
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });             
}
/*Check Email Validation*/
function isValidEmailDNS(value,error_field,errorMessage){
    $("#Email_error").html("");
    $("#Email_error").hide();    
    if($.trim(value)!= '') {
        $(error_field).html('');
        //Call this ajax function
        $.ajax({
                url: '/common/check-email',
                type: 'post',
                dataType: 'json',
                async: false,
                data:  'email='+$.trim(value),        
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                if (typeof data['message'] !== 'undefined' && data['message']!='') {
                    $(error_field).show();
                    if(typeof errorMessage !== 'undefined' && errorMessage!==null && errorMessage!==''){
                        $(error_field).html(errorMessage).css({'color':'#a94442','display':'block'});
                    }else{
                        $(error_field).html(data['message']).css({'color':'#a94442','display':'block'});
                    }
                }  else {
                    isEmailExist();
                }         
            },
            error: function (xhr, ajaxOptions, thrownError) {            
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });    
    }
}

function showCharactersLeft(fieldId,errorElementId,characterLimit){
    var used        = $("#"+fieldId).val().length;
    var available   = parseInt(characterLimit);
    $("#"+errorElementId).html( "Total characters count: "+(used)+"/"+(available) );
}

function changeYear( key, fromMonth, fromYear, toMonth, toYear, monthPlaceholder, dayPlaceholder){
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
    }else if( parseInt($("#"+key+"_year").val()) >= parseInt(toYear) ){
        endMonth    = parseInt(toMonth);
    }
    var html    = '<option value="">'+monthPlaceholder+'</option>';
    for (var i=startMonth;i<=endMonth;i++){ 
        var month   = i<10 ? "0"+String(i) : String(i);
        html    += '<option value="'+month+'">'+month+'</option>';
    } 
    $("#"+key+"_month").html(html);
    $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
    $('.chosen-select').trigger('chosen:updated');
}

function changeMonth( key, fromDay, fromMonth, fromYear, toDay, toMonth, toYear, dayPlaceholder){
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
    $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
    $('.chosen-select').trigger('chosen:updated');
}

function changeDay(key){
    $("#"+key).val( "" );
    if($("#"+key+"_year").val()!=="" && $("#"+key+"_month").val()!==""){
        $("#"+key).val( $("#"+key+"_day").val() +"-"+ $("#"+key+"_month").val() +"-"+ $("#"+key+"_year").val() );
    }
}


function changeUploadViaMethod(uploadMethod){
    $("#source_tag").val('');
    $("#medium_tag").val('');
    $("#campaign_tag").val('');
    $('#interest_on_forms').val('');
    $('#Email').val('');
    $("#Mobile_error, #Email_error").hide();
    $('#interest_on_forms').trigger('chosen:updated');
    if($('#source_tag').hasClass('chosen-select')){
        $('#source_tag').trigger('chosen:updated');
        $('#medium_tag').trigger('chosen:updated');
        $('#campaign_tag').trigger('chosen:updated');
    }
    
    if(uploadMethod === 'mobile'){
        //$("#leadSourceDiv").hide();
        $("#emailIdDiv").hide();
        $("#interestOnFormsDiv").hide();
        $("#mobileFiledrequired").show();
    }else{
       // $("#leadSourceDiv").show();
        $("#emailIdDiv").show();
        $("#interestOnFormsDiv").show();
        $("#mobileFiledrequired").hide();
    }
   
}
function getChildCampaignTag(elem,campaign_tag_id=''){
    
    var element_id = $(elem).attr('id');
    var college_id = "";
    if($('#quickLeadCtype').val() == 'lead'){
        college_id = $.trim($("#user_college_id").val());
    } else {
        college_id = $.trim($("#college_id").val());
    }   
    var html_id_placeholder;
    if(campaign_tag_id !== '') {
        html_id_placeholder = $('#campaign_tag option[value=""]').text();
    } else {
        html_id_placeholder = $('#medium_tag option[value=""]').text();
    }
    var sourceTag = $("#source_tag").val();
    var mediumTag= $("#medium_tag").val()
    
    $.ajax({
        url: '/college-settings/offline-campaign-tag-parent-id',
        type: 'post',
        dataType: 'json',
        data: {
            "source_tag": sourceTag,
            "medium_tag": mediumTag,
            "element_id":element_id,
            "college_id": college_id,
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            if(typeof json['location'] != 'undefined'){
                location = json['location'];
            }
            else if(typeof json['error'] !='undefined'){
                alertPopup(json['error'],'error');
            }
            else{
                var html='<option value="">'+html_id_placeholder+'</option>';
                if(typeof json['list']!='undefined'){
                    for(var key in json['list']){
                        html += '<option value="'+key+'">'+json['list'][key]+'</option>';
                    }
                    if(campaign_tag_id !== '') {
                        $('#campaign_tag').html(html);
                        $('.chosen-select').trigger('chosen:updated');
                        $('#campaign_tag').trigger('change');
                    } else {
                        $('#medium_tag').html(html);
                        $('.chosen-select').trigger('chosen:updated');
                        $('#medium_tag').trigger('change');
                        
                        html_id_placeholder = $('#campaign_tag option[value=""]').text();
                        html='<option value="">'+html_id_placeholder+'</option>';
                        $('#campaign_tag').html(html);
                    }
                    
                    $("#leadSourceDiv .chosen-drop, .CounsellorId .chosen-drop").css({top:'auto',bottom: '105%'});
                    
                    /*$("#source_tag").chosen().next().removeClass('Up').addClass('Up');
                    $("#campaign_tag").chosen().next().removeClass('Up').addClass('Up');
                    $("#medium_tag").chosen().next().removeClass('Up').addClass('Up');*/
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    
    
}

function changeLeadDetailsType(type){
    if(type=='leadDetailsTab'){
        $("[myAttri='additionalTabFields']").hide();
        $("[myAttri='leadTabFields']").show();
        $("#leadDetailsTab").addClass('active');
        $("#additionalDetailsTab").removeClass('active');
        $(".leadExtraDetails").show();
    }else{
        $("[myAttri='additionalTabFields']").show();
        $("[myAttri='leadTabFields']").hide();
        $("#additionalDetailsTab").addClass('active');
        $("#leadDetailsTab").removeClass('active');
        $(".leadExtraDetails").hide();
    }
}

function quickLeadUploadFiles(id) {
    $('#'+id).parent().removeClass('file')
    $('#'+id+'_choose_files').val('')
    var input = document.getElementById(id);
    var output = document.getElementById(id+'_show');
    var chooseFiles = document.getElementById(id+'_choose_files');
    var selectFiles = "";
    var children = "";
    for (var i = 0; i < input.files.length; ++i) {
        if(i>0){
            selectFiles = (i+1) + " files" ;
        }else{
             selectFiles += input.files.item(i).name ;
        }
       children += '<span class="badge">' + input.files.item(i).name + '</span>&nbsp;';
        
    }
    
    output.innerHTML = children;
    chooseFiles.value = selectFiles;
    $('#'+id).siblings('.floatify__label').hide();
}

floatableLabel();



function resetInputFile(el){
    var fieldId = $(el).data("id")
    $('#'+fieldId).val('')
    $('#'+fieldId+'_choose_files').val('')
}

        