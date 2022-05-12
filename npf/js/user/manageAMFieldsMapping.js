$(document).ready(function () {
    $(".chosen-select").chosen();
    $('#manageFieldsLoader').hide();
    $("#collegeId").change(changeCollege);
    $('.select_field').on('click', function (e) {
        $('#select_all').attr('checked', false);
    });
    $('select#searchUserSelect').SumoSelect({placeholder: 'Search User', search: true, searchText: 'Search User', captionFormatAllSelected: "All User Selected.", triggerChangeCombined: true, selectAll: false});
});


function selectAll(elem) {
    if (elem.checked) {
        $('.select_field').not(".disable-check").each(function () {
            this.checked = true;
        });
    } else {
        $('.select_field').not(".disable-check").attr('checked', false);
    }
}


function changeCollege() {
    var searchUser = '';
    $('select#searchUserSelect').html(searchUser);
    $('select#searchUserSelect')[0].sumo.reload();

    if ($("#collegeId").val() == '') {
        return;
    }
    var roleDropdown = $("input[name='roleDropdown[]']").map(function () {
        return $(this).val();
    }).get();
    $.ajax({
        url: jsVars.getCollegeUserListLink,
        type: 'post',
        data: {collegeId: $("#collegeId").val(), roleDropdown: roleDropdown, assigned_child_users: $("#assignedChildUsers").val(), default_assigned_child_users: $("#defaultAssignedChildUsers").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#manageFieldsLoader.loader-block').show();
        },
        complete: function () {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('select#searchUserSelect')[0].sumo.reload();
            $('#manageFieldsLoader.loader-block').hide();
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data !== "") {
                    searchUser = '';
                    searchUser += responseObject.data;
                    $('select#searchUserSelect').html(searchUser);
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(responseObject.message, 'error');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

var pageAMFieldsListing = 1;
function submitAMFilterForm(type) {
    if ($("#collegeId").val() == "") {
        $('#listingContainerSection').html('<div class="aligner-middle"><div class="text-center text-info font16"><span class="lineicon-43 alignerIcon"></span><br><span id="load_msg">Please select institute to view fields mapping list.</span></div></div>');
        return;
    }
    if (type == 'reset') {
        pageAMFieldsListing = 1;
    }
    loadAMFieldsMappingList(type);
}

function loadAMFieldsMappingList(type)
{
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;&nbsp;Loading...');
    var data = $('#filterAMFieldsMappingForm').serializeArray();
    data.push({name: "page", value: pageAMFieldsListing});
    var perPageRecords = $('select#items-no-show').val();
    data.push({name: "per_page_records", value: perPageRecords});
    $.ajax({
        url: jsVars.loadAmfieldsMappingLink,
        type: 'post',
        dataType: 'html',
        data: data,
        async:false,
        beforeSend: function () {
            showLoader();
            $('#seacrhList').attr('disabled','true');
         },
        complete: function () { hideLoader(); $('body > .dm-new').remove();},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('button[name="search_btn"]').attr("disabled", false);
            $('.offCanvasModal').modal('hide');
            pageAMFieldsListing = pageAMFieldsListing + 1;
            $('#seacrhList').removeAttr('disabled');
            if (data == "session_logout") {
                window.location.reload(true);
            } else if (data == "error") {
                if (pageAMFieldsListing == 1) {
                    $("#tot_records").html("Total 0 Records");
                    error_html = "No Records found";
                    $('#load_more_results').html('<tbody><tr><td><div class="col-md-12"><h4 class="text-center text-danger">' + error_html + '</h4></div></td></tr><tr></tr></tbody>');
                } else {
                    $('#if_record_exists').show();
                    $('.table-responsive').addClass('newTableStyle');
                    $('#load_more_results').addClass('table-hover');
                    if (pageAMFieldsListing == 0) {
                        $("#tot_records").html("Total 0 Records");
                    }
                    error_html = "No More Record";
                    //$('#load_more_results tr:last').after('<tr><td colspan="' + $($('#load_more_results tr:last td')).length + '"><div class="col-md-12"><div class="alert alert-danger">' + error_html + '.</div></div></td></tr>');
                }
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Show More Leads');
                $('#load_more_button').hide();

            } else if (data == "select_college") {
                $('#load_more_results').html('<tbody><tr><td><div class="col-md-12"  style="background-color:#f8f8f8;"><h4 class="text-center">Please select an Institute Name and click Search to view AM Fields Mapping list.</h4></div></td></tr><tr></tr></tbody>');
                $('#load_more_button').hide();
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Show More Leads');
            } else {
                $('#if_record_exists').show();
                $('.table-responsive').addClass('newTableStyle');
                $('#load_more_results').addClass('table-hover');
                if (type == 'reset') {
                    $('#load_more_results').html("");
                }
                data = data.replace("<head/>", '');
                $('#load_more_results').append(data);
                var current_record = $("#current_record").val();//current_record_count
                if (current_record < 10) {
                    $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Show More Leads');
                    $('#load_more_button').hide();
                } else {
                    $('#load_more_button').removeAttr("disabled");
                    $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Show More Leads');
                    $('#load_more_button').show();
                }

                if(pageAMFieldsListing == 1 && $('#data-tab-container').length) {
                    makeScrollable();
                }
            }
            dropdownMenuPlacement();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function showAMFieldsSelect(htmlId) {
    if ($('div#' + htmlId + ' select').length > 0) {
        $('div#' + htmlId + ' select').show();
    }
}

//Add AM Field
function addAMFieldsMappingFieldsTo() {
    if ($(".moveableOne option:selected").length > 0) {

        //var selected_opt = jQuery('#oneselect').find(':selected');
        $(".moveableOne option:selected").map(function () {
            var already_insert = false;
            var value = jQuery(this).text();
            var key = jQuery(this).val();
            var form_name = $(this).parent('select').data('formname');

            $('#final_columns option').map(function () {
                if (this.value == key) {
                    var alrady_text = jQuery(this).text();
                    alertPopup("field '" + alrady_text + "' already inserted", 'error');
                    already_insert = true;
                }
            });
            if (already_insert == false) {
                if (key != '') {
                    $('#final_columns').append($("<option></option>").attr("value", key).text(value + ' (' + form_name + ')'));
                }
            }
//            $(this).remove();
            this.selected = false;

        });
    } else {
        alertPopup("Please select option", "error");
    }
}

function removeReportColumnFormFieldsTo() {

    if ($("#final_columns option:selected").length > 0) {
        //var selected_opt = jQuery('#oneselect').find(':selected');
        $("#final_columns option:selected").map(function () {
            $(this).remove();
        });
    } else {
        alertPopup("Please select option", "error");
    }
}

function LoadFormAMFieldsFilters(collegeId, formId, parentContainer, formTitle) {

    $('#'+ parentContainer).find('select').attr({'class': 'animated fadeOutUp'});
    $('#' + parentContainer).html("<div class='select_loading loadingspinner'><i class='fa fa-spinner'></i></div>");

    $.ajax({
        url: jsVars.listFormAMFieldsByFormIdForMappingLink,
        type: 'post',
        dataType: 'json',
        data: {
            "collegeId": collegeId,
            "formId": formId,
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
            if (json['redirect']) {
                location = json['redirect'];
            } else if (json['error']) {
                alertPopup(json['error'], 'error');
            } else if (json['status'] == 200) {
                if (json['filterArray']) {
                    var formAMFieldSelect = $('<select />').attr({
                        'multiple': 'multiple',
                        'name':'field_list[]',
                        'size': 7,
                        'class': 'animated fadeInUp moveableOne',
                        'data-formname': formTitle
                    });
                    var applicationDetailsSelectOptions = [];
                    $('select#applicationDetailsSelect option').each(function () {
                        var apOptionArray = this.value.split('$$$');
//                        if ((typeof apOptionArray[0] != 'undefined') && (apOptionArray[0] != '')) {
//                            applicationDetailsSelectOptions.push(apOptionArray[0]);
//                        }
                    });

                    for (var index in json['filterArray']) {
                        var fieldKey = json['filterArray'][index]['value'];
                        var labelName = json['filterArray'][index]['text'];
                        var fieldsArray = fieldKey.split('||');
                        var fieldId = fieldsArray[0];

                        var option = fieldId + '$$$' + labelName + '$$$' + formId;
                        if (applicationDetailsSelectOptions.indexOf(fieldId) < 0) {
                            formAMFieldSelect.append($("<option>").attr({'value': option}).text(labelName));
                        }
                    }
                    $('#' + parentContainer).html('');
                    $('#' + parentContainer).html(formAMFieldSelect);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function finalAMFieldColumnsSubmit() {

    $('form#createAMFieldsMappingForm select#final_columns option').map(function () {
        this.selected = true;
    });
    return true;
    $('form#createAMFieldsMappingForm button[type="submit"]').click( function(){
        $(this).addClass('pointer-none');
    });
}

function deleteAmfieldsMapping(encodedString) {
    if (($("#collegeId").val() == '') || (encodedString == '')) {
        return;
    }

    $.ajax({
        url: jsVars.deleteAmfieldsMappingLink + '/' + encodedString,
        type: 'post',
        data: {collegeId: $("#collegeId").val()},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#manageFieldsLoader.loader-block').show();
        },
        complete: function () {
            $('#manageFieldsLoader.loader-block').hide();
        },
        success: function (json) {
            if (json['redirect']) {
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            } else if (json['error']) {
                alertPopup(json['error'], 'error');
            } else if (json['code'] == 200) {
                alertPopup(json['msg'], 'success');
                submitAMFilterForm('reset');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}