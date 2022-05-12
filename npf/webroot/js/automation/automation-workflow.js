/**
 * add block node to tree
 * @param object elem
 * @param string if_else_block
 * @returns boolean
 */
function addBlock(elem,if_else_block) {

    if(typeof jsVars.noedit !='undefined' && jsVars.noedit=='true'){
        alertPopup('You can\'t update the automation because it is already finished.','error');
        return;
    }

    // initialize variables
    var html       = '';
    var ul_class   = '';
    var li_class   = '';
    var newNode    = '';
    var block_type = jQuery(elem).data('block');
    var if_else_child = jQuery(elem).data('child');

    // fetch html block type
    switch(block_type){
        case 'wait':
        case 'email':
        case 'sms':
        case 'if_else':
        case 'remove_user':
        case 'lead_stage':
        case 'notify_user_email':
        case 'automation_allocate_lead':
        case 'whatsapp_send':
        case 'webhook_request':
            html = jQuery('#raw_'+block_type).html();
            break;
        default:
            html = '';
    }
    // if check yes/no for if else
    if(typeof if_else_block =='undefined'){
        if_else_block = '';
    }

    if('no' == if_else_block){
        ul_class = 'yesNo';
        li_class = 'li_1 no';
    }else if('yes' == if_else_block){
        ul_class = 'yesNo';
        li_class = 'li_1 yes';
    }
    // get parent id (id of previous block)
//    alert(jQuery(elem).closest('li').find('form').first().find('.block_form input[name="id"]').length);
//    alert(jQuery(elem).closest('form.block_form').length);

    var parent_id = jQuery(elem).closest('form.block_form').find('input[name="id"]').val();
    if(typeof parent_id =='undefined'){
        // if first block it set to zero
        parent_id = 0;
    }
        newNode = jQuery(jQuery.parseHTML('<ul class="'+ul_class+'"><li class="animated slideInDown  '+li_class+'" id="li_block_{id}">' + html + '</li></ul>'));

//        jQuery(elem).closest('li').append(newNode);

    // check block count

    var len = jQuery(elem).closest('li').find('>ul>li').length;
    if (len == 0) { // if first block add <ul>
        newNode = jQuery(jQuery.parseHTML('<ul class="'+ul_class+'"><li class="animated slideInDown  '+li_class+'" id="li_block_{id}">' + html + '</li></ul>'));
        jQuery(elem).closest('li').append(newNode);
    } else {
        newNode = jQuery(jQuery.parseHTML('<li class=" animated slideInDown '+li_class+'" id="li_block_{id}">'+html+'</li>'));
        // append block element
        jQuery(elem).closest('li').find('>ul>li').last().after(newNode);
    }

    // add parent id to block
    jQuery(newNode).find('[name="parent_id"]').val(parent_id);
    /* if block is not `if_else` then it save */
    saveAutomationNode(newNode,block_type,if_else_block);
    return;
}

/**
 * save block node entry in mongodb
 * @param {object} newNode
 * @param {string} block_type
 * @returns {boolean}
 */
function saveAutomationNode(newNode,block_type,if_else_block,next_if_else){
//    if(typeof next_if_else =='undefined' || next_if_else==''){
        next_if_else = -1;
//    }
    var id = jQuery(newNode).find('[name="id"]').val();
    // get parent id
    var parent_id = jQuery(newNode).find('[name="parent_id"]').val();
    // initialize variables
    var data = {};
    data['id']        = id;
    data['parent_id'] = parent_id;
    data['block_type']= block_type;
    data['al_id']     = $('#al_id').val();
    data['college_id']= $('#college_id').val();
    data['name']      = '';
    data['if_else_block'] = if_else_block;
    // show loaders
    $('#CollegeConfigurationSection .loader-block').show();
    // serialize all form data
    // ajax start
    saveAutomationAjax(newNode,data)
}


/**
 * add block node to tree
 * @param object elem
 * @param string if_else_block
 * @returns boolean
 */
function addBlockTop(elem,if_else_block) {

    if(typeof jsVars.noedit !='undefined' && jsVars.noedit=='true'){
        alertPopup('You can\'t update the automation because it is already finished.','error');
        return;
    }

    // initialize variables
    var html       = '';
    var ul_class   = '';
    var li_class   = '';
    var newNode    = '';
    var block_type = jQuery(elem).data('block');
    var if_else_child  = jQuery(elem).data('child');
    var clickblock_id = jQuery(elem).closest('form.block_form').find('input[name="id"]').val();

    /**
     * variable use for add block horizontal or verticle (above current block)
     */

    // fetch html block type
    switch(block_type){
        case 'wait':
        case 'email':
        case 'sms':
        case 'if_else':
        case 'remove_user':
        case 'lead_stage':
        case 'notify_user_email':
        case 'automation_allocate_lead':
        case 'whatsapp_send':
        case 'webhook_request':
            html = jQuery('#raw_'+block_type).html();
            break;
        default:
            html = '';
    }
    // if check yes/no for if else
    if(typeof if_else_block =='undefined'){
        if_else_block = '';
    }

    if('no' == if_else_block){
        ul_class = 'yesNo';
        li_class = 'li_1 no';
    }
    else if('yes' == if_else_block){
        ul_class = 'yesNo';
        li_class = 'li_1 yes';
    }
    // get parent id (id of previous block)
//    alert(jQuery(elem).closest('li').find('form').first().find('.block_form input[name="id"]').length);
//    alert(jQuery(elem).closest('form.block_form').length);

    var parent_id = jQuery(elem).closest('form.block_form').find('input[name="parent_id"]').val();
    if(typeof parent_id =='undefined'){
        // if first block it set to zero
        parent_id = 0;
    }
    newNode = jQuery(jQuery.parseHTML('<ul class="'+ul_class+'"><li class="animated slideInDown  '+li_class+'" id="li_block_{id}">' + html + '</li></ul>'));

//        jQuery(elem).closest('li').append(newNode);


    // add parent id to block
    jQuery(newNode).find('[name="parent_id"]').val(parent_id);
    /**
     * display child node add to "yes" position or "no" position
     */
    if(block_type=='if_else'){
        /* if block is if else then check if block is add to last position or middle of nodes*/
        if(typeof if_else_child != 'undefined' && if_else_child == 1){
            /* display confirmation popup for if_else condition to add child node to its `yes` position or `no` position */
            ifelsePromptForChildNode(newNode,block_type,1,clickblock_id);
        }else{
            saveAutomationNodeTop(newNode,block_type,if_else_block,'',clickblock_id);
        }
    }else{
        if(typeof if_else_block == 'undefined' || if_else_block==''){
            if(jQuery(elem).closest('li').hasClass('yes')){
                if_else_block = 'yes';
            }else if(jQuery(elem).closest('li').hasClass('no')){
                if_else_block = 'no';
            }
        }
        /* if block is not `if_else` then it save */
        saveAutomationNodeTop(newNode,block_type,if_else_block,'',clickblock_id);
    }
    return;
}

/**
 *
 * @param object newNode
 * @param string block_type
 * @param string if_else_block
 * @param int next_if_else
 * @param int next_parent_id
 * @returns {undefined}
 */

function saveAutomationNodeTop(newNode,block_type,if_else_block,next_if_else,clickblock_id){

    if(typeof next_if_else =='undefined' || next_if_else==''){
        next_if_else = -1;
    }
    var id = jQuery(newNode).find('[name="id"]').val();
    // get parent id
    var parent_id = jQuery(newNode).find('[name="parent_id"]').val();
    // initialize variables
    var data          = {};
    data['id']        = id;
    data['parent_id'] = parent_id;
    data['block_type']= block_type;
    data['al_id']     = $('#al_id').val();
    data['college_id']= $('#college_id').val();
    data['name']      = '';
    data['if_else_block'] = if_else_block;
    /* update next block parent id (for block horizontal adding node)*/

    if(if_else_block!=''){
        if(jQuery('#li_block_'+clickblock_id).hasClass(if_else_block)){
//            var nextid      = jQuery('#form_block_'+parent_id).parent('li').find('ul').eq(0).find('form input[name="id"]').val
            data['next_block']= {'id':clickblock_id,'next_if_else':next_if_else};
        }
    }
    else{
//        var nextid      = jQuery('#form_block_'+parent_id).parent('li').find('ul').eq(0).find('form input[name="id"]').val();
        data['next_block']= {'id':clickblock_id,'next_if_else':next_if_else};
    }
    // show loaders
    $('#CollegeConfigurationSection .loader-block').show();
    // ajax function
    saveAutomationAjax(newNode,data)
}

