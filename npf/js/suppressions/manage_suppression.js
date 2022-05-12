$('#suppressionsDateRange').daterangepicker({
        startDate: moment().subtract(30, 'days'),
        endDate: moment(),
        ranges: {
           'All Time': [moment().subtract(30, 'days'), moment(),'all time'],
           'Today': [moment(), moment(),'today'],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days'),'yesterday'],
           'Last 7 Days': [moment().subtract(6, 'days'), moment(),'last 7 days'],
           'Last 30 Days': [moment().subtract(29, 'days'), moment(),'last 30 days'],           
           'This Month': [moment().startOf('month'), moment().endOf('month'),'this month'],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month'),
               'last month']           
        },
        opens: 'left'
}, cb);

function cb(start, end,dateRangeStr) {
    let spanHtml = "";
    switch(dateRangeStr.toLowerCase()){
        case "all time":
            spanHtml = dateRangeStr.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase( ); });
            start = '',end ='';
            break;
        case "custom range":
            spanHtml = start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY');
            break;
        case "today":
        case "yesterday":
        case "last 7 days":
        case "last 30 days":
        case "this month":
        case "last month":
            spanHtml = dateRangeStr.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase( ); });
            break;
        default:
            spanHtml = start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY');
            break;
    }
    $('#suppressionsDateRange span').html(spanHtml);
    if(start!=='' && end!=''){
        var range = start.format('DD/MM/YYYY') + '-' + end.format('DD/MM/YYYY');
        $('#date_range').val(range);
    }
    else{
        $('#date_range').val('');
    }
    if($('.bouncesLink').attr('aria-expanded')==="true"){
        bounces('reset');
    }
    else if($('.unsubscribeLink').attr('aria-expanded')==="true"){
        loadUnsubscribeList('reset');
    }
}
////////////pagignation///////////////////////////
$(document).on('click', '.prev', function(event) {
   if($('#pageJump').val().match(/^\d+$/) == null || parseInt($('#pageJump').val()) < 2) {
       event.preventDefault();
       return false;
   } else if(parseInt($('#pageJump').val()) < 2 ) {
       alertPopup('Invalid Page Number', 'error');
       return false;
   }
   var updatePageValue = parseInt($('#pageJump').val()) - 1;
   if(updatePageValue < 2) {
       $(this).addClass('disabled');
       $('.next').removeClass('disabled');
   }
   $('#pageJump').val(updatePageValue);
   if($('.bouncesLink').attr('aria-expanded')==="true"){
        bounces();
    }
    else if($('.unsubscribeLink').attr('aria-expanded')==="true"){
        loadUnsubscribeList();
    }
});

$(document).on('click', '.next', function(event) {
   if($('#pageJump').val().match(/^\d+$/) == null ||  $('.next').hasClass("disabled")) {
       event.preventDefault();
       return false;
   } else if(parseInt($('#pageJump').val()) < 1) {
       alertPopup('Invalid Page Number', 'error');
       return false;
   }
   var updatePageValue = parseInt($('#pageJump').val()) + 1;
//   if(updatePageValue >= $('#maxPage').html()) {
//       $(this).addClass('disabled');
//       $('.prev').removeClass('disabled');
//   }
   $('#pageJump').val(updatePageValue);
   if($('.bouncesLink').attr('aria-expanded')==="true"){
        bounces();
    }
    else if($('.unsubscribeLink').attr('aria-expanded')==="true"){
        loadUnsubscribeList();
    }
});
$(document).on('change', '#rows', function() {
   $('#pageJump').val('1');
   if($('.bouncesLink').attr('aria-expanded')==="true"){
        bounces();
    }
    else if($('.unsubscribeLink').attr('aria-expanded')==="true"){
        loadUnsubscribeList();
    }
});
$(document).on('change', '#pageJump', function() {
   if($('#pageJump').val() == '' || $('#pageJump').val().match(/^\d+$/) == null) {
       alertPopup('Invalid Page Number', 'error');
       return false;
   } else if(parseInt($('#pageJump').val()) < 1) {
       alertPopup('Invalid Page Number', 'error');
       return false;
   }
   if($('.bouncesLink').attr('aria-expanded')==="true"){
        bounces();
    }
    else if($('.unsubscribeLink').attr('aria-expanded')==="true"){
        loadUnsubscribeList();
    }
});

