
/*
 * crate leanear graph using param
 * @param json array
 * json['content'] is full rows array ['date'=> '2017-01-10', 'count' => 374, 'tooltip'=> '10 Jan to 21st March'],
 * json['title'] is string
 * json['hAxis_title'] is string
 * json['vAxis_title'] is string
 * json['id_container'] is id for render display graph
 * json['pointSize'] is id for render point size
 * add below code on ajax success
 * google.charts.load('current', {'packages': ['corechart', 'line']});
 */
function makeLinearGraph(json) {
    if(json['content'].length == 0) {
       $('#'+json['id_container']).html('<h4 class="text-danger text-center" style="padding:40px">Data Not Found</h4>');
       $("#rangeTab").hide();
       $('.graph-footer-msg').remove();
    } else {
        google.charts.load('current', {
            callback: function () {
            var data = new google.visualization.DataTable();
            data.addColumn('date', json['hAxis_title']);
            data.addColumn('number', json['vAxis_title']);
            // A column for custom tooltip content
            data.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
            var rowsDate = [];
            $.each(json['content'], function (index, value) {
                var d = new Date(value.date);
                d.setTime( d.getTime() + d.getTimezoneOffset()*60000 ); // adding for match date pointer
                rowsDate.push([d, parseInt(value.count), value.tooltip]);
            });
            data.addRows(rowsDate);
            var linearOptions = {
                //title: json['title'],
                titlePosition: 'none',
                tooltip: {isHtml: true},
                legend: 'none',
                pointSize: json['pointSize'],
                height: 500,
                hAxis: {title: json['hAxis_title'], type: json['hAxisType']},
                vAxis: {title: json['vAxis_title'], viewWindow:{min:0}}
            };
            var linearChart = new google.visualization.LineChart(document.getElementById(json['id_container']));
            google.visualization.events.addListener(linearChart, 'ready', downloadGraphAPI);
            
            google.visualization.events.addListener(linearChart, 'ready', function () {
                var imageId = 'img-'+json['id_container'];
                $('#pdf-'+json['id_container']+' h3.date-range').text(json['pdf_center']);
                $('#pdf-'+json['id_container']+' h3.trend-type-text').text(json['pdf_h3']);
                $("#"+imageId).remove();
                png = '<img id ="'+imageId+'" src="' + linearChart.getImageURI() + '"/>';
                $('#pdf-'+json['id_container']).append(png);
            });
            linearChart.draw(data, linearOptions);
        },
        'packages': ['corechart', 'line']
        });
    }
    if($('#data-tab-container').length) {
        makeScrollable();
    }
}

/*
 * crate column graph using param
 * @param json array
 * json['content'] is full rows array ['Publisher', 'Primary', 'Secondary', 'Tertiary'],
 * json['title'] is string
 * json['hAxis_title'] is string
 * json['vAxis_title'] is string
 * json['id_container'] is id for render display graph
 * add below code on ajax success
 * google.charts.load('current', {'packages': ['corechart']});
 */
