function createFilter() {
    $('#filter_elements_html').html('');
    var col_class = 3;
    var total_filter = $('input[name="filter_create_keys[]"]:checked').length;
    if(total_filter<4){
        col_class = parseInt(12/total_filter);
    }
    var i=0;
    $('input[name="filter_create_keys[]"]:checked').each(function () {
        createInput(this,col_class,++i);
    });

    return false;
}

    function createInput(currentObj,col_class,ii){


        var labelname   = $(currentObj).data('label_name');
        var InputId     = $(currentObj).attr('id');
        var key_source  = $(currentObj).data('key_source');
        var value_field = $(currentObj).val();
        var arr         = value_field.split("||");
        var html        = '';
        var type        = "";

        var class_date = '';
        if (arr.length > 2) {
            var type = arr[1];
            var val_json = arr[2];
            var html_field_id = '';
            //console.log(arr);
            // for not break ajax on created by, ID CreatedBySelect
            if(arr[0].match(/created_by/i)){
                html_field_id = 'CreatedBySelect';
            }else if(arr[0].match(/UD\|city_id/i)){
                html_field_id = 'registerCityID';
            }else{
                html_field_id = arr[0];
            }
            var sls = false;

            if (type == "dropdown") {
                if('UD|state_id' == html_field_id ){
                html = "<select data-key_source="+InputId+" onchange = 'return GetChildByMachineKey(this.value,\"registerCityID\",\"City\");' class='chosen-select' name='filter[" + arr[0] + "]' id='"+html_field_id+"'>";
                }
                else if('s_lead_status' == html_field_id){

                    html = "<select data-key_source="+InputId+" multiple='multiple' class='form-control' name='filter[" + arr[0] + "][]' id='"+html_field_id+"' data-placeholder='Select lead status' placeholder='Select lead status'>";
                   sls = true;
                }
                else{
                    html = "<select data-key_source="+InputId+" class='chosen-select' name='filter[" + arr[0] + "]' id='"+html_field_id+"'>";
                }


                if('s_lead_status' != html_field_id && 'show_campaigns_in' != html_field_id){
                    html += '<option value="">' + labelname + '</option>';
                }

                obj_json = JSON.parse(val_json);
                for (var key in obj_json) {
                    html += "<option value=\"" + key + "\">" + obj_json[key] + "</option>";
                }
                html += "</select>";
            } else if (type == "date") {

                var operator_sel=$(currentObj).val();
                if(operator_sel.indexOf('ap|payment_end_date') !== -1 ||
                        operator_sel.indexOf('created||date') ||
                        operator_sel.indexOf('updated||date') ||
                        operator_sel.indexOf('U|created||')


                        ){
                    if(ii%4==1 || ii%4==2){
                        // change class for every 1 or 2 position in a row
                        class_date = "daterangepicker_report_right";
                    }else{
                        class_date = "daterangepicker_report";
                    }
                }else{
                    class_date = "datepicker_report";
                }

                html = "<input type='text' data-key_source="+InputId+"  class='form-control " + class_date + "' name='filter[" + arr[0] + "]' value='' placeholder='" + labelname + "' id='"+html_field_id+"'>";

            }else {
                html = "<input type='text' data-key_source="+InputId+"  class='form-control' name='filter[" + arr[0] + "]' value='' placeholder='" + labelname + "' id='"+html_field_id+"'>";
            }
        } else {
            html = "<input type='text' data-key_source="+InputId+" class='form-control' name='filter[" + arr[0] + "]' value='' placeholder='" + labelname + "'>";
        }
    var multi_class = '';
    if(sls){
        multi_class = 'multiSelectBox';
    }
    // finally show the field in DOM
    html = '<div class="form-group formAreaCols '+multi_class+'">' + html + '</div>';

    var finalhtml = $('<div class="col-md-'+col_class+' div_'+key_source+'"></div>').wrapInner(html);

    $('#filter_elements_html').append(finalhtml);

    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});

    if (html_field_id == 'CreatedBySelect'){
        if($('#FilterLeadForm select#college_id').val().length){
            if (typeof CollegeWiseCreaterList != "undefined" && $('#FilterLeadForm select#college_id').val() in CollegeWiseCreaterList['CollegeWise'])
            {
                UpdateCreatedBySelect(CollegeWiseCreaterList['CollegeWise'][$('#FilterLeadForm select#college_id').val()], postedCreatedBy);
            }
        }
    }

    if (type == "date") {
        LoadReportDatepicker();
        LoadReportDateRangepicker();
    }
    if(sls){
        $('#s_lead_status').multiselect({
            numberDisplayed: 2
        });
    }
}

$(document).on('change','#FilterLeadForm select#form_id', function (){
    $('.div_form').remove();
    LoadFormFieldsLMS(this);
    if($('#college_id').length>0 && $('#college_id').val()>0){
        if(this.value==0 || this.value==''){
            // remove college filter
           $('.custom_li_filter_college').remove();
        }
        filterColumnOptionsCollege($('#college_id').val(),this.value);
    }

    //Dynamically add Stage name li column if form is selected from the dropdown
    var total_li=$("#column_li_list li").length;
    if(total_li>0 && parseInt($('#form_id').val())!='') {
        var getLiValue=$("#column_li_list li > label").find('input[data-label_name="Stage Name"]');
        if(getLiValue.val()!='undefined') {
            getLiValue.closest('li').remove();
        }
        $("#column_li_list li:last-child").after('<li><label for="column_create_keys_'+total_li+'"><input id="column_create_keys_'+total_li+'" name="column_create_keys[]" value="fd|stage_name||Stage Name" data-label_name="Stage Name" class="column_create_keys" type="checkbox">Stage Name</label></li>');
    }

    // Remove Paymeny Method if already there
    //
    var getLiValue=$("#filter_li_list li > label").find('input[data-label_name="Payment Method"]');

    if(getLiValue.length>0) {
        getLiValue.parents('li').remove();
    }
    // show view_by
    //var chk_college_id = $('#FilterLeadForm select#college_id').val();
    //if(chk_college_id!='' && typeof chk_college_id !== 'undefined' && this.value!=''){
        $('#view_by_select').show();
        $('#view_by').val('');
        $('#load_slider_data').html("");
//        console.log($('#form_id').val());
        if(parseInt($('#form_id').val())>0)$('#single_lead_add').fadeIn();
        else $('#single_lead_add').hide();

    //}
});

$(document).on('change','#FilterLeadForm select#college_id', function (){
    $('.div_form').remove();
    $('.custom_li_filter').remove();
    $('.custom_li_filter_college').remove();
    $('.div_college').remove();

    // show view by
    $('#view_by_select').show();
    $('#view_by').val('');
    $('#single_lead_add').hide();
});

