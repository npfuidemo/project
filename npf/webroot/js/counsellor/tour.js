$(document).ready(function(){
	if (document.documentElement.clientWidth > 992) {
		tourup();
	}
});

function tourup(){
	var tourUserProfile= new Tour({
		steps: [
			  {
				element: ".lscommonTour",
				title: "Lead Stage",
				content: "Current lead stage of the lead, user can update the stage by clicking on edit button",
				template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-xs btn-npf pull-right' data-role='next'>Next »</button></nav></div>",
				placement: "right",
			  },
			  {
				element: ".lmStageTour .leadStage",
				title: "Lead Stage",
				content: "Current lead stage of the lead, user can update the stage by clicking on edit button",
				template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-xs btn-npf pull-right' data-role='next'>Next »</button></nav></div>",
				placement: "right",
			  },
			  {
				element: ".amStageTour .leadStage",
				title: "Application Stage",
				content: "Current application stage of the application, user can update the stage by clicking on edit button",
				template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-xs btn-npf pull-right' data-role='next'>Next »</button><button class='btn btn-xs btn-secondary-2 pull-right margin-right-15' data-role='prev'>« Prev</button></nav></div>",
				placement: "right",
			  },
			  {
				element: "#strengthSpan",
				title: "Lead Strength",
				content: "Generate the lead strength by clicking on the text or icon.",
				template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-xs btn-npf pull-right' data-role='next'>Next »</button><button class='btn btn-xs btn-secondary-2 pull-right margin-right-15' data-role='prev'>« Prev</button></nav></div>",
				placement: "right",
			  },
			  {
				element: "#resetStage",
				title: "Change Lead Stage",
				content: "This action will allow user to change or update the lead stage.",
				template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-xs btn-npf pull-right' data-role='next'>Next »</button><button class='btn btn-xs btn-secondary-2 pull-right margin-right-15' data-role='prev'>« Prev</button></nav></div>",
				placement: "left",
			  },
			  {
				element: "#resetFollowup",
				title: "Add Follow Up",
				content: "This action will allow a user to mark a follow up for a lead.",
				template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-xs btn-npf pull-right' data-role='next'>Next »</button><button class='btn btn-xs btn-secondary-2 pull-right margin-right-15' data-role='prev'>« Prev</button></nav></div>",
				placement: "left",
			  },
			  {
				element: "#resetNote",
				title: "Add Note",
				content: "This action will allow user to add a note for a respective lead.",
				template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-xs btn-npf pull-right' data-role='next'>Next »</button><button class='btn btn-xs btn-secondary-2 pull-right margin-right-15' data-role='prev'>« Prev</button></nav></div>",
				placement: "left",
			  },
			  {
				element: "#resetCommunicate",
				title: "Communicate",
				content: "This action will allow user to send email, sms or whatsapp to a lead",
				template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-xs btn-npf pull-right' data-role='next'>Next »</button><button class='btn btn-xs btn-secondary-2 pull-right margin-right-15' data-role='prev'>« Prev</button></nav></div>",
				placement: "left",
			  },
			  {
				element: "#reassignLead",
				title: "Re-assign Lead",
				content: "This action will allow user to change the counsellor allocated to a lead.",
				template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-xs btn-npf pull-right' data-role='next'>Next »</button><button class='btn btn-xs btn-secondary-2 pull-right margin-right-15' data-role='prev'>« Prev</button></nav></div>",
				placement: "left",
			  },
			  {
				element: "#reassignApp",
				title: "Re-assign Application",
				content: "This action will allow user to change the counsellor allocated to a Application.",
				template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-xs btn-npf pull-right' data-role='next'>Next »</button><button class='btn btn-xs btn-secondary-2 pull-right margin-right-15' data-role='prev'>« Prev</button></nav></div>",
				placement: "left",
			  },
			  {
				element: ".nextPrevBtn",
				title: "Next/Prev",
				content: "This action will allow user to move swiftly to next or previous Lead/Application",
				template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-npf btn-xs pull-right' data-role='end'>End tour</button><button class='btn btn-xs btn-secondary-2 pull-right margin-right-15' data-role='prev'>« Prev</button></div>",
				placement: "left",
			  }
			],
		name : 'userProfile',
		storage: window.localStorage,
		backdrop: true,
		backdropContainer : 'body',
	});  
	// Initialize the tour
	tourUserProfile.init();
	// Start the tour
	tourUserProfile.start();
}