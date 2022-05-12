$(document).ready(function(){
	$('[data-toggle="popover"]').popover();
    loadReportDateRangepicker();
    loadTrackCampaignDetails('reset');
    loadCampaignSummaryLink();
    //google.charts.load("current", {packages:['corechart']});
   
    // add custom for campaign detail graph view on chage event
    $('#date_range_graph').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
        GetCampaignDataForGraph();
    });
    $('#date_range_graph').on('cancel.daterangepicker', function (ev, picker) {
         $(this).val('');
        GetCampaignDataForGraph();
    });
    
    $('body').on('click', function(){
        //$('.google-visualization-tooltip').hide();
    });
    
    $(document).on('change', "#trackCampaignFilter select[name='instance_type']", function () {
        $("#trackCampaignFilter #lead_type").val("");
        $("#trackCampaignFilter #lead_type").attr('name','lead_type');
        if($(this).val() == 'sec_campaign_id'){
            $("#trackCampaignFilter #lead_type").attr('name','sec_lead_type');
        } else if($(this).val() == 'ter_campaign_id'){
            $("#trackCampaignFilter #lead_type").attr('name','ter_lead_type');
        } else if($(this).val() == 'campaign_id'){
            $("#trackCampaignFilter #lead_type").attr('name','lead_type');
        }
        $("#trackCampaignFilter #lead_type").trigger('chosen:updated');
    });   
    
    $(document).on('click', 'span.sorting_span i', function () {
        $("#sortField").val(jQuery(this).data('column'));
        $("#sortOrder").val(jQuery(this).data('sorting'));
        loadTrackCampaignDetails('reset');
    });
    
});
$(document).ajaxComplete(function() {
    $('[data-toggle="popover"]').popover();
});

var loaderCount=0;

/**
 * 
 * load campaign detail
 */
