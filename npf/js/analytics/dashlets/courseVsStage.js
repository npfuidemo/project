var initilizeCourseVsStageTable = function () {
    createCourseVsStageTable();
    $("#courseVsStageTableDashletHTML").find(".applyDates").click(function () {
        $("#courseVsStageTable_registrationDate").val("");
        var dateRangeHtml = 'Till Date';
        if ($("#courseVsStageTable_registrationDate").find(".inputBaseStartDate").val() !== "" &&
                $("#courseVsStageTable_registrationDate").find(".inputBaseEndDate").val() !== "") {
            $("#courseVsStageTable_registrationDate").val($("#courseVsStageTableDashletHTML").find(".inputBaseStartDate").val() +","+$("#courseVsStageTableDashletHTML").find(".inputBaseEndDate").val());
            var start = new Date($("#courseVsStageTableDashletHTML").find(".inputBaseStartDate").val());
            var end = new Date($("#courseVsStageTableDashletHTML").find(".inputBaseEndDate").val());
            var strtdate =  start.getDate();
            if(strtdate < 10) strtdate = '0'+strtdate;
            var endate =  end.getDate();
            if(endate < 10) endate = '0'+endate;
            dateRangeHtml = '('+ strtdate +' '+ start.getMonthName() +' '+ start.getFullYear() +" - "+ endate +' '+ end.getMonthName() +' '+ end.getFullYear()+')';
        }
        $('#courseVsStageTable_dateRange').html(dateRangeHtml);
        createCourseVsStageTable();
    });
    $("#courseVsStageTableDashletHTML").find(".cancelDates").click(function () {
        $("#courseVsStageTable_registrationDate").val('');
        $('#courseVsStageTable_dateRange').html('Till Date');
        createCourseVsStageTable();
    });
	 $(".sumo-select").SumoSelect({
		search: true, 
		placeholder: $(this).data('placeholder'), 
		captionFormatAllSelected: "All Selected.", 
		searchText: $(this).data('placeholder'), 
		triggerChangeCombined: true, 
		okCancelInMulti: true,
		floatWidth: 600,
		forceCustomRendering: true,
		nativeOnDevice: ['Android', 'BlackBerry', 'iPhone', 'iPad', 'iPod', 'Opera Mini', 'IEMobile', 'Silk'],
	});
};

function getSpecialization(courseId){
    $("#courseVsStageTable_courseId").val(courseId);
    if($('#'+courseId).hasClass('hideSpecialisation')){
        $(".columnCollasp").each(function() {
            if(!($(this).hasClass('collapsed'))){
               $(this).trigger('click'); 
            }
        });
        createCourseVsStageTable();
    } else {
	$('.ccd').remove(); 
        $('.parent_'+courseId).remove();
    }
    $('#'+courseId).toggleClass('hideSpecialisation');
}

