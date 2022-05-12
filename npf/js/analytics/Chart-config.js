/**
 * Chart JS Config
 */

// Funnel Chart
var funnelchart = {
	type: 'funnel',
	data: {
		datasets: [{
			data: [90, 70, 50, 30, 10],
			backgroundColor: [
				"#2765dc",
				"#f9a954",
				"#fc4f6d",
				"#fe6f45",
				"#7c25aa"
			],
			hoverBackgroundColor: [
				"#2765dc",
				"#f9a954",
				"#fc4f6d",
				"#fe6f45",
				"#7c25aa"
			]
		}],
		labels: [
			"Total Leads",
			"Applications Started",
			"Paid Applications",
			"Application Submitted",
			"Enrollments"
		]
	},
	options: {
		responsive: true,
		sort: 'desc',
		legend: {
			position: 'right',
			labels: {
                boxWidth: 15
            }
		},
		/*title: {
			display: true,
			text: 'dfdfdsf'
		},*/
		tooltips: {
			position: 'nearest',
			intersect: false,
			yPadding: 10,
			xPadding: 10,
			caretSize: 8,
		},
		animation: {
			animateScale: true,
			animateRotate: true
		}
	}
};


// Leads Vs Application Chart
var lineChart = {
    type: 'line',
    data: {
		labels: ['12-2017', '01-2018', '02-2018', '03-2018', '04-2018', '05-2017', '06-2017', '07-2017','08-2017'],
		datasets: [
			{
				label: 'Leads',
				backgroundColor: '#2366d9',
				borderColor: '#2366d9',
				fill: false,
				//borderDash: [5, 5],
				pointRadius: 5,
				pointBackgroundColor: '#2366d9',
				pointBorderColor: '#2366d9',
				pointHoverRadius: 5,
				data: [50, 65, 75, 88, 108, 123, 141, 167, 178]
			}, 
			{
				label: 'Applications',
				backgroundColor: '#faaa4b',
				borderColor: '#faaa4b',
				fill: false,
				//borderDash: [5, 5],
				pointRadius: 5,
				pointBackgroundColor: '#faaa4b',
				pointBorderColor: '#faaa4b',
				pointHoverRadius: 5,
				data: [30, 25, 45, 48, 78, 83, 41, 77, 78]
			}
		]
	},
    options: {
		responsive: true,
		legend: {
			position: 'top',
		},
		hover: {
			mode: 'index'
		},
		scales: {
			xAxes: [{
				display: true,
                scaleLabel: {
                    display: true,
                    labelString: '(Dates)',
                    fontSize:13
                },
                ticks: {
                    fontSize: 13,
                    fontColor:'#111'
                },
                gridLines: {
                    color: 'rgba(0,0,0,0.04)',
                    lineWidth: 1
                }
			}],
			yAxes: [{
				display: true,
                scaleLabel: {
                    display: true,
                    labelString: '(Count)',
                    fontSize:13
                },
                ticks: {
                    fontSize: 13,
                    fontColor:'#111',
                    beginAtZero: true
                },
                gridLines: {
                    color: 'rgba(0,0,0,0.04)',
                    lineWidth: 1
                }
			}]
		},
		legend: {
            //position: 'left',
            labels: {
                boxWidth: 15
            }
        },
		tooltips: {
			position: 'nearest',
			intersect: false,
			yPadding: 10,
			xPadding: 10,
			caretSize: 8,
		},
		/*title: {
			display: true,
			text: 'Chart.js Line Chart - Different point sizes'
		}*/
	}
};


// Bar Graph
var barGraph = {
    type: 'bar',
    data: {
		labels: ['Stage1', 'Stage2', 'Stage3', 'Stage4', 'Stage5', 'Stage6', 'Stage7', 'Stage8', 'Stage9', 'Stage10'],
			datasets: [{
				label: 'Dataset 1',
				backgroundColor: ['#2366d9','#faaa4b','#fa506d','#fe6f45','#7c25aa','#d4abd3', '#23a401', '#017aa9', '#a8bdce', '#a99d55'],
				borderColor: ['#2366d9','#faaa4b','#fa506d','#fe6f45','#7c25aa','#d4abd3', '#23a401', '#017aa9', '#a8bdce', '#a99d55'],
				borderWidth: 1,
				data: [100, 250, 90, 40, 300, 450, 670, 280, 99, 800]
			}]		
	},
    options:{
		scaleShowVerticalLines: false,
		responsive: true,
		maintainAspectRatio: false,
		legend: {
		  "display": false,
		},
		tooltips: {
		  "enabled": true
		},
		"hover": {
		  "animationDuration": 0
		},
		"animation": {
		  "duration": 1,
		  "onComplete": function() {
			var chartInstance = this.chart,
			  ctx = chartInstance.ctx;

			ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
			ctx.textAlign = 'center';
			ctx.textBaseline = 'bottom';
			ctx.fillStyle = '#000';

			this.data.datasets.forEach(function(dataset, i) {
			  var meta = chartInstance.controller.getDatasetMeta(i);
			  meta.data.forEach(function(bar, index) {
				var data = dataset.data[index];
				ctx.fillText(data, bar._model.x, bar._model.y - 5);
			  });
			});
		  }
		},
		scales: {
			xAxes: [{
				display: true,
				scaleLabel: {
					display: true,
					labelString: '(Stage)',
					fontSize:12
				},
				ticks: {
					fontSize: 12,
					fontColor:'#111'
				},
				gridLines: {
					color: 'rgba(0,0,0,0.04)',
					lineWidth: 1
				}   
			}],
			yAxes: [{
				display: true,
				scaleLabel: {
					display: true,
					labelString: '(Count)',
					fontSize:12
				},
				ticks: {
					fontSize: 12,
					fontColor:'#111',
					beginAtZero: true
				},
				gridLines: {
					color: 'rgba(0,0,0,0.04)',
					lineWidth: 1
				}   
			}]
		},
	}
};