var loaderCount = 0;
$(document).ready(function(){
    $('#stagesAndSteps').SumoSelect({okCancelInMulti:true, search: true, searchText:'Search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
    last_valid_selection    = $('#stagesAndSteps').val();
    $('#stagesAndSteps').on('change', function(evt) {
        if ($('#stagesAndSteps').val() != null && $('#stagesAndSteps').val().length > 10) {
            alert('Max 10 selections allowed!');
            var $this = $(this);
            var optionsToSelect = last_valid_selection;
            $this[0].sumo.unSelectAll();
            $.each(optionsToSelect, function (i, e) {
                $this[0].sumo.selectItem($this.find('option[value="' + e + '"]').index());
            });
            last_valid_selection    = optionsToSelect;
        } else if($('#stagesAndSteps').val() != null){
            last_valid_selection = $(this).val();
        }
    });
    $(".sumo_sourcePublisher p.btnOk").click(function(){
        stageWiseApplicationGraph();
    });
    google.charts.load("current", {packages: ["corechart"]});
    google.charts.setOnLoadCallback(function(){
        stageWiseApplicationGraph();
        drawModeWiseApplicationGraph();
    });
});

function stageWiseApplicationGraph() 
{
    $('#applicationBarGraphDiv').html('<img src="/img/line_no_data_image.jpg" class="img-responsive" alt="No Data">');
    
    $.ajax({
        url: jsVars.stageWiseApplicationGraphLink,
        type: 'post',
        data: {'stages':$("#stagesAndSteps").val()},
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
                            console.log(responseObject.data.graphData);
                            drawStageWiseApplicationGraph("",'applicationBarGraphDiv', responseObject.data.graphData);
                        }
                    }
                }
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alert(responseObject.message);
                }
            }
            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function drawStageWiseApplicationGraph(title,chart_div,arr_chart_data) {
    console.log(arr_chart_data);
    var data = new google.visualization.arrayToDataTable(arr_chart_data);
     // find max for all columns to set top vAxis number
    var maxVaxis = 0;
    for (var i = 1; i < data.getNumberOfColumns(); i++) {
      if (data.getColumnType(i) === 'number') {
        maxVaxis = Math.max(maxVaxis, data.getColumnRange(i).max);
      }
    }
    var length = (arr_chart_data.length -1 );
    if(length > 8){
        var grpWidth = "65%";
    }else if(length >= 5) {
        var grpWidth = "55%";
    }else if(length >= 3) {
        var grpWidth = "35%";
    }else if(length >= 2) {
        var grpWidth = "25%";
    }else{
        var grpWidth = "15%";
    }
    var options = {
        title:title,
        legend: { position: 'none' },
        bars: 'vertical',
        vAxis: {format: 'decimal',maxValue: maxVaxis + maxVaxis/6,},
        height: 400,
        bar: {groupWidth: grpWidth},
        width : '100%',
        colors: ['#00b0f0','#ffc000', '#92d050', '#ff3399'],
        annotations: { alwaysOutside: true,textStyle: { color: '#000',fontSize:12 }}, 
        series: {
            0: { annotations: { stem: { length: 20 } }  },
            1: { annotations: { stem: { length: 2  } }  },
            2: { annotations: { stem: { length: 20 } }  },
            3: { annotations: { stem: { length: 2  } }  }
        },
        chartArea:{left:'6%',top:'10%',width:'90%',height:'65%'},
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


function drawModeWiseApplicationGraph(){
    
    $("#applicationPieDiv").html("");
    $.ajax({
        url: jsVars.modeWiseWiseApplicationGraphLink,
        type: 'post',
        data: {'type':'both'},
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
                    google.charts.setOnLoadCallback(function() { 
                        drawApplicationPieChart('Application Break-up', responseObject.data.graphData,'applicationPieDiv'); 
                    });
                    $("#totalApplicationCount").html('<strong style="vertical-align: bottom;">'+new Intl.NumberFormat().format(responseObject.data.totalApplications)+'</strong>');
                }
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alert(responseObject.message);
                }
            }
            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
    
}


function drawApplicationPieChart(title, graphData, graphContainer){
    if(typeof graphData === "object"){
        
        if ($.isEmptyObject(graphData)) {
            $('#'+graphContainer).html('<img src="/img/donut_no_data_image.jpg">')
        } else {
//            var headerTitle = title + " : <strong>"+totalLeads+"</strong>";
            var docClientWid = document.documentElement.clientWidth;
//            var legendPos = "bottom";
//            var chartAreaHeight = "80%";
//            var chartAreaTop = "2%";
//            var chartAreaLeft = "0";
//            var chartAreaWidth = "100%"
				var legendPos = "right";
				var chartAreaHeight = "90%";
				var chartAreaTop = "5%";
				var chartAreaLeft = "5%";
				var chartAreaWidth = "80%"
            var headerTitle = title ;
            $('#'+graphContainer+"_header").html(headerTitle);
            var data =  new google.visualization.arrayToDataTable(graphData);
            
            var options = {
                //title: title,
                //titleTextStyle: {'color':'#333', 'fontSize':18, 'bold':false},
                pieSliceText: 'none',
//                width: 714,
//                height: 600,
                width: '100%',
                height: 200,
                pieHole: 0.5,
                chartArea:{left:chartAreaLeft,top:chartAreaTop,width:chartAreaWidth,height:chartAreaHeight},
                colors: ['#00b0f0','#ffc000', '#ff3399', '#92d050'],
                legend: {'position':legendPos, 'alignment':'center', textStyle: {fontSize: 14,lineHeight:25}},
                pieSliceText: 'percentage',
                tooltip: { trigger: 'selection', isHtml: true  }
               
            };

            var chart = new google.visualization.PieChart(document.getElementById(graphContainer));
            google.visualization.events.addListener(chart, 'ready', AddNamespaceHandler);
            google.visualization.events.addListener(chart, 'onmouseover', function(entry) {
               chart.setSelection([{row: entry.row}]);
            });
            google.visualization.events.addListener(chart, 'onmouseout', function(entry) {
                chart.setSelection([]);
            });   
         
            chart.draw(data, options);
            //$("#"+graphContainer).append('<span class="graphInfo">*NA - Device type not available.</span>');
          
        }
    }
}

