
function loadReportDateRangepicker() {
    $('.daterangepicker_report').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY',
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
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
    });

    $('.daterangepicker_report').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });


    // position right

    $('.daterangepicker_report_right').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY',
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
        opens: 'right'
    }, function (start, end, label) {
        //console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
    });

    $('.daterangepicker_report_right').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
    });

    $('.daterangepicker_report_right').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
    
    // daterange picker center
    $('.daterangepicker_report_center').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY',
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
        opens: 'center'
    }, function (start, end, label) {
        //console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
    });

    $('.daterangepicker_report_center').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
    });

    $('.daterangepicker_report_center').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });

}


function LoadDynamicDateRangePicker(opens, drops){
    //define calender open position
    if(typeof opens === 'undefined') {
        opens = 'left';
    }
    //define calender drop position
    if(typeof drops === 'undefined') {
        drops = 'down';
    }
    $('.daterangepicker_report').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        onChange: function () {
//            console.log("hii");
//            var tempValues = JSON.parse($('#daterangepicker').val());
//            var tempValues = picker;
//            console.log(tempValues);
        },
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY',
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
        opens: opens,
        drops: drops,
    }, function (start, end, label) {
//        var elementName = this.element[0].attributes.name.nodeValue;
//        setTimeout(function(){
//            if(label !== 'Custom Range'){
//                $("[name='" + elementName + "']").val(label);
//            }
//        },0);
    });
    
    $('.dropup-date .daterangepicker_report').daterangepicker({
        
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY',
            separator: ', '
        },
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'left',
        drops: 'up'
    }, function (start, end, label) {
    });

    var resetFlag = 0;
    $('.daterangepicker_report').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
    });

    $('.daterangepicker_report').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
        resetFlag = 1;
    });
    $('.daterangepicker_report').on('hide.daterangepicker', function (ev, picker) {
            var id = $(this);
            setTimeout(function(){
                var currentval = id.val();
                if(resetFlag === 0 && currentval !== 'Empty' && currentval !== 'Not Empty' && currentval !== '' ){
                    var label = picker.chosenLabel;
                    if(label !== 'Custom Range'){
                        id.val(picker.chosenLabel);
                    }
                }
                resetFlag = 0;
            },0);
    });


    // position right

    $('.daterangepicker_report_right').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY',
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
        opens: 'right'
    }, function (start, end, label) {
       
    });

    $('.daterangepicker_report_right').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
    });

    $('.daterangepicker_report_right').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
    $('.daterangepicker_report_right').on('hide.daterangepicker', function (ev, picker) {
        var id = $(this);
            setTimeout(function(){
                var currentval = id.val();
                if(resetFlag === 0 && currentval !== 'Empty' && currentval !== 'Not Empty' && currentval !== '' ){
                    var label = picker.chosenLabel;
                    if(label !== 'Custom Range'){
                        id.val(picker.chosenLabel);
                    }
                }
                resetFlag = 0;
            },0);
    });
    
    // daterange picker center
    $('.daterangepicker_report_center').daterangepicker({
        /*"startDate": "",
         "endDate": "",*/
        showDropdowns: true,
        showWeekNumbers: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY',
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
        opens: 'center'
    }, function (start, end, label) {
       
    });

    $('.daterangepicker_report_center').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
    });

    $('.daterangepicker_report_center').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
    
    $('.daterangepicker_report_center').on('hide.daterangepicker', function (ev, picker) {
        var id = $(this);
        setTimeout(function(){
            var currentval = id.val();
            if(resetFlag === 0 && currentval !== 'Empty' && currentval !== 'Not Empty' && currentval !== '' ){
                var label = picker.chosenLabel;
                if(label !== 'Custom Range'){
                    id.val(picker.chosenLabel);
                }
            }
            resetFlag = 0;
        },0);
    });
}
