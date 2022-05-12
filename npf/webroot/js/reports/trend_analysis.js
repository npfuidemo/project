//$.material.init();
$(document).ready(function () {
    //LoadReportDateRangepickerBenchMark();
    $('#rows').SumoSelect({placeholder: 'Select Row(s)', search: true, searchText: 'Select Row(s)', selectAll: true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false});
    $('#column').SumoSelect({placeholder: 'Select Column(s)', search: true, searchText: 'Select Column(s)', selectAll: true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false});
    
     $('#filter_rows').SumoSelect({placeholder: 'Select Row(s)', search: true, searchText: 'Select Row(s)', selectAll: true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false});
    $('#filter_cols').SumoSelect({placeholder: 'Select Column(s)', search: true, searchText: 'Select Column(s)', selectAll: true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false});
    
    $("#college_id").change(function(){
          loadDefaultReports();
    });
    $("#show_dependent").click(function(){
        if($("#show_dependent").is(":checked")){
            $("#show_dependent").val("yes");
        }else{
             $("#show_dependent").val("no");
        }
    });
    /*$("#filter_rows_3 , #filter_cols_3").change(function(){
        makePairValues(this);
    });*/
    
    
    $(document).on('change', "#form_id", function () {
        var formId = $("#form_id").val();
        $('#rows').removeAttr("disabled");
        $('#column').removeAttr("disabled");
        $('#show_dependent').removeAttr("disabled");
        $('#seacrhList').removeAttr("disabled");
        
        if(formId=="877"){
            $('#otherReport').fadeIn();
            loadDefaultReports();
            $('.errorMessage').hide();
            $('#rows').attr("disabled","disabled");
            $('#column').attr("disabled","disabled");
            $('#show_dependent').attr("disabled","disabled");
            $('#seacrhList').attr("disabled","disabled");
        }else{
            $('#otherReport').hide();
        }
        
        $('#table-data-view').fadeOut();
       
        if (formId == '0' && $('#rows').length>0 && $('#column').length>0) {
            getAllMachineKeys($("#college_id").val());
            
            //rows
//            $('#trendAnalysis select#rows').val('');
//
//            //column
//            $('#trendAnalysis select#column').val('');
//
//            $('#rows')[0].sumo.reload();
//            $('#column')[0].sumo.reload();

        } else if($('#rows').length>0 && $('#column').length>0) {
            getTrendAnalysisRows();
        }
        
        $('#rows')[0].sumo.reload();
        $('#column')[0].sumo.reload();
    });
    
    
    if(typeof(jsVars.CollegeIDForOtherReport) !=='undefined' && 
            jsVars.CollegeIDForOtherReport==$('#college_id').val()) {
        
        loadDefaultReports();
    }else{
        if($("#college_id").val() > 0){
            getAllMachineKeys($("#college_id").val());  
        }
        trendAnalysis('reset');
    }
    
    
    
});

function loadCampusPos(){
    var campusPosition = jQuery('.benchmark_graphs').offset().top -70;
    $('html, body').animate({scrollTop: campusPosition}, 500);
}


function loadDefaultReports(){
    $('#table-data-view').hide();
    $('.errorMessage').show();
    $('#errorMessage').html("<p class='text-center text-danger'>Click search button to view report</p>");
     
    if(typeof(jsVars.CollegeIDForOtherReport) !=='undefined' && 
            jsVars.CollegeIDForOtherReport==$('#college_id').val()) {
            $('.errorMessage').hide();
            loadOtherReport('reset',1);
    } else {
        $('#liTabList').html('');
        $('#load_more_saved_results').html('');
        $('#load_more_saved_button').hide();
        $('#otherReport').hide();
		$('.srmReport').hide();
    }
}


