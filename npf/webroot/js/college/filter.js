$(document).ready(function () {
    //For display Filter Saved popup in Lead Manager
    $('#saveLeadFilter').click(function(){
        if($("#FilterLeadForm #user_college_id").length){
            var collegeId = $("#FilterLeadForm #user_college_id").val();
            if(collegeId == '' || collegeId == '0'){
                $("#college_error").html('<small class="text-danger">Please Select Institute</small>');
                return false;
            }
        }
        //Remove the Attribute
        $('#filterColumnDiv').html('');
        $('input[name="mark_as_by_default"]').prop('checked', false);
        $('#filterViewModal .filterTextchange').text($('#filterViewModal .filterTextchange').text().replace('View Name', 'Filter Name'));
        $('#filterColumnSaveBtn').removeAttr('onclick').html('Save');
        $('#filterViewModal').modal('show');
        $('#filterColumnSaveBtn').attr('onclick','javascript:saveFilterAndColumn($.trim($(\'#user_college_id\').val()),\'advanceLM\',\'filter\',\'FilterLeadForm\',\'saved_filter_li_list\')');
        $('#filter_name').val('');
    });

    //For display Column Saved popup in Lead Manager
    $('#saveLeadColumn').click(function(){
        //Remove the Attribute
        $('#filterColumnDiv').html('');
        $('input[name="mark_as_by_default"]').prop('checked', false);
        $('#filterViewModal .filterTextchange').text($('#filterViewModal .filterTextchange').text().replace('Filter Name','View Name'));
        $('#filterColumnSaveBtn').removeAttr('onclick').html('Save View');
        $('#filterViewModal').modal('show');
        $('#filterColumnSaveBtn').attr('onclick','javascript:saveFilterAndColumn($.trim($(\'#user_college_id\').val()),\'advanceLM\',\'column\',\'FilterLeadForm\',\'quick_advance_view_li_list\')');
        $('#filter_name').val('');
    });

    //For display Filter Saved popup
    $('#saveApplicationFilter').click(function(){
        //condition for application module
        if($("#FilterApplicationForms #college_id").length){
            var collegeId = $("#FilterApplicationForms #college_id").val();
            if(collegeId == '' || collegeId == '0'){
                $("#college_error").html('<small class="text-danger">Please Select Institute</small>');
                return false;
            }
        }

        //Remove the Attribute
        $('#filterColumnDiv').html('');
        $('input[name="mark_as_by_default"]').prop('checked', false);
        $('#filterViewModal .filterTextchange').text($('#filterViewModal .filterTextchange').text().replace('View Name', 'Filter Name'));
        $('#filterColumnSaveBtn').removeAttr('onclick').html('Save');
        $('#filterViewModal').modal('show');
        //$('#filterViewModal').css('z-index','110011');
		//$(".modal-backdrop").css('z-index', '110010');
        $('#filterColumnSaveBtn').attr('onclick','javascript:saveFilterAndColumn($.trim($(\'#FilterApplicationForms #college_id\').val()),\'application\',\'filter\',\'FilterApplicationForms\',\'saved_filter_li_list\')');
        $('#filter_name').val('');
    });

    $('#saveApplicationColumn').click(function(){
        //Remove the Attribute
        $('#filterColumnDiv').html('');
        $('input[name="mark_as_by_default"]').prop('checked', false);
        $('#filterViewModal .filterTextchange').text($('#filterViewModal .filterTextchange').text().replace('Filter Name','View Name'));
        $('#filterViewModal .modal-header .modal-title').text($('#filterViewModal .modal-header .modal-title').text().replace('Save Filters','Save View'));
        $('#filterColumnSaveBtn').removeAttr('onclick').html('Save View');
        $('#filterViewModal').modal('show');
        $('#filterColumnSaveBtn').attr('onclick','javascript:saveFilterAndColumn($.trim($(\'#college_id\').val()),\'application\',\'column\',\'FilterApplicationForms\',\'smart_view_li_list\')');
        $('#filter_name').val('');
    });

//    $( "button#seacrhList" ).bind( "click", function() {
//        getSavedFilterList($.trim($('#college_id').val()),'application','column','quick_advance_view_app_li_list');
//    });

$('.quickFilter').click(function(){
	$('#saved_filter_li_list').toggle();
	$(this).find('.glyphicon').toggleClass('glyphicon-menu-right glyphicon-menu-down');
});
$('.defaultQuickFilter').click(function(){
	$('#saved_filter_default_li_list').toggle();
	$(this).find('.glyphicon').toggleClass('glyphicon-menu-right glyphicon-menu-down');
});

$('#savedFilterList').mouseover(function(){
    var default_text_view = $('.default-txt-view').html();
    default_text_view = default_text_view.replace(/&nbsp;/g,' ').trim();
    if(default_text_view.length>30){
        $(this).attr("title",default_text_view);
    }else{
        $(this).removeAttr("title");
    }
});
$('#download_all,#export_type').on('change', function(e) {
    e.preventDefault();
});

});


/**
 * This function will save filter and view in database
 * @param {type} module_name
 * @param {type} save_type
 * @param {type} form_id
 * @return {undefined}
 */
