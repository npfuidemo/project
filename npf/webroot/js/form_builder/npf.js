var sortable_data;
var elemdragstart = false;
var default_show_class_previous = required_previous = isTable = '';
function InsertRow(elem, where){
    // find parent page section break
//console.log(elem);
    var page_sec = jQuery(elem).closest('.onerow').prev().data('r_page_section');
    var one_row_page_sec = 1;

    if(typeof page_sec != 'undefined' && page_sec>0)
        one_row_page_sec = page_sec;
    var html='<div data-r_page_section="'+one_row_page_sec+'" class="onerow"><div class="clearfix"><div class="panelListSelect col-lg-12"><div class="btn-group pull-right pagination"><button aria-expanded="false" aria-haspopup="true" data-toggle="dropdown" class="dropdown-toggle" type="button"><i class="fa fa-fw fa-cog"></i></button><ul class="dropdown-menu exclude"><li><a href="javascript:void(0)" onclick="return splitCol(this);" data-split="1">Column 1</a></li><li><a href="javascript:void(0)" onclick="return splitCol(this);" data-split="2">Column 2</a></li><li><a href="javascript:void(0)" onclick="return splitCol(this);" data-split="3">Column 3</a></li><li><a href="javascript:void(0)" onclick="return splitCol(this);" data-split="4">Column 4</a></li><li class="divider"></li><li><a href="javascript:void(0)" onclick="return InsertRow(this,\'above\');">Insert Row Above</a></li><li><a href="javascript:void(0)" onclick="return InsertRow(this,\'below\');">Insert Row Below</a></li></ul></div></div></div><div class="column1 col-md-12"><ul class="con"></ul></div></div>';

    if(where=="above"){
        jQuery(elem).parents('.onerow').before(html);
    }
    else if(where=="below"){
        jQuery(elem).parents('.onerow').after(html);
    }
    
    activesortable();
    deactive_sortable();
}

function RemoveGroupField(id,hidden_id) {
    
    $('#ConfirmMsgBody').html('All data associated with this field will be deleted. Are you sure you want to delete this element?');
    $('#confirmYes').unbind('click');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false});
    $('#confirmYes').click(function (e) {
            e.preventDefault();
            
    if(hidden_id !='' && (typeof hidden_id !='undefined')){
        
    removeFromArray(hidden_id);
    delete_machine_key(hidden_id);
    $('#' + id).remove();
    
    jQuery('#'+id).parents('.onerow').each(function(){
        
        if(jQuery(this).find('.page_break').length<1){
            //console.log(jQuery(this).find('.second_ul>li').not('.pagination li').length);
            if(jQuery(this).find('.second_ul>li').not('.pagination li').length == 0)
            {
                jQuery(this).find('.con').sortable('destroy');
                jQuery(this).remove();
            }
        }
    });

    }else{
        
        jQuery('#'+id).find('div').each(function(){
            
            
            var s = jQuery(this).attr('id');
            if(typeof s !='undefined' && s.match(/main_div_[a-zA-Z0-9]+/ig)){
                
                var id_ar = s.split('main_div_');
                removeFromArray(id_ar[1]);
                delete_machine_key(id_ar[1]);
            }else{
                
            }
        });
        
        
        jQuery('#'+id).find('.con').sortable('destroy');
        $('#' + id).remove();
        
           
        jQuery('[id^="li_group_'+id+'_"]').find('div').each(function(){
            
            
            var s = jQuery(this).attr('id');
            if(typeof s !='undefined' && s.match(/main_div_[a-zA-Z0-9]+/ig)){
                
                var id_ar = s.split('main_div_');
                //console.log(id_ar[1]);
                removeFromArray(id_ar[1]);
                delete_machine_key(id_ar[1]);
            }
        });
        //console.log(jQuery('[id^="li_group_'+id+'_"]').parents('.column1').find('.con').length)
        jQuery('[id^="li_group_'+id+'_"]').parents('.column1').find('.con').sortable('destroy');
        jQuery('[id^="li_group_'+id+'_"]').parents('.column1').remove();
        //console.log(jQuery('[id^="li_group_'+id+'_"]').parents('.column1').length);

    }
    
    $('#ConfirmPopupArea').modal('hide');
        });
//    if (confirmed) {
//        
//    
//    }
    //console.log(jQuery('.onerow').find('ul.con li ul.second_ul li').length);
}

function AddElementForGroups(id, field_type, parent_id, label, attributes, li_id, show_class) {
   

    next_id = parseInt($('#total_' + field_type).val()) + 1;
    var hidden_id = field_type + next_id;

    var obj = jQuery.parseJSON(attributes);
    var str = new Array();

    var st = {'name': 'hidden_id', 'value': hidden_id};
    str.push(st);
    var st = {'name': 'parent_id', 'value': parent_id};
    str.push(st);

    var st = {'name': 'show_class', 'value': show_class};
    str.push(st);

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if(key=='machine_key'){
                // if machine key is already assigned then do not allow assigned to new elements
                if(typeof jsVars.machine_key[obj[key]] != 'undefined' && (jsVars.machine_key[obj[key]]==false || jsVars.machine_key[obj[key]]=="false")){
                    var st = {'name': key, 'value': obj[key]};
                    str.push(st);
                    jsVars.machine_key[obj[key]]=true;
                }
            }else{
                var st = {'name': key, 'value': obj[key]};
                str.push(st);
            }
            

        }
    }
    
    
    var settings='<div class="btn-group pull-right settings_cog"><i class="fa fa-fw fa-cog pull-right dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i><ul class="dropdown-menu exclude"><li><a data-page="'+page_section_count+'" onClick="return RemoveGroupField(\'' + li_id + '\',\''+hidden_id+'\');" data-widget="remove" href="javascript:void(0)">Remove</a></li><li><a onclick="LoadAttributes(\'' + field_type + '\',\'' + hidden_id + '\',\'' + parent_id + '\',\'' + show_class + '\')" href="javascript:void(0)">Edit Settings</a></li></ul></div>';


    var html = '<div id="main_div_' + hidden_id + '" class="col-md-12 ' + field_type + '"><div class="box boxFormElements arrow_box"><div class="box-header with-border"><h3 id="label_' + hidden_id + '"  class="box-title" >' + label + '</h3>'+settings+'</div><div class="box-body" id="field_show_' + hidden_id + '"></div></div><div class="clearfix"></div></div>';


    $('#' + id).html(html);
    $('#total_' + field_type).val(next_id);

    global_data["serialize_" + hidden_id] = str;
    //console.log(global_data["serialize_" + hidden_id] );

    FieldShow(field_type, hidden_id);
    // document.write(markup);
    activesortable();
    deactive_sortable();
    
    showHideSavePreviewButton();
    
 
}

function GotoBottom(){
    
        jQuery('html, body').animate({
            scrollTop: jQuery(document).height()
        }, 500);
    
}

