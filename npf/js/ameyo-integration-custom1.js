var setRecordForShowCrmCallback = function(response) {
	if (response.result) {
		var crmPage = document.getElementById('crmPage');
		var html = "<p>" + "Response : SetRecordShowCrm ->"
				+ response.result.status + "</p>";
		crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;

	}
};
/////for show popup
function customShowCrm(phone, additionalParams, requestId) {
    if((typeof additionalParams !== 'undefined') && (additionalParams != '') && (additionalParams != null)){
        var telephonyDetails = JSON.parse(additionalParams);        
    }
    var crmPage = document.getElementById('crmPage');
    var ameyoCollegeID = $('#ameyoCollegeID').val();
    var ameyoUserId = $('#ameyoUserId').val();
    var ameyoFormId = $('#ameyoFormId').val();
    var inboundCalltypes = ["transferred.to.campaign.dial", "inbound.call.dial"];
    var outboundCalltypes = ["click.to.call.dial", "outbound.callback.dial", "outbound.auto.dial", "outbound.auto.preview.dial",
        "outbound.manual.preview.dial", "outbound.manual.dial"];
//	var html = "Sending request to get CRM data for telephony activity: " + phone
//			+ " telephony Parameters" + additionalParams
//			+ "<br> Recieving Response.."
//			+ "<br> Populating CRM data on the basis of response.."
//			+ "<br>Done js vars" + ameyoCollegeID + ameyoUserId + ameyoFormId;
//	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
    if ((typeof phone !== 'undefined') && (phone != '') && (phone != null) && (telephonyDetails.userId !== 'undefined') && 
            (telephonyDetails.userId != '') && (telephonyDetails.userId != null) && (telephonyDetails.callType !== 'undefined')
            && (telephonyDetails.callType != '') && (telephonyDetails.callType != null) && 
            (outboundCalltypes.includes(telephonyDetails.callType))) {
        $.ajax({
                url: '/counsellors/clickToCall',
                type: 'post',
                dataType: 'json',
                data: {'userId': ameyoUserId, 'collegeId': ameyoCollegeID, 'formId': ameyoFormId, 'toolbarIntegration' : 1, 
                    'ameyoParam' : additionalParams, 'callId' : telephonyDetails.crtObjectId, 'callType' : telephonyDetails.callType},
                headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                success: function (data) {
                   if (typeof data !== 'undefined') {
                var Resstatus = data.status;
                var message = data.message;
            }
            if (typeof Resstatus !== 'undefined' && Resstatus == 'queued') {
                $("#" + ameyoUserId + '_' + ameyoCollegeID + '_' + ameyoFormId.replace('.','_')).trigger('click');
                if ($('.calling').length > 0) {
                    $('.calling').show();
                    setTimeout(function () {
                        $('.calling').fadeOut('fast');
                    }, 30000); // <-- 30 secound
                    if ($("#MakeEditable").length > 0) {
                        var tabLocation = $('#MakeEditable').offset().top - 120;
                        $('html, body').animate({scrollTop: tabLocation}, 500);
                    }
                    $("#ozontellIfram").show();//show iframe
                }

                if (typeof is_called !== 'undefined' && is_called == '1') {
                    $('#is_called').val('1');
                }
            } else if (typeof message !== 'undefined') {
                alertPopup(message, 'error');
            } else {
                if (typeof data.redirect !== 'undefined') {
                    location = data.redirect;
                } else {
                    alertPopup(data.error, 'error');
                }
            }
        },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        var crmPage = document.getElementById('crmPage');
//	var html = "Sending request to get CRM data for dodial phone activity: " + phone
//			+ " Additional Parameters" + telephonyDetails
//			+ "<br> Recieving Response.."
//			+ "<br> Populating CRM data on the basis of response.."
//			+ "<br>Done";
//	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
	ameyo.integration.api.setRecordInfoForShowCrm(requestId, requestId, phone,
			setRecordForShowCrmCallback);
        
    }else if((typeof phone !== 'undefined') && (phone != '') && (phone != null) && (telephonyDetails.userId !== 'undefined') && 
            (telephonyDetails.userId != '') && (telephonyDetails.userId != null) && (telephonyDetails.callType !== 'undefined')
            && (telephonyDetails.callType != '') && (telephonyDetails.callType != null) && 
            (inboundCalltypes.includes(telephonyDetails.callType))){
         $.ajax({
                url: '/webservices/ivrcallnotification/'+ameyoCollegeID+'/ameyo',
                type: 'post',
                dataType: 'json',
                data: {'AgentId': telephonyDetails.userId, 'phoneNumber' : phone, 'customerCRTId' : telephonyDetails.crtObjectId, 'callType' : telephonyDetails.callType},
                headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                success: function (data) {
                    if (typeof data['error'] !='undefined') {
                        }
                    else {
                        
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        
    }
}

function initializeCRMUI() {
	var crmPage = document.getElementById('crmPage');
	var html = "UI initialization ";
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}
////login success/failed
function handleLogin(reason) {
	var crmPage = document.getElementById('crmPage');
	var html = "<p>" + "handleLogin : " + reason + "</p>";
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}
////logout success/failed
function handleLogout(reason) {
	var crmPage = document.getElementById('crmPage');
	var html = "Logged out : " + reason;
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}

function handleDispositionList(reason) {
	var crmPage = document.getElementById("dispositiondropdown");
	for (i in reason) {
		for (j in reason[i]) {
			crmPage[crmPage.length] = new Option(i + " : " + reason[i][j], i
					+ ":" + reason[i][j]);
		}
	}
}

function handleFailedDispositionNotify(reason) {
	var crmPage = document.getElementById('crmPage');
	var html = "Fail To Dispose : " + reason;
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}

function handleOnLoad() {
	var crmPage = document.getElementById('crmPage');
	var html = "handleOnLoad : success";
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}

function handleFailedScheduleCallBackNotify(reason) {
	var crmPage = document.getElementById('crmPage');
	var html = "Failed to schedule callback : " + reason;
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}

function handleCallbackSuccessNotify(reason) {
	var crmPage = document.getElementById('crmPage');
	var html = "Success : " + reason;
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}

function handleCallInitiated(recordInfo) {
	var crmPage = document.getElementById('crmPage');
	var html = "callback scheduled for recordId : " + recordInfo.recordId
			+ " recordType : " + recordInfo.recordType + " recordName : "
			+ recordInfo.recordName;
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}
/////login success/failed
function handleLoginStatus(status) {
    console.log('upperstatus--->',status);
    if ((typeof status !== 'undefined') && (status != '') && (status != null) && (status == 'loggedIn')) {
        console.log('loggedinstatus--->',status);
        $.ajax({
                url: '/counsellors/ameyoAgentLogin',
                type: 'post',
                dataType: 'json',
                data: {'status' : status},
                headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                success: function (data) {
                    if (typeof data['error'] !='undefined') {
                        }
                    else {
                        
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
	var crmPage = document.getElementById('crmPage');
	var html = "handleLoginStatus : " + status;
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
    }
}

function handleForceLogin(reason) {
	var crmPage = document.getElementById('crmPage');
	var html = "handleForceLogin : " + reason;
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}

function handleSelectExtension(status, userCustomerCRTInfo) {
	var crmPage = document.getElementById('crmPage');
	var html = "Select Extention : " + status + "<br> User CRT info : "
			+ userCustomerCRTInfo.userCrtObjectId + "<br> Customer CRT Info : "
			+ userCustomerCRTInfo.customerCrtObjectId;
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}

function handleModifyExtension(status, userCustomerCRTInfo) {
	var crmPage = document.getElementById('crmPage');
	var html = "Modify Extention : " + status + "<br> User CRT info : "
			+ userCustomerCRTInfo.userCrtObjectId + "<br> Customer CRT Info : "
			+ userCustomerCRTInfo.customerCrtObjectId;
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}

function handleSelectCampaign(reason) {
	var crmPage = document.getElementById('crmPage');
	var html = "Select Campaign : " + reason;
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}

function handleAutoCallOn(status) {
	var crmPage = document.getElementById('crmPage');
	var html = "Auto Call On : " + status;
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}

function handleAutoCallOff(status) {
	var crmPage = document.getElementById('crmPage');
	var html = "Auto Call Off : " + status;
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}

function handleReady(status) {
	var crmPage = document.getElementById('crmPage');
	var html = "Ready : " + status;
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}

function handleBreak(status) {
	var crmPage = document.getElementById('crmPage');
	var html = "Break : " + status;
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}

function handleHangup(reason, userCustomerCRTInfo) {
	var crmPage = document.getElementById('crmPage');
	var html = "Hangup : " + reason + "<br> User CRT info : "
			+ userCustomerCRTInfo.userCrtObjectId + "<br> Customer CRT Info : "
			+ userCustomerCRTInfo.customerCrtObjectId;
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}

function handleTransferToPhone(reason, userCustomerCRTInfo) {
	var crmPage = document.getElementById('crmPage');
	var html = "Transfer to Phone : " + reason + "<br> User CRT info : "
			+ userCustomerCRTInfo.userCrtObjectId + "<br> Customer CRT Info : "
			+ userCustomerCRTInfo.customerCrtObjectId;
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}

function handleTransferInCall(reason, userCustomerCRTInfo) {
	var crmPage = document.getElementById('crmPage');
	var html = "Transfer in Call : " + reason + "<br> User CRT info : "
			+ userCustomerCRTInfo.userCrtObjectId + "<br> Customer CRT Info : "
			+ userCustomerCRTInfo.customerCrtObjectId;
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}

function handleTransferToAQ(reason, userCustomerCRTInfo) {
	var crmPage = document.getElementById('crmPage');
	var html = "Transfer to AQ : " + reason + "<br> User CRT info : "
			+ userCustomerCRTInfo.userCrtObjectId + "<br> Customer CRT Info : "
			+ userCustomerCRTInfo.customerCrtObjectId;
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}

function handleTransferToIVR(reason, userCustomerCRTInfo) {
	var crmPage = document.getElementById('crmPage');
	var html = "Transfer to IVR : " + reason + "<br> User CRT info : "
			+ userCustomerCRTInfo.userCrtObjectId + "<br> Customer CRT Info : "
			+ userCustomerCRTInfo.customerCrtObjectId;
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}

function handleTransferToUser(reason, userCustomerCRTInfo) {
	var crmPage = document.getElementById('crmPage');
	var html = "Transfer to user : " + reason + "<br> User CRT info : "
			+ userCustomerCRTInfo.userCrtObjectId + "<br> Customer CRT Info : "
			+ userCustomerCRTInfo.customerCrtObjectId;
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}

function handleTransferToCampaign(reason, userCustomerCRTInfo) {
	var crmPage = document.getElementById('crmPage');
	var html = "Transfer to campaign : " + reason + "<br> User CRT info : "
			+ userCustomerCRTInfo.userCrtObjectId + "<br> Customer CRT Info : "
			+ userCustomerCRTInfo.customerCrtObjectId;
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}

function handleConferWithPhone(reason, userCustomerCRTInfo) {
	var crmPage = document.getElementById('crmPage');
	var html = "Confer With Phone : " + reason + "<br> User CRT info : "
			+ userCustomerCRTInfo.userCrtObjectId + "<br> Customer CRT Info : "
			+ userCustomerCRTInfo.customerCrtObjectId;
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}

function handleConferWithTPV(reason, userCustomerCRTInfo) {
	var crmPage = document.getElementById('crmPage');
	var html = "Confer With TPV : " + reason + "<br> User CRT info : "
			+ userCustomerCRTInfo.userCrtObjectId + "<br> Customer CRT Info : "
			+ userCustomerCRTInfo.customerCrtObjectId;
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}

function handleConferWithUser(reason, userCustomerCRTInfo) {
	var crmPage = document.getElementById('crmPage');
	var html = "Confer With User : " + reason + "<br> User CRT info : "
			+ userCustomerCRTInfo.userCrtObjectId + "<br> Customer CRT Info : "
			+ userCustomerCRTInfo.customerCrtObjectId;
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}

function handleConferWithLocalIVR(reason, userCustomerCRTInfo) {
	var crmPage = document.getElementById('crmPage');
	var html = "Confer With Local IVR : " + reason + "<br> User CRT info : "
			+ userCustomerCRTInfo.userCrtObjectId + "<br> Customer CRT Info : "
			+ userCustomerCRTInfo.customerCrtObjectId;
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}

function getExtensionInfo(reason) {
	var crmPage = document.getElementById('crmPage');
	var html = "Get Extension : " + reason;
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}

function customCallDispose(userCustomerCRTInfo) {
    console.log('dodialdisposed-->',userCustomerCRTInfo);
	var crmPage = document.getElementById('crmPage');
	var html = userCustomerCRTInfo + "Call disposed dodialdisposed <br> User CRT info : "
			+ userCustomerCRTInfo.userCrtObjectId + "<br> Customer CRT Info : "
			+ userCustomerCRTInfo.customerCrtObjectId
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}
//////dodial response
function handleDisposeAndDial(userCustomerCRTInfo) {
    console.log('dodial-->',userCustomerCRTInfo);
	var crmPage = document.getElementById('crmPage');
	var html = "Dispose and dial completed <br> User CRT info : "
			+ userCustomerCRTInfo.userCrtObjectId + "<br> Customer CRT Info : "
			+ userCustomerCRTInfo.customerCrtObjectId
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
}

function showCrmDetailedCustom(recordInfo) {
	var crmPage = document.getElementById('crmPage');
	var html = "Record Id : " + recordInfo.recordId + "<br> User CRT info : "
			+ recordInfo.userCustomerCRTInfo.userCrtObjectId
			+ "<br> Customer CRT Info : "
			+ recordInfo.userCustomerCRTInfo.customerCrtObjectId
	crmPage.innerHTML = html + "<br>" + crmPage.innerHTML;
	alert(recordInfo.recordId);
}

customIntegration = {};
customIntegration.intializeUI = initializeCRMUI;
customIntegration.showCrm = customShowCrm;
customIntegration.showCrmDetailed = showCrmDetailedCustom;
customIntegration.loginHandler = handleLogin;
customIntegration.forceLoginHandler = handleForceLogin;
customIntegration.logoutHandler = handleLogout;
customIntegration.failedDispositionNotifyHandler = handleFailedDispositionNotify;
customIntegration.getDispositionCodesHandler = handleDispositionList;
customIntegration.onLoadHandler = handleOnLoad;
customIntegration.loginStatusHandler = handleLoginStatus;
customIntegration.selectExtensionHandler = handleSelectExtension;
customIntegration.modifyExtensionHandler = handleModifyExtension;
customIntegration.selectCampaignHandler = handleSelectCampaign;
customIntegration.autoCallOnHandler = handleAutoCallOn;
customIntegration.autoCallOffHandler = handleAutoCallOff;
customIntegration.readyHandler = handleReady;
customIntegration.breakHandler = handleBreak;
customIntegration.hangupHandler = handleHangup;
customIntegration.transferToPhoneHandler = handleTransferToPhone;
customIntegration.transferInCallHandler = handleTransferInCall;
customIntegration.transferToAQHandler = handleTransferToAQ;
customIntegration.transferToIVRHandler = handleTransferToIVR;
customIntegration.transferToUserHandler = handleTransferToUser;
customIntegration.transferToCampaignHandler = handleTransferToCampaign;
customIntegration.conferWithPhoneHandler = handleConferWithPhone;
customIntegration.conferWithTPVHandler = handleConferWithTPV;
customIntegration.conferWithUserHandler = handleConferWithUser;
customIntegration.conferWithLocalIVRHandler = handleConferWithLocalIVR;
customIntegration.disposeCall = customCallDispose;
customIntegration.disposeAndDialHandler = handleDisposeAndDial;
customIntegration.failedScheduleCallBackNotifyHandler = handleFailedScheduleCallBackNotify;
customIntegration.callbackSuccessNotifyHandler = handleCallbackSuccessNotify;
customIntegration.callInitiatedHandler = handleCallInitiated;

ameyo.integration.registerCustomFunction("intializeUI", customIntegration);
ameyo.integration.registerCustomFunction("showCrm", customIntegration);
ameyo.integration.registerCustomFunction("loginHandler", customIntegration);
ameyo.integration.registerCustomFunction("logoutHandler", customIntegration);
ameyo.integration.registerCustomFunction("failedDispositionNotifyHandler",
		customIntegration);
ameyo.integration.registerCustomFunction("getDispositionCodesHandler",
		customIntegration);
ameyo.integration.registerCustomFunction("onLoadHandler", customIntegration);
ameyo.integration.registerCustomFunction("loginStatusHandler",
		customIntegration);
ameyo.integration
		.registerCustomFunction("forceLoginHandler", customIntegration);
ameyo.integration.registerCustomFunction("selectExtensionHandler",
		customIntegration);
ameyo.integration.registerCustomFunction("modifyExtensionHandler",
		customIntegration);
ameyo.integration.registerCustomFunction("selectCampaignHandler",
		customIntegration);
ameyo.integration
		.registerCustomFunction("autoCallOnHandler", customIntegration);
ameyo.integration.registerCustomFunction("autoCallOffHandler",
		customIntegration);
ameyo.integration.registerCustomFunction("readyHandler", customIntegration);
ameyo.integration.registerCustomFunction("breakHandler", customIntegration);
ameyo.integration.registerCustomFunction("hangupHandler", customIntegration);
ameyo.integration.registerCustomFunction("transferToPhoneHandler",
		customIntegration);
ameyo.integration.registerCustomFunction("transferInCallHandler",
		customIntegration);
ameyo.integration.registerCustomFunction("transferToAQHandler",
		customIntegration);
ameyo.integration.registerCustomFunction("transferToIVRHandler",
		customIntegration);
ameyo.integration.registerCustomFunction("transferToUserHandler",
		customIntegration);
ameyo.integration.registerCustomFunction("transferToCampaignHandler",
		customIntegration);
ameyo.integration.registerCustomFunction("conferWithPhoneHandler",
		customIntegration);
ameyo.integration.registerCustomFunction("conferWithTPVHandler",
		customIntegration);
ameyo.integration.registerCustomFunction("conferWithUserHandler",
		customIntegration);
ameyo.integration.registerCustomFunction("conferWithLocalIVRHandler",
		customIntegration);
ameyo.integration.registerCustomFunction("disposeCall", customIntegration);
ameyo.integration.registerCustomFunction("showCrmDetailed", customIntegration);
ameyo.integration.registerCustomFunction("disposeAndDialHandler",
		customIntegration);
ameyo.integration.registerCustomFunction("failedScheduleCallBackNotifyHandler",
		customIntegration);
ameyo.integration.registerCustomFunction("callbackSuccessNotifyHandler",
		customIntegration);
ameyo.integration.registerCustomFunction("callInitiatedHandler",
		customIntegration);