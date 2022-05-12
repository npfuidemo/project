//$.material.init();
$(document).ready(function () {
    
    //LoadReportDateRangepicker();//datepicker_gdpi
    $("#mygdpiHeading .viewCusttab").click(function () {
        $(".viewCusttab").parent().removeClass('active');
        //$("#mygdpiHeading .customTabs > li").removeClass('npf-btn');
        //$("#mygdpiHeading .customTabs > li > a").removeClass('npf-btn').addClass('btn-info');
        //$(this).removeClass('a');
        //$(this).addClass('npf-btn');
        $(this).parent().addClass('active');
    });

    if (typeof jsVars.action_slug != 'undefined') {
        if (typeof jsVars.s_college_id != 'undefined' && typeof jsVars.form_id != 'undefined') {
            LoadFormsOnGDPI(jsVars.s_college_id, jsVars.form_id);
        }
        if (jsVars.action_slug == 'plan-gdpi-process') {
            getGdpiPlanProccess();
            //secondTab
            $(".viewCusttab").parent().removeClass('active');
            //$("#mygdpiHeading .customTabs > li > a").removeClass('npf-btn').addClass('btn-info');
            //$("#secondTab").removeClass('btn-info');
            //$("#secondTab").addClass('npf-btn');
            $("#secondTab").addClass('active');
        } else if (jsVars.action_slug == 'allot-venue') {
            getAllocation();
            //secondTab
            $(".viewCusttab").parent().removeClass('active');
            //$("#mygdpiHeading .customTabs > li > a").removeClass('npf-btn').addClass('btn-info');
            //$("#fourthTab").removeClass('btn-info');
            //$("#fourthTab").addClass('npf-btn');
            $("#fourthTab").addClass('active');
        } else if (jsVars.action_slug == 'gdpi-schedule') {
            getgdpiSchedule();
            //secondTab
            $(".viewCusttab").parent().removeClass('active');
            //$("#mygdpiHeading .customTabs > li > a").removeClass('npf-btn').addClass('btn-info');
            //$("#thirdTab").removeClass('btn-info');
            //$("#thirdTab").addClass('npf-btn');
            $("#thirdTab").addClass('active');
        } else {
            $("#myTabContentForGdpi .active .viewCusttab").trigger('click');
           $(".viewCusttab").parent().removeClass('active');
            //$("#mygdpiHeading .customTabs > li > a").removeClass('npf-btn').addClass('btn-info');
            //$("#firtTab").removeClass('btn-info');
            //$("#firtTab").addClass('npf-btn');
            $("#firtTab").addClass('active');
        }
    }
});

function onLoadCollegeOnGDPI(value) {
    $("#mygdpiHeading").hide();
    if (value != '0' && value != '') {
        var error_html = "Please click seacrh button for results";
    } else {
        var error_html = "Please select form";
    }
    $("#firstStep").show();
    $("#firstStep").html("<table class='table table-striped list_data'><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>" + error_html + "</h4></div></div> </td></tr><tr></tr></tbody></table>");
    $("#secondStep").html("");
    $("#thirdStep").html("");
    $("#fourthStep").html("");
}

