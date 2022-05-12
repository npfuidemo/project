$(document).ready(function () {
    $('.group_form_fields_option').SumoSelect({placeholder: 'Listing Fields', search: true, searchText: 'Listing Fields', selectAll: false, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false});
    $(this).SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true});
    
    if(typeof jsVars.page!='undefined'){
        if(jsVars.page=='setting') {
            $("#scoringfieldsettings-tab").trigger('click');
        }
        if(jsVars.page=='addi') {
            $("#additionalsettings-tab").trigger('click');
        }
        if(jsVars.page=='basic') {
            $("#basicsettings-tab").trigger('click');
        }
        
        if(jsVars.page=='manage_scorecard') {
            $("#manage-scorecard-tab").trigger('click');
        }
    }
    
    $("#basicsettings-tab").on('click',function(){
        window.history.replaceState(null, null, "?page");
    });
    
    $("#scoreCardbtn").on('click',function(){
         $("#newScoreCard").css("display","block");
         $("#newScoreField").css("display",'none');
    });
    $("#scoreFieldbtn").on('click',function(){
         $("#newScoreCard").css("display","none");
         $("#newScoreField").css("display",'block');
    })
    
});


 $("#additionalsettings-tab").on('click',function(e) {
    $('#additionalsettings').html('');
    $.ajax({
    url: jsVars.additionaSetting,
    type: 'post',
    dataType: 'html',
    data: {"type":'get_page'},
    headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
    beforeSend: function () {
            $('.loader-block').show();
        },
    complete: function () {
            $('.loader-block').hide();
        },
    success: function (data) {
        if(data=="session"){
            window.location.reload(true);
        }else if(data == "invaid_req"){
               window.location.replace(jsVars.FULL_URL+'/post-applications/'); 
        }else{
            $('#additionalsettings').html(data);
        }
        window.history.replaceState(null, null, "?page=addi");
        viewEditApplication();
    },
    error: function (xhr, ajaxOptions, thrownError) {
    //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
    }
    });
 });

