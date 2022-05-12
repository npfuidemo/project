var loaderCount = 0;
$currentSelectedTab = 'lead';
$(document).ready(function(){
    
    LoadReportDateRangepicker();
    $('#date_range').on('apply.daterangepicker', function(){
        drawCharts('engagement');
    });
    $('#date_range').on('cancel.daterangepicker', function(){
        drawCharts('engagement');
    });

    
//    if($('#applicationStageForm').length > 0){
//        if( $('#applicationStageForm').val() == ''){
//            $('#applicationSegmentDiv').hide();
//            $('#leadSegmentDiv').removeClass('col-md-4');
//            $('#leadSegmentDiv').addClass('col-md-8');
//        }else{
//            $('#applicationStageForm').on('change', function(){
//                drawCharts('applicationStage');
//            });
//        }
//    }
    
    
    $("#date_range").val('');
//     getActivityLogs('reset');
//    getLeadsDetail();
//     getEventList();
    $("#counsellor_id").change(function(){
        getLeadsDetail();
        drawCharts();
        getActivityLogs('reset');
        $('#calendar').fullCalendar('removeEvents');
        refreshEventList();
        $('#calendar').fullCalendar('rerenderEvents');
    });
    
//    if ($('#leadStatsContainer').length > 0 ||$('#engagementChartContainer').length > 0 || $('#leadStageContainer').length > 0 || $("#applicationStageContainer").length > 0) {
//        // Google Chart
//        google.charts.load("current", {packages: ["corechart"]});
//        google.charts.setOnLoadCallback(function(){
//            drawCharts();
//            if($('#sourcePublisher').length > 0){
//                counsellorWiseUsersGraph();
//            }
//            getLeadsDetail();
//        });
//    } 
    $('.parent-graph-tab li a').on('click', function () {
        $("#quickViewDateDiv").show();
        $('.parent-graph-tab li').removeClass('active');
        $('.parent-graph-tab li a').removeClass('active');
        $(this).addClass('active');
        $(this).parent().addClass('active');
        drawCharts('engagement');
    });
    if($('#sourcePublisher').length > 0){
        $('#sourcePublisher').SumoSelect({okCancelInMulti:true, search: true, searchText:'Search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
    }

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        
        var target = $(e.target).attr("href") // activated tab
        if(target == '#CounsellorDashboard'){
            $('#ProductivityReport').hide();
            $('#CounsellorDashboard').show();
            /******/
           
            if($('#applicationStageForm').length > 0){
                if( $('#applicationStageForm').val() == ''){
                    $('#applicationSegmentDiv').hide();
                    //$('#leadSegmentDiv').removeClass('col-md-4');
                    //$('#leadSegmentDiv').addClass('col-md-8');
                }else{
                    $('#applicationStageForm').on('change', function(){
                        drawCharts('applicationStage');
                    });
                }
            }
            
            if ($('#leadStatsContainer').length > 0 ||$('#engagementChartContainer').length > 0 || $('#leadStageContainer').length > 0 || $("#applicationStageContainer").length > 0) {
                // Google Chart
                google.charts.load("current", {packages: ["corechart"]});
                google.charts.setOnLoadCallback(function(){
                    drawCharts();
                    if($('#sourcePublisher').length > 0){
                        counsellorWiseUsersGraph();
                    }
                    getLeadsDetail();
                });
            }
            getActivityLogs('reset');
            getEventList();
            
            /*****/
        }
        /* else if(target == '#ProductivityReport'){
            $('#CounsellorDashboard').hide();
            $('#ProductivityReport').show();
            loadProductivityReport();
        } */
       
    });
    
    $('a[data-toggle="tab"][href="#CounsellorDashboard"]').trigger( "click" );
    
//    if($('a[data-toggle="tab"][href="#ProductivityReport"]').length>0){
//        $('a[data-toggle="tab"][href="#ProductivityReport"]').trigger( "click" );
//    }else{
//        $('a[data-toggle="tab"][href="#CounsellorDashboard"]').trigger( "click" );
//    }

});
var globalTime = '';

//on change of assigneeType, assigneeTypeStages
$(document).on('change', 'select#assigneeType, select#assigneeTypeStages', function() {
    //on change lead/applications aggined dropdown
    if (this.id == 'assigneeType') {
        var assigneeTypeStagesHiddenHtml = $('#assigneeTypeStagesHidden').html();
        $('select#assigneeTypeStages').html(assigneeTypeStagesHiddenHtml);
        if (this.value == 'application') {
            $('select#assigneeTypeStages  option[value=\'application\']').hide();//.find('option').attr('st','disabled');
            $('select#assigneeTypeStages optgroup[label=\'Lead Stages\']').remove();
        }
        $('select#assigneeTypeStages').trigger('chosen:updated');
    }
    var assigneeType = $("select#assigneeType").val();
    var assigneeTypeStages = $("select#assigneeTypeStages").val();
    
    if (((assigneeType == '') && (assigneeTypeStages == '')) || ((assigneeType != '') && (assigneeTypeStages != ''))) {
        counsellorWiseUsersGraph();
    }
});