///////////////////////////////////////
function loadUnsubscribeList(type='',error=''){
    if(error!=''){
        $('#unRecordDiv').hide();
        $('#unLoadMoreArea').hide();
        $('.unActionButton').hide();
        $('.noRecord').show();
        $('#load_msg').text(error);
        return false;
    }
    var collegeId = $('#collegeId').val();
    if(collegeId==''){
        return false;
    }
    var data = [];
    var un_page = $('#pageJump').val(), rows = $('#rows').val();
    if(type === 'reset') {
        un_page = 1;
        $('#pageJump').val(un_page);
        $('#unsubscribes').attr('checked',false);                
    }
    $('.noRecord').hide();
    var date_range = $('#date_range').val();
    var search_common = $('#search_common').val();
    if(typeof search_common == 'undefined' || search_common==''){
        search_common = '';
    }
    if(typeof date_range == 'undefined' || date_range==''){
        date_range = '';
    }
    data.push({name: "email", value: search_common});
    data.push({name: "collegeId", value: collegeId});
    data.push({name: "date_range", value: date_range});
    data.push({name: "page", value: un_page});
    data.push({name: "rows",value: rows});
    $.ajax({
        url: jsVars.FULL_URL +'/suppressions/unsubscribe-list',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () { 
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
        },
        success: function (data) {
            var responseObj = $.parseJSON(data);
            if(responseObj.status===200){
                $('#unRecordDiv').show();
                $('#unLoadMoreArea').show();
                $('.unActionButton').show();
                data = responseObj.data.html.replace("<head/>", '');
                if(data!=''){
                    $('#unsubscribe_record_load').html(data);
                }
                if(data=='' && un_page === 1){ 
                    $('#unRecordDiv').hide();
                    $('#load_msg').text('Records not found!!');
                    $('.noRecord').show();
                    $('.unActionButton').hide();                        
                }                
                selectAll('unsubscribes');
                /////////////////////
                if(un_page == 1) {
                   $('.prev').addClass('disabled');
                   $('.next').removeClass('disabled');                   
                }
                else if(un_page > 1 && (data.trim()==='' || responseObj.fetchRecord < rows)){
                    $('.next').addClass('disabled');
                    $('.prev').removeClass('disabled');
                }
                else{
                    $('.prev, .next').removeClass('disabled');
                }
               //////////////
                if(un_page == 1 && responseObj.fetchRecord < rows){
                    $('#unLoadMoreArea').hide();
                }
                if(un_page==0 && data.trim()===''){
                    $('#unRecordDiv').hide();
                    $('#load_msg').text('Records not found!!');
                    $('.noRecord').show();
                    $('.unActionButton').hide();
                }
                un_page = un_page + 1;  
            }
            else if(responseObj.status===0){
                if(responseObj.redirect!=='' && typeof responseObj.redirect!=="undefined"){
                    window.location = responseObj.redirect;
                }
                if(responseObj.error !==''){
                    $('#load_msg').text(responseObj.error);
                }
                $('.noRecord').show();
                $('#unRecordDiv').hide();
                $('#unLoadMoreArea').hide();    
                $('.unActionButton').hide();
                return false;
            }
            dropdownMenuPlacement();
            table_fix_rowcol();
			tableHeight();
            window.onresize = function() {
                tableHeight();
            }
            $('[data-toggle="tooltip"]').tooltip();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
function bounces(type='',error=''){
    if(error !=''){
        $('#bounceRecordDiv').hide();
        $('#bounceLoadMoreArea').show();
        $('.bounceActionButton').show();
        $('.noRecord').show();
        $('#load_msg').text(error);
        return false;
    }
    var collegeId = $('#collegeId').val();
    if(collegeId==''){
        return false;
    }
    var data = [];
    var bounce_page = $('#pageJump').val(), rows = $('#rows').val();
    if (type == 'reset') {
        bounce_page = 1;
        $('#pageJump').val(bounce_page);
        $('#bounces').attr('checked',false);
    }
    $('.noRecord').hide();
    var date_range = $('#date_range').val();
    var search_common = $('#search_common').val();
    if(typeof search_common == 'undefined' || search_common==''){
        search_common = '';
    }
    if(typeof date_range == 'undefined' || date_range==''){
        date_range = '';
    }
    data.push({name: "email", value: search_common});
    data.push({name: "collegeId", value: collegeId});
    data.push({name: "date_range", value: date_range});
    data.push({name: "page", value: bounce_page});
    data.push({name: "rows",value: rows});
    $.ajax({
        url: jsVars.FULL_URL +'/suppressions/bounces-list',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () { 
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
        },
        success: function (data) {            
            var responseObj = $.parseJSON(data);
            if(responseObj.status===200){
                $('#bounceRecordDiv').show();
                $('#bounceLoadMoreArea').show();
                $('.bounceActionButton').show();
                $('.noRecord').hide();
                
                data = responseObj.data.html.replace("<head/>", '');
                if(data!=''){
                    $('#bounce_record_load').html(data);
                }
                if(data=='' && bounce_page === 1){ 
                    $('.noRecord').show();
                    $('#bounceRecordDiv').hide();
                    $('#bounceLoadMoreArea').hide();
                    $('.bounceActionButton').hide();                      
                }
                selectAll('bounces');
                /////////////////////
                if(bounce_page == 1) {
                   $('.prev').addClass('disabled');
                   $('.next').removeClass('disabled');                   
                }
                else if(bounce_page > 1 && (data.trim()==='' || responseObj.fetchRecord < rows)){
                    $('.next').addClass('disabled');
                    $('.prev').removeClass('disabled');
                }
                else{
                    $('.prev, .next').removeClass('disabled');
                }
               //////////////
                if(bounce_page == 1 && responseObj.fetchRecord < rows){
                    $('#bounceLoadMoreArea').hide();
                }
                if(bounce_page==1 && data.trim()===''){
                    $('#bounceRecordDiv').hide();
                    $('#load_msg').text('Records not found!!');
                    $('.noRecord').show();
                    $('.bounceActionButton').hide();
                }
                bounce_page = bounce_page + 1;  
            }
            else if(responseObj.status===0){
                if(responseObj.redirect!=='' && typeof responseObj.redirect!=="undefined"){
                    window.location = responseObj.redirect;
                }
                if(responseObj.error !==''){
                    $('#load_msg').text(responseObj.error);
                }
                $('.noRecord').show();
                $('#bounceRecordDiv').hide();
                $('#bounceLoadMoreArea').hide();
                $('.bounceActionButton').hide();
                return false;
            }
            dropdownMenuPlacement();
            table_fix_rowcol();
			tableHeight();
            window.onresize = function() {
                tableHeight();
            }
            $('[data-toggle="tooltip"]').tooltip();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
function addSuppressions(){
    var addSuppressionEmail = $('#addSuppressionEmail').val();
    var collegeId = $('#collegeId').val();
    if(collegeId==''){
        return false;
    }
    $('#add-error').text('');
    $('#unLoadMoreArea').hide();
    $.ajax({
        url: jsVars.FULL_URL +'/suppressions/suppression-add',
        type: 'post',
        dataType: 'json',
        data: {'collegeId':collegeId,'addSuppressionEmail':addSuppressionEmail},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () { 
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
        },
        success: function(data) {
            if(data.status==200){
                $('.close').click();
                $('#addSuppressionEmail').val('');
                loadUnsubscribeList('reset');
                alertPopup(data.message,'success');
            }
            else if(data.status==0){
                if(data.redirect!=='' && typeof data.redirect!=="undefined"){
                    window.location = data.redirect;
                }
                $('#add-error').text(data.message);
                return false;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function removeBounce(email='',actionfrom=''){
    var collegeId = $('#collegeId').val();
    if(collegeId===''){
        alertPopup('College Id can\'t be blank','error');
        return false;
    }
    var emails = [];
    if(actionfrom==='multiple'){
        emails = $('#bounce_record_load .bounces').serializeArray();
//        email.forEach(function(val){
//            if(val.name==='bounces'){
//                if(val.value!==''){
//                    emails.push((val.value).toLowerCase());                    
//                }                             
//            }            
//        });        
    }
    else{
        //emails.push(email.toLowerCase()); 
        emails.push({name: "bounces", value: email});
    }
    var emailLength = emails.length;
    if(emailLength <=0){
        alertPopup('Emails are not selected.','error');
        return false;
    }
    var emailcount = 'this record ?';
    if(emailLength > 1){
        emailcount = emailLength+' records ?';
    }
    $('#ConfirmMsgBody').html('Do you want to remove '+emailcount);
    $('#confirmYes').css('margin', '10px');
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false }).off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $('#ConfirmPopupArea').modal('hide');        
        $('#bounceLoadMoreArea').hide();
        singleSelect('bounces','unchecked');        
        $.ajax({
            url: jsVars.FULL_URL +'/suppressions/deleteFromSendgride',
            type: 'post',
            dataType: 'json',
            data: {'collegeId':collegeId,'emails':emails,'endpoint':'bounces'},
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            beforeSend: function () { 
                $('.loader-block').show();
            },
            complete: function () {
                $('.loader-block').hide();
            },
            success: function(data) {
                if(data.status==200){
                    bounces('reset');
                    alertPopup(data.message,'success');
                }
                else if(data.status==0){
                    if(data.redirect!=='' && typeof data.redirect!=="undefined"){
                        window.location = data.redirect;
                    }
                    $('#bounceLoadMoreArea').show();
                    $('#bounceRecordDiv').show();
                    alertPopup(data.message,'error');
                    return false;
                }
                dropdownMenuPlacement();
                table_fix_rowcol();
                tableHeight();
                window.onresize = function() {
                    tableHeight();
                }
                $('[data-toggle="tooltip"]').tooltip();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });
}

//search collaspable 
$('.expended-search-link').click(function () {
    $('.expended-search-wrpper').addClass('active');
});
$('[data-dismiss="search"]').click(function () {
    $('#search_common').val('');
    $('.expended-search-wrpper').removeClass('active');
    if($('.bouncesLink').attr('aria-expanded')==="true"){
        bounces('reset');
    }
    else if($('.unsubscribeLink').attr('aria-expanded')==="true"){
        loadUnsubscribeList('reset');
    }
});

$(document).ready(function(){
    $('[data-dismiss="search"]').click(function(){
        if($.trim($('input#search_common').val()).length>0){
            $('input#search_common').val('');
            $('#seacrhList').trigger('click');
        }
    });
});


function removeSubscribes(email='',actionfrom=''){
    var collegeId = $('#collegeId').val();
    if(collegeId==''){
        alertPopup('College Id can\'t be blank','error');
        return false;
    }
    var emails = [];
    if(actionfrom === 'multiple'){
        emails = $('#unsubscribe_record_load .unsubscribes').serializeArray();
//        email.forEach(function(val){
//            if(val.name=='unsubscribes'){
//                if(val.value!==''){
//                    emails.push((val.value).toLowerCase());                    
//                }         
//            }            
//        });
    }
    else{
        //emails.push(email.toLowerCase());
        emails.push({name: "unsubscribes", value: email});
    }
    var emailLength = emails.length;
    if(emailLength <=0){
        alertPopup('Emails are not selected.','error');
        return false;
    }
    var emailcount = 'this record ?';
    if(emailLength > 1){
        emailcount = emailLength+' records ?';
    }
    $('#ConfirmMsgBody').html('Do you want to remove '+emailcount);
    $('#confirmYes').css('margin', '10px');
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false }).off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $('#ConfirmPopupArea').modal('hide');       
        $('#unLoadMoreArea').hide();
        //$('#unRecordDiv').hide();
        singleSelect('unsubscribes','unchecked');        
        $.ajax({
            url: jsVars.FULL_URL +'/suppressions/deleteFromSendgride',
            type: 'post',
            dataType: 'json',
            data: {'collegeId':collegeId,'emails':emails,'endpoint':'unsubscribes'},
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            beforeSend: function () { 
                $('.loader-block').show();
            },
            complete: function () {
                $('.loader-block').hide();
            },
            success: function(data) {
                if(data.status==200){
                    loadUnsubscribeList('reset');
                    alertPopup(data.message,'success');
                }
                else if(data.status==0){
                    if(data.redirect!=='' && typeof data.redirect!=="undefined"){
                        window.location = data.redirect;
                    }
                    $('#unLoadMoreArea').show();
                    $('#unRecordDiv').show();
                    alertPopup(data.message,'error');
                    return false;
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });
}

function selectAll(section){
    if($('#'+section).is(':checked')==true){
        $('.'+section).each(function(){
           this.checked = true;
       });
    }
    else{
        $('.'+section).attr('checked',false);
    }
}
function singleSelect(section,type=''){
    if(type=='unchecked'){
        $('#'+section).each(function(){
            this.checked = false;
        });
        return false;
    }
    $('#'+section).each(function(){
        this.checked = true;
    });
    $('.'+section).each(function(){
        if($(this).prop("checked")==false){
            $('#'+section).attr("checked",false);
             return false;
        }
    });
}
$(document).ready(function(){
    $('#bounceRemoveButton').click(function(){
        //var data = [];
        //data = $('#bouncesList').serializeArray();
        removeBounce('','multiple');
    });
    $('#unRemoveButton').click(function(){
        //var data = [];
        //data = $('#unsubscribesList').serializeArray();
        removeSubscribes('','multiple');
    });
    $('.searchBtn').click(function(){
       if($('.bouncesLink').attr('aria-expanded')==="true"){
            bounces('reset');
        }
        else if($('.unsubscribeLink').attr('aria-expanded')==="true"){
            loadUnsubscribeList('reset');
        }
    });
    $('.bounce #search_common').keypress(function (e) {
        var key = e.which;
        if(key === 13){
             bounces('reset');
        }
    });
    $('.unsubscribe #search_common').keypress(function (e) {
        var key = e.which;
        if(key === 13){
             loadUnsubscribeList('reset');
        }
    });
    $('.cancelBtn').click(function(){
       location.reload(); 
    });
});

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