function makeColumnBarGraph(json) {
    $('#'+json['id_container']).html('');
	if(typeof json['height'] != 'undefined') {
		var columnheight = parseInt(json['height']);
	} else {
		var columnheight = 500;
	}
        if(typeof json['legend']!='undefined'){
            var legend = json['legend'];
        }else{
            legend='none';
        }
        var isStacked=false;
        if(typeof json['isStacked']!='undefined'){
            isStacked = json['isStacked'];
        }
        
    google.charts.load('current', {
        callback: function () {
        var data = google.visualization.arrayToDataTable(json['content']);
        var options = {
            //title: json['title'],
            titlePosition: 'none',
            vAxis: {title: json['vAxis_title'], viewWindow:{min:0}},
            hAxis: {title: json['hAxis_title'], textStyle: { fontSize: '14'}},
            seriesType: 'bars',
            height: columnheight,
            legend: { position: legend },
            tooltip: {isHtml: true},
            style: { color: 'red' },
            isStacked:isStacked
        };
        
        //legend_colors
        if(typeof json['legend_colors']!='undefined'){
            legend_colors = json['legend_colors'];
            options.colors=legend_colors;
        }
        
        $('#'+json['id_container'] + ' h3').remove();
        if($('#'+json['id_container']).parent().find('h3.columnGraphTitle').length){
            $('#'+json['id_container']).parent().find('h3.columnGraphTitle').remove();
        }
        if(typeof json['title'] != 'undefined' && json['title']!='') {
            $('#'+json['id_container']).parent().prepend('<h3 class="columnGraphTitle">'+json['title']+'</h3>');
        }
        var columnChart = new google.visualization.ComboChart(document.getElementById(json['id_container']));
        google.visualization.events.addListener(columnChart, 'ready', downloadGraphAPI);
        
        var imageId = 'img-'+json['id_container'];
        google.visualization.events.addListener(columnChart, 'ready', function () {
            $("#"+imageId).remove();
            $('#pdf-'+json['id_container']+' h3').text(json['pdf_h3']);
            png = '<img id ="'+imageId+'" src="' + columnChart.getImageURI() + '"/>';
            $('#pdf-'+json['id_container']).append(png);
        });
        columnChart.draw(data, options);
    },
    'packages':['corechart']
    });
}

/*
 * crate bar graph using param
 * @param json array
 * json['content'] is full rows array ['Publisher', 'Primary', 'Secondary', 'Tertiary'],
 * json['title'] is string
 * json['hAxis_title'] is string
 * json['vAxis_title'] is string
 * json['id_container'] is id for render display graph
 * add below code on ajax success
 * google.charts.load('current', {'packages': ['corechart']});
 */
function makeBarGraph(json) {
    $('#'+json['id_container']).html('');
	if(typeof json['height'] != 'undefined') {
		var columnheight = parseInt(json['height']);
	} else {
		var columnheight = 500;
	}
    google.charts.load('current', {
        callback: function () {
        var data = google.visualization.arrayToDataTable(json['content']);
        var options = {
            title: '',
            legend: { position: 'none' },
            vAxis: {title: json['vAxis_title'], viewWindow:{min:0}},
            hAxis: {title: json['hAxis_title'], textStyle: { fontSize: '14'}},
            height: columnheight,
            colors: ['#00b0f0','#ffc000', '#92d050', '#ff3399'],
            annotations: { alwaysOutside: true, textStyle: { color:'#111',fontSize:12 }}, 
            series: {
                0: { annotations: { stem: { length: 20 } }  },
                1: { annotations: { stem: { length: 2  } }  },
                2: { annotations: { stem: { length: 20 } }  },
                3: { annotations: { stem: { length: 2  } }  }
            }
        };
	if(typeof json['hAxisGridlinesCount'] != 'undefined') {
            options.hAxis.gridlines   = {count:json['hAxisGridlinesCount']};
        }
        $('#'+json['id_container'] + ' h3').remove();
        $('#'+json['id_container']).parent().prepend('<h3>'+json['title']+'</h3>');
        var columnChart = new google.visualization.BarChart(document.getElementById(json['id_container']));
        google.visualization.events.addListener(columnChart, 'ready', downloadGraphAPI);
        
        var imageId = 'img-'+json['id_container'];
        google.visualization.events.addListener(columnChart, 'ready', function () {
            $("#"+imageId).remove();
            png = '<img id ="'+imageId+'" src="' + columnChart.getImageURI() + '"/>';
            $('#pdf-'+json['id_container']).append(png);
        });
        columnChart.draw(data, options);
    },
    'packages':['corechart']
    });
}