function saveFilterAndColumn(college_id,module_name,save_type,form_tag_id_name,ul_id){
    if(('#'+form_tag_id_name).length==0){alert('Form Id does not exist!');}
    if($.trim($('#filter_name').val())==''){
        if(save_type=='filter') {
            var txt_name='filter';
        } else {
            var txt_name='view';
        }
        $('#filterColumnDiv').html('Please enter '+txt_name+' name.').addClass('error');

        return false;
    }

    var filter_name = $.trim($('#filter_name').val());
    var mark_as_by_default = $('input[name="mark_as_by_default"]:checked').val();
    $('#filterColumnDiv').html('');
    var data = $('#'+form_tag_id_name).serializeArray();
    data.push({name: "module_name", value: module_name});
    data.push({name: "save_type", value: save_type});
    data.push({name: "filter_name", value: filter_name});
    data.push({name: "mark_as_by_default", value: mark_as_by_default});

    $.ajax({
        url: '/common/save-column-filter-list',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            hideLoader();
        },
        success: function (json) {
            hideLoader();
            if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                window.location.href = json['redirect'];
            }else if (typeof json['error'] != 'undefined' && json['error'] != "") {
                $('#filterColumnDiv').html(json['error']).addClass('error margin-bottom-8');
            } else if (typeof json['status'] != 'undefined' && json['status'] == 200) {
                $('#filterViewModal').modal('hide');
                alertPopup(json['message'], 'success');


                //if filter is saved and lastinsert id is not blank then display that data
                if(save_type=='filter') {
                    if(json['lastInsertID'] !== ''){
                        showFilterByID(''+json['lastInsertID']+'',''+college_id+'',''+module_name+'',''+save_type+'','',filter_name);
                    }
                }
                getSavedFilterList(college_id,module_name,save_type,ul_id)
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
             hideLoader();
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

/**
 * This function will fetch saved filter list
 * @param {type} college_id
 * @param {type} module_name
 * @param {type} filter_type
 * @param {type} ul_id
 * @return {undefined}
 */
function getSavedFilterList(college_id,module_name,filter_type,ul_id){
    ul_id = 'smart_view_li_list';
    $.ajax({
        url: '/common/get-saved-filter-list',
        type: 'post',
        dataType: 'json',
        async:false,
        data: {"college_id":college_id,"module_name": module_name,"filter_type": filter_type},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () {
            if(module_name !== 'application'){
                showLoader();
            }
            // $('.default-txt-view').text('System Default View');
            $('.default-txt-view').parent().addClass('active');
            $('#'+ul_id).siblings('h6').hide();
            $('#'+ul_id).show();
        },
        success: function (json) {
            var li_list='';
            var li_list_shared='';
            var li_listParent_shared='';
            var li_listParent='';
            var cls='';
            var default_active = false;
            let default_system_view_li ='';
            $('#'+ul_id).parent('li').show();
            if (typeof json['redirect'] !== 'undefined' && json['redirect'] !== "") {
                window.location.href = json['redirect'];
            }else if (typeof json['error'] !== 'undefined' && json['error'] !== "") {
                $('#filterColumnDiv').html(json['error']).addClass('error margin-bottom-8');
            } else if (typeof json['data'] !== 'undefined' && json['data']!=='') {
                var shareViewPermission = 0;
                if(typeof json['shareViewPermission'] !== 'undefined') {
                    shareViewPermission = json['shareViewPermission'];
                }
                $.each(json['data'],function(k,v){
                    if(v.mark_as_by_default === 1){
                        default_active = true;
                        if(typeof v.parent_id =='undefined' || v.parent_id.length == '0'){
                            var shareIcon = '';
                            if(shareViewPermission) {
                                shareIcon ='<a href="javascript:void(0)" class="mr-5" data-toggle="tooltip" title="Share with users" data-placement="top" data-container="body" onclick="shareWithUser(\''+k+'\',\''+college_id+'\',\''+module_name+'\',\''+filter_type+'\',\''+ul_id+'\',this)"><i class="fa fa-share" aria-hidden="true"></i></a>';
                            }
                            var markedDefault = '<a class="mr-5 markDefaultSwitcher" tabindex="0"  role="button" data-toggle="tooltip" data-container="body" data-placement="top" data-trigger="hover" onclick="markAsByDefault(\''+k+'\',\''+college_id+'\',\''+module_name+'\',\''+filter_type+'\',this)" title="Marked as Default"><span class="fa fa-star animated zoomIn" aria-hidden="true"></span></a>';
                            li_listParent += '<li class="default-active text-right"><a class="text-left makeActive pull-left columnList '+cls+'" href="javascript:void(0);" onclick="showFilterByID(\''+k+'\',\''+college_id+'\',\''+module_name+'\',\''+filter_type+'\',this)"><i class="fa fa-angle-double-right" aria-hidden="true"></i>&nbsp;'+v.filter_name+'</a> '+shareIcon+markedDefault+'<a class="pull-right text-danger" tabindex="0"  role="button" data-toggle="tooltip" data-container="body" data-placement="top" data-trigger="hover" title="Click here to Remove" href="javascript:void(0);" onclick="deleteSavedFilter(\''+k+'\',\''+college_id+'\',\''+module_name+'\',\''+filter_type+'\',\''+ul_id+'\',this)"><i class="fa fa-trash-o" aria-hidden="true"></i></a></li>';
                        }
                        if(typeof v.parent_id !='undefined' && v.parent_id.length >0){
                            $('#show_shared_label').show();
                            $('#smart_view_li_list_shared').show();
                            var markedDefault_shared = '<a class="mr-5 markDefaultSwitcher" tabindex="0"  role="button" data-toggle="tooltip" data-container="body" data-placement="top" data-trigger="hover" onclick="markAsByDefault(\''+k+'\',\''+college_id+'\',\''+module_name+'\',\''+filter_type+'\',this)" title="Marked as Default"><span class="fa fa-star animated zoomIn" aria-hidden="true"></span></a>'
                            li_listParent_shared += '<li class="text-right default-active"><a class="text-left makeActive pull-left columnList '+cls+'" href="javascript:void(0);" onclick="showFilterByID(\''+k+'\',\''+college_id+'\',\''+module_name+'\',\''+filter_type+'\',this)"><i class="fa fa-angle-double-right" aria-hidden="true"></i>&nbsp;'+v.filter_name+'</a> '+markedDefault_shared+'</li>';
                        }
                    /*}else if(v.filter_name === "Payment Approved View" && module_name === "application" && filter_type === 'filter'){*/
                    }else if(v.filter_name === "Payment Approved View" && module_name === "application"){
                        var shareIcon = '';
                        if(shareViewPermission) {
                            shareIcon ='<a href="javascript:void(0)" class="mr-5" data-toggle="tooltip" title="Share with users" data-placement="top" data-container="body" onclick="shareWithUser(\''+k+'\',\''+college_id+'\',\''+module_name+'\',\''+filter_type+'\',\''+ul_id+'\',this)"><i class="fa fa-share" aria-hidden="true"></i></a>';
                        }
                        var markedDefault = '<a class="mr-5 markDefaultSwitcher" tabindex="0"  role="button" data-toggle="tooltip" data-container="body" data-placement="top" data-trigger="hover" onclick="markAsByDefault(\''+k+'\',\''+college_id+'\',\''+module_name+'\',\''+filter_type+'\',this)" title="Mark as Default"><span class="fa fa-star-o" aria-hidden="true"></span></a>';
                        li_listParent += '<li class="payment-approved-list" ><a class=" text-left pull-left columnList '+cls+'" href="javascript:void(0);" onclick="showFilterByID(\''+k+'\',\''+college_id+'\',\''+module_name+'\',\''+filter_type+'\',this)"><i class="fa fa-angle-double-right" aria-hidden="true"></i>&nbsp;'+v.filter_name+'</a> '+shareIcon+markedDefault+'<a class="pull-right text-danger" tabindex="0"  role="button" data-toggle="tooltip" data-container="body" data-placement="top" data-trigger="hover" title="Click here to Remove" href="javascript:void(0);" onclick="deleteSavedFilter(\''+k+'\',\''+college_id+'\',\''+module_name+'\',\''+filter_type+'\',\''+ul_id+'\',this)"><i class="fa fa-trash-o" aria-hidden="true"></i></a></li>';
                    } else {
                        if(typeof v.user_id !=='undefined' && v.user_id == '0'){
                            li_list += '<li class="text-right"><a class="pull-left columnList '+cls+'" href="javascript:void(0);" onclick="showFilterByID(\''+k+'\',\''+college_id+'\',\''+module_name+'\',\''+filter_type+'\',this)"><i class="fa fa-angle-double-right" aria-hidden="true"></i>&nbsp;'+v.filter_name+'</a></li>';
                        }else{
                            if(typeof v.parent_id =='undefined' || v.parent_id == ''){
                                var shareIcon = '';
                                if(shareViewPermission) {
                                    shareIcon ='<a href="javascript:void(0)" class="mr-5" data-toggle="tooltip" title="Share with users" data-placement="top" data-container="body" onclick="shareWithUser(\''+k+'\',\''+college_id+'\',\''+module_name+'\',\''+filter_type+'\',\''+ul_id+'\',this)"><i class="fa fa-share" aria-hidden="true"></i></a>';
                                }
                                var markedDefault = '<a class="mr-5 markDefaultSwitcher" tabindex="0" role="button" data-toggle="tooltip"  data-container="body" data-placement="top" data-trigger="hover" onclick="markAsByDefault(\''+k+'\',\''+college_id+'\',\''+module_name+'\',\''+filter_type+'\',this)" title="Mark as Default"><span class="fa fa-star-o" aria-hidden="true"></span></a>'
                                li_list += '<li class="text-right"><a class="text-left pull-left columnList '+cls+'" href="javascript:void(0);" onclick="showFilterByID(\''+k+'\',\''+college_id+'\',\''+module_name+'\',\''+filter_type+'\',this)"><i class="fa fa-angle-double-right" aria-hidden="true"></i>&nbsp;'+v.filter_name+'</a> '+shareIcon+markedDefault+' <a class="pull-right text-danger" href="javascript:void(0);" tabindex="0"  role="button" data-toggle="tooltip" data-container="body" data-placement="top" data-trigger="hover" title="Click here to Remove" onclick="deleteSavedFilter(\''+k+'\',\''+college_id+'\',\''+module_name+'\',\''+filter_type+'\',\''+ul_id+'\',this)"><i class="fa fa-trash-o" aria-hidden="true"></i></a>';
                                li_list +='</li>';
                            }
                            if(typeof v.parent_id !='undefined' && v.parent_id.length > 0){
                                $('#show_shared_label').show();
                                $('#smart_view_li_list_shared').show();
                                var markedDefault_shared = '<a class="markDefaultSwitcher" tabindex="0" role="button" data-toggle="tooltip"  data-container="body" data-placement="top" data-trigger="hover" onclick="markAsByDefault(\''+k+'\',\''+college_id+'\',\''+module_name+'\',\''+filter_type+'\',this)" title="Mark as Default"><span class="fa fa-star-o" aria-hidden="true"></span></a>'
                                li_list_shared += '<li class="text-right"><a class="text-left pull-left columnList '+cls+'" href="javascript:void(0);" onclick="showFilterByID(\''+k+'\',\''+college_id+'\',\''+module_name+'\',\''+filter_type+'\',this)">'+v.filter_name+'</a> '+markedDefault_shared+'</li>';
                            }
                        }
                    }
                });

                default_system_view_li = '<li>';
                if(default_active){
                    default_system_view_li += '<a class="pull-left columnList default-filterlist" href="javascript:void(0);" onclick="return filterDefault(false);"><i class="fa fa-angle-double-right" aria-hidden="true"></i>&nbsp;System Default View</a>';
                }else{
                    default_system_view_li += '<a class="makeActive pull-left columnList default-filterlist" href="javascript:void(0);" onclick="return filterDefault(false);"><i class="fa fa-angle-double-right" aria-hidden="true"></i>&nbsp;System Default View</a>';
                }
                    default_system_view_li += '</li>';

                $('#'+ul_id+' li.default-active').remove();
                $('#'+ul_id+' li.payment-approved-list').remove();
                $('#'+ul_id).html(default_system_view_li+li_listParent+li_list);
                $('#smart_view_li_list_shared').html(li_listParent_shared+li_list_shared);
                $('[data-toggle="tooltip"]').tooltip()
            }else{
                default_system_view_li = '<li>';
                default_system_view_li += '<a class="pull-left columnList default-filterlist" href="javascript:void(0);" onclick="return filterDefault(false);"><i class="fa fa-angle-double-right" aria-hidden="true"></i>&nbsp;System Default View</a>';
                default_system_view_li += '</li>';
                $('#'+ul_id).html(default_system_view_li);
                $('[data-toggle="tooltip"]').tooltip()
            }
        },
        complete: function () {
           hideLoader();
        },
        error: function (xhr, ajaxOptions, thrownError) {
             hideLoader();
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

/**
 * This function will delete Filter
 * @param {type} id
 * @param {type} college_id
 * @param {type} module_name
 * @param {type} filter_type
 * @returns {Boolean}
 */
function deleteSavedFilter(id,college_id,module_name,filter_type,ul_id,$this){
    $('#ConfirmMsgBody').html('Are you sure to delete?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
            $.ajax({
                url: '/common/delete-saved-filter',
                type: 'post',
                dataType: 'json',
                data: {"id":id,"college_id":college_id,"module_name": module_name,"filter_type": filter_type},
                headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                beforeSend: function () {
                    showLoader()
                },
                complete: function () {
                    hideLoader()
                },
                success: function (json) {
                   hideLoader()
                    if (typeof json['redirect'] !== 'undefined' && json['redirect'] !== "") {
                        window.location.href = json['redirect'];
                    }else if (typeof json['error'] !== 'undefined' && json['error'] !== "") {
                        $('#ConfirmPopupArea').modal('hide');
                        alertPopup(json['error'], 'success');
                    } else if (typeof json['status'] !== 'undefined' && json['status']===200) {
                        //filterDefault();
                        $('#ConfirmPopupArea').modal('hide');
                        alertPopup(json['message'], 'success');
                        var columnList = $.trim($($this).parent('li').children('a.columnList').text());
                        var savedFilterList = $.trim($('#savedFilterList .default-txt-view').text());
                        //Remove Parent Li
                        $($this).parent('li').remove();
                        $($this).parent().parent().parent().hide();
                        if(columnList === savedFilterList){
                            if(typeof $("ul#"+ul_id+" > li.default-active")!=='undefined' && $("ul#"+ul_id+" > li.default-active").length>0){
                                $("#"+ul_id+" > li.default-active a.columnList").trigger('click');
                            }else{
                                filterDefault();
                            }
                        }
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    hideLoader()
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        });
    return false;
}

/**
 * This function will generate filter list as per saved data
 * @param {type} id
 * @param {type} college_id
 * @param {type} module_name
 * @param {type} filter_type
 * @returns {Boolean}
 */
function showFilterByID(id, college_id, module_name, filter_type, $this, filter_name) {
    let realignment_order = '';
    $('#savedFilterList').parent().removeClass('open');
    $('#smart_view_li_list a.columnList').removeClass('makeActive');
    $('#smart_view_li_list_shared a.columnList').removeClass('makeActive');
    $('#saved_filter_default_li_list li a.columnList').removeClass('makeActive');
    if (module_name === 'application' || module_name === 'leadusers' || module_name === 'advanceLM') {
        $('.msg-filter').hide();
        $('.advanceFilterModal').show();
    }
    $($this).addClass('makeActive');
    $.ajax({
        url: '/common/get-saved-filter-detail',
        type: 'post',
        dataType: 'json',
        async: false,
        data: {"id": id, "college_id": college_id, "module_name": module_name, "filter_type": filter_type},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () {
            if (module_name !== 'application') {
//                showLoader();
            }
        },
        complete: function () {
            hideLoader();
        },
        success: function (json) {
            hideLoader();
            if (typeof json['redirect'] !== 'undefined' && json['redirect'] !== "") {
                window.location.href = json['redirect'];
            } else if (typeof json['error'] !== 'undefined' && json['error'] !== "") {
                $('#filterColumnDiv').html(json['error']).addClass('error margin-bottom-8');
            } else if (typeof json['data'] !== 'undefined' && json['data'] !== '') {
                if (typeof filter_name !== 'undefined') {
                    $('.default-txt-view').text(filter_name);
                } else {
                    $('.default-txt-view').text($($this).text());
                }
                $('#realignment_order').val('');
                $('#sort_options').val('');
                if (typeof json['data']['realignment_order'] !== 'undefined' && json['data']['realignment_order'].length > 0) {
                    realignment_order = json['data']['realignment_order'];
                    $('#realignment_order').val(realignment_order);
                    form_id = ''
                    json_data = json['data']
                    if (typeof json_data['static_data'] !== 'undefined') {
                        let static_data = json_data['static_data'];
                        if (typeof static_data['form_id'] !== 'undefined' && static_data['form_id'] > 0) {
                           form_id = static_data['form_id']
                        }
                    }
                    if (realignment_order.length > 0) {
                        createDefaultSortable(realignment_order, 'restore',college_id,form_id);
                    }
                }
                if (typeof json['data']['sort_order'] !== 'undefined' && json['data']['sort_order'].trim() !== "") {
                    $('#sort_options').val(json['data']['sort_order']);
                }
                if (module_name === 'application') {
                    createApplicationManagerFilter(json['data'], college_id);
                } else if (module_name === 'leadusers' || module_name === 'advanceLM') {
                    createLeadManagerFilter(json['data']);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            hideLoader();
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

/**
 * For Lead Manager Filter
 * @param {array} json_data
 * @param {string} filter_type
 * @returns {undefined}
 */
function createLeadManagerFilter(json_data) {
    let value_obj = json_data['selected_value'];
    let reset_filter = json_data['reset_filter'];
    renderSavedFilter(value_obj, 'fromUrl');
    if(typeof json_data['sort_order']!=='undefined' && json_data['sort_order']!==""){
        LoadMoreLeadsUser('reset','sorting');
    }else{
        LoadMoreLeadsUser('reset');
    }
    if (reset_filter) {
        $('#addMoreBlockBtn').trigger('click');
    }

}

function createApplicationManagerFilter(json_data, college_id) {
    let value_obj = json_data['selected_value'];
    let reset_filter = json_data['reset_filter'];
    $("#FilterApplicationForms #college_id").val(college_id);
    if (typeof json_data['static_data'] !== 'undefined') {
        let static_data = json_data['static_data'];
        if (typeof static_data['form_id'] !== 'undefined' && static_data['form_id'] > 0) {
            LoadFormsOnApplication(college_id, static_data['form_id'], '', 'renderSavedFilter');
        } else {
            LoadFormsOnApplication(college_id, '', '', 'Application');
        }
    } else {
        LoadFormsOnApplication(college_id, '', '', 'Application');
    }

    renderSavedFilter(value_obj, 'fromUrl');
    if(typeof json_data['sort_order']!=='undefined' && json_data['sort_order']!==""){
        LoadMoreApplication('reset','sorting');
    }else{
        LoadMoreApplication('reset');
    }
    if (reset_filter) {
        $('#addMoreBlockBtn').trigger('click');
    }
}

function markAsByDefault(id,college_id,module_name,filter_type,$this){
    let mark_as_by_default = 'false';
    if($($this).children('span').hasClass('fa-star')){
        mark_as_by_default = 'false';
    } else {
        mark_as_by_default = 'true';
    }

    if(module_name === 'leadusers' || module_name === 'advanceLM'){
        $('#smart_view_li_list .markDefaultSwitcher span').removeClass('fa-star animated zoomIn').addClass('fa-star-o').attr('data-content', 'Mark as Default');
        $('#smart_view_li_list_shared .markDefaultSwitcher span').removeClass('fa-star animated zoomIn').addClass('fa-star-o').attr('data-content', 'Mark as Default');
        $('#smart_view_li_list .markDefaultSwitcher').attr('data-content', 'Mark as Default');
    } else if(module_name === 'application'){
        $('#smart_view_li_list .markDefaultSwitcher span').removeClass('fa-star animated zoomIn').addClass('fa-star-o').attr('data-content', 'Mark as Default');
        $('#smart_view_li_list_shared .markDefaultSwitcher span').removeClass('fa-star animated zoomIn').addClass('fa-star-o').attr('data-content', 'Mark as Default');
        $('#smart_view_li_list .markDefaultSwitcher').attr('data-content', 'Mark as Default');
    }
    $('ul#smart_view_li_list > li').removeClass('default-active');
    if(mark_as_by_default === 'true'){
        $($this).children('span').addClass('fa-star animated zoomIn').removeClass('fa-star-o');
        $($this).attr('data-content', 'Marked as Default');
        $($this).parent().addClass('default-active');
    } else {
        $($this).children('span').addClass('fa-star-o').removeClass('fa-star animated zoomIn');
    }

    $.ajax({
        url: '/common/manageMarkAsByDefault',
        type: 'post',
        dataType: 'json',
        async:false,
        data: {"college_id":college_id, 'id':id, 'mark_as_by_default' : mark_as_by_default, 'module_name':module_name,'filter_type':filter_type},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            hideLoader();
        },
        success: function (json) {
            if (typeof json['status'] != 'undefined' && json['status'] == 200) {
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
             hideLoader();
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

/**
 * For Load Dependent Dropdown
 * @param {type} jsonResponse
 * @param {type} value_obj
 * @param {type} new_dropdown_name
 * @param {type} currentObj
 * @returns {undefined}
 */
function loadDynamicDependentDropdown(jsonResponse, value_obj, new_dropdown_name, currentObj){



    var dependentDropdownFieldIdList = (typeof jsonResponse['dependentDropdownFieldList']!='undefined' && typeof jsonResponse['dependentDropdownFieldList']['dependentFieldIdList'] !== 'undefined') ?
                            jsonResponse['dependentDropdownFieldList']['dependentFieldIdList'] : [];

    var dependentDropdownFieldList = (typeof jsonResponse['dependentDropdownFieldList']!='undefined' && typeof jsonResponse['dependentDropdownFieldList']['dependentFieldList'] !== 'undefined') ?
                            jsonResponse['dependentDropdownFieldList']['dependentFieldList'] : [];


    //For Dependent Dropdown
    var splitValue = new_dropdown_name.split('|');

    var isDependentField = false;
    if(typeof splitValue[0] !== 'undefined' && splitValue.length == 2) {

        if(typeof dependentDropdownFieldList[splitValue[1]] !== 'undefined') {
            isDependentField = true;
        } else if(splitValue[1] == 'course_id') {
            isDependentField = true;
            dependentDropdownFieldList['course_id'] = 'specialization_id';
        }

    }

    if(isDependentField) {
        if(typeof dependentDropdownFieldList[splitValue[1]] !== 'undefined') {

            var currentDropdownId = currentObj.attr('id');


            //For Course and Specialization Dropdown
            if(typeof dependentDropdownFieldList['university_id'] == 'undefined' && currentDropdownId == 'ud|course_id') {

                var childDependentValue = (typeof value_obj['ud|specialization_id'] !== 'undefined') ? value_obj['ud|specialization_id'] : '';
                GetChildByMachineKey($.trim(value_obj[new_dropdown_name]),'SpecialisationId',"",'','',childDependentValue,'','');
            } else {

                var childField = splitValue[0]+'|'+dependentDropdownFieldList[splitValue[1]];
                $.each(dependentDropdownFieldIdList, function(firstLevelKey, firstLevelValue) {

                    if(typeof firstLevelValue[currentDropdownId] !== 'undefined') {

                        var dependentField = firstLevelValue[currentDropdownId];
                        var dynamicDependentValue = value_obj[new_dropdown_name];
                        var childDependentValue = (typeof value_obj[childField] !== 'undefined') ? value_obj[childField] : '';


                        //Handle special case for Course and Specialization
                        var isCourseField = '';
                        var Choose = '';
                        //Check for Specialization
                        if(dependentField == 'SpecializationId') {
                            if($('#SpecializationId').length == 0) {
                                dependentField = 'SpecialisationId';
                            }
                        }else if(dependentField == 'CourseId') {
                            isCourseField = true;
                            Choose = 'Course';

                            if($('#'+dependentField).length == 0) {
                                dependentField = 'ud\\|course_id';
                            }
                        }

                        GetChildByMachineKey($.trim(value_obj[new_dropdown_name]),dependentField, Choose ,'','',childDependentValue,'','',true,isCourseField);
                    }
                });

            } //else
        }
    }
}

// Smart Views
$(document).ready(function () {
    $('#saveSmartViewBtn').click(function(){
        var modul_type = $(this).attr('data-module'); // application or advanceLM
        var college_id = 0;
        if(modul_type === 'advanceLM'){
            college_id = $.trim($('#user_college_id').val());
        }else{
            college_id = $.trim($('#college_id').val());
        }
        $('#smartViewModal #filterColumnDiv').html('');
        $('input[name="mark_as_by_default"]').prop('checked', false);
        $('#smartViewSaveBtn').removeAttr('onclick');
        $('#smartViewModal').modal('show');
        $('#smartViewSaveBtn').attr('onclick','javascript:saveSmartView("'+college_id+'","'+modul_type+'")');
        $('#smart_view_name').val('');
    });

    $('.smartViewFilter').click(function(){
        $('#smart_view_li_list').toggle();
        $(this).find('.glyphicon').toggleClass('glyphicon-menu-right glyphicon-menu-down');
    });

//    $('.quickAdvanceView').click(function(){
//        $('#quick_advance_view_li_list').toggle();
//        $(this).find('.glyphicon').toggleClass('glyphicon-menu-right glyphicon-menu-down');
//    });

});

/**
 * This function will save smart and view in database
 */
function saveSmartView(college_id,module_name){
    let save_type = 'smart_view';
    let form_tag_id_name = 'FilterApplicationForms';
    let ul_li = 'smart_view_li_list';
    let mark_as_by_default = 0;
    if(module_name === 'advanceLM'){
        form_tag_id_name = 'FilterLeadForm';
    }
    if(('#'+form_tag_id_name).length===0){alert('Form Id does not exist!');}
    if($.trim($('#smart_view_name').val())===''){
        $('#smartViewModal #filterColumnDiv').html('Please enter Smart View name.').addClass('error');
        return false;
    }

    let filter_name = $.trim($('#smart_view_name').val());
    mark_as_by_default = $('#smartViewModal #mark_as_by_default:checked').val();
    $('#filterColumnDiv').html('');
    const data = $('#'+form_tag_id_name).serializeArray();
    if($('ul#column_li_list .column_create_keys').length>0){
        $('ul#column_li_list .column_create_keys').each(function(){
            if($(this).is(':checked')){
                data.push({name: "column_create_keys[]", value: $(this).val()});
            }
        });
    }
    data.push({name: "module_name", value: module_name});
    data.push({name: "save_type", value: save_type});
    data.push({name: "filter_name", value: filter_name});
    data.push({name: "mark_as_by_default", value: mark_as_by_default});

    var college_id =$('#s_college_id').val();
    var shareViewsEnable =$('#shareViewsEnable').val();
    if(shareViewsEnable == 'true' || shareViewsEnable ==true){
      var all_user_list1 =$.trim($('.all_user_list1').val());
      data.push({name: "selected_user", value: all_user_list1});
      $("input:checkbox[name=save_as_default]:checked").each(function () {
          data.push({name: "save_as_default[]", value: $(this).val()});
        });
    }
    $.ajax({
        url: '/common/save-column-filter-list',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            hideLoader();
        },
        success: function (json) {
            hideLoader();
            if (typeof json['redirect'] !== 'undefined' && json['redirect'] !== "") {
                window.location.href = json['redirect'];
            }else if (typeof json['error'] !== 'undefined' && json['error'] !== "") {
                $('#smartViewModal #filterColumnDiv').html(json['error']).addClass('error margin-bottom-8');
            } else if (typeof json['status'] !== 'undefined' && json['status'] === 200) {
                $('#filterViewModal').modal('hide');
                $('#smartViewModal').modal('hide');
                alertPopup(json['message'], 'success');
                getSavedFilterList(college_id,module_name,save_type,ul_li);
                $('#'+ul_li+" > li a.columnList").removeClass('makeActive');
                $('#'+ul_li+" > li a.columnList").each(function(){
                    if(filter_name == $.trim($(this).text())){
                        $(this).addClass('makeActive');
                        $('#savedFilterList .default-txt-view').text(filter_name);
                    }
                });
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
             hideLoader();
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}

function createFieldsOrder(){
    var column_sorting_order = [];
    $('input[name="column_sorting_order[]"]').each(function () {
        column_sorting_order.push($(this).val());
    });
    if (column_sorting_order.length > 0) {
        $('#realignment_order').val(column_sorting_order.join(","));
    }
}

$(document).on("click", "#column_li_list .column_create_keys", function () {
    let ctype = $('#ctype').val(); //applications or userleads
    let field_value = $(this).val();
    const fieldNameArr = field_value.split("||");
    if ($(this).is(':checked')) {
        var field_li = '';
        field_li += '<li class="draggable_column_item" data-field-value="' + field_value + '">';
        field_li += '<input type="hidden" name="column_sorting_order[]" value="' + field_value + '">';
        field_li += fieldNameArr[1];
        field_li += '<button type="button" data-clickable="true" data-toggle="tooltip" data-placement="left" title="Click here to remove"  class="remove_draggable" aria-label="remove_draggable" data-field_value="' + field_value + '" >×</button></li>';
        if (ctype == 'userleads') {
            if (fieldNameArr[0] === 'ud|name') {
                $('#non_dragable').append(field_li);
            } else {
                $('#dragItemBox').append(field_li);
            }
        } else if (ctype == 'applications') {
            if (fieldNameArr[0] === 'ud_name') {
                if ($('#non_dragable li').length > 0) {
                    $('#non_dragable').prepend(field_li);
                } else if ($('#non_dragable li').length == 0) {
                    $('#non_dragable').append(field_li);
                }
            } else if (fieldNameArr[0] === 'fd_application_no') {
                $('#non_dragable').append(field_li);
            } else {
                $('#dragItemBox').append(field_li);
            }
        }
        $(".columns_dragble").scrollTop( $('body').height());
    } else {
        $('li.draggable_column_item[data-field-value="' + field_value + '"]').remove();
        $('#sort_options').val('');
    }
    createFieldsOrder();
});

$(document).on("click", ".remove_draggable", function () {
    $(this).parent().remove();
    $('#sort_options').val('');
    let filter_value = $(this).prev().val().trim();
    let $selectedColumn = $("#column_li_list input.column_create_keys[value='" + filter_value + "']");
    $selectedColumn.trigger('click');
    createFieldsOrder();
});

function shareWithUser(id,college_id,module_name,filter_type,ul_id,thisObj) {
    $('#shareViewModal').modal('show');
    $('.all_user_list_shared').SumoSelect({selectAll: true, search:true });
    $.ajax({
        url: jsVars.FULL_URL+'/common/getSharedUserList',
        type: 'post',
        data:{'parent_id':id, 'college_id':college_id, 'module_name':module_name, 'filter_type':filter_type},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {

        },
        complete: function () {
        },
        success: function (response) {
            if(response['status'] ===0 && response['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (response.status === 1){
                $('.all_user_list_shared').html('');
                var option = '';
                var userList =response.data.userList;
                var sharedUserList =response.data.sharedUserId;
                $.each(userList,function(i,userDta){
                    if($.inArray(parseInt(userDta['userId']), sharedUserList) !== -1) {
                        option += "<option value='" + userDta['userId'] + "' selected>" + userDta['name'] + "</option>";
                    } else {
                        option += "<option value='" + userDta['userId'] + "'>" + userDta['name'] + "</option>";
                    }
                });
                $('#viewId').val(id);
                $('#college_id').val(college_id);
                $('#module_name').val(module_name);
                $('#filter_type').val(filter_type);
                $('.all_user_list_shared').html(option);
                $('.all_user_list_shared').SumoSelect().sumo.reload();
                $('input[name="share_as_default"]').prop('checked', false);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
  }
$('#saveSmartViewBtn').on("click", function() {
  var shareViewsEnable =$('#shareViewsEnable').val();
  var collegeId =$('#s_college_id').val();
  if(shareViewsEnable == 'true'|| shareViewsEnable ==true){
     getUsersForShare(collegeId)
  }
});
function getUsersForShare(collegeId) {
  $('.all_user_list1').SumoSelect({selectAll: true, search:true});
  $.ajax({
      url: jsVars.FULL_URL+'/Users/ajax-active-user-lists/'+collegeId,
      type: 'get',
      dataType: 'json',
      headers: {
          "X-CSRF-Token": jsVars._csrfToken
      },
      beforeSend: function () {

      },
      complete: function () {
      },
      success: function (response) {
        if(response['status'] ===0 && response['message'] === 'session'){
          location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
        } else if (response.status == 1){
          $('.all_user_list1').html('');
          var option = '';
          var userList =response.data.userList;
          $.each(userList,function(i,userDta){
            option += "<option value='" + userDta['userId'] + "'>" + userDta['name'] + "</option>";
          });
          $('.all_user_list1').html(option);
          $('.all_user_list1').SumoSelect().sumo.reload();
          $('input[name="save_as_default"]').prop('checked', false);
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {
          alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
      }
  });
}

$('#userShareBtn').on("click", function() {
  var viewId = $('#viewId').val();
  var college_id = $('#college_id').val();
  var module_name = $('#module_name').val();
  var filter_type = $('#filter_type').val();
  let form_tag_id_name = 'FilterApplicationForms'
  const data = $('#'+form_tag_id_name).serializeArray();
  var all_user_list_shared =$.trim($('.all_user_list_shared').val());
  data.push({name: "selected_user", value: all_user_list_shared});
  var selectedVal = "";
  var share_as_default = $("input[type='radio'][name='share_as_default']:checked");
  if (share_as_default.length > 0) {
      selectedVal = share_as_default.val();
  }
  data.push({name: "share_as_default", value: selectedVal});
  data.push({name: "viewId", value: viewId});
  data.push({name: "college_id", value: college_id});
  data.push({name: "module_name", value: module_name});
  data.push({name: "filter_type", value: filter_type});
  $.ajax({
      url: '/common/share-view-to-user',
      type: 'post',
      dataType: 'json',
      data: data,
      headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
      beforeSend: function () {
          showLoader();
      },
      complete: function () {
          hideLoader();
      },
      success: function (response) {
        hideLoader();
        if(response['status'] ===0 && response['message'] === 'session'){
            location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
        } else if (response.status === 1){
            $('#filterViewModal').modal('hide');
            $('#shareViewModal').modal('hide');
            alertPopup(response['message'], 'success');
        } else {
            $('#shareViewModal').modal('hide');
            alertPopup(response['message'], 'error');
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {
           hideLoader();
          console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
      }
  });

  return false;
});