function loadTrackCampaignDetails(listingType){
    if(jsVars.canTrackCampaignDetail==false){
        return false;
    }
    if($("#college_id").val()==""){
        $('#tableViewContainer').html("<div class='col-lg-12'><table class='table table-striped list_data table-border'><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'> Please select a institute name to view campaign tracking details. </h4></div></div> </td></tr><tr></tr></table></div>");
        return;
    }
    if(listingType === 'reset'){
        $("#page").val(1);
    }
     $.ajax({
        url: jsVars.loadTrackCampaignDetailsLink,
        type: 'post',
        data: $('#trackCampaignFilter select ,#trackCampaignFilter input'),
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $('#trackCampaignLoader.loader-block').show();
            loaderCount++;
        },
        complete: function () {
            loaderCount--;
            if(loaderCount==0){
                $('#trackCampaignLoader.loader-block').hide();
            }
        },
        success: function (html) { 
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
            }else{
                html    = html.replace("<head/>", "");
                var countRecord = countResult(html);
                if(listingType == 'reset'){
                    if(countRecord == 0){
                        $("#tableSummary").hide();
                        $("#table_action").hide();
                    }else{
                        $("#tableSummary").show();
                        $("#table_action").show();
                    }
                    $('#tableViewContainer').html(html);
                }else{
                    $('#tableViewContainer').find("tbody#load_more_results").append(html);
                }
//                if(countRecord < 10){
//                    $('#load_more_button').hide();
//                }else{
//                    $('#load_more_button').show();
//                }
                $("#page").val(parseInt($("#page").val())+1);
				$('.offCanvasModal').modal('hide');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/**
 * 
 * load all campaign summary
 */
function loadCampaignSummaryLink(){
    return;
    if(jsVars.canTrackCampaignDetail==false){
        return false;
    }
  
    if($("#college_id").val()==""){
        $('#tableViewContainer').html('<div class="alert alert-danger">Please select a institute name to view track campaign</div>');
        return;
    }
    
     $.ajax({
        url: jsVars.loadCampaignSummaryLink,
        type: 'post',
        data: $('#trackCampaignFilter select ,#trackCampaignFilter input'),
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $('#trackCampaignLoader.loader-block').show();
            loaderCount++;
        },
        complete: function () {
            loaderCount--;
            if(loaderCount==0){
                $('#trackCampaignLoader.loader-block').hide();
            }
        },
        success: function (json) { 
            if (json['redirect']){
                location = json['redirect'];
            }else if (json['error']){
                alertPopup(json['error'], 'error');
            }else if (json['dataList'] != undefined) {
                $("#totalPrimaryRegistrations").html(json['dataList'][0]['primary_count']);
                $("#totalSecondaryRegistrations").html(json['dataList'][0]['secondary_count']);
                $("#totalTertiaryRegistrations").html(json['dataList'][0]['tertiary_count']);
                $("#totalRegistrations").html(json['dataList'][0]['total_count']);
                $("#totalVerifiedRegistrations").html(json['dataList'][0]['verified']);
                $("#totalUnverifiedRegistrations").html(json['dataList'][0]['unverified']);
		if(json['isOnlyCRMInstitute'] == 1){
                    $('#ApplicationLable').html(json['applicationLabel']);
                    if(json['isApplicationEnable'] == "0"){
                        $('#application-count-div').hide();
                    }else if(json['isApplicationConfigured'] == 1){
                        $('#totalApplications').html(json['dataList'][0]['application_count']);
                    }else{
                        $('#totalApplications').html('--');
                    }
                }else{
                    $("#totalApplications").html(json['dataList'][0]['application_count']);
                }
                
		if(json['isEnrollmentEnabled'] == 1){
                    if(json['isEnrollmentConfigured'] == 1){
                        str = '<div class="lditem enrollment-bg"><div class="ldicontent"><div class="lditext"><span id="enrollmentLable">' + json['enrollmentLabel'] + '</span><a tabindex="1" class="icon-info" role="button" data-placement="top" data-container="body" data-toggle="popover" data-trigger="focus" data-content="This count represents leads that have enroled."><span class="lineicon-info" aria-hidden="true"></span></a></div><div id="totalApplications" class="ldinumber">' + json['dataList'][0]['total_enrolled'] + '</div><i class="lineicon-2 idicons"></i></div></div>';
                        $('#enrollment-div').html(str);
                    }else{
                       $('#enrollmentLable').html(json['enrollmentLabel']); 
                    }
                    $('#enrollment-div').show();
                }
                var publisher   = $("#PublisherIdSelect").val();
                if(publisher.length > 0){
                    $("#publisherNameSpan").html($("#PublisherIdSelect").find("option[value='"+publisher+"']").html());
                }else{
                    $("#publisherNameSpan").html("All");
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function countResult(html){
    var len = (html.match(/listDataRow/g) || []).length;
    return len;
}

function exportTrackCampaignCsv(){
    var $form = $("#filterTrackCampaignForm");
    $form.attr("action",jsVars.exportTrackCampaignCsvLink);
    $form.attr("target",'modalIframe');
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    $('#myModal').modal('show');
    $form.submit();
    $form.attr("onsubmit",onsubmit_attr);
    $form.removeAttr("target");
};

var downloadTrackCampaignFile = function(url){
    window.open(url, "_self");
};


function showHideTabularTab(show_tab){
    if(show_tab=="1a"){
        $("#table_action").show();
        $("#graph_action").hide();
        hide_tab="2a";
        $("#trackCampaignFilter input,#trackCampaignFilter button").removeAttr("disabled");
        $("#trackCampaignFilter select").removeAttr("disabled").trigger("chosen:updated");
        $("#college_id").attr("disabled","disabled").trigger("chosen:updated");
    }else{
        $("#table_action").hide();
        $("#graph_action").show();
         hide_tab="1a";
        $("#trackCampaignFilter input,#trackCampaignFilter button").attr("disabled","disabled");
        $("#trackCampaignFilter select").attr("disabled","disabled").trigger("chosen:updated");
    }
    $('.tablViewtab li').removeClass("active");
    $('.tablViewtab li#a_'+show_tab).addClass("active");
    $('div#'+hide_tab).hide();
    $('div#'+show_tab).fadeIn();

    if(show_tab=='2a'){
        $('#2a ul li').removeClass('active');
        $('#2a ul li:first').addClass('active');
        $('#2a ul li:first a').trigger('click');
    }
}

/**
 * 
 * get campaign data for publisher
 */
function GetCampaignDataForGraph(){
    var title = "";
    var chart_div = "";
    $("#conversion_pie_chart_div").hide();
    if($("#college_id").val()==""){
        $("#graph_container").hide();
        $("#graph_error_container").show();
        $("#graph_error_container").html("<div class='col-lg-12'><table class='table table-striped list_data table-border'><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'> Please select a institute name to view campaign track graph. </h4></div></div> </td></tr><tr></tr></table></div>");
        return;
    }
    var checkedStates = $('#graph_states').val();
     
     $.ajax({
        url: jsVars.getCampaignsDataForGraphLink,
        type: 'post',
       // data: $('#date_range_graph, #college_id, #lead_type_graph, #graph_states'),
        data: {date_range_graph:$('#date_range_graph').val(), s_college_id:$('#college_id').val(), lead_type_graph:$('#lead_type_graph').val(), lead_states:checkedStates},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () { 
            $('#trackCampaignLoader.loader-block').show();
        },
        complete: function () {
            $('#trackCampaignLoader.loader-block').hide();
        },
        success: function (data) { 
            
            if(data['session'] != undefined){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if(data['ERROR'] != undefined){
                alert(html.substring(6, html.length));
            }else if(data['error'] != undefined){
                $("#graph_action").hide();
                $("#graph_container").hide();
                $("#graph_error_container").show();
                $("#graph_error_container").html("<div class='col-lg-12'><table class='table table-striped list_data table-border'><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'> "+data["error"]+" </h4></div></div> </td></tr><tr></tr></table></div>");
            } else {
                $("#graph_action").show();
                $("#graph_container").show();
                $("#graph_error_container").hide();
                
                //prepare state filter
                //populate state list
                if(typeof data.stateList === "object"){
                    $('#graph_states').SumoSelect({locale : ['Apply', 'Cancel', 'Select All'], selectAll:true, okCancelInMulti: true, placeholder: 'Select States', search: true, searchText:'Select States'});

                    var stateOptions = '';
                    $.each(data.stateList, function (index, item) {

                        if(checkedStates != null && $.inArray(index, checkedStates) != -1){
                            stateOptions += '<option value="'+index+'" selected>'+item+'</option>';
                        }else{
                            stateOptions += '<option value="'+index+'">'+item+'</option>';
                        }

                    });

                    if(stateOptions != ''){
                        $('#graph_states_container').show();
                        $('#graph_states').html(stateOptions);
                    }else{
                        $('#graph_states_container').hide();
                    }
                    $('select#graph_states')[0].sumo.reload();
                }
                
                //To make registration bar chart

		i = 0;
                rowData = [[]];

		if(data.isEnrollmentEnabled == 1 && data.isEnrollmentConfigured == 0){
			if(!data.enrollPermission.enrolmentMapping)
				$('#enrollmentTooltip').html('<a href="javascript:void(0)" class="enrolment-configBtn" tabindex="0" data-toggle="popover" data-placement="top" data-container="body" data-trigger="hover" data-content="Final Enrolments not configured for the institute. To get a complete lead to enrolment view, Please get it configured"><i class="fa fa-cogs" aria-hidden="true"></i>&nbsp;Configure Enrolments</a>');
			else
				$('#enrollmentTooltip').html('<a href="/settings/enrolment-mapping" class="enrolment-configBtn" tabindex="0" data-toggle="popover" data-placement="top" data-container="body" data-trigger="hover" data-content="Final Enrolments not configured for the institute. To get a complete lead to enrolment view, Please get it configured"><i class="fa fa-cogs" aria-hidden="true"></i>&nbsp;Configure Enrolments</a>');
		}

                if(data.isEnrollmentConfigured == 1 && data.isApplicationConfigured == 1){
                        rowData[i++] = ['Publisher', 'Leads', {type: 'string', role: 'annotation'},data.applicationLabel,{type: 'string', role: 'annotation'}, data.enrollmentLabel, {type: 'string', role: 'annotation'}];
			$('#conversion_bar_chart_header').html('Top Publishers vs Primary Leads, '+data.applicationLabel+' and '+data.enrollmentLabel);
                }else if(data.isEnrollmentConfigured == 1 ){
                    rowData[i++] = ['Publisher', 'Leads', {type: 'string', role: 'annotation'},data.enrollmentLabel,{type: 'string', role: 'annotation'}];
                    $('#conversion_bar_chart_header').html('Top Publishers vs Primary Leads and '+data.enrollmentLabel);
                }else if(data.isApplicationConfigured == 1 ){
                    rowData[i++] = ['Publisher', 'Leads', {type: 'string', role: 'annotation'},data.applicationLabel,{type: 'string', role: 'annotation'}];
                    $('#conversion_bar_chart_header').html('Top Publishers vs Primary Leads and '+data.applicationLabel);
                }else{
                    rowData[i++] = ['Publisher', 'Leads', {type: 'string', role: 'annotation'}];
                    $('#conversion_bar_chart_header').html('Top Publishers vs Primary Leads');
                }
                for(var key in data['conversion_bar_chart']){
                    if(parseInt(data['conversion_bar_chart'][key]['primary_count']) != 0 || parseInt(data['conversion_bar_chart'][key]['primary_count']) != 0){
                        if(data.isEnrollmentConfigured == 1 && data.isApplicationConfigured == 1){
                                rowData[i++] = [''+key, parseInt(data['conversion_bar_chart'][key]['primary_count']),
                                                parseInt(data['conversion_bar_chart'][key]['primary_count']) ,
                                                parseInt(data['conversion_bar_chart'][key]['conversion_count']),
                                                parseInt(data['conversion_bar_chart'][key]['conversion_count']),
                                                parseInt(data['conversion_bar_chart'][key]['enrolled_count']),
                                                parseInt(data['conversion_bar_chart'][key]['enrolled_count']),
                                        ];
                        }else if(data.isEnrollmentConfigured == 1){
                                rowData[i++] = [''+key, parseInt(data['conversion_bar_chart'][key]['primary_count']),
                                                parseInt(data['conversion_bar_chart'][key]['primary_count']) ,
                                                parseInt(data['conversion_bar_chart'][key]['enrolled_count']),
                                                parseInt(data['conversion_bar_chart'][key]['enrolled_count']),
                                        ];
                        }else if(data.isApplicationConfigured == 1){
                                rowData[i++] = [''+key, parseInt(data['conversion_bar_chart'][key]['primary_count']),
                                                parseInt(data['conversion_bar_chart'][key]['primary_count']) ,
                                                parseInt(data['conversion_bar_chart'][key]['conversion_count']),
                                                parseInt(data['conversion_bar_chart'][key]['conversion_count']),
                                        ];
                        }else{
                                rowData[i++] = [''+key, parseInt(data['conversion_bar_chart'][key]['primary_count']),
                                                parseInt(data['conversion_bar_chart'][key]['primary_count']) ,
                                        ];
                        }
                    }
                }
               
                title = "";
                chart_div = "conversion_bar_chart";
                if(rowData.length > 1){
                    matarialBarcharts(title,chart_div,rowData);
                }else{
                    $("#"+chart_div).html("<table class='table table-striped list_data table-border'><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'> Data not available with selected filters </h4></div></div> </td></tr><tr></tr></table>");
                }
                //To make instance bar chart
               
                i = 0;
                rowData = [[]];
                rowData[i++] = ['Publisher', 'Total Leads', {type: 'string', role: 'annotation'}, 'Primary Leads', {type: 'string', role: 'annotation'}, 
                                'Secondary Leads',{type: 'string', role: 'annotation'}, 'Tertiary Leads',{type: 'string', role: 'annotation'}];
                for(var key in data['instance_bar_chart']){
                        rowData[i++] = [''+key, parseInt(data['instance_bar_chart'][key]['total_count']),
                                                parseInt(data['instance_bar_chart'][key]['total_count']),
                                                parseInt(data['instance_bar_chart'][key]['primary_count']),
                                                parseInt(data['instance_bar_chart'][key]['primary_count']) ,
                                                parseInt(data['instance_bar_chart'][key]['secondary_count']),
                                                parseInt(data['instance_bar_chart'][key]['secondary_count']),
                                                parseInt(data['instance_bar_chart'][key]['tertiary_count']),
                                                parseInt(data['instance_bar_chart'][key]['tertiary_count']) 
                                        ];
                    }
                title = "";
                chart_div = "reg_bar_chart";
                if(rowData.length > 1){
                    matarialBarcharts(title,chart_div,rowData);
                }else{
                    $("#"+chart_div).html("<table class='table table-striped list_data table-border'><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'> Data not available with selected filters </h4></div></div> </td></tr><tr></tr></table>");
                }
                
                //To make verived vs unverified bar chart
                i = 0;
                rowData = [[]];
                rowData[i++] = ['Publisher', 'Verified', {type: 'string', role: 'annotation'}, 'Unverified', {type: 'string', role: 'annotation'}];
                for(var key in data['verified_bar_chart']){
                    if(parseInt(data['verified_bar_chart'][key]['verified_count']) != 0 || parseInt(data['verified_bar_chart'][key]['unverified_count']) != 0){
                        rowData[i++] = [''+key, parseInt(data['verified_bar_chart'][key]['verified_count']),
                                                parseInt(data['verified_bar_chart'][key]['verified_count']),
                                                parseInt(data['verified_bar_chart'][key]['unverified_count']),
                                                parseInt(data['verified_bar_chart'][key]['unverified_count'])
                                        ];
                    }
                }
                title = "";
                chart_div = "user_bar_chart";
                if(rowData.length > 1){
                    matarialBarcharts(title,chart_div,rowData);
                }else{
                    $("#"+chart_div).html("<table class='table table-striped list_data table-border'><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'> Data not available with selected filters </h4></div></div> </td></tr><tr></tr></table>");
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/******************** matarial bar chart start code ****************************/
function matarialBarcharts(title,chart_div,arr_chart_data,maxPublisherNameLength){
  //  google.charts.load("current", {packages:['corechart']});
    google.charts.setOnLoadCallback(function() { drawMatarialBarChart(title,chart_div,arr_chart_data,maxPublisherNameLength); });
}

function drawMatarialBarChart(title,chart_div,arr_chart_data,maxPublisherNameLength) {
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
    
    maxPublisherNameLength  = parseInt(maxPublisherNameLength);
    var chatAreaHeight = '75%';
    if(maxPublisherNameLength >= 45) {
        chatAreaHeight = "50%";
    }else if(maxPublisherNameLength >= 40){
        chatAreaHeight = "57%";
    }else if(maxPublisherNameLength >= 35){
        chatAreaHeight = "60%";
    }else if(maxPublisherNameLength >= 30 ){
        chatAreaHeight = "65%";
	}
	else if(maxPublisherNameLength >= 20){
        chatAreaHeight = "70%";
    }
    //alert(maxPublisherNameLength);
    //alert(chatAreaHeight);
    var options = {
        title:title,
        legend: { position: 'top', maxLines: 3, alignment:'center' },
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
        chartArea:{left:'6%',top:'10%',width:'90%',height:chatAreaHeight} 
      };

   var chart = new google.visualization.ColumnChart(document.getElementById(chart_div));
   google.visualization.events.addListener(chart, 'ready', AddNamespaceHandler);
   chart.draw(data, options);
}

function AddNamespaceHandler(id){
  var svg = jQuery('svg');
  svg.attr("xmlns", "http://www.w3.org/2000/svg");
  svg.css('overflow','visible');
}

/* To Download campaign graph as pdf */
function downloadGraph(elem,title)
{
    if($('#graph_container').css('display') == 'none')    {
        alert("Graph not available with selected filters");
       return false; // if graph not available
    }
    return xepOnline.Formatter.Format('graph_container', {render: 'download',pageWidth:10,filename:"Campaign_Graph"});
}


/* To Print campaign graph as pdf */
function printGraph(elem,title)
{
    if($('#graph_container').css('display') == 'none')    {
        alert("Graph not available with selected filters");
       return false; // if graph not available
    }
    var mywindow = window.open('', 'PRINT', 'height=200,width=620');
    mywindow.document.write('<html><head><title>' + title  + '</title><link rel="stylesheet" type="text/css" href="'+jsVars.FULL_URL+'/css/college/bootstrap.min.css"><link rel="stylesheet" type="text/css" href="'+jsVars.FULL_URL+'/css/college/common.css">');
    mywindow.document.write('<style> body { margin: 8px;  } </style>');
    mywindow.document.write('</head><body >');
    mywindow.document.write(document.getElementById(elem).innerHTML);
    mywindow.document.write('</body></html>');
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
//    mywindow.print();
//    mywindow.close();
    var is_chrome = Boolean(window.chrome);
    if (is_chrome) {
        mywindow.onload = function () {
            setTimeout(function () { // wait until all resources loaded 
                mywindow.print();  // change window to winPrint
                mywindow.close();// change window to winPrint
            }, 200);
        };
    }
    else {
        mywindow.print();
        mywindow.close();
    }
    return true;
}

function ResetFilterValue($this){
    $('#trackCampaignFilter').find('input[type="text"]').each(function(){
       $(this).val('');
    });
	$('#FormIdSelect, #PublisherIdSelect, #InstanceSelect, #lead_type').val('');
	$('#FormIdSelect, #PublisherIdSelect, #InstanceSelect, #lead_type').trigger("chosen:updated");
}
