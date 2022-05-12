/* 
 * Zone Configuration javascript function .
 */

//default
var zoneFieldStart      = '<select name="zone_id" id="zoneId" data-placeholder="Select Zone" class="chosen-select"><option value="" selected="selected">Select Zone</option>';
var zoneStateDivStart   = '<select name="state_id[]" id="zoneStateId" multiple="multiple" data-placeholder="Select State" class="chosen-select">';
var zoneCityDivStart    = '<select name="city_id[]" id="zoneCityId" multiple="multiple" data-placeholder="Select City" class="chosen-select">';
var zoneListingPage     = 1; 
if ($('form#filterZoneSearchForm').length > 0) {
    zoneStateDivStart   = '<select name="state_id" id="zoneStateId" data-placeholder="Select State" class="chosen-select"><option value="" selected="selected">Select State</option>';
    zoneCityDivStart    = '<select name="city_id" id="zoneCityId" data-placeholder="Select City" class="chosen-select"><option value="" selected="selected">Select City</option>';
}
$(document).ready(function () {
    $("#zoneConfigurationSection .chosen-select").chosen();
    $('#manageFieldsLoader').hide();
});

//college on change
$(document).on('change', '#zoneCollegeId', changeCollege);
function changeCollege() {
    //reset zone taxonomy field
    var zoneField    = zoneFieldStart + '</select>';
    var zoneStateDiv = zoneStateDivStart + '</select>';
    var zoneCityDiv  = zoneCityDivStart + '</select>';
    var fetch        = 'reg_taxonomy';
    var selected     = 'all';
    //reset zone field
    if ($('#zoneId').length > 0) {
        zoneField += '<span class="requiredError zone_id"></span>';
        fetch = 'zone_n_taxonomy';
        $('#zoneFieldDiv').html(zoneField);
        $('#zoneConfigurationSection #zoneId.chosen-select').chosen();
    }
    //reset zone state field
    if ($('#zoneStateId').length > 0) {
        zoneStateDiv += '<span class="requiredError state_id"></span>';
        $('#zoneStateDiv').html(zoneStateDiv);
        $('#zoneConfigurationSection #zoneStateId.chosen-select').chosen();
    }
   //reset zone city field
    if ($('#zoneCityId').length > 0) {
        zoneCityDiv += '<span class="requiredError city_id"></span>';
        $('#zoneCityDiv').html(zoneCityDiv);
        $('#zoneConfigurationSection #zoneCityId.chosen-select').chosen();
    }
    
    if (($("#zoneCollegeId").val() === '') || ($("#zoneCollegeId").val() === null)) {
        return;
    }   
    //list only saved in db
    if ($('form#filterZoneSearchForm').length > 0) {
        selected = 'filter';
    }
    getZoneRelatedDependents('zoneCollegeId', fetch, selected);
}

//on change state
$(document).on('change', '#zoneStateId', changeState);
function changeState() {
    var zoneCityDiv  = zoneCityDivStart + '</select>';
    var fetch        = 'city';
    var selected     = 'all';
    //reset zone city field
    if ($('#zoneCityId').length > 0) {
        zoneCityDiv += '<span class="requiredError city_id"></span>';
        $('#zoneCityDiv').html(zoneCityDiv);
        $('#zoneConfigurationSection #zoneCityId.chosen-select').chosen();
    }
    
    if (($("#zoneStateId").val() === '') || ($("#zoneStateId").val() === null)) {
        return;
    }   
    //stop to load city value for multiple states
    if ($('form#zoneMappingForm').length > 0) {
        var States = $("#zoneStateId").val();
        var StateArray = States.toString().split(',');
        if (StateArray.length > 1) {
            $('div.city_id').hide();
            return;
        }
        $('div.city_id').show();
    }
    //list only saved in db
    if ($('form#filterZoneSearchForm').length > 0) {
        selected = 'filter';
    }
    getZoneRelatedDependents('zoneStateId', fetch, selected);
}

