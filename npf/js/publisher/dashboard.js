$(document).ready(function(){
    $(".chosen-select").chosen();
    LoadReportDateRangepicker();
    $('#dashboardLoader.loader-block').hide();
    $("#instance_type").change(function(){
        changeInstanceType();
        hidePrimaryFilters(this.value);
        $(".primaryFilters .graph-filter").val('').trigger('chosen:updated');
    });
//    $("#instance_type").change(changeInstanceType);
    $("#source").change(changeSource);
    $("#medium").change(changeMedium);
    $("#college_id").change(getCollegeAccountManager);
    $("#college_id").change(getFilterPermission);
    $(".lead-filter").hide();
    $(".graph-filter").attr('disabled','disabled');
    $(".chosen-select").trigger('chosen:updated');
    $(".application-filter").hide();
    $('.graph-container').hide();
    $('#childExportData').hide();
    
     $('.range-tab-active a').on('click', function (e) {
        e.preventDefault();
        $('.range-tab-active a').removeClass('active');
        $('.range-tab-active li').removeClass('active');
        $(this).parent().addClass('active');
        $(this).addClass('active');
        getLeadsTrendGraph();
    });
    
      $('.parent-graph-tab li a').on('click', function () {
        $(".graph-filter").attr('disabled','disabled');
        $(".chosen-select").trigger('chosen:updated');
        $('.parent-graph-tab li').removeClass('active');
        $('.parent-graph-tab li a').removeClass('active');
        $(this).addClass('active');
        $(this).parent().addClass('active');
        $('.graph-container').hide();
        $('#downloadPdfGraph').show();
    });
    
    $('.download-as-pdf').on('click', function (e) {
        e.preventDefault();
        downloadGraph('leads');
    });
    
    
    $('.download-as-csv').on('click', function (e) {
        var selectedType = '';
        var findParam = '';
        var rangeTypeView = '';
        var defaultDate = '';
        if($('.parent-graph-tab li.active a').hasClass('leads-trend-container')) {
            selectedType = 'leads_trend_container';
            rangeTypeView = $('.range-tab-active a.active').text();
            defaultDate     = $('#defaultDate').val();
        } else if($('.parent-graph-tab li.active a').hasClass('state-wise-container')) {
            selectedType = 'state_wise_container';
            if($('.parent-graph-tab li a.state-wise-container').hasClass('country')) {
                findParam = 'country';
            } else if($('.parent-graph-tab li a.state-wise-container').hasClass('state')) {
                findParam = 'state';
            } else if($('.parent-graph-tab li a.state-wise-container').hasClass('city')) {
                findParam = 'city';
            }
        } else if($('.parent-graph-tab li.active a').hasClass('leads-instance-container')) {
            selectedType = 'leads_insatnce_container';
        } else if($('.parent-graph-tab li.active a').hasClass('campaign-wise-container')) {
            selectedType = 'campaign-wise-container';
        } 
        var $form = $("#publisherDashboardFilterForm");
        
        $form.attr("target",'modalIframe');
        $form.append($("<input>").attr({"value":"snapshot_csv", "name":"export",'type':"hidden","id":"export"}));
        $form.append($("<input>").attr({"value":selectedType, "name":"selectedType",'type':"hidden"}));
        $form.append($("<input>").attr({"value":rangeTypeView, "name":"rangeTypeView",'type':"hidden"}));
        $form.append($("<input>").attr({"value":findParam, "name":"findParam",'type':"hidden"}));
        $form.append($("<input>").attr({"value":defaultDate, "name":"defaultDate",'type':"hidden"}));
        var onsubmit_attr = $form.attr("onsubmit");
        var action_attr = $form.attr("action");
        $form.removeAttr("onsubmit");
        $form.attr("action",'/publishers/snapshot-download-as-csv');
        $form.submit();
        $form.attr("onsubmit",onsubmit_attr);
        $form.attr("action",action_attr);
        $form.find('input[name="export"]').val("");
        $form.removeAttr("target");
        $('#myModal').on('hidden.bs.modal', function(){
            $("#modalIframe").html("");
            $("#modalIframe").attr("src", "");
        });
        
    }); 
 
    
});

