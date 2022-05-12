//Naren$.material.init();
$(document).ready(function () {
  	$('[data-toggle="popover"]').popover()
    //Load calender in dashboard
    if (typeof loadDashboardCalender != 'undefined' && loadDashboardCalender == 1) {
        LoadReportDateRangepicker();
    }
    var trigger = $('.hamburger'),
            overlay = $('.overlay'),
            isClosed = false;

    trigger.click(function () {
        hamburger_cross();
    });

    function hamburger_cross() {

        if (isClosed == true) {
            overlay.hide();
            trigger.removeClass('is-open');
            trigger.addClass('is-closed');
            isClosed = false;
        } else {
            overlay.show();
            trigger.removeClass('is-closed');
            trigger.addClass('is-open');
            isClosed = true;
        }
    }

    $('[data-toggle="offcanvas"]').click(function () {
        $('#wrapper').toggleClass('toggled');
    });

    if($('#stateListDiv').length>0) {
        $('#stateListDiv').SumoSelect({placeholder: 'State Advance Filter', search: true, selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false,okCancelInMulti:true});
    }

    if($('#subdomainAvailabilityChecker').length>0) {
        $('#subdomainAvailabilityChecker').click(function () {
            subdomainAvailabilityChecker();
            return false;
        });
    }
});

$(window).load(function(){
	if (document.documentElement.clientWidth < 767) {
		/*$('[data-target="#menu-block"]').click(function(){
			$('body').toggleClass('offCanvasBody');
			$('.navbar-fixed-top').append("<div class='offCanvasbackdrop modal-backdrop fade in'></div>")
		})
		$(document).on('click', '.offCanvasbackdrop', function(e) {
			$('body').toggleClass('offCanvasBody');
			$('.menu-block').removeClass('in');
			$(this).remove();
		});*/
		$('.mobDropCorg .SumoSelect').on('click', function(e) {
			e.stopPropagation();
		});
		// add class in body once click on filter
		//$('.fcEvent .btn').click(function(){

		//});

		$('.fcEvent .btn-group').on({
			"shown.bs.dropdown": function() {
				$('body').addClass('filterOpen');
				//$('.mobDropContent').hide();
			},
			//"click": function() { $('.filter_collapse').addClass('filterOpen'); },
			"hidden.bs.dropdown":  function() {
				$('.mobDropContent').hide();
				$('.mobDropCorg-backdrop').remove();
				$('body').removeClass('filterOpen');
			}
		});

		$('.btn-cogs-click').click( function(event){
			$(this).siblings('.mobDropContent').toggle();
			$(this).parent().append("<div class='mobDropCorg-backdrop fade in'></div>");
		});

		$(document).on('click', '.mobDropCorg-backdrop', function(e) {
			$('.mobDropContent').hide();
			//$('.menu-block').removeClass('in');
			$('.mobDropCorg-backdrop').remove();
		});
		$(document).ajaxSuccess(function(){
			$('.mobDropContent').hide();
			$('.mobDropCorg-backdrop').remove();
		})

	}
})

function tableHeight(){
	var winHeight = jQuery(window).height();
	//alert(winHeight);
	var tablePos = jQuery('.newTableStyle').offset().top;
	var tableHeightVal = (winHeight - tablePos) - 40;
	//alert(tablePos);
	jQuery('.newTableStyle').css('max-height', tableHeightVal);
}
//NPS - For charts
var currentCharttype = 1;
var currentChartSubtype = 0;
var dashboardLoaderCount    = 0;
$(function () {

    //Lead Success Pop up trigger
    if (typeof jsVars.LeadSuccess !== 'undefined') {
        $('#LeadSuccessLink').trigger('click');
    }


    if ($('#courses').length > 0) {
        /*$('#courses').multiselect({
            nonSelectedText: 'Select Forms Applied'
        });*/
		$('#courses').SumoSelect({placeholder: 'Select Forms Applied', search: true, searchText:'Select Forms Applied', selectAll : true, captionFormatAllSelected: "All Selected.",triggerChangeCombined: false});
    }

    if ($('#collegeDashboardStartDate').length > 0) {
        $('#collegeDashboardStartDate').datepicker({startView: 'month', format: 'dd/mm/yyyy', enableYearToMonth: true, enableMonthToDay: true});
    }

    if ($('#collegeDashboardEndDate').length > 0) {
        $('#collegeDashboardEndDate').datepicker({startView: 'month', format: 'dd/mm/yyyy', enableYearToMonth: true, enableMonthToDay: true});
    }
    $('#graphStatsLoaderConrainer').hide();
    if ($('#totalDashboardApplicationContainer').length > 0 && $("#collegeDashboardCollegeId").val()!='' && $("#collegeDashboardCollegeId").val()!='0') {
        collegeDashboardDataLoad();
    }

    if ($('#lineChartContainer').length > 0 && $('#donutChartContainer').length > 0 && $("#collegeDashboardCollegeId").val()!='' && $("#collegeDashboardCollegeId").val()!='0') {
        currentCharttype = 4;
        currentChartSubtype = 0;
        collegeDashboardGraphLoad(4, 0);
    }

    //loading Registration tokens
    if($('select#college_id').val() != ''){
        fetchCollegeRegistrationListTokens($('select#college_id').val());
    }

});
//loading Registration tokens - on college changes
$(document).on('change', 'select#college_id', function () {
    fetchCollegeRegistrationListTokens(this.value);
    if ($('#stateListDiv').length > 0) {
        $('#stateListDiv').multiselect({
            nonSelectedText: 'State Advance Filter'
        });
    }
});

$(document).on('change', 'select#download_admit_card', function () {
    var val = $(this).val();
    if(val == '0') {
        $('#editform_show_admit_card_on').val('').trigger('chosen:updated');
        $('#efshowon').hide();
    } else {
        $('#efshowon').show();
    }
});


/**
 * @function to load dashboard total counts(displayed at the top ) and table showinf formwise total counts (table at bottom)
 * called on page load and also called when user clicks in search button
 */
function collegeDashboardDataLoad() {
    $.ajax({
        url: jsVars.FULL_URL + '/colleges/formApplicantStats',
        type: 'post',
        data: $("form#collegeDashboardForm").serialize(),
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            if(dashboardLoaderCount==0){
                $('#graphStatsLoaderConrainer').show();
            }
            dashboardLoaderCount++;
//            jQuery('#applicant_list').html('<tr><td colspan="9"><div class="loader-block"></div></td></tr>');

            $('#totalDashboardApplicationContainer').removeClass('payment-common');
            $('#totalPaymentRecievedContainer').removeClass('payment-common');
            $('#totalPaymentPendingContainer').removeClass('payment-common');
            $('#PaymentInitiatedContainer').removeClass('payment-common');
            $('#totalFormInCompleteContainer').removeClass('payment-common');
            $('#totalRevenueContainer').removeClass('payment-common');
            $('#paymentStatsLoaderConrainer').show(); //Remove after done
        },
        complete: function () {
            //		$('#contact-us-final div.loader-block').hide();
            dashboardLoaderCount--;
            if(dashboardLoaderCount==0){
                $('#graphStatsLoaderConrainer').hide();
            }
        },
        success: function (json) {
            var totalPaymentRecieved = 0;
            var totalPaymentPending = 0;
            var funnelTotalPaymentRecieved = 0;
            var PaymentInitiated = 0;
            var totalPaymentNotInitiated = 0;
            var totalRevenue = 0;
            var totalApplications=0;
            json    = jQuery.parseJSON(json);
            if (typeof json['table'] != 'undefined') {
                jQuery('#applicant_list').html(json['table']);
            }
            if (typeof json['total_application'] != 'undefined' && parseInt(json['total_application'])>0) {
                totalApplications = parseInt(json['total_application']);
            }
            var funnelTotalApplications = totalApplications;
            if (totalApplications > 0) {

                if(typeof json['total_application_link'] != 'undefined' && json['total_application_link'] !='') {
                    totalApplications = '<a href="'+json['total_application_link']+'" target="_blank" style="text-decoration:none;"><strong>'+new Intl.NumberFormat().format(totalApplications)+'</strong></a><br><img src="/img/app-icon.jpg" alt="">';
                }

                totalPaymentRecieved = parseInt(json['total_payment_received']);
                funnelTotalPaymentRecieved  = totalPaymentRecieved;
                totalPaymentPending = parseInt(json['total_payment_pending']);
                funnelTotalPaymentPending   = totalPaymentPending;
                PaymentInitiated = parseInt(json['total_payment_initiated']);
                totalPaymentNotInitiated = parseInt(json['total_payment_not_initiated']);

                if(typeof json['total_payment_received_link'] != 'undefined' && json['total_payment_received_link'] !='') {
                    totalPaymentRecieved = '<a href="'+json['total_payment_received_link']+'" target="_blank" style="text-decoration:none;"><strong>'+new Intl.NumberFormat().format(totalPaymentRecieved)+'</strong></a>';
                }

                if(typeof json['total_payment_pending_link'] != 'undefined' && json['total_payment_pending_link'] !='') {
                    totalPaymentPending = '<a href="'+json['total_payment_pending_link']+'" target="_blank" style="text-decoration:none;"><strong>'+new Intl.NumberFormat().format(totalPaymentPending)+'</strong></a>';
                }

                if(typeof json['total_payment_initiated_link'] != 'undefined' && json['total_payment_initiated_link'] !='') {
                    PaymentInitiated = '<a href="'+json['total_payment_initiated_link']+'" target="_blank" style="text-decoration:none;font-weight:bold;">'+PaymentInitiated+'</a>';
                }

                if(typeof json['total_payment_not_initiated_link'] != 'undefined' && json['total_payment_not_initiated_link'] !='') {
                    totalPaymentNotInitiated = '<a href="'+json['total_payment_not_initiated_link']+'" target="_blank" style="text-decoration:none;font-weight:bold;">'+new Intl.NumberFormat().format(totalPaymentNotInitiated)+'</a>';
                }

                totalRevenue = json['total_revenue'];
            }
            var paymentCountHtml='';
            if (typeof json['total_payment_count_method_wise'] != 'undefined') {

                var count = Object.keys($.parseJSON(json['total_payment_count_method_wise'])).length;
                var counter=0;
                var classname = 'isSum';
                $.each($.parseJSON(json['total_payment_count_method_wise']),function(v,k){
                   counter+=1;
                    if(counter==count){
                       classname = '';
                    }

                    paymentTitle = v;
                    if(typeof json['paymentAliasList'][v] !== 'undefined') {
                        paymentTitle = json['paymentAliasList'][v];
                    }
                    //paymentCountHtml+='<div class="col-md-2"><div class="payment-type-box"><div class="text-center"><h4>'+ v +'</h4><h2>' + k + '</h2></div></div></div>';
                    paymentCountHtml+='<div class="pay-breakup display-cell '+classname+'">'+ paymentTitle.toUpperCase() +'<br><strong>'+ new Intl.NumberFormat().format(k) +'</strong></div>';
               });
            }else{
                paymentCountHtml = '<div class="pay-breakup display-cell isSum">Online<br><strong>0</strong></div><div class="pay-breakup display-cell">Offline<br><strong>0</strong></div>';
            }

            // Generating HTML
            var totalApplicationHtml = 'Total Application<br>' + totalApplications;

            //If all form is free
            if(json['isAllFormFree'] == 1) {
                var totalPaymentRecievedHtml = 'Application Submitted<br>' + totalPaymentRecieved;
                var totalPaymentPendingHtml = 'Application Pending Submission<br>' + totalPaymentPending;
                paymentCountHtml = '';
                totalPaymentInitiatedHtml = '';

                $('#PaymentInitiatedContainer').parent('div').hide();
                $('#totalPaymentPendingContainer').parent('div').removeClass('isEqual');
                $('#totalPaymentRecievedContainer').removeClass('isEqual');

                $('#PaymentNotInitiatedContainer').hide();

                $('#paymentApprovedTooltipDiv').attr({
                                                'data-original-title': "Application Submitted",
                                                'data-content': "This represents all the Applications that have been successfully submitted."
                                              });

                $('#paymentPendingTooltipDiv').attr('data-content',"<p><strong>Application Pending Submission</strong><br>This represents all the Applications in which Form is either Incomplete or if Complete the Application hasn\'t been submitted.</p>");
            } else {
                $('#paymentApprovedTooltipDiv').attr({
                                                'data-original-title': "Payment Approved",
                                                'data-content': "This represents all the Applications for which payment has been made successfully."
                                              });

                $('#paymentPendingTooltipDiv').attr('data-content',"<p><strong>Payment Pending</strong><br>This represents all the Applications for which Payment is either Not Initiated or Initiated but not completed successfully.</p><p><strong>Payment Initiated</strong><br>This represents all the Applications for which Applicant has Initiated Payment after completing form.</p><strong>Payment Not Initiated</strong><br>This represents all the Applications in which Form is either Incomplete or if Complete, the Payment has not been Initiated.");

                $('#PaymentNotInitiatedContainer').show();
                $('#totalPaymentPendingContainer').parent('div').removeClass('isEqual').removeAttr('style');

                $('#PaymentInitiatedContainer').parent('div').show();
                $('#totalPaymentPendingContainer').parent('div').addClass('isEqual');
                $('#totalPaymentRecievedContainer').addClass('isEqual');

                var totalPaymentRecievedHtml = 'Payment Approved<br>' + totalPaymentRecieved;
                var totalPaymentPendingHtml = 'Payment Pending<br>' + totalPaymentPending;
                var totalPaymentInitiatedHtml = 'Payment Initiated<br>' + PaymentInitiated;
                var totalPaymentNotInitiatedHtml = 'Payment Not Initiated<br> ' + totalPaymentNotInitiated;
            }
            var totalRevenueHtml = '(Total Revenue : ' + totalRevenue + ')';

            // Assigning HTML to container
            $('#paymentStatsLoaderConrainer').hide();
            $('#totalDashboardApplicationContainer').addClass('payment-common');
            $('#totalPaymentRecievedContainer').addClass('payment-common');
            $('#totalPaymentPendingContainer').addClass('payment-common');
            $('#PaymentInitiatedContainer').addClass('payment-common');
            $('#PaymentNotInitiatedContainer').addClass('payment-common');
            $('#totalRevenueContainer').addClass('payment-common');
            $('#totalDashboardApplicationContainer').html(totalApplicationHtml);
            $('#totalPaymentRecievedContainer').html(totalPaymentRecievedHtml);
            $('#totalPaymentPendingContainer').html(totalPaymentPendingHtml);
            $('#PaymentInitiatedContainer').html(totalPaymentInitiatedHtml);
            $('#PaymentNotInitiatedContainer').html(totalPaymentNotInitiatedHtml);
            $('#totalRevenueContainer').html(totalRevenueHtml);
            $('#paymentApprovedData').html(paymentCountHtml);
			table_fix_rowcol();
            if(typeof applicantFunnelLineChartData =='object'){
                google.charts.load("current", {packages: ["corechart"]});
                google.charts.setOnLoadCallback(function () {
                    applicantFunnelLineChartData[2][1]=funnelTotalApplications;
                    applicantFunnelLineChartData[2][2]=funnelTotalApplications;
                    applicantFunnelLineChartData[3][1]=funnelTotalPaymentRecieved;
                    applicantFunnelLineChartData[3][2]=funnelTotalPaymentRecieved;
                    if(typeof jsVars.changeApplicationFunnelOnFormChange !=='undefined' && jsVars.changeApplicationFunnelOnFormChange==true){
                        getApplicationSubmittedAndGenerateFunnel($("#courses").val(),funnelTotalApplications,funnelTotalPaymentRecieved);
                    }else{
                        drawApplicantFunnelLineChart(applicantFunnelLineChartData,'applicantFunnelContainer');
                        applicantFunnelLineChartData='';
                    }
                });
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            //            $('#contact-us-final div.loader-block').hide();
        }
    });
}

function getApplicationSubmittedAndGenerateFunnel(forms,funnelTotalApplications,funnelTotalPaymentRecieved){
    if(forms==null){
        forms='';
    }
//    if(typeof forms[0]=="string" && forms.length==1 && forms[0]==LSAT_HANDBOOK_REQUEST_FORM_ID){
//        $("#applicantFunnelContainer").html("<div style='text-align:center;margin:70px 0;color: #999;'><i class='fa fa-bar-chart' aria-hidden='true' style='font-size:50px;display:block;width:100%;text-align:center;'></i>The graph isnt applicable for selected form</div>");
//		$('.note').hide();
//        return;
//    }
    if(forms=='' || typeof forms[0]!=="string"){
        $("#funnelLeadCountInfoTip").show();
    }else{
        $("#funnelLeadCountInfoTip").hide();
    }
    //console.log(forms);
    $.ajax({
        url: jsVars.FULL_URL + '/colleges/getApplicationFunnelData',
        type: 'post',
        data: {'forms':forms},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            if(dashboardLoaderCount==0){
                $('#graphStatsLoaderConrainer').show();
            }
            dashboardLoaderCount++;
        },
        complete: function () {
            //		$('#contact-us-final div.loader-block').hide();
            dashboardLoaderCount--;
            if(dashboardLoaderCount==0){
                $('#graphStatsLoaderConrainer').hide();
            }
        },
        success: function (json) {
            var response    = jQuery.parseJSON(json);
//                console.log(forms);
            if(typeof response['data']['applicantFunnelData'] !=='undefined'){
                applicantFunnelLineChartData    = jQuery.parseJSON(response['data']['applicantFunnelData']);

                var showApplicantFunnel = false;
//                if(typeof forms[0] !== 'undefined' && forms.length == 3 && typeof jsVars.LSAT_INDIA_ONLINE_APPLICATION_FORM_ID !== 'undefined' &&
//                   forms[0] == jsVars.LSAT_INDIA_ONLINE_APPLICATION_FORM_ID && typeof jsVars.LSAT_HANDBOOK_REQUEST_FORM_ID !== 'undefined' &&
//                   typeof forms[1] !== 'undefined' && forms[1] == jsVars.LSAT_HANDBOOK_REQUEST_FORM_ID) {
//                    showApplicantFunnel = true;
//                }
//                if(typeof forms[0] !== 'undefined' && forms.length == 3 && typeof jsVars.LSAT_INDIA_ONLINE_APPLICATION_FORM_ID !== 'undefined' &&
//                   forms[0] == jsVars.LSAT_INDIA_ONLINE_APPLICATION_FORM_ID && typeof jsVars.LSAT_HANDBOOK_REQUEST_FORM_ID !== 'undefined' &&
//                   typeof forms[2] !== 'undefined' && forms[2] == jsVars.LSAT_HANDBOOK_REQUEST_FORM_ID) {
//                    showApplicantFunnel = true;
//                }else if(typeof forms[0] !== 'undefined' && forms.length == 1 && forms[0] == jsVars.LSAT_INDIA_ONLINE_APPLICATION_FORM_ID) {
//                    showApplicantFunnel = true;
//                }

                if(typeof forms[0] !== 'undefined'  && forms[0] == jsVars.LSAT_INDIA_ONLINE_APPLICATION_FORM_ID) {
                    showApplicantFunnel = true;
                }
                if(forms=='' || showApplicantFunnel){
//                    console.log(1);
                    applicantFunnelLineChartData[2][1]=funnelTotalApplications;
                    applicantFunnelLineChartData[2][2]=funnelTotalApplications;
                    applicantFunnelLineChartData[3][1]=funnelTotalPaymentRecieved;
                    applicantFunnelLineChartData[3][2]=funnelTotalPaymentRecieved;
                }else{
//                    console.log(2);
                    applicantFunnelLineChartData[1][1]=funnelTotalApplications;
                    applicantFunnelLineChartData[1][2]=funnelTotalApplications;
                    applicantFunnelLineChartData[2][1]=funnelTotalPaymentRecieved;
                    applicantFunnelLineChartData[2][2]=funnelTotalPaymentRecieved;
                }
                drawApplicantFunnelLineChart(applicantFunnelLineChartData,'applicantFunnelContainer');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            //            $('#contact-us-final div.loader-block').hide();
        }
    });
}