function makePieChart(json) {
    
    if (document.documentElement.clientWidth < 767) {
        width="";
    }else{
        if(json['contryEnable'] == '1'){
           width=370; 
        }else{
            width=500; 
        }
        
    }
    google.charts.load('current', {
        callback: function () {
        var type = json['type'];
        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Name');
        data.addColumn('number', 'Count');
        data.addRows(json['content']);
        // Set chart options
        var options = {
            title: json['title']+" : "+json['totalCount'],
            titleTextStyle: {'color':'#333', 'fontSize':14, 'bold':false},
            width: width,
            height: 350,
            pieHole: 0.5,
//            chartArea: {left:'12%'},
            colors: ['#00b0f0', '#ffc000', '#92d050', '#93cddd', '#e46c0a', '#8a56e2', '#e25668', '#e256ae', '#56e2cf', '#e2cf56'],
            legend: {position: 'right','alignment':'center'}, 
            pieSliceText: 'percentage',
            sliceVisibilityThreshold: .000000002,
            tooltip: { trigger: 'selection',isHtml: false}
        };
//        $('#'+json['id_container']).parent().find('h3').remove();
        if(json['clickingvalue'] == 'Others') {
            $('#'+json['id_container']).html('');
        } else {
            $('#'+json['id_container']).html('<h4 class="text-danger">Data Not Found</h4>');
        }
        // Instantiate and draw our chart, passing in some options.
        if(json['content'].length >= 1) {
//            $('#'+json['id_container']).parent().prepend('<h3>'+json['title']+'</h3>');
            var chart = new google.visualization.PieChart(document.getElementById(json['id_container']));
            google.visualization.events.addListener(chart, 'ready', downloadGraphAPI);
            var selectedval = 0;
            if(type != 'none') {
                function selectHandler() {
                    if(type == 'state') {
                        if($('.country_selected_id').length) {
                            var selectedval = $('.country_selected_id').text();
                        }
//                        $('#city-wise-chart-graph').parent().find('h3').remove();
//                        $('#city-wise-chart-graph').html('');
                    }
                    var selectedItem = chart.getSelection()[0];
                    if(typeof selectedItem != 'undefined') {
                        var clickingvalue = data.getValue(selectedItem.row, 0);
                    } else {
                        clickingvalue = json['maxRecordName'];
                    }
                    var collegeId = json['collegeId'];
                    var rangeValue = json['rangeValue'];
                    var publisherId = json['publisherId'];
                    var selectedval = $('.country_selected_id').html();
                    $('#dashboardLoader').show();
                    $.ajax({
                        url: '/publishers/stateWiseLeadsGraphData',
                        type: 'post',
                        dataType: 'json',
                        data: {'collegeId': collegeId, 'rangeValue': rangeValue,'publisherId': publisherId, 'type':type, 'clickingvalue':clickingvalue, 'selectedval':selectedval},
                        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                        success: function (json) {
                            if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                                window.location.href = json['redirect'];
                            } else if (typeof json['success'] != 'undefined' && json['success'] == 200) {
                                makePieChart(json);
                                if(typeof json['selected'] != 'undefined' && type == 'state') {
                                    $('.country_selected_id').text(json['selected']);
                                }
                            }
                            $('#dashboardLoader').hide();
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                        }
                    });
                }
                google.visualization.events.addListener(chart, 'ready', selectHandler);
                google.visualization.events.addListener(chart, 'select', selectHandler);
            }
            var imageId = 'img-'+json['id_container'];
            google.visualization.events.addListener(chart, 'ready', function () {
                $("#"+imageId).remove();
                png = '<img id ="'+imageId+'" src="' + chart.getImageURI() + '"/>';
                $('#pdf-'+json['id_container']).append(png);
            });
            google.visualization.events.addListener(chart, 'select', function () {
//                $("#"+imageId).remove();
//                png = '<img id ="'+imageId+'" src="' + chart.getImageURI() + '"/>';
//                $('#pdf-'+json['id_container']).append(png);
            });
            if(typeof json['pdf_center'] != 'undefined') {
                $('#pdf-country-wise-download .date-range').text(json['pdf_center']);
            }
            chart.draw(data, options);
            chart.setSelection([{row:0}]);
            if(type == 'none'){
                 google.visualization.events.addListener(chart, 'onmouseover', function(entry) {
                    chart.setSelection([{row: entry.row}]);
                 });
                 google.visualization.events.addListener(chart, 'onmouseout', function(entry) {
                    chart.setSelection([]);
                }); 
            }
//            $('.google-visualization-tooltip').hide();
        }
    },
    'packages':['corechart']
    });
}

