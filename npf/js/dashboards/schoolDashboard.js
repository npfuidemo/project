
$(document).ready(function () {
    $('[data-toggle="popover"]').popover();
    loadReportDateRangepicker();
    
    $("#school-dashboard-graph li:first").addClass("active");
    
    $("#demographicGroup").on("click", showDemographicGraphs);
    $("#educationalGroup").on("click", showEducationalGraphs);
    $("#trendsGroup").on("click", showTrendsGraphs);
    $('#marketingGroup').on("click", showMarketingGraphs);
    if($('#otherGroup').length){
        $('#otherGroup').on("click", showOtherGraphs);
    }

    if ($("#demographicGroup").parent("li").hasClass("active")) {
        $('#educationalGroup').one("click", loadEducationalGraphs);
        $('#trendsGroup').one("click", loadTrendsGraphs);
	$('#marketingGroup').one("click", loadMarketingGraphs);
        if($('#otherGroup').length){
            $('#otherGroup').one("click", loadOtherGraphs);
        }
        showDemographicGraphs();
        loadDemographicGraphs();
    }

    if ($("#educationalGroup").parent("li").hasClass("active")) {
        $('#demographicGroup').one("click", loadDemographicGraphs);
        $('#trendsGroup').one("click", loadTrendsGraphs);
	$('#marketingGroup').one("click", loadMarketingGraphs);
        if($('#otherGroup').length){
            $('#otherGroup').one("click", loadOtherGraphs);
        }
        showEducationalGraphs();
        loadEducationalGraphs();
    }

    if ($("#trendsGroup").parent("li").hasClass("active")) {
        $('#demographicGroup').one("click", loadDemographicGraphs);
        $('#educationalGroup').one("click", loadEducationalGraphs);
	$('#marketingGroup').one("click", loadMarketingGraphs);
        if($('#otherGroup').length){
            $('#otherGroup').one("click", loadOtherGraphs);
        }
        showTrendsGraphs();
        loadTrendsGraphs();
    }

    if ($("#otherGroup").length && $("#otherGroup").parent("li").hasClass("active")) {
        $('#demographicGroup').one("click", loadDemographicGraphs);
        $('#educationalGroup').one("click", loadEducationalGraphs);
        $('#trendsGroup').one("click", loadTrendsGraphs);
	$('#marketingGroup').one("click", loadMarketingGraphs);
        showOtherGraphs();
        loadOtherGraphs();
    }
    
    if ($("#marketingGroup").parent("li").hasClass("active")) {
        $('#demographicGroup').one("click", loadDemographicGraphs);
        $('#educationalGroup').one("click", loadEducationalGraphs);
        $('#trendsGroup').one("click", loadTrendsGraphs);
	if($('#otherGroup').length){
            $('#otherGroup').one("click", loadOtherGraphs);
        }
        showMarketingGraphs();
        loadMarketingGraphs();
    }
    
    $('#nmatSourceFormFilter').on('change', function() {
	$("#nmatsource_nested").hide();
	loadMarketingGraphs();
    });

});

function showDemographicGraphs() {
    $(".user-tabuler-data").parent('li').removeClass('active');
    $("#demographicGroup").parent('li').addClass('active');
    $(".graphDiv").hide();
    $("#demographic-graphDiv").show();
    $("#selectedGroup").val("demographic");
}

function showEducationalGraphs() {
    $(".user-tabuler-data").parent('li').removeClass('active');
    $("#educationalGroup").parent('li').addClass('active');
    $(".graphDiv").hide();
    $("#educational-graphDiv").show();
    $("#selectedGroup").val("educational");
}

function showTrendsGraphs() {
    $(".user-tabuler-data").parent('li').removeClass('active');
    $("#trendsGroup").parent('li').addClass('active');
    $(".graphDiv").hide();
    $("#trends-graphDiv").show();
    $("#selectedGroup").val("trends");
}

function showOtherGraphs() {
    $(".user-tabuler-data").parent('li').removeClass('active');
    $("#otherGroup").parent('li').addClass('active');
    $(".graphDiv").hide();
    $("#other-graphDiv").show();
    $("#selectedGroup").val("other");
}

function showMarketingGraphs() {
    $(".user-tabuler-data").parent('li').removeClass('active');
    $("#marketingGroup").parent('li').addClass('active');
    $(".graphDiv").hide();
    $("#marketing-graphDiv").show();
    $("#selectedGroup").val("marketing");
}


function loadDemographicGraphs() {
    $("#genderGraphDateRange").on('apply.daterangepicker', generateGenderGraph);
    $('#genderGraphDateRange').on('cancel.daterangepicker', generateGenderGraph);
    generateGenderGraph();

    $("#ageGraphDateRange").on('apply.daterangepicker', generateAgeGraph);
    $('#ageGraphDateRange').on('cancel.daterangepicker', generateAgeGraph);
    generateAgeGraph();

    $("#nationalityGraphDateRange").on('apply.daterangepicker', generateNationalityGraph);
    $('#nationalityGraphDateRange').on('cancel.daterangepicker', generateNationalityGraph);
    generateNationalityGraph();

    $("#disabilityGraphDateRange").on('apply.daterangepicker', generateDisabilityGraph);
    $('#disabilityGraphDateRange').on('cancel.daterangepicker', generateDisabilityGraph);
    generateDisabilityGraph();
}

