const tour = new Tour({
    name: 'mytourname',
    backdrop: true,
    template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title '></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn cs-btn mt-0 ml-0' data-role='prev'><i class='icon-long-arrow-left'></i></button><button class='btn cs-btn mt-0 ml-0' data-role='next'><i class='icon-long-arrow'></i></button><button class='btn btn-secondary' data-role='end'>Skip</button></div></div>",
    steps: [{
            element: "#tour-element-1",
            title: "Notifications",
            content: "Recent Notification",
            placement: "bottom"
        }, {
            element: "#tour-element-2",
            title: "Dashboard",
            content: "List for all application"
        }, {
            element: "#tour-element-3",
            title: "Program Finder",
            content: "List for all application"
        }, {
            element: "#tour-element-4",
            title: "My Applications",
            content: "List for all application"
        }, {
            element: "#tour-element-5",
            title: "My Queries",
            content: "List for all application"
        }, {
            element: "#tour-element-6",
            title: "My Communications",
            content: "List for all application"
        },
        {
            element: "#tour-element-7",
            title: "My Payment",
            content: "List for all application"
        }, {
            element: "#tour-element-8",
            title: "FAQ",
            content: "List for all application"
        }, {
            element: "#tour-element-9",
            title: "Recent Activity",
            content: "List for all application"
        },
        {
            element: "#tour-element-10",
            title: "Ask Question",
            content: "Drop a Question",
            placement: "left",
        }, {
            element: "#lastFormCard",
            title: "Last Active Form",
            content: "List for all application"
        }, {
            element: "#applicationCard",
            title: "My Applications",
            content: "List for all application"
        },
        {
            element: "#programCard",
            title: "My Program Finder",
            content: "Find related program"
        },
        {
            element: "#queriesCard",
            title: "My Queries",
            content: "Any Questions"
        },
        {
            element: "#latestNotification",
            title: "Latest Notifications",
            content: "Any Questions",
            placement: "top",
        }
    ],
    debug: true, // you may wish to turn on debug for the first run through
    framework: 'bootstrap4' // set Tourist to use BS4 compatibility
});


// Clear Local Storage for Bootstrap Tour

localStorage.clear();


tour.init();


tour.start();