function LoadFormsOnGDPI(value, default_val, multiselect, module) {
    if (typeof multiselect == 'undefined') {
        multiselect = '';
    }

    $("#mygdpiHeading").hide();
    if (value == '0' || value == '') {
        var error_html = "Please select institute";
    } else {
        var error_html = "Please select form";
    }
    $("#firstStep").show();
    $("#firstStep").html("<table class='table table-striped list_data'><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>" + error_html + "</h4></div></div> </td></tr><tr></tr></tbody></table>");
    $("#secondStep").html("");
    $("#thirdStep").html("");
    $("#fourthStep").html("");

    $.ajax({
        url: '/gdpi/getOnlyLiveForms',
        type: 'post',
        dataType: 'html',
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
            $('#div_load_forms select > option:first-child').text('All Forms');
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getgdpiDataByactiveClass() {
    $("#myTabContentForGdpi .active .viewCusttab").trigger('click');
}

function getgdpiData(Reqtype) {
    if (typeof Reqtype == 'undefined') {
        Reqtype = '';
    }
    $("#mygdpiHeading").hide();
    var data = $('#gd_pi_form_id').serializeArray();
    if(Reqtype!="checkSelection"){
        data.push({name: "selected_taxonomy",value:""});
    }
    $.ajax({
        url: '/gdpi/gdpiFirstStep',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $("#firstStep").html("");
            showHideTab('firstStep');

            var error_html = '';
            if (data == "session_logout") {
                window.location.reload(true);
            } else if (data === "permission_denied") {
                window.location = "/permissions/error";
            } else if (data == 'select_college') {
                error_html = "Please select institute";
                $("#firstStep").html("<table class='table table-striped list_data'><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>" + error_html + "</h4></div></div> </td></tr><tr></tr></tbody></table>");
            } else if (data == 'select_form') {
                error_html = "Please select form";
                $("#firstStep").html("<table class='table table-striped list_data'><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>" + error_html + "</h4></div></div> </td></tr><tr></tr></tbody></table>");
            } else if (data == 'is_predefined_missing') {
                error_html = 'GP-PI Module not Enabled. Kindly contact your Account Manager to get it enabled.';
                $("#firstStep").html("<table class='table table-striped list_data'><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>" + error_html + "</h4></div></div> </td></tr><tr></tr></tbody></table>");

            } else if (data == 'csrf_mismatched') {
                error_html = 'Csrf miss mateched.';
                $("#firstStep").html("<table class='table table-striped list_data'><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>" + error_html + "</h4></div></div> </td></tr><tr></tr></tbody></table>");
            } else {
                $("#mygdpiHeading").show();
                $("#firstStep").html(data);
                $("#mygdpiHeading").show();
                if (Reqtype == 'reset') {
                    $("#myGdpiContent").show();
                    $("#gdpiGraph").hide();
                }
                if(Reqtype=="showEditMode"){
                    $("#gdpiGraph").hide();
                    $("#myGdpiContent").show();   
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
            if($('select#selected_taxonomy').length > 0) {
                $('select#selected_taxonomy').SumoSelect({placeholder: 'Select taxonomy', search: true, searchText:'Taxonomy Name', captionFormatAllSelected: "All Selected.",selectAll : true,triggerChangeCombined: false,okCancelInMulti:true });
            
            }
            //table_fix_rowcol()
        }
    });

}
$(document).on('click',".sumo_selected_taxonomy .btnOk",function(){
    getgdpiData("checkSelection");
});
function saveFirstStepFormGdpi() {

    var data = $('#gd_pi_form_id').serializeArray();
    $.ajax({
        url: '/gdpi/saveFirstStepFormGdpi',
        type: 'post',
        dataType: 'json',
        data: data,
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if (json['redirect'])
            {
                location = json['redirect'];
            } else if (json['error'])
            {
                alertPopup(json['error'], 'error');
            } else if (json['required']) {
                $(".commonClass").html("");
                for (var key in json['required']) {
                    $("." + key).html('');
                    $("." + key).html(json['required'][key]);
                }
            } else if (typeof json['status'] != 'undefined' && json['status'] == 200) {
                //message
                $('#listloader').hide();
                alertPopup(json['message'], 'success');
                getgdpiData();
            }else{
                window.location.reload(true);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            window.location.reload(true);
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
        }
    });
}


function sameforall(val) {
    //captionIdValue
    if ($("#captionIdValue").is(':checked')) {
        var did = $('.captionValClass').val();
        $('.captionValClass').val(did);
        $(".captionValClass").prop('readonly', true);
        $(".captionValClass").first().removeAttr('readonly');
    } else {
        $(".captionValClass").removeAttr('readonly');
    }
}

function updateAllValue() {
    if ($("#captionIdValue").is(':checked')) {
        var did = $('.captionValClass').val();
        $('.captionValClass').val(did);
        $(".captionValClass").prop('readonly', true);
        $(".captionValClass").first().removeAttr('readonly');
    }
}

function getgdpiDataShow() {
    getgdpiData("showEditMode");
}


function downloadAsCsv() {

    var $form = $("#gd_pi_form_id");
    $form.attr("target", 'modalIframe');
    $form.append($("<input>").attr({"value": "snapshot_csv", "name": "export", 'type': "hidden", "id": "export"}));
    var onsubmit_attr = $form.attr("onsubmit");
    var action_attr = $form.attr("action");
    $form.removeAttr("onsubmit");
    $form.attr("action", '/gdpi/snapshot-download-as-csv-gdpi');
    $form.submit();
    $form.attr("onsubmit", onsubmit_attr);
    $form.attr("action", action_attr);
    $form.find('input[name="export"]').val("");
    $form.removeAttr("target");
    $('#myModal').on('hidden.bs.modal', function () {
        $("#modalIframe").html("");
        $("#modalIframe").attr("src", "");
    });

}

function downloadAllocationAsCsv() {
    var $form = $("#gd_pi_form_id");
    $form.attr("target", 'modalIframe');
    $form.append($("<input>").attr({"value": "snapshot_csv", "name": "export", 'type': "hidden", "id": "export"}));
    var onsubmit_attr = $form.attr("onsubmit");
    var action_attr = $form.attr("action");
    $form.removeAttr("onsubmit");
    $form.attr("action", '/gdpi/download-gdpi-allocation');
    $form.submit();
    $form.attr("onsubmit", onsubmit_attr);
    $form.attr("action", action_attr);
    $form.find('input[name="export"]').val("");
    $form.removeAttr("target");
    $('#myModal').on('hidden.bs.modal', function () {
        $("#modalIframe").html("");
        $("#modalIframe").attr("src", "");
    });
}

function ResetFilterValueForGdpi() {
    $('#gd_pi_form_id select#college_id').val('');
    $('#gd_pi_form_id select#form_id').html('<option value="">All Forms</option>');
    $('.chosen-select').chosen();
    $('.chosen-select').trigger("chosen:updated");
    //$("#mygdpiHeading").hide();
    error_html = "Please select institute";
    $("#firstStep").show();
    $("#firstStep").html("<table class='table table-striped list_data'><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>" + error_html + "</h4></div></div> </td></tr><tr></tr></tbody></table>");
    $("#mygdpiHeading").hide();
    $("#secondStep").html('');
    $("#thirdStep").html('');
    $("#fourthStep").html('');
}

function getgdpiSchedule() {
    var data = $('#gd_pi_form_id').serializeArray();
    $.ajax({
        url: '/gdpi/gdpi-schedule',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            showHideTab('thirdStep');
            $("#firstStep").html("");
            $("#thirdStep").html('');
            $("#secondStep").html('');
            $("#fourthStep").html('');
            $("#mygdpiHeading").hide();
            if (data == "session_logout") {
                window.location.reload(true);
            } else if (data === "permission_denied") {
                window.location = "/permissions/error";
            } else if (data == 'select_college') {
                var error_html = "Please select institute";
                $("#thirdStep").html("<table class='table table-striped list_data'><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>" + error_html + "</h4></div></div> </td></tr><tr></tr></tbody></table>");
            } else if (data == 'select_form') {
                var error_html = "Please select form";
                $("#thirdStep").html("<table class='table table-striped list_data'><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>" + error_html + "</h4></div></div> </td></tr><tr></tr></tbody></table>");
            } else if (data == 'firt_step_missing') {
                var error_html = "Previous step missing";
                $("#thirdStep").html("<table class='table table-striped list_data'><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>" + error_html + "</h4></div></div> </td></tr><tr></tr></tbody></table>");
            } else {
                $("#thirdStep").html(data);
                $("#mygdpiHeading").show();
                LoadReportDatepicker();
                $('.panel-group').on('hidden.bs.collapse', toggleIcon);
                $('.panel-group').on('shown.bs.collapse', toggleIcon);
            }
            //$('.datepicker_gdpi').datetimepicker({format: 'DD/MM/YYYY',viewMode: 'years',minDate:new Date()});
            $('.datepicker_gdpi').datetimepicker({format: 'DD/MM/YYYY'});          
            $('.datepicker_gdpi').datetimepicker().on('dp.show',function(){
                $(this).data('DateTimePicker').minDate(moment().subtract(1,'d'));
            });
            loadChosen();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
        }
    });
}

function gdpiPlannerSave(){
    editGdpiPlanner();
    $(".error").html("");
    if (typeof reset_type == 'undefined') {
        reset_type = '';
    }
    var opted_count = 0;
    var panel_capacity = 0;
    var panel_count = 0;
    var day_count = 0;
    var venue_id = 0;
    var error_flag = 0;
    var process_type = 'day';
   
    if (process_type === undefined) {
        $("#process_type_span").html("Please select calculation method");
        return false;
    }
    $(".allVenue").each(function () {
        venue_id = this.id;
        opted_count = $("#planner_estimate_opted_count_" + venue_id).val();
        panel_capacity = $("#planner_panel_capacity_" + venue_id).val();
        panel_count = $("#planner_panel_count_" + venue_id).val();
        day_count = $("#planner_day_count_" + venue_id).val();
        $("#planner_panel_capacity_" + venue_id).parent().next('label').html(panel_capacity);
        $("#planner_panel_count_" + venue_id).parent().next('label').html(panel_count);
        $("#planner_day_count_" + venue_id).parent().next('label').html(day_count);
//        alert(panel_capacity+"=========="+panel_count+"=========="+day_count);
        if (opted_count != '0' && opted_count != '') {
            if (opted_count == '') {
                opted_count = 0;
            }
            if (panel_capacity == '0' || panel_capacity == '') {
                error_flag = 1;
                $("#planner_panel_capacity_span_" + venue_id).html("Please enter per panel capacity");
            }
            if (process_type == 'day' && (panel_count == '0' || panel_count == '')) {
                error_flag = 1;
                $("#planner_panel_count_span_" + venue_id).html("Please enter panel count");
            }
            if (process_type == 'panel' && (day_count == '0' || day_count == '')) {
                error_flag = 1;
                $("#planner_day_count_span_" + venue_id).html("Please enter day count");
            }

            if (error_flag !== 1) {
                var secondfactor = 0;
                if (process_type == 'panel') {
                    secondfactor = parseInt(day_count);
                } else {
                    secondfactor = parseInt(panel_count);
                }
                var result = parseInt(opted_count) / (parseInt(panel_capacity) * secondfactor);
                var cielResult = Math.ceil(result);
                var calculatedString = '';
                if (cielResult == result) {
                    calculatedString = result;
                } else {
                    calculatedString = "" + cielResult + " (" + result.toFixed(2) + ")";
                }
                if (process_type == 'panel') {
                    $("#planner_panel_count_" + venue_id).val(result);
                    $("#planner_panel_count_" + venue_id).next('label').html(calculatedString);
                } else {
                    $("#planner_day_count_" + venue_id).val(result);
                    $("#planner_day_count_" + venue_id).next('label').html(calculatedString);
                }
            }
        }

    });

    if (error_flag === 1) {
        return false;
    } else { 
            submitPlannerGdpi(reset_type);  
    }
}

function submitPlannerGdpi(reset_type) {
    var data = $('#gd_pi_planner_form_id').serializeArray();
    data.push({name : "s_college_id" , value : $("#college_id").val()});
    data.push({name : "form_id" , value :$("#form_id").val()});
    $.ajax({
        url: '/gdpi/gdpi-planner-save',
        type: 'post',
        dataType: 'json',
        data: data,
        beforeSend: function () {
            $('#listloader').show();
        },
        complete: function () {
            $('#listloader').hide();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if (json['redirect']) {
                location = json['redirect'];
            } else if (json['error']) {
                alertPopup(json['error'], 'error');
            } else if (json['data_error'] !== undefined) {
                for (var key in json['data_error']) {
                    $("#" + key).html(json['data_error'][key]);
                }
            } else if (json['status'] === 'success') {
                $(".plannerEditMode").hide();
                $(".plannerViewMode").show();
//                $("#reset_gdpi_plan").hide();
                gdpiProcessPlanner();
                $('#updated_on').html("Last Updated on : " + json['date']);
//                alertPopup('Plan saved sucessfully', 'sucess'); 
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });    
}

function gdpiProcessPlanner(){
    $("#gdpiProcessPlanner .modal-title").text("GD-PI Planner *");
    var data = $('#gd_pi_form_id').serializeArray();
    $.ajax({ 
        url: '/gdpi/gdpi-planner',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function () {
            $('#listloader').show();
        },
        complete: function () {
            $('#listloader').hide();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) { 
            if (data === "session_logout") {
                window.location.reload(true);
            } else if (data === "permission_denied") {
                window.location = "/permissions/error";
            } else {
                if (data.indexOf("text-danger") === -1) {
                    $("#mygdpiHeading").show();
                }
                $("#gdpiProcessPlanner #mainData").html(data); 
                $("#gdpiProcessPlanner .modal-body").removeClass('text-center').addClass('text-left');
                $("#gdpiProcessPlanner #tableBlock").css('overflow', 'auto');
                $("#gdpiProcessPlanner #tableBlock").css('max-height', '350px');
				
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    }); 
}

function loadChosen() {
    if ($('.chosen-select').length > 0) {
        $('.chosen-select').chosen();
        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        $('.chosen-select').trigger('chosen:updated');
    }
}

function getGdpiPlanProccess() {    
    //$("input[name='process_type']").removeAttr('checked');
    $("#reset_gdpi_plan").hide();    
    $("#mygdpiHeading").hide();
    var data = $('#gd_pi_form_id').serializeArray();
    $.ajax({
        url: '/gdpi/plan-gdpi-process',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function () {
            $('#listloader').show();
        },
        complete: function () {
            $('#listloader').hide();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $("#secondStep").html("");
            $("#fourthStep").html('');
            showHideTab('secondStep');
            if (data === "session_logout") {
                window.location.reload(true);
            } else if (data === "permission_denied") {
                window.location = "/permissions/error";
            } else {
                if (data.indexOf("text-danger") === -1) {
                    $("#mygdpiHeading").show();
                }
                $("#secondStep").html(data);
                $('#secondStep #application_stage').SumoSelect({placeholder: 'Post Application Stage', search: true, searchText:'Select Post Application Stage', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });                
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

}

function ajaxGdpiPlan() {
    $("#tableBlock").html("");

    $("#reset_gdpi_plan").hide();
    var data = $('#gd_pi_form_id').serializeArray();
    $.ajax({
        url: '/gdpi/ajax-gdpi-plan',
        type: 'post',
        dataType: 'html',
        data: data,
        async: false,
        beforeSend: function () {
            $('#listloader').show();
        },
        complete: function () {
            $('#listloader').hide();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if (data === "session_logout") {
                window.location.reload(true);
            } else {
                $("#tableBlock").html(data);
                $("#tableBlock .editMode").css('display', 'inline-block');
                $("#tableBlock .viewMode").hide();
                $("#reset_gdpi_plan").show();
                $("#edit_gdpi_plan").hide();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

}

function showHideTab(activeTab) {
    $("#firstStep").hide();
    $("#secondStep").hide();
    $("#thirdStep").hide();
    $("#fourthStep").hide();
    $("#" + activeTab).show();
}

function changeTableField(value,can_edit) {
    if(can_edit==0){
        return;
    }
    
    $("#tableBlock").show();
    $(".error").html("");
    $(".editMode").css('display', 'inline-block');
    $("#reset_gdpi_plan").show();
    $(".viewMode").hide();
    $("label.viewMode").html('');
    if (value === 'day') {

        $("#fourthHeader").html('Total Number of Panels');
        $("#fifthHeader").html('Days the Process will run');
        $('.fourthRow ').each(function () {
            var objName = this.name;
            objName = objName.replace('day_count', 'panel_count');
            var objId = this.id;
            objId = objId.replace('day_count', 'panel_count');
            $(this).attr('name', objName);
            $(this).attr('id', objId);
            $(this).val('');

            var spanObjName = $(this).parent().nextAll('span:first').attr('id');
            spanObjName = spanObjName.replace('day_count', 'panel_count');
            $(this).parent().nextAll('span:first').attr('id', spanObjName);
        });
        $('.fifthRow').each(function () {
            var objName = this.name;
            objName = objName.replace('panel_count', 'day_count');
            var objId = this.id;
            objId = objId.replace('panel_count', 'day_count');
            $(this).attr('name', objName);
            $(this).attr('id', objId);
            $(this).val('');
        });

    } else {

        $("#fourthHeader").html('Days the Process will run');
        $("#fifthHeader").html('Total Number of Panels');
        $('.fourthRow ').each(function () {
            var objName = this.name;
            objName = objName.replace('panel_count', 'day_count');
            var objId = this.id;
            objId = objId.replace('panel_count', 'day_count');
            $(this).attr('name', objName);
            $(this).attr('id', objId);
            $(this).val('');

            var spanObjName = $(this).parent().nextAll('span:first').attr('id');
            spanObjName = spanObjName.replace('panel_count', 'day_count');
            $(this).parent().nextAll('span:first').attr('id', spanObjName);
        });
        $('.fifthRow ').each(function () {
            var objName = this.name;
            objName = objName.replace('day_count', 'panel_count');
            var objId = this.id;
            objId = objId.replace('day_count', 'panel_count');
            $(this).attr('name', objName);
            $(this).attr('id', objId);
            $(this).val('');
        });
    }

}

function saveGdpiPlan(reset_type) {
    editGdpiPlan();
    $(".error").html("");
    if (typeof reset_type == 'undefined') {
        reset_type = '';
    }
    var opted_count = 0;
    var panel_capacity = 0;
    var panel_count = 0;
    var day_count = 0;
    var venue_id = 0;
    var error_flag = 0;
    var process_type = $("input[name='process_type']:checked").val();
   
    if (process_type === undefined) {
        $("#process_type_span").html("Please select calculation method");
        return false;
    }
    $(".allVenue").each(function () {
        venue_id = this.id;
        opted_count = $("#opted_count_" + venue_id).val();
        panel_capacity = $("#panel_capacity_" + venue_id).val();
        panel_count = $("#panel_count_" + venue_id).val();
        day_count = $("#day_count_" + venue_id).val();
        $("#panel_capacity_" + venue_id).parent().next('label').html(panel_capacity);
        $("#panel_count_" + venue_id).parent().next('label').html(panel_count);
        $("#day_count_" + venue_id).parent().next('label').html(day_count);
//        alert(panel_capacity+"=========="+panel_count+"=========="+day_count);
        if (opted_count != '0' && opted_count != '') {
            if (opted_count == '') {
                opted_count = 0;
            }
            if (panel_capacity == '0' || panel_capacity == '') {
                error_flag = 1;
                $("#panel_capacity_span_" + venue_id).html("Please enter per panel capacity");
            }
            if (process_type == 'day' && (panel_count == '0' || panel_count == '')) {
                error_flag = 1;
                $("#panel_count_span_" + venue_id).html("Please enter panel count");
            }
            if (process_type == 'panel' && (day_count == '0' || day_count == '')) {
                error_flag = 1;
                $("#day_count_span_" + venue_id).html("Please enter day count");
            }

            if (error_flag !== 1) {
                var secondfactor = 0;
                if (process_type == 'panel') {
                    secondfactor = parseInt(day_count);
                } else {
                    secondfactor = parseInt(panel_count);
                }
                var result = parseInt(opted_count) / (parseInt(panel_capacity) * secondfactor);
                var cielResult = Math.ceil(result);
                var calculatedString = '';
                if (cielResult == result) {
                    calculatedString = result;
                } else {
                    calculatedString = "" + cielResult + " (" + result.toFixed(2) + ")";
                }
                if (process_type == 'panel') {
                    $("#panel_count_" + venue_id).val(result);
                    $("#panel_count_" + venue_id).next('label').html(calculatedString);
                } else {
                    $("#day_count_" + venue_id).val(result);
                    $("#day_count_" + venue_id).next('label').html(calculatedString);
                }
            }
        }

    });

    if (error_flag === 1) {
        return false;
    } else {
        $('#ConfirmMsgBody').html('Are you sure you want to update GD-PI plan summary?');
        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
                .one('click', '#confirmYes', function (e) {
                    e.preventDefault();
                    submitGdpiPlan(reset_type);
                    $('#ConfirmPopupArea').modal('hide');
                });

    }

}

function submitGdpiPlan(reset_type) {
    var data = $('#gd_pi_form_id').serializeArray();
    $.ajax({
        url: '/gdpi/save-gdpi-plan',
        type: 'post',
        dataType: 'json',
        data: data,
        beforeSend: function () {
            $('#listloader').show();
        },
        complete: function () {
            $('#listloader').hide();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if (json['redirect']) {
                location = json['redirect'];
            } else if (json['error']) {
                alertPopup(json['error'], 'error');
            } else if (json['data_error'] !== undefined) {
                for (var key in json['data_error']) {
                    $("#" + key).html(json['data_error'][key]);
                }
            } else if (json['status'] === 'success') {
                $(".editMode").hide();
                $(".viewMode").show();
                $("#reset_gdpi_plan").hide();
                $('#updated_on').html("Last Updated on : " + json['date']);
                alertPopup('Plan saved sucessfully', 'sucess');
                if (reset_type == 'thirdstep') {
                    $("#thirdTab a").trigger('click');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function editGdpiPlan() {
    $(".editMode").css('display', 'inline-block');
    $(".viewMode").hide();
    $("#reset_gdpi_plan").show();
}

function editGdpiPlanner() {
    $(".plannerEditMode").css('display', 'inline-block');
    $(".plannerViewMode").hide();  
}

var actionType;
function saveScheduleGdpi(actionType) {
    var data = $('#gd_pi_form_id').serializeArray();
    $.ajax({
        url: '/gdpi/saveScheduleGdpi',
        type: 'post',
        dataType: 'json',
        data: data,
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if (json['redirect'])
            {
                location = json['redirect'];
            } else if (json['error'])
            {
                alertPopup(json['error'], 'error');
            } else if (json['required']) {
                $(".errorMessage").html('');
                for (var key in json['required']) {
                    $("." + key).html('');
                    $("." + key).html(json['required'][key]);
                    $('html,body').animate({
                        scrollTop: $("." + key).offset().top - 200},
                            'slow');
                    var mcid = key.split("_");
                    if (typeof mcid[1] != 'undefined') {
                        $("#collapsePayment" + mcid[1] + " a.collapsed").trigger('click');
                    }
                }
            } else if (typeof json['status'] != 'undefined' && json['status'] == 200) {
                $('#listloader').hide();
                alertPopup(json['message'], 'success');
                if (typeof actionType != 'undefined' && actionType == 'next') {
                    $("#fourthTab a").trigger('click');
                }
                $(".errorMessage").html(' ');
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


function getSlot(vid, mcid) {

    $.ajax({
        url: '/gdpi/get-gdpi-slot',
        type: 'post',
        dataType: 'html',
        data: {'address': vid, 'mcid': mcid},
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            var responseObject = $.parseJSON(json);
            if (responseObject.message === 'session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if (responseObject.status == 1) {

                if (typeof responseObject.data === "object") {
                    var html = '';
                    html += '<div class="input select">';
                    var key = '';
                    for (key in responseObject.data) {
                        for (var childkey in responseObject.data[key]) {
                            html += '<label><input name="schedule[' + key + '][slot][]" value="' + childkey + '"  id="schedule-' + key + '-slot-' + childkey + '" type="checkbox">' + responseObject.data[key][childkey] + '</label>';
                        }
                    }
                    html += '</div>';
                    $("#slot" + key).html(html);
                }
            } else {
                //console.log(responseObject.message);
                alertPopup(responseObject.message, 'error');
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


var getAllocation   = function () {
    var data = $('#gd_pi_form_id').serializeArray();
    $("#mygdpiHeading").hide();
    $.ajax({
        url: '/gdpi/allot-venue',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            showHideTab('fourthStep');
            if (data == "session") {
                window.location.reload(true);
            } else if (data == "permission_denied") {
                window.location = "/permissions/error";
            } else {
                $("#firstStep").html("");
                $("#thirdStep").html('');
                $("#secondStep").html('');
                $("#fourthStep").html(data);
                if (data.indexOf("err-msg") === -1) {
                    $("#mygdpiHeading").show();
                }
            }
            loadChosen();
            LoadReportDatepicker();
            $('.datepicker_config_gdpi').datetimepicker({format: 'DD-MM-YYYY HH:mm'});          
//            $('.datepicker_gdpi').datetimepicker().on('dp.show',function(){
//                $(this).data('DateTimePicker').minDate(new Date());
//            });
            checkParentConfig();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
        }
    });
}

function checkParentConfig(){
    $("#venue-address").change(function () {
        if($(this).is(':checked')==true){
            $("#venue-city").prop('checked', this.checked);
        }
       if($(this).is(':checked')==false){
            $("#gdpi-date").prop('checked', false);
            $("#gdpi-time-slot").prop('checked', false);
       }
    });
    $("#gdpi-date").change(function () {
        if($(this).is(':checked')==true){
            $("#venue-city").prop('checked', this.checked);
            $("#venue-address").prop('checked', this.checked);
        }
       if($(this).is(':checked')==false){
            $("#gdpi-time-slot").prop('checked', false);
       }
    });
    $("#gdpi-time-slot").change(function () {
        if($(this).is(':checked')==true){
            $("#venue-city").prop('checked', this.checked);
            $("#venue-address").prop('checked', this.checked);
            $("#gdpi-date").prop('checked', this.checked);
        }
    });
    
    $("#venue-city").change(function () {
        if($("#venue-city").is(":checked")==false){
            $("#venue-address").prop('checked', false);
            $("#gdpi-date").prop('checked', this.checked);
            $("#gdpi-time-slot").prop('checked', this.checked);
        }
    });
    

}

function allocateVenue() {
    var $form = $("#gd_pi_form_id");
    $form.attr("action",'/gdpi/allocate');
    $form.attr("target",'modalIframe');
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    //$('#myModal').modal('show');
    $form.submit();
    $form.attr("onsubmit",onsubmit_attr);
    $form.removeAttr("target");
}

//on change get list of day wise date
function getAllocatedDate(e, container) {
    //college_id
    //form_id
    //mcid
    var college_id = $('#college_id').val();
    var form_id = $('#form_id').val();
    $.ajax({
        url: '/gdpi/get-allocated-date',
        type: 'post',
        dataType: 'json',
        data: {'college_id': college_id, "form_id": form_id, 'mcid': e},
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if (data == "session") {
                window.location.reload(true);
            }
            if (container == 'location_date') {
                $(".allocated_details").html("<table class='table table-striped list_data'><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>Please select city and date for GD-PI allocation summary</h4></div></div> </td></tr><tr></tr></tbody></table>");
            } else {
                $(".re_allocated_details").html("<table class='table table-striped list_data'><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>Please select city and date for GD-PI re-allocation summary</h4></div></div> </td></tr><tr></tr></tbody></table>");
            }
            if (data.status == 1) {
                $("#" + container).html(data.data);
            } else {
                alertPopup(data['message'], 'error');
            }
            loadChosen();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
        }
    });
}


    function saveGdpiAllocationConfig(){
        if(typeof CKEDITOR.instances.editor !='undefined'){
            CKEDITOR.instances.editor.updateElement();
        }
        var data = $('#gd_pi_form_id').serializeArray();
        $.ajax({
            url: '/gdpi/save-gdpi-allocation-config',
            type: 'post',
            dataType: 'json',
            data: data,
            beforeSend: function (xhr) {
                $('#listloader').show();
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (json) {
                if (json['message']=="session_logout")
                {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else if(json['status']==true){
                    alertPopup(json['message'],'success');
                }else {
                    alertPopup(json['message'], 'error');
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
    

function toggleIcon(e) {
    $(e.target)
            .prev('.panel-heading')
            .find(".more-less")
            .toggleClass('glyphicon-plus glyphicon-minus');
}

//on date select get details of allocation details in tabular view
function onChangeGetAllocatedDetails(d) {
    var college_id = $('#college_id').val();
    var form_id = $('#form_id').val();
    var location_city = $('#location_city').val();
    $.ajax({
        url: '/gdpi/get-allocated-details',
        type: 'post',
        dataType: 'html',
        data: {'college_id': college_id, "form_id": form_id, 'mcid': location_city, 'date': d},
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if (data === "session") {
                window.location.reload(true);
            }

            $(".allocated_details").html(data);

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
        }
    });
}


//To get reallocation detail (live data after changes)
function getReAllocatedDetails(date) {
    $("#re_allocation_city_span").html("");
    $("#re_allocation_date_span").html("");
    var college_id = $('#college_id').val();
    var form_id = $('#form_id').val();
    var location_city = $('#re_allocation_city').val();
    if (location_city == '0' || location_city == '') {
        $("#re_allocation_city_span").html("Please select city");
        return false;
    }
    if (date == '0') {
        $("#re_allocation_date_span").html("Please select date");
        return false;
    }
    var city_name = $('#re_allocation_city :selected').text();
    $.ajax({
        url: '/gdpi/get-re-allocated-details',
        type: 'post',
        dataType: 'html',
        data: {'college_id': college_id, "form_id": form_id, 'city_key': location_city, 'city_name': city_name, 'date': date},
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if (data === "session") {
                window.location.reload(true);
            }

            $(".re_allocated_details").html(data);

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
        }
    });
}

//To get reallocation detail (live data after changes)
function purgeReAllocateGDPI() {
    $('#ConfirmMsgBody').html('Are you sure you want to reallocate GD-PI?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
    .one('click', '#confirmYes', function (e) {
        e.preventDefault();
        var college_id = $('#college_id').val();
        var form_id = $('#form_id').val();        
        $.ajax({
            url: '/gdpi/purge-reallocate-gdpi',
            type: 'post',
            dataType: 'json',
            data: {'college_id': college_id, "form_id": form_id},
            beforeSend: function (xhr) {
                $('#listloader').show();
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {                
                if (typeof data.redirect !=='undefined' && data.redirect === "session_logout") {
                    window.location.reload(true);
                }
                
                if (typeof data.success !=='undefined' && data.success === 200) {
                    alertPopup('Total ' + data.record_update + ' record(s) updated.', 'success');
                    //Load the section again so edit button will display
                    getGdpiPlanProccess();
                }
                
                if (typeof data.error !=='undefined' && data.error !='') {
                    alertPopup('There is some error!.', 'error');
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
                
    
}