function loadEducationalGraphs() {
    $("#streamGraphDateRange").on('apply.daterangepicker', generateStreamGraph);
    $('#streamGraphDateRange').on('cancel.daterangepicker', generateStreamGraph);
    generateStreamGraph();
    $("#ugscoreGraphDateRange").on('apply.daterangepicker', generateUgScoreGraph);
    $('#ugscoreGraphDateRange').on('cancel.daterangepicker', generateUgScoreGraph);
    generateUgScoreGraph();
    $("#workexperienceGraphDateRange").on('apply.daterangepicker', generateWorkExperienceGraph);
    $('#workexperienceGraphDateRange').on('cancel.daterangepicker', generateWorkExperienceGraph);
    generateWorkExperienceGraph();
}

function loadTrendsGraphs() {
    $("#applicationtrendGraphDateRange").on('apply.daterangepicker', generateApplicationTrendGraph);
    $('#applicationtrendGraphDateRange').on('cancel.daterangepicker', generateApplicationTrendGraph);
    generateApplicationTrendGraph();
    $("#testcountryGraphDateRange").on('apply.daterangepicker', generateTestingCountryGraph);
    $('#testcountryGraphDateRange').on('cancel.daterangepicker', generateTestingCountryGraph);
    generateTestingCountryGraph();
    $("#nmatscoreGraphDateRange").on('apply.daterangepicker', generateNMATScoreGraph);
    $('#nmatscoreGraphDateRange').on('cancel.daterangepicker', generateNMATScoreGraph);
    generateNMATScoreGraph();
    $("#testCountryWiseExamsGraphDateRange").on('apply.daterangepicker', generateTestCountryWiseExamsGraph);
    $('#testCountryWiseExamsGraphDateRange').on('cancel.daterangepicker', generateTestCountryWiseExamsGraph);
    generateTestCountryWiseExamsGraph();
//    $("#examsummaryGraphDateRange").on('apply.daterangepicker', generateNMATScoreGraph);
//    $('#examsummaryGraphDateRange').on('cancel.daterangepicker', generateNMATScoreGraph);
//    generateExamSummaryGraph();
}

function loadOtherGraphs() {
    $("#prepregistrationsGraphDateRange").on('apply.daterangepicker', generatePrepRegistrationsTable);
    $('#prepregistrationsGraphDateRange').on('cancel.daterangepicker', generatePrepRegistrationsTable);
    generatePrepRegistrationsTable();
}

function loadMarketingGraphs() {
    $("#nmatsourceGraphDateRange").on('apply.daterangepicker', generateNMATSourceGraph);
    $('#nmatsourceGraphDateRange').on('cancel.daterangepicker', generateNMATSourceGraph);
    generateNMATSourceGraph();
    $("#examtakenVsplannedGraphDateRange").on('apply.daterangepicker', generateExamTakenVsPlannedGraph);
    $('#examtakenVsplannedGraphDateRange').on('cancel.daterangepicker', generateExamTakenVsPlannedGraph);
    generateExamTakenVsPlannedGraph();
}

function generateGenderGraph() {
    $.ajax({
        url: jsVars.genderWiseApplicationGraphLink,
        type: 'post',
        data: {dateRange: $('#genderGraphDateRange').val(), 'school': $("#school").val(), schoolView: $("#schoolView").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
//            $('#leadVsApplicationsDashletHTML .panel-loader').hide();
//            $('#leadVsApplicationsDashletHTML .panel-heading, #leadVsApplicationsDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data.schoolGraphData === "object" && $("#gender_wise_graph_school_div").length) {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "doughnut3d",
                                loadMessage: "Fetch School registration data...",
                                loadMessageFontSize: "15",
                                loadMessageColor: "#1f77b4",
                                renderAt: "gender_wise_graph_school_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "baseFont": "Roboto",
                                        "baseFontSize": "12",
                                        "palettecolors": "1f77b4,dc3e41,f6a858",
                                        "captionAlignment": "left",
                                        "caption": "School Registrations",
                                        "captionFontSize": "16",
                                        "captionFontColor": "#111",
                                        "captionFontBold": "0",
                                        "showLabels": 0,
//                                        "showValues":0, 
                                        "animateClockwise": "1",
                                        "pieRadius": "150",
                                        showpercentvalues: "1",
                                        decimals: "1",
                                        "theme": "fusion",
                                        exportFileName:"gender",
                                        exportEnabled: "1",
                                    },
                                    "data": responseObject.data.schoolGraphData
                                }
                            });
                            fusioncharts.render();
                        });
                    }

                    if (typeof responseObject.data.overallGraphData === "object") {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "doughnut3d",
                                loadMessage: "Fetch overall registration data...",
                                loadMessageFontSize: "15",
                                loadMessageColor: "#f6a858",
                                renderAt: "gender_wise_graph_overall_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "baseFont": "Roboto",
                                        "baseFontSize": "12",
                                        "palettecolors": "1f77b4,dc3e41,f6a858",
                                        "captionAlignment": "left",
                                        "caption": "Overall Registrations",
                                        "captionFontSize": "16",
                                        "captionFontColor": "#111",
                                        "captionFontBold": "0",
                                        "showLabels": 0,
//                                        "showValues":0, 
                                        "animateClockwise": "1",
                                        "pieRadius": "150",
                                        decimals: "1",
                                        "theme": "fusion",
                                        exportFileName:"gender",
                                        exportEnabled: "1",
                                        enablesmartlabels: "1"
                                    },
                                    "data": responseObject.data.overallGraphData
                                }
                            });
                            fusioncharts.render();
                        });
                    }
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

