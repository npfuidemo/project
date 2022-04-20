const tour = new Tour({
    name: 'mytourname',
    backdrop: true,
    template: "<div class='popover tour mt-1'><div class='arrow'></div><h3 class='popover-title '></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn cs-btn mt-0 ml-0' data-role='prev'><i class='icon-long-arrow-left'></i></button><button class='btn cs-btn mt-0 ml-0' data-role='next'><i class='icon-long-arrow'></i></button><button class='btn btn-secondary' data-role='end'>Skip</button></div></div>",
    steps: [{
            element: "#navbarNotification",
            title: "Notifications",
            content: "Recent Notification",
            placement: "left"
        }, {
            element: "#tour-element-1",
            title: "Ask any question",
            content: "Ask any question",
            placement: "left"
        }, {
            element: "#tour-element-2",
            title: "Dashboard",
            content: "List for all application",
            placement: "top"
        }, {
            element: "#tour-element-3",
            title: "Program Finder",
            content: "List for all application",
            placement: "top"
        }, {
            element: "#tour-element-4",
            title: "My Applications",
            content: "List for all application",
            placement: "top"
        }, {
            element: "#tour-element-5",
            title: "My Queries",
            content: "List for all application",
            placement: "top"
        }, {
            element: "#lastFormCard",
            title: "Last Active Form",
            content: "List for all application",
            placement: "bottom"
        }, {
            element: "#applicationCard",
            title: "My Applications",
            content: "List for all application",
            placement: "bottom"
        },
        {
            element: "#sidebarTour",
            title: "Menu",
            content: "Menu for other items",
            placement: "left",
        }
    ],
    debug: true, // you may wish to turn on debug for the first run through
    framework: 'bootstrap4' // set Tourist to use BS4 compatibility
});


// Clear Local Storage for Bootstrap Tour

localStorage.clear();


tour.init();


tour.start();