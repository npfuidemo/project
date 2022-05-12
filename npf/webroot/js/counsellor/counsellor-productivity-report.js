$(function () {
    $('#item_carousel').owlCarousel({
        loop: false,
        touchDrag: false,
        mouseDrag: false,
        margin:25,
        responsiveClass: true,
        autoHeight: true,
        autoplayTimeout: 7000,
        smartSpeed: 800,
        nav: true,
        autoWidth: true,
        dots: false,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            768: {
                items: 1
            },
            1024: {
                items: 3
            },
            1200: {
                items: 5
            }
        }
    });

    $(".owl-prev").html('<a class="" data-toggle="tooltip" data-placement="top" title="Previous&nbsp;View" data-container="body"> <i class="fa fa-chevron-left" aria-hidden="true"></i></a>');
    $(".owl-next").html('<a class="" data-toggle="tooltip" data-placement="top" title="Next&nbsp;View" data-container="body"><i class="fa fa-chevron-right" aria-hidden="true"></i></a>');
    $('[data-toggle="tooltip"]').tooltip();

    var start = moment().startOf('month');
    var end = moment();
    var dateRangeStr = 'this month';
    $(document).find('#date_range').val(dateRangeStr);

    $('#productivityDateRange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            'Today': [moment(), moment(), 'today'],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days'), 'yesterday'],
            'Last 7 Days': [moment().subtract(6, 'days'), moment(), 'last 7 days'],
            'Last 30 Days': [moment().subtract(29, 'days'), moment(), 'last 30 days'],
            'This Month': [moment().startOf('month'), moment().endOf('month'), 'this month'],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month'), 'last month'],
            'All Time': [moment().subtract(12, 'month').startOf('month'), moment(), 'all time']
        },
        locale: {
            format: 'DD/MM/YYYY'
        },
        opens: 'left'
    }, cb);
    
    filtersClickable();
    $(document).on('click','.maxCols',function()
    {
        let selectedColumnCount = $('.maxCols:checked').length;
        if(selectedColumnCount > 20 && $(this).is(":checked"))
        {
            alertPopup('Maximum 20 Columns can be selected at a time','notification');
            $(this).removeAttr("checked");
            return false;
        }
        else if(selectedColumnCount == 0 && !($(this).is(":checked"))){
            $(this).prop("checked",true);
            $(".mandatory-one-column").removeClass('hide');
            return false;
        }
        else{
            $(".mandatory-one-column").addClass('hide');
            if($(this).val()=="LeadStageChanged"){
                $(this).closest("li").siblings().removeClass('hide');
            }
            else if($(this).val()=="ApplicationStageChange"){
                $(this).closest("li").siblings().removeClass('hide');
            }
            var key = $(this).val();
            var value = $(this).data('label_name');
            // if a new column is checked
            if($(this).is(":checked")) {
                switch(key) 
                {
                    case 'OverallNotesAdded':
                    case 'ApplicationNotesAdded':
                    case 'NotesAdded':
                        if(!$('#NAcols').length){
                            $('.widgetDragableChild').append('<li class="groupBox" id = "NAcols"><h5>Notes Added</h5><ul class="list NAcols" id="non_dragable"></ul></li>');
                        }
                        $('.NAcols').append("<li id='drag_item_u_"+key+"' title=''><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>");
                        break;
                    case 'OverallFollow-upAdded':
                    case 'Follow-upAdded':
                    case 'ApplicationFollow-upAdded':
                        if(!$('#FAcols').length){
                            $('.widgetDragableChild').append('<li class="groupBox" id = "FAcols"><h5>Follow-up Added</h5><ul class="list FAcols" id="non_dragable"></ul></li>');
                        }
                        $('.FAcols').append("<li id='drag_item_u_"+key+"' title=''><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>");
                        break;
                    case 'OverallFollow-upCompleted':
                    case 'Follow-upCompleted':
                    case 'ApplicationFollow-upCompleted':
                        if(!$('#FCcols').length){
                            $('.widgetDragableChild').append('<li class="groupBox" id = "FCcols"><h5>Follow-up Completed</h5><ul class="list FCcols" id="non_dragable"></ul></li>');
                        }
                        $('.FCcols').append("<li id='drag_item_u_"+key+"' title=''><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover'  type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>");
                        break;
                    case 'OverallFollow-upOverdueCounts':
                    case 'Follow-upOverdueCounts':
                    case 'ApplicationFollow-upOverdueCounts':
                        if(!$('#FOcols').length){
                            $('.widgetDragableChild').append('<li class="groupBox" id = "FOcols"><h5>Follow-up Overdue</h5><ul class="list FOcols" id="non_dragable"></ul></li>');
                        }
                        $('.FOcols').append("<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>");
                        break;
                    case 'OverallActivities':
                    case 'TotalActivities':
                    case 'ApplicationTotalActivities':
                        if(!$('#TAcols').length){
                            $('.widgetDragableChild').append('<li class="groupBox" id = "TAcols"><h5>Overall Activities</h5><ul class="list TAcols" id="non_dragable"></ul></li>');
                        }
                        $('.TAcols').append("<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover'  data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>");
                        break;
                    case 'EmailSent':
                    case 'ApplicationEmailSent':
                        if(!$('#EScols').length){
                            $('.widgetDragableChild').append('<li class="groupBox" id = "EScols"><h5>Email Sent</h5><ul class="list EScols" id="non_dragable"></ul></li>');
                        }
                        $('.EScols').append("<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>");
                        break;
                    case 'SMSSent':
                    case 'ApplicationSMSSent':
                        if(!$('#SScols').length){
                            $('.widgetDragableChild').append('<li class="groupBox" id = "SScols"><h5>SMS Sent</h5><ul class="list SScols" id="non_dragable"></ul></li>');
                        }
                        $('.SScols').append("<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>");
                        break;
                    case 'WhatsApp':
                    case 'ApplicationWhatsApp':
                        if(!$('#WAcols').length){
                            $('.widgetDragableChild').append('<li class="groupBox" id = "WAcols"><h5>WhatsApp</h5><ul class="list WAcols" id="non_dragable"></ul></li>');
                        }
                        $('.WAcols').append("<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button  data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>");
                        break;
                    case 'OverallInboundSuccess':
                    case 'InboundSuccess':
                        if(!$('#IScols').length){
                            $('.widgetDragableChild').append('<li class="groupBox" id = "IScols"><h5>Inbound Success</h5><ul class="list IScols" id="non_dragable"></ul></li>');
                        }
                        $('.IScols').append("<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover'  type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>");
                        break;
                    case 'OverallInboundMissed':
                    case 'InboundMissed':
                        if(!$('#IMcols').length){
                            $('.widgetDragableChild').append('<li class="groupBox" id = "IMcols"><h5>Inbound Missed</h5><ul class="list IMcols" id="non_dragable"></ul></li>');
                        }
                        $('.IMcols').append("<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>");
                        break;
                    case 'OverallCampaignSuccess':
                    case 'CampaignSuccess':
                        if(!$('#CScols').length){
                            $('.widgetDragableChild').append('<li class="groupBox" id = "CScols"><h5>Campaign Success</h5><ul class="list CScols" id="non_dragable"></ul></li>');
                        }
                        $('.CScols').append("<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover'  type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>");
                        break;
                    case 'OverallCampaignMissed':
                    case 'CampaignMissed':
                        if(!$('#CMcols').length){
                            $('.widgetDragableChild').append('<li class="groupBox" id = "CMcols"><h5>Campaign Missed</h5><ul class="list CMcols" id="non_dragable"></ul></li>');
                        }
                        $('.CMcols').append("<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>");
                        break;
                    case 'OverallOutboundSuccess':
                    case 'OutboundSuccess':
                    case 'ApplicationOutboundSuccess':
                        if(!$('#OScols').length){
                            $('.widgetDragableChild').append('<li class="groupBox" id = "OScols"><h5>Outbound Success</h5><ul class="list OScols" id="non_dragable"></ul></li>');
                        }
                        $('.OScols').append("<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>");
                        break;
                    case 'OverallOutboundMissed':
                    case 'OutboundMissed':
                    case 'ApplicationOutboundMissed':
                        if(!$('#OMcols').length){
                            $('.widgetDragableChild').append('<li class="groupBox" id = "OMcols"><h5>Outbound Missed</h5><ul class="list OMcols" id="non_dragable"></ul></li>');
                        }
                        $('.OMcols').append("<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>");
                        break;
                    case 'OverallTotalSuccess':
                    case 'TotalSuccess':
                        if(!$('#TScols').length){
                            $('.widgetDragableChild').append('<li class="groupBox" id = "TScols"><h5>Total Success</h5><ul class="list TScols" id="non_dragable"></ul></li>');
                        }
                        $('.TScols').append("<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>");
                        break;
                    case 'OverallTotalMissed':
                    case 'TotalMissed':
                        if(!$('#TMcols').length){
                            $('.widgetDragableChild').append('<li class="groupBox" id = "TMcols"><h5>Total Missed</h5><ul class="list TMcols" id="non_dragable"></ul></li>');
                        }
                        $('.TMcols').append("<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover'  type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>");
                        break;
                    default:
                        let isnum = /^\d+$/.test(key);
                        if(isnum || key=='LeadStageChanged' || key=='ApplicationStageChange'){
                            if($(this).closest('li').is('.custom_li_filter_ApplicationStages')){
                                if(!$('#AScols').length){
                                    $('.widgetDragableChild').append('<li class="groupBox" id = "AScols"><h5>Application Stage Changed</h5><ul class="list AScols" id="non_dragable"></ul></li>');
                                }
                                $('.AScols').append("<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"' data-label_type='app_stage'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover'  type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>");
                            }
                            else if($(this).closest('li').is('.custom_li_filter_LeadStages')){
                                if(!$('#LScols').length){
                                    $('.widgetDragableChild').append('<li class="groupBox" id = "LScols"><h5>Lead Stage Changed</h5><ul class="list LScols" id="non_dragable"></ul></li>');
                                }
                                $('.LScols').append("<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"' data-label_type='lead_stage'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover'  type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>");
                            }
                        }
                        else{
                            $('.widgetDragableChild').append("<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover'   type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>");
                        }
                        break;    
                }
                $(".columns_dragble").scrollTop( $('body').height() );
            }
            else{
                var elem = $('.remove_draggable[data-field_value="'+key+'"]')
                removeSortSectionColumn(elem,key,false);
            }
            
        }

    });


    //for course/specialization
    /*var college_id = parseInt($("#collegeId").val());
    if(college_id){
        getDispositionflter(college_id);
    }   */ 

});
var globalChangeInFilter = 0;
var globalSelectedColumns = {}, globalselectedLeadStages = {}, globalselectedApplicationStages = {};
var globalSelectedHeadCounsellors = [], globalSelectedCounsellors = [];
var globalSelectedFormId = '',globalDateRange = '', globalSelectedZoneId = [];
var globalSelectedCourses = [], globalSelectedSpecializations = [], globalSelectedSources = [];
//  load counsellor
function loadProductivityReport(type = '')
{
    globalChangeInFilter = 0;
    hideColumnView();
    var Page = parseInt($("#pageJump").val());
    if(type == 'reset')
    {   
        Page = 1;
        $('#pageJump').val(Page);
        $('#listingContainerSection').html("");
        $('#listingContainerSectionMessage').html("");
    }   
    var collegeId = parseInt($("#collegeId").val());
    var selectedHeadCounsellors = [], selectedCounsellors = [], selectedZones = [], selectedCourses = [], selectedSpecializations = [], selectedSources = [];
    let selectedColumn = {};
    var selectedLeadStages = {};
    var selectedApplicationStages = {};

    let dateRange = $("#date_range").val();
    let isChildUsersExists = $("#isChildUsersExists").val();

    let selectedHeadCounsellorsCount = $('#parentCounsellors :selected').length;
    let selectedCounsellorsCount = $('#counsellorFields :selected').length;
    let selectedZonesCount = $('#zoneFields :selected').length;
    let selectedCourseCount = $('#CourseId :selected').length;
    let selectedSpecializationCount = $('#SpecializationId :selected').length;
    let selectedSourceCount = $('#sourceFields :selected').length;
    if (selectedHeadCounsellorsCount !== 0)
    {
        $('#parentCounsellors').children('option:selected').each(function ()
        {
            selectedHeadCounsellors.push($(this).val());
        });
    }

    if (selectedCounsellorsCount !== 0)
    {
        $('#counsellorFields').children('option:selected').each(function ()
        {
            selectedCounsellors.push($(this).val());
        });
    }else{
        $('#counsellorFields option').each(function ()
        {
            selectedCounsellors.push($(this).val());
        });
    }

    if (selectedZonesCount !== 0)
    {
        $('#zoneFields').children('option:selected').each(function ()
        {
            selectedZones.push($(this).val());
        });
    }

    if (selectedCourseCount !== 0)
    {
        $('#CourseId').children('option:selected').each(function ()
        {
            selectedCourses.push($(this).val());
        });
    }

    if (selectedSpecializationCount !== 0)
    {
        $('#SpecializationId').children('option:selected').each(function ()
        {
            selectedSpecializations.push($(this).val());
        });
    }

    if (selectedSourceCount !== 0)
    {
        $('#sourceFields').children('option:selected').each(function ()
        {
            selectedSources.push($(this).val());
        });
    }

    let selectedFormId = $('#formFields').val();

    let selectedColumnCount = $('.sortCols').length;
    if (selectedColumnCount !== 0)
    {   
        $(".sortCols").each(function (){
            let ref = $(this);
            selectedColumn[ref.val()] = ref.attr("data-label_name");
            if(ref.attr("data-label_type")=="app_stage" && ref.val()!='ApplicationStageChange'){
                selectedApplicationStages[ref.val()] = ref.attr("data-label_name");
            }
            else if(ref.attr("data-label_type")=="lead_stage" && ref.val()!='LeadStageChanged'){
                selectedLeadStages[ref.val()] = ref.attr("data-label_name");
            }
        });
    }
    let itemPerPage = $("#itemPerPage").val();
    dateRange = dateRange.toLowerCase();
    globalSelectedColumns = selectedColumn;
    globalSelectedHeadCounsellors = selectedHeadCounsellors;
    globalSelectedCounsellors = selectedCounsellors;
    globalDateRange = dateRange;
    globalSelectedFormId = selectedFormId;
    globalSelectedZones = selectedZones;
    globalSelectedCourses = selectedCourses;
    globalSelectedSpecializations = selectedSpecializations;
    globalSelectedSources = selectedSources;
    globalselectedLeadStages = selectedLeadStages;
    globalselectedApplicationStages = selectedApplicationStages;
    $.ajax({
        url: jsVars.ajaxCounsellorProductivityDataLink,
        type: 'post',
        dataType: 'html',
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        data: {'headCounsellors': selectedHeadCounsellors, 'counsellorIds': selectedCounsellors, "collegeId": collegeId,
            "formId": selectedFormId, "selectedColumns": selectedColumn, "selectedLeadStages": selectedLeadStages, "selectedApplicationStages":selectedApplicationStages, "dateRange" : dateRange, "isChildUsersExists" : isChildUsersExists,
            "itemPerPage" : itemPerPage, "page" : Page, "zones": selectedZones, "courses": selectedCourses, "specializations": selectedSpecializations, "sources": selectedSources},
        beforeSend: function () {
            showLoader();
            $('#viewLeadProdReports, .applyBtn, #columnApply').attr('disabled', 'disabled').html('Applying&nbsp;<i class="fa fa-spinner fa-spin"></i>');
            $("#producitivityreportListLoader").show();
            $("#addremovemodal").hide();
            $('.proptip').hide();
            $('.owl-carousel').trigger('refresh.owl.carousel');
        },
        complete: function () {
            hideLoader();
            $("#filter1").modal("hide");
            $('#viewLeadProdReports, .applyBtn, #columnApply').removeAttr('disabled').html('Apply');
            $("#producitivityreportListLoader").hide();
            $("#addremovemodal").hide();
            
        },
        success: function (response) {
            if(response == "session_logout")
            {
                window.location.reload(true);
            }else if(response.indexOf("error") != -1)
            {
                if($('#accordionyui').length)
                {
                    $('#accordionyui').html(response.split("___")[1]);
                }else{
                    $('#listingContainerSection').html(response.split("___")[1]);
                }
                $('.layoutPagination').hide();
            }else{
                $('.layoutPagination').show();
                $('#listingContainerSection').html(response);
                if(maxPage != 'undefined'){
                    $('#maxPage').html(maxPage);
                    if(parseInt($("#pageJump").val()) > maxPage){
                        $('#pageJump').val('1');
                    }
                }
                if(Page == 1 && maxPage != 'undefined') {
                    $('#maxPage').html(maxPage);
                    if(maxPage == 1) {
                        $('.prev, .next').removeClass('disabled').addClass('disabled');
                    } else {
                        $('.prev').removeClass('disabled').addClass('disabled');
                        $('.next').removeClass('disabled');
                    }
                } else if(maxPage != 'undefined' && Page == maxPage) {
                    $('.prev').removeClass('disabled');
                    $('.next').removeClass('disabled').addClass('disabled');
                } else {
                    $('.prev, .next').removeClass('disabled');
                }
//                LoadMoreFocusCheck();
            }
            $('.chosen-select').chosen();
            $('.chosen-select').trigger('chosen:updated');
            table_fix_rowcol();
            $('.offCanvasModal').modal('hide');
            $('[data-toggle="popover"]').popover();
            $('[data-toggle="tooltip"]').tooltip();
            $('.sumo-select').SumoSelect();
            $('.proptip').show();
            $('.owl-carousel').trigger('refresh.owl.carousel');

            $( ".columnCollasp.collapsed" ).each(function() {
                var el = document.querySelector('.table-responsive');
                var xScrollBeforeWidth = el.scrollWidth;
                var offsetLeft = $(this).offset().left;
                $(this).on("click", function(){
                    var xScrollAfterWidth = el.scrollWidth;
                    var tableLeftScrollPos = $('.table-responsive').scrollLeft();
                    var diffScrollPos = xScrollAfterWidth - xScrollBeforeWidth;
                    var scrollAmount = tableLeftScrollPos + diffScrollPos;
                    if(offsetLeft > 450){
                        $('.table-responsive').animate({scrollLeft: scrollAmount});
                    }
                });
            });

            /*$(".columnCollasp").click(function(event) {
                var x = event.offsetX+150
                $( ".newTableStyle ").animate({scrollLeft:x}, 800); 
               //console.log(x);   
            });*/
        },
        

        error: function (xhr, ajaxOptions, thrownError) {
            hideLoader();
            $("#producitivityreportListLoader").show();
            $('#viewLeadProdReports, .applyBtn, #columnApply').removeAttr('disabled').html('Apply');
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

//  load head counsellor
function loadHeadCounsellorProductivityReport(headCounsellor, targetRow, jsClickExpandElementReference, loadMoreElementReference = '')
{
    if(headCounsellor === '' || typeof headCounsellor === 'undefined' || 
            (loadMoreElementReference !== '' && loadMoreElementReference.data('requestrunning')))
    {
        return false;
    }
    globalChangeInFilter = 0;
    var Page = 1;
    var collegeId = parseInt($("#collegeId").val());
    var appendLoadMoreButton = true;
    let isChildUsersExists = $("#isChildUsersExists").val();
    
    let selectedColumn = globalSelectedColumns;
    let selectedLeadStages = globalselectedLeadStages;
    let selectedApplicationStages = globalselectedApplicationStages;
    let selectedCounsellors = globalSelectedCounsellors;
    let dateRange = globalDateRange;
    let selectedFormId = globalSelectedFormId;
    
    if(loadMoreElementReference !== '')
    {
        Page = loadMoreElementReference.data('page');
        loadMoreElementReference.data('requestrunning', true);
        appendLoadMoreButton = false;
    }
    $.ajax({
        url: jsVars.ajaxHeadCounsellorProductivityDataLink,
        type: 'post',
        dataType: 'html',
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        data: {"page" : Page, 'headCounsellor': headCounsellor, 'counsellorIds': selectedCounsellors, "collegeId": collegeId, 
            "formId": selectedFormId, "selectedColumns": selectedColumn, "selectedLeadStages": selectedLeadStages, "selectedApplicationStages":selectedApplicationStages, "dateRange" : dateRange, "isChildUsersExists" : isChildUsersExists,
        "targetRow" : targetRow, "appendLoadMoreButton" : appendLoadMoreButton},
        beforeSend: function () {
            showLoader();
            $("#producitivityreportListLoader").show();
        },
        complete: function () {
            hideLoader();
//            if(loadMoreElementReference !== '')
//            {
//                loadMoreElementReference.data('page', (Page + 1));
//                loadMoreElementReference.data('requestrunning', false);
//                loadMoreElementReference.html("Load More Records");
//            }
            $("#producitivityreportListLoader").hide();
        },
        success: function (response) {
            if(response == "session_logout")
            {
                window.location.reload(true);
            }else{
//                $(targetRow + " table tbody").append(response);
                $("#row_" + targetRow).after(response);
                table_fix_rowcol();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            hideLoader();
            $("#producitivityreportListLoader").show();
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

// Column filters search
function filterColumns(element, listid) 
{
    var value = $(element).val();
    value = value.toLowerCase();
    $("ul#" + listid + "  li ul li").each(function () {
        if ($(this).text().toLowerCase().search(value) > -1) {
            $(this).show();
            $("ul#" + listid + "  li").addClass('active');
            $("ul#" + listid + "  li a").show();
        } else {
            $(this).hide();
            $("ul#" + listid + "  li a").hide();
        }
    });
}

// Column filters toggle
function filtersClickable()
{
    $(document).find('.filterCollasp').unbind('click');
    $(document).find('.filterCollasp').bind('click', function (e) {
        if ($(this).parent().hasClass('active')) {
            $('.filterCollasp').parent().removeClass('active');
        } else {
            $('.filterCollasp').parent().removeClass('active');
            $(this).parent().addClass('active');
        }
        e.preventDefault();
    });
}

function counsellorList(){   
    return new Promise(function(resolve, reject){
       globalChangeInFilter = 1;
        var parentCounsellors = $("#parentCounsellors").val();
        $.ajax({
            url: jsVars.getCounsellorListByHeadCounsellorLink,
            type: 'post',
            dataType: 'json',
            data: {'parentCounsellors':parentCounsellors},
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            success: function (json) {
                if (typeof json['status'] != 'undefined' && json['status'] == 1) {
                    $('#counsellorFields').html('');
                    $('#counsellorFields').SumoSelect({placeholder: 'Search Counsellor', search: true, searchText:'Search Counsellor', triggerChangeCombined: false });
                    $('#counsellorFields')[0].sumo.reload();

                    $.each(json['data']['counsellorList'], function (k, v)
                    {
                        $('#counsellorFields')[0].sumo.add(v.key, v.value);
                    });
                }
                resolve()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                reject()
            }
        }) 
    });
}

// Fetch counsellors on parent change
$(document).on('change', '#parentCounsellors', function(){
    globalChangeInFilter = 1;
    var parentCounsellors = $("#parentCounsellors").val(); 
});

$(document).on('change', '#counsellorFields', function(){
    globalChangeInFilter = 1;
});

// Fetch columns on form change
$(document).on('change', '#formFields', function(){
    globalChangeInFilter = 1;
    var formId = $("#formFields").val(); 
    if(formId == '')
    {
        $('.maxCols').each(function(){
            columnValue = $(this).val();
            isnum = /^\d+$/.test(columnValue);
            if(isnum && $(this).closest('li').hasClass('custom_li_filter_ApplicationStages')){
                $(this).attr('checked',false);
                $(this).closest('li').remove();
            }
        });
        AppStageCols = $('.AScols').children().show();
        $(AppStageCols).each(function(){
            var columnKey = $(this).attr('id').split("_").pop();
            isnum = /^\d+$/.test(columnKey);
            if(isnum){
                $(this).remove();
            }
        });
        return false;
    }
    var collegeId = $("#collegeId").val(); 
    $.ajax({
        url: jsVars.getColumnsOnFormChangeLink,
        type: 'post',
        dataType: 'json',
        data: {'formId':formId, collegeId : collegeId},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            if(json =='session_logout') {
                window.location.reload(true);
            }else if(json['error'] !== '')
            {
                alertPopup(json['error'], "error");
            }else
            {
                var html = '';
                var ii = 0;
                var counter = 0;
                var activeClass = 'class="active"';
                var checked_columns = [];
                $('#column_li_list input:checked').each(function() {
                    checked_columns.push($(this).attr('value'));
                });
                $("#column_li_list").html("");
                $.each(json['response'], function(key, value) 
                {
                    html += '<li class="active"><a href="javascript:void(0)" id="filter_create_keys_' + key + '_' + ii + '">' + value.label +' </a><ul class="' + key + ' filterCollaspData filterCollaspDataTemp">';
                    $.each(value.child, function(k, val) {
                        $.each(checked_columns, function(chk_key,chk_value){
                            if(chk_value == k)
                            {
                                html += '<li class="custom_li_filter_' + key + '"><label for="column_create_keys_' + k + '_' + ii + '"><input id="column_create_keys_' + k + '_' + ii + '" type="checkbox" class="column_create_keys maxCols" name="columnFields[]" value="' + k + '" data-label_name="' + val + '" checked>' + val + '</label></li>';
                                counter = 1;
                            }
                        });   
                        if(counter == 0)
                        {   
                            if($.isNumeric(k) && key == 'LeadStages' && ($.inArray('LeadStageChanged',checked_columns)==-1)){
                                html += '<li class="custom_li_filter_' + key + ' hide" ><label for="column_create_keys_' + k + '_' + ii + '"><input id="column_create_keys_' + k + '_' + ii + '" type="checkbox" class="column_create_keys maxCols" name="columnFields[]" value="' + k + '" data-label_name="' + val + '">' + val + '</label></li>';
                            }
                            else if($.isNumeric(k) && key == 'ApplicationStages' && ($.inArray('ApplicationStageChange',checked_columns)==-1)){
                                html += '<li class="custom_li_filter_' + key + ' hide" ><label for="column_create_keys_' + k + '_' + ii + '"><input id="column_create_keys_' + k + '_' + ii + '" type="checkbox" class="column_create_keys maxCols" name="columnFields[]" value="' + k + '" data-label_name="' + val + '">' + val + '</label></li>';
                            }
                            else 
                                html += '<li class="custom_li_filter_' + key + '"><label for="column_create_keys_' + k + '_' + ii + '"><input id="column_create_keys_' + k + '_' + ii + '" type="checkbox" class="column_create_keys maxCols" name="columnFields[]" value="' + k + '" data-label_name="' + val + '">' + val + '</label></li>';
                        } 
                        else{
                            counter = 0;
                        }
                    });
                    html += '</ul></li>';
                    activeClass = "";
                    ii++;
                });
                $("#column_li_list").html(html);
                filtersClickable();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
});

function markFavouriteView(elementReference, check = true)
{
    let viewCountFlag = checkFavouriteViewsCount();
    if(viewCountFlag || !check)
    {
        let viewId = $(elementReference).attr("data-view-id");
        let favourite = $(elementReference).attr("data-favourite");
        var collegeId = parseInt($("#collegeId").val());
        $.ajax({
            url: jsVars.ajaxMarkViewFavouriteLink,
            type: 'post',
            dataType: 'json',
            data: {'viewId': viewId, 'favourite' : (favourite == 1) ? 0 : 1, 'collegeId' : collegeId},
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            success: function (json) {
                if(json['error'] =='session_logout') {
                    window.location.reload(true);
                }else if (typeof json['status'] != 'undefined' && json['status'] == 1) {
                    alertPopup(json['message']);
                    updateFilterSection();
                }
                $('[data-toggle="tooltip"]').tooltip();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }else{
        alertPopup("Maximum 10 views can be marked as favourite", "notification");
        return false;
    }
}

function renderSmartView(elementReference, viewId)
{
    // render view on page load
    if(!$(elementReference).hasClass("customview"))
    {
        $("#updateProductivityReportFilter").hide();
    }else{
        $("#updateProductivityReportFilter").show();
    }
    $("#saveFilterButton").hide();   
    $('span.currentactive').removeClass('currentactive');
    if($(elementReference).parent().find("input[type='checkbox']").length ){
        var viewId = $(elementReference).parent().find("input").attr("data-view-id");
        if(!$(elementReference).parent().find("input[type='checkbox']").is(":checked")){
            var viewName = $(elementReference).parent().find("span").text();
            // $("span.extraView").addClass("smartView");
            $("span.extraView").text(viewName);
            $("span.extraView").addClass("currentactive " + $(elementReference).attr('class'));
            $('.extraView').removeClass('hide');
            $('.extraView').attr('id', viewId);
            $('.extraView').attr('data-view-id', viewId);
            $('.extraView').attr('onclick', 'renderSmartView(this, "'+viewId+'")');
        }
        else{
            $("span#"+viewId).addClass("currentactive");
        }
    }
    else{   
//        $(elementReference).addClass("currentactive");
          $("span#"+viewId).addClass("currentactive");
    }
    $("#quickview").modal("hide");
    var collegeId = parseInt($("#collegeId").val());
    $.ajax({
        url: jsVars.ajaxLoadSmartViewLink,
        type: 'post',
        dataType: 'json',
        data: {'viewId': viewId, 'collegeId': collegeId},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            if (json['error'] == 'session_logout') {
                window.location.reload(true);
            } else if (json['error'] != '') {
                alertPopup(json['error'], 'error');
                return false;
            } else {
                var processData = json['response'];
                var html = '';
                $(".column_create_keys").each(function ()
                {
                    let columValue = $(this).val();
                    if (processData['columnFields'] != 'undefined' && ($.inArray(columValue, processData['columnFields']) !== -1))
                    {
                        $(this).prop("checked", true);
                        if(columValue=='LeadStageChanged' || columValue=="ApplicationStageChange"){
                            $(this).closest('li').siblings().removeClass('hide');
                        }
                        
                    } 
                    else if(processData['stagesCols'] != 'undefined' && ($.inArray(parseInt(columValue), processData['stagesCols']) !== -1)){
                        $(this).prop("checked", true);
                    }
                    else {
                        if(columValue=='LeadStageChanged' || columValue=="ApplicationStageChange"){
                            $(this).closest('li').siblings().addClass('hide');
                        }
                        $(this).prop("checked", false);
                    }
                });
                if(processData['stagesCols'] != 'undefined' && ('stagesCols' in processData)){
                    processData['columnFields'] = $.merge(processData['columnFields'],processData['stagesCols']);
                }

                //to populate the selected columns in sorting section
                var selcols= NAcols = FAcols = FCcols = FOcols = TAcols = '';
                var EScols = SScols = WAcols = IScols = IMcols = OScols = OMcols = CScols = CMcols = '';
                var TMcols = TScols = AScols = LScols = '';
                $('.widgetDragableChild').html('');
                if(processData['columnFields'] != 'undefined'){
                    $(processData['columnFields']).each(function(colKey,colValue){
                        $(".maxCols").each(function(){
                            key = $(this).val();
                            value = $(this).data('label_name');
                            if($(this).is(":checked") && key == colValue){    
                                switch(colValue)
                                {
                                    case 'OverallNotesAdded':
                                    case 'ApplicationNotesAdded':
                                    case 'NotesAdded':
                                        if(!$('#NAcols').length){
                                            $('.widgetDragableChild').append('<li id = "NAcols"><h5>Notes Added</h5><ul class="list NAcols" id="non_dragable"></ul></li>');
                                        }
                                        NAcols += "<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button  data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>";
                                        break;
                                    case 'OverallFollow-upAdded':
                                    case 'Follow-upAdded':
                                    case 'ApplicationFollow-upAdded':
                                        if(!$('#FAcols').length){
                                            $('.widgetDragableChild').append('<li id = "FAcols"><h5>Follow-up Added</h5><ul class="list FAcols" id="non_dragable"></ul></li>');
                                        }
                                        FAcols += "<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button  data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>";
                                        break;
                                    case 'OverallFollow-upCompleted':
                                    case 'Follow-upCompleted':
                                    case 'ApplicationFollow-upCompleted':
                                        if(!$('#FCcols').length){
                                            $('.widgetDragableChild').append('<li id = "FCcols"><h5>Follow-up Completed</h5><ul class="list FCcols" id="non_dragable"></ul></li>');
                                        }
                                        FCcols += "<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button  data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>";
                                        break;
                                    case 'OverallFollow-upOverdueCounts':
                                    case 'Follow-upOverdueCounts':
                                    case 'ApplicationFollow-upOverdueCounts':
                                        if(!$('#FOcols').length){
                                            $('.widgetDragableChild').append('<li id = "FOcols"><h5>Follow-up Overdue</h5><ul class="list FOcols" id="non_dragable"></ul></li>');
                                        }
                                        FOcols += "<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>";
                                        break;
                                    case 'OverallActivities':
                                    case 'TotalActivities':
                                    case 'ApplicationTotalActivities':
                                        if(!$('#TAcols').length){
                                            $('.widgetDragableChild').append('<li id = "TAcols"><h5>Overall Activities</h5><ul class="list TAcols" id="non_dragable"></ul></li>');
                                        }
                                        TAcols += "<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>";
                                        break;
                                    case 'EmailSent':
                                    case 'ApplicationEmailSent':
                                        if(!$('#EScols').length){
                                            $('.widgetDragableChild').append('<li id = "EScols"><h5>Email Sent</h5><ul class="list EScols" id="non_dragable"></ul></li>');
                                        }
                                        EScols += "<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>";
                                        break;
                                    case 'SMSSent':
                                    case 'ApplicationSMSSent':
                                        if(!$('#SScols').length){
                                            $('.widgetDragableChild').append('<li id = "SScols"><h5>SMS Sent</h5><ul class="list SScols" id="non_dragable"></ul></li>');
                                        }
                                        SScols += "<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>";
                                        break;
                                    case 'WhatsApp':
                                    case 'ApplicationWhatsApp':
                                        if(!$('#WAcols').length){
                                            $('.widgetDragableChild').append('<li id = "WAcols"><h5>WhatsApp</h5><ul class="list WAcols" id="non_dragable"></ul></li>');
                                        }
                                        WAcols += "<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>";
                                        break;
                                    case 'OverallInboundSuccess':
                                    case 'InboundSuccess':
                                        if(!$('#IScols').length){
                                            $('.widgetDragableChild').append('<li id = "IScols"><h5>Inbound Success</h5><ul class="list IScols" id="non_dragable"></ul></li>');
                                        }
                                        IScols += "<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>";
                                        break;
                                    case 'OverallCampaignSuccess':
                                    case 'CampaignSuccess':
                                        if(!$('#CScols').length){
                                            $('.widgetDragableChild').append('<li id = "CScols"><h5>Campaign Success</h5><ul class="list CScols" id="non_dragable"></ul></li>');
                                        }
                                        CScols += "<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>";
                                        break;
                                    case 'OverallInboundMissed':
                                    case 'InboundMissed':
                                        if(!$('#IMcols').length){
                                            $('.widgetDragableChild').append('<li id = "IMcols"><h5>Inbound Missed</h5><ul class="list IMcols" id="non_dragable"></ul></li>');
                                        }
                                        IMcols += "<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button  data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>";
                                        break;
                                    case 'OverallCampaignMissed':
                                    case 'CampaignMissed':
                                        if(!$('#CMcols').length){
                                            $('.widgetDragableChild').append('<li id = "CMcols"><h5>Campaign Missed</h5><ul class="list CMcols" id="non_dragable"></ul></li>');
                                        }
                                        CMcols += "<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button  data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>";
                                        break;
                                    case 'OverallOutboundSuccess':
                                    case 'OutboundSuccess':
                                    case 'ApplicationOutboundSuccess':
                                        if(!$('#OScols').length){
                                            $('.widgetDragableChild').append('<li id = "OScols"><h5>Outbound Success</h5><ul class="list OScols" id="non_dragable"></ul></li>');
                                        }
                                        OScols += "<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button  data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>";
                                        break;
                                    case 'OverallOutboundMissed':
                                    case 'OutboundMissed':
                                    case 'ApplicationOutboundMissed':
                                        if(!$('#OMcols').length){
                                            $('.widgetDragableChild').append('<li id = "OMcols"><h5>Outbound Missed</h5><ul class="list OMcols" id="non_dragable"></ul></li>');
                                        }
                                        OMcols += "<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button  data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>";
                                        break;
                                    case 'OverallTotalSuccess':
                                    case 'TotalSuccess':
                                        if(!$('#TScols').length){
                                            $('.widgetDragableChild').append('<li id = "TScols"><h5>Total Success</h5><ul class="list TScols" id="non_dragable"></ul></li>');
                                        }
                                        TScols += "<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button   data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>";
                                        break;
                                    case 'OverallTotalMissed':
                                    case 'TotalMissed':
                                        if(!$('#TMcols').length){
                                            $('.widgetDragableChild').append('<li id = "TMcols"><h5>Total Missed</h5><ul class="list TMcols" id="non_dragable"></ul></li>');
                                        }
                                        TMcols += "<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button   data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>";
                                        break;
                                    default:
                                        let isnum = /^\d+$/.test(colValue);
                                        if(isnum || key=='LeadStageChanged' || key=='ApplicationStageChange'){
                                            if($(this).closest('li').is('.custom_li_filter_ApplicationStages')){
                                                if(!$('#AScols').length){
                                                    $('.widgetDragableChild').append('<li class="groupBox" id = "AScols"><h5>Application Stage Changed</h5><ul class="list AScols" id="non_dragable"></ul></li>');
                                                }
                                                $('.AScols').append("<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"' data-label_type='app_stage'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover'  type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>");
                                            }
                                            else if($(this).closest('li').is('.custom_li_filter_LeadStages')){
                                                if(!$('#LScols').length){
                                                    $('.widgetDragableChild').append('<li class="groupBox" id = "LScols"><h5>Lead Stage Changed</h5><ul class="list LScols" id="non_dragable"></ul></li>');
                                                }
                                                $('.LScols').append("<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"' data-label_type='lead_stage'>"+value+"<button data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover'  type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>");
                                            }
                                        }else{
                                            $('.widgetDragableChild').append("<li id='drag_item_u_"+key+"' title='' ><input type='hidden' name='column_sorting_order[]' class='sortCols' value="+key+" data-label_name='"+value+"'>"+value+"<button  data-toggle='tooltip' title='Click here to remove' data-placement='left' data-trigger='hover' type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-field_value="+key+" onclick=removeSortSectionColumn(this,'"+key+"')>×</button></li>");
                                        }
                                        break;
                                }
                            }    
                    
                        });
                    });
                    /*if(selcols!=''){
                        $(".selcols").html(selcols);
                    }*/
                    if(NAcols != ''){
                        $('.NAcols').html(NAcols);
                    }
                    if(FAcols != ''){
                        $('.FAcols').html(FAcols);
                    }
                    if(FCcols != ''){
                        $('.FCcols').html(FCcols);
                    }
                    if(FOcols != ''){
                        $('.FOcols').html(FOcols);
                    }
                    if(TAcols != ''){
                        $('.TAcols').html(TAcols);
                    }
                    if(EScols != ''){
                        $('.EScols').html(EScols);
                    } 
                    if(SScols != ''){
                        $('.SScols').html(SScols);
                    }
                    if(WAcols != ''){
                        $('.WAcols').html(WAcols);
                    }
                    if(IScols != ''){
                        $('.IScols').html(IScols);
                    }
                    if(IMcols != ''){
                        $('.IMcols').html(IMcols);
                    }
                    if(OScols != ''){
                        $('.OScols').html(OScols);
                    } 
                    if(OMcols != ''){
                        $('.OMcols').html(OMcols);
                    }
                    if(TScols != ''){
                        $('.TScols').html(TScols);
                    }
                    if(TMcols != ''){
                        $('.TMcols').html(TMcols);
                    } 
                    if(CScols != ''){
                        $('.CScols').html(CScols);
                    } 
                    if(CMcols != ''){
                        $('.CMcols').html(CMcols);
                    } 
                if($('#parentCounsellors').length){    
                    $('#parentCounsellors').val('');
                    $("#parentCounsellors")[0].sumo.reload();
                }
                if(processData['headCounsellorFields'] != ''){
                    $.each(processData['headCounsellorFields'], function (index, value) {
                        $('#parentCounsellors')[0].sumo.selectItem(value.toString());
                        $("#parentCounsellors")[0].sumo.reload();
                    });
                }
                counsellorList().then(function(){
                    if($('#counsellorFields').length){
                        $('#counsellorFields').val('');
                        $("#counsellorFields")[0].sumo.reload();
                    }
                    if(processData['counsellorFields'] != '')
                    {
                        $.each(processData['counsellorFields'], function (index, value) {
                            $('#counsellorFields')[0].sumo.selectItem(value.toString());
                            $("#counsellorFields")[0].sumo.reload();
                        });
                    }
                }).then(function(){
                    if($('#formFields').length){
                        $('#formFields').val('');
                        $("#formFields")[0].sumo.reload();
                    }

                    if(processData['form_id'] != '')
                    {
                        if($('#formFields').length){
                            $('#formFields')[0].sumo.selectItem(processData['form_id'].toString());
                            $("#formFields")[0].sumo.reload();
                        }
                    }

                
                    reinitializeDateRangePicker(processData['date_range']);
                
                }).catch((error) => {
                    console.log(error)
                })
                    
                }
            }

            $('[data-toggle="tooltip"]').tooltip();
            
        },error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

// Save filters
function saveProductivityReportFilter()
{
    var collegeId = parseInt($("#collegeId").val());
    let filterName = $('#filter_name').val();
    let markAsByDefault = ($('#mark_as_by_default').is(":checked")) ? 1 : 0;
    
    let selectedColumn = globalSelectedColumns;
    let selectedHeadCounsellors = [];
    $('#parentCounsellors').children('option:selected').each(function (){
        selectedHeadCounsellors.push($(this).val());
    });
    let selectedCounsellors = [];
    $('#counsellorFields').children('option:selected').each(function (){
        selectedCounsellors.push($(this).val());
    });
//    let selectedHeadCounsellors = globalSelectedHeadCounsellors;
//    let selectedCounsellors = globalSelectedCounsellors;
    let dateRange = globalDateRange;
    let selectedFormId = globalSelectedFormId;
    /*if(jQuery.isEmptyObject(selectedColumn)){
        alertPopup("At least one column required in Quick view", "error");
    }*/

    $.ajax({
        url: jsVars.saveProductivityReportFilterLink,
        type: 'post',
        dataType: 'json',
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        data: {'headCounsellors': selectedHeadCounsellors, 'counsellorIds': selectedCounsellors, "collegeId": collegeId,
            "formId": selectedFormId, "selectedColumns": selectedColumn, "dateRange": dateRange, "favourite" : markAsByDefault, 
            "filterName" : filterName},
        beforeSend: function () {
            showLoader();
            $('#saveFilter').attr('disabled',true);
        },
        complete: function () {
            hideLoader();
            $('#saveFilter').attr('disabled',false);
        },
        success: function (json) {
            if(json['error'] =='session_logout') {
                window.location.reload(true);
            }else if(typeof json['error'] != 'undefined' && json.error != '') {
                $('#filterColumnDiv').html(json['error']).addClass('error margin-bottom-8');
                return false;
            }
            $('#filterViewModal').modal('hide');
            $('#saveFilterModal').modal('hide');
            $('#saveFilterButton').hide(); 
            if(markAsByDefault == 1){
                window.location.reload();
            }
            updateFilterSection();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            hideLoader();
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

// Save filters pop up
$('#saveProductivityReportFilter').click(function () {
    $('#filterColumnDiv').html('');
    $('.askMarkFavourite').show();
    $('input[name="mark_as_by_default"]').prop('checked', false);
    $('#filterColumnSaveBtn').removeAttr('onclick').html('Save');
    $('#filterViewModal').modal('show');
    $('#filterColumnSaveBtn').attr('onclick', 'saveProductivityReportFilter()');
    $('#filter_name').val('');
});

// Update filters pop up
$('#updateProductivityReportFilter').click(function () {
    
    $('#filterColumnDiv').html('');
    $('.askMarkFavourite').hide();
    $('input[name="mark_as_by_default"]').prop('checked', true);
    $('#filterColumnSaveBtn').removeAttr('onclick').html('Update');
    $('#filterViewModal').modal('show');
    $('#filterColumnSaveBtn').attr('onclick', 'updateProductivityReportFilter()');
    let filterName = $(".currentactive").html();
    $('#filter_name').val(filterName);
});

function updateProductivityReportFilter()
{
    var collegeId = parseInt($("#collegeId").val());
    let filterName = $('#filter_name').val();
    let markAsByDefault = ($('#mark_as_by_default').is(":checked")) ? 1 : 0;
    let viewId = $(".currentactive").attr("data-view-id");

    let selectedColumn = globalSelectedColumns;
    let selectedHeadCounsellors = globalSelectedHeadCounsellors;
    let selectedCounsellors = globalSelectedCounsellors;
    let dateRange = globalDateRange;
    let selectedFormId = globalSelectedFormId;

    $.ajax({
        url: jsVars.updateProductivityReportFilterLink,
        type: 'post',
        dataType: 'json',
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        data: {'headCounsellors': selectedHeadCounsellors, 'counsellorIds': selectedCounsellors, "collegeId": collegeId,
            "formId": selectedFormId, "selectedColumns": selectedColumn, "dateRange": dateRange, "favourite" : markAsByDefault, 
            "filterName" : filterName, "viewId" : viewId},
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            hideLoader();
        },
        success: function (json) {
            if(json['error'] =='session_logout') {
                window.location.reload(true);
            }else if(typeof json['error'] != 'undefined' && json.error != '') {
                $('#filterColumnDiv').html(json['error']).addClass('error margin-bottom-8');
                return false;
            }
            $('#filterViewModal').modal('hide');
            $('#saveFilterModal').modal('hide');
            $('#saveFilterButton').hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            hideLoader();
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$(document).on('click', '.next', function(event) {
    if($('#pageJump').val().match(/^\d+$/) == null) {
        alertPopup('Invalid Page Number', 'error');
        return false;
    } else if(parseInt($('#pageJump').val()) < 1) {
        alertPopup('Invalid Page Number', 'error');
        return false;
    } else if(parseInt($('#pageJump').val()) >= parseInt($('#maxPage').html())) {
        event.preventDefault();
        return false;
    }
    var updatePageValue = parseInt($('#pageJump').val()) + 1;
    if(updatePageValue >= $('#maxPage').html()) {
        $(this).addClass('disabled');
        $('.prev').removeClass('disabled');
    }
    $('#pageJump').val(updatePageValue);
    loadProductivityReport();
});

$(document).on('click', '.prev', function(event) {
    if($('#pageJump').val().match(/^\d+$/) == null) {
        alertPopup('Invalid Page Number', 'error');
        return false;
    } else if(parseInt($('#pageJump').val()) > parseInt($('#maxPage').html())) {
        alertPopup('Invalid Page Number', 'error');
        return false;
    } else if(parseInt($('#pageJump').val()) < 2) {
        event.preventDefault();
        return false;
    }
    var updatePageValue = parseInt($('#pageJump').val()) - 1;
    if(updatePageValue < 2) {
        $(this).addClass('disabled');
        $('.next').removeClass('disabled');
    }
    $('#pageJump').val(updatePageValue);
    loadProductivityReport();
});

$('#pageJump').bind('keypress', function(e) {
    if ((e.which >= 48 && e.which <= 57) ||
        e.which === 8 || //Backspace key
        e.which === 13   //Enter key
        ) {
    } else {
      e.preventDefault();
    }
});

$('#pageJump').on("paste",function(e) {
    e.preventDefault();
});

$(document).on('change', '#pageJump', function() {
    if($('#pageJump').val() == '' || $('#pageJump').val().match(/^\d+$/) == null) {
        alertPopup('Invalid Page Number', 'error');
        return false;
    } else if(parseInt($('#pageJump').val()) < 1 || parseInt($('#pageJump').val()) > parseInt($('#maxPage').html())) {
        alertPopup('Invalid Page Number', 'error');
        return false;
    }
    loadProductivityReport();
});

$(document).on('change', '#rows', function() {
    $('#pageJump').val('1');
    loadProductivityReport();
});


// Fetch records of head counsellor
$(document).on("click", ".fetchHeadCounsellorProductivityReport", function(){
    $('.fetchHeadCounsellorProductivityReport').not($(this)).addClass("collapsed");
    $('.fetchHeadCounsellorProductivityReport').not($(this)).attr("aria-expanded",'false');
    $('.fetchHeadCounsellorProductivityReport').not($(this)).closest('tr').siblings('tr.childCounsellor').remove();
    if($(this).hasClass('collapsed')){
        // $(this).removeClass("fetchHeadCounsellorProductivityReport collapsed");
        $(this).removeClass("collapsed");
        $(this).attr("aria-expanded", 'true');
        var jsClickExpandElementReference = $(this).attr('id');
    //    let targetRow = $(this).attr("href");
        let targetRow = $(this).data("rand");
        let headCounsellor = $(this).data("counsellor");
        loadHeadCounsellorProductivityReport(headCounsellor, targetRow, jsClickExpandElementReference);
    }
    else{
        $(this).addClass("collapsed");
        $(this).attr("aria-expanded", 'false');
        $(this).closest('tr').siblings('tr.childCounsellor').remove();
    }
   
    $(this).attr("onclick", 'closeAccordions(this)');
    
    
//    // close all open accordions
    closeAccordions(this);
    
});

// Load more focus check
//function LoadMoreFocusCheck(){
//    $(".scrollableContainer").on("scroll", function()
//    {
//        let containerRef = $(this);
//        let loadMoreref = $(this).find(".loadMoreChild");
//       	var result = checkInView(containerRef, loadMoreref,false);
//        if(result)
//        {
//            loadMoreref.html("Please wait while we are fetching records for you...");
//            let headCounsellor = $(loadMoreref).data('headcounsellor');
//            let targetRow = $(loadMoreref).data('targetrow');
//            loadHeadCounsellorProductivityReport(headCounsellor, targetRow, loadMoreref);
//        }
//    });
//}

//function  checkInView(containerRef, elem,partial)
//{
////    var container = $(".scrollableContainer");
//    var container = containerRef;
//    var contHeight = container.height();
//    var contTop = container.scrollTop();
//    var contBottom = contTop + contHeight ;
//
//    var elemTop = $(elem).offset().top - container.offset().top;
//    var elemBottom = elemTop + $(elem).height();
//
//    var isTotal = (elemTop >= 0 && elemBottom <=contHeight);
//    var isPart = ((elemTop < 0 && elemBottom > 0 ) || (elemTop > 0 && elemTop <= container.height())) && partial ;
//
//    return  isTotal  || isPart ;
//}

// trigger click on active smart view
if($(".currentactive").length)
{
    if(!$(this).hasClass("customview"))
    {
        $("#updateProductivityReportFilter").hide();
    }else{
        $("#updateProductivityReportFilter").show();
    }
    $(".currentactive").trigger("click");
}

// Mark view favourite on save
$('input[name="mark_as_by_default"]').click(function()
{
    let flag = checkFavouriteViewsCount();
    
    if(!flag)
    {
        $(".favouriteError").text("Maximum 10 views can be marked as favourite");
        $(this).prop("checked", false);
        $(".favouriteError").show();
    }else{
        $(".favouriteError").text("");
        $(".favouriteError").hide();
    }
});

function checkFavouriteViewsCount()
{
    let totalFavourite = $('ul.gridly li.active').length;
    return (totalFavourite > 9) ? false : true;
}

function updateFilterSection()
{
    var collegeId = parseInt($("#collegeId").val());
    $.ajax({
        url: jsVars.ajaxRenderSmartViewsLink,
        type: 'post',
        dataType: 'html',
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        data: {"collegeId" : collegeId},
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            hideLoader();
        },
        success: function (response) {
            if(response == "session_logout")
            {
                window.location.reload(true);
            }else{
                $("#quickview").html(response);
                /*dragFav();*/
            }
            $('[data-toggle="tooltip"]').tooltip();
            var activeViewId = $('.currentactive').data('viewId');
            renderSmartView(this, activeViewId);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            hideLoader();
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function updateFilterOrder()
{
    var collegeId = parseInt($("#collegeId").val());
    var requestData = [];
    let viewId = '';
    let i = 1;
    $("ul.gridly li.active").each(function()
    {
        //position = $(this).data('position');
        position = $(this).index();
        viewId = $(this).data('view');
        requestData.push({view: viewId, order : position});
        i++;
    });
    $.ajax({
        url: jsVars.ajaxSaveSmartViewsOrderLink,
        type: 'post',
        dataType: 'json',
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        data: {"collegeId" : collegeId, "sort" : requestData},
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            $("#quickview").modal("hide");
        },
        success: function (json) {
            if(json['error'] =='session_logout') {
                window.location.reload(true);
            }else if (typeof json['status'] != 'undefined' && json['status'] == 1) {
                window.setTimeout(function(){
                hideLoader();
                location.reload()})
            }
            hideLoader();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            hideLoader();
            $("#quickview").modal("hide");
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


$('#confirmProductivityDownloadYes').on('click', function () 
{
    $('#confirmProductivityDownload').modal('hide');
    
    var collegeId = parseInt($("#collegeId").val());
    let selectedColumn = globalSelectedColumns;
    let selectedHeadCounsellors = globalSelectedHeadCounsellors;
    let selectedCounsellors = globalSelectedCounsellors;
    let dateRange = globalDateRange;
    let selectedFormId = globalSelectedFormId;

    $.ajax({
        url: jsVars.downloadCounsellorProductivityReportLink,
        type: 'post',
        dataType: 'json',
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        data: {"collegeId": collegeId, 'headCounsellors': selectedHeadCounsellors, 'counsellorIds': selectedCounsellors,
            "selectedFormId": selectedFormId, "selectedColumns": selectedColumn, "dateRange" : dateRange},
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            hideLoader();
        },
        success: function (json) {
            if(json['error'] =='session_logout') {
                window.location.reload(true);
            }else if (typeof json['error'] != 'undefined' && json['error'] != '') {
                alertPopup(json['error'], "error");
            }else{
                $('#muliUtilityPopup').modal('show');
                $('#requestMessage').html('productivity report');
                $('#downloadListing').hide();
                $('#downloadListingExcel').show();
                $('#downloadListingExcel').attr('href', json['url']);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            hideLoader();
//            $('#viewLeadProdReports').attr('disabled', 'disabled').html('Applying&nbsp;<i class="fa fa-spinner fa-spin"></i>');
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
});

function reinitializeDateRangePicker(dynamicDate)
{
    if(dynamicDate === '')
    {
        dynamicDate = "this month";
    }

    let dynamicStart = '';
    let dynamicEnd = moment();
    let dynamicRangeStr = dynamicDate;

    switch(dynamicDate){
        case "today":
            dynamicStart = moment();
            break;
        case "yesterday":
            dynamicStart = moment().subtract(1, 'days');
            dynamicEnd = moment().subtract(1, 'days');
            break;
        case "last 7 days":
            dynamicStart = moment().subtract(6, 'days');
            break;
        case "last 30 days":
            dynamicStart = moment().subtract(29, 'days');
            break;
        case "this month":
            dynamicStart = moment().startOf('month');
            dynamicEnd = moment().endOf('month')
            break;
        case "last month":
            dynamicStart = moment().subtract(1, 'month').startOf('month');
            dynamicEnd = moment().subtract(1, 'month').endOf('month');
            break;
        case "all time":
            dynamicStart = moment().subtract(12, 'month').startOf('month');
            break;
        default:
            let dateBreak = dynamicRangeStr.split(",");
            dynamicStart = moment(dateBreak[0],"DD/MM/YYYY");
            dynamicEnd = moment(dateBreak[1],"DD/MM/YYYY");
            break;
    }
    $('#productivityDateRange').daterangepicker({
        startDate: dynamicStart ,
        endDate: dynamicEnd,
        ranges: {
            'Today': [moment(), moment(), 'today'],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days'), 'yesterday'],
            'Last 7 Days': [moment().subtract(6, 'days'), moment(), 'last 7 days'],
            'Last 30 Days': [moment().subtract(29, 'days'), moment(), 'last 30 days'],
            'This Month': [moment().startOf('month'), moment().endOf('month'), 'this month'],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month'), 'last month'],
            'All Time': [moment().subtract(12, 'month').startOf('month'), moment(), 'all time']
        },
        opens: 'left'
        }, function (dynamicStart, dynamicEnd, dynamicRangeStr = '') {
            // to show save view button on date change
            $('#saveFilterButton').show();
            cb(dynamicStart, dynamicEnd, dynamicRangeStr);
        }
    );
    cb(dynamicStart, dynamicEnd, dynamicRangeStr);
    $(".range_inputs").find(".cancelBtn").click(function () {
            /*$('#productivityDateRange span').html("This Month");
            $(document).find('#date_range').val("this month");
            $('#date_range').val("this month");
            $(".ranges ul li").removeClass('active');*/
            $(".ranges ul li[data-range-key='This Month']").click();
            $(".ranges ul li[data-range-key='This Month']").addClass('active');
        //     setTimeout(function () {
        //     loadProductivityReport();
        // }, 1000);
    });
}

function cb(start, end, dateRangeStr = '') 
{
    let spanHtml = "";
    let range = "";
    switch(dateRangeStr.toLowerCase()){
        case "custom range":
            spanHtml = start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY');
            range = start.format('DD/MM/YYYY') + ',' + end.format('DD/MM/YYYY');
            break;
            
        case "all time":
        case "today":
        case "yesterday":
        case "last 7 days":
        case "last 30 days":
        case "this month":
        case "last month":
            spanHtml = dateRangeStr.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase( ); });
            range = dateRangeStr;
            break;
        default:
            spanHtml = start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY');
            range = start.format('DD/MM/YYYY') + ',' + end.format('DD/MM/YYYY');
                break;
    }
    $('#productivityDateRange span').html(spanHtml);
    $(document).find('#date_range').val(range);
    loadProductivityReport();
}

// close all open accordions
function closeAccordions(elementRef)
{
    let clickedElementId = $(elementRef).attr("id");
    let accordianExpandedFlag = '';
    let accordionId = '';
    $(".accodianMenu").each(function () 
    {
        if(!$(this).hasClass("fetchHeadCounsellorProductivityReport"))
        {
            accordianExpandedFlag = $(this).attr("aria-expanded");
            accordionId = $(this).attr("id");
            if(accordionId == clickedElementId)
            {
                return;
            } 
            if(accordianExpandedFlag = 'true')
            {
                hideAccordion(accordionId);
            }
            else{
                showAccordion(accordionId);
            }
        }
    });
}

function hideAccordion (id)
{
    let targetRow = $("#"+id).attr("href");
    $("#"+id).addClass('collapsed');
    $("#"+id).attr('aria-expanded',"false");
    $(targetRow).removeClass('in');
    $(targetRow).attr('aria-expanded',"false");
}

function showAccordion (id)
{
    let targetRow = $("#"+id).attr("href");
    $("#"+id).removeClass('collapsed');
    $("#"+id).attr('aria-expanded',"true");
    $(targetRow).addClass('in');
    $(targetRow).attr('aria-expanded',"true");
}

function hideColumnView()
{
    $('#addremovecolumn').removeClass('in');
}

function alertPopup(msg, type, location) {

    if (type == 'error') {
        var selector_parent = '#ErrorPopupArea';
        var selector_titleID = '#ErroralertTitle';
        var selector_msg = '#ErrorMsgBody';
        var btn = '#ErrorOkBtn';
        var title_msg = 'Error';
    }else if (type == 'notification') {
        var selector_parent = '#ErrorPopupArea';
        var selector_titleID = '#ErroralertTitle';
        var selector_msg = '#ErrorMsgBody';
        var btn = '#ErrorOkBtn';
        var title_msg = 'Notification';
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

//for course and specialiation filters
/*function getDispositionflter(cid){
    $.ajax({
        url: '/CampaignManager/getDispositionFilters',
        type: 'post',
        data: {'collegeId':cid},
        dataType: 'json',
        async : false,
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        success: function (responseObject) {
            //var responseObject = $.parseJSON(json);
            var showCourse = showSpecialization = false;
            if ((typeof responseObject.specialization_id.list == 'object' && Object.keys(responseObject.specialization_id.list).length > 0) ||
                    (typeof responseObject.onChangeCourse != 'undefined' && responseObject.onChangeCourse != '')) {
                showSpecialization = true;
            }
            if (typeof responseObject.course_id == 'object') {
                $('#CourseId').SumoSelect({okCancelInMulti: false, floatWidth: 300, forceCustomRendering: true, search: true, searchText: 'Search '+responseObject.course_id.name, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false, placeholder:'Select '+responseObject.course_id.name});
                if (typeof responseObject.course_id.list == 'object' && Object.keys(responseObject.course_id.list).length > 0) {
                    var courseOptions = '<option value="0">Not Available</option>';
                    $.each(responseObject.course_id.list, function (index, item) {
                        courseOptions += '<option value="' + index + '">' + item + '</option>';
                    });
                    $('#CourseId').html(courseOptions);
                    $('#CourseId')[0].sumo.reload();
                    if($('#graph_course_id_container').hasClass('display-none'))   $('#graph_course_id_container').removeClass('display-none');
                } else {
                    if(showCourse == true) {
                        if($('#graph_course_id_container').hasClass('display-none')) $('#graph_course_id_container').removeClass('display-none');
                    } else {
                        if(!$('#graph_course_id_container').hasClass('display-none')) $('#graph_course_id_container').addClass('display-none');
                    }
                }
                if (typeof responseObject.onChangeCourse != 'undefined' && responseObject.onChangeCourse != '') {
                    $('select#CourseId').on('change', function () {
                        GetChildByMachineKey('CourseId', 'SpecializationId');
                    });
                }
            }
            if (typeof responseObject.specialization_id == 'object') {
                $('#SpecializationId').SumoSelect({okCancelInMulti: false, floatWidth: 300, forceCustomRendering: true, search: true, searchText: 'Search '+responseObject.specialization_id.name, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false, placeholder:'Select '+responseObject.specialization_id.name});
                if (typeof responseObject.specialization_id.list == 'object' && Object.keys(responseObject.specialization_id.list).length > 0) {
                    var specializationOptions = '<option value="0">Not Available</option>';
                    $.each(responseObject.specialization_id.list, function (index, item) {
                        specializationOptions += '<option value="' + index + '">' + item + '</option>';
                    });
                    $('#SpecializationId').html(specializationOptions);
                    $('#SpecializationId')[0].sumo.reload();
                    if($('#graph_specialization_id_container').hasClass('display-none'))   $('#graph_specialization_id_container').removeClass('display-none');
                } else {
                    if(showSpecialization == true) {
                        if($('#graph_specialization_id_container').hasClass('display-none'))   $('#graph_specialization_id_container').removeClass('display-none');
                    } else {
                        if(!$('#graph_specialization_id_container').hasClass('display-none'))   $('#graph_specialization_id_container').addClass('display-none');
                    }
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function GetChildByMachineKey(key,ContainerId){
    if(typeof ContainerId !== "undefined" && $("#"+ContainerId).length){
        if(key == 'CourseId'){
            if($('#SpecializationId').length > 0) {
                $('#SpecializationId').empty();
                $("#SpecializationId.sumo-select")[0].sumo.reload();
            }
        }

        if(typeof key !== "undefined" && key !== '') {
            var keyName = '';
            if(key == 'CourseId') {
                keyName = 'ud|course_id';
            }

            var postData = {'collegeId':$('#collegeId').val(), 'find_value_type' : 'next', 'current_field' : keyName};
            postData[keyName] = $('#'+key).val();
            $.ajax({
                url: '/users/get-check-dependent-field',
                type: 'post',
                dataType: 'json',
                data: postData,
                headers: {
                    "X-CSRF-Token": jsVars.csrfToken
                },
                success: function (json) {
                    if(json['redirect']) {
                        location = json['redirect'];
                    }
                    if(json['error']){
                        alertPopup(json['error'],'error');
                    }
                    else if(json['success']){
                        var html = '<option value="0">Not Available</option>';
                        if(json['option']){
                            for(var key in json['option']) {
                                html += '<option value="'+key+';;;'+json['option'][key]+'">'+json['option'][key]+'</option>';
                            }
                        }
                        $("#"+ContainerId).html(html);
                        $("#"+ContainerId)[0].sumo.reload();
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        }
    }
}*/

//to remove columns from sorting section
$(document).on('click','.remove_draggable',function(){
    if($('.view_class:checked').length == 1 && !($(this).is(":checked")))
    {   $(".mandatory-one-view").removeClass('hide');
        return false;
    }else{
        $(".mandatory-one-view").addClass('hide');
    }
    /*not sure 
    var cur_col = $(this).data('field_value');
    $(this).closest('li').remove();
    $(".maxCols").each(function (){
        if($(this).val() == cur_col){
            $(this).closest('input').prop('checked', false);
            return false;
        }
    });*/
});

//for save and update filters

$(document).on('click','#viewLeadProdReports', function(){
    if(globalChangeInFilter == 1){
        $('#saveFilterButton').show();
    }
    loadProductivityReport('reset');
});

$(document).on('click','#columnApply',function(){
    let selectedColumnCount = $('.sortCols').length;
    if (selectedColumnCount !== 0)
    {
        $('#saveFilterButton').show();
        loadProductivityReport('reset');
    }
    else{
        alertPopup("At least one column required in Quick view", "error");
    }
});
$('#saveFilterButton').on('click',function(){
    $('#filterColumnDiv').html('');
    $('#updateexisting').prop('checked',false);
    $('#filter_name').val('');
    if($(".currentactive").length){
        var viewId = $('.currentactive').attr('data-view-id');
        if($('#'+viewId).hasClass('customview')){
            $('#updateexisting').removeClass('hide'); 
            $('label[for="updateexisting"]').show();
            $('#savenew').removeClass('hide'); 
            $('label[for="savenew"]').show();  
        }
        else{
            $('#updateexisting').addClass('hide');
            $('#savenew').addClass('hide');
            $('label[for="updateexisting"]').hide(); 
            $('label[for="savenew"]').hide(); 
            saveUpdateFunction('save');     
        }
    }
    $('#saveFilterModal').modal('show');
    $('[data-toggle="tooltip"]').tooltip(); 
});

function saveUpdateFunction(action){
    if(action == 'save'){
        $('#filter_name').val('');
        $('#filter_name'). prop('disabled',false);
        $('input[name="mark_as_by_default"]').prop('checked', false);
        $('#saveFilter').attr('onclick', 'saveProductivityReportFilter()');
    }
    else if(action == 'update'){
        let viewId = $(".currentactive").attr('data-view-id') 
        let filterName = $(".currentactive").html();
        $('#filter_name').val(filterName);
        $('#filter_name'). attr('disabled','disabled');
        if($('input[type="checkbox"][data-view-id="'+viewId+'"]').is(':checked')){
            $('input[name="mark_as_by_default"]').prop('checked', true);
        }else{
            $('input[name="mark_as_by_default"]').prop('checked', false);
        }
        $('#saveFilter').attr('onclick', 'updateProductivityReportFilter()');
    }
}

// function removeSortSectionColumn(key){
function removeSortSectionColumn(elem,key,condition_check = true){
    var cur_col = $(elem).data('field_value');
    if($('.maxCols:checked').length == 1 && condition_check) //&& !($(this).is(":checked"))
    {
        $(".mandatory-one-column").removeClass('hide');
        return false;
    }else if(condition_check){
        $(".mandatory-one-column").addClass('hide');
    }
    switch(key) {
        case 'OverallNotesAdded':
        case 'NotesAdded':                            
        case 'ApplicationNotesAdded':
            $("[id='drag_item_u_"+key+"']").remove();
            if($('.NAcols').children('li').length==0){
                $("[id='NAcols']").remove();

            }
            break;
        case 'OverallFollow-upAdded':
        case 'Follow-upAdded':
        case 'ApplicationFollow-upAdded':
            $("[id='drag_item_u_"+key+"']").remove();
            if($('.FAcols').children('li').length==0){
                $("[id='FAcols']").remove();

            }
            break;
        case 'OverallFollow-upCompleted':
        case 'Follow-upCompleted':
        case 'ApplicationFollow-upCompleted':
            $("[id='drag_item_u_"+key+"']").remove();
            if($('.FCcols').children('li').length==0){
                $("[id='FCcols']").remove();

            }
            break;
        case 'OverallFollow-upOverdueCounts':
        case 'Follow-upOverdueCounts':
        case 'ApplicationFollow-upOverdueCounts':
            $("[id='drag_item_u_"+key+"']").remove();
            if($('.FOcols').children('li').length==0){
                $("[id='FOcols']").remove();

            }
            break;
        case 'OverallActivities':
        case 'TotalActivities':
        case 'ApplicationTotalActivities':
            $("[id='drag_item_u_"+key+"']").remove();
            if($('.TAcols').children('li').length==0){
                $("[id='TAcols']").remove();

            }
            break;
        case 'EmailSent':
        case 'ApplicationEmailSent':
            $("[id='drag_item_u_"+key+"']").remove();
            if($('.EScols').children('li').length==0){
                $("[id='EScols']").remove();

            }
            break;
        case 'SMSSent':
        case 'ApplicationSMSSent':
            $("[id='drag_item_u_"+key+"']").remove();
            if($('.SScols').children('li').length==0){
                $("[id='SScols']").remove();

            }
            break;
        case 'WhatsApp':
        case 'ApplicationWhatsApp':
            $("[id='drag_item_u_"+key+"']").remove();
            if($('.WAcols').children('li').length==0){
                $("[id='WAcols']").remove();

            }
            break;
        case 'OverallInboundSuccess':
        case 'InboundSuccess':
            $("[id='drag_item_u_"+key+"']").remove();
            if($('.IScols').children('li').length==0){
                $("[id='IScols']").remove();

            }
            break;
        case 'OverallInboundMissed':
        case 'InboundMissed':
            $("[id='drag_item_u_"+key+"']").remove();
            if($('.IMcols').children('li').length==0){
                $("[id='IMcols']").remove();

            }
            break;
        case 'OverallCampaignSuccess':
        case 'CampaignSuccess':
            $("[id='drag_item_u_"+key+"']").remove();
            if($('.CScols').children('li').length==0){
                $("[id='CScols']").remove();

            }
            break;
        case 'OverallCampaignMissed':
        case 'CampaignMissed':
            $("[id='drag_item_u_"+key+"']").remove();
            if($('.CMcols').children('li').length==0){
                $("[id='CMcols']").remove();

            }
            break;
        case 'OverallOutboundSuccess':
        case 'OutboundSuccess':
        case 'ApplicationOutboundSuccess':
            $("[id='drag_item_u_"+key+"']").remove();
            if($('.OScols').children('li').length==0){
                $("[id='OScols']").remove();

            }
            break;
        case 'OverallOutboundMissed':
        case 'OutboundMissed':
        case 'ApplicationOutboundMissed':
            $("[id='drag_item_u_"+key+"']").remove();
            if($('.OMcols').children('li').length==0){
                $("[id='OMcols']").remove();

            }
            break;
        case 'OverallTotalSuccess':
        case 'TotalSuccess':
            $("[id='drag_item_u_"+key+"']").remove();
            if($('.TScols').children('li').length==0){
                $("[id='TScols']").remove();

            }
            break;
        case 'OverallTotalMissed':
        case 'TotalMissed':
            $("[id='drag_item_u_"+key+"']").remove();
            if($('.TMcols').children('li').length==0){
                $("[id='TMcols']").remove();

            }
            break;
        default:
            let isnum = /^\d+$/.test(key);
            if(isnum){
                /*if($("li[id='drag_item_u_"+key+"']").parent().is('.AScols')){
                    console.log($('.AScols').children('li').length);
                    if($('.AScols').children('li').length==1){
                        $("[id='AScols']").remove();
                    }
                }*/
                
                $("[id='drag_item_u_"+key+"']").remove();
                if($('.LScols').children('li').length==0){
                    $("[id='LScols']").remove();

                }
                if($('.AScols').children('li').length==0){
                    $("[id='AScols']").remove();
                }

            }
            else{
                $("[id='drag_item_u_"+key+"']").remove();
            }
            break;
        }
        $(this).closest('li').remove();
        $(".maxCols").each(function (){
            if($(this).val() == cur_col){
                if($(this).val()== 'LeadStageChanged'){
                    $('.LeadStages').find('input:checkbox').prop('checked',false);                       
                    $(this).closest('li').siblings().addClass('hide');
                    $("#LScols").remove();
                }
                else if($(this).val()== 'ApplicationStageChange'){
                    $('.ApplicationStages').find('input:checkbox').prop('checked',false);
                    $(this).closest('li').siblings().addClass('hide');
                    $("#AScols").remove();
                }
                $(this).closest('input').prop('checked', false);
                return false;
            }
        });

    }


//remove application stages on form deselection
// $(document).on('change','select[name="form_id"]',function(){
//     formId = $(this).val();
//     if(formId == ''){
//         $('.maxCols').each(function(){
//             columnValue = $(this).val();
//             isnum = /^\d+$/.test(columnValue);
//             if(isnum && $(this).closest('li').hasClass('custom_li_filter_ApplicationStages')){
//                 $(this).attr('checked',false);
//                 $(this).closest('li').remove();
//             }
//         });
//         AppStageCols = $('.AScols').children().show();
//         $(AppStageCols).each(function(){
//             var columnKey = $(this).attr('id').split("_").pop();
//             isnum = /^\d+$/.test(columnKey);
//             if(isnum){
//                 $(this).remove();
//             }
//         });
//     }
// });

var globalMarkFavourite = {};

function addViewToSortSection(elementReference,viewName){
    let viewCountFlag = checkFavouriteViewsCount();
    let viewId = $(elementReference).attr("data-view-id");
    let favView = $(elementReference).attr("data-favourite");
    let fav_view_count = $('.view_class:checked').length; 
    if(fav_view_count == 0 && !$(elementReference).is(":checked")){
        $(elementReference).prop('checked',true);
        $(".mandatory-one-view").removeClass('hide');
        return false;
    }else{
        $(".mandatory-one-view").addClass('hide');
    }
    if($(elementReference).is(":checked")){
        let viewCountFlag = checkFavouriteViewsCount();
        if(viewCountFlag){
            globalMarkFavourite[viewId] = '1';
            $("#dragItemBox").append("<li class='active' data-view='"+viewId+"' data-order= style='margin-bottom: 8px;>"+viewName+"<span class='pull-right' data-toggle='tooltip' data-placement='left' title='' data-original-title='Click here to remove'><button type='button' data-clickable='true' class='remove_draggable' aria-label='remove_draggable' data-view-id='"+viewId+"' data-favourite='1' onclick='removeFavouriteView(this)'>×</button></span></li>");
        }
        else{
            $(elementReference).attr('checked',false);
            alertPopup("Maximum 10 views can be marked as favourite", "notification");
            return false;
        }
    }
    else{        
        globalMarkFavourite[viewId] = '0';
        $("li[data-view='"+$(elementReference).attr('data-view-id')+"']").remove();
    }
}

function removeFavouriteView(elementReference){
    if($('.view_class:checked').length == 1){
        $(".mandatory-one-view").removeClass('hide');
        return false;
    }else{
        $(".mandatory-one-view").addClass('hide');
    }
    let viewId = $(elementReference).attr("data-view-id");
    let favourite = $(elementReference).attr("data-favourite");
    globalMarkFavourite[viewId] = '0';
    $("li[data-view='"+viewId+"']").remove();
    $("ul li input[data-view-id='"+viewId+"']").attr('checked', false);
}

// $(document).on('click','#markView',function(){
function markView(){
    let viewList = JSON.stringify(globalMarkFavourite);
    var collegeId = parseInt($("#collegeId").val());
    $.ajax({
        url: jsVars.ajaxMarkViewFavouriteLink,
        type: 'post',
        dataType: 'json',
        data: {'collegeId' : collegeId, 'viewList' : viewList},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            if(json['error'] =='session_logout') {
                window.location.reload(true);
            }else if (typeof json['status'] != 'undefined' && json['status'] == 1) {
                updateFilterOrder();
            }
            $('[data-toggle="tooltip"]').tooltip();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function showLoader() {
    $("#producitivityreportListLoader").show();
}
function hideLoader() {
    $("#producitivityreportListLoader").hide();
}


$('#dragItem_mainBox').sortable().on('sortable:stop',function(e, ui){
})

$('#dragItemBox1').sortable().on('sortable:stop',function(e, ui){
//  createFieldsOrder();
})

$('#dragItemBox').sortable().on('sortable:stop',function(e, ui){
//  createFieldsOrder();
})