function generateAgeGraph() {
    $.ajax({
        url: jsVars.ageWiseApplicationGraphLink,
        type: 'post',
        data: {dateRange: $('#ageGraphDateRange').val(), 'school': $("#school").val(), schoolView: $("#schoolView").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
//            $('#leadVsApplicationsDashletHTML .panel-loader').hide();
//            $('#leadVsApplicationsDashletHTML .panel-heading, #leadVsApplicationsDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data.schoolGraphData === "object" && $("#age_wise_graph_school_div").length) {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "column2d",
                                loadMessage: "Fetch School registration data...",
                                loadMessageFontSize: "15",
                                loadMessageColor: "#1f77b4",
                                renderAt: "age_wise_graph_school_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "captionAlignment": "left",
                                        "baseFont": "Roboto",
                                        "baseFontSize": "12",
                                        "palettecolors": "1f77b4,f6a858,29c3be,d62728,9467bd,8c564b,e377c2,7f7f7f,bcbd22,17becf",
                                        "theme": "fusion",
                                        exportFileName:"age",
                                        exportEnabled: "1",
                                        "caption": "School Registrations",
                                        "captionFontSize": "16",
                                        "captionFontColor": "#111",
                                        "captionFontBold": "0",
                                    },
                                    "data": responseObject.data.schoolGraphData
                                }
                            });
                            fusioncharts.render();
                        });
                    }

                    if (typeof responseObject.data.overallGraphData === "object") {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "column2d",
                                loadMessage: "Fetch Overall registration data...",
                                loadMessageFontSize: "15",
                                loadMessageColor: "#1f77b4",
                                renderAt: "age_wise_graph_overall_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "baseFont": "Roboto",
                                        "baseFontSize": "12",
                                        "palettecolors": "1f77b4,f6a858,29c3be,d62728,9467bd,8c564b,e377c2,7f7f7f,bcbd22,17becf",
                                        "theme": "fusion",
                                        exportFileName:"age",
                                        exportEnabled: "1",
                                        "captionAlignment": "left",
                                        "caption": "Overall Registrations",
                                        "captionFontSize": "16",
                                        "captionFontColor": "#111",
                                        "captionFontBold": "0",
                                    },
                                    "data": responseObject.data.overallGraphData
                                }
                            });
                            fusioncharts.render();
                        });
                    }
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

function generateNationalityGraph() {
    $.ajax({
        url: jsVars.nationalityWiseApplicationGraphLink,
        type: 'post',
        data: {dateRange: $('#nationalityGraphDateRange').val(), 'school': $("#school").val(), schoolView: $("#schoolView").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
//            $('#leadVsApplicationsDashletHTML .panel-loader').hide();
//            $('#leadVsApplicationsDashletHTML .panel-heading, #leadVsApplicationsDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data.schoolGraphData === "object" && $("#nationality_wise_graph_school_div").length) {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "scrollcolumn2d",
                                loadMessage: "Fetch school registration data...",
                                loadMessageFontSize: "15",
                                loadMessageColor: "#1f77b4",
                                renderAt: "nationality_wise_graph_school_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "captionAlignment": "left",
                                        "baseFont": "Roboto",
                                        "baseFontSize": "12",
                                        numvisibleplot: "10",
                                        "theme": "fusion",
                                        "palettecolors": "1f77b4,f6a858,29c3be,d62728,9467bd,8c564b,e377c2,7f7f7f,bcbd22,17becf",
                                        exportFileName:"nationality",
                                        exportEnabled: "1",
                                        "caption": "School Registrations",
                                        "captionFontSize": "16",
                                        "captionFontColor": "#111",
                                        "captionFontBold": "0",
                                    },
                                    "categories": [{
                                            "category": responseObject.data.schoolGraphData.category
                                        }],
                                    "dataset": [{
                                            "data": responseObject.data.schoolGraphData.data
                                        }]
                                }
                            });
                            fusioncharts.render();
                        });
                    }

                    if (typeof responseObject.data.overallGraphData === "object") {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "scrollcolumn2d",
                                loadMessage: "Fetch overall registration data...",
                                loadMessageFontSize: "15",
                                loadMessageColor: "#1f77b4",
                                renderAt: "nationality_wise_graph_overall_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "captionAlignment": "left",
                                        "baseFont": "Roboto",
                                        "baseFontSize": "12",
                                        numvisibleplot: "10",
                                        "theme": "fusion",
                                        "palettecolors": "1f77b4,f6a858,29c3be,d62728,9467bd,8c564b,e377c2,7f7f7f,bcbd22,17becf",
                                        exportFileName:"nationality",
                                        exportEnabled: "1",
                                        "caption": "Overall Registrations",
                                        "captionFontSize": "16",
                                        "captionFontColor": "#111",
                                        "captionFontBold": "0",
                                    },
                                    "categories": [{
                                            "category": responseObject.data.overallGraphData.category
                                        }],
                                    "dataset": [{
                                            "data": responseObject.data.overallGraphData.data
                                        }]
                                }
                            });
                            fusioncharts.render();
                        });
                    }
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

