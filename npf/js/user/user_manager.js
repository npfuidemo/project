//Create/Edit user
$(document).ready(function () {
    if($("#FilterUserManager").length>0){
        $('#college_id').SumoSelect({placeholder: 'Select Institute', search: true, searchText:'Search Institute', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
        $('#roles').SumoSelect({placeholder: 'User Role', search: true, searchText:'User Role', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
        $('#internal_roles').SumoSelect({placeholder: 'User Role', search: true, searchText:'User Role', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
       // $('select#college_id')[0].sumo.reload();
        var NPFUserManagerPage = 0;
        $('#internal-roles').addClass('hide');
        //getUserManagerList('reset');
        LoadReportDateRangepicker();

        if(typeof jsVars.openPopup!='undefined' && jsVars.openPopup==true){
            displayAssignedLimit(jsVars.sCollegeId);
        }
        PopupBatchBind();
    }
    $('#search-username').keypress(function (e) {
        var key = e.which;
        if(key == 13)  // the enter key code
         {
            getUserManagerList('reset');
            return false;
         }
    });

    $('.user-tabuler-data').on('click', function () {
        var container_id = $(this).attr('id');
        if (container_id == 'table-view-college' || container_id == 'table-view-internal') {
            if(container_id == 'table-view-college'){
                hide_container_id = 'table-view-internal';
                $('#internal-roles').addClass('hide');
                $('#college-roles').removeClass('hide');
                $('#type').val(0);
            }else{
                hide_container_id = 'table-view-college';
                $('#college-roles').addClass('hide');
                $('#internal-roles').removeClass('hide');
                $('#type').val(1);
            }
            $('.dm-new').remove();
            $(".showforList").show();
            $('#snapshot-view').removeClass('active');
            $('#snapshot-view').parent().removeClass('active');
            $('#'+hide_container_id).parent().removeClass('active');
            $('#'+container_id).addClass('active');
            $('#'+container_id).parent().addClass('active');
            $('#table-data-view').show();
            $('#snapshot-data-view').hide();
            $('.collpase2-mob, .itemsCount').show();
            $('#table-data-view, #LoadMoreArea').show();
            $('#search-username').val('');
            $('#status').val(0);
            $('#status').trigger('chosen:updated');
            $('#created_on').val('');
            $('#publisher_id').val(0);
            $('#publisher_id').trigger('chosen:updated');
            $('#internal_roles').val(0);
            $('#internal_roles')[0].sumo.reload();
            $('#roles').val(0);
            $('#roles')[0].sumo.reload();
            $('#searchBtnreset, #search_btn, #search-username').attr('disabled',false);
            $("#graphReponseDiv").hide();
            getUserManagerList('reset');
        }else if (container_id == 'snapshot-view') {
            if($("#college_id").val()!=''){
                $("#snapshot-view").show();
                $(".showforList").hide();
                $(this).addClass('active');
                $(this).parent().addClass('active');
                $('#table-view').removeClass('active');
                $('#table-view').parent().removeClass('active');
                $('#table-data-view, #LoadMoreArea').hide();
                $('#snapshot-data-view').show();
                $('#searchBtnreset, #search_btn, #search-username').attr('disabled',true);
                $('.collpase2-mob, .itemsCount').hide();

                google.charts.load("current", {packages: ["corechart"]});
                google.charts.setOnLoadCallback(function(){
                    getUserGraphData();
                });
            }else{
                alertPopupAssignedInstitute("Please Select College.", "error");
            }
        }
    });
});

function PopupBatchBind(){

    $('.modalButton').on('click', function(e) {
        var $form = $("#FilterUserManager");

        $form.attr("action",'/users/ajax-user-manager');
        $form.attr("target",'modalIframe');
        $form.append($("<input>").attr({"value":"export", "name":"export",'type':"hidden","id":"export"}));
        var onsubmit_attr = $form.attr("onsubmit");
        $form.removeAttr("onsubmit");
        $form.submit();
        $form.attr("onsubmit",onsubmit_attr);
        $form.find('input[name="export"]').val("");
        $form.removeAttr("target");
    });
    $('#myModal').on('hidden.bs.modal', function(){
        $("#modalIframe").html("");
        $("#modalIframe").attr("src", "");
    });
}

$('.columnApplicationCheckAll').on('click', function (e) {
    $(this).toggleClass('checked');
    if ($(this).hasClass('checked')) {
        $('#column_li_list input:checkbox:not(:disabled)').prop('checked', true);
    } else {
        $('#column_li_list input:checkbox:not(:disabled)').prop('checked', false);
    }
});

function getUserManagerList(type){
    if (type == 'reset') {
        NPFUserManagerPage = 0;
        //$('#load_more_results').closest('div').removeClass('table-border');
		$('#parent').hide();
        $('.if_record_exists').hide();
        $('#load_more_results').html("");
        $('#load_more_results_msg').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
    }
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').hide();
    //$('.dm-new').remove();
    var data = $('#FilterUserManager').serializeArray();
    data.push({name: "page", value: NPFUserManagerPage});
    $.ajax({
        url: '/users/ajax-user-manager',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function () {
           $('#searchBtnreset, #search_btn, #search-username').attr('disabled',true);
           $('#parent').css('min-height', '50px');
           showLoader();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
			//$("html, body").animate({ scrollTop: $(document).height() - 300 }, "slow");
            $('#parent').css('min-height', 'auto');
            $('#table-data-view').show();
            NPFUserManagerPage = NPFUserManagerPage + 1;
            if(data=='session_logout'){
                window.location.reload(true);
            }else if(data=='invalid_request_csrf'){
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;Load more users");
                $('#load_more_button').hide();
                $('.if_record_exists').hide();
                //$('#load_more_results').html('<h4 class="text-center text-danger"></h4>');
				$('#load_msg_div').show();
				$('#load_msg').text('Invalid Request.');
            }else if(data=='no_record_found'){
                $('#load_more_button').html("Load More Leads");
                $('#load_more_button').hide();
                if(NPFUserManagerPage==1){
                    //$('#load_more_results').html('<h4 class="text-center text-danger">No Record Found</h4>');
					$('#load_msg_div').show();
                    $('#load_msg').text('No Record Found');
                    $('#load_more_button').hide();
                }else{
                    $('#load_more_results_msg').html('<small class="text-danger">No More Record</small>');
                    //$('#load_more_results > tbody > tr > td').css('background-color', '#fffae7');
					$('#load_msg_div').hide();
					//$('#load_msg').text('No More Record');
                }
            }else{
                data = data.replace("<head/>", '');
                $('#parent').show();
                $('#noRecord').remove();
				if(NPFUserManagerPage==1){
                    $('#load_more_results').append(data);
				}else{
					//var tableScroll = $('.newTableStyle').scrollTop() - 40;
					//alert(tableScroll);
					//var loadMorePos = jQuery('.newTableStyle').height() + tableScroll;
					//alert(loadMorePos);
					jQuery('#load_more_results > tbody').append(data);
					//$('#load_more_results > tbody > tr > td').css('background-color', '#fffae7');
					//setTimeout(function () {
						//$('#load_more_results > tbody > tr >td').css('background-color', 'transparent');
					//}, 2000);
					//jQuery('#load_more_results > tbody')
					//jQuery(".newTableStyle").animate({ scrollTop: loadMorePos}, "slow");
				}
				//$('#load_more_results').closest('div').addClass('table-border');
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;Load More Users");
                $('.if_record_exists').fadeIn();
                var itemCount = $('#totalRecords strong').html();
                if(itemCount < 10){
                    $('#load_more_button').fadeOut();
                }else{
                    $('#load_more_button').fadeIn();
                }
                $('#load_msg_div').hide();
				dropdownMenuPlacement();
				table_fix_rowcol();
				//tableHeight();
				$('.offCanvasModal').modal('hide');
				$('[data-toggle="tooltip"]').tooltip();
				//determineDropDirection();
            }
            /*if(NPFUserManagerPage==1 && $("#college_id").val()!=''){
                google.charts.load("current", {packages: ["corechart"]});
                google.charts.setOnLoadCallback(function(){
                    getUserGraphData();
                });
            }*/
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //window.location.reload(true);
        },
        complete: function () {
            $('#searchBtnreset, #search_btn, #search-username').attr('disabled',false);
            hideLoader();
        }
    });
}

function displayAssignedInstitute(user_id){
    var html = $('#user_assigned_institute_'+user_id).html();
    $('#displayAssignedInstitute').html(html);
    //alertPopupAssignedInstitute(html, "success");
    //$('#alertTitle').html('Assigned Institutes List');
}

function displayAssignedPublishers(user_id){
    var html = $('#user_assigned_publishers_'+user_id).html();
    //alert(html);
    $('#displayPublishers').html(html);

    //alertPopupAssignedInstitute(html, "success");
    //$('#alertTitle').html('Assigned Publishers List');
}

function alertPopupAssignedInstitute(msg, type, location) {

    if (type == 'error') {
        var selector_parent = '#ErrorPopupArea';
        var selector_titleID = '#ErroralertTitle';
        var selector_msg = '#ErrorMsgBody';
        var btn = '#ErrorOkBtn';
        var title_msg = 'Error';
    }
    else if (type == 'notification') {
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

function displayPublisherPackages(userId){
    $('#alertTitle').html('Publisher Packages');
    $('#MsgBody').html("Please wait...");
    $('.oktick').hide();
    $('#SuccessPopupArea').modal();
    $.ajax({
        url: '/users/getPublisherPackages',
        type: 'post',
        data: {'userId' : userId},
        dataType: 'html',
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $('#userProfileLoader').show();
        },
        complete: function () {
            $('#userProfileLoader').hide();
        },
        success: function (response) {
            var html = 'No package Assigned.';
            var responseObject = $.parseJSON(response);
            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                if(typeof responseObject.data === "object" && responseObject.data.length>0){
                    html    = '<table style="width:80%;border-collapse: collapse;margin-left:10%;">';
                    html    += '<tr><th style="width:70%;">College</th><th style="width:30%;">Package</th></tr>';

                    for(var i in responseObject.data){
                        html    += '<tr><td style="width:70%;text-align: left">'+responseObject.data[i]['college']+'</td><td style="width:30%;text-align: left;">'+responseObject.data[i]['package']+'</td></tr>';
                        ;
                    }
                    html    += '</table>';
                }
            }else{
                console.log(responseObject.message);
            }
            $('#MsgBody').html(html);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

}

function getUserGraphData(){
    var data = $('#FilterUserManager').serializeArray();
    $.ajax({
        url: '/users/getUserGraphData',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function () {
			$('#parent').css('min-height', '50px');
            showLoader();
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (response) {
            $("#graphReponseDiv").hide();
            $(".graphContainerClass").hide();
            $('#parent').css('min-height', '0');
            var responseObject = $.parseJSON(response);
            if (typeof responseObject['data'].userLimitGraph != 'undefined') {
                $(".chatDiv").show().addClass('fadeInUp');
                $(".chatDiv").show(function () {
                    //$("html, body").animate({scrollTop: 300}, "slow");
                });
                if (responseObject['g_type'] == 'Total') {
                    $('#graphDiv42 div h4').html('Role Wise');
                    $.each(responseObject['data'].userLimitGraph, function (index, item) {
                        $("#graphDiv" + index).show();
                        drawStageBarChart(item, 'barchart_material' + index);
                    });
                }else if (responseObject['g_type'] == 'not_found') {
                    $("#graphReponseDiv").show();
                    $("#graphReponseDiv").html('<div class="no-record-list"><div class="noDataFoundDiv"><div class="innerHtml"><img src="/img/no-record.png" alt="no-record"><span>Users Limit Configuration not set.</span></div></div></div>');
                }else {
                    $.each(responseObject['data'].userLimitGraph, function (index, item) {
                        $("#graphDiv" + index).show();
                        drawStageBarChart(item, 'barchart_material' + index);
                    });
                }
            } else {
                $(".chatDiv").hide();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError);
        },
        complete: function () {
            hideLoader();
        }
    });
}

function drawStageBarChart(graphData, graphContainer) {
    if(typeof graphData === "object"){
        if ($.isEmptyObject(graphData)) {
            $('#'+graphContainer).html('<p class="text-center noDataFound">No Data Available.</p>');
        } else {
            var data = new google.visualization.arrayToDataTable(graphData);
             // find max for all columns to set top vAxis number
            var maxVaxis = 0;
            for (var i = 1; i < data.getNumberOfColumns(); i++) {
              if (data.getColumnType(i) === 'number') {
                maxVaxis = Math.max(maxVaxis, data.getColumnRange(i).max);
              }
            }

			var heightChart = 120;
			if(graphContainer=='barchart_materialtotal2' || graphContainer=='barchart_material42'){
				var heightChart = 200;
			}

            var options = {
                title:'',
                legend: { position: 'none' },
                bars: 'vertical',
				fontSize: 13,
                vAxis: {format: 'decimal',minValue:0,maxValue: maxVaxis + maxVaxis/6,},
                height: heightChart,
                width : '100%',
				backgroundColor: 'transparent',
                'chartArea': {'width': '80%', 'top':'10%', 'left': '15%', 'height': '80%'},
                colors: ['#00b0f0','#ffc000', '#92d050'],
                annotations: { alwaysOutside: true, textStyle: { color:'#111',fontSize:12,}},
                series: {
                    0: { annotations: { stem: { length: 20 } }  },
                    1: { annotations: { stem: { length: 2  } }  },
                    2: { annotations: { stem: { length: 20 } }  }
                }
              };

           var chart = new google.visualization.BarChart(document.getElementById(graphContainer));
           google.visualization.events.addListener(chart, 'ready', AddNamespaceHandler);
           chart.draw(data, options);
        }
    }
}

function AddNamespaceHandler(id){
  var svg = jQuery('svg');
  svg.attr("xmlns", "http://www.w3.org/2000/svg");
  svg.css('overflow','visible');
}



function uploadMouForm(userId, $this){
    if($('#college_id').val() == ''){
        alertPopupAssignedInstitute('Please select institute.', 'error');
        return false;
    }

    $.ajax({
        url: '/area/uploadMouForm',
        type: 'post',
        data: { userId: userId, collegeId:$('#college_id').val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (html) {
            if(html == 'Invalid'){
                alertPopupAssignedInstitute('Please select institute.', 'error');
            }else{
                $('#add_uplaodmouform_popup').html(html);
                $('#uploadmouformPopUp').trigger('click');
                fileSelectShow();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function saveUploadMouForm(){
    var form = $('#addUploadMouForm')[0];
    var formData = new FormData(form);
    $('.upload_mou-error').html();
    if($('.upload_moufile').val() != ''){
        $.ajax({
            url: $(form).attr("action"),
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function (json) {
                if(json['status'] != 'success'){
                    $('.upload_mou-error').html(json['status']);
                } else {
                    var successMessage = '';
                    if(json['deleted'] == 'deleted'){
                        successMessage = '<p class="text-center" style="color:green">File deleted successfully!</p>';
                    }
                    if(json['uploaded'] == 'success'){
                        successMessage = successMessage + '<p class="text-center" style="color:green">File uploaded successfully!</p>';
                    }
                    $('#add_uplaodmouform_popup .modal-body').html(successMessage);
                }
            },
            cache: false,
            contentType: false,
            processData: false
        });
    } else {
        $('.upload_mou-error').html('Field is required!');
    }
}

$(document).ready(function () {
    // We can attach the `fileselect` event to all file inputs on the page
    if($('#FilterUserManager').length != 0){
        $(document).on('change', ':file', function () {
            var input = $(this),
                numFiles = input.get(0).files ? input.get(0).files.length : 1,
                label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
                input.trigger('fileselect', [numFiles, label]);
        });
    }
});

/****this function added for only file type fieds*****/
function fileSelectShow(){
      $(':file').on('fileselect', function(event, numFiles, label) {

          var input = $(this).parents('.input-group').find(':text'),
              log = numFiles > 1 ? numFiles + ' files selected' : label;

          if( input.length ) {
              input.val(log);
          } else {
              if( log ) alert(log);
          }
      });
}

function remove_upload_mou_saved($this){
    if($this != 'mou'){
        $('.mou-remove-first').hide();
        $('.confirm-remove-mou').show();
    } else {
        $('#moualreadyupload').val(0);
        var form = $('#addUploadMouForm')[0];
        var formData = new FormData(form);
        $.ajax({
            url: $(form).attr("action"),
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function (json) {
                if(json['status'] != 'success'){
                    $('.upload_mou-error').html(json['status']);
                } else {
                    if(json['deleted'] == 'deleted'){
                        $('.confirm-remove-mou').hide();
                        $('.saved-uploaded').hide();
                        $('.mou-upload-container').show();
                    }
                }
            },
            cache: false,
            contentType: false,
            processData: false
        });
    }

}

function filterApplication(element,listid) {
    //alert(listid);
    var value = $(element).val();
    value = value.toLowerCase();
    $("ul#"+listid+"  li ul li").each(function() {
        if ($(this).text().toLowerCase().search(value) > -1) {
//            $(this).text(src_str);
            $(this).show();
            $("ul#"+listid+"  li").addClass('active');
        }
        else {
            $(this).hide();
        }
    });
}

$('.filter_collapse').dropdown('toggle');
$('.filterCollasp').unbind('click');
$('.filterCollasp').bind('click', function (e) {
    if ($(this).parent().hasClass('active')) {
        $('.filterCollasp').parent().removeClass('active');
    } else {
        $('.filterCollasp').parent().removeClass('active');
        $(this).parent().addClass('active');
    }
    e.preventDefault();
});

$('#createUser').on('shown.bs.modal', function(){
    $('#emailError').addClass('hide');
    $('#collegeError').addClass('hide');
    $('#roleError').addClass('hide');
    $('#invite_institute').val(0);
    $('#invite_institute').SumoSelect({placeholder: 'Select Institute', search: true, searchText:'Search Institute', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
    if($('#table-view-internal').parent('li').hasClass('active')){
        $('.invite-internal-roles').removeClass('hide');
        $('.invite-college-roles').addClass('hide');
        $('#invite_institute').attr('multiple','multiple');
        $('#invite-inst-div').addClass('hide');
    }else{
       $('.invite-college-roles').removeClass('hide');
       $('.invite-internal-roles').addClass('hide');
       $('#invite_institute').removeAttr('multiple','multiple');
       $('#invite-inst-div').removeClass('hide');
    }
    $('#invite_institute')[0].sumo.reload();

    $('#invite_email').val('');
    $("#role_invited").val('');
    $('#role_invited').trigger('chosen:updated');
});

$('.role_invited').on('change',function(){
    getAssignedInstitues();
});

$('#invite_email').on('blur',function(){
    getAssignedInstitues();
});

function getAssignedInstitues(){
    if(!$('#table-view-internal').parent('li').hasClass('active')){
        return;
    }
    var role = $("#internal_role_invited").val();
    var email = $("#invite_email").val();
    if(email == ''){
        return;
    }
    $.ajax({
        url: '/users/get-entity-assigned-inst',
        type: 'post',
        data: {email:email,role:role},
        dataType: 'json',
        beforeSend: function () {
            showLoader();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            if(json['status']==200){
                if(typeof json['collegeList'] === "object"){;
                    $('#invite_institute').val(json['collegeList']);
                    $('#invite_institute')[0].sumo.reload();
                }
                $('#invite-inst-div').removeClass('hide');
            }else if(json['status']==0 && typeof json['error'] != 'undefined' && json['error'] == 'session_logout'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError);
        },
        complete: function () {
            hideLoader();
        }
    });
}

$("#invite").click(function(){
    $('#emailError').addClass('hide');
    $('#collegeError').addClass('hide');
    $('#roleError').addClass('hide');
    if($('#table-view-internal').parent('li').hasClass('active')){
        var role = $("#internal_role_invited").val();
    }else{
        var role = $("#college_role_invited").val();
    }
    var email = $("#invite_email").val();
    if(email.trim() == ''){
        $('#emailError').removeClass('hide');
        $('#emailError').html('Please enter email address');
        return;
    }
    var college = $("#invite_institute").val();
    console.log(college);
    if(college == 0 || college == '' || college ==  null){
        $('#collegeError').removeClass('hide');
        $('#collegeError').html('Please select Institute.');
        return;
    }
    $.ajax({
        url: '/users/invite-user',
        type: 'post',
        data: {email:email,role:role,college:college},
        dataType: 'json',
        beforeSend: function () {
            showLoader();
            $('#invite').attr('disabled',true);
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (json) {
            if(json['error'] != 'undefine' && json['error'] && json['error']['email'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if(json['status'] == 0 && json['error'] != 'undefined' ){
                $.each(json['error'],function(index,val){
                    $('#'+index+'Error').removeClass('hide');
                    $('#'+index+'Error').html(val);
                })
                $('#invite').attr('disabled',false);
            } else if(json['status'] == 1 && json['url'] != 'undefined') {
                $('#emailError').addClass('hide');
                $('#collegeError').addClass('hide');
                $('#roleError').addClass('hide');
                window.location.href = json['url'];
            }else{
                alertPopupAssignedInstitute('Something went Wrong. Please refresh page and try again','error');
                $('#invite').attr('disabled',false);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError);
        },
        complete: function () {
            hideLoader();
        }
    });

})