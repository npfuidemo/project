
var selectedFormStatus      = 'all';
var selectedFormCategory    = 'all';

$(document).ready(function() {
    //change for dashboard
    if (jsVars.selectedCategory === 'incomplete') {
        selectedFormStatus = 'incomplete';
        selectCategory(selectedFormCategory);
    }
    else {
        //add active class on seleted application category on sidebar
        if ((jsVars.applicationSelectedCategory !== 'undefined') && (jsVars.applicationSelectedCategory > 0)) {
            jsVars.selectedCategory = jsVars.applicationSelectedCategory;
        }
        selectCategory(jsVars.selectedCategory);

    }

    if($("#slabbanner").length > 0) {
         // if slabs category has any link
        if( $("table.category_form_62").find("a").length !== 'undefined' && $("table.category_form_62").find("a").length > 0 ){
            // if slabs category has any link of continue or apply now
            if($("table.category_form_62").find("a").text().substring(0, 8).toLowerCase()==="continue" || $("table.category_form_62").find("a").text().toLowerCase()==="apply now"){
                $("#slabbanner").show();
            }else{
                $("#slabbanner").remove();
            }
        } else {
            $("#slabbanner").remove();
        }
    }

    try {
        $('select.customparma').SumoSelect({placeholder: 'Select '+jsVars.field_name_2, search: true, searchText: 'Search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true});
        $('select.customparmb').SumoSelect({placeholder: 'Select '+jsVars.field_name_3, search: true, searchText: 'Search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true});
        $('select#custom_fields_1').SumoSelect({placeholder: 'Select Custom Fields', search: true, searchText: 'Search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true});
    } catch (error) {
    //console.error(error);
  // expected output: ReferenceError: nonExistentFunction is not defined
  // Note - error messages will vary depending on browser
}


});

function showFormsByStatus(status){
    selectedFormStatus  = status;
    showHideForms();
}

function selectCategory(category) {
    //stop to execute below js code for new applicant design on mobile
    if ((typeof jsVars.isMobile !== 'undefined') && (typeof jsVars.showNewDesignToApplicant !== 'undefined')) {
        return;
    }

    selectedFormCategory    = category;
    $(".li_category").removeClass('active');
    $("#li_"+category).addClass('active');
    showHideForms();
    $("#wrapper").removeClass('toggled');
    $(".overlay").hide();
    $(".hamburger").removeClass('is-open');
    $(".hamburger").addClass('is-closed');
}

function showHideForms(){
    $(".untouch").hide();
    $(".incomplete").hide();
    $(".completed").hide();
    if(selectedFormStatus==='all'){
        if(selectedFormCategory==='all'){
            $(".untouch").show();
            $(".incomplete").show();
            $(".completed").show();
        }else{
            $(".untouch.category_form_"+selectedFormCategory).show();
            $(".incomplete.category_form_"+selectedFormCategory).show();
            $(".completed.category_form_"+selectedFormCategory).show();
        }
    }else if(selectedFormStatus==='incomplete'){
        if(selectedFormCategory==='all'){
            $(".incomplete").show();
        }else{
            $(".incomplete.category_form_"+selectedFormCategory).show();
        }
        $(".no-data-text").html("<i class='fa fa-database fa-2x text-muted' aria-hidden='true'></i>&nbsp;No Applications In-Progress");
    }else if(selectedFormStatus==='completed'){
        if(selectedFormCategory==='all'){
            $(".completed").show();
        }else{
            $(".completed.category_form_"+selectedFormCategory).show();
        }
        $(".no-data-text").html("<i class='fa fa-database fa-2x text-muted' aria-hidden='true'></i>&nbsp;No Applications Completed");
    }
    if($(".category_heading").length){
        $(".category_heading").show();
        $(".category_heading").each(function(){
           var cat  = $(this).data('category');
           if($(".category_form_"+cat+":visible").length){
               $(this).show();
           }else{
               $(this).hide();
           }
        });
        if($(".category_heading:visible").length ){
            $(".no-data-row").hide();
        }else{
            $(".no-data-row").show();
        }
    }
    if($(".category_form_"+62).is(":visible") ){
        $("#slabbanner").hide();
    }else{
        $("#slabbanner").show();
    }
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

function  applyNowSlab(){
    if( $("table.category_form_62").find("a").length !== 'undefined' && $("table.category_form_62").find("a").length > 0 ){
        if($("table.category_form_62").find("a").text().substring(0, 8).toLowerCase()==="continue" || $("table.category_form_62").find("a").text().toLowerCase()==="apply now"){
            $("table.category_form_62").find("a")[0].click();
        }
    }
}

function showCounsellingText(id,title) {
    var text = $('#' + id).html();
    if(typeof title==="undefined" || title==null || title==''){
        title   = 'Counselling Information';
    }
    $('#ActivityLogPopupArea #alertTitle, #ActivityLogPopupArea #ActivityLogPopupTitle').html(title);
    $('#ActivityLogPopupHTMLSection').addClass('text-left');
    $('#ActivityLogPopupArea .modal-content').css({'width':'100%','padding-bottom':'20px'});
    $('#ActivityLogPopupArea .modal-body').css({'overflow-y':'auto','max-height':'400px'});
    //$('#ActivityLogPopupArea .modal-dialog').css('width','900px');
    $('#ActivityLogPopupHTMLSection').html(text);

    $('#ActivityLogPopupHTMLSection').find('tr').each(function() {
//        $(this).removeAttr('style');
        $(this).css('display','block');
        $(this).show();
    });
    $('#ActivityLogPopupArea').modal('show');
    return;
}

function changeToCompletedTab()
{
    $("#statusWiseForms li").removeClass("active");
    $("a[aria-controls='completed-form']").trigger("click");
    showFormsByStatus('completed');
}

var schedulePage;
function showExamSchedulList(...args){
        var fId = (typeof args[0] !== 'undefined') ? args[0] : 0;

        if(typeof args[1] == 'undefined') {
            schedulePage = 0;
        }

        if(typeof args[2] !== 'undefined' && args[2] !== '') {
            schedulePage = args[2];
        }

        $.ajax({
            url: jsVars.showExamScheduleURL,
            type: 'post',
            dataType: 'html',
            data: {
                "fId": fId,
                "Page": schedulePage,
            },
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                //$('#userProfileLoader').show();
                $('#showExamScheduleList').html('<div class="Loader-block"></div>');
            },
            complete: function () {
                //$('#showExamScheduleList').html('');
            },
            success: function (html) {
                $('#showExamScheduleList').html(html);
                $('#viewExamScheduleModal').addClass('modalWide');
                $('#viewExamScheduleModal').modal({backdrop: 'static', keyboard: false});
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
}

function getOnlineOfflineFields(fid,mod) {
        $.ajax({
            url: jsVars.getOnlineOfflineFeldsURL,
            type: 'post',
            dataType: 'html',
            data: {
                "fId": fid,
                'Mod':mod
            },
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                //$('#userProfileLoader').show();
                $('#viewOnlineOffline').html('<div class="Loader-block"></div>');
            },
            complete: function () {
                //$('#showExamScheduleList').html('');
            },
            success: function (html) {
                $('#viewOnlineOffline').html(html);
                //$('#viewOnlineOfflineModal').addClass('modalWide');
                $('#viewOnlineOfflineModal').modal({backdrop: 'static', keyboard: false});
                $('.chosen-select').chosen({disable_search_threshold: 10});
                $('.chosen-select').trigger("chosen:updated");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
}

function saveOnlineOfflineConfig() {

    var data = $('#examOnlineOfflineVendor').serializeArray();

    $.ajax({
        url: jsVars.saveOnlineOfflineFieldsURL,
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            //$('#userProfileLoader').show();
            //$('#viewOnlineOffline').html('<div class="Loader-block"></div>');
        },
        complete: function () {
            //$('#showExamScheduleList').html('');
        },
        success: function (json) {
            console.log(json['status']);
            if(json['status']==200) {
                $(".retakeButtonDisable").attr("disabled","disabled");
                window.location = json['redirectUrl'];
            }else if(json['message']!=''){
                $('.errorMessage').html(json['message']);
            }else{
                alertPopup('Some Error occured, please try again.', 'error');
                window.location.reload();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function showWithdrawPopup(formId,showWithdrawFields) {
    $.ajax({
        url: jsVars.FULL_URL+'/withDrawFee',
        data : {form_id:formId},
        type: 'post',
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
        },
        success: function (html) {
            $("#withdrawDiv").html(html);
            $(".sumo-select").SumoSelect({search: true, placeholder:$(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText:$(this).data('placeholder'), triggerChangeCombined: true });
            $("#feeWithdrawModal").modal('show');
        },
        error: function (xhr, ajaxOptions, thrownError) {
        }
    });
}

$(document).on('click','#withdrawsubmitbtn',function(){
    $(".help-block").html('');
    $("div.form-group").removeClass('has-error');
    var error = false;
    var $withdrawFields = $("#WithdrawFeeForm").find('input.mandatary-fields , select.mandatary-fields, textarea.mandatary-fields');
    $withdrawFields.each(function() {
        var withdrawFieldId = $(this).attr("id");
        if ($.trim($(this).val()) === '') {
            var Parent = $('#'+withdrawFieldId).closest('div.form-group');
            $(Parent).find('p.help-block').html('Please enter '+withdrawFieldId.replace(/\_/g, " ")+'.');
            $(Parent).addClass('has-error');
            error = true;
        }
    });

    if (error === true) {
        return false;
    }

    if (validateWithdrawFee() === false) {
        return false;
    }

});

function validateWithdrawFee() {
    var data  = [];
    var status = false;
    if($('#WithdrawFeeForm').length > 0) {
        var field_id = $('#field_id').val();
        var field_name = $('#field_name').val(); 
//        data = $("#WithdrawFeeForm").serializeArray();
        data = new FormData($("#WithdrawFeeForm")[0]);
        data.append('field_name', field_name);
        data.append('field_id', field_id);
        arrayClean(data, 'field_fees[]');
        field_fees = []
        unipe_field_fees = []
        $("#WithdrawFeeForm #fees :selected").each(function($index) {
            feetype = $(this).data('feetype')
            if(feetype == 'npf'){
                data.append('field_fees[]', $(this).val());
            }
            if(feetype == 'unipe'){
                data.append('unipe_field_fees[]',$(this).val());
            }
        });
    }

    $.ajax({
        url: jsVars.FULL_URL+'/validate-withdraw-fee',
        data :data,
        type: 'post',
        cache: false,
        contentType: false,
        processData: false,
        dataType:'json',
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
        },
        complete: function () {
        },
        success:function (json){
            if(json['status'] === false){
                if(json['message']){
                    for(var name in json['message']){
                        var Parent = $('#'+name).closest('div.form-group');
                        $(Parent).find('p.help-block').html(json['message'][name]);
                        $(Parent).addClass('has-error');
                    }
                }
                status = false;
            }else{
                status = true;
                $('form#WithdrawFeeForm').submit();
            }
        }
    });
    return status;
}

$(document).on('submit', 'form#WithdrawFeeForm',function(e) {
	$("#feeWithdrawModal").modal('hide');
    $("#confirmYes").removeAttr('onclick');
    $('#confirmTitle').html("Fee Withdraw Confirmation");
    $("#confirmYes").html('Yes').css('color', '#fff');
	$('#confirmYes').addClass('btn-brand');
    $("#confirmYes").siblings('button').html('No');
	$("#confirmYes").siblings('button').css('margin-right', '10px');
    $('#ConfirmMsgBody').html('Are you sure you want to request Withdrawal of amount paid?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();

        saveWithdraw();
    $('#ConfirmPopupArea').modal('hide');
    });
    return false;
});


function saveWithdraw(){
    $(".help-block").html('');
    $("div.form-group").removeClass('has-error');
    $("form#WithdrawFeeForm #withdrawsubmitbtn").attr('disabled','disabled');

    if($('#WithdrawFeeForm').length > 0) {
        var field_id = $('#field_id').val();
        var field_name = $('#field_name').val(); 
        var field_type = $('#field_type').val(); 
        var data = new FormData($("#WithdrawFeeForm")[0]);
        data.append('field_name', field_name);
        data.append('field_type', field_type);
        data.append('field_id', field_id);
        //var data = $("#WithdrawFeeForm").serializeArray();
        arrayClean(data, 'field_fees[]');
        field_fees = []
        unipe_field_fees = []
        $("#WithdrawFeeForm #fees :selected").each(function($index) {
            feetype = $(this).data('feetype')
            if(feetype == 'npf'){
                data.append('field_fees[]', $(this).val());
            }
            if(feetype == 'unipe'){
                data.append('unipe_field_fees[]', $(this).val());
            }
        });
        //delete data['payment_process_type']
    }

    $.ajax({
        url: jsVars.FULL_URL+'/save-withdraw',
        data : data,
        type: 'post',
        cache: false,
        contentType: false,
        processData: false,
        dataType:'json',
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $('div.newLoader').show();
        },
        complete: function () {
            $('div.newLoader').hide();
        },
        success:function (json){
            $("form#WithdrawFeeForm #withdrawsubmitbtn").removeAttr('disabled');
            if(json['message'] === 'session')
            {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if(json['message'] === 'invalid_request'){
                alertPopup('Some Error occured, please try again.', 'error');
            }else if(json['status'] === 1){
                if(json['error']){
                    alertPopup('Some Error occured, please try again.', 'error');
                }else{
                    location.reload();
                }
            }
            return false;
        },
        resetForm: false
    });
    return false;
}

function GetChildByMachineKey(key,ContainerId,defaultValue){
    if(key && ContainerId){
            $.ajax({
                url: '/common/GetChildByMachineKeyForRegistration',
                type: 'post',
                dataType: 'json',
                data: {key:key,college_id:0},
                success: function (json) {
                    if(json['redirect']){
                        location = json['redirect'];
                    }
                    if(json['error']){
                        alertPopup(json['error'],'error');
                    }
                    else if(json['success']){
                        var html = '';
                        var l;
                        if(typeof jsVars.customParam2!='undefined') {
                            l= JSON.parse(jsVars.customParam2);
                        }
                        for(var key in json['list']) {
                            if(typeof l!='undefined' && l[key] == key){
                                //html += '<option selected value="'+key+'">'+json['list'][key]+'</option>';
                            }else{
                                html += '<option value="'+key+'">'+json['list'][key]+'</option>';
                            }
                        }
                        $('#'+ContainerId).html(html);

                        //$('.chosen-select').chosen();
                        //$('.chosen-select').trigger('chosen:updated');
                        $('#'+ContainerId)[0].sumo.reload();

                        if(typeof defaultValue != 'undefined' && defaultValue !=null && defaultValue !=''){
                            $('#'+ContainerId).val(JSON.parse(defaultValue));
                            $('#'+ContainerId)[0].sumo.reload();
                        }


                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });

    }else{
        $('#'+ContainerId).html('');
        $('select.customparma')[0].sumo.reload();
    }

    return false;
}

function GetSortedChildByMachineKey(key,ContainerId,defaultValue){
    if(key && ContainerId){
            $.ajax({
                url: '/common/GetChildByMachineKeyForRegistration',
                type: 'post',
                dataType: 'json',
                data: {key:key,college_id:0,sort:true},
                success: function (json) {
                    if(json['redirect']){
                        location = json['redirect'];
                    }
                    if(json['error']){
                        alertPopup(json['error'],'error');
                    }
                    else if(json['success']){
                        var html = '';
                        if($('select.customparmb').length){
                            $('#'+ContainerId).data("title");
                            html = '<option value=""> Select '+$("#"+ContainerId).data("title")+'</option>';
                        }
                        var l;
                        if(typeof jsVars.customParam2!='undefined') {
                            l= JSON.parse(jsVars.customParam2);
                        }
                        for(var key in json['list']) {
//                            if(typeof l!='undefined' && l[key] == key){
                                //html += '<option selected value="'+key+'">'+json['list'][key]+'</option>';
//                            }else{
                                html += '<option value='+key+'>'+json['list'][key]+'</option>';
//                            }
                        }
                        $('#'+ContainerId).html(html);
                        $('#'+ContainerId)[0].sumo.reload();

                        if(typeof defaultValue != 'undefined' && defaultValue !=null && defaultValue !=''){
                            $('#'+ContainerId).val(JSON.parse(defaultValue));
                            $('#'+ContainerId)[0].sumo.reload();
                        }


                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });

    }else{
        var html ='';
        if($('select.customparmb').length){
            $('#'+ContainerId).data("title");
            html = '<option value=""> Select '+$("#"+ContainerId).data("title")+'</option>';
        }
        $('#'+ContainerId).html(html);
        $('#'+ContainerId)[0].sumo.reload();
    }

    return false;
}

// Function to perform SSO and get Take Test URL for GMAC Examity
function getSsoURL(data){

    $.ajax({
            url: jsVars.getSsoUrl,
            type: 'post',
            dataType: 'html',
            data: {
                "data": data
            },
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('div.newLoader').show();
            },
            complete: function () {
                $('div.newLoader').hide();
            },
            success: function (result) {
                try{
                    json=JSON.parse(result);
                    if(json['status']==200) {
                        window.location = json['redirectURL'];
                    }else if(json['message']!=''){
                        if(json['message']=='session'){
                            window.location=json['redirectURL'];
                        }
                        alertPopup(json['message'], 'error');
                    }else{
                        alertPopup('Some Error occured, please try again.', 'error');
                        window.location.reload();
                    }
                }catch(e){
                     alertPopup('Some Error occured !', 'error');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

}


$('html').on('click','.zoom-call',function(){
    meeting_id = $(this).data('meeting-id');
    meeting_account = $(this).data('meeting-account');
    getMeetingLink(meeting_id,meeting_account);
});

function getMeetingLink(meeting_id,meeting_account){
    $.ajax({
        url: jsVars.getMeetingLink,
        type: 'post',
        dataType: 'json',
        data: {'meeting_id' : meeting_id,'meeting_account':meeting_account},
        beforeSend: function (xhr) {
            $('.newLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            console.log(data);
            if (typeof data['session'] != 'undefined') {
                window.location.reload(true);
            }else if (typeof data['status'] !='undefined' && data['status'] == 0) {
                 alertPopup(data['message'],'error');
            }else if(typeof data['status'] !='undefined' && data['status'] == 1)  {
                zoom_link = data['join_url']
                window.open(zoom_link,"_blank");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.newLoader').hide();
        }
    });
}

//gdpicarousel_ message sider
if(jQuery(".carousel").length>0){
    jQuery('.carousel').on('slid.bs.carousel', '', function() {
        var $this = jQuery(this);

        $this.children('.carousel-control').removeClass('disable');
        if($this.closest('.carousel').find('.carousel-inner .item:first').hasClass('active')) {
            $this.children('.left.carousel-control').addClass('disable');
        } else if($this.closest('.carousel').find('.carousel-inner .item:last').hasClass('active')) {
            $this.children('.right.carousel-control').addClass('disable');
        }
    });
}

var sendLogoutData = 0;
function logoutEvent(collegeId) {
    if(collegeId == 524 && sendLogoutData === 0) {
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
          'event': 'Profile',
          'category': 'Application - Profile',
          'action': 'Click',
          'label': 'Logout'
        });
        sendLogoutData = 1;
    }
}


if ( $('.single-pay-btn').length > 0) {
    var spn_btn_table = jQuery('.single-pay-btn').closest('.table-responsive');
    jQuery(".single-pay-btn").on("show.bs.dropdown", function (event) {
        spn_btn_table.css('overflow-x', 'visible');
    });
    jQuery(".single-pay-btn").on('hidden.bs.dropdown', function () {
        spn_btn_table.css('overflow-x', 'auto');
    });
};

$(document).ready(function(){
    $('#whatsappOptStatus').on("click",function(){
        var checked = $(this).prop('checked');
        var WhatsAppOptInStatus = 'Yes;;;Yes';
        if(checked){
            WhatsAppOptInStatus = 'No;;;No';
        }
        $.ajax({
            url: jsVars.FULL_URL+'/whatsapp-opt-out-status',
            data : {'WhatsAppOptStatus':WhatsAppOptInStatus},
            type: 'post',
            dataType:'json',
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            beforeSend: function () {
            },
            complete: function () {
            },
            success:function (json){
                if(json['status'] === true){                    
                    notifyAlert(json['message'], 'success');
                }else if(json['message'] === 'session'){
                    location = jsVars.FULL_URL;
                }else if(json['message'] === 'invalid_request'){
                    notifyAlert('Some Error occured, please try again.', 'error');
                }
                else{
                    notifyAlert('Some Error occured, please try again.', 'error');
                }
            }
        });
    });
});

$(document).ready(function(){
    jQuery('.whatsapp-comm-btn,.whatsapp-widget-close,.whatsapp-communication-backdrop').click(function(){
        jQuery('.whatsapp-communication-widget').toggleClass('active');
    });
});

function notifyAlert(msg,type) {
    if(typeof type == "undefined" || type == "" || typeof msg == "undefined" || msg == ""){
        return false;
    }
    $('.whatsapp-widget-close').trigger('click');
   // Get the notifyAlert DIV
    var notifyDiv = $("#notifyAlert");
   // var noticeAlert = $("#notifyAlert .notify-content");
    //var icon = '<div class="alert-icon"><span class="material-icons">check</span></div>';
    var alertClass = ' alert alert-success';
    if(type === "error"){
        alertClass = 'alert alert-danger';
        //icon = '<div class="alert-icon"><span class="material-icons">error_outline</span></div>'
   }else{
      alertClass = ' alert alert-success';
   }
   var notifyContent = '<div class="notify-content alert'+ alertClass +'">'+msg+'</div>';
   notifyDiv.html(notifyContent);
   // Add the "show" class to DIV
   notifyDiv.css('display','flex');
   // After 3 seconds, remove the show class from DIV
   setTimeout(function(){
        $('#notifyAlert').removeClass('dataHidden');
    }, 1000);
   setTimeout(function(){
      $('#notifyAlert').addClass('dataHidden');
   }, 6000);
 }


var uniPeFeeEnabledFormList = jsVars.uniPeFeeEnabledFormList
var pay_fee_column = $("#pay_fee_column").val()

if (pay_fee_column && (uniPeFeeEnabledFormList.length > 0)) {    
    
    $.ajax({
        url: jsVars.FULL_URL+'/get-token-fee-payment-button',
        type: 'post',
        dataType: 'json',
        async: false,
        data: {
            "formId": uniPeFeeEnabledFormList
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
              $('#viewOnlineOffline').html('<div class="Loader-block"></div>');
        },
        complete: function () {
            //$('#showExamScheduleList').html('');
        },
        success: function (json) {
            if (json['redirect']) {
                location = json['redirect'];
            } else if (json['error']) {
                notifyAlert(json['error'], 'error');
            } else if (json['uniPeFeeBtnList']) {
                for (var formId in json['uniPeFeeBtnList']) {
                    $("#payment_" + formId).html(json['uniPeFeeBtnList'][formId]);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });    
}


$('.unipeFeeButton').click(function () {
    data = $(this).attr('data-feeData')
    $.ajax({
        url: jsVars.FULL_URL + '/generate-order',
        type: 'post',
        dataType: 'json',
        async: true,
        data: {
            "feeData": data
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('.newLoader').show();
        },
        success: function (data) {
            if (data['url']) {
                window.location.href = data['url'];
            } else {
                $('.newLoader').hide();
                var error = 'Something went wrong!';
                if (data['error']) {
                    error = data['error'];
                }
                alertPopup(error, 'error');
            }
        },
        complete: function () {
            //$('.newLoader').hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
});

var arrayClean = function(thisArray, thisName) {
    "use strict";
    $.each(thisArray, function(index, item) {
        if (item.name == thisName) {
            delete thisArray[index];      
        }
    });
}
if ($('.custom_function').length > 0) { 
    jQuery('.custom_function').click(function(){
        var kalviformid = $("#kalviformid").val();
        jQuery.ajax({
            url: jsVars.FULL_URL+'/kalviSSO',
            type: 'post',
            dataType: 'json',
            async: false,
            data: {'kalviformid':kalviformid},
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            success: function (json) {
                if (json['redirect']) {
                    window.location.href = json['redirect'];
                } else if (json['error']) {
                    alertPopup(json['error'], 'error');
                } else if (typeof json['success'] !== 'undefined' && json['success'] === 200) {
                    window.open(json['url'], '_self');
    
                }
            },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
        });
    });
} 

//resbumitlogicopen
if ($('.resbumitlogicopen').length > 0) {
    $('.resbumitlogicopen').each(function () {
        let idVar = this.id;
        let formId = idVar.split('_');
        if(typeof formId[1]!='undefined') {
            //
            jQuery.ajax({
                url: jsVars.FULL_URL+'/post-resubmision-open',
                type: 'post',
                dataType: 'json',
                async: false,
                data: {'fisd':formId[1]},
                headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                success: function (json) {
                    if (json['redirect']) {
                        window.location.href = json['redirect'];
                    } else if (json['error']) {
                        alertPopup(json['error'], 'error');
                    } else if (typeof json['status'] !== 'undefined' && json['status'] === 1) {
                        $("#resbumitlogicopen_"+formId[1]).html(json['data']);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        }
    });
}