function generateDisabilityGraph() {
    $.ajax({
        url: jsVars.disabilityWiseApplicationGraphLink,
        type: 'post',
        data: {dateRange: $('#disabilityGraphDateRange').val(), 'school': $("#school").val(), schoolView: $("#schoolView").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
//            $('#leadVsApplicationsDashletHTML .panel-loader').hide();
//            $('#leadVsApplicationsDashletHTML .panel-heading, #leadVsApplicationsDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data.schoolGraphData === "object" && $("#disability_wise_graph_school_div").length) {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "doughnut3d",
                                loadMessage: "Fetch school registration data...",
                                loadMessageFontSize: "15",
                                loadMessageColor: "#1f77b4",
                                renderAt: "disability_wise_graph_school_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "captionAlignment": "left",
                                        "baseFont": "Roboto",
                                        "baseFontSize": "12",
                                        "palettecolors": "1f77b4,f6a858",
                                        //"palettecolors":"1f77b4,f6a858",
                                        "caption": "School Registrations",
                                        "captionFontSize": "16",
                                        "captionFontColor": "#111",
                                        "captionFontBold": "0",
                                        "showLabels": 0,
//                                        "showValues":0, 
                                        "animateClockwise": "1",
                                        "pieRadius": "150",
                                        showpercentvalues: "1",
                                        decimals: "1",
                                        "theme": "fusion",
                                        exportFileName:"disability",
                                        exportEnabled: "1"
                                    },
                                    "data": responseObject.data.schoolGraphData
                                }
                            });
                            fusioncharts.render();
                        });
                    }

                    if (typeof responseObject.data.overallGraphData === "object") {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "doughnut3d",
                                loadMessage: "Fetch overall registration data...",
                                loadMessageFontSize: "15",
                                loadMessageColor: "#f6a858",
                                renderAt: "disability_wise_graph_overall_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "captionAlignment": "left",
                                        "baseFont": "Roboto",
                                        "baseFontSize": "12",
                                        "palettecolors": "1f77b4,f6a858",
                                        "caption": "Overall Registrations",
                                        "captionFontSize": "16",
                                        "captionFontColor": "#111",
                                        "captionFontBold": "0",
                                        "showLabels": 0,
//                                        "showValues":0, 
                                        "animateClockwise": "1",
                                        "pieRadius": "150",
                                        decimals: "1",
                                        "theme": "fusion",
                                        exportFileName:"disability",
                                        exportEnabled: "1"
                                    },
                                    "data": responseObject.data.overallGraphData
                                }
                            });
                            fusioncharts.render();
                        });
                    }
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

function generateStreamGraph() {
    $.ajax({
        url: jsVars.streamWiseApplicationGraphLink,
        type: 'post',
        data: {dateRange: $('#streamGraphDateRange').val(), 'school': $("#school").val(), schoolView: $("#schoolView").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
//            $('#leadVsApplicationsDashletHTML .panel-loader').hide();
//            $('#leadVsApplicationsDashletHTML .panel-heading, #leadVsApplicationsDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data.schoolGraphData === "object" && $("#stream_wise_graph_school_div").length) {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "scrollcolumn2d",
                                loadMessage: "Fetch school registration data...",
                                loadMessageFontSize: "15",
                                loadMessageColor: "#1f77b4",
                                renderAt: "stream_wise_graph_school_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "captionAlignment": "left",
                                        "baseFont": "Roboto",
                                        "baseFontSize": "12",
                                        "caption": "School Registrations",
                                        "captionFontSize": "16",
                                        "captionFontColor": "#111",
                                        "captionFontBold": "0",
                                        numvisibleplot: "10",
                                        "theme": "fusion",
                                        exportFileName:"stream",
                                        exportEnabled: "1"
                                    },
                                    "categories": [{
                                            "category": responseObject.data.schoolGraphData.category
                                        }],
                                    "dataset": [{
                                            "data": responseObject.data.schoolGraphData.data
                                        }]
                                }
                            });
                            fusioncharts.render();
                        });
                    }

                    if (typeof responseObject.data.overallGraphData === "object") {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "scrollcolumn2d",
                                loadMessage: "Fetch overall registration data...",
                                loadMessageFontSize: "15",
                                loadMessageColor: "#f6a858",
                                renderAt: "stream_wise_graph_overall_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "captionAlignment": "left",
                                        "baseFont": "Roboto",
                                        "baseFontSize": "12",
                                        "caption": "Overall Registrations",
                                        "captionFontSize": "16",
                                        "captionFontColor": "#111",
                                        "captionFontBold": "0",
                                        numvisibleplot: "10",
                                        "theme": "fusion",
                                        exportFileName:"stream",
                                        exportEnabled: "1"
                                    },
                                    "categories": [{
                                            "category": responseObject.data.overallGraphData.category
                                        }],
                                    "dataset": [{
                                            "data": responseObject.data.overallGraphData.data
                                        }]
                                }
                            });
                            fusioncharts.render();
                        });
                    }
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

function generateUgScoreGraph() {
    $.ajax({
        url: jsVars.ugscoreWiseApplicationGraphLink,
        type: 'post',
        data: {dateRange: $('#ugscoreGraphDateRange').val(), 'school': $("#school").val(), schoolView: $("#schoolView").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
//            $('#leadVsApplicationsDashletHTML .panel-loader').hide();
//            $('#leadVsApplicationsDashletHTML .panel-heading, #leadVsApplicationsDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data.schoolGraphData === "object" && $("#ugscore_wise_graph_school_div").length) {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "column2d",
                                loadMessage: "Fetch school registration data...",
                                loadMessageFontSize: "15",
                                loadMessageColor: "#1f77b4",
                                renderAt: "ugscore_wise_graph_school_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "captionAlignment": "left",
                                        "palettecolors": "1f77b4,f6a858,29c3be,d62728,9467bd,8c564b,e377c2,7f7f7f,bcbd22,17becf",
                                        "baseFont": "Roboto",
                                        "baseFontSize": "12",
                                        "caption": "School Registrations",
                                        "captionFontSize": "16",
                                        "captionFontColor": "#111",
                                        "captionFontBold": "0",
                                        "theme": "fusion",
                                        exportFileName:"ug_score",
                                        exportEnabled: "1"
                                    },
                                    "data": responseObject.data.schoolGraphData
                                }
                            });
                            fusioncharts.render();
                        });
                    }

                    if (typeof responseObject.data.overallGraphData === "object") {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "column2d",
                                loadMessage: "Fetch overall registration data...",
                                loadMessageFontSize: "15",
                                loadMessageColor: "#1f77b4",
                                renderAt: "ugscore_wise_graph_overall_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "captionAlignment": "left",
                                        "palettecolors": "1f77b4,f6a858,29c3be,d62728,9467bd,8c564b,e377c2,7f7f7f,bcbd22,17becf",
                                        "baseFont": "Roboto",
                                        "baseFontSize": "12",
                                        "caption": "Overall Registrations",
                                        "captionFontSize": "16",
                                        "captionFontColor": "#111",
                                        "captionFontBold": "0",
                                        "theme": "fusion",
                                        exportFileName:"ug_score",
                                        exportEnabled: "1"
                                    },
                                    "data": responseObject.data.overallGraphData
                                }
                            });
                            fusioncharts.render();
                        });
                    }
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

