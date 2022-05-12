$(document).on("click", '#saveProductivityReportFilter', function () {
    var counsellorDropDown = $("#counsellorProductivityReport #counsellorFields");
    var columnFields = $("#counsellorProductivityReport #columnFields");
    var stagesCols = $("#counsellorProductivityReport #stagesCols");
    var dateRangeProductivity = $("#counsellorProductivityReport #date_range_productivity");

    if (counsellorDropDown.length) {
        var counsellorVal = counsellorDropDown.val();
    }
    if (columnFields.length) {
        var columnFieldsVal = columnFields.val();
    }
    if (stagesCols.length) {
        var stagesColsVal = stagesCols.val();
    }
    if (dateRangeProductivity.length) {
        var dateRangeProductivityVal = dateRangeProductivity.val();
    }

    if (counsellorVal == 0 && columnFieldsVal == '' && stagesCols == '' && dateRangeProductivityVal == '') {
        alertPopup("Please select filters.", 'error');
    }

    $('#filterViewModal').modal('show');

    //currentSelectedTab is a global variable and it's define in counsellors/dashboard.js file to identify current selected tab
    if ($currentSelectedTab == 'application') {
        $('#filterColumnSaveBtn').attr('onclick', 'javascript:saveFilterAndColumn($.trim($(\'#h_college_id\').val()),\'productivityReportAM\',\'filterColumn\',\'counsellorApplicationProductivityReport\',\'saved_filter_li_list\')');
    } else {
        $('#filterColumnSaveBtn').attr('onclick', 'javascript:saveFilterAndColumn($.trim($(\'#h_college_id\').val()),\'productivityReportLM\',\'filterColumn\',\'counsellorProductivityReport\',\'saved_filter_li_list\')');
    }


    $('#filter_name').val('');
});

/**
 * This function will save filter and view in database
 * @param {type} module_name
 * @param {type} save_type
 * @param {type} form_id
 * @return {undefined}
 */
function saveFilterAndColumn(college_id, module_name, save_type, form_tag_id_name, ul_id) {
    if (('#' + form_tag_id_name).length == 0) {
        alert('Form Id does not exist!');
    }
    if ($.trim($('#filter_name').val()) == '') {
        if (save_type == 'filter') {
            var txt_name = 'filter';
        } else {
            var txt_name = 'view';
        }
        $('#filterColumnDiv').html('Please enter ' + txt_name + ' name.').addClass('error');

        return false;
    }

    var filter_name = $.trim($('#filter_name').val());
    var mark_as_by_default = $('input[name="mark_as_by_default"]:checked').val();
    $('#filterColumnDiv').html('');
    var data = $('#' + form_tag_id_name).serializeArray();
    data.push({name: "s_college_id", value: college_id});
    data.push({name: "module_name", value: module_name});
    data.push({name: "save_type", value: save_type});
    data.push({name: "filter_name", value: filter_name});
    data.push({name: "ul_id", value: ul_id});
    data.push({name: "mark_as_by_default", value: mark_as_by_default});
    
    $.ajax({
        url: '/counsellors/save-column-filter-list',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
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
            } else if (typeof json['error'] != 'undefined' && json['error'] != "") {
                alertPopup(json['error'], "error");
            } else if (typeof json['status'] != 'undefined' && json['status'] == 1) {
                $('#filterViewModal').modal('hide');
                alertPopup(json['message'], 'success');
                if( module_name == "productivityReportLM") {
                    loadProductivityReport('filter', json['data']['lastInsertID']);
                } else if(module_name == "productivityReportAM") {
                    loadApplicationProductivityReport('filter', json['data']['lastInsertID']);
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
                    if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                        window.location.href = json['redirect'];
                    }else if (typeof json['error'] != 'undefined' && json['error'] != "") {
                        $('#ConfirmPopupArea').modal('hide');
                        alertPopup(json['error'], 'success');
                    } else if (typeof json['status'] !== 'undefined' && json['status']===200) {
                        //filterDefault();
                        $('#ConfirmPopupArea').modal('hide');
                        alertPopup(json['message'], 'success');
                        var columnList = $.trim($($this).parent('li').children('a.columnList').text());
                        var savedFilterList = $.trim($('#savedFilterList .default-txt-view').text());
                        //Remove Parent Li
                        if(filter_type == 'filterColumn'){
                            if($($this).parent().parent().find('li').length == 1){
                                $($this).parent().parent().siblings('h6').hide();
                            }
                        }
                        $($this).parent('li').remove();
                        if(filter_type == 'filter' && columnList == savedFilterList){
                            $('#saved_filter_default_li_list a.default-filterlist').trigger('click');
                        }
                        if(module_name === 'productivityReportLM') { 
                            loadProductivityReport('filter', 'default');
                        }

                        if(module_name === 'productivityReportAM') { 
                            loadApplicationProductivityReport('filter', 'default');
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

function markAsByDefault(id,college_id,module_name,filter_type,$this){
    
    if($($this).children('span').hasClass('fa-star')){
        var mark_as_by_default = 'false';
    } else {
        var mark_as_by_default = 'true';
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
                if(module_name === 'productivityReportLM') { 
                    loadProductivityReport('filter', id);
                }

                if(module_name === 'productivityReportAM') { 
                    loadApplicationProductivityReport('filter', id);
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

function showFilterByID(id, $this, source) {
    if(source == 'LM') { 
        loadProductivityReport('filter', id);
    }
    
    if(source == 'AM') { 
        loadApplicationProductivityReport('filter', id);
    }
}

function filter(element, listid) {
    var value = $(element).val();
    value = value.toLowerCase();
    $("#" + listid + " li ul li").each(function () {
        if ($(this).text().toLowerCase().search(value) > -1) {
            $(this).show();
            $("ul#"+listid+"  li").addClass('active');
        } else {
            $(this).hide();
        }
    });
}