function downloadGraphAPI(){
  var svg = jQuery('svg');
  svg.attr("xmlns", "http://www.w3.org/2000/svg");
  svg.css('overflow','visible');
}

function downloadGraph(filename){
    
    var id = $("div.download-graph-container:not(:hidden) .find-download-graph" ).attr('id');
    if($('#'+id).css('display') == 'none') {
        alert("Graph not available with selected filters");
       return false; // if graph not available
    }
    options= {};
    options.pageWidth = "15in";
    options.pageHeight = "11in";
    options.pageMargin = ".50in";
    options.filename = filename;
    options.render = 'download';
    if(typeof id != 'undefinded'){
        switch (id) {
            case 'lead-instance-wise-download':
                options.pageWidth = '10in';
                options.pageHeight = '11in';
                break;
            case 'country-wise-download':
                options.pageWidth = '15in';
                options.pageHeight = '11in';
                break;
            default:
            
        }
    }
    if(id != 'campaign-wise-chart-graph'){
        return xepOnline.Formatter.Format('pdf-'+id, options);
    }else{
        alert("No Pdf available for this graph");
//        return xepOnline.Formatter.Format(id, options);
    }
    
}

function printPdf() {
    options= {};
//    options.pageWidth = "15in";
//    options.pageHeight = "11in";
//    options.pageMargin = ".50in";
    options.filename = 'Venue-capacity-graph';
    options.render = 'download';
    return xepOnline.Formatter.Format('pdf-venueCapacityGraph',options);
}

function graphPrint(){
    var elem = $("div.download-graph-container:not(:hidden) .find-download-graph" ).attr('id');
    if($('#'+elem).css('display') == 'none')    {
        alert("Graph not available with selected filters");
       return false; // if graph not available
    }
    title = 'Graph';
    var mywindow = window.open('', 'PRINT', 'height=800,width=600');
    mywindow.document.write('<html><head><title>' + title  + '</title><link rel="stylesheet" type="text/css" href="'+jsVars.FULL_URL+'/css/college/bootstrap.min.css"></head><body>'+document.getElementById(elem).innerHTML+'</body></html>');
    
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
    mywindow.print();
    mywindow.close();
    return true;
}

function makeScrollable(){
    var tabLocation = $('#dashboardContainerSection').offset().top - 30;;
    $('html, body').animate({scrollTop: tabLocation}, 500);
}

function simplePieChart(json) {
    if(json['content'].length == 0) {
       $('#'+json['id_container']).html('<h4 class="text-danger" style="padding:40px">Data Not Found</h4>');
       $("#instanceGraphHeader").hide();
       $('.graph-footer-msg').remove();
    } else {
        if (document.documentElement.clientWidth < 767) {
            width="";
        }else{
            width=500;
        }
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
                height: 350,
                titleTextStyle: {
                    color: '#666',
                    fontSize: '16'
                },
                width: width,
                pieHole: 0.5,
                chartArea: {top:'9%'},
                colors: ['#00b0f0', '#ffc000', '#92d050', '#93cddd', '#e46c0a', '#8a56e2', '#e25668', '#e256ae', '#56e2cf', '#e2cf56'],
                legend: {position: 'bottom','alignment':'center'}
            };
            var chart = new google.visualization.PieChart(document.getElementById(json['id_container']));
            google.visualization.events.addListener(chart, 'ready', downloadGraphAPI);
            var graphType = json['type'];
            if(graphType != 'none'){
                // add Event Lisenetr
                function selectHandler() {

                    var selectedItem = chart.getSelection()[0];
                    if(typeof selectedItem != 'undefined') {
                        var clickingvalue = data.getValue(selectedItem.row, 0);
                    } else {
                        clickingvalue = 'Primary';
                    }
                    var collegeId   = json['collegeId'];
                    var rangeValue  = json['rangeValue'];
                    var publisherId = json['publisherId'];
                    $('#dashboardLoader').show();
                    $.ajax({
                        url: '/publishers/leadsInstanceGraphData',
                        type: 'post',
                        dataType: 'json',
                        data: {'collegeId': collegeId, 'rangeValue': rangeValue,'publisherId':publisherId, 'type':graphType, 'instanceValue':clickingvalue},
                        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                        success: function (json) {
                            if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                                window.location.href = json['redirect'];
                            } else if (typeof json['success'] != 'undefined' && json['success'] == 200) {
                                simplePieChart(json);
                            }
                            $('#dashboardLoader').hide();
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                        }
                    });
                }
                 
                google.visualization.events.addListener(chart, 'ready', selectHandler);
                google.visualization.events.addListener(chart, 'select', selectHandler);
            }
            
            var imageId = 'img-'+json['id_container'];
            google.visualization.events.addListener(chart, 'ready', function () {
                $("#"+imageId).remove();
                png = '<img id ="'+imageId+'" src="' + chart.getImageURI() + '"/>';
                $('#pdf-'+json['id_container']).append(png);
            });
            google.visualization.events.addListener(chart, 'select', function () {
//                $("#"+imageId).remove();
//                png = '<img id ="'+imageId+'" src="' + chart.getImageURI() + '"/>';
//                $('#pdf-'+json['id_container']).append(png);
            });
            chart.draw(data, options);
            chart.setSelection([{row:0}]);
        },
        'packages':['corechart']
        });
    }
}

