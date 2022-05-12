function LoadDateTimeRangepicker(opens, drops) {
    //define calender open position
    if(typeof opens == 'undefined') {
        opens = 'left';
    }
    //define calender drop position
    if(typeof drops == 'undefined') {
        drops = 'down';
    }
        $('.date_time_rangepicker_report').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        timePicker: true,
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY hh:mm A',
            separator: ', ',
        },
        ranges: {
                'Today': [moment().startOf('day'), moment().endOf('day')],
                'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
        opens: opens,
        drops: drops,
    }, function (start, end, label) {
        //console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
    });

    $('.date_time_rangepicker_report').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY hh:mm A') + ',' + picker.endDate.format('DD/MM/YYYY hh:mm A'));
    });

    $('.date_time_rangepicker_report').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
    
    // position data
    
    $('.date_time_rangepicker_report_left_up').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        timePicker: true,
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY hh:mm A',
            separator: ', ',
        },
        ranges: {
                'Today': [moment().startOf('day'), moment().endOf('day')],
                'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
        opens: 'left',
        drops: 'up',
    }, function (start, end, label) {
        //console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
    });
    
    $('.date_time_rangepicker_report_left_up').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY hh:mm A') + ',' + picker.endDate.format('DD/MM/YYYY hh:mm A'));
    });

    $('.date_time_rangepicker_report_left_up').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });


    // position right

    $('.date_time_rangepicker_report_right').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        timePicker: true,
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY hh:mm A',
            separator: ', ',
        },
        ranges: {
                'Today': [moment().startOf('day'), moment().endOf('day')],
                'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
        opens: 'right'
    }, function (start, end, label) {
        //console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
    });

    $('.date_time_rangepicker_report_right').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY hh:mm A') + ',' + picker.endDate.format('DD/MM/YYYY hh:mm A'));
    });

    $('.date_time_rangepicker_report_right').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
    
    // daterange picker center
    $('.date_time_rangepicker_report_center').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        timePicker: true,
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY hh:mm A',
            separator: ', ',
        },
        ranges: {
                'Today': [moment().startOf('day'), moment().endOf('day')],
                'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
        opens: 'center'
    }, function (start, end, label) {
        //console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
    });

    $('.date_time_rangepicker_report_center').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY hh:mm A') + ',' + picker.endDate.format('DD/MM/YYYY hh:mm A'));
    });

    $('.date_time_rangepicker_report_center').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });

}


function LoadFollowUpDynamicDateTimeRangepicker(opens, drops) {
    //define calender open position
    if(typeof opens == 'undefined') {
        opens = 'left';
    }
    //define calender drop position
    if(typeof drops == 'undefined') {
        drops = 'down';
    }
    
    $('.date_time_rangepicker_dynamic_followup').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        timePicker: true,
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY hh:mm A',
            separator: ', '
        },
        ranges: {
                'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                'Today': [moment().startOf('day'), moment().endOf('day')],
                'Tomorrow': [moment().add(1, 'days').startOf('day'), moment().add(1, 'days').endOf('day')],
                'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                'Next 7 Days': [moment().startOf('day'), moment().add(6, 'days').endOf('day')],
//                'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
                'Last Week': [moment().subtract(1, 'weeks').startOf('isoWeek'), moment().subtract(1, 'weeks').endOf('isoWeek')],
                'This Week': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
                'Next Week': [moment().add(1, 'weeks').startOf('isoWeek'), moment().add(1, 'weeks').endOf('isoWeek')]
                
            },
        opens: opens,
        drops: drops,
    }, dynamicDateCallBack);
    
