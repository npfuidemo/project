/* 
 * To handle node js + counsellor functions.
 */
var audios = document.getElementsByTagName('audio');
$(document).ready(function() {
    $('a.loadMoreNotification').click(function(e) {
        $(this).parents('.notifyCountUl').addClass('open');
        e.stopPropagation();
    });
    $('.disMobile, .disAudio').click(function(e) {
        e.stopPropagation();
    }); 
});

//hide bell icon popup
function hideNotificationPopUp()
{
    $('div.notifyCountUl').removeClass('open');
    stopAllPlayers();
}

//pause all audio players
function pauseAllPlayers() 
{
    document.addEventListener('play', function(e) {
        for (var i = 0, len = audios.length; i < len;i++) {
            if (audios[i] != e.target) {
                audios[i].pause();
            }
        }        
    }, true);
}

//stop all players
function stopAllPlayers() 
{
    for(var i = 0, len = audios.length; i < len;i++){
        audios[i].pause();
    }
}

//Blink page title on ivr inbound call comes
function blinkPageTilte(data, callType, setUserMasking = 0)
{
    if (typeof callType == 'undefined') {
        callType = 'Inbound';
    }
    var mobile = getMobileFromUserData(data, callType);
    //alert(mobile);
    if(mobile != '' && setUserMasking !== 'undefined' && setUserMasking !=0){
        mobile = setMasking(mobile.toString());
    }
    if (mobile != '') {
        $.titleAlert(mobile + ' is calling..');
    }
}

