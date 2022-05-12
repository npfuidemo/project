var dashletOrders   = false;
$("document").ready(function() {
    $('[data-toggle="popover"]').popover();

    var dashletFound    = false;
    
    if(typeof initilizeScoreBoard === "function"){
       initilizeScoreBoard();
       dashletFound   = true;
    }
    if(typeof initilizeAppTimeSlotWise === "function"){
       initilizeAppTimeSlotWise();
       dashletFound   = true;
    }
    
    if(typeof initilizeConversionFunnel === "function"){
       initilizeConversionFunnel();
       dashletFound   = true;
    }

    if(typeof initilizeTimeSlotWise === "function"){
       initilizeTimeSlotWise();
       dashletFound   = true;
    }

    if(typeof initilizeemailCommStats === "function"){
       initilizeemailCommStats();
       dashletFound   = true;
    }

    if(typeof initilizesmsCommStats === "function"){
       initilizesmsCommStats();
       dashletFound   = true;
    }

    if(typeof initilizeLeadVsApplication === "function"){
        initilizeLeadVsApplication();
       dashletFound   = true;
    }
    if(typeof initilizeOriginPerformance === "function"){
        initilizeOriginPerformance();
       dashletFound   = true;
    }
    if(typeof initilizeStateWise === "function"){
        initilizeStateWise();
       dashletFound   = true;
    }
    if(typeof initilizeCountryWise === "function"){
        initilizeCountryWise();
       dashletFound   = true;
    }
    if(typeof initilizeZoneWise === "function"){
        initilizeZoneWise();
       dashletFound   = true;
    }
    if(typeof initilizeFormStageWiseSegregation === "function"){
        initilizeFormStageWiseSegregation();
       dashletFound   = true;
    }
    if(typeof initilizeFormWiseApplicationsTable === "function"){
        initilizeFormWiseApplicationsTable();
       dashletFound   = true;
    }
    if(typeof initilizeApplicationFunnel === "function"){
        initilizeApplicationFunnel();
        dashletFound   = true;
    }
    if(typeof initilizeTopSourceTable === "function"){
        initilizeTopSourceTable();
       dashletFound   = true;
    }
    if(typeof initilizeUrlLeadCountTable === "function"){
        initilizeUrlLeadCountTable();
       dashletFound   = true;
    }
    if(typeof initilizeSchoolPreferencesTable === "function"){
        initilizeSchoolPreferencesTable();
       dashletFound   = true;
    }
    if(typeof initilizeExamAttemptsGraph === "function"){
        initilizeExamAttemptsGraph();
       dashletFound   = true;
    }
    if(typeof initilizePrepSalesGraph === "function"){
        initilizePrepSalesGraph();
       dashletFound   = true;
    }
    if(typeof initilizeLeadTrend === "function"){
        initilizeLeadTrend();
       dashletFound   = true;
    } 
    if(typeof initilizeApplicationTrend === "function"){
        initilizeApplicationTrend();
       dashletFound   = true;
    }
    if(typeof initilizeLeadToApplicationConversionTrend === "function"){
        initilizeLeadToApplicationConversionTrend();
       dashletFound   = true;
    }
    if(typeof initilizeTopStateCities === "function"){
        initilizeTopStateCities();
       dashletFound   = true;
    }
    if(typeof initilizeSchoolPreferencesCount === "function"){
        initilizeSchoolPreferencesCount();
       dashletFound   = true;
    } 
    if(typeof initilizeChatbotConsumtionAndConversions === "function"){
        initilizeChatbotConsumtionAndConversions();
       dashletFound   = true;
    } 
    
    if(typeof initilizeCountryWiseSchoolPreferencesData === "function"){
        initilizeCountryWiseSchoolPreferencesData();
       dashletFound   = true;
    } 
  
    if(typeof initilizeCourseVsStageTable === "function"){
        initilizeCourseVsStageTable();
        dashletFound   = true;
    } 
    if(typeof initilizeCounsellorWiseLeadApplication === "function"){
        initilizeCounsellorWiseLeadApplication();
       dashletFound   = true;
    }    
    if(typeof initilizeCounsellorFollwUpTable === "function"){
        initilizeCounsellorFollwUpTable();
       dashletFound   = true;
    }
    if(typeof initilizeIvrReportsTable === "function"){
        initilizeIvrReportsTable();
        dashletFound   = true;
    }
    if(typeof initilizeLeadAnalysisReport === "function"){
        initilizeLeadAnalysisReport();
        dashletFound   = true;
    }
    if(typeof initilizeCallNotesWiseReport === "function"){
        initilizeCallNotesWiseReport();
        dashletFound   = true;
    }
    if(typeof initilizeCounsellorCallingReport === "function"){
        initilizeCounsellorCallingReport();
        dashletFound   = true;
    }
    if(typeof initilizeCounsellorEffortAnalysis === "function"){
        initilizeCounsellorEffortAnalysis();
        dashletFound   = true;
    }
    
    if(typeof initilizesmsdeviceReports === "function"){
       initilizesmsdeviceReports();
       dashletFound   = true;
    }
    
    if(typeof initilizeLeadScoreReports === "function"){
       initilizeLeadScoreReports();
       dashletFound   = true;
    }
    
    if(typeof initilizewhatsappCommStats === "function"){
       initilizewhatsappCommStats();
       dashletFound   = true;
    }
    if(typeof initilizeQmsReport === "function"){
        initilizeQmsReport();
        dashletFound   = true;
    }    
    if(typeof initilizeIvrCampaignReport === "function"){
        initilizeIvrCampaignReport();
        dashletFound   = true;
    }    
    if(typeof initilizeIvrCounsellorCustomReport === "function"){
        initilizeIvrCounsellorCustomReport();
        dashletFound   = true;
    }
    if(typeof initilizeAgencyWiseCallingReport === "function"){
        initilizeAgencyWiseCallingReport();
        dashletFound   = true;
    }
    
    if(dashletFound){
        $("#dashboardDownloadPDF").show();
        $("#dashboardSaveLayout").hide();
        $("#dashboardCancelLayoutChanges").hide();
    }
	
    // For Chosen Close if click one another one
    jQuery('.chosen-with-drop').click(function(){
	    jQuery('.chosen-select').trigger('chosen:close'); 
    });

    $('#category').on('change', function() {
	var black = '';
	var category = this.value;
	var rows = $('#allDashletsContainer .row');
	rows.show();
	if(category != ''){
	   $('.dashletsContainer').removeClass('fadeIn');
	   black = rows.filter('.category_'+category).show();
	   rows.not( black ).hide();
	   $('.dashletsContainer').addClass('fadeIn');
	}else{
		$('.dashletsContainer').removeClass('fadeIn');
	    $('#allDashletsContainer .row').first().hide();
		$('.dashletsContainer').addClass('fadeIn');
	}
	
    });
	
	$('.dm-filter-btn').click(function(){
		$(this).parent().toggleClass('open');
	})

    $('.dropdown-toggle').click(function(){
		$('.dm-filter-btn').parent().removeClass('open');
    });
	
});

