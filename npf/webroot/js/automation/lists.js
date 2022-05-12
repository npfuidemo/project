/* To handle  college's list all functions. */
$(document).ready(function(){
    if($('form#automationListManagerForm').length > 0) {
        //Search Automation List name
        $('form#automationListManagerForm input#search_common').typeahead({
            hint: true,
            highlight: true,
            minLength: 1
            , source: function (request, response) {
                var search = $('form#automationListManagerForm input#search_common').val();
                var college_id = $('form#automationListManagerForm select#collegeId').val();
                if (search)
                {
                    $.ajax({
                        url: jsVars.SearchAutomationListUrl,
                        data: {search_common: search, college_id: college_id},
                        dataType: "json",
                        type: "POST",
                        headers: {
                            "X-CSRF-Token": jsVars._csrfToken
                        },
                        //contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            if(data['redirect']) {
                                location = data['redirect'];
                            }
                            else if(data['error']) {
                                alertPopup(data['error'],'error');
                            }
                            else {
                                items = [];
                                map = {};
                                $.each(data.listAutomation, function (i, item) {

                                    var id = i;
                                    var name = item;
                                    map[name] = {id: id, name: name};
                                    items.push(name);
                                });
                                response(items);
                                $(".dropdown-menu").css("height", "auto");
                            }
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

    //Create Automation List: Calender Initialize
    if ($('div#createAutomationListPopupArea').length > 0) {
        $('div#createAutomationListPopupArea input#automationListStartOn').datetimepicker({
			format: 'DD/MM/YYYY HH:mm',
			defaultDate:moment()
			}).on('dp.show',function(){
				var $today = new Date();
				var $yesterday = new Date($today);
				$yesterday.setDate($today.getDate() - 1);
				return $(this).data('DateTimePicker').minDate($yesterday);
			}).on('dp.hide', function(){
				var floatifyPlaceHolder = $(this).attr('placeholder');
				if(this.value!=''){
					$(this).parent().addClass('floatify__active');
					$(this).attr('placeholder', '');
				}else{
					$(this).parent().removeClass('floatify__active');
					$(this).attr('placeholder', floatifyPlaceHolder);
				}
			});
        $('div#createAutomationListPopupArea input#automationListEndsOn').datetimepicker({
			format: 'DD/MM/YYYY HH:mm',
			defaultDate:moment(),
			'widgetPositioning':{'vertical':'top'}
		}).on('dp.hide', function(){
			var floatifyPlaceHolder = $(this).attr('placeholder');
			if(this.value!=''){
				$(this).parent().addClass('floatify__active');
				$(this).attr('placeholder', '');
			}else{
				$(this).parent().removeClass('floatify__active');
				$(this).attr('placeholder', floatifyPlaceHolder);
			}
		});
    }

    //Manage Automation List: Add Data Range Calender
    if ($('form#automationListManagerForm').length > 0) {
        $('form#automationListManagerForm input#createdOn').daterangepicker({
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
    }
    //change list/segment/owner on change of college/list
    $(document).on('change','form#automationListManagerForm select#collegeId, form#automationListManagerForm select#listId',function(){
        getAutomationListFilters(this.name);
		$('#search_common').prop('disabled', false);
		$('#search_common').parent('.input').addClass('enabled');
    });

    //update real time field list on change of real time
    $(document).on('change','select#automationListType',function(){
        var optionHtml = '';
        if(this.value == 'real_time') {
            var module = $('#automationListModuleName').val();
            var updateRealTimeFields = jsVars.updateRealTimeFields;
            loadRealTimeFields(module,updateRealTimeFields);
        }
        else{
            $('select#automationListRealTimeField').val('').trigger('change');
        }

        //update real time fields list


        if($(this).val()=='no_real_time'){
            $('#repeat_div_block').show();
        }
        else{
            $('#repeat_div_block').hide();
        }

    });

    if(typeof jsVars.updateRealTimeFields != 'undefined') {
        $('select#automationListType').trigger('change');
        if(jsVars.updateRealTimeFields=='field_update'){
            $('select#automationListRealTimeField').trigger('change');
        }
    }

    //For Add/Edit Automation Page
    if($('#automationRepeat').length>0) {
         $(document).on('change','#automationRepeat',function(){
            if($(this).val()==1){
                $('#automation_relative_time_div').show();
            } else {
                $('#automation_relative_time_div').hide();
            }
        });
    }

    $(document).on('change','select#automationListRealTimeField',function(){
        getUpdateFieldLists();
    });


        // Once createAutomationListPopupArea div modal open
        $('div#createAutomationListPopupArea').on('shown.bs.modal', function () {
          $('body').addClass('scrollHidden');
        })
        $('div#createAutomationListPopupArea').on('hidden.bs.modal', function () {
          $('body').removeClass('scrollHidden');
        })
    $("#search_common").keypress(function(e) {
      if(e.which == 13) {
            LoadMoreAutomationList('reset');
        }
    });
    $(document).on('keyup','#search_common',function(evt){ 
        $('#load_more_results_msg').hide();
        if (evt.keyCode != 13) {
            if($('#search_common').val()!=''){                
                $('#load_more_button').hide();
            }
            else{
                if(('#load_more_results').text()!=''){
                    $('#load_more_button').show();
                }                
            }            
        }
    });
    $('#automationListManagerForm').on('change keyup', ':input', function(e) {
        if($('#filter').hasClass("in")){
            $('#load_more_results_msg').hide();
            $('#load_more_button').hide();            
        }        
    });

});

function getUpdateFieldLists(){
    if ($("#automationListRealTimeField").val() == 'field_update') {
        var college_id = $('#automationCollegeId').val();
        var autoListId = $('#autoListId').val();
        var singleAmFormId = $('#automationListFormId').val();
        if(singleAmFormId>0){
            $("#automationListRealTimeField option[value='field_update']").text("Lead/Application Field Update");
        }else{
            $("#automationListRealTimeField option[value='field_update']").text("Lead Field Update");
        }
        $.ajax({
            url: '/automation/get-user-updated-fields-list',
            type: 'post',
            dataType: 'json',
            async: false,
            data: {college_id: college_id, singleAmFormId: singleAmFormId},
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            beforeSend: function () {
                $('div#createAutomationListPopupArea button#saveAutomationListInfoBtn').attr('disabled', 'disabled');
            },
            success: function (json) {
                $('div#createAutomationListPopupArea button#saveAutomationListInfoBtn').removeAttr('disabled');
                $('#listloader').hide();

                if (typeof json['error'] != 'undefined' && json['error'] != '') {
                    if (json['error'] == 'session') {
                        window.location.reload(true);
                    } else {
                        alertPopup(json['error'], 'error');
                    }
                } else if (typeof json['status'] != 'undefined' && json['status'] == 200) {
                    var optionHtml = '';
//                        console.table(json['fields']);
                    //check module list is available
                    if (json['fields']) {
//                            //get real time fields list
                        for (var value in json['fields']) {
                            if ((typeof jsVars.onUpdateField != 'undefined') && (jsVars.onUpdateField.indexOf(value) > -1)) {
                                optionHtml += '<option value="' + value + '" selected>' + json['fields'][value] + '</option>';
                            } else {
                                optionHtml += '<option value="' + value + '">' + json['fields'][value] + '</option>';
                            }
                        }
                    }

                    var elem = $('select#automationListOnUpdateField');
                    elem.html(optionHtml);
                    elem.SumoSelect({placeholder: 'Select On update fields', search: true, searchText: 'Select On update fields'});
                    $('#update_field_div').show();

                    // add selected field list to tooltip on popup
                    if (typeof jsVars.onUpdateField != 'undefined' && jsVars.onUpdateField.length > 0) {
                        var onUpdateField = jsVars.onUpdateField;
                        var selectFieldStr = '';
                        for (var i in onUpdateField) {
                            if (typeof jsVars.form_fields != 'undefined' && onUpdateField[i] != '' && onUpdateField[i] != null && typeof jsVars.form_fields[onUpdateField[i]] != 'undefined') {
                                var ouf = jsVars.form_fields[onUpdateField[i]];
                                selectFieldStr += '<li >' + ouf + '</li>';
                            }
                        }
                        $('#tooltipfiled_' + autoListId).attr('data-content', '<ul style="width:190px">' + selectFieldStr + '</ul>');
                    }


                    if ($('select#automationListOnUpdateField')[0].sumo) {
                        $('select#automationListOnUpdateField')[0].sumo.reload();
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $('#listloader').hide();
                $('div#createAutomationListPopupArea button#saveAutomationListInfoBtn').removeAttr('disabled');
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    } else {
        $('select#automationListOnUpdateField').val('').trigger('chosen:updated');
        $('#update_field_div').hide();

        var module = $('#automationListModuleName').val();
        loadRealTimeFields(module,null);
    }
}
//Show Create Automation List Popup
function showAutomationListPopup(collegeId, module, formId, segmentId)
{
    if((typeof module === 'undefined') || (module === '')) {
        return;
    }

    switch(module) {
        case 'leads':
            if(typeof formId === 'undefined' || ((formId <= 0))) {
                formId = 0;
            }
            //segment id is optional
            if((typeof segmentId === 'undefined') || (segmentId < 0)) {
                segmentId = 0;
            }
            break;
        case 'applications':
            //form id is required
            if((typeof formId === 'undefined') || (formId < 0)) {
                return;
            }
            //segment id is optional
            if((typeof segmentId === 'undefined') || (segmentId < 0)) {
                segmentId = 0;
            }
            break;
        case 'offline':
            //form id is required
            if((typeof formId === 'undefined') || (formId < 0)) {
                return;
            }
            //segment id is optional
            if((typeof segmentId === 'undefined') || (segmentId < 0)) {
                segmentId = 0;
            }
            break;
        default:
            return;
    }
    //update real time fields list
    updateSelectOption('', 'realTimeField');
    $('div#createAutomationListPopupArea input#automationCollegeId').val(collegeId);
    $('div#createAutomationListPopupArea input#automationFormId').val(formId);
    $('div#createAutomationListPopupArea input#automationSegmentId').val(segmentId);
    $('div#createAutomationListPopupArea input#automationListModuleName').val(module);
    $('div#createAutomationListPopupArea select#automationListType').val('no_real_time').trigger('chosen:updated');
    $('div#createAutomationListPopupArea input#automationListStartOn').val('');
    $('div#createAutomationListPopupArea input#automationListEndsOn').val('');
    $('div#createAutomationListPopupArea button#saveAutomationListInfoBtn').attr('onclick','saveAutomationList();');
    $('div#createAutomationListPopupArea').modal('show');
	floatableLabel();
}

function getAllFormList(cid, default_val, multiselect) {
    if(typeof default_val=='undefined'){
        default_val = '';
    }
    if(typeof multiselect=='undefined'){
        multiselect = '';
    }

    if(cid == '' || cid == '0' ){
        $("#formListDiv").html("<select name='form_id' id='form_id'  class='chosen-select' ><option value='0'>Form</option></select>");
	$('.chosen-select').trigger('chosen:updated');
        return false;
    }

    $.ajax({
        url: '/voucher/get-forms',
        type: 'post',
        data: {
            "college_id": cid,
            "default_val": default_val,
            "multiselect":multiselect
        },
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
           //currentObj.text('Wait..');
        },
        success: function (json) {
            if (json == 'session_logout') {
                window.location.reload(true);
            } else {
                $("#automationListFormId").html(json);
                $('.chosen-select').trigger('chosen:updated');
            }
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            ;
        }
    });
}

//Create Automation List under List
function saveAutomationList()
{
    var module = $('div#createAutomationListPopupArea input#automationListModuleName').val();
    if(module == '') {
        return;
    }

    var data = $('div#createAutomationListPopupArea input, div#createAutomationListPopupArea select, div#createAutomationListPopupArea textarea').serializeArray();
    //empty error span
    if($("#automationListFormId").length>0 && $("#automationListFormId").val()>0){
        data.push({name: "AutomationLists[json_attributes][am_single_form_name]", value: $("#automationListFormId :selected").text()});
    }
    data.push({name: "AutomationLists[json_attributes][time_type]", value: $("#time_type :selected").val()});
    data.push({name: "AutomationLists[json_attributes][time]", value: $("#time").val()});
    $('div#createAutomationListPopupArea span.requiredError').text('');
    $.ajax({
        url: jsVars.FULL_URL+'/automation/save-automation-list',
        type: 'post',
        dataType: 'json',
        data: data,
//        async: false,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () {
            $('#listloader').show();
            $('div#createAutomationListPopupArea button#saveAutomationListInfoBtn').attr('disabled','disabled');
        },
        success: function (json) {
            $('#listloader').hide();
            $('div#createAutomationListPopupArea button#saveAutomationListInfoBtn').removeAttr('disabled');
            if(json['redirect']) {
                location = json['redirect'];
            }
            else if(json['alert']) {
                $('div#createAutomationListPopupArea').modal('hide');
                alertPopup(json['alert'],'error');
            }
            else if(json['error']) {
                for(var id in json['error']) {
                    $('div#createAutomationListPopupArea div#automationList'+ id +'Div').addClass('has-error');
                    $('div#createAutomationListPopupArea span#automationList'+ id +'Span').text(json['error'][id]);
                }
            }
            else if(json['success'] == 200) {
                $('div#createAutomationListPopupArea').modal('hide');
                location = json['location'];
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#listloader').hide();
            $('div#createAutomationListPopupArea button#saveAutomationListInfoBtn').removeAttr('disabled');
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

//get listing filters data
function getAutomationListFilters(change)
{
    var data = $('form#automationListManagerForm select').serializeArray();
    data.push({name:"change",value:change});
    $.ajax({
        url: jsVars.getAutomationListFiltersUrl,
        type: 'post',
        dataType: 'json',
        data: data,
//        async: false,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $('#listloader').show();
        },
        success: function (json) {
            $('#listloader').hide();
            if(json['redirect']) {
                location = json['redirect'];
            }
            else if(json['alert']) {
                alertPopup(json['alert'],'error');
            }
            else if(json['success'] == 200) {
                //update list
                if(json['list']) {
                    updateSelectOption(json['list'], 'list');
                }
                //update segment
                updateSelectOption(json['segment'], 'segment');
                //update owner
                updateSelectOption(json['owner'], 'owner');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#listloader').hide();
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

//Update Select Options
function updateSelectOption(optionHtml, update)
{
    var defaultOption;
    var elem;
    switch(update) {
        case 'list':
            defaultOption = '<option value="">Select List Name</option>';
            elem = $('form#automationListManagerForm select#listId');
            break;
        case 'segment':
            defaultOption = '<option value="">Select Segment Name</option>';
            elem = $('form#automationListManagerForm select#segmentId');
            break;
        case 'owner':
            defaultOption = '<option value="">Select Owner Name</option>';
            elem = $('form#automationListManagerForm select#createdBy');
            break;
        case 'realTimeField':
            defaultOption = '<option value="">Select Real Time Field</option>';
            elem = $('select#automationListRealTimeField');
            break;
    }
    //do nothing
    if(defaultOption == '') {
        return;
    }
    var elemHtml = defaultOption;
    if((typeof optionHtml !='undefined') && (optionHtml != '')){
        elemHtml += optionHtml;
    }
    //update element
    elem.html(elemHtml);
        elem.trigger('chosen:updated');
    }

function collegeErrorChanges(selectCollegeMsg, type) {

        $('#load_more_results > tr > td > div > div').html("<div class='alert alert-danger'>"+ selectCollegeMsg +"</div>");
        $('#load_more_button').hide();
        $('#load_more_button').html("Load More Lists");
        if (type != '') {
            $('#if_record_exists').hide();
        }
        return false;
}

//load more automation list
function LoadMoreAutomationList(type) {
    var selectCollegeMsg = 'Please select an Institute Name and click Search to view automation lists.';
    if($('#collegeId').val() == '') {
        collegeErrorChanges(selectCollegeMsg, type);
        return false;
    }
    if (type == 'reset') {
        Page = 0;
        $('#load_more_results').html("");
        $('#load_more_results_msg').html("");
        $('#load_more_results_msg').show();
        $('#load_more_button').show();
        $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;&nbsp;Loading...');
        //$('button#searchAutomationListBtn').attr('disabled','disabled');
    }
    var data = $('form#automationListManagerForm').serializeArray();
    data.push({name: "page", value: Page});
    data.push({name: "search_common", value:$('#search_common').val()});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;&nbsp;Loading...');


    $.ajax({
        url: '/automation/ajax-list-manager',
        type: 'post',
        dataType: 'html',
        data: data,
		async: true,
        beforeSend: function () {
			$('#listloader').show();
			$('.daterangepicker_report').prop('disabled', true);
        },
		complete: function () {
			$('#listloader').hide();
			$('.daterangepicker_report').prop('disabled', false);
		},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('.expandableSearch').show();
            // let clgId = $('#collegeId').val();
            // if(!clgId){$('.expandableSearch').hide();}
            Page = Page + 1;
            $('.no-record-list').hide();
            if (data === "session_logout") {
                window.location.reload(true);
            }
            else if (data === "college_error") {
                collegeErrorChanges(selectCollegeMsg, type);
            }
            else if (data == "error") {
                if(Page==1){
                    $('#table-data-view').hide();
                    $('#load_msg_div').hide();
                    $('#load_msg').html('No Records found');
                    $('.no-record-list').show();
				}
                else{
                    $('#table-data-view').show();
                    $('#load_msg_div').hide();
                    $('#load_more_button').hide();
                    $('#load_more_results_msg').html("<div class='margin-top-8 text-center text-danger fw-500'>No More Record</div>");
				}
                $('#load_more_button').hide();
                if (type != '' && Page==1) {
                    $('#if_record_exists').hide();
                }
            }
            else {
                if (type == 'reset') {
                    $('#load_more_results').html("");
                }
                $('#table-data-view, #LoadMoreArea').show();
                $('#load_msg_div').hide();
                data = data.replace("<head/>", '');
                if (Page==1) {
                    $('#load_more_results').append(data);
                    $('#if_record_exists').show();
                }
                else {
                    $('#load_more_results tbody').append(data);
                }
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Lists");
                dropdownMenuPlacement();
                //determineDropDirection();
            }
            $('.offCanvasModal').modal('hide');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

function deactivateCommunication(data){
    if(typeof data == 'undefined' || data == ''){
        return false;
    }
    $("#confirmYes").removeAttr('onclick');
    $('#confirmTitle').html("Confirm Stop action");
    $("#confirmYes").html('Ok');
    $("#confirmYes").siblings('button').html('Cancel');
    $('#ConfirmMsgBody').html('Are you sure you want to Close this Job?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/communications/deactivate-communication',
            type: 'post',
            dataType: 'json',
            data: {'data':data},
            beforeSend: function () {
                //$('#listloader').show();
            },
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            success: function (json) {
                if (typeof json['session_error'] != 'undefined' && json['session_error']!='') {
                    window.location.reload(true);
                }
                else if(typeof json['error'] != 'undefined' && json['error']!=''){
                    alertPopup(json['error'],'error');
                }
                else{
                    alertPopup(json['success'],'success');
                    LoadMoreAutomationList('reset');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            },
            complete: function (jqXHR, textStatus) {
                $('#listloader').hide();

            }
        });

    $('#ConfirmPopupArea').modal('hide');
            });
        return false;
}

function CopyAutomationList(data,copy_from_college) {
    var copy_to_college = $('#copy_to_college').val();
    if($.trim(copy_to_college) == '' || copy_to_college == 0){
        $("#copyFormPopupError").html('Select college first');
        return false;
    }
    //call confirm popup if (env = defaultEnv) & college selected
    if(copy_to_college > 0 && copy_from_college > 0) {
        $('#copy2').modal('hide');
        $("#confirmYes").removeAttr('onclick');
        $('#confirmTitle').html("Confirm Copy");
        $("#confirmYes").html('Ok');
        $("#confirmYes").siblings('button').html('Cancel');
        $('#ConfirmMsgBody').html('Are you sure you want to copy?');
        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
            e.preventDefault();
            $.ajax({
                url: '/automation/copy-automation',
                type: 'post',
                dataType: 'json',
                data: {'data':data,'copyCollegeId':copy_to_college},
                beforeSend: function () {
                    $('#listloader').show();
                },
                headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                success: function (json) {
                    if (typeof json['session'] != 'undefined' && json['session']!='') {
                        window.location.reload(true);
                    }
                    else if(typeof json['error'] != 'undefined' && json['error']!=''){
                        alertPopup(json['error'],'error');
                    }
                    else{
                        alertPopup(json['success'],'success');
                        LoadMoreAutomationList('reset');
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                },
                complete: function (jqXHR, textStatus) {
                    $('#listloader').hide();

                }
            });

        $('#ConfirmPopupArea').modal('hide');
                });
            return false;
    }else{
        $('#copy2').modal('hide');
        alertPopup('Unable to process request.Please try again', 'error');
    }
    return false;
}

function copyAutomation(data){
    if(typeof data == 'undefined' || data == ''){
        return false;
    }

    var collegeId = $('#collegeId').val();
    $('#CopyFormPopUpTextArea').html('');
    $("#copy2 a#CopyBtn").attr("onclick", 'return CopyAutomationList("'+data+'","'+collegeId+'");');
    $("#copy2").modal();
     return false;

}


function pauseAutomation(data){
    if(typeof data == 'undefined' || data == ''){
        return false;
    }
    $("#confirmYes").removeAttr('onclick');
    $('#confirmTitle').html("Confirm Pause");
    $("#confirmYes").html('Ok');
    $("#confirmYes").siblings('button').html('Cancel');
    $('#ConfirmMsgBody').html('Are you sure to pause automation?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/automation/pause-automation',
            type: 'post',
            dataType: 'json',
            data: {'data':data},
            beforeSend: function () {
                $('#listloader').show();
            },
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            success: function (json) {
                if (typeof json['session'] != 'undefined' && json['session']!='') {
                    window.location.reload(true);
                }
                else if(typeof json['error'] != 'undefined' && json['error']!=''){
                    alertPopup(json['error'],'error');
                }
                else{
                    alertPopup(json['success'],'success');
                    LoadMoreAutomationList('reset');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            },
            complete: function (jqXHR, textStatus) {
                $('#listloader').hide();

            }
        });

    $('#ConfirmPopupArea').modal('hide');
            });
        return false;
}


function resumeAutomation(data){
    if(typeof data == 'undefined' || data == ''){
        return false;
    }
    $("#confirmYes").removeAttr('onclick');
    $('#confirmTitle').html("Confirm Resume");
    $("#confirmYes").html('Ok');
    $("#confirmYes").siblings('button').html('Cancel');
    $('#ConfirmMsgBody').html('Are you sure to resume automation?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/automation/resume-automation',
            type: 'post',
            dataType: 'json',
            data: {'data':data},
            beforeSend: function () {
                $('#listloader').show();
            },
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            success: function (json) {
                if (typeof json['session'] != 'undefined' && json['session']!='') {
                    window.location.reload(true);
                }
                else if(typeof json['error'] != 'undefined' && json['error']!=''){
                    alertPopup(json['error'],'error');
                }
                else{
                    alertPopup(json['success'],'success');
                    LoadMoreAutomationList('reset');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            },
            complete: function (jqXHR, textStatus) {
                $('#listloader').hide();

            }
        });

    $('#ConfirmPopupArea').modal('hide');
            });
        return false;
}

function parseStringDate(date_str){
    if(typeof date_str == 'undefined' || date_str == ''){
        return new Date();
    }

    var str  = date_str;
    var year = '2017';
    var month= '01';
    var day  = '01';
    var hr   = '00';
    var min  = '00';

    var str_array = str.split(' ');
    if(typeof str_array[0] !='undefined' && str_array[0]!=''){
        var str_date = str_array[0].split('/');
        if(str_date.length==3){
            year = str_date[2];
            month= parseInt(str_date[1])-1;
            day  = str_date[0];
        }
    }
    if(typeof str_array[1] !='undefined' && str_array[1]!=''){
        var str_time = str_array[1].split(':');
        if(str_time.length==2){
            hr= str_time[0]
            min  = str_time[1];
        }
    }
    var dd = new Date(year,month,day,hr,min);
    return dd;
}

/**
 * For reset the form
 * @param {type} form_name (Pass the form id
 * @returns {undefined}
 */
function ResetFilter(form_name){
   $('form#'+form_name+' input[type=text], form#'+form_name+' textarea').val('');
    $('form#'+form_name+' select').val('').trigger('chosen:updated');
    if('automationListManagerForm' == form_name){
		jQuery('#tot_records, #load_more_results').html('');
		jQuery('#load_msg_div').show();
		jQuery('#table-data-view, #if_record_exists, #LoadMoreArea').hide();
        /*jQuery('#tot_records').html('');
        jQuery('#load_more_results').html('<tr><td><div class="row"><div class="col-md-12"><h4 class="text-center">Please select an Institute Name and click Search to view automation lists.</h4></div></div></td><tr>');*/
    }
    return false;
}




function hideShowField(){
    $('#real_time_field_div').hide();
    if($('#automationListType').val()=="real_time"){
        $('#real_time_field_div').show();
    }else{
        $('#real_time_field_div').hide();
    }

    if($('#automationListRealTimeField').length>0 && $('#automationListRealTimeField').val()=='field_update'){
        $('#update_field_div').show();
    }
    else{
        $('#update_field_div').hide();
    }
}

    function selectInstitute(college_id) {
        if(college_id != undefined) {
            $('#collegeId').val(college_id).trigger('chosen:updated');
            $('#collegeId').trigger('change');
        }
    }

function loadRealTimeFields(module,updateRealTimeFields=null){
    var collegeId = $("#automationCollegeId").val();
    var formId = $("#automationListFormId").val();
    var automationListRealTimeField = $("#automationListRealTimeField").val();

    if(automationListRealTimeField !== ''){
        return false;
    }
    $.ajax({
        url: '/automation/get-real-time-fields',
        type: 'post',
        dataType: 'json',
        data: {'collegeId':collegeId,'formId':formId,'module':module},
        beforeSend: function () {
            $('#listloader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            if (typeof json['session'] !== 'undefined' && json['session']!=='') {
                window.location.reload(true);
            }
            else if(typeof json['error'] !== 'undefined' && json['error']!==''){
                alertPopup(json['error'],'error');
            }
            else{
                var optionHtml = '';
                var module = $('#automationListModuleName').val();
                var realTimeFields = json.fields;

                if(!realTimeFields || (realTimeFields == '')){
                    return;
                }
                //get real time fields list
                for(var value in realTimeFields) {
                    if((typeof updateRealTimeFields !== 'undefined') && (updateRealTimeFields === value)) {
                        optionHtml += '<option value="'+ value +'" selected>'+ realTimeFields[value] +'</option>';
                    }
                    else {
                        optionHtml += '<option value="'+ value +'">'+ realTimeFields[value] +'</option>';
                    }
                }

                updateSelectOption(optionHtml, 'realTimeField');
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


$(window).load(function(){
    if(typeof jsVars.updateRealTimeFields != 'undefined' && jsVars.updateRealTimeFields == 'field_update') {
        if($('select#automationListRealTimeField').length > 0 ){
            $('select#automationListRealTimeField').val('field_update');
            setTimeout(function(){
                getUpdateFieldLists();
            }, 2000);
        }
    }
});