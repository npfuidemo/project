var initilizeLeadVsApplication = function () {
    $("#leadVsApplicationsDashlet").find(".applyDates").click(function () {
        $("#leadVsApplication_range1StartDate").val("");
        $("#leadVsApplication_range1EndDate").val("");
        if ($("#leadVsApplicationsDashlet").find(".inputBaseStartDate").val() !== "" && $("#leadVsApplicationsDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#leadVsApplication_range1StartDate").val($("#leadVsApplicationsDashlet").find(".inputBaseStartDate").val());
            $("#leadVsApplication_range1EndDate").val($("#leadVsApplicationsDashlet").find(".inputBaseEndDate").val());
        }
        createLeadVsApplicationGraph();
    });
    $("#leadVsApplicationsDashlet").find(".cancelDates").click(function () {
        $("#leadVsApplication_range1StartDate").val("");
        $("#leadVsApplication_range1EndDate").val("");
        createLeadVsApplicationGraph();
    });
    createLeadVsApplicationGraph();
};

var createLeadVsApplicationGraph = function () {
//    $("#leadVsApplicationsDashlet").find('.dropdown-toggle').dropdown('close');
    var dashletUrl = $("#leadVsApplicationsDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#leadVsApplication_collegeId").val($("#collegeId").val());
    var filters = $("#leadVsApplicationFilterForm").serializeArray();
    console.log(filters);
    $.ajax({
        url: dashletUrl,
        type: 'post',
        data: filters,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
            $('#leadVsApplicationsDashletHTML .panel-loader').hide();
            $('#leadVsApplicationsDashletHTML .panel-heading, #leadVsApplicationsDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    updateLeadVsApplicationGraph(responseObject.data);
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

};

function updateLeadVsApplicationGraph(dashletData) {

    var dateRangeHtml = "(" + dashletData.startDate + " to " + dashletData.endDate + ")";
    if (typeof dashletData.compareStartDate !== "undefined" && typeof dashletData.compareEndDate !== "undefined") {
        dateRangeHtml = dateRangeHtml + " vs (" + dashletData.compareStartDate + " to " + dashletData.compareEndDate + ")";
    }
    $("#leadVsApplications_dateRange").html(dateRangeHtml);

    var leadApplicationctx = document.getElementById('leadApplication').getContext('2d');

    if (typeof window.leadVsApplication_lineGraph === "object") {
        window.leadVsApplication_lineGraph.destroy();
    }

    var lineChart = {
        type: 'line',
        data: {
            labels: dashletData.graphData.labels,
            datasets: [
                {
                    label: 'Leads',
                    backgroundColor: '#1f77b4',
                    borderColor: '#1f77b4',
                    fill: false,
                    //borderDash: [5, 5],
                    pointRadius: 5,
                    pointBackgroundColor: '#1f77b4',
                    pointBorderColor: '#1f77b4',
                    pointHoverRadius: 5,
                    data: dashletData.graphData.leads
                },
                {
                    label: 'Applications',
                    backgroundColor: '#ff7f0e',
                    borderColor: '#ff7f0e',
                    fill: false,
                    //borderDash: [5, 5],
                    pointRadius: 5,
                    pointBackgroundColor: '#ff7f0e',
                    pointBorderColor: '#ff7f0e',
                    pointHoverRadius: 5,
                    data: dashletData.graphData.applications
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
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
                            fontSize: 13
                        },
                        ticks: {
                            fontSize: 13,
                            fontColor: '#111',

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
                            fontSize: 13
                        },
                        ticks: {
                            fontSize: 13,
                            fontColor: '#111',
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
        },
        plugins: [{
                beforeInit: function (chart) {
                    chart.data.labels.forEach(function (e, i, a) {
                        a[i] = e.split(' ');
                    });
                }
            }]
    };
    window.leadVsApplication_lineGraph = new Chart(leadApplicationctx, lineChart);


}

function leadVsApplication_downloadPDF() {
    $("#leadVsApplicationsDashletFilters").hide();

    var data = document.getElementById("leadVsApplicationsDashletHTML");
    html2canvas(data).then(canvas => {
        // Few necessary setting options  
        var imgWidth = 200;
        var imgHeight = canvas.height * imgWidth / canvas.width;

        const contentDataURL = canvas.toDataURL('image/png');
        var pdf = new jspdf(); // A4 size page of PDF  
        var position = 1;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save('download.pdf'); // Generated PDF   
        $("#leadVsApplicationsDashletFilters").show();
    });


}

function leadVsApplication_downloadCSV() {
    $("#leadVsApplicationFilterForm").submit();
}

function resetLeadVsApplicationFilterForm() {
    $("#leadVsApplicationFilterForm").find('select.dashletFilter').each(function () {
        $(this).val('');
    });
    $('.chosen-select').trigger('chosen:updated');
}

