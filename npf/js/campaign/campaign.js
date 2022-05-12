$(document).on('change','#FilterCampaignForm select#college_id', function (){
    //LoadCampaignPatterns(this.value);
    /*$('.div_form').remove();
    $('.custom_li_filter').remove();
    $('.custom_li_filter_college').remove();
    $('.div_college').remove();
    
    // show view by
    $('#view_by_select').show();
    $('#view_by').val('');*/
});

$(document).ready(function(){
    google.charts.load("current", {packages:['corechart']});
   //if college is pre selected,trigger search btn 
   if(typeof jsVars.TriggerCampaignMangerSearchBtn != 'undefined')
   {
       $('#main_button').trigger('click');
   }
   
   // add custom for campaign detail graph view on chage event
   $('#date_range_graph').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
        GetCampaignDataForGraph();
    });
   $('#date_range_graph').on('cancel.daterangepicker', function (ev, picker) {
         $(this).val('');
        GetCampaignDataForGraph();
    });
    
    $('#dateRangeDisposition').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
        searchDispositionDetails('again');
    });
    $('#dateRangeDisposition').on('cancel.daterangepicker', function (ev, picker) {
         $(this).val('');
        searchDispositionDetails('again');
    });
    
    if($("#filterLeadDispostionForm #college_id").length >0 && $("#college_id").val() != ''){
        intializeDisposition();
    }
    
    if($("#filterLeadDispostionForm #college_id").length>0){
        $("#filterLeadDispostionForm #college_id").on('change',function(){
            $("input[name='filters[d_college_id]']").val($("#filterLeadDispostionForm #college_id").val()); 
        });
    }
    
    });


    $(window).load(function() {
        if($("#college_id").length >0 && $("#college_id").val() != ''){
            $("#graphDiv").hide();
            intializeDashboard();
        }

    });
    