function makeBarChartGraph(json) {
    $('#'+json['id_container']).html('');
    google.charts.load('current', {
        callback: function () {
            var data = google.visualization.arrayToDataTable(json['content']);
            var options = {
                legend: { position: 'top',alignment:'center' },
                hAxis: {title: json['hAxis_title'],format: 'none'},
                vAxis: {title: json['vAxis_title'], viewWindow:{min:0}},
                colors: ['#00b0f0','#ffc000'],
                height: 500,
                seriesType: 'bars',
                bar: {groupWidth: "30%"},
            };
            $('#'+json['id_container'] + ' h3').remove();
            $('#'+json['id_container']).parent().prepend('<h3>'+json['title']+'</h3>');
            var chart = new google.visualization.ComboChart(document.getElementById(json['id_container']));
            google.visualization.events.addListener(chart, 'ready', downloadGraphAPI);
            var imageId = 'img-'+json['id_container'];
            google.visualization.events.addListener(chart, 'ready', function () {
                $("#"+imageId).remove();
                png = '<img id ="'+imageId+'" src="' + chart.getImageURI() + '"/>';
                $('#pdf-'+json['id_container']).append(png);
            });
            chart.draw(data, options);
        },
    'packages':['corechart']
    });
}

function makeLineCharts(json){
      google.charts.load('current', {
        callback: function () {
            var data = new google.visualization.DataTable();
            data.addColumn('number', json['hTitle']);
            
            for(i=0;i<json['columns'].length;i++){
                data.addColumn('number', json['columns'][i]);
            }
            
            //data.addColumn('number', "A1");
            //data.addColumn('number', "A2");
            //data.addColumn('number', "A3");

            data.addRows(json['content']);
            /*data.addRows([
              
              [7,   7.6, 12.3,  9.6],
              [8,  12.3, 29.2, 10.6],
              [9,  16.9, 42.9, 14.8],
              [10, 12.8, 30.9, 11.6],
              [11,  5.3,  7.9,  4.7],
              [12,  6.6,  8.4,  5.2],
              [13,  4.8,  6.3,  3.6],
              [14,  4.2,  6.2,  3.4]
            ]);*/

        var options = {
      	legend: { position: 'top', alignment: 'start' },
        pointSize: 3,
        lineWidth: 3,
        vAxis: {format: 0,title: 'Count of '+json['title']},
        
        hAxis: {
          title: 'Days from launch of Application',
          format: 0
        },
        format: 'none',
        chart: {
                title: json['title'],
                subtitle: json['sub_title']
              },
              width: '100%',
              height: 500,
        };

      var chart = new google.visualization.LineChart(document.getElementById(json['id_container']));
      chart.draw(data, options);
        },
        'packages':['corechart','line']
    });
}


