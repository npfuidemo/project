var refreshTime = 30000; //30 seconds
var loadActiveUser;
var loadSharedViewActiveUser;
$("document").ready(function() {
    $('[data-toggle="popover"]').popover();
	
    $('#accountId').on('change', function() {
        $('#myViewGeographical, #myViewAds, #myViewOther, #SharedViewGeographical, #sharedViewAds, #SharedViewOtherAnalysis, #myViewTrends, #SharedViewTrends').val('');
        loadPropertyListByAccountId();
    });
    
    $('#propertyId').on('change', function() {
        $('#myViewGeographical, #myViewAds, #myViewOther, #SharedViewGeographical, #sharedViewAds, #SharedViewOtherAnalysis, #myViewTrends, #SharedViewTrends').val('');
        loadViewListByPropertyId();
    });
    
    $('#sharedView-tab').on('click', function(){
       getSharedViewUserList();
    });
    
    $('#viewId').on('change', function(){
        $('#myViewGeographical, #myViewAds, #myViewOther, #SharedViewGeographical, #sharedViewAds, #SharedViewOtherAnalysis, #myViewTrends, #SharedViewTrends').val('');
        if($('#myview').hasClass('active')) {
            var myViewId = $('#myViewReportTabList').find('li.active > a').attr('id');
            switch(myViewId) {                
                case 'geographical-tab':
                    $('#geographical-tab').trigger('click');
                    break;
                case 'ads-tab':
                    $('#ads-tab').trigger('click');
                    break;
                case 'other-tab':
                    $('#other-tab').trigger('click');
                    break;
                default:
                    //First Time load Active User
                    loadGAReports('getActiveUser', 'activeUsersLoaderId', 'activeUsersId');
                    loadGAReports('weeklyReport','weekWiseLoaderId','weekWiseReportId');
                    loadGAReports('getYearlyReport', 'yearWiseLoaderId','yearWiseReportId');
                    loadGAReports('getSessionReport', 'sessionTrendLoaderId','sessionTrendGraphId');

                    //Load every 30 seconds
                    loadActiveUser = setInterval( function() { loadGAReports('getActiveUser', 'activeUsersLoaderId', 'activeUsersId'); }, refreshTime );
            }
        }
        
    });
    
    //For My View Section
    $("#sessionReportMyViewFilters").find(".applyTrafficDashboardDates").on('click', function (e) 
    {
        loadGAReports('getSessionReport','sessionTrendLoaderId','sessionTrendGraphId','sessionReportMyViewFilters');
        $("#sessionReportMyViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    //Unset Date value
    $("#sessionReportMyViewFilters").find(".cancelDates").on('click', function (e) 
    {
        loadGAReports('getSessionReport','sessionTrendLoaderId','sessionTrendGraphId');
        $("#sessionReportMyViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    //For Shared View Section
    $("#sessionReportSharedViewFilters").find(".applyTrafficDashboardDates").on('click', function (e) 
    {
        loadGAReports('getSessionReport','sessionTrendLoaderSharedViewId','sessionTrendGraphSharedViewId','sessionReportSharedViewFilters');
        $("#sessionReportSharedViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    //Unset Date value
    $("#sessionReportSharedViewFilters").find(".cancelDates").on('click', function (e) 
    {
        loadGAReports('getSessionReport','sessionTrendLoaderSharedViewId','sessionTrendGraphSharedViewId');
        $("#sessionReportSharedViewFilters > div.btn-group").removeClass('open');
        e.preventDefault();
    });
    
    //if college id is pre selected
    if(typeof selectedCollegeId !== 'undefined' && selectedCollegeId >0) {
        getAnalyticsData();
        
        if(typeof jsVars.loadPopUp !== 'undefined' && jsVars.loadPopUp ==1) {
            //After 3 seconds Trigger
            setTimeout(function() {
                $('#addRemoveBtnId').trigger('click');
            },3000);
        }
    }
    
    $('#trends-tab').on('click', function(){
        if($('#myViewTrends').val() == '') {
            //Unset Variable
            clearInterval(loadActiveUser);
            //First Time load Active User
            loadGAReports('getActiveUser', 'activeUsersLoaderId', 'activeUsersId');
            loadGAReports('weeklyReport','weekWiseLoaderId','weekWiseReportId');
            loadGAReports('getYearlyReport', 'yearWiseLoaderId','yearWiseReportId');
            loadGAReports('getSessionReport', 'sessionTrendLoaderId','sessionTrendGraphId');

            //Load every 30 seconds
            loadActiveUser = setInterval( function() { loadGAReports('getActiveUser', 'activeUsersLoaderId', 'activeUsersId'); }, refreshTime );
        }
        $('#myViewTrends').val('1');
    });
    
    $('#geographical-tab').on('click', function(){
        if($('#myViewGeographical').val() == '') {
            if(typeof initilizeTopCountryReport === "function"){
                initilizeTopCountryReport(); 
            }

            if(typeof initilizeTopStateReport === "function"){
                initilizeTopStateReport();
            }

            if(typeof initilizeTopCityReport === "function"){
                initilizeTopCityReport();
            }
        }
        $('#myViewGeographical').val('1');
    });
    
    $('#other-tab').on('click', function(){
        if($('#myViewOther').val() == '') {
            if(typeof initilizeTopDeviceCategoryReport === "function"){
                initilizeTopDeviceCategoryReport(); 
            }

            if(typeof initilizeTopPagesReport === "function"){
                initilizeTopPagesReport(); 
            }

            if(typeof initilizeNewVsReturningReport === "function"){
                initilizeNewVsReturningReport(); 
            }
        }
        $('#myViewOther').val('1');
    });
    
    $('#ads-tab').on('click', function(){
        if($('#myViewAds').val() == '') {
            if(typeof initilizeTopGoogleAdsCampaignReport === "function"){
                initilizeTopGoogleAdsCampaignReport(); 
            }        

            if(typeof initilizeGoogleAdsAdGroupReport === "function"){
                initilizeGoogleAdsAdGroupReport(); 
            }

            if(typeof initilizeGoogleAdsSearchQueryReport === "function"){
                initilizeGoogleAdsSearchQueryReport(); 
            }
        }
        $('#myViewAds').val('1');
    });
    
    
    $('#sharedViewGeographical-tab').on('click', function(){        
        if($('#SharedViewGeographical').val() == '') {
            if(typeof initilizeSharedViewTopCountryReport === "function"){
                initilizeSharedViewTopCountryReport(); 
            }

            if(typeof initilizeTopStateSharedReport === "function"){
                initilizeTopStateSharedReport();
            }

            if(typeof initilizeTopCitySharedViewReport === "function"){
                initilizeTopCitySharedViewReport();
            }
        }
        $('#SharedViewGeographical').val('1');
    });
    
    $('#sharedViewAds-tab').on('click', function(){
        if($('#sharedViewAds').val() == '') {
            if(typeof initilizeTopGoogleAdsSharedViewCampaignReport === "function"){
                initilizeTopGoogleAdsSharedViewCampaignReport(); 
            }        

            if(typeof initilizeGoogleAdsAdGroupSharedViewReport === "function"){
                initilizeGoogleAdsAdGroupSharedViewReport(); 
            }

            if(typeof initilizeGoogleAdsSearchQuerySharedViewReport === "function"){
                initilizeGoogleAdsSearchQuerySharedViewReport(); 
            }
        }
        $('#sharedViewAds').val('1');
    });
    
    $('#SharedViewOtherAnalysis-tab').on('click', function(){
        if($('#SharedViewOtherAnalysis').val() == '') {
            if(typeof initilizeTopDeviceCategorySharedViewReport === "function"){
                initilizeTopDeviceCategorySharedViewReport(); 
            }

            if(typeof initilizeTopPagesSharedViewReport === "function"){
                initilizeTopPagesSharedViewReport(); 
            }

            if(typeof initilizeNewVsReturningSharedViewReport === "function"){
                initilizeNewVsReturningSharedViewReport(); 
            }
        }
        $('#SharedViewOtherAnalysis').val('1');        
    });    
});



function getUserList(){
    $('#saveTrafficDashboardUserId').attr('disabled','disabled');
    $('#accessTo, #accessToErrorId').html('');
    $('#msg_response').hide();
    var postData = $('#dashboardForm').serializeArray();    
    $.ajax({
        url: '/connectors/google-analytics/getUserList',
        type: 'post',
        data: postData,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $("#pageLoader").show();
        },
        complete: function () {
            $("#pageLoader").hide();
        },
        success: function (response) {            
            
            if(typeof response.error !== 'undefined' && response.error == 'session_logout') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if(typeof response.userList !== 'undefined' && response.userList !== '') {
                var html= '';
                for(var key in response.userList)
                {
                    html += '<option value="'+key+'">'+response.userList[key]+'</option>';
                }
                    $('#accessTo').html(html);

                    if(typeof response.allowedToUserList !== 'undefined' && response.allowedToUserList !== '') {
                        var userList = [];
                        for (var i = 0; i < response.allowedToUserList.length; i++) {
                            userList[i] = response.allowedToUserList[i];
                        }
                        $("#accessTo").val(userList);
                    }
					
                    //$('#accessTo').trigger('chosen:updated');
                }
			$('#accessTo').SumoSelect({placeholder: 'Select Users *', search: true, searchText:'Search Users', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
                        $('#accessTo')[0].sumo.reload();
			//floatableLabel();			
            $('#saveTrafficDashboardUserId').removeAttr('disabled');            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#saveTrafficDashboardUserId').removeAttr('disabled');
        }
    });
}

function checkCollege(){
    clearInterval(loadActiveUser); 
    clearInterval(loadSharedViewActiveUser);
    $('#showFilterDivId').hide();
    if($("#collegeId").val() == '') return false;
}

/**
 * This function will return all user list who have subscribed fo GA Accounts
 * @returns {Boolean}
 */
function getSubscribedUserList(){
    clearInterval(loadActiveUser); 
    clearInterval(loadSharedViewActiveUser); 
    $('#showFilterDivId').hide();
    $('#collegeUserId').html('<option value="">Select User</option>');
    $('#collegeUserId').trigger('chosen:updated');
    
    if($("#collegeId").val() == '') return false;
    
    $('#saveTrafficDashboardUserId').attr('disabled','disabled');
    
    var postData = $('#dashboardForm').serializeArray();
    
    $.ajax({
        url: '/connectors/google-analytics/getSubscribedUserList',
        type: 'post',
        data: postData,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $("#pageLoader").show();
        },
        complete: function () {
            $("#pageLoader").hide();
        },
        success: function (response) {            
            
            if(typeof response.error !== 'undefined' && response.error == 'session_logout') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if(typeof response.userList !== 'undefined' && response.userList !== '') {
                var html= '<option value="">Select User</option>';
                for(var key in response.userList)
                {
                    html += '<option value="'+key+'">'+response.userList[key]+'</option>';
                }
                $('#collegeUserId').html(html);
                $('#collegeUserId').trigger('chosen:updated');                
            }
            $('#saveTrafficDashboardUserId').removeAttr('disabled');            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#saveTrafficDashboardUserId').removeAttr('disabled');
        }
    });
}

function getSharedViewUserList(){    
    $('#sharedView-tab').attr('disabled','disabled');
    $('#sharedByErrorDivId, #sharedByDivId').hide();
    var postData = $('#dashboardForm').serializeArray();
    $.ajax({
        url: '/connectors/google-analytics/getSharedViewList',
        type: 'post',
        data: postData,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $("#pageLoader").show();
        },
        complete: function () {
            $("#pageLoader").hide();
        },
        success: function (response) {            
            
            if(typeof response.error !== 'undefined' && response.error == 'session_logout') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if(typeof response.sharedUserList !== 'undefined') {
                var totalUser = Object.keys(response.sharedUserList).length;
                if(totalUser > 0) {
                    var html= '';
                    for(var key in response.sharedUserList)
                    {
                        var selected = '';
                        if(totalUser == 1) {
                            selected = 'selected="selected"';
                        }
                        html += '<option value="'+key+'" '+selected+'>'+response.sharedUserList[key]+'</option>';
                    }
                    $('#sharedBy').html(html);
                    $('#sharedBy').trigger('chosen:updated');
                    $('#sharedByDivId').show();
                    
                    if(totalUser == 1) {
                        showSharedByGraph();
                    }
                } else {
                    $('#sharedByErrorDivId').html('<div class="text-center mt-5 mb-5" style="font-size:18px;"><i class="fa fa-database " aria-hidden="true"></i>&nbsp;There is no any record found.</div>');
                    $('#sharedByErrorDivId').show();
                }
            }
            $('#sharedView-tab').removeAttr('disabled');
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#sharedView-tab').removeAttr('disabled');
        }
    });
}

function showSharedByGraph(){
    if($("#sharedBy").val() == '') {
        $('#sharedByErrorDivId, #sharedViewContainer').hide();
        return false;
    }
    
    $('#sharedView-tab').attr('disabled','disabled');
    $('#sharedByErrorDivId').hide();
    $('#sharedViewContainer').show();
    $.ajax({
        url: '/connectors/google-analytics/showDashboardGraphByUser',
        type: 'post',
        data: {params:$("#sharedBy").val(),'collegeId': $("#collegeId").val()},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $("#pageLoader").show();
        },
        complete: function () {
            $("#pageLoader").hide();
        },
        success: function (response) {            
            $("#pageLoader").hide();
            if(typeof response.message !== 'undefined' && response.message == 'session_logout') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if(typeof response.status !== 'undefined' && response.status==1) {
                $('#sharedViewContainer, #sharedByDivId').show();
                        if(Object.keys(response.weeklyReport).length > 0) {
                    
                            if(typeof response.weeklyReport.error !== 'undefined' && response.weeklyReport.error != '') {
                                $('#weekWiseReportSharedViewId').html(response.weeklyReport.error);
                                $('#weekWiseLoaderSharedViewId').hide();
                            } else {
                                renderWeekWiseChart(response,'weekWiseLoaderSharedViewId','weekWiseReportSharedViewId');
                            }
                        }
                        if(Object.keys(response.yearlyReport).length > 0) {
                            if(typeof response.yearlyReport.error !== 'undefined' && response.yearlyReport.error != '') {
                                $('#yearWiseReportSharedViewId').html(response.yearlyReport.error);
                                $('#yearWiseLoaderSharedViewId').hide();
                            } else {
                                renderYearWiseChart(response,'yearWiseLoaderSharedViewId','yearWiseReportSharedViewId');
                            }

                        }
                        if(Object.keys(response.sessionReport).length > 0) {
                            if(typeof response.sessionReport.error !== 'undefined' && response.sessionReport.error != '') {
                                $('#sessionTrendGraphSharedViewId').html(response.sessionReport.error);
                                $('#sessionTrendLoaderSharedViewId').hide();
                            } else {
                                renderSessionWiseChart(response,'sessionTrendLoaderSharedViewId','sessionTrendGraphSharedViewId');
                            }

                        }
                        if(Object.keys(response.realTimeData).length > 0) {  
                            if(typeof response.realTimeData.error !== 'undefined' && response.realTimeData.error != '') {
                                $('#sharedByActiveUsersId').html(response.realTimeData.error);
                                $('#sharedByActiveUsersLoaderId').hide();
                            } else {
                                renderActiveUser(response,'sharedByActiveUsersLoaderId','sharedByActiveUsersId');

                                loadSharedViewActiveUser = setInterval( function() { loadGAReports('getActiveUser', 'sharedByActiveUsersLoaderId','sharedByActiveUsersId'); }, refreshTime );
                            }                    
                        }
                }
            $('#sharedView-tab').removeAttr('disabled');
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#sharedView-tab').removeAttr('disabled');
            $("#pageLoader").hide();
        }
    });
}

function saveTrafficDashboardUser(){
    $('.error').hide();
    if($('#accessTo').val() == '' || $('#accessTo').val() == null) {        
        //$('#accessTo').next('div').after('<span class="error">Please select users</span>').show();
        //return false;
    }
    
    $('#accessToErrorId').html('');
    
    $('#saveTrafficDashboardUserId').attr('disabled','disabled');
    var postData = $('#dashboardForm').serializeArray();
    postData.push({name:"accessTo",value:$("#accessTo").val()});
    $.ajax({
        url: '/connectors/google-analytics/saveTrafficDashboardUser',
        type: 'post',
        data: postData,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $("#pageLoader").show();
        },
        complete: function () {
            $("#pageLoader").hide();
        },
        success: function (response) {            
            console.log(response.error);
            if(typeof response.session_logout !=='undefined' && response.session_logout != '') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if(typeof response.error !=='undefined' && response.error != '') {
                $('#accessToErrorId').addClass('text-danger').html(response.error).show();
            }else if(typeof response.message !=='undefined' && response.message != '') {
                //alertPopup(response.message, 'success');
				$('#msg_response').html('<small style="font-size:12px;">'+response.message+'</small>').show();
				setTimeout(function() {
					$("#msg_response").hide();
				}, 5000);
            }            
            $('#saveTrafficDashboardUserId').removeAttr('disabled');
			
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#saveTrafficDashboardUserId').removeAttr('disabled');
        }
    });
}

function alertPopup(msg, type, location) {
    if (type === 'error') {
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

    if (typeof location !== 'undefined') {
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

/**
 * Get all Data as per selected collegeId and user
 * @returns {Boolean}
 */
function getAnalyticsData(){
    $(".dashboardErrorMsg").remove();
    var collegeUserId = 0;
    if($("#collegeId").val()===""){        
        $("#collegeId").parent().append('<small class="text-danger fw-500 dashboardErrorMsg">Please select college.</small>');
        return false;
    }    
    
    if($("#collegeUserId").length){
        if($("#collegeUserId").val()=="") {
            $("#collegeUserId").parent().append('<small class="text-danger fw-500 dashboardErrorMsg">Please select user.</small>');
            return false;
        } else {
            collegeUserId = $("#collegeUserId").val();
        }
    }
    
    $('#myViewGeographical, #myViewAds, #myViewOther, #SharedViewGeographical, #sharedViewAds, #SharedViewOtherAnalysis, #myViewTrends, #SharedViewTrends').val('');
    $('#trafficSearchBtnId').attr('disabled','disabled');
    
    //Hide All Div
    $('#weekWiseReportId, #sessionTrendGraphId, #yearWiseReportId').html('');
    $('#weekWiseLoaderId, #yearWiseLoaderId, #sessionTrendLoaderId').show();
    
    $('#accountId, #propertyId, #viewId').html('').attr('disabled','disabled');
    $('#accountId, #propertyId, #viewId').trigger('chosen:updated');
    $('#activeUsersId').html('').hide();
    $('#weekWiseReportId, #yearWiseReportId, #sessionTrendGraphId').html('');
    $('#disconnectBtnId, #addRemoveBtnId').attr('disabled','disabled').hide();
    
    var postData = $('#dashboardForm').serializeArray();
    postData.push({name:"collegeUserId",value:collegeUserId});
        
    //Unset variable
    clearInterval(loadActiveUser);
    $.ajax({
        url: '/connectors/google-analytics/getDataByCollege',
        type: 'post',
        data: postData,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $("#pageLoader").show();
        },
        complete: function () {
            $("#pageLoader").hide();
        },
        success: function (response) {
            
            if(response.status==1){
                $('#showLoginURL, #accountDropdownDiv, #trafficDashboardContainer, #myViewReportTabList').hide();
                if(typeof response.loginURL !== 'undefined' && response.loginURL != '') {
                    $('#showFilterDivId').show();
                    $('#showLoginURL').html('<div class="lwg"><i class="lineicon-43 fa-3x"></i><br>You have not subscribed to any GA Accounts<br><a href="'+response.loginURL+'">Click Here to Login With Google</a></div>');
                    $('#showLoginURL').show();
                } else {
                    $('#showFilterDivId, #trafficDashboardContainer, #myViewReportTabList').show();
                    
                    getAllAccountsList(response);
                    
                    loadPropertyListByAccountId();
                    
                    $('#accountDropdownDiv').show();
                }                
            }else{
                if (response.message === 'session_logout'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(response.message, 'error');
                }
            }            
            $('#trafficSearchBtnId').removeAttr('disabled');
            if (document.documentElement.clientWidth > 992) {
                    tourGaHelp()
            };
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#trafficSearchBtnId').removeAttr('disabled');
        }
    });
    
}

/**
 * This function will return all Property List as per account ID
 * @returns {undefined}
 */
function loadPropertyListByAccountId(){
    //var accountId = $('#accountId option:selected').val();
    $('#propertyId, #viewId').html('').attr('disabled','disabled');
    //$('#propertyId, #viewId').parent('div').hide();
    $('#propertyId, #viewId').trigger('chosen:updated');
    
    var collegeUserId = 0;
    if($("#collegeUserId").length){        
        collegeUserId = $("#collegeUserId").val();
    }
    var postData = $('#dashboardForm').serializeArray();
    postData.push({name:"collegeUserId",value:collegeUserId});
    
    $.ajax({
        url: '/connectors/google-analytics/getPropertyListByAccountId',
        type: 'post',
        data: postData,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $("#pageLoader").show();
        },
        complete: function () {
            $("#pageLoader").hide();
        },
        success: function (response) {            
            
            if(response.status==1){
                
                if(typeof response.propertyList !== 'undefined' && response.propertyList !== '') {
                    var html= '';
                    for(var key in response.propertyList)
                    {
                        html += '<option value="'+key+'">'+response.propertyList[key]+'</option>';
                    }
                    $('#propertyId').html(html);
                    $('#propertyId').removeAttr('disabled');
                    $('#propertyId').trigger('chosen:updated');
                    
                    loadViewListByPropertyId();
                }
            }else{
                if (response.message === 'session_logout'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(response.message, 'error');
                }
            }            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#trafficSearchBtnId').removeAttr('disabled');
            //alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });    
}

function disconnectAccount(){
    $("#ConfirmPopupArea").css({'z-index':'120000'});
    $('#ConfirmMsgBody').html('Are you sure to disconnect?');
	$('#confirmYes').css('margin', '10px');
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmYes', function (e) {
            e.preventDefault();
            $('#ConfirmPopupArea').modal('hide');

            $.ajax({
                url: '/connectors/google-analytics/disconnectAccount',
                type: 'post',
                dataType: 'json',
                data: {collegeId:$("#collegeId").val()},
                headers: {
                    "X-CSRF-Token": jsVars._csrfToken
                },
                beforeSend: function() {
                    //$("#reallocate_btn").attr("disabled",'disabled');
                },
                complete: function() {                   
                    //$("#reallocate_btn").removeAttr("disabled");
                },
                success: function (json) {
                    if(typeof json['session_logout'] !=='undefined' && json['session_logout'] !== ''){
                        location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                    }
                    if(typeof json['error'] !=='undefined' && json['error'] !== ''){
                        alertPopup(json['error'],'error');
                    }
                    else if(typeof json['message'] !=='undefined' && json['message'] !== ''){
                        alertPopup(json['message'],'success');
                        setTimeout(function(){
			  location = jsVars.FULL_URL+'/analytics/ga-dashboard';
			}, 2000);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
    });
}

/**
 * This function will load all view list
 * @returns {undefined}
 */
function loadViewListByPropertyId(){  
    $('#myViewGeographical, #myViewAds, #myViewOther, #SharedViewGeographical, #sharedViewAds, #SharedViewOtherAnalysis').val('');
    var accountId = $('#accountId option:selected').val();
    var propertyId = $('#propertyId option:selected').val();
    $('#weekWiseReportId, #sessionTrendGraphId, #yearWiseReportId').html('');
    $('#weekWiseLoaderId, #yearWiseLoaderId, #sessionTrendLoaderId').show();
    
    var collegeUserId = 0;
    if($("#collegeUserId").length){        
        collegeUserId = $("#collegeUserId").val();
    }
    
    var postData = $('#dashboardForm').serializeArray();
    postData.push({name:"collegeUserId",value:collegeUserId});
    
    if(accountId != '' && propertyId != '') {
        $.ajax({
            url: '/connectors/google-analytics/getViewList',
            type: 'post',
            data: postData,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () { 
                $("#pageLoader").show();
            },
            complete: function () {
                $("#pageLoader").hide();
            },
            success: function (response) {            

                if(response.status==1){
                    if(typeof response.viewList !== 'undefined' && response.viewList !== '') {
                        var html= '';
                        for(var key in response.viewList)
                        {
                            html += '<option value="'+key+'">'+response.viewList[key]+'</option>';
                        }
                        $('#viewId').html(html).removeAttr('disabled').trigger('chosen:updated'); 
                        
                        $('#trafficDashboardContainer').show();
                        
                        if($('#myview').hasClass('active')) {
                            var myViewId = $('#myViewReportTabList').find('li.active > a').attr('id');
                            switch(myViewId) {                
                                case 'geographical-tab':
                                    $('#geographical-tab').trigger('click');
                                    break;
                                case 'ads-tab':
                                    $('#ads-tab').trigger('click');
                                    break;
                                case 'other-tab':
                                    $('#other-tab').trigger('click');
                                    break;
                                default:
                                    loadGAReports('weeklyReport', 'weekWiseLoaderId','weekWiseReportId');
                                    loadGAReports('getYearlyReport', 'yearWiseLoaderId','yearWiseReportId');
                                    loadGAReports('getSessionReport', 'sessionTrendLoaderId','sessionTrendGraphId');

                                    //First Time load Active User
                                    loadGAReports('getActiveUser', 'activeUsersLoaderId','activeUsersId');

                                    //Load every 30 seconds
                                    loadActiveUser = setInterval( function() { loadGAReports('getActiveUser', 'activeUsersLoaderId','activeUsersId'); }, refreshTime );
                            }
                        }
                        $('#disconnectBtnId, #addRemoveBtnId').removeAttr('disabled').show();
                    }
                }else{
                    if (response.message === 'session_logout'){
                        location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                    }else{
                        alertPopup(response.message, 'error');
                    }
                }            
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $('#trafficSearchBtnId').removeAttr('disabled');
            }
        });
    }
}

/**
 * This will Load all Graphs as per Type
 * @param {type} reportType
 * @returns {undefined}
 */
function loadGAReports(reportType,loaderId,reportId,dateFilterDivId){
    var accountId = $('#accountId option:selected').val();
    var propertyId = $('#propertyId option:selected').val();
    var viewId = $('#viewId option:selected').val();
    var collegeUserId = 0;
    if($("#collegeUserId").length){        
        collegeUserId = $("#collegeUserId").val();
    }
    
    if(accountId != '' && propertyId != '' && viewId != '') {
        
        var postData = $('#dashboardForm').serializeArray();
        if(typeof dateFilterDivId !== 'undefined' && $('#'+dateFilterDivId).length) {            
            if($("#"+dateFilterDivId).find('.inputBaseStartDate').val() != '' && $("#"+dateFilterDivId).find('.inputBaseEndDate').val() != '') {
                postData.push({name:"startDate",value:$("#"+dateFilterDivId).find('.inputBaseStartDate').val()});
                postData.push({name:"endDate",value:$("#"+dateFilterDivId).find('.inputBaseEndDate').val()}); 
            }
        }        
        postData.push({name:"reportType",value:reportType});
        
        $.ajax({
            url: '/connectors/google-analytics/getAnalyticsReportByType',
            type: 'post',
            data: postData,
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () { 
                //if class not exist then show loader
                if($('#'+reportId).hasClass('userActiveClass') === false) {
                    $('#'+loaderId).show();
                }
            },
            complete: function () {
                $('#'+loaderId).hide();
            },
            success: function (response) {            
                $('#'+loaderId).hide();
                
                if(response.status==1){
                    
                    switch(reportType) {
                        case 'weeklyReport':
                            renderWeekWiseChart(response,loaderId,reportId);
                            break;
                        case 'getYearlyReport':
                            renderYearWiseChart(response,loaderId,reportId);
                            break;
                        case 'getSessionReport':
                            renderSessionWiseChart(response,loaderId,reportId);
                            break;
                        case 'getActiveUser':
                            renderActiveUser(response,loaderId,reportId);
                            break;
                    }
                }else{
                    if (typeof response.message !== 'undefined'){
                        
                        if(response.message == 'session_logout' || response.message=='empty_data') {
                            location = jsVars.GAAnalyticsURL;
                        }else {
                            $('#'+reportId).html(response.message);
                        }
                    }
                }
                
                
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $('#'+loaderId).hide();
                $('#trafficSearchBtnId').removeAttr('disabled');
            }
        });
    }
}

function saveAndGetAuthorization(response){  
    $.ajax({
        url: '/connectors/google-analytics-oauth2callback',
        type: 'post',
        data: {collegeId:$("#collegeId").val(), 'response':response},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $("#pageLoader").show();
        },
        complete: function () {
            $("#pageLoader").hide();
        },
        success: function (response) { 
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                $("#allDashletsContainer").html(responseObject.data.html);
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    //alertPopup(responseObject.message);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr);
            console.log(thrownError);
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getAllAccountsList(response) {
    
    // Handles the response from the accounts list method.
  if (typeof response.accountList && response.accountList !== '') {
    var html= '';
    for(var key in response.accountList)
    {
        html += '<option value="'+key+'">'+response.accountList[key]+'</option>';
    }
    $('#accountId').html(html);
    $('#accountId').removeAttr('disabled');
    //$('#accountId').parent('div').show();
    $('#accountId').trigger('chosen:updated');    
  } else {
    console.log('No accounts found for this user.');
  }
}

function renderWeekWiseChart(response,loaderId,renderId) { 
    $('#'+loaderId).show();
    if(typeof response.weeklyReport.previousWeekData !== 'undefined' && response.weeklyReport.previousWeekData.length >0 && typeof response.weeklyReport.currentWeekData !== 'undefined') {
        var lastWeekData = [];
        var labelData = [];
        $.map( response.weeklyReport.previousWeekData, function( property, i ) {
            lastWeekData.push({value: property.value});
            labelData.push({label: property.name});
        });
        
        var thisWeekData = [];
        $.map( response.weeklyReport.currentWeekData, function( property, i ) {
            thisWeekData.push({value: property.value});
        });
      
      FusionCharts.ready(function(){
	    var fusioncharts = new FusionCharts({
		type: "scrollarea2d",
		renderAt: renderId,
		width: "100%",
		height: "300",
		dataFormat: "json",
		dataSource :{
                        "chart": {
                            //"caption": "This Week vs Last Week:(By sessions)",
                            //"subCaption": "By sessions",
                            //"xaxisname": "Date",
                            //"yaxisname": "Count",
                            "drawAnchors": "1",
							//"anchorbgcolor": "#1f77b4",
							//"palettecolors": "#1f77b4",
							"anchorRadius": "3",
							"anchorBorderColor": "#1f77b4",
							"anchorBgColor": "#e6f4f9",
                            "vDivLineThickness": "1",                         
                            "baseFont": "Roboto",
                            "baseFontSize": "12",
                            "drawcrossline": "1",
                            "flatScrollBars": "1",
                            "scrollheight": "10",
                            "theme": "fusion",
                            "numVDivLines": "5",
                            "vDivLineColor": "#99ccff",
                            "vDivLineAlpha": "50",
                            "formatNumber" : "0",
                            "formatNumberScale" : "0",
                            "sFormatNumber" : "0",
                            "sFormatNumberScale" : "0",
                        },
                        "categories": [
                          {
                            category: labelData
                          }
                        ],
                        "dataset": [
                          {
                            seriesname: "Last Week",
                            data: lastWeekData,
                            color: "#e6f4f9"
                          },
                          {
                            seriesname: "This Week",
                            data: thisWeekData,
                            color: "#1f77b4"
                          }
                        ]
                    }
	    });
	    fusioncharts.render();    
	});
    } else {
        $('#'+renderId).html('No record found');
    }    
    $('#'+loaderId).hide();
  }

function renderYearWiseChart(response,loaderId,renderId) { 
    $('#'+loaderId).show();
    
    if(typeof response.yearlyReport.previousYearData !== 'undefined' && response.yearlyReport.previousYearData.length > 0 && typeof response.yearlyReport.thisYearData !== 'undefined') {
        var thisYearData = [];        
        $.map( response.yearlyReport.thisYearData, function( property, i ) {
            thisYearData.push({value: property.value});            
        });

        var lastYearData = [];
        var metricsData = [];
        $.map( response.yearlyReport.previousYearData, function( property, i ) {
            lastYearData.push({value: property.value});
            metricsData.push({label: property.name});
        });
      
      FusionCharts.ready(function(){
	    var fusioncharts = new FusionCharts({
		type: "scrollcolumn2d",
		renderAt: renderId,
		width: "100%",
		height: "340",
		dataFormat: "json",
		dataSource :{
                        "chart": {
                            //"caption": "This Year vs Last Year(by users)",
                            "flatScrollBars": "1",
                            "drawAnchors": "1",
                            "scrolltoend": "1",
                            "scrollPadding" : "10",
                            "scrollheight": "6",
                            "numVDivLines": "1",
                            "vDivLineColor": "#99ccff",
                            "vDivLineThickness": "1",
                            "vDivLineAlpha": "1",                            
                            "formatNumber" : "0",
                            "formatNumberScale" : "0",
                            "sFormatNumber" : "0",
                            "sFormatNumberScale" : "0",
                            "baseFont": "Roboto",
                            "baseFontSize": "12",
                            "drawcrossline": "1",
                            "theme": "fusion",
                        },
                        "categories": [
                          {
                            category: metricsData
                          }
                        ],
                        "dataset": [
                          {
                            seriesname: response.yearlyReport.previousYear,
                            data: lastYearData,
                            color: "#e6f4f9",
                            drawAnchors: "1",
                            "plottooltext": "$label $seriesName - <b>$dataValue</b>",
                          },
                          {
                            seriesname: response.yearlyReport.thisYear,
                            data: thisYearData,
                            color: "#1f77b4",
                            drawAnchors: "1",
                            "plottooltext": "$label $seriesName - <b>$dataValue</b>",
                          }
                        ]
                    }
	    });
	    fusioncharts.render();    
	});        
    } else {
        $('#'+renderId).html('No record found');
    }
    $('#'+loaderId).hide();
  }

/**
 * This function will render Active User on the site
 * @param {type} response
 * @returns {undefined}
 */
function renderActiveUser(response,loaderId,renderId) {
    $('#'+loaderId).hide();
    var overViewDivId;
    if(renderId == 'sharedByActiveUsersId'){
        $('#sharedViewactiveUserId').fadeIn();
        $('.panel-aUsers').addClass('panel-highlight');
        overViewDivId = 'id-overviewSummarySharedView';
    } else {
        $('#myViewactiveUserId').fadeIn();
        $('.panel-aUsers').addClass('panel-highlight');
        overViewDivId = 'id-overviewSummary';
    }
    
    if($('#'+renderId).hasClass('userActiveClass') === false) {
        $('#'+renderId).addClass('userActiveClass');
    }
    
    $('#'+renderId).fadeIn();
    if(typeof response.realTimeData !== 'undefined' && typeof response.realTimeData.realTimeUser !== 'undefined' && response.realTimeData.realTimeUser !== '') {
        var previousTotalUser = parseInt($('#activeUsersId').text());
        var totalActiveUser = response.realTimeData.realTimeUser;
        $('#'+renderId).html(response.realTimeData.realTimeUser).show();
        
		// For Color Indication
		if(previousTotalUser > totalActiveUser){
			$('#activeUsersId').css('text-shadow', 'rgb(237, 86, 27) 0px 0px 100px');
			setTimeout(function(){
			  $('#activeUsersId').css('text-shadow', 'rgb(255, 255, 255) 0px 0px 100px');
			}, 3000);

		}else{
			$('#activeUsersId').css('text-shadow', 'rgb(80, 180, 50) 0px 0px 100px');
			setTimeout(function(){
			  $('#activeUsersId').css('text-shadow', 'rgb(255, 255, 255) 0px 0px 100px');
			}, 3000);
		}
		
        //For Percentage
        if(parseInt(totalActiveUser) > 0 && typeof response.realTimeData.deviceWiseActiveUser !== 'undefined' && response.realTimeData.deviceWiseActiveUser !== '') {
            $('#'+overViewDivId).show();
            
            var mobileId = 'myViewMobileId';
            var desktopId = 'myViewDesktopId';
            var tabletId = 'myViewTabletId';
            
            var mobileSpanId = 'myViewMobileSpanId';
            var desktopSpanId = 'myViewDesktopSpanId';
            var tabletSpanId = 'myViewTabletSpanId';
            
            //FOr SharedView
            if(renderId == 'sharedByActiveUsersId'){
                mobileId = 'sharedViewMobileId';
                desktopId = 'sharedViewDesktopId';
                tabletId = 'sharedViewTabletId';
                
                var mobileSpanId = 'sharedViewMobileSpanId';
                var desktopSpanId = 'sharedViewDesktopSpanId';
                var tabletSpanId = 'sharedViewTabletSpanId';
            }
            
            var mobilePercentage = response.realTimeData.deviceWiseActiveUser.mobilePercentage;
            var mobileWidth = (mobilePercentage != 0 && mobilePercentage < 1)?1:mobilePercentage;
            
            var desktopPercentage = response.realTimeData.deviceWiseActiveUser.desktopPercentage;
            var desktopWidth = (desktopPercentage != 0 && desktopPercentage < 1)?1:desktopPercentage;
            
            var tabletPercentage = response.realTimeData.deviceWiseActiveUser.tabletPercentage;
            var tabletWidth = (tabletPercentage != 0 && tabletPercentage < 1)?1:tabletPercentage;
            
            if(tabletWidth == 1) {
                if(desktopWidth >0 && desktopWidth > mobileWidth) {
                    desktopWidth--;
                }else if(mobileWidth >0 && mobileWidth > desktopWidth) {
                    mobileWidth--;
                }
            }
            
            //For Mobile
            if(mobileWidth > 0) {
                $('#'+mobileId).text(mobilePercentage+'%').css('width',mobileWidth+'%').show();
                $('#'+mobileSpanId).show();
            } else {
                $('#'+mobileSpanId).hide();
                $('#'+mobileId).hide();
            }
            
            //For Desktop
            if(desktopWidth > 0) {
                $('#'+desktopId).text(desktopPercentage+'%').css('width',desktopWidth+'%').show();
                $('#'+desktopSpanId).show();
            } else {
                $('#'+desktopSpanId).hide();
                $('#'+desktopId).hide();
            }
            
            //For Tablet
            if(tabletWidth > 0) {
                $('#'+tabletId).text('').css('width',tabletWidth+'%').show();
                $('#'+tabletSpanId).find('span').html('Tablet ['+tabletPercentage+'%]');
                $('#'+tabletSpanId).show();
				$('.gaqKb').removeClass('tabletRemove');
            } else {
                $('#'+tabletSpanId).hide();
                $('#'+tabletId).hide();
				$('.gaqKb').addClass('tabletRemove');
            }
        } else {
            $('#'+overViewDivId).hide();
        }
    }
 }
 
function renderSessionWiseChart(response,loaderId,renderId) { 
    $('#'+loaderId).show();
    if(typeof response.sessionReport.sessionData !== 'undefined' && response.sessionReport.sessionData.length > 0) {
        var dateDivId = 'myViewViewDateRange';
        if(renderId == 'sessionTrendGraphSharedViewId') {
            dateDivId = 'sharedViewDateRange';
        }
        
        $('#'+dateDivId).html(response.sessionReport.startDate + ' To ' + response.sessionReport.endDate);
        
        var graphData = [];
        $.map( response.sessionReport.sessionData, function( property, i ) {
            graphData.push({value: property.value, label: property.name});
        });
      
      FusionCharts.ready(function(){
	    var fusioncharts = new FusionCharts({
			type: "spline",
			renderAt: renderId,
			width: "100%",
			height: "320",
			dataFormat: "json",
			dataSource :{
			"chart": {
				//caption: "Session Trend",
				//"xaxisname": "Date",
				"plottooltext": "Sessions on $label is <b>$dataValue</b>",
				"showhovereffect": "1",
				"showvalues": "0",
				"theme": "fusion",
				"anchorbgcolor": "#e6f4f9",
				"palettecolors": "#1f77b4",
				"formatNumber" : "0",
				"formatNumberScale" : "0",
				"sFormatNumber" : "0",
				"sFormatNumberScale" : "0"
			},
			"data": graphData
		}
	    });
	    fusioncharts.render();    
	});
    } else {
        $('#'+renderId).html('No record found');
    }
    $('#'+loaderId).hide();
 }
 
 function tourGaHelp(){
	var tourGaAnalytics= new Tour({
		steps: [
			  {
				element: "#myview-tab",
				title: "My View",
				content: "View your own personalized traffic dashboard linked with your Google Analytics account.",
				template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-xs btn-npf pull-right' data-role='next'>Next »</button></nav></div>",
				placement: "right",
			  },
			  {
				element: "#sharedView-tab",
				title: "Shared View",
				content: "View the traffic dashboard shared by the other users from the college. ",
				template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-xs btn-npf pull-right' data-role='next'>Next »</button><button class='btn btn-xs btn-secondary-2 pull-right margin-right-15' data-role='prev'>« Prev</button></nav></div>",
				placement: "right",
			  },
			  {
				element: "#accountId_chosen",
				title: "Account",
				content: "Manage and switch between your Account, Property, and Views of the Google Analytics account connected with your NoPaperForms account.",
				template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-xs btn-npf pull-right' data-role='next'>Next »</button><button class='btn btn-xs btn-secondary-2 pull-right margin-right-15' data-role='prev'>« Prev</button></nav></div>",
				placement: "right",
			  },
			  {
				element: "#disconnectBtnId",
				title: "Disconnect",
				content: "Disconnect your Google Analytics with your NoPaperForms account.",
				template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-xs btn-npf pull-right' data-role='next'>Next »</button><button class='btn btn-xs btn-secondary-2 pull-right margin-right-15' data-role='prev'>« Prev</button></nav></div>",
				placement: "top",
			  },
			  {
				element: "#addRemoveBtnId",
				title: "Add Remove Users",
				content: "Manage and share the view among the users who you want to see the Traffic Analytics Dashboard along with you. They can view the dashboard in the <strong>Shared View</strong> tab.",
				template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-xs btn-npf pull-right' data-role='next'>Next »</button><button class='btn btn-xs btn-secondary-2 pull-right margin-right-15' data-role='prev'>« Prev</button></nav></div>",
				placement: "top",
			  },
			  {
				element: "#trends-tab",
				title: "Trands",
				content: "Check and compare the website traffic, sessions, and users in the time interval specified.",
				template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-xs btn-npf pull-right' data-role='next'>Next »</button><button class='btn btn-xs btn-secondary-2 pull-right margin-right-15' data-role='prev'>« Prev</button></nav></div>",
				placement: "top",
			  },
			  {
				element: "#geographical-tab",
				title: "Geographical",
				content: "Check the number of sessions, users and other key metrics of your website on the basis of Country, States, and Cities.",
				template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-xs btn-npf pull-right' data-role='next'>Next »</button><button class='btn btn-xs btn-secondary-2 pull-right margin-right-15' data-role='prev'>« Prev</button></nav></div>",
				placement: "top",
			  },
			  {
				element: "#other-tab",
				title: "Other Analysis",
				content: "Check other important data points related to your website traffic, session and users.",
				template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-npf btn-xs pull-right' data-role='end'>End tour</button><button class='btn btn-xs btn-secondary-2 pull-right margin-right-15' data-role='prev'>« Prev</button></div>",
				placement: "left",
			  },
			],
		name : 'gAHelp',
		storage: window.localStorage,
		backdrop: true,
		backdropContainer : 'body',
	});  
	// Initialize the tour
	tourGaAnalytics.init();
	// Start the tour
	tourGaAnalytics.start();
}