function generateWorkExperienceGraph() {
    $.ajax({
        url: jsVars.workexperienceWiseApplicationGraphLink,
        type: 'post',
        data: {dateRange: $('#workexperienceGraphDateRange').val(), 'school': $("#school").val(), schoolView: $("#schoolView").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
//            $('#leadVsApplicationsDashletHTML .panel-loader').hide();
//            $('#leadVsApplicationsDashletHTML .panel-heading, #leadVsApplicationsDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data.schoolGraphData === "object" && $("#workexperience_wise_graph_school_div").length) {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "column2d",
                                loadMessage: "Fetch school registration data...",
                                loadMessageFontSize: "15",
                                loadMessageColor: "#1f77b4",
                                renderAt: "workexperience_wise_graph_school_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "captionAlignment": "left",
                                        "baseFont": "Roboto",
                                        "baseFontSize": "12",
                                        "palettecolors": "1f77b4,f6a858,29c3be,d62728,9467bd,8c564b,e377c2,7f7f7f,bcbd22,17becf",
                                        "caption": "School Registrations",
                                        "captionFontSize": "16",
                                        "captionFontColor": "#111",
                                        "captionFontBold": "0",
                                        "theme": "fusion",
                                        exportFileName:"work_experience",
                                        exportEnabled: "1"
                                    },
                                    "data": responseObject.data.schoolGraphData
                                }
                            });
                            fusioncharts.render();
                        });
                    }

                    if (typeof responseObject.data.overallGraphData === "object") {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "column2d",
                                loadMessage: "Fetch overall registration data...",
                                loadMessageFontSize: "15",
                                loadMessageColor: "#1f77b4",
                                renderAt: "workexperience_wise_graph_overall_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "captionAlignment": "left",
                                        "baseFont": "Roboto",
                                        "baseFontSize": "12",
                                        "palettecolors": "1f77b4,f6a858,29c3be,d62728,9467bd,8c564b,e377c2,7f7f7f,bcbd22,17becf",
                                        "caption": "Overall Registrations",
                                        "captionFontSize": "16",
                                        "captionFontColor": "#111",
                                        "captionFontBold": "0",
                                        "theme": "fusion",
                                        exportFileName:"work_experience",
                                        exportEnabled: "1"
                                    },
                                    "data": responseObject.data.overallGraphData
                                }
                            });
                            fusioncharts.render();
                        });
                    }
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

function generateApplicationTrendGraph() {
    $.ajax({
        url: jsVars.applicationTrendGraphLink,
        type: 'post',
        data: {dateRange: $('#applicationtrendGraphDateRange').val(), 'school': $("#school").val(), schoolView: $("#schoolView").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
//            $('#leadVsApplicationsDashletHTML .panel-loader').hide();
//            $('#leadVsApplicationsDashletHTML .panel-heading, #leadVsApplicationsDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data.graphData === "object") {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "spline",
                                renderAt: "applicationtrend_graph_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "captionAlignment": "left",
                                        "baseFont": "Roboto",
                                        "baseFontSize": "12",
                                        "theme": "fusion",
                                        "palettecolors": "1f77b4,f6a858,29c3be,d62728,9467bd,8c564b,e377c2,7f7f7f,bcbd22,17becf",
                                        exportFileName:"application_trend",
                                        exportEnabled: "1"
                                    },
                                    "data": responseObject.data.graphData
                                }
                            });
                            fusioncharts.render();
                        });
                    }
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

function generateNMATScoreGraph() {
    $.ajax({
        url: jsVars.nmatScoreWiseApplicationsGraphLink,
        type: 'post',
        data: {dateRange: $('#nmatscoreGraphDateRange').val(), 'school': $("#school").val(), schoolView: $("#schoolView").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
//            $('#leadVsApplicationsDashletHTML .panel-loader').hide();
//            $('#leadVsApplicationsDashletHTML .panel-heading, #leadVsApplicationsDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data.schoolGraphData === "object" && $("#nmatscore_wise_graph_school_div").length) {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "spline",
                                loadMessage: "Fetch School registration data...",
                                loadMessageFontSize: "15",
                                loadMessageColor: "#1f77b4",
                                renderAt: "nmatscore_wise_graph_school_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
										"captionAlignment": "left",
                                        "baseFont": "Roboto",
                                        "baseFontSize": "12",
                                        "palettecolors": "1f77b4,f6a858,2ca02c,d62728,9467bd,8c564b,e377c2,7f7f7f,bcbd22,17becf",
                                        "theme": "fusion",
                                        exportFileName:"nmat_score",
                                        exportEnabled: "1",
                                        "caption": "School Registrations",
                                        "captionFontSize": "16",
                                        "captionFontColor": "#111",
                                        "captionFontBold": "0"
                                    },
                                    "data": responseObject.data.schoolGraphData
                                }
                            });
                            fusioncharts.render();
                        });
                    }

                    if (typeof responseObject.data.overallGraphData === "object") {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "spline",
                                loadMessage: "Fetch Overall registration data...",
                                loadMessageFontSize: "15",
                                loadMessageColor: "#1f77b4",
                                renderAt: "nmatscore_wise_graph_overall_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
										"captionAlignment": "left",
                                        "baseFont": "Roboto",
                                        "baseFontSize": "12",
                                        "palettecolors": "1f77b4,f6a858,2ca02c,d62728,9467bd,8c564b,e377c2,7f7f7f,bcbd22,17becf",
                                        "theme": "fusion",
                                        exportFileName:"nmat_score",
                                        exportEnabled: "1",
                                        "caption": "Overall Registrations",
                                        "captionFontSize": "16",
                                        "captionFontColor": "#111",
                                        "captionFontBold": "0",
                                    },
                                    "data": responseObject.data.overallGraphData
                                }
                            });
                            fusioncharts.render();
                        });
                    }
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