/**
 * call ajax for saving data
 * @param {type} newNode
 * @param {type} data
 * @returns {undefined}
 */

function saveAutomationAjax(newNode,data){
    $.ajax({
        url: '/automation/save-automation-node/',
        type: 'post',
        data: data,
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            //$('#graphStatsLoaderConrainer').show();
        },
        complete: function () {
            // hide loader
            $('#CollegeConfigurationSection .loader-block').hide();
        },
        success: function (json) {
            if(typeof json['redirect'] !='undefined' && json['redirect']!=''){
                window.location = json['redirect'];
            }else if(json['success']==200){
                // save automation and assing id to it
                jQuery(newNode).find('[name="id"]').val(json['id']);

                $(newNode).find('#form_block_\\{id\\}').attr('id','form_block_'+json['id']);
                $(newNode).find('#li_block_\\{id\\}').attr('id','li_block_'+json['id']);
                $(newNode).find('#form_block_'+json['id']).closest('li#li_block_\\{id\\}').attr('id','li_block_'+json['id']);
                // reload data
                reloadWorkflowData();
                /* open edit box */
                jQuery('#form_block_'+json['id']+' .editBlockBtn').trigger('click');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

}
/**
 * Open Popup on edit block
 * @param {type} elem
 * @returns {undefined}
 */
function editBlock(elem){
    var form_id = 0;
    var al_id = 0;
    var automationListFormId = 0;
    var college_id = jQuery("#college_id").val();
    if(jQuery("#form_id").length>0){
        form_id = jQuery("#form_id").val();
    }
    if(jQuery("#al_id").length>0){
        al_id = jQuery("#al_id").val();
    }
    if(jQuery("#automationListFormId").length>0){
        automationListFormId = jQuery("#automationListFormId").val();
    }
    var block_type = jQuery(elem).data('block');
    // get all form data
    var data       = jQuery(elem).closest('form.block_form').serializeArray();
    data.push({'name':'block_type','value':block_type});
    data.push({'name':'college_id','value':college_id});
    data.push({'name':'form_id','value':form_id});
    data.push({'name':'al_id','value':al_id});
    data.push({'name':'am_single_form_id','value':automationListFormId});

    jQuery.ajax({
        url: '/automation/edit-automation-block/',
        type: 'post',
        data: data,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
            $('div.loader-block').show();
            if((block_type =='email' || block_type =='notify_user_email') && typeof unlayer != 'undefined' && typeof unlayer.frame !='undefined') {
                delete unlayer.frame;
            }
            if((block_type =='email' || block_type =='notify_user_email') && typeof CKEDITOR !='undefined' && typeof CKEDITOR.instances['editor'] !='undefined') {
                removeCKEditor('editor');
            }
	},
        complete: function() {
            $('div.loader-block').hide();
        },
        success: function (html) {
            if('session' == html){
                window.location = '/';
            }
            else if ('error' == html){
                    alertPopup('Error','error');
            }
            else{
                var popupTitle = block_type;

				if(block_type === 'email'){
					popupTitle = "Edit Email";
					jQuery("#ActivityLogPopupArea .modal-dialog").removeClass('modal-md').addClass('modal-xlg');
                }
				else if(block_type === 'sms'){
					popupTitle = "Edit SMS";
					jQuery("#ActivityLogPopupArea .modal-dialog").removeClass('modal-xlg modal-md');
                }
                else if(block_type === 'remove_user'){
                    popupTitle = "Remove User";
					jQuery("#ActivityLogPopupArea .modal-dialog").removeClass('modal-xlg modal-md');
                }
                else if(block_type === 'lead_stage'){
                    popupTitle = "Edit Lead/Application Stage";
					jQuery("#ActivityLogPopupArea .modal-dialog").removeClass('modal-xlg modal-md');
                }
                else if(block_type === 'notify_user_email'){
                    popupTitle = "Edit Notify Users";
					jQuery("#ActivityLogPopupArea .modal-dialog").removeClass('modal-md').addClass('modal-xlg');
                }
                else if(block_type === 'automation_allocate_lead'){
                    popupTitle = "Edit Allocate Counsellor";
					jQuery("#ActivityLogPopupArea .modal-dialog").removeClass('modal-xlg modal-md');
                }
				else if(block_type === 'wait'){
                    popupTitle = "Wait";
					jQuery("#ActivityLogPopupArea .modal-dialog").removeClass('modal-xlg modal-md');
                }
                else if(block_type === 'whatsapp_send'){
                    popupTitle = "Edit Send Whatsapp Message";
					jQuery("#ActivityLogPopupArea .modal-dialog").removeClass('modal-xlg').addClass('modal-md');
                }
                else if(block_type === 'webhook_request'){
                    popupTitle = "Edit Webhook Request";
					jQuery("#ActivityLogPopupArea .modal-dialog").removeClass('modal-xlg').addClass('modal-md');
                }
                // open model popup with form
                /*jQuery("#SuccessPopupArea").addClass("modalWide");
                jQuery("#SuccessPopupArea .modal-body").removeClass("text-center").addClass('npf-form-group');
                jQuery("#SuccessPopupArea .modal-title").html("Edit "+popupTitle);
                jQuery("#SuccessPopupArea p#MsgBody").text('');
                jQuery("#SuccessPopupArea #MsgBodyDiv").html(html);
                jQuery("#SuccessPopupArea span.oktick").html('');
                jQuery("#SuccessLink").trigger('click');*/

				//jQuery("#ActivityLogPopupArea").addClass("modalWide");
                                jQuery("#SuccessPopupArea #MsgBodyDiv").html('');
				jQuery("#ActivityLogPopupHTMLSection").parent().removeClass('modal-body');
				//jQuery("#ActivityLogPopupArea .modal-dialog").addClass('modal-xlg');
                jQuery("#ActivityLogPopupArea .modal-title").html(popupTitle);
                jQuery("#ActivityLogPopupArea #ActivityLogPopupHTMLSection").html(html);
                jQuery("#ActivityLogPopupArea").modal();

                jQuery('.chosen-select').chosen();
                jQuery('.chosen-select').trigger('chosen:updated');
                jQuery('.chosen-select-deselect').chosen({allow_single_deselect: true});
				floatableLabel();


            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            jQuery('div.loader-block').hide();
        }
    });
}

/**
 * open popup when if else block is edit
 * @param {object} elem
 * @returns {Boolean}
 */
function loadIfElseLogic(elem){
    var form_id = 0;
    var al_id = 0;
    var college_id = jQuery("#college_id").val();
    var am_single_form_id = 0;
    if(jQuery("#form_id").length>0){
        form_id = jQuery("#form_id").val();
    }
    if(jQuery("#al_id").length>0){
        al_id = jQuery("#al_id").val();
    }
    var data       = {};
    if($("#automationListFormId").length>0 && $("#automationListFormId").val()>0){
        am_single_form_id = $("#automationListFormId").val();
    }
    // form data
    var data       = jQuery(elem).closest('form.block_form').serializeArray();
    data.push({'name':'college_id','value':college_id});
    data.push({'name':'form_id','value':form_id});
    data.push({'name':'am_single_form_id','value':am_single_form_id});
    data.push({'name':'al_id','value':al_id});
    //alert(index);
    $.ajax({
        url: '/automation/load-if-else-logic',
        type: 'post',
        data: data,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('div.loader-block').show();
        },
        complete: function () {
            $('div.loader-block').hide();
        },
        success: function (html) {
            if('session' == html){
                window.location = '/';
            }
            else if ('error' == html){
                alertPopup('Error','error');
            }
            else{
                jQuery("#SuccessPopupArea #MsgBodyDiv").html('');
				jQuery("#ActivityLogPopupHTMLSection").parent().removeClass('modal-body');
				jQuery("#ActivityLogPopupArea .modal-dialog").removeClass('modal-xlg').addClass('modal-md');
                jQuery("#ActivityLogPopupArea .modal-title").html('Edit Condition');
                jQuery("#ActivityLogPopupArea #ActivityLogPopupHTMLSection").html(html);
                jQuery("#ActivityLogPopupArea").modal();
            }

            $('.chosen-select').chosen();
            $('.chosen-select').trigger('chosen:updated');
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
			floatableLabel();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

/**
 * add more filter
 * @param {type} elem
 * @param {type} form_id
 * @returns {Boolean}
 */

function addMoreFilter(elem, form_id) {
    var div_class = 'form' + form_id;
    var stgClone = jQuery(elem).closest('.' + div_class + '>div').eq(0).clone();
    // remove chosen select container
    jQuery(stgClone).find('.chosen-container').remove();
    //    replace name to []


//    jQuery(stgClone).replace();
    // add delete button
    jQuery(stgClone).find('.removeElementClass').html('<a href="javascript:void(0);" class="text-danger" onclick="return confirmDeleteAutomation(this);"><i class="fa fa-minus-circle" style="font-size:18px;" aria-hidden="true"></i></a>');

    // reset all select box value
    jQuery(stgClone).find('select').val('');
    var multiSelect = false;
    if(jQuery(stgClone).find('select').hasClass("multi-dynamic")){
        var tempHtml = jQuery(stgClone).find('.SumoSelect').html();
        jQuery(stgClone).find('.SumoSelect').parent().html(tempHtml);
        jQuery(stgClone).find('select.multi-dynamic').removeClass('SumoUnder');
        jQuery(stgClone).find('select.multi-dynamic').removeAttr('multiple');
        jQuery(stgClone).find('select.multi-dynamic').addClass('chosen-select');
        jQuery(stgClone).find('select').removeClass('multi-dynamic');
        multiSelect = true;
    }

    // blank textbox value
    jQuery(stgClone).find('input').attr('placeholder', 'Input Value').val('');
    jQuery(stgClone).find('.field_value_div>div').hide();

    // remove hidden for autocomplete
    jQuery(stgClone).find('.sel_value_hidden').remove();
    jQuery(stgClone).find('.typeahead').remove();
    jQuery(stgClone).find('.lead_error').remove();
    jQuery(elem).closest('.' + div_class).append(stgClone);

    //alert(jQuery(elem).parents('.block_first').find('.' + div_class + '>div').length);

        var stage_count = 0;
        var maxLength = jQuery(elem).parents('.block_first').find('.' + div_class + '>div').length;
        jQuery(elem).parents('.block_first').find('.' + div_class + '>div').each(function(){
//            $(this).find('.sel_value').attr('class', 'sel_value form-group');

            var fields_name = $(this).find('.sel_field').attr('name').replace(/filter\[fields\]\[[\d]+\]/gi, "filter[fields]["+stage_count+"]");
//            alert(fields_name);
            $(this).find('.sel_field').attr('name', fields_name);

            var fields_name = $(this).find('.sel_type').attr('name').replace(/filter\[types\]\[[\d]+\]/gi, "filter[types]["+stage_count+"]");
            $(this).find('.sel_type').attr('name', fields_name);

            if(multiSelect && (maxLength == stage_count+1)){
                var fields_name = $(this).find('.sel_value').attr('name').replace(/filter\[values\]\[[\d]+\]\[\]/gi, "filter[values]["+stage_count+"]");
            }else{
                var fields_name = $(this).find('.sel_value').attr('name').replace(/filter\[values\]\[[\d]+\]/gi, "filter[values]["+stage_count+"]");
            }
            $(this).find('.sel_value').attr('name', fields_name);

            if (typeof $(this).find('.sel_value_hidden').attr('name') != 'undefined') {
                var fields_name = $(this).find('.sel_value_hidden').attr('name').replace(/filter\[values_id\]\[[\d]+\]/gi, "filter[values_id][" + stage_count + "]");
                $(this).find('.sel_value_hidden').attr('name', fields_name);
            }
            stage_count++;
         });
    jQuery('.chosen-select').chosen();
    return false;
}

/**
 * Delete filter
 * @param object elem
 * @param int form_id
 * @param string type
 * @param string call_type
 * @returns {Boolean}
 *
 */
function confirmDeleteAutomation(elem) {
    $('#ConfirmMsgBody').html('Do you want to delete?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
                e.preventDefault();
                removeCondition(elem,0);
                $('#ConfirmPopupArea').modal('hide');
                $('.modal-backdrop').hide();
            });
    return false;
}

/**
 * remove condition field, operation and value
 * @param object elem
 * @returns {Boolean}
 */
function removeCondition(elem,form_id) {
    var div_class = 'form' + form_id;
//    var cond_block = jQuery(elem).parents('.condition_div');
    var cond_block = jQuery(elem).parents('.block_first');
    $(elem).closest('.condition_div').remove();
    var stage_count = 0;
//    jQuery(elem).closest('.condition_div').remove();
    cond_block.find('.' + div_class + '>div').each(function () {
        // reset array number after delete
        var fields_name = $(this).find('.sel_field').attr('name').replace(/filter\[fields\]\[[\d]+\]/gi, "filter[fields]["+stage_count+"]");
        $(this).find('.sel_field').attr('name', fields_name);

        var fields_name = $(this).find('.sel_type').attr('name').replace(/filter\[types\]\[[\d]+\]/gi, "filter[types]["+stage_count+"]");
        $(this).find('.sel_type').attr('name', fields_name);

        var fields_name = $(this).find('.sel_value').attr('name').replace(/filter\[values\]\[[\d]+\]/gi, "filter[values]["+stage_count+"]");
        $(this).find('.sel_value').attr('name', fields_name);

        if (typeof $(this).find('.sel_value_hidden').attr('name') != 'undefined') {
            var fields_name = $(this).find('.sel_value_hidden').attr('name').replace(/filter\[values_id\]\[[\d]+\]/gi, "filter[values_id][" + stage_count + "]");
            $(this).find('.sel_value_hidden').attr('name', fields_name);
        }

//        if (typeof $(this).find('.lead_error') !='undefined') {
//            var fields_name = $(this).find('.lead_error').attr('id').replace(/\d$/gi, stage_count);
//            $(this).find('.lead_error').attr('id',fields_name);
//        }
        stage_count++;
    });
    return false;
}

/**
 * save block information
 * @param {object} elem
 * @returns {Boolean}
 */
function saveSingleBlock(elem){
    jQuery('#display_if_else_error').hide();
    jQuery('#display_if_else_error').html('');

    var block = jQuery(elem).data('block');
    var college_id = jQuery("#college_id").val();
    var al_id      = jQuery("#al_id").val();
//    var templateId = jQuery("#TemplateListSelect1").val();

    var data = jQuery('#form_'+block).serializeArray();
    data.push({name:'college_id','value':college_id});
    data.push({name:'al_id','value':al_id});
//    data.push({name:'email_template','value':templateId});

    if(block=='email' || block=='notify_user_email') {
        if(!$('#editor-container').is(':hidden') && typeof unlayer != 'undefined' && typeof unlayer.frame != 'undefined' && unlayer.frame != null) {
            unlayer.exportHtml(function(data1) {
                var email_content = data1.html;
                data.push({name:'message_text','value':email_content});
                var error = validateSingleBlock(data);
                if(error == true){
                    return;
                }
                data.push({name:'template_json','value':JSON.stringify(data1.design)});
                data.push({name:'template_editor','value':2});
                sendSaveSingleBlockRequest(data,al_id,college_id,block);
            });
        } else {
            if(typeof CKEDITOR !='undefined' && typeof CKEDITOR.instances['editor'] != 'undefined') {
                var email_content = CKEDITOR.instances['editor'].getData();///new content
                data.push({name:'message_text','value':email_content});
            }
            var error = validateSingleBlock(data);
            if(error == true){
                return;
            }
            data.push({name:'template_editor','value':1});
            sendSaveSingleBlockRequest(data,al_id,college_id,block);
        }
    } else {
        var error = validateSingleBlock(data);
        if(error == true){
            return;
        }
        sendSaveSingleBlockRequest(data,al_id,college_id,block);
    }
    return false;
}

function sendSaveSingleBlockRequest(data,al_id,college_id,block) {
    $.ajax({
        url: '/automation/save-single-block',
        type: 'post',
        data: data,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
        },
        success: function (html_data) {

            if(html_data=='error'){
                jQuery('#display_if_else_error').html('Error! Please fill mendatory field');
                jQuery('#display_if_else_error').show();
            }
            else if(html_data.substring(0, 7) === 'ERROR::'){
                jQuery('#display_if_else_error').html(html_data.substring(7, html_data.length));
                jQuery('#display_if_else_error').show();
            }
            else if(typeof html_data !='undefined' && html_data =='redirect'){
                window.location = '/';
                $('#SuccessPopupArea').modal('hide');
                $('.modal-backdrop').hide();
            }
            else if(typeof html_data !='undefined' && html_data =='noedit'){
                jQuery('#display_if_else_error').html('You can\'t update the automation because it is already finished.');
                jQuery('#display_if_else_error').show();
                }
            else{
                $('#SuccessPopupArea').modal('hide');
                $('.modal-backdrop').hide();
				$('body').css('padding-right', '0');
                // update title and msg
                var dataObj = {};
                for (var i=0; i<data.length; i++) {
                    dataObj[data[i].name] = data[i].value;
                }
                // referesh block from db
//                jQuery('#li_block_'+dataObj['block_id']).text('');
                jQuery('#form_block_'+dataObj['block_id']).html(html_data);
                jQuery('#ErroralertTitle').html('Success');
//                if(block =='email' || block =='notify_user_email') {
//                    alertPopup('Successfully Saved','error',window.location.href);
//                } else {
                    traverseIfElseUL();
                    getFlowTime(al_id,college_id);
                    $('#ErrorOkBtn').click(function(){
                        reloadWorkflowData();
                    });
                    alertPopup('Successfully Saved','error');
//                }
                $('#ErroralertTitle').html('Success');
                $('#ActivityLogPopupArea').modal('hide');
            }
            $('.chosen-select').chosen();
            $('.chosen-select').trigger('chosen:updated');
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function loadWorkFlow(al_id,college_id){

    $.ajax({
        url: '/automation/ajax-load-workflow/',
        type: 'post',
        data: {'al_id':al_id,'college_id':college_id},
        dataType: 'html',
        async: false,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            //$('#graphStatsLoaderConrainer').show();
        },
        complete: function () {
            // hide loader
            //$('#CollegeConfigurationSection .loader-block').hide();
        },
        success: function (data) {
            if (data == "session_logout") {
                    window.location.reload(true);
            }
            else if (data == "error") {

            }else{
               $('#start_li').append(data);
               traverseIfElseUL();
//			   dropdownMenuPlacement();
//			   determineDropDirection();
                getFlowTime(al_id,college_id);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function deleteBlock(elem,block){

    //alert(block);
    if(block=="all")html="Are you sure to delete all child nodes/blocks?";
    else if(block=="yes")html="Are you sure to delete Yes option and its child nodes/blocks?";
    else if(block=="no")html="Are you sure to delete No option and its child nodes/blocks?";
    else html="Are you sure to delete current node/block?";

    $('#ConfirmMsgBody').html(html);
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmYes', function (e) {
            e.preventDefault();

        //return false;
        //alert(elem);
        var data = $(elem).closest("form").serializeArray();

        var al_id = $('#al_id').val();
        var college_id = $('#college_id').val();

        data.push({name: "al_id", value: al_id});
        data.push({name: "college_id", value: college_id});
        data.push({name: "block", value: block});

        $.ajax({
            url: '/automation/ajax-delete-block/',
            type: 'post',
            data: data,
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                //$('#graphStatsLoaderConrainer').show();
            },
            complete: function () {
                // hide loader
                //$('#CollegeConfigurationSection .loader-block').hide();
            },
            success: function (data) {
                if (data == "session_logout") {
                    window.location.reload(true);
                }
                else if (data == "error") {

                }else if (data == "noedit") {
                    alertPopup('You can\'t update the automation because it is already finished.','error');
                }else{
                   //alert("aaaa");
                   $('#start_li ul').remove();
                   $('#start_li').append(data);
                   traverseIfElseUL();
                   getFlowTime(college_id,al_id);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

    $('#ConfirmPopupArea').modal('hide');
    $('.modal-backdrop').hide();
   });
}


/**
 *
 * @param object newNode
 * @param string block_type
 * @param string if_else_block
 * @returns boolean
 */
function ifelsePromptForChildNode(newNode,block_type,is_vertical,clickblock_id){
    if(typeof clickblock_id == 'undefined'){
        clickblock_id = '';
    }

    var html = '<form accept-charset=utf-8 action=/automation/load-if-else-logic id=form_if_else method=post>\n\
<div class="row margin-bottom-20"><h4 class="col-md-12"><strong>Select If/Else Position:</strong></h4></div><div class="field-block row"><label class="col-md-4" for=yes_if><input class=radio_criteria id=yes_if name=if_else_position type=radio value=yes checked><span class="margin-left-8">Add to Yes (If)</span></label><label class="col-md-4" for=no_else><input class=radio_criteria id=no_else name=if_else_position type=radio value=no><span class="margin-left-8">Add to No (Else)</span></label></div><div class="row margin-top-30"><div class="col-md-12"><div id="subbutton"></div></div></div></form>';
    var button;
    if(is_vertical==1){
        button = jQuery('<button>')
            .text('Submit')
            .attr({'class':'btn btn-default margin-right-15 npf-btn','id':'submit_if_else_position','type':'button'})
            .click(function(){
                var if_else_pos = jQuery('[name="if_else_position"]:checked').val();
                $('#SuccessPopupArea').modal('hide');
                $('.modal-backdrop').hide();
                saveAutomationNodeTop(newNode,block_type,'',if_else_pos,clickblock_id);
            });
    }else{
        button = jQuery('<button>')
            .text('Submit')
            .attr({'class':'btn btn-default margin-right-15 npf-btn','id':'submit_if_else_position','type':'button'})
            .click(function(){
                var if_else_pos = jQuery('[name="if_else_position"]:checked').val();
                $('#SuccessPopupArea').modal('hide');
                $('.modal-backdrop').hide();
                saveAutomationNode(newNode,block_type,'',if_else_pos);
            });
    }
    var form = jQuery(jQuery.parseHTML(html));

    jQuery(form).find('#subbutton').append(button);
    // open popup from for if else
    jQuery("#SuccessPopupArea").addClass('modalCustom');
    jQuery("#SuccessPopupArea .modal-body").removeClass("text-center").addClass('npf-form-group');
    jQuery("#SuccessPopupArea .modal-title").html("Select Child Nodes Position");
    jQuery("#SuccessPopupArea p#MsgBody").text('');
    jQuery("#SuccessPopupArea #MsgBodyDiv").text('');
    jQuery("#SuccessPopupArea #MsgBodyDiv").append(form);
    jQuery("#SuccessPopupArea span.oktick").html('');
    jQuery("#SuccessLink").trigger('click');
}

/**
 * reload workflow data
 * @returns none
 */
function reloadWorkflowData(){
    var al_id     = $('#al_id').val();
    var college_id= $('#college_id').val();
    $('#start_li ul').remove();
    loadWorkFlow(al_id,college_id);
}



//For All Bind and initialize method
$(document).ready(function(e){
	$('body').addClass('dragscroll');
	//$('body').attr('nochilddrag', 'nochilddrag');
	//dragscroll.reset();
    $(document).on('click', '.deleteBlockBtn', function( event ) {
    	deleteBlock(this,'');
        return false;
    });
    $(document).on('click', '.deleteAllBlockBtn', function( event ) {
    	deleteBlock(this,"all");
        return false;
    });
    $(document).on('click', '.deleteNoBlockBtn', function( event ) {
    	deleteBlock(this,'no');
        return false;
    });
    $(document).on('click', '.deleteYesBlockBtn', function( event ) {
    	deleteBlock(this,'yes');
        return false;
    });

    jQuery(document).on('click','.addBlockBtnTop',function(event){
        addBlockTop(this);
    });
    jQuery(document).on('click','.addBlockBtnTopYes',function(event){
         addBlockTop(this,'yes');
    });
    jQuery(document).on('click','.addBlockBtnTopNo',function(event){
         addBlockTop(this,'no');
    });

    jQuery(document).on('click','.addBlockBtn',function(event){
        addBlock(this);
    });
    jQuery(document).on('click','.addBlockBtnYes',function(event){
        addBlock(this,'yes');
    });
    jQuery(document).on('click','.addBlockBtnNo',function(event){
        addBlock(this,'no');
    });
    jQuery(document).on('click','.editBlockBtn',function(event){
       var block_type = jQuery(this).data('block');
       if('if_else' == block_type){
            loadIfElseLogic(this);
       }else{
            editBlock(this);
       }
    });

    $(document).on('click', '.debugBlockBtn', function() {
    	debugBlock(this,'');
        return false;
    });
    // saving
    jQuery(document).on('click','#submitSingleBlock',function(event){
        event.preventDefault();
        saveSingleBlock(this);
    });
    // dismiss popup block then reload flow
    $('#SuccessPopupArea').on('hide.bs.modal', function () {
        if($('#start_li ul').length>1){
//            reloadWorkflowData();
        }
    });

    // popup checkbox for wait condition
    jQuery(document).on('click','.wait_select',function(event){
        var wait_type = jQuery(this).val();
        if('absolute_date' == wait_type){
            jQuery('#relative_time_div input,#relative_time_div select').val('');
            jQuery('#relative_time_div').hide();
            jQuery('#absolute_date_div').show();
        }else{
            jQuery('#relative_time_div').show();
            jQuery('#absolute_date_div').hide();
            jQuery('#absolute_date_div input').val('');
        }
    });

    // trafic channel
    /*
    $(document).on('change', "select.traffic_channel.sel_value", function () {
        if ($(this).val() == 1 || $(this).val() == 2 || $(this).val() == 7 || $(this).val() == 8 || $(this).val() == 9) {//campaign option
            getPublisherListConfig(this);
    //        getPublisherListConfig(this, [], 'publisher_filter');
        } else if ($(this).val() == 5 || $(this).val() == 3 || $(this).val() == 4) {
            getReferrerListConfig(this);
    //        getReferrerListConfig(this, [], 'publisher_filter');
        } else {
            //unset drop down on traffic channel without campains
            $(this).parents('.block_first').find('.campu\\|publisher_id').html("<option value=''>Publisher/Referrer</option>");
            // conversion source, conversion medium, conversion name
            $(this).parents('.block_first').find('.publisher_filter').html("<option value=''>Publisher/Referrer</option>");
            $('select').trigger('chosen:updated');
            return false;
        }
    }); */
    hideShowField();
    // this will traverse all if else ul li and take action

    $(document).on('click', '.view-report-btn', function( event ) {
    	var jobId = $(this).attr("data-id");
        var communicationMedium = $(this).attr("data-medium");
        var collegeId = $("#college_id").val();
        $(".jobreport-"+jobId+" .dropdown-menu-loader").show();
        $(".jobreport-"+jobId+" .dropdown-menu-header").hide();
        $.ajax({
            url: jsVars.FULL_URL+'/communications/get-job-count-data',
            type: 'post',
            data: {'job_id':jobId,'s_college_id':collegeId,'communication_medium':communicationMedium},
            dataType: 'html',
            async: false,
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
            },
            complete: function () {
            },
            success: function (data) {
                if (data === "session_logout") {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else if (data === 'invalid_request'){
                    alertPopup("Inavlid request.","error");
                } else {
                    $(".jobreport-"+jobId+" .dropdown-menu-loader").hide();
                    $(".jobreport-"+jobId+" .dropdown-menu-header").show();
                    $(".jobreport-"+jobId).html(data);
                    // $(".jobreport-"+jobId).show();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        return false;
    });

});

function hideJobReportModel(jobId){
    // $(".jobreport-"+jobId).hide();
}


function traverseIfElseUL(elem){
    if (typeof elem != 'undefined'){
        // do nothing
    }else{
        elem="ul.yesNo";
    }
    $(elem).each(function() {
        var li_block=$(this).parent().attr("id").replace("li_", "parent_");
        //console.log(li_block);
        if($(this).find("."+li_block+"_0:first").length==1){
            $(this).parent().find(".controlNo:first").hide();
        }else{
            $(this).parent().find(".controlNo:first").show();
        }

        if($(this).find("."+li_block+"_1:first").length==1){
            $(this).parent().find(".controlYes:first").hide();
        }else{
            $(this).parent().find(".controlYes:first").show();
        }
    });
}




function getFlowTime(al_id,college_id){

    $('#flow_time').html("");
    $.ajax({
        url: '/automation/get-flow-time/',
        type: 'post',
        data: {'al_id':al_id,'college_id':college_id},
        dataType: 'json',
        async: false,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            //$('#graphStatsLoaderConrainer').show();
        },
        complete: function () {
            // hide loader
            //$('#CollegeConfigurationSection .loader-block').hide();
        },
        success: function (data) {
            if (typeof data["error"]!=="undefined" && data["error"] == "session_logout") {
                window.location.reload(true);
            }
            else if (typeof data["error"]!=="undefined" && data["error"] == "error") {

            }else if(parseInt(data["seconds"])>0){
               $('#flow_time').html('This automation has <strong>'+data["time_words"]+'</strong> of lifecycle.');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
/**
 * validating each block attribute when edit
 * @param {array} data
 * @returns {Boolean}
 */
function validateSingleBlock(data){

    var valid_data = {};
    // process array name , value to key index
    for(var i in data){
        valid_data[data[i].name] = data[i].value;
    }
    var error = false;
    // first time hide all error for that block
    $('.requiredError, .error').hide();

   // for wait
    if(typeof valid_data.block_type != 'undefined' && valid_data.block_type == 'wait'){
        error = validateWaitBlock(valid_data);
    } // for email
    else if(typeof valid_data.block_type != 'undefined' && valid_data.block_type == 'email'){
        error = validateEmailBlock(valid_data);
    } // for sms
    else if(typeof valid_data.block_type != 'undefined' && valid_data.block_type == 'sms'){
        error = validateSMSBlock(valid_data);
    } // for if_else
    else if(typeof valid_data.block_type != 'undefined' && valid_data.block_type == 'if_else'){
        error = validateIfElseBlock(valid_data);
    }
    else if(typeof valid_data.block_type != 'undefined' && valid_data.block_type == 'lead_stage'){
        error = validateLeadStageBlock(valid_data);
    }
    else if(typeof valid_data.block_type != 'undefined' && valid_data.block_type == 'remove_user'){
        error = validateRemoveUserBlock(valid_data);
    }
    else if(typeof valid_data.block_type != 'undefined' && valid_data.block_type == 'notify_user_email'){
        error = validateNotifyUserEmailBlock(valid_data);
    }
    else if(typeof valid_data.block_type != 'undefined' && valid_data.block_type == 'automation_allocate_lead'){
        error = validateAutomationAllocateLeadBlock(valid_data);
    }
    else if(typeof valid_data.block_type != 'undefined' && valid_data.block_type == 'whatsapp_send'){
        error = validateWhatsappSendBlock(valid_data);
    }
    else if(typeof valid_data.block_type != 'undefined' && valid_data.block_type == 'webhook_request'){
        error = validateWebhookRequestBlock(valid_data);
    }
    return error;
}
/**
 * validate wait block call by validateSingleBlock
 * @param {array} valid_data
 * @returns {Boolean}
 */
function validateWaitBlock(valid_data){
    var error           = false;

    if(typeof valid_data.wait != 'undefined' && valid_data.wait == 'relative_time'){
        if(typeof valid_data.time_type == 'undefined' || valid_data.time_type == ''){
            $('#time_type_span').show();
            $('#time_type_span').html('Please select time type');
            error = true;
        }
        if(typeof valid_data.time == 'undefined' || valid_data.time == ''){
            $('#time_span').show();
            $('#time_span').html('Please select time');
            error = true;
        }
        else if(!valid_data.time.match(/(^\d+$)|(^\d+[\.][\d]+)$/)){
            $('#time_span').show();
            $('#time_span').html('Please select valid time');
            error = true;
        }
    }
    if(typeof valid_data.wait != 'undefined' && valid_data.wait == 'absolute_date'){
        if(typeof valid_data.abs_date == 'undefined' || valid_data.abs_date == ''){
            $('#abs_date_span').show();
            $('#abs_date_span').html('Please select date time');
            error = true;
        }
    }
    if(typeof valid_data.block_name == 'undefined' || valid_data.block_name == '' ){
        $('#block_name_span').html('Please enter block name');
        $('#block_name_span').show();
        error = true;
    }
    return error;
}

/**
 * validate email block call by validateSingleBlock
 * @param {array} valid_data
 * @returns {Boolean}
 */
function validateEmailBlock(valid_data){
    $('.error').html('');
    var error = false;
    if(typeof valid_data.block_name == 'undefined' || valid_data.block_name == '' ){
        $('#block_name_span').html('Please enter block name');
        $('#block_name_span').show();
        error = true;
    }
    if(typeof valid_data.from_email == 'undefined' || valid_data.from_email == '' ){
        $('#from_email_span').html('Please select email');
        $('#from_email_span').show();
        error = true;
    }
    if(typeof valid_data.message_subject == 'undefined' || valid_data.message_subject == '' ){
        $('#message_subject_span').html('Please enter subject');
        $('#message_subject_span').show();
        error = true;
    }
    if($('#editor-container').is(':hidden') && (typeof valid_data.message_text == 'undefined' || valid_data.message_text == '' )){
        $('#message_text_span').html('Please insert email body');
        $('#message_text_span').show();
        error = true;
    }

    if(typeof valid_data.communication_campaign_category_id != 'undefined' && valid_data.communication_campaign_category_id != '' && valid_data.communication_campaign_category_id == 'add_new_campaign_category'){

        if(typeof valid_data.add_new_campaign_category == 'undefined' || valid_data.add_new_campaign_category == '' ){
            $('#block_add_new_campaign_category_span').show().html('Please enter campaign type');
            error = true;
        }
    }
    return error;
}

/**
 * validate NotifyUserEmailBlock block call by validateSingleBlock
 * @param {array} valid_data
 * @returns {Boolean}
 */
function validateNotifyUserEmailBlock(valid_data){
    $('.error').html('');
    var error = false;
    if(typeof valid_data.block_name == 'undefined' || valid_data.block_name == '' ){
        $('#block_name_span').html('Please enter block name');
        $('#block_name_span').show();
        error = true;
    }
    if(typeof valid_data.from_email == 'undefined' || valid_data.from_email == '' ){
        $('#from_email_span').html('Please select email');
        $('#from_email_span').show();
        error = true;
    }
    if(typeof valid_data.notify_users == 'undefined' || valid_data.notify_users == '' ){
        $('#notify_users_span').html('Please select notify user');
        $('#notify_users_span').show();
        error = true;
    }
    if(typeof valid_data.message_subject == 'undefined' || valid_data.message_subject == '' ){
        $('#message_subject_span').html('Please enter subject');
        $('#message_subject_span').show();
        error = true;
    }
    if($('#editor-container').is(':hidden') && (typeof valid_data.message_text == 'undefined' || valid_data.message_text == '' )){
        $('#message_text_span').html('Please insert email body');
        $('#message_text_span').show();
        error = true;
    }

    if(typeof valid_data.communication_campaign_category_id != 'undefined' && valid_data.communication_campaign_category_id != '' && valid_data.communication_campaign_category_id == 'add_new_campaign_category'){

        if(typeof valid_data.add_new_campaign_category == 'undefined' || valid_data.add_new_campaign_category == '' ){
            $('#block_add_new_campaign_category_span').html('Please enter campaign type');
            $('#block_add_new_campaign_category_span').show();
            error = true;
        }
    }
    return error;
}
/**
 * validate NotifyUserEmailBlock block call by validateSingleBlock
 * @param {array} valid_data
 * @returns {Boolean}
 */
function validateAutomationAllocateLeadBlock(valid_data){
    var error = false;
//    console.log(valid_data);
//    console.log(valid_data.counsellor_ids);
    if(typeof valid_data.block_name == 'undefined' || valid_data.block_name == '' ){
        $('#block_name_span').html('Please enter block name');
        $('#block_name_span').show();
        error = true;
    }
    if(typeof valid_data.allocation_role == 'undefined' || valid_data.allocation_role == '' ){
        $('#allocation_role_span').html('Please enter allocation role');
        $('#allocation_role_span').show();
        error = true;
    }

    if(valid_data.allocation_role === 'assign'){
        if(typeof valid_data.allocation_type == 'undefined' || valid_data.allocation_type == '' ){
            $('#allocation_type_span').html('Please select Allocation Type');
            $('#allocation_type_span').show();
            error = true;
        }

        if(typeof valid_data.exclude_manual == 'undefined' || valid_data.exclude_manual == '' ){
            $('#exclude_manual_span').html('Please select Exclude Manual');
            $('#exclude_manual_span').show();
            error = true;
        }

        if(typeof valid_data.allocation_method == 'undefined' || valid_data.allocation_method == '' ){
            $('#allocation_method_span').html('Please select Allocation Method');
            $('#allocation_method_span').show();
            error = true;
        }

        if(typeof valid_data.counsellor_ids == 'undefined' || valid_data.counsellor_ids == '' ){
            var options = $('#counsellor_ids > option:selected');
            if(options.length == 0){
                $('#counsellor_ids_span').html('Please select counsellor.');
                $('#counsellor_ids_span').show();
                error = true;
            }
        }
    }else if(valid_data.allocation_role === 'unassign'){
        if(typeof valid_data.unassign_from == 'undefined' || valid_data.unassign_from == '' ){
            var options = $('#unassign_from > option:selected');
            if(options.length == 0){
                $('#unassign_from_span').html('Please select Unassign From');
                $('#unassign_from_span').show();
                error = true;
            }
        }
    }
    return error;
}

/**
 * validate sms block call by validateSingleBlock
 * @param {array} valid_data
 * @returns {Boolean}
 */
function validateSMSBlock(valid_data){
    //console.log(valid_data);
    $('.error').html('');
    var error = false;
    if(typeof valid_data.block_name == 'undefined' || valid_data.block_name == '' ){
        $('#block_name_span').html('Please enter block name');
        $('#block_name_span').show();
        error = true;
    }
    if(typeof valid_data.sms_template == 'undefined' || valid_data.sms_template == '' ){
        $('#sms_template_span').html('Please select sms template');
        $('#sms_template_span').show();
        error = true;
    }
    if(typeof valid_data.national_sender == 'undefined' || valid_data.national_sender == '' ){
        $('#sms_national_sender_span').html('Please select sms national sender id');
        $('#sms_national_sender_span').show();
        error = true;
    }
    if(typeof valid_data.sms_channel == 'undefined' || valid_data.sms_channel == '' ){
        $('#sms_sms_channel_span').html('Please select sms channel');
        $('#sms_sms_channel_span').show();
        error = true;
    }

    if(typeof valid_data.communication_campaign_category_id != 'undefined' && valid_data.communication_campaign_category_id != '' && valid_data.communication_campaign_category_id == 'add_new_campaign_category'){

        if(typeof valid_data.add_new_campaign_category == 'undefined' || valid_data.add_new_campaign_category == '' ){
            $('#block_add_new_campaign_category_span').html('Please enter campaign type');
            $('#block_add_new_campaign_category_span').show();
            error = true;
        }
    }
    return error;
}
/**
 * validate whatsapp block call by validateSingleBlock
 * @param {array} valid_data
 * @returns {Boolean}
 */
function validateWhatsappSendBlock(valid_data){
    var error = false;
    if(typeof valid_data.block_name == 'undefined' || valid_data.block_name == '' ){
        $('#block_name_span').html('Please enter block name');
        $('#block_name_span').show();
        error = true;
    }
    if(typeof valid_data.whatsapp_template == 'undefined' || valid_data.whatsapp_template == '' ){
        $('#whatsapp_template_span').html('Please select template');
        $('#whatsapp_template_span').show();
        error = true;
    }
    return error;
}

/**
 * validate if else block call by validateSingleBlock
 * @param {array} valid_data
 * @returns {Boolean}
 */
function validateIfElseBlock(valid_data){
    var error = false;
    if(typeof valid_data.block_name == 'undefined' || valid_data.block_name == '' ){
        $('#block_name_span').html('Please enter block name');
        $('#block_name_span').show();
        error = true;
    }
    return error;

}

/**
 * validate if else block call by validateLeadStageBlock
 * @param {array} valid_data
 * @returns {Boolean}
 */
function validateLeadStageBlock(valid_data){
    var error = false;
    if(typeof valid_data.block_name == 'undefined' || valid_data.block_name == '' ){
        $('#block_name_span').html('Please enter block name');
        $('#block_name_span').show();
        error = true;
    }else if(valid_data.block_name == ''){
        $('#lead_stage_span').html('Please select lead stage');
        $('#lead_stage_span').show();
        error = true;
    }
    return error;

}

/**
 * validate if else block call by validateRemoveUserBlock
 * @param {array} valid_data
 * @returns {Boolean}
 */
function validateRemoveUserBlock(valid_data){
    var error = false;
    if(typeof valid_data.block_name == 'undefined' || valid_data.block_name == '' ){
        $('#block_name_span').html('Please enter block name');
        $('#block_name_span').show();
        error = true;
    }
    return error;
}

function validateWebhookRequestBlock(valid_data){
    var error = false;
    if(typeof valid_data.block_name == 'undefined' || valid_data.block_name == '' ){
        $('#block_name_span').html('Please enter block name');
        $('#block_name_span').show();
        error = true;
    }
    if(typeof valid_data.webhook_request == 'undefined' || valid_data.webhook_request == '' ){
        $('#webhook_request_span').html('Please select webhook');
        $('#webhook_request_span').show();
        error = true;
    }
    return error;
}

function getTokensForAutomation(e,college_id,block_type) {
    var template_key = '';
    var form_id = '';

    if(typeof $("#automationListFormId").val() != 'undefined'){
        form_id = $("#automationListFormId").val();
    }

    $.ajax({
        cache: false,
        url: '/communications/change-token',
        type: 'post',
        data: {'applicable_type':e, 'college_id': college_id, 'form_id':form_id, 'template_key' : template_key, 'is_automation': 1},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
            $('div.loader-block').show();
        },
        complete: function() {
            $('div.loader-block').hide();
        },
        success: function (responseObject) {

            if (responseObject.message === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            if(responseObject.status==1){
                ckEditorTokens = eval(responseObject['data']['newtoken']);
                unlayerMergeTags = JSON.parse(responseObject['data']['unlayerMergeTags']);
//                if (typeof(CKEDITOR) != "undefined" && (block_type=='email' || block_type=='notify_user_email')){
//                    for(name in CKEDITOR.instances){
//                        CKEDITOR.instances[name].destroy()
//                    }
//                    initCKEditor(eval(responseObject['data']['newtoken']));
//                }
                var html = '<option value="">--select--</option>';
                jQuery.each(responseObject['data']['newtokenlist'], function (index, value) {
                    html+= '<option value="'+index+'">'+value+'</option>';
                });
                if($("#SMSMappingSeletct").length>0){
                    $("#SMSMappingSeletct").html(html);
                    $("#SMSMappingSeletct").trigger("chosen:updated");
                }
                if($("#EmailMappingSeletct").length>0){
                    $("#EmailMappingSeletct").html(html);
                    $("#EmailMappingSeletct").trigger("chosen:updated");
                }
            }else{
                //alertPopup(responseObject.message, 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

}

function debugBlock(elem,block){
    var data = $(elem).closest("form").serializeArray();

    var al_id = $('#al_id').val();
    var college_id = $('#college_id').val();

    data.push({name: "al_id", value: al_id});
    data.push({name: "college_id", value: college_id});
    data.push({name: "block", value: block});

    $.ajax({
        url: '/automation/ajax-debug-block/',
        type: 'post',
        data: data,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            //$('#graphStatsLoaderConrainer').show();
        },
        complete: function () {
            // hide loader
            //$('#CollegeConfigurationSection .loader-block').hide();
        },
        success: function (html) {
            if (html == "session_logout") {
                window.location.reload(true);
            }
            else if (html == "error") {
                alertPopup('Error','error');
            }
            else{
                $('#MsgBodyDiv').html('');
                alertPopup(html,'success');
                $('#alertTitle').html('Debug Query');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

$(document).on('change', ".allocation_role", function () {
  var allocation_role = $('input[name=allocation_role]:checked').val();
  if(allocation_role === 'unassign'){
      $("#assign-block").hide();
      $("#unassign-block").show();
  }else{
     $("#assign-block").show();
     $("#unassign-block").hide();
  }
});

$(document).on('change', ".stage_type", function () {
  var stage_type = $('input[name=stage_type]:checked').val();
  if(stage_type === 'application'){
      $("#leadStageSection").hide();
      $("#applicationStageSection").show();
  }else{
     $("#leadStageSection").show();
     $("#applicationStageSection").hide();
  }
});

$(document).on('change', 'select#whatsappTemplateList', function () {
    var template_id;
    $('#UploadFileInfoContainerWhatsapp').html('');
    if (this.value){
        getTemplatedDetailById(this.value);
    } else{
        $('#WhatsAppTextArea').val('');;
    }
});

$(document).on('click', '#UploadFileInfoContainerWhatsapp li', function (e) {
    e.preventDefault();
    var ID = $(this).attr('id');
    var fileId = ID.split('_');
    $.ajax({
        url: '/communications/ajax-whatsapp-communication-preview',
        data: {file_id: fileId[1]},
        dataType: "json",
        async: false,
        cache: false,
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $("#ConfirmPopupArea").modal('hide');
        },
        complete: function () {
        },
        success: function (json) {
            if (json['status'] === 1) {
                window.open(json['filePath'], "_blank");
            } else {
                alert('We got some error, please try again later.');
            }
        },
        error: function (response) {
            alertPopup(response.responseText,'error');
        },
        failure: function (response) {
            alertPopup(response.responseText,'error');
        }
    });
});

//Return Html content of predefined ctp files
function getTemplatedDetailById(template_id) {
    $.ajax({
        url: '/communications/get-templated-details-by-id',
        type: 'post',
        data: {template_id: template_id},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('.modalLoader').show();
        },
        complete: function () {
            $('.modalLoader').hide();
        },
        success: function (json) {
            if (json['redirect'])
                location = json['redirect'];
            else if (json['error'])
                alertPopup(json['error'], 'error');
            else if (json['success'] === 200) {

                $('#WhatsAppTextArea').val(json['data']['template_text']);
                $("#WhatsAppTextArea").attr('disabled','disabled');

                $('#UploadFileInfoContainerWhatsapp').html('');
                $('#UploadFileInfoContainerWhatsapp').html(json['data']['file']);
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


function getNewCommunicationTypeForm(elem){
    if(typeof elem !== 'undefined' && elem.value === 'add_new_campaign_category'){
        $('.add_new_campaign_category').show();
    }
    else{
        $('.add_new_campaign_category').hide();
    }
    return;
}


function fixAbandonNodes(hashIds) {
    $('#ConfirmMsgBody').html('Do you want to fix abandon nodes?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                e.preventDefault();
                fixAbandonNodesProcess(hashIds);
                $('#ConfirmPopupArea').modal('hide');
                $('.modal-backdrop').hide();
            });
    return false;
}


function fixAbandonNodesProcess(hashIds){
    var al_id = $('#al_id').val();
    var college_id = $('#college_id').val();
    $.ajax({
        url: '/automation/fix-abandon-nodes/',
        type: 'post',
        data: {'al_id':al_id,'college_id':college_id,'hash_id':hashIds},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            //$('#graphStatsLoaderConrainer').show();
        },
        complete: function () {
            // hide loader
            //$('#CollegeConfigurationSection .loader-block').hide();
        },
        success: function (json) {

            if (typeof json['redirect'] !== 'undefined' && json['redirect'] != "") {
                window.location = json['redirect'];
            }
            else if (typeof json['error'] !== 'undefined' && json['error'] != "") {
                alertPopup('Error','error');
            }
            else{
                //,window.location.href
                alertPopup(json['response'],'success',window.location.href);
                $(document).on('click', '#SuccessPopupArea button.close', function () {
                    window.location.reload(true);
                });
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

function getApplicationSubStages(formId, val, selector, dropdown_class, parent, subStageValue) {
    if ((typeof formId == 'undefined') || (typeof val == 'undefined') || (typeof selector == 'undefined') || (typeof parent == 'undefined')
        || (typeof dropdown_class == 'undefined') || (typeof jsVars.getLeadSubStagesLink == 'undefined')) {
        return;
    }
    if(formId=='NA'){
        formId = $("#formId").val();
    }
    //reset filter
    $('#div_profile_sub_stage').show();
    if ((dropdown_class == 'chosen') && ((val == '') || (val  < 1))) {
        var applicationSubStageHtml = '<label class="floatify__label float_addedd_js">Application Sub Stage</label><select name="'+ selector +'" id="'+ selector +'" class="chosen-select" tabindex="-1"><option value="" selected="selected">Application Sub Stage</option></select>';
        $('#' + parent).html(applicationSubStageHtml);
        $('#' + parent + ' select#'+ selector +'').chosen();
        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        return;
    }

    $.ajax({
        url: jsVars.getLeadSubStagesLink,
        type: 'post',
        data: {'formId': formId, 'stageId': val},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            hideLoader();
        },
        success: function (json) {
            if (json['redirect']) {
                location = json['redirect'];
            } else if (json['error']) {
                alert(json['error']);
            } else  if (json['success'] === 200) {
                $('#div_profile_sub_stage').show();
                if (json['subStageList'] && (dropdown_class == 'chosen')) {
                    var applicationSubStageHtml = '<label class="floatify__label float_addedd_js">Application Sub Stage</label><select name="'+ selector +'" id="'+ selector +'" class="chosen-select" tabindex="-1"><option value="" selected="selected">Application Sub Stage</option>';
                    for(var subStageId in json['subStageList']) {
                        if (json['subStageList'].hasOwnProperty(subStageId)) {
                            applicationSubStageHtml += '<option value="'+ subStageId +'">'+ json['subStageList'][subStageId] +'</option>';
                        }
                    }
                    applicationSubStageHtml += '</select>';
                    $('#' + parent).html(applicationSubStageHtml);
                    $('#' + parent + ' select#'+ selector +'').chosen();
                    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function loadStages(collegeId,formId,selectedStage,selectedSubStage){
  var stage_type    = $('input[name=stage_type]:checked').val();
  $.ajax({
        url: jsVars.FULL_URL + '/automation/ajax-get-stages',
        data: {collegeId: collegeId, formId: formId, stageType: stage_type, selectedStage: selectedStage},
        dataType: "json",
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        success: function (json) {
            if(typeof json['error'] !=='undefined' && json['error'] === 'session') {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(json['error']) {
                alertPopup(json['error'],'error');
            }
            else if(json['status'] === 200) {
                if(stage_type === 'application'){

                    $('#ApplicationStageListSelect').html("<option value=''>Application Stage</option>");
                    $('#application_sub_stage').html("<option value=''>Application Sub Stage</option>");
                    $('#ApplicationStageListSelect').trigger('chosen:updated');
                    $('#application_sub_stage').trigger('chosen:updated');

                    var html = "<option value=''>Application Stage</option>";
                    for (var key in json["applicationStageList"]) {
                        if($.trim(selectedStage)!=='' && selectedStage===key){
                            var stage_sel_val='selected="selected"';
                        }else{
                            var stage_sel_val='';
                        }
                        html += "<option value='" + key + "' "+stage_sel_val+">" + json["applicationStageList"][key] + "</option>";
                    }
                    $('#ApplicationStageListSelect').html(html);
                    if(json['applicationSubStageConfigure']){
                        $("#ApplicationStageListSelect")[0].setAttribute("onchange", "getApplicationSubStages("+formId+",this.value,'application_sub_stage', 'chosen', 'applicationSubStagesDiv')");
                    }
                    $('#ApplicationStageListSelect').trigger('chosen:updated');

                    if(json['applicationSubStageConfigure'] === 1){
                        $("#applicationSubStagesDiv").show();
                        var subStageHtml = "<option value=''>Application Sub Stage</option>";
                        for (var key in json["applicationSubStageList"]) {
                            if($.trim(selectedSubStage)!=='' && selectedSubStage===key){
                                var substage_sel_val='selected="selected"';
                            }else{
                                var substage_sel_val='';
                            }
                            html += "<option value='" + key + "' "+substage_sel_val+">" + json["applicationSubStageList"][key] + "</option>";
                        }
                        $('#ApplicationSubStageListSelect').html(subStageHtml);
                        $('#applicationSubStageList').trigger('chosen:updated');
                    }else{
                        $("#applicationSubStagesDiv").hide();
                        $("#ApplicationSubStageListSelect").html('');
                    }
                }
                else{

                    $('#LeadStageListSelect').html("<option value=''>Lead Stage</option>");
                    $('#lead_sub_stage').html("<option value=''>Lead Sub Stage</option>");
                    $('#LeadStageListSelect').trigger('chosen:updated');
                    $('#lead_sub_stage').trigger('chosen:updated');

                    var html = "<option value=''>Lead Stage</option>";
                    for (var key in json["leadStageList"]) {
                        if($.trim(selectedStage)!=='' && selectedStage===key){
                            var stage_sel_val='selected="selected"';
                        }else{
                            var stage_sel_val='';
                        }
                        html += "<option value='" + key + "' "+stage_sel_val+">" + json["leadStageList"][key] + "</option>";
                    }
                    $('#LeadStageListSelect').html(html);
                    if(json['subStageConfigure']){
                        $("#LeadStageListSelect")[0].setAttribute("onchange", "getLeadSubStages("+collegeId+",this.value,'lead_sub_stage', 'chosen', 'leadSubStagesDiv')");
                    }
                    $('#LeadStageListSelect').trigger('chosen:updated');

                    if(json['subStageConfigure'] === 1){
                        $("#leadSubStagesDiv").show();
                        var subStageHtml = "<option value=''>Lead Sub Stage</option>";
                        for (var key in json["leadSubStageList"]) {
                            if($.trim(selectedSubStage)!=='' && selectedSubStage===key){
                                var substage_sel_val='selected="selected"';
                            }else{
                                var substage_sel_val='';
                            }
                            subStageHtml += "<option value='" + key + "' "+substage_sel_val+">" + json["leadSubStageList"][key] + "</option>";
                        }
                        $('#LeadSubStageListSelect').html(subStageHtml);
                        $('#LeadSubStageListSelect').trigger('chosen:updated');
                    }else{
                        $("#leadSubStagesDiv").hide();
                        $("#LeadSubStageListSelect").html('');
                    }

                }


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

function viewAutomationPerformance(alId){
    var collegeId = $("#college_id").val();
    $.ajax({
        url: jsVars.FULL_URL+'/communications/get-automation-performance',
        type: 'post',
        data: {'al_id':alId,'s_college_id':collegeId},
        dataType: 'html',
        async: false,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
        },
        success: function (data) {
            if (data === "session_logout") {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (data === 'invalid_request'){
                alertPopup("Invalid request.","error");
            } else {
                $("#all-performances .modal-body").html(data);
                $("#all-performances").modal('show');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

function getTemplateTextBodySubject(templateId) {
   var jsonData = {'body':'','subject':''};
   $.ajax({
       url: jsVars.communicationTemplateIframe,
       data: {template_id: templateId},
       dataType: "json",
       async: false,
       cache: false,
       type: "POST",
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       beforeSend: function () {
           $('body div.loader-block').show();
           $("#ConfirmPopupArea").modal('hide');
       },
       complete: function () {
           $('body div.loader-block').hide();
       },
       //contentType: "application/json; charset=utf-8",
       success: function (json) {
           if (typeof json['error'] != 'undefined' && json['error'] == 'session_logout') {
//                returnHTML = json['template_text'];
               location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
           }
           else if (typeof json['error'] != 'undefined' && json['error'] == 'invalid_request') {
               jsonData['body'] = 'We got some error, please try again later.';
               alertPopup(jsonData['body'], 'error');
           }
           else{
               jsonData['body'] = json['body'];
               jsonData['subject'] = json['subject'];
           }
       },
       error: function (response) {
           console.log(response.responseText);
       },
       failure: function (response) {
           console.log(response.responseText);
       }
   });
   return jsonData;
}


function loadTemplateIframe(val){
    if(val == 'ck' || val == 'unlayer'){
        return;
    }
    html = getTemplateTextBodySubject(val);
    if(typeof html.body != 'undefined'){
        $('#preview-container').html(html.body);
    }
    if(typeof html.subject != 'undefined'){
        $('#subject').val(html.subject);
    }

    setTimeout(function(){
        $('#preview-container iframe').show();
    }, 1000);
}