function getscoringfields(type) {
    if(typeof type=='undefined'){
        type='';
    }
    $.ajax({
        url: jsVars.createscoringfields,
        type: 'post',
        dataType: 'html',
        data: {"type": "get_page"},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $('.loader-block').show();
        },
        complete: function () {
            
        },
        success: function (data) {
            if (data == "session") {
                window.location.reload(true);
            } else {
                $('#scoringfieldform').html(data);
                $('#fieldtoselected').val(type);
                $('.loader-block').hide();
                $('#scoringfieldfilter').modal();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function saveScorePanel(url) {
    $('.error').text('');
    var ifConnected = window.navigator.onLine;
    if(!ifConnected){
        alertPopup("Connection Error !", 'error');
        return false;
    }
       
    var data = $("form#basicSetting").serializeArray();
    $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (data['message'] == "session") {
                window.location.reload(true);
            }else if(data['message'] == "invaid_req"){
               window.location.replace(jsVars.FULL_URL+'/post-applications/'); 
            }else if (data['status'] == 0) {
                for (var i in data['data']) {
                    $(".error_" + i).text(data['data'][i]);
                    //$(".error_" + i).scrollTop(0);
                }
                
                if(i=='name'){
                    $(window).scrollTop(0);
                }else if(i=='help_text'){
                    $(window).scrollTop(0);
                }else{
                    var bar = i.split('_');
                    var index = Number(bar[2])+1;
                    if(bar[1]=='headings'){
                        $('html, body').animate({
                            scrollTop: $('.accordianContainerDoc'+index).parents('div').offset().top
                        }, 10);
                    }else{
                        $('html, body').animate({
                            scrollTop: $('.accordianContainer'+index).parents('div').offset().top
                        }, 10);
                    }
                }
            } else if (data['status'] == 1) {
                alertPopup(data['message'], 'success');
                if(data['data']!=''){
                    setTimeout(function(){ window.location = data['data']; }, 3000);
                }else{
                    $("#scoringfieldsettings-tab").trigger('click');
                }
            } else {
                //handle error
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function scoringfieldsettingsBack() {
    $("#scoringfieldsettings-tab").trigger('click');
}

function basicsettingsBack(){
    $("#basicsettings-tab").trigger('click');
}

function mangescorecardBack(){
    $("#manage-scorecard-tab").trigger('click');
}

function saveScorefieldsSetting(url,type) {
    
    if(typeof type=='undefined'){
        type='';
    }
    
    var ifConnected = window.navigator.onLine;
    if(!ifConnected){
        alertPopup("Connection Error !", 'error');
        return false;
    }
    var emptycheck=0;
//    console.log($("form#scoringFieldSetting").find('.group_form_fields_option'));
    $("form#scoringFieldSetting").find('.group_form_fields_option').each(function(){
            var evValue = $(this).val();
            if(typeof evValue != 'undefined' && evValue!=''){
                emptycheck++;
            }
    });
    if(emptycheck==0){
        $('.error_evaluation_form_fields').text("Atleast one Scoring Field should be parked for Evaluation");
        return false;
    }    
    var data = $("form#scoringFieldSetting").serializeArray();
    $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (data['message'] == "session") {
                window.location.reload(true);
            }else if(data['message'] == "invaid_req"){
               window.location.replace(jsVars.FULL_URL+'/post-applications/'); 
            }else if (data['status'] == 0) {
                if(type!="onScoreFieldCreation"){
                    for (var i in data['data']) {
                        $(".error_" + i).text(data['data'][i]);
                    }
                    if(data['data']=='' && data['message']!="undefined"){
                        $("#scoringfield_error").text(data['message']);
                    }
                    $(window).scrollTop(0);
                }
            } else if (data['status'] == 1) {
                if(type=="onScoreFieldCreation"){
                    //$("#scoringfieldsettings-tab").trigger('click');
                        $("#updateCalValue").val("1");
                        $("#updateShowHideValue").val("1");    
                        alertPopup(data['message'], 'success');
                }else if(type=="enablerequired" || type=="updatecalculate" || type=="showhidefield"){
                    if(type=="enablerequired"){
                        $("#updateReqValue").val("1");
                        alertPopup(data['message'], 'success'); 
                    }else if(type=="updatecalculate"){
                        $("#updateCalValue").val("1");
                        alertPopup(data['message'], 'success'); 
                    }else if(type=="showhidefield"){
                        $("#updateShowHideValue").val("1");
                        alertPopup(data['message'], 'success');
                    }
                }else{
                        alertPopup(data['message'], 'success');
                        $("#additionalsettings-tab").trigger('click');
                }
                //scoringfieldsettings();
                $("#additionalsettings-tab").parent().removeClass('disabled');
            }else{
                //handle error
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function saveScoreAdditionalSetting(url,type,redirect) {
    if(typeof redirect == 'undefined') {
        redirect = '';
    }
    var ifConnected = window.navigator.onLine;
    if(!ifConnected){
        alertPopup("Connection Error !", 'error');
        return false;
    }
    var data = $("form#scoringAdditionalSetting").serializeArray();
    $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            console.log(data);
            if(data['message']=="session"){
                window.location.reload(true);
            }else if(data['message'] == "invaid_req"){
               window.location.replace(jsVars.FULL_URL+'/post-applications/'); 
            }else if(data['status']==0){
                for (var i in data['data']) {
                    $(".error_"+i).text(data['data'][i]);
                }
                if(data['data']=='' && data['message']!="undefined"){
                    $("#additionalfield_error").text(data['message']);
                    $(window).scrollTop(0);
                }
            }else if(data['status']==1){
                alertPopup(data['message'], 'success');
                if(type=='savecreate'){
                    setTimeout(function(){ window.location = redirect; }, 3000);
                }else{
                    setTimeout(function(){ window.location = redirect; }, 3000);
                    //$("#manage-scorecard-tab").trigger("click");
                }
            }else{
                
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/*$(".add").on('click', function(event){
 var stgClone = $(this).closest('.row').clone(true);
 jQuery(stgClone).find('.CaptionCont,.optWrapper').remove();
 
 jQuery(stgClone).find('select').val('');
 jQuery(stgClone).find('input').val('');
 
 var headcount = jQuery(stgClone).find('.count_stage').length;
 var headsubcount = 0//jQuery(stgClone).find('.count_sub_stage').length;
 jQuery(stgClone).find('select').SumoSelect({placeholder: 'Listing Fields', search: true, searchText:'Listing Fields', selectAll : false, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
 
 jQuery(stgClone).find('select').attr('name', 'application_form_fields['+ headcount +']['+headsubcount+'][]');
 jQuery(stgClone).find('.dataTarget').attr('data-target', '#headingap'+headcount+1);
 jQuery(stgClone).find('.dataTarget').attr('aria-controls', 'headingap'+headcount+1);
 jQuery(stgClone).find('.collapse_and_drag').attr('id', 'headingap'+headcount+1);
 jQuery(stgClone).find('.count_stage').text(parseInt(headcount)+parseInt("1"));
 $(this).closest('.row').after(stgClone);
 //jQuery('.'+div_class).append(stgClone);
 
 $(".group_form_fields_option option").attr('disabled',false);
 $(".group_form_fields_option").each(function(){
 if($(this).val()!=null){
 if($(this).val().length){
 $("."+$(this).val()+":not(:selected)").attr('disabled',true);
 }
 }
 });
 //$('.group_form_fields_option').trigger("chosen:updated");
 $('.group_form_fields_option')[0].sumo.reload();
 
 });*/



function alertPopup(msg, type, location) {
    var selector_parent, selector_titleID, selector_msg, title_msg, btn;
    if (type == 'error') {
        selector_parent = '#ErrorPopupArea';
        selector_titleID = '#ErroralertTitle';
        selector_msg = '#ErrorMsgBody';
        btn = '#ErrorOkBtn';
        title_msg = 'Error';
    } else {
        selector_parent = '#SuccessPopupArea';
        selector_titleID = '#alertTitle';
        selector_msg = '#MsgBody';
        btn = '#OkBtn';
        title_msg = 'Notification';
    }

    $(selector_titleID).html(title_msg);
    $(selector_msg).html(msg);
    //$('.oktick').hide();
    //$('#SuccessPopupArea button.npf-close,#SuccessPopupArea  a.npf-close').hide();
    if (typeof location != 'undefined') {
        $(btn).show();

        $(selector_parent).modal({keyboard: false}).one('click', btn, function (e) {
            e.preventDefault();
            window.location.href = location;
        });
    } else {
        $(selector_parent).modal();
    }
}

/*$(".actionbtn_addlayout").on('click',function(){
 var val_id=$(this).attr('data-id');
 $("#addlayout #ref_id").val(val_id);
 });*/

function getColumnValue(context, url) {
    var val_id = $(context).attr('data-id');
    var subcount = $("#" + val_id).find('.max_subcount').val();
    $("#ref_id").val(val_id + "$" + subcount);
    $("#ref_url").val(url);
}
function removeRow(context, type) {
    
    var name_sel = '';
    if (typeof type == "undefined") {
        return false;
    } else if (type == 'ap') {
        name_sel = 'application_form_fields';
    } else if (type == 'group') {
        name_sel = 'group_form_fields';
    } else if (type == 'doc') {
        name_sel = 'application_form_file';
    } else if (type == 'eval') {
        name_sel = 'evaluation_form_fields';
    } else if (type == 'ifCond') {
        name_sel = 'add_rule[show_hide][select_value]';
    }
    
    if(type == 'ifCond' || type == 'ifCondReq'){
        remove_row_condition(context, type, name_sel)
    }else{
        remove_row(context, type, name_sel);
    }
    

    return false;
}
function remove_row_condition(context, type, name_sel){
    $('#ConfirmMsgBody').html('Do you want to delete ?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();
                var id = "#" + $(context).siblings().attr('data-id');
                var logic_count=id.split('_')[2];
                var block_count=id.split('_')[3];
                $($("#" + $(context).siblings().attr('data-id')).find('.max_subcount')).val(($("#" + $(context).siblings().attr('data-id')).find('.max_subcount').val() - 1));
                $(context).closest('.form-group1').remove();
                //console.log(jQuery(id).find('.form-group1'));
                var stage_count = 1;
                //var head_count = Number(jQuery(id).siblings('.row').find('.count_stage').text()) - 1;
                jQuery(id).find('.form-group1').each(function () {
                    //alert(stage_count);
                    //console.log(jQuery(this).find('.rule_if').attr('onchange'));
                    if(type=='ifCondReq'){
                        jQuery(this).find('.if_sel_value_req').attr('name', 'add_rule[required_fields]['+logic_count+']['+block_count+'][select_value][' + (Number(stage_count) - 1) + ']');
                        removeClass = jQuery(this).find('.selectValueDivClass').attr("class").match(/[\w-]*criteria[\w-]*/g);
                        jQuery(this).find('.selectValueDivClass').removeClass(removeClass);
                        jQuery(this).find('.selectValueDivClass').addClass('criteria-calculate-field-req-' + (Number(stage_count) - 1));
                        jQuery(this).find('.rule_if_req').attr('onchange', 'buildScoringAutomationCreateInputRequired(this,' + (Number(stage_count) - 1) + ',"",'+logic_count+','+block_count+',"")');
                        jQuery(this).find('.rule_if_req').attr('name', 'add_rule[required_fields]['+logic_count+']['+block_count+'][select_if]' + '[' + (Number(stage_count) - 1) + ']');
                        jQuery(this).find('.sel_expression_req').attr('name', 'add_rule[required_fields]['+logic_count+']['+block_count+'][select_expression]' + '[' + (Number(stage_count) - 1) + ']');
                        removeClass=jQuery(this).find('.sel_expression_req').parent().parent().attr('class').match(/[\w-]*condition-expression[\w-]*/g);
                        jQuery(this).find('.sel_expression_req').parent().parent().removeClass(removeClass);
                        jQuery(this).find('.sel_expression_req').parent().parent().addClass('condition-expression-field-' + (Number(stage_count) - 1));
                        
                    }else if(type=='ifCond'){
                        jQuery(this).find('.if_sel_value').attr('name', 'add_rule[show_hide]['+logic_count+']['+block_count+'][select_value][' + (Number(stage_count) - 1) + ']');
                        removeClass = jQuery(this).find('.selectValueDivClass').attr("class").match(/[\w-]*criteria[\w-]*/g);
                        jQuery(this).find('.selectValueDivClass').removeClass(removeClass);
                        jQuery(this).find('.selectValueDivClass').addClass('criteria-calculate-field-' + (Number(stage_count) - 1));
                        jQuery(this).find('.rule_if').attr('onchange', 'buildScoringAutomationCreateInput(this,' + (Number(stage_count) - 1) + ',"",'+logic_count+','+block_count+',"")');
                        jQuery(this).find('.rule_if').attr('name', 'add_rule[show_hide]['+logic_count+']['+block_count+'][select_if]' + '[' + (Number(stage_count) - 1) + ']');
                        jQuery(this).find('.sel_expression').attr('name', 'add_rule[show_hide]['+logic_count+']['+block_count+'][select_expression]' + '[' + (Number(stage_count) - 1) + ']');
                        removeClass=jQuery(this).find('.sel_expression').parent().parent().attr('class').match(/[\w-]*condition-expression[\w-]*/g);
                        jQuery(this).find('.sel_expression').parent().parent().removeClass(removeClass);
                        jQuery(this).find('.sel_expression').parent().parent().addClass('condition-expression-field-' + (Number(stage_count) - 1));
                        
                    }
                    stage_count++;
                });
        
        
        
         $('#ConfirmPopupArea').modal('hide');
    });
    
}
function remove_row(context, type,name_sel) {
    $('#ConfirmMsgBody').html('Do you want to delete ?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();
                var id = "#" + $(context).siblings().attr('data-id');
                $($("#" + $(context).siblings().attr('data-id')).find('.max_subcount')).val(($("#" + $(context).siblings().attr('data-id')).find('.max_subcount').val() - 1));
                $(context).closest('.row.form-group').remove();
                var stage_count = 1;
                var head_count = Number(jQuery(id).siblings('.row').find('.count_stage').text()) - 1;
                //alert(id);
                jQuery(id).find('.row.form-group').each(function () {
                    //alert(jQuery(this).find('.count_sub_stage'));
                    jQuery(this).find('.count_sub_stage').html(stage_count);
                    if (type == 'eval') {
                        jQuery(this).find('.dataTarget').attr('data-target', '#helptextfield' + stage_count);
                        jQuery(this).find('.collapse').attr('id', 'helptextfield' + stage_count);
                    }
                    if(type=='ifCondCalc'){
                        var parent_index=id.split('updatecalc_if_')[1];
                        jQuery(this).find('.if_sel_value').attr('name', 'add_rule[update_calculate]['+parent_index+'][select_value][' + (Number(stage_count) - 1) + ']');
                        removeClass=jQuery(this).find('.selectValueDivClass').attr("class").match(/[\w-]*criteria[\w-]*/g);
                        jQuery(this).find('.selectValueDivClass').removeClass(removeClass);
                        jQuery(this).find('.selectValueDivClass').addClass('criteria-calculate-field-calc-'+ (Number(stage_count) - 1) );
                        jQuery(this).find('.rule_if').attr('onchange', 'buildScoringAutomationCreateInputForCalc(this,' + (Number(stage_count) - 1) + ',"",'+parent_index+',"")');
                        jQuery(this).find('.rule_if').attr('name', 'add_rule[update_calculate]['+parent_index+'][select_if]' + '[' + (Number(stage_count) - 1) + ']');
                        jQuery(this).find('.sel_expression').attr('name', 'add_rule[update_calculate]['+parent_index+'][select_expression]' + '[' + (Number(stage_count) - 1) + ']');
                        removeClass=jQuery(this).find('.sel_expression').parent().parent().attr('class').match(/[\w-]*condition-expression[\w-]*/g);
                        jQuery(this).find('.sel_expression').parent().parent().removeClass(removeClass);
                        jQuery(this).find('.sel_expression').parent().parent().addClass('condition-expression-field-cal-' + (Number(stage_count) - 1));
                        
                    }else {
                        jQuery(this).find('.sumo_select').each(function () {
                            if (type == 'group' || type == 'eval') {
                                jQuery(this).attr('name', name_sel + '[' + (Number(stage_count) - 1) + '][]')
                            } else {
                                jQuery(this).attr('name', name_sel + '[' + head_count + '][' + (Number(stage_count) - 1) + '][]')
                            }

                            //alert(head_count);
                        });
                    }
                    stage_count++;
                });
                $('#ConfirmPopupArea').modal('hide');
            });
}

function addNewRow(context) {
    $(context).closest(".actionbtn").removeClass("open");
    var ref_id = $("#ref_id").val();
    var column_count = $(context).val();
    var id = ref_id.split("$")[0];
    var url = $("#ref_url").val();
    $.ajax({
        url: jsVars.FULL_URL + url,
        type: 'post',
        dataType: 'html',
        data: {ref_id: ref_id, column_count: column_count},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (data == "session_logout") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else {
                $("#" + id).append(data);
                $(".sumo_select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true});
                makeSortable();
                $("#" + id).find(".form-group").addClass('ui-sortable-handle');
                $("#" + id).find('.max_subcount').val(Number(ref_id.split("$")[1]) + 1);
                //$("#addlayout").modal('hide');
                // console.log(data);
            }
        }});
}

function addmoreHeadings(head, url, type = '') {
//    $(head).attr("disabled", 'disabled');
    if(typeof type =='undefined'){
        type='';
    }
    if(type=='logic'){
        var updateCalValue = $("#updateCalValue").val();
        if(updateCalValue==0){ 
            alertPopup("Previous logic is not saved",'error');
            return false
        }else{
            $('#updateCalValue').val('0');
        }
        var head_count = $("#updatecalculate").find('.max_stage_count').val();
        var getExpressionDivIdCount = head_count-1;
        var sel_expression_value = $('.sel_expression').closest("#updatecalc_if_"+getExpressionDivIdCount).find("select.sel_expression").val();
        if(sel_expression_value=="" || typeof sel_expression_value == 'undefined' || sel_expression_value==null){
            alertPopup("Previous logic saved without conditions",'error'); 
            return false;
        }
    }else if(type=='showHideLogic'){
        var updateShowHideValue = $("#updateShowHideValue").val();
        if(updateShowHideValue==0){ 
            alertPopup("Previous logic is not saved",'error');
            return false
        }else{
            $('#updateShowHideValue').val('0');
        }
        var head_count = $("#showhidefield").find('.max_stage_count').val();
        var getExpressionDivIdCount = head_count-1;
        var sel_expression_value = $('.sel_expression').closest("#showhide_if_"+getExpressionDivIdCount+"_0  select.sel_expression").val();
        if(sel_expression_value=="" || typeof sel_expression_value == 'undefined' || sel_expression_value==null){
            alertPopup("Previous logic saved without conditions",'error'); 
            return false;
        }
    }else if(type=='mindLogic'){
        var updateReqValue = $("#updateReqValue").val();
        if(updateReqValue==0){ 
            alertPopup("Previous logic is not saved",'error');
            return false
        }else{
            $('#updateReqValue').val('0');
        }
        var head_count = $("#enablerequired").find(".max_stage_count").val();
        var getExpressionDivIdCount = head_count-1;
        var sel_expression_value = $('.sel_expression_req').closest("#req_if_"+getExpressionDivIdCount+"_0  select.sel_expression_req").val();
        if(sel_expression_value == '' || typeof sel_expression_value == 'undefined' || sel_expression_value==null){
            alertPopup("Previous logic saved without conditions",'error'); 
            return false;
        }
    }
    else{
        var head_count = $(head).closest('.box').find('.max_stage_count').val();
    }
    $.ajax({
        url: url,
        type: 'post',
        dataType: 'html',
        data: {type: type, head: head_count},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (data == "session_logout") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else {
                if(type=='logic'){
                    $("#updatecalculate").find('.panel-group').append(data);
                    $("#updatecalculate").find('.max_stage_count').val(Number(head_count) + 1);
                }else if(type=='showHideLogic'){
                    $("#showhidefield").find('.panel-group').append(data);
                    $("#showhidefield").find('.max_stage_count').val(Number(head_count) + 1);
                }else if(type=='mindLogic'){
                    $("#enablerequired").find('.panel-group').append(data);
                    $("#enablerequired").find('.max_stage_count').val(Number(head_count) + 1);
                }else{
                    $(head).closest('.box').append(data);
                    $(head).closest('.box').find('.max_stage_count').val(Number(head_count) + 1);
                    $(head).css('visibility','hidden');
                    makeSortable();
                    $(head).removeAttr("disabled");
                }
                
                $(".sumo_select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true});
           }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

}

function removeheading(context) {
    var temp_ele=jQuery(context).closest('.box');
    var ele=$(context).closest('.row');
    $('#ConfirmMsgBody').html('Do you want to delete ?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();
                ele.remove();
                var count_stage = 1;
                //for(var i=0; )
                temp_ele.find('.max_stage_count').val((Number(temp_ele.find('.max_stage_count').val()) - 1));
                var curr_count=temp_ele.find('.max_stage_count').val();
                temp_ele.find('.headBox').each(function (index) {
                    var id = jQuery(this).find('.collapse_and_drag').attr('id');
                    var name_sel = '';
                    var heading_name='';
                    var error_class='';
                    if (id.split('headingdoc').length > 1) {
                        id = 'headingdoc';
                        name_sel = 'application_form_file';
                        heading_name='doc_headings';
                        error_class='error text-danger error_doc_headings_'+(Number(count_stage)-1);
                    } else {
                        id = 'headingap';
                        name_sel = 'application_form_fields';
                        heading_name='group_name';
                        error_class='error text-danger error_group_name_'+(Number(count_stage)-1);
                    }
                    jQuery(this).find('.heading_in').attr('name', heading_name+'['+(Number(count_stage)-1)+'][]');
                    jQuery(this).find('.error.text-danger').attr("class",error_class);
                    jQuery(this).find('.dataTarget').attr('data-target', '#' + id + +count_stage);
                    jQuery(this).find('.dataTarget').attr('aria-controls', id + count_stage);
                    jQuery(this).find('.collapse_and_drag').attr('id', id + count_stage);
                    jQuery(this).find('.actionbtn').children('.text-primary').attr('data-id', id + count_stage);
                    if(curr_count==count_stage){
                      jQuery(this).find('.addnew_btn').css('visibility','visible');
                      jQuery(this).find('.addnew_btn').removeAttr('disabled');
                    }
                    $(this).find('.count_stage').text(count_stage);
                    var sub_stage_count = 1;
                    $(this).find('.form-group').each(function () {
                        jQuery(this).find('.sumo_select').each(function () {
                            //alert(count_stage);
                            jQuery(this).attr('name', name_sel + '[' + (Number(count_stage) - 1) + '][' + (Number(sub_stage_count) - 1) + '][]')

                        });
                        sub_stage_count++;
                    });


                    count_stage++;

                });

                $('#ConfirmPopupArea').modal('hide');
            });
}

function makeSortable() {
    $(function () {
        $(".sortablecolumn").sortable();
        $(".sortablecolumn").disableSelection();
    });

    $(function () {
        $(".collapse_and_drag").sortable();
        $(".collapse_and_drag").disableSelection();
    });
}

function scoringfieldsettings(type) {
    if(typeof type =='undefined'){
        type='';
    }
    $("#scoringfieldsettings").html('');
    if($("#scoringfieldsettings-tab").parent().hasClass('disabled')){
       $("#scoringfieldsettings-tab").parent().removeClass('disabled');
    }
    $.ajax({
        url: jsVars.scoringfieldsSetting,
        type: 'post',
        dataType: 'html',
        data: {"type": 'get_page'},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
        },
        success: function (data) {
            if (data == "session") {
                window.location.reload(true);
            }else if(data == "invaid_req"){
               window.location.replace(jsVars.FULL_URL+'/post-applications/'); 
            }
            
            $("#scoringfieldsettings").html(data);
            if(type=='delete_calc'){
                $("#showhidefield").removeClass('in');
                $("#updatecalculate").addClass("in");
                $("#updateCalValue").val("1");
                $('#rules a[data-toggle="collapse"]').focus();
            }else if(type=='delete_req'){
                $("#showhidefield").removeClass('in');
                $("#enablerequired").addClass("in");
                $("#updateReqValue").val("1");
                $('#rules a[data-toggle="collapse"]').focus();
                //console.log("A");
            }else if(type=='delete_showhide'){
                $("#showhidefield").addClass('in');
                $("#updateShowHideValue").val("1");
                $('#rules a[data-toggle="collapse"]').focus();
            }
            $(".sumo_select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true});
            $("#req_multi_check").SumoSelect({placeholder: 'Select Scoring Fields',search: true, searchText: 'Select Scoring Fields',csvDispCount:3});
            makeSortable();
            window.history.replaceState(null, null, "?page=setting");
            $('.logic_acc').on('show.bs.collapse', function (e) {
                $(e.target).parent().find('.show_logic').toggleClass('hide_logic');
                
            });
            $('.logic_acc').on('hidden.bs.collapse', function (e) {
                $(e.target).parent().find('.show_logic').toggleClass('hide_logic');
                
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function showHideBoxByExpression(elem) {
    var formObj = $(elem).closest("form");
    var attributeName = $(elem).attr('name');
    var fields_name = attributeName.replace(/select_expression/gi, "select_value");
    if($(formObj).find("[name='" + fields_name + "']").prop("tagName")=="SELECT"){
        $(formObj).find("[name='" + fields_name + "']").parent().show();
    }else{
        $(formObj).find("[name='" + fields_name + "']").show();
    }    
    switch ($(elem).val()) {
        case 'is_empty':
        case 'is_not_empty':
            if($(formObj).find("[name='" + fields_name + "']").prop("tagName")=="SELECT"){
                $(formObj).find("[name='" + fields_name + "']").val('');
                $(formObj).find("[name='" + fields_name + "']").parent().hide();
            }else{
                $(formObj).find("[name='" + fields_name + "']").val('');
                $(formObj).find("[name='" + fields_name + "']").hide();
            }            
            break;
    }
}

function buildScoringAutomationCreateInput(currentObj, i, selectedValue,parent,block,selectScource) {
    var element = $(currentObj).find('option:selected');
    var labelname = $(element).text();
    var InputId = 'var InputId' //$(currentObj).attr('id');
    var key_source = $(element).attr('data-source');
    var value_field = element.val();
    if (typeof value_field == 'undefined') {
        return false;
    }
    var arr = value_field.split("||");
    var html = '';
    var type = "";
    var class_date = '';
    var field_name = 'add_rule[show_hide]['+parent+']['+block+'][select_value][' + i + ']';
    var selValue = '';
    if (typeof selectedValue !== 'undefined') {
        selValue = selectedValue;
    }
    if (arr.length > 2) {
        var type = arr[1];
        var val_json = arr[2];
        var html_field_id = '';
        // for not break ajax on created by, ID CreatedBySelect
        if (arr[0].match(/created_by/i)) {
            html_field_id = 'CreatedBySelect';
        } else if (arr[0].match(/UD\|city_id/i)) {
            html_field_id = 'registerCityID';
        } else {
            html_field_id = arr[0];
        }

        var sls = false;
        if (type == "dropdown" || type == "predefined_dropdown") {
            html = "<select data-key_source=" + InputId + " class='sumo_select if_sel_value' name='" + field_name + "' id='" + html_field_id + "'>";
            html += "<option value='' >Select Value</option>";
            
            obj_json = JSON.parse(val_json);
            for (var key in obj_json) {
                if(type == "predefined_dropdown") {
                    var prfixDropdownKey = key + ';;;' + obj_json[key];
                } else {
                var prfixDropdownKey = key;
                }
                var prfixDropdownVal = obj_json[key];
                var selected = '';
                if (selValue == prfixDropdownKey) {
                    selected = 'selected=selected';
                }
                html += "<option value=\"" + prfixDropdownKey + "\" " + selected + ">" + prfixDropdownVal + "</option>";
            }
            html += "</select>";
        } else if (type == "date") {
            if(selValue=='0'){
                selValue = '';
            }
            var operator_sel = $(currentObj).val();
            class_date = " datepicker_report";
            html = "<input type='text' data-key_source=" + InputId + "  class='form-control if_sel_value" + class_date + "' name='" + field_name + "' value='" + selValue + "' placeholder='" + labelname + "' id='" + html_field_id + "'>";

        } else {
            html = "<input type='text' data-key_source=" + InputId + "  class='form-control if_sel_value' name='" + field_name + "' value='" + selValue + "' placeholder='" + labelname + "' id='" + html_field_id + "'>";
        }
    } else {
        html = "<input type='text' data-key_source=" + InputId + " class='form-control if_sel_value' name='" + field_name + "' value='" + selValue + "' placeholder='" + labelname + "'>";
    }

    var multi_class = '';
    if (sls) {
        multi_class = 'multiSelectBox';
    }
    $("#showhide_if_"+parent+'_'+block).find('.criteria-calculate-field-' + i).html(html);

    if (type == "date") {
        LoadReportDatepicker();
        LoadReportDateRangepicker();
    }

    if (sls) {
        $('#s_lead_status').multiselect({
            numberDisplayed: 2
        });
    }
    
    $(".sumo_select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true});
    //key_source
    var condoionhtml = '<select name="add_rule[show_hide]['+parent+']['+block+'][select_expression]['+i+']" class="sumo_select sel_expression" onchange="return showHideBoxByExpression(this);">';
    condoionhtml += "<option value='' >Select Condition</option>";
    if(typeof key_source!='undefined'){
        var cinditional_obj_json = JSON.parse(key_source);
        for (var key in cinditional_obj_json) {
            var prfixDropdownKey = key;
            var prfixDropdownVal = cinditional_obj_json[key];
            var selected = '';
            if (selectScource == prfixDropdownKey) {
                selected = 'selected=selected';
            }
            condoionhtml += "<option value=\"" + prfixDropdownKey + "\" " + selected + ">" + prfixDropdownVal + "</option>";
        }
        condoionhtml += "</select>";
        
        $("#showhide_if_"+parent+'_'+block).find(".condition-expression-field-"+i).html(condoionhtml);
        if(selectScource!=''){
           showHideBoxByExpression($("#showhide_if_"+parent+'_'+block).find(".condition-expression-field-"+i).children());
        }
    }else{
        condoionhtml += "</select>";
        $("#showhide_if_"+parent+'_'+block).find(".condition-expression-field-"+i).html(condoionhtml);
    }
    $(".sumo_select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true});
}

function buildScoringAutomationCreateInputForCalc(currentObj, i, selectedValue,parent, selectScource) {
    var element = $(currentObj).find('option:selected');
    var labelname = $(element).text();
    var InputId = 'var InputId' //$(currentObj).attr('id');
    var key_source = $(element).attr('data-source');
    var value_field = element.val();
    if (typeof value_field == 'undefined') {
        return false;
    }
    var arr = value_field.split("||");
    var html = '';
    var type = "";
    var class_date = '';
    var field_name = 'add_rule[update_calculate]['+parent+'][select_value][' + i + ']';
    var selValue = '';
    if (typeof selectedValue !== 'undefined') {
        selValue = selectedValue;
    }
    if (arr.length > 2) {
        var type = arr[1];
        var val_json = arr[2];
        var html_field_id = '';
        // for not break ajax on created by, ID CreatedBySelect
        if (arr[0].match(/created_by/i)) {
            html_field_id = 'CreatedBySelect';
        } else if (arr[0].match(/UD\|city_id/i)) {
            html_field_id = 'registerCityID';
        } else {
            html_field_id = arr[0];
        }

        var sls = false;
        if (type == "dropdown" || type == "predefined_dropdown") {
            html = "<select data-key_source=" + InputId + " class='sumo_select if_sel_value' name='" + field_name + "' id='" + html_field_id + "'>";
            html += "<option value='' >Select Value</option>";
            obj_json = JSON.parse(val_json);
            for (var key in obj_json) {
                if(type == "predefined_dropdown") {
                    var prfixDropdownKey = key + ';;;' + obj_json[key];
                } else {
                var prfixDropdownKey = key;
                }
                var prfixDropdownVal = obj_json[key];
                var selected = '';
                if (selValue == prfixDropdownKey) {
                    selected = 'selected=selected';
                }
                html += "<option value=\"" + prfixDropdownKey + "\" " + selected + ">" + prfixDropdownVal + "</option>";
            }
            html += "</select>";
        } else if (type == "date") {

            var operator_sel = $(currentObj).val();
            class_date = " datepicker_report";
            html = "<input type='text' data-key_source=" + InputId + "  class='form-control if_sel_value" + class_date + "' name='" + field_name + "' value='" + selValue + "' placeholder='" + labelname + "' id='" + html_field_id + "'>";

        } else {
            html = "<input type='text' data-key_source=" + InputId + "  class='form-control if_sel_value' name='" + field_name + "' value='" + selValue + "' placeholder='" + labelname + "' id='" + html_field_id + "'>";
        }
    } else {
        html = "<input type='text' data-key_source=" + InputId + " class='form-control if_sel_value' name='" + field_name + "' value='" + selValue + "' placeholder='" + labelname + "'>";
    }

    var multi_class = '';
    if (sls) {
        multi_class = 'multiSelectBox';
    }
    //alert(parent);
    $("#updatecalc_if_"+parent).find('.criteria-calculate-field-calc-' + i).html(html);

    if (type == "date") {
        LoadReportDatepicker();
        LoadReportDateRangepicker();
    }

    if (sls) {
        $('#s_lead_status').multiselect({
            numberDisplayed: 2
        });
    }
    $(".sumo_select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true});
    //key_source
    if(typeof key_source!='undefined'){
        var condoionhtml = '<select name="add_rule[update_calculate]['+parent+'][select_expression]['+i+']" class="sumo_select sel_expression" onchange="return showHideBoxByExpression(this);">';
        condoionhtml += "<option value='' >Select Condition</option>";
        var cinditional_obj_json = JSON.parse(key_source);
        for (var key in cinditional_obj_json) {
            var prfixDropdownKey = key;
            var prfixDropdownVal = cinditional_obj_json[key];
            var selected = '';
            if (selectScource == prfixDropdownKey) {
                selected = 'selected=selected';
            }
            condoionhtml += "<option value=\"" + prfixDropdownKey + "\" " + selected + ">" + prfixDropdownVal + "</option>";
        }
        condoionhtml += "</select>";
        //alert(condoionhtml);
        $("#updatecalc_if_"+parent).find(".condition-expression-field-cal-"+i).html(condoionhtml);
        if(selectScource!=''){
         showHideBoxByExpression($("#updatecalc_if_"+parent).find(".condition-expression-field-cal-"+i).children());
        }
    }
    $(".sumo_select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true});
}

function addNewCondition(context, url) {

    var ref_id = $(context).attr('data-id');
    var con_count = $("#" + ref_id).find('.max_subcount').val();
    //var id = ref_id.split("$")[0];
    console.log(con_count+ref_id);
    //var url = $("#addlayout #ref_url").val();
    $(context).parent('.actionbtn').css('pointer-events', 'none');
    $.ajax({
        url: jsVars.FULL_URL + url,
        type: 'post',
        dataType: 'html',
        data: {ref_id: ref_id, con_count: con_count},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (data == "session_logout") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else {
                $("#" + ref_id).append(data);
                $(".sumo_select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true});
                //makeSortable();
                //$("#" + ref_id).find(".form-group").addClass('ui-sortable-handle');
                $("#" + ref_id).find('.max_subcount').val(Number(con_count) + 1);
                $(context).parent('.actionbtn').removeAttr('style');
                // console.log(data);
            }
        }});
}

function appendToFormula(elem,type,parent){
            
    var rowContainer = ".update_calc_"+parent;
    var cssClass = 'classCharc';
    if(type=="operators"){
        if($.isNumeric($(elem).text()) === true) {
            cssClass = 'classNumber';
        }
        $(rowContainer).find('.summary_textarea').append("<span data-all='operator||"+$(elem).text()+"' class="+cssClass+">"+$(elem).text()+"</span>");
    }
    else{
        if($.isNumeric($(elem).val()) === true) {
            cssClass = 'classNumber';
        }
        var txt=$(rowContainer).find("select.select_fields_for_calc_logic option[value="+$(elem).val()+"]").text();
       
        $(rowContainer).find('.summary_textarea').append("<span data-all='field||"+$(elem).val()+"' classs="+cssClass+">"+txt+"</span>");
        $(rowContainer).find('select.select_fields_for_calc_logic').val('');
    }
     
    if($(rowContainer).find('.summary_textarea span').length >= 1) {
         final_calc_text="";
        
        calc_text=$(rowContainer).find('.summary_textarea span');
        $(calc_text).each(function( index ) {
            //alert($( this ).attr("data-all"));
            if(final_calc_text=="")
                final_calc_text+=$( this ).attr("data-all");
            else 
                final_calc_text+=";;;"+$( this ).attr("data-all");
        });
        
        $(rowContainer).find('.final_calc_text').val(final_calc_text);
    }
}

function  removeFromFormula(elem,parent){
    var rowContainer = ".update_calc_"+parent;//".row-"+i+" ";
    
    $(rowContainer).find(".summary_textarea span:last").remove();
    
    var final_calc_text="";
    var calc_text=$(rowContainer).find('.summary_textarea span');
    var separator = "";
    $(calc_text).each(function( index ) {
        final_calc_text+=separator+$( this ).attr("data-all");
        separator = ';;;';
    });
    $(rowContainer).find('.final_calc_text').val(final_calc_text);
}

function deleteScoringLogic(elem, parent, url) {

    $('#ConfirmMsgBody').html('Do you want to delete ?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {

                //$(elem).closest('.add_block').find('.update_calc_' + parent).remove();
                $(elem).closest('.panel-default').remove();
                var data = $("form#scoringFieldSetting").serializeArray();

                $.ajax({
                    url: jsVars.FULL_URL + url,
                    type: 'post',
                    dataType: 'json',
                    data: data,
                    headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                    beforeSend: function () {
                        $('.loader-block').show();
                    },
                    complete: function () {
                        $('.loader-block').hide();
                    },
                    success: function (data) {
                        if (data['message'] == "session") {
                            window.location.reload(true);
                        } else if (data['status'] == 0) {
                            console.log(data['message']);
                        } else if (data['status'] == 1) {
                            //console.log()
//                            $("#scoringfieldsettings-tab").trigger('click',function(){
//                               console.log($("#showhidefield").attr('class'));
//                                $("#showhidefield").removeClass('in');
//                                $("#updatecalculate").addClass("in");
//                            });
                            //$("#scoringfieldsettings-tab").trigger('click');
                            scoringfieldsettings("delete_calc");
                            
                        } else {
                            console.log(data['message']);
                        }

                        $('#updatecalculate').find('.max_stage_count').val((Number($('#updatecalculate').find('.max_stage_count').val()) - 1));
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    }
                });



                $('#ConfirmPopupArea').modal('hide');
            });
}

function getAddShowBlock(logicid,index,url,type=''){
    console.log(url);
    //var ref_id = $(context).attr('data-id');
   // var con_count = $("#" + ref_id).find('.max_subcount').val();
   $("#addBlockBtnShow-"+logicid).css('display','none');
    if(typeof type =='undefined'){
        type='';
    }
    $.ajax({
        url: jsVars.FULL_URL + url,
        type: 'post',
        dataType: 'html',
        data: {logicid:logicid,index:index},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if (data == "session") {
                window.location.reload(true);
            } else {
                
                if (type == "requiredBlock") {
                    $("#logiccollapseReq_" + logicid).find('.req_block').append(data);
                    $(".sumo_select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true});
                    $("#enablerequired").find("#addReqBtnShow-" + (logicid)).attr('onclick', "getAddShowBlock('" + logicid + "','" + (Number(index) + 1) + "','" + url + "','requiredBlock')");
                
                } else {
                    $("#logiccollapse_" + logicid).find('.show_hide_block').append(data);
                    $(".sumo_select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true});
                    $("#showhidefield").find("#addBlockBtnShow-" + (logicid)).attr('onclick', "getAddShowBlock('" + logicid + "','" + (Number(index) + 1) + "','" + url + "')");
                }
                $("#addBlockBtnShow-"+logicid).css('display','block');
//
//makeSortable();
                //$("#" + ref_id).find(".form-group").addClass('ui-sortable-handle');
                //$("#" + ref_id).find('.max_subcount').val(Number(con_count) + 1);
                // console.log(data);
            }
        }});
    
}

function addmindnewrow(logicid,index,url) {
    $.ajax({
        url: jsVars.FULL_URL + url,
        type: 'post',
        dataType: 'html',
        data: {logicid:logicid,index:index},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
        },
        success: function (data) {
            if (data['message'] == "session") {
                window.location.reload(true);
            } else {
                $(".addblockMindetry-"+logicid).append(data);
                $(".sumo_select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true});
                $("#addBlockBtn-"+(logicid)).attr('onclick',"addmindnewrow('"+logicid+"','"+(Number(index)+1)+"','"+url+"')");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function removeReqLogic(context,logic,url,type){
    
    if(typeof type=='undefined'){
        type='';
    }
    
    $('#ConfirmMsgBody').html('Do you want to delete ?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {

                $(context).closest('.panel-default').remove();

                var data = $("form#scoringFieldSetting").serializeArray();

                $.ajax({
                    url: jsVars.FULL_URL + url,
                    type: 'post',
                    dataType: 'json',
                    data: data,
                    headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                    beforeSend: function () {
                        $('.loader-block').show();
                    },
                    complete: function () {
                        $('.loader-block').hide();
                    },
                    success: function (data) {                        
                        if (data['message'] == "session") {
                            window.location.reload(true);
                        } else if (data['status'] == 0) {
                            console.log(data['message']);
                        } else if (data['status'] == 1) {
                            //console.log()
//                            $("#scoringfieldsettings-tab").trigger('click',function(){
//                               console.log($("#showhidefield").attr('class'));
//                                $("#showhidefield").removeClass('in');
//                                $("#updatecalculate").addClass("in");
//                            });
                            //$("#scoringfieldsettings-tab").trigger('click');
                            if (type == 'delete_showhide') {
                                scoringfieldsettings("delete_showhide");
                            } else {
                                scoringfieldsettings("delete_req");
                            }
                            
                        } else {
                            console.log(data['message']);
                        }

                        $('#updatecalculate').find('.max_stage_count').val((Number($('#updatecalculate').find('.max_stage_count').val()) - 1));
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    }
                });



                $('#ConfirmPopupArea').modal('hide');
            });
}

function removeReqBlock(context,block,url,type=''){
    
    if(typeof type=='undefined'){
        type='';
    }
    
    $('#ConfirmMsgBody').html('Do you want to delete ?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                ref_Cond=$(context).closest('.block_first').prev();
                $(context).closest('.block_first').remove();
                ref_Cond.remove();
                var data = $("form#scoringFieldSetting").serializeArray();

                $.ajax({
                    url: jsVars.FULL_URL + url,
                    type: 'post',
                    dataType: 'json',
                    data: data,
                    headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                    beforeSend: function () {
                        $('.loader-block').show();
                    },
                    complete: function () {
                        $('.loader-block').hide();
                    },
                    success: function (data) {
                        if (data['message'] == "session") {
                            window.location.reload(true);
                        } else if (data['status'] == 0) {
                            console.log(data['message']);
                        } else if (data['status'] == 1) {
                            //console.log()
//                            $("#scoringfieldsettings-tab").trigger('click',function(){
//                               console.log($("#showhidefield").attr('class'));
//                                $("#showhidefield").removeClass('in');
//                                $("#updatecalculate").addClass("in");
//                            });
                            //$("#scoringfieldsettings-tab").trigger('click');
                            if(type=='delete_showhide'){
                                 scoringfieldsettings();
                            }else{
                                scoringfieldsettings("delete_req");
                            }
                            
                            
                        } else {
                            console.log(data['message']);
                        }

                        $('#updatecalculate').find('.max_stage_count').val((Number($('#updatecalculate').find('.max_stage_count').val()) - 1));
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    }
                });



                $('#ConfirmPopupArea').modal('hide');
            });
}


function buildScoringAutomationCreateInputRequired(currentObj, i, selectedValue,parent,block,selectScource) {
    if(typeof block=='undefined') {
        block = 0;
    }
    var element = $(currentObj).find('option:selected');
    var labelname = $(element).text();
    var InputId = 'var InputId' //$(currentObj).attr('id');
    var key_source = $(element).attr('data-source');
    //alert(key_source);
    var value_field = element.val();
    if (typeof value_field == 'undefined') {
        return false;
    }
    var arr = value_field.split("||");
    var html = '';
    var type = "";
    var class_date = '';
    var field_name = 'add_rule[required_fields]['+parent+']['+block+'][select_value][' + i + ']';
    var selValue = '';
    if (typeof selectedValue !== 'undefined') {
        selValue = selectedValue;
    }
    if (arr.length > 2) {
        var type = arr[1];
        var val_json = arr[2];
        var html_field_id = '';
        // for not break ajax on created by, ID CreatedBySelect
        if (arr[0].match(/created_by/i)) {
            html_field_id = 'CreatedBySelect';
        } else if (arr[0].match(/UD\|city_id/i)) {
            html_field_id = 'registerCityID';
        } else {
            html_field_id = arr[0];
        }

        var sls = false;
        if (type == "dropdown" || type == "predefined_dropdown") {
            html = "<select data-key_source=" + InputId + " class='sumo_select if_sel_value_req' name='" + field_name + "' id='" + html_field_id + "'>";
            html += "<option value='' >Select Value</option>";
            obj_json = JSON.parse(val_json);
            for (var key in obj_json) {
                if(type == "predefined_dropdown") {
                    var prfixDropdownKey = key + ';;;' + obj_json[key];
                } else {
                var prfixDropdownKey = key;
                }
                var prfixDropdownVal = obj_json[key];
                var selected = '';
                if (selValue == prfixDropdownKey) {
                    selected = 'selected=selected';
                }
                html += "<option value=\"" + prfixDropdownKey + "\" " + selected + ">" + prfixDropdownVal + "</option>";
            }
            html += "</select>";
        } else if (type == "date") {
            if(selValue=='0'){
                selValue = '';
            }
            var operator_sel = $(currentObj).val();
            class_date = " datepicker_report";
            html = "<input type='text' data-key_source=" + InputId + "  class='form-control if_sel_value_req" + class_date + "' name='" + field_name + "' value='" + selValue + "' placeholder='" + labelname + "' id='" + html_field_id + "'>";

        } else {
            html = "<input type='text' data-key_source=" + InputId + "  class='form-control if_sel_value_req' name='" + field_name + "' value='" + selValue + "' placeholder='" + labelname + "' id='" + html_field_id + "'>";
        }
    } else {
        html = "<input type='text' data-key_source=" + InputId + " class='form-control if_sel_value_req' name='" + field_name + "' value='" + selValue + "' placeholder='" + labelname + "'>";
    }

    var multi_class = '';
    if (sls) {
        multi_class = 'multiSelectBox';
    }
    $("#req_if_"+parent+'_'+block).find('.criteria-calculate-field-req-' + i).html(html);

    if (type == "date") {
        LoadReportDatepicker();
        LoadReportDateRangepicker();
    }

    if (sls) {
        $('#s_lead_status').multiselect({
            numberDisplayed: 2
        });
    }
    
    $(".sumo_select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true});
    //key_source
    var condoionhtml = '<select name="add_rule[required_fields]['+parent+']['+block+'][select_expression]['+i+']" class="sumo_select sel_expression_req" onchange="return showHideBoxByExpression(this);">';
    condoionhtml += "<option value='' >Select Condition</option>";
    if(typeof key_source!='undefined'){
        var cinditional_obj_json = JSON.parse(key_source);
        for (var key in cinditional_obj_json) {
            var prfixDropdownKey = key;
            var prfixDropdownVal = cinditional_obj_json[key];
            var selected = '';
            if (selectScource == prfixDropdownKey) {
                selected = 'selected=selected';
            }
            condoionhtml += "<option value=\"" + prfixDropdownKey + "\" " + selected + ">" + prfixDropdownVal + "</option>";
        }
        condoionhtml += "</select>";
       $("#req_if_"+parent+'_'+block).find(".condition-expression-field-"+i).html(condoionhtml);
       if(selectScource !=""){
           showHideBoxByExpression($("#req_if_"+parent+'_'+block).find(".condition-expression-field-"+i).children());
       }
    }else{
        condoionhtml += "</select>";
        $("#req_if_"+parent+'_'+block).find(".condition-expression-field-"+i).html(condoionhtml);
    }
    $(".sumo_select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true});
}

function getscoringfieldsfromDropdown(context){
    //var ref=context;
    //alert($(context).val());
    var value=$(context).val();
    var selc_class= $(context).attr('id');
    if(value ==''){
        return false;
    }
    if(value=='open_addscorcard_popup'){
        getscoringfields(selc_class);
        $('#content').css('z-index', 'unset');
    }
}

function viewEditApplication(){
    $(document).on('click', 'input[name="check[configuration][view_application]"]', function() {
    if($(this).prop('checked')) {
        $('input[name="check[configuration][edit_application]"]').parents('div').show();
    } else {
        $('input[name="check[configuration][edit_application]"]').prop('checked',false).parents('#editApplicaion').hide();
    }
});
}

function getScorePanelList(type){
    if (type == 'reset') {
        NPFScorePanel = 0;
        $('#load_more_results').closest('div').removeClass('table-border');
        $('.if_record_exists').hide();
        $('#load_more_results').html("");
        $('#load_more_results_msg').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
    }
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').hide();
    var data = $('#FilterScorePanel').serializeArray();
    data.push({name: "page", value: NPFScorePanel});
    var totalRec = $("#items-no-show").val();
    $.ajax({
        url: jsVars.getmanagescoringlisting,
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function () {
           $('#parent').css('min-height', '50px');
           showLoader();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            console.log(data);
            $("#basicsettings").removeClass('active');
            $("#manageScoreCardTab").addClass('active');
            NPFScorePanel = NPFScorePanel + 1;
            if(data=='session_logout'){
                window.location.reload(true);
            }else if(data == "invaid_req"){
               window.location.replace(jsVars.FULL_URL+'/post-applications/'); 
            }else if(data=='invalid_request_csrf'){
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;Load more Scorecard");
                $('#load_more_button').hide();
                $('.if_record_exists').hide();
                $('#load_msg_div').show();
                $('#load_msg').html('Invalid Request.');
            }else if(data=='no_record_found'){
                $('#load_more_button').html("Load More Scorecard");
                $('#load_more_button').hide();
                if(NPFScorePanel==1){
                    $('#load_msg_div').show();
                    $('#load_msg').html('No Scorecard is yet created for this Form, to create the same you can click on the Add new Scorecard Button placed on top of this page.');
                    $('#load_msg').show();
                }else{
                    $('#load_more_results_msg').html('<div class="text-center text-danger">No More Record</div>');
                }
            }else if(data=='select_college'){
                $('#load_more_button').html("");
                $('#load_more_button').hide();
                $('#load_msg_div').show();
                $('#load_msg').html('Please Select Institute.');
                
            }else{
                data = data.replace("<head/>", '');
                $('#load_more_results').append(data);
                $('#load_msg_div').hide();
                var ttl = $('#current_record').val();  
                if(parseInt(ttl) < 10){
                    $('#LoadMoreArea').hide();
                }else if(totalRec>=ttl){
                    $('#LoadMoreArea').hide();
                }else{
                    $('#LoadMoreArea').show();
                }
                $('#load_more_results').closest('div').addClass('table-border');
                $('#load_more_button').removeAttr("disabled");
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;Load More Scorecard");
                $('.if_record_exists').fadeIn();
                $('#load_more_button').fadeIn();
                $('.hide_extraparam').show();
                $('.offCanvasModal').modal('hide');
            }
            dropdownMenuPlacement();
            determineDropDirection();
            window.history.replaceState(null, null, "?page=manage_scorecard");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //window.location.reload(true);
        },
        complete: function () {
            hideLoader();
        }
    });
}

function scoringbesicsettings() {
    $("#basicsettings").html('');
    $.ajax({
        url: jsVars.scoringBasicSetting,
        type: 'post',
        dataType: 'html',
        data: {"type": 'get_page'},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
        },
        success: function (data) {
            if (data == "session") {
                window.location.reload(true);
            }else if(data == "invaid_req"){
               window.location.replace(jsVars.FULL_URL+'/post-applications/'); 
            }
            
            $("#basicsettings").html(data);
//            if(type=='delete_calc'){
//                $("#showhidefield").removeClass('in');
//                $("#updatecalculate").addClass("in");
//            }else if(type=='delete_req'){
//                $("#showhidefield").removeClass('in');
//                $("#enablerequired").addClass("in");
//                console.log("A");
//            }
            $(".sumo_select").SumoSelect({search: true, placeholder: $(this).data('placeholder'), captionFormatAllSelected: "All Selected.", searchText: $(this).data('placeholder'), triggerChangeCombined: true});
            
            $(".headBox").addClass('ui-sortable-handle');
//            $(".dragheading").addClass('ui-sortable');
            
            $(function() {
                $( ".dragheading" ).sortable();
                $( ".dragheading" ).disableSelection();
              } );

            $('input[name*="scoringview"]').click(function(){
                var inputValue = $(this).attr("value");
                var targetBox = $("." + inputValue);
                $(".scoringappyes").not(targetBox).hide();
                $(targetBox).show();
            });
            $(".loader-block").fadeOut("slow");

            $(function() {
                $( ".sortablecolumn" ).sortable();
                $( ".sortablecolumn" ).disableSelection();
            });

           $(function() {
                $( ".collapse_and_drag" ).sortable();
                $( ".collapse_and_drag" ).disableSelection();                                                                            
           });
            window.history.replaceState(null, null, "?page=basic");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function showEmailConfirmationPopup(firstData,from){
    
    var currentObj = $('#userChangeStatus_'+firstData);
    var status = currentObj.attr('alt');
    var data = currentObj.attr('data');
    if(status==0){
        $('#ConfirmAlertYesBtn').unbind();
        $('#ConfirmAlertNoBtn').unbind();
        $('#ConfirmAlertPopUpTextArea').html("Are you sure you want to enable this scorecard?");
        $('#ConfirmAlertPopUpSection .modal-title').html("Enable Panel");
        $("#ConfirmAlertPopUpSection").modal("show");
        $("#ConfirmAlertYesBtn").on("click",function(){
            changeStatusUser(firstData, status, data,from);
        });
    }else{
        $('#ConfirmAlertYesBtn').unbind();
        $('#ConfirmAlertNoBtn').unbind();
        $('#ConfirmAlertPopUpTextArea').html("Are you sure you want to disable this scorecard?");
        $('#ConfirmAlertPopUpSection .modal-title').html("Disable Panel");
        $("#ConfirmAlertPopUpSection").modal("show");
        $("#ConfirmAlertYesBtn").on("click",function(){
            changeStatusUser(firstData, status, data,from);
        });
    }
}

function changeStatusUser(id, status, data,from) {
    
    $.ajax({
        url: '/settings/changePanelStatus',
        type: 'post',
        data: {'id': id, 'status': status,'data':data},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
           showLoader();
        },
        success: function (json) {
            if (json['status'] == 200) {
                
                //alertPopupAssignedInstitute(json['message'],'success');
                $('#alertTitle').html('Success');
                getScorePanelList('reset');
                $('#OkBtn').show();
            }
            else {
                // System Error
                alert('Some Error occured, please try again.', 'error');
            }
            return false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError);
        },
        complete: function () {
            hideLoader();
        }
    });
}

function alertPopupAssignedInstitute(msg, type, location) {

    if (type == 'error') {
        var selector_parent = '#ErrorPopupArea';
        var selector_titleID = '#ErroralertTitle';
        var selector_msg = '#ErrorMsgBody';
        var btn = '#ErrorOkBtn';
        var title_msg = 'Error';
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

$('#OkBtn').on('click',function(){
    $("#SuccessPopupArea .npf-close").trigger('click');
});

function editscorecards() {
    
}


function getscorfieldlist(type){
    /*if (type == 'reset') {
        NPFScorePanel = 0;
        $('#load_more_results').closest('div').removeClass('table-border');
        $('.if_record_exists').hide();
        $('#load_more_results').html("");
        $('#load_more_results_msg').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
    }
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').hide();*/
    var data = $('#FilterScorePanel').serializeArray();
    data.push({name: "page", value: NPFScorePanel});
    
    $.ajax({
        url: jsVars.getscoringfieldlisting,
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function () {
           $('#parent').css('min-height', '50px');
           showLoader();
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            $("#basicsettings").removeClass('active');
            $("#manageScoreCardTab").addClass('active');
            NPFScorePanel = NPFScorePanel + 1;
            if(data=='session_logout'){
                window.location.reload(true);
            }else if(data=='invalid_request_csrf'){
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;Load more users");
                $('#load_more_button').hide();
                $('.if_record_exists').hide();
				$('#load_msg_div').show();
                $('#load_msg').html('Invalid Request.');
            }else if(data=='no_record_found'){
                $('#load_more_button').html("Load More Leads");
                $('#load_more_button').hide();
                if(NPFScorePanel==1){
                    $('#load_msg_div').show();
                    $('#load_msg').html('No Record Found');
                }else{
                    $('#load_more_results_msg').html('<div class="text-center text-danger">No More Record</div>');
                }
                
            }else if(data=='select_college'){
                $('#load_more_button').html("");
                $('#load_more_button').hide();
                $('#load_msg_div').show();
                $('#load_msg').html('Please Select Institute.');
                
            }else if(data=='No Configuration Available !'){
                $('#load_more_results_s_fields').html('<div class="aligner-middle"><div class="text-center"><span id="load_msg">No Scoring Field is yet created for this Form, to create the same you can click on the Add new Scoring Field Button placed on top of this page.</span></div></div>');
            }else{
                
                data = data.replace("<head/>", '');
                $('#load_more_results_s_fields').html(data);
                dropdownMenuPlacement();
                
            }
            $("#newScoreCard").css("display","none");
            $("#newScoreField").css("display",'block');
            window.history.replaceState(null, null, "?page=manage_scorecard");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //window.location.reload(true);
        },
        complete: function () {
            hideLoader();
        }
    });
}

function editscoringfields(url){
    
    if(typeof url =='undefined'){
        return false;
    }    
    $.ajax({
        url: url,
        type: 'post',
        dataType: 'html',
        data: {"type": "get_page"},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $('.loader-block').show();
        },
        complete: function () {
            
        },
        success: function (data) {
            if (data == "session") {
                window.location.reload(true);
            } else {
                $('#scoringfieldform').html(data);
                $('.loader-block').hide();
                $('#scoringfieldfilter').modal();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });    
}

function newScoreCard(){
    $("#basicsettings-tab").trigger('click');
}


function maximumRatingValue(){
    var maximumRatingScaleCount = $('select[name=maximumRatingScale]').val();
    var ratingScaleDbData = $('input[name=ratingScaleDbData]').val();
    if(maximumRatingScaleCount > 0){
        $('#colorPickerSelection').removeClass('hide');
    }else{
        $('#colorPickerSelection').addClass('hide');
    }
    $.ajax({
        url: jsVars.ratingScaleContent,
        type: 'post',
        dataType: 'html',
        data: {"maximumRatingScaleCount": maximumRatingScaleCount, "ratingScaleDbData": ratingScaleDbData},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
            $('.loader-block').show();
        },
        complete: function () {
            
        },
        success: function (data) {
            $('.loader-block').hide();
            $('#colorPickerSelection').html(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function changeColor(counter){
    var colorValue = $('.dynamicChangeColor_'+counter).val();
    $('.dynamicChangeColor_'+counter).next('.dynamicColorInput_'+counter).val(colorValue);
    $('.dynamicChangeColor_'+counter).parent('.dynamicBadge_'+counter).css('border-color', colorValue);
    $('.dynamicChangeColor_'+counter).parent('.dynamicBadge_'+counter).find('.dynamicBgColor_'+counter).css('background', colorValue);
}

function changeBackgroundColor(counter){
    var textColorValue = $('.dynamicColorInput_'+counter).val();
    $('.dynamicColorInput_'+counter).prev('.dynamicChangeColor_'+counter).val(textColorValue);
    $('.dynamicColorInput_'+counter).prev('.dynamicChangeColor_'+counter).css('background', textColorValue);
    $('.dynamicColorInput_'+counter).parent('.dynamicBadge_'+counter).css('border-color', textColorValue);
    $('.dynamicColorInput_'+counter).parent('.dynamicBadge_'+counter).find('.dynamicBgColor_'+counter).css('background', textColorValue);
}

function ratingScaleShow(){
    var ratingScaleVal = $('#field_type').val();
    if(ratingScaleVal==='ratingscale'){
        $('.rating-scale').removeClass('hide');
        $('.fieldAttributeHide').addClass('hide');
        $('.rating-scale').show();
    }else{
        $('.rating-scale').addClass('hide');
        $('.fieldAttributeHide').removeClass('hide');
    }
}