function generateTestingCountryGraph() {
    $.ajax({
        url: jsVars.testingCountryWiseApplicationsLink,
        type: 'post',
        data: {dateRange: $('#testcountryGraphDateRange').val(), 'school': $("#school").val(), schoolView: $("#schoolView").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
//            $('#leadVsApplicationsDashletHTML .panel-loader').hide();
//            $('#leadVsApplicationsDashletHTML .panel-heading, #leadVsApplicationsDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data.schoolGraphData === "object" && $("#testcountry_wise_graph_school_div").length) {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "scrollcolumn2d",
                                loadMessage: "Fetch school registration data...",
                                loadMessageFontSize: "15",
                                loadMessageColor: "#1f77b4",
                                renderAt: "testcountry_wise_graph_school_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "captionAlignment": "left",
                                        "caption": "School Registrations",
                                        "captionFont": "Roboto",
                                        "captionFontSize": "16",
                                        "captionFontColor": "#111",
                                        "captionFontBold": "0",
                                        numvisibleplot: "10",
                                        "theme": "fusion",
                                        "palettecolors": "1f77b4,f6a858,29c3be,d62728,9467bd,8c564b,e377c2,7f7f7f,bcbd22,17becf",
                                        exportFileName:"test_country",
                                        exportEnabled: "1"
                                    },
                                    "categories": [{
                                            "category": responseObject.data.schoolGraphData.category
                                        }],
                                    "dataset": [{
                                            "data": responseObject.data.schoolGraphData.data
                                        }]
                                }
                            });
                            fusioncharts.render();
                        });
                    }

                    if (typeof responseObject.data.overallGraphData === "object") {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "scrollcolumn2d",
                                loadMessage: "Fetch overall registration data...",
                                loadMessageFontSize: "15",
                                loadMessageColor: "#1f77b4",
                                renderAt: "testcountry_wise_graph_overall_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "captionAlignment": "left",
                                        "palettecolors": "1f77b4,f6a858,29c3be,d62728,9467bd,8c564b,e377c2,7f7f7f,bcbd22,17becf",
                                        "caption": "Overall Registrations",
                                        "captionFont": "Roboto",
                                        "captionFontSize": "16",
                                        "captionFontColor": "#111",
                                        "captionFontBold": "0",
                                        numvisibleplot: "10",
                                        "theme": "fusion",
                                        exportFileName:"test_country",
                                        exportEnabled: "1"
                                    },
                                    "categories": [{
                                            "category": responseObject.data.overallGraphData.category
                                        }],
                                    "dataset": [{
                                            "data": responseObject.data.overallGraphData.data
                                        }]
                                }
                            });
                            fusioncharts.render();
                        });
                    }
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

function generateExamSummaryGraph() {
    $.ajax({
        url: jsVars.testingCountryWiseApplicationsLink,
        type: 'post',
        data: {dateRange: $('#testcountryGraphDateRange').val(), 'school': $("#school").val(), schoolView: $("#schoolView").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
//            $('#leadVsApplicationsDashletHTML .panel-loader').hide();
//            $('#leadVsApplicationsDashletHTML .panel-heading, #leadVsApplicationsDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data.schoolGraphData === "object" && $("#examsummary_wise_graph_school_div").length) {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "scrollcolumn2d",
                                loadMessage: "Fetch school registration data...",
                                loadMessageFontSize: "16",
                                loadMessageColor: "#1f77b4",
                                renderAt: "examsummary_wise_graph_school_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "captionAlignment": "left",
                                        "caption": "School Registrations",
                                        "captionFont": "Roboto",
                                        "captionFontSize": "16",
                                        "captionFontColor": "#111",
                                        "captionFontBold": "0",
                                        numvisibleplot: "10",
                                        "theme": "fusion",
                                        "palettecolors": "1f77b4,f6a858,29c3be,d62728,9467bd,8c564b,e377c2,7f7f7f,bcbd22,17becf",
                                        exportFileName:"exam_summary",
                                        exportEnabled: "1"
                                    },
                                    "categories": [{
                                            "category": responseObject.data.schoolGraphData.category
                                        }],
                                    "dataset": [{
                                            "data": responseObject.data.schoolGraphData.data
                                        }]
                                }
                            });
                            fusioncharts.render();
                        });
                    }

                    if (typeof responseObject.data.overallGraphData === "object") {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "scrollcolumn2d",
                                loadMessage: "Fetch overall registration data...",
                                loadMessageFontSize: "16",
                                loadMessageColor: "#1f77b4",
                                renderAt: "examsummary_wise_graph_overall_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "captionAlignment": "left",
                                        "palettecolors": "1f77b4,f6a858,29c3be,d62728,9467bd,8c564b,e377c2,7f7f7f,bcbd22,17becf",
                                        "caption": "Overall Registrations",
                                        "captionFont": "Roboto",
                                        "captionFontSize": "16",
                                        "captionFontColor": "#111",
                                        "captionFontBold": "0",
                                        numvisibleplot: "10",
                                        "theme": "fusion",
                                        exportFileName:"exam_summary",
                                        exportEnabled: "1"
                                    },
                                    "categories": [{
                                            "category": responseObject.data.overallGraphData.category
                                        }],
                                    "dataset": [{
                                            "data": responseObject.data.overallGraphData.data
                                        }]
                                }
                            });
                            fusioncharts.render();
                        });
                    }
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