function LoadFormFieldsLMS(elem) {
        var form_id=elem.value;
        $('.custom_li_filter').remove();
        $.ajax({
//            url: '/reports/getFormFieldsByFormIdForReports',
            url: '/form/get-form-fields-formid',
            type: 'post',
            dataType: 'html',
            //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
            data: {
                "form_id": form_id,
                "type": "include_key_value"
            },
            async:false,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                var ii = $("#filter_li_list li").length;
                ii++;
                var html = '';
                var cols_html = '';

                var res_data=JSON.parse(data);
                if(res_data.length > 0){

                    for(i=0;i<res_data.length;i++){
                        ii++
                        var curr_data=res_data[i];
                        if(curr_data!=""){
                            var f_arr=curr_data.split("$$$");
                            var key_val = '';
                            var chk_filter_var = '';
                            var f_arr_part = f_arr[0].split('||');

                            if(typeof f_arr_part[0] !='undefined' && f_arr_part[0]!=''){
                                chk_filter_var = f_arr_part[0];
                                key_val = f_arr_part[0]+'||'+f_arr[1];
                            }
                            else {
                                chk_filter_var = f_arr[0];
                                key_val = f_arr[0]+'||'+f_arr[1];
                            }

                            /* check condition for duplicate field if machine key already in column then not print */
                            /* Release 9.0/692 */
                            if((typeof jsVars.js_search_filter !='undefined' && jsVars.js_search_filter.length>0 && jsVars.js_search_filter.indexOf(chk_filter_var)<0) || (typeof jsVars.js_search_filter == 'undefined')){
                               html+='<li class="custom_li_filter"><label for="filter_create_keys_'+ii+'"><input id="filter_create_keys_'+ii+'" type="checkbox" class="filter_create_keys" name="filter_create_keys[]" value=\''+f_arr[0]+'\' data-label_name="'+f_arr[1]+'" data-key_source="form"> '+f_arr[1]+' </label></li>';
                           }

                               /* check condition for duplicate field if machine key already in column then not print */
                               /* Release 9.0/692 */
                               if((typeof jsVars.js_columns_filter !='undefined' && jsVars.js_columns_filter.length>0 && jsVars.js_columns_filter.indexOf(key_val)<0) || (typeof jsVars.js_columns_filter == 'undefined')){
                               cols_html+='<li class="custom_li_filter"><label for="column_create_keys_'+ii+'"><input id="column_create_keys_'+ii+'" type="checkbox" class="column_create_keys" name="column_create_keys[]" value=\''+key_val+'\' data-label_name="'+f_arr[1]+'" data-key_source="form"> '+f_arr[1]+' </label></li>';
                           }

                        }
                    }
                }

                $("#filter_li_list").append(html);
                $("#column_li_list").append(cols_html);




//                $('.chosen-select').chosen();
//                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            //console.log(html);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

jQuery(function(){
    $('.filter_collapse').dropdown('toggle');
});

function filter(element,listid) {

    var value = $(element).val();
    value = value.toLowerCase();

    $("#"+listid+" > li").each(function() {
        if ($(this).text().toLowerCase().search(value) > -1) {
//            $(this).text(src_str);
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });
}


function loadSliderData(count_field) {

        if($('#view_by').val()=="") return false;

         var arr = count_field.split("|");

        var data = $('#FilterLeadForm').serializeArray();
        data.push({name: "field_count_column", value: arr[0]});
        data.push({name: "field_count_label", value: arr[1]});
        $.ajax({
            url: '/leads/load-slider-data',
            type: 'post',
            dataType: 'html',
            //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
            data: data,
            beforeSend: function (xhr) {
                $('#listloader').show();
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
              //console.log(data);
              //return false;
                if (data == "error") {
                    //$('#load_slider_data').html("<div class='alert alert-danger'>No Records</div>");
                }else if (data == "select_college") {
                    $('#load_slider_data').html("<div class='alert alert-danger'>Please select college to view their leads.</div>");
                }else {
                    $('#load_slider_data').html(data);
//                    $.material.init();
                    LoadOwl();
                }
                //console.log(data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            },
            complete: function (jqXHR, textStatus) {
                $('#listloader').hide();

            }
        });
    }

function SetHiddenAdvdata(adv_column, adv_value){
     $('#adv_column').val(adv_column);
     $('#adv_value').val(adv_value);
     //$('#if_record_exists').fadeIn();
     LoadMoreLeadsNew('adv_filter');
}


function LoadMoreLeadsNew(type) {
        $('#push_application').hide();
        if (type == 'reset') {
            Page = 0;
            $('#load_more_results').html("");
            $('#load_more_results_msg').html("");
            $('#load_more_results_msg').show("");
            $('#load_more_button').show();
            $('#adv_column').val("");
            $('#adv_value').val("");
            $('#load_slider_data').html("");
            $('#load_more_button').html("Loading...");
            $('#view_by').val('');
            $('button[name="search_btn"]').attr('disabled','disabled');
            // if offline and payment pending is selected then show pushApplication button

            if(parseInt($('#form_id').val())>0 && $('[name="filter[ap|payment_method]"]').val()=='offline' && $('[name="filter[status]"]').val()=='4'){
                $('#push_application').show();
            }

            //$('.chosen-select').chosen();
            //$('.chosen-select-deselect').chosen({allow_single_deselect: true});
        }
        else if (type == 'adv_filter') {
            Page = 0;
            $('#load_more_results').html("");
            $('#load_more_results_msg').html("");
            $('#load_more_results_msg').show("");
            $('#load_more_button').show();
            $('#load_more_button').html("Loading...");
        }

        //Below line of code will check if page no is 0 and form id and standard list both are selected then display error message
        if(Page==0) {
            if($('#standard_list_id').length == 1 && $('#div_load_forms #form_id').val() > 0) {
                $('#load_more_results_msg').append("<div class='alert alert-danger'>Please select either Form Name or Standard List.</div>");
                $('#load_more_button, #single_lead_add').hide();
                $('button[name="search_btn"]').removeAttr('disabled');
                return false;
            }
        }

        $('#export').remove();

        //show/hide upload single lead btn
        if($('#CreateLeadStartBtn').length > 0)
        {
            $('#CreateLeadStartBtn').hide();
            if(($('#college_id').val() > 0) && ($('#form_id').val() > 0))
            {
                $('#CreateLeadStartBtn').show();
            }
        }

        var data = $('#FilterLeadForm').serializeArray();
        data.push({name: "page", value: Page});
        $('#load_more_button').attr("disabled", "disabled");
        $('#load_more_button').html("Loading...");
        $.ajax({
            url: '/leads/ajax-lists',
            type: 'post',
            dataType: 'html',
            //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
            data: data,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                $('button[name="search_btn"]').removeAttr('disabled');
                Page = Page + 1;
                if (data == "session_logout") {
                    window.location.reload(true);
                }
                else if (data == "error") {
                    if(Page==1)error_html="No Records found";
                    else error_html="No More Record";
                    $('#load_more_results_msg').append("<div class='alert alert-danger'>"+error_html+"</div>");
                    $('#load_more_button').html("Load More Leads");
                    $('#load_more_button').hide();
                      if (type != '' && Page==1) {
                            $('#if_record_exists').hide();
                      }
                }else if (data == "select_college") {
                    $('#load_more_results_msg').html("<div class='alert alert-danger'>Please select a college to view leads.</div>");
                    $('#load_more_button').hide();
                    $('#load_more_button').html("Load More Leads");
                     if (type != '') {
                            $('#if_record_exists').hide();
                     }
                }else {
                    if (type == 'reset') {
                        $('#load_more_results').html("");
                    }
                    data = data.replace("<head/>", '');
                    //console.log(data);
                    $('#load_more_results').append(data);
                    //alert($('#items_no_show_chosen > a > span').html());
                    var ttl = $('#tot_records').html().split(' ');
                    if(parseInt(ttl[1]) <=  parseInt($('#items_no_show_chosen > a > span').html())){
                        $('#load_more_button').html("Load More Leads");
                        $('#load_more_button').hide();
                    }else{
                        $('#load_more_button').removeAttr("disabled");
                        $('#load_more_button').html("Load More Leads");
                    }

                    if (type != '') {
                        $('#if_record_exists').fadeIn();
                    }
//                    $.material.init();
                    table_fix_rowcol();
                }
                //console.log(data);

                //$("#load_more_results").tableHeadFixer({"left": 1});
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

        return false;
    }

    function leadCsvDownload() {

        var $form = $("#FilterLeadForm");
        $form.attr("action",'/leads/ajax-lists');
        $form.append($("<input>").attr({"value":"export", "name":"export",'type':"hidden","id":"export"}));
        var onsubmit_attr = $form.attr("onsubmit");
        $form.removeAttr("onsubmit");
        $form.submit();
        $form.attr("onsubmit",onsubmit_attr);
        return false;
    }

$(document).on( 'click', '.dropdown-menu', function (e){
    e.stopPropagation();
});



    function LoadOwl(){
        if($("#owl-demo").length>0){
         $("#owl-demo").owlCarousel({
            autoPlay: 3000,
            items : 5,
            itemsDesktop : [1199,3],
            itemsDesktopSmall : [979,3],
            navigation:true,
            pagination:false,
            navigationText: [
          "<i class='fa fa-chevron-left'></i>",
          "<i class='fa fa-chevron-right'></i>"
          ],
            stopOnHover : true
          });
        $(".flip").click(function(){
            $(".slide-content").slideToggle("slow");
        });
        }
    }

// My code //
$(document).ready(function() {
      LoadOwl();

 });
// //

function ResetFilterValue(){
    $('#filter_elements_html').find('input[type="text"]').each(function(){
       $(this).val('');
    });
    $('#filter_elements_html').find('select').each(function(){
       this.selected = false;
       $(this).val('');
       $(this).trigger("chosen:updated");
    });

    $('#FilterLeadForm select#college_id').val('');
    $('#FilterLeadForm select#college_id').trigger("chosen:updated");

    $('#FilterLeadForm select#form_id').val('');
    $('#FilterLeadForm select#form_id').trigger("chosen:updated");

    $('#FilterLeadForm #search_common').val('');
     $('#load_more_results').html('<tbody><tr><td><div class="col-md-12"><br><div class="alert alert-danger">Please select a college to view leads.</div></div></td></tr><tr></tr></tbody>');
    $('#if_record_exists').hide();
    $('#load_more_results_msg').html("");
    $('#load_more_button').hide();
    $('#load_slider_data').html("");
    $('#view_by').val("");
    return false;
}


function filterColumnOptionsCollege(college_id,form_id){
    if(typeof form_id == 'undefined'){
        form_id = 0;
    }

    //When form will change from drodown menu then check if stage name is already exist. If exist then remove
    var getLiValue=$("#column_li_list li > label").find('input[data-label_name="Stage Name"]');
    if(getLiValue.val()!='undefined') {
        getLiValue.closest('li').remove();
    }

    $.ajax({
        url: '/leads/filter-column-options-college',
        type: 'post',
        dataType: 'json',
        data: {'college_id':college_id,'form_id':form_id},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (json) {
//            console.log(json);

            if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                window.location.href= json['redirect'];
            }
            else if (typeof json['status'] != 'undefined' && json['status'] == 200) {
               $("#filter_li_list").append(json['filter']);
               $("#column_li_list").append(json['column']);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    return false;
}


function GetChildByMachineKey(key,ContainerId,Choose,college_id,isRegistrationSection,appendNotAvailable){
    var labelMappingArray = {'City' : 'city_id','State':'state_id','Specialisation':'specialization_id','Specialization':'specialization_id','District' : 'district_id'};

    var newFIeldId = underscoreToCamelCase(ContainerId);
    if($("#"+ContainerId).length==0){
        if($("#"+newFIeldId).length > 0){
            ContainerId = newFIeldId;
        }
    }

    if(typeof ContainerId !== "undefined" && $("#"+ContainerId).length){
        var cf = '';
        $("#"+ContainerId+' option[value!=""]').remove();

        //Unset static dependent dropdown option Value List
        resetStaticDependentValue(ContainerId, Choose, labelMappingArray);

        if(typeof college_id == 'undefined'){
            var college_id = 0;
        }

        /**************** For Registration Related Dependent Dropdown Code Start Here *********************/
        var isRegistration = false;
        if(typeof isRegistrationSection !== 'undefined' && isRegistrationSection == true) {
           isRegistration = true;
        }
        cf = 'lm-user-profile-back';

        //Blank All dropdown Value of Dependent Field
        var getLastValue = 0;
        if(typeof jsVars.dependentDropdownFieldList !== 'undefined') {
            $(jsVars.dependentDropdownFieldList).each(function(key,fieldId){

                //if getLastValue > 0 then return from here
                if(getLastValue >0) {
                    return false;
                }
                var isFieldFound = 0;
                $.each(fieldId, function(childKey,childFieldId){

                    //if field match then increase the counter and store the increament value into getLastValue variable
                    if(childFieldId == ContainerId) {
                        isFieldFound++;
                        getLastValue = isFieldFound;
                    }
                    if(isFieldFound > 0) {
                        if($('#'+childFieldId).length) {
                            var labelname = (typeof $("#"+childFieldId).data('label') !== 'undefined') ? $("#"+childFieldId).data('label') : '';
                            var defaultOption ='<option value="">'+labelname+'</option>';

                            if(typeof appendNotAvailable !== 'undefined' && appendNotAvailable == true && labelname !== '') {
                                //For <Label> Not Available
                                if($.inArray(childFieldId,['CourseId','SpecializationId']) >= 0){
                                    var notAvailableLabel = '';
                                    switch(childFieldId) {
                                        case 'CourseId':
                                            notAvailableLabel = 'Course';
                                            break;
                                        case 'SpecializationId':
                                            notAvailableLabel = 'Specialisation';
                                            break;
                                    }
                                    defaultOption += '<option value="0">' + notAvailableLabel + jsVars.notAvailableText +' </option>';
                                }
                            }
                            $("#"+childFieldId).html(defaultOption);
                        }
                    }
                });
            });
        }

        if ($('.chosen-select').length > 0){
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
            $('.chosen-select').trigger('chosen:updated');
        }
        /**************** For Registration Related Dependent Dropdown Code End Here *********************/

        if(typeof key !== "undefined" && key !== '')
        {
            $.ajax({
                url: '/common/GetChildByMachineKeyForRegistration',
                type: 'post',
                dataType: 'json',
                data: {key:key,college_id:college_id,'cf':cf},
    //            headers: {
    //                "X-CSRF-Token": jsVars._csrfToken
    //            },
                success: function (json) {
                    if(json['redirect']){
                        location = json['redirect'];
                    }
                    if(json['error']){
                        alertPopup(json['error'],'error');
                    }
                    else if(json['success']){
                        if(typeof jsVars.fieldLabelMapping['city_id'] == 'undefined'){
                            jsVars.fieldLabelMapping['city_id'] = 'City';
                            jsVars.fieldLabelMapping['district_id'] = 'District';
                            jsVars.fieldLabelMapping['specialization_id'] = 'Specialization';
                            jsVars.fieldLabelMapping['state_id'] = 'State';
                            jsVars.notAvailableText = 'Not Available';
                        }
                        if($.inArray(Choose,['State','City','DistrictId','Specialization']) >= 0  && $('#ShowEditMode').length > 0){
                            var html = '<option value="">Registered '+jsVars.fieldLabelMapping[labelMappingArray[Choose]]+'</option>';
                        }else{
                            if(typeof $("#"+ContainerId).data('label') !== 'undefined') {
                                var html = '<option value="">'+$("#"+ContainerId).data('label')+'</option>';
                            } else {
                                var html = '<option value="">Registered '+Choose+'</option>';
                            }
                        }
                        if((Choose == 'District'))
                        {
                            if($('#DistrictId').length > 0)
                                $('#DistrictId').html('<option value="">Registered '+jsVars.fieldLabelMapping['district_id']+'</option>');
                            if($('#CityId').length > 0)
                                $('#CityId').html('<option value="">Registered '+jsVars.fieldLabelMapping['city_id']+'</option>');
                        }
                        if((Choose == 'State') && ($('#CityId').length > 0))
                        {
                            var cityHtml = '<option value="">Choose '+jsVars.fieldLabelMapping['city_id']+'</option>';
                            if($('#ShowEditMode').length > 0){
                               cityHtml += '<option value="0">'+jsVars.fieldLabelMapping['city_id']+jsVars.notAvailableText+' </option>';
                            }
                            $('#CityId').html(cityHtml);
                        }
                        if($.inArray(Choose,['State','City','DistrictId','Specialization']) >= 0  && $('#ShowEditMode').length > 0){
                            html += '<option value="0">'+jsVars.fieldLabelMapping[labelMappingArray[Choose]]+jsVars.notAvailableText+'</option>';
                        }

                        var skipColonField = ['CourseId','SpecialisationId'];
                        if($.inArray(ContainerId,skipColonField) >= 0 && $('#ShowEditMode').length > 0 &&
                           typeof appendNotAvailable !== 'undefined') {
                            if((typeof Choose == 'undefined' || Choose == '')  && typeof $("#"+ContainerId).data('label') !== 'undefined') {
                                Choose = $("#"+ContainerId).data('label');
                            }
                            html += '<option value="0"> '+Choose+jsVars.notAvailableText+'</option>';
                        }

                        if(json['list'].length != 0) {
                            for(var key in json['list'])
                            {
                                optionvalue = key;
                                if(isRegistration && ($.inArray(ContainerId,skipColonField) < 0)) {
                                    optionvalue = key+';;;'+json['list'][key];
                                }
                                html += '<option value="'+optionvalue+'">'+json['list'][key]+'</option>';
                            }
                        }

                        $('#'+ContainerId).html(html);

                        //If result not return
                        if(json['list'].length == 0 && typeof $("#"+ContainerId).data('label') !== 'undefined'){
                            var defaultOption ='<option value="">'+$("#"+ContainerId).data('label')+'</option>';
                            $("#"+ContainerId).html(defaultOption);
                        }

                        $('.chosen-select').chosen();
                        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                        $('.chosen-select').trigger('chosen:updated');
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        }
    }
    else
    {

        if((Choose === 'City') && $('#ShowEditMode #CityId').length > 0){
            $('#CityId').html('<option value="">Registered City</option>');
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.chosen-select').trigger('chosen:updated');
        }
        if((Choose === 'State') && ($('#ShowEditMode #StateId').length > 0)){
            $('#StateId').html('<option value="">Registered State</option>');
            $('#CityId').html('<option value="">Registered City</option>');
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.chosen-select').trigger('chosen:updated');
        }
        if((Choose === 'Specialization') && ($('#ShowEditMode #SpecializationId').length > 0)){
            $('#SpecializationId').html('<option value="">Registered Specialization</option>');
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.chosen-select').trigger('chosen:updated');
        }

        if(key != '') {
            var col_class = 3;
            var total_filter = $('input[name="filter_create_keys[]"]:checked').length;
            if(total_filter<4){
                col_class = parseInt(12/total_filter);
            }

            var InputObjectId = $('#'+ContainerId).data('key_source');
            console.log(InputObjectId);
            if($('#'+InputObjectId).length>0 && typeof $('#'+InputObjectId).val() !== 'undefined'){
                $('#'+ContainerId).parents('div.col-md-3').remove();
                var elem = $('#'+InputObjectId);
                createInput(elem,col_class);
            }
        }

    }
    return false;
}

function labelPrintingSendAction(){

    $('#listloader').show();

    var display_popup = false;
    $('input:checkbox[name="selected_users[]"]').each(function () {
        if(this.checked){
            display_popup = true;
        }
    });
    var select_all = $('#select_all:checked').val();
    if(display_popup || select_all == 'select_all'){
        // display bulk action popup
        $('#labelPrintingSendAction').modal();
        $.ajax({
        url: '/leads/label-printing-send',
        data: $('#FilterLeadForm').serializeArray(),
        dataType: "json",
        type: "POST",
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if (typeof json['redirect'] != 'undefined' && json['redirect'] != "") {
                window.location.href= json['redirect'];
            }
            else if (typeof json['status'] != 'undefined' && json['status'] == 200) {

                jQuery('#labelPrintingSendContainer').html(json['html']);



                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
                $('.chosen-select').trigger('chosen:updated');
            }
        },
        error: function (response) {
            alertPopup(response.responseText);
        },
        failure: function (response) {
            alertPopup(response.responseText);
        }
    });
    $('#listloader').hide();

    }else{
        $('#listloader').hide();
        alertPopup('Please select User','error');
    }
    return false;
}

function labelDownloadPrint(type){

    $('#disperror').remove();
    var template_id = $('#print_template_id').val();
    if(typeof template_id !='undefined' && template_id>0){

        var $form = $("#FilterLeadForm");



        var action = $form.attr("action");
        $form.attr("action",'/leads/label-download-print');
        $form.append($("<input>").attr({"value":type, "name":"print_download",'type':"hidden","id":"print_download"}));
        $form.append($("<input>").attr({"value":template_id, "name":"template_id",'type':"hidden","id":"template_id"}));


        //Count How many checkbox is checked
        var total_checkbox=$('input:checkbox[name="selected_users[]"]:checked').length;

        //Check if radio button is checked
        var is_checkbox_selected=$('input[name="select_all"]:checked').length;
        if(type=='print' || (total_checkbox<=24 && is_checkbox_selected==0)){
            $form.attr("target",'newblank');
        }else{
            $form.attr("target",'label_iframe');
        }

        /* Old Code
        if(type=='print'){
            $form.attr("target",'newblank');
        }else{
            $form.attr("target",'label_iframe');
        */

        var onsubmit_attr = $form.attr("onsubmit");
        $form.removeAttr("onsubmit");
        $form.submit();
        $form.attr("onsubmit",onsubmit_attr);
        $form.attr("action",action);
    }else{
        var html = '<div id="disperror" class="alert alert-danger">Please Select Template</div>';
        jQuery('#labelPrintingSendContainer').append(html);

    }
    return false;
}

function SuccessLabelPopup(){
   $("#labelPrintingSendAction .npf-close").trigger( "click" );
    alertPopup('Request Successfully submitted');
    return false;
}


$(document).on('change', '#VoucherSearchArea input,#VoucherSearchArea select',function() {
    $('#load_more_results').html('<tbody><tr><td><div class="col-md-12"><br><div class="alert alert-danger">Please click on search to view leads.</div></div></td></tr><tr></tr></tbody>');
    $('#if_record_exists').hide();
    $('#load_more_button').hide();
    $('#load_more_results_msg').hide();
});

$(document).on('change','#filter_li_list li input[type="checkbox"]', function (){
    if($(this).is(':checked')){
        var input_id = '';
        if(typeof $(this).data('input_id') !='undefined'){
            input_id = $(this).data('input_id');
        }

        if(input_id =='source_value' || input_id =='medium_value' || input_id =='name_value'){
            var sci = $('input[type="checkbox"][data-input_id="show_campaigns_in"]').prop('checked',true);
        }
        if(input_id =='ebs_status'){
            var sci = $('input[type="checkbox"][data-input_id="ebs_test_no"]').prop('checked',true);
        }

        if(input_id =='ebs_test_no'){
            var sci = $('input[type="checkbox"][data-input_id="ebs_status"]').prop('checked',true);
        }
    }else{

        var isCheck          = false;
        var isCheckEbsStatus = false;
        var isCheckEbsNo     = false;
        $('#filter_li_list li input[type="checkbox"]:checked').each(function(){
            var input_id = '';
            if(typeof $(this).data('input_id') !='undefined'){
                input_id = $(this).data('input_id');
            }
            if(input_id =='source_value' || input_id =='medium_value' || input_id =='name_value'){
                isCheck = true;
            }

            if(input_id =='ebs_status'){
                isCheckEbsStatus = true;
            }

            if(input_id =='ebs_test_no'){
                isCheckEbsNo = true;
            }
        });
        if(!isCheck){
            $('input[type="checkbox"][data-input_id="show_campaigns_in"]').prop('checked',false);
        }

        if(!isCheckEbsStatus){
            $('input[type="checkbox"][data-input_id="ebs_test_no"]').prop('checked',false);
        }

        if(!isCheckEbsNo){
            $('input[type="checkbox"][data-input_id="ebs_status"]').prop('checked',false);
        }
    }
});

$(document).on('change','#FilterLeadForm select#source_value', function (){
    if($('#medium_value').length>0){
       LoadMediumLeads(this.value);
       LoadCampaignLeads();
    }
});

$(document).on('change','#FilterLeadForm select#medium_value', function (){
    if($('#name_value').length>0){
       LoadCampaignLeads(this.value);
    }
});


function LoadMediumLeads(source){

    var college_id = $('#college_id').val();
    $.ajax({
        url: '/campaigns/get-medium-values',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {'source':source,'college_id':college_id,'placeholder':'Campaign Medium'},//'source='+source+'&college_id='+college_id,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            data = data.replace("<head/>", '');
          //console.log(data);
          //return false;
            if (data == "session_logout") {
                window.location.reload(true);
            }else if (data == "select_college" || data == "error") {
                $('#medium_value').html("");
            }else {
                if(data!=""){
                    $('#medium_value').html(data);
//                    $('#name_value').html("");
                }
            }
            $('select').trigger("chosen:updated");
//            $.material.init();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

function LoadCampaignLeads(medium){

        if(typeof medium == 'undefined'){
            medium ='';
        }

        var source = 0;
        if($('#source_value').length>0){
            source=$('#source_value').val();
        }
        var college_id=$('#college_id').val();

        $.ajax({
            url: '/campaigns/get-campaign-values',
            type: 'post',
            dataType: 'html',
            //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
            data: {'source':source,'medium':medium,'college_id':college_id,'placeholder':'Campaign Name'},
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                data = data.replace("<head/>", '');
              //console.log(data);
              //return false;
                if (data == "session_logout") {
                    window.location.reload(true);
                }else if (data == "select_college" || data == "error") {
                   $('#name_value').html("");
                }else {
                    if(data!=""){

                        $('#name_value').html(data);
                    }
                }
                $('select').trigger("chosen:updated");
//                $.material.init();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        return false;
}
/**
 *
 * @param {type} data encoded value
 * @returns {html}
 */
 function viewhistory(data){
         $.ajax({
            url: '/leads/get-payment-history',
            type: 'post',
            dataType: 'html',
            data: {data:data},
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (data) {
                if(data=='session_logout'){
                    window.location.reload(true);
                }else if(data == 'permision_denied'){
                    window.location.href= '/permissions/error';
                }
                $('#mainData').html(data);
                $("#ChangeStatusBtn").trigger('click');
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
/**
 * ajax request to check if overwrite option is enable or not
 * call by '/leads/csv-leads' for bulk upload leads
 * @param {int} college_id
 * @returns {Boolean}
 */

function getAllowOverwrite(val){

    /* first remove options */
    $("#upload_type option[value='overwite']").remove();
    $.ajax({
        url: '/leads/get-allow-overwrite',
        type: 'post',
        dataType: 'json',
        data: {college_id:val},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if(typeof json['redirect'] !='undefined' && json['redirect']!=''){
                window.location.href= json['redirect'];
            }else if(typeof json['success'] != 'undefined' && json['success'] ==200){
                /* assign option to select */
                $('select#upload_type').html(json['do_not_allow_overwrite']);
                /* trigger chosen select js */
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
                $('.chosen-select').trigger('chosen:updated');
            }else {
                /* if error display popup */
                alertPopup(json['error'],'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    /* trigger chosen select js */
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
    $('.chosen-select').trigger('chosen:updated');
    return false;
}

function pushApplication(){
//    $('#listloader').show();

    var display_popup = false;
    $('input:checkbox[name="selected_users[]"]').each(function () {
        if(this.checked){
            display_popup = true;
        }
    });
    var select_all = $('#select_all:checked').val();
    if(display_popup || select_all == 'select_all'){
        var total_count = $('#tot_records').text();
        var data = $('#FilterLeadForm').serializeArray();
        data.push({name: "total_count", value: total_count});
        $.ajax({
            url: '/leads/pushApplications',
            type: 'post',
            dataType: 'json',
            data: data,
    //        async: false,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            beforeSend: function () {
                $('div.loader-block-lead-list').show();
            },
            success: function (json) {
                $('div.loader-block-lead-list').hide();
               if(typeof json['redirect'] != 'undefined' && json['redirect']!=''){
                   window.location = json['redirect'];
               }else if(typeof json['errors'] != 'undefined' && json['error']!=''){
                   alertPopup(json['errors'],'error');
               }else if(typeof json['success'] != 'undefined' && json['success']==200){
                   alertPopup('Successfully moved','success');
               }else{
                   alertPopup('Error!','error');
               }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }else{
        $('#listloader').hide();
        alertPopup('Please select User','error');
    }
    return false;
}


function LoadMoreLeadsView(type) {
        $('#push_application').hide();
        if (type == 'reset') {
            Page = 0;
            $('#load_more_results').html("");
            $('#load_more_results_msg').html("");
            $('#load_more_results_msg').show("");
            $('#load_more_button').show();
            $('#adv_column').val("");
            $('#adv_value').val("");
            $('#load_slider_data').html("");
            $('#load_more_button').html("Loading...");
            $('#view_by').val('');
            $('button[name="search_btn"]').attr('disabled','disabled');
            // if offline and payment pending is selected then show pushApplication button
            if(parseInt($('#form_id').val())>0 && $('[name="filter[ap|payment_method]"]').val()=='Offline' && $('[name="filter[status]"]').val()=='4'){
                $('#push_application').show();
            }

            //$('.chosen-select').chosen();
            //$('.chosen-select-deselect').chosen({allow_single_deselect: true});
        }
        else if (type == 'adv_filter') {
            Page = 0;
            $('#load_more_results').html("");
            $('#load_more_results_msg').html("");
            $('#load_more_results_msg').show("");
            $('#load_more_button').show();
            $('#load_more_button').html("Loading...");
        }

        $('#export').remove();

        //show/hide upload single lead btn
        if($('#CreateLeadStartBtn').length > 0)
        {
            $('#CreateLeadStartBtn').hide();
            if(($('#college_id').val() > 0) && ($('#form_id').val() > 0))
            {
                $('#CreateLeadStartBtn').show();
            }
        }

        var data = $('#FilterLeadForm').serializeArray();
        data.push({name: "page", value: Page});
        $('#load_more_button').attr("disabled", "disabled");
        $('#load_more_button').html("Loading...");
        $.ajax({
            url: '/leads/ajax-lists-view',
            type: 'post',
            dataType: 'html',
            //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
            data: data,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                $('button[name="search_btn"]').removeAttr('disabled');
                Page = Page + 1;
                if (data == "session_logout") {
                    window.location.href= '/colleges/login';
                }
                else if (data == "error") {
                    if(Page==1)error_html="No Records found";
                    else error_html="No More Record";
                    $('#load_more_results_msg').append("<div class='alert alert-danger'>"+error_html+"</div>");
                    $('#load_more_button').html("Load More Leads");
                    $('#load_more_button').hide();
                      if (type != '' && Page==1) {
                            $('#if_record_exists').hide();
                      }
                }else if (data == "select_college") {
                    $('#load_more_results_msg').html("<div class='alert alert-danger'>Please select a college to view leads1.</div>");
                    $('#load_more_button').hide();
                    $('#load_more_button').html("Load More Leads");
                     if (type != '') {
                            $('#if_record_exists').hide();
                     }
                }else {
                    data = data.replace("<head/>", '');
//                    console.log(data);
                    $('#load_more_results').append(data);
                    $('#load_more_button').removeAttr("disabled");
                    $('#load_more_button').html("Load More Leads");
                    if (type != '') {
                        $('#if_record_exists').fadeIn();
                    }
//                    $.material.init();
                    table_fix_rowcol();
                }
                //console.log(data);

                //$("#load_more_results").tableHeadFixer({"left": 1});
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

        return false;
    }

//In Lead list when form will select from the filter select dropdown then dynamically set the form id in hiddenFormId hidden input
$(document).on('click','#FilterLeadForm #single_lead_add, #CreateLeadStartBtn', function (){
    if ($.trim($('#form_id').val())>0 && $.trim($('#college_id').val())>0) {
        $('#hiddenCollegeId').val($.trim($('#college_id').val()));
        $('#hiddenFormId').val($.trim($('#form_id').val()));
        $.ajax({
            url: '/common/getCountryDialCode',
            type: 'post',
            dataType: 'html',
            data: {'form_id':$.trim($('#form_id').val()),'college_id':$.trim($('#college_id').val())},
            async: false,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            beforeSend: function () {
                $('div.loader-block-lead-list').show();
            },
            success: function (data) {
                $('div.loader-block-lead-list').hide();
                var response=data.split("||");
                if($.trim(response[0]) != '') {
                    $('#ul_dial_code').html(response[0]);
                    $('#ShowHidePhone').html('');
                    $('#showWithDialCode').html('<div class="input-group"><div class="input-group-btn bs-dropdown-to-select-group"><button type="button" class="btn btn-default dropdown-toggle as-is bs-dropdown-to-select" data-toggle="dropdown"><span data-bind="bs-drp-sel-label">+91</span><input name="country_dial_code" data-bind="bs-drp-sel-value" value="+91" type="hidden"><span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button><div class="dropdown-menu"><input name="filter" class="search_box_code" onkeyup="javascript:filterDialCode()" id="filter_dial_code" type="text"><ul class="dropdown-menu-list" role="menu" id="ul_dial_code"><li data-value="+33">France  (+33)</li><li data-value="+49">Germany  (+49)</li><li data-value="+55">Brazil  (+55)</li><li data-value="+61">Australia  (+61)</li><li data-value="+81">Japan  (+81)</li><li data-value="+86">China  (+86)</li><li data-value="+880">Bangladesh  (+880)</li><li data-value="+91">India  (+91)</li><li data-value="+93">Afghanistan  (+93)</li></ul></div></div><div class="form-group label-floating is-empty"><label class="control-label Mobile" for="Mobile">Mobile Number <span class="required">*</span></label><input name="mobile" id="Mobile" autocomplete="false" maxlength="10" class="form-control" onkeypress="return isNumber(event)" type="text"><span class="help-block"></span><span class="material-input"></span></div></div>');
                } else {
                    //$('#ul_dial_code').html(response[0]);
                    $('#showWithDialCode').html('');
                    $('#ShowHidePhone').html('<div class="form-group label-floating is-empty"><label class="control-label Mobile" for="Mobile">Mobile Number <span class="required">*</span></label><input name="mobile" id="Mobile" autocomplete="false" maxlength="10" class="form-control" onkeypress="return isNumber(event)" type="text"><span class="help-block"></span><span class="material-input"></span></div>');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

    return false;
    }
});

//For Dropdown Menu Country Dial Code
$(document).ready(function(e){
    $( document ).on( 'click', '.bs-dropdown-to-select-group .dropdown-menu-list li', function( event ) {
    	var $target = $( event.currentTarget );
		$target.closest('.bs-dropdown-to-select-group')
			.find('[data-bind="bs-drp-sel-value"]').val($target.attr('data-value'))
			.end()
			.children('.dropdown-toggle').dropdown('toggle');
		$target.closest('.bs-dropdown-to-select-group')
                //.find('[data-bind="bs-drp-sel-label"]').text($target.context.textContent);
    		.find('[data-bind="bs-drp-sel-label"]').text($target.attr('data-value'));

                var fieldId = 'Mobile';
                if(typeof $target.attr('data-dynamicFieldName') !== 'undefined') {
                    fieldId = $target.attr('data-dynamicFieldName');
                }
                    //Bydefault remove the value when value will change
                    if($('#'+fieldId).length) {
                        $('#'+fieldId).val('');
                    }
                    if($("span.verifyMobileButton").length)
                    {
                        $('span.verifyMobileButton #getOtpButton, #showOTPVerified').hide();
                    }

                    //For change Maxlength value of Mobile Input Box as per selection of country code
                    if ($target.attr('data-value') == '+91') {
                        if($('#'+fieldId).length) {
                            $('#'+fieldId).attr('maxlength',10);
                        }
                    } else {
                        if($('#'+fieldId).length) {
                            $('#'+fieldId).attr('maxlength',16);
                        }
                    }


                //When Select the option from dropdown then close the open dropdown
                $target.closest('.bs-dropdown-to-select-group').removeClass('open');

		return false;
	});
});

// this function is used when there is mobile dial country code is selected in form applicant
function filterDialCode() {
    var value = $('#filter_dial_code').val();
    value = value.toLowerCase();
    $("#ul_dial_code > li").each(function() {
        if ($(this).text().toLowerCase().search(value) > -1) {
//            $(this).text(src_str);
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });
}
/**
 *
 * @param {string} json_encode data
 * @returns null
 */
function AddUserToWildCardTable(data,type){
    $("#add_remove_user_wild_card_list").hide();//hide message
    var postData='';
    var loadPopup=0;
    if(typeof type !='undefined' && type=='add'){ //When add user to list function will fire
        var postData = $('#addWildCardUserForm').serialize();
    } else { //When display the popup
        jQuery('#showAddToListContainer').html('loading...');
        postData={data:data};
        loadPopup=1;

        //Blank These Field
        $('#wildcard_user_id').val('');
        $('#wildcard_college_id').val('');
        $('#wildcard_form_id').val('');

        var html = '<option value="" selected="selected">Select List</option>';
        $('#menu_id').html(html);
        $('#menu_id').trigger("chosen:updated");

        $("#add_remove_user_wild_card_list").removeClass("alert alert-success");
        $("#add_remove_user_wild_card_list").html("");
    }
    $.ajax({
       url: '/reports/add-remove-user-wild-card-list',
       type: 'post',
       dataType: 'json',
       data: postData,
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       success: function (json) {
           if((typeof json['session_error'] !='undefined' && json['session_error']=='session_logout') ||
              (typeof json['token_error'] !='undefined' && json['token_error']=='token_error')){
               window.location.reload(true);
           } /*else if(json == 'permision_denied'){
               window.location.href= '/permissions/error';
           } */

           if(loadPopup==1) {
               if(json['data'] != '') {
                            $('#wildcard_user_id').val(json['data']['user_id']);
                            $('#wildcard_college_id').val(json['data']['college_id']);
                            $('#wildcard_form_id').val(json['data']['form_id']);
                            var html='';
                            if (json['data']['menuList'] !='') {
                                var html = '<option value="" selected="selected">Select List</option>';
                                obj_json = (json['data']['menuList']);
                                for (var key in obj_json) {
                                    html += '<option value="' + key + '">' + obj_json[key] + '</option>';
                                }
                                $('#menu_id').html(html);
                                $('#menu_id').trigger("chosen:updated");
                            }
                        }
                $('#showAddToListPopUp').trigger('click');
           }


           //Display Error
           $('.show_err').html('');
           if(typeof json['error'] !='undefined'){
                for (var i in json['error']) {
                    $('#'+i+'_error').html(json['error'][i]).addClass('error');
                }
            }

             if(typeof json['data_update'] !='undefined' && json['data_update']=='update'){
                 //$('#ConfirmPopupArea').modal('hide');
                $("#add_remove_user_wild_card_list").show();
                $("#add_remove_user_wild_card_list").addClass("alert alert-success").html("User successfully add to Wildcard List");

                //After successful update blank these dropdown value
                $('#menu_id').val("");
                $('#menu_id').trigger("chosen:updated");

                $('#list_id').val("");
                $('#list_id').trigger("chosen:updated");

                //Call this function so it will load the result
                 LoadMoreLeadsNew('reset');
             }
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}

function getAllCustomMenuListByCollegeId(){
    var data = $('#addWildCardUserForm').serializeArray();
    $.ajax({
        url: '/reports/getListNameByCollegeAndType',
        data: data,
        type: "POST",
        dataType: 'json',
        async:false,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {

            if ((typeof json['redirect'] != 'undefined' && json['redirect'] != "") ||
                 (typeof json['token_error'] != 'undefined' && json['token_error'] != "")) {
                window.location.href= json['redirect'];
            }
            else if (typeof json['status'] != 'undefined' && json['status'] == 200) {
                $('#list_id').html(json['data']);
                $('#list_id').trigger("chosen:updated");
            }
        },
        error: function (response) {
            alertPopup(response.responseText);
        },
        failure: function (response) {
            alertPopup(response.responseText);
        }
    });
    return false;

}

function hitPopupBatchBind(){

        $('.modalButton').on('click', function(e) {
        var $form = $("#FilterLeadForm");
        $form.attr("action",'/leads/ajax-lists');
        $form.attr("target",'modalIframe');
        $form.append($("<input>").attr({"value":"export", "name":"export",'type':"hidden","id":"export"}));
        var onsubmit_attr = $form.attr("onsubmit");
        $form.removeAttr("onsubmit");
        $form.submit();
        $form.attr("onsubmit",onsubmit_attr);
        $form.removeAttr("target");
    });
    $('#myModal').on('hidden.bs.modal', function(){
        $("#modalIframe").html("");
        $("#modalIframe").attr("src", "");
    });


}


/**
 *
 * @param {string} json_encode data
 * @returns null
 */
function updateLeadStatus(data,type){
    $("#update_lead_status").hide();//hide message
    var postData='';
    var loadPopup=0;
    if(typeof type !='undefined' && type=='save'){ //When add user to list function will fire
        $('#saveBtn').attr('disabled','disabled').html('Please Wait..');
        var postData = $('#updateLeadStatusForm').serialize();
    } else { //When display the popup
        $('#saveBtn').css('background-color','').removeAttr('disabled');
        jQuery('#updateLeadStatusContainer').html('loading...');
        postData={data:data};
        loadPopup=1;

        //Blank These Field
        $('#lead_status_user_id').val('');
        $('#lead_status_college_id').val('');
        $('#lead_status_form_id').val('');

        var html = '<option value="" selected="selected">Select Lead Stage</option>';
        $('#lead_stage').html(html);
        $('#lead_stage').trigger("chosen:updated");

        $('#lead_remark').val('');
        $("#update_lead_status").removeClass("alert alert-success");
        $("#update_lead_status").html("");
    }

    $.ajax({
       url: '/leads/update-lead-status',  //add-remove-user-wild-card-list
       type: 'post',
       dataType: 'json',
       data: postData,
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       success: function (json) {
           if((typeof json['session_error'] !='undefined' && json['session_error']=='session_logout') ||
              (typeof json['token_error'] !='undefined' && json['token_error']=='token_error')){
               window.location.reload(true);
           } else if(typeof json['college_error'] !='undefined' && json['college_error']==1) {
               window.location=jsVars.FULL_URL;
           }

           if(loadPopup==1) {
               if(typeof json['data'] !='undefined' && json['data'] != '') {
                            $('#lead_status_user_id').val(json['data']['user_id']);
                            $('#lead_status_college_id').val(json['data']['college_id']);
                            $('#lead_status_form_id').val(json['data']['form_id']);
                            var html='';
                            if (json['data']['categoryList'] !='') {
                                var html = '<option value="" selected="selected">Select Lead Status</option>';
                                obj_json = (json['data']['categoryList']);
                                for (var key in obj_json) {
                                    html += '<option value="' + key + '">' + obj_json[key] + '</option>';
                                }

                                $('#lead_stage').html(html);

                                //Pre Selected Last updated Value
                                $('#lead_stage').val(json['data']['lead_stage']);

                                $('#lead_stage').trigger("chosen:updated");
                            }


                        }
                $('#showUpdateLeadStatusPopUp').trigger('click');
           }


           //Display Error
           $('.show_err').html('');
           if(typeof json['error'] !='undefined'){
                for (var i in json['error']) {
                    $('#'+i+'_error').html(json['error'][i]).addClass('error');
                }
            }

             if(typeof json['data_update'] !='undefined' && json['data_update']=='update'){
                 //$('#ConfirmPopupArea').modal('hide');
                $("#update_lead_status").show();
                $("#update_lead_status").addClass("alert alert-success").html("Lead Stage saves successfully.");
                $('#saveBtn').css('background-color','#ddd').html('Save');
             }


             //Show Data in Tabular Form
             //Initially set this div to blank
             $('#show_remarks').html('');
             if(typeof json['data'] !='undefined'){
                 if(typeof json['data']['remarks_data'] !='undefined' && $.trim(json['data']['remarks_data'])!=''){
                    var remarks_html='';
                    for (var i in json['data']['remarks_data']) {
                        remarks_html+='<tr><td>'+(json['data']['remarks_data'][i]['remarks'])+'</td></tr>';
                   }
                   $('#show_remarks').html(remarks_html);
                }
             }

       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}

//date field popup handeling
if($(".registration-date").length){
    $(".registration-date").each(function(){
        var dateFormat  = $(this).data("format");
        var startDate   = $(this).data("startdate");
        var endDate     = $(this).data("enddate");
        if(dateFormat=='DD/MM/YYYY'){
            $(this).datepicker({startView : 'decade', format : 'dd/mm/yyyy', enableYearToMonth: true, enableMonthToDay : true,startDate: startDate,endDate:endDate});
        }else if(dateFormat=="MM/YYYY"){
            $(this).datepicker({startView : 'decade', format : 'mm/yyyy', minViewMode: "months",startDate: startDate,endDate:endDate});
        }else if(dateFormat=="YYYY"){
            $(this).datepicker({startView : 'decade', format : 'yyyy', minViewMode: "years", startDate: String(startDate), endDate:String(endDate)});
        }
    });
}


function submitFormLeadSetting(){
    if($("#collegeId").val()===""){
        $('#listingContainerSettingSection').html('<div class="aligner-middle"><div class="text-center text-info font16"><span class="lineicon-43 alignerIcon"></span><br><span id="load_msg">Please select institute to view fields.</span></div></div>');
        return;
    }
    $('#seacrhList').addClass('pointer-none');
    $("#leadUploadSetting").submit();
}

function saveLeadSettings(){
    var data = $("#leadUploadSettingsave").serializeArray();
    $.ajax({
        url: '/college-settings/saveleadsetting',
        type: 'post',
        dataType: 'json',
        data: data,
        async: false,
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if(typeof json['status'] !='undefined' && json['status']==200){
                $("#leadUploadSetting").submit();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function resetStaticDependentValue(currentId, Choose, labelMappingArray){
    var html = '';

    if($.inArray(Choose,['State','City','DistrictId','Specialization']) >= 0  && $('#ShowEditMode').length > 0){
        html += '<option value="">Registered '+jsVars.fieldLabelMapping[labelMappingArray[Choose]]+'</option>';
        html += '<option value="0">'+jsVars.fieldLabelMapping[labelMappingArray[Choose]]+jsVars.notAvailableText+'</option>';
    }

    switch(currentId) {
        case 'DistrictId':
            $('#DistrictId').html(html);

            if($('#CityId').length) {
                $('#CityId option[value!=""]').remove();
            }
            break;
        case 'StateId':

            $('#StateId').html(html);

            if($('#CityId').length) {
                $('#CityId option[value!=""]').remove();
            }
            break;
        case 'CityId':
            $('#CityId').html(html);
            break;
        case 'SpecializationId':
            $('#SpecializationId').html(html);
            break;
    }


}

const toTitleCase = (phrase) => {
  return phrase
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

function underscoreToCamelCase(string){
    var phrase = string.replace(/_/g,' ',string);
    var result = toTitleCase(phrase);
    var resultContainerId = result.replace(/\s/g,'',result);
    return resultContainerId;
}