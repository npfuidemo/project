/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * Created By:Rohit Shrotriya
 * Dated  :26 April 2017
 * This function for call ctp load for custom list
 * 
 * @param string data 
 * @return 
 */
function listBuilderCtp(ctpdata, selectedData) {
    //default error message blank
    $(".error_custom_list").html('');
    $("#error_college_id").html("");
    $("#error_form_id").html("");
    $("#finalCreationSubmitBtn").show();//show submit button all case
    var callctp = '';
    var form_id=$("#form_id").val();
    //check college select or not
    if($("#college_id").length>0 && $("#college_id").val()==""){
       $("#error_college_id").show();
       $("#error_college_id").html("Please select college name");
       return false;
    }
    //case of List Builder upload List
    if (ctpdata == 'upload') {
        $("#finalCreationSubmitBtn").hide();//submit button hide only upload case
        $("#loadBuildCriteria").html('');
        callctp = 'upload_list';
    }
    //case of List Builder Build Criteria
    if (ctpdata == 'build') {
        $("#CreateCustomListForm").attr("target",'');
        $("#CreateCustomListForm").attr("role",'');
        $("#finalCreationSubmitBtn").attr("data-target",'');
        $("#loadUpdateList").html('');
        callctp = 'build_criteria';
    }

    if(selectedData == '') {
        var alldata = $('#CreateCustomListForm').serializeArray();
        alldata.push({name: "callctp", value: callctp});
        alldata.push({name: "counter", value: 1});
        alldata.push({name: "showtype", value: 1});
        alldata.push({name: "startloop", value: 1});
        alldata.push({name: "form_id", value: form_id[0]});
    } else {
        selectedData.callctp = callctp;
        alldata = selectedData;
    }
   

    $.ajax({
        url: '/reports/list-builder-ctp',
        type: 'post',
        dataType: 'html',
        data: alldata,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if (data == "session_logout") {
                window.location.reload(true);
            }
            if (ctpdata == 'upload') {
                $('#loadUpdateList').html(data);
                $('select').trigger("chosen:updated");
            } else if (ctpdata == 'build') {
                $("#loadBuildCriteria").html(data);
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
                // do not show only if one row 
                if($('.row-count').length == 1) {
                    $('.row-condition').hide();
                }
                if($('.row-count').length == 5) {
                    $('.add-more').hide();
                }
            } else {
                console.log("error");
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
  }
/**
 * Created By:Rohit Shrotriya
 * Dated  :26 April 2017
 * This function for post custom list
 */
$(document).on('click', '#csvCreationSubmitBtn', function (e) {
    e.preventDefault();
    var file_data = $("#csv_file").prop("files")[0];   // Getting the properties of file from file field
    var alldata = new FormData();    // Creating object of FormData class
    var college_id =$("#college_id").val();//college id
    var form_id =$("#form_id").val();//form id
    var update_data=$("#updateDataIdInput").val();//update data value
    if($.trim(form_id) =='' || typeof form_id  === "undefined"){//form value check
        $("#error_form_id").show();
        $("#error_form_id").html("Please select form name");
        return false;
    }
    var builder =$("#builder").val();//get list builder value
    var list_type =$("#list_type").val();//get Listing Type value update or standard
    alldata.append("csv_file", file_data); //file detail             
    alldata.append("college_id", college_id); 
    alldata.append("form_id", form_id);
    alldata.append("builder", builder);
    alldata.append("list_type", list_type);
    alldata.append("update_data", update_data);
      //console.log(alldata);
    $.ajax({
        url: '/reports/ajax-read-csv',
        type: 'post',
        //dataType: 'script',
        cache: false,
        contentType: false,
        processData: false,
        data: alldata,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (obj) {
            if (obj == "session_logout") {
                window.location.reload(true);
            }
            $("#loadDisableFields").html(obj);
            $('loader-block').hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    
    return false;
});

function  removeFromFormula(i){
    var rowContainer = ".row-"+i+" ";
    $(rowContainer + '.summary_textarea span:last').remove();
    var final_calc_text="";
    var calc_text=$(rowContainer+'.summary_textarea span');
    var separator = "";
    $(calc_text).each(function( index ) {
        final_calc_text+=separator+$( this ).attr("data-all");
        separator = ';;;';
    });
    $('#rowtextarea_'+i).val(final_calc_text);
}

function appendToFormula(item,type,i){
    var rowContainer = ".row-"+i+" ";
    if(type=="operators"){
        $(rowContainer + '.summary_textarea').append("<span data-all='operator||"+item+"'>"+item+"</span>");
    }
    else{
        txt=$(rowContainer +"select.select_fields_for_calc option[value="+item.value+"]").text();
        $(rowContainer + '.summary_textarea').append("<span data-all='field||"+item.value+"'>"+txt+"</span>");
        $(rowContainer + 'select.select_fields_for_calc').val('');
    }
    
    if($(rowContainer+'.summary_textarea span').length >= 1) {
        final_calc_text="";
        calc_text=$(rowContainer+'.summary_textarea span');
        $(calc_text).each(function( index ) {
            if(final_calc_text=="")
                final_calc_text+=$( this ).attr("data-all");
            else 
                final_calc_text+=";;;"+$( this ).attr("data-all");
        });
        $('#rowtextarea_'+i).val(final_calc_text);
    }
}

function removeRowCalc(i){
    if(confirm("Are you sure you want to remove?")){
        $('.row-'+i).remove();
        if(($('.row-count').length < 5) && ($('.row-count').length >= 2)) {
            $('.add-more').show();
        } else if($('.row-count').length < 2) {
            $('.row-condition').hide();
        }
    }
}

function addRowCalc(i){
    if($('.row-count').length < 5) {
        var alldata = $('#CreateCustomListForm').serializeArray();
        var counter = parseInt($("#counter_data").val());
        var form_id=$("#form_id").val();
        $.ajax({
            url: '/reports/list-builder-ctp',
            type: 'post',
            dataType: 'html',
            data: {
                "callctp": "build_criteria",
                "data": alldata,
                "counter": (counter+1),
                "showtype":'0',
                "startloop":(counter+1),
                "form_id":form_id[0]
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                if($('.row-count').length == 0) {
                    $('input[name="counter"]').val((counter+1));
                    $(".add-more").before(data);
                } else {
                    $('input[name="counter"]').val((counter+1));
                    $(".row-count:last").after(data);
                    if($('.row-count').length == 5) {
                        $('.add-more').hide();
                    }
                    if($('.row-count').length > 1) {
                        $('.row-condition').show();
                    }
                }
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

function reportsLoadForms(value, default_val,multiselect) {
    $('#listing_field_id').empty();
    $("#error_college_id").html('');
    $('#CreateCustomListForm input[name="builder"]').prop('checked', false);
    if(typeof multiselect =='undefined'){
        multiselect = '';
    }
    $.ajax({
        url: '/reports/reports-load-forms',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "college_id": value,
            "default_val": default_val,
            "multiselect":multiselect
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if(data=="session_logout"){
                window.location.reload(true);
            }
            $('#form_id').html(data);
            $('select').trigger("chosen:updated");
        }
    });
    $('select').trigger("chosen:updated");
}

/**
 * This function will load data
 * @param (string) load_type
 * @returns array Data
 */
function loadMoreData(load_type,list_type) {
    
    //Check whether college is select or not
    if ($.trim($('#s_college_id').val())=='') {
        $('#load_more_results_msg').html("<div class='alert alert-danger'>Please select a college to view results.</div>");
        $('#load_more_button').hide();
        $('#load_more_button').html("Load More Data");
        if (load_type != '') {
               $('#if_record_exists').hide();
        }
        return false;
    }
    
    if (load_type == 'reset') {
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
        //$('.chosen-select').chosen();
        //$('.chosen-select-deselect').chosen({allow_single_deselect: true});
    }
    
    $('#export').remove();


    var data = $('#FilterCustomModuleForm').serializeArray();
    data.push({name: "page", value: Page});
    data.push({name: "list_type", value: list_type});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $.ajax({
        url: '/reports/ajax-list-custom-module',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('button[name="search_btn"]').removeAttr('disabled');
            Page = Page + 1;
            if (data == "session_logout" || data =='token_mismatch' || data =='empty_list' || data =='permission_error') {
                window.location.reload(true);
            } else if (data == "error") {
                if(Page==1) {
                    error_html="No Records found";
                } else {
                    error_html="No More Record";
                }
                
                $('#load_more_results_msg').append("<div class='alert alert-danger'>"+error_html+"</div>");
                $('#load_more_button').html("Load More Data");
                $('#load_more_button').hide();
                  if (load_type != '' && Page==1) {
                        $('#if_record_exists').hide();
                  }
            }else if (data == "select_college") {
                $('#load_more_results_msg').html("<div class='alert alert-danger'>Please select a college to view results.</div>");
                $('#load_more_button').hide();
                $('#load_more_button').html("Load More Data");
                 if (load_type != '') {
                        $('#if_record_exists').hide();
                 }
            }else {
                if (load_type == 'reset') {
                    $('#load_more_results').html("");
                }
                data = data.replace("<head/>", '');
                //console.log(data);
                $('#load_more_results').append(data);
                
                
                var ttl = $('#tot_records').html().split(' '); 
                //alert(parseInt(ttl[1])+'==='+parseInt($('#items_no_show_chosen > a > span').html()));
                if(parseInt(ttl[1]) <=  parseInt($('#items_no_show_chosen > a > span').html())){
                    $('#load_more_button').html("Load More Data");
                    $('#load_more_button').hide();
                }else{
                    $('#load_more_button').removeAttr("disabled");
                    $('#load_more_button').html("Load More Data");
                } 

                if (load_type != '') {
                    $('#if_record_exists').fadeIn();
                }
                //$.material.init();
                //table_fix_rowcol();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}
/*
 * create options into select list by form id or default case
 */
function reportsFormsFieldsLoad(selected_value) {
    if (typeof selected_value == 'undefined') {
        selected_value='';
    }
        
    var form_id_list = $('#CreateCustomListForm select#form_id').val();
    if(form_id_list == null) {
        return false;
    }
    var list_type = $('#CreateCustomListForm select#list_type').val();
    
    if($('.update-msg').length) {
        $('.update-msg').remove();
    }

    var college_id = $('#college_id').val();
    if(form_id_list.length > 1 && (!jsVars.manipal_mahe_college_id.includes(parseInt(college_id)))) {
        var msg = '<div class="update-msg message successalert animated fadeInUp">Update listing can not use with multiple forms.</div>';
        $('#list_type').parent().append(msg);
    }
    
    if (form_id_list == null || list_type == null) {
        return false;
    }
    
    $("#error_form_id").html('');
    if($('#list_type').val()== 'generate') {
        // if checked standard listing
        $('#CreateCustomListForm input[name="builder"]').prop('checked', false);//reset radio button List Builder
    }  else {
        // checked update listing
        // for listing fields
        var $el = $('#listing_field_id');
        $el.empty();
        //For Filter Fields
        var $filterEm = $('#filter_field_id');
        $filterEm.empty();
    }
    $("#loadUpdateList").html('');
    $("#loadBuildCriteria").html('');    
    
    //If more than 1 form is selected then call below function
    // var college_id = $('#college_id').val();
    if(form_id_list.length > 1 && (!jsVars.manipal_mahe_college_id.includes(parseInt(college_id)))) {
        $('#list_type').val('generate');
        listTypeForms('generate');
        var list_type = $('#CreateCustomListForm select#list_type').val();
    }
    
    //Ajax call will hit when form is selected and Listing Type is Standard
    if (list_type != 'generate' ) { 
        return false;
    }
        
    $.ajax({
        url: '/reports/getFormFieldsForCustomList',
        type: 'post',
        dataType: 'html',
        data: {'form_id':form_id_list,'college_id':college_id,'selected_value':selected_value},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if(data =='session_logout') {
                window.location.href=jsVars.FULL_URL;   
            } else if(data =='token_error') {
                window.location.href=jsVars.FULL_URL;   
            } else {
                var data= JSON.parse(data);
                if(data['html_options_columns'] !='') {                    
                    $('#listing_field_id').html(data['html_options_columns']);
                    $('#listing_field_id').trigger("chosen:updated");
                    
                    $('#filter_field_id').html(data['html_options_fiter']);
                    $('#filter_field_id').trigger("chosen:updated");
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;

}
/**
 * Created By:Rohit Shrotriya
 * Dated  :30 April 2017
 * This function use show and hide data on listing type select
 * 
 * @param string data 
 * @return 
 */
function listTypeForms(list_type) {
    $("#finalCreationSubmitBtn").show();//disable submit button show
    $("#CreateCustomListForm").attr("target",'');
    $("#CreateCustomListForm").attr("role",'');
    $("#finalCreationSubmitBtn").attr("data-target",'');
    //$('#CreateCustomListForm input[name="builder"]').prop('checked', false);//reset radio button List Builder
    $("#loadUpdateList").html('');
    $("#loadBuildCriteria").html('');
    if(list_type =='update'){
        $(".standard_listing").hide();
        $(".update_listing").show();
        $(".standard_listing select").val("");
        
        $("#standard_listing_filter_column").hide();
        $("#standard_listing_filter_column select").val("");
        
        $("#standard_sort_filter").hide();
        $("#no_of_records").val("");
    }else if(list_type == 'generate'){
        $(".update_listing").hide();
        $(".standard_listing").show();
        $(".update_listing select").val("");
        $("#standard_listing_filter_column").show();
        
        $("#standard_sort_filter").show();
    } else {
        // hide all field when list type if blank selected
        $('#list_type').val('');
        $('#CreateCustomListForm input[name="builder"]').prop('checked', false);
        $(".standard_listing").hide();
        $(".standard_listing select").val("");
        $("#standard_listing_filter_column").hide();
        $("#standard_listing_filter_column select").val("");
        
        $(".update_listing").hide();
        $(".update_listing select").val("");
    }
    $('select').trigger("chosen:updated");
};

/**
 * Created By:Rohit Shrotriya
 * Dated  :2 May 2017
 * This function use for only csv file upload update data not selected
 * 
 * @param string data 
 * @return 
 */
function updateData(){
    $("#csv_file").val('');
 }
$(document).ready(function (){
    if($('#CreateCustomListForm select#form_id').val() == null) { // list type hide if form is not choose.
        $('#list_type').parent().parent().hide();
    }
    var get_custom_id= $("#get_custom_id").val();//edit case only standard list
    $(".update_listing").hide();
    $(".standard_listing").hide();
    $("#standard_listing_filter_column").hide();
    $("#standard_sort_filter").hide();
    if(typeof get_custom_id != 'undefined' && $.trim(get_custom_id) && get_custom_id !=''){
        $(".standard_listing").show();
        $("#standard_listing_filter_column").show();
        $("#standard_sort_filter").show();
    }
    
    $(document).on('change','#CreateCustomListForm select#list_type', function (){
        $('.error').hide();
       listTypeForms(this.value);
       
       //call Ajax function if form is selected and list type is standard
       reportsFormsFieldsLoad(); 
    });
    $(document).on('click','#CreateCustomListForm input[name="builder"]', function (){
       listBuilderCtp(this.value, '');
    });
    
    $(document).on('change','#CreateCustomListForm select#form_id', function (){
       reportsFormsFieldsLoad();
       if($('#CreateCustomListForm select#form_id').val() == null) { // list type hide if form is not choose.
           $('#list_type').parent().parent().hide();
           listTypeForms('');
       } else {
           $('#list_type').parent().parent().show(); // // list type show if form is choose.
       }
    });
    
    $(document).on('change','#CreateCustomListForm select#updateDataIdInput', function (){
       updateData();
    });
    
    //For Set Value Dynamically
    $(document).on('change','#CreateCustomListForm select#listing_field_id', function (){
        var selectedValue = $('#CreateCustomListForm select#sort_field').val();
        $('#CreateCustomListForm select#sort_field').empty();
        setSortOrderData($(this).chosen().val(),'#CreateCustomListForm select#listing_field_id','sort_field', selectedValue);       
    });
    
    if($("#list_type").length) {
        listTypeForms($("#list_type").val());
    }

    //Disable enter key press
    $('#requestIDsearch').keypress(function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
        }
    });    
});


//Dynamically add option in Dropdown and update choosen
function setSortOrderData(value, tag_id, choosen_field_id, selected_val) {
    if ((typeof value == 'undefined' || $(value) == '') ||
            (typeof tag_id == 'undefined' || $(tag_id) == '') ||
            (typeof choosen_field_id == 'undefined' || $(choosen_field_id) == '')) {
        return false;
    }

    var $el = $('#' + choosen_field_id);
    if (value == null) {
        $el.empty();
        $el.append($("<option>Select field</option>").attr("value", ""));
        $('#' + choosen_field_id).val(selected_val).trigger("chosen:updated");
        return false;
    }
    
    var total_form = value.length;
    if (total_form > 0) {
        for (var i = 0; i <= total_form; i++) {
            $el.append($("<option></option>").attr("value", value[i]).text($(tag_id + " option[value='" + value[i] + "']").text()));
        }
        $('#' + choosen_field_id).trigger("chosen:updated");
        $('#' + choosen_field_id).val(selected_val).trigger("chosen:updated");
        //Set Select value
        if (typeof selected_val == 'undefined' || $.trim(selected_val) != '') {
            $('#' + choosen_field_id).val(selected_val).trigger("chosen:updated");
        }
    }
    return false;
}




function calculateRowCalc(i) {
    var alldata =[];
    var form_id=$("#form_id").val();
    alldata.push({name: "form_id", value: form_id});
    alldata.push({name: "formula", value: $('.row-'+i+' #rowtextarea_'+i).val()});
    $.ajax({
        url: '/reports/calculateBuildCriteria',
        type: 'post',
        dataType: 'html',
        data: alldata,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            if (data == "session_logout") {
                window.location.reload(true);
            }
            $('.row-'+i+' .response-msg').remove();
            if (data == 'success') {
                $('.row-'+i+' .calculate-msg').parent().prepend('<span class="response-msg" style="color:green">Successfully calculated.   </span>');
            } else {
                $('.row-'+i+' .calculate-msg').parent().prepend('<span class="response-msg" style="color:red">'+data+'   </span>');
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function buildCriteriacreateInput(currentObj, i){

    var element = $(currentObj).find('option:selected');
    var labelname = $(element).text();
    var InputId = 'var InputId' //$(currentObj).attr('id');
    var key_source = $(currentObj).data('key_source');
    var value_field = element.attr("data-value");
    var arr = value_field.split("||");
    var html = '';
    var type = "";
    var class_date = '';
    var field_name = 'select_value[]';
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
            if ('UD|state_id' == html_field_id) {
                html = "<select data-key_source=" + InputId + " onchange = 'return GetChildByMachineKey(this.value,\"registerCityID\",\"City\");' class='chosen-select' name='" + field_name + "' id='" + html_field_id + "'>";
            } else if ('s_lead_status' == html_field_id) {
                html = "<select data-key_source=" + InputId + " multiple='multiple' class='form-control' name='" + field_name + "' id='" + html_field_id + "' data-placeholder='Select lead status' placeholder='Select lead status'>";
                sls = true;
            } else {
                html = "<select data-key_source=" + InputId + " class='chosen-select' name='" + field_name + "' id='" + html_field_id + "'>";
            }

            if ('s_lead_status' != html_field_id && 'show_campaigns_in' != html_field_id) {
                html += '<option value="">' + labelname + '</option>';
            }

            obj_json = JSON.parse(val_json);
            for (var key in obj_json) {
                if(type == "predefined_dropdown") {
                    var prfixDropdownKey = key + ';;;' + obj_json[key];
                } else {
                    var prfixDropdownKey = key;
                }
                var prfixDropdownVal = obj_json[key];
                html += "<option value=\"" + prfixDropdownKey + "\">" + prfixDropdownVal + "</option>";
            }
            html += "</select>";
        } else if (type == "date") {

            var operator_sel = $(currentObj).val();
            class_date = "datepicker_report";
            html = "<input type='text' data-key_source=" + InputId + "  class='form-control " + class_date + "' name='" + field_name + "' value='' placeholder='" + labelname + "' id='" + html_field_id + "'>";

        } else {
            html = "<input type='text' data-key_source=" + InputId + "  class='form-control' name='" + field_name + "' value='' placeholder='" + labelname + "' id='" + html_field_id + "'>";
        }
    } else {
        html = "<input type='text' data-key_source=" + InputId + " class='form-control' name='" + field_name + "' value='' placeholder='" + labelname + "'>";
    }
    
    var multi_class = '';
    if (sls) {
        multi_class = 'multiSelectBox';
    }
    $('.criteria-calculate-field-' + i).html(html);
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});

    if (type == "date") {
        LoadReportDatepicker();
        LoadReportDateRangepicker();
    }
    
    if (sls) {
        $('#s_lead_status').multiselect({
            numberDisplayed: 2
        });
    }
}

function setSearchButtonType(search_type){
    $('#search_type').val(search_type);
}

function loadMoreListDataView(type) {
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
        $('#tot_records').html('');
        $('#downloadCSVBtn').hide();
    }
    else if (type == 'adv_filter') {
        Page = 0;
        $('#load_more_results').html("");
        $('#load_more_results_msg').html("");
        $('#load_more_results_msg').show("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
    }
    
    var data = $('#FilterCustomModuleDetail').serializeArray();
    data.push({name: "page", value: Page});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $.ajax({
        url: jsVars.listDataViewURL,
        type: 'post',
        dataType: 'html',
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
                $('#load_more_button').html("Load More Data");
                $('#load_more_button').hide();
                  if (type != '' && Page==1) {
                        $('#if_record_exists').hide();
                  }
            } else {
                if (type == 'reset') {
                    $('#load_more_results').html("");
                }
                data = data.replace("<head/>", '');
                //console.log(data);
                $('#load_more_results').append(data);
                
                //If This is the first time result is load means first page then display the Download CSV Button
                if(Page==1) {
                    $('#downloadCSVBtn').show();
                }
                 /*$('#load_more_button').show();
                 $('#load_more_button').removeAttr("disabled");
                 $('#load_more_button').html("Load More Data");
                 */
                 var ttl = $('#tot_records').html().split(' '); 
                 if(parseInt(ttl[1]) <=  jsVars.maxRecordShow){
                    $('#load_more_button').html("Load More Data");
                    $('#load_more_button').hide();
                 }else{
                    $('#load_more_button').removeAttr("disabled");
                    $('#load_more_button').html("Load More Data");
                 }
                    
                if (type != '') {
                    $('#if_record_exists').fadeIn();
                }
//                $.material.init();
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

//For Reset Filter
function ResetFilterValue(){
    $('#viewSearchArea').find('input[type="text"]').each(function(){
       $(this).val('');
    });
    $('#viewSearchArea').find('select').each(function(){
       this.selected = false;
       $(this).val('');
       $(this).trigger("chosen:updated");
    });
    
    $('#load_more_results').html('<tbody><tr><td><div class="col-md-12"><br><div class="alert alert-danger">Please click on search button to view data.</div></div></td></tr><tr></tr></tbody>');
    $('#if_record_exists').hide();
    $('#load_more_results_msg').html("");
    $('#load_more_button').hide();
    return false;
}

/**
 * This function will move user to custom list wildcard user Table
 * @param {string} id
 * @returns {null}
 */
function moveUserToWildCard(data,el){
    //$('div .container > h2').text()
    $('#ConfirmMsgBody').html('Are you sure to remove this user from the list?');
    $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmYes', function (e) {
        e.preventDefault();
            $.ajax({
                    url: '/reports/addRemoveUserWildCardList',
                    type: 'post',
                    dataType: 'json',
                    data: {
                        "data": data
                    },
                    headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                    success: function (json) {
                        if((typeof json['session_error'] !='undefined' && json['session_error']=='session_logout') || 
                            (typeof json['token_error'] !='undefined' && json['token_error']=='token_error')){
                                 window.location.reload(true);
                        } else if(typeof json['data_update'] !='undefined' && json['data_update']=='update'){
                            alertPopup('User removed successfully from this list.');
                            $(el).parents("tr").remove();
                            //Set Page to 0 and load the result
                            Page = 0;
                            loadMoreListDataView('reset');
                        }
                    }
                });
         $('#ConfirmPopupArea').modal('hide');
    });
}

//For Delete List Name
function DeleteListNameConfirmation(ListId,linkObj) {
    var ListName = $(linkObj).parents('tr').find('td:first').text();
    $('#ConfirmAlertPopUpTextArea').text('');
    $('#ConfirmAlertPopUpTextArea').append('Do you want to delete list name <br/>\''+ListName+'\' and all its wildcard user?');
    $('#ConfirmAlertYesBtn').attr('onclick','DeleteListName(\''+ListId+'\');');
    $('#ConfirmAlertPopUpButton').trigger('click');
}

function DeleteListName(ListId) {
    $.ajax({
        url: '/reports/delete-list-name',
        type: 'post',
        dataType: 'json',
        async:false,
        data: {list_id:ListId,action:'delete'},
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (json) {
            if(json['redirect'])
            {
                location = json['redirect'];
            }
            
            if(json['error'])
            {
                $('#ErrorPopupArea p#ErrorMsgBody').text(json['error']);
                $('#ErrorLink').trigger('click');
            }
            else if(json['success'])
            {
                $('#SuccessPopupArea p#MsgBody').text(json['msg']);
                $('#SuccessLink').trigger('click');
                $('#SuccessPopupArea').removeAttr('tabindex');
                $('#SuccessPopupArea a#OkBtn').show();
                $('#SuccessPopupArea .npf-close,#SuccessPopupArea  .oktick').hide();
                $('#SuccessPopupArea a#OkBtn').attr('href',window.location.href);
            }
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/**
 * Created By:Rohit Shrotriya
 * Dated  :15 May 2017
 * This function use check duplicate csv mapping values
 * 
 * @param post 
 * @return boolean
 */
 function dublicateValuesCheck(){
        var dpval=0;
        $.ajax({
            url: '/reports/dublicate-values-check',
            type: 'post',
            async: false,
            dataType: 'html',
            data: $("#CreateCustomListForm").serialize(),
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (data) {
                if (data == "session_logout") {
                    window.location.reload(true);
                }else{
                    dpval= data;
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        return dpval;
    }
    
    /**
    * Created By:Rohit Shrotriya
    * Dated  :15 May 2017
    * This function use for check csv mapping blank values 
    * 
    * @param post 
    * @return boolean
    */ 
    function csvMapBlankValValidation(){
       $(".fields_map_error_msg").html('');//error msg blank
       $("#finalCreationSubmitBtn").hide();//submit buttton hide
       validateMapping();
       $('.select_form_fields_div').on('change', function(){
           // form fields blank value check
           validateMapping();
       });
    }

    function validateMapping(){
        var msg='';
        var arr = $('select.select_form_fields_div').map(function(){
               if(this.value == "")
                   return this.value
          }).get()
           if(arr.length==0){
               $(".fields_map_error_msg").html('');
               if(dublicateValuesCheck() ==1){
               
                //add batch process popup
                $("#CreateCustomListForm").attr("target",'modalIframe');
                $("#CreateCustomListForm").attr("role",'form');
                $("#finalCreationSubmitBtn").attr("data-target",'#myModal');
                //end add batch process popup
                 $("#finalCreationSubmitBtn").show(); //submit buttton show
                }else{
                    msg='Duplicate field map';
                    $(".fields_map_error_msg").html(msg);//duplicate error msg 
                    $("#finalCreationSubmitBtn").hide(); //submit buttton hide  
                }
           }else{
              msg="All form fields are Mandatory";
              $(".fields_map_error_msg").html(msg);//error msg blank
              $("#finalCreationSubmitBtn").hide(); //submit buttton hide 
           }
    }

    function countResult(html) {
    var len = (html.match(/listDataRow/g) || []).length;
    return len;
    }
    // dropdownMenuPlacement with body
function dropdownMenuPlacement(){
	// hold onto the drop down menu                                             
    var dropdownMenu;
    // and when you show it, move it to the body                                     
    $('.ellipsis-left').on('show.bs.dropdown', function (e) {

                        // grab the menu        
                        dropdownMenu = $(e.target).find('.dropdown-menu');
                        dropHeight = dropdownMenu.outerHeight() - 50;

                        // detach it and append it to the body
                        $('body').append(dropdownMenu.detach());

                        // grab the new offset position
                        var eOffset = $(e.target).offset();
						var offsetDropPos = eOffset.top - dropHeight;
                        // make sure to place it where it would normally go (this could be improved)
                        dropdownMenu.css({
                                'display': 'block',
                                //'top': eOffset.top + $(e.target).outerHeight(),
                                'top': (offsetDropPos < 0) ? 0 : offsetDropPos,
                                'left': eOffset.left - 135
                        });
    });
    // and when you hide it, reattach the drop down, and hide it normally                                                   
        $('.ellipsis-left').on('hide.bs.dropdown', function (e) {
            $(e.target).append(dropdownMenu.detach());
                dropdownMenu.hide();
        });
}

function LoadCustomUploadDetails(listingType){
    if(listingType === 'reset'){
        $("#page").val(1);
    }
    $.ajax({
        url: '/reports/customUploadUserDetails',
        type: 'post',
        data: $('#filterOfflineUploadForm input,#filterOfflineUploadForm select'),
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
             $('#uploadCustomLoader.loader-block').show();
        },
        complete: function () {
             $('#uploadCustomLoader.loader-block').hide();
        },
        success: function (html) {
            $('.offCanvasModal').modal('hide');
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
                $('#LoadMoreArea').hide();
            }else{
                var countRecord = countResult(html);
                console.log(countRecord);
                html    = html.replace("<head/>", "");
                if(listingType === 'reset'){
                   $("#tableViewContainer").show();
                   $('#tableViewContainer').html(html);
                   $('#load_more_results_table').hide();
                   $('#load_no_record_msgs').hide();
                }else{
                   $('#tableViewContainer').find("tbody").append(html);
                }
                if(countRecord >= 10){
                    $('#load_more_button').show();
                }
                if(countRecord == '0' && listingType==='loadmore'){
                    $('#load_more_button').hide();
                    $('#load_no_record_msgs').show();
                    $('#load_no_record_msgs').html("<p class=' text-danger text-center fw-500 mt-10'>No More Record</p>"); 
                }else if(countRecord == '0' && listingType==='reset'){
                    $('#load_more_results_table').show();
                    $('#load_no_record_msgs').hide();
                    $("#tableViewContainer").hide();
                    $('#load_more_button').hide();
                    $('#table_data').hide();
                    error_html = "No Record found";
                    $('#load_more_results_table').html('<tbody><tr><td><div class="no-record-list"><div class="noDataFoundDiv"><div class="innerHtml"><img src="/img/no-record.png" alt="no-record"><span>'+ error_html +'</span></div></div></div></td></tr><tr></tr></tbody>');
                }
                $("#page").val(parseInt($("#page").val())+1);
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
};
 
function importCustomErrorLog(type,custom_id){
    if(type){
        var college_id = $("#college_id").val();
        $.ajax({
            url: '/reports/import-custom-list-error-log',
            type: 'post',
            data: {s_college_id: college_id,custom_id:custom_id,type:type},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json)
            {
                if (json['redirect'])
                    location = json['redirect'];
                else if (json['error'])
                    alertPopup(json['error'], 'error');
                else if (json['status'] == 200) {
                    var downloadUrl = json['downloadUrl'];
                    if(downloadUrl!=='' && downloadUrl !==null){
                       downloadCustomFile(downloadUrl);
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
}
var downloadCustomFile = function(url){
    window.open(url, "_self");
};