//calling of function collegeDashboardPaymentLoad and collegeDashboardApplicantsLoad is replaced by collegeDashboardDataLoad();
function collegeDashboardPaymentLoad() {
    $.ajax({
        url: jsVars.FULL_URL + '/colleges/formPaymentStats',
        type: 'post',
        data: $("form#collegeDashboardForm").serialize(),
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            /*$('#collegeDashboardTotalApplicationContainer').removeClass('border-all');
            $('#totalPaymentRecievedContainer').removeClass('payment-common');
            $('#totalPaymentPendingContainer').removeClass('payment-common');
            $('#totalRevenueContainer').removeClass('payment-common');*/

            $('#totalDashboardApplicationContainer').removeClass('payment-common');
            $('#totalPaymentRecievedContainer').removeClass('payment-common');
            $('#totalPaymentPendingContainer').removeClass('payment-common');
            $('#PaymentInitiatedContainer').removeClass('payment-common');
            $('#totalFormInCompleteContainer').removeClass('payment-common');
            $('#totalRevenueContainer').removeClass('payment-common');
            $('#paymentStatsLoaderConrainer').show(); //Remove after done
        },
        complete: function () {
            //		$('#contact-us-final div.loader-block').hide();
        },
        success: function (json) {
            var totalPaymentRecieved = 0;
            var totalPaymentPending = 0;
            var PaymentInitiated = 0;
            var totalPaymentNotInitiated = 0;
            var totalRevenue = 0;
            var totalApplications=0;

            if (typeof json['total_application'] != 'undefined' && parseInt(json['total_application'])>0) {
                totalApplications = parseInt(json['total_application']);
            }

            if (totalApplications > 0) {

                if(typeof json['total_application_link'] != 'undefined' && json['total_application_link'] !='') {
                    totalApplications = '<a href="'+json['total_application_link']+'" target="_blank" style="text-decoration:none;"><strong>'+new Intl.NumberFormat().format(totalApplications)+'</strong></a><br><img src="/img/app-icon.jpg" alt="">';
                }

                totalPaymentRecieved = parseInt(json['total_payment_received']);
                totalPaymentPending = parseInt(json['total_payment_pending']);
                PaymentInitiated = parseInt(json['total_payment_initiated']);
                totalPaymentNotInitiated = parseInt(json['total_payment_not_initiated']);

                if(typeof json['total_payment_received_link'] != 'undefined' && json['total_payment_received_link'] !='') {
                    totalPaymentRecieved = '<a href="'+json['total_payment_received_link']+'" target="_blank" style="text-decoration:none;"><strong>'+new Intl.NumberFormat().format(totalPaymentRecieved)+'</strong></a>';
                }

                if(typeof json['total_payment_pending_link'] != 'undefined' && json['total_payment_pending_link'] !='') {
                    totalPaymentPending = '<a href="'+json['total_payment_pending_link']+'" target="_blank" style="text-decoration:none;"><strong>'+new Intl.NumberFormat().format(totalPaymentPending)+'</strong></a>';
                }

                if(typeof json['total_payment_initiated_link'] != 'undefined' && json['total_payment_initiated_link'] !='') {
                    PaymentInitiated = '<a href="'+json['total_payment_initiated_link']+'" target="_blank" style="text-decoration:none;font-weight:bold;">'+PaymentInitiated+'</a>';
                }

                if(typeof json['total_payment_not_initiated_link'] != 'undefined' && json['total_payment_not_initiated_link'] !='') {
                    totalPaymentNotInitiated = '<a href="'+json['total_payment_not_initiated_link']+'" target="_blank" style="text-decoration:none;font-weight:bold;">'+new Intl.NumberFormat().format(totalPaymentNotInitiated)+'</a>';
                }

                totalRevenue = json['total_revenue'];
            }
            var paymentCountHtml='';
            if (typeof json['total_payment_count_method_wise'] != 'undefined') {

                var count = Object.keys($.parseJSON(json['total_payment_count_method_wise'])).length;
                var counter=0;
                var classname = 'isSum';
                $.each($.parseJSON(json['total_payment_count_method_wise']),function(v,k){
                   counter+=1;
                    if(counter==count){
                       classname = '';
                    }
                    //paymentCountHtml+='<div class="col-md-2"><div class="payment-type-box"><div class="text-center"><h4>'+ v +'</h4><h2>' + k + '</h2></div></div></div>';
                    paymentCountHtml+='<div class="pay-breakup display-cell '+classname+'">'+ v.toUpperCase() +'<br><strong>'+ new Intl.NumberFormat().format(k) +'</strong></div>';
               });
            }else{
                paymentCountHtml = '<div class="pay-breakup display-cell isSum">Online<br><strong>0</strong></div><div class="pay-breakup display-cell">Offline<br><strong>0</strong></div>';
            }

            // Generating HTML
            var totalApplicationHtml = 'Total Application<br>' + totalApplications;
            var totalPaymentRecievedHtml = 'Payment Approved<br>' + totalPaymentRecieved;
            var totalPaymentPendingHtml = 'Payment Pending<br>' + totalPaymentPending;
            var totalPaymentInitiatedHtml = 'Payment Initiated<br>' + PaymentInitiated;
            var totalPaymentNotInitiatedHtml = 'Payment Not Initiated<br> ' + totalPaymentNotInitiated;
            var totalRevenueHtml = '(Total Revenue : ' + totalRevenue + ')';

            /*
            var totalApplications = parseInt(json['succeeded']['total_application']) + parseInt(json['pending']['total_application_pending']);
            if (totalApplications > 0) {
                var totalApplicationPercentage = (parseInt(json['succeeded']['total_application']) / totalApplications) * 100;
                var totalPendingApplicationPercentage = (parseInt(json['pending']['total_application_pending']) / totalApplications) * 100;

                var totalRevenue =  json['succeeded']['total_payment_recieved_str'];
                if (json['pending']['total_application_pending'] > 0) {
//                    var totalPayment = parseFloat(json['succeeded']['total_payment_recieved']) + parseFloat(json['pending']['total_payment_pending']);
                    var totalRevenuePercentage = 100; //((parseInt(json['succeeded']['total_payment_recieved']) / totalPayment) * 100).toFixed(2);
                } else {
                    var totalRevenuePercentage = 100;
                }
            } else {
                var totalRevenue = 0;
                var totalApplicationPercentage = 0;
                var totalPendingApplicationPercentage = 0;
                var totalPayment = 0;
                var totalRevenuePercentage = 0;
            }

            // Generating HTML
            var totalApplicationHtml = '<p style="margin:25px 0"><span class="appCount">' + json['total_display'] + '</span> Total Application</p>'+json['html']; //<div class="progress"><div style="width: '+totalApplicationPercentage+'%" class="progress-bar progress-bar-success npf-progress-bar"></div><span class="current-progress">'+totalApplicationPercentage+'%</span> </div>'
            var totalPaymentRecievedHtml = '<div class="col-xs-12 text-center"><h4>Payment Received</h4><h2>' + json['succeeded']['total_application'] + '</h2></div>'; //<div class="col-xs-4 margin-top-20 padding-none"> <span class="glyphicon glyphicon-arrow-up"></span>'+totalApplicationPercentage+'% </div>';
            var totalPaymentPendingHtml = '<div class="col-xs-12 text-center"><h4>Payment Pending</h4><h2>' + json['pending']['total_application_pending'] + '</h2></div>'; //<div class="col-xs-4 margin-top-20 padding-none"> <span class="glyphicon glyphicon-arrow-down"></span>'+totalPendingApplicationPercentage+'% </div>';
            var totalRevenueHtml = '<div class="col-xs-12 text-center"><h4>Total Revenue</h4><h2> ' + totalRevenue + '</h2></div>'; //<div class="col-xs-4 margin-top-20 padding-none"> '+totalRevenuePercentage+'% </div>';
            */

            // Assigning HTML to container
            $('#paymentStatsLoaderConrainer').hide();
            $('#totalDashboardApplicationContainer').addClass('payment-common');
            $('#totalPaymentRecievedContainer').addClass('payment-common');
            $('#totalPaymentPendingContainer').addClass('payment-common');
            $('#PaymentInitiatedContainer').addClass('payment-common');
            $('#PaymentNotInitiatedContainer').addClass('payment-common');
            $('#totalRevenueContainer').addClass('payment-common');

            $('#totalDashboardApplicationContainer').html(totalApplicationHtml);
            $('#totalPaymentRecievedContainer').html(totalPaymentRecievedHtml);
            $('#totalPaymentPendingContainer').html(totalPaymentPendingHtml);
            $('#PaymentInitiatedContainer').html(totalPaymentInitiatedHtml);
            $('#PaymentNotInitiatedContainer').html(totalPaymentNotInitiatedHtml);
            $('#totalRevenueContainer').html(totalRevenueHtml);
            $('#paymentApprovedData').html(paymentCountHtml);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            //            $('#contact-us-final div.loader-block').hide();
        }
    });
}

function drawApplicantFunnelLineChart(graphData, graphContainer)
{
    if(typeof graphData === "object"){
        if ($.isEmptyObject(graphData)) {
            $('#'+graphContainer).html('<p class="text-center noDataFound">No Data Available.</p>');
        } else {
            var data = new google.visualization.arrayToDataTable(graphData);
             // find max for all columns to set top vAxis number
            var maxVaxis = 0;
            for (var i = 1; i < data.getNumberOfColumns(); i++) {
              if (data.getColumnType(i) === 'number') {
                maxVaxis = Math.max(maxVaxis, data.getColumnRange(i).max);
              }
            }

            var options = {
                title:'',
                legend: { position: 'none' },
                bars: 'vertical',
                vAxis: {format: 'decimal', minValue:0, maxValue: maxVaxis + maxVaxis/6,},
                height: 204,
                width : '100%',
                //'chartArea': {'width': '50%'},
                colors: ['#00b0f0','#ffc000', '#92d050', '#ff3399'],
                annotations: { alwaysOutside: true, textStyle: { color:'#111',fontSize:12 }},
                chartArea : {width:'70%', height:'80%', right:'5%', top:'2%',},
                series: {
                    0: { annotations: { stem: { length: 20 } }  },
                    1: { annotations: { stem: { length: 2  } }  },
                    2: { annotations: { stem: { length: 20 } }  },
                    3: { annotations: { stem: { length: 2  } }  }
                }
              };

           var chart = new google.visualization.BarChart(document.getElementById(graphContainer));
           google.visualization.events.addListener(chart, 'ready', AddNamespaceHandler);
           chart.draw(data, options);
        }
    }
}

function AddNamespaceHandler()
{
    var svg = jQuery('svg');
    svg.attr("xmlns", "http://www.w3.org/2000/svg");
    svg.css('overflow','visible');
}

function collegeDashboardGraphLoad(chartType, chartSubtype,containerType)
{
    $('#chartTypeField').val(chartType);
    $('#chartSubtype').val(chartSubtype);

    if(typeof containerType =='undefined') {
        $('#myTabContent').show();
        $('#myTabContentNew').hide();
//        $('#graphStatsLoaderConrainer').show();
//        $('#graphStatsLoaderConrainerState').hide();
    } else {
        $('#myTabContent').hide();
//        $('#graphStatsLoaderConrainerState').show();
        $('#myTabContentNew').show();
//            $('#graphStatsLoaderConrainer').hide();
        }


    $.ajax({
        url: jsVars.FULL_URL + '/colleges/formGraphStats',
        type: 'post',
        data: $("form#collegeDashboardForm").serialize(),
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            if(dashboardLoaderCount==0){
                $('#graphStatsLoaderConrainer').show();
            }
            dashboardLoaderCount++;

            dashboardLoaderCount--;
            if(dashboardLoaderCount==0){
                $('#graphStatsLoaderConrainer').hide();
            }
//            if(typeof containerType =='undefined') {
//                $('#graphStatsLoaderConrainer').show();
//                $('#graphStatsLoaderConrainerState').hide();
//            } else {
//                $('#graphStatsLoaderConrainerState').show();
//                $('#graphStatsLoaderConrainer').hide();
//            }
        },
        complete: function () {
            if(dashboardLoaderCount==0){
                $('#graphStatsLoaderConrainer').show();
            }
            dashboardLoaderCount++;

            dashboardLoaderCount--;
            if(dashboardLoaderCount==0){
                $('#graphStatsLoaderConrainer').hide();
            }

//            if(typeof containerType =='undefined') {
//                $('#graphStatsLoaderConrainer').hide();
//                $('#graphStatsLoaderConrainerState').hide();
//            } else {
//                $('#graphStatsLoaderConrainerState').hide();
//                $('#graphStatsLoaderConrainer').hide();
//            }
        },
        success: function (json) {
            if (json['status'] == 1) {

                $('#revenueVsCourseAnchor, #revenueVsPaymentAnchor').show();

                //Hide Tab
                if(typeof json['isFormFree'] !== 'undefined' && json['isFormFree'] == 1) {
                    $('#revenueVsCourseAnchor, #revenueVsPaymentAnchor').hide();
                }

                var lineContainerId='lineChartContainer';
                if(typeof containerType !=='undefined') {
                    lineContainerId='lineChartContainerNew';
                }

                var paymentAliasList = '';
                if(typeof json['paymentAliasList'] !== 'undefined') {
                    paymentAliasList = json['paymentAliasList'];
                }

                google.charts.setOnLoadCallback(function () {
                    drawLineChart(json['graphData']['line'],lineContainerId, paymentAliasList);
                });
//                    drawLineChart(json['graphData']['line']);

                google.charts.setOnLoadCallback(function () {
                    drawDonutChart(json['graphData']['donut']);
                });
//                    drawDonutChart(json['graphData']['donut']);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            //            $('#contact-us-final div.loader-block').hide();
        }
    });
}

function collegeDashboardGraphLoadStatevsApp(chartType, chartSubtype)
{
    $('#chartTypeField').val(chartType);
    $('#chartSubtype').val(chartSubtype);

    $.ajax({
        url: jsVars.FULL_URL + '/colleges/formGraphStats',
        type: 'post',
        data: $("form#collegeDashboardForm").serialize(),
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#cumulativeGraphLoader').show();
        },
        complete: function () {
            $('#cumulativeGraphLoader').hide();
        },
        success: function (json) {
            if (json['status'] == 1) {
                if(typeof json['graphData']['state']['content'] !='undefined' && json['graphData']['state']['content']!=''){
                    google.charts.setOnLoadCallback(function () {
                        drawDonutChartState(json['graphData']['state']);
                    });
                } else {
                    $('#donutChartContainerState').html('<img src="/img/donut_no_data_image.jpg">');
                }

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            //            $('#contact-us-final div.loader-block').hide();
        }
    });
}