//    function (start, end, label) {
//        $(".date_time_rangepicker_dynamic").val(label);
//    }

    $('.date_time_rangepicker_dynamic_followup, .date_time_rangepicker_dynamic_followup_left_up, .date_time_rangepicker_dynamic_followup_right, .date_time_rangepicker_dynamic_followup_center').on('apply.daterangepicker', function (ev, picker) {
        if(picker.chosenLabel == "Today")
            $(this).val(picker.chosenLabel);
    });

    $('.date_time_rangepicker_dynamic_followup, .date_time_rangepicker_dynamic_followup_left_up, .date_time_rangepicker_dynamic_followup_right, .date_time_rangepicker_dynamic_followup_center').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
    
    // position data
    
    $('.date_time_rangepicker_dynamic_followup_left_up').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        timePicker: true,
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY hh:mm A',
            separator: ', ',
        },
        ranges: {
                'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                'Today': [moment().startOf('day'), moment().endOf('day')],
                'Tomorrow': [moment().add(1, 'days').startOf('day'), moment().add(1, 'days').endOf('day')],
                'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                'Next 7 Days': [moment().startOf('day'), moment().add(6, 'days').endOf('day')],
//                'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
                'Last Week': [moment().subtract(1, 'weeks').startOf('isoWeek'), moment().subtract(1, 'weeks').endOf('isoWeek')],
                'This Week': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
                'Next Week': [moment().add(1, 'weeks').startOf('isoWeek'), moment().add(1, 'weeks').endOf('isoWeek')]
            },
        opens: 'left',
        drops: 'up'
    }, dynamicDateCallBackLeftUp);


    // position right

    $('.date_time_rangepicker_dynamic_followup_right').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        timePicker: true,
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY hh:mm A',
            separator: ', ',
        },
        ranges: {
                'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                'Today': [moment().startOf('day'), moment().endOf('day')],
                'Tomorrow': [moment().add(1, 'days').startOf('day'), moment().add(1, 'days').endOf('day')],
                'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                'Next 7 Days': [moment().startOf('day'), moment().add(6, 'days').endOf('day')],
//                'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
                'Last Week': [moment().subtract(1, 'weeks').startOf('isoWeek'), moment().subtract(1, 'weeks').endOf('isoWeek')],
                'This Week': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
                'Next Week': [moment().add(1, 'weeks').startOf('isoWeek'), moment().add(1, 'weeks').endOf('isoWeek')]
            },
        opens: 'right'
    }, dynamicDateCallBackRight);
    
    // daterange picker center
    $('.date_time_rangepicker_dynamic_followup_center').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        timePicker: true,
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY hh:mm A',
            separator: ', ',
        },
        ranges: {
                'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                'Today': [moment().startOf('day'), moment().endOf('day')],
                'Tomorrow': [moment().add(1, 'days').startOf('day'), moment().add(1, 'days').endOf('day')],
                'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                'Next 7 Days': [moment().startOf('day'), moment().add(6, 'days').endOf('day')],
//                'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
                'Last Week': [moment().subtract(1, 'weeks').startOf('isoWeek'), moment().subtract(1, 'weeks').endOf('isoWeek')],
                'This Week': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
                'Next Week': [moment().add(1, 'weeks').startOf('isoWeek'), moment().add(1, 'weeks').endOf('isoWeek')]
            },
        opens: 'center'
    }, dynamicDateCallBackCenter);

}
function dynamicDateCallBack(start, end, dateRangeStr = '', inputValue = null) 
{
    let range = getDateString(start, end, dateRangeStr);
    if(inputValue){
        $("[name='" + inputValue + "']").val(range); 
    }
    else if($(this).attr('element')){
        $(this).attr('element').val(range);
    }
    // setTimeout(function(){$(this).attr('element').val(range);},50);
}
function dynamicDateCallBackLeftUp(start, end, dateRangeStr = '', inputValue = null) 
{
    let range = getDateString(start, end, dateRangeStr);
    if(inputValue){
        $("[name='" + inputValue + "']").val(range); 
    }
    else if($(this).attr('element')){
        $(this).attr('element').val(range);
    }
}

function dynamicDateCallBackRight(start, end, dateRangeStr = '', inputValue = null) 
{
    let range = getDateString(start, end, dateRangeStr);
    if(inputValue){
        $("[name='" + inputValue + "']").val(range); 
    }
    else if($(this).attr('element')){
        $(this).attr('element').val(range);
    }
}

function dynamicDateCallBackCenter(start, end, dateRangeStr = '', inputValue = null) 
{
    let range = getDateString(start, end, dateRangeStr);
    if(inputValue){
        $("[name='" + inputValue + "']").val(range); 
    }
    else if($(this).attr('element')){
        $(this).attr('element').val(range);
    }
}

