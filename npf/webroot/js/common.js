/* 
 * Common javascript function .
 */
$(function () {
    //College Home Page View Banner Script
    if ($('#myCarousel').length > 0)
    {
        jQuery('.carousel').carousel({
            interval: 5000 //changes the speed
        })
    }
    
    //restrict special character for input
    if ($('#Email,#email').length > 0)
    {
        $('#Email,#email').keyup(function ()
        {
            var yourInput = $(this).val();
            re = /[`~!#$%^&*()|+\=?;:'",<>\{\}\[\]\\\/]/gi;
            var isSplChar = re.test(yourInput);
            if (isSplChar)
            {
                var no_spl_char = yourInput.replace(/[`~!#$%^&*()|+\=?;:'",<>\{\}\[\]\\\/]/gi, '');
                $(this).val(no_spl_char);
            }
        });
    }
    
    // code to show initia message in iframe of batch pop up starts
    if(document.getElementById('modalIframe')){
        var doc = document.getElementById('modalIframe').contentWindow.document;
        doc.open();
        doc.write('<div style="text-align:center;"><h2>Please Wait...<h2></div>');
        doc.close();
    }
    // code to show initia message in iframe of batch pop up ends 
    
    //prevent dropdown close of aacount manager
    if($(".headerDropDown").length>0){
        $('.mobAbsDrop').bind('click', function (e) { e.stopPropagation() })
    }
    formDetailBtnClk();
});


if(typeof jsVars.VerifyStudentEmail !== 'undefined' && jsVars.VerifyStudentEmail == 'verifyEmail'){
    dataLayer.push({'event':'emailverify'});
    delete jsVars.VerifyStudentEmail;                //unset VerifyStudentEmail
}

//Report Js Start Here
if ($('#ReportFolderListingSection').length > 0)
{
    //LoadReportFolderListing();
    var Page = 0;    
    //on college change
    $(document).on('change','#college_id',function(){
        Page = 0;
        $('#LoadReportFolderListingStartPage').val(Page);
    });
}

if ($('#CreateReportFolderSection').length > 0)
{    
    $(document).ready(function(){
        if($('#CollegeIdInput').val())
        {
            LoadCollegeAssociatedUserList();
        }
    });
    
    $('#UserAccessInput').on('focus',function(){
        $('ul.autosuggest').show();
    });
         
        
    $('#UserAccessInput').on('keyup',function(){
        var CollegeId = $('#CollegeIdInput').val();
        if(CollegeId)
        {
            LoadCollegeAssociatedUserList();
            
        }    
        
        
        else if(CollegeId == '')
        {
            alertPopup('Please select a college.', "error");
        }
    });
    
    $(document).on('change','#CollegeIdInput',function(){         
        if($('#UserListSection').val())
        {
            $('#ConfirmAlertPopUpButton').trigger('click');
        }
        else if(this.value)
        {
            $('#OldSelectedCollegeId').val(this.value);
            LoadCollegeAssociatedUserList();
        }
    });
    
    //If Press confirm alert yes btn
    $(document).on('click','#ConfirmAlertYesBtn', function(){ 
        $('#OldSelectedCollegeId').val($('#CollegeIdInput').val());
        if($('#CollegeIdInput').val())
        {
            LoadCollegeAssociatedUserList();
        }
        else
        {
            $('#UserListSection').html('');    
            $('#UserListSection').trigger('chosen:updated');
        }
    });
    
    //If Press confirm alert no btn
    $(document).on('click','#ConfirmAlertNoBtn', function(){ 
        var OldSelectedCollegeId = $('#OldSelectedCollegeId').val();
        $('#CollegeIdInput').val(OldSelectedCollegeId);
        $('#CollegeIdInput').trigger('chosen:updated');
    });
}

//Redis Cache Key Js Start Here
if ($('#RedisCacheKeyManager').length > 0)
{
    //alert
    if(jsVars.error)
    {
        alertPopup(jsVars.error, "error");
    }
    else if(jsVars.success)
    {
        alertPopup('<i class="fa fa-thumbs-up"></i>&nbsp; '+ jsVars.success, "success");
    }
}

if ($('#DeleteKeysForm').length > 0){
    $(document).on('click','#CheckAll',function(){ 
        if($('#CheckAll').is(':checked'))
        {
            $('#KeysContainer input:checkbox').each(function() {
                $(this).prop('checked',true);
                //console.log($(this).attr('id'));
            });
        }
        else
        {
            $('#KeysContainer input:checkbox').each(function() {
                $(this).prop('checked',false);
            });
        }
    });   
}