function collegeDashboardGraphLoadCItyVsApp(chartType, chartSubtype,stateName) {
    $('#chartTypeField').val(chartType);
    $('#chartSubtype').val(chartSubtype);
    $('#stateName').val(stateName);
    var data = $("form#collegeDashboardForm").serialize();

    $.ajax({
        url: jsVars.FULL_URL + '/colleges/formGraphStats',
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#graphStatsLoaderConrainerState').show();
        },
        complete: function () {
            $('#graphStatsLoaderConrainerState').hide();
        },
        success: function (json) {
            if (json['status'] == 1) {

                if(typeof json['graphData']['city']['content'] !='undefined' && json['graphData']['city']['content']!=''){
                    google.charts.setOnLoadCallback(function () {
                        drawDonutChartState(json['graphData']['city']);
                    });
                } else {
                    $('#donutChartContainerCity').html('<img src="/img/donut_no_data_image.jpg">');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function drawDonutChartState(json)
{
        google.charts.load('current', {
            callback: function () {
            // Create the data table.
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Name');
            data.addColumn('number', 'Count');
            data.addRows(json['content']);
            // Set chart options
            var options = {
                title: json['title'],
                height: parseInt(json['height']),
                titleTextStyle: {
                    color: '#333',
                    fontSize: '16'
                },
                sliceVisibilityThreshold:0,
                width: (json['width']),
                pieHole: 0.5,
                colors: ['#00b0f0', '#ffc000', '#92d050', '#93cddd', '#e46c0a', '#8a56e2', '#e25668', '#e256ae', '#56e2cf', '#e2cf56'],
                legend: {position: 'right', 'alignment': 'center'},
                animation: {
                    duration: 1500,
                    easing: 'in',
                    startup: true
                },
                is3D: false,
            };
            var chart = new google.visualization.PieChart(document.getElementById(json['id_container']));
            function selectHandler() {
                clickingvalue = '';
                var selectedItem = chart.getSelection()[0];
                if(typeof selectedItem != 'undefined') {
                    var clickingvalue = data.getValue(selectedItem.row, 0);
                }else {
                    clickingvalue = json['maxRecordName'];
                }
                //get city wise records
                if (json['type'] == 'state') {
                    if (typeof clickingvalue != 'undefined' && clickingvalue!='') {
                        collegeDashboardGraphLoadCItyVsApp(3, 5,clickingvalue);
                    }
                }

            }
            google.visualization.events.addListener(chart, 'ready', selectHandler);
            google.visualization.events.addListener(chart, 'select', selectHandler);

            chart.draw(data, options);
            chart.setSelection([{row:0}]);
        },
        'packages':['corechart']
        });

}

$(function () {
    if ($('#donutChartContainer').length > 0 || $('#lineChartContainer').length > 0 || $('#donutChartContainerState').length > 0) {
        // Google Chart
        google.charts.load("current", {packages: ["corechart"]});
    }
});


function drawDonutChart(graphData)
{
    //$("#myTabContentNew").hide();
    //$("#myTabContent").show();

    if ($.isEmptyObject(graphData['series']['data'])) {
        $('#donutChartContainer').html('<img src="/img/donut_no_data_image.jpg">')
    } else {

        var data = google.visualization.arrayToDataTable(
                graphData['series']['data']
                );

        var options = {
            title: graphData['title']['text'],
			titleTextStyle: {
				color: '#111',
				fontSize: 14,
				bold: true,
				italic: false
			},
            titlePosition: "center",
            pieHole: 0.4,
            pieSliceTextStyle: {
                color: '#fff',
            },
            height: 350,
			chartArea: {left: '5%', top: '10%', width: "90%", height: "84%" },
            legend: 'bottom',
            animation: {
                duration: 1500,
                easing: 'in',
                startup: true
            },
            is3D: false,
//            tooltip:{isHtml: true}
        };
        var chart = new google.visualization.PieChart(document.getElementById('donutChartContainer'));
        chart.draw(data, options);
    }
}

function createCustomHTMLContent(flagURL, totalGold, totalSilver, totalBronze)
{
    return '<div style="padding:5px 5px 5px 5px;">' +
            '<img src="' + flagURL + '" style="width:75px;height:50px"><br/>' +
            '<table class="medals_layout">' + '<tr>' +
            '<td><img src="https://upload.wikimedia.org/wikipedia/commons/1/15/Gold_medal.svg" style="width:25px;height:25px"/></td>' +
            '<td><b>' + totalGold + '</b></td>' + '</tr>' + '<tr>' +
            '<td><img src="https://upload.wikimedia.org/wikipedia/commons/0/03/Silver_medal.svg" style="width:25px;height:25px"/></td>' +
            '<td><b>' + totalSilver + '</b></td>' + '</tr>' + '<tr>' +
            '<td><img src="https://upload.wikimedia.org/wikipedia/commons/5/52/Bronze_medal.svg" style="width:25px;height:25px"/></td>' +
            '<td><b>' + totalBronze + '</b></td>' + '</tr>' + '</table>' + '</div>';
}

function drawLineChart(graphData,containerID, paymentAliasList) {
    //Google Chart

    //lineChartContainer
    if ($.isEmptyObject(graphData['column'])) {
        $('#'+containerID).html('<img src="/img/line_no_data_image.jpg">')
    } else {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'date');
        $.each(graphData['column'], function (index, value) {

            if(typeof paymentAliasList !== 'undefined') {
                var paymentName = value.toLowerCase();
                if(typeof paymentAliasList[paymentName] !== 'undefined') {
                  value  = paymentAliasList[paymentName];
                }
            }
            data.addColumn('number', value);
            data.addColumn({type: 'string', role: 'tooltip', 'p': {'html': true}});
        });

        $.each(graphData['rows'], function (index, value) {
            var rows = [];
            rows.push(index);
            $.each(value, function (innerIndex, innerValue) {
                rows.push(innerValue['value']);
                rows.push(innerValue['toolTipData']);
            });

            data.addRow(rows);
        });


        var legend='top';
        if(containerID=='lineChartContainerNew') {
            legend='right';
        }
        var options = {
            //        title: 'Line Graph',
            legend: legend,
            pointSize: 12,
            series: {
                0: {pointShape: 'square'},
                1: {pointShape: 'square'}
            },
			hAxis: {
				title: '(' + graphData['title'] + ')',
				titleTextStyle: {
					color:'#111',
				},
				textStyle : {
					fontSize: 12,
					color:'#333',
				}
			},
			vAxis: {
				title: '(' + graphData['yAxisTitle'] + ')',
				titleTextStyle: {
					color:'#111',
				},
				textStyle : {
					fontSize: 12,
					color:'#333',
				}
			},
            animation: {
                duration: 1000,
                easing: 'out',
                startup: true
            },
            height: 350,
			chartArea: {left: '10%', top: '10%', width: "90%", height: "70%" },
            tooltip: {isHtml: true}
        };
        var chart = new google.visualization.LineChart(document.getElementById(containerID));
        chart.draw(data, options);
    }
}



if ($('#collegeDashboardSearchBtn').length > 0) {
    $(document).on('click', '#collegeDashboardSearchBtn', function () {
        // update payment data
        collegeDashboardDataLoad();
//        collegeDashboardPaymentLoad();
        // update graph data
        if($('#stateVsApplicationAnchor').hasClass('active')){
            getLineOrPieChartGraph();
        } else {
            collegeDashboardGraphLoad(currentCharttype, currentChartSubtype);
        }
//        collegeDashboardApplicantsLoad();
        /*
        ret = checkStartEndDate();
        if (ret == false) {
            $(".npf-close").trigger('click');
            $('#CollegeDashBoardErrorPopup .modal-title').text('Error');
            $('#CollegeDashBoardErrorPopup #MsgBody').text('Start date can not be greater than End date.');
            $('#CollegeDashBoardErrorAnchor').trigger('click');
        } else {
            // update payment data
            collegeDashboardPaymentLoad();
            // update graph data
            collegeDashboardGraphLoad(currentCharttype, currentChartSubtype);
            collegeDashboardApplicantsLoad();
        } */
    });
}

if ($('#revenueVsCourseAnchor').length > 0) {
    $(document).on('click', '#revenueVsCourseAnchor', function () {
        $('#revenue-vs-courses').show();
        $('#stateVsApplicationAnchor_container').hide();
        $("#donutChartContainerState").html("");
        // update graph data
        currentCharttype = 1;
        currentChartSubtype = 0;
        collegeDashboardGraphLoad(1, 0);
        $('.chartSwitcher').removeClass('active');
        $('#revenueVsCourseAnchor').addClass('active');

        $('.chartModeSwitcher').removeClass('active');
        $('#collegeDashboardDailyAnchor').addClass('active');
    });
}

if ($('#revenueVsPaymentAnchor').length > 0) {
    $(document).on('click', '#revenueVsPaymentAnchor', function () {
        $('#revenue-vs-courses').show();
        $('#stateVsApplicationAnchor_container').hide();
        $("#donutChartContainerState").html("");
        // update graph data
        currentCharttype = 2;
        currentChartSubtype = 0;
        collegeDashboardGraphLoad(2, 0);
        $('.chartSwitcher').removeClass('active');
        $('#revenueVsPaymentAnchor').addClass('active');

        $('.chartModeSwitcher').removeClass('active');
        $('#collegeDashboardDailyAnchor').addClass('active');
    });
}

if ($('#stateVsApplicationAnchor').length > 0) {
    $(document).on('click', '#stateVsApplicationAnchor', function () {
        $('.chartSwitcher').removeClass('active');
        $('#stateVsApplicationAnchor').addClass('active');
        $('#revenue-vs-courses').hide();
        $('#stateVsApplicationAnchor_container').show();
        ////////////
    if( $("[name='h_college_id']").length > 0 && typeof $("[name='h_college_id']").val() != "undefined" ){
        college_id_md = $("[name='h_college_id']").val();
    }
        $.ajax({
            cache: false,
            url: jsVars.FULL_URL + '/colleges/getStateListData',
            data:{'college_id':college_id_md},
            type: 'post',
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                if (json['status'] == 1) {
                    var html = '';
                    for(var key in json['stateData']){
                        html += '<option value="'+key+'">'+json['stateData'][key]+'</option>';
                    }
                    $('#state_advance').html(html);
                    $('#state_advance')[0].sumo.reload();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

        ///////////


        var graphChartData = getLineOrPieChartGraph();

    });
}

//stateVsApplicationAnchorLine
if ($('#stateVsApplicationAnchorLine').length > 0) {
    $(document).on('click', '#stateVsApplicationAnchorLine,#collegeDashboardLineChart,#collegeDashboardDailyAnchorNew, #collegeDashboardWeeklyAnchorNew, #collegeDashboardMonthlyAnchorNew', function () {
        $('#revenue-vs-courses').show();
        $('#stateVsApplicationAnchor_container').hide();
        $("#donutChartContainerState").html("");

        $("#nav-tabs-new, #state_div").show();

        $('#cumulativeGraph').hide();
        $('#linearGraph').show();

        $("#myTabContent").hide();
        $("#myTabContentNew").show();

        $('#collegeDashboardDailyAnchorNew, #collegeDashboardWeeklyAnchorNew, #collegeDashboardMonthlyAnchorNew, .chartModeCumulative').removeClass('active');

        currentChartSubtype = 0;
        currentDivID='';
        if(typeof $(this).attr('id') !==' undefined') {
            if($(this).attr('id')=='collegeDashboardWeeklyAnchorNew') {
                currentChartSubtype=2;
                $('#collegeDashboardWeeklyAnchorNew').addClass('active');
            } else if($(this).attr('id')=='collegeDashboardMonthlyAnchorNew') {
                currentChartSubtype=3;
                $('#collegeDashboardMonthlyAnchorNew').addClass('active');
            } else {
               $('#collegeDashboardDailyAnchorNew').addClass('active');
            }
            currentDivID=$(this).attr('id');
        }


        if(currentDivID=='stateVsApplicationAnchorLine') {
            collegeDashboardGraphLoadStateList(3, 0);
        } else {
            collegeDashboardGraphLoad(3, currentChartSubtype,'graphStatsLoaderConrainerState');
        }

        $('#stateVsApplicationAnchorLine').addClass('active');
        $('#collegeDashboardLineChart').addClass('active');
    });

    $(document).on('click', '.btnOk', function () {

        if($('#stateListDiv :selected').length==0) {
            alertPopup('Please select atleast one state!', 'error');
            return false;
        }else if($('#stateListDiv :selected').length>10) {
            alertPopup('You can\'t select more than 10 states!', 'error');
            return false;
        }

        $("#donutChartContainerState").html("");

        $('#cumulativeGraph').hide();
        $('#linearGraph').show();

        $("#myTabContent").hide();
        $("#myTabContentNew").show();


        // update graph data
        currentCharttype = 3;
        currentChartSubtype = 2;
        collegeDashboardGraphLoad(3, 0,'graphStatsLoaderConrainerState');
        $('.chartSwitcher').removeClass('active');
        $('#stateVsApplicationAnchorLine').addClass('active');
        $('.chartModeSwitcher, .chartModeCumulative').removeClass('active');
        $('#collegeDashboardDailyAnchorNew, .chartModeLine').addClass('active');
    });
}


if ($('#stateVsApplicationAnchorNew').length > 0) {
    $(document).on('click', '#stateVsApplicationAnchorNew', function () {

        $('#cumulativeGraph').show();
        $('#linearGraph').hide();
        // update graph data
        currentCharttype = 3;
        currentChartSubtype = 0;
        collegeDashboardGraphLoadStatevsApp(3, 4);
        $('.chartSwitcher').removeClass('active');
        $('#stateVsApplicationAnchorNew').addClass('active');

        $('.chartModeSwitcher, .chartModeLine').removeClass('active');
        $('#stateVsApplicationAnchorNew, .chartModeCumulative').addClass('active');
        $("#myTabContentNew").show();
        $("#myTabContent").hide();
        $("#nav-tabs-new, #state_div").hide();
        $('#stateVsApplicationAnchorLine').addClass('active');
    });
}

if ($('#courseVsApplicationAnchor').length > 0) {
    $(document).on('click', '#courseVsApplicationAnchor', function () {
        $('#revenue-vs-courses').show();
        $('#stateVsApplicationAnchor_container').hide();
        // update graph data
        currentCharttype = 4;
        currentChartSubtype = 0;
        collegeDashboardGraphLoad(4, 0);
        $('.chartSwitcher').removeClass('active');
        $('#courseVsApplicationAnchor').addClass('active');

        $('.chartModeSwitcher').removeClass('active');
        $('#collegeDashboardDailyAnchor').addClass('active');
    });
}

if ($('#categoryVsApplicationAnchor').length > 0) {
    $(document).on('click', '#categoryVsApplicationAnchor', function () {
        $('#revenue-vs-courses').show();
        $('#stateVsApplicationAnchor_container').hide();
        // update graph data
        currentCharttype = 5;
        currentChartSubtype = 0;
        collegeDashboardGraphLoad(5, 0);
        $('.chartSwitcher').removeClass('active');
        $('#categoryVsApplicationAnchor').addClass('active');

        $('.chartModeSwitcher').removeClass('active');
        $('#collegeDashboardDailyAnchor').addClass('active');
    });
}

if ($('#collegeDashboardDailyAnchor').length > 0) {
    $(document).on('click', '#collegeDashboardDailyAnchor', function () {
        // update graph data
        currentChartSubtype = 1;
        collegeDashboardGraphLoad(currentCharttype, 1);
        $('.chartModeSwitcher').removeClass('active');
        $('#collegeDashboardDailyAnchor').addClass('active');
    });
}

if ($('#collegeDashboardWeeklyAnchor').length > 0) {
    $(document).on('click', '#collegeDashboardWeeklyAnchor', function () {
        // update graph data
        currentChartSubtype = 2;
        collegeDashboardGraphLoad(currentCharttype, 2);
        $('.chartModeSwitcher').removeClass('active');
        $('#collegeDashboardWeeklyAnchor').addClass('active');
    });
}

if ($('#collegeDashboardMonthlyAnchor').length > 0) {
    $(document).on('click', '#collegeDashboardMonthlyAnchor', function () {
        // update graph data
        currentChartSubtype = 3;
        collegeDashboardGraphLoad(currentCharttype, 3);
        $('.chartModeSwitcher').removeClass('active');
        $('#collegeDashboardMonthlyAnchor').addClass('active');
    });
}

function checkStartEndDate() {
    $("form#collegeDashboardForm").serialize();
    var startDate = $('#collegeDashboardStartDate').val();
    var endDate = $('#collegeDashboardEndDate').val();

    var startDateArray = startDate.split('/');
    var endDateArray = endDate.split('/');

    startDate = startDateArray[2] + '-' + startDateArray[1] + '-' + startDateArray[0];
    endDate = endDateArray[2] + '-' + endDateArray[1] + '-' + endDateArray[0];
//    alert(startDate+'=='+endDate);
    if (endDate < startDate) {
        return false;
    } else {
        return true;
    }
}



/*if (navigator.userAgent.match(/MSIE 9/) !== null) {
 $(document).ready(function(){
 $('.navbar-toggle').click(function(event){
 event.stopPropagation();
 $("#menu-block").slideToggle("fast");
 });
 $(".navbar-toggle").on("click", function (event) {
 event.stopPropagation();
 });
 });

 $(document).on("click", function () {
 $("#menu-block").hide();
 });-
 }*/

//calling of function collegeDashboardPaymentLoad and collegeDashboardApplicantsLoad is replaced by collegeDashboardDataLoad();
function collegeDashboardApplicantsLoad() {

    $.ajax({
        url: jsVars.FULL_URL + '/colleges/formApplicantStats',
        type: 'post',
        data: $("form#collegeDashboardForm").serialize(),
        dataType: 'html', //'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            // loader display
            jQuery('#applicant_list').html('<tr><td colspan="9"><div class="loader-block"></div></td></tr>');
        },
        complete: function () {
            //		$('#contact-us-final div.loader-block').hide();
        },
        success: function (data) {

            jQuery('#applicant_list').html(data);
            return;
            if (json['status'] == 1 && $.trim(json['applicantData']) != '') {
                console.log(json['applicantData']);
                console.log(Object.keys(json['applicantData']['payment_mode_list']).length);

                // Generating HTML


                var payment_mode_list=json['applicantData']['payment_mode_list'];
                var total_payment_mode=Object.keys(payment_mode_list).length;

                var tr='';
                for (var data in json.applicantData.listing_detail) {
                    var list_data=json['applicantData']['listing_detail'][data];

                        var td='';
                        var tdWidth='';
                        var tdClass='';
                        var deadline=list_data['deadline_date'];
                        if (list_data['deadline_date'] != '0') {
                            deadline = timeConverter(list_data['deadline_date']);
                        }

                        td += '<td ' + tdWidth + tdClass + '>' + list_data['form_title'] + '</td>';
                        td += '<td ' + tdWidth + tdClass + '>' + list_data['deadline_date'] + '</td>';
                        td += '<td ' + tdWidth + tdClass + '>' + list_data['total_application'] + '</td>';
                        td += '<td ' + tdWidth + tdClass + '>' + list_data['total_payment_received'] + '</td>';
                        td += '<td ' + tdWidth + tdClass + '>' + list_data['total_payment_pending'] + '</td>';
                        td += '<td ' + tdWidth + tdClass + '>' + list_data['total_payment_initiated'] + '</td>';
                        td += '<td ' + tdWidth + tdClass + '>' + list_data['total_payment_not_initiated'] + '</td>';

                        for (var payment_method in payment_mode_list) {
                            //console.log('TTTT' + data2);
                            td += '<td ' + tdWidth + tdClass + '>' + json['applicantData']['payment_mode_detail'][data][payment_method] + '</td>';
                        }

                  tr += '<tr class="even">' + td + '</tr>';
                }


                /*
                var td_array = ['form_name', 'deadline_date', 'count', 'recieved_count', 'pending_count', 'dd_count', 'dd_pending_count', 'online_count', 'voucher_count'];
                var tr = '';


                for (var data in json['applicantData']) {

                    var td = '';
                    var appl_data = json['applicantData'][data];

                    for (var keydata in td_array) {
                        var tdWidth = '';
                        if (td_array[keydata] == 'form_name') {
                            tdWidth = ' width="20%"';
                        } else {
                            tdWidth = ' width="10%"';
                        }
                        var tdClass = ' class="custom-color text-center"';
                        if (appl_data[td_array[keydata]] != '' && typeof appl_data[td_array[keydata]] != 'undefined') {
                            var val = appl_data[td_array[keydata]];
                            if (appl_data[td_array[keydata] + '_hash']) {
                                if (td_array[keydata] == 'pending_count') {
                                    var data = val;
                                } else {
//                                        var linkHash = appl_data[td_array[keydata]+'_hash'];
//                                        var data = '<a class="custom-color" href="/applications/view/'+linkHash+'">'+val+'</a>';
                                    var data = val;
                                }
                            } else {
                                var data = val;
                            }
                        } else {
                            var data = '0';
                        }

                        if (td_array[keydata] == 'deadline_date' || td_array[keydata] == 'form_name') {

                            tdClass = '';
                            if (data == '0') {
                                data = '-';
                            }
                            if (td_array[keydata] == 'deadline_date' && data != '0') {
                                data = timeConverter(data);
                            }
                        }


                        td += '<td ' + tdWidth + tdClass + '>' + data + '</td>';
                    }
                    tr += '<tr class="even">' + td + '</tr>';
                }*/
                jQuery('#applicant_list').html('');
                jQuery('#applicant_list').append(tr);
            } else {
                jQuery('#applicant_list').html('<tr><td colspan="9">Information Not Available</td></tr>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            //            $('#contact-us-final div.loader-block').hide();
        }
    });
}



function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
//  var hour = a.getHours();
//  var min = a.getMinutes();
//  var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year;// + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

function getTemplateList(elem) {
    //admitcard_template_id
    var college_id = $(elem).val();
    $.ajax({
        cache: false,
        url: jsVars.FULL_URL + '/colleges/template-list',
        type: 'post',
        data: {'college_id': college_id},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#graphStatsLoaderConrainer').show();
        },
        complete: function () {
            $('#graphStatsLoaderConrainer').hide();
        },
        success: function (json) {
            if (json['redirect']) {
                location = json['redirect'];
            } else if (json['error']) {
                alertPopup(json['error'], 'error');
            } else if (json['success'] == 200) {
                var html_opt = '<option value="">--Template Name--</option>';
                if (json['listTemplate']) {
                    for (var dtindex in json['listTemplate']) {
                        //console.log(json['listTemplate'][dtindex]);
                        html_opt += '<option value="' + dtindex + '">' + json['listTemplate'][dtindex] + '</option>';
                    }

                } else {

                }
                $('#admitcard_template_id').html(html_opt);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
//            $('#contact-us-final div.loader-block').hide();
        }
    });

    /*****calling college config*****/
    getcollegeConfig(college_id);

}
$(document).ajaxComplete(function() {
    $('[data-toggle="popover"]').popover();
});
/*****
 * Get Collage config for getting payment gateway at form create/edit
 * $param college_id
 * Return HTML radio
 * ****/
function getcollegeConfig(college_id, formId){
    if(typeof formId =='undefined'){
        formId = '';
    }
    //getting online payment config
        $.ajax({
            url: jsVars.FULL_URL + '/form/payment-config',
            type: 'post',
            dataType: 'json',
            data: {'college_id': college_id, 'formId': formId},
            headers: {"X-CSRF-Token": jsVars._csrfToken},
            success: function (data) {
                if(typeof data.redirect !='undefined' && data.redirect!=''){
                    window.location = data.redirect;
                }else if(data.success=='200'){
                    var checkbox='';
                    for(var config in data.payment_config.gateways){
                        if(data.payment_config.gateways[config]==1){
                            selected = '';
                            if(data.payment_config_saved[0]!='' && config==data.payment_config_saved[0]){
                               selected = 'selected=true';
                            }else if(data.payment_config.default_gateway==config){
                                selected = 'selected=true';
                            }

                            checkbox += '<option value="'+config+'" '+selected+'>'+config+'</option>';
                        }
                    }

                    if($("#payment-mode-online").is(':checked')){
                        $(".hideshow").show();
                    }else{
                        $(".hideshow").hide();
                    }
                    $("#gateWayType select#payment_gateway_type").html(checkbox);
                    $('.chosen-select').trigger('chosen:updated');
                    if($("#payment_gateway_type").val()==='ccAvenue'){
                        $("#hybridGatewayDiv").show();
                    }else{
                        $("#hybridGatewayDiv").hide();
                    }

                }else{
                    alertPopup(json['error'],'error');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
}
/****This function call on click on online checkbox*****/
$("#payment-mode-online").on('click', function(){
    if($("#payment-mode-online").is(':checked')){
        $(".hideshow").show();  // checked
        var cid = $("#institute_name").val();
        var formId = $("#formId").val();
        if(cid!=''){
            getcollegeConfig(cid, formId);
        }
        if($("#payment_gateway_type").val()==='ccAvenue'){
            $("#hybridGatewayDiv").show();
        }else{
            $("#hybridGatewayDiv").hide();
        }
    }else{
        $(".hideshow").hide();
    }
});
/***end********/
/****This function call on click on online checkbox*****/
$("#payment_gateway_type").on('change', function(){
    $("#hybridGatewayDiv").hide();
    $("#hybrid_payment_gateway").removeAttr('checked');
    if($(this).val()==='ccAvenue'){
        $("#hybridGatewayDiv").show();
    }
});
/***end********/
/*placeholder*/
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    /****
     * Allows plugin behavior simulation in modern browsers for easier debugging.
     * When setting to true, use attribute "placeholder-x" rather than the usual "placeholder" in your inputs/textareas
     * i.e. <input type="text" placeholder-x="my placeholder text" />
     */
    var debugMode = false;

    // Opera Mini v7 doesn't support placeholder although its DOM seems to indicate so
    var isOperaMini = Object.prototype.toString.call(window.operamini) === '[object OperaMini]';
    var isInputSupported = 'placeholder' in document.createElement('input') && !isOperaMini && !debugMode;
    var isTextareaSupported = 'placeholder' in document.createElement('textarea') && !isOperaMini && !debugMode;
    var valHooks = $.valHooks;
    var propHooks = $.propHooks;
    var hooks;
    var placeholder;
    var settings = {};

    if (isInputSupported && isTextareaSupported) {

        placeholder = $.fn.placeholder = function () {
            return this;
        };

        placeholder.input = true;
        placeholder.textarea = true;

    } else {

        placeholder = $.fn.placeholder = function (options) {

            var defaults = {customClass: 'placeholder'};
            settings = $.extend({}, defaults, options);

            return this.filter((isInputSupported ? 'textarea' : ':input') + '[' + (debugMode ? 'placeholder-x' : 'placeholder') + ']')
                    .not('.' + settings.customClass)
                    .not(':radio, :checkbox, [type=hidden]')
                    .bind({
                        'focus.placeholder': clearPlaceholder,
                        'blur.placeholder': setPlaceholder
                    })
                    .data('placeholder-enabled', true)
                    .trigger('blur.placeholder');
        };

        placeholder.input = isInputSupported;
        placeholder.textarea = isTextareaSupported;

        hooks = {
            'get': function (element) {

                var $element = $(element);
                var $passwordInput = $element.data('placeholder-password');

                if ($passwordInput) {
                    return $passwordInput[0].value;
                }

                return $element.data('placeholder-enabled') && $element.hasClass(settings.customClass) ? '' : element.value;
            },
            'set': function (element, value) {

                var $element = $(element);
                var $replacement;
                var $passwordInput;

                if (value !== '') {

                    $replacement = $element.data('placeholder-textinput');
                    $passwordInput = $element.data('placeholder-password');

                    if ($replacement) {
                        clearPlaceholder.call($replacement[0], true, value) || (element.value = value);
                        $replacement[0].value = value;

                    } else if ($passwordInput) {
                        clearPlaceholder.call(element, true, value) || ($passwordInput[0].value = value);
                        element.value = value;
                    }
                }

                if (!$element.data('placeholder-enabled')) {
                    element.value = value;
                    return $element;
                }

                if (value === '') {

                    element.value = value;

                    // Setting the placeholder causes problems if the element continues to have focus.
                    if (element != safeActiveElement()) {
                        // We can't use `triggerHandler` here because of dummy text/password inputs :(
                        setPlaceholder.call(element);
                    }

                } else {

                    if ($element.hasClass(settings.customClass)) {
                        clearPlaceholder.call(element);
                    }

                    element.value = value;
                }
                // `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
                return $element;
            }
        };

        if (!isInputSupported) {
            valHooks.input = hooks;
            propHooks.value = hooks;
        }

        if (!isTextareaSupported) {
            valHooks.textarea = hooks;
            propHooks.value = hooks;
        }

        $(function () {
            // Look for forms
            $(document).delegate('form', 'submit.placeholder', function () {

                // Clear the placeholder values so they don't get submitted
                var $inputs = $('.' + settings.customClass, this).each(function () {
                    clearPlaceholder.call(this, true, '');
                });

                setTimeout(function () {
                    $inputs.each(setPlaceholder);
                }, 10);
            });
        });

        // Clear placeholder values upon page reload
        $(window).bind('beforeunload.placeholder', function () {

            var clearPlaceholders = true;

            try {
                // Prevent IE javascript:void(0) anchors from causing cleared values
                if (document.activeElement.toString() === 'javascript:void(0)') {
                    clearPlaceholders = false;
                }
            } catch (exception) {
            }

            if (clearPlaceholders) {
                $('.' + settings.customClass).each(function () {
                    this.value = '';
                });
            }
        });
    }

    function args(elem) {
        // Return an object of element attributes
        var newAttrs = {};
        var rinlinejQuery = /^jQuery\d+$/;

        $.each(elem.attributes, function (i, attr) {
            if (attr.specified && !rinlinejQuery.test(attr.name)) {
                newAttrs[attr.name] = attr.value;
            }
        });

        return newAttrs;
    }

    function clearPlaceholder(event, value) {

        var input = this;
        var $input = $(this);

        if (input.value === $input.attr((debugMode ? 'placeholder-x' : 'placeholder')) && $input.hasClass(settings.customClass)) {

            input.value = '';
            $input.removeClass(settings.customClass);

            if ($input.data('placeholder-password')) {

                $input = $input.hide().nextAll('input[type="password"]:first').show().attr('id', $input.removeAttr('id').data('placeholder-id'));

                // If `clearPlaceholder` was called from `$.valHooks.input.set`
                if (event === true) {
                    $input[0].value = value;

                    return value;
                }

                $input.focus();

            } else {
                input == safeActiveElement() && input.select();
            }
        }
    }

    function setPlaceholder(event) {
        var $replacement;
        var input = this;
        var $input = $(this);
        var id = input.id;

        // If the placeholder is activated, triggering blur event (`$input.trigger('blur')`) should do nothing.
        if (event && event.type === 'blur' && $input.hasClass(settings.customClass)) {
            return;
        }

        if (input.value === '') {
            if (input.type === 'password') {
                if (!$input.data('placeholder-textinput')) {

                    try {
                        $replacement = $input.clone().prop({'type': 'text'});
                    } catch (e) {
                        $replacement = $('<input>').attr($.extend(args(this), {'type': 'text'}));
                    }

                    $replacement
                            .removeAttr('name')
                            .data({
                                'placeholder-enabled': true,
                                'placeholder-password': $input,
                                'placeholder-id': id
                            })
                            .bind('focus.placeholder', clearPlaceholder);

                    $input
                            .data({
                                'placeholder-textinput': $replacement,
                                'placeholder-id': id
                            })
                            .before($replacement);
                }

                input.value = '';
                $input = $input.removeAttr('id').hide().prevAll('input[type="text"]:first').attr('id', $input.data('placeholder-id')).show();

            } else {

                var $passwordInput = $input.data('placeholder-password');

                if ($passwordInput) {
                    $passwordInput[0].value = '';
                    $input.attr('id', $input.data('placeholder-id')).show().nextAll('input[type="password"]:last').hide().removeAttr('id');
                }
            }

            $input.addClass(settings.customClass);
            $input[0].value = $input.attr((debugMode ? 'placeholder-x' : 'placeholder'));

        } else {
            $input.removeClass(settings.customClass);
        }
    }

    function safeActiveElement() {
        // Avoid IE9 `document.activeElement` of death
        try {
            return document.activeElement;
        } catch (exception) {
        }
    }
}));



// To test the @id toggling on password inputs in browsers that don�t support changing an input�s @type dynamically (e.g. Firefox 3.6 or IE), uncomment this:
// $.fn.hide = function() { return this; }
// Then uncomment the last rule in the <style> element (in the <head>).
$(function () {
    // Invoke the plugin
    $('input, textarea').placeholder({customClass: 'my-placeholder'});
    // That�s it, really.


});

/*end placeholder*/

//function ChangeSession(value) {
//    $.ajax({
//        url: jsVars.FULL_URL + '/common/set-college',
//        type: 'post',
//        dataType: 'text',
//        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
//        data: {
//            "value": value
//        },
//        headers: {
//            "X-CSRF-Token": jsVars._csrfToken
//        },
//        success: function (data) {
//            window.location.href = location.href;
//        },
//        error: function (xhr, ajaxOptions, thrownError) {
//            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
//            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
//        }
//    });
//}

function CheckTemplateType(val) {
    if (val == "print_application") {
        $('#suggestions_print_pdf').fadeIn();
        $('#suggestions_machine_key').hide();
    } else {
        $('#suggestions_print_pdf').hide();
        $('#suggestions_machine_key').fadeIn();
    }

}

function LoadTemplateAliases(value, form_id) {
    $.ajax({
        url: jsVars.FULL_URL + '/form/get-template-aliases',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "ptId": value,
            "college_id": jsVars.template_college_id,
            "form_id": form_id
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (data) {
            $('#loadTempAliases').html(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
function LoadColumns(k, value) {
    jQuery('#load_table_column_' + k).html('');
    if (typeof table_columns_obj != 'undefined' && value != '') {

//        console.log(k);
//        console.log(value);
        var html = '';
        //console.log(table_columns_obj);

        var results = {};
        //    var toSearch = "radio";
        for (key in table_columns_obj) {

            var str = table_columns_obj[key];
            var re = new RegExp(value, 'i');
//            console.log(re.test(str));
            if (re.test(str)) {
                html += "<li onclick=\"setTableTagValue('" + k + "','" + key + "')\">" + str + " (" + key + ")</li>";
            }
        }

        if (html != '') {
            var ul = "<ul class='autosuggest'>" + html + "</ul>";

            jQuery('#load_table_column_' + k).show();
            jQuery('#load_table_column_' + k).html(ul);

        }

    }

}

function setTableTagValue(k, key) {

    var str = table_columns_obj[key];
    var tag_key = '<span id="' + key + '">' + str + ' <i onclick="deleteAliasField(\'' + k + '\', \'' + key + '\',this);" aria-hidden="true" class="fa fa-times"></i></span>';
    jQuery("#border_selected_tag_" + k).append(tag_key);
    jQuery("#input_enter_" + k).val('');
    jQuery('#load_table_column_' + k).html('');
    jQuery('#load_table_column_' + k).hide();

    var existing_val = $('#alias_value_' + k).val();
    if (existing_val == '') {
        existing_val = key;
    } else {
        existing_val += ',' + key;
    }

    jQuery('#alias_value_' + k).val(existing_val);

}

function deleteAliasField(k, key, elem) {

    var alias_value = jQuery('#alias_value_' + k).val();
    if (alias_value != '') {
        alias_value_array = alias_value.split(',');

//        console.log(alias_value_array[key]);
        var index = alias_value_array.indexOf(key);
        if (index > -1) {
            alias_value_array.splice(index, 1);
//          delete alias_value_array[index];
        }
        var alisa_val = '';
        if (alias_value_array.length > 0) {
            var alisa_val = alias_value_array.toString();
        }
        jQuery('#alias_value_' + k).val(alisa_val);
        jQuery(elem).parent('span').remove();
    }
}

/***************Taxonomy Controller*********************/

function ShowCategoryInput(id, ParentId) {

    if ($('li#load_' + id).length > 0)
    {
        if ($('li#load_' + id + ' select#parent_id_' + id).html() == '')
        {
            var ParentCatHtml = $('#HiddenParentCatList').html();
            $('li#load_' + id + ' select#parent_id_' + id).html(ParentCatHtml);
            if (ParentId > 0)
            {
                $('li#load_' + id + ' select#parent_id_' + id).val(ParentId);
            }
        }
    }

    $('.label_' + id).hide();
    $('.input_' + id).fadeIn();
}
function AddChildTaxonomy(parent_id, load_html_id) {
    random_no = Math.floor((Math.random() * 100000) + 1);
    suffix = random_no + "_" + parent_id;

    html = '<div class="row form-inline common-manager" id="main_' + suffix + '"><div class="col-md-4 npf-form-group"><input type="hidden" id="parent_id_' + suffix + '" value="' + parent_id + '"><input type="text" class="form-control" id="cat_name_' + suffix + '" placeholder="Category Name"></div><div class="col-md-4 npf-form-group"><input type="text" class="form-control" id="sort_order_' + suffix + '" placeholder="Sort Order"></div><div class="col-md-4 npf-form-group"><button type="button" onClick="javascript:SaveTaxonomy(\'' + suffix + '\');" id="btn_' + suffix + '" class="btn btn-sm w-text npf-btn">Save</button><button  type="button" onClick="javascript:$(\'#main_' + suffix + '\').remove();" class="btn btn-sm dark-grey ">Close</button></div><div class="error col-md-12" id="error_' + suffix + '"></div></div>';
    $('#' + load_html_id).append(html);
    $('html, body').animate({
        scrollTop: $('#cat_name_' + suffix).offset().top - 10
    }, 700);
    //$('#cat_name_'+suffix).focus();
}

function UpdateTaxonomy(id) {

    $('#btn_' + id).html("Wait");
    $('#btn_' + id).prop("disabled",true);
    $('#error_' + id).html('');
    var category_name = $('#cat_name_' + id).val();
    var sort_order = $('#sort_order_' + id).val();
    var parent_id = $('#parent_id_' + id).val();
    var status_sel = $('#cat_status_' + id).val();

    $.ajax({
        url: jsVars.FULL_URL + '/taxonomies/edit',
        type: 'post',
        dataType: 'json',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "parent_id": parent_id,
            "category_name": category_name,
            "sort_order": sort_order,
            "status": status_sel,
            "id": id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if (data['success']) {
                $('#btn_' + id).html("Save");
                $('#btn_' + id).prop("disabled",false);
                console.log(data)
                var dataInfo = data['dataInfo']
                var status = (dataInfo['status'] == 1) ? 'Active' : 'Inactive';
                $('#status_' + id +" span").text(status);
                $('#sort_' + id +" span").text(dataInfo['sort_order']);
                //$('#parent_' + id +" span").text(dataInfo['machine_key'] + '_' +id);
                $('#cat_' + id +" span").text(dataInfo['title']);

                $('.label_' + id).fadeIn();
                $('.input_' + id).hide();
                //$('#main_'+id).remove();
//                if (parent_id != "" && parent_id > 0)
//                    LoadChildTaxonomy(parent_id, 'load_' + parent_id);
//                else
//                    LoadChildTaxonomy(0, 'nestable');
                //MakeTreeActive();
            } else {
                $('#error_' + id).html(data['error']);
                $('#btn_' + id).prop("disabled",false);
                $('#btn_' + id).html("Save");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function SaveTaxonomy(suffix) {

    $('#btn_' + suffix).html("Wait");

    var category_name = $('#cat_name_' + suffix).val();
    var sort_order = $('#sort_order_' + suffix).val();
    var parent_id = $('#parent_id_' + suffix).val();

    $.ajax({
        url: jsVars.FULL_URL + '/taxonomies/add',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "parent_id": parent_id,
            "category_name": category_name,
            "sort_order": sort_order
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if (data == "success") {
                $('#main_' + suffix).remove();
                LoadChildTaxonomy(parent_id, 'load_' + parent_id);
                //MakeTreeActive();
            } else {
                $('#error_' + suffix).html(data);
                $('#btn_' + suffix).html("Save");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function LoadChildTaxonomy(parent_id, load_html_id, Start) {

    if (jsVars.s_parent_id != "" && load_html_id == "nestable") { // if it is searched from form then search
        parent_id = jsVars.s_parent_id;
    }
    var s_text = "";

    /*if (jsVars.s_text != "" && (load_html_id == "nestable" || load_html_id == "nestableList")) { // if it is searched from form then search
        s_text = jsVars.s_text;
    } else
        */if ($('#s_text').val() != "" && (load_html_id == "nestable" || load_html_id == "nestableList")) { // if it is searched from form then search
        s_text = $('#s_text').val();
    }

    if (typeof Start == 'undefined')
    {
        var Page = 'all';
    } else
    {
        var Page = Start;
    }

    if (load_html_id == "nestableList")
    {
        $('#LoadMoreArea input').attr('disabled', true);
        $('#LoadMoreArea input').attr('value', 'Loading...');
    } else {
        $('#' + load_html_id + ' .dd-list').remove();
        $('#' + load_html_id).append("<div class='dd-list'>Loading...</div>");
    }

    $.ajax({
        url: jsVars.FULL_URL + '/taxonomies/ajax-lists',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "parent_id": parent_id,
            "s_text": s_text,
            Page: Page
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            Page = Page + 1;
            if (load_html_id == "nestableList")
            {
                if (Page == 1)
                {
                    if(data !='<ol class="dd-list"></ol>'){
                        $('#' + load_html_id).html(data);
                    }else{
                         $('#' + load_html_id).html("<div align='center' class='alert alert-danger'>Data Not Found.</div>");
                    }
                 } else {
                    $('#' + load_html_id + ' > ol.dd-list').append(data);
                }
            } else
            {
                $('#' + load_html_id + ' .dd-list').remove();
                $('#' + load_html_id).append(data);
            }
            setTimeout('$("li").removeClass("bounceInUp");', 2000);
            setTimeout('$("li").removeClass("animated");', 2000);
            if (load_html_id == "nestableList")
            {
                $('#LoadMoreArea input').removeAttr('disabled');
                $('#LoadMoreArea input').attr('value', 'Load More Taxonomy');
                $('#LoadMoreArea button').attr('onclick', 'LoadChildTaxonomy(0, \'nestableList\',' + Page + ');');
                 if(data !='<ol class="dd-list"></ol>'){
                    $('#LoadMoreArea').show();
                 }else{
                     $('#LoadMoreArea').hide();
                 }
                if (data.trim() == '')
                {
                    $('#LoadMoreArea').hide();
                }
            }
//                    else
//                    {
//                        MakeTreeActive();
//                    }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function MakeTreeActive() {
    $(document).ready(function () {

        var updateOutput = function (e) {
            var list = e.length ? e : $(e.target),
                    output = list.data('output');
            if (jQuery(list).prop("tagName") == "DIV") {
                //console.log("aaaa");
                if (window.JSON) {
                    output.val(window.JSON.stringify(list.nestable('serialize')));//, null, 2));
                } else {
                    output.val('JSON browser support required for this demo.');
                }

            }
        };

        // activate Nestable for list 1
        $('#nestable').nestable({
            group: 1
        })
                .on('change', updateOutput);
        // output initial serialised data
        updateOutput($('#nestable').data('output', $('#nestable-output')));
    });
}

function UpdateParents() {
    var data = $('#nestable-output').val();

    if (data == "")
        return false;

    $('#btn_parent_update').html("Updating...");
    $.ajax({
        url: jsVars.FULL_URL + '/taxonomies/parent-update',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "data": data
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if (data == "success") {
                $('#btn_parent_update').html("Update Parent");
                //LoadChildTaxonomy(0,'nestable');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

}
/***************End Taxonomy Controller*********************/



/***************Leads Controller*********************/

function SelectAllLeads() {
    //$( "input:checked" ).length;
    if ($('#user_selection:checked').length > 0) {
        $('.select_users').each(function () { //loop through each checkbox
            this.checked = true;  //select all checkboxes with class "checkbox1"
        });
    } else {
        $('.select_users').each(function () { //loop through each checkbox
            this.checked = false;  //select all checkboxes with class "checkbox1"
        });
    }
}

$(document).on('change', '#FilterLeadForm select#college_id', function () {
    if (this.value > 0)
    {
        if (typeof CollegeWiseCreaterList != "undefined" && this.value in CollegeWiseCreaterList['CollegeWise'])
        {
            UpdateCreatedBySelect(CollegeWiseCreaterList['CollegeWise'][this.value], postedCreatedBy);
        } else
        {
            UpdateCreatedBySelect([]);
        }
    } else
    {
        $('#CreateLeadStartBtn').addClass("display-none");
        if (typeof CollegeWiseCreaterList != 'undefined')
            UpdateCreatedBySelect([]);
    }
});

$(document).on('change', '#FilterLeadForm select#form_id', function () {
    if (this.value > 0)
    {
        $('#CreateLeadStartBtn').removeClass("display-none");
    } else
    {
        $('#CreateLeadStartBtn').addClass("display-none");
    }
});

$(document).on('click', '#CreateLeadForm #CreateleadBtn', function () {
    if($('#FilterLeadForm select#college_id').val()>0){
        var CollegeId = $('#FilterLeadForm select#college_id').val();
        var FormId = $('#FilterLeadForm select#form_id').val();
        $('#CreateLeadForm #CollegeId').val(CollegeId);
        $('#CreateLeadForm #FormId').val(FormId);
        CreateLeadOffline();
    }
});

function CreateLeadOffline()
{
    $.ajax({
        url: jsVars.CreateLeadOfflineUrl,
        type: 'post',
        data: $('#CreateLeadForm').serializeArray(),
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
        success: function (json)
        {
            if (json['redirect'])
            {
                location = json['redirect'];
            } else if (json['error'])
            {
                for (var key in json.error)
                {
                    $("#" + key).parents("div.form-group").addClass("padding-bottom-25 has-error");
                    $("#" + key).next("span.help-block").text('');
                    $("#" + key).next("span.help-block").append(json.error[key]);
                    $("#" + key).focus();
                }
            } else if (json['success'] == 200)
            {
                location = json['location'];
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
        }
    });

}

function LoadMoreLeads() {

    var data = $('#FilterLeadForm').serializeArray();
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $.ajax({
        url: jsVars.FULL_URL + '/leads/ajax-load',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "data": data,
            "form_id": jsVars.form_id,
            "page": Page
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            Page = Page + 1;
            if (data == "error") {
                $('#load_more_results').append("<div class='alert alert-danger'>No More Records</div>");
                $('#load_more_button').hide();
            } else {
                $('#load_more_results').append(data);
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html("Next Page");
//                $.material.init();
            }
            //console.log(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function LoadMoreCSVLogs() {

    var data = $('#FilterLeadForm').serializeArray();
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $.ajax({
        url: jsVars.FULL_URL + '/leads/ajax-csv-logs',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "data": data,
            "page": Page
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            data = data.replace("<head/>", '');
            Page = Page + 1;
            if (data == "error") {
                $('#load_more_results').append(" <tr><td colspan='8'><div class='alert alert-danger'>No More Records</div></td></tr>");
                $('#load_more_button').hide();
            } else {
                $('#load_more_results').append(data);
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html("Next Page");
            }
            //console.log(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/***************End Leads Controller*********************/


/********************Start of Reports Controller******************************/


function AddParentLoop(id) {
    //var new_id=Math.floor((Math.random() * 10) + 1);
    //console.log(new_id);
    var $siblings = $('input[name="hidden_loop_id[]"]');
    var new_id = 0;
    $.each($siblings, function (i, input) {
        var _this = parseInt(input.value);
        if (new_id < _this) {
            new_id = _this;
        }
    })
    new_id = new_id + 1;
    //console.log(new_id);

    var div = $('div#loop_' + id);
    var cloned = div.clone().prop('id', 'loop_' + new_id);
    //cloned=cloned.replace(/id_1/,'id_'+new_id);
//    cloned.find('div[id^="loop_"]').attr('id', 'loop_' +  new_id);
    jQuery(cloned).find('[id*="hidden_loop_id_"]').attr('id', 'hidden_loop_id_' + new_id); // hiidden text id
    jQuery(cloned).find('[id*="hidden_loop_id_"]').val(new_id);// hiidden text value

    jQuery(cloned).find('[name*="parent_logic_"]').attr('name', 'parent_logic_' + new_id); // name of parent logic
    jQuery(cloned).find('[name*="child_logic_"]').attr('name', 'child_logic_' + new_id); //  name of child logic

    jQuery(cloned).find('[id*="add_loop_"]').attr('id', 'add_loop_' + new_id); //  anchor tag to add new main loop
    jQuery(cloned).find('[id*="add_loop_"]').attr('onClick', "javascript:AddParentLoop('" + new_id + "');"); //  anchor tag on click function

    jQuery(cloned).find('[class*="child_loop_"]').attr('class', 'row child_loop_' + new_id); //  anchor tag to add new main loop

    jQuery(cloned).find('[name*="machine_keys_"]').attr('name', 'machine_keys_' + new_id + '[]'); //  machine keys dropdown
    jQuery(cloned).find('[name*="conditional_operators_"]').attr('name', 'conditional_operators_' + new_id + '[]'); //  conditional operators dropdown
    jQuery(cloned).find('[name*="conditional_values_"]').attr('name', 'conditional_values_' + new_id + '[]'); //  conditional values dropdown

    jQuery(cloned).find('[id*="add_child_loop_"]').attr('id', 'add_child_loop_' + new_id);  //  anchor tag to add new child loop
    jQuery(cloned).find('[id*="add_child_loop_"]').attr('onClick', "javascript:AddChildLoop('" + new_id + "');"); //  anchor tag on click function

    jQuery(cloned).find('.chosen-container').remove(); //  remove chosen dropdown hidden div

    //console.log(jQuery(cloned).find('[id*="id_"]').length);
    $('#loop_' + id).after(cloned);
    $('#loop_' + new_id).hide(); // this is for effect.
    $('#loop_' + new_id).fadeIn('slow'); // this is for effect.

    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});

    return false;

    //$('div[id^="klon"]:last');
}

function AddChildLoop(id) {
    var div = $('div.child_loop_' + id + ":first");
    var cloned = div.clone();

    $(cloned).find('.chosen-container').remove(); //  remove chosen dropdown hidden div

    $('div#loop_' + id).append(cloned);

    $(cloned).hide(); // this is for effect.
    $(cloned).fadeIn('slow'); // this is for effect.

    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});

    return false;
}

function RemoveParentLoop(elem) {
    $(elem).parent("div").parent(".row").parent(".loop_criteria").fadeOut("fast", function () {
        $(elem).parent("div").parent(".row").parent(".loop_criteria").remove();
    });

    //
    return false;
}

function RemoveChildLoop(elem) {
    $(elem).parent("div").parent(".row").fadeOut("fast", function () {
        $(elem).parent("div").parent(".row").remove();
    });

    //
    return false;
}

// this function will add new criteria for form level condition
function AddFormParentLoop(id) {
    //var new_id=Math.floor((Math.random() * 10) + 1);
    //console.log(new_id);
    var $siblings = $('input[name="form_hidden_loop_id[]"]');
    var new_id = 0;
    $.each($siblings, function (i, input) {
        var _this = parseInt(input.value);
        if (new_id < _this) {
            new_id = _this;
        }
    })
    new_id = new_id + 1;
    //console.log(new_id);

    var div = $('div#form_loop_' + id);
    var cloned = div.clone().prop('id', 'form_loop_' + new_id);
    //cloned=cloned.replace(/id_1/,'id_'+new_id);
//    cloned.find('div[id^="loop_"]').attr('id', 'loop_' +  new_id);
    jQuery(cloned).find('[id*="form_hidden_loop_id_"]').attr('id', 'form_hidden_loop_id_' + new_id); // hiidden text id
    jQuery(cloned).find('[id*="form_hidden_loop_id_"]').val(new_id);// hiidden text value

    jQuery(cloned).find('[name*="form_id_"]').attr('name', 'form_id_' + new_id); // name of form id
    jQuery(cloned).find('[name*="form_parent_logic_"]').attr('name', 'form_parent_logic_' + new_id); // name of parent logic
    jQuery(cloned).find('[name*="form_child_logic_"]').attr('name', 'form_child_logic_' + new_id); //  name of child logic

    jQuery(cloned).find('[id*="form_add_loop_"]').attr('id', 'form_add_loop_' + new_id); //  anchor tag to add new main loop
    jQuery(cloned).find('[id*="form_add_loop_"]').attr('onClick', "javascript:AddFormParentLoop('" + new_id + "');"); //  anchor tag on click function

    jQuery(cloned).find('[class*="form_child_loop_"]').attr('class', 'row form_child_loop_' + new_id); //  anchor tag to add new main loop

    jQuery(cloned).find('[class*="form_machine_keys_"]').attr('class', 'col-md-3 form_machine_keys_' + new_id); //  anchor tag to add new main loop

    jQuery(cloned).find('[name*="form_machine_keys_"]').attr('name', 'form_machine_keys_' + new_id + '[]'); //  machine keys dropdown
    jQuery(cloned).find('[name*="form_conditional_operators_"]').attr('name', 'form_conditional_operators_' + new_id + '[]'); //  conditional operators dropdown
    jQuery(cloned).find('[name*="form_conditional_values_"]').attr('name', 'form_conditional_values_' + new_id + '[]'); //  conditional values dropdown

    jQuery(cloned).find('[id*="form_add_child_loop_"]').attr('id', 'form_add_child_loop_' + new_id);  //  anchor tag to add new child loop
    jQuery(cloned).find('[id*="form_add_child_loop_"]').attr('onClick', "javascript:AddFormChildLoop('" + new_id + "');"); //  anchor tag on click function

    $(cloned).find('.chosen-container').remove(); //  remove chosen dropdown hidden div

    //console.log(jQuery(cloned).find('[id*="id_"]').length);
    $('#form_loop_' + id).after(cloned);
    $('#form_loop_' + new_id).hide(); // this is for effect.
    $('#form_loop_' + new_id).fadeIn('slow'); // this is for effect.

    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});

    return false;

    //$('div[id^="klon"]:last');
}

function AddFormChildLoop(id) {
    var div = $('div.form_child_loop_' + id + ":first");
    var cloned = div.clone();

    $(cloned).find('.chosen-container').remove(); //  remove chosen dropdown hidden div

    $('div#form_loop_' + id).append(cloned);

    $(cloned).hide(); // this is for effect.
    $(cloned).fadeIn('slow'); // this is for effect.
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    return false;
}

function renderFields(elem) {
    //console.log($(elem).parents( ".loop_criteria" ).find("[id*='loop_']").attr("id"));
    curr_id = $(elem).parents(".loop_criteria").find("[id*='hidden_loop_id_']").attr("id").match(/\d+/)[0];
    //console.log(id);
    html = "<input type='text' class='form-control' name='conditional_values_" + curr_id + "[]' value='' placeholder='Value'>";

    value_field = elem.value;
    var arr = value_field.split("||");
    type = "";
    if (arr.length > 2) {
        var type = arr[1];
        var val_json = arr[2];
        //console.log(arr);
        if (type == "dropdown") {
            html = "<select class='chosen-select' name='conditional_values_" + curr_id + "[]'>";
            obj_json = JSON.parse(val_json);
            for (var key in obj_json) {
                html += "<option value='" + key + "'>" + obj_json[key] + "</option>";
            }
            html += "</select>";
        } else if (type == "date") {
            var operator_sel = $(elem).parent("div").parent('.row').find("[name*='conditional_operators_']").val();
            if (operator_sel == "between" || operator_sel == "not_between")
                class_date = "daterangepicker_report";
            else
                class_date = "datepicker_report";
            html = "<input type='text' class='form-control " + class_date + "' name='conditional_values_" + curr_id + "[]' value='' placeholder='Value'>";

        }
    }
    // finally show the field in DOM
    $(elem).parent("div").parent('.row').find("[name*='conditional_values_']").parent("div").html(html);

    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});

    if (type == "date") {
        LoadReportDatepicker();
        LoadReportDateRangepicker();
    }
}

function LoadDateRangePicker(elem, filter_type) {

    // filter_type='' or filter_type=="form_"

    curr_id = $(elem).parents(".loop_criteria").find("[id*='" + filter_type + "hidden_loop_id_']").attr("id").match(/\d+/)[0];
    var operator_sel = elem.value;
    var field_sel = $(elem).parent("div").parent('.row').find("[name*='" + filter_type + "machine_keys_']").val();
    if (field_sel != "") {
        var arr = field_sel.split("||");
        type = "";
        if (arr.length > 2) {
            var type = arr[1];
            if (type == "date") {
                if (operator_sel == "between" || operator_sel == "not_between")
                    class_date = "daterangepicker_report";
                else
                    class_date = "datepicker_report";

                html = "<input type='text' class='form-control " + class_date + "' name='" + filter_type + "conditional_values_" + curr_id + "[]' value='' placeholder='Value'>";
                $(elem).parent("div").parent('.row').find("[name*='" + filter_type + "conditional_values_']").parent("div").html(html);
                LoadReportDatepicker();
                LoadReportDateRangepicker();
            }
        }
        //console.log(field_sel);

    }
}

function LoadReportDateRangepicker(opens, drops) {
    //define calender open position
    if(typeof opens == 'undefined') {
        opens = 'left';
    }
    //define calender drop position
    if(typeof drops == 'undefined') {
        drops = 'down';
    }
    $('.daterangepicker_report').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY',
            separator: ', ',
        },
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: opens,
        drops: drops,
    }, function (start, end, label) {
        //console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
    });

    $('.daterangepicker_report').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
    });

    $('.daterangepicker_report').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });

    $('.daterangepicker_report_left_up').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY',
            separator: ', ',
        },
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'left',
        drops: 'up',
    }, function (start, end, label) {
        //console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
    });

        $('.daterangepicker_report_left_up').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
    });

    $('.daterangepicker_report_left_up').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });


    // position right

    $('.daterangepicker_report_right').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY',
            separator: ', ',
        },
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'right'
    }, function (start, end, label) {
        //console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
    });

    $('.daterangepicker_report_right').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
    });

    $('.daterangepicker_report_right').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });

    // daterange picker center
    $('.daterangepicker_report_center').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY',
            separator: ', ',
        },
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'center'
    }, function (start, end, label) {
        //console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
    });

    $('.daterangepicker_report_center').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
    });

    $('.daterangepicker_report_center').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });

}

