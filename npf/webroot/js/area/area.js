
$(document).ready(function(){
    if($('.daterangepicker_report').length > 0){
        LoadReportDateRangepicker();
    }

    if($('select#graph_agent_id').length > 0) {
        $('select#graph_agent_id').SumoSelect({placeholder: 'Agent Name', search: true, searchText:'Agent Name', captionFormatAllSelected: "All Selected.",selectAll : false,okCancelInMulti:true });
    }

    $('.filter_collapse').dropdown('toggle');
    $('.panel-group').on('hidden.bs.collapse', toggleIcon);
    $('.panel-group').on('shown.bs.collapse', toggleIcon);
    if($('#FilterRaisedRequest #requirement_list').length > 0){
        $('#FilterRaisedRequest #requirement_list').SumoSelect({placeholder: 'Select Requirements', search: true, searchText:'Select Requirements', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
    }

    $('.columnApplicationCheckAll').on('click', function(e){
        $(this).toggleClass('checked');
        if($(this).hasClass('checked')) {
            $('#column_li_list input:checkbox:not(:disabled)').prop('checked', true);
        } else {
            $('#column_li_list input:checkbox:not(:disabled)').prop('checked', false);
        }
    });

    if($("#meeting_date").length > 0){
        var meeting_date = $.trim($('#meeting_date').val());
//        if(meeting_date != ''){
//            var new_date = meeting_date.split(" ");
//            var from    = new_date[0].split("/");
//            $('#meeting_date').datetimepicker({format: 'DD/MM/YYYY HH:mm', minDate:new Date(from[2], from[1] - 1, from[0])} );
//        }else{
//            var d = new Date();
//            var month = d.getMonth();
//            var day = d.getDate();
//            var year = d.getFullYear();
//            $('#meeting_date').datetimepicker({format: 'DD/MM/YYYY HH:mm', minDate:new Date(year,month,day)} );
//        }
        $('#meeting_date').datetimepicker({format: 'DD/MM/YYYY HH:mm'} );
        $('#meeting_date').val(meeting_date);
        $('#meeting_date'). on('dp.change', function(e){
            populateDay(e.date);
        });
    }

    $( document ).on( 'click', '.bs-dropdown-to-select-group .dropdown-menu-list li', function( event ) {
    	var $target = $( event.currentTarget );
            $target.closest('.bs-dropdown-to-select-group')
                    .find('[data-bind="bs-drp-sel-value"]').val($target.attr('data-value'))
                    .end()
                    .children('.dropdown-toggle').dropdown('toggle');
            $target.closest('.bs-dropdown-to-select-group')
            //.find('[data-bind="bs-drp-sel-label"]').text($target.context.textContent);
            .find('[data-bind="bs-drp-sel-label"]').text($target.attr('data-value'));

            //When Select the option from dropdown then close the open dropdown
            $target.closest('.bs-dropdown-to-select-group').removeClass('open');

            //Bydefault remove the value when value will change
            $('#contact_number').val('');
            //For change Maxlength value of Mobile Input Box as per selection of country code
            if ($target.attr('data-value') == jsVars.defaultCountryCode) {
                $('#contact_number').attr('maxlength',jsVars.maxMobileLength);
            } else {
                $('#contact_number').attr('maxlength',jsVars.internationalMaxMobileLength);
            }
        return false;
    });
    $('#filter_dial_code').on('click', function (e) {
        e.stopPropagation();
    });

    //advance filter code

    $("#FilterWeeklyPlanList select#college_id").bind("change", function () {
        $('.columnApplicationCheckAll').removeClass('checked');
        $('.columnApplicationCheckAll').attr('checked', false);
        // $('#load_more_results').html('<tbody><tr><td><div class="col-md-12"><h4 class="text-center text-danger">Please click search button to view Weekly Plans.</h4></div></td></tr><tr></tr></tbody>');

        if(this.value == '' || this.value.length == 0){
            $("#filter_elements_html").html("");
            $("#if_record_exists").hide();
            $("#load_more_button").hide();
//filter  hide
            return false;
        }
        getFilterColumn(this.value);//call filter and columns by college id  with enables form
    });

});


function LoadWeeklyPlan(listingType) {
    //make buttun disable
    $(':input[type="button"]').attr("disabled", true);

    var data = [];
    if (listingType === 'reset') {
        varPage = 0;
        $('#weekly_plan_container').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
    }
    data = $('#FilterWeeklyPlanList').serializeArray();
    data.push({name: "page", value: varPage});
    data.push({name: "type", value: listingType});

    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $('div.loader-block').show();
    $.ajax({
        url: jsVars.FULL_URL + '/area/ajax-lists',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            //  $('div.loader-block').show();
            $('#search_btn_hit').prop('disabled', true);
        },
        complete: function () {
            $('div.loader-block').hide();
            $(':input[type="button"]').removeAttr("disabled");
            // $('#weekly_plan_container').addClass('newTableStyle');
            $('#load_more_results').addClass('table-hover');
            $('.offCanvasModal').modal('hide');
        },
        async: false,
        success: function (data) {
            $('#search_btn_hit').removeAttr('disabled');
            varPage = varPage + 1;
            var checkError  = data.substring(0, 6);
            if (data === "session_logout") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(data.substring(6, data.length));
                $('#load_more_button').hide();
                // alert('static');
            } else {
                data = data.replace("<head/>", '');
                var countRecord = countResult(data);
                if (listingType === 'reset') {
                    $('#weekly_plan_container').removeAttr('style');
                    $('#weekly_plan_container').html(data);
                } else {
                    $('#weekly_plan_container').find("tbody").append(data);
                    // $('.offCanvasModal').modal('hide');
                }
                if(countRecord == 0 && varPage == 1){
                    $("#if_record_exists").hide();
                    $('#weekly_plan_container').removeClass('newTableStyle');
                }else{
                    $("#if_record_exists").show();
                    $('#weekly_plan_container').addClass('newTableStyle');
                }
                if (countRecord < 10) {
                    $('#load_more_button').hide();
                } else {
                    $('#load_more_button').show();
                }
//                 $.material.init();
                table_fix_rowcol();

                // hold onto the drop down menu
                 var dropdownMenu;
                // and when you show it, move it to the body
                $('.ellipsis-left').on('show.bs.dropdown', function (e) {

                        // grab the menu
                        dropdownMenu = $(e.target).find('.dropdown-menu');
                        dropHeight = dropdownMenu.outerHeight() - 15;

                        // detach it and append it to the body
                        $('body').append(dropdownMenu.detach());

                        // grab the new offset position
                        var eOffset = $(e.target).offset();

                        // make sure to place it where it would normally go (this could be improved)
                        dropdownMenu.css({
                                'display': 'block',
                                //'top': eOffset.top + $(e.target).outerHeight(),
                                'top': eOffset.top - dropHeight,
                                'left': eOffset.left - 124
                        });
                });

                // and when you hide it, reattach the drop down, and hide it normally
                $('.ellipsis-left').on('hide.bs.dropdown', function (e) {
                        $(e.target).append(dropdownMenu.detach());
                        dropdownMenu.hide();
                });
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html("Load More Weekly Plans");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function countResult(html) {
    var len = (html.match(/listDataRow/g) || []).length;
    return len;
}



function GetChildByMachineKey(key,ContainerId,selectedCity){
    if(key && ContainerId){
        var assignedCity = $.trim($("#assigned_city") .val());
        var cityArray = [];
        if(assignedCity !== ''){
            cityArray = JSON.parse(assignedCity);
        }
        if(cityArray[key] !== undefined){
             var html = '<option value="">Select City</option>';
            for(var citykey in cityArray[key]){
                if(selectedCity == citykey){
                    html += '<option selected value="'+citykey+'">'+cityArray[key][citykey]+'</option>';
                }else{
                    html += '<option value="'+citykey+'">'+cityArray[key][citykey]+'</option>';
                }
            }
            $('#'+ContainerId).html(html);
        }else{
            $.ajax({
                url: '/common/GetChildByMachineKeyForRegistration',
                type: 'post',
                dataType: 'json',
                data: {key:key,college_id:0},
                success: function (json) {
                    if(json['redirect']){
                        location = json['redirect'];
                    }
                    if(json['error']){
                        alertPopup(json['error'],'error');
                    }
                    else if(json['success']){
                        var html = '<option value="">Select City</option>';

                        for(var key in json['list']) {
                            if(selectedCity == key){
                                html += '<option selected value="'+key+'">'+json['list'][key]+'</option>';
                            }else{
                                html += '<option value="'+key+'">'+json['list'][key]+'</option>';
                            }
                        }
                        $('#'+ContainerId).html(html);
                        $('.chosen-select').chosen();
                        $('.chosen-select').trigger('chosen:updated');
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        }
    }else{
        $('#'+ContainerId).html('<option value="">Select City</option>');
    }
    $('.chosen-select').chosen();
    $('.chosen-select').trigger('chosen:updated');
    return false;
}


function getStateList(agentId,selectedState=''){
    var college_id_md = 0;
    if( $("[name='h_college_id']").length > 0 && typeof $("[name='h_college_id']").val() != "undefined" ){
        college_id_md = $("[name='h_college_id']").val();
    }
    $.ajax({
        url: jsVars.FULL_URL + '/area/get-state-list',
        type: 'post',
        data: {'agentId':agentId,'college_id':college_id_md},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        async: false,
        beforeSend: function () {
            $('div.loader-block').show();
        },
        complete: function () {
            $('div.loader-block').hide();
            $('.chosen-select').chosen();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            var html = '<option value="">Select State</option>';
            if(responseObject.status === 1 && typeof responseObject.data.stateList === "object" ){
                for(var key in responseObject.data.stateList){
                    if(selectedState == key){
                        html += '<option selected value="'+key+'">'+responseObject.data.stateList[key]+'</option>';
                    }else{
                        html += '<option value="'+key+'">'+responseObject.data.stateList[key]+'</option>';
                    }
                }

                $('#state_id').html(html);
                $('.chosen-select').chosen();
                $('.chosen-select').trigger('chosen:updated');
            }else{
                console.log(responseObject.message);
            }
            if(responseObject.status === 1  ){
                $("#assigned_city").val(responseObject.data.assignedCity);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


//function to set day on selection of meeting date
function populateDay(timeString){
    $("#meeting_day").val(timeString.format('dddd'));
}

function resetMeetingDate(){
    $("#meeting_day").val('');
    $("#meeting_date").val('');
}


function GetAgentUsers(college_id,userId){
     if (college_id) {
        $.ajax({
            url: jsVars.GetAgentUsersLink,
            type: 'post',
            data: {CollegeId: college_id},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json)
            {
                if (json['redirect'])
                    location = json['redirect'];
                else if (json['error'])
                    alertPopup(json['error'], 'error');
                else if (json['status'] == 200) {
                    var html = "<option value=''>Agent Name</option>";
                        html += json["userList"];
                    $('#created_by').html(html);

                    $('#created_by').trigger('chosen:updated');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

    } else {
        $('#created_by').html('<option value="">Agent Name</option>');
        $('#created_by').trigger('chosen:updated');
    }
}


// this function is used when there is mobile dial country code is selected in form applicant
function filterDialCode() {
    var value = $('#filter_dial_code').val();
    value = value.toLowerCase();
    $("#ul_dial_code > li").each(function() {
        if ($(this).text().toLowerCase().search(value) > -1) {
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });
}



/**
 * This function for rest all values in Filter of form
 */
function ResetFilterValue() {
    $('.columnApplicationCheckAll').removeClass('checked');
    $('.columnApplicationCheckAll').attr('checked', false);
    $('.dropdown-menu-tc').remove();
    $('#weekly_plan_container').removeAttr('style');
    $('input[type="text"]').each(function () {
        $(this).val('');
    });
    $('button[name="search_btn"]').attr('disabled', false);
    $('select').each(function () {
        this.selected = false;
        $(this).val('');
        $(this).trigger("chosen:updated");
    });

    $('#load_more_results').html('<tbody><tr><td><div class="col-md-12"><h4 class="text-center text-danger">Please select an Institute Name and click Search to view Weekly Plans.</h4></div></td></tr><tr></tr></tbody>');
    $('.if_record_exists').hide();
    $('#load_more_button').hide();
    $('#filter_elements_html').html("");
    $(".filterAdvancelead").hide();//filter  hide
    return false;
}




/**
 * This function use for get college config based filter append
 */
function getFilterColumn(college_id) {
    $(".filterAdvancelead").hide();//filter deropdoun show
    $("#load_more_button").hide();
    $("#filter_li_list").html('');//blank filter
    $("#column_li_list").html('');//blank column
    if (typeof college_id === undefined) {
        return false;
    }
    $('div.loader-block').show();
    $.ajax({
        url: '/area/get-advance-filter-column',
        type: 'post',
        dataType: 'json',
        data: {'college_id':college_id},
        complete : function (){
            $('div.loader-block').hide();
        },
        async:false,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                window.location.href = json['redirect'];
            } else if (typeof json['status'] != 'undefined' && json['status'] == 200) {
                $("#filter_li_list").append(json['filter']);
                $("#column_li_list").append(json['column']);
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
            // $(".filterAdvancelead").show();
            createUserFilter();
            //
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}


function filter(element, listid) {
    var value = $(element).val();
    value = value.toLowerCase();
    $("#" + listid + " > li").each(function () {
        if ($(this).text().toLowerCase().search(value) > -1) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}


/**
 * This function use for append  filter in Div
 */
function createUserFilter() {
    $(".filterAdvancelead").show();
    $('button[name="search_btn').removeAttr("disabled");
    $('#filter_elements_html').html('');
    var col_class = 4;//class col-md-3

    var i = 0;
    //$('input[name="filter_create_keys[]"]:checked').each(function () {
    $('input[name="filter_create_keys[]"]').each(function () {
        createFilterHtml(this, col_class, i++);
    });

    return false;
}
/**
 * This function use for append  filter
 */
function createFilterHtml(currentObj, col_class, ii) {

    var labelname = $(currentObj).data('label_name');
    var InputId = $(currentObj).attr('id');
    var key_source = $(currentObj).data('key_source');
    var value_field = $(currentObj).val();
    var arr = value_field.split("||");
    var html = '';
    var type = "";

    if (arr.length > 2) {
        var type            = arr[1];
        var val_json        = arr[2];
        var html_field_id   = arr[0];

        //create drop down
        if (type === "dropdown") {//drop down
            html = "<select data-key_source='" + InputId + "' class='chosen-select' name='Filter[" + arr[0] + "]' id='" + html_field_id + "'>";
            html += '<option value="">' + labelname + '</option>';
            obj_json = JSON.parse(val_json);
            for (var key in obj_json) {
                html += "<option value=\"" + key + "\">" + obj_json[key] + "</option>";
            }
            html += "</select>";
        }
    }
    var finalhtml = '';
    // finally show the field in DOM

    html = '<div class="margin-bottom-8 ">' + html + '</div>';
    finalhtml = $('<div class="col-md-12' + ' div_' + key_source + '"></div>').wrapInner(html);
    $('#filter_elements_html').append(finalhtml);

    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});

}



/**
 * to set and show remarks of weekly plan
 * @param {int} weeklyPlanId
 * @return {html}
 */
function viewRemarks(weeklyPlanId) {
    if(weeklyPlanId){
        $.ajax({
            url: jsVars.FULL_URL + '/area/get-remarks',
            type: 'post',
            dataType: 'html',

            data: {'weekly_plan_id':weeklyPlanId},
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('div.loader-block').show();
            },
            complete: function () {
                $('div.loader-block').hide();
            },
            async:false,
            success: function (response) {
                if(response === 'session_logout'){
                    window.location.reload(true);
                    return false;
                }
                $('#mainData').html(response);
                $("#DisplayRemarks").trigger('click');
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

function updateAchievement(){
     $('#ConfirmMsgBody').html('Are you sure you want to update the Achievement Metrics? Please note Achievement Metrics once updated cannot be edited.');
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmYes', function (e) {
        e.preventDefault();
            $("#update_achievement").submit();
         $('#ConfirmPopupArea').modal('hide');
    });
}


function showHideTabularTab(show_tab){
        if(show_tab === "1a"){
            hide_tab = "2a";
        }else{
             hide_tab = "1a";
        }
       $('.tablViewtab li').removeClass("active");
        $('.tablViewtab li#a_'+show_tab).addClass("active");
        $('div#'+hide_tab).hide();
        $('div#'+show_tab).fadeIn();

        if(show_tab === '2a'){
            $('#2a ul li').removeClass('active');
            $('#2a ul li:first').addClass('active');
            $('#2a ul li:first a').trigger('click');
        }

}



function exportWeeklyPlanCsv(){
    var $form = $("#FilterWeeklyPlanList");
    $form.attr("action",jsVars.exportWeeklyPlanCsvLink);
    $form.attr("target",'modalIframe');
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    $('#myModal').modal('show');
    $form.submit();
    $form.attr("onsubmit",onsubmit_attr);
    $form.removeAttr("target");
}

function exportAgentReportCsv(){
    var $form = $("#FilterAgentReport");
    $form.attr("action",jsVars.exportAgentReportCsvLink);
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




function getRequirementLists(formId){
    var collegeId = $.trim($("#college_id").val());
    if(collegeId != '' && collegeId != null){
        var $form = $("#"+formId);
        $form.attr("action",jsVars.getRequirementsListLink);
        $form.removeAttr("onsubmit");
        $form.submit();
    }else {
        alertPopup("Please Select College to raise requiremnts",'error');
    }
}



function saveAgentRequirements(buttonType){

    $("#requirementsMessageDiv").html("");
    var collegeId = $("#requirementsForm #college_id").val();
    if(collegeId == "" || collegeId == null ){
        $("#requirementsMessageDiv").html("<div class='bg-danger text-danger margin-bottom-20 text-center'>Something went wrong. please refresh page and try again.</div>");
        return false;
    }

    var  data = $('#requirementsForm').serializeArray();
     data.push({name: "buttonType", value: buttonType});
     $("#raiseAndSaveBtn").attr("disabled","disabled");
    $.ajax({
        url: jsVars.FULL_URL + '/area/update-agent-requirements',
        type: 'post',
        data: data,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('div.loader-block').show();
        },
        complete: function () {
            $('#ConfirmRaisedModal').modal('hide');
            $('div.loader-block').hide();
            $("#raiseAndSaveBtn").removeAttr("disabled");
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status == 1){
//                alertPopup("Requirements raised successfully",'success');
                location = responseObject.manageRequirementLink;
            }else{
                alertPopup(responseObject.message,'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

 function showConfirmRequirements(){
     $("#requirementsMessageDiv").html("");
    var  data = $('#requirementsForm').serializeArray();
    var listArray = $.parseJSON($("#requirement_detail").val());
    var html = "";
    var quantity = '';
    for(var key in listArray){
        quantity = $("#requirements_"+key).val();
        if(quantity != ''){
           html += '<tr>\
                            <td>\
                                '+listArray[key]+' \
                            </td>\
                            <td>'+quantity+'</td>\
                        </tr>' ;
        }
    }
    if(html != ''){
        $("#ConfirmRaisedData").html(html);
        $("#DisplayConfirmRaised").trigger('click');
    }else{
        $("#requirementsMessageDiv").html("<div class='bg-danger text-danger margin-bottom-20 text-center'>Add Atleast one requiremnet </div>");
    }
}


function LoadMoreRequirements(listingType) {
    //make buttun disable
    $(':input[type="button"]').attr("disabled", true);

    var data = [];
    if (listingType === 'reset') {
        varPage = 0;
        $('#raised_request_container').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
    }
    data = $('#FilterRaisedRequest').serializeArray();
    data.push({name: "page", value: varPage});
    data.push({name: "type", value: listingType});

    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $('div.loader-block').show();

    $.ajax({
        url: jsVars.FULL_URL + '/area/ajax-requirement-lists',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
//            $('div.loader-block').show();
        },
        complete: function () {
            $('div.loader-block').hide();
            $(':input[type="button"]').removeAttr("disabled");
        },
        async: false,
        success: function (data) {

            varPage = varPage + 1;
            var checkError  = data.substring(0, 6);
            if (data === "session_logout") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(data.substring(6, data.length));
                $('#load_more_button').hide();
            } else {
                data = data.replace("<head/>", '');
                var countRecord = countResult(data);
                if (listingType === 'reset') {
                    $('#raised_request_container').html(data);
                } else {
                    $('#raised_request_container').find("tbody").append(data);
                }
                if(countRecord == 0 && varPage == 1){
                    $("#if_record_exists").hide();
                }else{
                    $("#if_record_exists").show();
                }
                if (countRecord < 10) {
                    $('#load_more_button').hide();
                } else {
                    $('#load_more_button').show();
                }
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html("Load More Raised Requirements");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


 /**
 * to show popup for update requirement
 * @param {int} requirementId
 * @param {int} status
 * @return {html}
 */
function showRequirementStatus(requirementId,status) {
    $("#status_error").html("");
    if(requirementId){
        $("#update_status").val(status);
        $("#requiremnt_id").val(requirementId);
        $('.chosen-select').chosen();
        $('.chosen-select').trigger('chosen:updated');
        $("#DisplayManageRequest").trigger('click');
    }
}

/**
 * to show popup for update requirement
 * @return {html}
 */
function updateRequirementStatus() {
    var status          = $("#RequirementStatusForm #update_status").val();
    var requirementId   = $("#RequirementStatusForm #requiremnt_id").val();
    $("#status_error").html("");
    if(status != '' && requirementId != ''){
        $.ajax({
            url: jsVars.FULL_URL + '/area/update-requirement-status',
            type: 'post',
            dataType: 'html',

            data: {'status':status,'requirementId':requirementId},
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('div.loader-block').show();
            },
            complete: function () {
                $('div.loader-block').hide();
                $('#manageRequest').modal('hide');
            },
            async:false,
            success: function (response) {
                var responseObject = $.parseJSON(response);
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }
                if(responseObject.status == 1){
                    alertPopup("Requirements status updated",'success');
                }else{
                    alertPopup(responseObject.message,'error');
                }
                LoadMoreRequirements("reset");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }else if(status == ''){
        $("#status_error").html("Please Select Status");
    }else {
        $("#errorMessageDiv").html("Inavlid Request");
    }
}



function LoadAgentReport(listingType) {
    //make buttun disable
    $(':input[type="button"]').attr("disabled", true);

    var data = [];
    if (listingType === 'reset') {
        varPage = 0;
        $('#agent_report_container').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
    }
    data = $('#FilterAgentReport').serializeArray();
    data.push({name: "page", value: varPage});
    data.push({name: "type", value: listingType});

    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $('div.loader-block').show();
    $.ajax({
        url: jsVars.FULL_URL + '/area/ajax-agent-report',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
//            $('div.loader-block').show();
        },
        complete: function () {
            $('div.loader-block').hide();
            $(':input[type="button"]').removeAttr("disabled");
        },
        async: false,
        success: function (data) {

            varPage = varPage + 1;
            var checkError  = data.substring(0, 6);
            if (data === "session_logout") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(data.substring(6, data.length));
                $('#load_more_button').hide();
            } else {
                data = data.replace("<head/>", '');
                var countRecord = countResult(data);
                if (listingType === 'reset') {
                    $('#agent_report_container').html(data);
                } else {
                    $('#agent_report_container').find("tbody").append(data);
                }
                if(countRecord == 0 && varPage == 1){
                    $("#if_record_exists").hide();
                }else{
                    $("#if_record_exists").show();
                }
                if (countRecord < 10) {
                    $('#load_more_button').hide();
                } else {
                    $('#load_more_button').show();
                }
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html("Load More");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

//change +/- icon for accordion
function toggleIcon(e)
{
    $(e.target)
            .prev('.panel-heading')
            .find(".more-less")
            .toggleClass('glyphicon-menu-down glyphicon-menu-up');
}

if($('table').length > 0){
    determineDropDirection();
    $(window).scroll(determineDropDirection);
}



//prevent to select more than 5 boards;

$('#graph_agent_id').change(function (event) {
    if ($('#graph_agent_id').val() != null && $('#graph_agent_id').val().length > 6) {
        alert('Max 6 selections allowed!');
        var $this = $(this);
        var optionsToSelect = last_valid_selection;
        $this[0].sumo.unSelectAll();
        $.each(optionsToSelect, function (i, e) {
            $this[0].sumo.selectItem($this.find('option[value="' + e + '"]').index());
        });
        last_valid_selection    = optionsToSelect;
    } else if($('#graph_agent_id').val() != null){
        last_valid_selection = $(this).val();

    }
});

$(document).on('click',".sumo_graph_agent_id .btnOk",function(){
    loadAgentGraph();
    //loadDashboardTableData();
});

function loadAgentGraph(list_type){
    $("#actionButton").show();
    $("#table-data-view").show();
    $("#0-graph-header").show();
    last_valid_selection = $('#graph_agent_id').val();
    var date_range_graph = $('#date_range_graph').val();
    if($('#graph_agent_id').length && (!last_valid_selection || last_valid_selection.length <= 0)){
        $("#agent-dashboard-chart-graph").html("<table class='table table-striped list_data table-border'><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>Please select at least one agent</h4></div></div> </td></tr><tr></tr></table>");
        $("#agent-dashboard-table-graph").html("");
        $("#actionButton").hide();
        $("#table-data-view").hide();
        $("#barchart-graph-header").hide();
        return false;
    }
    if(typeof list_type == 'undefined'){
        list_type = '';
    }
    $('#agentLoader.loader-block').show();
     $.ajax({
        url: jsVars.loadDashboardGraphDataLink,
        type: 'post',
        data: {agent:last_valid_selection,list_type:list_type,date_range_graph:date_range_graph},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        complete: function () {
            $('#agentLoader.loader-block').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (typeof responseObject.url != 'undefined'){
                    location = responseObject.url;
            }else if(responseObject.status == 1){
                if(typeof responseObject.data === "object"){
                    if(typeof responseObject.data.graphData === "object"){
                        drawMatarialBarChart(responseObject.data.graphData);
                    }
                }
            }else{
                $("#agent-dashboard-chart-graph").html("<table class='table table-striped list_data table-border'><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>"+responseObject.message+"</h4></div></div> </td></tr><tr></tr></table>");
                //$("#agent-dashboard-table-graph").html("");
                $("#actionButton").hide();
                //$("#table-data-view").hide();
                $("#barchart-graph-header").hide();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function downloadDashboardGraph(type)
{
    if(type === 'pdf'){
        $('#agentLoader.loader-block').show();
        $('#agent-dashboard-chart-header').show();
        xepOnline.Formatter.Format('agent-graph-parent', {render: 'download',pageWidth:'300mm', pageHeight:'279mm',filename:"Agent Detailed Report"});
        $('#agent-dashboard-chart-header').hide();
        $('#agentLoader.loader-block').hide();
    }
}


$(document).on('click','.daterangepicker ul li',function() {
    var dateRangge = $("#date_range_graph").val();
    var dateRanggeTable = $("#date_range_table").val();
    if(dateRangge!=''){
        loadAgentGraph();
    }
    if(dateRanggeTable!=''){
        loadDashboardTableData();
    }
});

//applyBtn
$(document).on('click','.applyBtn',function() {
    var dateRangge = $("#date_range_graph").val();
    var dateRanggeTable = $("#date_range_table").val();
    if(dateRangge!=''){
        loadAgentGraph();
    }
    if(dateRanggeTable!=''){
        loadDashboardTableData();
    }
});

//cancelBtn
$(document).on('click','.cancelBtn',function(){

    loadDashboardTableData();
    loadAgentGraph();

});

function dateChanged(ev) {
    $(this).datepicker('hide');
    if ($('#startdate').val() != '' && $('#enddate').val() != '') {
        $('#period').text(diffInDays() + ' d.');
    } else {
        $('#period').text("-");
    }
}


function loadDashboardTableData(list_type){
    $("#actionButton").show();
    $("#table-data-view").show();
    $("#0-graph-header").show();
    last_valid_selection = $('#graph_agent_id').val();
    var date_range_table = $('#date_range_table').val();
    if($('#graph_agent_id').length && (!last_valid_selection || last_valid_selection.length <= 0)){
        $("#agent-dashboard-chart-graph").html("<table class='table table-striped list_data table-border'><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>Please select at least one agent</h4></div></div> </td></tr><tr></tr></table>");
        $("#agent-dashboard-table-graph").html("");
        $("#actionButton").hide();
        $("#table-data-view").hide();
        $("#barchart-graph-header").hide();
        return false;
    }
    if(typeof list_type == 'undefined'){
        list_type = '';
    }
    $('#agentLoader.loader-block').show();
     $.ajax({
        url: jsVars.loadDashboardTableDataLink,
        type: 'post',
        data: {agent:last_valid_selection,list_type:list_type,date_range_table:date_range_table},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        complete: function () {
            $('#agentLoader.loader-block').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (typeof responseObject.url != 'undefined'){
                    location = responseObject.url;
            }else if(responseObject.status == 1){
                if(typeof responseObject.data === "object"){

                    if(typeof responseObject.data.tableData === "object"){
                        drawTableChart(responseObject.data.tableData);
                    }
                }
            }else{
                $("#agent-dashboard-table-graph").html("<table class='table table-striped list_data table-border'><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>"+responseObject.message+"</h4></div></div> </td></tr><tr></tr></table>");
                //$("#agent-dashboard-table-graph").html("");
                //$("#actionButton").hide();
                //$("#table-data-view").hide();
                //$("#barchart-graph-header").hide();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
