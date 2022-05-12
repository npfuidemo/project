$(document).ready(function(){
	if (document.documentElement.clientWidth > 992) {
		tourHelp();
	}
});

function tourHelp(){
	var tourAnalytics= new Tour({
		steps: [
		{
			element: "#backend-settings",
			title: "Setting",
			content: "Access all your settings and start customising the system according to your needs.",
			template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-xs btn-npf pull-right' data-role='next'>Next »</button></nav></div>",
			placement: "left",
		},
		{
			element: "#dashboardAddDashlets",
			title: "Add Dashlet",
			content: "Start building your own personalised dashboard. Choose exactly which graphs/trends you want to see!",
			template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-xs btn-npf pull-right' data-role='next'>Next »</button></nav></div>",
			placement: "right",
		},
		{
			element: "#applicationFunnelDashletHTML .btn-video",
			title: "Product Video",
			content: "Watch this quick explainer video to know more about the dashlet.",
			template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-npf btn-xs pull-right' data-role='end'>End tour</button><button class='btn btn-xs btn-secondary-2 pull-right margin-right-15' data-role='prev'>« Prev</button></div>",
			placement: "right",
		}
		],
		name : 'analyticsHelpDashboard',
		storage: window.localStorage,
		backdrop: true,
		backdropContainer : 'body',
	});
	// Initialize the tour
	tourAnalytics.init();
	// Start the tour
	tourAnalytics.start();
}