function counsellorWiseUsersGraph() 
{
    $('#reg_chart_div').html('<img src="/img/line_no_data_image.jpg" class="img-responsive" alt="No Data">');
    
    var assigneeType = $("select#assigneeType").val();
    var assigneeTypeStages = $("select#assigneeTypeStages").val();
    
        $.ajax({
            url: jsVars.loadCounsellorWiseUsersGraphDataLink,
            type: 'post',
            data: {'counsellors':$("#sourcePublisher").val(), 'assigneeType': assigneeType, 'assigneeTypeStages': assigneeTypeStages},
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () { 
                loaderCount++;
                $('#leadDetailsLoader').show();
            },
            complete: function () {
                loaderCount--;
                if(loaderCount==0){
                    $('#leadDetailsLoader').hide();
                }
            },
            success: function (response) { 
                var responseObject = $.parseJSON(response);
                if(responseObject.status==1){
                    if(typeof responseObject.data === "object"){
                        if(typeof responseObject.data.graphData === "object"){
                            if(responseObject.data.graphData.length> 1){
                                drawCounsellorWiseBarChart("",'reg_chart_div', responseObject.data.graphData);
                            }
                        }
                        if(typeof responseObject.data.counsellorsList === "object" && typeof responseObject.data.counsellorsSelected === "object"){
                            var counsellorsSelectList = responseObject.data.counsellorsSelected;
                            var value   = '<select id="sourcePublisher" tabindex="-1" multiple="multiple" name="sourcePublisher[]">';
                            var counter = 0;
                            $.each(responseObject.data.counsellorsList, function (index, item) {
                                if(counsellorsSelectList.indexOf(parseInt(index)) >= 0){ ++counter;
                                    value += '<option value="'+index+'" selected="true">'+item+'</option>';
                                }
                                else if(counsellorsSelectList.indexOf(index) >= 0){ ++counter;  //unassigned selected
                                    value += '<option value="'+index+'" selected="true">'+item+'</option>';
                                } 
                                else if((counsellorsSelectList.length > 10) && (++counter<=10)){
                                    value += '<option value="'+index+'" selected="true">'+item+'</option>';
                                }
                                else{
                                    value += '<option value="'+index+'">'+item+'</option>';
                                }
//                                if(++counter<=10){
//                                    value += '<option value="'+index+'" selected="true">'+item+'</option>';
//                                }else{
//                                    value += '<option value="'+index+'">'+item+'</option>';
//                                }
                            });
                            value += '</select>';
                            $('#sourcePublisherDiv').html(value);
                            $('#sourcePublisher').SumoSelect({okCancelInMulti:true, search: true, searchText:'Search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
                            last_valid_selection    = $('#sourcePublisher').val();
                            $('#sourcePublisher').on('change', function(evt) {
                                if ($('#sourcePublisher').val() != null && $('#sourcePublisher').val().length > 10) {
                                    alert('Max 10 selections allowed!');
                                    var $this = $(this);
                                    var optionsToSelect = last_valid_selection;
                                    $this[0].sumo.unSelectAll();
                                    $.each(optionsToSelect, function (i, e) {
                                        $this[0].sumo.selectItem($this.find('option[value="' + e + '"]').index());
                                    });
                                    last_valid_selection    = optionsToSelect;
                                } else if($('#sourcePublisher').val() != null){
                                    last_valid_selection = $(this).val();
                                }
                            });



                            $(".sumo_sourcePublisher p.btnOk").click(function(){
                                counsellorWiseUsersGraph();
                            });
                        }
                    }
                }else{
                    if (responseObject.message === 'session'){
                        location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                    }else{
                        //alert(responseObject.message);
                    }
                }
                return;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
}

function drawCharts(type) {
    if(typeof type=='undefined'){
        type='';
    }
    var rangeType   = $('.parent-graph-tab li a.active').text();
    $.ajax({
        url: jsVars.getDashboardChartDataLink,
        type: 'post',
        data: {'counsellorId':$("#counsellor_id").val(), 'dateRange':$("#date_range").val(), 'chartType':type,counsellorIds:$("#counsellorIds").val(), 'rangeType':rangeType,'formId':$("#applicationStageForm").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            loaderCount++;
            $('#leadDetailsLoader').show();
        },
        complete: function () {
            loaderCount--;
            if(loaderCount==0){
                $('#leadDetailsLoader').hide();
            }
        },
        success: function (response) {
            var responseObject = $.parseJSON(response); 
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                if (typeof responseObject.data === "object"){
                    if(typeof responseObject.data.engagementChartData != 'undefined'
                        && responseObject.data.engagementChartData.length<2){
                        $('#engagementChartContainer').html('<img src="/img/line_no_data_image.jpg" class="img-responsive">');
                    } else if(type== 'engagement' || type== ''){
                        drawEngagementComboChart(responseObject.data.engagementChartData);
                    }
                    
                    if($('#leadSegmentDiv').length > 0 && (type== 'leadStage' || type== '')){
                        drawStageBarChart(responseObject.data.leadStageChartData, 'leadStageContainer');
                    }
                    
                    if($('#leadSubStageSegmentDiv').length > 0 && (type== 'leadSubStage' || type== '')){
                        drawStageBarChart(responseObject.data.leadSubStageChartData, 'leadSubStageContainer');
                    }
                    
                    if($('#applicationSegmentDiv').length > 0 && (type== 'applicationStage' || type== '')){
                        drawStageBarChart(responseObject.data.applicationStageChartData, 'applicationStageContainer');
                    }
                }
            }else{
                alert(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            //            $('#contact-us-final div.loader-block').hide();
        }
    });
}

function drawEngagementChart(graphData) {
    if(typeof graphData === "object"){
        if ($.isEmptyObject(graphData)) {
            $('#engagementChartContainer').html('<img src="/img/line_no_data_image.jpg">')
        } else {
            var data    = google.visualization.arrayToDataTable(graphData);
            var options = {
//                         title: 'Lead Engagement Chart',
                            height: 360,
                            colors: ['#00b0f0','#1f97df'],
                            legend: {position: 'top', maxLines: 3, alignment:'end'},
                            hAxis: {title: 'date',  titleTextStyle: {color: "#333"},gridlines:{count:graphData.length-1}},
                            vAxis: {minValue: 0},
                            pointSize: 5
                          };
            var chart = new google.visualization.AreaChart(document.getElementById('engagementChartContainer'));
            chart.draw(data, options);
        }
    }
}

function drawEngagementComboChart(graphData) {
    if(typeof graphData === "object"){
        if ($.isEmptyObject(graphData)) {
            $('#engagementChartContainer').html('<img src="/img/line_no_data_image.jpg">');
        } else {
            var data    = google.visualization.arrayToDataTable(graphData);
            var options = {
                legend: {position: 'top', maxLines: 3, alignment:'center'},
                colors: ['#00b0f0','#ffc000','#e13535'],
                vAxis: {minValue: 0,title: 'Total Allocated'},
                height: 415,
                hAxis: {title: 'Allocation Date',  titleTextStyle: {color: "#333"}},
				chartArea: {left: '8%', top: '15%', width: "90%", height: "60%" },
                seriesType: 'bars',
                series: {1: {type: 'line',pointSize: 5},2: {type: 'line',pointSize: 5}}
              };

            var chart = new google.visualization.ComboChart(document.getElementById('engagementChartContainer'));
            chart.draw(data, options);
        }
    }
}

function drawStageChart(graphData, graphContainer)
{
    if(typeof graphData === "object"){
        if ($.isEmptyObject(graphData)) {
            $('#'+graphContainer).html('<img src="/img/donut_no_data_image.jpg">')
        } else {
            var data = google.visualization.arrayToDataTable(graphData);

            var options = {
                //title: 'Lead Stage',
                //titleTextStyle: {'fontSize':'16', 'bold':false, 'color':'#111'},
                sliceVisibilityThreshold: .0002,
                pieHole: 0.6,
                pieSliceText: 'none',
                height: 280,
		colors: ['#00b0f0','#ffc000'],
                legend: {'position':'bottom', 'alignment':'center'},
                animation: {
                    duration: 1500,
                    easing: 'in',
                    startup: true
                }
            };

            var chart = new google.visualization.PieChart(document.getElementById(graphContainer));

            chart.draw(data, options);
        }
    }
}

function drawStageBarChart(graphData, graphContainer) {
    if(typeof graphData === "object"){
        if ($.isEmptyObject(graphData)) {
            $('#'+graphContainer).html('<p class="text-center noDataFound">No Data Available.</p>');
        } else {
            var redirectLinkArray = [];
            var isRedirectLink = (graphContainer === "leadStageContainer" || graphContainer === "applicationStageContainer");
            if(isRedirectLink) {
                var redirectLinkIndex = graphData[0].findIndex(rLI => rLI === "redirectLink");
                if(redirectLinkIndex > 0) {
                    for (var i = 0, l = graphData.length; i < l; i++) {
                        if(i > 0) {
                            redirectLinkArray.push(graphData[i][graphData[i].length - 1]);
                        }
                        graphData[i].splice(redirectLinkIndex,1);
                    }
                }
            }
            var data = new google.visualization.arrayToDataTable(graphData);
             // find max for all columns to set top vAxis number
            var maxVaxis = 0;
            for (var i = 1; i < data.getNumberOfColumns(); i++) {
              if (data.getColumnType(i) === 'number') {
                maxVaxis = Math.max(maxVaxis, data.getColumnRange(i).max);
              }
            }
            var chartArea = {};
            if(graphContainer == "leadStageContainer") {
               chartArea = {'width': '72%', 'left':'22%', 'height':'100%'};
            }else if(graphContainer == "applicationStageContainer") {
               chartArea = {'width': '72%', 'left':'22%', 'height':'100%'};
            }
            else if(graphContainer == "leadSubStageContainer") {
                var height = '100%';
                if(graphData.length <= 15) {
                    height = (graphData.length * 5) + '%';
                }
               chartArea = {'width': '42%', 'left':'38%', 'height':height};
            }            
            var options = {
                title:'',
                legend: { position: 'none' },
                bars: 'vertical',
                vAxis: {format: 'decimal',minValue:0,maxValue: maxVaxis + maxVaxis/6,},
                height: 280,
                width : '100%',
                'chartArea': chartArea,
                colors: ['#00b0f0','#ffc000', '#92d050', '#ff3399'],
                annotations: { alwaysOutside: true, textStyle: { color:'#111',fontSize:12 }}, 
                series: {
                    0: { annotations: { stem: { length: 20 } }  },
                    1: { annotations: { stem: { length: 2  } }  },
                    2: { annotations: { stem: { length: 20 } }  },
                    3: { annotations: { stem: { length: 2  } }  }
                }
              };

           var chart = new google.visualization.BarChart(document.getElementById(graphContainer));
           //google.visualization.events.addListener(chart, 'ready', AddNamespaceHandler);
           google.visualization.events.addListener(chart, 'select', function() {
                var selectedItem = chart.getSelection()[0];
                if (selectedItem && typeof redirectLinkArray[selectedItem.row] != "undefined") {
                    window.open(redirectLinkArray[selectedItem.row], "_blank");
                }
           });
           chart.draw(data, options);
        }
    }
}

function drawCounsellorWiseBarChart(title,chart_div,arr_chart_data) {
    //console.log(arr_chart_data);
    var data = new google.visualization.arrayToDataTable(arr_chart_data);
     // find max for all columns to set top vAxis number
    var maxVaxis = 0;
    for (var i = 1; i < data.getNumberOfColumns(); i++) {
      if (data.getColumnType(i) === 'number') {
        maxVaxis = Math.max(maxVaxis, data.getColumnRange(i).max);
      }
    }
    var length = (arr_chart_data.length -1 );
    if(length > 5){
        var grpWidth = "65%";
    }else if(length >= 3) {
        var grpWidth = "35%";
    }else{
        var grpWidth = "15%";
    }
    var options = {
        title:title,
        legend: { position: 'top', maxLines: 3, alignment:'center' },
        bars: 'vertical',
        vAxis: {format: 'decimal',maxValue: maxVaxis + maxVaxis/6,},
        height: 380,
        bar: {groupWidth: grpWidth},
        width : '100%',
		chartArea: {left:'5%',top:'10%', width:'90%',height:'80%'},
        colors: ['#00b0f0','#ffc000', '#92d050', '#ff3399'],
        annotations: { alwaysOutside: true,textStyle: { color: '#000',fontSize:12 }}, 
        series: {
            0: { annotations: { stem: { length: 20 } }  },
            1: { annotations: { stem: { length: 2  } }  },
            2: { annotations: { stem: { length: 20 } }  },
            3: { annotations: { stem: { length: 2  } }  }
        },
		hAxis: { 
			textStyle : {
				fontSize: 13 // or the number you want
			}
		}
      };

   var chart = new google.visualization.ColumnChart(document.getElementById(chart_div));
   google.visualization.events.addListener(chart, 'ready', AddNamespaceHandler);
   chart.draw(data, options);
}

function getEventList(){
    $.ajax({
        url : jsVars.getEventDetailLink,
        type : 'post',
        data : {counsellor_id : $("#counsellor_id").val(),date_range : $("#date_range").val(),counsellorIds:$("#counsellorIds").val()},
        dataType : 'json',
        headers : {
             "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            loaderCount++;
            $('#leadDetailsLoader').show();
        },
        complete: function () {
            loaderCount--;
            if(loaderCount==0){
                $('#leadDetailsLoader').hide();
            }
        },
        success : function(json){
            $('#calendar').fullCalendar({
                header: {
                    right: ' ',
                    left: 'title',
                    center: 'prev,next'
                },
                height: 460,
                viewRender: function (view, element) {
                    //The title isn't rendered until after this callback, so we need to use a timeout.
                    window.setTimeout(function(){
                        var time = $("#calendar").find('.fc-toolbar > div.fc-left > h3').text();
                            time = $.trim(time);
                            globalTime =  time;  
                            var MonthYear = time.split(" ");
                            if(MonthYear[0] != "Follow-up"){
                                var eventTime   = new Date(view.currentRange.start);
                                var today       = new Date();
                                var eventDate   = new Date(eventTime.getFullYear(),eventTime.getMonth(),eventTime.getDate());
                                var currentDate = new Date(today.getFullYear(),today.getMonth(),'01');
                                var MonthYear = time.split(" ");
                                if($("#followupActivityDiv").is(":visible")){
                                    if(eventDate.getTime() == currentDate.getTime()){
                                        $(".fc-prev-button").prop('disabled', true); 
                                        $(".fc-prev-button").addClass('fc-state-disabled'); 
                                    }else{
                                        $(".fc-prev-button").removeClass('fc-state-disabled'); 
                                        $(".fc-prev-button").prop('disabled', false); 
                                    }
                                }
                                $("#calendar").find('.fc-toolbar > div.fc-left > h3').empty().append(
                                    "Follow-up Calendar ("+MonthYear[0] + ", " + MonthYear[1] + ")"
                                );
                                if(eventDate >= currentDate){
                                    //$("#calendar").find('.fc-toolbar > div.fc-left').append($("#calendar").find('.fc-toolbar > div.fc-center').html());
                                    //$("#calendar").find('.fc-toolbar > div.fc-center').empty();
                                    if ($('#followupActivityDiv').css('display') == 'none') {
                                        $("#calendar").find('.fc-toolbar > div.fc-right').empty().append("<a style='' class='btn btn-info center-btn' onclick='showFollowUpActivities(\""+time+"\","+eventDate.getTime()+","+currentDate.getTime()+");' id='followUpActivityBtn' href='javascript:void(0);'>List View</a>");
                                    }
                                }else{
                                    $("#calendar").find('.fc-toolbar > div.fc-right').empty();
                                }
                            }
                    },0);
                },
                eventClick: function(calEvent, jsEvent, view) {
                    var eventDate   = new Date(calEvent.start);
                    var today       = new Date();
                    var currentDate = new Date(today.getFullYear(),today.getMonth(),today.getDate());
                    if(eventDate >= currentDate){
                        if($("#isCounsellor").val() == "1" || $.trim($("#counsellor_id").val()) != ""){
                            var dt = calEvent.start;
                            $("#popupdiv").show();
                            //$("#calanderDiv").hide();
                            getEventListdateWiseDeatil(dt);
                        }
                    }                    
                },
                eventRender: function(event, element, view) {
                    var ntoday      = new Date().getTime();
                    var eventStart  = new Date(event.start).getTime();
                    if (eventStart < ntoday){
                        element.css('background-color',"grey");
                        element.children().css('background-color',"grey");
                    }
                },
                editable: false,
                events: json
            });
        },
        error : function(xhr, ajaxOptions, thrownError){
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#calendar').fullCalendar( 'refetchEvents' );
        }
    });
}

function refreshEventList(){
    $.ajax({
        url : jsVars.getEventDetailLink,
        type : 'post',
        data : {counsellor_id : $("#counsellor_id").val(),date_range : $("#date_range").val(),counsellorIds:$("#counsellorIds").val()},
        dataType : 'json',
        headers : {
             "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            loaderCount++;
            $('#leadDetailsLoader').show();
        },
        complete: function () {
            loaderCount--;
            if(loaderCount==0){
                $('#leadDetailsLoader').hide();
            }
        },
        success : function(json){
            $('#calendar').fullCalendar('addEventSource',{
                events: json
            });
            showCalanderView();
        },
        error : function(xhr, ajaxOptions, thrownError){
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('#calendar').fullCalendar( 'refetchEvents' );
        }
    });
}


function getLeadsDetail(){
    $.ajax({
        url : jsVars.getLeadsDetailLink,
        type : 'post',
        data : {counsellor_id : $("#counsellor_id").val(),date_range : $("#date_range").val(),counsellorIds:$("#counsellorIds").val()},
        dataType : 'json',
        headers : {
             "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            loaderCount++;
            $('#leadDetailsLoader').show();
        },
        complete: function () {
            loaderCount--;
            if(loaderCount==0){
                $('#leadDetailsLoader').hide();
            }
        },
        success : function(json){
            if (json['redirect']){
                location = json['redirect'];
            }else if (json['error']){
//                alertPopup(json['error'], 'error');
                  $('.counsellor_error').show();
            }else if (json['dataList'] != undefined) {
                var totalLead = 0;
                if(typeof json.dataList==='object'){
                    for(var property in json.dataList){
                        if(property != 0){
                            totalLead   += parseInt(json.dataList[property][1]);
                        }
                    }
                }
                //$("#totalLeads").html(totalLead);
                //drawStageChart(json.dataList, 'leadStatsContainer');
                drawStageBarChart(json.dataList, 'leadStatsContainer');
            }
        },
        error : function(xhr, ajaxOptions, thrownError){
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function getEventListdateWiseDeatil(date){
    var timestamp = new Date(date).getTime();
    $.ajax({
        url : jsVars.getEventListDateWiseDetailLink,
        type : 'post',
        data : {counsellor_id : $("#counsellor_id").val(),date_range : timestamp,counsellorIds:$("#counsellorIds").val()},
        dataType : 'html',
        headers : {
             "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            loaderCount++;
            $('#leadDetailsLoader').show();
        },
        complete: function () {
            loaderCount--;
            if(loaderCount==0){
                $('#leadDetailsLoader').hide();
            }
        },
        success : function(html){
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
            }else{
                html    = html.replace("<head/>", "");
                $('#eventDetailDiv').html(html);
            }
        },
        error : function(xhr, ajaxOptions, thrownError){
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function getActivityLogs(listingType){
    if(listingType === 'reset'){
        $("#activityPage").val(1);
    }
    var counsellorName = "";
    if($("#counsellor_id option:selected").val() != ""){
        counsellorName = $("#counsellor_id option:selected").text();
    }
    $.ajax({
        url : jsVars.getCounsellorActivitiesLink,
        type : 'post',
        data : {counsellorId : $("#counsellor_id").val(), 'page':$("#activityPage").val(),counsellorName :counsellorName },
        dataType : 'html',
        headers : {
             "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            loaderCount++;
            $('#leadDetailsLoader').show();
        },
        complete: function () {
            loaderCount--;
            if(loaderCount==0){
                $('#leadDetailsLoader').hide();
            }
        },
        success : function(html){
                var checkError  = html.substring(0, 6);
                if (html === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else if (checkError === 'ERROR:'){
                    alert(html.substring(6, html.length));
                }else{
                    html    = html.replace("<head/>", "");
                    var countRecord = countResult(html);
                    if(listingType === 'reset'){
                        $("#activityLogsDiv").html(html);
                    }else{
                        $('#activityLogsDiv').find("ul").append(html);
                    }
                    if(countRecord < 10){
                        $('#LoadMoreActivity').hide();
                    }else{
                        $('#LoadMoreActivity').show();
                    }
                    $("#activityPage").val(parseInt($("#activityPage").val())+1);
                }
        },
        error : function(xhr, ajaxOptions, thrownError){
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function countResult(html){
    var len = (html.match(/activityMsg/g) || []).length;
    return len;
}

function getFollowupActivityLogs(date, showloader){
    if(typeof date==="undefined"){
        date    = null;
    }
    if(typeof showloader==="undefined"){
        showloader    = 0;
    }
    $.ajax({
        url : jsVars.getFollowupActivitiesLink,
        type : 'post',
        data : {counsellorId : $("#counsellor_id").val(),date:date},
        dataType : 'html',
        headers : {
             "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            if(showloader == '1'){
                loaderCount++;
                $('#leadDetailsLoader').show();
            }
        },
        complete: function () {
            if(showloader == '1'){
                loaderCount--;
                if(loaderCount==0){
                    $('#leadDetailsLoader').hide();
                }
            }
            
        },
        success : function(response){
             if (response === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else{
                $("#followupActivity").html(response);
            }
        },
        error : function(xhr, ajaxOptions, thrownError){
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function showFollowUpActivities(date,eventTime,currentTime){
     if ($('#followupActivityDiv').css('display') == 'none') {
        if(eventTime == currentTime){
            $(".fc-prev-button").prop('disabled', true); 
            $(".fc-prev-button").addClass('fc-state-disabled'); 
        }else{
            $(".fc-prev-button").removeClass('fc-state-disabled'); 
            $(".fc-prev-button").prop('disabled', false); 
        }
        getFollowupActivityLogs(date,1);
        var text = $("#calendar .fc-toolbar > div > h3").html();
            text = text.replace(" Calendar"," Activity");
        $("#calendar .fc-toolbar > div > h3").html(text);
        $("#followUpActivityBtn").html("Calender View");
        $("#calanderDiv .fc-view-container").hide();
        $("#followupActivityDiv").show();
    }else{
        $(".fc-prev-button").removeClass('fc-state-disabled'); 
        $(".fc-prev-button").prop('disabled', false); 
        
        $("#followUpActivityBtn").html("List View");
//        $("#calendar").find('.fc-toolbar > div > h3')
        var text = $("#calendar .fc-toolbar > div > h3").html();
            text = text.replace(" Activity"," Calendar");
        $("#calendar .fc-toolbar > div > h3").html(text);
        $("#followupActivityDiv").hide();
        $("#calanderDiv .fc-view-container").show();
    }
	
	window.dispatchEvent(new Event('resize'));
}

function AddNamespaceHandler(id){
  var svg = jQuery('svg');
  svg.attr("xmlns", "http://www.w3.org/2000/svg");
  svg.css('overflow','visible');
}

$(document).on('click','.fc-next-button', function () {
    if($("#followupActivityDiv").is(":visible")){
        window.setTimeout(function(){
            getFollowupActivityLogs(globalTime);
        },12);
    }
});
$(document).on('click','.fc-prev-button', function () {
    if($("#followupActivityDiv").is(":visible")){
        window.setTimeout(function(){
            getFollowupActivityLogs(globalTime);
        },12);
    }
});

function showCalanderView(){
    $("#followUpActivityBtn").html("List View");
    var text = $("#calendar .fc-toolbar > div > h3").html();
        text = text.replace(" Activity"," Calendar");
    $("#calendar .fc-toolbar > div > h3").html(text);
    $("#followupActivityDiv").hide();
    $("#calanderDiv .fc-view-container").show();
}

$(document).on('click', '.ivr-log-details', function(){
    var mongoid = $(this).data('mid');
    var cid = $(this).attr('title');
    var vender = $(this).data('vender');
    if(typeof mongoid !='undefined' && mongoid!=''){
        $.ajax({
            url: jsVars.getIvrDetailsLink,
            data: {mongoId: mongoid,collegeId: cid,vender:vender},
            dataType: "html",
            async: false,
            cache: false,
            type: "POST",
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('#leadDetailsLoader').show();
                $("#ConfirmPopupArea").modal('hide');
            },
            complete: function () {
                $('#leadDetailsLoader').hide();
            },
            success: function (data) {
                if (data === 'session_logout'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }
                data = data.replace("<head/>", '');
                $('#ActivityLogPopupArea .modal-title').html('Call Logs');
                $('#ActivityLogPopupHTMLSection').html(data);
                $('#ActivityLogPopupArea').modal({backdrop: 'static', keyboard: false});
                $('#ActivityLogPopupArea .modal-header').css('background-color', '#a0c348');
                $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
                $('#ActivityLogPopupArea .modal-dialog').css('width', '600px');
            },
            error: function (response) {
                alertPopup(response.responseText);
            },
            failure: function (response) {
                alertPopup(response.responseText);
            }
        });
    }else{
        alertPopup('Id not found');
    }
});

//Download Counsellor Charts
function downloadCounsellorChart(chartName) 
{
    var data = {};
    if(chartName == 'CounsellorWiseLeadAndApplicationCount') {
        data['chartName'] = chartName;
        data['counsellorId'] = $("#sourcePublisher").val();
    }
    else if (chartName == 'LeadEngagementChart') {
        data['chartName'] = chartName;
        data['dateRange'] = $('#date_range').val();
        data['counsellorId'] = $("#counsellor_id").val();
        var rangeType   = $('.parent-graph-tab li a.active').text();
        data['rangeType'] = rangeType;
    }
    //hit ajax function
    hitCounsellorChartDownloadAjax(data);
}

function hitCounsellorChartDownloadAjax(data)
{
    $.ajax({
        url: jsVars.downloadCounsellorGraphDataLink,
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $('#leadDetailsLoader').show();
        },
        complete: function () {
            $('#leadDetailsLoader').hide();
        },
        success: function (json) { 
            $('#leadDetailsLoader').hide();
            if(json['error']) {
                alert(json['error']);
            }
            else if(json['location']) {
                location = json['location'];
            }
            //download
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/**
 * ajax for load counsellor productivity data
 * @returns {undefined}
 */
function loadProductivityReport(callType,filterId = null){
    
    if(typeof callType != 'undefined' && callType=='filter'){
        var serializeData = $('#counsellorProductivityReport').serializeArray()
    }
    else{
        var serializeData = {};
    }
    
    if(filterId !== null) {
        if(filterId == 'default') {
            var serializeData = [{}];
        }
        serializeData.push({name: "saved_filter_id", value: filterId});
    }
    
    $('#reg_chart_div').html('<img src="/img/line_no_data_image.jpg" class="img-responsive" alt="No Data">');
     $.ajax({
        url: jsVars.loadCounsellorProductivityDataLink,
        type: 'post',
        data: serializeData,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#viewLeadProdReports').prop('disabled',true);
            loaderCount++;
            $('#leadDetailsLoader').show();
        },
        complete: function () {
            loaderCount--;
            if(loaderCount==0){
                $('#leadDetailsLoader').hide();
            }
        },
        success: function (response) { 
            $('#viewLeadProdReports').prop('disabled',false);
            if(response=='session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(response!=''){
                $('#ApplicationProductivityReportHtml').html('');
                $('#ProductivityReportHtml').html(response);
            }
            sumoDropdown();
            showHideStageDD();
            $('.offCanvasModal').modal('hide');
			table_fix_rowcol();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


$(document).on('click',"#viewApplicationLists", function(){
    loadApplicationProductivityReport('filter');
});

$(document).on('click',"#viewLeadProdReports", function(){
    loadProductivityReport('filter');
});

function loadApplicationProductivityReport(callType,filterId = null){
    
    if(typeof callType != 'undefined' && callType=='filter'){
        var serializeData = $('#counsellorApplicationProductivityReport').serializeArray()
    }
    else{
        var serializeData = {};
    }
    
    if(filterId !== null) {
        if(filterId == 'default') {
            var serializeData = [{}];
        }
        serializeData.push({name: "saved_filter_id", value: filterId});
    }
    
    $('#reg_chart_div').html('<img src="/img/line_no_data_image.jpg" class="img-responsive" alt="No Data">');
     $.ajax({
        url: jsVars.applicationCounsellorProductivityDataLink,
        type: 'post',
        data: serializeData,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            loaderCount++;
            $('#leadDetailsLoader').show();
            $('#viewApplicationLists').prop('disabled',true);
        },
        complete: function () {
            loaderCount--;
            if(loaderCount==0){
                $('#leadDetailsLoader').hide();
            }
        },
        success: function (response) { 
            $('#viewApplicationLists').prop('disabled',false);
            if(response=='session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(response!=''){
                $('#ProductivityReportHtml').html('');
                $('#ApplicationProductivityReport').show();
                $('#ApplicationProductivityReportHtml').html(response);
            }
            sumoDropdown();
            $('.offCanvasModal').modal('hide');
            showHideApplicationStageDD();
			table_fix_rowcol();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getInfoPopup(){
    var html = $('#popupContentText').html();
    $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
    $('#ActivityLogPopupArea #alertTitle').text('Counsellor Productivity Reports');
    $('#ActivityLogPopupHTMLSection').html(html);
    $('#ActivityLogPopupLink').trigger('click');
}

function exportProductivityData(){
    var $form = $("#counsellorProductivityReport");
    $form.attr("action",jsVars.exportProductivityDataLink);
    $form.attr("target",'modalIframe');
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    $('#myModal').modal('show');
    $form.submit();
    $form.attr("onsubmit",onsubmit_attr);
    $form.removeAttr("target");
}

function exportApplicationProductivityData(){
    var $form = $("#counsellorApplicationProductivityReport");
    $form.attr("action",jsVars.exportApplicationProductivityDataLink);
    $form.attr("target",'modalIframe');
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    $('#myModal').modal('show');
    $form.submit();
    $form.attr("onsubmit",onsubmit_attr);
    $form.removeAttr("target");
}

var downloadDetailReportFile = function(url){
    window.open(url, "_self");
};


$(document).ready(function () {
  
        $(document).on('click', '#counsellorProductivityReport .btnOk', function() {
            if($('#columnFields').val()==null){
               alertPopup('Please select atleast one column','error');
               $('#ErroralertTitle').html('Mandatory Alert');
            }
            else{
                loadProductivityReport('filter');
            }
        });

        $(document).on('change', '#columnFields', function() {
                showHideStageDD();
                showHideApplicationStageDD();
            });
        
        $(document).on('click', '#leads', function() {
            $currentSelectedTab = 'lead';
            loadProductivityReport();
        });
        
        $(document).on('click', '#applications', function() {
            $currentSelectedTab = 'application';
            loadApplicationProductivityReport();
        });
        
    }); 
   
    $(document).on('sumo:opening', '#columnFields', function() {
//        $('#columnFields')[0].sumo.selectAll();
//         $('.sumo_stagesCols').show();
    });
    
    
function showHideStageDD(){
    if($currentSelectedTab === "application") {
        return;
    }
    if($('#counsellorProductivityReport #columnFields').length>0){
       var columnFields =  $('#counsellorProductivityReport #columnFields').val();
    }
    if(columnFields == null || columnFields == '' || columnFields.indexOf('LeadStageChanged')<0){
        $("#counsellorProductivityReport #stagesCols option:selected").prop("selected", false);
        if(typeof sumo !='undefined'){
            $('#counsellorProductivityReport #stagesCols')[0].sumo.reload();
        }
        $('.sumo_stagesCols').hide();
    }
    else{
        $('.sumo_stagesCols').show();
    }
    
}

function showHideApplicationStageDD(){
    if($currentSelectedTab === "lead") {
        return;
    }
    if($('#counsellorApplicationProductivityReport #columnFields').length>0){
       var columnFields =  $('#counsellorApplicationProductivityReport #columnFields').val();
    }
    
    if(columnFields == null || columnFields == '' || columnFields.indexOf('ApplicationStageChanged')<0){
        $("#counsellorApplicationProductivityReport #stagesCols option:selected").prop("selected", false);
        if(typeof sumo !='undefined'){
            $('#counsellorApplicationProductivityReport #stagesCols')[0].sumo.reload();
        }
        $('.sumo_stagesCols').hide();
    }
    else{
        $('.sumo_stagesCols').show();
    }
    
}

function sumoDropdown() {
    $('#counsellorProductivityReport').find('.sumo_select').each(function () {
        this.selected = false;
        id = $(this).attr('id');
        if (id !== 'items-no-show') {
            placeholder = $(this).data('placeholder');
            $('#' + id).SumoSelect({
                placeholder: placeholder, 
                search: true, 
                searchText: placeholder, 
                triggerChangeCombined: false,
//                okCancelInMulti:true,
//                isClickAwayOk : true
            });

            $('#' + id)[0].sumo.reload();
        }
    });
    
    $('#counsellorApplicationProductivityReport').find('.sumo_select').each(function () {
        this.selected = false;
        id = $(this).attr('id');
        if (id !== 'items-no-show') {
            placeholder = $(this).data('placeholder');
            $('#' + id).SumoSelect({
                placeholder: placeholder, 
                search: true, 
                searchText: placeholder, 
                triggerChangeCombined: false,
                //okCancelInMulti:true,
                //isClickAwayOk : true
            });

            $('#' + id)[0].sumo.reload();
        }
    });
}

function getAllApplicationStage(cid, fid) {
    
     $.ajax({
        url: '/counsellors/getApplicationStages',
        type: 'post',
        data: {'form_id':fid,'college_id':cid},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            loaderCount++;
            $('#leadDetailsLoader').show();
        },
        complete: function () {
            loaderCount--;
            if(loaderCount==0){
                $('#leadDetailsLoader').hide();
            }
        },
        success: function (response) {
            var responseObject = $.parseJSON(response); 
            if(responseObject.status==200) {
                var options = "<option value=''>Select Application Stage</option>";
                $.each(responseObject.data, function (index, item) {
                    options += "<option value='"+index+"'>"+item+"</option>";
                });
                $("#stagesCols").html(options);
                $('#stagesCols')[0].sumo.reload();
            }
			//$('.offCanvasModal').modal('show');
            //filterOpen();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}