function LoadReportDatepicker(customDateFormats) {

    if(typeof customDateFormats != 'undefined' && customDateFormats.length > 0){
        $.each(customDateFormats, function(k, v){
            if(v.dateFormat =="MM/YYYY"){
                $('.'+v.class).datepicker({startView : 'month', format : 'mm/yyyy', minViewMode: "months"});
            }else if(v.dateFormat =="YYYY"){
                $('.'+v.class).datepicker({startView : 'year', format : 'yyyy', minViewMode: "years"});
            }
        });
    }else{

        $('.datepicker_report').datepicker({startView: 'month', format: 'dd/mm/yyyy', enableYearToMonth: true, enableMonthToDay: true});
    }

}

function LoadDateTimepicker() {
    $('.datetimepicker_report').datetimepicker({
        /*"startDate": "",
         "endDate": "",*/
        format: 'DD/MM/YYYY hh:mm A',
    });
    //$('.datetimepicker_report').datetimepicker({format: 'DD/MM/YYYY HH:mm',viewMode: 'years'});
}

function floatifyLoadDateTimepicker() {
    $('.floatifyDTP').datetimepicker({
		format: 'DD/MM/YYYY HH:mm',
		viewMode: 'years',
		widgetPositioning: {
			horizontal: "auto",
			vertical: "top"
		},
	}).on('dp.hide', function(){
		var floatifyPlaceHolder = $(this).attr('placeholder');
		if(this.value!=''){
			$(this).parent().addClass('floatify__active');
			$(this).attr('placeholder', '');
		}else{
			$(this).parent().removeClass('floatify__active');
			$(this).attr('placeholder', floatifyPlaceHolder);
		}
	});

	$('.iconDate').click(function(){
		$(this).siblings('.floatifyDTP').focus();
	})
}

