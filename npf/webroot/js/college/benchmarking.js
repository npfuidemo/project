//$.material.init();
$(document).ready(function () {
    LoadReportDateRangepickerBenchMark();
    $('.sumo_slect').SumoSelect({placeholder: 'Select Year', search: true, searchText:'Search Years', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
    $('#graph_type').SumoSelect({placeholder: 'Select Leads, Applications', search: true, searchText:'Select Leads, Applications', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
	$('.benchMarkTab').click(function(){
		$(this).parent().addClass('active');
		$(this).parent().siblings().removeClass('active');
	});
	loadBenchmarkData('reset');
});

$(document).on('click', '#daytrend', function () {
    $("#state-wise-trends").hide();
});

$(document).on('click', '#datetrend', function () {
    $("#state-wise-trends").hide();
});

$(document).on('click', '#statetrend', function () {
    $("#statetrend").addClass("active");
    $("#state-wise-trends").addClass("active");
    $("#state-wise-trends").show();
});

function ajaxbenchMarking(type) {
    if (type == 'reset') {
        Page = 0;
    }
    var data = $('#benchMarking').serializeArray();
    data.push({name: "page", value: Page});
    $.ajax({
        url: '/colleges/ajaxBenchmarking',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function (xhr) {
            $('#listloader').show();
            $('#filter').hide();
            $('.modal-backdrop').remove(); 
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $(".datewiseProjection").show();
            $('#load_more_results_msg').html('');
            $('#load_more_button').show();
            $('.dateDaysTabs').show();
            $('.offCanvasModal').modal('hide');

            Page = Page + 1;
            if (data == "session_logout") {
                window.location.reload(true);
            } else if (data == "record_not_found") {
                if (Page == 1) {
                    error_html = "No Records found";
                    $('#benchMarkingHtml').html("");
                } else {
                    error_html = "No More Record";
                }
                $('#load_more_results_msg').html("<div class='noDataFoundBlock'><div class='innerHtml'><img src='/img/no-record.png' alt='no-record'><span>" + error_html + "</span></div></div>");
                $('#load_more_button').hide();
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Applications");
                $('.multiColorTable').css('border','0');

            } else if (data == 'csrf_mismatched') {
                error_html = "Csrf Token Mismatched";
                $('#load_more_results_msg').html("<table class='table table-striped list_data'><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>" + error_html + "</h4></div></div> </td></tr><tr></tr></tbody></table>");
                $('#benchMarkingHtml').html("");
            } else if (data == 'select_college' || data == 'select_form') {
                error_html = "Please Select Institute";
                 if(data == 'select_form'){
                    error_html = "Please Select Form";
                }
                $('#load_more_results_msg').html("<table class='table table-striped list_data'><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>" + error_html + "</h4></div></div> </td></tr><tr></tr></tbody></table>");
                $('#benchMarkingHtml').html("");
                $('#load_more_button').hide();
            } else {
                if (type == 'reset') {
                    $('#benchMarkingHtml').html("");
                }
                $("#benchMarkingHtml").append(data);
                $('tbody').removeClass('fadeInUp');
                $('tbody').removeClass('animated');
                var current_records = $("#current_record").val();
                if (current_records < 10) {
                    $('#load_more_button').hide();
                }
				
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
            table_fix_rowcol()
        }
    });
}
var xPage = 0;
function dayWiseProjecttion(type){
    if (type == 'reset') {
        xPage = 0;
    }
    var data = $('#benchMarking').serializeArray();
    data.push({name: "xpage", value: xPage});
    $.ajax({
        url: '/colleges/day-wise-projection',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $(".daywiseProjection").show();
            $('#day_load_more_results_msg').html('');
            $('#day_load_more_button').show();

            xPage = xPage + 1;
            if (data == "session_logout") {
                window.location.reload(true);
            } else if (data == "record_not_found") {
                if (xPage == 1) {
                    error_html = "No Records found";
                    $('#day_benchMarkingHtml').html("");
                } else {
                    error_html = "No More Record";
                }
                $('#day_load_more_results_msg').html("<div class='noDataFoundBlock one'><div class='innerHtml'><img src='/img/no-record.png' alt='no-record'><span>" + error_html + "</span></div></div>");
                $('.multiColorTable').css('border','0');
                $('#day_load_more_button').hide();
                $('#day_load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Applications");
                $('#day_load_more_results_msg').hide();

            } else if (data == 'csrf_mismatched') {
                error_html = "Csrf Token Mismatched";
                $('#day_load_more_results_msg').html("<table class='table table-striped list_data'><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>" + error_html + "</h4></div></div> </td></tr><tr></tr></tbody></table>");
                $('#day_benchMarkingHtml').html("");
            } else if (data == 'select_college' || data == 'select_form') {
                error_html = "Please Select Institute";
                if(data == 'select_form'){
                    error_html = "Please Select Form";
                }
                $('#day_load_more_results_msg').html("<div class='noDataFoundBlock'><div class='innerHtml'><img src='/img/no-record.png' alt='no-record'><span>" + error_html + "</span></div></div>");
                $('#day_benchMarkingHtml').html("");
                $('#day_load_more_button').hide();
                
            } else {
                if (type == 'reset') {
                    $('#day_benchMarkingHtml').html("");
                }
                $("#day_benchMarkingHtml").append(data);
                $('tbody').removeClass('fadeInUp');
                $('tbody').removeClass('animated');
                var current_records = $("#day_current_record").val();
                if (current_records < 10) {
                    $('#day_load_more_button').hide();
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
            table_fix_rowcol();
        }
    });
}

function stateWiseApplication(type) {
    $('.errorMessage').hide();

    if(type != 'reset'){
	if($('#state_min_day').val() == ''){
	    $('#error_state_min_day').html("Enter From Day.");
	    $('#error_state_min_day').show();
	    return false;
	}

	if($('#state_max_day').val() == ''){
	    $('#error_state_max_day').html("Enter To Day.");
	    $('#error_state_max_day').show();
	    return false;
	}

	if(parseInt($('#state_max_day').val())<parseInt($('#state_min_day').val())){
	    $('#error_state_max_day').html("Invalid From/To Day.");
	    $('#error_state_max_day').show();
	    return false;
	}else if(parseInt($('#state_max_day').val()) - parseInt($('#state_min_day').val())>365){
	    $('#error_state_max_day').html("Max Range is 356 Day.");
	    $('#error_state_max_day').show();
	    return false;
	}
    }
    
    $("#state_benchMarkingHtml").html('');
    $("#statetrend").show();
    var data = $('#benchMarking').serializeArray();
    data.push({name: "page", value: Page});
    $.ajax({
        url: '/colleges/state-wise-application',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
	    $(".daywiseProjection").show();
        $('#day_load_more_results_msg').html('');
        $('#day_load_more_button').show();

        if (data == "session_logout") {
            window.location.reload(true);
        } else if (data == "record_not_found") {
            error_html = "No Records found";
            $('#state_benchMarkingHtml').html("");
            $('#state_benchMarkingHtml').html("<div class='noDataFoundBlock'><div class='innerHtml'><img src='/img/no-record.png' alt='no-record'><span>" + error_html + "</span></div></div>");
            $('#state_benchMarkingHtml').parent().removeClass('table-border');
        } else if (data == 'invalid_request') {
            error_html = "Invalid Request";
        $('#state_benchMarkingHtml').html("");
            $('#state_benchMarkingHtml').html("<table class='table table-striped list_data'><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>" + error_html + "</h4></div></div> </td></tr><tr></tr></tbody></table>");   
        } else if (data == 'select_college' || data == 'select_form') {
            error_html = "Please Select Institute";
            if(data == 'select_form'){
                error_html = "Please Select Form";
            }
            $('#state_benchMarkingHtml').html("<table class='table table-striped list_data'><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>" + error_html + "</h4></div></div> </td></tr><tr></tr></tbody></table>");
        } else if(data == 'correspondence_state_not_exits'){
		$("#statetrend, #state-wise-trends").hide();
		$('#statetrend').removeClass('active');
		$("#date-wise-trends").removeClass('active');
		$('#datetrend').removeClass('active');
		$("#daytrend").addClass("active");
		$("#day-wise-trends").addClass("active");
	    }else {
                $("#state_benchMarkingHtml").html(data);
                $('tbody').removeClass('fadeInUp');
                $('tbody').removeClass('animated');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
            table_fix_rowcol()
        }
    });
}

function loadBenchmarkData(type){
    if($("#benchmarking_college_id").val() === ''){
        $(".errorMessage").show();
        $(".dataView").hide();
        $("#errorMessage").html("<div id='load_msg_div'><div class='aligner-middle'><div class='text-center text-info font16'><span class='lineicon-43 alignerIcon'></span><br><span id='load_msg'>Please select an Institute from filter and click apply to view benchmarking dashboard.</span></div></div></div>");
        return false;
    }else if($("#form_id").val() === ''){
        $(".errorMessage").show();
        $(".dataView").hide();
        $("#errorMessage").html("<div id='load_msg_div'><div class='aligner-middle'><div class='text-center text-info font16'><span class='lineicon-43 alignerIcon'></span><br><span class='text-danger'>Please Select Form</span></div></div></div>");
        return false;
    }else{
        $("#form_name").html($('#form_id').find("option:selected").text());
        $(".dataView").show();
        $(".errorMessage").hide();
    }
    loadFilters();
    ajaxbenchMarking(type);
    benchmarReport();
//    loadGraphs();
    dayWiseProjecttion(type);
    stateWiseApplication(type);
}


function loadGraphs(){
    
    $('.errorMessage').hide();
    
    if($('#min_day').length>0 && isNaN(parseInt($('#min_day').val()))){
        $('#error_min_day').html("Enter From Day.");
        $('#error_min_day').show();
        return false;
    }
    
    if($('#max_day').length>0 && isNaN(parseInt($('#max_day').val()))){
        $('#error_max_day').html("Enter To Day.");
        $('#error_max_day').show();
        return false;
    }
    
    if(parseInt($('#max_day').val())<parseInt($('#min_day').val())){
        $('#error_max_day').html("Invalid To Day.");
        $('#error_max_day').show();
        return false;
    }else if(parseInt($('#max_day').val()) - parseInt($('#min_day').val())>365){
        $('#error_max_day').html("Max Range is 356 Day.");
        $('#error_max_day').show();
        return false;
    }
    //graph_type
    
    if($('#graph_type').length>0 && ($('#graph_type').val()=='' || $('#graph_type').val()=='null' || $('#graph_type').val()==null)){
        $('#error_graph_type').html("Please Select Leads, Applications");
        $('#error_graph_type').show();
        return false;
    }
    
    //$('.benchmark_graphs').hide();
    var data = $('#benchMarking').serializeArray();
    
    if($('#count_type').length>0 && $('#count_type').val()==""){
        data.push({name: "count_type", value: count_type});
    }
    
    
    
    $.ajax({
        url: '/colleges/load-benchmark-graph',
        type: 'post',
        dataType: 'json',
        data: data,
        beforeSend: function (xhr) {
            $('#listloader').show();
            $('#benchmarking_graph').html('');
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if (typeof data["error"] !="undefined" && data["error"] != "") {
                window.location.reload(true);
            }
            else{
                $('.benchmark_graphs').show();
                $('#heading_graph').html(data["title"]);
                makeLineCharts(data);
				$(document).resize(function(){
				  makeLineCharts(data);
				});

                //$("#benchMarkingHtml").append(data);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
            table_fix_rowcol()
        }
    });
}


function LoadReportDateRangepickerBenchMark() {
    $('.daterangepicker_report').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM',
            separator: ', ',
        },
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'left'
    }, function (start, end, label) {
        //console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
    });

    $('.daterangepicker_report').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM') + ',' + picker.endDate.format('DD/MM'));
    });

//    $('.daterangepicker_report').on('cancel.daterangepicker', function (ev, picker) {
//        $(this).val('');
//    });

}

function benchmarReport(){
    var data = $('#benchMarking').serializeArray();
    data.push({name: "page", value: Page});
    $.ajax({
        url: '/colleges/benchmarking-report',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('.benchMarkingReportDiv').show();
            if (data == "session_logout") {
                window.location.reload(true);
            } else if (data == "record_not_found") {
                error_html = "No More Record";
                $('#benchMarkingReport').html("");
                $('#benchMarkingReport').html("<table class='table table-striped list_data'><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>" + error_html + "</h4></div></div> </td></tr><tr></tr></tbody></table>");
                
                $('#headingProjection').hide();
            } else if (data == 'csrf_mismatched') {
                error_html = "Csrf Token Mismatched";
                $('#benchMarkingReport').html("");
                $('#benchMarkingReport').html("<table class='table table-striped list_data'><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>" + error_html + "</h4></div></div> </td></tr><tr></tr></tbody></table>");
                
                $('#headingProjection').hide();
            } else if (data == 'select_college' || data == 'select_form') {
                error_html = "Please Select Institute";
                 if(data === 'select_form'){
                    error_html = "Please Select Form";
                }
                $('#benchMarkingReport').html("");
                $('#headingProjection').hide();
                $('#benchMarkingReport').html("<tr><td colspan='10'><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>" + error_html + "</h4></div></div> </td></tr><tr></tr>");
                
            } else {
                $('#headingProjection').show();
                $('#benchMarkingReport').html("");
                $("#benchMarkingReport").append(data);
                $('tbody').removeClass('fadeInUp');
                $('tbody').removeClass('animated');
                loadGraphs();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
            table_fix_rowcol()
        }
    });
}

if($('.datewiseProjection').length>0){
    $(document).on('click', '.applyBtn', function () {
        ajaxbenchMarking('reset');
    });
}

function ResetbenchMarkingValue(){
    $('#benchMarking select#benchmarking_college_id').val('');
    $('#benchMarking select#benchmarking_college_id').trigger("chosen:updated");
    $('#benchMarking select#form_id').html('');
    $('#benchMarking select#form_id').trigger("chosen:updated");
    $(".errorMessage").show();
    $("#errorMessage").html("<div id='load_msg_div'><div class='aligner-middle'><div class='text-center text-info font16'><span class='lineicon-43 alignerIcon'></span><br><span>Please select an Institute from filter and click apply to view benchmarking dashboard.</span></div></div></div>");
    $(".benchMarkingReportDiv").hide();
    $(".benchmark_graphs").hide();
    $(".dateDaysTabs").hide();
}

if($('#download_day_wise').length>0){
    $(document).on('click','#download_day_wise',function(){
        $('#downloadType').val('download_day_wise');
        $("#benchMarking").submit();
        $('#downloadType').val('');
    });
}

if($('#download_date_wise').length>0){
    $(document).on('click','#download_date_wise',function(){
        $('#downloadType').val('download_date_wise');
        $("#benchMarking").submit();
        $('#downloadType').val('');
    });
}

if($('#download_application_projection').length>0){
    $(document).on('click','#download_application_projection',function(){
        $('#downloadType').val('download_application_projection');
        $("#benchMarking").submit();
        $('#downloadType').val('');
    });
}

if($('#download_state_wise').length>0){
    $(document).on('click','#download_state_wise',function(){
        $('#downloadType').val('download_state_wise');
        $("#benchMarking").submit();
        $('#downloadType').val('');
    });
}

function getBenchmarkingEnableForm(collegeId){
    if(collegeId === ''){
        $("#form_id").html('');
    }else{
        $.ajax({
            url : '/colleges/get-benchmarking-form',
            type : 'post',
            data : {collegeId :collegeId },
            dataType : 'json',
            async : false,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            error : function (xhr, ajaxOptions, thrownError){
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            },
            success : function(json) {
                if(json['redirect']){
                    location = json['redirect'];
                }
                if(json['error']){
                    alertPopup(json['error'],'error');
                }
                else if(json['status'] === 200 && typeof json['formList'] != 'undefined'){
                    var option = "<option value=''>Select Form</option>";
                    for(var formId in json['formList']){
                        option += "<option value='"+formId+"' >"+json['formList'][formId]+"</option>";
                    }
                    $("#form_id").html(option);
                } 
            }
        });
    }
    
    $('.chosen-select').chosen();
    $('.chosen-select').trigger('chosen:updated');
}


function loadFilters(collegeId){
    var data = $('#benchMarking').serializeArray();
    $.ajax({
        url : '/colleges/get-benchmarking-filter',
        type : 'post',
        data : data,
        dataType : 'json',
        async : false,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        error : function (xhr, ajaxOptions, thrownError){
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        success : function(json) {
            if(json['redirect']){
                location = json['redirect'];
            }
            if(json['error']){
                alertPopup(json['error'],'error');
            }
            else if(json['status'] === 200 && typeof json['Years'] != 'undefined'){
                var option = "";
                $.each(json['Years'], function (key, val) {
                    option += "<option value='"+key+"' selected='selected' >"+val+"</option>";
                });
                $("#years").html(option);
            } 
        }
    });
    
    $('#years')[0].sumo.reload();
    
}