function generateTestCountryWiseExamsGraph(){
    $.ajax({
        url: jsVars.testingCoutryWiseExamGraphLink,
        type: 'post',
        data: {dateRange: $('#testCountryWiseExamsGraphDateRange').val(), 'school': $("#school").val(), schoolView: $("#schoolView").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
//            $('#leadVsApplicationsDashletHTML .panel-loader').hide();
//            $('#leadVsApplicationsDashletHTML .panel-heading, #leadVsApplicationsDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data.schoolGraphData === "object" && $("#testcountry_wise_exam_graph_school_div").length) {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "scrollcolumn2d",
                                loadMessage: "Loading graph...",
                                loadMessageFontSize: "16",
                                loadMessageColor: "#1f77b4",
                                renderAt: "testcountry_wise_exam_graph_school_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "captionAlignment": "left",
                                        "caption": "School Registrations",
                                        "captionFont": "Roboto",
                                        "captionFontSize": "16",
                                        "captionFontColor": "#111",
                                        "captionFontBold": "0",
                                        numvisibleplot: "30",
                                        "theme": "fusion",
                                        "palettecolors": "1f77b4,f6a858,29c3be,d62728,9467bd,8c564b,e377c2,7f7f7f,bcbd22,17becf",
                                        exportFileName:"exam_summary",
                                        exportEnabled: "1"
                                    },
                                    "categories": [{
                                            "category": responseObject.data.schoolGraphData.category
                                        }],
                                    "dataset": responseObject.data.schoolGraphData.dataset
                                }
                            });
                            fusioncharts.render();
                        });
                    }

                    if (typeof responseObject.data.overallGraphData === "object") {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "scrollcolumn2d",
                                loadMessage: "Loading graph...",
                                loadMessageFontSize: "16",
                                loadMessageColor: "#1f77b4",
                                renderAt: "testcountry_wise_exam_graph_overall_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        numvisibleplot: "30",
                                        "captionAlignment": "left",
                                        "palettecolors": "1f77b4,f6a858,29c3be,d62728,9467bd,8c564b,e377c2,7f7f7f,bcbd22,17becf",
                                        "caption": "Overall Registrations",
                                        "captionFont": "Roboto",
                                        "captionFontSize": "16",
                                        "captionFontColor": "#111",
                                        "captionFontBold": "0",
                                        "theme": "fusion",
                                        exportFileName:"exam_summary",
                                        exportEnabled: "1"
                                    },
                                    "categories": [{
                                            "category": responseObject.data.overallGraphData.category
                                        }],
                                    "dataset": responseObject.data.overallGraphData.dataset
                                }
                            });
                            fusioncharts.render();
                        });
                    }
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


function generatePrepRegistrationsTable(){
    $("#freeRegisteredCount").html(0);
    $("#freeDeliveredCount").html(0);
    $("#epRegisteredCount").html(0);
    $("#epDeliveredCount").html(0);
    $("#ogRegisteredCount").html(0);
    $("#ogDeliveredCount").html(0);
    $("#mockRegisteredCount").html(0);
    $("#mockDeliveredCount").html(0);
    $.ajax({
        url: jsVars.prepRegistrationCountLink,
        type: 'post',
        data: {dateRange: $('#prepregistrationsGraphDateRange').val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
//            $('#leadVsApplicationsDashletHTML .panel-loader').hide();
//            $('#leadVsApplicationsDashletHTML .panel-heading, #leadVsApplicationsDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if(typeof responseObject.data.registered!=="undefined"){
                        if( typeof responseObject.data.registered.FE !=="undefined" ){
                            $("#freeRegisteredCount").html(responseObject.data.registered.FE);
                        }
                        if( typeof responseObject.data.registered.EP !=="undefined" ){
                            $("#epRegisteredCount").html(responseObject.data.registered.EP);
                        }
                        if( typeof responseObject.data.registered.OG !=="undefined" ){
                            $("#ogRegisteredCount").html(responseObject.data.registered.OG);
                        }
                        if( typeof responseObject.data.registered.MOCK !=="undefined" ){
                            $("#mockRegisteredCount").html(responseObject.data.registered.MOCK);
                        }
                    }
                    
                    if(typeof responseObject.data.delivered!=="undefined"){
                        if( typeof responseObject.data.delivered.FE !=="undefined" ){
                            $("#freeDeliveredCount").html(responseObject.data.delivered.FE);
                        }

                        if( typeof responseObject.data.delivered.EP !=="undefined" ){
                            $("#epDeliveredCount").html(responseObject.data.delivered.EP);
                        }

                        if( typeof responseObject.data.delivered.OG !=="undefined" ){
                            $("#ogDeliveredCount").html(responseObject.data.delivered.OG);
                        }

                        if( typeof responseObject.data.delivered.MOCK !=="undefined" ){
                            $("#mockDeliveredCount").html(responseObject.data.delivered.MOCK);
                        }
                    }
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

function generateNMATSourceGraph() {
    $("#nmatsource_nested").hide();
    $.ajax({
        url: jsVars.nmatSourceGraphLink,
        type: 'post',
        data: {dateRange: $('#nmatsourceGraphDateRange').val(), 'school': $("#school").val(), 'form':$('#nmatSourceFormFilter').val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data.overallGraphData === "object") {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "scrollcolumn2d",
                                loadMessage: "How did you learn about NMAT?",
                                loadMessageFontSize: "15",
                                loadMessageColor: "#1f77b4",
                                renderAt: "nmatsource_graph_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "baseFont": "Roboto",
                                        "baseFontSize": "12",
                                        numvisibleplot: "10",
                                        "theme": "fusion",
                                        "palettecolors": "1f77b4,f6a858,29c3be,d62728,9467bd,8c564b,e377c2,7f7f7f,bcbd22,17becf",
                                        exportFileName:"nmatsource",
                                        exportEnabled: "1",
                                        "subcaption": "Click on the data plot items on the parent chart to view the respective descendant value.",
					"captionOnTop":0,
                                        "captionFontSize": "16",
                                        "captionFontColor": "#111",
                                        "captionFontBold": "0",
                                    },
                                    "categories": [{
                                            "category": responseObject.data.overallGraphData.category
                                        }],
                                    "dataset": [{
                                            "data": responseObject.data.overallGraphData.data
                                        }]
                                }
                            });
                            fusioncharts.render();
                        });
                    }
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