function floatifyLoadDateTimepickerBottom() {
    $('.floatifyDTP').datetimepicker({
		format: 'DD/MM/YYYY HH:mm',
		viewMode: 'years',
		widgetPositioning: {
			horizontal: "auto",
			vertical: "bottom"
		},
	}).on('dp.hide', function(){
		var floatifyPlaceHolder = $(this).attr('placeholder');
		if(this.value!=''){
			$(this).parent().addClass('floatify__active');
			$(this).attr('placeholder', '');
		}else{
			$(this).parent().removeClass('floatify__active');
			$(this).attr('placeholder', floatifyPlaceHolder);
		}
	});

	$('.iconDate').click(function(){
		$(this).siblings('.floatifyDTP').focus();
	})
}


function LoadReportsColumnsFormFields(form_id, load_html_id, form_title) {

    $('.select_list_fields select').attr({'class': 'animated fadeOutUp'});
    $('#' + load_html_id).html("<div class='select_loading loadingspinner'><i class='fa fa-spinner'></i></div>");

    $.ajax({
        url: jsVars.FULL_URL + '/reports/getFormFieldsByFormIdForReports',
        type: 'post',
        dataType: 'json',
        data: {
            "form_id": form_id,
            'page_section': 'columns'
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {

            if (typeof data != 'undefined' && data.length > 0) {
                var form_field_select = $('<select />').attr({
                    'multiple': 'multiple',
                    'size': 7,
                    'class': 'animated fadeInUp moveableOne',
                    'data-formname': form_title
                });
                var mk_options = [];
                jQuery('#machine_key option').each(function () {
                    var mk_opt_array = this.value.split('$$$');

                    if (mk_opt_array[0] != '') {
                        mk_options.push(mk_opt_array[0]);
                    }
                });

                for (var dt in data) {

                    //console.log(data.length);
//                        console.log(data[dt]);
                    var label_array = data[dt].split('$$$');
                    var label_name = label_array[1];

                    var fields_array = label_array[0].split('||');
                    var field_id = fields_array[0];

                    var option = form_id + '|' + field_id + '$$$' + label_name;
                    //var check_mk = field_id+'$$$'+label_name;

                    if (mk_options.indexOf(field_id) < 0) {
                        form_field_select.append($("<option>").attr({'value': option}).text(label_name));
                    }
                }
                $('.select_list_fields').html('');
                $('#' + load_html_id).html(form_field_select);

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function addReportColumnFormFieldsTo() {

    if ($(".moveableOne option:selected").length > 0) {

        //var selected_opt = jQuery('#oneselect').find(':selected');
        $(".moveableOne option:selected").map(function () {

            var already_insert = false;
            var value = jQuery(this).text();
            var key = jQuery(this).val();
            var form_name = $(this).parent('select').data('formname');

            $('#final_columns option').map(function () {

                if (this.value == key) {
                    var alrady_text = jQuery(this).text();
                    alertPopup("field '" + alrady_text + "' already inserted", 'error');
                    already_insert = true;
                }

            });
            if (already_insert == false) {
                if (key != '') {
                    $('#final_columns')
                            .append($("<option></option>")
                                    .attr("value", key)
                                    .text(value + ' (' + form_name + ')'));
                }
            }
//            $(this).remove();
            this.selected = false;

        });
    } else {
        alert("Please select option");
    }
}

function removeReportColumnFormFieldsTo() {

    if ($("#final_columns option:selected").length > 0) {
        //var selected_opt = jQuery('#oneselect').find(':selected');
        $("#final_columns option:selected").map(function () {

            $(this).remove();
        });
    } else {
        alert("Please select option");
    }
}

function moveReportColumnFormFields(elem) {

    var $op = $('#final_columns option:selected');
    if ($op.length) {
        (elem == 'up') ?
                $op.first().prev().before($op) :
                $op.last().next().after($op);
    }
}

function finalColumnsSubmit() {

    $('#final_columns option').map(function () {
        this.selected = true;
    });

    return true;
}

function LoadReportFields(elem) {
    form_id = elem.value;
    curr_id = $(elem).parents(".loop_criteria").find("[id*='form_hidden_loop_id_']").attr("id").match(/\d+/)[0];

    $.ajax({
        url: jsVars.FULL_URL + '/reports/getFormFieldsByFormIdForReports',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "form_id": form_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            var html = "<select name='form_machine_keys_" + curr_id + "[]' class='chosen-select' onChange='javascript:renderFormFields(this)'>";
            html += "<option value=''>Select Column</option>";
            res_data = JSON.parse(data);
            if (res_data.length > 0) {

                for (i = 0; i < res_data.length; i++) {
                    curr_data = res_data[i];
                    if (curr_data != "") {
                        f_arr = curr_data.split("$$$");
                        html += "<option value='" + f_arr[0] + "'>" + f_arr[1] + "</option>";
                    }
                }

            }
            html += "</select>";
            $(".form_machine_keys_" + curr_id).html(html);
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            //console.log(html);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function renderFormFields(elem) {
    //console.log($(elem).parents( ".loop_criteria" ).find("[id*='loop_']").attr("id"));
    curr_id = $(elem).parents(".loop_criteria").find("[id*='form_hidden_loop_id_']").attr("id").match(/\d+/)[0];
    //console.log(id);
    html = "<input type='text' class='form-control' name='form_conditional_values_" + curr_id + "[]' value='' placeholder='Value'>";

    value_field = elem.value;
    var arr = value_field.split("||");
    type = "";
    if (arr.length > 2) {
        var type = arr[1];
        var val_json = arr[2];
        //console.log(arr);
        if (type == "dropdown") {
            html = "<select class='chosen-select' name='form_conditional_values_" + curr_id + "[]'>";
            obj_json = JSON.parse(val_json);
            for (var key in obj_json) {
                html += "<option value='" + obj_json[key] + "'>" + obj_json[key] + "</option>";
            }
            html += "</select>";
        } else if (type == "date") {
            var operator_sel = $(elem).parent("div").parent('.row').find("[name*='form_conditional_operators_']").val();
            if (operator_sel == "between" || operator_sel == "not_between")
                class_date = "daterangepicker_report";
            else
                class_date = "datepicker_report";

            html = "<input type='text' class='form-control " + class_date + "' name='form_conditional_values_" + curr_id + "[]' value='' placeholder='Value'>";

        }
    }
    // finally show the field in DOM
    $(elem).parent("div").parent('.row').find("[name*='form_conditional_values_']").parent("div").html(html);

    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});

    if (type == "date") {
        LoadReportDatepicker();
        LoadReportDateRangepicker();
    }
}

function LoadHideShowForms(val) {
    var html = "<select name='order_columns[]' class='chosen-select'>";
    html += "<option value=''>Select Column</option>";
    if (val == "form_wise") {
        $('.hide_show_forms').fadeIn();
    } else {
        $('.hide_show_forms').hide();

        res_data = JSON.parse(jsVars.selected_fields);
//                    console.log(res_data);
        for (i = 0; i < res_data.length; i++) {
            curr_data = res_data[i];
            if (curr_data["form_id"] == "0") {
                html += "<option value='" + curr_data["field_id"] + "'>" + curr_data["field_label"] + "</option>";
            }
        }
        jQuery('[name="order_form_id[]"]').val('');
        $('[name="order_form_id[]"]').trigger("chosen:updated");

    }
    html += "</select>";
    $(".column_name_select").html(html);
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
}

function LoadOrderFields(elem) {
    form_id = elem.value;
    $.ajax({
        url: jsVars.FULL_URL + '/reports/getFormFieldsByFormIdForReports',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "form_id": form_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            var html = "<select name='order_columns[]' class='chosen-select'>";
            html += "<option value=''>Select Column</option>";
            res_data = JSON.parse(data);
            if (res_data.length > 0) {

                for (i = 0; i < res_data.length; i++) {
                    curr_data = res_data[i];
                    if (curr_data != "") {
                        f_arr = curr_data.split("$$$");
                        //console.log(curr_data);
                        html += "<option value='" + f_arr[0] + "'>" + f_arr[1] + "</option>";
                    }
                }

            }
            html += "</select>";

            $(elem).parents(".ordering_child_loop").find(".column_name_select").html(html);
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            //console.log(html);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function AddOrderChildLoop(id) {
    var div = $("div.ordering_child_loop:first");
    var cloned = div.clone();

    $(cloned).find('.chosen-container').remove(); //  remove chosen dropdown hidden div

    $('div#order_loop').append(cloned);

    $(cloned).hide(); // this is for effect.
    $(cloned).fadeIn('slow'); // this is for effect.

    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});

    return false;
}

function RemoveOrderChildLoop(elem) {
    $(elem).parent("div").parent(".row").fadeOut("fast", function () {
        $(elem).parent("div").parent(".row").remove();
    });
    //
    return false;
}

/*function HideFirstDeleteButton(id){
 $('div#loop_'+id).each(function( index ) {
 console.log( index + ": " + $( this ).text() );
 });

 }*/

// Schedular Code starts
$(document).ready(function () {
    if ($('#scheduleStartDate').length > 0) {
        //$('#applicationDeadLineSelector').datepicker({startView: 'month', format: 'dd/mm/yyyy', enableYearToMonth: true, enableMonthToDay: true, pickTime: false});
        $('#scheduleStartDate').datepicker({startView: 'month', format: 'd M yyyy', enableYearToMonth: true, enableMonthToDay: true});
    }

    if ($('#scheduleEndDate').length > 0) {
        //$('#applicationDeadLineSelector').datepicker({startView: 'month', format: 'dd/mm/yyyy', enableYearToMonth: true, enableMonthToDay: true, pickTime: false});
        $('#scheduleEndDate').datepicker({startView: 'month', format: 'd M yyyy', enableYearToMonth: true, enableMonthToDay: true});
    }

    if (('#reportScheduleCollegeId').length > 0) {
        $("#reportScheduleCollegeId").change(function () {
            var collegeId = $(this).val();
            if (collegeId != '') {
                loadCollegeReports(collegeId, jsVars.logged_in_User_id, jsVars.logged_in_User_groupid, 'reportContainer');
            }
        });
    }

    if (('#filterReportScheduleCollege').length > 0) {
        $("#filterReportScheduleCollege").change(function () {
            var collegeId = $(this).val();
            if (collegeId != '') {
                loadCollegeReports(collegeId, jsVars.logged_in_User_id, jsVars.logged_in_User_groupid, 'reportFilterContainer');
            }
        });
    }


});

function loadCollegeReports(collegeId, loggedInUserId, loggedInUserGroup, container) {
    $.ajax({
        url: jsVars.FULL_URL + '/reports/getCollegeDependentReports',
        data: {college_id: collegeId, logged_in_user_id: loggedInUserId, logged_in_user_group: loggedInUserGroup},
        dataType: "json",
        async: false,
        cache: false,
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        //contentType: "application/json; charset=utf-8",
        success: function (json) {
            if (json['status'] == 1) {
                optionStr = '<select id="reportId" class="chosen-select" name="report_id" style="display: none;"><option selected="selected" value="">--Select Report--</option>';
                $.each(json['data'], function (index, value) {
                    if (index != '') {
                        optionStr += '<option value="' + index + '">' + value + '</option>';
                    }
                });
                optionStr += '</select>';
                $('#' + container).html(optionStr);
                $('.chosen-select').chosen();
            } else {
                alert('We got some error, please try again later.')
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

var pageNo = 0; //jsVars.pageNo;
function LoadMoreReportSchedule() {
    var data = $('#FilterReportScheduleForm').serializeArray();
    $('#schedule_load_more_button').attr("disabled", "disabled");
    $('#schedule_load_more_button').html("Loading...");

    $.ajax({
        url: jsVars.FULL_URL + '/reports/reportScheduleRows',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            data: data,
            page: pageNo
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            pageNo = pageNo + 1;
            if (data == "error") {
                $('#load_more_results').append(" <tr><td colspan='7'><div class='text-center text-danger fw-500'>No More Records</div></td></tr>");
                $('#schedule_load_more_button').hide();
            } else {
                $('#load_more_results').append(data);
                $('#schedule_load_more_button').removeAttr("disabled");
                $('#schedule_load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load Report Schedule');
				dropdownMenuPlacement();
            }
            //console.log(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

if (('#reportSendNowLink').length > 0) {
    $(document).on('click', '#reportSendNowLink', function (e) {

        var sendNowHash = $(this).prop('rel');
        cronSendReport(sendNowHash);
    });
}

function cronSendReport(sendNowHash) {

    $.ajax({
        url: jsVars.FULL_URL + '/cron/send-report',
        data: {send_now_hash: sendNowHash},
        dataType: "json",
        async: false,
        cache: false,
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('body div.loader-block').show();
            $('#reportSendNowLink').attr("disabled", "disabled");
            $('#reportSendNowLink').html("Please Wait...");
        },
        complete: function () {
            $('body div.loader-block').hide();
            $('#reportSendNowLink').removeAttr("disabled");
            $('#reportSendNowLink').html("Send Now");
        },
        success: function (json) {
            if (json['status'] == 1) {
                $('#SuccessPopupArea p#MsgBody').html('Report Schedule has been executed.')
                $("#SuccessPopupArea").modal();
            } else {
                alert('We got some error, please try again later.')
            }

        },
        error: function (response) {
            alertPopup(response.responseText);
        },
        failure: function (response) {
            alertPopup(response.responseText);
        }
    });

    return false;
}

if (('#reportScheduleDelete').length > 0) {
    $(document).on('click', '#reportScheduleDelete', function (e) {
        e.preventDefault();
        var MainParentTr = $(this).parents("tr");
        var scheduleId = $(MainParentTr).prop('id');
        if (scheduleId > 0)
        {
            $("#ConfirmPopupArea p#ConfirmMsgBody").text('Are you sure? You want to delete Schedule.');
            $('#ChangeStatusSuccessArea p#ConfirmDisableEnableFormPopUpTextArea').text('Schedule has been deleted.');
            $("#ConfirmPopupArea a#confirmYes").attr("onclick", 'reportScheduleDelete(' + scheduleId + '\);');
        } else
        {
            alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
        }
    });
}

if (('#reportScheduleEmailUserList').length > 0) {
    $(document).on('click', '#reportScheduleEmailUserList', function (e) {
        e.preventDefault();
        var MainParentTr = $(this).parents("tr");
        var scheduleId = $(MainParentTr).prop('id');

        if ($('#toList' + scheduleId).html() != '') {
            var toList = $('#toList' + scheduleId).html().split(",");
        } else {
            var toList = false;
        }

        if ($('#bccList' + scheduleId).html() != '') {
            var bccList = $('#bccList' + scheduleId).html().split(",");
        } else {
            var bccList = false;
        }
        // To List
        html = '<div><h4>To List:</h4>';
        html += '<ul>';

        if (toList == false) {
            html += '<li>No Records Found.</li>';
        } else {
            $.each(toList, function (i) {
                if (toList[i] != '') {
                    html += '<li>' + toList[i] + '</li>';
                }
            });
        }
        html += '</ul>';
        html += '</div>';

        // Bcc List
        html += '<div><h4>Bcc List:</h4>';
        html += '<ul>';

        if (bccList == false) {
            html += '<li>No Records Found.</li>';
        } else {
            $.each(bccList, function (i) {
                if (bccList[i] != '') {
                    html += '<li>' + bccList[i] + '</li>';
                }
            });
        }
        html += '</ul>';
        html += '</div>';
        $('#SuccessPopupArea .modal-body').removeClass('text-center');
        $('#SuccessPopupArea h2#alertTitle').html('User Email List');
        $('#SuccessPopupArea p#MsgBody').html(html);
        $('#SuccessPopupArea span.oktick').hide();

    });
}

function reportScheduleDelete(scheduleId) {
    $('body div.loader-block').show();
    $("#ConfirmPopupArea").modal('hide');
    $.ajax({
        url: jsVars.FULL_URL + '/reports/reportScheduleDelete',
        data: {schedule_id: scheduleId},
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
            if (json['status'] == 1) {
                $('#SuccessPopupArea p#MsgBody').html('Report Schedule has been deleted.')
                $('#SuccessPopupArea a#OkBtn').show();

                $("#SuccessPopupArea a#OkBtn").bind("click", function () {
                    $('#FilterReportScheduleForm').submit();
                });
//                $('#SuccessPopupArea a#OkBtn').attr('href', '/colleges/manage-payment-configuration');
                $("#SuccessPopupArea").modal();
            } else {
                alert('We got some error, please try again later.')
            }

        },
        error: function (response) {
            alertPopup(response.responseText);
        },
        failure: function (response) {
            alertPopup(response.responseText);
        }
    });

    return false;
}
// Schedular Code ends
/*******************End of Reports Controller***********************************/

function LoadMoreReports() {

    var data = $('#FilterReportsForm').serializeArray();
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $.ajax({
        url: jsVars.FULL_URL + '/reports/ajax-reports-list',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "data": data,
            "page": Page
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            Page = Page + 1;
            if (data == "error") {
                $('#load_more_results').append("<tr><td colspan='6'><div class='text-danger text-center fw-500'>No More Records</div></td></tr>");
                $('#load_more_button').hide();
            } else {
                data = data.replace("<head/>", '');
                $('#load_more_results').append(data);
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More Data');
				dropdownMenuPlacement();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function LoadCollegeDocumentListing() {

    var data = $('#FilterCollegeDocumentForm').serializeArray();
    data.push({name: "page", value: Page});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;&nbsp;Loading...');
    $.ajax({
        url: jsVars.loadFileListing,
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            data = data.replace("<head/>", '');
            Page = Page + 1;
            if (data == "error") {
                $('#load_more_results').append(" <tr><td colspan='8'><div class='alert alert-danger'>No More Records</div></td></tr>");
                $('#load_more_button').hide();
            } else {
                $('#load_more_results').append(data);
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Load More Record');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
//Code for College Payment Configuration ends

function LoadMoreRunReport() {

    var data = $('#RunReportForm').serializeArray();
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $.ajax({
        url: jsVars.FULL_URL + '/reports/ajax-run-report-query',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "data": data,
            "page": Page
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            data = data.replace("<head/>", '');
            Page = Page + 1;
            if (data == "error") {
                $('#load_more_results').append(" <tr><td colspan='8'><div class='alert alert-danger'>No More Records</div></td></tr>");
                $('#load_more_button').hide();
            } else {
                $('#load_more_results').append(data);
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html("Next Page");
            }

            //console.log(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function ShowUploadsError(err,id){
    if(typeof id == 'undefined'){
        id = 'error_help_upload';
    }
    if(typeof err != 'undefined' && err !=''){
        jQuery('#'+id).show();
        jQuery('#'+id).html(err);
    }
}

function ShowUploadsFileId(fileid) {

    jQuery('#error_help_upload').hide();
    if (typeof fileid != 'undefined' && fileid != '') {
        var comma = '';
        var fileIds = jQuery('#fileidsinput').val();
        if (fileIds != '') {
            comma = ',';
        }
        var final_val = fileid.concat(comma + fileIds);
        jQuery('#fileidsinput').val(final_val);
        jQuery('.input_file').val('');
    }
}

/*$(".filterscrollbar").click(function(){
 $(".btn-group").addClass("open");
 });*/

$('.leads-filter .dropdown-menu').on('click', function (event) {
    event.stopPropagation();
});



function initCKEditorForAdmin() {
    CKEDITOR.replace('editor', {
        on: {
            instanceReady: function (evt) {
                $('div.loader-block').hide();
//                    alert('dddrr');
            }
        }
    });
}

function LoadMorePermission() {
    var data = $('#FilterLeadForm').serializeArray();
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $.ajax({
        url: jsVars.FULL_URL + '/permissions/ajax-permission-list',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "data": data,
            "page": Page
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            data = data.replace("<head/>", '');
            Page = Page + 1;
            if (data == "error") {
                $('#load_more_results').append("<div class='alert alert-danger'>No More Records</div>");
                $('#load_more_button').hide();
            } else {
                $('#load_more_results').append(data);
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html("Next Page");
//                $.material.init();
            }
            //console.log(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/****For display college listing***/
function LoadCollegeDataNew(type) {

    var data = [];
    if (type == 'reset') {
        ColPage = 0;
        $('#load_more_results_college').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
    }
    data = $('#FilterInstituteForm').serializeArray();
    data.push({name: "page", value: ColPage});
    data.push({name: "type", value: type});

    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");

    $.ajax({
        url: jsVars.FULL_URL + '/colleges/ajax-lists',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            ColPage = ColPage + 1;
            if (data == "session_logout") {
                window.location.reload(true);
            } else if (data == "norecord") {
                if (ColPage == 1)
                    error_html = "No Records found";
                else
                    error_html = "No More Record";
                $('#load_more_results_college').append("<div class='alert alert-danger'>" + error_html + "</div>");
                $('#load_more_button').html("Load More Record");
                $('#load_more_button').hide();
//                  if (type != '' && Page==1) {
//                        $('#if_record_exists').hide();
//                  }
            } else {
                data = data.replace("<head/>", '');
                $('#load_more_results_college').append(data);
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html("Load More Record");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
/**
 *
 * @param {type} type
 * @return {html}
 */
/******get purgedata********/
function LoadMorePurgeData(type) {

    if (type == 'reset') {
        Page = 0;
        $('#load_more_results').html("");
        $('#load_more_results_msg').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
    }

    var data = $('#FilterPurgedData').serializeArray();
    data.push({name: "page", value: Page});

    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");

    $.ajax({
        url: jsVars.FULL_URL + '/colleges/ajax-list-purge-data',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () {
            $('#search_btn').addClass('pointer-none');
            $('#search_btn').prop('disabled', true);
         },
        success: function (data) {
            Page = Page + 1;
            $('.offCanvasModal').modal('hide');
            if (data == "session_logout") {
                window.location.reload(true);
            } else if (data == "error") {
                $('.expandableSearch').hide();
                if (Page == 1){
                    $('#tot_records').html('');
                    $('#tot_records').removeClass('margin-bottom-15 margin-top-15');
                    $('.newTableStyle.table-responsive').removeClass('newTableStyle');
                    error_html = "No Records found";
                    $('#load_more_results_msg').append("<div class='no-record-list'><div class='noDataFoundDiv'><div class='innerHtml'><img src='/img/no-record.png' alt='no-record'><span>" + error_html +"</span></div></div></div>");
                }else{
                    error_html = "No More Record";
                    // $('#tot_records').html('');
                    $('#load_more_results_msg').append("<h5 class='text-danger text-center'>" + error_html +"</h5>");
                }
                $('#load_more_button').html("Load More Leads");
                $('#load_more_button').hide();
                $('.expandableSearch').hide();
//                if (type != '' && Page == 1) {
//                    $('#if_record_exists').hide();
//                }
         } else if (data == "select_college") {
                $('#load_more_results_msg').html("<div class='aligner-middle'><div class='text-center text-info font16'><span class='lineicon-43 alignerIcon'></span><br><span id='load_msg'>Please select a college to view purged data.</span></div></div>");
                $('#load_more_button').hide();
                $('#load_more_button').html("Load More Record");
                $('.expandableSearch').hide();
//                if (type != '') {
//                    $('#if_record_exists').hide();
//                }
            } else {
                data = data.replace("<head/>", '');
//                    console.log(data);
                $('#load_more_results').append(data);
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html("Load More Record");
                $('.expandableSearch').show();
                $('.table-responsive').addClass('newTableStyle');
                $('#tot_records').addClass('margin-bottom-15 margin-top-15');
//                if (type != '') {
//                    $('#if_record_exists').fadeIn();
//                }
                //$.material.init();
                //table_fix_rowcol();
            }

            //$("#load_more_results").tableHeadFixer({"left": 1});
            $('#search_btn').prop('disabled', false);
            $('#search_btn').removeClass('pointer-none');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

/**
 *
 * @param {type} value
 * @param {type} default_val
 * @return {html}
 */
function LoadFormshere(value, default_val){
    //getForms
    $.ajax({
        url: jsVars.FULL_URL + '/colleges/get-all-forms',
        type: 'post',
        dataType: 'html',
        data: {
            "college_id": value,
            "default_val": default_val
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if (data == "session_logout") {
                window.location.reload(true);
            }
            $('#div_load_forms').html(data);
            //$('.div_load_forms').html(data);
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
 *
 * @param {type} cid
 * @return {html}
 */
function showAllPurgeData(cid, timestamp) {
    //$("#ChangeStatusBtn").trigger('click');
    var data = $('#FilterPurgedData').serializeArray();
    data.push({name: "college_id", value: cid});
    data.push({name: "datetime", value: timestamp});
    $.ajax({
        url: jsVars.FULL_URL + '/colleges/get-purg-data-popup',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: data,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (data) {
            $('#mainData').html(data);
            $("#ChangeStatusBtn").trigger('click');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


/*Check Email Validation*/
function isValidEmailDNS(value){
    if($.trim(value)!='') {
        $('#Email').next('span.help-block').html('');
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
                    $('#Email').next('span.help-block').show();
                    $('#Email').next('span.help-block').html(data['message']).css({'color':'#a94442', 'display':'block'});
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

// dropdownMenuPlacement with body
function dropdownMenuPlacement(){
	// hold onto the drop down menu
    var dropdownMenu;
    // and when you show it, move it to the body
    $('.ellipsis-left').on('show.bs.dropdown', function (e) {

                        // grab the menu
                        dropdownMenu = $(e.target).find('.dropdown-menu');
                        dropHeight = dropdownMenu.outerHeight() - 50;

                        // detach it and append it to the body
                        $('body').append(dropdownMenu.detach());

                        // grab the new offset position
                        var eOffset = $(e.target).offset();
						var offsetDropPos = eOffset.top - dropHeight;
                        // make sure to place it where it would normally go (this could be improved)
                        dropdownMenu.css({
                                'display': 'block',
                                //'top': eOffset.top + $(e.target).outerHeight(),
                                'top': (offsetDropPos < 0) ? 0 : offsetDropPos,
                                'left': eOffset.left - 135
                        });
    });
    // and when you hide it, reattach the drop down, and hide it normally
        $('.ellipsis-left').on('hide.bs.dropdown', function (e) {
            $(e.target).append(dropdownMenu.detach());
                dropdownMenu.hide();
        });
}


// determineDropDirection
function determineDropDirection(){
  $(".ellipsis-left .dropdown-menu").each( function(){
    // Invisibly expand the dropdown menu so its true height can be calculated
    $(this).css({
      visibility: "hidden",
      display: "block"
    });

    // Necessary to remove class each time so we don't unwantedly use dropup's offset top
    $(this).parent().removeClass("dropup");

    // Determine whether bottom of menu will be below window at current scroll position
    if ($(this).offset().top + $(this).outerHeight() > $(window).innerHeight() + $(window).scrollTop()){
      $(this).parent().addClass("dropup");
    }

    // Return dropdown menu to fully hidden state
    $(this).removeAttr("style");
  });
}

/**
 * - return college registration tokesns by college id
 * @param {type} CollegeId
 * @return {undefined}
 */
function fetchCollegeRegistrationListTokens(CollegeId){
    if (CollegeId && typeof jsVars.getCollegeRegFieldKeys != 'undefined' && jsVars.getCollegeRegFieldKeys != '') {
        $.ajax({
            url: jsVars.getCollegeRegFieldKeys,
            type: 'post',
            data: {CollegeId: CollegeId},
            dataType: 'text',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json)
            {
                if(json != 'error'){
                    $('small#reg-key-container').html(json);
                }

            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
}

function collegeDashboardGraphLoadStateList(chartType, chartSubtype,stateName) {
    var data = $("form#collegeDashboardForm").serialize();
    $('#stateListDiv').html('');
    $('#stateListDiv').multiselect('rebuild');

    $.ajax({
        url: jsVars.FULL_URL + '/colleges/get-dashboard-state-list',
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#graphStatsLoaderConrainerState').show();
        },
        complete: function () {
            $('#graphStatsLoaderConrainerState').hide();
        },
        success: function (json) {
            if (json['status'] == 200) {
                $('#stateListDiv').html(json['stateList']);


                $('#stateListDiv')[0].sumo.reload();

                $('.btnOk').trigger('click');

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/**copy code ***/

function selectText(id){
    var sel, range;
    var el = document.getElementById(id); //get element id
    if (window.getSelection && document.createRange) { //Browser compatibility
      sel = window.getSelection();
      if(sel.toString() == ''){ //no text selection
         window.setTimeout(function(){
            range = document.createRange(); //range object
            range.selectNodeContents(el); //sets Range
            sel.removeAllRanges(); //remove all ranges from selection
            sel.addRange(range);//add Range to a Selection.
        },1);
      }
    }else if (document.selection) { //older ie
        sel = document.selection.createRange();
        if(sel.text == ''){ //no text selection
            range = document.body.createTextRange();//Creates TextRange object
            range.moveToElementText(el);//sets Range
            range.select(); //make selection.
        }
    }
}

function copyToClipboard(element) {

	selectText(element);
	  var $temp = $("<input>");
          //alert('hello');
	  $("body").append($temp);
	  $temp.val($('#'+element).text()).select();
	  document.execCommand("copy");
	  $temp.remove();
}

 $(document).ready(function(){
     if ($('#state_advance').length > 0) {
         $('#stateVsApplicationAnchor_container').hide();
        $('#state_advance').SumoSelect({placeholder: 'Select Advance Filter', search: true, searchText:'Search Advance Filter', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
    }
 });

 function getLineOrPieChartGraph(){
    if(typeof $('#applicant-state-type select') != 'undefined'){
        var applicantStateType = $('#applicant-state-type select').val();
    } else {
        var applicantStateType = 'registration';
    }
    if(typeof $('#applicant-graph-type li a.active').attr('id') != 'undefined'){
        var applicantGraphType = $('#applicant-graph-type li a.active').attr('id');
    } else {
        var applicantGraphType = 'line';
    }


    if(applicantGraphType == 'line'){
        $('#applicant-view-type, .state_advance-container').show();
        if(typeof $('#applicant-view-type li a.active').attr('id') != 'undefined'){
            var applicantViewType = $('#applicant-view-type li a.active').attr('id');
        } else {
            var applicantViewType = 'day';
        }
        var graphContainerId = applicantStateType + '-' + applicantGraphType + '-' +applicantViewType + '-' + 'chart';
    } else {
        $('#applicant-view-type, .state_advance-container').hide();
        var applicantViewType = false;
        var graphContainerId = applicantStateType + '-' + applicantGraphType + '-' + 'chart';
    }

    $('.graph-container-div').hide();
    $('#' + graphContainerId).show();
    var returnParam = {applicantStateType: applicantStateType, applicantGraphType: applicantGraphType, applicantViewType: applicantViewType,  graphContainerId: graphContainerId};
    displayGraphStateVsApplicant(returnParam);
    return returnParam;
 }

$(document).on('change', '#applicant-state-type select', function () {
    getLineOrPieChartGraph();
});

$(document).on('click', '#applicant-graph-type li a', function () {
    $('#applicant-graph-type li a').removeClass('active');
    $(this).addClass('active');
    getLineOrPieChartGraph();
});

$(document).on('click', '#applicant-view-type li a', function () {
    $('#applicant-view-type li a').removeClass('active');
    $(this).addClass('active');
    getLineOrPieChartGraph();
});

function displayGraphStateVsApplicant(param){
    var data = $("form#collegeDashboardForm").serializeArray();
    for (var key in param) {
        if (param.hasOwnProperty(key)) {
            data.push({name:key, value:param[key]});
        }
    }
    $.ajax({
        url: jsVars.FULL_URL + '/colleges/stateVsApplicationGraph',
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#graphStatsLoaderConrainer_sec').show();
        },
        complete: function () {
            $('#graphStatsLoaderConrainer_sec').hide();
        },
        success: function (json) {
            var lineContainerId = json['lineContainerId'];
            if (json['status'] == 1) {
                if(json['applicantGraphType'] == 'line') {
                    google.charts.setOnLoadCallback(function () {
                        stateVsApplicationGraphChart(json,lineContainerId);
                    });
                } else {
                    google.charts.setOnLoadCallback(function () {
                        stateVsApplicationPieGraphChart(json,lineContainerId);
                    });
                }
            } else {
                $('#'+lineContainerId).html('<img src="/img/line_no_data_image.jpg" style="display:inline-block">');
				$('#'+lineContainerId).parent().addClass('text-center');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function stateVsApplicationGraphChart(json,containerID){
        var data = new google.visualization.DataTable();
        data.addColumn('date', 'Date');
        $.each(json['column'], function (index, value) {
            $('select#state_advance')[0].sumo.selectItem(index);
            data.addColumn('number', value);
        });
        if($('select#state_advance').val() == null){
            $('select#state_advance')[0].sumo.reload();
        }
        var rowsDate = [];
        $.each(json['graphData'], function (index, value) {
            var innerRowsDate = [];
            innerRowsDate.push(new Date(parseInt(index*1000)));
            $.each(value, function (n_ind, n_val){
                innerRowsDate.push(parseInt(n_val.count));
            });
            rowsDate.push(innerRowsDate);
        });
        data.addRows(rowsDate);

        var options = {
          hAxis: {
            title: json.hAxisTitle
          },
          vAxis: {
            title: json.vAxisTitle, viewWindow:{min:0}
          },
          pointSize: 2,
		  chartArea: {
				top: 40,
				width: '80%',
			},
          colors: ['#00b0f0', '#ffc000', '#92d050', '#93cddd', '#e46c0a', '#8a56e2', '#e25668', '#e256ae', '#56e2cf', '#e0c933', '#00b0f0', '#ffc000', '#92d050', '#93cddd', '#e46c0a', '#8a56e2', '#e25668', '#e256ae', '#56e2cf', '#e0c933'],
          height: 400
        };

        var chart = new google.visualization.LineChart(document.getElementById(containerID));
        chart.draw(data, options);
}


// college dashboard state application chart data
function stateVsApplicationPieGraphChart(json, containerID){
    var college_id_md = 0;
    if( $("[name='h_college_id']").length > 0 && typeof $("[name='h_college_id']").val() != "undefined" ){
        college_id_md = $("[name='h_college_id']").val();
    }
    google.charts.load('current', {
        callback: function () {
            var type = json['type'];
            // Create the data table.
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Name');
            data.addColumn('number', 'Count');
            data.addRows(json['graphData']);
            // Set chart options
            var options = {
                title: json['title'],
                titleTextStyle: {
                    color: '#333',
                    fontSize: '16'
                },
				chartArea: {
					width: '80%',
				},
                height: 400,
                //width: 500,
                pieHole: 0.5,
                sliceVisibilityThreshold: .000000002,
                colors: ['#00b0f0', '#ffc000', '#92d050', '#93cddd', '#e46c0a', '#8a56e2', '#e25668', '#e256ae', '#56e2cf', '#e0c933'],
                legend: {position: 'right', alignment: 'center'}
            };

            $('#' + containerID).html('<h4 class="text-danger">Data Not Found</h4>');

            // Instantiate and draw our chart, passing in some options.
            if (json['graphData'].length >= 1) {
                var chart = new google.visualization.PieChart(document.getElementById(containerID));
                var selectedval = 0;
                if(type == 'state'){
                    function selectHandler() {
                        var selectedItem = chart.getSelection()[0];
                        if (typeof selectedItem != 'undefined') {
                            var clickingvalue = data.getValue(selectedItem.row, 0);
                        } else {
                            clickingvalue = json['maxStateName'];
                        }
                        json['clickingvalue'] = clickingvalue;
                        json['college_id'] = college_id_md;
                        $.ajax({
                            cache: false,
                            url: jsVars.FULL_URL + '/colleges/getGraphPieChartCityListData',
                            data:json,
                            type: 'post',
                            dataType: 'json',
                            headers: {
                                "X-CSRF-Token": jsVars._csrfToken
                            },
                            success: function (jsonVal) {
                                containerID = jsonVal['lineContainerId'];
                                google.charts.load('current', {
                                    callback: function () {
                                        var type = jsonVal['type'];
                                        // Create the data table.
                                        var data1 = new google.visualization.DataTable();
                                        data1.addColumn('string', 'Name');
                                        data1.addColumn('number', 'Count');
                                        data1.addRows(jsonVal['graphData']);
                                        // Set chart options
                                        var options = {
                                            title: jsonVal['title'],
                                            titleTextStyle: {
                                                color: '#333',
                                                fontSize: '16'
                                            },
											chartArea: {
												width: '80%',
											},
                                            height: 400,
                                            //width: 500,
                                            pieHole: 0.5,
                                            sliceVisibilityThreshold: .000000002,
                                            colors: ['#00b0f0', '#ffc000', '#92d050', '#93cddd', '#e46c0a', '#8a56e2', '#e25668', '#e256ae', '#56e2cf', '#e0c933'],
                                            legend: {position: 'right', alignment: 'center'}
                                        };
                                        $('#' + containerID).html('<h4 class="text-danger">Data Not Found</h4>');
                                        var chart1 = new google.visualization.PieChart(document.getElementById(containerID));
                                        chart1.draw(data1, options);
                                    },
                                    'packages': ['corechart']
                                });
                            },
                            error: function (xhr, ajaxOptions, thrownError) {
                                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                            }
                        });
                    }
                    google.visualization.events.addListener(chart, 'ready', selectHandler);
                    google.visualization.events.addListener(chart, 'select', selectHandler);
                    }
                chart.draw(data, options);
                chart.setSelection([{row: 0}]);
            }
        },
        'packages': ['corechart']
    });
}

$('select#state_advance').on('sumo:closed', function() {
   getLineOrPieChartGraph();
});


function setConfigPushErp(id,name,elem){
    $('#confirmTitle').html("Confirm");
    $('#ConfirmMsgBody').html('Are you sure enable ERP for '+name+'?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        var push_mask_data = $(elem).data('erpcheck');
        if(typeof push_mask_data =='undefined' || push_mask_data == ''){
            push_mask_data = 0;
        }
            $.ajax({
                url: '/form/set-config-push-erp',
                type: 'post',
                dataType: 'json',
                data: {"form_id":id,"push_mask_data":push_mask_data},
                headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                beforeSend: function () {
                    $('.loader-block').show();
                },
                complete: function () {
                    $('.loader-block').hide();
                },
                success: function (json) {

                    $('.loader-block').hide();
                    if (typeof json['error'] != 'undefined' && json['error'] == "session_out") {
                        window.location.href = json['redirect'];
                    }
                    else if (typeof json['error'] != 'undefined' && json['error'] != "") {
                        $('#ConfirmPopupArea').modal('hide');
                        alertPopup(json['error'], 'error');
                    }
                    else if (typeof json['status'] !== 'undefined' && json['status']==200) {
                        $('#ConfirmPopupArea').modal('hide');
                        alertPopup(json['message'], 'success');
                        if(push_mask_data==1){
                            $(elem).data('erpcheck',0);
                            $('.formid'+id+' span').removeClass('graycolor').removeClass('greencolor').addClass('greencolor');
                        }
                        else{
                            $(elem).data('erpcheck',1);
                            $('.formid'+id+' span').removeClass('graycolor').removeClass('greencolor').addClass('graycolor');
                        }
                        //Remove Parent Li

                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    $('#listloader').hide();
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        });
    return false;
}

/************ User Manager code********/
if ($("#FilterUserManager").length > 0 || $("#createUser").length > 0) {
    function displayAssignedLimit(college_id) {
        if($('#college_role_invited').length && $('#invite_institute').length){
            var data = [];
            data.push({name:'role_selected',value:$('#college_role_invited').val()});
            data.push({name:'select_institute',value:$('#invite_institute').val()});
        }else{
            var data = $('#createUser').serializeArray();
            if(data.length==0){
                data.push({name:'CreatePage',value:true});
                data.push({name:'college_id',value:college_id});
            }
        }
        $.ajax({
            url: '/users/getAccountManager',
            type: 'post',
            dataType: 'html',
            data: data,
            beforeSend: function () {
                $('#listloader').show();
            },
            complete: function () {
                $('#listloader').hide();
                $('#SuccessPopupArea').addClass('animated modalCustom')
            },
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (html) {
                alertPopupUserLimit(html, 'success');
                $('#alertTitle').html('User Limit Exceeded');
                                    $('#SuccessPopupArea').removeClass('fadeOutUp').addClass('fadeInDown offCanvasModal')
                                    $('#SuccessPopupArea').on('hide.bs.modal', function (e) {
                                      $(this).removeClass('fadeInDown').addClass('fadeOutUp')
                                    })

            },
            error: function (xhr, ajaxOptions, thrownError) {
                //window.location.reload(true);
            }
        });

    }

    function SendEmail(cid) {
        var count = $("#countForAccountManager").val();
        if (typeof cid == 'undefined') {
            return false;
        }
        if (count == '') {
            //return error message
            $("#showErrorCount").html("Let us know your User Requirement.");
            return false;
        }

        $.ajax({
            url: '/users/sendToAccountManager',
            type: 'post',
            dataType: 'json',
            data: {'unique_id': cid, 'count': count},
            beforeSend: function () {
                $('#listloader').show();
            },
            complete: function () {
                $('#listloader').hide();
            },
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (html) {
                if (html == 'session_logout') {
                    window.location.reload(true);
                }
                if (html['status'] == 200) {
                    alertPopupUserLimit("Request successfully sent.", 'success');
                    $('#alertTitle').html('Success');
                } else {
                    alertPopupUserLimit("Some thing went wrong, please try again.", 'error');
                    $('#alertTitle').html('Error');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //window.location.reload(true);
            }
        });
    }

    function alertPopupUserLimit(msg, type, location) {

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
        } else {
            $(selector_parent).modal();
        }
    }
}

function getUserPermission(CollegeSelected,role,UserSelected) {
    if($("#AllowOverwritePermission").prop("checked") == false){
        return false;
    }
    var newCid = CollegeSelected.split(',');
    $('#CollegeConfigurationSection .loader-block').show();

    $.ajax({
        url: jsVars.GetUserPermissionLink,
        type: 'post',
        data: {role: role, CollegeSelected: newCid, UserSelected: UserSelected},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {

        },
        complete: function () {
            $('#CollegeConfigurationSection .loader-block').hide();
        },
        success: function (html) {
            if (html == 'session')
            {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (html == 'required')
            {
                alertPopup('College and user role both are required.', 'error');
            } else if (html == 'error')
            {
                alertPopup('Unable to load override permission view.', 'error');
            } else if (html == 'no_more')
            {
                alertPopup('Permissions not assigned to the selected role for this college.', 'error');
                if (role == jsVars.GROUP_PUBLISHER_ID_JS) {
                    $('#UserPermissionSection').html('');
                }
            } else
            {
                $('#permissionConfigurationContainer').html(html);
                $('.panel-group').on('hidden.bs.collapse1', toggleIcon);
                $('.panel-group').on('shown.bs.collapse1', toggleIcon);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function SavePermissionData(container,fromId){
    if(typeof container == 'undefined' || container != 'permissionContainer'){
        return false;
    }
    var data = $('#' + fromId).serializeArray();
    $.ajax({
        url: '/users/savePermissionConfig/' + jsVars.paramString,
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#UserConfigurationSection .loader-block').show();
        },
        complete: function () {
            // hide loader
            $('#UserConfigurationSection .loader-block').hide();
        },
        success: function (json) {
            if (json['session_logout']) {
                // if session is out
                location = FULL_URL;
            }
            else if (json['status']==0) {
                // error display in popup
                alertPopup(json['message'], 'error');
            }
            else if (json['status'] == 200){
                alertPopup(json['message'], 'Success');
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}
function toggleIcon(e)
{
    $(e.target)
            .prev('.panel-heading')
            .find(".more-less")
            .toggleClass('glyphicon-plus glyphicon-minus');
}

/*** Show & Hide Loader ***/
function showLoader() {
    $("#listloader").show();
}
function hideLoader() {
    //setTimeout(function () {
        //$("#listloader").hide();
    //}, 50);
	$("#listloader").hide();
}


$(document).on('click', '#ShowEmbededCodeCollege', function (e) {
    e.preventDefault();
    var MainParentDiv = $(this).parents("div.application-form-block");
    var collegeId = $(MainParentDiv).prop('id');
    if (collegeId > 0) {
        $.ajax({
            url: '/colleges/getCollegeSlugAndSubdomain',
            type: 'post',
            data: {collegeId: collegeId},
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
                if (json['redirect']) {
                    location = json['redirect'];
                } else if (json['error']) {
                    alertPopup(json['error'], 'error');
                } else if (json['success'] == 200) {
                    $("#embed #EmbededHtmlLink").val(json['embedLink']);
                    $("#full_url_campaign1").html(json['embedLink']);
                    $("#college_id_campaign1").html(json['college_id']);
                    $("#embed #EmbededHtmlCode").html(json['embedHtml']);
                    $("#EmbededHtmlCode").prev('p').html("");
                    $("#EmbededHtmlCode").before('<p>Embed the HTML code snippet into your website to fully streamline the enquiry. </p>');
                    $(".formhtmlurl").html('');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    } else {
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
});


function setDependentFieldAttributes(currentObj,html_field_id){
    var parentDependentName = '';
    var childDependentName = '';
    var finalArray = new Array();
    //For Dynamic Dependent Dropdown
    var dependentDropdownJson = (typeof $(currentObj).data('registrationdependent') !== 'undefined') ? $(currentObj).data('registrationdependent') :'';
    var cur_elem_name   = $(currentObj).attr('name');
    if(dependentDropdownJson != '') {
        var formId = jQuery(currentObj).parents('form').find('[name="form_id"]').val();

        var explodeField = html_field_id.split('|');
        if(typeof explodeField[1] !== 'undefined') {
            var dependentKeyList  = Object.keys(dependentDropdownJson);
            var dependentValueList  = Object.values(dependentDropdownJson);
            var getChildPos = $.inArray(explodeField[1],dependentKeyList );

            if(getChildPos == -1) {
                getChildPos = $.inArray(explodeField[1],dependentValueList );
            }

            if(getChildPos > -1) {

                var dependentDropdown = cur_elem_name.split('[');
                var secondIndex = dependentDropdown[1];
                var indexNo = secondIndex.replace(']','');

                //Handle for Application
                if(typeof formId !== 'undefined') {
                    var thirdIndex = dependentDropdown[2];
                    var appIndexNo = thirdIndex.replace(']','');
                    indexNo = indexNo +'_'+appIndexNo;
                }

                parentDependentName    = html_field_id+indexNo;
                childDependentName = (typeof dependentDropdownJson[explodeField[1]] !== 'undefined') ? explodeField[0]+'|'+dependentDropdownJson[explodeField[1]]+indexNo :'';
            }
        }
    }
    finalArray['parentDependentName'] = parentDependentName;
    finalArray['childDependentName'] = childDependentName;
    return finalArray;
}

function getRegistrationDependentValue(currentObj,childParentType,selectedValue,module) {
    var cur_elem_name   = $(currentObj).attr('name');
    var curForm         = $(currentObj).parents('form');
    var childDependentName   = (typeof $(currentObj).data('childname') !== 'undefined') ? $(currentObj).data('childname') :'';
    if( $("[name='h_college_id']").length > 0 && typeof $("[name='h_college_id']").val() != "undefined" ){
        college_id_md = $("[name='h_college_id']").val();
    }
    //var curFormId       = $(curForm).attr('id');
    var cur_val_name    = cur_elem_name.replace('[fields]', '[values][]');

    if(childParentType == 'parent') {
        var dropdownName = cur_val_name;
        var parent_name    = cur_elem_name.replace('[values][]', '[fields]');
        var cur_val_name = parent_name;
        currentObj = $(curForm).find("[name='" + parent_name + "']");
    }

    var value_field = $(currentObj).val();
    var arr = value_field.split("||");

    var dependentDropdownJson = (typeof $(currentObj).data('registrationdependent') !== 'undefined') ? $(currentObj).data('registrationdependent') :'';

    if(typeof arr[0] !== 'undefined' && dependentDropdownJson != '') {

        var explodeField = arr[0].split("|");
        if(typeof explodeField[1] !== 'undefined') {

                    var dependentKeyList  = Object.keys(dependentDropdownJson);
                    var dependentValueList  = Object.values(dependentDropdownJson);

                    var isChildExist = false;
                    var getParentDependentValue = '';

                    var formId = jQuery(currentObj).parents('form').find('[name="form_id"]').val();
                    var currentDataChildName = '';
                    if(childParentType == 'parent') {
                        var getChildPos = $.inArray(explodeField[1],dependentKeyList );

                        if(getChildPos > -1) {

                            var dependentDropdown = cur_elem_name.split('[');
                            var secondIndex = dependentDropdown[1];
                            var indexNo = secondIndex.replace(']','');

                            //Handle for Application
                            if(typeof formId !== 'undefined') {
                                var thirdIndex = dependentDropdown[2];
                                var appIndexNo = thirdIndex.replace(']','');
                                indexNo = indexNo +'_'+appIndexNo;
                            }

                            if(typeof dependentValueList[getChildPos] !== 'undefined' && dependentValueList[getChildPos] != '') {
                                var childName = explodeField[0]+'|'+dependentValueList[getChildPos]+indexNo;

                                var childObject = $(curForm).find("[data-child='" + childName + "']");

                                if(typeof childObject !== 'undefined' && childObject.length) {

                                    var dependentDropdown = cur_elem_name.split('[');
                                    var secondIndex = dependentDropdown[1];
                                    var indexNo = secondIndex.replace(']','');

                                    //Handle for Application
                                    if(typeof formId !== 'undefined') {
                                        var thirdIndex = dependentDropdown[2];
                                        var appIndexNo = thirdIndex.replace(']','');
                                        indexNo = indexNo +'_'+appIndexNo;
                                    }

                                    var childName = explodeField[0]+'|'+dependentValueList[getChildPos]+indexNo;

                                    isChildExist = true;
                                    var cur_val_name = childObject.attr('name');
                                    getParentDependentValue = $(curForm).find("[name='" + cur_elem_name + "']").val();
                                }
                            }
                        }

                    } else {
                        var getChildPos = $.inArray(explodeField[1],dependentValueList );
                        isChildExist = true;

                        var dependentDropdown = cur_elem_name.split('[');
                        var secondIndex = dependentDropdown[1];
                        var indexNo = secondIndex.replace(']','');

                        //Handle for Application
                        if(typeof formId !== 'undefined') {
                            var thirdIndex = dependentDropdown[2];
                            var appIndexNo = thirdIndex.replace(']','');
                            indexNo = indexNo +'_'+appIndexNo;
                        }

                        var parentFieldName = explodeField[0]+'|'+dependentKeyList[getChildPos]+indexNo;
                        getParentDependentValue = $(curForm).find("[data-child='" + parentFieldName + "']").val();
                    }

                    if(getChildPos > -1 && isChildExist) {

                        //Blank All dropdown Value of Dependent Field
                        var getLastValue = 0;

                        var dependentDropdownArray = $(currentObj).data('registrationdependentarray');

                            if(childDependentName != '') {
                                //Blank First child Dependent
                                $(curForm).find("[data-child='" + childDependentName + "']").html('');
                                sumoDropdown();
                            }
                            var currentDataChildName = $(curForm).find("[name='" + cur_val_name + "']").data('childname');

                            $(dependentDropdownArray).each(function(key,fieldId){

                            //if getLastValue > 0 then return from here
                            if(getLastValue >0) {
                                return false;
                            }
                            var isFieldFound = 0;
                            $.each(fieldId, function(childKey,childFieldId){

                                var child_field_id = explodeField[0]+'|'+childFieldId+indexNo;

                                //if field match then increase the counter and store the increament value into getLastValue variable
                                if(child_field_id == currentDataChildName) {
                                    isFieldFound++;
                                    getLastValue = isFieldFound;
                                }
                                    if(isFieldFound > 0) {
                                        var currentChildObject = $(curForm).find("[data-child='" + child_field_id + "']");
                                        if($(currentChildObject).length) {

                                            if($(currentChildObject).hasClass( "sumo_select" )) {
                                                $(currentChildObject).html('');
                                                sumoDropdown();
                                            } else {
                                                /*
                                                $("#"+child_field_id).html(defaultOption);
                                                if($("#"+child_field_id+'_chosen').length) {
                                                    $('.chosen-select').chosen();
                                                    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                                                    $('.chosen-select').trigger('chosen:updated');
                                                }*/
                                            }
                                        }
                                    }
                                });
                            });

                        $.ajax({
                            url: '/common/getDynamicDependentDropdownValue',
                            type: 'post',
                            data: {'SelectedValue': getParentDependentValue, 'collegeId': college_id_md},
                            dataType: 'json',
                            async: false,
                            headers: {
                                "X-CSRF-Token": jsVars._csrfToken
                            },
                            beforeSend: function () {
                                $('#counsellerAllocationLoader .loader-block').show();
                            },
                            complete: function () {
                                $('#counsellerAllocationLoader .loader-block').hide();
                            },
                            success: function (json) {
                                if (typeof json['redirect'] !== 'undefined') {
                                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                                } else if (typeof json['error'] !== 'undefined') {
                                    alertPopup(json['error'], 'error');
                                } else {
                                    if(typeof json['data'] !== 'undefined' && json['data'] !== '') {
                                        var currentVal = $(currentObj).val();
                                        var obj_json = JSON.parse(json['data']);
                                        var html = '';
                                        for (var key in obj_json) {
                                            //default select pri registration in registration instance
                                            var select = '';
                                            if (key == 'pri_register_date') {
                                                select = 'selected';
                                            }
                                            if(typeof obj_json[key] == 'object'){
                                                html += '<optgroup label="'+key+'">';
                                                for (var key2 in obj_json[key]) {
                                                    html += "<option " + select + " value=\"" + key2 + "\">" + obj_json[key][key2] + "</option>";
                                                }
                                                html += '</optgroup>';
                                            }else{
                                                html += "<option " + select + " value=\"" + key + "\">" + obj_json[key] + "</option>";
                                            }
                                        }

                                        $(curForm).find("[name='" + cur_val_name + "']").html(html);
                                        if($("[name='" + cur_val_name + "']")[0] && $("[name='" + cur_val_name + "']")[0].sumo ){
                                            $("[name='" + cur_val_name + "']")[0].sumo.reload();
                                        }
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
}



/****For display college listing***/
function LoadCollegeDataNew2(type) {
    var data = [];
    if (type == 'reset') {
        ColPage = 0;
        $('#load_more_results_college').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
    }
    data = $('#FilterInstituteForm, #FilterInstituteFormSearch').serializeArray();
    data.push({name: "page", value: ColPage});
    data.push({name: "type", value: type});

    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;Loading...');

    $.ajax({
        url: jsVars.FULL_URL + '/colleges/ajax-lists-new',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
		beforeSend: function () {
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
        },
        success: function (data) {
            ColPage = ColPage + 1;
            if (data == "session_logout") {
                window.location.reload(true);
            } else if (data == "norecord") {
                if (ColPage == 1)
                    error_html = "No Records found";
                else
                    error_html = "No More Record";
                $('#collegeDiv').append("<div class='text-center text-danger margin-top-10'>" + error_html + "</div>");
                $('.text-danger + .text-danger').hide();
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Load More Record');
                $('#load_more_button').hide();
//                  if (type != '' && Page==1) {
//                        $('#if_record_exists').hide();
//                  }
            } else {
                data = data.replace("<head/>", '');
                $('#load_more_results_college').append(data);
                $('#load_more_button').removeAttr("disabled");
	        $('.offCanvasModal').modal('hide');
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Load More Record');
		dropdownMenuPlacement();
				//determineDropDirection();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


$(document).on('click', '#ShowEmbededCodeCollegeNew', function (e) {
    e.preventDefault();
    /*
    var MainParentDiv = $(this).parents("div.getInsId");
    var collegeId = $(MainParentDiv).prop('id');
    */
    var collegeId = $(this).data('collegeid');

    if (collegeId > 0) {
        $.ajax({
            url: '/colleges/getCollegeSlugAndSubdomain',
            type: 'post',
            data: {collegeId: collegeId},
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
                if (json['redirect']) {
                    location = json['redirect'];
                } else if (json['error']) {
                    alertPopup(json['error'], 'error');
                } else if (json['success'] == 200) {
                    $("#embed #EmbededHtmlLink").val(json['embedLink']);
                    $("#full_url_campaign1").html(json['embedLink']);
                    $("#college_id_campaign1").html(json['college_id']);
                    $("#embed #EmbededHtmlCode").html(json['embedHtml']);
                    $("#EmbededHtmlCode").prev('p').html("");
                    $("#EmbededHtmlCode").before('<p>Embed the HTML code snippet into your website to fully streamline the enquiry. </p>');
                    $(".formhtmlurl").html('');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    } else {
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
});



//Manage Institute: Change Institute Status
$(document).on('click', '#InstituteChangeStatusNew', function (e) {
    e.preventDefault();
    var InstituteId = $(this).data('collegeid');
    var CurrentStatus = $(this).attr('st');
    if (InstituteId > 0)
    {
        $('#confirmTitle').html("Confirm");
        var status = $('#status_'+InstituteId).text();
        var collegeName = $('#college_name_'+InstituteId).text();
        var statusText = (status == 'Active') ? 'Disable' : 'Enable';
        $('#ConfirmMsgBody').html('Are you sure to ' + statusText + ' college: ' + collegeName + '?');
        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();

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
                    $('#ConfirmPopupArea').modal('hide');
                    alertPopup(json['error'], 'error');
                }
                else if (json['success'] == 200)
                {
                    $('#ConfirmPopupArea').modal('hide');
					$('body').css('padding-right', '0');
                    if (json['changes'])
                    {
                       $('.status_cls_'+InstituteId).attr('st',json['changes']['status']);
                       $('#status_'+InstituteId).html(json['changes']['status']);
                       $('.status_cls_'+InstituteId).html(json['changes']['statusChangeText']);
                       alertPopup('Status changed successfully', 'success');
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
          });
       });
    }
});

//Manage Institute: Change Institute Status as delete
$(document).on('click', '#InstituteChangeStatusDeleteNew', function (e) {
    e.preventDefault();
    //var MainParentDiv = $(this).parents("div.getInsId");
    var InstituteId = $(this).data('collegeid');
    if (InstituteId > 0)
    {
        var InstituteName = $('#college_name_'+InstituteId).text();
        var InstituteStatus = $('.status_cls_'+InstituteId).text();
        var PopUpStatus = (InstituteStatus == 'Active') ? 'disable' : 'activate';
        var PopUpStatusSuccess = (InstituteStatus == 'Active') ? 'disabled' : 'activated';
        $("#ChangeStatusArea p#DisableEnableFormPopUpTextArea").text('Are you sure? You want to delete Institute \'' + InstituteName + '\'.');
        $('#ChangeStatusSuccessArea p#ConfirmDisableEnableFormPopUpTextArea').text('Institute \'' + InstituteName + '\' has been deleted.');
        $("#ChangeStatusArea button#ChangeStatusBtn").attr("onclick", 'ChangeInstituteStatusDeleteNew(\'' + InstituteId + '\',\'' + InstituteStatus + '\');');
		$('body').css('padding-right', '0');
    }
    else
    {
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
});


//change college status deleted
function ChangeInstituteStatusDeleteNew(InstituteId, CurrentStatus)
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
                         location.reload();
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

//Manage Institute: Change Institute Status
function subdomainAvailabilityChecker() {
//    var MainParentDiv = $(this).parents("div.getInsId");
    var subdomain = $('#colleges-subdomain').val();

    if (subdomain == '') {
        $('#subdomainError').hide().html('Please provide a domain.').fadeIn('slow').delay(2000).hide(1);
        return false;
    }
    $.ajax({
            url: jsVars.subdomainAvailabilityCheckerUrl,
            type: 'post',
            data: {'subdomain':subdomain},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('#subdomainAvailabilityCheckerBtn').prop('disabled', true);
//                $('#subdomainAvailabilityCheckerBtn').text('Wait..');
            },
            complete: function () {
                $('div.loader-block').hide();
            },
            success: function (json) {

                if (json['error']) {
                    alertPopup(json['error'],'error');
                }
                else {
                    if (json['status'] == 1) {
                        $('#subdomainError').attr('class','text-success');
                        $('#subdomainError').html('Subdomain available.');
                        $('#subdomainError').show();
                    }else if (json['status'] == 2) {
                        $('#subdomainError').attr('class','requiredError');
                        $('#subdomainError').hide().html('Subdomain pattern check failed.').fadeIn('slow').delay(2000).hide(1);
                    }else {
                        $('#subdomainError').attr('class','requiredError');
                        $('#subdomainError').hide().html('Sobdomain not available.').fadeIn('slow').delay(2000).hide(1);
                    }
                    $('#subdomainAvailabilityCheckerBtn').prop('disabled', false);
//                    $('#subdomainAvailabilityCheckerBtn').text('Check Availablity');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
}

//ivr click to call
function ClickToCall(collegeId, userId, formId, is_called, module, aliasName = '') {

    //jsVars.followUpLink
    $.ajax({
        url: '/counsellors/clickToCall',
        type: 'post',
        data: {'userId': userId, 'collegeId': collegeId, 'formId': formId, 'module': module, 'aliasName': aliasName},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#listloader').show();
            $('body div.loader-block').show();
        },
        complete: function () {
            $('#listloader').hide();
            $('body div.loader-block').hide();
        },
        success: function (data) {
            if (typeof data !== 'undefined') {
                var Resstatus = data.status;
                var message = data.message;
            }
            if (typeof Resstatus !== 'undefined' && Resstatus == 'queued') {
                $("#" + userId + '_' + collegeId + '_' + formId + '_' + module.replace('.','_')).trigger('click');
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
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function loadContentsByCategory(form_id, college_id,elem,urls) {
    if (typeof form_id == 'undefined' || form_id == ''
            || typeof college_id == 'undefined' || college_id == '') {
        return false;
    }
    if(typeof elem !='undefined'){
        $('.extension_categorylist').removeClass('active');
        $(elem).addClass('active');
    }

    $('#load_connectors_category').html('');
    $.ajax({
        url: urls,
        type: 'post',
        dataType: 'html',
        data: {'college_id': college_id, 'form_id': form_id},
        beforeSend: function (xhr) {
            $('.sectionLoader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (data == 'error:session') {
                window.location.reload(true);
            } else if (data.indexOf('error:') > -1) {
                var error = data.replace(/error\:/, '');
                alertPopup(error, 'error');
            } else {
                $('#load_connectors_category').html(data);
		$('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                bindAfterAjaxCall();

		if(urls == '/form/formDetailsInitiateAjax')
		initSample();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('.sectionLoader').hide();
        }
    });
    return false;
}

//Using on LM/User Profile
function getLeadSubStages(collegeId, val, selector, dropdown_class, parent, subStageValue) {
    $('#remark_error, #sub_stage_error, #followup_error, #stage_error').hide();
    if ((typeof collegeId == 'undefined') || (typeof val == 'undefined') || (typeof selector == 'undefined') || (typeof parent == 'undefined')
        || (typeof dropdown_class == 'undefined') || (typeof jsVars.getLeadSubStagesLink == 'undefined')) {
        return;
    }
    //reset filter
    $('#div_profile_sub_stage').show();
    if ((dropdown_class == 'chosen') && ((val == '') || (val  < 1))) {
        var leadSubStageHtml = '<label class="floatify__label float_addedd_js">Lead Sub Stage</label><select name="'+ selector +'" id="'+ selector +'" class="chosen-select" tabindex="-1"><option value="" selected="selected">Lead Sub Stage</option></select>';
        $('#' + parent).html(leadSubStageHtml);
        $('#' + parent + ' select#'+ selector +'').chosen();
        if(parent == "leadSubStagesNameDiv")  {
            $("#subStageLabel").hide();
        }
        return;
    } else if ((dropdown_class == 'sumo') && ((val == '') || (val  < 1))) {
        var leadSubStageHtml = '<option value="0">Lead Sub Stage ' + jsVars.notAvailableText + '</option>';
        $('select#' + selector).html(leadSubStageHtml)[0].sumo.reload();
        return;
    }

    $.ajax({
        url: jsVars.getLeadSubStagesLink,
        type: 'post',
        data: {'collegeId': collegeId, 'stageId': val},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            hideLoader();
        },
        success: function (json) {
            if (json['redirect']) {
                location = json['redirect'];
            } else if (json['error']) {
                alert(json['error']);
            } else  if (json['success'] === 200) {
                if (json['subStageList'] && (dropdown_class == 'chosen')) {
                     $("#subStageLabel").show();
                    var leadSubStageHtml = '<label class="floatify__label float_addedd_js">Lead Sub Stage</label><select name="'+ selector +'" id="'+ selector +'" class="chosen-select" tabindex="-1"><option value="" selected="selected">Lead Sub Stage</option>';
                    for(var subStageId in json['subStageList']) {
                        if (json['subStageList'].hasOwnProperty(subStageId)) {
                            leadSubStageHtml += '<option value="'+ subStageId +'">'+ json['subStageList'][subStageId] +'</option>';
                        }
                    }
                    leadSubStageHtml += '</select>';
                    $('#' + parent).html(leadSubStageHtml);
                    $('#div_profile_sub_stage').show();
                    $('#' + parent + ' select#'+ selector +'').chosen();
                    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                } else if (json['subStageList'] && (dropdown_class == 'sumo')) {
                    var leadSubStageHtml = '<option value="0">Lead Sub Stage ' + jsVars.notAvailableText + '</option>';
                    for(var subStageId in json['subStageList']) {
                        var selected = '';
                        leadSubStageHtml += '<option value="'+ subStageId +'" ' + selected +'>'+ json['subStageList'][subStageId] +'</option>';
                    }
                    $('select#' + selector).html(leadSubStageHtml);
                    if ((typeof subStageValue != 'undefined')) {
                        $('select#' + selector).val(subStageValue);
                    }
                    $('select#' + selector)[0].sumo.reload();
                }

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function pageLoader(){
	$(window).load(function(){
		$('.loader-block').hide();
	})
}

function floatableLabel(){
	$('.offCanvasModal input, .offCanvasModal textarea, .floatifyDiv input, .floatifyDiv textarea').floatify({
		hGap: 0
	});

	/*$('.offCanvasModal input, .offCanvasModal textarea, .floatifyDiv input, .floatifyDiv textarea').each(function(){
		if($(this).attr('placeholder')=='' || $(this).attr('placeholder')==null){
			$(this).parent().removeClass('floatify__active');
		}
	});*/


	if($('.offCanvasModal .chosen-select').length > 0){
		$('.offCanvasModal .chosen-select').each(function(){
			//alert($('#from_email').val());
			//&& this.id=='from_email'
			if($(this).val() !=''){
				$(this).parent().addClass('floatify floatify__left floatify__active');
			}
		});
		$('.offCanvasModal .chosen-select').change(function(){
			if($(this).val() !==''){
				$(this).parent().addClass('floatify floatify__left floatify__active');
			}else{
				$(this).parent().removeClass('floatify__active');
			}
		})
	}
	if($('.offCanvasModal .sumo-select').length > 0){
		$('.offCanvasModal .sumo-select').each(function(){
			//alert($('#from_email').val());
			//&& this.id=='from_email'
			if(($(this).val() !=='') && ($(this).val()!== null)){
				$(this).parent().parent().addClass('floatify floatify__left floatify__active');
			}
		});
		$('.offCanvasModal .sumo-select').change(function(){
			if(($(this).val() !=='') && ($(this).val()!== null)){
				$(this).parent().parent().addClass('floatify floatify__left floatify__active');
			}else{
				$(this).parent().parent().removeClass('floatify__active');
			}
		})
	}

	if($('.floatifyDiv .chosen-select').length > 0){
		$('.floatifyDiv .chosen-select').each(function(){
			//alert($('#from_email').val());
			//&& this.id=='from_email'
			if($(this).val() !=''){
				$(this).parent().addClass('floatify floatify__left floatify__active');
			}
		});
		$('.floatifyDiv .chosen-select').change(function(){
			if($(this).val() !==''){
				$(this).parent().addClass('floatify floatify__left floatify__active');
			}else{
				$(this).parent().removeClass('floatify__active');
			}
		})
	}
	if($('.floatifyDiv .sumo-select').length > 0){
		$('.floatifyDiv .sumo-select').each(function(){
			//alert($('#from_email').val());
			//&& this.id=='from_email'
			if(($(this).val() !=='') && ($(this).val()!== null)){
				$(this).parent().parent().addClass('floatify floatify__left floatify__active');
			}
		});
		$('.floatifyDiv .sumo-select').change(function(){
			if(($(this).val() !=='') && ($(this).val()!== null)){
				$(this).parent().parent().addClass('floatify floatify__left floatify__active');
			}else{
				$(this).parent().parent().removeClass('floatify__active');
			}
		})
	}
}

/*******
 *This function is changing dynamic message of request download popup
 *@(param)Request Type
 *
 *******/
function downloadRequestPopupMessage(type,collegeId){

    $('#requestMessage').text(type);
    $('#requestCollegeId').val(collegeId);
    $('#requestType').val(type);
}

$(document).on('click', '#ShowMaintenanceMode', function (e) {
    e.preventDefault();
    var collegeid = $(this).data('collegeid');
    $("#college_id").val(collegeid);

    $.ajax({
        url: '/colleges/maintenance-mode-popup',
        data : {collegeid:collegeid},
        type: 'post',
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
        },
        success: function (data) {
            if(typeof data['error'] !=='undefined'){
               if(data['error'] =='session') {
                   window.location.reload(true);
               } else {
                   alertPopup(data['error'],'error');
                   return false;
               }
            }
            $('#loadMaintenanceModeHtml').html(data);
            $('#maintenance-mode').modal('show');

            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.chosen-select').trigger('chosen:updated');
        },
        error: function (xhr, ajaxOptions, thrownError) {
        }
    });

});

function changeMaintenanceMode() {

    $('.error').hide();
    var error = false;
    if($("#maintenance_mode").val() == "") {
        $('#maintenance_status_error').html("Field is required.");
        $('#maintenance_status_error').show();
        error = true;
    }

    if ($("#message").val() == "") {
        $('#message_error').html("Field is required.");
        $('#message_error').show();
        error = true;
    }

    if (error == true) {
        return false;
    }

    $("#confirmYes").removeAttr('onclick');
    $('#confirmTitle').html("Maintenance Mode Confirmation");
    $("#confirmYes").html('Yes');
    $("#confirmYes").siblings('button').html('No');
    $('#ConfirmMsgBody').html('Are you sure you want to change Maintenance Mode.');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();

        var data = $('#maintenanceModeForm').serializeArray();
        $.ajax({
            url: '/colleges/save-maintenance-mode',
            type: 'post',
            dataType: 'html',
            data: data,
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (data) {
                var responseObject = $.parseJSON(data);
                if (responseObject.message === 'session') {
                    window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }
                if (responseObject.status == 1) {
                    $("#maintenance-mode").modal('hide');
                } else {
                    alertPopup(responseObject.message, 'error');
                    return;
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        $('#ConfirmPopupArea').modal('hide');
    });
    return false;
}

$(document).on('click', '.changeCollegeSlugModal', function (e) {
    $('[name="subdomain"]').val('');
    $('#error_span_subdomain').hide().html('');
    e.preventDefault();
    var subdomain = $(this).data('subdomain');
    var collegeId = $(this).data('collegeid');
    if (collegeId > 0) {
        $('#currentSubdomain').html("<div class='small'><div><strong>Old Subdomain</strong>:</div>"+subdomain+"</div>");
        $('#subdomaincollegeId').val(collegeId);
    }else{
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
});

$(document).on('click','#saveSubDomain', function() {

    $('#error_span_subdomain').hide().html('');
    if($('[name="subdomain"]').val()===''){
        $('#error_span_subdomain').show().html('Please enter subdomain');
        return;
    }
    if($('[name="subdomain"]').val()!==''){
        var formSlug = $('[name="subdomain"]').val();
        if(!formSlug.match(/^(?!:\/\/)([a-z0-9-_]+\.)*[a-z0-9][a-z0-9-_]+\.[a-z]{2,11}?$/)){
            $('#error_span_subdomain').show().html('Invalid Pattern');
            return;
        }

        if(formSlug.match(/[\-]{2,}/)){
            $('#error_span_subdomain').show().html('More than 1 hyphen not allowed');
            return;
        }
        if(!formSlug.match(/^[a-zA-Z0-9]+/)){
            $('#error_span_subdomain').show().html('Invalid Pattern');
            return;
        }
    }
    $(".npf-close").trigger('click');
    $("#confirmYes").removeAttr('onclick');
    $('#confirmTitle').html("Confirm");
    $("#confirmYes").html('Ok');
    $("#confirmNo").html('Cancel');
    $('#ConfirmMsgBody').html('Are you sure to update subdomain?');
    $('#ConfirmPopupArea').css('z-index', '11111');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
            e.preventDefault();
            $('#ConfirmPopupArea').modal('hide');
            changeCollegeSubdomain();
        });


});


function changeCollegeSubdomain(){
    var data = $("form#SubDomainForm").serializeArray();
    $.ajax({
        url: '/colleges/saveSubdomain',
        type: 'post',
        data: data,
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
            if (typeof json['redirect'] !='undefined' &&  json['redirect'] !=''){
                location = json['redirect'];
            }
            else if (typeof json['error'] != 'undefined' && json['error']!='') {
                alertPopup(json['error'], 'error');
            }
            else if (typeof json['success'] != 'undefined' && json['success'] == 200) {
                $(".npf-close").trigger('click');
                alertPopup("Updated successfuly, refreshing the page", 'success');
                $("#SubDomainForm")[0].reset();
                LoadCollegeDataNew2("reset");
//                setTimeout(function(){
//                    location.reload(true);
//                }, 2000);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //$(".npf-close").trigger('click');
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
        }
    });
}


function getAllSubmodules(){
    var moduleid = $('#permissionsModule').val();
    var selectedSubModuleId = $("#permissionsSubModule").val();
    $.ajax({
        url: '/colleges/getAllSubmodules',
        type: 'post',
        data: {moduleid:moduleid},
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
            if (typeof json['redirect'] !='undefined' &&  json['redirect'] !=''){
                location = json['redirect'];
            }
            else if (typeof json['error'] != 'undefined' && json['error']!='') {
                //alertPopup(json['error'], 'error');
                $("#permissionsSubModule").html('');
                    $('#permissionsSubModule')[0].sumo.reload();
                    $('#submoduleId').hide();
            }
            else if (typeof json['success'] != 'undefined' && json['success'] == 200) {
                var html = '';
                //for(var key in json['data']){
                    //html += '<option value="'+key+'">'+json['data'][key]+'</option>';

                var selected= '';
                for(var key in json['data']){
                    html += '<optgroup label="'+ key +'">';
                    for(var idx in json['data'][key]){
                        html += '<option value="'+ json['data'][key][idx]['id'] +'">'+ json['data'][key][idx]['group_title'] +'</option>';
                    }
                   // html += '<option value="'+key+'" '+selected+'>'+json['data'][key]+'</option>';

                    html += '</optgroup>';
                }
                if(html!=''){
                    $("#permissionsSubModule").html(html);
                    $('#permissionsSubModule')[0].sumo.reload();
                    $('#submoduleId').show();
                }else{
                    $("#permissionsSubModule").html('');
                    $('#permissionsSubModule')[0].sumo.reload();
                    $('#submoduleId').hide();
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
        }
    });
}

//ivr click to call
function ameyoDial(collegeId, userId, formId, mobile) {
    $('#ameyoCollegeID').val(collegeId);
    $('#ameyoUserId').val(userId);
    $('#ameyoFormId').val(formId);
    var customerNo = String(mobile);
    ameyo.integration.doDial(customerNo);
}

function getQrCode(data,collegeId) {
    $.ajax({
        url: '/counsellors/getQrCode',
        type: 'post',
        data: {data: data, collegeId:collegeId},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $("#qrCodeFail").find('img').addClass('spin');
            $("#qrCodeFail").find('h6').html('Please Wait..');
            $("#qrCodeFail").show();
        },
        success: function (json) {
            if(json.status === 1){
                $("#qrCodeFail").hide();
                $("#qrCodeSuccess").show()
                $('#leadQrCode').data('hasqrcodeloaded', true);
                $("#qrCodeSuccess")
                        .find('img')
                        .attr('src','data:image/png;base64,'+ json.data);
            }else{
                $("#qrCodeFail").find('img').removeClass('spin');
                $("#qrCodeFail").find('h6').html('Retry');
                $("#qrCodeSuccess").hide();
                $("#qrCodeFail").show();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $("#qrCodeFail").find('img').removeClass('spin');
            $("#qrCodeFail").find('h6').html('Retry');
            $("#qrCodeSuccess").hide();
            $("#qrCodeFail").show();
        }
    });
}

$(document).ready(function(){
    $('#leadQrCode').on('show.bs.dropdown', function () {
        if($(this).data('hasqrcodeloaded') === false){
            getQrCode($(this).data('qrcodedata'),$(this).data('cid'));
        }
    })
});