// FOLLOWUP DATE DYNAMIC 63.9.4
function LoadFollowupDateTimeRangepicker(opens, drops) {
    //define calender open position
    if(typeof opens == 'undefined') {
        opens = 'left';
    }
    //define calender drop position
    if(typeof drops == 'undefined') {
        drops = 'down';
    }
    
    $('.date_time_rangepicker_dynamic').daterangepicker("destroy").daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        timePicker: true,
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: true,
        locale: {
            format: 'DD/MM/YYYY hh:mm A',
            separator: ', '
        },
        ranges: {
                'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                'Today': [moment().startOf('day'), moment().endOf('day')],
                'Tomorrow': [moment().add(1, 'days').startOf('day'), moment().add(1, 'days').endOf('day')],
                'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                'Next 7 Days': [moment().startOf('day'), moment().add(6, 'days').endOf('day')],
//                'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
                'Last Week': [moment().subtract(1, 'weeks').startOf('isoWeek'), moment().subtract(1, 'weeks').endOf('isoWeek')],
                'This Week': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
                'Next Week': [moment().add(1, 'weeks').startOf('isoWeek'), moment().add(1, 'weeks').endOf('isoWeek')]
                
            },
        opens: opens,
        drops: drops,
    }, followupDateCallBack);
    
//    function (start, end, label) {
//        $(".date_time_rangepicker_dynamic").val(label);
//    }

//    $('.date_time_rangepicker_dynamic').on('apply.daterangepicker', function (ev, picker) {
//        $(this).val(picker.startDate.format('DD/MM/YYYY hh:mm A') + ',' + picker.endDate.format('DD/MM/YYYY hh:mm A'));
//    });

    $('.date_time_rangepicker_dynamic, .date_time_rangepicker_dynamic_left_up, .date_time_rangepicker_dynamic_right, .date_time_rangepicker_dynamic_center').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
    
    // position data
    
    $('.date_time_rangepicker_dynamic_left_up').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        timePicker: true,
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: true,
        locale: {
            format: 'DD/MM/YYYY hh:mm A',
            separator: ', ',
        },
        ranges: {
                'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                'Today': [moment().startOf('day'), moment().endOf('day')],
                'Tomorrow': [moment().add(1, 'days').startOf('day'), moment().add(1, 'days').endOf('day')],
                'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                'Next 7 Days': [moment().startOf('day'), moment().add(6, 'days').endOf('day')],
//                'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
                'Last Week': [moment().subtract(1, 'weeks').startOf('isoWeek'), moment().subtract(1, 'weeks').endOf('isoWeek')],
                'This Week': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
                'Next Week': [moment().add(1, 'weeks').startOf('isoWeek'), moment().add(1, 'weeks').endOf('isoWeek')]
            },
        opens: 'left',
        drops: 'up'
    }, followupDateCallBackLeftUp);


    // position right

    $('.date_time_rangepicker_dynamic_right').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        timePicker: true,
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: true,
        locale: {
            format: 'DD/MM/YYYY hh:mm A',
            separator: ', ',
        },
        ranges: {
                'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                'Today': [moment().startOf('day'), moment().endOf('day')],
                'Tomorrow': [moment().add(1, 'days').startOf('day'), moment().add(1, 'days').endOf('day')],
                'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                'Next 7 Days': [moment().startOf('day'), moment().add(6, 'days').endOf('day')],
//                'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
                'Last Week': [moment().subtract(1, 'weeks').startOf('isoWeek'), moment().subtract(1, 'weeks').endOf('isoWeek')],
                'This Week': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
                'Next Week': [moment().add(1, 'weeks').startOf('isoWeek'), moment().add(1, 'weeks').endOf('isoWeek')]
            },
        opens: 'right'
    }, followupDateCallBackRight);
    
    // daterange picker center
    $('.date_time_rangepicker_dynamic_center').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        timePicker: true,
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: true,
        locale: {
            format: 'DD/MM/YYYY hh:mm A',
            separator: ', ',
        },
        ranges: {
                'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                'Today': [moment().startOf('day'), moment().endOf('day')],
                'Tomorrow': [moment().add(1, 'days').startOf('day'), moment().add(1, 'days').endOf('day')],
                'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                'Next 7 Days': [moment().startOf('day'), moment().add(6, 'days').endOf('day')],
//                'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
                'Last Week': [moment().subtract(1, 'weeks').startOf('isoWeek'), moment().subtract(1, 'weeks').endOf('isoWeek')],
                'This Week': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
                'Next Week': [moment().add(1, 'weeks').startOf('isoWeek'), moment().add(1, 'weeks').endOf('isoWeek')]
            },
        opens: 'center'
    }, followupDateCallBackCenter);

}

