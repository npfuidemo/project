//$.material.init();
$(document).ready(function () {
    if($('.ratingButton').length>0){
        $('.ratingButton').click(function(e){         
            var applicationNo = $(this).data('applicationno');    
            var counter = $(this).text();
            var ratingkey = $(this).data('ratingkey');
            var fieldkey = $(this).data('fieldkey'); 
            $('.reg_'+ ratingkey +'_div .'+ applicationNo).addClass('active');
            $('.reg_'+ ratingkey +'_div .'+ applicationNo+ ' .btn').removeClass('scale');      
            $('.reg_'+ ratingkey +'_div .'+ applicationNo+  ' input[type=hidden]').remove();
            //alert('.reg_'+ ratingkey +'_div .'+ applicationNo+  ' .btn input[type=hidden]');
            $('.reg_'+ ratingkey +'_div .'+ applicationNo+ ' .btn_'+counter).addClass('scale');      
            var el = '<input type="hidden" name="'+fieldkey+'" value="'+ counter +'"></input>';
            $('.reg_'+ ratingkey +'_div .'+ applicationNo+ ' .btn_'+counter).append(el);
            e.preventDefault();
        });
    }
    
    $('#group_form_fields').SumoSelect({placeholder: 'Group Listing Fields', search: true, searchText:'Group Listing Fields', selectAll : false, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });  
    $('.group_form_fields_option').SumoSelect({placeholder: 'Listing Fields', search: true, searchText:'Listing Fields', selectAll : false, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });  
    $('#assigned_evaluators').SumoSelect({placeholder: 'Evaluators', search: true, searchText:'Search Evaluators', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });  
    //$('.widget_input').SumoSelect({ selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });  

    $(".erroralert").delay(5000).slideUp(300);
    $(".successalert").delay(5000).slideUp(300);
    
    if(typeof jsVars.college_id!='undefined' && typeof jsVars.form_id!='undefined') {
        getAllFormList(jsVars.college_id, jsVars.form_id);
       
    }
    
    if ($('.choosen-select-search-limit').length > 0){
        $(".choosen-select-search-limit").chosen({disable_search_threshold: 11});
    }
    
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
});

$(document).on('click', 'input[name="check[configuration][view_application]"]', function() {
    if($(this).prop('checked')) {
        $('input[name="check[configuration][edit_application]"]').parents('tr').show();
    } else {
        $('input[name="check[configuration][edit_application]"]').prop('checked',false).parents('tr').hide();
    }
});