var loaderCount = 0;
function getCollegeAccountManager(){
    $(".acManager").html("");
    if($("#college_id").val()==""){
        $(".acManager").html("");
        changeInstanceType();
        return ;
    }
    $.ajax({
        url: jsVars.getCollegeAccountManagerLink,
        type: 'post',
        data: {'collegeId' : $("#college_id").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#dashboardLoader.loader-block').show();
        },
        complete: function () {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('#dashboardLoader.loader-block').hide();
            changeInstanceType();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                if(typeof responseObject.data === "object" && responseObject.data.email.length){
                    var html    = '<h6 class="margin-bottom5">Account Manager</h6><div class="acManagerBox"><div class="pull-left padding-right10"><img style="width:75px;height:75px;" src="'+responseObject.data.image+'" alt="'+responseObject.data.name+'"></div><div class="pull-left  acmName"><strong>'+responseObject.data.name+'</strong><br>'+responseObject.data.mobile+'<br>'+responseObject.data.email+'</div></div>';
                    $(".acManager").html(html);
                }
            }else{
                alert(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function changeInstanceType(){
    var source      = '<select id="source" class="chosen-select graph-filter" name="source"><option selected="selected" value="">Source</option></select>';
    $('#sourceDiv').html(source);
    var medium      = '<select id="medium" class="chosen-select graph-filter" name="medium"><option selected="selected" value="">Medium</option></select>';
    $('#mediumDiv').html(medium);
    var name        = '<select class="chosen-select graph-filter" id="name"  name="name"><option value="">Campaign Name</option></select>';
    $('#campaignNameDiv').html(name);
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    if($("#college_id").val()==""){
        return ;
    }
    var collegeId       = $("#college_id").val();
    var instanceType    = $("#instance_type").val();
    var publisherId     = $("#publisherId").val();
    
    $("#publisherDashboardFilterForm #lead_type").attr('name','lead_type');
    if(instanceType == 'sec_campaign_id'){
        $("#publisherDashboardFilterForm #lead_type").attr('name','sec_lead_type');
    } else if(instanceType == 'ter_campaign_id'){
        $("#publisherDashboardFilterForm #lead_type").attr('name','ter_lead_type');
    } else if(instanceType == 'campaign_id'){
        $("#publisherDashboardFilterForm #lead_type").attr('name','lead_type');
    }
    $.ajax({
        url: jsVars.getFiltersLink,
        type: 'post',
        data: {'collegeId' : collegeId,'publisherId' : publisherId, 'instanceType':instanceType},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#dashboardLoader.loader-block').show();
        },
        complete: function () {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('#dashboardLoader.loader-block').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    if(typeof responseObject.data.sourceList === "object"){
                        var sourceList    = responseObject.data.sourceList;
                        var value   = '<select id="source" class="chosen-select graph-filter" name="source"><option selected="selected" value="">Source</option>';
                        $.each(sourceList, function (index, item) {
                            value += '<option value="'+index+'">'+item+'</option>';
                        });
                        value += '</select>';
                        $('#sourceDiv').html(value);
                        $("#source").change(changeSource);
                    }
                }
                if(typeof responseObject.data === "object"){
                    if(typeof responseObject.data.mediumList === "object"){
                        var mediumList    = responseObject.data.mediumList;
                        var value   = '<select id="medium" class="chosen-select graph-filter" name="medium""><option selected="selected" value="">Medium</option>';
                        $.each(mediumList, function (index, item) {
                            value += '<option value="'+index+'">'+item+'</option>';
                        });
                        value += '</select>';
                        $('#mediumDiv').html(value);
                        $("#medium").change(changeMedium);
                    }
                }
                if(typeof responseObject.data === "object"){
                    if(typeof responseObject.data.campaignNameList === "object"){
                        var campaignNameList    = responseObject.data.campaignNameList;
                        var value   = '<select id="name" class="chosen-select graph-filter" name="name"><option selected="selected" value="">Campaign Name</option>';
                        $.each(campaignNameList, function (index, item) {
                            value += '<option value="'+index+'">'+item+'</option>';
                        });
                        value += '</select>';
                        $('#campaignNameDiv').html(value);
                    }
                }
                
                if($("#reportType").val() === 'detail' || $("#reportType").val() === 'table' ){
                    $("#source").removeAttr("disabled");
                    $("#medium").removeAttr("disabled");
                    $("#name").removeAttr("disabled");
                }else{
                    $("#source").attr('disabled','disabled');
                    $("#medium").attr('disabled','disabled');
                    $("#name").attr('disabled','disabled');
                }
            }else{
                alert(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function changeSource(){
    var medium      = '<select id="medium" class="chosen-select graph-filter" name="medium"><option selected="selected" value="">Medium</option></select>';
    $('#mediumDiv').html(medium);
    var name    = '<select class="chosen-select graph-filter" id="name"  name="name"><option value="">Campaign Name</option></select>';
    $('#campaignNameDiv').html(name);
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    if($("#college_id").val()==""){
        return ;
    }
    var collegeId       = $("#college_id").val();
    var publisherId     = $("#publisherId").val();
    var instanceType    = $("#instance_type").val();
    var source          = $("#source").val();
    $.ajax({
        url: jsVars.getFiltersLink,
        type: 'post',
        data: {'collegeId' : collegeId,'publisherId' : publisherId, 'instanceType':instanceType, 'source':source},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#dashboardLoader.loader-block').show();
        },
        complete: function () {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('#dashboardLoader.loader-block').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);  
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    if(typeof responseObject.data.mediumList === "object"){
                        var mediumList    = responseObject.data.mediumList;
                        var value   = '<select id="medium" class="chosen-select graph-filter" name="medium"><option selected="selected" value="">Medium</option>';
                        $.each(mediumList, function (index, item) {
                            value += '<option value="'+index+'">'+item+'</option>';
                        });
                        value += '</select>';
                        $('#mediumDiv').html(value);
                        $("#medium").change(changeMedium);
                    }
                    if($("#reportType").val() === 'detail' || $("#reportType").val() === 'table' ){
                        $("#medium").removeAttr("disabled");
                    }else{
                        $("#medium").attr('disabled','disabled');
                    }
                }
            }else{
                alert(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function changeMedium(){
    var name    = '<select class="chosen-select graph-filter" id="name"  name="name"><option value="">Campaign Name</option></select>';
    $('#campaignNameDiv').html(name);
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    $('#detailReportLoader.loader-block').hide();
    if($("#college_id").val()==""){
        return ;
    }
    var collegeId       = $("#college_id").val();
    var publisherId     = $("#publisherId").val();
    var instanceType    = $("#instance_type").val();
    var source          = $("#source").val();
    var medium          = $("#medium").val();
    $.ajax({
        url: jsVars.getFiltersLink,
        type: 'post',
        data: {'collegeId' : collegeId,'publisherId' : publisherId, 'instanceType':instanceType, 'source':source, 'medium':medium},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#dashboardLoader.loader-block').show();
        },
        complete: function () {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('#dashboardLoader.loader-block').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response); 
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                    if(typeof responseObject.data.campaignNameList === "object"){
                        var campaignNameList    = responseObject.data.campaignNameList;
                        var value   = '<select id="name" class="chosen-select graph-filter" name="name"><option selected="selected" value="">Campaign Name</option>';
                        $.each(campaignNameList, function (index, item) {
                            value += '<option value="'+index+'">'+item+'</option>';
                        });
                        value += '</select>';
                        $('#campaignNameDiv').html(value);
                    }
                }
                if($("#reportType").val() === 'detail' || $("#reportType").val() === 'table' ){
                    $("#name").removeAttr("disabled");
                }else{
                    $("#name").attr('disabled','disabled');
                }
            }else{
                alert(responseObject.message);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function callGraphMethod(){
    if($('.parent-graph-tab li.active a').hasClass('leads-trend-container')) {
        getLeadsTrendGraph();
    } else if($('.parent-graph-tab li.active a').hasClass('state-wise-container')) {
        getStateWiseLeadsGraph();
    } else if($('.parent-graph-tab li.active a').hasClass('leads-instance-container')) {
        getLeadsInstanceGraph();
    } else if($('.parent-graph-tab li.active a').hasClass('campaign-wise-container')) {
        getCampaignWiseGraph();
    }else{
        getLeadsTrendGraph();
    }
}

function loadMoreDetail(listingType){
    if($("#college_id").val()==""){
        $('#dashboardContainerError').show();
        $("#dashboardDataContainer").hide();
        $('#summaryDiv').html('');
        return;
    }
    
    $('#dashboardContainerError').hide();
    $("#dashboardDataContainer").show();
    if(listingType === 'reset'){
        if($("#reportType").val() === "graph"){
            checkCollegeConfigRegistration($("#college_id").val());
            callGraphMethod();
            return;
        }
        $("#page").val(1);
        $("#detailPage").val(1);
    }
    if($("#reportType").val() === "graph"){
        return;
    }
    if(parseInt($("#page").val())===1 && parseInt($("#detailPage").val())===1){
        loadDashboardSummary();
    }
    $.ajax({
        url: jsVars.loadMoreReportLink,
        type: 'post',
        data: $('#publisherDashboardFilterForm input,#publisherDashboardFilterForm select'),
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            loaderCount++;
            $("#dashboard_load_btn").attr("disabled","disabled");
            $('#dashboardLoader.loader-block').show();
        },
        complete: function () {
            loaderCount--;
            if(loaderCount === 0){
                $('#dashboardLoader.loader-block').hide();
            }
            $("#dashboard_load_btn").removeAttr("disabled");
        },
        success: function (html) {            
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
            }else{
                var countRecord = countResult(html);
                //console.log(countRecord);
                html    = html.replace("<head/>", "");
                if($("#reportType").val()=="table"){
                    if(parseInt($("#page").val())===1){
                        if(html.search('alert alert-danger') != -1){
                            $("#summaryDiv").hide();
                        }else{
                            $("#summaryDiv").show();
                        }
                        $('#tableView').html(html);
                    }else{
                        $('#tableView').find("tbody").append(html);
                    }
                    if(countRecord < 10){
                        $('#loadMoreTable').hide();
                    }else{
                        $('#loadMoreTable').show();
                    }
                    $("#page").val(parseInt($("#page").val())+1);

                }else if($("#reportType").val()=="detail"){
                    if(parseInt($("#detailPage").val())===1){
                        if(html.search('alert alert-danger') != -1){
                            $("#summaryDiv").hide();
                        }else{
                            $("#summaryDiv").show();
                        }
                        $('#detailView').html(html);
                    }else{
                        $('#detailView').find("tbody").append(html);
                    }
                    var totalRecord = countResult($('#detailView').html());
                    if(parseInt($("#totalLeads").html())==totalRecord){
                        $('#loadMoreDetail').hide();
                    }else{
                        $('#loadMoreDetail').show();
                    }
                    $("#detailPage").val(parseInt($("#detailPage").val())+1);
                }else{
                    
                }
                hidePrimaryFilters($('#instance_type').val(),1);
                if(listingType === 'reset'){
                  makeScrollable();
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
};

function showTabularTab(){
    $(".graph-filter").removeAttr('disabled');
    $(".chosen-select").trigger('chosen:updated');
    $("#reportType").val("table");
    $("#graphDataContainer").hide();
    $("#tabularDataContainer").show();
    $('#childExportData').show();
    if(parseInt($("#page").val())===1){
//        loadMoreDetail();
    }
    loadMoreDetail('reset');
}

function showDetailTab(){
    $(".graph-filter").removeAttr('disabled');
    $(".chosen-select").trigger('chosen:updated');
    $("#reportType").val("detail");
    $("#graphDataContainer").hide();
    $("#tabularDataContainer").show();
    $('#childExportData').show();
    if(parseInt($("#detailPage").val())===1){
//        loadMoreDetail();
    }
     loadMoreDetail('reset');
}

function quickSnapshot(){
    $(".graph-filter").attr('disabled','disabled');
    $(".graph-filter").val('').trigger('chosen:updated');
    $("#reportType").val("graph");
    $("#graphDataContainer").show();
    $("#tabularDataContainer").hide();
    $('#childExportData').hide();
    $('.graph-container').hide();
     $(".primaryFilters").show();
}

function countResult(html){
    var len = (html.match(/listDataRow/g) || []).length;
    return len;
}

function loadDashboardSummary(){
    $.ajax({
        url: jsVars.dashboardSummaryLink,
        type: 'post',
        data: $('#publisherDashboardFilterForm input,#publisherDashboardFilterForm select'),
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            loaderCount++;
            $('#dashboardLoader.loader-block').show();
        },
        complete: function () {
            loaderCount--;
            if(loaderCount === 0){
                $('#dashboardLoader.loader-block').hide();
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
                $('#summaryDiv').html(html);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
};

function exportDashboardReportCsv(){
    var $form = $("#publisherDashboardFilterForm");
    $form.attr("action",jsVars.exportDashboardReportCsvLink);
    $form.attr("target",'modalIframe');
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    $('#myModal').modal('show');
    $form.submit();
    $form.attr("onsubmit",onsubmit_attr);
    $form.removeAttr("target");
    
}

var downloadReportFile = function(url){
    window.open(url, "_self");
};

function getFilterPermission(){
    if($("#college_id").val() != ""){
        $.ajax({
            url: jsVars.getFilterPermissionLink,
            type: 'post',
            data: {'collegeId' : $("#college_id").val()},
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars.csrfToken
            },
            success: function (response) {
                var responseObject = $.parseJSON(response);
                if(responseObject.status ==1){
                    if(typeof responseObject.permissions === "object"){
                        if(responseObject.permissions.viewApplicationCount === true){
                            $(".application-filter").show();
                            $(".application-filter").addClass('primaryFilters');
                        }else{
                            $(".application-filter").hide();
                            $(".application-filter").removeClass('primaryFilters');
                        }
                        if(responseObject.permissions.viewLeadStatus === true){
                            $(".lead-filter").show();
                            $(".lead-filter").addClass('primaryFilters');
                        }else{
                            $(".lead-filter").hide();
                            $(".lead-filter").removeClass('primaryFilters');
                        }
                        $(".lead-filter .graph-filter").val('').trigger('chosen:updated');
                        $(".application-filter .graph-filter").val('').trigger('chosen:updated');
                        if(responseObject.permissions.exportDashboardReportCsv === true){
                            $("#parentExportData").show();
                        }else{
                            $("#parentExportData").hide();
                        }
                    }
                }else{
                    $(".lead-filter").hide();
                    $(".application-filter").hide();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}


function getLeadsTrendGraph() {
    $('.parent-graph-tab li').removeClass('active');
    $('.parent-graph-tab li a').removeClass('active');
    $('.parent-graph-tab li:first').addClass('active');
    $('.parent-graph-tab li:first a').addClass('active');
    var collegeId       = $('#college_id').val();
    var rangeValue      = $('#date_range').val();
    var publisherId     = $('#publisherId').val();
    var defaultDate     = $('#defaultDate').val();
    var rangeTypeView   = $('.range-tab-active a.active').text();
    if(publisherId && collegeId){
        
        $('#dashboardLoader').show();
        $.ajax({
            url: '/publishers/leadsTrendGraphData',
            type: 'post',
            dataType: 'json',
            data: {'collegeId': collegeId, 'rangeValue': rangeValue, 'rangeTypeView': rangeTypeView,'publisherId':publisherId,'defaultDate':defaultDate},
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (json) {
                
                
                if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                    window.location.href = json['redirect'];
                }else if (typeof json['error'] != 'undefined' && json['error'] != "") {
                    $('#line-chart-graph').html('<h4 class="text-danger" style="padding:40px">'+json['error']+'</h4>');
                } else if (typeof json['success'] != 'undefined' && json['success'] == 200) {
                    if($('#date_range').val() != ''){
                        json['pdf_center']  =  'Date Range - '+$('#date_range').val().replace(',', ' to ');
                    }
                    json['pdf_h3']      = 'Leads Trend - '+ $('.range-tab-active a.active').text();
                    $("#rangeTab").show();
                    if(json['content'].length == 0) {
                        $("#graphDownloadButton").hide();
                    }else{
                        $("#graphDownloadButton").show();
                    }
                    makeLinearGraph(json);
                    if(json['content'].length != 0) {
                        $('#line-chart-graph').siblings('.graph-footer-msg').remove();
                        $('#line-chart-graph').after('<div class=" col-sm-12 margin-bottom10 graph-footer-msg"><small>* Graph is based on primary leads</small></div>');
                    }
                }
                $('#dashboardLoader').hide();
                $('.leads-trend-container').show();
                makeScrollable();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $('#dashboardLoader').hide();
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}


function getLeadsInstanceGraph() {
    var collegeId          = $('#college_id').val();
    var rangeValue         = $('#date_range').val();
    var publisherId        = $('#publisherId').val();
    $('.leads-instance-container .tab-content').html('');
    $('#dashboardLoader').show();
        $.ajax({
            url: '/publishers/leadsInstanceGraphData',
            type: 'post',
            dataType: 'json',
            data: {'collegeId': collegeId, 'rangeValue': rangeValue, 'publisherId': publisherId,'type': '','clickingvalue': ''},
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (json) {
                
                
                if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                    window.location.href = json['redirect'];
                }else if (typeof json['error'] != 'undefined' && json['error'] != "") {
                    $('#instance-wise-chart-graph').html('<h4 class="text-danger" style="padding:40px">'+json['error']+'</h4>');
                } else if (typeof json['success'] != 'undefined' && json['success'] == 200) {
                    if($('#date_range').val() != ''){
                        json['pdf_center']  =  'Date Range - '+$('#date_range').val().replace(',', ' to ');
                    }
                    $("#instanceGraphHeader").show();
                    simplePieChart(json);
                }
                $('.leads-instance-container').show();
                $('#dashboardLoader').hide();
                makeScrollable();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
}


function getStateWiseLeadsGraph() {
    
    var collegeId          = $('#college_id').val();
    var rangeValue         = $('#date_range').val();
    var publisherId        = $('#publisherId').val();
    $('.state-wise-container .tab-content').html('');
    $('#dashboardLoader').show();
    if ($('.parent-graph-tab li a.state-wise-container').hasClass('country')) {
        var findParam = 'country';
    } else if ($('.parent-graph-tab li a.state-wise-container').hasClass('state')) {
        var findParam = 'state';
    } else if ($('.parent-graph-tab li a.state-wise-container').hasClass('city')) {
        var findParam = 'city';
    }
        $.ajax({
            url: '/publishers/stateWiseLeadsGraphData',
            type: 'post',
            dataType: 'json',
            data: {'collegeId': collegeId, 'rangeValue': rangeValue, 'publisherId': publisherId,'type': findParam,'clickingvalue': ''},
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (json) {
                
                if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                    window.location.href = json['redirect'];
                }else if (typeof json['error'] != 'undefined' && json['error'] != "") {
                    $('#country-wise-chart-graph').html('<h4 class="text-danger" style="padding:40px">'+json['error']+'</h4>');
                } else if (typeof json['success'] != 'undefined' && json['success'] == 200) {
                    if($('#date_range').val() != ''){
                        json['pdf_center']  =  'Date Range - '+$('#date_range').val().replace(',', ' to ');
                    }
                    makePieChart(json);
                }
                
                $('.state-wise-container').show();
                $('#dashboardLoader').hide();
                makeScrollable();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
}


function getCampaignWiseGraph() {
    
    var collegeId          = $('#college_id').val();
    var rangeValue         = $('#date_range').val();
    var publisherId        = $('#publisherId').val();
    var publisherName      = $('#publisherName').val();
    $('.campaign-wise-container .tab-content').html('');
    $('#dashboardLoader').show();
    $.ajax({
        url: '/publishers/getPublisherCampaignData',
        type: 'post',
        dataType: 'json',
        async:false,
        data: {'collegeId': collegeId, 'rangeValue': rangeValue, 'publisherId': publisherId,'publisherName': publisherName},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {

             if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                window.location.href = json['redirect'];
            }else if (typeof json['error'] != 'undefined' && json['error'] != "") {
                $('#campaign-wise-chart-graph').html('<h4 class="text-danger" style="padding:40px">'+json['error']+'</h4>');
            }else if (json == '') {
                $('#campaign-wise-chart-graph').html('<h4 class="text-danger" style="padding:40px">Data Not Found</h4>');
            } else {
                makeCampaignD3Graph('campaign-wise-chart-graph',json);
            }
            setTimeout(function(){
                $('.campaign-wise-container').show();
                $('#downloadPdfGraph').hide();
                $('#campaign-wise-chart-graph svg g').attr('transform', 'translate(370, 200)');
            },200);
            $('#dashboardLoader').hide();
            makeScrollable();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function checkCollegeConfigRegistration(college_id) {
    if (college_id.length <= 0) {
        college_id = 0;//blank colleage id
    }
    if ($('.parent-graph-tab li a.state-wise-container').hasClass('country')) {
        $('.parent-graph-tab li a.state-wise-container').removeClass('country');
    } else if ($('.parent-graph-tab li a.state-wise-container').hasClass('state')) {
        $('.parent-graph-tab li a.state-wise-container').removeClass('state');
    } else if ($('.parent-graph-tab li a.state-wise-container').hasClass('city')) {
        $('.parent-graph-tab li a.state-wise-container').removeClass('city');
    }
    $('#country-wise-download').addClass('graph-2column');
    $('#dashboardLoader').show();
    $.ajax({
        url: '/leads/checkCollegeConfigRegistration',
        type: 'post',
        dataType: 'json',
        async:false,
        data: {'college_id': college_id},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                window.location.href = json['redirect'];
            } else if (typeof json['status'] != 'undefined' && json['status'] == 200 && typeof json['existvalue'] != 'undefined') {
                if (json['existvalue']['key'] == 'country') {
                    $('.parent-graph-tab li a.state-wise-container').parent().show();
                    $('.parent-graph-tab li a.state-wise-container').addClass('country');
                    $('#country-wise-download').removeClass('graph-2column');
                } else if (json['existvalue']['key'] == 'state') {
                    $('.parent-graph-tab li a.state-wise-container').parent().show();
                    $('.parent-graph-tab li a.state-wise-container').addClass('state');
                } else if (json['existvalue']['key'] == 'city') {
                    $('.parent-graph-tab li a.state-wise-container').parent().show();
                    $('.parent-graph-tab li a.state-wise-container').addClass('city');
                } else {
                    if ($('.parent-graph-tab li a.state-wise-container').length) {
                        $('.parent-graph-tab li a.state-wise-container').parent().hide();
                    }
                }
            } else {
                if ($('.parent-graph-tab li a.state-wise-container').length) {
                    $('.parent-graph-tab li a.state-wise-container').parent().hide();
                }
            }
            
            if(typeof json['registration_date'] != 'undefined'){
                $('#defaultDate').val(json['registration_date']);
            }
           
            $('#dashboardLoader').hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

var downloadPublishersDataFile = function (url) {
    window.open(url, "_self");
};

function hidePrimaryFilters(val,changeView){
    if(val == 'campaign_id' || val == ''){
        $(".primaryFilters").show();
    }else{
        $(".primaryFilters").hide();
    }
    if(changeView == '1'){
        if(val == 'campaign_id' || val == ''){
            $(".primaryView").show();
        }else{
            $(".primaryView").hide();
        }
    }
}