function LoadFormsOnTrendAnalysis(value, default_val, multiselect, module) {
    var cid = $("#college_id").val();
    if (cid == '') {
        ResetTrendAnalysis();
    }
    if (typeof multiselect == 'undefined') {
        multiselect = '';
    }
    $.ajax({
        url: '/voucher/get-forms',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "college_id": value,
            "default_val": default_val,
            "multiselect": multiselect
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        async: false,
        success: function (data) {
            if (data == "session_logout") {
                window.location.reload(true);
            }
            $('#div_load_forms').html(data);
            $('.div_load_forms').html(data);
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            // Change Select box Caption for discount coupon module
            if (module == 'Discount Coupon') {
                $("#form_id_chosen input").val("Select Form");
            }
            if(default_val=="877"){
                $('#rows').attr("disabled","disabled");
                $('#column').attr("disabled","disabled");
                $('#show_dependent').attr("disabled","disabled");
                $('#seacrhList').attr("disabled","disabled");
            }
            
            //console.log(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getTrendAnalysisRows() {

    var data = $('#trendAnalysis').serializeArray();
    $.ajax({
        url: '/reports/get-trend-analysis-rows',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        async: false,
        success: function (data) {
            if (data['error'] == "session_logout") {
                window.location.reload(true);
            } else if (data['error']) {
               alert(data['error']);
            } else if (data['status'] == 200) {
                var fields = "<option value=''>Select Rows</option><optgroup label='Fields'>"+data['options'].userOption+data['options'].formOprion+"</optgroup>";
                if(data['options'].intakeOption != '') {
                    fields +='<optgroup label="Intake">';
                    fields +=data['options'].intakeOption;
                    fields +='</optgroup>';
                }
                $("#rows").html(fields);
                $('#rows').trigger("chosen:updated");
                $("#column").html(data['options'].column);//only form in column
                $('#column').trigger("chosen:updated");
                $('#rows')[0].sumo.reload();
                $('#column')[0].sumo.reload();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function trendAnalysis(type) {
    if (type == 'reset') {
        Page = 0;
    }
    if($("#rows option:selected").val() == ''){
        error_html = "Please Select Row";
        $('#errorMessage').html("<p class='text-center text-danger'>" + error_html + "</p>");
        $('#load_more_results').html("");
        $('#load_more_button').hide();
        $('.trend_analysis').hide();
        $('.errorMessage').show();
        return false;
    }
    if($("#column option:selected").val() == ''){
        error_html = "Please Select Column";
        $('#errorMessage').html("<p class='text-center text-danger'>" + error_html + "</p>");
        $('#load_more_results').html("");
        $('#load_more_button').hide();
        $('.trend_analysis').hide();
        $('.errorMessage').show();
        return false;
    }
    $("#row_header_name").val($("#rows option:selected").text());
    $('#headingStr').html($("#rows option:selected").text()+" vs "+$("#column option:selected").text());
    var data = $('#trendAnalysis').serializeArray();
    data.push({name: "page", value: Page});
    
    var formId = $("#form_id").val();

    if(formId=="877"){
       $('#otherReport').show();
	   $('.srmReport').show();
       return;
    }else{
       $('#otherReport').hide();
	   $('.srmReport').hide();
    }
   
    $.ajax({
        url: '/reports/ajax-trend-analysis',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            
            if (data == "nothing_show") {
                // do nothing
                $('#load_more_button').hide();
                $('#errorMessage').html('');
                $("#download_data").hide();
                return false;
            }
            $('#load_more_results_msg').html('');
            $('#load_more_button').show();
            $('.trend_analysis').show();
            $("#download_data").show();
            Page = Page + 1;
            if (data == "session_logout") {
                window.location.reload(true);
            }else if (data == "record_not_found") {
                if (Page == 1) {
                    error_html = "<i class='fa fa-database' aria-hidden'true'></i> No More Record";
                    $('#load_more_results').html("");
                    $("#download_data").hide();
                } else {
                    error_html = "<i class='fa fa-database' aria-hidden'true'></i> No More Record";
                }
                $('#load_more_results_msg').html("<p class='text-center text-danger'>" + error_html + "</p>");
                $('#load_more_button').hide();
                $('#errorMessage').html('');
                
            } else if (data == 'csrf_mismatched') {
                error_html = "Csrf Token Mismatched";
                $('#errorMessage').html("<p class='text-center text-danger'>" + error_html + "</p>");
                $('#load_more_results').html("");
                $('#load_more_button').hide();
                $('.trend_analysis').hide();
                $('.errorMessage').show();
            } else if (data == 'select_college') {
                error_html = "Please Select Institute";
                $('#errorMessage').html("<p class='text-center text-danger'>" + error_html + "</p>");
                $('#load_more_results').html("");
                $('#load_more_button').hide();
                $('.trend_analysis').hide();
                $('.errorMessage').show();
            } else if (data == 'select_form') {
                error_html = "Please Select Form";
                $('#errorMessage').html("<p class='text-center text-danger'>" + error_html + "</p>");
                $('#load_more_results').html("");
                $('#load_more_button').hide();
                $('.trend_analysis').hide();
                $('.errorMessage').show();
            } else if (data == 'select_rows') {
                error_html = "Please Select Rows";
                $('#errorMessage').html("<p class='text-center text-danger'>" + error_html + "</p>");
                $('#load_more_results').html("");
                $('#load_more_button').hide();
                $('.trend_analysis').hide();
                $('.errorMessage').show();
            } else if (data == 'select_column') {
                error_html = "Please Select Column";
                $('#errorMessage').html("<p class='text-center text-danger'>" + error_html + "</p>");
                $('#load_more_results').html("");
                $('#load_more_button').hide();
                $('.trend_analysis').hide();
                $('.errorMessage').show();
            } else if (data == 'rows_col_same') {
                error_html = "Columns and rows are same, please select different rows and column";
                $('#errorMessage').html("<p class='text-center text-danger'>" + error_html + "</p>");
                $('#load_more_results').html("");
                $('#load_more_button').hide();
                $('.trend_analysis').hide();
                $('.errorMessage').show();
            } else {
                if (type == 'reset') {
                    $('#load_more_results').html("");
                }
                $("#load_more_results").append(data);
                var current_records = $("#current_record").val();
                if (current_records < jsVars.PagePerRecord) {
                    $('#load_more_button').hide();
                    $('#load_more_results_msg').html("<p class='text-center text-danger'><i class='fa fa-database' aria-hidden'true'></i> No More records</p>");
                }
                $('.errorMessage').hide();
            }
            if($('.intakecount').length > 0) {
                var sum = 0;
                $('.intakecount').each(function(index, element) {
                    sum += parseInt($(element).html());
                });
                $('.intaketotalcount').html(sum);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
            //table_fix_rowcol()
        }
    });

}

function ResetTrendAnalysis() {
    //college_id
    $('#trendAnalysis select#college_id').val('');
    $('#trendAnalysis select#college_id').trigger("chosen:updated");
    //form_id
    $('#trendAnalysis select#form_id').val('');
    $('#trendAnalysis select#form_id').trigger("chosen:updated");
    //rows
    $('#trendAnalysis select#rows').val('');

    //column
    $('#trendAnalysis select#column').val('');


    $('select#rows')[0].sumo.reload();
    $('select#column')[0].sumo.reload();
    //hide table-data-view
    $("#table-data-view").hide();
    $("#errorMessage").html("<p class='text-center text-danger'>Please select an Institute and click Search to view Data.</p>");
    $(".errorMessage").show();

}

// this will bind all sorting icon.
$(document).on('click', 'span.sorting_span i', function () {
    
    if($(this).parent().hasClass('campusWise')===true) {
        var field = jQuery(this).data('column');
        var data_sorting = jQuery(this).data('sorting');
        $("#campusWiseSortField").val(field);
        $("#campusWiseSortOrder").val(data_sorting);
        loadCampusWiseData('reset');
    }else if($(this).parent().hasClass('savedReportSpan')===true) {
        jQuery("span.savedReportSpan i").removeClass('active');
        var field = jQuery(this).data('column');
        var data_sorting = jQuery(this).data('sorting');
        $('#saved_sort_options').val(field + "|" + data_sorting);
        
        //Load Report
        loadOtherTrendAnalysisReport('reset',$('ul#liTabList li.active >a').data('id'));
        
    } else{ 
        jQuery("span.sorting_span i").removeClass('active');
        var field = jQuery(this).data('column');
        var data_sorting = jQuery(this).data('sorting');
        $('#sort_options').val(field + "|" + data_sorting);
        jQuery(this).addClass('active');
        //client health monitoring
        trendAnalysis('reset');
        //jQuery(this).data('sorting').attr('class','active');
    }
});


if ($('#download_data').length > 0) {
    $(document).on('click', '#download_data', function () {
        $('#downloadType').val('download_trend_analysis');
        exportTrendAnalysisReport();
        $('#downloadType').val('');
    });
}
//download_data_saved
if ($('#download_data_saved').length > 0) {
    $(document).on('click', '#download_data_saved', function () {
        $('#downloadType').val('download_trend_analysis_saved');
        $("#trendAnalysis").submit();
        $('#downloadType').val('');
    });
}

function loadOtherReport(type,report_type){
    $.ajax({
        url: '/reports/get-trend-analysis',
        type: 'post',
        dataType: 'json',
        async:false,
        data: {s_college_id: $('#college_id').val(),'report_id':report_type},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if (json['error'] == "session_logout") {
                window.location.reload(true);
            } else if (json['error']) {
                alertPopup(json['error']);
            } else if (json['status'] == 200) {
                $("#liTabList").html(json['data']['header']); 
                
                
                if(json['data']['tab_id']=="3"){
                    $("#filter_rows").html("");
                    $("#filter_cols").html("");
                    
                    $(".report_id_1_2").hide();
                    $(".report_id_3").show();
                    
                    $("#filter_rows_3").html(json['data']['rows']); 
                    $("#filter_cols_3").html(json['data']['cols']); 
                    
                    $('#filter_rows_3, #filter_cols_3').trigger("chosen:updated");
    
                }else{
                    $(".filter_rows_3").html("");
                    $(".filter_cols_3").html("");
                    
                    $(".report_id_3").hide();
                    $(".report_id_1_2").show();
                    
                    $("#filter_rows").html(json['data']['rows']); 
                    $("#filter_cols").html(json['data']['cols']); 
                    if(json['data']['rows']!="")$('#filter_rows')[0].sumo.reload();
                    if(json['data']['cols']!="")$('#filter_cols')[0].sumo.reload();
                }
                
               
                
                loadOtherTrendAnalysisReport('reset',report_type);
                
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
    $('#otherReport').show();
	$('.srmReport').show();
}

function searchOtherReport(elem){
    var report_id = $("#report_id").val();
    if(report_id=="3"){
        makePairValues(elem);
    }
    loadOtherTrendAnalysisReport('reset', report_id);
}


function makePairValues(elem){
    if(elem.id=="filter_rows_3"){
        var val =$('#filter_rows_3').val();
        if(val=="fd|field_48813"){
            cols_val="fd|field_48812";
            $('#filter_cols_3').val(cols_val);
        }
        else if(val=="fd|field_48884"){
            cols_val="fd|field_48889";
            $('#filter_cols_3').val(cols_val);
        }
        else if(val=="fd|field_48891"){
            cols_val="fd|field_48890";
            $('#filter_cols_3').val(cols_val);
        }
        
        if(val=="fd|specialization"){
            $('#filter_cols_3').val("fd|campus");
        }
        else if(val=="fd|specialization_one"){
            $('#filter_cols_3').val("fd|campus_one");
        }
        else if(val=="fd|specialization_two"){
            $('#filter_cols_3').val("fd|campus_two");
        }
    }else{
        
        var val =$('#filter_cols_3').val();
        if(val=="fd|field_48812"){
            rows_val="fd|field_48813";
            $('#filter_rows_3').val(rows_val);
        }
        else if(val=="fd|field_48889"){
            rows_val="fd|field_48884";
            $('#filter_rows_3').val(rows_val);
        }
        else if(val=="fd|field_48890"){
            rows_val="fd|field_48891";
            $('#filter_rows_3').val(rows_val);
        }
        
        if(val=="fd|campus"){
            $('#filter_rows_3').val("fd|specialization");
        }
        else if(val=="fd|campus_one"){
            $('#filter_rows_3').val("fd|specialization_one");
        }
        else if(val=="fd|campus_two"){
            $('#filter_rows_3').val("fd|specialization_two");
        }
    }
    
    $('#filter_rows_3, #filter_cols_3').trigger("chosen:updated");
}


var PageOther=0;
function loadOtherTrendAnalysisReport(type,report_id) {
    if (type == 'reset') {
        PageOther = 0;
        $('ul#liTabList li').removeClass('active');        
        $('#tab_id_'+report_id).parent('li').attr('class','active');
        
        $('.other_report_info').hide();
        $('#info_'+report_id).fadeIn();
    }   
    
    if(typeof report_id =='undefined') {
       report_id= $('ul#liTabList li.active >a').data('id');
    }
    $("#report_id").val(report_id);
    $.ajax({
        url: '/reports/ajax-saved-analysis-report',
        type: 'post',
        dataType: 'html',
        data: {report_id: report_id,type:type,s_college_id:$('#college_id').val(),saved_sort_options:$('#saved_sort_options').val(),
            PageOther:PageOther,other_report_rows:$("#filter_rows").val(),other_report_cols:$("#filter_cols").val(),other_report_rows_3:$("#filter_rows_3").val(),
            other_report_cols_3:$("#filter_cols_3").val(),payment_status_filter:$("#payment_status_filter_srm").val()},
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#load_more_saved_results_msg').html('');
            $('#load_more_saved_button').show();
            $("#download_data_saved").show();
            PageOther = PageOther + 1;
            if (data == "session_logout") {
                window.location.reload(true);
            }else if (data == "record_not_found") {
                if(PageOther==1){
                    error_html="<i class='fa fa-database' aria-hidden'true'></i> No More Record";
                    $('#load_more_saved_results').html("")
                }else {
                    error_html="<i class='fa fa-database' aria-hidden'true'></i> No More Record";
                }
                $('#load_more_saved_results_msg').html("<p class='text-center text-danger'>"+error_html+"</p>");
                $('#load_more_saved_button').hide();
                $("#download_data_saved").hide();
            }else if(data == 'csrf_mismatched'){
                error_html="Csrf Token Mismatched";
                $('#errorMessage').html("<p class='text-center text-danger'>"+error_html+"</p>");
                $('#load_more_saved_results').html("");
                $('#load_more_saved_button').hide();                
                $('.errorMessage').show();
            }
            else{
                if (type == 'reset') {
                    $('#load_more_saved_results').html("");
                }
                $("#load_more_saved_results").append(data);
                var saved_current_record = $("#saved_current_record").val();  
                
                if(saved_current_record<jsVars.PagePerRecord){
                    $('#load_more_saved_button').hide();
                }else {                    
                    $('#load_more_saved_button').show();
                }
                $('.errorMessage').hide();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
            //table_fix_rowcol()
        }
    });

}


function getAllMachineKeys(collegeId) {

   if(collegeId == '' || collegeId == '0'){
        $('#trendAnalysis select#rows').val('');
        $('#trendAnalysis select#column').val('');
        $('#trendAnalysis select#rows')[0].sumo.reload();
        $('#trendAnalysis select#column')[0].sumo.reload();
       return false;
   }
    $.ajax({
        url: '/reports/get-all-machine-keys',
        type: 'post',
        dataType: 'json',
        data: {collegeId : collegeId},
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if (data['error'] == "session_logout") {
                window.location.reload(true);
            } else if (data['error']) {
                alertPopup(data['error']);
            } else if (data['status'] == 200) {
                $("#rows").html(data['options'].rowOption);
                $("#column").html(data['options'].columnOption);
                $('#rows').trigger("chosen:updated");
                $('#column').trigger("chosen:updated");
                $('#rows')[0].sumo.reload();
                $('#column')[0].sumo.reload();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
        }
    });

}

function exportTrendAnalysisReport(){
    var $form = $("#trendAnalysis");
    $("#row_header_name").val($("#rows option:selected").text());
    $form.attr("action",jsVars.exportTrendAnalysisCsvLink);
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

function loadCampusWiseData(listingType,campusChanged){
    if( typeof $("#campusWiseCollegeId").val()==="undefined" || 
            $("#campusWiseCollegeId").val() ===null || 
            $("#campusWiseCollegeId").val()==='' || 
            typeof $("#campusWiseFormId").val()==="undefined" || 
            $("#campusWiseFormId").val() ===null || 
            $("#campusWiseFormId").val()==='') {
        return;
    }
    if(typeof listingType !=="undefined" && listingType==='reset'){
        $("#campusWisePageNo").val("1");
    }
    
    if( $("#campusWisePageSizeSelect").length && $("#campusWisePageSizeSelect").val()!=''){
        $("#campusWisePageSize").val($("#campusWisePageSizeSelect").val());
    }
    var data = $('#campusWiseTrendAnalysis').serializeArray();
    $.ajax({
        url: '/reports/loadCampusWiseData',
        type: 'post',
        data: data,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#listloader').show();
        },
        complete: function () {
            $('#listloader').hide();
        },
        success: function (html) {            
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                return;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
                $('#LoadMoreArea').hide();
            }else{
                var countRecord = countResult(html);
                html = html.replace("<head/>", "");
                if(listingType === 'reset'){
                    $('#campusWiseData').html(html);
                    $('.chosen-select').chosen();
                    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
               }else{
                    $('#campusWiseData').find("tbody").append(html);
                }
                if(countRecord < parseInt($("#campusWisePageSize").val())){
                    $('#campusWiseLoadMoreArea').hide();
                }else{
                    $('#campusWiseLoadMoreArea').show();
                }
                $("#campusWisePageNo").val(parseInt($("#campusWisePageNo").val())+1);
            }
            if(typeof campusChanged!=='undefined' && campusChanged===true){
                loadCampusPos();
            }
            //table_fix_rowcol();
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

function changeCampus(campus){
    $('#campus').val(campus);    
    $('#campusToDownload').val(campus);    
    $("#infoCampus").html(campus);
    loadCampusWiseGraph('dayWise');
    changeReportType('stateWise',true);    
}

function changeReportType(reportType,campusChanged){
    $('#reportType').val(reportType);
    loadCampusWiseData('reset',campusChanged);
    $(".liReportType").removeClass('active');
    $("#type_"+reportType).addClass('active');
}

function exportCampusWiseCsv(){
    $("#campusWiseTrendAnalysis").submit();

}

function loadCampusWiseGraph(graphType){
    
    $('.errorMessage').hide();

    if(typeof graphType=="undefined" || graphType==null){
        graphType   = $("#campusWiseGraphType").val();
    }
    
    if(typeof graphType=="undefined" || graphType==null){
        return false;
    }
    
    if($('#campusWiseGraphStartDay').length>0 && isNaN(parseInt($('#campusWiseGraphStartDay').val()))){
        $('#error_min_day').html("Enter From Day.");
        $('#error_min_day').show();
        return false;
    }
    
    if($('#campusWiseGraphEndDay').length>0 && isNaN(parseInt($('#campusWiseGraphEndDay').val()))){
        $('#error_max_day').html("Enter To Day.");
        $('#error_max_day').show();
        return false;
    }
    
    if(parseInt($('#campusWiseGraphStartDay').val())<1){
        $('#error_min_day').html("Invalid From Day.");
        $('#error_min_day').show();
        return false;
    }else if(parseInt($('#campusWiseGraphEndDay').val())<parseInt($('#campusWiseGraphStartDay').val())){
        $('#error_max_day').html("Invalid To Day.");
        $('#error_max_day').show();
        return false;
    }else if(parseInt($('#campusWiseGraphEndDay').val()) - parseInt($('#campusWiseGraphStartDay').val())>365){
        $('#error_max_day').html("Max Range is 365 Day.");
        $('#error_max_day').show();
        return false;
    }
    
    $("#campusWiseGraphType").val(graphType);
    $(".dayWiseli").removeClass('active');
    $(".cumulativeli").removeClass('active');
    $("."+graphType+"li").addClass('active');
    
    var data    = {
        'collegeId':$('#campusWiseCollegeId').val(), 
        'formId':$('#campusWiseFormId').val(), 
        'startDay':$('#campusWiseGraphStartDay').val(), 
        'endDay':$('#campusWiseGraphEndDay').val(),
        'graphType':graphType, 
        'campus' :  $('#campus').val()
    };
    
    $.ajax({
        url: '/reports/loadCampusWiseGraph',
        type: 'post',
        dataType: 'html',
        data: data,
        async:false,
        beforeSend: function (xhr) {
            $('#listloader').show();
            $('#campusWiseGraph').html('');
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (response) {
            if (response === 'session'){
                window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                return;
            }
            var responseObject = $.parseJSON(response); 
            if (responseObject.message === 'session'){
                window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                var data    = responseObject.data.graphData;
                data['id_container']    = "campusWiseGraph";
                data['title']          = "Applications";
                data['hTitle']          = "Days";
                data['sub_title']       = "";
                makeLineCharts(data);
                $(document).resize(function(){
                  makeLineCharts(data);
                });
                loadCampusPos();
            }else{
                alertPopup(responseObject.message,'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
        }
    });
    
}

function alertPopup(msg, type, location) {

    if (type == 'error') {
        var selector_parent = '#ErrorPopupArea';
        var selector_titleID = '#ErroralertTitle';
        var selector_msg = '#ErrorMsgBody';
        var btn = '#ErrorOkBtn';
        var title_msg = 'Error';
    } else {
        var selector_parent = '#SuccessPopupArea';
        var selector_titleID = '#alertTitle';
        var selector_msg = '#MsgBody';
        var btn = '#OkBtn';
        var title_msg = 'Success';
    }

    $(selector_titleID).html(title_msg);
    $(selector_msg).html(msg);
    $('.oktick').hide();

    if (typeof location != 'undefined') {
        $(btn).show();

        $(selector_parent).modal({keyboard: false}).one('click', btn, function (e) {
            e.preventDefault();
            window.location.href = location;
        });
    }
    else {
        $(selector_parent).modal();
    }
}

function downloadCampusApplication(){
    var $form = $("#campusWiseApplicationDownload");

    $form.attr("action",'/applications/ajax-lists');
    $form.attr("target",'modalIframe');
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    $form.submit();
    $form.attr("onsubmit",onsubmit_attr);
    $form.removeAttr("target");
}
var downloadDetailReportFile = function(url){
    window.open(url, "_self");
};


function getRegistrationFilters() {
    var collegeId = $("#college_id").val();
    var formId = $("#form_id").val();
    $("#registerationFilter").show();
    if(!collegeId){
        return false;
    }
    
    if(formId > 0){
        $("#university_id").val('');
        $("#course_id").val('');
        $("#specialization_id").val('');
        $("#registerationFilter").hide();
        return false;
    }
    $('#registerationFilter').html('');
    var data = $('#trendAnalysis').serializeArray();
    $.ajax({
        url: jsVars.FULL_URL+'/reports/get-registration-filters',
        type: 'post',
        dataType: 'json',
        data: {'collegeId':collegeId},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        async: false,
        success: function (data) {
            if (data['error'] == "session_logout") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (data['error']) {
               alert(data['error']);
            } else if (data['status'] == 200) {
                  var html = "";
                  for (var key in data["selectedFields"]){
                        var fieldId         = key;
                        var dependentId     = 'ud\\\\|'+data["selectedFields"][key];
                        var selectNameValue = fieldId.replace("_id"," ");
                        selectNameValue = selectNameValue.charAt(0).toUpperCase() + selectNameValue.slice(1);
                        html+="<div class='fieldtab'><select name='"+fieldId+"' id='"+fieldId+"' class='chosen-select' , tabindex = '4', label = false, onChange = 'GetChildForDependentField(this,\""+dependentId+"\"\,\""+data["selectedFields"][key]+"\"\);'>";
                      
                        if (data[fieldId] !== 'undefined') {
                            html+="<option value=''>Select "+selectNameValue+"</option>";
                            for (var fieldkey in data[fieldId]){
                                html+="<option value='"+fieldkey+"'>"+data[fieldId][fieldkey]+"</option>";
                            }
                        }
                        html+="</select></div>";
                  }
                  
                  $('#registerationFilter').html(html);
                  $('#university_id').chosen();
                  $('#course_id').chosen();
                  $('#specialization_id').chosen();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function GetChildForDependentField(elem, ContainerId, Choose) {
    if (elem && ContainerId) {
        var key = $(elem).val();
        
        if(Choose === 'course_id'){
            $("#specialization_id").html('');
        }
                  
        $.ajax({
            url: jsVars.FULL_URL+'/common/GetChildByMachineKeyForRegistration',
            type: 'post',
            dataType: 'json',
            data: {key: key},
            async: false,
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) {
                if (json['redirect']) {
                    location = json['redirect'];
                }
                if (json['error']) {
                    alertPopup(json['error'], 'error');
                } else if (json['success']) {
                    var selectNameValue = Choose.replace("_id"," ");
                    selectNameValue = selectNameValue.charAt(0).toUpperCase() + selectNameValue.slice(1);
                    var html = '<option value="">Select ' + selectNameValue + '</option>';
                    html    += '<option value="0">'+ selectNameValue + ' Not Available</option>';
                    for (var key in json['list']) {
                        html += '<option value="' + key +'">' + json['list'][key] + '</option>';
                    }
                    $("#"+Choose).html(html);
                    $('.chosen-select').chosen();
                    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                    $('.chosen-select').trigger('chosen:updated');
                    
                    trendAnalysis('reset');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
    return false;
}