function getZoneRelatedDependents(parentId, fetch, selected)
{
    var data = $('#' + parentId).serializeArray();
    data.push({name: "fetch", value: fetch});
    data.push({name: "selected", value: selected});
    //add college id
    if ((parentId != 'zoneCollegeId') && (selected == 'filter')) {
        var collegeFieldName = $('#zoneCollegeId').attr('name');
        var collegeFieldValue = $('#zoneCollegeId').val();
        data.push({name: collegeFieldName, value: collegeFieldValue});
    }
    $.ajax({
        url: jsVars.getRegistrationFieldTaxonomyLink,
        type: 'post',
        data: data,
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
                location = json['redirect'];
            } else if (json['error']) {
                alertPopup(json['error'], 'error');
            } else if (json['status'] == 200) {
                
                if (typeof json[fetch] !== 'undefined') {
                    var dataList = json[fetch];
                    //get taxonomy and zone dependents
                    if ((fetch === 'reg_taxonomy') || (fetch === 'zone_n_taxonomy')) {
                        var zoneStateDiv = zoneStateDivStart;
                        for (var key in dataList['state']) {
                            zoneStateDiv += '<option value="' + key + '">' + dataList['state'][key] + '</option>';
                        }
                        zoneStateDiv += '</select>';
                        zoneStateDiv += '<span class="requiredError state_id"></span>';
                        $('#zoneStateDiv').html(zoneStateDiv);
                        $('#zoneConfigurationSection #zoneStateId.chosen-select').chosen();
                        if (fetch === 'zone_n_taxonomy') {
                            var zoneField = zoneFieldStart;
                            for (var key in dataList['zone']) {
                                zoneField += '<option value="' + key + '">' + dataList['zone'][key] + '</option>';
                            }
                            zoneField += '</select>';
                            zoneField += '<span class="requiredError zone_id"></span>';
                            $('#zoneFieldDiv').html(zoneField);
                            $('#zoneConfigurationSection #zoneId.chosen-select').chosen();
                        }
                    } else if (fetch === 'city') {
                        var zoneCityDiv = zoneCityDivStart;
                        for (var key in dataList['city']) {
                            zoneCityDiv += '<option value="' + key + '">' + dataList['city'][key] + '</option>';
                        }
                        zoneCityDiv += '</select>';
                        zoneCityDiv += '<span class="requiredError city_id"></span>';
                        $('#zoneCityDiv').html(zoneCityDiv);
                        $('#zoneConfigurationSection #zoneCityId.chosen-select').chosen();
                    }
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getZoneListing(action) {
    if ($('#zoneCollegeId').val() === '') {
        var emptyHtml = '<tr class="listDataRow">';
        emptyHtml +=    '   <td colspan="5">';
        emptyHtml +=    '        <div class="col-lg-12">';
        emptyHtml +=    '            <div class="row">';
        emptyHtml +=    '                <div class="col-md-12">';
        emptyHtml +=    '                    <h4 class="text-center text-danger"> Please select institute to view zone\'s mapping.</h4>';
        emptyHtml +=    '                </div>';
        emptyHtml +=    '            </div>';
        emptyHtml +=    '        </div>';
        emptyHtml +=    '    </td>';
        emptyHtml +=    '</tr>';
        $('#zoneConfigurationSection #load_more_results').html(emptyHtml);
        $("#zoneConfigurationSection #LoadMoreArea").hide();
        return;
    }
    if (action == 'reset') {
        zoneListingPage = 1;
        $('#zoneConfigurationSection #load_more_results').html('');
    }
    $('#zoneConfigurationSection #search_btn').attr("disabled", "disabled");
    $("#zoneConfigurationSection #LoadMoreArea").show();
    var formData = $('form#filterZoneSearchForm').serializeArray();
    formData.push({name: "page", value: zoneListingPage});
    $.ajax({
        url: jsVars.getZoneConfigurationLink,
        type: 'post',
        data: formData,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () {
            $('#manageFieldsLoader.loader-block').show();
        },
        complete: function () {
            $('#manageFieldsLoader.loader-block').hide();
        },
        success: function (html) {
            $('#zoneConfigurationSection #search_btn').removeAttr("disabled");
            zoneListingPage = zoneListingPage + 1;
            html = html.replace("<head/>", '');
            if (action == 'reset') {
                $('#zoneConfigurationSection div.items-count').show();
                $('#zoneConfigurationSection #load_more_results').html(html);
            } else {
                $('#zoneConfigurationSection div.items-count').show();
                $('#zoneConfigurationSection #load_more_results').append(html);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function submitZoneForm() {
    $('div.has-error').removeClass('has-error');
    $('span.requiredError').text('');
    $.ajax({
        url: jsVars.saveZoneMappingLink,
        type: 'post',
        data: $('form#zoneMappingForm input, form#zoneMappingForm select').serializeArray(),
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
                location = json['redirect'];
            } else if (json['error']) {
                for (var key in json['error']) {
                    $('div.' + key).addClass('has-error');
                    $('span.' + key).text(json['error'][key]);
                }
            } else if (json['alert']) {
                alertPopup(json['alert'], 'error');
            }
            else if (json['success'] == 200) {
                location = json['location'];
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function removeZoneMapping(editHash) {
    $('#ConfirmMsgBody').html('Are you sure you want to remove zone mapping? Please note Zone Mapping once removed will update all related data into system.');
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmYes', function (e) {
        e.preventDefault();
        $('#ConfirmPopupArea').modal('hide');
            $.ajax({
                url: jsVars.removeZoneMappingLink,
                type: 'post',
                data: {editHash:editHash, action:'remove'},
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
                        location = json['redirect'];
                    } else if (json['error']) {
                        alertPopup(json['error'], 'error');
                    }
                    else if (json['success'] == 200){
                        var successMsg = 'Zone Mapping removed successfully.';
                        if (typeof json['msg'] !== 'undefined') {
                            successMsg = json['msg'];
                        }
                        alertPopup(successMsg, 'success');
                        getZoneListing('reset');
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });            
    });
}

function alertPopup(msg, type, location) {
    var selector_parent = '#SuccessPopupArea';
    var selector_titleID = '#alertTitle';
    var selector_msg = '#MsgBody';
    var btn = '#OkBtn';
    var title_msg = 'Success';
    if (type === 'error') {
        selector_parent = '#ErrorPopupArea';
        selector_titleID = '#ErroralertTitle';
        selector_msg = '#ErrorMsgBody';
        btn = '#ErrorOkBtn';
        title_msg = 'Error';
    }

    $(selector_titleID).html(title_msg);
    $(selector_msg).html(msg);
    $('.oktick').hide();

    if (typeof location !== 'undefined') {
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