function nestedSource(source){
    $.ajax({
        url: jsVars.sourceFieldWiseApplications,
        type: 'post',
        data: {dateRange: $('#nmatsourceGraphDateRange').val(), 'school': $("#school").val(), 'form':$('#nmatSourceFormFilter').val(), 'source':source},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
	    $("#nmatsource_nested").show();
        },
        complete: function () {
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data.overallGraphData === "object") {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "scrollcolumn2d",
                                loadMessage: "How did you learn about NMAT?",
                                loadMessageFontSize: "15",
                                loadMessageColor: "#1f77b4",
                                renderAt: "nmatsource_nested_graph_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "captionAlignment": "left",
                                        "baseFont": "Roboto",
                                        "baseFontSize": "12",
                                        numvisibleplot: "10",
                                        "theme": "fusion",
                                        "palettecolors": "1f77b4,f6a858,29c3be,d62728,9467bd,8c564b,e377c2,7f7f7f,bcbd22,17becf",
                                        exportFileName:"nmatsource",
                                        exportEnabled: "1",
                                        "caption": source,
                                        "captionFontSize": "16",
                                        "captionFontColor": "#111",
                                        "captionFontBold": "0",
                                    },
                                    "categories": [{
                                            "category": responseObject.data.overallGraphData.category
                                        }],
                                    "dataset": [{
                                            "data": responseObject.data.overallGraphData.data
                                        }]
                                }
                            });
                            fusioncharts.render();
                        });
                    }
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

function generateExamTakenVsPlannedGraph() {
    $.ajax({
        url: jsVars.examTakenVsPlannedApplications,
        type: 'post',
        data: {dateRange: $('#examtakenVsplannedGraphDateRange').val(), 'school': $("#school").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    if (typeof responseObject.data.examTakenTotal) {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "doughnut3d",
                                loadMessage: "Fetch other exam taken data...",
                                loadMessageFontSize: "15",
                                loadMessageColor: "#1f77b4",
                                renderAt: "other_exam_taken_graph_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "baseFont": "Roboto",
                                        "baseFontSize": "12",
                                        "palettecolors": "1f77b4,f6a858,29c3be,d62728,9467bd,e377c2,8c564b,7f7f7f,bcbd22,17becf,FFC300",
                                        "captionAlignment": "left",
                                        "caption": "Other Exams Planned",
                                        "captionFontSize": "16",
                                        "captionFontColor": "#111",
                                        "captionFontBold": "0",
                                        "showLabels": 0,
                                        "animateClockwise": "1",
                                        "pieRadius": "150",
					"legendItemFontSize": "11",
                                        showpercentvalues: "1",
                                        decimals: "1",
                                        "theme": "fusion",
                                        exportFileName:"exam_taken",
                                        exportEnabled: "1",
                                    },
                                    "data": responseObject.data.examTakenGraphData
                                }
                            });
                            fusioncharts.render();
                        });
                    }
		    
		    if (typeof responseObject.data.examPlannedTotal) {
                        FusionCharts.ready(function () {
                            var fusioncharts = new FusionCharts({
                                type: "doughnut3d",
                                loadMessage: "Fetch other exam planned data...",
                                loadMessageFontSize: "15",
                                loadMessageColor: "#1f77b4",
                                renderAt: "other_exam_planned_graph_div",
                                width: "100%",
                                height: "350",
                                dataFormat: "json",
                                dataSource: {
                                    "chart": {
                                        "baseFont": "Roboto",
                                        "baseFontSize": "12",
                                        "palettecolors": "1f77b4,f6a858,29c3be,d62728,9467bd,e377c2,8c564b,7f7f7f,bcbd22,17becf,FFC300",
                                        "captionAlignment": "left",
                                        "caption": "Other Exams Taken",
                                        "captionFontSize": "16",
                                        "captionFontColor": "#111",
                                        "captionFontBold": "0",
                                        "showLabels": 0,
                                        "animateClockwise": "1",
                                        "pieRadius": "150",
					"legendItemFontSize": "11",
                                        showpercentvalues: "1",
                                        decimals: "1",
                                        "theme": "fusion",
                                        exportFileName:"exam_planned",
                                        exportEnabled: "1",
                                    },
                                    "data": responseObject.data.examPlannedGraphData
                                }
                            });
                            fusioncharts.render();
                        });
                    }
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