//get cookie value 
function getCookieValue(cname) 
{
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

//get unique id
function getUniqueId() 
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

//do empty InboundCallersModalBox
function emptyInboundCallersModalBox()
{
    $('div#InboundCallersModalBox div#InboundCallersBody').html('');
}

//return mobile from userdata
function getMobileFromUserData(data, callType)
{ 
    var mobile = '';
    for (var i in data.userdata) {                            
        var vendor = data.userdata[i]['vendor'];        
        switch (vendor) {
            case 'ozontel':
                //get mobile for inbound call
                if (callType == 'Campaign') {
                    mobile = data.userdata[i]['destination'];
                } else {
                    var CallerID = data.userdata[i]['CallerID'];  //09911052957 || 919911052957
                    mobile = CallerID.substr(-10);         //9911052957
                }
                break;
            case 'knowlarity':
                //get mobile for inbound call
                var CallerID = data.userdata[i]['caller_id'];  //+919911052957
                mobile = CallerID.substr(-10);         //9911052957
                break;    
            case 'aastell':
                //get mobile for inbound call
                var CallerID = data.userdata[i]['callerID'];  //09911052957
                mobile = CallerID.substr(-10);         //9911052957
                break;
            case 'mcubes':
            case 'sansoft':
            case 'cohesive':
            case 'asttecs':
            case 'asterdialer':
            case 'minavo':
            case 'myoperator':
            case 'imerge':
            case 'exotel':
            case 'go2market':
            case 'aonesite':
            case 'ameyo': 
            case 'ivrguru':
            case 'threegcallnet':
            case 'ziffy':
            case 'tatatel':
            case 'telecmi':
            case 'cube':
            case 'radicalminds':
            case 'galaxy':
            case 'slashrtc':
                //get mobile for inbound call
                var mobile; 
                if (callType == 'Campaign') {
                    mobile = data.userdata[i]['destination'];
                } else {
                    mobile = data.userdata[i]['caller_id'];
                }  //9911052957
                break;    
        }        
    }
    return mobile;
}

function setMasking(mobile) {
    var s = mobile.split('');
    for (var i = 0; i < s.length; i++) {
        s[i] = '*';      
    }
    return s.join('');
}

//get caller initialize conditional html
function getCallerInitHtml(data, uuid, callIcon, setUserMasking=0)
{
    var mobile = getMobileFromUserData(data, callIcon);
    if(mobile != '' && setUserMasking !== 'undefined' && setUserMasking !=0){
        mobile = setMasking(mobile.toString());
    }
    var inboundShowHtml = ' <div class=\"table-border margin-top-15\" id=\"'+ uuid +'-section\">';
        inboundShowHtml +='         <table class=\"table table-striped border-collapse-unset\">';
        inboundShowHtml +='             <thead>';
        inboundShowHtml +='                 <tr>';
        if (callIcon === 'Missed') {
        inboundShowHtml +='                     <th  colspan=\"6\" white-space=\"nowrap\"><span class="callIco missedCallListing"></span> Missed Call : '+mobile+' </th>';
        } else {
        inboundShowHtml +='                     <th  colspan=\"6\" white-space=\"nowrap\"><span class="animated infinite flash"><i class="fa fa-phone"></i> </span> Incoming Call : '+mobile+' </th>';
        }
        inboundShowHtml +='                 </tr>';
        inboundShowHtml +='             </thead>';
        inboundShowHtml +='             <tbody id=\"'+ uuid +'-body\">';
        inboundShowHtml +='                 <tr>';
        inboundShowHtml +='                     <td  colspan=\"6\" white-space=\"nowrap\" class=\"text-center\">';
        //mobile have data
        
        if (mobile != '') {
            inboundShowHtml +=  mobile + ' is calling.. Please wait we are fetching data. <span><i class=\"fa fa-refresh fa-spin\" style=\"font-size:12px;\"></i></span><br/>';
        }
        inboundShowHtml +='                     </td>';
        inboundShowHtml +='                 </tr>';
        inboundShowHtml +='             </tbody>';
        inboundShowHtml +='         </table>';
        inboundShowHtml +='     </div>';
    return inboundShowHtml;    
}

//get Inbound caller list for counsellor
function getInboundCallerList(callers, uuid, action) 
{
    var _csrfToken = getCookieValue("csrfToken");
    
    if (callers.length > 0) {
        $.ajax({
            url:  jsVars.FULL_URL + '/counsellors/getInboundUsers',
            type: 'post',
            data: {data:callers,fetch:'callers', icon:action},
            async: false,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": _csrfToken
            },
            success: function (json) {
                if (json['status'] === 0)
                {
                    if(json['message'] == 'redirect') {
                        location = jsVars.FULL_URL + '/colleges/login';
                    }
                    else if (json['message'] !== '') {
                        $('div#InboundCallersModalBox div#InboundCallersBody div#' + uuid + '-section tbody#' + uuid + '-body').html(json['message']);
                        $('div#InboundCallersModalBox').modal('show');
                    }
                }
                else if (json['status'] === 200)
                {
                    if(json['data'].length > 0) {
                        $('div#InboundCallersModalBox div#InboundCallersBody div#' + uuid + '-section tbody#' + uuid + '-body').html(json['data']);
                        $('div#InboundCallersModalBox').modal('show');
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

//submit inbound user form
function postInboundUserForm(mongoId, UserId, elem, callFrom) 
{
    if (typeof callFrom == 'undefined') {
        callFrom = 'Pending';
    }
    if ((typeof mongoId != 'undefined') && (typeof UserId != 'undefined')) {
        
        $.ajax({
            url:  jsVars.FULL_URL + '/counsellors/getIncomingCallStatus',
            type: 'post',
            data: {mongoId:mongoId,userId:UserId,fetch:'getStatus',callFrom:callFrom},
            async: false,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                if(json['redirect']) {
                    location = json['redirect'];
                }
                else if (json['error'])
                {
                    $(elem).closest('tbody').html('<tr><td><i style="color:red;">'+ json['error'] +'</i></td><tr>');
                }
                else if (json['status'] == 200){
                    $('form#inboundUserProfileForm input[name=\'userId\']').val(parseInt(UserId));
                    $('form#inboundUserProfileForm input[name=\'mongoId\']').val(mongoId);
                    $('form#inboundUserProfileForm').submit();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        
    }
}

//show inbound caller list on click of view leads btn
function showInboundCallersList(mongoId, action, setMasking=0)
{
    //action = pending|missed
    if (typeof action == 'undefined') {
        action = 'Pending';
    }
    var callers = $('input#hidden-'+mongoId).val();
    if(typeof callers != 'undefined' && callers != '') {
        var data = {};
        data['userdata'] = [$.parseJSON(callers)];
        //console.log(data);
        var uuid = getUniqueId();
        var inboundShowHtml = getCallerInitHtml(data, uuid, action, setMasking);
        $('div#InboundCallersModalBox div#InboundCallersBody').html(inboundShowHtml);
        $('div#InboundCallersModalBox').modal('show');
        getInboundCallerList(data.userdata, uuid, action);                     //node_functions.js->getInboundCallerList();
//        $('li#li-'+mongoId).remove();
//        var oldNotifyCount = parseInt($('span#notifyCountSpan').text());
//        if(oldNotifyCount > 0) {
//            oldNotifyCount--; 
//        }
//        $('span#notifyCountSpan').text(oldNotifyCount);
//        //hide notify li if count 0
//        if(oldNotifyCount == 0) {
//            $('ul#notifyCountUl').hide();
//        }
    }
}

//load more bell icon callers
function loadMoreInboundCallersList(loadMoreCallerPage, callFrom)
{
    var _csrfToken = getCookieValue("csrfToken");    
    if(typeof loadMoreCallerPage == 'undefined') {
        loadMoreCallerPage = 2;
    }
    
    if(typeof callFrom == 'undefined') {
        callFrom = 'Pending';
    }
    
    $.ajax({
        url:  jsVars.FULL_URL + '/counsellors/loadMoreInboundCallersList',
        type: 'post',
        data: {page:loadMoreCallerPage,fetch:'loadMoreCallers', callFrom:callFrom},
        async: false,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": _csrfToken
        },
        success: function (json) {
            if(json == 'redirect') {
                    location = jsVars.FULL_URL + '/colleges/login';
            }
            else if (json == 'csrfToken') {
                alert('Invalid csrfToken token');
            }
            else if (json == 'missing')
            {
                alert('Request parameter missing/invalid.');
            }
            else {
                loadMoreCallerPage = loadMoreCallerPage + 1;
                if (callFrom == 'Missed') {
                    $('div#MissedCallSection #notifyCountUl').append(json);
                    $('div#MissedCallSection button#notifyLabel').trigger('click');
                } else {
                    $('div#InboundCallSection #notifyCountUl').append(json);
                    $('div#InboundCallSection button#notifyLabel').trigger('click');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
}

//hide load more notification button
function hideLoadMoreNotificationBtn(page, resultCount, callFrom)
{
    console.log('callFrom:' + callFrom + '| count:' + resultCount);
    if (typeof callFrom == 'undefined') {
        callFrom = '';
    }
    $('div#loadMore'+ callFrom +'NotificationDiv a.loadMoreNotification').attr('onclick', 'loadMoreInboundCallersList('+page+', \''+ callFrom +'\');');
    if(resultCount < 10) {
        $('div#loadMore'+ callFrom +'NotificationDiv').hide();
    }
}


//add new caller lead
function addNewInboundLead(mongoId, elem) 
{
    if(typeof mongoId == 'undefined') {
        return;
    }
    var _csrfToken = getCookieValue("csrfToken");
    
    $.ajax({
        url:  jsVars.FULL_URL + '/counsellors/addNewInboundCaller',
        type: 'post',
        data: {mongoId:mongoId,fetch:'addCaller'},
        async: false,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": _csrfToken
        },
        success: function (json) {
            if(json['redirect']) {
                    location = json['redirect'];
            }
            else if (json['error']) {
                alert(json['error']);
            }
            else if (json == 'missing')
            {
                alert('Request parameter missing/invalid.');
            }
            else if(json['success'] == 200) {
                if(json['userId']) {
                    postInboundUserForm(mongoId, json['userId'], elem) ;
                }   
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

//get caller initialize conditional html
function getCampaignCallerInitHtml(data, uuid, callIcon, setUserMasking=0)
{
    var mobile = getCampaignMobileFromUserData(data, callIcon);
    if(mobile != '' && setUserMasking !== 'undefined' && setUserMasking !=0){
        mobile = setMasking(mobile.toString());
    }
    var campaignOutboundShowHtml = ' <div class=\"table-border margin-top-15\" id=\"'+ uuid +'-section\">';
        campaignOutboundShowHtml +='         <table class=\"table table-striped border-collapse-unset\">';
        campaignOutboundShowHtml +='             <thead>';
        campaignOutboundShowHtml +='                 <tr>';
        campaignOutboundShowHtml +='                     <th  colspan=\"6\" white-space=\"nowrap\"><span class="callIco campaignCallListing"></span> Campaign Call : '+mobile+' </th>';
        campaignOutboundShowHtml +='                 </tr>';
        campaignOutboundShowHtml +='             </thead>';
        campaignOutboundShowHtml +='             <tbody id=\"'+ uuid +'-body\">';
        campaignOutboundShowHtml +='                 <tr>';
        campaignOutboundShowHtml +='                     <td  colspan=\"6\" white-space=\"nowrap\" class=\"text-center\">';
        //mobile have data        
        if (mobile != '') {
            campaignOutboundShowHtml +=  mobile + ' is calling.. Please wait we are fetching data. <span><i class=\"fa fa-refresh fa-spin\" style=\"font-size:12px;\"></i></span><br/>';
        } else {
            campaignOutboundShowHtml +=  '<i style="color:red;">Something went wrong. Please connect with us about the same.</i> <span><i class=\"fa fa-warning\" style=\"font-size:12px;color:red;\"></i></span><br/>';
        }
        campaignOutboundShowHtml +='                     </td>';
        campaignOutboundShowHtml +='                 </tr>';
        campaignOutboundShowHtml +='             </tbody>';
        campaignOutboundShowHtml +='         </table>';
        campaignOutboundShowHtml +='     </div>';
    return campaignOutboundShowHtml;    
}

//return mobile from userdata
function getCampaignMobileFromUserData(data, callType)
{ 
    var mobile = '';
    for (var i in data.userdata) {                            
        var vendor = data.userdata[i]['vendor'];        
        switch (vendor) {
            
            case 'imerge':
            case 'cube':
                mobile = data.userdata[i]['destination'];
                break;    
        }        
    }
    return mobile;
}

//get Inbound caller list for counsellor
function getCampaignOutboundCallerList(callers, uuid, action) 
{
    var _csrfToken = getCookieValue("csrfToken");
    
    if (callers.length > 0) {
        $.ajax({
            url:  jsVars.FULL_URL + '/counsellors/getCampaignOutboundUsers',
            type: 'post',
            data: {data:callers, fetch:'callers', icon:action},
            async: false,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": _csrfToken
            },
            success: function (json) {
                if (json['status'] === 0)
                {
                    if(json['message'] == 'redirect') {
                        location = jsVars.FULL_URL + '/colleges/login';
                    }
                    else if (json['message'] !== '') {
                        $('div#CampaignOutboundCallersModalBox div#CampaignOutsboundCallersBody div#' + uuid + '-section tbody#' + uuid + '-body').html(json['message']);
                        $('div#CampaignOutboundCallersModalBox').modal('show');
                    }
                }
                else if (json['status'] === 200)
                {
                    if(json['data'].length > 0) {
                        $('div#CampaignOutboundCallersModalBox div#CampaignOutsboundCallersBody div#' + uuid + '-section tbody#' + uuid + '-body').html(json['data']);
                        $('div#CampaignOutboundCallersModalBox').modal('show');
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

//submit inbound user form
function postCampaignOutboundUserForm(mongoId, UserId, elem, callFrom) 
{
    if (typeof callFrom == 'undefined') {
        callFrom = 'Pending';
    }
    if ((typeof mongoId != 'undefined') && (typeof UserId != 'undefined')) {
        
        $.ajax({
            url:  jsVars.FULL_URL + '/counsellors/getCampaignCallStatus',
            type: 'post',
            data: {mongoId:mongoId,userId:UserId,fetch:'getStatus',callFrom:callFrom},
            async: false,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                if(json['redirect']) {
                    location = json['redirect'];
                }
                else if (json['error'])
                {
                    $(elem).closest('tbody').html('<tr><td><i style="color:red;">'+ json['error'] +'</i></td><tr>');
                }
                else if (json['status'] == 200){
                    $('form#campaignOutboundUserProfileForm input[name=\'userId\']').val(parseInt(UserId));
                    $('form#campaignOutboundUserProfileForm input[name=\'mongoId\']').val(mongoId);
                    $('form#campaignOutboundUserProfileForm').submit();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        
    }
}

//show inbound caller list on click of view leads btn
function showCampaignOutboundCallersList(mongoId, action, setMasking=0)
{
    //action = pending|missed
    if (typeof action == 'undefined') {
        action = 'Pending';
    }
    var callers = $('input#hidden-'+mongoId).val();
    if(typeof callers != 'undefined' && callers != '') {
        var data = {};
        data['userdata'] = [$.parseJSON(callers)];
        //console.log(data);
        var uuid = getUniqueId();
        var inboundShowHtml = getCampaignCallerInitHtml(data, uuid, action, setMasking);
        $('div#CampaignOutboundCallersModalBox div#CampaignOutsboundCallersBody').html(inboundShowHtml);
        $('div#CampaignOutboundCallersModalBox').modal('show');
        getCampaignOutboundCallerList(data.userdata, uuid, action);                     //node_functions.js->getCampaignOutboundCallerList();
    }
}

//load more bell icon callers
function loadMoreCampaignCallersList(loadMoreCallerPage, callFrom)
{
    var _csrfToken = getCookieValue("csrfToken");    
    if(typeof loadMoreCallerPage == 'undefined') {
        loadMoreCallerPage = 2;
    }
    
    if(typeof callFrom == 'undefined') {
        callFrom = 'Pending';
    }
    
    $.ajax({
        url:  jsVars.FULL_URL + '/counsellors/loadMoreCampaignCallersList',
        type: 'post',
        data: {page:loadMoreCallerPage,fetch:'loadMoreCampaignCallers', callFrom:callFrom},
        async: false,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": _csrfToken
        },
        success: function (json) {
            if(json == 'redirect') {
                    location = jsVars.FULL_URL + '/colleges/login';
            }
            else if (json == 'csrfToken') {
                alert('Invalid csrfToken token');
            }
            else if (json == 'missing')
            {
                alert('Request parameter missing/invalid.');
            }
            else {
                loadMoreCallerPage = loadMoreCallerPage + 1;
                if (callFrom == 'Missed') {
                    $('div#MissedCallSection #notifyCampaignCountUl').append(json);
                    $('div#MissedCallSection button#notifyLabel').trigger('click');
                } else {
                    $('div#InboundCallSection #notifyCampaignCountUl').append(json);
                    $('div#InboundCallSection button#notifyLabel').trigger('click');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
}

//do empty emptyCampaignOutboundCallersModalBox
function emptyCampaignOutboundCallersModalBox()
{
    $('div#CampaignOutboundCallersModalBox div#CampaignOutsboundCallersBody').html('');
}

// Tabs inside the dropdown
$('.inbound_Campaign_tab a').click(function(){ 
	var dailerName = $(this).attr("aria-controls");
	$(this).parents('ul.inbound_Campaign_tab').find('li').removeClass('active'); 
	$(this).parent('li').addClass('active');    
	$('#'+dailerName).addClass('active');
	$('#'+dailerName).siblings().removeClass('active');
});

//hide load more Campaign notification button
function hideLoadMoreCampaignNotificationBtn(page, resultCount, callFrom)
{
    console.log('callFrom:' + callFrom + '| count:' + resultCount);
    if (typeof callFrom == 'undefined') {
        callFrom = '';
    }
    $('div#loadMoreCampaign'+ callFrom +'NotificationDiv a.loadMoreNotification').attr('onclick', 'loadMoreCampaignCallersList('+page+', \''+ callFrom +'\');');
    if(resultCount < 10) {
        $('div#loadMoreCampaign'+ callFrom +'NotificationDiv').hide();
    }
}

