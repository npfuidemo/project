/* 
 * Used for Anonymous User.
 */

//remove readonly from Student login/register/forgot password form input
$(window).load(function(){
    if (typeof runAutoLoadJs !== 'undefined' && $.isFunction(runAutoLoadJs)) {
       runAutoLoadJs();
    }
});

$(document).ready(function(){
//    console.log('autosave:'+jsVars.widgetAutoSave);
    if($('.msg_success').length)
    {
        $('.msg_success').show().delay(10000).fadeOut();
    }
    if($('[data-toggle="popover"]').length) {
        if (document.documentElement.clientWidth > 968) {
            $('[data-toggle="popover"]').popover({
                placement:'left'
            });
        }else{
            $('[data-toggle="popover"]').popover({
                placement:'top'
            });
        }
        
        
    }

    if( typeof jsVars.enable_ilearn!=="undefined" && jsVars.enable_ilearn==true){
        if( $("form#registerForm #registerBtn").length ){
            $("form#registerForm #registerBtn").attr('disabled','disabled');
        }
        if($("#Name").length){
            $("#Name").parents(".reg_name_div").hide();
        }
        if($("#Mobile").length){
            $("#Mobile").parents(".merge_field_div").hide();
        }
        $("#fetchProfileFromILearnLink").show();
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
    
    //hide image coming in SRM
    $("img[src*='//bat.bing.com/action/0']").css('display','none' );
    //only for desktop
//    if(typeof jsVars.isMobileDevice == 'undefined'){
//        //Student login form
//        $('#loginForm input[type=\'email\'],#loginForm input[type=\'password\']').attr('readonly','readonly');
//        $(document).on('focus','#loginForm input[type=\'email\'],#loginForm input[type=\'password\']',function(){
//            $(this).removeAttr('readonly');
//        });
//        //Student register form
//        $('#registerForm input[type=\'email\'],#registerForm input[type=\'password\'],#registerForm input[type=\'mobile\']').attr('readonly','readonly');
//        $(document).on('focus','#registerForm input[type=\'email\'],#registerForm input[type=\'password\'],#registerForm input[type=\'mobile\']',function(){
//            $(this).removeAttr('readonly');
//        });
//        //Student forgot password form
//        $('#forgotForm input[type=\'email\']').attr('readonly','readonly');
//        $(document).on('focus','#forgotForm input[type=\'email\']',function(){
//            $(this).removeAttr('readonly');
//        });
//    }
    //refresh page if success pop up is closed
    $(document).on('click', '#SuccessPopupArea button.npf-close,#SuccessPopupArea  a.npf-close', function (e){
        e.preventDefault();
        //setTimeout(function(){ window.location.href=window.location.href; }, 10000);
        window.location.href=window.location.href;

    });
    
    //Career Utsav Area of Interest
    $(document).on('change', 'input[name=\'career_utsav_id[]\']', function (){
        getAreaOfInterestForList();
    });
    //add sumo class on seminar/mock preference select
    if($('select#SeminarPreferenceId').length > 0) {
        $('select#SeminarPreferenceId').SumoSelect({placeholder: 'Seminar Preference Name', search: true, searchText:'Seminar Preference Name', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
    }
    
    if($('select#MockPreferenceId').length > 0) {
        $('select#MockPreferenceId').SumoSelect({placeholder: 'Mock Preference Name', search: true, searchText:'Mock Preference Name', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
    }

    $("#Password").keyup(function(){
        validateUsersPassword('Password');
    });
    $("#Password").focus(function(){
        validateUsersPassword('Password');
    });
    $("#forgot-new-password").keyup(function(){
        validateUsersPassword('forgot-new-password');
    });
    $("#forgot-new-password").focus(function(){
        validateUsersPassword('forgot-new-password');
    });
    loadCustomDateTime();
});


if(jsVars.VerifyStudent == 'verify')
{
    //console.log(jsVars);
    $("#VerifyLink").trigger('click');
    delete jsVars.VerifyStudent;                //unset VerifyStudent
}

if(jsVars.onlyCrmEnableConfirmation == 'verify')
{
    //console.log(Email Verified Successfully.);
    //$("div#ConfirmationMsgPopupArea").modal('show');
    $("div#ConfirmationMsgPopupArea").modal().css('display','block');
    delete jsVars.onlyCrmEnableConfirmation;                //unset VerifyStudent
}

if(typeof jsVars.SocialError != 'undefined')
{
    $("#RegisterSocialLink").trigger('click');
    delete jsVars.SocialError;                //unset VerifyStudent
}

//Login form submit function
var isVarLoginUser=false;
$(document).on('click', '#loginBtn', function () {
    $("form#loginForm span.help-block").text('');
    var _csrfToken = $("form#loginForm input[name='_csrfToken']").val();
    
    if(isVarLoginUser==true) { //check whether ajax hit is already calle. If already called then return from here
        return;
    }    
    isVarLoginUser=true; //If ajax hit is called then set this variable to true

    $.ajax({
        url: jsVars.LoginUrl,
        type: 'post',
        data: $("form#loginForm").serialize(),
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": _csrfToken
        },
        beforeSend: function() {
            $('#already-registered div.loader-block,#register-now div.loader-block').show();
        },
        complete: function() {
        $('#already-registered div.loader-block,#register-now div.loader-block').hide();
        },
        success: function (json) {
            isVarLoginUser=false;
            
            if (json['redirect'])
            {
                location = json['redirect'];
            }
            else if (json['error'])
            {
                if (json['error']['msg'])
                {
                    alertPopup(json['error']['msg'],'error');
                }
                else if (json['error']['list'])
                {
                    json['error']['list'] = changesOfFullBannerLayout('loginForm',json['error']['list']);
                    for (var i in json['error']['list'])
                    {
                        //if(json['error']['list'][i])
                        var id=i;
                        if(i=='Email'){
                            id = 'loginEmail';
                        }
                        if(i=='Password'){
                            id = 'loginPassword';
                        }
                        var parentDiv = $("form#loginForm #" + id).parents('div.form-group');
                        //alert(parentDiv.html());
                        $(parentDiv).addClass('has-error');
                        $(parentDiv).find("span.help-block").text('');
                        $(parentDiv).find("span.help-block").append(json['error']['list'][i]);
                    }
                }
            }
            else if (json['success'] == 200)
            {
                //Push data in Datalayer for LPU
                pushLoginDatainDatalayer();
                location = json['location'];
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#already-registered div.loader-block,#register-now div.loader-block').hide();
        }
    });
});

if(jsVars.ShowInstructionPopup != 'undefined'){
    //on click instruction continue button
    $(document).on('click', '#ContinueWithAgree, #ContinueAndRegister', function () {
        if(agreeConditions()){
            registerUser();
        }
    });    
}

//Error Message Behaviour Changes for Full Banner Layout
function changesOfFullBannerLayout(Form,errorList)
{
    if((typeof jsVars.FullBannerLayoutEnabled !== 'undefined') || (typeof jsVars.isCustomTheme !== 'undefined')){
//        $('#'+Form).each()
        //code for register form
        for(var id in errorList){
            if($('#'+Form+' #'+id).val()==''){
                errorList[id] = '';
            }
        }
    }
    return errorList;
}

//Validate Student Register Form Data
function checkStudentRegisterValidation()
{
    $("span.help-block").text('');
    var _csrfToken = $("form#registerForm input[name=\'_csrfToken\']").val();

    $.ajax({
        url: jsVars.RegisterValidationCheck,
        type: 'post',
        data: $("form#registerForm").serialize(),
        dataType: 'json',
        headers: {
            "X-CSRF-Token": _csrfToken
        },
        beforeSend: function() {
            $('#register-now div.loader-block').show();
                $('#register-page div.loader-block').show();
        },
        complete: function() {
        $('#register-now div.loader-block').hide();
                $('#register-page div.loader-block').hide();
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
                    alertPopup(json['error']['msg'],'error');
                }
                else if (json['error']['list'])
                {
                    if (json['error']['list']['missing']) {
                        alertPopup(json['error']['list']['missing'],'error');
                    }
                    else {
                        json['error']['list'] = changesOfFullBannerLayout('registerForm',json['error']['list']);
                        for (var i in json['error']['list'])
                        {
                            if(i == 'CareerUtsavId') {
                                var parentDiv = $("form#registerForm input[name=\'career_utsav_id[]\']").parents('div.form-group');
                            }
                            else {
                                var parentDiv = $("form#registerForm #" + i).parents('div.form-group');
                            }
                            
                            $(parentDiv).addClass('has-error');
                            $(parentDiv).find("span.help-block").html(json['error']['list'][i]);
                            if(i == 'Captcha')
                            {
                                if(typeof json['error']['list']['captchField'] !=="undefined"){
                                    $("#"+json['error']['list']['captchField']).trigger('click');                 //to reset captcha
                                }else{
                                    $("#CaptchaRefreshBtn").trigger('click');                 //to reset captcha
                                }
                            }
                        }
                    }
                }
            }
            else if (json['success'] == 200)
            {
                if(json['AnalyticsCodeSlug'])
                {
                    hitC360AnalyticsCode(json['AnalyticsCodeSlug'],json['AnalyticsCodeAction'],json['GAName'],json['NPFAnalyticsCodeAction']);
                }
                var append_html="";
                //commented on 1/04/2017, Case: trigger on succcess,Change By: Surya Singh    
//                if((typeof jsVars.trigger_collegedunia != 'undefined') && json['register_continue_collegedunia_pixel']){
//                    append_html=json['register_continue_collegedunia_pixel'];
//                }
                //console.log(append_html);
                $('#college-instruction').append(append_html);
                $("#hit_popup_instructions").trigger('click');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#register-now div.loader-block,#register-page div.loader-block').hide();
        }
    });
}

function agreeConditions()
{
    var Parent = $('#InstructionAgree').parents('div.agree-group');
    $(Parent).removeClass('has-error');
    $(Parent).find('span.help-block').text('');
    if($('#InstructionAgree').is(':checked')){
        $('#InstructionAgree').trigger('click');
        $('#college-instruction').modal('hide');
        $('#RegisterPopupOpenBtn').trigger('click');
        return true;
    }
    else{
        $(Parent).addClass('has-error');
        $(Parent).find('span.help-block').text('Please select the checkbox to continue.');
        return false;
    }
}

//Registration form submit function
$(document).on('click', '#registerBtn', function () { 
    registerUser();
});

var isVarRegisterUser = false;
var userRegistered = false;
function registerUser()
{    
    $("form#registerForm #registerBtn").attr('disabled','disabled');
    $('form#registerForm #registerBtn').css('pointer-events','none');
    // console.log('registerUser',registerUser);
    $("span.help-block").text('');
    var _csrfToken = $("form#registerForm input[name=\'_csrfToken\']").val();
    var widgetId = $("form#registerForm input[name='widgetId']").val();
    if(isVarRegisterUser == true) { //check whether ajax hit is already called. If already called then return from here
        return;
    }    
    if(runConditionalJs()){
        return false;
    }
    isVarRegisterUser = true; //If ajax hit is called then set this variable to true
    $.ajax({
        url: jsVars.RegisterUrl,
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        data: new FormData($('form#registerForm')[0]),
        dataType: 'json',
        processData: false,
        contentType: false,
        async: false,
        headers: {
            "X-CSRF-Token": _csrfToken
        },
        beforeSend: function() {                
            $('#register-now div.loader-block').show();
                $('#register-page div.loader-block').show();
                
                //Disable the register Button
                $("form#registerForm #registerBtn").attr('disabled','disabled');
                $('form#registerForm #registerBtn').css('pointer-events','none');
    },
        complete: function() {
        $('#register-now div.loader-block').hide();
                $('#register-page div.loader-block').hide();
                
                //Remove disabled
                
        },
        success: function (json) {
            //console.log(json);
            isVarRegisterUser = false;
            if (json['redirect'])
            {
                location = json['redirect'];
            }
            else if (json['error'])
            {
                if (json['error']['msg'])
                {
                    alertPopup(json['error']['msg'],'error');
                }
                else if (json['error']['list'])
                {
                    if (json['error']['list']['missing']) {
                        alertPopup(json['error']['list']['missing'],'error');
                    }
                    else {
                        json['error']['list'] = changesOfFullBannerLayout('registerForm',json['error']['list']);
                        var html_error = '<div style="text-align:left">';

                        for (var i in json['error']['list'])
                        {
                            if(i == 'captchField') {
                                continue;
                            }
                            if(typeof jsVars.register_error !='undefined' && jsVars.register_error=='popup'){
                                html_error += json['error']['list'][i]+'<br>';
                            }else{

                                if(i == 'CareerUtsavId') {
                                    var parentDiv = $("form#registerForm input[name=\'career_utsav_id[]\']").parents('div.form-group');
                                }else if(i == 'Captcha' && typeof json['error']['list']['captchField'] !=="undefined") {
                                    var parentDiv = $("form#registerForm #" + json['error']['list']['captchField']).parents('div.form-group');
                                }
                                else {
                                    var parentDiv = $("form#registerForm #" + i).parents('div.form-group');
                                }

                                $(parentDiv).addClass('has-error');
                                $(parentDiv).find("span.help-block").html(json['error']['list'][i]);
                                if(i == 'Captcha')
                                {
                                    if(typeof json['error']['list']['captchField'] !=="undefined"){
                                        $("#"+json['error']['list']['captchField']+'Btn').trigger('click');                 //to reset captcha
                                    }else{
                                        $("#CaptchaRefreshBtn").trigger('click');                 //to reset captcha
                                    }
                                }                            
                            }
                        }
                        if(json['entry_flag']!=1)
                        {
                             //Remove disabled
                            $("form#registerForm #registerBtn").removeAttr('disabled');
                            $('form#registerForm #registerBtn').css('pointer-events','auto');
                        }
                        if(typeof $('#opt_dataMobile')!=='undefined' && $('#opt_dataMobile').val()==''){
                            $('#otpunverifiedMobile').show();
                        }



                        html_error +='</div>';
                        if(typeof jsVars.register_error !='undefined' && jsVars.register_error=='popup'){
                            alertPopup(html_error,'error');
                        }
                    }
                }
            }
            else if (json['success'] == 200)
            {
                var redirect_external = false;
                var redirect_external_delay = false;
                var redirect_external_url = '';
                var delay_time_external = 0;
                if(typeof json['thankyou_type'] !== 'undefined' && parseInt(json['thankyou_type'])==1 && parseInt(json['thankyou_redirect_delay'])==0){
                    redirect_external = true;
                    redirect_external_url = json['thankyou_external_url'];
                }else if(parseInt(json['thankyou_redirect_delay'])>0){
                    redirect_external = false;
                    redirect_external_delay = true;
                    redirect_external_url = json['thankyou_external_url'];
                    delay_time_external = parseInt(json['thankyou_redirect_delay']);
                }
                userRegistered = true;
                //Push data in Datalayer for LPU
                var mobileNo = $(document).find('#Mobile').val();
                var utmSource ='';
                var utmMedium ='';
                var utmName ='';
                var currentUrl ='';
                var widgetName ='';
                var hostName = '';
                if('lpuDataLayer' in json && json["lpuDataLayer"]){
                    var lpuDataLayer = json["lpuDataLayer"];
                    if ('utm_source' in lpuDataLayer && lpuDataLayer['utm_source']){
                        utmSource  = lpuDataLayer['utm_source'];
                    }
                    if ('utm_medium' in lpuDataLayer && lpuDataLayer['utm_medium']){
                        utmMedium  = lpuDataLayer['utm_medium'];
                    }
                    if ('utm_name' in lpuDataLayer && lpuDataLayer['utm_name']){
                        utmName  = lpuDataLayer['utm_name'];
                    }
                    if ('current_url' in lpuDataLayer && lpuDataLayer['current_url']){
                        currentUrl = lpuDataLayer['current_url'];
                    }
                    if ('widget_name' in lpuDataLayer && lpuDataLayer['widget_name']){
                        widgetName = lpuDataLayer['widget_name'];
                    }
                    if ('host_name' in lpuDataLayer && lpuDataLayer['host_name']){
                        hostName = lpuDataLayer['host_name'];
                    }
                }
                
                pushRegisterDatainDatalayer(mobileNo,utmSource,utmMedium,utmName,currentUrl,widgetName,hostName);
                if('registrationDataLayerData' in json && json["registrationDataLayerData"]){
                    registrationDataLayerData(json["registrationDataLayerData"]);
                }
                if(typeof npfGtmTagCodeOnRegSuccess === "function"){
                    npfGtmTagCodeOnRegSuccess();
                }
                if(json['AnalyticsCodeSlug'])
                {
                    hitC360AnalyticsCode(json['AnalyticsCodeSlug'],json['AnalyticsCodeAction'],json['GAName'],json['NPFAnalyticsCodeAction']);
                }
                
                if (json['location'])
                {
                    location = json['location'];
                }
                else
                {
                    $('form#registerForm #Agree').val('1');
                    $('form#registerForm [type="hidden"][name="Agree"]').val('0');
                    $("span.help-block").text('');
                    $("div.form-group").removeClass('has-error');

                    if(jsVars.auto_trigger!="false")$(".npf-close").trigger('click');
                    var append_html="";
                    //Added on: 1/04/2017,Case: trigger on succcess,Change By: Surya Singh   
                    if((typeof jsVars.trigger_collegedunia != 'undefined') && json['register_continue_collegedunia_pixel']){
                        append_html = json['register_continue_collegedunia_pixel'];
                    }
                    if(!redirect_external){
                        if(typeof json['msgPosition'] !== 'undefined'){
                            if(typeof json['passDataDecoded']==="undefined"){
                                json['passDataDecoded'] = [];
                            }
                            hitOnWidgetThanyou(json['passDataDecoded']);
                            if(widgetId != jsVars.lpu_sso_widgetId && typeof json['parentRedirectURL']==="string" && json['parentRedirectURL']!==""){
                                window.parent.location= json['parentRedirectURL'];
                            }else{
                                $("div.widget_thankyou_msg").hide();
                                if(json['msgPosition']=="after_heading"){
                                    $("div.after_heading").html(json['msg']);
                                    $("div.after_heading").fadeIn();   
                                    if(redirect_external_delay && redirect_external_url!=''){
                                        setTimeout(function(){
                                            window.top.location.href = redirect_external_url;
                                        },parseInt(delay_time_external*1000));
                                    } 
                                }else if(json['msgPosition']=="above_button"){
                                    $("div.above_button").html(json['msg']);
                                    $("div.above_button").fadeIn();    
                                    if(redirect_external_delay && redirect_external_url!=''){
                                        setTimeout(function(){
                                            window.top.location.href = redirect_external_url;
                                        },parseInt(delay_time_external*1000));
                                    }
                                }else if(json['msgPosition']=="new_page"){
                                    var hash  = '';
                                    if(typeof json.passData!='undefined'){
                                        hash = json.passData;
                                    }
                                    var cid='';
                                    if(typeof json.cid!='undefined'){
                                        cid = json.cid;
                                    }
                                    window.location.href = '/thankyou?cid='+cid+'&w='+hash;
                                }else{
                                    $("div.next_page").html(json['msg']);
                                    $("div.widget_container").fadeOut();
                                    $("div.next_page").fadeIn();
                                    if(redirect_external_delay && redirect_external_url!=''){
                                        setTimeout(function(){
                                            window.top.location.href = redirect_external_url;
                                        },parseInt(delay_time_external*1000));
                                    }
                                }
                            }
                        }else{
                            $("#SuccessPopupArea .modal-title").html("Thank you for registration" + append_html);
                            $("#SuccessPopupArea p#MsgBody").text('');
                            $("#SuccessPopupArea p#MsgBody").append(json['msg']);
                            $("#SuccessLink").trigger('click');
                            if(json['triggerDataLayer']){
                                hitOnRegisterSuccessPopup();
                            }
                        }
                    }else if(redirect_external && redirect_external_url.length>0){
                        // console.log('redirect_external_url:',redirect_external_url);
                        hitOnWidgetThanyou(json['passDataDecoded']);
                        // console.log('Redirecting:',redirect_external_url);
                        // window.open(redirect_external_url, "_blank");
                        window.top.location.href = redirect_external_url;
                    }
                    //Added on: 16/04/2019 Case: For LPU SSO Data
                    if(widgetId == jsVars.lpu_sso_widgetId && typeof json['parentRedirectURLNewTab']==="string" && json['parentRedirectURLNewTab']!=="") { 
                        window.open(json.parentRedirectURLNewTab, "_blank");
                    }
                    $("form#registerForm #registerBtn").removeAttr('disabled');
                    $('form#registerForm #registerBtn').css('pointer-events','auto');
                }
                
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#register-now div.loader-block').hide();
            isVarRegisterUser = false;
        }
    });
}

//for mobile user registration
if(typeof jsVars.AnalyticsCodeSlug != 'undefined')
{
    var CodeSlug = jsVars.AnalyticsCodeSlug;
    var CodeAction = jsVars.AnalyticsCodeAction;
    var NPFCodeAction = jsVars.NPFAnalyticsCodeAction;
    var GAName = jsVars.GAName;
    //alert(CodeSlug);
    hitC360AnalyticsCode(CodeSlug,CodeAction,GAName,NPFCodeAction);
    redirectPageOnMobile();
    //console.log(jsVars.RedirectAfterAnalyticsCodeSlug);
}

function redirectPageOnMobile()
{
    if(typeof jsVars.RedirectAfterAnalyticsCodeSlug != 'undefined')
    {
        location = jsVars.RedirectAfterAnalyticsCodeSlug;
    }
}

//should be used for All Colleges
function hitC360AnalyticsCode(Slug,Action,GAName,NPFCodeAction)
{
    if(Slug !== '')
    {
        dataLayer.push({'event': 'GAevent', 'eventCategory': 'Register', 'eventAction':NPFCodeAction,'eventLabel': Slug});
//        ga('send', {'hitType': 'event', 'eventCategory': 'Register', 'eventAction': NPFCodeAction, 'eventLabel': Slug});
//        if(GAName !== '') {    
//            ga(GAName+'.send', {'hitType': 'event', 'eventCategory': 'Register', 'eventAction': Action, 'eventLabel': Slug});
//        }
    }
}

//hit on Register Success Popup
function hitOnRegisterSuccessPopup()
{
    //dataLayer.push({'popuptrigger': 'register_success_popup'});
    dataLayer.push({'event':'registerpopup'});
}

//hit on Register Success Popup
function hitOnWidgetThanyou(thankYouPassData)
{
    var dataLayerData   = {
        'event':'widgetthankyou',
       'transactionId': '',
       'transactionTotal': 0,
        'pInstanceDate' :0,
        'oInstanceDate':0,
        'countryName' :0
    };
    if(typeof thankYouPassData['user_id'] !=="undefined"){
        dataLayerData['transactionId']  = thankYouPassData['user_id'];
    }
    if(typeof thankYouPassData['final_register_date'] !=="undefined"){
        dataLayerData['pInstanceDate']  = thankYouPassData['final_register_date'];
    }
    if(typeof thankYouPassData['other_instance_date'] !=="undefined"){
        dataLayerData['oInstanceDate']  = thankYouPassData['other_instance_date'];
    }
    if(typeof thankYouPassData['user_id'] !=="undefined"){
        dataLayerData['transactionId']  = thankYouPassData['user_id'];
    }
    var transactionProduct  = {'name':'','sku':'','category':''};
    if(typeof thankYouPassData['name'] !=="undefined"){
        transactionProduct['name']  = thankYouPassData['name'];
    }
    if(typeof thankYouPassData['email'] !=="undefined"){
        transactionProduct['name']  += "_"+thankYouPassData['email'];
    }
    if(typeof thankYouPassData['mobile'] !=="undefined"){
        transactionProduct['sku']  = thankYouPassData['mobile'];
    }
    if(typeof thankYouPassData['coursename'] !=="undefined"){
        transactionProduct['category']  = thankYouPassData['coursename'];
    }
    if(typeof thankYouPassData['state'] !=="undefined"){
        transactionProduct['category']  += "_"+thankYouPassData['state'];
    }
    if(typeof thankYouPassData['city'] !=="undefined"){
        transactionProduct['category']  += "_"+thankYouPassData['city'];
    }
    if(typeof thankYouPassData['countryName'] !=="undefined"){
        dataLayerData['countryName']  = thankYouPassData['countryName'];
    }
    dataLayerData['transactionProducts']    = [transactionProduct];
    console.log(dataLayerData);
    dataLayer.push(dataLayerData);
}

//Resend verification mail function on login
function sendVerificationEmail(UniqueKey)
{
    var data = {action:'mail',key:UniqueKey};
    triggerVerficationMail(data);
}

//Resend mail Function
function resendMail(uuid)
{
    var userUuid = '';
    if(typeof uuid != 'undefined'){
        userUuid = uuid;
    }
    var data = {action:'mail', key: userUuid};    
    triggerVerficationMail(data);
}

//function is used to send verification email
function triggerVerficationMail(data)
{
    var change_email = false;
    var _csrfToken;     //csrf token constant
    if($("form#loginForm").length > 0){
        _csrfToken = $("form#loginForm input[name=\'_csrfToken\']").val();
    }else if($("form#registerForm").length > 0){
        _csrfToken = $("form#registerForm input[name=\'_csrfToken\']").val();
    } else if($("form#forgotForm").length > 0){
        _csrfToken = $("form#forgotForm input[name=\'_csrfToken\']").val();
    } else if($("form#ProfileForm").length > 0){
        _csrfToken = $("form#ProfileForm input[name=\'_csrfToken\']").val();
    } else if($("form#chnageEmailId").length > 0){
        _csrfToken = $("form#chnageEmailId input[name=\'_csrfToken\']").val();
        change_email = true;
    } else if(typeof jsVars._csrfToken != 'undefined'){
         _csrfToken = jsVars._csrfToken;
    }
    
    $.ajax({
        url: jsVars.ResendMailUrl,
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": _csrfToken
        },
        beforeSend: function() {
            $('div.loader-block').show();
    },
        complete: function() {
        $('div.loader-block').hide();
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
                    alertPopup(json['error']['msg'],'error');
                }                
            }
            else if (json['success'] == 200)
            {     
                if((typeof jsVars.auto_trigger != 'undefined') && (jsVars.auto_trigger!="false")){
                    $(".npf-close").trigger('click');   //close pre open popups
                }
                else {  //close all popups
                    $('div#register-now').modal('hide');
                }
                
                if(typeof change_email!='undefined' && change_email==true){
                    $("#SuccessPopupArea .modal-title").text("Login Credentials Sent.");
                }else if(typeof json['messageType'] !== 'undefined' && $.trim(json['messageType']) !== ''){
                    if(json['messageType'] == 'error') {
                        $("#SuccessPopupArea .modal-title").text("Error");
                    }else if(json['messageType'] == 'verification') {
                        $("#SuccessPopupArea .modal-title").text("Verification Credentials Sent");
                    }else if(json['messageType'] == 'credential') {
                        $("#SuccessPopupArea .modal-title").text("Login Credentials Sent");
                    }                    
                } else {
                    $("#SuccessPopupArea .modal-title").text("Thank you for registration");
                }
                $("#SuccessPopupArea p#MsgBody").text('');
                $("#SuccessPopupArea p#MsgBody").append(json['msg']);
                $("#SuccessLink").trigger('click');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
        }
    });
}

//Forgot password form submit function
var isVarForgotUser=false;
$(document).on('click', '#forgotBtn', function () {
    $("span.help-block").text('');
    var _csrfToken = $("form#forgotForm input[name='_csrfToken']").val();
    
    if(isVarForgotUser==true) { //check whether ajax hit is already called. If already called then return from here
        return;
    }    
    isVarForgotUser=true; //If ajax hit is called then set this variable to true

    $.ajax({
        url: jsVars.ForgotPasswordUrl,
        type: 'post',
        data: $("form#forgotForm").serialize(),
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": _csrfToken
        },
        beforeSend: function() {
            $('#forget-password div.loader-block,#register-now div.loader-block').show();
                $(this).attr('disabled',true);
    },
        complete: function() {
        $('#forget-password div.loader-block,#register-now div.loader-block').hide();
                $(this).attr('disabled',false);
        },
        success: function (json) {
            isVarForgotUser=false;
            if (json['redirect'])
            {
                location = json['redirect'];
            }
            else if (json['error'])
            {
                if (json['error']['msg'])
                {
                    alertPopup(json['error']['msg'],'error');
                }
                else if (json['error']['list'])
                {
                    json['error']['list'] = changesOfFullBannerLayout('forgotForm',json['error']['list']);
                    for (var i in json['error']['list']) {
                        var id = i;
                        if(i=='Email') {
                            id = 'forgetEmail';
                        }
                        var parentDiv = $("form#forgotForm #" + id).parents('div.form-group');
                        $(parentDiv).addClass('has-error');
                        $(parentDiv).find("span.help-block").text('');
                        $(parentDiv).find("span.help-block").append(json['error']['list'][i]);
                    }
                }
            }
            else if (json['success'] == 200)
            {         
                if (json['location'])
                {
                    location = json['location'];
                }
                else
                {
                    $("#ForgotOtpTabContainer").show();
                    if($("#ForgotTabContainer").length>0){
                        $("#ForgotTabContainer").hide();
                    }
                    if($("#forgot_pwd_form_without_popup").length>0){
                        $("#forgot_pwd_form_without_popup").hide();
                    }
                    $("#forgotOtpBtn").hide();
                    $("#hashValue").val(json['hash']);
//                    $("span.help-block").text('');
//                    $("div.form-group").removeClass('has-error');
//                    $("#forget-password .npf-close").trigger('click');
//                    $("#SuccessPopupArea .modal-title").text("Reset Password Link Sent");
//                    $("#SuccessPopupArea p#MsgBody").text(json['msg']);
//                    $("#SuccessLink").trigger('click');
                        countdownStartFOrget();
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#forget-password div.loader-block,#register-now div.loader-block').hide();
        }
    });
});

jQuery(function(){
    $('form#registerForm #Agree').val('1'); 
    $('form#registerForm [type="hidden"][name="Agree"]').val('0');
    
    $('form#registerForm #Agree').click(function(){
        if($(this).is(':checked')){
            $('form#registerForm #Agree').val('1'); 
            $('form#registerForm [type="hidden"][name="Agree"]').val('0');
            $(this).attr('checked','checked');
            $(this).attr('checked',true);
        }else{
            $(this).removeAttr('checked');
        }
    });
    
    //add class has-error on mouseover/mouseout on element of checkbox
    $('#registerForm div.checkbox label, #registerForm  div.checkbox span').on('mouseover',function(){
        $(this).closest('div.agree-group').addClass('has-error');
    });
    
    $('#registerForm div.checkbox label, #registerForm  div.checkbox span').on('mouseout',function(){ 
        $(this).closest('div.agree-group').addClass('has-error');
    });
    
});

var preCurrentRequest = null;

function validateMobileLength(Mobile)
{
    var checkWithCountryDialCode = false;
    var countryDialCodeValue = '+91';
    if ($("form#registerForm #country_dial_codeMobile").length > 0){
        checkWithCountryDialCode = true;
        countryDialCodeValue = $("form#registerForm #country_dial_codeMobile").val();
    }
    
    //check with country dial code
    if (checkWithCountryDialCode == true) {
        //check for india
        if ((countryDialCodeValue == '+91') && (Mobile.length == 10)) {
            return true;
        }
        else if ((countryDialCodeValue != '+91') && (Mobile.length >= 6) && (Mobile.length <= 16)) {
            return true;
        }
    }
    else if (Mobile.length == 10) {
        return true;
    }
    return false;
}


function populatePredefinedValues(machineKey,emptyOption,defaultOption,fieldId){
    var college_id_md = 0;
    if(typeof jsVars.college_id !='undefined' && jsVars.college_id != null){
        college_id_md = jsVars.college_id;
    }
    var options = '<option value="">'+emptyOption+'</option>';    
    $('#'+fieldId).html(options);
    if( typeof machineKey !=="undefined" && machineKey!=='' && machineKey!==null){
        $.ajax({
            url: jsVars.getTaxonomyChildListLink,
            type: 'post',
            data: {parentKey:machineKey,"college_id":college_id_md},
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars.csrfToken
            },
            beforeSend: function () { 
                $('#register-now div.loader-block,#register-page div.loader-block').show();
            },
            complete: function () {
                $('#register-now div.loader-block,#register-page div.loader-block').hide();
            },
            success: function (response) {            
                var responseObject = $.parseJSON(response);
                if(responseObject.status==1){
                    if(typeof responseObject.data === "object"){
                        var options = '<option value="">'+emptyOption+'</option>';
                        $.each(responseObject.data, function (index, item) {
                            if(index==defaultOption){
                                options += '<option value="'+index+'" selected >'+item+'</option>';
                            }else{
                                options += '<option value="'+index+'">'+item+'</option>';
                            }
                        });
                        $('#'+fieldId).html(options);
                    }
                }else{
                    if (responseObject.message === 'session'){
                        location = jsVars.FULL_URL;
                    }else{
                        alertPopup(responseObject.message,'error');
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

function GetChildByMachineKey(key,ContainerId){
    if(typeof ContainerId !== "undefined" && $("#"+ContainerId).length){
        $("#"+ContainerId+' option[value!=""]').remove();
        
        //Blank All dropdown Value of Dependent Field
        var getLastValue = 0;
        if(typeof jsVars.dependentDropdownFieldList !== 'undefined') {
            $(jsVars.dependentDropdownFieldList).each(function(key,fieldId){
                
                //if getLastValue > 0 then return from here
                if(getLastValue >0) {
                    return false;
                }
                var isFieldFound = 0;
                $.each(fieldId, function(childKey,childFieldId){
                    
                    //if field match then increase the counter and store the increament value into getLastValue variable
                    if(childFieldId == ContainerId) {
                        isFieldFound++;
                        getLastValue = isFieldFound;
                    }                    
                    if(isFieldFound > 0) {
                        
                        if($('#'+childFieldId).length) {
                            var defaultOption ='<option value="">'+$("#"+childFieldId).data('label')+'</option>';
                            if($('#'+childFieldId).hasClass( "sumo-select" )) {
                                $("#"+childFieldId).find('option[value!=""]').remove();
                                $("#"+childFieldId+".sumo-select")[0].sumo.reload();
                            } else {
                                $("#"+childFieldId).html(defaultOption);
                                
                                if($("#"+childFieldId+'_chosen').length) {
                                    $('.chosen-select').chosen();
                                    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                                    $('.chosen-select').trigger('chosen:updated');
                                }
                            }
                            if($('#'+childFieldId).hasClass( "selectpicker" )) {
                                $('.selectpicker').selectpicker('refresh');
                            }
                        }
                    }
                });
                
            });
        }
        

        var haveChosenClass = false;
        var haveSelectPicker = false;
        $("#"+ContainerId).find('option[value!=""]').remove();
        if(ContainerId == 'StateId'){
            if($('#DistrictId').length > 0){
                if ($('#DistrictId.chosen-select').length > 0) {
                    haveChosenClass = true;
                }
                $("#DistrictId").find('option[value!=""]').remove();
                if ($("#DistrictId.sumo-select").length > 0){
                    $("#DistrictId.sumo-select")[0].sumo.reload();
                }
                if ($('#DistrictId.selectpicker').length > 0) {
                    haveSelectPicker = true;
                }
            }
            if($('#CityId').length > 0){
                if ($('#CityId.chosen-select').length > 0) {
                    haveChosenClass = true;
                }
                $("#CityId").find('option[value!=""]').remove();
                if ($("#CityId.sumo-select").length > 0){
                    $("#CityId.sumo-select")[0].sumo.reload();
                }
                if ($('#CityId.selectpicker').length > 0) {
                    haveSelectPicker = true;
                }
            }
        }
        if(ContainerId == 'DistrictId'){
            if($('#CityId').length > 0){
                if ($('#CityId.chosen-select').length > 0) {
                    haveChosenClass = true;
                }
                $("#CityId").find('option[value!=""]').remove();
                if ($("#CityId.sumo-select").length > 0){
                    $("#CityId.sumo-select")[0].sumo.reload();
                }
                if ($('#CityId.selectpicker').length > 0) {
                    haveSelectPicker = true;
                }
            }
        }


        //prevent chosen update for mobile profile page
        if (!haveChosenClass && ($('#'+ContainerId+'.chosen-select').length > 0)) {
            haveChosenClass = true;
        }
        if (!haveSelectPicker && ($('#'+ContainerId+'.selectpicker').length > 0)) {
            haveSelectPicker = true;
        }
        
        if (haveChosenClass && ($('.chosen-select').length > 0)) {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
            $('.chosen-select').trigger('chosen:updated');
        }
        if (haveSelectPicker && ($('.selectpicker').length > 0)) {
            $('.selectpicker').selectpicker('refresh');
        }
        
        if ($('.sumo-select').length > 0){
            if ($("#"+ContainerId+".sumo-select").length > 0){
                $("#"+ContainerId+".sumo-select")[0].sumo.reload();
            }
        }
        if(typeof key !== "undefined" && key !== '')
        {
            var currentFieldName = '';
            if(typeof $('#'+ContainerId).attr('name') !== 'undefined' && $('#'+ContainerId).attr('name') !== '') {
                currentFieldName = $('#'+ContainerId).attr('name');
            }
            
            var postData    = {key:key,'ContainerId':ContainerId, 'fieldName' : currentFieldName};
            if($("#collegeId").length){
                postData['college_id']  = $("#collegeId").val()
            }
            if(ContainerId == 'DistrictId'){
                postData['includeDistricts']  = "1"
            }
            
            if(typeof jsVars.widgetId!='undefined' && jsVars.widgetId!=''){
                postData['widgetId'] = jsVars.widgetId;
            }
            
            var cf = 'lm-user-profile';
            postData['cf'] = cf;
            
            
            $.ajax({
                url: jsVars.GetTaxonomyLink,
                type: 'post',
                dataType: 'json',
                data: postData,
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
                        if(typeof $("#"+ContainerId).data('label') !== 'undefined'){
                            var defaultOption ='<option value="">'+$("#"+ContainerId).data('label')+'</option>';
                            $("#"+ContainerId).html(defaultOption+html);
                        } else {
                            $("#"+ContainerId).append(html);
                        }
                        
                        if(ContainerId == 'StateId'){
                            $('#StateId').attr('disabled','false');
                            $('#StateId').removeAttr('disabled');
                            if($('#DistrictId').length > 0){
                                if ($('#DistrictId.chosen-select').length > 0) {
                                    haveChosenClass = true;
                                }
                                $("#DistrictId").find('option[value!=""]').remove();
                                if ($("#DistrictId.sumo-select").length > 0){
                                    $("#DistrictId.sumo-select")[0].sumo.reload();
                                }
                                if ($('#DistrictId.selectpicker').length > 0) {
                                    haveSelectPicker = true;
                                }
                            }
                            if($('#CityId').length > 0){
                                if ($('#CityId.chosen-select').length > 0) {
                                    haveChosenClass = true;
                                }
                                $("#CityId").find('option[value!=""]').remove();
                                if ($("#CityId.sumo-select").length > 0){
                                    $("#CityId.sumo-select")[0].sumo.reload();
                                }
                                if ($('#CityId.selectpicker').length > 0) {
                                    haveSelectPicker = true;
                                }
                            }
                        }
                        if(ContainerId == 'DistrictId'){
                            $('#DistrictId').attr('disabled','false');
                            $('#DistrictId').removeAttr('disabled');

                            if($('#CityId').length > 0){
                                if ($('#CityId.chosen-select').length > 0) {
                                    haveChosenClass = true;
                                }
                                $("#CityId").find('option[value!=""]').remove();
                                if ($("#CityId.sumo-select").length > 0){
                                    $("#CityId.sumo-select")[0].sumo.reload();
                                }
                                if ($('#CityId.selectpicker').length > 0) {
                                    haveSelectPicker = true;
                                }
                            }
                        }
                        if((ContainerId == 'CityId') && ($('#CityId').length > 0)){
                            if ($('#CityId.chosen-select').length > 0) {
                                haveChosenClass = true;
                            }
                            if ($('#CityId.selectpicker').length > 0) {
                                haveSelectPicker = true;
                            }
                            $('#CityId').attr('disabled','false');
                            $('#CityId').removeAttr('disabled');
                        }

                        if (haveChosenClass && ($('.chosen-select').length > 0)) {
                            $('.chosen-select').chosen();
                            $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
                            $('.chosen-select').trigger('chosen:updated');
                        }
                        if ($("#"+ContainerId+".sumo-select").length > 0){
                            $("#"+ContainerId+".sumo-select")[0].sumo.reload();
                        }
                        if (haveSelectPicker && ($('.selectpicker').length > 0)) {
                            $('.selectpicker').selectpicker('refresh');
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

//update select input on registartion/profile page
function updateSelectInput(ContainerId,Choose,htmlValue)
{
    var text = 'Choose';
    if(typeof jsVars.CollegeId!='undefined' && jsVars.CollegeId==139){
        text='Domicile';
    }
    var html = '<option value=""> '+text+' '+Choose+'</option>';
    if((Choose == 'State') && ($('#CityId').length > 0))
    {
        $('#CityId').html('<option value="">'+text+' City</option>');
    }
    if((Choose == 'City') && ($('#CityId').length > 0)){
        $('#CityId').attr('disabled','false');
        $('#CityId').removeAttr('disabled');
    }
    
    if(typeof htmlValue !='undefined')
    {
        html += htmlValue;
    }
    $('#'+ContainerId).html(html);

    if ($('.chosen-select').length > 0){
        $('.chosen-select').chosen();
        $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
        $('.chosen-select').trigger('chosen:updated');
    }
}


//For Dropdown Menu Country Dial Code
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

// this function is used when there is mobile dial country code is selected in form applicant
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

/*Check Email Validation*/
function isValidEmailDNS(value,error_field,errorMessage)
{
    if($.trim(value)!= '') {
        $(error_field).html('');
        var _csrfToken = jsVars.csrfToken;
        if ((_csrfToken == null) && ($("form#registerForm").length > 0)) {
            _csrfToken = $("form#registerForm input[name=\'_csrfToken\']").val();
        } else if ((_csrfToken == null) && ($("form#loginForm").length > 0)) {
            _csrfToken = $("form#loginForm input[name=\'_csrfToken\']").val();
        }        
        //Call this ajax function
        $.ajax({
                url: (typeof jsVars.marketingPage != "undefined" && jsVars.marketingPage == true ? jsVars.FULL_URL : "") + "/common/check-email",
                type: 'post',
                dataType: 'json',
                async: false,
                data:  "email=" + $.trim(value) + "&marketPage=" + (typeof jsVars.marketingPage != "undefined" && jsVars.marketingPage == true ? true : false) + "&college_id=" + (typeof jsVars.college_id != "undefined" ? jsVars.college_id : 0),         
            headers: {'X-CSRF-TOKEN': _csrfToken},
            success: function (data) {
                if (typeof data['message'] !== 'undefined' && data['message']!='') {
                    $(error_field).show();
                    if(typeof errorMessage !== 'undefined' && errorMessage!==null && errorMessage!==''){
                        if(data['message'].indexOf("you mean") === -1 ){
                            $(error_field).html(errorMessage).css({'color':'#a94442','display':'block'});
                        }else{
                            $(error_field).html(data['message']).css({'color':'#a94442','display':'block'});
                        }
                    }else{
                        $(error_field).html(data['message']).css({'color':'#a94442','display':'block'});
                    }
                }   
                $('#registerBtn').removeAttr('disabled');
            },
            error: function (xhr, ajaxOptions, thrownError) {            
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });    
    }
}
var fetchProfileFromILearnRequestInProgress = false;
function fetchProfileFromILearn(collegeId,emailFieldId,error_field){
    var value   = $("#"+emailFieldId).val();
    if($.trim(value)!= '' && fetchProfileFromILearnRequestInProgress==false) {
        fetchProfileFromILearnRequestInProgress = true;
        $(error_field).html('');
        //Call this ajax function
        $.ajax({
            url: '/common/fetch-profile-from-i-learn',
            type: 'post',
            dataType: 'json',
            async: true,
            data:  'email='+$.trim(value),        
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            beforeSend: function () {
                $('#fetchProfileFromILearnLink').find("a").html("Please wait..");
            },
            complete: function () {
                $('#fetchProfileFromILearnLink').find("a").html("Validate");
                fetchProfileFromILearnRequestInProgress = false;
            },
            success: function (data) {
                if (typeof data['status'] !== 'undefined' && data['status']==1) {
                if( $("form#registerForm #registerBtn").length ){
                    $("form#registerForm #registerBtn").removeAttr('disabled');
                }
                    $('#fetchProfileFromILearnLink').hide();
                    var profileData = data["data"];
                    if($("#Name").length){
                        $("#Name").parents(".reg_name_div").show();
                        $("#Name").prop("readonly", true);
                        var name = '';
                        if("first_name" in profileData && typeof profileData['first_name']!=="undefined" && profileData['first_name']!==""){
                            name = profileData['first_name'];
                            if("last_name" in profileData && typeof profileData['last_name']!=="undefined" && profileData['last_name']!==""){
                                name = name + " " + profileData['last_name'];
                            }
                            $("#Name").val(name);
                        }
                    }
                    var country_of_residence = '';
                    if($("#FieldCountryOfResidence").length){
                        $("#FieldCountryOfResidence").prop("readonly", true);
                        if("country_of_residence" in profileData && typeof profileData['country_of_residence']!=="undefined" && profileData['country_of_residence']!==""){
                            country_of_residence = profileData['country_of_residence'];
                            $("#FieldCountryOfResidence").val(country_of_residence);
                        }
                    }
                    if($("#Mobile").length){
                        $("#Mobile").parents(".merge_field_div").show();
                        $("#Mobile").prop("readonly", true);
                        if("mobile_no" in profileData && typeof profileData['mobile_no']!=="undefined" && profileData['mobile_no']!==""){
                            var mobile = profileData['mobile_no'];
                            var iso_country_list = $.parseJSON(jsVars.iso_country_list);
                            var dialCode = '';
                            if(country_of_residence!==""){
                                if(country_of_residence in iso_country_list && typeof iso_country_list[country_of_residence]!=="undefined"){
                                    iso_country_list[country_of_residence] = String(iso_country_list[country_of_residence]);
                                    dialCode = '+'+iso_country_list[country_of_residence];
                                    if( mobile.indexOf(dialCode)!==-1 ){
                                        mobile = $.trim(mobile.substr(dialCode.length));
                                    }
                                    if( mobile.indexOf(iso_country_list[country_of_residence])!==-1 ){
                                        mobile = $.trim(mobile.substr(iso_country_list[country_of_residence].length));
                                    }
                                }
                            }
                            if(mobile.indexOf(" ")!==-1  && mobile.indexOf("+")!==-1){
                                if(dialCode==''){
                                    dialCode = $.trim(mobile.substr(0,mobile.indexOf(" ")));
                                }
                                mobile = mobile.substr(mobile.indexOf(" ")+1);
                            }
                            if(mobile.indexOf("+")!==-1){
                                mobile = mobile.substr(mobile.indexOf("+")+1);
                            }
                            mobile = mobile.split(' ').join('');
                            if($("#ul_dial_codeMobile").length){
                                $("#ul_dial_codeMobile").find("li").each(function(){
                                    if($(this).data("value")==dialCode){
                                        $(this).trigger("click");
                                        $(this).parents("div.bs-dropdown-to-select-group").removeClass("open");
                                        $("button.bs-dropdown-to-select").attr("aria-expanded","false");
                                        $("button.bs-dropdown-to-select").prop('disabled', true);
                                    }
                                });
                            }
                            $("#Mobile").val(mobile);
                        }
                        $("#Mobile").prop("readonly", true);
                    }
                    if($("#FieldLearningCenter").length){
                        $("#FieldLearningCenter").prop("readonly", true);
                        if("learning_center" in profileData && typeof profileData['learning_center']!=="undefined" && profileData['learning_center']!==""){
                            $("#FieldLearningCenter").val(profileData['learning_center']);
                        }
                    }
                    if($("#FieldLearningCenterName").length){
                        $("#FieldLearningCenterName").prop("readonly", true);
                        if("learning_center_name" in profileData && typeof profileData['learning_center_name']!=="undefined" && profileData['learning_center_name']!==""){
                            $("#FieldLearningCenterName").val(profileData['learning_center_name']);
                        }
                    }
                    $("#Email").prop("readonly", true);

                }else if (typeof data['message'] !== 'undefined' && data['message']!=='') {
                    $(error_field).show();
                    $(error_field).html(data['message']).css({'color':'#a94442','display':'block'});
                }else{
                    $(error_field).show();
                    $(error_field).html("Somethig went wrong. Please refresh the page and try again.");
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {            
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });    
    }
}

/**
 * if country select other then india then hide city and state
 * @returns {undefined}
 */
/*
function showHideStateCity(isIndiaDD,isIndiaCode){
     if(isIndiaCode == true && isIndiaDD == true){
        $('div.StateId, div.CityId').show();
    }else{
        $('#StateId').val('');
        $('#CityId').val('');
        $('div.StateId, div.CityId').hide();
    }
} */
$(function() {
    /* if both field is availble */
    /* if($('#CountryId').length>0 && $('#ul_dial_code li').length>0){
        var isIndiaCode = true;
        var isIndiaDD   = true;
        $('#ul_dial_code li').on('click', function(){
            var cdc = $(this).data("value");
            if(cdc!='' && cdc!='+91'){
                isIndiaCode = false;
            }else if(cdc=='+91'){
                isIndiaCode = true;
            }
            
            showHideStateCity(isIndiaCode,isIndiaDD); 
        });
        $('#CountryId').on('change', function(){
            var cdc_val = $(this).val();
            var cdc = $("#CountryId option[value='"+cdc_val+"']").text();
            cdc = cdc.toLowerCase();
            if(cdc!='' && cdc!='india'){
               isIndiaDD   = false;
            }else if(cdc=='india'){
               isIndiaDD   = true;
            }
            /* action to perform * /
            showHideStateCity(isIndiaCode,isIndiaDD); 
        });
        
       
        
    }else 
    if($('#CountryId').length>0){ /* if country dropdown is available* /
        $('#CountryId').on('change', function(){
            var cdc_val = $(this).val();
            var cdc = $("#CountryId option[value='"+cdc_val+"']").text();
            cdc = cdc.toLowerCase();
            if(cdc!='' && cdc!='india'){
                $('#StateId').val('');
                $('#CityId').val('');
                $('div.StateId, div.CityId').hide();
            }else if(cdc=='india'){
                $('div.StateId, div.CityId').show();
            }
        });
    }else 
    */    
    if($('#ul_dial_codeMobile li').length>0){ /* if check dial code like +91 etc */
        $('#ul_dial_codeMobile li').on('click', function(){
            var fieldid = '';
            if(typeof $(this).data("fieldid")!='undefined'){
                fieldid = $(this).data("fieldid");
                fieldid = fieldid.toLowerCase();
            }
            if(fieldid == 'mobile'){
            var cdc = $(this).data("value");
            if(cdc!='' && cdc!='+91'){
                if($('#StateId').length){
                    $('#StateId').val('');
                    if(typeof $('select#StateId')[0].sumo !=="undefined"){
                        $('select#StateId')[0].sumo.unSelectAll();                
                        $('select#CityId')[0].sumo.unSelectAll();   
                    }
                }
                if($('#CityId').length){
                    $('#CityId').val('');
                    if(typeof $('select#CityId')[0].sumo !=="undefined"){
                        $('select#CityId')[0].sumo.unSelectAll();   
                    }
                }
                if($('.chosen-select').length){
                    $('.chosen-select').trigger('chosen:updated');
                }
                $('div.StateId, div.CityId').hide();
            }else if(cdc=='+91'){
                $('div.StateId, div.CityId').show();
            }
        }
        });
    }
});

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

function gotoLogin(email){
    $("a[href='#cflogin']").trigger("click");
    $("form#loginForm input[name=\'Email\']").val(email);
}


function userRegisterByChat(email, phone, name, vendor) {
    $.ajax({
        url: jsVars.preRegisterChatUrl,
        type: 'post',
        data: {
            Email: email,
            mobile: phone,
            name : name,
            type : vendor
        },
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },                
        success: function (json) {
            if (json['success'] == 200)
            {}
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
//by pass otp international
function checkBypassOtp(v,e,page) {
    var cdcode = $(v).data("value");
    if(cdcode!='+91' && e=='1'){
        $(".hideShowOptBypass").hide();
        $("#otpverifylinkMobile").hide();
    }else if(page==='registerBtn'){
        $(".hideShowOptBypass").show();
    }
    $("#showMObileVerified").hide();
}

function resendVerifyCode() {
    var hash = $("#hashValue").val();
    if(hash==''){
        return false;
    }
    var _csrfToken = $("form#forgotOtpForm input[name='_csrfToken']").val();
    $.ajax({
        url: jsVars.ForgotPasswordUrl,
        type: 'post',
        data: {'hash':hash},
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": _csrfToken
        },
        beforeSend: function() {
            $('#forget-password div.loader-block,#register-now div.loader-block').show();
                $(this).attr('disabled',true);
                $("#resent").hide();
    },
        complete: function() {
        $('#forget-password div.loader-block,#register-now div.loader-block').hide();
                $(this).attr('disabled',false);
        },
        success: function (json) {
            if (json['redirect'])
            {
                location = json['redirect'];
            } else if (json['error'])
            {

            } else if (json['success'] == 200)
            {
                if (json['location'])
                {
                    location = json['location'];
                } else
                {
//                    $("#resendVerifyCodeBtn").remove();
//                    $("#resent").html('Resent');
                    countdownStartFOrget();
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#forget-password div.loader-block,#register-now div.loader-block').hide();
        }
    });
    
}

$(document).on('click', '#forgotVerifyCode', function () {
    var parentDiv = $("form#forgotOtpForm #otpcode").parents('div.form-group');
    var hash = $("#hashValue").val();
    if(hash==''){
        return false;
    }
    
    var otpCode = $("#otpcode").val();
    if(otpCode=='') {
        $(parentDiv).addClass('has-error');
        $(parentDiv).find("span.help-block").text('');
        $(parentDiv).find("span.help-block").append('Please enter otp code.');
        return false;
    }
    
    var _csrfToken = $("form#forgotOtpForm input[name='_csrfToken']").val();
    $.ajax({
        url: jsVars.ForgotPasswordVerifyCode,
        type: 'post',
        data: {'hash':hash, 'forget_otp':otpCode},
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": _csrfToken
        },
        beforeSend: function() {
            $('#forget-password div.loader-block,#register-now div.loader-block').show();
                $(this).attr('disabled',true);
    },
        complete: function() {
        $('#forget-password div.loader-block,#register-now div.loader-block').hide();
                $(this).attr('disabled',false);
        },
        success: function (json) {
            if (json['redirect']) {
                location = json['redirect'];
            } else if (json['status']==0) {
                
                $(parentDiv).addClass('has-error');
                $(parentDiv).find("span.help-block").text('');
                $(parentDiv).find("span.help-block").append(json['message']);
            } else if (json['status'] == 200) {
                $(parentDiv).find("span.help-block").text('');
                $("#afterCodeVerify").show();
                $("#resendVerifyCodeBtn").remove();
                $("#forgotVerifyCode").remove();
                $("#forgotOtpBtn").show();
            }else{
                $(parentDiv).addClass('has-error');
                $(parentDiv).find("span.help-block").text('');
                $(parentDiv).find("span.help-block").append(json['message']);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#forget-password div.loader-block,#register-now div.loader-block').hide();
        }
    });
});


$(document).on('click', '#forgotOtpBtn', function () {
    var parentDiv = $("form#forgotOtpForm #otpcode").parents('div.form-group');
    var hash = $("#hashValue").val();
    if (hash == '') {
        return false;
    }
    var otpCode = $("#otpcode").val();
    if (otpCode == '') {
        $(parentDiv).addClass('has-error');
        $(parentDiv).find("span.help-block").text('');
        $(parentDiv).find("span.help-block").append('Please enter otp code.');
        return false;
    }
    var _csrfToken = $("form#forgotOtpForm input[name='_csrfToken']").val();

    $.ajax({
        url: jsVars.ForgotPasswordChange,
        type: 'post',
        data: $("form#forgotOtpForm").serialize(),
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": _csrfToken
        },
        beforeSend: function () {
            $('#forget-password div.loader-block,#register-now div.loader-block').show();
            $(this).attr('disabled', true);
        },
        complete: function () {
            $('#forget-password div.loader-block,#register-now div.loader-block').hide();
            $(this).attr('disabled', false);
        },
        success: function (json) {
            if (json['redirect']) {
                location = json['redirect'];
            } else if (json['status'] == 0) {
                var msg = 'Some thing went wrong, please try again.';
                if(typeof json['Password']!='undefined') {
                    var parentDiv = $("form#forgotOtpForm #forgot-new-password").parents('div.form-group');
                    var msg = json['Password'];
                }else if(typeof json['Confirm']!='undefined') {
                    var parentDiv = $("form#forgotOtpForm #forgot-confirm-password").parents('div.form-group');
                    var msg = json['Confirm'];
                }else{
                    msg = json['message'];
                    var parentDiv = $("form#forgotOtpForm #forgot-confirm-password").parents('div.form-group');
                }
                
                $(parentDiv).addClass('has-error');
                $(parentDiv).find("span.help-block").text('');
                $(parentDiv).find("span.help-block").append(msg);
            } else if (json['status'] == 200) {
                   // location = json['data'];
                $("span.help-block").text('');
                $("div.form-group").removeClass('has-error');
                $("#forget-password .npf-close").trigger('click');
                $("#SuccessPopupArea .modal-title").text("Reset Password Sent");
                $("#SuccessPopupArea p#MsgBody").text(json['message']);
                $("#SuccessLink").trigger('click');
            } else {
                var parentDiv = $("form#forgotOtpForm #otpcode").parents('div.form-group');
                $(parentDiv).addClass('has-error');
                $(parentDiv).find("span.help-block").text('');
                $(parentDiv).find("span.help-block").append(json['message']);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#forget-password div.loader-block,#register-now div.loader-block').hide();
        }
    });

});


//Forgot password form submit function
var isVarresendVlinkBtnUser=false;
$(document).on('click', '#resendVlinkBtn', function () {
    $("span.help-block").text('');
    var _csrfToken = $("form#resendVlinkForm input[name='_csrfToken']").val();
    
    if(isVarresendVlinkBtnUser==true) { //check whether ajax hit is already called. If already called then return from here
        return;
    }
    isVarresendVlinkBtnUser=true; //If ajax hit is called then set this variable to true
    
    var parentDiv = $("form#resendVlinkForm #resentVerificationEmail ").parents('div.form-group');
    var otpCode = $("#resentVerificationEmail").val();
    if(otpCode=='') {
        $(parentDiv).addClass('has-error');
        $(parentDiv).find("span.help-block").text('');
        $(parentDiv).find("span.help-block").append('Please enter email id.');
        isVarresendVlinkBtnUser=false;
        return false;
    }
    
    $.ajax({
        url: jsVars.studentResendVerificationLink,
        type: 'post',
        data: $("form#resendVlinkForm").serialize(),
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": _csrfToken
        },
        beforeSend: function() {
            $('#forget-password div.loader-block,#register-now div.loader-block').show();
                $(this).attr('disabled',true);
    },
        complete: function() {
        $('#forget-password div.loader-block,#register-now div.loader-block').hide();
                $(this).attr('disabled',false);
        },
        success: function (json) {
            isVarresendVlinkBtnUser=false;
            if (json.redirect) {
                location = json.redirect;
            } else if (json.status==0) {
                $(parentDiv).addClass('has-error');
                $(parentDiv).find("span.help-block").text('');
                $(parentDiv).find("span.help-block").append(json.message);
            } else if (json.status == 200) {
                $("span.help-block").text('');
                $("div.form-group").removeClass('has-error');
                $("#resentVerificationEmail .npf-close").trigger('click');
                $("#SuccessPopupArea .modal-title").text("Verification Email Sent");
                $("#SuccessPopupArea p#MsgBody").text(json.message);
                $("#SuccessLink").trigger('click');
            }else{
                $(parentDiv).addClass('has-error');
                $(parentDiv).find("span.help-block").text('');
                $(parentDiv).find("span.help-block").append(json.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#resentVerificationEmail div.loader-block,#register-now div.loader-block').hide();
        }
    });
});

$(document).on('keypress', '#resendVlinkForm input', function (event) {
    if (event.which == 13) {
        event.preventDefault();
        $(this).parents("form").find("button").trigger('click').focus();
    }
});

function validateUsersPassword(field){
    var validPassword   = false;
    var password        = $("#"+field).val();
    var upperCase   = 0;
    var lowerCase   = 1;
    var numeric     = 0;
    var special     = 0;
    var password_len     = 0;

    $('.ul_new_password li').removeClass("active");

    if(password.length >= 8){
        password_len=1;
        $('.ul_new_password .password_len').addClass("active");
    }

    if(password.toLowerCase() !== password){
        upperCase   = 1;
        $('.ul_new_password .capital').addClass("active");
    }
    if(password.toUpperCase() !== password){
        //lowerCase   = 1;
        //$('.ul_new_password .lowercase').addClass("active");
    }
    if(/\d/.test(password)){
        numeric = 1;
        $('.ul_new_password .numeric').addClass("active");
    }
    var formatMatch = /[!@#$%^&*()_+\-=\[\]{}`~;':"\\|,.<>\/?]/;
    if(formatMatch.test(password) == true) {
        special = 1;
        $('.ul_new_password .special').addClass("active");
    }
    if(upperCase==1 && lowerCase==1 && numeric==1 && password_len==1 && special==1){
        validPassword   = true;
    }
    return validPassword;
 }


//Refresh captcha on click
function reloadImage(elementId) {
    var d = new Date();
    var n = d.getTime();
    $("#"+elementId).attr('src', jsVars.CaptchaLink + '?' + n);
}

function mobileNumberChanged(mobField){
    $(mobField).parent().parent().find('.help-block').html('');
    $('#registerBtn').removeAttr('disabled');
}
var sendLoginWithPasswordData = 0;
function pushLoginDatainDatalayer() {
    var collegeId = $("#collegeId").val();
    if(collegeId == 524 && sendLoginWithPasswordData === 0) {
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
          'event': 'Login',
          'category': 'Login',
          'action': 'Submit',
          'label': 'Login with Email & Password'
        });
        sendLoginWithPasswordData = 1;
    }
}

var sendRegisterWithFormData = 0;
function pushRegisterDatainDatalayer(mobileNo,utmSource,utmMedium,utmName,currentUrl,widgetName,hostName) {
    var collegeId = $("#collegeId").val();
    if(collegeId == 524 && sendRegisterWithFormData === 0) {
        window.dataLayer = window.dataLayer || [];
        var eventData = {
            'event': 'New User Registration',
            'category': 'New User Registration',
            'action': 'Submit',
            'label': 'Register with Registration Form',
          };
        if(typeof widgetName!=="undefined") {
            eventData["pageType"]   = "Widget";
            eventData["pageName"]   = widgetName;
        }
        if(typeof mobileNo!=="undefined") {
            eventData["mobileNo"]   = mobileNo;
        }
        if(typeof utmSource!=="undefined") {
            eventData["utm_source"]   = utmSource;
        }
        if(typeof utmMedium!=="undefined") {
            eventData["utm_medium"]   = utmMedium;
        }
        if(typeof utmName!=="undefined") {
            eventData["utm_campaign"]   = utmName;
        }
        if(typeof currentUrl!=="undefined") {
            eventData["pageUrl"]   = currentUrl;
        }
        if(typeof hostName!=="undefined") {
            eventData["hostName"]   = hostName;
        }
        dataLayer.push(eventData);
        sendRegisterWithFormData = 1;
    }
}
function showFieldsAndtriggerWebhooks(e, r) {
    if (($("span.help-block").text(""), $("#callingevent").val(e), 1 !== r)) return registerUser(), !0;
    var t = $("form#registerForm input[name='_csrfToken']").val();
    var data = $("form#registerForm").serializeArray();
    data.push({name: "event", value: e});
    $.ajax({
        url: jsVars.widgetCallingUrl,
        type: "post",
        data: data,
        dataType: "html",
        headers: { "X-CSRF-Token": t },
        beforeSend: function () {
            $("form#registerForm #callNowBtn").attr("disabled", "disabled"), $("form#registerForm #scheduleCallBtn").attr("disabled", "disabled");
        },
        complete: function () {
            $("form#registerForm #callNowBtn").removeAttr("disabled"), $("form#registerForm #scheduleCallBtn").removeAttr("disabled");
        },
        success: function (e) {
            (e = JSON.parse(e)), $(".agree-group").before(e.html), $("#callNowBtn").hide(), $("#scheduleCallBtn").hide(), $("#registerBtn").text(e.submitBtnText), $("#registerBtn").show(), $("#resetBtn").show();
        },
        error: function (e, r, t) {
            console.log(t + "\r\n" + e.statusText + "\r\n" + e.responseText), $("#register-now div.loader-block").hide(), (isVarRegisterUser = !1);
        },
    });
}
function getDynamicFieldDependencyLPU(field,dependencyObj){
    if(typeof field !== "string" || field==="" || field===null){
        return [];
    }
    $.ajax({
        url: jsVars.lpuDynamicFieldDependencyLink,
        type: 'post',
        data: {field:field},
        async: true,
        dataType: 'json',
        beforeSend: function() {
            $('#register-now div.loader-block,#register-page div.loader-block').show();
	},
        complete: function() {
            $('#register-now div.loader-block,#register-page div.loader-block').hide();
        },
        success: function (json) {
            if (json.redirect) {
                location = json.redirect;
            } else if (json.status == 1) {
                for (let key in json.data) {
                    dependencyObj[key] = json.data[key];
                }                
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getDynamicFieldValueMappingLPU(field,dependencyObj){
    if(typeof field !== "string" || field==="" || field===null){
        return [];
    }
    $.ajax({
        url: jsVars.lpuDynamicFieldValueMappingLink,
        type: 'post',
        data: {field:field},
        async: true,
        dataType: 'json',
        beforeSend: function() {
            $('#register-now div.loader-block,#register-page div.loader-block').show();
	},
        complete: function() {
            $('#register-now div.loader-block,#register-page div.loader-block').hide();
        },
        success: function (json) {
            if (json.redirect) {
                location = json.redirect;
            } else if (json.status == 1) {
                for (let key in json.data) {
                    dependencyObj[key] = json.data[key];
                }                
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
function loadCustomDateTime() {
    $(".registration-date").length &&
        $(".registration-date").each(function () {
            var e = $(this).data("format"),
                r = $(this).data("startdate"),
                t = $(this).data("enddate");
            "DD/MM/YYYY" == e
                ? $(this).datepicker({ startView: "decade", format: "dd/mm/yyyy", enableYearToMonth: !0, enableMonthToDay: !0, startDate: r, endDate: t })
                : "MM/YYYY" == e
                ? $(this).datepicker({ startView: "decade", format: "mm/yyyy", minViewMode: "months", startDate: r, endDate: t })
                : "YYYY" == e && $(this).datepicker({ startView: "decade", format: "yyyy", minViewMode: "years", startDate: String(r), endDate: String(t) });
        }),
        $(".registration-date-time").length &&
            $(".registration-date-time").each(function () {
                var e = $(this).data("format"),
                    r = $(this).data("startdate"),
                    t = $(this).data("enddate"),
                    o = $(this).data("customdays"),
                    a = [];
                for (var i in o.weeks) "0" === o.weeks[i] && a.push(i);
                var s = new Date(),
                    n = new Date();
                n.setDate(n.getDate() + 7),
                    "DD/MM/YYYY" == e
                        ? $(this).datetimepicker({ format: "DD/MM/YYYY HH:mm", daysOfWeekDisabled: a, minDate: s, maxDate: n })
                        : "MM/YYYY" == e
                        ? $(this).datepicker({ startView: "decade", format: "mm/yyyy", minViewMode: "months", startDate: r, endDate: t })
                        : "YYYY" == e && $(this).datepicker({ startView: "decade", format: "yyyy", minViewMode: "years", startDate: String(r), endDate: String(t) });
            }),
        $(".registration-date-time").val("");
}
function resetShowFields(){
    $("div.widget-show-fields").remove();
    $("#callingevent").val('');
    $("#callNowBtn").show();
    $("#scheduleCallBtn").show();
    $("#registerBtn").text('Register');
    $("#registerBtn").hide();
    $("#resetBtn").hide();
}
function resetInputFile(el){
    var fieldId = $(el).data("id")
    $('#'+fieldId).val('')
    $('#'+fieldId+'_choose_files').val('')
}
function showSelectedFiles(id) {
    $('#'+id).parent().removeClass('file')
    $('#'+id+'_choose_files').val('')
    var input = document.getElementById(id);
    var output = document.getElementById(id+'_show');
    var chooseFiles = document.getElementById(id+'_choose_files');
    var children = "";
    var selectFiles = "";
    for (var i = 0; i < input.files.length; ++i) {
        if(i>0){
            selectFiles = (i+1) + " files" ;
        }else{
             selectFiles += input.files.item(i).name ;
        }
        children += '<span class="badge">' + input.files.item(i).name + '</span>&nbsp;';
        
    }
    chooseFiles.value = selectFiles;
}
$('[data-toggle="tooltip"]').tooltip()

function downloadWidgetPDF(fileUrl) {
    var redirectUrl = jsVars.FULL_URL+'/downloadWidgetPdf/'+btoa(fileUrl);
    window.top.location=redirectUrl;
}

function registrationDataLayerData(datalayerData) {
    var collegeId = 0;
    if('collegeId' in datalayerData && datalayerData['collegeId']){
        collegeId = datalayerData['collegeId'];
    }
    if(collegeId === 0) {
        return true;
    }
    var configureDatalayer = 0;
    if('configureDatalayerColleges' in datalayerData && datalayerData['configureDatalayerColleges']){
        if($.inArray(collegeId, datalayerData['configureDatalayerColleges']) !== -1) {
            configureDatalayer = 1;
        }
    }
    if(configureDatalayer === 0) {
        return true;
    }
    if(collegeId === 531) {
        window.dataLayer = window.dataLayer || [];
        var eventData = {};
        if('name' in datalayerData && datalayerData['name']){
            eventData["name"]   = datalayerData["name"];
        }
        if('email' in datalayerData && datalayerData['email']){
            eventData["email"]   = datalayerData["email"];
        }
        if('mobile' in datalayerData && datalayerData['mobile']){
            eventData["mobile"]   = datalayerData["mobile"];
        }
        dataLayer.push(eventData);
    }
}