function collapseSubSatges(stageId){
    var t = $('.headerCollapseSubStage_'+stageId).attr('data-colspan');
    if($('#collapseStage_'+stageId).hasClass('collapsed')){
        $('.collapseSubStage_'+stageId).removeClass('hide');
        $('.headerCollapseSubStage_'+stageId).attr('colspan',t);
    } else {
        $('.collapseSubStage_'+stageId).addClass('hide');
        $('.headerCollapseSubStage_'+stageId).attr('colspan',1);
    }
    $('#collapseStage_'+stageId).toggleClass('collapsed');
}
var createCourseVsStageTable = function () {
//    $("#courseVsStageTableDashlet").find('.dropdown-toggle').dropdown('close');
    var dashletUrl = $("#courseVsStageTableDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#courseVsStageTable_collegeId").val($("#collegeId").val());
    $("#courseVsStageTable_download").val(0);
    var filters = $("#courseVsStageTableFilterForm").serializeArray();
    $.ajax({
        url: dashletUrl,
        type: 'post',
        data: filters,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('#courseVsStageTableDashletHTML .panel-loader').show();
        },
        complete: function () {
            $('#courseVsStageTableDashletFilters .btn-group').removeClass('open');
            $('#courseVsStageTableDashletHTML .panel-loader').hide();
            $('#courseVsStageTableDashletHTML .panel-heading, #courseVsStageTableDashletHTML .panel-body').removeClass('pvBlur');
            table_fix_rowcol();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    updateCourseVsStageTable(responseObject.data);
                }else {
                    var table = '<table class="table table-hover mb-0 fixedLeft1Head"><thead  class="solidgrey"> \n\
                                    <tr><th class="text-center">'+ responseObject.message +'</th></tr></thead><tbody></tbody> \n\
                                </table>';
                    $("#courseVsStageContainerDiv").html(table);
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

function updateCourseVsStageTable(dashletData) {

    if (typeof dashletData !== "object") {
        return;
    }
    var tableRows = '';
    var colspanClass = 1;
    var courseId = 0;
    var parentClass ='';
    if(typeof dashletData.courseId != 'undefined'){
        courseId = dashletData.courseId;
        parentClass = "ccd parent_"+courseId;
    }
    if(courseId == 0){
        tableRows += '<tr class="'+parentClass+'"><td class="text-left fw-500 wsNormal"><div class="lcnDataArrow">Total</div></td>';
        tableRows += '<td class="text-left colGroup1">' + dashletData.grandTotal + '</td>';
        if (typeof dashletData.stageWiseData === "object" ) {
            $.each(dashletData.stageWiseData, function (stgeId, stges) {
                var colspanClassCount = (colspanClass % 2 == 0)? 1:2;
                if (typeof stges === "object") {
                    tableRows += '<td class="colGroup'+colspanClassCount+' column_'+colspanClassCount+'">' + stges.total + '</td>'; 
                    if (typeof stges.subStages === "object") {
                        $.each(stges.subStages, function (subStgeId, subStgeValue) {
                            tableRows += '<td class="colGroup'+colspanClassCount+' collapseSubStage_'+stgeId+' hide">' + subStgeValue.total + '</td>';
                        });
                    }
                }
                colspanClass++;
            });
        }
        tableRows += '</tr>';
    }

    $.each(dashletData.leads, function (key, leads) {
        var collapse = '';
        colspanClass = 1;
        if(key != 0 && courseId == 0 && leads.specilizationExist == true){
            var collapse = '<a class="arwAbsRight appendChild hideSpecialisation" role="button" data-toggle="collapse"\n\
                                href="javascript:void(0)" aria-expanded="false" \n\
                                id="'+key+'" onclick="javascript:getSpecialization('+key+')"><i class="fa fa-chevron-circle-down font16" aria-hidden="true"></i></a>'; 
        }
        tableRows += '<tr id=course_'+key+' class="'+parentClass+'"><td class="text-left fw-500 wsNormal"><div class="lcnDataArrow">' + leads.courseName + collapse + '</div></td>';
        tableRows += '<td class="text-left colGroup1">' + leads.total + '</td>';
        if (typeof leads.stages === "object" ) {
            $.each(leads.stages, function (stageId, stages) {
                var colspanClassCount = (colspanClass % 2 == 0)? 1:2;
                if (typeof stages === "object") {
                    tableRows += '<td class="colGroup'+colspanClassCount+' column_'+colspanClassCount+'">' + stages.total + '</td>'; 
                    if (typeof stages.subStages === "object") {
                        $.each(stages.subStages, function (subStageId, subStageValue) {
                            tableRows += '<td class="colGroup'+colspanClassCount+' collapseSubStage_'+stageId+' hide">' + subStageValue.total + '</td>';
                        });
                    }  
                }
                colspanClass++;
            });
        }
        tableRows += '</tr>';
    });
    
    if(courseId == 0){
        var headerRow = '<tr>';
        var headerLabels = '';
        colspanClass = 1;
        
        $.each(dashletData.stageData, function (key, stages) {
            var colspanClassCount = (colspanClass % 2 == 0)? 1:2;
            var rowspan = 'rowspan="2"' ;
            var collapseSubStages = '<a class="columnCollasp collapsed" href="javascript:void(0)" " \n\
                                id="collapseStage_'+key+'" onclick="javascript:collapseSubSatges('+key+')"><i class="fa fa-chevron-circle-right ml-1 font14" aria-hidden="true"></i></a>'; 
            if (typeof stages.subStages === "object") {
                var colSpan = 1;
                headerRow += '<th class="colGroup'+colspanClassCount+' hcs text-center fw-500" >Total '+collapseSubStages+'</th>';
                $.each(stages.subStages, function (subStageId, subStageValue) {
                    headerRow += '<th class="colGroup'+colspanClassCount+' text-center fw-500 collapseSubStage_'+key+' hide">' + subStageValue.subStageName + '</th>';
                    colSpan++;
                });
                rowspan = '';
            }
            headerLabels += '<th '+rowspan+' class="colGroup'+colspanClassCount+' text-center headerCollapseSubStage_'+key+'" colspan="1" data-colspan="' + colSpan + '">'+stages.stageName+'</th>';
            colspanClass++;
        });
        headerRow += '</tr>';
    }
   
    if(courseId == 0){
        var table = '<table class="table table-hover mb-0 fixedLeft1Head"> \n\
                        <thead class="solidgrey"> \n\
                            <tr> \n\
                                <th rowspan="2" class="text-left" style="width:20%;background-color:#fff">Course Name</th> \n\
                                <th rowspan="2" class="colGroup1 text-left">Total</th> \n\
                                '+ headerLabels +'\n\
                            </tr> \n\
				' + headerRow + ' \n\
                        </thead> \n\
                        <tbody> ' + tableRows + '</tbody> \n\
                    </table>';
       $("#courseVsStageContainerDiv").html("");
       $("#courseVsStageContainerDiv").html(table);
    } else {
        $('.ccd').remove();
        $('.arwAbsRight').addClass('hideSpecialisation');
        $('#'+courseId).removeClass('hideSpecialisation');
        $('.parent_'+courseId).remove();
        $(tableRows).insertAfter($('#course_'+courseId));
    }
    /*if($(window).width() > 967){
     var docHeight = $(document).height()- 180;
     $('.gridly').css('height', docHeight);
     }*/

}

function courseVsStageTable_downloadPDF() {
    $("#courseVsStageTableDashletFilters").hide();

    var data = document.getElementById("courseVsStageTableDashletHTML");
    html2canvas(data).then(canvas => {
        // Few necessary setting options  
        var imgWidth = 200;
        var imgHeight = canvas.height * imgWidth / canvas.width;

        const contentDataURL = canvas.toDataURL('image/png');
        var pdf = new jspdf(); // A4 size page of PDF  
        var position = 1;
        pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth, imgHeight);
        pdf.save('download.pdf'); // Generated PDF   
        $("#courseVsStageTableDashletFilters").show();
    });


}

function courseVsStageTable_downloadCSV() {
    $("#courseVsStageTable_courseId").val("");
    $("#courseVsStageTable_download").val(1);
    $("#courseVsStageTableFilterForm").submit();
}

function resetCourseVsStageTableForm() {
    $("#courseVsStageTableFilterForm").find('select.dashletFilter').each(function () 
    {
        $(this).val('');
        $(this)[0].sumo.reload();
    });
   // $('.chosen-select').trigger('chosen:updated');
}