function drawMatarialBarChart(json) {
    $('#'+json['id_container']).html('');
        
    google.charts.load('current', {
        callback: function () {
        var data = google.visualization.arrayToDataTable(json['content']);
        // find max for all columns to set top vAxis number
        var maxVaxis = 0;
        for (var i = 1; i < data.getNumberOfColumns(); i++) {
          if (data.getColumnType(i) === 'number') {
            maxVaxis = Math.max(maxVaxis, data.getColumnRange(i).max);
          }
        }
        var vAxis = {format: 'decimal',maxValue: maxVaxis + maxVaxis/6};
        if(maxVaxis <= 100 ){
           vAxis = {format: 'decimal',maxValue: maxVaxis + maxVaxis/3};
        }
        
        var length = (json['content'].length -1 );
        if(length > 3){
            var grpWidth = "65%";
        }else if(length > 1) {
            var grpWidth = "35%";
        }else{
            var grpWidth = "15%";
        }
        var newlegend = { position: 'top', maxLines: 3, alignment:'center' };
        if(json['legend'] === 'none'){
            newlegend = { position: 'none' };
        }
        var options = {
            title:'',
            titlePosition: 'none',
            legend: newlegend,
            bars: 'vertical',
            vAxis: vAxis,
            height: 380,
            bar: {groupWidth: grpWidth},
            width : '100%',
            colors: ['#00b0f0','#ffc000','#F9766E','#4FDE2E','#93cddd',"#56e2cf","#e2cf56"],
            annotations: { alwaysOutside: true,textStyle: { color: '#000',fontSize:12 }}, 
            series: {
                0: { annotations: { stem: { length: 20 } }  },
                1: { annotations: { stem: { length: 2  } }  },
                2: { annotations: { stem: { length: 20 } }  },
                3: { annotations: { stem: { length: 2  } }  }
            }
          };

        if(typeof json['title'] != 'undefined' && json['title']!='') {
            $('#'+json['id_container']).parent().find('h3.columnGraphTitle').html(json['title']);
        }
        var columnChart = new google.visualization.ColumnChart(document.getElementById(json['id_container']));
        google.visualization.events.addListener(columnChart, 'ready', downloadGraphAPI);
        
//        var imageId = 'img-'+json['id_container'];
//        google.visualization.events.addListener(columnChart, 'ready', function () {
//            $("#"+imageId).remove();
//            $('#pdf-'+json['id_container']+' h3').text(json['pdf_h3']);
//            png = '<img id ="'+imageId+'" src="' + columnChart.getImageURI() + '"/>';
//            $('#pdf-'+json['id_container']).append(png);
//        });
        columnChart.draw(data, options);
    },
    'packages':['corechart']
    });
}

function drawTableChart(json) {
    $('#'+json['id_container']).html('');
        
    google.charts.load('current', {
        callback: function () {
        var data = google.visualization.arrayToDataTable(json['content']);
        var options = {
            height: '100%',
            width : '100%',
            sort : 'disable',
            cssClassNames : {'tableCell':'listDataRow'},
            allowHtml : true,
            showRowNumber : false
          };
       
        var columnChart = new google.visualization.Table(document.getElementById(json['id_container']));
        columnChart.draw(data,  options);
        
        $(".google-visualization-table-table").addClass('table table-striped border-collapse-unset bothCellFixed');
        $(".google-visualization-table-table tr").removeClass();
        $(".google-visualization-table-table th").removeClass();
        $(".google-visualization-table-table td").removeClass();
        $(".google-visualization-table-table tr").addClass('listDataRow');
        $(".google-visualization-table-table th").css({"background-color": 'rgb(221, 221, 221)', "position": "relative","top":"0px"});
        $(".google-visualization-table-table").removeClass('google-visualization-table-table');
        $(".google-visualization-table").removeClass();
    },
    'packages':['table']
    });
}
