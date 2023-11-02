const tour = new Tour({
    name: 'mytourname',
    backdrop: true,
    template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title '></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-primary mr-2 btn-sm' data-role='prev'><span class='material-icons-outlined'>west</span></button><button class='btn btn-primary mr-2 btn-sm' data-role='next'><span class='material-icons-outlined'>east</span></button><button class='btn btn-dark btn-sm' data-role='end'>Skip</button></div></div>",
    steps: [{
            element: "#tab-points",
            title: "tab Panel",
            content: "tab Panel",
            placement: "right"
        },{
            element: "#missedcall-item",
            title: "Missed Calls",
            content: "Missed Calls",
            placement: "bottom"
        },{
            element: "#pendingcall-item",
            title: "Pending Calls",
            content: "Pending Calls",
            placement: "bottom"
        },{
            element: "#feedback-item",
            title: "Feedback",
            content: "Feedback",
            placement: "bottom"
        },{
            element: "#settings_btn",
            title: "Settings",
            content: "Settings",
            placement: "bottom"
        },{
            element: "#help-item",
            title: "Help",
            content: "Help",
            placement: "bottom"
        },{
            element: "#notification-item",
            title: "Notification",
            content: "Notification",
            placement: "bottom"
        }
    ],
    debug: true, // you may wish to turn on debug for the first run through
    framework: 'bootstrap4' // set Tourist to use BS4 compatibility
});


// Clear Local Storage for Bootstrap Tour

localStorage.clear();


tour.init();


tour.start();