function followupDateCallBack(start, end, dateRangeStr = '') 
{
    let range = getDateString(start, end, dateRangeStr);
    $(document).find('.date_time_rangepicker_dynamic').val(range);
    setTimeout(function(){$(document).find('.date_time_rangepicker_dynamic').val(range);},50);
}

function ucwords(str,force){
  str=force ? str.toLowerCase() : str;  
  return str.replace(/(\b)([a-zA-Z])/g,
           function(firstLetter){
              return   firstLetter.toUpperCase();
           });  
}

function followupDateCallBackLeftUp(start, end, dateRangeStr = '') 
{
    let range = getDateString(start, end, dateRangeStr);
    $(document).find('.date_time_rangepicker_dynamic_left_up').val(range);
}

function followupDateCallBackRight(start, end, dateRangeStr = '') 
{
    let range = getDateString(start, end, dateRangeStr);
    $(document).find('.date_time_rangepicker_dynamic_right').val(range);
}

function followupDateCallBackCenter(start, end, dateRangeStr = '') 
{
    let range = getDateString(start, end, dateRangeStr);
    $(document).find('.date_time_rangepicker_dynamic_center').val(range);
}

function getDateString(start, end, dateRangeStr = '') 
{
    let range = "";
    switch(dateRangeStr.toLowerCase()){
        case "custom range":
            range = start.format('DD/MM/YYYY hh:mm A') + ',' + end.format('DD/MM/YYYY hh:mm A');
            break;
        case "all time":
        case "yesterday":
        case "today":
        case "tomorrow":
        case "last 7 days":
        case "next 7 days":
        case "last 30 days":
        case "last month":
        case "this month":
        case "next month":
        case "last week":
        case "this week":
        case "next week":
            range = ucwords(dateRangeStr, true);
            break;
        default:
            range = dateRangeStr.toUpperCase();
                break;
    }
    return range;
}

/* dynamic date apoorv
function reinitializeDateRangePicker(dynamicDate)
{
    if(dynamicDate === '')
    {
        dynamicDate = "this month";
    }

    let dynamicStart = '';
    let dynamicEnd = moment().endOf('day');
    let dynamicRangeStr = dynamicDate;
    
    switch(dynamicDate){
        case "yesterday":
            dynamicStart = moment().subtract(1, 'days');
            dynamicEnd = moment().subtract(1, 'days');
            break;
        case "today":
            dynamicStart = moment().startOf('day');
            break;
        case "tomorrow":
            dynamicStart = moment().add(1, 'days').startOf('day');
            dynamicEnd = moment().add(1, 'days').endOf('day');
            break;
        case "last 7 days":
            dynamicStart = moment().subtract(6, 'days').startOf('day');
            break;
        case "next 7 days":
            dynamicStart = moment().startOf('day');
            dynamicEnd = moment().add(6, 'days').endOf('day');
            break;
        case "last 30 days":
            dynamicStart = moment().subtract(29, 'days').startOf('day');
            break;
        case "last month":
            dynamicStart = moment().subtract(1, 'month').startOf('month');
            dynamicEnd = moment().subtract(1, 'month').endOf('month');
            break;
        case "this month":
            dynamicStart = moment().startOf('month');
            dynamicEnd = moment().endOf('month');
            break;
        case "next month":
            dynamicStart = moment().add(1, 'month').startOf('month');
            dynamicEnd = moment().add(1, 'month').endOf('month');
            break;
        case "last week":
            dynamicStart = moment().subtract(1, 'weeks').startOf('isoWeek');
            dynamicEnd = moment().subtract(1, 'weeks').endOf('isoWeek');
            break;
        case "this week":
            dynamicStart = moment().startOf('isoWeek');
            dynamicEnd = moment().endOf('isoWeek');
            break;
        case "next week":
            dynamicStart = moment().add(1, 'weeks').startOf('isoWeek');
            dynamicEnd = moment().add(1, 'weeks').endOf('isoWeek');
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
    $('.date_time_rangepicker_dynamic').daterangepicker('destroy').daterangepicker({
        startDate: dynamicStart ,
        endDate: dynamicEnd,
        timePicker: true,
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: true,
            locale: {
                format: 'DD/MM/YYYY hh:mm A',
                separator: ', '
            },
            ranges: {
                    'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                    'Today': [moment().startOf('day'), moment().endOf('day')],
                'Tomorrow': [moment().add(1, 'days').startOf('day'), moment().add(1, 'days').endOf('day')],
                'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                'Next 7 Days': [moment().startOf('day'), moment().add(6, 'days').endOf('day')],
//                'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
                'Last Week': [moment().subtract(1, 'weeks').startOf('isoWeek'), moment().subtract(1, 'weeks').endOf('isoWeek')],
                'This Week': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
                'Next Week': [moment().add(1, 'weeks').startOf('isoWeek'), moment().add(1, 'weeks').endOf('isoWeek')]
                
            },
        opens: 'left',
        drops: 'down'
    }, followupDateCallBack);
    followupDateCallBack(dynamicStart, dynamicEnd, dynamicDate);

    
    
}

*/