function LoadSources(pattern_id){
       $('#source_value').html("");
       $('.source_value').fadeOut();
        $('#medium_value').html("");
       $('.medium_value').fadeOut();
       $('#name_value').html("");
       $('.name_value').fadeOut();
       var college_id=$('#college_id').val();
       // var data = $('#FilterCampaignForm').serializeArray();
        $.ajax({
            url: '/campaigns/get-source-values',
            type: 'post',
            dataType: 'html',
            //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
            data: 'pattern_id='+pattern_id+'&college_id='+college_id,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                data = data.replace("<head/>", '');
              //console.log(data);
              //return false;
                if (data == "session_logout") {
                    window.location.reload(true);
                }else if (data == "select_college") {
                    //$('#load_slider_data').html("<div class='alert alert-danger'>Please select college to view their leads.</div>");
                }else {
                     var res_data=JSON.parse(data);
                   
                    
                    if(res_data.data!=""){
                        $('#source_value').html(res_data.data);
                        $('.source_value').fadeIn();
                        
                        $('#d_source, #tab_chart_source').html(res_data.head_source);
                        $('#d_medium, #tab_chart_medium').html(res_data.head_medium);
                        $('#d_name').html(res_data.head_name);
                        
                        
                        
                        if(res_data.head_medium=="") {
                            $('#th_medium, #chart_medium').hide();
                        }else {
                             $('#th_medium, #chart_medium').show();
                        }
                        if(res_data.head_name=="") {
                            $('#th_name').hide();
                        }else{
                             $('#th_name').show();
                        }
                        
                    }
                    $('select').trigger("chosen:updated");
//                    $.material.init();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        return false;
}

function LoadMedium(source){
       $('#medium_value').html("");
       $('.medium_value').fadeOut();
       $('#name_value').html("");
       $('.name_value').fadeOut();
       
       pattern_id=$('#pattern_id').val();
        var college_id=$('#college_id').val();
        $.ajax({
            url: '/campaigns/get-medium-values',
            type: 'post',
            dataType: 'html',
            //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
            data: 'source='+source+'&pattern_id='+pattern_id+'&college_id='+college_id,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                data = data.replace("<head/>", '');
              //console.log(data);
              //return false;
                if (data == "session_logout") {
                   window.location.reload(true);
                }else if (data == "select_college" || data == "error") {
                    //$('#load_slider_data').html("<div class='alert alert-danger'>Please select college to view their leads.</div>");
                    $('#medium_value').html("");
                    $('.medium_value').hide();
                }else {
                    if(data!=""){
                        $('#medium_value').html(data);
                        $('.medium_value').fadeIn();
                    }
                }
                 $('select').trigger("chosen:updated");
//                 $.material.init();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        return false;
}

function LoadCampaign(medium){
       $('#name_value').html("");
       $('.name_value').fadeOut();
       
       pattern_id=$('#pattern_id').val();
       source=$('#source_value').val();
       var college_id=$('#college_id').val();
        
        $.ajax({
            url: '/campaigns/get-campaign-values',
            type: 'post',
            dataType: 'html',
            //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
            data: 'pattern_id='+pattern_id+'&source='+source+'&medium='+medium+'&college_id='+college_id,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                data = data.replace("<head/>", '');
              //console.log(data);
              //return false;
                if (data == "session_logout") {
                    window.location.reload(true);
                }else if (data == "select_college" || data == "error") {
                    //$('#load_slider_data').html("<div class='alert alert-danger'>Please select college to view their leads.</div>");
                    $('#name_value').html("");
                    $('.name_value').hide();
                }else {
                    if(data!=""){
                        $('#name_value').html(data);
                        $('.name_value').fadeIn();
                    }
                }
                $('select').trigger("chosen:updated");
//                $.material.init();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        return false;
}

function LoadCampaignPatterns(college_id){
        $('#source_value,#medium_value, #name_value').html("");
        $('#source_value,#medium_value, #name_value').trigger("chosen:updated");
        $('.source_value, .medium_value, .name_value').fadeOut();
        $.ajax({
            url: '/campaigns-mamnager/get-patterns',
            type: 'post',
            dataType: 'html',
            //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
            data: 'college_id='+college_id,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                data = data.replace("<head/>", '');
              //console.log(data);
              //return false;
                if (data == "session_logout") {
                    window.location.reload(true);
                }else if (data == "select_college") {
                    //$('#load_slider_data').html("<div class='alert alert-danger'>Please select college to view their leads.</div>");
                }else {
                    $('#pattern_id').html(data);
                    $('select').trigger("chosen:updated");
                    //$.material.init();
                    //LoadOwl();
                }
                //console.log(data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        return false;
}

function loadSliderData() {
        
        var data = $('#FilterCampaignForm').serializeArray();
        $('#load_slider_data').hide();

        $.ajax({
            url: '/campaigns/load-slider-data',
            type: 'post',
            dataType: 'html',
            //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
            data: data,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                data = data.replace("<head/>", '');
              //console.log(data);
              //return false;
                if (data == "error") {
                    //$('#load_slider_data').html("<div class='alert alert-danger'>No Records</div>");
                }else if (data == "select_college") {
                    $('#impressions_count').html("");
                    $('#registrations_count').html("");
                    $('#conversions_count').html("");
                    $('#load_slider_data').hide();
                    //$('#load_slider_data').html("<div class='alert alert-danger'>Please select college to view their campaign.</div>");
                }else {
                        var res_data=JSON.parse(data);
                        //console.log(res_data.impressions_count);
                        
                        $('#impressions_count').html(res_data.impressions_count);
                        $('#registrations_count').html(res_data.registrations_count);
                        $('#conversions_count').html(res_data.conversions_count);
                        $('#load_slider_data').fadeIn();
                        
                        //create funnel chart
                        $('#FunnelChartContainer #FunnelChartImpression').text(res_data.impressions_count);
                        $('#FunnelChartContainer #FunnelChartRegistrations').text(res_data.registrations_count);
                        $('#FunnelChartContainer #FunnelChartConversions').text(res_data.conversions_count);
                        LoadFunnelChart();
                }
                //console.log(data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
    

function setSortOrder(field, order){
    $('i.fa-caret-up, i.fa-caret-down ').hide();
    $('.sortingIcon').show();
    if(order=="asc"){
        $('a#a_'+field+' i.fa-caret-up').show();
        $('a#a_'+field).removeAttr("onClick");
        $('a#a_'+field).attr("onClick","setSortOrder('"+field+"','desc');");
        $('a#a_'+field+' .sortingIcon').hide();
    }else{
        $('a#a_'+field+' i.fa-caret-down').show();
        $('a#a_'+field).removeAttr("onClick");
        $('a#a_'+field).attr("onClick","setSortOrder('"+field+"','asc');");
        $('a#a_'+field+' .sortingIcon').hide();
    }
    
     $('#sort_by').val(field);
     $('#sort_order').val(order);
     LoadMoreCampaigns("sorting");
    
}

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

Page=0;

function LoadMoreCampaigns(type) {
        if (type == 'reset') {
            $('i.fa-caret-up, i.fa-caret-down ').hide();
            loadSliderData();
            Page = 0;
            $('#load_more_results').html("");
            $('#load_more_results_msg').html("");
            $('#load_more_button').show();
            $('#load_more_button').html("Loading...");
            $('#table_data').hide();
            $('#main_button').attr("disabled","disabled");
            
            // make the tabular view active when search button is pressed.
            showHideTabularTab("1a");
            // end of tabular view logic
           
            //$('.chosen-select').chosen();
            //$('.chosen-select-deselect').chosen({allow_single_deselect: true});
        }
        else if (type == 'sorting') {
            Page = 0;
            $('#load_more_results').html("");
            $('#load_more_results_msg').html("");
            $('#load_more_button').show();
            $('#load_more_button').html("Loading...");
        }
        
        $('#export').remove();

        var data = $('#FilterCampaignForm').serializeArray();
        data.push({name: "page", value: Page});

        $('#load_more_button').attr("disabled", "disabled");
        $('#load_more_button').html("Loading...");
        $.ajax({
            url: '/campaigns/ajax-lists',
            type: 'post',
            dataType: 'html',
            //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
            data: data,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                data = data.replace("<head/>", '');
                Page = Page + 1;
                //console.log(data);
                if (data == "session_logout") {
                    window.location.reload(true);
                }
                else if (data == "error") {
                    if(Page==1){
                        error_html="No Records found";
                        $('#load_slider_data').hide();
                    }
                    else error_html="No More Record";
                    $('#load_more_results_msg').append("<div class='col-md-12'><table class='table table-striped list_data table-border'><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'> "+error_html+" </h4></div></div> </td></tr><tr></tr></table></div>");
                    $('#load_more_button').html("Load More Campaigns");
                    $('#load_more_button').hide();
                      if (type != '' && Page==1) {
                            $('#if_record_exists, #table_data').hide();
                            
                      }
                }else if (data == "select_college") {
                    $('#load_more_results_msg').html("<div class='col-md-12'><table class='table table-striped list_data table-border'><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>Please select a college & pattern to view campaigns.</h4></div></div> </td></tr><tr></tr></table></div>");
                    $('#load_more_button').hide();
                    $('#load_more_button').html("Load More Campaigns");
                     if (type != '') {
                              $('#if_record_exists, #table_data').hide();
                     }
                }else {
                    
                    
                    var total_rec = (data.match(/<tr class="font-icon-hover">/g) || []).length;
                    $('#load_more_results').append(data);
                    $('#load_more_button').removeAttr("disabled");
                    $('#load_more_button').html("Load More Campaigns");
                    if(total_rec<10){
                        $('#load_more_button').hide();
                    }
                    if (type != '') {
                        $('#if_record_exists, #table_data').fadeIn();
                    }
//                    $.material.init();
                    table_fix_rowcol();
                }
                
                $('#main_button').removeAttr("disabled");
                //console.log(data);
                
                //$("#load_more_results").tableHeadFixer({"left": 1});
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        
        return false;
    }
    
    
    
function addRemoveFavourite(campaign_id){
       $('#a_'+campaign_id).html('<img src="/img//loader_small.gif" style="width:16px;"/>');
        $.ajax({
            url: '/campaigns/add-remove-favourite',
            type: 'post',
            dataType: 'html',
            //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
            data: 'campaign_id='+campaign_id,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                data = data.replace("<head/>", '');
              //console.log(data);
              //return false;
                if (data == "session_logout") {
                    window.location.reload(true);
                }else if (data == "select_college") {
                    //$('#load_slider_data').html("<div class='alert alert-danger'>Please select college to view their leads.</div>");
                }else {
                    $('#a_'+campaign_id).html(data);
                    //console.log(data);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        return false;
}
    
    
function ChartCSVDownload(versus) {
    var $form = $("#FilterCampaignForm");
    $form.attr("action",'/campaigns/chart-csv-download');
    
    $form.append($("<input>").attr({"value":versus, "name":"versus",'type':"hidden","id":"versus"}));
   
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    $form.submit();
    $form.attr("onsubmit",onsubmit_attr);
    return false;
} 
 

function CampaignCSVDownload() {
    var $form = $("#FilterCampaignForm");
    $form.attr("action",'/campaigns/ajax-lists');
    $form.append($("<input>").attr({"value":"export", "name":"export",'type':"hidden","id":"export"}));
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    $form.submit();
    $form.attr("onsubmit",onsubmit_attr);
    return false;
}


//manage pattern js
if($('#ManagePatternSection').length > 0)
{
    GetMorePatternView('reset');
    
    //Search Pattern name    
    $('#FilterManagePatternForm #search').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
        , source: function (request, response) {
            var search = $('#FilterManagePatternForm #search').val();
            if (search)
            {
                $.ajax({
                    url: jsVars.SearchPatternUrl,
                    data: {search: search, area: 'pattern'},
                    dataType: "json",
                    type: "POST",
                    headers: {
                        "X-CSRF-Token": jsVars._csrfToken
                    },
                    //contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        items = [];
                        map = {};
                        $.each(data.list, function (i, item) {

                            var id = i;
                            var name = item;
                            map[name] = {id: id, name: name};
                            items.push(name);
                        });
                        response(items);
                        $(".dropdown-menu").css("height", "auto");
                    },
                    error: function (response) {
                        alertPopup(response.responseText);
                    },
                    failure: function (response) {
                        alertPopup(response.responseText);
                    }
                });
            }
        },
        //        updater: function (item) {
        //            $('#FilterForm #search').val(map[item].id);
        //            return item;
        //        }
    });
    
}

function GetMorePatternView(listingType)
{
    var Page,old_search;
    if(listingType == 'reset')
    {
        old_search = JSON.stringify($('#FilterManagePatternForm #search,#FilterManagePatternForm #CollegeSelect').serializeArray());
        Page = 0;
        $('#ListingType').val('reset');
    }
    else if(listingType == 'load')
    {
        Page = parseInt($('#OffsetStart').val());
        Page = Page + 1;
        $('#ListingType').val('load');
    }
    $('#OffsetStart').val(Page);
    $.ajax({
        url: jsVars.loadMorePatternUrl,
        type: 'post',
        data: $('#FilterManagePatternForm input,#FilterManagePatternForm select'),
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#ManagePatternSection .loader-block').show();
        },
        complete: function () {
            $('#ManagePatternSection .loader-block').hide();
        },
        success: function (html) {
            html = html.replace("<head/>", '');
            if (html == 'session')
            {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }             
            else if (html == 'no_more')
            {
                $('#LoadMoreArea').hide();
            }
            else
            {
                
                var countRecord = CountTotalReturnResult(html,listingType);
                //alert(countRecord);
                if(listingType == 'reset')
                {
                    $('#OldSearch').val(old_search);
                    $('#CampaignPatternContainer').html(html);
                }
                else if(listingType == 'load')
                {
                    $('#CampaignPatternListContainer').append(html);
                }
                //show/hide load more area
                if(countRecord >= 10)
                {
                    $('#LoadMoreArea').show();
                }
                else if(countRecord < 10)
                {
                    $('#LoadMoreArea').hide();
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function CountTotalReturnResult(html,listingType)
{
    var data = {};
    var len = 0;
    data.html = html;
    if(listingType == 'reset')
    {       
        //console.log($.parseHTML(data.html));
        $.grep($.parseHTML(data.html), function(el, i) { 
            len = $(el).find('div.application-form-block').length;
        });
    }
    else
    {
        len = $.grep($.parseHTML(data.html), function(el, i) {
          return $(el);
        }).length;
    }
    //alert(len);
    return len;
}

//Campaign Dashboad Page
if($('#CampaignDashboardSection').length > 0)
{
    var DashboardChartData;
    if(typeof jsVars.DashboardChartData != 'undefined')
    {
        DashboardChartData = eval(jsVars.DashboardChartData);
        DashboardChart();
    }
}

function DashboardChart()
{
    $('#chart_div').html('<div class="text-center"><img src="/img/loader_small.gif"/></div>');
    google.charts.load("current", {packages:['corechart']});
    google.charts.setOnLoadCallback(DashboardDrawChart);
}

function DashboardDrawChart() 
{ 
    var data = google.visualization.arrayToDataTable(DashboardChartData);

    var options = {
        chart: {
            title: 'Company Performance',
            subtitle: 'Sales, Expenses, and Profit: 2014-2017',
        },
        bars: 'vertical',
        vAxis: {format: 'decimal', viewWindow:{ min: 0}},
        height: 400,
    };

    var chart_div = document.getElementById('chart_div');
    var image_div = document.getElementById('image_div');
    var chart = new google.visualization.ColumnChart(chart_div);

    // Wait for the chart to finish drawing before calling the getImageURI() method.
    google.visualization.events.addListener(chart, 'ready', function () {
      image_div.innerHTML = '<img src="' + chart.getImageURI() + '">';
    });
    google.visualization.events.addListener(chart, 'ready', AddNamespaceHandler); 
    chart.draw(data, options);

}

// function: Get All Forms of a College
function GetAllRelatedForms(CollegeId, Condition,sel_val,async) {
    if(typeof async == 'undefined'){
        async=true
    }
    if (CollegeId && Condition) {
        $.ajax({
            url: jsVars.GetAllRelatedFormUrl,
            type: 'post',
            data: {CollegeId: CollegeId, Condition: Condition},
            dataType: 'json',
            async : async,
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json)
            {
                if (json['redirect'])
                    location = json['redirect'];
                else if (json['error'])
                    alertPopup(json['error'], 'error');
                else if (json['success'] == 200) {
                    if(typeof(sel_val)==='undefined'){
                        var selected_val='';
                    }else{
                        var selected_val=sel_val;
                    }
                    var dp_sel_val='';
                    
                    var html = "<option value=''>All Forms</option>";
                    for (var key in json["FormList"]) {
                        if($.trim(selected_val)!='' && selected_val==key){
                            dp_sel_val='selected="selected"';
                        }else{
                            dp_sel_val='';
                        }
                        
                        html += "<option value='" + key + "' "+dp_sel_val+">" + json["FormList"][key] + "</option>";
                    }

                    //alert(html);
                    $('#FormIdSelect').html(html);
                    $('#FormIdSelect').trigger('chosen:updated');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
    else
    {
        $('#FormIdSelect').html('<option value="">Select Form</option>');
        $('#FormIdSelect').trigger('chosen:updated');
    }
}

//owlCarousel
if ($.isFunction($.fn.owlCarousel)) {
$("#owl-worun").owlCarousel({
        items : 3,
        loop:false,
        itemsDesktop : [1199,3],
        itemsDesktopSmall : [979,3],
        navigation:false,
        pagination:false,
        navigationText: [
      ],
        stopOnHover : true
      });    
}
LoadReportDateRangepicker();


function SetDays(days){
    $('#line_chart_show_days').val(days);
    LoadCharts('line_charts',$('#line_chart_show_select').val());
    
}

function LoadCharts(chart_type, versus){
       $('#chart_div').show();
       $('#chart_div2, #chart_div3, #static_chart_div,#piechart_option_3,#piechart_option_2').hide("");
       $('#chart_div').html('<div class="text-center"><img src="/img/loader_small.gif"/></div>');
       $('.only_line_chart, .only_bar_charts').hide();
   
       var data = $('#FilterCampaignForm').serializeArray();
       data.push({name: "chart_type", value: chart_type});
       data.push({name: "versus", value: versus});
        
        $.ajax({
            url: '/campaigns/load-charts',
            type: 'post',
            dataType: 'html',
            //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
            data:data,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                data = data.replace("<head/>", '');
//              console.log(data);
              //return false;
                if (data == "session_logout") {
                    window.location.reload(true);
                }else if (data == "select_pattern" || data == "select_college") {
                   $('#chart_div').html("<div class='col-md-12'><table class='table table-striped list_data table-border'><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>Please select a college & pattern to view campaigns.</h4></div></div> </td></tr><tr></tr></table></div>");
                }else {
                    //console.log(data);
                    //return false;
                    var res_data=JSON.parse(data);
                    $('div.chartUpperprt').show();
                    if(chart_type=="pie_charts") {
                            $('#chart_div2, #chart_div3').show("");
                            
                            
                             if(res_data.str_data_impressions == ''){
                                $('#chart_div').html('<div class="col-md-12"><table class="table table-striped list_data table-border"><tr><td><div class="row"><div class="col-md-12"><h4 class="text-center text-danger">No Chart to display</h4></div></div> </td></tr><tr></tr></table></div>');
                                return false;
                            }else{
                                arr_google_data=eval(res_data.str_data_impressions);
                                div_chart_div="chart_div";
                                div_image_div="image_div";
                                x_axis="Impressions";
                                eval(res_data.function_hit);
                            }
                            
                              if(res_data.str_data_registrations == ''){
                                $('#chart_div2').html('<div class="col-md-12"><table class="table table-striped list_data table-border"><tr><td><div class="row"><div class="col-md-12"><h4 class="text-center text-danger">No Registrations/Conversions Chart to display</h4></div></div> </td></tr><tr></tr></table></div>');
                                return false;
                            }else{
                                 $('#piechart_option_2').show();
                                arr_google_data=eval(res_data.str_data_registrations);
                                div_chart_div="chart_div2";
                                div_image_div="image_div2";
                                x_axis="Registrations";
                                //x_axis=res_data.google_x_axis;
                                eval(res_data.function_hit);
                               
                            }
                            
                              if(res_data.str_data_conversions == ''){
                                $('#chart_div3').html('<div class="col-md-12"><table class="table table-striped list_data table-border"><tr><td><div class="row"><div class="col-md-12"><h4 class="text-center text-danger">No Conversions Chart to display</h4></div></div> </td></tr><tr></tr></table></div>');
                                return false;
                             }else{
                                  $('#piechart_option_3').show();
                                  arr_google_data=eval(res_data.str_data_conversions);
                                 div_chart_div="chart_div3";
                                 div_image_div="image_div3";
                                 x_axis="Conversions";
                                //x_axis=res_data.google_x_axis;
                                eval(res_data.function_hit);
                               
                            }
                        
                    }else{
                        if(res_data.str_data == '')
                        {
                            $('div.chartUpperprt').hide();
                            $('#chart_div').html('<div class="col-md-12"><table class="table table-striped list_data table-border"><tr><td><div class="row"><div class="col-md-12"><h4 class="text-center text-danger">No chart to display</h4></div></div> </td></tr><tr></tr></table></div>');
                            if(chart_type=="line_charts") $('.only_line_chart').show();
                            return false;
                        }
                     
                        arr_google_data=eval(res_data.str_data);
                        x_axis=res_data.google_x_axis;
                        y_axis=res_data.google_y_axis;
                        //chart_height=res_data.chart_height;
                        //$('#chart_div').css("height",chart_height);
                        eval(res_data.function_hit);
                    }
                    
                     if(chart_type=="line_charts") $('.only_line_chart').show();
                     else if(chart_type=="bar_charts") {
                         $('.only_bar_charts').show();
                         $('.only_bar_charts').removeClass("active");
                         
                         $('#bar_view').attr("onClick","LoadCharts('bar_charts','"+versus+"');");
                         $('#pie_view').attr("onClick","LoadCharts('pie_charts','"+versus+"');");
                         $('#bar_view').addClass("active");
                         
                     }
                     else if(chart_type=="pie_charts") {
                         $('.only_bar_charts').show();
                         $('.only_bar_charts').removeClass("active");
                         $('#pie_view').addClass("active");
                         $('#chart_div2, #chart_div3').show();
                     }
                      $('#chart_download_csv').attr("onClick","ChartCSVDownload('"+versus+"');");
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        return false;
}

function resetChosenSelect()
{
    $('#line_chart_show_select').val('impressions_linecharts||all');
    $('#line_chart_show_val').val('7');
    
    $('#line_chart_show_select').trigger('chosen:updated');
    $('#line_chart_show_val').trigger('chosen:updated');
}

//load funnel chart
function LoadFunnelChart()
{
    var ChartHtml = $('#FunnelChartContainer').html();
    $('#static_chart_div').html(ChartHtml);
    $('#chart_div, #chart_div2, #chart_div3,#piechart_option_3,#piechart_option_2').hide();
    $('#static_chart_div').show();
    $('div.chartUpperprt').hide();
    $('.only_line_chart').hide();
}

var arr_google_data=[];
var x_axis="";
var y_axis="";

/******************** stacked bar chart start code ****************************/
function stackedcharts(){
    google.charts.load("current", {packages:['corechart']});
    google.charts.setOnLoadCallback(drawStackedChart);
}

function drawStackedChart() {
      var data = google.visualization.arrayToDataTable(arr_google_data);
      var options = {
        height: 400,
        legend: { position: 'bottom', maxLines: 3 },
        bar: { groupWidth: '75%' },
        isStacked: true,
        vAxis: {
                title: 'Payments',
                viewWindow:{ min: 0}
            },
            hAxis: {
                title: 'Payment Source',
                direction: -1, 
                slantedText: true, 
                slantedTextAngle: 40,
        
            },
            fontSize: 12
      };
        var chart_div = document.getElementById('chart_div');
        var image_div = document.getElementById('image_div');
        var chart = new google.visualization.ColumnChart(chart_div);
        // Wait for the chart to finish drawing before calling the getImageURI() method.
        google.visualization.events.addListener(chart, 'ready', function () {
            image_div.innerHTML = '<img src="' + chart.getImageURI() + '">';
        });
        google.visualization.events.addListener(chart, 'ready', AddNamespaceHandler); 
        chart.draw(data, options);
}
/******************** stacked bar chart end code ****************************/

/******************** pie chart start code ****************************/
function piecharts(){
    google.charts.load("current", {packages:['corechart']});
    google.charts.setOnLoadCallback(drawPieChart);
}
var div_chart_div="chart_div";
var div_image_div="image_div";

function drawPieChart() {
      var data = google.visualization.arrayToDataTable(arr_google_data);
      /*var data = google.visualization.arrayToDataTable([
          ['Source', 'Impression'],
          ['Facebook',     11],
          ['Twitter',      2],
          ['Google',  2],
          ['SMS', 2],
          ['Email',    7]
        ]);*/

        var options = {
          pieHole: 0.6,
          title: x_axis,
        };

//        var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
        
        var chart_div = document.getElementById(div_chart_div);
        var image_div = document.getElementById(div_image_div);
        var chart = new google.visualization.PieChart(chart_div);
        // Wait for the chart to finish drawing before calling the getImageURI() method.
        google.visualization.events.addListener(chart, 'ready', function () {
            image_div.innerHTML = '<img src="' + chart.getImageURI() + '">';
        });
         google.visualization.events.addListener(chart, 'ready', AddNamespaceHandler); 
        chart.draw(data, options);
}
/******************** pie chart end code ****************************/

/******************** bar chart start code ****************************/
function barcharts(){
    google.charts.load("current", {packages:['corechart']});
    google.charts.setOnLoadCallback(drawBarChart);
}
 function drawBarChart() {
      var data = google.visualization.arrayToDataTable(arr_google_data);

      var options = {
          chart: {
            title: 'Campaign Performance',
            subtitle: 'Impressions, Registrations and Conversions',
          },
          bars: 'vertical',
          vAxis: {format: 'decimal',title:y_axis, viewWindow:{ min: 0}},
          hAxis: {title: x_axis},
          height: 400,
        };

      var chart_div = document.getElementById('chart_div');
//      var image_div = document.getElementById('image_div');
      var chart = new google.visualization.ColumnChart(chart_div);

      // Wait for the chart to finish drawing before calling the getImageURI() method.
      google.visualization.events.addListener(chart, 'ready', function () {
        image_div.innerHTML = '<img src="' + chart.getImageURI() + '">';
      });
//      var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
        google.visualization.events.addListener(chart, 'ready', AddNamespaceHandler); 
        chart.draw(data, options);

  }
/******************** bar chart end code ****************************/




/******************** line chart start code ****************************/
function linecharts(){
    google.charts.load("current", {packages:['corechart']});
    google.charts.setOnLoadCallback(drawLineChart);
}
 function drawLineChart() {
       //var data = google.visualization.arrayToDataTable(arr_google_data);
        /*var data = google.visualization.arrayToDataTable([
          ['Date', 'Facebook', 'Google', 'SMS', 'Email'],
          ['10-Dec-2015',  1000,      400,  1000,      1400],
          ['11-Dec-2015',  1170,      460,  1010,      400],
          ['12-Dec-2015',  660,       1120,  3000,      4200],
          ['13-Dec-2015',  1030,      540,  1000,      4030]
        ]);*/
        
        data=google.visualization.arrayToDataTable(arr_google_data);

        var options = {
//          title: 'Company Performance',
          legend: { position: 'bottom' },
          pointSize: 4,
         
            vAxis: {
                title: y_axis,
                 viewWindow:{ min: 0},
            },
            hAxis: {
                title: 'Time (In Days)',
            },
            fontSize: 12,
        };

        var chart_div = document.getElementById('chart_div');
        var image_div = document.getElementById('image_div');
        var chart = new google.visualization.LineChart(chart_div);
        // Wait for the chart to finish drawing before calling the getImageURI() method.
        google.visualization.events.addListener(chart, 'ready', function () {
            image_div.innerHTML = '<img src="' + chart.getImageURI() + '">';
        });
         google.visualization.events.addListener(chart, 'ready', AddNamespaceHandler); 
        chart.draw(data, options);
  }
/******************** line chart end code ****************************/





function AddNamespaceHandler(id){
  var svg = jQuery('svg');
  svg.attr("xmlns", "http://www.w3.org/2000/svg");
  svg.css('overflow','visible');
}
/**
 * Export Chart Code
 */

function exportChart(exportType, div_image_no) {
    if (exportType) {
        var url = $('#image_div'+div_image_no+' img').attr('src');
        window.open(url, "_blank", "toolbar=no,scrollbars=no,resizable=no,top=100,left=100,width=1000,height=500");
        return false;
    }
}

function changePatternStatus(pattern_key, status) {  
    $.ajax({
        url: '/campaign-manager/change-status-pattern',
        type: 'post',
        data: {'pattern_key': pattern_key, 'status': status},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#'+pattern_key).text('Wait..');
        },
        success: function (json) {
            if(json['error']){
                alert(json['error']);
            }else if (json['status'] == 200) {                           
                // Success
                $('#pattern-status-'+pattern_key).text(json['statusText']);
                $('#pattern-status-'+pattern_key).removeClass(json['removeClass']);
                $('#pattern-status-'+pattern_key).addClass(json['statusClass']);              
                $('#'+pattern_key).attr('onclick', 'return changePatternStatus("'+pattern_key+'", '+json['changedStatus']+')');
                $('#'+pattern_key).html('<span class="fa fa-circle '+json['statusColor']+' padding-right-5"></span>' +json['statusChangeText']);                        
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);;
        }
    });

   
}

/* Code for New Campaing manager dashboard start here */

/**
 * function: Get All Publisher of a College
 * @param {type} CollegeId
 * @returns {undefined}
 */

function GetPublisherList(CollegeId,publisherId ) {
    if (CollegeId ) {
        $.ajax({
            url: jsVars.GetPublisherListUrl,
            type: 'post',
            data: {s_college_id: CollegeId},
            dataType: 'json',
            async:false,
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json)
            {
                if (json['redirect']){
                    location = json['redirect'];
                }else if (json['error']){
                    alertPopup(json['error'], 'error');
                }else if (json['status'] == 200) {
                    json['publisherList'] = '<option value="">Publisher Name</option>'+json['publisherList'];
                    $('#PublisherIdSelect').html(json['publisherList']);
                    if (publisherId != undefined && publisherId != "") {
                        $("#PublisherIdSelect option[value='" +publisherId + "']").attr("selected", "selected");
                        var publisherName  = $("#PublisherIdSelect").find("option[value='"+publisherId+"']").html();
                        $("#publisherNameSpan").html(publisherName);
                    }
                    $('#PublisherIdSelect').trigger('chosen:updated');
                }else if (json['status'] == 0) {
                    $('#PublisherIdSelect').html('<option value="">Publisher Name</option>');
                    $('#PublisherIdSelect').trigger('chosen:updated');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
    else
    {
        $('#PublisherIdSelect').html('<option value="">Publisher Name</option>');
        $('#PublisherIdSelect').trigger('chosen:updated');
    }
}



var loaderCount=0;

/**
 * 
 * load campaign detail
 */
function LoadTrackCampaignDetails(listingType){
    if(jsVars.canTrackCampaignDetail==false){
        return false;
    }
    var pie_chart_data = [];
    var title = "";
    var chart_div = "";
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
                if(countRecord < 10){
                    $('#LoadMoreArea button').hide();
                }else{
                    $('#LoadMoreArea button').show();
                }
                $("#page").val(parseInt($("#page").val())+1);
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
                $("#totalApplications").html(json['dataList'][0]['application_count']);
		if(json['isEnrollmentEnabled'] == 1){
			if(json['isEnrollmentConfigured'] == 1){
				str = '<h5 style="padding-top: 10px" id="enrollmentLable">' + json['enrollmentLabel'] + '</h5><span id="totalApplications">' + json['dataList'][0]['total_enrolled'] + '</span>';
				$('#enrollment-div').html(str);
			}else
				$('#enrollmentLable').html(json['enrollmentLabel']);
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


var traffic_channel = [];
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
		if(data.isEnrollmentConfigured == 1){
			rowData[i++] = ['Publisher', 'Leads', {type: 'string', role: 'annotation'},'Applications',{type: 'string', role: 'annotation'}, data.enrollmentLabel, {type: 'string', role: 'annotation'}];
		}else{
                	rowData[i++] = ['Publisher', 'Leads', {type: 'string', role: 'annotation'},'Applications',{type: 'string', role: 'annotation'}];
		}
                for(var key in data['conversion_bar_chart']){
                    if(parseInt(data['conversion_bar_chart'][key]['primary_count']) != 0 || parseInt(data['conversion_bar_chart'][key]['primary_count']) != 0){
			if(data.isEnrollmentConfigured == 1){
                        	rowData[i++] = [''+key, parseInt(data['conversion_bar_chart'][key]['primary_count']),
                                                parseInt(data['conversion_bar_chart'][key]['primary_count']) ,
                                                parseInt(data['conversion_bar_chart'][key]['conversion_count']),
                                                parseInt(data['conversion_bar_chart'][key]['conversion_count']),
						parseInt(data['conversion_bar_chart'][key]['enrolled_count']),
						parseInt(data['conversion_bar_chart'][key]['enrolled_count']), 
                                        ];
			}else{
				rowData[i++] = [''+key, parseInt(data['conversion_bar_chart'][key]['primary_count']),
                                                parseInt(data['conversion_bar_chart'][key]['primary_count']) ,
                                                parseInt(data['conversion_bar_chart'][key]['conversion_count']),
                                                parseInt(data['conversion_bar_chart'][key]['conversion_count'])
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

var loadPublisherDetailsFlag    = true;
var loadSocialDetailsFlag       = true;
var loadOrganicDetailsFlag      = true;
var loadOfflineDetailsFlag      = true;
var isSumoLoad			= false;

function intializeDashboard(){
    
    $("#campaignDetailedLinkSpan").hide();
    $("input[name='source_keys[]']:checked").removeAttr('checked');
    if(isSumoLoad){
	$('select#graph_bar_filter')[0].sumo.unSelectAll();
	isSumoLoad = false;
    }
    if(jsVars.canViewDashboardTable){
        $('#dateRange').on('apply.daterangepicker', LoadCampaignDetails);
        $('#dateRange').on('cancel.daterangepicker', LoadCampaignDetails);
        $("#dateRange").val('');
        $("#lead_type").val('').trigger('chosen:updated');
        LoadCampaignDetails();
    }
    if(jsVars.canViewDashboardGraph){
        $('#graphDateRange').on('apply.daterangepicker', loadCampaignGraph);
        $('#graphDateRange').on('cancel.daterangepicker', loadCampaignGraph);
        $("#graphDateRange").val('');
        $("#graph_lead_type").val('').trigger('chosen:updated');
        var html    = '<select id="sourcePublisher" tabindex="-1" multiple="multiple" name="sourcePublisher[]"></select>';
        $('#sourcePublisherDiv').html(html);
        $('#sourcePublisher').SumoSelect({okCancelInMulti:true, search: true, searchText:'Search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
        loadCampaignGraph();
        loadLeadsDeviceGraph();
    }
//    getCollegeWidgets();
}
/**
 * 
 * load campaign detail
 */
function LoadCampaignDetails(){
    $("#tableDiv").hide();
    $("#downloadTableButton").hide();
    loadPublisherDetailsFlag    = true;
    loadOfflineDetailsFlag    = true;
    loadSocialDetailsFlag       = true;
    loadOrganicDetailsFlag      = true;
    loadReferralDetailsFlag      = true;
    loadTelephonyDetailsFlag    = true;
    if($("#college_id").val()==""){
        $('#CampaignManagerContainerSection').html("<div class='col-lg-12'><table class='table table-striped list_data table-border'><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'> Please select a institute name to view campaign details. </h4></div></div> </td></tr><tr></tr></table></div>");
        return;
    }
     $.ajax({
        url: jsVars.loadCampaignDetailsLink,
        type: 'post',
        data: {'lead_type':$("#lead_type").val(),'collegeId':$("#college_id").val(),'dateRange':$("#dateRange").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#campaignListLoader.loader-block').show();
        },
        complete: function () {
            $('#campaignListLoader.loader-block').hide();
        },
        success: function (html) { 
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
            }else{
                $("#tableDiv").show();
                html    = html.replace("<head/>", "");
                $('#CampaignManagerContainerSection').html(html);
                if($("#load_more_results").length > 0){
                    $("#downloadTableButton").show();
                }
                if($("input[name='filters[college_id]']").length>0){
                   $("input[name='filters[college_id]']").val($("#college_id").val()); 
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function intializeDisposition(){
    if($("#college_id").val()==""){
        $('#CampaignManagerDispositionSection').html("<table class='table'><tr><td><h4 class='text-center text-danger'> Please select a institute name to view campaign details. </h4></td></tr></table>");
        return;
    }
    getDispositionflter($("#college_id").val());
    searchDispositionDetails();
     
}

function searchDispositionDetails(type){
    if(typeof type=='undefined'){
        var type='';
    }
    
    if($("#lead_channel").val()==null || $("#lead_channel").val()==''){
        $("#CampaignManagerDispositionSection").html("<table class='table'><tr><td><h4 class='text-center text-danger'>Please select at least one channel.</h4></td></tr></table>");
        return false;
    }
    if($("#lead_stage").val()==null || $("#lead_stage").val()==''){
        $("#CampaignManagerDispositionSection").html("<table class='table'><tr><td><h4 class='text-center text-danger'>Please select at least one stage.</h4></td></tr></table>");
        return false;
    }
    $.ajax({
        url: jsVars.loadCampaignDispositionLink,
        type: 'post',
        data: {'lead_stage':$("#lead_stage").val(),'lead_channel':$("#lead_channel").val(),'collegeId':$("#college_id").val(),'dateRange':$("#dateRangeDisposition").val()},
        dataType: 'html',
        async : false,
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#campaignListLoader.loader-block').show();
        },
        complete: function () {
            $('#campaignListLoader.loader-block').hide();
        },
        success: function (html) { 
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
            }else{
                $("#tabsDisposition").show();
                $('#lead_stage').SumoSelect({locale : ['Apply', 'Cancel', 'Select All'], selectAll:true, okCancelInMulti: true, placeholder: 'Select Stage', search: true, searchText:'Select Stage'});
                $('#lead_channel').SumoSelect({locale : ['Apply', 'Cancel', 'Select All'], selectAll:true, okCancelInMulti: true, placeholder: 'Select Channel', search: true, searchText:'Select Channel'});
                $("#CampaignManagerDispositionSection").html(html);
            }
            table_fix_rowcol();
            if(type!='again'){
                $(".sumo_lead_channel p.btnOk").click(function(){
                    searchDispositionDetails('again');
                });
                $(".sumo_lead_stage p.btnOk").click(function(){
                    searchDispositionDetails('again');
                });
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getDispositionflter(cid){
    $.ajax({
        url: jsVars.loadDispositionFilterLink,
        type: 'post',
        data: {'collegeId':cid},
        dataType: 'json',
        async : false,
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#campaignListLoader.loader-block').show();
        },
        complete: function () {
            $('#campaignListLoader.loader-block').hide();
        },
        success: function (responseObject) {
            //var responseObject = $.parseJSON(json);
            if(typeof responseObject.leadStages=='object'){
                $('#lead_stage').SumoSelect({okCancelInMulti:true, search: true, searchText:'Search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
                //$('#lead_stage').SumoSelect({locale : ['Apply', 'Cancel', 'Select All'], selectAll:true, okCancelInMulti: true, placeholder: 'Select Stateges', search: true, searchText:'Select Stages'});
                var stageOptions = '';
                $.each(responseObject.leadStages, function (index, item) {
                    stageOptions += '<option value="'+index+'" selected>'+item+'</option>';
                });
                $('#lead_stage').html(stageOptions);
                $('select#lead_stage')[0].sumo.reload();
            }
            if(typeof responseObject.leadChannel=='object'){
                $('#lead_channel').SumoSelect({okCancelInMulti:true, search: true, searchText:'Search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
              
                //$('#lead_channel').SumoSelect({locale : ['Apply', 'Cancel', 'Select All'], selectAll:true, okCancelInMulti: true, placeholder: 'Select Stateges', search: true, searchText:'Select Stages'});
                var channelOptions = '';
                $.each(responseObject.leadChannel, function (index, item) {
                    index = index.replace('traffic_channel_', '');
                    channelOptions += '<option value="'+index+'" selected>'+item+'</option>';
                });
                
                $('#lead_channel').html(channelOptions);
                $('select#lead_channel')[0].sumo.reload();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function loadDashboardTablePublisherDetails(total_lead,lead_percent,app_percent){
    if(!loadPublisherDetailsFlag){
        return;
    }
    loadPublisherDetailsFlag    = false;
     $.ajax({
        url: jsVars.dashboardTablePublisherDetailsLink,
        type: 'post',
        data: {'lead_type':$("#lead_type").val(),'collegeId':$("#college_id").val(),'dateRange':$("#dateRange").val(),'total_lead':total_lead,'lead_percent':lead_percent,'app_percent':app_percent},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#campaignListLoader.loader-block').show();
        },
        complete: function () {
            $('#campaignListLoader.loader-block').hide();
        },
        success: function (html) { 
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
            }else{
                html    = html.replace("<head/>", "");
                $('#publishers').html(html);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getCollegeWidgets(){
    $(".lead-type-widget").remove();
    $('#graph_lead_type').trigger("chosen:updated");
    $('#lead_type').trigger("chosen:updated");
    
    if($("#college_id").val()==""){
        return;
    }
    $.ajax({
       url: jsVars.dashboardWidgetListLink,
       type: 'post',
       data: {'collegeId':$("#college_id").val()},
       dataType: 'html',
       headers: {
           "X-CSRF-Token": jsVars.csrfToken
       },
       beforeSend: function () { 
           $('#campaignListLoader.loader-block').show();
       },
       complete: function () {
           $('#campaignListLoader.loader-block').hide();
       },
       success: function (response) { 
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
//                    if(responseObject.data.length > 0){
                        var graph_lead_type = '<optgroup label="Widget">';
                        var lead_type       = '<optgroup label="Widget">';
                        $.each(responseObject.data, function (index, item) {
                            graph_lead_type += '<option class="lead-type-widget" value="w_'+index+'">'+item+'</option>';
                            lead_type       += '<option class="lead-type-widget" value="w_'+index+'">'+item+'</option>';
                        });
                        graph_lead_type += '</optgroup>';
                        lead_type       += '</optgroup>';
                        $("#graph_lead_type").append(graph_lead_type);
                        $("#lead_type").append(lead_type);
//                    }
                    $('#graph_lead_type').trigger("chosen:updated");
                    $('#lead_type').trigger("chosen:updated");
                }
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alert(responseObject.message);
                }
            }
       },
       error: function (xhr, ajaxOptions, thrownError) {
           alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}

function loadDashboardTableOfflineDetails(total_lead,lead_percent,app_percent){
    if(!loadOfflineDetailsFlag){
        return;
    }
    loadOfflineDetailsFlag    = false;
     $.ajax({
        url: jsVars.dashboardTableOfflineDetailsLink,
        type: 'post',
        data: {'lead_type':$("#lead_type").val(),'collegeId':$("#college_id").val(),'dateRange':$("#dateRange").val(),'total_lead':total_lead,'lead_percent':lead_percent,'app_percent':app_percent},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#campaignListLoader.loader-block').show();
        },
        complete: function () {
            $('#campaignListLoader.loader-block').hide();
        },
        success: function (html) { 
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
            }else{
                html    = html.replace("<head/>", "");
                $('#offline').html(html);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function loadDashboardTableSocialDetails(total_lead,lead_percent,app_percent){
    if(!loadSocialDetailsFlag){
        return;
    }
    loadSocialDetailsFlag    = false;
     $.ajax({
        url: jsVars.dashboardTableSocialDetailsLink,
        type: 'post',
        data: {'collegeId':$("#college_id").val(),'dateRange':$("#dateRange").val(),'total_lead':total_lead,'lead_percent':lead_percent,'app_percent':app_percent},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#campaignListLoader.loader-block').show();
        },
        complete: function () {
            $('#campaignListLoader.loader-block').hide();
        },
        success: function (html) { 
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
            }else{
                html    = html.replace("<head/>", "");
                $('#traffiChannel4').html(html);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function loadDashboardTableOrganicDetails(total_lead,lead_percent,app_percent){
    if(!loadOrganicDetailsFlag){
        return;
    }
    loadOrganicDetailsFlag    = false;
     $.ajax({
        url: jsVars.dashboardTableOrganicDetailsLink,
        type: 'post',
        data: {'lead_type':$("#lead_type").val(), 'collegeId':$("#college_id").val(),'dateRange':$("#dateRange").val(),'total_lead':total_lead,'lead_percent':lead_percent,'app_percent':app_percent},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#campaignListLoader.loader-block').show();
        },
        complete: function () {
            $('#campaignListLoader.loader-block').hide();
        },
        success: function (html) { 
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
            }else{
                html    = html.replace("<head/>", "");
                $('#traffiChannel3').html(html);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function loadCampaignGraph(filter_button){
    //Cheking for chart value
    if(filter_button == 'graph_bar_filter'){
        countBar = $('#graph_bar_filter > option:selected');
        if(countBar.length == 1 && countBar.length < 2){
            alert('Please select atleast two data graph value.');
	    $('#graph_bar_filter > option').removeAttr("selected");
	    $('select#graph_bar_filter')[0].sumo.reload();
            return false;
        }
    }
    $("#graphDiv").hide();
    $("#downloadGraphButton").hide();
    $("#reg_chart_div").html("");
    if($("#college_id").val()==""){
        return;
    }
    var checkedSource = [];
    $("input[name='source_keys[]']:checked").each(function (){
        checkedSource.push($(this).val());
    });
    
    var checkedStates = $('#graph_states').val();
    
     $.ajax({
        url: jsVars.loadDashboardGraphDataLink,
        type: 'post',
        //data: {'lead_type':$("#graph_lead_type").val(),'collegeId':$("#college_id").val(),'dateRange':$("#graphDateRange").val(), 'publishers':checkedSource,'filter_button':filter_button},
        data: {'lead_states':checkedStates, 'lead_type':$("#graph_lead_type").val(),'collegeId':$("#college_id").val(),'dateRange':$("#graphDateRange").val(), 'publishers':checkedSource, 'graph_bars' : $('#graph_bar_filter').val(), 'graph_sort' : $('#graph_bar_sorting').val()},
        dataType: 'html',
        async:false,
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#campaignListLoader.loader-block').show();
        },
        complete: function () {
            $('#campaignListLoader.loader-block').hide();
        },
        success: function (response) { 
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    if(typeof responseObject.data.graphData === "object"){
                        $("#graphDiv").show();
                        if(responseObject.data.graphData.length<2){
                            $('#reg_chart_div').html("<table class='table table-striped list_data table-border'><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'> No graph data with selected filters. </h4></div></div> </td></tr><tr></tr></table>");
                        }else{
                            matarialBarcharts("", 'reg_chart_div', responseObject.data.graphData, responseObject.data.maxPublisherNameLength);
                            $("#downloadGraphButton").show();
                        }
                    }

                    //populate state list
                    if(typeof responseObject.data.stateList === "object"){
                        $('#graph_states').SumoSelect({isClickAwayOk:true, locale : ['Apply', 'Cancel', 'Select All'], selectAll:true, okCancelInMulti: true, placeholder: 'Select States', search: true, searchText:'Select States'});
                       
                        var stateOptions = '';
                        $.each(responseObject.data.stateList, function (index, item) {
                            
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

		    //Enrollment in graph
            	if(Number(responseObject.isEnrollmentEnable)){
                        if(!Number(responseObject.enrollPermission.enrolmentMapping)){
                            $("#enrollmentTooltip a").attr('href','/settings/enrolment-mapping');
                        }
                        
            		if(!Number(responseObject.isEnrollmentConfigure)){
                        $('#enrollmentTooltip').html('<a class="enrolment-configBtn" tabindex="0" data-toggle="popover" data-placement="top" data-container="body" data-trigger="hover" data-content="Final Enrolments not configured for the institute. To get a complete lead to enrolment view, Please get it configured"><i class="fa fa-cogs" aria-hidden="true"></i>&nbsp;Configure Enrolments</a>');
			    $('#graph_bar_filter_div').hide();
                        }else{
				$('#graph_bar_filter').SumoSelect({isClickAwayOk:true, locale : ['Apply', 'Cancel', 'Select All'], selectAll:true, okCancelInMulti: true, placeholder: 'Select Graph Value', search: true, searchText:'Search Graph Value'});
                        	var chartValue = new Object({'leads' : 'Leads', 'applications' : 'Applications', 'enrollments' : 'Enrolments'});
                        	selectedBars = $('#graph_bar_filter').val();
                        	chartOption = '';
                        	for(var j in chartValue){
                                	if(selectedBars != null && $.inArray(j, selectedBars) != -1)
                                        	chartOption += '<option value="' + j + '" selected>' + chartValue[j] + '</option>';
                                	else
                                        	chartOption += '<option value="' + j + '">' + chartValue[j] + '</option>';
                        	}
                        	$('#graph_bar_filter').html(chartOption);
                        	$('select#graph_bar_filter')[0].sumo.reload();
                            	$('#enrollmentTooltip').html('');
				$('#graph_bar_filter_div').show();
				isSumoLoad = true;

				var IsExists = false;
                        	$('#graph_bar_sorting option').each(function(){
                                	if (this.value == 'enrollments')
                                        	IsExists = true;
                        	});

                        	if(!IsExists)
                                	$('#graph_bar_sorting').append('<option value="enrollments">Sort by Enrolment</option>');
                        	selectedSort = $('#graph_bar_sorting').val();
                        	if(selectedSort != ''){
                                	$('#graph_bar_sorting option[value=' + selectedSort + ']').attr('selected','selected');
                        	}
                        	$('.chosen-select').chosen();
                        	$('.chosen-select').trigger('chosen:updated');
                        }

            	}else{
			$('#graph_bar_filter_div').hide();
            	}

                    if(typeof responseObject.data.publishersList === "object"){
                            var publisher       = '';
                            var channel         = '';
                            var offline         = '';
                            var html            = '';
                            var accordianClass  = 'active';
                            var counter         = 0;
                            var checkedOption   = '';
                        $.each(responseObject.data.publishersList, function (index, item) {
                            var detail = index.split('_');
                             if(++counter <= 10){
                                checkedOption = 'checked="checked"' ;
                            }else{
                                checkedOption = "" ;
                            }
                            if(detail[1]== 1){
                                publisher += '<li  class="custom_li_filter_college filter_registration">\n\
                                                    <label>\n\
                                                    <input '+checkedOption+' type="checkbox"  class="filter_create_keys" name="source_keys[]" value="'+index+'" > '+item+' </label>\n\
                                                </li> ';
                            }else if(detail[1]== 9){
                                offline += '<li  class="custom_li_filter_college filter_registration">\n\
                                                    <label>\n\
                                                    <input '+checkedOption+' type="checkbox"  class="filter_create_keys" name="source_keys[]" value="'+index+'" > '+item+' </label>\n\
                                                </li> ';
                            }else{
                                channel += '<li  class="custom_li_filter_college filter_registration">\n\
                                                    <label>\n\
                                                    <input '+checkedOption+' type="checkbox"  class="filter_create_keys" name="source_keys[]" value="'+index+'" > '+item+' </label>\n\
                                                </li> ';
                            }
                        });
                        if(channel != ""){
                            html += '<li class="'+accordianClass+'">\
                                                <a href="javascript:void(0)" id="filter_create_keys_0" class="filterCollasp">\
                                                <span class="glyphicon glyphicon-menu-down"></span>\
                                                <span class="glyphicon glyphicon-menu-right"></span>Channel</a>\
                                                <ul class="filter_registration filterCollaspData">'+channel+'</ul></li>';
                            accordianClass = '';
                        }
                        if(publisher != ""){
                            html += '<li class="'+accordianClass+'">\
                                                <a href="javascript:void(0)" id="filter_create_keys_1" class="filterCollasp">\
                                                <span class="glyphicon glyphicon-menu-down"></span>\
                                                <span class="glyphicon glyphicon-menu-right"></span>Publisher Campaigns</a>\
                                                <ul class="filter_registration filterCollaspData">'+publisher+'</ul></li>';
                            accordianClass = '';
                        }
                        if(offline != ""){
                            html += '<li class="'+accordianClass+'">\
                                                <a href="javascript:void(0)" id="filter_create_keys_2" class="filterCollasp">\
                                                <span class="glyphicon glyphicon-menu-down"></span>\
                                                <span class="glyphicon glyphicon-menu-right"></span>Offline</a>\
                                                <ul class="filter_registration filterCollaspData">'+offline+'</ul></li>';
                        }
                        $("ul#filter_li_list").html(html);
                        $('.filterCollasp').on('click', function(e) {
                            if($(this).parent().hasClass('active')) {
                                $('.filterCollasp').parent().removeClass('active');
                            } else {
                                $('.filterCollasp').parent().removeClass('active');
                                $(this).parent().addClass('active');
                            }
                            e.preventDefault();
                        });
                    }
                    $("input[name='source_keys[]']").click(function(event) {
                        if (this.checked && $('input:checked').length > 10) {
                            event.preventDefault();
                            alert('You\'re not allowed to choose more than 10 boxes');
                        }
                    });
                      
                    if(typeof responseObject.data.publishersList === "object"){
                        var value   = '<select id="sourcePublisher" tabindex="-1" multiple="multiple" name="sourcePublisher[]">';
                        var counter = 0;
                        $.each(responseObject.data.publishersList, function (index, item) {
                            if(++counter<=10){
                                value += '<option value="'+index+'" selected="true">'+item+'</option>';
                            }else{
                                value += '<option value="'+index+'">'+item+'</option>';
                            }
                        });
                        value += '</select>';
                        $('#sourcePublisherDiv').html(value);
                        $('#sourcePublisher').SumoSelect({okCancelInMulti:true, search: true, searchText:'Search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
                        if(counter>0){
                            if(typeof responseObject.data.trackCampaignLink === "string"){
                                $("#campaignDetailedLinkSpan").show();
                                $("#campaignDetailedLinkSpan").html("<a href='"+responseObject.data.trackCampaignLink+"'>Check Detailed Publisher Campaign Report &nbsp;<span class='glyphicon glyphicon-share-alt'></span></a>");
                            }
                        }
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
                            loadCampaignGraph();
                        });
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


/******************** donut chart start code ****************************/
function donutCharts(title,chart_div,pie_chart_data){
    google.charts.load("current", {packages:['corechart']});
    google.charts.setOnLoadCallback(function() { drawDonutChart(title,chart_div,pie_chart_data); });
}


function drawDonutChart(title,chart_div,rowData) {
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'channels');
    data.addColumn('number', 'count');
    data.addRows(rowData);
    // Set chart options
    var options = {'title':title,
                   'width':550,
                   'pieHole':0.5,
                   sliceVisibilityThreshold:0,
				   colors: ['#ffc000','#92d050','#d9d9d9','#e46c0a','#71588f', '#ffffcc', '#ff3399', '#00b0f0', '#93cddd' ],
                   'height':350
				};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById(chart_div));
         google.visualization.events.addListener(chart, 'ready', AddNamespaceHandler);
         google.visualization.events.addListener(chart, 'ready', function(){Title_center(chart_div)});
         
    chart.draw(data, options);
}
/******************** donut chart end code ****************************/


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
/******************** matarial bar chart end code ****************************/


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
function downloadDashboardGraph(type, action)
{
    if(typeof action == 'undefined'){
        action = 'Channels_and_Publisher_Graph';
    }
    switch(action){
        case 'State_Apps_Percentage_Graph':
             if(type == 'pdf'){
                if($('#state_apps_chart_div_parent').css('display') == 'none')    {
                    alert("Graph not available.");
                   return false; // if graph not available
                }
                $('#campaignListLoader.loader-block').show();
                $('#state-apps-chart-header').show();
                xepOnline.Formatter.Format('state_apps_chart_div_parent', {render: 'download',pageWidth:10,filename:"Publisher_Channel_State_Application_Graph"});
                $('#state-apps-chart-header').hide();
                $('#campaignListLoader.loader-block').hide();
            }else{
                $("#collgeSelected").val($("#college_id").val());
                $("#statsType").val('applications');
                var items = [];
                $("#tableHtmlForm").append($("<input>").attr({"value":type, "name":"downloadtype",'type':"hidden","id":"downloadtype"}));
                $("#tableHtmlForm").submit();
            }
            break;
        case 'State_Leads_Percentage_Graph':
             if(type == 'pdf'){
                if($('#state_leads_chart_div_parent').css('display') == 'none')    {
                    alert("Graph not available.");
                   return false; // if graph not available
                }
                $('#campaignListLoader.loader-block').show();
                $('#state-leads-chart-header').show();
                xepOnline.Formatter.Format('state_leads_chart_div_parent', {render: 'download',pageWidth:10,filename:"Publisher_Channel_State_Leads_Graph"});
                $('#state-leads-chart-header').hide();
                $('#campaignListLoader.loader-block').hide();
            }else{
                $("#collgeSelected").val($("#college_id").val());
                $("#statsType").val('leads');
                var items = [];
                $("input[name='source_keys[]']:checked").each(function(){items.push($(this).val());});
                $("#tableHtmlForm").append($("<input>").attr({"value":type, "name":"downloadtype",'type':"hidden","id":"downloadtype"}));
                $("#tableHtmlForm").submit();
            }
            break;
        case 'Registration_Device_Graph':
            if(type == 'pdf'){
                if($('#device_chart_all').css('display') == 'none')    {
                    alert("Graph not available.");
                   return false; // if graph not available
                }
                $('#campaignListLoader.loader-block').show();
                $('#pdf_device_chart_all').show();
                xepOnline.Formatter.Format('pdf_device_chart_all', {render: 'download',pageWidth:10,filename:"Registration_Device_Graph"});
                $('#pdf_device_chart_all').hide();
                $('#campaignListLoader.loader-block').hide();
            }else{
                $("#collgeSelected").val($("#college_id").val());
                var items = [];
                $("input[name='source_keys[]']:checked").each(function(){items.push($(this).val());});
                $("#tableHtmlForm").append($("<input>").attr({"value":type, "name":"downloadtype",'type':"hidden","id":"downloadtype"}));
                $("#tableHtmlForm").submit();
            }
            break;
        case 'Channels_and_Publisher_Graph':
            if(type == 'pdf'){
                if($('#reg_chart_div').css('display') == 'none')    {
                    alert("Graph not available with selected filters");
                   return false; // if graph not available
                }
                $('#campaignListLoader.loader-block').show();
                $('#reg-chart-header').show();
                xepOnline.Formatter.Format('reg_chart_div_parent', {render: 'download',pageWidth:10,filename:"Channels_and_Publisher_Graph"});
                $('#reg-chart-header').hide();
                $('#campaignListLoader.loader-block').hide();
            } else  {
                $("#collgeSelected").val($("#college_id").val());
                $("#dateSelected").val($("#graphDateRange").val());
                $("#leadTypeSelected").val($("#graph_lead_type").val());
                $("#leadStatesSelected").val($("#graph_states").val());
                var items = [];
		var graph_bars = $('#graph_bar_filter').val();
		var graph_sort = $('#graph_bar_sorting').val();
                $("input[name='source_keys[]']:checked").each(function(){items.push($(this).val());});
                $("#tableHtmlForm").append($("<input>").attr({"value":items, "name":"sourcePublisherList",'type':"hidden","id":"sourcePublisher"}));
                $("#tableHtmlForm").append($("<input>").attr({"value":type, "name":"downloadtype",'type':"hidden","id":"downloadtype"}));
		console.log($('#graph_bar_fil'));
		if($('#graph_bar_fil').length > 0)
			$('#graph_bar_fil').val(graph_bars);
		else	
			$("#tableHtmlForm").append($("<input>").attr({"value":graph_bars, "name":"graph_bars",'type':"hidden", "id":"graph_bar_fil"}));
		if($('#graph_bar_sort').length > 0)
			$('#graph_bar_sort').val(graph_sort);
		else
			$("#tableHtmlForm").append($("<input>").attr({"value":graph_sort, "name":"graph_sort",'type':"hidden", "id":"graph_bar_sort"}));
                $("#tableHtmlForm").submit();
            }
            break;
        default:    
            break;
    }
    
    return;
}

function downloadDashboardTable(type)
{
    $("#collgeSelected").val($("#college_id").val());
    $("#dateSelected").val($("#dateRange").val());
    $("#tableHtmlForm").append($("<input>").attr({"value":type, "name":"downloadtype",'type':"hidden","id":"downloadtype"}));
    $("#leadTypeSelected").val($("#lead_type").val());
    
    
    $("#tableHtmlForm").submit();
}

function downloadDispositionTable(type){
    $("#collgeSelected").val($("#college_id").val());
    $("#dateSelected").val($("#dateRangeDisposition").val());
    $("#tableHtmlForm").append($("<input>").attr({"value":type, "name":"downloadtype",'type':"hidden","id":"downloadtype"}));
    $("#leadStagesSelected").val($("#lead_stage").val());
    $("#leadChannelSelected").val($("#lead_channel").val());
    $("#tableHtmlForm").submit();
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


function Title_center(divId){
    $("#"+divId+" svg text").first().attr("x", (($("#"+divId+" svg").width() - parseInt($("#"+divId+" svg text").first().attr('x'),10)) / 2).toFixed(0)-50);
}

jQuery(function(){
    $('.filter_collapse').dropdown('toggle');
});
function filterSource(element,listid) {
    
    var value = $(element).val();
    value = value.toLowerCase();
    $("ul#"+listid+"  li").each(function() {
        if ($(this).text().toLowerCase().search(value) > -1) {
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });
}

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

function loadDashboardTableTelephonyDetails(){
    if(!loadTelephonyDetailsFlag){
        return;
    }
    loadTelephonyDetailsFlag    = false;
     $.ajax({
        url: jsVars.dashboardTableTelephonyDetailsLink,
        type: 'post',
        data: {'lead_type':$("#lead_type").val(),'collegeId':$("#college_id").val(),'dateRange':$("#dateRange").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#campaignListLoader.loader-block').show();
        },
        complete: function () {
            $('#campaignListLoader.loader-block').hide();
        },
        success: function (html) { 
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
            }else{
                html    = html.replace("<head/>", "");
                $('#traffiChannel8').html(html);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/**
 * fetch & draws graph for registration device
 * @returns {undefined}
 */
function loadLeadsDeviceGraph(){
   
    $("#device_reg_lead_chart_div").html("");
    $("#device_reg_app_chart_div").html("");
    $("#pdf_device_reg_lead_chart_div").html("");
    $("#pdf_device_reg_app_chart_div").html("");
    
    if($("#college_id").val()==""){
        return;
    }
    
     $.ajax({
        url: jsVars.getLeadsDeviceDataLink,
        type: 'post',
        data: {'collegeId':$("#college_id").val()},
        dataType: 'html',
        async: false,
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#campaignListLoader.loader-block').show();
        },
        complete: function () {
            $('#campaignListLoader.loader-block').hide();
        },
        success: function (response) { 
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    
                    //device vs Leads graph
                    if(typeof responseObject.data.graphData.leadsStats === "object"){
                        google.charts.setOnLoadCallback(function() { drawDeviceGraph('Device Wise Leads Percentage', responseObject.data.graphData.leadsStats,'device_reg_lead_chart_div'); });
                        google.charts.setOnLoadCallback(function() { drawDeviceGraph('Device Wise Leads Percentage', responseObject.data.graphData.leadsStats,'pdf_device_reg_lead_chart_div'); });
                        
                    }
                    //device vs Application graph
                    if(typeof responseObject.data.graphData.appsStats === "object"){
                                         
                        google.charts.setOnLoadCallback(function() { drawDeviceGraph('Device Wise Application Percentage', responseObject.data.graphData.appsStats,'device_reg_app_chart_div'); });
                        google.charts.setOnLoadCallback(function() { drawDeviceGraph('Device Wise Application Percentage', responseObject.data.graphData.appsStats,'pdf_device_reg_app_chart_div'); });
                        
                    }
                    
                }
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alert(responseObject.message);
                }
            }
            
            if(responseObject.is_state_enabled==1){
                loadStateWiseLeadsApplicationGraph('leads', 'Channel/Publisher Wise Leads', 'stateLeads-graphDiv', 'state_leads_chart_div');
                loadStateWiseLeadsApplicationGraph('applications', 'Channel/Publisher Wise Applications','stateApps-graphDiv', 'state_apps_chart_div');
            }
            
            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/**
 * Draws Registartion device graph
 * @param {type} title
 * @param {type} graphData
 * @param {type} graphContainer
 * @returns {undefined}
 */
function drawDeviceGraph(title, graphData, graphContainer){
    if(typeof graphData === "object"){
        
        if ($.isEmptyObject(graphData)) {
            $('#'+graphContainer).html('<img src="/img/donut_no_data_image.jpg">')
        } else {
//            var headerTitle = title + " : <strong>"+totalLeads+"</strong>";
            var headerTitle = title ;
            $('#'+graphContainer+"_header").html(headerTitle);
            var data =  new google.visualization.arrayToDataTable(graphData);
            
            var options = {
                //title: title,
                //titleTextStyle: {'color':'#333', 'fontSize':18, 'bold':false},
                pieSliceText: 'none',
//                width: 714,
//                height: 600,
                
                width: 600,
                height: 350,
                
                pieHole: 0.5,
                colors: ['#00b0f0','#ffc000', '#ff3399', '#92d050'],
                legend: {'position':'right', 'alignment':'center'},
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

/**
 * Load State wise leads for publisher/channel
 * @param {type} statsType
 * @returns {undefined}
 */
function loadStateWiseLeadsApplicationGraph(statsType, title, graphParentContainer, graphContainer){
    $("#"+graphParentContainer).show();
    $("#"+graphContainer).html("");
    $("#pdf_"+graphContainer).html("");
    if($("#college_id").val()==""){
        return;
    }
    
     $.ajax({
        url: jsVars.loadStateLeadsGraphDataLink,
        type: 'post',
        data: {'collegeId':$("#college_id").val(),'statsType':statsType},
        dataType: 'html',
        async:false,
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#campaignListLoader.loader-block').show();
        },
        complete: function () {
            $('#campaignListLoader.loader-block').hide();
        },
        success: function (response) { 
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    if(typeof responseObject.data.graphData === "object"){
                        $("#"+graphParentContainer).show();
                        google.charts.setOnLoadCallback(function() { drawLeadsStateWiseGraph(title, responseObject.data.graphData, graphContainer, responseObject.data.totalLeads, statsType, statsType); });
                       
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


/**
 * Draw leads/application stats graph
 * @param {type} title
 * @param {type} graphData
 * @param {type} graphContainer
 * @param {type} graphType
 * @returns {undefined}
 */
function drawLeadsStateWiseGraph(title, graphData, graphContainer, totalLeads, graphType, subTitle, otherData){
    
    if(typeof graphData === "object"){
        
        if ($.isEmptyObject(graphData)) {
            $('#'+graphContainer).html('<img src="/img/donut_no_data_image.jpg">')
        } else {
            
            var data =  new google.visualization.arrayToDataTable(graphData);
            var headerTitle = title + " : <strong>"+totalLeads+"</strong>";
            $('#'+graphContainer+"_header").html(headerTitle);
            var options = {
                //title: title + '\n'+totalLeads+' '+jQuery.camelCase(subTitle),
                titleTextStyle: {'color':'#333', 'fontSize':18, 'bold':false},
                pieSliceText: 'none',
				width: 600,
                height: 350,
                pieHole: 0.5,
              //  colors: ['#00b0f0','#ffc000', '#ff3399', '#92d050'],
                legend: {'position':'right', 'alignment':'center'},
                pieSliceText: 'percentage',
                sliceVisibilityThreshold: .000000002,
                tooltip: { trigger: 'selection', isHtml: true}
              
            };

            var chart = new google.visualization.PieChart(document.getElementById(graphContainer));
            
            if(typeof graphType != 'undefined'  && graphType != '' ){
                
                function selectHandlerStateLeads(){
                    var selectedItem = chart.getSelection()[0];
                    
                    if(typeof selectedItem != 'undefined' && selectedItem != ''){
                        var publisherChannelName = data.getValue(selectedItem.row, 0);
                        var channelId = data.getValue(selectedItem.row, 2);
                        var publisherCampaignId = data.getValue(selectedItem.row, 3);
                        var statsType = graphType;

                        var childGraphContainer = '';
                        if(statsType == 'leads'){
                            title = 'State Wise Leads';
                            childGraphContainer = 'state_wise_leads_chart_div';
                        }else if(statsType == 'applications'){
                            title = 'State Wise Applications';
                            childGraphContainer = 'state_wise_apps_chart_div';
                        }
                        $('#'+childGraphContainer).html('');
                        $.ajax({
                            url: jsVars.loadPublisherWiseStateGraphDataLink,
                            type: 'post',
                            data: {'collegeId':$("#college_id").val(),'statsType':statsType, 'publisherCampaignId':publisherCampaignId,
                                    'channelId':channelId, 'publisherChannelName':publisherChannelName},
                            dataType: 'html',
                            async:false,
                            headers: {
                                "X-CSRF-Token": jsVars.csrfToken
                            },
                            beforeSend: function () { 
                                $('#campaignListLoader.loader-block').show();
                            },
                            complete: function () {
                                $('#campaignListLoader.loader-block').hide();
                            },
                            success: function (responseData) { 
                                var responseDataObject = $.parseJSON(responseData);
                                
                                if(responseDataObject.status==1){
                                    if(typeof responseDataObject.data === "object"){
                                        if(typeof responseDataObject.data.graphData === "object"){
                                            
                                            title = title + ' (' + publisherChannelName +')';

                                            google.charts.setOnLoadCallback(function() { drawLeadsStateWiseGraph(title, responseDataObject.data.graphData, childGraphContainer, responseDataObject.data.totalLeads, '', graphType, responseDataObject.data.othersData); });
                                            
                                        }                   
                                    }
                                }else{
                                    if (responseDataObject.message === 'session'){
                                        location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                                    }else{
                                        alert(responseDataObject.message);
                                    }
                                }
                                return;
                            },
                            error: function (xhr, ajaxOptions, thrownError) {
                                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                            }
                        });  
                    }
                                     
                }

                google.visualization.events.addListener(chart, 'select', selectHandlerStateLeads);                
                
                
            }

            google.visualization.events.addListener(chart, 'ready', AddNamespaceHandler);
               

            if(typeof graphType != 'undefined' && graphType != ''){
                chart.draw(data, options);
                chart.setSelection([{row:0}]);
                selectHandlerStateLeads();
            }else{
                
                 google.visualization.events.addListener(chart, 'onmouseover', function(entry) {
                    chart.setSelection([{row: entry.row}]);
                 });
                 google.visualization.events.addListener(chart, 'onmouseout', function(entry) {
                    chart.setSelection([]);
                }); 

                
                //options.tooltip = {isHtml: true};
                
                // add tooltip column
                data.addColumn({type: 'string', role: 'tooltip', p: {html: true}});
                
                
                
                if(otherData.length > 0){
                    var otherToolTipHtml = '<table>';
                    $.each(otherData, function(k, v){
                       otherToolTipHtml += '<tr><td>'+v.state+'&nbsp;&nbsp;&nbsp;&nbsp;</td><td>'+v.leadCount+'</td></tr>';
                    });
                    otherToolTipHtml += '</table>';
                    //data.getValue(otherRow, 0)
                    var otherRow = data.getNumberOfRows() - 1;
                      data.setValue(otherRow, 2,
                        '<div class="ggl-tooltip">'+otherToolTipHtml+'</div>'
                      );
                }
                
                chart.draw(data, options);
            }
            //$("#"+graphContainer).append('<span class="graphInfo">'+'Total '+jQuery.camelCase(subTitle)+': '+totalLeads+'</span>');
        }
    }
}

/**
 * loadDashboardTableReferralDetails
 * @returns {undefined}
 */
function loadDashboardTableReferralDetails(total_lead,lead_percent,app_percent){
    if(!loadReferralDetailsFlag){
        return;
    }
    loadReferralDetailsFlag    = false;
     $.ajax({
        url: jsVars.dashboardTableReferralDetailsLink,
        type: 'post',
        data: {'lead_type':$("#lead_type").val(),'collegeId':$("#college_id").val(),'dateRange':$("#dateRange").val(),'total_lead':total_lead,'lead_percent':lead_percent,'app_percent':app_percent},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#campaignListLoader.loader-block').show();
        },
        complete: function () {
            $('#campaignListLoader.loader-block').hide();
        },
        success: function (html) { 
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
            }else{
                html    = html.replace("<head/>", "");
                $('#traffiChannel5').html(html);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$(document).ready(function(){
    $('body').on('click', function(){
        $('.google-visualization-tooltip').hide();
    });
    
});