//Dedicated Account Manager Js Start Here
if ($('#AccountManagerForm').length > 0){
    var DefaultSelectedCollege = $('#AccountManagerCollegeId').val();
    if(DefaultSelectedCollege)
    {
        ChangeAccountManagerUser(DefaultSelectedCollege);
    }
    //Account Manager Admin
    function ChangeAccountManagerUser(CollegeId)
    {
        if(CollegeId)
        {
            var UserNameList = {};
            var PreSelectedUser = 0;
            $.ajax({
                url: jsVars.GetCollegeAssociatedUsersListUrl,
                type: 'post',
                data: {college_id: CollegeId},
                dataType: 'json',
                headers: {
                    "X-CSRF-Token": jsVars._csrfToken
                },                
                success: function (json) {

                    if (json['redirect'])
                    {
                        location = json['redirect'];
                    }
                    else if (json['error'])
                    {
                        alertPopup(json['error'], 'error');
                    }
                    else if (json['success'] == 200)
                    {
                        var AccountUserList = json['AccountUserList'];
                        var AccountUserHtml = '<option selected="selected" value="">Select Account Manager</option>';
                        for(var UserId in AccountUserList)
                        {
                            UserNameList[UserId] = AccountUserList[UserId]['Name'];
                            if(AccountUserList[UserId]['selected'] == 1)
                            {
                                PreSelectedUser = UserId;
                                AccountUserHtml += '<option value="'+  UserId +'" selected>'+ AccountUserList[UserId]['Name'] +'</option>';
                            }
                            else
                            {
                                AccountUserHtml += '<option value="'+  UserId +'">'+ AccountUserList[UserId]['Name'] +'</option>';
                            }
                        }
                        $('#AccountUserArea #UserNameList').val(JSON.stringify(UserNameList));
                        $('#AccountUserArea #OldSelectedUser').val(PreSelectedUser);
                        $('#AccountUserArea #AccountManagerId').html(AccountUserHtml);
                        $("#AccountManagerId").trigger("chosen:updated");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        }
    }
    
    function GetAccountUserName(SelectedUserId)
    {
        var UserNameList = JSON.parse($('#AccountUserArea #UserNameList').val());
        for(var UserId in UserNameList)
        {
            if(UserId == SelectedUserId)
            {
                return UserNameList[UserId];
            }
        }
    }
    
    function ResetAccountManagerForm()
    {
        var PreSelectedUser = $('#AccountUserArea #OldSelectedUser').val();
        var CurrentCollegeId = $('#AccountManagerCollegeId').val();
        var CurrentUser = $('#AccountManagerId').val();
        if(PreSelectedUser != 0 && (PreSelectedUser != CurrentUser))
        {
            $('#AccountManagerId').val(PreSelectedUser);
            $("#AccountManagerId").trigger("chosen:updated");
        }
    }
    
    function CheckAccountManagerForm()
    {
        var PreSelectedUser = $('#OldSelectedUser').val();
        var CurrentCollegeId = $('#AccountManagerCollegeId').val();
        var CurrentUser = $('#AccountManagerId').val();
        if(CurrentUser && (PreSelectedUser == 0))
        {
            SubmitAccountManagerForm();
        }
        else if(CurrentUser && (PreSelectedUser != 0) && (PreSelectedUser == CurrentUser))
        {
            alertPopup('There is no changes.', "error");
        }
        else if(CurrentUser && (PreSelectedUser != 0) && (PreSelectedUser != CurrentUser))
        {
            var OldUserName = GetAccountUserName(PreSelectedUser);
            var NewUserName = GetAccountUserName(CurrentUser);
            $('#DisableEnableFormPopUpTextArea').text('');
            $('#DisableEnableFormPopUpTextArea').html('Do you want to change account manager from <br/>'+OldUserName+' to '+NewUserName);
            $('#ChangeStatusBtn').trigger('click');
        }
        else
        {
            if(PreSelectedUser != 0)
            { 
                var OldUserName = GetAccountUserName(PreSelectedUser);
                $('#DisableEnableFormPopUpTextArea').text('');
                $('#DisableEnableFormPopUpTextArea').html('Do you want to remove account manager <br/>'+OldUserName);
                $('#ChangeStatusBtn').trigger('click');
            }
            else if(CurrentCollegeId == '')
            {
                alertPopup('Please select an institute.', "error");
            }
            else if(PreSelectedUser == 0)
            { 
                alertPopup('There is no changes.', "error");
            }
            else
            {
                SubmitAccountManagerForm();
            }
        }
    }
        
    function SubmitAccountManagerForm()
    {
        $('#AccountManagerForm').submit();
    }
    
    //error pop ups
    if(jsVars.error)
    {
        alertPopup(jsVars.error, "error");
    }
    else if(jsVars.success)
    {
        alertPopup('<i class="fa fa-thumbs-up"></i>&nbsp; '+ jsVars.success, "success");
    }
}
//Reset  Form fields
function ResetForm(Form)
{
    $('#' + Form + ' input[name^=\'Filter\'],#' + Form + ' select[name^=\'Filter\']').val('');
}

//Allow only Aphabet and space
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

function removeFile(Obj, prevElement, FileId)
{
    if (FileId)
    {
        $.ajax({
            url: jsVars.FileRemoveLink,
            type: 'post',
            data: {id: FileId},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('body div.loader-block').show();
            },
            complete: function () {
                $('body div.loader-block').hide();
            },
            success: function (json) {

                if (json['redirect'])
                {
                    location = json['redirect'];
                }
                else if (json['error'])
                {
                    alertPopup(json['error'], 'error');
                }
                else if (json['success'] == 200)
                {
                    $('#SuccessPopupArea p#MsgBody').text('File removed.');
                    $('a#SuccessLink').trigger('click');
                    var parentDiv = $(Obj).parent("div#RemoveBtnParentDiv");
					$(parentDiv).find(".fileBrowseCustom ").removeClass('notEmpty');
					$(parentDiv).find(".input-group").css('display', 'table');
                    $(parentDiv).find(".input_file").css('display', 'block');
                    $(parentDiv).find("input").prop('disabled', false);
                    $(Obj).remove();
                    $(parentDiv).find(prevElement).remove();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('body div.loader-block').hide();
            }
        });
    }
    else
    {

    }
}

//if captcha stoken/response is expired
var callback = function () {
    grecaptcha.render('captcha', {
        'sitekey': '6Lf2GBgTAAAAAO4T0VMrEuhql7nn3gybLr8H5Lhw',
        'expired-callback': expCallback
    });
};
var expCallback = function () {
    grecaptcha.reset();                                 //to reset google recatcha
//      var recaptchaframe = $('#captcha iframe');
//        var recaptchaSoure = recaptchaframe[0].src;
//        recaptchaframe[0].src = '';
//        setInterval(function () { recaptchaframe[0].src = recaptchaSoure; }, 500);      
};

//Application Manager Filter Form
if ($('#demand-draft #DDDate, #demand-draft #DDRecievedDate,#FilterInstituteForm #start_date, #FilterInstituteForm #end_date').length > 0) {
    $('#demand-draft #DDDate, #demand-draft #DDRecievedDate,#FilterInstituteForm #start_date, #FilterInstituteForm #end_date').datepicker({startView: 'month', format: 'd M yyyy', enableYearToMonth: true, enableMonthToDay: true})/*.on('changeDate', function () {})*/;
}
//college manage form filter area


$(function () {
    //manage Form
    if ($('#FilterForm #search').length > 0) {
        $('#FilterForm #search').typeahead({
            hint: true,
            highlight: true,
            minLength: 1
            , source: function (request, response) {
                var search = $('#FilterForm #search').val();
                if (search)
                {
                    $.ajax({
                        url: jsVars.SearchFormUrl,
                        data: {search: search, area: 'form'},
                        dataType: "json",
                        type: "POST",
                        headers: {
                            "X-CSRF-Token": jsVars._csrfToken
                        },
                        //contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            items = [];
                            map = {};
                            $.each(data.listforms, function (i, item) {

                                var id = i;
                                var name = item;
                                map[name] = {id: id, name: name};
                                items.push(name);
                            });
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
            //        updater: function (item) {
            //            $('#FilterForm #search').val(map[item].id);
            //            return item;
            //        }
        });
    }

    //manage Application
    if ($('#FilterApplicationForm #search').length > 0) {
        //Manage Application Search Field
//        $('#FilterApplicationForm #search').typeahead({
//            hint: true,
//            highlight: true,
//            minLength: 1
//            , source: function (request, response) {
//                var search = $('#FilterApplicationForm #search').val();
//                if (search)
//                {
//                    $.ajax({
//                        url: jsVars.ApplicationSearchUrl,
//                        data: {search: search, area: 'application'},
//                        dataType: "json",
//                        type: "POST",
//                        headers: {
//                            "X-CSRF-Token": jsVars._csrfToken
//                        },
//                        //contentType: "application/json; charset=utf-8",
//                        success: function (data) {
//                            items = [];
//                            map = {};
//                            $.each(data.listApplication, function (i, item) {
//                                var name = item;
//                                map[name] = {name: name};
//                                items.push(name);
//                            });
//                            response(items);
//                            $(".dropdown-menu").css("height", "auto");
//                        },
//                        error: function (response) {
//                            alertPopup(response.responseText);
//                        },
//                        failure: function (response) {
//                            alertPopup(response.responseText);
//                        }
//                    });
//                }
//            },
//            //        updater: function (item) {
//            //            $('#FilterForm #search').val(map[item].id);
//            //            return item;
//            //        }
//        });

    }

    //manage Institute
    if ($('#FilterInstituteFormSearch #search').length > 0) {
        //Manage Application Search Field
        $('#FilterInstituteFormSearch #search').typeahead({
            hint: true,
            highlight: true,
            minLength: 1
            , source: function (request, response) {
                var search = $('#FilterInstituteFormSearch #search').val();
                if (search)
                {
                    $.ajax({
                        url: jsVars.SerachCollegeUrl,
                        data: {search: search, area: 'institute'},
                        dataType: "json",
                        type: "POST",
                        headers: {
                            "X-CSRF-Token": jsVars._csrfToken
                        },
                        //contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            items = [];
                            map = {};
                            $.each(data.listInstitute, function (i, item) {
                                //console.log(j);console.log(item2.application_no);
                                var name = item;
                                map[name] = {name: name};
                                items.push(name);
                            });
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
            //        updater: function (item) {
            //            $('#FilterForm #search').val(map[item].id);
            //            return item;
            //        }
        });
    }
    
    //Manage Reports
    if ($('#FilterReportsForm #search_report').length > 0) {
        //Manage Application Search Field
        $('#FilterReportsForm #search_report').typeahead({
            hint: true,
            highlight: true,
            minLength: 1
            , source: function (request, response) {
                var search = $('#FilterReportsForm #search_report').val();
                if (search)
                {
                    $.ajax({
                        url: jsVars.SerachReportUrl,
                        data: {search: search, area: 'report'},
                        dataType: "json",
                        type: "POST",
                        headers: {
                            "X-CSRF-Token": jsVars._csrfToken
                        },
                        //contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            items = [];
                            map = {};
                            $.each(data.listReports, function (i, item) {
                                //console.log(j);console.log(item2.application_no);
                                var name = item;
                                map[name] = {name: name};
                                items.push(name);
                            });
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
            //        updater: function (item) {
            //            $('#FilterForm #search').val(map[item].id);
            //            return item;
            //        }
        });
    }
});


$(document).on('click', '#FilterForm .dropdown-item', function () {
    //SumitFilterForm();
    //alert('form');
});

if ($('#FilterForm #start_date, #FilterForm #end_date').length > 0) {

    $('#FilterForm #start_date, #FilterForm #end_date').datepicker({startView: 'month', format: 'd M yyyy', enableYearToMonth: true, enableMonthToDay: true}).on('changeDate', function () {
        //SumitFilterForm();
    });

}
if (jsVars.ShowInstittueInManageForm == 'show')
{
    $(document).on('change', '#FilterForm #Institute', function () {
        //SumitFilterForm();
    });
}

if ($('#enable-form').length)
{
    $('#enable-form').jscroll({nextSelector: 'a.jscroll-next'});
}

//Enable Form Li is Clicked
$(document).on('click', '#EnableFormLi', function () {
    //$('#disable-form').jscroll.destroy();
    $('#FilterForm #CurrentTab').val('1');
    $("#disable-form  div.jscroll-inner").find('div.next').remove();
    if ($("#enable-form div.jscroll-inner").find('div.next').length == 0)
    {
        var NextPage = parseInt($('#FilterForm  #EnableFormNextPage').val(), 10);
        var EnableFormHtml = '<div class="next jscroll-next-parent" style="display: none;"><a href="' + jsVars.SITEURL + 'form/getMoreForms/?status=enable&page=' + NextPage + '" class="jscroll-next">next</a></div>';
        if ($("#enable-form div.jscroll-inner div.jscroll-added").length)
        {
            $("#enable-form div.jscroll-inner div.jscroll-added:last").append(EnableFormHtml);
        }
        else
        {
            $("#enable-form div.jscroll-inner").append(EnableFormHtml);
        }
    }
    $('#enable-form').jscroll({nextSelector: 'a.jscroll-next'});
});

//Disable Form Li is Clicked
$(document).on('click', '#DisableFormLi', function () {
    //$('#enable-form').jscroll.destroy();
    $('#FilterForm #CurrentTab').val('2');
    $("#enable-form div.jscroll-inner").find('div.next').remove();
    if ($("#disable-form  div.jscroll-inner").find('div.next').length == 0)
    {
        var NextPage = parseInt($('#FilterForm  #DisableFormNextPage').val(), 10);

        if ($("#disable-form  div.jscroll-inner").length)
        {
            var DisableFormHtml = '<div class="next jscroll-next-parent" style="display: none;"><a href="' + jsVars.SITEURL + 'form/getMoreForms/?status=disable&page=' + NextPage + '" class="jscroll-next">next</a></div>';
            $("#disable-form  div.jscroll-inner").append(DisableFormHtml);
        }
        else
        {
            var DisableFormHtml = '<div class="next" style="display: none;"><a href="' + jsVars.SITEURL + 'form/getMoreForms/?status=disable&page=' + NextPage + '" class="jscroll-next">next</a></div>';
            $("#disable-form").append(DisableFormHtml);
        }
    }
    $('#disable-form').jscroll({nextSelector: 'a.jscroll-next'});
});

function SumitFilterForm()
{
    $.ajax({
        url: jsVars.FilterUrl,
        type: 'post',
        data: $("form#FilterForm").serialize(),
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('div.loader-block').show();
        },
        complete: function () {
            $('div.loader-block').hide();
        },
        success: function (json) {

            if (json['redirect'])
            {
                location = json['redirect'];
            }
            else if (json['error'])
            {
                if (json['error'])
                {
                    alertPopup(json['error'], 'error');
                }
            }
            else if (json['success'] == 200)
            {
                var EnableFormHtml = '<div class="application-form-block"><div><div class="col-md-4"><p>There is no enable form.</p></div></div></div>';
                var DisableFormHtml = '<div class="application-form-block"><div><div class="col-md-4"><p>There is no disable form.</p></div></div></div>';
                for (var status in json['listforms'])
                {
                    if ((status == 'EnableForm') && json['listforms'][status].length)
                    {
                        EnableFormHtml = '';
                        for (var i in json['listforms'][status])
                        {
                            var erpButtonColor = 'graycolor';
                            var pushMaskData = 1;
                            if(json['listforms'][status][i]['push_mask_data']==1){
                                erpButtonColor = 'greencolor';
                                pushMaskData = 0;
                            }
                            EnableFormHtml += '<div class="application-form-block" id="' + json['listforms'][status][i]['id'] + '">';
                            EnableFormHtml += '<input type="hidden" id="college_id_' + json['listforms'][status][i]['id'] + '" value="'+ json['listforms'][status][i]['college_id']+'">';
                            EnableFormHtml += '<input type="hidden" id="auto_inc_id" value="'+ json['listforms'][status][i]['AutoIncreamentVal']+'"><div class="col-md-12">';
                            EnableFormHtml += '            <h3><a target="_blank" href="/form/preview/' + json['listforms'][status][i]['previewLink'] + '">' + json['listforms'][status][i]['name'] + '</a></h3>';
                            if(json['listforms'][status][i]['copied'] == 1) {
                            EnableFormHtml += '            <span title="COPIED" class="copy-icon"><span class="icon-copy"></span></span>';
                            }
                            EnableFormHtml += '            <span class="payment-recieve-message payment-message">' + json['listforms'][status][i]['amount_currency'] + '</span> ';
                            EnableFormHtml += '</div>';
                            EnableFormHtml += '<div class="col-md-2">';
                            EnableFormHtml += '            <div class="row"><div class="col-md-12">';
                            EnableFormHtml += '                <div class="font12"> <strong class="font500">Created On: </strong>' + json['listforms'][status][i]['created'] + '</div>';
                            EnableFormHtml += '                <div class="font12"><strong class="font500">Created By: </strong>' + json['listforms'][status][i]['created_by'] + '</div>';
                            EnableFormHtml += '            </div>';
                            EnableFormHtml += '        </div>';
                            EnableFormHtml += '        </div>';
                            EnableFormHtml += '        <div class="col-md-8">';

                            if (json['PermissionList']['editForm'] == true) {
                                EnableFormHtml += ' <a href="' + json['listforms'][status][i]['editLink'] + '" class="btn btn-default btn-info"><span class="fa fa-pencil-square-o padding-right-5"></span>Edit</a> ';
                            }

                            if (json['PermissionList']['copyForm'] == true) {
                                EnableFormHtml += '<a href="#" class="btn btn-default btn-info" onclick="return confirmCopyForm(\'' + json['listforms'][status][i]['copyHash'] + '\',' + json['listforms'][status][i]['id'] + ');" ><span class="icon-copy padding-right-5"></span>Copy</a> ';
                            }

                            if (json['PermissionList']['changeStatus'] == true) {
                                EnableFormHtml += ' <a href="javascript:void(0);" class="btn btn-default btn-info" onclick="ChangeFormStatus('+json['listforms'][status][i]['id']+',\''+json['listforms'][status][i]['name']+'\',\'disabled\')"><span class="fa fa-circle greencolor padding-right-5"></span>Disable</a>';
                            }

                            if (json['PermissionList']['embededCode'] == true) {
                                EnableFormHtml += '<a href="javascript:void(0);"  id="ShowEmbededCode" class="btn btn-default btn-info"  data-toggle="modal" data-target="#embed"><span class="icon-embded padding-right-5"></span>Embed</a>';
                            }
                            
                            if (json['PermissionList']['formConfig'] == true) {
                                EnableFormHtml += '<a href="/form/configuration/' + json['listforms'][status][i]['emailConfigHash'] + '" class="btn btn-default btn-info"><span class="icon-embded padding-right-5"></span>Configuration</a>';
                            }
                            if (typeof json['listforms'][status][i]['form_table_name'] != 'undefined' && json['listforms'][status][i]['form_table_name'] != null) {
                                if (json['PermissionList']['getFormKeys'] == true) {
                                    EnableFormHtml += '<a href="javascript:void(0);" class="btn btn-default btn-info" onClick="return displayMachinekeyBox('+json['listforms'][status][i]['id']+');" ><span class="fa fa-key padding-right-5"></span>Machine Key</a>';
                                }
                                
                                if (json['PermissionList']['printApplicationMapping'] == true) {
                                
                                    EnableFormHtml += '<a href="'+ jsVars.getFormPrintURL+'/' + json['listforms'][status][i]['copyHash']+'" class="btn btn-default btn-info" ><span class="fa fa-file-o padding-right-5"></span> Print Mapping</a>';
                                
                                }
                            }
                            //purge data link
                            if (json['PermissionList']['purgeCollegeData'] == true) {
                                EnableFormHtml +='<a href="javascript:void(0)" onClick="return canCreateNewPurgeRequest(\'form-level-purge\',\''+json['listforms'][status][i]['purgeDataHash']+'\')" class="btn btn-default btn-info" ><span class="fa fa-file-o padding-right-5"></span> Purge Data</a>';
                            }
                            if (json['PermissionList']['erpPushPermission'] == true) {
                                EnableFormHtml +='<a href="javascript:void(0);" data-erpcheck="'+pushMaskData+'" onclick="return setConfigPushErp('+json['listforms'][status][i]['id']+',\''+json['listforms'][status][i]['name']+'\',this);" class="btn btn-default btn-info formid'+json['listforms'][status][i]['id']+'" ><span class="fa fa-circle '+erpButtonColor+' padding-right-5"></span>Push Mask Data</a>';
                            }
                            EnableFormHtml += '</div>';
                            EnableFormHtml += '<div class="col-md-2 text-right"><a href="' + json['listforms'][status][i]['viewApplicationLink'] + '" class="btn btn-default btn-appln">Application</a> </div>';
                            EnableFormHtml += '    </div>';
                        }
                        if (json['listforms']['EnableForm'].length == jsVars.ITEM_PER_PAGE)
                        {
                            EnableFormHtml += '<div class="next jscroll-next-parent" style="display: none;"><a href="' + jsVars.SITEURL + 'form/getMoreForms/?status=enable&page=2" class="jscroll-next">next</a></div>';
                        }
                    }
                    
                    if ((status == 'DisableForm') && json['listforms'][status].length)
                    {
                        DisableFormHtml = '';
                        for (var i in json['listforms'][status])
                        {
                            var erpButtonColor = 'graycolor';
                            var pushMaskData = 1;
                            if(json['listforms'][status][i]['push_mask_data']==1){
                                erpButtonColor = 'greencolor';
                                pushMaskData = 0;
                            }
                            
                            DisableFormHtml += '<div class="application-form-block" id="' + json['listforms'][status][i]['id'] + '">';
                            DisableFormHtml += '<input type="hidden" id="college_id_' + json['listforms'][status][i]['id'] + '" value="'+ json['listforms'][status][i]['college_id']+'">';
                            DisableFormHtml += '<input type="hidden" id="auto_inc_id" value="'+ json['listforms'][status][i]['AutoIncreamentVal']+'"><div class="col-md-12">';
                            DisableFormHtml += '            <h3><a target="_blank" href="/form/preview/' + json['listforms'][status][i]['previewLink'] + '">' + json['listforms'][status][i]['name'] + '</a></h3>';
                            if(json['listforms'][status][i]['copied'] == 1) {
                            DisableFormHtml += '            <span title="COPIED" class="copy-icon"><span class="icon-copy"></span></span>';
                            }
                            DisableFormHtml += '            <span class="payment-recieve-message payment-message">' + json['listforms'][status][i]['amount_currency'] + '</span> ';
                            DisableFormHtml += '</div>';
                            DisableFormHtml += '<div class="col-md-3">';
                            DisableFormHtml += '            <div class="row"><div class="col-md-12">';
                            DisableFormHtml += '                <div class="font12"> <strong class="font500">Created On: </strong>' + json['listforms'][status][i]['created'] + '</div>';
                            DisableFormHtml += '                <div class="font12"><strong class="font500">Created By: </strong>' + json['listforms'][status][i]['created_by'] + '</div>';
                            DisableFormHtml += '            </div>';
                            DisableFormHtml += '        </div>';
                            DisableFormHtml += '        </div>';
                            DisableFormHtml += '        <div class="col-md-7">';

                            if (json['PermissionList']['editForm'] == true) {
                                DisableFormHtml += ' <a href="' + json['listforms'][status][i]['editLink'] + '" class="btn btn-default btn-info"><span class="fa fa-pencil-square-o padding-right-5"></span>Edit</a> ';
                            }

                            if (json['PermissionList']['copyForm'] == true) {
                                DisableFormHtml += '<a href="#" class="btn btn-default btn-info" onclick="return confirmCopyForm(\'' + json['listforms'][status][i]['copyHash'] + '\',' + json['listforms'][status][i]['id'] + ');" ><span class="icon-copy padding-right-5"></span>Copy</a> ';
                            }

                            if (json['PermissionList']['changeStatus'] == true) {
                                DisableFormHtml += ' <a href="javascript:void(0);" id="FormChangeStatus" class="btn btn-default btn-info" data-toggle="modal" data-target="#change-status2"><span class="fa fa-circle graycolor padding-right-5"></span>Enable</a>';
                            }
                            /*
                            if (json['PermissionList']['embededCode'] == true) {
                                DisableFormHtml += '<a href="javascript:void(0);"  id="ShowEmbededCode" class="btn btn-default btn-info"  data-toggle="modal" data-target="#embed"><span class="icon-embded padding-right-5"></span>Embed</a>';
                            } */
                            if (typeof json['listforms'][status][i]['form_table_name'] != 'undefined' && json['listforms'][status][i]['form_table_name'] != null) {
                                if (json['PermissionList']['getFormKeys'] == true) {
                                    DisableFormHtml += '<a href="javascript:void(0);" class="btn btn-default btn-info" onClick="return displayMachinekeyBox('+json['listforms'][status][i]['id']+');" ><span class="fa fa-key padding-right-5"></span>Machine Key</a>';
                                }
                                
                                if (json['PermissionList']['printApplicationMapping'] == true) {
                                
                                    DisableFormHtml += '<a href="'+ jsVars.getFormPrintURL+'/' + json['listforms'][status][i]['copyHash']+'" class="btn btn-default btn-info" ><span class="fa fa-file-o padding-right-5"></span> Print Mapping</a>';
                                
                                }
                            }
                            //purge data
                            if (json['PermissionList']['purgeCollegeData'] == true) {
                                DisableFormHtml +='<a href="javascript:void(0)" onClick="return canCreateNewPurgeRequest(\'form-level-purge\',\''+json['listforms'][status][i]['purgeDataHash']+'\')" class="btn btn-default btn-info" ><span class="fa fa-file-o padding-right-5"></span> Purge Data</a>';
                            }
                            if (json['PermissionList']['erpPushPermission'] == true) {
                                DisableFormHtml +='<a href="javascript:void(0);" data-erpcheck="'+pushMaskData+'" onclick="return setConfigPushErp('+json['listforms'][status][i]['id']+',\''+json['listforms'][status][i]['name']+'\',this);" class="btn btn-default btn-info formid'+json['listforms'][status][i]['id']+'" ><span class="fa fa-circle '+erpButtonColor+' padding-right-5"></span>Push Mask Data</a>';
                            }
                            DisableFormHtml += '</div>';
                            //DisableFormHtml += '<div class="col-md-2 text-right"><a href="' + json['listforms'][status][i]['viewApplicationLink'] + '" class="btn btn-default btn-appln">Application</a> </div>';
                            DisableFormHtml += '    </div>';
                        }
                        if (json['listforms']['DisableForm'].length == jsVars.ITEM_PER_PAGE)
                        {
                            DisableFormHtml += '<div class="next jscroll-next-parent" style="display: none;"><a href="' + jsVars.SITEURL + 'form/getMoreForms/?status=disable&page=2" class="jscroll-next">next</a></div>';
                        }
                    }
                }
                
                //change download csv href
                if($('#DownloadCSVButton').length > 0)
                {
                    $('#DownloadCSVButton').attr('href',json['DownloadCSVLink']);
                }
                
                //Set Count
                $('#CountTotalForms').text(json['CountTotal']);
                
                //Reset Next page fields
                $('#FilterForm  #EnableFormNextPage').val(2);
                $('#FilterForm  #DisableFormNextPage').val(2);
                
                if($("#enable-form div.jscroll-inner").length > 0)
                {
                    $("#enable-form div.jscroll-inner").html(EnableFormHtml);
                }
                else
                {
                    $("#enable-form").html(EnableFormHtml);
                }
                
                if($("#disable-form div.jscroll-inner").length > 0)
                {
                    $("#disable-form div.jscroll-inner").html(DisableFormHtml);
                }
                else
                {
                    $("#disable-form").html(DisableFormHtml);
                }

                if (json['listforms']['EnableForm'].length && !json['listforms']['DisableForm'].length)
                {
                        $('#EnableFormLi > a').trigger('click');
                }
                else if (!json['listforms']['EnableForm'].length && json['listforms']['DisableForm'].length)
                {
                        $('#DisableFormLi > a').trigger('click');
                }
                else
                {
                    if (!$('#EnableFormLi').hasClass('active'))
                    {
                        $('#DisableFormLi > a').trigger('click');
                    }
                    else if (!$('#DisableFormLi').hasClass('active'))
                    {
                        $('#EnableFormLi > a').trigger('click');
                    }
                }
                //$('#enable-form,#disable-form').jscroll({nextSelector: 'a.jscroll-next'});    
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
        }
    });

    return false;
}

//Manage Institute: Change Institute Status
$(document).on('click', '#InstituteChangeStatus', function (e) {
    e.preventDefault();
    var MainParentDiv = $(this).parents("div.application-form-block");
    var InstituteId = $(MainParentDiv).prop('id');
    var InstituteStatus = $(MainParentDiv).find("span#InstituteStatusSpan").attr('alt');
    ChangeInstituteStatus(InstituteId, InstituteStatus);   
    
});

//Manage Institute: Change Institute Status as delete
$(document).on('click', '#InstituteChangeStatusDelete', function (e) {
    e.preventDefault();
    var MainParentDiv = $(this).parents("div.application-form-block");
    var InstituteId = $(MainParentDiv).prop('id');
    if (InstituteId > 0)
    {
        var InstituteName = $(MainParentDiv).find("h3").text();
        var InstituteStatus = $(MainParentDiv).find("span#InstituteStatusSpan").attr('alt');
        var PopUpStatus = (InstituteStatus == 'Active') ? 'disable' : 'activate';
        var PopUpStatusSuccess = (InstituteStatus == 'Active') ? 'disabled' : 'activated';
        $("#ChangeStatusArea p#DisableEnableFormPopUpTextArea").text('Are you sure? You want to delete Institute \'' + InstituteName + '\'.');
        $('#ChangeStatusSuccessArea p#ConfirmDisableEnableFormPopUpTextArea').text('Institute \'' + InstituteName + '\' has been deleted.');
        $("#ChangeStatusArea button#ChangeStatusBtn").attr("onclick", 'ChangeInstituteStatusDelete(\'' + InstituteId + '\',\'' + InstituteStatus + '\');');
    }
    else
    {
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
});

//change college status
function ChangeInstituteStatus(InstituteId, CurrentStatus)
{
    if (InstituteId > 0)
    {
        $.ajax({
            url: jsVars.ChangeCollegeStatusUrl,
            type: 'post',
            data: {InstituteId: InstituteId, action: 'ChangeStatus', CurrentStatus: CurrentStatus},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('.InstituteChangeStatus-' + InstituteId).text('Wait..');
            },
            complete: function () {
                $('div.loader-block').hide();
            },
            success: function (json) {

                if (json['redirect'])
                {
                    location = json['redirect'];
                }
                else if (json['error'])
                {
                    alertPopup(json['error'], 'error');
                }
                else if (json['success'] == 200)
                {
                    if (json['changes'])
                    {                        
                        $('div#' + InstituteId).find("span#InstituteStatusSpan").attr('alt',json['changes']['status']);
                        $('div#' + InstituteId).find("span#InstituteStatusSpan").text(json['changes']['statusFlagText']);
                        $('div#' + InstituteId).find("span#InstituteStatusSpan").removeClass(json['changes']['removeClass']);
                        $('div#' + InstituteId).find("span#InstituteStatusSpan").addClass(json['changes']['statusClass']); 
                        $('div#' + InstituteId).find("a#InstituteChangeStatus").html('<span class="fa fa-circle '+json['changes']['statusColor']+' padding-right-5"></span>' +json['changes']['statusChangeText']);                        
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
    else
    {
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
}

//change college status deleted
function ChangeInstituteStatusDelete(InstituteId, CurrentStatus)
{
    if (InstituteId > 0)
    {
        $.ajax({
            url: jsVars.ChangeCollegeStatusUrl,
            type: 'post',
            data: {InstituteId: InstituteId, action: 'delete', CurrentStatus: CurrentStatus},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $(".npf-close").trigger('click');
                $('div.loader-block').show();
            },
            complete: function () {
                $('div.loader-block').hide();
            },
            success: function (json) {

                if (json['redirect'])
                {
                    location = json['redirect'];
                }
                else if (json['error'])
                {
                    alertPopup(json['error'], 'error');
                }
                else if (json['success'] == 200)
                {
                    if (json['changes'])
                    {
                        $('div#' + InstituteId).find("span#InstituteStatusSpan").text(json['changes']['status']);
                        $('div#' + InstituteId).find("span#InstituteStatusSpan").removeClass(json['changes']['removeClass']);
                        $('div#' + InstituteId).find("span#InstituteStatusSpan").addClass(json['changes']['statusClass']);
                        $("#ChangeStatusSuccess").trigger('click');
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
    else
    {
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
}

//Manage Form: Change Form Status
$(document).on('click', '#FormChangeStatus', function (e) {
    e.preventDefault();
    var MainParentDiv = $(this).parents("div.application-form-block");
    var FormId = $(MainParentDiv).prop('id');
    var FormName = $(MainParentDiv).find("h3").text();
    if (FormId > 0)
    {
	
	$.ajax({
            url: jsVars.getFormDetailCount,
            type: 'post',
            data: {formID: FormId},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                //$(".npf-close").trigger('click');
                $('div.loader-block').show();
            },
            complete: function () {
                $('div.loader-block').hide();
            },
            success: function (json) {

                if (json['redirect'])
                {
                    location = json['redirect'];
                }
                else if (json['error'])
                {
                    alertPopup(json['error'], 'error');
                }
                else if (json['success'] == 200)
                {
		    var LiStatus = $("#nav-tabs li.active").prop('title');
		    var PopUpStatus = (LiStatus == 'enable') ? 'disable' : 'enable';
		    var PopUpConfirmStatus = (LiStatus == 'enable') ? 'disabled' : 'enabled';
		    $("#change-status2 button#ChangeStatusBtn").attr("onclick", 'ChangeFormStatus(\'' + FormId + '\',\'' + FormName + '\',\'' + PopUpConfirmStatus + '\');');
			
		    if(json['count'] <= 0){
			$("#change-status2 p#DisableEnableFormPopUpTextArea").text('Do you want to ' + PopUpStatus + ' the form \'' + FormName + '\' ?');
			//If form status is changed from disable to enabled then display below text box
			if(PopUpStatus=='enable'){            
			    $("#change-status2 p#DisableEnableFormPopUpTextArea").append('<br />Auto Increament Start No: <input type="text" name="auto_in_id" id="auto_in_id" value="'+$.trim($(MainParentDiv).find('#auto_inc_id').val())+'" />');
			}       	
		    }else{
			$("#change-status2 p#DisableEnableFormPopUpTextArea").text('Do you want to enable the \'' + FormName + '\' ?');
			$("#change-status2 p#DisableEnableFormPopUpTextArea").append('<br />If you want to restart the Increment No, purge already present applications.');
		    } 
		    $("#change-status2").modal('show');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });    
    }
    else
    {
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
});

//Manage Form: show embed code
$(document).on('click', '#ShowEmbededCode', function (e) {
    e.preventDefault();
    var MainParentDiv = $(this).parents("div.application-form-block");
    var FormId = $(MainParentDiv).prop('id');
    if (FormId > 0)
    {
        $.ajax({
            url: jsVars.getFormEmbedDetailUrl,
            type: 'post',
            data: {formID: FormId},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                //$(".npf-close").trigger('click');
                $('div.loader-block').show();
            },
            complete: function () {
                $('div.loader-block').hide();
            },
            success: function (json) {

                if (json['redirect'])
                {
                    location = json['redirect'];
                }
                else if (json['error'])
                {
                    alertPopup(json['error'], 'error');
                }
                else if (json['success'] == 200)
                {
                    // on successfull
//                    $("#embed #EmbededHtmlLink").attr('href',json['embedLink']);
                    $("#embed #EmbededHtmlLink").val(json['embedLink']);
                    $("#full_url_campaign1").html(json['embedLink']);
                    $("#college_id_campaign1").html(json['college_id']);
                    
                    $("#embed #EmbededHtmlCode").html(json['embedHtml']);
                        if(typeof json['generate_slug'] =='undefined' ||  json['generate_slug']==1){
                            $("#embed .formhtmlurl").hide();
                            $("#embed #slugButton").html('');
                            $('<input>').attr({
                                type    : 'button',
                                name    : 'generate_slug',
                                value   : 'Generate Slug',
                                id      : 'generate_slug',
                                class : 'btn btn-default w-text npf-btn',
                                onClick : "return generateFormSlug("+json['form_id']+",'"+json['CollegeUrl']+"');"
                            }).appendTo('#slugButton');
                    }else{
                        $("#embed .formhtmlurl").show();
                        $("#embed #EmbededHtmlLinkForm").val(json['embedLinkForm']);
                        $("#embed #EmbededHtmlCodeForm").html(json['embedHtmlForm']);
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //$(".npf-close").trigger('click');
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();

            }
        });
    }
    else
    {
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
});

//submit form on enter key press
$(document).on('keypress', '#loginForm input, #forgotForm input, #contactForm input, #resendVlinkForm input', function (event) {
    if (event.which == 13) {
        event.preventDefault();
        $(this).parents("form").find("button").trigger('click').focus();
    }
});

function changeFormStatusAction(FormId, form_name,popup_confirm_status){
    if (FormId > 0){
        var data = $("form#FilterForm").serialize();
        if(typeof ($('#auto_in_id').val()) !== "undefined"){
           if($.trim($('#auto_in_id').val())!=''){ 
               if(!$.trim($('#auto_in_id').val()).match(/^\d+$/)){
                alert('Please enter only numeric value.');
                return;
                }
              data=data+'&auto_start_id=' + $.trim($('#auto_in_id').val());
            }
        }        
        $.ajax({
            url: jsVars.ChangeStatusUrl,
            type: 'post',
            data: data, //$("form#FilterForm").serialize(),
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $(".npf-close").trigger('click');
                $('div.loader-block').show();
            },
            complete: function () {
                $('div.loader-block').hide();
            },
            success: function (json) {

                if (json['redirect'])
                {
                    location = json['redirect'];
                }
                else if (json['error'])
                {
                    if (json['error'])
                    {
                        alertPopup(json['error'], 'error');
                    }
                }
                else if (json['success'] == 200)
                {
		    if(json['form_prefix'] && json['form_prefix'] != undefined){
			var successMessage = 'Form is enabled successfully.The Auto Increment Start No Obtained is '+json['form_prefix'];
		    }else{
			var successMessage = 'Form is enabled successfully.';
		    }
                    if (popup_confirm_status == 'disabled') {
                        successMessage = 'Form Disable Successfully';
                    }
                    alertPopup(successMessage, 'success');
                    
                    var auto_inc_msg='';
                    if(typeof (json['auto_inc_status']) !=='undefined'){ //
                        if(json['auto_inc_status']=='exist'){
                            auto_inc_msg='But you can\'t assign the new auto increament number. Because there are data in this form.';                                                        
                        }else if(json['auto_inc_status']=='not_exist'){
                            auto_inc_msg='But Table doesn\'t exist for this form.';                                                        
                        }
                    }
                    /*************** Code to always load enable and disable form from first page starts ********************/
                    var EnableFormHtml = '<div class="next jscroll-next-parent" style="display: none;"><a href="' + jsVars.SITEURL + 'form/getMoreForms/?status=enable&page=1" class="jscroll-next">next</a></div>';
                    var DisableFormHtml = '<div class="next jscroll-next-parent" style="display: none;"><a href="' + jsVars.SITEURL + 'form/getMoreForms/?status=disable&page=1" class="jscroll-next">next</a></div>';
                    $("#"+FormId).remove();
                    if ($('#EnableFormLi').hasClass('active'))
                    {
                        if($("#enable-form").find(".application-form-block").length==0){
                            var EmptyHtml = '<div class="application-form-block"><div><div class="col-md-4"><p>There is no enabled form.</p></div></div></div>';
                            $("#enable-form").html(EmptyHtml);
                        }
                        $("#disable-form").html(DisableFormHtml);
                        $("#DisableFormLi").one("click", function(){
                            $("#enable-form").html(EnableFormHtml);
                        });
                    }else{
                        if($("#disable-form").find(".application-form-block").length==0){
                            var EmptyHtml = '<div class="application-form-block"><div><div class="col-md-4"><p>There is no disabled form.</p></div></div></div>';
                            $("#disable-form").html(EmptyHtml);
                        }
                        $("#enable-form").html(EnableFormHtml);
                        $("#EnableFormLi").one("click", function(){
                            $("#disable-form").html(DisableFormHtml);
                        });
                    }
                    return; // code below this return statement not required with this block of code
                    /***************** Code to always load enable and disable form from first page ends ********************/
                    
                    
                    var EnableFormHtml = '<div class="application-form-block"><div><div class="col-md-4"><p>There is no enable form.</p></div></div></div>';
                    var DisableFormHtml = '<div class="application-form-block"><div><div class="col-md-4"><p>There is no disable form.</p></div></div></div>';
                    for (var status in json['listforms'])
                    {
                        if ((status == 'EnableForm') && json['listforms'][status].length)
                        {
                            $('#change-status p#ConfirmDisableEnableFormPopUpTextArea').text('Your Form \'' + form_name + '\' has been ' + popup_confirm_status + '. ' + auto_inc_msg);
                    
                            $("#ChangeStatusSuccess").trigger('click');
                            EnableFormHtml = '';
                            for (var i in json['listforms'][status])
                            {
                                var erpButtonColor = 'graycolor';
                                var pushMaskData = 1;
                                if(json['listforms'][status][i]['push_mask_data']==1){
                                    erpButtonColor = 'greencolor';
                                    pushMaskData = 0;
                                }
                                EnableFormHtml += '<div class="application-form-block" id="' + json['listforms'][status][i]['id'] + '">';
                                EnableFormHtml += '<input type="hidden" id="auto_inc_id" value="'+ json['listforms'][status][i]['AutoIncreamentVal']+'"><div class="col-md-12">';
                                EnableFormHtml += '            <h3><a target="_blank" href="/form/preview/' + json['listforms'][status][i]['previewLink'] + '">' + json['listforms'][status][i]['name'] + '</a></h3>';
                                EnableFormHtml += '            <span class="payment-recieve-message payment-message"><i class="fa fa-inr"></i>' + json['listforms'][status][i]['fee'] + '</span> ';
                                EnableFormHtml += '</div>';
                                    EnableFormHtml += '<div class="col-md-3">';
                                EnableFormHtml += '            <div class="row"><div class="col-md-12">';
                                EnableFormHtml += '                <div class="font12"> <strong class="font500">Created On: </strong>' + json['listforms'][status][i]['created'] + '</div>';
                                EnableFormHtml += '                <div class="font12"><strong class="font500">Created By: </strong>' + json['listforms'][status][i]['created_by'] + '</div>';
                                EnableFormHtml += '            </div>';
                                EnableFormHtml += '        </div>';
                                EnableFormHtml += '        </div>';
                                EnableFormHtml += '        <div class="col-md-7">';

                                if (json['PermissionList']['editForm'] == true) {
                                    EnableFormHtml += ' <a href="' + json['listforms'][status][i]['editLink'] + '" class="btn btn-default btn-info"><span class="fa fa-pencil-square-o padding-right-5"></span>Edit</a> ';
                                }

                                if (json['PermissionList']['copyForm'] == true) {
                                    EnableFormHtml += '<a href="#" class="btn btn-default btn-info" onclick="return confirmCopyForm(' + json['listforms'][status][i]['created_by'] + ',' + json['listforms'][status][i]['created_by'] + ');" ><span class="icon-copy padding-right-5"></span>Copy</a> ';
                                }

                                if (json['PermissionList']['changeStatus'] == true) {
                                    EnableFormHtml += ' <a href="javascript:void(0);" class="btn btn-default btn-info" onclick="ChangeFormStatus('+json['listforms'][status][i]['id']+',\''+json['listforms'][status][i]['name']+'\',\'disabled\')"><span class="fa fa-circle greencolor padding-right-5"></span>Disable</a>';
                                }

                                if (json['PermissionList']['embededCode'] == true) {
                                    EnableFormHtml += '<a href="javascript:void(0);"  id="ShowEmbededCode" class="btn btn-default btn-info"  data-toggle="modal" data-target="#embed"><span class="icon-embded padding-right-5"></span>Embed</a>';
                                }
                                if (json['PermissionList']['formConfig'] == true) {
                                EnableFormHtml += '<a href="/form/configuration/' + json['listforms'][status][i]['emailConfigHash'] + '" class="btn btn-default btn-info"><span class="icon-embded padding-right-5"></span>Configuration</a>';
                                 }

                                if (typeof json['listforms'][status][i]['form_table_name'] != 'undefined' && json['listforms'][status][i]['form_table_name'] != null) {
                                    if (json['PermissionList']['getFormKeys'] == true) {
                                        EnableFormHtml += '<a href="javascript:void(0);" class="btn btn-default btn-info" onClick="return displayMachinekeyBox('+json['listforms'][status][i]['id']+');" ><span class="fa fa-key padding-right-5"></span>Machine Key</a>';
                                    }
                                    
                                    if (json['PermissionList']['printApplicationMapping'] == true) {
                                
                                        EnableFormHtml += '<a href="'+ jsVars.getFormPrintURL+'/' + json['listforms'][status][i]['copyHash']+'" class="btn btn-default btn-info" ><span class="fa fa-file-o padding-right-5"></span> Print Mapping</a>';
                                
                                    }
                                }
                                
                                //purge data link
                                if (json['PermissionList']['purgeCollegeData'] == true) {
                                    EnableFormHtml +='<a href="javascript:void(0)" onClick="return canCreateNewPurgeRequest(\'form-level-purge\',\''+json['listforms'][status][i]['purgeDataHash']+'\')" class="btn btn-default btn-info" ><span class="fa fa-file-o padding-right-5"></span> Purge Data</a>';
                                }
                                
                                if (json['PermissionList']['erpPushPermission'] == true) {
                                    EnableFormHtml +='<a href="javascript:void(0);" data-erpcheck="'+pushMaskData+'" onclick="return setConfigPushErp('+json['listforms'][status][i]['id']+',\''+json['listforms'][status][i]['name']+'\',this);" class="btn btn-default btn-info formid'+json['listforms'][status][i]['id']+'" ><span class="fa fa-circle '+erpButtonColor+' padding-right-5"></span>Push Mask Data</a>';
                                }

                                EnableFormHtml += '</div>';
                                EnableFormHtml += '<div class="col-md-2 text-right"><a href="' + json['listforms'][status][i]['viewApplicationLink'] + '" class="btn btn-default btn-appln">Application</a> </div>';
                                EnableFormHtml += '    </div>';
                            }
                            if (json['listforms']['EnableForm'].length == jsVars.ITEM_PER_PAGE)
                            {
                                EnableFormHtml += '<div class="next jscroll-next-parent" style="display: none;"><a href="' + jsVars.SITEURL + 'form/getMoreForms/?status=enable&page=2" class="jscroll-next">next</a></div>';
                            }
                        }
                        else if ((status == 'DisableForm') && json['listforms'][status].length)
                        {
                            DisableFormHtml = '';
                            for (var i in json['listforms'][status])
                            {
                                var pushMaskData = 1;
                                if(json['listforms'][status][i]['push_mask_data']==1){
                                    erpButtonColor = 'greencolor';
                                    pushMaskData = 0;
                                }
                                DisableFormHtml += '<div class="application-form-block" id="' + json['listforms'][status][i]['id'] + '">';
                                DisableFormHtml += '<input type="hidden" id="auto_inc_id" value="'+ json['listforms'][status][i]['AutoIncreamentVal']+'"><div class="col-md-12">';
                                DisableFormHtml += '            <h3><a target="_blank" href="/form/preview/' + json['listforms'][status][i]['previewLink'] + '">' + json['listforms'][status][i]['name'] + '</a></h3>';
                                DisableFormHtml += '            <span class="payment-recieve-message payment-message"><i class="fa fa-inr"></i>' + json['listforms'][status][i]['fee'] + '</span> ';
                                DisableFormHtml += '</div>';
                                DisableFormHtml += '<div class="col-md-3">';
                                DisableFormHtml += '            <div class="row"><div class="col-md-12">';
                                DisableFormHtml += '                <div class="font12"> <strong class="font500">Created On: </strong>' + json['listforms'][status][i]['created'] + '</div>';
                                DisableFormHtml += '                <div class="font12"><strong class="font500">Created By: </strong>' + json['listforms'][status][i]['created_by'] + '</div>';
                                DisableFormHtml += '            </div>';
                                DisableFormHtml += '        </div>';
                                DisableFormHtml += '        </div>';
                                DisableFormHtml += '        <div class="col-md-7">';

                                if (json['PermissionList']['editForm'] == true) {
                                    DisableFormHtml += ' <a href="' + json['listforms'][status][i]['editLink'] + '" class="btn btn-default btn-info"><span class="fa fa-pencil-square-o padding-right-5"></span>Edit</a> ';
                                }

                                if (json['PermissionList']['copyForm'] == true) {
                                    DisableFormHtml += '<a href="#" class="btn btn-default btn-info" onclick="return confirmCopyForm(' + json['listforms'][status][i]['created_by'] + ',' + json['listforms'][status][i]['created_by'] + ');" ><span class="icon-copy padding-right-5"></span>Copy</a> ';
                                }

                                if (json['PermissionList']['changeStatus'] == true) {
                                    DisableFormHtml += ' <a href="javascript:void(0);" id="FormChangeStatus" class="btn btn-default btn-info" data-toggle="modal" data-target="#change-status2"><span class="fa fa-circle graycolor padding-right-5"></span>Enable</a>';
                                }
                                if (typeof json['listforms'][status][i]['form_table_name'] != 'undefined' && json['listforms'][status][i]['form_table_name'] != null) {
                                    if (json['PermissionList']['getFormKeys'] == true) {
                                        DisableFormHtml += '<a href="javascript:void(0);" class="btn btn-default btn-info" onClick="return displayMachinekeyBox('+json['listforms'][status][i]['id']+');" ><span class="fa fa-key padding-right-5"></span>Machine Key</a>';
                                    }
                                    
                                    if (json['PermissionList']['printApplicationMapping'] == true) {    
                                        DisableFormHtml += '<a href="'+ jsVars.getFormPrintURL+'/' + json['listforms'][status][i]['copyHash']+'" class="btn btn-default btn-info" ><span class="fa fa-file-o padding-right-5"></span> Print Mapping</a>';
                                    }                            
                                }
                                //purge data
                                if (json['PermissionList']['purgeCollegeData'] == true) {
                                    DisableFormHtml +='<a href="javascript:void(0)" onClick="return canCreateNewPurgeRequest(\'form-level-purge\',\''+json['listforms'][status][i]['purgeDataHash']+'\')" class="btn btn-default btn-info" ><span class="fa fa-file-o padding-right-5"></span> Purge Data</a>';
                                }
                                
                                if (json['PermissionList']['erpPushPermission'] == true) {
                                    DisableFormHtml +='<a href="javascript:void(0);" data-erpcheck="'+pushMaskData+'" onclick="return setConfigPushErp('+json['listforms'][status][i]['id']+',\''+json['listforms'][status][i]['name']+'\',this);" class="btn btn-default btn-info formid'+json['listforms'][status][i]['id']+'" ><span class="fa fa-circle '+erpButtonColor+' padding-right-5"></span>Push Mask Data</a>';
                                }
                                DisableFormHtml += '</div>';
                                DisableFormHtml += '<div class="col-md-2 text-right"><a href="' + json['listforms'][status][i]['viewApplicationLink'] + '" class="btn btn-default btn-appln">Application</a> </div>';
                                DisableFormHtml += '    </div>';
                            }
                            if (json['listforms']['DisableForm'].length == jsVars.ITEM_PER_PAGE)
                            {
                                DisableFormHtml += '<div class="next jscroll-next-parent" style="display: none;"><a href="' + jsVars.SITEURL + 'form/getMoreForms/?status=disable&page=2" class="jscroll-next">next</a></div>';
                            }                            
                        }
                    }
                    //Reset Next page fields
                    $('#FilterForm  #EnableFormNextPage').val(2);
                    $('#FilterForm  #DisableFormNextPage').val(2);

                    if($("#enable-form div.jscroll-inner").length > 0)
                    {
                        $("#enable-form div.jscroll-inner").html(EnableFormHtml);
                    }
                    else
                    {
                        $("#enable-form").html(EnableFormHtml);
                    }

                    if($("#disable-form div.jscroll-inner").length > 0)
                    {
                        $("#disable-form div.jscroll-inner").html(DisableFormHtml);
                    }
                    else
                    {
                        $("#disable-form").html(DisableFormHtml);
                    }

                    if (json['listforms']['EnableForm'].length && !json['listforms']['DisableForm'].length)
                    {
                        if (!$('#EnableFormLi').hasClass('active'))
                        {
                            $('#EnableFormLi > a').trigger('click');
                        }
                    }
                    else if (!json['listforms']['EnableForm'].length && json['listforms']['DisableForm'].length)
                    {
                        if (!$('#DisableFormLi').hasClass('active'))
                        {
                            $('#DisableFormLi > a').trigger('click');
                        }
                    }
                    else
                    {
                        if (!$('#EnableFormLi').hasClass('active'))
                        {
                            $('#DisableFormLi > a').trigger('click');
                        }
                        else if (!$('#DisableFormLi').hasClass('active'))
                        {
                            $('#EnableFormLi > a').trigger('click');
                        }
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
}

//enable/disable college form
function ChangeFormStatus(form_id, form_name,popup_confirm_status){
    var FormId = form_id;
    $("#FilterForm #FormId").val(FormId);
    
    if (FormId > 0){
        if(popup_confirm_status == 'disabled') {
            $("#confirmYes").removeAttr('onclick');
            $('#confirmTitle').html("Confirmation Required");
            $("#confirmYes").html('Confirm');
            $("#confirmYes").siblings('button').html('Cancel');
            $('#ConfirmMsgBody').html('Are you sure you want to Disable the form?');
            $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
                .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                e.preventDefault();
                changeFormStatusAction(FormId, form_name,popup_confirm_status);
            $('#ConfirmPopupArea').modal('hide');
            });
        } else {
            changeFormStatusAction(FormId, form_name,popup_confirm_status);
        }
    }
    else
    {
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
}

//disable cut/copy/paste
$('input[name=\'BankAccounts[id]\'], input[name=\'BankAccounts[account]\'],input[name=\'BankAccounts[confirm]\']').bind("cut copy paste", function (e) {
    e.preventDefault();
});

//Refresh captcha on click
$(document).on('click', '#CaptchaRefreshBtn', function () {
    var d = new Date();
    var n = d.getTime();
    $("#CaptchaImage").attr('src', jsVars.CaptchaLink + '?' + n);
});

//Contact form submit function
/*$(document).on('click', '#contactBtn', function () {
    $("span.help-block").text('');
    $.ajax({
        url: jsVars.ContactUrl,
        type: 'post',
        data: $("form#contactForm").serialize(),
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#contact-us-final div.loader-block').show();
        },
        complete: function () {
            $('#contact-us-final div.loader-block').hide();
        },
        success: function (json) {

            if (json['redirect'])
            {
                location = json['redirect'];
            }
            else if (json['error'])
            {
                if (json['error']['msg'])
                {
                    alertPopup(json['error']['msg'], 'error');
                }
                else if (json['error']['list'])
                {
                    for (var i in json['error']['list'])
                    {
                        var parentDiv = $("form#contactForm #" + i).parents('div.form-group');
                        //alert(parentDiv.html());
                        $(parentDiv).addClass('has-error');
                        $(parentDiv).find("span.help-block").text(json['error']['list'][i]);
                    }
                }
            }
            else if (json['success'] == 200)
            {
                $("span.help-block").text('');
                $("div.form-group").removeClass('has-error');
                $(".npf-close").trigger('click');
                $("#reset-link-sent .modal-title").text("Thank You");
                $("#reset-link-sent p#MsgBody").text(json['msg']);
                $("#SuccessLink").trigger('click');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#contact-us-final div.loader-block').hide();
        }
    });
});*/

// NPS
if (jsVars.feeAddMoreCount != '') {
    var feeAddMoreCount = jsVars.feeAddMoreCount;
}
else {
    var feeAddMoreCount = 0;
}

$(function () {
    $(document).ready(function () {
        if ($('#applicationDeadLineSelector').length > 0) {
            //$('#applicationDeadLineSelector').datepicker({startView: 'month', format: 'dd/mm/yyyy', enableYearToMonth: true, enableMonthToDay: true, pickTime: false});
            $('#applicationDeadLineSelector').datetimepicker({format: 'DD/MM/YYYY HH:mm',viewMode: 'years'});
            $('.datetimepicker').datetimepicker({format: 'DD/MM/YYYY HH:mm',viewMode: 'years'});
        }
        if ($('#couponExpiryDate').length > 0) {
            $('#couponExpiryDate').datetimepicker({format: 'DD/MM/YYYY',viewMode: 'years'});
        }

    });

    if (feeAddMoreCount > 0) {
        $('#addMoreAnchor').css('display', 'block');
        $('#conditionalFeeContainer').css('display', 'block');
    }
    else {
        $('#addMoreAnchor').css('display', 'none');
        $('#conditionalFeeContainer').css('display', 'none');
    }

    if ($('#payment-mode-dd').length > 0) {
        if ($('#payment-mode-dd:checkbox:checked').length > 0) {
            $('#ddDetailsArea, #ddAlias').css('display', 'block');
        }
        else {
            $('#ddDetailsArea, #ddAlias').css('display', 'none');
        }
    }
    
    //For Cash Details Area
    if ($('#payment-mode-cash').length > 0) {
        if ($('#payment-mode-cash:checkbox:checked').length > 0) {
            $('#cashDetailsArea, #cashAlias').css('display', 'block');
        }
        else {
            $('#cashDetailsArea, #cashAlias').css('display', 'none');
        }
    }
    
    //For voucher Details Area
    if ($('#payment-mode-voucher').length > 0) {
        if ($('#payment-mode-voucher:checkbox:checked').length > 0) {
            $('#voucherAlias').css('display', 'block');
        }
        else {
            $('#voucherAlias').css('display', 'none');
        }
    }
    
    if ($('#userCreateForm').length > 0) {
        $('#selectInstitute, #assignInstitute').listswap({
            truncate: true,
            height: 162,
            is_scroll:true, 
            divId: 'institute'
        });
        $('#selectForm, #assignForm').listswap({
            truncate: true,
            height: 162,
            is_scroll:true, 
            divId: 'form'
        });
    }
});

function addMoreFeeCondition(obj) {
    fieldStr = generateOptionList($('#paymentTpyeSelector').val(), false);
    $('#conditionalFeeContainer').prepend('<div class="row col-md-12">' + fieldStr + '</div>');
}

if ($('#paymentTpyeSelector').length > 0) {
    $(document).on('change', '#paymentTpyeSelector', function () {
        if (this.value != '') {
            fieldStr = generateOptionList(this.value, true);
            $('#conditionalFeeContainer').html('<div class="row col-md-12">' + fieldStr + '</div>');
            $('#conditionalFeeContainer').show();
            $('#addMoreAnchor').show();
        }
        else {
            $('#conditionalFeeContainer').html('');
            $('#conditionalFeeContainer').hide();
            $('#addMoreAnchor').hide();
        }
        //console.log(jsVars.paymentOptionList);
    });
}

if ($('#lateFeeCheck').length > 0) {
    $('#lateFeeCheck').click(function () {
        var $this = $(this);
        // $this will contain a reference to the checkbox   
        if ($this.is(':checked')) {
            // the checkbox was checked 
            $('#formFee').val(jsVars.lateFee);
        } else {
            // the checkbox was unchecked
            $('#formFee').val(jsVars.formFee);
        }
        finalFeeCalculate();
    });
}

if ($('#payment-mode-dd').length > 0) {
    $('#payment-mode-dd').click(function () {
        var $this = $(this);
        // $this will contain a reference to the checkbox   
        if ($this.is(':checked')) {
            // the checkbox was checked 
            $('#ddDetailsArea, #ddAlias').show();
			$('#ddDetailsArea, #ddAlias').parents('.rowSpaceReduce').show();
        } else {
            // the checkbox was unchecked
            $('#ddDetailsArea, #ddAlias').val('');
            $('#ddDetailsArea, #ddAlias').hide();
			$('#ddDetailsArea, #ddAlias').parents('.rowSpaceReduce').hide();
        }
    });
}

//For voucher Details Area
if ($('#payment-mode-voucher').length > 0) {
    $('#payment-mode-voucher').click(function () {
        var $this = $(this);
        // $this will contain a reference to the checkbox   
        if ($this.is(':checked')) {
            // the checkbox was checked 
            $('#voucherAlias').show();
			$('#voucherAlias').parents('.rowSpaceReduce').show();
        } else {
            // the checkbox was unchecked
            $('#voucherAlias').val('');
            $('#voucherAlias').hide();
			$('#voucherAlias').parents('.rowSpaceReduce').hide();
        }
    });
}

//For Cash Details Area
if ($('#payment-mode-cash').length > 0) {
    $('#payment-mode-cash').click(function () {
        var $this = $(this);
        // $this will contain a reference to the checkbox   
        if ($this.is(':checked')) {
            // the checkbox was checked 
            $('#cashDetailsArea, #cashAlias').show();
			$('#cashDetailsArea, #cashAlias').parents('.rowSpaceReduce').show();
        } else {
            // the checkbox was unchecked
            $('#cashDetailsArea, #cashAlias').val('');
            $('#cashDetailsArea, #cashAlias').hide();
			$('#cashDetailsArea, #cashAlias').parents('.rowSpaceReduce').hide();
        }
    });
}

function removeFeeCondition(id) {
    $("#removeFeeCondition_" + id).parent().parent().remove();
}

function generateOptionList(selectedOption, addMore) {
    var optionStr = "";
    feeAddMoreCount++;

    $.each(jsVars.paymentOptionList, function (index, value) {
        if (index == selectedOption) {
            $.each(value, function (innerIndex, innerValue) {
                optionStr += '<option value="' + innerValue.option_title + '">' + innerValue.option_title + '</option>';
            });
        }
    });

    var fieldStr = "<div class='col-md-4'><div class='select_blk'><select name='payment_type_dependent_options[]' id='paymentTypeDependentOptions_" + feeAddMoreCount + "' class='form-control'>" + optionStr + "</select></div></div>\n\
    \n\<div class='col-md-4'><input type='textfield' name='dependent_fee[]' maxlength='50' id='dependentFee_" + feeAddMoreCount + "' value='' class='form-control' placeholder='Enter Fee'><span class='requiredError'>You are not registered with us</span></div><div class='col-md-2'><a class='btn btn-default btn-info  pull-left' href='javascript:void(0);' onclick='removeFeeCondition(" + feeAddMoreCount + "); return false;' id='removeFeeCondition_" + feeAddMoreCount + "'>- Remove</a></div>";

    if (addMore === true) {
//        fieldStr += "<div class='col-md-2'><a class='btn btn-default btn-info  pull-left margin-top-12' href='javascript:void(0);' id='AddMoreFeeCondition' onclick='addMoreFeeCondition(this); return false;'>+ Add More</a>";
    }

    return fieldStr;
}

function finalFeeCalculate() {
    var fee = $('#formFee').val();
    var surcharge = $('#surchargeVal').val();
    var surchargeFormat = $('input[name=surcharge_format]:checked', '#formDetailForm').val();
    var surchargePaidBy = $('input[name=surcharge_paid_by]:checked', '#formDetailForm').val();
//    console.log(surchargePaidBy + '==' + fee + '==' + surcharge + '==' + surchargeFormat);

    if (fee != '' && surcharge != '' && surchargeFormat != '' && surchargePaidBy != '') {
        if (surchargePaidBy == 'college') {
            // college bearng all surcharge
            // no impact oon fee
//            fee = Math.round(fee);
            $('#final-application-fee').val(fee);
        }
        else {
            //student bearing surcharge.
            // lets calculate final fee.
            var finalFee = '';
            if (surchargeFormat == 'fixed') {
                finalFee = parseFloat(parseFloat(fee) + parseFloat(surcharge));
            }
            else {
                var percentageVal = parseFloat((parseFloat(fee) * parseFloat(surcharge)) / 100);
                finalFee = parseFloat(parseFloat(fee) + percentageVal);
            }
            
//            finalFee = Math.round(finalFee);
            $('#final-application-fee').val(finalFee);
        }
    }
}

function formDetailBtnClk(){
    $(document).on('click', '#formDetailBtn', function () {
        formDetailAjaxCall();
    });
}

//if ($('#formDetailBtn').length > 0) {
////Form form submit function
//    $(document).on('click', '#formDetailBtn', function () {
//        formDetailAjaxCall();
//    });
//}

function formDetailAjaxCall() {
    if(typeof CKEDITOR.instances.editor !='undefined'){
        CKEDITOR.instances.editor.updateElement();
    }
    saveLoaderAjaxDisp('formDetailBtn');
    $.ajax({
        url: '/form/formDetailSave',
        type: 'post',
        data: $("form#formDetailForm").serialize(),
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
//        	$('#contact-us-final div.loader-block').show();
        },
        complete: function () {
//		$('#contact-us-final div.loader-block').hide();
        },
        success: function (json) {
            if (json['status'] == 1) {
                // Success
                if (json['refresh'] == 1) {
                    if (json['nextPageStatus'] == 1) {
                        location = json['redirect'] + '/form/create-form/' + json['collegeId'] + '/' + json['createdFormId'];
                    }
                    else if (json['manage_form']) {
                        location = json['manage_form'];
                    }
                    else {
                        location.reload();
                    }
                }
                else {
                    $('#overlayThird').css('display', 'none');
                    
                }
            }
            else if (json['status'] == 2) {
                saveLoaderAjaxHide('formDetailBtn');
                // Validation error
//                alert('Validation Error : ' + json['error']);
                $('#formDetailForm .requiredError').html('');
                $('#formDetailForm .requiredError').hide();
                valCount = 0;
                $.each(json['error']['list'], function (index, value) {
                    index = index.toLowerCase();
                    $('#' + index + '_validation').html(value);
                    $('#' + index + '_validation').show();

                    if (valCount == 0) {
                        $('#formTitle').focus();
                    }
                    valCount++;
                });

            }
            else {
                // System Error
                alertPopup('Some Error occured, please try again.', 'error');
                
            }
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
//            $('#contact-us-final div.loader-block').hide();
        }
    });
}

//Manage Users: Change User Status
function showEmailConfirmationPopup(userId){
    var currentObj = $('#userChangeStatus_'+userId);
    var MainParentDiv = $('#userChangeStatus_'+userId).parents("div.application-form-block");
    var statusObj = $(MainParentDiv).find("span.user-status-span");
    var user_id = statusObj.attr('id');
    var status = statusObj.attr('alt');
    if(status=="1"){
        $('#ConfirmAlertYesBtn').unbind();
        $('#ConfirmAlertNoBtn').unbind();
        $("#ConfirmAlertPopUpSection").modal("show");
        $("#ConfirmAlertYesBtn").on("click",function(){
            changeStatusUser(user_id, status, currentObj, statusObj,'',1); 
        });
        $("#ConfirmAlertNoBtn").on("click",function(){
            changeStatusUser(user_id, status, currentObj, statusObj,'',0); 
        });
    }else{
        changeStatusUser(user_id, status, currentObj, statusObj,'',0); 
    }
}


function changeStatusUser(user_id, status, currentObj, statusObj,usersessionAction,sendCredentialEmail) {
    if(typeof usersessionAction=='undefined'){
        usersessionAction   = '';
    }
    if(typeof sendCredentialEmail==='undefined'){
        sendCredentialEmail = 0;
    }
    $.ajax({
        url: '/users/change-status-user',
        type: 'post',
        data: {'user_id': user_id, 'status': status, 'send_email':sendCredentialEmail},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
           currentObj.text('Wait..');
        },
        success: function (json) {

            if (json['status'] == 1) {
                if(typeof usersessionAction!='undefined' && usersessionAction!=''){//this is for manage session 
                    currentObj.removeAttr('onClick');
                    currentObj.html('Blocked User');
                }else{
                    statusObj.attr('alt', json['changedStatus']);
                    statusObj.attr('id', user_id);
                    statusObj.text(json['statusFlagText']);
                    statusObj.removeClass(json['removeClass']);
                    statusObj.addClass(json['statusClass']); 

                    currentObj.html('<span class="fa fa-circle '+json['statusColor']+' padding-right-5"></span>' +json['statusChangeText']);  
                }
            }
            else {
                // System Error
                alert('Some Error occured, please try again.', 'error');
            }
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);;
        }
    });
    
}

function deleteUser(user_id, status, id, location, name) {

    $('#ConfirmMsgBody').html('Are you sure to delete ' + name + ' user?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();
                $.ajax({
                    url: '/users/delete-user',
                    type: 'post',
                    data: {'user_id': user_id, 'status': status},
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
                            jQuery(".userblock_" + id).hide();
                            alertPopup("User " + name + " has been deleted", "success", location);
                        }
                        else {
                            // System Error
                            alertPopup('Some Error occured, please try again.', 'error');
                        }
                        return false;
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                        //$('#contact-us-final div.loader-block').hide();
                    }
                });

                $('#ConfirmPopupArea').modal('hide');
            });
    return false;
}

/*************FOR Voucher Management in Create Voucher*******************/
if ($('#VoucherSearchArea').length > 0)
{
    jQuery('.datepicker').datepicker({startView: 'month', format: "dd-mm-yyyy", enableYearToMonth: true, enableMonthToDay: true, endDate: ""});
}

if (jsVars.s_college_id)
{
    if(jsVars.form_id){
        var _form_id = jsVars.form_id;
    }else{
        var _form_id = '';
    }
    
    LoadForms(jsVars.s_college_id, _form_id);
}

function LoadForms(value, default_val,multiselect,module) {
    if(typeof multiselect =='undefined'){
        multiselect = '';
    }
    $.ajax({
        url: '/voucher/get-forms',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "college_id": value,
            "default_val": default_val,
            "multiselect":multiselect
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if(data=="session_logout"){
                window.location.reload(true);
            }
            $('#div_load_forms').html(data);
            $('.div_load_forms').html(data);
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            // Change Select box Caption for discount coupon module
            if(module=='Discount Coupon'){
                $("#form_id_chosen input").val("Select Form");
            }
            //console.log(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function LoadFormsMultipleSelect(value, default_val) {
    
    if(typeof value =='undefined' || value==''){
        if(jQuery('#college_id').val()!='')
            value = jQuery('#college_id').val();
        else{
            value = 0;
            $('#div_load_forms').html('Please Select College');
        }
    }
    
    
    if(typeof default_val == 'undefined'){
        default_val = '';
    }
    
    var form_status = jQuery('#form_status').val();
    
    if(value>0){
    
        $.ajax({
            url: '/form/get-all-related-form-url',
            type: 'post',
            dataType: 'json',
            //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
            data: {
                "CollegeId": value,
                'Condition':form_status,
                'get_all_form':'get_all_form'
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {

                if(data['success']==200){
                    var FormsList = data['FormList'];

                    var form_select = $('<select />').attr({
                        'multiple':'multiple',
                        'size':7,
                        'class':'chosen-select',
                        'name':'form_id[]'
                    });

                    var default_array = new Array();
                    if(typeof default_val !='undefined' && default_val!=''){
                        default_array = default_val.split(',');
                    }
//                    default_array.push('89');
                    for(var dt in FormsList){
                        if((default_array.length == 1 && default_array == dt) || (default_array.length >1 && default_array.indexOf(dt)>-1)){
                            form_select.append($("<option>").attr({'value':dt,'selected':'selected'}).text(FormsList[dt]));
                        }else{
                            form_select.append($("<option>").attr({'value':dt}).text(FormsList[dt]));
                        }
                    }

                    $('#div_load_forms').html(form_select);
                }


                //$('#div_load_forms').html(data);

                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                //console.log(data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

$(document).ready(function () {

    if ($('#createdtill').length > 0) {
        $('#createdtill').datepicker({startView: 'month', format: 'dd/mm/yyyy', enableYearToMonth: true, enableMonthToDay: true, pickTime: false});
    }

    if ($('#createdon').length > 0) {
        $('#createdon').datepicker({startView: 'month', format: 'dd/mm/yyyy', enableYearToMonth: true, enableMonthToDay: true, pickTime: false});
    }


    // auto complete user name
    if ($('#search-username').length > 0) {
        $('#search-username').typeahead({
            hint: true,
            highlight: true,
            minLength: 3
            , source: function (request, response) {
                var search = $('#search-username').val();
                var role_selected = $('#role_selected').val();
                var status = $('#UserStatus').val();
                var college_id = $('#institute_selected').val();
                if (search)
                {
                    $.ajax({
                        url: jsVars.SearchUserUrl,
                        data: {search: search, area: 'name',role_selected: role_selected,status: status,college_id:college_id},
                        dataType: "json",
                        type: "POST",
                        headers: {
                            "X-CSRF-Token": jsVars._csrfToken
                        },
                        //contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            items = [];
                            map = {};
                            $.each(data.listUser, function (i, item) {

                                var id = i;
                                var name = item;
                                map[name] = {id: id, name: name};
                                items.push(name);
                            });
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
            //        updater: function (item) {
            //            $('#FilterForm #search').val(map[item].id);
            //            return item;
            //        }
        });
    }
});

function confirmCopyForm(url, id,fromNew=0) 
{
    var nameTD = $('td#form-name-' + id);
    var formName = '';
    if ($(nameTD).find('a')) {
        formName = $(nameTD).find('a').text();
    } else {
        formName = $(nameTD).text();
    }
    var collegeId = $(nameTD).attr('data-alt');
    var collegeList = jsVars.jsCollegeList;
    var collegeName = collegeList[collegeId];
    var environmentName = jsVars.environmentNameDefault;
    $('#CopyFormPopUpTextArea').html('Copying "' + formName + '" of "' + collegeName + '" from "' + environmentName + '" to');
    if(typeof jsVars.environmentDefault != 'undefined') { 
        $('#copy2 select#environmentList').val(jsVars.environmentDefault);
        $('#copy2 select#environmentCollegeList').val(collegeId);
        $('#copy2 select#environmentList, #copy2 select#environmentCollegeList').trigger('chosen:updated');
        $('#copy2 span#copyFormPopupError').text('');
    }
    $("#copy2 input#formId").val(id);
    $("#copy2 input#formUrl").val(url);
    $("#copy2 a#CopyBtn").attr("onclick", 'return CopyForm("' + url + '","'+fromNew+'");');
    $("#copy2").modal();
    return false;
}

function CopyForm(url,fromNew=0) {
    var environment = $('#copy2 select#environmentList').val();
    var institute = parseInt($('#copy2 select#environmentCollegeList').val());
    var environmentDefault = jsVars.environmentDefault;
    //call confirm popup if (env = defaultEnv) & college selected
    if((environment == environmentDefault) && (institute > 0)) {
        callCopyFormConfirmPopup(environment,fromNew);
    }
    else { 
        callCopyFormAjax(url, environment, institute);
    }
    return false;
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

//Manage Taxonomy Functions

//Create Options: Add new option
$(document).ready(function () {
    //add more Instruction


    $(document).on('click', '#AddMoreItemBtn', function () {
//        if (jsVars.CategoryOptionsListCount < jsVars.MAX_ADD_INSTRUCTION)
//        {
            var OptionCount = jsVars.CategoryOptionsListCount;
            OptionCount++;
            jsVars.CategoryOptionsListCount = OptionCount;

            var OptionHtml = '<div class="voucher-block b-all voucher-option-new"  id="OptionArea' + OptionCount + '">';
            OptionHtml += '     <div class="col-md-4">';
            OptionHtml += '         <div class="row text-left margin-left-8">';
            OptionHtml += '             <input type="text" name="options[]" value="" class="form-control" placeholder="Enter Option Title"/>';
            OptionHtml += '         </div>';
            OptionHtml += '     </div>';
            OptionHtml += '     <div class="col-md-4">';
            OptionHtml += '     </div>';
            OptionHtml += '     <div class="col-md-4">';
            OptionHtml += '         <button type="button" onclick="RemoveOption(\'OptionArea' + OptionCount + '\')" class="margin-right-15"><i class="fa fa-times-circle-o"></i></button>';
            OptionHtml += '     </div>';
            OptionHtml += ' </div>';
            $('#SaveBtnArea').before(OptionHtml);
//        }
//        else
//        {
//            alertPopup('You have permission to add maximum ' + jsVars.MAX_ADD_INSTRUCTION + ' options.');
//        }
    });
});

//Remove Option   
function RemoveOption(OptionArea)
{
    $('#' + OptionArea).remove();
    jsVars.CategoryOptionsListCount = jsVars.CategoryOptionsListCount - 1;

}
//Manage Taxonomy: Change Category Status
$(document).on('click', '#CategoryChangeStatusConfirm', function (e) {
    e.preventDefault();
    var MainParentDiv = $(this).parents("div.voucher-block");
    var CategoryId = $(MainParentDiv).prop('id');
    if (CategoryId > 0)
    {
        var CategoryName = $(MainParentDiv).find("h4#CategoryTitle").text();
        var LiStatus = $(MainParentDiv).find("span#CategoryStatusSpan").text();
        var PopUpStatus = (LiStatus == 'Active') ? 'disable' : 'enable';
        var PopUpConfirmStatus = (LiStatus == 'Active') ? 'disabled' : 'enabled';
        $("#ConfirmPopupArea p#ConfirmMsgBody").text('Do you want to ' + PopUpStatus + ' the category \'' + CategoryName + '\'.');
        $('#SuccessPopupArea p#MsgBody').text('Category \'' + CategoryName + '\' has been ' + PopUpConfirmStatus + '.');
        $("#ConfirmPopupArea a#confirmYes").attr("onclick", 'ChangeMasterCategoryStatus(\'' + CategoryId + '\',\'ChangeStatus\',\'' + LiStatus + '\');');
    }
    else
    {
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
});

//Manage Taxonomy: Delete Category
$(document).on('click', '#CategoryDeleteStatusConfirm', function (e) {
    e.preventDefault();
    var MainParentDiv = $(this).parents("li.dd-item");
    var CategoryId = $(MainParentDiv).attr('data-id');    
    if (CategoryId > 0)
    {
        var CategoryName = $(MainParentDiv).find("input#cat_name_"+CategoryId).val();
        var PopUpStatus = 'delete';
        var PopUpConfirmStatus = 'deleted';
        $("#ConfirmPopupArea p#ConfirmMsgBody").text('Do you want to ' + PopUpStatus + ' the category \'' + CategoryName + '\'.');
        $('#SuccessPopupArea p#MsgBody').text('Category \'' + CategoryName + '\' has been ' + PopUpConfirmStatus + '.');
        $("#ConfirmPopupArea a#confirmYes").attr("onclick", 'ChangeMasterCategoryStatus(\'' + CategoryId + '\',\'DeleteCategory\',\'\');');
    }
    else
    {
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
});

//enable/disable college form
function ChangeMasterCategoryStatus(CategoryId, Action, CurrentStatus)
{
    if (CategoryId > 0)
    {
        $.ajax({
            url: jsVars.ChangeCategoryStatusUrl,
            type: 'post',
            data: {CategoryId: CategoryId, Action: Action, CurrentStatus: CurrentStatus},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $(".npf-close").trigger('click');
                $('div.loader-block').show();
            },
            complete: function () {
                $('div.loader-block').hide();
            },
            success: function (json) {

                if (json['redirect'])
                {
                    location = json['redirect'];
                }
                else if (json['error'])
                {
                    if (json['error'])
                    {
                        alertPopup(json['error'], 'error');
                    }
                }
                else if (json['success'] == 200)
                {
                    if (Action == 'ChangeStatus')
                    {
                        if (json['action'])
                        {
                            for(var NewCategoryId in json['CategoryIdList'])
                            {
                                var MainParentDiv = $('div#' + json['CategoryIdList'][NewCategoryId]);
                                $(MainParentDiv).find("span#CategoryStatusSpan").removeClass(json['action']['removeClass']).addClass(json['action']['addClass']).text(json['action']['addText']);
                            }
                        }
                    }
                    else if (Action == 'DeleteCategory')
                    {
                        for(var NewCategoryId in json['CategoryIdList'])
                        {
                            $('span.label_' + json['CategoryIdList'][NewCategoryId]).closest('li.dd-item').remove();
                        }
                    }
                    $("#SuccessLink").trigger('click');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
    else
    {
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
}

//function ChangeSession(value) {
//    var c_controller = $('.currentController').val();
//    var c_method = $('.currentMethod').val();
//    $.ajax({
//        url: '/common/set-college',
//        type: 'post',
//        dataType: 'json',
//        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
//        data: {
//            "value": value,
//            "c_controller":c_controller,
//            "c_method":c_method
//        },
//        headers: {
//            "X-CSRF-Token": jsVars._csrfToken
//        },
//        success: function (data) {
//            if(data.code == 200 && (data.url != '')){
//                window.location.href = data.url;
//            }else{
//                window.location.href = location.href;
//            }
//        },
//        error: function (xhr, ajaxOptions, thrownError) {
//            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
//            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
//        }
//    });
//}

//Error Message For Forms
$(document).ready(function () {
    //College Login/Forgot Password Page 
    if ($('#login-scroll, #forgot-password, #change-password').length > 0)
    {
        if(jsVars.error)
        {
            for(var key in jsVars.error)
            {
                $("#" + key).parents("div.form-group").addClass("has-error");
                $("#" + key).next("span.requiredError").text(jsVars.error[key]);
                $("#" + key).focus();
            }
        }
    }
    
    //College Reset Password Page
    if ($('#reset-password').length > 0)
    {
        if(jsVars.error)
        {
            for(var key in jsVars.error)
            {
                $("#" + key).parents("div.form-group").addClass("has-error");
                $("#" + key).next("span.help-block").text(jsVars.error[key]);
                $("#" + key).focus();
            }
        }
    }
});

function displayMachinekeyBox(form_id){

    $.ajax({
        url: '/form/get-form-keys',
        type: 'post',
        dataType: 'json',
        async:false,
        data: {
            "form_id": form_id
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if (json['redirect']){
                    location = json['redirect'];
            }
            else if (json['error']){
                alertPopup(json['error'], 'error');
            }
            else if (json['success'] == 200){

                jQuery("#generic_machinekey").html(json['data']);
                jQuery("#machinekey").modal();    
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });




    
    return false;
}

 function saveLoader(){
    jQuery('#submitbutton').hide();
    jQuery('#save_loader').removeClass('hidden');
    return true;
}

function saveLoaderAjaxDisp(html_id){
    jQuery('#'+html_id).hide();
    jQuery('#save_loader').removeClass('hidden');
}
function saveLoaderAjaxHide(html_id){
    jQuery('#'+html_id).show();
    jQuery('#save_loader').addClass('hidden');
}

//Report Create Folder Functions start here
function LoadCollegeAssociatedUserList(select_user)
{
    if(typeof select_user == 'undefined' || select_user==''){
        select_user = 'no';
    }
    $.ajax({
        url: jsVars.GetCollegeUsersList,
        type: 'post',
        dataType: 'json',
        async:false,
        data: $('#CollegeIdInput'),
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if (json['redirect']){
                    location = json['redirect'];
            }
            else if (json['error']){
                alertPopup(json['error'], 'error');
            }
            else if (json['success'] == 200){
                if(json['UsersList'].length == 0)
                {
                    alertPopup('No user found!', "error");
                }
                var html = '';
                if(select_user=='yes'){
                    var html = '<option value="0">Select User</option>';
                }else{
                    var html = '';
                }
                var PreSelected = jsVars.UserAccessList;
                for(var UserId in json['UsersList'])
                {
                    if(UserId in PreSelected)
                    {
                        html += '<option value="'+UserId+'" selected="selected">'+json['UsersList'][UserId]+'</option>';
                    }
                    else
                    {
                        html += '<option value="'+UserId+'">'+json['UsersList'][UserId]+'</option>';
                    }
                }
                
                $('#UserListSection').html(html);    
                $('#UserListSection').trigger('chosen:updated');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}    

//Delete Report Folder Script
function FolderDeleteConfirmation(FolderId)
{
    var FolderName = $('#name_'+FolderId).text();
    $('#ConfirmAlertPopUpTextArea').text('');
    $('#ConfirmAlertPopUpTextArea').append('You want to delete folder \''+FolderName+'\'.');
    $('#ConfirmAlertYesBtn').attr('onclick','DeleteReportFolder(\''+FolderId+'\');');
    $('#ConfirmAlertPopUpButton').trigger('click');
}

function DeleteReportFolder(FolderId)
{
    $.ajax({
        url: jsVars.deleteReportFolderUrl,
        type: 'post',
        dataType: 'json',
        async:false,
        data: {entity:FolderId,action:'confirm'},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if(json['redirect'])
            {
                location = json['redirect'];
            }
            
            if(json['error'])
            {
                $('#ErrorPopupArea p#ErrorMsgBody').text(json['error']);
                $('#ErrorLink').trigger('click');
            }
            else if(json['success'])
            {
                $('#SuccessPopupArea p#MsgBody').text(json['msg']);
                $('#SuccessLink').trigger('click');
                $('#SuccessPopupArea').removeAttr('tabindex');
                $('#SuccessPopupArea a#OkBtn').show();
                $('#SuccessPopupArea .npf-close,#SuccessPopupArea  .oktick').hide();
                $('#SuccessPopupArea a#OkBtn').attr('href',window.location.href);
            }
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

//Delete Report Script
function ReportDeleteConfirmation(ReportId,linkObj)
{
    var ReportName = $('#load_more_results').find('td#name_'+ReportId).text();
    $('#ConfirmAlertPopUpTextArea').text('');
    $('#ConfirmAlertPopUpTextArea').append('Do you want to delete report <br/>\''+ReportName+'\'');
    $('#ConfirmAlertYesBtn').attr('onclick','DeleteReport(\''+ReportId+'\');');
    $('#ConfirmAlertPopUpButton').trigger('click');
}

function DeleteReport(ReportId)
{
    $.ajax({
        url: jsVars.DeleteReportUrl,
        type: 'post',
        dataType: 'json',
        async:false,
        data: {entity:ReportId,action:'confirm'},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if(json['redirect'])
            {
                location = json['redirect'];
            }
            
            if(json['error'])
            {
                $('#ErrorPopupArea p#ErrorMsgBody').text(json['error']);
                $('#ErrorLink').trigger('click');
            }
            else if(json['success'])
            {
                $('#SuccessPopupArea p#MsgBody').text(json['msg']);
                $('#SuccessLink').trigger('click');
                $('#SuccessPopupArea').removeAttr('tabindex');
                $('#SuccessPopupArea a#OkBtn').show();
                $('#SuccessPopupArea .npf-close,#SuccessPopupArea  .oktick').hide();
                $('#SuccessPopupArea a#OkBtn').attr('href',window.location.href);
            }
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function LoadReportFolderListing()
{
    Page = Page + 1;
    $('#LoadReportFolderListingStartPage').val(Page);
    $.ajax({
        url: jsVars.loadReportFolderListing,
        type: 'post',
        dataType: 'html',
        async:false,
        data: $('#college_id,#start_date,#end_date,#LoadReportFolderListingStartPage'),
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (html) {
            //count tr
            var data = {};
            data.html = html;
            var trCount = $.grep($.parseHTML(data.html), function(el, i) { 
              return $(el);
            }).length;
            
            if((html.indexOf("<td>") <= 0) || (trCount < 10))
            {
                $('#load_more_button').hide();
            }
            
            $('#LoadReportFolders').append(html);
			dropdownMenuPlacement();
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function LoadFolder(val,default_val,filter){
    
    if(typeof filter !='undefined' && filter =='related'){
        if(val==''){
            val = -1
            $('#div_load_folders').html('Please Select College');
        }
    }
    if(val!=-1){
    $.ajax({
        url: jsVars.loadCollegeFolder,
        type: 'post',
        dataType: 'html',
        async:true,
        data: {college_id: val, "default_val": default_val,filter:filter},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (html) {
            $('#div_load_folders').html(html);
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    }
    
    return false;
}

function SaveAsNewReport(report_id,redirect_to) {
   
    if(typeof redirect_to == 'undefined' ){
        redirect_to = 'columns';
    }
    
    if(jQuery('#final_columns').length>0){
        $('#final_columns option').map(function(){
            this.selected= true;
        });
        var final_col = jQuery('#final_columns').val();
    }else{
        var final_col = false;
    }
    
   $.ajax({
        url: '/reports/create-report/create_report/'+report_id,
        type: 'post',
        dataType: 'html',
        data: {'ajaxcall':'ajaxcall','report_id':report_id},
        async:false,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (html) {
            
            $('#saveasnew .modal-body').html(html);
            $('#redirect_to').val(redirect_to);
            if(final_col){
                for(var indx in final_col){
                    $('<input>').attr({
                        type: 'hidden',
                        name: 'final_columns[]',
                        value:final_col[indx]
                    }).appendTo('#CreateReportFormAjax');
                }
            }
            
            $('#saveasnew').modal({backdrop: 'static', keyboard: false});
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

function SaveAsNewReport_Save(){
    
    var report_id = $('#CreateReportFormAjax #report_id').val();
    var report_name = $('#CreateReportFormAjax #report_name').val();
    var data = $('#CreateReportForm').serializeArray();
    data.push({name: 'old_report_id', value: report_id});
    data.push({name: 'new_report_name', value: report_name});
    //var dt = $('#CreateReportFormAjax').serializeArray();
    $.ajax({
        url: '/reports/report-saveas-new/',
        type: 'post',
        dataType: 'html',
        data: data,
        async:false,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        
        success: function (html) {
            if(isNaN(html)){
                $('#saveasnew').modal('hide');
                if(html.indexOf('Error:')>-1){
                    $('#saveasnew').modal('hide');
                    alertPopup(html,'error');
                }else{
                    alertPopup('Error while saving new report','error');
                }
            }else{
                var  redirect_to = $('#CreateReportForm [name="form_step"]').val();
                location = '/reports/create-report/'+redirect_to+"/"+html
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
    return false;
    
}

function displayAssignedInstitute(user_id){
    var html = $('#user_assigned_institute_'+user_id).html();
    alertPopup(html, "success");
    $('#alertTitle').html('Assigned Institutes List');
   }
   
  
  function generateFormSlug(form_id,college_url){
      
      $.ajax({
        url: '/form/generate-form-slug/',
        type: 'post',
        dataType: 'json',
        data: {'form_id':form_id,'college_url':college_url},
        async:false,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        
        success: function (json) {
            if (json['redirect']){
                location = json['redirect'];
            }
            else if (json['error']){
                alertPopup(json['error'], 'error');
            }
            else if (json['success'] == 200){
                // on successfull
                $("#embed #slugButton").html('');
                $("#embed .formhtmlurl").show();
                $("#embed #EmbededHtmlLinkForm").val(json['embedLinkForm']);
                $("#embed #EmbededHtmlCodeForm").html(json['embedHtmlForm']);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
      return false;
      
      
  }
  
  
  
function CollegeDeleteDeleteConfirmation(DocId){
    var DocName = $('#name_'+DocId).text();
    $('#ConfirmAlertPopUpTextArea').text('');
    $('#ConfirmAlertPopUpTextArea').append('You want to delete Document \''+DocName+'\'.');
    $('#ConfirmAlertYesBtn').attr('onclick','DeleteCollegeDocument(\''+DocId+'\');');
    $('#ConfirmAlertPopUpButton').trigger('click');
}

$(document).on('click',"#collegePurgeDataId",function(e){
    e.preventDefault();
    var MainParentDiv = $(this).parents("div.application-form-block");
    var InstituteId = $(MainParentDiv).prop('id');
    
    if (InstituteId > 0)
    {   $(".modal-dialog").css('width','600px');
        var InstituteName = $(MainParentDiv).find("h3").text();
        var InstituteHash = $(this).attr('data');
        showPurgeInstituteData(InstituteId,''+InstituteHash);
        $("#PurgeStatusArea p#DisableEnableFormPopUpTextArea").text('');
        $('#PurgeStatusSuccessArea p#ConfirmDisableEnableFormPopUpTextArea').text(InstituteName + '\'s data has been purged successfully.');
        $("#PurgeStatusArea button#ChangeStatusBtn").text("PURGE");
        $("#PurgeStatusArea button:nth-child(3)").text("CANCEL");
    }
    else
    {
        $(".npf-close").trigger('click');
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
    
});

function showPurgeInstituteData(InstituteId, InstituteHash){
    if (InstituteId > 0)
    {
        $.ajax({
            url: InstituteHash,
            type: 'post',
            data: {InstituteId: InstituteId,show_data_only:1},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
//                $(".npf-close").trigger('click');
                $('div.loader-block').show();
            },
            complete: function () {
                $('div.loader-block').hide();
            },
            success: function (json) {
                var show_purge_button = 0;
                if (json['redirect'])
                {
                    location = json['redirect'];
                }
                else if (json['error'])
                {
                    $("#PurgeStatusArea h2.modal-title").text('Purge Data - Error');
                    $("#PurgeStatusArea button#ChangeStatusBtn").hide();
                    $('#PurgeStatusArea p#DisableEnableFormPopUpTextArea').text(json['error']);
                    $("#PurgeStatusArea button:nth-child(3)").text("Close");
                }
                else if (json['success'] == 200)
                {
                    $("#PurgeStatusArea h2.modal-title").text('Purge Data');
                    $("#PurgeStatusArea button#ChangeStatusBtn").show();
                    var html = "";
                    var infoclass = "";  
                    if(json['lead_detail']){
                        if(json['lead_detail']['status']=='error'){
                           infoclass = "alert margin-top-10 margin-bottom-0 alert-danger";
                        }else{
                            if(json['lead_detail']['count'] != 0){
                                show_purge_button = 1;
                            }
                            infoclass = "alert margin-top-10 margin-bottom-0  alert-primary";
                        }
                        html += "<div class='"+infoclass+"' > Leads - "+json['lead_detail']['count']+"</div>";
                    }
                    if(json['form_detail']){
                        html += "<table class='table table-responsive list_data margin-top-10' > \
                                    <thead>  \
                                        <tr>\
                                            <th width='55%'>Form Name</th>\
                                            <th width='15%'>Pending</th>\
                                            <th width='15%'>Approved</th>\
                                            <th width='15%'>Total</th>\
                                        </tr>\
                                    </thead>\
                                </table>\
                                <div class='table-responsive-height'>\
                                    <table class='table table-responsive list_data '>\
                                        <tbody>";
                        for(var formDetail in json['form_detail']){
                           if(json['form_detail'].hasOwnProperty(formDetail)){
                                if(json['form_detail'][formDetail]['status']=='error'){
                                    infoclass = "text-left text-danger";
                                }else{
                                    show_purge_button = 1;
                                    infoclass = "text-left ";
                                }
                                html += "<tr >  <td width='55%' class='"+infoclass+"'>"+json['form_detail'][formDetail]['name']+"</td>\
                                                <td width='15%'>"+json['form_detail'][formDetail]['pendingApplicationCount']+"</td>\
                                                <td width='15%' >"+json['form_detail'][formDetail]['applicationCount']+"</td>\
                                                <td width='15%' >"+json['form_detail'][formDetail]['userCount']+"</td>\
                                        </tr>";
                            }
                        }
                        html += "</tbody></table></div>";
                    }
                    html += "<div class='text-right'><small>*The ones in Red wont be purged as it exceed the limit set by SuperAdmin</small></div>";
                    $('#PurgeStatusArea p#DisableEnableFormPopUpTextArea').html(html);
                    $("#PurgeStatusArea button#ChangeStatusBtn").attr("onclick", 'purgeInstituteData(\'' + InstituteId + '\',\'' + InstituteHash + '\');');
                    if(show_purge_button == '0'){
                        $("#PurgeStatusArea button#ChangeStatusBtn").hide();
                    }
                    if(json['msg']){
                        $("#PurgeStatusArea h2.modal-title").text('Purge Data - Error');
                        $("#PurgeStatusArea button#ChangeStatusBtn").hide();
                        $('#PurgeStatusArea p#DisableEnableFormPopUpTextArea').text(json['msg']);
                        $("#PurgeStatusArea button:nth-child(3)").text("Close");
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
    else
    {   $(".npf-close").trigger('click');
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
}

function purgeInstituteData(InstituteId, InstituteHash){
    if (InstituteId > 0)
    {
        $.ajax({
            url: InstituteHash,
            type: 'post',
            data: {InstituteId: InstituteId,show_data_only:0},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $(".npf-close").trigger('click');
                $('div.loader-block').show();
            },
            complete: function () {
                $('div.loader-block').hide();
            },
            success: function (json) {
                
                if (json['redirect'])
                {
                    location = json['redirect'];
                }
                else if (json['error'])
                {
                    alertPopup(json['error'], 'error');
                }
                else if (json['success'] == 200)
                {
                    $("#PurgeStatusSuccessArea h2.modal-title").text('Purge Data');
                    var html = "";
                    var user_delete_count = 0
                    var apllication_delete_count = 0
                    
                    if(json['user_detail']['user_delete_count']){
                        user_delete_count = json['user_detail']['user_delete_count']
                    }
                    if(json['lead_detail']){
                        html += "<div class = 'alert margin-top-10 margin-bottom-0 alert-success'> Leads Purged - "+json['lead_detail']['count']+"</div>";
                    }
                    if(json['form_detail']){
                        html += "<table class='table table-responsive list_data margin-top-10' > \
                                    <thead>  \
                                        <tr>\
                                            <th width='60%'>Form Name</th>\
                                            <th width='20%'>Approved Purged</th>\
                                            <th width='20%'>Total Purged</th>\
                                        </tr>\
                                    </thead>\
                                </table>\
                                <div class='table-responsive-height'>\
                                    <table class='table table-responsive list_data '>\
                                        <tbody>";
                        for(var formDetail in json['form_detail']){
                            if(json['form_detail'].hasOwnProperty(formDetail)){
                                apllication_delete_count +=  parseInt(json['form_detail'][formDetail]['userCount']);
                                 html += "<tr > <td width='60%' class='text-left'>"+json['form_detail'][formDetail]['name']+"</td>\
                                                <td width='20%' >"+json['form_detail'][formDetail]['applicationCount']+"</td>\
                                                <td width='20%' >"+json['form_detail'][formDetail]['userCount']+"</td>\
                                        </tr>";
                            }
                        }
                        html += "</tbody></table></div>";
                    }
                    if(html != ""){
                        html = "<div class='text-left'><small> A total of "+user_delete_count+" Users and "+apllication_delete_count+" Applications have been purged</div>" + html;
                    }
                    $('#PurgeStatusSuccessArea p#ConfirmDisableEnableFormPopUpTextArea').html(html);
                    if(json['msg']){
                        $("#PurgeStatusSuccessArea h2.modal-title").text('Purge Data - Error');
                        $('#PurgeStatusSuccessArea p#ConfirmDisableEnableFormPopUpTextArea').html(json['msg']);
                    }
                    
                    $("#PurgeStatusSuccessBtn").trigger('click');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
    else
    {
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
}

$(document).on('click', '#purgeformData', function (e) {
    e.preventDefault();
    var MainParentDiv = $(this).parents("div.application-form-block");
    var FormId = $(MainParentDiv).prop('id');
    if (FormId > 0)
    {   $(".modal-dialog").css('width','600px');
        var hash = $(this).attr('data');
        var FormName = $(MainParentDiv).find("h3").text();        
        $("#FilterForm #FormId").val(FormId);
        showPurgeFormData(FormId,''+hash);
        $("#PurgeStatusArea h2.modal-title").text('Purge Data');
        $("#PurgeStatusArea p#DisableEnableFormPopUpTextArea").text('');
        $('#PurgeStatusSuccessArea p#ConfirmDisableEnableFormPopUpTextArea').text("Successfully purge form data");
        $("#PurgeStatusArea button#ChangeStatusBtn").text("PURGE");
        $("#PurgeStatusArea button:nth-child(3)").text("CANCEL");
    }
    else
    {
        $(".npf-close").trigger('click');
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
});

function showPurgeFormData(form_id, hash){
    if (form_id > 0)
    {   
        $.ajax({
            url: hash,
            type: 'post',
            data: {form_id: form_id,show_data_only:1},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
//                $(".npf-close").trigger('click');
                $('div.loader-block').show();
            },
            complete: function () {
                $('div.loader-block').hide();
            },
            success: function (json) {
                
                if (json['redirect'])
                {
                    location = json['redirect'];
                }
                else if (json['error'])
                {   $("#PurgeStatusArea h2.modal-title").text('Purge Data - Error');
                    $("#PurgeStatusArea button#ChangeStatusBtn").hide();
                    $('#PurgeStatusArea p#DisableEnableFormPopUpTextArea').text(json['error']);
                    $("#PurgeStatusArea button:nth-child(3)").text("Close");
                }else if (json['success'] == 200){
                     $("#PurgeStatusArea button#ChangeStatusBtn").show();
                    var html = "";
                    var infoclass = "";
                    var show_purge_button = 0;
                    if(json['form_detail']){
                        html += "<table class='table table-responsive list_data margin-top-10' > \
                                    <thead>  \
                                        <tr>\
                                            <th width='55%'>Form Name</th>\
                                            <th width='15%'>Pending</th>\
                                            <th width='15%'>Approved</th>\
                                            <th width='15%'>Total</th>\
                                        </tr>\
                                    </thead>\
                                </table>\
                                <div class='table-responsive-height'>\
                                    <table class='table table-responsive list_data '>\
                                        <tbody>";
                        for(var formDetail in json['form_detail']){
                           if(json['form_detail'].hasOwnProperty(formDetail)){
                               if(json['form_detail'][formDetail]['status']=='error'){
                                    infoclass = "text-left text-danger";
                                }else{
                                    show_purge_button = 1;
                                    infoclass = "text-left ";
                                }
                                html += "<tr >  <td width='55%' class='"+infoclass+"'>"+json['form_detail'][formDetail]['name']+"</td>\
                                                <td width='15%'>"+json['form_detail'][formDetail]['pendingApplicationCount']+"</td>\
                                                <td width='15%' >"+json['form_detail'][formDetail]['applicationCount']+"</td>\
                                                <td width='15%' >"+json['form_detail'][formDetail]['userCount']+"</td>\
                                        </tr>";
                            }
                        }
                        html += "</tbody></table> </div>";
                        html += "<div class='text-right'><small>*The ones in Red wont be purged as it exceed the limit set by SuperAdmin</small></div>";
                        $('#PurgeStatusArea p#DisableEnableFormPopUpTextArea').html(html);
                        $("#PurgeStatusArea button#ChangeStatusBtn").attr("onclick", 'PurgeFormData(\'' + form_id + '\',\'' + hash + '\');');
                        if(show_purge_button == '0'){
                            $("#PurgeStatusArea button#ChangeStatusBtn").hide();
                        }
                    }else if(json['msg']){
                        $("#PurgeStatusArea h2.modal-title").text('Purge Data - Error');
                        $("#PurgeStatusArea button#ChangeStatusBtn").hide();
                        $('#PurgeStatusArea p#DisableEnableFormPopUpTextArea').text(json['msg']);
                        $("#PurgeStatusArea button:nth-child(3)").text("Close");
                    }
                   
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
    else
    {
        $(".npf-close").trigger('click');
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
}

function PurgeFormData(form_id, hash){
     if (form_id > 0)
    {
        $.ajax({
            url: hash,
            type: 'post',
            data: {form_id: form_id,show_data_only:0},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $(".npf-close").trigger('click');
                $('div.loader-block').show();
            },
            complete: function () {
                $('div.loader-block').hide();
            },
            success: function (json) {

                if (json['redirect'])
                {
                    location = json['redirect'];
                }
                else if (json['error'])
                {
                    alertPopup(json['error'], 'error');
                }else if (json['success'] == 200){
                    $("#PurgeStatusSuccessArea h2.modal-title").text('Purge Data');
                    var html = ""; 
                    var user_delete_count = 0
                    var apllication_delete_count = 0
                    
                    if(json['form_detail']){
                        html += "<table class='table table-responsive list_data margin-top-10' > \
                                    <thead>  \
                                        <tr>\
                                            <th width='60%'>Form Name</th>\
                                            <th width='20%'>Approved Purged</th>\
                                            <th width='20%'>Total Purged</th>\
                                        </tr>\
                                    </thead>\
                                </table>\
                                <div class='table-responsive-height'>\
                                    <table class='table table-responsive list_data '>\
                                        <tbody>";
                       for(var formDetail in json['form_detail']){
                           if(json['form_detail'].hasOwnProperty(formDetail)){
                               apllication_delete_count +=  parseInt(json['form_detail'][formDetail]['userCount']);
                               html += "<tr >  <td width='60%' class='text-left'>"+json['form_detail'][formDetail]['name']+"</td>\
                                                <td width='20%' >"+json['form_detail'][formDetail]['applicationCount']+"</td>\
                                                <td width='20%' >"+json['form_detail'][formDetail]['userCount']+"</td>\
                                        </tr>";
                            }
                        }
                        html += "</tbody></table></div>";
                        if(json['user_detail']['user_delete_count']){
                            user_delete_count = json['user_detail']['user_delete_count'];
                        }
                        if(json['user_detail']['status'] == '1'){
                            html = "<div class='text-left'><small> A total of "+user_delete_count+" Users and "+apllication_delete_count+" Application have been purged </small> </div>" + html;
                        }
                       $('#PurgeStatusSuccessArea p#ConfirmDisableEnableFormPopUpTextArea').html(html);
                    }else if(json['msg']){
                        $("#PurgeStatusSuccessArea h2.modal-title").text('Purge Data - Error');
                        $('#PurgeStatusSuccessArea p#ConfirmDisableEnableFormPopUpTextArea').text(json['msg']);
                    }
                    $("#PurgeStatusSuccess").trigger('click');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
    else
    {
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
}

function DeleteCollegeDocument(DocId){
    $.ajax({
        url: jsVars.deleteCollegeDocumentUrl,
        type: 'post',
        dataType: 'json',
        async:false,
        data: {entity:DocId,action:'confirm'},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if(json['redirect']){
                location = json['redirect'];
            }
            if(json['error']){
                alertPopup(json['error'],'error');
            }
            else if(json['success']){
                $('#SuccessPopupArea p#MsgBody').text(json['msg']);
                $('#SuccessLink').trigger('click');
                $('#SuccessPopupArea').removeAttr('tabindex');
                $('#SuccessPopupArea a#OkBtn').show();
                $('#SuccessPopupArea .npf-close,#SuccessPopupArea  .oktick').hide();
                $('#SuccessPopupArea a#OkBtn').attr('href',window.location.href);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getAllFormFieldsDB(formid) {
    
    $.ajax({
        url: '/form/get-forms',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "college_id": value,
            "default_val": default_val,
            "multiselect":multiselect
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if(data=="session_logout"){
                window.location.reload(true);
            }
            $('#div_load_forms').html(data);
            $('.div_load_forms').html(data);
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            //console.log(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/**
 * Using this function we can drag and drop file and upload the file to the server
 * 
 * When call this function make sure you have call with below format:
 * 
 * dragAndDrop('upload-file');
  
  var getDragAndDropServerResponse=function(response){
        if(response.status === 'success') {
            //Handle the response as per your requirement
            if(typeof response !='undefined') {
                var server_resp=jQuery.parseJSON(response.xhr.response);
                if(typeof server_resp.error != 'undefined') {
                    $('#showError').html(server_resp.error).addClass('alert alert-danger');
                }else if(typeof server_resp.redirect_url != 'undefined') {
                    //window.location=server_resp.redirect_url;
                }
            }
        }
  }
 * 
 * @param {type} submit_btn_id (ID of the submit button)
 * @param {type} max_file_upload (Maximum How many file is allow to upload)
 * @param {type} default_text (Default text to be shown)
 * @param {type} input_file_name (This is the name of the input file name. Using this name in server side we can get the $_FILES information)
 * @param {type} accepted_file (Which file it will accept. Ex: "image/", "audio/", or "video/*")
 * @param {type} invalid_file_msg (When invalid file will upload then display this message)
 * @param {type} show_remove_link (When select the file using brose button, show Remove link)
 * @returns {Boolean}
 */
function dragAndDrop(submit_btn_id,max_file_upload,default_text,input_file_name,accepted_file,invalid_file_msg,show_remove_link){
    
    if(typeof(submit_btn_id)==='undefined' || $('#'+submit_btn_id).length==0){
        return false;
    }
    
    if (typeof(max_file_upload)==='undefined') max_file_upload = 1;
    if (typeof(default_text)==='undefined') default_text ='Drag and drop a CSV file here to upload <br /> or <br /> Select a file';
    if (typeof(input_file_name)==='undefined') input_file_name ='file';
    if (typeof(accepted_file)==='undefined') accepted_file ='image/';
    if (typeof(invalid_file_msg)==='undefined') invalid_file_msg ='Kindly upload csv file only.';
    if (typeof(show_remove_link)==='undefined') show_remove_link =false;
    
    var response='';
	Dropzone.options.uploadFile = {
        // Prevents Dropzone from uploading dropped files immediately
        autoProcessQueue: false,
        maxFiles: max_file_upload,
        dictDefaultMessage:default_text,
        paramName:input_file_name,
        //acceptedFiles:accepted_file,
        dictInvalidFileType:invalid_file_msg,
        addRemoveLinks:show_remove_link,
        init: function() {
        var submitButton = document.querySelector("#"+submit_btn_id)
            myDropzone = this; // closure

        submitButton.addEventListener("click", function(file) {
          myDropzone.processQueue(); // Tell Dropzone to process all queued files.
        });

        // You might want to show the submit button only when
        // files are dropped here:
        this.on("addedfile", function(file) {
            $("#"+submit_btn_id).show();
          // Show submit button here and/or inform user to click it.
        });

        this.on("complete", function(response) {
            getDragAndDropServerResponse(response);         
        });
      }
    };
}

//get college list for selected environment
function getCollegeListByEnvironment(environment) 
{
    $('#copy2 span#copyFormPopupError').text('');
    var defaultEnv = '';
    if (typeof jsVars.environmentDefault != 'undefined') {
        defaultEnv = jsVars.environmentDefault;
    }
    //local & stage are same on local
//    if (((defaultEnv != 2) && (environment >= 0) && (defaultEnv != environment)) 
//            || ((defaultEnv == 2) && (environment != 1) && (environment >= 0) && (defaultEnv != environment))
//        )
    if ((defaultEnv.indexOf('local') == -1 && defaultEnv != environment) 
            || (defaultEnv.indexOf('local')>-1 && environment != 's8' && defaultEnv != environment)
        )
    {
        $('body div.loader-block').show();
        $.ajax({
            url: jsVars.getCollegeListByEnvironmentUrl,
            data: {fetch: 'colleges',environment:environment},
            dataType: "json",
            async: false,
            cache: false,
            type: "POST",
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            //contentType: "application/json; charset=utf-8",
            success: function (json) {
                
                $('body div.loader-block').hide();
                if (json['redirect']) {
                    location = json['redirect'];
                }
                else if(json['error']) {
                    alertPopup(json['error'],'error');
                }
                else if (json['success'] == 200) {
                    updateEnvironmentInstitute(json['data'], '');
                    changeCopyBtnAction(environment);
                }
            },
            error: function (response) {
                alertPopup(response.responseText);
            },
            failure: function (response) {
                alertPopup(response.responseText);
            }
        });
    }
    else {
        var data = [];
        var selectedCollege = '';
        if (typeof jsVars.jsCollegeList != 'undefined') {
            data = jsVars.jsCollegeList;
        }
        
        if ((typeof jsVars.localCollegeId != 'undefined') && (jsVars.localCollegeId > 0)) {
            selectedCollege = jsVars.localCollegeId;
        }
        
        updateEnvironmentInstitute(data, selectedCollege);
    }
}

/** Update college list on copy form popup**/
function updateEnvironmentInstitute(data, selectedCollege)
{
    var selectedHtml = '';
    var html = '<option value="">Select Institute</option>';
    for(var collegeId in data) {
        if(collegeId == selectedCollege) {
            selectedHtml = 'selected="selected"';
        }
        html += '<option value="' + collegeId + '" ' + selectedHtml + '>' + data[collegeId] + '</option>';
        selectedHtml = '';
    }
    $('#environmentCollegeList').html(html);
    $('#environmentCollegeList').trigger('chosen:updated');
}

/** Change Copy Form Popup next btn action on environment change**/
function callCopyFormConfirmPopup(environment,fromNew=0)
{
    var url = $("#copy2 input#formUrl").val();
    var id = parseInt($("#copy2 input#formId").val());
    var institute = parseInt($('#copy2 select#environmentCollegeList').val());
    
    if((id > 0) && (url != '') && (institute > 0)) {
                    
        var formTitle = $('#' + id + ' h3').text();
        //var collegeId = $('#' + id + ' input#college_id_' + id).val();
        var collegeList = jsVars.jsCollegeList;
        var instituteName = collegeList[institute];

        $('#ConfirmMsgBody').html('You are creating "'+ formTitle +'" under "'+ instituteName +'". Would you like to continue?');
        $("#ConfirmPopupArea a#confirmYes").attr("onclick", 'return CopyForm("' + url + '","'+fromNew+'");');
        $('#copy2').modal('hide');
        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
            e.preventDefault();
            callCopyFormAjax(url, environment, institute,fromNew);
        });
        
    }
    else {
        alertPopup('Unable to process request.Please try again', 'error');
    }
}

/** Validate & Save Copy Form Data**/
function callCopyFormAjax(url, environment, institute,fromNew=0)
{
    $('body div.loader-block').show();    
    $.ajax({
        url: jsVars.getFormCopyUrl,
        data: {form_data: url, environment:environment, institute:institute},
        dataType: "json",
        async: false,
        cache: false,
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        //contentType: "application/json; charset=utf-8",
        success: function (json) {
            $('body div.loader-block').hide();
            $('#ConfirmPopupArea').modal('hide');
            if (json['redirect']) {
                location = json['redirect'];
            }else if(json['error']){
                alertPopup(json['error'],'error');
            }
            else if (json['success'] == 200) {
                if(json['copyFormPopupError']) {
                    $('#copy2 span#copyFormPopupError').text(json['copyFormPopupError']);
                }
                else {
                    $("#copy2").modal('hide');
                    $('#ConfirmCopyFormPopUpTextArea').html('Your Form "' + json['form_name'] + '" has been copied.')
                    if(fromNew == 1){
                       $('#copyFormOk').attr('href', '/form/form-manager'); 
                    }else{
                      $('#copyFormOk').attr('href', json['reload']);  
                    }
                    
                    $("#copy").modal();
                }
            }

        },
        error: function (response) {
            alertPopup(response.responseText);
        },
        failure: function (response) {
            alertPopup(response.responseText);
        }
    });
}

//
if ($('#form_start_date_declared').length > 0)
{
    //chnage form start date decleared
    $(document).on('change','#form_start_date_declared',function(){
        var fsd = $("#form_start_date_declared").val();
        if(fsd==1){
            $("#formStartDateShow").show();
        }else{
            $("#formStartDateShow").hide();
        }
    });
}

//ivr click to call
//Move to webroot/js/college/custom.js
//function ClickToCall(collegeId,userId,formId,is_called){
//    
//    //jsVars.followUpLink
//    $.ajax({
//        url: '/counsellors/clickToCall',
//        type: 'post',
//        data: {'userId' : userId, 'collegeId':collegeId,'formId':formId},
//        dataType: 'json',
//        headers: {
//            "X-CSRF-Token": jsVars.csrfToken
//        },
//        beforeSend: function () {
//            $('#listloader').show();
//            $('body div.loader-block').show();
//        },
//        complete: function () {
//            $('#listloader').hide();
//            $('body div.loader-block').hide();
//        },
//        success: function (data) {
//            //console.log(data);
//            //console.log(jj);{"message":"Authentication failed.","status":"error"}
//            if(typeof data!=='undefined'){
//                var Resstatus = data.status;
//                var message = data.message;
//            }
//            if(typeof Resstatus!=='undefined' && Resstatus=='queued'){
//                $("#"+userId+'_'+collegeId+'_'+formId).trigger('click');
//                if($('.calling').length>0){
//                    $('.calling').show();
//                    setTimeout(function() {
//                        $('.calling').fadeOut('fast');
//                    }, 30000); // <-- 30 secound
//                    if($("#MakeEditable").length>0){
//                        var tabLocation = $('#MakeEditable').offset().top-120;
//                        $('html, body').animate({scrollTop: tabLocation}, 500);
//                    }
//                    $("#ozontellIfram").show();//show ifram
//                }
//                
//                if(typeof is_called !== 'undefined' && is_called=='1') {
//                    $('#is_called').val('1');
//                }
//            }else if(typeof message!='undefined'){
//                alertPopup(message,'error');
//            }else{
//                if(typeof data.redirect!='undefined'){
//                    location = data.redirect;
//                }else{
//                    alertPopup(data.error,'error');
//                }
//            }
//        },
//        error: function (xhr, ajaxOptions, thrownError) {
//            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
//        }
//    });
//}

//Career Utsav Click function
function getAreaOfInterestForList(callFrom,asyncCond)
{
    var checkboxChecked = 0;
    var data = [];
    if(typeof asyncCond == 'undefined'){
        asyncCond=true;
    }
    if(typeof callFrom == 'undefined'){
        callFrom = '';
        $('div.CareerUtsavId, div.CareerUtsavAreaId').find('span.help-block').text('');

        checkboxChecked = $('input[name=\'career_utsav_id[]\']:checked').length;
        data = $('input[name=\'career_utsav_id[]\']:checked').serializeArray();
    }
    else {        
        checkboxChecked = $('#CareerUtsavId').val().length;
        var valueSelect = $('#CareerUtsavId').val();
        data.push({name:'career_utsav_id',value:valueSelect});
        data.push({name:'fetch',value:'option'});
        //div.PreferenceProfile is on user-profile page
        $('div.PreferenceProfile').addClass('hide');
    }
    data.push({name:'fetchType',value:'applications'}); //used to fetch assigned career utsav area field to counsellor
    //alert(checkboxChecked);
    //alert(callFrom);
    if(checkboxChecked == 0) {
        //hide area of interest
        $('div.CareerUtsavAreaId').html('');
        $('div.SeminarPreferenceId, div.MockPreferenceId').addClass('hide');
        if(callFrom == 'lead') {
            $('select#CareerUtsavAreaId, select#SeminarPreferenceId, select#MockPreferenceId').html('');
            $('select#CareerUtsavAreaId')[0].sumo.reload();
            $('select#SeminarPreferenceId')[0].sumo.reload();
            $('select#MockPreferenceId')[0].sumo.reload();
        }
    }
    else if(checkboxChecked > 0) {
        $.ajax({
            url: jsVars.GetCareerAreaLink,
            type: 'post',
            dataType: 'json',
            data: data,
            async: asyncCond,
//            headers: {
//                "X-CSRF-Token": jsVars._csrfToken
//            },
            beforeSend: function() {
                    $('#register-now div.loader-block,#register-page div.loader-block').show();
            },
            complete: function() {
                    $('#register-now div.loader-block,#register-page div.loader-block').hide();
            },
            success: function (json) {
                if(json['redirect']){
                    location = json['redirect'];
                }
                else if(json['error']){
                    $('div.CareerUtsavId').find('span.help-block').text(json['error']);
                    $('div.CareerUtsavId').addClass('has-error');
                }
                else if(json['success']){
                    if(callFrom == '') {
                        $('div.CareerUtsavAreaId').html(json['careerUtsavArea']);
                        $('select#SeminarPreferenceId, select#MockPreferenceId, div#SchedulePreference').html('');
                        $('div.SeminarPreferenceId, div.MockPreferenceId, div#SchedulePreference').addClass('hide');
                    }
                    else {                        
                        $('select#CareerUtsavAreaId').html(json['careerUtsavArea']);
                        $('select#CareerUtsavAreaId')[0].sumo.reload();
                        $('select#SeminarPreferenceId, select#MockPreferenceId').html('');
                        $('select#SeminarPreferenceId')[0].sumo.reload();
                        $('select#MockPreferenceId')[0].sumo.reload();

                        if(callFrom == 'lead') {
                            $('select#CareerUtsavAreaId').on('change', function() {
                                getPreferenceList(callFrom,asyncCond);
                            });
                        }
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

//Career Utsav Area Click function
function getPreferenceList(callFrom,asyncCond)
{    
    var data = [];
    if(typeof asyncCond == 'undefined'){
        asyncCond=true;
    }
    if(typeof callFrom == 'undefined') {
        callFrom = '';        
        data = $('input[name=\'career_utsav_id[]\']:checked, input[name=\'career_utsav_area_id[]\']:checked').serializeArray();
        var valueSelectSeminar = $('select#SeminarPreferenceId').val();
        var valueSelectMock = $('#MockPreferenceId').val();
        data.push({name:'seminar_preference_id',value:valueSelectSeminar});
        data.push({name:'mock_preference_id',value:valueSelectMock});
        //remove error
        $('div.CareerUtsavAreaId').find('span.help-block').text('');
        $('div.SeminarPreferenceId, div.MockPreferenceId').removeClass('has-error').find('span.help-block').text('');
        $('select#SeminarPreferenceId, select#MockPreferenceId, div#SchedulePreference').html('');
        $('div.SeminarPreferenceId, div.MockPreferenceId, div#SchedulePreference').addClass('hide');
    }
    else {
        var valueSelect = $('#CareerUtsavId').val();
        var valueAreaSelect = $('#CareerUtsavAreaId').val();
        data.push({name:'career_utsav_id',value:valueSelect});
        data.push({name:'career_utsav_area_id',value:valueAreaSelect});
        var valueSelectSeminar = $('select#SeminarPreferenceId').val();
        var valueSelectMock = $('#MockPreferenceId').val();
        data.push({name:'seminar_preference_id',value:valueSelectSeminar});
        data.push({name:'mock_preference_id',value:valueSelectMock});
        data.push({name:'fetch',value:'option'});
        $('select#SeminarPreferenceId, select#MockPreferenceId').html('');
        $('select#SeminarPreferenceId')[0].sumo.reload();
        $('select#MockPreferenceId')[0].sumo.reload();
        $('div.PreferenceProfile').addClass('hide');
    }
    
    data.push({name:'fetchType',value:'applications'}); //used to filter out assigned fields to counsellor
    
    $.ajax({
        url: jsVars.GetAreaPreferenceLink,
        type: 'post',
        dataType: 'json',
        async: asyncCond,
        data: data,
//            headers: {
//                "X-CSRF-Token": jsVars._csrfToken
//            },
        beforeSend: function() {
                $('#register-now div.loader-block,#register-page div.loader-block').show();
        },
        complete: function() {
                $('#register-now div.loader-block,#register-page div.loader-block').hide();
        },
        success: function (json) {
            if(json['redirect']){
                location = json['redirect'];
            }
            if(json['error']) {
                for(var divId in json['error']) {
                    $('div.'+divId).find('span.help-block').text(json['error'][divId]);
                    $('div.'+divId).addClass('has-error');
                }
            }
            else if(json['success']){
                if(json['preferenceList']) {                    
                    for(var list in json['preferenceList']) {
                        //add seminar list
                        if(list == 'seminarList') {
                            $('select#SeminarPreferenceId').html(json['preferenceList'][list]);
                            $('select#SeminarPreferenceId')[0].sumo.reload();
                            if(callFrom == '') {
                                $('div.SeminarPreferenceId').removeClass('hide');
                            }
                            else if(callFrom == 'profile') {
                                $('div.PreferenceProfile').removeClass('hide');
                            }
                        }
                        
                        //add mock list
                        if(list == 'mockList') {
                            $('select#MockPreferenceId').html(json['preferenceList'][list]);
                            $('select#MockPreferenceId')[0].sumo.reload();
                            if(callFrom == '') {
                                $('div.MockPreferenceId').removeClass('hide');
                            }
                            else if(callFrom == 'profile') {
                                $('div.PreferenceProfile').removeClass('hide');
                            }
                        }
                        
                        //add schedule msg
                        if(list == 'displayMsg') {
                            if(callFrom == '') {
                                $('div#SchedulePreference').html(json['preferenceList'][list]);
                                $('div#SchedulePreference').removeClass('hide');
                            }
                        }
                    }
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
}

//Ozontel/Ameyo iFrame
jQuery(document).on('click',".iframeClick", function() {
    //alert('hello');
    //jQuery(this).hide();
    jQuery('.iframe-fixed').toggleClass('active');    
});

function showCounsellingText(id,title){
    var  text = $('#'+id).html();
    if(typeof title==="undefined" || title==null || title==''){
        title   = 'Counselling Information';
    }
    $('#ActivityLogPopupArea #alertTitle').html(title);
    $('#ActivityLogPopupHTMLSection').addClass('text-left');
    $('#ActivityLogPopupArea .modal-content').css({'width':'100%','padding-bottom':'20px'});
    $('#ActivityLogPopupArea .modal-body').css({'overflow-y':'auto','max-height':'400px'});
    $('#ActivityLogPopupArea .modal-dialog').css('width','900px');
    $('#ActivityLogPopupHTMLSection').html(text);
    
    $('#ActivityLogPopupHTMLSection').find('tr').each(function(){
//        $(this).removeAttr('style');
        $(this).css('display','block');
        $(this).show();
    });
    $('#ActivityLogPopupArea').modal('show');
    return;
}


function showFormInstructionText(id){
    var  text = $('div#'+id).html();
    $('#ActivityLogPopupArea #alertTitle').html('');
    $('#ActivityLogPopupHTMLSection').addClass('text-left');
    $('#ActivityLogPopupHTMLSection').html(text);
    $('#ActivityLogPopupArea').modal('show');
    return;
}

function pipeValidation(val='',field_id){
    var inputVal = val;
    $('#errorClear').remove();
    $('#removeWithPipe').text('');
    var sign = '||';
    var count = 0;
    for (var i=0;i< inputVal.length;i++) {
        if (sign === inputVal.substr(i,sign.length))
        count++;
    }
    if(count > 0){
        $('#'+field_id).after('<span class="error" id="errorClear">Name cannot have more than single pipe. Please enter name correctly.</span>');
        return false;
    }
    return true;
}

//used for unlayer normal tab and rich textbox tab while preview
function openTab(item,indexId,tabId) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabdata"+tabId);
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks"+tabId);
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(indexId).style.display = "block";
    item.classList.add("active")
}

function openRichTab(item,indexId,tabId) {
    var i, richtabcontent, richtablinks;
    richtabcontent = document.getElementsByClassName("richtabdata"+tabId);
    for (i = 0; i < richtabcontent.length; i++) {
        richtabcontent[i].style.display = "none";
    }
    richtablinks = document.getElementsByClassName("richtablinks"+tabId);
    for (i = 0; i < richtablinks.length; i++) {
        richtablinks[i].className = richtablinks[i].className.replace(" active", "");
    }
    document.getElementById(indexId).style.display = "block";
    item.classList.add("active")
}