$(document).on('click', '.user_form_submit',function() {
    var data = $("form#createScorePanel").serializeArray();
    data.push({name:'instructions',value:CKEDITOR.instances['editor'].getData()});
    data.push({name:'scoring_step',value:CKEDITOR.instances['editor_two'].getData()});
    var nextgo = $(this).attr('id');
    
     $.ajax({
        url: '/settings/saveScorePanel/'+jsVars.urls,
        type: 'post',
        dataType: 'json',
        data: data,
        beforeSend: function () {
            $('#listloader').show();
        },
        complete:function(){
            $('#listloader').hide();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        async:false,
        success: function (responseObject) {
            
            $(".error").html("");
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if(responseObject.status==0){
                var errorPosplace = false;
                $.each( responseObject.data, function( key, value ) {
                    $("#"+key+"_error").html(value);
                    $("#"+key+"_error").show();
					var errorPos = $("#"+key+"_error").offset().top - 100;
					//alert(errorPos);
					
					if(errorPosplace==false){
						$("html, body").animate({scrollTop: errorPos}, "slow");
						errorPosplace = true;
						//alert('sdfg');
						//alert(errorPos);
					}
                });
                
            }else if(responseObject.status==1){
                if(nextgo=='save_exit'){
                    location = '/settings/scoringPanel';
                }else if(nextgo=='save_configure'){
                    location = '/settings/configureScoringPanel/'+responseObject.data;
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError);
        }
    });
    
});

function getAllUserList(college_id,roleDropdown) {
    
    if(typeof default_assigned_child_users=='undefined'){
        var default_assigned_child_users = '';
    }
    
    $.ajax({
        url: '/users/getAllCollegeUserList',
        type: 'post',
        dataType: 'html',
        data: {'college_id':college_id,'default_assigned_child_users':default_assigned_child_users,'roleDropdown':roleDropdown},
        beforeSend: function () { 
            //$('#listloader').show();
        },
        complete:function(){
            //$('#listloader').hide();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        async:false,
        success: function (html) {
            var responseObject = $.parseJSON(html);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if(responseObject.message== 'not_counselor'){
                $("#userListOfCounselor").hide();
            }
            if (responseObject.status == 1) {
                $('#assigned_evaluators').html(responseObject.data);
                $('select#assigned_evaluators')[0].sumo.reload();
            } else {
                //alertPopup(responseObject.message, 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            window.location.reload(true);
        }
    });
    
}

 $(document).on('change','select#form_id', function (){
     getAllFieldList($(this).val());
 });

function getAllFieldList(formId) {
    var collegeID = $("#colleges").val();
    $.ajax({
        url: '/settings/getAllFieldList',
        type: 'post',
        dataType: 'json',
        data: {'form_id':formId,college_id:collegeID},
        beforeSend: function () { 
            //$('#listloader').show();
        },
        complete:function(){
            //$('#listloader').hide();
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        async:false,
        success: function (responseObject) {
            
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } 
            if (responseObject.status == 1) {
                $('#group_form_fields').html(responseObject.group_data);
                $('select#group_form_fields')[0].sumo.reload();
                
                $('.group_form_fields_option').html(responseObject.data);
                var allSel = $('.group_form_fields_option').length;
                var i;
                for (i = 0; i < allSel; i++) {
                    $('.group_form_fields_option')[i].sumo.reload();
                }
                //$('.group_form_fields_option')[1].sumo.reload();
                
            } else {
                //alertPopup(responseObject.message, 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //window.location.reload(true);
        }
    });
    
}

function getAllFormList(cid, default_val, multiselect) {
    
    if(typeof default_val=='undefined'){
        default_val = '';
    }
    if(typeof multiselect=='undefined'){
        multiselect = '';
    }
    
    $.ajax({
        url: '/voucher/get-forms',
        type: 'post',
        data: {
            "college_id": cid,
            "default_val": default_val,
            "multiselect":multiselect
        },
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
           //currentObj.text('Wait..');
        },
        success: function (json) {
            if (json == 'session_logout') {
                window.location.reload(true);
            } else {
                $("#formIdDiv").html(json);
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            }
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            ;
        }
    });
}

function selectAll(elem){
    if(elem.checked){
        $('.select_field').not(".disable-check").each(function(){
            this.checked = true;
        });
    }else{
        $('.select_field').not(".disable-check").attr('checked',false);
    }
}

$(document).on('click', '#scoreRegisterBtn', function () { 
    $( "#scoreCalculateBtn" ).trigger( "click" );
    if($("#showConfirmationMessage").length == 1) {
        $('#ConfirmMsgBody').html($("#showConfirmationMessage").val());
        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .one('click', '#confirmYes', function (e) {
            saveScorePunch();
            $('#ConfirmPopupArea').modal('hide');
        });        
    } else {
        saveScorePunch();
    }

});

var isVarRegisterUser = false;
function saveScorePunch() {
    $( "#scoreCalculateBtn" ).trigger( "click" );
    $("span.help-block").text('');
    var _csrfToken = $("form#createScorePunch input[name=\'_csrfToken\']").val();
    if (isVarRegisterUser == true) { //check whether ajax hit is already called. If already called then return from here
        //return;
    }
    
    if(runConditionalJsForScorcard()){
        return false;
    }

    var form = document.querySelector('form');
    var data = new FormData(form);
    //var data = $("form#createScorePunch").serializeArray();
    isVarRegisterUser = true; //If ajax hit is called then set this variable to true
    $.ajax({
        url: jsVars.urls,
        type: 'post',
        data: data,
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        headers: {
            "X-CSRF-Token": _csrfToken
        },
        beforeSend: function () {
            $('#register-now div.loader-block').show();
            $('#register-page div.loader-block').show();

            //Disable the register Button
            $("form#createScorePunch #scoreRegisterBtn").attr('disabled', 'disabled');
        },
        complete: function () {
            $('#register-now div.loader-block').hide();
            $('#register-page div.loader-block').hide();

            //Remove disabled
            $("form#createScorePunch #scoreRegisterBtn").removeAttr('disabled');
        },
        success: function (json) {
            isVarRegisterUser = false;
            if (json['redirect'])
            {
                location = json['redirect'];
            } else if (json['error']) {
                if (json['error']['msg']) {
                    alertPopup(json['error']['msg'], 'error');
                } else if (json['error']['list']) {
                    if (json['error']['list']['missing']) {
                        alertPopup(json['error']['list']['missing'], 'error');
                    } else {
                        for (var i in json['error']['list']) {
                            var parentDiv = $("form#createScorePunch #" + i).parents('div.form-group');
                            $(parentDiv).addClass('has-error');
                            $(parentDiv).find("span.help-block").text('');
                            $(parentDiv).find("span.help-block").html(json['error']['list'][i]);
                            $(parentDiv).find("span.help-block").show();
                        }
                        
                        //Scroll to First Error Box
                        if(typeof json['error']['firstErrorField'] !== 'undefined' && json['error']['firstErrorField'] !== '') {
                            var firstField = json['error']['firstErrorField'];
                            //For select box has chosen class then prepare the id to <fieldId>_chosen
                            if($("#"+firstField+'_chosen').length) {
                                firstField = firstField+'_chosen';
                            }
                            $('html, body').animate({
                                scrollTop: $("#"+firstField).offset().top -60
                            }, "slow");
                        }
                        
                    }
                }
            } else if (json['success'] == 200) {
                alertPopup(json['msg'], 'success',jsVars.detailsPageurls);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#register-now div.loader-block').hide();
        }
    });
}

$(document).on('click', '#scoreGroupRegisterBtn', function () { 
    $( "#scoreCalculateBtn" ).trigger( "click" );
    if($("#showConfirmationMessage").length == 1) {
        $('#ConfirmMsgBody').html($("#showConfirmationMessage").val());
        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .one('click', '#confirmYes', function (e) {
            saveGroupScorePunch();
            $('#ConfirmPopupArea').modal('hide');
        });        
    } else {
       saveGroupScorePunch();
    }    
});

function preSaveGroupScorePunch(id, uploadFileId='', thisObj='') {
    var helpSpan = $("span.help-block");
    for (i = 0; i < helpSpan.length; i++) {
        if(!$(helpSpan[i]).hasClass('fileUpload')) {
            $(helpSpan[i]).text('');
            $(helpSpan[i]).closest('.formAreaCols').removeClass('has-error');
        }
    }
    if (isVarRegisterUser == true) { //check whether ajax hit is already called. If already called then return from here
        //return;
    }
    //alert('Hello');
	//var leftPos = $(".gdMatrix .table-responsive").scrollLeft() + 'px';
	//alert(left);
	//$('.gdMatrix .table-responsive').animate({scrollLeft: leftPos}, 1000);
	
    if(runConditionalJsForScorcard()){
        return false;
    }
    var form = document.querySelector('form');
    var data = new FormData(form);
    data.set('app_no', id);
//    var data = [];  
//    $("#"+id+" input, #"+id+" select, #"+id+" textarea").each(function(){
//	var input = $(this);
//	if(input.attr('name') != '' && input.attr('name') != undefined){
//	    var name = input.attr('name');
//	    name = name.replace("[]","");
//	    data.push({name:name,value:input.val()});
//	 }
//    });

    isVarRegisterUser = true; //If ajax hit is called then set this variable to true
    $.ajax({
        url: jsVars.preSaveScorePunchUrls,
        type: 'post',
        data: data,
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#register-now div.loader-block').show();
            $('#register-page div.loader-block').show();

            //Disable the register Button
            $("form#createScorePunch #scoreRegisterBtn").attr('disabled', 'disabled');
        },
        complete: function () {
            $('#register-now div.loader-block').hide();
            $('#register-page div.loader-block').hide();

            //Remove disabled
            $("form#createScorePunch #scoreRegisterBtn").removeAttr('disabled');
        },
        success: function (json) {
            if(uploadFileId != '' && typeof json.error=='object' && json.error.hasOwnProperty(uploadFileId)) {
                $(thisObj).siblings('.help-block').html(json.error[uploadFileId]);
            } else if(uploadFileId != '' && typeof json.error=='object' && !json.error.hasOwnProperty(uploadFileId)){
                $(thisObj).siblings('.help-block').html('');
            } else if(uploadFileId != '' && typeof json.error=='string') {
                $(thisObj).siblings('.help-block').html('');
            }
            if(uploadFileId != '' && typeof json.filePreview=='object' && json.filePreview.hasOwnProperty(uploadFileId)) {
                $(thisObj).siblings('.gallery').html(json.filePreview[uploadFileId]);
            } 
            $(thisObj).val('');
            isVarRegisterUser = false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#register-now div.loader-block').hide();
        }
    });
}

function saveGroupScorePunch() {
    $("span.help-block").text('');
    if (isVarRegisterUser == true) { //check whether ajax hit is already called. If already called then return from here
        //return;
    }
    
    if(runConditionalJsForScorcard()){
        return false;
    }
    
    //var data = $("#createScorePunch").serializeArray();
    var form = document.querySelector('form');
    var data = new FormData(form);
    isVarRegisterUser = true; //If ajax hit is called then set this variable to true
    $.ajax({
        url: jsVars.groupScorePunchUrls,
        type: 'post',
        data: data,
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#register-now div.loader-block').show();
            $('#register-page div.loader-block').show();

            //Disable the register Button
            $("form#createScorePunch #scoreRegisterBtn").attr('disabled', 'disabled');
        },
        complete: function () {
            $('#register-now div.loader-block').hide();
            $('#register-page div.loader-block').hide();

            //Remove disabled
            $("form#createScorePunch #scoreRegisterBtn").removeAttr('disabled');
        },
        success: function (json) {
            isVarRegisterUser = false;
            if (json['redirect'])
            {
                location = json['redirect'];
            } else if (json['error']) {
                if (json['error']['msg']) {
                    alertPopup(json['error']['msg'], 'error');
                } else if (json['error']['list']) {
                    if (json['error']['list']['missing']) {
                        alertPopup(json['error']['list']['missing'], 'error');
                    } else {
                        for (var i in json['error']['list']) { //application_no in i
			    for (var j in json['error']['list'][i]) {
				var parentDiv = $("form#createScorePunch #"+ i +" ." +j).parents('div.form-group');
				$(parentDiv).addClass('has-error');
				$(parentDiv).find("span.help-block").text('');
				$(parentDiv).find("span.help-block").html(json['error']['list'][i][j]);
				$(parentDiv).find("span.help-block").show()
			    }
                        }
                    }
                }
            } else if (json['success'] == 200) {
                alertPopup(json['msg'], 'success',jsVars.detailsPageurls);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#register-now div.loader-block').hide();
        }
    });
}

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
    $('#SuccessPopupArea button.npf-close,#SuccessPopupArea  a.npf-close').hide();
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

function showCharactersLeft(fieldId,errorElementId,characterLimit){
    var used        = $("#"+fieldId).val().length;
    var available   = parseInt(characterLimit);
    $("#"+errorElementId).html( "Total characters count: "+(used)+"/"+(available) );
}

function showBulkCharactersLeft(fieldId,errorElementId,characterLimit,hash){
    var used        = $("#"+hash+" #"+fieldId).val().length;
    var available   = parseInt(characterLimit);
    var checkIdPattern = /[\[\]/]+/;
    var arrayCheckId = checkIdPattern.test(errorElementId);
    if(arrayCheckId == true){
        $("#"+hash+" ."+fieldId+" .text-left").html("Total characters count: "+(used)+"/"+(available));   
    }else{
        $("#"+errorElementId).html( "Total characters count: "+(used)+"/"+(available) );  
    }
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
}

function changeDay(key){
    $("#"+key).val( "" );
    if($("#"+key+"_year").val()!=="" && $("#"+key+"_month").val()!==""){
        $("#"+key).val( $("#"+key+"_day").val() +"-"+ $("#"+key+"_month").val() +"-"+ $("#"+key+"_year").val() );
    }
}

if($(".registration-date").length){
        $(".registration-date").each(function(){
            var dateFormat  = $(this).data("format");
            var startDate   = $(this).data("startdate");
            var endDate     = $(this).data("enddate");
            if(dateFormat=='DD/MM/YYYY'){
                $(this).datepicker({startView : 'decade', format : 'dd/mm/yyyy', enableYearToMonth: true, enableMonthToDay : true,startDate: startDate,endDate:endDate});
            }else if(dateFormat=="MM/YYYY"){
                $(this).datepicker({startView : 'decade', format : 'mm/yyyy', minViewMode: "months",startDate: startDate,endDate:endDate});
            }else if(dateFormat=="YYYY"){
                $(this).datepicker({startView : 'decade', format : 'yyyy', minViewMode: "years", startDate: String(startDate), endDate:String(endDate)});
            }
        });
    }
    
    function filterDialCode(fieldId) 
{
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

$(document).ready(function(e){
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
                $('#'+fieldId).val('');
                
                //For change Maxlength value of Mobile Input Box as per selection of country code
                if ($target.attr('data-value') == jsVars.defaultCountryCode) {
                    $('#'+fieldId).attr('maxlength',jsVars.maxMobileLength);
                } else {
                    $('#'+fieldId).attr('maxlength',jsVars.internationalMaxMobileLength);
                }
		return false;
	});
        jQuery('.filter_dial_code').on('click', function (e) {
                  e.stopPropagation();
               });
});

function setGroupRangeMessage(range) {
     if(range!='') {
        var msg = "Accepted Range 1-"+range;
        $("#group_range_msg").text(msg);
        $("#show_group_listing").show();
     }else{
         $("#show_group_listing").hide();
     }
}
 
//enter only numbers
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function getPanelInstructions(){
    var html = $('#popupContentText').html();
	$('#ActivityLogPopupArea').removeClass('offCanvasModal right');
	$('#ActivityLogPopupArea .close').css({"color":"#fff", "font-size":"16px", "margin-top":"5px", "opacity":"0.8"});
    $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
    $('#ActivityLogPopupArea #alertTitle').text('Instructions');
    $('#ActivityLogPopupHTMLSection').html(html);
    $('#ActivityLogPopupLink').trigger('click');
}

function addmoreLeadStage(div_class) {
    var stgClone = jQuery('.'+div_class+'>div').eq(0).clone();
    jQuery(stgClone).find('.CaptionCont,.optWrapper').remove();
    //jQuery(stgClone).find('.chosen-container').remove();
    jQuery(stgClone).find('.removeElementClass').html('<a class="text-danger" href="javascript:void(0);" title="Delete Lead Stage" onclick="return confirmDelete(this,\''+div_class+'\',\'group\');"><i class="fa fa-minus-circle font20" aria-hidden="true"></i></a>'); 
    jQuery(stgClone).find('select').val('');
    jQuery(stgClone).find('input').val('');
    jQuery(stgClone).find('select').SumoSelect({placeholder: 'Listing Fields', search: true, searchText:'Listing Fields', selectAll : false, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
    var count = jQuery('.'+div_class).find('.count_stage').length;
    jQuery(stgClone).find('select').attr('name', 'application_form_fields['+ count +'][]');
    jQuery('.'+div_class).append(stgClone);
    
    var stage_count =1;
    // reset stage count
    jQuery('.'+div_class+'>div').find('.count_stage').each(function(){
        jQuery(this).html(stage_count++);
    });
    
    disabledSelectedStages();
    return false;
}

function disabledSelectedStages() {
    $(".group_form_fields_option option").attr('disabled',false);
    $(".group_form_fields_option").each(function(){
        if($(this).val()!=null){
            if($(this).val().length){
                $("."+$(this).val()+":not(:selected)").attr('disabled',true);
            }
        }
    });
    //$('.group_form_fields_option').trigger("chosen:updated");
    $('.group_form_fields_option')[0].sumo.reload();
}

function confirmDelete(elem,div_class,type) {
    $('#ConfirmMsgBody').html('Do you want to delete '+type+'?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
    .one('click', '#confirmYes', function (e) {
        e.preventDefault();
        
            removeLeadStage(elem,div_class);
        
        $('#ConfirmPopupArea').modal('hide');
    });
    return false;
}

function removeLeadStage(elem,div_class){
    $(elem).closest('.row').remove();
     var stage_count =1;
    // reset stage count
    jQuery('.'+div_class+'>div').find('.count_stage').each(function(){
        jQuery(this).html(stage_count++);
    });
    disabledSelectedStages();
    return false;
}

$('#group_form_fields').change(function (event) {
    if ($('#group_form_fields').val() != null && $('#group_form_fields').val().length > 5) {
        alert('Max 5 selections allowed!');
        var $this = $(this);
        var optionsToSelect = last_valid_selection_tw;
        $this[0].sumo.unSelectAll();
        $.each(optionsToSelect, function (i, e) {
            $this[0].sumo.selectItem($this.find('option[value="' + e + '"]').index());
        });
        last_valid_selection_tw    = optionsToSelect;
    } else if($('#group_form_fields').val() != null){
        last_valid_selection_tw = $(this).val();
    }
});

$(window).load(function(){
	$('#listloader').hide();
})

function DeleteScoreCardFile(fileId, uploadKey, applicationNo) {
    $.ajax({
        url: jsVars.deleteUploadFileUrl,
        type: 'post',
        data: {'fileId':fileId, 'uploadKey':uploadKey, 'applicationNo':applicationNo},
        dataType: 'json',
        async: false,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if (json['redirect'])
            {
                location = json['redirect'];
            }  else if (json['success'] == 200) {
                $("#li_file_id_"+fileId).closest('.gallery').siblings('.help-block').html('');
                $("#li_file_id_"+fileId).remove();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#register-now div.loader-block').hide();
        }
    });
}
