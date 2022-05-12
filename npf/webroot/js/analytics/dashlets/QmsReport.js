var initilizeQmsReport = function () {
    dateRangeHtml = "";
    selectedTabInQmsReport  = "open";
    $("#QmsReportDashlet").find(".applyDates").click(function () 
    {
        $("#QmsReport_range1StartDate").val("");
        $("#QmsReport_range1EndDate").val("");
        if ($("#QmsReportDashlet").find(".inputBaseStartDate").val() !== "" &&
                $("#QmsReportDashlet").find(".inputBaseEndDate").val() !== "") {
            $("#QmsReport_range1StartDate").val($("#QmsReportDashlet").find(".inputBaseStartDate").val());
            $("#QmsReport_range1EndDate").val($("#QmsReportDashlet").find(".inputBaseEndDate").val());
            startDateObj = new Date($("#QmsReportDashlet").find(".inputBaseStartDate").val());
            startDate = startDateObj.getDate() + " " +startDateObj.getMonthName() + " " + startDateObj.getFullYear()
            endDateObj = new Date($("#QmsReportDashlet").find(".inputBaseEndDate").val());
            endDate = endDateObj.getDate() + " " +endDateObj.getMonthName() + " " + endDateObj.getFullYear()
            dateRangeHtml = "(" + startDate + " to " + endDate + ")";                
        }
        $("#QmsReport_dateRange").html(dateRangeHtml);
        createQmsReportGraph();
    });
    if(dateRangeHtml == "") {
        getcurrentDate();
        $("#QmsReport_dateRange").html(dateRangeHtml);
    }

    $("#QmsReportDashlet").find(".cancelDates").click(function () {
        getcurrentDate();
        createQmsReportGraph();
    });
    $('.sumo-select').SumoSelect({
        search: true,
        searchText: 'Select Status',
        selectAll: true,
	placeholder: 'Select Status', 
        captionFormatAllSelected: "All Selected.", 
        triggerChangeCombined: true, 
        okCancelInMulti: true,
        floatWidth: 600,
        forceCustomRendering: true,
        nativeOnDevice: ['Android', 'BlackBerry', 'iPhone', 'iPad', 'iPod', 'Opera Mini', 'IEMobile', 'Silk'],        
    });    
    createQmsReportGraph();
};
var getcurrentDate = function() {
    $("#QmsReport_range1StartDate").val("");
    $("#QmsReport_range1EndDate").val("");    
    dateObj = new Date();
    dateRangeHtml = "Till : (" + dateObj.getDate() + " " +dateObj.getMonthName() + " " + dateObj.getFullYear() + ")";
    $("#QmsReport_dateRange").html(dateRangeHtml);   
}