function reinitializeDateRangePicker(dynamicDate, inputValue=null, initializeType="common")
{
    if(dynamicDate === '')
    {
        dynamicDate = "this month";
    }
    
    let dynamicStart = '';
    let dynamicEnd = moment().endOf('day');
    let dynamicRangeStr = dynamicDate;
    
    switch(dynamicDate){
        case "yesterday":
            dynamicStart = moment().subtract(1, 'days').startOf('day');
            dynamicEnd = moment().subtract(1, 'days').endOf('day');
            break;
        case "today":
            dynamicStart = moment().startOf('day');
            break;
        case "tomorrow":
            dynamicStart = moment().add(1, 'days').startOf('day');
            dynamicEnd = moment().add(1, 'days').endOf('day');
            break;
        case "last 7 days":
            dynamicStart = moment().subtract(6, 'days').startOf('day');
            break;
        case "next 7 days":
            dynamicStart = moment().startOf('day');
            dynamicEnd = moment().add(6, 'days').endOf('day');
            break;
        case "last 30 days":
            dynamicStart = moment().subtract(29, 'days').startOf('day');
            break;
        case "last month":
            dynamicStart = moment().subtract(1, 'month').startOf('month');
            dynamicEnd = moment().subtract(1, 'month').endOf('month');
            break;
        case "this month":
            dynamicStart = moment().startOf('month');
            dynamicEnd = moment().endOf('month');
            break;
        case "next month":
            dynamicStart = moment().add(1, 'month').startOf('month');
            dynamicEnd = moment().add(1, 'month').endOf('month');
            break;
        case "last week":
            dynamicStart = moment().subtract(1, 'weeks').startOf('isoWeek');
            dynamicEnd = moment().subtract(1, 'weeks').endOf('isoWeek');
            break;
        case "this week":
            dynamicStart = moment().startOf('isoWeek');
            dynamicEnd = moment().endOf('isoWeek');
            break;
        case "next week":
            dynamicStart = moment().add(1, 'weeks').startOf('isoWeek');
            dynamicEnd = moment().add(1, 'weeks').endOf('isoWeek');
            break;
        case "all time":
            dynamicStart = moment().subtract(12, 'month').startOf('month');
            break;
        default:
            let dateBreak = dynamicRangeStr.split(",");
            dynamicStart = moment(dateBreak[0],"DD/MM/YYYY hh:mm A");
            dynamicEnd = moment(dateBreak[1],"DD/MM/YYYY hh:mm A");
            break;
    }

    if(initializeType == "custom_followup")
    {
        $('.date_time_rangepicker_dynamic_followup').daterangepicker({
            startDate: dynamicStart ,
            endDate: dynamicEnd,
            timePicker: true,
            showDropdowns: true,
            showWeekNumbers: true,
            autoUpdateInput: false,
            locale: {
                format: 'DD/MM/YYYY hh:mm A',
                separator: ', '
            },
            ranges: {
                    'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                    'Today': [moment().startOf('day'), moment().endOf('day')],
                    'Tomorrow': [moment().add(1, 'days').startOf('day'), moment().add(1, 'days').endOf('day')],
                    'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                    'Next 7 Days': [moment().startOf('day'), moment().add(6, 'days').endOf('day')],
    //                'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
                    'Last Week': [moment().subtract(1, 'weeks').startOf('isoWeek'), moment().subtract(1, 'weeks').endOf('isoWeek')],
                    'This Week': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
                    'Next Week': [moment().add(1, 'weeks').startOf('isoWeek'), moment().add(1, 'weeks').endOf('isoWeek')]
                    
                },
            opens: 'left',
            drops: 'down'
        }, dynamicDateCallBack);
    }else{
        $('.date_time_rangepicker_dynamic').daterangepicker({
            startDate: dynamicStart ,
            endDate: dynamicEnd,
            timePicker: true,
            showDropdowns: true,
            showWeekNumbers: true,
            autoUpdateInput: false,
            locale: {
                format: 'DD/MM/YYYY hh:mm A',
                separator: ', '
            },
            ranges: {
                    'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                    'Today': [moment().startOf('day'), moment().endOf('day')],
                    'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                    'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                },
            opens: 'left',
            drops: 'down'
        }, dynamicDateCallBack);
    }
    dynamicDateCallBack(dynamicStart, dynamicEnd, dynamicDate, inputValue);   
}