function reordering(elements){
    
}

function reordered(elements){
    dashletOrders   = elements;
}

function submitDashboardForm(){
    if($("#collegeId").val()===""){
        $(".dashboardErrorMsg").remove();
        $("#collegeId").parent().append('<small class="text-danger fw-500 dashboardErrorMsg">Please select college</small>');
        $("#collegeId").parent().addClass('has-error');
	$("#dashboardAddDashlets").css("display", "none");
        return false;
    }
    $("#dashboardAddDashlets").css("display", "inline-block");
    $("#dashboardForm").submit();
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

function downloadDashboardPDF(){
    if($('.dashlets').length )    {
//        $(".dashletFilters").hide();
        $("#pageLoader").show();
        var dashletCount    = $('.dashlets').length;
        var imageCount     = 0;
        var pdf = new jspdf(); // A4 size page of PDF  
        var totalHeightUsed = 0;
        var counter = 0;
        var imgWidth = 200;   
        html2canvas(document.getElementById('dashboardHeadingDiv')).then(canvas => { 
            var imgHeight = canvas.height * imgWidth / canvas.width;  
            var positionY = 0;  
            const contentDataURL = canvas.toDataURL('image/png', 1.0);
            positionY       = totalHeightUsed+15;
            totalHeightUsed += imgHeight+15;
            pdf.addImage(contentDataURL, 'PNG', 1, positionY, imgWidth, imgHeight);
        });         
        html2canvas(document.getElementById('dashboardFilterDiv')).then(canvas => { 
            var imgHeight = canvas.height * imgWidth / canvas.width;  
            var positionY = 0;  
            const contentDataURL = canvas.toDataURL('image/png', 1.0);
            positionY       = totalHeightUsed+15;
            totalHeightUsed += imgHeight+15;
            pdf.addImage(contentDataURL, 'PNG', 1, positionY, imgWidth, imgHeight);
        });         
        
        $('.dashlets').each(function(){
            var dashletContainer = $(this).find(".panel-reports").attr("id");
            var dashletColspan = $(this).data("colspan");
            var data = document.getElementById(dashletContainer);  
            setTimeout(function () {
                html2canvas(data,{ allowTaint : true,logging:true,proxy:true,useCORS:true}).then(canvas => { 
                    // Few necessary setting options  

                    var imgWidth = 200;   
                    if(dashletColspan=="small"){
                        imgWidth    = 100;
                    }
                    var imgHeight = canvas.height * imgWidth / canvas.width;  
                    var positionX = 0;  
                    var positionY = 0;  
                    const contentDataURL = canvas.toDataURL('image/png',1.0);
//                    if(dashletContainer=="leadVsApplicationsDashletHTML"){
//                        $("#synElacticDataLink").attr("download", "your_pic_name.png");
//                        $("#synElacticDataLink").attr("href", contentDataURL);
//                        alert($("#synElacticDataLink").attr("href"));
//                        
//                    }
                    if(pdf.internal.pageSize.height < totalHeightUsed+imgHeight+10){
//                    if(imageCount > 0){
                        pdf.addPage('p', 'pt', [$(document).height(), $(document).width()+100]);
                        totalHeightUsed = 0;
                    }
                    positionY       = totalHeightUsed+10;
                    totalHeightUsed += imgHeight+10;
                    pdf.addImage(contentDataURL, 'PNG', positionX, positionY, imgWidth, imgHeight);
                    imageCount++;
                    if(imageCount==dashletCount){
                        pdf.save('download.pdf'); // Generated PDF 
                        $("#pageLoader").hide();			
                        $(".dashletFilters").show();
                    }
                });         
            }, (1000*counter));
            counter++;
        });
        
    }else{
        alert("Graph not available.");
       return false;
    }
    
}

function editDashboardLayout(){
    dashletOrders   = false;
    /*$('.gridly').gridly('draggable', 'on');
    $('.brick').addClass('brickEdit'); 
    $("#dashboardEditLayout").hide();
    $("#dashboardSaveLayout").show();
    $("#dashboardCancelLayoutChanges").show();*/
    $('.gridly').gridly({
            base: 60, // px
            gutter: 20,
            columns: 2,
            callbacks: { 
                    reordering: reordering , 
                    reordered: reordered 
            }
    });
    $('.gridly').gridly('draggable', 'on');
    $('.brick').addClass('brickEdit'); 
    $("#dashboardEditLayout").hide();
    $("#dashboardAddDashlets").hide();
    $("#dashboardSaveLayout").show();
    $("#dashboardCancelLayoutChanges").show();
}

function addDashlets(){
    
//    if($("#collegeId").val() == ''){
//	alertPopup("Please Select College",'error');
//	return false;
//    }
//    $('#addDashletModal').modal('show');
    $("#allDashletsContainer").html("");
    $("#category").val("");
    $('.chosen-select').trigger('chosen:updated');
    var dashlets    = [0];
    $("div.dashlets").each(function(){
        dashlets.push( $(this).data("dashletid") );
    });
    var category    = $("#category").val();
    $.ajax({
        url: '/analytics/dashletList',
        type: 'post',
        data: {collegeId:$("#collegeId").val(), 'selectedDashlets':dashlets, 'category':category, 'click_leadorigin' : jsVars.click_leadorigin},
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

function cancelDashboardLayoutChanges(){
    if(dashletOrders){
        $("#dashboardForm").submit();
    }else{
        $('.gridly').gridly('draggable', 'off');
        $('.brick').removeClass('brickEdit'); 
        $("#dashboardEditLayout").show();
        $("#dashboardSaveLayout").hide();
        $("#dashboardCancelLayoutChanges").hide();
        $("#dashboardAddDashlets").show();
    }
}

function saveAddedDashlets(){
    var formData    = $("#addDashboardForm").serializeArray();
    var counter=0;
    $("div.dashlets").each(function(){
        formData.push({name: 'selectedDashlets['+counter+']', value: $(this).data("dashletid")});
        counter++;
    });

    $.ajax({
        url: '/analytics/addDashlets',
        type: 'post',
        data: formData,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
	    $('#AddedDashlets').attr("disabled", true);
            $("#modalLoaderDiv").show();
        },
        complete: function () {
	    $('#AddedDashlets').removeAttr("disabled");
	    $("#modalLoaderDiv").hide();
	    $("#addDashletModal").modal('hide');
        },
        success: function (response) { 
			$("#addDashletModal").hide();
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1)
            {
                if(responseObject.message == 2){
                    //alertPopup("Lead Origin Performance has been set as <strong>default dashlet</strong> for Marketing Dashboard. You can not remove it",'error');
                    $('#ErrorPopupArea').modal('show');
                    $('#ErrorPopupArea .modal-header').hide();
                    $('#ErrorMsgBody').removeClass('text-danger').addClass('text-left').html('<div class="lineicon-43 fa-3x text-center mb-2"></div>Lead Origin Performance has been set as <strong class="text-danger">default dashlet</strong> &nbsp;for Marketing Dashboard. <strong class="text-danger">You can not remove it</strong>.');
                    $('#ErrorOkBtn').click(function(){
						$('.check_noclickevent').prop('checked', true);
					});
                    // $("#dashboardForm").submit();
                }else{
                    $("#dashboardForm").submit();
                }
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    // alertPopup(responseObject.message);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup('Something went wrong. Please try again.','error');
        }
    });
}

// Fixes for Small layout gridly on top position than edit layout issue
$(document).ajaxComplete(function(){
	var gridlyHeight = $('.main-footer').position().top - 200;
	var pos = [];
	$('.dashlets').each(function() { 
	   var dashLetsPos = $(this).position();
	   pos.push(dashLetsPos);
	});
	$('#dashboardEditLayout').click(function(){ 
		var i =0; 
		$('.dashlets').each(function() {
		   $(this).css(pos[i++]);
		});
		$('.gridly').css('height', gridlyHeight);
	});
});

function saveDashboardLayout(){
    if(dashletOrders){
        var dashlets    = [];
        dashletOrders.each(function(){
            dashlets.push($(this).data("dashletid"));
        });
        $.ajax({
            url: '/analytics/saveDashboardLayout',
            type: 'post',
            data: {collegeId:$("#collegeId").val(), dashboardId:$("#dashboardId").val(), dashlets:dashlets},
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
                    $("#dashboardForm").submit();
                }else{
                    if (responseObject.message === 'session'){
                        location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                    }else{
                        alertPopup(responseObject.message);
                    }
                }
                $('.gridly').gridly('draggable', 'off');
                $('.brick').removeClass('brickEdit'); 
                $("#dashboardEditLayout").show();
                $("#dashboardSaveLayout").hide();
                $("#dashboardCancelLayoutChanges").hide();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
                console.log(thrownError);
                alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }else{
        cancelDashboardLayoutChanges();
    }
}

var analyticsLoaderCount = 0;
function syncAnalyticsData(){
    syncApplicantData();
    syncTicketsData();
//    syncCommunicationsData();
//    syncIvrData();
}

function syncApplicantData(){
    $.ajax({
        url: '/DataSync/syncAplicantsWithElastic/'+$("#collegeId").val(),
        type: 'get',
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $("#pageLoader").show();
            analyticsLoaderCount++;
        },
        complete: function () {
            analyticsLoaderCount--;
            if(analyticsLoaderCount===0){
                setTimeout(function() { $("#dashboardForm").submit(); }, 5000);
            }
        },
        success: function (response) { 
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message);
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

function syncTicketsData(){
    $.ajax({
        url: '/DataSync/syncTicketsWithElastic/'+$("#collegeId").val(),
        type: 'get',
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $("#pageLoader").show();
            analyticsLoaderCount++;
        },
        complete: function () {
            analyticsLoaderCount--;
            if(analyticsLoaderCount===0){
                setTimeout(function() { $("#dashboardForm").submit(); }, 5000);
            }
        },
        success: function (response) { 
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){

            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message);
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

function syncCommunicationsData(){
    $.ajax({
        url: '/DataSync/syncCommunicationsWithElastic/'+$("#collegeId").val(),
        type: 'get',
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $("#pageLoader").show();
            analyticsLoaderCount++;
        },
        complete: function () {
            analyticsLoaderCount--;
            if(analyticsLoaderCount===0){
                setTimeout(function() { $("#dashboardForm").submit(); }, 5000);
            }
        },
        success: function (response) { 
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){

            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message);
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

function syncIvrData(){
    $.ajax({
        url: '/DataSync/syncIvrWithElastic/'+$("#collegeId").val(),
        type: 'get',
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $("#pageLoader").show();
            analyticsLoaderCount++;
        },
        complete: function () {
            analyticsLoaderCount--;
            if(analyticsLoaderCount===0){
                setTimeout(function() { $("#dashboardForm").submit(); }, 5000);
            }
        },
        success: function (response) { 
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){

            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alertPopup(responseObject.message);
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

function getDetails(type, dashlet) {
    if (typeof dashlet === 'undefined' || dashlet === null) {
        dashlet = 'leadAnalysis';
    }
    if(type == 'publishers'){
        $("#"+dashlet+"Report_medium").empty();
        $('#'+dashlet+'Report_medium').html("");
        $('select#' + dashlet + 'Report_medium')[0].sumo.reload();
        $("#"+dashlet+"Report_campaign").empty();
        $('#'+dashlet+'Report_campaign').html("");
        $('select#' + dashlet + 'Report_campaign')[0].sumo.reload();
    }else if(type == 'source'){
        $("#"+dashlet+"Report_campaign").empty();
        $('#'+dashlet+'Report_campaign').html("");
        $('select#' + dashlet + 'Report_campaign')[0].sumo.reload();
    }
    var college_id = $("#"+dashlet+"CollegeId").val();
    var publisherId = $("#"+dashlet+"Report_publishers").val();
    var source = $("#"+dashlet+"Report_source").val();
    var medium = $("#"+dashlet+"Report_medium").val();
    var campaign = $("#"+dashlet+"Report_campaign").val();
   
    $.ajax({
        url: '/campaign-manager/getPublisherFilterDetails',
        type: 'post',
        dataType: 'json',
        beforeSend: function () {
            if($(".loader-block").length){
                $(".loader-block").show();
            }
        },
        complete: function () {
            if($(".loader-block").length){
                $(".loader-block").hide();
            }
        },
        async: false,

        data: {'publisherId': publisherId, 'collegeId': college_id, 'source': source, 'medium':medium, 'campaign':campaign, 'type':type},

        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if(data['status'] === 1) {
            var html = "";
            for (var key in data) {
                if(key != 'status'){
                    html += "<option value='" + data[key].data + "'>" + data[key].data + "</option>";
                }
            }
            if(type == 'publishers'){
                $('#'+dashlet+'Report_source').html(html);
                $('select#' + dashlet + 'Report_source')[0].sumo.reload();
            }
             if(type == 'source'){
                $('#'+dashlet+'Report_medium').html(html);
                $('select#' + dashlet + 'Report_medium')[0].sumo.reload();
            }
            if(type == 'medium'){
                $('#'+dashlet+'Report_campaign').html(html);
                $('select#' + dashlet + 'Report_campaign')[0].sumo.reload();
            }
        }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

function getTrafficChannel(dashlet){
    if (typeof dashlet === 'undefined' || dashlet === null) {
        dashlet = 'leadAnalysis';
    }
    
    var traffic_channel = $("#" + dashlet + "Report_trafficChannel").val();
        if(traffic_channel == '')
        {
            return false;
        }
        var referer = [3,4,5];
        var publisher = [1,2,7,8,9,10];
        var ajaxUrl = "";
        var collegeId = $("#collegeId").val();
        if($.inArray( traffic_channel, publisher))
        {
            ajaxUrl = '/campaign-manager/get-publisher-list';
        }else if($.inArray( traffic_channel, referer)){
            ajaxUrl = '/campaign-manager/get-referrer-list';
        }else{
            alertPopup("Invalid Traffic Channel");
            return false;
        }
        $.ajax({
             url: ajaxUrl,
             type: 'post',
             data: {traffic_channel : traffic_channel, college_id: collegeId},
             dataType: 'json',
             headers: {
                 "X-CSRF-Token": jsVars._csrfToken
             },
             beforeSend: function () {
             },
             complete: function () {

             },
             success: function (response) {
                 var responseObject = response;
                 if (responseObject.status == 1) 
                 {
                     if (typeof responseObject.data === "object") 
                     {
                        $("#" + dashlet + "Report_publishers").html("");
                        var html = ""; 
                        $.each(responseObject.data.sourceList, function (formStage, formStageLabel) {
                            html += "<option value='" + formStage + "'>" + formStageLabel + "</option>";
                        });
                        $('#' + dashlet + 'Report_publishers').html(html);
                        $('select#' + dashlet + 'Report_publishers')[0].sumo.reload();
                        $("#"+dashlet+"Report_source").empty();
                        $('#'+dashlet+'Report_source').html("");
                        $('select#' + dashlet + 'Report_source')[0].sumo.reload();
                        $("#"+dashlet+"Report_medium").empty();
                        $('#'+dashlet+'Report_medium').html("");
                        $('select#' + dashlet + 'Report_medium')[0].sumo.reload();
                        $("#"+dashlet+"Report_campaign").empty();
                        $('#'+dashlet+'Report_campaign').html("");
                        $('select#' + dashlet + 'Report_campaign')[0].sumo.reload();
                     }
                 } else {
                     if (responseObject.message === 'session') {
                         location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                     } else {
                         alertPopup(responseObject.message);
                     }
                 }
                 return;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
}