function FieldShow(field_type, hidden_id) {
    var selected_field = global_data["serialize_" + hidden_id];
    $.ajax({
        url: '/form/view_fields',
        type: 'post',
        dataType: 'html',
        async: false,
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "attributes": selected_field,
            "field_type": field_type
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            //$('#field_show_'+hidden_id).html("aaa");     
            $('#field_show_' + hidden_id).html(data);
            //field_show_textbox1
            //console.log(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            // console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
    if(field_type=='table_cell_wise'){
     changeCellLabel(hidden_id);   
    }
     
    return false;

}
function AddGroup(field_type) {
    
    jQuery.LoadingOverlay("show");
    
    
    next_id = parseInt($('#total_' + field_type).val()) + 1;
    var hidden_id = field_type + next_id;
    
    if(field_type=="parent_details"){
         single_parent_id = parseInt($('#total_father_details').val()) + 1;
         //var hidden_id = field_type + next_id;
         $('#total_father_details').val(single_parent_id);
         $('#total_mother_details').val(single_parent_id);
         
        
    }
    
    //$('#work_area').append('<div class="'+field_type+'" onclick="LoadAttributes(\''+field_type+'\',\''+hidden_id+'\')">'+field_type+'<input type="text" value="'+hidden_id+'"  id="'+hidden_id+'"><input type="text"  value=""  id="serialize_'+hidden_id+'"></div>');
    //var markup = jQuery('<div id="label_' + hidden_id + '" class="' + field_type + '" onclick="LoadAttributes(\'' + field_type + '\',\'' + hidden_id + '\')">' + field_type + '</div> | <a href="#" onClick="return removeElement(this);">remove</a>');

addFirstPageBreak();

    $.ajax({
        url: '/form/get_fields',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            field_type: field_type,
            hidden_id: hidden_id,
            r_page_section: page_section_count
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
           
            $('#total_' + field_type).val(next_id);
            //$('#popup_window').html(data);
            $('#work_area').append(data);
            activesortable();
            deactive_sortable();
            // console.log(data);
            jQuery.LoadingOverlay("hide");
           GotoBottom();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
    showHideSavePreviewButton();
    return false;
}

function AddElement(field_type) {
     jQuery.LoadingOverlay("show");
    var is_valid = 'yes';
    var split = 'yes';
    var is_drag = 'yes';
    next_id = parseInt($('#total_' + field_type).val()) + 1;
    var hidden_id = field_type + next_id;
    //$('#work_area').append('<div class="'+field_type+'" onclick="LoadAttributes(\''+field_type+'\',\''+hidden_id+'\')">'+field_type+'<input type="text" value="'+hidden_id+'"  id="'+hidden_id+'"><input type="text"  value=""  id="serialize_'+hidden_id+'"></div>');

    if (field_type == 'section_break' || field_type == 'page_break') {
        split = 'no';
        is_valid = checkInvalidBreak(field_type);
        if (is_valid == 'no') {
            jQuery.LoadingOverlay("hide",true);
            alertPopup("cannot insert pagebreak",'error');
            return false;
        } else {
//            if (field_type == 'page_break')
//                page_section_count += 1;
        }
    }

   

    if (field_type == 'page_break') {

        if(jQuery('.onerow').length>0)
            page_section_count += 1;
        
        
        var settings='<div class="btn-group pull-right settings_cog"><i class="fa fa-fw fa-cog pull-right dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i><ul class="dropdown-menu exclude"><li><a data-page="'+page_section_count+'" onClick="return removeElement(this,\'page_break\');" data-widget="remove" href="javascript:void(0)">Remove</a></li><li><a onclick="LoadAttributes(\'' + field_type + '\',\'' + hidden_id + '\',\'\')" href="javascript:void(0)">Edit Settings</a></li></ul></div>';
        
       // var html = '<div id="main_div_' + hidden_id + '" class="col-md-12 ' + field_type + '"><div class="box boxFormElements arrow_box"><div class="box-header with-border"><h3 id="label_' + hidden_id + '"  class="box-title" onclick="LoadAttributes(\'' + field_type + '\',\'' + hidden_id + '\',\'\')" data-page="' + page_section_count + '">' + "" + ' <span>Page ' + page_section_count + ' </h3><div class="box-tools pull-right"><button class="btn btn-box-tool" data-widget="remove" onClick="return removeElement(this,\'page_break\');" data-page="' + page_section_count + '"><i class="fa fa-times"></i></button></div></div><div class="box-body" id="field_show_' + hidden_id + '"></div></div></div>';
        var html = '<div id="main_div_' + hidden_id + '" class="col-md-12 ' + field_type + '"><div class="box boxFormElements arrow_box"><div class="box-header with-border"><h3 id="label_' + hidden_id + '"  class="box-title" data-page="' + page_section_count + '">' + "" + ' <span>Page ' + page_section_count + ' </h3>'+settings+'</div><div class="box-body" id="field_show_' + hidden_id + '"></div></div></div>';


        var markup = jQuery(html);
        
    } else {
        // insert first element page break
      addFirstPageBreak();
      
      var mandatory_fld="";
      if(field_type=="heading" || field_type=="instructions" || field_type=="section_break" || field_type=="blank_space"){}
      else { mandatory_fld=""; }
        
       var settings='<div class="btn-group pull-right settings_cog"><i class="fa fa-fw fa-cog pull-right dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i><ul class="dropdown-menu exclude"><li><a data-page="'+page_section_count+'" onClick="return removeElement(\'' + hidden_id + '\');" data-widget="remove" href="javascript:void(0)">Remove</a></li><li><a onclick="LoadAttributes(\'' + field_type + '\',\'' + hidden_id + '\',\'\')" href="javascript:void(0)">Edit Settings</a></li></ul></div>';
        
       //var html = '<div id="main_div_' + hidden_id + '" class="col-md-12 ' + field_type + '"><div class="box boxFormElements arrow_box"><div class="box-header with-border"><h3 id="label_' + hidden_id + '"  class="box-title" onclick="LoadAttributes(\'' + field_type + '\',\'' + hidden_id + '\',\'\')" data-page="' + page_section_count + '">' + "" + ' <span>Page ' + page_section_count + ' </h3>'+settings+'</div><div class="box-body" id="field_show_' + hidden_id + '"></div></div></div>';
       
       var html = '<div id="main_div_' + hidden_id + '" class="col-md-12 ' + field_type + '"><div class="box boxFormElements arrow_box"><div class="box-header with-border"><h3 id="label_' + hidden_id + '"  class="box-title" >' + titleCase(field_type) +mandatory_fld+'</h3>'+settings+'</div><div class="box-body" id="field_show_' + hidden_id + '"></div></div></div>';
    
        var markup = jQuery(html);
    }

    $('#total_' + field_type).val(next_id);


    var rownum = countRow();
    var onerow = add_row(rownum, split);
    
    if(field_type=='page_break')
        jQuery(onerow).addClass('page_break_section');
    
    add_columns(1, onerow, 'col-md-12', markup);
    activesortable();
    deactive_sortable();

    InitializeArray(field_type, hidden_id, '');// this will load by default for this field
    
     
showHideSavePreviewButton();
}


function InitializeArray(field_type, hidden_id, parent_id) {
    
    $.ajax({
        url: '/form/get_attributes',
        type: 'post',
        dataType: 'html',
        async: false,
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            field_type: field_type,
            hidden_id: hidden_id,
            parent_id: parent_id

        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            var data = $('#raw_data').serializeArray(); // serialize the data
            global_data["serialize_" + hidden_id] = data; // store the data
            FieldShow(field_type, hidden_id); // load the fields
            jQuery.LoadingOverlay("hide",true); 
            GotoBottom();

        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });


    return false;

}

function SerializeData(field_type, hidden_id, hide_popup_window) {

    var data = $('#raw_data').serializeArray();

//     $('#serialize_'+hidden_id).val(data); // can be removed
    global_data["serialize_" + hidden_id] = data;
    //console.log(global_data["serialize_" + hidden_id]);
    //global_data["position_" + hidden_id] = "1,1,1";
    //global_data["page_number_" + hidden_id] = "1";

   if(hide_popup_window!=false){
        $('#popup_window').toggle("slide");
   }

    if ($('#label').val() != "") {
        var append = "";
        if ($('#required').val() == "true") {
            append = "*";
        }
        
        var str = $('#label').val() + " " + append;
        $('#label_' + hidden_id).html(str.replace(/\n/g, "<br />"));
    }
    
    delete_machine_key(hidden_id);
    
    if (typeof $('#machine_key').val() != "undefined" && $('#machine_key').val() != "" ) {
        var new_machine_selected_key = jQuery('#machine_key').val();
        jsVars.machine_key[new_machine_selected_key] = true;
        jsVars.machine_selected[hidden_id]=new_machine_selected_key;
    }
    
    
    // No Need to Show the reflection in right part just after the click
    //FieldShow(field_type, hidden_id);
   
    
//    // alert(global_data[hidden_id]);

}

function LoadAttributes(field_type, hidden_id, parent_id,show_class) {
    
     jQuery.LoadingOverlay("show"); 
    if(typeof show_class == 'undefined'){
        show_class = '';
    }
    $('#popup_window').hide();
    $('#popup_window').toggle("slide");
    //global_data["serialize_"+hidden_id]={}; 
    $('#popup_window').html('Loading...');
    selected_data = global_data["serialize_" + hidden_id];
    
    var form_id = $('#cs_form_id').val();
    
    $.ajax({
        url: '/form/get_attributes',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            field_type: field_type,
            hidden_id: hidden_id,
            parent_id: parent_id,
            selected_data: selected_data,
            show_class  :show_class,
            form_id: form_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            //dataFill(hidden_id);
            LoadSlimScroll();
            
             jQuery.LoadingOverlay("hide",true);
             $('.chosen-select').chosen();
     $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}
/* display all conditional logic  */
function getConditionList(form_id){
    
    $.ajax({
        url: '/form/conditional_list',
        type: 'post',
        dataType: 'html',
        data: {
            form_id: form_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            
            LoadSlimScroll();
             jQuery.LoadingOverlay("hide",true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

function createConditionalLogic(form_id){
    
     $.ajax({
        url: '/form/conditional_add',
        type: 'post',
        dataType: 'html',
        data: {
            form_id: form_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            
            LoadSlimScroll();
             jQuery.LoadingOverlay("hide",true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

function conditionalLoad(form_id,load_do_action){
    var if_condition_form_count = jQuery('.if_condition_form').length;
    if(typeof load_do_action == 'undefined'){
        load_do_action='';
    }
    $.ajax({
        url: '/form/conditional_load',
        type: 'post',
        dataType: 'html',
        data: {
            form_id: form_id,
            if_form_count:if_condition_form_count,
            load_do:load_do_action
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            
            var inserted = jQuery('.condition_set').length;
            
            if(inserted>0){
                jQuery('.add_more_if').remove();
                jQuery('.condition_set').last().after(data);
            }else{
                $('#conditional_inner_set').append(data);
            }
            
            if(data == 'please first add field and submit form'){
                jQuery('#conditional_submit_button').hide();
            }
            addConditionJoin();
            LoadSlimScroll();
             jQuery.LoadingOverlay("hide",true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
    
}

function getConditional(id,count,getCondition_val) {
    
    if(typeof getCondition_val == 'undefined'){
        getCondition_val='option_1';
    }
    jQuery.LoadingOverlay("show");     
    $.ajax({
        url: '/form/conditional',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            form_id: id,
            count: count,
            getCondition:getCondition_val
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            var inserted = jQuery('.condition_set').length;
            
            if(inserted>0){
                jQuery('.add_more').remove();
                jQuery('.condition_set').last().after(data);
            }else{
                $('#conditional_inner_set').append(data);
            }
            LoadSlimScroll();
             jQuery.LoadingOverlay("hide",true);
             
             if(getCondition_val!='edit')
                addConditionJoin();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

function displayConditionalPage(form_id){
        $('#popup_window').show();
        getConditionList(form_id);  
}


function loadIfValue(id_num,form_id,selected){    
    var if_value = jQuery('#if_'+id_num).val();
    disable_do_field_value(if_value);
    jQuery("#value_type_option_"+id_num).hide();
    
    if(typeof selected == 'undefined'){
        selected ="";
        jQuery("#value_type_option_"+id_num).find('[type="radio"]').each(function(){
            $(this).prop('checked', false);
        });
        jQuery('#state_'+id_num).val("");
    }
    
    jQuery('#value_div_'+id_num).find('.input').html('');
    var part_f = if_value.split(':');
    if(typeof part_f[2] != 'undefined' && part_f[2]=='textbox'){
        jQuery("#value_type_option_"+id_num).show();
    }else if(typeof part_f[2] != 'undefined' && part_f[2]=='date'){
        jQuery("#value_type_option_"+id_num).show();
    }else{
        jQuery("#value_div_"+id_num).prev('label').show();
        jQuery("#value_div_"+id_num).show();
        var select_html = $('<select>')
            .attr({name:'condition['+id_num+'][field_value][]', id:'field_value_'+id_num});
            jQuery("#value_div_"+id_num).find('.input').append(select_html);
           select_html.append($("<option>").attr('value',"").text('--Select--'));
        jQuery.ajax({
            url: '/form/conditional_value',
            type: 'post',
            dataType: 'json',
            data: {
                "if_value": if_value,
                "form_id": form_id
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                
                select_html.find('option').remove().end().append('<option value="">--Select--</option>');
                for (var val in data) {
                    jQuery('<option />', {value: data[val], text: data[val]}).appendTo(select_html);
                }

                if(selected.length>0){
//                    alert(jQuery(select_html).find('option[value="'+selected+'"]').length);
//                   jQuery('#field_value_'+id_num+' option[value="'+selected+'"]').attr('selected',true);
                   jQuery(select_html).find('option[value="'+selected+'"]').attr('selected',true);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                 console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
       });
    }
    // edit mode
    if(selected==''){
        var state_value = $('#state_'+id_num).val();
        if('equal_to_not_empty'==state_value ||  'equal_to_empty' == state_value ){
            jQuery("#value_type_option_"+id_num).hide();
            jQuery("#value_div_"+id_num).prev('label').hide();
            jQuery("#value_div_"+id_num).hide();
        }
    }
    
}

function getDoClone() {
    var i    =  jQuery('.do_section>div').length;
    var doid =  jQuery('.do_section>div').last().attr('id');
    doid = doid.replace('_','');
    doid = parseInt(doid);
    
    if(doid>=i){
        i = parseInt(doid+1);
    }
    var doClone = jQuery('.do_section>div').eq(0).clone();
    
    jQuery(doClone).attr('id','_'+i);
    jQuery(doClone).find('select').removeAttr('multiple');
    jQuery(doClone).find('select').each(function(){
        this.name = this.name.replace('[0]','['+i+']');
    });
    jQuery(doClone).find('textarea').each(function(){
        this.name = this.name.replace('[0]','['+i+']');
    });
    
    jQuery('.do_section').append(doClone);
}

function changeDoField(do_select){
    
    jQuery(do_select).parents('.inner_do_section').find('.do_field').show();
    jQuery(do_select).parents('.inner_do_section').find('.do_textarea').remove();
    var dval = jQuery(do_select).val();
    //alert(dval);
    if(dval=='show_multiple' || dval=='hide_multiple'){
        jQuery(do_select).parents('.inner_do_section').find('.do_field').attr('multiple','multiple');
    }else if(dval=='show_error'){
        // hide
        jQuery(do_select).parents('.inner_do_section').find('.do_field').hide();
        // get name
        var do_field_name  = jQuery(do_select).parents('.inner_do_section').find('.do_field').attr('name');
        do_field_name = do_field_name.replace('[do_field]','[textarea_field]');
        
        // create textarea
        var textarea_html = jQuery('<textarea/>')
        .attr({ name:do_field_name, placeholder:'enter error string',class:'do_textarea'})
        .css('width','100%');
        jQuery(do_select).parents('.inner_do_section').append(textarea_html);
    }else{
        jQuery(do_select).parents('.inner_do_section').find('.do_field').removeAttr('multiple');
        
    }
}

function addConditionJoin(default_val){
    
     var condition_set = jQuery('.if_condition_form').length;
     
     if(condition_set>1){
         
          var condition_join_html = jQuery('<div></div>').addClass('condition_join input select');
          var label = jQuery('<label></label>').attr('for','condition_join_select').html('Apply For');
          
          jQuery('.condition_join').remove();
          jQuery('.if_condition_form').last().after(condition_join_html);
          jQuery('.condition_join').append(label);
          
          
          var opt_data = {0:'--Select--','and': 'All', 'or': 'Any'};
                var s1 = jQuery('<select />').addClass('condition_join_select').attr('name','condition_join_select');
                for (var val in opt_data) {
                    jQuery('<option />', {value: val, text: opt_data[val]}).appendTo(s1);
                }
                var select_elem = jQuery('.condition_join').append(s1);
                
                if(typeof default_val !='undefined'){
                    jQuery(select_elem).find('option[value="'+default_val+'"]').attr('selected','selected')
                }
     }
}


function disable_do_field_value(val){
    jQuery('.do_field').each(function(){
        jQuery(this).find('option').each(function(){
            if(jQuery(this).val()==val){
                jQuery(this).prop('selected',false);
                jQuery(this).prop('disabled',true);
            }
        });
    });
}

function removeCondition(id){
    if(jQuery('.condition_set').length<=1){
        alertPopup('Cant remove particular condition, please click on "remove all conditions" link');
        return false;
    }
    
    var val = jQuery("#"+id).val();
    jQuery('#'+id).parents('.condition_set').remove();
    
    jQuery('.do_field').each(function(){
        jQuery(this).find('option').each(function(){
            if(jQuery(this).val()==val){
                jQuery(this).removeAttr('disabled');
            }
        });
    });
}



function removeDoAction(element){
     if(jQuery('.inner_do_section').length<=1){
        alertPopup('Cant remove particular condition, please click on "remove all conditions" link');
        return false;
    }
    jQuery(element).parents('.inner_do_section').remove();
    
}

function removeConditionDB(id,form_id){
    if(typeof form_id == 'undefined'){
        form_id = 0;
    }

    $('#ConfirmMsgBody').html('are you sure to delete condition?');
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmYes', function (e) {
        e.preventDefault();
        jQuery.ajax({
            url: '/form/conditional_delete',
            type: 'post',
            dataType: 'html',
            data: {
                "condition_id": id,
                "form_id"     : form_id
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                //alert(data);
                jQuery('#condition_id_'+id).remove();
            },
            error: function (xhr, ajaxOptions, thrownError) {
               // alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                 console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
       });     
       
       $('#ConfirmPopupArea').modal('hide');
    });
}

function closeConditionWinow(){
 
    jQuery('#popup_window').html('');
    jQuery('#popup_window').hide("left");
}
function checkDoFieldAlreadySelected(elem){
    
    var value = jQuery(elem).val();
    jQuery('.do_field').not(elem).each(function(){
        
        if(jQuery(this).val()==value){
            jQuery(elem).find('option[value="'+value+'"]').prop("selected", false)
            //console.log(jQuery(this).val());
            alertPopup("duplicate action section error",'error');
            return;
        }
    });
}

function editCondition(id){
    
         $.ajax({
        url: '/form/conditional_edit',
        type: 'post',
        dataType: 'html',
        data: {
            condition_id: id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            
            LoadSlimScroll();
             jQuery.LoadingOverlay("hide",true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
    
}



function AutoSaveFormNew(preview_link,draft,type) {
    //setTimeout("AutoSaveForm()",60000);
    var FinalPostArray = new Array();
    var ct = 0;
    var get_elempos = getElemPosition(); 
    var data=new Array();
//    console.log(get_elempos);
//    return false
    for (var key in global_data) {

        // get position and page number
        var id_array = key.split("serialize_");
        var hidden_id = id_array[1];

        //console.log(get_elempos);
        for (var i = 0; i < get_elempos.length; i++) {
            var pos_info = get_elempos[i];

            if (pos_info.id == hidden_id) {
                var pageObj = {'name': 'page', 'value': pos_info.p_sec};
                var positionObj = {'name': 'position', 'value': pos_info.row + ',' + pos_info.col + ',' + pos_info.pos}
                //return false;
            }
        }
        global_data[key].push(pageObj, positionObj);
        FinalPostArray[ct] = global_data[key];
        //console.log(FinalPostArray[ct]);
        data.push({name: key, value:  JSON.stringify(FinalPostArray[ct])});
        ct++;
    }
//    
//    if(FinalPostArray.length<1){
//        return false;
//    }
      //console.log(data);
    //global_data=JSON.stringify(global_data);
     jQuery.LoadingOverlay("show");
   
     data.push({name: "form_id", value: jsVars.form_id});
    
    //console.log(FinalPostArray)
    $.ajax({
        url: '/form/create_form/'+jsVars.college_id+'/'+jsVars.form_id,
        type: 'post',
        dataType: 'html',
        data:  data,//'field_type='+field_type+'&hidden_id='+hidden_id.value,
        /*data: {
            "attributes": FinalPostArray,
            "form_id":jsVars.form_id
        },*/
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
           $('#div_auto_save').fadeOut("slow");
           
            if(draft!="draft" && draft!="exit"){
             
               if(type=="mobile"){
                    var newWin= window.open('/form/preview/'+preview_link, '_blank', 'width=420, height=600, left=400, scrollbars=yes');
               }
               else{
                     var newWin= window.open('/form/preview/'+preview_link, '_blank', 'width=1024, height=700, left=200, scrollbars=yes');
               }
                setTimeout("window.location.reload();",3000);
               
            }else if(data){
                var responseObject = $.parseJSON(data);
                if(responseObject.data.errormsg){
                    var r = confirm(responseObject.data.errormsg);
                    
                }else if (responseObject.data.error == 1) {
                    var r = confirm("There is some error while saving this form. You last changes will not reflect.");
                }
                window.location.reload();
            }
             else if(draft=="exit"){
                window.location = '/form/manage-form';  
             }
             else{
                window.location.reload();
            }
           //$('#div_auto_save').html("&nbsp;");
           
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
             console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
    
}


function AutoSaveForm(preview_link,draft,type) {
    AutoSaveFormNew(preview_link,draft,type);
    return false;
  /*
    var FinalPostArray = new Array();
    var ct = 0;
    var get_elempos = getElemPosition(); 

    for (var key in global_data) {

        // get position and page number
        var id_array = key.split("serialize_");
        var hidden_id = id_array[1];

        //console.log(get_elempos);
        for (var i = 0; i < get_elempos.length; i++) {
            var pos_info = get_elempos[i];

            if (pos_info.id == hidden_id) {
                var pageObj = {'name': 'page', 'value': pos_info.p_sec};
                var positionObj = {'name': 'position', 'value': pos_info.row + ',' + pos_info.col + ',' + pos_info.pos}
                //return false;
            }
        }
        global_data[key].push(pageObj, positionObj);
        FinalPostArray[ct] = global_data[key];
        ct++;
    }
    
     jQuery.LoadingOverlay("show");
     
    
    $.ajax({
        url: '/form/create_form/'+jsVars.college_id+'/'+jsVars.form_id,
        type: 'post',
        dataType: 'json',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "attributes": FinalPostArray,
            "form_id":jsVars.form_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
          
           $('#div_auto_save').fadeOut("slow");
           if(draft!="draft"){
             
               if(type=="mobile"){
                     var newWin= window.open('/form/preview/'+preview_link, '_blank', 'width=420, height=600, left=400, scrollbars=yes')
               }
               else{
                     var newWin= window.open('/form/preview/'+preview_link, '_blank', 'width=1024, height=700, left=200, scrollbars=yes')

               }
               
                if(!newWin || newWin.closed || typeof newWin.closed=='undefined')
                 {
                      setTimeout("window.location.reload();",10000);
                      return false;
                 }
            }

            //window.location.reload();
           //$('#div_auto_save').html("&nbsp;");
           
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
             console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;*/
    
}

function SaveForm() {
    return false;
   /* jQuery.LoadingOverlay("show");
    $('#popup_window').hide();
  
    var FinalPostArray = new Array();
    var ct = 0;
    var get_elempos = getElemPosition();
    

    for (var key in global_data) {

        // get position and page number
        var id_array = key.split("serialize_");
        var hidden_id = id_array[1];

        //console.log(get_elempos);
        for (var i = 0; i < get_elempos.length; i++) {
            var pos_info = get_elempos[i];

            if (pos_info.id == hidden_id) {
                var pageObj = {'name': 'page', 'value': pos_info.p_sec};
                var positionObj = {'name': 'position', 'value': pos_info.row + ',' + pos_info.col + ',' + pos_info.pos}
                //return false;
            }
        }


        global_data[key].push(pageObj, positionObj);

        FinalPostArray[ct] = global_data[key];
        //global_data["position_" + hidden_id] = "1,1,1";
        //global_data["page_number_" + hidden_id] = "1";
        ct++;
    }
    
    if(FinalPostArray.length<1){
        jQuery.LoadingOverlay("hide",true);
        alertPopup("Please insert elements before saving the form");
        return false;
    }
    
    
    
    // return false;
    $('#loadResult').html('Loading...');
    
    
    $.ajax({
       url: '/form/create_form/'+jsVars.college_id+'/'+jsVars.form_id,
        type: 'post',
        dataType: 'json',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "attributes": FinalPostArray,
            "form_id":jsVars.form_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            jQuery.LoadingOverlay("hide",true);
            
           // alertPopup("Form successfully saved",'success','/form/manage-form');
            window.location = '/form/manage-form';
//            $('#loadResult').html(data);
             
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
             console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;*/
}

// drag and drop 

function countRow() {

    var rownum = jQuery('.onerow').last().data('row');
    if (typeof rownum == 'undefined') {
        rownum = 1;
    } else {
        rownum = rownum + 1;
    }
    return rownum;
}

function remove_columns(num, onerow) {
    var i = 0;
    var _num = Math.abs(num);
    
    removeFromArray();
    
    // priority empty column delete
    
    jQuery(onerow).find('.column1').each(function () {

        if (jQuery(this).find('li').length == 0 && i < _num) {
            jQuery(this).find('.con').sortable('destroy');
            
            jQuery(this).remove();
            i++;
        }

    });


    // if empty is > then num to delete
     
    if (i < _num) {
        var confirmed = true; //confirm("All data associated with this field will be deleted. Are you sure you want to delete this element?");

        if (confirmed) {

            var new_num = eval(_num - i);

            for (var j = 0; j < new_num; j++) {

                jQuery(onerow).find('.column1').last().find('.con').sortable('destroy');

                jQuery(onerow).find('.column1').last().find('li').each(function(){

                    jQuery(this).find('div').each(function(){
                        var id_m = jQuery(this).attr('id');
                        if(typeof id_m !='undefined' && id_m.match(/main_div_[a-zA-Z0-9]+/ig)){

                            var id_ar = id_m.split('main_div_');
                            removeFromArray(id_ar[1]);
                        }
                    });
                });


                jQuery(onerow).find('.column1').last().remove();
            }

        }
    }

//                sortable_data.sortable('enable');
//                sortable_data.sortable("refresh");
//                sortable_data.sortable('enable');


    //sortable_data.sortable('enable');
    //sortable_data.sortable('disable');

}

function add_row(rownum, split) {

    if (split == 'no') {
        var s1 = '';
    } else {
        // dynamic options value
        /*var opt_data = {1: '1 column', 2: '2 column', 3: '3 column', 4: '4 column'};
         var s1 = jQuery('<select />').addClass('ch_col').attr('onchange', 'return splitCol(this);');
         for (var val in opt_data) {
         jQuery('<option />', {value: val, text: opt_data[val]}).appendTo(s1);
         }*/

        var s1 = '<div class="panelListSelect col-lg-12"><div class="btn-group pull-right pagination"><button type="button" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-fw fa-cog" ></i></button><ul class="dropdown-menu exclude"><li><a data-split="1" onclick="return splitCol(this);" href="javascript:void(0)">Column 1</a></li><li><a data-split="2" onclick="return splitCol(this);" href="javascript:void(0)">Column 2</a></li><li><a data-split="3" onclick="return splitCol(this);" href="javascript:void(0)">Column 3</a></li><li><a data-split="4" onclick="return splitCol(this);" href="javascript:void(0)">Column 4</a></li><li class="divider"></li><li><a onclick="return InsertRow(this,\'above\');" href="javascript:void(0)">Insert Row Above</a></li><li><a onclick="return InsertRow(this,\'below\');" href="javascript:void(0)">Insert Row Below</a></li></ul></div></div>';

    }

    var select_elem = jQuery('<div></div>').attr('class', 'clearfix').append(s1);
    // end

    var onerow_div = jQuery('<div></div>').addClass('onerow');
    var onerow = jQuery(onerow_div).data({'row': rownum, 'r_page_section': page_section_count});
    jQuery(onerow).prepend(select_elem);
    jQuery('#work_area').append(jQuery(onerow));

    return onerow;
}

function add_columns(num, onerow, html_class, markup) {


    var rownum = jQuery(onerow).data('row');
    var colnum = jQuery(onerow).find('.column1').last().data('col');

    if (typeof colnum == 'undefined') {
        colnum = 0;
    }

    for (var i = 0; i < num; i++) {

//            if (typeof markup == 'undefined') {
//                markup = jQuery('<h3>Test</h3>');
//            }

        colnum++;
        var item_pos_data = {'row': rownum, 'col': colnum, 'pos': 1};

        if (typeof markup == 'undefined') {
            var h3 = jQuery('');
        } else {
            var h3 = jQuery('<li></li>').append(markup);
        }


        var h3d = jQuery(h3).data('position', item_pos_data);

        var ul = jQuery('<ul></ul>').addClass('con').append(h3d);

        var onecol = jQuery('<div></div>').addClass('column1 ' + html_class).data('col', colnum).append(ul);
        jQuery(onerow).append(onecol);

        //console.log('inserted ' + i);
        //console.log(item_pos_data);

    }

    activesortable();
    deactive_sortable();
//    abc();
}
function activesortable() {


    sortable_data = jQuery(".con").sortable({
        group: 'con',
        exclude: '.exclude li',
        onDrop: function (item, container, _s, e) {
            
            //console.log('Trigger onDrop');

            // remove empty row
            jQuery('.onerow').each(function () {
                if (jQuery(this).find('li').not('.pagination li').length == 0) {
                    jQuery(this).find('.con').sortable("destroy");
                    jQuery(this).remove();
                }
            });
            

//                   jQuery(".con").sortable("enable")

            //console.log('row :' + jQuery(item).parents('.onerow').data('row'));
            //console.log('col :' + jQuery(item).parents('.column1').data('col'));


            // update position of elements
//            var i = 0;
//            var newrow = jQuery(item).parents('.onerow').data('row');
//            var newcol = jQuery(item).parents('.column1').data('col');

            // set position of each element
//            jQuery(item).parents('.con').find('li').each(function () {
//                i++;
//                var item_pos_data = {'row': newrow, 'col': newcol, 'pos': i};
//                jQuery(this).data('position', item_pos_data);
//            });

            _s(item, container);

            sortable_data.sortable('enable');
            sortable_data.sortable("refresh");
            sortable_data.sortable('enable');
            sortable_data.sortable({exclude:'.dropdown-menu li'});
            elemdragstart = false;
//            var $clonedItem = $('<li/>').css({height: 0});
//    item.before($clonedItem);
//    $clonedItem.animate({'height': item.height()});
//
//    item.animate($clonedItem.position(), function  () {
//      $clonedItem.detach();
//      _super(item, container);
//    });
        },
        onDragStart:function($item, container, _super){
            elemdragstart = true;
            _super($item, container);
        },
    });

//    jQuery('.second_ul').find('.con',function(){
//        jQuery(this).sortable('disable');
//    });
//    sortable_data.sortable('enable');
//    sortable_data.sortable("refresh");
//    sortable_data.sortable('enable');

}

function deactive_sortable() {
    jQuery(function () {
        jQuery('.page_break').parents('.con').sortable('destroy');
        //jQuery('.section_break').parents('.con').sortable('destroy');
    });
}

function splitCol(link) {
    //var item_pos_data = {'row': rownum, 'col': 1, 'pos': 1};


    var split = jQuery(link).data('split');
    var split_class = 12 / split;
    var total_divs = jQuery(link).parents('.onerow').find('.column1').length;

    var html_class = 'col-md-' + split_class;
    
    var div_count_diff = split - total_divs;

//    jQuery(link).parents('ul').find('a').each(function () {
//        jQuery(this).removeClass('active');
//    });
//    jQuery(link).addClass('active');

   
    
    if (div_count_diff > 0) {
        jQuery(link).parents('.onerow').find('.column1').each(function () {
            jQuery(this).removeClass(function (i, s) {
                return (s.match(/\bcol\-md\-\d+/g) || []).join(' ');
            }).addClass(html_class);
        });
   
        add_columns(div_count_diff, jQuery(link).parents('.onerow'), html_class);

    } else {
        $('#ConfirmMsgBody').html("If data associated with this field will be deleted. Are you sure you want to delete this element?");
        
         $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmYes', function (e) {
            e.preventDefault();
            
            jQuery(link).parents('.onerow').find('.column1').each(function () {
        jQuery(this).removeClass(function (i, s) {
            return (s.match(/\bcol\-md\-\d+/g) || []).join(' ');
        }).addClass(html_class);
    });
        remove_columns(div_count_diff, jQuery(link).parents('.onerow'));
        $('#ConfirmPopupArea').modal('hide');
        });
        
        
        
    }

    activesortable();
    deactive_sortable();
    return false;
}

function removeElement(elem, pb) {
//    alert(jQuery(elem).attr('id'));

$('#ConfirmMsgBody').html("All data associated with this field will be deleted. Are you sure you want to delete this element?");
    
    $('#confirmYes').unbind('click');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false});
    $('#confirmYes').click(function (e) {
            e.preventDefault();
         
        if (pb == 'page_break') {
            var page = jQuery(elem).data('page');
            //console.log('page2 ' + page);

            jQuery('.onerow').each(function () {

                if (jQuery(this).data('r_page_section') == page) {
                    
                    jQuery(this).find('.con').sortable("destroy");
                    
                    // for remove section
                    
                    jQuery(this).find('li').each(function () {

                        jQuery(this).find('div').each(function(){
                            var id_m = jQuery(this).attr('id');
                            if(typeof id_m !='undefined' && id_m.match(/main_div_[a-zA-Z0-9]+/ig)){
                
                            var id_ar = id_m.split('main_div_');
                            removeFromArray(id_ar[1]);
                            delete_machine_key(id_ar[1]);
                        }
                            
                        });
                        
                     
                    });
                    
                    // remove section end
                    

                    jQuery(this).find('li').each(function () {

                        var id_m = jQuery(this).find('div').attr('id');
                        
                        if(typeof id_m !='undefined' && id_m.match(/main_div_[a-zA-Z0-9]+/ig)){
                
                            var id_ar = id_m.split('main_div_');
                            removeFromArray(id_ar[1]);
                        }

                    });
                    //removeFromArray()
                    jQuery(this).remove();
                    //console.log('secid : '+page);
                }
            });

           page_section_count = page_section_count - 1;
           if(page_section_count<1){
               page_section_count =1;
           }
           
        } else {
            

            removeFromArray(elem);
            
            // delete machine key on delete element
            delete_machine_key(elem);
            
            //jQuery(this).find('.con').sortable("destroy");
            jQuery("#main_div_" + elem).parent('li').remove();
            // after delete element it check if any row is empty or not if empty then remove row
            // remove empty row
            jQuery('.onerow').each(function () {
                //console.log('re '+jQuery(this).find('li').length);
                if (jQuery(this).find('li').not('.pagination li').length == 0) {
                    jQuery(this).find('.con').sortable("destroy");
                    jQuery(this).remove();
                }
            });
            
        }
        
        //console.log(global_data);
     $('#ConfirmPopupArea').modal('hide');
         
        });

}

function delete_machine_key(id){
    if(typeof jsVars.machine_selected[id] != 'undefined'){
        var old_selected_machine_key=jsVars.machine_selected[id];
        jsVars.machine_key[old_selected_machine_key] = false;
    }
}

function checkInvalidBreak(check) {

    var first_empty = jQuery('.onerow').length;

    if (check == 'page_break')
        var b_last = jQuery('.onerow').last().find('.page_break').length;
    if (check == 'section_break')
        var b_last = jQuery('.onerow').last().find('.section_break').length;

//    if (first_empty < 1 || b_last > 0)
    if (b_last > 0)
        return 'no';

}

function removeFromArray(id) {

    var elemId = id; //jQuery(elem).parents('li').find('div').first().attr('id');
//    var e_array = elemId.split('_');
//
//    global_data.splice('serialize_' + e_array[1], 1);
//    delete global_data[ 'serialize_' + e_array[1]];

    global_data.splice('serialize_' + id, 1);
    delete global_data[ 'serialize_' + id];

    showHideSavePreviewButton();
    hideAttrWindow(id);
   
}

var next_dropdowns = jsVars.dropdowns;
var next_rows = jsVars.rows;
var next_cols = jsVars.cols;
var next_checkbox = jsVars.checkbox;
var next_radio = jsVars.radio;

function AddNewDropDowns(after_id) {
    next_dropdowns = parseInt(next_dropdowns) + 1;
   var html='<span id=dlist' + next_dropdowns + '><input placeholder="Dropdown Option ' + next_dropdowns + '" maxlength="99" class="form-control" name="dropdown_' + next_dropdowns + '" id="dropdown_' + next_dropdowns + '" type="text" value="" onChange="javascript:$(\'#make_default_select_value_'+next_dropdowns+'\').val(this.value);"><input type="radio" name="make_default_select_value" value="" id="make_default_select_value_'+next_dropdowns+'"> &nbsp; Make Default<div class="pull-right"><a href="javascript:void(0);" onclick="$(\'#dlist' + next_dropdowns + '\').remove();"><i class="fa fa-remove"></i></a>&nbsp;<a href="javascript:void(0);"  onclick="AddNewDropDowns(\'dlist'+next_dropdowns+'\');"><i class="fa fa-plus"></i></a></div></span>';
    if(after_id==""){
        $('#dropdown_list').append(html);
    }
    else {
        $('#'+after_id).after(html);
    }
}

function AddTableRow(after_id) {
    next_rows = parseInt(next_rows) + 1;
    var html ='<span id=r' + next_rows + '><input placeholder="Row ' + next_rows + ' Label" name="rows_' + next_rows + '"  class="form-control"  type="text" value="" id="rows_' + next_rows + '"> Is Required? <select name="rows_chk_' + next_rows + '" id="rows_chk_' + next_rows + '"><option value="false">False</option><option value="true">True</option></select><div class="pull-right"><a href="javascript:void(0);" onclick="$(\'#r' + next_rows + '\').remove();"><i class="fa fa-remove"></i></a>&nbsp;<a href="javascript:void(0);"  onclick="AddTableRow(\'r'+next_rows+'\');"><i class="fa fa-plus"></i></a></div></span>';
    if(after_id==""){
        $('#table_rows').append(html);
    }
    else {
        $('#'+after_id).after(html);
    }
}
function AddTableColumn(after_id) {
    
    next_cols = parseInt(next_cols) + 1;
    var html = '<span id=c' + next_cols + '><input placeholder="Column  ' + next_cols + ' Label" name="cols_' + next_cols + '" type="text" value="" class="form-control"   id="cols_' + next_cols + '"> Is Required? <select name="cols_chk_' + next_cols + '" id="cols_chk_' + next_cols + '"><option value="false">False</option><option value="true">True</option></select>Type : <select style="width:80px;" onChange="ShowHideType(this.value, \''+next_cols+'\');"  name="cols_input_type_' + next_cols + '" id="cols_input_type_' + next_cols + '"><option value="alphanumeric">Alpha Numeric</option><option value="text">Text</option><option value="numeric">Numeric</option><option value="decimal_2_places">Decimal (2 Places)</option><option value="decimal_3_places">Decimal (3 Places)</option><option value="month_year">mm/yyyy</option><option value="date">dd/mm/yyyy</option><option value="year">yyyy</option><option value="date_time_period">dd/mm/yyyy hh:mm:ss a</option><option value="predefined_dropdown">Predefined Dropdown</option><option value="custom_dropdown">Custom Dropdown Lists</option><option value="mobile">Mobile</option><option value="email">Email</option></select>';
        
html +='<select style="display:none;" class="form-control" name="predefined_dropdown_key_'+next_cols+'" id="predefined_dropdown_key_'+next_cols+'">'+MasterDropDownLists+'</select>';

html +=' <textarea style="display:none;" class="form-control" id="custom_dropdown_values_'+next_cols+'"  name="custom_dropdown_values_'+next_cols+'" placeholder="Use Shift+Enter to go to new line to add more options"></textarea>';

         html+='<div class="pull-right"><a href="javascript:void(0);" onclick="$(\'#c' + next_cols + '\').remove();"><i class="fa fa-remove"></i></a>&nbsp;<a href="javascript:void(0);"  onclick="AddTableColumn(\'c'+next_cols+'\');"><i class="fa fa-plus"></i></a></div></span>';
     if(after_id==""){
        $('#table_cols').append(html);
    }
    else {
       $('#'+after_id).after(html);
    }
}
function AddNewCheckbox(after_id) {
    next_checkbox = parseInt(next_checkbox) + 1;
    var html ='<span id=clist' + next_checkbox + '><input placeholder="Checkbox Option ' + next_checkbox + '" maxlength="99" class="form-control" name="checkbox_' + next_checkbox + '" id="checkbox_' + next_checkbox + '"  type="text" value=""><div class="pull-right"><a href="javascript:void(0);" onclick="$(\'#clist' + next_checkbox + '\').remove();"><i class="fa fa-remove"></i></a>&nbsp;<a href="javascript:void(0);"  onclick="AddNewCheckbox(\'clist'+next_checkbox+'\');"><i class="fa fa-plus"></i></a></div></span>';
    if(after_id==""){
        $('#checkbox_list').append(html);
    }
    else {
       $('#'+after_id).after(html);
    }
}

function AddNewRadio(after_id) {
    next_radio = parseInt(next_radio) + 1;
    var html ='<span id=rlist' + next_radio + '><input placeholder="Radio Option ' + next_radio + '"  maxlength="99" class="form-control" name="radio_' + next_radio + '" id="radio_' + next_radio + '" type="text" value="" onChange="javascript:$(\'#make_default_select_value_'+next_radio+'\').val(this.value);"><input type="radio" name="make_default_select_value" value="" id="make_default_select_value_'+next_radio+'"> &nbsp;Make Default<div class="pull-right"><a href="javascript:void(0);" onclick="$(\'#rlist' + next_radio + '\').remove();"><i class="fa fa-remove"></i></a>&nbsp;<a href="javascript:void(0);"  onclick="AddNewRadio(\'rlist'+next_radio+'\');"><i class="fa fa-plus"></i></a></div></span>';   
    if(after_id==""){
        $('#radio_list').append(html);
    }
    else {
       $('#'+after_id).after(html);
    }
}


/*function dataFill(hiddenId) {
 if(global_data["serialize_"+ hiddenId]){
 var all_fields=global_data["serialize_"+ hiddenId];
 for(var i=0; i<all_fields.length;i++){
 $("input:radio[name='" + all_fields[i].name + "'][value='" + all_fields[i].value + "']").attr("checked", true);
 $('#' + all_fields[i].name).val(all_fields[i].value);
 
 }
 }
 }*/

function editFormDetailLnkClick(collegeId, formId) {
//    $('#editFormDetailLnk').on('click', function() {
    $.ajax({
        url: '/form/formDetailsInitiate/' + collegeId + '/' + formId,
        type: 'get',
        dataType: 'html',
        async:false,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#overlayThird').html(data);
            $('#overlayThird').css('display', 'block');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
//    });
}

/** ss **/

function getElemPosition() {
    var r = 1;
    var p_sec;
    var elmPosData = [];
    var rpc_pos = 1;
    // row iteration
    jQuery('.onerow').each(function () {
        p_sec = jQuery(this).data('r_page_section');
        // column iteration
        var c = 1;
        var found_id = '';
        jQuery(this).find('.column1').each(function () {
            
            if(jQuery(this).find('li .second_ul>li').length>0)
            var liObj = jQuery(this).find('li .second_ul>li');
            else
            var liObj = jQuery(this).find('.con>li');
        
            // check if column has form element
            if (jQuery(liObj).length > 0) {
                // iteration each element
                var p=parseInt(0);
                jQuery(liObj).each(function () {
                    
                    
                    
                    rpc = jQuery(this).data('position');
//            console.log(rpc);

                    var id_ar = jQuery(this).find('div').each(function () {
                        var s = jQuery(this).attr('id') || '';
                        if (s.match(/main_div_[a-zA-Z0-9]+/gi)) {
                            found_id = s;
                            //return false;
                            p++;
                        }
                    });
                    var found_id_ar = found_id.split('main_div_');
                    var data_id = found_id_ar[1];
                    //console.log(data_id+' == '+p);

                    if (typeof rpc == 'undefined') {
                        rpc_pos = p;
                    } else {
                        rpc_pos = parseInt(rpc.pos);
                    }
                    
                    //rpc_pos = p;

                    //console.log(data_id+' :: (row = '+r+', column = '+c+', position = '+rpc.pos+')');

                    var combined_data = {'id': data_id, 'row': r, 'col': c, 'pos': rpc_pos, 'p_sec': p_sec};
                    elmPosData.push(combined_data);
                    //console.log(data_id+' :: '+r);

                });
                c++;
            }
        });
        r++;
        
    });
    //console.log(elmPosData);
    return elmPosData;
}

function addFirstPageBreak(){
    if(jQuery('.onerow').length==0)
        AddElement('page_break');
}

function checkAndDisableMachineKey(){
    //console.log(jsVars.machine_key);
     if(typeof jsVars.machine_key === 'object'){
        jQuery.each(jsVars.machine_key,function(index,value){
            if(index!= '' && value==true){
                
                jQuery('#machine_key').find('option[value="'+index+'"]').not(':selected').attr('disabled',true);
            }
        }); 
     }
 }
 
 
 
function showHideSavePreviewButton(){
    
    
    
    if(Object.keys(global_data).length < 1){
        jQuery('#save_form').hide();
        jQuery('#previewButton').hide();
        jQuery('#start_adding_field_text').show();
    }else{
        jQuery('#save_form').show();
        jQuery('#previewButton').show();
        jQuery('#start_adding_field_text').hide();
    }
}
    
function hideAttrWindow(hidden_id){
//    console.log('hid :: '+hidden_id);
    if(jQuery('.getattr_'+hidden_id).length>0){
//        jQuery('.getattr_'+hidden_id).html('');
        jQuery('.getattr_'+hidden_id).parents("#popup_window").hide();
    }
    
}

function titleCase(str) {
  var newstr = str.split(" ");
  for(i=0;i<newstr.length;i++){
    var copy = newstr[i].substring(1).toLowerCase();
    newstr[i] = newstr[i][0].toUpperCase() + copy;
  }
   newstr = newstr.join(" ");
   return newstr;
}  


/** Copy Condition code Start */
function displayCopyPanel(form_id){
        $('#popup_window').show();
        getCopyLogicList(form_id);  
}

function getCopyLogicList(form_id){
    // alert(form_id);
    $.ajax({
        url: '/form/copy-list',
        type: 'post',
        dataType: 'html',
        async:false,
        data: {
            form_id: form_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            LoadSlimScroll();
            jQuery.LoadingOverlay("hide",true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

function createCopyCondition(form_id){
    
     $.ajax({
        url: '/form/copycondition-add',
        type: 'post',
        dataType: 'html',
        async:false,
        data: {
            form_id: form_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            
            LoadSlimScroll();
             jQuery.LoadingOverlay("hide",true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}


function loadEventFieldValue(form_id){
    var event_value = jQuery('#event_trigger').val();
    
    
    jQuery.ajax({
        url: '/form/conditional_value',
        type: 'post',
        dataType: 'json',
        async:false,
        data: {
            "if_value": event_value,
            "form_id": form_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            //console.log(data[0]);
            jQuery('#checkbox_value').val(data[0]);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
             console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
   });
    
}

function fromToSetClone() {
    // var i=jQuery('.do_section>div').length;
    var setClone = jQuery('#copyfields .from_to_set>div').eq(0).clone();
    jQuery(setClone).find('option').removeAttr('selected');
    jQuery('.from_to_set').append(setClone);
    
}

function saveCopyCondition(){

    var form_data       = jQuery('#copy_save').serialize();
    var event_val       = jQuery('#event_trigger').val();
    var event_field_val = jQuery('#event_field_value').val();
    var form_id         = jQuery('#form-id').val();


    var error = false;
    if(event_val =='' || typeof event_val == 'undefined'){
        alertPopup("Please select event");
        error = true;
    }else if(form_data =='' || typeof form_data == 'undefined'){
        
        alertPopup(form_data);
        alertPopup("Please select mendatory fields");
        error = true;
    }


    if(error == false){
        var act_url = jQuery('#copy_save').attr('action');

        // ajax to save data

        $.ajax({
        url: act_url,
        type: 'post',
        dataType: 'json',
        async: false,
        data:  form_data,
        
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {

            if(json['redirect']){
                location = json['redirect'];
            }
            else if(json['error']){
                alertPopup(json['error'],'error');
            }
            else  if(json['success']=='200'){
            
                displayCopyPanel(form_id);
            }
            


         
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            // console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });


    }

    return false;
}
function saveConditionalLogic(){

    var form_data       = jQuery('#form_condition_save').serialize();
    var form_id         = jQuery('#form-id').val();
    var error           = false;

    if(error == false){
        var act_url = jQuery('#form_condition_save').attr('action');
        jQuery.LoadingOverlay("show");
        // ajax to save data

        $.ajax({
        url: act_url,
        type: 'post',
        dataType: 'json',
        async: false,
        data:  form_data,
        
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            jQuery.LoadingOverlay("hide",true);

            if(json['redirect']){
                location = json['redirect'];
            }
            else if(json['error']){
                alertPopup(json['error'],'error');
            }
            else  if(json['success']=='200'){
            
                displayConditionalPage(form_id)
            }
         
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
             console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });


    }

    return false;
}
function editConditionalLogic(){

    var form_data       = jQuery('#form_condition_edit').serialize();
    var form_id         = jQuery('#form-id').val();
    var error           = false;

    if(error == false){
        var act_url = jQuery('#form_condition_edit').attr('action');
        jQuery.LoadingOverlay("show");
        // ajax to save data

        $.ajax({
        url: act_url,
        type: 'post',
        dataType: 'json',
        async: false,
        data:  form_data,
        
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            jQuery.LoadingOverlay("hide",true);

            if(json['redirect']){
                location = json['redirect'];
            }
            else if(json['error']){
                alertPopup(json['error'],'error');
            }
            else  if(json['success']=='200'){
            
                displayConditionalPage(form_id)
            }
         
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
             console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });


    }

    return false;
}

function removeCopyCondition(id){
    if(jQuery('.from_to_block').length<=1){
        alertPopup('Cant remove particular condition, please click on "Delete" on copy listing page');
        return false;
    }
    jQuery("#"+id).remove();
}
function removeCopyConditionThis(id){
    if(jQuery('.from_to_block').length<=1){
        alertPopup('Cant remove particular condition, please click on "Delete" on copy listing page');
        return false;
    }
    jQuery(id).parents('.from_to_block').remove();
}

function removeCopyConditionDB(id,form_id){

    if(typeof form_id == 'undefined'){
        form_id = '';
    }
    
     $('#ConfirmMsgBody').html("Are you sure to delete condition?");
    
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmYes', function (e) {
            
           e.preventDefault();
    
        jQuery.ajax({
            url: '/form/copyconditional-delete',
            type: 'post',
            dataType: 'json',
            async:false,
            data: {
                "copy_condition_id": id,
                "form_id"          : form_id
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (json) {
                if(json['redirect']){
                location = json['redirect'];
            }
            else if(json['error']){
                alertPopup(json['error'],'error');
            }
            else if(json['success']==200){
                    jQuery('#condition_id_'+id).remove();    
                }
                
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                 console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
       });
       
        $('#ConfirmPopupArea').modal('hide');
            
            
        });
}

function editCopyCondition(id){
    
         $.ajax({
        url: '/form/copycondition-add',
        type: 'post',
        dataType: 'html',
        async:false,
        data: {
            id: id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            
            LoadSlimScroll();
             jQuery.LoadingOverlay("hide",true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
    
}
/** Copy Condition code End */

/** page scroll om mouse movement 
 * call function on create_form
 * **/
function scrollPageOnDrag(){

    var clicking = false;

    $('#work_area').mousedown(function(event){
        if(event.which==1){
            clicking = true;
        }
    });
    
    $(document).mouseup(function(){
        clicking = false;
    });
    
    $("html, body").mouseup(function(){
        clicking = false;
    });
    
    
    $(".main-header").mouseup(function(){
        clicking = false;
    });

    $(window).mousemove(function (e) {
        if(typeof sortable_data == 'undefined')
            return;
        
        if(typeof elemdragstart == 'undefined' || elemdragstart == false)
            return;
        
        if(clicking == false) return;
        
        $("html, body").scrollTop(function(i, v) {
            var h = $(window).height();
            var y = e.clientY - h / 2;
            return v + y * 0.07;
        });
    });
}

/** table mapping code start */

function displayTableMappingPanel(form_id){
        $('#popup_window').show();
        getTableMappingList(form_id);
}

function getTableMappingList(form_id){
    
    
    // alert(form_id);
    $.ajax({
        url: '/form/table-mapping-list',
        type: 'post',
        dataType: 'html',
        async:false,
        data: {
            form_id: form_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            LoadSlimScroll();
            LoadSlimScrollCondition();
            jQuery.LoadingOverlay("hide",true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    //tableMappingForm(form_id);
    return false;
}

function tableMappingForm(form_id,field_id){
    if(typeof field_id =='undefined'){
        field_id ='';
    }
    jQuery.LoadingOverlay("show");
     $.ajax({
        url: '/form/table-mapping-form',
        type: 'post',
        dataType: 'html',
        async:false,
        data: {
            form_id: form_id,
            field_id:field_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            
             LoadSlimScrollTableMapping();
             jQuery.LoadingOverlay("hide",true);
             disable_system_machine_value();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

function loadTableCellValue(form_id){
     jQuery.LoadingOverlay("show");
    var table_id = jQuery('#table_data').val();
    
    jQuery.ajax({
        url: '/form/load-table-cell-value',
        type: 'post',
        dataType: 'json',
        async:false,
        data: {
            "id": table_id,
            "form_id": form_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            
             jQuery.LoadingOverlay("hide",true);
            
            if(json['redirect']){
                location = json['redirect'];
            }
            else if(json['error']){
                alertPopup(json['error'],'error');
            }
            else if(json['success']=='200'){
            
                jQuery('#machinekey_set').html(json['data']);
            }
            
            disable_system_machine_value();
            
            //console.log(data[0]);
            //jQuery('#checkbox_value').val(data[0]);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
             console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
   });
    return false;
}


function saveTableMapping(){

    var form_data  = jQuery('#tableMappingSave').serialize();
    var table_data = jQuery('#table_data').val();
    var form_id    = jQuery('#form-id').val();


    var error = false;
    if(table_data =='' || typeof table_data == 'undefined'){
        alertPopup("Please select Table");
        error = true;
    }else if(form_data =='' || typeof form_data == 'undefined'){
        alertPopup("Please select table");
        error = true;
    }


    if(error == false){
        var act_url = jQuery('#tableMappingSave').attr('action');

        // ajax to save data

        $.ajax({
        url: act_url,
        type: 'post',
        dataType: 'json',
        async: false,
        data:  form_data,
        
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {

            if(json['redirect']){
                location = json['redirect'];
            }
            else if(json['error']){
                alertPopup(json['error'],'error');
            }
            else  if(json['success']=='200'){
            
                displayTableMappingPanel(form_id);
            }
            


         
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            // console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });


    }

    return false;
}

function disable_system_machine_value(){
    
    var optTxt = [];
    var tt = [];
    jQuery('.system_machine_key_val').each(function(){
        jQuery(this).find('option').each(function(){
            
            if(jQuery(this).is(':selected') && jQuery(this).text()!='--Select--'){
                
                // for check duplicate value, it insert uniqe value
                if(optTxt.indexOf(jQuery(this).val()) == -1){
                    optTxt.push((jQuery(this).val()));
                }
            }
        });
    });

    
    if(typeof extradisable != 'undefined' && extradisable.length>0 && optTxt.length>0){
        tt = jQuery.merge( jQuery.merge( [], optTxt ), extradisable );
    }else if(optTxt.length>0){
        tt =  jQuery.merge( tt, optTxt );
    }else if(typeof extradisable != 'undefined' && extradisable.length>0){
        tt =  jQuery.merge(tt, extradisable );
    }

    
    var uniqueNames = [];
    if(tt.length>0){
        jQuery.each(tt, function(i, el){
            if(jQuery.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
        });
    }
    if(uniqueNames.length>0){
        jQuery('.system_machine_key_val option').removeAttr('disabled');
        for(var i in uniqueNames){
            jQuery('.system_machine_key_val option[value="'+uniqueNames[i]+'"]').not(':selected').prop('disabled',true);
        }
    }
    
}
/** table mapping code end */

/** unique group code **/

function displayUniqueGroupPanel(form_id){
    $('#popup_window').show();
    getUniqueGroupList(form_id);
}

function getUniqueGroupList(form_id){
    
    
    // alert(form_id);
    $.ajax({
        url: '/form/unique-group-list',
        type: 'post',
        dataType: 'html',
        async: false,
        data: {
            form_id: form_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            LoadSlimScroll();
            
            LoadSlimScrollTableMapping();
            jQuery.LoadingOverlay("hide",true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

function uniqueGroupForm(form_id,index_id){
    if(typeof index_id =='undefined'){
        index_id ='';
    }
    
    jQuery.LoadingOverlay("show");
     $.ajax({
        url: '/form/unique-group-form',
        type: 'post',
        dataType: 'html',
        async: false,
        data: {
            form_id: form_id,
            index_id:index_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            
             LoadSlimScrollTableMapping();
             jQuery.LoadingOverlay("hide",true);
             disable_system_machine_value();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

function saveUniqueGroup(){

    var form_data  = jQuery('#uniqueGroupSave').serialize();
    var index_data = jQuery('#index_data').val();
    var form_id    = jQuery('#form-id').val();

    var error = false;
//    if(typeof index_data == 'undefined' || index_data ==''){
//        alertPopup("Please fill information");
//        error = true;
//    } 
    if(typeof form_data == 'undefined' || form_data ==''){
        alertPopup("Please fill information");
        error = true;
    }


    if(error == false){
        var act_url = jQuery('#uniqueGroupSave').attr('action');

        // ajax to save data

        $.ajax({
        url: act_url,
        type: 'post',
        dataType: 'json',
        async: false,
        data:  form_data,
        
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {

            if(json['redirect']){
                location = json['redirect'];
            }
            else if(json['error']){
                alertPopup(json['error'],'error');
            }
            else  if(json['success']=='200'){
            
                displayUniqueGroupPanel(form_id);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
             console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    }

    return false;
}

function removeuniqueGroupDB(form_id,index_id){
    if(typeof form_id == 'undefined'){
        form_id = '';
    }

    $('#ConfirmMsgBody').html('are you sure to delete unique group?');
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmYes', function (e) {
        e.preventDefault();
        jQuery.ajax({
            url: '/form/unique_group_save',
            type: 'post',
            dataType: 'json',
            async:false,
            data: {
                "index_id": index_id,
                "form_id" : form_id,
                'delete'  : 'delete'  
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                displayUniqueGroupPanel(form_id);
            },
            error: function (xhr, ajaxOptions, thrownError) {
               // alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                 console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
       });     
       
       $('#ConfirmPopupArea').modal('hide');
    });
}
/** unique group code end */


/**
 *  dependency fields
 */

function displayDependentFieldsPanel(form_id){
    
    $('#popup_window').show();
    getDependentFieldsList(form_id); 
    
}

function getDependentFieldsList(form_id){
    jQuery.LoadingOverlay("show");
    // alert(form_id);
    $.ajax({
        url: '/form/dependent-fields-list',
        type: 'post',
        dataType: 'html',
        async:false,
        data: {
            form_id: form_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            LoadSlimScroll();
            
            LoadSlimScrollTableMapping();
            jQuery.LoadingOverlay("hide",true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
    
}

function dependentFieldsForm(form_id,index_id){
    if(typeof index_id =='undefined'){
        index_id ='';
    }
    
    jQuery.LoadingOverlay("show");
     $.ajax({
        url: '/form/dependent-fields-form',
        type: 'post',
        dataType: 'html',
        async: false,
        data: {
            form_id: form_id,
            index_id:index_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            
             LoadSlimScrollTableMapping();
             jQuery.LoadingOverlay("hide",true);
             
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

function saveDependentFields(){

    var form_data  = jQuery('#dependentFieldsSave').serialize();
    var index_data = jQuery('#index_data').val();
    var form_id    = jQuery('#form-id').val();

    var error = false;
    if(typeof form_data == 'undefined' || form_data ==''){
        alertPopup("Please fill information");
        error = true;
        
    }

    if(error == false){
        var act_url = jQuery('#dependentFieldsSave').attr('action');

        // ajax to save data

        $.ajax({
        url: act_url,
        type: 'post',
        dataType: 'json',
        async: false,
        data:  form_data,
        
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {

            if(json['redirect']){
                location = json['redirect'];
            }
            else if(json['error']){
                alertPopup(json['error'],'error');
            }
            else  if(json['success']=='200'){
            
                displayDependentFieldsPanel(form_id);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
             console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    }

    return false;
}

function removeDependentFieldsDB(form_id,index_id){
    
    $('#ConfirmMsgBody').html('are you sure to delete dependent field?');
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmYes', function (e) {
        e.preventDefault();
        jQuery.ajax({
            url: '/form/dependent_fields_save',
            type: 'post',
            dataType: 'json',
            async:false,
            data: {
                "index_id": index_id,
                "form_id" : form_id,
                'delete'  : 'delete'  
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                displayDependentFieldsPanel(form_id);
            },
            error: function (xhr, ajaxOptions, thrownError) {
               // alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                 console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
       });     
       
       $('#ConfirmPopupArea').modal('hide');
    });
    
}

function getDependentFieldLevel(val){
    var error = false;
    if(typeof val == 'undefined' || val ==''){
        alertPopup("Please select");
        error = true;
    }
    
    if(error==false){
        jQuery('#dependent_fields_block').html('');
        $.ajax({
            url: '/form/dependent-field-level-count',
            type: 'post',
            dataType: 'json',
            async: false,
            data:  {taxonomy_key:val},
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (json) {

                if(json['redirect']){
                    location = json['redirect'];
                }
                else if(json['error']){
                    alertPopup(json['error'],'error');
                }
                else  if(json['success']=='200'){
                    
                    var allfiled = $('#allfieldID').html();
                    var total_field  = json['data'];
                    for(var i = 0 ; i <total_field; i++){
                       
                       jQuery('#dependent_fields_block').append(allfiled);
                    }
                    //console.log(json['data']);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                 console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    
    }

    return false;
}


function ShowHideType(val, id){
    if(val=="predefined_dropdown"){
        $('#predefined_dropdown_key_'+id).show();
        $('#custom_dropdown_values_'+id).val('');
        $('#custom_dropdown_values_'+id).hide();
        
        $('#custom_date_from_values_'+id).hide();
        $('#custom_date_to_values_'+id).hide();
        $('#custom_date_from_values_'+id).val('');
        $('#custom_date_to_values_'+id).val('');
        $('#div_allow_other_option_'+id).show();
    }
    else if(val=="custom_dropdown"){
         $('#custom_dropdown_values_'+id).show();
         $('#predefined_dropdown_key_'+id).val('');
         $('#predefined_dropdown_key_'+id).hide();
         
        $('#custom_date_from_values_'+id).hide();
        $('#custom_date_to_values_'+id).hide();
        $('#custom_date_from_values_'+id).val('');
        $('#custom_date_to_values_'+id).val('');
        $('#div_allow_other_option_'+id).hide();
    }
    else if(val=="month_year" || val=="date" || val=="year" || val=="date_time_period"){
        $('#custom_date_from_values_'+id).show();
        $('#custom_date_to_values_'+id).show();
         
        $('#predefined_dropdown_key_'+id).val('');
        $('#predefined_dropdown_key_'+id).hide();
        $('#custom_dropdown_values_'+id).val('');
        $('#custom_dropdown_values_'+id).hide();
        $('#div_allow_other_option_'+id).hide();
    }
    else{
        $('#custom_dropdown_values_'+id).val('');
        $('#custom_dropdown_values_'+id).hide();
        $('#predefined_dropdown_key_'+id).val('');
        $('#predefined_dropdown_key_'+id).hide();
        $('#custom_date_from_values_'+id).hide();
        $('#custom_date_to_values_'+id).hide();
        $('#custom_date_from_values_'+id).val('');
        $('#custom_date_to_values_'+id).val('');
        $('#div_allow_other_option_'+id).hide();
    }
}


/**
 *  Help File Upload
 */

function displayHelpUploadPanel(form_id){
    
    $('#popup_window').show();
    getHelpUploadList(form_id); 
    
}

function getHelpUploadList(form_id){
    jQuery.LoadingOverlay("show");
    // alert(form_id);
    $.ajax({
        url: '/form/help-upload-list',
        type: 'post',
        dataType: 'html',
        async:false,
        data: {
            form_id: form_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            LoadSlimScroll();
            
            LoadSlimScrollTableMapping();
            jQuery.LoadingOverlay("hide",true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
    
}

function helpUploadForm(form_id,index_id){
    if(typeof index_id =='undefined'){
        index_id ='';
    }
    
    jQuery.LoadingOverlay("show");
     $.ajax({
        url: '/form/help-upload-form',
        type: 'post',
        dataType: 'html',
        async: false,
        data: {
            form_id: form_id,
            index_id:index_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            
             LoadSlimScrollTableMapping();
             jQuery.LoadingOverlay("hide",true);
             
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

function saveHelpUpload(){

    var form_data  = jQuery('#helpUploadsSave').serialize();
    var index_data = jQuery('#index_data').val();
    var form_id    = jQuery('#form-id').val();

    var error = false;
    if(typeof form_data == 'undefined' || form_data ==''){
        alertPopup("Please fill information");
        error = true;
        
    }

    if(error == false){
        jQuery.LoadingOverlay("show");
        var act_url = jQuery('#helpUploadsSave').attr('action');

        // ajax to save data

        $.ajax({
        url: act_url,
        type: 'post',
        dataType: 'json',
        async: false,
        data:  form_data,
        
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            jQuery.LoadingOverlay("hide",true);
            if(json['redirect']){
                location = json['redirect'];
            }
            else if(json['error']){
                alertPopup(json['error'],'error');
            }
            else  if(json['success']=='200'){
            
                displayHelpUploadPanel(form_id);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
             console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    }

    return false;
}

function removeHelpUploadDB(form_id,index_id){
    
    $('#ConfirmMsgBody').html('are you sure to delete help upload?');
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmYes', function (e) {
        e.preventDefault();
        jQuery.ajax({
            url: '/form/help_upload_save',
            type: 'post',
            dataType: 'json',
            async:false,
            data: {
                "index_id": index_id,
                "form_id" : form_id,
                'delete'  : 'delete'  
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                displayHelpUploadPanel(form_id);
            },
            error: function (xhr, ajaxOptions, thrownError) {
               // alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                 console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
       });     
       
       $('#ConfirmPopupArea').modal('hide');
    });   
}

/***************START of Calculations*********************/

function displayCalculationPanel(form_id){
    $('#popup_window').show();
    // alert(form_id);
    $.ajax({
        url: '/form/calculations-list',
        type: 'post',
        dataType: 'html',
        async: false,
        data: {
            form_id: form_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            LoadSlimScroll();
            LoadSlimScrollTableMapping();
            jQuery.LoadingOverlay("hide",true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

function addCalculationPanel(form_id,index_id){
    $('#popup_window').show();
    if(typeof index_id =='undefined'){
           index_id ='';
       }
     jQuery.LoadingOverlay("show");
     $.ajax({
        url: '/form/calculations-create',
        type: 'post',
        dataType: 'html',
        async: false,
        data: {
            form_id: form_id,
            index_id:index_id,
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            
             LoadSlimScrollTableMapping();
             jQuery.LoadingOverlay("hide",true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

function CloneStateFields(elem){
     var cloned = $('div.if_state:first').clone();
     $('div#cloneButton').before(cloned);
     //$('#loop_'+new_id).hide(); // this is for effect.
     //$('#loop_'+new_id).fadeIn('slow'); // this is for effect.
}

function appendToFormula(item,type){
    if(type=="operators"){
            $('#summary_textarea').append("<span data-all='operator||"+item+"'>"+item+"</span>");
    }
    else{
       //  var txt=$(item).text();
         txt=jQuery("select#select_fields_for_calc option[value="+item.value+"]"). text();
         $('#summary_textarea').append("<span data-all='field||"+item.value+"'>"+txt+"</span>");
         $('select#select_fields_for_calc').val('');
    }
}
function  removeFromFormula(){
    $('#summary_textarea span:last').remove();
}

function SaveCalculations(){
    calc_text=$('#summary_textarea span');
    final_calc_text="";
    $(calc_text).each(function( index ) {
        if(final_calc_text=="")final_calc_text+=$( this ).attr("data-all");
        else final_calc_text+=";;;"+$( this ).attr("data-all");
        //console.log( index + ": " + $( this ).attr("data-all") );
    });
    
    
    var form_data  = jQuery('#save_calulations').serializeArray();
    //console.log(final_calc_text);
    var st = {'name': 'final_calc_text', 'value': final_calc_text};
    form_data.push(st);
    var st = {'name': 'type', 'value': 'save_form'};
    form_data.push(st);
    
    $('#error_div').html('');
    $('#error_div').hide();
     $.ajax({
         url: '/form/calculations-create',
        type: 'post',
        dataType: 'html',
        async: false,
        data: form_data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if(data=="redirect"){
                window.location.href="/form/manage-form";
            }
            else if(data=="success"){
                form_id=jQuery('#save_calulations #form_id').val();
                displayCalculationPanel(form_id);
            }
           else if(data=="error_fields"){
                $('#error_div').html('There are some missing fields.');
                $('#error_div').show();
                $('#between-operator').focus();
            }
            //console.log(data);
            //$('#popup_window').html(data);
            // LoadSlimScrollTableMapping();
            //jQuery.LoadingOverlay("hide",true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
   
}

function deleteCalculations(form_id, index_id){
    $('#ConfirmMsgBody').html('Are you sure to delete?');
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmYes', function (e) {
        e.preventDefault();
                $.ajax({
                   url: '/form/calculations-delete',
                   type: 'post',
                   dataType: 'html',
                   async: false,
                   data: {
                       form_id: form_id,
                       index_id:index_id
                   },
                   headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                   success: function (data) {
                       //console.log(data);
                       if(data=="redirect"){
                           window.location.href="/form/manage-form";
                       }
                       else if(data=="success"){
                           $('#calculations_row_'+index_id).slideToggle();
                           displayCalculationPanel(form_id);
                           //setTimeout("$('#calculations_row_'+index_id).remove();",5000);
                       }
                   },
                   error: function (xhr, ajaxOptions, thrownError) {
                       //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                       console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                   }
               });
         $('#ConfirmPopupArea').modal('hide');
    });
    return false;
}



/***************START of Other Fields Mapping*********************/
function displayOtherFieldsPanel(form_id){
    $('#popup_window').show();
    // alert(form_id);
    $.ajax({
        url: '/form/other-fields-mapping-list',
        type: 'post',
        dataType: 'html',
        async: false,
        data: {
            form_id: form_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            LoadSlimScroll();
            LoadSlimScrollTableMapping();
            jQuery.LoadingOverlay("hide",true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

function addOtherFieldsPanel(form_id,index_id){
    $('#popup_window').show();
    if(typeof index_id =='undefined'){
           index_id ='';
       }
     jQuery.LoadingOverlay("show");
     $.ajax({
        url: '/form/other-fields-mapping-create',
        type: 'post',
        dataType: 'html',
        async: false,
        data: {
            form_id: form_id,
            index_id:index_id,
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            
             LoadSlimScrollTableMapping();
             jQuery.LoadingOverlay("hide",true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}


function SaveOtherFields(){
   
    var form_data  = jQuery('#save_other_fields_mapping').serializeArray();

    var st = {'name': 'type', 'value': 'save_form'};
    form_data.push(st);
    
    $('#error_div').html('');
    $('#error_div').hide();
     $.ajax({
         url: '/form/other-fields-mapping-create',
        type: 'post',
        dataType: 'html',
        async: false,
        data: form_data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if(data=="redirect"){
                window.location.href="/form/manage-form";
            }
            else if(data=="success"){
                form_id=jQuery('#save_other_fields_mapping #form_id').val();
                displayOtherFieldsPanel(form_id);
            }
           else if(data=="error_fields"){
                $('#error_div').html('There are some missing fields.');
                $('#error_div').show();
                //$('#between-operator').focus();
            }
            //console.log(data);
            //$('#popup_window').html(data);
            // LoadSlimScrollTableMapping();
            //jQuery.LoadingOverlay("hide",true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
   
}

function deleteOtherFields(form_id, index_id){
    $('#ConfirmMsgBody').html('Are you sure to delete?');
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmYes', function (e) {
        e.preventDefault();
                $.ajax({
                   url: '/form/other-fields-mapping-delete',
                   type: 'post',
                   dataType: 'html',
                   async: false,
                   data: {
                       form_id: form_id,
                       index_id:index_id
                   },
                   headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                   success: function (data) {
                       //console.log(data);
                       if(data=="redirect"){
                           window.location.href="/form/manage-form";
                       }
                       else if(data=="success"){
                           $('#calculations_row_'+index_id).slideToggle();
                           displayOtherFieldsPanel(form_id);
                           //setTimeout("$('#calculations_row_'+index_id).remove();",5000);
                       }
                   },
                   error: function (xhr, ajaxOptions, thrownError) {
                       //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                       console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                   }
               });
         $('#ConfirmPopupArea').modal('hide');
    });
    return false;
}

/**************End of Other Fields Mapping************************/




function addDynamicFormPrefixPanel(form_id,index_id){
    $('#popup_window').show();
    if(typeof index_id =='undefined'){
           index_id ='';
       }
     jQuery.LoadingOverlay("show");
     $.ajax({
        url: '/form/dynamicFormPrefixCreate',
        type: 'post',
        dataType: 'html',
        async: false,
        data: {
            form_id: form_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            
             LoadSlimScrollTableMapping();
             jQuery.LoadingOverlay("hide",true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}


function SaveDynamicFormPrefix(){
   
    var form_data  = jQuery('#save_dynamic_form_name').serializeArray();
 
    var st = {'name': 'type', 'value': 'save_form'};
    form_data.push(st);
    $('#save_dynamic_form_btn').html("Saving...");
    $('#error_div').html('');
    $('#error_div').hide();
     $.ajax({
         url: '/form/dynamicFormPrefixCreate',
        type: 'post',
        dataType: 'html',
        async: false,
        data: form_data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if(data=="redirect"){
                window.location.href="/form/manage-form";
            }
            else if(data=="success"){
                //form_id=jQuery('#save_other_fields_mapping #form_id').val();
                //displayOtherFieldsPanel(form_id);
                $('#save_dynamic_form_btn').html("Saved");
                setTimeout("closeConditionWinow()",2000);
            }
           else if(data=="error_fields"){
                $('#error_div').html('There are some missing fields.');
                $('#error_div').show();
                $('#save_dynamic_form_btn').html("Save Mapping");
                //$('#between-operator').focus();
            }
            //console.log(data);
            //$('#popup_window').html(data);
            // LoadSlimScrollTableMapping();
            //jQuery.LoadingOverlay("hide",true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
   
}

function setSelectValue(elem,selected){
    var if_value = jQuery(elem).val();
    
    if(typeof selected == 'undefined')
        selected ="";
    
        field_to_set=jQuery(elem).parents('.if_state').find('.set_value');
    
        field_to_set.find('option').remove().end().append('<option value="">Select Value1</option>');
       
    
    if(elem.value!=''){
        var opt_vals = [];
        var vals = elem.value;
        var val_ar = vals.split('||');
        if(val_ar[1]!=''){
            opt_vals = eval(val_ar[1]);
            for (var val in opt_vals) {
                jQuery('<option />', {value: opt_vals[val], text: opt_vals[val]}).appendTo(field_to_set);
            }
            if(selected.length>0){
               jQuery(field_to_set).val(selected);
            }
        }
    }
}











































































































































/*************End of Calculations**************************/


/**
 *  Dynamic Fee
 */

function displayDynamicFeePanel(form_id){
    
  $('#popup_window').show();
  jQuery.LoadingOverlay("show");
    // alert(form_id);
    $.ajax({
        url: '/form/dynamic-fee-list',
        type: 'post',
        dataType: 'html',
        async:false,
        data: {
            form_id: form_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            LoadSlimScroll();
            
            LoadSlimScrollTableMapping();
            jQuery.LoadingOverlay("hide",true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;   
    
}

function removeDynamicFeeDB(form_id,index_id){
    
    $('#ConfirmMsgBody').html('are you sure to delete dynamic fee condition?');
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmYes', function (e) {
        e.preventDefault();
        jQuery.ajax({
            url: '/form/save-dynamic-fee',
            type: 'post',
            dataType: 'json',
            async:false,
            data: {
                "index_id": index_id,
                "form_id" : form_id,
                'delete'  : 'delete'  
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (json) {
                if(json['redirect']){
                    location = json['redirect'];
                }
                else if(json['error']){
                    alertPopup(json['error'],'error');
                }
                else  if(json['success']=='200'){

                    displayDynamicFeePanel(form_id);
                }
                //displayDynamicFeePanel(form_id);
            },
            error: function (xhr, ajaxOptions, thrownError) {
               // alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                 console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
       });     
       
       $('#ConfirmPopupArea').modal('hide');
    });   
}


function saveDynamicFee(){

    var form_data  = jQuery('#saveDynamicFee').serialize();
    var form_id    = jQuery('#form_id').val();
    var fee_amount = jQuery('#fee_amount').val();

    var error = false;
//    if(typeof form_data == 'undefined' || form_data ==''){
//        alertPopup("Please fill information");
//        error = true;
//    }
//    if(typeof fee_amount == 'undefined' || fee_amount ==''){
//        alertPopup("Please fill information");
//        error = true;
//    }
    
    if(error == false){
        jQuery.LoadingOverlay("show");
        var act_url = jQuery('#saveDynamicFee').attr('action');

        // ajax to save data

        $.ajax({
        url: act_url,
        type: 'post',
        dataType: 'json',
        async: false,
        data:  form_data,
        
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            jQuery.LoadingOverlay("hide",true);
            if(json['redirect']){
                location = json['redirect'];
            }
            else if(json['error']){
                alertPopup(json['error'],'error');
            }
            else  if(json['success']=='200'){
            
                displayDynamicFeePanel(form_id);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
             console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    }

    return false;
}


function dynamicFeeForm(form_id,index_id){
    if(typeof index_id =='undefined'){
        index_id ='';
    }
    
    jQuery.LoadingOverlay("show");
     $.ajax({
        url: '/form/dynamic-fee-form',
        type: 'post',
        dataType: 'html',
        async: false,
        data: {
            form_id: form_id,
            index_id:index_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            
             LoadSlimScrollTableMapping();
             jQuery.LoadingOverlay("hide",true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;

}

function getDyfeeClone(form_id) {
    //var form_id = 
    var i=jQuery('.dynamic_fee_selection>div').length;
    if(i>0){
        
        var doClone = jQuery('.dynamic_fee_selection>div').eq(0).clone();
       
        //jQuery(doClone).find('select').removeAttr('multiple');
        jQuery(doClone).find('select').each(function(){

            this.name = this.name.replace('[0]','['+i+']');
            this.id   = this.id.replace('_0','_'+i);
            if(this.id=='if_'+i){
                this.setAttribute('onchange','return loadDropValue('+i+',this);');
            }
            $(this).find('option:selected').removeAttr("selected");

        });

        jQuery('.dynamic_fee_selection').append(doClone);
    }
    return false;
}


function loadDropValue(id_num,elem,selected){
    var if_value = jQuery('#if_'+id_num).val();
    
    if(typeof selected == 'undefined')
        selected ="";
    
    jQuery('#field_value_'+id_num).find('option').remove().end().append('<option value="">--Select--</option>');
    if($(".admitcardMsgDiv").length){
        $(".admitcardMsgDiv").hide();
    }
    if(elem.value!=''){
        var opt_vals = [];
        var vals = elem.value;
        var val_ar = vals.split('||');
        if(val_ar[1]!=''){
            
            if(val_ar[0] === 'application_stage'){
                $(".admitcardMsgDiv").show();
            }else{
                if($("#subStageDropdownDiv").length){
                    $("#subStageDropdownDiv").hide();
                }
                if($("#subStageDropdown").length){
                    $("#subStageDropdown").hide();
                }
                $("#admit_card_message").val('');
            }
            try{
                opt_vals = eval(val_ar[1]);
                
            }catch(err){
                // for checking 
                $.LoadingOverlay("show");
                
                var college_id_md =0;
                if( $("[name='h_college_id']").length > 0 && typeof $("[name='h_college_id']").val() != "undefined" ){
                    college_id_md = $("[name='h_college_id']").val();
                }
                
                $.ajax({
                    url: '/common/get-option-by-slug',
                    type: 'post',
                    dataType: 'json',
                    async:false,
                    data: {
                        'slug': val_ar[1],
                        'college_id':college_id_md
                    },
                    headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                    success: function (json) {
                        
                        $.LoadingOverlay("hide",true);
                        if(json['redirect']){
                            location = json['redirect'];
                        }
                        else if(json['error']){
                            alertPopup(json['error'],'error');
                        }
                        else  if(json['success']=='200'){
                        opt_vals = json['options'];
                        }
                        
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    }
                });
            }
            
            
            for (var val in opt_vals) {
                jQuery('<option />', {value: opt_vals[val], text: opt_vals[val]}).appendTo('#field_value_'+id_num);
            }

            if(selected.length>0){
               jQuery('#field_value_'+id_num+' option[value="'+selected+'"').attr('selected',true);
            }
        }
    }else{
        if($("#subStageDropdownDiv").length){
            $("#subStageDropdownDiv").hide();
        }
        if($("#subStageDropdown").length){
            $("#subStageDropdown").hide();
        }
    }
}

/**
 *  End Dynamic Fee
 */


/**
 * table cell wise
 */

function RemoveTableCellWise(val){
    var html_class = '.'+val;
    var id    = '#'+val;
    //console.log(id);
    //console.log(html_class);
    jQuery(html_class).remove();
    jQuery(id).remove();
    
}

/**Post Editable Fields**/
function displayPostEditableFieldForm(form_id,index_id){
    
     if(typeof index_id =='undefined'){
        index_id ='';
    }
    
  $('#popup_window').show();
  $.LoadingOverlay("show");
    // alert(form_id);
    $.ajax({
        url: '/form/post-editable-fields',
        type: 'post',
        dataType: 'html',
        async:false,
        data: {
            form_id: form_id,
            index_id:index_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            LoadSlimScroll();
            $.LoadingOverlay("hide",true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false; 
}

//Save Post Editable Fields
function savePostEditableField(){
    
    

    var form_data  = $('#savePostEditableFieldsForm').serialize();
    var form_id    = $('#form_id').val();
    var error = false;
    if(error == false){
        $.LoadingOverlay("show");
        var act_url = $('#savePostEditableFieldsForm').attr('action');

        // ajax to save data

        $.ajax({
            url: act_url,
            type: 'post',
            dataType: 'json',
            async:false,
            data:  form_data,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (json) {
                jQuery.LoadingOverlay("hide",true);
                if(json['redirect']){
//                    location = json['redirect'];
                }
                else if(json['error']){
                    alertPopup(json['error'],'error');
                }
                else  if(json['success']=='200'){
                   
                    displayPostEditableFieldPanel(form_id);
                }
                
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                 console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }

    return false;
}

function displayPostEditableFieldPanel(form_id){
    
    $('#popup_window').show();
    jQuery.LoadingOverlay("show");
    // alert(form_id);
    $.ajax({
        url: '/form/post-editable-fields-list',
        type: 'post',
        dataType: 'html',
        async:false,
        data: {
            form_id: form_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            LoadSlimScroll();
            
            LoadSlimScrollTableMapping();
            jQuery.LoadingOverlay("hide",true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}


function removePostEditableFieldDB(form_id,index_id){
    
    $('#ConfirmMsgBody').html('are you sure to delete Post Editable Field?');
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmYes', function (e) {
        e.preventDefault();
        jQuery.ajax({
            url: '/form/savepost-editable-fields',
            type: 'post',
            dataType: 'json',
            async:false,
            data: {
                "index_id": index_id,
                "form_id" : form_id,
                'delete'  : 'delete'  
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (json) {
                if(json['redirect']){
                    location = json['redirect'];
                }
                else if(json['error']){
                    alertPopup(json['error'],'error');
                }
                else  if(json['success']=='200'){

                    displayPostEditableFieldPanel(form_id);
                }
                //displayDynamicFeePanel(form_id);
            },
            error: function (xhr, ajaxOptions, thrownError) {
               // alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                 console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
       });     
       
       $('#ConfirmPopupArea').modal('hide');
    });   
}

function AddTableRowCellWise(after_id){
    
    next_rows = parseInt(next_rows) + 1;
    
    var html ='<span id=r' + next_rows + '><input placeholder="Row ' + next_rows + ' Label" name="rows_' + next_rows + '"  class="form-control"  type="text" value="" id="rows_' + next_rows + '"> Is Required? <select name="rows_chk_' + next_rows + '" id="rows_chk_' + next_rows + '"><option value="false">False</option><option value="true">True</option></select><div class="pull-right"><a href="javascript:void(0);" onclick="return RemoveTableCellWise(\'r' + next_rows + '\');"><i class="fa fa-remove"></i></a>&nbsp;<a href="javascript:void(0);"  onclick="AddTableRowCellWise(\'r'+next_rows+'\');"><i class="fa fa-plus"></i></a></div></span>';
    
    if(after_id==""){
        $('#table_rows').append(html);
    }
    else {
        $('#'+after_id).after(html);
    }
    
    // add cell
 
    var total_cols = $('#table_cols').find('span').length;
    var row_div = jQuery('<div id="row_div_'+next_rows+'" class="row_div"></div>');
    
    var last_id = jQuery('select[id^="cell_input_type_"]').last().attr('id');
    var id_array = last_id.split("cell_input_type_");
    var next_insert_id = eval(parseInt(id_array[1])+1);
    
    next_insert_id = next_insert_id + Math.floor(Math.random() * (10000 - 50 + 1)) + 50;
    
    for(var i=0; i<total_cols;i++){
        
        next_insert_id = next_insert_id+i;
        html_cell= jQuery('.tbcell').eq(i).clone();
        
        jQuery(html_cell).removeAttr('class').addClass('r'+next_rows+' c'+eval(i+1)+' labelFormEle active tbcell');
        jQuery(html_cell).find('.row_name_span').removeAttr('class').addClass('row_name_span label_span_rows_'+next_rows).html('Row '+next_rows);
        
        jQuery(html_cell).find('select[id^="cell_input_type_"]').attr({
            id:'cell_input_type_'+next_insert_id,
            name:'cell_input_type_'+next_insert_id,
            onchange:"ShowHideType(this.value, '"+next_insert_id+"');"});
        
        jQuery(html_cell).find('select[id^="predefined_dropdown_key_"]').attr({
            id:'predefined_dropdown_key_'+next_insert_id,
            name:'predefined_dropdown_key_'+next_insert_id});
        
        jQuery(html_cell).find('textarea[id^="custom_dropdown_values_"]').attr({
            id:'custom_dropdown_values_'+next_insert_id,
            name:'custom_dropdown_values_'+next_insert_id});

        
        var final_html = jQuery(row_div).append(html_cell);
    }
    jQuery('#table_cells_list').append(final_html);
}

function AddTableColumnCellWise(after_id) {
    
    next_cols = parseInt(next_cols) + 1;
    var html = '<span id=c' + next_cols + '><input placeholder="Column  ' + next_cols + ' Label" name="cols_' + next_cols + '" type="text" value="" class="form-control"   id="cols_' + next_cols + '"> Is Required? <select name="cols_chk_' + next_cols + '" id="cols_chk_' + next_cols + '"><option value="false">False</option><option value="true">True</option></select>';

         html+='<div class="pull-right"><a href="javascript:void(0);" onclick="return RemoveTableCellWise(\'c' + next_cols + '\');"><i class="fa fa-remove"></i></a>&nbsp;<a href="javascript:void(0);"  onclick="AddTableColumnCellWise(\'c'+next_cols+'\');"><i class="fa fa-plus"></i></a></div></span>';
     if(after_id==""){
        $('#table_cols').append(html);
    }
    else {
       $('#'+after_id).after(html);
    }
    
    // Add Cols to row
    
    var last_id = jQuery('select[id^="cell_input_type_"]').last().attr('id');
    var id_array = last_id.split("cell_input_type_");
    var next_insert_id = eval(parseInt(id_array[1])+1);
    next_insert_id = next_insert_id + Math.floor(Math.random() * (10000 - 50 + 1)) + 50;
    var ii=0;
    jQuery('div.row_div').each(function(){
        next_insert_id = next_insert_id+ii;
        ii++;
        var htmlclass = jQuery(this).attr('id');
        var class_array = htmlclass.split('row_div_');
        var row_id =class_array[1];
        var row_name = jQuery(this).find('.row_name_span').eq(0).text();
        
        var html_cell= jQuery('.tbcell').eq(0).clone();
        jQuery(html_cell).find('.col_name_span').removeAttr('class').addClass('col_name_span label_span_cols_'+next_cols).html('Col '+next_cols);
        jQuery(html_cell).find('.row_name_span').removeAttr('class').addClass('row_name_span label_span_rows_'+row_id).html('Col '+next_cols);
        jQuery(html_cell).removeAttr('class').addClass('r'+row_id+' c'+next_cols+' labelFormEle active tbcell ');
        
        jQuery(html_cell).find('select[id^="cell_input_type_"]').attr({
            id:'cell_input_type_'+next_insert_id,
            name:'cell_input_type_'+next_insert_id,
            onchange:"ShowHideType(this.value, '"+next_insert_id+"');"});
        
        jQuery(html_cell).find('select[id^="predefined_dropdown_key_"]').attr({
            id:'predefined_dropdown_key_'+next_insert_id,
            name:'predefined_dropdown_key_'+next_insert_id});
        
        jQuery(html_cell).find('textarea[id^="custom_dropdown_values_"]').attr({
            id:'custom_dropdown_values_'+next_insert_id,
            name:'custom_dropdown_values_'+next_insert_id});

                
        jQuery('#row_div_'+row_id).append(html_cell);
        
    });
}

function changeCellLabel(hidden_id){
    
    var selected_field = global_data["serialize_" + hidden_id];
    
    for(var key in selected_field){
        //console.log();
        
        var fld_name = selected_field[key].name;
        var fld_value =  selected_field[key].value;
//        var row = /rows_\d+/.exec(fld_name);
        var rows = fld_name.match(/rows_\d+/);
        
//        var cols = fld_name.match(/cols_\d+/);
        if(fld_name.match(/rows_\d+/) || fld_name.match(/cols_\d+/)){
            jQuery('.label_span_'+fld_name).text(fld_value);
        }        
    }
}
function CustomScriptEditorPopup(form_id){
    
    $('#CustomScriptEditorPopup #message_div')
            .removeClass('alert-success')
            .removeClass('alert-danger')
            .html('')
            .hide();
    $.ajax({
        url: '/form/custom-script-editor-save/',
        type: 'post',
        dataType: 'json',
        data: {cs_form_id:form_id,act:'getData'},
        async:false,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            
            
            if(json['redirect']){
                location = json['redirect'];
            } else if(json['error']){
                $('#message_div').removeClass('alert-success').addClass('alert-danger').html(json['error']);
                $('#message_div').show();
                
            } else if(json['success'] == 200){
                $('#script_editor').val(json['custom_script']);
                $('#custom_script_autoload').val(json['custom_script_autoload']);
                $('#custom_script_fields').val(json['custom_script_fields']);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    $('#CustomScriptEditorPopup').modal();
}

function CustomScriptEditorSave(){
    
    var data = $('#CustomScriptEditorForm').serializeArray();
    $('#message_div')
            .removeClass('alert-danger')
            .removeClass('alert-success')
            .addClass('alert-info')
            .html('Saving....');
    
    $('#message_div').show();
    
    $.ajax({
        url: '/form/custom-script-editor-save/',
        type: 'post',
        dataType: 'json',
        data: data,
        async:false,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            
            
            if(json['redirect']){
                location = json['redirect'];
            } else if(json['error']){
                $('#message_div').removeClass('alert-success').addClass('alert-danger').html(json['error']);
                $('#message_div').show();
                
            } else if(json['success'] == 200){
               $('#message_div').removeClass('alert-danger').addClass('alert-success').html(json['message']);
               $('#message_div').show();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
    return false;
    
}

function CloneDymanicFormPrefixFields(elem){
     var cloned = $('div.all_fields:first').clone();
     $('div#cloneButton').before(cloned);
     //$('#loop_'+new_id).hide(); // this is for effect.
     //$('#loop_'+new_id).fadeIn('slow'); // this is for effect.
}

// this function is used in get_attributes ctp file.
function selectSetup(){
    // this change function will work on every select field for attributes popup window
    $("#raw_data select").change(function() {
      var id=this.id;
      if(id=="machine_key"){ // if select id is machine_key
            selVal=$('#'+id).val();
            if(selVal=="profile_image" || selVal=="signature_image"){
                $('#max_files').val("1");
                $('#max_files').attr("readonly","true");
            }else{
                $('#max_files').val("1");
                $('#max_files').removeAttr("readonly");
            }
      }
      //console.log(selVal);
    });
    
    // this is onload event when saved attributes is reopened then do the required setup
    $( document ).ready(function() {
        selVal=$('#machine_key').val();
        if(selVal=="profile_image" || selVal=="signature_image"){
            $('#max_files').val("1");
            $('#max_files').attr("readonly","true");
        }else{
            //$('#max_files').val("1");
            $('#max_files').removeAttr("readonly");
        }
    });
}

//If Required true and Make Disabled dropdown value is True then display error message
$(document).on('change','#raw_data select#is_disable_field, #raw_data select#required', function (){    
    if($('#raw_data select#required').val()=='true' && $('#raw_data select#is_disable_field').val()=='true') {
        
        if($(this).attr('id') =='required') {
            $('#raw_data select#is_disable_field option').removeAttr("selected");
            $('#raw_data select#is_disable_field').trigger('chosen:updated');
        } else if ($(this).attr('id') =='is_disable_field') {
            $('#raw_data select#required option').removeAttr("selected");
            $('#raw_data select#required').trigger('chosen:updated');
        }
    }
});
/**
 * use by conditional logic
 * @param object elem
 * @param int field_count
 * @param string selected
 * @returns boolean
 */

function value_type_option(elem,field_count,selected,duration){
    if(typeof selected == 'undefined'){
        selected ="";
    }
    if(typeof duration == 'undefined'){
        duration="";
    }
    jQuery("#value_div_"+field_count).find('.input').html('');
    var elem_val = jQuery(elem).val();
    var if_value = jQuery('#if_'+field_count).val();
    var part_f = if_value.split(':');
    if(elem_val=='value_text'){
        // value_text
        var placeHolderText="Enter numeric value";
        if(typeof part_f[2] != 'undefined' && part_f[2]=='date'){
            placeHolderText="Enter date in dd/mm/yyyy format";
//            calendar logic 
        }
        var textbox_html = jQuery('<input/>')
        .attr({ type: 'text', name:'condition['+field_count+'][field_value][]', value:selected,placeholder:placeHolderText,id:'#field_value_'+field_count});

        jQuery("#value_div_"+field_count).find('.input').append(textbox_html);
        
    }else{
        // value_field
        var fieldClone = jQuery('#if_0').clone();
        var state_val = jQuery('#state_'+field_count).val();
        var temp='';
        jQuery(fieldClone).attr('id','field_value_'+field_count);
        jQuery(fieldClone).removeAttr('class').addClass('if_field_value');
        jQuery(fieldClone).removeAttr('onchange');
        jQuery(fieldClone).attr('name','condition['+field_count+'][field_value][]');
        jQuery(fieldClone).find('select').removeAttr('multiple');
        jQuery(fieldClone).find('select').each(function(){
            this.name = this.name.replace('[0]','['+field_count+']');
        });
        if(typeof part_f[2] != 'undefined' && part_f[2]=='date'){
            jQuery(fieldClone).find('option').each(function(){
                    temp=$(this).val().split(':'); 
                    if(typeof temp[2] != 'undefined' && temp[2]!='date'){
                         $(this).remove();
                    }
            });
            jQuery(fieldClone).val(selected);
            jQuery("#value_div_"+field_count).find('.input').append(fieldClone);
            if($.inArray(state_val,["greater_than","gt_equal_to","less_than","lt_equal_to"])!=-1){
                var textbox_html = jQuery('<input/>').attr({ type: 'text', 
                    name:'condition['+field_count+'][field_value_duration][]', value:duration,
                    placeholder:'By gap 365 days format',id:'#field_value_duration'+field_count});
                jQuery("#value_div_"+field_count).find('.input').append( '<label class="control-label pull-left" for="" style="text-align: center;width: 10%;margin-top: 5px;">BY</label>');
                jQuery("#value_div_"+field_count).find('.input').append( '<div class="pull-right inputgap" style="margin-top: 5px;width: 90%;">');
                jQuery("#value_div_"+field_count).find('.inputgap').append( textbox_html);
                jQuery("#value_div_"+field_count).find('.input').append('</div>');
                jQuery("#value_div_"+field_count).find('.inputgap').append('<small class="text-muted">ex:- 365</small>');
            }else{
//                $('#field_value_duration'+field_count).remove();
            }
        } else{
            // remove other then textbox
            jQuery(fieldClone).find('option').each(function() {
                var optval = this.value;
                if(optval.indexOf('textbox')<0){
                    $(this).remove();
                }
            });
            jQuery(fieldClone).val(selected);
            jQuery("#value_div_"+field_count).find('.input').append(fieldClone);
        }
    }   
}

function checkState(id_num){
    var if_value = jQuery('#if_'+id_num).val();
    var part_f = if_value.split(':');
    if(typeof part_f[2] != 'undefined' && part_f[2]=='date'){
        $('input[name="condition['+id_num+'][radio_value_type][]"]').trigger("click");
    }
    var state_val = jQuery('#state_'+id_num).val();
    if('equal_to_empty'==state_val || 'equal_to_not_empty'==state_val){
        jQuery("#value_type_option_"+id_num).find('[type="radio"]').each(function(){
            $(this).prop('checked', false);
        });
        jQuery("#field_value_"+id_num).val("");
        jQuery("#value_type_option_"+id_num).hide();
        jQuery("#value_div_"+id_num).hide();
        jQuery("#value_div_"+id_num).prev('label').hide();
    }else{
        if(typeof part_f[2] != 'undefined' && (part_f[2]=='textbox' || part_f[2]=='date')){
            jQuery("#value_type_option_"+id_num).show();
        }
        jQuery("#value_div_"+id_num).show();
        jQuery("#value_div_"+id_num).prev('label').show();
    }
    return false;
}

function displayApplicantDocumentListPanel(form_id,college_id){
    
    $('#popup_window').show();
    jQuery.LoadingOverlay("show");
    // alert(form_id);
    if(typeof college_id=='undefined'){
        var college_id = $("setClgId").val();
    }
    $.ajax({
        url: '/form/applicant-document-list',
        type: 'post',
        dataType: 'html',
        async:false,
        data: {
            form_id: form_id,
            college_id: college_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            LoadSlimScroll();
            
            LoadSlimScrollTableMapping();
            jQuery.LoadingOverlay("hide",true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}


function displayApplicantDocument(form_id,college_id,index_id){

  $('#popup_window').show();
    if(typeof college_id == 'undefined'){
      var college_id = $("#setClgId").val();
    }
    if(typeof index_id =='undefined'){
        index_id ='';
    }
  $.LoadingOverlay("show");
    // alert(form_id);
    $.ajax({
        url: '/form/applicant-document',
        type: 'post',
        dataType: 'html',
        async:false,
        data: {
            form_id: form_id,
            college_id:college_id,
            index_id:index_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            LoadSlimScroll();
            $.LoadingOverlay("hide",true);
            $("#setClgId").val(college_id);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false; 
}

function saveApplicantDocument(){

    var form_data  = $('#saveApplicantDocumentForm').serialize();
    var form_id    = $('#form_id').val();
    var field_data = $("#if_0").val().trim();
    $("#error_div").html('');
    $("#error_div").hide('');
    if(field_data == ''){
        $("#error_div").html('Please select field');
        $("#error_div").show('Please select field');
        $("#if_0").focus();
        return false;
    }
    
    var clgId = $("#setClgId").val();
    $.LoadingOverlay("show");
    var act_url = $('#saveApplicantDocumentForm').attr('action');
    $.ajax({
        url: act_url,
        type: 'post',
        dataType: 'json',
        async:false,
        data:  form_data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        complete : function(){ jQuery.LoadingOverlay("hide",true);},
        success: function (json) {
            if(json['redirect']){
//                    location = json['redirect'];
            }
            else if(json['error']){
                alertPopup(json['error'],'error');
            }
            else  if(json['success']=='200'){
               displayApplicantDocumentListPanel(form_id, clgId);
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
             console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

function removeApplicantDocument(form_id,college_id,index_id){
    if(typeof college_id=='undefined'){
     var college_id = $("#setClgId").val();
 }
    $('#ConfirmMsgBody').html('are you sure to delete Applicant Document?');
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmYes', function (e) {
        e.preventDefault();
        jQuery.ajax({
            url: '/form/save-applicant-document',
            type: 'post',
            dataType: 'json',
            async:false,
            data: {
                "index_id": index_id,
                "form_id" : form_id,
                'delete'  : 'delete'  
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (json) {
                if(json['redirect']){
                    location = json['redirect'];
                }
                else if(json['error']){
                    alertPopup(json['error'],'error');
                }
                else  if(json['success']=='200'){

                    displayApplicantDocumentListPanel(form_id, college_id);
                }
                //displayDynamicFeePanel(form_id);
            },
            error: function (xhr, ajaxOptions, thrownError) {
               // alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                 console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
       });     
       
       $('#ConfirmPopupArea').modal('hide');
    });   
}


function displayConditionalFormPanel(form_id){
    
    $('#popup_window').show();
    jQuery.LoadingOverlay("show");
    $.ajax({
        url: '/form/conditional-form-config',
        type: 'post',
        dataType: 'html',
        async:false,
        data: {
            form_id: form_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            LoadSlimScroll();
            
            LoadSlimScrollTableMapping();
            jQuery.LoadingOverlay("hide",true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;   
}


function addConditionalLogic(formId, indexId, stepId){
    if(typeof indexId =='undefined'){
        indexId ='';
    }
    if(typeof stepId =='undefined'){
        stepId ='';
    }
    
    jQuery.LoadingOverlay("show");
    $.ajax({
        url: '/form/add-conditonal-logic',
        type: 'post',
        dataType: 'html',
        async: false,
        data: {
            form_id: formId,
            index_id:indexId,
            step_id:stepId
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#popup_window').html(data);
            LoadSlimScrollTableMapping();
            jQuery.LoadingOverlay("hide",true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;

}


function saveConditionalFormFlowLogic(){

    var form_data  = jQuery('#saveConditionalFormLogic').serialize();
    var form_id    = jQuery('#form_id').val();

    $("#error_div").html("");
    $("#error_div").hide();
    var formStage = jQuery('#stage_condition_0').val();
    if(formStage == '' || formStage == '0'){
        $("#error_div").html("Please Select Stage");
        $("#error_div").show();
        $("#stage_condition_0").focus();
        return false;
    }
    jQuery.LoadingOverlay("show");
    var act_url = jQuery('#saveConditionalFormLogic').attr('action');
    
    // ajax to save data

    $.ajax({
        url: act_url,
        type: 'post',
        dataType: 'json',
        async: false,
        data:  form_data,
        
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            jQuery.LoadingOverlay("hide",true);
            if(json['redirect']){
                location = json['redirect'];
            }
            else if(json['error']){
                alertPopup(json['error'],'error');
            }
            else  if(json['success'] == '200'){
                displayConditionalFormPanel(form_id);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
             console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}


function removeConditionalLogic(formId, indexId, stepId){
    
    $('#ConfirmMsgBody').html('are you sure to delete form step config?');
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmYes', function (e) {
        e.preventDefault();
        jQuery.ajax({
            url: '/form/save-conditional-form-logic',
            type: 'post',
            dataType: 'json',
            async:false,
            data: {
                "step_id": stepId,
                "index_id": indexId,
                "form_id" : formId,
                'delete'  : 'delete'  
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (json) {
                if(json['redirect']){
                    location = json['redirect'];
                }
                else if(json['error']){
                    alertPopup(json['error'],'error');
                }
                else  if(json['success'] == '200'){

                    displayConditionalFormPanel(formId);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                 console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
       });     
       
       $('#ConfirmPopupArea').modal('hide');
    });   
}
$(document).on('change', '#default_show_class', function() {
    if(isTable == 'true' && $('#default_show_class').val() == 'true') {
        var req = 'false';
        $('[name^=rows_chk_], [name^=cols_chk_]').each(function(index, elem) {
            if($(elem).val() == 'true') req = 'true';
        });
        if(req == 'true') {
            $('#ConfirmMsgBody').html('You are about to make a mandatory field hidden. Are you sure you want to continue?');
            $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
            .one('click', '#confirmYes', function () {
                default_show_class_previous = $('#default_show_class').val();
                $('#ConfirmPopupArea').modal('hide');
                return true;
            })
            .one('click', '#confirmNo', function () {
                $('#default_show_class').val(default_show_class_previous).trigger('chosen:updated');
                $('#ConfirmPopupArea').modal('hide');
                return true;
            });
        }
    } else if($("#required").val() == 'true' && $('#default_show_class').val() == 'true') {
        $('#ConfirmMsgBody').html('You are about to make a mandatory field hidden. Are you sure you want to continue?');
        $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmYes', function () {
            default_show_class_previous = $('#default_show_class').val();
            $('#ConfirmPopupArea').modal('hide');
            return true;
        })
        .one('click', '#confirmNo', function () {
            $('#default_show_class').val(default_show_class_previous).trigger('chosen:updated');
            $('#ConfirmPopupArea').modal('hide');
            return true;
        });
    } else {
        default_show_class_previous = $('#default_show_class').val();
    }
});
$(document).on('change', '#required', function() {
    if($("#required").val() == 'true' && $('#default_show_class').val() == 'true') {
        $('#ConfirmMsgBody').html('You are about to make a hidden field mandatory for the applicant. Are you sure you want to continue?');
        $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmYes', function () {
            required_previous = $('#required').val();
            $('#ConfirmPopupArea').modal('hide');
            return true;
        })
        .one('click', '#confirmNo', function () {
            $('#required').val(required_previous).trigger('chosen:updated');
            $('#ConfirmPopupArea').modal('hide');
            return true;
        });
    } else {
        required_previous = $('#required').val();
    }
});

$(document).on('change', '[name^=rows_chk_], [name^=cols_chk_]', function() {
    if($(this).val() == 'true' && $('#default_show_class').val() == 'true') {
        var reqDropDown = $(this).attr('id');
        $('#ConfirmMsgBody').html('You are about to make a hidden field mandatory for the applicant. Are you sure you want to continue?');
        $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmYes, #confirmNo', function () {
            if($(this).attr('id') == 'confirmNo') $("#"+reqDropDown).val('false');
            $('#ConfirmPopupArea').modal('hide');
            return true;
        });
    }
});

/*
 * #APPLICANT DOCUMENT
 * Function to get sub dropdown value for if field block
 */
function loadSubDropValue(thisEvent) {
    var ifFieldOption = $("#saveApplicantDocumentForm select[name='if_field'] option:selected");
    var ifSelectedValue = ifFieldOption.val();
    var isApplicationStageSelected = ifSelectedValue.startsWith("application_stage");
    
    //write ajax code for get sub-stages
    if(isApplicationStageSelected) {
        var selectedStages  = $("#saveApplicantDocumentForm select[name='if_field_value[]']").val();
        var stages  = [];
        for(var key in selectedStages){
            var selectedStagesVal   = selectedStages[key].split("|");
            stages.push(selectedStagesVal[0]);
        }
        $.ajax({
            url: '/common/getLeadSubStages',
            type: 'post',
            data: {
                'formId': $("#saveApplicantDocumentForm #form_id").val(),
                'stageId': stages,
                'calledFrom': 'applicantDocumentConfig',
                //'collegeId':jsVars.college_id
            },
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () { 
                $("#subStageDropdownDiv").hide();
                $("#subStageDropdown").html("");
            },
            success: function (response) { 
                if(response.substring(2, 7) == "Error") {
                    obj = JSON.parse(response);
                    if (obj.Error === 'session'){
                        location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                    }else {
                        alert(obj.Error);
                    }                
                }else{
                    obj = JSON.parse(response);
                    if(obj.subStageList) {
                        var selectHtml = '<select multiple class="ifSubStageSelect form-control" name="if_sub_stage_select[]" id="if_sub_stage_select">';
                        $.each(obj.subStageList, function(key, value){
                            selectHtml += "<option value='"+key+"'>"+value+"</option>";
                        });
                        $("#subStageDropdown").html(selectHtml);
                        $("#subStageDropdown").show();
                        $("#subStageDropdownDiv").show();
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }else{
        if($("#subStageDropdownDiv").length){
            $("#subStageDropdownDiv").hide();
        }
        if($("#subStageDropdown").length){
            $("#subStageDropdown").hide();
        }
    }
}

function displayUniqueAcrossApplicantPanel(form_id){
    $('#popup_window').show();
    getUniqueAcrossApplicantList(form_id);
}

function getUniqueAcrossApplicantList(form_id){
    $.ajax({
        url: '/form/unique-across-applicant-field-list',
        type: 'post',
        dataType: 'html',
        async: false,
        data: {
            form_id: form_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if (data === 'session') {
                window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(data === 'invalid_request'){
                alertPopup('Invalid Request', 'error');
                jQuery.LoadingOverlay("hide",true);
                return;
            }
            else{
                $('#popup_window').html(data);
                LoadSlimScroll();
                LoadSlimScrollTableMapping();
                jQuery.LoadingOverlay("hide",true);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

function uniqueApplicantFieldForm(form_id,index_id){
    if(typeof index_id ==='undefined'){
        index_id ='';
    }
    
    jQuery.LoadingOverlay("show");
     $.ajax({
        url: '/form/unique-across-applicant-field-form',
        type: 'post',
        dataType: 'html',
        async: false,
        data: {
            form_id: form_id,
            index_id:index_id
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if (data === 'session') {
                window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(data === 'invalid_request'){
                alertPopup('Invalid Request', 'error');
                jQuery.LoadingOverlay("hide",true);
                return;
            }
            else{
                $('#popup_window').html(data);
                LoadSlimScrollTableMapping();
                jQuery.LoadingOverlay("hide",true);
                disable_system_machine_value();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

function saveUniqueAcrossApplicantFieldGroup(){

    var form_data  = jQuery('#uniqueAcrossApplicantSave').serialize();
    var index_data = jQuery('#index_data').val();
    var form_id    = jQuery('#form-id').val();

    var error = false;
    if(typeof form_data === 'undefined' || form_data ===''){
        alertPopup("Please fill information");
        error = true;
    }

    if(error === false){
        var act_url = jQuery('#uniqueAcrossApplicantSave').attr('action');

        // ajax to save data
        $.ajax({
        url: act_url,
        type: 'post',
        dataType: 'json',
        async: false,
        data:  form_data,
        
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {

            if(json['redirect']){
                location = json['redirect'];
            }
            else if(json['error']){
                alertPopup(json['error'],'error');
            }
            else  if(json['success']=='200'){
                displayUniqueAcrossApplicantPanel(form_id);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
             console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    }

    return false;
}

function removeuniqueAccrossApplicantField(form_id,index_id){
    if(typeof form_id == 'undefined'){
        form_id = '';
    }

    $('#ConfirmMsgBody').html('are you sure to delete unique Field Condition?');
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmYes', function (e) {
        e.preventDefault();
        jQuery.ajax({
            url: '/form/unique-across-applicant-save',
            type: 'post',
            dataType: 'json',
            async:false,
            data: {
                "index_id": index_id,
                "form_id" : form_id,
                'delete'  : 'delete'  
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (json) {
                if(json['redirect']){
                    location = json['redirect'];
                }
                else if(json['error']){
                    alertPopup(json['error'],'error');
                }
                else  if(json['success']=='200'){
                    displayUniqueAcrossApplicantPanel(form_id);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                 console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
       });
       $('#ConfirmPopupArea').modal('hide');
    });
}