var shi = ''
// For Every Between Date Ranges
function LoadDynamicDateTimeRangepicker(opens, drops) {
    //define calender open position
    if(typeof opens == 'undefined') {
        opens = 'left';
    }
    //define calender drop position
    if(typeof drops == 'undefined') {
        drops = 'down';
    }
    
    $('.date_time_rangepicker_dynamic').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        timePicker: true,
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY hh:mm A',
            separator: ', '
        },
        ranges: {
                'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                'Today': [moment().startOf('day'), moment().endOf('day')],
                'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],                
            },
        opens: opens,
        drops: drops,
    }, dynamicDateCallBack);
    
//    function (start, end, label) {
//        $(".date_time_rangepicker_dynamic").val(label);
//    }

    $('.date_time_rangepicker_dynamic, .date_time_rangepicker_dynamic_left_up, .date_time_rangepicker_dynamic_right, .date_time_rangepicker_dynamic_center').on('apply.daterangepicker', function (ev, picker) {
        if(picker.chosenLabel == "Today")
            $(this).val(picker.chosenLabel);
    });

    $('.date_time_rangepicker_dynamic, .date_time_rangepicker_dynamic_left_up, .date_time_rangepicker_dynamic_right, .date_time_rangepicker_dynamic_center').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
    
    // position data
    
    $('.date_time_rangepicker_dynamic_left_up').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        timePicker: true,
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY hh:mm A',
            separator: ', ',
        },
        ranges: {
                'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                'Today': [moment().startOf('day'), moment().endOf('day')],
                'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
            },
        opens: 'left',
        drops: 'up'
    }, dynamicDateCallBackLeftUp);


    // position right

    $('.date_time_rangepicker_dynamic_right').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        timePicker: true,
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY hh:mm A',
            separator: ', ',
        },
        ranges: {
                'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                'Today': [moment().startOf('day'), moment().endOf('day')],
                'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
            },
        opens: 'right'
    }, dynamicDateCallBackRight);
    
    // daterange picker center
    $('.date_time_rangepicker_dynamic_center').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        timePicker: true,
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY hh:mm A',
            separator: ', ',
        },
        ranges: {
                'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                'Today': [moment().startOf('day'), moment().endOf('day')],
                'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
            },
        opens: 'center'
    }, dynamicDateCallBackCenter);
}