var createQmsReportGraph = function (event) {
    var dashletUrl = $("#qmsReportDashlet").data('url');
    $("#QmsReport_collegeId").val($("#collegeId").val());
    var filters = $("#QmsReportFilterForm").serializeArray();
    
    

    var collegeId = 0;
    var queryStatus = [];
    var range_start ='';
    var range_end ='';
    $.each(filters, function(i, field) {
        if(field.name == "collegeId"){
            collegeId = field.value; 
        }
        if(field.name == "query_status[]"){
            queryStatus.push(field.value); 
        }
        if(field.name == "range1[start]"){
            range_start = field.value; 
        }
        if(field.name == "range1[end]"){
            range_end = field.value; 
        }

    });

    if(selectedTabInQmsReport == 'closed'){
        queryStatus.push(12);
    }
    $.ajax({
        url: dashletUrl,
        type: 'post',
        data: filters,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $("#counsellor_id_hidden").val($("#QmsReport_counsellor_id").val())
            $("#QmsReportDashletHTML .panel-loader").show();
            $("#QmsReportDashletHTML .panel-heading").addClass("pvBlur");
            if(selectedTabInQmsReport == 'open') {
            } else if(selectedTabInQmsReport == 'closed') {
            }
        },
        complete: function () {
            $("#QmsReportDashletHTML .panel-loader").hide();
            $("#QmsReportDashletHTML .panel-heading").removeClass("pvBlur"); 
            table_fix_head();           
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                $("#closedQueryTableRows").html("");
                $("#openQueryTableRows").html("");
                if (typeof responseObject.data === "object") {
                    var dashletData = responseObject.data;
                    if (typeof dashletData.qmsCategories !== "object") {
                        return;
                    }
                    var tableRows = '';
                    var tableFooter = '';
                    var range_0_2_total   = 0;
                    var range_3_5_total   = 0;
                    var range_6_total     = 0;
                    var grand_total       = 0;
                    var newParent   = true;
                    ///////////for remove record total value 0///
//                    var cat_ids = [];
//                    $.each(dashletData.qmsReportData.taxonomy,function(key,value){
//                        if(value.total == 0){    
//                           delete dashletData.qmsReportData.taxonomy[key];
//                        }
//                        else{
//                            cat_ids[key] = key; 
//                        }
//                        
//                    });
//                    $.each(dashletData.qmsReportData.widget,function(key,value){
//                        if(value.total == 0){
//                           delete dashletData.qmsReportData.widget[key];
//                        }
//                        else{
//                            cat_ids[key] = key;
//                        }
//                    });
                    ////////////////////////
                    $.each(dashletData.qmsCategories, function (parentCategoryName, childCategories) {
                        newParent   = true;
                        ///////////for remove record total value 0///
//                        $.each(childCategories,function(key){
//                            if(cat_ids.indexOf(key) < 0){
//                                delete childCategories[key];
//                            }
//                        });
                        /////////////////////                        
                        if(Object.keys(childCategories).length){
                            $.each(childCategories, function (childCategory, childCategoryName) {

                                var range_0_2   = 0;
                                var range_3_5   = 0;
                                var range_6     = 0;
                                var total       = 0;
                                var linkHash_range_0_2 = linkHash_range_3_5 = linkHash_range_6 = linkHash_total = '0';
                                if(parentCategoryName==="Widget"){
                                    if(childCategory in dashletData.qmsReportData.widget){
                                        range_0_2   = dashletData.qmsReportData.widget[childCategory]["range_0_2"];
                                        range_3_5   = dashletData.qmsReportData.widget[childCategory]["range_3_5"];
                                        range_6     = dashletData.qmsReportData.widget[childCategory]["range_6"];
                                        total       = dashletData.qmsReportData.widget[childCategory]["total"];
                                    }
                                    
                                    
                                    linkHash_range_0_2 = dynamicPostFormQueryList(collegeId,queryStatus,2,childCategory,'widget',range_0_2,range_start,range_end, dashletData.linkdata);
                                    linkHash_range_3_5 = dynamicPostFormQueryList(collegeId,queryStatus,'3-5',childCategory,'widget',range_3_5,range_start,range_end, dashletData.linkdata);
                                    linkHash_range_6 = dynamicPostFormQueryList(collegeId,queryStatus,5,childCategory,'widget',range_6,range_start,range_end, dashletData.linkdata);
                                    linkHash_total = dynamicPostFormQueryList(collegeId,queryStatus,'total',childCategory,'widget',total,range_start,range_end, dashletData.linkdata);
                                

                               }else{                               
                                    if(childCategory in dashletData.qmsReportData.taxonomy){
                                        range_0_2   = dashletData.qmsReportData.taxonomy[childCategory]["range_0_2"];
                                        range_3_5   = dashletData.qmsReportData.taxonomy[childCategory]["range_3_5"];
                                        range_6     = dashletData.qmsReportData.taxonomy[childCategory]["range_6"];
                                        total       = dashletData.qmsReportData.taxonomy[childCategory]["total"];
                                    }

                                    linkHash_range_0_2 = dynamicPostFormQueryList(collegeId,queryStatus,2,childCategory,'t',range_0_2,range_start,range_end, dashletData.linkdata);
                                    linkHash_range_3_5 = dynamicPostFormQueryList(collegeId,queryStatus,'3-5',childCategory,'t',range_3_5,range_start,range_end, dashletData.linkdata);
                                    linkHash_range_6 = dynamicPostFormQueryList(collegeId,queryStatus,5,childCategory,'t',range_6,range_start,range_end, dashletData.linkdata);
                                    linkHash_total = dynamicPostFormQueryList(collegeId,queryStatus,'total',childCategory,'t',total,range_start,range_end, dashletData.linkdata);
                                }
                                
                                range_0_2_total = parseInt(range_0_2_total) + parseInt(range_0_2)
                                range_3_5_total = parseInt(range_3_5_total) + parseInt(range_3_5)
                                range_6_total   = parseInt(range_6_total) + parseInt(range_6)
                                grand_total     = parseInt(grand_total) + parseInt(total)
                                tableRows += '<tr>';
                                if(newParent){
                                    tableRows += '<td class="text-left fw-500 wsNormal" rowspan="'+Object.keys(childCategories).length+'">' + parentCategoryName + '</td>';
                                }
                                tableRows += '<td class="text-left fw-500 wsNormal colGroup2">' + childCategoryName + '</td>';
                                tableRows += '<td class="colGroup1 text-center">' + linkHash_range_0_2 + '</td>';
                                tableRows += '<td class="colGroup1 text-center">' + linkHash_range_3_5 + '</a></td>';
                                tableRows += '<td class="colGroup1 text-center">' + linkHash_range_6 + '</a></td>';

                                tableRows += '<td class="colGroup2 text-center">' + linkHash_total + '</a></td>';
                                tableRows += '</tr>';
                                newParent   = false;
                            });
                        }
                    });
                    if(tableRows!==''){
                        tableFooter = '<tr>\
                                        <td class="text-left fw-700 wsNormal">Total</td>\
                                        <td class="text-left fw-500 wsNormal colGroup2">&nbsp;</td>\
                                        <td class="text-center fw-700 colGroup1" style="width:15%; z-index:999;">'+range_0_2_total+'</td>\
                                        <td class="text-center fw-700 colGroup1" style="width:15%; z-index:999;">'+range_3_5_total+'</td>\
                                        <td class="text-center fw-700 colGroup1" style="width:15%; z-index:999;">'+range_6_total+'</td>\
                                        <td class="text-center fw-700 colGroup2" style="width:15%; z-index:999;">'+grand_total+'</td>\
                                    </tr>';
                    }
                    if(selectedTabInQmsReport == 'open') {
                        $("#openQueryTableRows").html(tableRows);
                        $("#openQueryTableDiv").show();
                        $("#closedQueryTableDiv").hide();
                        $("#openQueryTableFooter").html(tableFooter);
                    } else if(selectedTabInQmsReport == 'closed') {
                        $("#closedQueryTableRows").html(tableRows);
                        $("#openQueryTableDiv").hide();
                        $("#closedQueryTableDiv").show();
                        $("#closedQueryTableFooter").html(tableFooter);
                    }
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(responseObject.message,"error");
                }
            }
            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
};

function QmsReport_downloadCSV() {
    $("#QmsReportFilterForm").submit();
}

function openQmsReportTabs(tabName) {
    resetQmsReportFilterForm();
    getcurrentDate();
    selectedTabInQmsReport  = tabName;
    $("#QmsReport_dataType").val(tabName);
    if(selectedTabInQmsReport == 'open') {
        $("#OpenQueriesTabParent").addClass("active");
        $("#ClosedQueriesTabParent").removeClass("active");
        $("#QmsReport_ap_button").show();
    } else if(selectedTabInQmsReport == 'closed') {
        $("#ClosedQueriesTabParent").addClass("active");
        $("#OpenQueriesTabParent").removeClass("active");
        $("#QmsReport_ap_button").hide();
    }
    createQmsReportGraph();
}

function resetQmsReportFilterForm() {
    $("#QmsReportFilterForm").find('select.dashletFilter').each(function () {
        $(this).val('');
    });
    $('#QmsReport_query_status').each(function(){
       this.selected = false;
       $(this).val('');
       $(this)[0].sumo.reload();
    });     
    $("#QmsReport_range1StartDate").val("");
    $("#QmsReport_range1EndDate").val("");    
    $('.chosen-select').trigger('chosen:updated');
}


function dynamicPostFormQueryList(collegeId,queryStatus,range,childCategory,category_type,data,range_start,range_end, link_data){
    var query_date_r = ''
    if(range_start != ""){
        var date = new Date(range_start);
        query_date_r += (((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) +'/'+ ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + date.getFullYear());
        query_date_r += ","
    }
    if (range_end != ""){
        var date = new Date(range_end);
        query_date_r += (((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) +'/'+ ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + date.getFullYear());
        
    }    
    if(category_type == 'widget'){
        var qmsReportHash = window.btoa(JSON.stringify({status:queryStatus,r:range,w:childCategory,query_date:query_date_r,qmsReport:true}));
    }
    else{
        var qmsReportHash = window.btoa(JSON.stringify({status:queryStatus,r:range,t:childCategory,query_date:query_date_r,qmsReport:true}));
    }
    var collegeHash = Number(link_data.hashsalt) + Number(collegeId);
    if(data > 0){
        return '<a target="_blank" href="'+jsVars.FULL_URL+'/npf-backend/qms/'+collegeHash+'/'+qmsReportHash+'" >'+data+'</a>';
    }
    else{
        return data;
    }


    // <a href="'+linkHash_range_0_2+'">' + range_0_2 + '</a>
    // var newForm = jQuery('<form>', {
    //     'action': jsVars.FULL_URL+'/query/lists',
    //     'target': '_top',
    //     'method':"get"
    // }).append(jQuery('<input>', {
    //     'name': 'qmsReport',
    //     'value': qmsReportHash,
    //     'type': 'hidden'
    // }));
    // newForm.appendTo('body').submit();
    
}